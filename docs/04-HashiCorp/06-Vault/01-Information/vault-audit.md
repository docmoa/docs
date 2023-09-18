---
description: Vault Audit Log 활성화하는 방법
tag: ["vault", "audit"]
---

# Vault Audit
Vault Audit은 `-path`를 달리하여 여러 Audit 메커니즘을 중복해서 구성 가능

## File

```bash
$ vault audit enable file file_path=/var/log/vault/vault_audit.log
$ vault audit enable -path=file2 file file_path=/var/log/vault/vault_audit2.log
```

## Syslog

```bash
$ vault audit enable syslog tag="vault" facility="AUTH"
```

## Socket

```bash
$ vault audit enable socket address=127.0.0.1:9090 socket_type=tcp
```

- Socket TEST - TCP listener sample - netcat
    ```bash
    sudo apt install -y netcat
    nc -l 9090
    ```