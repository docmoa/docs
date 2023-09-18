<template><div><h1 id="_4-agents-and-distributing-builds" tabindex="-1"><a class="header-anchor" href="#_4-agents-and-distributing-builds" aria-hidden="true">#</a> 4. Agents and Distributing Builds</h1>
<p>빌드를 수행하기 위한 Worker로 다중 Jenkins를 컨트롤 할 수 있습니다. 이때 명령을 수행하는 Jenkins는 <code v-pre>Master</code>, 빌드를 수행하는 Jenkins는 <code v-pre>Worker</code>로 구분합니다. 여기서는 Worker의 연결을 원격 호스트의 Jenkins를 SSH를 통해 연결하는 방식과 컨테이너로 구성된 Jenkins를 연결하는 과정을 확인 합니다.</p>
<p>Master-Slave 방식, 또는 Master-Agent 방식으로 표현합니다.</p>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>※ Slave 호스트에 Jenkins를 설치할 필요는 없습니다.</p>
</div>
<h2 id="_4-1-adding-an-ssh-build-agent-to-jenkins" tabindex="-1"><a class="header-anchor" href="#_4-1-adding-an-ssh-build-agent-to-jenkins" aria-hidden="true">#</a> 4.1 Adding an SSH build agent to Jenkins</h2>
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
<h2 id="_4-2-using-docker-images-for-agents" tabindex="-1"><a class="header-anchor" href="#_4-2-using-docker-images-for-agents" aria-hidden="true">#</a> 4.2 Using Docker images for agents</h2>
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
<h2 id="_4-3-configuring-specific-agents" tabindex="-1"><a class="header-anchor" href="#_4-3-configuring-specific-agents" aria-hidden="true">#</a> 4.3 Configuring specific agents</h2>
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
</div></template>


