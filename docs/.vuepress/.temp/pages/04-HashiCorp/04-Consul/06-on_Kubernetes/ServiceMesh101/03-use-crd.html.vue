<template><div><h1 id="_03-crd로-consul-serive-mesh-관리" tabindex="-1"><a class="header-anchor" href="#_03-crd로-consul-serive-mesh-관리" aria-hidden="true">#</a> 03. CRD로 Consul Serive Mesh 관리</h1>
<blockquote>
<p>참고 : <a href="https://learn.hashicorp.com/tutorials/consul/kubernetes-custom-resource-definitions?in=consul/kubernetes" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/consul/kubernetes-custom-resource-definitions?in=consul/kubernetes<ExternalLinkIcon/></a></p>
<p>참고 : <a href="https://learn.hashicorp.com/tutorials/consul/service-mesh-zero-trust-network?in=consul/gs-consul-service-mesh" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/consul/service-mesh-zero-trust-network?in=consul/gs-consul-service-mesh<ExternalLinkIcon/></a></p>
</blockquote>
<p>Consul 1.9 이전에는 Kubernetes에서 Consul과 함께 구성 항목을 사용할 때 운영자가 실행 중인 컨테이너에 들어가거나 로컬 Consul 바이너리를 사용하여 구성해야 했습니다. 1.9 이전 버전에서는 구성 항목을 Consul CLI, HTTP API로 관리하거나 시작하는 동안 구성 파일로 에이전트에 제공해야 합니다.</p>
<p>Consul 1.9부터 대부분의 구성 항목은 Kubernetes 사용자 지정 리소스 정의(CRD)로 관리할 수 있습니다. 이제 대부분의 구성 항목을 YAML로 정의하고 익숙한 <code v-pre>kubectl apply</code>명령을 사용하여 Consul에 등록할 수 있습니다.</p>
<p>현재 Kubernetes에서 Consul의 CRD로 사용할 수 있는 구성 항목은 다음과 같습니다.</p>
<ul>
<li><a href="https://learn.hashicorp.com/tutorials/consul/kubernetes-custom-resource-definitions?in=consul/kubernetes#proxy-defaults" target="_blank" rel="noopener noreferrer"><code v-pre>proxy-defaults</code><ExternalLinkIcon/></a>- 프록시 구성 제어</li>
<li><a href="https://learn.hashicorp.com/tutorials/consul/kubernetes-custom-resource-definitions?in=consul/kubernetes#service-defaults" target="_blank" rel="noopener noreferrer"><code v-pre>service-defaults</code><ExternalLinkIcon/></a>- 주어진 서비스의 모든 인스턴스에 대한 기본값을 구성합니다.</li>
<li><a href="https://learn.hashicorp.com/tutorials/consul/kubernetes-custom-resource-definitions?in=consul/kubernetes#service-resolver" target="_blank" rel="noopener noreferrer"><code v-pre>service-resolver</code><ExternalLinkIcon/></a>- 서비스 인스턴스를 특정 Connect 업스트림 검색 요청과 일치시킵니다.</li>
<li><a href="https://learn.hashicorp.com/tutorials/consul/kubernetes-custom-resource-definitions?in=consul/kubernetes#service-router" target="_blank" rel="noopener noreferrer"><code v-pre>service-router</code><ExternalLinkIcon/></a>- HTTP 경로를 기반으로 레이어 7 트래픽을 보낼 위치를 정의합니다.</li>
<li><a href="https://learn.hashicorp.com/tutorials/consul/kubernetes-custom-resource-definitions?in=consul/kubernetes#service-splitter" target="_blank" rel="noopener noreferrer"><code v-pre>service-splitter</code><ExternalLinkIcon/></a>- 백분율에 따라 단일 HTTP 경로에 대한 요청을 나누는 방법을 정의합니다.</li>
<li><a href="https://learn.hashicorp.com/tutorials/consul/kubernetes-custom-resource-definitions?in=consul/kubernetes#service-intentions" target="_blank" rel="noopener noreferrer"><code v-pre>service-intentions</code><ExternalLinkIcon/></a>- 특정 서비스 대 서비스 상호 작용에 대한 제한을 정의합니다.</li>
</ul>
<h2 id="샘플-애플리케이션-준비" tabindex="-1"><a class="header-anchor" href="#샘플-애플리케이션-준비" aria-hidden="true">#</a> 샘플 애플리케이션 준비</h2>
<p>필요한 애플리케이션을 다운로드 받습니다. git clone 또는 <a href="https://github.com/hashicorp/learn-consul-kubernetes" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/learn-consul-kubernetes<ExternalLinkIcon/></a> 로 접속하여 Code를 다운로드 받습니다.</p>
<ul>
<li>
<p>git clone</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/hashicorp/learn-consul-kubernetes.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>Code download</p>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/ServiceMesh101/images/03-use-crd-github.png" alt="image-20220219195033888" tabindex="0" loading="lazy"><figcaption>image-20220219195033888</figcaption></figure>
</li>
</ul>
<p>다운로드 후 <code v-pre>learn-consul-kubernetes/service-mesh/deploy</code> 경로로 이동하고 샘플 구성을 반영합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">cd</span> learn-consul-kubernetes/service-mesh/deploy
kubectl apply <span class="token parameter variable">-f</span> hashicups/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 출력</span>
service/frontend created
serviceaccount/frontend created
servicedefaults.consul.hashicorp.com/frontend created
configmap/nginx-configmap created
deployment.apps/frontend created
service/postgres created
serviceaccount/postgres created
servicedefaults.consul.hashicorp.com/postgres created
deployment.apps/postgres created
service/product-api created
serviceaccount/product-api created
servicedefaults.consul.hashicorp.com/product-api created
configmap/db-configmap created
deployment.apps/product-api created
service/public-api created
serviceaccount/public-api created
servicedefaults.consul.hashicorp.com/public-api created
deployment.apps/public-api created
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>서비스는 Consul이 각 서비스에 대한 프록시를 자동으로 삽입할 수 있도록 하는 <code v-pre>annotation</code> 을 사용합니다. 프록시 는 Consul의 구성을 기반으로 서비스 간의 요청을 처리하기 위해 <strong>데이터 플레인을 생성합니다.</strong> Consul이 주입되는 label을 선택하여 프록시가 있는 응용 프로그램을 확인할 수 있습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl get pods <span class="token parameter variable">--selector</span> consul.hashicorp.com/connect-inject-status<span class="token operator">=</span>injected
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 출력</span>
NAME                           READY   STATUS    RESTARTS   AGE
frontend-98cb6859b-6ndvk       <span class="token number">2</span>/2     Running   <span class="token number">0</span>          3m10s
postgres-6ccb6d9968-hkbgz      <span class="token number">2</span>/2     Running   <span class="token number">0</span>          3m9s
product-api-6798bc4b4d-9ddv4   <span class="token number">2</span>/2     Running   <span class="token number">2</span>          3m9s
public-api-5bdf986897-tlxj2    <span class="token number">2</span>/2     Running   <span class="token number">0</span>          3m9s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>배포된 앱에 접근하기 위해 <code v-pre>port-forward</code>를 구성합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl port-forward service/frontend <span class="token number">18080</span>:80 <span class="token parameter variable">--address</span> <span class="token number">0.0</span>.0.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 출력</span>
Forwarding from <span class="token number">0.0</span>.0.0:18080 -<span class="token operator">></span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>브라우저에서 <a href="http://localhost:18080" target="_blank" rel="noopener noreferrer">http://localhost:18080<ExternalLinkIcon/></a> 로 접근합니다.</p>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/ServiceMesh101/images/03-use-crd-error.png" alt="image-20220219202023073" tabindex="0" loading="lazy"><figcaption>image-20220219202023073</figcaption></figure>
<p>현재 <code v-pre>Intention</code> 규칙이 모두 <code v-pre>deny</code>로 구성되어있다면 에러 화면을 확인하게 됩니다.</p>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/ServiceMesh101/images/02-intention-alldeny.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<h2 id="crd-적용해보기" tabindex="-1"><a class="header-anchor" href="#crd-적용해보기" aria-hidden="true">#</a> CRD 적용해보기</h2>
<p>UI에서가 아닌 CRD를 통해 <code v-pre>Intention</code> 을 정의하기위해 아래와 같이 구성합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">></span> ./service-to-service.yaml <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceIntentions
metadata:
  name: frontend-to-public-api
spec:
  destination:
    name: public-api
  sources:
    - name: frontend
      action: allow
---
apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceIntentions
metadata:
  name: public-api-to-product-api
spec:
  destination:
    name: product-api
  sources:
    - name: public-api
      action: allow
---
apiVersion: consul.hashicorp.com/v1alpha1
kind: ServiceIntentions
metadata:
  name: product-api-to-postgres
spec:
  destination:
    name: postgres
  sources:
    - name: product-api
      action: allow
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>규칙의 내용은 다음과 같습니다.</p>
<ul>
<li>frontend -&gt; public-api</li>
<li>public-api -&gt; product-api</li>
<li>product-api -&gt; postgres</li>
</ul>
<p>규칙을 적용합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> service-to-service.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 출력</span>
serviceintentions.consul.hashicorp.com/frontend-to-public-api created
serviceintentions.consul.hashicorp.com/public-api-to-product-api created
serviceintentions.consul.hashicorp.com/product-api-to-postgres created
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Consul UI에서 확인해보면 해당 Intention 규칙은 CRD로 적용되었기 때문에 <code v-pre>Managed by CRD</code> 표시가 붙는것을 확인할 수 있습니다.</p>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/ServiceMesh101/images/02-intention-crd.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>배포된 앱에 접근하기 위해 <code v-pre>port-forward</code>를 구성합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl port-forward service/frontend <span class="token number">18080</span>:80 <span class="token parameter variable">--address</span> <span class="token number">0.0</span>.0.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 출력</span>
Forwarding from <span class="token number">0.0</span>.0.0:18080 -<span class="token operator">></span> <span class="token number">80</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>브라우저에서 <a href="http://localhost:18080" target="_blank" rel="noopener noreferrer">http://localhost:18080<ExternalLinkIcon/></a> 로 접근합니다.</p>
<figure><img src="@source/04-HashiCorp/04-Consul/06-on_Kubernetes/ServiceMesh101/images/03-use-crd-hashicups.png" alt="image-20220219202943498" tabindex="0" loading="lazy"><figcaption>image-20220219202943498</figcaption></figure>
<p>서비스 간 연결이 허용되었으므로 페이지가 잘 표시됩니다.</p>
<p>다음 과정을 위해 배포된 리소스를 정리합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl delete <span class="token parameter variable">-f</span> service-to-service.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 출력</span>
serviceintentions.consul.hashicorp.com <span class="token string">"frontend-to-public-api"</span> deleted
serviceintentions.consul.hashicorp.com <span class="token string">"public-api-to-product-api"</span> deleted
serviceintentions.consul.hashicorp.com <span class="token string">"product-api-to-postgres"</span> deleted
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl delete <span class="token parameter variable">-f</span> hashicups/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 출력</span>
<span class="token function">service</span> <span class="token string">"frontend"</span> deleted
serviceaccount <span class="token string">"frontend"</span> deleted
servicedefaults.consul.hashicorp.com <span class="token string">"frontend"</span> deleted
configmap <span class="token string">"nginx-configmap"</span> deleted
deployment.apps <span class="token string">"frontend"</span> deleted
<span class="token function">service</span> <span class="token string">"postgres"</span> deleted
serviceaccount <span class="token string">"postgres"</span> deleted
servicedefaults.consul.hashicorp.com <span class="token string">"postgres"</span> deleted
deployment.apps <span class="token string">"postgres"</span> deleted
<span class="token function">service</span> <span class="token string">"product-api"</span> deleted
serviceaccount <span class="token string">"product-api"</span> deleted
servicedefaults.consul.hashicorp.com <span class="token string">"product-api"</span> deleted
configmap <span class="token string">"db-configmap"</span> deleted
deployment.apps <span class="token string">"product-api"</span> deleted
<span class="token function">service</span> <span class="token string">"public-api"</span> deleted
serviceaccount <span class="token string">"public-api"</span> deleted
servicedefaults.consul.hashicorp.com <span class="token string">"public-api"</span> deleted
deployment.apps <span class="token string">"public-api"</span> deleted
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


