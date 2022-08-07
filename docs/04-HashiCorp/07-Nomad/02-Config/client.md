---
meta:
  - name: description
    content: Nomad Client Configuration
tags: ["Nomad", "Enterprise", "Configuration", "Client"]
---

# Nomad 클라이언트 설정
::: tip
최대한 설정값을 넣어보고, 번역기도 돌려보고 물어도 보고 넣은 Client설정 파일입니다.
네트워크는 프라이빗(온프레이머스) 환경입니다.
:::

```hcl
#nomad client 설정
 
client {
  enabled = true
  servers = ["172.30.1.17","172.30.1.18","172.30.1.19"]
  server_join {
    retry_join = ["172.30.1.17","172.30.1.18","172.30.1.19"]
    retry_max = 3
    retry_interval = "15s"
  }
  #host에서 nomad에서 사용할 수 있는 volume 설정
  host_volume "logs" {
    path      = "/var/logs/elk/"
    read_only = false
  }
  #각각의 client의 레이블 작성
  #meta {
  #   name = "moon"
  #   zone = "web"
  #}
  #nomad에서 예약할 자원
  reserved {
    #Specifies the amount of CPU to reserve, in MHz.
    cpu = 200
    #Specifies the amount of memory to reserve, in MB.
    memory = 8192
    #Specifies the amount of disk to reserve, in MB.
    disk = 102400
  }
  no_host_uuid = true
  #bridge network interface name
  bridge_network_name = "nomad"
  bridge_network_subnet = "172.26.64.0/20"
  cni_path = "/opt/cni/bin"
  cni_config_dir = "/opt/cni/config"
}
#tls 설정
tls {
  http = true
  rpc  = true
 
  ca_file   = "/opt/ssl/nomad/nomad-agent-ca.pem"
  cert_file = "/opt/ssl/nomad/global-client-nomad-0.pem"
  key_file  = "/opt/ssl/nomad/global-client-nomad-0-key.pem"
 
  verify_server_hostname = true
  verify_https_client    = true
}
```

# Nomad 클라이언트 최소 설정 (20220807기준)
```bash
data_dir  = "/opt/nomad/data"
bind_addr = "0.0.0.0"

client {
  enabled = true
  servers = ["server ip"]
  # sidecar image 고정
  meta {
   connect.sidecar_image = "envoyproxy/envoy:v1.21.3"
  }
}

#consul 정보 입력
consul {
  address  = "127.0.0.1:8501"
  grpc_address="127.0.0.1:8502"
  server_service_name = "nomad"
  client_service_name = "nomad-client"
  auto_advertise  = true
  server_auto_join  = true
  client_auto_join  = true
  ssl       = true
  verify_ssl = false
  ca_file   = "/opt/consul/consul-agent-ca.pem"
  cert_file = "/opt/consul/my-dc-client-consul-0.pem"
  key_file  = "/opt/consul/my-dc-client-consul-0-key.pem"
}

plugin "docker" {
  config {
    auth {
    }
  }
}

```