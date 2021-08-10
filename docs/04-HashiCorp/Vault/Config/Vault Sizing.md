---
meta:
  - name: description
    content: Vault 설치 구성을 위한 사이징 가이드
tags: ["vault", "sizing"]
---

# Vault Sizing
> <https://learn.hashicorp.com/tutorials/vault/reference-architecture#deployment-system-requirements>
- Small : for Dev or Stage
- Large : for Production

## Vault

| Size  | CPU      | Memory       | Disk   | Typical Cloud Instance Types      |
| :---- | :------- | :----------- | :----- | :-------------------------------- |
| Small | 2 core   | 4-8 GB RAM   | 25 GB  | 2 vCPU, 8 GB Mem, 10Gbps Network  |
| Large | 4-8 core | 16-32 GB RAM | 100 GB | 4 vCPU, 16 GB Mem, 10Gbps Network |

- HA 구성을 위해 2대 이상 권장
- 운영환경의 경우 3대로 HA
- Consul Backend를 사용하지 않는 경우 홀수로 구성 3대, 5대



## Consul (Vault Backend Storage)

| Size  | CPU      | Memory       | Disk   | Typical Cloud Instance Types      |
| :---- | :------- | :----------- | :----- | :-------------------------------- |
| Small | 2 core   | 4-8 GB RAM   | 25 GB  | 2 vCPU, 8 GB Mem, 10Gbps Network  |
| Large | 4-8 core | 16-32 GB RAM | 100 GB | 4 vCPU, 16 GB Mem, 10Gbps Network |

- Vault Backend Storage로 사용
- HA 구성을 위해 3대 이상 권장
- 운영 환경의 경우 5대로 HA 구성