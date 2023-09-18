---
description: Terraform Features
tag: ["terraform", "IaC"]
---

# Policy as Code : Sentinel

Terraform은 인프라의 코드화 측면에서 그 기능을 충실히 실현해줍니다. 하지만 팀과 조직에서는 단지 인프라의 코드적 관리와 더불어 다른 기능들이 필요하기 마련입니다. 그중 하나로 정책을 꼽을 수 있습니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/QQ2SnWmSbjE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Infrastructure as Code를 구현하면 이전보다 빠른 프로비저닝이 가능합니다. 하지만, 여기에 팀웍과 조직 내 거버넌스를 유지하기 위해 또다른 도구나 무언가가 필요하다면? 관리를 위한 관리, 도구를 위한 도구들이 필요하게 될 것입니다. 그래서 테라폼의 클라우드 버전 부터는 팀이나 조직의 정책을 코드로 관리하여 자산화 시킬 수 있는 도구를 제공합니다.

---

| 유형                                 | 지원여부 |
| ------------------------------------ | -------- |
| Terraform OSS (Open Source Software) | •        |
| Terraform Cloud                      | ✔︎        |
| Terraform Cloud for Business         | ✔︎        |
| Terraform Enterprise                 | ✔︎        |

---



## Sentinel 구성

Sentinel 이 하시코프의 솔루션들의 정책 코드화를 위한 도구 입니다. 앞서의 IaC에 더불어 Policy 또한 코드로 정의하고 체계화 할 수 있게 도와주는 도구입니다. Sentinel 또한 VCS로 관리되고 하나 이상의 워크스페이스에 정책을 적용할 수 있게 설계 되었습니다. Sentinel의 구성은 다음과 같습니다.

```bash
└── Sentinel_Root
    ├── sentinel.hcl
    ├── [abc].sentinel
    ├── [def].sentinel
    ├── [...].sentinel
```

`sentinel.hcl`에서 해당 정책 묶음을 관리합니다. 정책은 단일 또는 다중의 조건이 있으며, 각 조건은 필수인지 아닌지에 대한 조건도 있을 것입니다. 각 정책은 `policy` 로  `.sentinel` 확장자 앞의 이름이 정의 됩니다.

정책을 선언할 때 각각의 강제 정도를 정의할 수 있습니다.

```json
policy "restrict-output-sensitive" {
    # enforcement_level = "advisory"
    # enforcement_level = "soft-mandatory"
    enforcement_level = "hard-mandatory"
}
```

- Advisory: 정책 위반시 경고
- Soft Mandatory: 규정 위반 시 사용자가 재정의(통과) 가능
- Hard Mandatory: 정책 규정 위반 불가 (에러 처리)



## Policy

정책은 Plan에 따른 `state`나  `config` 에 작성된 조건들, 또는 시간과 같은 항목에 따라 작성가능하고, 리턴되는 값이 `true` 인 경우 해당 정책 조건을 만족하는 것으로 판단합니다. 작성하는 기법에 따라 여러 조건은 하나의 파일에 작성할 수도 있고 별도로 구분하여 `sentinel.hcl` 파일에 각각 작성하는 것도 가능합니다. 아래 예제는 테라폼 구성에 정의된 모든 `output` 에 대해 `sensitive = true` 를 강제화 하기 위한 정책 입니다.

```json
import "tfconfig"

check_outputs = func() {
  for tfconfig.outputs as k, v {
    if v.sensitive == false {
      return false
    }
  }
  return true
}

main = rule { check_outputs() }
```



## 마치며

테라폼의 IaC에 추가로 팀 내의 정책을 코드화하는, Policy as Code 의 기능으로 Sentinel을 이용하면 기존에는 별도의 문서나 구두로 존재하던 조직내 정책을 자산화 할 수 있다는 점에서 프로비저닝 관련 도구를 통합할 수 있다는 것에 의미가 있습니다.

Cloud의 경우 관련 기능을 활성화하여 1달정도 무료로 사용해 볼 수 있습니다.