<template><div><h1 id="token의-이해" tabindex="-1"><a class="header-anchor" href="#token의-이해" aria-hidden="true">#</a> Token의 이해</h1>
<blockquote>
<p><a href="https://developer.hashicorp.com/vault/docs/concepts/tokens" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/vault/docs/concepts/tokens<ExternalLinkIcon/></a></p>
</blockquote>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230304125220402.png" alt="image-20230304125220402" tabindex="0" loading="lazy"><figcaption>image-20230304125220402</figcaption></figure>
<h2 id="_1-token의-구성과-내용" tabindex="-1"><a class="header-anchor" href="#_1-token의-구성과-내용" aria-hidden="true">#</a> 1. Token의 구성과 내용</h2>
<p>다음은 수동으로 Token을 생성하는 방법으로 Token을 생성할 수 있는 권한의 사용자가 CLI를 사용하여 <code v-pre>default</code> Policy를 갖는 Token을 생성하는 경우의 예이다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token create <span class="token parameter variable">-policy</span><span class="token operator">=</span>default

Key                  Value
---                  -----
token                hvs.CAESIO7WUHJ15SkEOgtqzcVuF8pTZdBQmI
token_accessor       yK2enofb1NExLrLFqg136mw5
token_duration       768h
token_renewable      <span class="token boolean">true</span>
token_policies       <span class="token punctuation">[</span><span class="token string">"default"</span><span class="token punctuation">]</span>
identity_policies    <span class="token punctuation">[</span><span class="token punctuation">]</span>
policies             <span class="token punctuation">[</span><span class="token string">"default"</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>간단한 응답과 달리 API로 요청하면 더 상세한 응답 결과를 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># payload.json</span>
<span class="token punctuation">{</span>
  <span class="token string">"policies"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span><span class="token string">"default"</span><span class="token punctuation">]</span>,
  <span class="token string">"meta"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
    <span class="token string">"user"</span><span class="token builtin class-name">:</span> <span class="token string">"armon"</span>
  <span class="token punctuation">}</span>,
  <span class="token string">"ttl"</span><span class="token builtin class-name">:</span> <span class="token string">"1h"</span>,
  <span class="token string">"renewable"</span><span class="token builtin class-name">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token comment"># API 요청</span>
<span class="token function">curl</span> <span class="token punctuation">\</span>
    <span class="token parameter variable">--header</span> <span class="token string">"X-Vault-Token: root"</span> <span class="token punctuation">\</span>
    <span class="token parameter variable">--request</span> POST <span class="token punctuation">\</span>
    <span class="token parameter variable">--data</span> @payload.json <span class="token punctuation">\</span>
		http://127.0.0.1:8200/v1/auth/token/create <span class="token operator">|</span> jq <span class="token builtin class-name">.</span>

<span class="token comment"># API 응답</span>
<span class="token punctuation">{</span>
  <span class="token string">"request_id"</span><span class="token builtin class-name">:</span> <span class="token string">"a0a87aea-3627-a2a6-ab3c-8c08285fdc7d"</span>,
  <span class="token string">"lease_id"</span><span class="token builtin class-name">:</span> <span class="token string">""</span>,
  <span class="token string">"renewable"</span><span class="token builtin class-name">:</span> false,
  <span class="token string">"lease_duration"</span><span class="token builtin class-name">:</span> <span class="token number">0</span>,
  <span class="token string">"data"</span><span class="token builtin class-name">:</span> null,
  <span class="token string">"wrap_info"</span><span class="token builtin class-name">:</span> null,
  <span class="token string">"warnings"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
    <span class="token string">"Endpoint ignored these unrecognized parameters: [meta]"</span>
  <span class="token punctuation">]</span>,
  <span class="token string">"auth"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
    <span class="token string">"client_token"</span><span class="token builtin class-name">:</span> <span class="token string">"hvs.CAESIO-LeVOy1mOLSz1f-yDC22cFqOXQ2u5a3hmLVxeZ1V07Gh4KHGh2cy5mTmJZbERwZ0xLeldqeFgwYWRyc3Z4a0g"</span>,
    <span class="token string">"accessor"</span><span class="token builtin class-name">:</span> <span class="token string">"ArOmYq9MuDyo1wZkLisad6Ml"</span>,
    <span class="token string">"policies"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
      <span class="token string">"default"</span>
    <span class="token punctuation">]</span>,
    <span class="token string">"token_policies"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
      <span class="token string">"default"</span>
    <span class="token punctuation">]</span>,
    <span class="token string">"metadata"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
      <span class="token string">"user"</span><span class="token builtin class-name">:</span> <span class="token string">"armon"</span>
    <span class="token punctuation">}</span>,
    <span class="token string">"lease_duration"</span><span class="token builtin class-name">:</span> <span class="token number">3600</span>,
    <span class="token string">"renewable"</span><span class="token builtin class-name">:</span> true,
    <span class="token string">"entity_id"</span><span class="token builtin class-name">:</span> <span class="token string">""</span>,
    <span class="token string">"token_type"</span><span class="token builtin class-name">:</span> <span class="token string">"service"</span>,
    <span class="token string">"orphan"</span><span class="token builtin class-name">:</span> false,
    <span class="token string">"mfa_requirement"</span><span class="token builtin class-name">:</span> null,
    <span class="token string">"num_uses"</span><span class="token builtin class-name">:</span> <span class="token number">0</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>다음은 userpass 인증방식을 CLI를 사용하여 <code v-pre>default</code> Policy를 갖는 Token을 발급받는 경우의 예이다. 이경우 발급된 Token은 시스템 홈디렉터리의 <code v-pre>.vault-token</code> 파일에 Token이 저장된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault login <span class="token parameter variable">-method</span><span class="token operator">=</span>userpass <span class="token assign-left variable">username</span><span class="token operator">=</span>admin
Password <span class="token punctuation">(</span>will be hidden<span class="token punctuation">)</span>: ********

Success<span class="token operator">!</span> You are now authenticated. The token information displayed below
is already stored <span class="token keyword">in</span> the token helper. You <span class="token keyword">do</span> NOT need to run <span class="token string">"vault login"</span>
again. Future Vault requests will automatically use this token.

Key                    Value
---                    -----
token                  hvs.CAESIFyNxoV1I-_nFeBh9LBxDB9oGNghX
token_accessor         80nJPKtpaPbMUyQ715VkRGig
token_duration         768h
token_renewable        <span class="token boolean">true</span>
token_policies         <span class="token punctuation">[</span><span class="token string">"default"</span><span class="token punctuation">]</span>
identity_policies      <span class="token punctuation">[</span><span class="token punctuation">]</span>
policies               <span class="token punctuation">[</span><span class="token string">"default"</span><span class="token punctuation">]</span>
token_meta_username    admin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>CLI 출력을 기준으로 출력된 <code v-pre>Key</code>의 설명은 다음과 같다.</p>
<table>
<thead>
<tr>
<th>CLI 결과</th>
<th>API 결과</th>
<th>설명</th>
</tr>
</thead>
<tbody>
<tr>
<td>token</td>
<td>client_token</td>
<td>생성된 Token 문자열 값</td>
</tr>
<tr>
<td>token_accessor</td>
<td>accessor</td>
<td>Token과 쌍으로 생성된 참조 값</td>
</tr>
<tr>
<td>token_duration</td>
<td>lease_duration</td>
<td>생성된 Token의 사용 기간</td>
</tr>
<tr>
<td>token_renewable</td>
<td>renewable</td>
<td>Renewal 가능 여부</td>
</tr>
<tr>
<td>token_policies</td>
<td>token_policies</td>
<td>생성시 부여된 Policy</td>
</tr>
<tr>
<td>identity_policies</td>
<td>(entity_id로 조회 필요)</td>
<td>Token이 속한 Identity(Entity)에 부여된  Policy 목록</td>
</tr>
<tr>
<td>polices</td>
<td>policies</td>
<td>Token에 부여된 전체 Policy 목록</td>
</tr>
<tr>
<td>token_meta_[key]</td>
<td>metadata</td>
<td>metatada 출력</td>
</tr>
</tbody>
</table>
<p>Token이 생성되면 종류에 따라 붙는 Prefix를 보고 유형을 유추할 수 있다.</p>
<table>
<thead>
<tr>
<th>Token 유형</th>
<th>&lt;1.9</th>
<th>&gt;=1.10</th>
</tr>
</thead>
<tbody>
<tr>
<td>Service Token</td>
<td>s.</td>
<td>hvs.</td>
</tr>
<tr>
<td>Batch Token</td>
<td>b.</td>
<td>hvb.</td>
</tr>
<tr>
<td>Recovery Token</td>
<td>r.</td>
<td>hvr.</td>
</tr>
</tbody>
</table>
<h2 id="_2-token-계층-종속성" tabindex="-1"><a class="header-anchor" href="#_2-token-계층-종속성" aria-hidden="true">#</a> 2. Token 계층(종속성)</h2>
<p>Token의 여러 속성 중 종속성의 이해가 필요하다. 종속성으로 인해 상위 Token이 취소되거나 만료되면 하위 Token도 함께 취소된다. 동작을 확인하기 위해 독립된 Orphan Token을 생성하고 하위 Token을 생성 한 뒤 상위 Token을 취소했을 때 현상을 확인하여 종속성의 결과를 확인 가능하다.</p>
<p>Root Token이 <code v-pre>VAULT_TOKEN</code> 환경변수에 정의된 상태에서 모든 권한을 갖는 Policy를 생성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># super-user.hcl </span>
path <span class="token string">"*"</span> <span class="token punctuation">{</span>
    capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"read"</span>, <span class="token string">"update"</span>, <span class="token string">"delete"</span>, <span class="token string">"list"</span>, <span class="token string">"sudo"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># Policy 적용</span>
$ vault policy <span class="token function">write</span> super-user super-user.hcl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>독립된 Token을 생성한다. 이 Token의 TTL은 60초로 짧게 부여한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token create <span class="token parameter variable">-policy</span><span class="token operator">=</span>super-user <span class="token parameter variable">-ttl</span><span class="token operator">=</span>60s <span class="token parameter variable">-orphan</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>새로 생성된 Token을 <code v-pre>VAULT_TOKEN</code>환경변수로 지정한 상태에서 새로운 하위 Token을 생성한다. 이 Token의 TTL은 768시간으로 길게 부여한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token create <span class="token parameter variable">-policy</span><span class="token operator">=</span>default <span class="token parameter variable">-ttl</span><span class="token operator">=</span>768h
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code v-pre>-orphan</code> 옵션이 붙지 않은 Token은 상위 Token에 종속되므로 768시간의 TTL을 갖고 있지만 상위 Token이 60초가 지나 만료되면 해당 하위 토큰도 함께 만료됨을 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token <span class="token operator">&lt;</span>CHILD_TOKEN<span class="token operator">></span>
Error looking up token: Error making API request.

URL: POST http://127.0.0.1:8200/v1/auth/token/lookup
Code: <span class="token number">403</span>. Errors:

* bad token
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-orphan-token" tabindex="-1"><a class="header-anchor" href="#_3-orphan-token" aria-hidden="true">#</a> 3. Orphan Token</h2>
<p>Token 종속성으로인한 하위 Token의 의도하지 않은 취소를 피하려면 Orphan(고아) Token으로의 지정이 필요하다. Token을 생성한 Parent(부모/상위) Token과 생성된 Child(자식/하위) Token의 관계가 형성되며, Orphan Token의 경우 Parent에서 독립되어 Token Tree의 루트가 된다. Orphan Token을 생성하는 방안은 다음과 같다.</p>
<h3 id="방안-1-auth-token-create-orphan-엔드포인트" tabindex="-1"><a class="header-anchor" href="#방안-1-auth-token-create-orphan-엔드포인트" aria-hidden="true">#</a> 방안 1. <code v-pre>auth/token/create-orphan</code> 엔드포인트</h3>
<p><code v-pre>auth/token/create-orphan</code> 엔드포인트에 <code v-pre>write</code> 권한이 필요하다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>path <span class="token string">"auth/token/create-orphan"</span> <span class="token punctuation">{</span>
    <span class="token property">capabilities</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"update"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Token 생성 시 해당 엔드포인트로 요청하여 Orphan Token을 생성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code> $ vault <span class="token function">write</span> <span class="token parameter variable">-force</span> auth/token/create-orphan <span class="token assign-left variable">policies</span><span class="token operator">=</span>default
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="방안-2-auth-token-create-요청-시-no-parent-옵션-사용" tabindex="-1"><a class="header-anchor" href="#방안-2-auth-token-create-요청-시-no-parent-옵션-사용" aria-hidden="true">#</a> 방안 2. <code v-pre>auth/token/create</code> 요청 시 <code v-pre>no_parent</code> 옵션 사용</h3>
<p>[방안 1]과 같이 Orphan을 위한 엔드포인트 외에 일반적인 Token 생성 엔드포인트를 요청하는 경우 <code v-pre>no_parent</code> 옵션을 <code v-pre>true</code>로 설정하여 요청한다. <code v-pre>auth/token/create</code> 엔드포인트에 <code v-pre>write</code> 권한 필요하다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>path <span class="token string">"auth/token/create"</span> <span class="token punctuation">{</span>
    <span class="token property">capabilities</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"update"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Token 생성 시 해당 엔드포인트로 요청하여 Orphan Token을 생성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-force</span> auth/token/create <span class="token assign-left variable">policies</span><span class="token operator">=</span>default <span class="token assign-left variable">no_parent</span><span class="token operator">=</span>true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code v-pre>vault write</code> 요청과 함께, Token을 위한 전용 CLI 인 <code v-pre>vault token create</code>를 사용할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token create <span class="token parameter variable">-policy</span><span class="token operator">=</span><span class="token string">"default"</span> <span class="token parameter variable">-orphan</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="방안-3-token-role에-orphan-정의" tabindex="-1"><a class="header-anchor" href="#방안-3-token-role에-orphan-정의" aria-hidden="true">#</a> 방안 3. Token Role에 Orphan 정의</h3>
<p>Token을 필요한 시점마다 만드는 것이 아닌 미리 정의된 Token Role을 기반으로 Token을 생성할 때, 해당 Role에 Orphan으로 생성한다는 정의가 된 경우 생성되는 Token은 Orphan Token이 된다. Token Role을 CLI로 생성하는 방법은 다음과 같다. 간단히 허용하는 Policy와 Orphan 여부만 설정하였다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> auth/token/roles/my-orphan <span class="token assign-left variable">allowed_policies</span><span class="token operator">=</span><span class="token string">"default"</span> <span class="token assign-left variable">orphan</span><span class="token operator">=</span>true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Token Role을 기반으로 Token 생성을 요청하면 정의된 설정에 의해 Token이 생성된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token create <span class="token parameter variable">-policy</span><span class="token operator">=</span>default <span class="token parameter variable">-role</span><span class="token operator">=</span>my-orphan
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="방안-4-token-직접-생성을-제외한-auth-methods로-로그인" tabindex="-1"><a class="header-anchor" href="#방안-4-token-직접-생성을-제외한-auth-methods로-로그인" aria-hidden="true">#</a> 방안 4. Token 직접 생성을 제외한 Auth Methods로 로그인</h3>
<p>Auth Methods를 통해 인증 후 받게되는 Token은 Orphan Token으로 생성되어 반환된다.</p>
<p>위 [방안 1~4]에서 생성된 Orphan Token은 Token을 조회하면 Orphan 여부를 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token lookup <span class="token operator">&lt;</span>VAULT_TOKEN<span class="token operator">></span>

Key                 Value
---                 -----
<span class="token punctuation">..</span>.
orphan              <span class="token boolean">true</span> <span class="token comment"># Orphan 여부</span>
path                auth/userpass/login/admin <span class="token comment"># Token이 생성된 API 엔드포인트</span>
policies            <span class="token punctuation">[</span>default super-user<span class="token punctuation">]</span>
<span class="token builtin class-name">type</span>                <span class="token function">service</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-token-유형" tabindex="-1"><a class="header-anchor" href="#_4-token-유형" aria-hidden="true">#</a> 4. Token 유형</h2>
<p>Token의 유형은 <code v-pre>Service</code> 타입과 <code v-pre>Batch</code> 타입으로 나뉘며, 각각은 Orphan 여부에 따라 Token을 생성한 Parent Token과의 종속성을 정의할 수 있다.</p>
<ul>
<li>Service Token :
<ul>
<li>Orphan Token이 아니라면 이를 생성한 Token과 연결되어 함께 추적</li>
<li>Parent Token이 만료되면 함께 취소됨</li>
</ul>
</li>
<li>Batch Token :
<ul>
<li>Batch Token으로 생성된  Lease는 Batch Token의 남은 TTL 기간으로 제한</li>
<li>Batch Token이 Orphan이 아닌 경우 이를 생성한 상위 Token에 의해 추적되며, Parent Token 만료시 사용 중지</li>
</ul>
</li>
</ul>
<table>
<thead>
<tr>
<th>기능</th>
<th>Service Token</th>
<th>Batch Token</th>
</tr>
</thead>
<tbody>
<tr>
<td>Root Token 역할</td>
<td>✅</td>
<td>⛔️</td>
</tr>
<tr>
<td>Chile Token 생성</td>
<td>✅</td>
<td>⛔️</td>
</tr>
<tr>
<td>Renewable(기간 늘림)</td>
<td>✅</td>
<td>⛔️</td>
</tr>
<tr>
<td>Manually Revocable(수동 취소)</td>
<td>✅</td>
<td>⛔️</td>
</tr>
<tr>
<td>Periodic 형태</td>
<td>✅</td>
<td>⛔️</td>
</tr>
<tr>
<td>Explicit Max TTL 설정</td>
<td>✅</td>
<td>⛔️ (고정)</td>
</tr>
<tr>
<td>Accessor 여부</td>
<td>✅</td>
<td>⛔️</td>
</tr>
<tr>
<td>Cubbyhole 사용 여부</td>
<td>✅</td>
<td>⛔️</td>
</tr>
<tr>
<td>Revoke with parent (부모 Token이 취소될 때 같이 취소)</td>
<td>✅</td>
<td>Revoke는 아니나 사용 중지</td>
</tr>
<tr>
<td>Dynamic Secrets lease assignment</td>
<td>자체 할당</td>
<td>부모로 동작</td>
</tr>
<tr>
<td>Performance Replication Cluster 전체에서 사용</td>
<td>⛔️</td>
<td>✅</td>
</tr>
<tr>
<td>Cost</td>
<td>무거움 : 백엔드 스토리지에 건당 저장</td>
<td>가벼움 : 백엔드 스토리지 저장되지 않음</td>
</tr>
</tbody>
</table>
<h2 id="_5-token-accessor" tabindex="-1"><a class="header-anchor" href="#_5-token-accessor" aria-hidden="true">#</a> 5. Token Accessor</h2>
<p>Token이 생성되면 Accessor도 함께 생성되는데, 이 Accessor는 Token을 참조하는 값임과 동시에 Token을 직접 알지 못하더라도 Token에 대한 기본 속성이나 Renew(갱신),  Revoke(취소) 작업을 수행할 수 있다. Accessor에 대한 작업은 일반적인 <code v-pre>read</code>, <code v-pre>write</code> 작업과 더불어 <code v-pre>vault token</code> CLI로도 사용 가능하다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Token lookup</span>
$ vault <span class="token function">write</span> auth/token/lookup-accessor <span class="token assign-left variable">accessor</span><span class="token operator">=</span><span class="token operator">&lt;</span>ACCESSOR<span class="token operator">></span>
$ vault token lookup <span class="token parameter variable">-accessor</span> <span class="token operator">&lt;</span>ACCESSOR<span class="token operator">></span>

<span class="token comment"># Token Renew</span>
$ vault <span class="token function">write</span> auth/token/renew-accessor <span class="token assign-left variable">accessor</span><span class="token operator">=</span><span class="token operator">&lt;</span>ACCESSOR<span class="token operator">></span>
$ vault token renew <span class="token parameter variable">-accessor</span> <span class="token operator">&lt;</span>ACCESSOR<span class="token operator">></span>

<span class="token comment"># Token Revoke</span>
$ vault <span class="token function">write</span> auth/token/revoke-accessor <span class="token assign-left variable">accessor</span><span class="token operator">=</span><span class="token operator">&lt;</span>ACCESSOR<span class="token operator">></span>
$ vault token revoke <span class="token parameter variable">-accessor</span> <span class="token operator">&lt;</span>ACCESSOR<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이미 발급된 Token을 알수는 없지만 몇몇 동작은 Accessor로 수행이 가능하므로, 이런 Accessor 값을 노출시키는 것은 임의로 Revoke하는 작업이 수반되는 경우 위험할 수 있어 각별히 조심해야 한다.</p>
<h2 id="_6-ttl과-period" tabindex="-1"><a class="header-anchor" href="#_6-ttl과-period" aria-hidden="true">#</a> 6. TTL과 Period</h2>
<p>Root Token을 제외한 모든 Token은 TTL이 부여된다. TTL은 token의 생성 시간 또는 마지막 갱신 시간 중 가장 최근 시간 기준으로 이후의 유효한 기간까지의 시간이다.</p>
<ul>
<li>Token의 TTL이 갱신이 가능한 경우 <code v-pre>vault token renew</code> 명령으로 갱신 가능</li>
<li>Token에는 Explicit Max TTL를 설정할 수 있으며, Explicit Max TTL 시간 까지는 TTL을 갱신 할 수 있으며, 모든 경우에서 Max TTL을 넘어서 사용 불가</li>
</ul>
<p>다음과 같이 TTL과 Explicit Max TTL을 설정하여 Token을 생성해본다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token create <span class="token parameter variable">-policy</span><span class="token operator">=</span>default <span class="token parameter variable">-ttl</span><span class="token operator">=</span>60s -explicit-max-ttl<span class="token operator">=</span>90s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>생성된 Token의 정보를 확인해보면 적용된 값이 확인된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token lookup <span class="token operator">&lt;</span>TOKEN<span class="token operator">></span>
Key                 Value
---                 -----
creation_ttl        1m
expire_time         <span class="token number">2023</span>-03-04T16:44:40.187494+09:00
explicit_max_ttl    1m30s
issue_time          <span class="token number">2023</span>-03-04T16:43:40.187497+09:00
ttl                 54s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>TTL과 관련된 내용을 확인해보면 다음과 같이 해석할 수 있다.</p>
<ul>
<li>issue_time : 해당 시간에 Token이 발급됨</li>
<li>creation_ttl : 최초 요청된 TTL 시간</li>
<li>expire_time : 현재 부여된 TTL을 기준으로 만료되는 시간</li>
<li>ttl : 현재 남은 TTL</li>
<li>explicit_max_ttl : 최대로 부여받을 수 있는 총 TTL</li>
</ul>
<p>Renew를 수행하면 최초 부여한 60초 만큼을 더하여 TTL을 증가시키는데, Explicit Max TTL이 1분 30초 이므로, 30초가 넘어간 시점에 Renew를 요청하면 추가 60초 만큼을 남은 총량 대비 부여하지 못한다는 메시지를 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token renew <span class="token operator">&lt;</span>TOKEN<span class="token operator">></span>

WARNING<span class="token operator">!</span> The following warnings were returned from Vault:

  * TTL of <span class="token string">"1m"</span> exceeded the effective max_ttl of <span class="token string">"56s"</span><span class="token punctuation">;</span> TTL value is capped
  accordingly
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>TTL은 특성상 max TTL이 있으므로 영구적으로 사용은 불가능한 속성이다. Token이 만료되는 것이 문제가 될 수 있고, 오랜 기간동안 유지해야 하는 경우 Periodic Token을 사용한다.</p>
<ul>
<li>periodic token에는 TTL은 있지만 max TTL은 없음</li>
<li>TTL이 지나면 자동으로 취소되고, 만약 계속 사용한다면 <code v-pre>vault token renew</code> 로 TTL을 계속 갱신해서 사용</li>
</ul>
<p>Periodic Token을 생성하는 방법은 <code v-pre>ttl</code> 대신 <code v-pre>period</code> 에 기간을 주어 생성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token create <span class="token parameter variable">-policy</span><span class="token operator">=</span>default <span class="token parameter variable">-period</span><span class="token operator">=</span>60s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>생성된 Token의 정보를 확인해보면 <code v-pre>period</code> 값이 있는 것이 확인된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token lookup <span class="token operator">&lt;</span>TOKEN<span class="token operator">></span>

Key                 Value
---                 -----
explicit_max_ttl    0s
period              1m
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>explicit_max_ttl</code>이 0초라는 의미는 무제한으로 풀이할 수 있다. 이후 Renew를 수행하면 지속적으로 TTL이 갱신되는 것을 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token renew <span class="token operator">&lt;</span>TOKEN<span class="token operator">></span>

Key                  Value
---                  -----
token_duration       1m

$ vault token renew <span class="token operator">&lt;</span>TOKEN<span class="token operator">></span>

Key                  Value
---                  -----
token_duration       1m

<span class="token punctuation">..</span>.계속<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-root-token" tabindex="-1"><a class="header-anchor" href="#_7-root-token" aria-hidden="true">#</a> 7. Root Token</h2>
<p>볼트를 Init하면 최초 발급되는 Token이 Root Token이다. 볼트에서 유일하게 만료되지 않는 Token으로 모든 권한(<code v-pre>root</code> Policy)을 갖고 있다. 일반적으로 Init 후 <code v-pre>root</code> 권한을 갖는 일반 인증을 생성한 뒤 파기하는 것을 권장한다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># Root에 준하는 Policy</span>
path <span class="token string">"*"</span> <span class="token punctuation">{</span>
	<span class="token property">capabilities</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"read"</span>, <span class="token string">"update"</span>, <span class="token string">"delete"</span>, <span class="token string">"list"</span>, <span class="token string">"sudo"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Root Token을 분실했거나 파기 후 필요한 경우 다음 순서에 따라 새로운 Root Token을 발급한다.</p>
<blockquote>
<p><a href="https://developer.hashicorp.com/vault/tutorials/operations/generate-root" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/vault/tutorials/operations/generate-root<ExternalLinkIcon/></a></p>
</blockquote>
<h3 id="단계-1-root-token-생성-초기화" tabindex="-1"><a class="header-anchor" href="#단계-1-root-token-생성-초기화" aria-hidden="true">#</a> 단계 1. Root Token 생성 초기화</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault operator generate-root <span class="token parameter variable">-init</span>

A One-Time-Password has been generated <span class="token keyword">for</span> you and is shown <span class="token keyword">in</span> the OTP field.
You will need this value to decode the resulting root token, so keep it safe.
Nonce         1a6294ff-1f09-cccf-6434-e49279aec4df
Started       <span class="token boolean">true</span>
Progress      <span class="token number">0</span>/1
Complete      <span class="token boolean">false</span>
OTP           vxa9sXQjPCb91C1rS1yPJYcMw90f
OTP Length    <span class="token number">28</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>생성된 <code v-pre>Nonce</code>와 <code v-pre>OTP</code>가 Unseal 및 인코딩된 Root Token 복호화에 사용된다.</p>
<h3 id="단계-2-root-token-생성" tabindex="-1"><a class="header-anchor" href="#단계-2-root-token-생성" aria-hidden="true">#</a> 단계 2. Root Token 생성</h3>
<p>동일한 터미널 상에서 수행했다면 <code v-pre>Nonce</code> 값이 자동으로 입력되지만 아닌경우에는 <code v-pre>-nonce</code> 속석으로 지정이 필요하다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault operator generate-root
or
$ vault operator generate-root <span class="token parameter variable">-nonce</span><span class="token operator">=</span>1a6294ff-1f09-cccf-6434-e49279aec4df
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="단계-3-unseal-key를-활용한-인코딩된-root-token-발급" tabindex="-1"><a class="header-anchor" href="#단계-3-unseal-key를-활용한-인코딩된-root-token-발급" aria-hidden="true">#</a> 단계 3. Unseal key를 활용한 인코딩된 Root Token 발급</h3>
<p><code v-pre>vault operator generate-root</code>를 수행하면 Unseal 키를 입력해야 한다. Init에서 발생된 Unseal Key 값을 입력하여 인코딩된 Root Token을 발급 받는다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault operator generate-root

Root generation operation nonce: 1a6294ff-1f09-cccf-6434-e49279aec4df
Unseal Key <span class="token punctuation">(</span>will be hidden<span class="token punctuation">)</span>:

Nonce            1a6294ff-1f09-cccf-6434-e49279aec4df
Started          <span class="token boolean">true</span>
Progress         <span class="token number">5</span>/5
Complete         <span class="token boolean">true</span>
Encoded Token    Hg4SFzwRZCAoAQFheHRLHmZiFicabzZ7D0pEJw
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="단계-4-root-token-복호화" tabindex="-1"><a class="header-anchor" href="#단계-4-root-token-복호화" aria-hidden="true">#</a> 단계 4. Root Token 복호화</h3>
<p>초기화시 발급된 <code v-pre>OTP</code>를 이용하여 인코딩된  Root Token을 복호화 한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault operator generate-root <span class="token punctuation">\</span>
	<span class="token parameter variable">-decode</span><span class="token operator">=</span>Hg4SFzwRZCAoAQFheHRLHmZiFicabzZ7D0pEJw <span class="token punctuation">\</span>
	<span class="token parameter variable">-otp</span><span class="token operator">=</span>vxa9sXQjPCb91C1rS1yPJYcMw90f
	
hvs.OI5JxBcXI7zl5SowP6U6xstA
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


