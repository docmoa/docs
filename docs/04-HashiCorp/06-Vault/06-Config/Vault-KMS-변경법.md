---
description: "vault container KMS"
tag: ["kubernetes", "KMS"]
author: gbkim
---

# **EKS Vault auto unseal에 대한 kms ID 변경 시 설정 법**

- [1. 사전 요구조건 및 KMS ID 정보 확인](#eksvaultautounseal에대한kmsid변경시설정법-1.사전요구조건및kmsid정보확인) 
  - [1.1 config.hcl 파일](#eksvaultautounseal에대한kmsid변경시설정법-1.1config.hcl파일)
  - [1.2 초기 vault helm 배포 시 kms ID 설정은 secret으로 관리](#eksvaultautounseal에대한kmsid변경시설정법-1.2초기vaulthelm배포시kmsid설정은secret으로관리)
  - [1.3 kms ID secret](#eksvaultautounseal에대한kmsid변경시설정법-1.3kmsidsecret)
- [2. KMS ID 변경](#eksvaultautounseal에대한kmsid변경시설정법-2.kmsid변경) 
  - [2.1 초기 KMS ID 확인](#eksvaultautounseal에대한kmsid변경시설정법-2.1초기kmsid확인)
  - [2.2 kubernetes에 올라간 config.hcl 정보가 암호화 된 secret 값](#eksvaultautounseal에대한kmsid변경시설정법-2.2kubernetes에올라간config.hcl정보가암호화된secret값)
  - [2.3 암호화 정보 복호화](#eksvaultautounseal에대한kmsid변경시설정법-2.3암호화정보복호화)
  - [2.3 vault 배포 시 Container 내부 KMS ID 값 확인](#eksvaultautounseal에대한kmsid변경시설정법-2.3vault배포시container내부kmsid값확인)
  - [2.3 변경 되는 KMS ID 변경](#eksvaultautounseal에대한kmsid변경시설정법-2.3변경되는kmsid변경)
  - [2.4 변경 된 config.hcl 파일 secret update](#eksvaultautounseal에대한kmsid변경시설정법-2.4변경된config.hcl파일secretupdate)
  - [2.5 변경 된 kubernetes에 올라간 config.hcl 정보가 암호화 된 secret 값](#eksvaultautounseal에대한kmsid변경시설정법-2.5변경된kubernetes에올라간config.hcl정보가암호화된secret값)
  - [2.6 변경 된 암호화 정보 복호화](#eksvaultautounseal에대한kmsid변경시설정법-2.6변경된암호화정보복호화)
  - [2.7 변경 된 secret 정보가 실제 pod 내 적용 되어 있는 확인](#eksvaultautounseal에대한kmsid변경시설정법-2.7변경된secret정보가실제pod내적용되어있는확인)
  - [2.8 KMS ID 변경 이후 auto-unseal 정상 작동 확인](#eksvaultautounseal에대한kmsid변경시설정법-2.8kmsid변경이후auto-unseal정상작동확인)
- [3. values.yaml](#eksvaultautounseal에대한kmsid변경시설정법-3.values.yaml)
# <a name="eksvaultautounseal에대한kmsid변경시설정법-1.사전요구조건및kmsid정보확인"></a>**1. 사전 요구조건 및 KMS ID 정보 확인**
## <a name="eksvaultautounseal에대한kmsid변경시설정법-1.1config.hcl파일"></a>**1.1 config.hcl 파일**
```
seal "awskms" {
            region     = "ap-northeast-2"
            kms_key_id = "[kms_key_id]"
          }
```

## <a name="eksvaultautounseal에대한kmsid변경시설정법-1.2초기vaulthelm배포시kmsid설정은secret으로관리"></a>**1.2 초기 vault helm 배포 시 kms ID 설정은 secret으로 관리**

```
values.yaml

중략

    extraArgs: "-config=/vault/userconfig/vault-seal-config/config.hcl"
    volumes:
      - name: userconfig-vault-seal-config
        secret:
          defaultMode: 420
          secretName: vault-seal-config
    volumeMounts:
      - mountPath: /vault/userconfig/vault-seal-config
        name: userconfig-vault-seal-config
        readOnly: true
```

## <a name="eksvaultautounseal에대한kmsid변경시설정법-1.3kmsidsecret"></a>**1.3 kms ID secret**
![](./img/3057419103.png?width=760)


# <a name="eksvaultautounseal에대한kmsid변경시설정법-2.kmsid변경"></a>**2. KMS ID 변경**
## <a name="eksvaultautounseal에대한kmsid변경시설정법-2.1초기kmsid확인"></a>**2.1 초기 KMS ID 확인**

```
seal "awskms" {
            region     = "ap-northeast-2"
            kms_key_id = "[kms_key_id]"
          }
```


## <a name="eksvaultautounseal에대한kmsid변경시설정법-2.2kubernetes에올라간config.hcl정보가암호화된secret값"></a>**2.2 kubernetes에 올라간 config.hcl 정보가 암호화 된 secret 값**
```
c2VhbCAiYXdza21zIiB7CiAgICAgICAgICByZWdpb24gICAgID0gImFwLW5vcnRoZWFzdC0yIgogICAgICAgICAga21zX2tleV9pZCA9ICJkNjJiNDJjYy0wM2UxLTQ5NTAtOTM2NC04ODMwMTQzZjVjNzAiCiAgICAgICAgfQo=
```
## <a name="eksvaultautounseal에대한kmsid변경시설정법-2.3암호화정보복호화"></a>**2.3 암호화 정보 복호화**
![](./img/3057386338.png?width=760)
## <a name="eksvaultautounseal에대한kmsid변경시설정법-2.3vault배포시container내부kmsid값확인"></a>**2.3 vault 배포 시 Container 내부 KMS ID 값 확인**
![](./img/3057320844.png?width=760)
## <a name="eksvaultautounseal에대한kmsid변경시설정법-2.3변경되는kmsid변경"></a>**2.3 변경 되는 KMS ID 변경**
- d62b42cc-03e1-4950-9364-8830143f5c70 => 8dc36bf2-c2f8-4686-bba1-f8ef143a2715 KMS ID 변경

```
seal "awskms" {
            region     = "ap-northeast-2"
            kms_key_id = "8dc36bf2-c2f8-4686-bba1-f8ef143a2715"
          }
```


## <a name="eksvaultautounseal에대한kmsid변경시설정법-2.4변경된config.hcl파일secretupdate"></a>**2.4 변경 된 config.hcl 파일 secret update**
```
kubectl create secret generic vault-seal-config --namespace=default  --from-file=./config.hcl --dry-run -o yaml | kubectl apply -f -
```

## <a name="eksvaultautounseal에대한kmsid변경시설정법-2.5변경된kubernetes에올라간config.hcl정보가암호화된secret값"></a>**2.5 변경 된 kubernetes에 올라간 config.hcl 정보가 암호화 된 secret 값**
```
c2VhbCAiYXdza21zIiB7CiAgICAgICAgICByZWdpb24gICAgID0gImFwLW5vcnRoZWFzdC0yIgogICAgICAgICAga21zX2tleV9pZCA9ICI4ZGMzNmJmMi1jMmY4LTQ2ODYtYmJhMS1mOGVmMTQzYTI3MTUiCiAgICAgICAgfQo=
```
## <a name="eksvaultautounseal에대한kmsid변경시설정법-2.6변경된암호화정보복호화"></a>**2.6 변경 된 암호화 정보 복호화**
![](./img/3057386338.png?width=760)
## <a name="eksvaultautounseal에대한kmsid변경시설정법-2.7변경된secret정보가실제pod내적용되어있는확인"></a>**2.7 변경 된 secret 정보가 실제 pod 내 적용 되어 있는 확인**
![](./img/3057189807.png?width=760)
## <a name="eksvaultautounseal에대한kmsid변경시설정법-2.8kmsid변경이후auto-unseal정상작동확인"></a>**2.8 KMS ID 변경 이후 auto-unseal 정상 작동 확인**
![](./img/3056829930.png?width=760)
# <a name="eksvaultautounseal에대한kmsid변경시설정법-3.values.yaml"></a>**3. values.yaml**


```
server:
  enterpriseLicense:
    secretName: vault-ent-license
  ha:
    enabled: true
    replicas: 1
    raft:
      enabled: true
      config: |
        ui = true

        listener "tcp" {
          tls_disable = 1
          address = "[::]:8200"
          cluster_address = "[::]:8201"
        }
        #seal "awskms" {
        #  region     = "ap-northeast-2"
        #  kms_key_id = "d62b42cc-03e1-4950-9364-8830143f5c70"
        #}
        storage "raft" {
          path = "/vault/data"
          retry_join {
            leader_api_addr = "https://vault-0.vault-internal:8200"
          }
        }
        service_registration "kubernetes" {}
  image:
    repository: hashicorp/vault-enterprise
    tag: 1.12.1-ent
  extraArgs: "-config=/vault/userconfig/vault-seal-config/config.hcl"
  extraSecretEnvironmentVars:
    - envName: AWS_ACCESS_KEY_ID
      secretName: eks-creds
      secretKey: AWS_ACCESS_KEY_ID
    - envName: AWS_SECRET_ACCESS_KEY
      secretName: eks-creds
      secretKey: AWS_SECRET_ACCESS_KEY
  volumes:
    - name: userconfig-vault-seal-config
      secret:
        defaultMode: 420
        secretName: vault-seal-config
  volumeMounts:
    - mountPath: /vault/userconfig/vault-seal-config
      name: userconfig-vault-seal-config
      readOnly: true
  service:
    type: LoadBalancer
    loadBalancerClass: service.k8s.aws/nlb
    annotations:
  dataStorage:
    enabled: true
    #storageClass: efs-sc
    size: 10Gi

```



create by rlarlqja1001@gmail.com