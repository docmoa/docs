---
description: Vault를 활용하여 Windows Password 저장
tag: ["vault", "windows", "nomad", "password"]
---

# Windows Password rotation
> <https://scarolan.github.io/painless-password-rotation/#37>

Kv 추가

```bash
$ vault secrets enable -version=2 -path=systemcreds/ kv
```





권한 추가

```bash
$ vault policy write rotate-windows - << EOF
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
EOF

$ vault policy write windowsadmin - << EOF
# Allows admins to read passwords.
path "systemcreds/*" {
  capabilities = ["list"]
}
path "systemcreds/data/windows/*" {
  capabilities = ["list", "read"]
}
EOF
```



토큰

```bash
$ vault token create -policy=rotate-windows -period=600h
```



사용자

```bash
$ vault auth enable userpass 
$ vault write auth/userpass/users/pwadmin password=password policies=windowsadmin
```



PowerShell e.g.

```powershell
$VAULT_ADDR = $env:USERNAME
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

# Fetch a new passphrase from Vault. Adjust the options to fit your requirements.
#$NEWPASS = (Invoke-RestMethod -Headers @{"X-Vault-Token" = ${VAULT_TOKEN}} -Method POST -Body "{`"words`":`"4`",`"separator`":`"-`"}" -Uri ${VAULT_ADDR}/v1/gen/passphrase).data.value

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
```

 

Job e.g.

```ruby
job "pw-update" {
  datacenters = ["hashistack"]
  type        = "batch"

  constraint {
    attribute = "${meta.target}"
    value     = "windows2016"
  }

  periodic {
    cron             = "0 */5 * * * * *"
    prohibit_overlap = true
    time_zone        = "Asia/Seoul"
  }

  group "pw-update" {
    count = 1
    task "powershell" {
      driver = "raw_exec"
      config {
        command = "powershell.exe"
        args = ["-noprofile", "-executionpolicy", "bypass", "-file", "local/pw-rotate.ps1"]
      }
      env {
        VAULT_TOKEN = "s.EZFCRJhNmjSc9U5b4EX5gwyy"
        VAULT_ADDR = "http://172.28.128.21:8200"
        USERNAME = "testuser"
      }
      template {
data = <<EOF
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
EOF
        destination = "local/pw-rotate.ps1"
      }
    }
  }
}



```

