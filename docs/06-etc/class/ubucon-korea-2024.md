---
description: "우분투와 함께 배포하기"
tag: ["devops", "container"]
author : GS
---

![](https://eventusstorage.blob.core.windows.net/evs/Image/ubuntukr/81549/ProjectInfo/Cover/f16d8e1dd7af46cfb910dfaf9574dd60.png)


# UbuCon Korea 2024

> [행사 홈페이지](https://2024.ubuntu-kr.org/ko/)
> 2024년 8월 10일
> 한국 마이크로소프트
> 일정표 : <https://events.canonical.com/event/48/timetable/#20240810>

## 1. Opening remarks (10:00)

우분투 커뮤니티의 맴버 소개와 UbuCon Korea의 발걸음을 이야기해 주었다.
`UbuCon Asia 2022` 행사 이후 UbuCon Korea가 별도로 진행되고 있다. 2022년 `UbuCon Asia`가 서울에서 개최된 이후 분리되어 운영되는 걸로 보여진다. 인상적인건 `UbuCon Asia 2022`의 로고가 초롱불이 형상화되어있다.

![](https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_1664,h_568/https://ubuntu.com/wp-content/uploads/0cc4/Untitled.png)

2023년부터 UbuCon Korea가 진행되었다.

![](https://eventusstorage.blob.core.windows.net/evs/Image/ubuntukr/65995/ProjectInfo/Cover/7fe204e41d664c8fb9a806ee6faf806e.png)

[UbuCon Korea 2023 - 홈페이지](https://2023.ubuntu-kr.org/ko/)

## 2. 기조연설 Keynote (10:30)

아쉽게도 캐노니컬에서의 키노트는 사정상 생략 되었다. 

우분투 코리아의 7기 운영진의 문준상 대표의 대표된 썰(?)을 이야기해주었다.

- [7기 운영진 정보](https://disclosures.ubuntu-kr.org/organizers/gen7/)

표현은 납치라는 표현이라 했지만, 커뮤니티 운영과 책임자로서의 어깨가 무거운 만큼, 부담이 있을거라 생각되었다.

이후 7기 운영진에서 우분투 커뮤니티의 멤버쉽에 대한 안내와 자격에 대해 안내해주었다.

- [Ubuntu Membership 안내](https://ubuntu.com/community/membership)

멤버십 특전에 명시되어있지는 않으나, Ubuntu Summit같은 행사가 있는 경우 경비를 지원받을 수 있다고도 언급되었다.

### 2.1 멤버십 요건

- [Membership Requirements](https://ubuntu.com/community/membership/requirements)

Ubuntu 구성원 선정 기준의 간단한 요약은 다음과 같다.

시간: 6개월 이상의 지속적인 Ubuntu 관련 공헌이 필요합니다. 추천서가 필요합니다.
공헌 방식: 기술적 공헌 외에도, 아트워크, 문서, 포럼, IRC, 버그 조정, 번역, 개발 및 패키징, 마케팅 및 홍보 등 모든 종류의 공헌이 인정됩니다.
상류 프로젝트(Upstream) 공헌: Ubuntu는 Debian 및 기타 상류 프로젝트에 대한 공헌을 환영합니다. 그러나 멤버십은 우분투 다운스트림 참여를 필요로 합니다.
추천서: 다른 사람들의 추천서가 중요합니다. 다양한 분야의 구성원들로부터 추천서를 받는 것이 좋습니다.

### 2.2 멤버십 특전

- [Membership Perks](https://ubuntu.com/community/membership/perks)

우분투 커뮤니티를 더 좋게 만드는 것 외에도, 공식 회원이 되는 것은 많은 이점이 있다. 이러한 특전은 다음과 같습니다:

- 잠재적인 고용주와 함께 사용할 수 있는 담론 게시물 형태의 우분투 이력서.
- 우분투 커뮤니티 위원회 지명을 확인하기 위한 투표 권한.
- 당신의 실제 이메일 주소로 전달하는 @ubuntu.com 이메일 별칭.
- An ubuntu/member/your_nick cloak on Libera.Chat.
- 우분투 로고가 있는 명함을 인쇄할 권리
- 우분투 블로그의 행성 우분투 신디케이션.
- 우분투 포럼의 우분투 회원 타이틀.
- people.ubuntu.com의 웹 액세스 가능한 디렉토리에 대한 SFTP 액세스
- ESM 및 커널 라이브 패치에 액세스하기 위한 최대 50개의 시스템을 위한 우분투 프로
- Canonical CEO와 sabdfl, Mark Shuttleworth가 서명한 인증서.
- 리눅스 주간 뉴스 구독.
- 레딧의 우분투 멤버 플레어.
- Gandi.net에서 호스팅을 위한 할인된 도메인 등록 가격 및 파트너 요금.


## 3. Dockerfile 없이도 컨테이너 앱 빌드할 수 있어요 (feat .NET Aspire) (11:00)

> 일반적으로 컨테이너 이미지를 빌드하기 위해서는 Dockerfile이 필요합니다. 하지만, 과연 그것이 필수적으로 필요하다고 생각하시나요? 만약 Dockerfile 없이도 컨테이너 앱을 빌드할 수 있다면 어떨까요?
> 
> 이번 세션에서는 MSBuild의 옵션 조정만으로 다양한 우분투 기반의 컨테이너 이미지를 만들 수 있는 방법을 차근차근 알아봅니다. 특히 최근에 마이크로소프트와 캐노니컬이 협업하여 제공하는 치즐드 컨테이너 이미지로 경량화할 수 있는 방법에 대해서도 알아봅니다.
> 
> 더불어 .NET Aspire 라는 클라우드 네이티브 기반의 애플리케이션 오케스트레이션 프레임워크를 통해 앞서 Dockerfile 없이 빌드한 컨테이너 이미지를 곧바로 클라우드로 배포하는 과정에 대해서도 다뤄보겠습니다.

> Speaker : Justin Yoo

> Slide : <https://1drv.ms/b/s!ArWHNGHxF7lBhJon5HmBTqHtGrnn2A?e=ZKNQO3>

링크드인에서 가끔 뵈던 분인데, 그 사진이 뒤로 묶은 상태였어서 알아보질 못했다;

### 3.1  `Dockerfile` 작성의 부담

일반적으로 애플리케이션 컨테이너를 빌드한다고 하면 `DockerFile`을 떠올리게 된다. 하지만 `DockerFile`을 생성하고 관리하는 것도 하나의 코딩이라고 본다면 이또한 개발자에게 부담이 될 수 있다.

- 기본 이미지
- 작업 디렉토리
- 추가 명령어 / 환경 변수
- 시작 명령어

```docker
FROM mcr.microsoft.com/dotnet/sdk:8.0@sha256:35792ea4ad1db051981f62b313f1be3b46b1f45cadbaa3c288cd0d3056eefb83 AS build-env
WORKDIR /App

# Copy everything
COPY . ./
# Restore as distinct layers
RUN dotnet restore
# Build and publish a release
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0@sha256:6c4df091e4e531bb93bdbfe7e7f0998e7ced344f54426b7e874116a3dc3233ff
WORKDIR /App
COPY --from=build-env /App/out .
ENTRYPOINT ["dotnet", "DotNet.Docker.dll"]
```

### 3.2 `docker init` 사용해보기

`Docker Destop 4.19.0` 에 포함된 명령으로, `Dockerfile`을 생성하는데 도움을 주는 기능이다.

예를 들어 Python 애플리케이션이 있는 디렉터리에서 다음과 같이 명령을 수행하면,

```bash
docker init python
```

다음과 같은 상호작용을 통해 `Dockerfile`이 생성된다.

```bash
? What application platform does your project use? Python
? What version of Python do you want to use? 3.8
? What port do you want your app to listen on? 8000
? What is the command to run your app (e.g., gunicorn 'myapp.example:app' --bind=0.0.0.0:8000)? python ./app.py

CREATED: .dockerignore
CREATED: Dockerfile
CREATED: compose.yaml
CREATED: README.Docker.md

✔ Your Docker files are ready!

Take a moment to review them and tailor them to your application.

When you're ready, start your application by running: docker compose up --build

Your application will be available at http://localhost:8000

Consult README.Docker.md for more information about using the generated files.
```

### 3.3  `Dockerfile` 없이 빌드하기

`docker init` 명령은 Docker Desktop이 필요하며, 모두에게 해당되는 사항은 아니므로, 벙용적이지 않을 수 있고, 결국 `Dockerfile`을 수정하거나 관리하는 절차는 여전히 존재한다.

따라서 이번 세션에서는 애플리케이션의 패키지 도구에서 직접 `Dockerfile`없이도 컨테이너를 빌드하는 기능이 소개되었다.따지고 보면 없다기 보다는 애플리케이션 빌드 도구의 정의로 `Dockerfile`의 정의를 대신하는 방식이다. 예시에서는 `dotnet`이 사용되었지만 `gradle`에서도 유사한 과정을 지원하였다.

```bash
dotnet publish -t:PubilshContainer
```

- 관련 공식 문서 : <https://learn.microsoft.com/ko-kr/dotnet/core/docker/publish-as-container?pivots=dotnet-8-0>

::: details gradle의 예

샘플 예시 : <https://github.com/gorohoroh/getting-started-building-docker-images-with-gradle>

Java의 Gradle에서는 task로 `Dockerfile`을 정의하고 빌드하는 과정을 구성하도록 되어있었다. 마치 파이프라인을 구성하는 느낌이다.

```gradle
task createDockerFile(type: Dockerfile) {
    from 'openjdk:8-jre-alpine'
    copyFile jar.archiveFileName.get(), '/app/test_service.jar'
    entryPoint 'java'
    defaultCommand '-jar', '/app/test_service.jar'
    exposePort 8080
}

task syncJar(type: Copy) {
    dependsOn assemble
    from jar.destinationDirectory
    into "$buildDir/docker"
}

task buildImage(type: DockerBuildImage) {
    dependsOn createDockerFile, syncJar
    inputDir = createDockerFile.getDestDir()
    images = ["yourdockerhubusername/tuneit-gradle-docker:1.0"]
}
```

```bash
gradlew buildImage
```

:::

### 3.4 여러 앱을 동시에 자동으로 빌드하고 실행하기 - .NET Aspire

Java, Python, JavaScript 앱을 배포할 수 있고, Kubernetes로 배포할 수 있는 도구이다. 관측용이성과 회복탄력성을 제공하고, 서비스 디스커버리를 위한 커넥션 스트링을 자동생성 해준다.

세션간 데모와 유사한 설명이 `.NetDev`에 올라와 있었다.

- [.NET Aspire: .NET 8을 통한 클라우드 네이티브 개발 간소화](https://forum.dotnetdev.kr/t/net-aspire-net-8/8949)

`Open Telemetry`가 기본 제공되어 내부 API 설계에 유용해보였다.

![](https://learn.microsoft.com/en-us/dotnet/aspire/docs/fundamentals/dashboard/media/explore/trace.png)

Kubernetes같은 컨테이너 플랫폼이 알려지면서 컨테이너의 필요성과 관심은 증가했지만, 컨테이너를 지원하는 플랫폼이 시장에 나온 시기에 비해 실제 앱이 컨테이너 화 되는 과정이 늦다보니 플랫폼과 애플리케이션간의 간극이 컷던것 같다. 이같은 현상은 필요에 의한 플랫폼 이기보다는, 플랫폼의 도입을 위한 개발 환경의 변화를 요구하다보니 생기는 갈등을 초래했다고 보여진다.

지금은 컨테이너에 대한 인식이 일반화되고 있는 추세라 보여진다. 개발자 플랫폼이나 도구들도 컨테이너화를 위한 편의성을 제공하면서, 점차 개발자가 앱을 컨테이너화 하는데의 장애물을 낮추는 작업들이 반복되면, 언젠가는 컨테이너가 일반적인 배포 형태의 하나로 자리잡게될 것으로 보여진다.

## 4. NHN Cloud 오픈스택, CentOS에서 Ubuntu로 이사하기 (11:30)

> 2014년 NHN Cloud IaaS가 세상에 처음 나올 때는 CentOS기반의 OpenStack으로 구축하였습니다.
> 그리고 2019년 NHN Cloud IaaS는 새로운 환경 대응을 위해 CentOS 기반의 환경에서 Ubuntu로 이전하는 작업을 완료하였습니다.
> Ubuntu로 전환 후 4년 동안 우리는 어떤 경험을 하였을까요? CentOS에서 Ubuntu로 전환하면서 어떤 도전과제들이 있었을까요?
>
> 이 발표에서는 OpenStack 환경을 CentOS에서 Ubuntu로 전환하며 겪은 모든 이야기를 다룹니다.
>
> - 운영환경을 Ubuntu로 전환한 이유
> - Ubuntu private repository 구축 및 운영
> - OpenStack 컴포넌트 자체 패키징 전략
> - Ubuntu 환경 운영 중 발생한 문제 공유
> - Ubuntu 저장소를 직접 구축하고 관리하고 싶으신 분, 파이썬 소스코드를 데비안 패키징을 통해 apt 로 설치하도록 만들어보고 싶으신 분이라면 이 발표가 많은 도움이 될 것입니다.

> Speaker : Seongsoo Cho, Wonkyu Choi

### 4.1 내부 패키지 저장소

2019년 CentOS를 기반으로 구축되었던 초기 NHN 클라우드는, `CentOS 7.x`에서 `Ubuntu 18.0.4`로 의 전환과정을 수행하였다. Ubuntu로의 전환 이유 몇가지는 다음과 같다.

- CentOS의 EOL
- OpenStack과의 호환성
- 기존 Yum Package와 Pip 관리 이원화를 개선

추후 `Ubuntu 20.0.4`가 출시되면서 추가적으로 검토 및 마이그레이션이 필요했던 작업 중에서 일부 리스트로 관리되던 구성이 yaml로 변경되는 상황도 있었다.

1. Netplan의 네트워크 설정 파일 - `Ubuntu 18.04`에서는 네트워크 인터페이스를 설정하는 데 `Netplan`이 도입되었으며, 이전의 방식인 /etc/network/interfaces 파일을 사용하는 경우도 있었다. `Ubuntu 20.04`에서도 Netplan이 계속 사용되며, 설정 파일은 `/etc/netplan/` 디렉토리에 `YAML` 형식으로 저장된다.

2. APT 패키지 관리 - 일부 경우에 특정 패키지나 설정에 대해 YAML 형식의 파일이 필요할 수 있다.

3. Snap 패키지 - `Ubuntu 20.04`에서는 Snap 패키지 시스템이 더욱 강조되며, Snap 패키지의 메타데이터와 설정 파일 YAML 형식을 사용한다.

개발 패키지를 공개된 패키지들과 분리하기 위해 내부에 별도 미러 저장소를 사용하였는데, 기존 `Pulp`를 사용하였으나 신규 버전인 `Pulp3`에서는 당시 CLI를 지원하지 않아 `Aptly` 를 선택했다고 했다.

- [aptly.info](https://www.aptly.info/)
- [Pulp3 CLI](https://pulpproject.org/pulp-cli/)

### 4.2 unattended-upgrades

내부 저장소에 대해 강조한 이유는 내부에 수많은 서버를 관리하는데 있어 패키지 버전이 다른경우 운영상 부담이 커지는 것이 있었고, 패키지 관리 미흡으로 인해 장애가 발생한 경험이 있어 계속 강조되었다.

![](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/Monosnap%20Untitled%20%7C%20onemodel%202024-08-11%2011-55-11.png)

장애가 발생한 상황을 간단히 정리하면,

1. 의도하지 않게 내부 패키지 저장소가 외부 저장소의 새로운 패키지로 업데이트 되었고,
2. Ubuntu에는 자동으로 패키지를 업그레이드 해주는 기능이 켜져 있었다.
3. 이런 장애는 꼭 새벽에 발생하더라...

이건 마치 이전에 윈도우 서버의 자동 업그레이드가 켜져있어서 재부팅되면서 장애났던 순간을 상기시켜줬다.

- [Unattended upgrade 비활성화](https://ly.lv/128)

## 5. 쉬운 오케스트레이터, 노마드 경험하기 (13:30)

> BM, VM, Cloud, IoT, Edge에 이르기까지 쉽게 적용할 수 있는 HashiCorp Nomad를 경험해 보세요.
> 
> - Nomad 소개
> - Nomad 컨셉과 구조
> - Nomad 아키텍처
> - Nomad 스케줄러 동작
> - Nomad 상호작용 확인
> - Nomad Job & Driver
> - Nomad Cluster
> - Nomad HA
> - Job 예제
> - 실습 참여자 간 클러스터 구성

> Speaker : GyuSeok Lee

> Slide : https://docs.google.com/presentation/d/18H1j4kEqBd-9eYHx0jfbgG4v_plWy0_QkZpS8_wksDE/edit?usp=sharing

Ubuntu 리눅스도 서버환경으로 사용하면, 목적은 그위에 실행되는 애플리케이션을 실행하는것 또한 하나의 목적이므로 쉽게 사용할 수 있는 Nomad의 실습을 포함한 워크샵을 진행하였다.

Nomad를 사용하는 사례를 보면 이미 오케스트레이터를 이해하고 사용해본 경험치가 있는 사용자들이 좀더 쉽고 관리하기 용이한 오케스트레이터로서 Nomad를 찾고 있다는 공통점이 있다.

Nomad의 장점은 다음과 같다.

- 간단한 구성
- 다양한 애플리케이션 실행 형태를 지원
  - Docker / Podman
  - Java
  - Exec(실행 스크립트)
- 스케줄링 지원
  - Service : 지속 실행되는 형태
  - System : 모든 서버에서 하나씩 실행
  - Batch : 실행 후 종료, AWS Lambda 처럼 실행
  - SysBatch : 모든 서버에서 배치를 실행
- 대량의 서버 규모 지원 : 6000대 이상의 테스트된 노드 수
- Edge : 네트워크 단절 상황 지원
- IoT : 가장 적은 오케스트레이션 리소스

## 6. 로봇 소프트웨어 배포 사례 (16:20)

> 현업에서 다양한 로봇 프로젝트들을 수행하면서 개발자로서 겪었던 소프트웨어 업데이트 경험담을 공유합니다. 로봇 통합 시스템을 구축하는데 발생했던 의존성 문제와 최신 버전의 소프트웨어를 배포하고자 할 때 겪었던 문제점을 이야기하고, 이로서 Ubuntu Snap 을 활용하면서 얻을 수 있는 장점에 대해 발표합니다.

> Speakers: Jihyeon Kwon (robot software engineer), Sung Hoon Kim

[클로봇](https://clobot.co.kr) 에서 로봇에 탑재되는 Ubuntu가 탑재된 로봇의 소프트웨어를 관리하기 위한 방안에 대해 설명해주었다. 

### 6.1 로봇 소프트웨어 업데이트 방식

#### 6.1.1	설치자가 직접 로봇 소프트웨어를 업데이트

소스코드를 로봇에서 직접 빌드했던, 가장 단순한 방식이지만 휴먼 에러 발생 가능성이 높고, 현장에 가서 작업하는 상황으로 인력, 시간, 비용측면의 리소스 소모가 심하다.

#### 6.1.2	Debian 패키지로 소스코드를 빌드 및 설치

로봇에서 빌드하지 않고 패키지화하면 설치가 단순해지고 휴먼에러는 줄일 수 있지만 다른 패키지들간의 의존성 문제가 발생하는 상황이 잦다.

#### 6.1.3	로봇 기동 시 OTA(Over-the-air) 서버에 연동하여 업데이트

안정된 업데이트를 제공하지만 소규모인 경우 OTA 서버를 따로 구성하는 비용에 대한 문제가 발생한다. 시스템 사양이 변경되어야 하는 경우에는 새로 개발 및 빌드해야 하는 이슈는 여전히 존재했다.

#### 6.1.4 컨테이너로 구성하여 소프트웨어를 업데이트

현재 가장 많이 활용하고 있는 방식으로, 소프트웨어 의존성 문제를 해결하고 업데이트 소요 시간을 줄일 수 있었다. 하지만 컨테이너의 용량이 커지면서 경량화에 대한 과제가 있다.

#### 6.1.5 Ubuntu Snap 활용 계획

Ubuntu Snap 을 활용하여 로봇 기동 시 자동 업데이트하는 방법을 테스트 하고 있다. Snap은 쉬운 설치 방법과 자동 업데이트를 제공하고 종속성을 관리해준다.

### 6.2 Snap

![](https://res.cloudinary.com/canonical/image/fetch/f_auto,q_auto,fl_sanitize,c_fill,w_5444,h_3062/https://design.canonical.com/wp-content/uploads/3124/snapcraft_db_brandmark@4x.png)

- [Introduction to snaps](https://ubuntu.com/core/services/guide/snaps-intro)

Ubuntu Snap은 Canonical이 개발한 소프트웨어 패키지 형식이자, 애플리케이션 배포 시스템이다. Snap은 주로 Ubuntu에서 사용되지만, 다른 여러 리눅스 배포판에서도 지원된다. Snap Store는 마치 스마트폰의 앱스토어 같아, Snap으로 설치된 애플리케이션을 관리할 수 있다.

- 자급자족 패키지 (Self-contained Packages) : Snap 패키지는 모든 필요한 종속성을 포함하고 있어, 각 Snap이 독립적으로 실행될 수 있다. 이를 통해 시스템 라이브러리의 버전 충돌 없이 소프트웨어를 실행할 수 있다.

- 샌드박싱 및 보안 : Snap 애플리케이션은 샌드박스 환경에서 실행되며, 필요한 권한이 명시적으로 부여되지 않으면 시스템의 다른 부분에 접근할 수 없다. 

- 롤링 업데이트 : Snap 패키지는 자동으로 최신 버전으로 업데이트된다. 개발자는 새로운 버전을 릴리스하면 사용자의 시스템에서 자동으로 업데이트되며, 사용자는 필요에 따라 특정 버전을 고정하거나, 롤백할 수 있다.

- 독립적인 시스템 파일 구조
Snap 애플리케이션은 일반적으로 /snap 디렉토리에 설치되며, 독립된 파일 시스템을 가진다.

## 7. Ubuntu Frame & Ubuntu Core 기반 체크인 키오스크 개발기 (16:20)

> UbuCon Korea 2023의 체크인 키오스크 개발 뒷이야기에 대해 이야기 해 봅니다. 키오스크를 개발을 시작한 계기를 이야기 해 보고, 개발에 활용한 도구인 Ubuntu Frame, Ubuntu Core 그리고 Flutter 등에 대해 이야기 해 보고자 합니다.
> 
> 개발 과정과 함께 Ubuntu Core 환경에 배포하기 위해 Snap 패키징을 하는 과정에 대해서도 이야기 하고, 데스크탑 앱 Snap 패키징과 어떤점이 다른지도 이야기 해 봅니다.

> Speaker: Youngbin Han (Ubuntu Korea Community)

컨퍼런스나 세미나에서 참석자등록을 체크하는 일을 수동으로 한다면 매우 힘든 일일 것이다. Ubuntu core와 Ubuntu Frame을 사용하여 터치 패널이 있는 키오스크를 개발한 이야기가 흥미로웠다.

### 7.1 Ubuntu Core

- [Ubuntu Core](https://ubuntu.com/core)

Ubuntu Core는 Canonical에서 개발한 경량화된 버전의 Ubuntu 운영체제로, 주로 IoT(사물인터넷) 장치와 임베디드 시스템을 위해 설계되었다. Ubuntu Core는 전통적인 Ubuntu와는 달리, 모든 소프트웨어가 Snap 패키지로 배포되고 관리되는 것이 특징입니다. 이를 통해 보다 안정적이고 보안이 강화된 시스템을 제공한다.

기존 Ubuntu와 달리 경량화된 OS이기 때문에 기존 소프트웨어를 사용하지 못하거나 드라이버 호환이 안되는 경우가 있었다고 했다. 또한 활용했던 라즈베리파이 상에서의 디버깅도 네트워크 연결에 제한이 있을 수 있어 방법을 고려해야 한다고 했다.

- [Install Ubuntu Core on a Raspberry Pi](https://ubuntu.com/download/raspberry-pi-core)

### 7.2 Ubuntu Frame

- [Ubuntu Frame](https://ubuntu.com/blog/tag/ubuntu-frame)

Ubuntu Frame에 대해서는 김광연님이 커뮤니티에 기고한 글에 잘 정리되어있다.

- [Ubuntu Frame 처음 만나보기](https://blog.ubuntu-kr.org/2023/02/07/ubuntuframe-recap/)

Ubuntu Frame은 Canonical에서 개발한 그래픽 서버로, 임베디드 장치와 IoT 디스플레이를 위한 경량화된 디스플레이 서버 솔루션이다. Ubuntu Frame은 특히 키오스크, 디지털 사이니지, 정보 단말기 등의 그래픽 애플리케이션을 구동하는 데 최적화되어 있다.

## UbuCon Korea 2024 후기

오래간만의 커뮤니티 행사가 반가울 뿐이다. 여타 상업적인 세미나 행사에 길들여진 터라 미숙한 진행과 문제들이 거슬릴 수는 있으나, 커뮤니티 운영진과 자원봉사자들이 본업 이외의 시간을 쪼개어 이같은 행사를 기획하고 진행한다는 것을 고려한다면 그저 감사할 따름이다.

트랙이 나눠져 있기도 했고 워크샵을 진행하는 역할로도 참여하여 많은 세션을 듣지는 못했지만, 개발과 배포에 대한 여러 고민들과 나름의 해결책을 찾아가는 과정들이 도움이 되었다.

마지막 추첨시간에도 담첨되어 책을 받았는데, 읽어야 할 책이 넘처나는 상황에서 그저 이 상황을 받아들일 수 밖에 없었다.

![](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20240811124726739.png)