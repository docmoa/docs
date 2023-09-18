<template><div><h1 id="containerd를-런타임으로-사용한-kubernetes-설치" tabindex="-1"><a class="header-anchor" href="#containerd를-런타임으로-사용한-kubernetes-설치" aria-hidden="true">#</a> containerd를 런타임으로 사용한 Kubernetes 설치</h1>
<ul>
<li>docker가 없어도 k8s를 올릴 수 있다!</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 먼저 설치하여 환경파일을 가져오고 원하는 버전을 설치한다.</span>
<span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> containerd <span class="token parameter variable">-y</span>

<span class="token function">sudo</span> <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/containerd

containerd config default <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">tee</span> /etc/containerd/config.toml

<span class="token function">sudo</span> systemctl stop containerd

<span class="token function">curl</span> <span class="token parameter variable">-LO</span> https://github.com/containerd/containerd/releases/download/v1.4.4/containerd-1.4.4-linux-amd64.tar.gz

<span class="token function">tar</span> xvf containerd-1.4.4-linux-amd64.tar.gz

<span class="token function">rm</span> containerd-1.4.4-linux-amd64.tar.gz

<span class="token function">sudo</span> <span class="token function">cp</span> bin/* /usr/bin/

<span class="token function">sudo</span> systemctl start containerd

<span class="token function">rm</span> <span class="token parameter variable">-rf</span> bin

<span class="token function">sudo</span> systemctl status containerd <span class="token parameter variable">--lines</span> <span class="token number">1</span>

<span class="token comment"># k8s 설치시작</span>
<span class="token function">curl</span> <span class="token parameter variable">-s</span> https://packages.cloud.google.com/apt/doc/apt-key.gpg <span class="token operator">|</span> <span class="token function">sudo</span> apt-key <span class="token function">add</span>

<span class="token function">sudo</span> apt-add-repository <span class="token string">"deb http://apt.kubernetes.io/ kubernetes-xenial main"</span>

<span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> kubeadm kubelet kubectl <span class="token parameter variable">-y</span>

<span class="token function">sudo</span> apt-mark hold kubeadm kubelet kubectl containerd

<span class="token comment">#echo 'net.bridge.bridge-nf-call-iptables = 1' | sudo tee -a /etc/sysctl.conf</span>

<span class="token assign-left variable">SOURCE_FILE</span><span class="token operator">=</span><span class="token string">"/etc/sysctl.conf"</span>
<span class="token assign-left variable">LINE_INPUT</span><span class="token operator">=</span><span class="token string">"net.bridge.bridge-nf-call-iptables = 1"</span>

<span class="token function">grep</span> <span class="token parameter variable">-qF</span> <span class="token string">"<span class="token variable">$LINE_INPUT</span>"</span> <span class="token string">"<span class="token variable">$SOURCE_FILE</span>"</span>  <span class="token operator">||</span> <span class="token builtin class-name">echo</span> <span class="token string">"<span class="token variable">$LINE_INPUT</span>"</span> <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">tee</span> <span class="token parameter variable">-a</span> <span class="token string">"<span class="token variable">$SOURCE_FILE</span>"</span>

<span class="token function">sudo</span> <span class="token builtin class-name">echo</span> <span class="token string">'1'</span> <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">tee</span> /proc/sys/net/ipv4/ip_forward

<span class="token function">cat</span> /proc/sys/net/ipv4/ip_forward

<span class="token function">sudo</span> <span class="token function">sysctl</span> <span class="token parameter variable">--system</span>

<span class="token function">sudo</span> modprobe overlay
<span class="token function">sudo</span> modprobe br_netfilter

<span class="token function">sudo</span> swapoff <span class="token parameter variable">-a</span>

<span class="token function">sudo</span> <span class="token function">sed</span> <span class="token parameter variable">-ri</span> <span class="token string">'/\sswap\s/s/^#?/#/'</span> /etc/fstab

<span class="token function">cat</span> /etc/fstab
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="후속작업" tabindex="-1"><a class="header-anchor" href="#후속작업" aria-hidden="true">#</a> 후속작업</h1>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># k8s master server 설정</span>
<span class="token function">sudo</span> kubeadm config images pull

<span class="token assign-left variable">IP_ADDR</span><span class="token operator">=</span><span class="token variable"><span class="token variable">`</span><span class="token function">hostname</span> <span class="token parameter variable">-I</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">'{print $1}'</span><span class="token variable">`</span></span>

<span class="token function">sudo</span> kubeadm init --pod-network-cidr<span class="token operator">=</span><span class="token number">10.244</span>.0.0/16 --apiserver-advertise-address<span class="token operator">=</span><span class="token variable">${IP_ADDR}</span>

<span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token environment constant">$HOME</span>/.kube

<span class="token function">sudo</span> <span class="token function">cp</span> <span class="token parameter variable">-i</span> /etc/kubernetes/admin.conf <span class="token environment constant">$HOME</span>/.kube/config

<span class="token function">sudo</span> <span class="token function">chown</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-u</span><span class="token variable">)</span></span><span class="token builtin class-name">:</span><span class="token variable"><span class="token variable">$(</span><span class="token function">id</span> <span class="token parameter variable">-g</span><span class="token variable">)</span></span> <span class="token environment constant">$HOME</span>/.kube/config

<span class="token comment"># cni 설치(weave)</span>
kubectl apply <span class="token parameter variable">-f</span> <span class="token string">"https://cloud.weave.works/k8s/net?k8s-version=<span class="token variable"><span class="token variable">$(</span>kubectl version <span class="token operator">|</span> base64 <span class="token operator">|</span> <span class="token function">tr</span> <span class="token parameter variable">-d</span> <span class="token string">'\n'</span><span class="token variable">)</span></span>"</span>

<span class="token comment">#kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml</span>

<span class="token function">sudo</span> <span class="token function">cp</span> ./crictl.yaml /etc/crictl.yaml

<span class="token function">sudo</span> crictl images

<span class="token function">watch</span> <span class="token parameter variable">-n</span> <span class="token number">5</span> <span class="token string">"kubectl get nodes"</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


