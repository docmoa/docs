---

tag: ["vault"]

---

# Vault Secret Engine 조회 스크립트

## 1. Policy

- `namespace`  하위 목록을 조회할 수 있는 권한이 필요합니다.
  - `sys/namespaces/*`: 모든 네임스페이스를 나열하고 읽을 수 있는 권한을 부여합니다.
- 활성화된 Secret Engine을 조회할 수 있는 권한이 필요합니다.
  - `sys/mounts`: 루트 레벨의 마운트 포인트(시크릿 엔진)를 읽을 수 있는 권한을 부여합니다.
  - `+/sys/mounts`: 모든 네임스페이스의 마운트 포인트를 읽을 수 있는 권한을 부여합니다.
  - `+/*/metadata/*`: 필요한 경우, 모든 네임스페이스의 KV 시크릿 엔진 메타데이터에 접근할 수 있는 권한을 부여합니다.

```hcl
# 모든 네임스페이스에 대한 읽기 권한
path "sys/namespaces/*" {
  capabilities = ["list", "read"]
}

# 모든 네임스페이스의 마운트 포인트(시크릿 엔진) 조회 권한
path "sys/mounts" {
  capabilities = ["read"]
}

# 모든 네임스페이스에서 시크릿 엔진 목록 조회 권한
path "+/sys/mounts" {
  capabilities = ["read"]
}

# 필요한 경우, 특정 시크릿 엔진에 대한 메타데이터 읽기 권한
# 예: KV 시크릿 엔진
path "+/*/metadata/*" {
  capabilities = ["list", "read"]
}
```

정책 생성 :

```bash
vault policy write secret-list-getter ./policy.hcl
```

## 2. CLI script (list_vault_secrets.sh)

- `list_vault_secrets.sh`의 첫번째 Argument가 기준이 됩니다. (e.g. `admin`)
  - 루트부터 시작: `./script.sh`
  - 특정 네임스페이스부터 시작: `./script.sh admin` 또는 `./script.sh admin/subns`
- 하위 namespace를 조회하여 반복적으로 Secret Engine을 조회합니다.

```bash
#!/bin/bash

# 네임스페이스와 시크릿 엔진을 재귀적으로 조회하는 함수
list_secrets() {
    local full_namespace=$1
    local indent=$2

    # 현재 네임스페이스 설정
    if [ -n "$full_namespace" ]; then
        export VAULT_NAMESPACE=$full_namespace
    else
        unset VAULT_NAMESPACE
    fi

    echo "${indent}Namespace: ${VAULT_NAMESPACE:-}"

    # 시크릿 엔진 목록 조회
    vault secrets list -format=json 2>/dev/null | jq -r 'to_entries[] | select(.value.type != "system") | "\(.key)|\(.value.type)"' | while IFS='|' read -r engine type; do
        echo "${indent}  Secret Engine: $engine (Type: $type)"
    done

    # 하위 네임스페이스 조회
    vault namespace list -format=json 2>/dev/null | jq -r '.[]' | while read subns; do
        local new_namespace
        if [ -n "$full_namespace" ]; then
            new_namespace="${full_namespace}/${subns}"
        else
            new_namespace="$subns"
        fi
        list_secrets "$new_namespace" "  ${indent}"
    done
}

# VAULT_TOKEN 환경변수 확인
if [ -z "$VAULT_TOKEN" ]; then
    echo "Error: VAULT_TOKEN environment variable is not set."
    exit 1
fi

# 메인 실행
echo "Listing all secret engines in all namespaces:"

# 첫 번째 인자가 있으면 해당 네임스페이스부터 시작, 없으면 루트부터 시작
if [ -n "$1" ]; then
    list_secrets "$1" ""
else
    list_secrets "" ""
fi
```



## 3. Token 생성 및 실행

```bash
VAULT_TOKEN=$(vault token create -field=token -policy=secret-list-getter) ./list_vault_secrets.sh admin
```



결과 1 (HCP Vault)

```bash
$ VAULT_TOKEN=$(vault token create -field=token -policy=secret-list-getter) ./list_vault_secrets.sh admin
Listing all secret engines in all namespaces:
Namespace: admin
  Secret Engine: alicloud/ (Type: alicloud)
  Secret Engine: ansible-ssh/ (Type: ssh)
  Secret Engine: aws-doormat/ (Type: aws)
  Secret Engine: aws/ (Type: aws)
  Secret Engine: azure/ (Type: azure)
  Secret Engine: cubbyhole/ (Type: ns_cubbyhole)
  Secret Engine: gcp/ (Type: gcp)
  Secret Engine: identity/ (Type: ns_identity)
  Secret Engine: kv_v1/ (Type: kv)
  Secret Engine: my_kv/ (Type: kv)
  Secret Engine: pki/ (Type: pki)
  Secret Engine: pki_int/ (Type: pki)
  Secret Engine: pki_kv/ (Type: kv)
  Secret Engine: planetscale/ (Type: database)
  Secret Engine: secret/ (Type: kv)
  Secret Engine: ssh/ (Type: ssh)
  Secret Engine: sys/ (Type: ns_system)
  Secret Engine: totp/ (Type: totp)
  Secret Engine: transit/ (Type: transit)
  Namespace: admin/A-Com/
    Secret Engine: cubbyhole/ (Type: ns_cubbyhole)
    Secret Engine: identity/ (Type: ns_identity)
    Secret Engine: sys/ (Type: ns_system)
  Namespace: admin/my-namespace/
    Secret Engine: cubbyhole/ (Type: ns_cubbyhole)
    Secret Engine: identity/ (Type: ns_identity)
    Secret Engine: sys/ (Type: ns_system)
  Namespace: admin/with-okta/
    Secret Engine: cubbyhole/ (Type: ns_cubbyhole)
    Secret Engine: identity/ (Type: ns_identity)
    Secret Engine: sample-secret/ (Type: kv)
    Secret Engine: sys/ (Type: ns_system)
```



결과 2 (Vault 설치형)

```bash
$ VAULT_TOKEN=$(vault token create -field=token -policy=secret-list-getter) ./list_vault_secrets.sh
Listing all secret engines in all namespaces:
Namespace:
  Secret Engine: cubbyhole/ (Type: cubbyhole)
  Secret Engine: identity/ (Type: identity)
  Secret Engine: secret/ (Type: kv)
  Namespace: sub1/
    Secret Engine: aws/ (Type: aws)
    Secret Engine: cubbyhole/ (Type: ns_cubbyhole)
    Secret Engine: identity/ (Type: ns_identity)
    Secret Engine: sys/ (Type: ns_system)
```