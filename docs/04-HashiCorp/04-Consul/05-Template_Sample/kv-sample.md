---
description: Consul Template
tag: ["Consul", "Consul Template"]
---

# KV Sample

참고 : <https://learn.hashicorp.com/tutorials/consul/consul-template>

## 템플릿 파일 변환 하기

### 템플릿 파일 작성

- 대상 kv : apache/version

```hcl
# apache_install.sh.ctmpl
#!/bin/bash
sudo apt-get remove -y apache2
sudo apt-get install -y apache2={{ key "/apache/version" }}
```

### consul에 KV추가

consul kv put apache/version 2.2.14-5ubuntu8.7

### 실행

```bash
$ consul-template -template="./apache_install.sh.ctmpl:./apache_install.sh" -once
```

::: info 파일 구조
```bash:no-line-numbers
.
├── apache_install.sh.ctmpl
└── `apache_install.sh`
```
:::


### 내용 확인

```bash
#!/bin/bash
sudo apt-get remove -y apache2
sudo apt-get install -y apache2=2.2.14-5ubuntu8.7
```

## Config 활용

### CLI Inline의 옵션을 정의하는 config 작성

```hcl
# consul-template-apache-install.hcl
consul {
  address = "localhost:8500"

  retry {
    enabled  = true
    attempts = 12
    backoff  = "250ms"
  }
}
template {
  source      = "./apache_install.sh.ctmpl"
  destination = "./apache_install.sh"
  perms       = 0644
  command     = "echo './apache_install.sh'"
}
```

### 실행

```bash
$ consul-template -config=consul-template-apache-install.hcl
apache_install.sh
```