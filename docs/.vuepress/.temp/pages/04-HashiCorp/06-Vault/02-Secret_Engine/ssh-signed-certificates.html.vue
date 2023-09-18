<template><div><h1 id="ssh-signed-certificates" tabindex="-1"><a class="header-anchor" href="#ssh-signed-certificates" aria-hidden="true">#</a> SSH - Signed Certificates</h1>
<h2 id="vault설정" tabindex="-1"><a class="header-anchor" href="#vault설정" aria-hidden="true">#</a> Vault설정</h2>
<p>시크릿 엔진 활성화</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>ssh-client-signer <span class="token function">ssh</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="구성-생성" tabindex="-1"><a class="header-anchor" href="#구성-생성" aria-hidden="true">#</a> 구성 생성</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> ssh-client-signer/config/ca <span class="token assign-left variable">generate_signing_key</span><span class="token operator">=</span>true
Key           Value
---           -----
public_key    <span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>keypair가 이미 있는 경우</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> ssh-client-signer/config/ca <span class="token punctuation">\</span>
    <span class="token assign-left variable">private_key</span><span class="token operator">=</span><span class="token string">"..."</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">public_key</span><span class="token operator">=</span><span class="token string">"..."</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="구성에서-public-key-가져오기" tabindex="-1"><a class="header-anchor" href="#구성에서-public-key-가져오기" aria-hidden="true">#</a> 구성에서 public key 가져오기</h2>
<h3 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> API</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">-o</span> /etc/ssh/trusted-user-ca-keys.pem http://127.0.0.1:8200/v1/ssh-client-signer/public_key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="cli" tabindex="-1"><a class="header-anchor" href="#cli" aria-hidden="true">#</a> CLI</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> <span class="token parameter variable">-field</span><span class="token operator">=</span>public_key ssh-client-signer/config/ca <span class="token operator">></span> /tmp/trusted-user-ca-keys.pem
$ /tmp/trusted-user-ca-keys.pem
/etc/ssh/trusted-user-ca-keys.pem로 복사
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ssh-설정" tabindex="-1"><a class="header-anchor" href="#ssh-설정" aria-hidden="true">#</a> SSH 설정</h2>
<p><code v-pre>/etc/ssh/sshd_config</code> 파일의 <code v-pre>TrustedUserCAKeys</code> 부분을 수정</p>
<blockquote>
<p>이미 있는 옵션은 값 수정, 없는 옵션은 추가</p>
</blockquote>
<div class="language-properties line-numbers-mode" data-ext="properties"><pre v-pre class="language-properties"><code><span class="token key attr-name">TrustedUserCAKeys</span> <span class="token value attr-value">/etc/ssh/trusted-user-ca-keys.pem</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>ssh 서비스 재시작</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ systemctl restart sshd
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="키-서명을-위한-role-생성" tabindex="-1"><a class="header-anchor" href="#키-서명을-위한-role-생성" aria-hidden="true">#</a> 키 서명을 위한 Role 생성</h2>
<p>TTL 2분</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> ssh-client-signer/roles/my-role - <span class="token operator">&lt;&lt;</span><span class="token string">EOF
{
  "allow_user_certificates": true,
  "allowed_users": "*",
  "allowed_extensions": "permit-pty,permit-port-forwarding",
  "default_extensions": [
    {
      "permit-pty": ""
    }
  ],
  "key_type": "ca",
  "default_user": "test",
  "ttl": "0m20s"
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="client-ssh-authentication" tabindex="-1"><a class="header-anchor" href="#client-ssh-authentication" aria-hidden="true">#</a> Client SSH Authentication</h2>
<ol>
<li>
<p>클라이언트에서 SSH에서 사용할 Keypair를 생성</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ ssh-keygen <span class="token parameter variable">-t</span> rsa <span class="token parameter variable">-C</span> <span class="token string">"test@rocky"</span>
Generating public/private rsa key pair.
Enter <span class="token function">file</span> <span class="token keyword">in</span> <span class="token function">which</span> to save the key <span class="token punctuation">(</span>/Users/gs/.ssh/id_rsa<span class="token punctuation">)</span>: /Users/gs/.ssh/vault_rsa
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>-C</code> : 코맨트 옵션</li>
</ul>
</li>
<li>
<p>Vault에 생성한 키 중 공개키 (.pub)에 대한 서명 요청</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> ssh-client-signer/sign/my-role <span class="token punctuation">\</span>
    <span class="token assign-left variable">public_key</span><span class="token operator">=</span>@<span class="token environment constant">$HOME</span>/.ssh/vault_rsa.pub
    
Key             Value
---             -----
serial_number   c73f26d2340276aa
signed_key      ssh-rsa-cert-v01@openssh.com AAAAHHNzaC1<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>signed_key는 또다른 public key</li>
</ul>
<p>위와 같은 방식으로 생성되는 추가 public key인 signed_key를 저장하고자 한다면 다음과 같은 방식으로 가능</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-field</span><span class="token operator">=</span>signed_key ssh-client-signer/sign/my-role <span class="token assign-left variable">public_key</span><span class="token operator">=</span>@<span class="token environment constant">$HOME</span>/.ssh/vault_rsa.pub <span class="token operator">></span> /tmp/signed-cert.pub
    
$ vault <span class="token function">write</span> <span class="token parameter variable">-field</span><span class="token operator">=</span>signed_key ssh-client-signer/sign/my-role <span class="token punctuation">\</span>
    <span class="token assign-left variable">public_key</span><span class="token operator">=</span>@<span class="token environment constant">$HOME</span>/.ssh/vault_rsa.pub <span class="token operator">></span> <span class="token environment constant">$HOME</span>/.ssh/vault_rsa-cert.pub
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>접속 하기</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">ssh</span> <span class="token parameter variable">-i</span> /tmp/signed-cert.pub <span class="token parameter variable">-i</span> ~/.ssh/vault_rsa test@172.28.128.61
$ <span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa test@172.28.128.61
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
</div></template>


