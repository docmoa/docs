---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job"]
---

# redis

```hcl
job "redis-cluster" {

  datacenters = ["dc1"]

  group "redis" {

    #volume "redis-data" {
    #  type      = "host"
    #  source    = "redis-data"
    #  read_only = false
    #}

    network {
      
      port "master" {
        static = 6379
        to     = 6379
      }
      port "slave" {
        static = 6380
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
     # volume_mount {
     #   volume      = "redis-data"
     #   destination = "/data"
     # }
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
port 6379
bind {{ env "NOMAD_IP_master" }} 
#bind 127.0.0.1 ::1
cluster-enabled yes
cluster-config-file nodes.conf
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

     # volume_mount {
     #   volume      = "redis-data"
     #   destination = "/data"
     # }
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
port 6380
bind  {{ env "NOMAD_IP_slave" }} 
#bind  127.0.0.1 ::1
cluster-enabled yes
cluster-config-file nodes.conf
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