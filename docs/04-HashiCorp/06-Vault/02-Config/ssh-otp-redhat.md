---
meta:
  - name: description
    content: Vault SSH Rocky에 구성하는 예제
tags: ["vault", "SSH", "OTP", "Rocky", "RHEL", "CentOS"]
---

# SSH OTP - RedHat 계열
> <https://learn.hashicorp.com/tutorials/vault/pki-engine>

## Vault설정

시크릿 엔진 활성화

```bash
$ vault secrets enable -path ssh ssh
```



 롤 생성

```bash
$ vault write ssh/roles/otp_key_role \
    key_type=otp \
    default_user=test \
    allowed_users=test \
    key_bits=2048 \
    cidr_list=172.28.128.0/24
Success! Data written to: ssh/roles/otp_key_role
```

> e.g. cidr_list=127.0.0.1/32,172.28.128.1/32 or 0.0.0.0/0



 ## 대상 서버 설정

접속할 사용자 생성

```bash
$ sudo adduser test
```



vault-ssh-helper 구성 <config.hcl>

```ruby
vault_addr = "http://172.28.128.21:8200"
ssh_mount_point = "ssh"
namespace = ""
tls_skip_verify = true
allowed_roles = "*"
```



vault-ssh-helper 다운로드

> https://releases.hashicorp.com/vault-ssh-helper/



vault-ssh-helper verify

> tls를 사용하지 않는 경우. `-dev` 

```bash
vault-ssh-helper -verify-only -config=config.hcl -dev
```



Pam 설정

`/etc/pam.d/sshd` 파일의 `@include common-auth` 부분을 다음과 같이 변경 추가

```properties
#%PAM-1.0
auth        required    pam_sepermit.so
#auth       substack    password-auth # COMMENT OUT FOR SSH-HELPER
auth        include     postlogin
auth        requisite   pam_exec.so quiet expose_authtok log=/var/log/vaultssh.log /usr/local/bin/vault-ssh-helper -config=/etc/vault-ssh-helper.d/config.hcl -dev
auth        optional    pam_unix.so not_set_pass use_first_pass nodelay
# Used with polkit to reauthorize users in remote sessions
-auth       optional    pam_reauthorize.so prepare
account     required    pam_nologin.so
account     include     password-auth
#password   include     password-auth # COMMENT OUT FOR SSH-HELPER
# pam_selinux.so close should be the first session rule
session     required    pam_selinux.so close
session     required    pam_loginuid.so
# pam_selinux.so open should only be followed by sessions to be executed in the user context
session     required    pam_selinux.so open env_params
session     required    pam_namespace.so
session     optional    pam_keyinit.so force revoke
session     include     password-auth
session     include     postlogin
# Used with polkit to reauthorize users in remote sessions
-session   optional     pam_reauthorize.so prepare
```



ssh 설정

`/etc/ssh/sshd_config` 파일의 다음 항목을 수정

> 이미 있는 옵션은 값 수정, 없는 옵션은 추가

```properties
ChallengeResponseAuthentication yes
UsePAM yes
PasswordAuthentication no
```



ssh 서비스 재시작

```bash
$ systemctl restart sshd
```



## 테스트

otp 발급

```bash
$ vault write ssh/creds/otp_key_role ip=172.28.128.31
Key                Value
---                -----
lease_id           ssh/creds/otp_key_role/r2SFjhwt3brVT0msL1KEq2Dv
lease_duration     768h
lease_renewable    false
ip                 172.28.128.31
key                f8a32d6c-beec-383c-62d6-3718b367f88d
key_type           otp
port               22
username           test
```



접속 방법 1. ssh

>  Password: 에 앞서 요청한 롤의 credential 값의 `key` 를 넣어준다.

```bash
$ ssh test@172.28.128.31
Password:
```



접속 방법 2. vault ssh

> Vault로 해당 ssh otp에 권한이 있는 사용자인 경우 `sshpass` 가 설치되어있으면 자동 입력

```ssh
$ vault ssh -role otp_key_role -mode otp test@172.28.128.31
or
$ vault ssh -role otp_key_role -mode otp -strict-host-key-checking=no test@172.28.128.31
```

