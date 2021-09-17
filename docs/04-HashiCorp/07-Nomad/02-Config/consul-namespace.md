---
meta:
  - name: description
    content: With Consul Namespace
tags: ["Nomad", "Enterprise", "Consul"]
---

# Consul namespace 사용시 Nomad의 서비스 등록

## Job의 Consul Namespace 정의
Consul Enterprise는 `Namespace`가 있어서 Nomad로 Consul에 서비스 등록 시 특정 Namespace를 지정할 수 있음

Job > Group > Consul
```hcl {6-8}
job "frontback_job" {
  group "backend_group_v1" {

    count = 1

    consul {
      namespace = "mynamespace"
    }

    service {
      name = "backend"
      port = "http"

      connect {
        sidecar_service {}
      }

      check {
        type     = "http"
        path     = "/"
        interval = "5s"
        timeout  = "3s"
      }
    }
# 생략
```

## Service Mesh Upstream
해당 `group`에 대한 글로벌 설정이기 때문에 Consul과 관련해서 구성되는 모든 설정은 해당 `Namespace`를 기준으로 적용됨
예를 들어 `upstream` 구성을 하면

```hcl {5-7,16-19}
job "frontback_job" {
  group "frontend_group" {
    count = 1

    consul {
      namespace = "mesh"
    }

    service {
      name = "frontend"
      port = "http"

      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "backend"
              local_bind_port  = 10000
            }
          }
        }
      }
# 생략
```

sidecar의 로그에서도 적용된 namespace로 리스너가 등록되는 로그(`namesapce/servicename`) 확인 가능
``` {6}
[2021-09-01 01:31:10.490][1][info][upstream] [source/common/upstream/cds_api_helper.cc:28] cds: add 3 cluster(s), remove 0 cluster(s)
[2021-09-01 01:31:10.572][1][info][upstream] [source/common/upstream/cds_api_helper.cc:65] cds: added/updated 3 cluster(s), skipped 0 unmodified cluster(s)
[2021-09-01 01:31:10.572][1][info][upstream] [source/common/upstream/cluster_manager_impl.cc:168] cm init: initializing secondary clusters
[2021-09-01 01:31:10.574][1][info][upstream] [source/common/upstream/cluster_manager_impl.cc:192] cm init: all clusters initialized
[2021-09-01 01:31:10.574][1][info][main] [source/server/server.cc:745] all clusters initialized. initializing init manager
[2021-09-01 01:31:10.578][1][info][upstream] [source/server/lds_api.cc:78] lds: add/update listener 'mesh/backend:127.0.0.1:10000'
[2021-09-01 01:31:10.586][1][info][upstream] [source/server/lds_api.cc:78] lds: add/update listener 'public_listener:0.0.0.0:24945'
[2021-09-01 01:31:10.587][1][info][config] [source/server/listener_manager_impl.cc:888] all dependencies initialized. starting workers
[2021-09-01 01:46:10.592][1][info][main] [source/server/drain_manager_impl.cc:70] shutting down parent after drain
```

## DNS 쿼리
::: warning
주의할점은 DNS를 사용하는 경우, 예를들어 template 작성시 namespace가 추가되면 경로상 datacenter도 정의해줘야 인식하는 것으로 보임
```
[tag.]<service>.service.<namespace>.<datacenter>.<domain>
```
참고 링크 : <https://www.consul.io/docs/discovery/dns#namespaced-services>
:::

**기존 템플릿**
```hcl {12}
template {
  data = <<EOF
defaults
   mode http

frontend http_front
   bind *:28888
   default_backend http_back

backend http_back
    balance roundrobin
    server-template mywebapp 2 _frontend._tcp.service.consul resolvers consul resolve-opts allow-dup-ip resolve-prefer ipv4 check

resolvers consul
  nameserver consul 127.0.0.1:8600
  accepted_payload_size 8192
  hold valid 5s
EOF

  destination = "local/haproxy.cfg"
}
```

**Namespace 적용 템플릿**
```hcl {12}
template {
  data = <<EOF
defaults
   mode http

frontend http_front
   bind *:28888
   default_backend http_back

backend http_back
    balance roundrobin
    server-template mywebapp 2 _frontend._tcp.service.mesh.hashistack.consul resolvers consul resolve-opts allow-dup-ip resolve-prefer ipv4 check

resolvers consul
  nameserver consul 127.0.0.1:8600
  accepted_payload_size 8192
  hold valid 5s
EOF

  destination = "local/haproxy.cfg"
}
```

::: details Full Example (mesh.nomad)
```hcl
# nomad namespace apply -description "ServiceMesh Sample" mesh

locals {
  mode     = "Legacy"
  namespace = "mesh"
  #artifact = "https://hashicorpjp.s3.ap-northeast-1.amazonaws.com/masa/Snapshots2021Jan_Nomad/frontback.tgz"
  artifact = "https://github.com/Great-Stone/Snapshots_2021Jan_Pseudo-containerized/raw/main/frontback.tgz"
  node = "https://github.com/Great-Stone/Snapshots_2021Jan_Pseudo-containerized/raw/main/nodejs-linux"
  subject    = "snapshot"
}

variables {
  frontend_port = 8080
  upstream_port = 10000
}

variable "attrib_v1" {
  type = object({
    version    = string
    task_count = number
    text_color = string
  })
  default = {
    version    = "v1"
    task_count = 1
    text_color = "green"
  }
}

variable "attrib_v2" {
  type = object({
    version    = string
    task_count = number
    text_color = string
  })
  default = {
    version    = "v2"
    task_count = 1
    text_color = "red"
  }
}

job "frontback_job" {

  region = "global"
  datacenters = ["hashistack"]
  namespace = local.namespace

  type = "service"

  constraint {
    attribute = "${meta.subject}"
    value     = local.subject
  }

  #######################
  #                     #
  #      Backend v1     #
  #                     #
  #######################

  group "backend_group_v1" {

    count = var.attrib_v1["task_count"]

    consul {
      namespace = local.namespace
    }

    network {
      mode = "bridge"
      port "http" {}
    }

    service {
      name = "backend"
      port = "http"

      connect {
        sidecar_service {}
      }

      meta {
        version = var.attrib_v1["version"]
      }

      check {
        type     = "http"
        path     = "/"
        interval = "5s"
        timeout  = "3s"
      }

      tags = [
        "Snapshots",
        "Backend",
        local.mode,
        var.attrib_v1["version"]
      ]
    }

    task "backend" {

      driver = "exec"

      artifact {
        source = local.artifact
      }

      env {
        COLOR   = var.attrib_v1["text_color"]
        MODE    = local.mode
        TASK_ID = NOMAD_ALLOC_INDEX
        ADDR    = NOMAD_ADDR_http
        PORT    = NOMAD_PORT_http
        VERSION = var.attrib_v1["version"]
        # IMG_SRC		= "${local.img_dir}${var.attrib_v1["version"]}.png"
      }

      config {
        command = "backend"
      }

      resources {
        memory = 32  # reserve 32 MB
        cpu    = 100 # reserve 100 MHz
      }

    }

    reschedule {
      delay          = "10s"
      delay_function = "constant"
    }
  }

  #######################
  #                     #
  #      Backend v2     #
  #                     #
  #######################

  group "backend_group_v2" {

    count = var.attrib_v2["task_count"]

    consul {
      namespace = local.namespace
    }

    network {
      mode = "bridge"
      port "http" {}
    }

    service {
      name = "backend"
      port = "http"

      connect {
        sidecar_service {}
      }

      meta {
        version = var.attrib_v2["version"]
      }

      check {
        type     = "http"
        path     = "/"
        interval = "5s"
        timeout  = "3s"
      }

      tags = [
        "Snapshots",
        "Backend",
        local.mode,
        var.attrib_v2["version"]
      ]
    }

    task "backend" {

      driver = "exec"

      artifact {
        source = local.artifact
      }

      env {
        COLOR   = var.attrib_v2["text_color"]
        MODE    = local.mode
        TASK_ID = NOMAD_ALLOC_INDEX
        ADDR    = NOMAD_ADDR_http
        PORT    = NOMAD_PORT_http
        VERSION = var.attrib_v2["version"]
        # IMG_SRC		= "${local.img_dir}${var.attrib_v2["version"]}.png"
      }

      config {
        command = "backend"
      }

      resources {
        memory = 32  # reserve 32 MB
        cpu    = 100 # reserve 100 MHz
      }
    }

    reschedule {
      delay          = "10s"
      delay_function = "constant"
    }
  }

  ######################
  #                    #
  #      Frontend      #
  #                    #
  ######################

  group "frontend_group" {

    count = 1

    consul {
      namespace = local.namespace
    }

    network {
      mode = "bridge"
      port "http" {
        // static = var.frontend_port
      }
    }

    service {
      name = "frontend"
      port = "http"

      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "backend"
              local_bind_port  = var.upstream_port
            }
          }
        }
      }

			// check {
			// 	type     = "http"
			// 	path     = "/"
			// 	interval = "5s"
			// 	timeout  = "3s"
			// }

      tags = [
        local.mode,
        "Snapshots",
        "Frontend"
      ]
    }

    task "frontend" {

      driver = "exec"

      artifact {
        source = local.node
      }

      env {
        PORT         = NOMAD_PORT_http
        UPSTREAM_URL = "http://${NOMAD_UPSTREAM_ADDR_backend}"
      }

      config {
        command = "nodejs-linux"
      }

      resources {
        memory = 32  # reserve 32 MB
        cpu    = 100 # reserve 100 MHz
      }

    }

    reschedule {
      delay          = "10s"
      delay_function = "constant"
    }
  }

  ######################
  #                    #
  #      haproxy      #
  #                    #
  ######################

  group "haproxy" {
    count = 1

    consul {
      namespace = local.namespace
    }

    network {
      port "http" {
        static = 28888
      }

      port "stats" {
        static = 21936
      }
    }

    task "haproxy" {
      driver = "docker"

      config {
        image        = "haproxy:2.0"
        network_mode = "host"

        volumes = [
          "local/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg",
        ]

        ports = ["http", "stats"]
      }

      template {
        data = <<EOF
defaults
   mode http

frontend stats
   bind *:21936
   stats uri /
   stats show-legends
   no log

frontend http_front
   bind *:28888
   default_backend http_back

backend http_back
    balance roundrobin
    server-template mywebapp 2 _frontend._tcp.service.mesh.hashistack.consul resolvers consul resolve-opts allow-dup-ip resolve-prefer ipv4 check

resolvers consul
  nameserver consul 127.0.0.1:8600
  accepted_payload_size 8192
  hold valid 5s
EOF

        destination = "local/haproxy.cfg"
      }

      service {
        name = "haproxy"

        check {
          name     = "alive"
          type     = "tcp"
          port     = "http"
          interval = "10s"
          timeout  = "2s"
        }
      }

      resources {
        cpu    = 200
        memory = 128

        network {
          mbits = 10

          // port "http" {
          //   static = 28888
          //   to = 8888
          // }

          // port "stats" {
          //   static = 21936
          //   to = 1936
          // }
        }
      }
    }
  }
}
```
:::