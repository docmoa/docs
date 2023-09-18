<template><div><h1 id="pipeline-on-jenkins-101-single-page" tabindex="-1"><a class="header-anchor" href="#pipeline-on-jenkins-101-single-page" aria-hidden="true">#</a> Pipeline on Jenkins 101 (Single Page)</h1>
<blockquote>
<p>Update at 31 Jul, 2019</p>
</blockquote>
<h2 id="introduction" tabindex="-1"><a class="header-anchor" href="#introduction" aria-hidden="true">#</a> Introduction</h2>
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
<p><strong>Jenkins 실행 및 구성</strong></p>
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
<p><strong>GitHub 계정생성</strong></p>
<p>진행되는 실습에서는 일부 GitHub를 SCM으로 연동합니다. 원활한 진행을 위해 GitHub계정을 생성해주세요. 또는 별개의 Git 서버를 구축하여 사용할 수도 있습니다.</p>
<p><strong>Jenkins Theme</strong> (Optional)</p>
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
<h2 id="_1-ci-cd" tabindex="-1"><a class="header-anchor" href="#_1-ci-cd" aria-hidden="true">#</a> 1. CI/CD</h2>
<p><strong>CI/CD Concept Definitions</strong></p>
<ul>
<li>Continuous integration</li>
<li>Continuous delivery</li>
<li>Continuous deployment</li>
<li>Source control management (SCM)</li>
</ul>
<Mermaid id="mermaid-235" code="eJxtjcEJwzAQBN9RFWogDeThT1xAIGngkBdzIN8p0sng7mOHECPjfQ6zuwXvCgnomcZMk7skysaBE4n5HjOipha+UKwlT6MRLXpkHWowVnF+zW/o2nVb++bvKsZStRbPYlifT9Tv7N+1TR4QeUZeDub+dtRT1GWCmPsA04VS8A=="></Mermaid><p><strong>Delivery vs Deployment</strong></p>
<ul>
<li>Continuous Delivery requires user intervention
<ul>
<li>When? : Stage to Production</li>
</ul>
</li>
</ul>
<p><strong>Jenkins for CI/CD</strong></p>
<ul>
<li>Open-source governance and community</li>
<li>Stability</li>
<li>Extensible</li>
<li>Visibility</li>
<li>Pipelines</li>
</ul>
<h2 id="_2-jobs" tabindex="-1"><a class="header-anchor" href="#_2-jobs" aria-hidden="true">#</a> 2. Jobs</h2>
<p><strong>Job and Project</strong></p>
<p>프로젝트는 Job의 일부 입니다. 즉, 모든 프로젝트가 Job이지만 모든 Job이 프로젝트는 아닙니다. Job의 구조는 다음과 같습니다.</p>
<Mermaid id="mermaid-292" code="eJxtjk0KwkAMRveeYpbpolcQpr8qCmLBfabEOlJmJKZYb68NIhaa5XuP8HWM96vZn1bmcxZ20SUmTdcZWPcQxlaOHG/USqJBNjlTwQGF/bigapjBWuEGKiZq5NXTgt1+v+UxXHw3MIqPYdZZ7XJoZHDTwD9YwNnT8wcLhSWUoxAH7FW8AUDhPw0="></Mermaid><p>FreeStyleProejct, MatrixProject, ExternalJob만 <code v-pre>New job</code>에 표시됩니다.</p>
<p><strong>Step 1. New pipeline</strong></p>
<p>Step 1에서는 <code v-pre>stage</code>없이 기본 Pipeline을 실행하여 수행 테스트를 합니다.</p>
<ol>
<li>
<p>Jenkins 로그인</p>
</li>
<li>
<p>좌측 <code v-pre>새로운 Item</code> 클릭</p>
</li>
<li>
<p><code v-pre>Enter an item name</code>에 Job 이름 설정 (e.g. 2.Jobs)</p>
</li>
<li>
<p><code v-pre>Pipeline</code> 선택 후 <code v-pre>OK</code> 버튼 클릭</p>
</li>
<li>
<p><code v-pre>Pipeline</code> 항목 오른 쪽 <code v-pre>Try sample Pipelie...</code>클릭하여 <code v-pre>Hello world</code> 클릭 후 저장</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>node <span class="token punctuation">{</span>
   echo <span class="token string">'Hello World'</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>좌측 <code v-pre>Build now</code>클릭</p>
</li>
<li>
<p>좌측 <code v-pre>Build History</code>의 최근 빌드된 항목(e.g. #1) 우측에 마우스를 가져가면 dropdown 버튼이 생깁니다. 해당 버튼을 클릭하여 <code v-pre>Console Output</code> 클릭</p>
</li>
<li>
<p>수행된 <code v-pre>echo</code> 동작 출력을 확인합니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>Started by user GyuSeok.Lee
Running in Durability level: MAX_SURVIVABILITY
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Jenkins in /var/lib/jenkins/workspace/2.Jobs
[Pipeline] {
[Pipeline] echo
Hello World
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<p><strong>Step 2. New pipeline</strong></p>
<p>Step 2에서는 <code v-pre>stage</code> 를 구성하여 실행합니다.</p>
<ol>
<li>
<p>기존 생성한 Job 클릭 (e.g. 02-02.Jobs)</p>
</li>
<li>
<p>좌측 <code v-pre>구성</code>을 클릭하여 <code v-pre>Pipeline</code> 스크립트를수정합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline<span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">"Hello"</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                echo <span class="token string">'Hello World'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>수정 후 좌측 <code v-pre>Build Now</code>를 클릭하여 빌드 수행 후 결과를 확인합니다.</p>
</li>
<li>
<p><code v-pre>Step 1</code>에서의 결과와는 달리 <code v-pre>Stage View</code>항목과 Pipeline stage가 수행된 결과를 확인할 수 있는 UI가 생성됩니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563942302074.png" alt="1563942302074" tabindex="0" loading="lazy"><figcaption>1563942302074</figcaption></figure>
</li>
<li>
<p>수행된 빌드의 <code v-pre>Console Output</code>을 확인하면 앞서 <code v-pre>Step 1</code>에서는 없던 stage 항목이 추가되어 수행됨을 확인 할 수 있습니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>Started by user GyuSeok.Lee
Running in Durability level: MAX_SURVIVABILITY
[Pipeline] Start of Pipeline
[Pipeline] node
Running on Jenkins in /var/lib/jenkins/workspace/2.Jobs
[Pipeline] {
[Pipeline] stage
[Pipeline] { (Hello)
[Pipeline] echo
Hello World
[Pipeline] }
[Pipeline] // stage
[Pipeline] }
[Pipeline] // node
[Pipeline] End of Pipeline
Finished: SUCCESS
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<p><strong>Step 3. Parameterizing a job</strong></p>
<p>Pipeline 내에서 사용되는 매개변수 정의를 확인해 봅니다. Pipeline 스크립트는 다음과 같습니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    parameters <span class="token punctuation">{</span>
        <span class="token function">string</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token string">'Greeting'</span><span class="token punctuation">,</span> defaultValue<span class="token punctuation">:</span> <span class="token string">'Hello'</span><span class="token punctuation">,</span> description<span class="token punctuation">:</span> <span class="token string">'How should I greet the world?'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Example'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                echo <span class="token interpolation-string"><span class="token string">"</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">params<span class="token punctuation">.</span>Greeting</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> World!"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>parameters</code>항목내에 매개변수의 데이터 유형(e.g. string)을 정의합니다. <code v-pre>name</code>은 값을 담고있는 변수이고 <code v-pre>defaultValue</code>의 값을 반환합니다. Pipeline에 정의된 <code v-pre>parameters</code>는 <code v-pre>params</code>내에 정의 되므로 <code v-pre>${params.매개변수이름}</code>과 같은 형태로 호출 됩니다.</p>
<p>저장 후 다시 <code v-pre>구성</code>을 확인하면 <code v-pre>이 빌드는 매개변수가 있습니다</code>가 활성화 되고 내부에 추가된 매개변수 항목을 확인 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563944944350.png" alt="1563944944350" tabindex="0" loading="lazy"><figcaption>1563944944350</figcaption></figure>
<p>이렇게 저장된 Pipeline Job은 매개변수를 외부로부터 받을 수 있습니다. 따라서 좌측의 기존 <code v-pre>Build Now</code>는 <code v-pre>build with Parameters</code>로 변경되었고, 이를 클릭하면 Greeting을 정의할 수 있는 UI가 나타납니다. 해당 매개변수를 재정의 하여 빌드를 수행할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563944733249.png" alt="1563944733249" tabindex="0" loading="lazy"><figcaption>1563944733249</figcaption></figure>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563944765637.png" alt="1563944765637" tabindex="0" loading="lazy"><figcaption>1563944765637</figcaption></figure>
<p><strong>Step 4. Creating multiple steps for a job</strong></p>
<p>다중스텝을 위한 Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 02-04.MultiStep)</p>
<p>Pipeline에 다음과 같이 스크립트를 추가합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'echo "Hello World"'</span>
                sh <span class="token string">'''
                    echo "Multiline shell steps works too"
                    ls -lah
                '''</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>'''</code>은 스크립트 정의 시 여러줄을 입력할 수 있도록 묶어주는 역할을 합니다.  해당 스크립트에서는 <code v-pre>sh</code>로 구분된 스크립트 명령줄이 두번 수행됩니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563945323777.png" alt="1563945323777" tabindex="0" loading="lazy"><figcaption>1563945323777</figcaption></figure>
<p>실행되는 여러 스크립트의 수행을 <code v-pre>stage</code>로 구분하기위해 기존 Pipeline 스크립트를 다음과 같이 수정합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build-1'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'echo "Hello World"'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build-2'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'''
                    echo "Multiline shell steps works too"
                    ls -lah
                '''</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>stage를 구분하였기 때문에 각 실행되는 <code v-pre>sh</code> 스크립트는 각 스테이지에서 한번씩 수행되며, 이는 빌드의 결과로 나타납니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563945539114.png" alt="1563945539114" tabindex="0" loading="lazy"><figcaption>1563945539114</figcaption></figure>
<p><strong>Step 5. Adding scripts as a job step</strong></p>
<p>Pipeline의 step을 추가하여 결과를 확인하는 과정을 설명합니다. 피보나치 수열을 수행하는 쉘 스크립트를 시간제한을 두어 수행하고 그 결과를 확인합니다.</p>
<p>Jenkins가 설치된 서버에 [피보나치 수열]([<a href="https://namu.wiki/w/%ED%94%BC%EB%B3%B4%EB%82%98%EC%B9%98%20%EC%88%98%EC%97%B4" target="_blank" rel="noopener noreferrer">https://namu.wiki/w/피보나치 수열<ExternalLinkIcon/></a>](<a href="https://namu.wiki/w/%ED%94%BC%EB%B3%B4%EB%82%98%EC%B9%98" target="_blank" rel="noopener noreferrer">https://namu.wiki/w/피보나치<ExternalLinkIcon/></a> 수열))을 수행하는 스크립트를 작성합니다. Sleep이 있기 때문에 일정 시간 이상 소요 됩니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /var/jenkins_home/scripts
$ <span class="token builtin class-name">cd</span> /var/jenkins_home/scripts
$ <span class="token function">vi</span> ./fibonacci.sh
<span class="token comment">#!/bin/bash</span>
<span class="token assign-left variable">N</span><span class="token operator">=</span><span class="token variable">${1<span class="token operator">:-</span>10}</span>

<span class="token assign-left variable">a</span><span class="token operator">=</span><span class="token number">0</span>
<span class="token assign-left variable">b</span><span class="token operator">=</span><span class="token number">1</span>

<span class="token builtin class-name">echo</span> <span class="token string">"The Fibonacci series is : "</span>

<span class="token keyword">for</span> <span class="token variable"><span class="token punctuation">((</span> i<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span> i<span class="token operator">&lt;</span>N<span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">))</span></span>
<span class="token keyword">do</span>
    <span class="token builtin class-name">echo</span> <span class="token string">"<span class="token variable">$a</span>"</span>
    <span class="token function">sleep</span> <span class="token number">2</span>
    <span class="token assign-left variable">fn</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$((</span>a <span class="token operator">+</span> b<span class="token variable">))</span></span>
    <span class="token assign-left variable">a</span><span class="token operator">=</span><span class="token variable">$b</span>
    <span class="token assign-left variable">b</span><span class="token operator">=</span><span class="token variable">$fn</span>
<span class="token keyword">done</span>
<span class="token comment"># End of for loop</span>

$ <span class="token function">chown</span> <span class="token parameter variable">-R</span> jenkins /var/jenkins_home/
$ <span class="token function">chmod</span> +x /var/jenkins_home/scripts/fibonacci.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>다중스텝을 위한 Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 02-05.AddingStep)</p>
<p>Pipeline에 다음과 같이 스크립트를 추가합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Deploy'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                <span class="token function">timeout</span><span class="token punctuation">(</span>time<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> unit<span class="token punctuation">:</span> <span class="token string">'MINUTES'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token string">'/var/jenkins_home/scripts/fibonacci.sh 5'</span>
                <span class="token punctuation">}</span>
                <span class="token function">timeout</span><span class="token punctuation">(</span>time<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> unit<span class="token punctuation">:</span> <span class="token string">'MINUTES'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token string">'/var/jenkins_home/scripts/fibonacci.sh 32'</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>steps</code>에 스크립트를 <code v-pre>timeout</code>이 감싸고 있으며, 각 스크립트의 제한시간은 1분입니다. 빌드를 수행하면 최종적으로는 <code v-pre>aborted</code>, 즉 중단됨 상태가 되는데 그 이유는 빌드 기록에서 해당 빌드를 클릭하면 확인 가능합니다.</p>
<ul>
<li>
<p><code v-pre>Build History</code>에서 최신 빌드를 클릭합니다.</p>
</li>
<li>
<p>좌측 <code v-pre>Pipeline Steps</code>를 클릭하면 Pipeline 수행 스텝을 확인할 수 있습니다.</p>
</li>
<li>
<p>첫번째로 나타나는 <code v-pre>/var/jenkins_home/scripts/fibonacci.sh 5</code> 를 수행하는 <code v-pre>Shell Script</code>의 콘솔창 버튼을 클릭하면 잘 수행되었음을 확인 할 수 있습니다.</p>
</li>
<li>
<p>두번째로 나타나는 <code v-pre>/var/jenkins_home/scripts/fibonacci.sh 32</code> 를 수행하는 <code v-pre>Shell Script</code>의 콘솔창 버튼을 클릭하면 다음과 같이 중도에 프로세스를 중지한 것을 확인 할 수 있습니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>+ /var/jenkins_home/scripts/fibonacci.sh 32
The Fibonacci series is : 
0
1
1
2
3
...
317811
514229
Sending interrupt signal to process
/var/jenkins_home/scripts/fibonacci.sh: line 16: 13543 Terminated              sleep 2
832040
/var/lib/jenkins/workspace/02-05.AddingStep@tmp/durable-e44bb232/script.sh: line 1: 13109 Terminated              /var/jenkins_home/scripts/fibonacci.sh 32
script returned exit code 143
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h2 id="_3-builds" tabindex="-1"><a class="header-anchor" href="#_3-builds" aria-hidden="true">#</a> 3. Builds</h2>
<p><strong>Step 1. Tracking build state</strong></p>
<p>Pipeline이 수행되는 동작을 추적하는 과정을 확인합니다. 이를 이를 위한 Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 03-01.TrackingBuildState)</p>
<p>Pipeline에 다음과 같이 스크립트를 추가합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Deploy'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                <span class="token function">timeout</span><span class="token punctuation">(</span>time<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> unit<span class="token punctuation">:</span> <span class="token string">'MINUTES'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token string">'for n in `seq 1 10`; do echo $n; sleep 1; done'</span>
                <span class="token punctuation">}</span>
                <span class="token function">timeout</span><span class="token punctuation">(</span>time<span class="token punctuation">:</span> <span class="token number">1</span><span class="token punctuation">,</span> unit<span class="token punctuation">:</span> <span class="token string">'MINUTES'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    sh <span class="token string">'for n in `seq 1 50`; do echo $n; sleep 1; done'</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>Build Now</code>를 클릭하여 빌드를 수행합니다. 그러면, 좌측의 <code v-pre>Build History</code>에 새로운 기록이 생성되면서 동작 중인것을 확인 할 수 있습니다.</p>
<p>첫번째 방법은 앞서 확인한 <code v-pre>Pipeline Steps</code>를 확인하는 것입니다. 다시한번 확인하는 방법을 설명합니다.</p>
<ul>
<li><code v-pre>Build History</code>에서 최신 빌드를 클릭합니다.</li>
<li>좌측 <code v-pre>Pipeline Steps</code>를 클릭하면 Pipeline 수행 스텝을 확인할 수 있습니다.</li>
</ul>
<p>현재 수행중인 Pipeline이 어떤 단계가 수행중인지 각 스탭별로 확인할 수 있고 상태를 확인할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563948810815.png" alt="1563948810815" tabindex="0" loading="lazy"><figcaption>1563948810815</figcaption></figure>
<p>두번째 방법은 출력되는 콘솔 로그를 확인하는 것입니다. Jenkins에서 빌드를 수행하면 빌드 수행 스크립트가 내부에 임시적으로 생성되어 작업을 실행합니다. 이때 발생되는 로그는 <code v-pre>Console Output</code>을 통해 거의 실시간으로 동작을 확인 할 수 있습니다.</p>
<ul>
<li><code v-pre>Build History</code>에서 최신 빌드에 마우스 포인터를 가져가면 우측에 드롭박스가 생깁니다. 또는 해당 히스토리를 클릭합니다.</li>
<li>드롭 박스의  <code v-pre>Console Output</code>나 클릭된 빌드 히스토리 상태에서 <code v-pre>Console Output</code>를 클릭하면 수행중인 콘솔상의 출력을 확인합니다.</li>
</ul>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563948863834.png" alt="1563948863834" tabindex="0" loading="lazy"><figcaption>1563948863834</figcaption></figure>
<p>마지막으로는 Pipeline을 위한 UI인 <code v-pre>BlueOcean</code> 플러그인을 활용하는 방법입니다. Blue Ocean은 Pipeline에 알맞은 UI를 제공하며 수행 단계와 각 단게별 결과를 쉽게 확인할 수 있습니다.</p>
<ul>
<li><code v-pre>Jenkins 관리</code>에서 <code v-pre>플러그인 관리</code>를 선택합니다.</li>
<li><code v-pre>설치 가능</code> 탭에서 <code v-pre>Blue Ocean</code>을 선택하여 <code v-pre>재시작 없이 설치</code>를 클릭 합니다.</li>
<li><code v-pre>Blue Ocean</code>플러그인만 선택하여 설치하더라도 관련 플러그인들이 함께 설치 진행됩니다.</li>
<li>설치 완료되면 좌측 메뉴에서 <code v-pre>Blue Ocean</code>항목을 확인 할 수 있습니다.</li>
</ul>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563949823939.png" alt="1563949823939" tabindex="0" loading="lazy"><figcaption>1563949823939</figcaption></figure>
<p><strong>Step 2. Polling SCM for build triggering</strong></p>
<p>Git SCM을 기반으로 Pipeline을 설정하는 과정을 설명합니다. 이를 이를 위한 Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 03-02.PollingSCMforBuildTriggering)</p>
<p>해당 과정을 수행하기 위해서는 다음의 구성이 필요합니다.</p>
<ul>
<li>
<p>Jenkins가 구성된 호스트에 git 설치</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ yum <span class="token parameter variable">-y</span> <span class="token function">install</span> <span class="token function">git</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>Jenkins 설정</p>
<ul>
<li><code v-pre>Jenkins 관리</code>의 <code v-pre>Global Tool Configuration</code>클릭</li>
<li>Git 항목에 <code v-pre>Path to Git executable</code> 칸에 Path 입력 (e.g. /usr/bin/git)</li>
</ul>
</li>
</ul>
<p>Pipeline을 다음과 같이 설정합니다.</p>
<ul>
<li>Definition : Pipeline script from SCM</li>
<li>SCM : Git</li>
<li>Repositories
<ul>
<li>Repository URL : <a href="https://github.com/Great-Stone/jenkins-git" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/jenkins-git<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<p>추가로 빌드 트리거를 위한 설정을 합니다.</p>
<ul>
<li>
<p><code v-pre>Build Triggers</code>의 <code v-pre>Poll SCM</code> 활성화</p>
</li>
<li>
<p>Schedule 등록</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># min hour day month day_of_week</span>
* * * * *
<span class="token comment"># will run every minute on the minute</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<p>Polling으로 인한 빌드 트리거가 동작하면 좌측 메뉴의 <code v-pre>Polling Log</code>에서 상태 확인이 가능합니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563958295010.png" alt="1563958295010" tabindex="0" loading="lazy"><figcaption>1563958295010</figcaption></figure>
<p>1분마다 확인 하도록 되어있기 때문에 다시 Polling을 시도하지만 변경사항이 없는 경우에는 Polling Log에 <code v-pre>No changes</code> 메시지가 나타나고 빌드는 수행되지 않습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1563958396611.png" alt="1563958396611" tabindex="0" loading="lazy"><figcaption>1563958396611</figcaption></figure>
<p><strong>Step 3. Connecting Jenkins to GitHub</strong></p>
<p>GitHub를 통한 CI 과정을 설명합니다. WebHook의 설정과 Jenkins에 관련 설정은 어떻게 하는지 알아봅니다.</p>
<p>Jenkins에서 접속가능하도록 GitHub에서 Token을 생성합니다.</p>
<ul>
<li>
<p><a href="http://github.com" target="_blank" rel="noopener noreferrer">github.com<ExternalLinkIcon/></a>에 접속하여 로그인합니다.</p>
</li>
<li>
<p>우측 상단의 드롭박스에서 <code v-pre>Settings</code>선택 후 좌측 메뉴 맨 아래의 <code v-pre>Developer settings</code>를 선택합니다.</p>
</li>
<li>
<p><code v-pre>Developer settings</code>화면에서 좌측 메뉴 하단 <code v-pre>Personal access tockes</code>를 클릭하고, 화면이 해당 페이지로 변경되면 <code v-pre>Generate new token</code>버튼을 클릭합니다.</p>
</li>
<li>
<p>Token description에 Token설명을 입력하고 입니다. (e.g. jenkins-integration) 생성합니다. 생성시 <code v-pre>repo</code>, <code v-pre>admin:repo_hook</code>, <code v-pre>notifications</code>항목은 활성화 합니다.</p>
</li>
<li>
<p><code v-pre>Generate token</code>버튼을 클릭하여 Token 생성이 완료되면 발급된 Token을 확인 할 수 있습니다. 해당 값은 Jenkins에서 Git연동설정 시 필요합니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564115701058.png" alt="1564115701058" tabindex="0" loading="lazy"><figcaption>1564115701058</figcaption></figure>
</li>
</ul>
<p>우선 Jenkins에 Git연동을 위한 설정을 추가합니다.</p>
<ul>
<li><code v-pre>Jenkins 관리</code>에서 <code v-pre>시스템 설정</code>을 클릭합니다.</li>
<li><code v-pre>GitHub</code> 항목의 <code v-pre>GitHub Servers</code>의 <code v-pre>Add GitHub Server &gt; GitHub Server</code>를 선택합니다.</li>
<li>항목의 입력정보는 다음과 같습니다.
<ul>
<li>Name : 설정이름을 입력합니다. (e.g. github)</li>
<li>API URL : <a href="https://api.github.com" target="_blank" rel="noopener noreferrer">https://api.github.com<ExternalLinkIcon/></a></li>
<li>Credentials : <code v-pre>ADD</code>트롭박스를 선택합니다.
<ul>
<li>기본 Credendial을 선택합니다. (e.g. Jenkins)</li>
<li>Kind 항목을 <code v-pre>Secret text</code>로 선택합니다.
<ul>
<li>Scope : Global(Jenkins, nodes, Items, all child items, etc)</li>
<li>Secret : GitHub에서 복사한 Token 값을 입력합니다.</li>
<li>ID : Credential ID를 입력합니다. (e.g. jenkins-integration)</li>
<li><code v-pre>ADD</code> 버튼 클릭하여 새로운 Credendial을 추가합니다.</li>
</ul>
</li>
<li>다시 <code v-pre>시스템 설정</code>화면으로 나오면 Credentials의 <code v-pre>-none-</code>드롭박스에 추가한 Credential을 선택합니다.</li>
</ul>
</li>
<li><code v-pre>TEST CONNECTION</code>버튼을 클릭하여 정상적으로 연결이 되는지 확인합니다.
<ul>
<li>정상적으로 연결되면 <code v-pre>Credentials verified for user Great-Stone, rate limit: 4998</code> 와같은 메시지가 출력됩니다.</li>
</ul>
</li>
<li>Manage hook 를 활성화 합니다.</li>
</ul>
</li>
<li>시스템 설정을 저장합니다.</li>
</ul>
<p><strong>Step 4. Webhook build triggering</strong></p>
<p>git repo의 Webhook 을 통한 빌드를 수행합니다. GitHub에 다음과 같이 설정합니다.</p>
<ul>
<li>
<p><a href="https://github.com/Great-Stone/jenkins-git" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/jenkins-git<ExternalLinkIcon/></a> 를 <code v-pre>fork</code>합니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564122799631.png" alt="1564122799631" tabindex="0" loading="lazy"><figcaption>1564122799631</figcaption></figure>
</li>
<li>
<p>우측 상단의 드롭박스에서 <code v-pre>Settings</code>선택 후 좌측 메뉴 맨 아래의 <code v-pre>Developer settings</code>를 선택합니다.</p>
</li>
<li>
<p><code v-pre>Developer settings</code>화면에서 좌측 메뉴 하단 <code v-pre>Personal access tockes</code>를 클릭하고, 화면이 해당 페이지로 변경되면 <code v-pre>Generate new token</code>버튼을 클릭합니다.</p>
</li>
<li>
<p>Token description에 Token설명을 입력하고 입니다. (e.g. jenkins-webhook) 생성합니다. 생성시 <code v-pre>repo</code>, <code v-pre>admin:repo_hook</code>, <code v-pre>notifications</code>항목은 활성화 합니다.</p>
</li>
<li>
<p><code v-pre>Generate token</code>버튼을 클릭하여 Token 생성이 완료되면 발급된 Token을 확인 할 수 있습니다. 해당 값은 Jenkins에서 Git연동설정 시 필요합니다.</p>
</li>
</ul>
<p>Webhook을 위한 <code v-pre>Pipeline</code> 타입의 Item을 추가로 생성합니다. (e.g. 03-04.WebhookBuild Triggering)</p>
<p>설정은 다음과 같이 수행합니다.</p>
<ol>
<li>
<p><code v-pre>Pipeline</code> 설정의 <code v-pre>Definition</code>의 드롭다운을 선택하여 <code v-pre>Pipeline script from SCM</code>을 선택합니다.</p>
</li>
<li>
<p><code v-pre>SCM</code>항목은 <code v-pre>Git</code>을 선택하고 하위 필드를 다음과 같이 정의합니다.</p>
<ul>
<li>
<p>Repositories :</p>
<ul>
<li>
<p><code v-pre>Repository URL</code>을 입력하는데, GitHub에서 git url을 얻기위해서는 웹브라우저에서 해당 repository로 이동하여 <code v-pre>Clone or download</code> 버튼을 클릭하여 Url을 복사하여 붙여넣습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564365395583.png" alt="1564365395583" tabindex="0" loading="lazy"><figcaption>1564365395583</figcaption></figure>
</li>
<li>
<p>Credentials : <code v-pre>ADD</code>트롭박스를 선택합니다.</p>
<ul>
<li>기본 Credendial을 선택합니다. (e.g. Jenkins)</li>
<li>Kind 항목을 <code v-pre>Username with password</code>로 선택합니다.
<ul>
<li>Scope : Global(Jenkins, nodes, Items, all child items, etc)</li>
<li>Username : GitHub의 사용자 아이디를 입력합니다.</li>
<li>Secret : GitHub사용자 패스워드를 입력합니다.</li>
<li>ID : Credential ID를 입력합니다. (e.g. jenkins-webhook)</li>
<li><code v-pre>ADD</code> 버튼 클릭하여 새로운 Credendial을 추가합니다.</li>
</ul>
</li>
<li>다시 <code v-pre>시스템 설정</code>화면으로 나오면 Credentials의 <code v-pre>-none-</code>드롭박스에 추가한 Credential을 선택합니다.</li>
</ul>
</li>
</ul>
</li>
<li>
<p>Script Path : Pipeline 스크립트가 작성된 파일 패스를 지정합니다. 예제 소스에서는 root 위치에 <code v-pre>Jenkinsfile</code>로 생성되어있으므로 해당 칸에는 <code v-pre>Jenkinsfile</code>이라고 입력 합니다.</p>
</li>
</ul>
</li>
</ol>
<p>저장 후 좌측 메뉴의 <code v-pre>Build Now</code>를 클릭하면 SCM에서 소스를 받고 Pipeline을 지정한 스크립트로 수행하는 것을 확인 할 수 있습니다.</p>
<h2 id="_4-agents-and-distributing-builds" tabindex="-1"><a class="header-anchor" href="#_4-agents-and-distributing-builds" aria-hidden="true">#</a> 4. Agents and Distributing Builds</h2>
<p>빌드를 수행하기 위한 Worker로 다중 Jenkins를 컨트롤 할 수 있습니다. 이때 명령을 수행하는 Jenkins는 <code v-pre>Master</code>, 빌드를 수행하는 Jenkins는 <code v-pre>Worker</code>로 구분합니다. 여기서는 Worker의 연결을 원격 호스트의 Jenkins를 SSH를 통해 연결하는 방식과 컨테이너로 구성된 Jenkins를 연결하는 과정을 확인 합니다.</p>
<p>Master-Slave 방식, 또는 Master-Agent 방식으로 표현합니다.</p>
<p><strong>※ Slave 호스트에 Jenkins를 설치할 필요는 없습니다.</strong></p>
<p><strong>Step 1. Adding an SSH build agent to Jenkins</strong></p>
<p>Worker가 실행되는 Slave 호스트에 SSH key를 생성하고 Worker 호스트에 인증 키를 복사하는 과정은 다음과 같습니다.</p>
<ol>
<li>
<p>키 생성 및 복사(jenkins 를 수행할 유저를 생성해야 합니다.)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># User가 없는 경우 새로운 Jenkins slave 유저 추가</span>
$ <span class="token function">useradd</span> jenkins
$ <span class="token function">passwd</span> jenkins
Changing password <span class="token keyword">for</span> user jenkins.
New password:
Retype new password:

<span class="token comment"># Slave 호스트에서 ssh 키를 생성합니다.</span>
$ ssh-keygen <span class="token parameter variable">-t</span> rsa
Generating public/private rsa key pair.
Enter <span class="token function">file</span> <span class="token keyword">in</span> <span class="token function">which</span> to save the key <span class="token punctuation">(</span>/root/.ssh/id_rsa<span class="token punctuation">)</span>: <span class="token operator">&lt;</span>enter<span class="token operator">></span>
Created directory <span class="token string">'/root/.ssh'</span><span class="token builtin class-name">.</span>
Enter passphrase <span class="token punctuation">(</span>empty <span class="token keyword">for</span> no passphrase<span class="token punctuation">)</span>: <span class="token operator">&lt;</span>enter<span class="token operator">></span>
Enter same passphrase again: <span class="token operator">&lt;</span>enter<span class="token operator">></span>
Your identification has been saved <span class="token keyword">in</span> /root/.ssh/id_rsa.
Your public key has been saved <span class="token keyword">in</span> /root/.ssh/id_rsa.pub.
The key fingerprint is: <span class="token operator">&lt;</span>enter<span class="token operator">></span>
SHA256:WFU7MRVViaU1mSmCA5K+5yHfx7X+aV3U6/QtMSUoxug root@jenkinsecho.gyulee.com
The key's randomart image is:
+---<span class="token punctuation">[</span>RSA <span class="token number">2048</span><span class="token punctuation">]</span>----+
<span class="token operator">|</span>     <span class="token punctuation">..</span><span class="token punctuation">..</span> o.+.<span class="token operator">=</span>*O<span class="token operator">|</span>
<span class="token operator">|</span>     <span class="token punctuation">..</span>  + <span class="token builtin class-name">.</span> *o<span class="token operator">=</span>.<span class="token operator">|</span>
<span class="token operator">|</span>    <span class="token builtin class-name">.</span>   .o. +o. <span class="token builtin class-name">.</span><span class="token operator">|</span>
<span class="token operator">|</span>     <span class="token builtin class-name">.</span> o. + <span class="token punctuation">..</span>. +<span class="token operator">|</span>
<span class="token operator">|</span>      o.S. <span class="token builtin class-name">.</span>   +.<span class="token operator">|</span>
<span class="token operator">|</span>     o oE    .oo.<span class="token operator">|</span>
<span class="token operator">|</span>      <span class="token operator">=</span> o <span class="token builtin class-name">.</span> <span class="token builtin class-name">.</span> +o<span class="token operator">=</span><span class="token operator">|</span>
<span class="token operator">|</span>       o <span class="token builtin class-name">.</span> o <span class="token punctuation">..</span>o<span class="token operator">=</span><span class="token operator">|</span>
<span class="token operator">|</span>          <span class="token builtin class-name">.</span> <span class="token punctuation">..</span>o+ <span class="token operator">|</span>
+----<span class="token punctuation">[</span>SHA256<span class="token punctuation">]</span>-----+

$ <span class="token builtin class-name">cd</span> ~/.ssh
$ <span class="token function">cat</span> ./id_rsa.pub <span class="token operator">></span> ./authorized_keys
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>Jenkins 관리</code>의 <code v-pre>노드 관리</code>를 선택합니다.</p>
</li>
<li>
<p>좌측 메뉴에서 <code v-pre>신규 노드</code>를 클릭합니다.</p>
</li>
<li>
<p>노드명에 고유한 이름을 입력하고 <code v-pre>Permanent Agent</code> 를 활성화 합니다.</p>
</li>
<li>
<p>새로운 노드에 대한 정보를 기입합니다.</p>
<ul>
<li>Name : 앞서 입력한 노드 이름 입니다.</li>
</ul>
</li>
</ol>
<ul>
<li># of executors : Jenkins에서 빌드시 사용할 실행 스레드 개수 입니다. 가용 Core수에 비례하여 설정합니다.
<ul>
<li>Remote root directory : 빌드시 사용할 디렉토리를 지정합니다. Lunux/Unix 계열에서는 해당 디렉토리의 권한을 확인해줍니다.</li>
</ul>
</li>
<li>Labels : Worker노드를 논리적으로 그룹화하는데 사용되는 값입니다. 예를들어 GPU나 HighCPU 모델같은 용도로 구분할 수 있습니다. (e.g. Metal)
<ul>
<li>Usage : <code v-pre>Use this node as much as possible</code></li>
<li>Launch method : <code v-pre>Launch agent agents via SSH</code> 로 설정합니다.
<ul>
<li>Host : Worker 호스트에 접근 가능한 IP 혹은 Hostname을 입력합니다.</li>
<li>Credentials : 앞서 설정한 SSH 키를 등록합니다.
<ul>
<li>우측에 <code v-pre>ADD &gt; Jenkins</code>를 클릭합니다.</li>
<li>Kind : <code v-pre>SSH Username with private key</code>를 선택합니다.</li>
<li>ID : 고유한 키 값을 넣어줍니다. (e.g. jenkins-ssh)</li>
<li>Username : jenkins (Slave 호스트의 사용자 이름입니다.)</li>
<li>Private Key : Enter directly 를 사용하여 앞서 생성한 <code v-pre>~/.ssh/id_rsa</code> 의 내용을 붙여넣어줍니다. (일반적으로 <code v-pre>-----BEGIN RSA PRIVATE KEY-----</code>로 시작하는 내용입니다.)</li>
</ul>
</li>
<li>Host Key Verification Strategy : <code v-pre>Non verifying verification strategy</code> 를 선택합니다.</li>
</ul>
</li>
<li>저장 버튼을 클릭하면 Node 설정 화면과 왼쪽 <code v-pre>빌드 실행 상태</code>에 새로운 Slave Node가 추가됨을 확인 할 수 있습니다.</li>
</ul>
</li>
</ul>
<p>Label 지정한 Slave Worker에서 빌드가 수행되도록 기존 02-02.Jobs의 Pipeline 스크립트를 수정합니다. 기존 <code v-pre>agent any</code>를 다음과 같이 <code v-pre>agent { label 'Metal' }</code>로 변경합니다. 해당 pipeline은 label이 <code v-pre>Metal</code>로 지정된 Worker에서만 빌드를 수행합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span> label <span class="token string">'Metal'</span> <span class="token punctuation">}</span>
    parameters <span class="token punctuation">{</span>
        <span class="token function">string</span><span class="token punctuation">(</span>name<span class="token punctuation">:</span> <span class="token string">'Greeting'</span><span class="token punctuation">,</span> defaultValue<span class="token punctuation">:</span> <span class="token string">'Hello'</span><span class="token punctuation">,</span> description<span class="token punctuation">:</span> <span class="token string">'How should I greet the world?'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Example'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                echo <span class="token interpolation-string"><span class="token string">"</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">params<span class="token punctuation">.</span>Greeting</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> World!"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564378013035.png" alt="1564378013035" tabindex="0" loading="lazy"><figcaption>1564378013035</figcaption></figure>
<p><strong>Step 2. Using Docker images for agents</strong></p>
<p>Master Jenkins 호스트에서 docker 서비스에 설정을 추가합니다. docker 설치가 되어있지 않은 경우 설치가 필요합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ yum <span class="token parameter variable">-y</span> <span class="token function">install</span> <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote>
<p>RHEL8 환경이 Master인 경우 위와 같은 방식으로 설치를 진행하면 변경된 패키지에 따라 <code v-pre>podman-docker</code>가 설치 됩니다. 아직 Jenkins에서는 2019년 7월 29일 기준 <code v-pre>podman</code>을 지원하지 않음으로 별도 yum repository를 추가하여 진행합니다. <code v-pre>docker-ce</code> 최신 버전에서는 <code v-pre>containerd.io</code> 의 필요 버전이 <code v-pre>1.2.2-3</code> 이상이나 RHEL8에서 지원하지 않음으로 별도로 버전을 지정하여 설치합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ yum <span class="token parameter variable">-y</span> <span class="token function">install</span> yum-utils
$ yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
$ <span class="token function">sudo</span> yum repolist <span class="token parameter variable">-v</span>
<span class="token punctuation">..</span>.
Repo-id      <span class="token builtin class-name">:</span> docker-ce-stable
Repo-name    <span class="token builtin class-name">:</span> Docker CE Stable - x86_64
Repo-revision: <span class="token number">1564098258</span>
Repo-updated <span class="token builtin class-name">:</span> Fri <span class="token number">26</span> Jul <span class="token number">2019</span> 08:44:18 AM KST
Repo-pkgs    <span class="token builtin class-name">:</span> <span class="token number">47</span>
Repo-size    <span class="token builtin class-name">:</span> <span class="token number">982</span> M
Repo-baseurl <span class="token builtin class-name">:</span> https://download.docker.com/linux/centos/7/x86_64/stable
Repo-expire  <span class="token builtin class-name">:</span> <span class="token number">172,800</span> second<span class="token punctuation">(</span>s<span class="token punctuation">)</span> <span class="token punctuation">(</span>last: Thu <span class="token number">25</span> Jul <span class="token number">2019</span> 07:33:33 AM KST<span class="token punctuation">)</span>
Repo-filename: /etc/yum.repos.d/docker-ce.repo
<span class="token punctuation">..</span>.

$ yum <span class="token parameter variable">-y</span> <span class="token function">install</span> docker-ce-3:18.09.1-3.el7
$ systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span>
$ systemctl start <span class="token function">docker</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote>
<ul>
<li>
<p>docker를 설치 한 뒤 API를 위한 TCP 포트를 활성화하는 작업을 진행합니다.<code v-pre>/lib/systemd/system/docker.service</code>에 <code v-pre>ExecStart</code> 옵션 뒤에 다음과 같이 <code v-pre>-H tcp://0.0.0.0:4243</code>을 추가합니다.</p>
<div class="language-properties line-numbers-mode" data-ext="properties"><pre v-pre class="language-properties"><code>...
[Service]
<span class="token key attr-name">Type</span><span class="token punctuation">=</span><span class="token value attr-value">notify</span>
<span class="token comment"># the default is not to use systemd for cgroups because the delegate issues still</span>
<span class="token comment"># exists and systemd currently does not support the cgroup feature set required</span>
<span class="token comment"># for containers run by docker</span>
<span class="token key attr-name">ExecStart</span><span class="token punctuation">=</span><span class="token value attr-value">/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:4243</span>
<span class="token key attr-name">ExecReload</span><span class="token punctuation">=</span><span class="token value attr-value">/bin/kill -s HUP $MAINPID</span>
<span class="token key attr-name">TimeoutSec</span><span class="token punctuation">=</span><span class="token value attr-value">0</span>
<span class="token key attr-name">RestartSec</span><span class="token punctuation">=</span><span class="token value attr-value">2</span>
<span class="token key attr-name">Restart</span><span class="token punctuation">=</span><span class="token value attr-value">always</span>
...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>수정 후 서비스를 재시작합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ systemctl daemon-reload
$ systemctl restart <span class="token function">docker</span>
$ <span class="token function">docker</span> <span class="token function">ps</span>
CONTAINER ID    IMAGE    COMMAND    CREATED    STATUS    PORTS    NAMES

$ <span class="token function">usermod</span> <span class="token parameter variable">-aG</span> <span class="token function">docker</span> jenkins
$ <span class="token function">chmod</span> <span class="token number">777</span> /var/run/docker.sock
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<p>Jenkins에 새로운 플러그인을 추가하고 설정합니다.</p>
<ul>
<li>
<p><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>플러그인 관리</code>를 클릭합니다.</p>
</li>
<li>
<p><code v-pre>설치 가능</code> 탭을 클릭하고 상단의 검색에 <code v-pre>docker</code>를 입력하면 <code v-pre>docker</code>플러그인이 나타납니다. 선택하여 설치를 진행하고 Jenkins를 재시작 합니다.</p>
</li>
<li>
<p><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>시스템 설정</code>을 클릭합니다.</p>
</li>
<li>
<p><code v-pre>Cloud</code>항목 아래 <code v-pre>ADD A NEW CLOUD</code> 드롭박스에 있는 <code v-pre>Docker</code>를 선택합니다.</p>
<ul>
<li>
<p>Name은 기본 값으로 진행하고 <code v-pre>DOCKER CLOUD DETAILS...</code> 버튼을 클릭합니다.</p>
</li>
<li>
<p>Docker Host URI : 앞서 설정한 port로 연결합니다. (e.g. tcp://master:4243)</p>
</li>
<li>
<p><code v-pre>TEST CONNECTION</code> 버튼을 눌러 정상적으로 Version 정보와 API Version이 표기되는지 확인합니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>Version = 18.09.1, API Version = 1.39
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>Enabled를 활성화 합니다.</p>
</li>
</ul>
</li>
</ul>
<p>Docker 실행을 위한 Item을 생성합니다. (e.g. 04-02.UsingDockerImagesForAgents)</p>
<ol>
<li><code v-pre>Pipeline</code> 스크립트를 구성합니다.</li>
</ol>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent <span class="token punctuation">{</span>
        docker <span class="token punctuation">{</span> image <span class="token string">'node:latest'</span> <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Test'</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'node --version'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li>
<p>수정 후 좌측 <code v-pre>Build Now</code>를 클릭하여 빌드 수행 후 결과를 확인합니다.</p>
</li>
<li>
<p><code v-pre>Step 1</code>에서의 결과와는 달리 <code v-pre>Stage View</code>항목과 Pipeline stage가 수행된 결과를 확인할 수 있는 UI가 생성됩니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564388703234.png" alt="1564388703234" tabindex="0" loading="lazy"><figcaption>1564388703234</figcaption></figure>
</li>
</ol>
<p><strong>Step3. Configuring specific agents</strong></p>
<p><code v-pre>Freestyle project</code> 형태의 Item을 생성합니다. (e.g. 04-03.ConfiguringSpecificAgents)</p>
<blockquote>
<p>Jenkins는 각 단계, 빌드, 그리고 빌드 후 작업일 지정할 수 있습니다. <code v-pre>Freestyle project</code>에서는 이같은 전체 빌드 단계를 구성하고 여러가지 플러그인을 사용할 수 있는 환경을 제공합니다.</p>
</blockquote>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564444282455.png" alt="1564444282455" tabindex="0" loading="lazy"><figcaption>1564444282455</figcaption></figure>
<ul>
<li>
<p>General</p>
<ul>
<li>
<p>Restrict where this project can be run : 빌드 수행을 특정 Label 노드에 제한하도록 설정할 수 있습니다.</p>
<ul>
<li>
<p>Label Expression : 앞서의 과정에서 생성한 노드 <code v-pre>Metal</code>을 지정해봅니다. 해당 조건의 노드가 존재하는 경우 노드 개수 정보가 표기됩니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>Label Metal is serviced by 1 node.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
</li>
</ul>
</li>
<li>
<p>Build</p>
<ul>
<li><code v-pre>ADD BUILD STEP</code> 드롭박스에서 <code v-pre>Excute shell </code>항목을 선택하여 추가 합니다.
<ul>
<li>Command 칸에 <code v-pre>echo &quot;Hello world.&quot;</code>를 넣어봅니다.</li>
</ul>
</li>
<li><code v-pre>ADD BUILD STEP</code> 드롭박스에서 <code v-pre>Excute shell </code>항목을 선택하여 추가 합니다.
<ul>
<li>Command 칸에 <code v-pre>ls -al&quot;</code>를 넣어봅니다.</li>
</ul>
</li>
</ul>
</li>
<li>
<p>저장하고 좌측의 <code v-pre>Build Now</code>를 클릭하여 빌드를 수행합니다.</p>
</li>
<li>
<p>콘솔 출력을 확인하면 지정한 Label 노드에서 각 빌드 절차가 수행된 것을 확인할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564449679656.png" alt="1564449679656" tabindex="0" loading="lazy"><figcaption>1564449679656</figcaption></figure>
</li>
</ul>
<h2 id="_5-plugins" tabindex="-1"><a class="header-anchor" href="#_5-plugins" aria-hidden="true">#</a> 5. Plugins</h2>
<p>Jenkins가 유용한 툴인 이유중 하나는 방대한 양의 플러그인 입니다. Jenkins의 기능을 확장시키고, 관리, 빌드 정책 등을 확장 시켜주고, 타 서비스와의 연계를 쉽게 가능하도록 합니다.</p>
<p><a href="https://plugins.jenkins.io/" target="_blank" rel="noopener noreferrer">Plugin Index<ExternalLinkIcon/></a></p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564450122219.png" alt="1564450122219" tabindex="0" loading="lazy"><figcaption>1564450122219</figcaption></figure>
<p><strong>Step 1. Adding plugins via plugin manager</strong></p>
<p>Jenkins는 온라인에 연결된 plugin을 검색, 설치할 수 있는 <code v-pre>플러그인 관리</code>기능을 갖고 있습니다. 좌측 메뉴에서 <code v-pre>Jenkins 관리</code>를 클릭하면 <code v-pre>플러그인 관리</code> 링크를 통하여 해당 기능에 접근할 수 있습니다.</p>
<ul>
<li>업데이트된 플러그인 목록 : 설치된 플러그인 중 업데이트가 있는 플러그인 목록이 나타납니다.</li>
<li>설치 가능 :  아직 해당 Jenkins에 설치되어있지 않은 플러그인 목록이 나타납니다.</li>
<li>설치된 플러그인 목록 : 해당 Jenkins에 설치되어있는 플러그인이 나타납니다. 필수적이지 않은 플러그인인 경우 삭제도 해당 탭에서 가능합니다.</li>
<li>고급 : 플러그인 서버에 접속할 수 있도록 별도의 프록시를 설정하거나, <code v-pre>.hpi</code>확장자를 갖는 플러그인을 설치하거나 업데이트 사이트를 지정할 수 있습니다.</li>
</ul>
<p>각 플러그인 이름을 클릭하면 플러그인 정보를 확인할 수 있는 <code v-pre>plugins.jenkins.io</code> 사이트로 이동하여 정보를 보여줍니다. 사용방법은 우측에 <code v-pre>wiki</code>링크를 클릭합니다. 대략적인 UI나 사용방법은 <code v-pre>wiki.jenkins.io</code>에서 제공합니다.</p>
<p><strong>Step 2. Using shared libraries</strong></p>
<p>Jenkins Pipeline의 Shared libraries에 대한 상세 내용은 다음 링크를 참고합니다. <a href="https://jenkins.io/doc/book/pipeline/shared-libraries/" target="_blank" rel="noopener noreferrer">https://jenkins.io/doc/book/pipeline/shared-libraries/<ExternalLinkIcon/></a></p>
<p>이번 실습을 진행하기전에 GitHub에서 <a href="https://github.com/Great-Stone/evenOdd" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/evenOdd<ExternalLinkIcon/></a> repository를 본인 계정의 GitHub에 Fork 하여 진행합니다.</p>
<p>소스의 <code v-pre>var</code> 디렉토리에는 Pipeline에서 사용하는 Shared Library들이 들어있습니다. groovy 스크립트로 되어있으며 Pipeline을 구성한 <code v-pre>jenkinsfile</code>에서 이를 사용합니다.</p>
<p><code v-pre>vars/evenOdd.groovy</code>를 호출하고 값을 받아오는 형태를 갖고, evenOdd.groovy에서 사용하는 <code v-pre>log.info</code>와 <code v-pre>log.warning</code>은 <code v-pre>vars/log.groovy</code>에 구현되어있습니다.</p>
<p>다음과 같이 Jenkins에 설정을 수행합니다.</p>
<ol>
<li><code v-pre>Jenkins 관리</code>클릭 후 <code v-pre>시스템 설정</code>을 선택합니다.</li>
<li><code v-pre>Global Pipeline Libraries</code> 의 추가 버튼을 클릭하여 새로운 구성을 추가합니다.
<ul>
<li>Name : evenOdd (어플리케이션 이름과 동일하게 하는 것을 추천합니다.)</li>
<li>Default version : master</li>
<li>Retrieval method &gt; Modern SCM : 활성화 하면 아래 <code v-pre>Source Code Management</code> 항목이 추가됩니다.</li>
<li>SCM의 <code v-pre>GitHub</code>를 클릭하여 내용을 채웁니다.
<ul>
<li>Credentials : 이전 실습 내용에서 생성한 Credential을 선택합니다.</li>
<li>Owner : GitHub Owner를 입력합니다. <code v-pre>https://github.com/Great-Stone/evenOdd</code>인 경우 <code v-pre>Great-Stone</code>이 Owner가 됩니다.</li>
<li>Repository : 위정보가 맞는 경우 자동으로 목록이 나타납니다. evenOdd를 선택합니다.</li>
</ul>
</li>
<li>Load implicitly : SCM 정보를 기입하고 다시 위쪽 <code v-pre>Library</code>에 있는 <code v-pre>Load implicitly</code>를 활성화 합니다.</li>
</ul>
</li>
</ol>
<p>Shared Libraries가 준비가 되면 <code v-pre>Pipeline</code> 타입의 Item을 생성하고 (e.g. 05-02.UsingSharedLibraries) Pipeline 설정을 추가합니다.</p>
<ul>
<li>Definition : Pipeline script from SCM</li>
<li>SCM : Git</li>
<li>Repositories
<ul>
<li>Repository URL : <a href="https://github.com/Great-Stone/evenOdd.git" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/evenOdd.git<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<p>저장 후 <code v-pre>Build Now</code>를 클릭하여 빌드를 수행합니다. 빌드의 결과로는 2 단계로 수행되는데 1단계는 <code v-pre>Declarative: Checkout SCM</code>으로 SCM으로부터 소스를 받아 준비하는 단계이고, 2단계는 <code v-pre>jenkinsfile</code>을 수행하는 단계입니다. <code v-pre>vars/evenOdd.goovy</code> 스크립트에는 stage가 두개 있으나 해당 Pipeline 을 호출하는 값에 따라 하나의 stage만을 수행하도록 되어있어서 하나의 stage가 수행되었습니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code><span class="token comment">// Jenkinsfile</span>
<span class="token comment">//@Library('evenOdd') _</span>

<span class="token function">evenOdd</span><span class="token punctuation">(</span>currentBuild<span class="token punctuation">.</span><span class="token function">getNumber</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>currentBuild.getNumber()</code>는 현재 생성된 Pipeline Item의 빌드 숫자에 따라 값을 <code v-pre>evenOdd(빌드 숫자)</code>형태로 호출하게 됩니다.</p>
<p>Jenkins shared libraries를 사용하는 가장 좋은 예는 재사용성 있는 Groovy 함수를 타 작업자와 공유하는 것 입니다. 빌드의 상태는 다른 파이프 라인 단계로 계속할 것인지 결정하는 데 사용할 수도 있습니다.</p>
<p><strong>주의</strong></p>
<p>해당 설정은 모든 빌드에 영향을 주기 때문에 타 작업을 위해 추가된 <strong>Global Pipeline Libraries</strong>의 <strong>Library</strong>를 삭제하여 진행합니다.</p>
<h2 id="_6-notifications" tabindex="-1"><a class="header-anchor" href="#_6-notifications" aria-hidden="true">#</a> 6. Notifications</h2>
<p>Jenkins빌드의 결과를 받아볼 수 있는 몇가지 방안에 대해 알아봅니다.</p>
<p><strong>Step 1. Notifications of build state</strong></p>
<p>Jenkins에서는 플러그인이나 외부 툴에 의해 빌드에 대한 결과를 받아 볼 수 있습니다. 대표적으로는 Jenkins의 슬랙 플러그인을 사용하여 슬랙으로 빌드에 결과를 받아보거나, <a href="http://catlight.io" target="_blank" rel="noopener noreferrer">catlight.io<ExternalLinkIcon/></a> 에서 데스크탑용 어플리케이션에 연동하는 방법도 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564463655933.png" alt="1564463655933" tabindex="0" loading="lazy"><figcaption>1564463655933</figcaption></figure>
<p>여기서는 Chrome 확장 프로그램을 통한 알림을 받을 수 있는 설정을 설명합니다. 이 과정을 진행하기 위해서는 Chrome 웹브라우저가 필요합니다.</p>
<ol>
<li>
<p><RouterLink to="/05-Software/Jenkins/pipeline101/chrome:/apps/">chrome://apps/</RouterLink>에 접속하여 앱스토어를 클릭합니다.</p>
</li>
<li>
<p>jenkins를 검색하여 <code v-pre>Yet Another Jenkins Notifier</code>를 확인합니다. <code v-pre>Chrome에 추가</code>버튼으로 확장 프로그램을 설치합니다.</p>
</li>
<li>
<p>설치가 완료되면 브라우저 우측 상단에 Jenkins 아이콘이 나타납니다. 클릭합니다.</p>
</li>
<li>
<p>각 Item(Job)의 url을 입력하여 <code v-pre>+</code>버튼을 클릭합니다.</p>
</li>
<li>
<p>등록된 Item을 확인하고 해당 빌드를 Jenkins 콘솔에서 실행해봅니다. 결과에 대한 알림이 발생하는 것을 확인 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564464197547.png" alt="1564464197547" tabindex="0" loading="lazy"><figcaption>1564464197547</figcaption></figure>
</li>
</ol>
<p><strong>Step 2. Build state badges for SCM</strong></p>
<p>Jenkins에서 빌드가 수행된 결과를 SCM에 반영하는 기능도 플러그인을 통해 가능합니다. SCM에서 해당 Jenkins에 접근이 가능해야 하므로 Jenkins는 SCM에서 접근가능한 네트워크 상태여야 합니다.</p>
<p>Jenkins에 새로운 플러그인을 추가하고 설정합니다.</p>
<ul>
<li><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>플러그인 관리</code>를 클릭합니다.</li>
<li><code v-pre>설치 가능</code> 탭을 클릭하고 상단의 검색에 <code v-pre>embed</code>를 입력하면 <code v-pre>Embeddable Build Status</code>플러그인이 나타납니다. 선택하여 설치를 진행합니다.</li>
<li><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>Configure Global Security</code>을 클릭합니다.</li>
<li><code v-pre>Authorization</code> 항목에서 <code v-pre>Matrix-based security</code>를 체크합니다.</li>
<li><code v-pre>Authenticated Users</code>의 경우 필요한 각 항목에 대해 체크박스를 활성화 합니다.</li>
<li><code v-pre>Anonymous Users</code>에 대해서 <code v-pre>Job/ViewStatus</code> 항목을 활성화 합니다.</li>
</ul>
<p>이제 기존의 외부 SCM이 연결된 Item을 선택합니다. 여기서는 <code v-pre>05-02.UsingSharedLibraries</code>에 설정합니다. 해당 Item을 선택하면 좌측에 <code v-pre>Embeddable Build Status</code> 항목이 새로 생긴것을 확인 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564464880533.png" alt="1564464880533" tabindex="0" loading="lazy"><figcaption>1564464880533</figcaption></figure>
<p>해당 항목을 클릭하고 <code v-pre>Markdown</code>의 <code v-pre>unprotected</code>의 항목을 복사합니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code><span class="token url">[<span class="token content">![Build Status</span>](<span class="token url">http://myjenkins.com/buildStatus/icon?job=05-02.UsingSharedLibraries</span>)</span>](http://myjenkins.com/job/05-02.UsingSharedLibraries/)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>복사한 형식을 GitHub의 evenOdd repository의 <a href="http://README.md" target="_blank" rel="noopener noreferrer">README.md<ExternalLinkIcon/></a> 파일 상단에 위치 시킵니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code><span class="token title important"><span class="token punctuation">#</span> evenOdd</span>
<span class="token url">[<span class="token content">![Build Status</span>](<span class="token url">http://myjenkins.com/buildStatus/icon?job=libraries</span>)</span>](http://myjenkins.com/job/libraries/)

A Jenkins even/odd playbook from the Jenkins.io documentation

Add this as a shared library called evenOdd in your jenkins
instance, and then instantiate the pipeline in your project Jenkinsfile

This will also use an example of global variabls from the log.groovy
definitions

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이같이 반영하면 각 빌드에 대한 결과를 SCM에 동적으로 상태를 반영 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564465713857.png" alt="1564465713857" tabindex="0" loading="lazy"><figcaption>1564465713857</figcaption></figure>
<p>이같은 알림 설정은 코드의 빌드가 얼마나 잘 수행되는지 이해하고 추적할 수 있도록 도와줍니다.</p>
<h2 id="_7-testing" tabindex="-1"><a class="header-anchor" href="#_7-testing" aria-hidden="true">#</a> 7. Testing</h2>
<p><strong>Step 1. Code coverage tests and reports</strong></p>
<p>테스트 Pipeline 구성시 테스트 과정을 지정할 수 있습니다.  Testing을 위한 <code v-pre>Pipeline</code> 타입의 Item을 추가로 생성합니다. (e.g. 07-01.CodeCoverageTestsAndReports)</p>
<p>설정은 다음과 같이 수행합니다.</p>
<ol>
<li>
<p><code v-pre>Pipeline</code> 스크립트에 다음과 같이 입력 합니다. 테스트와 빌드, 검증 후 결과를 보관하는 단계까지 이루어 집니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'''
                  echo This > app.sh
                  echo That >> app.sh
                '''</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Test'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'''
                  grep This app.sh >> ${BUILD_ID}.cov
                  grep That app.sh >> ${BUILD_ID}.cov
                '''</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Coverage'</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'''
                  app_lines=`cat app.sh | wc -l`
                  cov_lines=`cat ${BUILD_ID}.cov | wc -l`
                  echo The app has `expr $app_lines - $cov_lines` lines uncovered > ${BUILD_ID}.rpt
                  cat ${BUILD_ID}.rpt
                '''</span>
                archiveArtifacts <span class="token interpolation-string"><span class="token string">"</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">env<span class="token punctuation">.</span>BUILD_ID</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.rpt"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>빌드가 완료되면 해당 Job화면을 리로드 합니다. Pipeline에 <code v-pre>archiveArtifacts</code>가 추가되었으므로 해당 Job에서 이를 관리합니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564470826126.png" alt="1564470826126" loading="lazy"></p>
</li>
<li>
<p>해당 아카이브에는 코드 검증 후의 결과가 저장 됩니다.</p>
</li>
</ol>
<p><strong>Step 2. Using test results to stop the build</strong></p>
<p>테스트 결과에 따라 빌드를 중지시키는 Pipeline 스크립트를 확인합니다. Testing을 위한 <code v-pre>Pipeline</code> 타입의 Item을 추가로 생성합니다. (e.g. 07-02.UsingTestResultsToStopTheBuild)</p>
<p>설정은 다음과 같이 수행합니다.</p>
<ol>
<li>
<p><code v-pre>Pipeline</code> 스크립트에 다음과 같이 입력 합니다. 테스트와 빌드, 검증 후 결과를 보관하는 단계까지 이루어 집니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'''
                  echo This > app.sh
                  echo That >> app.sh
                  echo The Other >> app.sh
                '''</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Test'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'''
                  for n in This That Those
                   do if grep $n app.sh >> ${BUILD_ID}.cov
                    then exit 1
                   fi
                  done
                '''</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Coverage'</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'''
                  app_lines=`cat app.sh | wc -l`
                  cov_lines=`cat ${BUILD_ID}.cov | wc -l`
                  echo The app has `expr $app_lines - $cov_lines` lines uncovered > ${BUILD_ID}.rpt
                  cat ${BUILD_ID}.rpt
                '''</span>
                archiveArtifacts <span class="token interpolation-string"><span class="token string">"</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">env<span class="token punctuation">.</span>BUILD_ID</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">.rpt"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>저장을 하고 빌드를 수행하면, Pipeline 스크립트 상 <code v-pre>Test</code> Stage에서 조건 만족 시 <code v-pre>exit 1</code>를 수행하므로 빌드는 중간에 멈추게 됩니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564471729123.png" alt="1564471729123" tabindex="0" loading="lazy"><figcaption>1564471729123</figcaption></figure>
</li>
</ol>
<h2 id="_8-rest-api" tabindex="-1"><a class="header-anchor" href="#_8-rest-api" aria-hidden="true">#</a> 8. REST API</h2>
<p>Jenkins는 외부 서비스와의 연동이나 정보 조회를 위한 API를 제공합니다.</p>
<p><strong>Step 1. Triggering builds via the REST API</strong></p>
<p>Jenkins REST API 테스트를 위해서는 Jenkins에 인증 가능한 Token을 취득하고 curl이나 Postman 같은 도구를 사용하여 확인 가능 합니다. 우선 Token을 얻는 방법은 다음과 같습니다.</p>
<ol>
<li>
<p>Jenkins에 로그인 합니다.</p>
</li>
<li>
<p>우측 상단의 로그인 아이디에 마우스를 호버하면 드롭박스 버튼이 나타납니다. <code v-pre>설정</code>을 클릭합니다.</p>
</li>
<li>
<p><code v-pre>API Token</code>에서 <code v-pre>Current token</code>을 확인합니다. 등록된 Token이 없는 경우 다음과 같이 신규 Token을 발급 받습니다.</p>
<ul>
<li>
<p><code v-pre>ADD NEW TOKEN</code>을 클릭합니다.</p>
</li>
<li>
<p>이름을 기입하는 칸에 로그인 한 아이디를 등록합니다. (e.g. admin)</p>
</li>
<li>
<p><code v-pre>GENERATE</code>를 클릭하여 Token을 생성합니다.</p>
</li>
</ul>
</li>
<li>
<p>이름과 Token을 사용하여 다음과 같이 curl로 접속하면 <code v-pre>Jenkins-Crumb</code> 프롬프트가 나타납니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">--user</span> <span class="token string">"admin:TOKEN"</span> <span class="token string">'http://myjenkins.com/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)'</span>

Jenkins-Crumb:89e1fd9c402824c89465f6b97f49b605
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>Crumb</code>를 확인했으면 다시 헤더 값에 <code v-pre>Jenkins-Crumb:</code>를 추가하여 <code v-pre>02-04.MultiStep</code> Job을 빌드하기 위해 다음과 같이 요청합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">-X</span> POST http://myjenkins.com/job/02-04.MultiStep/build <span class="token parameter variable">--user</span> gyulee:11479bdec9cada082d189938a3946348be --data-urlencode <span class="token assign-left variable">json</span><span class="token operator">=</span><span class="token string">''</span> <span class="token parameter variable">-H</span> <span class="token string">"Jenkins-Crumb:89e1fd9c402824c89465f6b97f49b605"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ol>
<p>API로 호출된 빌드가 수행되어 빌드 번호가 증가하는 것을 확인합니다.</p>
<p><strong>Step 2. Retriving build status via the REST API</strong></p>
<p>빌드에 대한 결과를 REST API를 통해 요청하는 방법을 알아봅니다. 앞서 진행시의 Token값이 필요합니다. Json 형태로 출력되기 때문에 정렬을 위해 python이 설치 되어있다면  <code v-pre>mjson.tool</code>을 사용하여 보기 좋은 형태로 출력 가능합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Python이 설치되어있지 않은 경우</span>
$ yum <span class="token parameter variable">-y</span> <span class="token function">install</span> python2

<span class="token comment"># Jenkins에 REST API로 마지막 빌드 상태 요청</span>
$ <span class="token function">curl</span>  <span class="token parameter variable">-s</span> <span class="token parameter variable">--user</span> gyulee:11479bdec9cada082d189938a3946348be http://myjenkins.com/job/02-04.MultiStep/lastBuild/api/json <span class="token operator">|</span> python2 <span class="token parameter variable">-mjson.tool</span>

<span class="token punctuation">{</span>
    <span class="token string">"_class"</span><span class="token builtin class-name">:</span> <span class="token string">"org.jenkinsci.plugins.workflow.job.WorkflowRun"</span>,
    <span class="token string">"actions"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token string">"_class"</span><span class="token builtin class-name">:</span> <span class="token string">"hudson.model.CauseAction"</span>,
            <span class="token string">"causes"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
                <span class="token punctuation">{</span>
                    <span class="token string">"_class"</span><span class="token builtin class-name">:</span> <span class="token string">"hudson.model.Cause<span class="token variable">$UserIdCause</span>"</span>,
                    <span class="token string">"shortDescription"</span><span class="token builtin class-name">:</span> <span class="token string">"Started by user GyuSeok.Lee"</span>,
                    <span class="token string">"userId"</span><span class="token builtin class-name">:</span> <span class="token string">"gyulee"</span>,
                    <span class="token string">"userName"</span><span class="token builtin class-name">:</span> <span class="token string">"GyuSeok.Lee"</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">]</span>
        <span class="token punctuation">}</span>,
        <span class="token punctuation">{</span><span class="token punctuation">}</span>,
        <span class="token punctuation">{</span>
            <span class="token string">"_class"</span><span class="token builtin class-name">:</span> <span class="token string">"hudson.plugins.git.util.BuildData"</span>,
            <span class="token string">"buildsByBranchName"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
                <span class="token string">"master"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
                    <span class="token string">"_class"</span><span class="token builtin class-name">:</span> <span class="token string">"hudson.plugins.git.util.Build"</span>,
                    <span class="token string">"buildNumber"</span><span class="token builtin class-name">:</span> <span class="token number">5</span>,
                    <span class="token string">"buildResult"</span><span class="token builtin class-name">:</span> null,
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-security" tabindex="-1"><a class="header-anchor" href="#_9-security" aria-hidden="true">#</a> 9. Security</h2>
<p><strong>Step 1. Securing your deployment with users</strong></p>
<p>사용자별 배포수행을 위한 사용자 설정을 설명합니다.</p>
<ul>
<li><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>Configure Global Security</code>를 클릭합니다.</li>
</ul>
<p><code v-pre>Enable security</code>는 보안 설정 여부를 설정하는 항목으로 기본적으로는 비활성화되어있습니다. 체크하여 활성화하면 다양한 보안 옵션을 설정할 수 있는 항목이 표기 됩니다.</p>
<ul>
<li>Disable remember me : 로그인 시 사용자를 기억할지의 여부를 묻는 체크박스에 대한 활성/비활성 설정입니다.</li>
</ul>
<p>Security Realm 에서는 Jenkins에서 사용하는 사용자 관리 방식을 선택합니다.</p>
<ul>
<li>Delegate to servlet container : Jenkins를 실행하는 서블릿 컨테이너에서 접근을 관리합니다.</li>
<li>Jenkins' own user database : 기본 설정입니다. Jenkins 자체적으로 사용자 데이터를 관리합니다. <code v-pre>사용자의 가입 허용</code>이 활성화되면 Jenkins 에 접속하는 사용자는 스스로 계정을 생성하고 접근 가능합니다.</li>
<li>LDAP : 외부 LDAP과 연동하여 사용자를 관리합니다. LDAP 으로 계정을 통합 관리하는 경우 유용합니다.</li>
<li>Unix user/group database : Unix/Linux에서 해당 호스트의 사용자를 관리를 기반으로 연동합니다.</li>
</ul>
<p>Authorization 에서는 사용자 권한에 대한 설정을 정의합니다.</p>
<ul>
<li>Anyone can do anything : Jenkins에 접근할 수 있는 모든 요청을 허용합니다.</li>
<li>Legacy mode :  <code v-pre>1.164</code>이전 버전의 동작과 동일하게 관리됩니다. <code v-pre>Admin</code>사용자만 모든 기능을 수행하며, 일반 사용자와 비로그인 사용자는 읽기만 가능합니다.</li>
<li>Logged-in users can do anything : 로그인만 되면 모든 기능을 수행할 수 있는 설정압니다.</li>
<li>Matrix-based security : 매트릭스 기반으로 각 기능을 사용자와 그룹별로 조절할 수 있습니다.</li>
<li>Project-based Matrix Authorization Strategy : 매트릭스 기반 권한설정의 확장으로, 개별 프로젝트 별로 권한을 조정할 수 있습니다.</li>
</ul>
<p>다음은 권한 매트릭스의 항목과 권한별 설명입니다.</p>
<table>
<thead>
<tr>
<th style="text-align:left">항목</th>
<th style="text-align:left">권한</th>
<th style="text-align:left">의미</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left"><strong>Overall</strong></td>
<td style="text-align:left">Administer</td>
<td style="text-align:left">시스템의 전역 설정을 변경할 수 있다. OS 에서 허용된 범위안에서 전체 시스템 엑세스드의 매우 민감한 설정을 수행</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Read</td>
<td style="text-align:left">젠킨스의 모든 페이지 확인 가능</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">RunScripts</td>
<td style="text-align:left">그루비 콘솔이나 그루비 CLI 명령을 통해 그루비 스크립트를 실행</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">UploadPlugins</td>
<td style="text-align:left">특정 플러그인을 업로드</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">ConfigureUpdateCenter</td>
<td style="text-align:left">업데이트 사이트와 프록시 설정</td>
</tr>
<tr>
<td style="text-align:left"><strong>Slave</strong></td>
<td style="text-align:left">Configure</td>
<td style="text-align:left">기존 슬레이브 설정 가능</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Delete</td>
<td style="text-align:left">기존 슬레이브 삭제</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Create</td>
<td style="text-align:left">신규 슬레이브 생성</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Disconnect</td>
<td style="text-align:left">슬레이브 연결을 끊거나 슬레이브를 임시로 오프라인으로 표시</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Connect</td>
<td style="text-align:left">슬레이브와 연결하거나 슬레이브를 온라인으로 표시</td>
</tr>
<tr>
<td style="text-align:left"><strong>Job</strong></td>
<td style="text-align:left">Create</td>
<td style="text-align:left">새로운 작업 생성</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Delete</td>
<td style="text-align:left">기존 작업 삭제</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Configure</td>
<td style="text-align:left">기존 작업의 설정 갱신</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Read</td>
<td style="text-align:left">프로젝트 설정에 읽기 전용 권한 부여</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Discover</td>
<td style="text-align:left">익명 사용자가 작업을 볼 권한이 없으면 에러 메시지 표시를 하지 않고 로그인 폼으로 전환</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Build</td>
<td style="text-align:left">새로운 빌드 시작</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Workspace</td>
<td style="text-align:left">젠킨스 빌드를 실행 하기 위해 체크아웃 한 작업 영역의 내용을 가져오기 가능</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Cancel</td>
<td style="text-align:left">실행중인 빌드 취소</td>
</tr>
<tr>
<td style="text-align:left"><strong>Run</strong></td>
<td style="text-align:left">Delete</td>
<td style="text-align:left">빌드 내역에서 특정 빌드 삭제</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Update</td>
<td style="text-align:left">빌드의 설명과 기타 프로퍼티 수정(빌드 실패 사유등)</td>
</tr>
<tr>
<td style="text-align:left"><strong>View</strong></td>
<td style="text-align:left">Create</td>
<td style="text-align:left">새로운 뷰 생성</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Delete</td>
<td style="text-align:left">기존 뷰 삭제</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Configure</td>
<td style="text-align:left">기존 뷰 설정 갱신</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Read</td>
<td style="text-align:left">기존 뷰 보기</td>
</tr>
<tr>
<td style="text-align:left"><strong>SCM</strong></td>
<td style="text-align:left">Tag</td>
<td style="text-align:left">특정 빌드와 관련된 소스 관리 시스템에 태깅을 생성</td>
</tr>
</tbody>
</table>
<p>CSRF Protection 항목에 있는 <code v-pre>Prevent Cross Site Request Forgery exploits</code> 항목은  페이지마다 nonce 또는 crumb 이라 불리우는 임시 값을 삽입하여 사이트 간 요청 위조 공격을 막을 수 있게 해줍니다. 사용방법은 위에서 REST API 에 대한 설명 시 crumb 값을 얻고, 사용하는 방법을 참고합니다.</p>
<p><strong>Step 2. Securing secret credentials and files</strong></p>
<p>Jenkins에서 Pipeline을 설정하는 경우 일부 보안적인 값이 필요한 경우가 있습니다. 예를 들면 <code v-pre>Username</code>과 <code v-pre>Password</code> 같은 값입니다. 앞서의 과정에서 <code v-pre>Credentials</code>를 생성하는 작업을 일부 수행해 보았습니다. 여기서는 생성된  인증 값을 Pipeline에 적용하는 방법을 설명합니다.</p>
<p><code v-pre>Pipeline</code> 타입의 Item을 추가로 생성합니다. (e.g. 09-02.SecuringSecretCredentialsAndFiles) 설정은 다음과 같이 수행합니다.</p>
<ol>
<li>
<p><code v-pre>Pipeline</code> 스크립트에 다음과 같이 입력 합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    environment <span class="token punctuation">{</span>
       SECRET<span class="token operator">=</span><span class="token function">credentials</span><span class="token punctuation">(</span><span class="token string">'jenkins-secret-text'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                echo <span class="token interpolation-string"><span class="token string">"</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">env<span class="token punctuation">.</span>SECRET</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>저장 후 <code v-pre>Build Now</code>를 클릭하여 빌드를 수행하면 실패하게 되고 <code v-pre>Console Output</code>에서 진행사항을 보면, Pipeline 스크립트에서 선언한 <code v-pre>jenkins-secret-text</code>때문에 에러가 발생한 것을 확인할 수 있습니다.</p>
</li>
<li>
<p>좌측 상단의 <code v-pre>Jenkins</code>버튼을 클릭하여 최상위 메뉴로 이동합니다.</p>
</li>
<li>
<p>좌측 메뉴의 <code v-pre>Credentials</code>를 클릭하고 <code v-pre>(global)</code> 도메인을 클릭합니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564534571013.png" alt="1564534571013" tabindex="0" loading="lazy"><figcaption>1564534571013</figcaption></figure>
</li>
<li>
<p>좌측에 <code v-pre>Add Credentials</code>를 클릭하여 새로운 항목을 추가합니다.</p>
<ul>
<li>Kind : Secret text</li>
<li>Secret : 해당 Credential에 담을 값을 기입합니다. (e.g. This is credential text.)</li>
<li>ID : jenkins-secret-text</li>
</ul>
</li>
<li>
<p>저장 후 다시 빌드를 수행하면 정상적으로 수행됩니다. 해당 값은 숨기기 위한 값이므로 Pipeline 스크립트에서 <code v-pre>echo</code>로 호출하더라도 <code v-pre>****</code>이란 값으로 표기 됩니다.</p>
</li>
</ol>
<p>이같은 방법은 Password같은 보안에 민감한 정보를 사용하기에 유용합니다.</p>
<p><strong>Step 3. Auditing your environment</strong></p>
<p>Jenkins의 변화와 활동에 대한 감시를 위한 설정 방법을 설명합니다. Jenkins에 새로운 플러그인을 추가하고 설정합니다.</p>
<ul>
<li><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>플러그인 관리</code>를 클릭합니다.</li>
<li><code v-pre>설치 가능</code> 탭을 클릭하고 상단의 검색에 <code v-pre>audit</code>를 입력하면 <code v-pre>Audit Trail</code>플러그인이 나타납니다. 선택하여 설치합니다.</li>
<li><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>시스템 설정</code>을 클릭합니다.</li>
<li>Audit Trail 항목이 추가되었습니다. Loggers의 <code v-pre>ADD LOGGER</code>드롭박스에서  <code v-pre>Log File</code>을 선택하여 설정합니다.
<ul>
<li>Log Location : /var/jenkins_home/audit/audit.log</li>
<li>Log File Size MB : 100MB</li>
<li>Log File Count : 5</li>
</ul>
</li>
</ul>
<p>저장 후 빌드나 Job의 설정 변경등의 작업을 수행하면, <code v-pre>audit.log.0</code>으로 지정된 파일 경로에 생성됨을 확인 할 수 있습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">tail</span> <span class="token parameter variable">-f</span> ./audit.log.0
Jul <span class="token number">31</span>, <span class="token number">2019</span> <span class="token number">10</span>:47:32,727 AM job/02-02.Jobs/ <span class="token comment">#12 Started by user GyuSeok.Lee</span>
Jul <span class="token number">31</span>, <span class="token number">2019</span> <span class="token number">10</span>:47:42,738 AM /job/03-04.WebhookBuild Triggering/configSubmit by gyulee
Jul <span class="token number">31</span>, <span class="token number">2019</span> <span class="token number">10</span>:48:09,001 AM /configSubmit by gyulee
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Step 4. Using forders to create security realms</strong></p>
<p>다양한 프로젝트를 관리하는 경우 관리상, 빌드 프로젝트를 관리해야할 필요성이 발생합니다. Jenkins에서 Forder 아이템을 생성하여 관리 편의성과 보안요소를 추가할 수 있습니다.</p>
<p>우선 테스트를 위한 사용자를 추가합니다.</p>
<ul>
<li>좌측 메뉴에서 <code v-pre>Jenkins 관리</code>를 클릭하여 <code v-pre>Manage Users</code>로 이동합니다.</li>
<li><code v-pre>사용자 생성</code>을 클릭하여 새로운 사용자를 추가합니다.
<ul>
<li>계정명 : test</li>
<li>암호 : test</li>
<li>암호 확인 : test</li>
<li>이름 : tester</li>
<li>이메일 주소 : <a href="mailto:test@redhat.com">test@redhat.com</a></li>
</ul>
</li>
</ul>
<p>다음으로 Forder 타임의 Item을 추가합니다.</p>
<ul>
<li>좌측 메뉴에서 <code v-pre>새로운 Item</code>을 클릭하여 이름을 <code v-pre>02-Project</code>로 예를 들어 지정하고, Forder를 클릭하여 <code v-pre>OK</code>버튼을 클릭합니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564537956019.png" alt="1564537956019" loading="lazy"></li>
<li>설정 페이지가 나오면 <code v-pre>SAVE</code>버튼을 클릭하고 좌측 상단의 <code v-pre>Jenkins</code> 버튼을 클릭하여 최상위 페이지로 이동합니다.</li>
<li>기존 프로젝트를 새로 생성한 Forder 타입으로 이동시켜 봅니다.  최상위 화면에서 <code v-pre>02-02.Jobs</code>에 마우스를 대면 드롭박스 메뉴를 확장할 수 있습니다. <code v-pre>Move</code>를 클릭합니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564538201169.png" alt="1564538201169" loading="lazy"></li>
<li>드롭박스에서 <code v-pre>Jenkins &gt;&gt; 02-Project</code>를 선택하고 <code v-pre>MOVE</code>버튼을 클릭합니다. 다시 최상위 메뉴로 오면 <code v-pre>02-02.Jobs</code>가 사라진 것을 확인할 수 있습니다. <code v-pre>02</code> 로 시작하는 다은 프로젝트도 같은 작업을 수행하여 이동시킵니다.</li>
<li><code v-pre>02-Project</code>를 클릭하면 이동된 프로젝트들이 나타납니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564538419183.png" alt="1564538419183" loading="lazy"></li>
</ul>
<p>권한 설정을 하여 현재 Admin 권한의 사용자는 접근 가능하고 새로 생성한 tester는 접근불가하도록 설정합니다.</p>
<ul>
<li>
<p>Folder에 접근하는 권한을 설정하기위해 <code v-pre>Jenkins 관리</code>의 <code v-pre>Configure Global Security</code>로 이동합니다.</p>
</li>
<li>
<p>Authorization항목의 <code v-pre>Project-based Matrix Authorization Strategy</code>를 선택합니다.</p>
</li>
<li>
<p><code v-pre>ADD USER OR GROUP...</code>을 클릭하여 Admin 권한의 사용자를 추가합니다.</p>
</li>
<li>
<p>Admin 권한의 사용자에게는 모든 권한을 주고 <code v-pre>Authenticated Users</code>에는 Overall의 <code v-pre>Read</code> 권한만 부여합니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564543546039.png" alt="1564543546039" loading="lazy"></p>
</li>
<li>
<p>생성한 <code v-pre>02-Project</code>로 이동하여 좌측 메뉴의 <code v-pre>Configure</code>를 클릭합니다.</p>
</li>
<li>
<p>Properties에 추가된 <code v-pre>Enable project-based security</code>를 확성화하면 항목별 권한 관리 메트릭스가 표시됩니다. Job의 Build, Read, ViewStatus, Workspace를 클릭하고 View의 Read를 클릭하여 권한을 부여합니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564540010695.png" alt="1564540010695" tabindex="0" loading="lazy"><figcaption>1564540010695</figcaption></figure>
</li>
<li>
<p>로그아웃 후에 앞서 추가한 <code v-pre>test</code>사용자로 로그인 하면 기본적으로 다른 프로젝트나 Item들은 권한이 없기 때문에 보이지 않고, 앞서 설정한 <code v-pre>02-Project</code> 폴더만 리스트에 나타납니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564543591394.png" alt="1564543591394" loading="lazy"></p>
</li>
</ul>
<p>Jenkins의 인증 기능을 사용하여 보안적 요소를 구성할 수 있습니다. Audit 로그를 활용하여 사용자별 활동을 기록할 수도 있고 Folder를 활용하면 간단히 사용자/그룹에 프로젝트를 구분하여 사용할 수 있도록 구성할 수 있습니다.</p>
<h2 id="_10-artifacts" tabindex="-1"><a class="header-anchor" href="#_10-artifacts" aria-hidden="true">#</a> 10. Artifacts</h2>
<p>빌드 이후 빌드의 결과를 기록하고 저장하는 방법을 설명합니다.</p>
<p><strong>Step 1. Creating and storing artifacts</strong></p>
<p>Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 10-01.CreatingAndStoringArtifacts)</p>
<p>Pipeline에 다음과 같이 스크립트를 추가합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages<span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps<span class="token punctuation">{</span>
                sh <span class="token string">'echo "Generating artifacts for ${BUILD_NUMBER}" > output.txt'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Archive'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                archiveArtifacts artifacts<span class="token punctuation">:</span> <span class="token string">'output.txt'</span><span class="token punctuation">,</span> onlyIfSuccessful<span class="token punctuation">:</span> <span class="token boolean">true</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>Archive</code> Stage에 <code v-pre>archiveArtifacts</code> 스크립트가 동작하는 예제입니다. 이같은 Pipeline 스크립트 작성을 도와주는 툴을 추가로 확인해 봅니다.</p>
<ul>
<li>Pipeline 하단의 <code v-pre>Pipeline Syntax</code> 링크를 클릭합니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564546308113.png" alt="1564546308113" loading="lazy"></li>
<li><code v-pre>Sample Step</code>에서 <code v-pre>archiveArtifacts: Archive the artifacts</code>를 선택합니다.
<ul>
<li>Files to archive : output.txt</li>
<li><code v-pre>고급...</code>을 클릭합니다.</li>
<li>다음 항목을 활성화 합니다.
<ul>
<li>Archive artifacts only if build is successful</li>
<li>Use default excludes</li>
<li>Treat include and exclude patterns as case sensitive</li>
</ul>
</li>
<li>하단의 <code v-pre>GENERATE PIPELINE SCRIPT</code>를 클릭합니다.</li>
</ul>
</li>
</ul>
<p>결과물을 확인하면 Pipeline 스크립트에 작성한 형태와 같은 것을 확인 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564545470815.png" alt="1564545470815" tabindex="0" loading="lazy"><figcaption>1564545470815</figcaption></figure>
<p>좌측 메뉴의 <code v-pre>Build Now</code>를 클릭하여 빌드 수행 후에 화면에 Artifacts 항목이 추가된 것을 확인할 수 있습니다. UI 상에는 마지막 빌드 결과가 강조되어 나오고 각 빌드에 대한 결과물은 각각의 빌드단계의 다운로드 버튼으로 확인하고 다운로드 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564545639205.png" alt="1564545639205" tabindex="0" loading="lazy"><figcaption>1564545639205</figcaption></figure>
<p><strong>Step 2. Fingerprinting for artifact tracking</strong></p>
<p>빌드 이후 보관되는 파일에 대해 어떤 프로젝트, 어떤 빌드 에서 발생한 결과물인지 확인할 수 있는 핑거프린팅 기능을 설명합니다.</p>
<p><code v-pre>Step 1</code>의 프로젝트를 그대로 사용하거나 Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 10-02.FingerprintingForArtifactTracking)</p>
<p><code v-pre>Step 1</code> Pipeline 스크립트의 <code v-pre>archiveArtifacts</code>에 <code v-pre>fingerprint: true</code>를 추가합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages<span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps<span class="token punctuation">{</span>
                sh <span class="token string">'echo "Generating text artifacts: Build:${BUILD_NUMBER}" > output.txt'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Archive'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                archiveArtifacts artifacts<span class="token punctuation">:</span> <span class="token string">'output.txt'</span><span class="token punctuation">,</span> fingerprint<span class="token punctuation">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> onlyIfSuccessful<span class="token punctuation">:</span> <span class="token boolean">true</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>파일의 지문을 확인합니다.</p>
<ul>
<li>
<p>첫번째 빌드를 수행하고 빌드 결과 아카이브 파일 <code v-pre>output.txt</code>파일을 다운로드 받습니다. (파일을 우클릭하고 <code v-pre>다른 이름으로 링크 저장...</code> or <code v-pre>Download Linked File</code> 을 클릭하여 파일을 받습니다.)<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564546697375.png" alt="1564546697375" loading="lazy"></p>
</li>
<li>
<p>좌측 상단의 <code v-pre>Jenkins</code>를 클릭하여 최상위 메뉴로 돌아갑니다.</p>
</li>
<li>
<p>좌측 메뉴의 <code v-pre>파일 핑거프린트 확인</code>을 클릭합니다.</p>
</li>
<li>
<p><code v-pre>파일 선택</code>버튼을 클릭하여 앞서 다운로드한 파일을 선택하고 <code v-pre>확인하기</code>버튼을 클릭합니다.</p>
</li>
<li>
<p>어떤 프로젝트의 몇번째 빌드에서 발생한 파일인지 확인합니다.</p>
</li>
<li>
<p>두번째 빌드를 수행하고 파일 핑거프린트를 확인해 봅니다.</p>
</li>
<li>
<p>빌드 번호 정보가 변경된 것을 확인합니다.</p>
</li>
</ul>
<h2 id="_11-pipelines" tabindex="-1"><a class="header-anchor" href="#_11-pipelines" aria-hidden="true">#</a> 11. Pipelines</h2>
<p>Pipeline에 대해 설명합니다.</p>
<p><strong>Step 1. Automating deployment with pipelines</strong></p>
<p>Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 11-01.AutomatingDeploymentWithPipelines)</p>
<p>Pipeline에 다음과 같은 스크립트를 입력합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'echo "Hello World"'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Test'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'echo "Test Hello World!"'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>두개의 Stage를 갖는 Pipeline 스크립트입니다. Pipeline은 빌드 수행시의 각 단계를 구분하여 빌드의 과정을 확인하고 실패에 따른 단계별 확인이 가능합니다.</p>
<p>좌측 <code v-pre>Build Now</code>를 클릭하여 빌드를 수행하면 빌드에 대한 결과는 Stage 별로 성공 실패의 여부와 로그를 확인할 수 있도록 <code v-pre>Stage View</code>가 UI로 제공됩니다. Stage 별로 Stage View는 기록되며, Stage에 변경이 있거나 이름이 변경되는 경우에는 해당 UI에 변경이 발생하여 기존 Pipeline 기록을 보지 못할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564547435978.png" alt="1564547435978" tabindex="0" loading="lazy"><figcaption>1564547435978</figcaption></figure>
<p><strong>Step 2. Creating pipeline gates</strong></p>
<p>Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 11-02.CreatingPipelineGates)</p>
<p>Pipeline에 다음과 같은 스크립트를 입력합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'echo "Hello World"'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'BuildMore'</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                input message<span class="token punctuation">:</span> <span class="token interpolation-string"><span class="token string">"Shall we build more?"</span></span>
                sh <span class="token string">'''
                    echo "We are approved; continue!"
                    ls -lah
                '''</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>개의 Stage를 갖는 Pipeline 스크립트입니다. 두번째 Stage에 <code v-pre>input</code> 스크립트가 있습니다. 이 스크립트가 추가되면 Pipeline을 진행하면서 해당하는 동작을 수행할 것인지, 마치 승인 작업과 같은 동작을 수행할 수 있습니다.</p>
<p>좌측 <code v-pre>Build Now</code>를 클릭하여 빌드를 수행하면 두번째 Stage에서 해당 작업을 수행할 지에 대한 물음을 확인 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564547694870.png" alt="1564547694870" tabindex="0" loading="lazy"><figcaption>1564547694870</figcaption></figure>
<p><code v-pre>Abort</code>를 선택하면 빌드 취소와 같은 동작으로 실패로 처리되지는 않습니다.</p>
<p><strong>Step 3. Job promotion for long-running pipeline</strong></p>
<p>빌드 단계를 구현할 때 Pipeline 스크립트로 하나의 프로젝트 내에서 모든 동작을 정의 할 수도 있지만 서로다른 Job을 연계하고, 승인 절차를 따르도록 구성할 수 있습니다.</p>
<p>Job promotion 기능을 사용하기 위한 플러그인을 설치합니다.</p>
<ul>
<li><code v-pre>Jenkins 관리</code>에서 <code v-pre>플러그인 관리</code>를 선택합니다.</li>
<li><code v-pre>설치 가능</code> 탭을 클릭하고 상단의 검색에 <code v-pre>promoted</code>를 입력하면 <code v-pre>promoted builds</code>를 확인 할 수 있습니다.  설치합니다.</li>
</ul>
<p>FreeStyle 타입의 Item을 생성합니다. (e.g. 11-03.Job-one)</p>
<ul>
<li>
<p>General 탭의 <code v-pre>Promote builds when...</code>를 활성화 하여 설정합니다.</p>
<ul>
<li>Name : Manual</li>
<li>Criteria 설정의 <code v-pre>Only when manually approved</code> 활성화
<ul>
<li>Approvers : 승인자를 입력합니다. (e.g. admin)</li>
<li><code v-pre>ADD PRAMETER</code> 드롭박스에서 <code v-pre>Boolean Parameter</code>를 선택합니다.
<ul>
<li>Name : approve</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>
<p>Build 드롭박스에서 <code v-pre>Execute shell</code>을 선택합니다.</p>
</li>
<li>
<p>다음을 입력합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token string">'This is the Job-one'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>저장하면 생성된 프로젝트에 <code v-pre>Promotion Status</code>항목이 추가되어 생성됩니다.</p>
</li>
</ul>
<p><code v-pre>11-03.Job-one</code> 빌드 후 승인에 대한 다음 빌드를 진행할 FreeStyle 타입의 Item을 생성합니다. (e.g. 11-03.Job-two)</p>
<ul>
<li>
<p>빌드 유발 항목에서 <code v-pre>Build when another project is promoted</code>를 활성화 합니다. 어떤 Job에서 promote 상황이 발생하였을 때 빌드를 수행할지 지정합니다.</p>
<ul>
<li>Job Name : 11-03.Job-one</li>
<li>Promotion : Manual</li>
</ul>
</li>
<li>
<p>Build 드롭박스에서 <code v-pre>Execute shell</code>을 선택합니다.</p>
</li>
<li>
<p>다음을 입력합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">echo</span> <span class="token string">'This is the Job-two'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
<p><code v-pre>11-03.Job-one</code>에 대한 빌드를 수행합니다. 수행 완료 후 빌드 히스토리의 최근 빌드를 클릭(e.g. #1)하면 <code v-pre>Promotion Status</code>에 승인절차를 기다리고 있음을 확인할 수 있습니다. Parameters 항목의 <code v-pre>approve</code>를 체크하고 <code v-pre>APPROVE</code>버튼을 클릭합니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564554095622.png" alt="1564554095622" tabindex="0" loading="lazy"><figcaption>1564554095622</figcaption></figure>
<p>승인이 완료되면 해당 프로젝트의 승인에 대한 이벤트를 통해 빌드를 수행하는 <code v-pre>11-03.Job-two</code>가 이어서 빌드됨을 확인 할 수 있습니다.</p>
<p><strong>Step 4. Multibranch repository automation</strong></p>
<p>SCM의 Multibranch를 빌드하는 과정에 대해 설명합니다.</p>
<p>다음의 GitHub repository를 fork 합니다.</p>
<ul>
<li><a href="https://github.com/Great-Stone/multibranch-demo" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/multibranch-demo<ExternalLinkIcon/></a></li>
</ul>
<p>Multibranch Pipeline 형태의 Item을 생성합니다. (e.g. 11-04.MultibranchRepositoryAutomation)</p>
<ul>
<li>Branch Sources의 <code v-pre>ADD SOURCE</code>드롭박스에서 GitHub를 클릭합니다.
<ul>
<li>Credentials에서 앞서 생성한 GitHub 접속을 위한 Credential을 선택합니다.</li>
<li>Repository HTTPS URL에 앞서 fork한 GitHub URL을 입력하고 <code v-pre>VALIDATE</code>버튼을 클릭하여 잘 접근 되는지 확인합니다.</li>
</ul>
</li>
<li>Scan Multibranch Pipeline Triggers에서 <code v-pre>Periodically if not otherwise run</code>를 활성화 합니다.
<ul>
<li>Interval 주기를 <code v-pre>1 minute</code>으로 설정합니다.</li>
</ul>
</li>
</ul>
<p>저장 후에는 자동적으로 모든 브랜치의 소스를 빌드 수행합니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564555063361.png" alt="1564555063361" tabindex="0" loading="lazy"><figcaption>1564555063361</figcaption></figure>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564554995103.png" alt="1564554995103" tabindex="0" loading="lazy"><figcaption>1564554995103</figcaption></figure>
<p>SCM에서 브랜치를 여러개 관리하고 모두 빌드와 테스팅이 필요하다면 Multibranch 프로젝트를 생성하여 등록하고, 빌드 관리가 가능합니다.</p>
<p><strong>Step 5. Creating pipeline with snippets</strong></p>
<p>Pipeline 을 스크립트를 작성하는 방법을 배워봅니다. Pipeline 타입의 Item을 생성합니다. (e.g. 11-05. CreatingPipelineWithSnippets)</p>
<p>Pipeline에 다음과 같은 스크립트를 입력합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">"Hello"</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                echo <span class="token string">'Hello World'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>echo가 동작할때 시간을 기록하도록 스크립트를 수정해보겠습니다.</p>
<ul>
<li>
<p>Pipeline Syntax 링크를 클릭합니다.</p>
</li>
<li>
<p>Sample Step에서 <code v-pre>timestamps: timestamps</code>를 선택하고 <code v-pre>GENERATE PIPELINE SCRIPT</code>버튼을 클릭합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>timestamps <span class="token punctuation">{</span>
    <span class="token comment">// some block</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>사용방식을 확인하고 앞서 Pipeline 스크립트의 stage에 시간을 기록하도록 수정합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code><span class="token punctuation">...</span>
<span class="token function">stage</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">"Hello"</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    steps <span class="token punctuation">{</span>
        timestamps <span class="token punctuation">{</span>
            echo <span class="token string">'Hello World'</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token punctuation">...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<p>빌드를 수행하고 로그를 확인해 봅니다. echo 동작이 수행 될때 시간이 함께 표기되는 것을 확인 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564555730104.png" alt="1564555730104" tabindex="0" loading="lazy"><figcaption>1564555730104</figcaption></figure>
<p><strong>Step 6. Discovering global pipeline variables</strong></p>
<p>Pipeline에서 사용할 수 있는 변수를 확인하고 사용하는 방법을 알아봅니다. Pipeline 타입의 Item을 생성합니다. (e.g. 11-06.DiscoveringGlobalPipelineVariables)</p>
<p>Pipeline에 다음과 같은 스크립트를 입력합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
               echo <span class="token interpolation-string"><span class="token string">"We are in build </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">currentBuild<span class="token punctuation">.</span>number</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span>
               echo <span class="token interpolation-string"><span class="token string">"Our current result is </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">currentBuild<span class="token punctuation">.</span>currentResult</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'BuildMore'</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
               echo <span class="token interpolation-string"><span class="token string">"Name of the project is </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">currentBuild<span class="token punctuation">.</span>projectName</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'BuildEnv'</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                echo <span class="token interpolation-string"><span class="token string">"Jenkins Home : </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">env<span class="token punctuation">.</span>JENKINS_HOME</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Pipeline 스크립트에서 사용가능한 변수와 사용방법은 <code v-pre>Pipeline Syntax</code> 링크의 <code v-pre>Global Variables Reference</code> 항목에서 확인 가능합니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564557613406.png" alt="1564557613406" tabindex="0" loading="lazy"><figcaption>1564557613406</figcaption></figure>
<h2 id="apendix" tabindex="-1"><a class="header-anchor" href="#apendix" aria-hidden="true">#</a> Apendix</h2>
<p><strong>GitHub SCM 연동 이슈</strong></p>
<p>GitHub를 SCM으로 사용하는 경우 다음과 같은 메시지가 출력되면서 진행되지 않는 경우가 있습니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>GitHub API Usage: Current quota has 5000 remaining (447380 over budget). Next quota of 5000 in 5 days 0 hr. Sleeping for 4 days 23 hr.
14:07:33 GitHub API Usage: The quota may have been refreshed earlier than expected, rechecking...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>이 경우 서버 시간과 GitHub의 시간이 맞지 않아 발생할 수 있는 이슈 입니다.  ntpdate를 재설정 합니다.</p>
<ul>
<li>
<p>RHEL7 : ntpd를 재시작 합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ systemctl restart ntpd
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>RHEL8 : RHEL8에서는 ntpdate를 사용하지 않고 chronyd가 대신합니다.<br>
<a href="https://access.redhat.com/solutions/4130881" target="_blank" rel="noopener noreferrer">https://access.redhat.com/solutions/4130881<ExternalLinkIcon/></a></p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ systemctl stop chronyd
$ chronyd <span class="token parameter variable">-q</span>
$ systemctl start chronyd
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<p><strong>유용한 플러그인</strong></p>
<ul>
<li>Restart Safely : Jenkins를 재기동해야하는 경우 빌드가 수행중이지 않을 때 자동으로 Restart 시켜줍니다. 설치 후에는 왼쪽 주 메뉴에 표시됩니다.</li>
<li>ThinBackup : Jenkins의 구성을 백업, 복구할 수 있는 기능을 제공합니다. 백업 주기나 백업 개수등을 정의 할 수 있습니다.</li>
</ul>
</div></template>


