<template><div><h1 id="jenkins-pipeline-nomad-integrated-vault" tabindex="-1"><a class="header-anchor" href="#jenkins-pipeline-nomad-integrated-vault" aria-hidden="true">#</a> Jenkins Pipeline Nomad (Integrated Vault)</h1>
<h3 id="test-env" tabindex="-1"><a class="header-anchor" href="#test-env" aria-hidden="true">#</a> Test ENV</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ sw_vers
ProductName:	macOS
ProductVersion:	<span class="token number">12.4</span>

$ brew <span class="token parameter variable">--version</span>
Homebrew <span class="token number">3.5</span>.2

$ <span class="token function">git</span> version
<span class="token function">git</span> version <span class="token number">2.27</span>.0

$ <span class="token function">java</span> <span class="token parameter variable">-version</span>
openjdk version <span class="token string">"11.0.14.1"</span> <span class="token number">2022</span>-02-08

$ gradle <span class="token parameter variable">--version</span>
Welcome to Gradle <span class="token number">7.4</span>.2<span class="token operator">!</span>

$ <span class="token function">docker</span> version
Client:
 Version:           <span class="token number">20.10</span>.9

Server:
 Engine:
  Version:          <span class="token number">20.10</span>.14

$ vault version
Vault v1.11.0

$ nomad version
Nomad v1.3.1

$ <span class="token function">curl</span> <span class="token parameter variable">--version</span>
<span class="token function">curl</span> <span class="token number">7.79</span>.1 <span class="token punctuation">(</span>x86_64-apple-darwin21.0<span class="token punctuation">)</span>

$ aws <span class="token parameter variable">--version</span>
aws-cli/2.7.11 Python/3.10.5 Darwin/21.5.0 source/x86_64 prompt/off
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-vault-nomad-integration-dev-mode" tabindex="-1"><a class="header-anchor" href="#_1-vault-nomad-integration-dev-mode" aria-hidden="true">#</a> 1. Vault &amp; Nomad Integration (dev mode)</h2>
<h3 id="_1-1-vault-setup" tabindex="-1"><a class="header-anchor" href="#_1-1-vault-setup" aria-hidden="true">#</a> 1.1 Vault Setup</h3>
<h4 id="vault-start-dev-mode" tabindex="-1"><a class="header-anchor" href="#vault-start-dev-mode" aria-hidden="true">#</a> Vault Start Dev mode</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault server <span class="token parameter variable">-dev</span> -dev-root-token-id<span class="token operator">=</span>root
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="vault-env" tabindex="-1"><a class="header-anchor" href="#vault-env" aria-hidden="true">#</a> Vault Env</h4>
<blockquote>
<p>Another terminal</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span>http://127.0.0.1:8200
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>root
<span class="token builtin class-name">export</span> <span class="token assign-left variable">NOMAD_POLICY</span><span class="token operator">=</span>nomad-server
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="vault-policy-for-nomad" tabindex="-1"><a class="header-anchor" href="#vault-policy-for-nomad" aria-hidden="true">#</a> Vault Policy for Nomad</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&lt;&lt;</span><span class="token string">EOF<span class="token bash punctuation"> <span class="token operator">|</span> vault policy <span class="token function">write</span> <span class="token variable">$NOMAD_POLICY</span> -</span>
# Allow creating tokens under "nomad-cluster" token role. The token role name
# should be updated if "nomad-cluster" is not used.
path "auth/token/create/nomad-cluster" {
  capabilities = ["update"]
}

# Allow looking up "nomad-cluster" token role. The token role name should be
# updated if "nomad-cluster" is not used.
path "auth/token/roles/nomad-cluster" {
  capabilities = ["read"]
}

# Allow looking up the token passed to Nomad to validate # the token has the
# proper capabilities. This is provided by the "default" policy.
path "auth/token/lookup-self" {
  capabilities = ["read"]
}

# Allow looking up incoming tokens to validate they have permissions to access
# the tokens they are requesting. This is only required if
# <span class="token variable"><span class="token variable">`</span>allow_unauthenticated<span class="token variable">`</span></span> is set to false.
path "auth/token/lookup" {
  capabilities = ["update"]
}

# Allow revoking tokens that should no longer exist. This allows revoking
# tokens for dead tasks.
path "auth/token/revoke-accessor" {
  capabilities = ["update"]
}

# Allow checking the capabilities of our own token. This is used to validate the
# token upon startup.
path "sys/capabilities-self" {
  capabilities = ["update"]
}

# Allow our own token to be renewed.
path "auth/token/renew-self" {
  capabilities = ["update"]
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="vault-policy-for-aws" tabindex="-1"><a class="header-anchor" href="#vault-policy-for-aws" aria-hidden="true">#</a> Vault Policy for AWS</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&lt;&lt;</span><span class="token string">EOF<span class="token bash punctuation"> <span class="token operator">|</span> vault policy <span class="token function">write</span> aws_policy -</span>
path "aws/creds/s3" {
  capabilities = ["read","update"]
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="create-token-role" tabindex="-1"><a class="header-anchor" href="#create-token-role" aria-hidden="true">#</a> Create Token Role</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> auth/token/roles/nomad-cluster <span class="token assign-left variable">allowed_policies</span><span class="token operator">=</span><span class="token string">"aws_policy,db_policy"</span> <span class="token assign-left variable">disallowed_policies</span><span class="token operator">=</span><span class="token string">"<span class="token variable">$NOMAD_POLICY</span>"</span> <span class="token assign-left variable">token_explicit_max_ttl</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">orphan</span><span class="token operator">=</span>true <span class="token assign-left variable">token_period</span><span class="token operator">=</span><span class="token string">"259200"</span> <span class="token assign-left variable">renewable</span><span class="token operator">=</span>true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="create-token" tabindex="-1"><a class="header-anchor" href="#create-token" aria-hidden="true">#</a> Create Token</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault token create <span class="token parameter variable">-field</span> token <span class="token parameter variable">-policy</span> <span class="token variable">$NOMAD_POLICY</span> <span class="token parameter variable">-period</span> 72h <span class="token parameter variable">-orphan</span> <span class="token operator">></span> /tmp/token.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_1-2-nomad-setup" tabindex="-1"><a class="header-anchor" href="#_1-2-nomad-setup" aria-hidden="true">#</a> 1.2 Nomad Setup</h3>
<h4 id="nomad-start-dev-mode" tabindex="-1"><a class="header-anchor" href="#nomad-start-dev-mode" aria-hidden="true">#</a> Nomad Start Dev mode</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>nomad agent <span class="token parameter variable">-dev</span> -vault-enabled<span class="token operator">=</span>true -vault-address<span class="token operator">=</span>http://127.0.0.1:8200 -vault-token<span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /tmp/token.txt<span class="token variable">)</span></span> -vault-tls-skip-verify<span class="token operator">=</span>true -vault-create-from-role<span class="token operator">=</span>nomad-cluster -alloc-dir<span class="token operator">=</span>/tmp/nomad/alloc -state-dir<span class="token operator">=</span>/tmp/nomad/state
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="nomad-env" tabindex="-1"><a class="header-anchor" href="#nomad-env" aria-hidden="true">#</a> Nomad Env</h4>
<blockquote>
<p>Another terminal</p>
</blockquote>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>export NOMAD_ADDR=http://127.0.0.1:4646
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="jar-file-up-download-nexus-job" tabindex="-1"><a class="header-anchor" href="#jar-file-up-download-nexus-job" aria-hidden="true">#</a> Jar file Up/Download Nexus Job</h4>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>cat <span class="token operator">&lt;&lt;</span><span class="token constant">EOF</span> <span class="token operator">|</span> nomad job run <span class="token operator">-</span>
job <span class="token string-literal"><span class="token string">"fileserver"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>

  group <span class="token string-literal"><span class="token string">"fileserver"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>

    network <span class="token punctuation">{</span>
      port <span class="token string-literal"><span class="token string">"http"</span></span> <span class="token punctuation">{</span>
        to <span class="token operator">=</span> <span class="token number">3000</span>
        static <span class="token operator">=</span> <span class="token number">3000</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string-literal"><span class="token string">"fileserver"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"docker"</span></span>

      config <span class="token punctuation">{</span>
        image <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"julienmeerschart/simple-file-upload-download-server"</span></span>
        ports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"http"</span></span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token constant">EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Upload Test</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">-F</span> <span class="token assign-left variable">file</span><span class="token operator">=</span>@/tmp/dynamic.properties http://localhost:3000
<span class="token punctuation">{</span><span class="token string">"downloadLink"</span><span class="token builtin class-name">:</span><span class="token string">"http://localhost:3000/file?file=dynamic.properties"</span>,<span class="token string">"curl"</span><span class="token builtin class-name">:</span><span class="token string">"curl http://localhost:3000/file?file=dynamic.properties > dynamic.properties"</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-vault-nomad-integration-check" tabindex="-1"><a class="header-anchor" href="#_1-3-vault-nomad-integration-check" aria-hidden="true">#</a> 1.3 Vault-Nomad Integration Check</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ nomad agent-info
client
  heartbeat_ttl <span class="token operator">=</span> <span class="token number">11</span>.955357358s
  known_servers <span class="token operator">=</span> <span class="token number">127.0</span>.0.1:4647
  last_heartbeat <span class="token operator">=</span> <span class="token number">9</span>.248352347s
  node_id <span class="token operator">=</span> <span class="token number">69944736</span>-5399-f805-9c03-35be83c9abfe
  num_allocations <span class="token operator">=</span> <span class="token number">0</span>
nomad
  bootstrap <span class="token operator">=</span> <span class="token boolean">true</span>
  known_regions <span class="token operator">=</span> <span class="token number">1</span>
  leader <span class="token operator">=</span> <span class="token boolean">true</span>
  leader_addr <span class="token operator">=</span> <span class="token number">127.0</span>.0.1:4647
  server <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token operator">&lt;</span><span class="token punctuation">..</span>.<span class="token operator">></span>
vault
  token_expire_time <span class="token operator">=</span> <span class="token number">2022</span>-06-30T08:44:26+09:00
  token_last_renewal_time <span class="token operator">=</span> <span class="token number">2022</span>-06-27T08:44:26+09:00
  token_next_renewal_time <span class="token operator">=</span> <span class="token number">2022</span>-06-28T20:44:26+09:00
  token_ttl <span class="token operator">=</span> 71h53m46s
  tracked_for_revoked <span class="token operator">=</span> <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-vault-sample" tabindex="-1"><a class="header-anchor" href="#_1-4-vault-sample" aria-hidden="true">#</a> 1.4 Vault Sample</h3>
<blockquote>
<p>AWS Dynamic Secret</p>
</blockquote>
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
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> aws/creds/s3
Key                Value
---                -----
lease_id           aws/creds/s3/tt1sONqTebOsrJxBs6A3B4m4
lease_duration     1m
lease_renewable    <span class="token boolean">true</span>
access_key         AKIAU3NXDWRUL5GVEB4H
secret_key         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
security_token     <span class="token operator">&lt;</span>nil<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-jenkins-setup" tabindex="-1"><a class="header-anchor" href="#_2-jenkins-setup" aria-hidden="true">#</a> 2. Jenkins Setup</h2>
<h3 id="_2-1-jenkins-install-macos" tabindex="-1"><a class="header-anchor" href="#_2-1-jenkins-install-macos" aria-hidden="true">#</a> 2.1 Jenkins Install (macOS)</h3>
<blockquote>
<p>macOS guide : <a href="https://www.jenkins.io/download/lts/macos/" target="_blank" rel="noopener noreferrer">https://www.jenkins.io/download/lts/macos/<ExternalLinkIcon/></a></p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>brew <span class="token function">install</span> jenkins-lts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>brew services start jenkins-lts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-2-unlock-jenkins" tabindex="-1"><a class="header-anchor" href="#_2-2-unlock-jenkins" aria-hidden="true">#</a> 2.2 Unlock Jenkins</h3>
<p>Home 디렉토리의 Jenkins 활성화를 위한 패스워드를 다음 경로에서 복사하여 <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">http://localhost:8080<ExternalLinkIcon/></a> 페이지의 <code v-pre>Unlock Jenkins</code> 에 입력</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627095332250.png" alt="image-20220627095332250" tabindex="0" loading="lazy"><figcaption>image-20220627095332250</figcaption></figure>
<h3 id="_2-3-jenkins-setup" tabindex="-1"><a class="header-anchor" href="#_2-3-jenkins-setup" aria-hidden="true">#</a> 2.3 Jenkins Setup</h3>
<h4 id="customize-jenkins" tabindex="-1"><a class="header-anchor" href="#customize-jenkins" aria-hidden="true">#</a> Customize Jenkins</h4>
<p>빠른 시작을 위해 기본 값인 <code v-pre>Install suggested plugins</code> 를 클릭</p>
<h4 id="create-first-admin-user" tabindex="-1"><a class="header-anchor" href="#create-first-admin-user" aria-hidden="true">#</a> Create First Admin User</h4>
<p>계정명, 암호, 이름, 이메일 주소를 기입하고 <code v-pre>Save and Continue</code> 버튼 클릭</p>
<h4 id="instance-configuration" tabindex="-1"><a class="header-anchor" href="#instance-configuration" aria-hidden="true">#</a> Instance Configuration</h4>
<p>올바른 Jenkins URL을 확인하고 <code v-pre>Save and Finish</code> 버튼 클릭</p>
<h4 id="jenkins-is-ready" tabindex="-1"><a class="header-anchor" href="#jenkins-is-ready" aria-hidden="true">#</a> Jenkins is ready!</h4>
<p><code v-pre>Start using Jenkins</code> 버튼 클릭</p>
<h3 id="_2-4-jenkins-github-plugin" tabindex="-1"><a class="header-anchor" href="#_2-4-jenkins-github-plugin" aria-hidden="true">#</a> 2.4 Jenkins github plugin</h3>
<h4 id="github" tabindex="-1"><a class="header-anchor" href="#github" aria-hidden="true">#</a> GitHub</h4>
<ol>
<li>
<p>GitHub 로그인</p>
</li>
<li>
<p>우측 상단 사용자 메뉴 클릭 후 <code v-pre>Settings</code> 클릭</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/GitHub 2022-06-27 12-36-30.png" alt="GitHub 2022-06-27 12-36-30" tabindex="0" loading="lazy"><figcaption>GitHub 2022-06-27 12-36-30</figcaption></figure>
</li>
<li>
<p>좌측 메뉴 최하단 <code v-pre>Developer settings</code> 클릭</p>
</li>
<li>
<p>좌측 메뉴 <code v-pre>Personal access tokens</code> 클릭</p>
</li>
<li>
<p><code v-pre>Generate new token</code> 버튼 클릭</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Personal access tokens.png" alt="Personal access tokens" tabindex="0" loading="lazy"><figcaption>Personal access tokens</figcaption></figure>
</li>
<li>
<p>Token 옵션 선택 후 <code v-pre>Generate token</code> 클릭</p>
<ul>
<li>Note : 토큰 목적 입력 (e.g. Jenkins Token)</li>
<li>Expiration : 기간을 설정 (e.g. No expiration)</li>
<li>Select scopes
<ul>
<li>repo</li>
<li>admin:org</li>
<li>admin:repo_hook</li>
</ul>
</li>
</ul>
</li>
<li>
<p>생성된 토큰을 기록/보관</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Personal access tokens 2022-06-27 12-42-58.png" alt="Personal access tokens 2022-06-27 12-42-58" tabindex="0" loading="lazy"><figcaption>Personal access tokens 2022-06-27 12-42-58</figcaption></figure>
</li>
</ol>
<h4 id="jenkins" tabindex="-1"><a class="header-anchor" href="#jenkins" aria-hidden="true">#</a> Jenkins</h4>
<ol>
<li>
<p><code v-pre>Jenkins 관리</code> &gt; <code v-pre>시스템 설정</code> 으로 이동</p>
</li>
<li>
<p><code v-pre>JDK</code> 항목에서 <code v-pre>Add JDK</code> 클릭</p>
<ul>
<li>Name : 이름 입력 (e.g. jdk11)</li>
<li>JAVA_HOME : 자바 홈 경로 (e.g. /Library/Java/JavaVirtualMachines/temurin-11.jdk/Contents/Home)</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627143641019.png" alt="image-20220627143641019" tabindex="0" loading="lazy"><figcaption>image-20220627143641019</figcaption></figure>
</li>
<li>
<p><code v-pre>Git</code> 항목에서 <code v-pre>Add Git</code>을 클릭</p>
<ul>
<li>Name : 이름 입력 (e.g. local)</li>
<li>Path to Git executable : git 실행파일 경로 입력 (e.g. /usr/local/bin/git)</li>
</ul>
</li>
<li>
<p><code v-pre>GitHub</code> 항목에서 <code v-pre>Add GitHub Server</code> 드롭박스의 <code v-pre>GitHub Server</code>를 클릭</p>
<ul>
<li>Name : 이름 입력 (e.g. jenkins_github)</li>
<li>API URL : 기본 값 (<a href="https://api.github.com" target="_blank" rel="noopener noreferrer">https://api.github.com<ExternalLinkIcon/></a>)</li>
<li>Credentials : 아래 <code v-pre>+Add</code> 버튼 클릭하여 <code v-pre>Jenkins</code>선택 후 새로운 크리덴셜 생성 후 생성된 항목 지정</li>
<li>Kind : <code v-pre>Secret Test</code> 선택</li>
<li>Secret : GitHub에서 생성한 토큰 입력</li>
<li>ID : 사용자 지정 (e.g. jenkins_github)</li>
<li><code v-pre>Test Connection</code> 버튼으로 연결 확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/스크린샷 2022-06-27 12.48.18.png" alt="스크린샷 2022-06-27 12.48.18" tabindex="0" loading="lazy"><figcaption>스크린샷 2022-06-27 12.48.18</figcaption></figure>
</li>
<li>
<p><code v-pre>Gradle</code> 항목에서 <code v-pre>Add Gradle</code> 클릭</p>
<ul>
<li>
<p>Name : 이름 입력 (e.g. gradle)</p>
</li>
<li>
<p>GRADLE_HOME : Gradle 홈 디렉토리 입력 (e.g. /usr/local/Cellar/gradle/7.4.2/libexec)</p>
</li>
</ul>
</li>
</ol>
<h2 id="_3-sample-java" tabindex="-1"><a class="header-anchor" href="#_3-sample-java" aria-hidden="true">#</a> 3. Sample Java</h2>
<h3 id="_3-1-app-setting" tabindex="-1"><a class="header-anchor" href="#_3-1-app-setting" aria-hidden="true">#</a> 3.1 App Setting</h3>
<h4 id="spring-boot-initializr" tabindex="-1"><a class="header-anchor" href="#spring-boot-initializr" aria-hidden="true">#</a> Spring-boot Initializr</h4>
<blockquote>
<p><a href="https://start.spring.io/" target="_blank" rel="noopener noreferrer">https://start.spring.io/<ExternalLinkIcon/></a></p>
</blockquote>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627155858474.png" alt="image-20220627155858474" tabindex="0" loading="lazy"><figcaption>image-20220627155858474</figcaption></figure>
<ul>
<li>Project : Gradle Project</li>
<li>Language : Java</li>
<li>Spring Boot : 2.7.2</li>
<li>Packageing : Jar</li>
<li>Java : 11</li>
<li>Dependencies : Spring Web</li>
</ul>
<h4 id="app-setup" tabindex="-1"><a class="header-anchor" href="#app-setup" aria-hidden="true">#</a> App Setup</h4>
<p><code v-pre>demo&gt;src&gt;main&gt;resources&gt;application.yml</code></p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">dynamic</span><span class="token punctuation">:</span>
  <span class="token key atrule">path</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>DYNAMIC_PROPERTIES_PATH<span class="token punctuation">:</span>/tmp/dynamic.properties<span class="token punctuation">}</span>
<span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">port</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>NOMAD_HOST_PORT_http<span class="token punctuation">:</span><span class="token number">8080</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>demo&gt;src&gt;main&gt;java&gt;com&gt;example&gt;demo&gt;DemoApplication.java</code></p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>example<span class="token punctuation">.</span>demo</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>beans<span class="token punctuation">.</span>factory<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Value</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span></span><span class="token class-name">SpringApplication</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span>autoconfigure<span class="token punctuation">.</span></span><span class="token class-name">SpringBootApplication</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>scheduling<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">EnableScheduling</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>scheduling<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Scheduled</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>bind<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">RequestMapping</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>bind<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">RequestMethod</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>web<span class="token punctuation">.</span>bind<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">RestController</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>io<span class="token punctuation">.</span></span><span class="token class-name">IOException</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>nio<span class="token punctuation">.</span>file<span class="token punctuation">.</span></span><span class="token class-name">Files</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>nio<span class="token punctuation">.</span>file<span class="token punctuation">.</span></span><span class="token class-name">Paths</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span>

<span class="token annotation punctuation">@RestController</span>
<span class="token annotation punctuation">@SpringBootApplication</span>
<span class="token annotation punctuation">@EnableScheduling</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoApplication</span> <span class="token punctuation">{</span>

	<span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token constant">FILE_PATH</span><span class="token punctuation">;</span>

	<span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">"${dynamic.path}"</span><span class="token punctuation">)</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setKey</span><span class="token punctuation">(</span><span class="token class-name">String</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token constant">FILE_PATH</span> <span class="token operator">=</span> value<span class="token punctuation">;</span>
	<span class="token punctuation">}</span>

	<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">DemoApplication</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>

	<span class="token annotation punctuation">@Scheduled</span><span class="token punctuation">(</span>fixedRate<span class="token operator">=</span><span class="token number">1000</span><span class="token punctuation">)</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">filecheck</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>
		<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> str <span class="token operator">=</span> <span class="token class-name">Files</span><span class="token punctuation">.</span><span class="token function">readAllLines</span><span class="token punctuation">(</span><span class="token class-name">Paths</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token constant">FILE_PATH</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>

	<span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span>method <span class="token operator">=</span> <span class="token class-name">RequestMethod</span><span class="token punctuation">.</span><span class="token constant">GET</span><span class="token punctuation">,</span> path <span class="token operator">=</span> <span class="token string">"/"</span><span class="token punctuation">)</span>
	<span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">index</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>
		<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> str <span class="token operator">=</span> <span class="token class-name">Files</span><span class="token punctuation">.</span><span class="token function">readAllLines</span><span class="token punctuation">(</span><span class="token class-name">Paths</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token constant">FILE_PATH</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">;</span>

		<span class="token keyword">return</span> <span class="token string">"&lt;h1>AWS&lt;/h1>"</span>
		<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token string">"&lt;h2>"</span> <span class="token operator">+</span> str<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"&lt;/h2>"</span><span class="token punctuation">)</span>
		<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token string">"&lt;h2>"</span> <span class="token operator">+</span> str<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"&lt;/h2>"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="set-dummy-properties-test" tabindex="-1"><a class="header-anchor" href="#set-dummy-properties-test" aria-hidden="true">#</a> Set dummy properties &amp; Test</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">cat</span> <span class="token operator">&lt;&lt;</span>EOF<span class="token operator">></span> /tmp/dynamic.properties
<span class="token assign-left variable">aws_access_key</span><span class="token operator">=</span>my_access_key
<span class="token assign-left variable">aws_secret_key</span><span class="token operator">=</span>my_secret_key
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ gradle bootRun
<span class="token punctuation">..</span>.
<span class="token punctuation">[</span>aws_access_key<span class="token operator">=</span>my_access_key, <span class="token assign-left variable">aws_secret_key</span><span class="token operator">=</span>my_secret_key<span class="token punctuation">]</span>
<span class="token punctuation">[</span>aws_access_key<span class="token operator">=</span>my_access_key, <span class="token assign-left variable">aws_secret_key</span><span class="token operator">=</span>my_secret_key<span class="token punctuation">]</span>
<span class="token operator">&lt;=</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span>---<span class="token operator">></span> <span class="token number">80</span>% EXECUTING <span class="token punctuation">[</span>5s<span class="token punctuation">]</span>
<span class="token operator">></span> :bootRun
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-pipeline-생성" tabindex="-1"><a class="header-anchor" href="#_4-pipeline-생성" aria-hidden="true">#</a> 4. Pipeline 생성</h2>
<blockquote>
<p>Pipeline 구성 case 1</p>
<ol>
<li>GitHub checkout</li>
<li>Gradle build</li>
<li>jar upload</li>
<li>Nomad Job Start</li>
</ol>
</blockquote>
<blockquote>
<p>Pipeline 구성 case 2</p>
<ol>
<li>GitHub checkout</li>
<li>Gradle build</li>
<li>docker build</li>
<li>docker push</li>
<li>Nomad Job Start</li>
</ol>
</blockquote>
<Mermaid id="mermaid-473" code="eJwtjbEOgyAURXe+4o06+AMObapUGgendmiIAwIpRCqEwlT770Vxei8n59778swpuGN0oUSHW5yAK8lnG8MIVXVqKPFMGAlT1EaMqNkgtN/WLoHpRfrzD7UbW4e6Z34FTNOBhzOWJR3v+rUY7JsJ6O1UHvazxpbPMgU6mj9o8kK3R0hxUBc/qkQk96A/1DQ1HQ=="></Mermaid><h3 id="_4-1-jenkins-job-jar" tabindex="-1"><a class="header-anchor" href="#_4-1-jenkins-job-jar" aria-hidden="true">#</a> 4.1 Jenkins Job - Jar</h3>
<ol>
<li>
<p>좌측 <code v-pre>+ 새로운 Item</code> 버튼 클릭</p>
</li>
<li>
<p>이름 입력 (e.g. Nomad Job - Java Driver)</p>
</li>
<li>
<p>Pipeline 선택 후 <code v-pre>OK</code></p>
</li>
<li>
<p>성성된 Jenkins Job의 Pipeline에 스크립트 구성</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    triggers <span class="token punctuation">{</span>
        <span class="token function">cron</span><span class="token punctuation">(</span><span class="token string">'H */8 * * *'</span><span class="token punctuation">)</span> <span class="token comment">//regular builds</span>
        <span class="token function">pollSCM</span><span class="token punctuation">(</span><span class="token string">'* * * * *'</span><span class="token punctuation">)</span> <span class="token comment">//polling for changes, here once a minute</span>
    <span class="token punctuation">}</span>
    tools <span class="token punctuation">{</span> 
        <span class="token function">git</span><span class="token punctuation">(</span><span class="token string">'local'</span><span class="token punctuation">)</span>
        <span class="token function">gradle</span><span class="token punctuation">(</span><span class="token string">'gradle'</span><span class="token punctuation">)</span>
        <span class="token function">jdk</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">"jdk11"</span></span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    environment <span class="token punctuation">{</span>
        NOMAD_ADDR <span class="token operator">=</span> <span class="token string">'http://localhost:4646'</span>
    <span class="token punctuation">}</span>
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Clone'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                git branch<span class="token punctuation">:</span> <span class="token string">'main'</span><span class="token punctuation">,</span>
                    credentialsId<span class="token punctuation">:</span> <span class="token string">'jenkins_github'</span><span class="token punctuation">,</span>
                    url<span class="token punctuation">:</span> <span class="token string">'https://github.com/Great-Stone/jenkins-gradle-nomad-pipeline'</span>
                sh <span class="token interpolation-string"><span class="token string">"ls -lat"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Test'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'./gradlew test'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'./gradlew build'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Upload'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'mv ./build/libs/demo-0.0.1-SNAPSHOT.jar ./demo-${BUILD_NUMBER}.jar'</span>
                sh <span class="token string">'curl -F file=@./demo-${BUILD_NUMBER}.jar http://localhost:3000'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Nomad Download'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'curl -C - --output nomad_1.3.1_darwin_amd64.zip https://releases.hashicorp.com/nomad/1.3.1/nomad_1.3.1_darwin_amd64.zip'</span>
                sh <span class="token string">'unzip -o nomad_1.3.1_darwin_amd64.zip'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Deploy To Nomad'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            input<span class="token punctuation">{</span>
                message <span class="token interpolation-string"><span class="token string">"Do you want to proceed for production deployment?"</span></span>
            <span class="token punctuation">}</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'./nomad job run -var version=${BUILD_NUMBER} ./nomad-java.hcl'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>지금 빌드</code>를 클릭하여 빌드를 진행합니다. 마지막 단계에서 마우스 오버하여 승인처리합니다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627213452717.png" alt="image-20220627213452717" tabindex="0" loading="lazy"><figcaption>image-20220627213452717</figcaption></figure>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/스크린샷 2022-06-27 21.35.35.png" alt="스크린샷 2022-06-27 21.35.35" tabindex="0" loading="lazy"><figcaption>스크린샷 2022-06-27 21.35.35</figcaption></figure>
</li>
</ol>
<h3 id="_4-2-jenkins-job-docker-ecr" tabindex="-1"><a class="header-anchor" href="#_4-2-jenkins-job-docker-ecr" aria-hidden="true">#</a> 4.2 Jenkins Job - Docker / ECR</h3>
<p>ECR - AWS 구성 필요</p>
<ol>
<li>AWS 로그인 후 ECR 서비스로 이동한 후 우측의 리포지토리 생성</li>
</ol>
<ul>
<li>Private 으로 생성하는 경우 AWS Credential 설정을 Jenkins에 추가</li>
</ul>
<ol start="2">
<li>
<p>리포지토리 이름을 입력 후 태그 변경 불가능 옵션과 푸시할 때 스캔 설정</p>
</li>
<li>
<p>리포지토리 생성 후 URI 복사<br>
e.g. &lt;id&gt;.dkr.ecr.ap-northeast-2.amazonaws.com/demo</p>
</li>
</ol>
<h4 id="plugin-setup" tabindex="-1"><a class="header-anchor" href="#plugin-setup" aria-hidden="true">#</a> Plugin Setup</h4>
<ol>
<li>
<p><code v-pre>Jenkins 관리</code> &gt; <code v-pre>플러그인 관리</code> 로 이동</p>
</li>
<li>
<p><code v-pre>설치 가능</code> 탭을 선택하고 <code v-pre>AWS Global Configuration</code> , <code v-pre>Docker</code>, <code v-pre>Docker Pipeline</code>, <code v-pre>Amazon ECR</code> 를 검색 후 설치</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627220001821.png" alt="image-20220627220001821" tabindex="0" loading="lazy"><figcaption>image-20220627220001821</figcaption></figure>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627220055393.png" alt="image-20220627220055393" tabindex="0" loading="lazy"><figcaption>image-20220627220055393</figcaption></figure>
</li>
<li>
<p><code v-pre>Jenkins 관리</code> &gt; <code v-pre>Manage Credentials</code> 로 이동</p>
</li>
<li>
<p>Domains의 (global) 항목 선택하여 <code v-pre>Add credentials</code> 클릭</p>
</li>
</ol>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627220603230.png" alt="image-20220627220603230" tabindex="0" loading="lazy"><figcaption>image-20220627220603230</figcaption></figure>
<ul>
<li>
<p>Kind : Secret text</p>
</li>
<li>
<p>Scope : Global</p>
</li>
<li>
<p>ID : 이름 (e.g. ecr_cred)</p>
</li>
<li>
<p>Secret: JSON 형태의 Secret</p>
<ul>
<li>
<p>aws_access_key_id</p>
</li>
<li>
<p>aws_secret_access_key</p>
</li>
<li>
<p>aws_session_token (sts 인 경우)</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span><span class="token property">"aws_access_key_id"</span><span class="token operator">:</span><span class="token string">"ASIA2LEU5EPEJQGXNMJU"</span><span class="token punctuation">,</span><span class="token property">"aws_secret_access_key"</span><span class="token operator">:</span><span class="token string">"psGEnC5COCwcUojDo6EO/Ztd7J58THSVerEc7EE9"</span><span class="token punctuation">,</span><span class="token property">"aws_session_token"</span><span class="token operator">:</span><span class="token string">"IQoJb3JpZ2luX2VjEMj//////////wEaCXVzLXdlc3QtMiJIMEYCIQDkdZ+GEya0j8gxM/Ow5GD5Kjr8e//pA/hARZm2Tok+JgIhAOrl0c8ctXkerxsNgSwAKSjmIrdbUyHxXVsuPl+GHgywKuAECOH//////////wEQARoMNzExMTI5Mzc1Njg4IgxAc1B5sczNlB7TgyAqtASCHs37YorM6spNTNftpvajNFGewy4z8ztDo83qx5+I67ldNnWnJBt2IHCYdtLBp1/wd/8yGYFKb/TWuOgjo0pdDKc2wJQ7gAbnB8d65OYzP2SSipqUJ/E4Tz/Ojgb0UQiAd8GcXEMdEe+9WBciSK5AD2CraMmbYlq2ThBjot8BOXJHG688IbI29/Qq+Y1WpozDpjNaeLm+kd9a9GWtX1XUXUvaXDcz+81RKW271uUp4n0JhfJ5PPUilxQVfISXtv7rEpp1PjhDE3c/oK6muK8SeeIIX7fAGi1cXqHMw9PfolQY6oAHUp3Acq+8uakNyOw8Usfl9xRDf1hQyAfofsz00DCmiZinuam8dg32R1pHW7JRBYgXXD5/dnp1A7KgdrjhjECpU8+Ayo/dAOqohOfTBYS/xMrVs8tkfUxHd/AKCca5oYda1YyIxdweBp/kEZHCZTkEpzY2TxEtzVsm5fEbjTViemglVmnkeDoZGeERVyXJlxVzW2of8I3hmKAeCENcH5L+Y"</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
</li>
</ul>
<h4 id="pipeline" tabindex="-1"><a class="header-anchor" href="#pipeline" aria-hidden="true">#</a> Pipeline</h4>
<ol>
<li>
<p>좌측 <code v-pre>+ 새로운 Item</code> 버튼 클릭</p>
</li>
<li>
<p>이름 입력 (e.g. Nomad Job - Docker Driver)</p>
</li>
<li>
<p>Pipeline 선택 후 <code v-pre>OK</code></p>
</li>
<li>
<p>성성된 Jenkins Job의 Pipeline에 스크립트 구성 (Private)</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    triggers <span class="token punctuation">{</span>
        <span class="token function">cron</span><span class="token punctuation">(</span><span class="token string">'H */8 * * *'</span><span class="token punctuation">)</span> <span class="token comment">//regular builds</span>
        <span class="token function">pollSCM</span><span class="token punctuation">(</span><span class="token string">'* * * * *'</span><span class="token punctuation">)</span> <span class="token comment">//polling for changes, here once a minute</span>
    <span class="token punctuation">}</span>
    tools <span class="token punctuation">{</span> 
        <span class="token function">git</span><span class="token punctuation">(</span><span class="token string">'local'</span><span class="token punctuation">)</span>
        <span class="token function">gradle</span><span class="token punctuation">(</span><span class="token string">'gradle'</span><span class="token punctuation">)</span>
        <span class="token function">jdk</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">"jdk11"</span></span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    environment <span class="token punctuation">{</span>
        NOMAD_ADDR <span class="token operator">=</span> <span class="token string">'http://localhost:4646'</span>
        NOMAD_DOWNLOAD_URL <span class="token operator">=</span> <span class="token string">'https://releases.hashicorp.com/nomad/1.3.1/nomad_1.3.1_darwin_amd64.zip'</span>
        DOCKER_REGISTRY <span class="token operator">=</span> <span class="token string">'**********.dkr.ecr.ap-northeast-2.amazonaws.com'</span>
        dockerImage <span class="token operator">=</span> <span class="token string">''</span>
        PATH <span class="token operator">=</span> <span class="token interpolation-string"><span class="token string">"/Users/gs/.rd/bin:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">PATH</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span>
    <span class="token punctuation">}</span>
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Clone'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                git branch<span class="token punctuation">:</span> <span class="token string">'main'</span><span class="token punctuation">,</span>
                    credentialsId<span class="token punctuation">:</span> <span class="token string">'jenkins_github'</span><span class="token punctuation">,</span>
                    url<span class="token punctuation">:</span> <span class="token string">'https://github.com/Great-Stone/jenkins-gradle-nomad-pipeline'</span>
                sh <span class="token interpolation-string"><span class="token string">"ls -lat"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Test'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'./gradlew test'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Java Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'./gradlew build'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Docker Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                script<span class="token punctuation">{</span>
                    dockerImage <span class="token operator">=</span> docker<span class="token punctuation">.</span>build DOCKER_REGISTRY <span class="token operator">+</span> <span class="token interpolation-string"><span class="token string">"/demo:</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">BUILD_NUMBER</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Docker Push'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                script <span class="token punctuation">{</span>
                    <span class="token function">withCredentials</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token function">string</span><span class="token punctuation">(</span>credentialsId<span class="token punctuation">:</span> <span class="token string">'sts'</span><span class="token punctuation">,</span> variable<span class="token punctuation">:</span> <span class="token string">'CREDS'</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token keyword">def</span> creds <span class="token operator">=</span> readJSON text<span class="token punctuation">:</span> CREDS
                        <span class="token function">withEnv</span><span class="token punctuation">(</span><span class="token punctuation">[</span>
                            <span class="token interpolation-string"><span class="token string">"AWS_ACCESS_KEY_ID=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">creds<span class="token punctuation">.</span>aws_access_key_id</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">,</span>
                            <span class="token interpolation-string"><span class="token string">"AWS_SECRET_ACCESS_KEY=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">creds<span class="token punctuation">.</span>aws_secret_access_key</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span><span class="token punctuation">,</span>
                            <span class="token interpolation-string"><span class="token string">"AWS_SESSION_TOKEN=</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">creds<span class="token punctuation">.</span>aws_session_token</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span>
                        <span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                            sh <span class="token string">'''
                            ECR_TOKEN=$(/usr/local/bin/aws ecr get-login-password --region ap-northeast-2)
                            echo "${ECR_TOKEN}" > ecr_token.txt
                            
                            echo "${ECR_TOKEN}" | docker login -u AWS --password-stdin ${DOCKER_REGISTRY}
														'''</span>
                            dockerImage<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Nomad Download'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'curl -C - --output nomad.zip ${NOMAD_DOWNLOAD_URL}'</span>
                sh <span class="token string">'unzip -o nomad.zip'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Deploy To Nomad'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            input<span class="token punctuation">{</span>
                message <span class="token interpolation-string"><span class="token string">"Do you want to proceed for production deployment?"</span></span>
            <span class="token punctuation">}</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'./nomad job run -var image=${DOCKER_REGISTRY}/demo -var tag=${BUILD_NUMBER} -var ecr_token=$(cat ecr_token.txt) ./nomad-docker.hcl'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    post <span class="token punctuation">{</span>
        always <span class="token punctuation">{</span>
            sh <span class="token string">'docker rmi ${DOCKER_REGISTRY}/demo:${BUILD_NUMBER}'</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>지금 빌드</code>를 클릭하여 빌드를 진행합니다. 마지막 단계에서 마우스 오버하여 승인처리합니다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220628190449600.png" alt="image-20220628190449600" tabindex="0" loading="lazy"><figcaption>image-20220628190449600</figcaption></figure>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220628190655610.png" alt="image-20220628190655610" tabindex="0" loading="lazy"><figcaption>image-20220628190655610</figcaption></figure>
</li>
</ol>
</div></template>


