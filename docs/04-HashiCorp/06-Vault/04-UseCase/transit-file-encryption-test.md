---
description: Vault Transit File Demo
tag: ["vault", "encryption", "transit"]
---
# Transit File Encryption Demo

> transit : <https://www.vaultproject.io/docs/secrets/transit>

<VidStack
  src="youtube/OjMSoNmXOYk"
  title="Transit Demo"
/>

::: warning
CLI 사용 시 쉘의 사이즈 제한에 걸려 실행되지 않아 API 방식으로 테스트 하였습니다.
:::

아래 링크의 글에서 대용량 사이즈의 파일을 Transit으로 암/복호화 시 대략의 소요 시간을 확인할 수 있습니다.
<https://medium.com/hashicorp-engineering/scaling-data-encryption-with-hashicorp-vaults-transit-engine-2d0cb3d31c2f>

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

## File Enctyption

::: info
파일은 mp4 동영상 파일을 대상으로 테스트를 수행했습니다.
`tr -d '\n'`을 사용하여 Json 작성 시 임의의 줄바꿈이 없도록 처리가 필요합니다.
:::

```bash
# Create payload.json
echo '{ "plaintext": "' | tr -d '\n' > payload.json
base64 -i ./sample.mp4 | tr -d '\n' >> payload.json
echo '" }' >> payload.json

# Request Encryption
curl --header "X-Vault-Token: $VAULT_TOKEN" \
     --header "Content-Type: application/json" \
     --request POST \
     --data-binary @payload.json \
     $VAULT_ADDR/v1/transit/encrypt/my-key | jq -r ".data.ciphertext" > ciphertext.txt
```

## File Decryption

```bash
# Create payload.json
echo '{ "ciphertext": "' | tr -d '\n' > payload.json
cat ciphertext.txt | tr -d '\n' >> payload.json
echo '" }' >> payload.json

# Request Decryption
curl --header "X-Vault-Token: $VAULT_TOKEN" \
     --header "Content-Type: application/json" \
     --request POST \
     --data-binary @payload.json \
     $VAULT_ADDR/v1/transit/decrypt/my-key | jq -r ".data.plaintext" | base64 -D > decrypt.mp4
```