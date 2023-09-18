<template><div><h1 id="pki-nginx-샘플" tabindex="-1"><a class="header-anchor" href="#pki-nginx-샘플" aria-hidden="true">#</a> PKI - nginx 샘플</h1>
<blockquote>
<p><a href="https://learn.hashicorp.com/tutorials/vault/pki-engine" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/vault/pki-engine<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="vault-구성" tabindex="-1"><a class="header-anchor" href="#vault-구성" aria-hidden="true">#</a> Vault 구성</h2>
<p>환경 변수</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_SKIP_VERIFY</span><span class="token operator">=</span>True
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span><span class="token string">'http://172.28.128.11:8200'</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>s.8YXFI825TZxnwLtYHsLc9Fnb
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>정책 및 사용자 구성</p>
<p>. ./&lt;pki-policy.hcl&gt;</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>$ vault policy write pki <span class="token operator">-</span> <span class="token operator">&lt;&lt;</span> <span class="token constant">EOF</span>
<span class="token comment"># Enable secrets engine</span>
path <span class="token string-literal"><span class="token string">"sys/mounts/*"</span></span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string-literal"><span class="token string">"create"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"read"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"update"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"delete"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"list"</span></span> <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># List enabled secrets engine</span>
path <span class="token string-literal"><span class="token string">"sys/mounts"</span></span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string-literal"><span class="token string">"read"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"list"</span></span> <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># Work with pki secrets engine</span>
path <span class="token string-literal"><span class="token string">"pki*"</span></span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string-literal"><span class="token string">"create"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"read"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"update"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"delete"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"list"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"sudo"</span></span> <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
<span class="token constant">EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="인증-생성" tabindex="-1"><a class="header-anchor" href="#인증-생성" aria-hidden="true">#</a> 인증 생성</h2>
<h3 id="user-pass-생성" tabindex="-1"><a class="header-anchor" href="#user-pass-생성" aria-hidden="true">#</a> user/pass 생성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault auth <span class="token builtin class-name">enable</span> userpass

$ vault <span class="token function">write</span> auth/userpass/users/pki <span class="token punctuation">\</span>
    <span class="token assign-left variable">password</span><span class="token operator">=</span>pki <span class="token punctuation">\</span>
    <span class="token assign-left variable">policies</span><span class="token operator">=</span>pki
    
$ vault login <span class="token parameter variable">-method</span> userpass <span class="token assign-left variable">username</span><span class="token operator">=</span>pki <span class="token assign-left variable">password</span><span class="token operator">=</span>pki
Success<span class="token operator">!</span> You are now authenticated. The token information displayed below
is already stored <span class="token keyword">in</span> the token helper. You <span class="token keyword">do</span> NOT need to run <span class="token string">"vault login"</span>
again. Future Vault requests will automatically use this token.

Key                    Value
---                    -----
token                  s.ldJApybiqGBmq3CuBAaqsKXZ
token_accessor         Maek0IMLkOLmFVkpG4DoGUdY
token_duration         768h
token_renewable        <span class="token boolean">true</span>
token_policies         <span class="token punctuation">[</span><span class="token string">"pki"</span><span class="token punctuation">]</span>
identity_policies      <span class="token punctuation">[</span><span class="token punctuation">]</span>
policies               <span class="token punctuation">[</span><span class="token string">"pki"</span><span class="token punctuation">]</span>
token_meta_username    db

$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>s.7mN7t6hd1a1m97j2ptytfCqf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="approle-생성" tabindex="-1"><a class="header-anchor" href="#approle-생성" aria-hidden="true">#</a> approle 생성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault auth <span class="token builtin class-name">enable</span> approle
Success<span class="token operator">!</span> Enabled approle auth method at: approle/

$ vault <span class="token function">write</span> auth/approle/role/pki-agent <span class="token punctuation">\</span>
    <span class="token assign-left variable">secret_id_ttl</span><span class="token operator">=</span>120m <span class="token punctuation">\</span>
    <span class="token assign-left variable">token_ttl</span><span class="token operator">=</span>60m <span class="token punctuation">\</span>
    <span class="token assign-left variable">token_max_tll</span><span class="token operator">=</span>120m <span class="token punctuation">\</span>
    <span class="token assign-left variable">policies</span><span class="token operator">=</span><span class="token string">"pki"</span>
Success<span class="token operator">!</span> Data written to: auth/approle/role/pki-agent

$ vault <span class="token builtin class-name">read</span> auth/approle/role/pki-agent/role-id
Key        Value
---        -----
role_id    dfa2a248-1e1b-e2e9-200c-69c63b9ca447

$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> auth/approle/role/pki-agent/secret-id
Key                   Value
---                   -----
secret_id             864360c1-c79f-ea7c-727b-7752361fe1ba
secret_id_accessor    3cc068e2-a172-2bb1-c097-b777c3525ba6

<span class="token comment">#Tip</span>
$ <span class="token builtin class-name">echo</span> <span class="token variable"><span class="token variable">$(</span>vault <span class="token function">write</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">-format</span><span class="token operator">=</span>json auth/approle/role/pki-agent/secret-id <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">'.data.secret_id'</span><span class="token variable">)</span></span> <span class="token operator">></span> secretid

$ vault <span class="token function">write</span> auth/approle/login <span class="token assign-left variable">role_id</span><span class="token operator">=</span>dfa2a248-1e1b-e2e9-200c-69c63b9ca447 <span class="token assign-left variable">secret_id</span><span class="token operator">=</span>864360c1-c79f-ea7c-727b-7752361fe1ba
Key                     Value
---                     -----
token                   s.uGtTFun8zSNcczBrtEJrSx5y
token_accessor          eLjxnLYqfVTWFbOCXDVqwb3S
token_duration          1h
token_renewable         <span class="token boolean">true</span>
token_policies          <span class="token punctuation">[</span><span class="token string">"default"</span> <span class="token string">"pki"</span><span class="token punctuation">]</span>
identity_policies       <span class="token punctuation">[</span><span class="token punctuation">]</span>
policies                <span class="token punctuation">[</span><span class="token string">"default"</span> <span class="token string">"pki"</span><span class="token punctuation">]</span>
token_meta_role_name    pki-agent
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="pki-engin" tabindex="-1"><a class="header-anchor" href="#pki-engin" aria-hidden="true">#</a> PKI Engin</h2>
<h3 id="_1단계-root-ca-생성-없는-경우" tabindex="-1"><a class="header-anchor" href="#_1단계-root-ca-생성-없는-경우" aria-hidden="true">#</a> 1단계 : Root CA 생성 (없는 경우)</h3>
<ul>
<li>
<p>pki secret engine 활성화</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span> pki pki
Success<span class="token operator">!</span> Enabled the database secrets engine at: pki/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>최대 TTL (Time-to-Live)이 87600 시간(10년) 인 인증서를 발급</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets tune -max-lease-ttl 87600h pki
Success<span class="token operator">!</span> Tuned the secrets engine at: pki/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>루트 인증서 생성 <code v-pre>CA_cert.crt</code></p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">-field</span><span class="token operator">=</span>certificate pki/root/generate/internal <span class="token punctuation">\</span>
        <span class="token assign-left variable">common_name</span><span class="token operator">=</span><span class="token string">"example.com"</span> <span class="token punctuation">\</span>
        <span class="token assign-left variable">ttl</span><span class="token operator">=</span>87600h <span class="token operator">></span> CA_cert.crt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이렇게하면 새로운 자체 서명 된 CA 인증서와 개인 키가 생성됩니다. Vault는 임대 기간 (TTL)이 끝나면 생성 된 루트를 자동으로 취소합니다. CA 인증서는 자체 인증서 해지 목록 (CRL)에 서명합니다.</p>
</li>
<li>
<p>CA 와 CRL URL 구성</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> pki/config/urls <span class="token punctuation">\</span>
        <span class="token assign-left variable">issuing_certificates</span><span class="token operator">=</span><span class="token string">"http://172.28.128.11:8200/v1/pki/ca"</span> <span class="token punctuation">\</span>
        <span class="token assign-left variable">crl_distribution_points</span><span class="token operator">=</span><span class="token string">"http://172.28.128.11:8200/v1/pki/crl"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_2단계-intermediate-ca-구성" tabindex="-1"><a class="header-anchor" href="#_2단계-intermediate-ca-구성" aria-hidden="true">#</a> 2단계 : Intermediate CA 구성</h3>
<p>이전 단계에서 생성한 Root CA를 사용하여 Intermediate CA 생성</p>
<ul>
<li>
<p>pki secret engine 활성화</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>pki_int pki
Success<span class="token operator">!</span> Enabled the pki secrets engine at: pki_int/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>최대 TTL (Time-to-Live)이 43800 시간(5년) 인 인증서를 발급 하도록 비밀 엔진을 조정</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets tune -max-lease-ttl<span class="token operator">=</span>43800h pki_int
Success<span class="token operator">!</span> Tuned the secrets engine at: pki_int/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Intermediate CSR 생성 &lt;pki_intermediate.csr&gt;</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-format</span><span class="token operator">=</span>json pki_int/intermediate/generate/internal <span class="token punctuation">\</span>
        <span class="token assign-left variable">common_name</span><span class="token operator">=</span><span class="token string">"example.com Intermediate Authority"</span> <span class="token punctuation">\</span>
        <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">'.data.csr'</span> <span class="token operator">></span> pki_intermediate.csr
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Root 인증서로 Intermediate 인증서에 서명 &lt;intermediate.cert.pem&gt;</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-format</span><span class="token operator">=</span>json pki/root/sign-intermediate <span class="token assign-left variable">csr</span><span class="token operator">=</span>@pki_intermediate.csr <span class="token punctuation">\</span>
        <span class="token assign-left variable">format</span><span class="token operator">=</span>pem_bundle <span class="token assign-left variable">ttl</span><span class="token operator">=</span><span class="token string">"43800h"</span> <span class="token punctuation">\</span>
        <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">'.data.certificate'</span> <span class="token operator">></span> intermediate.cert.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>CSR이 서명되고 Root CA가 인증서를 반환하면 다시 Vault에서 가져옴</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> pki_int/intermediate/set-signed <span class="token assign-left variable">certificate</span><span class="token operator">=</span>@intermediate.cert.pem
Success<span class="token operator">!</span> Data written to: pki_int/intermediate/set-signed
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>URL 구성</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> pki_int/config/urls <span class="token punctuation">\</span>
        <span class="token assign-left variable">issuing_certificates</span><span class="token operator">=</span><span class="token string">"http://172.28.128.11:8200/v1/pki_int/ca"</span> <span class="token punctuation">\</span>
        <span class="token assign-left variable">crl_distribution_points</span><span class="token operator">=</span><span class="token string">"http://172.28.128.11:8200/v1/pki_int/crl"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_3단계-role-생성" tabindex="-1"><a class="header-anchor" href="#_3단계-role-생성" aria-hidden="true">#</a> 3단계 : Role 생성</h3>
<p>Role은 자격 증명을 생성하는데 사용되는 정책에 매핑되는 논리적 이름으로, 구성 매개변수가 인증서 일반 이름, 대체 이름, 유효한 키 사용등을 제어 가능</p>
<h5 id="주요-매개-변수" tabindex="-1"><a class="header-anchor" href="#주요-매개-변수" aria-hidden="true">#</a> [주요 매개 변수]</h5>
<table>
<thead>
<tr>
<th style="text-align:left">Param</th>
<th style="text-align:left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left"><code v-pre>allowed_domains</code></td>
<td style="text-align:left">역할의 도메인을 지정합니다 (<code v-pre>allow_bare_domains</code> 및<code v-pre>allow-subdomains</code> 옵션과 함께 사용).</td>
</tr>
<tr>
<td style="text-align:left"><code v-pre>allow_bare_domains</code></td>
<td style="text-align:left">클라이언트가 실제 도메인 자체의 값과 일치하는 인증서를 요청할 수 있는지 여부를 지정합니다.</td>
</tr>
<tr>
<td style="text-align:left"><code v-pre>allow_subdomains</code></td>
<td style="text-align:left">클라이언트가 다른 역할 옵션에서 허용하는 CN의 하위 도메인 인 CN을 사용하여 인증서를 요청할 수 있는지 여부를 지정합니다 (참고 : 여기에는 와일드 카드 하위 도메인이 포함됨).</td>
</tr>
<tr>
<td style="text-align:left"><code v-pre>allow_glob_domains</code></td>
<td style="text-align:left">allowed_domains에 지정된 이름에 glob 패턴 (예 : ftp * .example.com)을 포함 할 수 있습니다.</td>
</tr>
</tbody>
</table>
<p>여기서는 example-dot-com 이라는 Role 을 생성</p>
<ul>
<li>
<p>하위 도메인을 허용하는 <code v-pre>example-dot.com</code> Role 생성</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> pki_int/roles/example-dot-com <span class="token punctuation">\</span>
        <span class="token assign-left variable">allowed_domains</span><span class="token operator">=</span><span class="token string">"example.com"</span> <span class="token punctuation">\</span>
        <span class="token assign-left variable">allow_subdomains</span><span class="token operator">=</span>true <span class="token punctuation">\</span>
        <span class="token assign-left variable">max_ttl</span><span class="token operator">=</span><span class="token string">"720h"</span>
Success<span class="token operator">!</span> Data written to: pki_int/roles/example-dot-com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_4단계-인증서-요청" tabindex="-1"><a class="header-anchor" href="#_4단계-인증서-요청" aria-hidden="true">#</a> 4단계 : 인증서 요청</h3>
<blockquote>
<p>Vault의 단기 비밀관리의 철학은 인증서 수명을 짧게 유지하는 것입니다.</p>
</blockquote>
<ul>
<li>
<p><code v-pre>example-dot-com</code> Role에 따라 <code v-pre>test.example.com</code> 도메인에 대한 새 인증서 요청<br>
(응답에는 PEM으로 인코딩 된 개인 키, 키 유형 및 인증서 일련 번호가 포함됩니다.)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> pki_int/issue/example-dot-com <span class="token assign-left variable">common_name</span><span class="token operator">=</span><span class="token string">"test.example.com"</span> <span class="token assign-left variable">ttl</span><span class="token operator">=</span><span class="token string">"2m"</span> <span class="token comment">#format="pem_bundle"</span>
<span class="token comment"># vault write pki_int/issue/example-dot-com common_name="tfe.example.com" ttl="700h" </span>

Key                 Value
---                 -----
certificate         -----BEGIN CERTIFICATE-----
MIIDwzCCAqugAwIBAgIUTQABMCAsXjG6ExFTX8201xKVH4IwDQYJKoZIhvcNAQEL
BQAwGjEYMBYGA1UEAxMPd3d3LmV4YW1wbGUuY29tMB4XDTE4MDcyNDIxMTMxOVoX
             <span class="token punctuation">..</span>.

-----END CERTIFICATE-----
issuing_ca          -----BEGIN CERTIFICATE-----
MIIDQTCCAimgAwIBAgIUbMYp39mdj7dKX033ZjK18rx05x8wDQYJKoZIhvcNAQEL
             <span class="token punctuation">..</span>.

-----END CERTIFICATE-----
private_key         -----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAte1fqy2Ekj+EFqKV6N5QJlBgMo/U4IIxwLZI6a87yAC/rDhm
W58liadXrwjzRgWeqVOoCRr/B5JnRLbyIKBVp6MMFwZVkynEPzDmy0ynuomSfJkM
             <span class="token punctuation">..</span>.

-----END RSA PRIVATE KEY-----
private_key_type    rsa
serial_number       4d:00:01:30:20:2c:5e:31:ba:13:11:53:5f:cd:b4:d7:12:95:1f:82
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h2 id="vault-agent" tabindex="-1"><a class="header-anchor" href="#vault-agent" aria-hidden="true">#</a> Vault Agent</h2>
<p>생성되는 PKI인증서를 자동으로 갱신하기 위해 Vault Agent 구성</p>
<p>secretid 생성의 예</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token variable"><span class="token variable">$(</span>vault <span class="token function">write</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">-format</span><span class="token operator">=</span>json auth/approle/role/pki-agent/secret-id <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">'.data.secret_id'</span><span class="token variable">)</span></span> <span class="token operator">></span> secretid
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>[vault_agent.hcl]</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>pid_file <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/pidfile"</span></span>

auto_auth <span class="token punctuation">{</span>
  method  <span class="token punctuation">{</span>
    type <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"approle"</span></span>
    config <span class="token operator">=</span> <span class="token punctuation">{</span>
      role_id_file_path <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/roleid"</span></span>
      secret_id_file_path <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/secretid"</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  sink <span class="token punctuation">{</span>
    type <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"file"</span></span>
    config <span class="token operator">=</span> <span class="token punctuation">{</span>
      path <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/tmp/vault_agent"</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

vault <span class="token punctuation">{</span>
  address <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"http://172.28.128.11:8200"</span></span>
<span class="token punctuation">}</span>

template <span class="token punctuation">{</span>
  source      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/cert.tpl"</span></span>
  destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/cert/my-app.crt"</span></span>
<span class="token punctuation">}</span>

template <span class="token punctuation">{</span>
  source      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/ca.tpl"</span></span>
  destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/cert/ca.crt"</span></span>
<span class="token punctuation">}</span>

template <span class="token punctuation">{</span>
  source      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/key.tpl"</span></span>
  destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/cert/my-app.key"</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>[인증 정보]</p>
<p><code v-pre>role_id_file_path</code>, <code v-pre>secret_id_file_path</code>에는 앞서 생성한 approle의 role id와 secret id를 대상 파일에 저장</p>
<p>[template - default pem]</p>
<ul>
<li>
<p>cert.tpl</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">-</span> <span class="token operator">/</span><span class="token operator">*</span> <span class="token operator">/</span>tmp<span class="token operator">/</span>ca<span class="token punctuation">.</span>tpl <span class="token operator">*</span><span class="token operator">/</span> <span class="token operator">-</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> with secret <span class="token string-literal"><span class="token string">"pki_int/issue/example-dot-com"</span></span> <span class="token string-literal"><span class="token string">"common_name=test.example.com"</span></span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token punctuation">.</span>Data<span class="token punctuation">.</span>issuing_ca <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">end</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>ca.tpl</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">-</span> <span class="token operator">/</span><span class="token operator">*</span> <span class="token operator">/</span>tmp<span class="token operator">/</span>cert<span class="token punctuation">.</span>tpl <span class="token operator">*</span><span class="token operator">/</span> <span class="token operator">-</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> with secret <span class="token string-literal"><span class="token string">"pki_int/issue/example-dot-com"</span></span> <span class="token string-literal"><span class="token string">"common_name=test.example.com"</span></span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token punctuation">.</span>Data<span class="token punctuation">.</span>certificate <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">end</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Key.tpl</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">-</span> <span class="token operator">/</span><span class="token operator">*</span> <span class="token operator">/</span>tmp<span class="token operator">/</span>key<span class="token punctuation">.</span>tpl <span class="token operator">*</span><span class="token operator">/</span> <span class="token operator">-</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> with secret <span class="token string-literal"><span class="token string">"pki_int/issue/example-dot-com"</span></span> <span class="token string-literal"><span class="token string">"common_name=test.example.com"</span></span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token punctuation">.</span>Data<span class="token punctuation">.</span>private_key <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">end</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="실행은-스크립트-혹은-스크립트를-서비스로-구성" tabindex="-1"><a class="header-anchor" href="#실행은-스크립트-혹은-스크립트를-서비스로-구성" aria-hidden="true">#</a> 실행은 스크립트 혹은 스크립트를 서비스로 구성</h3>
<ul>
<li>
<p>script (e.g. <a href="http://start.sh" target="_blank" rel="noopener noreferrer">start.sh<ExternalLinkIcon/></a>)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault agent <span class="token parameter variable">-config</span><span class="token operator">=</span>/root/vault_agent/vault_agent.hcl -log-level<span class="token operator">=</span>debug
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>service (e.g. vault-agent.service)</p>
<div class="language-properties line-numbers-mode" data-ext="properties"><pre v-pre class="language-properties"><code>[Unit]
<span class="token key attr-name">Description</span><span class="token punctuation">=</span><span class="token value attr-value">Vault Service Discovery Agent</span>
<span class="token key attr-name">Documentation</span><span class="token punctuation">=</span><span class="token value attr-value">https://www.vaultproject.io/</span>
<span class="token key attr-name">After</span><span class="token punctuation">=</span><span class="token value attr-value">network-online.target</span>
<span class="token key attr-name">Wants</span><span class="token punctuation">=</span><span class="token value attr-value">network-online.target</span>

[Service]
<span class="token key attr-name">Type</span><span class="token punctuation">=</span><span class="token value attr-value">simple</span>
<span class="token key attr-name">User</span><span class="token punctuation">=</span><span class="token value attr-value">vault</span>
<span class="token key attr-name">Group</span><span class="token punctuation">=</span><span class="token value attr-value">vault</span>
<span class="token key attr-name">ExecStart</span><span class="token punctuation">=</span><span class="token value attr-value">/usr/local/bin/vault agent -config=/root/vault_agent/vault_agent.hcl</span>

<span class="token key attr-name">ExecReload</span><span class="token punctuation">=</span><span class="token value attr-value">/bin/kill -HUP $MAINPID</span>
<span class="token key attr-name">KillSignal</span><span class="token punctuation">=</span><span class="token value attr-value">SIGINT</span>
<span class="token key attr-name">TimeoutStopSec</span><span class="token punctuation">=</span><span class="token value attr-value">5</span>
<span class="token key attr-name">Restart</span><span class="token punctuation">=</span><span class="token value attr-value">on-failure</span>
<span class="token key attr-name">SyslogIdentifier</span><span class="token punctuation">=</span><span class="token value attr-value">vault</span>

[Install]
<span class="token key attr-name">WantedBy</span><span class="token punctuation">=</span><span class="token value attr-value">multi-user.target</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h2 id="appendix" tabindex="-1"><a class="header-anchor" href="#appendix" aria-hidden="true">#</a> Appendix</h2>
<h3 id="pki-관리" tabindex="-1"><a class="header-anchor" href="#pki-관리" aria-hidden="true">#</a> PKI 관리</h3>
<ul>
<li>
<p>pki revoke</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> pki_int/revoke <span class="token assign-left variable">serial_number</span><span class="token operator">=</span><span class="token string">"56:ac:c0:f3:b4:1e:87:69:ec:dd:7d:27:54:f6:1c:14:91:3d:11:2d"</span>
Key                        Value
---                        -----
revocation_time            <span class="token number">1611557908</span>
revocation_time_rfc3339    <span class="token number">2021</span>-01-25T06:58:28.592511981Z
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>pki rotate</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> pki_int/crl/rotate
Key        Value
---        -----
success    <span class="token boolean">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="nginx-활용" tabindex="-1"><a class="header-anchor" href="#nginx-활용" aria-hidden="true">#</a> Nginx 활용</h3>
<p>테스트 대상 시스템에 CA, Intermediated 인증서를 신뢰할 수 있는 인증서로 등록</p>
<p>[vault_agent.hcl]</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>pid_file <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/pidfile"</span></span>

auto_auth <span class="token punctuation">{</span>
  method  <span class="token punctuation">{</span>
    type <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"approle"</span></span>
    config <span class="token operator">=</span> <span class="token punctuation">{</span>
      role_id_file_path <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/roleid"</span></span>
      secret_id_file_path <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/secretid"</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  sink <span class="token punctuation">{</span>
    type <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"file"</span></span>
    config <span class="token operator">=</span> <span class="token punctuation">{</span>
      path <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/tmp/vault_agent"</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

vault <span class="token punctuation">{</span>
  address <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"http://172.28.128.11:8200"</span></span>
<span class="token punctuation">}</span>

template <span class="token punctuation">{</span>
  source      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/cert.tpl"</span></span>
  destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/cert/test.cert.pem"</span></span>
  perms       <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"0600"</span></span>
<span class="token punctuation">}</span>

template <span class="token punctuation">{</span>
  source      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/vault_agent/key.tpl"</span></span>
  destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/cert/test.key.pem"</span></span>
  perms       <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"0600"</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>[template - pem_bundle]</p>
<ul>
<li>
<p>cert.tpl</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">-</span> <span class="token operator">/</span><span class="token operator">*</span> <span class="token operator">/</span>tmp<span class="token operator">/</span>cert<span class="token punctuation">.</span>tpl <span class="token operator">*</span><span class="token operator">/</span> <span class="token operator">-</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> with secret <span class="token string-literal"><span class="token string">"pki_int/issue/example-dot-com"</span></span> <span class="token string-literal"><span class="token string">"common_name=test.example.com"</span></span>  <span class="token string-literal"><span class="token string">"ttl=2m"</span></span><span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token punctuation">.</span>Data<span class="token punctuation">.</span>certificate <span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token punctuation">.</span>Data<span class="token punctuation">.</span>issuing_ca <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">end</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Key.tpl</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token punctuation">{</span><span class="token punctuation">{</span><span class="token operator">-</span> <span class="token operator">/</span><span class="token operator">*</span> <span class="token operator">/</span>tmp<span class="token operator">/</span>key<span class="token punctuation">.</span>tpl <span class="token operator">*</span><span class="token operator">/</span> <span class="token operator">-</span><span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> with secret <span class="token string-literal"><span class="token string">"pki_int/issue/example-dot-com"</span></span> <span class="token string-literal"><span class="token string">"common_name=test.example.com"</span></span> <span class="token string-literal"><span class="token string">"ttl=2m"</span></span><span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token punctuation">.</span>Data<span class="token punctuation">.</span>private_key <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token keyword">end</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<p>[/etc/nginx/sites-enabled/default]</p>
<blockquote>
<p>rotation 되면 systemctl reload nginx</p>
</blockquote>
<div class="language-properties line-numbers-mode" data-ext="properties"><pre v-pre class="language-properties"><code><span class="token key attr-name">server</span> <span class="token value attr-value">{</span>
<span class="token key attr-name">       listen</span> <span class="token value attr-value">80;</span>
<span class="token key attr-name">       server_name</span> <span class="token value attr-value">text.example.com;</span>
<span class="token key attr-name">       return</span> <span class="token value attr-value">301 HTTPS://$server_name$request_uri;</span>
}

<span class="token key attr-name">server</span> <span class="token value attr-value">{</span>
<span class="token key attr-name">	listen</span> <span class="token value attr-value">443 ssl default_server;</span>
<span class="token key attr-name">	listen</span> <span class="token value attr-value">[::]:443 ssl default_server;</span>

<span class="token key attr-name">  ssl</span> <span class="token value attr-value">on;</span>
<span class="token key attr-name">  server_name</span> <span class="token value attr-value">test.example.com;</span>
<span class="token key attr-name">  ssl_certificate</span> <span class="token value attr-value">/root/cert/test.cert.pem;</span>
<span class="token key attr-name">  ssl_certificate_key</span> <span class="token value attr-value">/root/cert/test.key.pem;</span>

<span class="token key attr-name">	root</span> <span class="token value attr-value">/var/www/html;</span>

<span class="token comment">	# Add index.php to the list if you are using PHP</span>
<span class="token key attr-name">	index</span> <span class="token value attr-value">index.html index.htm index.nginx-debian.html;</span>

<span class="token key attr-name">	server_name</span> <span class="token value attr-value">_;</span>

<span class="token key attr-name">	location</span> <span class="token value attr-value">/ {</span>
<span class="token comment">		# First attempt to serve request as file, then</span>
<span class="token comment">		# as directory, then fall back to displaying a 404.</span>
<span class="token key attr-name">		try_files</span> <span class="token value attr-value">$uri $uri/ =404;</span>
	}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


