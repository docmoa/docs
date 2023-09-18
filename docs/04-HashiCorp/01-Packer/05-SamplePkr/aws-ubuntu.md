---
description: Packer Sample
tag: ["Packer", "Sample", "aws"]
---

# AWS Packer Sample - Ubuntu

## ubuntu.pkr.hcl

```hcl
# packer init client.pkr.hcl
# packer build -force .

variable "region" {
  default = "ap-northeast-2"
}

variable "cni-version" {
  default = "1.0.1"
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
  ami_name      = "gs_demo_ubuntu_{{timestamp}}"
  instance_type = "t3.micro"
  region        = var.region
  source_ami_filter {
    filters = {
      name                = "ubuntu/images/*ubuntu-bionic-18.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]
  }
  ssh_username = "ubuntu"
}

build {
  sources = ["source.amazon-ebs.example"]

  provisioner "file" {
    source      = "./file/"
    destination = "/tmp"
  }

  provisioner "shell" {
    inline = [
      "set -x",
      "echo Connected via Consul/Nomad client at \"${build.User}@${build.Host}:${build.Port}\"",
      "sudo apt-get update",
      "sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release",
      "sudo apt-get update",
      "curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -",
      "sudo apt-add-repository \"deb [arch=amd64] https://apt.releases.hashicorp.com bionic main\"",
      "sudo apt-get update && sudo apt-get -y install consul nomad netcat nginx",
      "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -",
      "sudo add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable\"",
      "sudo apt-get update",
      "sudo apt-get install -y docker-ce openjdk-11-jdk",
      "curl -sL -o cni-plugins.tgz https://github.com/containernetworking/plugins/releases/download/v${var.cni-version}/cni-plugins-linux-amd64-v${var.cni-version}.tgz",
      "sudo mkdir -p /opt/cni/bin",
      "sudo tar -C /opt/cni/bin -xzf cni-plugins.tgz",
    ]
  }
}
```