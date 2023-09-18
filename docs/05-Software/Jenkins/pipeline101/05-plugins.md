---
description: jenkins 101
tag: ["cicd", "jenkins"]
---

# 5. Plugins

Jenkins가 유용한 툴인 이유중 하나는 방대한 양의 플러그인 입니다. Jenkins의 기능을 확장시키고, 관리, 빌드 정책 등을 확장 시켜주고, 타 서비스와의 연계를 쉽게 가능하도록 합니다.

[Plugin Index](https://plugins.jenkins.io/)

![1564450122219](image/1564450122219.png)



## 5.1 Adding plugins via plugin manager

Jenkins는 온라인에 연결된 plugin을 검색, 설치할 수 있는 `플러그인 관리`기능을 갖고 있습니다. 좌측 메뉴에서 `Jenkins 관리`를 클릭하면 `플러그인 관리` 링크를 통하여 해당 기능에 접근할 수 있습니다.

- 업데이트된 플러그인 목록 : 설치된 플러그인 중 업데이트가 있는 플러그인 목록이 나타납니다.
- 설치 가능 :  아직 해당 Jenkins에 설치되어있지 않은 플러그인 목록이 나타납니다.
- 설치된 플러그인 목록 : 해당 Jenkins에 설치되어있는 플러그인이 나타납니다. 필수적이지 않은 플러그인인 경우 삭제도 해당 탭에서 가능합니다.
- 고급 : 플러그인 서버에 접속할 수 있도록 별도의 프록시를 설정하거나, `.hpi`확장자를 갖는 플러그인을 설치하거나 업데이트 사이트를 지정할 수 있습니다.

각 플러그인 이름을 클릭하면 플러그인 정보를 확인할 수 있는 `plugins.jenkins.io` 사이트로 이동하여 정보를 보여줍니다. 사용방법은 우측에 `wiki`링크를 클릭합니다. 대략적인 UI나 사용방법은 `wiki.jenkins.io`에서 제공합니다. 



## 5.2 Using shared libraries

Jenkins Pipeline의 Shared libraries에 대한 상세 내용은 다음 링크를 참고합니다. https://jenkins.io/doc/book/pipeline/shared-libraries/

이번 실습을 진행하기전에 GitHub에서 https://github.com/Great-Stone/evenOdd repository를 본인 계정의 GitHub에 Fork 하여 진행합니다.

소스의 `var` 디렉토리에는 Pipeline에서 사용하는 Shared Library들이 들어있습니다. groovy 스크립트로 되어있으며 Pipeline을 구성한 `jenkinsfile`에서 이를 사용합니다.

`vars/evenOdd.groovy`를 호출하고 값을 받아오는 형태를 갖고, evenOdd.groovy에서 사용하는 `log.info`와 `log.warning`은 `vars/log.groovy`에 구현되어있습니다.

다음과 같이 Jenkins에 설정을 수행합니다.

1. `Jenkins 관리`클릭 후 `시스템 설정`을 선택합니다.
2. `Global Pipeline Libraries` 의 추가 버튼을 클릭하여 새로운 구성을 추가합니다.
   - Name : evenOdd (어플리케이션 이름과 동일하게 하는 것을 추천합니다.)
   - Default version : master
   - Retrieval method > Modern SCM : 활성화 하면 아래 `Source Code Management` 항목이 추가됩니다.
   - SCM의 `GitHub`를 클릭하여 내용을 채웁니다.
     - Credentials : 이전 실습 내용에서 생성한 Credential을 선택합니다.
     - Owner : GitHub Owner를 입력합니다. `https://github.com/Great-Stone/evenOdd`인 경우 `Great-Stone`이 Owner가 됩니다.
     - Repository : 위정보가 맞는 경우 자동으로 목록이 나타납니다. evenOdd를 선택합니다.
   - Load implicitly : SCM 정보를 기입하고 다시 위쪽 `Library`에 있는 `Load implicitly`를 활성화 합니다.



Shared Libraries가 준비가 되면 `Pipeline` 타입의 Item을 생성하고 (e.g. 05-02.UsingSharedLibraries) Pipeline 설정을 추가합니다.

- Definition : Pipeline script from SCM
- SCM : Git
- Repositories
  - Repository URL : https://github.com/Great-Stone/evenOdd.git

저장 후 `Build Now`를 클릭하여 빌드를 수행합니다. 빌드의 결과로는 2 단계로 수행되는데 1단계는 `Declarative: Checkout SCM`으로 SCM으로부터 소스를 받아 준비하는 단계이고, 2단계는 `jenkinsfile`을 수행하는 단계입니다. `vars/evenOdd.goovy` 스크립트에는 stage가 두개 있으나 해당 Pipeline 을 호출하는 값에 따라 하나의 stage만을 수행하도록 되어있어서 하나의 stage가 수행되었습니다.

```groovy
// Jenkinsfile
//@Library('evenOdd') _

evenOdd(currentBuild.getNumber())
```

`currentBuild.getNumber()`는 현재 생성된 Pipeline Item의 빌드 숫자에 따라 값을 `evenOdd(빌드 숫자)`형태로 호출하게 됩니다.

Jenkins shared libraries를 사용하는 가장 좋은 예는 재사용성 있는 Groovy 함수를 타 작업자와 공유하는 것 입니다. 빌드의 상태는 다른 파이프 라인 단계로 계속할 것인지 결정하는 데 사용할 수도 있습니다.



::: warning
해당 설정은 모든 빌드에 영향을 주기 때문에 타 작업을 위해 추가된 **Global Pipeline Libraries**의 **Library**를 삭제하여 진행합니다.
:::