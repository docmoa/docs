<template><div><h1 id="_03-테라폼-실행" tabindex="-1"><a class="header-anchor" href="#_03-테라폼-실행" aria-hidden="true">#</a> 03. 테라폼 실행</h1>
<h2 id="리소스-분석" tabindex="-1"><a class="header-anchor" href="#리소스-분석" aria-hidden="true">#</a> 리소스 분석</h2>
<p>모든 Terraform으로 구성되는 리소스는 정확히 동일한 방식으로 구성됩니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>resource type <span class="token string">"name"</span> <span class="token punctuation">{</span>
  <span class="token property">parameter</span> <span class="token punctuation">=</span> <span class="token string">"foo"</span>
  <span class="token property">parameter2</span> <span class="token punctuation">=</span> <span class="token string">"bar"</span>
  <span class="token property">list</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"one"</span>, <span class="token string">"two"</span>, <span class="token string">"three"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>resource : 최상위 키워드</li>
<li>type : 리소스 타입. Example: <code v-pre>ncloud_vpc</code></li>
<li>name : 이 리소스를 참조하는 임의의 이름입니다. terraform에서 내부적으로 사용합니다. 이 필드는 변수가 될 수 없습니다.</li>
</ul>
<h2 id="terraform-provider-구성" tabindex="-1"><a class="header-anchor" href="#terraform-provider-구성" aria-hidden="true">#</a> Terraform Provider 구성</h2>
<p>Terraform Core는 무엇이든 빌드하려면 하나 이상의 Provider가 필요합니다.</p>
<p>사용하려는 Provider의 버전을 쑤동으로 구성 할 수 있습니다. 이 옵션을 비워두면 Terraform은 기본적으로 사용 가능한 최신 버전의 Provider를 사용합니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code><span class="token keyword">terraform</span> <span class="token punctuation">{</span>
  <span class="token keyword">required_providers</span> <span class="token punctuation">{</span>
    <span class="token property">ncloud</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"NaverCloudPlatform/ncloud"</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">">= 2.1.2"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">provider<span class="token type variable"> "ncloud" </span></span><span class="token punctuation">{</span> <span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="버전관리-연산자" tabindex="-1"><a class="header-anchor" href="#버전관리-연산자" aria-hidden="true">#</a> 버전관리 연산자</h2>
<ul>
<li>= (or no operator): 정확한 버전 동등성</li>
<li>!=: 버전이 같지 않음</li>
<li>&gt;, &gt;=, &lt;, &lt;=: 버전 비교</li>
<li>~&gt;: 약한 제약, 허용되는 가장 오래된 버전과 최신 버전을 모두 제한합니다.<br>
~&gt; 0.9 설정은 다음과 같습니다.  &gt;= 0.9, &lt; 1.0<br>
~&gt; 0.8.4 설정은 다음과 같습니다. &gt;= 0.8.4, &lt; 0.9</li>
</ul>
<h2 id="terraform-apply" tabindex="-1"><a class="header-anchor" href="#terraform-apply" aria-hidden="true">#</a> Terraform Apply</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code>$ terraform apply
<span class="token punctuation">..</span>.
Terraform will perform the following actions:

  <span class="token comment"># ncloud_vpc.hashicat will be created</span>
  + resource <span class="token string">"ncloud_vpc"</span> <span class="token string">"hashicat"</span> <span class="token punctuation">{</span>
      + default_access_control_group_no <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      <span class="token punctuation">..</span>.
      + ipv4_cidr_block                 <span class="token operator">=</span> <span class="token string">"10.0.0.0/16"</span>
      + vpc_no                          <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

Plan: <span class="token number">1</span> to add, <span class="token number">0</span> to change, <span class="token number">0</span> to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only <span class="token string">'yes'</span> will be accepted to approve.

  Enter a value:
</code></pre><div class="highlight-lines"><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>terraform apply</code>는 우선 <code v-pre>plan</code>을 실행하고, 승인하면 변경 사항을 적용합니다.</p>
<h2 id="terraform-destroy" tabindex="-1"><a class="header-anchor" href="#terraform-destroy" aria-hidden="true">#</a> Terraform Destroy</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code>$ terraform apply
<span class="token punctuation">..</span>.
Terraform will perform the following actions:

  <span class="token comment"># ncloud_vpc.hashicat will be destoryed</span>
  - resource <span class="token string">"ncloud_vpc"</span> <span class="token string">"hashicat"</span> <span class="token punctuation">{</span>
      <span class="token punctuation">..</span>.
      - ipv4_cidr_block   <span class="token operator">=</span> <span class="token string">"10.0.0.0/16"</span> -<span class="token operator">></span> null
    <span class="token punctuation">}</span>

Plan: <span class="token number">0</span> to add, <span class="token number">0</span> to change, <span class="token number">1</span> to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only <span class="token string">'yes'</span> will be accepted to approve.

  Enter a value:
</code></pre><div class="highlight-lines"><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>terraform destroy</code>는 <code v-pre>action</code>과 반대 입니다. 승인하면 인프라가 제거됩니다.</p>
<h2 id="terraform-format" tabindex="-1"><a class="header-anchor" href="#terraform-format" aria-hidden="true">#</a> Terraform Format</h2>
<p>Terraform은 내장 된 코드 포맷터/클리너와 함께 제공됩니다. 모든 여백과 목록 들여 쓰기를 깔끔하고 깔끔하게 만들 수 있습니다. 아름다운 코드가 더 잘 동작하는 것(?) 같습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform <span class="token function">fmt</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code v-pre>*.tf</code> 파일이 포함 된 디렉토리에서 실행하기 만하면 코드가 정리됩니다.</p>
<h2 id="terraform-data-sources" tabindex="-1"><a class="header-anchor" href="#terraform-data-sources" aria-hidden="true">#</a> Terraform Data Sources</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">data <span class="token type variable">"ncloud_member_server_images"</span></span> <span class="token string">"prod"</span> <span class="token punctuation">{</span>
 <span class="token keyword">filter</span> <span class="token punctuation">{</span>
    <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"name"</span>
    <span class="token property">values</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>data.terraform_remote_state.image_name.outputs.image_name<span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"ncloud_server"</span></span> <span class="token string">"server"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>                      <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">server_name</span><span class="token punctuation">}</span></span><span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>random_id<span class="token punctuation">.</span>id<span class="token punctuation">.</span>hex<span class="token punctuation">}</span></span>"</span>
  <span class="token property">member_server_image_no</span>    <span class="token punctuation">=</span> data.ncloud_member_server_images.prod.member_server_images.<span class="token number">0</span>
  <span class="token property">server_product_code</span>       <span class="token punctuation">=</span> <span class="token string">"SPSVRGPUSSD00001"</span> 
  <span class="token property">login_key_name</span>            <span class="token punctuation">=</span> ncloud_login_key.key.key_name
  <span class="token property">zone</span>                      <span class="token punctuation">=</span> var.zone
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Data Source(data)는 Provider가 기존 리소스를 반환하도록 쿼리하는 방법입니다.</p>
<p>생성되어있는 리소스나 Provider로 조회할 수 있는 리소스 정보를 다른 리소스 구성에서 접근할 수 있습니다.</p>
<h2 id="terraform-dependency-mapping" tabindex="-1"><a class="header-anchor" href="#terraform-dependency-mapping" aria-hidden="true">#</a> Terraform Dependency Mapping</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code><span class="token keyword">data <span class="token type variable">"ncloud_member_server_images"</span></span> <span class="token string">"prod"</span> <span class="token punctuation">{</span>
 <span class="token keyword">filter</span> <span class="token punctuation">{</span>
    <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"name"</span>
    <span class="token property">values</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>data.terraform_remote_state.image_name.outputs.image_name<span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"ncloud_server"</span></span> <span class="token string">"server"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>                      <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">server_name</span><span class="token punctuation">}</span></span><span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>random_id<span class="token punctuation">.</span>id<span class="token punctuation">.</span>hex<span class="token punctuation">}</span></span>"</span>
  <span class="token property">member_server_image_no</span>    <span class="token punctuation">=</span> data.ncloud_member_server_images.prod.member_server_images.<span class="token number">0</span>
  <span class="token property">server_product_code</span>       <span class="token punctuation">=</span> <span class="token string">"SPSVRGPUSSD00001"</span> 
  <span class="token property">login_key_name</span>            <span class="token punctuation">=</span> ncloud_login_key.key.key_name
  <span class="token property">zone</span>                      <span class="token punctuation">=</span> var.zone
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Terraform은 자동으로 종속성을 추적 할 수 있습니다. 앞서 설명된 리소스를 살펴보십시오. ncloud_server 리소스에서 강조 표시된 줄을 확인합니다. 이것이 테라 폼에서 한 리소스가 다른 리소스를 참조하도록하는 방법입니다.</p>
<h2 id="terraform-코드-구성" tabindex="-1"><a class="header-anchor" href="#terraform-코드-구성" aria-hidden="true">#</a> Terraform 코드 구성</h2>
<p>Terraform은 Workspace에서 <code v-pre>.tf</code> 확장자로 끝나는 모든 파일을 읽지만 대표적으로는 <code v-pre>main.tf</code>, <code v-pre>variables.tf</code>, <code v-pre>outputs.tf</code>를 갖는 것입니다. 원하는 경우 더 많은 tf 파일을 추가 할 수 있습니다.</p>
<p>::: vue<br>
Workspace<br>
├── <code v-pre>main.tf</code><br>
├── <code v-pre>outputs.tf</code><br>
├── terraform.tfvars<br>
└── <code v-pre>variables.tf</code><br>
:::</p>
<p>이러한 각 파일을 자세히 살펴 보겠습니다.</p>
<h3 id="main-tf-파일" tabindex="-1"><a class="header-anchor" href="#main-tf-파일" aria-hidden="true">#</a> <code v-pre>main.tf</code> 파일</h3>
<p>첫 번째 파일은 <code v-pre>main.tf</code>입니다. 일반적으로 테라 폼 코드를 저장하는 곳입니다. 더 크고 복잡한 인프라를 사용하면이를 여러 파일로 나눌 수 있습니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">resource <span class="token type variable">"ncloud_vpc"</span></span> <span class="token string">"main"</span> <span class="token punctuation">{</span>
  <span class="token property">ipv4_cidr_block</span> <span class="token punctuation">=</span> var.address_space
  <span class="token property">name</span>            <span class="token punctuation">=</span> lower(<span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">prefix</span><span class="token punctuation">}</span></span>-vpc-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">region</span><span class="token punctuation">}</span></span>"</span>)
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"ncloud_subnet"</span></span> <span class="token string">"main"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>           <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">name_scn02</span><span class="token punctuation">}</span></span>-public"</span>
  <span class="token property">vpc_no</span>         <span class="token punctuation">=</span> ncloud_vpc.vpc_scn_02.id
  <span class="token property">subnet</span>         <span class="token punctuation">=</span> cidrsubnet(ncloud_vpc.main.ipv4_cidr_block, <span class="token number">8</span>, <span class="token number">0</span>)
  <span class="token property">zone</span>           <span class="token punctuation">=</span> <span class="token string">"KR-2"</span>
  <span class="token property">network_acl_no</span> <span class="token punctuation">=</span> ncloud_network_acl.network_acl_02_public.id
  <span class="token property">subnet_type</span>    <span class="token punctuation">=</span> <span class="token string">"PUBLIC"</span>
<span class="token punctuation">}</span>

...생략...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="variable-tf-파일" tabindex="-1"><a class="header-anchor" href="#variable-tf-파일" aria-hidden="true">#</a> <code v-pre>variable.tf</code> 파일</h3>
<p>두 번째 파일은 <code v-pre>variables.tf</code>입니다. 여기에서 변수를 정의하고 선택적으로 일부 기본값을 설정합니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "prefix" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"This prefix will be included in the name of most resources."</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "region" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"The region where the resources are created."</span>
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"KR"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="output-tf-파일" tabindex="-1"><a class="header-anchor" href="#output-tf-파일" aria-hidden="true">#</a> <code v-pre>output.tf</code> 파일</h3>
<p><code v-pre>output.tf</code> 파일은 테라 폼 적용이 끝날 때 표시 할 메시지 또는 데이터를 구성하는 곳입니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">output<span class="token type variable"> "acl_public_id" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> ncloud_network_acl.network_acl_public.id
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> "public_addr" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> <span class="token string">"http://<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>ncloud_public_ip<span class="token punctuation">.</span>main<span class="token punctuation">.</span>public_ip<span class="token punctuation">}</span></span>:8080"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="terraform-dependency-graph" tabindex="-1"><a class="header-anchor" href="#terraform-dependency-graph" aria-hidden="true">#</a> Terraform Dependency Graph</h2>
<figure><img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/blast_radius_graph_1.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>terraform 리소스 그래프는 리소스 간의 종속성을 시각적으로 보여줍니다.</p>
<p><code v-pre>Region</code> 및 <code v-pre>Prefix</code> 변수는 리소스 그룹을 만드는 데 필요하며 이는 가상 네트워크를 구축하는 데 필요합니다.</p>
<hr>
<p>실습을 위해 다음장으로 이동하세요.</p>
<p><RouterLink to="/03-Public%20Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/03-z-lab_terraform_action.html">💻 Lab - Terraform in Action</RouterLink></p>
</div></template>


