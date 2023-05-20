# Vault Secrets Operator 예제실습

> 📌 참고:
> 현재 Vault 비밀 오퍼레이터는 공개 베타 버전입니다. *[here](https://github.com/hashicorp/vault-secrets-operator/issues)*에서 GitHub 이슈를 개설하여 피드백을 제공해 주세요.

본 문서는 HashiCorp 공식 GitHub의 [Vault Secret Operator 저장소]([here](https://github.com/hashicorp/vault-secrets-operator#samples)) 에서 제공하는 코드를 활용하여 환경구성 및 샘플 애플리케이션 배포/연동에 대한 상세 분석을 제공한다.

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/vso_repo.png)

## 0. 사전 요구사항

### 1) 패키지 및 바이너리 정보

- go(1.20.2 이상)
- make
- KinD
- Docker
- Kubectl
- unzip

### 2) 저장소 복제

실습을 위해 [vault-secrets-operator](https://github.com/hashicorp/vault-secrets-operator) 저장소를 복제한다.

```bash
# 저장소 복제
$ git clone https://github.com/hashicorp/vault-secrets-operator.git

# 작업 디렉토리 이동
$ cd vault-secrets-operator
```

## 1. K8s 환경구성 및 샘플배포

> 📌 참고:
> 실행결과 : [vso-demo-1.sh](https://gist.githubusercontent.com/hyungwook0221/85ec45d06a8c7643bcfe4afcd8843856/raw/b40096f6bbfad75636e3657f6c0827f8b7a0b436/vso-demo-1.sh)

- Start a KinD Cluster

```bash
$ make setup-kind
```

- `setup-kind` 수행 후 생성된 KinD 클러스터 및 파드정보 확인

 `vault-secrets-operator-control-plane` 가 단일노드로 배포된 것을 확인할 수 있다.

```bash
$ kubectl get nodes -o wide
NAME                                   STATUS   ROLES           AGE     VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
vault-secrets-operator-control-plane   Ready    control-plane   3m18s   v1.25.3   172.18.0.2    <none>        Ubuntu 22.04.1 LTS   5.15.49-linuxkit   containerd://1.6.9

$ kubectl get pods -A
NAMESPACE            NAME                                                           READY   STATUS    RESTARTS   AGE
kube-system          coredns-565d847f94-42vpm                                       1/1     Running   0          3m5s
kube-system          coredns-565d847f94-6fsv9                                       1/1     Running   0          3m5s
kube-system          etcd-vault-secrets-operator-control-plane                      1/1     Running   0          3m18s
kube-system          kindnet-9j486                                                  1/1     Running   0          3m6s
kube-system          kube-apiserver-vault-secrets-operator-control-plane            1/1     Running   0          3m18s
kube-system          kube-controller-manager-vault-secrets-operator-control-plane   1/1     Running   0          3m18s
kube-system          kube-proxy-tfqc8                                               1/1     Running   0          3m6s
kube-system          kube-scheduler-vault-secrets-operator-control-plane            1/1     Running   0          3m17s
local-path-storage   local-path-provisioner-684f458cdd-2dzfn                        1/1     Running   0          3m5s
```



## 2. Vault 클러스터 배포

> 📌 참고
> 실행결과 : [vso-demo-2.sh](https://gist.githubusercontent.com/hyungwook0221/3bf0603ca179f367492fefab9574595f/raw/53b33e501082193999c1f5dca9ed73c70507d42f/vso-demo-2.sh)

앞서 생성된 KinD 클러스터 내부에 Vault 클러스터를 배포한다. 이때, 필요한 사전 환경을 Terraform 코드를 통해 자동으로 구성한다.

```bash
make setup-integration-test
```

- 배포된 Vaulat Server Pod 확인 

```bash
# Pod 확인
$ kubectl get pods -n vault
NAME      READY   STATUS    RESTARTS   AGE
vault-0   1/1     Running   0          73s

# vault 상태확인
$ kubectl exec -n vault -it vault-0 -- vault status
Key             Value
---             -----
Seal Type       shamir
Initialized     true
Sealed          false
Total Shares    1
Threshold       1
Version         1.13.2
Build Date      2023-04-25T13:02:50Z
Storage Type    inmem
Cluster Name    vault-cluster-199af322
Cluster ID      23b647d5-f067-ba94-b359-2fca26af9ff9
HA Enabled      false
```

Terraform의 `kubernetes`, `helm` 프로바이더를 사용하여 다음과 같은 리소스를 자동으로 배포한다.

> 📌 참고 : 
> 원본코드 : [main.tf](https://raw.githubusercontent.com/hashicorp/vault-secrets-operator/main/test/integration/infra/main.tf)

- kubernetes
  - kubernetes_namespace : demo
  - kubernetes_secret : vault_license
  - kubernetes_cluster_role_binding : reviewer
- helm(helm_release)
  - server.dev.enabled
  - server.image.repository
  - server.image.tag
  - server.logLevel
  - injector.enabled

## 3. Vault 설정

> 📌 참고:
> 원본소스 : [setup.sh](https://raw.githubusercontent.com/hashicorp/vault-secrets-operator/main/config/samples/setup.sh)
> 실행결과 : [vso-demo-3.sh](https://gist.githubusercontent.com/hyungwook0221/1750fa348e95141018e83ed16835281f/raw/71c967722244b175cf1ceabba828b038cfe1bf8c/vso-demo-3.sh)

`setup.sh` 스크립트를 실행하여 다음 3가지 시크릿 엔진에 대한 실습 환경을 구성한다.

- Secret Engine
- ACL Policy
- Auth Methods

```bash
$ ./config/samples/setup.sh
```

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/H7fG1P.jpg)

### 1) Secret Engine

#### (1) KV 시크릿엔진 활성화 : kvv1, kvv2

KV 시크릿엔진 Version 1, Version2를 활성화 하고 샘플 데이터를 주입한다.

```bash
vault secrets disable kvv2/
vault secrets enable -path=kvv2 kv-v2
vault kv put kvv2/secret username="db-readonly-username" password="db-secret-password"

vault secrets disable kvv1/
vault secrets enable -path=kvv1 -version=1 kv
vault kv put kvv1/secret username="v1-user" password="v1-password"
```

- KV 시크릿 엔진 : kvv1

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/fLg3mc.jpg)

- KV 시크릿 엔진 : kvv2

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/S7cDQl.jpg)

#### (2) PKI 시크릿 엔진 활성화 : pki

PKI 시크릿 엔진을 활성화하고 다음 설정을 진행한다.

- PKI 인증서 생성
- CA, CRL 설정
- Role 설정

```bash
# PKI Secret 엔진 활성화
vault secrets disable pki
vault secrets enable pki

# PKI 인증서 생성
vault write pki/root/generate/internal \
    common_name=example.com \
    ttl=768h

# 설정
vault write pki/config/urls \
    issuing_certificates="http://127.0.0.1:8200/v1/pki/ca" \
    crl_distribution_points="http://127.0.0.1:8200/v1/pki/crl"

# 역할구성
vault write pki/roles/default \
    allowed_domains=example.com \
    allowed_domains=localhost \
    allow_subdomains=true \
    max_ttl=72h
```

- PKI 시크릿 엔진 구성확인

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/6Ht11e.jpg)

### 2) ACL Policy

#### (1) 정책 정의 : demo

각 시크릿 엔진에 대한  ACL Policy를 정의하기 위해 다음 `hcl` 을 작성하고 적용한다.

```ruby
# policy.hcl 작성
cat <<EOT > /tmp/policy.hcl
path "kvv2/*" {
  capabilities = ["read"]
}
path "kvv1/*" {
  capabilities = ["read"]
}
path "pki/*" {
  capabilities = ["read", "create", "update"]
}
EOT

# demo 정책 생성
vault policy write demo /tmp/policy.hcl
```

`vault policy write` 명령으로 정책을 생성하고 확인한다.

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/P7EuMl.jpg)

- demo policy 확인
  - **kvv2 : read**
  - **kvv1 : read**
  - **pki : read, create, update**

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/jjaKW7.jpg)

### 3) Auth Methods

#### (1) 인증방식 정의: kubernetes

Vault와 연동을 위해 kubernetes 인증방식을 설정한다.

> 참고:
> Beta 버전에서는 Kubernetes 인증 방식만 제공

```bash
# Kubernetes 인증방식 활성화
vault auth disable kubernetes
vault auth enable kubernetes

vault write auth/kubernetes/config \
    kubernetes_host=https://kubernetes.default.svc

vault write auth/kubernetes/role/demo \
    bound_service_account_names=default \
    bound_service_account_namespaces=tenant-1,tenant-2 \
    policies=demo \
    ttl=1h
```

VSO에서는 현재 Kubernetes 인증 방식만을 제공하고 있으므로 Kubernetes 인증 방식을 통해 실습을 진행한다. 

- 생성된 kubernetes 인증방식 확인

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/447eDQ.jpg)

kubernetes 인증방식 구성을 위해 Roles, Config를 정의한다.

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/Jvvuyn.jpg)

- **Roles 확인** 
  - bound_service_account_names=`default`
  - bound_service_account_namespaces=`tenant-1,tenant-2`
  - policies=`demo`
  - ttl=`1h` (3600s)

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/gd4mOV.jpg)

- Config 확인

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/7wjcUA.jpg)

- Config 확인(상세)
  - kubernetes_host=`https://kubernetes.default.svc`

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/m5o4il.jpg)

(참고) Entity 확인

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/QlpQMb.jpg)

### 4) Kubernetes 네임스페이스 생성

K8s 인증방식의 역할(Role)에서 사용할 네임스페이스 확인

```bash
kubectl get ns | grep tenant
tenant-1                        Active   5h2m
tenant-2                        Active   5h2m
```

## 4. 오퍼레이터 빌드 및 배포

> 참고 
> [vso-demo-4.sh](https://gist.githubusercontent.com/hyungwook0221/37612418122e9154a497236c75bf3a5e/raw/9ce3a49318921f5928ec7bb96cd5149af3612713/vso-demo-4.sh)

Vault 설정이 완료되었으므로 실제 Kubernetes Cluster에서 Operator를 배포한다.

```bash
$ make build docker-build deploy-kind
```

### 1) 배포된 리소스 확인

```bash
$ kubectl get pods -n vault-secrets-operator-system
NAME                                                         READY   STATUS    RESTARTS   AGE
vault-secrets-operator-controller-manager-6f8b6b8f49-5lt97   2/2     Running   0          3h59m

$ k get crd -A
NAME                                        CREATED AT
vaultauths.secrets.hashicorp.com            2023-05-12T08:37:15Z
vaultconnections.secrets.hashicorp.com      2023-05-12T08:37:15Z
vaultdynamicsecrets.secrets.hashicorp.com   2023-05-12T08:37:15Z
vaultpkisecrets.secrets.hashicorp.com       2023-05-12T08:37:15Z
vaultstaticsecrets.secrets.hashicorp.com    2023-05-12T08:37:15Z
```

## 5. 샘플 K8s 리소스 배포

```bash
$ kubectl apply -k config/samples

secret/pki1 created
secret/secret1 created
secret/secret1 created
service/tls-app-service created
ingress.networking.k8s.io/tls-example-ingress created
vaultauth.secrets.hashicorp.com/vaultauth-sample created
vaultauth.secrets.hashicorp.com/vaultauth-sample created
vaultconnection.secrets.hashicorp.com/vaultconnection-sample created
vaultconnection.secrets.hashicorp.com/vaultconnection-sample created
vaultdynamicsecret.secrets.hashicorp.com/vaultdynamicsecret-sample created
vaultpkisecret.secrets.hashicorp.com/vaultpkisecret-sample-tenant-1 created
vaultpkisecret.secrets.hashicorp.com/vaultpkisecret-tls created
vaultstaticsecret.secrets.hashicorp.com/vaultstaticsecret-sample-tenant-1 created
vaultstaticsecret.secrets.hashicorp.com/vaultstaticsecret-sample-tenant-2 created
pod/app1 created
pod/tls-app created
pod/app1 created
```

- 생성된 Secret 확인:

```bash
$ kubectl get secrets -n tenant-1 secret1 -o yaml
$ kubectl get secrets -n tenant-1 pki1 -o yaml
$ kubectl get secrets -n tenant-2 secret1 -o yaml
```

### 1) 연결 및 인증방식 설정

설명추가

#### (1) `VaultConnection` 커스텀 리소스

Vault Operator가 연결할 Vault Cluster 정보를 구성한다.

- `.spec.address` : http://vault.vault.svc.cluster.local:8200

```yaml
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultConnection
metadata:
  labels:
    app.kubernetes.io/name: vaultconnection
    app.kubernetes.io/instance: vaultconnection-sample
    app.kubernetes.io/part-of: vault-secrets-operator
    app.kubernetes.io/managed-by: kustomize
    app.kubernetes.io/created-by: vault-secrets-operator
  name: vaultconnection-sample
  namespace: tenant-1
spec:
  address: http://vault.vault.svc.cluster.local:8200
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultConnection
metadata:
  labels:
    app.kubernetes.io/name: vaultconnection
    app.kubernetes.io/instance: vaultconnection-sample
    app.kubernetes.io/part-of: vault-secrets-operator
    app.kubernetes.io/managed-by: kustomize
    app.kubernetes.io/created-by: vault-secrets-operator
  name: vaultconnection-sample
  namespace: tenant-2
spec:
  address: http://vault.vault.svc.cluster.local:8200
```

#### (2) `VaultAuth` 커스텀 리소스

사전에 정의된 `VaultConnection` 을 통해 Operator가 Vault Server와 연결할 때, 어떤 인증방식을 사용할지 구성한다.

> 참고 : Beta 버전에서는 K8s 인증방식만 제공

- `.spec.vaultConnectionRef`
- `.spec.method`
- `.spec.mount`
- `.spec.kubernetes.role`
- `.spec.kubernetes.serviceAccount`

```yaml
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultAuth
metadata:
  labels:
    app.kubernetes.io/name: vaultauth
    app.kubernetes.io/instance: vaultauth-sample
    app.kubernetes.io/part-of: vault-secrets-operator
    app.kubernetes.io/managed-by: kustomize
    app.kubernetes.io/created-by: vault-secrets-operator
  name: vaultauth-sample
  namespace: tenant-1
spec:
  vaultConnectionRef: vaultconnection-sample
  method: kubernetes
  mount: kubernetes
  kubernetes:
    role: demo
    serviceAccount: default
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultAuth
metadata:
  labels:
    app.kubernetes.io/name: vaultauth
    app.kubernetes.io/instance: vaultauth-sample
    app.kubernetes.io/part-of: vault-secrets-operator
    app.kubernetes.io/managed-by: kustomize
    app.kubernetes.io/created-by: vault-secrets-operator
  name: vaultauth-sample
  namespace: tenant-2
spec:
  vaultConnectionRef: vaultconnection-sample
  method: kubernetes
  mount: kubernetes
  kubernetes:
    role: demo
    serviceAccount: default
```

### 2) Vault CRD 예제

VSO에서 제공하는 3가지 CRD를 사용하여 Kubernetes 오브젝트와 연동하여 사용하는 방법을 알아본다.

- VaultPKISecret
- VaultStaticSecret
- VaultDynamicSecret

#### (1) `VaultPKISecret` : Pod + PKI Secret

다음은 PKI 인증서를 생성하고 Nginx 웹 서버에 적용하는 실습 예제이다. Nginx 파드를 생성할 때 secret 타입의 볼륨을 마운트한다.

- `VaultPKISecret` 

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: pki1
  namespace: tenant-1
type: Opaque
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultPKISecret
metadata:
  namespace: tenant-1
  name: vaultpkisecret-sample-tenant-1
spec:
  vaultAuthRef: vaultauth-sample
  namespace: tenant-1
  mount: pki
  name: default
  destination:
    name: pki1
  commonName: consul.example.com
  format: pem
  revoke: true
  clear: true
  expiryOffset: 5s
  ttl: 15s
```

- Pod 샘플

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: app1
  namespace: tenant-1
spec:
  containers:
    - name: nginx
      image: nginx
      volumeMounts:
        - name: secrets
          mountPath: "/etc/secrets"
          readOnly: true
  volumes:
    - name: secrets
      secret:
        # created in Terraform
        secretName: pki1
        optional: false # default setting; "mysecret" must exist
```

실제 PKI 인증서가 정상적으로 생성되는 확인해본다.

- `/etc/secrets`  디렉토에서 파일목록 확인

```bash
$ ls -lrt /etc/secrets

total 0
lrwxrwxrwx 1 root root 20 May 14 08:33 serial_number -> ..data/serial_number
lrwxrwxrwx 1 root root 23 May 14 08:33 private_key_type -> ..data/private_key_type
lrwxrwxrwx 1 root root 18 May 14 08:33 private_key -> ..data/private_key
lrwxrwxrwx 1 root root 17 May 14 08:33 issuing_ca -> ..data/issuing_ca
lrwxrwxrwx 1 root root 17 May 14 08:33 expiration -> ..data/expiration
lrwxrwxrwx 1 root root 18 May 14 08:33 certificate -> ..data/certificate
lrwxrwxrwx 1 root root 15 May 14 08:33 ca_chain -> ..data/ca_chain
lrwxrwxrwx 1 root root 11 May 14 08:33 _raw -> ..data/_raw
```

본 실습에서는 실제 nginx 파드의 구성파일에 PKI 인증서를 적용하는 시나리오가 아닌 단순 파일생성 및 갱신해보았다.

#### (2) `VaultPKISecret` 예제2 : Ingress + Pod + PKI Secret

이번 실습에서는 앞서 확인한 PKI 인증서를 활용하여 K8s Ingress 오브젝트에 적용하고 주기적으로 교체되는 시나리오를 확인해본다.

> 참고 : Ingress 실습을 위해서는 Nginx Ingress Controller를 설치 후 진행해야 한다. [[참고](https://github.com/hashicorp/vault-secrets-operator/tree/main#ingress-tls-with-vaultpkisecret)]

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=90s
```

- Ingress에서 PKI 인증서 연동을 위한 샘플예제 

```yaml
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultPKISecret
metadata:
  name: vaultpkisecret-tls
  namespace: tenant-1
spec:
  vaultAuthRef: vaultauth-sample
  namespace: tenant-1
  mount: pki
  name: default
  destination:
    create: true
    name: pki-tls
    type: kubernetes.io/tls
  commonName: localhost
  format: pem
  revoke: true
  clear: true
  expiryOffset: 15s
  ttl: 1m
---
apiVersion: v1
kind: Pod
metadata:
  name: tls-app
  namespace: tenant-1
  labels:
    app: tls-app
spec:
  containers:
  - command:
    - /agnhost
    - netexec
    - --http-port
    - "8080"
    image: registry.k8s.io/e2e-test-images/agnhost:2.39
    name: tls-app
---
kind: Service
apiVersion: v1
metadata:
  name: tls-app-service
  namespace: tenant-1
spec:
  selector:
    app: tls-app
  ports:
    - port: 443
      targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tls-example-ingress
  namespace: tenant-1
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /$2
spec:
  tls:
  - hosts:
    - localhost
    secretName: pki-tls
  rules:
  - host: localhost
    http:
      paths:
      - path: /tls-app(/|$)(.*)
        pathType: Prefix
        backend:
          service:
            name: tls-app-service
            port:
              number: 443
```

- 인증서 확인(명령어)

```bash
$ curl -k https://localhost:38443/tls-app/hostname
tls-app%
$ curl -kvI https://localhost:38443/tls-app/hostname
*   Trying 127.0.0.1:38443...
* Connected to localhost (127.0.0.1) port 38443 (#0)
# 중략
* Server certificate:
*  subject: CN=localhost
*  start date: May 14 08:04:00 2023 GMT
*  expire date: May 14 08:05:30 2023 GMT
*  issuer: CN=example.com
```

- nginx 컨트롤러 로그를 확인하여 교체되는 TLS 시크릿을 확인:

```bash
kubectl logs -f -n ingress-nginx -l app.kubernetes.io/instance=ingress-nginx
W0514 07:51:58.673604       1 client_config.go:615] Neither --kubeconfig nor --master was specified.  Using the inClusterConfig.  This might not work.
{"level":"info","msg":"patching webhook configurations 'ingress-nginx-admission' mutating=false, validating=true, failurePolicy=Fail","source":"k8s/k8s.go:118","time":"2023-05-14T07:51:58Z"}
{"level":"info","msg":"Patched hook(s)","source":"k8s/k8s.go:138","time":"2023-05-14T07:51:58Z"}
I0514 08:19:30.110926       9 store.go:619] "secret was updated and it is used in ingress annotations. Parsing" secret="tenant-1/pki-tls"
I0514 08:19:30.113988       9 backend_ssl.go:59] "Updating secret in local store" name="tenant-1/pki-tls"
W0514 08:19:30.114178       9 controller.go:1406] SSL certificate for server "localhost" is about to expire (2023-05-14 08:20:30 +0000 UTC)
I0514 08:20:15.208102       9 store.go:619] "secret was updated and it is used in ingress annotations. Parsing" secret="tenant-1/pki-tls"
I0514 08:20:15.208539       9 backend_ssl.go:59] "Updating secret in local store" name="tenant-1/pki-tls"
W0514 08:20:15.208801       9 controller.go:1406] SSL certificate for server "localhost" is about to expire (2023-05-14 08:21:15 +0000 UTC)
W0514 08:20:18.543113       9 controller.go:1406] SSL certificate for server "localhost" is about to expire (2023-05-14 08:21:15 +0000 UTC)
I0514 08:21:00.107794       9 store.go:619] "secret was updated and it is used in ingress annotations. Parsing" secret="tenant-1/pki-tls"
I0514 08:21:00.108127       9 backend_ssl.go:59] "Updating secret in local store" name="tenant-1/pki-tls"
W0514 08:21:00.108295       9 controller.go:1406] SSL certificate for server "localhost" is about to expire (2023-05-14 08:22:00 +0000 UTC)
W0514 07:51:58.418022       1 client_config.go:615] Neither --kubeconfig nor --master was specified.  Using the inClusterConfig.  This might not work.
{"err":"secrets \"ingress-nginx-admission\" not found","level":"info","msg":"no secret found","source":"k8s/k8s.go:229","time":"2023-05-14T07:51:58Z"}
{"level":"info","msg":"creating new secret","source":"cmd/create.go:28","time":"2023-05-14T07:51:58Z"}
```

- 인증서 생성/만료 시간 확인

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/sD28Mg.jpg)

- 인증서 생성/만료 시간 변경 확인

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/8bhJgt.jpg)

- 인증서 생성/만료 시간 확인(브라우저)

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/MicUWH.jpg)

- 인증서 생성/만료 변경 확인(브라우저)

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/ljNFGC.jpg)

#### (3) `VaultStaticSecret` 예제 : 

```yaml
---
apiVersion: v1
kind: Secret
metadata:
  name: secret1
  namespace: tenant-1
type: Opaque
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultStaticSecret
metadata:
  namespace: tenant-1
  name: vaultstaticsecret-sample-tenant-1
spec:
  # namespace: cluster1/tenant-1
  vaultAuthRef: vaultauth-sample
  mount: kvv2
  type: kv-v2
  name: secret
  refreshAfter: 5s
  destination:
    name: secret1
---
apiVersion: v1
kind: Secret
metadata:
  name: secret1
  namespace: tenant-2
type: Opaque
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultStaticSecret
metadata:
  namespace: tenant-2
  name: vaultstaticsecret-sample-tenant-2
spec:
  # namespace: cluster1/tenant-2
  vaultAuthRef: vaultauth-sample
  mount: kvv1
  type: kv-v1
  name: secret
  refreshAfter: 5s
  destination:
    name: secret1
---
apiVersion: v1
kind: Pod
metadata:
  name: app1
  namespace: tenant-1
spec:
  containers:
  - name: nginx
    image: nginx
    volumeMounts:
    - name: secrets
      mountPath: "/etc/secrets"
      readOnly: true
  volumes:
  - name: secrets
    secret:
      secretName: secret1
      optional: false # default setting; "mysecret" must exist
---
apiVersion: v1
kind: Pod
metadata:
  name: app1
  namespace: tenant-2
spec:
  containers:
  - name: nginx
    image: nginx
    volumeMounts:
    - name: secrets
      mountPath: "/etc/secrets"
      readOnly: true
  volumes:
  - name: secrets
    secret:
      secretName: secret1
      optional: false # default setting; "mysecret" must exist
```

#### (5) `VaultDynamicSecret`
> 🔥 업데이트 예정

```yaml
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultDynamicSecret
metadata:
  labels:
    app.kubernetes.io/name: vaultdynamicsecret
    app.kubernetes.io/instance: vaultdynamicsecret-sample
    app.kubernetes.io/part-of: vault-secrets-operator
    app.kubernetes.io/managed-by: kustomize
    app.kubernetes.io/created-by: vault-secrets-operator
  name: vaultdynamicsecret-sample
spec:
  # TODO(user): Add fields here
```

## 6. 리소스 삭제

샘플 삭제:

```bash
# K8s 리소스 삭제
$ kubectl delete -k config/samples

# kind 클러스터 삭제
$ kind delete clusters vault-secrets-operator
```


## 2. [테라폼 기반 데모](