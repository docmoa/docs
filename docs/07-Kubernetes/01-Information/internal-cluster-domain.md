---
description: "svc.cluster.local은 쿠버네티스 클러스터 내부에서 서비스(Service) 간 통신을 위해 사용하는 기본 도메인 접미사(Internal Cluster Domain)입니다."
tag: ["kubernetes", "dns"]
---

# Internal Cluster Domain

> [서비스 및 파드용 DNS](https://kubernetes.io/ko/docs/concepts/services-networking/dns-pod-service/) 참고

`svc.cluster.local`은 쿠버네티스 클러스터 내부에서 서비스(Service) 간 통신을 위해 사용하는 기본 도메인 접미사(Internal Cluster Domain)입니다. CoreDNS에 의해 관리되며, 서비스명과 네임스페이스를 조합하여 `<서비스명>.<네임스페이스>.svc.cluster.local` 형태의 고유한 내부 FQDN(Fully Qualified Domain Name)을 제공하여 파드 간 통신을 용이하게 합니다. 

## 핵심 특징:

- 내부 통신 전용: 쿠버네티스 클러스터 내부 네트워크에서만 유효한 사설 DNS 도메인입니다.
- 구조: `<서비스명>.<네임스페이스>.svc.cluster.local` 형태를 갖습니다.
- DNS 기반 서비스 발견: 파드는 이 도메인을 사용하여 IP 주소가 변경되더라도 서비스 이름으로 대상 서비스에 안정적으로 접근할 수 있습니다.
- 약어 사용: 같은 네임스페이스 내에서는 `<서비스명>`만, 다른 네임스페이스에서는 `<서비스명>.<네임스페이스>`만 사용하여 통신할 수도 있습니다. 

## 주요 활용 예시:

`web-service`라는 서비스가 `default` 네임스페이스에 있을 때, 다른 파드에서 이 서비스로 접근하기 위한 전체 도메인은 `web-service.default.svc.cluster.local`이 됩니다.

## AAAA 레코드 조회

```bash
dig AAAA web-service.default.svc.cluster.local

; <<>> DiG 9.16.26 <<>> AAAA web-service.default.svc.cluster.local
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 1000
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;web-service.default.svc.cluster.local. IN AAAA
```

