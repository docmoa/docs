---
description: Nomad Sample
tag: ["Nomad", "Sample", "Job"]
---

# redis
- 추가내용: redis는 data dir, cluster info dir(클러스터 시) 이 두개의 dir가 필요하여 volume을 추가로 붙여줘야한다.
  - data dir을 변경이 번거로움(docker build를 다시 해야함) 그래서 클러스터 시에는 docker build, nomad volume으로 나눔과 같은 방법이 있음
  - cluster-enabled : 클러스터로 사용합니다. (cluster volume으로 빼둬야됨)
  - cluster-config-file : 노드별로 클러스터 노드 정보를 conf 파일에 저장합니다.
  - cluster-node-timeout : 노드간 통신이 되지 않아 timeout 되는 시간을 설정합니다.
```hcl
job "redis-cluster" {

  datacenters = ["dc1"]

  group "redis" {

    volume "redis-data" {
      type      = "host"
      source    = "redis-data"
      read_only = false
    }

    volume "redis-cluster" {
      type      = "host"
      source    = "redis-cluster"
      read_only = false
    }

    network {
      
      port "master" {
        to     = 6379
      }
      port "slave" {
        to     = 6380
      }
    }
    service {
      name = "master-redis"
      tags = ["master-redis"]
      port     = "master"
      check {
        port     = "master"
        type     = "tcp"
        interval = "10s"
        timeout  = "2s"
      }
    }

    service {
      name = "slave-redis"
      tags = ["slave-redis"]
      port     = "slave"
      check {
        port     = "slave"
        type     = "tcp"
        interval = "10s"
        timeout  = "2s"
      }
    }



    task "redis-master" {
      volume_mount {
        volume      = "redis-data"
        destination = "/data"
      }
      volume_mount {
        volume      = "redis-cluster"
        destination = "/master"
      }
      driver = "docker"
      config {
        network_mode = "host"
        image = "redis:5.0.5-buster"
        ports = ["master"]
        command = "redis-server"
        args = [
          "${NOMAD_TASK_DIR}/redis.conf"
        ]
      }
      template {
        data = <<EOF
port {{ env "NOMAD_PORT_master" }} 
bind {{ env "NOMAD_IP_master" }} 
#bind 127.0.0.1 ::1
cluster-enabled yes
cluster-config-file /master/nodes.conf
cluster-node-timeout 3000
appendonly yes

EOF

        destination   = "local/redis.conf"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }

      resources {
        cpu = 1000
        memory = 1001
      }
    }
    task "redis-slave" {

      volume_mount {
        volume      = "redis-data"
        destination = "/data"
      }
      volume_mount {
        volume      = "redis-cluster"
        destination = "/slave"
      }
      env {
        NODE_IP = "${NOMAD_IP_slave-redis}"
      }
      driver = "docker"
      config {
        network_mode = "host"
        image = "redis:5.0.5-buster"
        ports = ["slave"]
        command = "redis-server"
        args = [
          "${NOMAD_TASK_DIR}/redis.conf"
        ]
      }
      template {
        data = <<EOF
port {{ env "NOMAD_PORT_slave" }} 
bind  {{ env "NOMAD_IP_slave" }} 
#bind  127.0.0.1 ::1
cluster-enabled yes
cluster-config-file /slave/nodes.conf
cluster-node-timeout 3000
appendonly yes

EOF

        destination   = "local/redis.conf"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }

      resources {
        cpu = 1000
        memory = 1001
      }
    }
  }
}




```