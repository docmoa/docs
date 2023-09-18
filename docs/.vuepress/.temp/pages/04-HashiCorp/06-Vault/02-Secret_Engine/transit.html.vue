<template><div><h1 id="transit" tabindex="-1"><a class="header-anchor" href="#transit" aria-hidden="true">#</a> Transit</h1>
<iframe width="560" height="315" src="https://www.youtube.com/embed/LkyperCGEDE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<h2 id="vault구성-option" tabindex="-1"><a class="header-anchor" href="#vault구성-option" aria-hidden="true">#</a> Vault구성 (Option)</h2>
<p>시크릿 엔진 활성화</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_SKIP_VERIFY</span><span class="token operator">=</span>True
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span><span class="token string">'http://172.28.128.21:8200'</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span><span class="token operator">&lt;</span>mytoken<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="정책-및-사용자-구성" tabindex="-1"><a class="header-anchor" href="#정책-및-사용자-구성" aria-hidden="true">#</a> 정책 및 사용자 구성</h3>
<h4 id="transit-admin" tabindex="-1"><a class="header-anchor" href="#transit-admin" aria-hidden="true">#</a> transit-admin</h4>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>$ vault policy write transit<span class="token operator">-</span>admin <span class="token operator">-</span> <span class="token operator">&lt;&lt;</span> <span class="token constant">EOF</span>
<span class="token comment"># Enable transit secrets engine</span>
path <span class="token string-literal"><span class="token string">"sys/mounts/transit"</span></span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string-literal"><span class="token string">"create"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"read"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"update"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"delete"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"list"</span></span> <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># To read enabled secrets engines</span>
path <span class="token string-literal"><span class="token string">"sys/mounts"</span></span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string-literal"><span class="token string">"read"</span></span> <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># Manage the transit secrets engine</span>
path <span class="token string-literal"><span class="token string">"transit/*"</span></span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string-literal"><span class="token string">"create"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"read"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"update"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"delete"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"list"</span></span> <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
<span class="token constant">EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="transit-message" tabindex="-1"><a class="header-anchor" href="#transit-message" aria-hidden="true">#</a> transit-message</h4>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>$ vault policy write transit<span class="token operator">-</span>message <span class="token operator">-</span><span class="token string-literal heredoc-string"><span class="token delimiter"><span class="token punctuation">&lt;&lt;</span><span class="token symbol">EOF</span></span><span class="token string">
path "transit/encrypt/message" {
   capabilities = [ "update" ]
}
path "transit/decrypt/message" {
   capabilities = [ "update" ]
}
</span><span class="token delimiter"><span class="token symbol">EOF</span></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="user-pass-생성" tabindex="-1"><a class="header-anchor" href="#user-pass-생성" aria-hidden="true">#</a> user/pass 생성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault auth <span class="token builtin class-name">enable</span> userpass

$ vault <span class="token function">write</span> auth/userpass/users/transit-admin <span class="token punctuation">\</span>
    <span class="token assign-left variable">password</span><span class="token operator">=</span>transit-admin <span class="token punctuation">\</span>
    <span class="token assign-left variable">policies</span><span class="token operator">=</span>transit-admin
    
$ vault <span class="token function">write</span> auth/userpass/users/transit-message <span class="token punctuation">\</span>
    <span class="token assign-left variable">password</span><span class="token operator">=</span>transit-message <span class="token punctuation">\</span>
    <span class="token assign-left variable">policies</span><span class="token operator">=</span>transit-message
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="transit-admin-로그인" tabindex="-1"><a class="header-anchor" href="#transit-admin-로그인" aria-hidden="true">#</a> transit-admin 로그인</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault login <span class="token parameter variable">-method</span> userpass <span class="token assign-left variable">username</span><span class="token operator">=</span>transit-admin <span class="token assign-left variable">password</span><span class="token operator">=</span>transit-admin
Success<span class="token operator">!</span> You are now authenticated. The token information displayed below
is already stored <span class="token keyword">in</span> the token helper. You <span class="token keyword">do</span> NOT need to run <span class="token string">"vault login"</span>
again. Future Vault requests will automatically use this token.

Key                    Value
---                    -----
token                  s.ldJApybiqGBmq3CuBAaqsKXZ
token_accessor         Maek0IMLkOLmFVkpG4DoGUdY
token_duration         768h
token_renewable        <span class="token boolean">true</span>
token_policies         <span class="token punctuation">[</span><span class="token string">"transit-admin"</span><span class="token punctuation">]</span>
identity_policies      <span class="token punctuation">[</span><span class="token punctuation">]</span>
policies               <span class="token punctuation">[</span><span class="token string">"transit-admin"</span><span class="token punctuation">]</span>
token_meta_username    transit-admin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="transit-secret-engine" tabindex="-1"><a class="header-anchor" href="#transit-secret-engine" aria-hidden="true">#</a> Transit Secret Engine</h2>
<h3 id="transit-secret-engine-활성화" tabindex="-1"><a class="header-anchor" href="#transit-secret-engine-활성화" aria-hidden="true">#</a> Transit Secret Engine 활성화</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>transit transit
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="암호화-키링-생성" tabindex="-1"><a class="header-anchor" href="#암호화-키링-생성" aria-hidden="true">#</a> 암호화 키링 생성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># vault write -f transit/keys/&lt;key_name></span>
$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> transit/keys/message
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="암호화-transit-message-user" tabindex="-1"><a class="header-anchor" href="#암호화-transit-message-user" aria-hidden="true">#</a> 암호화 (Transit-message User)</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span><span class="token operator">&lt;</span>client_token<span class="token operator">></span> vault <span class="token function">write</span> transit/encrypt/message <span class="token punctuation">\</span>
    <span class="token assign-left variable">plaintext</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>base64 <span class="token operator">&lt;&lt;&lt;</span> <span class="token string">"4111 1111 1111 1111"</span><span class="token variable">)</span></span>
    
Key            Value
---            -----
ciphertext     vault:v1:IKfJjYkwv1NWAaw+7O8F0QKcWxu5J98/Wvf0d8yHeBX8AoRajI6BLmS7iniCvkyp
key_version    <span class="token number">1</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="해독-transit-message-user" tabindex="-1"><a class="header-anchor" href="#해독-transit-message-user" aria-hidden="true">#</a> 해독 (Transit-message User)</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span><span class="token operator">&lt;</span>client_token<span class="token operator">></span> vault <span class="token function">write</span> transit/decrypt/message <span class="token punctuation">\</span>
    <span class="token assign-left variable">ciphertext</span><span class="token operator">=</span><span class="token string">"vault:v1:cZNHVx+sxdMErXRSuDa1q/pz49fXTn1PScKfhf+PIZPvy8xKfkytpwKcbC0fF2U="</span>

Key          Value
---          -----
plaintext    <span class="token assign-left variable">Y3JlZGl0LWNhcmQtbnVtYmVyCg</span><span class="token operator">==</span>

$ base64 <span class="token parameter variable">--decode</span> <span class="token operator">&lt;&lt;&lt;</span> <span class="token string">"Y3JlZGl0LWNhcmQtbnVtYmVyCg=="</span>
<span class="token number">4111</span> <span class="token number">1111</span> <span class="token number">1111</span> <span class="token number">1111</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>또는</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-field</span><span class="token operator">=</span>plaintext transit/decrypt/message <span class="token assign-left variable">ciphertext</span><span class="token operator">=</span><span class="token string">"vault:v1:cZNHVx+sxdMErXRSuDa1q/pz49fXTn1PScKfhf+PIZPvy8xKfkytpwKcbC0fF2U="</span> <span class="token operator">|</span> base64 <span class="token parameter variable">--decode</span>
<span class="token number">4111</span> <span class="token number">1111</span> <span class="token number">1111</span> <span class="token number">1111</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="암호화-키링-순환" tabindex="-1"><a class="header-anchor" href="#암호화-키링-순환" aria-hidden="true">#</a> 암호화 키링 순환</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> transit/keys/message/rotate
$ vault <span class="token builtin class-name">read</span> transit/keys/message
Key                       Value
---                       -----
allow_plaintext_backup    <span class="token boolean">false</span>
deletion_allowed          <span class="token boolean">false</span>
derived                   <span class="token boolean">false</span>
exportable                <span class="token boolean">false</span>
keys                      map<span class="token punctuation">[</span><span class="token number">1</span>:1617699577 <span class="token number">2</span>:1617705005<span class="token punctuation">]</span>
latest_version            <span class="token number">2</span>
min_available_version     <span class="token number">0</span>
min_decryption_version    <span class="token number">1</span>
min_encryption_version    <span class="token number">0</span>
name                      message
supports_decryption       <span class="token boolean">true</span>
supports_derivation       <span class="token boolean">true</span>
supports_encryption       <span class="token boolean">true</span>
supports_signing          <span class="token boolean">false</span>
<span class="token builtin class-name">type</span>                      aes256-gcm96
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="업데이트된-키링으로-암호화" tabindex="-1"><a class="header-anchor" href="#업데이트된-키링으로-암호화" aria-hidden="true">#</a> 업데이트된 키링으로 암호화</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> transit/encrypt/message <span class="token punctuation">\</span>
    <span class="token assign-left variable">plaintext</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>base64 <span class="token operator">&lt;&lt;&lt;</span> <span class="token string">"4111 1111 1111 1111"</span><span class="token variable">)</span></span>
Key            Value
---            -----
ciphertext     vault:v2:wdEpTdasoqY0I9SWfj0r93fDevsIl2cX2aAdfDqAPmvCMAf2w/2blU+k86MVscgW
key_version    <span class="token number">2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="업데이트된-키링으로-재-암호화" tabindex="-1"><a class="header-anchor" href="#업데이트된-키링으로-재-암호화" aria-hidden="true">#</a> 업데이트된 키링으로 재 암호화</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> transit/rewrap/message <span class="token punctuation">\</span>
    <span class="token assign-left variable">ciphertext</span><span class="token operator">=</span><span class="token string">"vault:v1:+msBmr5zjE7ZOaA1h9/kV7ZWGZlZX+YEzgco70wTT+lvlfxUDLIgdFGFVOYN777X"</span>

Key           Value
---           -----
ciphertext    vault:v2:kChHZ9w4ILRfw+DzO53IZ8m5PyB2yp2/tKbub34uB+iDqtDRB+NLCPrpzTtJHJ4<span class="token operator">=</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="기존-키링-파기" tabindex="-1"><a class="header-anchor" href="#기존-키링-파기" aria-hidden="true">#</a> 기존 키링 파기</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> transit/keys/message/config <span class="token assign-left variable">min_decryption_version</span><span class="token operator">=</span><span class="token number">2</span>
$ vault <span class="token builtin class-name">read</span> transit/keys/message
Key                       Value
---                       -----
<span class="token punctuation">..</span>.
keys                      map<span class="token punctuation">[</span><span class="token number">2</span>:1617705005<span class="token punctuation">]</span>
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="기존-암호화-데이터-복호화-→-실패" tabindex="-1"><a class="header-anchor" href="#기존-암호화-데이터-복호화-→-실패" aria-hidden="true">#</a> 기존 암호화 데이터 복호화 → 실패</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-field</span><span class="token operator">=</span>plaintext transit/decrypt/message <span class="token assign-left variable">ciphertext</span><span class="token operator">=</span><span class="token string">"vault:v1:KBhy3R8Po4J7tRtkJzZId7DZIpugxMFpTkwPwq3JOy60t1sq149PB8mmPqhKBVLT"</span> <span class="token operator">|</span> base64 <span class="token parameter variable">--decode</span>

Error writing data to transit/decrypt/message: Error making API request.

URL: PUT http://172.28.128.21:8200/v1/transit/decrypt/message
Code: <span class="token number">400</span>. Errors:

* ciphertext or signature version is disallowed by policy <span class="token punctuation">(</span>too old<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


