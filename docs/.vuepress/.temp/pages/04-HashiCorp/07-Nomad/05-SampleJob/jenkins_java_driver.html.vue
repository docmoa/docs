<template><div><h1 id="jenkins-java-driver-on-nomad" tabindex="-1"><a class="header-anchor" href="#jenkins-java-driver-on-nomad" aria-hidden="true">#</a> Jenkins(Java Driver) on Nomad</h1>
<blockquote>
<p>Nomad</p>
<ul>
<li>Java Driver : <a href="https://developer.hashicorp.com/nomad/docs/drivers/java" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/nomad/docs/drivers/java<ExternalLinkIcon/></a></li>
<li>Schecuduler Config : <a href="https://developer.hashicorp.com/nomad/api-docs/operator/scheduler" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/nomad/api-docs/operator/scheduler<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<h2 id="_1-jenkins의-기본-실행-방식" tabindex="-1"><a class="header-anchor" href="#_1-jenkins의-기본-실행-방식" aria-hidden="true">#</a> 1. Jenkins의 기본 실행 방식</h2>
<p>Jenkins의 공식 설치 안내에서 처럼 Java를 실행시킬 수 있는 환경에서 <code v-pre>war</code> 형태의 자바 웹어플리케이션 압축 파일을 실행하는 형태, 컨테이너, OS별 지원되는 패키지 형태로 실행된다.</p>
<ul>
<li>공식 설치 안내 : <a href="https://www.jenkins.io/doc/book/installing/" target="_blank" rel="noopener noreferrer">https://www.jenkins.io/doc/book/installing/<ExternalLinkIcon/></a></li>
</ul>
<p>각 설치 형태의 특징은 다음과 같다.</p>
<table>
<thead>
<tr>
<th>형태</th>
<th>설명</th>
<th>특징</th>
</tr>
</thead>
<tbody>
<tr>
<td>war</td>
<td>JRE 또는 JDK가 설치되어있는 환경에서 실행가능</td>
<td>서버 재부팅, 장애 시 수동으로 실행 필요</td>
</tr>
<tr>
<td>Container</td>
<td>컨테이너 런타임(e.g. docker, containerd ... )에서 실행</td>
<td>컨테이너 관리 및 영구저장소 관리 필요</td>
</tr>
<tr>
<td>Package</td>
<td>각 OS 마다 제공되는 패키지 관리자에서 관리</td>
<td>필요한 패키지 자동설치 및 재부팅시 재시작 가능하나 장애시 수동 실행 필요</td>
</tr>
</tbody>
</table>
<h2 id="_2-nomad에서의-java-애플리케이션-실행의-의미" tabindex="-1"><a class="header-anchor" href="#_2-nomad에서의-java-애플리케이션-실행의-의미" aria-hidden="true">#</a> 2. Nomad에서의 Java 애플리케이션 실행의 의미</h2>
<p>Nomad는 애플리케이션 실행을 오케스트레이션 해주는 역할로, Java 애플리케이션의 여러 실행 형태에 장점만을 취합하여 실행 환경을 제공할 수 있다.</p>
<ul>
<li>운영에 익숙한 Host OS에서 실행</li>
<li>chroot, cgroups 등의 컨테이너 특징으로 격리 기능 제공</li>
<li>프로세스 장애 시 재시작</li>
<li>영구저장소 마운트 (Host 디렉토리와 CSI 둘 모두 지원)</li>
<li>Java 실행을 선언적으로 구성</li>
<li>Java의 범위정의되는 Memory(Xms, Xmx)에 맞춰 리소스 격리</li>
</ul>
<h2 id="_3-nomad-구성-요구사항" tabindex="-1"><a class="header-anchor" href="#_3-nomad-구성-요구사항" aria-hidden="true">#</a> 3. Nomad 구성 요구사항</h2>
<p>Nomoad 에서는 Jenkins 실행을 위해 다음 조건이 필요하다.</p>
<h3 id="_3-1-nomad-client" tabindex="-1"><a class="header-anchor" href="#_3-1-nomad-client" aria-hidden="true">#</a> 3.1 Nomad Client</h3>
<ul>
<li>Host Volume을 위한 디렉토리 생성<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 예시</span>
<span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /opt/nomad/volume/jenkins
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>Linux/macOS의 경우 Java Driver 실행시 계정을 <code v-pre>nobody</code>로 부여하므로 <code v-pre>nobody</code>계정에 권한으로 실행 필요<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 예시</span>
<span class="token comment"># macOS인 경우</span>
<span class="token function">chown</span> <span class="token parameter variable">-R</span> nobody:nobody /opt/nomad/volume/jenkins
<span class="token comment"># ubuntu인 경우</span>
<span class="token function">chown</span> <span class="token parameter variable">-R</span> nobody:nogroup /opt/nomad/volume/jenkins
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>Client 구성 피알의 <code v-pre>client</code> 블록에 Host Volume을 지정<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">client</span> <span class="token punctuation">{</span>
  <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token comment"># 생략</span>
  host_volume <span class="token string">"jenkins"</span> <span class="token punctuation">{</span>
    <span class="token property">path</span>      <span class="token punctuation">=</span> <span class="token string">"/opt/nomad/volume/jenkins"</span>
    <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_3-2-nomad-scheduler" tabindex="-1"><a class="header-anchor" href="#_3-2-nomad-scheduler" aria-hidden="true">#</a> 3.2 Nomad Scheduler</h3>
<p><a href="https://www.hashicorp.com/blog/announcing-general-availability-of-hashicorp-nomad-1-1" target="_blank" rel="noopener noreferrer">Nomad 1.1<ExternalLinkIcon/></a>부터 리소스에 대한 유연한 설정 기능이 추가되었다. 그 중 메모리 할당 추가 기능인 <a href="https://www.hashicorp.com/blog/managing-resources-for-workloads-with-nomad-1-1" target="_blank" rel="noopener noreferrer">Memory Oversubscription<ExternalLinkIcon/></a>이 추가되었고, Java 애플리케이션이 갖는 특징인 JVM 메모리의 범위 할당과도 연계되는 설정 방식이다. JVM 64bit 부터는 기본적으로 소모하는 메모리가 크고, 한번 증가한 메모리는 장기간 유지되기 때문에 메모리에 대한 유연한 설정은 중요하다.<br>
<img src="https://www.datocms-assets.com/2885/1620146573-oversubscription.png?fit=max&amp;fm=webp&amp;q=80&amp;w=2500" alt="" loading="lazy"></p>
<p>특히, Nomad에서 리소스를 격리하여 Java 드라이버에 제공되므로 지정된 메모리보다 초과 사용하는 경우 격리된 리소스로 인해 <code v-pre>Error code 143 Signal 9</code> (Out Of Memory 로 인한 프로세스 강제종료)형상이 발생할 수 있다.</p>
<p><code v-pre>Oversubscription</code> 기능은 고급 기능으로 구성설정에서 지정할 수는 없고 CLI/API/Terraform을 사용하여 설정을 변경해야 한다. (<a href="https://developer.hashicorp.com/nomad/tutorials/advanced-scheduling/memory-oversubscription?in=nomad%2Fadvanced-scheduling" target="_blank" rel="noopener noreferrer">설명 링크<ExternalLinkIcon/></a>)</p>
<Tabs id="165" :data='[]'>
</Tabs>
<h2 id="_4-job-sample" tabindex="-1"><a class="header-anchor" href="#_4-job-sample" aria-hidden="true">#</a> 4. Job Sample</h2>
<ul>
<li>resources
<ul>
<li>memory_max : 유동적 메모리 할당</li>
<li>network : Jenkins에서 사용할 포트 지정</li>
</ul>
</li>
<li>env : Jenkins Home 디렉토리 위한 환경 변수 <code v-pre>JENKINS_HOME</code> 선언</li>
<li>config
<ul>
<li>jar_path : <code v-pre>artifact</code>로 받은 war파일 경로</li>
<li>jvm_options : jvm 실행 옵션</li>
<li>args : war 실행 문서에서 지정하는 <code v-pre>--httpPort</code>는 args 항목이고 jvm 옵션이 아님에 주의</li>
</ul>
</li>
<li>volume_mount : Jenkins Home 디렉토리로 Host Volume으로 지정한 영구적 볼륨 할당</li>
<li>artifact : war 파일 다운로드 경로</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "namespace" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"default"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "jenkins_version" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"2.361.3"</span>
<span class="token punctuation">}</span>

job <span class="token string">"jenkins"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"home"</span><span class="token punctuation">]</span>
  <span class="token property">namespace</span> <span class="token punctuation">=</span> var.namespace

  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>

  <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
    <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>meta<span class="token punctuation">.</span>type<span class="token punctuation">}</span></span>"</span>
    <span class="token property">value</span>     <span class="token punctuation">=</span> <span class="token string">"vraptor"</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">update</span> <span class="token punctuation">{</span>
    <span class="token property">healthy_deadline</span> <span class="token punctuation">=</span> <span class="token string">"10m"</span>
    <span class="token property">progress_deadline</span> <span class="token punctuation">=</span> <span class="token string">"20m"</span>
  <span class="token punctuation">}</span>

  group <span class="token string">"jenkins"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>
    volume <span class="token string">"jenkins"</span> <span class="token punctuation">{</span>
      <span class="token property">type</span>      <span class="token punctuation">=</span> <span class="token string">"host"</span>
      <span class="token property">source</span>    <span class="token punctuation">=</span> <span class="token string">"jenkins"</span>
      <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"jenkins_http"</span> <span class="token punctuation">{</span>
        <span class="token comment">// to = 8080</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">8888</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    task <span class="token string">"war"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"java"</span>
      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">1000</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">1024</span>
        <span class="token property">memory_max</span> <span class="token punctuation">=</span> <span class="token number">2048</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">JENKINS_HOME</span> <span class="token punctuation">=</span> <span class="token string">"/jenkins_home"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">jar_path</span>    <span class="token punctuation">=</span> <span class="token string">"local/jenkins.war"</span>
        <span class="token property">jvm_options</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"-Xms1024m"</span>, <span class="token string">"-Xmx2048m"</span><span class="token punctuation">]</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"--httpPort=<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_PORT_jenkins_http<span class="token punctuation">}</span></span>"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">volume_mount</span> <span class="token punctuation">{</span>
        <span class="token property">volume</span>      <span class="token punctuation">=</span> <span class="token string">"jenkins"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/jenkins_home"</span>
        <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"jenkins"</span>
        <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"java"</span>, <span class="token string">"cicd"</span><span class="token punctuation">]</span>
        <span class="token property">provider</span> <span class="token punctuation">=</span> <span class="token string">"nomad"</span>

        <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"jenkins_http"</span>

        <span class="token keyword">check</span> <span class="token punctuation">{</span>
          <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"jenkins port"</span>
          <span class="token property">type</span>  <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
          <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
          <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">logs</span> <span class="token punctuation">{</span>
        <span class="token property">max_files</span>     <span class="token punctuation">=</span> <span class="token number">10</span>
        <span class="token property">max_file_size</span> <span class="token punctuation">=</span> <span class="token number">10</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"https://get.jenkins.io/war-stable/<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">jenkins_version</span><span class="token punctuation">}</span></span>/jenkins.war"</span>
        <span class="token keyword">options</span> <span class="token punctuation">{</span>
          <span class="token property">checksum</span> <span class="token punctuation">=</span> <span class="token string">"sha256:f39cb8d09fd17c72dc096511ce50f245fc3004d1022aaaf60421a536f740c9b9"</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// destination = "local"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="@source/04-HashiCorp/07-Nomad/05-SampleJob/image/nomad_ui_jenkins_alloc.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<div class="hint-container tip">
<p class="hint-container-title">실행 후 Admin Token</p>
<p>Jenkins Home 디렉토리로 지정한 디렉토리에 관련 파일이 생성되며, 실제 호스트의 디렉토리에서 접근하는 것도 가능하나 Nomad의 <code v-pre>Exec</code>에서 접근하는 것도 가능하다<br>
<img src="@source/04-HashiCorp/07-Nomad/05-SampleJob/image/nomad_ui_jenkins_exec.png" alt="" loading="lazy"></p>
</div>
</div></template>


