<template><div><h1 id="pass-hcl-to-api" tabindex="-1"><a class="header-anchor" href="#pass-hcl-to-api" aria-hidden="true">#</a> Pass HCL to API</h1>
<p>HCL로 작성된 Job의 경우 Nomad CLI 또는 UI 접속이 가능하다면 바로 적용 가능하다.</p>
<details class="hint-container details"><summary>HCL Job Sample (2048.hcl)</summary>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"2048-game"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> <span class="token string">"service"</span>
  group <span class="token string">"game"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span> <span class="token comment"># number of instances</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">80</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"2048"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"alexwhen/docker-2048"</span>

        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"http"</span>
        <span class="token punctuation">]</span>

      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">500</span> <span class="token comment"># 500 MHz</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">256</span> <span class="token comment"># 256MB</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>nomad job run <span class="token number">2048</span>.hcl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="@source/04-HashiCorp/07-Nomad/04-UseCase/image/run-job-ui.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>하지만 CLI/UI를 사용할 수 없는 환경에서 API를 사용하여 Job을 실행해야하는 경우, 특히 CICD Pipeline구성에서 API를 사용하여 Job을 실행해야하는 경우 HCL을 Json 형식으로 변경해야하는 경우가 있다.</p>
<h2 id="hcl-parse-to-json" tabindex="-1"><a class="header-anchor" href="#hcl-parse-to-json" aria-hidden="true">#</a> HCL parse to Json</h2>
<p>HCL을 Json으로 변경하는 방식의 첫번째는 CLI를 사용하는 방식이다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>nomad job run <span class="token parameter variable">-output</span> <span class="token number">2048</span>.hcl <span class="token operator">></span> payload.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>하지만 이 경우 <code v-pre>-output</code>을 입력하지 않는 경우 Job이 실행되는 실수의 여지가 있고, CLI가 없다면 사용 불가하다.</p>
<p>다음은 API를 사용하는 방식이다.</p>
<blockquote>
<p>Parsh Job : <a href="https://developer.hashicorp.com/nomad/api-docs/jobs#parse-job" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/nomad/api-docs/jobs#parse-job<ExternalLinkIcon/></a></p>
</blockquote>
<p>문서의 내용처럼 HCL을 한줄로 변경하여 API로 요청하면 Json으로 형태를 출력해준다.</p>
<h3 id="sample-payload" tabindex="-1"><a class="header-anchor" href="#sample-payload" aria-hidden="true">#</a> Sample Payload</h3>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"JobHCL"</span><span class="token operator">:</span> <span class="token string">"job \"example\" {\n  type = \"service\"\n  group \"cache\" {}\n}"</span><span class="token punctuation">,</span>
  <span class="token property">"Canonicalize"</span><span class="token operator">:</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>HCL을 한줄로 변경하기 까다롭거나 별도의 도구가 없다면 <code v-pre>jq</code>를 활용한 방식도 가이드하고 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>jq <span class="token parameter variable">-Rsc</span> <span class="token string">'{ JobHCL: ., Canonicalize: true }'</span> example.nomad.hcl <span class="token operator">></span> payload.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="sample-request" tabindex="-1"><a class="header-anchor" href="#sample-request" aria-hidden="true">#</a> Sample Request</h3>
<p><code v-pre>/v1/jobs/parse</code> 엔드포인트로 <code v-pre>payload.json</code> 데이터를 담아 요청한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token punctuation">\</span>
    <span class="token parameter variable">--request</span> POST <span class="token punctuation">\</span>
    <span class="token parameter variable">--data</span> @payload.json <span class="token punctuation">\</span>
    https://localhost:4646/v1/jobs/parse
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="sample-response" tabindex="-1"><a class="header-anchor" href="#sample-response" aria-hidden="true">#</a> Sample Response</h3>
<p>Json으로 변경된 값을 반환한다.</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"AllAtOnce"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
  <span class="token property">"Constraints"</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">"Affinities"</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">"CreateIndex"</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token property">"Datacenters"</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>
  <span class="token property">"ID"</span><span class="token operator">:</span> <span class="token string">"my-job"</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="hcl로-작성된-job을-api로-실행하기" tabindex="-1"><a class="header-anchor" href="#hcl로-작성된-job을-api로-실행하기" aria-hidden="true">#</a> HCL로 작성된 Job을 API로 실행하기</h2>
<p>API가 제공하는 Json Parse를 사용, 다음과 같은 순서로 Job을 실행할 수 있다.</p>
<Mermaid id="mermaid-65" code="eJwrTi0sTc1LTnXJTEwvSszlUgACn/zkxBxdOzu//NzEFAXHAE8rBQ9nH4WAxKLiVLACuIQuUBVYtZWCV3F+HpJuTaiwY0qKQkh+gYJPallqjkK1gld+kkItLltcK1KTS0tSwYrKM0sywIYqpGXmpHIBANakM1A="></Mermaid><h3 id="_1-json으로-생성할-hcl을-hcl-json으로-생성" tabindex="-1"><a class="header-anchor" href="#_1-json으로-생성할-hcl을-hcl-json으로-생성" aria-hidden="true">#</a> 1. Json으로 생성할 HCL을 <code v-pre>hcl.json</code>으로 생성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>jq <span class="token parameter variable">-Rsc</span> <span class="token string">'{ JobHCL: ., Canonicalize: true }'</span> <span class="token number">2048</span>.hcl <span class="token operator">></span> hcl.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-v1-jobs-parse-엔드포인트로-요청하여-json형태로-파싱" tabindex="-1"><a class="header-anchor" href="#_2-v1-jobs-parse-엔드포인트로-요청하여-json형태로-파싱" aria-hidden="true">#</a> 2. <code v-pre>/v1/jobs/parse</code> 엔드포인트로 요청하여 Json형태로 파싱</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">--request</span> POST <span class="token parameter variable">--data</span> @hcl.json http://127.0.0.1:4646/v1/jobs/parse
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>한가지 문제는, Job의 Json 정의에는 <code v-pre>Job</code> 이라는 키값이 최상위에 존재해야하는데, 반환되는 결과에는 <code v-pre>Job</code> 하위부터 출력된다. 따라서 <code v-pre>jq</code>를 사용하여 다음과 같이 출력을 수정하여 저장한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">--request</span> POST <span class="token parameter variable">--data</span> @hcl.json http://127.0.0.1:4646/v1/jobs/parse <span class="token operator">|</span> jq <span class="token parameter variable">-s</span> <span class="token string">'{ Job: .[] }'</span> <span class="token operator">></span> <span class="token number">2048</span>.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_3-생성된-json으로-job-실행" tabindex="-1"><a class="header-anchor" href="#_3-생성된-json으로-job-실행" aria-hidden="true">#</a> 3. 생성된 json으로 Job 실행</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">--request</span> POST <span class="token parameter variable">--data</span> @2048.json http://127.0.0.1:4646/v1/jobs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><hr>
<p>위 과정을 다음과 같이 한줄로 정의할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>jq <span class="token parameter variable">-Rsc</span> <span class="token string">'{ JobHCL: ., Canonicalize: true }'</span> <span class="token number">2048</span>.hcl <span class="token operator">|</span> <span class="token punctuation">\</span>
<span class="token function">curl</span> <span class="token parameter variable">--request</span> POST <span class="token parameter variable">--data</span> @- http://127.0.0.1:4646/v1/jobs/parse <span class="token operator">|</span> <span class="token punctuation">\</span>
jq <span class="token parameter variable">-s</span> <span class="token string">'{ Job: .[] }'</span> - <span class="token operator">|</span> <span class="token punctuation">\</span>
<span class="token function">curl</span> <span class="token parameter variable">--request</span> POST <span class="token parameter variable">--data</span> @- http://127.0.0.1:4646/v1/jobs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


