---
meta:
  - name: description
    content: Consul Health Check 
tags: ["Consul"]
---

# Consul Health Check on VMs
><https://www.consul.io/docs/discovery/services> 
><https://learn.hashicorp.com/tutorials/consul/service-registration-health-checks?in=consul/developer-discovery#tuning-scripts-to-be-compatible-with-consul>

### 1. 스트립트 Health Check를 위한 설정 
Consul config 디렉토리 하위에 monitor.hcl파일을 만듭니다.
```
services {
  id = "web-service"
  namd = "web-service"
  address = "10.10.10.201"
  port = 8080
  checks = [
    {
      script = "/opt/consul/script/ps-check.sh"
      interval = "180s"
    }
  ]
}
```

### 2. 스크립트 Health Check시 Consul설정 
Consul에서 스크립트 기반의 설정시 Config파일 내에 하기와 같은 옵션이 추가되어야 합니다. 
```
(기존설정)
.....
enable_script_checks = "true" 또는 
enable_local_script_checks = "true"

```
참고 Url : <https://www.consul.io/docs/agent/options#_enable_script_checks>