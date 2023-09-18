<template><div><h1 id="terraform-provider-번들링" tabindex="-1"><a class="header-anchor" href="#terraform-provider-번들링" aria-hidden="true">#</a> Terraform Provider - 번들링</h1>
<blockquote>
<p><a href="https://github.com/hashicorp/terraform/tree/main/tools/terraform-bundle" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/terraform/tree/main/tools/terraform-bundle<ExternalLinkIcon/></a><br>
Terraform Enterprise에서 동작하는 기능입니다.</p>
</blockquote>
<p>Airgap 환경에서 사용할 특정 버전의 Terraform과 여러 제공자 플러그인을 모두 포함하는 zip 파일 인 &quot;번들 아카이브&quot;를 생성하는 툴을 사용합니다. 일반적으로 Terraform init을 통해 특정 구성 작업에 필요한 플러그인을 다운로드하고 설치하지만 Airgap 환경에서는 공식 플러그인 저장소에 액세스 할 수 없는 경우가 발생합니다. Bundle 툴을 사용하여 Terraform 버전과 선택한 공급자를 모두 설치하기 위해 대상 시스템에 압축을 풀 수있는 zip 파일이 생성되므로 즉석 플러그인 설치가 필요하지 않습니다.</p>
<div class="hint-container warning">
<p class="hint-container-title">주의</p>
<p>번들로 작성된 zip파일을 url로 등록하기 때문에 번들을 다운받을 수 있는 웹서버나 넥서스 같은 원격 저장소가 필요합니다.</p>
</div>
<h2 id="build-툴-준비" tabindex="-1"><a class="header-anchor" href="#build-툴-준비" aria-hidden="true">#</a> build 툴 준비</h2>
<ul>
<li><a href="https://github.com/hashicorp/terraform/tree/main/tools/terraform-bundle" target="_blank" rel="noopener noreferrer">번들 구성 및 빌드 안내<ExternalLinkIcon/></a>에 따라 <code v-pre>terraform-bundle</code>을 빌드합니다.</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Ubuntu</span>
<span class="token comment"># Install Go: https://github.com/golang/go/wiki/Ubuntu</span>
$ <span class="token function">sudo</span> add-apt-repository ppa:longsleep/golang-backports
$ <span class="token function">sudo</span> <span class="token function">apt</span> update <span class="token parameter variable">-y</span>
$ <span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> golang-go <span class="token parameter variable">-y</span>
<span class="token comment">#sudo apt install golang-1.14-go -y</span>

<span class="token comment"># Build terraform-bundle from a release tag that matches your TF version</span>
<span class="token comment"># Otherwise you might get an error like:</span>
<span class="token comment"># "Failed to read config: this version of terraform-bundle can only build bundles for . . ."</span>
$ <span class="token function">git</span> clone https://github.com/hashicorp/terraform.git
$ <span class="token builtin class-name">cd</span> terraform
$ go <span class="token function">install</span> ./tools/terraform-bundle

<span class="token comment">#verify that terraform-bundle tool is there</span>
$ <span class="token function">ls</span> ~/go/bin/ 
$ <span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token variable">${<span class="token environment constant">PATH</span>}</span><span class="token builtin class-name">:</span><span class="token environment constant">$HOME</span>/go/bin/
$ terraform-bundle <span class="token parameter variable">--version</span>
<span class="token number">0.13</span>.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="bundle-용-hcl-파일-구성-및-생성" tabindex="-1"><a class="header-anchor" href="#bundle-용-hcl-파일-구성-및-생성" aria-hidden="true">#</a> bundle 용 hcl 파일 구성 및 생성</h2>
<p>bundle 구성할 명세를 hcl로 작성합니다. (e.g. tf-bundle.hcl)</p>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>공식(Official) 프로바이더의 경우 <code v-pre>source</code> 정의를 생략할 수 있습니다. 그렇지 않는 경우에는 반드시 <code v-pre>source</code>에 대한 정의가 필요합니다.</p>
</div>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">terraform</span> <span class="token punctuation">{</span>
  <span class="token comment"># Version of Terraform to include in the bundle. An exact version number is required.</span>
  <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"0.15.4"</span>
<span class="token punctuation">}</span>

<span class="token comment"># Define which provider plugins are to be included</span>
<span class="token keyword">providers</span> <span class="token punctuation">{</span>
  <span class="token property">null</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 3.1.0"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">time</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 0.7.1"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">random</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 3.1.0"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">template</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 2.2.0"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">tfe</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 0.25.3"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">vsphere</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 1.26.0"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">vault</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 2.20.0"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">consul</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 2.12.0"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">kubernetes</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 2.2.0"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">ad</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"=0.4.2"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">openstack</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 1.42.0"</span><span class="token punctuation">]</span>
    <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"terraform-provider-openstack/openstack"</span>
  <span class="token punctuation">}</span>
  <span class="token property">nsxt</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 3.1.1"</span><span class="token punctuation">]</span>
    <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"vmware/nsxt"</span>
  <span class="token punctuation">}</span>
  <span class="token property">vra7</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">versions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"= 3.0.2"</span><span class="token punctuation">]</span>
    <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"vmware/vra7"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>번들 생성은 다음과 같이 커맨드로 실행 합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform-bundle package <span class="token parameter variable">-os</span><span class="token operator">=</span>linux <span class="token parameter variable">-arch</span><span class="token operator">=</span>amd64 tf-bundle.hcl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>이 작업을 통해 Terraform Enterprise에서 기존 Terraform을 다운로드 받고 Provider를 다운로드 받던 동작을 미리 수행한 번들이 생성 됩니다.</p>
<p>생성된 번들 파일(zip)은 TFE Admin Console을 통해 적용</p>
<ul>
<li>TFE Console 에서 Site Admin으로 이동</li>
<li>Terraform Versions &gt; Add terraform version</li>
<li>Version 이름, Url, Checksum을 기입하고 저장<br>
Checksum e.g. : <code v-pre>shasum -a256 ./terraform_0.15.4-bundle2021060202_linux_amd64.zip</code></li>
</ul>
</div></template>


