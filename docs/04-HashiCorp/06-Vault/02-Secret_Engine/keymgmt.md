---
meta:
  - name: description
    content: Key Management - AWS, Azure, GCP
tags: ["vault", "Vault Enterprise", "keymgmt"]
---

# Key Management

> Key Management Secret Engine을 활성화 하기 위해서는 `ADP` 수준의 라이선스가 필요하다.

Key Management 시크릿 엔진은 KMS(Key Management Service)를 공급하는 대상의 암호화 키의 배포 및 수명 주기 관리를 위한 워크플로를 제공한다. KMS 공급자 고유의 암호화 기능을 기존처럼 사용하면서도, 볼트에서 키를 중앙 집중식으로 제어할 수 있다.

볼트는 KMS의 구성에 사용되는 Key Meterial 원본을 생성하여 보유한다. 관리가능한 KMS에 대해 키 수명주기를 설정 및 관리하면 Key Meterial의 복사본이 대상에 배포된다. 이 방식으로 볼트는 KMS 서비스의 전체 수명 주기 관리 및 키 복구 수단을 제공한다. 지원되는 KMS는 다음과 같다.

- AWS KMS
- Azure Key Vault
- GCP Cloud KMS
- PKCS#11 호환

Key Management의 구성 및 동작의 순서는 다음과 같다.

1. Key Management 시크릿 엔진인 `keymgmt`를 활성화

2. 키 생성

   - `type` : 키 유형
     - AWS KMS 지원 유형: `aes256-gcm96`
     - Azure Key Vault 지원 유형 : `rsa-2048`, `rsa-3072`, `rsa-4096`
     - GCP Cloud KMS 지원 유형 : `aes256-gcm96`, `rsa-2048`, `rsa-3072`, `rsa-4096`, `ecdsa-p256`, `ecdsa-p384`

3. 지원되는 KMS 서비스 지정 및 공급자 별 인증 정보 등록

   - `awskms` : AWS KMS
   - `azurekeyvault` : Azure Key Vault
   - `gcpckms` : GCP Cloud KMS

4. KMS 서비스에 키 생성

   - `purpose` : 목적
     - `enctypt`
     - `dectypt`
     - `sign`
     - `verify`
     - `wrap`
     - `unwrap`
   - `protection` : 키 보호 지정
     - `hsm`
     - `software`

5. 관리를 위한 키 회전 (선택)

6. 키 버전 활성/비활성 (선택)

7. KMS 서비스의 키 제거
   - KMS 서비스의 키가 삭제되지만 키는 볼트에 저장
   - 영구 제거를 위해서는 별도 키 삭제 호출



### keymgmt Secret Engine 활성화

`keymgmt` 시크릿 엔진을 활성화하여, 해당 엔드포인트에서 시크릿에 대한 관리를 수행한다. 관리 목적에 따라 별도의 엔드포인트를 `path`로 지정한다. 

```bash
$ vault secrets enable keymgmt
Success! Enabled the keymgmt secrets engine at: keymgmt/
```



## 1. AWS KMS



### 1.1 구성 요소

- AWS KMS 관리를 위한 권한
  - `kms:CreateKey`
  - `kms:GetParametersForImport`
  - `kms:ImportKeyMaterial`
  - `kms:EnableKey`
  - `kms:DisableKey`
  - `kms:ScheduleKeyDeletion`
  - `kms:CreateAlias`
  - `kms:UpdateAlias`
  - `kms:DeleteAlias`
  - `kms:ListAliases`
  - `kms:TagResource`
- `keymgmt` Secret Engine 



### 1.2 Vault 가 대상 AWS KMS 관리 위해 사용할 자격증명

Secret Engine 에 대한 활성화는 Secret Engine 에 접근하기 위해 사용되는 엔드포인트 정보만 생성되었을 뿐, 연동하고자 하는 대상 AWS 환경에 대한 정보에 대해서는 세부 설정이 필요하다. 이를 위해 Vault 가 대상 AWS 환경에 대해 접근, 자격증명 발급 그리고 생명주기 관리 작업을 수행할 수 있는 권한이 부여된 자격증명 발급이 필요하다.

1. **자격증명 발급 및 생명주기 관리 권한을 위한 정책 생성**

   > AWS IAM 정책 생성: https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/access_policies_create-console.html

   1. https://console.aws.amazon.com/iam/에서 IAM 콘솔에 접속.

   2. 왼쪽의 탐색 창에서 **정책(Policies)** 을 선택.

   3. **정책 생성(Create policy)** 을 선택.

   4. **JSON** 탭을 선택.

   5. JSON 정책 문서 입력

      - Action 란에 권한 부여를 포함한 자격 증명 발급 및 관리를 위한 IAM 서비스 관련 권한 작성
      - Resource 란의 `ACCOUNT-ID-WITHOUT-HYPHENS` 는 AWS 콘솔 우상단에서 확인 가능한 숫자 12자리로 구성된 계정 고유 ID 정보 입력

      ```
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Action": [
              "kms:CreateKey",
              "kms:GetParametersForImport",
              "kms:ImportKeyMaterial",
              "kms:EnableKey",
              "kms:DisableKey",
              "kms:ScheduleKeyDeletion",
              "kms:CreateAlias",
              "kms:UpdateAlias",
              "kms:DeleteAlias",
              "kms:ListAliases",
              "kms:TagResource"
            ],
            "Resource": ["*"]
          }
        ]
      }
      ```

   6. 보안 경고, 오류 또는 일반 경고를 해결한 다음 **정책 검토(Review policy)** 선택.

   7. 정책 이름 정의 후 **정책 생성(Create Policy)** 선택 하여 생성 완료

      

2. **자격증명 발급**

   > AWS 계정 및 액세스 키 : https://docs.aws.amazon.com/ko_kr/powershell/latest/userguide/pstools-appendix-sign-up.html

   1. https://console.aws.amazon.com/iam/ 에서 IAM 콘솔에 접속.
   2. 탐색 메뉴에서 **사용자** 선택.
   3. **사용자 추가(Add User)** 선택 하여 사용자 이름 지정
   4. **직접 정책 연결(Attach policies directly)** 선택하여 이전 단계에서 생성한 정책 선택
   5. **사용자 생성(Create User)** 선택하여 사용자 생성 완료
   6. **Security credentials(보안 자격 증명)** 탭을 연 다음 **Create access key(액세스 키 생성)**를 선택.
   7. 새 액세스 키를 보려면 [**Show**]를 선택. 키 정보는 아래와 같이 액세스 키 / 보안 액세스 키로 구성.
      - 액세스 키 ID: `AKIAIOSFODNN7EXAMPLE`
      - 보안 액세스 키: `wJalrXUt******************XAMPLEKEY`
   8. 키 페어 파일을 다운로드하려면 [**Download .csv file**]을 선택



### 1.3 Vault의 AWS KMS 구성

AWS KMS에서 호환되는 암호화 키를 생성한다.

```
 vault secrets enable keymgmt

$ vault write -f keymgmt/key/aes256-gcm96 type="aes256-gcm96"
Success! Data written to: keymgmt/key/aes256-gcm96
```



생성된 암호화 키의 정보를 확인한다.

```bash
$ vault read keymgmt/key/aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       false
latest_version         1
min_enabled_version    1
name                   aes256-gcm96
type                   aes256-gcm96
versions               map[1:map[creation_time:2023-07-05T12:04:48.099141545Z]]
```



AWS KMS 공급자 리소스를 구성한다.

```bash
$ vault write keymgmt/kms/aws-kms-anea2 \
    provider="awskms" \
    key_collection="ap-northeast-2" \
    credentials=access_key="ASIADJO3WTX6WPLJM42V" \
    credentials=secret_key="bCiYmNroLxLmPNQ47VIvjlm8mQu5oktZcQdq195w"
    
Success! Data written to: keymgmt/kms/aws-kms
```

AWS KMS 공급자 리소스를 구성하는 매개변수의 설명은 다음과 같다.

| 매개변수                  | 설명                                    |
| :------------------------ | :-------------------------------------- |
| provider                  | AWS KMS를 구성하는 경우 `awskms`를 사용 |
| key_collection            | AWS 리전을 지정                         |
| credentials=access_key    | AWS Access Key                          |
| credentials=secret_key    | AWS Secret Key                          |
| credentials=session_token | AWS Session Token                       |
| credentials=endpoint      | AWS KMS API endpoint                    |



AWS KMS 공급자 리소스에 암호화 키를 배포

```bash
 vault write keymgmt/kms/:name/key/:key_name
$ vault write keymgmt/kms/aws-kms-anea2/key/aes256-gcm96 \
    purpose="encrypt,decrypt" \
    protection="hsm"
    
Success! Data written to: keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
```

- AWS KMS의 키 사용 목적(purpose)로는 `encrypt`와 `decrypt`를 함께 사용한다.
- AWS KMS에서는 보호 수준(protection)을 `hsm`만 사용 가능하다.



등록이 완료되면 AWS Console의 `Key Management Service(KMS)`에서 `고객 관리형 키`로 등록된다.

![KMS Console 2023-07-05 21-15-20](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS%20Console%202023-07-05%2021-15-20.png)



생성된 키정보를 확인하여 현재 버전에 명시된 ID가 AWS 상의 KMS의 `키 ID`와 같은지 확인한다.

```bash
$ vault read keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
Key                  Value
---                  -----
distribution_time    2023-07-05T12:14:52.173163449Z
name                 aes256-gcm96-1688559292
protection           hsm
purpose              decrypt,encrypt
versions             map[1:503e44bf-7629-47c3-8c22-a5337b3aab3a]
```

![KMS Console 2023-07-05 21-20-08](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS%20Console%202023-07-05%2021-20-08.png)



AWS KMS사용자의 경우 vault로의 API 요청으로 키ID를 확인할 수 있다.

```bash
curl -H "X-Vault-Token: token" -X GET http://<vault_hostname>:<port>/v1/keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
{
  "request_id": "e8147c9e-a3fd-71b6-075e-8f2d67393127",
  "lease_id": "",
  "lease_duration": 0,
  "renewable": false,
  "data": {
    "distribution_time": "2023-07-05T12:14:52.173163449Z",
    "name": "aes256-gcm96-1688602383",
    "protection": "hsm",
    "purpose": "decrypt,encrypt",
    "versions": {
      "1": "503e44bf-7629-47c3-8c22-a5337b3aab3a"
    }
  },
  "warnings": null
}
```



AWS KMS에 적용된 키를 순환시킨다.

```bash
$ vault write -f keymgmt/key/aes256-gcm96/rotate
```



순환되어 새로 추가된 키 버전을 확인한다.

```bash
$ vault read keymgmt/key/aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       false
latest_version         2
min_enabled_version    1
name                   aes256-gcm96
type                   aes256-gcm96
versions               map[1:map[creation_time:2023-07-05T12:04:48.099141545Z] 2:map[creation_time:2023-07-05T12:23:01.870942633Z]]
```



키가 적용된 AWS KMS에도 순환된 키 버전이 적용됨을 확인한다.

```bash
$ vault read keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
Key                  Value
---                  -----
distribution_time    2023-07-05T12:14:52.173163449Z
name                 aes256-gcm96-1688559292
protection           hsm
purpose              decrypt,encrypt
versions             map[1:503e44bf-7629-47c3-8c22-a5337b3aab3a 2:c2bb1927-76b2-4fce-8b32-73569489a70c]
```



추가된 마지막 키는 별칭(Alias)로 지정되어 앱에서는 `alias/hashicorp/<name>`으로 호출할 수 있다.

(e.g. `alias/hashicorp/aes256-gcm96-1688602383`)



AWS Console에서 확인하면, 신규 `키 ID`가 적용된 항목이 새로 추가됨을 확인할 수 있다.

![KMS Console 2023-07-05 21-25-12](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS%20Console%202023-07-05%2021-25-12.png)



적용된 키의 최소 버전을 업데이트 한다.

```bash
$ vault write keymgmt/key/aes256-gcm96 min_enabled_version=2 deletion_allowed=true
```



키의 최소 버전에 따라 그 이하의 키가 삭제되었음을 확인한다. (비활성 처리)

```bash
$ vault read keymgmt/key/aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       true
latest_version         2
min_enabled_version    2
name                   aes256-gcm96
type                   aes256-gcm96
versions               map[2:map[creation_time:2023-07-05T12:23:01.870942633Z]]
```



AWS KMS에 적용된 버전은 기존 버전은 존재하나, AWS Console에서 확인하면 비활성 처리됨을 확인할 수 있다.

```bash
$ vault read keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
Key                  Value
---                  -----
distribution_time    2023-07-05T12:14:52.173163449Z
name                 aes256-gcm96-1688559292
protection           hsm
purpose              decrypt,encrypt
versions             map[1:503e44bf-7629-47c3-8c22-a5337b3aab3a 2:c2bb1927-76b2-4fce-8b32-73569489a70c]
```

![KMS Console 2023-07-05 21-31-05](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS%20Console%202023-07-05%2021-31-05.png)



최소 버전을 이전 버전을 포함하여 업데이트 하면 이전 버전의 키가 복구된다.

```bash
$ vault write keymgmt/key/aes256-gcm96 min_enabled_version=1 deletion_allowed=true
Success! Data written to: keymgmt/key/aes256-gcm96

$ vault read keymgmt/key/aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       true
latest_version         2
min_enabled_version    1
name                   aes256-gcm96
type                   aes256-gcm96
versions               map[1:map[creation_time:2023-07-05T12:04:48.099141545Z] 2:map[creation_time:2023-07-05T12:23:01.870942633Z]]
```

![KMS Console 2023-07-05 21-33-07](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS%20Console%202023-07-05%2021-33-07.png)



AWS KMS 구성에서 키를 삭제하는 경우 적용된 키가 일괄 `삭제 대기` 상태로 변경되며, 해당 키는 삭제 가능하다. (AWS 정책상 7~30일 유예)

```bash
$ vault delete keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
Success! Data deleted (if it existed) at: keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
```

![KMS Console 2023-07-05 21-59-17](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS%20Console%202023-07-05%2021-59-17.png)



### 주의 사항 1.

AWS KMS에서 생성된 암호화 키는 기본적으로 해당 리전에 한정되어 사용된다. 암호화 키는 생성된 리전 내에서만 사용 가능하며, 다른 리전에 직접 이동시키는 것은 불가능하다. 이는 AWS KMS 서비스의 설계와 보안 모델에 기인한 제약 사항이다.

AWS KMS는 키 관리와 관련된 강력한 보안 제어를 제공합니다. 이를 위해 암호화 키는 해당 리전의 KMS 서비스에 의해 엄격하게 관리되며, 다른 리전에 암호화 키를 이동시키는 것은 보안상의 이슈를 야기할 수 있어 기본 구성은 아니다.

따라서 암호화 키를 다른 AWS 리전의 KMS에 적용하려면, 해당 리전에서 새로운 암호화 키를 생성해야 합니다. 이는 암호화 키의 보안성과 범위를 유지하기 위해 필요한 조치이다.

만약 여러 리전에서 동일한 암호화 키를 사용해야 하는 경우에는 AWS KMS의 Cross-Region Replication 기능을 사용해야 한다.



### 주의 사항 2.

키 순환을 위해서는 데이터 암호화 시 복호화 가능한 AWS KMS의 Id 또는 arn을 함께 기록해야 복호화 시 사용할 키를 지정할 수 있다. 볼트의 `transit`과는 달리 새로 생성된 키는 기존 암호화된 데이터를 복호화 할 수 없다.



## 1.5 테스트를 위한 예제 - Python

- python 3.x
- `boto3`와 `pycryptodome` 패키

```bash
$ python --version
Python 3.9.12

$ pip install boto3
$ pip install pycryptodome
```



### Encryption

```python
import base64
import json
import logging
import boto3
from botocore.exceptions import ClientError
AWS_REGION = 'ap-northeast-2'

logger = logging.getLogger()
logging.basicConfig(level=logging.INFO, format='%(asctime)s: %(levelname)s: %(message)s')
kms_client = boto3.client("kms", region_name=AWS_REGION)

def encrypt(secret, alias):
    """
    Encrypts plaintext into ciphertext by using a KMS key.
    """
    try:
        cipher_text = kms_client.encrypt(
            KeyId=alias,
            Plaintext=bytes(secret, encoding='utf8'),
        )
    except ClientError:
        logger.exception('Could not encrypt the string.')
        raise
    else:
        return base64.b64encode(cipher_text["CiphertextBlob"])

if __name__ == '__main__':
     Constants
    SECRET = 'hands-on-vault-key-management'
    KEY_ALIAS = 'alias/hashicorp/aes256-gcm96-1688605574'
    logger.info('Encrypting...')
    kms = encrypt(SECRET, KEY_ALIAS)
    logger.info(f'Encrypted string: {kms}.')
```



### Decryption

- 위 encryption 결과로 생성된 BLOB 데이터를 코드의 `CIPHER_BLOB`에 붙여넣어 테스트

```python
import base64
import json
import logging
import boto3
from botocore.exceptions import ClientError
AWS_REGION = 'ap-northeast-2'

logger = logging.getLogger()
logging.basicConfig(level=logging.INFO, format='%(asctime)s: %(levelname)s: %(message)s')
kms_client = boto3.client("kms", region_name=AWS_REGION)

def decrypt(cipher_text, alias):
    """
    Decrypts ciphertext that was encrypted by a KMS key.
    """
    try:
        plain_text = kms_client.decrypt(KeyId=alias, CiphertextBlob=bytes(base64.b64decode(cipher_text)))
    except ClientError:
        logger.exception('Could not decrypt the string.')
        raise
    else:
        return plain_text['Plaintext']

if __name__ == '__main__':
     Constants
    CIPHER_BLOB = 'AQICAHgGLc+TNQuAGEYhHYwf5zxQz9XvN0uXI2N4YU+dPYN0fgFmLVCFrkLNP+EJWytolEIfAAAAezB5BgkqhkiG9w0BBwagbDBqAgEAMGUGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMn0LDunt5nrftC18BAgEQgDgPSUhp2iLAGjEFUuSOSxDdYj1m9o4KetZJjmKfX4pvvZMJGkozLEnZpQ0KMET5NjjyGOzax7H84g=='
    KEY_ALIAS = 'alias/hashicorp/aes256-gcm96-1688605574'
    logger.info('Decrypting...')
    kms = decrypt(CIPHER_BLOB, KEY_ALIAS)
    logger.info(f"Decrypted string: {kms.decode('utf8')}.")
```



## 2. Azure key Vault

> https://developer.hashicorp.com/vault/tutorials/adp/key-management-secrets-engine-azure-key-vault



### 2.1 Azure Key Vault 구성

- Azure Key Vault

  - 기존 생성된 Azure Key Vault를 관리
  - `키 자격 증명 모음` 에서 새 키 생성

- Azure Key Vault 관리를 위한 권한

  - `create`
  - `delete`
  - `get`
  - `import`
  - `update`

- Terraform Example

  ```hcl
  terraform {
    required_providers {
      azurerm = {
        source  = "hashicorp/azurerm"
        version = "~> 3.65.0"
      }
    }
  }
  
  provider "azurerm" {
    features {
      key_vault {
        purge_soft_delete_on_destroy    = true
        recover_soft_deleted_key_vaults = true
      }
    }
  }
  
  resource "random_id" "app_rg_name" {
    byte_length = 3
  }
  
  data "azurerm_client_config" "current" {}
  
  resource "azurerm_resource_group" "key_vault_rg" {
    name     = "gs-rg-${random_id.app_rg_name.hex}"
    location = "Korea Central"
  }
  
  resource "azurerm_key_vault" "example" {
    name                       = "gs-keyvault-${random_id.app_rg_name.hex}-vault"
    location                   = azurerm_resource_group.key_vault_rg.location
    resource_group_name        = azurerm_resource_group.key_vault_rg.name
    sku_name                   = "premium"
    soft_delete_retention_days = 7
    tenant_id                  = data.azurerm_client_config.current.tenant_id
  
    access_policy {
      tenant_id = data.azurerm_client_config.current.tenant_id
      object_id = data.azurerm_client_config.current.object_id
  
      // "Create", "Delete", "Get", "Import", "Update"
      key_permissions = [
        "Backup", "Create", "Decrypt", "Delete", "Encrypt", "Get", "Import", "List",
        "Purge", "Recover", "Restore", "Sign", "UnwrapKey", "Update", "Verify", "WrapKey",
        "Release", "Rotate", "GetRotationPolicy"
      ]
    }
  }
  
  output "key_vault_name" {
    value = azurerm_key_vault.example.name
  }
  ```

  

  

### 2.2 Vault의 Azure Key Vault 구성

Azure Key Vault에서 호환되는 암호화 키를 생성한다.

- Azure Key Vault 지원 유형 : `rsa-2048`, `rsa-3072`, `rsa-4096`

```bash
$ vault write -f keymgmt/key/rsa-2048-key type="rsa-2048"
Success! Data written to: keymgmt/key/rsa-2048-key
```



생성된 암호화 키의 정보를 확인한다.

```bash
$ vault read keymgmt/key/rsa-2048-key

Key                    Value
---                    -----
deletion_allowed       false
latest_version         1
min_enabled_version    1
name                   rsa-2048-key
type                   rsa-2048
versions               map[1:map[creation_time:2023-07-14T19:18:28.45274+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2qK54OiinWQFdyupvkg0
HqBPpp/5H29fhcByipoEMpCMHpqNwgea2r6I3sTWX/0YdLZ6w/1L4Fc+B/yABu66
vXq31OXvnIkvkT73jn9qEQsnYIhqdnElngT+4DOD5nuxPd4e8Ov5OOCIAjKA36YI
VRiTJtR36qUFFVxxByGnvgSZ3Q090bRRLZx0WidqUilDAjh9CFucAcl3ybl5F80U
H3aA9HiakGm+hTV1PLZPOT9mhmZk92NFSRVEuEddNb7Rndg3RrZ2/Sgrlbmxc28R
SJnQswhA9Qbb9HmjCEmfo3rXpvEzJy8YCY24nk5GsyOwOA9z5uQwEJidBxmpsvdy
QQIDAQAB
-----END PUBLIC KEY-----
]]
```



Azure Key Vault 공급자 리소스를 구성한다.

```bash
 기본 Location은 "West US"
$ export AZURE_LOCATION='koreacentral'

$ vault write keymgmt/kms/gs-keyvault-mgmt \
    key_collection="gs-keyvault-ee81ec-vault" \
    provider="azurekeyvault" \
    credentials=client_id=$AZURE_CLIENT_ID \
    credentials=client_secret=$AZURE_CLIENT_SECRET \
    credentials=tenant_id=$AZURE_TENANT_ID
    
Success! Data written to: keymgmt/kms/gs-keyvault-mgmt
```

Azure Key Vault 공급자 리소스를 구성하는 매개변수의 설명은 다음과 같다. credentials은 Managed Service Identity (MSI)가 구성된 Azure 상에서 Vault가 실행되거나 환경변수로 지정된 경우 생략 가능하다.

| 매개변수                  | 설명                                                         |
| :------------------------ | :----------------------------------------------------------- |
| provider                  | AWS KMS를 구성하는 경우 `awskms`를 사용                      |
| key_collection            | 기존 Azure Key Vault 인스턴스의 이름을 나타냅니다. 생성 후에는 변경할 수 없습니다. |
| credentials=client_id     | Azure API를 호출하기 위한 자격 증명을 위한 클라이언트 ID (`AZURE_CLIENT_ID`) |
| credentials=client_secret | Azure API를 호출하기 위한 자격 증명을 위한 클라이언트 암호 (`AZURE_CLIENT_SECRET`) |
| credentials=tenant_id     | Azure Active Directory 조직의 테넌트 ID (`AZURE_TENANT_ID`)  |



Azure Key Vault 공급자 리소스에 암호화 키를 배포

```bash
 vault write keymgmt/kms/:name/key/:key_name
$ vault write keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key \
    purpose="encrypt,decrypt" \
    protection="hsm"
    
Success! Data written to: keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key

$ vault write keymgmt/kms/gs-keyvault-mgmt/key/rsa-4096-sign \
    purpose="sign" \
    protection="hsm"
    
Success! Data written to: keymgmt/kms/gs-keyvault-mgmt/key/rsa-4096-sign
```

![gs-keyvault-ee81ec-vault - Microsoft Azure 2023-07-14 20-24-36](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/gs-keyvault-ee81ec-vault%20-%20Microsoft%20Azure%202023-07-14%2020-24-36.png)



현재 키 버전을 확인한다.

```bash
$ vault read keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key
Key                  Value
---                  -----
distribution_time    2023-07-14T19:19:47.100453+09:00
name                 rsa-2048-key-1689329987
protection           hsm
purpose              decrypt,encrypt
versions             map[1:80bb514c42f14422b3d3405d3b2fa1fd]
```

![image-20230714204157598](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230714204157598.png)



Azure Key Vault에 적용된 키를 순환시킨다.

```bash
$ vault write -f keymgmt/key/rsa-2048-key/rotate
```



순환되어 새로 추가된 키 버전을 확인한다.

```bash
$ vault read keymgmt/key/rsa-2048-key

Key                    Value
---                    -----
deletion_allowed       false
latest_version         2
min_enabled_version    1
name                   rsa-2048-key
type                   rsa-2048
versions               map[1:map[creation_time:2023-07-14T19:18:28.45274+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2qK54OiinWQFdyupvkg0
HqBPpp/5H29fhcByipoEMpCMHpqNwgea2r6I3sTWX/0YdLZ6w/1L4Fc+B/yABu66
vXq31OXvnIkvkT73jn9qEQsnYIhqdnElngT+4DOD5nuxPd4e8Ov5OOCIAjKA36YI
VRiTJtR36qUFFVxxByGnvgSZ3Q090bRRLZx0WidqUilDAjh9CFucAcl3ybl5F80U
H3aA9HiakGm+hTV1PLZPOT9mhmZk92NFSRVEuEddNb7Rndg3RrZ2/Sgrlbmxc28R
SJnQswhA9Qbb9HmjCEmfo3rXpvEzJy8YCY24nk5GsyOwOA9z5uQwEJidBxmpsvdy
QQIDAQAB
-----END PUBLIC KEY-----
] 2:map[creation_time:2023-07-14T20:14:02.507171+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy+5ziHlHjaKN+YqfZX70
5pxjVZqT4rq2ZkFAK+HRNbSW9QQltBpnn1hmyDEhZX8FAxTiaEpF01ZVptmrNY3Q
KkHMduqUReA1jjcLbQ2E6DYCp3B/RUDLD7vNuXHvgGqTQr7aeEs0JHKYTERXt0MQ
KUeFCBRi6zyAiTrcGU2o2/PRNs3Lmxjf88IFziDbcCj4Alqj1+0ruD0n1/HG6yXI
1F5wYzziimJ+J4A3Sw2xQC/1tOxOR2onjMDT4Fd1xIsp3N7wKWFgGmQoZKn1ETtX
e4m1ZLZEmrQnpz0aoiG1IXvwfa3ncjPhrhXM2f53p0r9Zuwuq4SZpg/ZRM1zd9No
BQIDAQAB
-----END PUBLIC KEY-----
]]
```



키가 적용된 AWS KMS에도 순환된 키 버전이 적용됨을 확인한다.

```bash
$ vault read keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key
Key                  Value
---                  -----
distribution_time    2023-07-14T19:19:47.100453+09:00
name                 rsa-2048-key-1689329987
protection           hsm
purpose              decrypt,encrypt
versions             map[1:80bb514c42f14422b3d3405d3b2fa1fd 2:cb4765bae58b40e8bc1d77a96f0c0079]
```



추가된 마지막 키는 key_id로 지정되어 앱에서는 `https://<kms이름>.vault.azure.net/keys/<key이름>/<적용된 key 버전>`으로 호출할 수 있다.

(e.g. `https://gs-keyvault-ee81ec-vault.vault.azure.net/keys/rsa-2048-key-1689329987/80bb514c42f14422b3d3405d3b2fa1fd`)



Azure Console에서 확인하면, 신규 `키 ID`가 적용된 항목이 새로 추가됨을 확인할 수 있다.

![rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-14-19](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/rsa-2048-key-1689329987%20-%20Microsoft%20Azure%202023-07-14%2020-14-19.png)



적용된 키의 최소 버전을 업데이트 한다.

```bash
$ vault write keymgmt/key/rsa-2048-key min_enabled_version=2 deletion_allowed=true
```



키의 최소 버전에 따라 그 이하의 키가 삭제되었음을 확인한다. (비활성 처리)

```bash
$ vault read keymgmt/key/rsa-2048-key
Key                    Value
---                    -----
deletion_allowed       true
latest_version         2
min_enabled_version    2
name                   rsa-2048-key
type                   rsa-2048
versions               map[2:map[creation_time:2023-07-14T20:14:02.507171+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy+5ziHlHjaKN+YqfZX70
5pxjVZqT4rq2ZkFAK+HRNbSW9QQltBpnn1hmyDEhZX8FAxTiaEpF01ZVptmrNY3Q
KkHMduqUReA1jjcLbQ2E6DYCp3B/RUDLD7vNuXHvgGqTQr7aeEs0JHKYTERXt0MQ
KUeFCBRi6zyAiTrcGU2o2/PRNs3Lmxjf88IFziDbcCj4Alqj1+0ruD0n1/HG6yXI
1F5wYzziimJ+J4A3Sw2xQC/1tOxOR2onjMDT4Fd1xIsp3N7wKWFgGmQoZKn1ETtX
e4m1ZLZEmrQnpz0aoiG1IXvwfa3ncjPhrhXM2f53p0r9Zuwuq4SZpg/ZRM1zd9No
BQIDAQAB
-----END PUBLIC KEY-----
]]
```



Azure Key Vault에 적용된 버전은 기존 버전은 존재하나, AWS Console에서 확인하면 비활성 처리됨을 확인할 수 있다.

```bash
$ vault read keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key
Key                  Value
---                  -----
distribution_time    2023-07-14T19:19:47.100453+09:00
name                 rsa-2048-key-1689329987
protection           hsm
purpose              decrypt,encrypt
versions             map[1:80bb514c42f14422b3d3405d3b2fa1fd 2:cb4765bae58b40e8bc1d77a96f0c0079]
```

![rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-18-38](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/rsa-2048-key-1689329987%20-%20Microsoft%20Azure%202023-07-14%2020-18-38.png)



최소 버전을 이전 버전을 포함하여 업데이트 하면 이전 버전의 키가 복구된다.

```bash
$ vault write keymgmt/key/rsa-2048-key min_enabled_version=1 deletion_allowed=true
Success! Data written to: keymgmt/key/aes256-gcm96

$ vault read keymgmt/key/rsa-2048-key
Key                    Value
---                    -----
deletion_allowed       true
latest_version         2
min_enabled_version    1
name                   rsa-2048-key
type                   rsa-2048
versions               map[1:map[creation_time:2023-07-14T19:18:28.45274+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2qK54OiinWQFdyupvkg0
HqBPpp/5H29fhcByipoEMpCMHpqNwgea2r6I3sTWX/0YdLZ6w/1L4Fc+B/yABu66
vXq31OXvnIkvkT73jn9qEQsnYIhqdnElngT+4DOD5nuxPd4e8Ov5OOCIAjKA36YI
VRiTJtR36qUFFVxxByGnvgSZ3Q090bRRLZx0WidqUilDAjh9CFucAcl3ybl5F80U
H3aA9HiakGm+hTV1PLZPOT9mhmZk92NFSRVEuEddNb7Rndg3RrZ2/Sgrlbmxc28R
SJnQswhA9Qbb9HmjCEmfo3rXpvEzJy8YCY24nk5GsyOwOA9z5uQwEJidBxmpsvdy
QQIDAQAB
-----END PUBLIC KEY-----
] 2:map[creation_time:2023-07-14T20:14:02.507171+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy+5ziHlHjaKN+YqfZX70
5pxjVZqT4rq2ZkFAK+HRNbSW9QQltBpnn1hmyDEhZX8FAxTiaEpF01ZVptmrNY3Q
KkHMduqUReA1jjcLbQ2E6DYCp3B/RUDLD7vNuXHvgGqTQr7aeEs0JHKYTERXt0MQ
KUeFCBRi6zyAiTrcGU2o2/PRNs3Lmxjf88IFziDbcCj4Alqj1+0ruD0n1/HG6yXI
1F5wYzziimJ+J4A3Sw2xQC/1tOxOR2onjMDT4Fd1xIsp3N7wKWFgGmQoZKn1ETtX
e4m1ZLZEmrQnpz0aoiG1IXvwfa3ncjPhrhXM2f53p0r9Zuwuq4SZpg/ZRM1zd9No
BQIDAQAB
-----END PUBLIC KEY-----
]]
```

![rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-19-34](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/rsa-2048-key-1689329987%20-%20Microsoft%20Azure%202023-07-14%2020-19-34.png)



Azure Key Vault 구성에서 키를 삭제하는 경우 적용된 키가 일괄 삭제된다.

```bash
$ vault delete keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key
Success! Data deleted (if it existed) at: keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key
```

![찾을 수 없음 - Microsoft Azure 2023-07-14 20-20-51](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/%E1%84%8E%E1%85%A1%E1%86%BD%E1%84%8B%E1%85%B3%E1%86%AF%20%E1%84%89%E1%85%AE%20%E1%84%8B%E1%85%A5%E1%86%B9%E1%84%8B%E1%85%B3%E1%86%B7%20-%20Microsoft%20Azure%202023-07-14%2020-20-51.png)



### 주의 사항.

키 순환을 위해서는 데이터 암호화 시 복호화 가능한 AWS KMS의 Id 또는 arn을 함께 기록해야 복호화 시 사용할 키를 지정할 수 있다. 볼트의 `transit`과는 달리 새로 생성된 키는 기존 암호화된 데이터를 복호화 할 수 없다.





### 2.3 테스트를 위한 예제 - Python

> https://learn.microsoft.com/en-us/python/api/azure-keyvault-keys/azure.keyvault.keys.crypto?view=azure-python

- python 3.x
- `azure-keyvault-keys`, `azure-keyvault-secrets`,  `azure-identity` 패키지
- `aiohttp` 패키지

```bash
$ python --version
Python 3.9.12

$ pip install azure-keyvault-keys azure-keyvault-secrets azure-identity aiohttp
```



#### List

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.keys import KeyClient

credential = DefaultAzureCredential()
key_client = KeyClient(vault_url="https://gs-keyvault-ee81ec-vault.vault.azure.net/", credential=credential)
keys = key_client.list_properties_of_keys()

for key in keys:
    print(key.name)
```

```bash
$ python vault_list.py

rsa-2048-key-1689329987
rsa-4096-sign-1689330068
```



#### Encryption

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.keys.crypto import CryptographyClient

 Azure Key Vault 관련 설정
key_vault_name = "gs-keyvault-ee81ec-vault"
key_id = "https://gs-keyvault-ee81ec-vault.vault.azure.net/keys/rsa-2048-key-1689329987/80bb514c42f14422b3d3405d3b2fa1fd"

 인증 및 액세스 토큰 가져오기
credential = DefaultAzureCredential()

 Key Vault 클라이언트 및 암호화 클라이언트 생성
cryptography_client = CryptographyClient(key=key_id, credential=credential)

 암호화할 데이터
data_to_encrypt = b"Hello, Azure Key Vault!"

 데이터 암호화
result = cryptography_client.encrypt(algorithm="RSA-OAEP", plaintext=data_to_encrypt)
encrypted_data = result.ciphertext

print("암호화된 데이터:", encrypted_data)
```

```bash
$ python encrypt.py
Local encrypt operation failed: 'str' object has no attribute 'value'
암호화된 데이터: b"Q\x8e\x94\xe0R\xd7\xc5\x87\xa4M\x9cMx\xccM\xc2S\xd5C\xe0\xef7\xf5\x1afJ8A\x81\xef\xfcA\x8b\x82\xb4\x8d\x93\x17\xa7\xc5\x0b?x\x9b\xa6\xfd\xc2qe<_\x99@yC\x16\xa6\xcbSn\x10Z\xa9y\xa6\xf5V\xdd\xdc\x9c\xe7\xf2\x0fs\x9b\x06j\r+z\x11D|lu\xce\xccV\x9b\xef\xb8\x9c\xc2\x9b7A>\xff\xf8\x806\x98\x00o.|):\xea\x9a\xbcI\x92b\x81DE|\xc1\x80\xae\xbb\x7f\xc9\x8e5\xc5\t|\xe8\xc8\xac\x1d\x98\xc7\xc0\xca\x00b\n\x13\xe4\xd1j\xe6]L\xff'\xb7\xbd^g\xb4\x9eAZq#\x9c\x10A\x83\x82\x9d\x1bXR\xba\xb6\x17\xc3&\xaa\x95l\x83\xfcs\x89)\xb1\xde^\x07\xb3s\x87\x90\xfd\x83\xf0\xfc\x15\x82\x1a\x02\xb1\x93\x8e\x1d\x88u!K\xc9y\xdfL^\x97\xe5\xb5\x05\x83\xe4!E1\x83k\x11\xceC}\xb0C{Td\xa1\x8a\x0f=\xbeE'\x0c7\x14\xbfKm\xd0I}\xb9\xb9P\x93\xb3$\xa33\xfdn"
```



#### Decryption

- 위 encryption 결과로 생성된 BLOB 데이터를 코드의 `data_to_decrypt`에 붙여넣어 테스트

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.keys.crypto import CryptographyClient

 Azure Key Vault 관련 설정
key_vault_name = "gs-keyvault-ee81ec-vault"
key_id = "https://gs-keyvault-ee81ec-vault.vault.azure.net/keys/rsa-2048-key-1689329987/80bb514c42f14422b3d3405d3b2fa1fd"

 인증 및 액세스 토큰 가져오기
credential = DefaultAzureCredential()

 Key Vault 클라이언트 및 암호화 클라이언트 생성
cryptography_client = CryptographyClient(key=key_id, credential=credential)

 복호화할 데이터 (b"Hello, Azure Key Vault!")
data_to_decrypt = b"Q\x8e\x94\xe0R\xd7\xc5\x87\xa4M\x9cMx\xccM\xc2S\xd5C\xe0\xef7\xf5\x1afJ8A\x81\xef\xfcA\x8b\x82\xb4\x8d\x93\x17\xa7\xc5\x0b?x\x9b\xa6\xfd\xc2qe<_\x99@yC\x16\xa6\xcbSn\x10Z\xa9y\xa6\xf5V\xdd\xdc\x9c\xe7\xf2\x0fs\x9b\x06j\r+z\x11D|lu\xce\xccV\x9b\xef\xb8\x9c\xc2\x9b7A>\xff\xf8\x806\x98\x00o.|):\xea\x9a\xbcI\x92b\x81DE|\xc1\x80\xae\xbb\x7f\xc9\x8e5\xc5\t|\xe8\xc8\xac\x1d\x98\xc7\xc0\xca\x00b\n\x13\xe4\xd1j\xe6]L\xff'\xb7\xbd^g\xb4\x9eAZq#\x9c\x10A\x83\x82\x9d\x1bXR\xba\xb6\x17\xc3&\xaa\x95l\x83\xfcs\x89)\xb1\xde^\x07\xb3s\x87\x90\xfd\x83\xf0\xfc\x15\x82\x1a\x02\xb1\x93\x8e\x1d\x88u!K\xc9y\xdfL^\x97\xe5\xb5\x05\x83\xe4!E1\x83k\x11\xceC}\xb0C{Td\xa1\x8a\x0f=\xbeE'\x0c7\x14\xbfKm\xd0I}\xb9\xb9P\x93\xb3$\xa33\xfdn"

 데이터 암호화
result = cryptography_client.decrypt(algorithm="RSA-OAEP", ciphertext=data_to_decrypt)
decrypted_data = result.plaintext

print("복호화된 데이터:", decrypted_data)
```

```bash
$ python decrypt.py 
복호화된 데이터: b'Hello, Azure Key Vault!'
```



## 3. GCP Cloud KMS



### 3.1 Vault 가 대상 GCP Cloud KMS 관리 위해 사용할 역할 (권한)

1. https://console.cloud.google.com 을 통해 GCP 포탈에 접속 한다.

2. 상단 `프로젝트 선택`에서 프로젝트 이름을 선택합니다.

3. 좌측 메뉴확장 또는 검색을 통해 `IAM 및 관리자 > 역할`을 선택한다.

4. `+ 역할 만들기` 선택하여 Vault Key Management를 위한 역할 생성

   - 제목 : e.g. `vault-key-management`

   - Vault Key Management를 위해 `할당된 권한`에 다음을 추가

     - cloudkms.cryptoKeys.create

     - cloudkms.cryptoKeys.update

     - cloudkms.importJobs.create

     - cloudkms.importJobs.get

     - cloudkms.cryptoKeyVersions.list

     - cloudkms.cryptoKeyVersions.destroy

     - cloudkms.cryptoKeyVersions.update

     - cloudkms.cryptoKeyVersions.create
     - cloudkms.importJobs.useToImport

   - KeyRing을 생성하기 위해서는 `할당된 권한`에 다음을 추가

     - cloudkms.keyRings.create
     - cloudkms.keyRings.get
     - cloudkms.cryptoKeys.get

   - Encrypt/Decrypt를 테스트하기 위해서는 `할당된 권한`에 다음을 추가

     - cloudkms.cryptoKeyVersions.useToEncrypt
     - cloudkms.cryptoKeyVersions.useToDecrypt
     - cloudkms.cryptoKeyVersions.viewPublicKey



### 3.2 Vault 가 대상 GCP Cloud KMS 관리 위해 사용할 자격증명

Vault가 Cloud KMS 인스턴스에 연결하고 관리하는 데 사용할 이 서비스 계정에 대한 JSON 기반 자격 증명 파일을 생성해야한다.

1. https://console.cloud.google.com 을 통해 GCP 포탈에 접속 한다.
2. 상단 `프로젝트 선택`에서 프로젝트 이름을 선택합니다.
3. 좌측 메뉴확장 또는 검색을 통해 `IAM 및 관리자 > 서비스 계정`을 선택한다.
4. 상단의 `+ 서비스 계정 만들기`를 선택하여 신규 계정을 추가한 뒤 속성을 부여 하고 완료 합니다.
   - 서비스 계정 이름 : e.g. `vault-keymgmt-test`
   - 액세스 권한 부여 : 앞서 생성한 `vault-key-management`
5. 선택한 계정 상단의 `키` 탭을 선택합니다.
6. `키 추가` 드롭다운 메뉴를 클릭하고 `새 키 만들기`를 선택합니다.
7. `키 유형`은 JSON 을 선택하여 생성합니다.



### 3.3 GCP Cloud KMS 구성

Vault의 Key Management에서 관리할 GCP Cloud KMS를 생성한다.

1. 좌측 메뉴확장 또는 검색을 통해 `보안 > Key Management를 선택한다.

   - Cloud KMS가 비활성인경우 `사용` 버튼으로 활성화 한다.

     ![Cloud Key Management Service (KMS) API – Marketplace – gs-keymgmt-test – Google Cloud Console 2023-07-17 13-58-07](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Cloud%20Key%20Management%20Service%20(KMS)%20API%20%E2%80%93%20Marketplace%20%E2%80%93%20gs-keymgmt-test%20%E2%80%93%20Google%20Cloud%20Console%202023-07-17%2013-58-07.png)

2. GCP 안내에 따라 새로운 키링을 생성 한다. (https://cloud.google.com/kms/docs/create-encryption-keys?hl=ko)

3. 또는 Terraform 으로 새로운 키링을 생성 한다.

   ```hcl
   terraform {
     required_providers {
       google = {
         source  = "hashicorp/google"
         version = "~> 4.73.1"
       }
     }
   }
   
   locals {
     region = "asia-northeast3"
   }
   
   provider "google" {
     project     = "hc-f5e09ac82cca41c78e99aac5ea3"
     credentials = file("kms.json")
     region      = local.region
   }
   
   resource "google_kms_key_ring" "keyring" {
     name     = "vault-keyring"
     location = local.region
   }
   ```



4. 생성된 키링의 `리소스 이름 복사`를 클릭하면 Vault 구성에서 사용할 `key_collection`에 할당하는 키링의 이름을 복사할 수 있다.

![키 관리 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-41-39](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/%E1%84%8F%E1%85%B5%20%E1%84%80%E1%85%AA%E1%86%AB%E1%84%85%E1%85%B5%20%E2%80%93%20%E1%84%87%E1%85%A9%E1%84%8B%E1%85%A1%E1%86%AB%20%E2%80%93%20gs-keymgmt-test%20%E2%80%93%20Google%20Cloud%20Console%202023-07-17%2014-41-39.png)



### 3.4 Vault의 GCP Cloud KMS 구성

GCP KMS에서 호환되는 암호화 키를 생성한다.

```
$ vault write -f keymgmt/key/gcp-aes256-gcm96 type="aes256-gcm96"
Success! Data written to: keymgmt/key/gcp-aes256-gcm96
```



생성된 암호화 키의 정보를 확인한다.

```bash
$ vault read keymgmt/key/gcp-aes256-gcm96

Key                    Value
---                    -----
deletion_allowed       false
latest_version         1
min_enabled_version    1
name                   gcp-aes256-gcm96
type                   aes256-gcm96
versions               map[1:map[creation_time:2023-07-17T13:46:58.17194+09:00]]
```



GCP Cloud KMS 공급자 리소스를 구성한다.

```bash
$ vault write keymgmt/kms/gcpckms-korea \
    provider="gcpckms" \
    key_collection="projects/hc-f5e09ac82cca41c78e99aac5ea3/locations/asia-northeast3/keyRings/vault-keyring" \
    credentials=service_account_file="$FULL_PATH/kms.json"
    
Success! Data written to: keymgmt/kms/gcpckms-korea
```

AWS KMS 공급자 리소스를 구성하는 매개변수의 설명은 다음과 같다.

| 매개변수                         | 설명                                                         |
| :------------------------------- | :----------------------------------------------------------- |
| provider                         | GCP Cloud KMS를 구성하는 경우 `gcpckms`를 사용               |
| key_collection                   | GCP Cloud KMS의 키링 리소스 이름을 지정                      |
| credentials=service_account_file | 자격증명 파일로 GCP Cloud KMS 인증에 사용할 자격증명 파일을 지정한다. `GOOGLE_CREDENTIALS` 로 지정된 경우 생략할 수 있다. |



AWS KMS 공급자 리소스에 암호화 키를 배포

```bash
 vault write keymgmt/kms/:name/key/:key_name
$ vault write keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96 \
    purpose="encrypt,decrypt" \
    protection="hsm"
    
Success! Data written to: keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96
```



등록이 완료되면 GCP Console의 대상 키링에 키가 추가된 것을 확인할 수 있다.

![키 관리 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-49-10](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/%E1%84%8F%E1%85%B5%20%E1%84%80%E1%85%AA%E1%86%AB%E1%84%85%E1%85%B5%20%E2%80%93%20%E1%84%87%E1%85%A9%E1%84%8B%E1%85%A1%E1%86%AB%20%E2%80%93%20gs-keymgmt-test%20%E2%80%93%20Google%20Cloud%20Console%202023-07-17%2014-49-10.png)



생성된 키정보를 확인하여 현재 버전에 명시된 ID가 GCP 상의 KMS의 `키 ID`와 같은지 확인한다.

```bash
$ vault read keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96

Key                  Value
---                  -----
distribution_time    2023-07-17T14:48:10.777969+09:00
name                 gcp-aes256-gcm96-1689572890
protection           hsm
purpose              decrypt,encrypt
versions             map[1:1]
```

![키링 세부정보 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-51-44](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/%E1%84%8F%E1%85%B5%E1%84%85%E1%85%B5%E1%86%BC%20%E1%84%89%E1%85%A6%E1%84%87%E1%85%AE%E1%84%8C%E1%85%A5%E1%86%BC%E1%84%87%E1%85%A9%20%E2%80%93%20%E1%84%87%E1%85%A9%E1%84%8B%E1%85%A1%E1%86%AB%20%E2%80%93%20gs-keymgmt-test%20%E2%80%93%20Google%20Cloud%20Console%202023-07-17%2014-51-44.png)



GCP Cloud KMS사용자의 경우 vault로의 API 요청으로 키ID를 확인할 수 있다.

```bash
curl -H "X-Vault-Token: token" -X GET http://<vault_hostname>:<port>/v1/keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96
{
  "request_id": "6f3a9711-2c6c-d894-55a9-74897d735759",
  "lease_id": "",
  "lease_duration": 0,
  "renewable": false,
  "data": {
    "distribution_time": "2023-07-17T14:48:10.777969+09:00",
    "name": "gcp-aes256-gcm96-1689572890",
    "protection": "hsm",
    "purpose": "decrypt,encrypt",
    "versions": {
      "1": "1"
    }
  },
  "warnings": null
}
```



GCP Cloud KMS에 적용된 키를 순환시킨다.

```bash
$ vault write -f keymgmt/key/gcp-aes256-gcm96/rotate
```



순환되어 새로 추가된 키 버전을 확인한다.

```bash
$ vault read keymgmt/key/gcp-aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       false
latest_version         2
min_enabled_version    1
name                   gcp-aes256-gcm96
type                   aes256-gcm96
versions               map[1:map[creation_time:2023-07-17T13:46:58.17194+09:00] 2:map[creation_time:2023-07-17T14:54:38.978298+09:00]]
```



키가 적용된 AWS KMS에도 순환된 키 버전이 적용됨을 확인한다.

```bash
$ vault read keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96
Key                  Value
---                  -----
distribution_time    2023-07-17T14:48:10.777969+09:00
name                 gcp-aes256-gcm96-1689572890
protection           hsm
purpose              decrypt,encrypt
versions             map[1:1 2:2]
```



GCP Console에서 확인하면, 신규 대상 키에 신규 버전의 키 항목이 새로 추가됨을 확인할 수 있다.

![키: “gcp-aes256-gcm96-1689572890” – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-56-06](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/%E1%84%8F%E1%85%B5:%20%E2%80%9Cgcp-aes256-gcm96-1689572890%E2%80%9D%20%E2%80%93%20%E1%84%87%E1%85%A9%E1%84%8B%E1%85%A1%E1%86%AB%20%E2%80%93%20gs-keymgmt-test%20%E2%80%93%20Google%20Cloud%20Console%202023-07-17%2014-56-06.png)



적용된 키의 최소 버전을 업데이트 한다.

```bash
$ vault write keymgmt/key/gcp-aes256-gcm96 min_enabled_version=2 deletion_allowed=true

Success! Data written to: keymgmt/key/gcp-aes256-gcm96
```



키의 최소 버전에 따라 그 이하의 키가 삭제되었음을 확인한다. (비활성 처리)

```bash
$ vault read keymgmt/key/gcp-aes256-gcm96

Key                    Value
---                    -----
deletion_allowed       true
latest_version         2
min_enabled_version    2
name                   gcp-aes256-gcm96
type                   aes256-gcm96
versions               map[2:map[creation_time:2023-07-17T14:54:38.978298+09:00]]
```



GCP Cloud KMS에 적용된 버전은 기존 버전은 존재하나, GCP Console에서 확인하면 비활성 처리됨을 확인할 수 있다.

```bash
$ vault read keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96
Key                  Value
---                  -----
distribution_time    2023-07-17T14:48:10.777969+09:00
name                 gcp-aes256-gcm96-1689572890
protection           hsm
purpose              decrypt,encrypt
versions             map[1:1 2:2]
```

![Google Cloud console 2023-07-17 14-58-47](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Google%20Cloud%20console%202023-07-17%2014-58-47.png)



최소 버전을 이전 버전을 포함하여 업데이트 하면 이전 버전의 키가 복구된다.

```bash
$ vault write keymgmt/key/gcp-aes256-gcm96 min_enabled_version=1 deletion_allowed=true

Success! Data written to: keymgmt/key/gcp-aes256-gcm96

$ vault read keymgmt/key/gcp-aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       true
latest_version         2
min_enabled_version    1
name                   gcp-aes256-gcm96
type                   aes256-gcm96
versions               map[1:map[creation_time:2023-07-17T13:46:58.17194+09:00] 2:map[creation_time:2023-07-17T14:54:38.978298+09:00]]
```

![키: “gcp-aes256-gcm96-1689572890” – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 15-00-06](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/%E1%84%8F%E1%85%B5:%20%E2%80%9Cgcp-aes256-gcm96-1689572890%E2%80%9D%20%E2%80%93%20%E1%84%87%E1%85%A9%E1%84%8B%E1%85%A1%E1%86%AB%20%E2%80%93%20gs-keymgmt-test%20%E2%80%93%20Google%20Cloud%20Console%202023-07-17%2015-00-06.png)



### 3.5 테스트를 위한 예제 - Python

> https://github.com/GoogleCloudPlatform/python-docs-samples/blob/HEAD/kms/snippets/encrypt_symmetric.py
>
> https://github.com/GoogleCloudPlatform/python-docs-samples/blob/174c3032a1faea4ceb3b93385eac71b80d87e6e1/kms/snippets/decrypt_symmetric.py

- python 3.x
- 필요 패키지
  - google-cloud-kms
  - cryptography
  - crcmod
  - jwcrypto


```bash
$ python --version
Python 3.9.12
 
$ pip install google-cloud-kms cryptography crcmod jwcrypto

$ export GOOGLE_APPLICATION_CREDENTIALS="$FULL_PATH/kms.json"
```



google-cloud-kms 설치시 `grpcio` 설치 실패하여 테스트 하지 못함



### 3.6 테스트를 위한 예제 - NodeJS

>https://github.com/googleapis/nodejs-kms/tree/aad6cc451952f42b96d752f31399a2c364f07610/samples

- nodejs v14.20.0
- 필요 패키지
  - @google-cloud/kms
  - fast-crc32c

```bash
$ node --version
v14.20.0

$ npm install --save @google-cloud/kms
$ npm install --save fast-crc32c

$ export GOOGLE_APPLICATION_CREDENTIALS="$FULL_PATH/kms.json"
```



#### package.json

```json
{
  "name": "gcpckms-test",
  "version": "1.0.0",
  "description": "",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@google-cloud/kms": "^3.7.0",
    "fast-crc32c": "^2.0.0"
  }
}
```



#### encryptSymmetric.js

```python
'use strict';

const projectId = 'hc-f5e09ac82cca41c78e99aac5ea3'
const locationId = 'asia-northeast3'
const keyRingId = 'vault-keyring'
const keyId = 'gcp-aes256-gcm96-1689572890'
const versionId = '1'
const plaintextBuffer = Buffer.from('Vault GCP Cloud KMS test')

const {KeyManagementServiceClient} = require('@google-cloud/kms');

const crc32c = require('fast-crc32c');

// Instantiates a client
const client = new KeyManagementServiceClient();

// Build the key name
const keyName = client.cryptoKeyPath(projectId, locationId, keyRingId, keyId, versionId);

// Optional, but recommended: compute plaintext's CRC32C.
async function encryptSymmetric() {
  const plaintextCrc32c = crc32c.calculate(plaintextBuffer);
  console.log(`Plaintext crc32c: ${plaintextCrc32c}`);
  const [encryptResponse] = await client.encrypt({
    name: keyName,
    plaintext: plaintextBuffer,
    plaintextCrc32c: {
      value: plaintextCrc32c,
    },
  });

  const ciphertext = encryptResponse.ciphertext;

  // Optional, but recommended: perform integrity verification on encryptResponse.
  // For more details on ensuring E2E in-transit integrity to and from Cloud KMS visit:
  // https://cloud.google.com/kms/docs/data-integrity-guidelines
  if (!encryptResponse.verifiedPlaintextCrc32c) {
    throw new Error('Encrypt: request corrupted in-transit');
  }
  if (
    crc32c.calculate(ciphertext) !==
    Number(encryptResponse.ciphertextCrc32c.value)
  ) {
    throw new Error('Encrypt: response corrupted in-transit');
  }

  console.log(`Ciphertext: ${ciphertext.toString('base64')}`);
  console.log(`Ciphertext crc32c: ${encryptResponse.ciphertextCrc32c.value}`)
  return ciphertext;
}

async function decryptSymmetric(ciphertext) {
  const cipherTextBuf = Buffer.from(await ciphertext);
  const ciphertextCrc32c = crc32c.calculate(cipherTextBuf);
  console.log(`Ciphertext crc32c: ${ciphertextCrc32c}`);
  const [decryptResponse] = await client.decrypt({
    name: keyName,
    ciphertext: cipherTextBuf,
    ciphertextCrc32c: {
      value: ciphertextCrc32c,
    },
  });

  // Optional, but recommended: perform integrity verification on decryptResponse.
  // For more details on ensuring E2E in-transit integrity to and from Cloud KMS visit:
  // https://cloud.google.com/kms/docs/data-integrity-guidelines
  if (
    crc32c.calculate(decryptResponse.plaintext) !==
    Number(decryptResponse.plaintextCrc32c.value)
  ) {
    throw new Error('Decrypt: response corrupted in-transit');
  }

  const plaintext = decryptResponse.plaintext.toString();

  console.log(`Plaintext: ${plaintext}`);
  console.log(`Plaintext crc32c: ${decryptResponse.plaintextCrc32c.value}`)
  return plaintext;
}

decryptSymmetric(encryptSymmetric());
```

```bash
$ node encrypt_decrypt.js
Ciphertext: CiQADXWVuwUXBHPL+a8tqce4HfUe3YDMujDZebUWGn4wajmCflcSRypFChQKDJ2A64fX3MUmUfJ8fxDiwuqVBhITCgtm+dZClP/tuRw0CxDE64XfDRoYChChQEcfHsoXhHFXpkpaaTvMENuLg60G
Plaintext: Vault GCP Cloud KMS test
```

