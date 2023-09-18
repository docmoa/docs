<template><div><h1 id="vault-400-error" tabindex="-1"><a class="header-anchor" href="#vault-400-error" aria-hidden="true">#</a> Vault 400 Error</h1>
<blockquote>
<p>Vault HTTP Status Codes : <a href="https://www.vaultproject.io/api#http-status-codes" target="_blank" rel="noopener noreferrer">https://www.vaultproject.io/api#http-status-codes<ExternalLinkIcon/></a></p>
</blockquote>
<p>Vault에 API 요청시 400에러가 발생하는 경우 Vault로 전달된 데이터 형태가 올바른지 확인이 필요하다.</p>
<ul>
<li><code v-pre>400</code> :  Invalid request, missing or invalid data.</li>
</ul>
<p>예를들어 아래와 같이 <code v-pre>Transit</code>의 복호화 요청을 하는 경우 데이터가 비어있다면 응답과 Audit로그에서 400 에러관련 메세지를 확인할 수 있다.</p>
<ul>
<li><code v-pre>1 error occurred: * invalid request</code></li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">-H</span> <span class="token string">"X-Vault-Token: s.HeeRXjkW1KJhF8ofQsglI9yw"</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">-X</span> POST <span class="token punctuation">\</span>
  <span class="token parameter variable">-d</span> <span class="token string">"{}"</span> <span class="token punctuation">\</span>
  http://192.168.60.103:8200/v1/transit/decrypt/my-key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"time"</span><span class="token operator">:</span> <span class="token string">"2022-03-04T08:02:37.596190958Z"</span><span class="token punctuation">,</span>
  <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"response"</span><span class="token punctuation">,</span>
  <span class="token property">"auth"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"client_token"</span><span class="token operator">:</span> <span class="token string">"hmac-sha256:17bc16e3346dd6c398646cb7da8e0bd71ae720f608a8c447b8942b8283388600"</span><span class="token punctuation">,</span>
    <span class="token property">"accessor"</span><span class="token operator">:</span> <span class="token string">"hmac-sha256:798bb09d10dc2ac18533acb3d049c4185af3328fbc88fedd23081f63caa13b44"</span><span class="token punctuation">,</span>
    <span class="token property">"display_name"</span><span class="token operator">:</span> <span class="token string">"root"</span><span class="token punctuation">,</span>
    <span class="token property">"policies"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token string">"root"</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"token_policies"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token string">"root"</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"token_type"</span><span class="token operator">:</span> <span class="token string">"service"</span><span class="token punctuation">,</span>
    <span class="token property">"token_issue_time"</span><span class="token operator">:</span> <span class="token string">"2021-09-15T13:45:47+09:00"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"request"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"c39906c5-f48d-c177-37c2-4c1635db78e7"</span><span class="token punctuation">,</span>
    <span class="token property">"operation"</span><span class="token operator">:</span> <span class="token string">"update"</span><span class="token punctuation">,</span>
    <span class="token property">"mount_type"</span><span class="token operator">:</span> <span class="token string">"transit"</span><span class="token punctuation">,</span>
    <span class="token property">"client_token"</span><span class="token operator">:</span> <span class="token string">"hmac-sha256:17bc16e3346dd6c398646cb7da8e0bd71ae720f608a8c447b8942b8283388600"</span><span class="token punctuation">,</span>
    <span class="token property">"client_token_accessor"</span><span class="token operator">:</span> <span class="token string">"hmac-sha256:798bb09d10dc2ac18533acb3d049c4185af3328fbc88fedd23081f63caa13b44"</span><span class="token punctuation">,</span>
    <span class="token property">"namespace"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"root"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">"path"</span><span class="token operator">:</span> <span class="token string">"kbhealth-transit/prod/decrypt/aes256"</span><span class="token punctuation">,</span>
    <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"ciphertext"</span><span class="token operator">:</span> <span class="token string">"hmac-sha256:34c2966e2ef36e2dcdb24f05fd4442b8f85c0d2fbf0887977636c7592e2cef3b"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">"remote_address"</span><span class="token operator">:</span> <span class="token string">"10.100.0.85"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"response"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"mount_type"</span><span class="token operator">:</span> <span class="token string">"transit"</span><span class="token punctuation">,</span>
    <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"error"</span><span class="token operator">:</span> <span class="token string">"hmac-sha256:bf7d730e400653f79b134c3bdb593f8220f6f1588a26048a6e1272a01ad47384"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"error"</span><span class="token operator">:</span> <span class="token string">"1 error occurred:\n\t* invalid request\n\n"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


