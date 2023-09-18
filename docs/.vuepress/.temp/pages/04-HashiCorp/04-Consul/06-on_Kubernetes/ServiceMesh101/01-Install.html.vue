<template><div><h1 id="_01-install" tabindex="-1"><a class="header-anchor" href="#_01-install" aria-hidden="true">#</a> 01. Install</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>실습을 위한 조건은 다음과 같습니다.</p>
<ul>
<li>Kubernetes 1.21 이상의 환경</li>
<li>Consul binary <a href="http://releases.hashicorp.com/consul/" target="_blank" rel="noopener noreferrer">http://releases.hashicorp.com/consul/<ExternalLinkIcon/></a></li>
<li>Install helm 3</li>
<li>Install Kubectl</li>
<li>Consul Namespace 테스트는 Enterprise 라이선스가 필요합니다. : <a href="http://consul.io/trial" target="_blank" rel="noopener noreferrer">http://consul.io/trial<ExternalLinkIcon/></a></li>
</ul>
</div>
<blockquote>
<p>참고 : <a href="https://learn.hashicorp.com/collections/consul/kubernetes-production" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/collections/consul/kubernetes-production<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="consul-gossip" tabindex="-1"><a class="header-anchor" href="#consul-gossip" aria-hidden="true">#</a> Consul Gossip</h2>
<p>다운받은 Consul 바이너리를 통해 Gossip 암호화 키를 생성합니다</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl create secret generic consul-gossip-encryption-key --from-literal<span class="token operator">=</span>key<span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>consul keygen<span class="token variable">)</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="license-option" tabindex="-1"><a class="header-anchor" href="#license-option" aria-hidden="true">#</a> License (Option)</h2>
<p>발급받은 라이선스 파일을 저장(e.g. consul.hclic)하고 Kubernetes의 secret으로 적용합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl create secret generic license --from-file<span class="token operator">=</span><span class="token string">'key=./consul.hclic'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="helm" tabindex="-1"><a class="header-anchor" href="#helm" aria-hidden="true">#</a> Helm</h2>
<p>Helm repo add &amp; update</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>helm repo <span class="token function">add</span> hashicorp https://helm.releases.hashicorp.com <span class="token operator">&amp;&amp;</span> <span class="token punctuation">\</span>
helm repo update
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="helm-chart" tabindex="-1"><a class="header-anchor" href="#helm-chart" aria-hidden="true">#</a> Helm Chart</h2>
<blockquote>
<p>github : <a href="https://github.com/hashicorp/consul-helm/blob/master/values.yaml" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/consul-helm/blob/master/values.yaml<ExternalLinkIcon/></a></p>
</blockquote>
<p>Helm 설치를 위한 파일(e.g. value.yaml) 을 작성합니다.</p>
<ul>
<li>Enterprise
<ul>
<li>Enterprse 이미지 태그는 <a href="https://hub.docker.com/r/hashicorp/consul-enterprise/tags" target="_blank" rel="noopener noreferrer">hub.docker.com<ExternalLinkIcon/></a>을 확인합니다.</li>
<li>적용 시 <code v-pre>enterpriseLicense</code> 항목의 주석을 해제합니다.</li>
</ul>
</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">global</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> consul
  <span class="token key atrule">image</span><span class="token punctuation">:</span> hashicorp/consul<span class="token punctuation">-</span>enterprise<span class="token punctuation">:</span>1.11.3<span class="token punctuation">-</span>ent
  <span class="token key atrule">enableConsulNamespaces</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">adminPartitions</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">datacenter</span><span class="token punctuation">:</span> dc1
  <span class="token comment"># enterpriseLicense:</span>
  <span class="token comment">#   secretName: license</span>
  <span class="token comment">#   secretKey: key</span>
  <span class="token key atrule">gossipEncryption</span><span class="token punctuation">:</span>
    <span class="token key atrule">secretName</span><span class="token punctuation">:</span> consul<span class="token punctuation">-</span>gossip<span class="token punctuation">-</span>encryption<span class="token punctuation">-</span>key
    <span class="token key atrule">secretKey</span><span class="token punctuation">:</span> key
  <span class="token key atrule">tls</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token key atrule">enableAutoEncrypt</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">enableConsulNamespaces</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>

<span class="token key atrule">client</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">grpc</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>

<span class="token key atrule">connectInject</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">2</span>

<span class="token key atrule">dns</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>

<span class="token key atrule">controller</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>

<span class="token key atrule">syncCatalog</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">toConsul</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">consulNamespaces</span><span class="token punctuation">:</span>
    <span class="token key atrule">mirroringK8S</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="설치" tabindex="-1"><a class="header-anchor" href="#설치" aria-hidden="true">#</a> 설치</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl config use-context <span class="token variable"><span class="token variable">$(</span><span class="token function">grep</span> gs-cluster-0 KCONFIG.txt<span class="token variable">)</span></span>
helm <span class="token function">install</span> consul <span class="token parameter variable">-f</span> ./values.yaml hashicorp/consul <span class="token parameter variable">--version</span> v0.40.0 <span class="token parameter variable">--debug</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ui-확인" tabindex="-1"><a class="header-anchor" href="#ui-확인" aria-hidden="true">#</a> UI 확인</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl port-forward service/consul-server <span class="token number">8500</span>:8500
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><a href="http://localhost:8500/ui" target="_blank" rel="noopener noreferrer">http://localhost:8500/ui<ExternalLinkIcon/></a></p>
</div></template>


