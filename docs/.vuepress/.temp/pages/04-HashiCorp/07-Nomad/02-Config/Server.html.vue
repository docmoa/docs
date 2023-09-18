<template><div><h1 id="nomad-서버-설정" tabindex="-1"><a class="header-anchor" href="#nomad-서버-설정" aria-hidden="true">#</a> Nomad 서버 설정</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>최대한 설정값을 넣어보고, 번역기도 돌려보고 물어도 보고 넣은 server설정 파일입니다.<br>
네트워크는 프라이빗(온프레이머스) 환경입니다.</p>
</div>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment">#nomad server 설정</span>
<span class="token keyword">server</span> <span class="token punctuation">{</span>
  <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">bootstrap_expect</span> <span class="token punctuation">=</span> <span class="token number">3</span>
  <span class="token property">license_path</span><span class="token punctuation">=</span><span class="token string">"/opt/nomad/license/nomad.license"</span>
  <span class="token keyword">server_join</span> <span class="token punctuation">{</span>
    <span class="token property">retry_join</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"172.30.1.17"</span>,<span class="token string">"172.30.1.18"</span>,<span class="token string">"172.30.1.19"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">raft_protocol</span> <span class="token punctuation">=</span> <span class="token number">3</span>
  <span class="token property">event_buffer_size</span> <span class="token punctuation">=</span> <span class="token number">100</span>
  <span class="token property">non_voting_server</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
  <span class="token property">heartbeat_grace</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
<span class="token punctuation">}</span>
 
 
<span class="token comment">#tls 설정</span>
<span class="token keyword">tls</span> <span class="token punctuation">{</span>
  <span class="token property">http</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">rpc</span>  <span class="token punctuation">=</span> <span class="token boolean">true</span>
 
  <span class="token property">ca_file</span>   <span class="token punctuation">=</span> <span class="token string">"/opt/ssl/nomad/nomad-agent-ca.pem"</span>
  <span class="token property">cert_file</span> <span class="token punctuation">=</span> <span class="token string">"/opt/ssl/nomad/global-server-nomad-0.pem"</span>
  <span class="token property">key_file</span>  <span class="token punctuation">=</span> <span class="token string">"/opt/ssl/nomad/global-server-nomad-0-key.pem"</span>
 
  <span class="token comment">#UI오픈할 서버만 변경</span>
  <span class="token property">verify_server_hostname</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
  <span class="token property">verify_https_client</span>    <span class="token punctuation">=</span> <span class="token boolean">false</span>
  <span class="token comment">#일반서버는 아래와 같이 설정</span>
  <span class="token property">verify_server_hostname</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">verify_https_client</span>    <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="nomad-서버-최소-설정-20220807기준" tabindex="-1"><a class="header-anchor" href="#nomad-서버-최소-설정-20220807기준" aria-hidden="true">#</a> Nomad 서버 최소 설정 (20220807기준)</h1>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>data_dir = "/opt/consul"

client_addr = "0.0.0.0"

datacenter = "my-dc"

#ui
ui_config {
  enabled = true
}

# server
server = true

# Bind addr
bind_addr = "0.0.0.0" # Listen on all IPv4
# Advertise addr - if you want to point clients to a different address than bind or LB.
advertise_addr = "node ip"

# Enterprise License
license_path = "/opt/nomad/nomad.lic"

# bootstrap_expect
bootstrap_expect=1

# encrypt
encrypt = "7w+zkhqa+YD4GSKXjRWETBIT8hs53Sr/w95oiVxq5Qc="

# retry_join
retry_join = ["server ip"]

key_file = "/opt/consul/my-dc-server-consul-0-key.pem"
cert_file = "/opt/consul/my-dc-server-consul-0.pem"
ca_file = "/opt/consul/consul-agent-ca.pem"
auto_encrypt {
  allow_tls = true
}

verify_incoming = false
verify_incoming_rpc = false
verify_outgoing = false
verify_server_hostname = false

ports {
  http = 8500
  dns = 8600
  server = 8300
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


