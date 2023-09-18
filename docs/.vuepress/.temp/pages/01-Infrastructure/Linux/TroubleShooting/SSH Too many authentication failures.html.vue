<template><div><h1 id="ssh-too-many-authentication-failures" tabindex="-1"><a class="header-anchor" href="#ssh-too-many-authentication-failures" aria-hidden="true">#</a> SSH Too many authentication failures</h1>
<p>직역하자면 <code v-pre>너무많은 인증 실패로 인한 SSH 접속이 안된다.</code> 는 메시지를 간혹 보게되는 경우가 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">ssh</span> myserver
Received disconnect from <span class="token number">192.168</span>.0.43 port <span class="token number">22</span>:2: Too many authentication failures
Connection to <span class="token number">192.168</span>.0.43 closed by remote host.
Connection to <span class="token number">192.168</span>.0.43 closed.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>특히나 클라우드나 VM을 새로 프로비저닝 해서 사용하려고 할때 IP가 중복되어 재사용되어야 하는 경우에 주로 발생하는 걸로 추측된다.</p>
<p>위 메시지의 발생 원인은 이미 SSH로 접속하려고 하는 클라이언트 환경에 많은 SSH ID 정보가 저장되어있고, SSH Client를 실행할 때 ssh-agent로 이미 알고있는 모든 SSH 키와 다른 모든 키에 대해 접속을 시도하게 된다. 이때 SSH로 접속하고자 하는 원격 서버는 특정 ID 키로 맵핑되어있고, 기존의 키 정보와 맞지 않거나 동일한 대상에 대한 SSH ID 정보와 달라진 것이 원인으로 확인된다.</p>
<h2 id="해결-방법-1" tabindex="-1"><a class="header-anchor" href="#해결-방법-1" aria-hidden="true">#</a> 해결 방법 1</h2>
<p>접속하고자 하는 Client 환경에서 SSH 키를 초기화 하는 방법</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ ssh-add <span class="token parameter variable">-D</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>위와 같이 했을 때 <code v-pre>Could not open a connection to your authentication agent.</code> 와 같은 오류가 발생한다면 다음 방법으로 초기화 한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token builtin class-name">exec</span> ssh-agent <span class="token function">bash</span>
$ ssh-add <span class="token parameter variable">-D</span>
All identities removed.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="해결-방법-2" tabindex="-1"><a class="header-anchor" href="#해결-방법-2" aria-hidden="true">#</a> 해결 방법 2</h2>
<p>SSH 옵션으로 Public Key를 이용한 접속을 일시적으로 사용하지 않도록 하는 방법</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">ssh</span> <span class="token parameter variable">-p</span> <span class="token number">22</span> <span class="token parameter variable">-o</span> <span class="token assign-left variable">PubkeyAuthentication</span><span class="token operator">=</span>no username@myserver
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="해결-방법-3" tabindex="-1"><a class="header-anchor" href="#해결-방법-3" aria-hidden="true">#</a> 해결 방법 3</h2>
<p><code v-pre>~/.ssh/config</code>의 대상 호스트에 <code v-pre>IdentitiesOnly=yes</code>를 추가하는 벙법<br>
많은 ID를 제공 하더라도 ssh가 ssh_config 파일에 구성된 인증 ID 파일만 사용하도록 지정한다고 함</p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre ini="" class="language-ini"><code>Host myserver
IdentityFile ~/.ssh/key_rsa
IdentitiesOnly yes
Port 22
</code></pre><div class="highlight-lines"><br><br><div class="highlight-line">&nbsp;</div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


