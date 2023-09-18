---
description: Vagrant로 다양한 Linux 구성
tag: ["vagrant", "virtualbox", "linux"]
---

# 다양한 Linux 생성 샘플

```ruby
# -*- mode: ruby -*-
# vi: set ft=ruby :

# base image : https://app.vagrantup.com/bento
# Cluster IP have to set subnetting on private network subnet of VM

$debianip = 50
$centip = 60
$suseip = 70

debian_cluster = {
  "ubuntu" => { :image => "bento/ubuntu-18.04"}
}
cent_cluster = {
  "centos" => { :image => "centos/7"},
  "rocky" => { :image => "rockylinux/8"},
}
suse_cluster =  {
  "suse" => { :image => "opensuse/Tumbleweed.x86_64" }
}

Vagrant.configure("2") do |config|

  config.vm.synced_folder '.', '/vagrant', disabled: true

  debian_cluster.each_with_index do |(hostname, info), i|
    config.vm.define hostname do |server|
      server.vm.box = info[:image]
      server.vm.hostname = hostname
      server.vm.network "private_network", name: "vboxnet1", ip: "172.28.128.#{i + $debianip}"

      server.vm.provider "virtualbox" do |v|
        v.name = hostname
        v.gui = false
        v.memory = 1024
        v.cpus = 1

        v.customize ["modifyvm", :id, "--vram", "9"]
      end # end provider
    end # end config
  end # end cluster foreach

  suse_cluster.each_with_index do |(hostname, info), i|
    config.vm.define hostname do |server|
      server.vm.box = info[:image]
      server.vm.hostname = hostname
      server.vm.network "private_network", name: "vboxnet1", ip: "172.28.128.#{i + $suseip}"
      server.vm.provider "virtualbox" do |v|
        v.name = hostname
        v.gui = false
        v.memory = 1024
        v.cpus = 1

        v.customize ["modifyvm", :id, "--vram", "9"]
      end # end provider
    end # end config
  end # end cluster foreach

  cent_cluster.each_with_index do |(hostname, info), i|
    config.vm.define hostname do |server|
      server.vm.box = info[:image]
      server.vm.hostname = hostname
      server.vm.network "private_network", name: "vboxnet1", ip: "172.28.128.#{i + $centip}"

      server.vm.provider "virtualbox" do |v|
        v.name = hostname
        v.gui = false
        v.memory = 1024
        v.cpus = 1

        v.customize ["modifyvm", :id, "--vram", "9"]
      end # end provider
    end # end config
  end # end cluster foreach
  
end

```