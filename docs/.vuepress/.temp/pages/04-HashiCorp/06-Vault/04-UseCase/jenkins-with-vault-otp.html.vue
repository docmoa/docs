<template><div><h1 id="jenkins-with-vault-otp" tabindex="-1"><a class="header-anchor" href="#jenkins-with-vault-otp" aria-hidden="true">#</a> jenkins with vault otp</h1>
<p>jenkins와 vault otp를 연동하여 pipe line에서 ssh/scp test</p>
<h2 id="otp-설정은-docmoa의-ssh-otp-참고" tabindex="-1"><a class="header-anchor" href="#otp-설정은-docmoa의-ssh-otp-참고" aria-hidden="true">#</a> otp 설정은 docmoa의 ssh-otp 참고</h2>
<ul>
<li><RouterLink to="/04-HashiCorp/06-Vault/02-Secret_Engine/ssh-otp-redhat.html">OTP 설정 링크</RouterLink></li>
</ul>
<h2 id="vault-token-설정" tabindex="-1"><a class="header-anchor" href="#vault-token-설정" aria-hidden="true">#</a> vault token 설정</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># ssh 권한을 사용 할 policy 생성</span>
$ <span class="token function">tee</span> ssh-policy.hcl <span class="token operator">&lt;&lt;</span><span class="token string">EOF
# To list SSH secrets paths
path "ssh/*" {
  capabilities = [ "list" ]
}
# To use the configured SSH secrets engine otp_key_role role
path "ssh/creds/otp_key_role" {
  capabilities = ["create", "read", "update"]
}
EOF</span>

<span class="token comment">#ssh(otp) 정책 생성</span>
$ vault policy <span class="token function">write</span> <span class="token function">ssh</span> ssh-policy.hcl

<span class="token comment">#rest api에서 사용 할 token 생성</span>
$ vault token create <span class="token parameter variable">-policy</span><span class="token operator">=</span>ssh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="otp-token을-활용하여-jenkins-credentials-생성" tabindex="-1"><a class="header-anchor" href="#otp-token을-활용하여-jenkins-credentials-생성" aria-hidden="true">#</a> otp token을 활용하여 jenkins credentials 생성</h2>
<figure><img src="@source/04-HashiCorp/06-Vault/04-UseCase/image/vault_jenkins_token.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<h2 id="otp를-사용한-ssh-scp-pipe-line" tabindex="-1"><a class="header-anchor" href="#otp를-사용한-ssh-scp-pipe-line" aria-hidden="true">#</a> otp를 사용한 ssh, scp pipe line</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>// jenkins pipe line v1
pipeline <span class="token punctuation">{</span>
    agent any
    environment <span class="token punctuation">{</span>
      // 위에서 생성한 credential <span class="token function">id</span>
      ssh_token <span class="token operator">=</span> credentials<span class="token punctuation">(</span><span class="token string">'vault_ssh_token'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    options <span class="token punctuation">{</span>
        buildDiscarder<span class="token punctuation">(</span>logRotator<span class="token punctuation">(</span>numToKeepStr: <span class="token string">'20'</span><span class="token punctuation">))</span>
        disableConcurrentBuilds<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    stages<span class="token punctuation">{</span>   
      stage<span class="token punctuation">(</span><span class="token string">'SSH'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          steps<span class="token punctuation">{</span>
            // <span class="token number">1</span>. curl로 받아 온 password를 변수에 담음
            // <span class="token number">2</span>. ssh에 자동으로 패스워드를 입력하기 위해 sshpass 명령어 추가 사용 
            // <span class="token parameter variable">-o</span> <span class="token assign-left variable">StrictHostKeyChecking</span><span class="token operator">=</span>no는 최초 로그인에 known_hosts에 등록하는 문구 무시
            // scp도 동일하게 사용 가능
            // 주의할점은 다음라인은 jenkins 서버로 돌아온다.
            <span class="token function">sh</span> <span class="token string">''</span>'
            <span class="token assign-left variable">ssh_passwd</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">--header</span> <span class="token string">"X-Vault-Token: <span class="token variable">$ssh_token</span>"</span> <span class="token parameter variable">--request</span> POST <span class="token parameter variable">--data</span> <span class="token string">'{"ip": "172.21.2.56"}'</span> http://172.21.2.50:8200/v1/ssh/creds/otp_key_role  <span class="token operator">|</span> jq <span class="token string">".data.key"</span> <span class="token operator">|</span> <span class="token function">tr</span> <span class="token parameter variable">-d</span> <span class="token string">'""'</span><span class="token variable">)</span></span>
            sshpass <span class="token parameter variable">-p</span> <span class="token variable">$ssh_passwd</span> <span class="token function">ssh</span> ubuntu@172.21.2.56 <span class="token parameter variable">-o</span> <span class="token assign-left variable">StrictHostKeyChecking</span><span class="token operator">=</span>no <span class="token string">"cd /usr/local \
            &amp;&amp; ls -la \
            &amp;&amp; pwd"</span>

            <span class="token assign-left variable">ssh_passwd</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">--header</span> <span class="token string">"X-Vault-Token: <span class="token variable">$ssh_token</span>"</span> <span class="token parameter variable">--request</span> POST <span class="token parameter variable">--data</span> <span class="token string">'{"ip": "172.21.2.56"}'</span> http://172.21.2.50:8200/v1/ssh/creds/otp_key_role  <span class="token operator">|</span> jq <span class="token string">".data.key"</span> <span class="token operator">|</span> <span class="token function">tr</span> <span class="token parameter variable">-d</span> <span class="token string">'""'</span><span class="token variable">)</span></span>
            sshpass <span class="token parameter variable">-p</span> <span class="token variable">$ssh_passwd</span> <span class="token function">scp</span> <span class="token parameter variable">-o</span> <span class="token assign-left variable">StrictHostKeyChecking</span><span class="token operator">=</span>no ~/a ubuntu@172.21.2.56:~/test 
            <span class="token string">''</span>'
          <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


