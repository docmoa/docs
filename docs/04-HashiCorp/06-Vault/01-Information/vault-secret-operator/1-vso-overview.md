---
description: Vault Secrets Operator(이하, VSO)를 사용하면 파드가 쿠버네티스 시크릿에서 기본적으로 볼트 시크릿을 사용할 수 있다.
tag: ["vault", "operator"]
---

# Vault Secrets Operator 개요

> 참고:
> 현재 Vault 비밀 오퍼레이터는 공개 베타 버전입니다. *[here](https://github.com/hashicorp/vault-secrets-operator/issues)*에서 GitHub 이슈를 개설하여 피드백을 제공해 주세요.

![img](https://external-preview.redd.it/UWYqK9zEwREq18MnMbIC7T6W5mUJbF_i4C2K3T1cV6Y.jpg?width=640&crop=smart&auto=webp&s=927dad31a962359c0b61c5ae57ce1d57f6957cf7)

Vault Secrets Operator(이하, VSO)를 사용하면 파드가 쿠버네티스 시크릿에서 기본적으로 볼트 시크릿을 사용할 수 있다.

## 개요

VSO는 지원되는 Custom Resource Definitions (CRD) 집합의 변경 사항을 감시하여 작동한다. 각 CRD는 오퍼레이터가 Vault Secrets을 Kubernetes Secret에 동기화할 수 있도록 하는 데 필요한 사양(specification)을 제공한다. 

오퍼레이터는 소스(source) 볼트 시크릿 데이터를 대상(destination) 쿠버네티스 시크릿에 직접 쓰며, 소스에 대한 변경 사항이 수명 기간 동안 대상에 복제되도록 한다. 이러한 방식으로 애플리케이션은 대상 시크릿에 대한 접근 권한만 있으면 그 안에 포함된 시크릿 데이터를 사용할 수 있다.

### 특징

VSO가 지원하는 기능은 다음과 같다:

- 모든 Vault 비밀 엔진 지원.
- Vault와의 TLS/mTLS 통신.
- [Kubernetes Auth Method](https://developer.hashicorp.com/vault/docs/auth/kubernetes)을 통해 요청하는 `Pod`의 `ServiceAccount`를 사용한 인증.
- Vault Secrets을 Kubernetes Secrets에 동기화.
- `Deployment`, ` ReplicaSet`, `StatefulSet`  쿠버네티스 리소스 유형에 대한 시크릿 로테이션.
- 운영자 모니터링을 위한 Prometheus 계측(instrumentation) 제공.
- 지원되는 설치 방법: `Helm`, `Kustomize`
- 자세한 내용은 *[installation](https://developer.hashicorp.com/vault/docs/platform/k8s/vso/installation)* 문서를 참조.

## 지원되는 쿠버네티스 버전

현재 지원되는 [Kubernetes minor releases](https://kubernetes.io/releases/)는 다음과 같다. 최신 버전은 각 쿠버네티스 버전에 대해 테스트되며, 다른 버전의 Kubernetes에서도 작동할 수 있지만 지원되지는 않는다.

- 1.26
- 1.25
- 1.24
- 1.23
- 1.22

## Vault 접근 및 사용자 지정 리소스 정의

> 참고: 
> 현재, 오퍼레이터는 쿠버네티스 인증 방법만 지원한다. 시간이 지남에 따라 더 많은 Vault 인증 방식에 대한 지원을 추가할 예정이다.

Vault 연결 및 인증 구성은 `VaultConnection` 및 `VaultAuth` CRD에서 제공한다. 이는 모든 비밀 복제 유형 리소스가 참조하는 기본 사용자 지정 리소스로 간주할 수 있다.

### `VaultConnection` 커스텀 리소스

오퍼레이터가 단일 Vault 서버 인스턴스에 연결하는 데 필요한 구성을 제공한다.

```yaml
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultConnection
metadata:
  namespace: vso-example
  name: example
spec:
  # 필수적인 구성정보
  # Vault 서버 주소
  address: http://vault.vault.svc.cluster.local:8200

  # 선택적인 구성정보
  # 모든 Vault 요청에 포함될 HTTP headers
  # headers: []
  
  # TLS 연결의 SNI 호스트로 사용할 TLS 서버 이름
  # tlsServerName: ""
  
  # Vault에 대한 TLS 연결에 대한 TLS verification을 건너뜀
  # skipTLSVerify: false
 
  # Kubernetes Secret에 저장된 신뢰할 수 있는 PEM 인코딩된 CA 인증서 체인
  # caCertSecretRef: ""
```

### VaultAuth 커스텀 리소스

오퍼레이터가 `VaultConnection` 사용자 지정 리소스에 지정된 대로 단일 Vault 서버 인스턴스에 인증하는 데 필요한 구성을 제공한다.

```yaml
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultAuth
metadata:
  namespace: vso-example
  name: example
spec:
  # 필수적인 구성정보
  # 해당 VaultConnection 커스텀 리소스의 VaultConnectionRef
  # 값을 지정하지 않으면 오퍼레이터는 자체 쿠버네티스 네임스페이스에 구성된 
  # 'default' VaultConnection을 기본값으로 사용
  vaultConnectionRef: example

  # Vault에 인증할 때 사용하는 방법.
  method: kubernetes
  # Auth methods로 인증할 때 사용할 마운트.
  mount: kubernetes
  # 쿠버네티스용 인증 구성을 사용하려면, Method를 쿠버네티스로 설정해야 함
  kubernetes:
    # Vault에 인증할 때 사용할 역할
    role: example
    # Vault에 인증할 때 사용할 서비스어카운트 파드/애플리케이션당 항상 고유한 서비스어카운트를 제공을 권장
    serviceAccount: default

  # 선택적인 구성정보
  # 인증 백엔드가 마운트되는 Vault 네임스페이스(Vault Enterprise 전용기능)
  # namespace: ""

  # Vault에 인증할 때 사용할 매개변수
  # params: []

  # 모든 Vault 인증 요청에 포함할 HTTP 헤더
  # headers: []
```

## 볼트 시크릿 커스텀 리소스 정의

오퍼레이터가 단일 볼트 시크릿을 단일 쿠버네티스 시크릿으로 복제하는 데 필요한 구성을 제공한다. 지원되는 각 CRD는 아래 문서에 설명된 Vault Secret의 *Class*에 특화되어 있다.

### `VaultStaticSecret` 사용자 지정 리소스

오퍼레이터가 단일 볼트 정적 시크릿을 단일 Kubernetes Secret에 동기화하는 데 필요한 구성을 제공한다.

- 지원되는 시크릿 엔진: [kv-v2](https://developer.hashicorp.com/vault/docs/secrets/kv/kv-v2), [kv-v1](https://developer.hashicorp.com/vault/docs/secrets/kv/kv-v1)

```yaml
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultStaticSecret
metadata:
  namespace: vso-example
  name: example
spec:
  vaultAuthRef: example
  mount: kvv2
  type: kv-v2
  name: secret
  refreshAfter: 60s
  destination:
    create: true
    name: static-secret1
```

### `VaultPKISecret` 사용자 지정 리소스

운영자가 단일 볼트 PKI 시크릿을 단일 쿠버네티스 시크릿에 동기화하는 데 필요한 구성을 제공한다.

- 지원되는 비밀 엔진: pki

```yaml
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultPKISecret
metadata:
  namespace: vso-example
  name: example
spec:
  vaultAuthRef: example
  mount: pki
  name: default
  commonName: example.com
  format: pem
  expiryOffset: 1s
  ttl: 60s
  namespace: tenant-1
  destination:
    create: true
    name: pki1
```

### VaultDynamicSecret Custom Resource

오퍼레이터가 단일 볼트 동적 시크릿을 단일 쿠버네티스 시크릿에 동기화하는 데 필요한 구성을 제공한다.

- 지원되는 시크릿 엔진은 전부가 아님 : [databases](https://developer.hashicorp.com/vault/docs/secrets/databases), [aws](https://developer.hashicorp.com/vault/docs/secrets/aws), [azure](https://developer.hashicorp.com/vault/docs/secrets/azure), [gcp](https://developer.hashicorp.com/vault/docs/secrets/gcp), ...

```yaml
---
apiVersion: secrets.hashicorp.com/v1alpha1
kind: VaultDynamicSecret
metadata:
  namespace: vso-example
  name: example
spec:
  vaultAuthRef: example
  mount: db
  role: postgres
  destination:
    create: true
    name: dynamic1
```

