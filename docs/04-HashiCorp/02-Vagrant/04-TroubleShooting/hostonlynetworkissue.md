---
description: Vagrant에서 Private network 구성시 에러 발생
tag: ["vagrant", "virtualbox"]
---

# Network : Code E_ACCESSDENIED (0x80070005)

<https://discuss.hashicorp.com/t/vagrant-2-2-18-osx-11-6-cannot-create-private-network/30984/9>
<https://discuss.hashicorp.com/t/vagran-can-not-assign-ip-address-to-virtualbox-machine/30930>

## 환경

> 테스트 환경은 MacOS이나 HashiCorp Discuss의 글을 확인해보면 Linux에서도 동일하게 발생하는 것으로 보임

- MacOS 카탈리나에서 빅서로 업그레이드
- Vagrant 업데이트 : 2.2.18
- VirtualBox 업데이트 : 6.1.28 r147628

## 현상

기존에 VirtualBox에 Host Network Manager에서 vboxnet# 사용중
- IPv4 Address : 172.28.128.1
- IPv4 Network Mask : 255.255.255.0
- DHCP
  - Server Address : 172.28.128.2
  - Server Mask : 255.255.255.0
  - Lower Address Bound: 172.28.128.3
  - Upper Address Bound: 172.28.128.254

Vagrant up 시 에러 발생
VM의 Network에 Host-only Network로 해당 vboxnet#이 있어야 하나 목록에 표기 안됨

## 해결방안

Host Network Manager에서 vboxnet#를 삭제후 다시 172.x.x.x로 생성하려고 하니 에러 발생

```bash
Stderr: VBoxManage: error: Code E_ACCESSDENIED (0x80070005) - Access denied (extended info not available)
```

기본으로 네트워크 생성시 부여받는 IP(e.g. `192.168.56.1`) 로는 가능하여 Vagrant의 구성을 해당 IP에 맞게 변경