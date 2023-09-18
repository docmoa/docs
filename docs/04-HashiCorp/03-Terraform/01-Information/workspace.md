---
description: Terraform Features
tag: ["terraform", "IaC"]
---

# Workspace

Terraform의 워크스페이스(Workspace)는 일종의 원하는 인프라의 프로비저닝 단위로서, 하나의 state를 갖는 공간입니다. Terraform에서의 `plan` 혹은 `apply` 가 이뤄지는 단위이기도 합니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/4UeMPVw-1Dw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

워크스페이스는 유형에 따라 하나의 디렉토리이거나 VCS, 혹은 VCS의 브렌치나 측정 위치가 될 수 있습니다. OSS 유형과 Cloud, Enterprise의 가장 큰 차이점은 UI로의 관리와 공동 작업을 위한 워크스페이스별 기능일 것입니다.

---

| 유형                                 | 지원여부 |
| ------------------------------------ | -------- |
| Terraform OSS (Open Source Software) | ✔︎        |
| Terraform Cloud                      | ✔︎        |
| Terraform Cloud for Business         | ✔︎        |
| Terraform Enterprise                 | ✔︎        |

---

처음에는 워크스페이스 하나에 원하는 인프라의 모든 형태, 예를 들면 VM, 네트워크, 디스크 등의 모든 정보를 하나이 파일, 혹은 여러개의 파일로 나누어 관리합니다. 하지만 프로비저닝은 한번에 이뤄지기 때문에 하나의 작업 공간인 디렉토리 안에서 이루어 지게 됩니다.

커뮤니티 버전에서는 주로 특정 애플리케이션 인프라 구성요소를 한번에 프로비저닝 할수 있는 단위로 관리하게 되는 것이 일반적입니다. 특정 클라우드에 배포되는 특정 서비스를 위한 VM, 네트워크, 디스크 관련 내용이 모두 들있는 단일 배포 단위가 그 예입니다.

- AWS에 배포되는 고객관리 서비스를 위한 모든 인프라에 대한 프로비저닝
- VMware에 배포되는 내부 사용자용 개발 서버 요청에 대한 프로비저닝
- Kubernetes에 하나의 서비스를 위한 마이크로서비스 Pod 배포와  Ingress 구성을 프로비저닝

Terraform Cloud나 Enterprise에서는 각 조직 구성원이 각자의 책임에 맞도록 VM요소, 보안, 네트워크 등의 각 요소를 별도의 워크스페이스로 관리할 수 있습니다. 그 이유는 트리거링이나 워크스페이스의 결과값을 다른 워크스페이스에서 읽을 수 있는 기능들이 좀더 워크스페이스를 팀이나 조직단위로 운영할 수 있도록 제공합니다. 



## Workspace의 예

OSS 유형에서는 앞서의 설명처럼 Terraform이 실행되는 하나의 디렉토리 단위로 워크스페이스를 정의합니다. 기본적으로는 다음과 같은 구조를 확인 할 수 있습니다. `terraform init` 이후 한번 `apply` 한 상태의 예입니다.

```bash
└── GettingStarted
    ├── .terraform
    ├── main.tf
    ├── terraform.tfstate
    ├── terraform.tfstate.backup
    └── variables.tf
```

- GettingStarted : 워크스페이스 이름
- .terraform : 플러그인이 설치되는 위치
- main.tf : Terraform 구성 파일 (main이 아니여도 됨)
- terraform.tfstate : 실세계에 반영된 현재 상태
- terraform.tfstate.backup : 실세계에 반영되었던 직전 상태
- variables.tf : 변수를 정의하는 구성 파일을 분리하여 명명한 파일 (variables가 아니여도 됨)



Terraform은 실행시 `.tf` 확장자의 파일은 모두 읽어들이고 `Graph Theory` 에 따라 실행 순서를 결정하게 됩니다. 일반적으로 위 구조를 갖는 디렉토리가 각각의 목적에 따라 여러개를 두고 운영할 수 있고, 협업을 하는 경우 각 디렉토리를 하나의 Root를 갖는 레포지토리로 구성하거나 각각을 레포지토리로 구성하여 Git이나 SVN 같은 VCS에 저장하여 공유하게 됩니다.



## Terraform Cloud / Enterprise 에서의 Workspace

Terraform Cloud와 Terraform Enterprise에서는 워크스페이스를 웹 UI를 통해 관리하게 됩니다. Terraform의 실행 주체가 로컬 환경이 아닌 리모트 환경이기 때문에 중앙에서 프로비저닝을 위한 워크스페이스를 관리하고 VCS와 연동합니다. 각 워크스페이스 마다 RBAC 적용이나 워크스페이스 트리거링 같은 조직에서 필요한 기능들이 추가됩니다.

![TerraformWorkspaces](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/index-list-e220f8e4.png)



## 마치며

워크스페이스는 Terraform의 기본 작업 단위로, 한번에 `apply` 하게되는 범위로 볼 수 있습니다. 협업을 하게 되면 워크스페이스를 git기반, 혹은 여타 VCS로 공유하여 팀 또는 조직에서의 공통 워크스페이스 관리를 하게 됩니다. 워크스페이스의 관리를 위한 기능 요건들은 Terraform Cloud, Terraform Enterprise에서 추가로 제공되는 기능으로 실제 Terraform의 실행 위치, 변수관리, 이력관리 등을 중앙에서 할 수 있다는 점에서 워크스페이스의 활용도를 높여줍니다.

