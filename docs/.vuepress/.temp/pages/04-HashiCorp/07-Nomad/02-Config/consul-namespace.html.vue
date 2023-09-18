<template><div><h1 id="consul-namespace-사용시-nomad의-서비스-등록" tabindex="-1"><a class="header-anchor" href="#consul-namespace-사용시-nomad의-서비스-등록" aria-hidden="true">#</a> Consul namespace 사용시 Nomad의 서비스 등록</h1>
<h2 id="job의-consul-namespace-정의" tabindex="-1"><a class="header-anchor" href="#job의-consul-namespace-정의" aria-hidden="true">#</a> Job의 Consul Namespace 정의</h2>
<p>Consul Enterprise는 <code v-pre>Namespace</code>가 있어서 Nomad로 Consul에 서비스 등록 시 특정 Namespace를 지정할 수 있음</p>
<p>Job &gt; Group &gt; Consul</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code>job <span class="token string">"frontback_job"</span> <span class="token punctuation">{</span>
  group <span class="token string">"backend_group_v1"</span> <span class="token punctuation">{</span>

    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">consul</span> <span class="token punctuation">{</span>
      <span class="token property">namespace</span> <span class="token punctuation">=</span> <span class="token string">"mynamespace"</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"backend"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>

      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">sidecar_service</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">check</span> <span class="token punctuation">{</span>
        <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"http"</span>
        <span class="token property">path</span>     <span class="token punctuation">=</span> <span class="token string">"/"</span>
        <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"5s"</span>
        <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"3s"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token comment"># 생략</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="service-mesh-upstream" tabindex="-1"><a class="header-anchor" href="#service-mesh-upstream" aria-hidden="true">#</a> Service Mesh Upstream</h2>
<p>해당 <code v-pre>group</code>에 대한 글로벌 설정이기 때문에 Consul과 관련해서 구성되는 모든 설정은 해당 <code v-pre>Namespace</code>를 기준으로 적용됨<br>
예를 들어 <code v-pre>upstream</code> 구성을 하면</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code>job <span class="token string">"frontback_job"</span> <span class="token punctuation">{</span>
  group <span class="token string">"frontend_group"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">consul</span> <span class="token punctuation">{</span>
      <span class="token property">namespace</span> <span class="token punctuation">=</span> <span class="token string">"mesh"</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"frontend"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>

      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">sidecar_service</span> <span class="token punctuation">{</span>
          <span class="token keyword">proxy</span> <span class="token punctuation">{</span>
            <span class="token keyword">upstreams</span> <span class="token punctuation">{</span>
              <span class="token property">destination_name</span> <span class="token punctuation">=</span> <span class="token string">"backend"</span>
              <span class="token property">local_bind_port</span>  <span class="token punctuation">=</span> <span class="token number">10000</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
<span class="token comment"># 생략</span>
</code></pre><div class="highlight-lines"><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>sidecar의 로그에서도 적용된 namespace로 리스너가 등록되는 로그(<code v-pre>namesapce/servicename</code>) 확인 가능</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>[2021-09-01 01:31:10.490][1][info][upstream] [source/common/upstream/cds_api_helper.cc:28] cds: add 3 cluster(s), remove 0 cluster(s)
[2021-09-01 01:31:10.572][1][info][upstream] [source/common/upstream/cds_api_helper.cc:65] cds: added/updated 3 cluster(s), skipped 0 unmodified cluster(s)
[2021-09-01 01:31:10.572][1][info][upstream] [source/common/upstream/cluster_manager_impl.cc:168] cm init: initializing secondary clusters
[2021-09-01 01:31:10.574][1][info][upstream] [source/common/upstream/cluster_manager_impl.cc:192] cm init: all clusters initialized
[2021-09-01 01:31:10.574][1][info][main] [source/server/server.cc:745] all clusters initialized. initializing init manager
[2021-09-01 01:31:10.578][1][info][upstream] [source/server/lds_api.cc:78] lds: add/update listener 'mesh/backend:127.0.0.1:10000'
[2021-09-01 01:31:10.586][1][info][upstream] [source/server/lds_api.cc:78] lds: add/update listener 'public_listener:0.0.0.0:24945'
[2021-09-01 01:31:10.587][1][info][config] [source/server/listener_manager_impl.cc:888] all dependencies initialized. starting workers
[2021-09-01 01:46:10.592][1][info][main] [source/server/drain_manager_impl.cc:70] shutting down parent after drain
</code></pre><div class="highlight-lines"><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="dns-쿼리" tabindex="-1"><a class="header-anchor" href="#dns-쿼리" aria-hidden="true">#</a> DNS 쿼리</h2>
<div class="hint-container warning">
<p class="hint-container-title">경고</p>
<p>주의할점은 DNS를 사용하는 경우, 예를들어 template 작성시 namespace가 추가되면 경로상 datacenter도 정의해줘야 인식하는 것으로 보임</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>[tag.]&lt;service>.service.&lt;namespace>.&lt;datacenter>.&lt;domain>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>참고 링크 : <a href="https://www.consul.io/docs/discovery/dns#namespaced-services" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/discovery/dns#namespaced-services<ExternalLinkIcon/></a></p>
</div>
<p><strong>기존 템플릿</strong></p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code><span class="token keyword">template</span> <span class="token punctuation">{</span>
  <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
defaults
   mode http

frontend http_front
   bind *:28888
   default_backend http_back

backend http_back
    balance roundrobin
    server-template mywebapp 2 _frontend._tcp.service.consul resolvers consul resolve-opts allow-dup-ip resolve-prefer ipv4 check

resolvers consul
  nameserver consul 127.0.0.1:8600
  accepted_payload_size 8192
  hold valid 5s
EOF</span>

  <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/haproxy.cfg"</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Namespace 적용 템플릿</strong></p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code><span class="token keyword">template</span> <span class="token punctuation">{</span>
  <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
defaults
   mode http

frontend http_front
   bind *:28888
   default_backend http_back

backend http_back
    balance roundrobin
    server-template mywebapp 2 _frontend._tcp.service.mesh.hashistack.consul resolvers consul resolve-opts allow-dup-ip resolve-prefer ipv4 check

resolvers consul
  nameserver consul 127.0.0.1:8600
  accepted_payload_size 8192
  hold valid 5s
EOF</span>

  <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/haproxy.cfg"</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details class="hint-container details"><summary>Full Example (mesh.nomad)</summary>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># nomad namespace apply -description "ServiceMesh Sample" mesh</span>

<span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">mode</span>     <span class="token punctuation">=</span> <span class="token string">"Legacy"</span>
  <span class="token property">namespace</span> <span class="token punctuation">=</span> <span class="token string">"mesh"</span>
  <span class="token comment">#artifact = "https://hashicorpjp.s3.ap-northeast-1.amazonaws.com/masa/Snapshots2021Jan_Nomad/frontback.tgz"</span>
  <span class="token property">artifact</span> <span class="token punctuation">=</span> <span class="token string">"https://github.com/Great-Stone/Snapshots_2021Jan_Pseudo-containerized/raw/main/frontback.tgz"</span>
  <span class="token property">node</span> <span class="token punctuation">=</span> <span class="token string">"https://github.com/Great-Stone/Snapshots_2021Jan_Pseudo-containerized/raw/main/nodejs-linux"</span>
  <span class="token property">subject</span>    <span class="token punctuation">=</span> <span class="token string">"snapshot"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variables</span> <span class="token punctuation">{</span>
  <span class="token property">frontend_port</span> <span class="token punctuation">=</span> <span class="token number">8080</span>
  <span class="token property">upstream_port</span> <span class="token punctuation">=</span> <span class="token number">10000</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "attrib_v1" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> object(<span class="token punctuation">{</span>
    <span class="token property">version</span>    <span class="token punctuation">=</span> string
    <span class="token property">task_count</span> <span class="token punctuation">=</span> number
    <span class="token property">text_color</span> <span class="token punctuation">=</span> string
  <span class="token punctuation">}</span>)
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">version</span>    <span class="token punctuation">=</span> <span class="token string">"v1"</span>
    <span class="token property">task_count</span> <span class="token punctuation">=</span> <span class="token number">1</span>
    <span class="token property">text_color</span> <span class="token punctuation">=</span> <span class="token string">"green"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "attrib_v2" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> object(<span class="token punctuation">{</span>
    <span class="token property">version</span>    <span class="token punctuation">=</span> string
    <span class="token property">task_count</span> <span class="token punctuation">=</span> number
    <span class="token property">text_color</span> <span class="token punctuation">=</span> string
  <span class="token punctuation">}</span>)
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">version</span>    <span class="token punctuation">=</span> <span class="token string">"v2"</span>
    <span class="token property">task_count</span> <span class="token punctuation">=</span> <span class="token number">1</span>
    <span class="token property">text_color</span> <span class="token punctuation">=</span> <span class="token string">"red"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

job <span class="token string">"frontback_job"</span> <span class="token punctuation">{</span>

  <span class="token property">region</span> <span class="token punctuation">=</span> <span class="token string">"global"</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"hashistack"</span><span class="token punctuation">]</span>
  <span class="token property">namespace</span> <span class="token punctuation">=</span> local.namespace

  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>

  <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
    <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>meta<span class="token punctuation">.</span>subject<span class="token punctuation">}</span></span>"</span>
    <span class="token property">value</span>     <span class="token punctuation">=</span> local.subject
  <span class="token punctuation">}</span>

  <span class="token comment">#######################</span>
  <span class="token comment">#                     #</span>
  <span class="token comment">#      Backend v1     #</span>
  <span class="token comment">#                     #</span>
  <span class="token comment">#######################</span>

  group <span class="token string">"backend_group_v1"</span> <span class="token punctuation">{</span>

    <span class="token property">count</span> <span class="token punctuation">=</span> var.attrib_v1<span class="token punctuation">[</span><span class="token string">"task_count"</span><span class="token punctuation">]</span>

    <span class="token keyword">consul</span> <span class="token punctuation">{</span>
      <span class="token property">namespace</span> <span class="token punctuation">=</span> local.namespace
    <span class="token punctuation">}</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"bridge"</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"backend"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>

      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">sidecar_service</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">meta</span> <span class="token punctuation">{</span>
        <span class="token property">version</span> <span class="token punctuation">=</span> var.attrib_v1<span class="token punctuation">[</span><span class="token string">"version"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">check</span> <span class="token punctuation">{</span>
        <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"http"</span>
        <span class="token property">path</span>     <span class="token punctuation">=</span> <span class="token string">"/"</span>
        <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"5s"</span>
        <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"3s"</span>
      <span class="token punctuation">}</span>

      <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
        <span class="token string">"Snapshots"</span>,
        <span class="token string">"Backend"</span>,
        local.mode,
        var.attrib_v1<span class="token punctuation">[</span><span class="token string">"version"</span><span class="token punctuation">]</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"backend"</span> <span class="token punctuation">{</span>

      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"exec"</span>

      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> local.artifact
      <span class="token punctuation">}</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">COLOR</span>   <span class="token punctuation">=</span> var.attrib_v1<span class="token punctuation">[</span><span class="token string">"text_color"</span><span class="token punctuation">]</span>
        <span class="token property">MODE</span>    <span class="token punctuation">=</span> local.mode
        <span class="token property">TASK_ID</span> <span class="token punctuation">=</span> NOMAD_ALLOC_INDEX
        <span class="token property">ADDR</span>    <span class="token punctuation">=</span> NOMAD_ADDR_http
        <span class="token property">PORT</span>    <span class="token punctuation">=</span> NOMAD_PORT_http
        <span class="token property">VERSION</span> <span class="token punctuation">=</span> var.attrib_v1<span class="token punctuation">[</span><span class="token string">"version"</span><span class="token punctuation">]</span>
        <span class="token comment"># IMG_SRC		= "${local.img_dir}${var.attrib_v1["version"]}.png"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"backend"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">32</span>  <span class="token comment"># reserve 32 MB</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">100</span> <span class="token comment"># reserve 100 MHz</span>
      <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">reschedule</span> <span class="token punctuation">{</span>
      <span class="token property">delay</span>          <span class="token punctuation">=</span> <span class="token string">"10s"</span>
      <span class="token property">delay_function</span> <span class="token punctuation">=</span> <span class="token string">"constant"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token comment">#######################</span>
  <span class="token comment">#                     #</span>
  <span class="token comment">#      Backend v2     #</span>
  <span class="token comment">#                     #</span>
  <span class="token comment">#######################</span>

  group <span class="token string">"backend_group_v2"</span> <span class="token punctuation">{</span>

    <span class="token property">count</span> <span class="token punctuation">=</span> var.attrib_v2<span class="token punctuation">[</span><span class="token string">"task_count"</span><span class="token punctuation">]</span>

    <span class="token keyword">consul</span> <span class="token punctuation">{</span>
      <span class="token property">namespace</span> <span class="token punctuation">=</span> local.namespace
    <span class="token punctuation">}</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"bridge"</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"backend"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>

      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">sidecar_service</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">meta</span> <span class="token punctuation">{</span>
        <span class="token property">version</span> <span class="token punctuation">=</span> var.attrib_v2<span class="token punctuation">[</span><span class="token string">"version"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">check</span> <span class="token punctuation">{</span>
        <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"http"</span>
        <span class="token property">path</span>     <span class="token punctuation">=</span> <span class="token string">"/"</span>
        <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"5s"</span>
        <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"3s"</span>
      <span class="token punctuation">}</span>

      <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
        <span class="token string">"Snapshots"</span>,
        <span class="token string">"Backend"</span>,
        local.mode,
        var.attrib_v2<span class="token punctuation">[</span><span class="token string">"version"</span><span class="token punctuation">]</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"backend"</span> <span class="token punctuation">{</span>

      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"exec"</span>

      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> local.artifact
      <span class="token punctuation">}</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">COLOR</span>   <span class="token punctuation">=</span> var.attrib_v2<span class="token punctuation">[</span><span class="token string">"text_color"</span><span class="token punctuation">]</span>
        <span class="token property">MODE</span>    <span class="token punctuation">=</span> local.mode
        <span class="token property">TASK_ID</span> <span class="token punctuation">=</span> NOMAD_ALLOC_INDEX
        <span class="token property">ADDR</span>    <span class="token punctuation">=</span> NOMAD_ADDR_http
        <span class="token property">PORT</span>    <span class="token punctuation">=</span> NOMAD_PORT_http
        <span class="token property">VERSION</span> <span class="token punctuation">=</span> var.attrib_v2<span class="token punctuation">[</span><span class="token string">"version"</span><span class="token punctuation">]</span>
        <span class="token comment"># IMG_SRC		= "${local.img_dir}${var.attrib_v2["version"]}.png"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"backend"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">32</span>  <span class="token comment"># reserve 32 MB</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">100</span> <span class="token comment"># reserve 100 MHz</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">reschedule</span> <span class="token punctuation">{</span>
      <span class="token property">delay</span>          <span class="token punctuation">=</span> <span class="token string">"10s"</span>
      <span class="token property">delay_function</span> <span class="token punctuation">=</span> <span class="token string">"constant"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token comment">######################</span>
  <span class="token comment">#                    #</span>
  <span class="token comment">#      Frontend      #</span>
  <span class="token comment">#                    #</span>
  <span class="token comment">######################</span>

  group <span class="token string">"frontend_group"</span> <span class="token punctuation">{</span>

    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">consul</span> <span class="token punctuation">{</span>
      <span class="token property">namespace</span> <span class="token punctuation">=</span> local.namespace
    <span class="token punctuation">}</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"bridge"</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token comment">// static = var.frontend_port</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"frontend"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>

      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">sidecar_service</span> <span class="token punctuation">{</span>
          <span class="token keyword">proxy</span> <span class="token punctuation">{</span>
            <span class="token keyword">upstreams</span> <span class="token punctuation">{</span>
              <span class="token property">destination_name</span> <span class="token punctuation">=</span> <span class="token string">"backend"</span>
              <span class="token property">local_bind_port</span>  <span class="token punctuation">=</span> var.upstream_port
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

			<span class="token comment">// check {</span>
			<span class="token comment">// 	type     = "http"</span>
			<span class="token comment">// 	path     = "/"</span>
			<span class="token comment">// 	interval = "5s"</span>
			<span class="token comment">// 	timeout  = "3s"</span>
			<span class="token comment">// }</span>

      <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
        local.mode,
        <span class="token string">"Snapshots"</span>,
        <span class="token string">"Frontend"</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"frontend"</span> <span class="token punctuation">{</span>

      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"exec"</span>

      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> local.node
      <span class="token punctuation">}</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">PORT</span>         <span class="token punctuation">=</span> NOMAD_PORT_http
        <span class="token property">UPSTREAM_URL</span> <span class="token punctuation">=</span> <span class="token string">"http://<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_UPSTREAM_ADDR_backend<span class="token punctuation">}</span></span>"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"nodejs-linux"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">32</span>  <span class="token comment"># reserve 32 MB</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">100</span> <span class="token comment"># reserve 100 MHz</span>
      <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">reschedule</span> <span class="token punctuation">{</span>
      <span class="token property">delay</span>          <span class="token punctuation">=</span> <span class="token string">"10s"</span>
      <span class="token property">delay_function</span> <span class="token punctuation">=</span> <span class="token string">"constant"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token comment">######################</span>
  <span class="token comment">#                    #</span>
  <span class="token comment">#      haproxy      #</span>
  <span class="token comment">#                    #</span>
  <span class="token comment">######################</span>

  group <span class="token string">"haproxy"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">consul</span> <span class="token punctuation">{</span>
      <span class="token property">namespace</span> <span class="token punctuation">=</span> local.namespace
    <span class="token punctuation">}</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">28888</span>
      <span class="token punctuation">}</span>

      port <span class="token string">"stats"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">21936</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"haproxy"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span>        <span class="token punctuation">=</span> <span class="token string">"haproxy:2.0"</span>
        <span class="token property">network_mode</span> <span class="token punctuation">=</span> <span class="token string">"host"</span>

        <span class="token property">volumes</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"local/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg"</span>,
        <span class="token punctuation">]</span>

        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"http"</span>, <span class="token string">"stats"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
defaults
   mode http

frontend stats
   bind *:21936
   stats uri /
   stats show-legends
   no log

frontend http_front
   bind *:28888
   default_backend http_back

backend http_back
    balance roundrobin
    server-template mywebapp 2 _frontend._tcp.service.mesh.hashistack.consul resolvers consul resolve-opts allow-dup-ip resolve-prefer ipv4 check

resolvers consul
  nameserver consul 127.0.0.1:8600
  accepted_payload_size 8192
  hold valid 5s
EOF</span>

        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/haproxy.cfg"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"haproxy"</span>

        <span class="token keyword">check</span> <span class="token punctuation">{</span>
          <span class="token property">name</span>     <span class="token punctuation">=</span> <span class="token string">"alive"</span>
          <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
          <span class="token property">port</span>     <span class="token punctuation">=</span> <span class="token string">"http"</span>
          <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
          <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">200</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">128</span>

        <span class="token keyword">network</span> <span class="token punctuation">{</span>
          <span class="token property">mbits</span> <span class="token punctuation">=</span> <span class="token number">10</span>

          <span class="token comment">// port "http" {</span>
          <span class="token comment">//   static = 28888</span>
          <span class="token comment">//   to = 8888</span>
          <span class="token comment">// }</span>

          <span class="token comment">// port "stats" {</span>
          <span class="token comment">//   static = 21936</span>
          <span class="token comment">//   to = 1936</span>
          <span class="token comment">// }</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
</div></template>


