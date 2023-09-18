<template><div><h1 id="terraform-코드-상에서-vault-연동하기" tabindex="-1"><a class="header-anchor" href="#terraform-코드-상에서-vault-연동하기" aria-hidden="true">#</a> Terraform 코드 상에서 Vault 연동하기</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p><a href="https://learn.hashicorp.com/tutorials/terraform/secrets-vault?in=vault/secrets-management" target="_blank" rel="noopener noreferrer">Inject Secrets into Terraform Using the Vault Provider<ExternalLinkIcon/></a></p>
<p><a href="https://registry.terraform.io/providers/hashicorp/vault/latest/docs#using-vault-credentials-in-terraform-configuration" target="_blank" rel="noopener noreferrer">Using Vault credentials in Terraform configuration<ExternalLinkIcon/></a></p>
<p><a href="https://www.youtube.com/watch?v=fOybhcbuxJ0" target="_blank" rel="noopener noreferrer">Best Practices for using Terraform with Vault<ExternalLinkIcon/></a></p>
</div>
<p>Terraform Enterprise/Terraform Cloud를 사용할 때 Workspace의 변수(Variable)를 Vault를 사용하여 설정하는 것은 Terraform의 TFE 프로바이더와 Vault Provider를 사용하여 가능하다.</p>
<p>이번 예제는 Terraform Configuration Template에서 Vault를 사용하는 예제이다. Vault 인증 시 AppRole인증을 사용하였으나 기타 지원되는 인증 방법을 사용할 수 있다.</p>
<p>AWS Provider 설정 시 필요한 access_key와 secret_key를 환경 변수 설정이 아니라 코드 실행 시 Vault AWS 시크릿 엔진을 사용하도록 구성된 예제로, 코드는 다음과 같이 4개의 파일로 구성된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>❯ tree
<span class="token builtin class-name">.</span>
├── ec2.tf
├── provider.tf
├── terraform.tfvars
└── variables.tf

<span class="token number">0</span> directories, <span class="token number">4</span> files
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">경고</p>
<p>위 예제를 사용하기 위해서는 Vault 상의 AWS 시크릿 엔진이 구성되어 있어야 하고, 인증을 위한 AppRole 구성 그리고 정책이 사전에 설정되어 있어야 한다.</p>
</div>
<h2 id="_1-provider-설정-provider-tf" tabindex="-1"><a class="header-anchor" href="#_1-provider-설정-provider-tf" aria-hidden="true">#</a> 1. Provider 설정 (<a href="http://provider.tf" target="_blank" rel="noopener noreferrer">provider.tf<ExternalLinkIcon/></a>)</h2>
<p>사용할 프로바이더로 aws(자원 배포 대상)와 vault를 지정.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">terraform</span> <span class="token punctuation">{</span>
  <span class="token keyword">required_providers</span> <span class="token punctuation">{</span>
    <span class="token property">aws</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"hashicorp/aws"</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"3.23.0"</span>
    <span class="token punctuation">}</span>
    <span class="token property">vault</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"hashicorp/vault"</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"2.17.0"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">provider<span class="token type variable"> "vault" </span></span><span class="token punctuation">{</span>
  <span class="token comment"># It is strongly recommended to configure this provider through the environment variables described above, so that each user can have</span>
  <span class="token comment"># separate credentials set in the environment.</span>
  <span class="token comment">#</span>
  <span class="token comment"># This will default to using $VAULT_ADDR</span>
  <span class="token comment"># But can be set explicitly</span>
  <span class="token comment"># address = "https://vault.example.net:8200"</span>
  <span class="token property">address</span> <span class="token punctuation">=</span> var.vault_addr

  
  <span class="token keyword">auth_login</span> <span class="token punctuation">{</span>
  <span class="token property">path</span> <span class="token punctuation">=</span> <span class="token string">"auth/approle/login"</span>
  <span class="token property">parameters</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">role_id</span>   <span class="token punctuation">=</span> var.login_approle_role_id
    <span class="token property">secret_id</span> <span class="token punctuation">=</span> var.login_approle_secret_id
  <span class="token punctuation">}</span>
 <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment"># 코드 실행 시 Vault AWS 시크릿 엔진을 사용하여, data 값으로 access_key와 secret_key 생성하여 사용</span>
<span class="token keyword">provider<span class="token type variable"> "aws" </span></span><span class="token punctuation">{</span>
  <span class="token property">region</span>     <span class="token punctuation">=</span> var.region
  <span class="token property">access_key</span> <span class="token punctuation">=</span> data.vault_aws_access_credentials.creds.access_key
  <span class="token property">secret_key</span> <span class="token punctuation">=</span> data.vault_aws_access_credentials.creds.secret_key
  <span class="token comment"># STS Token을 사용하지 않는 경우 주석 처리</span>
  <span class="token property">token</span>      <span class="token punctuation">=</span> data.vault_aws_access_credentials.creds.security_token
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-자원-생성-시-사용-설정-ec2-tf" tabindex="-1"><a class="header-anchor" href="#_2-자원-생성-시-사용-설정-ec2-tf" aria-hidden="true">#</a> 2. 자원 생성 시 사용 설정 (<a href="http://ec2.tf" target="_blank" rel="noopener noreferrer">ec2.tf<ExternalLinkIcon/></a>)</h2>
<p>data 소스를 이용하여 Vault에 설정된 AWS 시크릿 엔진을 읽어서 access_key와 secret_key를 생성하고, 해당 정보를 provider에서 사용하게 된다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">data <span class="token type variable">"vault_aws_access_credentials"</span></span> <span class="token string">"creds"</span> <span class="token punctuation">{</span>
  <span class="token comment"># AWS 시크릿 엔진 경로 : 기본은 AWS</span>
  <span class="token property">backend</span> <span class="token punctuation">=</span> var.aws_sec_path
  <span class="token comment"># AWS 시크릿 엔진 구성 시 사용한  Role 이름</span>
  <span class="token property">role</span>    <span class="token punctuation">=</span> var.aws_sec_role
  <span class="token comment">#STS Token으로 발급받아 설정. 아닌 경우, 다음 코드를 주석 처리 후 실행할 것.</span>
  <span class="token property">type</span> <span class="token punctuation">=</span><span class="token string">"sts"</span>
<span class="token punctuation">}</span>

<span class="token comment"># AMI 정보 조회</span>
<span class="token keyword">data <span class="token type variable">"aws_ami"</span></span> <span class="token string">"ubuntu"</span> <span class="token punctuation">{</span>
  <span class="token property">most_recent</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>

  <span class="token keyword">filter</span> <span class="token punctuation">{</span>
    <span class="token property">name</span>   <span class="token punctuation">=</span> <span class="token string">"name"</span>
    <span class="token property">values</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"ubuntu/images/hvm-ssd/ubuntu-trusty-14.04-amd64-server-*"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">filter</span> <span class="token punctuation">{</span>
    <span class="token property">name</span>   <span class="token punctuation">=</span> <span class="token string">"virtualization-type"</span>
    <span class="token property">values</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"hvm"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  <span class="token property">owners</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"099720109477"</span><span class="token punctuation">]</span> <span class="token comment"># Canonical</span>
<span class="token punctuation">}</span>

<span class="token comment"># Create AWS EC2 Instance</span>
<span class="token keyword">resource <span class="token type variable">"aws_instance"</span></span> <span class="token string">"main"</span> <span class="token punctuation">{</span>
  <span class="token property">ami</span>           <span class="token punctuation">=</span> data.aws_ami.ubuntu.id
  <span class="token property">instance_type</span> <span class="token punctuation">=</span> <span class="token string">"t2.nano"</span>

  <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">Name</span>  <span class="token punctuation">=</span> var.name
    <span class="token property">TTL</span>   <span class="token punctuation">=</span> var.ttl
    <span class="token property">owner</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">name</span><span class="token punctuation">}</span></span>-guide"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-변수-선언-및-변수-값-지정" tabindex="-1"><a class="header-anchor" href="#_3-변수-선언-및-변수-값-지정" aria-hidden="true">#</a> 3. 변수 선언 및 변수 값 지정</h2>
<h3 id="_3-1-변수-선언-variables-tf" tabindex="-1"><a class="header-anchor" href="#_3-1-변수-선언-variables-tf" aria-hidden="true">#</a> 3.1 변수 선언 (<a href="http://variables.tf" target="_blank" rel="noopener noreferrer">variables.tf<ExternalLinkIcon/></a>)</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> region </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span><span class="token punctuation">=</span><span class="token string">"ap-northeast-2"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "name" </span></span><span class="token punctuation">{</span> <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"vault-dynamic-creds"</span><span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> ttl </span></span><span class="token punctuation">{</span> <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"24h"</span><span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "vault_addr" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"Vault Server address format : http://IP_ADDRES:8200"</span>
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"http://127.0.0.1:8200"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> login_approle_role_id </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"AppRole의 Role ID값 설정"</span>
<span class="token punctuation">}</span>
<span class="token keyword">variable<span class="token type variable"> login_approle_secret_id </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"AppRole의 Secret ID값 설정"</span>
<span class="token punctuation">}</span>
<span class="token comment"># </span>
<span class="token keyword">variable<span class="token type variable"> aws_sec_path </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"AWS 시크릿 엔진 경로, 마지막은 반드시 '/'로 끝나게 설정."</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"aws/"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> aws_sec_role </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"AWS 시크릿 엔진 상의 Role 이름"</span>
  <span class="token property">default</span> <span class="token punctuation">=</span><span class="token string">"VAULT상에 생성된 AWS시크릿 엔진의 Role이름"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-변수-값-지정-terraform-tfvars" tabindex="-1"><a class="header-anchor" href="#_3-2-변수-값-지정-terraform-tfvars" aria-hidden="true">#</a> 3.2 변수 값 지정 (terraform.tfvars)</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token property">vault_addr</span><span class="token punctuation">=</span><span class="token string">"http://127.0.0.1:8200"</span> 
<span class="token property">login_approle_role_id</span><span class="token punctuation">=</span><span class="token string">"AppRole의 Role_ID값"</span>
<span class="token property">login_approle_secret_id</span><span class="token punctuation">=</span><span class="token string">"AppRole의 Secret_ID값"</span> 

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="개선-아이디어" tabindex="-1"><a class="header-anchor" href="#개선-아이디어" aria-hidden="true">#</a> 개선 아이디어</h1>
<ul>
<li>terraform.tfvars 상의 Role_ID, Secret_ID값은 Terraform Cloud/Enterprise를 사용하는 경우, Workspace 상의 변수로 설정할 수 있다. --&gt; 해당 작업을 수행하는 별도의 Admin Workspace가 있는 경우, Run Trigger를 활용할 수 있다.</li>
<li>terraform.tfvars 파일을 Vault Agent, ConsulTemplate 또는 envConsul을 이용하여 설정 후 사용하는 것도 가능.</li>
</ul>
</div></template>


