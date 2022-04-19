---
meta:
  - name: description
    content: Terraform Features
tags: ["terraform", "IaC"]
---

# Variables

Terraform은 코드로 인프라를 관리하기위한 그 '코드'의 핵심 요소인 변수처리를 다양하게 지원합니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/uBr0DGUqUR4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Terraform에서는 다양한 변수와 작성된 변수를 관리하기 위한 메커니즘을 제공합니다. 가장 기본이되는 기능 중 하나이며 오픈소스와 엔터프라이즈 모두에서 사용가능합니다.

---

| 유형                                 | 지원여부 |
| ------------------------------------ | -------- |
| Terraform OSS (Open Source Software) | ✔︎        |
| Terraform Cloud                      | ✔︎        |
| Terraform Cloud for Business         | ✔︎        |
| Terraform Enterprise                 | ✔︎        |

---

코드에서 변수를 사용할 수 없다면 매번 다른 값이 필요할 때마다 하드코딩된 코드 한벌씩을 만들어야 할 것입니다. 테라폼을 활용한 인프라 프로비저닝에서도 코드의 특징을 십분 활용 가능하고, 변수도 그 기능 중 하나 입니다.

테라폼 설정 파일을 작성하는 운영자와 개발자는 변수 선언을 통해 때에 따라 적절한 값을 할당하여 재 정의할 수 있습니다.



## Types

지원되는 변수의 범주와 형태는 다음과 같습니다.

- Primitive Types
  - string
  - number
  - bool
- Collection Types
  - list
  - map
  - set
- Structural Types
  - object
  - tuple



기본이 되는 형태를 하나 예를 들어보겠습니다.

```hcl
variable "name" {								// 변수 이름
    type = string								// 변수 타입
    description = "var String"	// 변수 설명
    default = "myString"				// 변수 기본 값
}
```

- 변수 이름 : `variable "이름"`으로 선언 합니다. 일반적인 코드의 `int i` 에서의 `i` 를 의미합니다. 변수 선언 시 타입과 기본 값 선언 외에도 설정 가능한 값이 많이 있어서 `variable`로 선언합니다. 변수에 대한 이름 선언은 다른 위치에서 해당 변수를 사용할 수 있도록 하는 유일한 값입니다. 같은 이름의 변수를 선언하면 오류가 발생하게 됩니다. 
- type :  해당 변수가 어떤 형태인지 선언해 줍니다. `default`에 정의되는 값의 형태를 보고 자동으로 추측해주기도 하지만 변수 값의 명확한 형태를 지정해주는 것이 권장됩니다. 또한 해당 유형에 맞지 않는 값이 입력되는 것을 방지해 줍니다.
- description :  이 변수가 무엇을 의미하는지 설명을 기입할 수 있습니다. 지속적으로 관리하고 협업을 위해 도움이 되는 항목입니다. 
- default : 변수의 기본값을 지정할 수 있습니다. 여기 지정된 값을 보고 `type`이 없더라도 추측할 수 있습니다. `default`에 설정된 값이 없고 이후 다른 코드 상에도 값이 비어 있으면 terraform이 실행 될 때 값을 물어봅니다.



각 형태에 대한 예제는 아래와 같습니다.

```hcl
variable "string" {
    type = string
    description = "var String"
    default = "myString"
}

variable "number" {
    type = number
    default = "123"
}

variable "boolean" {
    default = true
}

variable "list" {
    default = [
        "google",
        "vmware",
        "amazon",
        "microsoft"
    ]
}

output "list_index_0" {
  value = var.list.0
}

output "list_all" {
  value = [
    for name in var.list :
        upper(name)
  ]
}

variable "map" {				# Sorting
    default = {
        aws = "amazon",
        azure = "microsoft",
        gcp = "google"
    }
}

output "map" {
  value = var.map.aws
}
  
variable "set" {				# Sorting
    type = set(string)
    default = [
        "google",
        "vmware",
        "amazon",
        "microsoft"
    ]
}

output "set" {
  value = var.set
}

variable "object" {
    type = object({name=string, age=number})
    default = {
        name = "abc"
        age = 12
    }
}

variable "tuple" {
    type = tuple([string, number, bool])
    default = ["abc", 123, true]
}
```



## Validation

아직은 실험적인 Terraform의 확장 기능이지만, 변수의 유효성 체크가 가능합니다. 

```hcl
terraform {
  experiments = [variable_validation]
}
```

Terraform에서 선언되는 변수가 `variable`로 되어있던 것은 관련 변수를 확장시키는데 의미가 있습니다. 변수 밖에서 별도의 로직을 답는 것이 아니라 내부에 미리 선언하여 사용 가능합니다.

```hcl
variable "myVar" {
  type        = string
  description = "for test"
  default     = "myVar"

  validation {
    condition     = length(var.myVar) > 4
    error_message = "The myVar length up to 4."
  }
}

variable "yourVar" {
  type        = string
  description = "for test"
  default     = "yourVar"

  validation {
    condition     = can(regex("^your", var.yourVar))
    error_message = "The yourVar must be starting with \"your\"."
  }
}
```

내부에 `validation` 를 추가하고 조건과 에러시의 메시지를 정의합니다. 조건은 true/false로 확인될 수 있는 대부분의 설정이 가능하고 `string` 의 경우에는 정규표현식(regex)도 확인 가능합니다.



## Ordering

변수를 선언하는 방식에는 여러가지가 있지만 각각의 우선순위가 있기 때문에 설정에 주의해야 합니다. 아래 순서대로 마지막에 정의된 변수가 위의 설정 값을 엎어씁니다.

1. 환경변수 (e.g. TF_VAR_변수이름)
2. terraform.tfvars
3. terraform.tfvars.json
4. *.auto.tfvars / *.auto.tfvars.json
5. 명령 줄 상의 `-var` 또는 `-var-file`

예를들어 `myvar` 변수가 정의되어있고 시스템의 환경변수로 `TF_VAR_myvar`  에 값이 선언되었습니다. 이후에 `terraform.tfvars` 에서 `myvar`에 값을 선언하면 최종적으로는 `terraform.tfvars`의 값이 반영됩니다.



## 마치며

변수에 대한 자유로운 재할당을 통해 기존 인프라에 대한 리소스, 데이터, 모듈을 변경하지 않고 이미 정해진 코드적 인프라를 재활용할 수 있습니다. 코드가 복잡해지고 여러개로 나눠진다 해도 변수에 대한 타입 정의나 조건 확인 같은 기능을 활용하고 변수가 반영 되는 우선순위를 잘 고려한다면 나이스한 IaC가 구현가능합니다.