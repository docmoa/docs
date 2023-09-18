<template><div><h1 id="jaeger를-활용한-consul-service-mesh-tracing" tabindex="-1"><a class="header-anchor" href="#jaeger를-활용한-consul-service-mesh-tracing" aria-hidden="true">#</a> Jaeger를 활용한 Consul Service Mesh Tracing</h1>
<h2 id="_0-사전-요구사항" tabindex="-1"><a class="header-anchor" href="#_0-사전-요구사항" aria-hidden="true">#</a> 0. 사전 요구사항</h2>
<h3 id="_1-consul-install" tabindex="-1"><a class="header-anchor" href="#_1-consul-install" aria-hidden="true">#</a> 1) Consul Install</h3>
<p>Jaeger 연동을 위해 Consul on K8s 환경을 구성합니다. 해당 가이드의 경우에는 <a href="">여기</a>를 참고하세요.</p>
<h4 id="_1-시크릿-생성-라이센스" tabindex="-1"><a class="header-anchor" href="#_1-시크릿-생성-라이센스" aria-hidden="true">#</a> (1) 시크릿 생성 - 라이센스</h4>
<ul>
<li>라이센스 파일 생성 및 시크릿 생성</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># license파일 생성</span>
<span class="token function">vi</span> consul.lic

<span class="token comment"># 생성한 license파일로 secret 생성</span>
kubectl create secret generic license --from-file<span class="token operator">=</span><span class="token string">'key=./consul.lic'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-시크릿-생성-gossip-key" tabindex="-1"><a class="header-anchor" href="#_2-시크릿-생성-gossip-key" aria-hidden="true">#</a> (2)  시크릿 생성 - Gossip Key</h4>
<ul>
<li>consul-gossip-encryption-key 시크릿 생성</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token assign-left variable">GOSSIP_KEY</span><span class="token operator">=</span><span class="token string">"VeQ8CHV3sDY/bHCseXC7PGXNTSXtWWvOzQKAaFFo9oE="</span>
kubectl patch secret consul-gossip-encryption-key <span class="token parameter variable">-n</span> consul <span class="token parameter variable">--patch</span><span class="token operator">=</span><span class="token string">'{"stringData":{"key": "$GOSSIP_KEY"}}'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-consul-helm-배포" tabindex="-1"><a class="header-anchor" href="#_3-consul-helm-배포" aria-hidden="true">#</a> (3) Consul Helm 배포</h4>
<p><code v-pre>values.yaml</code> 파일 수정 및 배포합니다.</p>
<ul>
<li><code v-pre>values.yaml</code> 파일 예시</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">global</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> consul
  <span class="token key atrule">datacenter</span><span class="token punctuation">:</span> dc1
  <span class="token key atrule">logLevel</span><span class="token punctuation">:</span> <span class="token string">"debug"</span>
  <span class="token key atrule">logJSON</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">image</span><span class="token punctuation">:</span> hashicorp/consul<span class="token punctuation">-</span>enterprise<span class="token punctuation">:</span>1.12.3<span class="token punctuation">-</span>ent
  <span class="token key atrule">gossipEncryption</span><span class="token punctuation">:</span>
    <span class="token key atrule">autoGenerate</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">tls</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token key atrule">enableAutoEncrypt</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token key atrule">verify</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token key atrule">httpsOnly</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">imageEnvoy</span><span class="token punctuation">:</span> envoyproxy/envoy<span class="token punctuation">:</span>v1.22<span class="token punctuation">-</span>latest
  <span class="token key atrule">enterpriseLicense</span><span class="token punctuation">:</span>
    <span class="token key atrule">secretName</span><span class="token punctuation">:</span> license
    <span class="token key atrule">secretKey</span><span class="token punctuation">:</span> key
<span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
<span class="token key atrule">client</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">exposeGossipPorts</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">extraConfig</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
    {
      "log_level": "debug"
    }</span>
  <span class="token key atrule">grpc</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">ui</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">service</span><span class="token punctuation">:</span>
    <span class="token key atrule">type</span><span class="token punctuation">:</span> LoadBalancer
<span class="token key atrule">connectInject</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">controller</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token comment">#terminatingGateways:</span>
  <span class="token comment">#enabled: true</span>
  <span class="token comment">#apiGateway:</span>
  <span class="token comment">#enabled: true</span>
  <span class="token comment">#image: "hashicorp/consul-api-gateway:latest"</span>
<span class="token key atrule">ingressGateways</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">gateways</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ingress<span class="token punctuation">-</span>gateway
    <span class="token key atrule">service</span><span class="token punctuation">:</span>
      <span class="token key atrule">type</span><span class="token punctuation">:</span> LoadBalancer
      <span class="token key atrule">ports</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-cert-manager-설치" tabindex="-1"><a class="header-anchor" href="#_1-cert-manager-설치" aria-hidden="true">#</a> <a href="https://cert-manager.io/docs/installation/" target="_blank" rel="noopener noreferrer">1. Cert-Manager 설치<ExternalLinkIcon/></a></h2>
<p>Jaeger를 설치할 때 cert-manager 설치가 필수적으로 요구됩니다.</p>
<blockquote>
<p>Since version 1.31 the Jaeger Operator uses webhooks to validate Jaeger custom resources (CRs). This requires an installed version of the cert-manager.</p>
</blockquote>
<ul>
<li><a href="https://cert-manager.io/docs/installation/#default-static-install" target="_blank" rel="noopener noreferrer">Yaml 배포<ExternalLinkIcon/></a></li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> https://github.com/cert-manager/cert-manager/releases/download/v1.9.1/cert-manager.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>cert-manager 파드 배포확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl get pods <span class="token parameter variable">-n</span> cert-manager
NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-6544c44c6b-z76nd              <span class="token number">1</span>/1     Running   <span class="token number">0</span>          25s
cert-manager-cainjector-5687864d5f-pdzbn   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          25s
cert-manager-webhook-785bb86798-v6phx      <span class="token number">1</span>/1     Running   <span class="token number">0</span>          25s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-jaeger-설치" tabindex="-1"><a class="header-anchor" href="#_2-jaeger-설치" aria-hidden="true">#</a> <a href="https://www.jaegertracing.io/docs/1.37/operator/" target="_blank" rel="noopener noreferrer">2. Jaeger 설치<ExternalLinkIcon/></a></h2>
<p>Tracing을 위해 Jaeger 공식 문서를 참고하여 K8s 환경에 Jaeger Operator를 설치합니다.</p>
<h3 id="_1-role-binding-배포-선택" tabindex="-1"><a class="header-anchor" href="#_1-role-binding-배포-선택" aria-hidden="true">#</a> (1) Role Binding 배포(선택)</h3>
<blockquote>
<p>💡참고 : 동일 네임스페이스 배포할 경우 해당 과정은 생략!</p>
</blockquote>
<ul>
<li>YAML 생성 : <code v-pre>consul-jaeger</code> RoleBinding 생성</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token comment"># role-binding.yaml</span>
<span class="token key atrule">kind</span><span class="token punctuation">:</span> RoleBinding
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jaeger<span class="token punctuation">-</span>operator<span class="token punctuation">-</span>in<span class="token punctuation">-</span>myproject
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> consul<span class="token punctuation">-</span>jaeger
<span class="token key atrule">subjects</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jaeger<span class="token punctuation">-</span>operator
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> observability
<span class="token key atrule">roleRef</span><span class="token punctuation">:</span>
  <span class="token key atrule">kind</span><span class="token punctuation">:</span> Role
  <span class="token key atrule">name</span><span class="token punctuation">:</span> jaeger<span class="token punctuation">-</span>operator
  <span class="token key atrule">apiGroup</span><span class="token punctuation">:</span> rbac.authorization.k8s.io
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>YAML 배포</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> role-binding.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-jaeger-operator-배포-crd-설치" tabindex="-1"><a class="header-anchor" href="#_2-jaeger-operator-배포-crd-설치" aria-hidden="true">#</a> (2) Jaeger Operator 배포(CRD 설치)</h3>
<p>Jaeger Operator를 배포하기 위한 <code v-pre>observbility</code> 네임스페이스를 생성합니다. 이때, 별도의 네임스페이스에 배포할 경우에는 다운받은 <code v-pre>.yaml</code>에 설저된 네임스페이스명을 변경하셔야 합니다. <a href="https://www.jaegertracing.io/docs/1.39/operator/#installing-the-operator-on-kubernetes" target="_blank" rel="noopener noreferrer">참고<ExternalLinkIcon/></a></p>
<ul>
<li>네임스페이스 생성 및 각종 리소스 배포</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl create namespace observability
kubectl create <span class="token parameter variable">-f</span> https://github.com/jaegertracing/jaeger-operator/releases/download/v1.37.0/jaeger-operator.yaml <span class="token parameter variable">-n</span> observability
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>배포된 <code v-pre>jaeger-operator</code> 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl get deployment jaeger-operator <span class="token parameter variable">-n</span> observability 
NAME              READY   UP-TO-DATE   AVAILABLE   AGE
jaeger-operator   <span class="token number">1</span>/1     <span class="token number">1</span>            <span class="token number">1</span>           2m30s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-jaeger-cr-배포-allinone" tabindex="-1"><a class="header-anchor" href="#_3-jaeger-cr-배포-allinone" aria-hidden="true">#</a> (3) Jaeger CR 배포 - AllInOne</h3>
<p>실제 K8s 환경에서 <code v-pre>Jaeger</code>리소스 생성을 위해 다음 <code v-pre>.yaml</code> 파일을 배포합니다. 본 문서에서는 편의상 <code v-pre>AllInOne</code> 이미지를 사용하여 배포합니다.</p>
<p><code v-pre>AllInOne</code> 이미지는 프로덕션 환경에서 사용하기에는 적합하지 않으며, Dev 또는 Test 목적으로 사용해야 합니다. <a href="https://www.jaegertracing.io/docs/1.37/operator/#allinone-default-strategy" target="_blank" rel="noopener noreferrer">(배포전략 참고)<ExternalLinkIcon/></a></p>
<blockquote>
<p>The simplest possible way to create a Jaeger instance is by creating a YAML file like the following example. This will install the default AllInOne strategy, which deploys the “all-in-one” image (agent, collector, query, ingester, Jaeger UI) in a single pod, using in-memory storage by default.</p>
</blockquote>
<ul>
<li>YAML 생성</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token comment"># simplest.yaml</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> jaegertracing.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Jaeger
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> simplest
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> observability
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>(참고) <a href="https://www.jaegertracing.io/docs/1.39/operator/#examples" target="_blank" rel="noopener noreferrer">Log Level 조정<ExternalLinkIcon/></a></li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token comment"># simplest-debug.yaml</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> jaegertracing.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Jaeger
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> simplest
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> observability
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">strategy</span><span class="token punctuation">:</span> allInOne
  <span class="token key atrule">allInOne</span><span class="token punctuation">:</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> jaegertracing/all<span class="token punctuation">-</span>in<span class="token punctuation">-</span>one<span class="token punctuation">:</span>latest
    <span class="token key atrule">options</span><span class="token punctuation">:</span>
      <span class="token key atrule">log-level</span><span class="token punctuation">:</span> debug
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>YAML 배포</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>kubectl apply -f simplest.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>배포 로그 확인
<ul>
<li><code v-pre>{&quot;level&quot;:&quot;info&quot;,&quot;ts&quot;:1661997111.1498919,&quot;caller&quot;:&quot;healthcheck/handler.go:129&quot;,&quot;msg&quot;:&quot;Health Check state change&quot;,&quot;status&quot;:&quot;ready&quot;}</code> 로그를 통해서 정상적인 상태 확인됨</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl logs <span class="token parameter variable">-l</span> app.kubernetes.io/instance<span class="token operator">=</span>simplest <span class="token parameter variable">-n</span> consul-jaeger
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"ts"</span>:1661997111.149404,<span class="token string">"caller"</span><span class="token builtin class-name">:</span><span class="token string">"channelz/funcs.go:340"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"[core][Channel #10] Channel Connectivity change to TRANSIENT_FAILURE"</span>,<span class="token string">"system"</span><span class="token builtin class-name">:</span><span class="token string">"grpc"</span>,<span class="token string">"grpc_log"</span>:true<span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"ts"</span>:1661997111.1495373,<span class="token string">"caller"</span><span class="token builtin class-name">:</span><span class="token string">"app/static_handler.go:181"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"UI config path not provided, config file will not be watched"</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"ts"</span>:1661997111.149864,<span class="token string">"caller"</span><span class="token builtin class-name">:</span><span class="token string">"app/server.go:217"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"Query server started"</span>,<span class="token string">"http_addr"</span><span class="token builtin class-name">:</span><span class="token string">"[::]:16686"</span>,<span class="token string">"grpc_addr"</span><span class="token builtin class-name">:</span><span class="token string">"[::]:16685"</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"ts"</span>:1661997111.1498919,<span class="token string">"caller"</span><span class="token builtin class-name">:</span><span class="token string">"healthcheck/handler.go:129"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"Health Check state change"</span>,<span class="token string">"status"</span><span class="token builtin class-name">:</span><span class="token string">"ready"</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"ts"</span>:1661997111.149912,<span class="token string">"caller"</span><span class="token builtin class-name">:</span><span class="token string">"app/server.go:300"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"Starting GRPC server"</span>,<span class="token string">"port"</span>:16685,<span class="token string">"addr"</span><span class="token builtin class-name">:</span><span class="token string">":16685"</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"ts"</span>:1661997111.1499252,<span class="token string">"caller"</span><span class="token builtin class-name">:</span><span class="token string">"channelz/funcs.go:340"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"[core][Server #9 ListenSocket #12] ListenSocket created"</span>,<span class="token string">"system"</span><span class="token builtin class-name">:</span><span class="token string">"grpc"</span>,<span class="token string">"grpc_log"</span>:true<span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"ts"</span>:1661997111.1499453,<span class="token string">"caller"</span><span class="token builtin class-name">:</span><span class="token string">"app/server.go:281"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"Starting HTTP server"</span>,<span class="token string">"port"</span>:16686,<span class="token string">"addr"</span><span class="token builtin class-name">:</span><span class="token string">":16686"</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"ts"</span>:1661997112.150468,<span class="token string">"caller"</span><span class="token builtin class-name">:</span><span class="token string">"channelz/funcs.go:340"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"[core][Channel #10 SubChannel #11] Subchannel Connectivity change to IDLE"</span>,<span class="token string">"system"</span><span class="token builtin class-name">:</span><span class="token string">"grpc"</span>,<span class="token string">"grpc_log"</span>:true<span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"ts"</span>:1661997112.1505697,<span class="token string">"caller"</span><span class="token builtin class-name">:</span><span class="token string">"grpclog/component.go:71"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"[core]pickfirstBalancer: UpdateSubConnState: 0xc00082a700, {IDLE connection error: desc = <span class="token entity" title="\&quot;">\"</span>transport: Error while dialing dial tcp :16685: connect: connection refused<span class="token entity" title="\&quot;">\"</span>}"</span>,<span class="token string">"system"</span><span class="token builtin class-name">:</span><span class="token string">"grpc"</span>,<span class="token string">"grpc_log"</span>:true<span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"ts"</span>:1661997112.1505857,<span class="token string">"caller"</span><span class="token builtin class-name">:</span><span class="token string">"channelz/funcs.go:340"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"[core][Channel #10] Channel Connectivity change to IDLE"</span>,<span class="token string">"system"</span><span class="token builtin class-name">:</span><span class="token string">"grpc"</span>,<span class="token string">"grpc_log"</span>:true<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-선택-jaeger-sidecar-배포-방식" tabindex="-1"><a class="header-anchor" href="#_4-선택-jaeger-sidecar-배포-방식" aria-hidden="true">#</a> (4) (선택) Jaeger Sidecar 배포 방식</h3>
<p>Jaeger Auto Injection 및 Manaul Injection 활용방안을 가이드합니다. (3)에서 <code v-pre>Jaeger</code>리소스를 직접 배포했다면 생략하셔도 됩니다.</p>
<h4 id="방안1-crd-배포" tabindex="-1"><a class="header-anchor" href="#방안1-crd-배포" aria-hidden="true">#</a> 방안1. CRD 배포</h4>
<p>해당 방안은 3)-(3)에서  작성한 방식으로, 관리되는 네임스페이스에 있는 애플리케이션의 tracing을 수행합니다.</p>
<h4 id="방안2-auto-injection-annotation-활용" tabindex="-1"><a class="header-anchor" href="#방안2-auto-injection-annotation-활용" aria-hidden="true">#</a> 방안2. Auto Injection - annotation 활용</h4>
<p>해당 방안은 annotation 절에   <code v-pre>&quot;sidecar.jaegertracing.io/inject&quot;: &quot;true&quot;</code> 를 기입하여 tracing 하고자 하는 애플리케이션에 sidecar auto-injection을 수행합니다.</p>
<ul>
<li>tracing 할 애플리케이션 deployment yaml의 annotation 위치</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> web<span class="token punctuation">-</span>deployment
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> web
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> observability
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">"sidecar.jaegertracing.io/inject"</span><span class="token punctuation">:</span> <span class="token string">'true'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="방안3-manual-injectio" tabindex="-1"><a class="header-anchor" href="#방안3-manual-injectio" aria-hidden="true">#</a> 방안3. Manual Injectio</h4>
<p>tracing 하고자 하는 애플리케이션에 직접 sidecar를 붙혀 tracing 합니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code>      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> jaeger<span class="token punctuation">-</span>agent
        <span class="token key atrule">image</span><span class="token punctuation">:</span> jaegertracing/jaeger<span class="token punctuation">-</span>agent<span class="token punctuation">:</span>latest
        <span class="token key atrule">imagePullPolicy</span><span class="token punctuation">:</span> IfNotPresent
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">5775</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> zk<span class="token punctuation">-</span>compact<span class="token punctuation">-</span>trft
            <span class="token key atrule">protocol</span><span class="token punctuation">:</span> UDP
          <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">5778</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> config<span class="token punctuation">-</span>rest
            <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
          <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">6831</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> jg<span class="token punctuation">-</span>compact<span class="token punctuation">-</span>trft
            <span class="token key atrule">protocol</span><span class="token punctuation">:</span> UDP
          <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">6832</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> jg<span class="token punctuation">-</span>binary<span class="token punctuation">-</span>trft
            <span class="token key atrule">protocol</span><span class="token punctuation">:</span> UDP
          <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">14271</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> admin<span class="token punctuation">-</span>http
            <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
        <span class="token key atrule">args</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>reporter.grpc.host<span class="token punctuation">-</span>port=dns<span class="token punctuation">:</span>///simplest<span class="token punctuation">-</span>collector<span class="token punctuation">-</span>headless.observability<span class="token punctuation">:</span><span class="token number">14250</span>
          <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>reporter.type=grpc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-jaeger-ui-접속" tabindex="-1"><a class="header-anchor" href="#_5-jaeger-ui-접속" aria-hidden="true">#</a> (5) Jaeger UI 접속</h3>
<p>기본적을 Jaeger UI는 <code v-pre>ClusterIP</code>로 배포됩니다. 외부에서 접속하기 위해 다음 몇 가지 방안을 제시합니다.</p>
<blockquote>
<p>참고 : 본 문서에서는 편의상 LoadBalancer 타입으로 변경하는 샘플을 제공합니다.</p>
</blockquote>
<ul>
<li>Ingress</li>
<li><strong>LoadBalancer</strong></li>
<li>Port-Forwarding</li>
</ul>
<p>기본적으로 Jaeager UI는 16686 Port를 사용합니다. 필자는 편읜상 <code v-pre>simplest-query</code> 서비스를 <code v-pre>LoadBalancer</code>타입으로 변경하여 조회합니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">spec</span><span class="token punctuation">:</span>
(중략)
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> http<span class="token punctuation">-</span>query
    <span class="token key atrule">nodePort</span><span class="token punctuation">:</span> <span class="token number">32731</span>
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">16686</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">16686</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> grpc<span class="token punctuation">-</span>query
    <span class="token key atrule">nodePort</span><span class="token punctuation">:</span> <span class="token number">31322</span>
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">16685</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">16685</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> jaeger
    <span class="token key atrule">app.kubernetes.io/component</span><span class="token punctuation">:</span> all<span class="token punctuation">-</span>in<span class="token punctuation">-</span>one
    <span class="token key atrule">app.kubernetes.io/instance</span><span class="token punctuation">:</span> simplest
    <span class="token key atrule">app.kubernetes.io/managed-by</span><span class="token punctuation">:</span> jaeger<span class="token punctuation">-</span>operator
    <span class="token key atrule">app.kubernetes.io/name</span><span class="token punctuation">:</span> simplest
    <span class="token key atrule">app.kubernetes.io/part-of</span><span class="token punctuation">:</span> jaeger
  <span class="token key atrule">sessionAffinity</span><span class="token punctuation">:</span> None
  <span class="token key atrule">type</span><span class="token punctuation">:</span> LoadBalancer
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Jaeger UI 예제</li>
</ul>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/tracing/images/jager_example.png" alt="image-20221110190509279" tabindex="0" loading="lazy"><figcaption>image-20221110190509279</figcaption></figure>
<h3 id="참고-jaeger와-다른-네임스페이스에-애플리케이션-사용할-경우" tabindex="-1"><a class="header-anchor" href="#참고-jaeger와-다른-네임스페이스에-애플리케이션-사용할-경우" aria-hidden="true">#</a> (참고) Jaeger와 다른 네임스페이스에 애플리케이션 사용할 경우</h3>
<h2 id="_3-consul-config-설정" tabindex="-1"><a class="header-anchor" href="#_3-consul-config-설정" aria-hidden="true">#</a> <a href="https://developer.hashicorp.com/consul/docs/connect/distributed-tracing" target="_blank" rel="noopener noreferrer">3. Consul Config 설정<ExternalLinkIcon/></a></h2>
<h3 id="_1-ingress-gateway" tabindex="-1"><a class="header-anchor" href="#_1-ingress-gateway" aria-hidden="true">#</a> (1)  Ingress Gateway</h3>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> consul.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> IngressGateway
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> ingress<span class="token punctuation">-</span>gateway
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> consul
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">listeners</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">5000</span>
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> http
      <span class="token key atrule">services</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> web
          <span class="token key atrule">hosts</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">'*'</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-service-defaults" tabindex="-1"><a class="header-anchor" href="#_2-service-defaults" aria-hidden="true">#</a> (2) Service Defaults</h3>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> consul.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceDefaults
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> web
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">protocol</span><span class="token punctuation">:</span> <span class="token string">"http"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-proxy-defaults" tabindex="-1"><a class="header-anchor" href="#_3-proxy-defaults" aria-hidden="true">#</a> (3) Proxy Defaults</h3>
<p><code v-pre>ProxyDefaults</code> 설정을 통해 Collector 서버에 대한 주소 및 Clustesr Name에 대해 선언합니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> consul.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ProxyDefaults
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> global
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> consul
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> http
    <span class="token key atrule">envoy_tracing_json</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
      {
        "http":{
          "name":"envoy.tracers.zipkin",
          "typedConfig":{
            "@type":"type.googleapis.com/envoy.config.trace.v3.ZipkinConfig",
            "collector_cluster":"simplest-collector",
            "collector_endpoint_version":"HTTP_JSON",
            "collector_endpoint":"/api/v2/spans",
            "shared_span_context":false
          }
        }
      }</span>
    <span class="token key atrule">envoy_extra_static_clusters_json</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
      {
        "connect_timeout":"3.000s",
        "dns_lookup_family":"V4_ONLY",
        "lb_policy":"ROUND_ROBIN",
        "load_assignment":{
          "cluster_name":"simplest-collector",
          "endpoints":[
            {
              "lb_endpoints":[
                {
                  "endpoint":{
                    "address":{
                      "socket_address":{
                        "address":"simplest-collector",
                        "port_value":9411,
                        "protocol":"TCP"
                      }
                    }
                  }
                }
              ]
            }
          ]
        },
        "name":"simplest-collector",
        "type":"STRICT_DNS"
      }</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_99-참고문서" tabindex="-1"><a class="header-anchor" href="#_99-참고문서" aria-hidden="true">#</a> 99) 참고문서</h3>
<ul>
<li>
<p>ingress gateway + tracing 고려사항 : <a href="https://developer.hashicorp.com/consul/docs/connect/distributed-tracing#considerations" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/consul/docs/connect/distributed-tracing#considerations<ExternalLinkIcon/></a></p>
</li>
<li>
<p><a href="https://github.com/jaegertracing/jaeger-operator.git" target="_blank" rel="noopener noreferrer">https://github.com/jaegertracing/jaeger-operator.git<ExternalLinkIcon/></a></p>
</li>
<li>
<p>jaeger 배포 helm chart : <a href="https://git.app.uib.no/caleno/helm-charts/-/tree/597accc8e61dfb3a78f2e4f1b9622c8d3f32b4f2/stable/jaeger-operator/templates" target="_blank" rel="noopener noreferrer">https://git.app.uib.no/caleno/helm-charts/-/tree/597accc8e61dfb3a78f2e4f1b9622c8d3f32b4f2/stable/jaeger-operator/templates<ExternalLinkIcon/></a></p>
</li>
</ul>
</div></template>


