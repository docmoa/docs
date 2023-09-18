---
description: Identifying consul split-brain
tag: ["Consul", "install"]
---

# Consul yum install issue 
AmazonLinux 환경에서 하기와 같은 명령어로 consul 설치 후 systemd 를 통한 Consul 시작시 오류 발생
```bash
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
sudo yum -y install consul
```

## Consul 시작시 오류로그 
```bash
[ec2-user@ip-10-0-10-35 ~]$ sudo systemctl start consul
Job for consul.service failed because a configured resource limit was exceeded. See "systemctl status consul.service" and "journalctl -xe" for details.
```

## 원인 및 해결방안 
yum 명령어로 consul설치시 /etc/consul.d/ 경로에 기본적으로 `consul.env`  파일이 자동으로 생성되는데 해당 파일이 생성되지 않아 수동으로 생성함. 

