<template><div><h1 id="remote-state" tabindex="-1"><a class="header-anchor" href="#remote-state" aria-hidden="true">#</a> Remote State</h1>
<p>Terraform을 수행하고나면 실행되고난 뒤의 상태가 저장됩니다. 로컬에서 OSS로 실행 했을 때의 <code v-pre>terraform.tfstate</code> 파일이 그것 입니다. 서로 다른 팀이 각자의 워크스페이스에서 작업하고 난뒤 각 상태 공유하면 변경된 내역에 따라 다음 작업을 이어갈 수 있습니다. Terraform은  Terraform Cloud, HashiCorp Consul, Amazon S3, Alibaba Cloud OSS 등에 상태 저장을 지원합니다.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/4b7IZAXzha8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>Remote State, 즉 원격으로 워크스페이스의 상태 정보를 읽을 수 있다는 의미는 각 팀이 갖는 워크스페이스의 결과를 다른 팀에 노출시켜 새로 프로비저닝 된 정보를 바탕으로 다른 작업을 수행할 수 있도록 합니다. 해당 기능은 오픈소스 환경에서는 지원되지 않습니다.</p>
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
<p>워크프페이스의 상태를 공유하는 워크플로우의 예를 들면 다음과 같습니다.</p>
<ul>
<li>네트워크 워크스페이스 : AWS에 배포되는 VPC, 서브넷, NAT 등의 네트워크 작업 워크스페이스를 실행</li>
<li>VM 배포 워크스페이스 : 네트워크 작업이 완료된 상태 값을 기반으로 EC2 인스턴스를 프로비저닝</li>
</ul>
<p>읽어야할 상태를 생성하는 도중에 이를 참조하는 다른 워크스페이스가 실행된다면? 이 경우 참조할 대상의 State는 잠긴 상태가 되기 때문에 해당 작업이 완료될 때까지 이를 바라보는 워크스페이스는 대기하게 됩니다.</p>
<p>워크스페이스가 인프라별, 혹은 프로비저닝 대상으로 인해 세분화 되는 경우에도 각 상태의 변화를 다른 워크스페이스에서 원격으로 불러옴으로서 종속적인 변경사항을 적용한 포스트 프로비저닝 프로세스가 가능하도록 하는 기능입니다.</p>
<h2 id="terraform-remote-state-datasource" tabindex="-1"><a class="header-anchor" href="#terraform-remote-state-datasource" aria-hidden="true">#</a> <code v-pre>terraform_remote_state</code> datasource</h2>
<p>공식 가이드에 따르면 Remote State는 <code v-pre>terraform_remote_state</code> 데이터소스를 통해 상태 값을 가져오게 됩니다. <a href="https://www.terraform.io/docs/providers/terraform/d/remote_state.html" target="_blank" rel="noopener noreferrer">Remote State 가이드 보기<ExternalLinkIcon/></a></p>
<p>설정에 대한 예시와 항목에 대한 설명은 다음과 같습니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">data <span class="token type variable">"terraform_remote_state"</span></span> <span class="token string">"vpc"</span> <span class="token punctuation">{</span>
  <span class="token property">backend</span> <span class="token punctuation">=</span> <span class="token string">"remote"</span>

  <span class="token property">config</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">organization</span> <span class="token punctuation">=</span> <span class="token string">"hashicorp"</span>
    <span class="token property">workspaces</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"vpc-prod"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment"># Terraform >= 0.12</span>
<span class="token keyword">resource <span class="token type variable">"aws_instance"</span></span> <span class="token string">"foo"</span> <span class="token punctuation">{</span>
  <span class="token comment"># ...</span>
  <span class="token property">subnet_id</span> <span class="token punctuation">=</span> data.terraform_remote_state.vpc.outputs.subnet_id
<span class="token punctuation">}</span>

<span class="token comment"># Terraform &lt;= 0.11</span>
<span class="token keyword">resource <span class="token type variable">"aws_instance"</span></span> <span class="token string">"foo"</span> <span class="token punctuation">{</span>
  <span class="token comment"># ...</span>
  <span class="token property">subnet_id</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">data</span><span class="token punctuation">.</span><span class="token type variable">terraform_remote_state</span><span class="token punctuation">.</span>vpc<span class="token punctuation">.</span>subnet_id<span class="token punctuation">}</span></span>"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>data의 항목은 <code v-pre>terraform_remote_state</code> 로 정의합니다. 뒤에 id 값을 임의로 넣어줍니다.</p>
<ul>
<li>backend : 백엔드를 리모트로 사용할지의 여부입니다. (필수)</li>
<li>config : backend로 정의할 값을 선언합니다. (옵션)<br>
<a href="https://www.terraform.io/docs/backends/types/remote.html" target="_blank" rel="noopener noreferrer">https://www.terraform.io/docs/backends/types/remote.html<ExternalLinkIcon/></a>
<ul>
<li>organization : Remote State 대상 워크스페이스가 존재하는 org.</li>
<li>workspaces : Remote State 대상 워크스프에스 정의
<ul>
<li>name : 워크스페이스 이름</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>
<p>값 읽어오기는 예제에서처럼 0.12버전 이상과  0.11버전 이하로 나뉘어 호출가능하며 0.11버전 이하의 경우 <code v-pre>output</code>의 데이터만 활용 가능합니다. 0.12버전 이상으로 다음의 상태값을 갖는 데이터를 예로 설명해보겠습니다.</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token string">"backend"</span> = <span class="token string">"remote"</span>
  <span class="token string">"config"</span> = <span class="token punctuation">{</span>
    <span class="token string">"organization"</span> = <span class="token string">"great-stone"</span>
    <span class="token string">"workspaces"</span> = <span class="token punctuation">{</span>
      <span class="token string">"name"</span> = <span class="token string">"terraform-examples-sensitive"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token string">"outputs"</span> = <span class="token punctuation">{</span>
    <span class="token string">"random_server_id"</span> = <span class="token string">"definite-mudfish"</span>
    <span class="token string">"sense"</span> = <span class="token string">"123456"</span>
  <span class="token punctuation">}</span>
  <span class="token string">"workspace"</span> = <span class="token string">"default"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>상태 데이터는 Json 형태로 출력되며 마치 javascript에서 데이터를 불러오듯 활용하면 됩니다.</p>
<p>예를들어 <code v-pre>config</code>의 워크스페이스 이름을 불러오고자 한다면</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>data<span class="token punctuation">.</span>terraform_remote_state<span class="token punctuation">.</span><span class="token operator">&lt;</span>id<span class="token operator">></span><span class="token punctuation">.</span>config<span class="token punctuation">.</span>workspaces<span class="token punctuation">.</span>name
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code v-pre>outputs</code>의 <code v-pre>random_server_id</code> 값을 가져오고자 하면</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>data<span class="token punctuation">.</span>terraform_remote_state<span class="token punctuation">.</span><span class="token operator">&lt;</span>id<span class="token operator">></span><span class="token punctuation">.</span>outputs<span class="token punctuation">.</span>random_server_id
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>위와 같이 데이터 구조를 확인하여 가져올 수 있습니다.</p>
</li>
</ul>
<h2 id="마치며" tabindex="-1"><a class="header-anchor" href="#마치며" aria-hidden="true">#</a> 마치며</h2>
<p>Remote State는 타 워크스페이스에서 동작한 상태 값을 기반으로 관련 데이터에 종속성이 있는 작업을 수행하기에 필요한 데이터를 제공받을 수 있는 기능입니다. 워크플로우를 정의할 때 각 팀간, 혹은 각 프로비저닝을 담당하는 주체가 서로 약속한 데이터를 주고 받을 수 있도록 코드로 정의할 수 있는 IaC의 협업 기능으로 활용 가능합니다.</p>
</div></template>


