---
description: Consul Service Mesh on Kubernetes
tag: ["Consul", "ServiceMesh", "K8s", "Kubernetes", "annotation"]
---

# Multiport

> Consul Doc : <https://www.consul.io/docs/k8s/connect#kubernetes-pods-with-multiple-ports>

`annotation`  에 다음과 같이 서비스 이름과 대상 포트를 리스트로 지정합니다.

```yaml
consul.hashicorp.com/connect-inject: true
consul.hashicorp.com/transparent-proxy: false
consul.hashicorp.com/connect-service: web,web-admin
consul.hashicorp.com/connect-service-port: 8080,9090
```

포트가 서비스 이름과 동일한 순서로 나열되는 순서에 입니다. 즉, 첫 번째 서비스 이름 web은 첫 번째 포트인 8080에 해당합니다. 두 번째 서비스 이름 web-admin은 두 번째 포트인 9090에 해당합니다.

이 서비스를 호출하는 타 서비스의  Upstream은 다음과 같을 수 있습니다.

```yaml
consul.hashicorp.com/connect-service-upstreams: "web:1234,web-admin:2234"
```