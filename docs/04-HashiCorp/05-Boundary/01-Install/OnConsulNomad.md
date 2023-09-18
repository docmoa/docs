---
description: Boundary Install
tag: ["Boundary", "Install"]
---

# Boundary Install on Consul-Nomad

## 1. Nomad namespace create

```bash
nomad namespace apply -description "Boundary" boundary
```

## 2. Postgresql setup

### 2.1 Postgresql job run
::: details postgresql.nomad
```hcl
job "postgresql" {
  type = "service"
  datacenters = ["hashistack"]
  namespace = "boundary"

  group "postgres" {
    count = 1

    volume "postgres-vol" {
      type = "host"
      read_only = false
      source = "postgres-vol"
    }

    task "db" {
      driver = "docker"

      volume_mount {
        volume = "postgres-vol"
        destination = "/var/lib/postgresql/data"
        read_only = false
      }

      config {
        image = "postgres:13.2"
        port_map {
          pg = 5432
        }
      }
      
      env {
        POSTGRES_PASSWORD = "postgres"
        POSTGRES_USER = "postgres"
        PGDATA = "/var/lib/postgresql/data/pgdata"
      }

      resources {
        memory = 1024

        network {
          port "pg" {
            static = 5432
          }
        }
      }

      service {
        name = "postgresql"
        tags = ["db", "boundary"]

        port = "pg"

        check {
          type  = "tcp"
          interval = "10s"
          timeout  = "2s"
          port  = "pg"
        }
      }
    }
  }
}
```
:::

```bash
nomad job run -namespace="boundary" postgresql.nomad
```


### 2.2 Posgresql init

```bash
# Login
psql -h 172.28.128.11 -U postgres postgres
```
```sql
# <enter the password> postgres
CREATE ROLE boundary WITH LOGIN PASSWORD 'PASSWORD';
CREATE DATABASE boundary OWNER boundary;
GRANT ALL PRIVILEGES ON DATABASE boundary TO boundary;
ALTER USER boundary PASSWORD 'boundary';
```

## 3. Boundary database init

### 3.1 Create config file
</tmp/config.hcl>
```hcl
disable_mlock = true

controller {
  name = "controller-0"
  database {
    url = "postgresql://boundary:boundary@172.28.128.11:5432/boundary?sslmode=disable"
  }
}

kms "aead" {
  purpose = "root"
  aead_type = "aes-gcm"
  key = "sP1fnF5Xz85RrXyELHFeZg9Ad2qt4Z4bgNHVGtD6ung="
  key_id = "global_root"
}

kms "aead" {
  purpose = "worker-auth"
  aead_type = "aes-gcm"
  key = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
  key_id = "global_worker-auth"
}

kms "aead" {
    purpose   = "recovery"
    aead_type = "aes-gcm"
    key       = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
    key_id    = "global_recovery"
}
```

### 3.2 Init database

```bash
boundary database init -config=/tmp/config.hcl
```

## 4. Boundary Job

### 4.1 Boundary Controller Job
::: details boundary-controller.nomad
```hcl
locals {
  version = "0.6.2"
  postgre_ip = "172.28.128.11"
  postgre_port = "5432"
}

job "boundary-controller" {
  type = "service"
  datacenters = ["hashistack"]
  namespace = "boundary"

  group "controller" {
    count = 1

    network {
      mode = "host"
    }

    task "migration" {
      driver = "raw_exec"

      env {
        BOUNDARY_POSTGRES_URL = "postgresql://boundary:boundary@${local.postgre_ip}:${local.postgre_port}/boundary?sslmode=disable"
      }
      artifact {
        source = "https://releases.hashicorp.com/boundary/${local.version}/boundary_${local.version}_linux_amd64.zip"
      }
      template {
        data = <<EOH
disable_mlock = true

{{ range service "postgresql" }}
controller {
  name = "controller-0"
  database {
    url = "postgresql://boundary:boundary@{{ .Address }}:{{ .Port }}/boundary?sslmode=disable"
  }
}
{{ end }}

listener "tcp" {
  address = "0.0.0.0:9200"
  purpose = "api"
  tls_disable = true
}
listener "tcp" {
  address = "0.0.0.0:9201"
  purpose = "cluster"
  tls_disable = true
}

kms "aead" {
  purpose = "root"
  aead_type = "aes-gcm"
  key = "sP1fnF5Xz85RrXyELHFeZg9Ad2qt4Z4bgNHVGtD6ung="
  key_id = "global_root"
}

kms "aead" {
  purpose = "worker-auth"
  aead_type = "aes-gcm"
  key = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
  key_id = "global_worker-auth"
}

kms "aead" {
    purpose   = "recovery"
    aead_type = "aes-gcm"
    key       = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
    key_id    = "global_recovery"
}
EOH
        destination = "local/config/config.hcl"
      }
      config {
        command = "local/boundary"
        args = ["database", "migrate", "-config", "local/config/config.hcl"]
      }
      lifecycle {
        hook    = "prestart"
        sidecar = false
      }
    }

    task "controller" {
      driver = "docker"

      config {
        image = "hashicorp/boundary:${local.version}"
        port_map {
          controller = 9200
          cluster = 9201
        }
        mount {
          type   = "bind"
          source = "local/config"
          target = "/boundary"
        }
        // network_mode = "boundary-net"
        // network_aliases = [
        //   "boundary-controller"
        // ]
      }
      
      template {
        data = <<EOH
disable_mlock = true

{{ range service "postgresql" }}
controller {
  name = "controller-0"
  database {
    url = "postgresql://boundary:boundary@{{ .Address }}:{{ .Port }}/boundary?sslmode=disable"
  }
  public_cluster_addr = "{{ env "NOMAD_ADDR_cluster" }}"
}
{{ end }}

listener "tcp" {
  address = "0.0.0.0:9200"
  purpose = "api"
  tls_disable = true
}
listener "tcp" {
  address = "0.0.0.0:9201"
  purpose = "cluster"
  tls_disable = true
}

kms "aead" {
  purpose = "root"
  aead_type = "aes-gcm"
  key = "sP1fnF5Xz85RrXyELHFeZg9Ad2qt4Z4bgNHVGtD6ung="
  key_id = "global_root"
}

kms "aead" {
  purpose = "worker-auth"
  aead_type = "aes-gcm"
  key = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
  key_id = "global_worker-auth"
}

kms "aead" {
    purpose   = "recovery"
    aead_type = "aes-gcm"
    key       = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
    key_id    = "global_recovery"
}
EOH
        destination = "local/config/config.hcl"
      }
      
      env {
        // BOUNDARY_POSTGRES_URL = "postgresql://boundary:boundary@${local.postgre_ip}:${local.postgre_port}/boundary?sslmode=disable"
        SKIP_SETCAP = true
      }

      resources {
        cpu    = 300
        memory = 500
        network {
          port "controller" {
            static = 9200
          }
          port "cluster" {
            static = 9201
          }
        }
      }

      service {
        name = "boundary"
        tags = ["cluster"]

        port = "cluster"

        check {
          type  = "tcp"
          interval = "10s"
          timeout  = "2s"
          port  = "cluster"
        }
      }
    }
  }
}
```
:::

```bash
nomad job run -namespace="boundary" boundary-controller.nomad
```

### 4.2 Boundary worker Job
::: details boundary-controller.nomad
```hcl
locals {
  version = "0.6.2"
}

job "boundary-worker" {
  type = "service"
  datacenters = ["hashistack"]
  namespace = "boundary"
  
  group "worker" {
    count = 1

    scaling {
      enabled = true
      min = 1
      max = 3
    }

    network {
      mode = "host"
    }
    
    task "worker" {
      driver = "docker"

      config {
        image = "hashicorp/boundary:${local.version}"
        port_map {
          proxy = 9202
        }
        volumes = [
          "local/boundary:/boundary/",
        ]
        // network_mode = "boundary-net"
      }
      
      template {
        data = <<EOH
disable_mlock = true

listener "tcp" {
  address = "0.0.0.0:9202"
  purpose = "proxy"
  tls_disable = true
}

worker {
  name = "worker-0"
  controllers = [
{{ range service "boundary" }}
		"{{ .Address }}",
{{ end }}
  ]
  public_addr = "{{ env "NOMAD_ADDR_proxy" }}"
}

kms "aead" {
  purpose = "root"
  aead_type = "aes-gcm"
  key = "sP1fnF5Xz85RrXyELHFeZg9Ad2qt4Z4bgNHVGtD6ung="
  key_id = "global_root"
}

kms "aead" {
  purpose = "worker-auth"
  aead_type = "aes-gcm"
  key = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
  key_id = "global_worker-auth"
}

kms "aead" {
  purpose   = "recovery"
  aead_type = "aes-gcm"
  key       = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
  key_id    = "global_recovery"
}
EOH
        destination = "/local/boundary/config.hcl"
      }
      
      env {
        // BOUNDARY_POSTGRES_URL = "postgresql://boundary:boundary@172.28.128.11:5432/boundary?sslmode=disable"
        SKIP_SETCAP = true
      }

      resources {
        network {
          port "proxy" {}
        }
      }
    }
  }
}
```
:::

```bash
nomad job run -namespace="boundary" boundary-worker.nomad
```

