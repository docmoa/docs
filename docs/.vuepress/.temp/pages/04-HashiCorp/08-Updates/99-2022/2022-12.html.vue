<template><div><h1 id="_2022년-12월" tabindex="-1"><a class="header-anchor" href="#_2022년-12월" aria-hidden="true">#</a> 2022년 12월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>
<p>Terraform Run Tasks in Public Registry</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/run-tasks-are-now-available-in-the-terraform-registry" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>활발하게 활용되고 있는 Terraform Run Tasks (3rd party 연동 및 통합) 기능이 강화되었습니다. 이제 <a href="https://registry.terraform.io/" target="_blank" rel="noopener noreferrer">Terraform Public Registry<ExternalLinkIcon/></a> 에서 Run Tasks 를 검색하여 필요한 3rd party service 와 연동하여 자원 관리에 필요한 Cost Management, Policy Compliance 와 같은 다양한 기능들을 적용하여 보다 효율적인 자원 관리가 가능합니다.</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>
<p>Terraform</p>
<ul>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.3.5" target="_blank" rel="noopener noreferrer">1.35 Release<ExternalLinkIcon/></a>
<ul>
<li>Size 확인 불가한 Temp File 에 대한 처리 오류 개선</li>
<li>Empty 및 Null Collection 에 대한 처리 오류 개선</li>
<li>Optional object 에 대핸 처리 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases/2022/v202211-1" target="_blank" rel="noopener noreferrer">11월 Release<ExternalLinkIcon/></a> 출시 (v202211-1)</li>
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
<li>Workspaces API 관련 workspace 삭제 기능을 safe / force 로 세분화</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.41.0" target="_blank" rel="noopener noreferrer">AWS v4.41.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>aws_rds_clusters resource 추가</li>
<li>aws_nat_gateway 에 대해 private_ip 설정 지원</li>
<li>aws_resourcegroups_group 에 대해 configuration.parameters 설정을 optional 로 변경</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.33.0" target="_blank" rel="noopener noreferrer">Azure v3.33.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>azurerm_mssql_managed_instance_transparent_data_encryption resource 추가</li>
<li>azurerm_mssql_managed_instance 에 대해 customer_managed_key_id 와 user-assigned identity 설정 지원</li>
<li>azurerm_mysql_flexible_server 에 대해 iops 설정 오류 개선</li>
<li>azurerm_storage_account 에 대해 multichannel checking 과정 관련 오류 개선</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.44.1" target="_blank" rel="noopener noreferrer">GCP v4.41.1 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>google_compute_instance_template 에 대해 advanced_machine_features 설정으로 인한 오류 개선</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>
<p>Vault</p>
<ul>
<li><a href="https://github.com/hashicorp/vault/releases/tag/v1.12.1" target="_blank" rel="noopener noreferrer">1.12.1 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>DB Secret Enging - Snowflake 에 대해 병렬 요청 허용</li>
<li>SDK/LDAP 에 대해 group filter 사용 시 paging 지원</li>
<li>MFA (Multi Factor Authentication) 수행 시 발생 가능한 namespace 관련 오류 개선</li>
<li>Vault Agent 가 Certificate Template 렌더링 하는 과정에서 발생 가능한 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li>
<p>Consul</p>
<ul>
<li>
<p><a href="https://www.hashicorp.com/blog/consul-1-14-ga-announcing-simplified-service-mesh-deployments" target="_blank" rel="noopener noreferrer">1.14<ExternalLinkIcon/></a></p>
<ul>
<li>
<p>상세 <a href="https://github.com/hashicorp/consul/blob/main/CHANGELOG.md#1140-november-15-2022" target="_blank" rel="noopener noreferrer">CHANGELOG<ExternalLinkIcon/></a></p>
</li>
<li>
<p>Consul Client on K8S 에 대한 구조변화: Daemonset 에서 Sidecar 방식으로 변경</p>
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
<li>
<p>Nomad</p>
<ul>
<li><a href="https://github.com/hashicorp/nomad/releases/tag/v1.4.3" target="_blank" rel="noopener noreferrer">1.4.3 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>동일 Job 에 대해 여러 evaluation 이 pending 되어 있는 경우, 가장 최근 성공한 evaluation 에 대해서만 반영</li>
<li>File Upload, Consul Upstream 설정 등 UI 개선</li>
<li>Consul 연동 시 gRPC fingerprint 관련 발생 오류 개선 (Consul 1.14 연동부터 적용)</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


