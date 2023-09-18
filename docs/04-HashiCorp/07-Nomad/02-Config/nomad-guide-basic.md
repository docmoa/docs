---
description: Nomad 기본 구성 및 샘플 Job
tag: ["Nomad", "Sample"]
---

# Nomad Guide - Basic

## Download

- Release link : <https://releases.hashicorp.com/nomad>
- Version : 1.3.x
- Platform 선택
	- darwin(= MAC)
	- Linux
	- Windows



## on Linux

### 구성 샘플

```bash
└── hashicorp
    └── nomad
         ├── config
         └── data
```

- Donwload 받은 압축을 해제하고 기존 `$PATH` 위치에 복사 하거나 등록
	- e.g. utuntu : /usr/local/bin
	- e.g. centos : /usr/bin


### Server Config

</hashicorp/nomad/config/nomad.hcl>

```ruby
datacenter = "dc1"
data_dir = "/hashicorp/nomad/data"

bind_addr = "0.0.0.0"

advertise {
  http = "{{ GetInterfaceIP \"eth1\" }}"
  rpc  = "{{ GetInterfaceIP \"eth1\" }}"
  serf = "{{ GetInterfaceIP \"eth1\" }}"
}

server {
  enabled          = true
  bootstrap_expect = 1
}
```

- advertise 에 지정된 http, rpc, serf 의 IP는 직접 IP를 입력하는 것도 가능
- go-discover 형태인 구문을 활용하면 인터페이스 이름을 넣어서 자동 IP 입력 가능
  ```
  {{ GetInterfaceIP \"eth1\" }}
  ```


### Client Config

`retry_join`에 Server의 주소 꼭 넣기!

</hashicorp/nomad/config/nomad.hcl>

```ruby
datacenter = "dc1"
data_dir = "/hashicorp/nomad/data"

bind_addr = "0.0.0.0"

server {
  enabled = false
}

server_join {
  retry_join = ["<server_ip>:4647"]
}

client {
  enabled = true
  servers = ["<server_ip>:4647"]
  meta {
    "key1" = "value1"
    "key2" = "value2"
  }
  options = {
    "driver.raw_exec.enable" = "1"
  }
}
```

### Systemctl 서비스 등록

> https://learn.hashicorp.com/tutorials/nomad/production-deployment-guide-vm-with-consul

```bash
sudo touch /etc/systemd/system/nomad.service
```

- `ExecStart`의 nomad 바이너리 경로에 주의!!!
- `ExecStart`의 `-config` 에 앞서 작성한 config 파일 디렉토리 경로 맞추기!!!
- 서버의 경우 User/Group을 일반 사용자로 구성
- 클라이언트(워커 노드)는 User/Group을 root로 구성

```ini
[Unit]
Description=Nomad
Documentation=https://www.nomadproject.io/docs/
Wants=network-online.target
After=network-online.target

[Service]

# Nomad server should be run as the nomad user. Nomad clients
# should be run as root
User=nomad
Group=nomad

ExecReload=/bin/kill -HUP $MAINPID
ExecStart=/usr/local/bin/nomad agent -config /etc/nomad.d
KillMode=process
KillSignal=SIGINT
LimitNOFILE=65536
LimitNPROC=infinity
Restart=on-failure
RestartSec=2

## Configure unit start rate limiting. Units which are started more than
## *burst* times within an *interval* time span are not permitted to start any
## more. Use `StartLimitIntervalSec` or `StartLimitInterval` (depending on
## systemd version) to configure the checking interval and `StartLimitBurst`
## to configure how many starts per interval are allowed. The values in the
## commented lines are defaults.

# StartLimitBurst = 5

## StartLimitIntervalSec is used for systemd versions >= 230
# StartLimitIntervalSec = 10s

## StartLimitInterval is used for systemd versions < 230
# StartLimitInterval = 10s

TasksMax=infinity
OOMScoreAdjust=-1000

[Install]
WantedBy=multi-user.target
```

## 실행 및 UI 확인

```bash
$ systemctl start nomad
$ systemctl enable nomad
```

- UI 기본 포트 : 4646
- http://<server_ip>:4646

## Job 실행

Job 실행은 CLI, API, UI 실행 가능

### CLI

```bash
$ NOMAD_ADDR=http://<server_ip>:4646
$ nomad job run <job_file_path>
```

### UI

- `http://<server_ip>:4646` 에 접속
- 왼쪽 메뉴의 `WORKLOAD/Jobs` 선택
- 우측의 `Run Job` 버튼 클릭
- Job 내용 입력 후 `Plan`, `Apply`

## Job Sample

### batch - basic

```ruby
job "batch" {
  datacenters = ["dc1"]
  
  type        = "batch"
  
  group "batch-1" {
    count = 1
    task "batch" {
      driver = "raw_exec"
      template {
        data = <<EOF
#!/bin/bash
echo $(hostname) > /tmp/check.txt
EOF
        destination = "run.sh"
      }
      config {
        command = "run.sh"
      }
      resources {
        cpu    = 100
        memory = 64
      }
    }
    
    task "batch-2" {
      driver = "raw_exec"
      artifact {
        source = "http://<shared_ip>:<port>/path/run.sh"
        destination = "local"
      }
      config {
        command = "local/run.sh"
      }
      resources {
        cpu    = 100
        memory = 64
      }
    }
  }
}

```

- `driver`가 `raw_exec`이면 isolation 없이 스크립트를 실행하는 방식
- `template` 에서 작성하는 파일은 동적으로 생성되며 변수 조합도 가능
- `artifact`를 정의하여 중앙 저장소의 파일을 다운로드 받아 구성 가능
- 한번 정상 동작 후 Job은 종료됨(기록은 남으나 GC 후 최종적으로 삭제됨)



### batch - periodic

```ruby
job "periodic" {
  datacenters = ["dc1"]
  
  type        = "batch"

  periodic {
    cron             = "*/5 * * * * * *"
    prohibit_overlap = true
    time_zone        = "Asia/Seoul"
  }

  constraint {
    attribute = "${attr.unique.hostname}"
    value     = "cn-client-2"
  }

  group "batch" {
    count = 1
    task "batch" {
      driver = "raw_exec"
      template {
        data = <<EOF
#!/bin/bash
echo $(date) >> /tmp/periodic.txt
EOF
        destination = "run.sh"
      }
      config {
        command = "run.sh"
      }
      resources {
        cpu    = 100
        memory = 64
      }
    }
  }
}
```

- `periodic` 에서 cron 형태로 정의 가능

- `constraint`은 조건을 부여하는 옵션으로 attribute와 meta 정보를 활용 가능, 해당 예제에서는 hostname 기준으로 동작 타겟 호스트를 정의함

  - attribute를 조건으로 주는 방법은 attribute값 앞에 `attr.` prefix를 추가

  - meta의 경우 meta로 선언된 키 앞에 `meta.` prefix를 추가

  - CLI로 확인하는 방법

    ```bash
    $ nomad agent-info | grep node_id
      node_id = ae3cf7ee-09e6-c158-d883-fe4e4f39eb2b
    $ nomad node status -verbose ae3cf7ee-09e6-c158-d883-fe4e4f39eb2b
    ID              = ae3cf7ee-09e6-c158-d883-fe4e4f39eb2b
    Name            = gs-C02CT3ZFML85
    ...
    Attributes
    cpu.arch                  = amd64
    cpu.frequency             = 2300
    cpu.modelname             = Intel(R) Core(TM) i7-1068NG7 CPU @ 2.30GHz
    cpu.numcores              = 8
    cpu.totalcompute          = 18400
    driver.java               = 1
    driver.java.runtime       = OpenJDK Runtime Environment Temurin-11.0.14.1+1 (build 11.0.14.1+1)
    driver.java.version       = 11.0.14.1
    ...
    Meta
    connect.gateway_image     = envoyproxy/envoy:v${NOMAD_envoy_version}
    connect.log_level         = info
    connect.proxy_concurrency = 1
    ...
    ```

  - UI로 확인하는 방법

    - `http://<server_ip>:4646` 에 접속
    - 왼쪽 메뉴의 `CLUSTER/Clients` 선택
    - 우측의 클라이언트 목록에서 원하는 클라이언트 선택



## Batch - Prameterized

```ruby
job "param" {
  datacenters = ["dc1"]
  
  type        = "batch"

  parameterized {
    payload = "optional"
    meta_required = ["param"]
  }

  constraint {
    attribute = "${attr.unique.hostname}"
    value     = "cn-client-1"
  }

  group "batch" {
    count = 1
    task "batch" {
      driver = "raw_exec"
      template {
        data = <<EOF
#!/bin/bash
echo 'batch param {{ env "NOMAD_META_PARAM" }}' >> /tmp/param.txt
EOF
        destination = "run.sh"
      }
      config {
        command = "run.sh"
      }
      resources {
        cpu    = 100
        memory = 64
      }
    }
  }
}
```

- `parameterized` 항목에서 json형태의 payload, 또는 URL Param 형태를 입력 받아 동작 가능
- 요청시에만 동작



## sysbatch

```ruby
job "install_docker" {
  datacenters = ["dc1"]
  
  type        = "sysbatch"

  // periodic {
  //   cron             = "*/5 * * * * * *"
  //   prohibit_overlap = true
  //   time_zone        = "Asia/Seoul"
  // }

  constraint {
    attribute = "${attr.os.name}"
    value     = "ubuntu"
  }
  
  group "install" {
    count = 1
    task "docker" {
      driver = "raw_exec"
      template {
        data = <<EOF
#!/bin/bash
apt-get update
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
apt-get update
apt-cache policy docker-ce
apt-get install docker-ce -y
systemctl enable docker
systemctl start docker
EOF
        destination = "docker_install.sh"
      }
      config {
        command = "docker_install.sh"
      }
      resources {
        cpu    = 100
        memory = 64
      }
    }
  }
}

```

- docker를 ubuntu에 일괄 설치하는 예제
- sysbatch는 조건에 맞는 모든 host node에서 실행



## system

```ruby
job "system" {
  datacenters = ["dc1"]

  type        = "system"

  group "cache" {
    count = 1

    network {
      port "db" {
        to = 6379
      }
    }

    task "redis" {
      driver = "docker"

      config {
        image = "redis:6.2.6-alpine3.15"
        ports = ["db"]
      }

      resources {
        cpu    = 500
        memory = 512
      }
    }
  }
}
```

- system 타입은 모든 노드에서 실행하는 agent 같은 역할의 실행을 수행
- 예제에서는 docker 타입의 실행을 예로 `redis:6.2.6-alpine3.15`를 모든 노드에서 실행하도록 구성
- `group/network` 에서 사용할 network 조건을 정의
  - to : 대상의 포트 정보
  - static : 고정할 클라이언트에서의 포트 정보 (정의되어 있지 않으면 랜덤 부여)
  - 사용할 포트 이름은 docker로 정의된 task의 config/ports 에서 맵핑하여 관리



### Service

```ruby
job "service" {
  datacenters = ["dc1"]

  // spread {
  //   attribute = "${node.datacenter}"
  // }

  group "nginx" {
    count = 2

    scaling {
      enabled = true
      min = 0
      max = 3
    }


    network {
      port "http" {
        to = 80
        static = 18080
      }
    }

    service {
      name = "nginx-backend"
      port = "http"
      tags = ["prod"]
    }

    task "nginx" {
      driver = "docker"

      config {
        image = "nginx"
        ports = ["http"]
        volumes = [
          "local/html:/usr/share/nginx/html",
        ]
      }

      template {
        data = <<EOF
        <h1>Welcome to {{ env "NOMAD_JOB_NAME" }} Production {{ env "NOMAD_HOST_PORT_http" }}</h1>
        node_dc:       {{ env "node.datacenter" }}<br>
        node_hostname: {{ env "attr.unique.hostname" }}<br>
        node_cores:    {{ env "attr.cpu.numcores" }}<br>
        os_name:       {{ env "attr.os.name" }}<br>
        cpu_model:     {{ env "attr.cpu.modelname" }}<br>
        EOF
        destination = "local/html/index.html"
      }
    }
  }
}
```

- Service 타입은 상시 실행된 서비스를 명시
- `count`가 2 이므로 해당 서비스는 2개를 띄우려고 시도
- `scaling` 정의가 있는 경우 UI/CLI/API 에서 scaling count값 지정 가능
- 포트에 `static` 명시가 되어있으므로 해당 서비스는 `18080`을 사용할 수 있는 count 만큼의 노드가 필요

