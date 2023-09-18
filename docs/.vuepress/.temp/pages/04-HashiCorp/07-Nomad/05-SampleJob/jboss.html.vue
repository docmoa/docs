<template><div><h1 id="wildfly-jboss" tabindex="-1"><a class="header-anchor" href="#wildfly-jboss" aria-hidden="true">#</a> Wildfly(Jboss)</h1>
<blockquote>
<p>image info : <a href="https://quay.io/repository/wildfly/wildfly?tab=info" target="_blank" rel="noopener noreferrer">https://quay.io/repository/wildfly/wildfly?tab=info<ExternalLinkIcon/></a><br>
github : <a href="https://github.com/jboss-dockerfiles/wildfly" target="_blank" rel="noopener noreferrer">https://github.com/jboss-dockerfiles/wildfly<ExternalLinkIcon/></a><br>
wildfly docker example : <a href="http://www.mastertheboss.com/soa-cloud/docker/deploying-applications-on-your-docker-wildfly-image/" target="_blank" rel="noopener noreferrer">http://www.mastertheboss.com/soa-cloud/docker/deploying-applications-on-your-docker-wildfly-image/<ExternalLinkIcon/></a></p>
</blockquote>
<p>Wildfly 이미지를 베이스로 기존 Dockerfile을 작성하여 빌드 후 컨테이너를 기준으로 배포하는 것도 가능하지만, 베이스 이미지를 유지한 채로 애플리케이션(war)을 바인드하여 실행하는 것도 가능하다.</p>
<h2 id="dockerfile과-비교" tabindex="-1"><a class="header-anchor" href="#dockerfile과-비교" aria-hidden="true">#</a> Dockerfile과 비교</h2>
<ul>
<li>
<p>dockerfile 의 예</p>
<div class="language-docker line-numbers-mode" data-ext="docker"><pre v-pre class="language-docker"><code><span class="token instruction"><span class="token keyword">FROM</span> jboss/wildfly</span>
<span class="token instruction"><span class="token keyword">RUN</span> /opt/jboss/wildfly/bin/add-user.sh admin admin --silent</span>
<span class="token instruction"><span class="token keyword">ADD</span> jboss-as-helloworld.war /opt/jboss/wildfly/standalone/deployments/</span>
<span class="token instruction"><span class="token keyword">CMD</span> [<span class="token string">"/opt/jboss/wildfly/bin/standalone.sh"</span>, <span class="token string">"-b"</span>, <span class="token string">"0.0.0.0"</span>, <span class="token string">"-bmanagement"</span>, <span class="token string">"0.0.0.0"</span>]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>FROM</code>은 Nomad가 실행시킬 이미지로 지정</li>
<li><code v-pre>RUN</code> 절의 <code v-pre>add-user.sh</code>는 <code v-pre>mgmt-users.properties</code>를 생성하고자 하는 목적이므로 Nomad의 <code v-pre>artifact</code>로 중앙레포에서 받거나 <code v-pre>template</code>으로 작성하여 바인딩 가능</li>
<li><code v-pre>ADD</code> 절은 WAR파일을 추가하는 것으로 호스트의 파일 또는 <code v-pre>artifact</code>로 중앙레포에서 받아 바인딩</li>
<li><code v-pre>CMD</code> 절은 기본 실행명령을 대체하는 것으로 Nomad에서 <code v-pre>command</code>와 <code v-pre>args</code>로 대체 가능</li>
</ul>
</li>
<li>
<p>job &gt; groups &gt; task(docker) &gt; artifact :<br>
WAR 파일을 다운로드 받아 준비</p>
<div class="hint-container warning">
<p class="hint-container-title">참고</p>
<p>Nomad 클라이언트 호스트에 미리 파일을 두는것도 가능하나 오케스트레이션 특성상 중랑 레포기능을 하는곳에서 배포시 다운받는 방식이 확장성 측면에서 고려되어야 함</p>
</div>
</li>
<li>
<p>job &gt; groups &gt; task(docker) &gt; template :</p>
<ul>
<li><code v-pre>add-user.sh</code>를 통해 management 콘솔의 사용자를 생성해야 하지만 미리 생성된 내용(admin/admin)을 넣어 처리</li>
<li>다른 사용자를 생성하고자 한다면 설치된 wildfly나 docker로 실행한 wildfly에서 다음 스크립트로 생성된 파일 내용 확인하여 template의 data로 처리<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># example (admin/admin)</span>
/opt/jboss/wildfly/bin/add-user.sh admin admin <span class="token parameter variable">--silent</span>
<span class="token function">cat</span> /opt/jboss/wildfly/standalone/configuration/mgmt-users.properties
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token assign-left variable">admin</span><span class="token operator">=</span>c22052286cd5d72239a90fe193737253
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p>job &gt; groups &gt; task(docker) &gt; config &gt; mount :</p>
<ul>
<li>다운받은 WAR 파일과 <code v-pre>mgmt-users.properties</code>를 컨테이너에 바인딩</li>
<li>Nomad가 Host 내부적으로 별도 루트경로를 할당받으므로, 각 파일과 구성파일은 독립적으로 위치함</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p><code v-pre>volumes</code>로 처리하는것도 가능 <a href="https://www.nomadproject.io/docs/drivers/docker#volumes" target="_blank" rel="noopener noreferrer">https://www.nomadproject.io/docs/drivers/docker#volumes<ExternalLinkIcon/></a></p>
</div>
</li>
<li>
<p>job &gt; groups &gt; task(docker) &gt; config &gt; args :<br>
management가 기본 <code v-pre>127.0.0.1</code>이므로 포트포워딩으로 접속이 불가하므로 <code v-pre>0.0.0.0</code>으로 변경</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"/opt/jboss/wildfly/bin/standalone.sh"</span>, <span class="token string">"-b"</span>, <span class="token string">"0.0.0.0"</span>, <span class="token string">"-bmanagement"</span>, <span class="token string">"0.0.0.0"</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>조금더 명확하게는 <code v-pre>command</code> 에 <code v-pre>&quot;/opt/jboss/wildfly/bin/standalone.sh&quot;</code>를 구성하고 args를 분리하는 것도 가능</p>
</div>
</li>
</ul>
<h2 id="sample-job" tabindex="-1"><a class="header-anchor" href="#sample-job" aria-hidden="true">#</a> Sample Job</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">WAR_URL</span> <span class="token punctuation">=</span> <span class="token string">"https://github.com/spagop/quickstart/raw/master/management-api-examples/mgmt-deploy-application/application/jboss-as-helloworld.war"</span>
  <span class="token property">WAR_DEST</span> <span class="token punctuation">=</span> <span class="token string">"local/deployments/jboss-as-helloworld.war"</span>
<span class="token punctuation">}</span>

job <span class="token string">"jboss"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  group <span class="token string">"jboss"</span> <span class="token punctuation">{</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token string">"8080"</span>
      <span class="token punctuation">}</span>
      port <span class="token string">"mgmt"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token string">"9990"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">### csi (nfs) </span>
    <span class="token comment"># volume "nfs-vol" {</span>
    <span class="token comment">#   type            = "csi"</span>
    <span class="token comment">#   source          = "nfs-vol"</span>
    <span class="token comment">#   read_only       = false</span>
    <span class="token comment">#   attachment_mode = "file-system"</span>
    <span class="token comment">#   access_mode     = "single-node-writer"</span>
    <span class="token comment">#   #per_alloc       = true</span>
    <span class="token comment"># }</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"jboss-http"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>

      <span class="token keyword">check</span> <span class="token punctuation">{</span>
        <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
        <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
        <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"http"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"jboss/wildfly"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"http"</span>, <span class="token string">"mgmt"</span><span class="token punctuation">]</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"/opt/jboss/wildfly/bin/standalone.sh"</span>, <span class="token string">"-b"</span>, <span class="token string">"0.0.0.0"</span>, <span class="token string">"-bmanagement"</span>, <span class="token string">"0.0.0.0"</span><span class="token punctuation">]</span>
        <span class="token keyword">mount</span> <span class="token punctuation">{</span>
          <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"bind"</span>
          <span class="token property">target</span> <span class="token punctuation">=</span> <span class="token string">"/opt/jboss/wildfly/standalone/deployments/jboss-as-helloworld.war"</span>
          <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"local/deployments/jboss-as-helloworld.war"</span>
          <span class="token property">readonly</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
          <span class="token keyword">bind_options</span> <span class="token punctuation">{</span>
            <span class="token property">propagation</span> <span class="token punctuation">=</span> <span class="token string">"rshared"</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">mount</span> <span class="token punctuation">{</span>
          <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"bind"</span>
          <span class="token property">target</span> <span class="token punctuation">=</span> <span class="token string">"/opt/jboss/wildfly/standalone/configuration/mgmt-users.properties"</span>
          <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"local/configuration/mgmt-users.properties"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span>      <span class="token punctuation">=</span> local.WAR_URL
        <span class="token property">destination</span> <span class="token punctuation">=</span> local.WAR_DEST
      <span class="token punctuation">}</span>
      
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token comment"># mgmt : admin / admin</span>
        <span class="token property">data</span>        <span class="token punctuation">=</span> <span class="token string">"admin=c22052286cd5d72239a90fe193737253"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/configuration/mgmt-users.properties"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">500</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">512</span>
      <span class="token punctuation">}</span>

      <span class="token comment">### csi (nfs) </span>
      <span class="token comment"># volume_mount {</span>
      <span class="token comment">#   volume      = "nfs-vol"</span>
      <span class="token comment">#   destination = "/csi"</span>
      <span class="token comment"># }</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">scaling</span>  <span class="token punctuation">{</span>
      <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token property">min</span>     <span class="token punctuation">=</span> <span class="token number">1</span>
      <span class="token property">max</span>     <span class="token punctuation">=</span> <span class="token number">4</span>

      <span class="token comment">### cpu autoscale</span>
      <span class="token comment"># policy {</span>
      <span class="token comment">#   evaluation_interval = "10s"</span>
      <span class="token comment">#   cooldown            = "1m"</span>
      <span class="token comment">#   driver = "nomad-apm"</span>
      <span class="token comment">#   check "mem_allocated_percentage" {</span>
      <span class="token comment">#     source = "nomad-apm"</span>
      <span class="token comment">#     query  = "avg_cpu" </span>
      <span class="token comment">#     strategy "target-value" {</span>
      <span class="token comment">#       target = 90</span>
      <span class="token comment">#     }</span>
      <span class="token comment">#   }</span>
      <span class="token comment"># }</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


