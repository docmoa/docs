<template><div><h1 id="_2-jobs" tabindex="-1"><a class="header-anchor" href="#_2-jobs" aria-hidden="true">#</a> 2. Jobs</h1>
<p>프로젝트는 Job의 일부 입니다. 즉, 모든 프로젝트가 Job이지만 모든 Job이 프로젝트는 아닙니다. Job의 구조는 다음과 같습니다.</p>
<Mermaid id="mermaid-6" code="eJxtjk0KwkAMRveeYpbpolcQpr8qCmLBfabEOlJmJKZYb68NIhaa5XuP8HWM96vZn1bmcxZ20SUmTdcZWPcQxlaOHG/USqJBNjlTwQGF/bigapjBWuEGKiZq5NXTgt1+v+UxXHw3MIqPYdZZ7XJoZHDTwD9YwNnT8wcLhSWUoxAH7FW8AUDhPw0="></Mermaid><p>FreeStyleProejct, MatrixProject, ExternalJob만 <code v-pre>New job</code>에 표시됩니다.</p>
<h2 id="_2-1-new-pipeline" tabindex="-1"><a class="header-anchor" href="#_2-1-new-pipeline" aria-hidden="true">#</a> 2.1 New pipeline</h2>
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
<h2 id="_2-2-new-pipeline" tabindex="-1"><a class="header-anchor" href="#_2-2-new-pipeline" aria-hidden="true">#</a> 2.2 New pipeline</h2>
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
<h2 id="_2-3-parameterizing-a-job" tabindex="-1"><a class="header-anchor" href="#_2-3-parameterizing-a-job" aria-hidden="true">#</a> 2.3 Parameterizing a job</h2>
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
<h2 id="_2-4-creating-multiple-steps-for-a-job" tabindex="-1"><a class="header-anchor" href="#_2-4-creating-multiple-steps-for-a-job" aria-hidden="true">#</a> 2.4 Creating multiple steps for a job</h2>
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
<h2 id="_2-5-adding-scripts-as-a-job-step" tabindex="-1"><a class="header-anchor" href="#_2-5-adding-scripts-as-a-job-step" aria-hidden="true">#</a> 2.5 Adding scripts as a job step</h2>
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
</div></template>


