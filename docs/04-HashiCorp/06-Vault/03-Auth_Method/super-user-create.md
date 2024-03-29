---
description: Vault Super user 만들기
tag: ["vault auth"]
---

# Vault SuperUser 생성
::: danger 주의
해당 방법은 username/password 방식의 Admin권한의 사용자를 생성하나,  
보안상 실 구성에는 권장하지 않습니다.
:::

1. userpass 활성화
```bash:no-line-numbers
vault auth enable userpass
```

2. 권한 추가 (e.g. super-user)
::: code-tabs#shell
@tab Linux/MacOS
```bash:no-line-numbers
vault policy write super-user - << EOF
path "*" {
capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
EOF
```
@tab Windows Powershell
```powershell:no-line-numbers
$policy = @"
path "*" {
  capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
"@

vault policy write super-user - << $policy
```
:::

3. 계정 생성

```bash:no-line-numbers
vault write auth/userpass/users/admin password=password policies=super-user
```


4. 로그인 또는 토큰 생성
::: code-tabs#shell
@tab Login
```bash:no-line-numbers
vault login -method userpass username=admin password=password
Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                    Value
---                    -----
token                  s.vIRSNJYiVMtRFuOwq4pKbYGK
token_accessor         EQz974TUJCy0iV7ALZ8xzGe4
token_duration         768h
token_renewable        true
token_policies         ["default" "super-user"]
identity_policies      []
policies               ["default" "super-user"]
token_meta_username    admin
```

@tab token
```bash:no-line-numbers
vault token create -policy=super-user
Key                  Value
---                  -----
token                s.DgfYH1dUBxAbBDuPM5U2kkym
token_accessor       6GJDO2KH4yPK0jStQw8gJ63r
token_duration       768h
token_renewable      true
token_policies       ["default" "super-user"]
identity_policies    []
policies             ["default" "super-user"]
```
:::
