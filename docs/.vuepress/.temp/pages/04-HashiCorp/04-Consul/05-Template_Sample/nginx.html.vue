<template><div><h1 id="nginx-sample" tabindex="-1"><a class="header-anchor" href="#nginx-sample" aria-hidden="true">#</a> NGINX Sample</h1>
<p>참고 : <a href="https://learn.hashicorp.com/tutorials/consul/load-balancing-nginx" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/consul/load-balancing-nginx<ExternalLinkIcon/></a></p>
<h2 id="템플릿-파일-변환-하기" tabindex="-1"><a class="header-anchor" href="#템플릿-파일-변환-하기" aria-hidden="true">#</a> 템플릿 파일 변환 하기</h2>
<h3 id="템플릿-파일-작성" tabindex="-1"><a class="header-anchor" href="#템플릿-파일-작성" aria-hidden="true">#</a> 템플릿 파일 작성</h3>
<ul>
<li>대상 서비스 : nginx-backend</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># nginx.conf.ctmpl</span>
upstream <span class="token keyword">backend</span> <span class="token punctuation">{</span>
  <span class="token punctuation">{</span><span class="token punctuation">{</span>- range service <span class="token string">"nginx-backend"</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
  <span class="token keyword">server</span> <span class="token punctuation">{</span><span class="token punctuation">{</span>.Address<span class="token punctuation">}</span><span class="token punctuation">}</span>:<span class="token punctuation">{</span><span class="token punctuation">{</span>.Port<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token property">max_fails</span><span class="token punctuation">=</span><span class="token number">3</span> <span class="token property">fail_timeout</span><span class="token punctuation">=</span><span class="token number">60</span> <span class="token property">weight</span><span class="token punctuation">=</span><span class="token number">1</span>;
  <span class="token punctuation">{</span><span class="token punctuation">{</span>else<span class="token punctuation">}</span><span class="token punctuation">}</span>server <span class="token number">127.0</span>.<span class="token number">0.1</span>:<span class="token number">65535</span>; <span class="token comment"># force a 502</span>
  <span class="token punctuation">{</span><span class="token punctuation">{</span>- end<span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">server</span> <span class="token punctuation">{</span>
  listen <span class="token number">80</span> default_server;

  location /<span class="token keyword">stub_status</span> <span class="token punctuation">{</span>
    stub_status;
  <span class="token punctuation">}</span>

  location / <span class="token punctuation">{</span>
    proxy_pass http:<span class="token comment">//backend;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="실행" tabindex="-1"><a class="header-anchor" href="#실행" aria-hidden="true">#</a> 실행</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ consul-template <span class="token parameter variable">-template</span><span class="token operator">=</span><span class="token string">"./nginx.conf.ctmpl:./nginx.conf"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>::: vue<br>
.<br>
├── nginx.conf.ctmpl<br>
└── <code v-pre>nginx.conf</code><br>
:::</p>
<h2 id="config-활용" tabindex="-1"><a class="header-anchor" href="#config-활용" aria-hidden="true">#</a> Config 활용</h2>
<h3 id="cli-inline의-옵션을-정의하는-config-작성" tabindex="-1"><a class="header-anchor" href="#cli-inline의-옵션을-정의하는-config-작성" aria-hidden="true">#</a> CLI Inline의 옵션을 정의하는 config 작성</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># consul-template-nginx.hcl</span>
<span class="token keyword">consul</span> <span class="token punctuation">{</span>
  <span class="token property">address</span> <span class="token punctuation">=</span> <span class="token string">"localhost:8500"</span>

  <span class="token keyword">retry</span> <span class="token punctuation">{</span>
    <span class="token property">enabled</span>  <span class="token punctuation">=</span> <span class="token boolean">true</span>
    <span class="token property">attempts</span> <span class="token punctuation">=</span> <span class="token number">12</span>
    <span class="token property">backoff</span>  <span class="token punctuation">=</span> <span class="token string">"250ms"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">template</span> <span class="token punctuation">{</span>
  <span class="token property">source</span>      <span class="token punctuation">=</span> <span class="token string">"./nginx.conf.ctmpl"</span>
  <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"./nginx.conf"</span>
  <span class="token property">perms</span>       <span class="token punctuation">=</span> <span class="token number">0644</span>
  <span class="token property">command</span>     <span class="token punctuation">=</span> <span class="token string">"echo 'service nginx reload'"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="실행-1" tabindex="-1"><a class="header-anchor" href="#실행-1" aria-hidden="true">#</a> 실행</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ consul-template <span class="token parameter variable">-config</span><span class="token operator">=</span>consul-template-nginx.hcl
<span class="token function">service</span> nginx reload
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


