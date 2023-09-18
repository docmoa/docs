<template><div><h1 id="hashicorp" tabindex="-1"><a class="header-anchor" href="#hashicorp" aria-hidden="true">#</a> HashiCorp</h1>
<h2 id="recent-pages" tabindex="-1"><a class="header-anchor" href="#recent-pages" aria-hidden="true">#</a> Recent pages</h2>
<ul>
  <li
    v-for="page in pages"
    :key="page.key"
  >
    <RouterLink :to="page.path">{{ page.title }}</RouterLink>
    <span v-if="page.frontmatter.date">
      [ {{ (new Date(page.frontmatter.date)).toLocaleString() }} ]
    </span>
  </li>
</ul>
<h2 id="packer" tabindex="-1"><a class="header-anchor" href="#packer" aria-hidden="true">#</a> Packer</h2>
<blockquote>
<p>다양한 플랫폼에 대한 VM, 컨테이너 이미지 생성 자동화 도구</p>
</blockquote>
<ul>
<li>홈페이지 : <a href="https://www.packer.io" target="_blank" rel="noopener noreferrer">https://www.packer.io<ExternalLinkIcon/></a></li>
<li>관련 항목
<ul>
<li>Alicloud / AWS / Azure / GCP / Naver Cloud / Oracle</li>
<li>Hyper-V / OpenStack / QEMU / Vagrant / VirtualBox / VMware</li>
<li>Docker / LXC</li>
</ul>
</li>
</ul>
<h2 id="vagrant" tabindex="-1"><a class="header-anchor" href="#vagrant" aria-hidden="true">#</a> Vagrant</h2>
<blockquote>
<p>로컬 개발환경을 관리하는 프로비저닝 자동화 도구</p>
</blockquote>
<ul>
<li>홈페이지 : <a href="https://www.vagrantup.com" target="_blank" rel="noopener noreferrer">https://www.vagrantup.com<ExternalLinkIcon/></a></li>
<li>관련 항목
<ul>
<li>Virtual Box</li>
<li>Hyper-V</li>
<li>VMware Workstation</li>
<li>Docker</li>
</ul>
</li>
</ul>
<h2 id="terraform" tabindex="-1"><a class="header-anchor" href="#terraform" aria-hidden="true">#</a> Terraform</h2>
<blockquote>
<p>클라우드, 온프레미스, 플랫폼 서비스의 리소스 프로비저닝과 자동화</p>
</blockquote>
<ul>
<li>홈페이지 : <a href="https://www.terraform.io/" target="_blank" rel="noopener noreferrer">https://www.terraform.io/<ExternalLinkIcon/></a></li>
<li>관련 항목
<ul>
<li>Provider Registry : <a href="https://registry.terraform.io/" target="_blank" rel="noopener noreferrer">https://registry.terraform.io/<ExternalLinkIcon/></a></li>
<li>Terraform Cloud : <a href="https://app.terraform.io/" target="_blank" rel="noopener noreferrer">https://app.terraform.io/<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<h2 id="consul" tabindex="-1"><a class="header-anchor" href="#consul" aria-hidden="true">#</a> Consul</h2>
<blockquote>
<p>서비스 디스커버리와 서비스 메시로 네트워크 자동화</p>
</blockquote>
<ul>
<li>홈페이지 : <a href="https://www.consul.io/" target="_blank" rel="noopener noreferrer">https://www.consul.io/<ExternalLinkIcon/></a></li>
<li>관련 항목
<ul>
<li>Service Discovery</li>
<li>K/V</li>
<li>Service Mesh</li>
</ul>
</li>
</ul>
<h2 id="boundary" tabindex="-1"><a class="header-anchor" href="#boundary" aria-hidden="true">#</a> Boundary</h2>
<blockquote>
<p>인증/인가 기반으로 서버와 서비스에 대한 접근관리</p>
</blockquote>
<ul>
<li>홈페이지 : <a href="https://www.boundaryproject.io/" target="_blank" rel="noopener noreferrer">https://www.boundaryproject.io/<ExternalLinkIcon/></a></li>
</ul>
<h2 id="vault" tabindex="-1"><a class="header-anchor" href="#vault" aria-hidden="true">#</a> Vault</h2>
<blockquote>
<p>민감 정보의 관리와 접근에 중앙화된 관리 서비스</p>
</blockquote>
<ul>
<li>홈페이지 : <a href="https://www.vaultproject.io/" target="_blank" rel="noopener noreferrer">https://www.vaultproject.io/<ExternalLinkIcon/></a></li>
<li>관련 항목
<ul>
<li>Secret K/V</li>
<li>SSH OTP</li>
<li>PKI</li>
<li>KMS, KMIP</li>
<li>Data Encryption</li>
<li>Database Credential</li>
<li>Cloud Credential</li>
</ul>
</li>
</ul>
<h2 id="nomad" tabindex="-1"><a class="header-anchor" href="#nomad" aria-hidden="true">#</a> Nomad</h2>
<blockquote>
<p>애플리케이션 배포와 실행을 위한 오케스트레이터</p>
</blockquote>
<ul>
<li>홈페이지 : <a href="https://www.nomadproject.io/" target="_blank" rel="noopener noreferrer">https://www.nomadproject.io/<ExternalLinkIcon/></a></li>
<li>관련 항목
<ul>
<li>Docker / Podman / Containerd / LXC</li>
<li>Java</li>
<li>Exec / Raw_exec</li>
<li>QEMU</li>
<li>Windows IIS</li>
</ul>
</li>
</ul>
<h2 id="waypoint" tabindex="-1"><a class="header-anchor" href="#waypoint" aria-hidden="true">#</a> Waypoint</h2>
<blockquote>
<p>단일 구성으로 컨테이너 환경에 애플리케이션 빌드 및 배포</p>
</blockquote>
<ul>
<li>홈페이지 : <a href="https://www.waypointproject.io/" target="_blank" rel="noopener noreferrer">https://www.waypointproject.io/<ExternalLinkIcon/></a></li>
<li>관련 항목
<ul>
<li>AWS ECS/Lambda/SSM/EC2</li>
<li>Azure Container Instance</li>
<li>Docker</li>
<li>Google Cloud Run</li>
<li>Kubernetes</li>
<li>Nomad</li>
</ul>
</li>
</ul>
<h2 id="etc" tabindex="-1"><a class="header-anchor" href="#etc" aria-hidden="true">#</a> Etc.</h2>
<details class="hint-container details"><summary>Mac에서 한번에 업데이트 받기 예제</summary>
<ul>
<li><code v-pre>BIN_DIR</code>로 지정된 <code v-pre>/Users/my/Tools/bins/</code>는 PATH에 적용된 위치</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>

<span class="token builtin class-name">echo</span> <span class="token string">"&lt;&lt;&lt;&lt;&lt;&lt;&lt; CHECK POINT HASHICORP RELEASE >>>>>>>"</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">RELEASE_URL</span><span class="token operator">=</span><span class="token string">"https://releases.hashicorp.com/"</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">DOWNLOAD_DIR</span><span class="token operator">=</span><span class="token string">"/tmp/hashistack-zip/"</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">BIN_DIR</span><span class="token operator">=</span><span class="token string">"/Users/my/Tools/bins/"</span>

<span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-d</span> <span class="token variable">${DOWNLOAD_DIR}</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
    <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token variable">${DOWNLOAD_DIR}</span>
<span class="token keyword">fi</span>

<span class="token builtin class-name">cd</span> <span class="token variable">${DOWNLOAD_DIR}</span>
<span class="token function">rm</span> <span class="token parameter variable">-rf</span> <span class="token variable">${DOWNLOAD_DIR}</span>/*

<span class="token assign-left variable">UPDATE_LIST</span><span class="token operator">=</span><span class="token string">""</span>

<span class="token keyword">for</span> <span class="token for-or-select variable">SOLUTION</span> <span class="token keyword">in</span> <span class="token string">"terraform"</span> <span class="token string">"consul"</span> <span class="token string">"vault"</span> <span class="token string">"nomad"</span> <span class="token string">"packer"</span> <span class="token string">"consul-terraform-sync"</span> <span class="token string">"waypoint"</span> <span class="token string">"boundary"</span><span class="token punctuation">;</span> <span class="token keyword">do</span>
    <span class="token builtin class-name">echo</span> <span class="token string">"Check - <span class="token variable">${SOLUTION}</span>"</span>
    <span class="token assign-left variable">TAG</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">-fsS</span> https://api.github.com/repos/hashicorp/$<span class="token punctuation">{</span>SOLUTION<span class="token punctuation">}</span>/releases <span class="token punctuation">\</span>
    <span class="token operator">|</span> jq <span class="token parameter variable">-re</span> <span class="token string">'.[] | select(.prerelease != true) | .tag_name'</span> <span class="token punctuation">\</span>
    <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'s/^v\(.*\)$/\1/g'</span> <span class="token punctuation">\</span>
    <span class="token operator">|</span> <span class="token function">sort</span> <span class="token parameter variable">-V</span> <span class="token punctuation">\</span>
    <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-1</span><span class="token variable">)</span></span>

    <span class="token builtin class-name">export</span> <span class="token assign-left variable">CURRENT_VERSION</span><span class="token operator">=</span><span class="token string">"0.0.0"</span>
    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-f</span> <span class="token string">"<span class="token variable">${BIN_DIR}</span>/<span class="token variable">${SOLUTION}</span>"</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
        <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">${SOLUTION}</span> <span class="token operator">=</span> <span class="token string">"consul-terraform-sync"</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
            <span class="token assign-left variable">CURRENT_VERSION</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>$<span class="token punctuation">{</span>SOLUTION<span class="token punctuation">}</span> <span class="token parameter variable">--version</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">'{print $2}'</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-1</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'s/v//'</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'s/+ent//'</span><span class="token variable">)</span></span>
        <span class="token keyword">elif</span> <span class="token punctuation">[</span> <span class="token variable">${SOLUTION}</span> <span class="token operator">=</span> <span class="token string">"boundary"</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
            <span class="token assign-left variable">CURRENT_VERSION</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>$<span class="token punctuation">{</span>SOLUTION<span class="token punctuation">}</span> version <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-4</span> <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-1</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">'{print $3}'</span><span class="token variable">)</span></span>
        <span class="token keyword">else</span>
            <span class="token assign-left variable">CURRENT_VERSION</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>$<span class="token punctuation">{</span>SOLUTION<span class="token punctuation">}</span> version <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">'{print $2}'</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-1</span> <span class="token operator">|</span> <span class="token function">sed</span> <span class="token string">'s/v//'</span><span class="token variable">)</span></span>
        <span class="token keyword">fi</span>
    <span class="token keyword">fi</span>

    <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">$TAG</span> <span class="token operator">!=</span> <span class="token variable">$CURRENT_VERSION</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
        <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable">${SOLUTION}</span> <span class="token operator">=</span> <span class="token string">"consul-terraform-sync"</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
            <span class="token assign-left variable">TAG</span><span class="token operator">=</span><span class="token variable">${TAG}</span>+ent
        <span class="token keyword">fi</span>
        <span class="token builtin class-name">echo</span> <span class="token string">">>>> <span class="token variable">${SOLUTION}</span> update <span class="token variable">${CURRENT_VERSION}</span> --> <span class="token variable">${TAG}</span>"</span>
        <span class="token assign-left variable">ZIP</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${SOLUTION}</span>_<span class="token variable">${TAG}</span>_darwin_amd64.zip"</span>
        <span class="token assign-left variable">DOWNLOAD_URL</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${RELEASE_URL}</span><span class="token variable">${SOLUTION}</span>/<span class="token variable">${TAG}</span>/<span class="token variable">${ZIP}</span>"</span>
        <span class="token function">wget</span> <span class="token parameter variable">-O</span> <span class="token string">"<span class="token variable">${DOWNLOAD_DIR}</span><span class="token variable">${ZIP}</span>"</span> <span class="token variable">${DOWNLOAD_URL}</span>
        <span class="token function">unzip</span> <span class="token parameter variable">-o</span> <span class="token variable">${DOWNLOAD_DIR}</span><span class="token variable">${ZIP}</span> <span class="token parameter variable">-d</span> <span class="token variable">$BIN_DIR</span>
        <span class="token function">rm</span> <span class="token parameter variable">-rf</span> <span class="token variable">${DOWNLOAD_DIR}</span><span class="token variable">${ZIP}</span> 
        <span class="token assign-left variable">UPDATE_LIST</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${UPDATE_LIST}</span> <span class="token variable">${SOLUTION}</span>_<span class="token variable">${CURRENT_VERSION}</span><span class="token entity" title="\t">\t</span>-->><span class="token entity" title="\t">\t</span><span class="token variable">${SOLUTION}</span>_<span class="token variable">${TAG}</span>"</span>
    <span class="token keyword">else</span>
        <span class="token assign-left variable">UPDATE_LIST</span><span class="token operator">=</span><span class="token string">"<span class="token variable">${UPDATE_LIST}</span> <span class="token variable">${SOLUTION}</span>_<span class="token variable">${CURRENT_VERSION}</span>"</span>
    <span class="token keyword">fi</span>
<span class="token keyword">done</span>

<span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token string">"<span class="token variable"><span class="token variable">$(</span><span class="token function">ls</span> <span class="token parameter variable">-A</span> $<span class="token punctuation">{</span>DOWNLOAD_DIR<span class="token punctuation">}</span><span class="token variable">)</span></span>"</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span>
    <span class="token function">mv</span> <span class="token variable">${DOWNLOAD_DIR}</span>* /Users/gs/Tools/bins/
<span class="token keyword">fi</span>

<span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">"<span class="token entity" title="\n">\n</span>==== HASHISTACK VERSION ===="</span>
<span class="token keyword">for</span> <span class="token for-or-select variable">list</span> <span class="token keyword">in</span> <span class="token variable">$UPDATE_LIST</span>
<span class="token keyword">do</span>
    <span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token variable">$list</span>
<span class="token keyword">done</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
</div></template>

<script>
import { defineComponent } from 'vue'
import { usePages } from '@temp/hashicorp'  // pages.js is default filename

export default defineComponent({
  setup() {
    const pages = usePages()
    console.log(pages)
    return { pages }
  },
})
</script>
