<template><div><h1 id="consul-mesh-gateway-k8s-x-bms-vms" tabindex="-1"><a class="header-anchor" href="#consul-mesh-gateway-k8s-x-bms-vms" aria-hidden="true">#</a> Consul Mesh Gateway - K8S x BMs/VMs</h1>
<blockquote>
<p>이 문서에서는 Consul을 사용하여 상이한 두 Consul로 구성된 클러스터(마스터가 별개)의 서비스를 연계하는 방법을 설명합니다.</p>
</blockquote>
<h2 id="_1-개요" tabindex="-1"><a class="header-anchor" href="#_1-개요" aria-hidden="true">#</a> 1. 개요</h2>
<h3 id="_1-1-아키텍처" tabindex="-1"><a class="header-anchor" href="#_1-1-아키텍처" aria-hidden="true">#</a> 1.1 아키텍처</h3>
<p>네트워크 영역이 분리되어있는 두 환경의 애플리케이션 서비스들을 Service Mesh로 구성하는 방법을 알아 봅니다. 이번 구성 예에서는 Kubernetes와 Baremetal(BM)이나 VirtualMachine(VM)에 Consul Cluster(Datacenter)를 구성하고 각 환경의 애플리케이션 서비스를 Mesh Gateway로 연계합니다.</p>
<p>Mesh Gateway를 사용하면 서로다른 클러스터간에 mTLS 환경의 통신과 서비스 간의 트래픽 통로를 단일화 하여 구성할 수 있습니다. 또한 mTLS내의 데이터가 Gateway에서 해동되지 않기 때문에 두 클러스터간 안전하게 데이터를 송수신 합니다.</p>
<p>Consul의 각 Cluster는 Datacenter라는 명칭으로 구분됩니다. <strong>이번 구성에서는 Kubernetes의 Consul Datacenter가 Primary의 역할을 합니다.</strong></p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/HashiCorp General Presentation Template (KR) - Apr 2020 - Google Slides 2020-11-12 15-58-54.png" alt="HashiCorp General Presentation Template (KR) - Apr 2020 - Google Slides 2020-11-12 15-58-54" tabindex="0" loading="lazy"><figcaption>HashiCorp General Presentation Template (KR) - Apr 2020 - Google Slides 2020-11-12 15-58-54</figcaption></figure>
<ul>
<li>각 Application을 위한 Sidecar를 구성합니다.</li>
<li>Mesh Gateway를 구성하기 위해서는 모든 Sidecars는 Envoy 로 구성되어야 합니다.</li>
<li>Mesh Gateway를 구성하기 위해서는 Sidecar와 Consul이 TLS로 통신해야 합니다.</li>
</ul>
<h3 id="_1-2-port-구성-참고" tabindex="-1"><a class="header-anchor" href="#_1-2-port-구성-참고" aria-hidden="true">#</a> 1.2 Port 구성 참고</h3>
<blockquote>
<p>Port 구성에 대한 문서는 다음을 참고합니다.<br>
<a href="https://www.consul.io/docs/install/ports" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/install/ports<ExternalLinkIcon/></a></p>
</blockquote>
<table>
<thead>
<tr>
<th style="text-align:left">Use</th>
<th style="text-align:left">Default Ports</th>
<th>CLI</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">DNS: The DNS server (TCP and UDP)</td>
<td style="text-align:left">8600</td>
<td>-dns-port</td>
</tr>
<tr>
<td style="text-align:left">HTTP: The HTTP API (TCP Only)</td>
<td style="text-align:left">8500</td>
<td>-http-port</td>
</tr>
<tr>
<td style="text-align:left">HTTPS: The HTTPs API</td>
<td style="text-align:left">disabled (8501)*</td>
<td>-https-port</td>
</tr>
<tr>
<td style="text-align:left">gRPC: The gRPC API</td>
<td style="text-align:left">disabled (8502)*</td>
<td>-grpc-port</td>
</tr>
<tr>
<td style="text-align:left">LAN Serf: The Serf LAN port (TCP and UDP)</td>
<td style="text-align:left">8301</td>
<td>-serf-lan-port</td>
</tr>
<tr>
<td style="text-align:left">Wan Serf: The Serf WAN port (TCP and UDP)</td>
<td style="text-align:left">8302</td>
<td>-sert-wan-port</td>
</tr>
<tr>
<td style="text-align:left">server: Server RPC address (TCP Only)</td>
<td style="text-align:left">8300</td>
<td>-server-port</td>
</tr>
<tr>
<td style="text-align:left">Sidecar Proxy Min: Sidecar 서비스 등록에 사용되는 범위의 최소 포트</td>
<td style="text-align:left">21000</td>
<td><code v-pre>Configration file</code></td>
</tr>
<tr>
<td style="text-align:left">Sidecar Proxy Max: Sidecar 서비스 등록에 사용되는 범위의 최대 포트</td>
<td style="text-align:left">21255</td>
<td><code v-pre>Configration file</code></td>
</tr>
</tbody>
</table>
<p>Federation을 위한 포트로는</p>
<ul>
<li>Consul Server &amp; Agent
<ul>
<li>8301 : Gassip 프로토콜로 서로간의 상태를 확인하는데 사용됩니다.</li>
</ul>
</li>
<li>Consul Server
<ul>
<li>8500 : Server의 API통신을 위한 포트입니다.</li>
<li>8501 : Mesh Gateway와 TLS로 통신합니다.</li>
<li>8300 : Agent가 서버와의 RPC통신을 합니다.</li>
<li>8600 : Consul DNS를 위해 사용됩니다.</li>
</ul>
</li>
<li>Consul Agent
<ul>
<li>21000~21255 : Sidecar 서비스가 할당받는 포트 범위 입니다.</li>
</ul>
</li>
</ul>
<p>각 <a href="https://www.consul.io/docs/agent/options#ports" target="_blank" rel="noopener noreferrer">포트 구성설정 가이드<ExternalLinkIcon/></a>는 다음과 같습니다.</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>ports <span class="token punctuation">{</span>
  dns <span class="token operator">=</span> <span class="token number">8600</span>
  http <span class="token operator">=</span> <span class="token number">8500</span>
  https <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span>
  grpc <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span>
  serf_lan <span class="token operator">=</span> <span class="token number">8301</span>
  serf_wan <span class="token operator">=</span> <span class="token number">8302</span>
  server <span class="token operator">=</span> <span class="token number">8300</span>
  sidecar_min_port <span class="token operator">=</span> <span class="token number">21000</span>
  sidecar_max_port <span class="token operator">=</span> <span class="token number">21255</span>
  expose_min_port <span class="token operator">=</span> <span class="token number">21500</span>
  expose_max_port <span class="token operator">=</span> <span class="token number">21755</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-kubernetes상에-consul설치" tabindex="-1"><a class="header-anchor" href="#_2-kubernetes상에-consul설치" aria-hidden="true">#</a> 2. Kubernetes상에 Consul설치</h2>
<h3 id="_2-1-사전-준비-사항" tabindex="-1"><a class="header-anchor" href="#_2-1-사전-준비-사항" aria-hidden="true">#</a> 2.1 사전 준비 사항</h3>
<ul>
<li>Kubernetes가 설치되어있어야 하며, 작업을 수행할 환경에서 접속 가능한 상태여야 합니다.</li>
<li>Helm3 혹은 Helm2를 설치합니다.
<ul>
<li>Installing Helm : <a href="https://helm.sh/docs/intro/install" target="_blank" rel="noopener noreferrer">https://helm.sh/docs/intro/install<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<h3 id="_2-2-설치" tabindex="-1"><a class="header-anchor" href="#_2-2-설치" aria-hidden="true">#</a> 2.2 설치</h3>
<p>Kubernetes에서 Consul을 실행하는 권장 방법은 <a href="https://www.consul.io/docs/k8s/helm" target="_blank" rel="noopener noreferrer">Helm 차트를 사용하는 것<ExternalLinkIcon/></a> 입니다. Consul을 실행하는 데 필요한 모든 구성 요소를 설치하고 구성합니다. Helm 2를 사용하는 경우 <a href="https://v2.helm.sh/docs/using_helm/#quickstart-guide" target="_blank" rel="noopener noreferrer">Helm 2 설치 가이드<ExternalLinkIcon/></a> 에 따라 Tiller를 설치해야합니다.</p>
<h4 id="_2-2-1-helm-repository-추가" tabindex="-1"><a class="header-anchor" href="#_2-2-1-helm-repository-추가" aria-hidden="true">#</a> 2.2.1 helm Repository 추가</h4>
<p>HashiCorp helm Repository를 추가합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ helm repo <span class="token function">add</span> hashicorp https://helm.releases.hashicorp.com
<span class="token string">"hashicorp"</span> has been added to your repositories
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Consul 차트에 접근가능한지 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ helm search repo hashicorp/consul
NAME                CHART VERSION   APP VERSION DESCRIPTION
hashicorp/consul    <span class="token number">0.32</span>.1          <span class="token number">1.10</span>.0       Official HashiCorp Consul Chart
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><details class="hint-container details"><summary>CHART LIST</summary>
<p>Consul 차트마다의 기본 매칭되는 버전정보는 다음과 같이 리스트로 확인 가능합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ helm search repo hashicorp/consul <span class="token parameter variable">-l</span>
NAME            	CHART VERSION	APP VERSION	DESCRIPTION
hashicorp/consul	<span class="token number">0.32</span>.1       	<span class="token number">1.10</span>.0     	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.32</span>.0       	<span class="token number">1.10</span>.0     	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.31</span>.1       	<span class="token number">1.9</span>.4      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.31</span>.0       	<span class="token number">1.9</span>.4      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.30</span>.0       	<span class="token number">1.9</span>.3      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.29</span>.0       	<span class="token number">1.9</span>.2      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.28</span>.0       	<span class="token number">1.9</span>.1      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.27</span>.0       	<span class="token number">1.9</span>.0      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.26</span>.0       	<span class="token number">1.8</span>.5      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.25</span>.0       	<span class="token number">1.8</span>.4      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.24</span>.1       	<span class="token number">1.8</span>.2      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.24</span>.0       	<span class="token number">1.8</span>.1      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.23</span>.1       	<span class="token number">1.8</span>.0      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.23</span>.0       	<span class="token number">1.8</span>.0      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.22</span>.0       	<span class="token number">1.8</span>.0      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.21</span>.0       	<span class="token number">1.7</span>.3      	Official HashiCorp Consul Chart
hashicorp/consul	<span class="token number">0.20</span>.1       	<span class="token number">1.7</span>.2      	Official HashiCorp Consul Chart
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<h4 id="_2-2-2-gossip-프토토콜을-위한-kubernetes-secret-생성" tabindex="-1"><a class="header-anchor" href="#_2-2-2-gossip-프토토콜을-위한-kubernetes-secret-생성" aria-hidden="true">#</a> 2.2.2 Gossip 프토토콜을 위한 Kubernetes Secret 생성</h4>
<p>Kubernetes상에서 Consul Datacenter의 Gossip 프로토콜에서 사용할 키를 생성합니다. 미리 생성하여 값을 넣어도 되고, 생성시 값이 생성되도록 하여도 관계 없습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl create secret generic consul-gossip-encryption-key --from-literal<span class="token operator">=</span>key<span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>consul keygen<span class="token variable">)</span></span>

--- or ---

$ consul keygen
h65lqS3w4x42KP+n4Hn9RtK84Rx7zP3WSahZSyD5i1o<span class="token operator">=</span>
$ kubectl create secret generic consul-gossip-encryption-key --from-literal<span class="token operator">=</span>key<span class="token operator">=</span>h65lqS3w4x42KP+n4Hn9RtK84Rx7zP3WSahZSyD5i1o<span class="token operator">=</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-3-설치를-위한-사용자-지정-yaml-작성" tabindex="-1"><a class="header-anchor" href="#_2-2-3-설치를-위한-사용자-지정-yaml-작성" aria-hidden="true">#</a> 2.2.3 설치를 위한 사용자 지정 <code v-pre>yaml</code> 작성</h4>
<p>Helm 차트로 설치할 때 기본 설정을 엎어쓰는 파일을 생성하여 원하는 구성으로 설치되도록 준비합니다. 각 구성에 대한 설정은 <a href="https://www.consul.io/docs/k8s/helm" target="_blank" rel="noopener noreferrer">Helm Chart Configuration<ExternalLinkIcon/></a> 를 참고합니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token comment"># consul.yaml</span>
<span class="token key atrule">global</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> consul
  <span class="token comment"># 기본이미지(OSS 최신 버전)가 아닌 다른 버전의 컨테이너 이미지 또는 별도의 레지스트리를 사용하는 경우 명시합니다.</span>
  <span class="token key atrule">image</span><span class="token punctuation">:</span> <span class="token string">'hashicorp/consul-enterprise:1.8.5-ent'</span>
  <span class="token key atrule">datacenter</span><span class="token punctuation">:</span> <span class="token string">'tsis-k8s'</span>
  <span class="token key atrule">tls</span><span class="token punctuation">:</span>
    <span class="token comment"># Federation 구성을 위해서는 TLS가 반드시 활성화되어야 합니다.</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">verify</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token key atrule">httpsOnly</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>

  <span class="token key atrule">federation</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token comment"># Kubernetes가 Primary Datacenter이기 때문에 이 환경에서 Federation을 위한 시크릿을 생성하도록 합니다.</span>
    <span class="token comment"># https://www.consul.io/docs/k8s/installation/multi-cluster/kubernetes#primary-datacenter</span>
    <span class="token key atrule">createFederationSecret</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">gossipEncryption</span><span class="token punctuation">:</span>
    <span class="token comment"># gossip프로토콜은 암호화되어야 하며, 해당 키는 미리 Kubernetes에 Secret으로 구성합니다.</span>
    <span class="token key atrule">secretName</span><span class="token punctuation">:</span> consul<span class="token punctuation">-</span>gossip<span class="token punctuation">-</span>encryption<span class="token punctuation">-</span>key
    <span class="token key atrule">secretKey</span><span class="token punctuation">:</span> key
  <span class="token key atrule">enableConsulNamespaces</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">enterpriseLicense</span><span class="token punctuation">:</span>
    <span class="token key atrule">secretName</span><span class="token punctuation">:</span> consul<span class="token punctuation">-</span>enterprise<span class="token punctuation">-</span>license<span class="token punctuation">-</span>key
    <span class="token key atrule">secretKey</span><span class="token punctuation">:</span> key
<span class="token key atrule">connectInject</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">centralConfig</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">ui</span><span class="token punctuation">:</span>
  <span class="token key atrule">service</span><span class="token punctuation">:</span>
	  <span class="token comment"># UI에 접속을 위한 타입을 정의합니다.</span>
	  <span class="token comment"># 보안상의 이유로 LoadBalancer기본적으로 서비스를 통해 노출되지 않으므로 kubectl port-forward를 사용하거나</span>
    <span class="token comment"># NodePort로 UI에 접속하는 데 사용해야 합니다.</span>
    <span class="token key atrule">type</span><span class="token punctuation">:</span> NodePort
<span class="token key atrule">dns</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">meshGateway</span><span class="token punctuation">:</span>
  <span class="token comment"># 메시 게이트웨이는 데이터 센터 간의 게이트웨이입니다.</span>
  <span class="token comment"># 데이터 센터 간의 통신이 메시 게이트웨이를 통과하므로 Kubernetes에서 페더레이션을 위해 활성화되어야합니다.</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">service</span><span class="token punctuation">:</span>
    <span class="token key atrule">type</span><span class="token punctuation">:</span> NodePort
    <span class="token key atrule">nodePort</span><span class="token punctuation">:</span> <span class="token number">31001</span>

<span class="token comment"># Ingress Gateway는 Kubernets로 요청되는 주요 관문을 Consul에서 설정하고 Service Mesh기능을 활성화 합니다.</span>
<span class="token comment"># 이번 시나리오에서는 필수 설정이 아닙니다.</span>
<span class="token key atrule">ingressGateways</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">gateways</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ingress<span class="token punctuation">-</span>gateway
      <span class="token key atrule">service</span><span class="token punctuation">:</span>
        <span class="token key atrule">type</span><span class="token punctuation">:</span> NodePort
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
          <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">31000</span>
            <span class="token key atrule">nodePort</span><span class="token punctuation">:</span> <span class="token number">31000</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-2-4-consul-helm-chart-실행" tabindex="-1"><a class="header-anchor" href="#_2-2-4-consul-helm-chart-실행" aria-hidden="true">#</a> 2.2.4 Consul Helm Chart 실행</h4>
<p>Helm3을 사용하여 사용자 구성으로 Consul을 설치하려면 다음을 실행합니다. (사용자 구성 파일 : <code v-pre>consul.yaml</code>)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ helm <span class="token function">install</span> consul hashicorp/consul <span class="token parameter variable">-f</span> consul.yaml <span class="token parameter variable">--debug</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>설치가 완료되고 얼마안있어 Pod를 확인해보면 다음과 같이 확인 가능합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl get pods
consul-consul-mesh-gateway-754fbc5575-d8dgt                       <span class="token number">2</span>/2     Running   <span class="token number">0</span>          2m
consul-consul-mesh-gateway-754fbc5575-wkvjh                       <span class="token number">2</span>/2     Running   <span class="token number">0</span>          2m
consul-consul-mh5h6                                               <span class="token number">1</span>/1     Running   <span class="token number">0</span>          2m
consul-consul-mx4mn                                               <span class="token number">1</span>/1     Running   <span class="token number">0</span>          2m
consul-consul-rlb5x                                               <span class="token number">1</span>/1     Running   <span class="token number">0</span>          2m
consul-consul-server-0                                            <span class="token number">1</span>/1     Running   <span class="token number">0</span>          2m
consul-consul-server-1                                            <span class="token number">1</span>/1     Running   <span class="token number">0</span>          2m
consul-consul-server-2                                            <span class="token number">1</span>/1     Running   <span class="token number">0</span>          2m
consul-consul-tbngg                                               <span class="token number">1</span>/1     Running   <span class="token number">1</span>          2m
consul-consul-tz9ct                                               <span class="token number">1</span>/1     Running   <span class="token number">0</span>          2m
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>consul-server: 3중화되어 구성됩니다.</li>
<li>consul: Consul Client가 DaemonSet 형태로 모든 노드에 구성됩니다.</li>
<li>consul-mesh-gateway: 기본 2중화 설정으로, 2개 구성됩니다.</li>
</ul>
<h4 id="_2-2-5-설치-후-추가-가이드-option" tabindex="-1"><a class="header-anchor" href="#_2-2-5-설치-후-추가-가이드-option" aria-hidden="true">#</a> 2.2.5 설치 후 추가 가이드(Option)</h4>
<ul>
<li>
<p>port-forward<br>
Consul UI에 접혹하기 위해 <code v-pre>port-forward</code> 를 사용하는 경우 다음과 같이 설정하여 접근가능합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># HTTP</span>
$ kubectl port-forward service/consul-server <span class="token number">8500</span>:8500

<span class="token comment"># HTTPS (TLS)</span>
$ kubectl port-forward service/consul-server <span class="token number">8501</span>:8501
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>ACL<br>
ACL이 활성화된 경우 ACL토큰이 필요합니다. 전체 권한이 있는 bootstrap토큰은 다음과 같이 확인할 수 있습니다. (값의 마지막 <code v-pre>%</code> 는 제외)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl get secrets/consul-bootstrap-acl-token <span class="token parameter variable">--template</span><span class="token operator">=</span><span class="token punctuation">{</span><span class="token punctuation">{</span>.data.token<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token operator">|</span> base64 <span class="token parameter variable">-D</span>
e7924dd1-dc3f-f644-da54-81a73ba0a178%
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h4 id="_2-2-6-테스트를-위한-pod-생성-option" tabindex="-1"><a class="header-anchor" href="#_2-2-6-테스트를-위한-pod-생성-option" aria-hidden="true">#</a> 2.2.6 테스트를 위한 Pod 생성(Option)</h4>
<p>Kubertnetes상에서 Mesh Gateway를 사용하기 위한 설정을 확인할 수 있도록 테스트를 위한 Pod를 생성합니다.</p>
<details class="hint-container details"><summary>APP SAMPLE</summary>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token comment"># k8s-consul-app.yaml</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> counting
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> counting
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">'consul.hashicorp.com/service-tags'</span><span class="token punctuation">:</span> servicemesh<span class="token punctuation">,</span> consul<span class="token punctuation">,</span> counting<span class="token punctuation">,</span> v1
    <span class="token key atrule">'consul.hashicorp.com/connect-inject'</span><span class="token punctuation">:</span> <span class="token string">'true'</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> counting
      <span class="token key atrule">image</span><span class="token punctuation">:</span> hashicorp/counting<span class="token punctuation">-</span>service<span class="token punctuation">:</span>0.0.2
      <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">9001</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> http
  <span class="token key atrule">serviceAccountName</span><span class="token punctuation">:</span> counting
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> dashboard
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> dashboard
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> <span class="token string">'dashboard'</span>
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">'consul.hashicorp.com/service-tags'</span><span class="token punctuation">:</span> servicemesh<span class="token punctuation">,</span> consul<span class="token punctuation">,</span> dashiboard<span class="token punctuation">,</span> v1
    <span class="token key atrule">'consul.hashicorp.com/connect-inject'</span><span class="token punctuation">:</span> <span class="token string">'true'</span>
    <span class="token key atrule">'consul.hashicorp.com/connect-service-upstreams'</span><span class="token punctuation">:</span> <span class="token string">'counting:9001'</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> dashboard
      <span class="token key atrule">image</span><span class="token punctuation">:</span> hashicorp/dashboard<span class="token punctuation">-</span>service<span class="token punctuation">:</span>0.0.4
      <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">9002</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> http
      <span class="token key atrule">env</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> COUNTING_SERVICE_URL
          <span class="token key atrule">value</span><span class="token punctuation">:</span> <span class="token string">'http://localhost:9001'</span>
  <span class="token key atrule">serviceAccountName</span><span class="token punctuation">:</span> dashboard
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> <span class="token string">'v1'</span>
<span class="token key atrule">kind</span><span class="token punctuation">:</span> <span class="token string">'Service'</span>
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> <span class="token string">'dashboard-service-nodeport'</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> <span class="token string">'default'</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> <span class="token string">'dashboard'</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">protocol</span><span class="token punctuation">:</span> <span class="token string">'TCP'</span>
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">9002</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> <span class="token string">'dashboard'</span>
  <span class="token key atrule">type</span><span class="token punctuation">:</span> <span class="token string">'NodePort'</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> dns
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> dns
      <span class="token key atrule">image</span><span class="token punctuation">:</span> anubhavmishra/tiny<span class="token punctuation">-</span>tools
      <span class="token key atrule">command</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> sleep
        <span class="token punctuation">-</span> infinity
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>'consul.hashicorp.com/connect-inject': 'true'</code> 해당 annotations가 선언되면 consul api를 통해 해당 Pod가 배포될 때 Sidecar가 함께 생성됩니다.</li>
<li><code v-pre>'consul.hashicorp.com/connect-service-upstreams': 'counting:9001'</code> 설정은 side가에 9001포트로 요청이 오면 <code v-pre>counting</code> 으로 정의된 서비스로 해당 요청을 전달합니다.</li>
<li>Consul 내부에서의 Service Mesh기능은 Consul의 Service Discovery 기능에 따라, Sidecar들이 서로를 찾을 수 있습니다.</li>
<li>예제의 <code v-pre>dashboard</code> 앱은 frontend앱으로 UI를 제공하며, <code v-pre>counting</code> 앱은 backend앱으로 호출시 내부적으로 counting을 추가합니다.</li>
<li>dashboard앱은 백엔드로 localhost의 9001에 요청합니다. Pod 내의 container는 동일한 ip를 갖기 때문에 <code v-pre>upstream</code> 설정으로 9001에 대한 목적지를 알고 있는 sidecar container proxy가 해당 요청을 전달합니다.</li>
</ul>
</details>
<h2 id="_3-vm-bm상에-consul설치" tabindex="-1"><a class="header-anchor" href="#_3-vm-bm상에-consul설치" aria-hidden="true">#</a> 3. VM/BM상에 Consul설치</h2>
<h3 id="_3-1-사전-준비-사항" tabindex="-1"><a class="header-anchor" href="#_3-1-사전-준비-사항" aria-hidden="true">#</a> 3.1 사전 준비 사항</h3>
<ul>
<li>Consul 을 실행할 수 있도록 준비합니다.
<ul>
<li>Install Consul : <a href="https://www.consul.io/docs/install" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/install<ExternalLinkIcon/></a></li>
<li>BM이나 VM 환경에 Consul을 설치하는 방법은 <a href="https://www.consul.io/docs/install#precompiled-binaries" target="_blank" rel="noopener noreferrer">미리 컴파일 된 바이너리<ExternalLinkIcon/></a>를 사용하여 구성하거나 <a href="https://www.consul.io/docs/install#compiling-from-source" target="_blank" rel="noopener noreferrer">소스<ExternalLinkIcon/></a>로부터 컴파일하여 사용하는 두가지 방법이 있습니다. 사전 컴파일 된 바이너리를 다운로드하여 사용하는 방법이 가장 쉽습니다. 이번 환경에서는 컴파일된 바이너리를 기준으로 설명합니다.</li>
</ul>
</li>
</ul>
<h3 id="_3-2-consul-바이너리-다운로드와-path-설정" tabindex="-1"><a class="header-anchor" href="#_3-2-consul-바이너리-다운로드와-path-설정" aria-hidden="true">#</a> 3.2 Consul 바이너리 다운로드와 PATH 설정</h3>
<p>각 환경(Linux/Windows/Mac/FreeBSC/Solaris)에 맞는 바이너리를 받고 압축을 풉니다. <code v-pre>consul</code> 혹은 Windows의 경우 <code v-pre>consul.exe</code>를 시스템의 적절한 위치에 이동시키고 PATH에 추가시키면 어느곳에서든 접근할 수 있습니다.</p>
<h4 id="_3-2-1-linux-기반-또는-mac" tabindex="-1"><a class="header-anchor" href="#_3-2-1-linux-기반-또는-mac" aria-hidden="true">#</a> 3.2.1 Linux 기반 또는 Mac</h4>
<p>쉘 설정 파일을 편집하여 PATH에 영구적으로 추가할 수 있습니다. 일반적으로 <code v-pre>.</code> + <code v-pre>쉘이름</code> + <code v-pre>rc</code> 로 구성되며 bash쉘을  사용하는 경우 <code v-pre>~/.bashrc</code> 가 해당 파일입니다. 해당 파일에서 <code v-pre>export PATH=</code>으로 시작하는 <code v-pre>:(콜론)</code>으로 구분된 위치에 consul 바이너리 파일 위치를 넣어주거나 없는 경우 기존 PATH에 추가로 기입할 수 있습니다. <code v-pre>/tools/consul_dir</code> 디렉토리인경우 다음의 예와 같습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token punctuation">..</span>.
<span class="token builtin class-name">export</span> <span class="token assign-left variable"><span class="token environment constant">PATH</span></span><span class="token operator">=</span><span class="token environment constant">$PATH</span>:/tools/consul_dir
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>root 권한이 있다면 시스템의 기본 PATH로 지정되어있는 <code v-pre>/usr/local/bin</code>디렉토리에 consul을 복사하는 것도 하나의 방법이 될 수 있습니다.</p>
<h4 id="_3-2-2" tabindex="-1"><a class="header-anchor" href="#_3-2-2" aria-hidden="true">#</a> 3.2.2</h4>
<p>Windows</p>
<p>시스템 설정에서 GUI를 통해 PATH를 추가합니다. 마우스 클릭으로 진행하는 경우 <code v-pre>Windows 설정 &gt; 시스템 &gt; 정보 &gt; 시스템 정보 &gt; 고급 시스템 설정 &gt; 고급 탭 &gt; 환경 변수</code>의 단계로 진행합니다. 작업표시줄의 검색창에서 <code v-pre>고급 시스템 설정</code> 을 검색하여 <code v-pre>고급 탭 &gt; 환경변수</code> 로 이동할 수도 있습니다. 환경 변수 GUI에서 <code v-pre>USER</code> 또는 <code v-pre>시스템 변수</code>의 Path에 Consul 디렉토리 경로를 추가합니다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/DESKTOP-LenovoMini 2020-11-15 20-36-36.png" alt="DESKTOP-LenovoMini 2020-11-15 20-36-36" tabindex="0" loading="lazy"><figcaption>DESKTOP-LenovoMini 2020-11-15 20-36-36</figcaption></figure>
<h3 id="_3-3-primary-k8s-환경에서-인증서-가져오기" tabindex="-1"><a class="header-anchor" href="#_3-3-primary-k8s-환경에서-인증서-가져오기" aria-hidden="true">#</a> 3.3 Primary(k8s) 환경에서 인증서 가져오기</h3>
<blockquote>
<p>Federation Between VMs and Kubernetes : <a href="https://www.consul.io/docs/k8s/installation/multi-cluster/vms-and-kubernetes" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/k8s/installation/multi-cluster/vms-and-kubernetes<ExternalLinkIcon/></a></p>
</blockquote>
<p>Kubernetes에 구성된 Consul Datacenter가 Primary이기 때문에 해당 환경에서 TLS 인증서를 가져옵니다. 앞서 구성된 Kubernetes 환경에서 CA(Certificate authority cert)와 서명 키(Certificate Authority signing key)를 가져옵니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl get secrets/consul-ca-cert <span class="token punctuation">\</span>
  <span class="token parameter variable">--template</span><span class="token operator">=</span><span class="token string">'{{index .data "tls.crt" }}'</span> <span class="token operator">|</span> base64 <span class="token parameter variable">-d</span> <span class="token operator">></span> consul-agent-ca.pem
$ kubectl get secrets/consul-ca-key <span class="token punctuation">\</span>
  <span class="token parameter variable">--template</span><span class="token operator">=</span><span class="token string">'{{index .data "tls.key" }}'</span> <span class="token operator">|</span> base64 <span class="token parameter variable">-d</span> <span class="token operator">></span> consul-agent-ca-key.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>두 파일이 생성된 위치에서 <code v-pre>consul tls</code>명령을 사용하여 서버에서 사용할 인증서를 생성합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ consul tls cert create <span class="token parameter variable">-server</span> <span class="token parameter variable">-dc</span><span class="token operator">=</span>vm-dc
<span class="token operator">==</span><span class="token operator">></span> Using consul-agent-ca.pem and consul-agent-ca-key.pem
<span class="token operator">==</span><span class="token operator">></span> Saved vm-dc-server-consul-0.pem
<span class="token operator">==</span><span class="token operator">></span> Saved vm-dc-server-consul-0-key.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>동일한 위치에서 Client를 위한 인증서를 생성합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ consul tls cert create <span class="token parameter variable">-client</span> <span class="token parameter variable">-dc</span><span class="token operator">=</span>vm-dc
<span class="token operator">==</span><span class="token operator">></span> Using consul-agent-ca.pem and consul-agent-ca-key.pem
<span class="token operator">==</span><span class="token operator">></span> Saved vm-dc-client-consul-0.pem
<span class="token operator">==</span><span class="token operator">></span> Saved vm-dc-client-consul-0-key.pem
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>CA 파일과 새로 생성한 파일을 Server와 Client 각 환경에 복사합니다. (e.g. /home/consul/consul-cert/vm-dc-server-consul-0.pem)</p>
<p>앞서 생성한 파일 이름을 기준으로 복사 대상은 다음과 같습니다.</p>
<ul>
<li>Server
<ul>
<li>consul-agent-ca.pem</li>
<li>vm-dc-server-consul-0.pem</li>
<li>vm-dc-server-consul-0-key.pem</li>
</ul>
</li>
<li>Client
<ul>
<li>consul-agent-ca.pem</li>
<li>vm-dc-client-consul-0.pem</li>
<li>vm-dc-client-consul-0-key.pem</li>
</ul>
</li>
</ul>
<h3 id="_3-4-consul-구성-파일-작성" tabindex="-1"><a class="header-anchor" href="#_3-4-consul-구성-파일-작성" aria-hidden="true">#</a> 3.4 Consul 구성 파일 작성</h3>
<p>CLI를 활용하여 Consul을 구동할 때 구성 옵션을 사용하는 것도 가능하나 여기서는 구성 파일을 작성하여 Consul Server나 Consul Client가 기동할 수 있도록 합니다. Server와 Client에 대한 설정에 약간의 차이가 있을 뿐 대부분이 동일합니다.</p>
<h4 id="_3-4-1-server" tabindex="-1"><a class="header-anchor" href="#_3-4-1-server" aria-hidden="true">#</a> 3.4.1 Server</h4>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>server <span class="token operator">=</span> <span class="token boolean">true</span>
ui <span class="token operator">=</span> <span class="token boolean">true</span>
bootstrap_expect <span class="token operator">=</span> <span class="token number">3</span>
node_name <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"consul_server_01"</span></span>
datacenter <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"vm-dc"</span></span>
client_addr <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"0.0.0.0"</span></span>
bind_addr <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"192.168.100.51"</span></span>
encrypt <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"h65lqS3w4x42KP+n4Hn9RtK84Rx7zP3WSahZSyD5i1o="</span></span>
data_dir <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/var/lib/consul"</span></span>
retry_join <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"192.168.100.51"</span></span><span class="token punctuation">,</span><span class="token string-literal"><span class="token string">"192.168.100.52"</span></span><span class="token punctuation">,</span><span class="token string-literal"><span class="token string">"192.168.100.83"</span></span><span class="token punctuation">]</span>
ports <span class="token punctuation">{</span>
  https <span class="token operator">=</span> <span class="token number">8501</span>
  http <span class="token operator">=</span> <span class="token number">8500</span>
  grpc <span class="token operator">=</span> <span class="token number">8502</span>
<span class="token punctuation">}</span>
enable_central_service_config <span class="token operator">=</span> <span class="token boolean">true</span>
connect <span class="token punctuation">{</span>
  enabled <span class="token operator">=</span> <span class="token boolean">true</span>
  enable_mesh_gateway_wan_federation <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>
primary_datacenter <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"k8s-dc"</span></span>
primary_gateways <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"172.16.1.111:31001"</span></span><span class="token punctuation">,</span><span class="token string-literal"><span class="token string">"172.16.1.116:31001"</span></span><span class="token punctuation">]</span>
cert_file <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/consul-cert/vm-dc-server-consul-0.pem"</span></span>
key_file <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/consul-cert/vm-dc-server-consul-0-key.pem"</span></span>
ca_file <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/consul-cert/consul-agent-ca.pem"</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>server : server로 구성되는 Consul의 경우에 <code v-pre>true</code>로 설정합니다.</p>
</li>
<li>
<p>node_name, bind_addr는 각 Server에 맞게 구성합니다. 여기서는 3개의 서버로 구성하였습니다.</p>
</li>
<li>
<p>encrypt : <code v-pre>consul keygen</code>을 생성한 값입니다. Server와 Client모두 동일한 값을 설정합니다.</p>
</li>
<li>
<p>data_dir : Consul의 데이터를 저장할 경로이며 미리 생성해야 합니다.</p>
</li>
<li>
<p>retry_join : Consul 서버의 IP를 기입합니다.</p>
</li>
<li>
<p>ports:  Mesh Gateway구성을 위해 https를 활성화 합니다.</p>
</li>
<li>
<p>enable_central_service_config : federation 구성을 위해 <code v-pre>true</code> 로 설정합니다.</p>
</li>
<li>
<p>connect : Service Mesh 구성 활성화를 위해 구성합니다. <code v-pre>enable_mesh_gateway_wan_federation</code>는 Federation에서 Mesh Gateway를 활성화 시켜줍니다.</p>
</li>
<li>
<p>primary_datacenter : kubernetes 환경의 Datacenter이름을 기입합니다.</p>
</li>
<li>
<p>primary_gateways : Kubernetes 환경의 Mesh Gateway 의 IP와 Port를 기입합니다. 여기 예제에서는 Nodeport로 구성된 Consul Mesh Gateway의 값이 확인됩니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl <span class="token builtin class-name">exec</span> statefulset/consul-server -- <span class="token function">sh</span> <span class="token parameter variable">-c</span>   <span class="token string">'curl -sk https://localhost:8501/v1/catalog/service/mesh-gateway | jq ".[].ServiceTaggedAddresses.wan"'</span>
<span class="token punctuation">{</span>
  <span class="token string">"Address"</span><span class="token builtin class-name">:</span> <span class="token string">"172.16.1.111"</span>,
  <span class="token string">"Port"</span><span class="token builtin class-name">:</span> <span class="token number">31001</span>
<span class="token punctuation">}</span>
<span class="token punctuation">{</span>
  <span class="token string">"Address"</span><span class="token builtin class-name">:</span> <span class="token string">"172.16.1.116"</span>,
  <span class="token string">"Port"</span><span class="token builtin class-name">:</span> <span class="token number">31001</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>cert_file / key_file / ca_file : 앞서 생성한 Server 인증서들의 경로와 파일명을 기입합니다.</p>
</li>
</ul>
<h4 id="_3-4-2-client" tabindex="-1"><a class="header-anchor" href="#_3-4-2-client" aria-hidden="true">#</a> 3.4.2 Client</h4>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>node_name <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"consul_client_01"</span></span>
datacenter <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"vm-dc"</span></span>
client_addr <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"0.0.0.0"</span></span>
bind_addr <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"192.168.100.54"</span></span>
encrypt <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"h65lqS3w4x42KP+n4Hn9RtK84Rx7zP3WSahZSyD5i1o="</span></span>
data_dir <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/var/lib/consul"</span></span>
retry_join <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"192.168.100.51"</span></span><span class="token punctuation">,</span><span class="token string-literal"><span class="token string">"192.168.100.52"</span></span><span class="token punctuation">,</span><span class="token string-literal"><span class="token string">"192.168.100.53"</span></span><span class="token punctuation">]</span>
cert_file <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/consul-cert/vm-dc-client-consul-0.pem"</span></span>
key_file <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/consul-cert/vm-dc-client-consul-0-key.pem"</span></span>
ca_file <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/root/consul-cert/consul-agent-ca.pem"</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>node_name, bind_addr는 각 Client 맞게 구성합니다.</li>
<li>data_dir : Consul의 데이터를 저장할 경로이며 미리 생성해야 합니다.</li>
<li>retry_join : Consul 서버의 IP를 기입합니다.</li>
<li>cert_file / key_file / ca_file : 앞서 생성한 Client 인증서들의 경로와 파일명을 기입합니다.</li>
</ul>
<h4 id="_3-4-3-consul-서비스-구성-option" tabindex="-1"><a class="header-anchor" href="#_3-4-3-consul-서비스-구성-option" aria-hidden="true">#</a> 3.4.3 Consul 서비스 구성 (Option)</h4>
<p>Linux 환경이나 Windows환경에서 서비스로 구성하면 시스템 부팅 시 자동으로 시작할 수 있기 때문에 선호되는 설치 방식 중 하나입니다. 이미 설치된 상태라면 앞서 구성을 변경하고 <code v-pre>consul reload</code>를 사용하여 구성을 다시 읽어오거나 리스타트 합니다.</p>
<details class="hint-container details"><summary>LINUX</summary>
<p><code v-pre>/etc/systemd/system/consul.service</code>에 다음의 서비스 파일을 작성합니다. 필요에 따라 User와 Group을 추가하여 구성하는 것도 가능합니다. 여기서는 consul User를 구성하여 사용하였습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token punctuation">[</span>Unit<span class="token punctuation">]</span>
<span class="token assign-left variable">Description</span><span class="token operator">=</span>Consul Service Discovery Agent
<span class="token assign-left variable">Documentation</span><span class="token operator">=</span>https://www.consul.io/
<span class="token assign-left variable">After</span><span class="token operator">=</span>network-online.target
<span class="token assign-left variable">Wants</span><span class="token operator">=</span>network-online.target

<span class="token punctuation">[</span>Service<span class="token punctuation">]</span>
<span class="token assign-left variable">Type</span><span class="token operator">=</span>simple
<span class="token assign-left variable">User</span><span class="token operator">=</span>consul
<span class="token assign-left variable">Group</span><span class="token operator">=</span>consul
<span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/local/bin/consul agent -config-dir<span class="token operator">=</span>/etc/consul.d

<span class="token assign-left variable">ExecReload</span><span class="token operator">=</span>/bin/kill <span class="token parameter variable">-HUP</span> <span class="token variable">$MAINPID</span>
<span class="token assign-left variable">KillSignal</span><span class="token operator">=</span>SIGINT
<span class="token assign-left variable">TimeoutStopSec</span><span class="token operator">=</span><span class="token number">5</span>
<span class="token assign-left variable">Restart</span><span class="token operator">=</span>on-failure
<span class="token assign-left variable">SyslogIdentifier</span><span class="token operator">=</span>consul

<span class="token punctuation">[</span>Install<span class="token punctuation">]</span>
<span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>등록된 서비스를 활성화 하고 시작하여 상대를 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ systemctl <span class="token builtin class-name">enable</span> consul
$ systemctl start consul
$ systemctl status consul
● consul.service - Consul Service Discovery Agent
   Loaded: loaded <span class="token punctuation">(</span>/etc/systemd/system/consul.service<span class="token punctuation">;</span> enabled<span class="token punctuation">;</span> vendor preset: disabled<span class="token punctuation">)</span>
   Active: active <span class="token punctuation">(</span>running<span class="token punctuation">)</span> since 토 <span class="token number">2020</span>-11-14 <span class="token number">19</span>:05:39 UTC<span class="token punctuation">;</span> 17h ago
     Docs: https://www.consul.io/
 Main PID: <span class="token number">1020</span> <span class="token punctuation">(</span>consul<span class="token punctuation">)</span>
   CGroup: /system.slice/consul.service
           └─1020 /usr/local/bin/consul agent -config-dir<span class="token operator">=</span>/etc/consul.d
           
$ journalctl <span class="token parameter variable">-u</span> consul <span class="token parameter variable">-f</span>
<span class="token number">11</span>월 <span class="token number">15</span> <span class="token number">13</span>:06:12 cl01-consul-vault-0 consul<span class="token punctuation">[</span><span class="token number">1020</span><span class="token punctuation">]</span>: <span class="token number">2020</span>-11-15T13:06:12.265Z <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  agent.server: Handled event <span class="token keyword">for</span> <span class="token for-or-select variable">server</span> <span class="token keyword">in</span> area: <span class="token assign-left variable">event</span><span class="token operator">=</span>member-join <span class="token assign-left variable">server</span><span class="token operator">=</span>consul-consul-server-1.tsis-k8s <span class="token assign-left variable">area</span><span class="token operator">=</span>wan
<span class="token number">11</span>월 <span class="token number">15</span> <span class="token number">13</span>:06:18 cl01-consul-vault-0 consul<span class="token punctuation">[</span><span class="token number">1020</span><span class="token punctuation">]</span>: <span class="token number">2020</span>-11-15T13:06:18.119Z <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  agent.server.memberlist.wan: memberlist: Suspect consul-consul-server-0.tsis-k8s has failed, no acks received
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<details class="hint-container details"><summary>WINDOWS</summary>
<p>Powershell을 활용하여 서비스를 구성합니다.</p>
<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre v-pre class="language-powershell"><code>> <span class="token function">sc</span><span class="token punctuation">.</span>exe create <span class="token string">"Consul"</span> binPath= <span class="token string">"consul agent -config-dir=C:\ProgramData\consul\config"</span> <span class="token function">start</span>= auto
<span class="token namespace">[SC]</span> CreateService SUCCESS

> <span class="token function">sc</span><span class="token punctuation">.</span>exe <span class="token function">start</span> <span class="token string">"Consul"</span>

SERVICE_NAME: Consul
        <span class="token function">TYPE</span>               : 10  WIN32_OWN_PROCESS
        STATE              : 4  RUNNING <span class="token punctuation">(</span>STOPPABLE<span class="token punctuation">,</span> NOT_PAUSABLE<span class="token punctuation">,</span> ACCEPTS_SHUTDOWN<span class="token punctuation">)</span>
        WIN32_EXIT_CODE    : 0  <span class="token punctuation">(</span>0x0<span class="token punctuation">)</span>
        SERVICE_EXIT_CODE  : 0  <span class="token punctuation">(</span>0x0<span class="token punctuation">)</span>
        CHECKPOINT         : 0x0
        WAIT_HINT          : 0x0
        PID                : 8008
        FLAGS              :
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<h4 id="_3-4-4-federation-확인-option" tabindex="-1"><a class="header-anchor" href="#_3-4-4-federation-확인-option" aria-hidden="true">#</a> 3.4.4 Federation 확인 (Option)</h4>
<p>Secondary Datacenter인 BM/VM 환경에서 <code v-pre>primary_datacenter</code>를 지정하였기 때문에 기동 후 Kubernetes의 Consul과 Join되어 Federation이 구성됩니다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/consul-datacenter-dropdown.png" alt="Consul-Federation" tabindex="0" loading="lazy"><figcaption>Consul-Federation</figcaption></figure>
<h2 id="_4-bm-vm-환경의-mesh-gateway-구성" tabindex="-1"><a class="header-anchor" href="#_4-bm-vm-환경의-mesh-gateway-구성" aria-hidden="true">#</a> 4. BM/VM 환경의 Mesh Gateway 구성</h2>
<p>Mesh Gateway를 구성하여 Service Mesh 환경이 멀티/하이브리드 Datacenter 환경을 지원하도록 합니다. Mesh Gateway는 Consul의 내장 Proxy로는 동작하지 못하므로 Envoy 를 설치하여 이를 활용합니다.</p>
<h3 id="_4-1-envoy-설치" tabindex="-1"><a class="header-anchor" href="#_4-1-envoy-설치" aria-hidden="true">#</a> 4.1 Envoy 설치</h3>
<p>Consul의 각 버전별 지원하는 Envoy 버전은 다음 표와 같습니다.</p>
<table>
<thead>
<tr>
<th style="text-align:left">Consul Version</th>
<th style="text-align:left">Compatible Envoy Versions</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">1.10.x</td>
<td style="text-align:left">1.18.3, 1.17.3, 1.16.4, 1.15.5</td>
</tr>
<tr>
<td style="text-align:left">1.9.x</td>
<td style="text-align:left">1.16.0, 1.15.2, 1.14.5‡, 1.13.6‡</td>
</tr>
<tr>
<td style="text-align:left">1.8.x</td>
<td style="text-align:left">1.14.5, 1.13.6, 1.12.7, 1.11.2</td>
</tr>
<tr>
<td style="text-align:left">1.7.x</td>
<td style="text-align:left">1.13.6, 1.12.7, 1.11.2, 1.10.0*</td>
</tr>
<tr>
<td style="text-align:left">1.6.x, 1.5.3, 1.5.2</td>
<td style="text-align:left">1.11.1, 1.10.0, 1.9.1, 1.8.0†</td>
</tr>
<tr>
<td style="text-align:left">1.5.1, 1.5.0</td>
<td style="text-align:left">1.9.1, 1.8.0†</td>
</tr>
<tr>
<td style="text-align:left">1.4.x, 1.3.x</td>
<td style="text-align:left">1.9.1, 1.8.0†, 1.7.0†</td>
</tr>
</tbody>
</table>
<div class="hint-container warning">
<p class="hint-container-title">경고</p>
<p>‡ Consul 1.9.x는 1.15.0+의 Envoy를 권장합니다.<br>
† 1.9.1 버전 이하의 Envoy는 <a href="https://github.com/envoyproxy/envoy/issues/6434" target="_blank" rel="noopener noreferrer">CVE-2019-9900<ExternalLinkIcon/></a>, <a href="https://github.com/envoyproxy/envoy/issues/6435" target="_blank" rel="noopener noreferrer">CVE-2019-9901<ExternalLinkIcon/></a> 취약점이 보고되었습니다.<br>
* Consul 1.7.x에서 Envoy 1.10.0을 사용하는 경우 <code v-pre>consul connect envoy</code> 커맨드 사용시  <code v-pre>-envoy-version</code> 옵션을 포함해야합니다.</p>
</div>
<p><a href="https://www.envoyproxy.io/docs/envoy/latest/start/install" target="_blank" rel="noopener noreferrer">Envoy 웹사이트<ExternalLinkIcon/></a> 에서 직접 Envoy의 컨테이너 기반 빌드를 얻거나 <a href="https://func-e.io/" target="_blank" rel="noopener noreferrer">func-e.io<ExternalLinkIcon/></a> 와 같은 3rd party 프로젝트에서 Envoy 바이너리 빌드 패키지를 얻을 수 있습니다.</p>
<p>다음 명령을 실행하여 Envoy를 가져와 설치하는 <code v-pre>func-e</code> 유틸리티를 다운로드하고 설치합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-L</span> https://func-e.io/install.sh <span class="token operator">|</span> <span class="token function">bash</span> <span class="token parameter variable">-s</span> -- <span class="token parameter variable">-b</span> /usr/local/bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>다음과 같이 대상 환경을 지정할 수 있습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">FUNC_E_PLATFORM</span><span class="token operator">=</span>darwin/amd64
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><details class="hint-container details"><summary>Go (Golang) GOOS and GOARCH</summary>
<h2 id="a-list-of-goos-goarch-supported-by-go-out-of-the-box" tabindex="-1"><a class="header-anchor" href="#a-list-of-goos-goarch-supported-by-go-out-of-the-box" aria-hidden="true">#</a> A list of GOOS/GOARCH supported by <code v-pre>go</code> out of the box</h2>
<ul>
<li><code v-pre>aix/ppc64</code></li>
<li><code v-pre>darwin/386</code></li>
<li><code v-pre>darwin/amd64</code></li>
<li><code v-pre>dragonfly/amd64</code></li>
<li><code v-pre>freebsd/386</code></li>
<li><code v-pre>freebsd/amd64</code></li>
<li><code v-pre>freebsd/arm</code></li>
<li><code v-pre>freebsd/arm64</code></li>
<li><code v-pre>illumos/amd64</code></li>
<li><code v-pre>js/wasm</code></li>
<li><code v-pre>linux/386</code></li>
<li><code v-pre>linux/amd64</code></li>
<li><code v-pre>linux/arm</code></li>
<li><code v-pre>linux/arm64</code></li>
<li><code v-pre>linux/ppc64</code></li>
<li><code v-pre>linux/ppc64le</code></li>
<li><code v-pre>linux/mips</code></li>
<li><code v-pre>linux/mipsle</code></li>
<li><code v-pre>linux/mips64</code></li>
<li><code v-pre>linux/mips64le</code></li>
<li><code v-pre>linux/riscv64</code></li>
<li><code v-pre>linux/s390x</code></li>
<li><code v-pre>netbsd/386</code></li>
<li><code v-pre>netbsd/amd64</code></li>
<li><code v-pre>netbsd/arm</code></li>
<li><code v-pre>netbsd/arm64</code></li>
<li><code v-pre>openbsd/386</code></li>
<li><code v-pre>openbsd/amd64</code></li>
<li><code v-pre>openbsd/arm</code></li>
<li><code v-pre>openbsd/arm64</code></li>
<li><code v-pre>plan9/386</code></li>
<li><code v-pre>plan9/amd64</code></li>
<li><code v-pre>plan9/arm</code></li>
<li><code v-pre>solaris/amd64</code></li>
<li><code v-pre>windows/386</code></li>
<li><code v-pre>windows/amd64</code></li>
<li><code v-pre>windows/arm</code></li>
</ul>
<h2 id="a-list-of-32-bit-goos-goarch-supported-by-go-out-of-the-box" tabindex="-1"><a class="header-anchor" href="#a-list-of-32-bit-goos-goarch-supported-by-go-out-of-the-box" aria-hidden="true">#</a> A list of 32-bit GOOS/GOARCH supported by <code v-pre>go</code> out of the box</h2>
<ul>
<li><code v-pre>darwin/386</code></li>
<li><code v-pre>freebsd/386</code></li>
<li><code v-pre>freebsd/arm</code></li>
<li><code v-pre>linux/386</code></li>
<li><code v-pre>linux/arm</code></li>
<li><code v-pre>linux/mips</code></li>
<li><code v-pre>linux/mipsle</code></li>
<li><code v-pre>netbsd/386</code></li>
<li><code v-pre>netbsd/arm</code></li>
<li><code v-pre>openbsd/386</code></li>
<li><code v-pre>openbsd/arm</code></li>
<li><code v-pre>plan9/386</code></li>
<li><code v-pre>plan9/arm</code></li>
<li><code v-pre>windows/386</code></li>
<li><code v-pre>windows/arm</code></li>
</ul>
<h2 id="a-list-of-64-bit-goos-goarch-supported-by-go-out-of-the-box" tabindex="-1"><a class="header-anchor" href="#a-list-of-64-bit-goos-goarch-supported-by-go-out-of-the-box" aria-hidden="true">#</a> A list of 64-bit GOOS/GOARCH supported by <code v-pre>go</code> out of the box</h2>
<ul>
<li><code v-pre>aix/ppc64</code></li>
<li><code v-pre>darwin/amd64</code></li>
<li><code v-pre>dragonfly/amd64</code></li>
<li><code v-pre>freebsd/amd64</code></li>
<li><code v-pre>freebsd/arm64</code></li>
<li><code v-pre>illumos/amd64</code></li>
<li><code v-pre>js/wasm</code></li>
<li><code v-pre>linux/amd64</code></li>
<li><code v-pre>linux/arm64</code></li>
<li><code v-pre>linux/ppc64</code></li>
<li><code v-pre>linux/ppc64le</code></li>
<li><code v-pre>linux/mips64</code></li>
<li><code v-pre>linux/mips64le</code></li>
<li><code v-pre>linux/riscv64</code></li>
<li><code v-pre>linux/s390x</code></li>
<li><code v-pre>netbsd/amd64</code></li>
<li><code v-pre>netbsd/arm64</code></li>
<li><code v-pre>openbsd/amd64</code></li>
<li><code v-pre>openbsd/arm64</code></li>
<li><code v-pre>plan9/amd64</code></li>
<li><code v-pre>solaris/amd64</code></li>
<li><code v-pre>windows/amd64</code></li>
</ul>
</details>
<p>특정 버전을 명시하여 다운로드 하려면 다음 명령을 실행합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>func-e use <span class="token number">1.18</span>.3
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Envoy 바이너리를 <code v-pre>$PATH</code>의 위치에 복사합니다. 이를 통해 Consul은 바이너리 위치를 지정하지 않고 Envoy를 자동으로 시작할 수 있습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">cp</span> ~/.func-e/versions/1.18.3/bin/envoy /usr/local/bin/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>다음 명령을 실행하여 Envoy가 <code v-pre>$PATH</code>에 있는지 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>envoy <span class="token parameter variable">--version</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_4-2-mesh-gateway-실행" tabindex="-1"><a class="header-anchor" href="#_4-2-mesh-gateway-실행" aria-hidden="true">#</a> 4.2 Mesh Gateway 실행</h3>
<p>Mesh Gateway는 TLS를 필요로하며 Consul과도 TLS로 통신 합니다. 따라서 Consul로의 기본 접속 방식과 포트를 SSL기준으로 설정하여 실행합니다. 또한 앞서 Consul Client를 위해 생성한 인증서를 활용합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">CONSUL_HTTP_SSL</span><span class="token operator">=</span>true
$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">CONSUL_HTTP_ADDR</span><span class="token operator">=</span>https://127.0.0.1:8501
$ consul connect envoy <span class="token parameter variable">-gateway</span><span class="token operator">=</span>mesh <span class="token parameter variable">-register</span> -expose-servers <span class="token punctuation">\</span>
  <span class="token parameter variable">-service</span> <span class="token string">"mesh-gateway-secondary"</span> <span class="token punctuation">\</span>
  -ca-file<span class="token operator">=</span>/root/consul-cert/consul-agent-ca.pem <span class="token punctuation">\</span>
  -client-cert<span class="token operator">=</span>/root/consul-cert/vm-dc-client-consul-0.pem <span class="token punctuation">\</span>
  -client-key<span class="token operator">=</span>/root/consul-cert/vm-dc-client-consul-0-key.pem <span class="token punctuation">\</span>
  <span class="token parameter variable">-address</span> <span class="token string">'{{ GetInterfaceIP "lo" }}:9100'</span> <span class="token punctuation">\</span>
  -wan-address <span class="token string">'{{ GetInterfaceIP "eth0" }}:9100'</span> -admin-bind<span class="token operator">=</span><span class="token number">127.0</span>.0.1:19001 <span class="token operator">&amp;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>service : Consul에 등록되는 Mesh Gateway의 서비스 이름 입니다.</li>
<li>GetInterfaceIP : Consul에서 사용하는 템플릿 값입니다. 이렇게 작성하면 Network설정에서 해당 인터페이스에 지정된 IP를 받아올 수 있습니다.</li>
<li>admin-bind : Envoy의 관리자 바인딩을 설정합니다. 동일한 호스트에서 여러개의 Envoy를 실행하는 경우 Admin Port가 중복될 수 있습니다. 기본값은 19000 입니다.</li>
<li>백그라운드 실행을 위해 끝에 <code v-pre>&amp;</code>를 붙였습니다. 원하지 않으시면 제거하여 포그라운드로 띄우셔도 됩니다.</li>
</ul>
<p>실행 후에는 Consul UI에서도 해당 Mesh Gateway를 확인할 수 있습니다.</p>
<h2 id="_5-test-option" tabindex="-1"><a class="header-anchor" href="#_5-test-option" aria-hidden="true">#</a> 5 TEST (Option)</h2>
<blockquote>
<p>Frontend 애플리케이션을 BM/VM 환경에 구성하고 Backend를 Kubernetes에 구성하는 예제입니다.<br>
<a href="https://github.com/hashicorp/demo-consul-101" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/demo-consul-101<ExternalLinkIcon/></a></p>
</blockquote>
<details class="hint-container details"><summary>FOR TEST</summary>
<h3 id="_5-1-counting-service-backend-on-kubernetes" tabindex="-1"><a class="header-anchor" href="#_5-1-counting-service-backend-on-kubernetes" aria-hidden="true">#</a> 5.1 Counting Service(Backend) on Kubernetes</h3>
<p>앞서 <a href="#2.2.6-%ED%85%8C%EC%8A%A4%ED%8A%B8%EB%A5%BC-%EC%9C%84%ED%95%9C-pod-%EC%83%9D%EC%84%B1">2.2.6 테스트를 위한 Pod 생성</a>의 counting 서비스를 활용합니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> counting
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> counting
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">'consul.hashicorp.com/service-tags'</span><span class="token punctuation">:</span> servicemesh<span class="token punctuation">,</span> consul<span class="token punctuation">,</span> counting<span class="token punctuation">,</span> v1
    <span class="token key atrule">'consul.hashicorp.com/connect-inject'</span><span class="token punctuation">:</span> <span class="token string">'true'</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> counting
      <span class="token key atrule">image</span><span class="token punctuation">:</span> hashicorp/counting<span class="token punctuation">-</span>service<span class="token punctuation">:</span>0.0.2
      <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">9001</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> http
  <span class="token key atrule">serviceAccountName</span><span class="token punctuation">:</span> counting
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-2-dashboard-service-frontend-on-bm-vm" tabindex="-1"><a class="header-anchor" href="#_5-2-dashboard-service-frontend-on-bm-vm" aria-hidden="true">#</a> 5.2 DashBoard Service(Frontend) on BM/VM</h3>
<p>BM/VM 환경에서 Frontend 애플리케이션을 구성합니다. Envoy Proxy를 Sidecar로 구성하여 Service Mesh를 위한 구성을 하고, 다른 Consul 데이터센터에 있는 서비스를 찾을 수 있도록 합니다.</p>
<blockquote>
<p><a href="https://github.com/hashicorp/demo-consul-101/tree/master/services/dashboard-service" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/demo-consul-101/tree/master/services/dashboard-service<ExternalLinkIcon/></a></p>
<p>애플리케이션 실행을 위해서는  golang이 설치되어야 합니다.</p>
</blockquote>
<p>Dashboard 애플리케이션을 실행합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token assign-left variable">PORT</span><span class="token operator">=</span><span class="token number">9003</span> <span class="token assign-left variable">COUNTING_SERVICE_URL</span><span class="token operator">=</span><span class="token string">"http://localhost:5000"</span> go run main.go <span class="token operator">&amp;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>PORT : Dashboard 애플리케이션에서 사용하는 포트를 정의합니다.</li>
<li>COUNTING_SERVICE_URL : Backend 애플리케이션인 Counting Service에 대한 정보입니다. 없는 경우 기본 값은 &quot;<a href="http://localhost:9001" target="_blank" rel="noopener noreferrer">http://localhost:9001<ExternalLinkIcon/></a>&quot; 입니다.</li>
</ul>
<p>9003으로 실행된 Dashboard 애플리케이션을 Consul에 서비스로 등록합니다. Consul의 기본 Configuration 디렉토리 위치에 해당 서비스 구성을 작성하고 읽어올 수 있습니다. (e.g. /etc/consul.d)</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token comment"># /etc/consul.d/dashboard.hcl</span>
service <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"dashboard-vm"</span></span>
  port <span class="token operator">=</span> <span class="token number">9003</span>

  connect <span class="token punctuation">{</span>
    sidecar_service <span class="token punctuation">{</span>
      proxy <span class="token punctuation">{</span>
        upstreams <span class="token operator">=</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            destination_name <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"counting"</span></span>
            datacenter <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"k8s-dc"</span></span>
            local_bind_port <span class="token operator">=</span> <span class="token number">5000</span>
            mesh_gateway <span class="token punctuation">{</span>
              mode <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"local"</span></span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  check <span class="token punctuation">{</span>
    id       <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"dashboard-check"</span></span>
    http     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"http://localhost:9003/health"</span></span>
    method   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"GET"</span></span>
    interval <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"1s"</span></span>
    timeout  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"1s"</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>connect에 Service Mesh 설정을 추가합니다.
<ul>
<li>destination_name : local_bind_port로 오는 요청을 어떤 서비스로 보낼지 정의합니다.</li>
<li>datacenter : 데이터센터 이름이 해당 서비스가 속한 데이터센터 이름과 다르면 외부 Mesh Gateway를 찾고, Federation 된 해당 Mesh Gateway로 요청을 전송합니다.</li>
</ul>
</li>
</ul>
<p>Dashboard 애플리케이션에서 <code v-pre>COUNTING_SERVICE_URL</code>의 대상을 5000번 포트로 지정하였기 때문에 upstream에서 바인딩되는 포트를 맞춰줍니다. 구성이 완료되면 <code v-pre>consul reload</code> 명령을 통해 구성 디렉토리의 파일을 반영하고 추가된 서비스를 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ consul reload
Configuration reload triggered

$ consul catalog services
consul
dashboard-vm
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>다음으로 Dashboard 서비스를 위한 Sidecar를 실행하고 추가된 서비스를 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ consul connect envoy -sidecar-for dashboard-vm <span class="token punctuation">\</span>
  -ca-file<span class="token operator">=</span>/root/consul-cert/consul-agent-ca.pem <span class="token punctuation">\</span>
  -client-cert<span class="token operator">=</span>/root/consul-cert/vm-dc-client-consul-0.pem <span class="token punctuation">\</span>
  -client-key<span class="token operator">=</span>/root/consul-cert/vm-dc-client-consul-0-key.pem <span class="token operator">&amp;</span>
  
$ consul catalog services
consul
dashboard-vm
dashboard-vm-sidecar-proxy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이제 구성된 9003번 포트를 통해 Frontend에서 외부 데이터센터의 Backend로 요청이 되는지 확인합니다.</p>
<figure><img src="https://learn.hashicorp.com/img/consul/connect-getting-started/screenshot1.png" alt="Dashiboard" tabindex="0" loading="lazy"><figcaption>Dashiboard</figcaption></figure>
<h3 id="_5-3-intention" tabindex="-1"><a class="header-anchor" href="#_5-3-intention" aria-hidden="true">#</a> 5.3 Intention</h3>
<p>Sidecar기능이 활성화 되면서 Consul의 Intention기능을 사용할 수 있습니다. Intention을 통해 동적으로 서비스에 대한 트래픽을 통제할 수 있습니다.</p>
<p>UI 또는 CLI를 통해 <code v-pre>dashboard-vm</code>이 <code v-pre>counting</code>에 접근할 수 없도록 정의합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ consul intention create <span class="token parameter variable">-deny</span> <span class="token parameter variable">-replace</span> dashboard-vm counting
Created: dashboard-vm <span class="token operator">=</span><span class="token operator">></span> counting <span class="token punctuation">(</span>deny<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Edit Intention - Consul 2020-11-16 00-27-50.png" alt="Edit Intention - Consul 2020-11-16 00-27-50" tabindex="0" loading="lazy"><figcaption>Edit Intention - Consul 2020-11-16 00-27-50</figcaption></figure>
<p>접근할 수 없게 설정되었기 때문에 Sidecar에 주입된 설정으로 Dashboard에서는 Counting서비스에 접근할 수 없다는 메시지를 출력합니다.</p>
<figure><img src="https://learn.hashicorp.com/img/consul/connect-getting-started/screenshot2.png" alt="Dashboard-intention" tabindex="0" loading="lazy"><figcaption>Dashboard-intention</figcaption></figure>
</details>
</div></template>


