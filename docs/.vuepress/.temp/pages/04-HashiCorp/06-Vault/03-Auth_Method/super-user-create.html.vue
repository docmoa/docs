<template><div><h1 id="vault-superuser-생성" tabindex="-1"><a class="header-anchor" href="#vault-superuser-생성" aria-hidden="true">#</a> Vault SuperUser 생성</h1>
<div class="hint-container danger">
<p class="hint-container-title">주의</p>
<p>해당 방법은 username/password 방식의 Admin권한의 사용자를 생성하나,<br>
보안상 실 구성에는 권장하지 않습니다.</p>
</div>
<ol>
<li>userpass 활성화</li>
</ol>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault auth <span class="token builtin class-name">enable</span> userpass
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2">
<li>권한 추가 (e.g. super-user)</li>
</ol>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault policy <span class="token function">write</span> super-user - <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
path "*" {
capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li>계정 생성</li>
</ol>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> auth/userpass/users/admin <span class="token assign-left variable">password</span><span class="token operator">=</span>password <span class="token assign-left variable">policies</span><span class="token operator">=</span>super-user
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="4">
<li>로그인 또는 토큰 생성</li>
</ol>
<Tabs id="39" :data='[]'>
</Tabs>
</div></template>


