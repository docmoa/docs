---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job","sidecar","tomcat"]
---

# tomcat-sidecar

- 참고 링크
  - https://discuss.hashicorp.com/t/nomad-error-creating-an-ingress-gateway-with-sidecar-service/24731

```hcl
job "01_tomcat-sidecar" {
  datacenters = ["dc1"]

  #ingress용도의 group
  group "ingress-tomcat" {
    network {
      mode = "bridge"
      port "inbound" {
        static = 8080
        to     = 8080
      }
    }

    service {
      name = "tomcat-ingress"
      port = "8080"

      #여기서부터 sidecar ingress
      connect {
        gateway {
          ingress {
            listener {
              port     = 8080
              protocol = "tcp"
              service {
                #아래 tomcat group에 service를 호출함
                name = "backend"
              }
            }
          }
        }
      }
    }
  }

  group "tomcat" {
    network {
      mode = "bridge"
    }

    service {
      name = "backend"
      port = "8080"
      connect {
        sidecar_service {}
      }
    }

    task "tomcat" {
      driver = "docker"
      config {
        image = "tomcat"
      }
    }
  }
}


```