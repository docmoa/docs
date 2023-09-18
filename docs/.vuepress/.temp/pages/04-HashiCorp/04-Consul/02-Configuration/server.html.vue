<template><div><h1 id="consul-서버-설정" tabindex="-1"><a class="header-anchor" href="#consul-서버-설정" aria-hidden="true">#</a> Consul 서버 설정</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>최대한 설정값을 넣어보고, 번역기도 돌려보고 물어도 보고 넣은 server설정 파일입니다.<br>
네트워크는 프라이빗(온프레이머스) 환경입니다.</p>
</div>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>#consul server 설정
server = true
ui_config {
  enabled = true
}
bootstrap_expect = 3
  
license_path = "/opt/license/consul.license"
 
retry_join = ["172.30.1.17","172.30.1.18","172.30.1.19"]
 
performance {
  raft_multiplier = 1
}
 
#raft protocal 버전, consul 업데이트 시 1씩 증가
raft_protocol = 3
 
#node가 완전히 삭제되는 시간
reconnect_timeout = "72h"
 
raft_snapshot_interval = "5s"
 
#해당 서버를 non-voting server로 지정
#read_replica = false
 
limits {
  http_max_conns_per_client = 200
  rpc_handshake_timeout = "5s"
}
 
key_file = "/opt/ssl/consul/dc1-server-consul-0-key.pem"
cert_file = "/opt/ssl/consul/dc1-server-consul-0.pem"
ca_file = "/opt/ssl/consul/consul-agent-ca.pem"
auto_encrypt {
  allow_tls = true
}
 
verify_incoming = false,
verify_incoming_rpc = true
verify_outgoing = true
verify_server_hostname = false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="consul-서버-최소-설정-20220807기준" tabindex="-1"><a class="header-anchor" href="#consul-서버-최소-설정-20220807기준" aria-hidden="true">#</a> Consul 서버 최소 설정 (20220807기준)</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>최소한의 설정만 있는 consul 설정입니다.</p>
</div>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>data_dir <span class="token operator">=</span> <span class="token string">"/opt/consul"</span>

client_addr <span class="token operator">=</span> <span class="token string">"0.0.0.0"</span>

datacenter <span class="token operator">=</span> <span class="token string">"my-dc"</span>

<span class="token comment">#ui</span>
ui_config <span class="token punctuation">{</span>
  enabled <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token comment"># server</span>
server <span class="token operator">=</span> <span class="token boolean">true</span>

<span class="token comment"># Bind addr</span>
bind_addr <span class="token operator">=</span> <span class="token string">"0.0.0.0"</span> <span class="token comment"># Listen on all IPv4</span>
<span class="token comment"># Advertise addr - if you want to point clients to a different address than bind or LB.</span>
advertise_addr <span class="token operator">=</span> <span class="token string">"node ip"</span>

<span class="token comment"># Enterprise License</span>
license_path <span class="token operator">=</span> <span class="token string">"/opt/consul/consul.lic"</span>

<span class="token comment"># bootstrap_expect</span>
<span class="token assign-left variable">bootstrap_expect</span><span class="token operator">=</span><span class="token number">1</span>

<span class="token comment"># encrypt</span>
encrypt <span class="token operator">=</span> <span class="token string">"7w+zkhqa+YD4GSKXjRWETBIT8hs53Sr/w95oiVxq5Qc="</span>

<span class="token comment"># retry_join</span>
retry_join <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"Server ip"</span><span class="token punctuation">]</span>

key_file <span class="token operator">=</span> <span class="token string">"/opt/consul/my-dc-server-consul-0-key.pem"</span>
cert_file <span class="token operator">=</span> <span class="token string">"/opt/consul/my-dc-server-consul-0.pem"</span>
ca_file <span class="token operator">=</span> <span class="token string">"/opt/consul/consul-agent-ca.pem"</span>
auto_encrypt <span class="token punctuation">{</span>
  allow_tls <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

verify_incoming <span class="token operator">=</span> <span class="token boolean">false</span>
verify_incoming_rpc <span class="token operator">=</span> <span class="token boolean">false</span>
verify_outgoing <span class="token operator">=</span> <span class="token boolean">false</span>
verify_server_hostname <span class="token operator">=</span> <span class="token boolean">false</span>

ports <span class="token punctuation">{</span>
  http <span class="token operator">=</span> <span class="token number">8500</span>
  dns <span class="token operator">=</span> <span class="token number">8600</span>
  server <span class="token operator">=</span> <span class="token number">8300</span>
<span class="token punctuation">}</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


