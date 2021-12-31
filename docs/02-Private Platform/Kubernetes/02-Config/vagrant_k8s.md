---
meta:
  - name: description
    content: "vagrant로 시작하는 Kubernetes"
tags: ["kubernetes", "vagrant","docker", "install"]
---

# Kubernetes, Vagrant로 로컬 환경 구성

> github : <https://github.com/Great-Stone/vagrant-k8s>

- Virtualbox를 활용하여 로컬 환경에서 Kubernetes(K8s) 환경을 쉽게 만들고 부실수(?) 있는 환경을 구성하기위해 Vagrant를 활용
- Intel Mac (Catalina / Big Sur)에서는 테스트
- Windows는 테스트 필요

## 실행 전 필요 소프트웨어
- Virtualbox : <https://www.virtualbox.org>
- Vagrant : <https://www.vagrantup.com>

## Virtualbox 네트워크 구성
- K8s vm이 사용하기 위한 네트워크를 추가하여 구성
- 기존 네트워크를 사용하고 싶다면 `vagrantfile`의 `*.vm.network` 부분의 `ip`에 수정 필요
  - `vagrantfile` 구성시 해당 `ip` 설정 부분을 상단의 `NETWORK_SUB` 부분에 정의함
  - 네트워크 구성 설정에 따라 클러스터 간 통신이 안될 수 있음에 주의
  - `vagrantfile`의 `START_IP`를 활용하여 마스터 노드 및 워커 노드의 ip를 부여하는 방식으로 구성되었으나 변경 가능

## 구성 설명

### 디렉토리/파일 구조

#### 실행 전
::: vue
.
├── `1.18`
│   ├── files
│   │   └── `pv.yaml`
│   ├── scripts
│   │   ├── `kube.sh`
│   │   └── `pv.sh`
│   └── `vagrantfile`
├── 1.19
<반복>
:::
- 버전별로 디렉토리가 분류되어있음
  - 1.18~1.20 은 ubuntu 18.04 LTS 기반
  - 1.21~1.23 은 utuntu 20.04 LTS 기반
- vagrantfile
  - vagrant 실행 정의
  - version2 사용
- kube.sh
  - `vagrantfile`에서 provision으로 호출
  - K8s 설치에 필요한 패키지 설치 및 실행
- pv.sh, pv.yaml
  - `vagrantfile`에서 provision으로 호출
  - pv.sh는 K8s master 노드 구성 후 디렉토리 생성 후 pv.yaml을 통해 pv 구성

#### 실행 후
::: vue
├── 1.18
│   ├── `.kube`
│   ├── `.vagrant`
│   ├── files
│   │   └── pv.yaml
│   ├── `join.sh`
│   ├── `k8s-pv`
│   │   ├── pv01
│   │   ├── pv02
│   │   └── pv03
│   ├── scripts
│   │   ├── kube.sh
│   │   └── pv.sh
│   └── vagrantfile
├── 1.19
<반복>
:::
- .kube 디렉토리 : kubernetes credential 및 접속 정보 생성
- .vagrant 디렉토리 : vagrant 실행 후 vm 정보 업데이트
- join.sh : 워커노드의 클러스터 조인을 위한 스크립트
- k8s-pv 디렉토리 : pv를 위한 디렉토리 구성

### vagrantfile - variable

```hcl
IMAGE_NAME = "bento/ubuntu-20.04"

K8S_MINOR_VERSION = "21"
NETWORK_SUB = "192.168.60."
START_IP = 130
POD_CIDR = "10.#{K8S_MINOR_VERSION}.0.0/16"

cluster = {
  "master" => { :cpus => 2, :mem => 2048 },
  "node" => { :cpus => 1, :mem => 1024 }
}

NODE_COUNT = 1

VM_GROUP_NAME = "k8s-1.#{K8S_MINOR_VERSION}"
DOCKER_VER = "5:20.10.12~3-0~ubuntu-focal"
KUBE_VER = "1.#{K8S_MINOR_VERSION}.8-00"
```

|Variable name|value|
|-|-|
|IMAGE_NAME|vagrant에서 사용할 기본 이미지로 vagrant cloud 참조|
|K8S_MINOR_VERSION|K8s 설치의 마이너 버전 지정|
|NETWORK_SUB|Virtualbox network ip|
|START_IP|각 K8s 클러스터의 master에 할당되며 워커노드는 +1 씩 증가|
|POD_CIDR|kubeadm init 의 --pod-network-cidr 에 지정되는 CIDR|
|cluster={}|클러스터 리소스를 정의한 오브젝트 형태의 변수|
|NODE_COUNT|워커 노드 개수|
|VM_GROUP_NAME|Virtualbox에 등록될 그룹 이름|
|DOCKER_VER|docker-ce 버전|
|KUBE_VER|K8s 관련 패키지 버전|

### vagrantfile - vm

```hcl
Vagrant.configure("2") do |config|
  config.vm.box = IMAGE_NAME

  config.vm.define "master", primary: true do |master|
    master.vm.box = IMAGE_NAME
    master.vm.network "private_network", ip: "#{NETWORK_SUB}#{START_IP}"
    master.vm.hostname = "master"
    master.vm.provision "kube", type: "shell", privileged: true, path: "scripts/kube.sh", env: {
      "docker_ver" => "#{DOCKER_VER}",
      "k8s_ver" => "#{KUBE_VER}"
    }
    master.vm.provision "0", type: "shell", preserve_order: true, privileged: true, inline: <<-SHELL
      OUTPUT_FILE=/vagrant/join.sh
      rm -rf /vagrant/join.sh
      rm -rf /vagrant/.kube
      sudo kubeadm init --apiserver-advertise-address=#{NETWORK_SUB}#{START_IP} --pod-network-cidr=#{POD_CIDR}
      sudo kubeadm token create --print-join-command > /vagrant/join.sh
      chmod +x $OUTPUT_FILE
      mkdir -p $HOME/.kube
      sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
      sudo chown $(id -u):$(id -g) $HOME/.kube/config
      cp -R $HOME/.kube /vagrant/.kube
      #kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
      kubectl apply -f https://docs.projectcalico.org/manifests/calico.yaml
      kubectl completion bash >/etc/bash_completion.d/kubect
      echo 'alias k=kubectl' >>~/.bashrc
    SHELL

    master.vm.provision "file", preserve_order: true, source: "files", destination: "/tmp"
    master.vm.provision "3", type: "shell", preserve_order: true, privileged: true, path: "scripts/pv.sh"

    master.vm.provider "virtualbox" do |v|
      <생략>
    end # end provider
  end

  (1..NODE_COUNT).each do |i|
    config.vm.define "node-#{i}" do |node|
      node.vm.box = IMAGE_NAME
      node.vm.network "private_network", ip: "#{NETWORK_SUB}#{i + START_IP}"
      node.vm.hostname = "node-#{i}"
        <생략>

      node.vm.provider "virtualbox" do |v|
        <생략>
      end # end provider
    end
  end
end
```

- vm 생성을 위한 정의는 크게 `master`와 `node-#`로 구분됨
- master
  - `master`의 경우 1개만을 생성하도록 지정
  - `*.vm.provision`을 통해 스크립트를 실행하거나 파일을 복사하여 프로비저닝
  - `master.vm.provision "0"`에서 `kubeconfig`파일과 워커노드 조인을 위한 토큰 커맨드를 `join.sh`파일로 생성
- node-#
  - 변수 `NODE_COUNT` 에서 지정된 개수에 따라 반복 수행
  - 앞서 `master` 프로비저닝시 생성된 `join.sh`를 이용하여 클러스터에 조인

## 실행 및 확인

### vagrant cli

> cli doc : <https://www.vagrantup.com/docs/cli>

- vagrant up : 프로비저닝을 실행하며, 이미 프로비저닝 된 경우 다시 프로비저닝하지 않고 vm만 기동
- vagrant up `vm-name` : `config.vm.define` 에 선언된 아이디에 해당하는 vm만 기동
  - e.g. : vagrant up master
- vagrant halt : vm 정지
- vagrant halt `vm-name` : `config.vm.define` 에 선언된 아이디에 해당하는 vm만 정지
  - e.g. : vagrant halt node-1
- vagrant status : vm 상태 확인
- vagrant ssh `vm-name` : `config.vm.define` 에 선언된 아이디에 해당하는 vm에 ssh 접속
  - e.g. : vagrant ssh master
- vagrant destroy : 프로비저닝된 vm 삭제

### Check kubeconfig

`master`노드 프로비저닝 과정에서 `.kube/config`를 생성하므로, 해당 kubeconfig를 사용하여 호스트 환경에서 `kubectl` 사용 가능

```bash
~/vagrant-k8s/1.23> kubectl --kubeconfig=./.kube/config get nodes
NAME     STATUS   ROLES                  AGE   VERSION
master   Ready    control-plane,master   68m   v1.23.1
node-1   Ready    <none>                 63m   v1.23.1
node-2   Ready    <none>                 59m   v1.23.1
node-3   Ready    <none>                 54m   v1.23.1
```

### 패키지 버전 확인 방법

```bash
#apt-cache policy <packagename>
apt-cache policy kubelet | grep 1.2
  Candidate: 1.23.1-00
     1.23.1-00 500
     1.23.0-00 500
     1.22.5-00 500
     1.22.4-00 500
     1.22.3-00 500
     1.22.2-00 500
     1.22.1-00 500
     1.22.0-00 500
     1.21.8-00 500
     1.21.7-00 500
     ...
```