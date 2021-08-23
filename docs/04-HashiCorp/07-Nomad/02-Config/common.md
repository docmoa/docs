---
meta:
  - name: description
    content: Nomad Common Configuration
tags: ["Nomad", "Enterprise", "Configuration", "Common"]
---

# Consul 공통 설정
::: tip
최대한 설정값을 넣어보고, 번역기도 돌려보고 물어도 보고 넣은 server, client의 공통설정 파일입니다.
저는 agent.hcl파일안에 다 넣고 실행하지만 나눠서 추후에는 기능별로 나눠서 사용할 예정입니다.
:::

```
#nomad 공통 설정
datacenter = "dc1"
region = "global"
data_dir = "/opt/nomad/nomad"
bind_addr = "{{ GetInterfaceIP `ens192` }}"
 
advertise {
  # Defaults to the first private IP address.
  #http = "{{ GetInterfaceIP `ens244` }}"
  #rpc  = "{{ GetInterfaceIP `ens244` }}"
  #serf = "{{ GetInterfaceIP `ens244` }}"
  http = "{{ GetInterfaceIP `ens192` }}"
  rpc = "{{ GetInterfaceIP `ens192` }}"
  serf = "{{ GetInterfaceIP `ens192` }}"
}
 
consul {
  address  = "127.0.0.1:8500"
  server_service_name = "nomad"
  client_service_name = "nomad-client"
  auto_advertise  = true
  server_auto_join  = true
  client_auto_join  = true
  token = "33ee4276-e1ef-8e5b-d212-1f94ca8cf81e"
}
enable_syslog = false
enable_debug = false
disable_update_check = false
 
log_level = "DEBUG"
log_file = "/var/log/nomad/nomad.log"
log_rotate_duration = "24h"
log_rotate_bytes = 104857600
log_rotate_max_files = 100
 
ports {
  http = 4646
  rpc = 4647
  serf = 4648
}
 
telemetry {
  collection_interval = "1s"
  disable_hostname = true
  prometheus_metrics = true
  publish_allocation_metrics = true
  publish_node_metrics = true
}
 
 
plugin "docker" {
  config {
    auth {
      config = "/root/.docker/config.json"
    }
    infra_image = "google-containers/pause-amd64:3.1"
  }
}
 
acl {
  enabled = true
}
```