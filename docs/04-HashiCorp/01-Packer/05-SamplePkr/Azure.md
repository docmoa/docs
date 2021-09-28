---
meta:
  - name: description
    content: Packer Sample
tags: ["Packer", "Sample", "Azure"]
---

# Azure Packer Sample

## packer.pkr.hcl

- `vault()`는 vault 연동시 사용가능 : <https://www.packer.io/docs/templates/hcl_templates/functions/contextual/vault>

```hcl
# packer init -upgrade .
# packer build -force .

locals {
  client_id = vault("/kv/data/azure", "client_id")
  client_secret = vault("/kv/data/azure", "client_secret")
  tenant_id = vault("/kv/data/azure", "tenant_id")
  subscription_id = vault("/kv/data/azure", "subscription_id")
  resource_group_name = var.resource_name
  virtual_network_name = "kbid-d-krc-vnet-002"
  virtual_network_subnet_name  = "d-mgmt-snet-001"
  virtual_network_resource_group_name  = "kbid-d-krc-mgmt-rg"
  timestamp = formatdate("YYYYMMDD_hhmmss", timeadd(timestamp(), "9h"))
}

variable "placeholder" {
  default     = "placekitten.com"
  description = "Image-as-a-service URL. Some other fun ones to try are fillmurray.com, placecage.com, placebeard.it, loremflickr.com, baconmockup.com, placeimg.com, placebear.com, placeskull.com, stevensegallery.com, placedog.net"
}

# Basic example : https://www.packer.io/docs/builders/azure/arm#basic-example
# MS Guide : https://docs.microsoft.com/ko-kr/azure/virtual-machines/linux/build-image-with-packer
source "azure-arm" "basic-example" {
  client_id = local.client_id
  client_secret = local.client_secret
  subscription_id = local.subscription_id
  tenant_id = local.tenant_id

  # shared_image_gallery {
  #   subscription = local.subscription_id
  #   resource_group = "myrg"
  #   gallery_name = "GalleryName"
  #   image_name = "gs_pkr_${local.timestamp}"
  #   image_version = "1.0.0"
  # }
  managed_image_resource_group_name = local.resource_group_name
  managed_image_name = "${var.image_name}-${local.timestamp}"

  os_type = "Linux"
  # az vm image list-publishers --location koreacentral --output table
  image_publisher = "RedHat"
  # az vm image list-offers --location koreacentral --publisher RedHat --output table
  image_offer = "RHEL"
  # az vm image list-skus --location koreacentral --publisher RedHat --offer RHEL --output table
  image_sku = "8_4"

  azure_tags = {
    dept = "KBHC Terraform POC"
  }
  
  # az vm list-skus --location koreacentral --all --output table
  build_resource_group_name = local.resource_group_name
  virtual_network_name = local.virtual_network_name
  virtual_network_subnet_name = local.virtual_network_subnet_name
  virtual_network_resource_group_name = local.virtual_network_resource_group_name
  # location = "koreacentral"
  vm_size = "Standard_A2_v2"
}

build {
  sources = ["sources.azure-arm.basic-example"]

  provisioner "file" {
    source      = "./files/"
    destination = "/tmp"
  }

# Vault OTP
  provisioner "shell" {
    inline = [
      "sudo cp /tmp/sshd /etc/pam.d/sshd",
      "sudo cp /tmp/sshd_config /etc/ssh/sshd_config",
      "sudo mkdir -p /etc/vault.d",
      "sudo cp /tmp/vault.hcl /etc/vault.d/vault.hcl",
      "sudo cp /tmp/vault-ssh-helper /usr/bin/vault-ssh-helper",
      "echo \"=== Vault_Check ===\"",
      "curl http://10.0.9.10:8200",
      "/usr/bin/vault-ssh-helper -verify-only -config=/etc/vault.d/vault.hcl -dev",
      "echo \"=== Add User ===\"",
      "sudo adduser jboss",
      "echo password | sudo passwd --stdin jboss",
      "echo 'jboss ALL=(ALL) NOPASSWD: ALL' | sudo tee -a /etc/sudoers",
      "echo \"=== SELINUX DISABLE ===\"",
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
      "sudo PLACEHOLDER=${var.placeholder} WIDTH=600 HEIGHT=800 PREFIX=gs /tmp/deploy_app.sh",
      "sudo firewall-cmd --zone=public --permanent --add-port=80/tcp",
      "sudo firewall-cmd --reload",
    ]
  }
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