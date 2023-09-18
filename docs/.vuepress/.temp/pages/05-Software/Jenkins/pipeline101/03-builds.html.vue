<template><div><h1 id="_3-builds" tabindex="-1"><a class="header-anchor" href="#_3-builds" aria-hidden="true">#</a> 3. Builds</h1>
<h2 id="_3-1-tracking-build-state" tabindex="-1"><a class="header-anchor" href="#_3-1-tracking-build-state" aria-hidden="true">#</a> 3.1 Tracking build state</h2>
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
<h2 id="_3-2-polling-scm-for-build-triggering" tabindex="-1"><a class="header-anchor" href="#_3-2-polling-scm-for-build-triggering" aria-hidden="true">#</a> 3.2 Polling SCM for build triggering</h2>
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
<h2 id="_3-3-connecting-jenkins-to-github" tabindex="-1"><a class="header-anchor" href="#_3-3-connecting-jenkins-to-github" aria-hidden="true">#</a> 3.3 Connecting Jenkins to GitHub</h2>
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
<h2 id="_3-4-webhook-build-triggering" tabindex="-1"><a class="header-anchor" href="#_3-4-webhook-build-triggering" aria-hidden="true">#</a> 3.4 Webhook build triggering</h2>
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
</div></template>


