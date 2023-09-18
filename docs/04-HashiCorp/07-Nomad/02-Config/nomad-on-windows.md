---
description: Windows에서의 Nomad 구성 예제
tag: ["Nomad", "Windows"]
---

# Nomad on Windows

Nomad를 Windows환경에 구성하고 실행을위해 서비스로 등록하는 방법을 알아봅니다. 솔루션 실행 환경 또는 운영/개발자의 익숙함 정도에 따라 다양한 OS를 선택하여 애플리케이션을 배포하게 됩니다. Nomad를 통해 배포를 위한 오케스트레이터를 Windows 환경에 적용하고 서비스에 등록하여 상시적으로 실행될 수 있도록하는 구성을 안내합니다.

## Port 구성

> 참고 url : [Port used](https://www.nomadproject.io/docs/install/production/requirements#ports-used)

Nomad는 서버와 클라이언트 모드로 나뉩니다. 서버를 위해서는 3 개의 포트가 필요하고 클라이언트에서는 2 개의 포트가 필요합니다. 클라이언트에 배포되는 애플리케이션에서 사용하는 포트를 동적으로 할당하는 영역을 구성합니다.

| 종류     | 기본값     | 프로토콜 | 설명                                                         |
| -------- | ---------- | -------- | ------------------------------------------------------------ |
| HTTP API | 4646       | TCP      | 서버와 클라이언트에서 HTTP API를 제공하는데 사용됩니다.      |
| RPC      | 4647       | TCP      | 서버와 클라이언트간의 내부. RPC 통신 및 서버간 통신에 사용됩니다. |
| Serf WAN | 4648       | TCP/UDP  | 서버간 LAN/WAN 으로 GOSSIP 프로토콜로 사용됩니다.            |
| Dynamic  | 1025–60000 | TCP/UDP  | 클라이언트에서 사용할 동적 포트를 할당합니다.                |

> Windows에서의 동적포트 설명은 다음을 참고합니다. : [Ephemeral_port](https://en.wikipedia.org/wiki/Ephemeral_port)
>
> Windows에서의 동적포트 설정은 다음을 참고합니다. : [default-dynamic-port-range-tcpip-chang](https://docs.microsoft.com/en-us/troubleshoot/windows-server/networking/default-dynamic-port-range-tcpip-chang)



## 디렉토리 구성

디렉토리 구성의 예는 아래와 같습니다.

```bash
└── Nomad
    ├── bin
    ├── config
    └── data
```

- bin : Nomad 실행 바이너리 파일을 다운로드하여 별도 관리하는 경우 활용할 수 있습니다. 시스템 전체에서 사용하는 경우 해당 경로를 `PATH`로 등록 하거나 `C:\WINDOWS\system32\` 의 경로에 바이너리를 위치시키는 방법도 있습니다.
- config : Nomad에서 사용하는 config 파일을 저장하는 위치로 사용합니다.
- data : Nomad가 서버 또는 클라이언트로 사용되는 경우 기록, 저장되는 데이터 저장소로 사용됩니다.



## 설치

> 설치 참고 url : [Install](https://www.nomadproject.io/docs/install)
>
> Dev모드 참고 url : [Get Start](https://learn.hashicorp.com/tutorials/nomad/get-started-run?in=nomad/get-started)

Windows에 설치하는 방식은 수동, Chocolatey, 컴파일 방식을 지원합니다. 여기서는 수동 구성 방법에 대해 설명합니다.

미리 컴파일된 바이너리 파일은 다음의 경로에서 확인할 수 있습니다. 2021년 4월 18일 기준 1.0.4 버전이 최신 버전입니다.

- 다운로드 url : [Releases HashiCorp - Nomad](https://releases.hashicorp.com/nomad/)
  - 오픈소스는 `nomad_<버전>` 으로 표기됩니다.
  - 엔터프라이즈는 `nomad_<버전>+ent` 로 표기됩니다.
- Windows 환경을 위해 미리 컴파일된 바이너리는 32bit/64bit 로 구분됩니다.
  - nomad\_<버전>\_windows\_386.zip - 32bit
  - nomad\_<버전>\_windows\_amd64.zip - 64bit

릴리즈 된 zip을 다운로드 받고 적절한 위치에 압축을 해제 합니다. 위 [디렉토리 구성](#디렉토리-구성) 에서의 예로는 `bin` 디렉토리 아래 위치 시킵니다.

Nomad 버전을 확인하여 바이너리가 정상적으로 실행되는지 확인합니다.

```powershell
PS C:₩hashicorp₩nomad₩bin> ./nomad.exe version
Nomad v1.0.4 (9294f35f9aa8dbb4acb6e85fa88e3e2534a3e41a)
```



Dev 모드로 실행하여 테스트 하는것도 가능합니다.

```powershell
PS C:₩hashicorp₩nomad₩bin> ./nomad agent -dev
==> No configuration files loaded
==> Starting Nomad agent...
==> Nomad agent configuration:

       Advertise Addrs: HTTP: 127.0.0.1:4646; RPC: 127.0.0.1:4647; Serf: 127.0.0.1:4648
            Bind Addrs: HTTP: 127.0.0.1:4646; RPC: 127.0.0.1:4647; Serf: 127.0.0.1:4648
                Client: true
             Log Level: DEBUG
                Region: global (DC: dc1)
                Server: true
               Version: 1.0.4

==> Nomad agent started! Log data will stream in below:
...생략...
```

실행 후 나열된 정보를 사용하여 UI에 접속해봅니다.
![image-20210418110743732](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20210418110743732.png)



## 설정

> 설정 설명 url : [Configuration](https://www.nomadproject.io/docs/configuration)
>
> go_sockaddr_template : [go-sockaddr](https://pkg.go.dev/github.com/hashicorp/go-sockaddr/template?utm_source=godoc)

Nomad 실행시 CLI 상에 설정을 하는 Inline 방식과 설정파일을 지정하는 방식으로 구성이 가능합니다. 여기서는 구성파일을 지정하도록 하는 방식을 설명합니다.

설정 파일을 [디렉토리 구성](#디렉토리-구성)에서 지정한 `config` 디렉토리에 위치 시킵니다. 여기서는 예로 `nomad.hcl` 이라 명명합니다. 테스트를 위한 몇가지 설정요소를 아래에 설명합니다.

[nomad.hcl]

```ruby
datacenter = "dc1"
data_dir   = "C:\\hashicorp\\nomad\\data"
bind_addr  = "0.0.0.0"

advertise {
  //  http = "{{ GetInterfaceIP \"Network 1\" }}"
  rpc  = "{{ GetInterfaceIP \"Network 1\" }}"
  serf = "{{ GetInterfaceIP \"Network 1\" }}"
}

server {
  enabled          = true
  bootstrap_expect = 1
}

client {
  enabled           = true
  network_interface = "Network 2"
  meta {
    subject = "server1"
    purpose = "test,sample"
  }
  options = {
    driver.raw_exec.enable = "1"
  }
}

server_join {
  retry_join = ["{{ GetInterfaceIP \"Network 1\" }}:4647"]
}
```

- datacenter : Nomad의 클러스터는 `datacenter`로 클러스터의 클라이언트들을 그룹화 할 수 있습니다. Nomad에 배포하는 대상으로 지정됩니다. 기본값은 `dc1` 입니다.
- data_dir : Nomad에서 생성하는 데이터 디렉토리 위치를 지정합니다. 위 [디렉토리 구성](#디렉토리-구성)에서 지정한 `data` 디렉토리를 지정하였습니다.
  - Windows 환경에서 디렉토리 구분자는 `\\` 를 사용합니다.
- bind_addr : nomad의 http, rpc, serf가 사용할 기본 ip 주소를 지정합니다. 실행 환경의 모든 IP와 매핑하기 위해 `0.0.0.0` 으로 설정하였습니다.
- advertise : 생략하는 경우  `bind_addr` 값을 상속 받지만, 사용자가 지정한 네트워크 주소를 지정하기 위해 사용됩니다. ip 형식을 사용할 수도 있고 go-sockaddr 템플릿 구성을 사용 가능하기 때문에 템플릿 형태로 지정도 가능합니다. 예제에서는 네트워크 인터페이스에 할당된 IP를 가져오는 방식 입니다. 한글도 지원합니다.
  ```hcl
    {{ GetInterfaceIP \"이더넷 1\" }}
  ```
- server : 서버인 경우에 설정을 구성하는 항목 입니다.
  - enabled : `true`인 경우 서버 모드로 실행됩니다.
  - bootstrap_expect : 서버의 HA를 위해 3중화 또는 5중화 하는 경우 서버의 기대 개수 값을 넣습니다. 여기서는 하나의 Nomad 프로세스가 서버와 클라이언트 역할을 모두 수행합니다.
- client : 클라이언트인 경우에 설정을 구성하는 항목 입니다.
  - enabled : `true`인 경우 클라이언트 모드로 실행됩니다.
  - network_interface : Nomad 클라이언트에서 실행하는 애플리케이션이 할당되는 네트워크 인터페이스가 Nomad 프로세스와 다른 네트워크를 사용하는 경우 해당 네트워크 인터페이스 이름을 지정 합니다.
  - meta : 배포할 조건을 사용자 정의하는 항목입니다. Label 이나 Tag와 비슷한 역할입니다. map 타입으로 여러줄을 나열하여 설정할 수 있습니다. 값은 쉼표로 구분하여 리스트처럼 사용할 수 있습니다.
  - options : 클라이언트 구성의 옵션을 지정합니다. 주로 실행 드라이버와 배포를 위한 설정을 위해 사용됩니다.
    - driver.raw_exec.enable : `raw_exec` 드라이버는 기본적으로 비활성화 되어있습니다. Windows에서는 `exec` 드라이버가 동작하지 않으므로 해당 드라이버를 활성화 합니다.
    - [exec](https://www.nomadproject.io/docs/drivers/exec) : OS에서 지원하는 격리 기본 요소를 사용하여 배포 작업으로 할당되는 리소스에 대한 접근을 제한합니다.
    - [raw_exec](https://www.nomadproject.io/docs/drivers/raw_exec) :  OS 지원 격리 요소를 사용하지 않고 Nomad가 작업 실행시 동일한 사용자로 시작 됩니다.
- server_join : 서버와 클라이언트 구성의 경우, 또는 서버 HA 구성의 경우 서버 접속을 위한 주소를 나열합니다.



## 실행과 서비스 등록

구성파일을 작성하였다면, 해당 구성파일을 지정하여 Nomad를 실행할 수 있습니다.

```powershell
PS C:₩hashicorp₩nomad₩bin> ./nomad agent -config=C:\hashicorp\nomad\config\nomad.hcl
```



Windows 서비스로 등록하는 경우 다음을 참고합니다.

```powershell
sc.exe delete nomad
sc.exe create nomad binPath= "C:\hashicorp\nomad\bin\nomad.exe agent -config=C:\hashicorp\nomad\config\nomad.hcl" start= auto
net start nomad
```



![DESKTOP-LenovoMini 2021-04-18 10-22-39](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/DESKTOP-LenovoMini%202021-04-18%2010-22-39.png)



## 테스트

> Job 구성 url : [Manage-job](https://learn.hashicorp.com/tutorials/nomad/jobs-configuring?in=nomad/manage-jobs)

Windows에서만 실행되는 커맨드를 활용하여 동작을 테스트 합니다.

[test.nomad]

```ruby
job "test" {
  datacenters = ["dc1"]
  type        = "batch"

  constraint {
    attribute = "${attr.kernel.name}"
    value     = "windows"
  }

  group "windows" {
    count = 1
    task "systeminfo" {
      driver = "raw_exec"
      config {
        command = "C:\\windows\\system32\\systeminfo"
      }
    }
  }
}
```

- job : job 이름을 명시 합니다.
- datacenters : 해당 job을 배포할 대상 datacenter를 지정합니다. list 타입인 이유는 Enterprise에서는 멀티 DC 배포를 지원하기 때문입니다.
- type : Nomad가 지원하는 배포 애플리케이션 타입은 batch, service, system 입니다.
  - batch : 지속되지 않는 1회성 작업에 대한 타입으로 반복적 작업과 파라메터를 받는 형식도 지원합니다.
  - service : 지속되는 작업, 예를들어 웹서버와 같은 형식의 애플리케이션 실행 타입을 지원합니다.
  - system : 전체 클라이언트에서 실행될 애플리케이션 실행 타입을 지원합니다. 예를들어 모니터링을 위해 모든 클라이언트에서 실행되어야하는 경우에 활용합니다.
- constraint : job이 배포될 조건을 지정하는 것으로 반복적으로 구성가능합니다.
- group : job에서 함께 실행될 단위를 지정합니다. task가 여럿 할당될 수 있습니다.
- count : group에서 실행되는 배포의 개수를 지정합니다.
- task : 실제 동작하는 배포 형식을 정의 합니다.
  - [driver](https://www.nomadproject.io/docs/drivers) : task로 실행할 배포 형태 드라이버를 지정합니다. 대표적으로 exec, raw_exec, java, docker 등이 있습니다.
  - config : `driver` 의 실행을위한 구성을 정의합니다. 예제에서는 `raw_exec` 를 사용하였으므로 `command` 를 입력합니다.

job의 내용은 파일로 구성하여 CLI로 등록하는 것도 가능하고 UI에서 입력하는 것도 가능합니다. UI등록의 예는 다음과 같습니다.

1. UI의 좌측 `Jobs` 를 클릭하여 우측 상단의 `Run Job` 버튼을 클릭합니다.
   ![image-20210418110840679](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20210418110840679.png)

2. `Job Definition` 란에 job 정의를 채우고 `Plan`을 클릭합니다.
   ![Run a job - Nomad 2021-04-18 10-47-26](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Run%20a%20job%20-%20Nomad%202021-04-18%2010-47-26.png)

3. Plan의 결과를 확인하고 `Run` 버튼으로 배포를 실행합니다.
   ![Run a job - Nomad 2021-04-18 10-48-47](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Run%20a%20job%20-%20Nomad%202021-04-18%2010-48-47.png)

4. 배포의 결과를 확인합니다.
   ![Job test - Nomad 2021-04-18 10-49-41](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Job%20test%20-%20Nomad%202021-04-18%2010-49-41.png)

   - 배포에 실패하면 붉은색으로 표기되며, `Task Groups`의 task 이름을 클릭하면 원인을 확인할 수 있습니다.
   - 정상 배포되면 `Running` 상태로 확인됩니다. `batch` 의 경우 실행 후 종료되기 때문에 최종적으로 `Complete` 상태가 됩니다.
   - 해당 task를 선택하고 마지막 `Allocation` 항목을 클릭하면 마지막 실행 task를 확인할 수 있고, 원격에서 실행된 `Log`나 생성된 `File`을 확인할 수 있습니다.

   ![Task systeminfo - Nomad 2021-04-18 10-57-18](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Task%20systeminfo%20-%20Nomad%202021-04-18%2010-57-18.png)



## 마치며

Windows 환경에 실행되는 애플리케이션을 원격에서 일괄적으로 관리하기위한 환경을 제공합니다. CI/CD 과정에서 마지막 단계인 배포 동작에 대해 API를 지원하고 스케쥴링 및 배포의 상태를 관리해주는 역할로 동작합니다. Batch, Service, System 의 배포 실행 형태를 지정할 수 있고, 다양한 실행 드라이버(exec, java, docker, 등)을 지원하여 다중의 OS 환경 및 온프레미스와 클라우드 환경 전반에 배포를 위한 쉽고 간단한 워크로드 오케스트레이션 환경을 구성할 수 있습니다.