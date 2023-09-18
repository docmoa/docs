<template><div><h1 id="_2023년-6월" tabindex="-1"><a class="header-anchor" href="#_2023년-6월" aria-hidden="true">#</a> 2023년 6월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>
<p>Terraform Cloud updates plans with an enhanced Free tier and more flexibility</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/terraform-cloud-updates-plans-with-an-enhanced-free-tier-and-more-flexibility" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>Terraform Cloud 에 대한 요금제가 개편됩니다. 요금제 개편과 함께 각 요금제에서 사용가능한 기능들도 추가되었습니다. (예를 들어 기존 Free Tier 에서는 사용불가 했던 Sentinel/OPA, SSO, Terraform Agent, Run Tasks 등)</li>
</ul>
</li>
<li>
<p>Terraform Cloud adds Vault-backed dynamic credentials</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/terraform-cloud-adds-vault-backed-dynamic-credentials" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>지난 4월 소개된 Dynamic provider credentials now generally available for Terraform Cloud 에 이어 Vault의 Cloud Secrets Engine (AWS, Azure, GCP) 를 연계한 동적 자격증명 발급 기능이 출시되었습니다. 이제, Terraform Apply 수행 시 마다 Vault 로 부터 자격증명을 발급받아 사용함으로써 보다 보안 강화된 워크플로우를 구성할 수 있습니다.</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.4.6" target="_blank" rel="noopener noreferrer">1.4.6 Release<ExternalLinkIcon/></a>
<ul>
<li><code v-pre>terraform plan</code> 시 null string 또는 잘못 정의된 map 으로 인한 오류 개선</li>
<li><code v-pre>terraform plan</code> 시 구버전 TFE 에서 plan 두번 되는 이슈 개선</li>
<li><code v-pre>forces replacement</code> 설정된 자원 관련 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases/2023/v202305-1" target="_blank" rel="noopener noreferrer">5월 Release<ExternalLinkIcon/></a> 출시 (<code v-pre>v202305-1 (703)</code>)</li>
<li>필수 Upgrade Versison: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202207-2)</li>
<li>Terraform run 시 구동되는 Build Worker 관련 지원 종료 (v202306-1 부터 적용, Terraform run 시 TFC Agent 로 대체)</li>
<li>Project 단위 Variable Set 사용 가능</li>
<li>Vault 와 연계한 Dynamic Credentials 사용 시 base64 encoded PEM format Cert 지정시 <code v-pre>TFC_VAULT_ENCODED_CACERT</code> 환경변수 사용 지원</li>
<li>Authentication Token 발행 시 폐기 시점 (Expire date) 설정지원</li>
<li>OPA Version 자동 업그레이드 지원</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v5.0.0" target="_blank" rel="noopener noreferrer">AWS v5.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신버전 출시 관련 <a href="https://www.hashicorp.com/blog/terraform-aws-provider-5-0-adds-updates-to-default-tags" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>Provider 단위별 생성/관리 되는 자원에 대한 Default Tag 설정 지원 및 기존 발생하던 Tag 관련 이슈에 대한 개선</li>
<li>EC2 Classic 관련 기능 지원 종료</li>
<li>기존에 사용자가 고지 받던 Warning 알림 (지원 종료된 자원 사용 등) 에 대한 개선</li>
<li>신규 자원 관련 지원 추가
<ul>
<li>Amazon CloudWatch Observability Access Manager</li>
<li>Amazon EC2 Recycle Bin</li>
<li>Amazon QuickSight</li>
<li>Amazon VPC Lattice</li>
<li>AWS Directory Service trust relationships</li>
<li>Amazon EventBridge Pipes</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.58.0" target="_blank" rel="noopener noreferrer">Azure v3.58.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가
<ul>
<li>azurerm_cosmosdb_mongo_*</li>
<li>azurerm_mobile_network_packet_core_control_plane</li>
<li>azurerm_monitor_alert_prometheus_rule_group</li>
<li>azurerm_site_recovery_*</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>azurerm_subnet_service_endpoint_policy 에 대해 service 설정 가능</li>
<li>azurerm_site_recovery_replication_recovery_plan 에 대해 azure_to_azure_settings 설정 가능</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>azurerm_kubernetes_cluster 에 대해 nil 값 반환으로 인한 panic 오류 개선</li>
<li>azurerm_api_management 에 대해 triple_des_ciphers_enabled 설정값 오류 개선</li>
<li>azurerm_key_vault 에 대해 <code v-pre>createMode</code> 를 nil 대신 default 로 대체</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.67.0" target="_blank" rel="noopener noreferrer">GCP v4.67.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가
<ul>
<li>google_____*_iam_policy</li>
<li>google_vertex_ai_index</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>google_compute_instance 와 google_compute_instance_template 에 대해 network_performance_config 설정 지원</li>
<li>google_compute_disk 와 google_compute_region_disk 에 대해 guest_os_features 및 licenses 설정 지원</li>
<li>google_datastream_stream 에 대해 mysql_source_config.max_concurrent_backfill_tasks 설정 지원</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>google_apigee_orginization 에 대한 default timeout 을 기존 20분에서 45분으로 개선</li>
<li>google_container_node_pool 에 대해 crash 오류 관련 개선</li>
<li>google_gkeonprem_vmware_cluster 에 대해 hostname 설정을 필수에서 선택으로 변경</li>
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
<li>1.13.2
<ul>
<li>상세 <a href="https://github.com/hashicorp/vault/releases/tag/v1.13.2" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>namespace 에 대한 output 정보 상세화</li>
<li>pki secret engine 에 대해 OCSP 에 대한 사이즈 조정 및 호환성 제고</li>
<li>ldap auth method 에 대해 max_page_size 설정 지원</li>
<li>신규 생성된 Token 이 인지되지 않음으로 인해 간헐적으로 발생되는  <code v-pre>error performing token check: no lease entry found for token that ought to have one, possible eventual consistency issue</code> 오류 개선</li>
<li>Perf Standby Cluster 에 대해 Leader 변경, Unseal 등의 작업 이후 발생하는 412 오류 개선</li>
<li>PR Cluster 에 filter 된 정보 replication 작업 시 발생하는 caching 오류 개선</li>
<li>UI 개선</li>
</ul>
</li>
</ul>
</li>
<li>Consul
<ul>
<li>1.15.3
<ul>
<li>상세 <a href="https://github.com/hashicorp/consul/releases/tag/v1.15.3" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>보안 취약점 관련 패치: <a href="https://github.com/advisories/GHSA-9f7g-gqwh-jpf5" target="_blank" rel="noopener noreferrer">CVE-2023-24537 (<code v-pre>go/scanner</code>)<ExternalLinkIcon/></a>, <a href="https://github.com/advisories/GHSA-v4m2-x4rp-hv22" target="_blank" rel="noopener noreferrer">CVE-2023-24538(<code v-pre>html/template</code>)<ExternalLinkIcon/></a>, <a href="https://github.com/advisories/GHSA-8v5j-pwr7-w5f8" target="_blank" rel="noopener noreferrer">CVE-2023-24534(<code v-pre>net/textproto</code>)<ExternalLinkIcon/></a>, <a href="https://github.com/advisories/GHSA-9f7g-gqwh-jpf5" target="_blank" rel="noopener noreferrer">CVE-2023-24536(<code v-pre>mime/multipart</code>)<ExternalLinkIcon/></a></li>
<li>HCP Consul 에 대해 OTEL 형태의 Metric 수집 지원</li>
<li>Raft Storage 관련 성능 개선</li>
<li>partition/region 간 peering 관련 기능 개선</li>
<li>Envoy Version 지원추가: <code v-pre>1.22.11</code>, <code v-pre>1.23.8</code>, <code v-pre>1.24.6</code>, <code v-pre>1.25.4</code></li>
<li>Envoy Proxy 관련 Passive Health Check 에 대해 <code v-pre>MaxEjectionPercent</code> 과 <code v-pre>BaseEjectionTime</code> 설정 지원</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li>1.5.6
<ul>
<li>상세 <a href="https://github.com/hashicorp/nomad/releases/tag/v1.5.6" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>Job allocation 이 재시작 되었을 때 발생하는 group service 가 등록 해제 되는 오류 개선</li>
<li>종료되었음에도 삭제 되지 않은  Job allocation 에 대한 오류 개선</li>
<li>Job Evaluation 이 잘못된 type 으로 생성되는 오류 개선</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


