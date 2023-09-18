<template><div><h1 id="kmip-mongodb" tabindex="-1"><a class="header-anchor" href="#kmip-mongodb" aria-hidden="true">#</a> KMIP - MongoDB</h1>
<blockquote>
<p>Enterprise 기능</p>
</blockquote>
<h2 id="vault-dev-mode-run-option" tabindex="-1"><a class="header-anchor" href="#vault-dev-mode-run-option" aria-hidden="true">#</a> Vault - dev mode run (Option)</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token assign-left variable">VAULT_UI</span><span class="token operator">=</span>true vault server -dev-root-token-id<span class="token operator">=</span>root <span class="token parameter variable">-dev</span> -log-level<span class="token operator">=</span>trace

<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span><span class="token string">"http://127.0.0.1:8200"</span>
<span class="token builtin class-name">echo</span> <span class="token string">"export VAULT_ADDR=<span class="token variable">$VAULT_ADDR</span>"</span> <span class="token operator">>></span> /root/.bashrc
vault status
vault login root
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="kmip-구성" tabindex="-1"><a class="header-anchor" href="#kmip-구성" aria-hidden="true">#</a> KMIP 구성</h2>
<p>KMIP 활성화</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> kmip

Success<span class="token operator">!</span> Enabled the kmip secrets engine at: kmip/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>KMIP Listner 구성 (5696은 표준 기본 포트 입니다.)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> kmip/config <span class="token assign-left variable">listen_addrs</span><span class="token operator">=</span><span class="token number">0.0</span>.0.0:5696 <span class="token punctuation">\</span>
  <span class="token assign-left variable">tls_ca_key_type</span><span class="token operator">=</span><span class="token string">"rsa"</span> <span class="token punctuation">\</span>
  <span class="token assign-left variable">tls_ca_key_bits</span><span class="token operator">=</span><span class="token number">2048</span>
  
Success<span class="token operator">!</span> Data written to: kmip/config
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>MongoDB에 전달할 KMIP CA 인증서를 저장</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> <span class="token parameter variable">-format</span> json kmip/ca <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> .data.ca_pem <span class="token operator">></span> ca.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>샘플로 &quot;HashiCup&quot; 앱의 관리 개체에 대한 범위를 생성</p>
<ul>
<li>범위는 KMIP 관리 객체를 여러 명명된 버킷으로 분할합니다. (여기서는 &quot;HashiCup&quot;)</li>
<li>버킷 하위의 Role(역할)은 버킷 내에서 관리되며 다양한 허용 KMIP 작업을 할당할 수 있습니다. 여기서는 MongoDB가 수행할 수 있는 허용된 KMIP 작업을 지정하는 &quot;payment&quot; 역할도 생성합니다.</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> kmip/scope/hashicups
Success<span class="token operator">!</span> Data written to: kmip/scope/hashicups

$ vault <span class="token function">write</span> kmip/scope/hashicups/role/payments <span class="token assign-left variable">operation_all</span><span class="token operator">=</span>true
Success<span class="token operator">!</span> Data written to: kmip/scope/hashicups/role/payments
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>리프 인증서와 개인 키 생성</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-format</span><span class="token operator">=</span>json <span class="token punctuation">\</span>
  kmip/scope/hashicups/role/payments/credential/generate <span class="token punctuation">\</span>
  <span class="token assign-left variable">format</span><span class="token operator">=</span>pem <span class="token operator">></span> credential.json
$ jq <span class="token parameter variable">-r</span> .data.certificate <span class="token operator">&lt;</span> credential.json <span class="token operator">></span> cert.pem
$ jq <span class="token parameter variable">-r</span> .data.private_key <span class="token operator">&lt;</span> credential.json <span class="token operator">></span> key.pem
$ <span class="token function">cat</span> cert.pem key.pem <span class="token operator">></span> client.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="mongodb-구성" tabindex="-1"><a class="header-anchor" href="#mongodb-구성" aria-hidden="true">#</a> MongoDB 구성</h2>
<p>KMIP을 사용하기 위한 옵션과 함께 mongoDB를 시작</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ mongod <span class="token parameter variable">--dbpath</span> /var/lib/mongodb <span class="token punctuation">\</span>
  <span class="token parameter variable">--logpath</span> /var/log/mongodb/mongo.log <span class="token punctuation">\</span>
  <span class="token parameter variable">--enableEncryption</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">--kmipServerName</span> localhost <span class="token punctuation">\</span>
  <span class="token parameter variable">--kmipPort</span> <span class="token number">5696</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">--kmipServerCAFile</span> ca.pem <span class="token punctuation">\</span>
  <span class="token parameter variable">--kmipClientCertificateFile</span> client.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>KMIP 적용 확인</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">cat</span> /var/log/mongodb/mongo.log  <span class="token operator">|</span> <span class="token function">grep</span> KMIP <span class="token operator">|</span> jq
<span class="token punctuation">{</span>
  <span class="token string">"t"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
    <span class="token string">"<span class="token variable">$date</span>"</span><span class="token builtin class-name">:</span> <span class="token string">"2021-07-20T02:03:34.031+00:00"</span>
  <span class="token punctuation">}</span>,
  <span class="token string">"s"</span><span class="token builtin class-name">:</span> <span class="token string">"I"</span>,
  <span class="token string">"c"</span><span class="token builtin class-name">:</span> <span class="token string">"STORAGE"</span>,
  <span class="token string">"id"</span><span class="token builtin class-name">:</span> <span class="token number">24199</span>,
  <span class="token string">"ctx"</span><span class="token builtin class-name">:</span> <span class="token string">"initandlisten"</span>,
  <span class="token string">"msg"</span><span class="token builtin class-name">:</span> <span class="token string">"Created KMIP key"</span>,
  <span class="token string">"attr"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
    <span class="token string">"keyId"</span><span class="token builtin class-name">:</span> <span class="token string">"agZTSeeJyQjVOKJgn3xeGJ6Va8sXfRXP"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="test" tabindex="-1"><a class="header-anchor" href="#test" aria-hidden="true">#</a> TEST</h2>
<p>샘플 데이터 삽입</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ mongo

MongoDB Enterprise <span class="token operator">></span> db.examples.insertOne<span class="token punctuation">(</span>
  <span class="token punctuation">{</span>
    name: <span class="token string">"sue"</span>,
    age: <span class="token number">26</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">)</span>

MongoDB Enterprise <span class="token operator">></span> <span class="token builtin class-name">exit</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>결과 확인</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Collection WiredTiger 파일에 기록된 정보</span>
<span class="token comment"># KMIP 적용 전</span>
$ <span class="token function">cat</span> /var/lib/mongodb/collection-7*
A�<span class="token comment">#�\�D���1_id`�1�g�~R=��namesueage:@4�D��8�����D��2</span>

<span class="token comment"># KMIP 적용 후</span>
$ <span class="token function">cat</span> /var/lib/mongodb/collection-7*
A�<span class="token comment">#�\</span>
     ��$�<span class="token operator">|</span>��H�<span class="token punctuation">}</span>l�����<span class="token punctuation">(</span>ں?����s�ɛocD��<span class="token punctuation">\</span>K�<span class="token operator">></span>J������m��N��<span class="token comment">#����_�������К</span>
�X���ϩ<span class="token punctuation">}</span>_�z6��L�nQ���pQ�sO�<span class="token punctuation">]</span>�0���h_�     <span class="token comment">#�Ȟ�߳2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


