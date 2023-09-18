---
description: Vault 구성 포트 정보
tag: ["vault", "port", "requirement"]
---

# Vault Listen Address & Port
> <https://learn.hashicorp.com/tutorials/vault/reference-architecture#network-connectivity>

## Vault 포트

### TCP
- Url : <https://www.vaultproject.io/docs/configuration/listener/tcp#tcp-listener-parameters>
  - address default : `127.0.0.1:8200`
  - cluster_address default : `127.0.0.1:8201`

| Source          | Destination   | port | protocol | Direction     | Purpose                               |
| :-------------- | :------------ | :--- | :------- | :------------ | :------------------------------------ |
| 외부 호출지점에서   | Vault 서버로 | 8200 | tcp      | 인바운드      | Vault API                             |
| Vault 서버 에서   | Vault 서버로 | 8200 | tcp      | 양방향 | Cluster bootstrapping                 |
| Vault 서버 에서   | Vault 서버로 | 8201 | tcp      | 양방향 | Raft, replication, request forwarding |


### Listening on Multiple Interfaces
```hcl
listener "tcp" {
  address = "127.0.0.1:8200"
}

listener "tcp" {
  address = "10.0.0.5:8200"
}

# Advertise the non-loopback interface
api_addr = "https://10.0.0.5:8200"
cluster_addr = "https://10.0.0.5:8201"
```

### Listening on all IPv6 & IPv4 Interfaces
```hcl
listener "tcp" {
  address         = "[::]:8200"
  cluster_address = "[::]:8201"
}
```

### Listening to specific IPv6 address
```hcl
listener "tcp" {
  address         = "[2001:1c04:90d:1c00:a00:27ff:fefa:58ec]:8200"
  cluster_address = "[2001:1c04:90d:1c00:a00:27ff:fefa:58ec]:8201"
}

# Advertise the non-loopback interface
api_addr = "https://[2001:1c04:90d:1c00:a00:27ff:fefa:58ec]:8200"
cluster_addr = "https://[2001:1c04:90d:1c00:a00:27ff:fefa:58ec]:8201"
```