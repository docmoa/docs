<template><div><h1 id="kubernetes-vagrant로-로컬-환경-구성" tabindex="-1"><a class="header-anchor" href="#kubernetes-vagrant로-로컬-환경-구성" aria-hidden="true">#</a> Kubernetes, Vagrant로 로컬 환경 구성</h1>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/그림판 - Google Slides 2022-01-01 00-47-10.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<blockquote>
<p>github : <a href="https://github.com/Great-Stone/vagrant-k8s" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/vagrant-k8s<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>Virtualbox를 활용하여 로컬 환경에서 Kubernetes(K8s) 환경을 쉽게 만들고 부실수(?) 있는 환경을 구성하기위해 Vagrant를 활용</li>
<li>Intel Mac (Catalina / Big Sur)에서 테스트</li>
<li>Windows는 테스트 필요</li>
</ul>
<h2 id="실행-전-필요-소프트웨어" tabindex="-1"><a class="header-anchor" href="#실행-전-필요-소프트웨어" aria-hidden="true">#</a> 실행 전 필요 소프트웨어</h2>
<ul>
<li>Virtualbox : <a href="https://www.virtualbox.org" target="_blank" rel="noopener noreferrer">https://www.virtualbox.org<ExternalLinkIcon/></a></li>
<li>Vagrant : <a href="https://www.vagrantup.com" target="_blank" rel="noopener noreferrer">https://www.vagrantup.com<ExternalLinkIcon/></a></li>
</ul>
<h2 id="virtualbox-네트워크-구성" tabindex="-1"><a class="header-anchor" href="#virtualbox-네트워크-구성" aria-hidden="true">#</a> Virtualbox 네트워크 구성</h2>
<ul>
<li>K8s vm이 사용하기 위한 네트워크를 추가하여 구성</li>
<li>기존 네트워크를 사용하고 싶다면 <code v-pre>vagrantfile</code>의 <code v-pre>*.vm.network</code> 부분의 <code v-pre>ip</code>에 수정 필요
<ul>
<li><code v-pre>vagrantfile</code> 구성시 해당 <code v-pre>ip</code> 설정 부분을 상단의 <code v-pre>NETWORK_SUB</code> 부분에 정의함</li>
<li>네트워크 구성 설정에 따라 클러스터 간 통신이 안될 수 있음에 주의</li>
<li><code v-pre>vagrantfile</code>의 <code v-pre>START_IP</code>를 활용하여 마스터 노드 및 워커 노드의 ip를 부여하는 방식으로 구성되었으나 변경 가능</li>
</ul>
</li>
</ul>
<h2 id="구성-설명" tabindex="-1"><a class="header-anchor" href="#구성-설명" aria-hidden="true">#</a> 구성 설명</h2>
<h3 id="디렉토리-파일-구조" tabindex="-1"><a class="header-anchor" href="#디렉토리-파일-구조" aria-hidden="true">#</a> 디렉토리/파일 구조</h3>
<h4 id="실행-전" tabindex="-1"><a class="header-anchor" href="#실행-전" aria-hidden="true">#</a> 실행 전</h4>
<p>::: vue<br>
.<br>
├── <code v-pre>1.18</code><br>
│   ├── files<br>
│   │   └── <code v-pre>pv.yaml</code><br>
│   ├── scripts<br>
│   │   ├── <code v-pre>kube.sh</code><br>
│   │   └── <code v-pre>pv.sh</code><br>
│   └── <code v-pre>vagrantfile</code><br>
├── 1.19<br>
&lt;반복&gt;<br>
:::</p>
<ul>
<li>버전별로 디렉토리가 분류되어있음
<ul>
<li>1.18~1.20 은 ubuntu 18.04 LTS 기반</li>
<li>1.21~1.23 은 utuntu 20.04 LTS 기반</li>
</ul>
</li>
<li>vagrantfile
<ul>
<li>vagrant 실행 정의</li>
<li>version2 사용</li>
</ul>
</li>
<li><a href="http://kube.sh" target="_blank" rel="noopener noreferrer">kube.sh<ExternalLinkIcon/></a>
<ul>
<li><code v-pre>vagrantfile</code>에서 provision으로 호출</li>
<li>K8s 설치에 필요한 패키지 설치 및 실행</li>
</ul>
</li>
<li><a href="http://pv.sh" target="_blank" rel="noopener noreferrer">pv.sh<ExternalLinkIcon/></a>, pv.yaml
<ul>
<li><code v-pre>vagrantfile</code>에서 provision으로 호출</li>
<li>pv.sh는 K8s master 노드 구성 후 디렉토리 생성 후 pv.yaml을 통해 pv 구성</li>
</ul>
</li>
</ul>
<h4 id="실행-후" tabindex="-1"><a class="header-anchor" href="#실행-후" aria-hidden="true">#</a> 실행 후</h4>
<p>::: vue<br>
├── 1.18<br>
│   ├── <code v-pre>.kube</code><br>
│   ├── <code v-pre>.vagrant</code><br>
│   ├── files<br>
│   │   └── pv.yaml<br>
│   ├── <code v-pre>join.sh</code><br>
│   ├── <code v-pre>k8s-pv</code><br>
│   │   ├── pv01<br>
│   │   ├── pv02<br>
│   │   └── pv03<br>
│   ├── scripts<br>
│   │   ├── <a href="http://kube.sh" target="_blank" rel="noopener noreferrer">kube.sh<ExternalLinkIcon/></a><br>
│   │   └── <a href="http://pv.sh" target="_blank" rel="noopener noreferrer">pv.sh<ExternalLinkIcon/></a><br>
│   └── vagrantfile<br>
├── 1.19<br>
&lt;반복&gt;<br>
:::</p>
<ul>
<li>.kube 디렉토리 : kubernetes credential 및 접속 정보 생성</li>
<li>.vagrant 디렉토리 : vagrant 실행 후 vm 정보 업데이트</li>
<li><a href="http://join.sh" target="_blank" rel="noopener noreferrer">join.sh<ExternalLinkIcon/></a> : 워커노드의 클러스터 조인을 위한 스크립트</li>
<li>k8s-pv 디렉토리 : pv를 위한 디렉토리 구성</li>
</ul>
<h3 id="vagrantfile-variable" tabindex="-1"><a class="header-anchor" href="#vagrantfile-variable" aria-hidden="true">#</a> vagrantfile - variable</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token property">IMAGE_NAME</span> <span class="token punctuation">=</span> <span class="token string">"bento/ubuntu-20.04"</span>

<span class="token property">K8S_MINOR_VERSION</span> <span class="token punctuation">=</span> <span class="token string">"21"</span>
<span class="token property">NETWORK_SUB</span> <span class="token punctuation">=</span> <span class="token string">"192.168.60."</span>
<span class="token property">START_IP</span> <span class="token punctuation">=</span> <span class="token number">130</span>
<span class="token property">POD_CIDR</span> <span class="token punctuation">=</span> <span class="token string">"10.#{K8S_MINOR_VERSION}.0.0/16"</span>

<span class="token property">cluster</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
  <span class="token property">"master"</span> <span class="token punctuation">=</span>> <span class="token punctuation">{</span> :<span class="token property">cpus</span> <span class="token punctuation">=</span>> <span class="token number">2</span>, :<span class="token property">mem</span> <span class="token punctuation">=</span>> <span class="token number">2048</span> <span class="token punctuation">}</span>,
  <span class="token property">"node"</span> <span class="token punctuation">=</span>> <span class="token punctuation">{</span> :<span class="token property">cpus</span> <span class="token punctuation">=</span>> <span class="token number">1</span>, :<span class="token property">mem</span> <span class="token punctuation">=</span>> <span class="token number">1024</span> <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token property">NODE_COUNT</span> <span class="token punctuation">=</span> <span class="token number">1</span>

<span class="token property">VM_GROUP_NAME</span> <span class="token punctuation">=</span> <span class="token string">"k8s-1.#{K8S_MINOR_VERSION}"</span>
<span class="token property">DOCKER_VER</span> <span class="token punctuation">=</span> <span class="token string">"5:20.10.12~3-0~ubuntu-focal"</span>
<span class="token property">KUBE_VER</span> <span class="token punctuation">=</span> <span class="token string">"1.#{K8S_MINOR_VERSION}.8-00"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>Variable name</th>
<th>value</th>
</tr>
</thead>
<tbody>
<tr>
<td>IMAGE_NAME</td>
<td>vagrant에서 사용할 기본 이미지로 vagrant cloud 참조</td>
</tr>
<tr>
<td>K8S_MINOR_VERSION</td>
<td>K8s 설치의 마이너 버전 지정</td>
</tr>
<tr>
<td>NETWORK_SUB</td>
<td>Virtualbox network ip</td>
</tr>
<tr>
<td>START_IP</td>
<td>각 K8s 클러스터의 master에 할당되며 워커노드는 +1 씩 증가</td>
</tr>
<tr>
<td>POD_CIDR</td>
<td>kubeadm init 의 --pod-network-cidr 에 지정되는 CIDR</td>
</tr>
<tr>
<td>cluster={}</td>
<td>클러스터 리소스를 정의한 오브젝트 형태의 변수</td>
</tr>
<tr>
<td>NODE_COUNT</td>
<td>워커 노드 개수</td>
</tr>
<tr>
<td>VM_GROUP_NAME</td>
<td>Virtualbox에 등록될 그룹 이름</td>
</tr>
<tr>
<td>DOCKER_VER</td>
<td>docker-ce 버전</td>
</tr>
<tr>
<td>KUBE_VER</td>
<td>K8s 관련 패키지 버전</td>
</tr>
</tbody>
</table>
<h3 id="vagrantfile-vm" tabindex="-1"><a class="header-anchor" href="#vagrantfile-vm" aria-hidden="true">#</a> vagrantfile - vm</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>Vagrant.configure(<span class="token string">"2"</span>) do |config|
  <span class="token property">config.vm.box</span> <span class="token punctuation">=</span> IMAGE_NAME

  config.vm.define <span class="token string">"master"</span>, primary: <span class="token boolean">true</span> do |master|
    <span class="token property">master.vm.box</span> <span class="token punctuation">=</span> IMAGE_NAME
    master.vm.network <span class="token string">"private_network"</span>, ip: <span class="token string">"#{NETWORK_SUB}#{START_IP}"</span>
    <span class="token property">master.vm.hostname</span> <span class="token punctuation">=</span> <span class="token string">"master"</span>
    master.vm.provision <span class="token string">"kube"</span>, type: <span class="token string">"shell"</span>, privileged: <span class="token boolean">true</span>, path: <span class="token string">"scripts/kube.sh"</span>, env: <span class="token punctuation">{</span>
      <span class="token property">"docker_ver"</span> <span class="token punctuation">=</span>> <span class="token string">"#{DOCKER_VER}"</span>,
      <span class="token property">"k8s_ver"</span> <span class="token punctuation">=</span>> <span class="token string">"#{KUBE_VER}"</span>
    <span class="token punctuation">}</span>
    master.vm.provision <span class="token string">"0"</span>, type: <span class="token string">"shell"</span>, preserve_order: <span class="token boolean">true</span>, privileged: <span class="token boolean">true</span>, inline: <span class="token heredoc string">&lt;&lt;-SHELL
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
    SHELL</span>

    master.vm.provision <span class="token string">"file"</span>, preserve_order: <span class="token boolean">true</span>, source: <span class="token string">"files"</span>, destination: <span class="token string">"/tmp"</span>
    master.vm.provision <span class="token string">"3"</span>, type: <span class="token string">"shell"</span>, preserve_order: <span class="token boolean">true</span>, privileged: <span class="token boolean">true</span>, path: <span class="token string">"scripts/pv.sh"</span>

    master.vm.provider <span class="token string">"virtualbox"</span> do |v|
      &lt;생략>
    end <span class="token comment"># end provider</span>
  end

  (<span class="token number">1.</span>.NODE_COUNT).each do |i|
    config.vm.define <span class="token string">"node-#{i}"</span> do |node|
      <span class="token property">node.vm.box</span> <span class="token punctuation">=</span> IMAGE_NAME
      node.vm.network <span class="token string">"private_network"</span>, ip: <span class="token string">"#{NETWORK_SUB}#{i + START_IP}"</span>
      <span class="token property">node.vm.hostname</span> <span class="token punctuation">=</span> <span class="token string">"node-#{i}"</span>
        &lt;생략>

      node.vm.provider <span class="token string">"virtualbox"</span> do |v|
        &lt;생략>
      end <span class="token comment"># end provider</span>
    end
  end
end
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>vm 생성을 위한 정의는 크게 <code v-pre>master</code>와 <code v-pre>node-#</code>로 구분됨</li>
<li>master
<ul>
<li><code v-pre>master</code>의 경우 1개만을 생성하도록 지정</li>
<li><code v-pre>*.vm.provision</code>을 통해 스크립트를 실행하거나 파일을 복사하여 프로비저닝</li>
<li><code v-pre>master.vm.provision &quot;0&quot;</code>에서 <code v-pre>kubeconfig</code>파일과 워커노드 조인을 위한 토큰 커맨드를 <code v-pre>join.sh</code>파일로 생성</li>
</ul>
</li>
<li>node-#
<ul>
<li>변수 <code v-pre>NODE_COUNT</code> 에서 지정된 개수에 따라 반복 수행</li>
<li>앞서 <code v-pre>master</code> 프로비저닝시 생성된 <code v-pre>join.sh</code>를 이용하여 클러스터에 조인</li>
</ul>
</li>
</ul>
<h2 id="실행-및-확인" tabindex="-1"><a class="header-anchor" href="#실행-및-확인" aria-hidden="true">#</a> 실행 및 확인</h2>
<h3 id="vagrant-cli" tabindex="-1"><a class="header-anchor" href="#vagrant-cli" aria-hidden="true">#</a> vagrant cli</h3>
<blockquote>
<p>cli doc : <a href="https://www.vagrantup.com/docs/cli" target="_blank" rel="noopener noreferrer">https://www.vagrantup.com/docs/cli<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>vagrant up : 프로비저닝을 실행하며, 이미 프로비저닝 된 경우 다시 프로비저닝하지 않고 vm만 기동</li>
<li>vagrant up <code v-pre>vm-name</code> : <code v-pre>config.vm.define</code> 에 선언된 아이디에 해당하는 vm만 기동
<ul>
<li>e.g. : vagrant up master</li>
</ul>
</li>
<li>vagrant halt : vm 정지</li>
<li>vagrant halt <code v-pre>vm-name</code> : <code v-pre>config.vm.define</code> 에 선언된 아이디에 해당하는 vm만 정지
<ul>
<li>e.g. : vagrant halt node-1</li>
</ul>
</li>
<li>vagrant status : vm 상태 확인</li>
<li>vagrant ssh <code v-pre>vm-name</code> : <code v-pre>config.vm.define</code> 에 선언된 아이디에 해당하는 vm에 ssh 접속
<ul>
<li>e.g. : vagrant ssh master</li>
</ul>
</li>
<li>vagrant destroy : 프로비저닝된 vm 삭제</li>
</ul>
<h3 id="check-kubeconfig" tabindex="-1"><a class="header-anchor" href="#check-kubeconfig" aria-hidden="true">#</a> Check kubeconfig</h3>
<p><code v-pre>master</code>노드 프로비저닝 과정에서 <code v-pre>.kube/config</code>를 생성하므로, 해당 kubeconfig를 사용하여 호스트 환경에서 <code v-pre>kubectl</code> 사용 가능</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>~/vagrant-k8s/1.2<span class="token operator"><span class="token file-descriptor important">3</span>></span> kubectl <span class="token parameter variable">--kubeconfig</span><span class="token operator">=</span>./.kube/config get nodes
NAME     STATUS   ROLES                  AGE   VERSION
master   Ready    control-plane,master   68m   v1.23.1
node-1   Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>                 63m   v1.23.1
node-2   Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>                 59m   v1.23.1
node-3   Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>                 54m   v1.23.1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="패키지-버전-확인-방법" tabindex="-1"><a class="header-anchor" href="#패키지-버전-확인-방법" aria-hidden="true">#</a> 패키지 버전 확인 방법</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment">#apt-cache policy &lt;packagename></span>
<span class="token function">apt-cache</span> policy kubelet <span class="token operator">|</span> <span class="token function">grep</span> <span class="token number">1.2</span>
  Candidate: <span class="token number">1.23</span>.1-00
     <span class="token number">1.23</span>.1-00 <span class="token number">500</span>
     <span class="token number">1.23</span>.0-00 <span class="token number">500</span>
     <span class="token number">1.22</span>.5-00 <span class="token number">500</span>
     <span class="token number">1.22</span>.4-00 <span class="token number">500</span>
     <span class="token number">1.22</span>.3-00 <span class="token number">500</span>
     <span class="token number">1.22</span>.2-00 <span class="token number">500</span>
     <span class="token number">1.22</span>.1-00 <span class="token number">500</span>
     <span class="token number">1.22</span>.0-00 <span class="token number">500</span>
     <span class="token number">1.21</span>.8-00 <span class="token number">500</span>
     <span class="token number">1.21</span>.7-00 <span class="token number">500</span>
     <span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


