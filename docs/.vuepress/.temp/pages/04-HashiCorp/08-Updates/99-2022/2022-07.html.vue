<template><div><h1 id="_2022년-7월" tabindex="-1"><a class="header-anchor" href="#_2022년-7월" aria-hidden="true">#</a> 2022년 7월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>
<p>HCP Boundary 출시 (Public Beta)</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/announcing-launch-and-free-public-beta-of-hcp-boundary" target="_blank" rel="noopener noreferrer">HCP Boundary 소개 Blog<ExternalLinkIcon/></a></li>
<li><a href="https://www.youtube.com/watch?v=p_Wbi12xliE" target="_blank" rel="noopener noreferrer">Hashicorp Korea Snapshot<ExternalLinkIcon/></a></li>
<li><a href="https://learn.hashicorp.com/collections/boundary/hcp-getting-started" target="_blank" rel="noopener noreferrer">HCP Boundary 시작하기<ExternalLinkIcon/></a></li>
<li>Hashicorp 는 모든 솔루션에 대해 사용자가 직접 설치하는 설치형 을 비롯해 이와 동일한 경험을 기반으로 SaaS 형태의 Cloud 서비스를 제공하고 있습니다. 지난 6월 21일, HCP Boundary 의 Public Beta 가 공개되어 무료 제공 중입니다.</li>
<li>AWS Platform 에 One click 으로 Cluster 생성 및 이용 가능하며 간단한 Network Peering 과정을 거쳐 AWS Platform 에 구성된 HVN (Hashicorp Virtual Network) 및 Cluster 와 사용자의 AWS 환경을 연결하여 미리 구성한 서비스들을 연동합니다. (AWS 지원 Region 확장 및 타 Cloud Platform 지원 예정)</li>
<li>HCP 계정 생성 시, <strong>USD 50불이 기본 Credit 으로 제공</strong>되며 이를 활용하여 Boundary Public Beta 외에도 다양한 Vault, Consul 과 같은 HCP Service 을 약 1개월간 체험해보실 수 있습니다.</li>
</ul>
</li>
<li>
<p>Hashicorp Developer Site 출시 (Public Beta)</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/new-hashicorp-developer-site-is-now-in-public-beta?fbclid=IwAR1_Snhw3Yiqai2J5qcvWUlE82yaslu1nlC3O2iWDe8-wCFFWNPbPr-dxx4" target="_blank" rel="noopener noreferrer">Hashicorp Developer Site 소개 Blog<ExternalLinkIcon/></a></li>
<li><a href="https://developer.hashicorp.com/" target="_blank" rel="noopener noreferrer">Hashicorp Developer Site<ExternalLinkIcon/></a></li>
<li>Tutorial 과 Reference Architecture 정보가 <a href="http://learn.hashicorp.com" target="_blank" rel="noopener noreferrer">learn.hashicorp.com<ExternalLinkIcon/></a> 을 비롯, 각 solution 별 website 에 파편화 되어 있어 Hashicorp Solution 을 보다 더 쉽게 이해하고 업무에 적용하는데에 어려움이 있었습니다. 새롭게 출시된 Hashicorp Developer Site 에서는 이러한 그동안 축적된 유용한 자료와 이를 테스트 해볼 수 있는 환경을 한 곳에 모아 통합 제공함으로써 보다 더 쉽게 Hashicorp Solution 을 경험할 수 있습니다.</li>
<li>Public Beta 기간에는 Hashicorp Solution 중 Vault 와 Waypoint 에 대해 이용 가능하고, 추후 모든 Solution 에 대해 제공 예정입니다.</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li><a href="https://www.hashicorp.com/blog/terraform-cloud-adds-drift-detection-for-infrastructure-management" target="_blank" rel="noopener noreferrer">Drift Detection for Terraform Cloud<ExternalLinkIcon/></a> (Public Beta)
<ul>
<li>대상 환경의 상태를 지속적으로 확인하여Cloud Console 등을 이용한 수동 자원 생성 및 변경으로 인해 Code 및 State 와 불일치하는 변경사항에 대해 감지하고 운영자에게 알림으로써 변경사항에 대한 적용 여부를 결정할 수 있도록 하여 시스템 운영 상에 위해가 될 수 있는 위험요소와 비용을 최소화하도록 지원하는 기능</li>
</ul>
</li>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/blob/v1.2.3/CHANGELOG.md#123-june-15-2022" target="_blank" rel="noopener noreferrer">1.23 Release<ExternalLinkIcon/></a>
<ul>
<li>Remote State Backend 지원 종료: artifactory, etcd, etcdv3, manta, swift</li>
</ul>
</li>
<li><a href="https://www.terraform.io/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://www.terraform.io/enterprise/releases/2022/v202206-1" target="_blank" rel="noopener noreferrer">6월 Release<ExternalLinkIcon/></a> 출시 (v202206-1)</li>
<li><a href="https://www.terraform.io/cloud-docs/workspaces/settings/run-tasks" target="_blank" rel="noopener noreferrer">Run Task<ExternalLinkIcon/></a> 기능 추가</li>
<li><a href="https://www.terraform.io/enterprise/admin/infrastructure/backup-restore" target="_blank" rel="noopener noreferrer">Backup/Restore API<ExternalLinkIcon/></a> 내 Backup Skip 기능 추가</li>
<li>CLI 1.2.1 지원</li>
<li>SAML Performance 문제 개선</li>
<li>VCS 설정시 Automatic speculative plans 활성화 관련 오류 수정</li>
<li>보안취약점 개선</li>
</ul>
</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.20.0" target="_blank" rel="noopener noreferrer">AWS v4.20.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>EC2 Instance 관련 신규 argument 추가</li>
<li>VPC Endpoint 관련 argument 추가</li>
<li>VPN Connection 지원 위한 argument 추가</li>
<li>ISO-partition tagging 관련 오류 수정</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.11.0" target="_blank" rel="noopener noreferrer">Azure v3.11.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>azurerm_resource_group_template_deployment 에 대한 data source 추가</li>
<li>azurerm_managed_disk 관련 export 지원 (disk_access_id 및 network_access_policy)</li>
<li>azurerm_mysql_flexible_server 에 할당되는 resource ID 관련 오류 수정</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.27.0" target="_blank" rel="noopener noreferrer">GCP v4.27.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>Compute 에 대한 NAT 설정 관련 argument 추가 (maxPortsPerVm)</li>
<li>Compute 에 대한 forwarding rule 설정 관련 argument 추가 (psc_connection_id, psc_connection_status)</li>
<li>Compute 에 대한 dynamic port allocation 관련 오류 수정</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>Vault
<ul>
<li><a href="https://www.hashicorp.com/blog/vault-1-11" target="_blank" rel="noopener noreferrer">1.11 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>K8S Secret Engine: K8S Cluster 에서 사용되는 Service Account Token 에 대한 Dynamic Secret 발행 및 관리</li>
<li>Integrated Storage Autopilot: <a href="https://www.vaultproject.io/docs/enterprise/automated-upgrades?_gl=1*1pfp1zr*_ga*MTA4MTgxMjU2NC4xNjM4ODI3NDM4*_ga_P7S46ZYEKW*MTY1NjM5MzQ0NS43LjAuMTY1NjM5MzQ0NS4w&amp;_ga=2.18692156.469231660.1656292338-1081812564.1638827438#automated-upgrades" target="_blank" rel="noopener noreferrer">Cluster 자동 업그레이드<ExternalLinkIcon/></a> 및 <a href="https://www.vaultproject.io/docs/enterprise/redundancy-zones?_gl=1*1pfp1zr*_ga*MTA4MTgxMjU2NC4xNjM4ODI3NDM4*_ga_P7S46ZYEKW*MTY1NjM5MzQ0NS43LjAuMTY1NjM5MzQ0NS4w&amp;_ga=2.18692156.469231660.1656292338-1081812564.1638827438#redundancy-zones" target="_blank" rel="noopener noreferrer">Redundancy Zones<ExternalLinkIcon/></a> 기능 기반 가용성 및 확장성 확보</li>
<li>Transit Secret Engine: Transit 이용 시 외부키 import 및 활용 추가</li>
<li>Transform Secret Engine: 동일 data 에 대한 convergent tokenization 기능 추가</li>
<li>Snowflake DB Secret Engine: RSA key pair credential 기반 접속정보 관리</li>
</ul>
</li>
</ul>
</li>
<li>Consul
<ul>
<li><a href="https://www.hashicorp.com/blog/hcp-consul-on-azure-to-go-ga-plus-more-consul-news" target="_blank" rel="noopener noreferrer">HCP Consul on Azure<ExternalLinkIcon/></a>
<ul>
<li>기존 AWS 환경 기반 제공중인 HCP SaaS 서비스 중 Consul 에 대해 Azure 환경 기반 제공 (2022년 7월 예정)</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li><a href="https://www.hashicorp.com/blog/nomad-1-3-adds-native-service-discovery-and-edge-workload-support" target="_blank" rel="noopener noreferrer">1.13 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>Service Discovery 내장: Consul 연동 없이 자체 Service Discovery 기능 지원</li>
<li>Edge compute improvements: Network 단절 된 Client 가 재연결 시도 시 재시작 되는 문제 관련 개선</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


