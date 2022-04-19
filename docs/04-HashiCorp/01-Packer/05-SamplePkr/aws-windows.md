---
meta:
  - name: description
    content: Packer Sample
tags: ["Packer", "Sample", "aws"]
---

# AWS Packer Sample - Windows

> 참고 : [Build a Windows Image](https://learn.hashicorp.com/tutorials/packer/aws-windows-image?in=packer/integrations)

## windows.pkr.hcl

```hcl
variable "region" {
  default = "ap-northeast-2"
}

variable "cni-version" {
  default = "1.0.1"
}

locals {
  nomad_url  = "https://releases.hashicorp.com/nomad/1.2.3/nomad_1.2.3_windows_amd64.zip"
  consul_url = "https://releases.hashicorp.com/consul/1.11.1/consul_1.11.1_windows_amd64.zip"
  jre_url    = "https://github.com/adoptium/temurin11-binaries/releases/download/jdk-11.0.13%2B8/OpenJDK11U-jre_x64_windows_hotspot_11.0.13_8.zip"
}

packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "example" {
  ami_name      = "gs_demo_windows_{{timestamp}}"
  communicator  = "winrm"
  instance_type = "t2.micro"
  region        = var.region
  source_ami_filter {
    filters = {
      name                = "*Windows_Server-2019-English-Full-Base*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }
  user_data_file = "./bootstrap_win.txt"
  winrm_password = "SuperS3cr3t!!!!"
  winrm_username = "Administrator"
}

build {
  sources = ["source.amazon-ebs.example"]

  provisioner "powershell" {
    inline = [
      "New-Item \"C:\\temp\" -ItemType Directory",
    ]
  }

  // provisioner "file" {
  //   source = "./file/"
  //   destination = "/tmp"
  // }

  provisioner "powershell" {
    inline = [
      "New-Item \"C:\\hashicorp\\jre\\\" -ItemType Directory",
      "New-Item \"C:\\hashicorp\\consul\\bin\\\" -ItemType Directory",
      "New-Item \"C:\\hashicorp\\consul\\data\\\" -ItemType Directory",
      "New-Item \"C:\\hashicorp\\consul\\conf\\\" -ItemType Directory",
      "New-Item \"C:\\hashicorp\\nomad\\bin\\\" -ItemType Directory",
      "New-Item \"C:\\hashicorp\\nomad\\data\\\" -ItemType Directory",
      "New-Item \"C:\\hashicorp\\nomad\\conf\\\" -ItemType Directory",
      "Invoke-WebRequest -Uri ${local.jre_url} -OutFile $env:TEMP\\jre.zip",
      "Invoke-WebRequest -Uri ${local.consul_url} -OutFile $env:TEMP\\consul.zip",
      "Invoke-WebRequest -Uri ${local.nomad_url} -OutFile $env:TEMP\\nomad.zip",
      "Expand-Archive $env:TEMP\\jre.zip -DestinationPath C:\\hashicorp\\jre\\",
      "Expand-Archive $env:TEMP\\consul.zip -DestinationPath C:\\hashicorp\\consul\\bin\\",
      "Expand-Archive $env:TEMP\\nomad.zip -DestinationPath C:\\hashicorp\\nomad\\bin\\",
      "[Environment]::SetEnvironmentVariable(\"Path\", $env:Path + \";C:\\hashicorp\\jre\\jdk-11.0.13+8-jre\\bin;C:\\hashicorp\\nomad\\bin;C:\\hashicorp\\consul\\bin\", \"Machine\")",
      // "$old = (Get-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Control\\Session Manager\\Environment' -Name path).path",
      // "$new = \"$old;C:\\hashicorp\\jre\\jdk-11.0.13+8-jre\\bin;C:\\hashicorp\\nomad\\bin;C:\\hashicorp\\consul\\bin\"",
      // "Set-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Control\\Session Manager\\Environment' -Name path -Value $new",
    ]
  }
}
```

## bootstrap_win.txt

```powershell
<powershell>
# Set administrator password
net user Administrator SuperS3cr3t!!!!
wmic useraccount where "name='Administrator'" set PasswordExpires=FALSE

# First, make sure WinRM can't be connected to
netsh advfirewall firewall set rule name="Windows Remote Management (HTTP-In)" new enable=yes action=block

# Delete any existing WinRM listeners
winrm delete winrm/config/listener?Address=*+Transport=HTTP  2>$Null
winrm delete winrm/config/listener?Address=*+Transport=HTTPS 2>$Null

# Disable group policies which block basic authentication and unencrypted login

Set-ItemProperty -Path HKLM:\Software\Policies\Microsoft\Windows\WinRM\Client -Name AllowBasic -Value 1
Set-ItemProperty -Path HKLM:\Software\Policies\Microsoft\Windows\WinRM\Client -Name AllowUnencryptedTraffic -Value 1
Set-ItemProperty -Path HKLM:\Software\Policies\Microsoft\Windows\WinRM\Service -Name AllowBasic -Value 1
Set-ItemProperty -Path HKLM:\Software\Policies\Microsoft\Windows\WinRM\Service -Name AllowUnencryptedTraffic -Value 1


# Create a new WinRM listener and configure
winrm create winrm/config/listener?Address=*+Transport=HTTP
winrm set winrm/config/winrs '@{MaxMemoryPerShellMB="0"}'
winrm set winrm/config '@{MaxTimeoutms="7200000"}'
winrm set winrm/config/service '@{AllowUnencrypted="true"}'
winrm set winrm/config/service '@{MaxConcurrentOperationsPerUser="12000"}'
winrm set winrm/config/service/auth '@{Basic="true"}'
winrm set winrm/config/client/auth '@{Basic="true"}'

# Configure UAC to allow privilege elevation in remote shells
$Key = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System'
$Setting = 'LocalAccountTokenFilterPolicy'
Set-ItemProperty -Path $Key -Name $Setting -Value 1 -Force

# Configure and restart the WinRM Service; Enable the required firewall exception
Stop-Service -Name WinRM
Set-Service -Name WinRM -StartupType Automatic
netsh advfirewall firewall set rule name="Windows Remote Management (HTTP-In)" new action=allow localip=any remoteip=any
Start-Service -Name WinRM
</powershell>
```