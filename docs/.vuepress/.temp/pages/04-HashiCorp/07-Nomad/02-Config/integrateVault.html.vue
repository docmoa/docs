<template><div><h1 id="integrate-vault" tabindex="-1"><a class="header-anchor" href="#integrate-vault" aria-hidden="true">#</a> integrate Vault</h1>
<h2 id="아래-작업-전-forward-dns-for-consul-service-discovery을-진행해야함" tabindex="-1"><a class="header-anchor" href="#아래-작업-전-forward-dns-for-consul-service-discovery을-진행해야함" aria-hidden="true">#</a> 아래 작업 전 Forward DNS for Consul Service Discovery을 진행해야함</h2>
<ul>
<li><RouterLink to="/04-HashiCorp/04-Consul/02-Configuration/ForwardDns.html">Consul 설정 링크</RouterLink></li>
</ul>
<h2 id="예제를-위한-vault-kv-설정" tabindex="-1"><a class="header-anchor" href="#예제를-위한-vault-kv-설정" aria-hidden="true">#</a> 예제를 위한 vault kv 설정</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 사용된 policy들</span>
$ <span class="token function">cat</span> nomad-cluster-role.json
<span class="token punctuation">{</span>
    <span class="token string">"allowed_policies"</span><span class="token builtin class-name">:</span> <span class="token string">"admin"</span>,
    <span class="token string">"token_explicit_max_ttl"</span><span class="token builtin class-name">:</span> <span class="token number">0</span>,
    <span class="token string">"name"</span><span class="token builtin class-name">:</span> <span class="token string">"nomad-cluster"</span>,
    <span class="token string">"orphan"</span><span class="token builtin class-name">:</span> true,
    <span class="token string">"token_period"</span><span class="token builtin class-name">:</span> <span class="token number">259200</span>,
    <span class="token string">"renewable"</span><span class="token builtin class-name">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
vault <span class="token function">write</span> /auth/token/roles/nomad-cluster @nomad-cluster-role.json

$ <span class="token function">cat</span> admin-policy.hcl 
<span class="token comment"># Read system health check</span>
path <span class="token string">"sys/health"</span>
<span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"read"</span>, <span class="token string">"sudo"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># Create and manage ACL policies broadly across Vault</span>

<span class="token comment"># List existing policies</span>
path <span class="token string">"sys/policies/acl"</span>
<span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"list"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># Create and manage ACL policies</span>
path <span class="token string">"sys/policies/acl/*"</span>
<span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"read"</span>, <span class="token string">"update"</span>, <span class="token string">"delete"</span>, <span class="token string">"list"</span>, <span class="token string">"sudo"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># Enable and manage authentication methods broadly across Vault</span>

<span class="token comment"># Manage auth methods broadly across Vault</span>
path <span class="token string">"auth/*"</span>
<span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"read"</span>, <span class="token string">"update"</span>, <span class="token string">"delete"</span>, <span class="token string">"list"</span>, <span class="token string">"sudo"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># Create, update, and delete auth methods</span>
path <span class="token string">"sys/auth/*"</span>
<span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"update"</span>, <span class="token string">"delete"</span>, <span class="token string">"sudo"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># List auth methods</span>
path <span class="token string">"sys/auth"</span>
<span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"read"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># Enable and manage the key/value secrets engine at `secret/` path</span>

<span class="token comment"># List, create, update, and delete key/value secrets</span>
path <span class="token string">"secret/*"</span>
<span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"read"</span>, <span class="token string">"update"</span>, <span class="token string">"delete"</span>, <span class="token string">"list"</span>, <span class="token string">"sudo"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># Manage secrets engines</span>
path <span class="token string">"sys/mounts/*"</span>
<span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"read"</span>, <span class="token string">"update"</span>, <span class="token string">"delete"</span>, <span class="token string">"list"</span>, <span class="token string">"sudo"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># List existing secrets engines.</span>
path <span class="token string">"sys/mounts"</span>
<span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"read"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

vault policy <span class="token function">write</span> admin admin-policy.hcl

<span class="token comment"># token 생성</span>
vault token create <span class="token parameter variable">-policy</span> admin <span class="token parameter variable">-period</span> 72h <span class="token parameter variable">-orphan</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="server-구성-예시" tabindex="-1"><a class="header-anchor" href="#server-구성-예시" aria-hidden="true">#</a> Server 구성 예시</h2>
<h3 id="storage를-consul을-사용하고-consul에-서비스가-등록되어-있는환경" tabindex="-1"><a class="header-anchor" href="#storage를-consul을-사용하고-consul에-서비스가-등록되어-있는환경" aria-hidden="true">#</a> storage를 consul을 사용하고 consul에 서비스가 등록되어 있는환경</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">vault</span> <span class="token punctuation">{</span>
    <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
    <span class="token property">address</span> <span class="token punctuation">=</span> <span class="token string">"http://active.vault.service.consul:8200"</span>
    <span class="token property">task_token_ttl</span> <span class="token punctuation">=</span> <span class="token string">"1h"</span>
    <span class="token property">create_from_role</span> <span class="token punctuation">=</span> <span class="token string">"nomad-cluster"</span>
    <span class="token property">token</span> <span class="token punctuation">=</span> <span class="token string">"s.hQRpxLmyk6AgSKJWOc9Gmbj1"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="client-구성-예시" tabindex="-1"><a class="header-anchor" href="#client-구성-예시" aria-hidden="true">#</a> Client 구성 예시</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">vault</span> <span class="token punctuation">{</span>
    <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
    <span class="token property">address</span> <span class="token punctuation">=</span> <span class="token string">"http://active.vault.service.consul:8200"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


