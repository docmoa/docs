<template><div><h1 id="sentinel-identity-cidr" tabindex="-1"><a class="header-anchor" href="#sentinel-identity-cidr" aria-hidden="true">#</a> Sentinel - (Identity &amp; CIDR)</h1>
<blockquote>
<p>Enterprise 기능</p>
</blockquote>
<p>Token Role에 <code v-pre>bound_cidr</code>을 적용하거나 여타 인증(AppRole, Userpass 등)에 허용하는 cidr을 적용하는 경우 다시 Token을 발급하거나 인증받지 않는한은 cidr을 기반으로한 차단을 동적으로 적용할 수 없다.</p>
<p>이경우 Sentinel을 사용하여 동적인 정책을 적용할 수 있다. Sentinel은 ACL방식의 기존 <code v-pre>Policy</code>와는 달리 Path가 아닌 다른 검증 조건을 추가할 수 있다.</p>
<ul>
<li>
<p>예제 (GitHub) : <a href="https://github.com/hashicorp/vault-guides/blob/master/governance/sentinel/README.md" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/vault-guides/blob/master/governance/sentinel/README.md<ExternalLinkIcon/></a></p>
</li>
<li>
<p>엔터프라이즈 Trial 신청 (30일) : <a href="https://www.hashicorp.com/products/vault/trial" target="_blank" rel="noopener noreferrer">https://www.hashicorp.com/products/vault/trial<ExternalLinkIcon/></a></p>
</li>
</ul>
<h2 id="테스트-사용자-생성" tabindex="-1"><a class="header-anchor" href="#테스트-사용자-생성" aria-hidden="true">#</a> 테스트 사용자 생성</h2>
<p>Sentinel 적용을 확인하기 위해 모든 권한이 있는 기존 <code v-pre>Policy</code> 방식의 정책을 생성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault policy <span class="token function">write</span> super-user - <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
path "*" {
capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>생성한 정책고 앞으로 생성할 Sentinel 정책이 포함된 사용자를 생성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> auth/userpass/users/admin <span class="token assign-left variable">password</span><span class="token operator">=</span>password <span class="token assign-left variable">policies</span><span class="token operator">=</span><span class="token string">"super-user, test-rgp"</span>
vault <span class="token function">write</span> auth/userpass/users/rgp <span class="token assign-left variable">password</span><span class="token operator">=</span>password <span class="token assign-left variable">policies</span><span class="token operator">=</span><span class="token string">"super-user, test-rgp"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>admin</code>과 <code v-pre>rgp</code> 사용자 모두 동일한 정책을 부여 받았다. Sentinel에서는 <code v-pre>identity</code> 정보를 기반으로 조건을 부여할 수 있으며, 동일한 정책이 부여되었더라도 어떤 <code v-pre>identity</code> 인가에 따라 적용 여부를 선택적으로 검증할 수 있다.</p>
<p>각 사용자로 로그인하여 Token 정보를 확인하면 <code v-pre>entity_id</code> 값을 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token assign-left variable">TOKEN</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>vault login <span class="token parameter variable">-field</span><span class="token operator">=</span>token <span class="token parameter variable">-method</span> userpass <span class="token assign-left variable">username</span><span class="token operator">=</span>admin <span class="token assign-left variable">password</span><span class="token operator">=</span>password<span class="token variable">)</span></span>

$ vault token lookup <span class="token variable">$TOKEN</span>

Key                 Value
---                 -----
display_name        userpass-admin
entity_id           <span class="token number">17230158</span>-d0ad-dd6d-b749-3c7de9e2b4cf
policies            <span class="token punctuation">[</span>default super-user test-rgp<span class="token punctuation">]</span>
renewable           <span class="token boolean">true</span>
ttl                 768h
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="sentinel-생성" tabindex="-1"><a class="header-anchor" href="#sentinel-생성" aria-hidden="true">#</a> Sentinel 생성</h2>
<p>다음과 같이 적용할 <code v-pre>identity-cidr-check.sentinel</code> 파일을 생성한다. (확장자는 다른 확장자를 사용해도 무방하다. e.g. hcl)</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>import <span class="token string">"sockaddr"</span>
import <span class="token string">"strings"</span>

print(identity.entity.id)
print(request.connection.remote_addr)

<span class="token property">precond</span> <span class="token punctuation">=</span> <span class="token keyword">rule</span> <span class="token punctuation">{</span>
    <span class="token comment"># admin user</span>
    <span class="token comment"># identity.entity.id is "17230158-d0ad-dd6d-b749-3c7de9e2b4cf" or</span>
    <span class="token comment"># rgp user</span>
    identity.entity.id is <span class="token string">"31cc28c0-9fd0-82b3-a70d-0eef741c5349"</span>
<span class="token punctuation">}</span>

<span class="token property">cidrcheck</span> <span class="token punctuation">=</span> <span class="token keyword">rule</span> <span class="token punctuation">{</span>
    <span class="token comment">## Loopback</span>
    <span class="token comment"># sockaddr.is_contained("127.0.0.0/8", request.connection.remote_addr) or </span>
    sockaddr.is_contained(<span class="token string">"22.32.4.0/24"</span>, request.connection.remote_addr)
<span class="token punctuation">}</span>

<span class="token property">main</span> <span class="token punctuation">=</span> rule when <span class="token keyword">precond</span> <span class="token punctuation">{</span>
    cidrcheck
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>precond : main 규칙에서 조건으로 부여할 규칙을 정의한다.
<ul>
<li><code v-pre>identity.entity.id</code>로 검증할 아이디 내용에는 앞서 확인한 <code v-pre>admin</code>과 <code v-pre>rgp</code> 사용자의 <code v-pre>entity_id</code>를 조건에 넣는다.</li>
<li><code v-pre>admin</code> 사용자의 경우 우선 주석처리하여 진행한다.</li>
</ul>
</li>
<li>cidrcheck : cidr을 검증할 규칙을 정의한다.</li>
</ul>
<p>적용하는 방식은 다음과 같다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>POLICY=$(base64 identity-cidr-check.sentinel)

vault write sys/policies/rgp/test-rgp \
      policy="${POLICY}" \
      enforcement_level="hard-mandatory"
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="sentinel-검증" tabindex="-1"><a class="header-anchor" href="#sentinel-검증" aria-hidden="true">#</a> Sentinel 검증</h2>
<p><code v-pre>admin</code> 사용자로 로그인하여 kv를 생성하고 값을 넣는다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault login <span class="token parameter variable">-method</span> userpass <span class="token assign-left variable">username</span><span class="token operator">=</span>admin <span class="token assign-left variable">password</span><span class="token operator">=</span>password
$ vault secrets <span class="token builtin class-name">enable</span> kv
$ vault kv put kv/hello <span class="token assign-left variable">foo</span><span class="token operator">=</span>bar
$ vault kv get kv/hello
<span class="token operator">==</span><span class="token operator">=</span> Data <span class="token operator">==</span><span class="token operator">=</span>
Key    Value
---    -----
foo    bar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>rgp</code> 사용자로 로그인하여 kv를 조회해본다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault login <span class="token parameter variable">-method</span> userpass <span class="token assign-left variable">username</span><span class="token operator">=</span>rgp <span class="token assign-left variable">password</span><span class="token operator">=</span>password
$ vault kv get kv/hello
Error making API request.

URL: GET http://127.0.0.1:8200/v1/sys/internal/ui/mounts/kv/hello
Code: <span class="token number">400</span>. Errors:

* <span class="token number">2</span> errors occurred:
	* rgp standard policy <span class="token string">"root/test-rgp"</span> evaluation resulted <span class="token keyword">in</span> denial.

The specific error was:
<span class="token operator">&lt;</span>nil<span class="token operator">></span>

A trace of the execution <span class="token keyword">for</span> policy <span class="token string">"root/test-rgp"</span> is available:

Result: <span class="token boolean">false</span>

Description: <span class="token operator">&lt;</span>none<span class="token operator">></span>

print<span class="token punctuation">(</span><span class="token punctuation">)</span> output:

31cc28c0-9fd0-82b3-a70d-0eef741c5349
<span class="token number">127.0</span>.0.1


Rule <span class="token string">"main"</span> <span class="token punctuation">(</span>root/test-rgp:19:1<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token boolean">false</span>
Rule <span class="token string">"cidrcheck"</span> <span class="token punctuation">(</span>root/test-rgp:14:1<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token boolean">false</span>
Rule <span class="token string">"precond"</span> <span class="token punctuation">(</span>root/test-rgp:7:1<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token boolean">true</span>
	* permission denied
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>cidrcheck 에서 검증하는 cidr에 속하지 못하면 요청 단계에서 권한이 없음을 표기한다.</p>
<h2 id="identity-동적으로-변경하기" tabindex="-1"><a class="header-anchor" href="#identity-동적으로-변경하기" aria-hidden="true">#</a> identity 동적으로 변경하기</h2>
<p>앞서 작성한 sentinel 규칙에서 <code v-pre>admin</code> 사용자의 <code v-pre>identity.id</code>의 주석을 해제하여 다시 적용해 본다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code>...생략...

<span class="token property">precond</span> <span class="token punctuation">=</span> <span class="token keyword">rule</span> <span class="token punctuation">{</span>
    <span class="token comment"># admin user</span>
    identity.entity.id is <span class="token string">"17230158-d0ad-dd6d-b749-3c7de9e2b4cf"</span> or
    <span class="token comment"># rgp user</span>
    identity.entity.id is <span class="token string">"31cc28c0-9fd0-82b3-a70d-0eef741c5349"</span>
<span class="token punctuation">}</span>

...생략...
</code></pre><div class="highlight-lines"><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>admin</code> 사용자로 로그인하여 kv를 조회해도 cidr 조건에 맞지 않으면 동일한 오류가 발생한다.</p>
<h2 id="cidr-동적으로-변경하기" tabindex="-1"><a class="header-anchor" href="#cidr-동적으로-변경하기" aria-hidden="true">#</a> cidr 동적으로 변경하기</h2>
<p>허용하는 cidr을 추가해본다. 로컬에서 테스트하는 경우 <code v-pre>127.0.0.1</code>이 해당 ip가 될 수 있다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code>...생략...

<span class="token property">cidrcheck</span> <span class="token punctuation">=</span> <span class="token keyword">rule</span> <span class="token punctuation">{</span>
    <span class="token comment">## Loopback</span>
    sockaddr.is_contained(<span class="token string">"127.0.0.0/8"</span>, request.connection.remote_addr) or 
    sockaddr.is_contained(<span class="token string">"22.32.4.0/24"</span>, request.connection.remote_addr)
<span class="token punctuation">}</span>

...생략...
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>적용 후 <code v-pre>admin</code> 사용자와 <code v-pre>rgp</code> 사용자 모두 정상적으로 kv의 값을 확인할 수 있다.</p>
</div></template>


