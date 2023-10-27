---
description: Kubernetes에서 Vault의 시크릿을 사용하는 CSI방식과 Injection방식에 대한 설명
tag: ["vault", "kubernetes"]
---
# How to integrate Vault with K8s (CSI & Injection & VSO)

Vault에 저장된 시크릿 또는 발행되는(Dynamic) 시크릿을 획득하기 위해서는, 시크릿을 요청하는 클라이언트(사람/앱/장비)가 다음의 과정을 수행해야 합니다.

1. 클라이언트가 Vault 토큰을 획득하기 위한 인증 절차
2. 획득한 Vault 토큰의 수명주기 관리 (갱신과 재요청)
3. Vault의 특정 시크릿 경로를 저장하고 해당 시크릿 요청
4. 동적(Dynamic) 시크릿인 경우 해당 임대(Lease)정보 확인 및 갱신과 재요청

Vault는 위의 과정을 클라이언트 대신 플랫폼 수준에서 대행할 수 있는 방안을 제공하고 있습니다. 여기서는 Kubernetes 상에서의 Vault와의 통합 구성을 활용하여 위 과정을 대체하고 Kubernetes 플랫폼 자체(Kuberetes Native)의 기능을 사용하듯 Vault의 시크릿을 사용하게 만드는 방식에 대해 설명합니다.

Kubernetes에 배포되는 컨테이너 애플리케이션이 Vault의 시크릿 데이터를 얻기위해 사용되는 플랫폼 수준(Kubernetes)에서의 통합을 설명합니다. CSI, Sidecar Injection, Vault Secret Operator ^VSO^에 대한 설명은 다음 글을 확인해 보세요.
- [Kubernetes Vault 통합방안 3가지 비교](https://docmoa.github.io/04-HashiCorp/06-Vault/04-UseCase/vault-k8s-integration-three-methods.html)
- [Minikube 기반 데모 환경](https://github.com/Great-Stone/vault-for-k8s)

::: info
아래 링크는 애플리케이션 또는 CICD 수준에서의 통합 예시 목록 입니다.
- [애플리케이션 수준의 통합 예시(Spring boot)](https://docmoa.github.io/04-HashiCorp/06-Vault/04-UseCase/spring-boot.html)
- [CICD 수준의 통합 예시(Jenkins)](https://docmoa.github.io/04-HashiCorp/06-Vault/04-UseCase/jenkins-with-vault.html)
- [CICD 수준의 통합 예시(ArgoCD)](https://docmoa.github.io/04-HashiCorp/06-Vault/04-UseCase/argocd-vault-plugin.html)
:::

::: tip
Vault와 Kuberentes간의 통합의 세가지 방식은 중복으로 적용 가능합니다.
:::

::: warning 준비사항
구성을 위한 사전 필요 사항은 다음과 같습니다.
- Vault CLI를 위한 바이너리
- Kubectl CLI 도구 및 대상 Kubernetes에 대한 구성 완료
- Helm CLI 도구
:::

## 1. CSI

> 참고 : <https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-secret-store-driver>

CSI 방식에서는 `SecretProviderClass` 가 Vault의 정보를 구성하는 역할을 수행하고, 이후 `deployment`에서 볼륨 형태로 호출하는 방식으로 구성됩니다.

![](./image/vault-csi-flow.png)

### 1.1 Kubernetes에 CSI 드라이버 설치

Container Storage Interface(CSI) 드라이버를 설치하면 `SecretProviderClass` CRD 구성을 사용하여 Kubernets에 외부 시크릿 저장소의 값을 Pod에 마운트 할 수 있습니다.

먼저 CSI 드라이버 Helm 차트를 등록합니다.

```bash
helm repo add secrets-store-csi-driver \
    https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
```

다음으로 CSI 드라이버를 설치 합니다.

```bash
helm install csi secrets-store-csi-driver/secrets-store-csi-driver \
    --set syncSecret.enabled=true
```

설치가 정상적으로 완료되면 다음의 Pod를 확인할 수 있습니다.

```bash
$ kubectl get pods

NAME                                 READY   STATUS    RESTARTS   AGE
csi-secrets-store-csi-driver-vkppq   3/3     Running   0          20s
```

### 1.2 CSI를 위한 Vault 구성 (Helm)

CSI 드라이버에서 `vault` 프로바이더를 사용하기 위한 구성을 설치해야 합니다. 이 구성이 설치되면 `SecretProviderClass` 정의 시 프로바이더 대상으로 `vault`를 지정할 수 있습니다.

먼저 Vault Helm 차트를 등록합니다.

```bash
helm repo add hashicorp https://helm.releases.hashicorp.com
```

Vault Helm 차트를 사용하여 1) Kubernetes에 Vault를 설치하는 구성 또는 2) 외부 Vault와 연계하는 구성으로 설치 할 수 있습니다.

::: tabs
@tab with Vault
```bash
helm install vault hashicorp/vault \
    --set "server.dev.enabled=true" \
    --set "injector.enabled=false" \
    --set "csi.enabled=true"
```
- `server.dev.enabled`: 개발 모드로 Vault 서버를 구성합니다. 운영 환경 구성시에는 사용하지 않습니다.
- `injector.enabled`: Sidecar Injection 방식이 기본 활성화되므로 비활성으로 정의합니다.
- `csi.enabled`: CSI 프로바이더 구성 설치를 위해 활성화 합니다.

@tab external Vault
```bash
helm install vault hashicorp/vault \
    --set "global.externalVaultAddr=$EXTERNAL_VAULT_ADDR" \
    --set "injector.enabled=false" \
    --set "csi.enabled=true"
```
- `global.externalVaultAddr`: 외부 Vault 주소를 입력 합니다.
- `injector.enabled`: Sidecar Injection 방식이 기본 활성화되므로 비활성으로 정의합니다.
- `csi.enabled`: CSI 프로바이더 구성 설치를 위해 활성화 합니다.

:::

설치가 정상적으로 완료되면 다음의 Pod를 확인할 수 있습니다. (`vault-0`는 Vault 서버를 설치한 경우 확인되고, 외부 Vault 서버를 사용하는 경우에는 확인되지 않습니다.)

```bash
$ kubectl get pods

NAME                                 READY   STATUS    RESTARTS   AGE
vault-0                    1/1     Running   0          58s
vault-csi-provider-t874l   1/1     Running   0          58s
```

### 1.3 CSI에서 사용할 Vault 시크릿 정의

간단한 예로 Vault KV 시크릿 엔진을 사용합니다.

::: warning Kubernetes내의 Vault에서 CLI 사용
Kubernetes내에 배포된 Vault인 경우 다음과 같이 쉘을 실행할 수 있도록 Pod에 접근합니다. (Optional)

```bash
kubectl exec -it vault-0 -- /bin/sh
```
:::

::: details /secret 경로에 KV 시크릿 엔진 활성화 (Optional)
Vault가 개발 모드로 실행된 경우 기본적으로 `Secret`이라는 경로에 KV version2 시크릿 엔진이 활성화되어있습니다. 만약 개발 모드가 아닌경우 다음과 같이 활성화 합니다. (Optional)

```bash
vault secrets enable -path secret -version=2 kv
```
:::

`secret/db-pass` 경로에 `password` 값을 저장 합니다.

```bash
vault kv put secret/db-pass password="db-secret-password-v1"
```

다음과 같이 저장된 값을 확인할 수 있습니다.

```bash
$ vault kv get secret/db-pass

=== Secret Path ===
secret/data/db-pass

======= Metadata =======
Key                Value
---                -----
created_time       2023-10-25T11:49:15.6993Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1

====== Data ======
Key         Value
---         -----
password    db-secret-password-v1
```

### 1.4 Vault에 인증받기 위한 Kubernetes 인증 방식 구성

Vault는 Kubernetes의 Service Account 토큰으로 인증할 수 있는 Kubernetes 인증 방식을 제공합니다. CSI 드라이버가 Vault에 저장된 시크릿 정보에 접근하여 시크릿을 획득하는 과정에서 Vault에 대한 인증/인가가 요구되므로 Kubernetes상의 리소스에서는 Kubernetes 인증 방식을 통해 Kubernetes의 방식으로 인증 받는 워크플로를 구성합니다.

Vault에 Kubernetes 인증 방식을 활성화 합니다.

```bash
vault auth enable kubernetes
```

Kubernetes API 주소를 Kubernetes 인증 방식 구성에 설정 합니다. 이 경우 자동으로 Vault Pod를 위한 자체 Service Account를 사용합니다.

::: code-tabs
@tab Internal Vault
```bash
vault write auth/kubernetes/config \
    kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443"
```

@tab External Vault
```bash
vault write auth/kubernetes/config \
    kubernetes_host="$EXTERNAL_VAULT_ADDR"
```

:::

생성할 Kubernetes 인증 방식의 롤 정의에서 사용되는 정책을 구성합니다. Vault의 `secret/data/db-pass` 경로에 저장된 시크릿을 읽을 수 있는 정책 입니다.

::: code-tabs
@tab Linux/MacOS
```bash
vault policy write internal-app - <<EOF
path "secret/data/db-pass" {
  capabilities = ["read"]
}
EOF
```
@tab Windows Powershell
```powershell:no-line-numbers
$policy = @"
path "secret/data/db-pass" {
  capabilities = ["read"]
}
"@

vault policy write injection-app - << $policy
```
:::

예제의 롤 정의에서는 허용할 Service Account와 Kubernetes Namespace, 부여하는 정책으로 앞서 생성한 `internal-app` 정책을 할당합니다. 인증된 이후 유효 기간은 20분으로 설정 합니다.

```bash
vault write auth/kubernetes/role/database \
    bound_service_account_names=webapp-sa \
    bound_service_account_namespaces=default \
    policies=internal-app \
    ttl=20m
```

### 1.5 SecretProviderClass 구성

`SecretProviderClass`를 사용하여 리소스 정의를 합니다. ==정의==를 할 뿐 시크릿을 읽는 동작을 수행하지는 않습니다. 다음 예제 리소스 `spc-vault-database.yaml`파일에 설정한 정의는 `vault` 프로바이더를 사용하는 경우의 파라미터를 설명합니다.

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: vault-database # CSI Provider로 호출될 이름
spec:
  provider: vault # CSI Provider 유형
  parameters:
    vaultAddress: "http://vault.default:8200"
    # Vault에 구성한 Kubernetes 인증의 Role 이름
    roleName: "database"
    # Vault 주소 - 기본은 vault.default로 서비스 이름을 참조하나,
    # 외부 Vault인경우 해당 주소를 지정해야 합니다.
    vaultAddress: "https://vault.default:8200"
    # Vault에 저장된 시크릿 경로와 대상을 지정합니다.
    objects: |
      - objectName: "db-password"
        secretPath: "secret/data/db-pass"
        secretKey: "password"
```

objects 항목은 리스트 구성으로 다수개의 시크릿을 정의할 수 있습니다.

- `objectName` : 해당 시크릿을 가리키는 이름으로, 최종적으로 이 이름으로 파일이 생성됨
- `secretPath` : Vault에 정의된 시크릿 경로 (KV version2의 경우 API 구조적으로 활성화된 경로 뒤에 `data`가 붙음)
- `secretKey` : Vault의 시크릿 경로 호출시 반환되는 값의 키 이름

설정한 `spc-vault-database.yaml`를 적용합니다.

```bash
kubectl apply -f spc-vault-database.yaml
```



앞서 1) CSI에 사용될 Vault 프로바이더가 설치되고, 2) 인증이 구성되고, 3) 인증을 위한 롤이 정의되고, 4) Vault에 시크릿 값이 저장되고, 5) `SecretProviderClass`가 정의되었습니다.

롤에서 정의한 허용하는 Service Account를 생성합니다.

```bash
kubectl create serviceaccount webapp-sa
```

앞서 생성된 `SecretProviderClass`를 `Volume`으로 정의하여 Pod 정의를 `webapp-pod.yaml`에 저장합니다.

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: webapp
spec:
  # 롤에서 허용하는 Service Account
  serviceAccountName: webapp-sa
  containers:
  - image: jweissig/app:0.0.1
    name: webapp
    volumeMounts:
    	# 아래 volumes에서 정의한 csi 이름
    - name: secrets-store-inline
    	# Pod에 마운트할 경로 지정
    	# 해당 경로 상에 SecretProviderClass에서 정의한 objectName으로 파일이 생성됨
      mountPath: "/mnt/secrets-store"
      # 마운트된 파일의 읽기/쓰기 여부
      readOnly: true
  volumes:
  	  # volumeMounts에서 정의될 이름
    - name: secrets-store-inline
      csi:
        driver: secrets-store.csi.k8s.io
        # 마운트된 파일의 읽기/쓰기 여부
        readOnly: true
        volumeAttributes:
        	# SecretProviderClass로 정의한 이름
          secretProviderClass: "vault-database"
```

`webapp-pod.yaml` 정의를 사용하여 Pod를 실행합니다. Pod가 실행되는 시점에 정의한 `SecretProviderClass`에 의해 지정한 위치에 Vault에 저장된 시크릿이 마운트 됩니다.

```bash
kubectl apply -f webapp-pod.yaml
```

실행된 Pod를 확인합니다.

```bash
$ kubectl get pods

NAME                                     READY   STATUS    RESTARTS   AGE
webapp                                   1/1     Running   0          5m
```

Pod 내에 마운트된 시크릿 정보를 확인합니다.

```bash {3}
$ kubectl exec webapp -- cat /mnt/secrets-store/db-password

db-secret-password-v1
```

### 1.7 시크릿 갱신

새로운 내용의 시크릿을 동일한 `secret/db-pass` 경로에 다시 저장합니다.

```bash {13}
$ vault kv put secret/db-pass password="db-secret-password-v2"

=== Secret Path ===
secret/data/db-pass

======= Metadata =======
Key                Value
---                -----
created_time       2023-10-27T00:06:52.910923Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            2
```

Vault의 시크릿이 변경되었지만 이전의 시크릿 정보로 마운트 된 기존 Pod에는 변경된 시크릿으로의 갱신이 발생하지 않습니다.

```bash
$ kubectl exec webapp -- cat /mnt/secrets-store/db-password

db-secret-password-v1
```

이번 예제에서는 Pod를 실행하였으므로, 이미 실행된 Pod를 종료시키고 다시 실행해야 변경된 시크릿을 다시 CSI 드라이버로 요청하여 마운트 됩니다.

기존 pod를 삭제 합니다.

```bash
kubectl delete pod webapp
```

이전의 정의를 다시 사용하여 Pod를 실행합니다.
```bash
kubectl apply -f webapp-pod.yaml
```

Vault의 변경된 시크릿이 적용된 것을 확인 합니다.

```bash {3}
$ kubectl exec webapp -- cat /mnt/secrets-store/db-password

db-secret-password-v2
```

## 2. Injecting

> 참고 1 : <https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-sidecar>
>
> 참고 2 : <https://www.hashicorp.com/blog/injecting-vault-secrets-into-kubernetes-pods-via-a-sidecar>
>
> 참고 3 : <https://developer.hashicorp.com/vault/docs/platform/k8s/injector/annotations>
>
> 참고 4 : <https://devopscube.com/vault-agent-injector-tutorial/>

BM/VM 환경에서는 Vault의 시크릿을 획득하고 갱신하는 과정을 지원하기 위해 Vault Agent를 활용할수 있습니다. Kubernetes에서는 애플리케이션 배포 시 Vault Agent를 사이트카로 구성하여 자동화된 구성과 해당 애플리케이션 만을 위한 Vault Agent를 제공할 수 있습니다.

사이드카 방식이 적용되도록 Kubernetes에 설치되면 `Sidecar Injector` 서비스가 실행되고, 이 서비스는 `annotation`이 정의된 배포를 후킹하여 Vault Agent 컨테이너를 주입(Injection) 합니다.

![](./image/vault-injection-flow.png)

### 2.1 Injection을 위한 Vault 구성 (Helm)

Kubernetes에 `Sidecar Injector` 서비스를 구성을 설치해야 합니다. 이 구성이 설치되면 `annotation`에 정의된 내용이 `vault-k8s` webhook을 호출하여 Pod를 재정의하여 Vault Agent를 사이드카로 주입(Injection)합니다.

먼저 Vault Helm 차트를 등록합니다.

```bash
helm repo add hashicorp https://helm.releases.hashicorp.com
```

Vault Helm 차트를 사용하여 1) Kubernetes에 Vault를 설치하는 구성 또는 2) 외부 Vault와 연계하는 구성으로 설치 할 수 있습니다.

::: tabs
@tab with Vault
```bash
helm install vault hashicorp/vault \
    --set "server.dev.enabled=true" \
    --set "injector.enabled=true"
```
- `server.dev.enabled`: 개발 모드로 Vault 서버를 구성합니다. 운영 환경 구성시에는 사용하지 않습니다.
- `injector.enabled`: Sidecar Injection 방식이 기본 값이 `true`이나, 명시적으로 선언합니다.

@tab external Vault
```bash
helm install vault hashicorp/vault \
    --set "global.externalVaultAddr=$EXTERNAL_VAULT_ADDR" \
    --set "injector.enabled=true"
```
- `global.externalVaultAddr`: 외부 Vault 주소를 입력 합니다.
- `injector.enabled`: Sidecar Injection 방식이 기본 값이 `true`이나, 명시적으로 선언합니다.

:::

설치가 정상적으로 완료되면 다음의 Pod를 확인할 수 있습니다.
- `vault-0`는 Vault 서버를 설치한 경우 확인되고, 외부 Vault 서버를 사용하는 경우에는 확인되지 않습니다.
- `vault-agent-injector-*` Pod는 `annotation` 기반으로 사이드카를 주입하는 역할을 담당합니다.

```bash
$ kubectl get pods

NAME                                    READY   STATUS    RESTARTS   AGE
vault-0                                 1/1     Running   0          80s
vault-agent-injector-5945fb98b5-tpglz   1/1     Running   0          80s
```

### 2.2 Injection에서 사용할 Vault 정적 시크릿 정의

Injection을 사용하여 Vault Agent를 사용할 수 있는 환경에서는 시크릿 업데이트를 자동으로 수행할 수 있고, KV 같은 정적(Static)인 시크릿의 경우 해당 시크릿의 생명주기 정보는 별도로 없기 때문에 이후 Injection 구성에서 변경을 확인할 시간 간격을 지정하게 됩니다.

예제에서는 KV를 활용합니다. Injection에서 사용할 KV 시크릿 엔진을 활성화합니다.

::: warning Kubernetes내의 Vault에서 CLI 사용
Kubernetes내에 배포된 Vault인 경우 다음과 같이 쉘을 실행할 수 있도록 Pod에 접근합니다. (Optional)

```bash
kubectl exec -it vault-0 -- /bin/sh
```
:::

```bash
vault secrets enable -path for-injection -version=2 kv
```

`for-injection/my-pass` 경로에 `password` 값을 저장 합니다.

```bash
$ vault kv put for-injection/my-pass password="my-secret-password-v1"

======= Secret Path =======
for-injection/data/my-pass

======= Metadata =======
Key                Value
---                -----
created_time       2023-10-27T00:41:16.656713Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1
```

::: details 저장된 시크릿 값을 확인
::: tabs
@tab CLI
```bash
$ vault kv get for-injection/my-pass

======= Secret Path =======
for-injection/data/my-pass

======= Metadata =======
Key                Value
---                -----
created_time       2023-10-27T00:41:16.656713Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1

====== Data ======
Key         Value
---         -----
password    my-secret-password-v1
```

@tab UI
![](./image/vault-injection-kv-check.png)


:::

### 2.3 Injection에서 사용할 Vault 동적 시크릿 정의

Injection을 사용하여 Vault Agent를 사용할 수 있는 환경에서는 시크릿 업데이트를 자동으로 수행할 수 있고, Database, PKI, Cloud Credential(AWS,Azure,GCP,Ali) 등 동적(Dynamic)인 시크릿의 경우 Vault Agent의 기존 방식 처럼 4/5 지점에서 갱신 작업을 수행 합니다.

예제에서는 PKI를 활용합니다. Injection에서 사용할 PKI 시크릿 엔진을 활성화 합니다.

::: warning Kubernetes내의 Vault에서 CLI 사용
Kubernetes내에 배포된 Vault인 경우 다음과 같이 쉘을 실행할 수 있도록 Pod에 접근합니다. (Optional)

```bash
kubectl exec -it vault-0 -- /bin/sh
```
:::

```bash
vault secrets enable -path=pki pki
vault secrets tune -max-lease-ttl=86400s -default-lease-ttl=3600s pki
```

루트 인증서를 생성합니다.

```bash
vault write -field=certificate pki/root/generate/internal \
  common_name="test" \
  ttl="86400h"
```

생성된 루트 인증서에 기반한 PKI 롤을 생성합니다. 예제에서는 동적 시크릿의 교체를 확인하기 위해 주기(`ttl`, `max_ttl`)를 짧게 구성합니다.

```bash
vault write pki/roles/my-role \
  key_bits=4096 \
  ttl="60s" \
  max_ttl="60s" \
  allow_ip_sans=true \
  allowed_domains="example.com,my.domain" \
  allow_subdomains=true
```

::: details PKI 인증서 발급 확인
::: tabs
@tab CLI
```bash
$ vault write pki/issue/my-role common_name=my-test.example.com

Key                 Value
---                 -----
ca_chain            [-----BEGIN CERTIFICATE-----
MIIDIDCCAgigAwIBAgIUR6Auk4MVpeis2oLq0StUwce/v/kwDQYJKoZIhvcNAQEL
BQAwDzENMAsGA1UEAxMEdGVzdDAeFw0yMzEwMjYyMzUyNDlaFw0yMzEwMjcyMzUz
MTlaMA8xDTALBgNVBAMTBHRlc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
AoIBAQDXmlaX2Qu/rF+AFgWqJBCaNPziJrwsBB8nEUQh2S2XRMD9osoliWpaS33i
iFAxc++Mec/FzKIsB7TskYWyFlv/GPmFG5gKdYfMuEMAgHrxM3OYWibQq0hDajJn
oOcT1DwCx0mZqYdGoFVcw2TdW1vqgKRMx1vWBskaJHoGGpRvEPe7cYLz8itwqQfR
7zkcVw3vdK6U50I7NnV/1wC+WOuwZ6IL5DKC1v3DtE5CrYKf/sBwDZfcdwFEjLpQ
3hSXlVtv6t9E7QABcYqFkP5iebisNVP71L1Qk7oCuk4zqKpkbFytD6Nlf1LMRSFj
SDt+aPuoqlmKrNtGsNcTqlW8k39HAgMBAAGjdDByMA4GA1UdDwEB/wQEAwIBBjAP
BgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTwEbHemyl86vBdxfMICjaKOJIoJzAf
BgNVHSMEGDAWgBTwEbHemyl86vBdxfMICjaKOJIoJzAPBgNVHREECDAGggR0ZXN0
MA0GCSqGSIb3DQEBCwUAA4IBAQB2y9QDCSNlr+j4v5H/7s4aZR8EWqbSdGc6F9w2
FrR/bwo9eIxWiABFn/SH+bqHSK7fw4TMPJ0rEnJxBEvIPpA2kvGIxsBzPAdPzQ+A
4F6tSJtiXB5A/7IZn9SQLUrcmcA5SuBGN9GjmPLpYSQg2ykJsTlExkYdg4co2sYV
0F1gE5SXFGEmNTwFlpPSmKY6Zs8fKJZrzf+feCXFRlD/u+I4vftJqu7pwxZvPifR
gPWi3kuzj71b4rEkZW3zNCP9XOtkCO/pNW2hJnc0QiTgQGvWXl/A8rIohsc+by2N
MVr8w8iw1OdwbxI0LyC5siVgn+aER5qryYlpdeKR0/F2LuWX
-----END CERTIFICATE-----]
certificate         -----BEGIN CERTIFICATE-----
MIIETjCCAzagAwIBAgIUbrsk5aFaFZ5MB9aeS9DjXlcEvFswDQYJKoZIhvcNAQEL
BQAwDzENMAsGA1UEAxMEdGVzdDAeFw0yMzEwMjcwMDU1MDlaFw0yMzEwMjcwMDU2
MDJaMB4xHDAaBgNVBAMTE215LXRlc3QuZXhhbXBsZS5jb20wggIiMA0GCSqGSIb3
DQEBAQUAA4ICDwAwggIKAoICAQDBSDy7gpekQv6Ro8p+4Szm8iavHv3KRyOoMYOv
UdRlT+2KT6UcZGc9c0RLYS1yvT2QuYm6CeFLs+msYU/mVdLG/ih8YlCiOG9uDyZi
CNqA+MOkxkwgChTfNgeOWQr8uo2J9CaV3bjProtE7weGaK/J5UYDTHxsZxMTom+t
dMCAHol8d888cqVUvHXOth07/OKO5orKBcsxFhq0IAwERNT3kGxIcfOFvhWJfNUn
ihdZMjq8u/CBaD3MhKU2Sn5e40FGLKuIoF0pMxhvPnJARiz53sAMMujoQxVgiIsQ
9DT8phhNKXqufjOYEUUJ0hy/quy+/i4B00SPNsOOcD8vOsz96mhZC9ik4Avz0xdB
KY0UaeULPmztdJW08dEaY1DSJB/k8rPMu4VZAFgxeFgj4byA9UwQ14aMJCZWHZYH
cGbkJjcdFEC1ZhICKIHOO0KSoXpxD9xIQ1UWYvoegqSBSqvecaYf6y52kg7hb4rg
jVFdBKWhBCGJ1RaqnbnBBp+Qk5AAkCyYfUpXXNmpYB7akIXLe3iTL50MkaiTd+GE
xBXhfCYvwbpIZu35bAurwp3+nSTTeJw4d2O7s1L4iqdQ24fERYwEL8euLzzmxsjv
qsmN1cHzbMulrCjVT3ZNBPFiMltoDJXyJDssKTM4nOpxr+FxBiCpbufcy2tDJ4eb
svMxiQIDAQABo4GSMIGPMA4GA1UdDwEB/wQEAwIDqDAdBgNVHSUEFjAUBggrBgEF
BQcDAQYIKwYBBQUHAwIwHQYDVR0OBBYEFGO3lOOstANAUseQaJmGMnCVQkw8MB8G
A1UdIwQYMBaAFPARsd6bKXzq8F3F8wgKNoo4kignMB4GA1UdEQQXMBWCE215LXRl
c3QuZXhhbXBsZS5jb20wDQYJKoZIhvcNAQELBQADggEBADT1aqab6RhLGuAvUgIS
3lZ+B/ltWFQroFRgnfQArlMrVnCE1/7LAH+i7n8Ev7ixK0xP2CYRLwm8McLBEIjm
qWB8ZXJJq4gXqZ6i5kIFvuRILkesSGJbs49TdeAMz6lyJd/BQmzM/uAhnqMrhlRt
H6ZWnC5Z7dRGWT/yIlKL6kMcmxqEZCTt7j76V/8CRRUtxHtEgt4B4R/0lykWM8Ed
HMok6crNYk94Jg/S8MWZlUHtCjDeXMd3mhDVQKaBNeLGjyugDF8KLVpcIMjEjglk
UDG/bqxqwS2/jVUnDFvejbrOkJ/e3NefZa52/fZlXwqnwAlumtHOgEk3j00rHQSA
/04=
-----END CERTIFICATE-----
expiration          1698368162
issuing_ca          -----BEGIN CERTIFICATE-----
MIIDIDCCAgigAwIBAgIUR6Auk4MVpeis2oLq0StUwce/v/kwDQYJKoZIhvcNAQEL
BQAwDzENMAsGA1UEAxMEdGVzdDAeFw0yMzEwMjYyMzUyNDlaFw0yMzEwMjcyMzUz
MTlaMA8xDTALBgNVBAMTBHRlc3QwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
AoIBAQDXmlaX2Qu/rF+AFgWqJBCaNPziJrwsBB8nEUQh2S2XRMD9osoliWpaS33i
iFAxc++Mec/FzKIsB7TskYWyFlv/GPmFG5gKdYfMuEMAgHrxM3OYWibQq0hDajJn
oOcT1DwCx0mZqYdGoFVcw2TdW1vqgKRMx1vWBskaJHoGGpRvEPe7cYLz8itwqQfR
7zkcVw3vdK6U50I7NnV/1wC+WOuwZ6IL5DKC1v3DtE5CrYKf/sBwDZfcdwFEjLpQ
3hSXlVtv6t9E7QABcYqFkP5iebisNVP71L1Qk7oCuk4zqKpkbFytD6Nlf1LMRSFj
SDt+aPuoqlmKrNtGsNcTqlW8k39HAgMBAAGjdDByMA4GA1UdDwEB/wQEAwIBBjAP
BgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTwEbHemyl86vBdxfMICjaKOJIoJzAf
BgNVHSMEGDAWgBTwEbHemyl86vBdxfMICjaKOJIoJzAPBgNVHREECDAGggR0ZXN0
MA0GCSqGSIb3DQEBCwUAA4IBAQB2y9QDCSNlr+j4v5H/7s4aZR8EWqbSdGc6F9w2
FrR/bwo9eIxWiABFn/SH+bqHSK7fw4TMPJ0rEnJxBEvIPpA2kvGIxsBzPAdPzQ+A
4F6tSJtiXB5A/7IZn9SQLUrcmcA5SuBGN9GjmPLpYSQg2ykJsTlExkYdg4co2sYV
0F1gE5SXFGEmNTwFlpPSmKY6Zs8fKJZrzf+feCXFRlD/u+I4vftJqu7pwxZvPifR
gPWi3kuzj71b4rEkZW3zNCP9XOtkCO/pNW2hJnc0QiTgQGvWXl/A8rIohsc+by2N
MVr8w8iw1OdwbxI0LyC5siVgn+aER5qryYlpdeKR0/F2LuWX
-----END CERTIFICATE-----
private_key         -----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
private_key_type    rsa
serial_number       6e:bb:24:e5:a1:5a:15:9e:4c:07:d6:9e:4b:d0:e3:5e:57:04:bc:5b
```

@tab UI
![](./image/vault-injection-pki-check-1.png)
![](./image/vault-injection-pki-check-2.png)
:::

### 2.4 Vault에 인증받기 위한 Kubernetes 인증 방식 구성

::: warning Kubernetes내의 Vault에서 CLI 사용
Kubernetes내에 배포된 Vault인 경우 다음과 같이 쉘을 실행할 수 있도록 Pod에 접근합니다. (Optional)

```bash
kubectl exec -it vault-0 -- /bin/sh
```
:::

Vault는 Kubernetes의 Service Account 토큰으로 인증할 수 있는 Kubernetes 인증 방식을 제공합니다. CSI 드라이버가 Vault에 저장된 시크릿 정보에 접근하여 시크릿을 획득하는 과정에서 Vault에 대한 인증/인가가 요구되므로 Kubernetes상의 리소스에서는 Kubernetes 인증 방식을 통해 Kubernetes의 방식으로 인증 받는 워크플로를 구성합니다.

Vault에 Kubernetes 인증 방식을 활성화 합니다. (이미 구성된 경우 실패합니다.)

```bash
vault auth enable kubernetes
```

Kubernetes API 주소를 Kubernetes 인증 방식 구성에 설정 합니다. 이 경우 자동으로 Vault Pod를 위한 자체 Service Account를 사용합니다.

::: code-tabs
@tab Internal Vault
```bash
vault write auth/kubernetes/config \
    kubernetes_host="https://$KUBERNETES_PORT_443_TCP_ADDR:443"
```

@tab External Vault
```bash
vault write auth/kubernetes/config \
    kubernetes_host="$EXTERNAL_VAULT_ADDR"
```

:::

생성할 Kubernetes 인증 방식의 롤 정의에서 사용되는 정책을 구성합니다. 생서한 Vault KV, PKI의 경로에 저장된 시크릿을 읽고 발행할 수 있는 정책 입니다.

::: code-tabs
@tab Linux/MacOS
```bash
vault policy write injection-app - <<EOF
path "for-injection/data/my-pass" {
  capabilities = ["read"]
}

path "pki/issue/my-role" {
  capabilities = ["create", "update"]
}
EOF
```
@tab Windows Powershell
```powershell:no-line-numbers
$policy = @"
path "for-injection/data/my-pass" {
  capabilities = ["read"]
}

path "pki/issue/my-role" {
  capabilities = ["create", "update"]
}
"@

vault policy write injection-app - << $policy
```
:::

예제의 롤 정의에서는 허용할 Service Account와 Kubernetes Namespace, 부여하는 정책으로 앞서 생성한 `injection-app` 정책을 할당합니다. 인증된 이후 유효 기간은 20분으로 설정 합니다.

```bash
vault write auth/kubernetes/role/injection \
    bound_service_account_names=webapp-vault \
    bound_service_account_namespaces=default \
    policies=injection-app \
    ttl=20m
```

### 2.5 Sidecar 적용된 애플리케이션 적용

롤에서 정의한 허용하는 Service Account를 생성합니다.

```bash
kubectl create sa webapp-vault
```

다음과 같이 정의된 `Deployment`를 `vault-sidecar-deployment.yml` 로 정의합니다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp-injection
  labels:
    app: issues
spec:
  selector:
    matchLabels:
      app: issues
  replicas: 1
  template:
    metadata:
      annotations:
        vault.hashicorp.com/agent-inject: "true"
        vault.hashicorp.com/agent-inject-status: "update"
        # KV의 정적 시크릿 저장 대상 파일과 텔플릿 정의
        vault.hashicorp.com/agent-inject-secret-my-config.txt: "for-injection/data/my-pass"
        vault.hashicorp.com/agent-inject-template-my-config.txt: |
          {{- with secret "for-injection/data/my-pass" -}}
          password={{ .Data.data.password }}
          {{- end }}
        # PKI의 동적 시크릿 저장 대상 파일과 템플릿 정의 - Cert
        vault.hashicorp.com/agent-inject-secret-cert.pem: "pki/issue/my-role"
        vault.hashicorp.com/agent-inject-template-cert.pem: |
          {{- with secret "pki/issue/my-role" "common_name=test.example.com" "ttl=30s" -}}
          {{ .Data.certificate }}
          {{ .Data.issuing_ca }}
          {{- end }}
        # PKI의 동적 시크릿 저장 대상 파일과 템플릿 정의 - Key
        vault.hashicorp.com/agent-inject-secret-key.pem: "pki/issue/my-role"
        vault.hashicorp.com/agent-inject-template-key.pem: |
          {{- with secret "pki/issue/my-role" "common_name=test.example.com" "ttl=30s" -}}
          {{ .Data.private_key }}
          {{- end }}
        # Vault의 Kubernetes인증으로 등록되어있는 Role 이름
        vault.hashicorp.com/role: "injection"
        vault.hashicorp.com/template-static-secret-render-interval: "10s"
      labels:
        app: issues
    spec:
      serviceAccountName: webapp-vault
      containers:
      - name: webapp
        image: jweissig/app:0.0.1
```

`spec.template.metadata.annotations`에 정의된 `vault.hashicorp.com`의 설명은 다음과 같습니다.
- `vault.hashicorp.com/agent-inject` : Vault Agent의 사이드카 구성 여부를 지정
- `vault.hashicorp.com/agent-inject-secret-\<filename>` : `filename`영역에 문자 값으로 자동 랜더링하여 저장
- `vault.hashicorp.com/agent-inject-template-\<filename>` : `filename`영역의 문자값으로 파일을 생성할 때 사용자 정의 방식이 필요한 경우 사용
- `vault.hashicorp.com/role` : kubernetes 인증에 정의한 롤 이름 지정
- `vault.hashicorp.com/template-static-secret-render-interval` : 정적인 시크릿에 대한 검사 주기 설정

정의한 `vault-sidecar-deployment.yml`를 적용합니다.

```bash
kubectl apply -f vault-sidecar-deployment.yml
```

생성된 Pod를 확인 합니다.

```bash
$ kubectl get pods

NAME                                   READY   STATUS    RESTARTS       AGE
webapp-injection-7768d64fd9-89kqn      2/2     Running   0              9m18s
```

Pod 내에 애플리케이션 컨테이너 `webapp`과 Vault Agent인 `vault-agent` 사이드카 컨테이너가 생성됨을 확인합니다.

```bash
$ kubectl get pods \
  $(kubectl get pod -l app=issues -o jsonpath="{.items[0].metadata.name}") \
  -o jsonpath='{.spec.containers[*].name}'

webapp vault-agent
```

Pod 내 생성된 작용된 시크릿을 확인 합니다.

```bash:no-line-numbers
$ kubectl exec \
  $(kubectl get pod -l app=issues -o jsonpath="{.items[0].metadata.name}") \
  -c webapp -- cat /vault/secrets/my-config.txt

password=my-secret-password-v1
```

```bash:no-line-numbers
$ kubectl exec \
  $(kubectl get pod -l app=issues -o jsonpath="{.items[0].metadata.name}") \
  -c webapp -- cat /vault/secrets/cert.pem

-----BEGIN CERTIFICATE-----
MIIESDCCAzCgAwIBAgIUKJqdIZIXXjE021NJzxnhP3Lihu0wDQYJKoZIhvcNAQEL
...생략...
Mk7y7BOjoZzXiqioAtk61FrjRwrc4vgJk9ESVeMnuJA8SorCAp3iNyVZJvU=
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
MIIDIDCCAgigAwIBAgIUR6Auk4MVpeis2oLq0StUwce/v/kwDQYJKoZIhvcNAQEL
...생략...
MVr8w8iw1OdwbxI0LyC5siVgn+aER5qryYlpdeKR0/F2LuWX
-----END CERTIFICATE-----
```

```bash:no-line-numbers
$ kubectl exec \
  $(kubectl get pod -l app=issues -o jsonpath="{.items[0].metadata.name}") \
  -c webapp -- cat /vault/secrets/key.pem

-----BEGIN RSA PRIVATE KEY-----
MIIJKAIBAAKCAgEAwSWRRLQ17lpKGaWGCOVaFIafd4NCe8u3LLMKSflutwMh3e7l
...생략...
cpxBcJwE+orZbH2TJAjVvqyfRrYflOLA6gqkbZd5W6zQClN3orb/E8UzEmg=
-----END RSA PRIVATE KEY-----
```

::: tip
기본 마운트 경로가 `/vault/secrets/<file-name>` 이므로, 변경이 필요한경우 다음의 `annotation` 정의를 추가할 수 있습니다.

```yaml
## 생략 ##
spec:
	template:
    metadata:
      annotations:
      	# 생략
        vault.hashicorp.com/agent-inject-file-database-config: "/some/secret/here.txt"
        vault.hashicorp.com/secret-volume-path-database-config: "/app"
```

결과 : `/app/some/secret/here.txt`
:::

### 2.6 정적 시크릿 자동 갱신

Vault Agent가 시크릿 데이터가 변경됨을 감지하고 대상 Pod에 저장되는 시크릿을 자동으로 갱신합니다.

정적 시크릿인 KV의 값을 변경해봅니다.

```bash
vault kv put for-injection/my-pass password="my-secret-password-v2"
```

다시 Pod내의 저장된 KV 시크릿 값을 확인합니다. 확인 간격을 10초로 정의했으므로, 갱신이 안된경우 다시 확인해봅니다.

```bash:no-line-numbers
$ kubectl exec \
  $(kubectl get pod -l app=issues -o jsonpath="{.items[0].metadata.name}") \
  -c webapp -- cat /vault/secrets/my-config.txt

password=my-secret-password-v2
```

### 2.7 동적 시크릿 자동 갱신

Vault가 생성하는 동적 시크릿은 `lease`에서 생성 후 수명주기를 관리합니다. Vault Agent는 생성한 동적 시크릿의 수명주기를 확인하여 만료되기 전 자동 연장(Renewal) 및 자동 갱신 합니다.

예제의 인증서의 수명을 `60s`로 정의하였으므로, 4/5 지점인 약 48초가 지나면 자동갱신됩니다. 앞서 랜더링된 인증서 확인 커맨드를 사용하여 변경되는 인증서를 확인합니다.

```bash:no-line-numbers {7}
$ kubectl exec \
  $(kubectl get pod -l app=issues -o jsonpath="{.items[0].metadata.name}") \
  -c webapp -- cat /vault/secrets/cert.pem

-----BEGIN CERTIFICATE-----
...생략...
Mk7y7BOjoZzXiqioAtk61FrjRwrc4vgJk9ESVeMnuJA8SorCAp3iNyVZJvU=
-----END CERTIFICATE-----
...생략...
```

```bash:no-line-numbers {7}
$ kubectl exec \
  $(kubectl get pod -l app=issues -o jsonpath="{.items[0].metadata.name}") \
  -c webapp -- cat /vault/secrets/cert.pem

-----BEGIN CERTIFICATE-----
...생략...
uDtXjqrZYtEI47dZjsVLxnBDLBoTRmzyxtywRezmvL2aMA5r9Z6WhhmFY2o=
-----END CERTIFICATE-----
...생략...
```

## 3. VSO ^Vault^ ^Secret^ ^Operator^ (작성중)

> 참고 1 : <https://developer.hashicorp.com/vault/tutorials/kubernetes/vault-secrets-operator>
>
> 참고 2 : <https://developer.hashicorp.com/vault/docs/platform/k8s/vso>

VSO를 사용하면 Pod가 기존 Kubernetes Secrets을 활용하여 시크릿을 사용하던 방식으로 Vault의 시크릿을 사용하게 됩니다. VSO는 CRD(Custom Resource Definitions)를 구성하여 Vault의 시크릿을 Kubernetes Secrets으로 동기화하는 동작을 수행합니다.

애플리케이션 수준, 또는 CSI와 사이드카 인젝션 방식의 구성 또한 Vault 시크릿을 사용하기 위한 다양한 방안을 제공했지만 애플리케이션 또는 기존 배포의 정의에 새로운 구성이 필요합니다. VSO는 Kubernetes의 Secret을 활용하여 기존 사용 경험을 유지하지만 Vault의 시크릿을 사용할 수 있는 방안을 제공합니다.

![](./image/vault-secrets-operator-flow.png)

현재 지원되는 버전은 다음과 같습니다. 변경 사항은 링크를 참고하세요. ([지원되는 Kubernetes 버전](https://developer.hashicorp.com/vault/docs/platform/k8s/vso#supported-kubernetes-versions))
<Badge type="tip" text="1.28" vertical="top" />
<Badge type="tip" text="1.27" vertical="top" />
<Badge type="tip" text="1.26" vertical="top" />
<Badge type="tip" text="1.25" vertical="top" />
<Badge type="tip" text="1.24" vertical="top" />

