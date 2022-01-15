---
meta:
  - name: description
    content: Consul 설치 구성을 위한 사이징 가이드
tags: ["consul", "sizing"]
---

# Consul Sizing
> <https://learn.hashicorp.com/tutorials/consul/reference-architecture>
>
> Consul은 Server/Client 구조로 구성되며, Client의 경우 자원사용량이 매우 미미하므로 자원산정은 Server를 기준으로 산정





## On-prem

| Size | CPU       | Memory       | Disk Capacity | Disk IO     | Disk Throughput |
| :--- | :-------- | :----------- | :------------ | ----------- | :-------------- |
| 최소 | 2-4 core  | 8-16 GB RAM  | 100 GB        | 3000+  IOPS | 75+ MB/s        |
| 권장 | 8-16 core | 32-64 GB RAM | 100 GB        | 7500+ IOPS  | 250+ MB/s       |

- HA 구성을 위해 3대 이상의 홀수 구성



## Cloud

| Provider  | Size | Instance/VM Types                     | Disk Volume Specs                         |
| :-------- | :--- | :------------------------------------ | :---------------------------------------- |
| **AWS**   | 최소 | `m5.large`, `m5.xlarge`               | 100+GB `gp3`, 3000 IOPS, 125MB/s          |
|           | 권장 | `m5.2xlarge`, `m5.4xlarge`            | 200+GB `gp3`, 10000 IOPS, 250MB/s         |
| **Azure** | 최소 | `Standard_D2s_v3`, `Standard_D4s_v3`  | 1024GB* `Premium SSD`, 5000 IOPS, 200MB/s |
|           | 권장 | `Standard_D8s_v3`, `Standard_D16s_v3` | 2048GB* `Premium SSD`, 7500 IOPS, 200MB/s |
| **GCP**   | 최소 | `n2-standard-2`, `n2-standard-4`      | 512GB* `pd-balanced`, 15000 IOPS, 240MB/s |
|           | 권장 | `n2-standard-8`, `n2-standard-16`     | 1000GB* `pd-ssd`, 30000 IOPS, 480MB/s     |

- HA 구성을 위해 3대 이상 홀수 구성



## 기본 아키텍처

![Recommended architecture diagram](https://learn.hashicorp.com/img/consul/reference-architecture/consul-singleDC-5node-reference-architecture.png)



## Raft 홀수 구성 장애 극복을 위한 Non-Voting 서버 구성

![Redundancy Zones diagram](https://learn.hashicorp.com/img/consul/reference-architecture/consul-singleDC-redundancyzones.png)