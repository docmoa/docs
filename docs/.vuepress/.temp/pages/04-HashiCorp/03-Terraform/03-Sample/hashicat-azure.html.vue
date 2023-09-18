<template><div><h1 id="intro-to-terraform-on-azure" tabindex="-1"><a class="header-anchor" href="#intro-to-terraform-on-azure" aria-hidden="true">#</a> Intro to Terraform on Azure</h1>
<blockquote>
<p>본 글은 HashiCorp의 공식 워크샵인 &quot;Intro to Terraform on Azure&quot; 내용을 발췌하여 작성한 글입니다. <a href="https://hashicorp.github.io/field-workshops-terraform/slides/azure/terraform-oss/#1" target="_blank" rel="noopener noreferrer">참고<ExternalLinkIcon/></a></p>
<p>실습 원본 소스코드는 <a href="https://github.com/hashicorp/hashicat-azure" target="_blank" rel="noopener noreferrer">hashicat-azure 저장소<ExternalLinkIcon/></a>에서 확인할 수 있습니다.</p>
</blockquote>
<figure><img src="https://media.licdn.com/dms/image/C5612AQGhxYMwcjsNSQ/article-cover_image-shrink_600_2000/0/1643170479486?e=2147483647&amp;v=beta&amp;t=yHuifr0mLn3lU1D41ZJ_HvhJ6uDqcfkbxp2GjyRcdYo" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h2 id="azure-자격증명-설정" tabindex="-1"><a class="header-anchor" href="#azure-자격증명-설정" aria-hidden="true">#</a> Azure 자격증명 설정</h2>
<blockquote>
<p>자격증명 설정을 위한 상세 설명은 생략합니다.</p>
</blockquote>
<p>Terraform에서는 해당 CSP에서 리소스를 배포하기 위해 자격증명이 필요합니다. 자신의 Azure 구독정보를 연동하기 위해 credentials를 설정합니다.</p>
<ul>
<li>ARM_SUBSCRIPTION_ID</li>
<li>ARM_CLIENT_ID</li>
<li>ARM_CLIENT_SECRET</li>
<li>ARM_TENANT_ID</li>
<li>ARM_ENVIRONMENT (옵션)</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">env</span> <span class="token operator">|</span> <span class="token function">grep</span> ARM
<span class="token assign-left variable">ARM_CLIENT_ID</span><span class="token operator">=</span>xxx
<span class="token assign-left variable">ARM_CLIENT_SECRET</span><span class="token operator">=</span>xxx
<span class="token assign-left variable">ARM_SUBSCRIPTION_ID</span><span class="token operator">=</span>xxx
<span class="token assign-left variable">ARM_TENANT_ID</span><span class="token operator">=</span>xxx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="실습-시나리오1-azurerm-resource-group-생성" tabindex="-1"><a class="header-anchor" href="#실습-시나리오1-azurerm-resource-group-생성" aria-hidden="true">#</a> 실습) 시나리오1. azurerm_resource_group 생성</h2>
<p>Azure에서는 기본적으로 리소스를 관리하기 위해 리소스 그룹을 생성해야 합니다. 이번 사니리오에서는 리소스 그룹을 생성해보겠습니다.</p>
<h3 id="hcl-구성파일" tabindex="-1"><a class="header-anchor" href="#hcl-구성파일" aria-hidden="true">#</a> HCL 구성파일</h3>
<ul>
<li><a href="http://main.tf" target="_blank" rel="noopener noreferrer">main.tf<ExternalLinkIcon/></a></li>
</ul>
<p>가장 기본이 되는 <code v-pre>main.tf</code> 코드의 구조는 다음과 같습니다.</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>terraform <span class="token punctuation">{</span>
  required_providers <span class="token punctuation">{</span>
    azurerm <span class="token operator">=</span> <span class="token punctuation">{</span>
      source  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"hashicorp/azurerm"</span></span>
      version <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"=2.60.0"</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

provider <span class="token string-literal"><span class="token string">"azurerm"</span></span> <span class="token punctuation">{</span>
  features <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"azurerm_resource_group"</span></span> <span class="token string-literal"><span class="token string">"myresourcegroup"</span></span> <span class="token punctuation">{</span>
  name     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-workshop"</span></span>
  location <span class="token operator">=</span> var<span class="token punctuation">.</span>location
  
  tags <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><a href="http://variables.tf" target="_blank" rel="noopener noreferrer">variables.tf<ExternalLinkIcon/></a></li>
</ul>
<p>해당 샘플코드에서는 <code v-pre>prefix</code> 라는 변수만 필요하므로 다음과 같이 선언합니다.</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>variable <span class="token string-literal"><span class="token string">"prefix"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"This prefix will be included in the name of most resources."</span></span>
  default <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"unknown"</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>terraform.tfvars</li>
</ul>
<p>앞서 <code v-pre>variables.tf</code> 에서 <code v-pre>default = &quot;unknown&quot;</code> 으로 선언하였습니다. 이때, 사용자화된 값으로 대체하기 위해서 변수의 우선순위를 활용하여 덮어쓸 수 있습니다.</p>
<p>필자는 <code v-pre>terraform.tfvars</code> 파일을 사용하여 덮어쓰는 방식을 사용해보겠습니다.</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token comment"># prefix에 자신의 이름을 작성하세요</span>
prefix <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"hyungwook"</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="테라폼-초기화-init" tabindex="-1"><a class="header-anchor" href="#테라폼-초기화-init" aria-hidden="true">#</a> 테라폼 초기화(init)</h3>
<ul>
<li><code v-pre>terraform init</code> 명령을 통해 azurerm 프로바이더를 사용하기 위해 초기화를 진행합니다.</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>초기화 명령 이후에 azurerm 에서 사용할 데이터가 <code v-pre>.terraform</code> 디렉토리 하위에 생성되었는지 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">ls</span> .terraform/providers/registry.terraform.io/hashicorp
azurerm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="테라폼-계획-배포-plan-apply" tabindex="-1"><a class="header-anchor" href="#테라폼-계획-배포-plan-apply" aria-hidden="true">#</a> 테라폼 계획 &amp; 배포(plan &amp; apply)</h3>
<ul>
<li><code v-pre>terraform plan</code> 명령을 통해 배포되기 전 계획을 확인합니다. 해당 실습에서는 최초 배포이므로 한 개의 리소스가 create 됩니다.</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform plan

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  <span class="token comment"># azurerm_resource_group.myresourcegroup will be created</span>
  + resource <span class="token string">"azurerm_resource_group"</span> <span class="token string">"myresourcegroup"</span> <span class="token punctuation">{</span>
      + <span class="token function">id</span>       <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + location <span class="token operator">=</span> <span class="token string">"koreacentral"</span>
      + name     <span class="token operator">=</span> <span class="token string">"hyungwook-workshop"</span>
    <span class="token punctuation">}</span>

Plan: <span class="token number">1</span> to add, <span class="token number">0</span> to change, <span class="token number">0</span> to destroy.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>terraform apply</code> 명령을 통해 실제 리소스를 배포합니다.</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform apply

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  <span class="token comment"># azurerm_resource_group.myresourcegroup will be created</span>
  + resource <span class="token string">"azurerm_resource_group"</span> <span class="token string">"myresourcegroup"</span> <span class="token punctuation">{</span>
      + <span class="token function">id</span>       <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + location <span class="token operator">=</span> <span class="token string">"koreacentral"</span>
      + name     <span class="token operator">=</span> <span class="token string">"hyungwook-workshop"</span>
    <span class="token punctuation">}</span>

Plan: <span class="token number">1</span> to add, <span class="token number">0</span> to change, <span class="token number">0</span> to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only <span class="token string">'yes'</span> will be accepted to approve.

  Enter a value: <span class="token function">yes</span>

azurerm_resource_group.myresourcegroup: Creating<span class="token punctuation">..</span>.
azurerm_resource_group.myresourcegroup: Creation complete after 5s <span class="token punctuation">[</span>id<span class="token operator">=</span>/subscriptions/0222cb06-f803-4f66-a922-a0957813a90c/resourceGroups/hyungwook-workshop<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="실습-시나리오-2-vnet-생성" tabindex="-1"><a class="header-anchor" href="#실습-시나리오-2-vnet-생성" aria-hidden="true">#</a> 실습) 시나리오 2. vnet 생성</h2>
<p>시나리오 1에서 생성한 리소스 그룹에 vnet을 추가합니다.</p>
<h3 id="hcl-구성파일-1" tabindex="-1"><a class="header-anchor" href="#hcl-구성파일-1" aria-hidden="true">#</a> HCL 구성파일</h3>
<ul>
<li><a href="http://main.tf" target="_blank" rel="noopener noreferrer">main.tf<ExternalLinkIcon/></a></li>
</ul>
<p>앞서 사용했던 <code v-pre>main.tf</code> 파일에 다음과 같이 추가할 <code v-pre>azurerm_virtual_network</code> 절을 추가합니다.</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token comment"># 생략</span>
resource <span class="token string-literal"><span class="token string">"azurerm_virtual_network"</span></span> <span class="token string-literal"><span class="token string">"vnet"</span></span> <span class="token punctuation">{</span>
  name                <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-vnet"</span></span>
  location            <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>location
  address_space       <span class="token operator">=</span> <span class="token punctuation">[</span>var<span class="token punctuation">.</span>address_space<span class="token punctuation">]</span>
  resource_group_name <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>name
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><a href="http://variables.tf" target="_blank" rel="noopener noreferrer">variables.tf<ExternalLinkIcon/></a> 에서는 다음과 같은 두 가지 변수를 사용합니다.
<ul>
<li><code v-pre>prefix</code> : 리소스의 가장 앞에 선언할 변수명</li>
<li><code v-pre>address_space</code>  : 기본 CIDR 정의</li>
</ul>
</li>
</ul>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>variable <span class="token string-literal"><span class="token string">"prefix"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"This prefix will be included in the name of most resources."</span></span>
  default <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"unknown"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"address_space"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"The address space that is used by the virtual network. You can supply more than one address space. Changing this forces a new resource to be created."</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"10.0.0.0/16"</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="테라폼-계획-배포-plan-apply-1" tabindex="-1"><a class="header-anchor" href="#테라폼-계획-배포-plan-apply-1" aria-hidden="true">#</a> 테라폼 계획 &amp; 배포(plan &amp; apply)</h3>
<p><code v-pre>azurerm_virtual_network</code> 리소스가 추가로 생성되는 것을 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 생략</span>
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  <span class="token comment"># azurerm_virtual_network.vnet will be created</span>
  + resource <span class="token string">"azurerm_virtual_network"</span> <span class="token string">"vnet"</span> <span class="token punctuation">{</span>
      + address_space         <span class="token operator">=</span> <span class="token punctuation">[</span>
          + <span class="token string">"10.0.0.0/16"</span>,
        <span class="token punctuation">]</span>
      + guid                  <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + <span class="token function">id</span>                    <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + location              <span class="token operator">=</span> <span class="token string">"koreacentral"</span>
      + name                  <span class="token operator">=</span> <span class="token string">"hyungwook-vnet"</span>
      + resource_group_name   <span class="token operator">=</span> <span class="token string">"hyungwook-workshop"</span>
      + subnet                <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + vm_protection_enabled <span class="token operator">=</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="실습-시나리오-3-subnet-security-group-생성" tabindex="-1"><a class="header-anchor" href="#실습-시나리오-3-subnet-security-group-생성" aria-hidden="true">#</a> 실습) 시나리오 3. Subnet &amp; security group 생성</h2>
<p>이번 시나리오에서는 vnet 내부에 subnet과 security group을 추가로 생성해보겠습니다.</p>
<h3 id="hcl-구성파일-2" tabindex="-1"><a class="header-anchor" href="#hcl-구성파일-2" aria-hidden="true">#</a> HCL 구성파일</h3>
<ul>
<li><a href="http://main.tf" target="_blank" rel="noopener noreferrer">main.tf<ExternalLinkIcon/></a> 에서는 다음 두 가지 리소스를 추가로 생성하는 절을 추가합니다.
<ul>
<li><code v-pre>azurerm_subnet</code></li>
<li><code v-pre>azurerm_network_security_group</code></li>
</ul>
</li>
</ul>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token comment"># 생략</span>
resource <span class="token string-literal"><span class="token string">"azurerm_subnet"</span></span> <span class="token string-literal"><span class="token string">"subnet"</span></span> <span class="token punctuation">{</span>
  name                 <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-subnet"</span></span>
  virtual_network_name <span class="token operator">=</span> azurerm_virtual_network<span class="token punctuation">.</span>vnet<span class="token punctuation">.</span>name
  resource_group_name  <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>name
  address_prefixes     <span class="token operator">=</span> <span class="token punctuation">[</span>var<span class="token punctuation">.</span>subnet_prefix<span class="token punctuation">]</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"azurerm_network_security_group"</span></span> <span class="token string-literal"><span class="token string">"catapp-sg"</span></span> <span class="token punctuation">{</span>
  name                <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-sg"</span></span>
  location            <span class="token operator">=</span> var<span class="token punctuation">.</span>location
  resource_group_name <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>name

  security_rule <span class="token punctuation">{</span>
    name                       <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"HTTP"</span></span>
    priority                   <span class="token operator">=</span> <span class="token number">100</span>
    direction                  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Inbound"</span></span>
    access                     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Allow"</span></span>
    protocol                   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Tcp"</span></span>
    source_port_range          <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_port_range     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"80"</span></span>
    source_address_prefix      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_address_prefix <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
  <span class="token punctuation">}</span>

  security_rule <span class="token punctuation">{</span>
    name                       <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"HTTPS"</span></span>
    priority                   <span class="token operator">=</span> <span class="token number">102</span>
    direction                  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Inbound"</span></span>
    access                     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Allow"</span></span>
    protocol                   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Tcp"</span></span>
    source_port_range          <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_port_range     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"443"</span></span>
    source_address_prefix      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_address_prefix <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
  <span class="token punctuation">}</span>

  security_rule <span class="token punctuation">{</span>
    name                       <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"SSH"</span></span>
    priority                   <span class="token operator">=</span> <span class="token number">101</span>
    direction                  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Inbound"</span></span>
    access                     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Allow"</span></span>
    protocol                   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Tcp"</span></span>
    source_port_range          <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_port_range     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"22"</span></span>
    source_address_prefix      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_address_prefix <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><a href="http://variables.tf" target="_blank" rel="noopener noreferrer">variables.tf<ExternalLinkIcon/></a> 에서는 <code v-pre>subnet_prerix</code> 절을 추가하여 서브넷의 CIDR을 선언합니다.
<ul>
<li><code v-pre>prefix</code></li>
<li><code v-pre>address_space</code></li>
<li><strong><code v-pre>subnet_prefix</code></strong></li>
</ul>
</li>
</ul>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>variable <span class="token string-literal"><span class="token string">"subnet_prefix"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"The address prefix to use for the subnet."</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"10.0.10.0/24"</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="테라폼-계획-배포-plan-apply-2" tabindex="-1"><a class="header-anchor" href="#테라폼-계획-배포-plan-apply-2" aria-hidden="true">#</a> 테라폼 계획 &amp; 배포(plan &amp; apply)</h3>
<p>다음 두 리소스가 추가적으로 생성되는 것을 확인합니다.</p>
<ul>
<li>azurerm_network_security_group.catapp-sg</li>
<li>azurerm_subnet.subnet</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment">#(생략)</span>
Terraform will perform the following actions:

  <span class="token comment"># azurerm_network_security_group.catapp-sg will be created</span>
  + resource <span class="token string">"azurerm_network_security_group"</span> <span class="token string">"catapp-sg"</span> <span class="token punctuation">{</span>
      + <span class="token function">id</span>                  <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + location            <span class="token operator">=</span> <span class="token string">"koreacentral"</span>
      + name                <span class="token operator">=</span> <span class="token string">"hyungwook-sg"</span>
      + resource_group_name <span class="token operator">=</span> <span class="token string">"hyungwook-workshop"</span>
      + security_rule       <span class="token operator">=</span> <span class="token punctuation">[</span>
          + <span class="token punctuation">{</span>
              + access                                     <span class="token operator">=</span> <span class="token string">"Allow"</span>
              + description                                <span class="token operator">=</span> <span class="token string">""</span>
              + destination_address_prefix                 <span class="token operator">=</span> <span class="token string">"*"</span>
              + destination_address_prefixes               <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
              + destination_application_security_group_ids <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
              + destination_port_range                     <span class="token operator">=</span> <span class="token string">"22"</span>
              + destination_port_ranges                    <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
              + direction                                  <span class="token operator">=</span> <span class="token string">"Inbound"</span>
              + name                                       <span class="token operator">=</span> <span class="token string">"SSH"</span>
              + priority                                   <span class="token operator">=</span> <span class="token number">101</span>
              + protocol                                   <span class="token operator">=</span> <span class="token string">"Tcp"</span>
              + source_address_prefix                      <span class="token operator">=</span> <span class="token string">"*"</span>
              + source_address_prefixes                    <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
              + source_application_security_group_ids      <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
              + source_port_range                          <span class="token operator">=</span> <span class="token string">"*"</span>
              + source_port_ranges                         <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
            <span class="token punctuation">}</span>,
<span class="token comment">#(중략)            </span>
  
  <span class="token comment"># azurerm_subnet.subnet will be created</span>
  + resource <span class="token string">"azurerm_subnet"</span> <span class="token string">"subnet"</span> <span class="token punctuation">{</span>
      + address_prefix                                 <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + address_prefixes                               <span class="token operator">=</span> <span class="token punctuation">[</span>
          + <span class="token string">"10.0.10.0/24"</span>,
        <span class="token punctuation">]</span>
      + enforce_private_link_endpoint_network_policies <span class="token operator">=</span> <span class="token boolean">false</span>
      + enforce_private_link_service_network_policies  <span class="token operator">=</span> <span class="token boolean">false</span>
      + <span class="token function">id</span>                                             <span class="token operator">=</span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      + name                                           <span class="token operator">=</span> <span class="token string">"hyungwook-subnet"</span>
      + resource_group_name                            <span class="token operator">=</span> <span class="token string">"hyungwook-workshop"</span>
      + virtual_network_name                           <span class="token operator">=</span> <span class="token string">"hyungwook-vnet"</span>
    <span class="token punctuation">}</span>

Plan: <span class="token number">2</span> to add, <span class="token number">0</span> to change, <span class="token number">0</span> to destroy.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="실습-시나리오-4-hashicat-웹-애플리케이션-배포" tabindex="-1"><a class="header-anchor" href="#실습-시나리오-4-hashicat-웹-애플리케이션-배포" aria-hidden="true">#</a> 실습) 시나리오 4. hashicat 웹 애플리케이션 배포</h2>
<blockquote>
<p>참고 : 원본 소스코드는 <a href="https://github.com/hashicorp/hashicat-azure" target="_blank" rel="noopener noreferrer">hashicat-azure 저장소<ExternalLinkIcon/></a>에서 확인할 수 있습니다.</p>
</blockquote>
<p>이번 시나리오는 실제 VM 인스턴스에 초기화 스크립트를 사용하여 웹 애플리케이션을 배포해보도록 하겠습니다.</p>
<h3 id="hcl-구성파일-3" tabindex="-1"><a class="header-anchor" href="#hcl-구성파일-3" aria-hidden="true">#</a> HCL 구성파일</h3>
<ul>
<li><a href="http://main.tf" target="_blank" rel="noopener noreferrer">main.tf<ExternalLinkIcon/></a>
<ul>
<li><code v-pre>azurerm_network_interface</code> : Network Interface 생성</li>
<li><code v-pre>azurerm_network_interface_security_group_association</code> : Network Interface에 Security Group 할당</li>
<li><code v-pre>azurerm_public_ip</code> : 가상머신에 접속하기 위한 Public IP</li>
<li><code v-pre>azurerm_virtual_machine</code> : 가상머신</li>
<li><code v-pre>null_resource</code> : 가상머신 배포 후 <code v-pre>provisioner</code> 를 통해 웹 서비스 설치를 위해 사용</li>
</ul>
</li>
</ul>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>terraform <span class="token punctuation">{</span>
  required_providers <span class="token punctuation">{</span>
    azurerm <span class="token operator">=</span> <span class="token punctuation">{</span>
      source  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"hashicorp/azurerm"</span></span>
      version <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"=2.60.0"</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

provider <span class="token string-literal"><span class="token string">"azurerm"</span></span> <span class="token punctuation">{</span>
  features <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"azurerm_resource_group"</span></span> <span class="token string-literal"><span class="token string">"myresourcegroup"</span></span> <span class="token punctuation">{</span>
  name     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-workshop"</span></span>
  location <span class="token operator">=</span> var<span class="token punctuation">.</span>location

  tags <span class="token operator">=</span> <span class="token punctuation">{</span>
    environment <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Production"</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"azurerm_virtual_network"</span></span> <span class="token string-literal"><span class="token string">"vnet"</span></span> <span class="token punctuation">{</span>
  name                <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-vnet"</span></span>
  location            <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>location
  address_space       <span class="token operator">=</span> <span class="token punctuation">[</span>var<span class="token punctuation">.</span>address_space<span class="token punctuation">]</span>
  resource_group_name <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>name
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"azurerm_subnet"</span></span> <span class="token string-literal"><span class="token string">"subnet"</span></span> <span class="token punctuation">{</span>
  name                 <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-subnet"</span></span>
  virtual_network_name <span class="token operator">=</span> azurerm_virtual_network<span class="token punctuation">.</span>vnet<span class="token punctuation">.</span>name
  resource_group_name  <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>name
  address_prefixes     <span class="token operator">=</span> <span class="token punctuation">[</span>var<span class="token punctuation">.</span>subnet_prefix<span class="token punctuation">]</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"azurerm_network_security_group"</span></span> <span class="token string-literal"><span class="token string">"catapp-sg"</span></span> <span class="token punctuation">{</span>
  name                <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-sg"</span></span>
  location            <span class="token operator">=</span> var<span class="token punctuation">.</span>location
  resource_group_name <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>name

  security_rule <span class="token punctuation">{</span>
    name                       <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"HTTP"</span></span>
    priority                   <span class="token operator">=</span> <span class="token number">100</span>
    direction                  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Inbound"</span></span>
    access                     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Allow"</span></span>
    protocol                   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Tcp"</span></span>
    source_port_range          <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_port_range     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"80"</span></span>
    source_address_prefix      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_address_prefix <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
  <span class="token punctuation">}</span>

  security_rule <span class="token punctuation">{</span>
    name                       <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"HTTPS"</span></span>
    priority                   <span class="token operator">=</span> <span class="token number">102</span>
    direction                  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Inbound"</span></span>
    access                     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Allow"</span></span>
    protocol                   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Tcp"</span></span>
    source_port_range          <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_port_range     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"443"</span></span>
    source_address_prefix      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_address_prefix <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
  <span class="token punctuation">}</span>

  security_rule <span class="token punctuation">{</span>
    name                       <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"SSH"</span></span>
    priority                   <span class="token operator">=</span> <span class="token number">101</span>
    direction                  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Inbound"</span></span>
    access                     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Allow"</span></span>
    protocol                   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Tcp"</span></span>
    source_port_range          <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_port_range     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"22"</span></span>
    source_address_prefix      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
    destination_address_prefix <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"*"</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"azurerm_network_interface"</span></span> <span class="token string-literal"><span class="token string">"catapp-nic"</span></span> <span class="token punctuation">{</span>
  name                      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-catapp-nic"</span></span>
  location                  <span class="token operator">=</span> var<span class="token punctuation">.</span>location
  resource_group_name       <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>name

  ip_configuration <span class="token punctuation">{</span>
    name                          <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}ipconfig"</span></span>
    subnet_id                     <span class="token operator">=</span> azurerm_subnet<span class="token punctuation">.</span>subnet<span class="token punctuation">.</span>id
    private_ip_address_allocation <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Dynamic"</span></span>
    public_ip_address_id          <span class="token operator">=</span> azurerm_public_ip<span class="token punctuation">.</span>catapp<span class="token operator">-</span>pip<span class="token punctuation">.</span>id
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"azurerm_network_interface_security_group_association"</span></span> <span class="token string-literal"><span class="token string">"catapp-nic-sg-ass"</span></span> <span class="token punctuation">{</span>
  network_interface_id      <span class="token operator">=</span> azurerm_network_interface<span class="token punctuation">.</span>catapp<span class="token operator">-</span>nic<span class="token punctuation">.</span>id
  network_security_group_id <span class="token operator">=</span> azurerm_network_security_group<span class="token punctuation">.</span>catapp<span class="token operator">-</span>sg<span class="token punctuation">.</span>id
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"azurerm_public_ip"</span></span> <span class="token string-literal"><span class="token string">"catapp-pip"</span></span> <span class="token punctuation">{</span>
  name                <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-ip"</span></span>
  location            <span class="token operator">=</span> var<span class="token punctuation">.</span>location
  resource_group_name <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>name
  allocation_method   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Dynamic"</span></span>
  domain_name_label   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-meow"</span></span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"azurerm_virtual_machine"</span></span> <span class="token string-literal"><span class="token string">"catapp"</span></span> <span class="token punctuation">{</span>
  name                <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-meow"</span></span>
  location            <span class="token operator">=</span> var<span class="token punctuation">.</span>location
  resource_group_name <span class="token operator">=</span> azurerm_resource_group<span class="token punctuation">.</span>myresourcegroup<span class="token punctuation">.</span>name
  vm_size             <span class="token operator">=</span> var<span class="token punctuation">.</span>vm_size

  network_interface_ids         <span class="token operator">=</span> <span class="token punctuation">[</span>azurerm_network_interface<span class="token punctuation">.</span>catapp<span class="token operator">-</span>nic<span class="token punctuation">.</span>id<span class="token punctuation">]</span>
  delete_os_disk_on_termination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"true"</span></span>

  storage_image_reference <span class="token punctuation">{</span>
    publisher <span class="token operator">=</span> var<span class="token punctuation">.</span>image_publisher
    offer     <span class="token operator">=</span> var<span class="token punctuation">.</span>image_offer
    sku       <span class="token operator">=</span> var<span class="token punctuation">.</span>image_sku
    version   <span class="token operator">=</span> var<span class="token punctuation">.</span>image_version
  <span class="token punctuation">}</span>

  storage_os_disk <span class="token punctuation">{</span>
    name              <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-osdisk"</span></span>
    managed_disk_type <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Standard_LRS"</span></span>
    caching           <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"ReadWrite"</span></span>
    create_option     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"FromImage"</span></span>
  <span class="token punctuation">}</span>

  os_profile <span class="token punctuation">{</span>
    computer_name  <span class="token operator">=</span> var<span class="token punctuation">.</span>prefix
    admin_username <span class="token operator">=</span> var<span class="token punctuation">.</span>admin_username
    admin_password <span class="token operator">=</span> var<span class="token punctuation">.</span>admin_password
  <span class="token punctuation">}</span>

  os_profile_linux_config <span class="token punctuation">{</span>
    disable_password_authentication <span class="token operator">=</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span>

  tags <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

  <span class="token comment"># Added to allow destroy to work correctly.</span>
  depends_on <span class="token operator">=</span> <span class="token punctuation">[</span>azurerm_network_interface_security_group_association<span class="token punctuation">.</span>catapp<span class="token operator">-</span>nic<span class="token operator">-</span>sg<span class="token operator">-</span>ass<span class="token punctuation">]</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"null_resource"</span></span> <span class="token string-literal"><span class="token string">"configure-cat-app"</span></span> <span class="token punctuation">{</span>
  depends_on <span class="token operator">=</span> <span class="token punctuation">[</span>
    azurerm_virtual_machine<span class="token punctuation">.</span>catapp<span class="token punctuation">,</span>
  <span class="token punctuation">]</span>

  <span class="token comment"># Terraform 0.12</span>
  triggers <span class="token operator">=</span> <span class="token punctuation">{</span>
    build_number <span class="token operator">=</span> timestamp<span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>

  provisioner <span class="token string-literal"><span class="token string">"file"</span></span> <span class="token punctuation">{</span>
    source      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"files/"</span></span>
    destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/home/${var.admin_username}/"</span></span>

    connection <span class="token punctuation">{</span>
      type     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"ssh"</span></span>
      user     <span class="token operator">=</span> var<span class="token punctuation">.</span>admin_username
      password <span class="token operator">=</span> var<span class="token punctuation">.</span>admin_password
      host     <span class="token operator">=</span> azurerm_public_ip<span class="token punctuation">.</span>catapp<span class="token operator">-</span>pip<span class="token punctuation">.</span>fqdn
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  provisioner <span class="token string-literal"><span class="token string">"remote-exec"</span></span> <span class="token punctuation">{</span>
    inline <span class="token operator">=</span> <span class="token punctuation">[</span>
      <span class="token string-literal"><span class="token string">"sudo apt -y update"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"sleep 15"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"sudo apt -y update"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"sudo apt -y install apache2"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"sudo systemctl start apache2"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"sudo chown -R ${var.admin_username}:${var.admin_username} /var/www/html"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"chmod +x *.sh"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"PLACEHOLDER=${var.placeholder} WIDTH=${var.width} HEIGHT=${var.height} PREFIX=${var.prefix} ./deploy_app.sh"</span></span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span>

    connection <span class="token punctuation">{</span>
      type     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"ssh"</span></span>
      user     <span class="token operator">=</span> var<span class="token punctuation">.</span>admin_username
      password <span class="token operator">=</span> var<span class="token punctuation">.</span>admin_password
      host     <span class="token operator">=</span> azurerm_public_ip<span class="token punctuation">.</span>catapp<span class="token operator">-</span>pip<span class="token punctuation">.</span>fqdn
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><a href="http://variables.tf" target="_blank" rel="noopener noreferrer">variables.tf<ExternalLinkIcon/></a>
<ul>
<li>설명생략</li>
</ul>
</li>
</ul>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>variable <span class="token string-literal"><span class="token string">"prefix"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"This prefix will be included in the name of most resources."</span></span>
  default <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"unknown"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"location"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"The region where the virtual network is created."</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"eastus"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"address_space"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"The address space that is used by the virtual network. You can supply more than one address space. Changing this forces a new resource to be created."</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"10.0.0.0/16"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"subnet_prefix"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"The address prefix to use for the subnet."</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"10.0.10.0/24"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"vm_size"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Specifies the size of the virtual machine."</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Standard_B1s"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"image_publisher"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Name of the publisher of the image (az vm image list)"</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Canonical"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"image_offer"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Name of the offer (az vm image list)"</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"0001-com-ubuntu-server-jammy"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"image_sku"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Image SKU to apply (az vm image list)"</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"22_04-LTS-gen2"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"image_version"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Version of the image to apply (az vm image list)"</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"latest"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"admin_username"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Administrator user name for linux and mysql"</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"hashicorp"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"admin_password"</span></span> <span class="token punctuation">{</span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Administrator password for linux and mysql"</span></span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Password123!"</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"height"</span></span> <span class="token punctuation">{</span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"400"</span></span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Image height in pixels."</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"width"</span></span> <span class="token punctuation">{</span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"600"</span></span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Image width in pixels."</span></span>
<span class="token punctuation">}</span>

variable <span class="token string-literal"><span class="token string">"placeholder"</span></span> <span class="token punctuation">{</span>
  default     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"placekitten.com"</span></span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Image-as-a-service URL. Some other fun ones to try are fillmurray.com, placecage.com, placebeard.it, loremflickr.com, baconmockup.com, placeimg.com, placebear.com, placeskull.com, stevensegallery.com, placedog.net"</span></span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="테라폼-계획-배포-plan-apply-3" tabindex="-1"><a class="header-anchor" href="#테라폼-계획-배포-plan-apply-3" aria-hidden="true">#</a> 테라폼 계획 &amp; 배포(plan &amp; apply)</h3>
<p><code v-pre>main.tf</code>에서 추가했던 각종 리소스가 추가적으로 배포되는 것을 확인합니다.<br>
해당 시나리오에서는 가상머신 생성 후 <code v-pre>null_resource</code> 리소스를 통해 아파치 웹 서버를 설치하는 과정이 포함되어 있으므로 3~5분정도 소요됩니다.</p>
<h3 id="결과-확인-output" tabindex="-1"><a class="header-anchor" href="#결과-확인-output" aria-hidden="true">#</a> 결과 확인 : output</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 생략</span>
null_resource.configure-cat-app <span class="token punctuation">(</span>remote-exec<span class="token punctuation">)</span>: Script complete.
null_resource.configure-cat-app: Creation complete after 31s <span class="token punctuation">[</span>id<span class="token operator">=</span><span class="token number">7198378208770846330</span><span class="token punctuation">]</span>

Apply complete<span class="token operator">!</span> Resources: <span class="token number">1</span> added, <span class="token number">0</span> changed, <span class="token number">1</span> destroyed.

Outputs:

catapp_url <span class="token operator">=</span> <span class="token string">"http://hyungwook-meow.koreacentral.cloudapp.azure.com"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="결과확인-web-ui" tabindex="-1"><a class="header-anchor" href="#결과확인-web-ui" aria-hidden="true">#</a> 결과확인 : WEB UI</h3>
<p><code v-pre>catapp_url</code> 을 통해 접속해본 결과 정상적으로 웹 애플리케이션이 배포되고 고양이 이미지를 출력하는 것을 확인할 수 있다.</p>
<figure><img src="https://github.com/hyungwook0221/img/blob/main/uPic/hashicat-azure.png?raw=true" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h2 id="정리" tabindex="-1"><a class="header-anchor" href="#정리" aria-hidden="true">#</a> 정리</h2>
<p>본 실습을 통해서 간략하게 Azure의 azurerm 프로바이더를 통해 각종 리소스를 생성하는 방안을 알아보았습니다.<br>
잘못된 정보나 수정이 필요한 부분이 있다면 언제든 피드백 부탁드립니다!</p>
<blockquote>
<p>작성자 : 유형욱(<a href="mailto:hyungwook.yu@hashicorp.com">hyungwook.yu@hashicorp.com</a>)</p>
</blockquote>
</div></template>


