---
meta:
  - name: description
    content: Terraform Features
tags: ["terraform", "usecase", "IaC", "HCL"]
---

# HCL - HashiCorp Configuration Language

Terraform의 가장 주요한 기능으로 Infrastructure as Code 를 이야기 할 수 있습니다. 그리고 이를 지원하는 HCL에 대해 알아보고자 합니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/pSPZQdpWWjs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Terraform에서는 당연히 동작해야하는 필연적 기능이기 때문에 오픈소스를 포함하여 모든 유형의 Terraform에서 제공되는 기능입니다.

---

| 유형                                 | 지원여부 |
| ------------------------------------ | -------- |
| Terraform OSS (Open Source Software) | ✔︎        |
| Terraform Cloud                      | ✔︎        |
| Terraform Cloud for Business         | ✔︎        |
| Terraform Enterprise                 | ✔︎        |

---

Infrastructure as Code에 대해 간단히 소개하자면 수작업으로 프로비저닝 하던 방식, 예를 들면 UI 클릭이나 개별적인 스크립트를 사용하여 프로비저닝하는 방식은 자동화하기 어렵고, 충분히 숙달되지 않거나 ~~밤샘작업과 스트레스로~~ 잠시 집중력이 떨어지면 실수가 발생할 수 있습니다. 그리고 스크립트 방식은 나름 잘 정의되어있지만 순차적으로 수행되고 중간에 오류가 나면 다시 돌이키기 힘든 방식이였습니다.

Terraform에서는 이전의 프로비저닝 방식을 개선하여 좀더 안정적인고 체계적인 관리 방식을 도입할 수 있는 메커니즘과 Infrastructure as Code의 핵심인 Code를 잘 만들고 관리할 수 있는 도구를 제공합니다.

기본적으로 Terraform은 HCL이라고하는 HashiCorp Configuration Language와 JSON가 코드의 영역을 담당하고 있습니다. 특히 HCL은 쉽게 읽을수 있고 빠르게 배울 수 있는 언어의 특성을 가지고 있습니다.

인프라가 코드로 표현되고, 이 코드는 곧 인프라이기 때문에 선언적 특성을 갖게 되고 튜링 완전한 언어적 특성을 갖습니다. 즉, 일반적인 프로그래밍 언어의 일반적인 조건문 처리같은 동작이 가능하다는 것입니다.

이렇게 코드화된 인프라는 주 목적인 자동화와 더불어 쉽게 버저닝하여 히스토리를 관리하고 함께 작업할 수 있는 기반을 제공하게 됩니다.



## Why HCL?

사실 이미 테라폼을 조금이라도 써보신분들은 당연하게도 HCL을 써보셨을 수도 있지만 처음 접하시는 경우 뭔가 또 배워야 하는건가? 어려운건가? 라는 마음의 허들이 생길 수 있습니다.

![Terraform_Features_Master(KR) - Google Slides 2020-07-14 22-27-59](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Terraform_Features_Master%28KR%29%20-%20Google%20Slides%202020-07-14%2022-27-59.png)

앞서 설명드렸듯 HCL은 JSON과 호환되고 이런 방식이 더 자연스러우신 분들은 JSON으로 관리가 가능합니다. 하지만 HCL에 대한 일반적인 질문은 왜 JSON이나 YAML같은 방식이 아닌지 입니다.

HCL 이전에 HashiCorp에서 사용한 도구는 Ruby같은 여타 프로그래밍 언어를 사용하여 JSON같은 구조를 만들어내기 위해 다양한 언어를 사용했습니다. 이때 알게된 점은 어떤 사용자는 인간 친화적인 언어를 원했고 어떤 사람들은 기계 친화적 언어를 원한다는 것입니다.

JSON은 이같은 요건 양쪽에 잘 맞지만 상당히 구문이 길어지고 주석이 지원되지 않는 다는 단점이 있습니다. YAML을 사용하면 처음 접하시는 분들은 실제 구조를 만들어내고 익숙해지는데 어려움이 발생하였습니다. 더군다나 일반적 프로그래밍 언어는 허용하지 않아야하는 많은 기능을 내장하고 있는 문제점도 있었습니다.

이런 여러 이유들로 JSON과 호환되는 자체 구성언어를 만들게 되었고 HCL은 사람이 쉽게 작성하고 수정할 수 있도록 설계되었습니다. 덩달아 HCL용 API가 JSON을 함께 호환하기 때문에 기계 친화적이기도 합니다.

![Terraform_Features_Master(KR) - Google Slides 2020-07-14 22-28-30](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Terraform_Features_Master%28KR%29%20-%20Google%20Slides%202020-07-14%2022-28-30.png)

HCL을 익히고 사용하는 건 어떨까요?

예를 들어 Python 코드로 비슷하게 정의를 내려보았습니다. 우리가 사용할 패키지를 Import하고 해당 패키지가 기본적으로 필요로하는 값을 넣어 초기화 합니다. 여기서는 `aws`라는 패키지에 `region`과 `profile` 이름을 넣어서 기본적으로 동작 할 수 있는 설정으로 초기화 하였습니다. 이후에 해당 패키지가 동작할 수 있는 여러 서브 펑션들에 대한 정의를 하고 마지막으로는 실행을 위한 큐에 넣습니다.

HCL도 거의 이런 일반적 프로그래밍의 논리와 비슷합니다. 우선 사용할 **프로바이더** 라고하는 마치 라이브러리나 패키지 같은 것을 정의 합니다. 이 프로바이더에는 기본적으로 선언해주어야 하는 값들이 있습니다.

그리고 이 프로바이더가 제공하는 기본적인 모듈들, 즉, 클래스나 구조체와 비슷한 형태로 정의 합니다. `resource`에 대한 정의는 마치 `aws_instance`라는 클래스를 `example`로 정의하는 것과 비슷한 메커니즘을 갖습니다. 그리고 해당 리소스의 값들을 사용자가 재정의 하는 방식입니다.



## HCL Syntax

실제 HCL의 몇가지 예는 다음과 같습니다. ([github](https://github.com/hashicorp/hcl))

```python
// 한줄 주석 방법1
# 한줄 주석 방법2

/*
다중
라인
주석
*/

locals {
  key1 =      "value1" // = 를 기준으로 키와 값이 구분되며
  key2     = "value2"  // = 양쪽의 공백은 중하지 않습니다.
  myStr = "TF ♡ UTF-8" // UTF-8 문자를 지원합니다.
  multiStr = <<FOO     // <<EOF 같은 여러줄의 스트링을 지원합니다.
  Multi
  Line
  String
  with <<ANYTEXT
  FOO                  // 앞과 끝 문자만 같으면 됩니다.
  
  boolean1 = true      // boolean true
  boolean2 = false     // boolean false를 지원합니다.

  deciaml = 123        // 기본적으로 숫자는 10진수,
  octal = 0123         // 0으로 시작하는 숫자는 8진수,
  hexadecimal = "0xD5" // 0x 값을 포함하는 스트링은 16진수,
  scientific = 1e10    // 과학표기 법도 지원합니다.

  //funtion 들이 많이 준비되어있습니다.
  myprojectname = format("%s is myproject name", var.project)
  //인라인 조건문도 지원합니다.
  credentials = var.credentials == "" ? file(var.credentials_file) : var.credentials
}
```

[Funtion Doc](https://www.terraform.io/docs/configuration/functions.html)

---

Terraform의 가장 기본적인 Infrastructure as Code에 대한 소개와 이를 구현하는 HCL에 대해 알아보았습니다.

