<template><div><h1 id="token-role" tabindex="-1"><a class="header-anchor" href="#token-role" aria-hidden="true">#</a> Token Role</h1>
<p>별도 Auth Method를 사용하지 않고 Token으로만 사용하는 경우 Token에 대한 role을 생성하여 해당 role의 정의된 설정에 종속된 Token을 생성할 수 있음</p>
<ul>
<li>Entity가 발생하므로 Vault Client Count 절약 가능</li>
<li>일관된 Token 생성 가능</li>
<li>Token에 대한 별도 Tune(TTL 조정 등) 가능</li>
</ul>
<h2 id="절차" tabindex="-1"><a class="header-anchor" href="#절차" aria-hidden="true">#</a> 절차</h2>
<ol>
<li>
<p>UI &gt; Access &gt; Entities &gt; [create entity] : <code v-pre>100y-entity</code></p>
</li>
<li>
<p>entity에서 aliases 생성 : <code v-pre>100y-alias</code></p>
</li>
<li>
<p>role 생성 (payload.json)</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"allowed_policies"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"my-policy"</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"100y"</span><span class="token punctuation">,</span>
  <span class="token property">"orphan"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token property">"bound_cidrs"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"127.0.0.1/32"</span><span class="token punctuation">,</span> <span class="token string">"128.252.0.0/16"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"renewable"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token property">"allowed_entity_aliases"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"100y-alias"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>role 적용</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-H</span> <span class="token string">"X-Vault-Token: hvs.QKRiVmCedA06dCSc2TptmSk1"</span> <span class="token parameter variable">-X</span> POST <span class="token parameter variable">--data</span> @payload.json http://127.0.0.1:8200/v1/auth/token/roles/100y
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>role에 대한 사용자 정의 tune 적용(옵션)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault auth tune -max-lease-ttl<span class="token operator">=</span>876000h token/role/100y
vault auth tune -default-lease-ttl<span class="token operator">=</span>876000h token/role/100y
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>tune 적용된 role 확인</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> auth/token/roles/100y

Key                         Value
---                         -----
allowed_entity_aliases      <span class="token punctuation">[</span>100y-alias<span class="token punctuation">]</span>
allowed_policies            <span class="token punctuation">[</span>default<span class="token punctuation">]</span>
allowed_policies_glob       <span class="token punctuation">[</span><span class="token punctuation">]</span>
bound_cidrs                 <span class="token punctuation">[</span><span class="token number">127.0</span>.0.1 <span class="token number">128.252</span>.0.0/16<span class="token punctuation">]</span>
disallowed_policies         <span class="token punctuation">[</span><span class="token punctuation">]</span>
disallowed_policies_glob    <span class="token punctuation">[</span><span class="token punctuation">]</span>
explicit_max_ttl            0s
name                        100y
orphan                      <span class="token boolean">false</span>
path_suffix                 n/a
period                      0s
renewable                   <span class="token boolean">true</span>
token_bound_cidrs           <span class="token punctuation">[</span><span class="token number">127.0</span>.0.1 <span class="token number">128.252</span>.0.0/16<span class="token punctuation">]</span>
token_explicit_max_ttl      0s
token_no_default_policy     <span class="token boolean">false</span>
token_period                0s
token_type                  default-service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>token 생성</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token create -entity-alias<span class="token operator">=</span>100y-alias <span class="token parameter variable">-role</span><span class="token operator">=</span>100y
Key                  Value
---                  -----
token                hvs.CAESIIveQyE34VOowkCXj4InopxsQHWXu2iW00UQDDCTb-pIGh4KHGh2cy5UZGJ4MjJic1RjY1BlVGRWVHhzNFgwWW4
token_accessor       Cx6qjyUGwqPmqoPNe9tmkCiN
token_duration       876000h
token_renewable      <span class="token boolean">true</span>
token_policies       <span class="token punctuation">[</span><span class="token string">"default"</span><span class="token punctuation">]</span>
identity_policies    <span class="token punctuation">[</span><span class="token string">"default"</span><span class="token punctuation">]</span>
policies             <span class="token punctuation">[</span><span class="token string">"default"</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>token이 role의 구성이 반영되었는지 확인</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token lookup hvs.CAESIIveQyE34VOowkCXj4InopxsQHWXu2iW00UQDDCTb-pIGh4KHGh2cy5UZGJ4MjJic1RjY1BlVGRWVHhzNFgwWW4

Key                            Value
---                            -----
accessor                       Cx6qjyUGwqPmqoPNe9tmkCiN
bound_cidrs                    <span class="token punctuation">[</span><span class="token number">127.0</span>.0.1 <span class="token number">128.252</span>.0.0/16<span class="token punctuation">]</span>
creation_time                  <span class="token number">1651059486</span>
creation_ttl                   876000h
display_name                   token
entity_id                      53fc4716-fc0d-db34-14b8-ab4258f89fb1
expire_time                    <span class="token number">2122</span>-04-03T20:38:06.73198+09:00
explicit_max_ttl               0s
external_namespace_policies    map<span class="token punctuation">[</span><span class="token punctuation">]</span>
<span class="token function">id</span>                             hvs.CAESIIveQyE34VOowkCXj4InopxsQHWXu2iW00UQDDCTb-pIGh4KHGh2cy5UZGJ4MjJic1RjY1BlVGRWVHhzNFgwWW4
identity_policies              <span class="token punctuation">[</span>default<span class="token punctuation">]</span>
issue_time                     <span class="token number">2022</span>-04-27T20:38:06.731984+09:00
meta                           <span class="token operator">&lt;</span>nil<span class="token operator">></span>
num_uses                       <span class="token number">0</span>
orphan                         <span class="token boolean">false</span>
path                           auth/token/create/100y
policies                       <span class="token punctuation">[</span>default<span class="token punctuation">]</span>
renewable                      <span class="token boolean">true</span>
role                           100y
ttl                            875999h59m3s
<span class="token builtin class-name">type</span>                           <span class="token function">service</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h2 id="entity-구성-cli-예제-옵션" tabindex="-1"><a class="header-anchor" href="#entity-구성-cli-예제-옵션" aria-hidden="true">#</a> Entity 구성 CLI 예제 (옵션)</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault auth list <span class="token parameter variable">-format</span><span class="token operator">=</span>json <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">'.["token/"].accessor'</span> <span class="token operator">></span> accessor_token.txt

vault <span class="token function">write</span> <span class="token parameter variable">-format</span><span class="token operator">=</span>json identity/entity <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">"100y-entity"</span> <span class="token assign-left variable">policies</span><span class="token operator">=</span><span class="token string">"default"</span> <span class="token punctuation">\</span>
     <span class="token assign-left variable">metadata</span><span class="token operator">=</span>organization<span class="token operator">=</span><span class="token string">"HC"</span> <span class="token punctuation">\</span>
     <span class="token assign-left variable">metadata</span><span class="token operator">=</span>team<span class="token operator">=</span><span class="token string">"QA"</span> <span class="token punctuation">\</span>
     <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">".data.id"</span> <span class="token operator">></span> entity_id.txt
     
vault <span class="token function">write</span> identity/entity-alias <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">"100y-alias"</span> <span class="token punctuation">\</span>
     <span class="token assign-left variable">canonical_id</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> entity_id.txt<span class="token variable">)</span></span> <span class="token punctuation">\</span>
     <span class="token assign-left variable">mount_accessor</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> accessor_token.txt<span class="token variable">)</span></span> <span class="token punctuation">\</span>
     <span class="token assign-left variable">custom_metadata</span><span class="token operator">=</span>account<span class="token operator">=</span><span class="token string">"QA Account"</span>
     
vault <span class="token function">write</span> auth/token/roles/100y <span class="token assign-left variable">allowed_policies</span><span class="token operator">=</span><span class="token string">"super-user"</span> <span class="token assign-left variable">orphan</span><span class="token operator">=</span>false <span class="token assign-left variable">bound_cidrs</span><span class="token operator">=</span><span class="token string">"127.0.0.1/32,128.252.0.0/16"</span> <span class="token assign-left variable">renewable</span><span class="token operator">=</span>true <span class="token assign-left variable">allowed_entity_aliases</span><span class="token operator">=</span><span class="token string">"100y-alias"</span> <span class="token assign-left variable">token_period</span><span class="token operator">=</span><span class="token string">"876000h"</span>

vault auth tune -max-lease-ttl<span class="token operator">=</span>876000h token/role/100y

vault auth tune -default-lease-ttl<span class="token operator">=</span>876000h token/role/100y

vault token create -entity-alias<span class="token operator">=</span>100y-alias <span class="token parameter variable">-role</span><span class="token operator">=</span>100y
Key                  Value
---                  -----
token                hvs.CAESIDv-SKwwf3MS-CAutW7aQgAZRBjh01lYLeriuSYzYIwfGiEKHGh2cy50cXFIYVhneDBVYU1OT1hXbWc3WHdtbzUQsgU
token_accessor       TAAPfxaUX1nx64ZqrLPa1VHx
token_duration       876000h
token_renewable      <span class="token boolean">true</span>
token_policies       <span class="token punctuation">[</span><span class="token string">"default"</span> <span class="token string">"super-user"</span><span class="token punctuation">]</span>
identity_policies    <span class="token punctuation">[</span><span class="token string">"default"</span><span class="token punctuation">]</span>
policies             <span class="token punctuation">[</span><span class="token string">"default"</span> <span class="token string">"super-user"</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


