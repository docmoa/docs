---
meta:
  - name: description
    content: Nomad Namespace
tags: ["Nomad", "Namespace"]
---

# integrate Vault
## 아래 작업 전 Forward DNS for Consul Service Discovery을 진행해야함
- [Consul 설정 링크](/04-HashiCorp/04-Consul/02-Configuration/ForwardDns.md)

## 예제를 위한 vault kv 설정
```bash
# 사용된 policy들
$ cat nomad-cluster-role.json
{
    "allowed_policies": "admin",
    "token_explicit_max_ttl": 0,
    "name": "nomad-cluster",
    "orphan": true,
    "token_period": 259200,
    "renewable": true
}
vault write /auth/token/roles/nomad-cluster @nomad-cluster-role.json

$ cat admin-policy.hcl 
# Read system health check
path "sys/health"
{
  capabilities = ["read", "sudo"]
}

# Create and manage ACL policies broadly across Vault

# List existing policies
path "sys/policies/acl"
{
  capabilities = ["list"]
}

# Create and manage ACL policies
path "sys/policies/acl/*"
{
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}

# Enable and manage authentication methods broadly across Vault

# Manage auth methods broadly across Vault
path "auth/*"
{
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}

# Create, update, and delete auth methods
path "sys/auth/*"
{
  capabilities = ["create", "update", "delete", "sudo"]
}

# List auth methods
path "sys/auth"
{
  capabilities = ["read"]
}

# Enable and manage the key/value secrets engine at `secret/` path

# List, create, update, and delete key/value secrets
path "secret/*"
{
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}

# Manage secrets engines
path "sys/mounts/*"
{
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}

# List existing secrets engines.
path "sys/mounts"
{
  capabilities = ["read"]
}

vault policy write admin admin-policy.hcl

# token 생성
vault token create -policy admin -period 72h -orphan
```

## Server 구성 예시
### storage를 consul을 사용하고 consul에 서비스가 등록되어 있는환경

```hcl
vault {
    enabled = true
    address = "http://active.vault.service.consul:8200"
    task_token_ttl = "1h"
    create_from_role = "nomad-cluster"
    token = "s.hQRpxLmyk6AgSKJWOc9Gmbj1"
}
```

## Client 구성 예시
```hcl
vault {
    enabled = true
    address = "http://active.vault.service.consul:8200"
}
```