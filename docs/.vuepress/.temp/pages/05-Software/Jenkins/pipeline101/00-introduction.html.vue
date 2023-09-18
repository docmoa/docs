<template><div><h1 id="pipeline-on-jenkins-101-introduction" tabindex="-1"><a class="header-anchor" href="#pipeline-on-jenkins-101-introduction" aria-hidden="true">#</a> Pipeline on Jenkins 101 : Introduction</h1>
<blockquote>
<p>Update at 31 Jul, 2019</p>
</blockquote>
<p>Jenkins Pipeline 을 구성하기 위해 VM 환경에서 Jenkins와 관련 Echo System을 구성합니다. 각 Product의 버전은 문서를 작성하는 시점에서의 최신 버전을 위주로 다운로드 및 설치되었습니다. 구성 기반 환경 및 버전은 필요에 따라 변경 가능합니다.</p>
<table>
<thead>
<tr>
<th>Category</th>
<th>Name</th>
<th>Version</th>
</tr>
</thead>
<tbody>
<tr>
<td>VM</td>
<td>VirtualBox</td>
<td>6.0.10</td>
</tr>
<tr>
<td>OS</td>
<td>Red Hat Enterprise Linux</td>
<td>8.0.0</td>
</tr>
<tr>
<td>JDK</td>
<td>Red Hat OpenJDK</td>
<td>1.8.222</td>
</tr>
<tr>
<td>Jenkins</td>
<td>Jenkins rpm</td>
<td>2.176.2</td>
</tr>
</tbody>
</table>
<h2 id="jenkins-실행-및-구성" tabindex="-1"><a class="header-anchor" href="#jenkins-실행-및-구성" aria-hidden="true">#</a> Jenkins 실행 및 구성</h2>
<p>Jenkins를 실행 및 구성하기위한 OS와 JDK가 준비되었다는 가정 하에 진행합니다. 필요 JDK 버전 정보는 다음과 같습니다.</p>
<ul>
<li>2.164 (2019-02) and newer: Java 8 or Java 11</li>
<li>2.54 (2017-04) and newer: Java 8</li>
<li>1.612 (2015-05) and newer: Java 7</li>
</ul>
<p>필요 JDK를 설치합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ subscription-manager repos <span class="token parameter variable">--enable</span><span class="token operator">=</span>rhel-8-for-x86_64-baseos-rpms <span class="token parameter variable">--enable</span><span class="token operator">=</span>rhel-8-for-x86_64-appstream-rpms

<span class="token comment">### Java JDK 8 ###</span>
$ yum <span class="token parameter variable">-y</span> <span class="token function">install</span> java-1.8.0-openjdk-devel

<span class="token comment">### Check JDK version ###</span>
$ <span class="token function">java</span> <span class="token parameter variable">-version</span>
openjdk version <span class="token string">"1.8.0_222"</span>
OpenJDK Runtime Environment <span class="token punctuation">(</span>build <span class="token number">1.8</span>.0_222-b10<span class="token punctuation">)</span>
OpenJDK <span class="token number">64</span>-Bit Server VM <span class="token punctuation">(</span>build <span class="token number">25.222</span>-b10, mixed mode<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Red Hatsu/Fedora/CentOS 환경에서의 Jenkins 다운로드 및 실행은 다음의 과정을 수행합니다.</p>
<blockquote>
<p>참고 url : <a href="https://pkg.jenkins.io/redhat-stable/" target="_blank" rel="noopener noreferrer">https://pkg.jenkins.io/redhat-stable/<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>
<p>repository를 등록합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">sudo</span> <span class="token function">wget</span> <span class="token parameter variable">-O</span> /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
$ <span class="token function">sudo</span> <span class="token function">rpm</span> <span class="token parameter variable">--import</span> https://pkg.jenkins.io/redhat-stable/jenkins.io.key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>작성일 기준 LTS 버전인 <code v-pre>2.176.2</code>버전을 설치합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ yum <span class="token parameter variable">-y</span> <span class="token function">install</span> jenkins
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
<p>패키지로 설치된 Jenkins의 설정파일은 <code v-pre>/etc/sysconfig/jenkins</code>에 있습니다. 해당 파일에서 실행시 활성화되는 포트 같은 설정을 변경할 수 있습니다.</p>
<div class="language-properties line-numbers-mode" data-ext="properties"><pre v-pre class="language-properties"><code><span class="token comment">## Type:        integer(0:65535)</span>
<span class="token comment">## Default:     8080</span>
<span class="token comment">## ServiceRestart: jenkins</span>
<span class="token comment">#</span>
<span class="token comment"># Port Jenkins is listening on.</span>
<span class="token comment"># Set to -1 to disable</span>
<span class="token comment">#</span>
<span class="token key attr-name">JENKINS_PORT</span><span class="token punctuation">=</span><span class="token value attr-value">"8080"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>외부 접속을 위해 Jenkins에서 사용할 포트를 방화벽에서 열어줍니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ firewall-cmd <span class="token parameter variable">--permanent</span> --add-port<span class="token operator">=</span><span class="token number">8080</span>/tcp
$ firewall-cmd <span class="token parameter variable">--reload</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>서비스를 부팅시 실행하도록 활성화하고 Jenkins를 시작합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ systemctl <span class="token builtin class-name">enable</span> jenkins 
$ systemctl start jenkins
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>실행 후 브라우저로 접속하면 Jenkins가 준비중입니다. 준비가 끝나면 <code v-pre>Unlock Jenkins</code> 페이지가 나오고 <code v-pre>/var/lib/jenkins/secrets/initialAdminPassword</code>의 값을 입력하는 과정을 설명합니다. 해당 파일에 있는 토큰 복사하여 붙여넣습니다.</p>
<p>이후 과정은 <code v-pre>Install suggested plugins</code>를 클릭하여 기본 플러그인을 설치하여 진행합니다. 경우에 따라 <code v-pre>Select plugins to install</code>을 선택하여 플러그인을 지정하여 설치할 수 있습니다.</p>
<p>플러그인 설치 과정을 선택하여 진행하면 <code v-pre>Getting Started</code> 화면으로 전환되어 플러그인 설치가 진행됩니다.</p>
<p>설치 후 기본 <code v-pre>Admin User</code> 를 생성하고, 접속 Url을 확인 후 설치과정을 종료합니다.</p>
<h2 id="github-계정생성" tabindex="-1"><a class="header-anchor" href="#github-계정생성" aria-hidden="true">#</a> GitHub 계정생성</h2>
<p>진행되는 실습에서는 일부 GitHub를 SCM으로 연동합니다. 원활한 진행을 위해 GitHub계정을 생성해주세요. 또는 별개의 Git 서버를 구축하여 사용할 수도 있습니다.</p>
<h2 id="jenkins-theme-optional" tabindex="-1"><a class="header-anchor" href="#jenkins-theme-optional" aria-hidden="true">#</a> Jenkins Theme (Optional)</h2>
<p>Jenkins는 간단히 테마와 회사 CI를 적용할 수 있는 플러그인이 제공됩니다.</p>
<ul>
<li>
<p><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>플러그인 관리</code>를 클릭합니다.</p>
</li>
<li>
<p><code v-pre>설치 가능</code> 탭을 클릭하고 상단의 검색에 <code v-pre>theme</code>를 입력하면 <code v-pre>Login Theme</code>와 <code v-pre>Simple Theme</code>를 확인 할 수 있습니다. 둘 모두 설치합니다.</p>
</li>
<li>
<p>로그아웃을 하면 로그인 페이지가 변경된 것을 확인 할 수 있습니다.</p>
</li>
</ul>
<p>기본 Jenkins 테마를 변경하기 위해서는 다음의 과정을 수행합니다.</p>
<ul>
<li>
<p><a href="http://afonsof.com/jenkins-material-theme/" target="_blank" rel="noopener noreferrer">http://afonsof.com/jenkins-material-theme/<ExternalLinkIcon/></a> 에 접속합니다.</p>
</li>
<li>
<p><code v-pre>Build your own theme with a company logo!</code> 에서 색상과 로고를 업로드 합니다.</p>
</li>
<li>
<p><code v-pre>DOWNLOAD YOUR THEME!</code>버튼을 클릭하면 CSS파일이 다운됩니다.</p>
</li>
<li>
<p><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>시스템 설정</code>를 클릭합니다.</p>
</li>
<li>
<p><code v-pre>Theme</code>항목의 <code v-pre>Theme elements</code>의 드롭다운 항목에서 <code v-pre>Extra CSS</code>를 클릭하고 앞서 다운받은 CSS파일의 내용을 붙여넣고 설정을 저장하면 적용된 테마를 확인할 수 있습니다.</p>
</li>
</ul>
</div></template>


