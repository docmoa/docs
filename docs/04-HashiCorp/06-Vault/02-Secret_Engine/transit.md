---
meta:
  - name: description
    content: Vault Transit
tags: ["vault", "transit"]
---

# Transit

## Vault구성 (Option)

시크릿 엔진 활성화

```bash
export VAULT_SKIP_VERIFY=True
export VAULT_ADDR='http://172.28.128.21:8200'
export VAULT_TOKEN=<mytoken>
```

### 정책 및 사용자 구성

#### transit-admin

```ruby
$ vault policy write transit-admin - << EOF
# Enable transit secrets engine
path "sys/mounts/transit" {
  capabilities = [ "create", "read", "update", "delete", "list" ]
}

# To read enabled secrets engines
path "sys/mounts" {
  capabilities = [ "read" ]
}

# Manage the transit secrets engine
path "transit/*" {
  capabilities = [ "create", "read", "update", "delete", "list" ]
}
EOF
```

#### transit-message

```ruby
$ vault policy write transit-message -<<EOF
path "transit/encrypt/message" {
   capabilities = [ "update" ]
}
path "transit/decrypt/message" {
   capabilities = [ "update" ]
}
EOF
```

### user/pass 생성

```bash
$ vault auth enable userpass

$ vault write auth/userpass/users/transit-admin \
    password=transit-admin \
    policies=transit-admin
    
$ vault write auth/userpass/users/transit-message \
    password=transit-message \
    policies=transit-message
```

### transit-admin 로그인

```bash
$ vault login -method userpass username=transit-admin password=transit-admin
Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                    Value
---                    -----
token                  s.ldJApybiqGBmq3CuBAaqsKXZ
token_accessor         Maek0IMLkOLmFVkpG4DoGUdY
token_duration         768h
token_renewable        true
token_policies         ["transit-admin"]
identity_policies      []
policies               ["transit-admin"]
token_meta_username    transit-admin
```

## Transit Secret Engine

### Transit Secret Engine 활성화

```bash
$ vault secrets enable -path=transit transit
```



### 암호화 키링 생성

```bash
# vault write -f transit/keys/<key_name>
$ vault write -f transit/keys/message
```



### 암호화 (Transit-message User)

```bash
$ VAULT_TOKEN=<client_token> vault write transit/encrypt/message \
    plaintext=$(base64 <<< "4111 1111 1111 1111")
    
Key            Value
---            -----
ciphertext     vault:v1:IKfJjYkwv1NWAaw+7O8F0QKcWxu5J98/Wvf0d8yHeBX8AoRajI6BLmS7iniCvkyp
key_version    1
```



### 해독 (Transit-message User)

```bash
$ VAULT_TOKEN=<client_token> vault write transit/decrypt/message \
    ciphertext="vault:v1:cZNHVx+sxdMErXRSuDa1q/pz49fXTn1PScKfhf+PIZPvy8xKfkytpwKcbC0fF2U="

Key          Value
---          -----
plaintext    Y3JlZGl0LWNhcmQtbnVtYmVyCg==

$ base64 --decode <<< "Y3JlZGl0LWNhcmQtbnVtYmVyCg=="
4111 1111 1111 1111
```

또는

```bash
$ vault write -field=plaintext transit/decrypt/message ciphertext="vault:v1:cZNHVx+sxdMErXRSuDa1q/pz49fXTn1PScKfhf+PIZPvy8xKfkytpwKcbC0fF2U=" | base64 --decode
4111 1111 1111 1111
```



### 암호화 키링 순환

```bash
$ vault write -f transit/keys/message/rotate
$ vault read transit/keys/message
Key                       Value
---                       -----
allow_plaintext_backup    false
deletion_allowed          false
derived                   false
exportable                false
keys                      map[1:1617699577 2:1617705005]
latest_version            2
min_available_version     0
min_decryption_version    1
min_encryption_version    0
name                      message
supports_decryption       true
supports_derivation       true
supports_encryption       true
supports_signing          false
type                      aes256-gcm96
```



### 업데이트된 키링으로 암호화

```bash
$ vault write transit/encrypt/message \
    plaintext=$(base64 <<< "4111 1111 1111 1111")
Key            Value
---            -----
ciphertext     vault:v2:wdEpTdasoqY0I9SWfj0r93fDevsIl2cX2aAdfDqAPmvCMAf2w/2blU+k86MVscgW
key_version    2
```



### 업데이트된 키링으로 재 암호화

```bash
$ vault write transit/rewrap/message \
    ciphertext="vault:v1:+msBmr5zjE7ZOaA1h9/kV7ZWGZlZX+YEzgco70wTT+lvlfxUDLIgdFGFVOYN777X"

Key           Value
---           -----
ciphertext    vault:v2:kChHZ9w4ILRfw+DzO53IZ8m5PyB2yp2/tKbub34uB+iDqtDRB+NLCPrpzTtJHJ4=
```



### 기존 키링 파기

```bash
$ vault write transit/keys/message/config min_decryption_version=2
$ vault read transit/keys/message
Key                       Value
---                       -----
...
keys                      map[2:1617705005]
...
```



### 기존 암호화 데이터 복호화 → 실패

```bash
$ vault write -field=plaintext transit/decrypt/message ciphertext="vault:v1:KBhy3R8Po4J7tRtkJzZId7DZIpugxMFpTkwPwq3JOy60t1sq149PB8mmPqhKBVLT" | base64 --decode

Error writing data to transit/decrypt/message: Error making API request.

URL: PUT http://172.28.128.21:8200/v1/transit/decrypt/message
Code: 400. Errors:

* ciphertext or signature version is disallowed by policy (too old)
```

