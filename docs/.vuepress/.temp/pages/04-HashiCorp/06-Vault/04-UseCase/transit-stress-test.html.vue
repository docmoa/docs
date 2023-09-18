<template><div><h1 id="vault-stress-test" tabindex="-1"><a class="header-anchor" href="#vault-stress-test" aria-hidden="true">#</a> Vault Stress Test</h1>
<blockquote>
<p>wrk github : <a href="https://github.com/wg/wrk" target="_blank" rel="noopener noreferrer">https://github.com/wg/wrk<ExternalLinkIcon/></a><br>
transit : <a href="https://www.vaultproject.io/docs/secrets/transit" target="_blank" rel="noopener noreferrer">https://www.vaultproject.io/docs/secrets/transit<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="enable-transit" tabindex="-1"><a class="header-anchor" href="#enable-transit" aria-hidden="true">#</a> Enable Transit</h2>
<ol>
<li>Transit 시크릿 활성화</li>
</ol>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> transit
Success<span class="token operator">!</span> Enabled the transit secrets engine at: transit/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2">
<li>암호화 키 생성</li>
</ol>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> transit/keys/my-key
Success<span class="token operator">!</span> Data written to: transit/keys/my-key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3">
<li>Test</li>
</ol>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> transit/encrypt/my-key <span class="token assign-left variable">plaintext</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>base64 <span class="token operator">&lt;&lt;&lt;</span> <span class="token string">"my secret data"</span><span class="token variable">)</span></span>

Key           Value
---           -----
ciphertext    vault:v1:8SDd3WHDOjf7mq69CyCqYjBXAiQQAVZRkFM13ok481zoCmHnSeDX9vyf7w<span class="token operator">==</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="api-check" tabindex="-1"><a class="header-anchor" href="#api-check" aria-hidden="true">#</a> API Check</h2>
<div class="hint-container warning">
<p class="hint-container-title">경고</p>
<ul>
<li>헤더에 <code v-pre>X-Vault-Token</code> 필요</li>
<li><code v-pre>plaintext</code> 데이터의 값은 base64 인코딩 필요</li>
</ul>
</div>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token punctuation">\</span>
    <span class="token parameter variable">-H</span> <span class="token string">"X-Vault-Token: s.HeeRXjkW1KJhF8ofQsglI9yw"</span> <span class="token punctuation">\</span>
    <span class="token parameter variable">-X</span> POST <span class="token punctuation">\</span>
    <span class="token parameter variable">-d</span> <span class="token string">"{<span class="token entity" title="\&quot;">\"</span>plaintext<span class="token entity" title="\&quot;">\"</span>:<span class="token entity" title="\&quot;">\"</span>dGhlIHF1aWNrIGJyb3duIGZveAo=<span class="token entity" title="\&quot;">\"</span>}"</span> <span class="token punctuation">\</span>
    http://192.168.60.103:8200/v1/transit/encrypt/my-key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="부하테스트" tabindex="-1"><a class="header-anchor" href="#부하테스트" aria-hidden="true">#</a> 부하테스트</h2>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>wrk 사용시 Vault Transit은 POST를 사용하므로 스크립트 작성이 필요</p>
</div>
<h3 id="_1-암호화-테스트" tabindex="-1"><a class="header-anchor" href="#_1-암호화-테스트" aria-hidden="true">#</a> 1. 암호화 테스트</h3>
<ul>
<li>
<p>스크립트 작성</p>
<div class="language-lua line-numbers-mode" data-ext="lua"><pre v-pre class="language-lua"><code><span class="token comment">-- enc.lua</span>
wrk<span class="token punctuation">.</span>method <span class="token operator">=</span> <span class="token string">"POST"</span>
wrk<span class="token punctuation">.</span>body   <span class="token operator">=</span> <span class="token string">"{\"plaintext\":\"dGhlIHF1aWNrIGJyb3duIGZveAo=\"}"</span>
wrk<span class="token punctuation">.</span>headers<span class="token punctuation">[</span><span class="token string">"X-Vault-Token"</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">"s.HeeRXjkW1KJhF8ofQsglI9yw"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>실행</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>wrk <span class="token parameter variable">-c</span> <span class="token number">240</span> <span class="token parameter variable">-t</span> <span class="token number">8</span> <span class="token parameter variable">-d</span> 10s <span class="token parameter variable">-s</span> enc.lua http://192.168.60.103:8200/v1/transit/encrypt/my-key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_2-복호화-테스트" tabindex="-1"><a class="header-anchor" href="#_2-복호화-테스트" aria-hidden="true">#</a> 2. 복호화 테스트</h3>
<ul>
<li>
<p>스크립트 작성</p>
<div class="language-lua line-numbers-mode" data-ext="lua"><pre v-pre class="language-lua"><code><span class="token comment">-- dec.lua</span>
wrk<span class="token punctuation">.</span>method <span class="token operator">=</span> <span class="token string">"POST"</span>
wrk<span class="token punctuation">.</span>body   <span class="token operator">=</span> <span class="token string">"{\"ciphertext\":\"vault:v1:I2JoSCrTduIDSI7BVIsFppwUop+YHFHejUbaHGeC7sb19CVZaYHEwicuJaXHxP/4\"}"</span>
wrk<span class="token punctuation">.</span>headers<span class="token punctuation">[</span><span class="token string">"X-Vault-Token"</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token string">"s.HeeRXjkW1KJhF8ofQsglI9yw"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>실행</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>wrk <span class="token parameter variable">-c</span> <span class="token number">360</span> <span class="token parameter variable">-t</span> <span class="token number">12</span> <span class="token parameter variable">-d</span> 60s <span class="token parameter variable">-s</span> ./dec.lua http://192.168.60.103:8200/v1/transit/decrypt/my-key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
</div></template>


