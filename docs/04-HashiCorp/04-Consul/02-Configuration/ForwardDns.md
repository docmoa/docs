---
meta:
  - name: description
    content: Consul ForwardDNS
tags: ["Consul", "Enterprise", "Configuration", "ForwardDns"]
---

# ForwardDns
## Consul dns를 local에서도 사용해야 할 경우에는 dns forward를 해줘야한다. 아래는 ubuntu 환경에서 진행하였음

## 설정 명령어
```bash
#systemd-resolved 설정파일 추가 및 변경
mkdir -p /etc/systemd/resolved.conf.d
(
cat <<-EOF
[Resolve]
DNS=127.0.0.1
DNSSEC=false
Domains=~consul
EOF
) | sudo tee /etc/systemd/resolved.conf.d/consul.conf
(
cat <<-EOF
nameserver 127.0.0.1
options edns0 trust-ad
EOF
) | sudo tee /etc/resolv.conf
#iptables에 consul dns port 추가
iptables --table nat --append OUTPUT --destination localhost --protocol udp --match udp --dport 53 --jump REDIRECT --to-ports 8600
iptables --table nat --append OUTPUT --destination localhost --protocol tcp --match tcp --dport 53 --jump REDIRECT --to-ports 8600
#service 재시작
systemctl restart systemd-resolved
```

## 확인 명령어
```bash
#Global domain에 consul 확인 
$ resolvectl domain
Global: ~consul
Link 5 (docker0):
Link 4 (eth2):
Link 3 (eth1):
Link 2 (eth0):
#consul service확인, 해당 클러스터에는 consul server가 3대임
$ resolvectl query consul.service.consul
consul.service.consul: 172.30.1.100
                       172.30.1.101
                       172.30.1.102

```