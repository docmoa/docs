<template><div><h1 id="ssh-otp-debian-계열" tabindex="-1"><a class="header-anchor" href="#ssh-otp-debian-계열" aria-hidden="true">#</a> SSH OTP - Debian 계열</h1>
<blockquote>
<p><a href="https://learn.hashicorp.com/tutorials/vault/pki-engine" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/vault/pki-engine<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="vault설정" tabindex="-1"><a class="header-anchor" href="#vault설정" aria-hidden="true">#</a> Vault설정</h2>
<p>시크릿 엔진 활성화</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span> <span class="token function">ssh</span> <span class="token function">ssh</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>롤 생성</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> ssh/roles/otp_key_role <span class="token punctuation">\</span>
    <span class="token assign-left variable">key_type</span><span class="token operator">=</span>otp <span class="token punctuation">\</span>
    <span class="token assign-left variable">default_user</span><span class="token operator">=</span>test <span class="token punctuation">\</span>
    <span class="token assign-left variable">allowed_users</span><span class="token operator">=</span>test <span class="token punctuation">\</span>
    <span class="token assign-left variable">key_bits</span><span class="token operator">=</span><span class="token number">2048</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">cidr_list</span><span class="token operator">=</span><span class="token number">172.28</span>.128.0/24
Success<span class="token operator">!</span> Data written to: ssh/roles/otp_key_role
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>e.g. cidr_list=127.0.0.1/32,172.28.128.1/32 or 0.0.0.0/0</p>
</blockquote>
<h2 id="대상-서버-설정" tabindex="-1"><a class="header-anchor" href="#대상-서버-설정" aria-hidden="true">#</a> 대상 서버 설정</h2>
<h3 id="접속할-사용자-생성" tabindex="-1"><a class="header-anchor" href="#접속할-사용자-생성" aria-hidden="true">#</a> 접속할 사용자 생성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">sudo</span> adduser <span class="token builtin class-name">test</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="vault-ssh-helper-구성-config-hcl" tabindex="-1"><a class="header-anchor" href="#vault-ssh-helper-구성-config-hcl" aria-hidden="true">#</a> vault-ssh-helper 구성 &lt;config.hcl&gt;</h3>
<blockquote>
<p><a href="https://github.com/hashicorp/vault-ssh-helper" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/vault-ssh-helper<ExternalLinkIcon/></a></p>
</blockquote>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>vault_addr <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"http://172.28.128.21:8200"</span></span>
ssh_mount_point <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"ssh"</span></span>
namespace <span class="token operator">=</span> <span class="token string-literal"><span class="token string">""</span></span>
tls_skip_verify <span class="token operator">=</span> <span class="token boolean">true</span>
allowed_roles <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
allowed_cidr_list <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"0.0.0.0/0"</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vault-ssh-helper-다운로드" tabindex="-1"><a class="header-anchor" href="#vault-ssh-helper-다운로드" aria-hidden="true">#</a> vault-ssh-helper 다운로드</h3>
<blockquote>
<p><a href="https://releases.hashicorp.com/vault-ssh-helper/" target="_blank" rel="noopener noreferrer">https://releases.hashicorp.com/vault-ssh-helper/<ExternalLinkIcon/></a><br>
tls를 사용하지 않는 경우. <code v-pre>-dev</code></p>
</blockquote>
<p>아래와 같이 검증</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault-ssh-helper -verify-only <span class="token parameter variable">-config</span><span class="token operator">=</span>config.hcl <span class="token parameter variable">-dev</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="pam-d-설정" tabindex="-1"><a class="header-anchor" href="#pam-d-설정" aria-hidden="true">#</a> pam.d 설정</h3>
<Tabs id="55" :data='[]'>
</Tabs>
<h3 id="ssh-설정" tabindex="-1"><a class="header-anchor" href="#ssh-설정" aria-hidden="true">#</a> ssh 설정</h3>
<p><code v-pre>/etc/ssh/sshd_config</code> 파일의 <code v-pre>ChallengeResponseAuthentication</code> 부분을 수정</p>
<blockquote>
<p>이미 있는 옵션은 값 수정, 없는 옵션은 추가</p>
</blockquote>
<div class="language-properties line-numbers-mode" data-ext="properties"><pre v-pre class="language-properties"><code><span class="token key attr-name">ChallengeResponseAuthentication</span> <span class="token value attr-value">yes</span>
<span class="token key attr-name">UsePAM</span> <span class="token value attr-value">yes</span>
<span class="token key attr-name">PasswordAuthentication</span> <span class="token value attr-value">no</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ssh-서비스-재시작" tabindex="-1"><a class="header-anchor" href="#ssh-서비스-재시작" aria-hidden="true">#</a> ssh 서비스 재시작</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ systemctl restart <span class="token function">ssh</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="테스트" tabindex="-1"><a class="header-anchor" href="#테스트" aria-hidden="true">#</a> 테스트</h2>
<p>otp 발급</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> ssh/creds/otp_key_role <span class="token assign-left variable">ip</span><span class="token operator">=</span><span class="token number">172.28</span>.128.31
Key                Value
---                -----
lease_id           ssh/creds/otp_key_role/r2SFjhwt3brVT0msL1KEq2Dv
lease_duration     768h
lease_renewable    <span class="token boolean">false</span>
<span class="token function">ip</span>                 <span class="token number">172.28</span>.128.31
key                f8a32d6c-beec-383c-62d6-3718b367f88d
key_type           otp
port               <span class="token number">22</span>
username           <span class="token builtin class-name">test</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="접속-방법-1-ssh" tabindex="-1"><a class="header-anchor" href="#접속-방법-1-ssh" aria-hidden="true">#</a> 접속 방법 1. ssh</h3>
<blockquote>
<p>Password: 에 앞서 요청한 롤의 credential 값의 <code v-pre>key</code> 를 넣어준다.</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">ssh</span> test@172.28.128.31
Password:
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="접속-방법-2-vault-ssh" tabindex="-1"><a class="header-anchor" href="#접속-방법-2-vault-ssh" aria-hidden="true">#</a> 접속 방법 2. vault ssh</h3>
<blockquote>
<p>Vault로 해당 ssh otp에 권한이 있는 사용자인 경우 <code v-pre>sshpass</code> 가 설치되어있으면 자동 입력</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">ssh</span> <span class="token parameter variable">-role</span> otp_key_role <span class="token parameter variable">-mode</span> otp test@172.28.128.31
or
$ vault <span class="token function">ssh</span> <span class="token parameter variable">-role</span> otp_key_role <span class="token parameter variable">-mode</span> otp -strict-host-key-checking<span class="token operator">=</span>no test@172.28.128.31
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


