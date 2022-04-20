---
meta:
  - name: Terraform 코드에서 Vault 연동하기
    content: Terraform 코드 상에서 Vault 연동하기
author : "powhapki"
tags: ["terraform", "vault", "aws"]

---

# Terraform 코드 상에서 Vault 연동하기

> Inject Secrets into Terraform Using the Vault Provider <https://learn.hashicorp.com/tutorials/terraform/secrets-vault?in=vault/secrets-management> <BR>
> Using Vault credentials in Terraform configuration <https://registry.terraform.io/providers/hashicorp/vault/latest/docs#using-vault-credentials-in-terraform-configuration> <BR>
> Best Practices for using Terraform with Vault <https://www.youtube.com/watch?v=fOybhcbuxJ0> 

Terraform Enterprise/Terraform Cloud를 사용할 때 Workspace의 변수(Variable)를 Vault를 사용하여 설정하는 것은 Terraform의 TFE 프로바이더와 Vault Provider를 사용하여 가능하다.

이번 예제는 Terraform Configuration Template에서 Vault를 사용하는 예제이다. Vault 인증 시 AppRole인증을 사용하였으나 기타 지원되는 인증 방법을 사용할 수 있다.

AWS Provider 설정 시 필요한 access_key와 secret_key를 환경 변수 설정이 아니라 코드 실행 시 Vault AWS 시크릿 엔진을 사용하도록 구성된 예제로, 코드는 다음과 같이 4개의 파일로 구성된다.

```bash
❯ tree
.
├── ec2.tf
├── provider.tf
├── terraform.tfvars
└── variables.tf

0 directories, 4 files
```

> 위 예제를 사용하기 위해서는 Vault 상의 AWS 시크릿 엔진이 구성되어 있어야 하고, 인증을 위한 AppRole 구성 그리고 정책이 사전에 설정되어 있어야 한다.

## 1. Provider 설정 (provider.tf)
사용할 프로바이더로 aws(자원 배포 대상)와 vault를 지정.


```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.23.0"
    }
    vault = {
      source  = "hashicorp/vault"
      version = "2.17.0"
    }
  }
}

provider "vault" {
  # It is strongly recommended to configure this provider through the environment variables described above, so that each user can have
  # separate credentials set in the environment.
  #
  # This will default to using $VAULT_ADDR
  # But can be set explicitly
  # address = "https://vault.example.net:8200"
  address = var.vault_addr

  
  auth_login {
  path = "auth/approle/login"
  parameters = {
    role_id   = var.login_approle_role_id
    secret_id = var.login_approle_secret_id
  }
 }
}

# 코드 실행 시 Vault AWS 시크릿 엔진을 사용하여, data 값으로 access_key와 secret_key 생성하여 사용
provider "aws" {
  region     = var.region
  access_key = data.vault_aws_access_credentials.creds.access_key
  secret_key = data.vault_aws_access_credentials.creds.secret_key
  # STS Token을 사용하지 않는 경우 주석 처리
  token      = data.vault_aws_access_credentials.creds.security_token
}

```

## 2. 자원 생성 시 사용 설정 (ec2.tf)
data 소스를 이용하여 Vault에 설정된 AWS 시크릿 엔진을 읽어서 access_key와 secret_key를 생성하고, 해당 정보를 provider에서 사용하게 된다.

```hcl
data "vault_aws_access_credentials" "creds" {
  # AWS 시크릿 엔진 경로 : 기본은 AWS
  backend = var.aws_sec_path
  # AWS 시크릿 엔진 구성 시 사용한  Role 이름
  role    = var.aws_sec_role
  #STS Token으로 발급받아 설정. 아닌 경우, 다음 코드를 주석 처리 후 실행할 것.
  type ="sts"
}

# AMI 정보 조회
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-trusty-14.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# Create AWS EC2 Instance
resource "aws_instance" "main" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t2.nano"

  tags = {
    Name  = var.name
    TTL   = var.ttl
    owner = "${var.name}-guide"
  }
}
```

## 3. 변수 선언 및 변수 값 지정
### 3.1 변수 선언 (variables.tf)


```hcl
variable region {
  default="ap-northeast-2"
}

variable "name" { default = "vault-dynamic-creds"}

variable ttl { default = "24h"}

variable "vault_addr" {
  description = "Vault Server address format : http://IP_ADDRES:8200"
  default     = "http://127.0.0.1:8200"
}

variable login_approle_role_id {
  description = "AppRole의 Role ID값 설정"
}
variable login_approle_secret_id {
  description = "AppRole의 Secret ID값 설정"
}
# 
variable aws_sec_path {
  description = "AWS 시크릿 엔진 경로, 마지막은 반드시 '/'로 끝나게 설정."
  default = "aws/"
}

variable aws_sec_role {
  description = "AWS 시크릿 엔진 상의 Role 이름"
  default ="VAULT상에 생성된 AWS시크릿 엔진의 Role이름"
}
```

### 3.2 변수 값 지정 (terraform.tfvars)

```hcl
vault_addr="http://127.0.0.1:8200" 
login_approle_role_id="AppRole의 Role_ID값"
login_approle_secret_id="AppRole의 Secret_ID값" 

```

# 개선 아이디어
- terraform.tfvars 상의 Role_ID, Secret_ID값은 Terraform Cloud/Enterprise를 사용하는 경우, Workspace 상의 변수로 설정할 수 있다. --> 해당 작업을 수행하는 별도의 Admin Workspace가 있는 경우, Run Trigger를 활용할 수 있다.
- terraform.tfvars 파일을 Vault Agent, ConsulTemplate 또는 envConsul을 이용하여 설정 후 사용하는 것도 가능.


