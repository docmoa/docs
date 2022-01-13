---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job"]
---

# elk_version7
## 7버전에 elsaticsearch에서 기본패스워드를 찾지 못해서 env로 넣어줌
## logstash는 적당한 샘플을 찾지 못해서 일단은 비워둠


```hcl
job "elk" {

    datacenters = ["dc1"]

    constraint {
        attribute = "${attr.kernel.name}"
        value = "linux"
    }

    update {
        stagger = "10s"
        max_parallel = 1
    }

    group "elk" {
        count = 1

        restart {
            attempts = 2
            interval = "1m"
            delay = "15s"
            mode = "delay"
        }
        network {
          port "elastic" {
            to     = 9200
            static = 9200
          }
          port "kibana" {
            to     = 5601
          }
          port "logstash" {
            to     = 5000
          }
        }

        task "elasticsearch" {
            driver = "docker"

           constraint {
             attribute = "${attr.unique.hostname}"
             value     = "slave2"
           }

            config {
                image = "elasticsearch:7.16.2"
                ports = ["elastic"]
                volumes = [
          "local/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml",
        ]
      }
      template {
        data = <<EOF
cluster.name: "my-cluster"
network.host: 0.0.0.0
discovery.type: single-node
discovery.seed_hosts: ["127.0.0.1"]
xpack.security.enabled: true
xpack.license.self_generated.type: trial
xpack.monitoring.collection.enabled: true
EOF
        destination   = "local/elasticsearch.yml"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }
            env {
              ELASTIC_PASSWORD = "elastic"
            }

            service {
                name = "${TASKGROUP}-elasticsearch"
                port = "elastic"
            }

            resources {
                cpu = 500
                memory = 2048
            }
        }

        task "kibana" {
            driver = "docker"

            constraint {
              attribute = "${attr.unique.hostname}"
              value     = "slave2"
            }

            config {
                image = "kibana:7.16.2"
                ports = ["kibana"]
                volumes = [
          "local/kibana.yml:/usr/share/kibana/config/kibana.yml"
        ]
      }
      template {
        data = <<EOF
#
# ** THIS IS AN AUTO-GENERATED FILE **
#

# Default Kibana configuration for docker target
server.host: "0.0.0.0"
server.shutdownTimeout: "5s"
elasticsearch.hosts: [ "http://{{ env "NOMAD_IP_elk" }}:{{ env "NOMAD_PORT_elk" }}" ]
elasticsearch.username: elastic
elasticsearch.password: elastic
EOF

        destination   = "local/kibana.yml"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }

            service {
                name = "${TASKGROUP}-kibana"
                port = "kibana"
                check {
                    type = "http"
                    path = "/"
                    interval = "10s"
                    timeout = "2s"
                }
            }

            resources {
                cpu = 500
                memory = 1200
            }
        }

        task "logstash" {
            driver = "docker"

            constraint {
              attribute = "${attr.unique.hostname}"
              value     = "slave2"
            }

            config {
                image = "logstash:7.16.2"
                ports = ["logstash"]
                volumes = [
          "local/logstash.yml:/usr/share/logstash/config/logstash.yml"
        ]
      }
      template {
        data = <<EOF
http.host: "0.0.0.0"
xpack.monitoring.elasticsearch.hosts: [ "http://{{ env "NOMAD_IP_elk" }}:{{ env "NOMAD_PORT_elk" }}" ]
EOF

        destination   = "local/logstash.yml"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }

            service {
                name = "${TASKGROUP}-logstash"
                port = "logstash"
            }

            resources {
                cpu = 200
                memory = 1024
            }
        }
    }
}

```