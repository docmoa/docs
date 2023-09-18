<template><div><h1 id="nomad-ui에-consul과-vault-링크-추가" tabindex="-1"><a class="header-anchor" href="#nomad-ui에-consul과-vault-링크-추가" aria-hidden="true">#</a> Nomad UI에 Consul과 Vault 링크 추가</h1>
<blockquote>
<p><a href="https://www.nomadproject.io/docs/configuration/ui" target="_blank" rel="noopener noreferrer">https://www.nomadproject.io/docs/configuration/ui<ExternalLinkIcon/></a></p>
</blockquote>
<p>Nomad ui 설정에 다음과 같이 Consul과 Vault의 링크를 추가할 수 있습니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">ui</span> <span class="token punctuation">{</span>
  <span class="token property">enabled</span> <span class="token punctuation">=</span>  <span class="token boolean">true</span>

  <span class="token keyword">consul</span> <span class="token punctuation">{</span>
    <span class="token property">ui_url</span> <span class="token punctuation">=</span> <span class="token string">"https://consul.example.com:8500/ui"</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">vault</span> <span class="token punctuation">{</span>
    <span class="token property">ui_url</span> <span class="token punctuation">=</span> <span class="token string">"https://vault.example.com:8200/ui"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="@source/04-HashiCorp/07-Nomad/02-Config/image/nomad-custom-ui-link.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</div></template>


