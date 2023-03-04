---
meta:
  - name: description
    content: Vault Token의 이해
tags: ["vault", "token"]
---

# Token의 이해

> https://developer.hashicorp.com/vault/docs/concepts/tokens

![image-20230304125220402](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230304125220402.png)



## 1 Token의 구성과 내용

다음은 수동으로 Token을 생성하는 방법으로 Token을 생성할 수 있는 권한의 사용자가 CLI를 사용하여 `default` Policy를 갖는 Token을 생성하는 경우의 예이다.

```bash
$ vault token create -policy=default

Key                  Value
---                  -----
token                hvs.CAESIO7WUHJ15SkEOgtqzcVuF8pTZdBQmI
token_accessor       yK2enofb1NExLrLFqg136mw5
token_duration       768h
token_renewable      true
token_policies       ["default"]
identity_policies    []
policies             ["default"]
```

간단한 응답과 달리 API로 요청하면 더 상세한 응답 결과를 확인할 수 있다.

```bash
# payload.json
{
  "policies": ["default"],
  "meta": {
    "user": "armon"
  },
  "ttl": "1h",
  "renewable": true
}

# API 요청
curl \
    --header "X-Vault-Token: root" \
    --request POST \
    --data @payload.json \
		http://127.0.0.1:8200/v1/auth/token/create | jq .

# API 응답
{
  "request_id": "a0a87aea-3627-a2a6-ab3c-8c08285fdc7d",
  "lease_id": "",
  "renewable": false,
  "lease_duration": 0,
  "data": null,
  "wrap_info": null,
  "warnings": [
    "Endpoint ignored these unrecognized parameters: [meta]"
  ],
  "auth": {
    "client_token": "hvs.CAESIO-LeVOy1mOLSz1f-yDC22cFqOXQ2u5a3hmLVxeZ1V07Gh4KHGh2cy5mTmJZbERwZ0xLeldqeFgwYWRyc3Z4a0g",
    "accessor": "ArOmYq9MuDyo1wZkLisad6Ml",
    "policies": [
      "default"
    ],
    "token_policies": [
      "default"
    ],
    "metadata": {
      "user": "armon"
    },
    "lease_duration": 3600,
    "renewable": true,
    "entity_id": "",
    "token_type": "service",
    "orphan": false,
    "mfa_requirement": null,
    "num_uses": 0
  }
}
```

다음은 userpass 인증방식을 CLI를 사용하여 `default` Policy를 갖는 Token을 발급받는 경우의 예이다. 이경우 발급된 Token은 시스템 홈디렉터리의 `.vault-token` 파일에 Token이 저장된다.

```bash
$ vault login -method=userpass username=admin
Password (will be hidden): ********

Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                    Value
---                    -----
token                  hvs.CAESIFyNxoV1I-_nFeBh9LBxDB9oGNghX
token_accessor         80nJPKtpaPbMUyQ715VkRGig
token_duration         768h
token_renewable        true
token_policies         ["default"]
identity_policies      []
policies               ["default"]
token_meta_username    admin
```

CLI 출력을 기준으로 출력된 `Key`의 설명은 다음과 같다.

| CLI 결과          | API 결과                | 설명                                                |
| ----------------- | ----------------------- | --------------------------------------------------- |
| token             | client_token            | 생성된 Token 문자열 값                              |
| token_accessor    | accessor                | Token과 쌍으로 생성된 참조 값                       |
| token_duration    | lease_duration          | 생성된 Token의 사용 기간                            |
| token_renewable   | renewable               | Renewal 가능 여부                                   |
| token_policies    | token_policies          | 생성시 부여된 Policy                                |
| identity_policies | (entity_id로 조회 필요) | Token이 속한 Identity(Entity)에 부여된  Policy 목록 |
| polices           | policies                | Token에 부여된 전체 Policy 목록                     |
| token_meta_[key]  | metadata                | metatada 출력                                       |

Token이 생성되면 종류에 따라 붙는 Prefix를 보고 유형을 유추할 수 있다.

| Token 유형     | <1.9 | >=1.10 |
| -------------- | ---- | ------ |
| Service Token  | s.   | hvs.   |
| Batch Token    | b.   | hvb.   |
| Recovery Token | r.   | hvr.   |



## 2 Token 계층(종속성)

Token의 여러 속성 중 종속성의 이해가 필요하다. 종속성으로 인해 상위 Token이 취소되거나 만료되면 하위 Token도 함께 취소된다. 동작을 확인하기 위해 독립된 Orphan Token을 생성하고 하위 Token을 생성 한 뒤 상위 Token을 취소했을 때 현상을 확인하여 종속성의 결과를 확인 가능하다.

Root Token이 `VAULT_TOKEN` 환경변수에 정의된 상태에서 모든 권한을 갖는 Policy를 생성한다.

```bash
# super-user.hcl 
path "*" {
    capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}

# Policy 적용
$ vault policy write super-user super-user.hcl
```

독립된 Token을 생성한다. 이 Token의 TTL은 60초로 짧게 부여한다.

```bash
$ vault token create -policy=super-user -ttl=60s -orphan
```

새로 생성된 Token을 `VAULT_TOKEN`환경변수로 지정한 상태에서 새로운 하위 Token을 생성한다. 이 Token의 TTL은 768시간으로 길게 부여한다.

```bash
$ vault token create -policy=default -ttl=768h
```

`-orphan` 옵션이 붙지 않은 Token은 상위 Token에 종속되므로 768시간의 TTL을 갖고 있지만 상위 Token이 60초가 지나 만료되면 해당 하위 토큰도 함께 만료됨을 확인할 수 있다.

```bash
$ vault token <CHILD_TOKEN>
Error looking up token: Error making API request.

URL: POST http://127.0.0.1:8200/v1/auth/token/lookup
Code: 403. Errors:

* bad token
```



## 3 Orphan Token

Token 종속성으로인한 하위 Token의 의도하지 않은 취소를 피하려면 Orphan(고아) Token으로의 지정이 필요하다. Token을 생성한 Parent(부모/상위) Token과 생성된 Child(자식/하위) Token의 관계가 형성되며, Orphan Token의 경우 Parent에서 독립되어 Token Tree의 루트가 된다. Orphan Token을 생성하는 방안은 다음과 같다.



### 방안 1. `auth/token/create-orphan` 엔드포인트

`auth/token/create-orphan` 엔드포인트에 `write` 권한이 필요하다.

```hcl
path "auth/token/create-orphan" {
    capabilities = ["create", "update"]
}
```

Token 생성 시 해당 엔드포인트로 요청하여 Orphan Token을 생성한다.

```bash
 $ vault write -force auth/token/create-orphan policies=default
```



### 방안 2. `auth/token/create` 요청 시 `no_parent` 옵션 사용

 [방안 1]과 같이 Orphan을 위한 엔드포인트 외에 일반적인 Token 생성 엔드포인트를 요청하는 경우 `no_parent` 옵션을 `true`로 설정하여 요청한다. `auth/token/create` 엔드포인트에 `write` 권한 필요하다.

```hcl
path "auth/token/create" {
    capabilities = ["create", "update"]
}
```

Token 생성 시 해당 엔드포인트로 요청하여 Orphan Token을 생성한다.

```bash
$ vault write -force auth/token/create policies=default no_parent=true
```

 `vault write` 요청과 함께, Token을 위한 전용 CLI 인 `vault token create`를 사용할 수 있다.

```bash
$ vault token create -policy="default" -orphan
```



### 방안 3. Token Role에 Orphan 정의

Token을 필요한 시점마다 만드는 것이 아닌 미리 정의된 Token Role을 기반으로 Token을 생성할 때, 해당 Role에 Orphan으로 생성한다는 정의가 된 경우 생성되는 Token은 Orphan Token이 된다. Token Role을 CLI로 생성하는 방법은 다음과 같다. 간단히 허용하는 Policy와 Orphan 여부만 설정하였다.

```bash
$ vault write auth/token/roles/my-orphan allowed_policies="default" orphan=true
```

Token Role을 기반으로 Token 생성을 요청하면 정의된 설정에 의해 Token이 생성된다.

```bash
$ vault token create -policy=default -role=my-orphan
```



### 방안 4. Token 직접 생성을 제외한 Auth Methods로 로그인

Auth Methods를 통해 인증 후 받게되는 Token은 Orphan Token으로 생성되어 반환된다.



위 [방안 1~4]에서 생성된 Orphan Token은 Token을 조회하면 Orphan 여부를 확인할 수 있다.

```bash
$ vault token lookup <VAULT_TOKEN>

Key                 Value
---                 -----
...
orphan              true # Orphan 여부
path                auth/userpass/login/admin # Token이 생성된 API 엔드포인트
policies            [default super-user]
type                service
```



## 4 Token 유형

Token의 유형은 `Service` 타입과 `Batch` 타입으로 나뉘며, 각각은 Orphan 여부에 따라 Token을 생성한 Parent Token과의 종속성을 정의할 수 있다. 

- Service Token : 
  - Orphan Token이 아니라면 이를 생성한 Token과 연결되어 함께 추적
  - Parent Token이 만료되면 함께 취소됨
- Batch Token : 
  - Batch Token으로 생성된  Lease는 Batch Token의 남은 TTL 기간으로 제한
  - Batch Token이 Orphan이 아닌 경우 이를 생성한 상위 Token에 의해 추적되며, Parent Token 만료시 사용 중지

| 기능                                                  | Service Token                        | Batch Token                            |
| ----------------------------------------------------- | ------------------------------------ | -------------------------------------- |
| Root Token 역할                                       | ✅                                    | ⛔️                                      |
| Chile Token 생성                                      | ✅                                    | ⛔️                                      |
| Renewable(기간 늘림)                                  | ✅                                    | ⛔️                                      |
| Manually Revocable(수동 취소)                         | ✅                                    | ⛔️                                      |
| Periodic 형태                                         | ✅                                    | ⛔️                                      |
| Explicit Max TTL 설정                                 | ✅                                    | ⛔️ (고정)                               |
| Accessor 여부                                         | ✅                                    | ⛔️                                      |
| Cubbyhole 사용 여부                                   | ✅                                    | ⛔️                                      |
| Revoke with parent (부모 Token이 취소될 때 같이 취소) | ✅                                    | Revoke는 아니나 사용 중지              |
| Dynamic Secrets lease assignment                      | 자체 할당                            | 부모로 동작                            |
| Performance Replication Cluster 전체에서 사용         | ⛔️                                    | ✅                                      |
| Cost                                                  | 무거움 : 백엔드 스토리지에 건당 저장 | 가벼움 : 백엔드 스토리지 저장되지 않음 |

볼트를 처음 Init 하면 Root Token이 발급된다. Root Token은 Service Token의 일종이나 몇가지 특징이 있다.



## 5 Token Accessor

Token이 생성되면 Accessor도 함께 생성되는데, 이 Accessor는 Token을 참조하는 값임과 동시에 Token을 직접 알지 못하더라도 Token에 대한 기본 속성이나 Renew(갱신),  Revoke(취소) 작업을 수행할 수 있다. Accessor에 대한 작업은 일반적인 `read`, `write` 작업과 더불어 `vault token` CLI로도 사용 가능하다.

```bash
# Token lookup
$ vault write auth/token/lookup-accessor accessor=<ACCESSOR>
$ vault token lookup -accessor <ACCESSOR>

# Token Renew
$ vault write auth/token/renew-accessor accessor=<ACCESSOR>
$ vault token renew -accessor <ACCESSOR>

# Token Revoke
$ vault write auth/token/revoke-accessor accessor=<ACCESSOR>
$ vault token revoke -accessor <ACCESSOR>
```

이미 발급된 Token을 알수는 없지만 몇몇 동작은 Accessor로 수행이 가능하므로, 이런 Accessor 값을 노출시키는 것은 임의로 Revoke하는 작업이 수반되는 경우 위험할 수 있어 각별히 조심해야 한다.



## 6 TTL과 Period

Root Token을 제외한 모든 Token은 TTL이 부여된다. TTL은 token의 생성 시간 또는 마지막 갱신 시간 중 가장 최근 시간 기준으로 이후의 유효한 기간까지의 시간이다.

- Token의 TTL이 갱신이 가능한 경우 `vault token renew` 명령으로 갱신 가능
- Token에는 Explicit Max TTL를 설정할 수 있으며, Explicit Max TTL 시간 까지는 TTL을 갱신 할 수 있으며, 모든 경우에서 Max TTL을 넘어서 사용 불가

다음과 같이 TTL과 Explicit Max TTL을 설정하여 Token을 생성해본다.

```bash
$ vault token create -policy=default -ttl=60s -explicit-max-ttl=90s
```

생성된 Token의 정보를 확인해보면 적용된 값이 확인된다.

```bash
$ vault token lookup <TOKEN>
Key                 Value
---                 -----
creation_ttl        1m
expire_time         2023-03-04T16:44:40.187494+09:00
explicit_max_ttl    1m30s
issue_time          2023-03-04T16:43:40.187497+09:00
ttl                 54s
```

TTL과 관련된 내용을 확인해보면 다음과 같이 해석할 수 있다.

- issue_time : 해당 시간에 Token이 발급됨
- creation_ttl : 최초 요청된 TTL 시간
- expire_time : 현재 부여된 TTL을 기준으로 만료되는 시간
- ttl : 현재 남은 TTL
- explicit_max_ttl : 최대로 부여받을 수 있는 총 TTL

Renew를 수행하면 최초 부여한 60초 만큼을 더하여 TTL을 증가시키는데, Explicit Max TTL이 1분 30초 이므로, 30초가 넘어간 시점에 Renew를 요청하면 추가 60초 만큼을 남은 총량 대비 부여하지 못한다는 메시지를 확인할 수 있다.

```bash
$ vault token renew <TOKEN>

WARNING! The following warnings were returned from Vault:

  * TTL of "1m" exceeded the effective max_ttl of "56s"; TTL value is capped
  accordingly
```



TTL은 특성상 max TTL이 있으므로 영구적으로 사용은 불가능한 속성이다. Token이 만료되는 것이 문제가 될 수 있고, 오랜 기간동안 유지해야 하는 경우 Periodic Token을 사용한다.

- periodic token에는 TTL은 있지만 max TTL은 없음
- TTL이 지나면 자동으로 취소되고, 만약 계속 사용한다면 `vault token renew` 로 TTL을 계속 갱신해서 사용

Periodic Token을 생성하는 방법은 `ttl` 대신 `period` 에 기간을 주어 생성한다.

```bash
$ vault token create -policy=default -period=60s
```

생성된 Token의 정보를 확인해보면 `period` 값이 있는 것이 확인된다.

```bash
$ vault token lookup <TOKEN>

Key                 Value
---                 -----
explicit_max_ttl    0s
period              1m
```

`explicit_max_ttl`이 0초라는 의미는 무제한으로 풀이할 수 있다. 이후 Renew를 수행하면 지속적으로 TTL이 갱신되는 것을 확인할 수 있다.

```bash
$ vault token renew <TOKEN>

Key                  Value
---                  -----
token_duration       1m

$ vault token renew <TOKEN>

Key                  Value
---                  -----
token_duration       1m

...계속...
```



## 7 Root Token

볼트를 Init하면 최초 발급되는 Token이 Root Token이다. 볼트에서 유일하게 만료되지 않는 Token으로 모든 권한(`root` Policy)을 갖고 있다. 일반적으로 Init 후 `root` 권한을 갖는 일반 인증을 생성한 뒤 파기하는 것을 권장한다.

```hcl
# Root에 준하는 Policy
path "*" {
	capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
```

Root Token을 분실했거나 파기 후 필요한 경우 다음 순서에 따라 새로운 Root Token을 발급한다.

> https://developer.hashicorp.com/vault/tutorials/operations/generate-root



### 단계 1. Root Token 생성 초기화

```bash
$ vault operator generate-root -init

A One-Time-Password has been generated for you and is shown in the OTP field.
You will need this value to decode the resulting root token, so keep it safe.
Nonce         1a6294ff-1f09-cccf-6434-e49279aec4df
Started       true
Progress      0/1
Complete      false
OTP           vxa9sXQjPCb91C1rS1yPJYcMw90f
OTP Length    28
```

생성된 `Nonce`와 `OTP`가 Unseal 및 인코딩된 Root Token 복호화에 사용된다.



### 단계 2. Root Token 생성

동일한 터미널 상에서 수행했다면 `Nonce` 값이 자동으로 입력되지만 아닌경우에는 `-nonce` 속석으로 지정이 필요하다.

```bash
$ vault operator generate-root
or
$ vault operator generate-root -nonce=1a6294ff-1f09-cccf-6434-e49279aec4df
```



### 단계 3. Unseal key를 활용한 인코딩된 Root Token 발급

`vault operator generate-root`를 수행하면 Unseal 키를 입력해야 한다. Init에서 발생된 Unseal Key 값을 입력하여 인코딩된 Root Token을 발급 받는다.

```bash
$ vault operator generate-root

Root generation operation nonce: 1a6294ff-1f09-cccf-6434-e49279aec4df
Unseal Key (will be hidden):

Nonce            1a6294ff-1f09-cccf-6434-e49279aec4df
Started          true
Progress         5/5
Complete         true
Encoded Token    Hg4SFzwRZCAoAQFheHRLHmZiFicabzZ7D0pEJw
```



### 단계 4. Root Token 복호화

초기화시 발급된 `OTP`를 이용하여 인코딩된  Root Token을 복호화 한다.

```bash
$ vault operator generate-root \
	-decode=Hg4SFzwRZCAoAQFheHRLHmZiFicabzZ7D0pEJw \
	-otp=vxa9sXQjPCb91C1rS1yPJYcMw90f
	
hvs.OI5JxBcXI7zl5SowP6U6xstA
```

