---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job","Vault","SWLB"]
---

# Vault SWLB용도의 nginx
- Vault의 HA구성 시에는 LB가 필요한데, LB대용으로 SWLB를 이용하여 Vault를 사용할 수 있다.
  - 해당 페이지에서는 nginx를 사용하였지만, HAproxy도 비슷하게 사용이 가능하다.

# nginx job 파일 
```hcl
job "nginx" {
  datacenters = ["dc1"]

  group "nginx" {

    constraint {
      attribute = "${attr.unique.hostname}"
      value     = "slave0"
    }

    #Vault tls가 있고 nomad client hcl 파일에 host volume이 명시되어 있는 설정 값
    volume "cert-data" {
      type      = "host"
      source    = "cert-data"
      read_only = false
    }

    #실패 없이 되라고 행운의 숫자인 7을 4번 줌
    network {
      port "http" {
        to     = 7777
        static = 7777
      }
    }

    service {
      name = "nginx"
      port = "http"
    }

    task "nginx" {
      driver = "docker"

      volume_mount {
        volume      = "cert-data"
        destination = "/usr/local/cert"
      }

      config {
        image = "nginx"

        ports = ["http"]
        volumes = [
          "local:/etc/nginx/conf.d",

        ]
      }
      template {
        data = <<EOF        
#Vault는 active서버 1대외에는 전부 standby상태이며 
#서비스 호출 시(write)에는 active 서비스만 호출해야함으로 아래와 같이 consul에서 서비스를 불러옴

upstream backend {
{{ range service "active.vault" }}
  server {{ .Address }}:{{ .Port }};
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}

server {
   listen 7777 ssl;
   #위에서 nomad host volume을 mount한 cert를 가져옴
   ssl on;
   ssl_certificate /usr/local/cert/vault/global-client-vault-0.pem;
   ssl_certificate_key /usr/local/cert/vault/global-client-vault-0-key.pem;

   location / {
      proxy_pass https://backend;
   }
}
EOF

        destination   = "local/load-balancer.conf"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }
      resources {
        cpu = 100
        memory = 201
      }
    }
  }
}
```