---
meta:
  - name: description
    content: Consul Server Configuration
tags: ["Consul", "Enterprise", "Configuration", "Client"]
---

# Consul 서버 설정
::: tip
최대한 설정값을 넣어보고, 번역기도 돌려보고 물어도 보고 넣은 Client설정 파일입니다.
네트워크는 프라이빗(온프레이머스) 환경입니다.
:::

```
#consul client 설정
server = false
 
acl = {
  enabled = true
  default_policy = "deny"
  enable_token_persistence = true
  tokens = {
    agent = "f820514a-5215-e741-fcb3-c00857405230"
  }
}
 
license_path = "/opt/license/consul.license"
 
retry_join = ["172.30.1.17","172.30.1.18","172.30.1.19"]
 
rejoin_after_leave = true
 
 
#tls 설정
ca_file = "/opt/ssl/consul/consul-agent-ca.pem"
auto_encrypt = {
  tls = true
}
 
verify_incoming = false
verify_outgoing = true
verify_server_hostname = true
```