---
description: Nomad Sample
tag: ["Nomad", "Sample", "Job","vs-code"]
---

# code-server

- vs-code를 local이 아닌 환경에서 사용할 수 있도록 도와주는 code-server의 예시입니다.
- 이 code의 변수는 nomad variable를 활용해서 배포합니다.

## 변수 선언

- web ui 접근 password와 code-server terminal에서 사용 할 sudo의 password 를 변수로 선언했습니다.

```bash
# nomad var put {path기반의 varialbes} key=vaule
$ nomad var put code/config password=password
```

## job sample

```hcl
job "010-code-server" {
  datacenters = ["dc1"]
  type        = "service"

  group "code-server" {
    count = 1

    network {
      port "http" {
        to = 8443
        static = 8443
      }
    }

    service {
      name = "code-server"
      port = "http"
      provider = "nomad"

      check {
        type     = "http"
        path     = "/"
        interval = "2s"
        timeout  = "30s"
      }
    }

    task "code-server-runner" {
      driver = "docker"

      template {
        data = <<EOH
{{ with nomadVar "code/config" }}
PASSWORD={{ .password }}
SUDO_PASSWORD={{ .password }}
{{ end }}
EOH

  destination = "secrets/file.env"
  env         = true
      }


      config {
        image = "linuxserver/code-server"
        ports = ["http"]
      }

      env {
        PGID=1000
        PUID=1000
      }


      resources {
        cpu    = 1000
        memory = 900
      }
    }
  }
}

```
