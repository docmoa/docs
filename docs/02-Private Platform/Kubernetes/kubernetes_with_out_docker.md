---
meta:
  - name: description
    content: "kubernetes_with_out_docker"
tags: ["kubernetes", "docker아님","containerd"]
---


# kubernetes 설치할때 docker 설치 안하고 올리기
- docker가 없어도 k8s를 올릴 수 있다!

```bash
# 먼저 설치하여 환경파일을 가져오고 원하는 버전을 설치한다.
sudo apt-get install containerd -y

sudo mkdir -p /etc/containerd

containerd config default | sudo tee /etc/containerd/config.toml

sudo systemctl stop containerd

curl -LO https://github.com/containerd/containerd/releases/download/v1.4.4/containerd-1.4.4-linux-amd64.tar.gz

tar xvf containerd-1.4.4-linux-amd64.tar.gz

rm containerd-1.4.4-linux-amd64.tar.gz

sudo cp bin/* /usr/bin/

sudo systemctl start containerd

rm -rf bin

sudo systemctl status containerd --lines 1

# k8s 설치시작
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add

sudo apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"

sudo apt-get install kubeadm kubelet kubectl -y

sudo apt-mark hold kubeadm kubelet kubectl containerd

#echo 'net.bridge.bridge-nf-call-iptables = 1' | sudo tee -a /etc/sysctl.conf

SOURCE_FILE="/etc/sysctl.conf"
LINE_INPUT="net.bridge.bridge-nf-call-iptables = 1"

grep -qF "$LINE_INPUT" "$SOURCE_FILE"  || echo "$LINE_INPUT" | sudo tee -a "$SOURCE_FILE"

sudo echo '1' | sudo tee /proc/sys/net/ipv4/ip_forward

cat /proc/sys/net/ipv4/ip_forward

sudo sysctl --system

sudo modprobe overlay
sudo modprobe br_netfilter

sudo swapoff -a

sudo sed -ri '/\sswap\s/s/^#?/#/' /etc/fstab

cat /etc/fstab
```

# 후속작업

```bash
# k8s master server 설정
sudo kubeadm config images pull

IP_ADDR=`hostname -I | awk '{print $1}'`

sudo kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=${IP_ADDR}

mkdir -p $HOME/.kube

sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config

sudo chown $(id -u):$(id -g) $HOME/.kube/config

# cni 설치(weave)
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"

#kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

sudo cp ./crictl.yaml /etc/crictl.yaml

sudo crictl images

watch -n 5 "kubectl get nodes"

```