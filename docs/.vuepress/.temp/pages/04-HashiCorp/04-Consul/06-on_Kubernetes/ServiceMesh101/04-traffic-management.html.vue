<template><div><h1 id="_04-트래픽-관리" tabindex="-1"><a class="header-anchor" href="#_04-트래픽-관리" aria-hidden="true">#</a> 04. 트래픽 관리</h1>
<p>실습을 진행하기 위한 디렉토리를 생성합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">mkdir</span> ./traffic
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Service Mesh는 HTTP 프로토콜 상에서 L7으로 동작하게 됩니다. 따라서 기본 프로토콜을 http로 변경합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">></span> ./traffic/service-to-service.yaml <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: consul.hashicorp.com/v1alpha1
kind: ProxyDefaults
metadata:
  name: global
spec:
  config:
    protocol: http
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> ./traffic/service-to-service.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 출력</span>
proxydefaults.consul.hashicorp.com/global created
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="샘플-앱-준비" tabindex="-1"><a class="header-anchor" href="#샘플-앱-준비" aria-hidden="true">#</a> 샘플 앱 준비</h2>
<h3 id="프론트엔드-서비스" tabindex="-1"><a class="header-anchor" href="#프론트엔드-서비스" aria-hidden="true">#</a> 프론트엔드 서비스</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">></span> ./traffic/gs-frontend.yaml <span class="token operator">&lt;&lt;</span><span class="token string">EOF
---
apiVersion: v1
kind: Service
metadata:
  name: gs-frontend
spec:
  selector:
    app: gs-frontend
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gs-frontend
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gs-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gs-frontend
  template:
    metadata:
      labels:
        app: gs-frontend
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9901"
        consul.hashicorp.com/connect-inject: "true"
        consul.hashicorp.com/transparent-proxy: true
        consul.hashicorp.com/connect-service-upstreams: "gs-backend:8080"
    spec:
      serviceAccountName: gs-frontend
      containers:
        - name: gs-frontend
          image: hahohh/consul-frontend-nodejs:v1.5
          env:
            - name: PORT
              value: "3000"
            - name: UPSTREAM_URL
              value: "http://localhost:8080
          ports:
            - containerPort: 3000
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>적용하기</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> ./traffic/gs-frontend.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="백엔드-서비스" tabindex="-1"><a class="header-anchor" href="#백엔드-서비스" aria-hidden="true">#</a> 백엔드 서비스</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">></span> ./traffic/gs-backend.yaml <span class="token operator">&lt;&lt;</span><span class="token string">EOF
---
apiVersion: v1
kind: Service
metadata:
  name: gs-backend
spec:
  selector:
    app: gs-backend
  ports:
    - protocol: TCP
      port: 8080
      targetPort: 8080
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gs-backend
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gs-backend-v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gs-backend
      version: v1
  template:
    metadata:
      labels:
        app: gs-backend
        version: v1
      annotations:
        consul.hashicorp.com/connect-inject: "true"
        consul.hashicorp.com/service-meta-version: v1
        consul.hashicorp.com/service-tags: v1
    spec:
      serviceAccountName: gs-backend
      containers:
        - name: gs-backend
          image: hahohh/consul-backend-go:v1.2
          env:
            - name: PORT
              value: "8080"
            - name: COLOR
              value: "green"
            - name: VERSION
              value: "v1"
          ports:
            - containerPort: 8080
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gs-backend-v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gs-backend
      version: v2
  template:
    metadata:
      labels:
        app: gs-backend
        version: v2
      annotations:
        consul.hashicorp.com/connect-inject: "true"
        consul.hashicorp.com/service-meta-version: v2
        consul.hashicorp.com/service-tags: v2
    spec:
      serviceAccountName: gs-backend
      containers:
        - name: gs-backend
          image: hahohh/consul-backend-go:v1.2
          env:
            - name: PORT
              value: "8080"
            - name: COLOR
              value: "blue"
            - name: VERSION
              value: "v2"
            # - name: ISFAIL
            #   value: "yyyy"
          ports:
            - containerPort: 8080
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>적용하기</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> ./traffic/gs-backend.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="서비스-intention" tabindex="-1"><a class="header-anchor" href="#서비스-intention" aria-hidden="true">#</a> 서비스 Intention</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">></span> ./traffic/service-to-service.yaml <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceIntentions
metadata:
  name: gs-backend
spec:
  destination:
    name: gs-backend
  sources:
    - name: gs-frontend
      action: allow
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>적용하기</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> ./traffic/service-to-service.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code v-pre>port-forward</code>를 통해 로컬에서 web 앱을 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubect l port-forward service/gs-frontend <span class="token number">3000</span>:3000 <span class="token parameter variable">--address</span> <span class="token number">0.0</span>.0.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 출력</span>
Forwarding from <span class="token number">0.0</span>.0.0:3000 -<span class="token operator">></span> <span class="token number">3000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000<ExternalLinkIcon/></a> 에 브라우저로 접속하여 상태를 확인합니다.</p>
<p>두개의 버전의 백엔드가 서로다른 갑을 리턴하여 때에 따라 v1, v2가 번갈아 나타납니다.</p>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/ServiceMesh101/images/03-traffic-v1.png" alt="v1" tabindex="0" loading="lazy"><figcaption>v1</figcaption></figure>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/ServiceMesh101/images/03-traffic-v2.png" alt="v2" tabindex="0" loading="lazy"><figcaption>v2</figcaption></figure>
<h2 id="트래픽-제어-요소" tabindex="-1"><a class="header-anchor" href="#트래픽-제어-요소" aria-hidden="true">#</a> 트래픽 제어 요소</h2>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/ServiceMesh101/images/03-traffic-methods.png" alt="traffic-method" tabindex="0" loading="lazy"><figcaption>traffic-method</figcaption></figure>
<ul>
<li>Resolver : 동일한 서비스 이름이 있더라도 조건에 따라 각 서비스를 독립적으로 정의합니다. (e.g. v1, v2, canary)</li>
<li>Splitter : 정의된 서비스로 가중치에 따라 트래픽을 분산합니다. 10000분율이 적용됩니다.</li>
<li>Router : HTTP, gRPC 속성 기반으로 정의된 서비르소 트래픽을 분산합니다.
<ul>
<li>pathPrefix / PathExact / PathRegex</li>
<li>Header</li>
<li>QueryParam</li>
</ul>
</li>
</ul>
<h3 id="resolve" tabindex="-1"><a class="header-anchor" href="#resolve" aria-hidden="true">#</a> Resolve</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">></span> ./traffic/service-resolver.yaml <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceResolver
metadata:
  name: gs-backend
spec:
  defaultSubset: v1
  subsets:
    v1:
      filter: "Service.Meta.version == v1"
    v2:
      filter: "Service.Meta.version == v2"
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>적용하기</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> ./traffic/service-resolver.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>앞서 배포된 <code v-pre>gs-backend</code> 의 <code v-pre>Deployment</code> 에 선언된 <code v-pre>annotation</code> 내용을 확인하면 <code v-pre>consul.hashicorp.com/service-meta-version: v2</code> 을 확인할 수 있습니다. Consul UI에서도 해당 Meta 정보를 확인할 수 있습니다. 선언된 정보를 기반으로 서비스의 <code v-pre>subset</code> 을 정의합니다.</p>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/ServiceMesh101/images/03-traffic-metadata.png" alt="service-meta" tabindex="0" loading="lazy"><figcaption>service-meta</figcaption></figure>
<h3 id="splitter" tabindex="-1"><a class="header-anchor" href="#splitter" aria-hidden="true">#</a> Splitter</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">></span> ./traffic/service-splitter.yaml <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceSplitter
metadata:
  name: gs-backend
spec:
  splits:
    - weight: 50
      serviceSubset: v1
    - weight: 50
      serviceSubset: v2
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>적용하기</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> ./traffic/service-splitter.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code v-pre>weight</code>에 지정된 비율로 Resolve된 서비스 대상 <code v-pre>subset</code> 에 트래픽을 분산합니다. <code v-pre>weight</code>값을 0:100, 100:0 등으로 변경하여 요청의 결과가 어떻게 변화하는지 확인해 봅니다.</p>
<ul>
<li><a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000<ExternalLinkIcon/></a></li>
</ul>
<h3 id="router" tabindex="-1"><a class="header-anchor" href="#router" aria-hidden="true">#</a> Router</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">></span> ./traffic/service-router.yaml <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceRouter
metadata:
  name: gs-backend
spec:
  routes:
    - match:
        http:
          pathPrefix: '/v1'
      destination:
        service: gs-backend
        serviceSubset: v1
    - match:
        http:
          pathPrefix: '/v2'
      destination:
        service: gs-backend
        serviceSubset: v2
    - match:
        http:
          queryParam:
            - name: version
              exact: 'v1'
      destination:
        service: gs-backend
        serviceSubset: v1
    - match:
        http:
          queryParam:
            - name: version
              exact: 'v2'
      destination:
        service: gs-backend
        serviceSubset: v2
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>적용하기</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> ./traffic/service-router.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>예제에서는 url의 path, queryParam을 예로 트래픽을 컨트롤 합니다. 다음과같이 요청하여 트래픽이 조정되는 것을 확인합니다.</p>
<ul>
<li><a href="http://localhost:3000/v1" target="_blank" rel="noopener noreferrer">http://localhost:3000/v1<ExternalLinkIcon/></a></li>
<li><a href="http://localhost:3000/v2" target="_blank" rel="noopener noreferrer">http://localhost:3000/v2<ExternalLinkIcon/></a></li>
<li><a href="http://localhost:3000/?version=v1" target="_blank" rel="noopener noreferrer">http://localhost:3000/?version=v1<ExternalLinkIcon/></a></li>
<li><a href="http://localhost:3000/?version=v2" target="_blank" rel="noopener noreferrer">http://localhost:3000/?version=v2<ExternalLinkIcon/></a></li>
</ul>
<h3 id="서비스-intention-l7" tabindex="-1"><a class="header-anchor" href="#서비스-intention-l7" aria-hidden="true">#</a> 서비스 Intention (L7)</h3>
<p>service-to-service 허용 방식에도 Meshod, Path 등을 지정할 수 있습니다. 다음과 같이 변경하고 POST만 넣은 상태에서는 어떻게 동작하는지 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">></span> ./traffic/service-to-service.yaml <span class="token operator">&lt;&lt;</span>EOF
apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceIntentions
metadata:
  name: gs-backend
spec:
  destination:
    name: gs-backend
  sources:
    - name: gs-frontend
      permissions:
        - action: allow
          http:
            pathPrefix: /
            <span class="token comment"># methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD']</span>
            methods: <span class="token punctuation">[</span><span class="token string">'POST'</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>적용하기</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> ./traffic/service-to-service.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>다시 앱간의 요청인  <code v-pre>GET</code>으로 변경하고 트래픽 허용여부를 확인해봅니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">></span> ./traffic/service-to-service.yaml <span class="token operator">&lt;&lt;</span>EOF
apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceIntentions
metadata:
  name: gs-backend
spec:
  destination:
    name: gs-backend
  sources:
    - name: gs-frontend
      permissions:
        - action: allow
          http:
            pathPrefix: /
            <span class="token comment"># methods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD']</span>
            methods: <span class="token punctuation">[</span><span class="token string">'GET'</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>적용하기</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> ./traffic/service-to-service.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="consul-ui-routing-table" tabindex="-1"><a class="header-anchor" href="#consul-ui-routing-table" aria-hidden="true">#</a> Consul UI Routing table</h2>
<p>Consul UI에 접속하여 <code v-pre>gs-backend</code>의 <code v-pre>Routing</code> 탭을 클릭, 구성된 Resolver, Splitter, Router가 어떻게 구성되었는지, 각 서비스에는 어떤 조건으로 요청할 수 있는지 확인합니다.</p>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/ServiceMesh101/images/03-traffic-routeui.png" alt="ui" tabindex="0" loading="lazy"><figcaption>ui</figcaption></figure>
</div></template>


