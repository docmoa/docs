<template><div><h1 id="vault-secrets-operator-예제실습" tabindex="-1"><a class="header-anchor" href="#vault-secrets-operator-예제실습" aria-hidden="true">#</a> Vault Secrets Operator 예제실습</h1>
<blockquote>
<p>📌 참고:<br>
현재 Vault 비밀 오퍼레이터는 공개 베타 버전입니다. *<a href="https://github.com/hashicorp/vault-secrets-operator/issues" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>*에서 GitHub 이슈를 개설하여 피드백을 제공해 주세요.</p>
</blockquote>
<p>본 문서는 HashiCorp 공식 GitHub의 <a href="%5Bhere%5D(https://github.com/hashicorp/vault-secrets-operator#samples)">Vault Secret Operator 저장소</a> 에서 제공하는 코드를 활용하여 환경구성 및 샘플 애플리케이션 배포/연동에 대한 상세 분석을 제공한다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/vso_repo.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h2 id="_0-사전-요구사항" tabindex="-1"><a class="header-anchor" href="#_0-사전-요구사항" aria-hidden="true">#</a> 0. 사전 요구사항</h2>
<h3 id="_1-패키지-및-바이너리-정보" tabindex="-1"><a class="header-anchor" href="#_1-패키지-및-바이너리-정보" aria-hidden="true">#</a> 1) 패키지 및 바이너리 정보</h3>
<ul>
<li>go(1.20.2 이상)</li>
<li>make</li>
<li>KinD</li>
<li>Docker</li>
<li>Kubectl</li>
<li>unzip</li>
</ul>
<h3 id="_2-저장소-복제" tabindex="-1"><a class="header-anchor" href="#_2-저장소-복제" aria-hidden="true">#</a> 2) 저장소 복제</h3>
<p>실습을 위해 <a href="https://github.com/hashicorp/vault-secrets-operator" target="_blank" rel="noopener noreferrer">vault-secrets-operator<ExternalLinkIcon/></a> 저장소를 복제한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 저장소 복제</span>
$ <span class="token function">git</span> clone https://github.com/hashicorp/vault-secrets-operator.git

<span class="token comment"># 작업 디렉토리 이동</span>
$ <span class="token builtin class-name">cd</span> vault-secrets-operator
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-k8s-환경구성-및-샘플배포" tabindex="-1"><a class="header-anchor" href="#_1-k8s-환경구성-및-샘플배포" aria-hidden="true">#</a> 1. K8s 환경구성 및 샘플배포</h2>
<blockquote>
<p>📌 참고:<br>
실행결과 : <a href="https://gist.githubusercontent.com/hyungwook0221/85ec45d06a8c7643bcfe4afcd8843856/raw/b40096f6bbfad75636e3657f6c0827f8b7a0b436/vso-demo-1.sh" target="_blank" rel="noopener noreferrer">vso-demo-1.sh<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>Start a KinD Cluster</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">make</span> setup-kind
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>setup-kind</code> 수행 후 생성된 KinD 클러스터 및 파드정보 확인</li>
</ul>
<p><code v-pre>vault-secrets-operator-control-plane</code> 가 단일노드로 배포된 것을 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl get nodes <span class="token parameter variable">-o</span> wide
NAME                                   STATUS   ROLES           AGE     VERSION   INTERNAL-IP   EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION     CONTAINER-RUNTIME
vault-secrets-operator-control-plane   Ready    control-plane   3m18s   v1.25.3   <span class="token number">172.18</span>.0.2    <span class="token operator">&lt;</span>none<span class="token operator">></span>        Ubuntu <span class="token number">22.04</span>.1 LTS   <span class="token number">5.15</span>.49-linuxkit   containerd://1.6.9

$ kubectl get pods <span class="token parameter variable">-A</span>
NAMESPACE            NAME                                                           READY   STATUS    RESTARTS   AGE
kube-system          coredns-565d847f94-42vpm                                       <span class="token number">1</span>/1     Running   <span class="token number">0</span>          3m5s
kube-system          coredns-565d847f94-6fsv9                                       <span class="token number">1</span>/1     Running   <span class="token number">0</span>          3m5s
kube-system          etcd-vault-secrets-operator-control-plane                      <span class="token number">1</span>/1     Running   <span class="token number">0</span>          3m18s
kube-system          kindnet-9j486                                                  <span class="token number">1</span>/1     Running   <span class="token number">0</span>          3m6s
kube-system          kube-apiserver-vault-secrets-operator-control-plane            <span class="token number">1</span>/1     Running   <span class="token number">0</span>          3m18s
kube-system          kube-controller-manager-vault-secrets-operator-control-plane   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          3m18s
kube-system          kube-proxy-tfqc8                                               <span class="token number">1</span>/1     Running   <span class="token number">0</span>          3m6s
kube-system          kube-scheduler-vault-secrets-operator-control-plane            <span class="token number">1</span>/1     Running   <span class="token number">0</span>          3m17s
local-path-storage   local-path-provisioner-684f458cdd-2dzfn                        <span class="token number">1</span>/1     Running   <span class="token number">0</span>          3m5s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-vault-클러스터-배포" tabindex="-1"><a class="header-anchor" href="#_2-vault-클러스터-배포" aria-hidden="true">#</a> 2. Vault 클러스터 배포</h2>
<blockquote>
<p>📌 참고<br>
실행결과 : <a href="https://gist.githubusercontent.com/hyungwook0221/3bf0603ca179f367492fefab9574595f/raw/53b33e501082193999c1f5dca9ed73c70507d42f/vso-demo-2.sh" target="_blank" rel="noopener noreferrer">vso-demo-2.sh<ExternalLinkIcon/></a></p>
</blockquote>
<p>앞서 생성된 KinD 클러스터 내부에 Vault 클러스터를 배포한다. 이때, 필요한 사전 환경을 Terraform 코드를 통해 자동으로 구성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">make</span> setup-integration-test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>배포된 Vaulat Server Pod 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Pod 확인</span>
$ kubectl get pods <span class="token parameter variable">-n</span> vault
NAME      READY   STATUS    RESTARTS   AGE
vault-0   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          73s

<span class="token comment"># vault 상태확인</span>
$ kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-n</span> vault <span class="token parameter variable">-it</span> vault-0 -- vault status
Key             Value
---             -----
Seal Type       shamir
Initialized     <span class="token boolean">true</span>
Sealed          <span class="token boolean">false</span>
Total Shares    <span class="token number">1</span>
Threshold       <span class="token number">1</span>
Version         <span class="token number">1.13</span>.2
Build Date      <span class="token number">2023</span>-04-25T13:02:50Z
Storage Type    inmem
Cluster Name    vault-cluster-199af322
Cluster ID      23b647d5-f067-ba94-b359-2fca26af9ff9
HA Enabled      <span class="token boolean">false</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Terraform의 <code v-pre>kubernetes</code>, <code v-pre>helm</code> 프로바이더를 사용하여 다음과 같은 리소스를 자동으로 배포한다.</p>
<blockquote>
<p>📌 참고 :<br>
원본코드 : <a href="https://raw.githubusercontent.com/hashicorp/vault-secrets-operator/main/test/integration/infra/main.tf" target="_blank" rel="noopener noreferrer">main.tf<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>kubernetes
<ul>
<li>kubernetes_namespace : demo</li>
<li>kubernetes_secret : vault_license</li>
<li>kubernetes_cluster_role_binding : reviewer</li>
</ul>
</li>
<li>helm(helm_release)
<ul>
<li>server.dev.enabled</li>
<li>server.image.repository</li>
<li>server.image.tag</li>
<li>server.logLevel</li>
<li>injector.enabled</li>
</ul>
</li>
</ul>
<h2 id="_3-vault-설정" tabindex="-1"><a class="header-anchor" href="#_3-vault-설정" aria-hidden="true">#</a> 3. Vault 설정</h2>
<blockquote>
<p>📌 참고:<br>
원본소스 : <a href="https://raw.githubusercontent.com/hashicorp/vault-secrets-operator/main/config/samples/setup.sh" target="_blank" rel="noopener noreferrer">setup.sh<ExternalLinkIcon/></a><br>
실행결과 : <a href="https://gist.githubusercontent.com/hyungwook0221/1750fa348e95141018e83ed16835281f/raw/71c967722244b175cf1ceabba828b038cfe1bf8c/vso-demo-3.sh" target="_blank" rel="noopener noreferrer">vso-demo-3.sh<ExternalLinkIcon/></a></p>
</blockquote>
<p><code v-pre>setup.sh</code> 스크립트를 실행하여 다음 3가지 시크릿 엔진에 대한 실습 환경을 구성한다.</p>
<ul>
<li>Secret Engine</li>
<li>ACL Policy</li>
<li>Auth Methods</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ ./config/samples/setup.sh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/H7fG1P.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h3 id="_1-secret-engine" tabindex="-1"><a class="header-anchor" href="#_1-secret-engine" aria-hidden="true">#</a> 1) Secret Engine</h3>
<h4 id="_1-kv-시크릿엔진-활성화-kvv1-kvv2" tabindex="-1"><a class="header-anchor" href="#_1-kv-시크릿엔진-활성화-kvv1-kvv2" aria-hidden="true">#</a> (1) KV 시크릿엔진 활성화 : kvv1, kvv2</h4>
<p>KV 시크릿엔진 Version 1, Version2를 활성화 하고 샘플 데이터를 주입한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault secrets disable kvv2/
vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>kvv2 kv-v2
vault kv put kvv2/secret <span class="token assign-left variable">username</span><span class="token operator">=</span><span class="token string">"db-readonly-username"</span> <span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token string">"db-secret-password"</span>

vault secrets disable kvv1/
vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>kvv1 <span class="token parameter variable">-version</span><span class="token operator">=</span><span class="token number">1</span> kv
vault kv put kvv1/secret <span class="token assign-left variable">username</span><span class="token operator">=</span><span class="token string">"v1-user"</span> <span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token string">"v1-password"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>KV 시크릿 엔진 : kvv1</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/fLg3mc.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>KV 시크릿 엔진 : kvv2</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/S7cDQl.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h4 id="_2-pki-시크릿-엔진-활성화-pki" tabindex="-1"><a class="header-anchor" href="#_2-pki-시크릿-엔진-활성화-pki" aria-hidden="true">#</a> (2) PKI 시크릿 엔진 활성화 : pki</h4>
<p>PKI 시크릿 엔진을 활성화하고 다음 설정을 진행한다.</p>
<ul>
<li>PKI 인증서 생성</li>
<li>CA, CRL 설정</li>
<li>Role 설정</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># PKI Secret 엔진 활성화</span>
vault secrets disable pki
vault secrets <span class="token builtin class-name">enable</span> pki

<span class="token comment"># PKI 인증서 생성</span>
vault <span class="token function">write</span> pki/root/generate/internal <span class="token punctuation">\</span>
    <span class="token assign-left variable">common_name</span><span class="token operator">=</span>example.com <span class="token punctuation">\</span>
    <span class="token assign-left variable">ttl</span><span class="token operator">=</span>768h

<span class="token comment"># 설정</span>
vault <span class="token function">write</span> pki/config/urls <span class="token punctuation">\</span>
    <span class="token assign-left variable">issuing_certificates</span><span class="token operator">=</span><span class="token string">"http://127.0.0.1:8200/v1/pki/ca"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">crl_distribution_points</span><span class="token operator">=</span><span class="token string">"http://127.0.0.1:8200/v1/pki/crl"</span>

<span class="token comment"># 역할구성</span>
vault <span class="token function">write</span> pki/roles/default <span class="token punctuation">\</span>
    <span class="token assign-left variable">allowed_domains</span><span class="token operator">=</span>example.com <span class="token punctuation">\</span>
    <span class="token assign-left variable">allowed_domains</span><span class="token operator">=</span>localhost <span class="token punctuation">\</span>
    <span class="token assign-left variable">allow_subdomains</span><span class="token operator">=</span>true <span class="token punctuation">\</span>
    <span class="token assign-left variable">max_ttl</span><span class="token operator">=</span>72h
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>PKI 시크릿 엔진 구성확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/6Ht11e.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h3 id="_2-acl-policy" tabindex="-1"><a class="header-anchor" href="#_2-acl-policy" aria-hidden="true">#</a> 2) ACL Policy</h3>
<h4 id="_1-정책-정의-demo" tabindex="-1"><a class="header-anchor" href="#_1-정책-정의-demo" aria-hidden="true">#</a> (1) 정책 정의 : demo</h4>
<p>각 시크릿 엔진에 대한  ACL Policy를 정의하기 위해 다음 <code v-pre>hcl</code> 을 작성하고 적용한다.</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token comment"># policy.hcl 작성</span>
cat <span class="token operator">&lt;&lt;</span><span class="token constant">EOT</span> <span class="token operator">></span> <span class="token operator">/</span>tmp<span class="token operator">/</span>policy<span class="token punctuation">.</span>hcl
path <span class="token string-literal"><span class="token string">"kvv2/*"</span></span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"read"</span></span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
path <span class="token string-literal"><span class="token string">"kvv1/*"</span></span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"read"</span></span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
path <span class="token string-literal"><span class="token string">"pki/*"</span></span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"read"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"create"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"update"</span></span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
<span class="token constant">EOT</span>

<span class="token comment"># demo 정책 생성</span>
vault policy write demo <span class="token operator">/</span>tmp<span class="token operator">/</span>policy<span class="token punctuation">.</span>hcl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>vault policy write</code> 명령으로 정책을 생성하고 확인한다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/P7EuMl.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>demo policy 확인
<ul>
<li><strong>kvv2 : read</strong></li>
<li><strong>kvv1 : read</strong></li>
<li><strong>pki : read, create, update</strong></li>
</ul>
</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/jjaKW7.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h3 id="_3-auth-methods" tabindex="-1"><a class="header-anchor" href="#_3-auth-methods" aria-hidden="true">#</a> 3) Auth Methods</h3>
<h4 id="_1-인증방식-정의-kubernetes" tabindex="-1"><a class="header-anchor" href="#_1-인증방식-정의-kubernetes" aria-hidden="true">#</a> (1) 인증방식 정의: kubernetes</h4>
<p>Vault와 연동을 위해 kubernetes 인증방식을 설정한다.</p>
<blockquote>
<p>참고:<br>
Beta 버전에서는 Kubernetes 인증 방식만 제공</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Kubernetes 인증방식 활성화</span>
vault auth disable kubernetes
vault auth <span class="token builtin class-name">enable</span> kubernetes

vault <span class="token function">write</span> auth/kubernetes/config <span class="token punctuation">\</span>
    <span class="token assign-left variable">kubernetes_host</span><span class="token operator">=</span>https://kubernetes.default.svc

vault <span class="token function">write</span> auth/kubernetes/role/demo <span class="token punctuation">\</span>
    <span class="token assign-left variable">bound_service_account_names</span><span class="token operator">=</span>default <span class="token punctuation">\</span>
    <span class="token assign-left variable">bound_service_account_namespaces</span><span class="token operator">=</span>tenant-1,tenant-2 <span class="token punctuation">\</span>
    <span class="token assign-left variable">policies</span><span class="token operator">=</span>demo <span class="token punctuation">\</span>
    <span class="token assign-left variable">ttl</span><span class="token operator">=</span>1h
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>VSO에서는 현재 Kubernetes 인증 방식만을 제공하고 있으므로 Kubernetes 인증 방식을 통해 실습을 진행한다.</p>
<ul>
<li>생성된 kubernetes 인증방식 확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/447eDQ.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>kubernetes 인증방식 구성을 위해 Roles, Config를 정의한다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/Jvvuyn.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li><strong>Roles 확인</strong>
<ul>
<li>bound_service_account_names=<code v-pre>default</code></li>
<li>bound_service_account_namespaces=<code v-pre>tenant-1,tenant-2</code></li>
<li>policies=<code v-pre>demo</code></li>
<li>ttl=<code v-pre>1h</code> (3600s)</li>
</ul>
</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/gd4mOV.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>Config 확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/7wjcUA.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>Config 확인(상세)
<ul>
<li>kubernetes_host=<code v-pre>https://kubernetes.default.svc</code></li>
</ul>
</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/m5o4il.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>(참고) Entity 확인</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/QlpQMb.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h3 id="_4-kubernetes-네임스페이스-생성" tabindex="-1"><a class="header-anchor" href="#_4-kubernetes-네임스페이스-생성" aria-hidden="true">#</a> 4) Kubernetes 네임스페이스 생성</h3>
<p>K8s 인증방식의 역할(Role)에서 사용할 네임스페이스 확인</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl get ns <span class="token operator">|</span> <span class="token function">grep</span> tenant
tenant-1                        Active   5h2m
tenant-2                        Active   5h2m
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-오퍼레이터-빌드-및-배포" tabindex="-1"><a class="header-anchor" href="#_4-오퍼레이터-빌드-및-배포" aria-hidden="true">#</a> 4. 오퍼레이터 빌드 및 배포</h2>
<blockquote>
<p>참고<br>
<a href="https://gist.githubusercontent.com/hyungwook0221/37612418122e9154a497236c75bf3a5e/raw/9ce3a49318921f5928ec7bb96cd5149af3612713/vso-demo-4.sh" target="_blank" rel="noopener noreferrer">vso-demo-4.sh<ExternalLinkIcon/></a></p>
</blockquote>
<p>Vault 설정이 완료되었으므로 실제 Kubernetes Cluster에서 Operator를 배포한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">make</span> build docker-build deploy-kind
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_1-배포된-리소스-확인" tabindex="-1"><a class="header-anchor" href="#_1-배포된-리소스-확인" aria-hidden="true">#</a> 1) 배포된 리소스 확인</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl get pods <span class="token parameter variable">-n</span> vault-secrets-operator-system
NAME                                                         READY   STATUS    RESTARTS   AGE
vault-secrets-operator-controller-manager-6f8b6b8f49-5lt97   <span class="token number">2</span>/2     Running   <span class="token number">0</span>          3h59m

$ k get crd <span class="token parameter variable">-A</span>
NAME                                        CREATED AT
vaultauths.secrets.hashicorp.com            <span class="token number">2023</span>-05-12T08:37:15Z
vaultconnections.secrets.hashicorp.com      <span class="token number">2023</span>-05-12T08:37:15Z
vaultdynamicsecrets.secrets.hashicorp.com   <span class="token number">2023</span>-05-12T08:37:15Z
vaultpkisecrets.secrets.hashicorp.com       <span class="token number">2023</span>-05-12T08:37:15Z
vaultstaticsecrets.secrets.hashicorp.com    <span class="token number">2023</span>-05-12T08:37:15Z
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-샘플-k8s-리소스-배포" tabindex="-1"><a class="header-anchor" href="#_5-샘플-k8s-리소스-배포" aria-hidden="true">#</a> 5. 샘플 K8s 리소스 배포</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl apply <span class="token parameter variable">-k</span> config/samples

secret/pki1 created
secret/secret1 created
secret/secret1 created
service/tls-app-service created
ingress.networking.k8s.io/tls-example-ingress created
vaultauth.secrets.hashicorp.com/vaultauth-sample created
vaultauth.secrets.hashicorp.com/vaultauth-sample created
vaultconnection.secrets.hashicorp.com/vaultconnection-sample created
vaultconnection.secrets.hashicorp.com/vaultconnection-sample created
vaultdynamicsecret.secrets.hashicorp.com/vaultdynamicsecret-sample created
vaultpkisecret.secrets.hashicorp.com/vaultpkisecret-sample-tenant-1 created
vaultpkisecret.secrets.hashicorp.com/vaultpkisecret-tls created
vaultstaticsecret.secrets.hashicorp.com/vaultstaticsecret-sample-tenant-1 created
vaultstaticsecret.secrets.hashicorp.com/vaultstaticsecret-sample-tenant-2 created
pod/app1 created
pod/tls-app created
pod/app1 created
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>생성된 Secret 확인:</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl get secrets <span class="token parameter variable">-n</span> tenant-1 secret1 <span class="token parameter variable">-o</span> yaml
$ kubectl get secrets <span class="token parameter variable">-n</span> tenant-1 pki1 <span class="token parameter variable">-o</span> yaml
$ kubectl get secrets <span class="token parameter variable">-n</span> tenant-2 secret1 <span class="token parameter variable">-o</span> yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-연결-및-인증방식-설정" tabindex="-1"><a class="header-anchor" href="#_1-연결-및-인증방식-설정" aria-hidden="true">#</a> 1) 연결 및 인증방식 설정</h3>
<p>설명추가</p>
<h4 id="_1-vaultconnection-커스텀-리소스" tabindex="-1"><a class="header-anchor" href="#_1-vaultconnection-커스텀-리소스" aria-hidden="true">#</a> (1) <code v-pre>VaultConnection</code> 커스텀 리소스</h4>
<p>Vault Operator가 연결할 Vault Cluster 정보를 구성한다.</p>
<ul>
<li><code v-pre>.spec.address</code> : <a href="http://vault.vault.svc.cluster.local:8200" target="_blank" rel="noopener noreferrer">http://vault.vault.svc.cluster.local:8200<ExternalLinkIcon/></a></li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultConnection
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app.kubernetes.io/name</span><span class="token punctuation">:</span> vaultconnection
    <span class="token key atrule">app.kubernetes.io/instance</span><span class="token punctuation">:</span> vaultconnection<span class="token punctuation">-</span>sample
    <span class="token key atrule">app.kubernetes.io/part-of</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>secrets<span class="token punctuation">-</span>operator
    <span class="token key atrule">app.kubernetes.io/managed-by</span><span class="token punctuation">:</span> kustomize
    <span class="token key atrule">app.kubernetes.io/created-by</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>secrets<span class="token punctuation">-</span>operator
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vaultconnection<span class="token punctuation">-</span>sample
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">address</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//vault.vault.svc.cluster.local<span class="token punctuation">:</span><span class="token number">8200</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultConnection
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app.kubernetes.io/name</span><span class="token punctuation">:</span> vaultconnection
    <span class="token key atrule">app.kubernetes.io/instance</span><span class="token punctuation">:</span> vaultconnection<span class="token punctuation">-</span>sample
    <span class="token key atrule">app.kubernetes.io/part-of</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>secrets<span class="token punctuation">-</span>operator
    <span class="token key atrule">app.kubernetes.io/managed-by</span><span class="token punctuation">:</span> kustomize
    <span class="token key atrule">app.kubernetes.io/created-by</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>secrets<span class="token punctuation">-</span>operator
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vaultconnection<span class="token punctuation">-</span>sample
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">2</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">address</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//vault.vault.svc.cluster.local<span class="token punctuation">:</span><span class="token number">8200</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-vaultauth-커스텀-리소스" tabindex="-1"><a class="header-anchor" href="#_2-vaultauth-커스텀-리소스" aria-hidden="true">#</a> (2) <code v-pre>VaultAuth</code> 커스텀 리소스</h4>
<p>사전에 정의된 <code v-pre>VaultConnection</code> 을 통해 Operator가 Vault Server와 연결할 때, 어떤 인증방식을 사용할지 구성한다.</p>
<blockquote>
<p>참고 : Beta 버전에서는 K8s 인증방식만 제공</p>
</blockquote>
<ul>
<li><code v-pre>.spec.vaultConnectionRef</code></li>
<li><code v-pre>.spec.method</code></li>
<li><code v-pre>.spec.mount</code></li>
<li><code v-pre>.spec.kubernetes.role</code></li>
<li><code v-pre>.spec.kubernetes.serviceAccount</code></li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultAuth
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app.kubernetes.io/name</span><span class="token punctuation">:</span> vaultauth
    <span class="token key atrule">app.kubernetes.io/instance</span><span class="token punctuation">:</span> vaultauth<span class="token punctuation">-</span>sample
    <span class="token key atrule">app.kubernetes.io/part-of</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>secrets<span class="token punctuation">-</span>operator
    <span class="token key atrule">app.kubernetes.io/managed-by</span><span class="token punctuation">:</span> kustomize
    <span class="token key atrule">app.kubernetes.io/created-by</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>secrets<span class="token punctuation">-</span>operator
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vaultauth<span class="token punctuation">-</span>sample
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">vaultConnectionRef</span><span class="token punctuation">:</span> vaultconnection<span class="token punctuation">-</span>sample
  <span class="token key atrule">method</span><span class="token punctuation">:</span> kubernetes
  <span class="token key atrule">mount</span><span class="token punctuation">:</span> kubernetes
  <span class="token key atrule">kubernetes</span><span class="token punctuation">:</span>
    <span class="token key atrule">role</span><span class="token punctuation">:</span> demo
    <span class="token key atrule">serviceAccount</span><span class="token punctuation">:</span> default
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultAuth
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app.kubernetes.io/name</span><span class="token punctuation">:</span> vaultauth
    <span class="token key atrule">app.kubernetes.io/instance</span><span class="token punctuation">:</span> vaultauth<span class="token punctuation">-</span>sample
    <span class="token key atrule">app.kubernetes.io/part-of</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>secrets<span class="token punctuation">-</span>operator
    <span class="token key atrule">app.kubernetes.io/managed-by</span><span class="token punctuation">:</span> kustomize
    <span class="token key atrule">app.kubernetes.io/created-by</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>secrets<span class="token punctuation">-</span>operator
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vaultauth<span class="token punctuation">-</span>sample
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">2</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">vaultConnectionRef</span><span class="token punctuation">:</span> vaultconnection<span class="token punctuation">-</span>sample
  <span class="token key atrule">method</span><span class="token punctuation">:</span> kubernetes
  <span class="token key atrule">mount</span><span class="token punctuation">:</span> kubernetes
  <span class="token key atrule">kubernetes</span><span class="token punctuation">:</span>
    <span class="token key atrule">role</span><span class="token punctuation">:</span> demo
    <span class="token key atrule">serviceAccount</span><span class="token punctuation">:</span> default
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-vault-crd-예제" tabindex="-1"><a class="header-anchor" href="#_2-vault-crd-예제" aria-hidden="true">#</a> 2) Vault CRD 예제</h3>
<p>VSO에서 제공하는 3가지 CRD를 사용하여 Kubernetes 오브젝트와 연동하여 사용하는 방법을 알아본다.</p>
<ul>
<li>VaultPKISecret</li>
<li>VaultStaticSecret</li>
<li>VaultDynamicSecret</li>
</ul>
<h4 id="_1-vaultpkisecret-pod-pki-secret" tabindex="-1"><a class="header-anchor" href="#_1-vaultpkisecret-pod-pki-secret" aria-hidden="true">#</a> (1) <code v-pre>VaultPKISecret</code> : Pod + PKI Secret</h4>
<p>다음은 PKI 인증서를 생성하고 Nginx 웹 서버에 적용하는 실습 예제이다. Nginx 파드를 생성할 때 secret 타입의 볼륨을 마운트한다.</p>
<ul>
<li><code v-pre>VaultPKISecret</code></li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Secret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> pki1
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
<span class="token key atrule">type</span><span class="token punctuation">:</span> Opaque
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultPKISecret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vaultpkisecret<span class="token punctuation">-</span>sample<span class="token punctuation">-</span>tenant<span class="token punctuation">-</span><span class="token number">1</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">vaultAuthRef</span><span class="token punctuation">:</span> vaultauth<span class="token punctuation">-</span>sample
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
  <span class="token key atrule">mount</span><span class="token punctuation">:</span> pki
  <span class="token key atrule">name</span><span class="token punctuation">:</span> default
  <span class="token key atrule">destination</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> pki1
  <span class="token key atrule">commonName</span><span class="token punctuation">:</span> consul.example.com
  <span class="token key atrule">format</span><span class="token punctuation">:</span> pem
  <span class="token key atrule">revoke</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">clear</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">expiryOffset</span><span class="token punctuation">:</span> 5s
  <span class="token key atrule">ttl</span><span class="token punctuation">:</span> 15s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Pod 샘플</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> app1
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
      <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
      <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> secrets
          <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">"/etc/secrets"</span>
          <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> secrets
      <span class="token key atrule">secret</span><span class="token punctuation">:</span>
        <span class="token comment"># created in Terraform</span>
        <span class="token key atrule">secretName</span><span class="token punctuation">:</span> pki1
        <span class="token key atrule">optional</span><span class="token punctuation">:</span> <span class="token boolean important">false</span> <span class="token comment"># default setting; "mysecret" must exist</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>실제 PKI 인증서가 정상적으로 생성되는 확인해본다.</p>
<ul>
<li><code v-pre>/etc/secrets</code>  디렉토에서 파일목록 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">ls</span> <span class="token parameter variable">-lrt</span> /etc/secrets

total <span class="token number">0</span>
lrwxrwxrwx <span class="token number">1</span> root root <span class="token number">20</span> May <span class="token number">14</span> 08:33 serial_number -<span class="token operator">></span> <span class="token punctuation">..</span>data/serial_number
lrwxrwxrwx <span class="token number">1</span> root root <span class="token number">23</span> May <span class="token number">14</span> 08:33 private_key_type -<span class="token operator">></span> <span class="token punctuation">..</span>data/private_key_type
lrwxrwxrwx <span class="token number">1</span> root root <span class="token number">18</span> May <span class="token number">14</span> 08:33 private_key -<span class="token operator">></span> <span class="token punctuation">..</span>data/private_key
lrwxrwxrwx <span class="token number">1</span> root root <span class="token number">17</span> May <span class="token number">14</span> 08:33 issuing_ca -<span class="token operator">></span> <span class="token punctuation">..</span>data/issuing_ca
lrwxrwxrwx <span class="token number">1</span> root root <span class="token number">17</span> May <span class="token number">14</span> 08:33 expiration -<span class="token operator">></span> <span class="token punctuation">..</span>data/expiration
lrwxrwxrwx <span class="token number">1</span> root root <span class="token number">18</span> May <span class="token number">14</span> 08:33 certificate -<span class="token operator">></span> <span class="token punctuation">..</span>data/certificate
lrwxrwxrwx <span class="token number">1</span> root root <span class="token number">15</span> May <span class="token number">14</span> 08:33 ca_chain -<span class="token operator">></span> <span class="token punctuation">..</span>data/ca_chain
lrwxrwxrwx <span class="token number">1</span> root root <span class="token number">11</span> May <span class="token number">14</span> 08:33 _raw -<span class="token operator">></span> <span class="token punctuation">..</span>data/_raw
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>본 실습에서는 실제 nginx 파드의 구성파일에 PKI 인증서를 적용하는 시나리오가 아닌 단순 파일생성 및 갱신해보았다.</p>
<h4 id="_2-vaultpkisecret-예제2-ingress-pod-pki-secret" tabindex="-1"><a class="header-anchor" href="#_2-vaultpkisecret-예제2-ingress-pod-pki-secret" aria-hidden="true">#</a> (2) <code v-pre>VaultPKISecret</code> 예제2 : Ingress + Pod + PKI Secret</h4>
<p>이번 실습에서는 앞서 확인한 PKI 인증서를 활용하여 K8s Ingress 오브젝트에 적용하고 주기적으로 교체되는 시나리오를 확인해본다.</p>
<blockquote>
<p>참고 : Ingress 실습을 위해서는 Nginx Ingress Controller를 설치 후 진행해야 한다. [<a href="https://github.com/hashicorp/vault-secrets-operator/tree/main#ingress-tls-with-vaultpkisecret" target="_blank" rel="noopener noreferrer">참고<ExternalLinkIcon/></a>]</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl apply <span class="token parameter variable">-f</span> https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

kubectl <span class="token function">wait</span> <span class="token parameter variable">--namespace</span> ingress-nginx <span class="token punctuation">\</span>
  <span class="token parameter variable">--for</span><span class="token operator">=</span>condition<span class="token operator">=</span>ready pod <span class="token punctuation">\</span>
  <span class="token parameter variable">--selector</span><span class="token operator">=</span>app.kubernetes.io/component<span class="token operator">=</span>controller <span class="token punctuation">\</span>
  <span class="token parameter variable">--timeout</span><span class="token operator">=</span>90s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Ingress에서 PKI 인증서 연동을 위한 샘플예제</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultPKISecret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vaultpkisecret<span class="token punctuation">-</span>tls
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">vaultAuthRef</span><span class="token punctuation">:</span> vaultauth<span class="token punctuation">-</span>sample
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
  <span class="token key atrule">mount</span><span class="token punctuation">:</span> pki
  <span class="token key atrule">name</span><span class="token punctuation">:</span> default
  <span class="token key atrule">destination</span><span class="token punctuation">:</span>
    <span class="token key atrule">create</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> pki<span class="token punctuation">-</span>tls
    <span class="token key atrule">type</span><span class="token punctuation">:</span> kubernetes.io/tls
  <span class="token key atrule">commonName</span><span class="token punctuation">:</span> localhost
  <span class="token key atrule">format</span><span class="token punctuation">:</span> pem
  <span class="token key atrule">revoke</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">clear</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">expiryOffset</span><span class="token punctuation">:</span> 15s
  <span class="token key atrule">ttl</span><span class="token punctuation">:</span> 1m
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> tls<span class="token punctuation">-</span>app
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> tls<span class="token punctuation">-</span>app
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">command</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> /agnhost
    <span class="token punctuation">-</span> netexec
    <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>http<span class="token punctuation">-</span>port
    <span class="token punctuation">-</span> <span class="token string">"8080"</span>
    <span class="token key atrule">image</span><span class="token punctuation">:</span> registry.k8s.io/e2e<span class="token punctuation">-</span>test<span class="token punctuation">-</span>images/agnhost<span class="token punctuation">:</span><span class="token number">2.39</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> tls<span class="token punctuation">-</span>app
<span class="token punctuation">---</span>
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> tls<span class="token punctuation">-</span>app<span class="token punctuation">-</span>service
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> tls<span class="token punctuation">-</span>app
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">443</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> networking.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Ingress
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> tls<span class="token punctuation">-</span>example<span class="token punctuation">-</span>ingress
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">nginx.ingress.kubernetes.io/rewrite-target</span><span class="token punctuation">:</span> /$2
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">tls</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">hosts</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> localhost
    <span class="token key atrule">secretName</span><span class="token punctuation">:</span> pki<span class="token punctuation">-</span>tls
  <span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">host</span><span class="token punctuation">:</span> localhost
    <span class="token key atrule">http</span><span class="token punctuation">:</span>
      <span class="token key atrule">paths</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">path</span><span class="token punctuation">:</span> /tls<span class="token punctuation">-</span>app(/<span class="token punctuation">|</span>$)(.<span class="token important">*)</span>
        <span class="token key atrule">pathType</span><span class="token punctuation">:</span> Prefix
        <span class="token key atrule">backend</span><span class="token punctuation">:</span>
          <span class="token key atrule">service</span><span class="token punctuation">:</span>
            <span class="token key atrule">name</span><span class="token punctuation">:</span> tls<span class="token punctuation">-</span>app<span class="token punctuation">-</span>service
            <span class="token key atrule">port</span><span class="token punctuation">:</span>
              <span class="token key atrule">number</span><span class="token punctuation">:</span> <span class="token number">443</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>인증서 확인(명령어)</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">-k</span> https://localhost:38443/tls-app/hostname
tls-app%
$ <span class="token function">curl</span> <span class="token parameter variable">-kvI</span> https://localhost:38443/tls-app/hostname
*   Trying <span class="token number">127.0</span>.0.1:38443<span class="token punctuation">..</span>.
* Connected to localhost <span class="token punctuation">(</span><span class="token number">127.0</span>.0.1<span class="token punctuation">)</span> port <span class="token number">38443</span> <span class="token punctuation">(</span><span class="token comment">#0)</span>
<span class="token comment"># 중략</span>
* Server certificate:
*  subject: <span class="token assign-left variable">CN</span><span class="token operator">=</span>localhost
*  start date: May <span class="token number">14</span> 08:04:00 <span class="token number">2023</span> GMT
*  expire date: May <span class="token number">14</span> 08:05:30 <span class="token number">2023</span> GMT
*  issuer: <span class="token assign-left variable">CN</span><span class="token operator">=</span>example.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>nginx 컨트롤러 로그를 확인하여 교체되는 TLS 시크릿을 확인:</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl logs <span class="token parameter variable">-f</span> <span class="token parameter variable">-n</span> ingress-nginx <span class="token parameter variable">-l</span> app.kubernetes.io/instance<span class="token operator">=</span>ingress-nginx
W0514 07:51:58.673604       <span class="token number">1</span> client_config.go:615<span class="token punctuation">]</span> Neither <span class="token parameter variable">--kubeconfig</span> nor <span class="token parameter variable">--master</span> was specified.  Using the inClusterConfig.  This might not work.
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"patching webhook configurations 'ingress-nginx-admission' mutating=false, validating=true, failurePolicy=Fail"</span>,<span class="token string">"source"</span><span class="token builtin class-name">:</span><span class="token string">"k8s/k8s.go:118"</span>,<span class="token string">"time"</span><span class="token builtin class-name">:</span><span class="token string">"2023-05-14T07:51:58Z"</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"Patched hook(s)"</span>,<span class="token string">"source"</span><span class="token builtin class-name">:</span><span class="token string">"k8s/k8s.go:138"</span>,<span class="token string">"time"</span><span class="token builtin class-name">:</span><span class="token string">"2023-05-14T07:51:58Z"</span><span class="token punctuation">}</span>
I0514 08:19:30.110926       <span class="token number">9</span> store.go:619<span class="token punctuation">]</span> <span class="token string">"secret was updated and it is used in ingress annotations. Parsing"</span> <span class="token assign-left variable">secret</span><span class="token operator">=</span><span class="token string">"tenant-1/pki-tls"</span>
I0514 08:19:30.113988       <span class="token number">9</span> backend_ssl.go:59<span class="token punctuation">]</span> <span class="token string">"Updating secret in local store"</span> <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">"tenant-1/pki-tls"</span>
W0514 08:19:30.114178       <span class="token number">9</span> controller.go:1406<span class="token punctuation">]</span> SSL certificate <span class="token keyword">for</span> server <span class="token string">"localhost"</span> is about to expire <span class="token punctuation">(</span><span class="token number">2023</span>-05-14 08:20:30 +0000 UTC<span class="token punctuation">)</span>
I0514 08:20:15.208102       <span class="token number">9</span> store.go:619<span class="token punctuation">]</span> <span class="token string">"secret was updated and it is used in ingress annotations. Parsing"</span> <span class="token assign-left variable">secret</span><span class="token operator">=</span><span class="token string">"tenant-1/pki-tls"</span>
I0514 08:20:15.208539       <span class="token number">9</span> backend_ssl.go:59<span class="token punctuation">]</span> <span class="token string">"Updating secret in local store"</span> <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">"tenant-1/pki-tls"</span>
W0514 08:20:15.208801       <span class="token number">9</span> controller.go:1406<span class="token punctuation">]</span> SSL certificate <span class="token keyword">for</span> server <span class="token string">"localhost"</span> is about to expire <span class="token punctuation">(</span><span class="token number">2023</span>-05-14 08:21:15 +0000 UTC<span class="token punctuation">)</span>
W0514 08:20:18.543113       <span class="token number">9</span> controller.go:1406<span class="token punctuation">]</span> SSL certificate <span class="token keyword">for</span> server <span class="token string">"localhost"</span> is about to expire <span class="token punctuation">(</span><span class="token number">2023</span>-05-14 08:21:15 +0000 UTC<span class="token punctuation">)</span>
I0514 08:21:00.107794       <span class="token number">9</span> store.go:619<span class="token punctuation">]</span> <span class="token string">"secret was updated and it is used in ingress annotations. Parsing"</span> <span class="token assign-left variable">secret</span><span class="token operator">=</span><span class="token string">"tenant-1/pki-tls"</span>
I0514 08:21:00.108127       <span class="token number">9</span> backend_ssl.go:59<span class="token punctuation">]</span> <span class="token string">"Updating secret in local store"</span> <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">"tenant-1/pki-tls"</span>
W0514 08:21:00.108295       <span class="token number">9</span> controller.go:1406<span class="token punctuation">]</span> SSL certificate <span class="token keyword">for</span> server <span class="token string">"localhost"</span> is about to expire <span class="token punctuation">(</span><span class="token number">2023</span>-05-14 08:22:00 +0000 UTC<span class="token punctuation">)</span>
W0514 07:51:58.418022       <span class="token number">1</span> client_config.go:615<span class="token punctuation">]</span> Neither <span class="token parameter variable">--kubeconfig</span> nor <span class="token parameter variable">--master</span> was specified.  Using the inClusterConfig.  This might not work.
<span class="token punctuation">{</span><span class="token string">"err"</span><span class="token builtin class-name">:</span><span class="token string">"secrets <span class="token entity" title="\&quot;">\"</span>ingress-nginx-admission<span class="token entity" title="\&quot;">\"</span> not found"</span>,<span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"no secret found"</span>,<span class="token string">"source"</span><span class="token builtin class-name">:</span><span class="token string">"k8s/k8s.go:229"</span>,<span class="token string">"time"</span><span class="token builtin class-name">:</span><span class="token string">"2023-05-14T07:51:58Z"</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token string">"level"</span><span class="token builtin class-name">:</span><span class="token string">"info"</span>,<span class="token string">"msg"</span><span class="token builtin class-name">:</span><span class="token string">"creating new secret"</span>,<span class="token string">"source"</span><span class="token builtin class-name">:</span><span class="token string">"cmd/create.go:28"</span>,<span class="token string">"time"</span><span class="token builtin class-name">:</span><span class="token string">"2023-05-14T07:51:58Z"</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>인증서 생성/만료 시간 확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/sD28Mg.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>인증서 생성/만료 시간 변경 확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/8bhJgt.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>인증서 생성/만료 시간 확인(브라우저)</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/MicUWH.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>인증서 생성/만료 변경 확인(브라우저)</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/ljNFGC.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h4 id="_3-vaultstaticsecret-예제" tabindex="-1"><a class="header-anchor" href="#_3-vaultstaticsecret-예제" aria-hidden="true">#</a> (3) <code v-pre>VaultStaticSecret</code> 예제 :</h4>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Secret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> secret1
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
<span class="token key atrule">type</span><span class="token punctuation">:</span> Opaque
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultStaticSecret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vaultstaticsecret<span class="token punctuation">-</span>sample<span class="token punctuation">-</span>tenant<span class="token punctuation">-</span><span class="token number">1</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token comment"># namespace: cluster1/tenant-1</span>
  <span class="token key atrule">vaultAuthRef</span><span class="token punctuation">:</span> vaultauth<span class="token punctuation">-</span>sample
  <span class="token key atrule">mount</span><span class="token punctuation">:</span> kvv2
  <span class="token key atrule">type</span><span class="token punctuation">:</span> kv<span class="token punctuation">-</span>v2
  <span class="token key atrule">name</span><span class="token punctuation">:</span> secret
  <span class="token key atrule">refreshAfter</span><span class="token punctuation">:</span> 5s
  <span class="token key atrule">destination</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> secret1
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Secret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> secret1
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">2</span>
<span class="token key atrule">type</span><span class="token punctuation">:</span> Opaque
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultStaticSecret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">2</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vaultstaticsecret<span class="token punctuation">-</span>sample<span class="token punctuation">-</span>tenant<span class="token punctuation">-</span><span class="token number">2</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token comment"># namespace: cluster1/tenant-2</span>
  <span class="token key atrule">vaultAuthRef</span><span class="token punctuation">:</span> vaultauth<span class="token punctuation">-</span>sample
  <span class="token key atrule">mount</span><span class="token punctuation">:</span> kvv1
  <span class="token key atrule">type</span><span class="token punctuation">:</span> kv<span class="token punctuation">-</span>v1
  <span class="token key atrule">name</span><span class="token punctuation">:</span> secret
  <span class="token key atrule">refreshAfter</span><span class="token punctuation">:</span> 5s
  <span class="token key atrule">destination</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> secret1
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> app1
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
    <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> secrets
      <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">"/etc/secrets"</span>
      <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> secrets
    <span class="token key atrule">secret</span><span class="token punctuation">:</span>
      <span class="token key atrule">secretName</span><span class="token punctuation">:</span> secret1
      <span class="token key atrule">optional</span><span class="token punctuation">:</span> <span class="token boolean important">false</span> <span class="token comment"># default setting; "mysecret" must exist</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> app1
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">2</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> nginx
    <span class="token key atrule">image</span><span class="token punctuation">:</span> nginx
    <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> secrets
      <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">"/etc/secrets"</span>
      <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> secrets
    <span class="token key atrule">secret</span><span class="token punctuation">:</span>
      <span class="token key atrule">secretName</span><span class="token punctuation">:</span> secret1
      <span class="token key atrule">optional</span><span class="token punctuation">:</span> <span class="token boolean important">false</span> <span class="token comment"># default setting; "mysecret" must exist</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_5-vaultdynamicsecret" tabindex="-1"><a class="header-anchor" href="#_5-vaultdynamicsecret" aria-hidden="true">#</a> (5) <code v-pre>VaultDynamicSecret</code></h4>
<blockquote>
<p>🔥 업데이트 예정</p>
</blockquote>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultDynamicSecret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app.kubernetes.io/name</span><span class="token punctuation">:</span> vaultdynamicsecret
    <span class="token key atrule">app.kubernetes.io/instance</span><span class="token punctuation">:</span> vaultdynamicsecret<span class="token punctuation">-</span>sample
    <span class="token key atrule">app.kubernetes.io/part-of</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>secrets<span class="token punctuation">-</span>operator
    <span class="token key atrule">app.kubernetes.io/managed-by</span><span class="token punctuation">:</span> kustomize
    <span class="token key atrule">app.kubernetes.io/created-by</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>secrets<span class="token punctuation">-</span>operator
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vaultdynamicsecret<span class="token punctuation">-</span>sample
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token comment"># TODO(user): Add fields here</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-리소스-삭제" tabindex="-1"><a class="header-anchor" href="#_6-리소스-삭제" aria-hidden="true">#</a> 6. 리소스 삭제</h2>
<p>샘플 삭제:</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># K8s 리소스 삭제</span>
$ kubectl delete <span class="token parameter variable">-k</span> config/samples

<span class="token comment"># kind 클러스터 삭제</span>
$ kind delete clusters vault-secrets-operator
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-테라폼-기반-데모" tabindex="-1"><a class="header-anchor" href="#_2-테라폼-기반-데모" aria-hidden="true">#</a> 2. [테라폼 기반 데모](</h2>
</div></template>


