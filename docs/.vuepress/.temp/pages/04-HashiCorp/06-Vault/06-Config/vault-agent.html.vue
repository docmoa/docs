<template><div><h1 id="vault-agent-with-aws-secret" tabindex="-1"><a class="header-anchor" href="#vault-agent-with-aws-secret" aria-hidden="true">#</a> Vault Agent (with aws secret)</h1>
<blockquote>
<p>참고 URL : <a href="https://learn.hashicorp.com/tutorials/vault/agent-aws" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/vault/agent-aws<ExternalLinkIcon/></a></p>
</blockquote>
<details class="hint-container details"><summary>Test ENV</summary>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ sw_vers
ProductName:	macOS
ProductVersion:	<span class="token number">12.4</span>

$ vault version
Vault v1.11.0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<h2 id="_1-vault-server-dev-mode" tabindex="-1"><a class="header-anchor" href="#_1-vault-server-dev-mode" aria-hidden="true">#</a> 1. Vault Server (dev mode)</h2>
<h3 id="_1-1-vault-setup" tabindex="-1"><a class="header-anchor" href="#_1-1-vault-setup" aria-hidden="true">#</a> 1.1 Vault Setup</h3>
<h4 id="vault-start-dev-mode" tabindex="-1"><a class="header-anchor" href="#vault-start-dev-mode" aria-hidden="true">#</a> Vault Start Dev mode</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault server <span class="token parameter variable">-dev</span> -dev-root-token-id<span class="token operator">=</span>root
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="vault-env" tabindex="-1"><a class="header-anchor" href="#vault-env" aria-hidden="true">#</a> Vault Env</h4>
<blockquote>
<p>Another terminal</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span>http://127.0.0.1:8200
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>root
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-dynamic-sectet-sample-aws" tabindex="-1"><a class="header-anchor" href="#_1-2-dynamic-sectet-sample-aws" aria-hidden="true">#</a> 1.2 Dynamic Sectet Sample (AWS)</h3>
<h4 id="setup-aws-env" tabindex="-1"><a class="header-anchor" href="#setup-aws-env" aria-hidden="true">#</a> Setup AWS Env</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_ACCESS_KEY</span><span class="token operator">=</span>AKIAU3NXXXXX
<span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_SECRET_KEY</span><span class="token operator">=</span>Rex3GPUKO3++123
<span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_REGION</span><span class="token operator">=</span>ap-northeast-2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="enable-aws-secret-engine" tabindex="-1"><a class="header-anchor" href="#enable-aws-secret-engine" aria-hidden="true">#</a> Enable AWS Secret Engine</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault secrets <span class="token builtin class-name">enable</span> aws
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="aws-secret-engine-configuration" tabindex="-1"><a class="header-anchor" href="#aws-secret-engine-configuration" aria-hidden="true">#</a> AWS Secret Engine Configuration</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> aws/config/root <span class="token punctuation">\</span>
  <span class="token assign-left variable">access_key</span><span class="token operator">=</span><span class="token variable">$AWS_ACCESS_KEY</span> <span class="token punctuation">\</span>
  <span class="token assign-left variable">secret_key</span><span class="token operator">=</span><span class="token variable">$AWS_SECRET_KEY</span> <span class="token punctuation">\</span>
  <span class="token assign-left variable">region</span><span class="token operator">=</span><span class="token variable">$AWS_REGION</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="aws-secret-engine-lease-change" tabindex="-1"><a class="header-anchor" href="#aws-secret-engine-lease-change" aria-hidden="true">#</a> AWS Secret Engine Lease change</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> /aws/config/lease <span class="token assign-left variable">lease</span><span class="token operator">=</span>1m <span class="token assign-left variable">lease_max</span><span class="token operator">=</span>1m
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="role-setup-e-g-s3" tabindex="-1"><a class="header-anchor" href="#role-setup-e-g-s3" aria-hidden="true">#</a> Role setup (e.g. s3)</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> aws/roles/s3 <span class="token punctuation">\</span>
    <span class="token assign-left variable">credential_type</span><span class="token operator">=</span>iam_user <span class="token punctuation">\</span>
    <span class="token assign-left variable">policy_document</span><span class="token operator">=</span>-<span class="token operator">&lt;&lt;</span><span class="token string">EOF
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
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="test-aws-secret" tabindex="-1"><a class="header-anchor" href="#test-aws-secret" aria-hidden="true">#</a> Test AWS Secret</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-force</span> aws/creds/s3
Key                Value
---                -----
lease_id           aws/creds/s3/w5hPWazlpWu4jKHUyR0WBnbZ
lease_duration     1m
lease_renewable    <span class="token boolean">true</span>
access_key         AKIAU3NXDWRUCYVDBEYM
secret_key         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
security_token     <span class="token operator">&lt;</span>nil<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-approle-setup" tabindex="-1"><a class="header-anchor" href="#_1-3-approle-setup" aria-hidden="true">#</a> 1.3 Approle Setup</h3>
<h4 id="vault-policy-for-aws" tabindex="-1"><a class="header-anchor" href="#vault-policy-for-aws" aria-hidden="true">#</a> Vault Policy for AWS</h4>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>cat &lt;&lt;EOF | vault policy write aws_policy -
path "aws/creds/s3" {
  capabilities = ["read","update"]
}
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="approle-create" tabindex="-1"><a class="header-anchor" href="#approle-create" aria-hidden="true">#</a> Approle Create</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault auth <span class="token builtin class-name">enable</span> approle

Success<span class="token operator">!</span> Enabled approle auth method at: approle/

$ vault <span class="token function">write</span> auth/approle/role/aws-cred <span class="token punctuation">\</span>
    <span class="token assign-left variable">secret_id_ttl</span><span class="token operator">=</span>120m <span class="token punctuation">\</span>
    <span class="token assign-left variable">token_ttl</span><span class="token operator">=</span>60m <span class="token punctuation">\</span>
    <span class="token assign-left variable">token_max_ttl</span><span class="token operator">=</span>120m <span class="token punctuation">\</span>
    <span class="token assign-left variable">policies</span><span class="token operator">=</span><span class="token string">"aws_policy"</span>
    
Success<span class="token operator">!</span> Data written to: auth/approle/role/aws-cred

$ vault <span class="token builtin class-name">read</span> auth/approle/role/aws-cred/role-id

Key        Value
---        -----
role_id    430111ee-5955-aa83-a53d-924b7e11ac36

$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> auth/approle/role/aws-cred/secret-id

Key                   Value
---                   -----
secret_id             7f86b671-2f47-f841-18a4-c36ca34ab8d8
secret_id_accessor    9ad4256a-acc6-e8c0-f7fe-7633e66b1318
secret_id_ttl         2h
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>role_id</code>는 Pipeline 작성에 사용</li>
</ul>
<h2 id="_2-vault-agent" tabindex="-1"><a class="header-anchor" href="#_2-vault-agent" aria-hidden="true">#</a> 2. Vault Agent</h2>
<h3 id="_2-1-vault-config" tabindex="-1"><a class="header-anchor" href="#_2-1-vault-config" aria-hidden="true">#</a> 2.1 Vault Config</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">cat</span> <span class="token operator">&lt;&lt;</span><span class="token string">EOF<span class="token bash punctuation"> <span class="token operator">></span> ./vault-agent-config.hcl</span>
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
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-2-vault-template" tabindex="-1"><a class="header-anchor" href="#_2-2-vault-template" aria-hidden="true">#</a> 2.2 Vault Template</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">cat</span> <span class="token operator">&lt;&lt;</span><span class="token string">EOF<span class="token bash punctuation"> <span class="token operator">></span> ./aws_cred.tpl</span>
{{- with secret "aws/creds/s3" -}}
aws_access_key={{ .Data.access_key | toJSON }}
aws_secret_key={{ .Data.secret_key | toJSON }}
{{- end }}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-vault-agent" tabindex="-1"><a class="header-anchor" href="#_3-vault-agent" aria-hidden="true">#</a> 3. Vault Agent</h2>
<h3 id="_3-1-run-vault-agent" tabindex="-1"><a class="header-anchor" href="#_3-1-run-vault-agent" aria-hidden="true">#</a> 3.1 Run Vault Agent</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> <span class="token parameter variable">-field</span> role_id auth/approle/role/aws-cred/role-id <span class="token operator">></span> ./role_id.txt

$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">-field</span> secret_id auth/approle/role/aws-cred/secret-id <span class="token operator">></span> ./secret_id.txt

$ vault agent <span class="token parameter variable">-config</span><span class="token operator">=</span>./vault-agent-config.hcl
<span class="token operator">==</span><span class="token operator">></span> Vault agent started<span class="token operator">!</span> Log data will stream <span class="token keyword">in</span> below:

<span class="token operator">==</span><span class="token operator">></span> Vault agent configuration:

           Api Address <span class="token number">1</span>: http://127.0.0.1:9200
           Api Address <span class="token number">2</span>: http://bufconn
                     Cgo: disabled
               Log Level: info
                 Version: Vault v1.11.0, built <span class="token number">2022</span>-06-17T15:48:44Z
             Version Sha: ea296ccf58507b25051bc0597379c467046eb2f1

<span class="token number">2022</span>-06-30T17:17:08.726+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  sink.file: creating <span class="token function">file</span> sink
<span class="token number">2022</span>-06-30T17:17:08.727+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  sink.file: <span class="token function">file</span> sink configured: <span class="token assign-left variable">path</span><span class="token operator">=</span>/tmp/vault_agent <span class="token assign-left variable">mode</span><span class="token operator">=</span>-rw-r-----
<span class="token number">2022</span>-06-30T17:17:08.728+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  sink.server: starting sink server
<span class="token number">2022</span>-06-30T17:17:08.730+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  template.server: starting template server
<span class="token number">2022</span>-06-30T17:17:08.730+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  auth.handler: starting auth handler
<span class="token number">2022</span>-06-30T17:17:08.730+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  auth.handler: authenticating
<span class="token number">2022</span>-06-30T17:17:08.736+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>runner<span class="token punctuation">)</span> creating new runner <span class="token punctuation">(</span>dry: false, once: <span class="token boolean">false</span><span class="token punctuation">)</span>
<span class="token number">2022</span>-06-30T17:17:08.739+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  auth.handler: authentication successful, sending token to sinks
<span class="token number">2022</span>-06-30T17:17:08.740+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  auth.handler: starting renewal process
<span class="token number">2022</span>-06-30T17:17:08.740+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  sink.file: token written: <span class="token assign-left variable">path</span><span class="token operator">=</span>/tmp/vault_agent
<span class="token number">2022</span>-06-30T17:17:08.743+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>runner<span class="token punctuation">)</span> creating watcher
<span class="token number">2022</span>-06-30T17:17:08.745+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  auth.handler: renewed auth token
<span class="token number">2022</span>-06-30T17:17:08.745+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  template.server: template server received new token
<span class="token number">2022</span>-06-30T17:17:08.745+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>runner<span class="token punctuation">)</span> stopping
<span class="token number">2022</span>-06-30T17:17:08.745+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>runner<span class="token punctuation">)</span> creating new runner <span class="token punctuation">(</span>dry: false, once: <span class="token boolean">false</span><span class="token punctuation">)</span>
<span class="token number">2022</span>-06-30T17:17:08.745+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>runner<span class="token punctuation">)</span> creating watcher
<span class="token number">2022</span>-06-30T17:17:08.747+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>runner<span class="token punctuation">)</span> starting
<span class="token number">2022</span>-06-30T17:17:11.635+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>runner<span class="token punctuation">)</span> rendered <span class="token string">"./aws_cred.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"./aws_cred.txt"</span>
<span class="token number">2022</span>-06-30T17:17:11.635+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>runner<span class="token punctuation">)</span> executing <span class="token builtin class-name">command</span> <span class="token string">"[<span class="token entity" title="\&quot;">\"</span>cat ./aws_cred.txt<span class="token entity" title="\&quot;">\"</span>]"</span> from <span class="token string">"./aws_cred.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"./aws_cred.txt"</span>
<span class="token number">2022</span>-06-30T17:17:11.637+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>child<span class="token punctuation">)</span> spawning: <span class="token function">sh</span> <span class="token parameter variable">-c</span> <span class="token function">cat</span> ./aws_cred.txt
<span class="token assign-left variable">aws_access_key</span><span class="token operator">=</span><span class="token string">"AKIAU3NXDWRUHRF5SJDM"</span>
<span class="token assign-left variable">aws_secret_key</span><span class="token operator">=</span><span class="token string">"sErZfcuGnrZBAWoWCn5ackM/AWtp0iFHBR2RKP8a"</span>
<span class="token number">2022</span>-06-30T17:17:54.978+0900 <span class="token punctuation">[</span>WARN<span class="token punctuation">]</span> vault.read<span class="token punctuation">(</span>aws/creds/s3<span class="token punctuation">)</span>: TTL of <span class="token string">"1m"</span> exceeded the effective max_ttl of <span class="token string">"17s"</span><span class="token punctuation">;</span> TTL value is capped accordingly
<span class="token number">2022</span>-06-30T17:17:54.978+0900 <span class="token punctuation">[</span>WARN<span class="token punctuation">]</span> vault.read<span class="token punctuation">(</span>aws/creds/s3<span class="token punctuation">)</span>: renewer <span class="token keyword">done</span> <span class="token punctuation">(</span>maybe the lease expired<span class="token punctuation">)</span>
<span class="token number">2022</span>-06-30T17:17:57.422+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>runner<span class="token punctuation">)</span> rendered <span class="token string">"./aws_cred.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"./aws_cred.txt"</span>
<span class="token number">2022</span>-06-30T17:17:57.422+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>runner<span class="token punctuation">)</span> executing <span class="token builtin class-name">command</span> <span class="token string">"[<span class="token entity" title="\&quot;">\"</span>cat ./aws_cred.txt<span class="token entity" title="\&quot;">\"</span>]"</span> from <span class="token string">"./aws_cred.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"./aws_cred.txt"</span>
<span class="token number">2022</span>-06-30T17:17:57.422+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span> <span class="token punctuation">(</span>child<span class="token punctuation">)</span> spawning: <span class="token function">sh</span> <span class="token parameter variable">-c</span> <span class="token function">cat</span> ./aws_cred.txt
<span class="token assign-left variable">aws_access_key</span><span class="token operator">=</span><span class="token string">"AKIAU3NXDWRUETMPDDOH"</span>
<span class="token assign-left variable">aws_secret_key</span><span class="token operator">=</span><span class="token string">"FKBZd/xTdHGxoOf4eZ+L4KUQ99NXblOV4UCZIKyo"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">watch</span> <span class="token function">cat</span> ./aws_cred.txt
Every <span class="token number">2</span>.0s: <span class="token function">cat</span> ./aws_cred.txt                             gs-C02CT3ZFML85: Thu Jun <span class="token number">30</span> <span class="token number">17</span>:19:01 <span class="token number">2022</span>

<span class="token assign-left variable">aws_access_key</span><span class="token operator">=</span><span class="token string">"AKIAU3NXDWRUHRF5SJDM"</span>
<span class="token assign-left variable">aws_secret_key</span><span class="token operator">=</span><span class="token string">"sErZfcuGnrZBAWoWCn5ackM/AWtp0iFHBR2RKP8a"</span>

<span class="token operator">&lt;&lt;</span> expire 되면 다시 발급 됨 <span class="token operator">>></span>

<span class="token assign-left variable">aws_access_key</span><span class="token operator">=</span><span class="token string">"AKIAU3NXDWRUOOG33CPC"</span>
<span class="token assign-left variable">aws_secret_key</span><span class="token operator">=</span><span class="token string">"tJ1Hjxx45ra7RRqRkHcB5LhLbPstdSC2p8oBa3ZF"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-vault-agent-api-endpoint" tabindex="-1"><a class="header-anchor" href="#_3-2-vault-agent-api-endpoint" aria-hidden="true">#</a> 3.2 Vault Agent API Endpoint</h3>
<p>Vault Agent로는 X-Vault-Token 없이 API 호출 가능</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">-X</span> GET http://127.0.0.1:9200/v1/aws/creds/s3 <span class="token operator">|</span> jq <span class="token string">'.data'</span>
<span class="token punctuation">{</span>
  <span class="token string">"access_key"</span><span class="token builtin class-name">:</span> <span class="token string">"AKIAU3NXDWRUJJ4UW2P2"</span>,
  <span class="token string">"secret_key"</span><span class="token builtin class-name">:</span> <span class="token string">"BeI7xebPR75nXSJ9mzSsyh8P3qiwhCx5mqlh76R0"</span>,
  <span class="token string">"security_token"</span><span class="token builtin class-name">:</span> null
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-vault-systemd-sample" tabindex="-1"><a class="header-anchor" href="#_3-3-vault-systemd-sample" aria-hidden="true">#</a> 3.3 Vault Systemd Sample</h3>
<div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code><span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Unit</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">Description</span><span class="token punctuation">=</span><span class="token value attr-value">Nomad Agent</span>
<span class="token key attr-name">Requires</span><span class="token punctuation">=</span><span class="token value attr-value">consul-online.target</span>
<span class="token key attr-name">After</span><span class="token punctuation">=</span><span class="token value attr-value">consul-online.target</span>

<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Service</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">KillMode</span><span class="token punctuation">=</span><span class="token value attr-value">process</span>
<span class="token key attr-name">KillSignal</span><span class="token punctuation">=</span><span class="token value attr-value">SIGINT</span>
<span class="token key attr-name">Environment</span><span class="token punctuation">=</span><span class="token value attr-value">VAULT_ADDR=http://active.vault.service.consul:8200</span>
<span class="token key attr-name">Environment</span><span class="token punctuation">=</span><span class="token value attr-value">VAULT_SKIP_VERIFY=true</span>
<span class="token key attr-name">ExecStartPre</span><span class="token punctuation">=</span><span class="token value attr-value">/usr/local/bin/vault agent -config /etc/vault-agent.d/vault-agent.hcl</span>
<span class="token key attr-name">ExecStart</span><span class="token punctuation">=</span><span class="token value attr-value">/usr/bin/nomad-vault.sh</span>
<span class="token key attr-name">ExecReload</span><span class="token punctuation">=</span><span class="token value attr-value">/bin/kill -HUP $MAINPID</span>
<span class="token key attr-name">Restart</span><span class="token punctuation">=</span><span class="token value attr-value">on-failure</span>
<span class="token key attr-name">RestartSec</span><span class="token punctuation">=</span><span class="token value attr-value">2</span>
<span class="token key attr-name">StartLimitBurst</span><span class="token punctuation">=</span><span class="token value attr-value">3</span>
<span class="token key attr-name">StartLimitIntervalSec</span><span class="token punctuation">=</span><span class="token value attr-value">10</span>
<span class="token key attr-name">LimitNOFILE</span><span class="token punctuation">=</span><span class="token value attr-value">65536</span>

<span class="token section"><span class="token punctuation">[</span><span class="token section-name selector">Install</span><span class="token punctuation">]</span></span>
<span class="token key attr-name">WantedBy</span><span class="token punctuation">=</span><span class="token value attr-value">multi-user.target</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


