<template><div><h1 id="nomad-인증서-생성" tabindex="-1"><a class="header-anchor" href="#nomad-인증서-생성" aria-hidden="true">#</a> Nomad 인증서 생성</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>공식 사이트에 consul 인증서 생성 가이드는 있는데 Nomad 인증서 생성가이드는<br>
Show Terminal을 들어가야 볼 수 있기때문에 귀찮음을 해결하기 위해 공유합니다.</p>
</div>
<h2 id="nomad-인증서-생성-1" tabindex="-1"><a class="header-anchor" href="#nomad-인증서-생성-1" aria-hidden="true">#</a> Nomad 인증서 생성</h2>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>consul tls ca create -domain=nomad -days 3650

consul tls cert create -domain=nomad -dc=global  -server -days 3650

consul tls cert create -domain=nomad -dc=global  -client -days 3650

consul tls cert create -domain=nomad -dc=global  -cli -days 3650
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nomad-env-설정" tabindex="-1"><a class="header-anchor" href="#nomad-env-설정" aria-hidden="true">#</a> Nomad env 설정</h2>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>export NOMAD_CACERT="${HOME}/tls/nomad-agent-ca.pem"

export NOMAD_CLIENT_CERT="${HOME}/tls/global-cli-nomad-0.pem"

export NOMAD_CLIENT_KEY="${HOME}/tls/global-cli-nomad-0-key.pem"

export NOMAD_ADDR="https://127.0.0.1:4646"
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


