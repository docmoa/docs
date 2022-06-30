---
meta:
  - name: description
    content: Vault Agent Configuration
tags: ["Vault", "AWS", "Configuration", "Agent"]
---

# Vault Agent (with aws secret)
> 참고 URL : <https://learn.hashicorp.com/tutorials/vault/agent-aws>


::: details Test ENV
```bash
$ sw_vers
ProductName:	macOS
ProductVersion:	12.4

$ vault version
Vault v1.11.0
```
:::



## 1. Vault Server (dev mode)



### 1.1 Vault Setup



#### Vault Start Dev mode

```bash
vault server -dev -dev-root-token-id=root
```



#### Vault Env

> Another terminal

```bash
export VAULT_ADDR=http://127.0.0.1:8200
export VAULT_TOKEN=root
```



### 1.2 Dynamic Sectet Sample (AWS)



#### Setup AWS Env

```bash
export AWS_ACCESS_KEY=AKIAU3NXXXXX
export AWS_SECRET_KEY=Rex3GPUKO3++123
export AWS_REGION=ap-northeast-2
```



#### Enable AWS Secret Engine

```bash
vault secrets enable aws
```



#### AWS Secret Engine Configuration

```bash
vault write aws/config/root \
  access_key=$AWS_ACCESS_KEY \
  secret_key=$AWS_SECRET_KEY \
  region=$AWS_REGION
```



#### AWS Secret Engine Lease change

```bash
vault write /aws/config/lease lease=1m lease_max=1m
```



#### Role setup (e.g. s3)

```bash
vault write aws/roles/s3 \
    credential_type=iam_user \
    policy_document=-<<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
     		"s3:PutObject",
      	"s3:PutObjectAcl"
      ],
      "Resource": "*"
    }
  ]
}
EOF
```



#### Test AWS Secret

```bash
$ vault write -force aws/creds/s3
Key                Value
---                -----
lease_id           aws/creds/s3/w5hPWazlpWu4jKHUyR0WBnbZ
lease_duration     1m
lease_renewable    true
access_key         AKIAU3NXDWRUCYVDBEYM
secret_key         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
security_token     <nil>
```



### 1.3 Approle Setup



####  Vault Policy for AWS

```
cat <<EOF | vault policy write aws_policy -
path "aws/creds/s3" {
  capabilities = ["read","update"]
}
EOF
```



#### Approle Create

```bash
$ vault auth enable approle

Success! Enabled approle auth method at: approle/

$ vault write auth/approle/role/aws-cred \
    secret_id_ttl=120m \
    token_ttl=60m \
    token_max_ttl=120m \
    policies="aws_policy"
    
Success! Data written to: auth/approle/role/aws-cred

$ vault read auth/approle/role/aws-cred/role-id

Key        Value
---        -----
role_id    430111ee-5955-aa83-a53d-924b7e11ac36

$ vault write -f auth/approle/role/aws-cred/secret-id

Key                   Value
---                   -----
secret_id             7f86b671-2f47-f841-18a4-c36ca34ab8d8
secret_id_accessor    9ad4256a-acc6-e8c0-f7fe-7633e66b1318
secret_id_ttl         2h
```

- `role_id`는 Pipeline 작성에 사용



## 2. Vault Agent



### 2.1 Vault Config

```bash
$ cat <<EOF > ./vault-agent-config.hcl
pid_file = "./pidfile"

listener "tcp" {
	address = "127.0.0.1:9200"
	tls_disable = true
	# tls_cert_file = "/path/to/cert.pem"
  # tls_key_file = "/path/to/key.pem"
}

cache {
  use_auto_auth_token = true
}

auto_auth {
  method  {
    type = "approle"
    config = {
      role_id_file_path = "./role_id.txt"
      secret_id_file_path = "./secret_id.txt"
    }
  }
}

vault {
  address = "http://127.0.0.1:8200"
}

# template 은 여러개 설정 가능
template {
  source      = "./aws_cred.tpl"
  destination = "./aws_cred.txt"
  command     = "cat ./aws_cred.txt" # 생략 가능
}
EOF
```



### 2.2 Vault Template

```bash
$ cat <<EOF > ./aws_cred.tpl
{{- with secret "aws/creds/s3" -}}
aws_access_key={{ .Data.access_key | toJSON }}
aws_secret_key={{ .Data.secret_key | toJSON }}
{{- end }}
EOF
```



## 3. Vault Agent

### 3.1 Run Vault Agent

```bash
$ vault read -field role_id auth/approle/role/aws-cred/role-id > ./role_id.txt

$ vault write -f -field secret_id auth/approle/role/aws-cred/secret-id > ./secret_id.txt

$ vault agent -config=./vault-agent-config.hcl
==> Vault agent started! Log data will stream in below:

==> Vault agent configuration:

           Api Address 1: http://127.0.0.1:9200
           Api Address 2: http://bufconn
                     Cgo: disabled
               Log Level: info
                 Version: Vault v1.11.0, built 2022-06-17T15:48:44Z
             Version Sha: ea296ccf58507b25051bc0597379c467046eb2f1

2022-06-30T17:17:08.726+0900 [INFO]  sink.file: creating file sink
2022-06-30T17:17:08.727+0900 [INFO]  sink.file: file sink configured: path=/tmp/vault_agent mode=-rw-r-----
2022-06-30T17:17:08.728+0900 [INFO]  sink.server: starting sink server
2022-06-30T17:17:08.730+0900 [INFO]  template.server: starting template server
2022-06-30T17:17:08.730+0900 [INFO]  auth.handler: starting auth handler
2022-06-30T17:17:08.730+0900 [INFO]  auth.handler: authenticating
2022-06-30T17:17:08.736+0900 [INFO] (runner) creating new runner (dry: false, once: false)
2022-06-30T17:17:08.739+0900 [INFO]  auth.handler: authentication successful, sending token to sinks
2022-06-30T17:17:08.740+0900 [INFO]  auth.handler: starting renewal process
2022-06-30T17:17:08.740+0900 [INFO]  sink.file: token written: path=/tmp/vault_agent
2022-06-30T17:17:08.743+0900 [INFO] (runner) creating watcher
2022-06-30T17:17:08.745+0900 [INFO]  auth.handler: renewed auth token
2022-06-30T17:17:08.745+0900 [INFO]  template.server: template server received new token
2022-06-30T17:17:08.745+0900 [INFO] (runner) stopping
2022-06-30T17:17:08.745+0900 [INFO] (runner) creating new runner (dry: false, once: false)
2022-06-30T17:17:08.745+0900 [INFO] (runner) creating watcher
2022-06-30T17:17:08.747+0900 [INFO] (runner) starting
2022-06-30T17:17:11.635+0900 [INFO] (runner) rendered "./aws_cred.tpl" => "./aws_cred.txt"
2022-06-30T17:17:11.635+0900 [INFO] (runner) executing command "[\"cat ./aws_cred.txt\"]" from "./aws_cred.tpl" => "./aws_cred.txt"
2022-06-30T17:17:11.637+0900 [INFO] (child) spawning: sh -c cat ./aws_cred.txt
aws_access_key="AKIAU3NXDWRUHRF5SJDM"
aws_secret_key="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"
2022-06-30T17:17:54.978+0900 [WARN] vault.read(aws/creds/s3): TTL of "1m" exceeded the effective max_ttl of "17s"; TTL value is capped accordingly
2022-06-30T17:17:54.978+0900 [WARN] vault.read(aws/creds/s3): renewer done (maybe the lease expired)
2022-06-30T17:17:57.422+0900 [INFO] (runner) rendered "./aws_cred.tpl" => "./aws_cred.txt"
2022-06-30T17:17:57.422+0900 [INFO] (runner) executing command "[\"cat ./aws_cred.txt\"]" from "./aws_cred.tpl" => "./aws_cred.txt"
2022-06-30T17:17:57.422+0900 [INFO] (child) spawning: sh -c cat ./aws_cred.txt
aws_access_key="AKIAU3NXDWRUETMPDDOH"
aws_secret_key="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"
```



```bash
$ watch cat ./aws_cred.txt
Every 2.0s: cat ./aws_cred.txt                             gs-C02CT3ZFML85: Thu Jun 30 17:19:01 2022

aws_access_key="AKIAU3NXDWRUHRF5SJDM"
aws_secret_key="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"

<< expire 되면 다시 발급 됨 >>

aws_access_key="AKIAU3NXDWRUOOG33CPC"
aws_secret_key="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"
```



### 3.2 Vault Agent API Endpoint

Vault Agent로는 X-Vault-Token 없이 API 호출 가능

```bash
$ curl -X GET http://127.0.0.1:9200/v1/aws/creds/s3 | jq '.data'
{
  "access_key": "AKIAU3NXDWRUJJ4UW2P2",
  "secret_key": "BeI7xebPR75nXSJ9mzSsyh8P3qiwhCx5mqlh76R0",
  "security_token": null
}
```

### 3.3 Vault Systemd Sample
```ini
[Unit]
Description=Nomad Agent
Requires=consul-online.target
After=consul-online.target

[Service]
KillMode=process
KillSignal=SIGINT
Environment=VAULT_ADDR=http://active.vault.service.consul:8200
Environment=VAULT_SKIP_VERIFY=true
ExecStartPre=/usr/local/bin/vault agent -config /etc/vault-agent.d/vault-agent.hcl
ExecStart=/usr/bin/nomad-vault.sh
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
RestartSec=2
StartLimitBurst=3
StartLimitIntervalSec=10
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```