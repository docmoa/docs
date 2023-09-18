<template><div><h1 id="aws-secrets-role-type-check" tabindex="-1"><a class="header-anchor" href="#aws-secrets-role-type-check" aria-hidden="true">#</a> AWS Secrets Role Type Check</h1>
<h2 id="_1-egp용-정책-생성-egp-iam-user-deny-sentinel" tabindex="-1"><a class="header-anchor" href="#_1-egp용-정책-생성-egp-iam-user-deny-sentinel" aria-hidden="true">#</a> 1. EGP용 정책 생성 egp_iam_user_deny.sentinel</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>import <span class="token string">"strings"</span>

<span class="token comment"># print(request.data)</span>
<span class="token property">credential_type</span> <span class="token punctuation">=</span> request.data.credential_type
print(<span class="token string">"CREDENTIAL_TYPE: "</span>, credential_type)

<span class="token property">allow_role_type</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"federation_token"</span><span class="token punctuation">]</span>

<span class="token property">role_type_check</span> <span class="token punctuation">=</span> <span class="token keyword">rule</span> <span class="token punctuation">{</span>
  credential_type in allow_role_type
<span class="token punctuation">}</span>

<span class="token comment"># Only check AWS Secret Engine</span>
<span class="token comment"># Only check create, update</span>
<span class="token property">precond</span> <span class="token punctuation">=</span> <span class="token keyword">rule</span> <span class="token punctuation">{</span>
	request.operation in <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"update"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token property">main</span> <span class="token punctuation">=</span> rule when <span class="token keyword">precond</span> <span class="token punctuation">{</span>
    role_type_check
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>precond</code> : API 요청이 POST, UPDATE 인 경우</li>
<li><code v-pre>role_type_check</code> : 요청의 Body에 <code v-pre>credential_type</code>의 값이 허용된 type 인지 확인 (e.g. <code v-pre>federation_token</code> 허용)</li>
</ul>
<h2 id="_2-egp에-정책-설정" tabindex="-1"><a class="header-anchor" href="#_2-egp에-정책-설정" aria-hidden="true">#</a> 2. EGP에 정책 설정</h2>
<p>EGP는 지정된 path에 대해 정책을 적용</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> /sys/policies/egp/iam_user_deny <span class="token punctuation">\</span>
  <span class="token assign-left variable">policy</span><span class="token operator">=</span>@egp_iam_user_deny.sentinel <span class="token punctuation">\</span>
  <span class="token assign-left variable">enforcement_level</span><span class="token operator">=</span>hard-mandatory <span class="token punctuation">\</span>
  <span class="token assign-left variable">paths</span><span class="token operator">=</span><span class="token string">"aws/roles/*"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>paths</code>로 지정된 API 경로에 요청이 들어오면 동작</li>
</ul>
<h2 id="_3-테스트" tabindex="-1"><a class="header-anchor" href="#_3-테스트" aria-hidden="true">#</a> 3. 테스트</h2>
<p>EGP로 지정된 path로 credential_type 이 iam_user 인경우 허용된 타입이 아니므로 거부됨</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> aws/roles/iam-role <span class="token punctuation">\</span>
    <span class="token assign-left variable">credential_type</span><span class="token operator">=</span>iam_user <span class="token punctuation">\</span>
    <span class="token assign-left variable">policy_document</span><span class="token operator">=</span>-<span class="token operator">&lt;&lt;</span><span class="token string">EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*"
    }
  ]
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>에러 메시지</p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code><span class="token property">Error writing data to aws/roles/iam-role:</span> Error making API request<span class="token punctuation">.</span>

<span class="token property">URL:</span> PUT <span class="token url">http://127.0.0.1:8200/v1/aws/roles/iam-role</span>
<span class="token property">Code:</span> <span class="token number">403</span><span class="token punctuation">.</span> Errors<span class="token operator">:</span>

<span class="token operator">*</span> <span class="token number">2</span> errors occurred<span class="token operator">:</span>
	<span class="token operator">*</span> egp standard policy <span class="token string">"root/iam_user_deny"</span> evaluation resulted in denial<span class="token punctuation">.</span>

<span class="token property">The specific error was:</span>
<span class="token operator">&lt;</span>nil<span class="token operator">></span>

A trace of the execution for policy <span class="token string">"root/iam_user_deny"</span> <span class="token property">is available:</span>

<span class="token property">Result:</span> <span class="token boolean">false</span>

<span class="token property">Description:</span> <span class="token operator">&lt;</span>none<span class="token operator">></span>

print<span class="token operator">(</span><span class="token operator">)</span> output<span class="token operator">:</span>

<span class="token property">CREDENTIAL_TYPE:</span>  iam_user


Rule <span class="token string">"main"</span> <span class="token operator">(</span>root<span class="token operator">/</span>iam_user_deny<span class="token operator">:</span><span class="token number">19</span><span class="token operator">:</span><span class="token number">1</span><span class="token operator">)</span> <span class="token operator">=</span> <span class="token boolean">false</span>
Rule <span class="token string">"precond"</span> <span class="token operator">(</span>root<span class="token operator">/</span>iam_user_deny<span class="token operator">:</span><span class="token number">15</span><span class="token operator">:</span><span class="token number">1</span><span class="token operator">)</span> <span class="token operator">=</span> <span class="token boolean">true</span>
Rule <span class="token string">"role_type_check"</span> <span class="token operator">(</span>root<span class="token operator">/</span>iam_user_deny<span class="token operator">:</span><span class="token number">9</span><span class="token operator">:</span><span class="token number">1</span><span class="token operator">)</span> <span class="token operator">=</span> <span class="token boolean">false</span>
	<span class="token operator">*</span> permission denied
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>federation_token</code>은 생성됩니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> aws/roles/sts-role <span class="token punctuation">\</span>
    <span class="token assign-left variable">credential_type</span><span class="token operator">=</span>federation_token <span class="token punctuation">\</span>
    <span class="token assign-left variable">policy_document</span><span class="token operator">=</span>-<span class="token operator">&lt;&lt;</span><span class="token string">EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*"
    }
  ]
}
EOF</span>
Success<span class="token operator">!</span> Data written to: aws/roles/sts-role
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


