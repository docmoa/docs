<template><div><h1 id="_2023년-3월" tabindex="-1"><a class="header-anchor" href="#_2023년-3월" aria-hidden="true">#</a> 2023년 3월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>
<p>Writing Terraform for unsupported resources</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/writing-terraform-for-unsupported-resources" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>Terraform 과 대상 환경 간 연동을 위해 Provider 를 활용할 때 대상 환경이 API 을 통해서는 지원하는 기능이지만 Provider 에는 구현되어 있지 않아 사용할 수 없는 기능이 종종 있습니다 (예: Vault Provider 기반 Vault 운영 시 Unseal 기능 사용 불가). Terracurl 을 통해 API 을 통해서만 지원되는 기능들을 Terraform Code 로 구성하여 하나의 Resource 로 관리할 수 있습니다.</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.3.9" target="_blank" rel="noopener noreferrer">1.3.9 Release<ExternalLinkIcon/></a>
<ul>
<li>이미 폐기된 Resource 에 대해 제거 및 plan 할 때 발생하는 이슈 해결</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://developer.hashicorp.com/terraform/enterprise/releases/2023/v202302-1" target="_blank" rel="noopener noreferrer">2월 Release<ExternalLinkIcon/></a> 출시 (<code v-pre>v202302-1 (681)</code>)</li>
<li>필수 Upgrade Versison: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202207-2)</li>
<li>구버전 OS 및 Postrgres DB 에 대한 지원 종료
<ul>
<li>대상 OS
<ul>
<li>Debian 8, 9 / Ubuntu 14.04, 16.04 / Amazon Linux 2014.03, 2014.09, 2015.03, 2015.09, 2016.03, 2016.09, 2017.03, 2017.09, 2018.03</li>
</ul>
</li>
<li>대상 Postgres
<ul>
<li>Postgres 11</li>
<li>TFE 에 대해 External PostgresSQL 사용 시 최소 버전 12 이상 필요 (Release 659 부터 적용)</li>
</ul>
</li>
</ul>
</li>
<li>Known Issue 1: 관리자 설정에서 TFC Agent 에 대해 사용 여부를 선택하지 않은 상태에서 <code v-pre>agent run pipeline mode</code> 사용 시 실행 계획이 무기한 Queue 에 대기하는 문제 발생. 관련하여 <code v-pre>tfe-task-worker</code> 를 통해  <code v-pre>[ERROR] core: Unexpected HTTP response code: method=POST url=https://terraform.example.com/api/agent/register status=404</code> 라는 Error Log 출력되며 2023년 3월 Release (<code v-pre>v202303-1</code>) 에서 해결 예정</li>
<li>Known Issue 2: API 를 통해 team 에게 <code v-pre>manage-workspaces</code> 권한 부여 시, <code v-pre>read-workspaces</code> 도 부여되는 문제 발생. 더불어 <code v-pre>manage-workspaces</code> 에 대한 권한 제거 시 <code v-pre>read-workspaces</code> 권한은 제거 되지 않고 부여된 채로 유지 되는 문제 발생. 이후 출시 예정인 Release 에서 해결 예정</li>
<li>Breaking Changes: 여러 Workspace 를 그룹으로 엮는 Project 기능이 추가됨에 따라</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.57.1" target="_blank" rel="noopener noreferrer">AWS v4.57.1 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>Bug Fix
<ul>
<li>resource/aws_lambda_function 에 대해 <code v-pre>skip_destroy</code> 를 Null 값 처리 시 발생하는 <code v-pre>Provider produced inconsitent final plan</code> 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.46.0" target="_blank" rel="noopener noreferrer">Azure v3.46.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가: <code v-pre>azurerm_mobile_network</code> 및 <code v-pre>azurerm_sentinel_alert_rule</code></li>
<li>기능 개선
<ul>
<li>resource 에 대해 AuthV2(EasyAuthV2) 지원</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>azurerm_storage_object_replication 에 대해 cross tenant replication 이 비활성화 되어 있는 경우 동작하지 않는 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.56.0" target="_blank" rel="noopener noreferrer">GCP v4.56.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 resource 추가: <code v-pre>google_data_catalog</code>, <code v-pre>google_scc_mute_config</code>, <code v-pre>google_workstations_workstation_config</code></li>
<li>기능 개선
<ul>
<li>compute 에 대해 resource-policy 관련 max_distance 설정 추가</li>
<li>compute 에 대해 google_compute_shared_vpc_service_project 관련 deletion_policy 설정 추가</li>
<li>networkservices 에 대해 allow_origins 에 대한 최대 설정치를 기존 5 에서 25 로 변경</li>
</ul>
</li>
<li>Bug Fix
<ul>
<li>spanner 에 대해  google_spanner_database 관련 deletion_protection 수정 시 발생하는 오류 개선</li>
<li>spanner 에 대해 google_spanner_instance 에 대해 force_destory 수정 시 발생하는 오류 개선</li>
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
<li>1.13.0
<ul>
<li><a href="https://www.hashicorp.com/blog/vault-1-13-adds-kubernetes-operator-mfa-improvements-and-more" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>상세 <a href="https://github.com/hashicorp/vault/releases/tag/v1.13.0" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>Multi-namespace access: namespace 간 권한 부여를 통한 secret 공유 기능 추가</li>
<li>Multi Vault Agent: 여러 config 파일 연동하여 다양한 namespace 및 path 에 agent 접근 기능 추가</li>
<li>Certificate revocation for cross-cluster management: PR 구성과 같은 Multi Cluster 구조에서 Cluster 간 PKI 인증서 만료 처리에 대한 동기화 지원</li>
<li>Managed transit keys: Transit 암호화 처리 시 사용자 key 사용 지원</li>
</ul>
</li>
</ul>
</li>
<li>Consul
<ul>
<li>1.15.0
<ul>
<li><a href="https://www.hashicorp.com/blog/consul-1-15-adds-envoy-extensions-and-enhances-access-logging" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>상세 <a href="https://github.com/hashicorp/consul/releases/tag/v1.15.0" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>Envoy access logging: service mesh 구성 시 config entries 와 CRD 를 기반한 손쉬운 envoy log 활성화 지원</li>
<li>Consul Envoy extensions: <code v-pre>EnvoyExtensions</code> 설정을 통해 lua 및 lambda 등에 대한 service mesh 연동 지원</li>
<li>Service-to-service troubleshooting: <code v-pre>consul troubleshoot</code> 명령어 지원을 통해 서비스 간 통신 오류에 대한 진단 지원</li>
<li>Linux VM runtime support in Consul-native API Gateway (beta): Linux VM 환경 기반 Application 의 service mesh 구성에 필요한 API Gateway 지원</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li>1.5.0
<ul>
<li><a href="https://www.hashicorp.com/blog/nomad-1-5-adds-single-sign-on-and-dynamic-node-metadata" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>상세 <a href="https://github.com/hashicorp/nomad/releases/tag/v1.5.0" target="_blank" rel="noopener noreferrer">Release Note<ExternalLinkIcon/></a></li>
<li>Single sign-on and OIDC support: OIDC 기반 SSO 지원 및 Login 기능 추가</li>
<li>Dynamic node metadata: client node 에 대해 constraints, affinity, spread 등 job scheduling 결정에 영향을 주는 meta 정보 동적 설정 지원</li>
<li>Job Templates:  Job 명세 작성 지원을 위한 Template 기능 지원</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


