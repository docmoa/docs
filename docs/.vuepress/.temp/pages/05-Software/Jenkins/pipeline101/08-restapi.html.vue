<template><div><h1 id="_8-rest-api" tabindex="-1"><a class="header-anchor" href="#_8-rest-api" aria-hidden="true">#</a> 8. REST API</h1>
<p>Jenkins는 외부 서비스와의 연동이나 정보 조회를 위한 API를 제공합니다.</p>
<h2 id="_8-1-triggering-builds-via-the-rest-api" tabindex="-1"><a class="header-anchor" href="#_8-1-triggering-builds-via-the-rest-api" aria-hidden="true">#</a> 8.1 Triggering builds via the REST API</h2>
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
<h2 id="_8-2-retriving-build-status-via-the-rest-api" tabindex="-1"><a class="header-anchor" href="#_8-2-retriving-build-status-via-the-rest-api" aria-hidden="true">#</a> 8.2 Retriving build status via the REST API</h2>
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


