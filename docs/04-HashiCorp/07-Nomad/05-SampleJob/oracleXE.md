---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job"]
---

# MongoDB

```hcl
job "oracle" {
  datacenters = ["dc1"]

  group "oracle" {
    network {
      port "db" {
        static = 1521
      }
      port "manage" {
        static = 5500
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

    task "oracle" {
      driver = "docker"

      config {
        image = "oracle/database:18.4.0-xe"
        ports = ["db", "manage"]
      }

      env {
        DB_MEMORY = "2GB"
        ORACLE_PWD = "password"
        ORACLE_SID = "XE"
      }

      resources {
        cpu    = 2000
        memory = 1024
      }
    }
  }
}
```