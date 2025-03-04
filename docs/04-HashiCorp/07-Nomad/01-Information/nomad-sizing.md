---
description: Nomad 설치 구성을 위한 사이징 가이드
tag: ["nomad", "sizing"]
---

# Nomad Sizing
> <https://learn.hashicorp.com/tutorials/nomad/production-reference-architecture-vm-with-consul>
>
> Nomad는 Server/Client 구조로 구성되며, Client의 경우 자원사용량이 매우 미미하므로 자원산정은 Server를 기준으로 산정



| Size | CPU       | Memory       | Disk Capacity | Typical Cloud Instance Types               |
| :--- | :-------- | :----------- | :------------ | :----------------------------------------- |
| 최소 | 2-4 core  | 8-16 GB RAM  | 50 GB         | **AWS**: m5.large, m5.xlarge               |
|      |           |              |               | **Azure**: Standard_D2_v3, Standard_D4_v3  |
|      |           |              |               | **GCP**: n2-standard-2, n2-standard-4      |
| 권장 | 8-16 core | 32-64 GB RAM | 100 GB        | **AWS**: m5.2xlarge, m5.4xlarge            |
|      |           |              |               | **Azure**: Standard_D8_v3, Standard_D16_v3 |
|      |           |              |               | **GCP**: n2-standard-8, n2-standard-16     |

- HA 구성을 위해 3대 이상의 홀수 구성



## 기본 아키텍처 (with Consul)

![Reference diagram](https://content.hashicorp.com/api/assets?product=tutorials&version=main&asset=public%2Fimg%2Fnomad%2Fproduction%2Fnomad_reference_diagram.png)