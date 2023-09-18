---
description: Vault 설치 구성을 위한 사이징 가이드
tag: ["vault", "sizing"]
---

# Vault Sizing
> <https://learn.hashicorp.com/tutorials/vault/reference-architecture#deployment-system-requirements>
>
> Vault의 Backend-Storage 사용 여부에 따라 구성에 차이가 발생


## Vault (Raft - self hosted storage)

![Vault reaches a milestone as HashiCorp releases Vault 1.4 - Amazic World](https://amazicworld.com/wp-content/uploads/2020/04/Vault_internal_storage.png)

| Size | CPU      | Memory       | Disk   | Typical Cloud Instance Types      |
| :--- | :------- | :----------- | :----- | :-------------------------------- |
| 최소 | 2 core   | 4-8 GB RAM   | 50 GB  | 2 vCPU, 8 GB Mem, 10Gbps Network  |
| 권장 | 4-8 core | 16-32 GB RAM | 200 GB | 4 vCPU, 16 GB Mem, 10Gbps Network |

- HA 구성을 위해 3대 이상의 홀수 구성



## Vault - Consul(Backend Storage)

![Vault High Availability with Consul | Vault - HashiCorp Learn](https://mktg-content-api-hashicorp.vercel.app/api/assets?product=tutorials&version=main&asset=public%2Fimg%2Fvault%2Fvault-consul-storage-oss-reference-architecture.svg)

### Vault

| Size | CPU      | Memory       | Disk   | Typical Cloud Instance Types      |
| :--- | :------- | :----------- | :----- | :-------------------------------- |
| 최소 | 2 core   | 4-8 GB RAM   | 20 GB  | 2 vCPU, 8 GB Mem, 10Gbps Network  |
| 권장 | 4-8 core | 16-32 GB RAM | 100 GB | 4 vCPU, 16 GB Mem, 10Gbps Network |

- HA 구성을 위해 2대 이상 구성

### Consul

| Size  | CPU      | Memory       | Disk   | Typical Cloud Instance Types      |
| :---- | :------- | :----------- | :----- | :-------------------------------- |
| Small | 2 core   | 4-8 GB RAM   | 25 GB  | 2 vCPU, 8 GB Mem, 10Gbps Network  |
| Large | 4-8 core | 16-32 GB RAM | 100 GB | 4 vCPU, 16 GB Mem, 10Gbps Network |

- Vault Backend Storage로 사용
- HA 구성을 위해 3대 이상 홀수 구성