---
meta:
  - name: description
    content: Vault 400 Error 발생원인 및 확인
tags: ["vault", "error", "400"]
---

# Vault 400 Error

> Vault HTTP Status Codes : <https://www.vaultproject.io/api#http-status-codes>

Vault에 API 요청시 400에러가 발생하는 경우 Vault로 전달된 데이터 형태가 올바른지 확인이 필요하다.

- `400` :  Invalid request, missing or invalid data.

예를들어 아래와 같이 `Transit`의 복호화 요청을 하는 경우 데이터가 비어있다면 응답과 Audit로그에서 400 에러관련 메세지를 확인할 수 있다.
- `1 error occurred: * invalid request`

```bash
curl \
  -H "X-Vault-Token: s.HeeRXjkW1KJhF8ofQsglI9yw" \
  -X POST \
  -d "{}" \
  http://192.168.60.103:8200/v1/transit/decrypt/my-key
```

```json
{
  "time": "2022-03-04T08:02:37.596190958Z",
  "type": "response",
  "auth": {
    "client_token": "hmac-sha256:17bc16e3346dd6c398646cb7da8e0bd71ae720f608a8c447b8942b8283388600",
    "accessor": "hmac-sha256:798bb09d10dc2ac18533acb3d049c4185af3328fbc88fedd23081f63caa13b44",
    "display_name": "root",
    "policies": [
      "root"
    ],
    "token_policies": [
      "root"
    ],
    "token_type": "service",
    "token_issue_time": "2021-09-15T13:45:47+09:00"
  },
  "request": {
    "id": "c39906c5-f48d-c177-37c2-4c1635db78e7",
    "operation": "update",
    "mount_type": "transit",
    "client_token": "hmac-sha256:17bc16e3346dd6c398646cb7da8e0bd71ae720f608a8c447b8942b8283388600",
    "client_token_accessor": "hmac-sha256:798bb09d10dc2ac18533acb3d049c4185af3328fbc88fedd23081f63caa13b44",
    "namespace": {
      "id": "root"
    },
    "path": "kbhealth-transit/prod/decrypt/aes256",
    "data": {
      "ciphertext": "hmac-sha256:34c2966e2ef36e2dcdb24f05fd4442b8f85c0d2fbf0887977636c7592e2cef3b"
    },
    "remote_address": "10.100.0.85"
  },
  "response": {
    "mount_type": "transit",
    "data": {
      "error": "hmac-sha256:bf7d730e400653f79b134c3bdb593f8220f6f1588a26048a6e1272a01ad47384"
    }
  },
  "error": "1 error occurred:\n\t* invalid request\n\n"
}
```