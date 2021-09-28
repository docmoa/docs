---
meta:
  - name: description
    content: Packer Sample
tags: ["Packer", "Sample", "Alibaba"]
---

# Alibaba Cloud Packer Sample

## packer.pkr.hcl

- `vault()`는 vault 연동시 사용가능 : <https://www.packer.io/docs/templates/hcl_templates/functions/contextual/vault>

```hcl
# packer build -force .

locals {
  access_key = vault("/kv-v2/data/alicloud", "access_key")
  secret_key = vault("/kv-v2/data/alicloud", "secret_key")
}

variable "region" {
  default     = "ap-southeast-1"
  description = "https://www.alibabacloud.com/help/doc-detail/40654.htm"
}

source "alicloud-ecs" "basic-example" {
  access_key           = local.access_key
  secret_key           = local.secret_key
  region               = var.region
  image_name           = "ssh_otp_image_1_5"
  source_image         = "centos_7_9_x64_20G_alibase_20210623.vhd"
  ssh_username         = "root"
  instance_type        = "ecs.n1.tiny"
  io_optimized         = true
  internet_charge_type = "PayByTraffic"
  image_force_delete   = true
}

build {
  sources = ["sources.alicloud-ecs.basic-example"]

  provisioner "file" {
    source      = "./files/"
    destination = "/tmp"
  }

# Vault OTP
  provisioner "shell" {
    inline = [
      "cp /tmp/sshd /etc/pam.d/sshd",
      "cp /tmp/sshd_config /etc/ssh/sshd_config",
      "mkdir -p /etc/vault.d",
      "cp /tmp/vault.hcl /etc/vault.d/vault.hcl",
      "cp /tmp/vault-ssh-helper /usr/bin/vault-ssh-helper",
      "/usr/bin/vault-ssh-helper -verify-only -config=/etc/vault.d/vault.hcl -dev",
      "sudo adduser test",
      "echo password | passwd --stdin test",
      "echo 'test ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers",
      "sudo sed -ie 's/SELINUX=enforcing/SELINUX=disabled /g' /etc/selinux/config"
    ]
  }

# Apache
  provisioner "shell" {
    inline = [
      "sudo yum -y update",
      "sleep 15",
      "sudo yum -y update",
      "sudo yum -y install httpd",
      "sudo systemctl enable httpd",
      "sudo systemctl start httpd",
      "chmod +x /tmp/deploy_app.sh",
      "PLACEHOLDER=${var.placeholder} WIDTH=600 HEIGHT=800 PREFIX=gs /tmp/deploy_app.sh",
      # "sudo firewall-cmd --zone=public --permanent --add-port=80/tcp",
      # "sudo firewall-cmd --reload",
    ]
  }
}

variable "placeholder" {
  default     = "placekitten.com"
  description = "Image-as-a-service URL. Some other fun ones to try are fillmurray.com, placecage.com, placebeard.it, loremflickr.com, baconmockup.com, placeimg.com, placebear.com, placeskull.com, stevensegallery.com, placedog.net"
}
```

## deploy_app.sh (option)
```bash
#!/bin/bash
# Script to deploy a very simple web application.
# The web app has a customizable image and some text.

cat << EOM > /var/www/html/index.html
<html>
  <head><title>Meow!</title></head>
  <body>
  <div style="width:800px;margin: 0 auto">

  <!-- BEGIN -->
  <center><img src="http://${PLACEHOLDER}/${WIDTH}/${HEIGHT}"></img></center>
  <center><h2>Meow World!</h2></center>
  Welcome to ${PREFIX}'s app. Replace this text with your own.
  <!-- END -->

  </div>
  </body>
</html>
EOM

echo "Script complete."
```