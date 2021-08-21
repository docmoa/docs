---
meta:
  - name: description
    content: Consul Server Configuration
tags: ["Consul", "Enterprise", "Configuration", "Server"]
---

# Consul 서버 설정
::: tip
최대한 설정값을 넣어보고, 번역기도 돌려보고 물어도 보고 넣은 server설정 파일입니다.
네트워크는 프라이빗(온프레이머스) 환경입니다.
:::

```
#consul server 설정
server = true
ui_config {
  enabled = true
}
bootstrap_expect = 3
 
client_addr = "0.0.0.0"
 
license_path = "/opt/license/consul.license"
 
retry_join = ["172.30.1.17","172.30.1.18","172.30.1.19"]
 
performance {
  raft_multiplier = 1
}
 
#raft protocal 버전, consul 업데이트 시 1씩 증가
raft_protocol = 3
 
#node가 완전히 삭제되는 시간
reconnect_timeout = "72h"
 
raft_snapshot_interval = "5s"
 
#해당 서버를 non-voting server로 지정
#read_replica = false
 
limits {
  http_max_conns_per_client = 200
  rpc_handshake_timeout = "5s"
}
 
key_file = "/opt/ssl/consul/dc1-server-consul-0-key.pem"
cert_file = "/opt/ssl/consul/dc1-server-consul-0.pem"
ca_file = "/opt/ssl/consul/consul-agent-ca.pem"
auto_encrypt {
  allow_tls = true
}
 
verify_incoming = false,
verify_incoming_rpc = true
verify_outgoing = true
verify_server_hostname = false
```