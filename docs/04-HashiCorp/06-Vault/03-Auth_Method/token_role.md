---
meta:
  - name: description
    content: Token Role 생성 및 Tune 적용하여 장기 유지되는 Token 생성하기
tags: ["vault auth"]
---

# Token Role

별도 Auth Method를 사용하지 않고 Token으로만 사용하는 경우 Token에 대한 role을 생성하여 해당 role의 정의된 설정에 종속된 Token을 생성할 수 있음

- Entity가 발생하므로 Vault Client Count 절약 가능
- 일관된 Token 생성 가능
- Token에 대한 별도 Tune(TTL 조정 등) 가능

## 절차

1. UI > Access > Entities > [create entity] : `100y-entity`
1. entity에서 aliases 생성 : `100y-alias`

3. role 생성 (payload.json)

   ```json
   {
     "allowed_policies": [
       "my-policy"
     ],
     "name": "100y",
     "orphan": false,
     "bound_cidrs": ["127.0.0.1/32", "128.252.0.0/16"],
     "renewable": true,
     "allowed_entity_aliases": ["100y-alias"]
   }
   ```

4. role 적용

   ```bash
   curl -H "X-Vault-Token: hvs.QKRiVmCedA06dCSc2TptmSk1" -X POST --data @payload.json http://127.0.0.1:8200/v1/auth/token/roles/100y
   ```

5. role에 대한 사용자 정의 tune 적용(옵션)

   ```bash
   vault auth tune -max-lease-ttl=876000h token/role/100y
   vault auth tune -default-lease-ttl=876000h token/role/100y
   ```

6. tune 적용된 role 확인

   ```bash
   $ vault read auth/token/roles/100y
   
   Key                         Value
   ---                         -----
   allowed_entity_aliases      [100y-alias]
   allowed_policies            [default]
   allowed_policies_glob       []
   bound_cidrs                 [127.0.0.1 128.252.0.0/16]
   disallowed_policies         []
   disallowed_policies_glob    []
   explicit_max_ttl            0s
   name                        100y
   orphan                      false
   path_suffix                 n/a
   period                      0s
   renewable                   true
   token_bound_cidrs           [127.0.0.1 128.252.0.0/16]
   token_explicit_max_ttl      0s
   token_no_default_policy     false
   token_period                0s
   token_type                  default-service
   ```

7. token 생성

   ```bash
   $ vault token create -entity-alias=100y-alias -role=100y
   Key                  Value
   ---                  -----
   token                hvs.CAESIIveQyE34VOowkCXj4InopxsQHWXu2iW00UQDDCTb-pIGh4KHGh2cy5UZGJ4MjJic1RjY1BlVGRWVHhzNFgwWW4
   token_accessor       Cx6qjyUGwqPmqoPNe9tmkCiN
   token_duration       876000h
   token_renewable      true
   token_policies       ["default"]
   identity_policies    ["default"]
   policies             ["default"]
   ```

8. token이 role의 구성이 반영되었는지 확인

   ```bash
   $ vault token lookup hvs.CAESIIveQyE34VOowkCXj4InopxsQHWXu2iW00UQDDCTb-pIGh4KHGh2cy5UZGJ4MjJic1RjY1BlVGRWVHhzNFgwWW4
   
   Key                            Value
   ---                            -----
   accessor                       Cx6qjyUGwqPmqoPNe9tmkCiN
   bound_cidrs                    [127.0.0.1 128.252.0.0/16]
   creation_time                  1651059486
   creation_ttl                   876000h
   display_name                   token
   entity_id                      53fc4716-fc0d-db34-14b8-ab4258f89fb1
   expire_time                    2122-04-03T20:38:06.73198+09:00
   explicit_max_ttl               0s
   external_namespace_policies    map[]
   id                             hvs.CAESIIveQyE34VOowkCXj4InopxsQHWXu2iW00UQDDCTb-pIGh4KHGh2cy5UZGJ4MjJic1RjY1BlVGRWVHhzNFgwWW4
   identity_policies              [default]
   issue_time                     2022-04-27T20:38:06.731984+09:00
   meta                           <nil>
   num_uses                       0
   orphan                         false
   path                           auth/token/create/100y
   policies                       [default]
   renewable                      true
   role                           100y
   ttl                            875999h59m3s
   type                           service
   ```

   

## Entity 구성 CLI 예제 (옵션)

```bash
vault auth list -format=json | jq -r '.["token/"].accessor' > accessor_token.txt

vault write -format=json identity/entity name="100y-entity" policies="default" \
     metadata=organization="HC" \
     metadata=team="QA" \
     | jq -r ".data.id" > entity_id.txt
     
vault write identity/entity-alias name="100y-alias" \
     canonical_id=$(cat entity_id.txt) \
     mount_accessor=$(cat accessor_token.txt) \
     custom_metadata=account="QA Account"
     
vault write auth/token/roles/100y allowed_policies="super-user" orphan=false bound_cidrs="127.0.0.1/32,128.252.0.0/16" renewable=true allowed_entity_aliases="100y-alias" token_period="876000h"

vault auth tune -max-lease-ttl=876000h token/role/100y

vault auth tune -default-lease-ttl=876000h token/role/100y

vault token create -entity-alias=100y-alias -role=100y
Key                  Value
---                  -----
token                hvs.CAESIDv-SKwwf3MS-CAutW7aQgAZRBjh01lYLeriuSYzYIwfGiEKHGh2cy50cXFIYVhneDBVYU1OT1hXbWc3WHdtbzUQsgU
token_accessor       TAAPfxaUX1nx64ZqrLPa1VHx
token_duration       876000h
token_renewable      true
token_policies       ["default" "super-user"]
identity_policies    ["default"]
policies             ["default" "super-user"]
```