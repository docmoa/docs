<template><div><h1 id="vault-secrets-operator-개요" tabindex="-1"><a class="header-anchor" href="#vault-secrets-operator-개요" aria-hidden="true">#</a> Vault Secrets Operator 개요</h1>
<blockquote>
<p>참고:<br>
현재 Vault 비밀 오퍼레이터는 공개 베타 버전입니다. *<a href="https://github.com/hashicorp/vault-secrets-operator/issues" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>*에서 GitHub 이슈를 개설하여 피드백을 제공해 주세요.</p>
</blockquote>
<figure><img src="https://external-preview.redd.it/UWYqK9zEwREq18MnMbIC7T6W5mUJbF_i4C2K3T1cV6Y.jpg?width=640&amp;crop=smart&amp;auto=webp&amp;s=927dad31a962359c0b61c5ae57ce1d57f6957cf7" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>Vault Secrets Operator(이하, VSO)를 사용하면 파드가 쿠버네티스 시크릿에서 기본적으로 볼트 시크릿을 사용할 수 있다.</p>
<h2 id="개요" tabindex="-1"><a class="header-anchor" href="#개요" aria-hidden="true">#</a> 개요</h2>
<p>VSO는 지원되는 Custom Resource Definitions (CRD) 집합의 변경 사항을 감시하여 작동한다. 각 CRD는 오퍼레이터가 Vault Secrets을 Kubernetes Secret에 동기화할 수 있도록 하는 데 필요한 사양(specification)을 제공한다.</p>
<p>오퍼레이터는 소스(source) 볼트 시크릿 데이터를 대상(destination) 쿠버네티스 시크릿에 직접 쓰며, 소스에 대한 변경 사항이 수명 기간 동안 대상에 복제되도록 한다. 이러한 방식으로 애플리케이션은 대상 시크릿에 대한 접근 권한만 있으면 그 안에 포함된 시크릿 데이터를 사용할 수 있다.</p>
<h3 id="특징" tabindex="-1"><a class="header-anchor" href="#특징" aria-hidden="true">#</a> 특징</h3>
<p>VSO가 지원하는 기능은 다음과 같다:</p>
<ul>
<li>모든 Vault 비밀 엔진 지원.</li>
<li>Vault와의 TLS/mTLS 통신.</li>
<li><a href="https://developer.hashicorp.com/vault/docs/auth/kubernetes" target="_blank" rel="noopener noreferrer">Kubernetes Auth Method<ExternalLinkIcon/></a>을 통해 요청하는 <code v-pre>Pod</code>의 <code v-pre>ServiceAccount</code>를 사용한 인증.</li>
<li>Vault Secrets을 Kubernetes Secrets에 동기화.</li>
<li><code v-pre>Deployment</code>, <code v-pre> ReplicaSet</code>, <code v-pre>StatefulSet</code>  쿠버네티스 리소스 유형에 대한 시크릿 로테이션.</li>
<li>운영자 모니터링을 위한 Prometheus 계측(instrumentation) 제공.</li>
<li>지원되는 설치 방법: <code v-pre>Helm</code>, <code v-pre>Kustomize</code></li>
<li>자세한 내용은 <em><a href="https://developer.hashicorp.com/vault/docs/platform/k8s/vso/installation" target="_blank" rel="noopener noreferrer">installation<ExternalLinkIcon/></a></em> 문서를 참조.</li>
</ul>
<h2 id="지원되는-쿠버네티스-버전" tabindex="-1"><a class="header-anchor" href="#지원되는-쿠버네티스-버전" aria-hidden="true">#</a> 지원되는 쿠버네티스 버전</h2>
<p>현재 지원되는 <a href="https://kubernetes.io/releases/" target="_blank" rel="noopener noreferrer">Kubernetes minor releases<ExternalLinkIcon/></a>는 다음과 같다. 최신 버전은 각 쿠버네티스 버전에 대해 테스트되며, 다른 버전의 Kubernetes에서도 작동할 수 있지만 지원되지는 않는다.</p>
<ul>
<li>1.26</li>
<li>1.25</li>
<li>1.24</li>
<li>1.23</li>
<li>1.22</li>
</ul>
<h2 id="vault-접근-및-사용자-지정-리소스-정의" tabindex="-1"><a class="header-anchor" href="#vault-접근-및-사용자-지정-리소스-정의" aria-hidden="true">#</a> Vault 접근 및 사용자 지정 리소스 정의</h2>
<blockquote>
<p>참고:<br>
현재, 오퍼레이터는 쿠버네티스 인증 방법만 지원한다. 시간이 지남에 따라 더 많은 Vault 인증 방식에 대한 지원을 추가할 예정이다.</p>
</blockquote>
<p>Vault 연결 및 인증 구성은 <code v-pre>VaultConnection</code> 및 <code v-pre>VaultAuth</code> CRD에서 제공한다. 이는 모든 비밀 복제 유형 리소스가 참조하는 기본 사용자 지정 리소스로 간주할 수 있다.</p>
<h3 id="vaultconnection-커스텀-리소스" tabindex="-1"><a class="header-anchor" href="#vaultconnection-커스텀-리소스" aria-hidden="true">#</a> <code v-pre>VaultConnection</code> 커스텀 리소스</h3>
<p>오퍼레이터가 단일 Vault 서버 인스턴스에 연결하는 데 필요한 구성을 제공한다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultConnection
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> vso<span class="token punctuation">-</span>example
  <span class="token key atrule">name</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token comment"># 필수적인 구성정보</span>
  <span class="token comment"># Vault 서버 주소</span>
  <span class="token key atrule">address</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//vault.vault.svc.cluster.local<span class="token punctuation">:</span><span class="token number">8200</span>

  <span class="token comment"># 선택적인 구성정보</span>
  <span class="token comment"># 모든 Vault 요청에 포함될 HTTP headers</span>
  <span class="token comment"># headers: []</span>
  
  <span class="token comment"># TLS 연결의 SNI 호스트로 사용할 TLS 서버 이름</span>
  <span class="token comment"># tlsServerName: ""</span>
  
  <span class="token comment"># Vault에 대한 TLS 연결에 대한 TLS verification을 건너뜀</span>
  <span class="token comment"># skipTLSVerify: false</span>
 
  <span class="token comment"># Kubernetes Secret에 저장된 신뢰할 수 있는 PEM 인코딩된 CA 인증서 체인</span>
  <span class="token comment"># caCertSecretRef: ""</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vaultauth-커스텀-리소스" tabindex="-1"><a class="header-anchor" href="#vaultauth-커스텀-리소스" aria-hidden="true">#</a> VaultAuth 커스텀 리소스</h3>
<p>오퍼레이터가 <code v-pre>VaultConnection</code> 사용자 지정 리소스에 지정된 대로 단일 Vault 서버 인스턴스에 인증하는 데 필요한 구성을 제공한다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultAuth
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> vso<span class="token punctuation">-</span>example
  <span class="token key atrule">name</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token comment"># 필수적인 구성정보</span>
  <span class="token comment"># 해당 VaultConnection 커스텀 리소스의 VaultConnectionRef</span>
  <span class="token comment"># 값을 지정하지 않으면 오퍼레이터는 자체 쿠버네티스 네임스페이스에 구성된 </span>
  <span class="token comment"># 'default' VaultConnection을 기본값으로 사용</span>
  <span class="token key atrule">vaultConnectionRef</span><span class="token punctuation">:</span> example

  <span class="token comment"># Vault에 인증할 때 사용하는 방법.</span>
  <span class="token key atrule">method</span><span class="token punctuation">:</span> kubernetes
  <span class="token comment"># Auth methods로 인증할 때 사용할 마운트.</span>
  <span class="token key atrule">mount</span><span class="token punctuation">:</span> kubernetes
  <span class="token comment"># 쿠버네티스용 인증 구성을 사용하려면, Method를 쿠버네티스로 설정해야 함</span>
  <span class="token key atrule">kubernetes</span><span class="token punctuation">:</span>
    <span class="token comment"># Vault에 인증할 때 사용할 역할</span>
    <span class="token key atrule">role</span><span class="token punctuation">:</span> example
    <span class="token comment"># Vault에 인증할 때 사용할 서비스어카운트 파드/애플리케이션당 항상 고유한 서비스어카운트를 제공을 권장</span>
    <span class="token key atrule">serviceAccount</span><span class="token punctuation">:</span> default

  <span class="token comment"># 선택적인 구성정보</span>
  <span class="token comment"># 인증 백엔드가 마운트되는 Vault 네임스페이스(Vault Enterprise 전용기능)</span>
  <span class="token comment"># namespace: ""</span>

  <span class="token comment"># Vault에 인증할 때 사용할 매개변수</span>
  <span class="token comment"># params: []</span>

  <span class="token comment"># 모든 Vault 인증 요청에 포함할 HTTP 헤더</span>
  <span class="token comment"># headers: []</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="볼트-시크릿-커스텀-리소스-정의" tabindex="-1"><a class="header-anchor" href="#볼트-시크릿-커스텀-리소스-정의" aria-hidden="true">#</a> 볼트 시크릿 커스텀 리소스 정의</h2>
<p>오퍼레이터가 단일 볼트 시크릿을 단일 쿠버네티스 시크릿으로 복제하는 데 필요한 구성을 제공한다. 지원되는 각 CRD는 아래 문서에 설명된 Vault Secret의 <em>Class</em>에 특화되어 있다.</p>
<h3 id="vaultstaticsecret-사용자-지정-리소스" tabindex="-1"><a class="header-anchor" href="#vaultstaticsecret-사용자-지정-리소스" aria-hidden="true">#</a> <code v-pre>VaultStaticSecret</code> 사용자 지정 리소스</h3>
<p>오퍼레이터가 단일 볼트 정적 시크릿을 단일 Kubernetes Secret에 동기화하는 데 필요한 구성을 제공한다.</p>
<ul>
<li>지원되는 시크릿 엔진: <a href="https://developer.hashicorp.com/vault/docs/secrets/kv/kv-v2" target="_blank" rel="noopener noreferrer">kv-v2<ExternalLinkIcon/></a>, <a href="https://developer.hashicorp.com/vault/docs/secrets/kv/kv-v1" target="_blank" rel="noopener noreferrer">kv-v1<ExternalLinkIcon/></a></li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultStaticSecret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> vso<span class="token punctuation">-</span>example
  <span class="token key atrule">name</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">vaultAuthRef</span><span class="token punctuation">:</span> example
  <span class="token key atrule">mount</span><span class="token punctuation">:</span> kvv2
  <span class="token key atrule">type</span><span class="token punctuation">:</span> kv<span class="token punctuation">-</span>v2
  <span class="token key atrule">name</span><span class="token punctuation">:</span> secret
  <span class="token key atrule">refreshAfter</span><span class="token punctuation">:</span> 60s
  <span class="token key atrule">destination</span><span class="token punctuation">:</span>
    <span class="token key atrule">create</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>secret1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vaultpkisecret-사용자-지정-리소스" tabindex="-1"><a class="header-anchor" href="#vaultpkisecret-사용자-지정-리소스" aria-hidden="true">#</a> <code v-pre>VaultPKISecret</code> 사용자 지정 리소스</h3>
<p>운영자가 단일 볼트 PKI 시크릿을 단일 쿠버네티스 시크릿에 동기화하는 데 필요한 구성을 제공한다.</p>
<ul>
<li>지원되는 비밀 엔진: pki</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultPKISecret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> vso<span class="token punctuation">-</span>example
  <span class="token key atrule">name</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">vaultAuthRef</span><span class="token punctuation">:</span> example
  <span class="token key atrule">mount</span><span class="token punctuation">:</span> pki
  <span class="token key atrule">name</span><span class="token punctuation">:</span> default
  <span class="token key atrule">commonName</span><span class="token punctuation">:</span> example.com
  <span class="token key atrule">format</span><span class="token punctuation">:</span> pem
  <span class="token key atrule">expiryOffset</span><span class="token punctuation">:</span> 1s
  <span class="token key atrule">ttl</span><span class="token punctuation">:</span> 60s
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> tenant<span class="token punctuation">-</span><span class="token number">1</span>
  <span class="token key atrule">destination</span><span class="token punctuation">:</span>
    <span class="token key atrule">create</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> pki1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="vaultdynamicsecret-custom-resource" tabindex="-1"><a class="header-anchor" href="#vaultdynamicsecret-custom-resource" aria-hidden="true">#</a> VaultDynamicSecret Custom Resource</h3>
<p>오퍼레이터가 단일 볼트 동적 시크릿을 단일 쿠버네티스 시크릿에 동기화하는 데 필요한 구성을 제공한다.</p>
<ul>
<li>지원되는 시크릿 엔진은 전부가 아님 : <a href="https://developer.hashicorp.com/vault/docs/secrets/databases" target="_blank" rel="noopener noreferrer">databases<ExternalLinkIcon/></a>, <a href="https://developer.hashicorp.com/vault/docs/secrets/aws" target="_blank" rel="noopener noreferrer">aws<ExternalLinkIcon/></a>, <a href="https://developer.hashicorp.com/vault/docs/secrets/azure" target="_blank" rel="noopener noreferrer">azure<ExternalLinkIcon/></a>, <a href="https://developer.hashicorp.com/vault/docs/secrets/gcp" target="_blank" rel="noopener noreferrer">gcp<ExternalLinkIcon/></a>, ...</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> VaultDynamicSecret
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> vso<span class="token punctuation">-</span>example
  <span class="token key atrule">name</span><span class="token punctuation">:</span> example
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">vaultAuthRef</span><span class="token punctuation">:</span> example
  <span class="token key atrule">mount</span><span class="token punctuation">:</span> db
  <span class="token key atrule">role</span><span class="token punctuation">:</span> postgres
  <span class="token key atrule">destination</span><span class="token punctuation">:</span>
    <span class="token key atrule">create</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> dynamic1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


