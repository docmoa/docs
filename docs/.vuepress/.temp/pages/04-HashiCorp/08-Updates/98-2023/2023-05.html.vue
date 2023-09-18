<template><div><h1 id="_2023년-5월" tabindex="-1"><a class="header-anchor" href="#_2023년-5월" aria-hidden="true">#</a> 2023년 5월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>
<p>Vault Secrets Operator: A new method for Kubernetes integration</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/vault-secrets-operator-a-new-method-for-kubernetes-integration" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>K8S Cluster 의 Secret 을 CRD (custom resource definitions) 를 기반으로 Vault 와 연동함으로써 K8S 를 이용하는 개발자 및 다양한 사용자들은 새로운 Tool 을 배울 필요 없이 기존의 경험을 바탕으로 K8S Secret 을 생명주기가 더해진 동적인 데이터로써 사용 가능합니다 .</li>
<li>기존에 제공되고 있던 Sidecar Injector 및 CSI Provider 방식과의 비교 분석은 <a href="https://www.hashicorp.com/blog/kubernetes-vault-integration-via-sidecar-agent-injector-vs-csi-provider" target="_blank" rel="noopener noreferrer">Hashicorp Blog: Kubernetes Vault Integration via Sidecar Agent Injector vs. Vault Secrets Operator vs. CSI Provider<ExternalLinkIcon/></a> 를 참고하세요.</li>
<li><a href="https://developer.hashicorp.com/vault/tutorials/kubernetes/vault-secrets-operator" target="_blank" rel="noopener noreferrer">Hashicorp Officlal Tutorial<ExternalLinkIcon/></a> 을 참고하여 테스트 해보실 수 있습니다.</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>
<p>CLI</p>
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.4.5" target="_blank" rel="noopener noreferrer">1.4.5 Release<ExternalLinkIcon/></a>
<ul>
<li>terraform destroy 시 <code v-pre>create_before_destroy</code> 참조 오류 등 개선</li>
</ul>
</li>
</ul>
</li>
<li>
<p><a href="https://developer.hashicorp.com/terraform/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a></p>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases/2023/v202304-1" target="_blank" rel="noopener noreferrer">4월 Release<ExternalLinkIcon/></a> 출시 (<code v-pre>v202304-1 (692)</code>)</li>
<li>필수 Upgrade Versison: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202207-2)</li>
<li>Project List API 사용 시 Project 이름 기반 필터 처리 지원</li>
<li>신규 생성된 User, Team, Org 정보에 대한 강조 표시 등 UI 개선</li>
<li>Sentinel 0.21 Upgrade</li>
</ul>
</li>
<li>
<p>Provider</p>
<ul>
<li>
<p><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.64.0" target="_blank" rel="noopener noreferrer">AWS v4.64.0 주요 수정사항<ExternalLinkIcon/></a></p>
<ul>
<li>신규 Resource
<ul>
<li>data/aws_route53_resolver_query_log_config</li>
<li>data/aws_redshiftserverless_workgroup</li>
<li>resource/aws_cloudwatch_event_endpoint</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>data/aws_eks_node_group 에 대해 <code v-pre>launch_template</code> 설정 추가</li>
<li>aws_iam_role 에 대해 <code v-pre>role_last_used</code> 설정 추가</li>
<li>aws_lambda_* 에 대해 <code v-pre>compatible_runtimes = python 3.10</code> 설정 추가</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>aws_default_vpc 에 대해 ipv6 vpc 사용 시 발생하는 오류 개선</li>
<li>aws_ecs_service 에 대해 IAM Role 기반 service import 수행 시 오류 개선</li>
<li>aws_lakeformation_permissions 사용 시 발생하는 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li>
<p><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.53.0" target="_blank" rel="noopener noreferrer">Azure v3.53.0 주요 수정사항<ExternalLinkIcon/></a></p>
<ul>
<li>신규 resource 추가
<ul>
<li>azurerm_storage_mover_*</li>
<li>azurerm_cost_management_scheduled_action</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>azurerm_windows_* 에 대해 <code v-pre>hosting_environment_id</code> 설정 추가</li>
<li>azurerm_linux_* 에 대해 <code v-pre>hosting_environment_id</code> 설정 추가</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>azurerm_cdn_endpoint 사용 시 <code v-pre>query_string</code> 길이 제약 제거</li>
<li>azurerm_monitor_metric_alert 사용 시 <code v-pre>dynamic_criteria.0.ignore_data_before</code> 미설정시 발생하는 오류 개선</li>
<li>azurerm_postgresql_flexible_server 사용 시 <code v-pre>point_in_time_restore_time_in_utc</code> 관련 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li>
<p><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.63.0" target="_blank" rel="noopener noreferrer">GCP v4.63.0 주요 수정사항<ExternalLinkIcon/></a></p>
<ul>
<li>신규 resource 추가
<ul>
<li>google_compute_region_commitment</li>
<li>google_compute_public_advertised_prefix</li>
<li>google_network_service_http_route</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>google_alloydb_cluster 및 google_alloydb_backup 사용 시 <code v-pre>location</code> 설정 required 로 변경 (기존: optional)\</li>
<li>google_data_loss_prevention_job_trigger 사용 시 <code v-pre>inspect_job.actions.job_notification_emails</code>, <code v-pre>inspect_job.actions.deidentify</code>, <code v-pre>triggers.manual</code> 그리고 <code v-pre>inspect_job.storage_config.hybrid_options</code> 설정 추가</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>google_alloydb_cluster 에 대해  <code v-pre>weekly_schedule</code> 설정 optional 로 변경</li>
<li>google_compute_backend_bucket 에 대해 <code v-pre>USE_ORIGIN_HEADERS</code> 사용시 발생하는 TTL 관련 오류 개선</li>
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
<li>1.15.2
<ul>
<li>상세 <a href="https://github.com/hashicorp/consul/releases/tag/v1.15.2" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>connect proxy 설정 기반 service mesh 관련 telemetry 를 HCP metrics collection service 로 전달하는 기능 추가</li>
<li>Vault CA Provider 와 연동 시 발생하는 Service Mesh TLS 설정 관련 오류 개선</li>
<li>Gateway 에 대해 Namespace 및 Partition 관련 <code v-pre>unmarshal</code> 되는 오류 개선</li>
<li>Default Namespace 또는 Partition 을 사용하지 않는 서비스에 대한 Resolver, Router, Splitter 사용 시 Peering 이 올바르게 수행되지 않는 오류 개선</li>
<li>Audit Log 이용 시 <code v-pre>Streaming not supported</code> 발생하는 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li>1.5.3
<ul>
<li>상세 <a href="https://github.com/hashicorp/nomad/releases/tag/v1.5.3" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>인증되지 않은 HTTP API 호출이 ACL 검사를 우회 통과하는 오류 개선</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


