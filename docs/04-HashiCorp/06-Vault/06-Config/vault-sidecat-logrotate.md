---
description: "vault container logrotate"
tag: ["kubernetes", "vault", "logrotate"]
author: gbkim
---

# EKS Vault sidecar를 활용한 logrotate 설정

> - [참고: https://github.com/HanseMerkur/vault-logrotate](#eksvaultsidecar를활용한logrotate설정-참고:https://github.com/hansemerkur/vault-logrotate)
> - [참고: 버전 확인](#eksvaultsidecar를활용한logrotate설정-참고:버전확인)

||확인 버전|
| :-: | :-: |
|eks cluster|v1.24|
|aws cli|v2.10.1 |
|eks ctl|v0.130.0|
|helm|v3.10.3|

## 1. EFS CSI Driver 설치

###  1.1 IAM 정책을 만들 json 파일 가져오기 iam-policy-example.json

```bash
curl -O https://raw.githubusercontent.com/kubernetes-sigs/aws-efs-csi-driver/master/docs/iam-policy-example.json
```

```json title="iam-policy-example.json"
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

### 1.2 IAM 정책

```bash
aws iam create-policy \
  --policy-name AmazonEKS\_EFS_CSI_Driver_Policy \
  --policy-document file://iam-policy-example.json
```

### 1.3 클러스터의 OIDC 공급자 URL

```bash
aws eks describe-cluster \
  --name my-cluster \
  --query "cluster.identity.oidc.issuer" \
  --output text \
  https://oidc.eks.region-code.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE
```

### 1.4 trust-policy

```json title="trust-policy.json"
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

### 1.4 역할 생성

```bash
aws iam create-role \
  --role-name AmazonEKS\_EFS\_CSI\_DriverRole \
  --assume-role-policy-document file://"trust-policy.json"
```

### 1.5 IAM 정책을 역할에 연결

```bash
aws iam attach-role-policy \
  --policy-arn arn:aws:iam::111122223333:policy/AmazonEKS\_EFS\_CSI\_Driver\_Policy \
  --role-name AmazonEKS\_EFS\_CSI\_DriverRole
```

### 1.6 생성한 IAM 역할의 ARN이 추가된 Kubernetes SA을 생성

```yaml
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

## 2. Amazon EFS 드라이버 설치

### 2.1 Helm 리포지토리를 추가

```bash
helm repo add aws-efs-csi-driver https://kubernetes-sigs.github.io/aws-efs-csi-driver/
```

### 2.2 리포지토리를 업데이트

```bash
helm repo update
```

### 2.3 Helm 차트를 사용하여 드라이버 릴리스를 설치

```bash
helm upgrade -i aws-efs-csi-driver aws-efs-csi-driver/aws-efs-csi-driver \
  --namespace kube-system \
  --set image.repository=602401143452.dkr.ecr.region-code.amazonaws.com/eks/aws-efs-csi-driver \
  --set controller.serviceAccount.create=false \
  --set controller.serviceAccount.name=efs-csi-controller-sa
```
### 2.4 EFS 생성

![](./img/3044639378.png?width=760)

### 2.4 EFS SG 생성 후 설정

![](./img/3044606085.png?width=760)

### 2.5 storageclass.yaml로 배포

```yaml title="sc.yaml"
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

```bash
kubectl apply sc.yaml
```

## 3. helm으로 Vault sidecar를 활용한 logrotate yaml 파일 준비

```yaml title="cm-logrotate.yaml"
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

### 3.1 vault helm으로 배포

#### 3.1.1 license secret 생성

```bash
touch vault.hclic # vault 라이센스 내용 첨부

vaultsecret=$(cat vault.hclic)

kubectl create secret generic vault-ent-license --from-literal="license=${vaultsecret}"
```

#### 3.1.2 eks 자격증명 secret 생성

```bash
kubectl create secret generic eks-creds \
  --from-literal=AWS_ACCESS_KEY_ID="[AWS_ACCESS_KEY_ID]" \
  --from-literal=AWS_SECRET_ACCESS_KEY="[AWS_SECRET_ACCESS_KEY]"
```

#### 3.1.3 vault helm values.yaml 배포

```yaml title="values.yaml"
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

#### 3.1.3 helm repo 등록 및 values.yaml 기반으로 vault 배포

```bash
helm repo add hashicorp https://helm.releases.hashicorp.com

helm repo list

# 설치
helm install vault hashicorp/vault -f values.yaml

# 삭제
helm uninstall vault hashicorp/vault -f values.yaml
```

#### 3.1.4 logrotate 적용 확인

![](./img/3044639401.png?width=760)

#### 3.1.5 auditlog-logrotate 설정 확인

![](./img/3044540515.png?width=760)

- 1M가 넘어가면 새로 생성 된 파일들은 압축파일로 변환 설정

![](./img/3044540525.png?width=760)

---

create by rlarlqja1001@gmail.com