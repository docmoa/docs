<template><div><h1 id="remote-runs" tabindex="-1"><a class="header-anchor" href="#remote-runs" aria-hidden="true">#</a> Remote Runs</h1>
<p>Terraform의 Remote Runs이라는 기능에 대해 확인합니다.</p>
<p>Terraform Cloud와 Terraform Enterprise는 원격으로 트리거링 되어 동작하는 메커니즘을 제공하고 있습니다.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/fqCcVYm7u4g" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>Enterprise에서는 수행의 주체가 중앙 서버이며, 등록된 VCS나 Terraform  설정 파일의 구성을 통해 원격으로 트리거링할 수 있습니다.</p>
<hr>
<table>
<thead>
<tr>
<th>유형</th>
<th>지원여부</th>
</tr>
</thead>
<tbody>
<tr>
<td>Terraform OSS (Open Source Software)</td>
<td>•</td>
</tr>
<tr>
<td>Terraform Cloud</td>
<td>✔︎</td>
</tr>
<tr>
<td>Terraform Cloud for Business</td>
<td>✔︎</td>
</tr>
<tr>
<td>Terraform Enterprise</td>
<td>✔︎</td>
</tr>
</tbody>
</table>
<hr>
<p>원격으로 실행시키는 메커니즘은 총 3가지 형태가 있습니다.</p>
<ul>
<li>VCS에서 Pull 요청시</li>
<li>CI/CD 과정에서 API를 통한 호출</li>
<li>CLI로 수행</li>
</ul>
<h2 id="vcs-pull-request" tabindex="-1"><a class="header-anchor" href="#vcs-pull-request" aria-hidden="true">#</a> VCS Pull Request</h2>
<p>워크스페이스는 VCS와 연동하는 것이 일반적이며, 이 경우 VCS에 Pull이 발생하면 이를 감지하여 해당 워크스페이스의 Run이 수행되는 케이스 입니다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Terraform Cloud 2020-07-15 23-01-23.png" alt="Terraform Cloud 2020-07-15 23-01-23" tabindex="0" loading="lazy"><figcaption>Terraform Cloud 2020-07-15 23-01-23</figcaption></figure>
<p>VCS에 Pull이 발생하는 것은 최종적으로 검증된 코드가 올라왔다고 판단되어 동작하며, 특정 파일이나 경로에 관련 동작이 발생했을 경우에만 Run이 수행되도록 설정 가능합니다.</p>
<h2 id="api-call" tabindex="-1"><a class="header-anchor" href="#api-call" aria-hidden="true">#</a> API call</h2>
<p>별도의 CI/CD 파이프라인과 연계하여 사용하는 경우에는 API를 호출하여 실행시키는 방식을 제공합니다. 인프라의 변경 뿐만 아니라 애플리케이션과 상호 작용하는 경우에 유용하며, 인가된 사용자를 구분하기 위해 Token을 필요로 합니다. 주의해야 할 점은 문서상에 나와있는 것 처럼 Organization Token이 아닌 User나 Team의 Token으로 요청해야 합니다. <a href="https://www.terraform.io/docs/cloud/api/run.html#create-a-run" target="_blank" rel="noopener noreferrer">문서 링크<ExternalLinkIcon/></a></p>
<p>처음 워크스페이스에 Run을 요청하는 JSON 형태의 data의 예는 다음과 같습니다.</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"attributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"is-destroy"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token property">"message"</span><span class="token operator">:</span> <span class="token string">"Remote Run - API"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"runs"</span><span class="token punctuation">,</span>
    <span class="token property">"relationships"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"workspace"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"workspaces"</span><span class="token punctuation">,</span>
          <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"ws-53JSjeBcXFTCVQis"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>작성된 json파일을 POST 로 요청하는 형태는 다음과 같습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">--header</span> <span class="token string">"Authorization: Bearer <span class="token variable">$TF_CLOUD_TOKEN</span>"</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">--header</span> <span class="token string">"Content-Type: application/vnd.api+json"</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">--request</span> POST <span class="token punctuation">\</span>
  <span class="token parameter variable">--data</span> @run.json <span class="token punctuation">\</span>
  https://app.terraform.io/api/v2/runs
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Run을 요청한 응답 데이터에는 관련 <code v-pre>ìd</code>와 유형, 기타 정보들이 담겨있습니다.</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"run-CZcmD7eagjhyX0vN"</span><span class="token punctuation">,</span>
    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"runs"</span><span class="token punctuation">,</span>
    <span class="token property">"attributes"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"auto-apply"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token property">"error-text"</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>
      ...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Terraform 웹 콘솔에 접속하여 확인해보면 해당 <code v-pre>ìd</code>값을 갖는 Run이 수행됨을 확인 할 수 있습니다.</p>
<p>이후 apply를 위해 <code v-pre>comment</code>가 담긴 데이터를 생성하고, 앞서 응답받은 Run의 <code v-pre>id</code> 경로로 요청을 보냅니다.</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"comment"</span><span class="token operator">:</span><span class="token string">"Looks good to me"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">--header</span> <span class="token string">"Authorization: Bearer <span class="token variable">$TF_CLOUD_TOKEN</span>"</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">--header</span> <span class="token string">"Content-Type: application/vnd.api+json"</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">--request</span> POST <span class="token punctuation">\</span>
  <span class="token parameter variable">--data</span> @apply.json <span class="token punctuation">\</span>
  https://app.terraform.io/api/v2/runs/run-CZcmD7eagjhyX0vN/actions/apply
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>API 호출을 사용하면 다양한 시스템을 활용하여 Terraform을 수행할 수 있습니다.</p>
<h2 id="cli-수행" tabindex="-1"><a class="header-anchor" href="#cli-수행" aria-hidden="true">#</a> CLI 수행</h2>
<p>Terraform을 OSS로 사용하시는 분들은 커맨드 항목 중에 <code v-pre>login</code>, <code v-pre>logout</code>이 있는 것을 보셨을 수 있습니다. 해당 커맨드는 Terraform Cloud나 Terraform Enterprise를 활용하여 프로비저닝을 수행할 수 있는 커맨드 입니다. 원격으로 실행시키기 위해서는 우선 대상에 대한 정의가 필요합니다.</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>terraform <span class="token punctuation">{</span>
  backend <span class="token string">"remote"</span> <span class="token punctuation">{</span>
    organization <span class="token operator">=</span> <span class="token string">"great-stone"</span>
    workspaces <span class="token punctuation">{</span>
      name <span class="token operator">=</span> <span class="token string">"random-pet-demo"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>tf 파일에 <code v-pre>backend</code>에 대한 설정을 추가하면 테라폼 실행시 원격의 서버와 통신하여 작업을 수행합니다. 워크스페이스의 경우 별도 VCS를 연동하지 않고 로컬과 연계하여 동작하게 됩니다. 또한 Apply 시 <code v-pre>yes</code>에 대한 동작도 웹콘솔에서 수행던 로컬에서 수행하던 서로 동기화 되어 실행 됩니다.</p>
<h2 id="마치며" tabindex="-1"><a class="header-anchor" href="#마치며" aria-hidden="true">#</a> 마치며</h2>
<p>VCS, API, CLI 모두 Terraform의 Run을 수행하는 동일한 동작을 수행합니다. 각 팀, 조직에서의 프로비저닝을 위한 관리 방식에 따라 가장 알맞은 방식으로 접근할 수 있는 메커니즘을 잘 활용하면 효율적인 자원 관리가 가능합니다.</p>
</div></template>


