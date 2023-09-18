<template><div><h1 id="_2023년-9월" tabindex="-1"><a class="header-anchor" href="#_2023년-9월" aria-hidden="true">#</a> 2023년 9월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>Terraform ephemeral workspaces public beta now available
<ul>
<li><a href="https://www.hashicorp.com/blog/terraform-ephemeral-workspaces-public-beta-now-available" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>개발 및 테스트 등을 위해 임시로 사용하는 Workspace 에 대해 사용 완료 후 방치함으로 인해 발생되는 자원 낭비 또는 보안 유출 위험성을 방지하고자 Workspace 사용에 대해 미리 시간 설정을 할 수 있는 기능이 베타로 출시되었습니다. 이제, 정해놓은 타이머가 도래하면 Workspace 와 해당 Workspace 를 통해 생성한 자원을 자동 폐기 및 정리함으로써 자원 관리의 효율성을 높이고 미사용 자원에 대한 보안 유출 등을 방지할 수 있습니다. 베타 버전은 Terraform Cloud (Plus 요금제 이상) 에서 체험 및 사용 가능합니다.</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.5.6" target="_blank" rel="noopener noreferrer">1.5.6 Release<ExternalLinkIcon/></a>
<ul>
<li>여러 개의 <code v-pre>terraform_remote_state</code> 를 읽어 오는 중 발생 가능한 오류에 대한 개선</li>
</ul>
</li>
</ul>
</li>
<li>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases/2023/v202308-1" target="_blank" rel="noopener noreferrer">8월 Release<ExternalLinkIcon/></a> 출시 (<code v-pre>v202308-1 (725)</code>)</li>
<li>필수 Upgrade Versison: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202207-2)</li>
<li>Postgres DB v14.0, v14.1, v14.2, v14.3 에 대한 지원 종료</li>
<li>TFE 구동을 위한 Container 구성이  <code v-pre>terraform-enterprise</code> 라는 단일 Container 로 통합. <code v-pre>terraform plan</code> 또는 <code v-pre>terraform apply</code> 는 기존 방식과 동일하게 수행 때마다 agent container 생성 (적용시점: <code v-pre>v202309-1</code> 부터 적용)</li>
<li>Docker 19.03, 20.10 지원 종료</li>
<li><code v-pre>dynamic provider credentials</code> 에 대해 Workspace 내 Provider 당 설정 지원</li>
<li>UI 출력 및 Cloud Provider 사용 위한 Key 검증 처리 등 성능 개선</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v5.15.0" target="_blank" rel="noopener noreferrer">AWS v5.15.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>기능 개선
<ul>
<li>aws_efs_file_system 에 대해 name 설정 지원</li>
<li>aws_datasync_location_fsx_openzfs_file_system 에 대해 <code v-pre>setting protocol: Invalid address to set</code> 오류 수정</li>
<li>aws_opensearch_domain 에 대해 cluster_config.multi_az_with_standby_enabled 설정 지원</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>tag 사용 관련 오류 개선</li>
<li>aws_efs_file_system_policy 에 대해 IAM 관련 일관성 오류 개선</li>
<li>aws_kms_key 에 대해 tag 정보가 공란일 때 발생하는 <code v-pre>tag propagation: timeout while waiting for state to become 'TRUE'</code> 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.71.0" target="_blank" rel="noopener noreferrer">Azure v3.71.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가
<ul>
<li>azurerm_databricks_workspace_root_dbfs_customer_managed_key</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>azurerm_kubernetes_cluster 에 대해 sysctl_config 설정 가능 범위 확대</li>
<li>azurerm_linux(windows)_virtual_machine_scale_set 에 대해 자원 삭제 전 rolling upgrade 취소 지원</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>자동 복구를 위한 win32_status 설정 시 발생하는 오류 관련 azurerm_linux_web_app, azurerm_linux_web_app_slot, azurerm_windows_web_app, azurerm_windows_web_app_slot 자원에 대해 win32_status_code (3.63.0 이후 버전에서는 int로 유지) 로 대체</li>
<li>azurerm_kubernetes_cluster 에 대해 public_network_access_enabled 설정 삭제</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.80.0" target="_blank" rel="noopener noreferrer">GCP v4.80.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가
<ul>
<li>google_certificate_manager_trust_config</li>
<li>google_compute_region_security_policy_rule</li>
<li>google_sql_database_instance_latest_recovery_time</li>
<li>google_iam_deny_policy</li>
<li>google_bigquery_bi_reservation</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>google_compute_target_instance 에 대해 security_policy 설정 지원</li>
<li>google_compute_target_pool 에 대해 security_policy 설정 지원</li>
<li>google_compute_instance 에 대해 regional disk 지원</li>
<li>google_container_cluster 에 대해 additional_pod_ranges_config 설정 지원</li>
<li>google_dns_response_policy 에 대해 networks 설정 지원 제거</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>bigquery 에 대해 table schema 대상 policy set 설정 해제 지원</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>Vault
<ul>
<li>1.14.2
<ul>
<li>상세 <a href="https://github.com/hashicorp/vault/releases/tag/v1.14.2" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>Azure Auth Method 에 대해 Auto auth 위한 Azure Workload Identity Federation 설정 지원</li>
<li>KMIP 에 대해 Namespace Lock/Unlock 설정 지원</li>
<li>Replication 관련 Flush 단계에서 쓰기 지원하여 Index 재생성 작업에 영향 주지 않도록 개선</li>
<li>Vault Agent Template 에 대해 VAULT_CACERT_BYTES 환경변수 사용 지원</li>
<li>Transform Engine 관련 Standby Node 에서 발생하는 인코딩 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li>Consul
<ul>
<li>1.16.1
<ul>
<li>상세 <a href="https://github.com/hashicorp/consul/releases/tag/v1.16.1" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li><code v-pre>consul members</code> 명령어에 대해 -filter 설정 추가</li>
<li>operator/usage api 에 대해 node 수 출력 지원 (CLI 사용 시 consul operator usage 명령어 사용)</li>
<li>Service Mesh 관련 Virtual Service 및 Failover 에 대한  Transparent Proxy 성능 개선</li>
<li>Topology 관점 UI 출력 개선</li>
<li>Envoy Proxy 관련 xDS configuration 완료되기 전 구동 되어 발생하는 오류 개선</li>
<li>RSA Key 에 대해 사이즈가 2048 bits 이하여서 발생하는 오류를 검증 단계에서 미리 확인하도록 개선</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li>1.6.1
<ul>
<li>상세 <a href="https://github.com/hashicorp/nomad/releases/tag/v1.6.1" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>Datacenter 내 Client Node 에 대해 논리적 파티션으로 구분지어 Job 배포 시 해당하는 Pool 에만 배포되도록 하는 Node Pool 기능 추가</li>
<li>Namespace 를 생성하고 각 Namespace 별 기본 Node Pool 지정 및 배포 허용 여부를 제어할 수 있는 Node Pool Governance 기능 추가</li>
<li>Job Status 및 Job Deployments 에 대한 UI 개선</li>
<li>Job Spec 소스코드에 대한 기존 Raw JSON 지원했던 부분에 대해 소스코드 원문을 UI 상에서 확인 및 수정할 수 있도록 개선</li>
<li>Podman 정식 지원</li>
<li>Job restart 명령어 지원 (기존에는 stop 후 start)</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


