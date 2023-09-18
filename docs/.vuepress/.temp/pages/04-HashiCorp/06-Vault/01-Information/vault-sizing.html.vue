<template><div><h1 id="vault-sizing" tabindex="-1"><a class="header-anchor" href="#vault-sizing" aria-hidden="true">#</a> Vault Sizing</h1>
<blockquote>
<p><a href="https://learn.hashicorp.com/tutorials/vault/reference-architecture#deployment-system-requirements" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/vault/reference-architecture#deployment-system-requirements<ExternalLinkIcon/></a></p>
<p>Vault의 Backend-Storage 사용 여부에 따라 구성에 차이가 발생</p>
</blockquote>
<h2 id="vault-raft-self-hosted-storage" tabindex="-1"><a class="header-anchor" href="#vault-raft-self-hosted-storage" aria-hidden="true">#</a> Vault (Raft - self hosted storage)</h2>
<figure><img src="https://amazicworld.com/wp-content/uploads/2020/04/Vault_internal_storage.png" alt="Vault reaches a milestone as HashiCorp releases Vault 1.4 - Amazic World" tabindex="0" loading="lazy"><figcaption>Vault reaches a milestone as HashiCorp releases Vault 1.4 - Amazic World</figcaption></figure>
<table>
<thead>
<tr>
<th style="text-align:left">Size</th>
<th style="text-align:left">CPU</th>
<th style="text-align:left">Memory</th>
<th style="text-align:left">Disk</th>
<th style="text-align:left">Typical Cloud Instance Types</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">최소</td>
<td style="text-align:left">2 core</td>
<td style="text-align:left">4-8 GB RAM</td>
<td style="text-align:left">50 GB</td>
<td style="text-align:left">2 vCPU, 8 GB Mem, 10Gbps Network</td>
</tr>
<tr>
<td style="text-align:left">권장</td>
<td style="text-align:left">4-8 core</td>
<td style="text-align:left">16-32 GB RAM</td>
<td style="text-align:left">200 GB</td>
<td style="text-align:left">4 vCPU, 16 GB Mem, 10Gbps Network</td>
</tr>
</tbody>
</table>
<ul>
<li>HA 구성을 위해 3대 이상의 홀수 구성</li>
</ul>
<h2 id="vault-consul-backend-storage" tabindex="-1"><a class="header-anchor" href="#vault-consul-backend-storage" aria-hidden="true">#</a> Vault - Consul(Backend Storage)</h2>
<figure><img src="https://mktg-content-api-hashicorp.vercel.app/api/assets?product=tutorials&amp;version=main&amp;asset=public%2Fimg%2Fvault%2Fvault-consul-storage-oss-reference-architecture.svg" alt="Vault High Availability with Consul | Vault - HashiCorp Learn" tabindex="0" loading="lazy"><figcaption>Vault High Availability with Consul | Vault - HashiCorp Learn</figcaption></figure>
<h3 id="vault" tabindex="-1"><a class="header-anchor" href="#vault" aria-hidden="true">#</a> Vault</h3>
<table>
<thead>
<tr>
<th style="text-align:left">Size</th>
<th style="text-align:left">CPU</th>
<th style="text-align:left">Memory</th>
<th style="text-align:left">Disk</th>
<th style="text-align:left">Typical Cloud Instance Types</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">최소</td>
<td style="text-align:left">2 core</td>
<td style="text-align:left">4-8 GB RAM</td>
<td style="text-align:left">20 GB</td>
<td style="text-align:left">2 vCPU, 8 GB Mem, 10Gbps Network</td>
</tr>
<tr>
<td style="text-align:left">권장</td>
<td style="text-align:left">4-8 core</td>
<td style="text-align:left">16-32 GB RAM</td>
<td style="text-align:left">100 GB</td>
<td style="text-align:left">4 vCPU, 16 GB Mem, 10Gbps Network</td>
</tr>
</tbody>
</table>
<ul>
<li>HA 구성을 위해 2대 이상 구성</li>
</ul>
<h3 id="consul" tabindex="-1"><a class="header-anchor" href="#consul" aria-hidden="true">#</a> Consul</h3>
<table>
<thead>
<tr>
<th style="text-align:left">Size</th>
<th style="text-align:left">CPU</th>
<th style="text-align:left">Memory</th>
<th style="text-align:left">Disk</th>
<th style="text-align:left">Typical Cloud Instance Types</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">Small</td>
<td style="text-align:left">2 core</td>
<td style="text-align:left">4-8 GB RAM</td>
<td style="text-align:left">25 GB</td>
<td style="text-align:left">2 vCPU, 8 GB Mem, 10Gbps Network</td>
</tr>
<tr>
<td style="text-align:left">Large</td>
<td style="text-align:left">4-8 core</td>
<td style="text-align:left">16-32 GB RAM</td>
<td style="text-align:left">100 GB</td>
<td style="text-align:left">4 vCPU, 16 GB Mem, 10Gbps Network</td>
</tr>
</tbody>
</table>
<ul>
<li>Vault Backend Storage로 사용</li>
<li>HA 구성을 위해 3대 이상 홀수 구성</li>
</ul>
</div></template>


