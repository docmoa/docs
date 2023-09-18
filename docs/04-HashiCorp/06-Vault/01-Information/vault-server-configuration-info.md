---
description: Vault 서버 실행시 구성 정보 내용 설명
tag: ["vault", "configuration"]
---

# Vault Server Configuration - Info

볼트 서버를 시작하는 기초적인 커맨드와 실행 후 안내 메시지는 다음과 같다.

```bash
$ vault server -dev

==> Vault server configuration:

             Api Address: http://127.0.0.1:8200
                     Cgo: disabled
         Cluster Address: https://127.0.0.1:8201
   Environment Variables: HOME, ITERM_PROFILE, ...
              Go Version: go1.19.4
              Listener 1: tcp (addr: "127.0.0.1:8200", cluster address: "127.0.0.1:8201", max_request_duration: "1m30s", max_request_size: "33554432", tls: "disabled")
               Log Level: info
                   Mlock: supported: false, enabled: false
           Recovery Mode: false
                 Storage: inmem
                 Version: Vault v1.12.3, built 2023-02-02T09:07:27Z
             Version Sha: 209b3dd99fe8ca320340d08c70cff5f620261f9b

==> Vault server started! Log data will stream in below:

...
```

기동 후 서버가 실행된 주요 설정 정보의 설명인 `Vault server configuration`의 내용의 설명은 다음과 같다.

- `Api Address: http://127.0.0.1:8200`  
  : 볼트와의 인터페이스를 위한 API 주소로, RestAPI, CLI, UI 모두 해당 주소와 통신한다.

- `Cgo: disabled`  
  : 볼트는 golang으로 이루어져 있는데, go 컴파일 시 `CGO_ENABLED`가 활성화되어있다면 dynamic library로 빌드된다. 이 경우 실행 환경에 컴파일 시 사용되는 링크 모듈이 존재하지 않으면 에러가 발생하므로, 실행된 볼트 바이너리는 빌드시 static library로 빌드되었다는 의미다.

- `Cluster Address: https://127.0.0.1:8201`  
  : 볼트 서버를 고가용성(HA)을 위해 다수의 서버로 구성한 경우 서버 간에 통신하는데 사용되는 주소로, TLS1.2로 상호간 인증한다.

- `Environment Variables: HOME, ITERM_PROFILE, ...`  
  : 볼트 서버가 실행된 환경의 환경변수 값의 나열로, 볼트 실행에 영향을 주는 환경변수가 있는지 확인할 수 있다.

- `Go Version: go1.19.4`  
  : 볼트 서버가 빌드 된 golang 버전이다.

- `Listener 1: tcp (addr: "127.0.0.1:8200", cluster address: "127.0.0.1:8201", max_request_duration: "1m30s", max_request_size: "33554432", tls: "disabled")`  
  : 볼트의 리스너 정보로, 이 정보를 기반으로 `Api Address`, `Cluster Address` 가 설정 된다. 숫자가 붙어있다는 의미는 리스터를 여러개 설정 할 수 있다는 의미다.

- `Log Level: info`  
  : 볼트에서 기록하는 로그 수준이다. 

- `Mlock: supported: false, enabled: false`  
  : 볼트의 기본값은 디스크로의 스와핑을 비활성화하기 위해 메모리상의 가상 주소 공간을 RAM에서 잠근다. 이를 위해서는 `mlock()`을 지원하는 시스템, 루트 권한, 설정의 활성화가 필요하다.

- `Recovery Mode: false`  
  : 볼트 시작시 복구모드로 실행되었는지의 여부이다.

- `Storage: inmem`  
  : 볼트 저장소 타입이다.

- `Version: Vault v1.12.3, built 2023-02-02T09:07:27Z`  
  : 볼트 바이너리 버정 정보를 나타낸다.

- `Version Sha: 209b3dd99fe8ca320340d08c70cff5f620261f9b`  
  : 각 볼트 버전과 관련된 고유 식별자입니다. 실행 중인 코드의 버전을 식별하는 데 사용되며, 볼트 오픈소스의 GitHub Repository의 commit id와 같다.