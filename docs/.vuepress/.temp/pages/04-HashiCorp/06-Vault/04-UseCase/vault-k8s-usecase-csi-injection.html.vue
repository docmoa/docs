<template><div><h1 id="vault-with-k8s-csi-injection" tabindex="-1"><a class="header-anchor" href="#vault-with-k8s-csi-injection" aria-hidden="true">#</a> Vault with K8s (CSI &amp; Injection)</h1>
<h2 id="_1-csi" tabindex="-1"><a class="header-anchor" href="#_1-csi" aria-hidden="true">#</a> 1. CSI</h2>
<blockquote>
<p>참고 : <a href="https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-secret-store-driver" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/vault/tutorials/kubernetes/kubernetes-secret-store-driver<ExternalLinkIcon/></a></p>
</blockquote>
<p>CSI 방식에서는 <code v-pre>SecretProviderClass</code> 가 Vault의 정보를 구성하는 역할을 수행하고, 이후 <code v-pre>deployment</code>에서 볼륨 형태로 호출하는 방식으로 구성된다.</p>
<h3 id="_1-1-secretproviderclass-구성" tabindex="-1"><a class="header-anchor" href="#_1-1-secretproviderclass-구성" aria-hidden="true">#</a> 1.1 SecretProviderClass 구성</h3>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> secrets<span class="token punctuation">-</span>store.csi.x<span class="token punctuation">-</span>k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> SecretProviderClass
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>database <span class="token comment"># CSI Provider로 호출될 이름</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">provider</span><span class="token punctuation">:</span> vault <span class="token comment"># CSI Provider 유형</span>
  <span class="token key atrule">parameters</span><span class="token punctuation">:</span>
  	<span class="token comment"># Vault에 구성한 Kubernetes 인증의 Role 이름</span>
	  <span class="token key atrule">roleName</span><span class="token punctuation">:</span> <span class="token string">'app'</span>
	  <span class="token comment"># Vault 주소</span>
    <span class="token key atrule">vaultAddress</span><span class="token punctuation">:</span> <span class="token string">"https://vault.default:8200"</span>
    <span class="token comment"># TLS CA 인증서</span>
    <span class="token key atrule">vaultCACertPath</span><span class="token punctuation">:</span> <span class="token string">'/vault/tls/ca.crt'</span>
    <span class="token key atrule">roleName</span><span class="token punctuation">:</span> <span class="token string">"database"</span>
    <span class="token key atrule">objects</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
      - objectName: "dbUsername"
        secretPath: "database/creds/db-app"
        secretKey: "username"
      - objectName: "dbPassword"
        secretPath: "database/creds/db-app"
        secretKey: "password"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>objects 항목은 리스트 구성으로 다수개의 시크릿을 정의할 수 있다.</p>
<ul>
<li><code v-pre>objectName</code> : 해당 시크릿을 가리키는 이름으로, 최종적으로 이 이름으로 파일이 생성됨</li>
<li><code v-pre>secretPath</code> : Vault에 정의된 시크릿 경로</li>
<li><code v-pre>secretKey</code> : Vault의 시크릿 경로 호출시 반환되는 값의 키 이름</li>
</ul>
<h3 id="_1-2-pod에-마운트하기" tabindex="-1"><a class="header-anchor" href="#_1-2-pod에-마운트하기" aria-hidden="true">#</a> 1.2 Pod에 마운트하기</h3>
<p>앞서 생성된 <code v-pre>SecretProviderClass</code>를 <code v-pre>Volume</code>으로 정의하여 대상 Pod에 마운트 시킨다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> Pod
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> webapp
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">serviceAccountName</span><span class="token punctuation">:</span> webapp<span class="token punctuation">-</span>sa
  <span class="token key atrule">containers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">image</span><span class="token punctuation">:</span> jweissig/app<span class="token punctuation">:</span>0.0.1
    <span class="token key atrule">name</span><span class="token punctuation">:</span> webapp
    <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
    	<span class="token comment"># volumes에서 정의한 csi 이름</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> secrets<span class="token punctuation">-</span>store<span class="token punctuation">-</span>inline
    	<span class="token comment"># Pod에 마운트할 경로 지정</span>
    	<span class="token comment"># 해당 경로 상에 SecretProviderClass에서 정의한 objectName으로 파일이 생성됨</span>
      <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> <span class="token string">"/mnt/secrets-store"</span>
      <span class="token comment"># 마운트된 파일의 읽기/쓰기 여부</span>
      <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
  	  <span class="token comment"># volumeMounts에서 정의될 이름</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> secrets<span class="token punctuation">-</span>store<span class="token punctuation">-</span>inline
      <span class="token key atrule">csi</span><span class="token punctuation">:</span>
        <span class="token key atrule">driver</span><span class="token punctuation">:</span> secrets<span class="token punctuation">-</span>store.csi.k8s.io
        <span class="token comment"># 마운트된 파일의 읽기/쓰기 여부</span>
        <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
        <span class="token key atrule">volumeAttributes</span><span class="token punctuation">:</span>
        	<span class="token comment"># SecretProviderClass로 정의한 이름</span>
          <span class="token key atrule">secretProviderClass</span><span class="token punctuation">:</span> <span class="token string">"vault-database"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl <span class="token builtin class-name">exec</span> webapp -- <span class="token function">cat</span> /mnt/secrets-store/dbUsername
db-username-from-vault

$ kubectl <span class="token builtin class-name">exec</span> webapp -- <span class="token function">cat</span> /mnt/secrets-store/dbPassword
db-password-from-vault
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-injecting" tabindex="-1"><a class="header-anchor" href="#_2-injecting" aria-hidden="true">#</a> 2. Injecting</h2>
<blockquote>
<p>참고 1 :<a href="https://www.hashicorp.com/blog/injecting-vault-secrets-into-kubernetes-pods-via-a-sidecar" target="_blank" rel="noopener noreferrer">https://www.hashicorp.com/blog/injecting-vault-secrets-into-kubernetes-pods-via-a-sidecar<ExternalLinkIcon/></a></p>
<p>참고 2 : <a href="https://developer.hashicorp.com/vault/docs/platform/k8s/injector/annotations" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/vault/docs/platform/k8s/injector/annotations<ExternalLinkIcon/></a></p>
<p>참고 3 : <a href="https://devopscube.com/vault-agent-injector-tutorial/" target="_blank" rel="noopener noreferrer">https://devopscube.com/vault-agent-injector-tutorial/<ExternalLinkIcon/></a></p>
</blockquote>
<p>Injecting 방식은 deployment 동작이 실행되는 시점에 <code v-pre>annotation</code>에 정의된 내용이 <code v-pre>vault-k8s</code> webhook을 호출하여 Pod를 재정의하는 방식입니다.</p>
<p>아래 <code v-pre>Deployment</code> 정의는 <code v-pre>ServiceAccount</code>인 <code v-pre>app</code>은 Vault에 Kubernetes 인증으로 등록되었다고 가정합니다.</p>
<ul>
<li><a href="http://vault.hashicorp.com/agent-inject-secret-" target="_blank" rel="noopener noreferrer">vault.hashicorp.com/agent-inject-secret-<ExternalLinkIcon/></a>&lt;filename&gt; : <code v-pre>filename</code>영역에 문자 값으로 자동 랜더링하여 저장</li>
<li><a href="http://vault.hashicorp.com/agent-inject-template-" target="_blank" rel="noopener noreferrer">vault.hashicorp.com/agent-inject-template-<ExternalLinkIcon/></a>&lt;filename&gt; : <code v-pre>filename</code>영역의 문자값으로 파일을 생성할 때 사용자 정의 방식이 필요한 경우 사용</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> app
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>agent<span class="token punctuation">-</span>demo
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>agent<span class="token punctuation">-</span>demo
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">vault.hashicorp.com/agent-inject</span><span class="token punctuation">:</span> <span class="token string">"true"</span>
        <span class="token key atrule">vault.hashicorp.com/agent-inject-status</span><span class="token punctuation">:</span> <span class="token string">"update"</span>
        <span class="token key atrule">vault.hashicorp.com/agent-inject-secret-database-config.txt</span><span class="token punctuation">:</span> <span class="token string">'database/roles/app'</span>
        <span class="token key atrule">vault.hashicorp.com/agent-inject-template-database-config.txt</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
          {{- with secret "database/creds/db-app" -}}
          username={{ .Data.username }}
          password={{ .Data.password }}
          {{- end }}</span>
        <span class="token comment"># Vault의 Kubernetes인증으로 등록되어있는 Role 이름</span>
        <span class="token key atrule">vault.hashicorp.com/role</span><span class="token punctuation">:</span> <span class="token string">"myapp"</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>agent<span class="token punctuation">-</span>demo
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">serviceAccountName</span><span class="token punctuation">:</span> app
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> app
        <span class="token key atrule">image</span><span class="token punctuation">:</span> jweissig/app<span class="token punctuation">:</span>0.0.1
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token comment"># Vault의 Kubernetes인증으로 등록되어있는 Role의 인증 대상 SA</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> app
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> vault<span class="token punctuation">-</span>agent<span class="token punctuation">-</span>demo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-ti</span> app-XXXXXXXXX <span class="token parameter variable">-c</span> app -- <span class="token function">cat</span> /vault/secrets/database-config.txt
<span class="token assign-left variable">username</span><span class="token operator">=</span>db-username-from-vault
<span class="token assign-left variable">password</span><span class="token operator">=</span>db-password-from-vault
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>기본 마운트 경로가 <code v-pre>/vault/secrets/&lt;file-name&gt;</code> 이므로, 변경이 필요한경우 다음의 <code v-pre>annotation</code> 정의를 추가할수 있다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token comment">## 생략 ##</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
	<span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
      	<span class="token comment">## 생략 ##</span>
				<span class="token key atrule">vault.hashicorp.com/agent-inject-file-database-config</span><span class="token punctuation">:</span> <span class="token string">"/some/secret/here.txt"</span>
				<span class="token key atrule">vault.hashicorp.com/secret-volume-path-database-config</span><span class="token punctuation">:</span> <span class="token string">"/app"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>결과 : <code v-pre>/app/some/secret/here.txt</code></p>
</div></template>


