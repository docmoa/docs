---
meta:
  - name: description
    content: SSH Too many authentication failures
tags: ["Consul", "ServiceMesh", "SideCar", "Kubernetes", "K8S"]
---

# Consul Sidecar Inject not working on K8S

> Consul Version : 1.9.x  
> Helm Chart : 0.30.0

Consul을 쿠버네티스 상에 구성하게 되면 `annotation` 구성만으로도 쉽게 Sidecar를 애플리케이션과 함께 배포 가능하다.

참고 : [Controlling Injection Via Annotation](https://www.consul.io/docs/k8s/connect#controlling-injection-via-annotation)

```yaml
annotations:
  'consul.hashicorp.com/connect-inject': 'true'
```

Consul Sidecar가 Pod 배포시 함께 구성되야 하는 것이 정상이나, Sidecar의 생성 실패나 이미지 가져오기 실패라는 언급도 없이 Sidecar의 injection이 동작하지 않는 경우가 있다.

## Log 확인
쿠버네티스 상의 Consul을 구성하게 되면 injector가 Sidecar를 함께 배포하는 작업을 수행하므로 먼저 해당 컴포넌트의  로그를 확인한다.
```bash
kubectl logs -n consul -l component=connect-injector -f
```

## Kubernetes API 확인
`annotation`의 동작은 쿠버네티스 컨트롤 플래인, 즉, 쿠버네티스의 API를 통해 요청되므로 해당 API를 통해 Consul에 접근이 가능한지 확인이 필요하다.
consul-inject에서 kubernetest api 접속이 불가하다면 `500`에러가 발생한다.

1. api 접속을 위한 proxy를 활성화
    ```bash
    $ kubectl proxy
    Starting to serve on 127.0.0.1:8001
    ```
2. 다른 터미널에서 API로 확인
    - 정상인 경우
    ```bash
    $ curl -vv localhost:8001/api/v1/namespaces/consul/services/https:consul-connect-injector-svc:443/proxy/health/ready
    *   Trying 127.0.0.1...
    * TCP_NODELAY set
    * Connected to localhost (127.0.0.1) port 8001 (#0)
    > GET /api/v1/namespaces/consul/services/https:consul-connect-injector-svc:443/proxy/health/ready HTTP/1.1
    > Host: localhost:8001
    > User-Agent: curl/7.61.1
    > Accept: */*
    >
    < HTTP/1.1 204 No Content
    < Audit-Id: 52947d1d-0c90-47eb-8dc2-6c2efa0193fa
    < Cache-Control: no-cache, private
    < Date: Fri, 06 Aug 2021 10:15:21 GMT
    <
    * Connection #0 to host localhost left intact
    ```
    - 쿠버네티스 API 접근이 안되는 경우
    ```bash
    *   Trying 127.0.0.1...                                      
    * TCP_NODELAY set                                            
    * Connected to localhost (127.0.0.1) port 8001 (#0)          
    > GET /api/v1/namespaces/consul/services/https:consul-connect
    -injector-svc:443/proxy/health/ready HTTP/1.1                
    > Host: localhost:8001                                       
    > User-Agent: curl/7.61.1                                    
    > Accept: */*                                                
    >                                                            
    < HTTP/1.1 500 Internal Server Error                         
    < Audit-Id: acb30d91-d8db-463e-a91e-1e2a5382329e             
    < Cache-Control: no-cache, private                           
    < Content-Length: 178                                        
    < Content-Type: application/json
    < Date: Fri, 06 Aug 2021 11:04:38 GMT                        
    <                                                            
    {                                                            
      "kind": "Status",
      "apiVersion": "v1",                                        
      "metadata": {                                              
                                                                
      },                                                         
      "status": "Failure",                                       
      "message": "error trying to reach service: Address is not a
      llowed",                                                     
      "code": 500
    }
    * Connection #0 to host localhost left intact
    ```