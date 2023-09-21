---
description: Vault Transit - Import (BYOK)
tag: ["vault", "transit"]
---

# Transit (Import)

키 가져오기(Import) 기능은 HSM, 사용자 정의 키, 기타 외부 시스템에서 기존 키를 가져와야 하는 경우를 지원한다. 공개키(Public Key)만을 가져올 수도 있다.

::: info links
- Article : https://support.hashicorp.com/hc/en-us/articles/9742464723987-Importing-keys-into-transit-secret-engine-BYOK

- CLI : https://developer.hashicorp.com/vault/docs/commands/transit/import

- API : https://developer.hashicorp.com/vault/api-docs/secret/transit#import-key
:::

## 1. CLI

`transit import`와 `transit import-version`은 [BYOK 메커니즘](https://developer.hashicorp.com/vault/docs/secrets/transit#bring-your-own-key-byok)을 통해 사용자가 생성한 키를 Transit 엔진에서 사용할 키로 가져온다.
- `transit import` : 키를 새 키로 가져오며 이미 존재하는 경우 실패
- `transit import-version` : 기존 키를 새 버전의 키로 업데이트

## 2. OpenSSL을 사용하여 암복호화

`openssl`을 이용하여 RSA 키를 생성해보고, 데이터를 암호화 및 복호화 

### 2.1 RSA 키 생성

먼저 `openssl`을 이용하여 RSA 키쌍을 생성한다. 이 예에서는 2048비트 키를 생성한다.

```bash:no-line-numbers
# Private 키
openssl genrsa -out private_key.pem 2048
# Public 키
openssl rsa -pubout -in private_key.pem -out public_key.pem
```

`private_key.pem`에 개인 키가 저장되고 `public_key.pem`에 공개 키가 저장된다.

::: note 생성된 PEM 예제

::: tabs

@tab private_key.pem
```txt
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxAqZGiw7/Et52
TRHgLFVYi3HbnMB5m/ZBMu/CZxk6H5zFrCIXcBFh+K58P/rMydFh2rveTd6CT1+s
zrphe1MPS9mRjvvgy3Bk1XEEUBYOlmIk/eD3lLJEoTjY1E5bpuxirTgV7rR47XEy
ZsdT6g8Z6s6/M4bjCnJ4ZuBu1VZ3e/5pHrYFSEudy7Xag1Uby1T0Txr/OPPPjVYO
A9jgGAO+0wr4elPHyYua1IDnQGfOVuGMKKei+PybKdUvErtp6Z5PJxl7Ylj0Uq8V
ym2iXyF7deryXj4vwDZg4UdbX6TcNVSCSM5rvKtAf3S7AsSwflG9WO5Kt1t7QGy2
EWVLTrnNAgMBAAECggEASfZJdAB2663+tn/NkFX182GQ2arN4gKBCw01kY1yxQ6g
exhJxnFVUhKPFevF5/wMOU8kYOc4qkpwN8zJpCHbuvB+oIuWQ3++HuPwrVSpYr8D
k2FhtxGyy2pyTmentjQxYanvXXq4fi74tY6siyup07KBYPMu0X90BUs3TBhoYNQE
KlcZXAR20Y+8NCsKa3QmX9yXUOmDUz5i0zWo7Ojwlig96GpJXq8au3NJcarzFZsw
YFkGelNIMCDcH05ao8ujOoKecmusMEOGoue1DOzduFAvFRGoo7Cx1C+O2ORR0uwC
jyO2H7qrIckoBlnjSzJ5GOY2UNyLAGs5cNEy6Na9IQKBgQDmoSCfx/DSC00lFY7H
Z0fsJrQWzhFnj5hyP3bti4GdtCtYxf1jgM+ZPt8SNU1fqWl2+JbDMXM0C65z39bA
YcHYeWYHVXGMVU/6vDyeD3l7ohuNi7GwvnejZmN0QWoIpKQ9OeVZWQ243bKg7UTR
SDWrOj30RJoS6CzfoKUIM+yCLwKBgQDEe4dJ452/0RsLFhuICQmP9GSUCHZCnSBv
RZvWlw6IJ0qL+Ww+fyNKld0BdUFKZsHVamxcEr/e0MMjFYyoq4JGkBJbUZjcg6QI
bSn4ENKNWEnEfCGeEf2o2IZSdiTGtC8kV1zAgIoy9he/imosMufovjHLXV2QsuDA
plaQwD1wwwKBgQCf0nkxQPV6GarUUCQpu0D0Pb3/L76P7crPIXvhEhQ4nWqMkmgO
VG2I3TDpBVchO92CPLL9gX88SfwTAMNpflU/FqHF40hU36oVL+0x+7dMHgLKDEyP
Fu8BpSq2nb5FTxMh+sUdLcF8ouXu734JKelHR403gXLkN1Ehh8nV7WWwsQKBgEfz
9NdaQ6q7KOwmbG6k4JuXJD4R2z0JzZbyJt+u8eNqgCJCdSFt7b6iowylpANbHiDJ
mGUfeKRgTxXKDni2Vj8BA7ftac1XZ/qt/3CYuIKKknkh/C2m6P2sTYRlP5KE6b6l
P5I/gFypQokiZz9IZSUWgaW3y0vyNdxXDdx0iguBAoGBAOR4r7I8WcOM9i/uTSJm
oAlI9FqxCmQg6Yly6alMF5jjC2/F2/7byYB1FcZ0EnTomYb4dEePCMron3pBpFIk
gx2rcjODvK/hU2Uodpy1XF47mx7dGzuTZYLPijRzl3R/5nW05xnDLBRRAQXaBKLj
CYIKBHwiRAEvHioLiDIostz1
-----END PRIVATE KEY-----
```

@tab public_key.pem
```txt
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsQKmRosO/xLedk0R4CxV
WItx25zAeZv2QTLvwmcZOh+cxawiF3ARYfiufD/6zMnRYdq73k3egk9frM66YXtT
D0vZkY774MtwZNVxBFAWDpZiJP3g95SyRKE42NROW6bsYq04Fe60eO1xMmbHU+oP
GerOvzOG4wpyeGbgbtVWd3v+aR62BUhLncu12oNVG8tU9E8a/zjzz41WDgPY4BgD
vtMK+HpTx8mLmtSA50BnzlbhjCinovj8mynVLxK7aemeTycZe2JY9FKvFcptol8h
e3Xq8l4+L8A2YOFHW1+k3DVUgkjOa7yrQH90uwLEsH5RvVjuSrdbe0BsthFlS065
zQIDAQAB
-----END PUBLIC KEY-----
```
:::

### 2.2 RSA 키로 암호화

공개 키(`public_key.pem`)를 사용하여 "This is my data"라는 문자열을 암호화한다.

```bash:no-line-numbers
echo "This is my data" | openssl rsautl -encrypt -pubin -inkey public_key.pem -out encrypted_data.bin
```

::: details 암호화된 데이터
`encrypted_data.bin`
```txt
�W�U�F�B��	�����F	��u8-�U>���j��;"`Z�+�A��)�6u����9��H�W��t)h��,�m��

                                                                          *h��(UL;ZC�l�K��8���*��Y�k?��`�?�
              �%eܓ�O^
                     K�]���'8�QI�H��2�d���2�Nv$��)F���z���Ձd�B��"�na���x��v/�J-�^�
  ��ΕJ���̳*
          
```
:::

### 2.3 RSA 키로 복호화

암호화된 데이터를 복호화하려면 개인 키(`private_key.pem`)를 사용해야 한다.

```bash:no-line-numbers
openssl rsautl -decrypt -inkey private_key.pem -in encrypted_data.bin
```

::: details 복호화 실행 결과
```bash:no-line-numbers
$ openssl rsautl -decrypt -inkey private_key.pem -in encrypted_data.bin

This is my data
```
:::

## 3. Vault Transit로 키 가져오기

::: warning Import 주의 사항
- 대칭 키(예: AES 또는 ChaCha20 키)를 래핑할 때는 키의 원시 바이트를 래핑해야 한다. 예를 들어 AES 128비트 키의 경우 16자 길이의 바이트 배열이 되는데, 이 바이트 배열은 Base64나 다른 인코딩 없이 바로 래핑된다.

- 비대칭 키(예: RSA 또는 ECDSA 키)를 래핑할 때는 이 키의 PKCS8 인코딩된 형식을 원시 DER/바이너리 형식으로 래핑해야 한다.
:::

위 [2. OpenSSL을 사용하여 암복호화](#2-openssl을-사용하여-암복호화)에서 생성한 개인키를 사용하여 진행한다.

### 3.1 PEM 형식의 키를 DER로 변환

OpenSSL로 생성된 비대칭 키는 DER 형식으로 변경이 필요하다.

```bash:no-line-numbers
openssl pkcs8 -topk8 -nocrypt -inform PEM -outform DER -in private_key.pem -out private_key.der
```

::: details DER 내용
```bash:no-line-numbers
$ cat private_key.der

��0�����F���vM�,UX�qۜ�y��A2��g:�Ŭ"pa�|?����aڻ�MނO_�κa{SKّ����pd�qP�b$���D�8��N[��b�8�x�q2f�S��ο3��
rxf�n�Vw{�i�HK�˵ڃUT�O�8�ύV����
�zS�ɋ�Ԁ�@g�V�(����)�/�i�O'{bX�R��m�_!{u��^>/�6`�G[_��5T�H�k��@t�İ~Q�X�J�[{@l�eKN���I�Itv���͐U��a�٪���
5��r��{I�qUR�����
                 9O$`�8�Jp7�ɤ!ۺ�~���C���T�b��aa���jrNg��41a��]z�~.�����+�Ӳ�`�.�tK7Lh`�*W\vя�4+
kt&_ܗP�S>b�5����(=�jI^��sIq���0`YzSH0 �NZ�ˣ:��rk�0C���
                                                      �ݸP/�����/���Q���#���!�(Y�K2y�6P܋k9p�2�ֽ!��� ����
                      M%��gG�&��g��r?v틁��+X��c�ϙ>�5M_�iv��1s4
                                                              �s���a��yfUq�UO�<��ݲ��D�H5�:=�D��,ߠ3�/���{�I㝿�		��dvB� oE�֗�'J��l>#J��uAJf��jl\����#����F�[Q�܃m)�ҍXI�|!��؆Rv$ƴ/$W\���2���j,2��1�]]�����V��=p�����y1@�z��P$)�@�=��/�����!{�8�j��hTm��0�W!;݂<��<I��i~U?���HTߪ/�1�L�
                                         L���*���EO!��-�|����~	)�GG�7�r�7Q!����e����G���ZC��(�&ln����$>�=     	͖�&߮��j�"Bu!m����
                                               ��[ ɘex�`O�x�V?��i�Wg��p�����y!�-�t�M�e?��龥?�?�\�B�"g?He%����K�5�W
   ����x��<YÌ�/�M"f�	H�Z�
d �r�L��
        o����ɀu�tt虆�tG��zA�R$��r3����Se(v��\^;���e�ϊ4s�t�u���,Q���	�
|"D/*
     �2(���%
```
:::

그런 다음 가져오기 도구와 함께 사용하려면 키를 줄 바꿈 없이 base64로 인코딩해야 한다.
```bash:no-line-numbers
BASE64_KEY=$(base64 -i private_key.der)
```

::: details BASE64 인코딩 된 DER 내용
```bash:no-line-numbers
$ echo $BASE64_KEY

MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxAqZGiw7/Et52TRHgLFVYi3HbnMB5m/ZBMu/CZxk6H5zFrCIXcBFh+K58P/rMydFh2rveTd6CT1+szrphe1MPS9mRjvvgy3Bk1XEEUBYOlmIk/eD3lLJEoTjY1E5bpuxirTgV7rR47XEyZsdT6g8Z6s6/M4bjCnJ4ZuBu1VZ3e/5pHrYFSEudy7Xag1Uby1T0Txr/OPPPjVYOA9jgGAO+0wr4elPHyYua1IDnQGfOVuGMKKei+PybKdUvErtp6Z5PJxl7Ylj0Uq8Vym2iXyF7deryXj4vwDZg4UdbX6TcNVSCSM5rvKtAf3S7AsSwflG9WO5Kt1t7QGy2EWVLTrnNAgMBAAECggEASfZJdAB2663+tn/NkFX182GQ2arN4gKBCw01kY1yxQ6gexhJxnFVUhKPFevF5/wMOU8kYOc4qkpwN8zJpCHbuvB+oIuWQ3++HuPwrVSpYr8Dk2FhtxGyy2pyTmentjQxYanvXXq4fi74tY6siyup07KBYPMu0X90BUs3TBhoYNQEKlcZXAR20Y+8NCsKa3QmX9yXUOmDUz5i0zWo7Ojwlig96GpJXq8au3NJcarzFZswYFkGelNIMCDcH05ao8ujOoKecmusMEOGoue1DOzduFAvFRGoo7Cx1C+O2ORR0uwCjyO2H7qrIckoBlnjSzJ5GOY2UNyLAGs5cNEy6Na9IQKBgQDmoSCfx/DSC00lFY7HZ0fsJrQWzhFnj5hyP3bti4GdtCtYxf1jgM+ZPt8SNU1fqWl2+JbDMXM0C65z39bAYcHYeWYHVXGMVU/6vDyeD3l7ohuNi7GwvnejZmN0QWoIpKQ9OeVZWQ243bKg7UTRSDWrOj30RJoS6CzfoKUIM+yCLwKBgQDEe4dJ452/0RsLFhuICQmP9GSUCHZCnSBvRZvWlw6IJ0qL+Ww+fyNKld0BdUFKZsHVamxcEr/e0MMjFYyoq4JGkBJbUZjcg6QIbSn4ENKNWEnEfCGeEf2o2IZSdiTGtC8kV1zAgIoy9he/imosMufovjHLXV2QsuDAplaQwD1wwwKBgQCf0nkxQPV6GarUUCQpu0D0Pb3/L76P7crPIXvhEhQ4nWqMkmgOVG2I3TDpBVchO92CPLL9gX88SfwTAMNpflU/FqHF40hU36oVL+0x+7dMHgLKDEyPFu8BpSq2nb5FTxMh+sUdLcF8ouXu734JKelHR403gXLkN1Ehh8nV7WWwsQKBgEfz9NdaQ6q7KOwmbG6k4JuXJD4R2z0JzZbyJt+u8eNqgCJCdSFt7b6iowylpANbHiDJmGUfeKRgTxXKDni2Vj8BA7ftac1XZ/qt/3CYuIKKknkh/C2m6P2sTYRlP5KE6b6lP5I/gFypQokiZz9IZSUWgaW3y0vyNdxXDdx0iguBAoGBAOR4r7I8WcOM9i/uTSJmoAlI9FqxCmQg6Yly6alMF5jjC2/F2/7byYB1FcZ0EnTomYb4dEePCMron3pBpFIkgx2rcjODvK/hU2Uodpy1XF47mx7dGzuTZYLPijRzl3R/5nW05xnDLBRRAQXaBKLjCYIKBHwiRAEvHioLiDIostz1
```
:::

### 3.2 Run Vault `dev` mode & Transit Enable (Option)

다음 명령어로 Vault를 개발 모드로 실행한다.
```bash:no-line-numbers
vault server -dev -dev-root-token-id=root
```

다른 명령창에서 아래 환경변수를 입력한다.
```bash:no-line-numbers
export VAULT_ADDR=http://127.0.0.1:8200
export VAULT_TOKEN=root
```

환경변수가 적용된 명령창에서 `transit`을 활성화 한다.
```bash:no-line-numbers
vault secrets enable transit
```

### 3.3 Transit Import

적절한 키 유형으로 기존 키를 가져온다.

```bash:no-line-numbers
vault transit import transit/keys/my-key $BASE64_KEY type=rsa-2048
```

::: details 키 가져오기 결과 출력 예제
```bash:no-line-numbers
$ vault transit import transit/keys/my-key $BASE64_KEY type=rsa-2048

Retrieving wrapping key.
Wrapping source key with ephemeral key.
Encrypting ephemeral key with wrapping key.
Submitting wrapped key.
Success!
```
:::

적용된 키 정보는 기존 `transit`의 키 정보를 확인하는 방식과 같다. 키를 가져오면 개인키를 기반으로 공개키가 자동 생성된다.

```bash:no-line-numbers
$ vault read transit/keys/my-key

Key                            Value
---                            -----
allow_plaintext_backup         false
auto_rotate_period             0s
deletion_allowed               false
derived                        false
exportable                     false
imported_key                   true
imported_key_allow_rotation    false
keys                           map[1:map[creation_time:2023-09-21T17:21:37.857532+09:00 name:rsa-2048 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsQKmRosO/xLedk0R4CxV
WItx25zAeZv2QTLvwmcZOh+cxawiF3ARYfiufD/6zMnRYdq73k3egk9frM66YXtT
D0vZkY774MtwZNVxBFAWDpZiJP3g95SyRKE42NROW6bsYq04Fe60eO1xMmbHU+oP
GerOvzOG4wpyeGbgbtVWd3v+aR62BUhLncu12oNVG8tU9E8a/zjzz41WDgPY4BgD
vtMK+HpTx8mLmtSA50BnzlbhjCinovj8mynVLxK7aemeTycZe2JY9FKvFcptol8h
e3Xq8l4+L8A2YOFHW1+k3DVUgkjOa7yrQH90uwLEsH5RvVjuSrdbe0BsthFlS065
zQIDAQAB
-----END PUBLIC KEY-----
]]
latest_version                 1
min_available_version          0
min_decryption_version         1
min_encryption_version         0
name                           my-key
supports_decryption            true
supports_derivation            false
supports_encryption            true
supports_signing               true
type                           rsa-2048
```

### 3.4 Transit으로 암호화/복호화

기존 `transit`의 암호화/복호화 방식과 동일하게 사용한다.

```bash
$ vault write transit/encrypt/my-key plaintext=$(echo "This is my data" | base64)

Key            Value
---            -----
ciphertext     vault:v1:Kbiudy2+vK+IRIWnMKPUOwRXPn1eh3KfvvU+59YSPJgidndodgno+7naujQvxpe8T4+ThI01pqw2SeAB6KST8Uh/WVfM91vJ5kWV2NAXJXy+gqe0K3WxzhMQT2DTkxa2mkcUj4WM9blwFW46P9z5SYuphj7ripfiPu1mclolFFD2CUU0WgdW5IzLugWWOOeUlBTh8zQMpdVVVC9xXH8WtPFErXZu1zbo1quDkoR+lLCoyt0ONfcUB24R9oVvP2RjY63Taeu5Phi8DmHDAkAa4T1xB8DbH0wGKBZoK3s2e+GFTfH5XWlxiY832Ds10IuvtbW/TZhkd2Vq1r1bYj3q9w==
key_version    1

$ echo $(vault write -field=plaintext transit/decrypt/my-key ciphertext=vault:v1:Kbiudy2+vK+IRIWnMKPUOwRXPn1eh3KfvvU+59YSPJgidndodgno+7naujQvxpe8T4+ThI01pqw2SeAB6KST8Uh/WVfM91vJ5kWV2NAXJXy+gqe0K3WxzhMQT2DTkxa2mkcUj4WM9blwFW46P9z5SYuphj7ripfiPu1mclolFFD2CUU0WgdW5IzLugWWOOeUlBTh8zQMpdVVVC9xXH8WtPFErXZu1zbo1quDkoR+lLCoyt0ONfcUB24R9oVvP2RjY63Taeu5Phi8DmHDAkAa4T1xB8DbH0wGKBZoK3s2e+GFTfH5XWlxiY832Ds10IuvtbW/TZhkd2Vq1r1bYj3q9w==) | base64 -d

This is my data
```

## 4. 키 버전 추가

이전과 동일한 키를 `transit_import`로 추가

```bash:no-line-numbers
$ vault transit import-version transit/keys/my-key $BASE64_KEY type=rsa-2048

Retrieving wrapping key.
Wrapping source key with ephemeral key.
Encrypting ephemeral key with wrapping key.
Submitting wrapped key.
Success!
```

신규 추가된 키 확인

```bash:no-line-numbers
$ vault read transit/keys/my-key
Key                            Value
---                            -----
allow_plaintext_backup         false
auto_rotate_period             0s
deletion_allowed               false
derived                        false
exportable                     false
imported_key                   true
imported_key_allow_rotation    false
keys                           map[1:map[creation_time:2023-09-21T17:21:37.857532+09:00 name:rsa-2048 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsQKmRosO/xLedk0R4CxV
WItx25zAeZv2QTLvwmcZOh+cxawiF3ARYfiufD/6zMnRYdq73k3egk9frM66YXtT
D0vZkY774MtwZNVxBFAWDpZiJP3g95SyRKE42NROW6bsYq04Fe60eO1xMmbHU+oP
GerOvzOG4wpyeGbgbtVWd3v+aR62BUhLncu12oNVG8tU9E8a/zjzz41WDgPY4BgD
vtMK+HpTx8mLmtSA50BnzlbhjCinovj8mynVLxK7aemeTycZe2JY9FKvFcptol8h
e3Xq8l4+L8A2YOFHW1+k3DVUgkjOa7yrQH90uwLEsH5RvVjuSrdbe0BsthFlS065
zQIDAQAB
-----END PUBLIC KEY-----
] 2:map[creation_time:2023-09-21T17:41:44.047857+09:00 name:rsa-2048 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv7H/FBtt07km/w4z/qAK
sJZumWinnmn5V/5f8TMfQcOjiyF2J4RTTIjUBEGsXF+/bg2w88f39f+r7Ws4wFHa
91UCgc9MpyQOil42UYN+Rm+kc6hWN26+ZmxqEU/HL1iLPwtu/HGU38MCeS5552M6
VY7BB7vIhheFyEy8+GDwrjZ3bo+f6Vaya6hyMZ7psS7N5OVaN3z7PsN57lzYaxZ6
0vVFJeUeeUq371nl7f0cN3eC8PTI8XgQW7Yy8B4lWKHzjpbA2w1hivh6cuXgE2+c
5MUqkxEKmE8BOMsgm7C+DQ9umQ4q1DkHIWub4oLUg4Tr/VgzECUj+D9tcGLZXFHd
dwIDAQAB
-----END PUBLIC KEY-----
]]
latest_version                 2
min_available_version          0
min_decryption_version         1
min_encryption_version         0
name                           my-key
supports_decryption            true
supports_derivation            false
supports_encryption            true
supports_signing               true
type                           rsa-2048
```

::: danger 주의 사항
Vault의 기본 Transit에서 제공하는 키의 순환(`rotate`)을 사용하지 않고 사용자가 임의로 새로운 키 버전을 추가하기 때문에 동일한 키가 추가될 수 있다. 이 경우, 동일한 개인 키를 Transit으로 가져오면 신규 버전으로 생성된 키(또는 이전 버전의 키)의 암호화 키 또한 동일한 공개키가 생성되므로, 키 버전과 관계 없이 복호화 된다.

동일한 개인키를 신규 버전 추가하여 기존 공개키와 신규 공개키가 같음을 확인하여 재현할 수 있다.

```bash:no-line-numbers {12-18,21-27}
$ vault read transit/keys/my-key
Key                            Value
---                            -----
allow_plaintext_backup         false
auto_rotate_period             0s
deletion_allowed               false
derived                        false
exportable                     false
imported_key                   true
imported_key_allow_rotation    false
keys                           map[1:map[creation_time:2023-09-21T17:21:37.857532+09:00 name:rsa-2048 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsQKmRosO/xLedk0R4CxV
WItx25zAeZv2QTLvwmcZOh+cxawiF3ARYfiufD/6zMnRYdq73k3egk9frM66YXtT
D0vZkY774MtwZNVxBFAWDpZiJP3g95SyRKE42NROW6bsYq04Fe60eO1xMmbHU+oP
GerOvzOG4wpyeGbgbtVWd3v+aR62BUhLncu12oNVG8tU9E8a/zjzz41WDgPY4BgD
vtMK+HpTx8mLmtSA50BnzlbhjCinovj8mynVLxK7aemeTycZe2JY9FKvFcptol8h
e3Xq8l4+L8A2YOFHW1+k3DVUgkjOa7yrQH90uwLEsH5RvVjuSrdbe0BsthFlS065
zQIDAQAB
-----END PUBLIC KEY-----
] 2:map[creation_time:2023-09-21T17:41:44.047857+09:00 name:rsa-2048 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsQKmRosO/xLedk0R4CxV
WItx25zAeZv2QTLvwmcZOh+cxawiF3ARYfiufD/6zMnRYdq73k3egk9frM66YXtT
D0vZkY774MtwZNVxBFAWDpZiJP3g95SyRKE42NROW6bsYq04Fe60eO1xMmbHU+oP
GerOvzOG4wpyeGbgbtVWd3v+aR62BUhLncu12oNVG8tU9E8a/zjzz41WDgPY4BgD
vtMK+HpTx8mLmtSA50BnzlbhjCinovj8mynVLxK7aemeTycZe2JY9FKvFcptol8h
e3Xq8l4+L8A2YOFHW1+k3DVUgkjOa7yrQH90uwLEsH5RvVjuSrdbe0BsthFlS065
zQIDAQAB
-----END PUBLIC KEY-----
]]
latest_version                 2
min_available_version          0
min_decryption_version         1
min_encryption_version         0
name                           my-key
supports_decryption            true
supports_derivation            false
supports_encryption            true
supports_signing               true
type                           rsa-2048
```

동일한 개인키가 Transit 키로 가져오기되고, 따라서 같은 공개키가 생성된다. 앞서 복호화 했던 기존 버전(`vault:v1:`)의 `ciphertext`의 버전을 신규 버전(`vault:v2:`)으로 변경하여 복호화 요청을 하면 복호화 된다.

```bash
echo $(vault write -field=plaintext transit/decrypt/my-key ciphertext=vault:v2:Kbiudy2+vK+IRIWnMKPUOwRXPn1eh3KfvvU+59YSPJgidndodgno+7naujQvxpe8T4+ThI01pqw2SeAB6KST8Uh/WVfM91vJ5kWV2NAXJXy+gqe0K3WxzhMQT2DTkxa2mkcUj4WM9blwFW46P9z5SYuphj7ripfiPu1mclolFFD2CUU0WgdW5IzLugWWOOeUlBTh8zQMpdVVVC9xXH8WtPFErXZu1zbo1quDkoR+lLCoyt0ONfcUB24R9oVvP2RjY63Taeu5Phi8DmHDAkAa4T1xB8DbH0wGKBZoK3s2e+GFTfH5XWlxiY832Ds10IuvtbW/TZhkd2Vq1r1bYj3q9w==) | base64 -d

This is my data
```

:::

## 5. 주의 사항

::: warning Rotate 불가

가져온 키는 `rotate` 기능을 사용할 수 없다.
```bash
$ vault write -f transit/keys/my-key/rotate

Error writing data to transit/keys/my-key/rotate: Error making API request.

URL: PUT http://127.0.0.1:8200/v1/transit/keys/my-key/rotate
Code: 500. Errors:

* 1 error occurred:
	* imported key my-key does not allow rotation within Vault
```

:::

::: info 최소 버전 설정

추가된 키 버전에 대해 최소 버전을 지정하는 것은 가능하다.
```bash
$ vault write -f transit/keys/my-key/config min_decryption_version=2

Key                            Value
---                            -----
allow_plaintext_backup         false
auto_rotate_period             0s
deletion_allowed               false
derived                        false
exportable                     false
imported_key                   true
imported_key_allow_rotation    false
keys                           map[2:map[creation_time:2023-09-21T17:41:44.047857+09:00 name:rsa-2048 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsQKmRosO/xLedk0R4CxV
WItx25zAeZv2QTLvwmcZOh+cxawiF3ARYfiufD/6zMnRYdq73k3egk9frM66YXtT
D0vZkY774MtwZNVxBFAWDpZiJP3g95SyRKE42NROW6bsYq04Fe60eO1xMmbHU+oP
GerOvzOG4wpyeGbgbtVWd3v+aR62BUhLncu12oNVG8tU9E8a/zjzz41WDgPY4BgD
vtMK+HpTx8mLmtSA50BnzlbhjCinovj8mynVLxK7aemeTycZe2JY9FKvFcptol8h
e3Xq8l4+L8A2YOFHW1+k3DVUgkjOa7yrQH90uwLEsH5RvVjuSrdbe0BsthFlS065
zQIDAQAB
-----END PUBLIC KEY-----
]]
latest_version                 2
min_available_version          0
min_decryption_version         2
min_encryption_version         0
name                           my-key
supports_decryption            true
supports_derivation            false
supports_encryption            true
supports_signing               true
type                           rsa-2048
```

`min_decryption_version`이 `2` 인 경우, 이보다 낮은 버전의 키 버전의 암호화 된 키는 복호화 할 수 없다.

```bash
$ vault write -field=plaintext transit/decrypt/my-key ciphertext=vault:v1:Kbiudy2+vK+IRIWnMKPUOwRXPn1eh3KfvvU+59YSPJgidndodgno+7naujQvxpe8T4+ThI01pqw2SeAB6KST8Uh/WVfM91vJ5kWV2NAXJXy+gqe0K3WxzhMQT2DTkxa2mkcUj4WM9blwFW46P9z5SYuphj7ripfiPu1mclolFFD2CUU0WgdW5IzLugWWOOeUlBTh8zQMpdVVVC9xXH8WtPFErXZu1zbo1quDkoR+lLCoyt0ONfcUB24R9oVvP2RjY63Taeu5Phi8DmHDAkAa4T1xB8DbH0wGKBZoK3s2e+GFTfH5XWlxiY832Ds10IuvtbW/TZhkd2Vq1r1bYj3q9w==
Error writing data to transit/decrypt/my-key: Error making API request.

URL: PUT http://127.0.0.1:8200/v1/transit/decrypt/my-key
Code: 400. Errors:

* ciphertext or signature version is disallowed by policy (too old)
```

:::

::: info Transit으로 암호화된 정보는 Vault에서만 복호화

Vault Transit의 암호화된 `ciphertext`는 가져오기 전의 개인 키로 복호화 할 수 없다.
(`vault:v#:`을 포함하거나 제외한 `ciphertext`의 base64 디코드된 데이터)

```bash
$  openssl rsautl -decrypt -inkey private_key.pem -in encrypted_data.bin

RSA operation error
80A095F101000000:error:0200009F:rsa routines:RSA_padding_check_PKCS1_type_2:pkcs decoding error:crypto/rsa/rsa_pk1.c:269:
80A095F101000000:error:02000072:rsa routines:rsa_ossl_private_decrypt:padding check failed:crypto/rsa/rsa_ossl.c:499:
```
 
:::