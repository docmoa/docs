<template><div><h1 id="_05-테라폼-상태파일-state" tabindex="-1"><a class="header-anchor" href="#_05-테라폼-상태파일-state" aria-hidden="true">#</a> 05. 테라폼 상태파일(State)</h1>
<h2 id="terraform-state" tabindex="-1"><a class="header-anchor" href="#terraform-state" aria-hidden="true">#</a> Terraform State</h2>
<p>Terraform은 <sub>stateful</sub> 애플리케이션입니다. 즉, state file 내부에서 빌드 한 모든 내용을 추적합니다.</p>
<p>앞서의 실습에서 반복된 <code v-pre>Apply</code> 작업 간에 Workspace 디렉토리에 나타난 <code v-pre>terraform.tfstate</code> 및 <code v-pre>terraform.tfstate.backup</code> 파일을 보셨을 것입니다.</p>
<p>상태 파일은 Terraform이 알고있는 모든 것에 대한 기록 소스입니다.</p>
<p>::: vue<br>
WORKSPACE<br>
├── files<br>
│   └── deploy_app.sh<br>
├── <a href="http://main.tf" target="_blank" rel="noopener noreferrer">main.tf<ExternalLinkIcon/></a><br>
├── <a href="http://outputs.tf" target="_blank" rel="noopener noreferrer">outputs.tf<ExternalLinkIcon/></a><br>
├── <code v-pre>terraform.tfstate</code><br>
├── <code v-pre>terraform.tfstate.backup</code><br>
├── terraform.tfvars<br>
└── <a href="http://variables.tf" target="_blank" rel="noopener noreferrer">variables.tf<ExternalLinkIcon/></a><br>
:::</p>
<p>State 파일 내부는 JSON 형식으로 구성되어있습니다.</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
  <span class="token property">"terraform_version"</span><span class="token operator">:</span> <span class="token string">"0.12.7"</span><span class="token punctuation">,</span>
  <span class="token property">"serial"</span><span class="token operator">:</span> <span class="token number">14</span><span class="token punctuation">,</span>
  <span class="token property">"lineage"</span><span class="token operator">:</span> <span class="token string">"452b4191-89f6-db17-a3b1-4470dcb00607"</span><span class="token punctuation">,</span>
  <span class="token property">"outputs"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"catapp_url"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"value"</span><span class="token operator">:</span> <span class="token string">"http://go-hashicat-5c0265179ccda553.workshop.aws.hashidemos.io"</span><span class="token punctuation">,</span>
      <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="terraform-refresh" tabindex="-1"><a class="header-anchor" href="#terraform-refresh" aria-hidden="true">#</a> Terraform Refresh</h2>
<p>때때로 인프라는 Terraform이 통제하는 범위 밖에서 변경 될 수 있습니다. (수동으로 UI에서 변경 등)</p>
<p>State 파일은 인프라의 마지막으로 갱신된 상태를 나타냅니다. 상태 파일이 빌드 한 파일과 여전히 일치하는지 확인하고 확인하려면 <code v-pre>terraform refresh</code> 명령을 사용할 수 있습니다.</p>
<p>이것은 인프라를 업데이트하지 않는 상태 파일 만 업데이트합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform refresh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="기존-인프라-변경" tabindex="-1"><a class="header-anchor" href="#기존-인프라-변경" aria-hidden="true">#</a> 기존 인프라 변경</h2>
<p>계획을 실행하거나 적용 할 때마다 Terraform은 세 가지 데이터 소스를 조정합니다.</p>
<ol>
<li>코드에 작성한 내용</li>
<li>상태 파일</li>
<li>실제로 존재하는 것</li>
</ol>
<p>Terraform은 <code v-pre>*.tf</code> 파일에있는 내용을 기반으로 기존 리소스를 추가, 삭제, 변경 또는 교체하기 위해 <mark>최선</mark> 을 다합니다. 다음은 Plan/Apply 중에 각 리소스에 발생할 수있는 네 가지 사항입니다.</p>
<div class="language-diff line-numbers-mode" data-ext="diff"><pre v-pre class="language-diff"><code><span class="token inserted-sign inserted"><span class="token prefix inserted">+</span><span class="token line">   create
</span></span><span class="token deleted-sign deleted"><span class="token prefix deleted">-</span><span class="token line">   destroy
</span><span class="token prefix deleted">-</span><span class="token line">/+ replace
</span></span>~   update in-place
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">경고</p>
<p>무엇인가 변경할때 <code v-pre>-/+ replace</code>가 발생하는지 확인하세요. 이것은 기존 리소스를 삭제하고 다시 생성합니다.</p>
</div>
<h2 id="terraform-state-quiz" tabindex="-1"><a class="header-anchor" href="#terraform-state-quiz" aria-hidden="true">#</a> 😱 Terraform State Quiz :</h2>
<p>각 시나리오에서 어떤 일이 발생합니까? 논의해 볼까요?</p>
<table>
<thead>
<tr>
<th style="text-align:center">Configuration(.tf)</th>
<th style="text-align:center">State</th>
<th style="text-align:center">Reality</th>
<th style="text-align:center">Operation</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center"></td>
<td style="text-align:center"></td>
<td style="text-align:center">???</td>
</tr>
<tr>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center"></td>
<td style="text-align:center">???</td>
</tr>
<tr>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">???</td>
</tr>
<tr>
<td style="text-align:center"></td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">???</td>
</tr>
<tr>
<td style="text-align:center"></td>
<td style="text-align:center"></td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">???</td>
</tr>
<tr>
<td style="text-align:center"></td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center"></td>
<td style="text-align:center">???</td>
</tr>
</tbody>
</table>
<details class="hint-container details"><summary>답</summary>
<table>
<thead>
<tr>
<th style="text-align:center">Configuration(.tf)</th>
<th style="text-align:center">State</th>
<th style="text-align:center">Reality</th>
<th style="text-align:center">Operation</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center"></td>
<td style="text-align:center"></td>
<td style="text-align:center">create</td>
</tr>
<tr>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center"></td>
<td style="text-align:center">create</td>
</tr>
<tr>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">-</td>
</tr>
<tr>
<td style="text-align:center"></td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">delete</td>
</tr>
<tr>
<td style="text-align:center"></td>
<td style="text-align:center"></td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center">-</td>
</tr>
<tr>
<td style="text-align:center"></td>
<td style="text-align:center">ncloud_server</td>
<td style="text-align:center"></td>
<td style="text-align:center">update state</td>
</tr>
</tbody>
</table>
</details>
</div></template>


