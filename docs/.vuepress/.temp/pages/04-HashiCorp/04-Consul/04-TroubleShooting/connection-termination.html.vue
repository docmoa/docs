<template><div><h1 id="connection-termination" tabindex="-1"><a class="header-anchor" href="#connection-termination" aria-hidden="true">#</a> Connection termination</h1>
<blockquote>
<ul>
<li>blog : <a href="https://medium.com/expedia-group-tech/all-about-istio-proxy-5xx-issues-e0221b29e692" target="_blank" rel="noopener noreferrer">https://medium.com/expedia-group-tech/all-about-istio-proxy-5xx-issues-e0221b29e692<ExternalLinkIcon/></a></li>
<li>issue : <a href="https://github.com/envoyproxy/envoy/issues/14981" target="_blank" rel="noopener noreferrer">https://github.com/envoyproxy/envoy/issues/14981<ExternalLinkIcon/></a></li>
<li>envoy proxy error code : <a href="https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/response_code_details" target="_blank" rel="noopener noreferrer">https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/response_code_details<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<h2 id="로그" tabindex="-1"><a class="header-anchor" href="#로그" aria-hidden="true">#</a> 로그</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token punctuation">[</span>debug<span class="token punctuation">]</span> <span class="token punctuation">[</span>router<span class="token punctuation">]</span> upstream reset: reset reason: connection termination, transport failure reason.
<span class="token punctuation">[</span>debug<span class="token punctuation">]</span> <span class="token punctuation">[</span>http<span class="token punctuation">]</span> Sending <span class="token builtin class-name">local</span> reply with details upstream_reset_before_response_started<span class="token punctuation">(</span>connection termination<span class="token punctuation">)</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="현상" tabindex="-1"><a class="header-anchor" href="#현상" aria-hidden="true">#</a> 현상</h2>
<ul>
<li>upstream_reset_before_response_started : The upstream connection was reset before a response was started This may include further details about the cause of the disconnect.</li>
</ul>
<h2 id="connection-termination-1" tabindex="-1"><a class="header-anchor" href="#connection-termination-1" aria-hidden="true">#</a> connection termination</h2>
<ul>
<li>
<p>원인 1: Envoy에서 TCP 연결(FIN)이 닫는 현상 보고됨 - Keepalive time 이슈</p>
</li>
<li>
<p>해결 1 - 1: Keepalive time을 끄거나</p>
</li>
<li>
<p>해결 1 - 2: max_requests_per_connection 을 1로 설정</p>
</li>
<li>
<p>해결 1 - 3: Keepalive interval을 짧게 (10초)</p>
</li>
<li>
<p>원인 2 : Kubernetes 내부 기본 TCP 계층 4 연결 부하 분산의 제한, (e.g. tomcat - maxKeepAliveRequests)</p>
</li>
<li>
<p>해결 2 - 1: 애플리케이션의 KeepAlive를 끔</p>
</li>
<li>
<p>원인 3 : 외부 서비스에 대해 요청시 Envoy Proxy는 애플리케이션이 연결을 닫으려 하지 않는 한 영구적으로 연결을 닫지 않으므로 신규요청 발생시 IPSET이 만료되는 (1시간) 시간이 지나 DNS 확인 없이 동일한 IP로 요청하는 경우</p>
</li>
<li>
<p>해결 3 - 1: Keepalive time을 끄거나</p>
</li>
<li>
<p>해결 3 - 2: 시간 초과 값을 늘임</p>
</li>
<li>
<p>해결 3 - 3: dns_refresh_rate 간격을 짧게 (300초)</p>
</li>
</ul>
</div></template>


