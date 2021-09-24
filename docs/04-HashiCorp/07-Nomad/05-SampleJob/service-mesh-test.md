---
meta:
  - name: description
    content: Nomad + Consul Sample
tags: ["Nomad", "Consul", "Sample", "Job", "Service Mesh"]
---

# Service Mesh Test

HashiCorp 공식 Service Mesh Test App

<https://learn.hashicorp.com/tutorials/nomad/consul-service-mesh>

```hcl
job "countdash" {
  region      = "global"
  datacenters = ["dc1"]
  # namespace   = "mesh"

  group "api" {
    network {
      mode = "bridge"
      port "api" {
        to = 9001 # static 설정이 없으므로 컨테이너의 앱 9001과 노출되는 임의의 포트와 맵핑
      }
    }

    service {
      name = "count-api"
      port = "api" # 임의의 포트 할당을 network port id로 지정

      connect {
        sidecar_service {}
      }
    }

    task "web" {
      driver = "docker"
      config {
        image = "hashicorpnomad/counter-api:v1"
        ports = ["api"]
      }
    }
  }

  group "dashboard" {
    network {
      mode = "bridge"
      port "http" {
        static = 9002 # 컨테이너 앱 9002와 외부노출되는 사용자 지정 static port를 맵핑
        to     = 9002
      }
    }

    service {
      name = "count-dashboard"
      port = "http" # 할당된 포트를 network port id로 지정

      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "count-api"
              local_bind_port  = 8080 # backend인 count-api의 실제 port와는 별개로 frontend가 호출할 port 지정
            }
          }
        }
      }
    }

    task "dashboard" {
      driver = "docker"
      env {
        COUNTING_SERVICE_URL = "http://${NOMAD_UPSTREAM_ADDR_count_api}"
      }
      config {
        image = "hashicorpnomad/counter-dashboard:v1"
      }
    }

    scaling {
      enabled = true
      min = 1
      max = 10
    }
  }
}
```