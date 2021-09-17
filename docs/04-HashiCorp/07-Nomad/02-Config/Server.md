---
meta:
  - name: description
    content: Nomad Server Configuration
tags: ["Nomad", "Enterprise", "Configuration", "Server"]
---

# Nomad 서버 설정
::: tip
최대한 설정값을 넣어보고, 번역기도 돌려보고 물어도 보고 넣은 server설정 파일입니다.
네트워크는 프라이빗(온프레이머스) 환경입니다.
:::

```hcl
#nomad server 설정
server {
  enabled = true
  bootstrap_expect = 3
  license_path="/opt/nomad/license/nomad.license"
  server_join {
    retry_join = ["172.30.1.17","172.30.1.18","172.30.1.19"]
  }
  raft_protocol = 3
  event_buffer_size = 100
  non_voting_server = false
  heartbeat_grace = "10s"
}
 
 
#tls 설정
tls {
  http = true
  rpc  = true
 
  ca_file   = "/opt/ssl/nomad/nomad-agent-ca.pem"
  cert_file = "/opt/ssl/nomad/global-server-nomad-0.pem"
  key_file  = "/opt/ssl/nomad/global-server-nomad-0-key.pem"
 
  #UI오픈할 서버만 변경
  verify_server_hostname = false
  verify_https_client    = false
  #일반서버는 아래와 같이 설정
  verify_server_hostname = true
  verify_https_client    = true
}
```