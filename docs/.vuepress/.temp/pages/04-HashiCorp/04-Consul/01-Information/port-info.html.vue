<template><div><h1 id="consul-port" tabindex="-1"><a class="header-anchor" href="#consul-port" aria-hidden="true">#</a> Consul Port</h1>
<blockquote>
<p><a href="https://www.consul.io/docs/install/ports" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/install/ports<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="consul-포트" tabindex="-1"><a class="header-anchor" href="#consul-포트" aria-hidden="true">#</a> Consul 포트</h2>
<figure><img src="@source/04-HashiCorp/04-Consul/01-Information/image/consul-arch-420ce04a.png" alt="arc" tabindex="0" loading="lazy"><figcaption>arc</figcaption></figure>
<h3 id="port-table" tabindex="-1"><a class="header-anchor" href="#port-table" aria-hidden="true">#</a> Port Table</h3>
<table>
<thead>
<tr>
<th style="text-align:left">Use</th>
<th style="text-align:left">Default Ports</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">DNS (TCP and UDP)</td>
<td style="text-align:left">8600</td>
</tr>
<tr>
<td style="text-align:left">HTTP (TCP Only)</td>
<td style="text-align:left">8500</td>
</tr>
<tr>
<td style="text-align:left">HTTPS (TCP Only)</td>
<td style="text-align:left">disabled (8501)*</td>
</tr>
<tr>
<td style="text-align:left">gRPC (TCP Only)</td>
<td style="text-align:left">disabled (8502)*</td>
</tr>
<tr>
<td style="text-align:left">LAN Serf (TCP and UDP)</td>
<td style="text-align:left">8301</td>
</tr>
<tr>
<td style="text-align:left">Wan Serf (TCP and UDP)</td>
<td style="text-align:left">8302</td>
</tr>
<tr>
<td style="text-align:left">server (TCP Only)</td>
<td style="text-align:left">8300</td>
</tr>
<tr>
<td style="text-align:left">Sidecar Proxy Min: 자동으로 할당된 사이드카 서비스 등록에 사용할 포함 최소 포트 번호</td>
<td style="text-align:left">21000</td>
</tr>
<tr>
<td style="text-align:left">Sidecar Proxy Max: 자동으로 할당된 사이드카 서비스 등록에 사용할 포괄적인 최대 포트 번호</td>
<td style="text-align:left">21255</td>
</tr>
</tbody>
</table>
<h3 id="port-정보" tabindex="-1"><a class="header-anchor" href="#port-정보" aria-hidden="true">#</a> Port 정보</h3>
<ul>
<li>DNS : DNS 쿼리 포트</li>
<li>HTTP API : API 요청 포트</li>
<li>HTTPS API (옵션) : API 요청 포트로 TLS 적용시 활성화</li>
<li>gRPC API (옵션) : xDS API를 Envoy 프록시에서 연결하는데 사용되며, 서비스메시 구성시 필수</li>
<li>Serf LAN : Gossip 프로토콜을 위한 포트로 LAN 구성에서 사용</li>
<li>Serf WAN : Gossip 프로토콜을 위한 포트로 WAN 구성(Federation)에서 사용</li>
<li>Server RPC : Consul Client가 Server에 연결하기위한 포트</li>
</ul>
</div></template>


