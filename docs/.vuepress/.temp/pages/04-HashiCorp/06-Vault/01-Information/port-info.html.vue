<template><div><h1 id="vault-listen-address-port" tabindex="-1"><a class="header-anchor" href="#vault-listen-address-port" aria-hidden="true">#</a> Vault Listen Address &amp; Port</h1>
<blockquote>
<p><a href="https://learn.hashicorp.com/tutorials/vault/reference-architecture#network-connectivity" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/vault/reference-architecture#network-connectivity<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="vault-포트" tabindex="-1"><a class="header-anchor" href="#vault-포트" aria-hidden="true">#</a> Vault 포트</h2>
<h3 id="tcp" tabindex="-1"><a class="header-anchor" href="#tcp" aria-hidden="true">#</a> TCP</h3>
<ul>
<li>Url : <a href="https://www.vaultproject.io/docs/configuration/listener/tcp#tcp-listener-parameters" target="_blank" rel="noopener noreferrer">https://www.vaultproject.io/docs/configuration/listener/tcp#tcp-listener-parameters<ExternalLinkIcon/></a>
<ul>
<li>address default : <code v-pre>127.0.0.1:8200</code></li>
<li>cluster_address default : <code v-pre>127.0.0.1:8201</code></li>
</ul>
</li>
</ul>
<table>
<thead>
<tr>
<th style="text-align:left">Source</th>
<th style="text-align:left">Destination</th>
<th style="text-align:left">port</th>
<th style="text-align:left">protocol</th>
<th style="text-align:left">Direction</th>
<th style="text-align:left">Purpose</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">외부 호출지점에서</td>
<td style="text-align:left">Vault 서버로</td>
<td style="text-align:left">8200</td>
<td style="text-align:left">tcp</td>
<td style="text-align:left">인바운드</td>
<td style="text-align:left">Vault API</td>
</tr>
<tr>
<td style="text-align:left">Vault 서버 에서</td>
<td style="text-align:left">Vault 서버로</td>
<td style="text-align:left">8200</td>
<td style="text-align:left">tcp</td>
<td style="text-align:left">양방향</td>
<td style="text-align:left">Cluster bootstrapping</td>
</tr>
<tr>
<td style="text-align:left">Vault 서버 에서</td>
<td style="text-align:left">Vault 서버로</td>
<td style="text-align:left">8201</td>
<td style="text-align:left">tcp</td>
<td style="text-align:left">양방향</td>
<td style="text-align:left">Raft, replication, request forwarding</td>
</tr>
</tbody>
</table>
<h3 id="listening-on-multiple-interfaces" tabindex="-1"><a class="header-anchor" href="#listening-on-multiple-interfaces" aria-hidden="true">#</a> Listening on Multiple Interfaces</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>listener <span class="token string">"tcp"</span> <span class="token punctuation">{</span>
  <span class="token property">address</span> <span class="token punctuation">=</span> <span class="token string">"127.0.0.1:8200"</span>
<span class="token punctuation">}</span>

listener <span class="token string">"tcp"</span> <span class="token punctuation">{</span>
  <span class="token property">address</span> <span class="token punctuation">=</span> <span class="token string">"10.0.0.5:8200"</span>
<span class="token punctuation">}</span>

<span class="token comment"># Advertise the non-loopback interface</span>
<span class="token property">api_addr</span> <span class="token punctuation">=</span> <span class="token string">"https://10.0.0.5:8200"</span>
<span class="token property">cluster_addr</span> <span class="token punctuation">=</span> <span class="token string">"https://10.0.0.5:8201"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="listening-on-all-ipv6-ipv4-interfaces" tabindex="-1"><a class="header-anchor" href="#listening-on-all-ipv6-ipv4-interfaces" aria-hidden="true">#</a> Listening on all IPv6 &amp; IPv4 Interfaces</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>listener <span class="token string">"tcp"</span> <span class="token punctuation">{</span>
  <span class="token property">address</span>         <span class="token punctuation">=</span> <span class="token string">"[::]:8200"</span>
  <span class="token property">cluster_address</span> <span class="token punctuation">=</span> <span class="token string">"[::]:8201"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="listening-to-specific-ipv6-address" tabindex="-1"><a class="header-anchor" href="#listening-to-specific-ipv6-address" aria-hidden="true">#</a> Listening to specific IPv6 address</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>listener <span class="token string">"tcp"</span> <span class="token punctuation">{</span>
  <span class="token property">address</span>         <span class="token punctuation">=</span> <span class="token string">"[2001:1c04:90d:1c00:a00:27ff:fefa:58ec]:8200"</span>
  <span class="token property">cluster_address</span> <span class="token punctuation">=</span> <span class="token string">"[2001:1c04:90d:1c00:a00:27ff:fefa:58ec]:8201"</span>
<span class="token punctuation">}</span>

<span class="token comment"># Advertise the non-loopback interface</span>
<span class="token property">api_addr</span> <span class="token punctuation">=</span> <span class="token string">"https://[2001:1c04:90d:1c00:a00:27ff:fefa:58ec]:8200"</span>
<span class="token property">cluster_addr</span> <span class="token punctuation">=</span> <span class="token string">"https://[2001:1c04:90d:1c00:a00:27ff:fefa:58ec]:8201"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


