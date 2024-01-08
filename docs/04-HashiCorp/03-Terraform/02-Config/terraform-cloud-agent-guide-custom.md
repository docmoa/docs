---
description: TFE/C에서 Terrafor Cloud Agent 구성
tag: ["terraform"]
---

# Terraform Cloud Agent 가이드

Terraform Cloud Agent(Agent)는 Terraform Enterprise/Cloud(TFE/C)에서 사용가능한 사용자 정의 Terraform 실행 환경을 제공합니다. 사용자는 Agent를 사용하여 Terraform 실행을 위해 기본 제공되는 이미지 대신 커스텀 패키지가 설치된 별도 이미지를 사용할 수 있고, 이미지 실행 위치를 네트워크 환경에서 자체 호스팅 할 수 있습니다.

![Monosnap Terraform Agent | onemodel 2024-01-08 14-40-18](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/Monosnap%20Terraform%20Agent%20%7C%20onemodel%202024-01-08%2014-40-18.png)

> [Terraform Cloud Agents](https://developer.hashicorp.com/terraform/cloud-docs/agents)
>
> [Terraform Cloud Agents on TFE](https://developer.hashicorp.com/terraform/enterprise/application-administration/agents-on-tfe)
>
> [Manage private environments with Terraform Cloud agents](https://developer.hashicorp.com/terraform/tutorials/cloud/cloud-agents)



## Terraform Enterprise/Cloud 요구사항

Agent는 Pull 기반이므로 Agent→ TFE/C 로 네트워크 연결이 발생합니다. 실행되는 모든 Agent는 Terraform 작업 수행을 위해 TFE/C를 폴링하고 해당 작업을 로컬에서 실행합니다.

TFE/C의 제약 및 차이는 다음과 같습니다.

|                        | TFE                       | TFC                   |
| ---------------------- | ------------------------- | --------------------- |
| 지원 릴리즈            | v202109-1                 |                       |
| Agent 수 제한          | 제한 없음                 | 계약에 따라 (1/3/10~) |
| TFE/C 호스트 이름 등록 | TFE 호스트 이름 정의 필요 | 기본 app.terraform.io |
| 사용자 정의 번들       | 번들 지원                 | 미지원                |

Agent 실행을 위안 네트워크 요구사항은 다음 대상으로의 Outbound가 허용되어야 합니다.

| 대상(Hostname)                        | 포트/프로토콜  | 용도                                                         |
| :------------------------------------ | :------------- | :----------------------------------------------------------- |
| TFE/C Hostname(e.g. app.terraform.io) | tcp/443, HTTPS | 워크로드 폴링, State 업데이트 제공, TFE/C 프라이빗 모듈 레지스트리에서 프라이빗 모듈 다운로드 |
| registry.terraform.io                 | tcp/443, HTTPS | 공개되어있는 프로바이더 및 모듈 다운로드하기                 |
| releases.hashicorp.com                | tcp/443, HTTPS | Terraform 바이너리 다운로드                                  |
| archivist.terraform.io                | tcp/443, HTTPS | Blob Storage                                                 |



## Terraform Agent 구성 (Custom)

Agent 구성을 위한 단계는 다음과 같습니다. 여기서는 사용자 정의 Agent를 포함하여 단계별로 예를 들어 설명합니다. `Option`은 사용자 정의 단계로, 필요시 진행합니다.

| 단계 | 설명                                                 | 구분         |
| ---- | ---------------------------------------------------- | ------------ |
| 1    | 사용자 정의 Agent 요건 정의 및 요청 (Option)         | TF 실무자    |
| 2    | 사용자 정의 Agent를 생성 및 레지스트리 등록 (Option) | TFE/C 관리자 |
| 3    | VM 또는 K8s에 Agent 실행 환경 구성                   | TFE/C 관리자 |
| 4    | Agent Pool 생성                                      | TFE/C 관리자 |
| 5    | Agent 실행 및 Pool 등록 확인                         | TFE/C 관리자 |
| 6    | Workspace에서 Agent 실행 환경 설정                   | TF 실무자    |



### 1. 사용자 정의 Agent 요건 정의 (Option)

TF 실무자는 TFE/C에서 워크로드 실행시 필요한 추가 요소에 대해 정의하고, TFE/C 관리자에게 사용자 정의 Agent 생성을 요청합니다. 예를 들어 다음의 패키지/실행 요소가 필요하다고 정의 합니다.

- aws cli
- ansible
- jq



### 2. 사용자 정의 Agent를 생성 (Option)

TFE/C 관리자는 사용자 정의 Agent에 대한 요구가 있는 경우 `Dockerfile`을 작성하여 TFE/C에서 사용할 이미지를 생성할 수 있습니다.

- `hashicorp/tfc-agent:latest` 기본 이미지 사용
- sudo 다운로드 및 suders.d 설정
- 패키지 업데이트 및 각종 유틸리티 다운로드
  - aws cli는 공식 가이드를 참고합니다. (https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/getting-started-install.html)
- CA 파일 등록 : 사설인증서 등록
  - cert.crt 파일 사전에 준비
  - 필요시 ICA (Intermediate CA)



```dockerfile
FROM hashicorp/tfc-agent:latest

# Switch the to root user in order to perform privileged actions such as
# installing software.
USER root

# Install sudo. The container runs as a non-root user, but people may rely on
RUN apt-get -y install sudo
# Permit tfc-agent to use sudo apt-get commands.
RUN echo 'tfc-agent ALL=NOPASSWD: /usr/bin/apt-get , /usr/bin/apt' >> /etc/sudoers.d/50-tfc-agent

# the ability to apt-get install things.
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends unzip curl ca-certificates ansible jq python3-pip && wget -qO awscliv2.zip https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip && unzip awscliv2.zip && ./aws/install && rm -rf ./aws && rm -rf /var/lib/apt/lists/*

# Add CA certificates and ca-trust.
ADD cert.crt /usr/local/share/ca-certificates
RUN update-ca-certificates

# Switch back to the tfc-agent user as needed by Terraform agents.
USER tfc-agent
```



다음과 같이 이미지 빌드를 수행합합니다.

```bash
docker build --no-cache -t cumstom.image.host/tfc-agent:v1 .
```



생성된 이미지를 관리하는 이미지 레지스트리에 생성된 이미지를 저장합니다.

```bash
docker push https://cumstom.image.host/hashicorp/tfc-agent:v1
```



### 3. Agent 실행 환경 구성

Agent는 TFE/C에 내장된 기본 실행하는 기본 워커 이미지 대신 사용자 정의로 구성된 워커 이미지를 사용하도록 구성합니다. Agent는 TFE/C에 대한 지속적인 폴링을 수행하는 지속적인 실행 프로세스로 실행됩니다. 오류 발생 시 Agent가 자동으로 재시작 되도록 구성하는 것이 좋습니다.

컨테이너로 실행 되므로 Agent가 실행되기 위한 Docker, Podman 같은 컨테이너 런타임이 구성된 BM/VM 환경, Nomad, 또는 Kubernetes 환경이 필요합니다.

> Terraform Agent Kubernetes Operator : https://developer.hashicorp.com/terraform/tutorials/cloud/cloud-agents



### 4. Agent Pool 생성

Agent를 위한 Pool을 TFE/C에 구성하고, 워크스페이스에서는 이 Pool을 선택하여 작업을 수행합니다. Agent Pool을 생성하려면 TFE/C의 Organazation의 `Settings` 에서 `Agents` 에서 수행합니다.

![image-20240108162153120](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20240108162153120.png)

`Create agent pool`을 선택하여 새로운 `Agent Pool Name`을 입력하고 `Continue`를 클릭합니다.

![image-20240108162258806](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20240108162258806.png)

다음으로 `Token management`에서 `Description`을 입력하고 `Create token` 버튼을 클릭합니다.

![image-20240108163026960](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20240108163026960.png)

Agent Token과 Agent를 실행하기 위한 예제 명령이 표시 됩니다. 생성된 Token은 Agent를 실행하고 구분짓는데 사용됩니다.

![Monosnap Image 2024-01-08 16-36-31](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/Monosnap%20Image%202024-01-08%2016-36-31.png)



### 5. Agent 실행 및 Pool 등록 확인

`agent1.list` 파일이라는 파일을 생성하고 아래 내용을 붙여넣습니다.

```ini
TFC_AGENT_TOKEN=<YOUR TOKEN>
TFC_AGENT_NAME=agent1
```

이전 단계에서 만든 토큰으로 `TFC_AGENT_TOKEN`의 값을 업데이트합니다. Agent의 이름은 `agent1`로 지정합니다. 이 이름은 TFE/C의 Agent 관리 UI와 실행 시 표시되므로 나중에 특정 Agent를 식별할 수 있습니다.



다음과 같이 Agent를 실행합니다. 사용자 정의 Agent 이미지를 사용하는 경우 해당 이미지 주소를 넣어줍니다.

```bash
# 생성한 agent1.list 파일을 환경변수 파일로 지정하는 경우
docker run --env-file agent1.list hashicorp/tfc-agent:latest

# 환경변수를 CLI에 inline으로 지정하는 경우
docker run -e TFC_AGENT_TOKEN -e TFC_AGENT_NAME hashicorp/tfc-agent:latest
```



### 6. Workspace에서 Agent 실행 환경 설정

사용자는 워크스페이스의 설정에서 `General` 항목에서 `Execution Mode`를 `Custom`으로 설정하고, `Agent`에서 해당 워크스페이스가 실행됨을 지정할 수 있습니다. `Agent` 선택 시 앞서 생성된 `Agent pool`의 항목을 설정합니다.

![image-20240108172038279](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20240108172038279.png)

해당 워크스페이스에서 실행시 지정한 Agent에서 실행되는지 확인합니다. 아래 동작은 aws cli, python이 설치된 Agent에서 `local_exec`로 버전을 확인한 결과 입니다.

![img](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/bl2fve.jpg)