<template><div><h1 id="_2023년-7월" tabindex="-1"><a class="header-anchor" href="#_2023년-7월" aria-hidden="true">#</a> 2023년 7월</h1>
<h2 id="product-소개-hashidays-2023" tabindex="-1"><a class="header-anchor" href="#product-소개-hashidays-2023" aria-hidden="true">#</a> Product 소개 (Hashidays 2023)</h2>
<ul>
<li>매년 유럽 네덜란드에서 이틀간 진행되던 Hashiconf 가 올해는 한단계 더 성장하여 영국 런던, 프랑스 파리 그리고 독일 뮌헨에서 동시에 진행되는 Hashidays 2023 으로 개최되었습니다. 새롭게 펼쳐진 Hashidays 에서는 Terraform, Vault, Consul 그리고 Boundary 에 대해 그동안 사용자들이 사용하면서 느꼈던 불편함을 해소할 신기능을 출시했습니다.
<ul>
<li><a href="https://www.hashicorp.com/blog/a-hashicorp-ambassador-at-hashidays-london" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li><a href="https://www.hashicorp.com/blog/announcing-hcp-vault-secrets-public-beta" target="_blank" rel="noopener noreferrer">HCP Vault Secrets<ExternalLinkIcon/></a> (Public Beta): Vault 에서 가장 많이 활용되고 있는 Secret Engine 중 하나인 KV Engine 기반 시크릿 관리에 특화된 HCP SaaS 서비스로써 애플리케이션 개발 및 운영에 사용되는 시크릿에 대한 저장, 접근 그리고 자동 동기화 기능을 더욱 쉽게 구성 가능하도록 지원합니다. 특히 기존 사용 중인 AWS Secret Manager 등 클라우드 서비스와도 원클릭 동기화를 지원함으로써 기존 워크플로우에 대해 최소한의 변경으로 시크릿 동적관리가 가능합니다.</li>
<li><a href="https://www.hashicorp.com/blog/vault-secrets-operator-for-kubernetes-now-ga" target="_blank" rel="noopener noreferrer">Vault Secrets Operator<ExternalLinkIcon/></a>: CRD 기반으로 K8S의 Secrets 와 연계하여 Secrets 를 동적으로 관리함으로써 최소한의 추가 구성으로 기존 구성하여 사용중인 Secrets 에 대해  보안을 강화합니다.</li>
<li><a href="https://www.hashicorp.com/blog/boundary-0-13-introduces-ssh-session-recording-boundary-enterprise-and-more" target="_blank" rel="noopener noreferrer">Boundary Enterprise<ExternalLinkIcon/></a>: 기존에 Opensource 그리고 HCP SaaS 로만 제공되던 Boundary 가 드디어 Enterprise Edition 이 출시되었습니다. Enterprise Edition 에서는 그동안 많은 사용자들이 필요로 했던 Session Recording 과 더불어 그외 다양한 신규 기능들이 추가되었습니다.</li>
<li><a href="https://www.hashicorp.com/blog/new-terraform-cloud-capabilities-to-import-view-and-manage-infrastructure" target="_blank" rel="noopener noreferrer">Terraform<ExternalLinkIcon/></a>: 지난 6월호에서 소개한 <a href="https://www.hashicorp.com/blog/terraform-cloud-adds-vault-backed-dynamic-credentials" target="_blank" rel="noopener noreferrer">Vault-backed dynamic credentials<ExternalLinkIcon/></a> 의 정식 GA 출시, 그동안 너무 불편하고 어려웠던 Terraform import 를 보완해줄 <a href="https://www.hashicorp.com/blog/terraform-1-5-brings-config-driven-import-and-checks" target="_blank" rel="noopener noreferrer">Config-driven Import<ExternalLinkIcon/></a>, 생성 및 관리 중인 자원에 대한 보다 효과적인 관리를 위한 Explorer (Beta) 등 다양한 기능이 추가되었습니다.</li>
<li><a href="https://www.hashicorp.com/blog/consul-1-16-enhances-service-mesh-reliability-user-experience-and-security" target="_blank" rel="noopener noreferrer">Consul 1.16<ExternalLinkIcon/></a>: Envoy Proxy 에 Extension 이 출시되어 WASM (Web Assembly) Code 기반 추가 기능을 활용하거나 외부 보안 서비스와 연계하여 인증 기반 기능 활용합니다, 또한 여러 Cluster 에 걸쳐 동일 서비스에 대해 동일 서비스 이름을 사용하도록 하는 Sameness Groups 를 통해 서비스 관리 뿐만 아니라 장애 발생 시 수행하는 Failover 를 보다 간단하게 처리할 수 있습니다.</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.5.0" target="_blank" rel="noopener noreferrer">1.5.0 Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/language/checks" target="_blank" rel="noopener noreferrer"><code v-pre>check</code><ExternalLinkIcon/></a> Block 추가, 최소 1개 이상의 <code v-pre>assert</code> 구문을 요구하며 <code v-pre>assert</code> 구문 내 1개 혹은 여러 개의 <code v-pre>condition</code> 과 <code v-pre>error_message</code> 를 지정하여 <code v-pre>resource</code> 또는 <code v-pre>data</code> 자원에 대한 검증 지원</li>
<li><code v-pre>import</code> Block 추가, 기존 terraform import 명령어 기반 import 작업을 hcl code 로 작성하여 보다 손쉽게 import 작업 수행하도록 지원</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases/2023/v202306-1" target="_blank" rel="noopener noreferrer">6월 Release<ExternalLinkIcon/></a> 출시 (<code v-pre>v202306-1 (713)</code>)</li>
<li>필수 Upgrade Versison: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202207-2)</li>
<li>Terraform run 시 구동되는 Build Worker 관련 지원 종료 (v202306-1 부터 적용, Terraform run 시 TFC Agent 로 대체)</li>
<li><code v-pre>v202308-1</code> 부터 TFE 구동을 위한 Container 구성이  <code v-pre>terraform-enterprise</code> 라는 단일 Container 로 통합 (<code v-pre>terraform plan</code> 또는 <code v-pre>terraform apply</code> 는 기존 방식과 동일하게 수행 때마다 agent container 생성)</li>
<li><code v-pre>v202308-1</code> 부터 Docker 19.03 지원 종료 예정</li>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/no-code-provisioning/module-design" target="_blank" rel="noopener noreferrer">No-code Provisioning<ExternalLinkIcon/></a> 지원</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v5.7.0" target="_blank" rel="noopener noreferrer">AWS v5.7.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가
<ul>
<li>data/aws_opensearchserverless_*</li>
<li>aws_cleanrooms_collaboration</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>aws_lambda_function 에 대해 <code v-pre>ap-east-1</code> region 에서 <code v-pre>code_signing_config_arn</code> 설정 지원</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>provider 에 대해 <code v-pre>forbidden_account_ids</code> 처리 오류 개선</li>
<li>aws_kms 에 대해 tag 삭제 오류 개선</li>
<li>aws_secretsmanager_secret_rotation 에 대해 update 시 발생하는<code v-pre>InvalidParameterException: You cannot specify both rotation frequency and schedule expression together</code> 오류 개선</li>
<li>aws_vpc_endpoint 에 대해 s3 interface vpc endpoint 생성 시 발생하는 <code v-pre>InvalidParameter: PrivateDnsOnlyForInboundResolverEndpoint not supported for this service</code> 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.64.0" target="_blank" rel="noopener noreferrer">Azure v3.64.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가
<ul>
<li>azurerm_automation_variables</li>
<li>azurerm_arc_private_link_scope</li>
<li>azurerm_kusto_cosmosdb_data_connection</li>
<li>azurerm_pim_*</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>azurerm_windows_* 에 대해 <code v-pre>public_network_access_enabled</code> 설정 지원</li>
<li>azurerm_linux_* 에 대해 <code v-pre>public_network_access_enabled</code> 설정 지원</li>
<li>azurerm_spring_cloud_gateway 에 대해 <code v-pre>allowed_origin_patterns</code> 설정 지원</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>azurerm_windows_* 에 대해 <code v-pre>cors</code> 설정 시 <code v-pre>allowed_origins</code> 에 대한 설정 항목 수 오류 개선</li>
<li>azurerm_linux_* 에 대해 <code v-pre>cors</code> 설정 시 <code v-pre>allowed_origins</code> 에 대한 설정 항목 수 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.73.0" target="_blank" rel="noopener noreferrer">GCP v4.73.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가
<ul>
<li>google_firebase_extensions_instance</li>
</ul>
</li>
<li>기능 개선
<ul>
<li>compute 에 대해 <code v-pre>google_compute_forwarding_rule</code> 설정 내 <code v-pre>no_automate_dns_zone</code> 추가</li>
<li>compute 에 대해 <code v-pre>google_compute_disk_async_replication</code> 정식 지원</li>
<li>compute 에 대해 <code v-pre>google_compute_disk</code> 설정 내 <code v-pre>async_primary_disk</code> 추가</li>
<li>compute 에 대해 <code v-pre>google_compute_region_disk</code> 설정 내  <code v-pre>async_primary_disk</code> 추가</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>networkservices 에 대해 <code v-pre>google_network_services_edge_cache_keyset</code> 의 기본 timeout 값을 90 분으로 설정</li>
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
<li>1.14.0
<ul>
<li>상세 <a href="https://github.com/hashicorp/vault/releases/tag/v1.14.0" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>PKI Engine 에 대해 사용 중인 유효 인증서 정보 관리에 대한 기본 설정을 off 로 변경</li>
<li>AWS Secret Engine: Static Rotation 지원 (기존 생성된 IAM User 에 대해 Access Key / Secret Key Rotation)</li>
<li>Auth Method 추가: OCI (Oracle Cloud Infrastructure)</li>
<li>Vault Agent Supervisor Mode: Vault 에 저장된 Secret 을 환경변수로 등록</li>
<li>PKI: ACME 지원</li>
<li>UI: Terraform 과 같이 좌측 Sidebar 형태로 UI 변경</li>
<li>Vault Proxy: Vault Agent API Proxy 와 동일 기능 제공, 향후 기능 추가 및 Vault Agent API Proxy 사용 종료 예정</li>
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


