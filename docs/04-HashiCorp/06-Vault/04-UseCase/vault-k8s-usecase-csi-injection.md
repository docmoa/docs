---
description: Kubernetes에서 Vault의 시크릿을 사용하는 CSI방식과 Injection방식에 대한 설명
tag: ["vault", "kubernetes"]
---
# Vault with K8s (CSI & Injection)


## 1. CSI

> 참고 : https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-secret-store-driver



CSI 방식에서는 `SecretProviderClass` 가 Vault의 정보를 구성하는 역할을 수행하고, 이후 `deployment`에서 볼륨 형태로 호출하는 방식으로 구성된다. 



### 1.1 SecretProviderClass 구성

```yaml
apiVersion: secrets-store.csi.x-k8s.io/v1
kind: SecretProviderClass
metadata:
  name: vault-database # CSI Provider로 호출될 이름
spec:
  provider: vault # CSI Provider 유형
  parameters:
  	# Vault에 구성한 Kubernetes 인증의 Role 이름
	  roleName: 'app'
	  # Vault 주소
    vaultAddress: "https://vault.default:8200"
    # TLS CA 인증서
    vaultCACertPath: '/vault/tls/ca.crt'
    roleName: "database"
    objects: |
      - objectName: "dbUsername"
        secretPath: "database/creds/db-app"
        secretKey: "username"
      - objectName: "dbPassword"
        secretPath: "database/creds/db-app"
        secretKey: "password"
```

objects 항목은 리스트 구성으로 다수개의 시크릿을 정의할 수 있다.

- `objectName` : 해당 시크릿을 가리키는 이름으로, 최종적으로 이 이름으로 파일이 생성됨
- `secretPath` : Vault에 정의된 시크릿 경로
- `secretKey` : Vault의 시크릿 경로 호출시 반환되는 값의 키 이름



### 1.2 Pod에 마운트하기

앞서 생성된 `SecretProviderClass`를 `Volume`으로 정의하여 대상 Pod에 마운트 시킨다.

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: webapp
spec:
  serviceAccountName: webapp-sa
  containers:
  - image: jweissig/app:0.0.1
    name: webapp
    volumeMounts:
    	# volumes에서 정의한 csi 이름
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



```bash
$ kubectl exec webapp -- cat /mnt/secrets-store/dbUsername
db-username-from-vault

$ kubectl exec webapp -- cat /mnt/secrets-store/dbPassword
db-password-from-vault
```



## 2. Injecting

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

