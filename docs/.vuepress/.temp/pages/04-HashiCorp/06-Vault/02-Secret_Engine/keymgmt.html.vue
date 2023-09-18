<template><div><h1 id="key-management" tabindex="-1"><a class="header-anchor" href="#key-management" aria-hidden="true">#</a> Key Management</h1>
<blockquote>
<p>Key Management Secret Engine을 활성화 하기 위해서는 <code v-pre>ADP</code> 수준의 라이선스가 필요하다.</p>
</blockquote>
<p>Key Management 시크릿 엔진은 KMS(Key Management Service)를 공급하는 대상의 암호화 키의 배포 및 수명 주기 관리를 위한 워크플로를 제공한다. KMS 공급자 고유의 암호화 기능을 기존처럼 사용하면서도, 볼트에서 키를 중앙 집중식으로 제어할 수 있다.</p>
<p>볼트는 KMS의 구성에 사용되는 Key Meterial 원본을 생성하여 보유한다. 관리가능한 KMS에 대해 키 수명주기를 설정 및 관리하면 Key Meterial의 복사본이 대상에 배포된다. 이 방식으로 볼트는 KMS 서비스의 전체 수명 주기 관리 및 키 복구 수단을 제공한다. 지원되는 KMS는 다음과 같다.</p>
<ul>
<li>AWS KMS</li>
<li>Azure Key Vault</li>
<li>GCP Cloud KMS</li>
<li>PKCS#11 호환</li>
</ul>
<p>Key Management의 구성 및 동작의 순서는 다음과 같다.</p>
<ol>
<li>
<p>Key Management 시크릿 엔진인 <code v-pre>keymgmt</code>를 활성화</p>
</li>
<li>
<p>키 생성</p>
<ul>
<li><code v-pre>type</code> : 키 유형
<ul>
<li>AWS KMS 지원 유형: <code v-pre>aes256-gcm96</code></li>
<li>Azure Key Vault 지원 유형 : <code v-pre>rsa-2048</code>, <code v-pre>rsa-3072</code>, <code v-pre>rsa-4096</code></li>
<li>GCP Cloud KMS 지원 유형 : <code v-pre>aes256-gcm96</code>, <code v-pre>rsa-2048</code>, <code v-pre>rsa-3072</code>, <code v-pre>rsa-4096</code>, <code v-pre>ecdsa-p256</code>, <code v-pre>ecdsa-p384</code></li>
</ul>
</li>
</ul>
</li>
<li>
<p>지원되는 KMS 서비스 지정 및 공급자 별 인증 정보 등록</p>
<ul>
<li><code v-pre>awskms</code> : AWS KMS</li>
<li><code v-pre>azurekeyvault</code> : Azure Key Vault</li>
<li><code v-pre>gcpckms</code> : GCP Cloud KMS</li>
</ul>
</li>
<li>
<p>KMS 서비스에 키 생성</p>
<ul>
<li><code v-pre>purpose</code> : 목적
<ul>
<li><code v-pre>enctypt</code></li>
<li><code v-pre>dectypt</code></li>
<li><code v-pre>sign</code></li>
<li><code v-pre>verify</code></li>
<li><code v-pre>wrap</code></li>
<li><code v-pre>unwrap</code></li>
</ul>
</li>
<li><code v-pre>protection</code> : 키 보호 지정
<ul>
<li><code v-pre>hsm</code></li>
<li><code v-pre>software</code></li>
</ul>
</li>
</ul>
</li>
<li>
<p>관리를 위한 키 회전 (선택)</p>
</li>
<li>
<p>키 버전 활성/비활성 (선택)</p>
</li>
<li>
<p>KMS 서비스의 키 제거</p>
<ul>
<li>KMS 서비스의 키가 삭제되지만 키는 볼트에 저장</li>
<li>영구 제거를 위해서는 별도 키 삭제 호출</li>
</ul>
</li>
</ol>
<h3 id="keymgmt-secret-engine-활성화" tabindex="-1"><a class="header-anchor" href="#keymgmt-secret-engine-활성화" aria-hidden="true">#</a> keymgmt Secret Engine 활성화</h3>
<p><code v-pre>keymgmt</code> 시크릿 엔진을 활성화하여, 해당 엔드포인트에서 시크릿에 대한 관리를 수행한다. 관리 목적에 따라 별도의 엔드포인트를 <code v-pre>path</code>로 지정한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> keymgmt
Success<span class="token operator">!</span> Enabled the keymgmt secrets engine at: keymgmt/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-aws-kms" tabindex="-1"><a class="header-anchor" href="#_1-aws-kms" aria-hidden="true">#</a> 1. AWS KMS</h2>
<h3 id="_1-1-구성-요소" tabindex="-1"><a class="header-anchor" href="#_1-1-구성-요소" aria-hidden="true">#</a> 1.1 구성 요소</h3>
<ul>
<li>AWS KMS 관리를 위한 권한
<ul>
<li><code v-pre>kms:CreateKey</code></li>
<li><code v-pre>kms:GetParametersForImport</code></li>
<li><code v-pre>kms:ImportKeyMaterial</code></li>
<li><code v-pre>kms:EnableKey</code></li>
<li><code v-pre>kms:DisableKey</code></li>
<li><code v-pre>kms:ScheduleKeyDeletion</code></li>
<li><code v-pre>kms:CreateAlias</code></li>
<li><code v-pre>kms:UpdateAlias</code></li>
<li><code v-pre>kms:DeleteAlias</code></li>
<li><code v-pre>kms:ListAliases</code></li>
<li><code v-pre>kms:TagResource</code></li>
</ul>
</li>
<li><code v-pre>keymgmt</code> Secret Engine</li>
</ul>
<h3 id="_1-2-vault-가-대상-aws-kms-관리-위해-사용할-자격증명" tabindex="-1"><a class="header-anchor" href="#_1-2-vault-가-대상-aws-kms-관리-위해-사용할-자격증명" aria-hidden="true">#</a> 1.2 Vault 가 대상 AWS KMS 관리 위해 사용할 자격증명</h3>
<p>Secret Engine 에 대한 활성화는 Secret Engine 에 접근하기 위해 사용되는 엔드포인트 정보만 생성되었을 뿐, 연동하고자 하는 대상 AWS 환경에 대한 정보에 대해서는 세부 설정이 필요하다. 이를 위해 Vault 가 대상 AWS 환경에 대해 접근, 자격증명 발급 그리고 생명주기 관리 작업을 수행할 수 있는 권한이 부여된 자격증명 발급이 필요하다.</p>
<ol>
<li>
<p><strong>자격증명 발급 및 생명주기 관리 권한을 위한 정책 생성</strong></p>
<blockquote>
<p>AWS IAM 정책 생성: <a href="https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/access_policies_create-console.html" target="_blank" rel="noopener noreferrer">https://docs.aws.amazon.com/ko_kr/IAM/latest/UserGuide/access_policies_create-console.html<ExternalLinkIcon/></a></p>
</blockquote>
<ol>
<li>
<p><a href="https://console.aws.amazon.com/iam/%EC%97%90%EC%84%9C" target="_blank" rel="noopener noreferrer">https://console.aws.amazon.com/iam/에서<ExternalLinkIcon/></a> IAM 콘솔에 접속.</p>
</li>
<li>
<p>왼쪽의 탐색 창에서 <strong>정책(Policies)</strong> 을 선택.</p>
</li>
<li>
<p><strong>정책 생성(Create policy)</strong> 을 선택.</p>
</li>
<li>
<p><strong>JSON</strong> 탭을 선택.</p>
</li>
<li>
<p>JSON 정책 문서 입력</p>
<ul>
<li>Action 란에 권한 부여를 포함한 자격 증명 발급 및 관리를 위한 IAM 서비스 관련 권한 작성</li>
<li>Resource 란의 <code v-pre>ACCOUNT-ID-WITHOUT-HYPHENS</code> 는 AWS 콘솔 우상단에서 확인 가능한 숫자 12자리로 구성된 계정 고유 ID 정보 입력</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kms:CreateKey",
        "kms:GetParametersForImport",
        "kms:ImportKeyMaterial",
        "kms:EnableKey",
        "kms:DisableKey",
        "kms:ScheduleKeyDeletion",
        "kms:CreateAlias",
        "kms:UpdateAlias",
        "kms:DeleteAlias",
        "kms:ListAliases",
        "kms:TagResource"
      ],
      "Resource": ["*"]
    }
  ]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>보안 경고, 오류 또는 일반 경고를 해결한 다음 <strong>정책 검토(Review policy)</strong> 선택.</p>
</li>
<li>
<p>정책 이름 정의 후 <strong>정책 생성(Create Policy)</strong> 선택 하여 생성 완료</p>
</li>
</ol>
</li>
<li>
<p><strong>자격증명 발급</strong></p>
<blockquote>
<p>AWS 계정 및 액세스 키 : <a href="https://docs.aws.amazon.com/ko_kr/powershell/latest/userguide/pstools-appendix-sign-up.html" target="_blank" rel="noopener noreferrer">https://docs.aws.amazon.com/ko_kr/powershell/latest/userguide/pstools-appendix-sign-up.html<ExternalLinkIcon/></a></p>
</blockquote>
<ol>
<li><a href="https://console.aws.amazon.com/iam/" target="_blank" rel="noopener noreferrer">https://console.aws.amazon.com/iam/<ExternalLinkIcon/></a> 에서 IAM 콘솔에 접속.</li>
<li>탐색 메뉴에서 <strong>사용자</strong> 선택.</li>
<li><strong>사용자 추가(Add User)</strong> 선택 하여 사용자 이름 지정</li>
<li><strong>직접 정책 연결(Attach policies directly)</strong> 선택하여 이전 단계에서 생성한 정책 선택</li>
<li><strong>사용자 생성(Create User)</strong> 선택하여 사용자 생성 완료</li>
<li><strong>Security credentials(보안 자격 증명)</strong> 탭을 연 다음 **Create access key(액세스 키 생성)**를 선택.</li>
<li>새 액세스 키를 보려면 [<strong>Show</strong>]를 선택. 키 정보는 아래와 같이 액세스 키 / 보안 액세스 키로 구성.
<ul>
<li>액세스 키 ID: <code v-pre>AKIAIOSFODNN7EXAMPLE</code></li>
<li>보안 액세스 키: <code v-pre>wJalrXUt******************XAMPLEKEY</code></li>
</ul>
</li>
<li>키 페어 파일을 다운로드하려면 [<strong>Download .csv file</strong>]을 선택</li>
</ol>
</li>
</ol>
<h3 id="_1-3-vault의-aws-kms-구성" tabindex="-1"><a class="header-anchor" href="#_1-3-vault의-aws-kms-구성" aria-hidden="true">#</a> 1.3 Vault의 AWS KMS 구성</h3>
<p>AWS KMS에서 호환되는 암호화 키를 생성한다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code> vault secrets enable keymgmt

$ vault write -f keymgmt/key/aes256-gcm96 type="aes256-gcm96"
Success! Data written to: keymgmt/key/aes256-gcm96
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>생성된 암호화 키의 정보를 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/key/aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">false</span>
latest_version         <span class="token number">1</span>
min_enabled_version    <span class="token number">1</span>
name                   aes256-gcm96
<span class="token builtin class-name">type</span>                   aes256-gcm96
versions               map<span class="token punctuation">[</span><span class="token number">1</span>:map<span class="token punctuation">[</span>creation_time:2023-07-05T12:04:48.099141545Z<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>AWS KMS 공급자 리소스를 구성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> keymgmt/kms/aws-kms-anea2 <span class="token punctuation">\</span>
    <span class="token assign-left variable">provider</span><span class="token operator">=</span><span class="token string">"awskms"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">key_collection</span><span class="token operator">=</span><span class="token string">"ap-northeast-2"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">credentials</span><span class="token operator">=</span>access_key<span class="token operator">=</span><span class="token string">"ASIADJO3WTX6WPLJM42V"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">credentials</span><span class="token operator">=</span>secret_key<span class="token operator">=</span><span class="token string">"bCiYmNroLxLmPNQ47VIvjlm8mQu5oktZcQdq195w"</span>
    
Success<span class="token operator">!</span> Data written to: keymgmt/kms/aws-kms
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>AWS KMS 공급자 리소스를 구성하는 매개변수의 설명은 다음과 같다.</p>
<table>
<thead>
<tr>
<th style="text-align:left">매개변수</th>
<th style="text-align:left">설명</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">provider</td>
<td style="text-align:left">AWS KMS를 구성하는 경우 <code v-pre>awskms</code>를 사용</td>
</tr>
<tr>
<td style="text-align:left">key_collection</td>
<td style="text-align:left">AWS 리전을 지정</td>
</tr>
<tr>
<td style="text-align:left">credentials=access_key</td>
<td style="text-align:left">AWS Access Key</td>
</tr>
<tr>
<td style="text-align:left">credentials=secret_key</td>
<td style="text-align:left">AWS Secret Key</td>
</tr>
<tr>
<td style="text-align:left">credentials=session_token</td>
<td style="text-align:left">AWS Session Token</td>
</tr>
<tr>
<td style="text-align:left">credentials=endpoint</td>
<td style="text-align:left">AWS KMS API endpoint</td>
</tr>
</tbody>
</table>
<p>AWS KMS 공급자 리소스에 암호화 키를 배포</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code> vault <span class="token function">write</span> keymgmt/kms/:name/key/:key_name
$ vault <span class="token function">write</span> keymgmt/kms/aws-kms-anea2/key/aes256-gcm96 <span class="token punctuation">\</span>
    <span class="token assign-left variable">purpose</span><span class="token operator">=</span><span class="token string">"encrypt,decrypt"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">protection</span><span class="token operator">=</span><span class="token string">"hsm"</span>
    
Success<span class="token operator">!</span> Data written to: keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>AWS KMS의 키 사용 목적(purpose)로는 <code v-pre>encrypt</code>와 <code v-pre>decrypt</code>를 함께 사용한다.</li>
<li>AWS KMS에서는 보호 수준(protection)을 <code v-pre>hsm</code>만 사용 가능하다.</li>
</ul>
<p>등록이 완료되면 AWS Console의 <code v-pre>Key Management Service(KMS)</code>에서 <code v-pre>고객 관리형 키</code>로 등록된다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS Console 2023-07-05 21-15-20.png" alt="KMS Console 2023-07-05 21-15-20" tabindex="0" loading="lazy"><figcaption>KMS Console 2023-07-05 21-15-20</figcaption></figure>
<p>생성된 키정보를 확인하여 현재 버전에 명시된 ID가 AWS 상의 KMS의 <code v-pre>키 ID</code>와 같은지 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
Key                  Value
---                  -----
distribution_time    <span class="token number">2023</span>-07-05T12:14:52.173163449Z
name                 aes256-gcm96-1688559292
protection           hsm
purpose              decrypt,encrypt
versions             map<span class="token punctuation">[</span><span class="token number">1</span>:503e44bf-7629-47c3-8c22-a5337b3aab3a<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS Console 2023-07-05 21-20-08.png" alt="KMS Console 2023-07-05 21-20-08" tabindex="0" loading="lazy"><figcaption>KMS Console 2023-07-05 21-20-08</figcaption></figure>
<p>AWS KMS사용자의 경우 vault로의 API 요청으로 키ID를 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-H</span> <span class="token string">"X-Vault-Token: token"</span> <span class="token parameter variable">-X</span> GET http://<span class="token operator">&lt;</span>vault_hostname<span class="token operator">></span>:<span class="token operator">&lt;</span>port<span class="token operator">></span>/v1/keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
<span class="token punctuation">{</span>
  <span class="token string">"request_id"</span><span class="token builtin class-name">:</span> <span class="token string">"e8147c9e-a3fd-71b6-075e-8f2d67393127"</span>,
  <span class="token string">"lease_id"</span><span class="token builtin class-name">:</span> <span class="token string">""</span>,
  <span class="token string">"lease_duration"</span><span class="token builtin class-name">:</span> <span class="token number">0</span>,
  <span class="token string">"renewable"</span><span class="token builtin class-name">:</span> false,
  <span class="token string">"data"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
    <span class="token string">"distribution_time"</span><span class="token builtin class-name">:</span> <span class="token string">"2023-07-05T12:14:52.173163449Z"</span>,
    <span class="token string">"name"</span><span class="token builtin class-name">:</span> <span class="token string">"aes256-gcm96-1688602383"</span>,
    <span class="token string">"protection"</span><span class="token builtin class-name">:</span> <span class="token string">"hsm"</span>,
    <span class="token string">"purpose"</span><span class="token builtin class-name">:</span> <span class="token string">"decrypt,encrypt"</span>,
    <span class="token string">"versions"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
      <span class="token string">"1"</span><span class="token builtin class-name">:</span> <span class="token string">"503e44bf-7629-47c3-8c22-a5337b3aab3a"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>,
  <span class="token string">"warnings"</span><span class="token builtin class-name">:</span> null
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>AWS KMS에 적용된 키를 순환시킨다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> keymgmt/key/aes256-gcm96/rotate
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>순환되어 새로 추가된 키 버전을 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/key/aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">false</span>
latest_version         <span class="token number">2</span>
min_enabled_version    <span class="token number">1</span>
name                   aes256-gcm96
<span class="token builtin class-name">type</span>                   aes256-gcm96
versions               map<span class="token punctuation">[</span><span class="token number">1</span>:map<span class="token punctuation">[</span>creation_time:2023-07-05T12:04:48.099141545Z<span class="token punctuation">]</span> <span class="token number">2</span>:map<span class="token punctuation">[</span>creation_time:2023-07-05T12:23:01.870942633Z<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>키가 적용된 AWS KMS에도 순환된 키 버전이 적용됨을 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
Key                  Value
---                  -----
distribution_time    <span class="token number">2023</span>-07-05T12:14:52.173163449Z
name                 aes256-gcm96-1688559292
protection           hsm
purpose              decrypt,encrypt
versions             map<span class="token punctuation">[</span><span class="token number">1</span>:503e44bf-7629-47c3-8c22-a5337b3aab3a <span class="token number">2</span>:c2bb1927-76b2-4fce-8b32-73569489a70c<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>추가된 마지막 키는 별칭(Alias)로 지정되어 앱에서는 <code v-pre>alias/hashicorp/&lt;name&gt;</code>으로 호출할 수 있다.</p>
<p>(e.g. <code v-pre>alias/hashicorp/aes256-gcm96-1688602383</code>)</p>
<p>AWS Console에서 확인하면, 신규 <code v-pre>키 ID</code>가 적용된 항목이 새로 추가됨을 확인할 수 있다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS Console 2023-07-05 21-25-12.png" alt="KMS Console 2023-07-05 21-25-12" tabindex="0" loading="lazy"><figcaption>KMS Console 2023-07-05 21-25-12</figcaption></figure>
<p>적용된 키의 최소 버전을 업데이트 한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> keymgmt/key/aes256-gcm96 <span class="token assign-left variable">min_enabled_version</span><span class="token operator">=</span><span class="token number">2</span> <span class="token assign-left variable">deletion_allowed</span><span class="token operator">=</span>true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>키의 최소 버전에 따라 그 이하의 키가 삭제되었음을 확인한다. (비활성 처리)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/key/aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">true</span>
latest_version         <span class="token number">2</span>
min_enabled_version    <span class="token number">2</span>
name                   aes256-gcm96
<span class="token builtin class-name">type</span>                   aes256-gcm96
versions               map<span class="token punctuation">[</span><span class="token number">2</span>:map<span class="token punctuation">[</span>creation_time:2023-07-05T12:23:01.870942633Z<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>AWS KMS에 적용된 버전은 기존 버전은 존재하나, AWS Console에서 확인하면 비활성 처리됨을 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
Key                  Value
---                  -----
distribution_time    <span class="token number">2023</span>-07-05T12:14:52.173163449Z
name                 aes256-gcm96-1688559292
protection           hsm
purpose              decrypt,encrypt
versions             map<span class="token punctuation">[</span><span class="token number">1</span>:503e44bf-7629-47c3-8c22-a5337b3aab3a <span class="token number">2</span>:c2bb1927-76b2-4fce-8b32-73569489a70c<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS Console 2023-07-05 21-31-05.png" alt="KMS Console 2023-07-05 21-31-05" tabindex="0" loading="lazy"><figcaption>KMS Console 2023-07-05 21-31-05</figcaption></figure>
<p>최소 버전을 이전 버전을 포함하여 업데이트 하면 이전 버전의 키가 복구된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> keymgmt/key/aes256-gcm96 <span class="token assign-left variable">min_enabled_version</span><span class="token operator">=</span><span class="token number">1</span> <span class="token assign-left variable">deletion_allowed</span><span class="token operator">=</span>true
Success<span class="token operator">!</span> Data written to: keymgmt/key/aes256-gcm96

$ vault <span class="token builtin class-name">read</span> keymgmt/key/aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">true</span>
latest_version         <span class="token number">2</span>
min_enabled_version    <span class="token number">1</span>
name                   aes256-gcm96
<span class="token builtin class-name">type</span>                   aes256-gcm96
versions               map<span class="token punctuation">[</span><span class="token number">1</span>:map<span class="token punctuation">[</span>creation_time:2023-07-05T12:04:48.099141545Z<span class="token punctuation">]</span> <span class="token number">2</span>:map<span class="token punctuation">[</span>creation_time:2023-07-05T12:23:01.870942633Z<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS Console 2023-07-05 21-33-07.png" alt="KMS Console 2023-07-05 21-33-07" tabindex="0" loading="lazy"><figcaption>KMS Console 2023-07-05 21-33-07</figcaption></figure>
<p>AWS KMS 구성에서 키를 삭제하는 경우 적용된 키가 일괄 <code v-pre>삭제 대기</code> 상태로 변경되며, 해당 키는 삭제 가능하다. (AWS 정책상 7~30일 유예)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault delete keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
Success<span class="token operator">!</span> Data deleted <span class="token punctuation">(</span>if it existed<span class="token punctuation">)</span> at: keymgmt/kms/aws-kms-anea2/key/aes256-gcm96
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/KMS Console 2023-07-05 21-59-17.png" alt="KMS Console 2023-07-05 21-59-17" tabindex="0" loading="lazy"><figcaption>KMS Console 2023-07-05 21-59-17</figcaption></figure>
<h3 id="주의-사항-1" tabindex="-1"><a class="header-anchor" href="#주의-사항-1" aria-hidden="true">#</a> 주의 사항 1.</h3>
<p>AWS KMS에서 생성된 암호화 키는 기본적으로 해당 리전에 한정되어 사용된다. 암호화 키는 생성된 리전 내에서만 사용 가능하며, 다른 리전에 직접 이동시키는 것은 불가능하다. 이는 AWS KMS 서비스의 설계와 보안 모델에 기인한 제약 사항이다.</p>
<p>AWS KMS는 키 관리와 관련된 강력한 보안 제어를 제공합니다. 이를 위해 암호화 키는 해당 리전의 KMS 서비스에 의해 엄격하게 관리되며, 다른 리전에 암호화 키를 이동시키는 것은 보안상의 이슈를 야기할 수 있어 기본 구성은 아니다.</p>
<p>따라서 암호화 키를 다른 AWS 리전의 KMS에 적용하려면, 해당 리전에서 새로운 암호화 키를 생성해야 합니다. 이는 암호화 키의 보안성과 범위를 유지하기 위해 필요한 조치이다.</p>
<p>만약 여러 리전에서 동일한 암호화 키를 사용해야 하는 경우에는 AWS KMS의 Cross-Region Replication 기능을 사용해야 한다.</p>
<h3 id="주의-사항-2" tabindex="-1"><a class="header-anchor" href="#주의-사항-2" aria-hidden="true">#</a> 주의 사항 2.</h3>
<p>키 순환을 위해서는 데이터 암호화 시 복호화 가능한 AWS KMS의 Id 또는 arn을 함께 기록해야 복호화 시 사용할 키를 지정할 수 있다. 볼트의 <code v-pre>transit</code>과는 달리 새로 생성된 키는 기존 암호화된 데이터를 복호화 할 수 없다.</p>
<h2 id="_1-5-테스트를-위한-예제-python" tabindex="-1"><a class="header-anchor" href="#_1-5-테스트를-위한-예제-python" aria-hidden="true">#</a> 1.5 테스트를 위한 예제 - Python</h2>
<ul>
<li>python 3.x</li>
<li><code v-pre>boto3</code>와 <code v-pre>pycryptodome</code> 패키</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ python <span class="token parameter variable">--version</span>
Python <span class="token number">3.9</span>.12

$ pip <span class="token function">install</span> boto3
$ pip <span class="token function">install</span> pycryptodome
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="encryption" tabindex="-1"><a class="header-anchor" href="#encryption" aria-hidden="true">#</a> Encryption</h3>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token keyword">import</span> base64
<span class="token keyword">import</span> json
<span class="token keyword">import</span> logging
<span class="token keyword">import</span> boto3
<span class="token keyword">from</span> botocore<span class="token punctuation">.</span>exceptions <span class="token keyword">import</span> ClientError
AWS_REGION <span class="token operator">=</span> <span class="token string">'ap-northeast-2'</span>

logger <span class="token operator">=</span> logging<span class="token punctuation">.</span>getLogger<span class="token punctuation">(</span><span class="token punctuation">)</span>
logging<span class="token punctuation">.</span>basicConfig<span class="token punctuation">(</span>level<span class="token operator">=</span>logging<span class="token punctuation">.</span>INFO<span class="token punctuation">,</span> <span class="token builtin">format</span><span class="token operator">=</span><span class="token string">'%(asctime)s: %(levelname)s: %(message)s'</span><span class="token punctuation">)</span>
kms_client <span class="token operator">=</span> boto3<span class="token punctuation">.</span>client<span class="token punctuation">(</span><span class="token string">"kms"</span><span class="token punctuation">,</span> region_name<span class="token operator">=</span>AWS_REGION<span class="token punctuation">)</span>

<span class="token keyword">def</span> <span class="token function">encrypt</span><span class="token punctuation">(</span>secret<span class="token punctuation">,</span> alias<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token triple-quoted-string string">"""
    Encrypts plaintext into ciphertext by using a KMS key.
    """</span>
    <span class="token keyword">try</span><span class="token punctuation">:</span>
        cipher_text <span class="token operator">=</span> kms_client<span class="token punctuation">.</span>encrypt<span class="token punctuation">(</span>
            KeyId<span class="token operator">=</span>alias<span class="token punctuation">,</span>
            Plaintext<span class="token operator">=</span><span class="token builtin">bytes</span><span class="token punctuation">(</span>secret<span class="token punctuation">,</span> encoding<span class="token operator">=</span><span class="token string">'utf8'</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token punctuation">)</span>
    <span class="token keyword">except</span> ClientError<span class="token punctuation">:</span>
        logger<span class="token punctuation">.</span>exception<span class="token punctuation">(</span><span class="token string">'Could not encrypt the string.'</span><span class="token punctuation">)</span>
        <span class="token keyword">raise</span>
    <span class="token keyword">else</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> base64<span class="token punctuation">.</span>b64encode<span class="token punctuation">(</span>cipher_text<span class="token punctuation">[</span><span class="token string">"CiphertextBlob"</span><span class="token punctuation">]</span><span class="token punctuation">)</span>

<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
     Constants
    SECRET <span class="token operator">=</span> <span class="token string">'hands-on-vault-key-management'</span>
    KEY_ALIAS <span class="token operator">=</span> <span class="token string">'alias/hashicorp/aes256-gcm96-1688605574'</span>
    logger<span class="token punctuation">.</span>info<span class="token punctuation">(</span><span class="token string">'Encrypting...'</span><span class="token punctuation">)</span>
    kms <span class="token operator">=</span> encrypt<span class="token punctuation">(</span>SECRET<span class="token punctuation">,</span> KEY_ALIAS<span class="token punctuation">)</span>
    logger<span class="token punctuation">.</span>info<span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f'Encrypted string: </span><span class="token interpolation"><span class="token punctuation">{</span>kms<span class="token punctuation">}</span></span><span class="token string">.'</span></span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="decryption" tabindex="-1"><a class="header-anchor" href="#decryption" aria-hidden="true">#</a> Decryption</h3>
<ul>
<li>위 encryption 결과로 생성된 BLOB 데이터를 코드의 <code v-pre>CIPHER_BLOB</code>에 붙여넣어 테스트</li>
</ul>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token keyword">import</span> base64
<span class="token keyword">import</span> json
<span class="token keyword">import</span> logging
<span class="token keyword">import</span> boto3
<span class="token keyword">from</span> botocore<span class="token punctuation">.</span>exceptions <span class="token keyword">import</span> ClientError
AWS_REGION <span class="token operator">=</span> <span class="token string">'ap-northeast-2'</span>

logger <span class="token operator">=</span> logging<span class="token punctuation">.</span>getLogger<span class="token punctuation">(</span><span class="token punctuation">)</span>
logging<span class="token punctuation">.</span>basicConfig<span class="token punctuation">(</span>level<span class="token operator">=</span>logging<span class="token punctuation">.</span>INFO<span class="token punctuation">,</span> <span class="token builtin">format</span><span class="token operator">=</span><span class="token string">'%(asctime)s: %(levelname)s: %(message)s'</span><span class="token punctuation">)</span>
kms_client <span class="token operator">=</span> boto3<span class="token punctuation">.</span>client<span class="token punctuation">(</span><span class="token string">"kms"</span><span class="token punctuation">,</span> region_name<span class="token operator">=</span>AWS_REGION<span class="token punctuation">)</span>

<span class="token keyword">def</span> <span class="token function">decrypt</span><span class="token punctuation">(</span>cipher_text<span class="token punctuation">,</span> alias<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token triple-quoted-string string">"""
    Decrypts ciphertext that was encrypted by a KMS key.
    """</span>
    <span class="token keyword">try</span><span class="token punctuation">:</span>
        plain_text <span class="token operator">=</span> kms_client<span class="token punctuation">.</span>decrypt<span class="token punctuation">(</span>KeyId<span class="token operator">=</span>alias<span class="token punctuation">,</span> CiphertextBlob<span class="token operator">=</span><span class="token builtin">bytes</span><span class="token punctuation">(</span>base64<span class="token punctuation">.</span>b64decode<span class="token punctuation">(</span>cipher_text<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
    <span class="token keyword">except</span> ClientError<span class="token punctuation">:</span>
        logger<span class="token punctuation">.</span>exception<span class="token punctuation">(</span><span class="token string">'Could not decrypt the string.'</span><span class="token punctuation">)</span>
        <span class="token keyword">raise</span>
    <span class="token keyword">else</span><span class="token punctuation">:</span>
        <span class="token keyword">return</span> plain_text<span class="token punctuation">[</span><span class="token string">'Plaintext'</span><span class="token punctuation">]</span>

<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">'__main__'</span><span class="token punctuation">:</span>
     Constants
    CIPHER_BLOB <span class="token operator">=</span> <span class="token string">'AQICAHgGLc+TNQuAGEYhHYwf5zxQz9XvN0uXI2N4YU+dPYN0fgFmLVCFrkLNP+EJWytolEIfAAAAezB5BgkqhkiG9w0BBwagbDBqAgEAMGUGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMn0LDunt5nrftC18BAgEQgDgPSUhp2iLAGjEFUuSOSxDdYj1m9o4KetZJjmKfX4pvvZMJGkozLEnZpQ0KMET5NjjyGOzax7H84g=='</span>
    KEY_ALIAS <span class="token operator">=</span> <span class="token string">'alias/hashicorp/aes256-gcm96-1688605574'</span>
    logger<span class="token punctuation">.</span>info<span class="token punctuation">(</span><span class="token string">'Decrypting...'</span><span class="token punctuation">)</span>
    kms <span class="token operator">=</span> decrypt<span class="token punctuation">(</span>CIPHER_BLOB<span class="token punctuation">,</span> KEY_ALIAS<span class="token punctuation">)</span>
    logger<span class="token punctuation">.</span>info<span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f"Decrypted string: </span><span class="token interpolation"><span class="token punctuation">{</span>kms<span class="token punctuation">.</span>decode<span class="token punctuation">(</span><span class="token string">'utf8'</span><span class="token punctuation">)</span><span class="token punctuation">}</span></span><span class="token string">."</span></span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-azure-key-vault" tabindex="-1"><a class="header-anchor" href="#_2-azure-key-vault" aria-hidden="true">#</a> 2. Azure key Vault</h2>
<blockquote>
<p><a href="https://developer.hashicorp.com/vault/tutorials/adp/key-management-secrets-engine-azure-key-vault" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/vault/tutorials/adp/key-management-secrets-engine-azure-key-vault<ExternalLinkIcon/></a></p>
</blockquote>
<h3 id="_2-1-azure-key-vault-구성" tabindex="-1"><a class="header-anchor" href="#_2-1-azure-key-vault-구성" aria-hidden="true">#</a> 2.1 Azure Key Vault 구성</h3>
<ul>
<li>
<p>Azure Key Vault</p>
<ul>
<li>기존 생성된 Azure Key Vault를 관리</li>
<li><code v-pre>키 자격 증명 모음</code> 에서 새 키 생성</li>
</ul>
</li>
<li>
<p>Azure Key Vault 관리를 위한 권한</p>
<ul>
<li><code v-pre>create</code></li>
<li><code v-pre>delete</code></li>
<li><code v-pre>get</code></li>
<li><code v-pre>import</code></li>
<li><code v-pre>update</code></li>
</ul>
</li>
<li>
<p>Terraform Example</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">terraform</span> <span class="token punctuation">{</span>
  <span class="token keyword">required_providers</span> <span class="token punctuation">{</span>
    <span class="token property">azurerm</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"hashicorp/azurerm"</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"~> 3.65.0"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">provider<span class="token type variable"> "azurerm" </span></span><span class="token punctuation">{</span>
  <span class="token keyword">features</span> <span class="token punctuation">{</span>
    <span class="token keyword">key_vault</span> <span class="token punctuation">{</span>
      <span class="token property">purge_soft_delete_on_destroy</span>    <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token property">recover_soft_deleted_key_vaults</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"random_id"</span></span> <span class="token string">"app_rg_name"</span> <span class="token punctuation">{</span>
  <span class="token property">byte_length</span> <span class="token punctuation">=</span> <span class="token number">3</span>
<span class="token punctuation">}</span>

<span class="token keyword">data <span class="token type variable">"azurerm_client_config"</span></span> <span class="token string">"current"</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"azurerm_resource_group"</span></span> <span class="token string">"key_vault_rg"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>     <span class="token punctuation">=</span> <span class="token string">"gs-rg-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>random_id<span class="token punctuation">.</span>app_rg_name<span class="token punctuation">.</span>hex<span class="token punctuation">}</span></span>"</span>
  <span class="token property">location</span> <span class="token punctuation">=</span> <span class="token string">"Korea Central"</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"azurerm_key_vault"</span></span> <span class="token string">"example"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>                       <span class="token punctuation">=</span> <span class="token string">"gs-keyvault-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>random_id<span class="token punctuation">.</span>app_rg_name<span class="token punctuation">.</span>hex<span class="token punctuation">}</span></span>-vault"</span>
  <span class="token property">location</span>                   <span class="token punctuation">=</span> azurerm_resource_group.key_vault_rg.location
  <span class="token property">resource_group_name</span>        <span class="token punctuation">=</span> azurerm_resource_group.key_vault_rg.name
  <span class="token property">sku_name</span>                   <span class="token punctuation">=</span> <span class="token string">"premium"</span>
  <span class="token property">soft_delete_retention_days</span> <span class="token punctuation">=</span> <span class="token number">7</span>
  <span class="token property">tenant_id</span>                  <span class="token punctuation">=</span> data.azurerm_client_config.current.tenant_id

  <span class="token keyword">access_policy</span> <span class="token punctuation">{</span>
    <span class="token property">tenant_id</span> <span class="token punctuation">=</span> data.azurerm_client_config.current.tenant_id
    <span class="token property">object_id</span> <span class="token punctuation">=</span> data.azurerm_client_config.current.object_id

    <span class="token comment">// "Create", "Delete", "Get", "Import", "Update"</span>
    <span class="token property">key_permissions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"Backup"</span>, <span class="token string">"Create"</span>, <span class="token string">"Decrypt"</span>, <span class="token string">"Delete"</span>, <span class="token string">"Encrypt"</span>, <span class="token string">"Get"</span>, <span class="token string">"Import"</span>, <span class="token string">"List"</span>,
      <span class="token string">"Purge"</span>, <span class="token string">"Recover"</span>, <span class="token string">"Restore"</span>, <span class="token string">"Sign"</span>, <span class="token string">"UnwrapKey"</span>, <span class="token string">"Update"</span>, <span class="token string">"Verify"</span>, <span class="token string">"WrapKey"</span>,
      <span class="token string">"Release"</span>, <span class="token string">"Rotate"</span>, <span class="token string">"GetRotationPolicy"</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> "key_vault_name" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> azurerm_key_vault.example.name
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="_2-2-vault의-azure-key-vault-구성" tabindex="-1"><a class="header-anchor" href="#_2-2-vault의-azure-key-vault-구성" aria-hidden="true">#</a> 2.2 Vault의 Azure Key Vault 구성</h3>
<p>Azure Key Vault에서 호환되는 암호화 키를 생성한다.</p>
<ul>
<li>Azure Key Vault 지원 유형 : <code v-pre>rsa-2048</code>, <code v-pre>rsa-3072</code>, <code v-pre>rsa-4096</code></li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> keymgmt/key/rsa-2048-key <span class="token assign-left variable">type</span><span class="token operator">=</span><span class="token string">"rsa-2048"</span>
Success<span class="token operator">!</span> Data written to: keymgmt/key/rsa-2048-key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>생성된 암호화 키의 정보를 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/key/rsa-2048-key

Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">false</span>
latest_version         <span class="token number">1</span>
min_enabled_version    <span class="token number">1</span>
name                   rsa-2048-key
<span class="token builtin class-name">type</span>                   rsa-2048
versions               map<span class="token punctuation">[</span><span class="token number">1</span>:map<span class="token punctuation">[</span>creation_time:2023-07-14T19:18:28.45274+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2qK54OiinWQFdyupvkg0
HqBPpp/5H29fhcByipoEMpCMHpqNwgea2r6I3sTWX/0YdLZ6w/1L4Fc+B/yABu66
vXq31OXvnIkvkT73jn9qEQsnYIhqdnElngT+4DOD5nuxPd4e8Ov5OOCIAjKA36YI
VRiTJtR36qUFFVxxByGnvgSZ3Q090bRRLZx0WidqUilDAjh9CFucAcl3ybl5F80U
H3aA9HiakGm+hTV1PLZPOT9mhmZk92NFSRVEuEddNb7Rndg3RrZ2/Sgrlbmxc28R
SJnQswhA9Qbb9HmjCEmfo3rXpvEzJy8YCY24nk5GsyOwOA9z5uQwEJidBxmpsvdy
QQIDAQAB
-----END PUBLIC KEY-----
<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Azure Key Vault 공급자 리소스를 구성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code> 기본 Location은 <span class="token string">"West US"</span>
$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">AZURE_LOCATION</span><span class="token operator">=</span><span class="token string">'koreacentral'</span>

$ vault <span class="token function">write</span> keymgmt/kms/gs-keyvault-mgmt <span class="token punctuation">\</span>
    <span class="token assign-left variable">key_collection</span><span class="token operator">=</span><span class="token string">"gs-keyvault-ee81ec-vault"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">provider</span><span class="token operator">=</span><span class="token string">"azurekeyvault"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">credentials</span><span class="token operator">=</span>client_id<span class="token operator">=</span><span class="token variable">$AZURE_CLIENT_ID</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">credentials</span><span class="token operator">=</span>client_secret<span class="token operator">=</span><span class="token variable">$AZURE_CLIENT_SECRET</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">credentials</span><span class="token operator">=</span>tenant_id<span class="token operator">=</span><span class="token variable">$AZURE_TENANT_ID</span>
    
Success<span class="token operator">!</span> Data written to: keymgmt/kms/gs-keyvault-mgmt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Azure Key Vault 공급자 리소스를 구성하는 매개변수의 설명은 다음과 같다. credentials은 Managed Service Identity (MSI)가 구성된 Azure 상에서 Vault가 실행되거나 환경변수로 지정된 경우 생략 가능하다.</p>
<table>
<thead>
<tr>
<th style="text-align:left">매개변수</th>
<th style="text-align:left">설명</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">provider</td>
<td style="text-align:left">AWS KMS를 구성하는 경우 <code v-pre>awskms</code>를 사용</td>
</tr>
<tr>
<td style="text-align:left">key_collection</td>
<td style="text-align:left">기존 Azure Key Vault 인스턴스의 이름을 나타냅니다. 생성 후에는 변경할 수 없습니다.</td>
</tr>
<tr>
<td style="text-align:left">credentials=client_id</td>
<td style="text-align:left">Azure API를 호출하기 위한 자격 증명을 위한 클라이언트 ID (<code v-pre>AZURE_CLIENT_ID</code>)</td>
</tr>
<tr>
<td style="text-align:left">credentials=client_secret</td>
<td style="text-align:left">Azure API를 호출하기 위한 자격 증명을 위한 클라이언트 암호 (<code v-pre>AZURE_CLIENT_SECRET</code>)</td>
</tr>
<tr>
<td style="text-align:left">credentials=tenant_id</td>
<td style="text-align:left">Azure Active Directory 조직의 테넌트 ID (<code v-pre>AZURE_TENANT_ID</code>)</td>
</tr>
</tbody>
</table>
<p>Azure Key Vault 공급자 리소스에 암호화 키를 배포</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code> vault <span class="token function">write</span> keymgmt/kms/:name/key/:key_name
$ vault <span class="token function">write</span> keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key <span class="token punctuation">\</span>
    <span class="token assign-left variable">purpose</span><span class="token operator">=</span><span class="token string">"encrypt,decrypt"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">protection</span><span class="token operator">=</span><span class="token string">"hsm"</span>
    
Success<span class="token operator">!</span> Data written to: keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key

$ vault <span class="token function">write</span> keymgmt/kms/gs-keyvault-mgmt/key/rsa-4096-sign <span class="token punctuation">\</span>
    <span class="token assign-left variable">purpose</span><span class="token operator">=</span><span class="token string">"sign"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">protection</span><span class="token operator">=</span><span class="token string">"hsm"</span>
    
Success<span class="token operator">!</span> Data written to: keymgmt/kms/gs-keyvault-mgmt/key/rsa-4096-sign
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/gs-keyvault-ee81ec-vault - Microsoft Azure 2023-07-14 20-24-36.png" alt="gs-keyvault-ee81ec-vault - Microsoft Azure 2023-07-14 20-24-36" tabindex="0" loading="lazy"><figcaption>gs-keyvault-ee81ec-vault - Microsoft Azure 2023-07-14 20-24-36</figcaption></figure>
<p>현재 키 버전을 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key
Key                  Value
---                  -----
distribution_time    <span class="token number">2023</span>-07-14T19:19:47.100453+09:00
name                 rsa-2048-key-1689329987
protection           hsm
purpose              decrypt,encrypt
versions             map<span class="token punctuation">[</span><span class="token number">1</span>:80bb514c42f14422b3d3405d3b2fa1fd<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230714204157598.png" alt="image-20230714204157598" tabindex="0" loading="lazy"><figcaption>image-20230714204157598</figcaption></figure>
<p>Azure Key Vault에 적용된 키를 순환시킨다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> keymgmt/key/rsa-2048-key/rotate
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>순환되어 새로 추가된 키 버전을 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/key/rsa-2048-key

Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">false</span>
latest_version         <span class="token number">2</span>
min_enabled_version    <span class="token number">1</span>
name                   rsa-2048-key
<span class="token builtin class-name">type</span>                   rsa-2048
versions               map<span class="token punctuation">[</span><span class="token number">1</span>:map<span class="token punctuation">[</span>creation_time:2023-07-14T19:18:28.45274+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2qK54OiinWQFdyupvkg0
HqBPpp/5H29fhcByipoEMpCMHpqNwgea2r6I3sTWX/0YdLZ6w/1L4Fc+B/yABu66
vXq31OXvnIkvkT73jn9qEQsnYIhqdnElngT+4DOD5nuxPd4e8Ov5OOCIAjKA36YI
VRiTJtR36qUFFVxxByGnvgSZ3Q090bRRLZx0WidqUilDAjh9CFucAcl3ybl5F80U
H3aA9HiakGm+hTV1PLZPOT9mhmZk92NFSRVEuEddNb7Rndg3RrZ2/Sgrlbmxc28R
SJnQswhA9Qbb9HmjCEmfo3rXpvEzJy8YCY24nk5GsyOwOA9z5uQwEJidBxmpsvdy
QQIDAQAB
-----END PUBLIC KEY-----
<span class="token punctuation">]</span> <span class="token number">2</span>:map<span class="token punctuation">[</span>creation_time:2023-07-14T20:14:02.507171+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy+5ziHlHjaKN+YqfZX70
5pxjVZqT4rq2ZkFAK+HRNbSW9QQltBpnn1hmyDEhZX8FAxTiaEpF01ZVptmrNY3Q
KkHMduqUReA1jjcLbQ2E6DYCp3B/RUDLD7vNuXHvgGqTQr7aeEs0JHKYTERXt0MQ
KUeFCBRi6zyAiTrcGU2o2/PRNs3Lmxjf88IFziDbcCj4Alqj1+0ruD0n1/HG6yXI
1F5wYzziimJ+J4A3Sw2xQC/1tOxOR2onjMDT4Fd1xIsp3N7wKWFgGmQoZKn1ETtX
e4m1ZLZEmrQnpz0aoiG1IXvwfa3ncjPhrhXM2f53p0r9Zuwuq4SZpg/ZRM1zd9No
BQIDAQAB
-----END PUBLIC KEY-----
<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>키가 적용된 AWS KMS에도 순환된 키 버전이 적용됨을 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key
Key                  Value
---                  -----
distribution_time    <span class="token number">2023</span>-07-14T19:19:47.100453+09:00
name                 rsa-2048-key-1689329987
protection           hsm
purpose              decrypt,encrypt
versions             map<span class="token punctuation">[</span><span class="token number">1</span>:80bb514c42f14422b3d3405d3b2fa1fd <span class="token number">2</span>:cb4765bae58b40e8bc1d77a96f0c0079<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>추가된 마지막 키는 key_id로 지정되어 앱에서는 <code v-pre>https://&lt;kms이름&gt;.vault.azure.net/keys/&lt;key이름&gt;/&lt;적용된 key 버전&gt;</code>으로 호출할 수 있다.</p>
<p>(e.g. <code v-pre>https://gs-keyvault-ee81ec-vault.vault.azure.net/keys/rsa-2048-key-1689329987/80bb514c42f14422b3d3405d3b2fa1fd</code>)</p>
<p>Azure Console에서 확인하면, 신규 <code v-pre>키 ID</code>가 적용된 항목이 새로 추가됨을 확인할 수 있다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-14-19.png" alt="rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-14-19" tabindex="0" loading="lazy"><figcaption>rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-14-19</figcaption></figure>
<p>적용된 키의 최소 버전을 업데이트 한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> keymgmt/key/rsa-2048-key <span class="token assign-left variable">min_enabled_version</span><span class="token operator">=</span><span class="token number">2</span> <span class="token assign-left variable">deletion_allowed</span><span class="token operator">=</span>true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>키의 최소 버전에 따라 그 이하의 키가 삭제되었음을 확인한다. (비활성 처리)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/key/rsa-2048-key
Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">true</span>
latest_version         <span class="token number">2</span>
min_enabled_version    <span class="token number">2</span>
name                   rsa-2048-key
<span class="token builtin class-name">type</span>                   rsa-2048
versions               map<span class="token punctuation">[</span><span class="token number">2</span>:map<span class="token punctuation">[</span>creation_time:2023-07-14T20:14:02.507171+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy+5ziHlHjaKN+YqfZX70
5pxjVZqT4rq2ZkFAK+HRNbSW9QQltBpnn1hmyDEhZX8FAxTiaEpF01ZVptmrNY3Q
KkHMduqUReA1jjcLbQ2E6DYCp3B/RUDLD7vNuXHvgGqTQr7aeEs0JHKYTERXt0MQ
KUeFCBRi6zyAiTrcGU2o2/PRNs3Lmxjf88IFziDbcCj4Alqj1+0ruD0n1/HG6yXI
1F5wYzziimJ+J4A3Sw2xQC/1tOxOR2onjMDT4Fd1xIsp3N7wKWFgGmQoZKn1ETtX
e4m1ZLZEmrQnpz0aoiG1IXvwfa3ncjPhrhXM2f53p0r9Zuwuq4SZpg/ZRM1zd9No
BQIDAQAB
-----END PUBLIC KEY-----
<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Azure Key Vault에 적용된 버전은 기존 버전은 존재하나, AWS Console에서 확인하면 비활성 처리됨을 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key
Key                  Value
---                  -----
distribution_time    <span class="token number">2023</span>-07-14T19:19:47.100453+09:00
name                 rsa-2048-key-1689329987
protection           hsm
purpose              decrypt,encrypt
versions             map<span class="token punctuation">[</span><span class="token number">1</span>:80bb514c42f14422b3d3405d3b2fa1fd <span class="token number">2</span>:cb4765bae58b40e8bc1d77a96f0c0079<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-18-38.png" alt="rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-18-38" tabindex="0" loading="lazy"><figcaption>rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-18-38</figcaption></figure>
<p>최소 버전을 이전 버전을 포함하여 업데이트 하면 이전 버전의 키가 복구된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> keymgmt/key/rsa-2048-key <span class="token assign-left variable">min_enabled_version</span><span class="token operator">=</span><span class="token number">1</span> <span class="token assign-left variable">deletion_allowed</span><span class="token operator">=</span>true
Success<span class="token operator">!</span> Data written to: keymgmt/key/aes256-gcm96

$ vault <span class="token builtin class-name">read</span> keymgmt/key/rsa-2048-key
Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">true</span>
latest_version         <span class="token number">2</span>
min_enabled_version    <span class="token number">1</span>
name                   rsa-2048-key
<span class="token builtin class-name">type</span>                   rsa-2048
versions               map<span class="token punctuation">[</span><span class="token number">1</span>:map<span class="token punctuation">[</span>creation_time:2023-07-14T19:18:28.45274+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2qK54OiinWQFdyupvkg0
HqBPpp/5H29fhcByipoEMpCMHpqNwgea2r6I3sTWX/0YdLZ6w/1L4Fc+B/yABu66
vXq31OXvnIkvkT73jn9qEQsnYIhqdnElngT+4DOD5nuxPd4e8Ov5OOCIAjKA36YI
VRiTJtR36qUFFVxxByGnvgSZ3Q090bRRLZx0WidqUilDAjh9CFucAcl3ybl5F80U
H3aA9HiakGm+hTV1PLZPOT9mhmZk92NFSRVEuEddNb7Rndg3RrZ2/Sgrlbmxc28R
SJnQswhA9Qbb9HmjCEmfo3rXpvEzJy8YCY24nk5GsyOwOA9z5uQwEJidBxmpsvdy
QQIDAQAB
-----END PUBLIC KEY-----
<span class="token punctuation">]</span> <span class="token number">2</span>:map<span class="token punctuation">[</span>creation_time:2023-07-14T20:14:02.507171+09:00 public_key:-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy+5ziHlHjaKN+YqfZX70
5pxjVZqT4rq2ZkFAK+HRNbSW9QQltBpnn1hmyDEhZX8FAxTiaEpF01ZVptmrNY3Q
KkHMduqUReA1jjcLbQ2E6DYCp3B/RUDLD7vNuXHvgGqTQr7aeEs0JHKYTERXt0MQ
KUeFCBRi6zyAiTrcGU2o2/PRNs3Lmxjf88IFziDbcCj4Alqj1+0ruD0n1/HG6yXI
1F5wYzziimJ+J4A3Sw2xQC/1tOxOR2onjMDT4Fd1xIsp3N7wKWFgGmQoZKn1ETtX
e4m1ZLZEmrQnpz0aoiG1IXvwfa3ncjPhrhXM2f53p0r9Zuwuq4SZpg/ZRM1zd9No
BQIDAQAB
-----END PUBLIC KEY-----
<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-19-34.png" alt="rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-19-34" tabindex="0" loading="lazy"><figcaption>rsa-2048-key-1689329987 - Microsoft Azure 2023-07-14 20-19-34</figcaption></figure>
<p>Azure Key Vault 구성에서 키를 삭제하는 경우 적용된 키가 일괄 삭제된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault delete keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key
Success<span class="token operator">!</span> Data deleted <span class="token punctuation">(</span>if it existed<span class="token punctuation">)</span> at: keymgmt/kms/gs-keyvault-mgmt/key/rsa-2048-key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/찾을 수 없음 - Microsoft Azure 2023-07-14 20-20-51.png" alt="찾을 수 없음 - Microsoft Azure 2023-07-14 20-20-51" tabindex="0" loading="lazy"><figcaption>찾을 수 없음 - Microsoft Azure 2023-07-14 20-20-51</figcaption></figure>
<h3 id="주의-사항" tabindex="-1"><a class="header-anchor" href="#주의-사항" aria-hidden="true">#</a> 주의 사항.</h3>
<p>키 순환을 위해서는 데이터 암호화 시 복호화 가능한 AWS KMS의 Id 또는 arn을 함께 기록해야 복호화 시 사용할 키를 지정할 수 있다. 볼트의 <code v-pre>transit</code>과는 달리 새로 생성된 키는 기존 암호화된 데이터를 복호화 할 수 없다.</p>
<h3 id="_2-3-테스트를-위한-예제-python" tabindex="-1"><a class="header-anchor" href="#_2-3-테스트를-위한-예제-python" aria-hidden="true">#</a> 2.3 테스트를 위한 예제 - Python</h3>
<blockquote>
<p><a href="https://learn.microsoft.com/en-us/python/api/azure-keyvault-keys/azure.keyvault.keys.crypto?view=azure-python" target="_blank" rel="noopener noreferrer">https://learn.microsoft.com/en-us/python/api/azure-keyvault-keys/azure.keyvault.keys.crypto?view=azure-python<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>python 3.x</li>
<li><code v-pre>azure-keyvault-keys</code>, <code v-pre>azure-keyvault-secrets</code>,  <code v-pre>azure-identity</code> 패키지</li>
<li><code v-pre>aiohttp</code> 패키지</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ python <span class="token parameter variable">--version</span>
Python <span class="token number">3.9</span>.12

$ pip <span class="token function">install</span> azure-keyvault-keys azure-keyvault-secrets azure-identity aiohttp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="list" tabindex="-1"><a class="header-anchor" href="#list" aria-hidden="true">#</a> List</h4>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token keyword">from</span> azure<span class="token punctuation">.</span>identity <span class="token keyword">import</span> DefaultAzureCredential
<span class="token keyword">from</span> azure<span class="token punctuation">.</span>keyvault<span class="token punctuation">.</span>keys <span class="token keyword">import</span> KeyClient

credential <span class="token operator">=</span> DefaultAzureCredential<span class="token punctuation">(</span><span class="token punctuation">)</span>
key_client <span class="token operator">=</span> KeyClient<span class="token punctuation">(</span>vault_url<span class="token operator">=</span><span class="token string">"https://gs-keyvault-ee81ec-vault.vault.azure.net/"</span><span class="token punctuation">,</span> credential<span class="token operator">=</span>credential<span class="token punctuation">)</span>
keys <span class="token operator">=</span> key_client<span class="token punctuation">.</span>list_properties_of_keys<span class="token punctuation">(</span><span class="token punctuation">)</span>

<span class="token keyword">for</span> key <span class="token keyword">in</span> keys<span class="token punctuation">:</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span>key<span class="token punctuation">.</span>name<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ python vault_list.py

rsa-2048-key-1689329987
rsa-4096-sign-1689330068
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="encryption-1" tabindex="-1"><a class="header-anchor" href="#encryption-1" aria-hidden="true">#</a> Encryption</h4>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token keyword">from</span> azure<span class="token punctuation">.</span>identity <span class="token keyword">import</span> DefaultAzureCredential
<span class="token keyword">from</span> azure<span class="token punctuation">.</span>keyvault<span class="token punctuation">.</span>keys<span class="token punctuation">.</span>crypto <span class="token keyword">import</span> CryptographyClient

 Azure Key Vault 관련 설정
key_vault_name <span class="token operator">=</span> <span class="token string">"gs-keyvault-ee81ec-vault"</span>
key_id <span class="token operator">=</span> <span class="token string">"https://gs-keyvault-ee81ec-vault.vault.azure.net/keys/rsa-2048-key-1689329987/80bb514c42f14422b3d3405d3b2fa1fd"</span>

 인증 및 액세스 토큰 가져오기
credential <span class="token operator">=</span> DefaultAzureCredential<span class="token punctuation">(</span><span class="token punctuation">)</span>

 Key Vault 클라이언트 및 암호화 클라이언트 생성
cryptography_client <span class="token operator">=</span> CryptographyClient<span class="token punctuation">(</span>key<span class="token operator">=</span>key_id<span class="token punctuation">,</span> credential<span class="token operator">=</span>credential<span class="token punctuation">)</span>

 암호화할 데이터
data_to_encrypt <span class="token operator">=</span> <span class="token string">b"Hello, Azure Key Vault!"</span>

 데이터 암호화
result <span class="token operator">=</span> cryptography_client<span class="token punctuation">.</span>encrypt<span class="token punctuation">(</span>algorithm<span class="token operator">=</span><span class="token string">"RSA-OAEP"</span><span class="token punctuation">,</span> plaintext<span class="token operator">=</span>data_to_encrypt<span class="token punctuation">)</span>
encrypted_data <span class="token operator">=</span> result<span class="token punctuation">.</span>ciphertext

<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"암호화된 데이터:"</span><span class="token punctuation">,</span> encrypted_data<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ python encrypt.py
Local encrypt operation failed: <span class="token string">'str'</span> object has no attribute <span class="token string">'value'</span>
암호화된 데이터: b<span class="token string">"Q<span class="token entity" title="\x8e">\x8e</span><span class="token entity" title="\x94">\x94</span><span class="token entity" title="\xe0">\xe0</span>R<span class="token entity" title="\xd7">\xd7</span><span class="token entity" title="\xc5">\xc5</span><span class="token entity" title="\x87">\x87</span><span class="token entity" title="\xa4">\xa4</span>M<span class="token entity" title="\x9c">\x9c</span>Mx<span class="token entity" title="\xcc">\xcc</span>M<span class="token entity" title="\xc2">\xc2</span>S<span class="token entity" title="\xd5">\xd5</span>C<span class="token entity" title="\xe0">\xe0</span><span class="token entity" title="\xef">\xef</span>7<span class="token entity" title="\xf5">\xf5</span><span class="token entity" title="\x1a">\x1a</span>fJ8A<span class="token entity" title="\x81">\x81</span><span class="token entity" title="\xef">\xef</span><span class="token entity" title="\xfc">\xfc</span>A<span class="token entity" title="\x8b">\x8b</span><span class="token entity" title="\x82">\x82</span><span class="token entity" title="\xb4">\xb4</span><span class="token entity" title="\x8d">\x8d</span><span class="token entity" title="\x93">\x93</span><span class="token entity" title="\x17">\x17</span><span class="token entity" title="\xa7">\xa7</span><span class="token entity" title="\xc5">\xc5</span><span class="token entity" title="\x0b">\x0b</span>?x<span class="token entity" title="\x9b">\x9b</span><span class="token entity" title="\xa6">\xa6</span><span class="token entity" title="\xfd">\xfd</span><span class="token entity" title="\xc2">\xc2</span>qe&lt;_<span class="token entity" title="\x99">\x99</span>@yC<span class="token entity" title="\x16">\x16</span><span class="token entity" title="\xa6">\xa6</span><span class="token entity" title="\xcb">\xcb</span>Sn<span class="token entity" title="\x10">\x10</span>Z<span class="token entity" title="\xa9">\xa9</span>y<span class="token entity" title="\xa6">\xa6</span><span class="token entity" title="\xf5">\xf5</span>V<span class="token entity" title="\xdd">\xdd</span><span class="token entity" title="\xdc">\xdc</span><span class="token entity" title="\x9c">\x9c</span><span class="token entity" title="\xe7">\xe7</span><span class="token entity" title="\xf2">\xf2</span><span class="token entity" title="\x0f">\x0f</span>s<span class="token entity" title="\x9b">\x9b</span><span class="token entity" title="\x06">\x06</span>j<span class="token entity" title="\r">\r</span>+z<span class="token entity" title="\x11">\x11</span>D|lu<span class="token entity" title="\xce">\xce</span><span class="token entity" title="\xcc">\xcc</span>V<span class="token entity" title="\x9b">\x9b</span><span class="token entity" title="\xef">\xef</span><span class="token entity" title="\xb8">\xb8</span><span class="token entity" title="\x9c">\x9c</span><span class="token entity" title="\xc2">\xc2</span><span class="token entity" title="\x9b">\x9b</span>7A><span class="token entity" title="\xff">\xff</span><span class="token entity" title="\xf8">\xf8</span><span class="token entity" title="\x80">\x80</span>6<span class="token entity" title="\x98">\x98</span><span class="token entity" title="\x00">\x00</span>o.|):<span class="token entity" title="\xea">\xea</span><span class="token entity" title="\x9a">\x9a</span><span class="token entity" title="\xbc">\xbc</span>I<span class="token entity" title="\x92">\x92</span>b<span class="token entity" title="\x81">\x81</span>DE|<span class="token entity" title="\xc1">\xc1</span><span class="token entity" title="\x80">\x80</span><span class="token entity" title="\xae">\xae</span><span class="token entity" title="\xbb">\xbb</span><span class="token entity" title="\x7f">\x7f</span><span class="token entity" title="\xc9">\xc9</span><span class="token entity" title="\x8e">\x8e</span>5<span class="token entity" title="\xc5">\xc5</span><span class="token entity" title="\t">\t</span>|<span class="token entity" title="\xe8">\xe8</span><span class="token entity" title="\xc8">\xc8</span><span class="token entity" title="\xac">\xac</span><span class="token entity" title="\x1d">\x1d</span><span class="token entity" title="\x98">\x98</span><span class="token entity" title="\xc7">\xc7</span><span class="token entity" title="\xc0">\xc0</span><span class="token entity" title="\xca">\xca</span><span class="token entity" title="\x00">\x00</span>b<span class="token entity" title="\n">\n</span><span class="token entity" title="\x13">\x13</span><span class="token entity" title="\xe4">\xe4</span><span class="token entity" title="\xd1">\xd1</span>j<span class="token entity" title="\xe6">\xe6</span>]L<span class="token entity" title="\xff">\xff</span>'<span class="token entity" title="\xb7">\xb7</span><span class="token entity" title="\xbd">\xbd</span>^g<span class="token entity" title="\xb4">\xb4</span><span class="token entity" title="\x9e">\x9e</span>AZq#<span class="token entity" title="\x9c">\x9c</span><span class="token entity" title="\x10">\x10</span>A<span class="token entity" title="\x83">\x83</span><span class="token entity" title="\x82">\x82</span><span class="token entity" title="\x9d">\x9d</span><span class="token entity" title="\x1b">\x1b</span>XR<span class="token entity" title="\xba">\xba</span><span class="token entity" title="\xb6">\xb6</span><span class="token entity" title="\x17">\x17</span><span class="token entity" title="\xc3">\xc3</span>&amp;<span class="token entity" title="\xaa">\xaa</span><span class="token entity" title="\x95">\x95</span>l<span class="token entity" title="\x83">\x83</span><span class="token entity" title="\xfc">\xfc</span>s<span class="token entity" title="\x89">\x89</span>)<span class="token entity" title="\xb1">\xb1</span><span class="token entity" title="\xde">\xde</span>^<span class="token entity" title="\x07">\x07</span><span class="token entity" title="\xb3">\xb3</span>s<span class="token entity" title="\x87">\x87</span><span class="token entity" title="\x90">\x90</span><span class="token entity" title="\xfd">\xfd</span><span class="token entity" title="\x83">\x83</span><span class="token entity" title="\xf0">\xf0</span><span class="token entity" title="\xfc">\xfc</span><span class="token entity" title="\x15">\x15</span><span class="token entity" title="\x82">\x82</span><span class="token entity" title="\x1a">\x1a</span><span class="token entity" title="\x02">\x02</span><span class="token entity" title="\xb1">\xb1</span><span class="token entity" title="\x93">\x93</span><span class="token entity" title="\x8e">\x8e</span><span class="token entity" title="\x1d">\x1d</span><span class="token entity" title="\x88">\x88</span>u!K<span class="token entity" title="\xc9">\xc9</span>y<span class="token entity" title="\xdf">\xdf</span>L^<span class="token entity" title="\x97">\x97</span><span class="token entity" title="\xe5">\xe5</span><span class="token entity" title="\xb5">\xb5</span><span class="token entity" title="\x05">\x05</span><span class="token entity" title="\x83">\x83</span><span class="token entity" title="\xe4">\xe4</span>!E1<span class="token entity" title="\x83">\x83</span>k<span class="token entity" title="\x11">\x11</span><span class="token entity" title="\xce">\xce</span>C}<span class="token entity" title="\xb0">\xb0</span>C{Td<span class="token entity" title="\xa1">\xa1</span><span class="token entity" title="\x8a">\x8a</span><span class="token entity" title="\x0f">\x0f</span>=<span class="token entity" title="\xbe">\xbe</span>E'<span class="token entity" title="\x0c">\x0c</span>7<span class="token entity" title="\x14">\x14</span><span class="token entity" title="\xbf">\xbf</span>Km<span class="token entity" title="\xd0">\xd0</span>I}<span class="token entity" title="\xb9">\xb9</span><span class="token entity" title="\xb9">\xb9</span>P<span class="token entity" title="\x93">\x93</span><span class="token entity" title="\xb3">\xb3</span>$<span class="token entity" title="\xa3">\xa3</span>3<span class="token entity" title="\xfd">\xfd</span>n"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="decryption-1" tabindex="-1"><a class="header-anchor" href="#decryption-1" aria-hidden="true">#</a> Decryption</h4>
<ul>
<li>위 encryption 결과로 생성된 BLOB 데이터를 코드의 <code v-pre>data_to_decrypt</code>에 붙여넣어 테스트</li>
</ul>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token keyword">from</span> azure<span class="token punctuation">.</span>identity <span class="token keyword">import</span> DefaultAzureCredential
<span class="token keyword">from</span> azure<span class="token punctuation">.</span>keyvault<span class="token punctuation">.</span>keys<span class="token punctuation">.</span>crypto <span class="token keyword">import</span> CryptographyClient

 Azure Key Vault 관련 설정
key_vault_name <span class="token operator">=</span> <span class="token string">"gs-keyvault-ee81ec-vault"</span>
key_id <span class="token operator">=</span> <span class="token string">"https://gs-keyvault-ee81ec-vault.vault.azure.net/keys/rsa-2048-key-1689329987/80bb514c42f14422b3d3405d3b2fa1fd"</span>

 인증 및 액세스 토큰 가져오기
credential <span class="token operator">=</span> DefaultAzureCredential<span class="token punctuation">(</span><span class="token punctuation">)</span>

 Key Vault 클라이언트 및 암호화 클라이언트 생성
cryptography_client <span class="token operator">=</span> CryptographyClient<span class="token punctuation">(</span>key<span class="token operator">=</span>key_id<span class="token punctuation">,</span> credential<span class="token operator">=</span>credential<span class="token punctuation">)</span>

 복호화할 데이터 <span class="token punctuation">(</span><span class="token string">b"Hello, Azure Key Vault!"</span><span class="token punctuation">)</span>
data_to_decrypt <span class="token operator">=</span> <span class="token string">b"Q\x8e\x94\xe0R\xd7\xc5\x87\xa4M\x9cMx\xccM\xc2S\xd5C\xe0\xef7\xf5\x1afJ8A\x81\xef\xfcA\x8b\x82\xb4\x8d\x93\x17\xa7\xc5\x0b?x\x9b\xa6\xfd\xc2qe&lt;_\x99@yC\x16\xa6\xcbSn\x10Z\xa9y\xa6\xf5V\xdd\xdc\x9c\xe7\xf2\x0fs\x9b\x06j\r+z\x11D|lu\xce\xccV\x9b\xef\xb8\x9c\xc2\x9b7A>\xff\xf8\x806\x98\x00o.|):\xea\x9a\xbcI\x92b\x81DE|\xc1\x80\xae\xbb\x7f\xc9\x8e5\xc5\t|\xe8\xc8\xac\x1d\x98\xc7\xc0\xca\x00b\n\x13\xe4\xd1j\xe6]L\xff'\xb7\xbd^g\xb4\x9eAZq#\x9c\x10A\x83\x82\x9d\x1bXR\xba\xb6\x17\xc3&amp;\xaa\x95l\x83\xfcs\x89)\xb1\xde^\x07\xb3s\x87\x90\xfd\x83\xf0\xfc\x15\x82\x1a\x02\xb1\x93\x8e\x1d\x88u!K\xc9y\xdfL^\x97\xe5\xb5\x05\x83\xe4!E1\x83k\x11\xceC}\xb0C{Td\xa1\x8a\x0f=\xbeE'\x0c7\x14\xbfKm\xd0I}\xb9\xb9P\x93\xb3$\xa33\xfdn"</span>

 데이터 암호화
result <span class="token operator">=</span> cryptography_client<span class="token punctuation">.</span>decrypt<span class="token punctuation">(</span>algorithm<span class="token operator">=</span><span class="token string">"RSA-OAEP"</span><span class="token punctuation">,</span> ciphertext<span class="token operator">=</span>data_to_decrypt<span class="token punctuation">)</span>
decrypted_data <span class="token operator">=</span> result<span class="token punctuation">.</span>plaintext

<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"복호화된 데이터:"</span><span class="token punctuation">,</span> decrypted_data<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ python decrypt.py 
복호화된 데이터: b<span class="token string">'Hello, Azure Key Vault!'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-gcp-cloud-kms" tabindex="-1"><a class="header-anchor" href="#_3-gcp-cloud-kms" aria-hidden="true">#</a> 3. GCP Cloud KMS</h2>
<h3 id="_3-1-vault-가-대상-gcp-cloud-kms-관리-위해-사용할-역할-권한" tabindex="-1"><a class="header-anchor" href="#_3-1-vault-가-대상-gcp-cloud-kms-관리-위해-사용할-역할-권한" aria-hidden="true">#</a> 3.1 Vault 가 대상 GCP Cloud KMS 관리 위해 사용할 역할 (권한)</h3>
<ol>
<li>
<p><a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">https://console.cloud.google.com<ExternalLinkIcon/></a> 을 통해 GCP 포탈에 접속 한다.</p>
</li>
<li>
<p>상단 <code v-pre>프로젝트 선택</code>에서 프로젝트 이름을 선택합니다.</p>
</li>
<li>
<p>좌측 메뉴확장 또는 검색을 통해 <code v-pre>IAM 및 관리자 &gt; 역할</code>을 선택한다.</p>
</li>
<li>
<p><code v-pre>+ 역할 만들기</code> 선택하여 Vault Key Management를 위한 역할 생성</p>
<ul>
<li>
<p>제목 : e.g. <code v-pre>vault-key-management</code></p>
</li>
<li>
<p>Vault Key Management를 위해 <code v-pre>할당된 권한</code>에 다음을 추가</p>
<ul>
<li>
<p>cloudkms.cryptoKeys.create</p>
</li>
<li>
<p>cloudkms.cryptoKeys.update</p>
</li>
<li>
<p>cloudkms.importJobs.create</p>
</li>
<li>
<p>cloudkms.importJobs.get</p>
</li>
<li>
<p>cloudkms.cryptoKeyVersions.list</p>
</li>
<li>
<p>cloudkms.cryptoKeyVersions.destroy</p>
</li>
<li>
<p>cloudkms.cryptoKeyVersions.update</p>
</li>
<li>
<p>cloudkms.cryptoKeyVersions.create</p>
</li>
<li>
<p>cloudkms.importJobs.useToImport</p>
</li>
</ul>
</li>
<li>
<p>KeyRing을 생성하기 위해서는 <code v-pre>할당된 권한</code>에 다음을 추가</p>
<ul>
<li>cloudkms.keyRings.create</li>
<li>cloudkms.keyRings.get</li>
<li>cloudkms.cryptoKeys.get</li>
</ul>
</li>
<li>
<p>Encrypt/Decrypt를 테스트하기 위해서는 <code v-pre>할당된 권한</code>에 다음을 추가</p>
<ul>
<li>cloudkms.cryptoKeyVersions.useToEncrypt</li>
<li>cloudkms.cryptoKeyVersions.useToDecrypt</li>
<li>cloudkms.cryptoKeyVersions.viewPublicKey</li>
</ul>
</li>
</ul>
</li>
</ol>
<h3 id="_3-2-vault-가-대상-gcp-cloud-kms-관리-위해-사용할-자격증명" tabindex="-1"><a class="header-anchor" href="#_3-2-vault-가-대상-gcp-cloud-kms-관리-위해-사용할-자격증명" aria-hidden="true">#</a> 3.2 Vault 가 대상 GCP Cloud KMS 관리 위해 사용할 자격증명</h3>
<p>Vault가 Cloud KMS 인스턴스에 연결하고 관리하는 데 사용할 이 서비스 계정에 대한 JSON 기반 자격 증명 파일을 생성해야한다.</p>
<ol>
<li><a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer">https://console.cloud.google.com<ExternalLinkIcon/></a> 을 통해 GCP 포탈에 접속 한다.</li>
<li>상단 <code v-pre>프로젝트 선택</code>에서 프로젝트 이름을 선택합니다.</li>
<li>좌측 메뉴확장 또는 검색을 통해 <code v-pre>IAM 및 관리자 &gt; 서비스 계정</code>을 선택한다.</li>
<li>상단의 <code v-pre>+ 서비스 계정 만들기</code>를 선택하여 신규 계정을 추가한 뒤 속성을 부여 하고 완료 합니다.
<ul>
<li>서비스 계정 이름 : e.g. <code v-pre>vault-keymgmt-test</code></li>
<li>액세스 권한 부여 : 앞서 생성한 <code v-pre>vault-key-management</code></li>
</ul>
</li>
<li>선택한 계정 상단의 <code v-pre>키</code> 탭을 선택합니다.</li>
<li><code v-pre>키 추가</code> 드롭다운 메뉴를 클릭하고 <code v-pre>새 키 만들기</code>를 선택합니다.</li>
<li><code v-pre>키 유형</code>은 JSON 을 선택하여 생성합니다.</li>
</ol>
<h3 id="_3-3-gcp-cloud-kms-구성" tabindex="-1"><a class="header-anchor" href="#_3-3-gcp-cloud-kms-구성" aria-hidden="true">#</a> 3.3 GCP Cloud KMS 구성</h3>
<p>Vault의 Key Management에서 관리할 GCP Cloud KMS를 생성한다.</p>
<ol>
<li>
<p>좌측 메뉴확장 또는 검색을 통해 `보안 &gt; Key Management를 선택한다.</p>
<ul>
<li>
<p>Cloud KMS가 비활성인경우 <code v-pre>사용</code> 버튼으로 활성화 한다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Cloud Key Management Service (KMS) API – Marketplace – gs-keymgmt-test – Google Cloud Console 2023-07-17 13-58-07.png" alt="Cloud Key Management Service (KMS) API – Marketplace – gs-keymgmt-test – Google Cloud Console 2023-07-17 13-58-07" tabindex="0" loading="lazy"><figcaption>Cloud Key Management Service (KMS) API – Marketplace – gs-keymgmt-test – Google Cloud Console 2023-07-17 13-58-07</figcaption></figure>
</li>
</ul>
</li>
<li>
<p>GCP 안내에 따라 새로운 키링을 생성 한다. (<a href="https://cloud.google.com/kms/docs/create-encryption-keys?hl=ko" target="_blank" rel="noopener noreferrer">https://cloud.google.com/kms/docs/create-encryption-keys?hl=ko<ExternalLinkIcon/></a>)</p>
</li>
<li>
<p>또는 Terraform 으로 새로운 키링을 생성 한다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">terraform</span> <span class="token punctuation">{</span>
  <span class="token keyword">required_providers</span> <span class="token punctuation">{</span>
    <span class="token property">google</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"hashicorp/google"</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"~> 4.73.1"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">region</span> <span class="token punctuation">=</span> <span class="token string">"asia-northeast3"</span>
<span class="token punctuation">}</span>

<span class="token keyword">provider<span class="token type variable"> "google" </span></span><span class="token punctuation">{</span>
  <span class="token property">project</span>     <span class="token punctuation">=</span> <span class="token string">"hc-f5e09ac82cca41c78e99aac5ea3"</span>
  <span class="token property">credentials</span> <span class="token punctuation">=</span> file(<span class="token string">"kms.json"</span>)
  <span class="token property">region</span>      <span class="token punctuation">=</span> local.region
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"google_kms_key_ring"</span></span> <span class="token string">"keyring"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>     <span class="token punctuation">=</span> <span class="token string">"vault-keyring"</span>
  <span class="token property">location</span> <span class="token punctuation">=</span> local.region
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>생성된 키링의 <code v-pre>리소스 이름 복사</code>를 클릭하면 Vault 구성에서 사용할 <code v-pre>key_collection</code>에 할당하는 키링의 이름을 복사할 수 있다.</p>
</li>
</ol>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/키 관리 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-41-39.png" alt="키 관리 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-41-39" tabindex="0" loading="lazy"><figcaption>키 관리 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-41-39</figcaption></figure>
<h3 id="_3-4-vault의-gcp-cloud-kms-구성" tabindex="-1"><a class="header-anchor" href="#_3-4-vault의-gcp-cloud-kms-구성" aria-hidden="true">#</a> 3.4 Vault의 GCP Cloud KMS 구성</h3>
<p>GCP KMS에서 호환되는 암호화 키를 생성한다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>$ vault write -f keymgmt/key/gcp-aes256-gcm96 type="aes256-gcm96"
Success! Data written to: keymgmt/key/gcp-aes256-gcm96
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>생성된 암호화 키의 정보를 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/key/gcp-aes256-gcm96

Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">false</span>
latest_version         <span class="token number">1</span>
min_enabled_version    <span class="token number">1</span>
name                   gcp-aes256-gcm96
<span class="token builtin class-name">type</span>                   aes256-gcm96
versions               map<span class="token punctuation">[</span><span class="token number">1</span>:map<span class="token punctuation">[</span>creation_time:2023-07-17T13:46:58.17194+09:00<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>GCP Cloud KMS 공급자 리소스를 구성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> keymgmt/kms/gcpckms-korea <span class="token punctuation">\</span>
    <span class="token assign-left variable">provider</span><span class="token operator">=</span><span class="token string">"gcpckms"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">key_collection</span><span class="token operator">=</span><span class="token string">"projects/hc-f5e09ac82cca41c78e99aac5ea3/locations/asia-northeast3/keyRings/vault-keyring"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">credentials</span><span class="token operator">=</span>service_account_file<span class="token operator">=</span><span class="token string">"<span class="token variable">$FULL_PATH</span>/kms.json"</span>
    
Success<span class="token operator">!</span> Data written to: keymgmt/kms/gcpckms-korea
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>AWS KMS 공급자 리소스를 구성하는 매개변수의 설명은 다음과 같다.</p>
<table>
<thead>
<tr>
<th style="text-align:left">매개변수</th>
<th style="text-align:left">설명</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">provider</td>
<td style="text-align:left">GCP Cloud KMS를 구성하는 경우 <code v-pre>gcpckms</code>를 사용</td>
</tr>
<tr>
<td style="text-align:left">key_collection</td>
<td style="text-align:left">GCP Cloud KMS의 키링 리소스 이름을 지정</td>
</tr>
<tr>
<td style="text-align:left">credentials=service_account_file</td>
<td style="text-align:left">자격증명 파일로 GCP Cloud KMS 인증에 사용할 자격증명 파일을 지정한다. <code v-pre>GOOGLE_CREDENTIALS</code> 로 지정된 경우 생략할 수 있다.</td>
</tr>
</tbody>
</table>
<p>AWS KMS 공급자 리소스에 암호화 키를 배포</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code> vault <span class="token function">write</span> keymgmt/kms/:name/key/:key_name
$ vault <span class="token function">write</span> keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96 <span class="token punctuation">\</span>
    <span class="token assign-left variable">purpose</span><span class="token operator">=</span><span class="token string">"encrypt,decrypt"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">protection</span><span class="token operator">=</span><span class="token string">"hsm"</span>
    
Success<span class="token operator">!</span> Data written to: keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>등록이 완료되면 GCP Console의 대상 키링에 키가 추가된 것을 확인할 수 있다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/키 관리 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-49-10.png" alt="키 관리 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-49-10" tabindex="0" loading="lazy"><figcaption>키 관리 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-49-10</figcaption></figure>
<p>생성된 키정보를 확인하여 현재 버전에 명시된 ID가 GCP 상의 KMS의 <code v-pre>키 ID</code>와 같은지 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96

Key                  Value
---                  -----
distribution_time    <span class="token number">2023</span>-07-17T14:48:10.777969+09:00
name                 gcp-aes256-gcm96-1689572890
protection           hsm
purpose              decrypt,encrypt
versions             map<span class="token punctuation">[</span><span class="token number">1</span>:1<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/키링 세부정보 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-51-44.png" alt="키링 세부정보 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-51-44" tabindex="0" loading="lazy"><figcaption>키링 세부정보 – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-51-44</figcaption></figure>
<p>GCP Cloud KMS사용자의 경우 vault로의 API 요청으로 키ID를 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-H</span> <span class="token string">"X-Vault-Token: token"</span> <span class="token parameter variable">-X</span> GET http://<span class="token operator">&lt;</span>vault_hostname<span class="token operator">></span>:<span class="token operator">&lt;</span>port<span class="token operator">></span>/v1/keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96
<span class="token punctuation">{</span>
  <span class="token string">"request_id"</span><span class="token builtin class-name">:</span> <span class="token string">"6f3a9711-2c6c-d894-55a9-74897d735759"</span>,
  <span class="token string">"lease_id"</span><span class="token builtin class-name">:</span> <span class="token string">""</span>,
  <span class="token string">"lease_duration"</span><span class="token builtin class-name">:</span> <span class="token number">0</span>,
  <span class="token string">"renewable"</span><span class="token builtin class-name">:</span> false,
  <span class="token string">"data"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
    <span class="token string">"distribution_time"</span><span class="token builtin class-name">:</span> <span class="token string">"2023-07-17T14:48:10.777969+09:00"</span>,
    <span class="token string">"name"</span><span class="token builtin class-name">:</span> <span class="token string">"gcp-aes256-gcm96-1689572890"</span>,
    <span class="token string">"protection"</span><span class="token builtin class-name">:</span> <span class="token string">"hsm"</span>,
    <span class="token string">"purpose"</span><span class="token builtin class-name">:</span> <span class="token string">"decrypt,encrypt"</span>,
    <span class="token string">"versions"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
      <span class="token string">"1"</span><span class="token builtin class-name">:</span> <span class="token string">"1"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>,
  <span class="token string">"warnings"</span><span class="token builtin class-name">:</span> null
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>GCP Cloud KMS에 적용된 키를 순환시킨다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> keymgmt/key/gcp-aes256-gcm96/rotate
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>순환되어 새로 추가된 키 버전을 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/key/gcp-aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">false</span>
latest_version         <span class="token number">2</span>
min_enabled_version    <span class="token number">1</span>
name                   gcp-aes256-gcm96
<span class="token builtin class-name">type</span>                   aes256-gcm96
versions               map<span class="token punctuation">[</span><span class="token number">1</span>:map<span class="token punctuation">[</span>creation_time:2023-07-17T13:46:58.17194+09:00<span class="token punctuation">]</span> <span class="token number">2</span>:map<span class="token punctuation">[</span>creation_time:2023-07-17T14:54:38.978298+09:00<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>키가 적용된 AWS KMS에도 순환된 키 버전이 적용됨을 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96
Key                  Value
---                  -----
distribution_time    <span class="token number">2023</span>-07-17T14:48:10.777969+09:00
name                 gcp-aes256-gcm96-1689572890
protection           hsm
purpose              decrypt,encrypt
versions             map<span class="token punctuation">[</span><span class="token number">1</span>:1 <span class="token number">2</span>:2<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>GCP Console에서 확인하면, 신규 대상 키에 신규 버전의 키 항목이 새로 추가됨을 확인할 수 있다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/키: “gcp-aes256-gcm96-1689572890” – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-56-06.png" alt="키: “gcp-aes256-gcm96-1689572890” – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-56-06" tabindex="0" loading="lazy"><figcaption>키: “gcp-aes256-gcm96-1689572890” – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 14-56-06</figcaption></figure>
<p>적용된 키의 최소 버전을 업데이트 한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> keymgmt/key/gcp-aes256-gcm96 <span class="token assign-left variable">min_enabled_version</span><span class="token operator">=</span><span class="token number">2</span> <span class="token assign-left variable">deletion_allowed</span><span class="token operator">=</span>true

Success<span class="token operator">!</span> Data written to: keymgmt/key/gcp-aes256-gcm96
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>키의 최소 버전에 따라 그 이하의 키가 삭제되었음을 확인한다. (비활성 처리)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/key/gcp-aes256-gcm96

Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">true</span>
latest_version         <span class="token number">2</span>
min_enabled_version    <span class="token number">2</span>
name                   gcp-aes256-gcm96
<span class="token builtin class-name">type</span>                   aes256-gcm96
versions               map<span class="token punctuation">[</span><span class="token number">2</span>:map<span class="token punctuation">[</span>creation_time:2023-07-17T14:54:38.978298+09:00<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>GCP Cloud KMS에 적용된 버전은 기존 버전은 존재하나, GCP Console에서 확인하면 비활성 처리됨을 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> keymgmt/kms/gcpckms-korea/key/gcp-aes256-gcm96
Key                  Value
---                  -----
distribution_time    <span class="token number">2023</span>-07-17T14:48:10.777969+09:00
name                 gcp-aes256-gcm96-1689572890
protection           hsm
purpose              decrypt,encrypt
versions             map<span class="token punctuation">[</span><span class="token number">1</span>:1 <span class="token number">2</span>:2<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Google Cloud console 2023-07-17 14-58-47.png" alt="Google Cloud console 2023-07-17 14-58-47" tabindex="0" loading="lazy"><figcaption>Google Cloud console 2023-07-17 14-58-47</figcaption></figure>
<p>최소 버전을 이전 버전을 포함하여 업데이트 하면 이전 버전의 키가 복구된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> keymgmt/key/gcp-aes256-gcm96 <span class="token assign-left variable">min_enabled_version</span><span class="token operator">=</span><span class="token number">1</span> <span class="token assign-left variable">deletion_allowed</span><span class="token operator">=</span>true

Success<span class="token operator">!</span> Data written to: keymgmt/key/gcp-aes256-gcm96

$ vault <span class="token builtin class-name">read</span> keymgmt/key/gcp-aes256-gcm96
Key                    Value
---                    -----
deletion_allowed       <span class="token boolean">true</span>
latest_version         <span class="token number">2</span>
min_enabled_version    <span class="token number">1</span>
name                   gcp-aes256-gcm96
<span class="token builtin class-name">type</span>                   aes256-gcm96
versions               map<span class="token punctuation">[</span><span class="token number">1</span>:map<span class="token punctuation">[</span>creation_time:2023-07-17T13:46:58.17194+09:00<span class="token punctuation">]</span> <span class="token number">2</span>:map<span class="token punctuation">[</span>creation_time:2023-07-17T14:54:38.978298+09:00<span class="token punctuation">]</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/키: “gcp-aes256-gcm96-1689572890” – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 15-00-06.png" alt="키: “gcp-aes256-gcm96-1689572890” – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 15-00-06" tabindex="0" loading="lazy"><figcaption>키: “gcp-aes256-gcm96-1689572890” – 보안 – gs-keymgmt-test – Google Cloud Console 2023-07-17 15-00-06</figcaption></figure>
<h3 id="_3-5-테스트를-위한-예제-python" tabindex="-1"><a class="header-anchor" href="#_3-5-테스트를-위한-예제-python" aria-hidden="true">#</a> 3.5 테스트를 위한 예제 - Python</h3>
<blockquote>
<p><a href="https://github.com/GoogleCloudPlatform/python-docs-samples/blob/HEAD/kms/snippets/encrypt_symmetric.py" target="_blank" rel="noopener noreferrer">https://github.com/GoogleCloudPlatform/python-docs-samples/blob/HEAD/kms/snippets/encrypt_symmetric.py<ExternalLinkIcon/></a></p>
<p><a href="https://github.com/GoogleCloudPlatform/python-docs-samples/blob/174c3032a1faea4ceb3b93385eac71b80d87e6e1/kms/snippets/decrypt_symmetric.py" target="_blank" rel="noopener noreferrer">https://github.com/GoogleCloudPlatform/python-docs-samples/blob/174c3032a1faea4ceb3b93385eac71b80d87e6e1/kms/snippets/decrypt_symmetric.py<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>python 3.x</li>
<li>필요 패키지
<ul>
<li>google-cloud-kms</li>
<li>cryptography</li>
<li>crcmod</li>
<li>jwcrypto</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ python <span class="token parameter variable">--version</span>
Python <span class="token number">3.9</span>.12
 
$ pip <span class="token function">install</span> google-cloud-kms cryptography crcmod jwcrypto

$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">GOOGLE_APPLICATION_CREDENTIALS</span><span class="token operator">=</span><span class="token string">"<span class="token variable">$FULL_PATH</span>/kms.json"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>google-cloud-kms 설치시 <code v-pre>grpcio</code> 설치 실패하여 테스트 하지 못함</p>
<h3 id="_3-6-테스트를-위한-예제-nodejs" tabindex="-1"><a class="header-anchor" href="#_3-6-테스트를-위한-예제-nodejs" aria-hidden="true">#</a> 3.6 테스트를 위한 예제 - NodeJS</h3>
<blockquote>
<p><a href="https://github.com/googleapis/nodejs-kms/tree/aad6cc451952f42b96d752f31399a2c364f07610/samples" target="_blank" rel="noopener noreferrer">https://github.com/googleapis/nodejs-kms/tree/aad6cc451952f42b96d752f31399a2c364f07610/samples<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>nodejs v14.20.0</li>
<li>필요 패키지
<ul>
<li>@google-cloud/kms</li>
<li>fast-crc32c</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">node</span> <span class="token parameter variable">--version</span>
v14.20.0

$ <span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">--save</span> @google-cloud/kms
$ <span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">--save</span> fast-crc32c

$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">GOOGLE_APPLICATION_CREDENTIALS</span><span class="token operator">=</span><span class="token string">"<span class="token variable">$FULL_PATH</span>/kms.json"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="package-json" tabindex="-1"><a class="header-anchor" href="#package-json" aria-hidden="true">#</a> package.json</h4>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"gcpckms-test"</span><span class="token punctuation">,</span>
  <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"1.0.0"</span><span class="token punctuation">,</span>
  <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
  <span class="token property">"main"</span><span class="token operator">:</span> <span class="token string">"main.js"</span><span class="token punctuation">,</span>
  <span class="token property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"test"</span><span class="token operator">:</span> <span class="token string">"echo \"Error: no test specified\" &amp;&amp; exit 1"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"author"</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
  <span class="token property">"license"</span><span class="token operator">:</span> <span class="token string">"ISC"</span><span class="token punctuation">,</span>
  <span class="token property">"dependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"@google-cloud/kms"</span><span class="token operator">:</span> <span class="token string">"^3.7.0"</span><span class="token punctuation">,</span>
    <span class="token property">"fast-crc32c"</span><span class="token operator">:</span> <span class="token string">"^2.0.0"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="encryptsymmetric-js" tabindex="-1"><a class="header-anchor" href="#encryptsymmetric-js" aria-hidden="true">#</a> encryptSymmetric.js</h4>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token string">'use strict'</span><span class="token punctuation">;</span>

const projectId <span class="token operator">=</span> <span class="token string">'hc-f5e09ac82cca41c78e99aac5ea3'</span>
const locationId <span class="token operator">=</span> <span class="token string">'asia-northeast3'</span>
const keyRingId <span class="token operator">=</span> <span class="token string">'vault-keyring'</span>
const keyId <span class="token operator">=</span> <span class="token string">'gcp-aes256-gcm96-1689572890'</span>
const versionId <span class="token operator">=</span> <span class="token string">'1'</span>
const plaintextBuffer <span class="token operator">=</span> Buffer<span class="token punctuation">.</span><span class="token keyword">from</span><span class="token punctuation">(</span><span class="token string">'Vault GCP Cloud KMS test'</span><span class="token punctuation">)</span>

const <span class="token punctuation">{</span>KeyManagementServiceClient<span class="token punctuation">}</span> <span class="token operator">=</span> require<span class="token punctuation">(</span><span class="token string">'@google-cloud/kms'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

const crc32c <span class="token operator">=</span> require<span class="token punctuation">(</span><span class="token string">'fast-crc32c'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token operator">//</span> Instantiates a client
const client <span class="token operator">=</span> new KeyManagementServiceClient<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token operator">//</span> Build the key name
const keyName <span class="token operator">=</span> client<span class="token punctuation">.</span>cryptoKeyPath<span class="token punctuation">(</span>projectId<span class="token punctuation">,</span> locationId<span class="token punctuation">,</span> keyRingId<span class="token punctuation">,</span> keyId<span class="token punctuation">,</span> versionId<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token operator">//</span> Optional<span class="token punctuation">,</span> but recommended<span class="token punctuation">:</span> compute plaintext's CRC32C<span class="token punctuation">.</span>
<span class="token keyword">async</span> function encryptSymmetric<span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  const plaintextCrc32c <span class="token operator">=</span> crc32c<span class="token punctuation">.</span>calculate<span class="token punctuation">(</span>plaintextBuffer<span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span>log<span class="token punctuation">(</span>`Plaintext crc32c<span class="token punctuation">:</span> $<span class="token punctuation">{</span>plaintextCrc32c<span class="token punctuation">}</span>`<span class="token punctuation">)</span><span class="token punctuation">;</span>
  const <span class="token punctuation">[</span>encryptResponse<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">await</span> client<span class="token punctuation">.</span>encrypt<span class="token punctuation">(</span><span class="token punctuation">{</span>
    name<span class="token punctuation">:</span> keyName<span class="token punctuation">,</span>
    plaintext<span class="token punctuation">:</span> plaintextBuffer<span class="token punctuation">,</span>
    plaintextCrc32c<span class="token punctuation">:</span> <span class="token punctuation">{</span>
      value<span class="token punctuation">:</span> plaintextCrc32c<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  const ciphertext <span class="token operator">=</span> encryptResponse<span class="token punctuation">.</span>ciphertext<span class="token punctuation">;</span>

  <span class="token operator">//</span> Optional<span class="token punctuation">,</span> but recommended<span class="token punctuation">:</span> perform integrity verification on encryptResponse<span class="token punctuation">.</span>
  <span class="token operator">//</span> For more details on ensuring E2E <span class="token keyword">in</span><span class="token operator">-</span>transit integrity to <span class="token keyword">and</span> <span class="token keyword">from</span> Cloud KMS visit<span class="token punctuation">:</span>
  <span class="token operator">//</span> https<span class="token punctuation">:</span><span class="token operator">//</span>cloud<span class="token punctuation">.</span>google<span class="token punctuation">.</span>com<span class="token operator">/</span>kms<span class="token operator">/</span>docs<span class="token operator">/</span>data<span class="token operator">-</span>integrity<span class="token operator">-</span>guidelines
  <span class="token keyword">if</span> <span class="token punctuation">(</span>!encryptResponse<span class="token punctuation">.</span>verifiedPlaintextCrc32c<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    throw new Error<span class="token punctuation">(</span><span class="token string">'Encrypt: request corrupted in-transit'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>
    crc32c<span class="token punctuation">.</span>calculate<span class="token punctuation">(</span>ciphertext<span class="token punctuation">)</span> <span class="token operator">!=</span><span class="token operator">=</span>
    Number<span class="token punctuation">(</span>encryptResponse<span class="token punctuation">.</span>ciphertextCrc32c<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    throw new Error<span class="token punctuation">(</span><span class="token string">'Encrypt: response corrupted in-transit'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  console<span class="token punctuation">.</span>log<span class="token punctuation">(</span>`Ciphertext<span class="token punctuation">:</span> $<span class="token punctuation">{</span>ciphertext<span class="token punctuation">.</span>toString<span class="token punctuation">(</span><span class="token string">'base64'</span><span class="token punctuation">)</span><span class="token punctuation">}</span>`<span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span>log<span class="token punctuation">(</span>`Ciphertext crc32c<span class="token punctuation">:</span> $<span class="token punctuation">{</span>encryptResponse<span class="token punctuation">.</span>ciphertextCrc32c<span class="token punctuation">.</span>value<span class="token punctuation">}</span>`<span class="token punctuation">)</span>
  <span class="token keyword">return</span> ciphertext<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">async</span> function decryptSymmetric<span class="token punctuation">(</span>ciphertext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  const cipherTextBuf <span class="token operator">=</span> Buffer<span class="token punctuation">.</span><span class="token keyword">from</span><span class="token punctuation">(</span><span class="token keyword">await</span> ciphertext<span class="token punctuation">)</span><span class="token punctuation">;</span>
  const ciphertextCrc32c <span class="token operator">=</span> crc32c<span class="token punctuation">.</span>calculate<span class="token punctuation">(</span>cipherTextBuf<span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span>log<span class="token punctuation">(</span>`Ciphertext crc32c<span class="token punctuation">:</span> $<span class="token punctuation">{</span>ciphertextCrc32c<span class="token punctuation">}</span>`<span class="token punctuation">)</span><span class="token punctuation">;</span>
  const <span class="token punctuation">[</span>decryptResponse<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">await</span> client<span class="token punctuation">.</span>decrypt<span class="token punctuation">(</span><span class="token punctuation">{</span>
    name<span class="token punctuation">:</span> keyName<span class="token punctuation">,</span>
    ciphertext<span class="token punctuation">:</span> cipherTextBuf<span class="token punctuation">,</span>
    ciphertextCrc32c<span class="token punctuation">:</span> <span class="token punctuation">{</span>
      value<span class="token punctuation">:</span> ciphertextCrc32c<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token operator">//</span> Optional<span class="token punctuation">,</span> but recommended<span class="token punctuation">:</span> perform integrity verification on decryptResponse<span class="token punctuation">.</span>
  <span class="token operator">//</span> For more details on ensuring E2E <span class="token keyword">in</span><span class="token operator">-</span>transit integrity to <span class="token keyword">and</span> <span class="token keyword">from</span> Cloud KMS visit<span class="token punctuation">:</span>
  <span class="token operator">//</span> https<span class="token punctuation">:</span><span class="token operator">//</span>cloud<span class="token punctuation">.</span>google<span class="token punctuation">.</span>com<span class="token operator">/</span>kms<span class="token operator">/</span>docs<span class="token operator">/</span>data<span class="token operator">-</span>integrity<span class="token operator">-</span>guidelines
  <span class="token keyword">if</span> <span class="token punctuation">(</span>
    crc32c<span class="token punctuation">.</span>calculate<span class="token punctuation">(</span>decryptResponse<span class="token punctuation">.</span>plaintext<span class="token punctuation">)</span> <span class="token operator">!=</span><span class="token operator">=</span>
    Number<span class="token punctuation">(</span>decryptResponse<span class="token punctuation">.</span>plaintextCrc32c<span class="token punctuation">.</span>value<span class="token punctuation">)</span>
  <span class="token punctuation">)</span> <span class="token punctuation">{</span>
    throw new Error<span class="token punctuation">(</span><span class="token string">'Decrypt: response corrupted in-transit'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  const plaintext <span class="token operator">=</span> decryptResponse<span class="token punctuation">.</span>plaintext<span class="token punctuation">.</span>toString<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  console<span class="token punctuation">.</span>log<span class="token punctuation">(</span>`Plaintext<span class="token punctuation">:</span> $<span class="token punctuation">{</span>plaintext<span class="token punctuation">}</span>`<span class="token punctuation">)</span><span class="token punctuation">;</span>
  console<span class="token punctuation">.</span>log<span class="token punctuation">(</span>`Plaintext crc32c<span class="token punctuation">:</span> $<span class="token punctuation">{</span>decryptResponse<span class="token punctuation">.</span>plaintextCrc32c<span class="token punctuation">.</span>value<span class="token punctuation">}</span>`<span class="token punctuation">)</span>
  <span class="token keyword">return</span> plaintext<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

decryptSymmetric<span class="token punctuation">(</span>encryptSymmetric<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">node</span> encrypt_decrypt.js
Ciphertext: CiQADXWVuwUXBHPL+a8tqce4HfUe3YDMujDZebUWGn4wajmCflcSRypFChQKDJ2A64fX3MUmUfJ8fxDiwuqVBhITCgtm+dZClP/tuRw0CxDE64XfDRoYChChQEcfHsoXhHFXpkpaaTvMENuLg60G
Plaintext: Vault GCP Cloud KMS <span class="token builtin class-name">test</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


