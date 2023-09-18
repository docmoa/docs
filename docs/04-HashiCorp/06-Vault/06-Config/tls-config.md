---
description: Nomad Common Configuration
tag: ["Vault", "https", "Configuration", "Server"]
---

# Vault Server tls 설정
- Consul tls create 명령어를 이용하여 인증서 생성, 그외에 사설인증서 만드는 방법으로는 더 테스트 해봐야 할듯 

```bash
# consul tls create로 인증서 생성
consul tls ca create -domain=vault -days 3650
consul tls cert create -domain=vault -dc=global  -server -days 3650
consul tls cert create -domain=vault -dc=global  -client -days 3650
consul tls cert create -domain=vault -dc=global  -cli -days 3650

# vault config는 아래와 같다.
ui = true

storage "consul" {
  address = "127.0.0.1:8500"
  path    = "vault/"
}

listener "tcp" {
  address         = "0.0.0.0:8200"
  #tls_disable = 1
  tls_cert_file = "/root/temp/global-server-vault-0.pem"
  tls_key_file  = "/root/temp/global-server-vault-0-key.pem"
}

disable_mlock = true
default_lease_ttl = "768h"
max_lease_ttl = "768h"

api_addr =  "https://172.21.2.50:8200"

# 명령어를 써야 할 경우 cli 인증서를 export 해줘야한다.
export VAULT_CACERT="${HOME}/temp/vault-agent-ca.pem"
export VAULT_CLIENT_CERT="${HOME}/temp/global-cli-vault-0.pem"
export VAULT_CLIENT_KEY="${HOME}/temp/global-cli-vault-0-key.pem"
```