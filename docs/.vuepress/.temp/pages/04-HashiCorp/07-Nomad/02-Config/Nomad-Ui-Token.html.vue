<template><div><h1 id="nomad-ui-token" tabindex="-1"><a class="header-anchor" href="#nomad-ui-token" aria-hidden="true">#</a> Nomad UI Token</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>해당 Token의 policy는 특정인이 원하여 만들었으며, 더 다양한 제약과 허용을 할 수 있습니다. 해당 policy는 아래와 같은 제약과 허용을 합니다.</p>
<ol>
<li>UI에서 exec(job에 접근) 제한</li>
<li>그 외에 job, node, volume, server등의 모든 화면 읽어오기</li>
</ol>
</div>
<h2 id="nomad-cli" tabindex="-1"><a class="header-anchor" href="#nomad-cli" aria-hidden="true">#</a> Nomad cli</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment">#원하는 권한이 있는 policy file</span>
$ <span class="token function">cat</span> nomad-ui-policy.hcl
namespace <span class="token string">"*"</span> <span class="token punctuation">{</span>
  policy       <span class="token operator">=</span> <span class="token string">"read"</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"submit-job"</span>, <span class="token string">"dispatch-job"</span>, <span class="token string">"read-logs"</span>, <span class="token string">"list-jobs"</span>, <span class="token string">"parse-job"</span>, <span class="token string">"read-job"</span>, <span class="token string">"csi-list-volume"</span>, <span class="token string">"csi-read-volume"</span>, <span class="token string">"list-scaling-policies"</span>, <span class="token string">"read-scaling-policy"</span>, <span class="token string">"read-job-scaling"</span>, <span class="token string">"read-fs"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
<span class="token function">node</span> <span class="token punctuation">{</span>
  policy <span class="token operator">=</span> <span class="token string">"read"</span>
<span class="token punctuation">}</span>
host_volume <span class="token string">"*"</span> <span class="token punctuation">{</span>
  policy <span class="token operator">=</span> <span class="token string">"write"</span>
<span class="token punctuation">}</span>
plugin <span class="token punctuation">{</span>
  policy <span class="token operator">=</span> <span class="token string">"read"</span>
<span class="token punctuation">}</span>

<span class="token comment">#위에서 만든 policy 파일을 nomad cluster에 적용</span>
$ nomad acl policy apply <span class="token parameter variable">-description</span> <span class="token string">"Production UI policy"</span> prod-ui nomad-ui-policy.hcl

<span class="token comment">#해당 policy로 token생성(policy는 여러개를 넣을 수도 있음)</span>
$ nomad acl token create <span class="token parameter variable">-name</span><span class="token operator">=</span><span class="token string">"prod ui token"</span> <span class="token parameter variable">-policy</span><span class="token operator">=</span>prod-ui <span class="token parameter variable">-type</span><span class="token operator">=</span>client <span class="token operator">|</span> <span class="token function">tee</span> ui-prod.token
<span class="token comment">#웹 브라우저 로그인을 위해 Secret ID 복사</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nomad-ui" tabindex="-1"><a class="header-anchor" href="#nomad-ui" aria-hidden="true">#</a> Nomad UI</h2>
<p>아래는 위에서 만들어진 토큰으로 로그인한 화면입니다.<br>
<img src="@source/04-HashiCorp/07-Nomad/02-Config/image/token_login.png" alt="TokenLogin" loading="lazy"></p>
<p>아래 그림과 같이 exec버튼이 비활성화되어 있는 걸 볼 수 있습니다.<br>
<img src="@source/04-HashiCorp/07-Nomad/02-Config/image/not_exec.png" alt="exec비활성화" loading="lazy"></p>
</div></template>


