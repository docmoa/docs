---
description: Nomad Sample
tag: ["Nomad", "Sample", "Job", "param", "batch"]
---

# param-batch-job
- parameter를 받아와서 해당 값을 이용하여 다음으로 실행될 job의 값을 다이나믹하게 넣어 만드는 샘플
  - meta_required에 원하는 값을 넣고 template에 env "NOMAD_META_메타명(key)"와 같이 넣어주면 된다. 

```hcl
job "24-paramete" {
  datacenters = ["dc1"]
  type = "batch"

  parameterized {
    payload       = "forbidden"
    meta_required = ["room_num"]
  }

  group "run-main-job" {

    task "run-main-job" {
      driver = "raw_exec"

      config {
        command = "nomad"
        # arguments
        args = ["job", "run", "${NOMAD_TASK_DIR}/room.job" ]
      }
      template {
        data = <<EOH

#####################

job "{{ env "NOMAD_META_room_num" }}" {
    datacenters = ["dc1"]

    group "jboss" {

        network {
            port "http" {
                to = "8080"
            }
        }
        service {
            port = "http"
            name = "{{ env "NOMAD_META_room_num" }}"
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
            resources {
                cpu    = 500
                memory = 282
            }
        }
    }
}

EOH
    destination = "local/room.job"
      }
    }
  }
}
```