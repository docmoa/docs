---
meta:
  - name: description
    content: Vault Transit Stress Test
tags: ["vault", "performance", "transit"]
---
# Vault Stress Test

> wrk github : https://github.com/wg/wrk  
> transit : https://www.vaultproject.io/docs/secrets/transit

## Enable Transit

1. Transit 시크릿 활성화
  ```bash
  $ vault secrets enable transit
  Success! Enabled the transit secrets engine at: transit/
  ```

2. 암호화 키 생성
  ```bash
  $ vault write -f transit/keys/my-key
  Success! Data written to: transit/keys/my-key
  ```

3. Test
  ```bash
  $ vault write transit/encrypt/my-key plaintext=$(base64 <<< "my secret data")

  Key           Value
  ---           -----
  ciphertext    vault:v1:8SDd3WHDOjf7mq69CyCqYjBXAiQQAVZRkFM13ok481zoCmHnSeDX9vyf7w==
  ```

## API Check

::: warning
- 헤더에 `X-Vault-Token` 필요
- `plaintext` 데이터의 값은 base64 인코딩 필요
:::

```bash
curl \
    -H "X-Vault-Token: s.HeeRXjkW1KJhF8ofQsglI9yw" \
    -X POST \
    -d "{\"plaintext\":\"dGhlIHF1aWNrIGJyb3duIGZveAo=\"}" \
    http://192.168.60.103:8200/v1/transit/encrypt/my-key
```

## 부하테스트

::: tip
wrk 사용시 Vault Transit은 POST를 사용하므로 스크립트 작성이 필요
:::

### 1. 암호화 테스트

- 스크립트 작성
  ```lua
  -- enc.lua
  wrk.method = "POST"
  wrk.body   = "{\"plaintext\":\"dGhlIHF1aWNrIGJyb3duIGZveAo=\"}"
  wrk.headers["X-Vault-Token"] = "s.HeeRXjkW1KJhF8ofQsglI9yw"
  ```

- 실행
  ```bash
  wrk -c 240 -t 8 -d 10s -s enc.lua http://192.168.60.103:8200/v1/transit/encrypt/my-key
  ```

### 2. 복호화 테스트

- 스크립트 작성
  ```lua
  -- dec.lua
  wrk.method = "POST"
  wrk.body   = "{\"ciphertext\":\"vault:v1:I2JoSCrTduIDSI7BVIsFppwUop+YHFHejUbaHGeC7sb19CVZaYHEwicuJaXHxP/4\"}"
  wrk.headers["X-Vault-Token"] = "s.HeeRXjkW1KJhF8ofQsglI9yw"
  ```

- 실행
  ```bash
  wrk -c 360 -t 12 -d 60s -s ./dec.lua http://192.168.60.103:8200/v1/transit/decrypt/my-key
  ```