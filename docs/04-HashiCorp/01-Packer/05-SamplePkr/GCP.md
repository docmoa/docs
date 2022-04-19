---
meta:
  - name: description
    content: Packer Sample
tags: ["Packer", "Sample", "GCP"]
---

# Google Cloud Platform Packer Sample

## packer.pkr.hcl
```hcl
variable "base_image" {
  default = "ubuntu-1804-bionic-v20210415"
}
variable "project" {
  default = "gs-test-282101"
}
variable "region" {
  default = "asia-northeast2"
}
variable "zone" {
  default = "asia-northeast2-a"
}
variable "image_name" {
  
}
variable "placeholder" {
  default     = "placekitten.com"
  description = "Image-as-a-service URL. Some other fun ones to try are fillmurray.com, placecage.com, placebeard.it, loremflickr.com, baconmockup.com, placeimg.com, placebear.com, placeskull.com, stevensegallery.com, placedog.net"
}

source "googlecompute" "basic-example" {
  project_id = var.project
  source_image = var.base_image
  ssh_username = "ubuntu"
  zone = var.zone
  disk_size = 10
  disk_type = "pd-ssd"
  image_name = var.image_name
}

build {
  name = "packer"
  source "sources.googlecompute.basic-example" {
      name = "packer"
  }

  provisioner "file"{
    source = "./files"
    destination = "/tmp/"
  }

  provisioner "shell" {
    inline = [
      "sudo apt-get -y update",
      "sleep 15",
      "sudo apt-get -y update",
      "sudo apt-get -y install apache2",
      "sudo systemctl enable apache2",
      "sudo systemctl start apache2",
      "sudo chown -R ubuntu:ubuntu /var/www/html",
      "chmod +x /tmp/files/*.sh",
      "PLACEHOLDER=${var.placeholder} WIDTH=600 HEIGHT=800 PREFIX=gs /tmp/files/deploy_app.sh",
    ]
  }
}
```