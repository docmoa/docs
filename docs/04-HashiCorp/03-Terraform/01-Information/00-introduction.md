---
description: 테라폼 소개
tag: ["terraform", "IaC"]
---

# Terraform 개념 소개

<iframe width="560" height="315" src="https://www.youtube.com/embed/R6XxYKqB8EY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 1. Provision

프로비저닝과 관련하여 우리는 Day 0부터 Day 2까지의 여정이 있습니다.

- Day 0에 요구사항을 분석하고 아키텍쳐를 설계하고 훈련을 합니다.
- Day 1에 드디어 설계된 아키텍쳐를 구현하지요. 인프라, 네트워크, 서비스 구성 등등 말이죠.
- Day 2는 이제 Day 1에서 구성된 요소를 유지하고 관리하고 모니터링하면서 더나은 아키텍쳐로 변경하거나 추가 서비스를 붙이는 반복적 작업을 합니다.



우선은 프로비저닝할 준비가 되었다고 가정하고 Day 1에 ~~드디어~~ 인프라를 구성합니다. (VPC, Securty Group, VM, LB 등등) 그리고 이렇게 뭔가를 실행하면 실제 Day 2에서는 기존 인프라 집합에 추가로 비즈니스 요구사항에 따라 새로운 서비스를 추가하면서 그 시간이 지남에 따라 기존 인프라가 점점 변화합니다. 서비스를 제거하고 일반적으로 인프라의 모습을 발전시키는 이같은 활동은 테라폼에서 근본적으로 코드 접근 방식으로서의 인프라 즉 Infrastructure as Code 로 접근합니다.직역하면 코드가 인프라이고 인프라가 코드인 상태이죠.

일련의 선언적으로 구성파일을 정의하고 읽을수 있는 이런 구성파일로 토폴로지를 구성합니다. [테라폼 config](https://www.terraform.io/docs/configuration/index.html)라고 설명해놓겠습니다. 보안 그룹 규칙을 프로비저닝하거나 네트워크 보안을 설정한 다음 해당 환경 내에서 가상 머신 세트 정의를 프로비저닝하려는 VM이 있고 로드밸런서가 있고...

복잡성에 따라 매주 또는 매일 인프라가 점차 변화하고 발전합니다. 테라폼 구성으로 이런 환경을 캡쳐해두는 것은 매우 쉽고 바른 방식입니다.

![img](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/PrGKxouOBWKZPAyp80ByMMnBlDDBCTJwBJpQA3APXwkoKhmjFUKWp-Ncc60TGNB6XNYEYhxBH6r3HFyEtNBeamu_DxAuRAtcG_3XEqyBH1g4pB6eufVZqwRJELzz8LEoR7xM8qU-BQs-20200701002631005.png)

그럼 테라폼 설정이 어떻게 동작하는지 알아보겠습니다.

### Refresh

우선 첫번째로, 테라폼은 Refresh를 통해 테라폼으로 만들어질 세상이 어떻게 생겼는지 조정합니다. 이를 통해 테라폼 View가 나오고 실제와 어떻게 다른지 비교합니다. VMware나 AWS, Azure, GCP 같은 인프라에 실제 무엇이 실행 중인지 API로 물어보고 각 상태를 확인할 수 있습니다.

### Plan

플랜은 현재의 상태를 원하는 상태로 구성하는 단계 입니다. 실제 예상되는 무언가를 알려주고 우리는 미리 확인할 수 있습니다. 앞서 정의한 TF Config의 현재와 다른것이 무엇이있고 어떤 변화가 있는지 확인하고 앞으로의 변경점을 예측해주죠.

### Apply

Apply는 원하는 상태를 만들기 위해 실행을 하는 단계 입니다. 필요한 것이 무엇인지 어떤것이 정의되었는지를 말이지요. 예를 들면 VM을 생성하기 전에 보안그룹을 정의하는 것 같은 순차적인 것이 무엇인지 병렬로 진행하는 것이 무엇인지를 이미 알고 있습니다. [그래프 이론](https://www.youtube.com/watch?v=V_TulH374hw)에 기반한 이런 프로비저닝 방식은 사용자가 각 자원의 선후 관계를 명시하지 않아도 순차로 진행할 것과 병렬로 진행할 작업을 구분합니다.

이렇게 구성하여 우리가 원하는 인프라를 정의하고 생성하고 적용합니다.

Day 2에 들어서서 기존에 없던 로드발란서와 연결되는 DNS구성이나 CDN, 또는 내 VM을 모니터링하고 싶은 시스템에 연결하는 작업이 필요할 수 있습니다.기존에 가지고 있는 구성을 업데이트하고 다시 실행하여 처음의 리소스에 추가로 새로운 것들을 추가합니다. Day 2에 중요한 것은 계속 변화하는 환경에서 변화될 것들만 추적하고 변경할 수 있다는 것입니다. 그리고 더이상 필요하지 않을 때 원래의 상태로 돌아올 수 있습니다.

### Destory

코드로 정의된 각 인프라 리소스는 Destroy를 통해 다시 제로의 상태로 돌아옵니다. 이같은 방식은 언제나 일관된 상태와 리소스 정의를 만들어줍니다.



## 2. Providers

![tf-how-it-works_core-extensible.png](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/YwvyuWTzXp2ZSKimOCvPaYP7GEU-AjWmCn1r3lr43BGW0zX_51LxzgU8DJkukvL5Ri5McV8FYBPgxn0jYGt0XJLNGDRTz0Af7TkUOD26xBTRxW1QZyFaAMqCKF24qS7zvkTwyIJ6d4s.png)

프로바이더는 테라폼 코어와 연동되는 플러그인으로, 각 플랫폼에서 제공하거나 누구나 개발해서 테라폼과 연결할 수 있습니다. 이런 플러그인들을 프로바이더라고 부릅니다.

- AWS/Azure/GCP 같은 퍼블릭 IaaS 클라우드 환경 프로바이더
- 오픈스텍, VMware 같은 프라이빗 IaaS나 VM환경 프로바이더
- Heroku, 쿠버네티스, 람다같은 PaaS 프로바이더
- Datadog, Fastly, Github 같은 SaaS 프로바이더

프로바이더는 필요에 따라 인프라, 플랫폼, 서비스를 연계해서 사용하게도 가능합니다. 예를들어 앞서 인프라를 수행했다고 보고, Day2 에 쿠버네티스 연결이 필요하면 기존 설정을 확장해서 추가 리소스와 자원을 구성합니다. 그리고 그 위에 서비스가 DNS를 요구하거나 CDN을 요구하면 이런 서비스를 추가로 애드온 하게 됩니다. 

[테라폼 문서](https://www.terraform.io/docs/providers/index.html)에보면 이미 100여개 이상의 프로바이더가 존재하고 커뮤니티의 프로바이더 까지 합치면 테라폼으로 관리가능한 코드기반 자원들은 무궁무진합니다.



## 3. Workflow

![tf-features_consistent-workflow.png](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/M-XWeZGoGvexWM5BJwzU5WqAgsol63APP4dlm0iBh_XADq8xGJetiTCAgEbk0LXWDaU83cgGu0l2mh0rtBnsAySYA_j80j1W40Ug01iZSy2CtY7Xr6MV90OM2zQVOnlQU5p8iObm6-I.png)

테라폼을 로컬에서 사용하는 사용자의 워크 플로우는 테라폼 구성을 실행하고나서 plan이 만들어집니다. 구성에 대한 State 관리나 변수, 각각의 설정과 관련한 코드를 로컬에서 관리됩니다.

이제 다른 팀원을 추가합니다. 우리는 인프라 작업이 일관되게 변화하는 것을 기대합니다. 새로운 VM 이 생기거나 새로운 리소스를 생기지 않도록 하려면 어떻게 해야할까요? 이런 문제는 우리가 코드 관리를 위해 코드 버전 관리 서비스를 사용하는 현상과 유사합니다. Git기반의 테라폼은 코드를 중앙에서 관리하고 이를 테라폼 엔터프라이즈에서 관리하고 워크플로우의 헛점이 발생하지 않도록 도와줍니다.

테라폼 엔터프라이즈는 [VCS와 연동](https://www.terraform.io/docs/cloud/vcs/index.html)하여 개인 로컬 환경이 아닌 중앙에서 프로비저닝을 하도록 관리하는 역할을 합니다. 이제 로컬에서 실행하는 대신 제어시스템, github나 빗버킷이나 깃랩같은 VCS를 활용하여 중앙에서 상태관리를 합니다. 

기업의 운영 환경에서 요구되는 건 또 무엇이 있을까요? 아마도 [정책](https://www.terraform.io/docs/cloud/sentinel/index.html)이 필요할 것입니다. 예를 들면 태깅을 해야한다거나 특정 리전에만 프로비저닝을 해야하는 조건을 달 수 있습니다.

또한가지, 인프라를 구성하는 작업자는 혼자서 운영할 때는 필요한 변수들을 로컬에 저장하고 활용합니다. 이런 변수에는 키같은 민감한 정보토 포함될 수 있습니다. 엔터프라이즈에서는 변수를 중앙에서 관리하고 필요한 경우 암호화 해주는 기능이 필요합니다. 

![Google Shape;5711;p420](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/81GxnfKd6RWAjGcWyAT_XA5FebyDXpcVcZXwjc215cOnYBeUcVcazui7JkcTqFUkpTcgYvRCSel9HKDFYGLW7FbvxVIWdWUo2ee6ykuCLxn6eUitcIxB9BrY6VJBySb_fl8YSXZov-I.png)

이런 엔터프라이즈 기능이 워크 플로우를 관리하고 작업자가 안전하게 협업할 수 있게 도와줍니다.이렇게 반복적으로 작업이 되다 보면 일련을 동작을 모듈화하여 관리할 수 있습니다. 일종의 입출력 예제와 같이 모듈을 쉽게 정의 할 수 있습니다. 예를 들어 Java애플리케이션을 배포하고자 하는 모듈에는 배포할 Jar파일이 무엇인지, 몇개나 띄울지 물어봅니다. 이런 모듈을 기업내에서 관리하는 프라이빗 레지스트리도 기업환경에서는 요구되곤 합니다.

테라폼만으로 좋은데 엔터프라이는 왜 사용하는가에 대한 대답은 이런 협업과 정책, 관리되는 static한 변수들과 해당 조직이나 기업을 위한 모듈을 관리할 수 있도록 만들어준다는 점입니다.