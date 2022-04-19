---
meta:
  - name: description
    content: jenkins 101
tags: ["cicd", "jenkins"]
---

# Pipeline on Jenkins 101 (Single Page)

> Update at 31 Jul, 2019

## Introduction

Jenkins Pipeline 을 구성하기 위해 VM 환경에서 Jenkins와 관련 Echo System을 구성합니다. 각 Product의 버전은 문서를 작성하는 시점에서의 최신 버전을 위주로 다운로드 및 설치되었습니다. 구성 기반 환경 및 버전은 필요에 따라 변경 가능합니다.

| Category | Name                     | Version |
| -------- | ------------------------ | ------- |
| VM       | VirtualBox               | 6.0.10  |
| OS       | Red Hat Enterprise Linux | 8.0.0   |
| JDK      | Red Hat OpenJDK          | 1.8.222 |
| Jenkins  | Jenkins rpm              | 2.176.2 |



**Jenkins 실행 및 구성**


Jenkins를 실행 및 구성하기위한 OS와 JDK가 준비되었다는 가정 하에 진행합니다. 필요 JDK 버전 정보는 다음과 같습니다.

- 2.164 (2019-02) and newer: Java 8 or Java 11
- 2.54 (2017-04) and newer: Java 8
- 1.612 (2015-05) and newer: Java 7



필요 JDK를 설치합니다.

```bash
$ subscription-manager repos --enable=rhel-8-for-x86_64-baseos-rpms --enable=rhel-8-for-x86_64-appstream-rpms

### Java JDK 8 ###
$ yum -y install java-1.8.0-openjdk-devel

### Check JDK version ###
$ java -version
openjdk version "1.8.0_222"
OpenJDK Runtime Environment (build 1.8.0_222-b10)
OpenJDK 64-Bit Server VM (build 25.222-b10, mixed mode)
```





Red Hatsu/Fedora/CentOS 환경에서의 Jenkins 다운로드 및 실행은 다음의 과정을 수행합니다.

> 참고 url : https://pkg.jenkins.io/redhat-stable/

- repository를 등록합니다.

  ```bash
  $ sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
  $ sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
  ```

- 작성일 기준 LTS 버전인 `2.176.2`버전을 설치합니다.

  ```bash
  $ yum -y install jenkins
  ```



패키지로 설치된 Jenkins의 설정파일은 `/etc/sysconfig/jenkins`에 있습니다. 해당 파일에서 실행시 활성화되는 포트 같은 설정을 변경할 수 있습니다.

```properties
## Type:        integer(0:65535)
## Default:     8080
## ServiceRestart: jenkins
#
# Port Jenkins is listening on.
# Set to -1 to disable
#
JENKINS_PORT="8080"
```



외부 접속을 위해 Jenkins에서 사용할 포트를 방화벽에서 열어줍니다.

```bash
$ firewall-cmd --permanent --add-port=8080/tcp
$ firewall-cmd --reload
```



서비스를 부팅시 실행하도록 활성화하고 Jenkins를 시작합니다.

```bash
$ systemctl enable jenkins 
$ systemctl start jenkins
```



실행 후 브라우저로 접속하면 Jenkins가 준비중입니다. 준비가 끝나면 `Unlock Jenkins` 페이지가 나오고 `/var/lib/jenkins/secrets/initialAdminPassword`의 값을 입력하는 과정을 설명합니다. 해당 파일에 있는 토큰 복사하여 붙여넣습니다.

이후 과정은 `Install suggested plugins`를 클릭하여 기본 플러그인을 설치하여 진행합니다. 경우에 따라 `Select plugins to install`을 선택하여 플러그인을 지정하여 설치할 수 있습니다.

플러그인 설치 과정을 선택하여 진행하면 `Getting Started` 화면으로 전환되어 플러그인 설치가 진행됩니다.

설치 후 기본 `Admin User` 를 생성하고, 접속 Url을 확인 후 설치과정을 종료합니다.



**GitHub 계정생성**

진행되는 실습에서는 일부 GitHub를 SCM으로 연동합니다. 원활한 진행을 위해 GitHub계정을 생성해주세요. 또는 별개의 Git 서버를 구축하여 사용할 수도 있습니다.



**Jenkins Theme** (Optional)

Jenkins는 간단히 테마와 회사 CI를 적용할 수 있는 플러그인이 제공됩니다.

- `Jenkins 관리`로 이동하여 `플러그인 관리`를 클릭합니다.

- `설치 가능` 탭을 클릭하고 상단의 검색에 `theme`를 입력하면 `Login Theme`와 `Simple Theme`를 확인 할 수 있습니다. 둘 모두 설치합니다.

- 로그아웃을 하면 로그인 페이지가 변경된 것을 확인 할 수 있습니다.

  

기본 Jenkins 테마를 변경하기 위해서는 다음의 과정을 수행합니다.

- http://afonsof.com/jenkins-material-theme/ 에 접속합니다.
- `Build your own theme with a company logo!` 에서 색상과 로고를 업로드 합니다.
- `DOWNLOAD YOUR THEME!`버튼을 클릭하면 CSS파일이 다운됩니다.

- `Jenkins 관리`로 이동하여 `시스템 설정`를 클릭합니다.
- `Theme`항목의 `Theme elements`의 드롭다운 항목에서 `Extra CSS`를 클릭하고 앞서 다운받은 CSS파일의 내용을 붙여넣고 설정을 저장하면 적용된 테마를 확인할 수 있습니다.



## 1. CI/CD

**CI/CD Concept Definitions**

- Continuous integration
- Continuous delivery
- Continuous deployment
- Source control management (SCM)



```mermaid
sequenceDiagram
	participant Develop
	participant Test
	participant Stage
	participant Production
    Develop->>Test: Continuous integration
    Develop->>Stage: Continutous delivery
    Develop->>Production: Continutous deployment
```



**Delivery vs Deployment**

- Continuous Delivery requires user intervention
  - When? : Stage to Production



**Jenkins for CI/CD**

- Open-source governance and community
- Stability
- Extensible
- Visibility
- Pipelines





## 2. Jobs

**Job and Project**

프로젝트는 Job의 일부 입니다. 즉, 모든 프로젝트가 Job이지만 모든 Job이 프로젝트는 아닙니다. Job의 구조는 다음과 같습니다.

```mermaid
graph LR
    A(Job) -->B(AbstractProject)
    B --> F(MatrixProject)
    B --> G(Project)
    G --> H(FreeStyleProject)
    G --> I(MatrixConfigurationProject)
    A --> C(StubJob)
    A --> D(ViewJob)
    D --> E(ExternalJob)
```

FreeStyleProejct, MatrixProject, ExternalJob만 `New job`에 표시됩니다.



**Step 1. New pipeline**

Step 1에서는 `stage`없이 기본 Pipeline을 실행하여 수행 테스트를 합니다.

1. Jenkins 로그인

2. 좌측 `새로운 Item` 클릭

3. `Enter an item name`에 Job 이름 설정 (e.g. 2.Jobs)

4. `Pipeline` 선택 후 `OK` 버튼 클릭

5. `Pipeline` 항목 오른 쪽 `Try sample Pipelie...`클릭하여 `Hello world` 클릭 후 저장

   ```groovy
   node {
      echo 'Hello World'
   }
   ```

6. 좌측 `Build now`클릭

7. 좌측 `Build History`의 최근 빌드된 항목(e.g. #1) 우측에 마우스를 가져가면 dropdown 버튼이 생깁니다. 해당 버튼을 클릭하여 `Console Output` 클릭

8. 수행된 `echo` 동작 출력을 확인합니다.

   ```
   Started by user GyuSeok.Lee
   Running in Durability level: MAX_SURVIVABILITY
   [Pipeline] Start of Pipeline
   [Pipeline] node
   Running on Jenkins in /var/lib/jenkins/workspace/2.Jobs
   [Pipeline] {
   [Pipeline] echo
   Hello World
   [Pipeline] }
   [Pipeline] // node
   [Pipeline] End of Pipeline
   Finished: SUCCESS
   ```

   

**Step 2. New pipeline**

Step 2에서는 `stage` 를 구성하여 실행합니다.

1. 기존 생성한 Job 클릭 (e.g. 02-02.Jobs)

2. 좌측 `구성`을 클릭하여 `Pipeline` 스크립트를수정합니다.

   ```groovy
   pipeline{
       agent any
       stages {
           stage("Hello") {
               steps {
                   echo 'Hello World'
               }
           }
       }
   }
   ```

3. 수정 후 좌측 `Build Now`를 클릭하여 빌드 수행 후 결과를 확인합니다.

4. `Step 1`에서의 결과와는 달리 `Stage View`항목과 Pipeline stage가 수행된 결과를 확인할 수 있는 UI가 생성됩니다.

   ![1563942302074](image/1563942302074.png)

5. 수행된 빌드의 `Console Output`을 확인하면 앞서 `Step 1`에서는 없던 stage 항목이 추가되어 수행됨을 확인 할 수 있습니다.

   ```
   Started by user GyuSeok.Lee
   Running in Durability level: MAX_SURVIVABILITY
   [Pipeline] Start of Pipeline
   [Pipeline] node
   Running on Jenkins in /var/lib/jenkins/workspace/2.Jobs
   [Pipeline] {
   [Pipeline] stage
   [Pipeline] { (Hello)
   [Pipeline] echo
   Hello World
   [Pipeline] }
   [Pipeline] // stage
   [Pipeline] }
   [Pipeline] // node
   [Pipeline] End of Pipeline
   Finished: SUCCESS
   ```



**Step 3. Parameterizing a job**

Pipeline 내에서 사용되는 매개변수 정의를 확인해 봅니다. Pipeline 스크립트는 다음과 같습니다.

```groovy
pipeline {
    agent any
    parameters {
        string(name: 'Greeting', defaultValue: 'Hello', description: 'How should I greet the world?')
    }
    stages {
        stage('Example') {
            steps {
                echo "${params.Greeting} World!"
            }
        }
    }
}
```

`parameters`항목내에 매개변수의 데이터 유형(e.g. string)을 정의합니다. `name`은 값을 담고있는 변수이고 `defaultValue`의 값을 반환합니다. Pipeline에 정의된 `parameters`는 `params`내에 정의 되므로 `${params.매개변수이름}`과 같은 형태로 호출 됩니다.

저장 후 다시 `구성`을 확인하면 `이 빌드는 매개변수가 있습니다`가 활성화 되고 내부에 추가된 매개변수 항목을 확인 할 수 있습니다.

![1563944944350](image/1563944944350.png)

이렇게 저장된 Pipeline Job은 매개변수를 외부로부터 받을 수 있습니다. 따라서 좌측의 기존 `Build Now`는 `build with Parameters`로 변경되었고, 이를 클릭하면 Greeting을 정의할 수 있는 UI가 나타납니다. 해당 매개변수를 재정의 하여 빌드를 수행할 수 있습니다.

![1563944733249](image/1563944733249.png)

![1563944765637](image/1563944765637.png)



**Step 4. Creating multiple steps for a job**

다중스텝을 위한 Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 02-04.MultiStep)

Pipeline에 다음과 같이 스크립트를 추가합니다.

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'echo "Hello World"'
                sh '''
                    echo "Multiline shell steps works too"
                    ls -lah
                '''
            }
        }
    }
}
```

`'''`은 스크립트 정의 시 여러줄을 입력할 수 있도록 묶어주는 역할을 합니다.  해당 스크립트에서는 `sh`로 구분된 스크립트 명령줄이 두번 수행됩니다.

![1563945323777](image/1563945323777.png)

실행되는 여러 스크립트의 수행을 `stage`로 구분하기위해 기존 Pipeline 스크립트를 다음과 같이 수정합니다.

```groovy
pipeline {
    agent any
    stages {
        stage('Build-1') {
            steps {
                sh 'echo "Hello World"'
            }
        }
        stage('Build-2') {
            steps {
                sh '''
                    echo "Multiline shell steps works too"
                    ls -lah
                '''
            }
        }
    }
}
```

stage를 구분하였기 때문에 각 실행되는 `sh` 스크립트는 각 스테이지에서 한번씩 수행되며, 이는 빌드의 결과로 나타납니다.

![1563945539114](image/1563945539114.png)



**Step 5. Adding scripts as a job step**

Pipeline의 step을 추가하여 결과를 확인하는 과정을 설명합니다. 피보나치 수열을 수행하는 쉘 스크립트를 시간제한을 두어 수행하고 그 결과를 확인합니다.

Jenkins가 설치된 서버에 [피보나치 수열]([https://namu.wiki/w/%ED%94%BC%EB%B3%B4%EB%82%98%EC%B9%98%20%EC%88%98%EC%97%B4](https://namu.wiki/w/피보나치 수열))을 수행하는 스크립트를 작성합니다. Sleep이 있기 때문에 일정 시간 이상 소요 됩니다.

```bash
$ mkdir -p /var/jenkins_home/scripts
$ cd /var/jenkins_home/scripts
$ vi ./fibonacci.sh
#!/bin/bash
N=${1:-10}

a=0
b=1

echo "The Fibonacci series is : "

for (( i=0; i<N; i++ ))
do
    echo "$a"
    sleep 2
    fn=$((a + b))
    a=$b
    b=$fn
done
# End of for loop

$ chown -R jenkins /var/jenkins_home/
$ chmod +x /var/jenkins_home/scripts/fibonacci.sh
```



다중스텝을 위한 Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 02-05.AddingStep)

Pipeline에 다음과 같이 스크립트를 추가합니다.

```groovy
pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    sh '/var/jenkins_home/scripts/fibonacci.sh 5'
                }
                timeout(time: 1, unit: 'MINUTES') {
                    sh '/var/jenkins_home/scripts/fibonacci.sh 32'
                }
            }
        }
    }
}
```

`steps`에 스크립트를 `timeout`이 감싸고 있으며, 각 스크립트의 제한시간은 1분입니다. 빌드를 수행하면 최종적으로는 `aborted`, 즉 중단됨 상태가 되는데 그 이유는 빌드 기록에서 해당 빌드를 클릭하면 확인 가능합니다.

- `Build History`에서 최신 빌드를 클릭합니다.

- 좌측 `Pipeline Steps`를 클릭하면 Pipeline 수행 스텝을 확인할 수 있습니다.

- 첫번째로 나타나는 `/var/jenkins_home/scripts/fibonacci.sh 5` 를 수행하는 `Shell Script`의 콘솔창 버튼을 클릭하면 잘 수행되었음을 확인 할 수 있습니다.

- 두번째로 나타나는 `/var/jenkins_home/scripts/fibonacci.sh 32` 를 수행하는 `Shell Script`의 콘솔창 버튼을 클릭하면 다음과 같이 중도에 프로세스를 중지한 것을 확인 할 수 있습니다.

  ```
  + /var/jenkins_home/scripts/fibonacci.sh 32
  The Fibonacci series is : 
  0
  1
  1
  2
  3
  ...
  317811
  514229
  Sending interrupt signal to process
  /var/jenkins_home/scripts/fibonacci.sh: line 16: 13543 Terminated              sleep 2
  832040
  /var/lib/jenkins/workspace/02-05.AddingStep@tmp/durable-e44bb232/script.sh: line 1: 13109 Terminated              /var/jenkins_home/scripts/fibonacci.sh 32
  script returned exit code 143
  ```

  

## 3. Builds

**Step 1. Tracking build state**

Pipeline이 수행되는 동작을 추적하는 과정을 확인합니다. 이를 이를 위한 Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 03-01.TrackingBuildState)

Pipeline에 다음과 같이 스크립트를 추가합니다.

```groovy
pipeline {
    agent any
    stages {
        stage('Deploy') {
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    sh 'for n in `seq 1 10`; do echo $n; sleep 1; done'
                }
                timeout(time: 1, unit: 'MINUTES') {
                    sh 'for n in `seq 1 50`; do echo $n; sleep 1; done'
                }
            }
        }
    }
}
```

`Build Now`를 클릭하여 빌드를 수행합니다. 그러면, 좌측의 `Build History`에 새로운 기록이 생성되면서 동작 중인것을 확인 할 수 있습니다.

첫번째 방법은 앞서 확인한 `Pipeline Steps`를 확인하는 것입니다. 다시한번 확인하는 방법을 설명합니다.

- `Build History`에서 최신 빌드를 클릭합니다.
- 좌측 `Pipeline Steps`를 클릭하면 Pipeline 수행 스텝을 확인할 수 있습니다.

현재 수행중인 Pipeline이 어떤 단계가 수행중인지 각 스탭별로 확인할 수 있고 상태를 확인할 수 있습니다.

![1563948810815](image/1563948810815.png)



두번째 방법은 출력되는 콘솔 로그를 확인하는 것입니다. Jenkins에서 빌드를 수행하면 빌드 수행 스크립트가 내부에 임시적으로 생성되어 작업을 실행합니다. 이때 발생되는 로그는 `Console Output`을 통해 거의 실시간으로 동작을 확인 할 수 있습니다.

- `Build History`에서 최신 빌드에 마우스 포인터를 가져가면 우측에 드롭박스가 생깁니다. 또는 해당 히스토리를 클릭합니다.
- 드롭 박스의  `Console Output`나 클릭된 빌드 히스토리 상태에서 `Console Output`를 클릭하면 수행중인 콘솔상의 출력을 확인합니다.

![1563948863834](image/1563948863834.png)



마지막으로는 Pipeline을 위한 UI인 `BlueOcean` 플러그인을 활용하는 방법입니다. Blue Ocean은 Pipeline에 알맞은 UI를 제공하며 수행 단계와 각 단게별 결과를 쉽게 확인할 수 있습니다.

-  `Jenkins 관리`에서 `플러그인 관리`를 선택합니다.
- `설치 가능` 탭에서 `Blue Ocean`을 선택하여 `재시작 없이 설치`를 클릭 합니다.
- `Blue Ocean`플러그인만 선택하여 설치하더라도 관련 플러그인들이 함께 설치 진행됩니다.
- 설치 완료되면 좌측 메뉴에서 `Blue Ocean`항목을 확인 할 수 있습니다.

![1563949823939](image/1563949823939.png)



**Step 2. Polling SCM for build triggering**

Git SCM을 기반으로 Pipeline을 설정하는 과정을 설명합니다. 이를 이를 위한 Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 03-02.PollingSCMforBuildTriggering)

해당 과정을 수행하기 위해서는 다음의 구성이 필요합니다.

- Jenkins가 구성된 호스트에 git 설치

  ```bash
  $ yum -y install git
  ```

- Jenkins 설정

  - `Jenkins 관리`의 `Global Tool Configuration`클릭
  - Git 항목에 `Path to Git executable` 칸에 Path 입력 (e.g. /usr/bin/git)



Pipeline을 다음과 같이 설정합니다.

- Definition : Pipeline script from SCM
- SCM : Git
- Repositories
  - Repository URL : https://github.com/Great-Stone/jenkins-git



추가로 빌드 트리거를 위한 설정을 합니다.

- `Build Triggers`의 `Poll SCM` 활성화

- Schedule 등록

  ```bash
  # min hour day month day_of_week
  * * * * *
  # will run every minute on the minute
  ```



Polling으로 인한 빌드 트리거가 동작하면 좌측 메뉴의 `Polling Log`에서 상태 확인이 가능합니다.

![1563958295010](image/1563958295010.png)

 1분마다 확인 하도록 되어있기 때문에 다시 Polling을 시도하지만 변경사항이 없는 경우에는 Polling Log에 `No changes` 메시지가 나타나고 빌드는 수행되지 않습니다.

![1563958396611](image/1563958396611.png)



**Step 3. Connecting Jenkins to GitHub**

GitHub를 통한 CI 과정을 설명합니다. WebHook의 설정과 Jenkins에 관련 설정은 어떻게 하는지 알아봅니다.

Jenkins에서 접속가능하도록 GitHub에서 Token을 생성합니다.

- [github.com](http://github.com)에 접속하여 로그인합니다.

- 우측 상단의 드롭박스에서 `Settings`선택 후 좌측 메뉴 맨 아래의 `Developer settings`를 선택합니다.

- `Developer settings`화면에서 좌측 메뉴 하단 `Personal access tockes`를 클릭하고, 화면이 해당 페이지로 변경되면 `Generate new token`버튼을 클릭합니다.

- Token description에 Token설명을 입력하고 입니다. (e.g. jenkins-integration) 생성합니다. 생성시 `repo`, `admin:repo_hook`, `notifications`항목은 활성화 합니다.

- `Generate token`버튼을 클릭하여 Token 생성이 완료되면 발급된 Token을 확인 할 수 있습니다. 해당 값은 Jenkins에서 Git연동설정 시 필요합니다.

  ![1564115701058](image/1564115701058.png)

  

우선 Jenkins에 Git연동을 위한 설정을 추가합니다.

- `Jenkins 관리`에서 `시스템 설정`을 클릭합니다.
- `GitHub` 항목의 `GitHub Servers`의 `Add GitHub Server > GitHub Server`를 선택합니다.
- 항목의 입력정보는 다음과 같습니다.
  - Name : 설정이름을 입력합니다. (e.g. github)
  - API URL : https://api.github.com
  - Credentials : `ADD`트롭박스를 선택합니다.
    - 기본 Credendial을 선택합니다. (e.g. Jenkins)
    - Kind 항목을 `Secret text`로 선택합니다.
      - Scope : Global(Jenkins, nodes, Items, all child items, etc)
      - Secret : GitHub에서 복사한 Token 값을 입력합니다.
      - ID : Credential ID를 입력합니다. (e.g. jenkins-integration)
      - `ADD` 버튼 클릭하여 새로운 Credendial을 추가합니다.
    - 다시 `시스템 설정`화면으로 나오면 Credentials의 `-none-`드롭박스에 추가한 Credential을 선택합니다.
  - `TEST CONNECTION`버튼을 클릭하여 정상적으로 연결이 되는지 확인합니다.
    - 정상적으로 연결되면 `Credentials verified for user Great-Stone, rate limit: 4998` 와같은 메시지가 출력됩니다.
  - Manage hook 를 활성화 합니다.
- 시스템 설정을 저장합니다.



**Step 4. Webhook build triggering**

git repo의 Webhook 을 통한 빌드를 수행합니다. GitHub에 다음과 같이 설정합니다.

- https://github.com/Great-Stone/jenkins-git 를 `fork`합니다.

  ![1564122799631](image/1564122799631.png)

- 우측 상단의 드롭박스에서 `Settings`선택 후 좌측 메뉴 맨 아래의 `Developer settings`를 선택합니다.

- `Developer settings`화면에서 좌측 메뉴 하단 `Personal access tockes`를 클릭하고, 화면이 해당 페이지로 변경되면 `Generate new token`버튼을 클릭합니다.

- Token description에 Token설명을 입력하고 입니다. (e.g. jenkins-webhook) 생성합니다. 생성시 `repo`, `admin:repo_hook`, `notifications`항목은 활성화 합니다.

- `Generate token`버튼을 클릭하여 Token 생성이 완료되면 발급된 Token을 확인 할 수 있습니다. 해당 값은 Jenkins에서 Git연동설정 시 필요합니다.



Webhook을 위한 `Pipeline` 타입의 Item을 추가로 생성합니다. (e.g. 03-04.WebhookBuild Triggering)

설정은 다음과 같이 수행합니다.

1. `Pipeline` 설정의 `Definition`의 드롭다운을 선택하여 `Pipeline script from SCM`을 선택합니다.

2. `SCM`항목은 `Git`을 선택하고 하위 필드를 다음과 같이 정의합니다.

   - Repositories :

     - `Repository URL`을 입력하는데, GitHub에서 git url을 얻기위해서는 웹브라우저에서 해당 repository로 이동하여 `Clone or download` 버튼을 클릭하여 Url을 복사하여 붙여넣습니다.

       ![1564365395583](image/1564365395583.png)

     - Credentials : `ADD`트롭박스를 선택합니다.

       - 기본 Credendial을 선택합니다. (e.g. Jenkins)
       - Kind 항목을 `Username with password`로 선택합니다.
         - Scope : Global(Jenkins, nodes, Items, all child items, etc)
         - Username : GitHub의 사용자 아이디를 입력합니다.
         - Secret : GitHub사용자 패스워드를 입력합니다.
         - ID : Credential ID를 입력합니다. (e.g. jenkins-webhook)
         - `ADD` 버튼 클릭하여 새로운 Credendial을 추가합니다.
       - 다시 `시스템 설정`화면으로 나오면 Credentials의 `-none-`드롭박스에 추가한 Credential을 선택합니다.

   - Script Path : Pipeline 스크립트가 작성된 파일 패스를 지정합니다. 예제 소스에서는 root 위치에 `Jenkinsfile`로 생성되어있으므로 해당 칸에는 `Jenkinsfile`이라고 입력 합니다.

저장 후 좌측 메뉴의 `Build Now`를 클릭하면 SCM에서 소스를 받고 Pipeline을 지정한 스크립트로 수행하는 것을 확인 할 수 있습니다.



## 4. Agents and Distributing Builds

빌드를 수행하기 위한 Worker로 다중 Jenkins를 컨트롤 할 수 있습니다. 이때 명령을 수행하는 Jenkins는 `Master`, 빌드를 수행하는 Jenkins는 `Worker`로 구분합니다. 여기서는 Worker의 연결을 원격 호스트의 Jenkins를 SSH를 통해 연결하는 방식과 컨테이너로 구성된 Jenkins를 연결하는 과정을 확인 합니다.

Master-Slave 방식, 또는 Master-Agent 방식으로 표현합니다.

**※ Slave 호스트에 Jenkins를 설치할 필요는 없습니다.**



**Step 1. Adding an SSH build agent to Jenkins**

Worker가 실행되는 Slave 호스트에 SSH key를 생성하고 Worker 호스트에 인증 키를 복사하는 과정은 다음과 같습니다.

1. 키 생성 및 복사(jenkins 를 수행할 유저를 생성해야 합니다.)

   ```bash
   # User가 없는 경우 새로운 Jenkins slave 유저 추가
   $ useradd jenkins
   $ passwd jenkins
   Changing password for user jenkins.
   New password:
   Retype new password:
   
   # Slave 호스트에서 ssh 키를 생성합니다.
   $ ssh-keygen -t rsa
   Generating public/private rsa key pair.
   Enter file in which to save the key (/root/.ssh/id_rsa): <enter>
   Created directory '/root/.ssh'.
   Enter passphrase (empty for no passphrase): <enter>
   Enter same passphrase again: <enter>
   Your identification has been saved in /root/.ssh/id_rsa.
   Your public key has been saved in /root/.ssh/id_rsa.pub.
   The key fingerprint is: <enter>
   SHA256:WFU7MRVViaU1mSmCA5K+5yHfx7X+aV3U6/QtMSUoxug root@jenkinsecho.gyulee.com
   The key's randomart image is:
   +---[RSA 2048]----+
   |     .... o.+.=*O|
   |     ..  + . *o=.|
   |    .   .o. +o. .|
   |     . o. + ... +|
   |      o.S. .   +.|
   |     o oE    .oo.|
   |      = o . . +o=|
   |       o . o ..o=|
   |          . ..o+ |
   +----[SHA256]-----+
   
   $ cd ~/.ssh
   $ cat ./id_rsa.pub > ./authorized_keys
   ```

2. `Jenkins 관리`의 `노드 관리`를 선택합니다.

3. 좌측 메뉴에서 `신규 노드`를 클릭합니다.

4. 노드명에 고유한 이름을 입력하고 `Permanent Agent` 를 활성화 합니다.

5. 새로운 노드에 대한 정보를 기입합니다.

   - Name : 앞서 입력한 노드 이름 입니다.
- \# of executors : Jenkins에서 빌드시 사용할 실행 스레드 개수 입니다. 가용 Core수에 비례하여 설정합니다.
   - Remote root directory : 빌드시 사용할 디렉토리를 지정합니다. Lunux/Unix 계열에서는 해당 디렉토리의 권한을 확인해줍니다.
- Labels : Worker노드를 논리적으로 그룹화하는데 사용되는 값입니다. 예를들어 GPU나 HighCPU 모델같은 용도로 구분할 수 있습니다. (e.g. Metal)
   - Usage : `Use this node as much as possible`
   - Launch method : `Launch agent agents via SSH` 로 설정합니다.
     - Host : Worker 호스트에 접근 가능한 IP 혹은 Hostname을 입력합니다.
     - Credentials : 앞서 설정한 SSH 키를 등록합니다.
       - 우측에 `ADD > Jenkins`를 클릭합니다.
       - Kind : `SSH Username with private key`를 선택합니다.
       - ID : 고유한 키 값을 넣어줍니다. (e.g. jenkins-ssh)
       - Username : jenkins (Slave 호스트의 사용자 이름입니다.)
       - Private Key : Enter directly 를 사용하여 앞서 생성한 `~/.ssh/id_rsa` 의 내용을 붙여넣어줍니다. (일반적으로 `-----BEGIN RSA PRIVATE KEY-----`로 시작하는 내용입니다.)
     - Host Key Verification Strategy : `Non verifying verification strategy` 를 선택합니다.
   - 저장 버튼을 클릭하면 Node 설정 화면과 왼쪽 `빌드 실행 상태`에 새로운 Slave Node가 추가됨을 확인 할 수 있습니다.



Label 지정한 Slave Worker에서 빌드가 수행되도록 기존 02-02.Jobs의 Pipeline 스크립트를 수정합니다. 기존 `agent any`를 다음과 같이 `agent { label 'Metal' }`로 변경합니다. 해당 pipeline은 label이 `Metal`로 지정된 Worker에서만 빌드를 수행합니다.

```groovy
pipeline {
    agent { label 'Metal' }
    parameters {
        string(name: 'Greeting', defaultValue: 'Hello', description: 'How should I greet the world?')
    }
    stages {
        stage('Example') {
            steps {
                echo "${params.Greeting} World!"
            }
        }
    }
}
```

![1564378013035](image/1564378013035.png)



**Step 2. Using Docker images for agents**

Master Jenkins 호스트에서 docker 서비스에 설정을 추가합니다. docker 설치가 되어있지 않은 경우 설치가 필요합니다.

```bash
$ yum -y install docker
```

>  RHEL8 환경이 Master인 경우 위와 같은 방식으로 설치를 진행하면 변경된 패키지에 따라 `podman-docker`가 설치 됩니다. 아직 Jenkins에서는 2019년 7월 29일 기준 `podman`을 지원하지 않음으로 별도 yum repository를 추가하여 진행합니다. `docker-ce` 최신 버전에서는 `containerd.io` 의 필요 버전이 `1.2.2-3` 이상이나 RHEL8에서 지원하지 않음으로 별도로 버전을 지정하여 설치합니다.
>
> ```bash
> $ yum -y install yum-utils
> $ yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
> $ sudo yum repolist -v
> ...
> Repo-id      : docker-ce-stable
> Repo-name    : Docker CE Stable - x86_64
> Repo-revision: 1564098258
> Repo-updated : Fri 26 Jul 2019 08:44:18 AM KST
> Repo-pkgs    : 47
> Repo-size    : 982 M
> Repo-baseurl : https://download.docker.com/linux/centos/7/x86_64/stable
> Repo-expire  : 172,800 second(s) (last: Thu 25 Jul 2019 07:33:33 AM KST)
> Repo-filename: /etc/yum.repos.d/docker-ce.repo
> ...
> 
> $ yum -y install docker-ce-3:18.09.1-3.el7
> $ systemctl enable docker
> $ systemctl start docker
> ```



- docker를 설치 한 뒤 API를 위한 TCP 포트를 활성화하는 작업을 진행합니다.`/lib/systemd/system/docker.service`에 `ExecStart` 옵션 뒤에 다음과 같이 `-H tcp://0.0.0.0:4243`을 추가합니다. 

  ```properties
  ...
  [Service]
  Type=notify
  # the default is not to use systemd for cgroups because the delegate issues still
  # exists and systemd currently does not support the cgroup feature set required
  # for containers run by docker
  ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:4243
  ExecReload=/bin/kill -s HUP $MAINPID
  TimeoutSec=0
  RestartSec=2
  Restart=always
  ...
  ```

- 수정 후 서비스를 재시작합니다.

  ```bash
  $ systemctl daemon-reload
  $ systemctl restart docker
  $ docker ps
  CONTAINER ID    IMAGE    COMMAND    CREATED    STATUS    PORTS    NAMES
  
  $ usermod -aG docker jenkins
  $ chmod 777 /var/run/docker.sock
  ```

  

Jenkins에 새로운 플러그인을 추가하고 설정합니다.

- `Jenkins 관리`로 이동하여 `플러그인 관리`를 클릭합니다.

- `설치 가능` 탭을 클릭하고 상단의 검색에 `docker`를 입력하면 `docker`플러그인이 나타납니다. 선택하여 설치를 진행하고 Jenkins를 재시작 합니다.

- `Jenkins 관리`로 이동하여 `시스템 설정`을 클릭합니다.

- `Cloud`항목 아래 `ADD A NEW CLOUD` 드롭박스에 있는 `Docker`를 선택합니다.

  - Name은 기본 값으로 진행하고 `DOCKER CLOUD DETAILS...` 버튼을 클릭합니다.

  - Docker Host URI : 앞서 설정한 port로 연결합니다. (e.g. tcp://master:4243)

  - `TEST CONNECTION` 버튼을 눌러 정상적으로 Version 정보와 API Version이 표기되는지 확인합니다.

    ```
    Version = 18.09.1, API Version = 1.39
    ```

  - Enabled를 활성화 합니다.



Docker 실행을 위한 Item을 생성합니다. (e.g. 04-02.UsingDockerImagesForAgents)

1.  `Pipeline` 스크립트를 구성합니다.

   ```groovy
   pipeline {
       agent {
           docker { image 'node:latest' }
       }
       stages {
           stage('Test'){
               steps {
                   sh 'node --version'
               }
           }
       }
   }
   ```

2. 수정 후 좌측 `Build Now`를 클릭하여 빌드 수행 후 결과를 확인합니다.

3. `Step 1`에서의 결과와는 달리 `Stage View`항목과 Pipeline stage가 수행된 결과를 확인할 수 있는 UI가 생성됩니다.

   ![1564388703234](image/1564388703234.png)



**Step3. Configuring specific agents**

`Freestyle project` 형태의 Item을 생성합니다. (e.g. 04-03.ConfiguringSpecificAgents)

>  Jenkins는 각 단계, 빌드, 그리고 빌드 후 작업일 지정할 수 있습니다. `Freestyle project`에서는 이같은 전체 빌드 단계를 구성하고 여러가지 플러그인을 사용할 수 있는 환경을 제공합니다.

![1564444282455](image/1564444282455.png)



- General

  - Restrict where this project can be run : 빌드 수행을 특정 Label 노드에 제한하도록 설정할 수 있습니다.

    - Label Expression : 앞서의 과정에서 생성한 노드 `Metal`을 지정해봅니다. 해당 조건의 노드가 존재하는 경우 노드 개수 정보가 표기됩니다.

      ```
      Label Metal is serviced by 1 node.
      ```

- Build

  - `ADD BUILD STEP` 드롭박스에서 `Excute shell `항목을 선택하여 추가 합니다.
    - Command 칸에 `echo "Hello world."`를 넣어봅니다.
  - `ADD BUILD STEP` 드롭박스에서 `Excute shell `항목을 선택하여 추가 합니다.
    - Command 칸에 `ls -al"`를 넣어봅니다.

- 저장하고 좌측의 `Build Now`를 클릭하여 빌드를 수행합니다.

- 콘솔 출력을 확인하면 지정한 Label 노드에서 각 빌드 절차가 수행된 것을 확인할 수 있습니다.

  ![1564449679656](image/1564449679656.png)



## 5. Plugins

Jenkins가 유용한 툴인 이유중 하나는 방대한 양의 플러그인 입니다. Jenkins의 기능을 확장시키고, 관리, 빌드 정책 등을 확장 시켜주고, 타 서비스와의 연계를 쉽게 가능하도록 합니다.

[Plugin Index](https://plugins.jenkins.io/)

![1564450122219](image/1564450122219.png)



**Step 1. Adding plugins via plugin manager**

Jenkins는 온라인에 연결된 plugin을 검색, 설치할 수 있는 `플러그인 관리`기능을 갖고 있습니다. 좌측 메뉴에서 `Jenkins 관리`를 클릭하면 `플러그인 관리` 링크를 통하여 해당 기능에 접근할 수 있습니다.

- 업데이트된 플러그인 목록 : 설치된 플러그인 중 업데이트가 있는 플러그인 목록이 나타납니다.
- 설치 가능 :  아직 해당 Jenkins에 설치되어있지 않은 플러그인 목록이 나타납니다.
- 설치된 플러그인 목록 : 해당 Jenkins에 설치되어있는 플러그인이 나타납니다. 필수적이지 않은 플러그인인 경우 삭제도 해당 탭에서 가능합니다.
- 고급 : 플러그인 서버에 접속할 수 있도록 별도의 프록시를 설정하거나, `.hpi`확장자를 갖는 플러그인을 설치하거나 업데이트 사이트를 지정할 수 있습니다.

각 플러그인 이름을 클릭하면 플러그인 정보를 확인할 수 있는 `plugins.jenkins.io` 사이트로 이동하여 정보를 보여줍니다. 사용방법은 우측에 `wiki`링크를 클릭합니다. 대략적인 UI나 사용방법은 `wiki.jenkins.io`에서 제공합니다. 



**Step 2. Using shared libraries**

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



**주의**

해당 설정은 모든 빌드에 영향을 주기 때문에 타 작업을 위해 추가된 **Global Pipeline Libraries**의 **Library**를 삭제하여 진행합니다.



## 6. Notifications

Jenkins빌드의 결과를 받아볼 수 있는 몇가지 방안에 대해 알아봅니다.



**Step 1. Notifications of build state**

Jenkins에서는 플러그인이나 외부 툴에 의해 빌드에 대한 결과를 받아 볼 수 있습니다. 대표적으로는 Jenkins의 슬랙 플러그인을 사용하여 슬랙으로 빌드에 결과를 받아보거나, catlight.io 에서 데스크탑용 어플리케이션에 연동하는 방법도 있습니다.

![1564463655933](image/1564463655933.png)

여기서는 Chrome 확장 프로그램을 통한 알림을 받을 수 있는 설정을 설명합니다. 이 과정을 진행하기 위해서는 Chrome 웹브라우저가 필요합니다.

1.  [chrome://apps/](chrome://apps/)에 접속하여 앱스토어를 클릭합니다.

2. jenkins를 검색하여 `Yet Another Jenkins Notifier`를 확인합니다. `Chrome에 추가`버튼으로 확장 프로그램을 설치합니다.

3. 설치가 완료되면 브라우저 우측 상단에 Jenkins 아이콘이 나타납니다. 클릭합니다.

4. 각 Item(Job)의 url을 입력하여 `+`버튼을 클릭합니다.

5. 등록된 Item을 확인하고 해당 빌드를 Jenkins 콘솔에서 실행해봅니다. 결과에 대한 알림이 발생하는 것을 확인 할 수 있습니다.

   ![1564464197547](image/1564464197547.png)



**Step 2. Build state badges for SCM**

Jenkins에서 빌드가 수행된 결과를 SCM에 반영하는 기능도 플러그인을 통해 가능합니다. SCM에서 해당 Jenkins에 접근이 가능해야 하므로 Jenkins는 SCM에서 접근가능한 네트워크 상태여야 합니다.

Jenkins에 새로운 플러그인을 추가하고 설정합니다.

- `Jenkins 관리`로 이동하여 `플러그인 관리`를 클릭합니다.
- `설치 가능` 탭을 클릭하고 상단의 검색에 `embed`를 입력하면 `Embeddable Build Status`플러그인이 나타납니다. 선택하여 설치를 진행합니다.
- `Jenkins 관리`로 이동하여 `Configure Global Security`을 클릭합니다.
- `Authorization` 항목에서 `Matrix-based security`를 체크합니다. 
- `Authenticated Users`의 경우 필요한 각 항목에 대해 체크박스를 활성화 합니다.
- `Anonymous Users`에 대해서 `Job/ViewStatus` 항목을 활성화 합니다.



이제 기존의 외부 SCM이 연결된 Item을 선택합니다. 여기서는 `05-02.UsingSharedLibraries`에 설정합니다. 해당 Item을 선택하면 좌측에 `Embeddable Build Status` 항목이 새로 생긴것을 확인 할 수 있습니다.

![1564464880533](image/1564464880533.png)



 해당 항목을 클릭하고 `Markdown`의 `unprotected`의 항목을 복사합니다.

```markdown
[![Build Status](http://myjenkins.com/buildStatus/icon?job=05-02.UsingSharedLibraries)](http://myjenkins.com/job/05-02.UsingSharedLibraries/)
```

복사한 형식을 GitHub의 evenOdd repository의 README.md 파일 상단에 위치 시킵니다.

```markdown
# evenOdd
[![Build Status](http://myjenkins.com/buildStatus/icon?job=libraries)](http://myjenkins.com/job/libraries/)

A Jenkins even/odd playbook from the Jenkins.io documentation

Add this as a shared library called evenOdd in your jenkins
instance, and then instantiate the pipeline in your project Jenkinsfile

This will also use an example of global variabls from the log.groovy
definitions

```

이같이 반영하면 각 빌드에 대한 결과를 SCM에 동적으로 상태를 반영 할 수 있습니다.

![1564465713857](image/1564465713857.png)

이같은 알림 설정은 코드의 빌드가 얼마나 잘 수행되는지 이해하고 추적할 수 있도록 도와줍니다.



## 7. Testing

**Step 1. Code coverage tests and reports**

테스트 Pipeline 구성시 테스트 과정을 지정할 수 있습니다.  Testing을 위한 `Pipeline` 타입의 Item을 추가로 생성합니다. (e.g. 07-01.CodeCoverageTestsAndReports)

설정은 다음과 같이 수행합니다.

1. `Pipeline` 스크립트에 다음과 같이 입력 합니다. 테스트와 빌드, 검증 후 결과를 보관하는 단계까지 이루어 집니다.

   ```groovy
   pipeline {
       agent any
       stages {
           stage('Build') {
               steps {
                   sh '''
                     echo This > app.sh
                     echo That >> app.sh
                   '''
               }
           }
           stage('Test') {
               steps {
                   sh '''
                     grep This app.sh >> ${BUILD_ID}.cov
                     grep That app.sh >> ${BUILD_ID}.cov
                   '''
               }
           }
           stage('Coverage'){
               steps {
                   sh '''
                     app_lines=`cat app.sh | wc -l`
                     cov_lines=`cat ${BUILD_ID}.cov | wc -l`
                     echo The app has `expr $app_lines - $cov_lines` lines uncovered > ${BUILD_ID}.rpt
                     cat ${BUILD_ID}.rpt
                   '''
                   archiveArtifacts "${env.BUILD_ID}.rpt"
               }
           }
       }
   }
   ```

2. 빌드가 완료되면 해당 Job화면을 리로드 합니다. Pipeline에 `archiveArtifacts`가 추가되었으므로 해당 Job에서 이를 관리합니다.
   ![1564470826126](image/1564470826126.png)

3. 해당 아카이브에는 코드 검증 후의 결과가 저장 됩니다.



**Step 2. Using test results to stop the build**

테스트 결과에 따라 빌드를 중지시키는 Pipeline 스크립트를 확인합니다. Testing을 위한 `Pipeline` 타입의 Item을 추가로 생성합니다. (e.g. 07-02.UsingTestResultsToStopTheBuild)

설정은 다음과 같이 수행합니다.

1. `Pipeline` 스크립트에 다음과 같이 입력 합니다. 테스트와 빌드, 검증 후 결과를 보관하는 단계까지 이루어 집니다.

   ```groovy
   pipeline {
       agent any
       stages {
           stage('Build') {
               steps {
                   sh '''
                     echo This > app.sh
                     echo That >> app.sh
                     echo The Other >> app.sh
                   '''
               }
           }
           stage('Test') {
               steps {
                   sh '''
                     for n in This That Those
                      do if grep $n app.sh >> ${BUILD_ID}.cov
                       then exit 1
                      fi
                     done
                   '''
               }
           }
           stage('Coverage'){
               steps {
                   sh '''
                     app_lines=`cat app.sh | wc -l`
                     cov_lines=`cat ${BUILD_ID}.cov | wc -l`
                     echo The app has `expr $app_lines - $cov_lines` lines uncovered > ${BUILD_ID}.rpt
                     cat ${BUILD_ID}.rpt
                   '''
                   archiveArtifacts "${env.BUILD_ID}.rpt"
               }
           }
       }
   }
   ```

2. 저장을 하고 빌드를 수행하면, Pipeline 스크립트 상 `Test` Stage에서 조건 만족 시 `exit 1`를 수행하므로 빌드는 중간에 멈추게 됩니다.

   ![1564471729123](image/1564471729123.png)



## 8. REST API

Jenkins는 외부 서비스와의 연동이나 정보 조회를 위한 API를 제공합니다.



**Step 1. Triggering builds via the REST API**

Jenkins REST API 테스트를 위해서는 Jenkins에 인증 가능한 Token을 취득하고 curl이나 Postman 같은 도구를 사용하여 확인 가능 합니다. 우선 Token을 얻는 방법은 다음과 같습니다.

1. Jenkins에 로그인 합니다.

2. 우측 상단의 로그인 아이디에 마우스를 호버하면 드롭박스 버튼이 나타납니다. `설정`을 클릭합니다.

3. `API Token`에서 `Current token`을 확인합니다. 등록된 Token이 없는 경우 다음과 같이 신규 Token을 발급 받습니다.

   - `ADD NEW TOKEN`을 클릭합니다.

   - 이름을 기입하는 칸에 로그인 한 아이디를 등록합니다. (e.g. admin)
   - `GENERATE`를 클릭하여 Token을 생성합니다.

4. 이름과 Token을 사용하여 다음과 같이 curl로 접속하면 `Jenkins-Crumb` 프롬프트가 나타납니다.

   ```bash
   $ curl --user "admin:TOKEN" 'http://myjenkins.com/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)'
   
   Jenkins-Crumb:89e1fd9c402824c89465f6b97f49b605
   ```

5. `Crumb`를 확인했으면 다시 헤더 값에 `Jenkins-Crumb:`를 추가하여 `02-04.MultiStep` Job을 빌드하기 위해 다음과 같이 요청합니다.

   ```bash
   $ curl -X POST http://myjenkins.com/job/02-04.MultiStep/build --user gyulee:11479bdec9cada082d189938a3946348be --data-urlencode json='' -H "Jenkins-Crumb:89e1fd9c402824c89465f6b97f49b605"
   ```

API로 호출된 빌드가 수행되어 빌드 번호가 증가하는 것을 확인합니다.



**Step 2. Retriving build status via the REST API**

빌드에 대한 결과를 REST API를 통해 요청하는 방법을 알아봅니다. 앞서 진행시의 Token값이 필요합니다. Json 형태로 출력되기 때문에 정렬을 위해 python이 설치 되어있다면  `mjson.tool`을 사용하여 보기 좋은 형태로 출력 가능합니다.

```bash
# Python이 설치되어있지 않은 경우
$ yum -y install python2

# Jenkins에 REST API로 마지막 빌드 상태 요청
$ curl  -s --user gyulee:11479bdec9cada082d189938a3946348be http://myjenkins.com/job/02-04.MultiStep/lastBuild/api/json | python2 -mjson.tool

{
    "_class": "org.jenkinsci.plugins.workflow.job.WorkflowRun",
    "actions": [
        {
            "_class": "hudson.model.CauseAction",
            "causes": [
                {
                    "_class": "hudson.model.Cause$UserIdCause",
                    "shortDescription": "Started by user GyuSeok.Lee",
                    "userId": "gyulee",
                    "userName": "GyuSeok.Lee"
                }
            ]
        },
        {},
        {
            "_class": "hudson.plugins.git.util.BuildData",
            "buildsByBranchName": {
                "master": {
                    "_class": "hudson.plugins.git.util.Build",
                    "buildNumber": 5,
                    "buildResult": null,
...
```



## 9. Security

**Step 1. Securing your deployment with users**

사용자별 배포수행을 위한 사용자 설정을 설명합니다.

- `Jenkins 관리`로 이동하여 `Configure Global Security`를 클릭합니다.



`Enable security`는 보안 설정 여부를 설정하는 항목으로 기본적으로는 비활성화되어있습니다. 체크하여 활성화하면 다양한 보안 옵션을 설정할 수 있는 항목이 표기 됩니다.

- Disable remember me : 로그인 시 사용자를 기억할지의 여부를 묻는 체크박스에 대한 활성/비활성 설정입니다.



Security Realm 에서는 Jenkins에서 사용하는 사용자 관리 방식을 선택합니다. 

- Delegate to servlet container : Jenkins를 실행하는 서블릿 컨테이너에서 접근을 관리합니다.
- Jenkins' own user database : 기본 설정입니다. Jenkins 자체적으로 사용자 데이터를 관리합니다. `사용자의 가입 허용`이 활성화되면 Jenkins 에 접속하는 사용자는 스스로 계정을 생성하고 접근 가능합니다.
- LDAP : 외부 LDAP과 연동하여 사용자를 관리합니다. LDAP 으로 계정을 통합 관리하는 경우 유용합니다.
- Unix user/group database : Unix/Linux에서 해당 호스트의 사용자를 관리를 기반으로 연동합니다.



Authorization 에서는 사용자 권한에 대한 설정을 정의합니다.

- Anyone can do anything : Jenkins에 접근할 수 있는 모든 요청을 허용합니다.
- Legacy mode :  `1.164`이전 버전의 동작과 동일하게 관리됩니다. `Admin`사용자만 모든 기능을 수행하며, 일반 사용자와 비로그인 사용자는 읽기만 가능합니다.
- Logged-in users can do anything : 로그인만 되면 모든 기능을 수행할 수 있는 설정압니다.
- Matrix-based security : 매트릭스 기반으로 각 기능을 사용자와 그룹별로 조절할 수 있습니다.
- Project-based Matrix Authorization Strategy : 매트릭스 기반 권한설정의 확장으로, 개별 프로젝트 별로 권한을 조정할 수 있습니다. 



다음은 권한 매트릭스의 항목과 권한별 설명입니다.

| 항목        | 권한                  | 의미                                                         |
| :---------- | :-------------------- | :----------------------------------------------------------- |
| **Overall** | Administer            | 시스템의 전역 설정을 변경할 수 있다. OS 에서 허용된 범위안에서 전체 시스템 엑세스드의 매우 민감한 설정을 수행 |
|             | Read                  | 젠킨스의 모든 페이지 확인 가능                               |
|             | RunScripts            | 그루비 콘솔이나 그루비 CLI 명령을 통해 그루비 스크립트를 실행 |
|             | UploadPlugins         | 특정 플러그인을 업로드                                       |
|             | ConfigureUpdateCenter | 업데이트 사이트와 프록시 설정                                |
| **Slave**   | Configure             | 기존 슬레이브 설정 가능                                      |
|             | Delete                | 기존 슬레이브 삭제                                           |
|             | Create                | 신규 슬레이브 생성                                           |
|             | Disconnect            | 슬레이브 연결을 끊거나 슬레이브를 임시로 오프라인으로 표시   |
|             | Connect               | 슬레이브와 연결하거나 슬레이브를 온라인으로 표시             |
| **Job**     | Create                | 새로운 작업 생성                                             |
|             | Delete                | 기존 작업 삭제                                               |
|             | Configure             | 기존 작업의 설정 갱신                                        |
|             | Read                  | 프로젝트 설정에 읽기 전용 권한 부여                          |
|             | Discover              | 익명 사용자가 작업을 볼 권한이 없으면 에러 메시지 표시를 하지 않고 로그인 폼으로 전환 |
|             | Build                 | 새로운 빌드 시작                                             |
|             | Workspace             | 젠킨스 빌드를 실행 하기 위해 체크아웃 한 작업 영역의 내용을 가져오기 가능 |
|             | Cancel                | 실행중인 빌드 취소                                           |
| **Run**     | Delete                | 빌드 내역에서 특정 빌드 삭제                                 |
|             | Update                | 빌드의 설명과 기타 프로퍼티 수정(빌드 실패 사유등)           |
| **View**    | Create                | 새로운 뷰 생성                                               |
|             | Delete                | 기존 뷰 삭제                                                 |
|             | Configure             | 기존 뷰 설정 갱신                                            |
|             | Read                  | 기존 뷰 보기                                                 |
| **SCM**     | Tag                   | 특정 빌드와 관련된 소스 관리 시스템에 태깅을 생성            |



CSRF Protection 항목에 있는 `Prevent Cross Site Request Forgery exploits` 항목은  페이지마다 nonce 또는 crumb 이라 불리우는 임시 값을 삽입하여 사이트 간 요청 위조 공격을 막을 수 있게 해줍니다. 사용방법은 위에서 REST API 에 대한 설명 시 crumb 값을 얻고, 사용하는 방법을 참고합니다.



**Step 2. Securing secret credentials and files**

Jenkins에서 Pipeline을 설정하는 경우 일부 보안적인 값이 필요한 경우가 있습니다. 예를 들면 `Username`과 `Password` 같은 값입니다. 앞서의 과정에서 `Credentials`를 생성하는 작업을 일부 수행해 보았습니다. 여기서는 생성된  인증 값을 Pipeline에 적용하는 방법을 설명합니다.

`Pipeline` 타입의 Item을 추가로 생성합니다. (e.g. 09-02.SecuringSecretCredentialsAndFiles) 설정은 다음과 같이 수행합니다.

1. `Pipeline` 스크립트에 다음과 같이 입력 합니다.

   ```groovy
   pipeline {
       agent any
       environment {
          SECRET=credentials('jenkins-secret-text')
       }
       stages {
           stage('Build') {
               steps {
                   echo "${env.SECRET}"
               }
           }
       }
   }
   ```

2. 저장 후 `Build Now`를 클릭하여 빌드를 수행하면 실패하게 되고 `Console Output`에서 진행사항을 보면, Pipeline 스크립트에서 선언한 `jenkins-secret-text`때문에 에러가 발생한 것을 확인할 수 있습니다.

3. 좌측 상단의 `Jenkins`버튼을 클릭하여 최상위 메뉴로 이동합니다.

4. 좌측 메뉴의 `Credentials`를 클릭하고 `(global)` 도메인을 클릭합니다.

   ![1564534571013](image/1564534571013.png)

5. 좌측에 `Add Credentials`를 클릭하여 새로운 항목을 추가합니다.

   - Kind : Secret text
   - Secret : 해당 Credential에 담을 값을 기입합니다. (e.g. This is credential text.)
   - ID : jenkins-secret-text

6. 저장 후 다시 빌드를 수행하면 정상적으로 수행됩니다. 해당 값은 숨기기 위한 값이므로 Pipeline 스크립트에서 `echo`로 호출하더라도 `****`이란 값으로 표기 됩니다.

이같은 방법은 Password같은 보안에 민감한 정보를 사용하기에 유용합니다.



**Step 3. Auditing your environment**

Jenkins의 변화와 활동에 대한 감시를 위한 설정 방법을 설명합니다. Jenkins에 새로운 플러그인을 추가하고 설정합니다.

- `Jenkins 관리`로 이동하여 `플러그인 관리`를 클릭합니다.
- `설치 가능` 탭을 클릭하고 상단의 검색에 `audit`를 입력하면 `Audit Trail`플러그인이 나타납니다. 선택하여 설치합니다.
- `Jenkins 관리`로 이동하여 `시스템 설정`을 클릭합니다.
- Audit Trail 항목이 추가되었습니다. Loggers의 `ADD LOGGER`드롭박스에서  `Log File`을 선택하여 설정합니다.
  - Log Location : /var/jenkins_home/audit/audit.log
  - Log File Size MB : 100MB
  - Log File Count : 5



저장 후 빌드나 Job의 설정 변경등의 작업을 수행하면, `audit.log.0`으로 지정된 파일 경로에 생성됨을 확인 할 수 있습니다.

```bash
$ tail -f ./audit.log.0
Jul 31, 2019 10:47:32,727 AM job/02-02.Jobs/ #12 Started by user GyuSeok.Lee
Jul 31, 2019 10:47:42,738 AM /job/03-04.WebhookBuild Triggering/configSubmit by gyulee
Jul 31, 2019 10:48:09,001 AM /configSubmit by gyulee
```



**Step 4. Using forders to create security realms**

다양한 프로젝트를 관리하는 경우 관리상, 빌드 프로젝트를 관리해야할 필요성이 발생합니다. Jenkins에서 Forder 아이템을 생성하여 관리 편의성과 보안요소를 추가할 수 있습니다.

우선 테스트를 위한 사용자를 추가합니다.

- 좌측 메뉴에서 `Jenkins 관리`를 클릭하여 `Manage Users`로 이동합니다.
- `사용자 생성`을 클릭하여 새로운 사용자를 추가합니다.
  - 계정명 : test
  - 암호 : test
  - 암호 확인 : test
  - 이름 : tester
  - 이메일 주소 : test@redhat.com



다음으로 Forder 타임의 Item을 추가합니다.

- 좌측 메뉴에서 `새로운 Item`을 클릭하여 이름을 `02-Project`로 예를 들어 지정하고, Forder를 클릭하여 `OK`버튼을 클릭합니다.
  ![1564537956019](image/1564537956019.png)
- 설정 페이지가 나오면 `SAVE`버튼을 클릭하고 좌측 상단의 `Jenkins` 버튼을 클릭하여 최상위 페이지로 이동합니다.
- 기존 프로젝트를 새로 생성한 Forder 타입으로 이동시켜 봅니다.  최상위 화면에서 `02-02.Jobs`에 마우스를 대면 드롭박스 메뉴를 확장할 수 있습니다. `Move`를 클릭합니다.
  ![1564538201169](image/1564538201169.png)
- 드롭박스에서 `Jenkins >> 02-Project`를 선택하고 `MOVE`버튼을 클릭합니다. 다시 최상위 메뉴로 오면 `02-02.Jobs`가 사라진 것을 확인할 수 있습니다. `02` 로 시작하는 다은 프로젝트도 같은 작업을 수행하여 이동시킵니다.
- `02-Project`를 클릭하면 이동된 프로젝트들이 나타납니다.
  ![1564538419183](image/1564538419183.png)



권한 설정을 하여 현재 Admin 권한의 사용자는 접근 가능하고 새로 생성한 tester는 접근불가하도록 설정합니다.

- Folder에 접근하는 권한을 설정하기위해 `Jenkins 관리`의 `Configure Global Security`로 이동합니다.

- Authorization항목의 `Project-based Matrix Authorization Strategy`를 선택합니다.

- `ADD USER OR GROUP...`을 클릭하여 Admin 권한의 사용자를 추가합니다.

- Admin 권한의 사용자에게는 모든 권한을 주고 `Authenticated Users`에는 Overall의 `Read` 권한만 부여합니다.
  ![1564543546039](image/1564543546039.png)

- 생성한 `02-Project`로 이동하여 좌측 메뉴의 `Configure`를 클릭합니다.

- Properties에 추가된 `Enable project-based security`를 확성화하면 항목별 권한 관리 메트릭스가 표시됩니다. Job의 Build, Read, ViewStatus, Workspace를 클릭하고 View의 Read를 클릭하여 권한을 부여합니다.

  ![1564540010695](image/1564540010695.png)

- 로그아웃 후에 앞서 추가한 `test`사용자로 로그인 하면 기본적으로 다른 프로젝트나 Item들은 권한이 없기 때문에 보이지 않고, 앞서 설정한 `02-Project` 폴더만 리스트에 나타납니다.
  ![1564543591394](image/1564543591394.png)



Jenkins의 인증 기능을 사용하여 보안적 요소를 구성할 수 있습니다. Audit 로그를 활용하여 사용자별 활동을 기록할 수도 있고 Folder를 활용하면 간단히 사용자/그룹에 프로젝트를 구분하여 사용할 수 있도록 구성할 수 있습니다.



## 10. Artifacts

빌드 이후 빌드의 결과를 기록하고 저장하는 방법을 설명합니다.



**Step 1. Creating and storing artifacts**

Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 10-01.CreatingAndStoringArtifacts)

Pipeline에 다음과 같이 스크립트를 추가합니다.

```groovy
pipeline {
    agent any
    stages{
        stage('Build') {
            steps{
                sh 'echo "Generating artifacts for ${BUILD_NUMBER}" > output.txt'
            }
        }
        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'output.txt', onlyIfSuccessful: true
            }
        }
    }
}
```

`Archive` Stage에 `archiveArtifacts` 스크립트가 동작하는 예제입니다. 이같은 Pipeline 스크립트 작성을 도와주는 툴을 추가로 확인해 봅니다. 

- Pipeline 하단의 `Pipeline Syntax` 링크를 클릭합니다.
  ![1564546308113](image/1564546308113.png)
- `Sample Step`에서 `archiveArtifacts: Archive the artifacts`를 선택합니다.
  - Files to archive : output.txt
  - `고급...`을 클릭합니다.
  - 다음 항목을 활성화 합니다.
    - Archive artifacts only if build is successful
    - Use default excludes
    - Treat include and exclude patterns as case sensitive
  - 하단의 `GENERATE PIPELINE SCRIPT`를 클릭합니다.



결과물을 확인하면 Pipeline 스크립트에 작성한 형태와 같은 것을 확인 할 수 있습니다.

![1564545470815](image/1564545470815.png)



좌측 메뉴의 `Build Now`를 클릭하여 빌드 수행 후에 화면에 Artifacts 항목이 추가된 것을 확인할 수 있습니다. UI 상에는 마지막 빌드 결과가 강조되어 나오고 각 빌드에 대한 결과물은 각각의 빌드단계의 다운로드 버튼으로 확인하고 다운로드 할 수 있습니다.

![1564545639205](image/1564545639205.png)



**Step 2. Fingerprinting for artifact tracking**

빌드 이후 보관되는 파일에 대해 어떤 프로젝트, 어떤 빌드 에서 발생한 결과물인지 확인할 수 있는 핑거프린팅 기능을 설명합니다.

`Step 1`의 프로젝트를 그대로 사용하거나 Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 10-02.FingerprintingForArtifactTracking)

`Step 1` Pipeline 스크립트의 `archiveArtifacts`에 `fingerprint: true`를 추가합니다.

```groovy
pipeline {
    agent any
    stages{
        stage('Build') {
            steps{
                sh 'echo "Generating text artifacts: Build:${BUILD_NUMBER}" > output.txt'
            }
        }
        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'output.txt', fingerprint: true, onlyIfSuccessful: true
            }
        }
    }
}
```



파일의 지문을 확인합니다.

- 첫번째 빌드를 수행하고 빌드 결과 아카이브 파일 `output.txt`파일을 다운로드 받습니다. (파일을 우클릭하고 `다른 이름으로 링크 저장...` or `Download Linked File` 을 클릭하여 파일을 받습니다.)
  ![1564546697375](image/1564546697375.png)

- 좌측 상단의 `Jenkins`를 클릭하여 최상위 메뉴로 돌아갑니다.
- 좌측 메뉴의 `파일 핑거프린트 확인`을 클릭합니다.
- `파일 선택`버튼을 클릭하여 앞서 다운로드한 파일을 선택하고 `확인하기`버튼을 클릭합니다.
- 어떤 프로젝트의 몇번째 빌드에서 발생한 파일인지 확인합니다.
- 두번째 빌드를 수행하고 파일 핑거프린트를 확인해 봅니다.
- 빌드 번호 정보가 변경된 것을 확인합니다.



## 11. Pipelines

Pipeline에 대해 설명합니다.



**Step 1. Automating deployment with pipelines**

Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 11-01.AutomatingDeploymentWithPipelines)

Pipeline에 다음과 같은 스크립트를 입력합니다.

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'echo "Hello World"'
            }
        }
        stage('Test') {
            steps {
                sh 'echo "Test Hello World!"'
            }
        }
    }
}
```

두개의 Stage를 갖는 Pipeline 스크립트입니다. Pipeline은 빌드 수행시의 각 단계를 구분하여 빌드의 과정을 확인하고 실패에 따른 단계별 확인이 가능합니다.

좌측 `Build Now`를 클릭하여 빌드를 수행하면 빌드에 대한 결과는 Stage 별로 성공 실패의 여부와 로그를 확인할 수 있도록 `Stage View`가 UI로 제공됩니다. Stage 별로 Stage View는 기록되며, Stage에 변경이 있거나 이름이 변경되는 경우에는 해당 UI에 변경이 발생하여 기존 Pipeline 기록을 보지 못할 수 있습니다.

![1564547435978](image/1564547435978.png)



**Step 2. Creating pipeline gates**

Pipeline 타입의 Item을 추가로 생성합니다. (e.g. 11-02.CreatingPipelineGates)

Pipeline에 다음과 같은 스크립트를 입력합니다.

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'echo "Hello World"'
            }
        }
        stage('BuildMore'){
            steps {
                input message: "Shall we build more?"
                sh '''
                    echo "We are approved; continue!"
                    ls -lah
                '''
            }
        }
    }
}
```

개의 Stage를 갖는 Pipeline 스크립트입니다. 두번째 Stage에 `input` 스크립트가 있습니다. 이 스크립트가 추가되면 Pipeline을 진행하면서 해당하는 동작을 수행할 것인지, 마치 승인 작업과 같은 동작을 수행할 수 있습니다.

좌측 `Build Now`를 클릭하여 빌드를 수행하면 두번째 Stage에서 해당 작업을 수행할 지에 대한 물음을 확인 할 수 있습니다.

![1564547694870](image/1564547694870.png)

`Abort`를 선택하면 빌드 취소와 같은 동작으로 실패로 처리되지는 않습니다.



**Step 3. Job promotion for long-running pipeline**

빌드 단계를 구현할 때 Pipeline 스크립트로 하나의 프로젝트 내에서 모든 동작을 정의 할 수도 있지만 서로다른 Job을 연계하고, 승인 절차를 따르도록 구성할 수 있습니다.

Job promotion 기능을 사용하기 위한 플러그인을 설치합니다.

- `Jenkins 관리`에서 `플러그인 관리`를 선택합니다.
- `설치 가능` 탭을 클릭하고 상단의 검색에 `promoted`를 입력하면 `promoted builds`를 확인 할 수 있습니다.  설치합니다.



FreeStyle 타입의 Item을 생성합니다. (e.g. 11-03.Job-one)

- General 탭의 `Promote builds when...`를 활성화 하여 설정합니다.

  - Name : Manual
  - Criteria 설정의 `Only when manually approved` 활성화
    - Approvers : 승인자를 입력합니다. (e.g. admin)
    - `ADD PRAMETER` 드롭박스에서 `Boolean Parameter`를 선택합니다.
      - Name : approve

- Build 드롭박스에서 `Execute shell`을 선택합니다.

- 다음을 입력합니다.

  ```bash
  echo 'This is the Job-one'
  ```

- 저장하면 생성된 프로젝트에 `Promotion Status`항목이 추가되어 생성됩니다.



`11-03.Job-one` 빌드 후 승인에 대한 다음 빌드를 진행할 FreeStyle 타입의 Item을 생성합니다. (e.g. 11-03.Job-two)

- 빌드 유발 항목에서 `Build when another project is promoted`를 활성화 합니다. 어떤 Job에서 promote 상황이 발생하였을 때 빌드를 수행할지 지정합니다.

  - Job Name : 11-03.Job-one
  - Promotion : Manual

- Build 드롭박스에서 `Execute shell`을 선택합니다.

- 다음을 입력합니다.

  ```bash
  echo 'This is the Job-two'
  ```



`11-03.Job-one`에 대한 빌드를 수행합니다. 수행 완료 후 빌드 히스토리의 최근 빌드를 클릭(e.g. #1)하면 `Promotion Status`에 승인절차를 기다리고 있음을 확인할 수 있습니다. Parameters 항목의 `approve`를 체크하고 `APPROVE`버튼을 클릭합니다.

![1564554095622](image/1564554095622.png)

승인이 완료되면 해당 프로젝트의 승인에 대한 이벤트를 통해 빌드를 수행하는 `11-03.Job-two`가 이어서 빌드됨을 확인 할 수 있습니다.



**Step 4. Multibranch repository automation**

SCM의 Multibranch를 빌드하는 과정에 대해 설명합니다.

다음의 GitHub repository를 fork 합니다.

- https://github.com/Great-Stone/multibranch-demo

Multibranch Pipeline 형태의 Item을 생성합니다. (e.g. 11-04.MultibranchRepositoryAutomation)

- Branch Sources의 `ADD SOURCE`드롭박스에서 GitHub를 클릭합니다.
  - Credentials에서 앞서 생성한 GitHub 접속을 위한 Credential을 선택합니다.
  - Repository HTTPS URL에 앞서 fork한 GitHub URL을 입력하고 `VALIDATE`버튼을 클릭하여 잘 접근 되는지 확인합니다.
- Scan Multibranch Pipeline Triggers에서 `Periodically if not otherwise run`를 활성화 합니다.
  - Interval 주기를 `1 minute`으로 설정합니다. 

저장 후에는 자동적으로 모든 브랜치의 소스를 빌드 수행합니다.

![1564555063361](image/1564555063361.png)

![1564554995103](image/1564554995103.png)

SCM에서 브랜치를 여러개 관리하고 모두 빌드와 테스팅이 필요하다면 Multibranch 프로젝트를 생성하여 등록하고, 빌드 관리가 가능합니다.



**Step 5. Creating pipeline with snippets**

Pipeline 을 스크립트를 작성하는 방법을 배워봅니다. Pipeline 타입의 Item을 생성합니다. (e.g. 11-05. CreatingPipelineWithSnippets)

Pipeline에 다음과 같은 스크립트를 입력합니다.

```groovy
pipeline {
    agent any
    stages {
        stage("Hello") {
            steps {
                echo 'Hello World'
            }
        }
    }
}
```

echo가 동작할때 시간을 기록하도록 스크립트를 수정해보겠습니다. 

- Pipeline Syntax 링크를 클릭합니다.

- Sample Step에서 `timestamps: timestamps`를 선택하고 `GENERATE PIPELINE SCRIPT`버튼을 클릭합니다.

  ```groovy
  timestamps {
      // some block
  }
  ```

- 사용방식을 확인하고 앞서 Pipeline 스크립트의 stage에 시간을 기록하도록 수정합니다.

  ```groovy
  ...
  stage("Hello") {
      steps {
          timestamps {
              echo 'Hello World'
          }
      }
  }
  ...
  ```

빌드를 수행하고 로그를 확인해 봅니다. echo 동작이 수행 될때 시간이 함께 표기되는 것을 확인 할 수 있습니다.

![1564555730104](image/1564555730104.png)



**Step 6. Discovering global pipeline variables**

Pipeline에서 사용할 수 있는 변수를 확인하고 사용하는 방법을 알아봅니다. Pipeline 타입의 Item을 생성합니다. (e.g. 11-06.DiscoveringGlobalPipelineVariables)

Pipeline에 다음과 같은 스크립트를 입력합니다.

```groovy
pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
               echo "We are in build ${currentBuild.number}"
               echo "Our current result is ${currentBuild.currentResult}"
            }
        }
        stage('BuildMore'){
            steps {
               echo "Name of the project is ${currentBuild.projectName}"
            }
        }
        stage('BuildEnv'){
            steps {
                echo "Jenkins Home : ${env.JENKINS_HOME}"
            }
        }
    }
}
```

Pipeline 스크립트에서 사용가능한 변수와 사용방법은 `Pipeline Syntax` 링크의 `Global Variables Reference` 항목에서 확인 가능합니다.

![1564557613406](image/1564557613406.png)



## Apendix

**GitHub SCM 연동 이슈**

GitHub를 SCM으로 사용하는 경우 다음과 같은 메시지가 출력되면서 진행되지 않는 경우가 있습니다.

```text
GitHub API Usage: Current quota has 5000 remaining (447380 over budget). Next quota of 5000 in 5 days 0 hr. Sleeping for 4 days 23 hr.
14:07:33 GitHub API Usage: The quota may have been refreshed earlier than expected, rechecking...
```

이 경우 서버 시간과 GitHub의 시간이 맞지 않아 발생할 수 있는 이슈 입니다.  ntpdate를 재설정 합니다.

- RHEL7 : ntpd를 재시작 합니다.

  ```bash
  $ systemctl restart ntpd
  ```

  

- RHEL8 : RHEL8에서는 ntpdate를 사용하지 않고 chronyd가 대신합니다.
  https://access.redhat.com/solutions/4130881

  ```bash
  $ systemctl stop chronyd
  $ chronyd -q
  $ systemctl start chronyd
  ```

  

**유용한 플러그인**

- Restart Safely : Jenkins를 재기동해야하는 경우 빌드가 수행중이지 않을 때 자동으로 Restart 시켜줍니다. 설치 후에는 왼쪽 주 메뉴에 표시됩니다.
- ThinBackup : Jenkins의 구성을 백업, 복구할 수 있는 기능을 제공합니다. 백업 주기나 백업 개수등을 정의 할 수 있습니다.


