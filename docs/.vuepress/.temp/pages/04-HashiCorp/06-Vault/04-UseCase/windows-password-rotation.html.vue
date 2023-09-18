<template><div><h1 id="windows-password-rotation" tabindex="-1"><a class="header-anchor" href="#windows-password-rotation" aria-hidden="true">#</a> Windows Password rotation</h1>
<blockquote>
<p><a href="https://scarolan.github.io/painless-password-rotation/#37" target="_blank" rel="noopener noreferrer">https://scarolan.github.io/painless-password-rotation/#37<ExternalLinkIcon/></a></p>
</blockquote>
<p>Kv 추가</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-version</span><span class="token operator">=</span><span class="token number">2</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>systemcreds/ kv
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>권한 추가</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault policy <span class="token function">write</span> rotate-windows - <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
# Allows hosts to write new passwords
path "systemcreds/data/windows/*" {
  capabilities = ["create", "update"]
}
# Allow hosts to generate new passphrases
path "gen/passphrase" {
  capabilities = ["update"]
}
# Allow hosts to generate new passwords
path "gen/password" {
  capabilities = ["update"]
}
EOF</span>

$ vault policy <span class="token function">write</span> windowsadmin - <span class="token operator">&lt;&lt;</span> <span class="token string">EOF
# Allows admins to read passwords.
path "systemcreds/*" {
  capabilities = ["list"]
}
path "systemcreds/data/windows/*" {
  capabilities = ["list", "read"]
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>토큰</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token create <span class="token parameter variable">-policy</span><span class="token operator">=</span>rotate-windows <span class="token parameter variable">-period</span><span class="token operator">=</span>600h
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>사용자</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault auth <span class="token builtin class-name">enable</span> userpass 
$ vault <span class="token function">write</span> auth/userpass/users/pwadmin <span class="token assign-left variable">password</span><span class="token operator">=</span>password <span class="token assign-left variable">policies</span><span class="token operator">=</span>windowsadmin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>PowerShell e.g.</p>
<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre v-pre class="language-powershell"><code><span class="token variable">$VAULT_ADDR</span> = <span class="token variable">$env</span>:USERNAME
<span class="token comment"># Make sure the user exists on the local system.</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">-not</span> <span class="token punctuation">(</span><span class="token function">Get-LocalUser</span> <span class="token variable">$USERNAME</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">throw</span> <span class="token string">'$USERNAME does not exist!'</span>
<span class="token punctuation">}</span>

<span class="token comment"># Use TLS</span>
<span class="token comment"># [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12</span>

<span class="token comment"># Import some environment variables.</span>
<span class="token variable">$VAULT_ADDR</span> = <span class="token variable">$env</span>:VAULT_ADDR
<span class="token variable">$VAULT_TOKEN</span> = <span class="token variable">$env</span>:VAULT_TOKEN
<span class="token variable">$HOSTNAME</span> = <span class="token variable">$env</span>:computername

<span class="token comment"># Renew our token before we do anything else.</span>
<span class="token function">Invoke-RestMethod</span> <span class="token operator">-</span>Headers @<span class="token punctuation">{</span><span class="token string">"X-Vault-Token"</span> = $<span class="token punctuation">{</span>VAULT_TOKEN<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token operator">-</span>Method POST <span class="token operator">-</span>Uri $<span class="token punctuation">{</span>VAULT_ADDR<span class="token punctuation">}</span><span class="token operator">/</span>v1/auth/token/renew-self
<span class="token keyword">if</span><span class="token punctuation">(</span><span class="token operator">-Not</span> $?<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
   <span class="token function">Write-Output</span> <span class="token string">"Error renewing Vault token lease."</span>
<span class="token punctuation">}</span>

<span class="token comment"># Fetch a new passphrase from Vault. Adjust the options to fit your requirements.</span>
<span class="token comment">#$NEWPASS = (Invoke-RestMethod -Headers @{"X-Vault-Token" = ${VAULT_TOKEN}} -Method POST -Body "{`"words`":`"4`",`"separator`":`"-`"}" -Uri ${VAULT_ADDR}/v1/gen/passphrase).data.value</span>

<span class="token comment"># Fetch a new password from Vault. Adjust the options to fit your requirements.</span>
<span class="token variable">$NEWPASS</span> = c:\hashicorp\nomad\nomad operator keygen

<span class="token comment"># Convert into a SecureString</span>
<span class="token variable">$SECUREPASS</span> = <span class="token function">ConvertTo-SecureString</span> <span class="token variable">$NEWPASS</span> <span class="token operator">-</span>AsPlainText <span class="token operator">-</span>Force

<span class="token comment"># Create the JSON payload to write to Vault's K/V store. Keep the last 12 versions of this credential.</span>
<span class="token variable">$JSON</span>=<span class="token string">"{ `"options`": { `"max_versions`": 12 }, `"data`": { `"<span class="token variable">$USERNAME</span>`": `"<span class="token variable">$NEWPASS</span>`" } }"</span>

<span class="token comment"># First commit the new password to vault, then change it locally.</span>
<span class="token function">Invoke-RestMethod</span> <span class="token operator">-</span>Headers @<span class="token punctuation">{</span><span class="token string">"X-Vault-Token"</span> = $<span class="token punctuation">{</span>VAULT_TOKEN<span class="token punctuation">}</span><span class="token punctuation">}</span> <span class="token operator">-</span>Method POST <span class="token operator">-</span>Body <span class="token variable">$JSON</span> <span class="token operator">-</span>Uri $<span class="token punctuation">{</span>VAULT_ADDR<span class="token punctuation">}</span><span class="token operator">/</span>v1/systemcreds/<span class="token keyword">data</span><span class="token operator">/</span>windows/$<span class="token punctuation">{</span>HOSTNAME<span class="token punctuation">}</span><span class="token operator">/</span>$<span class="token punctuation">{</span>USERNAME<span class="token punctuation">}</span>_creds
<span class="token keyword">if</span><span class="token punctuation">(</span>$?<span class="token punctuation">)</span> <span class="token punctuation">{</span>
   <span class="token function">Write-Output</span> <span class="token string">"Vault updated with new password."</span>
   <span class="token variable">$UserAccount</span> = <span class="token function">Get-LocalUser</span> <span class="token operator">-</span>name <span class="token variable">$USERNAME</span>
   <span class="token variable">$UserAccount</span> <span class="token punctuation">|</span> <span class="token function">Set-LocalUser</span> <span class="token operator">-</span>Password <span class="token variable">$SECUREPASS</span>
   <span class="token keyword">if</span><span class="token punctuation">(</span>$?<span class="token punctuation">)</span> <span class="token punctuation">{</span>
       <span class="token function">Write-Output</span> <span class="token string">"${USERNAME}'s password was stored in Vault and updated locally."</span>
   <span class="token punctuation">}</span>
   <span class="token keyword">else</span> <span class="token punctuation">{</span>
       <span class="token function">Write-Output</span> <span class="token string">"Error: ${USERNAME}'s password was stored in Vault but *not* updated locally."</span>
   <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">else</span> <span class="token punctuation">{</span>
    <span class="token function">Write-Output</span> <span class="token string">"Error saving new password to Vault. Local password will remain unchanged."</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Job e.g.</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"pw-update"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"hashistack"</span></span><span class="token punctuation">]</span>
  type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"batch"</span></span>

  constraint <span class="token punctuation">{</span>
    attribute <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${meta.target}"</span></span>
    value     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"windows2016"</span></span>
  <span class="token punctuation">}</span>

  periodic <span class="token punctuation">{</span>
    cron             <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"0 */5 * * * * *"</span></span>
    prohibit_overlap <span class="token operator">=</span> <span class="token boolean">true</span>
    time_zone        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Asia/Seoul"</span></span>
  <span class="token punctuation">}</span>

  group <span class="token string-literal"><span class="token string">"pw-update"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>
    task <span class="token string-literal"><span class="token string">"powershell"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"raw_exec"</span></span>
      config <span class="token punctuation">{</span>
        command <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"powershell.exe"</span></span>
        args <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"-noprofile"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"-executionpolicy"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"bypass"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"-file"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"local/pw-rotate.ps1"</span></span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      env <span class="token punctuation">{</span>
        <span class="token constant">VAULT_TOKEN</span> <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"s.EZFCRJhNmjSc9U5b4EX5gwyy"</span></span>
        <span class="token constant">VAULT_ADDR</span> <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"http://172.28.128.21:8200"</span></span>
        <span class="token constant">USERNAME</span> <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"testuser"</span></span>
      <span class="token punctuation">}</span>
      template <span class="token punctuation">{</span>
data <span class="token operator">=</span> <span class="token string-literal heredoc-string"><span class="token delimiter"><span class="token punctuation">&lt;&lt;</span><span class="token symbol">EOF</span></span><span class="token string">
$USERNAME = $env:USERNAME
# Make sure the user exists on the local system.
if (-not (Get-LocalUser $USERNAME)) {
    throw '$USERNAME does not exist!'
}

# Use TLS
# [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Import some environment variables.
$VAULT_ADDR = $env:VAULT_ADDR
$VAULT_TOKEN = $env:VAULT_TOKEN
$HOSTNAME = $env:computername

# Renew our token before we do anything else.
Invoke-RestMethod -Headers @{"X-Vault-Token" = ${VAULT_TOKEN}} -Method POST -Uri ${VAULT_ADDR}/v1/auth/token/renew-self
if(-Not $?)
{
   Write-Output "Error renewing Vault token lease."
}

# Fetch a new password from Vault. Adjust the options to fit your requirements.
$NEWPASS = c:\hashicorp\nomad\nomad operator keygen

# Convert into a SecureString
$SECUREPASS = ConvertTo-SecureString $NEWPASS -AsPlainText -Force

# Create the JSON payload to write to Vault's K/V store. Keep the last 12 versions of this credential.
$JSON="{ `"options`": { `"max_versions`": 12 }, `"data`": { `"$USERNAME`": `"$NEWPASS`" } }"

# First commit the new password to vault, then change it locally.
Invoke-RestMethod -Headers @{"X-Vault-Token" = ${VAULT_TOKEN}} -Method POST -Body $JSON -Uri ${VAULT_ADDR}/v1/systemcreds/data/windows/${HOSTNAME}/${USERNAME}_creds
if($?) {
   Write-Output "Vault updated with new password."
   $UserAccount = Get-LocalUser -name $USERNAME
   $UserAccount | Set-LocalUser -Password $SECUREPASS
   if($?) {
       Write-Output "${USERNAME}'s password was stored in Vault and updated locally."
   }
   else {
       Write-Output "Error: ${USERNAME}'s password was stored in Vault but *not* updated locally."
   }
}
else {
    Write-Output "Error saving new password to Vault. Local password will remain unchanged."
}
</span><span class="token delimiter"><span class="token symbol">EOF</span></span></span>
        destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"local/pw-rotate.ps1"</span></span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>



</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


