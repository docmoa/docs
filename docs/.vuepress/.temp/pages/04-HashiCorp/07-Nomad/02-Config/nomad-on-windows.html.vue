<template><div><h1 id="nomad-on-windows" tabindex="-1"><a class="header-anchor" href="#nomad-on-windows" aria-hidden="true">#</a> Nomad on Windows</h1>
<p>Nomad를 Windows환경에 구성하고 실행을위해 서비스로 등록하는 방법을 알아봅니다. 솔루션 실행 환경 또는 운영/개발자의 익숙함 정도에 따라 다양한 OS를 선택하여 애플리케이션을 배포하게 됩니다. Nomad를 통해 배포를 위한 오케스트레이터를 Windows 환경에 적용하고 서비스에 등록하여 상시적으로 실행될 수 있도록하는 구성을 안내합니다.</p>
<h2 id="port-구성" tabindex="-1"><a class="header-anchor" href="#port-구성" aria-hidden="true">#</a> Port 구성</h2>
<blockquote>
<p>참고 url : <a href="https://www.nomadproject.io/docs/install/production/requirements#ports-used" target="_blank" rel="noopener noreferrer">Port used<ExternalLinkIcon/></a></p>
</blockquote>
<p>Nomad는 서버와 클라이언트 모드로 나뉩니다. 서버를 위해서는 3 개의 포트가 필요하고 클라이언트에서는 2 개의 포트가 필요합니다. 클라이언트에 배포되는 애플리케이션에서 사용하는 포트를 동적으로 할당하는 영역을 구성합니다.</p>
<table>
<thead>
<tr>
<th>종류</th>
<th>기본값</th>
<th>프로토콜</th>
<th>설명</th>
</tr>
</thead>
<tbody>
<tr>
<td>HTTP API</td>
<td>4646</td>
<td>TCP</td>
<td>서버와 클라이언트에서 HTTP API를 제공하는데 사용됩니다.</td>
</tr>
<tr>
<td>RPC</td>
<td>4647</td>
<td>TCP</td>
<td>서버와 클라이언트간의 내부. RPC 통신 및 서버간 통신에 사용됩니다.</td>
</tr>
<tr>
<td>Serf WAN</td>
<td>4648</td>
<td>TCP/UDP</td>
<td>서버간 LAN/WAN 으로 GOSSIP 프로토콜로 사용됩니다.</td>
</tr>
<tr>
<td>Dynamic</td>
<td>1025–60000</td>
<td>TCP/UDP</td>
<td>클라이언트에서 사용할 동적 포트를 할당합니다.</td>
</tr>
</tbody>
</table>
<blockquote>
<p>Windows에서의 동적포트 설명은 다음을 참고합니다. : <a href="https://en.wikipedia.org/wiki/Ephemeral_port" target="_blank" rel="noopener noreferrer">Ephemeral_port<ExternalLinkIcon/></a></p>
<p>Windows에서의 동적포트 설정은 다음을 참고합니다. : <a href="https://docs.microsoft.com/en-us/troubleshoot/windows-server/networking/default-dynamic-port-range-tcpip-chang" target="_blank" rel="noopener noreferrer">default-dynamic-port-range-tcpip-chang<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="디렉토리-구성" tabindex="-1"><a class="header-anchor" href="#디렉토리-구성" aria-hidden="true">#</a> 디렉토리 구성</h2>
<p>디렉토리 구성의 예는 아래와 같습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>└── Nomad
    ├── bin
    ├── config
    └── data
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>bin : Nomad 실행 바이너리 파일을 다운로드하여 별도 관리하는 경우 활용할 수 있습니다. 시스템 전체에서 사용하는 경우 해당 경로를 <code v-pre>PATH</code>로 등록 하거나 <code v-pre>C:\WINDOWS\system32\</code> 의 경로에 바이너리를 위치시키는 방법도 있습니다.</li>
<li>config : Nomad에서 사용하는 config 파일을 저장하는 위치로 사용합니다.</li>
<li>data : Nomad가 서버 또는 클라이언트로 사용되는 경우 기록, 저장되는 데이터 저장소로 사용됩니다.</li>
</ul>
<h2 id="설치" tabindex="-1"><a class="header-anchor" href="#설치" aria-hidden="true">#</a> 설치</h2>
<blockquote>
<p>설치 참고 url : <a href="https://www.nomadproject.io/docs/install" target="_blank" rel="noopener noreferrer">Install<ExternalLinkIcon/></a></p>
<p>Dev모드 참고 url : <a href="https://learn.hashicorp.com/tutorials/nomad/get-started-run?in=nomad/get-started" target="_blank" rel="noopener noreferrer">Get Start<ExternalLinkIcon/></a></p>
</blockquote>
<p>Windows에 설치하는 방식은 수동, Chocolatey, 컴파일 방식을 지원합니다. 여기서는 수동 구성 방법에 대해 설명합니다.</p>
<p>미리 컴파일된 바이너리 파일은 다음의 경로에서 확인할 수 있습니다. 2021년 4월 18일 기준 1.0.4 버전이 최신 버전입니다.</p>
<ul>
<li>다운로드 url : <a href="https://releases.hashicorp.com/nomad/" target="_blank" rel="noopener noreferrer">Releases HashiCorp - Nomad<ExternalLinkIcon/></a>
<ul>
<li>오픈소스는 <code v-pre>nomad_&lt;버전&gt;</code> 으로 표기됩니다.</li>
<li>엔터프라이즈는 <code v-pre>nomad_&lt;버전&gt;+ent</code> 로 표기됩니다.</li>
</ul>
</li>
<li>Windows 환경을 위해 미리 컴파일된 바이너리는 32bit/64bit 로 구분됩니다.
<ul>
<li>nomad_&lt;버전&gt;_windows_386.zip - 32bit</li>
<li>nomad_&lt;버전&gt;_windows_amd64.zip - 64bit</li>
</ul>
</li>
</ul>
<p>릴리즈 된 zip을 다운로드 받고 적절한 위치에 압축을 해제 합니다. 위 <a href="#%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B5%AC%EC%84%B1">디렉토리 구성</a> 에서의 예로는 <code v-pre>bin</code> 디렉토리 아래 위치 시킵니다.</p>
<p>Nomad 버전을 확인하여 바이너리가 정상적으로 실행되는지 확인합니다.</p>
<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre v-pre class="language-powershell"><code><span class="token function">PS</span> C:₩hashicorp₩nomad₩bin> <span class="token punctuation">.</span><span class="token operator">/</span>nomad<span class="token punctuation">.</span>exe version
Nomad v1<span class="token punctuation">.</span>0<span class="token punctuation">.</span>4 <span class="token punctuation">(</span>9294f35f9aa8dbb4acb6e85fa88e3e2534a3e41a<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Dev 모드로 실행하여 테스트 하는것도 가능합니다.</p>
<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre v-pre class="language-powershell"><code><span class="token function">PS</span> C:₩hashicorp₩nomad₩bin> <span class="token punctuation">.</span><span class="token operator">/</span>nomad agent <span class="token operator">-</span>dev
==> No configuration files loaded
==> Starting Nomad agent<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
==> Nomad agent configuration:

       Advertise Addrs: HTTP: 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:4646<span class="token punctuation">;</span> RPC: 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:4647<span class="token punctuation">;</span> Serf: 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:4648
            Bind Addrs: HTTP: 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:4646<span class="token punctuation">;</span> RPC: 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:4647<span class="token punctuation">;</span> Serf: 127<span class="token punctuation">.</span>0<span class="token punctuation">.</span>0<span class="token punctuation">.</span>1:4648
                Client: true
             Log Level: DEBUG
                Region: global <span class="token punctuation">(</span>DC: dc1<span class="token punctuation">)</span>
                Server: true
               Version: 1<span class="token punctuation">.</span>0<span class="token punctuation">.</span>4

==> Nomad agent started! Log <span class="token keyword">data</span> will stream in below:
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>생략<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>실행 후 나열된 정보를 사용하여 UI에 접속해봅니다.<br>
<img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20210418110743732.png" alt="image-20210418110743732" loading="lazy"></p>
<h2 id="설정" tabindex="-1"><a class="header-anchor" href="#설정" aria-hidden="true">#</a> 설정</h2>
<blockquote>
<p>설정 설명 url : <a href="https://www.nomadproject.io/docs/configuration" target="_blank" rel="noopener noreferrer">Configuration<ExternalLinkIcon/></a></p>
<p>go_sockaddr_template : <a href="https://pkg.go.dev/github.com/hashicorp/go-sockaddr/template?utm_source=godoc" target="_blank" rel="noopener noreferrer">go-sockaddr<ExternalLinkIcon/></a></p>
</blockquote>
<p>Nomad 실행시 CLI 상에 설정을 하는 Inline 방식과 설정파일을 지정하는 방식으로 구성이 가능합니다. 여기서는 구성파일을 지정하도록 하는 방식을 설명합니다.</p>
<p>설정 파일을 <a href="#%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B5%AC%EC%84%B1">디렉토리 구성</a>에서 지정한 <code v-pre>config</code> 디렉토리에 위치 시킵니다. 여기서는 예로 <code v-pre>nomad.hcl</code> 이라 명명합니다. 테스트를 위한 몇가지 설정요소를 아래에 설명합니다.</p>
<p>[nomad.hcl]</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>datacenter <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"dc1"</span></span>
data_dir   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"C:\\hashicorp\\nomad\\data"</span></span>
bind_addr  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"0.0.0.0"</span></span>

advertise <span class="token punctuation">{</span>
  <span class="token operator">/</span><span class="token operator">/</span>  http <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"{{ GetInterfaceIP \"Network 1\" }}"</span></span>
  rpc  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"{{ GetInterfaceIP \"Network 1\" }}"</span></span>
  serf <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"{{ GetInterfaceIP \"Network 1\" }}"</span></span>
<span class="token punctuation">}</span>

server <span class="token punctuation">{</span>
  enabled          <span class="token operator">=</span> <span class="token boolean">true</span>
  bootstrap_expect <span class="token operator">=</span> <span class="token number">1</span>
<span class="token punctuation">}</span>

client <span class="token punctuation">{</span>
  enabled           <span class="token operator">=</span> <span class="token boolean">true</span>
  network_interface <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Network 2"</span></span>
  meta <span class="token punctuation">{</span>
    subject <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"server1"</span></span>
    purpose <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"test,sample"</span></span>
  <span class="token punctuation">}</span>
  options <span class="token operator">=</span> <span class="token punctuation">{</span>
    driver<span class="token punctuation">.</span>raw_exec<span class="token punctuation">.</span>enable <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"1"</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

server_join <span class="token punctuation">{</span>
  retry_join <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"{{ GetInterfaceIP \"Network 1\" }}:4647"</span></span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>datacenter : Nomad의 클러스터는 <code v-pre>datacenter</code>로 클러스터의 클라이언트들을 그룹화 할 수 있습니다. Nomad에 배포하는 대상으로 지정됩니다. 기본값은 <code v-pre>dc1</code> 입니다.</li>
<li>data_dir : Nomad에서 생성하는 데이터 디렉토리 위치를 지정합니다. 위 <a href="#%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B5%AC%EC%84%B1">디렉토리 구성</a>에서 지정한 <code v-pre>data</code> 디렉토리를 지정하였습니다.
<ul>
<li>Windows 환경에서 디렉토리 구분자는 <code v-pre>\\</code> 를 사용합니다.</li>
</ul>
</li>
<li>bind_addr : nomad의 http, rpc, serf가 사용할 기본 ip 주소를 지정합니다. 실행 환경의 모든 IP와 매핑하기 위해 <code v-pre>0.0.0.0</code> 으로 설정하였습니다.</li>
<li>advertise : 생략하는 경우  <code v-pre>bind_addr</code> 값을 상속 받지만, 사용자가 지정한 네트워크 주소를 지정하기 위해 사용됩니다. ip 형식을 사용할 수도 있고 go-sockaddr 템플릿 구성을 사용 가능하기 때문에 템플릿 형태로 지정도 가능합니다. 예제에서는 네트워크 인터페이스에 할당된 IP를 가져오는 방식 입니다. 한글도 지원합니다.<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>  <span class="token punctuation">{</span><span class="token punctuation">{</span> GetInterfaceIP \"이더넷 <span class="token number">1</span>\" <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>server : 서버인 경우에 설정을 구성하는 항목 입니다.
<ul>
<li>enabled : <code v-pre>true</code>인 경우 서버 모드로 실행됩니다.</li>
<li>bootstrap_expect : 서버의 HA를 위해 3중화 또는 5중화 하는 경우 서버의 기대 개수 값을 넣습니다. 여기서는 하나의 Nomad 프로세스가 서버와 클라이언트 역할을 모두 수행합니다.</li>
</ul>
</li>
<li>client : 클라이언트인 경우에 설정을 구성하는 항목 입니다.
<ul>
<li>enabled : <code v-pre>true</code>인 경우 클라이언트 모드로 실행됩니다.</li>
<li>network_interface : Nomad 클라이언트에서 실행하는 애플리케이션이 할당되는 네트워크 인터페이스가 Nomad 프로세스와 다른 네트워크를 사용하는 경우 해당 네트워크 인터페이스 이름을 지정 합니다.</li>
<li>meta : 배포할 조건을 사용자 정의하는 항목입니다. Label 이나 Tag와 비슷한 역할입니다. map 타입으로 여러줄을 나열하여 설정할 수 있습니다. 값은 쉼표로 구분하여 리스트처럼 사용할 수 있습니다.</li>
<li>options : 클라이언트 구성의 옵션을 지정합니다. 주로 실행 드라이버와 배포를 위한 설정을 위해 사용됩니다.
<ul>
<li>driver.raw_exec.enable : <code v-pre>raw_exec</code> 드라이버는 기본적으로 비활성화 되어있습니다. Windows에서는 <code v-pre>exec</code> 드라이버가 동작하지 않으므로 해당 드라이버를 활성화 합니다.</li>
<li><a href="https://www.nomadproject.io/docs/drivers/exec" target="_blank" rel="noopener noreferrer">exec<ExternalLinkIcon/></a> : OS에서 지원하는 격리 기본 요소를 사용하여 배포 작업으로 할당되는 리소스에 대한 접근을 제한합니다.</li>
<li><a href="https://www.nomadproject.io/docs/drivers/raw_exec" target="_blank" rel="noopener noreferrer">raw_exec<ExternalLinkIcon/></a> :  OS 지원 격리 요소를 사용하지 않고 Nomad가 작업 실행시 동일한 사용자로 시작 됩니다.</li>
</ul>
</li>
</ul>
</li>
<li>server_join : 서버와 클라이언트 구성의 경우, 또는 서버 HA 구성의 경우 서버 접속을 위한 주소를 나열합니다.</li>
</ul>
<h2 id="실행과-서비스-등록" tabindex="-1"><a class="header-anchor" href="#실행과-서비스-등록" aria-hidden="true">#</a> 실행과 서비스 등록</h2>
<p>구성파일을 작성하였다면, 해당 구성파일을 지정하여 Nomad를 실행할 수 있습니다.</p>
<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre v-pre class="language-powershell"><code><span class="token function">PS</span> C:₩hashicorp₩nomad₩bin> <span class="token punctuation">.</span><span class="token operator">/</span>nomad agent <span class="token operator">-</span>config=C:\hashicorp\nomad\config\nomad<span class="token punctuation">.</span>hcl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Windows 서비스로 등록하는 경우 다음을 참고합니다.</p>
<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre v-pre class="language-powershell"><code><span class="token function">sc</span><span class="token punctuation">.</span>exe delete nomad
<span class="token function">sc</span><span class="token punctuation">.</span>exe create nomad binPath= <span class="token string">"C:\hashicorp\nomad\bin\nomad.exe agent -config=C:\hashicorp\nomad\config\nomad.hcl"</span> <span class="token function">start</span>= auto
net <span class="token function">start</span> nomad
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/DESKTOP-LenovoMini 2021-04-18 10-22-39.png" alt="DESKTOP-LenovoMini 2021-04-18 10-22-39" tabindex="0" loading="lazy"><figcaption>DESKTOP-LenovoMini 2021-04-18 10-22-39</figcaption></figure>
<h2 id="테스트" tabindex="-1"><a class="header-anchor" href="#테스트" aria-hidden="true">#</a> 테스트</h2>
<blockquote>
<p>Job 구성 url : <a href="https://learn.hashicorp.com/tutorials/nomad/jobs-configuring?in=nomad/manage-jobs" target="_blank" rel="noopener noreferrer">Manage-job<ExternalLinkIcon/></a></p>
</blockquote>
<p>Windows에서만 실행되는 커맨드를 활용하여 동작을 테스트 합니다.</p>
<p>[test.nomad]</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"test"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>
  type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"batch"</span></span>

  constraint <span class="token punctuation">{</span>
    attribute <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${attr.kernel.name}"</span></span>
    value     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"windows"</span></span>
  <span class="token punctuation">}</span>

  group <span class="token string-literal"><span class="token string">"windows"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>
    task <span class="token string-literal"><span class="token string">"systeminfo"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"raw_exec"</span></span>
      config <span class="token punctuation">{</span>
        command <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"C:\\windows\\system32\\systeminfo"</span></span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>job : job 이름을 명시 합니다.</li>
<li>datacenters : 해당 job을 배포할 대상 datacenter를 지정합니다. list 타입인 이유는 Enterprise에서는 멀티 DC 배포를 지원하기 때문입니다.</li>
<li>type : Nomad가 지원하는 배포 애플리케이션 타입은 batch, service, system 입니다.
<ul>
<li>batch : 지속되지 않는 1회성 작업에 대한 타입으로 반복적 작업과 파라메터를 받는 형식도 지원합니다.</li>
<li>service : 지속되는 작업, 예를들어 웹서버와 같은 형식의 애플리케이션 실행 타입을 지원합니다.</li>
<li>system : 전체 클라이언트에서 실행될 애플리케이션 실행 타입을 지원합니다. 예를들어 모니터링을 위해 모든 클라이언트에서 실행되어야하는 경우에 활용합니다.</li>
</ul>
</li>
<li>constraint : job이 배포될 조건을 지정하는 것으로 반복적으로 구성가능합니다.</li>
<li>group : job에서 함께 실행될 단위를 지정합니다. task가 여럿 할당될 수 있습니다.</li>
<li>count : group에서 실행되는 배포의 개수를 지정합니다.</li>
<li>task : 실제 동작하는 배포 형식을 정의 합니다.
<ul>
<li><a href="https://www.nomadproject.io/docs/drivers" target="_blank" rel="noopener noreferrer">driver<ExternalLinkIcon/></a> : task로 실행할 배포 형태 드라이버를 지정합니다. 대표적으로 exec, raw_exec, java, docker 등이 있습니다.</li>
<li>config : <code v-pre>driver</code> 의 실행을위한 구성을 정의합니다. 예제에서는 <code v-pre>raw_exec</code> 를 사용하였으므로 <code v-pre>command</code> 를 입력합니다.</li>
</ul>
</li>
</ul>
<p>job의 내용은 파일로 구성하여 CLI로 등록하는 것도 가능하고 UI에서 입력하는 것도 가능합니다. UI등록의 예는 다음과 같습니다.</p>
<ol>
<li>
<p>UI의 좌측 <code v-pre>Jobs</code> 를 클릭하여 우측 상단의 <code v-pre>Run Job</code> 버튼을 클릭합니다.<br>
<img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20210418110840679.png" alt="image-20210418110840679" loading="lazy"></p>
</li>
<li>
<p><code v-pre>Job Definition</code> 란에 job 정의를 채우고 <code v-pre>Plan</code>을 클릭합니다.<br>
<img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Run a job - Nomad 2021-04-18 10-47-26.png" alt="Run a job - Nomad 2021-04-18 10-47-26" loading="lazy"></p>
</li>
<li>
<p>Plan의 결과를 확인하고 <code v-pre>Run</code> 버튼으로 배포를 실행합니다.<br>
<img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Run a job - Nomad 2021-04-18 10-48-47.png" alt="Run a job - Nomad 2021-04-18 10-48-47" loading="lazy"></p>
</li>
<li>
<p>배포의 결과를 확인합니다.<br>
<img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Job test - Nomad 2021-04-18 10-49-41.png" alt="Job test - Nomad 2021-04-18 10-49-41" loading="lazy"></p>
<ul>
<li>배포에 실패하면 붉은색으로 표기되며, <code v-pre>Task Groups</code>의 task 이름을 클릭하면 원인을 확인할 수 있습니다.</li>
<li>정상 배포되면 <code v-pre>Running</code> 상태로 확인됩니다. <code v-pre>batch</code> 의 경우 실행 후 종료되기 때문에 최종적으로 <code v-pre>Complete</code> 상태가 됩니다.</li>
<li>해당 task를 선택하고 마지막 <code v-pre>Allocation</code> 항목을 클릭하면 마지막 실행 task를 확인할 수 있고, 원격에서 실행된 <code v-pre>Log</code>나 생성된 <code v-pre>File</code>을 확인할 수 있습니다.</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Task systeminfo - Nomad 2021-04-18 10-57-18.png" alt="Task systeminfo - Nomad 2021-04-18 10-57-18" tabindex="0" loading="lazy"><figcaption>Task systeminfo - Nomad 2021-04-18 10-57-18</figcaption></figure>
</li>
</ol>
<h2 id="마치며" tabindex="-1"><a class="header-anchor" href="#마치며" aria-hidden="true">#</a> 마치며</h2>
<p>Windows 환경에 실행되는 애플리케이션을 원격에서 일괄적으로 관리하기위한 환경을 제공합니다. CI/CD 과정에서 마지막 단계인 배포 동작에 대해 API를 지원하고 스케쥴링 및 배포의 상태를 관리해주는 역할로 동작합니다. Batch, Service, System 의 배포 실행 형태를 지정할 수 있고, 다양한 실행 드라이버(exec, java, docker, 등)을 지원하여 다중의 OS 환경 및 온프레미스와 클라우드 환경 전반에 배포를 위한 쉽고 간단한 워크로드 오케스트레이션 환경을 구성할 수 있습니다.</p>
</div></template>


