<template><div><h1 id="jenkins-pipeline-vault-approle-with-nomad" tabindex="-1"><a class="header-anchor" href="#jenkins-pipeline-vault-approle-with-nomad" aria-hidden="true">#</a> Jenkins Pipeline Vault Approle (with Nomad)</h1>
<p>Vault의 AppRole 인증 방식은 Vault Token을 얻기위한 단기 자격증명을 사용하는 장점이 있지만 자동화된 환경에 어울리는(반대로 사람에게 불편한)방식으로 Vault를 이용하는 애플리케이션/스크립트의 배포 파이프라인을 구성하는 방식을 추천합니다.</p>
<Mermaid id="mermaid-6" code="eJxTVVVwrUjMLchJVchPUwhLLM0pUXAsKAjKBwoUpxaWpuYlp3IpwJkumYnpRYm5QBEFBceU3Mw8XTs7sCYruC4QoQPiKQTk52QmVyq8aZ77pmUjPi1vZ/W+njyXZPUh+dmpeRogEU1kTWDFQE1gzdg1KbzeMOfVjk4UO5w9nV2soNJvFrS87l4Dls4vKFEI8Axw9fH0cwULgNQBlcPEoFrAUjAxTBcHpyYXpZZ4uii8mTXlzaa1KO5EmARXheQ8JDMdAwKsgFIb3vaveTN9AjigPV10kMxevOfNvFaIpwICMB3xesPKN91z38zZ83rhHKQIetO05s2slQqvNjS87loKCwBMZ4Jtxww9ZIsgLoGGNFA6NS+FCwDVj+Rs"></Mermaid><details class="hint-container details"><summary>TEST ENV</summary>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ sw_vers
ProductName:	macOS
ProductVersion:	<span class="token number">12.4</span>

$ brew <span class="token parameter variable">--version</span>
Homebrew <span class="token number">3.5</span>.2

$ <span class="token function">git</span> version
<span class="token function">git</span> version <span class="token number">2.27</span>.0

$ <span class="token function">java</span> <span class="token parameter variable">-version</span>
openjdk version <span class="token string">"11.0.14.1"</span> <span class="token number">2022</span>-02-08

$ gradle <span class="token parameter variable">--version</span>
Welcome to Gradle <span class="token number">7.4</span>.2<span class="token operator">!</span>

$ <span class="token function">docker</span> version
Client:
 Version:           <span class="token number">20.10</span>.9

Server:
 Engine:
  Version:          <span class="token number">20.10</span>.14

$ vault version
Vault v1.11.0

$ nomad version
Nomad v1.3.1

$ <span class="token function">curl</span> <span class="token parameter variable">--version</span>
<span class="token function">curl</span> <span class="token number">7.79</span>.1 <span class="token punctuation">(</span>x86_64-apple-darwin21.0<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<h2 id="_1-vault-nomad-integration-dev-mode" tabindex="-1"><a class="header-anchor" href="#_1-vault-nomad-integration-dev-mode" aria-hidden="true">#</a> 1. Vault &amp; Nomad Integration (dev mode)</h2>
<ul>
<li>테스트를 위한 Vault를 실행합니다. 개인을 위한 개발모드로 실행하기 때문에 실환경 적용을 위해서는 별도 구성이 필요합니다.</li>
<li>Nomad는 배포/실행을 위한 용도로 사용되었습니다. 별도 VM, K8S 환경이 있다면 PIPELINE 구성 마지막의 배포 구성에 변경이 필요합니다.</li>
</ul>
<h3 id="_1-1-vault-setup" tabindex="-1"><a class="header-anchor" href="#_1-1-vault-setup" aria-hidden="true">#</a> 1.1 Vault Setup</h3>
<div class="hint-container warning">
<p class="hint-container-title">경고</p>
<p>개발모드로 실행하면 데이터가 메모리에만 저장되어 종료시 삭제 됩니다.</p>
</div>
<h4 id="vault-start-dev-mode" tabindex="-1"><a class="header-anchor" href="#vault-start-dev-mode" aria-hidden="true">#</a> Vault Start Dev mode</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault server <span class="token parameter variable">-dev</span> -dev-root-token-id<span class="token operator">=</span>root
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>-dev-root-token-id</code> : 개발모드에서는 root 토큰을 지정가능</li>
</ul>
<h4 id="vault-env" tabindex="-1"><a class="header-anchor" href="#vault-env" aria-hidden="true">#</a> Vault Env</h4>
<blockquote>
<p>Another terminal</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span>http://127.0.0.1:8200   <span class="token comment">#Vault 주소</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>root                   <span class="token comment">#Vault Root Token</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">JENKINS_POLICY</span><span class="token operator">=</span>jenkins-policy      <span class="token comment">#테스트용 Jenkins Policy 이름</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-dynamic-secret-sample-aws" tabindex="-1"><a class="header-anchor" href="#_1-2-dynamic-secret-sample-aws" aria-hidden="true">#</a> 1.2 Dynamic Secret Sample (AWS)</h3>
<div class="hint-container info">
<p class="hint-container-title">정보</p>
<p>테스트를 위한 Secret Engine으로 AWS를 활성화 합니다.<br>
AWS Secret Engine을 사용하기 위해서는 AWS Credential 정보가 필요합니다.<br>
발급 안내 : <a href="https://docs.aws.amazon.com/ko_kr/powershell/latest/userguide/pstools-appendix-sign-up.html" target="_blank" rel="noopener noreferrer">https://docs.aws.amazon.com/ko_kr/powershell/latest/userguide/pstools-appendix-sign-up.html<ExternalLinkIcon/></a></p>
</div>
<h4 id="setup-aws-env" tabindex="-1"><a class="header-anchor" href="#setup-aws-env" aria-hidden="true">#</a> Setup AWS Env</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_ACCESS_KEY</span><span class="token operator">=</span>AKIAU3NXXXXX
<span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_SECRET_KEY</span><span class="token operator">=</span>Rex3GPUKO3++123
<span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_REGION</span><span class="token operator">=</span>ap-northeast-2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="enable-aws-secret-engine" tabindex="-1"><a class="header-anchor" href="#enable-aws-secret-engine" aria-hidden="true">#</a> Enable AWS Secret Engine</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>aws aws
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>-path</code> 인수로 <code v-pre>aws</code> Secret Engine이 마운트되는 경로를 설정할 수 있고, 기본 endpoint는 <code v-pre>aws</code></li>
</ul>
<h4 id="aws-secret-engine-configuration" tabindex="-1"><a class="header-anchor" href="#aws-secret-engine-configuration" aria-hidden="true">#</a> AWS Secret Engine Configuration</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> aws/config/root <span class="token punctuation">\</span>
  <span class="token assign-left variable">access_key</span><span class="token operator">=</span><span class="token variable">$AWS_ACCESS_KEY</span> <span class="token punctuation">\</span>
  <span class="token assign-left variable">secret_key</span><span class="token operator">=</span><span class="token variable">$AWS_SECRET_KEY</span> <span class="token punctuation">\</span>
  <span class="token assign-left variable">region</span><span class="token operator">=</span><span class="token variable">$AWS_REGION</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>마운트 된 <code v-pre>aws</code> Secret Engine의 기본 설정</li>
</ul>
<h4 id="aws-secret-engine-lease-change-option" tabindex="-1"><a class="header-anchor" href="#aws-secret-engine-lease-change-option" aria-hidden="true">#</a> AWS Secret Engine Lease change (option)</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> /aws/config/lease <span class="token assign-left variable">lease</span><span class="token operator">=</span>1m <span class="token assign-left variable">lease_max</span><span class="token operator">=</span>1m
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>aws</code> Secret Engine에서 <code v-pre>iam_user</code> 형태의 role을 생성하는 경우의 ttl</li>
<li><code v-pre>lease</code>는 해당 <code v-pre>aws</code> Secret Engine에서 생성되는 계정의 기본 유지 기간을 설정</li>
<li>기본 값은 <code v-pre>768h</code> (32일)</li>
</ul>
<h4 id="role-setup-e-g-s3" tabindex="-1"><a class="header-anchor" href="#role-setup-e-g-s3" aria-hidden="true">#</a> Role setup (e.g. s3)</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> aws/roles/sts-s3 <span class="token punctuation">\</span>
    <span class="token assign-left variable">credential_type</span><span class="token operator">=</span>federation_token <span class="token punctuation">\</span>
    <span class="token assign-left variable">policy_document</span><span class="token operator">=</span>-<span class="token operator">&lt;&lt;</span><span class="token string">EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
     		"s3:PutObject",
      	"s3:PutObjectAcl"
      ],
      "Resource": "*"
    }
  ]
}
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>aws로 생성할 <code v-pre>federation_token</code>(STS) 타입의 role 정의</li>
</ul>
<h4 id="test-aws-secret" tabindex="-1"><a class="header-anchor" href="#test-aws-secret" aria-hidden="true">#</a> Test AWS Secret</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> aws/sts/sts-s3 <span class="token assign-left variable">ttl</span><span class="token operator">=</span><span class="token number">900</span>
Key                Value
---                -----
lease_id           aws/sts/sts-s3/Qxfoy2plVAfS57tDQ99B5vPM
lease_duration     14m59s
lease_renewable    <span class="token boolean">false</span>
access_key         ASIAU3NXDWRUE3FCRWBM
secret_key         TX76EXmadilWw3TySTscB1XGAPI4kNyhdQIdKKtS
security_token     IQoJb3JpZ2luX2VjENb//////////wEaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAM
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>iam_user</code> 형태인 경와 다르게 중간에 <code v-pre>sts</code> 경로를 넣음</li>
<li><code v-pre>ttl</code>은 <code v-pre>federation_token</code>인 role에서는 15분(900초)가 최소 값</li>
</ul>
<h3 id="_1-3-approle-setup" tabindex="-1"><a class="header-anchor" href="#_1-3-approle-setup" aria-hidden="true">#</a> 1.3 Approle Setup</h3>
<p>앞서 생성한 <code v-pre>aws</code> Secret Engine의 <code v-pre>federation_token</code> 을 획득하기 위한 Vault 인증을 추가합니다. AppRole은 기계친화적인 인증방식으로 Username/Password 방식과 빗대어 Username역할을 하는 <code v-pre>role_id</code>와 Password 역할을 하는 <code v-pre>secret_id</code> 페어로 인증하게 됩니다. <code v-pre>secret_id</code>는 영구적이지 않으므로 필요할 때 발급받아 사용합니다. <mark>필요할 때</mark> 발급받게 되는 것으로 보안성은 높으나 발급받기위한 자동화 구성이 요구됩니다.</p>
<h4 id="vault-policy-for-aws" tabindex="-1"><a class="header-anchor" href="#vault-policy-for-aws" aria-hidden="true">#</a> Vault Policy for AWS</h4>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>cat &lt;&lt;EOF | vault policy write aws_policy -
path "aws/sts/sts-s3" {
  capabilities = ["read","update"]
}
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>생성할 AppRole 계정에서 사용할 정책을 추가</li>
<li><code v-pre>aws/sts/sts-s3</code> 에 대한 읽기(발급)와 갱신 권한</li>
</ul>
<h4 id="approle-create" tabindex="-1"><a class="header-anchor" href="#approle-create" aria-hidden="true">#</a> Approle Create</h4>
<p><code v-pre>aws_policy</code> 정책을 갖는 AppRole 생성</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault auth <span class="token builtin class-name">enable</span> approle

Success<span class="token operator">!</span> Enabled approle auth method at: approle/

$ vault <span class="token function">write</span> auth/approle/role/aws-cred <span class="token punctuation">\</span>
    <span class="token assign-left variable">secret_id_ttl</span><span class="token operator">=</span>1m <span class="token punctuation">\</span>
    <span class="token assign-left variable">token_ttl</span><span class="token operator">=</span>60m <span class="token punctuation">\</span>
    <span class="token assign-left variable">token_max_ttl</span><span class="token operator">=</span>120m <span class="token punctuation">\</span>
    <span class="token assign-left variable">policies</span><span class="token operator">=</span><span class="token string">"aws_policy"</span>
    
Success<span class="token operator">!</span> Data written to: auth/approle/role/aws-cred

$ vault <span class="token builtin class-name">read</span> auth/approle/role/aws-cred/role-id

Key        Value
---        -----
role_id    430111ee-5955-aa83-a53d-924b7e11ac36

$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> auth/approle/role/aws-cred/secret-id

Key                   Value
---                   -----
secret_id             7f86b671-2f47-f841-18a4-c36ca34ab8d8
secret_id_accessor    9ad4256a-acc6-e8c0-f7fe-7633e66b1318
secret_id_ttl         1m
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>생성한 <code v-pre>role_id</code>와 <code v-pre>secret_id</code>로 Vault에 인증을 수행합니다. <code v-pre>secret_id</code>의 경우 ttl 지정이 가능 합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Test</span>
$ vault <span class="token builtin class-name">read</span> <span class="token parameter variable">-field</span> role_id auth/approle/role/aws-cred/role-id <span class="token operator">></span> role_id.txt
$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">-field</span> secret_id auth/approle/role/aws-cred/secret-id <span class="token operator">></span> secret_id.txt
$ <span class="token builtin class-name">unset</span> VAULT_TOKEN
$ vault <span class="token function">write</span> auth/approle/login <span class="token assign-left variable">role_id</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> ./role_id.txt<span class="token variable">)</span></span> <span class="token assign-left variable">secret_id</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> ./secret_id.txt<span class="token variable">)</span></span>

Key                     Value
---                     -----
token                   hvs.CAESIDoJqJmtgUQXj_DSHaSLwkdZFQQpjr7_x-r_bmy6ZbpyGh4KHGh2cy5SeEVpWGpmcXlJSE95WEpKUVdKSW8zMXI
token_accessor          SpMtPdNUXaF3GAOATtWD0Qdi
token_duration          1h
token_renewable         <span class="token boolean">true</span>
token_policies          <span class="token punctuation">[</span><span class="token string">"aws_policy"</span> <span class="token string">"default"</span><span class="token punctuation">]</span>
identity_policies       <span class="token punctuation">[</span><span class="token punctuation">]</span>
policies                <span class="token punctuation">[</span><span class="token string">"aws_policy"</span> <span class="token string">"default"</span><span class="token punctuation">]</span>
token_meta_role_name    aws-cred

$ vault <span class="token builtin class-name">read</span> /aws/creds/s3

Key                Value
---                -----
lease_id           aws/creds/s3/1iaII6N6DaUULD27w91ZpePP
lease_duration     1m
lease_renewable    <span class="token boolean">true</span>
access_key         AKIAU3NXDWRUEXSGRTNL
secret_key         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
security_token     <span class="token operator">&lt;</span>nil<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>role_id</code>는 Pipeline 작성에 사용</li>
</ul>
<h3 id="_1-4-jenkins-token" tabindex="-1"><a class="header-anchor" href="#_1-4-jenkins-token" aria-hidden="true">#</a> 1.4 Jenkins Token</h3>
<p>Jenkins에서는 생성된 AppRole의 <code v-pre>role_id</code>에 대한 <code v-pre>secret_id</code>를 발급받을 권한이 있어야 합니다.</p>
<h4 id="vault-policy-for-approle-secret" tabindex="-1"><a class="header-anchor" href="#vault-policy-for-approle-secret" aria-hidden="true">#</a> Vault Policy for AppRole Secret</h4>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>cat &lt;&lt;EOF | vault policy write approle_policy -
path "auth/approle/role/aws-cred/role-id" {
  capabilities = ["read"]
}
path "auth/approle/role/aws-cred/secret-id" {
  capabilities = ["create", "update"]
}
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>role-id</code>를 읽기 가능</li>
<li><code v-pre>secret-id</code>를 생성 가능</li>
</ul>
<h4 id="create-token-role-for-jenkins" tabindex="-1"><a class="header-anchor" href="#create-token-role-for-jenkins" aria-hidden="true">#</a> Create Token Role for Jenkins</h4>
<p>Jenkins는 Token을 넣어줄 것이므로 Token Role을 생성하여 Entity를 하나로 지정합니다.<br>
Role을 생성하지 않는 경우 일반적인 <code v-pre>vault token create -policy=&lt;policy_name&gt; -orphan=true -period=700h</code> 같은 명령어로도 생성할 수 있습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Get token accessor id</span>
$ vault auth list <span class="token parameter variable">-format</span><span class="token operator">=</span>json <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">'.["token/"].accessor'</span> <span class="token operator">></span> accessor_token.txt

<span class="token comment"># Create entity for Jenkins</span>
$ vault <span class="token function">write</span> <span class="token parameter variable">-format</span><span class="token operator">=</span>json identity/entity <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">"jenkins-entity"</span> <span class="token assign-left variable">policies</span><span class="token operator">=</span><span class="token string">"default"</span> <span class="token punctuation">\</span>
     <span class="token assign-left variable">metadata</span><span class="token operator">=</span>organization<span class="token operator">=</span><span class="token string">"Company"</span> <span class="token punctuation">\</span>
     <span class="token assign-left variable">metadata</span><span class="token operator">=</span>team<span class="token operator">=</span><span class="token string">"Security"</span> <span class="token punctuation">\</span>
     <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">".data.id"</span> <span class="token operator">></span> entity_id.txt

<span class="token comment"># Create alias for Jenkins</span>
$ vault <span class="token function">write</span> identity/entity-alias <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">"jenkins-alias"</span> <span class="token punctuation">\</span>
     <span class="token assign-left variable">canonical_id</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> entity_id.txt<span class="token variable">)</span></span> <span class="token punctuation">\</span>
     <span class="token assign-left variable">mount_accessor</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> accessor_token.txt<span class="token variable">)</span></span> <span class="token punctuation">\</span>
     <span class="token assign-left variable">custom_metadata</span><span class="token operator">=</span>account<span class="token operator">=</span><span class="token string">"Security Account"</span>

Key             Value
---             -----
canonical_id    4a950f94-3c35-dc0f-cdf3-4f5bc931ae0b
<span class="token function">id</span>              66528d3b-1561-283b-d7d2-33c8b683b49f

<span class="token comment"># Create role for Jenkins</span>
$ vault <span class="token function">write</span> auth/token/roles/jenkins <span class="token assign-left variable">allowed_policies</span><span class="token operator">=</span><span class="token string">"approle_policy"</span> <span class="token assign-left variable">orphan</span><span class="token operator">=</span>false <span class="token assign-left variable">bound_cidrs</span><span class="token operator">=</span><span class="token string">"127.0.0.1/32,128.252.0.0/16"</span> <span class="token assign-left variable">renewable</span><span class="token operator">=</span>true <span class="token assign-left variable">allowed_entity_aliases</span><span class="token operator">=</span><span class="token string">"jenkins-alias"</span> <span class="token assign-left variable">token_period</span><span class="token operator">=</span><span class="token string">"720h"</span>

Success<span class="token operator">!</span> Data written to: auth/token/roles/jenkins

<span class="token comment"># Create Token</span>
$ vault token create <span class="token parameter variable">-field</span><span class="token operator">=</span>token -entity-alias<span class="token operator">=</span>jenkins-alias <span class="token parameter variable">-role</span><span class="token operator">=</span>jenkins
hvs.CAESIGkayX80rrAdHR-LychPp6GITGM_DG8Af8VpOY36hdHQGh4KHGh2cy5pNXprSDdOMEVMTEtia0QxYW1YRHF4dmo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>token</code> 은 Jenkins에 저장하는 값</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Test</span>
$ vault token create <span class="token parameter variable">-field</span><span class="token operator">=</span>token -entity-alias<span class="token operator">=</span>jenkins-alias <span class="token parameter variable">-role</span><span class="token operator">=</span>jenkins <span class="token operator">></span> token.txt
$ <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> ./token.txt<span class="token variable">)</span></span> vault <span class="token function">write</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">-field</span> secret_id auth/approle/role/aws-cred/secret-id

aae55515-f9ed-a171-dd56-53710ab29018
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-2-nomad-setup" tabindex="-1"><a class="header-anchor" href="#_1-2-nomad-setup" aria-hidden="true">#</a> 1.2 Nomad Setup</h3>
<p>Nomad는 CI/CD 파이프라인 구조 상 배포를 위한 대상을 생성하기위해 구성되었습니다.</p>
<h4 id="nomad-start-dev-mode" tabindex="-1"><a class="header-anchor" href="#nomad-start-dev-mode" aria-hidden="true">#</a> Nomad Start Dev mode</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>nomad agent <span class="token parameter variable">-dev</span> -alloc-dir<span class="token operator">=</span>/tmp/nomad/alloc -state-dir<span class="token operator">=</span>/tmp/nomad/state
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="nomad-env" tabindex="-1"><a class="header-anchor" href="#nomad-env" aria-hidden="true">#</a> Nomad Env</h4>
<blockquote>
<p>Another terminal</p>
</blockquote>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>export NOMAD_ADDR=http://127.0.0.1:4646
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="jar-file-up-download-nexus-job" tabindex="-1"><a class="header-anchor" href="#jar-file-up-download-nexus-job" aria-hidden="true">#</a> Jar file Up/Download Nexus Job</h4>
<p>java 드라이버를 사용한 배포에서 빌드된 jar파일을 원격에서 불러와야 하므로 임시 파일 서버를 구성합니다.</p>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>cat <span class="token operator">&lt;&lt;</span><span class="token constant">EOF</span> <span class="token operator">|</span> nomad job run <span class="token operator">-</span>
job <span class="token string-literal"><span class="token string">"fileserver"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>

  group <span class="token string-literal"><span class="token string">"fileserver"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>

    network <span class="token punctuation">{</span>
      port <span class="token string-literal"><span class="token string">"http"</span></span> <span class="token punctuation">{</span>
        to <span class="token operator">=</span> <span class="token number">3000</span>
        static <span class="token operator">=</span> <span class="token number">3000</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string-literal"><span class="token string">"fileserver"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"docker"</span></span>

      config <span class="token punctuation">{</span>
        image <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"julienmeerschart/simple-file-upload-download-server"</span></span>
        ports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"http"</span></span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token constant">EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Upload Test</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">-F</span> <span class="token assign-left variable">file</span><span class="token operator">=</span>@/tmp/dynamic.properties http://localhost:3000
<span class="token punctuation">{</span><span class="token string">"downloadLink"</span><span class="token builtin class-name">:</span><span class="token string">"http://localhost:3000/file?file=dynamic.properties"</span>,<span class="token string">"curl"</span><span class="token builtin class-name">:</span><span class="token string">"curl http://localhost:3000/file?file=dynamic.properties > dynamic.properties"</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-jenkins-setup" tabindex="-1"><a class="header-anchor" href="#_2-jenkins-setup" aria-hidden="true">#</a> 2. Jenkins Setup</h2>
<blockquote>
<p>Download Guide : <a href="https://www.jenkins.io/download/" target="_blank" rel="noopener noreferrer">https://www.jenkins.io/download/<ExternalLinkIcon/></a><br>
macOS Install Guide : <a href="https://www.jenkins.io/download/lts/macos/" target="_blank" rel="noopener noreferrer">https://www.jenkins.io/download/lts/macos/<ExternalLinkIcon/></a></p>
</blockquote>
<h3 id="_2-1-jenkins-install-macos" tabindex="-1"><a class="header-anchor" href="#_2-1-jenkins-install-macos" aria-hidden="true">#</a> 2.1 Jenkins Install (macOS)</h3>
<blockquote>
<p>macOS guide : <a href="https://www.jenkins.io/download/lts/macos/" target="_blank" rel="noopener noreferrer">https://www.jenkins.io/download/lts/macos/<ExternalLinkIcon/></a></p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>brew <span class="token function">install</span> jenkins-lts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>brew services start jenkins-lts
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-2-unlock-jenkins" tabindex="-1"><a class="header-anchor" href="#_2-2-unlock-jenkins" aria-hidden="true">#</a> 2.2 Unlock Jenkins</h3>
<p>Home 디렉토리의 Jenkins 활성화를 위한 패스워드를 다음 경로에서 복사하여 <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">http://localhost:8080<ExternalLinkIcon/></a> 페이지의 <code v-pre>Unlock Jenkins</code> 에 입력</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627095332250.png" alt="image-20220627095332250" tabindex="0" loading="lazy"><figcaption>image-20220627095332250</figcaption></figure>
<h3 id="_2-3-jenkins-setup" tabindex="-1"><a class="header-anchor" href="#_2-3-jenkins-setup" aria-hidden="true">#</a> 2.3 Jenkins Setup</h3>
<h4 id="customize-jenkins" tabindex="-1"><a class="header-anchor" href="#customize-jenkins" aria-hidden="true">#</a> Customize Jenkins</h4>
<p>빠른 시작을 위해 기본 값인 <code v-pre>Install suggested plugins</code> 를 클릭</p>
<h4 id="create-first-admin-user" tabindex="-1"><a class="header-anchor" href="#create-first-admin-user" aria-hidden="true">#</a> Create First Admin User</h4>
<p>계정명, 암호, 이름, 이메일 주소를 기입하고 <code v-pre>Save and Continue</code> 버튼 클릭</p>
<h4 id="instance-configuration" tabindex="-1"><a class="header-anchor" href="#instance-configuration" aria-hidden="true">#</a> Instance Configuration</h4>
<p>올바른 Jenkins URL을 확인하고 <code v-pre>Save and Finish</code> 버튼 클릭</p>
<h4 id="jenkins-is-ready" tabindex="-1"><a class="header-anchor" href="#jenkins-is-ready" aria-hidden="true">#</a> Jenkins is ready!</h4>
<p><code v-pre>Start using Jenkins</code> 버튼 클릭</p>
<h3 id="_2-4-jenkins-github-plugin" tabindex="-1"><a class="header-anchor" href="#_2-4-jenkins-github-plugin" aria-hidden="true">#</a> 2.4 Jenkins github plugin</h3>
<h4 id="github" tabindex="-1"><a class="header-anchor" href="#github" aria-hidden="true">#</a> GitHub</h4>
<ol>
<li>
<p>GitHub 로그인</p>
</li>
<li>
<p>우측 상단 사용자 메뉴 클릭 후 <code v-pre>Settings</code> 클릭</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/GitHub 2022-06-27 12-36-30.png" alt="GitHub 2022-06-27 12-36-30" tabindex="0" loading="lazy"><figcaption>GitHub 2022-06-27 12-36-30</figcaption></figure>
</li>
<li>
<p>좌측 메뉴 최하단 <code v-pre>Developer settings</code> 클릭</p>
</li>
<li>
<p>좌측 메뉴 <code v-pre>Personal access tokens</code> 클릭</p>
</li>
<li>
<p><code v-pre>Generate new token</code> 버튼 클릭</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Personal access tokens.png" alt="Personal access tokens" tabindex="0" loading="lazy"><figcaption>Personal access tokens</figcaption></figure>
</li>
<li>
<p>Token 옵션 선택 후 <code v-pre>Generate token</code> 클릭</p>
<ul>
<li>Note : 토큰 목적 입력 (e.g. Jenkins Token)</li>
<li>Expiration : 기간을 설정 (e.g. No expiration)</li>
<li>Select scopes
<ul>
<li>repo</li>
<li>admin:org</li>
<li>admin:repo_hook</li>
</ul>
</li>
</ul>
</li>
<li>
<p>생성된 토큰을 기록/보관</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Personal access tokens 2022-06-27 12-42-58.png" alt="Personal access tokens 2022-06-27 12-42-58" tabindex="0" loading="lazy"><figcaption>Personal access tokens 2022-06-27 12-42-58</figcaption></figure>
</li>
</ol>
<h4 id="jenkins" tabindex="-1"><a class="header-anchor" href="#jenkins" aria-hidden="true">#</a> Jenkins</h4>
<ol>
<li>
<p><code v-pre>Jenkins 관리</code> &gt; <code v-pre>시스템 설정</code> 으로 이동</p>
</li>
<li>
<p><code v-pre>JDK</code> 항목에서 <code v-pre>Add JDK</code> 클릭</p>
<ul>
<li>Name : 이름 입력 (e.g. jdk11)</li>
<li>JAVA_HOME : 자바 홈 경로 (e.g. /Library/Java/JavaVirtualMachines/temurin-11.jdk/Contents/Home)</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627143641019.png" alt="image-20220627143641019" tabindex="0" loading="lazy"><figcaption>image-20220627143641019</figcaption></figure>
</li>
<li>
<p><code v-pre>Git</code> 항목에서 <code v-pre>Add Git</code>을 클릭</p>
<ul>
<li>Name : 이름 입력 (e.g. local)</li>
<li>Path to Git executable : git 실행파일 경로 입력 (e.g. /usr/local/bin/git)</li>
</ul>
</li>
<li>
<p><code v-pre>GitHub</code> 항목에서 <code v-pre>Add GitHub Server</code> 드롭박스의 <code v-pre>GitHub Server</code>를 클릭</p>
<ul>
<li>Name : 이름 입력 (e.g. jenkins_github)</li>
<li>API URL : 기본 값 (<a href="https://api.github.com" target="_blank" rel="noopener noreferrer">https://api.github.com<ExternalLinkIcon/></a>)</li>
<li>Credentials : 아래 <code v-pre>+Add</code> 버튼 클릭하여 <code v-pre>Jenkins</code>선택 후 새로운 크리덴셜 생성 후 생성된 항목 지정</li>
<li>Kind : <code v-pre>Secret Test</code> 선택</li>
<li>Secret : GitHub에서 생성한 토큰 입력</li>
<li>ID : 사용자 지정 (e.g. jenkins_github)</li>
<li><code v-pre>Test Connection</code> 버튼으로 연결 확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/스크린샷 2022-06-27 12.48.18.png" alt="스크린샷 2022-06-27 12.48.18" tabindex="0" loading="lazy"><figcaption>스크린샷 2022-06-27 12.48.18</figcaption></figure>
</li>
<li>
<p><code v-pre>Gradle</code> 항목에서 <code v-pre>Add Gradle</code> 클릭</p>
<ul>
<li>
<p>Name : 이름 입력 (e.g. gradle)</p>
</li>
<li>
<p>GRADLE_HOME : Gradle 홈 디렉토리 입력 (e.g. /usr/local/Cellar/gradle/7.4.2/libexec)</p>
</li>
</ul>
</li>
</ol>
<h4 id="vault-credential" tabindex="-1"><a class="header-anchor" href="#vault-credential" aria-hidden="true">#</a> Vault Credential</h4>
<ol>
<li><code v-pre>Jenkins 관리</code> &gt; <code v-pre>Manage Credentials</code> 로 이동</li>
<li>Domains의 (global) 항목 선택하여 <code v-pre>Add credentials</code> 클릭</li>
</ol>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627220603230.png" alt="image-20220627220603230" tabindex="0" loading="lazy"><figcaption>image-20220627220603230</figcaption></figure>
<ul>
<li>
<p>Kind : Secret text</p>
</li>
<li>
<p>Scope : Global</p>
</li>
<li>
<p>ID : 이름 (e.g. vault)</p>
</li>
<li>
<p>Secret: jenkins role 의 토큰</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault token create <span class="token parameter variable">-field</span><span class="token operator">=</span>token -entity-alias<span class="token operator">=</span>jenkins-alias <span class="token parameter variable">-role</span><span class="token operator">=</span>jenkins
hvs.CAESIGkayX80rrAdHR-LychPp6GITGM_DG8Af8VpOY36hdHQGh4KHGh2cy5pNXprSDdOMEVMTEtia0QxYW1YRHF4dmo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h2 id="_3-sample-java" tabindex="-1"><a class="header-anchor" href="#_3-sample-java" aria-hidden="true">#</a> 3. Sample Java</h2>
<h3 id="_3-1-app-setting" tabindex="-1"><a class="header-anchor" href="#_3-1-app-setting" aria-hidden="true">#</a> 3.1 App Setting</h3>
<h4 id="spring-boot-initializr" tabindex="-1"><a class="header-anchor" href="#spring-boot-initializr" aria-hidden="true">#</a> Spring-boot Initializr</h4>
<blockquote>
<p><a href="https://start.spring.io/" target="_blank" rel="noopener noreferrer">https://start.spring.io/<ExternalLinkIcon/></a></p>
</blockquote>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220628201916786.png" alt="image-20220628201916786" tabindex="0" loading="lazy"><figcaption>image-20220628201916786</figcaption></figure>
<ul>
<li>Project : Gradle Project</li>
<li>Language : Java</li>
<li>Spring Boot : 2.7.2</li>
<li>Packageing : Jar</li>
<li>Java : 11</li>
<li>Dependencies
<ul>
<li>Spring Web</li>
<li>Vault Configuration</li>
</ul>
</li>
</ul>
<h4 id="app-setup" tabindex="-1"><a class="header-anchor" href="#app-setup" aria-hidden="true">#</a> App Setup</h4>
<blockquote>
<p>github : <a href="https://github.com/Great-Stone/jenkins-gradle-vault-pipeline" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/jenkins-gradle-vault-pipeline<ExternalLinkIcon/></a></p>
</blockquote>
<p><code v-pre>build.gradle</code></p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code><span class="token operator">&lt;</span>생략<span class="token operator">></span> 
dependencies <span class="token punctuation">{</span>
	implementation <span class="token string">'org.springframework.boot:spring-boot-starter-web'</span>
	implementation <span class="token string">'org.springframework.cloud:spring-cloud-starter-vault-config'</span>
	implementation <span class="token string">'org.springframework.cloud:spring-cloud-vault-config-aws'</span>
	testImplementation <span class="token string">'org.springframework.boot:spring-boot-starter-test'</span>
<span class="token punctuation">}</span>
<span class="token operator">&lt;</span>생략<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>demo&gt;src&gt;main&gt;resources&gt;application.yml</code></p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">port</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>NOMAD_HOST_PORT_http<span class="token punctuation">:</span><span class="token number">8080</span><span class="token punctuation">}</span>
<span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span>
    <span class="token key atrule">import</span><span class="token punctuation">:</span> vault<span class="token punctuation">:</span>//
  <span class="token key atrule">cloud.vault</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">host</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>VAULT_HOST<span class="token punctuation">:</span>127.0.0.1<span class="token punctuation">}</span>
    <span class="token key atrule">port</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>VAULT_PORT<span class="token punctuation">:</span><span class="token number">8200</span><span class="token punctuation">}</span>
    <span class="token key atrule">scheme</span><span class="token punctuation">:</span> http
    <span class="token key atrule">uri</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>VAULT_URI<span class="token punctuation">:</span>http<span class="token punctuation">:</span>//127.0.0.1<span class="token punctuation">:</span>8200/<span class="token punctuation">}</span>
    <span class="token key atrule">config</span><span class="token punctuation">:</span>
      <span class="token key atrule">lifecycle</span><span class="token punctuation">:</span>
        <span class="token key atrule">min-renewal</span><span class="token punctuation">:</span> 14m
        <span class="token key atrule">expiry-threshold</span><span class="token punctuation">:</span> 15m
    <span class="token key atrule">authentication</span><span class="token punctuation">:</span> APPROLE
    <span class="token key atrule">app-role</span><span class="token punctuation">:</span>
      <span class="token key atrule">role-id</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>VAULT_ROLE_ID<span class="token punctuation">:</span>430111ee<span class="token punctuation">-</span>5955<span class="token punctuation">-</span>aa83<span class="token punctuation">-</span>a53d<span class="token punctuation">-</span>924b7e11ac36<span class="token punctuation">}</span>
      <span class="token key atrule">secret-id</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>VAULT_SECRET_ID<span class="token punctuation">:</span>6db07578<span class="token punctuation">-</span>b019<span class="token punctuation">-</span>95b4<span class="token punctuation">-</span>6741<span class="token punctuation">-</span>de4c79cbde39<span class="token punctuation">}</span>
      <span class="token key atrule">role</span><span class="token punctuation">:</span> aws<span class="token punctuation">-</span>cred
      <span class="token key atrule">app-role-path</span><span class="token punctuation">:</span> approle
    <span class="token key atrule">kv</span><span class="token punctuation">:</span>
      <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token key atrule">aws</span><span class="token punctuation">:</span>
      <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token key atrule">role</span><span class="token punctuation">:</span> sts<span class="token punctuation">-</span>s3
      <span class="token key atrule">backend</span><span class="token punctuation">:</span> aws
      <span class="token key atrule">credential-type</span><span class="token punctuation">:</span> federation_token
      <span class="token key atrule">access-key-property</span><span class="token punctuation">:</span> cloud.aws.credentials.accessKey
      <span class="token key atrule">secret-key-property</span><span class="token punctuation">:</span> cloud.aws.credentials.secretKey
      <span class="token key atrule">session-token-key-property</span><span class="token punctuation">:</span> cloud.aws.credentials.sessionToken
      <span class="token key atrule">ttl</span><span class="token punctuation">:</span> 900s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="set-dummy-properties-test" tabindex="-1"><a class="header-anchor" href="#set-dummy-properties-test" aria-hidden="true">#</a> Set dummy properties &amp; Test</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>root
$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ROLE_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>vault <span class="token builtin class-name">read</span> <span class="token parameter variable">-field</span> role_id auth/approle/role/aws-cred/role-id<span class="token variable">)</span></span>
$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_SECRET_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">write</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">-field</span> secret_id auth/approle/role/aws-cred/secret-id<span class="token variable">)</span></span>
$ gradle bootRun
<span class="token punctuation">..</span>.
<span class="token number">2022</span>-06-28 <span class="token number">23</span>:23:22.721  INFO <span class="token number">35144</span> --- <span class="token punctuation">[</span>   scheduling-1<span class="token punctuation">]</span> com.example.demo.VaultAWSConfiguration   <span class="token builtin class-name">:</span> AwsConfigurationProperties <span class="token punctuation">[</span>accessKey<span class="token operator">=</span>ASIAU3NXDWRUABR7V6UM, <span class="token assign-left variable">secretKey</span><span class="token operator">=</span>IBXXM3FXq8Q7qQE2XVUnjPN5lcN8bvsf5bw3TwXX, <span class="token assign-left variable">sessionToken</span><span class="token operator">=</span>tokentoken<span class="token punctuation">]</span>
<span class="token number">2022</span>-06-28 <span class="token number">23</span>:23:24.721  INFO <span class="token number">35144</span> --- <span class="token punctuation">[</span>   scheduling-1<span class="token punctuation">]</span> com.example.demo.VaultAWSConfiguration   <span class="token builtin class-name">:</span> AwsConfigurationProperties <span class="token punctuation">[</span>accessKey<span class="token operator">=</span>ASIAU3NXDWRUABR7V6UM, <span class="token assign-left variable">secretKey</span><span class="token operator">=</span>IBXXM3FXq8Q7qQE2XVUnjPN5lcN8bvsf5bw3TwXX, <span class="token assign-left variable">sessionToken</span><span class="token operator">=</span>tokentoken<span class="token punctuation">]</span>
<span class="token operator">&lt;=</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span>---<span class="token operator">></span> <span class="token number">80</span>% EXECUTING <span class="token punctuation">[</span>5s<span class="token punctuation">]</span>
<span class="token operator">></span> :bootRun
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-jenkins-pipeline-생성" tabindex="-1"><a class="header-anchor" href="#_4-jenkins-pipeline-생성" aria-hidden="true">#</a> 4. Jenkins Pipeline 생성</h2>
<blockquote>
<p>Pipeline 구성</p>
<ol>
<li>GitHub checkout</li>
<li>Gradle build</li>
<li>jar upload</li>
<li>Nomad Job Start</li>
</ol>
</blockquote>
<Mermaid id="mermaid-643" code="eJxLL0osyFDwCeJyjHbPLPEoTVJIzkhNzs4vLYlV0NW1c4p2L0pMyUlVSCrNzEmJ5XICCdb4WXklFtUoOEcDKYXQgpz8RKCUM0hKwUXDLz83MUXBKz9JkwsAjuwdCg=="></Mermaid><h3 id="" tabindex="-1"><a class="header-anchor" href="#" aria-hidden="true">#</a> </h3>
<ol>
<li>
<p>좌측 <code v-pre>+ 새로운 Item</code> 버튼 클릭</p>
</li>
<li>
<p>이름 입력 (e.g. Nomad Job - Vault approve)</p>
</li>
<li>
<p>Pipeline 선택 후 <code v-pre>OK</code></p>
</li>
<li>
<p>성성된 Jenkins Job의 Pipeline에 스크립트 구성</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    triggers <span class="token punctuation">{</span>
        <span class="token function">cron</span><span class="token punctuation">(</span><span class="token string">'H */8 * * *'</span><span class="token punctuation">)</span> <span class="token comment">//regular builds</span>
        <span class="token function">pollSCM</span><span class="token punctuation">(</span><span class="token string">'* * * * *'</span><span class="token punctuation">)</span> <span class="token comment">//polling for changes, here once a minute</span>
    <span class="token punctuation">}</span>
    tools <span class="token punctuation">{</span> 
        <span class="token function">git</span><span class="token punctuation">(</span><span class="token string">'local'</span><span class="token punctuation">)</span>
        <span class="token function">gradle</span><span class="token punctuation">(</span><span class="token string">'gradle'</span><span class="token punctuation">)</span>
        <span class="token function">jdk</span><span class="token punctuation">(</span><span class="token interpolation-string"><span class="token string">"jdk11"</span></span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    environment <span class="token punctuation">{</span>
        NOMAD_ADDR <span class="token operator">=</span> <span class="token string">'http://localhost:4646'</span>
        VAULT_HOST <span class="token operator">=</span> <span class="token string">'127.0.0.1'</span>
        VAULT_PORT <span class="token operator">=</span> <span class="token string">'8200'</span>
    <span class="token punctuation">}</span>
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Clone'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                git branch<span class="token punctuation">:</span> <span class="token string">'main'</span><span class="token punctuation">,</span>
                    credentialsId<span class="token punctuation">:</span> <span class="token string">'jenkins_github'</span><span class="token punctuation">,</span>
                    url<span class="token punctuation">:</span> <span class="token string">'https://github.com/Great-Stone/jenkins-gradle-vault-pipeline'</span>
                sh <span class="token interpolation-string"><span class="token string">"ls -lat"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Test'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'./gradlew test'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'./gradlew build'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Upload'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'mv ./build/libs/demo-0.0.1-SNAPSHOT.jar ./demo-vault-${BUILD_NUMBER}.jar'</span>
                sh <span class="token string">'curl -F file=@./demo-vault-${BUILD_NUMBER}.jar http://localhost:3000'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Nomad Download'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                sh <span class="token string">'curl -C - --output nomad_1.3.1_darwin_amd64.zip https://releases.hashicorp.com/nomad/1.3.1/nomad_1.3.1_darwin_amd64.zip'</span>
                sh <span class="token string">'unzip -o nomad_1.3.1_darwin_amd64.zip'</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Deploy To Nomad'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                script <span class="token punctuation">{</span>
                    <span class="token function">withCredentials</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token function">string</span><span class="token punctuation">(</span>credentialsId<span class="token punctuation">:</span> <span class="token string">'vault'</span><span class="token punctuation">,</span> variable<span class="token punctuation">:</span> <span class="token string">'TOKEN'</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        sh <span class="token string">'''
                        curl -H "X-Vault-Token: ${TOKEN}" -X GET http://${VAULT_HOST}:${VAULT_PORT}/v1/auth/approle/role/aws-cred/role-id | /usr/local/bin/jq -r '.data.role_id' > role_id.txt
                        curl -H "X-Vault-Token: ${TOKEN}" -X POST http://${VAULT_HOST}:${VAULT_PORT}/v1/auth/approle/role/aws-cred/secret-id | /usr/local/bin/jq -r '.data.secret_id' > secret_id.txt
                        ./nomad job run -var version=${BUILD_NUMBER} -var vault_host=${VAULT_HOST} -var vault_port=${VAULT_PORT} -var role_id=$(cat ./role_id.txt) -var secret_id=$(cat ./secret_id.txt) ./nomad-java.hcl
                        '''</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>지금 빌드</code>를 클릭하여 빌드를 진행합니다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220629001337731.png" alt="image-20220629001337731" tabindex="0" loading="lazy"><figcaption>image-20220629001337731</figcaption></figure>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220629001415515.png" alt="image-20220629001415515" tabindex="0" loading="lazy"><figcaption>image-20220629001415515</figcaption></figure>
</li>
</ol>
</div></template>


