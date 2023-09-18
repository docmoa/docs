<template><div><h1 id="nomad-namespace" tabindex="-1"><a class="header-anchor" href="#nomad-namespace" aria-hidden="true">#</a> Nomad Namespace</h1>
<blockquote>
<p>Nomad Version : &gt;=  1.0.0<br>
Nomad Ent. Version : &gt;= 0.7.0<br>
<a href="https://learn.hashicorp.com/tutorials/nomad/namespaces" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/nomad/namespaces<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="namespace-생성" tabindex="-1"><a class="header-anchor" href="#namespace-생성" aria-hidden="true">#</a> Namespace 생성</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ nomad namespace apply <span class="token parameter variable">-description</span> <span class="token string">"PoC Application"</span> apps
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="namespace-삭제" tabindex="-1"><a class="header-anchor" href="#namespace-삭제" aria-hidden="true">#</a> Namespace 삭제</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ nomad namespace delete apps
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="namespace-리스트-확인" tabindex="-1"><a class="header-anchor" href="#namespace-리스트-확인" aria-hidden="true">#</a> Namespace 리스트 확인</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ nomad namespace list
Name      Description
default   Default shared namespace
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="job에-namesapce-지정" tabindex="-1"><a class="header-anchor" href="#job에-namesapce-지정" aria-hidden="true">#</a> Job에 Namesapce 지정</h2>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"rails-www"</span></span> <span class="token punctuation">{</span>

    <span class="token comment">## Run in the QA environments</span>
    namespace <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"web-qa"</span></span>

    <span class="token comment">## Only run in one datacenter when QAing</span>
    datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"us-west1"</span></span><span class="token punctuation">]</span>
    <span class="token comment"># ...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="cli-사용시-flag-추가하거나-env로-생략-가능" tabindex="-1"><a class="header-anchor" href="#cli-사용시-flag-추가하거나-env로-생략-가능" aria-hidden="true">#</a> CLI 사용시 flag 추가하거나 ENV로 생략 가능</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># flag 설정</span>
nomad job status <span class="token parameter variable">-namespace</span><span class="token operator">=</span>web-qa

<span class="token comment"># ENV 설정</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">NOMAD_NAMESPACE</span><span class="token operator">=</span>web-qa
nomad job status
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="acl-구성시의-예" tabindex="-1"><a class="header-anchor" href="#acl-구성시의-예" aria-hidden="true">#</a> ACL 구성시의 예</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># Allow read only access to the production namespace</span>
namespace <span class="token string">"web-prod"</span> <span class="token punctuation">{</span>
    <span class="token property">policy</span> <span class="token punctuation">=</span> <span class="token string">"read"</span>
<span class="token punctuation">}</span>

<span class="token comment"># Allow writing to the QA namespace</span>
namespace <span class="token string">"web-qa"</span> <span class="token punctuation">{</span>
    <span class="token property">policy</span> <span class="token punctuation">=</span> <span class="token string">"write"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


