<template><div><h1 id="ingress-serviceroute" tabindex="-1"><a class="header-anchor" href="#ingress-serviceroute" aria-hidden="true">#</a> Ingress &amp; ServiceRoute</h1>
<p>Ingress gateway가 8080을 Listen하도록 구성되어있으면, 아래와 같이 해당 포트의 요청을 받을 대상 서비스를 지정합니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> consul.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> IngressGateway
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> ingress<span class="token punctuation">-</span>gateway
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">listeners</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> http
      <span class="token key atrule">services</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> hashicups
          <span class="token key atrule">hosts</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"*"</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>여기서 지정된 <code v-pre>hashicups</code>는 가상의 서비스 입니다. 해당 서비스에 대한 Service Router 설정을 다음과 같이 구성합니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> consul.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceRouter
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> hashicups
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">routes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">match</span><span class="token punctuation">:</span>
        <span class="token key atrule">http</span><span class="token punctuation">:</span>
          <span class="token key atrule">pathPrefix</span><span class="token punctuation">:</span> <span class="token string">'/api'</span>
      <span class="token key atrule">destination</span><span class="token punctuation">:</span>
        <span class="token key atrule">service</span><span class="token punctuation">:</span> public<span class="token punctuation">-</span>api
    <span class="token punctuation">-</span> <span class="token key atrule">match</span><span class="token punctuation">:</span>
        <span class="token key atrule">http</span><span class="token punctuation">:</span>
          <span class="token key atrule">pathPrefix</span><span class="token punctuation">:</span> <span class="token string">'/'</span>
      <span class="token key atrule">destination</span><span class="token punctuation">:</span>
        <span class="token key atrule">service</span><span class="token punctuation">:</span> frontend
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


