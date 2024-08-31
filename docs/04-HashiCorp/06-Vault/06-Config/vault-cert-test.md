---
description: Vault 사설 인증서 관리 테스트
tag: ["vault", "AWS", "k8s", "helm"]
author: gbkim
---


# **Vault 사설 인증서 관리 테스트** 
- [사전 준비 사항](#vault인증서-사전준비사항) 
- [1. Vault 사설 인증서 만들기](#vault인증서-1.vault사설인증서만들기) 
  - [1.1 환경 변수 설정](#vault인증서-1.1환경변수설정) 
    - [1.1.1 Kubernetes에서 서명할 키 생성](#vault인증서-1.1.1kubernetes에서서명할키생성)
    - [1.1.2 인증서 서명 요청(CSR)을 생성](#vault인증서-1.1.2인증서서명요청\(csr\)을생성)
    - [1.1.3 CSR을 생성](#vault인증서-1.1.3csr을생성)
    - [1.1.4 csr.yaml 생성](#vault인증서-1.1.4csr.yaml생성)
    - [1.1.5 csr.yaml 배포](#vault인증서-1.1.5csr.yaml배포)
    - [1.1.6 CSR을 승인 요청](#vault인증서-1.1.6csr을승인요청)
    - [1.1.7 승인 상태 확인](#vault인증서-1.1.7승인상태확인)
- [2. 키, 인증서 및 Kubernetes CA를 Kubernetes secret 저장](#vault인증서-2.키,인증서및kubernetesca를kubernetessecret저장) 
  - [2.1 crt 파일 생성](#vault인증서-2.1crt파일생성)
  - [2.2 쿠버네티스 ca 설정 파일](#vault인증서-2.2쿠버네티스ca설정파일)
  - [2.3 key, crt, ca 인증서 시크릿 생성](#vault인증서-2.3key,crt,ca인증서시크릿생성)
- [3. Vault tls 인증서 적용](#vault인증서-3.vaulttls인증서적용) 
  - [3.1 helm values.yaml 파일](#vault인증서-3.1helmvalues.yaml파일)
  - [3.2 AWS NLB를 통해 접근 인증서 확인](#vault인증서-3.2awsnlb를통해접근인증서확인)
  - [3.3 ACM 인증서를 통해 접근](#vault인증서-3.3acm인증서를통해접근) 
    - [3.3.1 Route53 설정](#vault인증서-3.3.1route53설정)
    - [3.3.2 레코드 생성](#vault인증서-3.3.2레코드생성)
    - [3.3.3 레코드 설정](#vault인증서-3.3.3레코드설정)
    - [3.3.4 AWS 인증서를 통해 Vault UI 접근](#vault인증서-3.3.4aws인증서를통해vaultui접근)
- [4. AWS Private Ca를 사용 하는 인증서 생성](#vault인증서-4.awsprivateca를사용하는인증서생성) 
  - [4.1 사전 준비 요건](#vault인증서-4.1사전준비요건)
  - [4.2 ACM 인증서 생성](#vault인증서-4.2acm인증서생성)
- [5. AWS Private Ca 기반으로 생성 된 인증서를 Vault에 적용](#vault인증서-5.awsprivateca기반으로생성된인증서를vault에적용)
- [결론](#vault인증서-결론)
  - [진행 방식](#vault인증서-진행방식)
  - [대안](#vault인증서-대안)

# <a name="vault인증서-사전준비사항"></a>**사전 준비 사항**
- k8s 환경
  - NLB 설치
  - AWS ENS CSI Driver
  - AWS Load Balancer Controller
- Vault 라이선스
```
touch vault.hclic => vault 라이센스 내용 첨부

vaultsecret=$(cat vault.hclic)

kubectl create secret generic vault-ent-license --from-literal="license=${vaultsecret}"
```
- eks 자격증명 secret 생성
```
kubectl create secret generic eks-creds \
    --from-literal=AWS_ACCESS_KEY_ID="[AWS_ACCESS_KEY_ID]" \
    --from-literal=AWS_SECRET_ACCESS_KEY="[AWS_SECRET_ACCESS_KEY]"
```
- helm 설치 및 vault repo add

```
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh

curl -L https://git.io/get_helm.sh | bash -s -- --version v3.8.2


helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo list
```

::: danger
- AWS Private CA 요금  
참조: https://aws.amazon.com/ko/private-ca/pricing/
:::


# <a name="vault인증서-1.vault사설인증서만들기"></a>**1. Vault 사설 인증서 만들기**
## <a name="vault인증서-1.1환경변수설정"></a>**1.1 환경 변수 설정**
```
# SERVICE is the name of the Vault service in Kubernetes.
export SERVICE=vault

# NAMESPACE where the Vault service is running.
export NAMESPACE=default

# SECRET_NAME to create in the Kubernetes secrets store.
export SECRET_NAME=vault-tls

# TMPDIR is a temporary working directory.
export TMPDIR=/home/ec2-user/tls-vault

# certificate request
export CSR_NAME=vault-csr

```
### <a name="vault인증서-1.1.1kubernetes에서서명할키생성"></a>**1.1.1 Kubernetes에서 서명할 키 생성**
```
openssl genrsa -out ${TMPDIR}/vault.key 2048
```

### <a name="vault인증서-1.1.2인증서서명요청(csr)을생성"></a>**1.1.2 인증서 서명 요청(CSR)을 생성**
```
cat <<EOF >${TMPDIR}/csr.conf

[req]
default_bits = 2048
prompt = no
encrypt_key = yes
default_md = sha256
req_extensions = v3_req
distinguished_name = req_distinguished_name
[req_distinguished_name]
emailAddress = admin@admin.dev
CN = ${SERVICE}.${NAMESPACE}.svc
[ v3_req ]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1 = ${SERVICE}
DNS.2 = ${SERVICE}.${NAMESPACE}
DNS.3 = ${SERVICE}.${NAMESPACE}.svc
DNS.4 = ${SERVICE}.${NAMESPACE}.svc.cluster.local
DNS.5 = \*.vault-internal
IP.1 = 127.0.0.1
EOF
```

### <a name="vault인증서-1.1.3csr을생성"></a>**1.1.3 CSR을 생성**
```
openssl req -config ${TMPDIR}/csr.conf -new -key ${TMPDIR}/vault.key -subj "/CN=${SERVICE}.${NAMESPACE}.svc" -out ${TMPDIR}/server.csr
```
### <a name="vault인증서-1.1.4csr.yaml생성"></a>**1.1.4 csr.yaml 생성**


::: warning
![](./img/3073638458.png?width=760)
:::



```
cat <<EOF >${TMPDIR}/csr.yaml

apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
   name: ${CSR_NAME}
spec:
   groups:
   - system:authenticated
   request: $(cat ${TMPDIR}/server.csr | base64 | tr -d '\n')
   signerName: beta.eks.amazonaws.com/app-serving
   usages:
   - digital signature
   - key encipherment
   - server auth
EOF
```
### <a name="vault인증서-1.1.5csr.yaml배포"></a>**1.1.5 csr.yaml 배포**
```
kubectl create -f ${TMPDIR}/csr.yaml

- 승인(approve)이 되기 전까지 상태는 pending
```
### <a name="vault인증서-1.1.6csr을승인요청"></a>**1.1.6 CSR을 승인 요청**
```
kubectl certificate approve ${CSR_NAME}
```
### <a name="vault인증서-1.1.7승인상태확인"></a>**1.1.7 승인 상태 확인**
![](./img/3073180663.png?width=760)


# <a name="vault인증서-2.키,인증서및kubernetesca를kubernetessecret저장"></a>**2. 키, 인증서 및 Kubernetes CA를 Kubernetes secret 저장**
## <a name="vault인증서-2.1crt파일생성"></a>**2.1 crt 파일 생성**

```
serverCert=$(kubectl get csr ${CSR_NAME} -o jsonpath="{.status.certificate}")

echo "${serverCert}" | openssl base64 -d -A -out ${TMPDIR}/vault.crt
```

## <a name="vault인증서-2.2쿠버네티스ca설정파일"></a>**2.2 쿠버네티스 ca 설정 파일**
```
kubectl config view --raw --minify --flatten -o jsonpath='{.clusters[].cluster.certificate-authority-data}' | base64 -d > ${TMPDIR}/vault.ca
```
## <a name="vault인증서-2.3key,crt,ca인증서시크릿생성"></a>**2.3 key, crt, ca 인증서 시크릿 생성**

```
kubectl create secret generic ${SECRET_NAME} \
   --namespace ${NAMESPACE} \
   --from-file=vault.key=${TMPDIR}/vault.key \
   --from-file=vault.crt=${TMPDIR}/vault.crt \
   --from-file=vault.ca=${TMPDIR}/vault.ca
```

# <a name="vault인증서-3.vaulttls인증서적용"></a>**3. Vault tls 인증서 적용**
## <a name="vault인증서-3.1helmvalues.yaml파일"></a>**3.1 helm values.yaml 파일** 
```
global:

    enabled: true

    tlsDisable: false

server:

    enterpriseLicense:
      secretName: vault-ent-license

    extraVolumes:

    - type: secret

      name: vault-tls

    extraEnvironmentVars:

      VAULT_CACERT: "/vault/userconfig/vault-tls/vault.ca"

      CA_CERT: "/var/run/secrets/kubernetes.io/serviceaccount/ca.crt"

    ha:

      enabled: true
      raft:

        enabled: true

        setNodeId: true

        config: |

          ui = true
          listener "tcp" {

            tls_disable = 0

            address = "[::]:8200"

            cluster_address = "[::]:8201"

            tls_cert_file = "/vault/userconfig/vault-tls/vault.crt"

            tls_key_file  = "/vault/userconfig/vault-tls/vault.key"

            tls_client_ca_file = "/vault/userconfig/vault-tls/vault.ca"

          }

          storage "raft" {

            path = "/vault/data"

            retry_join {

              leader_api_addr = "https://vault-0.vault-internal:8200"

              leader_ca_cert_file = "/vault/userconfig/vault-tls/vault.ca"

              leader_client_cert_file = "/vault/userconfig/vault-tls/vault.crt"

              leader_client_key_file = "/vault/userconfig/vault-tls/vault.key"

            }
            retry_join {

              leader_api_addr = "https://vault-1.vault-internal:8200"

              leader_ca_cert_file = "/vault/userconfig/vault-tls/vault.ca"

              leader_client_cert_file = "/vault/userconfig/vault-tls/vault.crt"
              leader_client_key_file = "/vault/userconfig/vault-tls/vault.key"
            }
            retry_join {
              leader_api_addr = "https://vault-2.vault-internal:8200"
              leader_ca_cert_file = "/vault/userconfig/vault-tls/vault.ca"

              leader_client_cert_file = "/vault/userconfig/vault-tls/vault.crt"

              leader_client_key_file = "/vault/userconfig/vault-tls/vault.key"
            }

            autopilot {

              last_contact_threshold = "200ms"

              last_contact_failure_threshold = "10m"

              max_trailing_logs = 250000

              min_quorum = 5

              server_stabilization_time = "10s"

            }

           }

          seal "awskms" {
             region     = "ap-northeast-2"

             kms_key_id = "{ kms_key_id }"

           }

          service_registration "kubernetes" {}

    image:

      repository: hashicorp/vault-enterprise

      tag: 1.12.1-ent

    env:

    - name: VAULT_CACERT

      value: "/vault/userconfig/vault-tls/vault.ca"

    extraSecretEnvironmentVars:

      - envName: AWS_ACCESS_KEY_ID

        secretName: eks-creds

        secretKey: AWS_ACCESS_KEY_ID

      - envName: AWS_SECRET_ACCESS_KEY

        secretName: eks-creds

        secretKey: AWS_SECRET_ACCESS_KEY

    service:

      enabled: true

      active:

        enabled: false

      standby:

        enabled: false

      type: ClusterIP
      loadBalancerClass: service.k8s.aws/nlb

      annotations:
    dataStorage:
      enabled: true

      storageClass: gp3

      size: 100Gi

    auditStorage:

      enabled: true

      # Size of the PVC created

      size: 100Gi

      # Location where the PVC will be mounted.

      mountPath: "/vault/audit"

      # Name of the storage class to use.  If null it will use the

      # configured default Storage Class.

      storageClass: gp3

      # Access Mode of the storage device being used for the PVC

      accessMode: ReadWriteOnce

      # Annotations to apply to the PVC

      annotations: {}

ui:

    enabled: true

    publishNotReadyAddresses: true

    activeVaultPodOnly: false

    serviceType: "LoadBalancer"

    serviceNodePort: null

    externalPort: 443

    targetPort: 8200

    annotations:

       service.beta.kubernetes.io/aws-load-balancer-ip-address-type: ipv4

       service.beta.kubernetes.io/aws-load-balancer-name: gbkim-vault-test-lb

       service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing

       service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip

       service.beta.kubernetes.io/aws-load-balancer-subnets: { 서브넷 id }

       service.beta.kubernetes.io/aws-load-balancer-type: external

       service.beta.kubernetes.io/aws-load-balancer-ssl-cert: { 인증서 arn }

       service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "443"

       service.beta.kubernetes.io/aws-load-balancer-backend-protocol: ssl
```
## <a name="vault인증서-3.2awsnlb를통해접근인증서확인"></a>**3.2 AWS NLB를 통해 접근 인증서 확인**
![](./img/3073278945.png?width=760)
## <a name="vault인증서-3.3acm인증서를통해접근"></a>**3.3 ACM 인증서를 통해 접근**
### <a name="vault인증서-3.3.1route53설정"></a>**3.3.1 Route53 설정**
![](./img/3073540219.png?width=760)
### <a name="vault인증서-3.3.2레코드생성"></a>**3.3.2 레코드 생성**
![](./img/3073278963.png?width=760)
### <a name="vault인증서-3.3.3레코드설정"></a>**3.3.3 레코드 설정**
- 레코드 이름
  - 대상 도메인 이름 설정
- 레코드 유형
  - A
- 별칭
  - On
- 트래픽 라우팅 대상
  - NLB
  - ap-northeast-2(서울)
  - 사용하고자 하는 AWS 로드 밸런서 지정
- 라우팅 정책
  - 단순 라우팅 

![](./img/3073246298.png?width=760)
### <a name="vault인증서-3.3.4aws인증서를통해vaultui접근"></a>**3.3.4 AWS 인증서를 통해 Vault UI 접근**
![](./img/3073311827.png?width=760)
# <a name="vault인증서-4.awsprivateca를사용하는인증서생성"></a>**4. AWS Private Ca를 사용 하는 인증서 생성**
## <a name="vault인증서-4.1사전준비요건"></a>**4.1 사전 준비 요건**
- Private Ca 생성
![](./img/3076358550.png?width=760)

## <a name="vault인증서-4.2acm인증서생성"></a>**4.2 ACM 인증서 생성**
- 요청
![](./img/3076489735.png?width=760)


- 인증서 요청
  - 프라이빗 인증서 요청(인증서 기관이 aws가 아닌 PrivateCA로 만든 주체로 함)
  - 다음
![](./img/3075051442.png?width=760)

- 인증 기관 세부 정보

![](./img/3076489746.png?width=760)
![](./img/3076424567.png?width=760)


- 도메인 이름
![](./img/3076424575.png?width=760)

- 키 알고리즘
![](./img/3075051459.png?width=760)


- 태그
- 인증서 갱신 권한
- 요청


![](./img/3076589226.png?width=760)


- Private Ca에 대한 인증 기관 기반으로 인증서 생성
![](./img/3076489735.png?width=760)


# <a name="vault인증서-5.awsprivateca기반으로생성된인증서를vault에적용"></a>**5. AWS Private Ca 기반으로 생성 된 인증서를 Vault에 적용**
- 내보내기
![](./img/3076555196.png?width=760)


- 인증서 내보내기
  - AWS 상에서 내보기를 사용하려면 비밀번호를 생성 후 내보기가 가능
![](./img/3076358579.png?width=760)


- 내보낸 인증서
- 다운로드
![](./img/3076456740.png?width=760)


- 사설 인증서 가져오기
![](./img/3074920237.png?width=760)

# <a name="vault인증서-결론"></a>**결론**
테스트 한 결과로는 Private Ca로 EKS 환경에서 Vault에 사설 인증서를 적용은 불가능

안되는 이유

-----
# <a name="vault인증서-진행방식"></a>**진행 방식**

1. AWS Private Ca 생성
2. Private Ca를 통해 AWS Certificate Manager 등록 시 private 인증서 요청(csr 부분)
- AWS Private Ca을 생성 하지 않으면 private 인증서 요청이 불가 합니다.
3. 1번, 2번으로 AWS Certificate Manager에 등록이 가능합니다.
4. k8s에 인증서를 적용 하기 위해서는 k8s 자체적으로 csr이 필요한데 aws에서는 인증 주체가 Private Ca로 되어 있기 때문에 따로 csr파일을 제공하지 않아 k8s에 적용 할 수 없습니다.

아래 참고 링크에 csr에 대한 부분에 대한 가이드 제공

참고: vault k8s 인증서 적용 공식 문서

- <https://developer.hashicorp.com/vault/docs/platform/k8s/helm/examples/standalone-tls>
## <a name="vault인증서-대안"></a>**대안**
- 위 테스트 통한 방법으로 하게 되면 aws 인증서(ACM)를 관리 하지 않기 때문에 인증서 갱신 시 수동으로 갱신을 해야 하는 번거로움이 있습니다.

⇒ 대안으로 eks 환경에서는 container로 사설 인증서를 관리 해주는 container(cert-manager)를 제공 할 수 있는데 이 container로 인증서를 자동으로 갱신 할 수 있습니다.

참고

1. <https://aws.amazon.com/ko/blogs/containers/setting-up-end-to-end-tls-encryption-on-amazon-eks-with-the-new-aws-load-balancer-controller/>
2. <https://cleanupthedesk.tistory.com/43>

Created by 김기범(rlarlqja1001@gmail.com)