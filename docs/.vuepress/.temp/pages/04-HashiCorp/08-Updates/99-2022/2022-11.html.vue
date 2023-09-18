<template><div><h1 id="_2022년-11월" tabindex="-1"><a class="header-anchor" href="#_2022년-11월" aria-hidden="true">#</a> 2022년 11월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>
<p>Hashiconf Global</p>
<ul>
<li>
<p><a href="https://www.hashicorp.com/blog/hashiconf-global-2022-from-zero-trust-to-no-code" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></p>
</li>
<li>
<p>Day 1: ZTS (Zero Trust Security) 와 Cloud Service Networking 을 메인 주제로 새로운 기능과 HCP 서비스에 대한 소개</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/hcp-boundary-now-ga-bolsters-hashicorp-s-zero-trust-security-solution" target="_blank" rel="noopener noreferrer">HCP Boundary GA<ExternalLinkIcon/></a>: Opensource 버전만 지원하던 Boundary 에 대해 HCP Version 공식 출시</li>
<li><a href="https://www.hashicorp.com/blog/hcp-vault-on-microsoft-azure-now-in-public-beta" target="_blank" rel="noopener noreferrer">HCP Vault on Microsoft Azure Public Beta<ExternalLinkIcon/></a>: AWS 뿐만 아니라 Azure 사용자들도 HCP Vault 사용 가능</li>
<li><a href="https://www.hashicorp.com/blog/consul-1-14-beta-announcing-simplified-service-mesh-deployments" target="_blank" rel="noopener noreferrer">Consul Breaking Changes<ExternalLinkIcon/></a>: K8S 에서의 Component 간소화 및 기능강화, Windows 에 대한 Service Mesh 지원</li>
<li><a href="https://www.hashicorp.com/blog/hashicorp-developer-your-new-experience-for-docs-and-tutorials" target="_blank" rel="noopener noreferrer">Hashicorp Developer Portal<ExternalLinkIcon/></a> 개편: 8가지 전 제품군에 대한 공식 문서 및 Tutorial 총망라</li>
</ul>
</li>
<li>
<p>Day 2: Infrastructure 및 Application 자동화 관련 제품군을 메인 주제로 새로운 기능 소개</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/terraform-gains-visibility-self-service-and-compliance-upgrades" target="_blank" rel="noopener noreferrer">Terraform Cloud<ExternalLinkIcon/></a>: Self Service 및 Compliance 관련 기능 강화</li>
<li><a href="https://www.hashicorp.com/blog/nomad-1-4-adds-nomad-variables-and-updates-service-discovery" target="_blank" rel="noopener noreferrer">Nomad 1.4 GA<ExternalLinkIcon/></a>: 단독 제품으로서의 Service Discovery, Variable 등 기능 강화</li>
<li><a href="https://www.hashicorp.com/blog/announcing-hcp-waypoint-public-beta" target="_blank" rel="noopener noreferrer">HCP Waypoint Public Beta<ExternalLinkIcon/></a> 출시: Opensource 버전만 지원하던 Waypoint 의 HCP Version Public Beta 출시</li>
</ul>
</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>
<p>Terraform Cloud 신규 기능 (현재 모두 Beta, <a href="https://www.hashicorp.com/blog/terraform-gains-visibility-self-service-and-compliance-upgrades" target="_blank" rel="noopener noreferrer">Hashiconf Global 발표<ExternalLinkIcon/></a> 참고)</p>
<ul>
<li>
<p><a href="https://developer.hashicorp.com/terraform/cloud-docs/workspaces/health?_gl=1*cm2dqn*_ga*MjA4NTc1MTMyNy4xNjM4OTUwNzQ3*_ga_P7S46ZYEKW*MTY2NjYxMjg0NS4yMTkuMS4xNjY2NjEzMjM1LjAuMC4w#continuous-validation" target="_blank" rel="noopener noreferrer">Continous Validation<ExternalLinkIcon/></a>: Terraform 으로 Provisioning 한 (Day 0) Resource 에 대한 수동 변화를 감지하는 <a href="https://www.hashicorp.com/blog/drift-detection-for-terraform-cloud-is-now-generally-available" target="_blank" rel="noopener noreferrer">Drift Detection<ExternalLinkIcon/></a> 와 더불어 장기적 관리 및 유지보수 관점에서 필요한 사전 (Precondition) 및 사후 (Postcondition) 조건을 기반으로 Resource 의 상태를 점검하고 관리하는 기능</p>
</li>
<li>
<p><a href="https://developer.hashicorp.com/terraform/cloud-docs/no-code-provisioning/module-design?_gl=1*ilib11*_ga*MjA4NTc1MTMyNy4xNjM4OTUwNzQ3*_ga_P7S46ZYEKW*MTY2NjYxMjg0NS4yMTkuMS4xNjY2NjEzNDQwLjAuMC4w" target="_blank" rel="noopener noreferrer">No-Code Provisioning<ExternalLinkIcon/></a>: Terraform 에 대해 Code 작성과 같은 기본 지식 또는 Module 과 같은 고급 지식에 대한 이해 없이 최소한의 변수 정보 입력만으로 Terraform 기반의 Workspace 생성 부터 Resource Provisioning 까지 사용할 수 있게 지원하는 Self-Service 특화 기능</p>
</li>
<li>
<p><a href="https://developer.hashicorp.com/terraform/cloud-docs/policy-enforcement/opa" target="_blank" rel="noopener noreferrer">OPA (Open Policy Agent)<ExternalLinkIcon/></a> 기반 정책 관리: Rego 정책 언어 기반 OPA 릴 지원하여 기존에 OPA 기반 표준 정책 수립한 사용자도 손쉽게 Terraform Cloud 에 Import 하여 정책 기반 Resource Provisioning 을 지원하는 기능</p>
</li>
</ul>
</li>
<li>
<p>CLI</p>
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.3.3" target="_blank" rel="noopener noreferrer">1.33 Release<ExternalLinkIcon/></a>
<ul>
<li>이미 삭제됐으나, Code 상에 존재하는 Resource 삭제 시 발생하는 오류 개선</li>
</ul>
</li>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li>
<p><a href="https://www.terraform.io/enterprise/releases/2022/v202208-3" target="_blank" rel="noopener noreferrer">10월 Release<ExternalLinkIcon/></a> 출시 (v202210-1)</p>
</li>
<li>
<p>필수 Upgrade Version: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202207-2, v202204-2)</p>
</li>
<li>
<p>PostgresSQL 버전 10 지원종료: TFE 에 대해 External PostgresSQL 사용하는 경우 최소 버전 12 이상으로 Upgrade 필요</p>
<ul>
<li>2023년 2월 release (v202302-1) 을 기점으로 PostgresSQL 버전 11 지원 종료 예정</li>
</ul>
</li>
<li>
<p>구버전 OS 지원종료: 2023년 2월 release (v202302-1) 을 기점으로 아래 OS 목록에 대해 지원 종료</p>
<ul>
<li>
<p>Debian 8, 9</p>
</li>
<li>
<p>Ubuntu 14.04, 16.04</p>
</li>
<li>
<p>Amazon Linux 2014.03, 2014.09, 2015.03, 2015.09, 2016.03, 2016.09, 2017.03, 2017.09, 2018.03</p>
</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>
<p>Provider</p>
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.36.0" target="_blank" rel="noopener noreferrer">AWS v4.36.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>aws_lightsail 관련 resource 추가</li>
<li>aws_route53_zone 에 대해 primary_name_server 설정 추가</li>
<li>aws_resourcegroups_group 에 대해 configuration 설정 추가</li>
<li>aws_sqs_queue 관련 오류 개선</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.28.0" target="_blank" rel="noopener noreferrer">Azure v3.28.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>azurerm_sentinel_data_connector 관련 resource 추가</li>
<li>azurerm_linux(windows)_web_app, azurerm_linux(windows)function_app 에 대해 certificate 관련 설정 추가</li>
<li>azurerm_storage_account 관련 account_tier 설정 추가</li>
<li>azurerm_linux(windows)_web_app, azurerm_linux(windows)function_app 에 대해 오류 개선</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.41.0" target="_blank" rel="noopener noreferrer">GCP v4.41.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>google_sql_user.sql_server_user_details 에 대해 read-only 만 가능하도록 수정</li>
<li>google_bigquery_table 에 대해 avro_options 설정 추가</li>
<li>google_container_node_pool 에 대해 node_config.0.guest_accelerator.0.gpu_sharing_config 설정 추가</li>
<li>google_filestore_instance 이 여러개 연속 생성 되도록 강제하는 조건 삭제</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>Vault
<ul>
<li><a href="https://www.hashicorp.com/blog/vault-1-12" target="_blank" rel="noopener noreferrer">1.12 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>상세 내용: <a href="https://github.com/hashicorp/vault/releases/tag/v1.12.0" target="_blank" rel="noopener noreferrer">CHANGELOG<ExternalLinkIcon/></a> 참고</li>
<li>PKI Secret Engine 관련 개선: RSA-PSS signature, telemetry, Google Cloud Key Manager 지원 등</li>
<li>PKCS #11 Provider 지원: HSM 연동 관련 기능 및 Oracle TDE 지원</li>
<li>Transform 관련 개선: BYOK, MSSQL 지원, Key 자동 Rotation 등</li>
</ul>
</li>
<li><a href="https://www.hashicorp.com/blog/hcp-vault-on-microsoft-azure-now-in-public-beta" target="_blank" rel="noopener noreferrer">HCP Vault on Azure (Public Beta)<ExternalLinkIcon/></a>: Azure 유럽 Region 에서 사용 가능</li>
</ul>
</li>
<li>Consul
<ul>
<li><a href="https://github.com/hashicorp/consul/releases/tag/v1.13.3" target="_blank" rel="noopener noreferrer">1.13.3 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>Ingress Gateway (Service Mesh) 에 대한 Upstream Max Connection 설정 개선</li>
<li>Terminating Gateway 및 Mesh Gateway (Service Mesh) 에 대한 TCP Keepalives 설정 추가</li>
<li>Agent Cache 관련 goroutine leak 발생 bug 수정</li>
<li>Snapshot Agent 관련 Session 조회 불가로 인한 Panic 발생 bug 수정</li>
</ul>
</li>
<li><a href="https://www.hashicorp.com/blog/consul-1-14-beta-announcing-simplified-service-mesh-deployments" target="_blank" rel="noopener noreferrer">1.14 Beta<ExternalLinkIcon/></a> (Hashiconf Global Announcement)
<ul>
<li>Consul Client on K8S 에 대한 구조변화: Daemonset 에서 Sidecar 방식으로 변경</li>
<li>Cluster Peering 기반 Service Failover 포함 Mesh Traffic Management 기능 개선</li>
<li>Windows 에 대한 Service Mesh 지원</li>
<li>AWS Lambda 에 대한 Service Mesh 지원</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li><a href="https://www.hashicorp.com/blog/nomad-1-4-adds-nomad-variables-and-updates-service-discovery" target="_blank" rel="noopener noreferrer">1.4 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>상세 내용: <a href="https://github.com/hashicorp/nomad/releases/tag/v1.4.0" target="_blank" rel="noopener noreferrer">CHANGELOG<ExternalLinkIcon/></a> 참고</li>
<li>기밀 정보 활용 위한 자체 KV, Variable 기능 추가</li>
<li>Service Discovery 기능 추가</li>
<li>ACL Token 기반 Policy 기능 추가</li>
<li>Web UI 에서 Task 단위 정보 출력 개선</li>
<li>Raft Version 2 지원 종료 (Upgrade 시 참고)</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


