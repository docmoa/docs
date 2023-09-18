---
description: Vault의 KMIP 기능과 MongoDB 연동
tag: ["vault", "Vault Enterprise", "KMIP", "MongoDB"]
---

# KMIP - MongoDB
> Enterprise 기능

## Vault - dev mode run (Option)

```bash
VAULT_UI=true vault server -dev-root-token-id=root -dev -log-level=trace

export VAULT_ADDR="http://127.0.0.1:8200"
echo "export VAULT_ADDR=$VAULT_ADDR" >> /root/.bashrc
vault status
vault login root
```

## KMIP 구성
KMIP 활성화
```bash
$ vault secrets enable kmip

Success! Enabled the kmip secrets engine at: kmip/
```

KMIP Listner 구성 (5696은 표준 기본 포트 입니다.)
```bash
$ vault write kmip/config listen_addrs=0.0.0.0:5696 \
  tls_ca_key_type="rsa" \
  tls_ca_key_bits=2048
  
Success! Data written to: kmip/config
```

MongoDB에 전달할 KMIP CA 인증서를 저장
```bash
$ vault read -format json kmip/ca | jq -r .data.ca_pem > ca.pem
```

샘플로 "HashiCup" 앱의 관리 개체에 대한 범위를 생성
- 범위는 KMIP 관리 객체를 여러 명명된 버킷으로 분할합니다. (여기서는 "HashiCup")
- 버킷 하위의 Role(역할)은 버킷 내에서 관리되며 다양한 허용 KMIP 작업을 할당할 수 있습니다. 여기서는 MongoDB가 수행할 수 있는 허용된 KMIP 작업을 지정하는 "payment" 역할도 생성합니다.
```bash
$ vault write -f kmip/scope/hashicups
Success! Data written to: kmip/scope/hashicups

$ vault write kmip/scope/hashicups/role/payments operation_all=true
Success! Data written to: kmip/scope/hashicups/role/payments
```

리프 인증서와 개인 키 생성
```bash
$ vault write -format=json \
  kmip/scope/hashicups/role/payments/credential/generate \
  format=pem > credential.json
$ jq -r .data.certificate < credential.json > cert.pem
$ jq -r .data.private_key < credential.json > key.pem
$ cat cert.pem key.pem > client.pem
```

## MongoDB 구성
KMIP을 사용하기 위한 옵션과 함께 mongoDB를 시작
```bash
$ mongod --dbpath /var/lib/mongodb \
  --logpath /var/log/mongodb/mongo.log \
  --enableEncryption \
  --kmipServerName localhost \
  --kmipPort 5696 \
  --kmipServerCAFile ca.pem \
  --kmipClientCertificateFile client.pem
```

KMIP 적용 확인
```bash
$ cat /var/log/mongodb/mongo.log  | grep KMIP | jq
{
  "t": {
    "$date": "2021-07-20T02:03:34.031+00:00"
  },
  "s": "I",
  "c": "STORAGE",
  "id": 24199,
  "ctx": "initandlisten",
  "msg": "Created KMIP key",
  "attr": {
    "keyId": "agZTSeeJyQjVOKJgn3xeGJ6Va8sXfRXP"
  }
}
```

## TEST
샘플 데이터 삽입
```bash
$ mongo

MongoDB Enterprise > db.examples.insertOne(
  {
    name: "sue",
    age: 26
  }
)

MongoDB Enterprise > exit
```

결과 확인
```bash
# Collection WiredTiger 파일에 기록된 정보
# KMIP 적용 전
$ cat /var/lib/mongodb/collection-7*
A�#�\�D���1_id`�1�g�~R=��namesueage:@4�D��8�����D��2

# KMIP 적용 후
$ cat /var/lib/mongodb/collection-7*
A�#�\
     ��$�|��H�}l�����(ں?����s�ɛocD��\K�>J������m��N��#����_�������К
�X���ϩ}_�z6��L�nQ���pQ�sO�]�0���h_�     #�Ȟ�߳2
```