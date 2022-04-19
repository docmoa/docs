---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job"]
---

# update

::: tip
nomad의 배포 방법 중 canary와 rolling update 관련된 내용입니다.
:::

```hcl
...
  #canary update - 새로운 버전의 task를 canary 변수의 수만큼 기동시키고 상황에 맞게 확인 후 배포
  group "canary" {
    count = 5

    update {
      max_parallel     = 1
      canary           = 1
      min_healthy_time = "30s"
      healthy_deadline = "10m"
      #배포 실패시 자동으로 전 버전으로 돌아감(배포 중이던 task 제거됨)
      auto_revert      = true
      #task가 기동되어도 자동으로 다음 버전으로 넘어가지 않음(배포 전 버전 task 제거되지않음)
      auto_promote     = false
    }
  }
  #rolling update - 기동 중이던 task를 하나씩(max_parallel만큼) 신규 task로 변환하면서 배포
  group "api-server" {
    count = 6

    update {
      max_parallel     = 2
      min_healthy_time = "30s"
      healthy_deadline = "10m"
    }
  }
  #배포 시 service에 canary로 배포된 task에만 붙일 수 있는 tag 설정
  service {
    port = "http"
    name = "canary-deployments"

    tags = [
      "live"
    ]

    canary_tags = [
      "canary"
    ]
}
...
```
