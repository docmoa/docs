<template><div><h1 id="_2023년-4월" tabindex="-1"><a class="header-anchor" href="#_2023년-4월" aria-hidden="true">#</a> 2023년 4월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>
<p>Dynamic provider credentials now generally available for Terraform Cloud</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/dynamic-provider-credentials-now-ga-for-terraform-cloud" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>AWS, MS Azure, GCP 등 Cloud 환경을 Terraform 과 연동 및 인증하기 위해 Workspace Variable 또는 Variable Set 을 활용하여 Credential 정보를 설정해서 사용했습니다. 해당 Credential 정보는 장기간의 TTL 을 설정하여 사용하거나 혹은 보안취약점을 보완하기 위해 관리자가 수동으로 갱신 및 설정하는 등의 번거로움을 동반하고 있었습니다. Dynamic Provider Credential 은 각 Cloud Service 의 OIDC Provider 를 기반으로 Terraform 에 대한 TLS 인증 확인을 수행함으로써 매 Apply 마다  Terraform 에 대한 인증 처리 후 Resource Provisioning 등을 수행하는 <code v-pre>동적인증처리</code> 를 지원합니다.</li>
<li><a href="https://developer.hashicorp.com/terraform/tutorials/cloud/dynamic-credentials?product_intent=terraform" target="_blank" rel="noopener noreferrer">Hashicorp Officlal Tutorial<ExternalLinkIcon/></a> 을 참고하여 테스트 해보실 수 있습니다.</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.4.2" target="_blank" rel="noopener noreferrer">1.4.2 Release<ExternalLinkIcon/></a>
<ul>
<li>일부 Provider 에서 발생하는 <code v-pre>invalid plan</code> 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases/2023/v202303-1" target="_blank" rel="noopener noreferrer">3월 Release<ExternalLinkIcon/></a> 출시 (<code v-pre>v202303-1 (688)</code>)</li>
<li>필수 Upgrade Versison: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202207-2)</li>
<li>OPA Support: OPA (Open Policy Agent) 기반 정책 설정 지원</li>
<li>Dynamic Provider Credential: Terraform 과 Provider 간 동적 인증처리 지원 (지원대상 Provider: AWS, AzureRM, AzureAD, GCP, Vault)</li>
<li>Drift Detection: State 파일 내 상태정보와 실제 대상환경 간 상이한 부분 체크 및 알림 설정, Workspace 또는 Organization 단위로 활성화</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.60.0" target="_blank" rel="noopener noreferrer">AWS v4.60.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 Resource: data/appmesh_route, data/appmesh_virtual_gateway, resource/aws_cognito_managed_user_pool_client 등</li>
<li>기능 개선
<ul>
<li>data/aws_ecs_cluster: <code v-pre>tags</code> 설정 지원</li>
<li>resource/aws_rds_cluster: <code v-pre>snapshot_identifier</code> 와 <code v-pre>global_cluster_identifier</code> 설정에 의한 잘못된 복원 수행 개선</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>aws_appmesh 관련 mesh owner 설정에 대한 오류 개선</li>
<li>aws_medialive_channel 관련 type casting 설정에 대한 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.49.0" target="_blank" rel="noopener noreferrer">Azure v3.49.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가: azurerm_databricks_virtual_network_peering, azurerm_sentinel_threat_intelligence_indicator, azurerm_voice_services_communications_gateway</li>
<li>기능 개선
<ul>
<li>azurerm_mysql_flexible_server 에 대해  <code v-pre>geo_backup_key_vault_key_id</code> 와 <code v-pre>geo_backup_user_assigned_identity_id</code> 설정 지원</li>
<li>azurerm_virtual_network_peering 에 대해 <code v-pre>allow_forwarded_traffic</code>, <code v-pre>allow_gateway_transit</code>, <code v-pre>use_remote_gateways</code> 에 대한 기본값 설정</li>
<li>azurerm_virtual_hub 에 대해 <code v-pre>hub_routing_preference</code> 설정 지원</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>azurerm_linux_function_app 에 대해 <code v-pre>auth_v2</code>, <code v-pre>token_store_enabled</code>, <code v-pre>ip_restriction</code>, <code v-pre>scp_ip_restriction</code> 관련 오류 개선</li>
<li>azurerm_linux_wep_app 에 대해  <code v-pre>auth_v2</code>, <code v-pre>token_store_enabled</code>, <code v-pre>ip_restriction</code>, <code v-pre>scp_ip_restriction</code> 관련 오류 개선</li>
<li>azurerm_windows_function_app 에 대해  <code v-pre>auth_v2</code>, <code v-pre>token_store_enabled</code>, <code v-pre>ip_restriction</code>, <code v-pre>scp_ip_restriction</code> 관련 오류 개선</li>
<li>azurerm_windows_web_app 에 대해  <code v-pre>auth_v2</code>, <code v-pre>token_store_enabled</code>, <code v-pre>ip_restriction</code>, <code v-pre>scp_ip_restriction</code> 관련 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.59.0" target="_blank" rel="noopener noreferrer">GCP v4.59.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가: google_dataplex, google_network_services_gateway</li>
<li>기능 개선
<ul>
<li>oauth2 기반 mTLS 지원</li>
<li>bigquery 에 대해 <code v-pre>is_case_insensitive</code> 와 <code v-pre>default_collation</code> 설정 지원</li>
<li>compute 에 대해 <code v-pre>scratch_disk.size</code>와 <code v-pre>local_nvme_ssd_block</code> 설정 지원</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>certificatemanager 에 대해 import 과정 중 <code v-pre>managed.dns_authorizations</code> 관련 오류 개선</li>
<li>compute 에 대해 <code v-pre>enforce_on_key_name</code> 관련 설정 오류 개선</li>
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
<li>1.13.1
<ul>
<li>상세 <a href="https://github.com/hashicorp/vault/releases/tag/v1.13.1" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>Github Auth Method 에 대해 환경변수 <code v-pre>VAULT_AUTH_CONFIG_GITHUB_TOKEN</code> 설정 지원</li>
<li>DB Secrets Engine (Elasticsearch) 에 대해 API 오류 시 알림 메세지 강화</li>
<li><code v-pre>CKR_FUNCTION_FAILED</code> 오류 발생 시 PKCS#11 HSM 에 대한 재연결 시도 개선</li>
<li>UI 개선</li>
</ul>
</li>
</ul>
</li>
<li>Consul
<ul>
<li>1.15.1
<ul>
<li>상세 <a href="https://github.com/hashicorp/consul/releases/tag/v1.15.1" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li><code v-pre>consul token update</code> 명령어 수행 시 <code v-pre>-append-policy-id</code>, <code v-pre>-append-policy-name</code>, <code v-pre>-append-role-id</code>, <code v-pre>-append-service-identity</code>, <code v-pre>-append-node-identity</code> 매개변수 설정 지원</li>
<li>호환 Envoy Version: 1.22.5 ~ 1.22.7, 1.23.2 ~ 1.23.4, 1.24.0 ~ 1.24.2 지원 (1.21.5 제외)</li>
<li>Service Mesh 에 사용되는 Gateway 에서 발생하는 <code v-pre>HTTPRoute</code> 관련 오류 개선</li>
<li>존재하지 않는 ACL 정책 호출 시 발생하는 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li>1.5.2
<ul>
<li>상세 <a href="https://github.com/hashicorp/nomad/releases/tag/v1.5.2" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li><code v-pre>namespace status</code>, <code v-pre>quota status</code>, <code v-pre>server members</code> 명령어에 대해 <code v-pre>-json</code>과 <code v-pre>-t</code> 매개변수 설정 지원</li>
<li>등록된 서비스 제거 시 두번 제거 되는 오류 개선</li>
<li>Consul Discovery 사용하는 서비스에 대해 발생하는 Cluster Join 권한 오류 개선</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


