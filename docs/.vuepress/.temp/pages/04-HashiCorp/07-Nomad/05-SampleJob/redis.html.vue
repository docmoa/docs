<template><div><h1 id="redis" tabindex="-1"><a class="header-anchor" href="#redis" aria-hidden="true">#</a> redis</h1>
<ul>
<li>추가내용: redis는 data dir, cluster info dir(클러스터 시) 이 두개의 dir가 필요하여 volume을 추가로 붙여줘야한다.
<ul>
<li>data dir을 변경이 번거로움(docker build를 다시 해야함) 그래서 클러스터 시에는 docker build, nomad volume으로 나눔과 같은 방법이 있음</li>
<li>cluster-enabled : 클러스터로 사용합니다. (cluster volume으로 빼둬야됨)</li>
<li>cluster-config-file : 노드별로 클러스터 노드 정보를 conf 파일에 저장합니다.</li>
<li>cluster-node-timeout : 노드간 통신이 되지 않아 timeout 되는 시간을 설정합니다.</li>
</ul>
</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"redis-cluster"</span> <span class="token punctuation">{</span>

  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  group <span class="token string">"redis"</span> <span class="token punctuation">{</span>

    volume <span class="token string">"redis-data"</span> <span class="token punctuation">{</span>
      <span class="token property">type</span>      <span class="token punctuation">=</span> <span class="token string">"host"</span>
      <span class="token property">source</span>    <span class="token punctuation">=</span> <span class="token string">"redis-data"</span>
      <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>

    volume <span class="token string">"redis-cluster"</span> <span class="token punctuation">{</span>
      <span class="token property">type</span>      <span class="token punctuation">=</span> <span class="token string">"host"</span>
      <span class="token property">source</span>    <span class="token punctuation">=</span> <span class="token string">"redis-cluster"</span>
      <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      
      port <span class="token string">"master"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span>     <span class="token punctuation">=</span> <span class="token number">6379</span>
      <span class="token punctuation">}</span>
      port <span class="token string">"slave"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span>     <span class="token punctuation">=</span> <span class="token number">6380</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"master-redis"</span>
      <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"master-redis"</span><span class="token punctuation">]</span>
      <span class="token property">port</span>     <span class="token punctuation">=</span> <span class="token string">"master"</span>
      <span class="token keyword">check</span> <span class="token punctuation">{</span>
        <span class="token property">port</span>     <span class="token punctuation">=</span> <span class="token string">"master"</span>
        <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
        <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
        <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"slave-redis"</span>
      <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"slave-redis"</span><span class="token punctuation">]</span>
      <span class="token property">port</span>     <span class="token punctuation">=</span> <span class="token string">"slave"</span>
      <span class="token keyword">check</span> <span class="token punctuation">{</span>
        <span class="token property">port</span>     <span class="token punctuation">=</span> <span class="token string">"slave"</span>
        <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
        <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
        <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>



    task <span class="token string">"redis-master"</span> <span class="token punctuation">{</span>
      <span class="token keyword">volume_mount</span> <span class="token punctuation">{</span>
        <span class="token property">volume</span>      <span class="token punctuation">=</span> <span class="token string">"redis-data"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/data"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">volume_mount</span> <span class="token punctuation">{</span>
        <span class="token property">volume</span>      <span class="token punctuation">=</span> <span class="token string">"redis-cluster"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/master"</span>
      <span class="token punctuation">}</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">network_mode</span> <span class="token punctuation">=</span> <span class="token string">"host"</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"redis:5.0.5-buster"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"master"</span><span class="token punctuation">]</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"redis-server"</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_TASK_DIR<span class="token punctuation">}</span></span>/redis.conf"</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
port {{ env "NOMAD_PORT_master" }} 
bind {{ env "NOMAD_IP_master" }} 
#bind 127.0.0.1 ::1
cluster-enabled yes
cluster-config-file /master/nodes.conf
cluster-node-timeout 3000
appendonly yes

EOF</span>

        <span class="token property">destination</span>   <span class="token punctuation">=</span> <span class="token string">"local/redis.conf"</span>
        <span class="token property">change_mode</span>   <span class="token punctuation">=</span> <span class="token string">"signal"</span>
        <span class="token property">change_signal</span> <span class="token punctuation">=</span> <span class="token string">"SIGHUP"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">1000</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">1001</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    task <span class="token string">"redis-slave"</span> <span class="token punctuation">{</span>

      <span class="token keyword">volume_mount</span> <span class="token punctuation">{</span>
        <span class="token property">volume</span>      <span class="token punctuation">=</span> <span class="token string">"redis-data"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/data"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">volume_mount</span> <span class="token punctuation">{</span>
        <span class="token property">volume</span>      <span class="token punctuation">=</span> <span class="token string">"redis-cluster"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/slave"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">NODE_IP</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_IP_slave-redis<span class="token punctuation">}</span></span>"</span>
      <span class="token punctuation">}</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">network_mode</span> <span class="token punctuation">=</span> <span class="token string">"host"</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"redis:5.0.5-buster"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"slave"</span><span class="token punctuation">]</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"redis-server"</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_TASK_DIR<span class="token punctuation">}</span></span>/redis.conf"</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
port {{ env "NOMAD_PORT_slave" }} 
bind  {{ env "NOMAD_IP_slave" }} 
#bind  127.0.0.1 ::1
cluster-enabled yes
cluster-config-file /slave/nodes.conf
cluster-node-timeout 3000
appendonly yes

EOF</span>

        <span class="token property">destination</span>   <span class="token punctuation">=</span> <span class="token string">"local/redis.conf"</span>
        <span class="token property">change_mode</span>   <span class="token punctuation">=</span> <span class="token string">"signal"</span>
        <span class="token property">change_signal</span> <span class="token punctuation">=</span> <span class="token string">"SIGHUP"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">1000</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">1001</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>




</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


