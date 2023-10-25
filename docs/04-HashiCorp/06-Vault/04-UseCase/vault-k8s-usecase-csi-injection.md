---
description: Kubernetes에서 Vault의 시크릿을 사용하는 CSI방식과 Injection방식에 대한 설명
tag: ["vault", "kubernetes"]
---
# How to integrate Vault with K8s (CSI & Injection & VSO)

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

## 1. CSI

> 참고 : https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-secret-store-driver

CSI 방식에서는 `SecretProviderClass` 가 Vault의 정보를 구성하는 역할을 수행하고, 이후 `deployment`에서 볼륨 형태로 호출하는 방식으로 구성됩니다.

![](./image/vault-csi-flow.png)

구성을 위한 사전 필요 사항은 다음과 같습니다.
- Vault CLI를 위한 바이너리
- Kubectl CLI 도구 및 대상 Kubernetes에 대한 구성 완료
- Helm CLI 도구

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

::: warning /secret 경로에 KV 시크릿 엔진
Vault가 개발 모드로 실행된 경우 기본적으로 `Secret`이라는 경로에 KV version2 시크릿 엔진이 활성화되어있습니다. 만약 개발 모드가 아닌경우 다음과 같이 활성화 합니다. (Optional)

```bash
vault secrets enable -path secret -version=2 kv
```
:::

`secret/db-pass` 경로에 `password` 값을 저장 합니다.

```bash
vault kv put secret/db-pass password="db-secret-password"
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
password    db-secret-password
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

```bash
vault policy write internal-app - <<EOF
path "secret/data/db-pass" {
  capabilities = ["read"]
}
EOF
```

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

### 1.6 Pod에 마운트하기

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

```bash
$ kubectl exec webapp -- cat /mnt/secrets-store/db-password

db-secret-password
```

## 2. Injecting (작성중)

> 참고 1 :https://www.hashicorp.com/blog/injecting-vault-secrets-into-kubernetes-pods-via-a-sidecar
>
> 참고 2 : https://developer.hashicorp.com/vault/docs/platform/k8s/injector/annotations
>
> 참고 3 : https://devopscube.com/vault-agent-injector-tutorial/

Injecting 방식은 deployment 동작이 실행되는 시점에 `annotation`에 정의된 내용이 `vault-k8s` webhook을 호출하여 Pod를 재정의하는 방식입니다.

아래 `Deployment` 정의는 `ServiceAccount`인 `app`은 Vault에 Kubernetes 인증으로 등록되었다고 가정합니다.

- vault.hashicorp.com/agent-inject-secret-\<filename> : `filename`영역에 문자 값으로 자동 랜더링하여 저장
- vault.hashicorp.com/agent-inject-template-\<filename> : `filename`영역의 문자값으로 파일을 생성할 때 사용자 정의 방식이 필요한 경우 사용

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  labels:
    app: vault-agent-demo
spec:
  selector:
    matchLabels:
      app: vault-agent-demo
  replicas: 1
  template:
    metadata:
      annotations:
        vault.hashicorp.com/agent-inject: "true"
        vault.hashicorp.com/agent-inject-status: "update"
        vault.hashicorp.com/agent-inject-secret-database-config.txt: 'database/roles/app'
        vault.hashicorp.com/agent-inject-template-database-config.txt: |
          {{- with secret "database/creds/db-app" -}}
          username={{ .Data.username }}
          password={{ .Data.password }}
          {{- end }}
        # Vault의 Kubernetes인증으로 등록되어있는 Role 이름
        vault.hashicorp.com/role: "myapp"
        app: vault-agent-demo
    spec:
      serviceAccountName: app
      containers:
      - name: app
        image: jweissig/app:0.0.1
---
apiVersion: v1
kind: ServiceAccount
metadata:
  # Vault의 Kubernetes인증으로 등록되어있는 Role의 인증 대상 SA
  name: app
  labels:
    app: vault-agent-demo
```



```bash
$ kubectl exec -ti app-XXXXXXXXX -c app -- cat /vault/secrets/database-config.txt
username=db-username-from-vault
password=db-password-from-vault
```



기본 마운트 경로가 `/vault/secrets/<file-name>` 이므로, 변경이 필요한경우 다음의 `annotation` 정의를 추가할수 있다.

```yaml
## 생략 ##
spec:
	template:
    metadata:
      annotations:
      	## 생략 ##
				vault.hashicorp.com/agent-inject-file-database-config: "/some/secret/here.txt"
				vault.hashicorp.com/secret-volume-path-database-config: "/app"
```

결과 : `/app/some/secret/here.txt`


## 3. Vault Secret Operator ^VSO^ (작성중)