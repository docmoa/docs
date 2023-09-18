<template><div><h1 id="service-mesh-test" tabindex="-1"><a class="header-anchor" href="#service-mesh-test" aria-hidden="true">#</a> Service Mesh Test</h1>
<p>HashiCorp 공식 Service Mesh Test App</p>
<p><a href="https://learn.hashicorp.com/tutorials/nomad/consul-service-mesh" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/nomad/consul-service-mesh<ExternalLinkIcon/></a></p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"countdash"</span> <span class="token punctuation">{</span>
  <span class="token property">region</span>      <span class="token punctuation">=</span> <span class="token string">"global"</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token comment"># namespace   = "mesh"</span>

  group <span class="token string">"api"</span> <span class="token punctuation">{</span>
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"bridge"</span>
      port <span class="token string">"api"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token number">9001</span> <span class="token comment"># static 설정이 없으므로 컨테이너의 앱 9001과 노출되는 임의의 포트와 맵핑</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"count-api"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"api"</span> <span class="token comment"># 임의의 포트 할당을 network port id로 지정</span>

      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">sidecar_service</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"web"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"hashicorpnomad/counter-api:v1"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"api"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  group <span class="token string">"dashboard"</span> <span class="token punctuation">{</span>
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"bridge"</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">9002</span> <span class="token comment"># 컨테이너 앱 9002와 외부노출되는 사용자 지정 static port를 맵핑</span>
        <span class="token property">to</span>     <span class="token punctuation">=</span> <span class="token number">9002</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"count-dashboard"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span> <span class="token comment"># 할당된 포트를 network port id로 지정</span>

      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">sidecar_service</span> <span class="token punctuation">{</span>
          <span class="token keyword">proxy</span> <span class="token punctuation">{</span>
            <span class="token keyword">upstreams</span> <span class="token punctuation">{</span>
              <span class="token property">destination_name</span> <span class="token punctuation">=</span> <span class="token string">"count-api"</span>
              <span class="token property">local_bind_port</span>  <span class="token punctuation">=</span> <span class="token number">8080</span> <span class="token comment"># backend인 count-api의 실제 port와는 별개로 frontend가 호출할 port 지정</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"dashboard"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>
      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">COUNTING_SERVICE_URL</span> <span class="token punctuation">=</span> <span class="token string">"http://<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_UPSTREAM_ADDR_count_api<span class="token punctuation">}</span></span>"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"hashicorpnomad/counter-dashboard:v1"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">scaling</span> <span class="token punctuation">{</span>
      <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token property">min</span> <span class="token punctuation">=</span> <span class="token number">1</span>
      <span class="token property">max</span> <span class="token punctuation">=</span> <span class="token number">10</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


