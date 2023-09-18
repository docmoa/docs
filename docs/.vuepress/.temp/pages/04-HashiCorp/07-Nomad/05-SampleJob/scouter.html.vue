<template><div><h1 id="scouter" tabindex="-1"><a class="header-anchor" href="#scouter" aria-hidden="true">#</a> Scouter</h1>
<ul>
<li>공식 Github : <a href="https://github.com/scouter-project/scouter" target="_blank" rel="noopener noreferrer">https://github.com/scouter-project/scouter<ExternalLinkIcon/></a></li>
<li>Scouter 다운로드
<ul>
<li>scouter collector와 host-agent 를 실행하는 job에서 버전정보를 기반으로 다운로드</li>
<li>host agent는 <code v-pre>system</code> 타입으로 모든 노드에서 실행되도록 구성</li>
</ul>
</li>
<li>tomcat 다운로드
<ul>
<li>다운로드 받지않고 호스트에 미리 설치해 놓는 방식이 더 가벼워보임 --&gt; 아마도 Packer, Terraform의 조합이면 가능</li>
<li>다운로드 받게 구성하면 컨테이너처럼 Nomad가 배포할 때마다 다운받아서 구성 가능</li>
</ul>
</li>
<li>Template - server.xml
<ul>
<li>server.xml 기본 구성에서 port가 선언되는 자리를 java option에서 받을 수 있도록 변경</li>
<li>Template 구성도 가능하고 미리 구성한 xml을 다운로드 받게 하는것도 괜찮아 보임</li>
</ul>
</li>
<li>Consul과 함께 구성된 경우 Nginx같은 LB 구성 Job 에서 backend를 동적으로 구성 가능</li>
<li>Nomad에 Scouter Collector와 Host Agent를 위한 별도 Namespace를 구성하는 것도 관리를 위해 좋아보임<br>
<code v-pre>nomad namespace apply -description &quot;scouter&quot; scouter</code></li>
</ul>
<h2 id="scouter-collector-server" tabindex="-1"><a class="header-anchor" href="#scouter-collector-server" aria-hidden="true">#</a> Scouter - Collector Server</h2>
<ul>
<li>Collector의 경우 Client 에서 연결하기 위해 고정된 포트를 지정해야 하므로 static 포트로 지정</li>
<li>Collector의 경우 data를 영구적으로 보관하기 위해서는 <code v-pre>Volume</code> 할당하는 것을 권장
<ul>
<li>database</li>
<li>logs</li>
</ul>
</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "version" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"2.15.0"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"scouter의 버전 기입 또는 배포시 입력 받기"</span>
<span class="token punctuation">}</span>

<span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">souter_release_url</span> <span class="token punctuation">=</span> <span class="token string">"https://github.com/scouter-project/scouter/releases/download/v<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">version</span><span class="token punctuation">}</span></span>/scouter-min-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">version</span><span class="token punctuation">}</span></span>.tar.gz"</span>
<span class="token punctuation">}</span>

job <span class="token string">"scouter-collector"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token comment">// namespace = "scouter"</span>

  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>

  group <span class="token string">"collector"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">scaling</span> <span class="token punctuation">{</span>
      <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
      <span class="token property">min</span> <span class="token punctuation">=</span> <span class="token number">1</span>
      <span class="token property">max</span> <span class="token punctuation">=</span> <span class="token number">1</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"collector"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"java"</span>
      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token keyword">network</span> <span class="token punctuation">{</span>
          port <span class="token string">"collector"</span> <span class="token punctuation">{</span>
            <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token number">6100</span>
            <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">6100</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">500</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">512</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> local.souter_release_url
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/local"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
<span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
# Agent Control and Service Port(Default : TCP 6100)
net_tcp_listen_port={{ env "NOMAD_PORT_collector" }}

# UDP Receive Port(Default : 6100)
net_udp_listen_port={{ env "NOMAD_PORT_collector" }}

# DB directory(Default : ./database)
db_dir=./database

# Log directory(Default : ./logs)
log_dir=./logs
EOF</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/scouter/server/conf/scouter.conf"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">class_path</span> <span class="token punctuation">=</span> <span class="token string">"local/scouter/server/scouter-server-boot.jar"</span>
        <span class="token property">class</span> <span class="token punctuation">=</span> <span class="token string">"scouter.boot.Boot"</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"local/scouter/server/lib"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"scouter-collector"</span>
        <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"scouter"</span><span class="token punctuation">]</span>

        <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"collector"</span>

        <span class="token keyword">check</span> <span class="token punctuation">{</span>
          <span class="token property">type</span>  <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
          <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
          <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
          <span class="token property">port</span>  <span class="token punctuation">=</span> <span class="token string">"collector"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="scouter-host-agent" tabindex="-1"><a class="header-anchor" href="#scouter-host-agent" aria-hidden="true">#</a> Scouter - Host Agent</h2>
<ul>
<li>모든 Nomad Client 노드를 대상으로 구성하기 위해 <code v-pre>system</code> 타입으로 실행하나, 조건이 필요한 경우 Java가 있는 경우, 혹은 특정 노드에 대한 조건을 <code v-pre>Constrain</code>으로 구성할 수 있음</li>
<li>Collector Server의 정보를 Consul에서 동적으로 받아오도록 템플릿 구성</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment">// nomad namespace apply -description "scouter" scouter</span>

<span class="token keyword">variable<span class="token type variable"> "version" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"2.15.0"</span>
<span class="token punctuation">}</span>

<span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">souter_release_url</span> <span class="token punctuation">=</span> <span class="token string">"https://github.com/scouter-project/scouter/releases/download/v<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">version</span><span class="token punctuation">}</span></span>/scouter-min-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">version</span><span class="token punctuation">}</span></span>.tar.gz"</span>
<span class="token punctuation">}</span>

job <span class="token string">"scouter-host-agent"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token comment">// namespace = "scouter"</span>

  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"system"</span>

  group <span class="token string">"agent"</span> <span class="token punctuation">{</span>

    task <span class="token string">"agent"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"java"</span>
      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">100</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">128</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> local.souter_release_url
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/local"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
<span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
obj_name=${node.unique.name}
{{ range service "scouter-collector" }}
net_collector_ip={{ .Address }}
net_collector_udp_port={{ .Port }}
net_collector_tcp_port={{ .Port }}
{{ end }}
#cpu_warning_pct=80
#cpu_fatal_pct=85
#cpu_check_period_ms=60000
#cpu_fatal_history=3
#cpu_alert_interval_ms=300000
#disk_warning_pct=88
#disk_fatal_pct=92
EOF</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/scouter/agent.host/conf/scouter.conf"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">class_path</span> <span class="token punctuation">=</span> <span class="token string">"local/scouter/agent.host/scouter.host.jar"</span>
        <span class="token property">class</span> <span class="token punctuation">=</span> <span class="token string">"scouter.boot.Boot"</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"local/lib"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="tomcat-sample" tabindex="-1"><a class="header-anchor" href="#tomcat-sample" aria-hidden="true">#</a> Tomcat Sample</h2>
<ul>
<li>Tomcat 서버 구성 시 Tomcat과 Scouter 모두를 다운받게 구성
<ul>
<li>둘 모두 다운받기 때문에 운영에서 구성하는 경우 필요한 파일들만 별도 압축하여 별도 관리하는 것을 권장</li>
</ul>
</li>
<li>구성에 따른 이름을 매번 다르게 구성하기 위해 변수 활용
<ul>
<li><code v-pre>-Dobj_name=Tomcat-${node.unique.name}-${NOMAD_PORT_http}</code></li>
</ul>
</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "tomcat_version" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"10.0.14"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "scouter_version" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"2.15.0"</span>
<span class="token punctuation">}</span>

<span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">tomcat_major_ver</span> <span class="token punctuation">=</span> split(<span class="token string">"."</span>, var.tomcat_version)<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
  <span class="token property">tomcat_download_url</span> <span class="token punctuation">=</span> <span class="token string">"https://archive.apache.org/dist/tomcat/tomcat-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">tomcat_major_ver</span><span class="token punctuation">}</span></span>/v<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">tomcat_version</span><span class="token punctuation">}</span></span>/bin/apache-tomcat-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">tomcat_version</span><span class="token punctuation">}</span></span>.tar.gz"</span>
  <span class="token property">souter_release_url</span> <span class="token punctuation">=</span> <span class="token string">"https://github.com/scouter-project/scouter/releases/download/v<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">scouter_version</span><span class="token punctuation">}</span></span>/scouter-min-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">scouter_version</span><span class="token punctuation">}</span></span>.tar.gz"</span>
  <span class="token property">war_download_url</span> <span class="token punctuation">=</span> <span class="token string">"https://tomcat.apache.org/tomcat-10.0-doc/appdev/sample/sample.war"</span>
<span class="token punctuation">}</span>

job <span class="token string">"tomcat-scouter"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token comment">// namespace = "scouter"</span>

  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>

  group <span class="token string">"tomcat"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">scaling</span> <span class="token punctuation">{</span>
      <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token property">min</span> <span class="token punctuation">=</span> <span class="token number">1</span>
      <span class="token property">max</span> <span class="token punctuation">=</span> <span class="token number">3</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"tomcat"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"raw_exec"</span>
      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token keyword">network</span> <span class="token punctuation">{</span>
          port <span class="token string">"http"</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
          port <span class="token string">"stop"</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
          port <span class="token string">"jmx"</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">500</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">512</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">APP_VERSION</span> <span class="token punctuation">=</span> <span class="token string">"0.1"</span>
        <span class="token property">CATALINA_HOME</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_TASK_DIR<span class="token punctuation">}</span></span>/apache-tomcat-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">tomcat_version</span><span class="token punctuation">}</span></span>"</span>
        <span class="token property">CATALINA_OPTS</span> <span class="token punctuation">=</span> <span class="token string">"-Dport.http=$NOMAD_PORT_http -Dport.stop=$NOMAD_PORT_stop -Ddefault.context=$NOMAD_TASK_DIR -Xms256m -Xmx512m -javaagent:local/scouter/agent.java/scouter.agent.jar -Dscouter.config=local/conf/scouter.conf -Dobj_name=Tomcat-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>node<span class="token punctuation">.</span>unique<span class="token punctuation">.</span>name<span class="token punctuation">}</span></span>-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_PORT_http<span class="token punctuation">}</span></span>"</span>
        <span class="token property">JAVA_HOME</span> <span class="token punctuation">=</span> <span class="token string">"/usr/lib/jvm/java-11-openjdk-amd64"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> local.tomcat_download_url
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/local"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> local.souter_release_url
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/local"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> local.war_download_url
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/local/webapps"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
<span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
&lt;?xml version="1.0" encoding="UTF-8"?>
&lt;Server port="${port.stop}" shutdown="SHUTDOWN">
    &lt;Listener className="org.apache.catalina.startup.VersionLoggerListener"/>
    &lt;Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on"/>
    &lt;Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener"/>
    &lt;Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener"/>
    &lt;Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener"/>
    &lt;GlobalNamingResources>
        &lt;Resource name="UserDatabase" auth="Container" type="org.apache.catalina.UserDatabase" description="User database that can be updated and saved" factory="org.apache.catalina.users.MemoryUserDatabaseFactory" pathname="conf/tomcat-users.xml"/>
    &lt;/GlobalNamingResources>
    &lt;Service name="Catalina">
        &lt;Connector port="${port.http}" protocol="HTTP/1.1" connectionTimeout="20000"/>
        &lt;Engine name="Catalina" defaultHost="localhost">
            &lt;Realm className="org.apache.catalina.realm.LockOutRealm">
                &lt;Realm className="org.apache.catalina.realm.UserDatabaseRealm" resourceName="UserDatabase"/>
            &lt;/Realm>
            &lt;Host name="localhost" appBase="${default.context}/webapps/" unpackWARs="true" autoDeploy="true">
                &lt;Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs" prefix="localhost_access_log" suffix=".txt" pattern="%h %l %u %t &amp;quot;%r&amp;quot; %s %b"/>
            &lt;/Host>
        &lt;/Engine>
    &lt;/Service>
&lt;/Server>
EOF</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/conf/server.xml"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
<span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
{{ range service "scouter-collector" }}
net_collector_ip={{ .Address }}
net_collector_udp_port={{ .Port }}
net_collector_tcp_port={{ .Port }}
{{ end }}
#hook_method_patterns=sample.mybiz.*Biz.*,sample.service.*Service.*
#trace_http_client_ip_header_key=X-Forwarded-For
#profile_spring_controller_method_parameter_enabled=false
#hook_exception_class_patterns=my.exception.TypedException
#profile_fullstack_hooked_exception_enabled=true
#hook_exception_handler_method_patterns=my.AbstractAPIController.fallbackHandler,my.ApiExceptionLoggingFilter.handleNotFoundErrorResponse
#hook_exception_hanlder_exclude_class_patterns=exception.BizException
EOF</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/conf/scouter.conf"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>CATALINA_HOME<span class="token punctuation">}</span></span>/bin/catalina.sh"</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"run"</span>, <span class="token string">"-config"</span>, <span class="token string">"$NOMAD_TASK_DIR/conf/server.xml"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"tomcat-scouter"</span>
        <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"tomcat"</span><span class="token punctuation">]</span>

        <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>

        <span class="token keyword">check</span> <span class="token punctuation">{</span>
          <span class="token property">type</span>  <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
          <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
          <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
          <span class="token property">port</span>  <span class="token punctuation">=</span> <span class="token string">"http"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"tomcat-scouter"</span>
        <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"jmx"</span><span class="token punctuation">]</span>
        <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"jmx"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


