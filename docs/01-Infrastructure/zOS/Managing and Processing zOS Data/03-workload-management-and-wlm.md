---
description: 이 글은 z/OS의 Workload Manager(WLM)에 대한 내용으로, WLM의 개념과 작동 방식에 대해 다룹니다.
tag: ["mainframe", "zos", "wlm", "workload-management"]
---

# Workload Management and WLM

## 개요

단일 z/OS 시스템은 동시에 수천 개의 다양한 작업을 실행합니다. 이러한 작업들은 모두 CPU와 같은 리소스를 공유하고 경쟁해야 합니다. z/OS는 이러한 작업들이 리소스를 공유하는 방법을 제어하는 기능을 제공하며, 어떤 작업이 더 많은 리소스를 받고 어떤 작업이 더 적은 리소스를 받을지 결정합니다.

이 모듈에서는 이러한 기능들을 탐구하고, 이들이 어떻게 작동하는지 알아봅니다.

## 학습 목표

이 모듈을 완료한 후, 다음을 수행할 수 있습니다:

- Workload Management(WLM)가 무엇인지, 그리고 리소스를 어떻게 제어하는지 설명할 수 있습니다.
- WLM이 어떻게 작동하는지 설명할 수 있습니다.

## What Is WLM

### Basic Resources Needed

단일 z/OS 시스템 내에서 동시에 실행되는 많은 작업들이 있습니다. 이 중 일부는 시스템을 실행 상태로 유지하는 데 필요한 z/OS 시스템 작업입니다. 다른 작업들은 애플리케이션 프로그램과 그들이 작동하는 데 필요한 환경입니다. 또한 JES와 RACF부터 Db2와 같은 데이터베이스 관리자에 이르기까지 지원 시스템을 위한 작업들도 있습니다.

이러한 모든 작업은 실행되기 위해 세 가지 기본 리소스가 필요합니다:

- **CPU**: 작업을 처리하기 위한 프로세서
- **Memory**: 프로그램과 데이터를 저장하기 위한 메모리
- **I/O**: 디스크, 테이프 등 저장 장치와의 입출력 연결

### Sharing Resources

종종 모든 작업이 동시에 사용할 수 있는 리소스가 충분하지 않을 수 있습니다. 예를 들어:

- 6개의 작업이 CPU를 사용할 준비가 되어 있지만 사용 가능한 CPU는 4개뿐일 수 있습니다.
- 작업들이 100GB의 메모리가 필요하지만 시스템에는 40GB만 설치되어 있을 수 있습니다.
- 5개의 작업이 동시에 같은 디스크 장치에 접근해야 하지만 한 번에 하나만 접근할 수 있을 수 있습니다.

z/OS는 이러한 상황을 처리하는 기능을 제공합니다.

#### CPU 공유

CPU를 사용할 준비가 된 작업이 CPU 수보다 많으면, z/OS는 이러한 작업 중 일부가 자신의 차례를 기다리도록 합니다. 다른 작업들은 CPU에서 실행되며, I/O 작업을 수행하거나 CPU를 해제해야 하는 다른 이유가 있을 때 작업이 완료되면, 다른 작업들이 CPU를 사용할 수 있습니다.

#### Memory 공유

z/OS는 작업이 시스템에 물리적으로 저장된 것보다 더 많은 메모리에 접근할 수 있도록 허용합니다. 이를 `가상 메모리(virtual memory)`라고 합니다. z/OS는 필요에 따라 메모리와 디스크 데이터셋(페이지 데이터셋이라고 함) 또는 플래시 스토리지 간에 메모리를 페이징하거나 스와핑합니다. 이 페이징 또는 스와핑은 백그라운드에서 수행되며, 작업은 이를 인식하지 못하고 단순히 메모리에 접근하는 것으로 인식합니다.

#### I/O 공유

특정 수의 작업만 동시에 디스크 장치에 접근할 수 있습니다. z/OS는 요청을 큐에 넣어서, 너무 많은 작업이 장치에 접근하려고 하면 일부는 다른 작업이 완료될 때까지 대기하게 됩니다.

### Priority Access

모든 컴퓨팅 시스템에서 모든 작업이 동등하지는 않습니다. 일부는 중요하고, 일부는 중요하며, 일부는 중요하지 않습니다.

예를 들어, z/OS 마스터 주소 공간이 작동하지 않으면 z/OS가 중지됩니다. 이것은 중요한 작업입니다. 반면 COBOL 컴파일 배치 작업은 덜 중요할 수 있습니다. CPU를 충분히 얻지 못하더라도 작업을 제출한 프로그래머 외에는 다른 것에 거의 영향을 미치지 않습니다.

따라서 중요한 작업이 필요한 리소스에 우선적으로 접근하는 것이 합리적입니다.

다음 표는 작업 유형별 우선순위를 보여줍니다:

| 우선순위 | 작업 유형 | 예시 |
|---------|---------|------|
| **가장 높음** | z/OS 시스템 작업 | Master, RACF, JES, DFSMS, GRS |
| **높음** | 서브시스템 | CICS, IMS, Db2, IBM MQ |
| **중간** | 중요한 배치 작업 | Production batch, Log archives |
| **낮음** | 중요하지 않은 배치 작업 | Report jobs, Program compiles, Housekeeping |

### Introducing WLM

```text
z/OS Workload Manager (WLM)
```

는 z/OS 관리자가 어떤 작업이 다른 작업보다 더 중요한지 z/OS에 지시하는 데 사용하는 도구입니다. WLM은 z/OS와 함께 무료로 제공되며, WLM 구성에 지정된 대로 리소스를 할당하기 위해 다른 z/OS 내부 기능과 함께 작동합니다.

WLM의 주요 기능:

- **I/O, 메모리, CPU 공유 관리**: 여러 작업 간 리소스 공유를 조정합니다.
- **중요한 작업 우선순위 지정**: 중요한 작업이 리소스에 우선적으로 접근할 수 있도록 합니다.
- **관리자가 작업 중요도 지정 가능**: 관리자가 어떤 작업이 더 중요한지 구성할 수 있습니다.

따라서 중요한 작업은 CPU, 메모리, I/O에 우선적으로 접근할 수 있습니다.

### A Dispatchable Unit

지금까지 이 모듈에서 "작업(task)"이라는 용어를 사용했습니다. 이것이 의미하는 것은 `디스패치 가능한 단위(Dispatchable Unit, DU)` 또는 간단히 디스패치 가능한 단위로, 개별 작업 단위입니다. 이것은 단일 프로그램일 수도 있고, 순차적으로 하나씩 실행되는 여러 프로그램일 수도 있습니다.

각 DU는 메모리, 잠금(lock), 기타 리소스를 소유할 수 있으며, 다른 작업과 독립적으로 동시에 작동할 수 있습니다.

UNIX 용어로, DU는 스레드(thread)로 생각할 수 있습니다.

### An Address Space

DU(디스패치 가능한 단위)는 `주소 공간(address space)` 내에서 실행됩니다. 주소 공간은 TSO 사용자, 배치 작업, z/OS UNIX 프로세스 또는 시작된 작업(started task)일 수 있습니다.

각 주소 공간 내에서 일반적으로 많은 DU가 실행됩니다. 주소 공간 내의 작업은 메모리 및 기타 리소스를 공유할 수 있습니다.

WLM은 DU 수준이 아닌 주소 공간 수준에서 일부 우선순위 지정을 수행합니다.

예를 들어, 하나의 CICS 영역에는 동시에 실행되는 많은 사용자 애플리케이션 프로그램이 있을 수 있습니다. WLM은 CICS 영역에 대한 우선순위 지정 작업을 수행할 수 있으며, 이는 해당 영역 내의 모든 DU에 적용됩니다.

WLM이 허용하고 충분한 CPU가 있는 경우, 단일 주소 공간 내의 여러 DU가 동시에 실행될 수 있습니다.

### An Enclave

최근에는 워크로드가 하나 이상의 DU에서 작동하기 시작했습니다. 예를 들어, 외부(비메인프레임) 소스에서 들어오는 Db2 요청은 Db2 분산 데이터 시설(Distributed Data Facility, DDF) 주소 공간을 통해 들어옵니다. 이 요청이 저장 프로시저를 실행하면, 이 저장 프로시저는 다른 주소 공간에서 실행됩니다.

`인클레이브(enclave)`라는 z/OS 리소스가 이러한 DU를 관리하는 데 사용됩니다. WLM은 주소 공간에 대해 일반적으로 수행하는 우선순위 지정을 인클레이브에 대해 수행합니다. 인클레이브에는 이 모듈의 뒷부분에서 발견할 다른 장점들도 있습니다.

인클레이브의 사용 예시:

- **Db2**: 외부 요청과 저장 프로시저가 여러 주소 공간에 걸쳐 실행될 때
- **WebSphere Application Server**: 여러 주소 공간에 걸친 웹 애플리케이션 처리
- **IBM MQ**: 메시지 처리 작업

권한이 있는 모든 프로그램이 인클레이브에서 실행되도록 설정할 수 있지만, 대부분의 작업은 계속해서 단일 주소 공간 내에서 실행됩니다.

### Share CPU, Memory, and I/O

WLM과 관련 z/OS 기능은 동시에 실행되는 많은 작업, 즉 DU를 관리해야 합니다. 각각은 CPU, 메모리, I/O를 사용하려고 합니다.

그렇다면 z/OS는 각 DU에 우선순위를 어떻게 설정할까요?

### Dispatching Priority

모든 주소 공간 또는 인클레이브는 WLM에 의해 할당되는 `디스패칭 우선순위(dispatching priority)`를 가집니다. 이 디스패칭 우선순위는 0부터 255까지의 숫자입니다.

이 디스패칭 우선순위는 해당 주소 공간 또는 인클레이브 내의 모든 DU에 할당됩니다. 이에 대한 몇 가지 예외가 있으며, 이는 곧 다루어질 것입니다.

디스패칭 우선순위가 높을수록 CPU를 사용할 준비가 된 작업이 대기 없이 해당 CPU에 디스패치될 가능성이 높아집니다. 이것이 z/OS가 CPU를 관리하는 방식입니다.

예를 들어:
- 우선순위 240의 주소 공간은 우선순위 221의 인클레이브보다 CPU에 더 빨리 디스패치됩니다.
- 주소 공간 내의 모든 DU는 해당 주소 공간의 디스패칭 우선순위를 상속받습니다.

### TCB and SRB

지금까지 "작업"과 "DU"라는 용어를 서로 바꿔서 사용했습니다. 그러나 두 가지 유형의 DU가 있습니다:

- **작업(Tasks)**: 때로는 `TCB(Task Control Block)`라고도 불립니다.
  - 일반 작업을 포함한 대부분의 작업이 작업으로 실행됩니다.
- **서비스 요청(Service Requests)**: 때로는 `SRB(Service Request Block)`라고도 불립니다.
  - 시스템 서비스 및 인클레이브 내에서 실행되는 모든 작업에 사용됩니다.

일부 서비스 요청은 작업보다 먼저 실행되도록 구성할 수 있으며, 이는 디스패칭 우선순위 규칙을 효과적으로 무시합니다.

### Viewing Dispatching Priority

`SDSF DA(Display Active)` 화면을 사용하여 주소 공간의 디스패칭 우선순위를 확인할 수 있습니다.

SDSF DA 화면에서:
- **DP(Dispatching Priority)**: 16진수 형식으로 디스패칭 우선순위를 표시하는 열
- 예: `x'FF'` = 255 (최고 우선순위)
- 예: `x'F4'` = 244

각 주소 공간의 현재 디스패칭 우선순위를 실시간으로 모니터링할 수 있습니다.

### I/O Priority

작업에는 디스패칭 우선순위와 유사하게 `I/O 우선순위`가 할당될 수 있습니다. I/O 우선순위가 높은 작업은 디스크 및 테이프와 같은 I/O 장치에 우선적으로 접근할 수 있습니다.

I/O 우선순위가 활성화되어 있으면 기본적으로 디스패칭 우선순위와 동일합니다. 그러나 Workload Manager(WLM)는 디스패칭 우선순위와 별도로 워크로드를 별도의 I/O 우선순위 그룹에 할당하도록 구성할 수 있습니다.

WLM I/O 우선순위는 SDSF 화면을 통해 확인할 수 있습니다. 특히 **SDSF ENCLAVES** 화면은 인클레이브를 표시하는 데 사용되며, 여기서 I/O 우선순위 그룹(IOPrioGrp)을 확인할 수 있습니다.

### Controlling Memory

WLM은 CPU와 I/O에 대해 제공하는 것과 동일한 우선순위 지정을 메모리에 대해 제공하지 않습니다. 그러나 스토리지 접근이 중요한 워크로드는 태그를 지정할 수 있습니다. z/OS는 이러한 워크로드가 있는 주소 공간의 메모리를 절대적으로 필요한 경우가 아니면 스왑 아웃하지 않습니다.

`주소 공간(Address Space)`:
- 스토리지: 중요하지 않음
- 스왑 아웃 가능

`인클레이브(Enclave)`:
- 스토리지: 중요함
- 스왑 아웃하지 않음

인클레이브는 일반적으로 중요한 워크로드를 나타내므로 메모리가 스왑 아웃되지 않도록 보호됩니다.

### AI Infused WLM

z/OS 3.1부터 IBM의 목표는 인공 지능(AI) 솔루션으로 WLM을 개선하고 구축하여 IBM Z 워크로드를 예측할 수 있게 하는 것입니다. z/OS 3.2에서는 AI 기반 WLM 기능이 더욱 강화되어 z17의 Telum II 프로세서와 IBM Z 통합 AI 가속기를 활용한 실시간 AI 인사이트 제공이 가능합니다.

`현재 WLM (반응형)`:
- 현재 WLM은 워크로드가 나타날 때 반응하여 필요에 따라 리소스를 할당합니다.
- 워크로드 처리가 최적화되기까지 시간이 걸릴 수 있습니다.

`AI 기반 WLM (예측형)`:
- AI가 WLM을 지원하면 AI를 사용하여 워크로드가 도착하기 전에 필요한 리소스를 사전에 시작할 수 있습니다.
- 예를 들어, 배치 작업이 특정 시간에 제출될 것으로 예측되면, AI 기반 WLM 시스템은 필요한 초기화 프로그램(initiator) 리소스를 미리 사용할 수 있도록 준비합니다.

이를 통해 워크로드 처리가 더 빠르고 효율적으로 최적화됩니다.

### Summary

이 섹션에서 다음을 확인했습니다:

- z/OS Workload Manager(WLM)는 DU 간 CPU와 I/O 공유를 제어하는 z/OS 구성 요소입니다. z/OS 관리자는 더 중요하거나 덜 중요한 작업을 식별할 수 있습니다.
- WLM은 더 중요한 작업에 우선순위를 부여합니다: CPU, I/O에 우선 접근하고 스왑 아웃되지 않습니다.
- 다음 섹션에서는 WLM이 어떻게 작동하는지 살펴봅니다.

## How WLM Works

### Interfaces

WLM은 z/OS 관리자가 필요한 WLM 구성을 정의할 수 있도록 사용자 인터페이스를 제공합니다.

**전통적인 인터페이스:**
- **ISPF (Interactive System Productivity Facility)**: 전통적으로 z/OS 관리자가 사용하는 인터페이스
- **배치 인터페이스**: 스크립트나 자동화된 방식으로 WLM 구성을 정의

**현대적인 인터페이스:**
- `z/OS Management Facility`: 오늘날 많은 관리자들이 사용하는 그래픽 사용자 인터페이스(GUI)

WLM 구성 메뉴에는 다음 옵션들이 포함됩니다:
1. Policies (정책)
2. Workloads (워크로드)
3. Resource Groups (리소스 그룹)
4. Service Classes (서비스 클래스)
5. Classification Groups (분류 그룹)
6. Classification Rules (분류 규칙)
7. Report Classes (리포트 클래스)
8. Service Definition Options (서비스 정의 옵션)
9. Application Environments (애플리케이션 환경)
10. Scheduling Environments (스케줄링 환경)
11. Guest Platform Mgmt Provider (게스트 플랫폼 관리 제공자)
12. Tenant Resource Groups (테넌트 리소스 그룹)
13. Tenant Report Classes (테넌트 리포트 클래스)

### Service Classes

WLM과 z/OS가 워크로드 우선순위 지정을 시작하기 전에, 먼저 WLM에 어떤 워크로드가 더 중요하고 어떤 것이 덜 중요한지 알려줘야 합니다. 예를 들어, 중요한 CICS 트랜잭션과 덜 중요한 CICS 트랜잭션 두 가지 유형이 있다고 결정할 수 있습니다.

**서비스 클래스 정의:**
첫 번째 단계는 워크로드를 `서비스 클래스(Service Classes)`로 나누는 것입니다. z/OS 관리자는 서비스 클래스에 대해 최대 8자 길이의 임의의 이름을 선택할 수 있습니다.

예를 들어, CICS 트랜잭션에 대해 두 개의 서비스 클래스를 가질 수 있습니다:
- `CICSHIGH`: 중요한 CICS 트랜잭션
- `CICSLO`: 덜 중요한 CICS 트랜잭션

**서비스 클래스 제한:**
- 최대 100개의 서비스 클래스를 정의할 수 있습니다.
- 그러나 WLM이 최적으로 작동하려면, 대부분의 사이트에서 30개 이상의 서비스 클래스를 사용하지 않습니다.

서비스 클래스는 워크로드 유형(배치, CICS, DB2, 시작된 작업, TSO 등)에 따라 그룹화될 수 있습니다.

### Classification Rules

서비스 클래스를 생성한 후, WLM에 각 워크로드가 어떤 클래스에 속하는지 알려줘야 합니다. 일반적으로 CICS 트랜잭션 이름이나 배치 작업 이름과 같은 워크로드 이름이 지정됩니다. 그러나 사용자 ID부터 Db2 플랜 이름에 이르기까지 다른 정보도 사용할 수 있습니다.

**분류 규칙 구성 요소:**
- **Qualifier type**: 분류 기준 유형 (예: SI=Subsystem Instance, TN=Transaction Name)
- **Qualifier name**: 실제 워크로드 이름 또는 식별자
- **Service Class**: 할당할 서비스 클래스
- **Report Class**: 보고용 클래스 (선택적)

**단계별 규칙 해석:**

::: tabs

@tab 1단계: 기본 설정

```text:line-numbers {1-5}
SUBSYSTEM TYPE CICS
Last Updated by User ADMIN001 on 2023/11/16 at 14:53:22
Classification:
Default Service Class is CICSLO
Default Report Class is CICSLO

# Qualifier type Qualifier name Starting position Service Class Report Class
1 SI            PRDCICS1                    CICSHI         CICSHI
2 . TN          TXN1                        CICSVH        CICSVH
2 . TN          TXN2                        CICSVH        CICSVH
2 . TN          TXN3                        CICSVH        CICSVH
1 SI            PRDCICS2                    CICSHI         CICSHI
1 SI            PRDCICS3                    CICSHI         CICSHI
```

**설명:**
- **라인 1**: 서브시스템 유형이 CICS임을 지정합니다.
- **라인 4-5**: 기본 서비스 클래스와 리포트 클래스를 `CICSLO`로 설정합니다. 이는 규칙이 일치하지 않을 때 사용되는 기본값입니다.
- 이 기본 설정은 모든 CICS 워크로드에 적용되며, 특정 규칙이 없을 때 사용됩니다.
- 라인 번호가 표시되어 강조된 부분을 쉽게 확인할 수 있습니다.

@tab 2단계: 프로덕션 CICS 영역 규칙

```text:line-numbers {8}
SUBSYSTEM TYPE CICS
Last Updated by User ADMIN001 on 2023/11/16 at 14:53:22
Classification:
Default Service Class is CICSLO
Default Report Class is CICSLO

# Qualifier type Qualifier name Starting position Service Class Report Class
1 SI            PRDCICS1                    CICSHI         CICSHI
2 . TN          TXN1                        CICSVH        CICSVH
2 . TN          TXN2                        CICSVH        CICSVH
2 . TN          TXN3                        CICSVH        CICSVH
1 SI            PRDCICS2                    CICSHI         CICSHI
1 SI            PRDCICS3                    CICSHI         CICSHI
```

**설명:**
- **라인 8**: CICS 영역 `PRDCICS1`은 서비스 클래스 `CICSHI`를 사용합니다.
- `SI`는 `Subsystem Instance`를 의미하며, CICS 영역 이름을 지정합니다.
- 이 규칙은 `PRDCICS1` 영역의 모든 트랜잭션에 기본적으로 적용됩니다.
- 프로덕션 환경의 중요한 CICS 영역에 높은 우선순위를 부여하는 예시입니다.
- 라인 8이 강조되어 해당 규칙을 쉽게 확인할 수 있습니다.

@tab 3단계: 특정 트랜잭션 우선순위 규칙

```text:line-numbers {9-11}
SUBSYSTEM TYPE CICS
Last Updated by User ADMIN001 on 2023/11/16 at 14:53:22
Classification:
Default Service Class is CICSLO
Default Report Class is CICSLO

# Qualifier type Qualifier name Starting position Service Class Report Class
1 SI            PRDCICS1                    CICSHI         CICSHI
2 . TN          TXN1                        CICSVH        CICSVH
2 . TN          TXN2                        CICSVH        CICSVH
2 . TN          TXN3                        CICSVH        CICSVH
1 SI            PRDCICS2                    CICSHI         CICSHI
1 SI            PRDCICS3                    CICSHI         CICSHI
```

**설명:**
- **라인 9-11**: `PRDCICS1` 내의 트랜잭션 `TXN1`, `TXN2`, `TXN3`은 더 높은 우선순위인 `CICSVH` 서비스 클래스를 사용합니다.
- `TN`은 `Transaction Name`을 의미합니다.
- 앞의 `.`는 이 규칙이 상위 규칙(라인 8의 PRDCICS1)에 대한 `하위 규칙`임을 나타냅니다.
- 하위 규칙은 상위 규칙을 `오버라이드`합니다. 즉, `PRDCICS1` 영역의 기본 클래스는 `CICSHI`이지만, `TXN2` 트랜잭션은 `CICSVH`를 사용합니다.
- 이를 통해 특정 중요한 트랜잭션에 더 높은 우선순위를 부여할 수 있습니다.
- 라인 9-11이 강조되어 하위 규칙을 쉽게 확인할 수 있습니다.

@tab 4단계: 다른 프로덕션 CICS 영역 규칙

```text:line-numbers {12-13}
SUBSYSTEM TYPE CICS
Last Updated by User ADMIN001 on 2023/11/16 at 14:53:22
Classification:
Default Service Class is CICSLO
Default Report Class is CICSLO

# Qualifier type Qualifier name Starting position Service Class Report Class
1 SI            PRDCICS1                    CICSHI         CICSHI
2 . TN          TXN1                        CICSVH        CICSVH
2 . TN          TXN2                        CICSVH        CICSVH
2 . TN          TXN3                        CICSVH        CICSVH
1 SI            PRDCICS2                    CICSHI         CICSHI
1 SI            PRDCICS3                    CICSHI         CICSHI
```

**설명:**
- **라인 12-13**: CICS 영역 `PRDCICS2`와 `PRDCICS3`은 `CICSHI` 서비스 클래스를 사용합니다.
- 이 영역들에는 특정 트랜잭션에 대한 하위 규칙이 없으므로, 모든 트랜잭션이 `CICSHI`를 사용합니다.
- 여러 프로덕션 CICS 영역에 동일한 우선순위를 적용하는 예시입니다.
- 라인 12-13이 강조되어 다른 프로덕션 영역 규칙을 쉽게 확인할 수 있습니다.

:::

**규칙 적용 순서:**
1. WLM은 먼저 가장 구체적인 규칙(하위 규칙)을 확인합니다.
2. 일치하는 하위 규칙이 없으면 상위 규칙을 확인합니다.
3. 일치하는 규칙이 없으면 기본 서비스 클래스(`CICSLO`)를 사용합니다.

**중첩 규칙의 장점:**
- 상위 규칙으로 전체 영역에 대한 기본 클래스를 설정할 수 있습니다.
- 하위 규칙으로 특정 트랜잭션이나 작업에 대해 더 높은 우선순위를 부여할 수 있습니다.
- 이를 통해 세밀한 워크로드 관리가 가능합니다.

### Goals

WLM은 목표 지향 워크로드 관리 시스템으로 작동합니다. 각 서비스 클래스에 대해 원하는 성능을 WLM에 알려줘야 합니다.

**목표 설정 예시:**
예를 들어, 다음과 같은 성능 목표를 설정할 수 있습니다:

1. 프로덕션 IMS 트랜잭션이 1초 이내에 완료
2. 개발 IMS 트랜잭션이 2초 이내에 완료
3. 프로덕션 배치가 대부분의 시간 동안 실행 중(대기하지 않음)
4. 개발 배치는 더 오래 대기할 수 있음
5. 프로덕션 CICS 트랜잭션이 1초 이내에 완료
6. 개발 CICS 트랜잭션이 2초 이내에 완료
7. IBM MQ가 프로덕션 배치보다 중요하지만 CICS보다는 덜 중요

**목표 유형:**
- **응답 목표(Response Goals)**: 트랜잭션 기반 워크로드용 (CICS, IMS 등)
- **속도 목표(Velocity Goals)**: 장기 실행 워크로드용 (배치 작업, 시작된 작업 등)

예를 들어, IMS 트랜잭션이 1초 이내에 완료되기를 원하거나, 배치 작업이 CPU나 I/O와 같은 리소스를 기다리는 시간보다 처리하는 시간이 더 많기를 원할 수 있습니다.

### Response Goals

트랜잭션 기반 워크로드(예: CICS 또는 IMS 트랜잭션)는 `응답 목표(response goal)`를 지정할 수 있습니다. 이는 트랜잭션이 얼마나 빨리 완료되기를 원하는지를 나타냅니다.

이러한 목표는 많은 서비스 수준 계약(SLA)과 유사한 방식으로 지정되며, 이것이 아이디어입니다.

**응답 목표 예시:**

```text
* Service Class CICSHI - High Importance CICS Transactions
Last Updated by User ADMIN002 on 2023/11/17 at 13:51:22

Base goal:
  CPU Critical = NO
  Honor Priority = DEFAULT
  I/O Priority Group = NORMAL

# Duration Imp Goal description
1         2   80% completed within 00:00:02.00
```

이 예시에서:
- **서비스 클래스**: `CICSHI` (High Importance CICS Transactions)
- **목표**: 이 서비스 클래스의 CICS 트랜잭션 중 80%가 2초 이내에 완료되어야 함
- **중요도(Importance)**: 2

응답 목표는 일반적으로 백분율과 시간으로 표현됩니다 (예: "80% completed within 2 seconds").

### Velocity Goals

일부 워크로드는 응답 시간 목표를 가질 수 없습니다. 예를 들어, 배치 작업이나 시작된 작업과 같은 장기 실행 워크로드의 경우입니다.

이러한 워크로드에 대해서는 `속도 목표(velocity goal)`를 정의합니다. 속도는 기본적으로 워크로드가 실제로 작업을 수행하는 시간의 백분율이며, 총 경과 시간(작업 수행 시간 + 리소스 대기 시간)과 비교됩니다. 백분율로 지정됩니다.

**속도 목표 예시:**

```text
* Service Class STCDFLT - Default Started Task
Last Updated by User ADMIN004 on 2023/11/18 at 09:21:12

Base goal:
  CPU Critical = N
  Honor Priority = DEFAULT
  I/O Priority Group = NORMAL

# Duration Imp Goal description
1         2   Execution Velocity of 40
```

**속도 계산 공식:**

$$
\text{Execution Velocity} = \left( \frac{\text{Time Active}}{\text{Total Time}} \right) \times 100 \%
$$

$$
\text{Total Time} = \text{Time Active} + \text{Time Waiting}
$$


이 예시에서:
- **서비스 클래스**: `STCDFLT` (Default Started Task)
- **목표**: 최소 40%의 시간 동안 실행되어야 함 (CPU나 I/O와 같은 리소스를 기다리지 않고)
- **중요도**: 2

즉, 이 워크로드는 총 시간의 최소 40% 동안 실제로 작업을 수행해야 합니다.

### Importance

각 서비스 클래스가 목표를 달성하는 것이 얼마나 중요한지 WLM에 알려줘야 합니다.

예를 들어, 프로덕션 WebSphere Application Server 작업이 클라이언트에게 중요할 수 있지만, CICS 시스템은 백오피스 작업용이며 덜 중요할 수 있습니다.

**중요도 할당:**
모든 서비스 클래스가 목표를 달성할 수 없는 경우(예: CPU가 충분하지 않은 경우), WLM은 더 중요한 작업의 목표를 만족시키려고 시도합니다.

각 서비스 클래스에 `중요도(Importance)` 번호를 할당할 수 있습니다. 이것은 1(매우 중요)부터 5(중요하지 않음)까지의 숫자입니다.

**중요도 수준:**

| 중요도 | 설명 |
|--------|------|
| 1 | Very High (매우 높음) |
| 2 | High (높음) |
| 3 | Medium (중간) |
| 4 | Low (낮음) |
| 5 | Very Low (매우 낮음) |

**중요도 예시:**

```text
* Service Class STCDFLT - Default Started Task
Last Updated by User ADMIN004 on 2023/11/18 at 09:21:12

Base goal:
  CPU Critical = N
  Honor Priority = DEFAULT
  I/O Priority Group = NORMAL

# Duration Imp Goal description
1         2   Execution Velocity of 40
```

이 예시에서:
- **서비스 클래스**: `STCDFLT`
- **중요도(Imp)**: 2 (높음)

리소스가 제한적일 때, WLM은 중요도가 높은 워크로드의 목표를 먼저 달성하려고 합니다.

### Discretionary Workloads

모든 사이트에는 덜 중요한 작업이 있습니다. 이것은 수행되어야 하지만, 언제 또는 얼마나 걸리는지는 중요하지 않습니다. 예를 들어, 디스크 조각 모음과 같은 하우스키핑 작업이 있습니다.

이러한 워크로드는 `재량 목표(discretionary goal)`를 할당할 수 있습니다. 이것은 실제 목표가 아닙니다. 오히려 이것은 WLM에 이러한 워크로드가 다른 더 높은 우선순위 작업이 리소스를 필요로 하지 않는 경우에만 리소스를 받아야 한다고 알려줍니다.

**재량 워크로드 예시:**

```text
* Service Class BATDISC - Discretionary Batch
Last Updated by User ADMIN004 on 2023/11/18 at 09:24:35

Base goal:
  CPU Critical = N
  Honor Priority = DEFAULT
  I/O Priority Group = NORMAL

# Duration Imp Goal description
1         -   Discretionary
```

**재량 워크로드 특징:**
- **서비스 클래스**: `BATDISC` (Discretionary Batch)
- **목표**: `Discretionary` (재량)
- **중요도**: 재량 기간은 중요도 값이 없습니다. 더 중요한 작업이 필요로 하지 않는 경우에만 리소스가 할당되기 때문입니다.

재량 워크로드는 다른 모든 워크로드가 목표를 달성한 후에만 리소스를 받습니다.

### Periods

일부 경우에는 시간에 따라 워크로드의 목표를 변경하고 싶을 수 있습니다. 예를 들어, 작은 배치 작업에 긴 배치 작업보다 높은 우선순위를 주고 싶을 수 있습니다.

서비스 클래스 정의에서 `성능 기간(performance periods)`을 사용하여 이를 수행할 수 있습니다.

**기간 예시:**

```text
* Service Class TSOPRD - TSO Production

Base goal:
  CPU Critical = NO
  Honor Priority = DEFAULT
  I/O Priority Group = NORMAL

# Duration Imp Goal description
1  1000    2  Execution velocity of 70
2  2000    2  Execution velocity of 50
3         3  Execution velocity of 30
```

이 예시에서 모든 TSO 명령은 다음을 가집니다:

- **기간 1**: 처음 1000 서비스 유닛 동안 속도 70% 및 중요도 값 2
- **기간 2**: 다음 2000 서비스 유닛 동안 속도 50% 및 중요도 값 2
- **기간 3**: 나머지 시간 동안 속도 30% 및 중요도 값 3

**기간 구성 요소:**
- **Period (#)**: 기간 번호 (1이 첫 번째)
- **Duration**: 서비스 유닛 단위의 기간 길이
- **Importance (Imp)**: 각 기간의 중요도
- **Goal description**: 각 기간의 목표

**기간 제한:**
서비스 클래스는 최대 8개의 성능 기간을 가질 수 있습니다.

이를 통해 짧은 작업에 높은 우선순위를 주고, 긴 작업에는 시간이 지남에 따라 낮은 우선순위를 줄 수 있습니다.

### I/O Goals

이미 I/O 우선순위가 기본적으로 디스패칭 우선순위와 동일하다는 것을 확인했습니다. 그러나 사이트는 I/O 우선순위를 디스패칭 우선순위와 분리하고, 서비스 클래스 정의에서 서비스 클래스에 `I/O 우선순위 그룹`을 할당하도록 선택할 수 있습니다.

**I/O 우선순위 그룹 예시:**

```text
* Service Class BATDISC - Discretionary Batch
Last Updated by User ADMIN004 on 2023/11/18 at 09:24:35

Base goal:
  CPU Critical = No
  Honor Priority = DEFAULT
  I/O Priority Group = NORMAL

# Duration Imp Goal description
1         -   Discretionary
```

이 예시에서:
- **서비스 클래스**: `BATDISC`
- **I/O Priority Group**: `NORMAL`

I/O 우선순위 그룹을 사용하면 디스패칭 우선순위와 독립적으로 I/O 접근을 관리할 수 있습니다.

### Storage Goals

사이트는 워크로드 분류 규칙을 사용하여 워크로드가 `스토리지 중요(storage critical)`인지 지정할 수 있습니다. 즉, 스왑 아웃될 수 없는지 여부를 지정할 수 있습니다.

**스토리지 중요 설정 예시:**

```text
SUBSYSTEM TYPE CICS
Last Updated by User ADMIN001 on 2023/11/16 at 14:53:22

Attributes:
Qualifier # type Qualifier name Storage Critical Reporting Attribute Manage Region Using Goals Of
1          SI    PRDCICS1       NO              NONE                N/A
1          SI    PRDCICS2       NO              NONE                N/A
1          SI    PRDCICS3       NO              NONE                N/A
```

**스토리지 중요 특징:**
- **Storage Critical = NO**: 이 워크로드는 스토리지가 중요하지 않으며 스왑 아웃될 수 있습니다.
- **Storage Critical = YES**: 이 워크로드는 스토리지가 중요하며 스왑 아웃되지 않아야 합니다.

스토리지 중요 워크로드는 메모리 접근이 중요한 워크로드이며, z/OS는 절대적으로 필요한 경우가 아니면 이러한 주소 공간의 메모리를 스왑 아웃하지 않습니다.

### Donor Receiver

이제 WLM에 다양한 워크로드에 대한 목표를 알려주었습니다. 이제 WLM은 이러한 워크로드 간에 CPU 및 I/O 리소스를 공유해야 합니다. WLM은 `도너-리시버(donor-receiver)` 시스템을 사용하여 이를 수행합니다. 한 워크로드의 접근이 증가하면 다른 워크로드의 접근이 감소합니다.

**도너-리시버 프로세스:**

1. **목표 확인**: WLM은 정기적으로 각 서비스 클래스와 기간의 성능을 확인합니다.

2. **리시버 식별**: 목표를 달성하지 못하는 서비스 클래스와 기간이 있으면, WLM은 수정할 하나를 선택합니다. 이것을 `리시버(receiver)`라고 합니다. WLM은 한 번에 하나의 서비스 클래스와 기간만 수정합니다.

3. **지연 원인 확인**: WLM은 리시버가 지연되는 이유를 결정합니다. WLM이 제어하지 않는 것(예: 테이프 마운트 또는 운영자 응답)으로 인해 지연되면, WLM은 다른 리시버를 찾습니다.

4. **도너 찾기**: WLM은 이제 `도너(donor)`를 찾습니다. 도너는 낮은 중요도의 워크로드이며, 필요한 리소스(이 예시에서는 CPU)를 사용하고 있으며 목표를 초과 달성하고 있습니다.

**도너 선택 규칙:**
WLM은 다음 조건을 만족하는 서비스 클래스와 기간을 도너로 선택하지 않습니다:
- 필요한 리소스를 사용하지 않는 경우
- 최근에 WLM에 의해 변경된 경우

WLM은 낮은 중요도 워크로드를 찾으며, 가능하면 재량 워크로드를 선호합니다.

**리소스 재할당:**
도너는 이제 리시버에게 리소스의 일부를 "줍니다". 정확히 어떻게 작동하는지는 리소스에 따라 다릅니다.

**결과:**
리시버 서비스 클래스 및 기간과 일치하는 모든 DU는 이제 리소스에 대한 향상된 접근을 누립니다.

**반복 프로세스:**
짧은 기간 후, WLM은 프로세스를 다시 시작하고 각 서비스 클래스와 기간이 목표를 달성하고 있는지 확인합니다.

이 프로세스는 지속적으로 반복되어 워크로드가 목표를 달성하도록 합니다.

### Summary

이 섹션에서 WLM이 어떻게 작동하는지, z/OS 관리자가 워크로드를 우선순위 지정하는 방법, 그리고 WLM이 이를 구현하는 방법을 확인했습니다.

**WLM 사용 단계:**

1. **서비스 클래스 설정:**
   - 응답 또는 속도 목표
   - I/O 우선순위 (선택적)
   - 중요도
   - 하나 이상의 기간을 가질 수 있으며, 각 기간은 다른 목표와 중요도를 가짐

2. **워크로드 선택 설정**: 워크로드를 서비스 클래스와 일치시키기 위한 워크로드 선택 규칙 설정

3. **목표 달성 시도**: WLM은 모든 워크로드 목표를 달성하려고 시도합니다. 불가능한 경우, 더 중요한 작업에 대해 이를 수행합니다.

4. **도너-리시버 방법**: WLM은 리소스에 대한 우선순위 접근을 관리하기 위해 도너-리시버 방법을 사용합니다.

WLM은 지속적으로 워크로드 성능을 모니터링하고, 목표를 달성하지 못하는 워크로드에 리소스를 재할당하여 모든 워크로드가 정의된 목표를 달성하도록 합니다.

## 주요 학습 내용

단일 z/OS 시스템은 수천 개의 다양한 작업을 동시에 실행합니다. 이러한 작업들은 모두 리소스를 공유하고 경쟁합니다. z/OS는 이러한 작업들이 리소스를 공유하는 방법을 제어하는 기능을 제공하며, 어떤 작업이 더 많은 리소스를 받고 어떤 작업이 더 적은 리소스를 받을지 결정합니다.

이 단원에서는 이러한 기능들을 탐구하고, 이들이 어떻게 작동하는지 확인했습니다.

- **Workload Management(WLM)가 무엇인지, 그리고 리소스를 어떻게 제어하는지 설명할 수 있습니다.**
  - WLM은 z/OS의 워크로드 관리 구성 요소입니다.
  - WLM은 CPU, I/O, 메모리 리소스에 대한 접근을 제어합니다.
  - 디스패칭 우선순위, I/O 우선순위, 스토리지 중요도 설정을 통해 리소스 접근을 관리합니다.
  - 도너-리시버 시스템을 통해 리소스를 동적으로 재할당합니다.
  - z/OS 3.1부터 AI 기반 WLM 기능이 도입되었으며, z/OS 3.2에서는 z17의 Telum II 프로세서와 IBM Z 통합 AI 가속기를 활용한 실시간 AI 인사이트 제공이 가능합니다.

- **WLM이 어떻게 작동하는지 설명할 수 있습니다.**
  - 서비스 클래스를 정의하여 워크로드를 그룹화합니다.
  - 분류 규칙을 사용하여 워크로드를 서비스 클래스에 매칭합니다.
  - 각 서비스 클래스에 목표(응답 목표, 속도 목표)와 중요도를 설정합니다.
  - 성능 기간을 사용하여 시간에 따라 목표와 중요도를 변경할 수 있습니다.
  - 도너-리시버 메커니즘을 통해 목표를 달성하지 못하는 워크로드에 리소스를 재할당합니다.
  - 더 중요한 워크로드의 목표를 우선적으로 달성하려고 시도합니다.

