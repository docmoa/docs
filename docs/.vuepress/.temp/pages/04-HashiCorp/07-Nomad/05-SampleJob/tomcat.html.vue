<template><div><h1 id="tomcat" tabindex="-1"><a class="header-anchor" href="#tomcat" aria-hidden="true">#</a> Tomcat</h1>
<ul>
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
</ul>
<iframe width="560" height="315" src="https://www.youtube.com/embed/UvB_Zi6Plbc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variables</span> <span class="token punctuation">{</span>
  <span class="token property">tomcat_download_url</span> <span class="token punctuation">=</span> <span class="token string">"https://archive.apache.org/dist/tomcat/tomcat-10/v10.0.10/bin/apache-tomcat-10.0.10.tar.gz"</span>
  <span class="token comment">// https://tomcat.apache.org/tomcat-10.0-doc/appdev/sample/</span>
  <span class="token property">war_download_url</span> <span class="token punctuation">=</span> <span class="token string">"https://tomcat.apache.org/tomcat-10.0-doc/appdev/sample/sample.war"</span>
<span class="token punctuation">}</span>

job <span class="token string">"tomcat-10"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token comment"># namespace = "legacy"</span>

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
        <span class="token punctuation">}</span>
        <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">500</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">512</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">APP_VERSION</span> <span class="token punctuation">=</span> <span class="token string">"0.1"</span>
        <span class="token property">CATALINA_HOME</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_TASK_DIR<span class="token punctuation">}</span></span>/apache-tomcat-10.0.10"</span>
        <span class="token property">CATALINA_OPTS</span> <span class="token punctuation">=</span> <span class="token string">"-Dport.http=$NOMAD_PORT_http -Dport.stop=$NOMAD_PORT_stop -Ddefault.context=$NOMAD_TASK_DIR -Xms256m -Xmx512m"</span>
        <span class="token property">JAVA_HOME</span> <span class="token punctuation">=</span> <span class="token string">"/usr/lib/jvm/java-11-openjdk-amd64"</span>
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
      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> var.tomcat_download_url
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/local"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> var.war_download_url
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/local/webapps"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>CATALINA_HOME<span class="token punctuation">}</span></span>/bin/catalina.sh"</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"run"</span>, <span class="token string">"-config"</span>, <span class="token string">"$NOMAD_TASK_DIR/conf/server.xml"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"legacy-tomcat"</span>
        <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"tomcat"</span><span class="token punctuation">]</span>

        <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>

        <span class="token keyword">check</span> <span class="token punctuation">{</span>
          <span class="token property">type</span>  <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
          <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
          <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
          <span class="token property">port</span>  <span class="token punctuation">=</span> <span class="token string">"http"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nginx" tabindex="-1"><a class="header-anchor" href="#nginx" aria-hidden="true">#</a> nginx</h2>
<p>Consul과 함께 구성된 경우 nginx에 동적으로 backend 구성</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"nginx"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token comment"># namespace = "legacy"</span>

  group <span class="token string">"nginx"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">28080</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"nginx"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"nginx"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"nginx"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"http"</span><span class="token punctuation">]</span>
        <span class="token property">volumes</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"local:/etc/nginx/conf.d"</span>,
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
upstream backend {
{{ range service "legacy-tomcat" }}
  server {{ .Address }}:{{ .Port }}; # Tomcat
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}

server {
   listen {{ env "NOMAD_PORT_http" }};

   location /sample {
      proxy_pass http://backend;
   }

   location /status {
       stub_status on;
   }
}
EOF</span>

        <span class="token property">destination</span>   <span class="token punctuation">=</span> <span class="token string">"local/load-balancer.conf"</span>
        <span class="token property">change_mode</span>   <span class="token punctuation">=</span> <span class="token string">"signal"</span>
        <span class="token property">change_signal</span> <span class="token punctuation">=</span> <span class="token string">"SIGHUP"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


