<template><div><h1 id="consul-sizing" tabindex="-1"><a class="header-anchor" href="#consul-sizing" aria-hidden="true">#</a> Consul Sizing</h1>
<blockquote>
<p><a href="https://learn.hashicorp.com/tutorials/consul/reference-architecture" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/consul/reference-architecture<ExternalLinkIcon/></a></p>
<p>Consul은 Server/Client 구조로 구성되며, Client의 경우 자원사용량이 매우 미미하므로 자원산정은 Server를 기준으로 산정</p>
</blockquote>
<h2 id="on-prem" tabindex="-1"><a class="header-anchor" href="#on-prem" aria-hidden="true">#</a> On-prem</h2>
<table>
<thead>
<tr>
<th style="text-align:left">Size</th>
<th style="text-align:left">CPU</th>
<th style="text-align:left">Memory</th>
<th style="text-align:left">Disk Capacity</th>
<th>Disk IO</th>
<th style="text-align:left">Disk Throughput</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">최소</td>
<td style="text-align:left">2-4 core</td>
<td style="text-align:left">8-16 GB RAM</td>
<td style="text-align:left">100 GB</td>
<td>3000+  IOPS</td>
<td style="text-align:left">75+ MB/s</td>
</tr>
<tr>
<td style="text-align:left">권장</td>
<td style="text-align:left">8-16 core</td>
<td style="text-align:left">32-64 GB RAM</td>
<td style="text-align:left">100 GB</td>
<td>7500+ IOPS</td>
<td style="text-align:left">250+ MB/s</td>
</tr>
</tbody>
</table>
<ul>
<li>HA 구성을 위해 3대 이상의 홀수 구성</li>
</ul>
<h2 id="cloud" tabindex="-1"><a class="header-anchor" href="#cloud" aria-hidden="true">#</a> Cloud</h2>
<table>
<thead>
<tr>
<th style="text-align:left">Provider</th>
<th style="text-align:left">Size</th>
<th style="text-align:left">Instance/VM Types</th>
<th style="text-align:left">Disk Volume Specs</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left"><strong>AWS</strong></td>
<td style="text-align:left">최소</td>
<td style="text-align:left"><code v-pre>m5.large</code>, <code v-pre>m5.xlarge</code></td>
<td style="text-align:left">100+GB <code v-pre>gp3</code>, 3000 IOPS, 125MB/s</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">권장</td>
<td style="text-align:left"><code v-pre>m5.2xlarge</code>, <code v-pre>m5.4xlarge</code></td>
<td style="text-align:left">200+GB <code v-pre>gp3</code>, 10000 IOPS, 250MB/s</td>
</tr>
<tr>
<td style="text-align:left"><strong>Azure</strong></td>
<td style="text-align:left">최소</td>
<td style="text-align:left"><code v-pre>Standard_D2s_v3</code>, <code v-pre>Standard_D4s_v3</code></td>
<td style="text-align:left">1024GB* <code v-pre>Premium SSD</code>, 5000 IOPS, 200MB/s</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">권장</td>
<td style="text-align:left"><code v-pre>Standard_D8s_v3</code>, <code v-pre>Standard_D16s_v3</code></td>
<td style="text-align:left">2048GB* <code v-pre>Premium SSD</code>, 7500 IOPS, 200MB/s</td>
</tr>
<tr>
<td style="text-align:left"><strong>GCP</strong></td>
<td style="text-align:left">최소</td>
<td style="text-align:left"><code v-pre>n2-standard-2</code>, <code v-pre>n2-standard-4</code></td>
<td style="text-align:left">512GB* <code v-pre>pd-balanced</code>, 15000 IOPS, 240MB/s</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">권장</td>
<td style="text-align:left"><code v-pre>n2-standard-8</code>, <code v-pre>n2-standard-16</code></td>
<td style="text-align:left">1000GB* <code v-pre>pd-ssd</code>, 30000 IOPS, 480MB/s</td>
</tr>
</tbody>
</table>
<ul>
<li>HA 구성을 위해 3대 이상 홀수 구성</li>
</ul>
<h2 id="기본-아키텍처" tabindex="-1"><a class="header-anchor" href="#기본-아키텍처" aria-hidden="true">#</a> 기본 아키텍처</h2>
<figure><img src="@source/04-HashiCorp/04-Consul/01-Information/image/consul-reference-architecture.png" alt="Recommended architecture diagram" tabindex="0" loading="lazy"><figcaption>Recommended architecture diagram</figcaption></figure>
<h2 id="raft-구성-장애-극복을-위한-non-voting-서버-구성" tabindex="-1"><a class="header-anchor" href="#raft-구성-장애-극복을-위한-non-voting-서버-구성" aria-hidden="true">#</a> Raft 구성 장애 극복을 위한 Non-Voting 서버 구성</h2>
<figure><img src="@source/04-HashiCorp/04-Consul/01-Information/image/consul-non-voting.png" alt="Redundancy Zones diagram" tabindex="0" loading="lazy"><figcaption>Redundancy Zones diagram</figcaption></figure>
</div></template>


