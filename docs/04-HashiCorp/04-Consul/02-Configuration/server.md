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

# Consul 서버 최소한 설정
::: tip
최소한의 설정만 있는 consul 설정입니다.
:::

```bash
data_dir = "/opt/consul"

client_addr = "0.0.0.0"

datacenter = "my-dc"

#ui
ui_config {
  enabled = true
}

# server
server = true

# Bind addr
bind_addr = "0.0.0.0" # Listen on all IPv4
# Advertise addr - if you want to point clients to a different address than bind or LB.
advertise_addr = "node ip"

# Enterprise License
license_path = "/opt/consul/consul.lic"

# bootstrap_expect
bootstrap_expect=1

# encrypt
encrypt = "7w+zkhqa+YD4GSKXjRWETBIT8hs53Sr/w95oiVxq5Qc="

# retry_join
retry_join = ["Server ip"]

key_file = "/opt/consul/ebay-server-consul-0-key.pem"
cert_file = "/opt/consul/ebay-server-consul-0.pem"
ca_file = "/opt/consul/consul-agent-ca.pem"
auto_encrypt {
  allow_tls = true
}

verify_incoming = false
verify_incoming_rpc = false
verify_outgoing = false
verify_server_hostname = false

ports {
  http = 8500
  dns = 8600
  server = 8300
}


```