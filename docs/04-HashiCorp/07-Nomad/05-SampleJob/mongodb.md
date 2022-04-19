---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job"]
---

# MongoDB

```hcl
job "mongodb" {
  datacenters = ["dc1"]

  group "mongodb" {
    network {
      port "db" {
        static = 27017
      }
    }

    service {
      port = "db"

      check {
        type     = "tcp"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "mongodb" {
      driver = "docker"

      config {
        image = "mongo:3.6.21"
        ports = ["db"]
      }

      env {
        MONGO_INITDB_ROOT_USERNAME = "admin"
        MONGO_INITDB_ROOT_PASSWORD = "password"
      }

      resources {
        cpu    = 2000
        memory = 1024
      }
    }
  }
}
```