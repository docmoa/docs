---
meta:
  - name: description
    content: 엔터프라이즈 기능 - 형태보존 암호화(FPE)
tags: ["vault", "transform", "fpe"]
---

# Transform FPE (Ent)

Transform secrets 엔진은 제공된 입력 값에 대해 안전한 데이터 변환 및 토큰화를 처리합니다. 변환 방법은 FF3-1 을 통한 형태 보존 암호화(FPE) 와 같은 NIST 검증된 암호화 표준을 포함 할 수 있지만 마스킹과 같은 다른 수단을 통한 데이터의 익명 변환일 수도 있습니다.
- Doc : https://www.vaultproject.io/docs/secrets/transform
- Learn : https://learn.hashicorp.com/tutorials/vault/transform

:::tip
Enterprise 라이선스가 필요하기 때문에 라이선스가 필요한 경우 Trial 을 발급 받을 수 있습니다.
: <https://www.hashicorp.com/products/vault/trial>
:::

## Vault구성 

### Vault Dev Mode 실행 (Option)

Transform은 엔터프라이즈 기능으로, 테스트를 위해서는 엔터프라이즈 바이너리가 필요합니다. 디렉토리 뒤에 `+ent`로 표기되어있습니다.
- 릴리즈 링크 : <https://releases.hashicorp.com/vault/>

`-dev` 옵션을 추가하여 테스트를 위한 개발모드 실행을 위해서는 라이선스파일에 대한 경로 설정이 필요합니다.

```bash
export VAULT_LICENSE_PATH=<license_file_path>
vault server -dev
```

### Vault CLI 테스트 (Option)

CLI 테스트 시 필요한 환경변수는 다음과 같습니다.

```bash
export VAULT_SKIP_VERIFY=True
export VAULT_ADDR='http://127.0.0.1:8200'
export VAULT_TOKEN=<mytoken>
```

### Transform 구성

1. 우선 `transform` 시크릿 엔진을 활성화 합니다.
  ```bash
  vault secrets enable transform
  ```

2. 사용할 템플릿을 구성합니다. 
  ```bash
  vault write transform/template/phone-number-tmpl \
    type=regex \
    pattern='\d{3}-(\d{4})-(\d{4})' \
    alphabet=builtin/numeric
  ```
  - pattern에서 괄호`()`에 해당하는 위치가 암호화 됩니다.
  - 최소, 최대 암호화 필요 자리수는 [Input Limits](https://www.vaultproject.io/docs/secrets/transform#input-limits) 링크를 참고 합니다. 예를들어 숫자는 10개의 캐릭터로 구성되므로 최소 6자리는 암호화 필드로 지정되어야 합니다.

3. transform을 생성합니다. 앞서 생성한 템플릿을 지정합니다.
  ```bash
  vault write transform/transformations/fpe/phone-number \
    template="phone-number-tmpl" \
    tweak_source=internal \
    allowed_roles=customer
  ```

4. role과 role에서 사용할 transform을 지정합니다.
  ```bash
  vault write transform/role/customer transformations=phone-number
  ```

### Transform 동작 확인

- 암호화
  - 요청
    ```bash
    vault write transform/encode/customer value=010-1234-5678 \
        transformation=phone-number
    ```
  - 결과
    ```bash
    Key             Value
    ---              -----
    encoded_value    010-7494-8066
    ```

- 복호화
  - 요청
    ```bash
    vault write transform/decode/customer value=010-7494-8066 \
        transformation=phone-number
    ```
  - 결과
    ```bash
    Key             Value
    ---              -----
    decoded_value    010-1234-5678
    ```
