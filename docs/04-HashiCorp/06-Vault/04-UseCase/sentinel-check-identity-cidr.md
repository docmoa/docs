---
meta:
  - name: description
    content: Sentinel을 사용하여 identity 조건에 cidr 검사
tags: ["vault", "sentinel", "cidr", "enterprise"]
---
# Sentinel - (Identity & CIDR)

> Enterprise 기능

Token Role에 `bound_cidr`을 적용하거나 여타 인증(AppRole, Userpass 등)에 허용하는 cidr을 적용하는 경우 다시 Token을 발급하거나 인증받지 않는한은 cidr을 기반으로한 차단을 동적으로 적용할 수 없다.

이경우 Sentinel을 사용하여 동적인 정책을 적용할 수 있다. Sentinel은 ACL방식의 기존 `Policy`와는 달리 Path가 아닌 다른 검증 조건을 추가할 수 있다.

- 예제 (GitHub) : <https://github.com/hashicorp/vault-guides/blob/master/governance/sentinel/README.md>

- 엔터프라이즈 Trial 신청 (30일) : <https://www.hashicorp.com/products/vault/trial>

## 테스트 사용자 생성

Sentinel 적용을 확인하기 위해 모든 권한이 있는 기존 `Policy` 방식의 정책을 생성한다.

```bash
vault policy write super-user - << EOF
path "*" {
capabilities = ["create", "read", "update", "delete", "list", "sudo"]
}
EOF
```

생성한 정책고 앞으로 생성할 Sentinel 정책이 포함된 사용자를 생성한다.

```bash
vault write auth/userpass/users/admin password=password policies="super-user, test-rgp"
vault write auth/userpass/users/rgp password=password policies="super-user, test-rgp"
```

`admin`과 `rgp` 사용자 모두 동일한 정책을 부여 받았다. Sentinel에서는 `identity` 정보를 기반으로 조건을 부여할 수 있으며, 동일한 정책이 부여되었더라도 어떤 `identity` 인가에 따라 적용 여부를 선택적으로 검증할 수 있다.

각 사용자로 로그인하여 Token 정보를 확인하면 `entity_id` 값을 확인할 수 있다.

```bash
$ TOKEN=$(vault login -field=token -method userpass username=admin password=password)

$ vault token lookup $TOKEN

Key                 Value
---                 -----
display_name        userpass-admin
entity_id           17230158-d0ad-dd6d-b749-3c7de9e2b4cf
policies            [default super-user test-rgp]
renewable           true
ttl                 768h
```

## Sentinel 생성

다음과 같이 적용할 `identity-cidr-check.sentinel` 파일을 생성한다. (확장자는 다른 확장자를 사용해도 무방하다. e.g. hcl)

```hcl
import "sockaddr"
import "strings"

print(identity.entity.id)
print(request.connection.remote_addr)

precond = rule {
    # admin user
    # identity.entity.id is "17230158-d0ad-dd6d-b749-3c7de9e2b4cf" or
    # rgp user
    identity.entity.id is "31cc28c0-9fd0-82b3-a70d-0eef741c5349"
}

cidrcheck = rule {
    # request.connection.remote_addr is "127.0.0.1" or
    sockaddr.is_contained(request.connection.remote_addr, "22.32.4.0/24")
}

main = rule when precond {
    cidrcheck
}
```

- precond : main 규칙에서 조건으로 부여할 규칙을 정의한다.
  - `identity.entity.id`로 검증할 아이디 내용에는 앞서 확인한 `admin`과 `rgp` 사용자의 `entity_id`를 조건에 넣는다.
  - `admin` 사용자의 경우 우선 주석처리하여 진행한다.
- cidrcheck : cidr을 검증할 규칙을 정의한다.

적용하는 방식은 다음과 같다.
```
POLICY=$(base64 identity-cidr-check.sentinel)

vault write sys/policies/rgp/test-rgp \
      policy="${POLICY}" \
      enforcement_level="hard-mandatory"
```

## Sentinel 검증

`admin` 사용자로 로그인하여 kv를 생성하고 값을 넣는다.

```bash
$ vault login -method userpass username=admin password=password
$ vault secrets enable kv
$ vault kv put kv/hello foo=bar
$ vault kv get kv/hello
=== Data ===
Key    Value
---    -----
foo    bar
```

`rgp` 사용자로 로그인하여 kv를 조회해본다.

```bash
$ vault login -method userpass username=rgp password=password
$ vault kv get kv/hello
Error making API request.

URL: GET http://127.0.0.1:8200/v1/sys/internal/ui/mounts/kv/hello
Code: 400. Errors:

* 2 errors occurred:
	* rgp standard policy "root/test-rgp" evaluation resulted in denial.

The specific error was:
<nil>

A trace of the execution for policy "root/test-rgp" is available:

Result: false

Description: <none>

print() output:

31cc28c0-9fd0-82b3-a70d-0eef741c5349
127.0.0.1


Rule "main" (root/test-rgp:19:1) = false
Rule "cidrcheck" (root/test-rgp:14:1) = false
Rule "precond" (root/test-rgp:7:1) = true
	* permission denied
```

cidrcheck 에서 검증하는 cidr에 속하지 못하면 요청 단계에서 권한이 없음을 표기한다.

## identity 동적으로 변경하기

앞서 작성한 sentinel 규칙에서 `admin` 사용자의 `identity.id`의 주석을 해제하여 다시 적용해 본다.

```hcl {5}
...생략...

precond = rule {
    # admin user
    identity.entity.id is "17230158-d0ad-dd6d-b749-3c7de9e2b4cf" or
    # rgp user
    identity.entity.id is "31cc28c0-9fd0-82b3-a70d-0eef741c5349"
}

...생략...
```

`admin` 사용자로 로그인하여 kv를 조회해도 cidr 조건에 맞지 않으면 동일한 오류가 발생한다.

## cidr 동적으로 변경하기

허용하는 cidr을 추가해본다. 로컬에서 테스트하는 경우 `127.0.0.1`이 해당 ip가 될 수 있다.

```hcl {4}
...생략...

cidrcheck = rule {
    request.connection.remote_addr is "127.0.0.1" or
    sockaddr.is_contained(request.connection.remote_addr, "22.32.4.0/24")
}

...생략...
```

적용 후 `admin` 사용자와 `rgp` 사용자 모두 정상적으로 kv의 값을 확인할 수 있다.