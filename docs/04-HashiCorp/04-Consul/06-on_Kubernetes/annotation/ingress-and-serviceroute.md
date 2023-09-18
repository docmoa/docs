---
description: Consul Service Mesh on Kubernetes
tag: ["Consul", "ServiceMesh", "K8s", "Kubernetes", "ingress"]
---

# Ingress & ServiceRoute

Ingress gateway가 8080을 Listen하도록 구성되어있으면, 아래와 같이 해당 포트의 요청을 받을 대상 서비스를 지정합니다.

```yaml
apiVersion: consul.hashicorp.com/v1alpha1
kind: IngressGateway
metadata:
  name: ingress-gateway
spec:
  listeners:
    - port: 8080
      protocol: http
      services:
        - name: hashicups
          hosts: ["*"]
```

여기서 지정된 `hashicups`는 가상의 서비스 입니다. 해당 서비스에 대한 Service Router 설정을 다음과 같이 구성합니다.

```yaml
apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceRouter
metadata:
  name: hashicups
spec:
  routes:
    - match:
        http:
          pathPrefix: '/api'
      destination:
        service: public-api
    - match:
        http:
          pathPrefix: '/'
      destination:
        service: frontend
```