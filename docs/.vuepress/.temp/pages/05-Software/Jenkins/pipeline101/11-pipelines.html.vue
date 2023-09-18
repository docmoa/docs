<template><div><h1 id="_11-pipelines" tabindex="-1"><a class="header-anchor" href="#_11-pipelines" aria-hidden="true">#</a> 11. Pipelines</h1>
<h2 id="_11-1-automating-deployment-with-pipelines" tabindex="-1"><a class="header-anchor" href="#_11-1-automating-deployment-with-pipelines" aria-hidden="true">#</a> 11.1 Automating deployment with pipelines</h2>
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
<h2 id="_11-2-creating-pipeline-gates" tabindex="-1"><a class="header-anchor" href="#_11-2-creating-pipeline-gates" aria-hidden="true">#</a> 11.2 Creating pipeline gates</h2>
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
<h2 id="_11-3-job-promotion-for-long-running-pipeline" tabindex="-1"><a class="header-anchor" href="#_11-3-job-promotion-for-long-running-pipeline" aria-hidden="true">#</a> 11.3 Job promotion for long-running pipeline</h2>
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
<h2 id="_11-4-multibranch-repository-automation" tabindex="-1"><a class="header-anchor" href="#_11-4-multibranch-repository-automation" aria-hidden="true">#</a> 11.4 Multibranch repository automation</h2>
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
<h2 id="_11-5-creating-pipeline-with-snippets" tabindex="-1"><a class="header-anchor" href="#_11-5-creating-pipeline-with-snippets" aria-hidden="true">#</a> 11.5 Creating pipeline with snippets</h2>
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
<h2 id="_11-6-discovering-global-pipeline-variables" tabindex="-1"><a class="header-anchor" href="#_11-6-discovering-global-pipeline-variables" aria-hidden="true">#</a> 11.6 Discovering global pipeline variables</h2>
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
</div></template>


