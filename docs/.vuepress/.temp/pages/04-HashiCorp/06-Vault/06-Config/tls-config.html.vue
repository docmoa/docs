<template><div><h1 id="vault-server-tls-설정" tabindex="-1"><a class="header-anchor" href="#vault-server-tls-설정" aria-hidden="true">#</a> Vault Server tls 설정</h1>
<ul>
<li>Consul tls create 명령어를 이용하여 인증서 생성, 그외에 사설인증서 만드는 방법으로는 더 테스트 해봐야 할듯</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># consul tls create로 인증서 생성</span>
consul tls ca create <span class="token parameter variable">-domain</span><span class="token operator">=</span>vault <span class="token parameter variable">-days</span> <span class="token number">3650</span>
consul tls cert create <span class="token parameter variable">-domain</span><span class="token operator">=</span>vault <span class="token parameter variable">-dc</span><span class="token operator">=</span>global  <span class="token parameter variable">-server</span> <span class="token parameter variable">-days</span> <span class="token number">3650</span>
consul tls cert create <span class="token parameter variable">-domain</span><span class="token operator">=</span>vault <span class="token parameter variable">-dc</span><span class="token operator">=</span>global  <span class="token parameter variable">-client</span> <span class="token parameter variable">-days</span> <span class="token number">3650</span>
consul tls cert create <span class="token parameter variable">-domain</span><span class="token operator">=</span>vault <span class="token parameter variable">-dc</span><span class="token operator">=</span>global  <span class="token parameter variable">-cli</span> <span class="token parameter variable">-days</span> <span class="token number">3650</span>

<span class="token comment"># vault config는 아래와 같다.</span>
ui <span class="token operator">=</span> <span class="token boolean">true</span>

storage <span class="token string">"consul"</span> <span class="token punctuation">{</span>
  address <span class="token operator">=</span> <span class="token string">"127.0.0.1:8500"</span>
  path    <span class="token operator">=</span> <span class="token string">"vault/"</span>
<span class="token punctuation">}</span>

listener <span class="token string">"tcp"</span> <span class="token punctuation">{</span>
  address         <span class="token operator">=</span> <span class="token string">"0.0.0.0:8200"</span>
  <span class="token comment">#tls_disable = 1</span>
  tls_cert_file <span class="token operator">=</span> <span class="token string">"/root/temp/global-server-vault-0.pem"</span>
  tls_key_file  <span class="token operator">=</span> <span class="token string">"/root/temp/global-server-vault-0-key.pem"</span>
<span class="token punctuation">}</span>

disable_mlock <span class="token operator">=</span> <span class="token boolean">true</span>
default_lease_ttl <span class="token operator">=</span> <span class="token string">"768h"</span>
max_lease_ttl <span class="token operator">=</span> <span class="token string">"768h"</span>

api_addr <span class="token operator">=</span>  <span class="token string">"https://172.21.2.50:8200"</span>

<span class="token comment"># 명령어를 써야 할 경우 cli 인증서를 export 해줘야한다.</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_CACERT</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${<span class="token environment constant">HOME</span>}</span>/temp/vault-agent-ca.pem"</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_CLIENT_CERT</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${<span class="token environment constant">HOME</span>}</span>/temp/global-cli-vault-0.pem"</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_CLIENT_KEY</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${<span class="token environment constant">HOME</span>}</span>/temp/global-cli-vault-0-key.pem"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


