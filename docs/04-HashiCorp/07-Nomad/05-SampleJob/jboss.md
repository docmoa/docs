---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job"]
---

# Jboss with csi (nfs) + memory autoscale

```hcl
job "03-jboss" {
  datacenters = ["dc1"]

  group "jboss" {

    network {
      port "http" {
        to = "8080"
      }
    }
    volume "nfs-vol" {
      type            = "csi"
      source          = "nfs-vol"
      read_only       = false
      attachment_mode = "file-system"
      access_mode     = "single-node-writer"
      #per_alloc       = true
    }

    service {
      port = "http"

      check {
        type     = "tcp"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "http" {
      driver = "docker"

      config {
        image = "jboss/wildfly"
        ports = ["http"]
      }

      env {
      }

      resources {
        cpu    = 500
        memory = 282
      }
      volume_mount {
        volume      = "nfs-vol"
        destination = "/csi"
      }
    }
    scaling  {
      enabled = true
      min     = 1
      max     = 4

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