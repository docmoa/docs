---
meta:
  - name: description
    content: Consul Enterprise Feature
tags: ["Consul", "Enterprise"]
---

# Consul Enterprise Feature

- Enterprise Global Visibility & Scale
  - Network Segments
  - Advanced Federation
  - Redendancy Zones
  - Enganced Read Scalability
- Governance & Policy
  - Namespaces
  - Single Sign On
  - Audit Logging
  - Sentinel



## Enterprise Global Visibility & Scale

### 1. Network Segments

하나의 Consul 서버에서 서로다른 Agent 들의 묶음을 관리할 수 있도록 하는 개념입니다. 여러개의 Consul 클러스터를 만드는 것이 아닌, 하나의 클러스터 내에서 Agent 들을 분류합니다.

참고 Url : <https://learn.hashicorp.com/tutorials/consul/network-partition-datacenters>



### 2. Advanced Federation

페더레이션을 위해서는 RPC(8300/tcp), SerfWAN(8302/tcp, 8302/udp)를 통해야하므로 여러 테이터센터, 혹은 클러스터를 관리하기에 어려워집니다. 이를 보완하기 위해 지역간 트래픽을 모두 RPC(8300/tcp)를 통해 수행하여 TLS만으로 보안을 유지하도록 합니다.

참고 Url : <https://www.consul.io/docs/enterprise/federation>



### 3. Redendancy Zones

일반적으로 클러스터의 관리 서버는 3중화하여 구성하며 Raft 알고리즘을 통해 리더 선출을 하는 방식을 취합니다. HA를 위해 해당 투표에 참여하지 않은 추가 잉여 서버 노드를 "상시 대기" 시킬 수 있으며 장애 발생 시 해당 노드는 투표 구성원으로 승격 됩니다. 이는 서버 노드에 대한 추가 구성원임과 동시에 복구 기능을 제공합니다.

참고 Url : <https://learn.hashicorp.com/tutorials/consul/autopilot-datacenter-operations#redundancy-zones>



### 4. Enganced Read Scalability

앞서의 Redendancy Zone의 비투표 노드는 투표에는 참여하지 않지만 데이터를 복제하고 데이터를 읽을 수 있는 동작을 지원합니다. 이를 통해 Consul 클러스터를 확장할 수 있고 읽기/쓰기 지연시간을 줄이고 용량을 늘일 수 있습니다.

참고 Url : <https://www.consul.io/docs/agent/options#_non_voting_server>



## Governance & Policy

관련 블로그 : <https://www.hashicorp.com/blog/enterprise-compliance-and-governance-with-hashicorp-consul-1-8/>

### 1. Namespaces

Namespaces 기능은 사용자나 팀간의 데이터 격리를 제공합니다. 각각의 Namespace로 구분된 서비스와 정보는 서로 다른 구성원같에 조회가 불가능합니다. 하나의 클러스터로 논리적 분할을 가능하게 합니다.

참고 Url : <https://www.consul.io/docs/enterprise/namespaces>



### 2. Single Sign On

Open ID Connect를 사용하여 인증을 처리합니다.

참고 Url : <https://www.consul.io/docs/acl/auth-methods/oidc>



### 3. Audit Logging

사용자의 이벤트 시도와 처리에 대한 로그를 캡쳐하고 기록하는 것을 지원합니다. 1.8.0 기준으로 'file'을 지원하며, 향후 추가 타입이 지원될 예정입니다.

참고 Url : <https://www.consul.io/docs/agent/options#audit>



### 4. Sentinel

Consul에 반영되는 서비스나 KV에 대한 정책을 정의할 수 있습니다. 예를 들면 서비스 등록이나 업데이트에 대한 시간을 강제하거나 Key에 이름 패턴을 강제화 할 수 있습니다.

참고 Url : <https://www.consul.io/docs/agent/sentinel>