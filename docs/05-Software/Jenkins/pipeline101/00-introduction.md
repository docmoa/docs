---
description: jenkins 101
tag: ["cicd", "jenkins"]
---

# Pipeline on Jenkins 101 : Introduction

> Update at 31 Jul, 2019

Jenkins Pipeline 을 구성하기 위해 VM 환경에서 Jenkins와 관련 Echo System을 구성합니다. 각 Product의 버전은 문서를 작성하는 시점에서의 최신 버전을 위주로 다운로드 및 설치되었습니다. 구성 기반 환경 및 버전은 필요에 따라 변경 가능합니다.

| Category | Name                     | Version |
| -------- | ------------------------ | ------- |
| VM       | VirtualBox               | 6.0.10  |
| OS       | Red Hat Enterprise Linux | 8.0.0   |
| JDK      | Red Hat OpenJDK          | 1.8.222 |
| Jenkins  | Jenkins rpm              | 2.176.2 |



## Jenkins 실행 및 구성


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



## GitHub 계정생성

진행되는 실습에서는 일부 GitHub를 SCM으로 연동합니다. 원활한 진행을 위해 GitHub계정을 생성해주세요. 또는 별개의 Git 서버를 구축하여 사용할 수도 있습니다.



## Jenkins Theme (Optional)

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