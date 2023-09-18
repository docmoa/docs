<template><div><h1 id="jenkins-with-vault" tabindex="-1"><a class="header-anchor" href="#jenkins-with-vault" aria-hidden="true">#</a> jenkins with vault</h1>
<p>jenkins와 vault를 연동하여 pipe line에서 kv 사용하기<br>
이 예제는 진짜 kv까지만 테스트함</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># approle 엔진 생성</span>
$ vault auth <span class="token builtin class-name">enable</span> approle
<span class="token comment"># kv2 enable</span>
$ vault secrets <span class="token builtin class-name">enable</span> kv-v2
<span class="token comment"># kv enable</span>
$ vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>kv kv

<span class="token comment"># jenkins 정책으로 될 파일 생성 v1, v2</span>
$ <span class="token function">tee</span> jenkins-policy.hcl <span class="token operator">&lt;&lt;</span><span class="token string">EOF
path "kv/secret/data/jenkins/*" {
  capabilities = [ "read" ]
}
path "kv-v2/data/jenkins/*" {
  capabilities = [ "read" ]
}
EOF</span>

<span class="token comment">#jenkins 정책 생성</span>
vault policy <span class="token function">write</span> jenkins jenkins-policy.hcl

<span class="token comment">#approle 생성 및 정책 jenkins에 연결</span>
vault <span class="token function">write</span> auth/approle/role/jenkins <span class="token assign-left variable">token_policies</span><span class="token operator">=</span><span class="token string">"jenkins"</span> <span class="token punctuation">\</span>
<span class="token assign-left variable">token_ttl</span><span class="token operator">=</span>1h <span class="token assign-left variable">token_max_ttl</span><span class="token operator">=</span>4h
 
<span class="token comment">#Role id, secret id 가져오기</span>

vault <span class="token builtin class-name">read</span> auth/approle/role/jenkins/role-id
vault <span class="token function">write</span> <span class="token parameter variable">-f</span> auth/approle/role/jenkins/secret-id


vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>kv kv
$ <span class="token function">tee</span> gitlab.json <span class="token operator">&lt;&lt;</span><span class="token string">EOF
{
  "gitlabIP": "172.21.2.52",
  "api-key": "RjLAbbWsSAzXoyBvo2qL"
}
EOF</span>

<span class="token function">tee</span> gitlab-v2.json <span class="token operator">&lt;&lt;</span><span class="token string">EOF
{
  "gitlabIP": "172.21.2.52",
  "api-key": "RjLAbbWsSAzXoyBvo2qL",
  "version": "v2"
}
EOF</span>

vault kv put kv/secret/data/jenkins/gitlab @gitlab.json
vault kv put kv-v2/jenkins/gitlab @gitlab-v2.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="v1-pipe-line" tabindex="-1"><a class="header-anchor" href="#v1-pipe-line" aria-hidden="true">#</a> v1 pipe line</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># jenkins pipe line v1</span>
def secrets <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">[</span>path: <span class="token string">'kv%2Fsecret/data/jenkins/gitlab'</span>, engineVersion:1, secretValues: <span class="token punctuation">[</span>
    <span class="token punctuation">[</span>envVar: <span class="token string">'gitlabIP'</span>, vaultKey: <span class="token string">'gitlabIP'</span><span class="token punctuation">]</span>,
    <span class="token punctuation">[</span>envVar: <span class="token string">'API_KEY'</span>, vaultKey: <span class="token string">'api-key'</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">]</span>,
<span class="token punctuation">]</span>
def configuration <span class="token operator">=</span> <span class="token punctuation">[</span>vaultUrl: <span class="token string">'http://172.21.2.50:8200'</span>,  vaultCredentialId: <span class="token string">'vault-approle'</span>, engineVersion: <span class="token number">1</span><span class="token punctuation">]</span>

pipeline <span class="token punctuation">{</span>
    agent any
    options <span class="token punctuation">{</span>
        buildDiscarder<span class="token punctuation">(</span>logRotator<span class="token punctuation">(</span>numToKeepStr: <span class="token string">'20'</span><span class="token punctuation">))</span>
        disableConcurrentBuilds<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    stages<span class="token punctuation">{</span>   
      stage<span class="token punctuation">(</span><span class="token string">'Vault'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        steps <span class="token punctuation">{</span>
          withVault<span class="token punctuation">(</span><span class="token punctuation">[</span>configuration: configuration, vaultSecrets: secrets<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">sh</span> <span class="token string">"echo <span class="token variable">$gitlabIP</span>"</span>
            <span class="token function">sh</span> <span class="token string">"echo <span class="token variable">${env.API_KEY}</span>"</span>
            <span class="token function">sh</span> <span class="token string">"curl -v <span class="token variable">$gitlabIP</span>"</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>  
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="v2-pipe-line" tabindex="-1"><a class="header-anchor" href="#v2-pipe-line" aria-hidden="true">#</a> v2 pipe line</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># jenkins pipe line v2</span>
def secrets <span class="token operator">=</span> <span class="token punctuation">[</span>
  <span class="token punctuation">[</span>path: <span class="token string">'kv-v2/jenkins/gitlab'</span>, engineVersion:2, secretValues: <span class="token punctuation">[</span>
    <span class="token punctuation">[</span>envVar: <span class="token string">'gitlabIP'</span>, vaultKey: <span class="token string">'gitlabIP'</span><span class="token punctuation">]</span>,
    <span class="token punctuation">[</span>envVar: <span class="token string">'API_KEY'</span>, vaultKey: <span class="token string">'api-key'</span><span class="token punctuation">]</span>,
    <span class="token punctuation">[</span>envVar: <span class="token string">'version2'</span>, vaultKey: <span class="token string">'version'</span><span class="token punctuation">]</span><span class="token punctuation">]</span><span class="token punctuation">]</span>
<span class="token punctuation">]</span>

def configuration <span class="token operator">=</span> <span class="token punctuation">[</span>vaultUrl: <span class="token string">'http://172.21.2.50:8200'</span>,  vaultCredentialId: <span class="token string">'vault-approle'</span>, engineVersion: <span class="token number">2</span><span class="token punctuation">]</span>
                      
pipeline <span class="token punctuation">{</span>
    agent any
    options <span class="token punctuation">{</span>
        buildDiscarder<span class="token punctuation">(</span>logRotator<span class="token punctuation">(</span>numToKeepStr: <span class="token string">'20'</span><span class="token punctuation">))</span>
        disableConcurrentBuilds<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    stages<span class="token punctuation">{</span>   
      stage<span class="token punctuation">(</span><span class="token string">'Vault'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        steps <span class="token punctuation">{</span>
          withVault<span class="token punctuation">(</span><span class="token punctuation">[</span>configuration: configuration, vaultSecrets: secrets<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">sh</span> <span class="token string">"echo <span class="token variable">${env.API_KEY}</span>"</span>
            <span class="token function">sh</span> <span class="token string">"echo <span class="token variable">${env.version2}</span>"</span>
            <span class="token function">sh</span> <span class="token string">"curl -v <span class="token variable">${env.gitlabIP}</span>"</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>  
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


