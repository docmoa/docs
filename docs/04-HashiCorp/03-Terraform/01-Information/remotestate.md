---
description: Terraform Features
tag: ["terraform", "IaC"]
---

# Remote State

Terraform을 수행하고나면 실행되고난 뒤의 상태가 저장됩니다. 로컬에서 OSS로 실행 했을 때의 `terraform.tfstate` 파일이 그것 입니다. 서로 다른 팀이 각자의 워크스페이스에서 작업하고 난뒤 각 상태 공유하면 변경된 내역에 따라 다음 작업을 이어갈 수 있습니다. Terraform은  Terraform Cloud, HashiCorp Consul, Amazon S3, Alibaba Cloud OSS 등에 상태 저장을 지원합니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/4b7IZAXzha8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Remote State, 즉 원격으로 워크스페이스의 상태 정보를 읽을 수 있다는 의미는 각 팀이 갖는 워크스페이스의 결과를 다른 팀에 노출시켜 새로 프로비저닝 된 정보를 바탕으로 다른 작업을 수행할 수 있도록 합니다. 해당 기능은 오픈소스 환경에서는 지원되지 않습니다.

---

| 유형                                 | 지원여부 |
| ------------------------------------ | -------- |
| Terraform OSS (Open Source Software) | •        |
| Terraform Cloud                      | ✔︎        |
| Terraform Cloud for Business         | ✔︎        |
| Terraform Enterprise                 | ✔︎        |

---

워크프페이스의 상태를 공유하는 워크플로우의 예를 들면 다음과 같습니다.

- 네트워크 워크스페이스 : AWS에 배포되는 VPC, 서브넷, NAT 등의 네트워크 작업 워크스페이스를 실행
- VM 배포 워크스페이스 : 네트워크 작업이 완료된 상태 값을 기반으로 EC2 인스턴스를 프로비저닝

읽어야할 상태를 생성하는 도중에 이를 참조하는 다른 워크스페이스가 실행된다면? 이 경우 참조할 대상의 State는 잠긴 상태가 되기 때문에 해당 작업이 완료될 때까지 이를 바라보는 워크스페이스는 대기하게 됩니다.

워크스페이스가 인프라별, 혹은 프로비저닝 대상으로 인해 세분화 되는 경우에도 각 상태의 변화를 다른 워크스페이스에서 원격으로 불러옴으로서 종속적인 변경사항을 적용한 포스트 프로비저닝 프로세스가 가능하도록 하는 기능입니다.



## `terraform_remote_state` datasource

공식 가이드에 따르면 Remote State는 `terraform_remote_state` 데이터소스를 통해 상태 값을 가져오게 됩니다. [Remote State 가이드 보기](https://www.terraform.io/docs/providers/terraform/d/remote_state.html)

설정에 대한 예시와 항목에 대한 설명은 다음과 같습니다.

```hcl
data "terraform_remote_state" "vpc" {
  backend = "remote"

  config = {
    organization = "hashicorp"
    workspaces = {
      name = "vpc-prod"
    }
  }
}

# Terraform >= 0.12
resource "aws_instance" "foo" {
  # ...
  subnet_id = data.terraform_remote_state.vpc.outputs.subnet_id
}

# Terraform <= 0.11
resource "aws_instance" "foo" {
  # ...
  subnet_id = "${data.terraform_remote_state.vpc.subnet_id}"
}
```

- data의 항목은 `terraform_remote_state` 로 정의합니다. 뒤에 id 값을 임의로 넣어줍니다.

  - backend : 백엔드를 리모트로 사용할지의 여부입니다. (필수)
  - config : backend로 정의할 값을 선언합니다. (옵션)
    https://www.terraform.io/docs/backends/types/remote.html
    - organization : Remote State 대상 워크스페이스가 존재하는 org.
    - workspaces : Remote State 대상 워크스프에스 정의
      - name : 워크스페이스 이름

- 값 읽어오기는 예제에서처럼 0.12버전 이상과  0.11버전 이하로 나뉘어 호출가능하며 0.11버전 이하의 경우 `output`의 데이터만 활용 가능합니다. 0.12버전 이상으로 다음의 상태값을 갖는 데이터를 예로 설명해보겠습니다.

  ```json
  {
    "backend" = "remote"
    "config" = {
      "organization" = "great-stone"
      "workspaces" = {
        "name" = "terraform-examples-sensitive"
      }
    }
    "outputs" = {
      "random_server_id" = "definite-mudfish"
      "sense" = "123456"
    }
    "workspace" = "default"
  }
  ```

  상태 데이터는 Json 형태로 출력되며 마치 javascript에서 데이터를 불러오듯 활용하면 됩니다.

  예를들어 `config`의 워크스페이스 이름을 불러오고자 한다면

  ```javascript
  data.terraform_remote_state.<id>.config.workspaces.name
  ```

  `outputs`의 `random_server_id` 값을 가져오고자 하면

  ```javascript
  data.terraform_remote_state.<id>.outputs.random_server_id
  ```

  위와 같이 데이터 구조를 확인하여 가져올 수 있습니다. 



## 마치며

Remote State는 타 워크스페이스에서 동작한 상태 값을 기반으로 관련 데이터에 종속성이 있는 작업을 수행하기에 필요한 데이터를 제공받을 수 있는 기능입니다. 워크플로우를 정의할 때 각 팀간, 혹은 각 프로비저닝을 담당하는 주체가 서로 약속한 데이터를 주고 받을 수 있도록 코드로 정의할 수 있는 IaC의 협업 기능으로 활용 가능합니다.
