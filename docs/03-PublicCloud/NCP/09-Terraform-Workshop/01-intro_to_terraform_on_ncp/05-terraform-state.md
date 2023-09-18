---
description: Naver Cloud Platform에서의 Terraform 실습
tag: ["ncloud", "ncp", "terraform", "workshop"]

---

# 05. 테라폼 상태파일(State)

## Terraform State

Terraform은 ~stateful~ 애플리케이션입니다. 즉, state file 내부에서 빌드 한 모든 내용을 추적합니다.

앞서의 실습에서 반복된 `Apply` 작업 간에 Workspace 디렉토리에 나타난 `terraform.tfstate` 및 `terraform.tfstate.backup` 파일을 보셨을 것입니다.

상태 파일은 Terraform이 알고있는 모든 것에 대한 기록 소스입니다.

::: vue
WORKSPACE
├── files
│   └── deploy_app.sh
├── main.tf
├── outputs.tf
├── `terraform.tfstate`
├── `terraform.tfstate.backup`
├── terraform.tfvars
└── variables.tf
:::

State 파일 내부는 JSON 형식으로 구성되어있습니다.

```json
{
  "version": 4,
  "terraform_version": "0.12.7",
  "serial": 14,
  "lineage": "452b4191-89f6-db17-a3b1-4470dcb00607",
  "outputs": {
    "catapp_url": {
      "value": "http://go-hashicat-5c0265179ccda553.workshop.aws.hashidemos.io",
      "type": "string"
    },
```

## Terraform Refresh

때때로 인프라는 Terraform이 통제하는 범위 밖에서 변경 될 수 있습니다. (수동으로 UI에서 변경 등)

State 파일은 인프라의 마지막으로 갱신된 상태를 나타냅니다. 상태 파일이 빌드 한 파일과 여전히 일치하는지 확인하고 확인하려면 `terraform refresh` 명령을 사용할 수 있습니다.

이것은 인프라를 업데이트하지 않는 상태 파일 만 업데이트합니다.

```bash
terraform refresh
```

## 기존 인프라 변경

계획을 실행하거나 적용 할 때마다 Terraform은 세 가지 데이터 소스를 조정합니다.

1. 코드에 작성한 내용
2. 상태 파일
3. 실제로 존재하는 것

Terraform은 `*.tf` 파일에있는 내용을 기반으로 기존 리소스를 추가, 삭제, 변경 또는 교체하기 위해 ==최선== 을 다합니다. 다음은 Plan/Apply 중에 각 리소스에 발생할 수있는 네 가지 사항입니다.

```diff
+   create
-   destroy
-/+ replace
~   update in-place
```

::: warning
무엇인가 변경할때 `-/+ replace`가 발생하는지 확인하세요. 이것은 기존 리소스를 삭제하고 다시 생성합니다.
:::

## :scream: Terraform State Quiz :

각 시나리오에서 어떤 일이 발생합니까? 논의해 볼까요?

| Configuration(.tf) |    State      |   Reality     | Operation |
| :----------------: | :-----------: | :-----------: | :-------: |
|    ncloud_server   |               |               |    ???    |
|    ncloud_server   | ncloud_server |               |    ???    |
|    ncloud_server   | ncloud_server | ncloud_server |    ???    |
|                    | ncloud_server | ncloud_server |    ???    |
|                    |               | ncloud_server |    ???    |
|                    | ncloud_server |               |    ???    |

::: details 답
| Configuration(.tf) |    State      |   Reality     |  Operation   |
| :----------------: | :-----------: | :-----------: | :----------: |
|    ncloud_server   |               |               |    create    |
|    ncloud_server   | ncloud_server |               |    create    |
|    ncloud_server   | ncloud_server | ncloud_server |       -      |
|                    | ncloud_server | ncloud_server |    delete    |
|                    |               | ncloud_server |       -      |
|                    | ncloud_server |               | update state |
:::
