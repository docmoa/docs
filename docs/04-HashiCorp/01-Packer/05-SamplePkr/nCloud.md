---
description: Packer Sample
tag: ["Packer", "Sample", "NCP"]
---

# Naver Cloud Platform Packer Sample

## packer.pkr.hcl
```hcl
packer {
  required_plugins {
    ncloud = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/ncloud"
    }
  }
}

source "ncloud" "example-linux" {
  access_key                = var.access_key
  secret_key                = var.secret_key
  server_image_product_code = "SPSW0LINUX000139"
  server_product_code       = "SPSVRGPUSSD00001"
  server_image_name         = var.image_name
  server_image_description  = "server image description"
  region                    = "Korea"
  communicator              = "ssh"
  ssh_username              = "root"
}

build {
  sources = ["source.ncloud.example-linux"]

  provisioner "file" {
    source = "jupyter.service"
    destination = "/etc/systemd/system/jupyter.service"
  }

  provisioner "shell" {
    inline = [
      "yum clean all",
      "yum -y install epel-release",
      "yum -y install python3",
      "yum -y install python-pip",
      "pip3 install --upgrade pip",
      "adduser jupyter",
      "su - jupyter",
      "pip3 install --user jupyter jupyter",
      "systemctl enable jupyter",
      "systemctl start jupyter"
    ]
  }
}

variable "access_key" {
  type    = string
}

variable "secret_key" {
  type    = string
}

variable "image_name" {
  type    = string
  default = "test"
}
```