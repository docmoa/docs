<template><div><h1 id="policy-as-code-sentinel" tabindex="-1"><a class="header-anchor" href="#policy-as-code-sentinel" aria-hidden="true">#</a> Policy as Code : Sentinel</h1>
<p>Terraform은 인프라의 코드화 측면에서 그 기능을 충실히 실현해줍니다. 하지만 팀과 조직에서는 단지 인프라의 코드적 관리와 더불어 다른 기능들이 필요하기 마련입니다. 그중 하나로 정책을 꼽을 수 있습니다.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/QQ2SnWmSbjE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>Infrastructure as Code를 구현하면 이전보다 빠른 프로비저닝이 가능합니다. 하지만, 여기에 팀웍과 조직 내 거버넌스를 유지하기 위해 또다른 도구나 무언가가 필요하다면? 관리를 위한 관리, 도구를 위한 도구들이 필요하게 될 것입니다. 그래서 테라폼의 클라우드 버전 부터는 팀이나 조직의 정책을 코드로 관리하여 자산화 시킬 수 있는 도구를 제공합니다.</p>
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
<h2 id="sentinel-구성" tabindex="-1"><a class="header-anchor" href="#sentinel-구성" aria-hidden="true">#</a> Sentinel 구성</h2>
<p>Sentinel 이 하시코프의 솔루션들의 정책 코드화를 위한 도구 입니다. 앞서의 IaC에 더불어 Policy 또한 코드로 정의하고 체계화 할 수 있게 도와주는 도구입니다. Sentinel 또한 VCS로 관리되고 하나 이상의 워크스페이스에 정책을 적용할 수 있게 설계 되었습니다. Sentinel의 구성은 다음과 같습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>└── Sentinel_Root
    ├── sentinel.hcl
    ├── <span class="token punctuation">[</span>abc<span class="token punctuation">]</span>.sentinel
    ├── <span class="token punctuation">[</span>def<span class="token punctuation">]</span>.sentinel
    ├── <span class="token punctuation">[</span><span class="token punctuation">..</span>.<span class="token punctuation">]</span>.sentinel
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>sentinel.hcl</code>에서 해당 정책 묶음을 관리합니다. 정책은 단일 또는 다중의 조건이 있으며, 각 조건은 필수인지 아닌지에 대한 조건도 있을 것입니다. 각 정책은 <code v-pre>policy</code> 로  <code v-pre>.sentinel</code> 확장자 앞의 이름이 정의 됩니다.</p>
<p>정책을 선언할 때 각각의 강제 정도를 정의할 수 있습니다.</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code>policy <span class="token string">"restrict-output-sensitive"</span> <span class="token punctuation">{</span>
    # enforcement_level = <span class="token string">"advisory"</span>
    # enforcement_level = <span class="token string">"soft-mandatory"</span>
    enforcement_level = <span class="token string">"hard-mandatory"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Advisory: 정책 위반시 경고</li>
<li>Soft Mandatory: 규정 위반 시 사용자가 재정의(통과) 가능</li>
<li>Hard Mandatory: 정책 규정 위반 불가 (에러 처리)</li>
</ul>
<h2 id="policy" tabindex="-1"><a class="header-anchor" href="#policy" aria-hidden="true">#</a> Policy</h2>
<p>정책은 Plan에 따른 <code v-pre>state</code>나  <code v-pre>config</code> 에 작성된 조건들, 또는 시간과 같은 항목에 따라 작성가능하고, 리턴되는 값이 <code v-pre>true</code> 인 경우 해당 정책 조건을 만족하는 것으로 판단합니다. 작성하는 기법에 따라 여러 조건은 하나의 파일에 작성할 수도 있고 별도로 구분하여 <code v-pre>sentinel.hcl</code> 파일에 각각 작성하는 것도 가능합니다. 아래 예제는 테라폼 구성에 정의된 모든 <code v-pre>output</code> 에 대해 <code v-pre>sensitive = true</code> 를 강제화 하기 위한 정책 입니다.</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code>import <span class="token string">"tfconfig"</span>

check_outputs = func() <span class="token punctuation">{</span>
  for tfconfig.outputs as k<span class="token punctuation">,</span> v <span class="token punctuation">{</span>
    if v.sensitive == <span class="token boolean">false</span> <span class="token punctuation">{</span>
      return <span class="token boolean">false</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  return <span class="token boolean">true</span>
<span class="token punctuation">}</span>

main = rule <span class="token punctuation">{</span> check_outputs() <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="마치며" tabindex="-1"><a class="header-anchor" href="#마치며" aria-hidden="true">#</a> 마치며</h2>
<p>테라폼의 IaC에 추가로 팀 내의 정책을 코드화하는, Policy as Code 의 기능으로 Sentinel을 이용하면 기존에는 별도의 문서나 구두로 존재하던 조직내 정책을 자산화 할 수 있다는 점에서 프로비저닝 관련 도구를 통합할 수 있다는 것에 의미가 있습니다.</p>
<p>Cloud의 경우 관련 기능을 활성화하여 1달정도 무료로 사용해 볼 수 있습니다.</p>
</div></template>


