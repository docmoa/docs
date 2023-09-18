---
description: 사용자별 UI 접근에 대한 설정을 Kv-v2를 예로 확인
tag: ["vault", "kv", "policy"]
---

# kv-v2 UI Policy
> 사용자별 UI 접근에 대한 설정을 Kv-v2를 예로 확인

## Policy 구성
UI 접근을 위해서는 `metadata`에 대한 권한 추가가 필요함

```bash
$ vault policy write ui-kv-policy - << EOF

path "kv-v2/data/path/" {
  capabilities = ["create", "update", "read", "delete", "list"]
}
path "kv-v2/delete/path/" {
  capabilities = ["update"]
}
path "kv-v2/metadata/path/" {
  capabilities = ["list", "read", "delete"]
}
path "kv-v2/destroy/path/" {
  capabilities = ["update"]
}

path "kv-v2/data/path/userid/*" {
  capabilities = ["create", "update", "read", "delete", "list"]
}
path "kv-v2/delete/path/userid/*" {
  capabilities = ["update"]
}
path "kv-v2/metadata/path/userid/*" {
  capabilities = ["list", "read", "delete"]
}
path "kv-v2/destroy/path/userid/*" {
  capabilities = ["update"]
}

# Additional access for UI
path "kv-v2/metadata" {
  capabilities = ["list"]
}
EOF

##### or #####

vault policy write ui-kv-policy - << EOF

path "kv-v2/data/path/userid" {
  capabilities = ["create", "update", "read", "delete", "list"]
}
path "kv-v2/delete/path/userid" {
  capabilities = ["update"]
}
path "kv-v2/metadata/path/userid" {
  capabilities = ["list", "read", "delete"]
}
path "kv-v2/destroy/path/userid" {
  capabilities = ["update"]
}

# Additional access for UI
path "kv-v2/metadata/*" {
  capabilities = ["list"]
}
EOF

```

## 인증 생성
생성한 Policy 기반으로 인증 생성

::: code-tabs#shell

@tab userpass
```bash
$ vault write auth/userpass/users/userid password=password policies=ui-kv-policy
```
@tab token
```bash {2}
vault token create -policy=ui-kv-policy
```

:::

## 조회 확인
생성한 인증의 `Token`을 사용하여 데이터가 조회됨을 확인

```bash
$ curl  --request GET --header "X-Vault-Token: s.FqFMzKL8ExjJeBrq79Jjh1eB" http://172.28.128.11:8200/v1/kv-v2/data/path/userid | jq .
{
  "request_id": "d3db0633-2e13-ba98-4d79-ca48f2307d5e",
  "lease_id": "",
  "renewable": false,
  "lease_duration": 0,
  "data": {
    "data": {
      "access_key": "1234",
      "secret_key": "1234"
    },
    "metadata": {
      "created_time": "2021-07-16T06:35:51.496079412Z",
      "deletion_time": "",
      "destroyed": false,
      "version": 1
    }
  },
  "wrap_info": null,
  "warnings": null,
  "auth": null
}
```

UI에서 접근가능한지 확인
![Vault 2021-07-16 15-35-48](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Vault%202021-07-16%2015-35-48.png)