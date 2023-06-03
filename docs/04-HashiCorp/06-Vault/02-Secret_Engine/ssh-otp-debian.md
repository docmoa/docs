---
meta:
  - name: description
    content: Vault SSH Ubuntu에 구성하는 예제
tags: ["vault", "SSH", "OTP", "Debian", "Ubuntu"]
---

# SSH OTP - Debian 계열
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

### 접속할 사용자 생성

```bash
$ sudo adduser test
```



### vault-ssh-helper 구성 <config.hcl>
> <https://github.com/hashicorp/vault-ssh-helper>  

```ruby
vault_addr = "http://172.28.128.21:8200"
ssh_mount_point = "ssh"
namespace = ""
tls_skip_verify = true
allowed_roles = "*"
allowed_cidr_list = "0.0.0.0/0"
```



### vault-ssh-helper 다운로드

> https://releases.hashicorp.com/vault-ssh-helper/  
> tls를 사용하지 않는 경우. `-dev` 

아래와 같이 검증
```bash
vault-ssh-helper -verify-only -config=config.hcl -dev
```

### pam.d 설정

:::: tabs
::: tab 기존 PW 방식을 대체
`/etc/pam.d/sshd` 파일의 `@include common-auth` 부분을 다음과 같이 변경 추가

```properties
#@include common-auth
auth requisite pam_exec.so quiet expose_authtok log=/tmp/vaultssh.log /usr/local/bin/vault-ssh-helper -config=/etc/vault-ssh-helper.d/config.hcl -dev
auth optional pam_unix.so not_set_pass use_first_pass nodelay
```
:::
::: tab 기존 PW와 함께 사용
`/etc/pam.d/common-auth` 파일의 `auth [success=1 dufault=ignore]` 아래 2줄 추가

```properties{3,4}
# here are the per-package modules (the "Primary" block)
auth    [success=1 default=ignore]      pam_unix.so nullok_secure
auth    [success=3 default=ignore]      pam_exec.so quiet expose_authtok log=/tmp/vaultssh.log /usr/local/bin/vault-ssh-helper -config=/etc/vault-ssh-helper.d/config.hcl -dev
auth    [success=2 default=ignore]      pam_unix.so not_set_pass use_first_pass nodelay
# here's the fallback if no module succeeds
auth    requisite                       pam_deny.so
# prime the stack with a positive return value if there isn't one already;
# this avoids us returning an error just because nothing sets a success code
# since the modules above will each just jump around
auth    required                        pam_permit.so
# and here are more per-package modules (the "Additional" block)
auth    optional                        pam_cap.so 
# end of pam-auth-update config
```
:::
::::

### ssh 설정

`/etc/ssh/sshd_config` 파일의 `ChallengeResponseAuthentication` 부분을 수정

> 이미 있는 옵션은 값 수정, 없는 옵션은 추가

```properties
ChallengeResponseAuthentication yes
UsePAM yes
PasswordAuthentication no
```



### ssh 서비스 재시작

```bash
$ systemctl restart ssh
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



### 접속 방법 1. ssh

>  Password: 에 앞서 요청한 롤의 credential 값의 `key` 를 넣어준다.

```bash
$ ssh test@172.28.128.31
Password:
```



### 접속 방법 2. vault ssh

> Vault로 해당 ssh otp에 권한이 있는 사용자인 경우 `sshpass` 가 설치되어있으면 자동 입력

```bash
$ vault ssh -role otp_key_role -mode otp test@172.28.128.31
or
$ vault ssh -role otp_key_role -mode otp -strict-host-key-checking=no test@172.28.128.31
```