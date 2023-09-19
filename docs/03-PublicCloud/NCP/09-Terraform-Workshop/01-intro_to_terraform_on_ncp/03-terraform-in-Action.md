---
description: Naver Cloud Platform에서의 Terraform 실습
tag: ["ncloud", "ncp", "terraform", "workshop"]

---

# 03. 테라폼 실행

## 리소스 분석

모든 Terraform으로 구성되는 리소스는 정확히 동일한 방식으로 구성됩니다.

```hcl
resource type "name" {
  parameter = "foo"
  parameter2 = "bar"
  list = ["one", "two", "three"]
}
```

- resource : 최상위 키워드
- type : 리소스 타입. Example: `ncloud_vpc`
- name : 이 리소스를 참조하는 임의의 이름입니다. terraform에서 내부적으로 사용합니다. 이 필드는 변수가 될 수 없습니다.

## Terraform Provider 구성

Terraform Core는 무엇이든 빌드하려면 하나 이상의 Provider가 필요합니다.

사용하려는 Provider의 버전을 쑤동으로 구성 할 수 있습니다. 이 옵션을 비워두면 Terraform은 기본적으로 사용 가능한 최신 버전의 Provider를 사용합니다.

```hcl {5}
terraform {
  required_providers {
    ncloud = {
      source  = "NaverCloudPlatform/ncloud"
      version = ">= 2.1.2"
    }
  }
}

provider "ncloud" { }
```

## 버전관리 연산자

- = (or no operator): 정확한 버전 동등성
- !=: 버전이 같지 않음
- \>, >=, <, <=: 버전 비교
- ~>: 약한 제약, 허용되는 가장 오래된 버전과 최신 버전을 모두 제한합니다.
    ~> 0.9 설정은 다음과 같습니다.  >= 0.9, < 1.0
    ~> 0.8.4 설정은 다음과 같습니다. >= 0.8.4, < 0.9


## Terraform Apply

```bash {1}
$ terraform apply
...
Terraform will perform the following actions:

  # ncloud_vpc.hashicat will be created
  + resource "ncloud_vpc" "hashicat" {
      + default_access_control_group_no = (known after apply)
      ...
      + ipv4_cidr_block                 = "10.0.0.0/16"
      + vpc_no                          = (known after apply)
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

`terraform apply`는 우선 `plan`을 실행하고, 승인하면 변경 사항을 적용합니다.

## Terraform Destroy

```bash {1}
$ terraform apply
...
Terraform will perform the following actions:

  # ncloud_vpc.hashicat will be destoryed
  - resource "ncloud_vpc" "hashicat" {
      ...
      - ipv4_cidr_block   = "10.0.0.0/16" -> null
    }

Plan: 0 to add, 0 to change, 1 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
```

`terraform destroy`는 `action`과 반대 입니다. 승인하면 인프라가 제거됩니다.

## Terraform Format

Terraform은 내장 된 코드 포맷터/클리너와 함께 제공됩니다. 모든 여백과 목록 들여 쓰기를 깔끔하고 깔끔하게 만들 수 있습니다. 아름다운 코드가 더 잘 동작하는 것(?) 같습니다.

```bash
terraform fmt
````

`*.tf` 파일이 포함 된 디렉토리에서 실행하기 만하면 코드가 정리됩니다.

## Terraform Data Sources

```hcl
data "ncloud_member_server_images" "prod" {
 filter {
    name = "name"
    values = [data.terraform_remote_state.image_name.outputs.image_name]
  }
}

resource "ncloud_server" "server" {
  name                      = "${var.server_name}${random_id.id.hex}"
  member_server_image_no    = data.ncloud_member_server_images.prod.member_server_images.0
  server_product_code       = "SPSVRGPUSSD00001" 
  login_key_name            = ncloud_login_key.key.key_name
  zone                      = var.zone
}
```

Data Source(data)는 Provider가 기존 리소스를 반환하도록 쿼리하는 방법입니다.

생성되어있는 리소스나 Provider로 조회할 수 있는 리소스 정보를 다른 리소스 구성에서 접근할 수 있습니다.

## Terraform Dependency Mapping

```hcl {4,9,10,12,13}
data "ncloud_member_server_images" "prod" {
 filter {
    name = "name"
    values = [data.terraform_remote_state.image_name.outputs.image_name]
  }
}

resource "ncloud_server" "server" {
  name                      = "${var.server_name}${random_id.id.hex}"
  member_server_image_no    = data.ncloud_member_server_images.prod.member_server_images.0
  server_product_code       = "SPSVRGPUSSD00001" 
  login_key_name            = ncloud_login_key.key.key_name
  zone                      = var.zone
}
```

Terraform은 자동으로 종속성을 추적 할 수 있습니다. 앞서 설명된 리소스를 살펴보십시오. ncloud_server 리소스에서 강조 표시된 줄을 확인합니다. 이것이 테라 폼에서 한 리소스가 다른 리소스를 참조하도록하는 방법입니다.

## Terraform 코드 구성

Terraform은 Workspace에서 `.tf` 확장자로 끝나는 모든 파일을 읽지만 대표적으로는 `main.tf`, `variables.tf`, `outputs.tf`를 갖는 것입니다. 원하는 경우 더 많은 tf 파일을 추가 할 수 있습니다.

::: info 파일 구조
```bash:no-line-numbers
Workspace
├── `main.tf`
├── `outputs.tf`
├── terraform.tfvars
└── `variables.tf`
```
:::

이러한 각 파일을 자세히 살펴 보겠습니다.

### `main.tf` 파일

첫 번째 파일은 `main.tf`입니다. 일반적으로 테라 폼 코드를 저장하는 곳입니다. 더 크고 복잡한 인프라를 사용하면이를 여러 파일로 나눌 수 있습니다.

```hcl
resource "ncloud_vpc" "main" {
  ipv4_cidr_block = var.address_space
  name            = lower("${var.prefix}-vpc-${var.region}")
}

resource "ncloud_subnet" "main" {
  name           = "${var.name_scn02}-public"
  vpc_no         = ncloud_vpc.vpc_scn_02.id
  subnet         = cidrsubnet(ncloud_vpc.main.ipv4_cidr_block, 8, 0)
  zone           = "KR-2"
  network_acl_no = ncloud_network_acl.network_acl_02_public.id
  subnet_type    = "PUBLIC"
}

...생략...
```

### `variable.tf` 파일

두 번째 파일은 `variables.tf`입니다. 여기에서 변수를 정의하고 선택적으로 일부 기본값을 설정합니다.

```hcl
variable "prefix" {
  description = "This prefix will be included in the name of most resources."
}

variable "region" {
  description = "The region where the resources are created."
  default     = "KR"
}
```

### `output.tf` 파일

`output.tf` 파일은 테라 폼 적용이 끝날 때 표시 할 메시지 또는 데이터를 구성하는 곳입니다.

```hcl
output "acl_public_id" {
  value = ncloud_network_acl.network_acl_public.id
}

output "public_addr" {
  value = "http://${ncloud_public_ip.main.public_ip}:8080"
}
```

## Terraform Dependency Graph

![](./image/blast_radius_graph_1.png)

terraform 리소스 그래프는 리소스 간의 종속성을 시각적으로 보여줍니다.

`Region` 및 `Prefix` 변수는 리소스 그룹을 만드는 데 필요하며 이는 가상 네트워크를 구축하는 데 필요합니다.

---

실습을 위해 다음장으로 이동하세요.

[:computer: Lab - Terraform in Action](./03-z-lab_terraform_action.html)