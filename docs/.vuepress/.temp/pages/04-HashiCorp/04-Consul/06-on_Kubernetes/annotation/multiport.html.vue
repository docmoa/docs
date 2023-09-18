<template><div><h1 id="multiport" tabindex="-1"><a class="header-anchor" href="#multiport" aria-hidden="true">#</a> Multiport</h1>
<blockquote>
<p>Consul Doc : <a href="https://www.consul.io/docs/k8s/connect#kubernetes-pods-with-multiple-ports" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/k8s/connect#kubernetes-pods-with-multiple-ports<ExternalLinkIcon/></a></p>
</blockquote>
<p><code v-pre>annotation</code>  에 다음과 같이 서비스 이름과 대상 포트를 리스트로 지정합니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">consul.hashicorp.com/connect-inject</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">consul.hashicorp.com/transparent-proxy</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
<span class="token key atrule">consul.hashicorp.com/connect-service</span><span class="token punctuation">:</span> web<span class="token punctuation">,</span>web<span class="token punctuation">-</span>admin
<span class="token key atrule">consul.hashicorp.com/connect-service-port</span><span class="token punctuation">:</span> <span class="token number">8080</span><span class="token punctuation">,</span><span class="token number">9090</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>포트가 서비스 이름과 동일한 순서로 나열되는 순서에 입니다. 즉, 첫 번째 서비스 이름 web은 첫 번째 포트인 8080에 해당합니다. 두 번째 서비스 이름 web-admin은 두 번째 포트인 9090에 해당합니다.</p>
<p>이 서비스를 호출하는 타 서비스의  Upstream은 다음과 같을 수 있습니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">consul.hashicorp.com/connect-service-upstreams</span><span class="token punctuation">:</span> <span class="token string">"web:1234,web-admin:2234"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></div></template>


