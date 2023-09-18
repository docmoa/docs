---
description: Consul Template
tag: ["Consul", "Consul Template", "NGINX"]
---

# NGINX Sample

참고 : <https://learn.hashicorp.com/tutorials/consul/load-balancing-nginx>

## 템플릿 파일 변환 하기

### 템플릿 파일 작성

- 대상 서비스 : nginx-backend

```hcl
# nginx.conf.ctmpl
upstream backend {
  {{- range service "nginx-backend" }}
  server {{.Address}}:{{.Port}} max_fails=3 fail_timeout=60 weight=1;
  {{else}}server 127.0.0.1:65535; # force a 502
  {{- end}}
}

server {
  listen 80 default_server;

  location /stub_status {
    stub_status;
  }

  location / {
    proxy_pass http://backend;
  }
}
```

### 실행

```bash
$ consul-template -template="./nginx.conf.ctmpl:./nginx.conf"
```

::: vue
.
├── nginx.conf.ctmpl
└── `nginx.conf`
:::


## Config 활용

### CLI Inline의 옵션을 정의하는 config 작성

```hcl
# consul-template-nginx.hcl
consul {
  address = "localhost:8500"

  retry {
    enabled  = true
    attempts = 12
    backoff  = "250ms"
  }
}
template {
  source      = "./nginx.conf.ctmpl"
  destination = "./nginx.conf"
  perms       = 0644
  command     = "echo 'service nginx reload'"
}
```

### 실행

```bash
$ consul-template -config=consul-template-nginx.hcl
service nginx reload
```