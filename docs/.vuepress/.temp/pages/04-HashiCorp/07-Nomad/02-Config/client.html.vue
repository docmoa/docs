<template><div><h1 id="nomad-클라이언트-설정" tabindex="-1"><a class="header-anchor" href="#nomad-클라이언트-설정" aria-hidden="true">#</a> Nomad 클라이언트 설정</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>최대한 설정값을 넣어보고, 번역기도 돌려보고 물어도 보고 넣은 Client설정 파일입니다.<br>
네트워크는 프라이빗(온프레이머스) 환경입니다.</p>
</div>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment">#nomad client 설정</span>
 
<span class="token keyword">client</span> <span class="token punctuation">{</span>
  <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">servers</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"172.30.1.17"</span>,<span class="token string">"172.30.1.18"</span>,<span class="token string">"172.30.1.19"</span><span class="token punctuation">]</span>
  <span class="token keyword">server_join</span> <span class="token punctuation">{</span>
    <span class="token property">retry_join</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"172.30.1.17"</span>,<span class="token string">"172.30.1.18"</span>,<span class="token string">"172.30.1.19"</span><span class="token punctuation">]</span>
    <span class="token property">retry_max</span> <span class="token punctuation">=</span> <span class="token number">3</span>
    <span class="token property">retry_interval</span> <span class="token punctuation">=</span> <span class="token string">"15s"</span>
  <span class="token punctuation">}</span>
  <span class="token comment">#host에서 nomad에서 사용할 수 있는 volume 설정</span>
  host_volume <span class="token string">"logs"</span> <span class="token punctuation">{</span>
    <span class="token property">path</span>      <span class="token punctuation">=</span> <span class="token string">"/var/logs/elk/"</span>
    <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span>
  <span class="token comment">#각각의 client의 레이블 작성</span>
  <span class="token comment">#meta {</span>
  <span class="token comment">#   name = "moon"</span>
  <span class="token comment">#   zone = "web"</span>
  <span class="token comment">#}</span>
  <span class="token comment">#nomad에서 예약할 자원</span>
  <span class="token keyword">reserved</span> <span class="token punctuation">{</span>
    <span class="token comment">#Specifies the amount of CPU to reserve, in MHz.</span>
    <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">200</span>
    <span class="token comment">#Specifies the amount of memory to reserve, in MB.</span>
    <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">8192</span>
    <span class="token comment">#Specifies the amount of disk to reserve, in MB.</span>
    <span class="token property">disk</span> <span class="token punctuation">=</span> <span class="token number">102400</span>
  <span class="token punctuation">}</span>
  <span class="token property">no_host_uuid</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token comment">#bridge network interface name</span>
  <span class="token property">bridge_network_name</span> <span class="token punctuation">=</span> <span class="token string">"nomad"</span>
  <span class="token property">bridge_network_subnet</span> <span class="token punctuation">=</span> <span class="token string">"172.26.64.0/20"</span>
  <span class="token property">cni_path</span> <span class="token punctuation">=</span> <span class="token string">"/opt/cni/bin"</span>
  <span class="token property">cni_config_dir</span> <span class="token punctuation">=</span> <span class="token string">"/opt/cni/config"</span>
<span class="token punctuation">}</span>
<span class="token comment">#tls 설정</span>
<span class="token keyword">tls</span> <span class="token punctuation">{</span>
  <span class="token property">http</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">rpc</span>  <span class="token punctuation">=</span> <span class="token boolean">true</span>
 
  <span class="token property">ca_file</span>   <span class="token punctuation">=</span> <span class="token string">"/opt/ssl/nomad/nomad-agent-ca.pem"</span>
  <span class="token property">cert_file</span> <span class="token punctuation">=</span> <span class="token string">"/opt/ssl/nomad/global-client-nomad-0.pem"</span>
  <span class="token property">key_file</span>  <span class="token punctuation">=</span> <span class="token string">"/opt/ssl/nomad/global-client-nomad-0-key.pem"</span>
 
  <span class="token property">verify_server_hostname</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">verify_https_client</span>    <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="nomad-클라이언트-최소-설정-20220807기준" tabindex="-1"><a class="header-anchor" href="#nomad-클라이언트-최소-설정-20220807기준" aria-hidden="true">#</a> Nomad 클라이언트 최소 설정 (20220807기준)</h1>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>data_dir  <span class="token operator">=</span> <span class="token string">"/opt/nomad/data"</span>
bind_addr <span class="token operator">=</span> <span class="token string">"0.0.0.0"</span>

client <span class="token punctuation">{</span>
  enabled <span class="token operator">=</span> <span class="token boolean">true</span>
  servers <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"server ip"</span><span class="token punctuation">]</span>
  <span class="token comment"># sidecar image 고정</span>
  meta <span class="token punctuation">{</span>
   connect.sidecar_image <span class="token operator">=</span> <span class="token string">"envoyproxy/envoy:v1.21.3"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">#consul 정보 입력</span>
consul <span class="token punctuation">{</span>
  address  <span class="token operator">=</span> <span class="token string">"127.0.0.1:8501"</span>
  <span class="token assign-left variable">grpc_address</span><span class="token operator">=</span><span class="token string">"127.0.0.1:8502"</span>
  server_service_name <span class="token operator">=</span> <span class="token string">"nomad"</span>
  client_service_name <span class="token operator">=</span> <span class="token string">"nomad-client"</span>
  auto_advertise  <span class="token operator">=</span> <span class="token boolean">true</span>
  server_auto_join  <span class="token operator">=</span> <span class="token boolean">true</span>
  client_auto_join  <span class="token operator">=</span> <span class="token boolean">true</span>
  ssl       <span class="token operator">=</span> <span class="token boolean">true</span>
  verify_ssl <span class="token operator">=</span> <span class="token boolean">false</span>
  ca_file   <span class="token operator">=</span> <span class="token string">"/opt/consul/consul-agent-ca.pem"</span>
  cert_file <span class="token operator">=</span> <span class="token string">"/opt/consul/my-dc-client-consul-0.pem"</span>
  key_file  <span class="token operator">=</span> <span class="token string">"/opt/consul/my-dc-client-consul-0-key.pem"</span>
<span class="token punctuation">}</span>

plugin <span class="token string">"docker"</span> <span class="token punctuation">{</span>
  config <span class="token punctuation">{</span>
    auth <span class="token punctuation">{</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


