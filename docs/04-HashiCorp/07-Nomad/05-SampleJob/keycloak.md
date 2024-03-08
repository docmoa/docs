---
description: Nomad Sample
tag: ["Nomad", "Sample", "Job"]
author: GS
---

# Keycloak

Keycloak은 Stateful 한 특성이 있어서 볼륨을 붙여주는것이 좋다.

```hcl
// nomad namespace apply -description "Keycloak" keycloak

job "keycloak" {
  type = "service"
  datacenters = ["dc1"]
  namespace = "keycloak"

  group "keycloak" {
    count = 1

    volume "keycloak-vol" {
      type = "host"
      read_only = false
      source = "keycloak-vol"
    }

    task "keycloak" {
      driver = "docker"

      volume_mount {
        volume = "keycloak-vol"
        destination = "/opt/jboss/keycloak/standalone/data"
        read_only = false
      }

      config {
        image = "quay.io/keycloak/keycloak:14.0.0"
        port_map {
          keycloak = 8080
          callback = 8250
        }
      }
      
      env {
        KEYCLOAK_USER = "admin"
        KEYCLOAK_PASSWORD = "admin"
      }

      resources {
        memory = 550

        network {
          port "keycloak" {
            static = 18080
          }
          port "callback" {
            static = 18250
          }
        }
      }

      service {
        name = "keycloak"
        tags = ["auth"]

        check {
          type  = "tcp"
          interval = "10s"
          timeout  = "2s"
          port  = "keycloak"
        }
      }
    }
  }
}
```