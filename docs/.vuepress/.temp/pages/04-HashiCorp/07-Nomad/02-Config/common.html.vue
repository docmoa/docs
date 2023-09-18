<template><div><h1 id="nomad-공통-설정" tabindex="-1"><a class="header-anchor" href="#nomad-공통-설정" aria-hidden="true">#</a> Nomad 공통 설정</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>최대한 설정값을 넣어보고, 번역기도 돌려보고 물어도 보고 넣은 server, client의 공통설정 파일입니다.<br>
저는 agent.hcl파일안에 다 넣고 실행하지만 나눠서 추후에는 기능별로 나눠서 사용할 예정입니다.</p>
</div>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment">#nomad 공통 설정</span>
<span class="token property">datacenter</span> <span class="token punctuation">=</span> <span class="token string">"dc1"</span>
<span class="token property">region</span> <span class="token punctuation">=</span> <span class="token string">"global"</span>
<span class="token property">data_dir</span> <span class="token punctuation">=</span> <span class="token string">"/opt/nomad/nomad"</span>
<span class="token property">bind_addr</span> <span class="token punctuation">=</span> <span class="token string">"{{ GetInterfaceIP `ens192` }}"</span>
 
<span class="token keyword">advertise</span> <span class="token punctuation">{</span>
  <span class="token comment"># Defaults to the first private IP address.</span>
  <span class="token comment">#http = "{{ GetInterfaceIP `ens244` }}"</span>
  <span class="token comment">#rpc  = "{{ GetInterfaceIP `ens244` }}"</span>
  <span class="token comment">#serf = "{{ GetInterfaceIP `ens244` }}"</span>
  <span class="token property">http</span> <span class="token punctuation">=</span> <span class="token string">"{{ GetInterfaceIP `ens192` }}"</span>
  <span class="token property">rpc</span> <span class="token punctuation">=</span> <span class="token string">"{{ GetInterfaceIP `ens192` }}"</span>
  <span class="token property">serf</span> <span class="token punctuation">=</span> <span class="token string">"{{ GetInterfaceIP `ens192` }}"</span>
<span class="token punctuation">}</span>
 
<span class="token keyword">consul</span> <span class="token punctuation">{</span>
  <span class="token property">address</span>  <span class="token punctuation">=</span> <span class="token string">"127.0.0.1:8500"</span>
  <span class="token property">server_service_name</span> <span class="token punctuation">=</span> <span class="token string">"nomad"</span>
  <span class="token property">client_service_name</span> <span class="token punctuation">=</span> <span class="token string">"nomad-client"</span>
  <span class="token property">auto_advertise</span>  <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">server_auto_join</span>  <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">client_auto_join</span>  <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token comment">#consul join용 token</span>
  <span class="token property">token</span> <span class="token punctuation">=</span> <span class="token string">"33ee4276-e1ef-8e5b-d212-1f94ca8cf81e"</span>
<span class="token punctuation">}</span>
<span class="token property">enable_syslog</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
<span class="token property">enable_debug</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
<span class="token property">disable_update_check</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
 
<span class="token property">log_level</span> <span class="token punctuation">=</span> <span class="token string">"DEBUG"</span>
<span class="token property">log_file</span> <span class="token punctuation">=</span> <span class="token string">"/var/log/nomad/nomad.log"</span>
<span class="token property">log_rotate_duration</span> <span class="token punctuation">=</span> <span class="token string">"24h"</span>
<span class="token property">log_rotate_bytes</span> <span class="token punctuation">=</span> <span class="token number">104857600</span>
<span class="token property">log_rotate_max_files</span> <span class="token punctuation">=</span> <span class="token number">100</span>
 
<span class="token keyword">ports</span> <span class="token punctuation">{</span>
  <span class="token property">http</span> <span class="token punctuation">=</span> <span class="token number">4646</span>
  <span class="token property">rpc</span> <span class="token punctuation">=</span> <span class="token number">4647</span>
  <span class="token property">serf</span> <span class="token punctuation">=</span> <span class="token number">4648</span>
<span class="token punctuation">}</span>
 
<span class="token comment">#prometheus에서 nomad의 metrics값을 수집 해 갈 수 있게 해주는 설정</span>
<span class="token keyword">telemetry</span> <span class="token punctuation">{</span>
  <span class="token property">collection_interval</span> <span class="token punctuation">=</span> <span class="token string">"1s"</span>
  <span class="token property">disable_hostname</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">prometheus_metrics</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">publish_allocation_metrics</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">publish_node_metrics</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
 
 
plugin <span class="token string">"docker"</span> <span class="token punctuation">{</span>
  <span class="token keyword">config</span> <span class="token punctuation">{</span>
    <span class="token keyword">auth</span> <span class="token punctuation">{</span>
      <span class="token property">config</span> <span class="token punctuation">=</span> <span class="token string">"/root/.docker/config.json"</span>
    <span class="token punctuation">}</span>
    <span class="token comment">#온프레이머스환경에서는 해당 이미지를 private repository에 ㅓㄶ고 변경</span>
    <span class="token property">infra_image</span> <span class="token punctuation">=</span> <span class="token string">"google-containers/pause-amd64:3.1"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
 
<span class="token keyword">acl</span> <span class="token punctuation">{</span>
  <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


