<template><div><h1 id="_2023년-8월" tabindex="-1"><a class="header-anchor" href="#_2023년-8월" aria-hidden="true">#</a> 2023년 8월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>Using Terraform dynamic provider credentials in your AWS landing zones
<ul>
<li><a href="https://www.hashicorp.com/blog/using-terraform-dynamic-provider-credentials-in-your-aws-landing-zones" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>지난 4월 소개된 Terraform 사용 시 필요한 대상 환경에 대한 클라우드 자격증명을 Vault 와 연동하여 동적으로 사용 및 관리하는 Dynamic Provider Credentials 기능을 AWS Landing Zone 에서도 사용하실 수 있습니다. Terraform 과 함께 Landing Zone 으로 시작하는 AWS 의 여정에서 더 보안 강화된 IaC 를 경험해보세요!</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.5.4" target="_blank" rel="noopener noreferrer">1.5.4 Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/language/checks" target="_blank" rel="noopener noreferrer"><code v-pre>check</code><ExternalLinkIcon/></a> Block 관련 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases/2023/v202307-1" target="_blank" rel="noopener noreferrer">7월 Release<ExternalLinkIcon/></a> 출시 (<code v-pre>v202307-1 (722)</code>)</li>
<li>필수 Upgrade Versison: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202207-2)</li>
<li>TFE 구동을 위한 Container 구성이  <code v-pre>terraform-enterprise</code> 라는 단일 Container 로 통합. <code v-pre>terraform plan</code> 또는 <code v-pre>terraform apply</code> 는 기존 방식과 동일하게 수행 때마다 agent container 생성 (적용시점: <code v-pre>v202309-1</code> 부터 적용)</li>
<li>Docker 19.03, 20.10 미지원 (적용시점: <code v-pre>v202308-1</code> 부터 적용)</li>
<li>Redis v5 지원 종료</li>
<li><code v-pre>Manage Policy Overrides</code> 에 대해 기본 부여된 정책 수정 (기존 Read -&gt; List)</li>
<li>신규 Org 에 대해 Cost Estimation 기본 비활성화</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v5.10.0" target="_blank" rel="noopener noreferrer">AWS v5.10.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resoure 추가
<ul>
<li>aws_iam_security_token_service_preferences</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>aws_nat_gateway 에 대해 secondary_allocation_ids, secondary_private_ip_address, secondary_private_ip_count 등 설정 추가</li>
<li>aws_batch_compute_environment 에 대해 compute_resources.allocation_strategy,  compute_resources.bid_percentage 를 포함한 세부 설정 추가</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>aws_quicksight_* 에 대해 definition.sheets.visuals.pie_chart_visual.chart_configuration.data_labels.measure_label_visibility 설정 시 발생하는 오류 개선</li>
<li>aws_apigatewayv2_authorizer 에 대해 TTL 설정 관련 오류 개선</li>
<li>aws_kms_* 에 대해 tag 전체 삭제 관련 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.67.0" target="_blank" rel="noopener noreferrer">Azure v3.67.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가
<ul>
<li>azurerm_eventhub_sas</li>
<li>azurerm_kubernetes_cluster_trusted_access_role_binding</li>
<li>azurerm_marketplace_role_assignment</li>
<li>azurerm_network_function_azure_traffic_collector</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>azurerm_image 에 대해 disk_encryption_set_id 설정 추가</li>
<li>azurerm_linux_virtual_machine 에 대해 bypass_platform_safety_checks_on_user_schedule_enabled 와 reboot_setting 설정 추가</li>
<li>azurerm_windows_virtual_machine 에 대해 bypass_platform_safety_checks_on_user_schedule_enabled 와 reboot_setting 설정 추가</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>azurerm_cosmosdb_account 에 대해 max_age_in_seconds 가 2147483647 초까지 설정할 수 있도록 개선</li>
<li>azurerm_redis_cache 에 대해 patch_schedule 업데이트 조건 설정 관련 오류 개선</li>
<li>azurerm_postgresql_flexible_server 에 대해 storage_mb 설정에 대한 유효성 검사 정보를 3355340 에서 33554432 으로 수정</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.76.0" target="_blank" rel="noopener noreferrer">GCP v4.76.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가
<ul>
<li>google_compute_region_ssl_policy</li>
<li>google_iap_web_region_backend_service_iam_*</li>
<li>google_dataplex_task</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>compute 에 대해 google_compute_service_attachment를 위한 reconcile_connections 설정 추가</li>
<li>container 에 대해 google_container_cluster 의 addons_config 를 위한 gcs_fuse_csi_driver_config 설정 추가</li>
<li>container 에 대해 google_container_cluster 를 위한 allow_net_admin 설정 추가</li>
<li>networkservices 에 대해 google_network_services_gateway 를 위한 scope 설정 추가</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>compute 에 대해 google_compute_security_policy 를 위한enforce_on_key_configs 의 트리거 시점 관련 오류 개선</li>
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
<li>1.14.1
<ul>
<li>상세 <a href="https://github.com/hashicorp/vault/releases/tag/v1.14.1" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>Administrative Namespace 도입. 기존 Root Namespace 에서만 접근 가능한 System Backend Path 에 대한 접근 권한 등을 기반으로 Cluster 관리용 Namespace 로 활용</li>
<li>Transform Secrets Engine 사용 시 Encoding 요청에 대한 Max TTL 적용</li>
<li>Performance Standby (Read Replica) Node 에서 발생하는 요청에 대한 Logging 알람 방지</li>
</ul>
</li>
</ul>
</li>
<li>Consul
<ul>
<li>1.16
<ul>
<li>상세 <a href="https://github.com/hashicorp/consul/releases/tag/v1.16.0" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li><code v-pre>/v1/health/connect/</code> 와 <code v-pre>/v1/health/ingress/</code> api 에 대해 적절한 권한 없는 token 사용 시 403 오류 출력</li>
<li>cluster peering: 지원 종료된 version 을 사용하는 cluster 에 대한 하위 호환성 제거</li>
<li><code v-pre>consul services export</code>: peer cluster 또는 타 partition 에 서비스 노출을 위한 명령어 추가</li>
<li>Permissive mTLS: Service Mesh 에 대해 mTLS 활성화 유무 선택</li>
<li>audit hash: audit log hash function 기반 data hash 값 검증 지원</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li>1.6.0
<ul>
<li><a href="https://www.hashicorp.com/blog/nomad-1-6-adds-node-pools-ux-updates-and-more" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
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


