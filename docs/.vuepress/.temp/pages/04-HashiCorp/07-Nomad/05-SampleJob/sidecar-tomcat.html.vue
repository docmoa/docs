<template><div><h1 id="tomcat-sidecar" tabindex="-1"><a class="header-anchor" href="#tomcat-sidecar" aria-hidden="true">#</a> tomcat-sidecar</h1>
<ul>
<li>참고 링크
<ul>
<li><a href="https://discuss.hashicorp.com/t/nomad-error-creating-an-ingress-gateway-with-sidecar-service/24731" target="_blank" rel="noopener noreferrer">https://discuss.hashicorp.com/t/nomad-error-creating-an-ingress-gateway-with-sidecar-service/24731<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"01_tomcat-sidecar"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  <span class="token comment">#ingress용도의 group</span>
  group <span class="token string">"ingress-tomcat"</span> <span class="token punctuation">{</span>
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"bridge"</span>
      port <span class="token string">"inbound"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">8080</span>
        <span class="token property">to</span>     <span class="token punctuation">=</span> <span class="token number">8080</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"tomcat-ingress"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"8080"</span>

      <span class="token comment">#여기서부터 sidecar ingress</span>
      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">gateway</span> <span class="token punctuation">{</span>
          <span class="token keyword">ingress</span> <span class="token punctuation">{</span>
            <span class="token keyword">listener</span> <span class="token punctuation">{</span>
              <span class="token property">port</span>     <span class="token punctuation">=</span> <span class="token number">8080</span>
              <span class="token property">protocol</span> <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
              <span class="token keyword">service</span> <span class="token punctuation">{</span>
                <span class="token comment">#아래 tomcat group에 service를 호출함</span>
                <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"backend"</span>
              <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  group <span class="token string">"tomcat"</span> <span class="token punctuation">{</span>
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"bridge"</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"backend"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"8080"</span>
      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">sidecar_service</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"tomcat"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"tomcat"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


