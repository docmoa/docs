<template><div><h1 id="nomad-sizing" tabindex="-1"><a class="header-anchor" href="#nomad-sizing" aria-hidden="true">#</a> Nomad Sizing</h1>
<blockquote>
<p><a href="https://learn.hashicorp.com/tutorials/nomad/production-reference-architecture-vm-with-consul" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/nomad/production-reference-architecture-vm-with-consul<ExternalLinkIcon/></a></p>
<p>Nomad는 Server/Client 구조로 구성되며, Client의 경우 자원사용량이 매우 미미하므로 자원산정은 Server를 기준으로 산정</p>
</blockquote>
<table>
<thead>
<tr>
<th style="text-align:left">Size</th>
<th style="text-align:left">CPU</th>
<th style="text-align:left">Memory</th>
<th style="text-align:left">Disk Capacity</th>
<th style="text-align:left">Typical Cloud Instance Types</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">최소</td>
<td style="text-align:left">2-4 core</td>
<td style="text-align:left">8-16 GB RAM</td>
<td style="text-align:left">50 GB</td>
<td style="text-align:left"><strong>AWS</strong>: m5.large, m5.xlarge</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"><strong>Azure</strong>: Standard_D2_v3, Standard_D4_v3</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"><strong>GCP</strong>: n2-standard-2, n2-standard-4</td>
</tr>
<tr>
<td style="text-align:left">권장</td>
<td style="text-align:left">8-16 core</td>
<td style="text-align:left">32-64 GB RAM</td>
<td style="text-align:left">100 GB</td>
<td style="text-align:left"><strong>AWS</strong>: m5.2xlarge, m5.4xlarge</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"><strong>Azure</strong>: Standard_D8_v3, Standard_D16_v3</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"></td>
<td style="text-align:left"><strong>GCP</strong>: n2-standard-8, n2-standard-16</td>
</tr>
</tbody>
</table>
<ul>
<li>HA 구성을 위해 3대 이상의 홀수 구성</li>
</ul>
<h2 id="기본-아키텍처-with-consul" tabindex="-1"><a class="header-anchor" href="#기본-아키텍처-with-consul" aria-hidden="true">#</a> 기본 아키텍처 (with Consul)</h2>
<figure><img src="https://learn.hashicorp.com/img/nomad/production/nomad_reference_diagram.png" alt="Reference diagram" tabindex="0" loading="lazy"><figcaption>Reference diagram</figcaption></figure>
</div></template>


