<template><div><h1 id="_10-artifacts" tabindex="-1"><a class="header-anchor" href="#_10-artifacts" aria-hidden="true">#</a> 10. Artifacts</h1>
<p>빌드 이후 빌드의 결과를 기록하고 저장하는 방법을 설명합니다.</p>
<h2 id="_10-1-creating-and-storing-artifacts" tabindex="-1"><a class="header-anchor" href="#_10-1-creating-and-storing-artifacts" aria-hidden="true">#</a> 10.1 Creating and storing artifacts</h2>
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
<h2 id="_10-2-fingerprinting-for-artifact-tracking" tabindex="-1"><a class="header-anchor" href="#_10-2-fingerprinting-for-artifact-tracking" aria-hidden="true">#</a> 10.2. Fingerprinting for artifact tracking</h2>
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
</div></template>


