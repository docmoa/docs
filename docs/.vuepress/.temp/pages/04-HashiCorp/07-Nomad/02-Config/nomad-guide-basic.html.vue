<template><div><h1 id="nomad-guide-basic" tabindex="-1"><a class="header-anchor" href="#nomad-guide-basic" aria-hidden="true">#</a> Nomad Guide - Basic</h1>
<h2 id="download" tabindex="-1"><a class="header-anchor" href="#download" aria-hidden="true">#</a> Download</h2>
<ul>
<li>Release link : <a href="https://releases.hashicorp.com/nomad" target="_blank" rel="noopener noreferrer">https://releases.hashicorp.com/nomad<ExternalLinkIcon/></a></li>
<li>Version : 1.3.x</li>
<li>Platform 선택
<ul>
<li>darwin(= MAC)</li>
<li>Linux</li>
<li>Windows</li>
</ul>
</li>
</ul>
<h2 id="on-linux" tabindex="-1"><a class="header-anchor" href="#on-linux" aria-hidden="true">#</a> on Linux</h2>
<h3 id="구성-샘플" tabindex="-1"><a class="header-anchor" href="#구성-샘플" aria-hidden="true">#</a> 구성 샘플</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>└── hashicorp
    └── nomad
         ├── config
         └── data
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Donwload 받은 압축을 해제하고 기존 <code v-pre>$PATH</code> 위치에 복사 하거나 등록
<ul>
<li>e.g. utuntu : /usr/local/bin</li>
<li>e.g. centos : /usr/bin</li>
</ul>
</li>
</ul>
<h3 id="server-config" tabindex="-1"><a class="header-anchor" href="#server-config" aria-hidden="true">#</a> Server Config</h3>
<p>&lt;/hashicorp/nomad/config/nomad.hcl&gt;</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>datacenter <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"dc1"</span></span>
data_dir <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/hashicorp/nomad/data"</span></span>

bind_addr <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"0.0.0.0"</span></span>

advertise <span class="token punctuation">{</span>
  http <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"{{ GetInterfaceIP \"eth1\" }}"</span></span>
  rpc  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"{{ GetInterfaceIP \"eth1\" }}"</span></span>
  serf <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"{{ GetInterfaceIP \"eth1\" }}"</span></span>
<span class="token punctuation">}</span>

server <span class="token punctuation">{</span>
  enabled          <span class="token operator">=</span> <span class="token boolean">true</span>
  bootstrap_expect <span class="token operator">=</span> <span class="token number">1</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>advertise 에 지정된 http, rpc, serf 의 IP는 직접 IP를 입력하는 것도 가능</li>
<li>go-discover 형태인 구문을 활용하면 인터페이스 이름을 넣어서 자동 IP 입력 가능<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>{{ GetInterfaceIP \"eth1\" }}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="client-config" tabindex="-1"><a class="header-anchor" href="#client-config" aria-hidden="true">#</a> Client Config</h3>
<p><code v-pre>retry_join</code>에 Server의 주소 꼭 넣기!</p>
<p>&lt;/hashicorp/nomad/config/nomad.hcl&gt;</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>datacenter <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"dc1"</span></span>
data_dir <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/hashicorp/nomad/data"</span></span>

bind_addr <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"0.0.0.0"</span></span>

server <span class="token punctuation">{</span>
  enabled <span class="token operator">=</span> <span class="token boolean">false</span>
<span class="token punctuation">}</span>

server_join <span class="token punctuation">{</span>
  retry_join <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"&lt;server_ip>:4647"</span></span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

client <span class="token punctuation">{</span>
  enabled <span class="token operator">=</span> <span class="token boolean">true</span>
  servers <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"&lt;server_ip>:4647"</span></span><span class="token punctuation">]</span>
  meta <span class="token punctuation">{</span>
    <span class="token string-literal"><span class="token string">"key1"</span></span> <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"value1"</span></span>
    <span class="token string-literal"><span class="token string">"key2"</span></span> <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"value2"</span></span>
  <span class="token punctuation">}</span>
  options <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token string-literal"><span class="token string">"driver.raw_exec.enable"</span></span> <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"1"</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="systemctl-서비스-등록" tabindex="-1"><a class="header-anchor" href="#systemctl-서비스-등록" aria-hidden="true">#</a> Systemctl 서비스 등록</h3>
<blockquote>
<p><a href="https://learn.hashicorp.com/tutorials/nomad/production-deployment-guide-vm-with-consul" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/nomad/production-deployment-guide-vm-with-consul<ExternalLinkIcon/></a></p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">touch</span> /etc/systemd/system/nomad.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>ExecStart</code>의 nomad 바이너리 경로에 주의!!!</li>
<li><code v-pre>ExecStart</code>의 <code v-pre>-config</code> 에 앞서 작성한 config 파일 디렉토리 경로 맞추기!!!</li>
<li>서버의 경우 User/Group을 일반 사용자로 구성</li>
<li>클라이언트(워커 노드)는 User/Group을 root로 구성</li>
</ul>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Unit</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">Description</span><span class="token punctuation">=</span><span class="token value attr-value">Nomad</span>
<span class="token key attr-name">Documentation</span><span class="token punctuation">=</span><span class="token value attr-value">https://www.nomadproject.io/docs/</span>
<span class="token key attr-name">Wants</span><span class="token punctuation">=</span><span class="token value attr-value">network-online.target</span>
<span class="token key attr-name">After</span><span class="token punctuation">=</span><span class="token value attr-value">network-online.target</span>

<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Service</span><span class="token punctuation">]</span></span>

<span class="token comment"># Nomad server should be run as the nomad user. Nomad clients</span>
<span class="token comment"># should be run as root</span>
<span class="token key attr-name">User</span><span class="token punctuation">=</span><span class="token value attr-value">nomad</span>
<span class="token key attr-name">Group</span><span class="token punctuation">=</span><span class="token value attr-value">nomad</span>

<span class="token key attr-name">ExecReload</span><span class="token punctuation">=</span><span class="token value attr-value">/bin/kill -HUP $MAINPID</span>
<span class="token key attr-name">ExecStart</span><span class="token punctuation">=</span><span class="token value attr-value">/usr/local/bin/nomad agent -config /etc/nomad.d</span>
<span class="token key attr-name">KillMode</span><span class="token punctuation">=</span><span class="token value attr-value">process</span>
<span class="token key attr-name">KillSignal</span><span class="token punctuation">=</span><span class="token value attr-value">SIGINT</span>
<span class="token key attr-name">LimitNOFILE</span><span class="token punctuation">=</span><span class="token value attr-value">65536</span>
<span class="token key attr-name">LimitNPROC</span><span class="token punctuation">=</span><span class="token value attr-value">infinity</span>
<span class="token key attr-name">Restart</span><span class="token punctuation">=</span><span class="token value attr-value">on-failure</span>
<span class="token key attr-name">RestartSec</span><span class="token punctuation">=</span><span class="token value attr-value">2</span>

<span class="token comment">## Configure unit start rate limiting. Units which are started more than</span>
<span class="token comment">## *burst* times within an *interval* time span are not permitted to start any</span>
<span class="token comment">## more. Use `StartLimitIntervalSec` or `StartLimitInterval` (depending on</span>
<span class="token comment">## systemd version) to configure the checking interval and `StartLimitBurst`</span>
<span class="token comment">## to configure how many starts per interval are allowed. The values in the</span>
<span class="token comment">## commented lines are defaults.</span>

<span class="token comment"># StartLimitBurst = 5</span>

<span class="token comment">## StartLimitIntervalSec is used for systemd versions >= 230</span>
<span class="token comment"># StartLimitIntervalSec = 10s</span>

<span class="token comment">## StartLimitInterval is used for systemd versions &lt; 230</span>
<span class="token comment"># StartLimitInterval = 10s</span>

<span class="token key attr-name">TasksMax</span><span class="token punctuation">=</span><span class="token value attr-value">infinity</span>
<span class="token key attr-name">OOMScoreAdjust</span><span class="token punctuation">=</span><span class="token value attr-value">-1000</span>

<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Install</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">WantedBy</span><span class="token punctuation">=</span><span class="token value attr-value">multi-user.target</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="실행-및-ui-확인" tabindex="-1"><a class="header-anchor" href="#실행-및-ui-확인" aria-hidden="true">#</a> 실행 및 UI 확인</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ systemctl start nomad
$ systemctl <span class="token builtin class-name">enable</span> nomad
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>UI 기본 포트 : 4646</li>
<li>http://&lt;server_ip&gt;:4646</li>
</ul>
<h2 id="job-실행" tabindex="-1"><a class="header-anchor" href="#job-실행" aria-hidden="true">#</a> Job 실행</h2>
<p>Job 실행은 CLI, API, UI 실행 가능</p>
<h3 id="cli" tabindex="-1"><a class="header-anchor" href="#cli" aria-hidden="true">#</a> CLI</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token assign-left variable">NOMAD_ADDR</span><span class="token operator">=</span>http://<span class="token operator">&lt;</span>server_ip<span class="token operator">></span>:4646
$ nomad job run <span class="token operator">&lt;</span>job_file_path<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ui" tabindex="-1"><a class="header-anchor" href="#ui" aria-hidden="true">#</a> UI</h3>
<ul>
<li><code v-pre>http://&lt;server_ip&gt;:4646</code> 에 접속</li>
<li>왼쪽 메뉴의 <code v-pre>WORKLOAD/Jobs</code> 선택</li>
<li>우측의 <code v-pre>Run Job</code> 버튼 클릭</li>
<li>Job 내용 입력 후 <code v-pre>Plan</code>, <code v-pre>Apply</code></li>
</ul>
<h2 id="job-sample" tabindex="-1"><a class="header-anchor" href="#job-sample" aria-hidden="true">#</a> Job Sample</h2>
<h3 id="batch-basic" tabindex="-1"><a class="header-anchor" href="#batch-basic" aria-hidden="true">#</a> batch - basic</h3>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"batch"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>
  
  type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"batch"</span></span>
  
  group <span class="token string-literal"><span class="token string">"batch-1"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>
    task <span class="token string-literal"><span class="token string">"batch"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"raw_exec"</span></span>
      template <span class="token punctuation">{</span>
        data <span class="token operator">=</span> <span class="token string-literal heredoc-string"><span class="token delimiter"><span class="token punctuation">&lt;&lt;</span><span class="token symbol">EOF</span></span><span class="token string">
#!/bin/bash
echo $(hostname) > /tmp/check.txt
</span><span class="token delimiter"><span class="token symbol">EOF</span></span></span>
        destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"run.sh"</span></span>
      <span class="token punctuation">}</span>
      config <span class="token punctuation">{</span>
        command <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"run.sh"</span></span>
      <span class="token punctuation">}</span>
      resources <span class="token punctuation">{</span>
        cpu    <span class="token operator">=</span> <span class="token number">100</span>
        memory <span class="token operator">=</span> <span class="token number">64</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    
    task <span class="token string-literal"><span class="token string">"batch-2"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"raw_exec"</span></span>
      artifact <span class="token punctuation">{</span>
        source <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"http://&lt;shared_ip>:&lt;port>/path/run.sh"</span></span>
        destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"local"</span></span>
      <span class="token punctuation">}</span>
      config <span class="token punctuation">{</span>
        command <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"local/run.sh"</span></span>
      <span class="token punctuation">}</span>
      resources <span class="token punctuation">{</span>
        cpu    <span class="token operator">=</span> <span class="token number">100</span>
        memory <span class="token operator">=</span> <span class="token number">64</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>driver</code>가 <code v-pre>raw_exec</code>이면 isolation 없이 스크립트를 실행하는 방식</li>
<li><code v-pre>template</code> 에서 작성하는 파일은 동적으로 생성되며 변수 조합도 가능</li>
<li><code v-pre>artifact</code>를 정의하여 중앙 저장소의 파일을 다운로드 받아 구성 가능</li>
<li>한번 정상 동작 후 Job은 종료됨(기록은 남으나 GC 후 최종적으로 삭제됨)</li>
</ul>
<h3 id="batch-periodic" tabindex="-1"><a class="header-anchor" href="#batch-periodic" aria-hidden="true">#</a> batch - periodic</h3>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"periodic"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>
  
  type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"batch"</span></span>

  periodic <span class="token punctuation">{</span>
    cron             <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*/5 * * * * * *"</span></span>
    prohibit_overlap <span class="token operator">=</span> <span class="token boolean">true</span>
    time_zone        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Asia/Seoul"</span></span>
  <span class="token punctuation">}</span>

  constraint <span class="token punctuation">{</span>
    attribute <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${attr.unique.hostname}"</span></span>
    value     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"cn-client-2"</span></span>
  <span class="token punctuation">}</span>

  group <span class="token string-literal"><span class="token string">"batch"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>
    task <span class="token string-literal"><span class="token string">"batch"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"raw_exec"</span></span>
      template <span class="token punctuation">{</span>
        data <span class="token operator">=</span> <span class="token string-literal heredoc-string"><span class="token delimiter"><span class="token punctuation">&lt;&lt;</span><span class="token symbol">EOF</span></span><span class="token string">
#!/bin/bash
echo $(date) >> /tmp/periodic.txt
</span><span class="token delimiter"><span class="token symbol">EOF</span></span></span>
        destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"run.sh"</span></span>
      <span class="token punctuation">}</span>
      config <span class="token punctuation">{</span>
        command <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"run.sh"</span></span>
      <span class="token punctuation">}</span>
      resources <span class="token punctuation">{</span>
        cpu    <span class="token operator">=</span> <span class="token number">100</span>
        memory <span class="token operator">=</span> <span class="token number">64</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><code v-pre>periodic</code> 에서 cron 형태로 정의 가능</p>
</li>
<li>
<p><code v-pre>constraint</code>은 조건을 부여하는 옵션으로 attribute와 meta 정보를 활용 가능, 해당 예제에서는 hostname 기준으로 동작 타겟 호스트를 정의함</p>
<ul>
<li>
<p>attribute를 조건으로 주는 방법은 attribute값 앞에 <code v-pre>attr.</code> prefix를 추가</p>
</li>
<li>
<p>meta의 경우 meta로 선언된 키 앞에 <code v-pre>meta.</code> prefix를 추가</p>
</li>
<li>
<p>CLI로 확인하는 방법</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ nomad agent-info <span class="token operator">|</span> <span class="token function">grep</span> node_id
  node_id <span class="token operator">=</span> ae3cf7ee-09e6-c158-d883-fe4e4f39eb2b
$ nomad <span class="token function">node</span> status <span class="token parameter variable">-verbose</span> ae3cf7ee-09e6-c158-d883-fe4e4f39eb2b
ID              <span class="token operator">=</span> ae3cf7ee-09e6-c158-d883-fe4e4f39eb2b
Name            <span class="token operator">=</span> gs-C02CT3ZFML85
<span class="token punctuation">..</span>.
Attributes
cpu.arch                  <span class="token operator">=</span> amd64
cpu.frequency             <span class="token operator">=</span> <span class="token number">2300</span>
cpu.modelname             <span class="token operator">=</span> Intel<span class="token punctuation">(</span>R<span class="token punctuation">)</span> Core<span class="token punctuation">(</span>TM<span class="token punctuation">)</span> i7-1068NG7 CPU @ <span class="token number">2</span>.30GHz
cpu.numcores              <span class="token operator">=</span> <span class="token number">8</span>
cpu.totalcompute          <span class="token operator">=</span> <span class="token number">18400</span>
driver.java               <span class="token operator">=</span> <span class="token number">1</span>
driver.java.runtime       <span class="token operator">=</span> OpenJDK Runtime Environment Temurin-11.0.14.1+1 <span class="token punctuation">(</span>build <span class="token number">11.0</span>.14.1+1<span class="token punctuation">)</span>
driver.java.version       <span class="token operator">=</span> <span class="token number">11.0</span>.14.1
<span class="token punctuation">..</span>.
Meta
connect.gateway_image     <span class="token operator">=</span> envoyproxy/envoy:v<span class="token variable">${NOMAD_envoy_version}</span>
connect.log_level         <span class="token operator">=</span> info
connect.proxy_concurrency <span class="token operator">=</span> <span class="token number">1</span>
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>UI로 확인하는 방법</p>
<ul>
<li><code v-pre>http://&lt;server_ip&gt;:4646</code> 에 접속</li>
<li>왼쪽 메뉴의 <code v-pre>CLUSTER/Clients</code> 선택</li>
<li>우측의 클라이언트 목록에서 원하는 클라이언트 선택</li>
</ul>
</li>
</ul>
</li>
</ul>
<h2 id="batch-prameterized" tabindex="-1"><a class="header-anchor" href="#batch-prameterized" aria-hidden="true">#</a> Batch - Prameterized</h2>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"param"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>
  
  type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"batch"</span></span>

  parameterized <span class="token punctuation">{</span>
    payload <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"optional"</span></span>
    meta_required <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"param"</span></span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  constraint <span class="token punctuation">{</span>
    attribute <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${attr.unique.hostname}"</span></span>
    value     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"cn-client-1"</span></span>
  <span class="token punctuation">}</span>

  group <span class="token string-literal"><span class="token string">"batch"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>
    task <span class="token string-literal"><span class="token string">"batch"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"raw_exec"</span></span>
      template <span class="token punctuation">{</span>
        data <span class="token operator">=</span> <span class="token string-literal heredoc-string"><span class="token delimiter"><span class="token punctuation">&lt;&lt;</span><span class="token symbol">EOF</span></span><span class="token string">
#!/bin/bash
echo 'batch param {{ env "NOMAD_META_PARAM" }}' >> /tmp/param.txt
</span><span class="token delimiter"><span class="token symbol">EOF</span></span></span>
        destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"run.sh"</span></span>
      <span class="token punctuation">}</span>
      config <span class="token punctuation">{</span>
        command <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"run.sh"</span></span>
      <span class="token punctuation">}</span>
      resources <span class="token punctuation">{</span>
        cpu    <span class="token operator">=</span> <span class="token number">100</span>
        memory <span class="token operator">=</span> <span class="token number">64</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>parameterized</code> 항목에서 json형태의 payload, 또는 URL Param 형태를 입력 받아 동작 가능</li>
<li>요청시에만 동작</li>
</ul>
<h2 id="sysbatch" tabindex="-1"><a class="header-anchor" href="#sysbatch" aria-hidden="true">#</a> sysbatch</h2>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"install_docker"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>
  
  type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"sysbatch"</span></span>

  <span class="token operator">/</span><span class="token operator">/</span> periodic <span class="token punctuation">{</span>
  <span class="token operator">/</span><span class="token operator">/</span>   cron             <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*/5 * * * * * *"</span></span>
  <span class="token operator">/</span><span class="token operator">/</span>   prohibit_overlap <span class="token operator">=</span> <span class="token boolean">true</span>
  <span class="token operator">/</span><span class="token operator">/</span>   time_zone        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Asia/Seoul"</span></span>
  <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">}</span>

  constraint <span class="token punctuation">{</span>
    attribute <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${attr.os.name}"</span></span>
    value     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"ubuntu"</span></span>
  <span class="token punctuation">}</span>
  
  group <span class="token string-literal"><span class="token string">"install"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>
    task <span class="token string-literal"><span class="token string">"docker"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"raw_exec"</span></span>
      template <span class="token punctuation">{</span>
        data <span class="token operator">=</span> <span class="token string-literal heredoc-string"><span class="token delimiter"><span class="token punctuation">&lt;&lt;</span><span class="token symbol">EOF</span></span><span class="token string">
#!/bin/bash
apt-get update
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
apt-get update
apt-cache policy docker-ce
apt-get install docker-ce -y
systemctl enable docker
systemctl start docker
</span><span class="token delimiter"><span class="token symbol">EOF</span></span></span>
        destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"docker_install.sh"</span></span>
      <span class="token punctuation">}</span>
      config <span class="token punctuation">{</span>
        command <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"docker_install.sh"</span></span>
      <span class="token punctuation">}</span>
      resources <span class="token punctuation">{</span>
        cpu    <span class="token operator">=</span> <span class="token number">100</span>
        memory <span class="token operator">=</span> <span class="token number">64</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>docker를 ubuntu에 일괄 설치하는 예제</li>
<li>sysbatch는 조건에 맞는 모든 host node에서 실행</li>
</ul>
<h2 id="system" tabindex="-1"><a class="header-anchor" href="#system" aria-hidden="true">#</a> system</h2>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"system"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>

  type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"system"</span></span>

  group <span class="token string-literal"><span class="token string">"cache"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>

    network <span class="token punctuation">{</span>
      port <span class="token string-literal"><span class="token string">"db"</span></span> <span class="token punctuation">{</span>
        to <span class="token operator">=</span> <span class="token number">6379</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string-literal"><span class="token string">"redis"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"docker"</span></span>

      config <span class="token punctuation">{</span>
        image <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"redis:6.2.6-alpine3.15"</span></span>
        ports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"db"</span></span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      resources <span class="token punctuation">{</span>
        cpu    <span class="token operator">=</span> <span class="token number">500</span>
        memory <span class="token operator">=</span> <span class="token number">512</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>system 타입은 모든 노드에서 실행하는 agent 같은 역할의 실행을 수행</li>
<li>예제에서는 docker 타입의 실행을 예로 <code v-pre>redis:6.2.6-alpine3.15</code>를 모든 노드에서 실행하도록 구성</li>
<li><code v-pre>group/network</code> 에서 사용할 network 조건을 정의
<ul>
<li>to : 대상의 포트 정보</li>
<li>static : 고정할 클라이언트에서의 포트 정보 (정의되어 있지 않으면 랜덤 부여)</li>
<li>사용할 포트 이름은 docker로 정의된 task의 config/ports 에서 맵핑하여 관리</li>
</ul>
</li>
</ul>
<h3 id="service" tabindex="-1"><a class="header-anchor" href="#service" aria-hidden="true">#</a> Service</h3>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"service"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>

  <span class="token operator">/</span><span class="token operator">/</span> spread <span class="token punctuation">{</span>
  <span class="token operator">/</span><span class="token operator">/</span>   attribute <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${node.datacenter}"</span></span>
  <span class="token operator">/</span><span class="token operator">/</span> <span class="token punctuation">}</span>

  group <span class="token string-literal"><span class="token string">"nginx"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">2</span>

    scaling <span class="token punctuation">{</span>
      enabled <span class="token operator">=</span> <span class="token boolean">true</span>
      min <span class="token operator">=</span> <span class="token number">0</span>
      max <span class="token operator">=</span> <span class="token number">3</span>
    <span class="token punctuation">}</span>


    network <span class="token punctuation">{</span>
      port <span class="token string-literal"><span class="token string">"http"</span></span> <span class="token punctuation">{</span>
        to <span class="token operator">=</span> <span class="token number">80</span>
        static <span class="token operator">=</span> <span class="token number">18080</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    service <span class="token punctuation">{</span>
      name <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"nginx-backend"</span></span>
      port <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"http"</span></span>
      tags <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"prod"</span></span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>

    task <span class="token string-literal"><span class="token string">"nginx"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"docker"</span></span>

      config <span class="token punctuation">{</span>
        image <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"nginx"</span></span>
        ports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"http"</span></span><span class="token punctuation">]</span>
        volumes <span class="token operator">=</span> <span class="token punctuation">[</span>
          <span class="token string-literal"><span class="token string">"local/html:/usr/share/nginx/html"</span></span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      template <span class="token punctuation">{</span>
        data <span class="token operator">=</span> <span class="token string-literal heredoc-string"><span class="token delimiter"><span class="token punctuation">&lt;&lt;</span><span class="token symbol">EOF</span></span><span class="token string">
        &lt;h1>Welcome to {{ env "NOMAD_JOB_NAME" }} Production {{ env "NOMAD_HOST_PORT_http" }}&lt;/h1>
        node_dc:       {{ env "node.datacenter" }}&lt;br>
        node_hostname: {{ env "attr.unique.hostname" }}&lt;br>
        node_cores:    {{ env "attr.cpu.numcores" }}&lt;br>
        os_name:       {{ env "attr.os.name" }}&lt;br>
        cpu_model:     {{ env "attr.cpu.modelname" }}&lt;br>
        </span><span class="token delimiter"><span class="token symbol">EOF</span></span></span>
        destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"local/html/index.html"</span></span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Service 타입은 상시 실행된 서비스를 명시</li>
<li><code v-pre>count</code>가 2 이므로 해당 서비스는 2개를 띄우려고 시도</li>
<li><code v-pre>scaling</code> 정의가 있는 경우 UI/CLI/API 에서 scaling count값 지정 가능</li>
<li>포트에 <code v-pre>static</code> 명시가 되어있으므로 해당 서비스는 <code v-pre>18080</code>을 사용할 수 있는 count 만큼의 노드가 필요</li>
</ul>
</div></template>


