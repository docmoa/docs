---
meta:
  - name: description
    content: TFE
tags: ["terraform", "admin", "password"]
---

# Terrraform Enterprise 사용자 비밀번호 변경

Terraform Enterprise를 사용할 때, UI(https://TFE_SERVER) 상으로 접속할 수 없는 상황에서 비밀번호 변경이 필요한 경우, 아래와 같이 작업할 수 있다.

## Admin 계정의 경우
다음과 같이 수정 가능.

```bash
sudo docker exec -it ptfe_atlas /usr/bin/init.sh /app/scripts/wait-for-token -- bash -i -c 'cd /app && ./bin/rails c'
```

```ruby
irb(main):050:0> admin_user = User.find_by(username: "tfe-local-admin")
=> #<User id: 33, email: "tfe-local-admin@test.com", username: "tfe-local-admin", is_admin: false, created_at: "2020-06-24 05:12:12", updated_at: "2020-07-01 09:12:25", suspended_at: nil, two_factor_delivery: nil, two_factor_sms_number: nil, two_factor_secret_key: nil, two_factor_recovery_index: 0, two_factor_recovery_secret_key: nil, two_factor_verified_at: nil, two_factor_enabled_at: nil, is_service_account: false, used_recovery_codes_encrypted: nil, last_auth_through_saml: nil, external_id: "user-361SGA3yMg3P1nGT", accepted_terms_at: nil, accepted_privacy_policy_at: nil, invitation_token: nil, invitation_created_at: nil, is_cyborg: false, onboarding_status: nil>
irb(main):051:0> admin_user.password = '<<Password>>'
=> "<<Password>>"
irb(main):052:0> admin_user.password_confirmation = '<<Password>>'
=> "<<Password>>"
irb(main):053:0> admin_user.save
2020-07-01 10:03:32 [DEBUG] {:msg=>"SettingStorage::Postgres failed to look up setting 'basic.base_domain'"}
=> true
```


## 일반 사용자의 경우 

```bash
sudo docker exec -it ptfe_atlas /usr/bin/init.sh /app/scripts/wait-for-token -- bash -i -c 'cd /app && ./bin/rails c'
user = User.find_by(email: "user@example.com")
user.update(:password => '<<PASSWORD>>')
user.save!
```

## 일반 사용자를 Admin으로 승격이 필요할 때


```bash
sudo docker exec -it ptfe_atlas /usr/bin/init.sh /app/scripts/wait-for-token -- bash -i -c 'cd /app && ./bin/rails c'
user = User.find_by(email: "user@example.com")
user.update(is_admin: true)
user.save!
```