<template><div><h1 id="_2022년-8월" tabindex="-1"><a class="header-anchor" href="#_2022년-8월" aria-hidden="true">#</a> 2022년 8월</h1>
<h2 id="product-소개" tabindex="-1"><a class="header-anchor" href="#product-소개" aria-hidden="true">#</a> Product 소개</h2>
<ul>
<li>
<p>Consul Service Mesh 에 대한 AWS Lambda 지원 (Public Beta)</p>
<ul>
<li><a href="https://www.hashicorp.com/blog/consul-service-mesh-support-for-aws-lambda-now-in-public-beta" target="_blank" rel="noopener noreferrer">Hashicorp Blog<ExternalLinkIcon/></a></li>
<li>Service Mesh 내 구성된 Service 가 AWS Lambda 를 호출 할 수 있도록 지원함으로써, 기존의 K8S, VM, Nomad 혹은 Amazon ECS 등의 다양한 환경과 더불어 Serverless 환경까지 통합 지원하여 Service Mesh 구성의 범위를 확장하고 Workflow 일원화가 가능합니다.</li>
<li>참고문서 1: <a href="https://www.consul.io/docs/lambda/registration" target="_blank" rel="noopener noreferrer">Register Lambda Functions<ExternalLinkIcon/></a></li>
<li>참고문서 2: <a href="https://www.consul.io/docs/lambda/invocation" target="_blank" rel="noopener noreferrer">Invoke Lambda Fuctions<ExternalLinkIcon/></a></li>
<li>참고문서 3: <a href="https://registry.terraform.io/modules/hashicorp/consul-lambda-registrator/aws/0.1.0-alpha2" target="_blank" rel="noopener noreferrer">Terraform Registry: consul-lambda-registrator<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<h2 id="product-update" tabindex="-1"><a class="header-anchor" href="#product-update" aria-hidden="true">#</a> Product Update</h2>
<ul>
<li>Terraform
<ul>
<li>CLI
<ul>
<li><a href="https://github.com/hashicorp/terraform/releases/tag/v1.2.5" target="_blank" rel="noopener noreferrer">1.25 Release<ExternalLinkIcon/></a>
<ul>
<li>Minor Bug Fix</li>
</ul>
</li>
<li><a href="https://www.terraform.io/enterprise/releases" target="_blank" rel="noopener noreferrer">Enterprise Release<ExternalLinkIcon/></a>
<ul>
<li><a href="https://www.terraform.io/enterprise/releases/2022/v202207-2" target="_blank" rel="noopener noreferrer">7월 Release<ExternalLinkIcon/></a> 출시 (v202206-1)</li>
<li>필수 Upgrade Version: Release Note 에서 * 표기된 Version 은 필수로 거쳐야 하는 Version (예: v202204-2)</li>
<li>Default 값 없는 변수 표시: VCS 연동 시 Default 값 없는 변수 표시 및 Default 값 설정 지</li>
<li>Workspace 최대개수 제한: ORG 당 생성 가능한 최대 Workspace 수 설정</li>
<li>exclude-tags 추가: Workspace 조회 시 특정 tag 가 붙은 Workspace 제외</li>
<li>API Rate Limit Logic 변경: 기존 IP 주소 기반 -&gt; Token 유형 기반</li>
</ul>
</li>
</ul>
</li>
<li>Provider
<ul>
<li><a href="https://github.com/hashicorp/terraform-provider-aws/releases/tag/v4.23.0" target="_blank" rel="noopener noreferrer">AWS v4.23.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>신규 Datasource 추가: Firewall, S3 Public Access</li>
<li>aws_connect_ 관련 오류 수정</li>
<li>aws_iam_role 관련 오류 수정</li>
<li>aws_rds_cluster 관련 오류 수정</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-azurerm/releases/tag/v3.15.0" target="_blank" rel="noopener noreferrer">Azure v3.15.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>azure_cdn resource 및 datasource 추가</li>
<li>azure_route_server 및 bgp_connection resource 추가</li>
</ul>
</li>
<li><a href="https://github.com/hashicorp/terraform-provider-google/releases/tag/v4.29.0" target="_blank" rel="noopener noreferrer">GCP v4.29.0 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>google_compute_snapshot 에 대한 iam 권한 설정 resource 추가</li>
<li>google_artifact_registry_repository 관련 resource 추가</li>
<li>google_sql_database_instance 에 대한 encryption_key_name 설정 추가</li>
<li>BigQuery 에 대한 user_by_email 및 group_by_email 에 대한 대소문자 구분 오류 수정</li>
<li>Compute 에 대한 ipv6 output 생성 오류 수정</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>Vault
<ul>
<li><a href="https://github.com/hashicorp/vault/blob/main/CHANGELOG.md#1111" target="_blank" rel="noopener noreferrer">1.11.1 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>Log Verbosity API 추가: Log 출력 level 변경 지원하는 API</li>
</ul>
</li>
</ul>
</li>
<li>Consul
<ul>
<li><a href="https://github.com/hashicorp/consul/releases/tag/v1.12.3" target="_blank" rel="noopener noreferrer">1.12.3 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>Envoy Proxy 의 최신 보안 Patch 에 대한 지원</li>
<li>HTTP Handler의 URL Decoding 오류 개선</li>
<li>GRPC 통신 관련 Memory Leak 오류 개선</li>
<li>GRPC 혹은 HTTP2 에 대한 Ingress Gateway 구성 시 발생하는 오류 개선</li>
</ul>
</li>
</ul>
</li>
<li>Nomad
<ul>
<li><a href="https://github.com/hashicorp/nomad/releases/tag/v1.3.2" target="_blank" rel="noopener noreferrer">1.3.2 주요 수정사항<ExternalLinkIcon/></a>
<ul>
<li>API 호출 시 Authorization Bearer Header 지원</li>
<li>Template Configuration 에 대한 Fault Tolerance 강화</li>
<li>예기치 못한 ACL Permission 거부 오류에 대한 수정</li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


