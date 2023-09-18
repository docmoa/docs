---
description: Nomad Sample
tag: ["Nomad", "Sample", "Job","reverse proxy","consul service discovery"]
---

# nginx
- nomad와 consul로 cluster로 구성되어 있는 환경에 L4이후에 nomad로 LB를 해야할 경우 사용
  - nginx server_name설정에서 도메인을 받아오고 location에서는 각각의 서브도메인 별로 reverse proxy 동작
    - reverse proxy(up stream)에서는 각각의 consul의 등록된 서비스 호출

```hcl
job "nginx" {
  datacenters = ["dc1"]

  group "nginx" {
    //인증서는 host volume에 업로드
    volume "certs" {
      type      = "host"
      source    = "certs"
      read_only = true
    }
 
    network {
      port "http" {
        static  = 80
        to      = 80
      }
      port "https" {
        to      = 443
        static  = 443
      }
    }

    service {
      name = "nginx"
      port = "http"
      tags = ["web"]
      check {    
        type     = "tcp"
        port     = "http"
        interval = "2s"
        timeout  = "2s"
      }
    }

    task "server" {

      driver = "docker"

      volume_mount {
        volume      = "certs"
        destination = "/etc/nginx/certs"
      }

      config {
        image = "nginx"
        ports = ["http","https"]
        #ports = ["http","https"]
        volumes = [
          "local:/etc/nginx/conf.d",
        ]
      }

      template {
        data = <<EOF

upstream login.shoping.co.kr {
{{ range service "login" }}
  server {{ .Address }}:{{ .Port }};
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}
upstream singup.shoping.co.kr {
{{ range service "signup" }}
  server {{ .Address }}:{{ .Port }};
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}
upstream main.shoping.co.kr {
{{ range service "main" }}
  server {{ .Address }}:{{ .Port }};
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}

server {
   listen 80;
   listen 443 ssl;
   //domain 및 subdomain호출
   server_name *.shoping.co.kr;
   ssl_certificate "/etc/nginx/certs/server.pem";
   ssl_certificate_key "/etc/nginx/certs/server.key";
   proxy_read_timeout      300;
   proxy_buffers           64 16k;

   //각 sub도메인별
   location / {
      if ($host = login.shoping.co.kr) {
        proxy_pass login.shoping.co.kr;
      }
      if ($host = singup.shoping.co.kr) {
        proxy_pass singup.shoping.co.kr;
      }
      if ($host !~ "(.*main)") {
        proxy_pass main.shoping.co.kr;
      }
   }
}



EOF

        destination   = "local/load-balancer.conf"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }
      resources {
        cpu = 2000
        memory = 2000
      }
    }
  }
}


```