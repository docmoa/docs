<template><div><h1 id="consul-enterprise-feature" tabindex="-1"><a class="header-anchor" href="#consul-enterprise-feature" aria-hidden="true">#</a> Consul Enterprise Feature</h1>
<ul>
<li>Enterprise Global Visibility &amp; Scale
<ul>
<li>Network Segments</li>
<li>Advanced Federation</li>
<li>Redendancy Zones</li>
<li>Enganced Read Scalability</li>
</ul>
</li>
<li>Governance &amp; Policy
<ul>
<li>Namespaces</li>
<li>Single Sign On</li>
<li>Audit Logging</li>
<li>Sentinel</li>
</ul>
</li>
</ul>
<h2 id="enterprise-global-visibility-scale" tabindex="-1"><a class="header-anchor" href="#enterprise-global-visibility-scale" aria-hidden="true">#</a> Enterprise Global Visibility &amp; Scale</h2>
<h3 id="_1-network-segments" tabindex="-1"><a class="header-anchor" href="#_1-network-segments" aria-hidden="true">#</a> 1. Network Segments</h3>
<p>하나의 Consul 서버에서 서로다른 Agent 들의 묶음을 관리할 수 있도록 하는 개념입니다. 여러개의 Consul 클러스터를 만드는 것이 아닌, 하나의 클러스터 내에서 Agent 들을 분류합니다.</p>
<p>참고 Url : <a href="https://learn.hashicorp.com/tutorials/consul/network-partition-datacenters" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/consul/network-partition-datacenters<ExternalLinkIcon/></a></p>
<h3 id="_2-advanced-federation" tabindex="-1"><a class="header-anchor" href="#_2-advanced-federation" aria-hidden="true">#</a> 2. Advanced Federation</h3>
<p>페더레이션을 위해서는 RPC(8300/tcp), SerfWAN(8302/tcp, 8302/udp)를 통해야하므로 여러 테이터센터, 혹은 클러스터를 관리하기에 어려워집니다. 이를 보완하기 위해 지역간 트래픽을 모두 RPC(8300/tcp)를 통해 수행하여 TLS만으로 보안을 유지하도록 합니다.</p>
<p>참고 Url : <a href="https://www.consul.io/docs/enterprise/federation" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/enterprise/federation<ExternalLinkIcon/></a></p>
<h3 id="_3-redendancy-zones" tabindex="-1"><a class="header-anchor" href="#_3-redendancy-zones" aria-hidden="true">#</a> 3. Redendancy Zones</h3>
<p>일반적으로 클러스터의 관리 서버는 3중화하여 구성하며 Raft 알고리즘을 통해 리더 선출을 하는 방식을 취합니다. HA를 위해 해당 투표에 참여하지 않은 추가 잉여 서버 노드를 &quot;상시 대기&quot; 시킬 수 있으며 장애 발생 시 해당 노드는 투표 구성원으로 승격 됩니다. 이는 서버 노드에 대한 추가 구성원임과 동시에 복구 기능을 제공합니다.</p>
<p>참고 Url : <a href="https://learn.hashicorp.com/tutorials/consul/autopilot-datacenter-operations#redundancy-zones" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/consul/autopilot-datacenter-operations#redundancy-zones<ExternalLinkIcon/></a></p>
<h3 id="_4-enganced-read-scalability" tabindex="-1"><a class="header-anchor" href="#_4-enganced-read-scalability" aria-hidden="true">#</a> 4. Enganced Read Scalability</h3>
<p>앞서의 Redendancy Zone의 비투표 노드는 투표에는 참여하지 않지만 데이터를 복제하고 데이터를 읽을 수 있는 동작을 지원합니다. 이를 통해 Consul 클러스터를 확장할 수 있고 읽기/쓰기 지연시간을 줄이고 용량을 늘일 수 있습니다.</p>
<p>참고 Url : <a href="https://www.consul.io/docs/agent/options#_non_voting_server" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/agent/options#_non_voting_server<ExternalLinkIcon/></a></p>
<h2 id="governance-policy" tabindex="-1"><a class="header-anchor" href="#governance-policy" aria-hidden="true">#</a> Governance &amp; Policy</h2>
<p>관련 블로그 : <a href="https://www.hashicorp.com/blog/enterprise-compliance-and-governance-with-hashicorp-consul-1-8/" target="_blank" rel="noopener noreferrer">https://www.hashicorp.com/blog/enterprise-compliance-and-governance-with-hashicorp-consul-1-8/<ExternalLinkIcon/></a></p>
<h3 id="_1-namespaces" tabindex="-1"><a class="header-anchor" href="#_1-namespaces" aria-hidden="true">#</a> 1. Namespaces</h3>
<p>Namespaces 기능은 사용자나 팀간의 데이터 격리를 제공합니다. 각각의 Namespace로 구분된 서비스와 정보는 서로 다른 구성원같에 조회가 불가능합니다. 하나의 클러스터로 논리적 분할을 가능하게 합니다.</p>
<p>참고 Url : <a href="https://www.consul.io/docs/enterprise/namespaces" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/enterprise/namespaces<ExternalLinkIcon/></a></p>
<h3 id="_2-single-sign-on" tabindex="-1"><a class="header-anchor" href="#_2-single-sign-on" aria-hidden="true">#</a> 2. Single Sign On</h3>
<p>Open ID Connect를 사용하여 인증을 처리합니다.</p>
<p>참고 Url : <a href="https://www.consul.io/docs/acl/auth-methods/oidc" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/acl/auth-methods/oidc<ExternalLinkIcon/></a></p>
<h3 id="_3-audit-logging" tabindex="-1"><a class="header-anchor" href="#_3-audit-logging" aria-hidden="true">#</a> 3. Audit Logging</h3>
<p>사용자의 이벤트 시도와 처리에 대한 로그를 캡쳐하고 기록하는 것을 지원합니다. 1.8.0 기준으로 'file'을 지원하며, 향후 추가 타입이 지원될 예정입니다.</p>
<p>참고 Url : <a href="https://www.consul.io/docs/agent/options#audit" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/agent/options#audit<ExternalLinkIcon/></a></p>
<h3 id="_4-sentinel" tabindex="-1"><a class="header-anchor" href="#_4-sentinel" aria-hidden="true">#</a> 4. Sentinel</h3>
<p>Consul에 반영되는 서비스나 KV에 대한 정책을 정의할 수 있습니다. 예를 들면 서비스 등록이나 업데이트에 대한 시간을 강제하거나 Key에 이름 패턴을 강제화 할 수 있습니다.</p>
<p>참고 Url : <a href="https://www.consul.io/docs/agent/sentinel" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/agent/sentinel<ExternalLinkIcon/></a></p>
</div></template>


