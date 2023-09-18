<template><div><h1 id="_2023년-1월" tabindex="-1"><a class="header-anchor" href="#_2023년-1월" aria-hidden="true">#</a> 2023년 1월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>
<p>Dynamic Secrets for Waypoint with Vault</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/dynamic-secrets-for-waypoint-with-vault" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>Application 에 대한 Build, Deployment 및 Monitoring 을 간소화하고 쉽게 접근할 수 있도록 개발자를 지원하는 Waypoint 에서도 이제 Vault 와 연동하여 Hashicorp Vault config sourcer plugin 을 통해 Application Config 에 포함되는 보안 정보를 관리할 수 있습니다.</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.3." target="_blank" rel="noopener noreferrer">1.3.6 Release<ExternalLinkIcon/></a>
<ul>
<li>Module Output 관련 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases/2022/v202212-2" target="_blank" rel="noopener noreferrer">12월 Release<ExternalLinkIcon/></a> 출시 (v202212-2)</li>
<li>필수 Upgrade Version: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202207-2, v202204-2)</li>
<li>2023년 2월 Release (v202302-1) 을 기점으로 구버전 OS 및 Postrgres DB 에 대한 지원 종료
<ul>
<li>
<p>대상 OS</p>
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
<li>
<p>대상 Postgres</p>
<ul>
<li>Postgres 11</li>
<li>TFE 에 대해 External PostgresSQL 사용하는 경우 최소 버전 12 이상으로 Upgrade 필요 (Release 659 부터 적용)</li>
</ul>
</li>
</ul>
</li>
<li>CA Bundle 관련 이슈로 인해 발생하는 HTTPS endpoint 접속 관련 Sentinel 정책 오류 수정</li>
<li>sentinel, cost-estimation, plan-exporter 등을 처리하는 tfe-nomad container 에 대해 성능 및 안정성 제고를 위해 tfe-task-worker 로 대체.</li>
<li><a href="https://developer.hashicorp.com/terraform/cloud-docs/workspaces/settings/run-tasks#associating-run-tasks-with-a-workspace" target="_blank" rel="noopener noreferrer">Pre-plan 및 Pre-Apply 를 위한 Run Task<ExternalLinkIcon/></a> 지원</li>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/api-docs/workspaces#list-workspaces" target="_blank" rel="noopener noreferrer">List Workspaces API endpoint<ExternalLinkIcon/></a> 사용 시 wildcard 매칭 지원</li>
<li>terraform apply 진행 도중 취소 시 해당 resource 의 상태 정보에 대해 'unknown' 으로 출력하도록 개선</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.48.0" target="_blank" rel="noopener noreferrer">AWS v4.48.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>aws_eks_node_group 에 대해 WINDOWS_CORE_2019_x86_64, WINDOWS_CORE_2022_x86_64 등 Windows OS 기반 Node 사용 지원</li>
<li>aws_networkfirewall_rule_group 에 대해 reference_sets 지원</li>
<li>aws_networkmanager_vpc_attachment 에 대해 options.appliance_mode_support 지원</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.37.0" target="_blank" rel="noopener noreferrer">Azure v3.37.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가: azurerm_coginitive_deployment, azurerm_billing_account_cost_management_export, azurerm_key_vault_certificate_contacts, azurerm_lab_service_plan, azurerm_resource_deployment_script, azurerm_spring_cloud_customized_accelerator 등</li>
<li>azurerm_netapp_volume 에 대해 zone 설정 추가</li>
<li>azurerm_virtual_network_gateway_connection 에 대해 다른 resource group 에서 생성 안되는 오류 개선</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.47.0" target="_blank" rel="noopener noreferrer">GCP v4.47.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource: google_alloydb_backup, google_filestore_backup</li>
<li>compute 에 대해 ipv6_access_type 설정 지원</li>
<li>container 에 대해 autoscaling 에 대한 default 설정 지원 추가</li>
<li>container 에 대해 gke gateway api controller 지원을 위한 gateway_api_config 설정 추가</li>
<li>google_sql_database 에 대해 삭제 정책이 기본 &quot;abandon&quot; 처리 되어 있음으로 인해 발생 가능한 오류 개선</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>Vault
<ul>
<li>1.12.2
<ul>
<li>상세 <a href="https://github.com/hashicorp/vault/blob/main/CHANGELOG.md#1122" target="_blank" rel="noopener noreferrer">CHANGELOG<ExternalLinkIcon/></a></li>
<li>PKI Secret Engine: 기본 issuer 에 대한 변경을 위해 default_follows_latest_issuer 설정 추가</li>
<li>Raft Storage: retry_join_as_non_voter 설정 추가</li>
<li>Okta Auth Method 관련 AuthRenew 로 인한 Panic 오류 수정</li>
<li>ciphertext 가 4 byte 이하인 경우 발생 가능한 deadlock 오류 수정</li>
<li>Performance Standby Node 에 대한 start up race condition 수정</li>
</ul>
</li>
</ul>
</li>
<li>Consul
<ul>
<li>1.14.3
<ul>
<li>
<p>상세 <a href="https://github.com/hashicorp/consul/blob/main/CHANGELOG.md#1143-december-13-2022" target="_blank" rel="noopener noreferrer">CHANGELOG<ExternalLinkIcon/></a></p>
</li>
<li>
<p>consul connect: vault connect CA test 에 대해 제한된 권한의 token 사용하도록 수정</p>
</li>
<li>
<p>consul connect 관련 Mesh Gateway 의 Failover peering 에 대한 오류 개선</p>
</li>
<li>
<p>consul connect 관련 Vault 1.11+ 를 CA Provider 로 사용 시 발생하는 Intermediate CA 관련 오류 개선</p>
</li>
<li>
<p>Cluster Peering 기반 Service Failover 포함 Mesh Traffic Management 기능 개선</p>
</li>
<li>
<p>Windows 에 대한 Service Mesh 지원</p>
</li>
<li>
<p>AWS Lambda 에 대한 Service Mesh 지원</p>
</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li>1.4.3
<ul>
<li>상세 <a href="https://github.com/hashicorp/nomad/blob/main/CHANGELOG.md#143-november-21-2022" target="_blank" rel="noopener noreferrer">CHANGELOG<ExternalLinkIcon/></a></li>
<li>동일 Job 에 대해 여러 evaluation 이 pending 되어 있는 경우, 가장 최근 성공한 evaluation 에 대해서만 반영</li>
<li>File Upload, Consul Upstream 설정 등 UI 개선</li>
<li>Consul 연동 시 gRPC fingerprint 관련 발생 오류 개선 (Consul 1.14 연동부터 적용)</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


