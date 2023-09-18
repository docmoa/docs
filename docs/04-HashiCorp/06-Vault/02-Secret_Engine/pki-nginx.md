---
description: Vault의 PKI 인증서
tag: ["vault", "PKI"]
---

# PKI - nginx 샘플
> <https://learn.hashicorp.com/tutorials/vault/pki-engine>

## Vault 구성

환경 변수
```bash
export VAULT_SKIP_VERIFY=True
export VAULT_ADDR='http://172.28.128.11:8200'
export VAULT_TOKEN=s.8YXFI825TZxnwLtYHsLc9Fnb
```

정책 및 사용자 구성

. ./<pki-policy.hcl>

```ruby
$ vault policy write pki - << EOF
# Enable secrets engine
path "sys/mounts/*" {
  capabilities = [ "create", "read", "update", "delete", "list" ]
}

# List enabled secrets engine
path "sys/mounts" {
  capabilities = [ "read", "list" ]
}

# Work with pki secrets engine
path "pki*" {
  capabilities = [ "create", "read", "update", "delete", "list", "sudo" ]
}
EOF
```

## 인증 생성
### user/pass 생성
```bash
$ vault auth enable userpass

$ vault write auth/userpass/users/pki \
    password=pki \
    policies=pki
    
$ vault login -method userpass username=pki password=pki
Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                    Value
---                    -----
token                  s.ldJApybiqGBmq3CuBAaqsKXZ
token_accessor         Maek0IMLkOLmFVkpG4DoGUdY
token_duration         768h
token_renewable        true
token_policies         ["pki"]
identity_policies      []
policies               ["pki"]
token_meta_username    db

$ export VAULT_TOKEN=s.7mN7t6hd1a1m97j2ptytfCqf
```

### approle 생성
```bash
$ vault auth enable approle
Success! Enabled approle auth method at: approle/

$ vault write auth/approle/role/pki-agent \
    secret_id_ttl=120m \
    token_ttl=60m \
    token_max_tll=120m \
    policies="pki"
Success! Data written to: auth/approle/role/pki-agent

$ vault read auth/approle/role/pki-agent/role-id
Key        Value
---        -----
role_id    dfa2a248-1e1b-e2e9-200c-69c63b9ca447

$ vault write -f auth/approle/role/pki-agent/secret-id
Key                   Value
---                   -----
secret_id             864360c1-c79f-ea7c-727b-7752361fe1ba
secret_id_accessor    3cc068e2-a172-2bb1-c097-b777c3525ba6

#Tip
$ echo $(vault write -f -format=json auth/approle/role/pki-agent/secret-id | jq -r '.data.secret_id') > secretid

$ vault write auth/approle/login role_id=dfa2a248-1e1b-e2e9-200c-69c63b9ca447 secret_id=864360c1-c79f-ea7c-727b-7752361fe1ba
Key                     Value
---                     -----
token                   s.uGtTFun8zSNcczBrtEJrSx5y
token_accessor          eLjxnLYqfVTWFbOCXDVqwb3S
token_duration          1h
token_renewable         true
token_policies          ["default" "pki"]
identity_policies       []
policies                ["default" "pki"]
token_meta_role_name    pki-agent
```

## PKI Engin

### 1단계 : Root CA 생성 (없는 경우)

- pki secret engine 활성화

  ```bash
  $ vault secrets enable -path pki pki
  Success! Enabled the database secrets engine at: pki/
  ```

- 최대 TTL (Time-to-Live)이 87600 시간(10년) 인 인증서를 발급

  ```bash
  $ vault secrets tune -max-lease-ttl 87600h pki
  Success! Tuned the secrets engine at: pki/
  ```

- 루트 인증서 생성 `CA_cert.crt`

  ```bash
  $ vault write -f -field=certificate pki/root/generate/internal \
          common_name="example.com" \
          ttl=87600h > CA_cert.crt
  ```

  이렇게하면 새로운 자체 서명 된 CA 인증서와 개인 키가 생성됩니다. Vault는 임대 기간 (TTL)이 끝나면 생성 된 루트를 자동으로 취소합니다. CA 인증서는 자체 인증서 해지 목록 (CRL)에 서명합니다.

- CA 와 CRL URL 구성

  ```bash
  $ vault write pki/config/urls \
          issuing_certificates="http://172.28.128.11:8200/v1/pki/ca" \
          crl_distribution_points="http://172.28.128.11:8200/v1/pki/crl"
  ```

  

### 2단계 : Intermediate CA 구성

이전 단계에서 생성한 Root CA를 사용하여 Intermediate CA 생성

- pki secret engine 활성화

  ```bash
  $ vault secrets enable -path=pki_int pki
  Success! Enabled the pki secrets engine at: pki_int/
  ```

- 최대 TTL (Time-to-Live)이 43800 시간(5년) 인 인증서를 발급 하도록 비밀 엔진을 조정

  ```bash
  $ vault secrets tune -max-lease-ttl=43800h pki_int
  Success! Tuned the secrets engine at: pki_int/
  ```

- Intermediate CSR 생성 <pki_intermediate.csr>

  ```bash
  $ vault write -format=json pki_int/intermediate/generate/internal \
          common_name="example.com Intermediate Authority" \
          | jq -r '.data.csr' > pki_intermediate.csr
  ```

- Root 인증서로 Intermediate 인증서에 서명 <intermediate.cert.pem>

  ```bash
  $ vault write -format=json pki/root/sign-intermediate csr=@pki_intermediate.csr \
          format=pem_bundle ttl="43800h" \
          | jq -r '.data.certificate' > intermediate.cert.pem
  ```

- CSR이 서명되고 Root CA가 인증서를 반환하면 다시 Vault에서 가져옴

  ```bash
  $ vault write -f pki_int/intermediate/set-signed certificate=@intermediate.cert.pem
  Success! Data written to: pki_int/intermediate/set-signed
  ```

- URL 구성

  ``` bash
  $ vault write pki_int/config/urls \
          issuing_certificates="http://172.28.128.11:8200/v1/pki_int/ca" \
          crl_distribution_points="http://172.28.128.11:8200/v1/pki_int/crl"
  ```

  

### 3단계 : Role 생성

Role은 자격 증명을 생성하는데 사용되는 정책에 매핑되는 논리적 이름으로, 구성 매개변수가 인증서 일반 이름, 대체 이름, 유효한 키 사용등을 제어 가능

##### [주요 매개 변수]

| Param                | Description                                                  |
| :------------------- | :----------------------------------------------------------- |
| `allowed_domains`    | 역할의 도메인을 지정합니다 (`allow_bare_domains` 및`allow-subdomains` 옵션과 함께 사용). |
| `allow_bare_domains` | 클라이언트가 실제 도메인 자체의 값과 일치하는 인증서를 요청할 수 있는지 여부를 지정합니다. |
| `allow_subdomains`   | 클라이언트가 다른 역할 옵션에서 허용하는 CN의 하위 도메인 인 CN을 사용하여 인증서를 요청할 수 있는지 여부를 지정합니다 (참고 : 여기에는 와일드 카드 하위 도메인이 포함됨). |
| `allow_glob_domains` | allowed_domains에 지정된 이름에 glob 패턴 (예 : ftp * .example.com)을 포함 할 수 있습니다. |

여기서는 example-dot-com 이라는 Role 을 생성



- 하위 도메인을 허용하는 `example-dot.com` Role 생성

  ```bash
  $ vault write pki_int/roles/example-dot-com \
          allowed_domains="example.com" \
          allow_subdomains=true \
          max_ttl="720h"
  Success! Data written to: pki_int/roles/example-dot-com
  ```



### 4단계 : 인증서 요청

> Vault의 단기 비밀관리의 철학은 인증서 수명을 짧게 유지하는 것입니다.

- `example-dot-com` Role에 따라 `test.example.com` 도메인에 대한 새 인증서 요청
  (응답에는 PEM으로 인코딩 된 개인 키, 키 유형 및 인증서 일련 번호가 포함됩니다.)

  ```bash
  $ vault write pki_int/issue/example-dot-com common_name="test.example.com" ttl="2m" #format="pem_bundle"
  # vault write pki_int/issue/example-dot-com common_name="tfe.example.com" ttl="700h" 
  
  Key                 Value
  ---                 -----
  certificate         -----BEGIN CERTIFICATE-----
  MIIDwzCCAqugAwIBAgIUTQABMCAsXjG6ExFTX8201xKVH4IwDQYJKoZIhvcNAQEL
  BQAwGjEYMBYGA1UEAxMPd3d3LmV4YW1wbGUuY29tMB4XDTE4MDcyNDIxMTMxOVoX
               ...
  
  -----END CERTIFICATE-----
  issuing_ca          -----BEGIN CERTIFICATE-----
  MIIDQTCCAimgAwIBAgIUbMYp39mdj7dKX033ZjK18rx05x8wDQYJKoZIhvcNAQEL
               ...
  
  -----END CERTIFICATE-----
  private_key         -----BEGIN RSA PRIVATE KEY-----
  MIIEowIBAAKCAQEAte1fqy2Ekj+EFqKV6N5QJlBgMo/U4IIxwLZI6a87yAC/rDhm
  W58liadXrwjzRgWeqVOoCRr/B5JnRLbyIKBVp6MMFwZVkynEPzDmy0ynuomSfJkM
               ...
  
  -----END RSA PRIVATE KEY-----
  private_key_type    rsa
  serial_number       4d:00:01:30:20:2c:5e:31:ba:13:11:53:5f:cd:b4:d7:12:95:1f:82
  ```



## Vault Agent

생성되는 PKI인증서를 자동으로 갱신하기 위해 Vault Agent 구성



secretid 생성의 예

```bash
echo $(vault write -f -format=json auth/approle/role/pki-agent/secret-id | jq -r '.data.secret_id') > secretid
```



[vault_agent.hcl]

```ruby
pid_file = "/root/vault_agent/pidfile"

auto_auth {
  method  {
    type = "approle"
    config = {
      role_id_file_path = "/root/vault_agent/roleid"
      secret_id_file_path = "/root/vault_agent/secretid"
    }
  }

  sink {
    type = "file"
    config = {
      path = "/tmp/vault_agent"
    }
  }
}

vault {
  address = "http://172.28.128.11:8200"
}

template {
  source      = "/root/vault_agent/cert.tpl"
  destination = "/root/cert/my-app.crt"
}

template {
  source      = "/root/vault_agent/ca.tpl"
  destination = "/root/cert/ca.crt"
}

template {
  source      = "/root/vault_agent/key.tpl"
  destination = "/root/cert/my-app.key"
}
```



[인증 정보]

`role_id_file_path`, `secret_id_file_path`에는 앞서 생성한 approle의 role id와 secret id를 대상 파일에 저장



[template - default pem]

- cert.tpl

  ```ruby
  {{- /* /tmp/ca.tpl */ -}}
  {{ with secret "pki_int/issue/example-dot-com" "common_name=test.example.com" }}
  {{ .Data.issuing_ca }}{{ end }}
  ```

- ca.tpl

  ```ruby
  {{- /* /tmp/cert.tpl */ -}}
  {{ with secret "pki_int/issue/example-dot-com" "common_name=test.example.com" }}
  {{ .Data.certificate }}{{ end }}
  ```

- Key.tpl

  ```ruby
  {{- /* /tmp/key.tpl */ -}}
  {{ with secret "pki_int/issue/example-dot-com" "common_name=test.example.com" }}
  {{ .Data.private_key }}{{ end }}
  ```





### 실행은 스크립트 혹은 스크립트를 서비스로 구성

- script (e.g. start.sh)

  ```bash
  vault agent -config=/root/vault_agent/vault_agent.hcl -log-level=debug
  ```

- service (e.g. vault-agent.service)

  ```properties
  [Unit]
  Description=Vault Service Discovery Agent
  Documentation=https://www.vaultproject.io/
  After=network-online.target
  Wants=network-online.target
  
  [Service]
  Type=simple
  User=vault
  Group=vault
  ExecStart=/usr/local/bin/vault agent -config=/root/vault_agent/vault_agent.hcl
  
  ExecReload=/bin/kill -HUP $MAINPID
  KillSignal=SIGINT
  TimeoutStopSec=5
  Restart=on-failure
  SyslogIdentifier=vault
  
  [Install]
  WantedBy=multi-user.target
  ```

  



## Appendix

### PKI 관리

- pki revoke

  ```bash
  $ vault write pki_int/revoke serial_number="56:ac:c0:f3:b4:1e:87:69:ec:dd:7d:27:54:f6:1c:14:91:3d:11:2d"
  Key                        Value
  ---                        -----
  revocation_time            1611557908
  revocation_time_rfc3339    2021-01-25T06:58:28.592511981Z
  ```

- pki rotate

  ```bash
  $ vault read pki_int/crl/rotate
  Key        Value
  ---        -----
  success    true
  ```



### Nginx 활용

테스트 대상 시스템에 CA, Intermediated 인증서를 신뢰할 수 있는 인증서로 등록



[vault_agent.hcl]

```ruby
pid_file = "/root/vault_agent/pidfile"

auto_auth {
  method  {
    type = "approle"
    config = {
      role_id_file_path = "/root/vault_agent/roleid"
      secret_id_file_path = "/root/vault_agent/secretid"
    }
  }

  sink {
    type = "file"
    config = {
      path = "/tmp/vault_agent"
    }
  }
}

vault {
  address = "http://172.28.128.11:8200"
}

template {
  source      = "/root/vault_agent/cert.tpl"
  destination = "/root/cert/test.cert.pem"
  perms       = "0600"
}

template {
  source      = "/root/vault_agent/key.tpl"
  destination = "/root/cert/test.key.pem"
  perms       = "0600"
}
```



[template - pem_bundle]

- cert.tpl

  ```ruby
  {{- /* /tmp/cert.tpl */ -}}
  {{ with secret "pki_int/issue/example-dot-com" "common_name=test.example.com"  "ttl=2m"}}
  {{ .Data.certificate }}
  {{ .Data.issuing_ca }}{{ end }}
  ```

- Key.tpl

  ```ruby
  {{- /* /tmp/key.tpl */ -}}
  {{ with secret "pki_int/issue/example-dot-com" "common_name=test.example.com" "ttl=2m"}}
  {{ .Data.private_key }}{{ end }}
  ```



[/etc/nginx/sites-enabled/default]

> rotation 되면 systemctl reload nginx

```properties
server {
       listen 80;
       server_name text.example.com;
       return 301 HTTPS://$server_name$request_uri;
}

server {
	listen 443 ssl default_server;
	listen [::]:443 ssl default_server;

  ssl on;
  server_name test.example.com;
  ssl_certificate /root/cert/test.cert.pem;
  ssl_certificate_key /root/cert/test.key.pem;

	root /var/www/html;

	# Add index.php to the list if you are using PHP
	index index.html index.htm index.nginx-debian.html;

	server_name _;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ =404;
	}
}
```

