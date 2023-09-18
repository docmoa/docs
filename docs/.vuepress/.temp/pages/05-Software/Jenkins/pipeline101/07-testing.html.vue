<template><div><h1 id="_7-testing" tabindex="-1"><a class="header-anchor" href="#_7-testing" aria-hidden="true">#</a> 7. Testing</h1>
<h2 id="_7-1-code-coverage-tests-and-reports" tabindex="-1"><a class="header-anchor" href="#_7-1-code-coverage-tests-and-reports" aria-hidden="true">#</a> 7.1 Code coverage tests and reports</h2>
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
<h2 id="_7-2-using-test-results-to-stop-the-build" tabindex="-1"><a class="header-anchor" href="#_7-2-using-test-results-to-stop-the-build" aria-hidden="true">#</a> 7.2 Using test results to stop the build</h2>
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
</div></template>


