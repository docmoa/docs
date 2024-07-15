---
description: "vault container logrotate"
tag: ["kubernetes", "vault", "logrotate"]
author: gbkim
---
# **eks Vault sidecar를 활용한 logrotate 설정**


- [참고: https://github.com/HanseMerkur/vault-logrotate](#eksvaultsidecar를활용한logrotate설정-참고:https://github.com/hansemerkur/vault-logrotate)
- [참고: 버전 확인](#eksvaultsidecar를활용한logrotate설정-참고:버전확인)

[1. EFS CSI Driver 설치](#eksvaultsidecar를활용한logrotate설정-1.efscsidriver설치) 

- [1.1 IAM 정책을 만들 json 파일 가져오기 iam-policy-example.json](#eksvaultsidecar를활용한logrotate설정-1.1iam정책을만들json파일가져오기iam-policy-example.json)
- [1.2 IAM 정책](#eksvaultsidecar를활용한logrotate설정-1.2iam정책)
- [1.3 클러스터의 OIDC 공급자 URL](#eksvaultsidecar를활용한logrotate설정-1.3클러스터의oidc공급자url)
- [1.4 trust-policy](#eksvaultsidecar를활용한logrotate설정-1.4trust-policy)
- [1.4 역할 생성](#eksvaultsidecar를활용한logrotate설정-1.4역할생성)
- [1.5 IAM 정책을 역할에 연결](#eksvaultsidecar를활용한logrotate설정-1.5iam정책을역할에연결)
- [1.6 생성한 IAM 역할의 ARN이 추가된 Kubernetes SA을 생성](#eksvaultsidecar를활용한logrotate설정-1.6생성한iam역할의arn이추가된kubernetessa을생성)

[2. Amazon EFS 드라이버 설치](#eksvaultsidecar를활용한logrotate설정-2.amazonefs드라이버설치) 

- [2.1 Helm 리포지토리를 추가](#eksvaultsidecar를활용한logrotate설정-2.1helm리포지토리를추가)
- [2.2 리포지토리를 업데이트](#eksvaultsidecar를활용한logrotate설정-2.2리포지토리를업데이트)
- [2.3 Helm 차트를 사용하여 드라이버 릴리스를 설치](#eksvaultsidecar를활용한logrotate설정-2.3helm차트를사용하여드라이버릴리스를설치)
- [2.4 EFS 생성](#eksvaultsidecar를활용한logrotate설정-2.4efs생성)
- [2.4 EFS SG 생성 후 설정](#eksvaultsidecar를활용한logrotate설정-2.4efssg생성후설정)
- [2.5 storageclass.yaml로 배포](#eksvaultsidecar를활용한logrotate설정-2.5storageclass.yaml로배포)

[3. helm으로 Vault sidecar를 활용한 logrotate yaml 파일 준비](#eksvaultsidecar를활용한logrotate설정-3.helm으로vaultsidecar를활용한logrotateyaml파일준비) 

- [3.1 vault helm으로 배포](#eksvaultsidecar를활용한logrotate설정-3.1vaulthelm으로배포) 
  - [3.1.1 license secret 생성](#eksvaultsidecar를활용한logrotate설정-3.1.1licensesecret생성)
  - [3.1.2 eks 자격증명 secret 생성](#eksvaultsidecar를활용한logrotate설정-3.1.2eks자격증명secret생성)
  - [3.1.3 helm repo 등록 및 values.yaml 기반으로 vault 배포](#eksvaultsidecar를활용한logrotate설정-3.1.3helmrepo등록및values.yaml기반으로vault배포)
  - [3.1.4 logrotate 적용 확인](#eksvaultsidecar를활용한logrotate설정-3.1.4logrotate적용확인) 
    - [3.1.4.1 auditlog-logrotate 설정 확인](#eksvaultsidecar를활용한logrotate설정-3.1.4.1auditlog-logrotate설정확인)
### <a name="eksvaultsidecar를활용한logrotate설정-참고:https://github.com/hansemerkur/vault-logrotate"></a>**참고: [https://github.com/HanseMerkur/vault-logrotate](https://github.com/HanseMerkur/vault-logrotate)**

### <a name="eksvaultsidecar를활용한logrotate설정-참고:버전확인"></a>**참고: 버전 확인**

||**버전**|
| :-: | :-: |
|eks cluster|v1.24|
|aws cli|v2.10.1 |
|eks ctl|v0.130.0|
|helm|v3.10.3|
# <a name="eksvaultsidecar를활용한logrotate설정-1.efscsidriver설치"></a>**1. EFS CSI Driver 설치**
## <a name="eksvaultsidecar를활용한logrotate설정-1.1iam정책을만들json파일가져오기iam-policy-example.json"></a>**1.1 IAM 정책을 만들 json 파일 가져오기 iam-policy-example.json**
```
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-efs-csi-driver/master/docs/iam-policy-example.json
```

```
iam-policy-example.json

{

    "Version": "2012-10-17",

    "Statement": [

      {

        "Effect": "Allow",

        "Action": [

          "elasticfilesystem:DescribeAccessPoints",

          "elasticfilesystem:DescribeFileSystems",

          "elasticfilesystem:DescribeMountTargets",

          "ec2:DescribeAvailabilityZones"

        ],

        "Resource": "\*"

      },

      {

        "Effect": "Allow",

        "Action": [

          "elasticfilesystem:CreateAccessPoint"

        ],

        "Resource": "\*",

        "Condition": {

          "StringLike": {

            "aws:RequestTag/efs.csi.aws.com/cluster": "true"

          }

        }

      },

      {

        "Effect": "Allow",

        "Action": "elasticfilesystem:DeleteAccessPoint",

        "Resource": "\*",

        "Condition": {

        "StringEquals": {

            "aws:ResourceTag/efs.csi.aws.com/cluster": "true"

          }

        }

      }

    ]

}



```
## <a name="eksvaultsidecar를활용한logrotate설정-1.2iam정책"></a>**1.2 IAM 정책**

```
aws iam create-policy \
      --policy-name AmazonEKS\_EFS_CSI_Driver_Policy \
      --policy-document file://iam-policy-example.json
```




## <a name="eksvaultsidecar를활용한logrotate설정-1.3클러스터의oidc공급자url"></a>**1.3 클러스터의 OIDC 공급자 URL**


```
aws eks describe-cluster --name my-cluster --query "cluster.identity.oidc.issuer" --output text
https://oidc.eks.region-code.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE

```

## <a name="eksvaultsidecar를활용한logrotate설정-1.4trust-policy"></a>**1.4 trust-policy**



```
trust-policy.json

{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Federated": "arn:aws:iam::111122223333:oidc-provider/oidc.eks.region-code.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE"
        },
        "Action": "sts:AssumeRoleWithWebIdentity",
        "Condition": {
          "StringEquals": {
            "oidc.eks.region-code.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE:sub":"system:serviceaccount:kube-system:efs-csi-controller-sa"
         }
        }
      }
    ]
}
```
## <a name="eksvaultsidecar를활용한logrotate설정-1.4역할생성"></a>**1.4 역할 생성**
```

aws iam create-role \
    --role-name AmazonEKS\_EFS\_CSI\_DriverRole \
    --assume-role-policy-document file://"trust-policy.json"
```

## <a name="eksvaultsidecar를활용한logrotate설정-1.5iam정책을역할에연결"></a>**1.5 IAM 정책을 역할에 연결**



```
aws iam attach-role-policy \
    --policy-arn arn:aws:iam::111122223333:policy/AmazonEKS\_EFS\_CSI\_Driver\_Policy \
    --role-name AmazonEKS\_EFS\_CSI\_DriverRole
```

## <a name="eksvaultsidecar를활용한logrotate설정-1.6생성한iam역할의arn이추가된kubernetessa을생성"></a>**1.6 생성한 IAM 역할의 ARN이 추가된 Kubernetes SA을 생성**
```
apiVersion: v1
kind: ServiceAccount
metadata:
    labels:
      app.kubernetes.io/name: aws-efs-csi-driver
    name: efs-csi-controller-sa
    namespace: kube-system
    annotations: 
    eks.amazonaws.com/role-arn: arn:aws:iam::111122223333:role/AmazonEKS\_EFS\_CSI\_DriverRole
kubectl apply -f efs-service-account.yaml
```
# <a name="eksvaultsidecar를활용한logrotate설정-2.amazonefs드라이버설치"></a>**2. Amazon EFS 드라이버 설치**
## <a name="eksvaultsidecar를활용한logrotate설정-2.1helm리포지토리를추가"></a>**2.1 Helm 리포지토리를 추가**

```
helm repo add aws-efs-csi-driver https://kubernetes-sigs.github.io/aws-efs-csi-driver/
```


## <a name="eksvaultsidecar를활용한logrotate설정-2.2리포지토리를업데이트"></a>**2.2 리포지토리를 업데이트**
```
helm repo update
```
## <a name="eksvaultsidecar를활용한logrotate설정-2.3helm차트를사용하여드라이버릴리스를설치"></a>**2.3 Helm 차트를 사용하여 드라이버 릴리스를 설치**
```
helm upgrade -i aws-efs-csi-driver aws-efs-csi-driver/aws-efs-csi-driver \
      --namespace kube-system \
      --set image.repository=602401143452.dkr.ecr.region-code.amazonaws.com/eks/aws-efs-csi-driver \
      --set controller.serviceAccount.create=false \
      --set controller.serviceAccount.name=efs-csi-controller-sa
```
## <a name="eksvaultsidecar를활용한logrotate설정-2.4efs생성"></a>**2.4 EFS 생성**
![](./img/3044639378.png?width=760)
## <a name="eksvaultsidecar를활용한logrotate설정-2.4efssg생성후설정"></a>**2.4 EFS SG 생성 후 설정**



![](./img/3044606085.png?width=760)



## <a name="eksvaultsidecar를활용한logrotate설정-2.5storageclass.yaml로배포"></a>**2.5 storageclass.yaml로 배포**
```
apiVersion: v1
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
    name: efs-sc
provisioner: efs.csi.aws.com
reclaimPolicy: Retain
parameters:
    provisioningMode: efs-ap
    fileSystemId: {생성한 EFS ID 기입}
    directoryPerms: "700"
    gidRangeStart: "1000"
    gidRangeEnd: "2000"

```
```    
kubectl apply sc.yaml
```

# <a name="eksvaultsidecar를활용한logrotate설정-3.helm으로vaultsidecar를활용한logrotateyaml파일준비"></a>**3. helm으로 Vault sidecar를 활용한 logrotate yaml 파일 준비**


cm-logrotate.yaml
```
apiVersion: v1
kind: ConfigMap
metadata:
  name: logrotate-config
data:
  logrotate.conf: |    
     /vault/audit/*.txt {       
     missingok              
     compress               
     maxsize 1M             
     crate                  
     dateext                
     dateformat -%Y-%m-%d_%H
     postrotate             
         pkill -HUP vault   
     endscript              
 }
```

## <a name="eksvaultsidecar를활용한logrotate설정-3.1vaulthelm으로배포"></a>**3.1 vault helm으로 배포**
### <a name="eksvaultsidecar를활용한logrotate설정-3.1.1licensesecret생성"></a>**3.1.1 license secret 생성**

```
touch vault.hclic => vault 라이센스 내용 첨부

vaultsecret=$(cat vault.hclic)

kubectl create secret generic vault-ent-license --from-literal="license=${vaultsecret}"
```

### <a name="eksvaultsidecar를활용한logrotate설정-3.1.2eks자격증명secret생성"></a>**3.1.2 eks 자격증명 secret 생성**


```
kubectl create secret generic eks-creds \\
      --from-literal=AWS_ACCESS_KEY_ID="[AWS_ACCESS_KEY_ID]" \\
      --from-literal=AWS_SECRET_ACCESS_KEY="[AWS_SECRET_ACCESS_KEY]"
```


### <a name="eksvaultsidecar를활용한logrotate설정-3.1.2eks자격증명secret생성"></a>**3.1.3 vault helm values.yaml 배포**

```
server:
  # HUP signal for logrotate
  shareProcessNamespace: true
  # Add the lograte config from a config map
  volumes:
    - name: logrotate-config
      configMap:
        name: logrotate-config
  # And finally the container
  extraContainers:
   - name: auditlog-rotator
     image: [aws account ID].dkr.ecr.ap-northeast-2.amazonaws.com/hasicorp-repo:logrotate 
     imagePullPolicy: Always
     env:
       - name: CRONTAB
         value: "*/3 * * * *"
     volumeMounts:
     - mountPath: /etc/logrotate.conf
       name: logrotate-config
       subPath: logrotate.conf
       readOnly: true
     - mountPath: /vault/audit
       name: audit
  enterpriseLicense:
    secretName: vault-ent-license
  ha:
    enabled: true
    raft:
      enabled: true
      config: |
        ui = true

        listener "tcp" {
          tls_disable = 1
          address = "[::]:8200"
          cluster_address = "[::]:8201"
        }
        seal "awskms" {
           region     = "ap-northeast-2"
           kms_key_id = "[kms_key_id]"
         }
        storage "raft" {
          path = "/vault/data"
          retry_join {
            leader_api_addr = "https://vault-0.vault-internal:8200"
          }
          retry_join {
            leader_api_addr = "https://vault-1.vault-internal:8200"
          }
          retry_join {
            leader_api_addr = "https://vault-2.vault-internal:8200"
          }
         }
        service_registration "kubernetes" {}
  image:
    repository: hashicorp/vault-enterprise
    tag: 1.12.1-ent
  extraSecretEnvironmentVars:
    - envName: AWS_ACCESS_KEY_ID
      secretName: eks-creds
      secretKey: AWS_ACCESS_KEY_ID
    - envName: AWS_SECRET_ACCESS_KEY
      secretName: eks-creds
      secretKey: AWS_SECRET_ACCESS_KEY
  service:
    type: LoadBalancer
    loadBalancerClass: service.k8s.aws/nlb
    annotations:
  dataStorage:
    enabled: true
    storageClass: efs-sc
    size: 100Gi
  auditStorage:
    enabled: true 
    # Size of the PVC created
    size: 100Gi
    # Location where the PVC will be mounted.
    mountPath: "/vault/audit"
    # Name of the storage class to use.  If null it will use the
    # configured default Storage Class.
    storageClass: efs-sc 
    # Access Mode of the storage device being used for the PVC
    accessMode: ReadWriteOnce
    # Annotations to apply to the PVC
    annotations: {}
```



### <a name="eksvaultsidecar를활용한logrotate설정-3.1.3helmrepo등록및values.yaml기반으로vault배포"></a>**3.1.3 helm repo 등록 및 values.yaml 기반으로 vault 배포**





```
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo list
[설치]
helm install vault hashicorp/vault -f values.yaml
[삭제]
helm uninstall vault hashicorp/vault -f values.yaml
```

### <a name="eksvaultsidecar를활용한logrotate설정-3.1.4logrotate적용확인"></a>**3.1.4 logrotate 적용 확인**
![](./img/3044639401.png?width=760)
#### <a name="eksvaultsidecar를활용한logrotate설정-3.1.4.1auditlog-logrotate설정확인"></a>**3.1.4.1 auditlog-logrotate 설정 확인**
![](./img/3044540515.png?width=760)

- 1M가 넘어가면 새로 생성 된 파일들은 압축파일로 변환 설정

![](./img/3044540525.png?width=760)




create by rlarlqja1001@gmail.com