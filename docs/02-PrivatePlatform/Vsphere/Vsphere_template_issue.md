---
description: "VSphere 템플릿 생성 이슈"
tag: ["vsphere", "template"]
---

# VSphere 템플릿 생성 이슈
1. redhat 계열
- 아래 네개의 패키지의 설치가 필요하다. 특히 perl은 거의 설치가 안되어 있음
- open-vm-tools, open-vm-tools-deploypkg, net-tools, perl
- 설치 후 template 생성하고 배포하면 됨

2. debian 계열
- /etc/systemd/system/vmtoolsd.service 파일에 구문 추가
- 18.04은 추가하여도 가끔 NIC, hostname이 기존에 템플릿의 정보를 가져올때가 있음

```bash
#수정 할 파일
vi /etc/systemd/system/vmtoolsd.service

[Unit]
Description=Service for virtual machines hosted on VMware
Documentation=http://open-vm-tools.sourceforge.net/about.php
ConditionVirtualization=vmware
DefaultDependencies=no
Before=cloud-init-local.service
#아래 After=dbus.service추가
After=dbus.service
After=vgauth.service
After=apparmor.service
RequiresMountsFor=/tmp
After=systemd-remount-fs.service systemd-tmpfiles-setup.service systemd-modules-load.service

[Service]
ExecStart=/usr/bin/vmtoolsd
TimeoutStopSec=5

[Install]
WantedBy=multi-user.target
Alias=vmtoolsd.service

```