---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job"]
---

# vaultKV
## nomad job에서 vault의 secret에서 kv사용하기
- [Nomad 설정 링크](/04-HashiCorp/07-Nomad/02-Config/integrateVault.html)
## nomad hcl 설정

```hcl
job "logs" {
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
          port "elk" {
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

            vault {
              policies  = ["admin"]
              change_mode   = "signal"
              change_signal = "SIGINT"
            }

            config {
                image = "elasticsearch:7.16.2"
                ports = ["elk"]
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
      template {
        data = <<EOH
ELASTIC_PASSWORD="{{with secret "secret/elastic"}}{{.Data.passwd}}{{end}}"
EOH

  destination = "secrets/file.env"
  env         = true
}

            service {
                name = "${TASKGROUP}-elasticsearch"
                port = "elk"
            }

            resources {
                cpu = 500
                memory = 1048
            }
        }

        task "kibana" {
            driver = "docker"

            vault {
              policies  = ["admin"]
              change_mode   = "signal"
              change_signal = "SIGINT"
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
{{ with secret "secret/elastic" }}
elasticsearch.password: {{.Data.passwd}}
{{ end }}

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