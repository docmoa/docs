<template><div><h1 id="kv-sample" tabindex="-1"><a class="header-anchor" href="#kv-sample" aria-hidden="true">#</a> KV Sample</h1>
<p>참고 : <a href="https://learn.hashicorp.com/tutorials/consul/consul-template" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/consul/consul-template<ExternalLinkIcon/></a></p>
<h2 id="템플릿-파일-변환-하기" tabindex="-1"><a class="header-anchor" href="#템플릿-파일-변환-하기" aria-hidden="true">#</a> 템플릿 파일 변환 하기</h2>
<h3 id="템플릿-파일-작성" tabindex="-1"><a class="header-anchor" href="#템플릿-파일-작성" aria-hidden="true">#</a> 템플릿 파일 작성</h3>
<ul>
<li>대상 kv : apache/version</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># apache_install.sh.ctmpl</span>
<span class="token comment">#!/bin/bash</span>
sudo apt-get remove -y apache2
sudo apt-get install -y <span class="token property">apache2</span><span class="token punctuation">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span> key <span class="token string">"/apache/version"</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="consul에-kv추가" tabindex="-1"><a class="header-anchor" href="#consul에-kv추가" aria-hidden="true">#</a> consul에 KV추가</h3>
<p>consul kv put apache/version 2.2.14-5ubuntu8.7</p>
<h3 id="실행" tabindex="-1"><a class="header-anchor" href="#실행" aria-hidden="true">#</a> 실행</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ consul-template <span class="token parameter variable">-template</span><span class="token operator">=</span><span class="token string">"./apache_install.sh.ctmpl:./apache_install.sh"</span> <span class="token parameter variable">-once</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>::: vue<br>
.<br>
├── apache_install.sh.ctmpl<br>
└── <code v-pre>apache_install.sh</code><br>
:::</p>
<h3 id="내용-확인" tabindex="-1"><a class="header-anchor" href="#내용-확인" aria-hidden="true">#</a> 내용 확인</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>
<span class="token function">sudo</span> <span class="token function">apt-get</span> remove <span class="token parameter variable">-y</span> apache2
<span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> <span class="token parameter variable">-y</span> <span class="token assign-left variable">apache2</span><span class="token operator">=</span><span class="token number">2.2</span>.14-5ubuntu8.7
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="config-활용" tabindex="-1"><a class="header-anchor" href="#config-활용" aria-hidden="true">#</a> Config 활용</h2>
<h3 id="cli-inline의-옵션을-정의하는-config-작성" tabindex="-1"><a class="header-anchor" href="#cli-inline의-옵션을-정의하는-config-작성" aria-hidden="true">#</a> CLI Inline의 옵션을 정의하는 config 작성</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># consul-template-apache-install.hcl</span>
<span class="token keyword">consul</span> <span class="token punctuation">{</span>
  <span class="token property">address</span> <span class="token punctuation">=</span> <span class="token string">"localhost:8500"</span>

  <span class="token keyword">retry</span> <span class="token punctuation">{</span>
    <span class="token property">enabled</span>  <span class="token punctuation">=</span> <span class="token boolean">true</span>
    <span class="token property">attempts</span> <span class="token punctuation">=</span> <span class="token number">12</span>
    <span class="token property">backoff</span>  <span class="token punctuation">=</span> <span class="token string">"250ms"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">template</span> <span class="token punctuation">{</span>
  <span class="token property">source</span>      <span class="token punctuation">=</span> <span class="token string">"./apache_install.sh.ctmpl"</span>
  <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"./apache_install.sh"</span>
  <span class="token property">perms</span>       <span class="token punctuation">=</span> <span class="token number">0644</span>
  <span class="token property">command</span>     <span class="token punctuation">=</span> <span class="token string">"echo './apache_install.sh'"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="실행-1" tabindex="-1"><a class="header-anchor" href="#실행-1" aria-hidden="true">#</a> 실행</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ consul-template <span class="token parameter variable">-config</span><span class="token operator">=</span>consul-template-apache-install.hcl
apache_install.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


