---
description: Nomad Namespace
tag: ["Nomad", "SSL"]
---

# Nomad 인증서 생성
::: tip
공식 사이트에 consul 인증서 생성 가이드는 있는데 Nomad 인증서 생성가이드는
Show Terminal을 들어가야 볼 수 있기때문에 귀찮음을 해결하기 위해 공유합니다.
:::


## Nomad 인증서 생성
```
consul tls ca create -domain=nomad -days 3650

consul tls cert create -domain=nomad -dc=global  -server -days 3650

consul tls cert create -domain=nomad -dc=global  -client -days 3650

consul tls cert create -domain=nomad -dc=global  -cli -days 3650
```

## Nomad env 설정
```
export NOMAD_CACERT="${HOME}/tls/nomad-agent-ca.pem"

export NOMAD_CLIENT_CERT="${HOME}/tls/global-cli-nomad-0.pem"

export NOMAD_CLIENT_KEY="${HOME}/tls/global-cli-nomad-0-key.pem"

export NOMAD_ADDR="https://127.0.0.1:4646"
```