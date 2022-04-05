---
meta:
  - name: description
    content: Envoy proxy 50x Error
tags: ["Consul", "ServiceMesh", "SideCar", "Kubernetes", "K8S"]
---

# Connection termination

> blog : <https://medium.com/expedia-group-tech/all-about-istio-proxy-5xx-issues-e0221b29e692>  
> issue : <https://github.com/envoyproxy/envoy/issues/14981>  
> envoy proxy error code : <https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_conn_man/response_code_details>

## 로그
```bash
[debug] [router] upstream reset: reset reason: connection termination, transport failure reason.
[debug] [http] Sending local reply with details upstream_reset_before_response_started(connection termination).
```

## 현상
- upstream_reset_before_response_started : The upstream connection was reset before a response was started This may include further details about the cause of the disconnect.

## connection termination

원인 1: Envoy에서 TCP 연결(FIN)이 닫는 현상 보고됨 - Keepalive time 이슈
해결 1 - 1: Keepalive time을 끄거나 
해결 1 - 2: max_requests_per_connection 을 1로 설정
해결 1 - 3: Keepalive interval을 짧게 (10초)

원인 2 : Kubernetes 내부 기본 TCP 계층 4 연결 부하 분산의 제한, (e.g. tomcat - maxKeepAliveRequests) 
해결 2 - 1: 애플리케이션의 KeepAlive를 끔

원인 3 : 외부 서비스에 대해 요청시 Envoy Proxy는 애플리케이션이 연결을 닫으려 하지 않는 한 영구적으로 연결을 닫지 않으므로 신규요청 발생시 IPSET이 만료되는 (1시간) 시간이 지나 DNS 확인 없이 동일한 IP로 요청하는 경우
해결 3 - 1: Keepalive time을 끄거나 
해결 3 - 2: 시간 초과 값을 늘임
해결 3 - 3: dns_refresh_rate 간격을 짧게 (300초)
