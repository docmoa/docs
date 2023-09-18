<template><div><h1 id="_2022년-10월" tabindex="-1"><a class="header-anchor" href="#_2022년-10월" aria-hidden="true">#</a> 2022년 10월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>
<p>Nomad: Nomad Variables and Service Discovery</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/nomad-1-4-adds-nomad-variables-and-updates-service-discovery" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>Hashicorp Nomad는 Container 뿐만 아니라 Container 화 하기 어려운 Legacy Application 에 대해 배포하고 관리하는 데 사용되는 간단하고 유연한 오케스트레이터입니다. Nomad는 On-prem 및 Cloud 환경을 가리지 않고 작동합니다. Cloudflare, Roblox, Q2 및 Pandora와 같은 조직의 프로덕션에서 널리 채택되고 사용됩니다. 새롭게 출시된 HashiCorp Nomad 1.4 Beta Release 에서는 상태 확인을 통해 Service Discovery 지원을 강화하고 사용자가 구성 값을 저장할 수 있도록 하는 Nomad Variable 기능이 도입 되었습니다.</li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.3.0" target="_blank" rel="noopener noreferrer">1.30 Release<ExternalLinkIcon/></a>
<ul>
<li>Optional attributes for object type constraints: 변수 사용 시 Type 지정에 대한 'Optional' 지원</li>
<li>'moved' block 기능개선: resource 에 대한 refactor 기능 개선 (예: aws_instance 를 instance module 로 refactoring)</li>
</ul>
</li>
<li><a href="https://www.terraform.io/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li>
<p><a href="https://www.terraform.io/enterprise/releases/2022/v202209-2" target="_blank" rel="noopener noreferrer">9월 Release<ExternalLinkIcon/></a> 출시 (v202209-2)</p>
</li>
<li>
<p>필수 Upgrade Version: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202207-2, v202204-2)</p>
</li>
<li>
<p>TFE 엔진 내 Vault 에 대한 정책 수정하여 간헐적으로 TFE 구동 시 발생하는 403 오류 해결</p>
</li>
<li>
<p>TFE 엔진 내 Data Migration Logic 에 대해 Postgres 11 이상에서만 지원</p>
</li>
<li>
<p>TF Code 변경에 대한 Test 등을 지원하는 <a href="https://www.terraform.io/enterprise/run/remote-operations#speculative-plans" target="_blank" rel="noopener noreferrer">예측 계획 (Speculative Plans)<ExternalLinkIcon/></a> 기능 지원</p>
</li>
</ul>
</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.32.0" target="_blank" rel="noopener noreferrer">AWS v4.32.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>resource/aws_eks_cluster 에 대한 outpost_config 설정 추가 (Outpost 에서 EKS 사용 지원)</li>
<li>resource/aws_ec2_managed_prefix_list 에 대해 MaxEntries and Entry 반영 오류 개선</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.24.0" target="_blank" rel="noopener noreferrer">Azure v3.24.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>azurerm_linux(windows)_virtual_machine 에 대한 patch_assessment_mode 설정 추가</li>
<li>azurerm_managed_disk 에 대한 PremiumV2_LRS type 지원</li>
<li>azurerm_private_endpoint 에 대한 custom_network_interface_name 설정 추가</li>
<li>azurerm_storage_account 에 대한 azure_files_identity_based_auth 정보 export 지원</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.38.0" target="_blank" rel="noopener noreferrer">GCP v4.38.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>appengine 에 대한 egress_setting 설정 추가</li>
<li>bigquery 에 대한 json_extension 설정 추가</li>
<li>compute 에 대한 json_custom_config 설정 추가</li>
<li>compute 에 대한 most_disruptive_allowed_action update 불가 오류 개선</li>
<li>storage 에 대한 lifecycle_rule.condition.age 설정 오류 개선</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>Vault
<ul>
<li><a href="https://github.com/hashicorp/vault/blob/main/CHANGELOG.md#1113" target="_blank" rel="noopener noreferrer">1.11.3 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>identity/oidc 관련 오류 개선</li>
<li>integrated storage (raft) 방식 사용 시 retry join 관련 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li>Consul
<ul>
<li><a href="https://github.com/hashicorp/consul/releases/tag/v1.13.2" target="_blank" rel="noopener noreferrer">1.13.2 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 consul cli command: <a href="https://www.consul.io/commands/peering" target="_blank" rel="noopener noreferrer">peering<ExternalLinkIcon/></a></li>
<li>Metric 관련 Label 기능 추가</li>
<li>Envoy 관련 Outlier (이상감지) 에 대한 추가 Parameter 지원</li>
<li>Consul Connect 에 대해 ConnectCA CSR requests 의 URI Length Check 개선</li>
<li>auto-config JWT authorization 에 대한 input 값 검증 개선</li>
<li>Consul Connect (Service Mesh) 의 TLS 인증서 관련 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li><a href="https://github.com/hashicorp/nomad/releases/tag/v1.3.5" target="_blank" rel="noopener noreferrer">1.3.5 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>Consul 연동 시 Namespace 정보 조회 관련 개선</li>
<li>template 사용시 change_mode = &quot;script&quot; 명시로 인한 오류 개선</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


