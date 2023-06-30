---
meta:
  - name: description
    content: AWS Auth Method 설명 및 구성 방법 안내
tags: ["vault auth", "AWS"]
---

# AWS Auth Method

> https://developer.hashicorp.com/vault/docs/auth/aws
>
> https://developer.hashicorp.com/vault/api-docs/auth/aws
>
> https://blog.gruntwork.io/a-guide-to-automating-hashicorp-vault-3-authenticating-with-an-iam-user-or-role-a3203a3ee088



AWS auth method는 IAM 계정 또는 EC2 인스턴스에 대한 Vault 토큰을 검색하는 자동화된 메커니즘을 제공한다. 이 방식은 다양한 상황에서 운영자가 보안에 민감한 자격증명(토큰, 사용자 이름/비밀번호, 클라이언트 인증서 등)을 수동으로 먼저 생성할 필요가 없다.



## 1. 인증 워크플로

AWS auth method는 `iam`과 `ec2` 방식을 지원한다.



### `iam` 인증 방식

AWS IAM 자격 증명으로 서명된 AWS 요청이 인증에 사용된다. 거의 모든 AWS 리소스는 AWS 보안 토큰 서비스(STS)를 호출하여 자신의 신원을 조회할 수 있다. Vault의 AWS iam 인증 방식은 사용자가 직접 요청을 보내는 대신, 서명된 요청 데이터를 Vault로 전송하여 STS에 서명된 요청을 생성할 수 있도록 함으로써 이러한 이점을 활용한다. Vault는 요청을 실행하고 AWS(다시 말해서 신뢰할 수 있는 제3자)로부터 사용자의 실제 신원을 확인한다. `iam`방식이 좀더 최신의 방식이며, 기존  `ec2`방식의 한계였던 람다 또는 ECS 같은 다양한 유형의 서비스에서 작동한다.

AWS STS API에는 클라이언트의 신원을 확인할 수 있는 메서드인 `sts:GetCallerIdentity`가 포함되어 있다. 클라이언트는 AWS 서명 v4 알고리즘을 사용하여 `GetCallerIdentity` 쿼리에 서명하고 이를 Vault 서버로 보낸다. `GetCallerIdentity` 요청에 서명하는 데 사용되는 자격 증명은 EC2 인스턴스에 대한 EC2 인스턴스 메타데이터 서비스 또는 AWS Lambda 함수 실행의 AWS 환경 변수에서 가져올 수 있으므로 운영자가 먼저 신원 자료를 수동으로 프로비저닝할 필요가 없다. 그리고 사용되는 자격 증명은 원칙적으로 AWS내부의 Role이부여된 리소스 뿐만 아니라 Access Key를 사용하여 어디에서나 가져올 수 있다.

`GetCallerIdentity` 쿼리는 `Request URL`, `Request Body`, `Request Header`, `Request Method`의 네 가지 정보로 구성되며, AWS 서명은 이러한 필드를 통해 계산된다. Vault 서버는 이 정보를 사용해 쿼리를 재구성하고 AWS STS 서비스로 전달한다. STS 서비스의 응답에 따라 서버는 클라이언트를 인증한다.

클라이언트가 AWS STS API 엔드포인트와 통신하기 위한 네트워크 접근이 필요하지 않으며, 요청에 서명하기 위한 자격 증명에 대한 액세스만 있으면 된다. 그러나 Vault 서버가 STS 엔드포인트로 요청을 전송하려면 네트워크 수준 액세스가 필요하다.

서명된 각 AWS 요청에는 현재 타임스탬프가 포함되어 리플레이 공격의 위험을 완화합니다. 또한, Vault에서는 다양한 유형의 리플레이 공격(예: 개발 Vault 인스턴스에서 서명된 `GetCallerIdentity` 요청을 도용하여 프로덕션 Vault 인스턴스에 인증하는 데 사용하는 공격)을 완화하기 위해 추가 헤더인 X-Vault-AWS-IAM-Server-ID를 요구할 수 있다. 또한 Vault는 이 헤더가 AWS 서명에 포함된 헤더 중 하나이어야 하며, 해당 서명을 인증하기 위해 AWS에 의존한다.

AWS API 엔드포인트는 서명된 GET 요청과 POST 요청을 모두 지원하지만, 간단하게 하기 위해 aws auth 메서드는 POST 요청만 지원합니다. 또한 사전 서명된 요청, 즉 인증 정보가 포함된 `X-Amz-Credential`, `X-Amz-Signature`, `X-Amz-SignedHeaders` GET 쿼리 매개 변수가 있는 요청은 지원하지 않는다.

또한 `GetCallerIdentity` 호출과 관련하여 어떤 종류의 권한 부여도 포함하지 않는다. 예를 들어, 자격 증명에 대해 모든 액세스가 MFA 인증을 받아야 하는 IAM 정책이 있는 경우, MFA 인증을 받지 않은 자격 증명(즉, `GetSessionToken`을 호출하고 MFA 코드를 제공하여 검색한 자격 증명이 아닌 원시 자격 증명)은 이 방법을 사용하여 여전히 Vault에 인증할 수 있다. Vault에 인증하는 동안 IAM 주체가 MFA 인증을 받도록 강제하는 것은 불가능하다.



### `ec2` 인증 방식

ec2 방식에서는 AWS가 신뢰할 수 있는 제3자로 취급되며, 각 EC2 인스턴스를 고유하게 나타내는 암호화 서명된 동적 메타데이터 정보가 인증에 사용된다. 이 메타데이터 정보는 AWS가 모든 EC2 인스턴스에 자동으로 제공한다. 특정 AMI, 특정 인스턴스 프로파일의 EC2 인스턴스 또는 특수 태그 값을 가진 EC2 인스턴스(role_tag 기능을 통해)에서 EC2 인스턴스에 대한 액세스를 제한하는 등 EC2 인스턴스를 처리하는 데 특화되어 있다.

Amazon EC2 인스턴스는 인스턴스를 설명하는 메타데이터에 액세스할 수 있습니다. Vault EC2 인증 메서드는 이 메타데이터의 구성 요소를 활용하여 초기 Vault 토큰을 인증하고 EC2 인스턴스에 배포한다. 데이터 흐름(아래 그래픽에도 표시됨)은 다음과 같다:

![assets (1368×998) 2023-06-30 20-34-15](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/assets%20(1368%C3%97998)%202023-06-30%2020-34-15.png)

1. AWS EC2 인스턴스는 EC2 메타데이터 서비스에서 AWS 인스턴스 ID 문서를 가져옵니다. AWS는 데이터 자체 외에도 데이터의 PKCS#7 서명을 제공하고, 서명을 확인하는 데 사용할 수 있는 공개 키(지역별로)를 게시한다.
2. AWS EC2 인스턴스는 PKCS#7 서명을 사용하여 Vault에 요청합니다. PKCS#7 서명에는 인스턴스 ID 문서가 포함된다.
3. Vault는 PKCS#7 문서의 서명을 확인하여 정보가 AWS에 의해 정확하게 인증되었는지 확인합니다. 이 프로세스는 문서 데이터의 유효성과 무결성을 모두 검증합니다. 추가 보안 조치로, Vault는 인스턴스가 현재 퍼블릭 EC2 API 엔드포인트를 사용하여 실행 중인지 확인한다.
4. 모든 단계가 성공적으로 완료되면 Vault는 초기 Vault 토큰을 EC2 인스턴스에 반환합니다. 이 토큰은 인스턴스 메타데이터를 기반으로 구성된 모든 정책에 매핑된다.



## 2. Vault의 AWS auth method 인증에 필요한 권장 IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "iam:GetInstanceProfile",
        "iam:GetUser",
        "iam:GetRole"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": ["sts:AssumeRole"],
      "Resource": ["arn:aws:iam::<AccountId>:role/<VaultRole>"]
    },
    {
      "Sid": "ManageOwnAccessKeys",
      "Effect": "Allow",
      "Action": [
        "iam:CreateAccessKey",
        "iam:DeleteAccessKey",
        "iam:GetAccessKeyLastUsed",
        "iam:GetUser",
        "iam:ListAccessKeys",
        "iam:UpdateAccessKey"
      ],
      "Resource": "arn:aws:iam::*:user/${aws:username}"
    },
    {
      "Sid": "IAM_Method",
      "Effect": "Allow",
      "Action": [
        "sts:GetCallerIdentity"
      ],
      "Resource": "*"
    }
  ]
}

```

- `arn:aws:iam::\<AccountId\>:*`: 로 구성하면 AWS 계정의 모든 주체가 이 계정에 로그인
- `arn:aws:iam::\<AccountId\>:role/*` 로 구성하면 AWS 계정의 모든 IAM 역할이 해당 계정에 로그인
- 와일드카드를 지정하려면 전체 사용자 경로를 올바르게 확인할 수 있도록 Vault에 `iam:GetUser` 및 `iam:GetRole` 권한을 부여
- ARN이 `arn:aws:iam::123456789012:role/MyRole`인 역할이 있는 경우, 해당 역할에서 AssumeRole을 호출하여 반환되는 자격 증명은 `arn:aws:sts::123456789012:assumed-role/MyRole/RoleSessionName`이며, 여기서 `RoleSessionName`은 AssumeRole API 호출의 세션 이름
- `ec2:DescribeInstances`는 ec2 인증 메서드를 사용하거나 EC2 인스턴스가 role binding 요구 사항을 충족하는지 확인하기 위해 `ec2_instance`엔티티 유형을 추론할 때 필요
- `iam:GetInstanceProfile`은 ec2 인증 메서드에 `bound_iam_role_arn`이 있을 때 사용
- 계정간 접근이 필요한 경우 `sts:AssumeRole` 구문이 필요(지정된 리소스는 계정 간 액세스를 구성한 모든 역할의 목록이어야 하며, 각 역할에는 이 IAM 정책이 첨부되어 있어야 하며 `sts:AssumeRole` 문은 제외)
- 정적 자격 증명으로 Vault를 구성한 후 Rotate Root Credentials API 호출을 통해 이러한 자격 증명을 회전하려는 경우 `ManageOwnAccessKeys` 구절이 필요



## 3. AWS 외부에서 구성

AWS외부에서 구성하는 경우 AWS 인증을 위한 Policy가 구성된 Access Key/Secret Key가 필요하다.



### `aws` auth method 활성화

```bash
$ vault auth enable aws
```



### 활성화된 auth method의 구성

- access_key
- secret_key

```bash
$ vault write auth/aws/config/client secret_key=vCtSM8ZUEQ3mOFVlYPBQkf2sO6F/W7a5TVzrl3Oj access_key=VKIAJBRHKH6EVTTNXDHA
```



### `ec2` role 구성 및 로그인

```bash
$ vault write auth/aws/role/dev-role auth_type=ec2 bound_ami_id=ami-fce3c696 policies=prod,dev max_ttl=500h

$ SIGNATURE=$(curl -s http://169.254.169.254/latest/dynamic/instance-identity/rsa2048 | tr -d '\n')

$ vault write auth/aws/login role=dev-role pkcs7=$SIGNATURE
```



### `iam` role 구성 및 로그인

```bash
$ vault write auth/aws/role/dev-role-iam auth_type=iam  bound_iam_principal_arn=arn:aws:iam::123456789012:role/MyRole policies=prod,dev max_ttl=500h

$ vault login -method=aws header_value=vault.example.com role=dev-role-iam \
        aws_access_key_id=<access_key> \
        aws_secret_access_key=<secret_key> \
        aws_security_token=<security_token>

# AWS SDK가 지원하는 인증 방식이 설정되어있는 경우 aws_access_key_id 생략 가능
# ~/.aws/credentials
# IAM 인스턴스 프로파일
# ECS task role 등
$ vault login -method=aws header_value=vault.example.com role=dev-role-iam

# 리전 지정이 필요한 경우 대상 지정
$ vault login -method=aws region=us-west-2 role=dev-role-iam

# 요청 매개변수를 생성하여 로그인 메서드에 전달
vault write auth/aws/login role=dev-role-iam \
        iam_http_request_method=POST \
        iam_request_url=aHR0cHM6Ly9zdHMuYW1hem9uYXdzLmNvbS8= \
        iam_request_body=QWN0aW9uPUdldENhbGxlcklkZW50aXR5JlZlcnNpb249MjAxMS0wNi0xNQ== \
        iam_request_headers=eyJDb250ZW50LUxlbmd0aCI6IFsiNDMiXSwgIlVzZXItQWdlbnQiOiBbImF3cy1zZGstZ28vMS40LjEyIChnbzEuNy4xOyBsaW51eDsgYW1kNjQpIl0sICJYLVZhdWx0LUFXU0lBTS1TZXJ2ZXItSWQiOiBbInZhdWx0LmV4YW1wbGUuY29tIl0sICJYLUFtei1EYXRlIjogWyIyMDE2MDkzMFQwNDMxMjFaIl0sICJDb250ZW50LVR5cGUiOiBbImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD11dGYtOCJdLCAiQXV0aG9yaXphdGlvbiI6IFsiQVdTNC1ITUFDLVNIQTI1NiBDcmVkZW50aWFsPWZvby8yMDE2MDkzMC91cy1lYXN0LTEvc3RzL2F3czRfcmVxdWVzdCwgU2lnbmVkSGVhZGVycz1jb250ZW50LWxlbmd0aDtjb250ZW50LXR5cGU7aG9zdDt4LWFtei1kYXRlO3gtdmF1bHQtc2VydmVyLCBTaWduYXR1cmU9YTY5ZmQ3NTBhMzQ0NWM0ZTU1M2UxYjNlNzlkM2RhOTBlZWY1NDA0N2YxZWI0ZWZlOGZmYmM5YzQyOGMyNjU1YiJdfQ==
```

- iam_request_url 값 예시 : `https://sts.amazonaws.com/`

- iam_request_body 값 예시 : `Action=GetCallerIdentity&Version=2011-06-15`

- iam_request_headers 값 예시 :

  ```json
  {
    "Content-Length": [
      "43"
    ],
    "User-Agent": [
      "aws-sdk-go/1.4.12 (go1.7.1; linux; amd64)"
    ],
    "X-Vault-AWSIAM-Server-Id": [
      "vault.example.com"
    ],
    "X-Amz-Date": [
      "20160930T043121Z"
    ],
    "Content-Type": [
      "application/x-www-form-urlencoded; charset=utf-8"
    ],
    "Authorization": [
      "AWS4-HMAC-SHA256 Credential=foo/20160930/us-east-1/sts/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-date;x-vault-server, Signature=a69fd750a3445c4e553e1b3e79d3da90eef54047f1eb4efe8ffbc9c428c2655b"
    ]
  }
  ```

  

## 4. AWS 내부에서 구성

AWS 내부에서 구성된 Vault 서버 인스턴스 및 클라이언트에 프로파일을 구성하여 Access Key를 생략하고 인증을 구현할 수 있다.



### Terraform Sample

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.5.1"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "3.0.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"

  default_tags {
    tags = {
      Environment = "Demo"
      Owner       = "gs@hashicorp.com"
      Project     = "example"
    }
  }
}

data "aws_caller_identity" "current" {}

resource "aws_vpc" "example" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
}

data "aws_availability_zones" "available" {
  state = "available"
}

// public subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.example.id
  availability_zone       = data.aws_availability_zones.available.names.0
  cidr_block              = cidrsubnet(aws_vpc.example.cidr_block, 8, 0) // "10.0.0.0/24" & "10.0.1.0/24"
  map_public_ip_on_launch = true
}

resource "aws_internet_gateway" "public" {
  vpc_id = aws_vpc.example.id
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.example.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.public.id
  }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

resource "aws_eip" "public" {
  domain = "vpc"
}

resource "aws_nat_gateway" "public" {
  allocation_id = aws_eip.public.id
  subnet_id     = aws_subnet.public.id
}

// SG
resource "aws_security_group" "example" {
  name   = "example"
  vpc_id = aws_vpc.example.id

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

resource "aws_security_group_rule" "example_ssh" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.example.id
}

resource "aws_security_group_rule" "example_vault" {
  type              = "ingress"
  from_port         = 8200
  to_port           = 8200
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.example.id
}

// key pair
resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "local_sensitive_file" "ssh_private" {
  content  = tls_private_key.ssh.private_key_pem
  filename = "${path.module}/ssh_private"
}

resource "random_id" "key_id" {
  keepers = {
    ami_id = tls_private_key.ssh.public_key_openssh
  }

  byte_length = 8
}

resource "aws_key_pair" "ssh" {
  key_name   = "key-${random_id.key_id.hex}"
  public_key = tls_private_key.ssh.public_key_openssh
}

// EC2
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

data "aws_iam_policy_document" "example_instance_role_client" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "example_client_instance_role_client" {
  name_prefix        = "auth-example-iam-role-client"
  assume_role_policy = data.aws_iam_policy_document.example_instance_role_client.json
}

resource "aws_iam_instance_profile" "example_instance_profile_client" {
  path = "/"
  role = aws_iam_role.example_client_instance_role_client.name
}

resource "aws_instance" "client" {
  ami                         = data.aws_ami.ubuntu.id
  iam_instance_profile        = aws_iam_instance_profile.example_instance_profile_client.name
  instance_type               = "t3.micro"
  key_name                    = aws_key_pair.ssh.key_name
  subnet_id                   = aws_subnet.public.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.example.id]

  user_data = <<EOF
		#! /bin/bash
    sudo apt update && sudo apt install gpg
    wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
    gpg --no-default-keyring --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg --fingerprint
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    sudo apt update
    sudo apt install vault
  EOF

  tags = {
    Name = "client"
  }
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "vault_role" {
  name               = "vault-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "aws_iam_policy_document" "example_policy_vault" {
  statement {
    effect    = "Allow"
    actions = [
      "ec2:DescribeInstances",
      "iam:GetInstanceProfile",
      "iam:GetUser",
      "iam:GetRole",
    ]
    resources = [
      "*"
      // "arn:aws:iam::*:user/*",
      // "arn:aws:iam::*:role/*",
    ]
  }
  statement {
    effect    = "Allow"
    actions = [
      "sts:AssumeRole",
    ]
    resources = [
      "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/${aws_iam_role.vault_role.name}"
    ]
  }
  statement {
    effect    = "Allow"
    actions   = [
      "sts:GetCallerIdentity"
    ]
    resources = ["*"]
  }
  statement {
    sid = "ManageOwnAccessKeys"
    actions = [
      "iam:CreateAccessKey",
      "iam:DeleteAccessKey",
      "iam:GetAccessKeyLastUsed",
      "iam:GetUser",
      "iam:ListAccessKeys",
      "iam:UpdateAccessKey",
    ]
    resources = ["arn:aws:iam::*:user/$${aws:username}"]
  }
}

resource "aws_iam_policy" "policy" {
  name        = "vault-policy"
  description = "A test policy"
  policy      = data.aws_iam_policy_document.example_policy_vault.json
}

resource "aws_iam_role_policy_attachment" "vault-attach" {
  role       = aws_iam_role.vault_role.name
  policy_arn = aws_iam_policy.policy.arn
}

resource "aws_iam_instance_profile" "vault_profile" {
  name = "vault_profile"
  role = aws_iam_role.vault_role.name
}

resource "aws_instance" "vault" {
  ami                         = data.aws_ami.ubuntu.id
  iam_instance_profile        = aws_iam_instance_profile.vault_profile.name
  instance_type               = "t3.micro"
  key_name                    = aws_key_pair.ssh.key_name
  subnet_id                   = aws_subnet.public.id
  associate_public_ip_address = true
  vpc_security_group_ids      = [aws_security_group.example.id]

  user_data = <<EOF
		#! /bin/bash
    sudo apt update && sudo apt install gpg
    wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
    gpg --no-default-keyring --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg --fingerprint
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    sudo apt update
    sudo apt install vault
  EOF

  tags = {
    Name = "vault"
  }
}

output "info" {
  value = {
    client_ip       = aws_instance.client.public_ip
    vault_ip        = aws_instance.vault.public_ip
    client_role_arn = aws_iam_role.example_client_instance_role_client.arn
    ami_id          = aws_instance.client.ami
    ec2_id          = aws_instance.client.id
  }
}
```

- 서버 ssh 접속을 위한 private key는 `ssh_private` 파일로 자동 생성
  ```bash
  $ ssh -i ./ssh_private $(terraform output -raw vault_ip)
  ```



### Vault Server 실행

```bash
# Server Instance
$ vault server -dev -dev-root-token-id=root -log-level=trace
```



### Client에서 Auth 구성 및 테스트

```bash
# Client Instance
$ export VAULT_ADDR=http://10.0.0.8:8200
$ export VAULT_TOKEN=root

$ vault policy write "example-policy" -<<EOF
path "secret/data/example_*" {
  capabilities = ["create", "read"]
}
EOF

$ vault kv put secret/example_test foo=bar

$ vault auth enable aws

# auth 구성에 access key 선언이 생략
$ vault write auth/aws/config/client sts_region="ap-northeast-2"

# 만약 Vault Server의 AWS Auth에 권한이 없는 경우
$ vault write \
   auth/aws/role/example-role-name \
   auth_type=iam \
   policies=example-policy \
   max_ttl=500h \
   bound_iam_principal_arn=$client_instance_role_arn \
   inferred_entity_type="ec2_instance" \
   inferred_aws_region="ap-northeast-2"

Error writing data to auth/aws/role/example-role-name: Error making API request.

URL: PUT http://10.0.0.86:8200/v1/auth/aws/role/example-role-name
Code: 400. Errors:

* unable to resolve ARN "arn:aws:iam::467567795630:role/auth-example-iam-role20230630045547898800000001" to internal ID: unable to fetch current caller: NoCredentialProviders: no valid providers in chain. Deprecated.
	For verbose messaging see aws.Config.CredentialsChainVerboseErrors
	

# Policy 추가 후 login 수행
$ vault login -method=aws role=example-role-name

Key                      Value
---                      -----
token                    hvs.CAESIGe7HuhqFefKHDkE_M_leja0bRDEnwPZs7CeztZQXuVCGh4KHGh2cy41S2VienFmbU5scFZBcmFpWkZNemtrdmE
token_accessor           VAD61CRZHhLp7VN6Uf6qRHbh
token_duration           500h
token_renewable          true
token_policies           ["default" "example-policy"]
identity_policies        []
policies                 ["default" "example-policy"]
token_meta_account_id    467567795630
token_meta_auth_type     iam
token_meta_role_id       c1de423d-0751-a879-7b43-1047f1c43a42


$ VAULT_TOKEN=hvs.CAESIGe7HuhqFefKHDkE_M_leja0bRDEnwPZs7CeztZQXuVCGh4KHGh2cy41S2VienFmbU5scFZBcmFpWkZNemtrdmE vault kv get secret/example_test

====== Secret Path ======
secret/data/example_test

======= Metadata =======
Key                Value
---                -----
created_time       2023-06-30T06:21:09.409042961Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            1

=== Data ===
Key    Value
---    -----
foo    bar
```



