<template><div><h1 id="kv-v2-ui-policy" tabindex="-1"><a class="header-anchor" href="#kv-v2-ui-policy" aria-hidden="true">#</a> kv-v2 UI Policy</h1>
<blockquote>
<p>사용자별 UI 접근에 대한 설정을 Kv-v2를 예로 확인</p>
</blockquote>
<h2 id="policy-구성" tabindex="-1"><a class="header-anchor" href="#policy-구성" aria-hidden="true">#</a> Policy 구성</h2>
<p>UI 접근을 위해서는 <code v-pre>metadata</code>에 대한 권한 추가가 필요함</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault policy <span class="token function">write</span> ui-kv-policy - <span class="token operator">&lt;&lt;</span> <span class="token string">EOF

path "kv-v2/data/path/" {
  capabilities = ["create", "update", "read", "delete", "list"]
}
path "kv-v2/delete/path/" {
  capabilities = ["update"]
}
path "kv-v2/metadata/path/" {
  capabilities = ["list", "read", "delete"]
}
path "kv-v2/destroy/path/" {
  capabilities = ["update"]
}

path "kv-v2/data/path/userid/*" {
  capabilities = ["create", "update", "read", "delete", "list"]
}
path "kv-v2/delete/path/userid/*" {
  capabilities = ["update"]
}
path "kv-v2/metadata/path/userid/*" {
  capabilities = ["list", "read", "delete"]
}
path "kv-v2/destroy/path/userid/*" {
  capabilities = ["update"]
}

# Additional access for UI
path "kv-v2/metadata" {
  capabilities = ["list"]
}
EOF</span>

<span class="token comment">##### or #####</span>

vault policy <span class="token function">write</span> ui-kv-policy - <span class="token operator">&lt;&lt;</span> <span class="token string">EOF

path "kv-v2/data/path/userid" {
  capabilities = ["create", "update", "read", "delete", "list"]
}
path "kv-v2/delete/path/userid" {
  capabilities = ["update"]
}
path "kv-v2/metadata/path/userid" {
  capabilities = ["list", "read", "delete"]
}
path "kv-v2/destroy/path/userid" {
  capabilities = ["update"]
}

# Additional access for UI
path "kv-v2/metadata/*" {
  capabilities = ["list"]
}
EOF</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="인증-생성" tabindex="-1"><a class="header-anchor" href="#인증-생성" aria-hidden="true">#</a> 인증 생성</h2>
<p>생성한 Policy 기반으로 인증 생성</p>
<CodeTabs id="21" :data='[{"id":"userpass"},{"id":"token"}]' tab-id="shell">
<template #title0="{ value, isActive }">userpass</template>
<template #title1="{ value, isActive }">token</template>
<template #tab0="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> auth/userpass/users/userid <span class="token assign-left variable">password</span><span class="token operator">=</span>password <span class="token assign-left variable">policies</span><span class="token operator">=</span>ui-kv-policy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></template>
<template #tab1="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code>vault token create <span class="token parameter variable">-policy</span><span class="token operator">=</span>ui-kv-policy
</code></pre><div class="highlight-lines"><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></template>
</CodeTabs>
<h2 id="조회-확인" tabindex="-1"><a class="header-anchor" href="#조회-확인" aria-hidden="true">#</a> 조회 확인</h2>
<p>생성한 인증의 <code v-pre>Token</code>을 사용하여 데이터가 조회됨을 확인</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span>  <span class="token parameter variable">--request</span> GET <span class="token parameter variable">--header</span> <span class="token string">"X-Vault-Token: s.FqFMzKL8ExjJeBrq79Jjh1eB"</span> http://172.28.128.11:8200/v1/kv-v2/data/path/userid <span class="token operator">|</span> jq <span class="token builtin class-name">.</span>
<span class="token punctuation">{</span>
  <span class="token string">"request_id"</span><span class="token builtin class-name">:</span> <span class="token string">"d3db0633-2e13-ba98-4d79-ca48f2307d5e"</span>,
  <span class="token string">"lease_id"</span><span class="token builtin class-name">:</span> <span class="token string">""</span>,
  <span class="token string">"renewable"</span><span class="token builtin class-name">:</span> false,
  <span class="token string">"lease_duration"</span><span class="token builtin class-name">:</span> <span class="token number">0</span>,
  <span class="token string">"data"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
    <span class="token string">"data"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
      <span class="token string">"access_key"</span><span class="token builtin class-name">:</span> <span class="token string">"1234"</span>,
      <span class="token string">"secret_key"</span><span class="token builtin class-name">:</span> <span class="token string">"1234"</span>
    <span class="token punctuation">}</span>,
    <span class="token string">"metadata"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
      <span class="token string">"created_time"</span><span class="token builtin class-name">:</span> <span class="token string">"2021-07-16T06:35:51.496079412Z"</span>,
      <span class="token string">"deletion_time"</span><span class="token builtin class-name">:</span> <span class="token string">""</span>,
      <span class="token string">"destroyed"</span><span class="token builtin class-name">:</span> false,
      <span class="token string">"version"</span><span class="token builtin class-name">:</span> <span class="token number">1</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>,
  <span class="token string">"wrap_info"</span><span class="token builtin class-name">:</span> null,
  <span class="token string">"warnings"</span><span class="token builtin class-name">:</span> null,
  <span class="token string">"auth"</span><span class="token builtin class-name">:</span> null
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>UI에서 접근가능한지 확인<br>
<img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Vault 2021-07-16 15-35-48.png" alt="Vault 2021-07-16 15-35-48" loading="lazy"></p>
</div></template>


