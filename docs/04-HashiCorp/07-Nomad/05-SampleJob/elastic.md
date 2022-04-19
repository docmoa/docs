---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job"]
---

# Elastic

```hcl
job "elastic" {
  datacenters = ["dc1"]

  group "elastic" {
    network {
      port "db" {
        static = 9200
      }
      port "kibana" {
        static = 5601
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

    task "elasticsearch" {
      driver = "docker"

      config {
        image = "docker.elastic.co/elasticsearch/elasticsearch:6.8.9"
        ports = ["db"]
        mount = [
          {
            type   = "bind"
            source = "local/elasticsearch.yml"
            target = "/usr/share/elasticsearch/config/elasticsearch.yml"
          }
        ]
      }

      template {
        data = <<EOH
network.host: 0.0.0.0
discovery.seed_hosts: ["127.0.0.1"]
xpack.security.enabled: true
xpack.license.self_generated.type: trial
xpack.monitoring.collection.enabled: true
EOH
        destination = "local/elasticsearch.yml"
      }

      env {
        # "discovery.type":"single-node",
        ES_JAVA_OPTS = "-Xms512m -Xmx1024m"
      }

      resources {
        cpu    = 2000
        memory = 1024
      }
    }

    task "kibana" {
      driver = "docker"

      config {
        image = "docker.elastic.co/kibana/kibana:6.8.9"
        ports = ["kibana"]
        mount = [
          {
            type   = "bind"
            source = "local/kibana.yml"
            target = "/usr/share/kibana/config/kibana.yml"
          }
        ]
      }

      template {
        data = <<EOH
server.name: kibana
elasticsearch.username: elastic
elasticsearch.password: elastic
EOH
        destination = "local/kibana.yml"
      }

      env {
        ELASTICSEARCH_URL="http://172.28.128.31:9200"
      }

      resources {
        cpu    = 1000
        memory = 1024
      }
    }
  }
}

```