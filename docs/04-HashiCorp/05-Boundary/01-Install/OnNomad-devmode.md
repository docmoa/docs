---
meta:
  - name: description
    content: Boundary Dev Mode (Nomad)
tags: ["Boundary", "Install"]
---

# Boundary Run Dev Mode on Nomad Job

## 1. Job sample

```hcl
locals {
  version = "0.8.1"
  private_ip = "192.168.0.27"
  public_ip = "11.129.13.30"
}

job "boundary-dev" {
  type = "service"
  datacenters = ["home"]
  namespace = "boundary"

  constraint {
    attribute = "${attr.os.name}"
    value     = "raspbian"
  }

  group "dev" {
    count = 1

    ephemeral_disk { sticky  = true }

    network {
      mode = "host"
      port "api" {
        static = 9200
        to = 9200
      }
      port "cluster" {
        static = 9201
        to = 9201
      }
      port "worker" {
        static = 9202
        to = 9202
      }
    }

    task "dev" {
      driver = "raw_exec"

      env {
        BOUNDARY_DEV_CONTROLLER_API_LISTEN_ADDRESS = local.private_ip
        BOUNDARY_DEV_CONTROLLER_CLUSTER_LISTEN_ADDRESS = "0.0.0.0"
        BOUNDARY_DEV_WORKER_PUBLIC_ADDRESS = local.public_ip
        BOUNDARY_DEV_WORKER_PROXY_LISTEN_ADDRESS = local.private_ip
        BOUNDARY_DEV_PASSWORD = "password"
      }

      // artifact {
      //   source = "https://releases.hashicorp.com/boundary/${local.version}/boundary_${local.version}_linux_arm.zip"
      // }

      config {
        command = "boundary"
        args = ["dev"]
      }

      resources {
        cpu    = 500
        memory = 500
      }

      service {
        name = "boundary"
        tags = ["cluster"]

        port = "cluster"

        check {
          type  = "tcp"
          interval = "10s"
          timeout  = "2s"
          port  = "api"
        }
      }
    }
  }
}
```

## 2. ENV

- BOUNDARY_DEV_WORKER_PUBLIC_ADDRESS : Worker public ip config, (or `-worker-public-addr` flag)
