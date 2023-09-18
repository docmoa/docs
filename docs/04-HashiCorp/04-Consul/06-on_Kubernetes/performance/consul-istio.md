---
description: K8S 환경에서 Consul / Istio Performance 비교
tag: ["Consul", "Istio", "Kubetenetes", "k8s", "Performance"]

---

# Consul vs Istio - Performance Test



## 1. 성능 테스트 수행 결과 요약

### Case 2-1
* Consul Ingress Gateway의 resources.limits 와 resources.requests 의 cpu, memory 를 각각 250m / 500Mi 로 수정
* Istio Default 1527 Requests/sec 대비 1860 Requests/sec 로 약 22% 빠름 (Case 2-1)

### Case 2-2
* Consul Ingress Gateway resource allocation을 Istio와 동률 구성 시, 
* Istio Default 1527 Requests/sec 대비 3002 Requests/sec로 약 196% 빠름 (Case 2-2)

### Response Time Chart

- concurrent user: 100
- total request: 15000

::: chart A Line Chart

```json
{
  "type": "line",
  "label" : "Latency distribution (Sec)",
  "data": {
    "labels": ["Fastest", "Average", "Slowest"],
    "datasets": [{
      "label": "Consul default",
      "data": [0.0060, 0.1092, 0.2477],
      "fill": false,
      "borderColor": "rgb(216, 42, 105)",
      "tension": 0.1
    },
    {
      "label": "Istio default",
      "data": [0.0055, 0.0639, 0.2723],
      "fill": false,
      "borderColor": "rgb(75, 192, 192)",
      "tension": 0.1
    },
    {
      "label": "Case 2-1 Consul",
      "data": [0.0049, 0.0525, 0.2963],
      "fill": false,
      "borderColor": "rgb(253, 206, 62)",
      "tension": 0.1
    },
    {
      "label": "Case 2-2 Consul",
      "data": [0.0059, 0.0322, 0.2424],
      "fill": false,
      "borderColor": "rgb(253, 136, 209)",
      "tension": 0.1
    }]
  }
}
```

:::

* 상세 내용 확인 - "4.성능 테스트 수행"

| Case                 | Resources: CPU | Resources: Memory | Limits: CPU | Limits: Memory | Performance     |
| :------------------- | -------------- | ----------------- | ----------- | -------------- | --------------- |
| 1-1. Consul Default  | 100 m          | 100 Mi            | 100 m       | 100 Mi         | 896 reqs / sec  |
| 1-2. Istio Default   | 10 m           | 40 Mi             | 2 C         | 1 Gi           | 1527 reqs / sec |
| 2-1. Consul w/ alloc | 250 m          | 500 Mi            | 250 m       | 500 Mi         | 1860 reqs / sec |
| 2-2. Consul resources like Istio  | 10 m           | 40 Mi             | 2 C         | 1 Gi           | 3002 reqs / sec |



## 2. 시나리오

- Load Generator -> Ingress Gateway -> Sidecar -> Test App 의 흐름으로 외부에서 유입되는 요청에 대한 응답 성능 측정 



## 3. 환경 구성

- Load Generator VM: [opensource 'hey'](https://github.com/rakyll/hey) 사용
- Azure AKS 
  - 2 Worker Node
  - Azure CNI
  - namespace 분리

```
kubectl create namespace consul	#consul namespace
kubectl create namespace istio-system #istio namespace
```



### 3-1. Consul 구성

- Test 에서는 Sever / Client 모두 AKS 내 설치
- Performance 관점에서 Server 의 위치에 따른 영향도 없음 (Data Plane 을 이용한 Traffic 운반이므로)
- values.yaml

```
global:
  enabled: true
  datacenter: dc1
  logLevel: "debug"
  logJSON: false
  image: hashicorp/consul-enterprise:1.12.3-ent
  gossipEncryption:
    secretKey: key
    secretName: consul-gossip-encryption-key
  tls:
    enabled: false
    enableConsulNamespaces: true
  imageEnvoy: envoyproxy/envoy:v1.22-latest
  enterpriseLicense:
    secretName: license
    secretKey: key
server:
  enabled: true
  replicas: 1
  bootstrapExpect: 1
  exposeGossipAndRPCPorts: true
client:
  enabled: true
  extraConfig: |
    {
      "log_level": "DEBUG"
    }
ui:
  enabled: true
  service:
    type: LoadBalancer
connectInject:
  enabled: true
  default: true
controller:
  enabled: true
ingressGateways:
  enabled: true
  defaults:
    replicas: 1
    service:
      type: LoadBalancer
      ports:
      - port: 80
```

- 설치

```
helm install consul hashicorp/consul --namespace consul --values values.yaml
```

- Test App 배포: Fake Service

```
# web-consul.yaml
# kubectl apply -f web-consul.yaml -nconsul

apiVersion: v1
kind: ServiceAccount
metadata:
  name: web-consul
---
apiVersion: v1
kind: Service
metadata:
  name: web-consul
spec:
  selector:
    app: web-consul
  ports:
    - port: 9090
      targetPort: 9090
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deploy-consul
  labels:
    app: web-consul
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web-consul
  template:
    metadata:
      labels:
        app: web-consul
      annotations:
        consul.hashicorp.com/connect-inject: 'true'
    spec:
      serviceAccountName: web-consul
      containers:
        - name: web-consul
          image: nicholasjackson/fake-service:v0.23.1
          ports:
            - containerPort: 9090
          env:
            - name: 'LISTEN_ADDR'
              value: '0.0.0.0:9090'
            - name: 'NAME'
              value: 'web'
            - name: 'MESSAGE'
              value: 'Hello World'
```

- Service Mesh Config 설정: proxy-defaults

```
# proxy-defaults.yaml
# kubectl apply -f proxy-defaults.yaml -nconsul

apiVersion: consul.hashicorp.com/v1alpha1
kind: ProxyDefaults
metadata:
  name: global
spec:
  config:
    protocol: http
```

- Service Mesh Config 설정: service-defaults

```
# service-defaults.yaml
# kubectl apply -f service-defaults.yaml -nconsul

apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceDefaults
metadata:
  name: web-consul
spec:
  protocol: http
```

- Service Mesh Config 설정: ingress-gateway

```
# ingress-gateway.yaml
# kubectl apply -f ingresss-gateway.yaml -nconsul

apiVersion: consul.hashicorp.com/v1alpha1
kind: IngressGateway
metadata:
  name: ingress-gateway
spec:
  listeners:
    - port: 80
      protocol: http
      services:
        - name: web-consul
```



### 3-2. Istio 구성 

- istioctl 설치: https://istio.io/latest/docs/setup/install/istioctl/

```
curl -sL https://istio.io/downloadIstioctl | sh -
export PATH=$HOME/.istioctl/bin:$PATH
```

- istio 설치: Demo Profile (Ingress Gateway 와 Istiod 만 설치되는 가장 가벼운 형태)
  - https://istio.io/latest/docs/setup/additional-setup/config-profiles/

```
istioctl install
```

- Sidecar Injection 설정: namespace 'istio-system' 한정

```
kubectl label namespace istio-system istio-injection=enabled
```

- Test App 배포: Fake Service

```
# web-istio.yaml
# kubectl apply -f web-istio.yaml -nistio-system

apiVersion: v1
kind: ServiceAccount
metadata:
  name: web-istio
---
apiVersion: v1
kind: Service
metadata:
  name: web-istio
spec:
  selector:
    app: web-istio
  ports:
    - port: 9090
      targetPort: 9090
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deploy-istio
  labels:
    app: web-istio
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web-istio
  template:
    metadata:
      labels:
        app: web-istio
    spec:
      serviceAccountName: web-istio
      containers:
        - name: web-istio
          image: nicholasjackson/fake-service:v0.23.1
          ports:
            - containerPort: 9090
          env:
            - name: 'LISTEN_ADDR'
              value: '0.0.0.0:9090'
            - name: 'NAME'
              value: 'web-istio'
            - name: 'MESSAGE'
              value: 'Hello World'
```

- Service Mesh Config: Ingress Gateway

```
# ingress-gateway.yaml
# kubectl apply -f ingress-gateway.yaml

apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: fakeservice-gateway
  namespace: istio-system
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
```

- Service Mesh Config: Virtual Service

```
# virtual-service.yaml
# kubectl apply -f virtual-service.yaml

apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: web-istio
  namespace: istio-system
spec:
  hosts:
  - "*"
  gateways:
  - fakeservice-gateway
  http:
  - match:
    - uri:
        exact: "/"
    route:
    - destination:
        host: web-istio
        port:
          number: 9090
```



## 4. 성능 테스트 수행 

**테스트 결과 요약**

| Case                 | Resources: CPU | Resources: Memory | Limits: CPU | Limits: Memory | Performance     |
| :------------------- | -------------- | ----------------- | ----------- | -------------- | --------------- |
| 1-1. Consul Default  | 100 m          | 100 Mi            | 100 m       | 100 Mi         | 896 reqs / sec  |
| 1-2. Istio Default   | 10 m           | 40 Mi             | 2 C         | 1 Gi           | 1527 reqs / sec |
| 2-1. Consul w/ alloc | 250 m          | 500 Mi            | 250 m       | 500 Mi         | 1860 reqs / sec |
| 2-2. same resources  | 10 m           | 40 Mi             | 2 C         | 1 Gi           | 3002 reqs / sec |



### Case 1-1. Consul Default

- Consul Default (w/o any tuning): **896 Requests / sec**

```
# concurrent user: 100
# total request: 15000

hyungwook@MacBook-Pro  ~  hey -n 15000 -c 100 http://20.200.225.63:8080/
Summary:
  Total:  16.7374 secs
  Slowest:  0.2477 secs
  Fastest:  0.0060 secs
  Average:  0.1092 secs
  Requests/sec: 896.1988
  Total data: 3865847 bytes
  Size/request: 257 bytes
Response time histogram: 0.006 [1] |
0.030 [828] |■■■■ 0.054 [100] |■
0.079 [144] |■
0.103 [7519] |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 0.127 [4063] |■■■■■■■■■■■■■■■■■■■■■■
0.151 [75] |
0.175 [199] |■
0.199 [1756] |■■■■■■■■■
0.224 [230] |■
0.248 [85] |
Latency distribution:
  10% in 0.0855 secs
  25% in 0.0958 secs
  50% in 0.1014 secs
  75% in 0.1091 secs
  90% in 0.1866 secs
  95% in 0.1946 secs
  99% in 0.2027 secs
Details (average, fastest, slowest):
  DNS+dialup: 0.0001 secs, 0.0060 secs, 0.2477 secs
  DNS-lookup: 0.0000 secs, 0.0000 secs, 0.0000 secs
  req write:  0.0000 secs, 0.0000 secs, 0.0052 secs
  resp wait:  0.1090 secs, 0.0058 secs, 0.2282 secs
  resp read:  0.0001 secs, 0.0000 secs, 0.0062 secs
Status code distribution:
  [200] 15000 responses
```



### Case 1-2. Istio (w/o any tuning)

- Istio (w/o any tuning): **1527 Requests / sec**

```
# concurrent user: 100
# total request: 15000

hyungwook@MacBook-Pro  ~  hey -n 15000 -c 100 http://20.196.248.118/
Summary:
  Total:  9.8192 secs
  Slowest:  0.2723 secs
  Fastest:  0.0055 secs
  Average:  0.0639 secs
  Requests/sec: 1527.6172
  Total data: 3804546 bytes
  Size/request: 253 bytes
Response time histogram:
0.006 [1] |
0.032 [1005] |■■■■■■■
0.059 [6144] |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 0.086 [5457] |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 0.112 [1887] |■■■■■■■■■■■■
0.139 [337] |■■ 0.166 [55] | 0.192 [5] | 0.219 [34] | 0.246 [60] | 0.272 [15] |
Latency distribution:
  10% in 0.0360 secs
  25% in 0.0467 secs
  50% in 0.0603 secs
  75% in 0.0772 secs
  90% in 0.0940 secs
  95% in 0.1051 secs
  99% in 0.1447 secs
Details (average, fastest, slowest):
  DNS+dialup: 0.0002 secs, 0.0055 secs, 0.2723 secs
  DNS-lookup: 0.0000 secs, 0.0000 secs, 0.0000 secs
   req write:  0.0000 secs, 0.0000 secs, 0.0063 secs
  resp wait:  0.0636 secs, 0.0055 secs, 0.2723 secs
  resp read:  0.0001 secs, 0.0000 secs, 0.0081 secs
Status code distribution:
  [200] 15000 responses
```



### Case 2-1. Consul w/ resource allocation

- Consul w/ resource allocation: **1860 Requests / sec (Case 1-2. Istio 1527 Requests / sec 대비 약 22% 빠름 )**

  - Ingress Gateway: resources.limits 와 resources.requests 의 cpu / memory 를 각각 250m / 500Mi 로 수정

  ```
  # kubectl edit deployments consul-client-ingress-gateway -nconsul
  # from 120th line..
  
          name: ingress-gateway
          ports:
          - containerPort: 21000
            name: gateway-health
            protocol: TCP
          - containerPort: 8080
            name: gateway-0
            protocol: TCP
          - containerPort: 9090
            name: gateway-1
            protocol: TCP
          readinessProbe:
            failureThreshold: 3
            initialDelaySeconds: 10
            periodSeconds: 10
            successThreshold: 1
            tcpSocket:
              port: 21000
            timeoutSeconds: 5
          resources:
            limits:
              cpu: 250m
              memory: 500Mi
            requests:
              cpu: 250m
              memory: 500Mi
  ```

  - Sidecar: resources.limits 와 resources.requests 의 cpu / memory 를 각각 250m / 500Mi 로 수정

  ```
  # from 177th line..
  
          name: consul-sidecar
          resources:
            limits:
              cpu: 25m
              memory: 500Mi
            requests:
              cpu: 250m
              memory: 250Mi
  ```

  - Test

  ```
  hyungwook@MacBook-Pro  ~  hey -n 15000 -c 100 http://20.200.225.63:8080/
  Summary:
    Total:  8.0605 secs
    Slowest:  0.2963 secs
    Fastest:  0.0049 secs
    Average:  0.0525 secs
    Requests/sec: 1860.9347
    Total data: 3867565 bytes
    Size/request: 257 bytes
  Response time histogram:
  0.005 [1] |
  0.034 [3890] |■■■■■■■■■■■■■■■■■■■■■■■■
  0.063 [6524] |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 0.092 [3937] |■■■■■■■■■■■■■■■■■■■■■■■■
  0.121 [496] |■■■
  0.151 [52] |
  0.180 [0] |
  0.209 [10] |
  0.238 [50] |
  0.267 [0] |
  0.296 [40] |
  Latency distribution:
    10% in 0.0237 secs
    25% in 0.0333 secs
    50% in 0.0506 secs
    75% in 0.0668 secs
    90% in 0.0803 secs
    95% in 0.0902 secs
    99% in 0.1224 secs
  Details (average, fastest, slowest):
    DNS+dialup: 0.0001 secs, 0.0049 secs, 0.2963 secs
    DNS-lookup: 0.0000 secs, 0.0000 secs, 0.0000 secs
    req write:  0.0000 secs, 0.0000 secs, 0.0165 secs
    resp wait:  0.0521 secs, 0.0049 secs, 0.2771 secs
    resp read:  0.0002 secs, 0.0000 secs, 0.0105 secs
  Status code distribution:
    [200] 15000 responses
  ```



### Case 2-2. Consul w/ Istio Resource Allocation 과 동률 구성

- Istio 의 Resource Allocation 과 동률 구성: **3002 Requests / sec (Case 1-2. Istio 1527 Requests / sec 대비 약 2배 빠름 )**

  - Istio Ingress Gateway resource allocation 확인 후 Consul 에 동일하게 적용

  ```
  # kubectl edit deployment istio-ingressgateway -nistio-system
  # from 149th line..
  
          resources:
            limits:
              cpu: "2"
              memory: 1Gi
            requests:
              cpu: 10m
              memory: 40Mi
  ```

  - Test

  ```
   
  hyungwook@MacBook-Pro  ~  hey -n 15000 -c 100 http://20.200.225.63:8080/
  Summary:
    Total:  4.9955 secs
    Slowest:  0.2424 secs
    Fastest:  0.0059 secs
    Average:  0.0322 secs
    Requests/sec: 3002.6970
    Total data: 3864684 bytes
    Size/request: 257 bytes
  Response time histogram:
  0.006 [1] |
  0.030 [8452] |■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 0.053 [5382] |■■■■■■■■■■■■■■■■■■■■■■■■■
  0.077 [772] |■■■■
  0.100 [80] |
  0.124 [112] |■
  0.148 [86] |
  0.171 [111] |■
  0.195 [3] |
  0.219 [0] |
  0.242 [1] |
  Latency distribution:
    10% in 0.0170 secs
    25% in 0.0216 secs
    50% in 0.0278 secs
    75% in 0.0361 secs
    90% in 0.0490 secs
    95% in 0.0614 secs
    99% in 0.1331 secs
  Details (average, fastest, slowest):
    DNS+dialup: 0.0001 secs, 0.0059 secs, 0.2424 secs
    DNS-lookup: 0.0000 secs, 0.0000 secs, 0.0000 secs
    req write:  0.0000 secs, 0.0000 secs, 0.0068 secs
    resp wait:  0.0319 secs, 0.0058 secs, 0.2424 secs
    resp read:  0.0001 secs, 0.0000 secs, 0.0064 secs
  Status code distribution:
    [200] 15000 responses
  ```

  

