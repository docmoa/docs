---
meta:
  - name: description
    content: Nomad ingress gateway with consul
tags: ["Nomad", "Sample", "Job",""]
---

# Nomad ingress gateway
## Nomad job으로 ingress gateway 사용하기 (with consul)
- consul로 설정하는 ingress gateway가 아닌 Nomad job 기동 시에 ingress gateway 활성화 예제
   - hashicorp 공식 예제가 아닌 다른 걸 해보려하다, 특이한 부분을 확인함

### 테스트 job (python fastapi)

```hcl
job "22-fastapi" {
  datacenters = ["dc1"]

  group "fastapi" {

    network {
      mode = "bridge"
      #service가 80으로 뜸, 만약 다른 포트로 뜨는 서비스를 사용 할 경우 image와 to만 변경
      port "http" {
        to = 80
      }
    }
    
    service {
      name = "fastapi"
      #여기서 port에 위에서 미리 선언한 http를 쓸 경우 다이나믹한 port를 가져오는데 
      #그럴 경우 ingress gateway에서 못 읽어 온다.
      port = "80"
      connect {
        sidecar_service{}
      }
    }

    task "fastapi" {
      driver = "docker"

      config {
        image = "tiangolo/uvicorn-gunicorn-fastapi"
        ports = ["http"]
      }

      resources {
        cpu    = 500
        memory = 282
      }
    }
    scaling  {
      enabled = true
      min     = 1
      max     = 3

      policy {
        evaluation_interval = "5s"
        cooldown            = "1m"
        #driver = "nomad-apm"
        check "mem_allocated_percentage" {
          source = "nomad-apm"
          query  = "max_memory"

          strategy "target-value" {
            target = 80
          }
        }
      }
    }
  }
}

```

## 만약 service가 http로 떠야한다면 아래와 같이 service등록도 진행해야한다.

```hcl
Kind      = "service-defaults"
Name      = "fastapi"
Namespace = "default"
Protocol  = "http"
```

## ingress job
- 사실 하나의 job으로 만들어도 되는데 테스트 시 계속 두개의 job이 재기동되어서 둘로 나눔

```hcl
job "ingress-demo" {

  datacenters = ["dc1"]

  group "ingress-group" {

    network {
      mode = "bridge"
      #backend job인 fastapi의 port를 넣어줌
      port "inbound" {
        to     = 80
      }
    }

    service {
      name = "my-ingress-service"
      port = "inbound"

      connect {
        gateway {

          proxy {
          }
          ingress {
            listener {
              #backend job인 fastapi의 port를 넣어줌
              port     = 80
              #protocol = "http"
              protocol = "tcp"
              service {
                name = "fastapi"
              #  hosts = ["*"]
              }
            }
          }
        }
      }
    }
  }
}
```