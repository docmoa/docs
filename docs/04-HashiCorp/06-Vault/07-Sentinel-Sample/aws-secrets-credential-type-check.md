---
description: Sentinel - AWS Secrets Role Type Allow/Deny
tag: ["Vault", "Sentinel", "Policy"]
---

# AWS Secrets Role Type Check

## 1. EGP용 정책 생성 egp_iam_user_deny.sentinel

```hcl
import "strings"

# print(request.data)
credential_type = request.data.credential_type
print("CREDENTIAL_TYPE: ", credential_type)

allow_role_type = ["federation_token"]

role_type_check = rule {
  credential_type in allow_role_type
}

# Only check AWS Secret Engine
# Only check create, update
precond = rule {
	request.operation in ["create", "update"]
}

main = rule when precond {
    role_type_check
}
```
- `precond` : API 요청이 POST, UPDATE 인 경우  
- `role_type_check` : 요청의 Body에 `credential_type`의 값이 허용된 type 인지 확인 (e.g. `federation_token` 허용)


## 2. EGP에 정책 설정
EGP는 지정된 path에 대해 정책을 적용

```bash
$ vault write /sys/policies/egp/iam_user_deny \
  policy=@egp_iam_user_deny.sentinel \
  enforcement_level=hard-mandatory \
  paths="aws/roles/*"
```
- `paths`로 지정된 API 경로에 요청이 들어오면 동작

## 3. 테스트
EGP로 지정된 path로 credential_type 이 iam_user 인경우 허용된 타입이 아니므로 거부됨
```bash
$ vault write aws/roles/iam-role \
    credential_type=iam_user \
    policy_document=-<<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*"
    }
  ]
}
EOF
```

에러 메시지
```log
Error writing data to aws/roles/iam-role: Error making API request.

URL: PUT http://127.0.0.1:8200/v1/aws/roles/iam-role
Code: 403. Errors:

* 2 errors occurred:
	* egp standard policy "root/iam_user_deny" evaluation resulted in denial.

The specific error was:
<nil>

A trace of the execution for policy "root/iam_user_deny" is available:

Result: false

Description: <none>

print() output:

CREDENTIAL_TYPE:  iam_user


Rule "main" (root/iam_user_deny:19:1) = false
Rule "precond" (root/iam_user_deny:15:1) = true
Rule "role_type_check" (root/iam_user_deny:9:1) = false
	* permission denied
```

`federation_token`은 생성됩니다.
```bash
$ vault write aws/roles/sts-role \
    credential_type=federation_token \
    policy_document=-<<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "ec2:*",
      "Resource": "*"
    }
  ]
}
EOF
Success! Data written to: aws/roles/sts-role
```