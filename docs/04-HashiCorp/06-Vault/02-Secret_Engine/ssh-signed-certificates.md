---
description: Vault SSH 기능 - Signed Certificate 구성
tag: ["vault", "SSH"]
---

# SSH - Signed Certificates

## Vault설정

시크릿 엔진 활성화

```bash
$ vault secrets enable -path=ssh-client-signer ssh
```



## 구성 생성

```bash
$ vault write ssh-client-signer/config/ca generate_signing_key=true
Key           Value
---           -----
public_key    ...
```

keypair가 이미 있는 경우

```bash
$ vault write ssh-client-signer/config/ca \
    private_key="..." \
    public_key="..."
```



## 구성에서 public key 가져오기

### API

```bash
$ curl -o /etc/ssh/trusted-user-ca-keys.pem http://127.0.0.1:8200/v1/ssh-client-signer/public_key
```

### CLI

```bash
$ vault read -field=public_key ssh-client-signer/config/ca > /tmp/trusted-user-ca-keys.pem
$ /tmp/trusted-user-ca-keys.pem
/etc/ssh/trusted-user-ca-keys.pem로 복사
```



 ## SSH 설정

`/etc/ssh/sshd_config` 파일의 `TrustedUserCAKeys` 부분을 수정

> 이미 있는 옵션은 값 수정, 없는 옵션은 추가

```properties
TrustedUserCAKeys /etc/ssh/trusted-user-ca-keys.pem
```



ssh 서비스 재시작

```bash
$ systemctl restart sshd
```



## 키 서명을 위한 Role 생성

TTL 2분

```bash
$ vault write ssh-client-signer/roles/my-role - <<EOF
{
  "allow_user_certificates": true,
  "allowed_users": "*",
  "allowed_extensions": "permit-pty,permit-port-forwarding",
  "default_extensions": [
    {
      "permit-pty": ""
    }
  ],
  "key_type": "ca",
  "default_user": "test",
  "ttl": "0m20s"
}
EOF
```



## Client SSH Authentication

1. 클라이언트에서 SSH에서 사용할 Keypair를 생성

   ```bash
   $ ssh-keygen -t rsa -C "test@rocky"
   Generating public/private rsa key pair.
   Enter file in which to save the key (/Users/gs/.ssh/id_rsa): /Users/gs/.ssh/vault_rsa
   ```

   - `-C` : 코맨트 옵션

2. Vault에 생성한 키 중 공개키 (.pub)에 대한 서명 요청

   ```bash
   $ vault write ssh-client-signer/sign/my-role \
       public_key=@$HOME/.ssh/vault_rsa.pub
       
   Key             Value
   ---             -----
   serial_number   c73f26d2340276aa
   signed_key      ssh-rsa-cert-v01@openssh.com AAAAHHNzaC1...
   ```

   - signed_key는 또다른 public key

   위와 같은 방식으로 생성되는 추가 public key인 signed_key를 저장하고자 한다면 다음과 같은 방식으로 가능

   ```bash
   $ vault write -field=signed_key ssh-client-signer/sign/my-role public_key=@$HOME/.ssh/vault_rsa.pub > /tmp/signed-cert.pub
       
   $ vault write -field=signed_key ssh-client-signer/sign/my-role \
       public_key=@$HOME/.ssh/vault_rsa.pub > $HOME/.ssh/vault_rsa-cert.pub
   ```

3. 접속 하기

   ```bash
   $ ssh -i /tmp/signed-cert.pub -i ~/.ssh/vault_rsa test@172.28.128.61
   $ ssh -i ~/.ssh/id_rsa test@172.28.128.61
   ```

