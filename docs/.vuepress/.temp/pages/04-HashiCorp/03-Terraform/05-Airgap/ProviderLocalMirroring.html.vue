<template><div><h1 id="terraform-provider-로컬-미러링" tabindex="-1"><a class="header-anchor" href="#terraform-provider-로컬-미러링" aria-hidden="true">#</a> Terraform Provider - 로컬 미러링</h1>
<blockquote>
<p><a href="https://www.terraform.io/docs/cli/config/config-file.html#provider_installation" target="_blank" rel="noopener noreferrer">https://www.terraform.io/docs/cli/config/config-file.html#provider_installation<ExternalLinkIcon/></a></p>
</blockquote>
<p>Terraform CLI를 사용할 때, 기본적으로 코드 상에서 사용하는 플러그인은 <a href="http://registry.terraform.io/" target="_blank" rel="noopener noreferrer">registry.terraform.io<ExternalLinkIcon/></a>에서 다운로드 받게 되어 있습니다.</p>
<p>하지만 네트워크이 느리거나 폐쇄망인 경우, 직접 다운로드가 아닌 다른 방법으로 프로바이더를 사용할 수 있습니다.</p>
<p>CLI 설정 파일에 명시적으로 설정하는 방법과 설정하지 않고 사용하는 방법이 있습니다.</p>
<p>상대적으로 설정이 간편한 filesystem_mirror 설정 방법은 다음과 같습니다.</p>
<ol>
<li>
<p>Terraform 사용 환경에 맞춰 terraform configuration 파일 구성하기</p>
<ul>
<li>Windows : 사용자의 %APPDATA% 디렉토리 상에 terraform.rc</li>
<li>Linux/MacOS : 사용자 홈 디렉토리 상에 .terraformrc</li>
</ul>
</li>
<li>
<p>다음 처럼 'provider_installation' 설정하기</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>provider_installation {
  filesystem_mirror {
    path    = "/usr/share/terraform/providers"
    include = ["*/*"] # registry.terrafom.io/hashicorp/*
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>대상 디렉토리 설정하기</p>
<ul>
<li>
<p>예를 들어 aws provider는 다음과 같이 코드 상에 사용</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.36.0"
    }
  }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>지정된 경로 상에 다음과 같은 HOSTNAME/NAMESPACE/TYPE/VERSION/TARGET 형태로 디렉토리 구조를 지정</p>
<ul>
<li>HOSTNAME = &quot;<a href="http://registry.terraform.io/" target="_blank" rel="noopener noreferrer">registry.terraform.io<ExternalLinkIcon/></a>&quot;, NAMESPACE=&quot;hashicorp&quot;, TYPE=&quot;aws&quot;, VERSION=&quot;3.36.0&quot;, TARGET은 클라이언트 환경에 대한 것으로 현재 실행 환경에 따라 &quot;darwin_amd64&quot;, &quot;linux_arm&quot; &quot;windows_amd64&quot; 등으로 설정하시면 됩니다.</li>
</ul>
</li>
<li>
<p>사용하시고자 하는 프로바이어더의 다운로드는 다음 링크에서 가능합니다. <a href="https://releases.hashicorp.com/" target="_blank" rel="noopener noreferrer">https://releases.hashicorp.com<ExternalLinkIcon/></a></p>
</li>
</ul>
</li>
</ol>
</div></template>


