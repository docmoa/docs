<template><div><h1 id="consul-vs-istio-performance-test" tabindex="-1"><a class="header-anchor" href="#consul-vs-istio-performance-test" aria-hidden="true">#</a> Consul vs Istio - Performance Test</h1>
<h2 id="_1-성능-테스트-수행-결과-요약" tabindex="-1"><a class="header-anchor" href="#_1-성능-테스트-수행-결과-요약" aria-hidden="true">#</a> 1. 성능 테스트 수행 결과 요약</h2>
<h3 id="case-2-1" tabindex="-1"><a class="header-anchor" href="#case-2-1" aria-hidden="true">#</a> Case 2-1</h3>
<ul>
<li>Consul Ingress Gateway의 resources.limits 와 resources.requests 의 cpu, memory 를 각각 250m / 500Mi 로 수정</li>
<li>Istio Default 1527 Requests/sec 대비 1860 Requests/sec 로 약 22% 빠름 (Case 2-1)</li>
</ul>
<h3 id="case-2-2" tabindex="-1"><a class="header-anchor" href="#case-2-2" aria-hidden="true">#</a> Case 2-2</h3>
<ul>
<li>Consul Ingress Gateway resource allocation을 Istio와 동률 구성 시,</li>
<li>Istio Default 1527 Requests/sec 대비 3002 Requests/sec로 약 196% 빠름 (Case 2-2)</li>
</ul>
<h3 id="response-time-chart" tabindex="-1"><a class="header-anchor" href="#response-time-chart" aria-hidden="true">#</a> Response Time Chart</h3>
<ul>
<li>concurrent user: 100</li>
<li>total request: 15000</li>
</ul>
<ChartJS id="chart-51" config="eJylkU9rhDAQxe9+iiGnLdgljv+wtyIUCr3tcdlDXOMiBC1JbFmK372TxN1Li1B7MTiZ995vJl8RALPXd8megKl+kCx2FSUaqRhQ7U1YOZyv0PbG6r6ZbD8OsDvI80PobIUVpHU+N52h/yN7EcZKY1kM7PlDanEha2AHNX666smJF7mR1kuCxz2dwutxMJOCVnZiUmR1a1hCj3zPecFj4PuEV+hOzMpy8aa+rlfOpxPKyHuxGXUrdT2qUbsMfWl2mBQxZGSQ8DzM5TtpckPjUhcF+OIc7n6SvhpazDponjtAXqSVBy0x/TtoSR6Jm5Q+20BrWjfgYwJht7+jZh6R5+iRsSo2oGKexoCcFlv8DxVXUfOAmuLy/JhtRE1SQkVerbOe6JijOfoG9cbHUg==" title="A%20Line%20Chart" type="json"></ChartJS><ul>
<li>상세 내용 확인 - &quot;4.성능 테스트 수행&quot;</li>
</ul>
<table>
<thead>
<tr>
<th style="text-align:left">Case</th>
<th>Resources: CPU</th>
<th>Resources: Memory</th>
<th>Limits: CPU</th>
<th>Limits: Memory</th>
<th>Performance</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">1-1. Consul Default</td>
<td>100 m</td>
<td>100 Mi</td>
<td>100 m</td>
<td>100 Mi</td>
<td>896 reqs / sec</td>
</tr>
<tr>
<td style="text-align:left">1-2. Istio Default</td>
<td>10 m</td>
<td>40 Mi</td>
<td>2 C</td>
<td>1 Gi</td>
<td>1527 reqs / sec</td>
</tr>
<tr>
<td style="text-align:left">2-1. Consul w/ alloc</td>
<td>250 m</td>
<td>500 Mi</td>
<td>250 m</td>
<td>500 Mi</td>
<td>1860 reqs / sec</td>
</tr>
<tr>
<td style="text-align:left">2-2. Consul resources like Istio</td>
<td>10 m</td>
<td>40 Mi</td>
<td>2 C</td>
<td>1 Gi</td>
<td>3002 reqs / sec</td>
</tr>
</tbody>
</table>
<h2 id="_2-시나리오" tabindex="-1"><a class="header-anchor" href="#_2-시나리오" aria-hidden="true">#</a> 2. 시나리오</h2>
<ul>
<li>Load Generator -&gt; Ingress Gateway -&gt; Sidecar -&gt; Test App 의 흐름으로 외부에서 유입되는 요청에 대한 응답 성능 측정</li>
</ul>
<h2 id="_3-환경-구성" tabindex="-1"><a class="header-anchor" href="#_3-환경-구성" aria-hidden="true">#</a> 3. 환경 구성</h2>
<ul>
<li>Load Generator VM: <a href="https://github.com/rakyll/hey" target="_blank" rel="noopener noreferrer">opensource 'hey'<ExternalLinkIcon/></a> 사용</li>
<li>Azure AKS
<ul>
<li>2 Worker Node</li>
<li>Azure CNI</li>
<li>namespace 분리</li>
</ul>
</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>kubectl create namespace consul	#consul namespace
kubectl create namespace istio-system #istio namespace
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-1-consul-구성" tabindex="-1"><a class="header-anchor" href="#_3-1-consul-구성" aria-hidden="true">#</a> 3-1. Consul 구성</h3>
<ul>
<li>Test 에서는 Sever / Client 모두 AKS 내 설치</li>
<li>Performance 관점에서 Server 의 위치에 따른 영향도 없음 (Data Plane 을 이용한 Traffic 운반이므로)</li>
<li>values.yaml</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>global:
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>설치</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>helm install consul hashicorp/consul --namespace consul --values values.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>Test App 배포: Fake Service</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># web-consul.yaml
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Service Mesh Config 설정: proxy-defaults</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># proxy-defaults.yaml
# kubectl apply -f proxy-defaults.yaml -nconsul

apiVersion: consul.hashicorp.com/v1alpha1
kind: ProxyDefaults
metadata:
  name: global
spec:
  config:
    protocol: http
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Service Mesh Config 설정: service-defaults</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># service-defaults.yaml
# kubectl apply -f service-defaults.yaml -nconsul

apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceDefaults
metadata:
  name: web-consul
spec:
  protocol: http
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Service Mesh Config 설정: ingress-gateway</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># ingress-gateway.yaml
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-istio-구성" tabindex="-1"><a class="header-anchor" href="#_3-2-istio-구성" aria-hidden="true">#</a> 3-2. Istio 구성</h3>
<ul>
<li>istioctl 설치: <a href="https://istio.io/latest/docs/setup/install/istioctl/" target="_blank" rel="noopener noreferrer">https://istio.io/latest/docs/setup/install/istioctl/<ExternalLinkIcon/></a></li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>curl -sL https://istio.io/downloadIstioctl | sh -
export PATH=$HOME/.istioctl/bin:$PATH
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>istio 설치: Demo Profile (Ingress Gateway 와 Istiod 만 설치되는 가장 가벼운 형태)
<ul>
<li><a href="https://istio.io/latest/docs/setup/additional-setup/config-profiles/" target="_blank" rel="noopener noreferrer">https://istio.io/latest/docs/setup/additional-setup/config-profiles/<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>istioctl install
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>Sidecar Injection 설정: namespace 'istio-system' 한정</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>kubectl label namespace istio-system istio-injection=enabled
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>Test App 배포: Fake Service</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># web-istio.yaml
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Service Mesh Config: Ingress Gateway</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># ingress-gateway.yaml
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Service Mesh Config: Virtual Service</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># virtual-service.yaml
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-성능-테스트-수행" tabindex="-1"><a class="header-anchor" href="#_4-성능-테스트-수행" aria-hidden="true">#</a> 4. 성능 테스트 수행</h2>
<p><strong>테스트 결과 요약</strong></p>
<table>
<thead>
<tr>
<th style="text-align:left">Case</th>
<th>Resources: CPU</th>
<th>Resources: Memory</th>
<th>Limits: CPU</th>
<th>Limits: Memory</th>
<th>Performance</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">1-1. Consul Default</td>
<td>100 m</td>
<td>100 Mi</td>
<td>100 m</td>
<td>100 Mi</td>
<td>896 reqs / sec</td>
</tr>
<tr>
<td style="text-align:left">1-2. Istio Default</td>
<td>10 m</td>
<td>40 Mi</td>
<td>2 C</td>
<td>1 Gi</td>
<td>1527 reqs / sec</td>
</tr>
<tr>
<td style="text-align:left">2-1. Consul w/ alloc</td>
<td>250 m</td>
<td>500 Mi</td>
<td>250 m</td>
<td>500 Mi</td>
<td>1860 reqs / sec</td>
</tr>
<tr>
<td style="text-align:left">2-2. same resources</td>
<td>10 m</td>
<td>40 Mi</td>
<td>2 C</td>
<td>1 Gi</td>
<td>3002 reqs / sec</td>
</tr>
</tbody>
</table>
<h3 id="case-1-1-consul-default" tabindex="-1"><a class="header-anchor" href="#case-1-1-consul-default" aria-hidden="true">#</a> Case 1-1. Consul Default</h3>
<ul>
<li>Consul Default (w/o any tuning): <strong>896 Requests / sec</strong></li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># concurrent user: 100
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="case-1-2-istio-w-o-any-tuning" tabindex="-1"><a class="header-anchor" href="#case-1-2-istio-w-o-any-tuning" aria-hidden="true">#</a> Case 1-2. Istio (w/o any tuning)</h3>
<ul>
<li>Istio (w/o any tuning): <strong>1527 Requests / sec</strong></li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># concurrent user: 100
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="case-2-1-consul-w-resource-allocation" tabindex="-1"><a class="header-anchor" href="#case-2-1-consul-w-resource-allocation" aria-hidden="true">#</a> Case 2-1. Consul w/ resource allocation</h3>
<ul>
<li>
<p>Consul w/ resource allocation: <strong>1860 Requests / sec (Case 1-2. Istio 1527 Requests / sec 대비 약 22% 빠름 )</strong></p>
<ul>
<li>Ingress Gateway: resources.limits 와 resources.requests 의 cpu / memory 를 각각 250m / 500Mi 로 수정</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># kubectl edit deployments consul-client-ingress-gateway -nconsul
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Sidecar: resources.limits 와 resources.requests 의 cpu / memory 를 각각 250m / 500Mi 로 수정</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># from 177th line..

        name: consul-sidecar
        resources:
          limits:
            cpu: 25m
            memory: 500Mi
          requests:
            cpu: 250m
            memory: 250Mi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Test</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>hyungwook@MacBook-Pro  ~  hey -n 15000 -c 100 http://20.200.225.63:8080/
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="case-2-2-consul-w-istio-resource-allocation-과-동률-구성" tabindex="-1"><a class="header-anchor" href="#case-2-2-consul-w-istio-resource-allocation-과-동률-구성" aria-hidden="true">#</a> Case 2-2. Consul w/ Istio Resource Allocation 과 동률 구성</h3>
<ul>
<li>
<p>Istio 의 Resource Allocation 과 동률 구성: <strong>3002 Requests / sec (Case 1-2. Istio 1527 Requests / sec 대비 약 2배 빠름 )</strong></p>
<ul>
<li>Istio Ingress Gateway resource allocation 확인 후 Consul 에 동일하게 적용</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># kubectl edit deployment istio-ingressgateway -nistio-system
# from 149th line..

        resources:
          limits:
            cpu: "2"
            memory: 1Gi
          requests:
            cpu: 10m
            memory: 40Mi
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Test</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code> 
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</div></template>


