---
description: Sentinel - Transit Secrets Key Exportable Option Deny
tag: ["Vault", "Sentinel", "Policy"]
---

# Transit Key Exportable Deny

## 1. EGP용 정책 생성 exportable_deny.sentinel

```hcl
import "strings"

exportable = request.data.exportable

exportable_check = rule {
  exportable is "false"
}

main = rule {
  exportable_check
}
```

- `exportable_check` : 요청의 Body에 `exportable`의 값이 `false`인 경우에 ==TRUE== 반환


## 2. EGP에 정책 설정
EGP는 지정된 path에 대해 정책을 적용

```bash
$ vault write sys/policies/egp/exportable-check \
  policy="$(base64 -i exportable-deny.sentinel)" \
  paths="*" \
  enforcement_level="hard-mandatory"
```
- `paths`로 지정된 API 경로에 요청이 들어오면 동작

## 3. 테스트

### 3.1 Test Policy

`transit` 경로에 모든 권한이 있는 사용자

```hcl
vault policy write transit-admin - << EOF
path "transit" {
capabilities = ["create", "read", "update", "delete", "list"]
}

path "transit/*" {
capabilities = ["create", "read", "update", "delete", "list"]
}
EOF
```

### 3.2 Policy Token 생성

```bash
VAULT_TOKEN=$(vault token create -policy=transit-admin)
```

### 3.3 Sentinel 테스트

`exportable` 옵션이 `false인` 경우 정상적으로 수행

```bash
$ vault write -f transit/keys/my-key-name exportable=false

Key                       Value
---                       -----
allow_plaintext_backup    false
auto_rotate_period        0s
deletion_allowed          false
derived                   false
exportable                false
imported_key              false
keys                      map[1:1702877441]
latest_version            1
min_available_version     0
min_decryption_version    1
min_encryption_version    0
name                      my-key-name
supports_decryption       true
supports_derivation       true
supports_encryption       true
supports_signing          false
type                      aes256-gcm96
```

`exportable` 옵션이 `false인` 경우 거부됨

```bash
$ vault write -f transit/keys/my-key-name exportable=true

Error writing data to transit/keys/my-key-name: Error making API request.

URL: PUT http://127.0.0.1:8200/v1/transit/keys/my-key-name
Code: 403. Errors:

* 2 errors occurred:
	* egp standard policy "root/exportable-check" evaluation resulted in denial.

The specific error was:
<nil>

A trace of the execution for policy "root/exportable-check" is available:

Result: false

Description: <none>

Rule "main" (root/exportable-check:9:1) = false
Rule "exportable_check" (root/exportable-check:5:1) = false
	* permission denied


```
