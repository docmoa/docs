---
meta:
  - name: description
    content: Vault Secrets Operator(이하, VSO)를 설치하고 구성하는 권고 방안이다.
tags: ["vault", "operator"]
---

# Vault Secrets Operator 설치

> 참고:
> 현재 Vault 비밀 오퍼레이터는 공개 베타 버전입니다. *[here](https://github.com/hashicorp/vault-secrets-operator/issues)*에서 GitHub 이슈를 개설하여 피드백을 제공해 주세요.


## 사전 요구사항

- Kubernetes 1.22+
- Vault OSS/Enterprise 1.11+

## Helm을 활용한 설치

[Vault Secrets Operator Helm chart](https://developer.hashicorp.com/vault/docs/platform/k8s/vso/helm)는 Vault Secrets Operator(이하, VSO)를 설치하고 구성하는 권고 방안이다.

VSO의 새 인스턴스를 설치하려면 먼저 HashiCorp Helm Repo를 추가하고 Chart에 액세스할 수 있는지 확인한다:

```bash
$helm repo add hashicorp https://helm.releases.hashicorp.com
"hashicorp" has been added to your repositories

$ helm search repo hashicorp/vault-secrets-operator --devel
NAME            CHART VERSION   APP VERSION DESCRIPTION
hashicorp/vault-secrets-operator    0.1.0-beta          0.1.0-beta      Official HashiCorp Vault Secrets Operator Chart
```

그런다음 Operator를 설치한다:

```shell-session
$ helm install --create-namespace --namespace vault-secrets-operator vault-secrets-operator hashicorp/vault-secrets-operator --version 0.1.0-beta
```

## Helm을 사용한 업그레이드

업그레이드는 기존 설치에서 `helm upgrade`로 수행할 수 있다. 설치 또는 업그레이드 전에 항상 `--dry-run`으로 헬름을 실행하여 변경 사항을 확인한다.

### Helm Chart Values

지원되는 모든 헬름 차트 값은 [here](https://developer.hashicorp.com/vault/docs/platform/k8s/vso/helm)에서 확인할 수 있다.