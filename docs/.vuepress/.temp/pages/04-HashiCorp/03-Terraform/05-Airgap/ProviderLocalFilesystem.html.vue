<template><div><h1 id="terraform-provider-로컬-디렉토리" tabindex="-1"><a class="header-anchor" href="#terraform-provider-로컬-디렉토리" aria-hidden="true">#</a> Terraform Provider - 로컬 디렉토리</h1>
<blockquote>
<p><a href="https://www.terraform.io/docs/cli/config/config-file.html#implied-local-mirror-directories" target="_blank" rel="noopener noreferrer">https://www.terraform.io/docs/cli/config/config-file.html#implied-local-mirror-directories<ExternalLinkIcon/></a><br>
<a href="https://learn.hashicorp.com/tutorials/terraform/provider-use?in=terraform/providers" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/terraform/provider-use?in=terraform/providers<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="환경" tabindex="-1"><a class="header-anchor" href="#환경" aria-hidden="true">#</a> 환경</h2>
<ul>
<li>
<p>OS : CentOS7</p>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code><span class="token key attr-name">NAME</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">CentOS Linux</span>"</span>
<span class="token key attr-name">VERSION</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">7 (Core)</span>"</span>
<span class="token key attr-name">ID</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">centos</span>"</span>
<span class="token key attr-name">ID_LIKE</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">rhel fedora</span>"</span>
<span class="token key attr-name">VERSION_ID</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">7</span>"</span>
<span class="token key attr-name">PRETTY_NAME</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">CentOS Linux 7 (Core)</span>"</span>
<span class="token key attr-name">ANSI_COLOR</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">0;31</span>"</span>
<span class="token key attr-name">CPE_NAME</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">cpe:/o:centos:centos:7</span>"</span>
<span class="token key attr-name">HOME_URL</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">https://www.centos.org/</span>"</span>
<span class="token key attr-name">BUG_REPORT_URL</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">https://bugs.centos.org/</span>"</span>

<span class="token key attr-name">CENTOS_MANTISBT_PROJECT</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">CentOS-7</span>"</span>
<span class="token key attr-name">CENTOS_MANTISBT_PROJECT_VERSION</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">7</span>"</span>
<span class="token key attr-name">REDHAT_SUPPORT_PRODUCT</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">centos</span>"</span>
<span class="token key attr-name">REDHAT_SUPPORT_PRODUCT_VERSION</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">7</span>"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Terraform</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ terraform version
Terraform v1.0.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h2 id="test-provider" tabindex="-1"><a class="header-anchor" href="#test-provider" aria-hidden="true">#</a> Test Provider</h2>
<ul>
<li>random : <a href="https://releases.hashicorp.com/terraform-provider-random/3.1.0/terraform-provider-random_3.1.0_linux_amd64.zip" target="_blank" rel="noopener noreferrer">https://releases.hashicorp.com/terraform-provider-random/3.1.0/terraform-provider-random_3.1.0_linux_amd64.zip<ExternalLinkIcon/></a></li>
<li>nsxt : <a href="https://releases.hashicorp.com/terraform-provider-nsxt/3.2.1/terraform-provider-nsxt_3.2.1_linux_amd64.zip" target="_blank" rel="noopener noreferrer">https://releases.hashicorp.com/terraform-provider-nsxt/3.2.1/terraform-provider-nsxt_3.2.1_linux_amd64.zip<ExternalLinkIcon/></a></li>
</ul>
<h2 id="구성-절차" tabindex="-1"><a class="header-anchor" href="#구성-절차" aria-hidden="true">#</a> 구성 절차</h2>
<ol>
<li>
<p>필요한 Provider zip파일을 <a href="https://releases.hashicorp.com" target="_blank" rel="noopener noreferrer">https://releases.hashicorp.com<ExternalLinkIcon/></a> 에서 미리 다운 받습니다. 받아놓은 zip 파일이 있는 경우 대상 시스템에 복사해둡니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">wget</span> https://releases.hashicorp.com/terraform-provider-nsxt/3.2.1/terraform-provider-nsxt_3.2.1_linux_amd64.zip
$ <span class="token function">wget</span> https://releases.hashicorp.com/terraform-provider-random/3.1.0/terraform-provider-random_3.1.0_linux_amd64.zip
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Plugin 디렉토리 구성<br>
로컬 Provider를 찾기위한 디렉토리 구조를 생성합니다. <code v-pre>host_name</code>은 환경마다 상이할 수 있습니다.</p>
<p><code v-pre>~/.terraform.d/plugins/${host_name}/${namespace}/${type}/${version}/${target}</code></p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> ~/.terraform.d/plugins/localhost.localdomain/vmware/nsxt/3.2.1/linux_amd64
$ <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> ~/.terraform.d/plugins/localhost.localdomain/hashicorp/random/3.1.0/linux_amd64
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Provider 바이너리 파일 구성</p>
<p>기존에 받아놓은 zip 파일을 압축 해제하고, 생성한 Provider 디렉토리 각각에 맞는 프로바이더를 복사합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">unzip</span> terraform-provider-random_3.1.0_linux_amd64.zip
Archive:  terraform-provider-random_3.1.0_linux_amd64.zip
  inflating: terraform-provider-random_v3.1.0_x5
  
$ <span class="token function">mv</span> ./terraform-provider-random_v3.1.0_x5 ~/.terraform.d/plugins/localhost.localdomain/hashicorp/random/3.1.0/linux_amd64

$ <span class="token function">unzip</span> terraform-provider-nsxt_3.2.1_linux_amd64.zip
Archive:  terraform-provider-nsxt_3.2.1_linux_amd64.zip
  inflating: CHANGELOG.md
  inflating: LICENSE.txt
  inflating: README.md
  inflating: terraform-provider-nsxt_v3.2.1
  
$ <span class="token function">mv</span> ./terraform-provider-nsxt_v3.2.1 ~/.terraform.d/plugins/localhost.localdomain/vmware/nsxt/3.2.1/linux_amd64
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>로컬 Provider 구성 확인</p>
<p>::: vue<br>
$ tree -a ~/.terraform.d/<br>
/root/.terraform.d/<br>
├── <code v-pre>plugins</code><br>
│   └── localhost.localdomain<br>
│       ├── hashicorp<br>
│       │   └── random<br>
│       │       └── 3.1.0<br>
│       │           └── linux_amd64<br>
│       │               └── terraform-provider-random_v3.1.0_x5<br>
│       └── vmware<br>
│           └── nsxt<br>
│               └── 3.2.1<br>
│                   └── linux_amd64<br>
│                       └── terraform-provider-nsxt_v3.2.1<br>
├── checkpoint_cache<br>
└── checkpoint_signature<br>
:::</p>
</li>
<li>
<p>워크스페이스 생성 (디렉토리) - airgapped 는 임의의 이름 입니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">mkdir</span> ./airgapped
$ <span class="token builtin class-name">cd</span> ./airgapped
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>tf 파일 작성</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>$ cat <span class="token operator">&lt;&lt;</span><span class="token constant">EOF</span><span class="token operator">></span> terraform<span class="token punctuation">.</span>tf
terraform <span class="token punctuation">{</span>
  required_providers <span class="token punctuation">{</span>
    nsxt <span class="token operator">=</span> <span class="token punctuation">{</span>
      source <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"localhost.localdomain/vmware/nsxt"</span></span>
      version <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"3.2.1"</span></span>
    <span class="token punctuation">}</span>
    random <span class="token operator">=</span> <span class="token punctuation">{</span>
      source <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"localhost.localdomain/hashicorp/random"</span></span>
      version <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"3.1.0"</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

provider <span class="token string-literal"><span class="token string">"nsxt"</span></span> <span class="token punctuation">{</span>
  <span class="token comment"># Configuration options</span>
<span class="token punctuation">}</span>

provider <span class="token string-literal"><span class="token string">"random"</span></span> <span class="token punctuation">{</span>
  <span class="token comment"># Configuration options</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"random_id"</span></span> <span class="token string-literal"><span class="token string">"test"</span></span> <span class="token punctuation">{</span>
  byte_length <span class="token operator">=</span> <span class="token number">8</span>
<span class="token punctuation">}</span>

output <span class="token string-literal"><span class="token string">"random_id"</span></span> <span class="token punctuation">{</span>
  value <span class="token operator">=</span> random_id<span class="token punctuation">.</span>test
<span class="token punctuation">}</span>
<span class="token constant">EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Terraform <code v-pre>init</code>을 수행하여 정상적으로 로컬 Provider를 가져오는지 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ terraform init

Initializing the backend<span class="token punctuation">..</span>.

Initializing provider plugins<span class="token punctuation">..</span>.
- Finding localhost.localdomain/vmware/nsxt versions matching <span class="token string">"3.2.1"</span><span class="token punctuation">..</span>.
- Finding localhost.localdomain/hashicorp/random versions matching <span class="token string">"3.1.0"</span><span class="token punctuation">..</span>.
- Installing localhost.localdomain/vmware/nsxt v3.2.1<span class="token punctuation">..</span>.
- Installed localhost.localdomain/vmware/nsxt v3.2.1 <span class="token punctuation">(</span>unauthenticated<span class="token punctuation">)</span>
- Installing localhost.localdomain/hashicorp/random v3.1.0<span class="token punctuation">..</span>.
- Installed localhost.localdomain/hashicorp/random v3.1.0 <span class="token punctuation">(</span>unauthenticated<span class="token punctuation">)</span>

Terraform has created a lock <span class="token function">file</span> .terraform.lock.hcl to record the provider
selections it made above. Include this <span class="token function">file</span> <span class="token keyword">in</span> your version control repository
so that Terraform can guarantee to <span class="token function">make</span> the same selections by default when
you run <span class="token string">"terraform init"</span> <span class="token keyword">in</span> the future.

Terraform has been successfully initialized<span class="token operator">!</span>

You may now begin working with Terraform. Try running <span class="token string">"terraform plan"</span> to see
any changes that are required <span class="token keyword">for</span> your infrastructure. All Terraform commands
should now work.

If you ever <span class="token builtin class-name">set</span> or change modules or backend configuration <span class="token keyword">for</span> Terraform,
rerun this <span class="token builtin class-name">command</span> to reinitialize your working directory. If you forget, other
commands will detect it and remind you to <span class="token keyword">do</span> so <span class="token keyword">if</span> necessary.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
</div></template>


