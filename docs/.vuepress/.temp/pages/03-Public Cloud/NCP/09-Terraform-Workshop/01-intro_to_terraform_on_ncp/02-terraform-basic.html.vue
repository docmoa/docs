<template><div><h1 id="_02-테라폼-기본" tabindex="-1"><a class="header-anchor" href="#_02-테라폼-기본" aria-hidden="true">#</a> 02. 테라폼 기본</h1>
<h2 id="terraform-이란" tabindex="-1"><a class="header-anchor" href="#terraform-이란" aria-hidden="true">#</a> Terraform 이란?</h2>
<figure><img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/Terraform_Logo.png" alt="logo" tabindex="0" loading="lazy"><figcaption>logo</figcaption></figure>
<ul>
<li>
<p>Terraform은 오픈 소스 프로비저닝 도구입니다.</p>
<ul>
<li>Terraform Github : <a href="https://github.com/hashicorp/terraform" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/terraform<ExternalLinkIcon/></a></li>
</ul>
</li>
<li>
<p>Go로 작성된 단일 바이너리로 제공됩니다. Terraform은 크로스 플랫폼이며 Linux, Windows 또는 MacOS에서 실행할 수 있습니다.</p>
</li>
<li>
<p>terraform 설치는 쉽습니다. zip 파일을 다운로드하고 압축을 풀고 실행하기 만하면됩니다.</p>
<ul>
<li>다운로드 : <a href="https://www.terraform.io/downloads.html" target="_blank" rel="noopener noreferrer">https://www.terraform.io/downloads.html<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<h2 id="terraform-command-line" tabindex="-1"><a class="header-anchor" href="#terraform-command-line" aria-hidden="true">#</a> Terraform Command Line</h2>
<ul>
<li>
<p>기본적으로 Terraform 오픈소스는 커맨드라인 도구입니다.</p>
</li>
<li>
<p>Terraform 명령은 수동으로 입력하거나 스크립트에서 자동으로 실행됩니다.</p>
</li>
<li>
<p>명령은 Linux, Windows 또는 MacOS에 상관없이 동일합니다.</p>
</li>
<li>
<p>Terraform에는 다른 작업을 수행하는 하위 명령들이 있습니다.</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Basic Terraform Commands</span>
terraform version
terraform <span class="token builtin class-name">help</span>
terraform init
terraform plan
terraform apply
terraform destroy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="terraform-help" tabindex="-1"><a class="header-anchor" href="#terraform-help" aria-hidden="true">#</a> Terraform Help</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code>$ terraform <span class="token builtin class-name">help</span>
Usage: terraform <span class="token punctuation">[</span>-version<span class="token punctuation">]</span> <span class="token punctuation">[</span>-help<span class="token punctuation">]</span> <span class="token operator">&lt;</span>command<span class="token operator">></span> <span class="token punctuation">[</span>args<span class="token punctuation">]</span>
<span class="token punctuation">..</span>.
Common commands:
    apply              Builds or changes infrastructure
    console            Interactive console <span class="token keyword">for</span> Terraform interpolations
    destroy            Destroy Terraform-managed infrastructure
    <span class="token function">env</span>                Workspace management
    <span class="token function">fmt</span>                Rewrites config files to canonical <span class="token function">format</span>
    graph              Create a visual graph of Terraform resources
</code></pre><div class="highlight-lines"><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>특정 하위 명령에 대한 도움말을 보려면 <code v-pre>terraform &lt;subcommand&gt; help</code> 를 입력합니다.</p>
<h2 id="terraform-code" tabindex="-1"><a class="header-anchor" href="#terraform-code" aria-hidden="true">#</a> Terraform Code</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">resource <span class="token type variable">"ncloud_vpc"</span></span> <span class="token string">"vpc"</span> <span class="token punctuation">{</span>
    <span class="token property">ipv4_cidr_block</span> <span class="token punctuation">=</span> <span class="token string">"10.0.0.0/16"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Terraform 코드는 <a href="https://github.com/hashicorp/hcl" target="_blank" rel="noopener noreferrer">HCL2 툴킷<ExternalLinkIcon/></a>을 기반으로합니다. HCL은 HashiCorp Configuration Language를 나타냅니다.</p>
<p>Terraform 코드는 모든 클라우드 또는 플랫폼에서 인프라를 프로비저닝하기 위해 특별히 설계된 선언적 언어입니다.</p>
<h2 id="terraform-comments" tabindex="-1"><a class="header-anchor" href="#terraform-comments" aria-hidden="true">#</a> Terraform Comments</h2>
<p>줄 주석은 <code v-pre>*</code>(octothorpe, 별표) 또는 <code v-pre>#</code>(파운드) 기호로 시작합니다....<mark>샵! #</mark></p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># This is a line comment.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>블록 주석은 <code v-pre>/*</code>와 <code v-pre>*/</code> 기호 사이에 포함됩니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment">/* This is a block comment.
Block comments can span multiple lines.
The comment ends with this symbol: */</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="terraform-workspaces" tabindex="-1"><a class="header-anchor" href="#terraform-workspaces" aria-hidden="true">#</a> Terraform Workspaces</h2>
<p>Workspace는 Terraform 코드가 포함 된 폴더 또는 디렉토리입니다.</p>
<p>Terraform 파일은 항상* .tf 또는* .tfvars 확장자로 끝납니다. 실행 시 해당 파일들은 하나로 동작합니다.</p>
<p>대부분의 Terraform Workspaces에는 일반적으로 아래 3개정도의 파일을 둡니다. (정해진건 아닙니다.)</p>
<ul>
<li><a href="http://main.tf" target="_blank" rel="noopener noreferrer">main.tf<ExternalLinkIcon/></a> - 대부분의 기능 코드는 여기에 있습니다.</li>
<li><a href="http://variables.tf" target="_blank" rel="noopener noreferrer">variables.tf<ExternalLinkIcon/></a> - 이 파일은 변수를 저장하기위한 것입니다.</li>
<li><a href="http://outputs.tf" target="_blank" rel="noopener noreferrer">outputs.tf<ExternalLinkIcon/></a> - 테라 폼 실행 후 표시되는 내용을 정의합니다.</li>
</ul>
<h2 id="terraform-init" tabindex="-1"><a class="header-anchor" href="#terraform-init" aria-hidden="true">#</a> Terraform Init</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code>$ terraform init
Initializing the backend...

Initializing provider plugins...
- Finding navercloudplatform/ncloud versions matching <span class="token string">">= 2.1.2"</span>...
- Installing navercloudplatform/ncloud v2.<span class="token number">1.2</span>...
- Installed navercloudplatform/ncloud v2.<span class="token number">1.2</span> (signed by a HashiCorp partner, key ID <span class="token number">9</span>DCE24305722E9C9)
...
Terraform has been successfully initialized!
</code></pre><div class="highlight-lines"><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Terraform은 필요한 Provider(공급자)와 Module(모듈)을 가져와 <code v-pre>.terraform</code> 디렉터리에 저장합니다. 모듈 또는 공급자를 추가, 변경 또는 업데이트하는 경우 init를 다시 실행해야합니다.</p>
<h2 id="terraform-plan" tabindex="-1"><a class="header-anchor" href="#terraform-plan" aria-hidden="true">#</a> Terraform Plan</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code>$ terraform plan
<span class="token punctuation">..</span>.
Terraform will perform the following actions:

  <span class="token comment"># ncloud_vpc.vpc will be created</span>
  + resource <span class="token string">"ncloud_vpc"</span> <span class="token string">"vpc"</span> <span class="token punctuation">{</span>
      + default_access_control_group_no <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + default_network_acl_no          <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + default_private_route_table_no  <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + default_public_route_table_no   <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + <span class="token function">id</span>                              <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + ipv4_cidr_block                 <span class="token operator">=</span> <span class="token string">"10.0.0.0/16"</span>
      + name                            <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + vpc_no                          <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
    <span class="token punctuation">}</span>

Plan: <span class="token number">1</span> to add, <span class="token number">0</span> to change, <span class="token number">0</span> to destroy.
</code></pre><div class="highlight-lines"><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>변경 사항을 적용하기 전에 <code v-pre>terraform plan</code> 으로 미리 구성의 변경을 살펴봅니다.</p>
<h2 id="변수는-어디에" tabindex="-1"><a class="header-anchor" href="#변수는-어디에" aria-hidden="true">#</a> 변수는 어디에?</h2>
<p>Terraform 변수는 <code v-pre>variables.tf</code>라는 파일에 일반적으로 위치 시킵니다.(이름은 변경 가능) 변수는 기본 설정을 가질 수 있습니다. 기본값을 생략하면 사용자에게 값을 입력하라는 메시지가 표시됩니다. 여기서 우리는 사용하려는 변수를 <mark>선언</mark> 합니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "prefix" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"This prefix will be included in the name of most resources."</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "vpc_cidr" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"A cidr option for instances into the VPC."</span>
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"10.0.0.0/16"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="변수에-값을-할당하는-방식과-우선순위" tabindex="-1"><a class="header-anchor" href="#변수에-값을-할당하는-방식과-우선순위" aria-hidden="true">#</a> 변수에 값을 할당하는 방식과 우선순위</h2>
<p>일부 변수를 정의한 후에는 다른 방법으로 설정하고 재정의 할 수 있습니다. 다음은 각 방법의 우선 순위입니다.</p>
<p>이 목록은 가장 높은 우선 순위 (1)에서 가장 낮은 순위 (5)로 나타냅니다.</p>
<p>즉, CLI 실행시 <code v-pre>-var</code> 로 지정되는 <code v-pre>Command line flag</code>가 가장 우선합니다.</p>
<ol>
<li>Command line flag - 명령 줄 스위치로 실행</li>
<li>Configuration file - terraform.tfvars 파일에 설정</li>
<li>Environment variable - 쉘 환경의 일부</li>
<li>Default Config - variables.tf의 기본값</li>
<li>User manual entry - 지정되지 않은 경우 사용자에게 입력을 요청합니다.</li>
</ol>
<hr>
<p>실습을 위해 다음장으로 이동하세요.</p>
<p><RouterLink to="/03-Public%20Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/02-z-lab_terraform_basic.html">💻 Lab - Setup and Basic Usage</RouterLink></p>
</div></template>


