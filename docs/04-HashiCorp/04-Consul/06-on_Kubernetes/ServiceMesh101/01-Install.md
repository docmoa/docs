---
meta:
  - name: description
    content: Consul Service Mesh on Kubernetes (Ent)
tags: ["Consul", "ServiceMesh", "K8s", "Kubernetes"]
---

# 01. Install

:::tip
실습을 위한 조건은 다음과 같습니다.

- Kubernetes 1.21 이상의 환경
- Consul binary <http://releases.hashicorp.com/consul/>
- Install helm 3
- Install Kubectl
- Consul Namespace 테스트는 Enterprise 라이선스가 필요합니다. : <http://consul.io/trial>
:::

> 참고 : <https://learn.hashicorp.com/collections/consul/kubernetes-production>

## Consul Gossip

다운받은 Consul 바이너리를 통해 Gossip 암호화 키를 생성합니다

```bash
kubectl create secret generic consul-gossip-encryption-key --from-literal=key=$(consul keygen)
```

## License (Option)

발급받은 라이선스 파일을 저장(e.g. consul.hclic)하고 Kubernetes의 secret으로 적용합니다.
```bash
kubectl create secret generic license --from-file='key=./consul.hclic'
```

## Helm

Helm repo add & update
```bash
helm repo add hashicorp https://helm.releases.hashicorp.com && \
helm repo update
```

## Helm Chart

> github : <https://github.com/hashicorp/consul-helm/blob/master/values.yaml>

Helm 설치를 위한 파일(e.g. value.yaml) 을 작성합니다.

- Enterprise
  - Enterprse 이미지 태그는 [hub.docker.com](https://hub.docker.com/r/hashicorp/consul-enterprise/tags)을 확인합니다.
  - 적용 시 `enterpriseLicense` 항목의 주석을 해제합니다.

```yaml
global:
  enabled: true
  name: consul
  image: hashicorp/consul-enterprise:1.11.3-ent
  enableConsulNamespaces: true
  adminPartitions:
    enabled: false
  datacenter: dc1
  # enterpriseLicense:
  #   secretName: license
  #   secretKey: key
  gossipEncryption:
    secretName: consul-gossip-encryption-key
    secretKey: key
  tls:
    enabled: false
    enableAutoEncrypt: true
  enableConsulNamespaces: true

client:
  enabled: true
  grpc: true

connectInject:
  enabled: true
  replicas: 2

dns:
  enabled: true

controller:
  enabled: true

syncCatalog:
  enabled: true
  toConsul: false
  consulNamespaces:
    mirroringK8S: true

```

## 설치

```bash
kubectl config use-context $(grep gs-cluster-0 KCONFIG.txt)
helm install consul -f ./values.yaml hashicorp/consul --version v0.40.0 --debug
```

## UI 확인

```bash
kubectl port-forward service/consul-server 8500:8500
```

<http://localhost:8500/ui>