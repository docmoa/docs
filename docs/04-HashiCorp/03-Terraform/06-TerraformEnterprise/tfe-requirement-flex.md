---
description: Terraform Enterprise 설치 요구사항 정리
tag: ["Terraform", "Enterprise", "tfe"]
---

# Terraform Enterprise Requirements - Flexible Deployment

> https://developer.hashicorp.com/terraform/enterprise/flexible-deployments/install

> v202406-1 기준

## 1. License File

- Terraform Enterprise Image 다운받기위한 인증용도로 사용
  - images.registry.hashicorp.com
- Terraform Enterprise 프로세스(컨테이너)를 실행할 때 사용
- 환경변수로 선언하는 경우
  - 옵션1) `TFE_LICENSE`에 라이선스의 평문 내용을 설정
  - 옵션2) `TFE_LICENSE_PATH`에 라이선스 파일 경로를 설정



## 2. TLS Certification

Terraform Enterprise는 TLS 인증서와 Private key가 필요합니다.

- 인증서는 X.509 형식
- 인증서와 키는 PEM(base64) 인코딩 형태
- Terraform Enteprise를 위한 FQDN (tfe.example.com)에 대해 발생되거나, 와일드카드(*.example.com)로 발급되어야 하며, Terraform Enterprise가 설치되는 호스트 이름과 일치해야 합니다.
- 인증서는 공인, 사설 모두 사용할 수 있지만 Terraform Enterprise와 연계될 것으로 예상되는 모든 서비스에서 신뢰여부를 확인하게 됩니다.
  - VCS, CICD, API 호출 도구, Slack 등
- CN(Common Name), DN(Domain Names) 모두에서 SAN(Subject Alternative Name)을 사용하는지 확인



## 3. 실행 환경

- Docker 
  - Any Linux
  - 23.0.x ~ 26.1.x
- Podman
  - RHEL 8+
  - 4.3.0 ~
- Kubernetes
  - EKS, AKS, GKE, OpenShift(beta)
- Nomad
  - Any OS + Docker/Podman
  - 1.5.0 ~



## 4. Data Store

### 4.1 Disk

설치 환경을 위한 최소 40GB이상의 디스크를 요구합니다.

- 물리 디스크
- AWS EBS
- GCP Zonal Persistent Disk
- Azure Disk Storage
- iSCSI
- SAN



### 4.2 PostgreSQL

Active/Active 또는 외부 저장소로서 연결에 사용됩니다.

Terraform Enterprise의 애플리케이션 데이터, 워크스페이스 설정, 사용자 및 그룹 설정, Run 실행 정보가 저장됩니다.

- 설치형 PostgreSQL 및 AWS RDS, Azure DB, GCP SQL의 관리형 PostgreSQL을 지원
- 12.x, 13.x, 14.4+, 15.x



### 4.3 Object Storage

Active/Active 또는 외부 저장소로서 연결에 사용됩니다.

State 파일, 실행 계획 파일, 실행 로그, 구성 버전의 내용이 저장됩니다.

- AWS S3, Azure Blob Storage, Google Cloud Storage, MinIO 등과 같은 S3 호환 Object Storage를 지원



### 4.4 Redis

Active/Active 또는 외부 저장소로서 연결에 사용됩니다.

데이터 캐싱용으로 사용됩니다.

- 설치형 Redis, AWs ElastiCache, Azure Cache, Google cloud Memorystore 같은 관리형 Redis를 지원
- 6.x, 7.x(권장)
- Redis 클러스터 모드는 미지원



### 4.5 HashiCorp Vault (옵션)

`Object Storage`내의 파일 객체를 암호화하고 해독하는 암호화 키를 관리합니다. Vault가 없는 경우 키는 PostgreSQL에 저장됩니다.



## 5. Network



### 5.1 Ingress

| 정의                   | 기본 포트 | 용도                                            |
| ---------------------- | --------- | ----------------------------------------------- |
| TFE_HTTP_PORT          | 80        | HTTPS로 리다이렉션                              |
| TFE_HTTPS_PORT         | 443       | Terraform Enterprise에 대한 모든 API 및 UI 요청 |
| TFE_METRICS_HTTP_PORT  | 9090      | 메트릭 측정을 위한 HTTP 포트                    |
| TFE_METRICS_HTTPS_PORT | 9091      | 메트릭 측정을 위한 HTTPS 포트                   |

- 메트릭 측정을 위한 포트는 `TFE_METRICS_ENABLE` 설정으로 활성/비활성 가능합니다.



### 5.2 Egress

Terraform의 원활한 업데이트 및 프로바이더 사용을 위한 목적지 입니다.

#### 5.2.1 HashiCorp container registry

- [`https://images.releases.hashicorp.com`](https://developer.hashicorp.com/terraform/enterprise/flexible-deployments/install/requirements/network#https-images-releases-hashicorp-com): Terraform Enterprise의 설치 이미지 및 Run 실행을 위한 Terraform Agent 이미지 저장소
- [`https://helm.releases.hashicorp.com`](https://developer.hashicorp.com/terraform/enterprise/flexible-deployments/install/requirements/network#https-helm-releases-hashicorp-com): Kubernetes에 설치하는 경우 Helm 차트를 제공하는 저장소

#### 5.2.2 HashiCorp Service APIs

- [`registry.terraform.io`](https://developer.hashicorp.com/terraform/enterprise/flexible-deployments/install/requirements/network#registry-terraform-io) : 프로바이더를 제공하는 저장소
- [`releases.hashicorp.com`](https://developer.hashicorp.com/terraform/enterprise/flexible-deployments/install/requirements/network#releases-hashicorp-com) : Terraform 바이너리를 제공하는 저장소
- [`https://yy0ffni7mf-dsn.algolia.net/`](https://developer.hashicorp.com/terraform/enterprise/flexible-deployments/install/requirements/network#https-yy0ffni7mf-dsn-algolia-net) - 테라폼 레지스트리의 [Algolia](https://www.algolia.com/) 애플리케이션의 API 엔드포인트로, 레지스트리의 현재 리소스를 색인하고 TFE의 공개 검색 기능을 구동하는 데 사용됩니다.

#### 5.2.3 Cost Estimation APIs

Terraform Enterprise내의 AWS/Azure/GCP의 비용 계산 옵션을 활성화 하는 경우 다음의 API를 호출합니다.

- [`api.pricing.us-east-1.amazonaws.com`](https://developer.hashicorp.com/terraform/enterprise/flexible-deployments/install/requirements/network#api-pricing-us-east-1-amazonaws-com)
- [`cloudbilling.googleapis.com`](https://developer.hashicorp.com/terraform/enterprise/flexible-deployments/install/requirements/network#cloudbilling-googleapis-com)
- [`prices.azure.com`](https://developer.hashicorp.com/terraform/enterprise/flexible-deployments/install/requirements/network#prices-azure-com)

#### 5.2.4 기타 연계 서비스

- VCS
- SAML 연동을 위한 IDP(ADFS, Okta 등)
- Terraform에서 연계하는 프로바이더 제공자의 API