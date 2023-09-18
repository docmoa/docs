<template><div><h1 id="aws-auth-method" tabindex="-1"><a class="header-anchor" href="#aws-auth-method" aria-hidden="true">#</a> AWS Auth Method</h1>
<blockquote>
<p><a href="https://developer.hashicorp.com/vault/docs/auth/aws" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/vault/docs/auth/aws<ExternalLinkIcon/></a></p>
<p><a href="https://developer.hashicorp.com/vault/api-docs/auth/aws" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/vault/api-docs/auth/aws<ExternalLinkIcon/></a></p>
<p><a href="https://blog.gruntwork.io/a-guide-to-automating-hashicorp-vault-3-authenticating-with-an-iam-user-or-role-a3203a3ee088" target="_blank" rel="noopener noreferrer">https://blog.gruntwork.io/a-guide-to-automating-hashicorp-vault-3-authenticating-with-an-iam-user-or-role-a3203a3ee088<ExternalLinkIcon/></a></p>
</blockquote>
<p>AWS auth method는 IAM 계정 또는 EC2 인스턴스에 대한 Vault 토큰을 검색하는 자동화된 메커니즘을 제공한다. 이 방식은 다양한 상황에서 운영자가 보안에 민감한 자격증명(토큰, 사용자 이름/비밀번호, 클라이언트 인증서 등)을 수동으로 먼저 생성할 필요가 없다.</p>
<h2 id="_1-인증-워크플로" tabindex="-1"><a class="header-anchor" href="#_1-인증-워크플로" aria-hidden="true">#</a> 1. 인증 워크플로</h2>
<p>AWS auth method는 <code v-pre>iam</code>과 <code v-pre>ec2</code> 방식을 지원한다.</p>
<h3 id="iam-인증-방식" tabindex="-1"><a class="header-anchor" href="#iam-인증-방식" aria-hidden="true">#</a> <code v-pre>iam</code> 인증 방식</h3>
<p>AWS IAM 자격 증명으로 서명된 AWS 요청이 인증에 사용된다. 거의 모든 AWS 리소스는 AWS 보안 토큰 서비스(STS)를 호출하여 자신의 신원을 조회할 수 있다. Vault의 AWS iam 인증 방식은 사용자가 직접 요청을 보내는 대신, 서명된 요청 데이터를 Vault로 전송하여 STS에 서명된 요청을 생성할 수 있도록 함으로써 이러한 이점을 활용한다. Vault는 요청을 실행하고 AWS(다시 말해서 신뢰할 수 있는 제3자)로부터 사용자의 실제 신원을 확인한다. <code v-pre>iam</code>방식이 좀더 최신의 방식이며, 기존  <code v-pre>ec2</code>방식의 한계였던 람다 또는 ECS 같은 다양한 유형의 서비스에서 작동한다.</p>
<p>AWS STS API에는 클라이언트의 신원을 확인할 수 있는 메서드인 <code v-pre>sts:GetCallerIdentity</code>가 포함되어 있다. 클라이언트는 AWS 서명 v4 알고리즘을 사용하여 <code v-pre>GetCallerIdentity</code> 쿼리에 서명하고 이를 Vault 서버로 보낸다. <code v-pre>GetCallerIdentity</code> 요청에 서명하는 데 사용되는 자격 증명은 EC2 인스턴스에 대한 EC2 인스턴스 메타데이터 서비스 또는 AWS Lambda 함수 실행의 AWS 환경 변수에서 가져올 수 있으므로 운영자가 먼저 신원 자료를 수동으로 프로비저닝할 필요가 없다. 그리고 사용되는 자격 증명은 원칙적으로 AWS내부의 Role이부여된 리소스 뿐만 아니라 Access Key를 사용하여 어디에서나 가져올 수 있다.</p>
<p><code v-pre>GetCallerIdentity</code> 쿼리는 <code v-pre>Request URL</code>, <code v-pre>Request Body</code>, <code v-pre>Request Header</code>, <code v-pre>Request Method</code>의 네 가지 정보로 구성되며, AWS 서명은 이러한 필드를 통해 계산된다. Vault 서버는 이 정보를 사용해 쿼리를 재구성하고 AWS STS 서비스로 전달한다. STS 서비스의 응답에 따라 서버는 클라이언트를 인증한다.</p>
<p>클라이언트가 AWS STS API 엔드포인트와 통신하기 위한 네트워크 접근이 필요하지 않으며, 요청에 서명하기 위한 자격 증명에 대한 액세스만 있으면 된다. 그러나 Vault 서버가 STS 엔드포인트로 요청을 전송하려면 네트워크 수준 액세스가 필요하다.</p>
<p>서명된 각 AWS 요청에는 현재 타임스탬프가 포함되어 리플레이 공격의 위험을 완화합니다. 또한, Vault에서는 다양한 유형의 리플레이 공격(예: 개발 Vault 인스턴스에서 서명된 <code v-pre>GetCallerIdentity</code> 요청을 도용하여 프로덕션 Vault 인스턴스에 인증하는 데 사용하는 공격)을 완화하기 위해 추가 헤더인 X-Vault-AWS-IAM-Server-ID를 요구할 수 있다. 또한 Vault는 이 헤더가 AWS 서명에 포함된 헤더 중 하나이어야 하며, 해당 서명을 인증하기 위해 AWS에 의존한다.</p>
<p>AWS API 엔드포인트는 서명된 GET 요청과 POST 요청을 모두 지원하지만, 간단하게 하기 위해 aws auth 메서드는 POST 요청만 지원합니다. 또한 사전 서명된 요청, 즉 인증 정보가 포함된 <code v-pre>X-Amz-Credential</code>, <code v-pre>X-Amz-Signature</code>, <code v-pre>X-Amz-SignedHeaders</code> GET 쿼리 매개 변수가 있는 요청은 지원하지 않는다.</p>
<p>또한 <code v-pre>GetCallerIdentity</code> 호출과 관련하여 어떤 종류의 권한 부여도 포함하지 않는다. 예를 들어, 자격 증명에 대해 모든 액세스가 MFA 인증을 받아야 하는 IAM 정책이 있는 경우, MFA 인증을 받지 않은 자격 증명(즉, <code v-pre>GetSessionToken</code>을 호출하고 MFA 코드를 제공하여 검색한 자격 증명이 아닌 원시 자격 증명)은 이 방법을 사용하여 여전히 Vault에 인증할 수 있다. Vault에 인증하는 동안 IAM 주체가 MFA 인증을 받도록 강제하는 것은 불가능하다.</p>
<h3 id="ec2-인증-방식" tabindex="-1"><a class="header-anchor" href="#ec2-인증-방식" aria-hidden="true">#</a> <code v-pre>ec2</code> 인증 방식</h3>
<p>ec2 방식에서는 AWS가 신뢰할 수 있는 제3자로 취급되며, 각 EC2 인스턴스를 고유하게 나타내는 암호화 서명된 동적 메타데이터 정보가 인증에 사용된다. 이 메타데이터 정보는 AWS가 모든 EC2 인스턴스에 자동으로 제공한다. 특정 AMI, 특정 인스턴스 프로파일의 EC2 인스턴스 또는 특수 태그 값을 가진 EC2 인스턴스(role_tag 기능을 통해)에서 EC2 인스턴스에 대한 액세스를 제한하는 등 EC2 인스턴스를 처리하는 데 특화되어 있다.</p>
<p>Amazon EC2 인스턴스는 인스턴스를 설명하는 메타데이터에 액세스할 수 있습니다. Vault EC2 인증 메서드는 이 메타데이터의 구성 요소를 활용하여 초기 Vault 토큰을 인증하고 EC2 인스턴스에 배포한다. 데이터 흐름(아래 그래픽에도 표시됨)은 다음과 같다:</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/assets (1368×998) 2023-06-30 20-34-15.png" alt="assets (1368×998) 2023-06-30 20-34-15" tabindex="0" loading="lazy"><figcaption>assets (1368×998) 2023-06-30 20-34-15</figcaption></figure>
<ol>
<li>AWS EC2 인스턴스는 EC2 메타데이터 서비스에서 AWS 인스턴스 ID 문서를 가져옵니다. AWS는 데이터 자체 외에도 데이터의 PKCS#7 서명을 제공하고, 서명을 확인하는 데 사용할 수 있는 공개 키(지역별로)를 게시한다.</li>
<li>AWS EC2 인스턴스는 PKCS#7 서명을 사용하여 Vault에 요청합니다. PKCS#7 서명에는 인스턴스 ID 문서가 포함된다.</li>
<li>Vault는 PKCS#7 문서의 서명을 확인하여 정보가 AWS에 의해 정확하게 인증되었는지 확인합니다. 이 프로세스는 문서 데이터의 유효성과 무결성을 모두 검증합니다. 추가 보안 조치로, Vault는 인스턴스가 현재 퍼블릭 EC2 API 엔드포인트를 사용하여 실행 중인지 확인한다.</li>
<li>모든 단계가 성공적으로 완료되면 Vault는 초기 Vault 토큰을 EC2 인스턴스에 반환합니다. 이 토큰은 인스턴스 메타데이터를 기반으로 구성된 모든 정책에 매핑된다.</li>
</ol>
<h2 id="_2-vault의-aws-auth-method-인증에-필요한-권장-iam-policy" tabindex="-1"><a class="header-anchor" href="#_2-vault의-aws-auth-method-인증에-필요한-권장-iam-policy" aria-hidden="true">#</a> 2. Vault의 AWS auth method 인증에 필요한 권장 IAM Policy</h2>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"Version"</span><span class="token operator">:</span> <span class="token string">"2012-10-17"</span><span class="token punctuation">,</span>
  <span class="token property">"Statement"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"Effect"</span><span class="token operator">:</span> <span class="token string">"Allow"</span><span class="token punctuation">,</span>
      <span class="token property">"Action"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token string">"ec2:DescribeInstances"</span><span class="token punctuation">,</span>
        <span class="token string">"iam:GetInstanceProfile"</span><span class="token punctuation">,</span>
        <span class="token string">"iam:GetUser"</span><span class="token punctuation">,</span>
        <span class="token string">"iam:GetRole"</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">"Resource"</span><span class="token operator">:</span> <span class="token string">"*"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token property">"Effect"</span><span class="token operator">:</span> <span class="token string">"Allow"</span><span class="token punctuation">,</span>
      <span class="token property">"Action"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"sts:AssumeRole"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">"Resource"</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"arn:aws:iam::&lt;AccountId>:role/&lt;VaultRole>"</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token property">"Sid"</span><span class="token operator">:</span> <span class="token string">"ManageOwnAccessKeys"</span><span class="token punctuation">,</span>
      <span class="token property">"Effect"</span><span class="token operator">:</span> <span class="token string">"Allow"</span><span class="token punctuation">,</span>
      <span class="token property">"Action"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token string">"iam:CreateAccessKey"</span><span class="token punctuation">,</span>
        <span class="token string">"iam:DeleteAccessKey"</span><span class="token punctuation">,</span>
        <span class="token string">"iam:GetAccessKeyLastUsed"</span><span class="token punctuation">,</span>
        <span class="token string">"iam:GetUser"</span><span class="token punctuation">,</span>
        <span class="token string">"iam:ListAccessKeys"</span><span class="token punctuation">,</span>
        <span class="token string">"iam:UpdateAccessKey"</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">"Resource"</span><span class="token operator">:</span> <span class="token string">"arn:aws:iam::*:user/${aws:username}"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token property">"Sid"</span><span class="token operator">:</span> <span class="token string">"IAM_Method"</span><span class="token punctuation">,</span>
      <span class="token property">"Effect"</span><span class="token operator">:</span> <span class="token string">"Allow"</span><span class="token punctuation">,</span>
      <span class="token property">"Action"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token string">"sts:GetCallerIdentity"</span>
      <span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token property">"Resource"</span><span class="token operator">:</span> <span class="token string">"*"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>arn:aws:iam::\&lt;AccountId\&gt;:*</code>: 로 구성하면 AWS 계정의 모든 주체가 이 계정에 로그인</li>
<li><code v-pre>arn:aws:iam::\&lt;AccountId\&gt;:role/*</code> 로 구성하면 AWS 계정의 모든 IAM 역할이 해당 계정에 로그인</li>
<li>와일드카드를 지정하려면 전체 사용자 경로를 올바르게 확인할 수 있도록 Vault에 <code v-pre>iam:GetUser</code> 및 <code v-pre>iam:GetRole</code> 권한을 부여</li>
<li>ARN이 <code v-pre>arn:aws:iam::123456789012:role/MyRole</code>인 역할이 있는 경우, 해당 역할에서 AssumeRole을 호출하여 반환되는 자격 증명은 <code v-pre>arn:aws:sts::123456789012:assumed-role/MyRole/RoleSessionName</code>이며, 여기서 <code v-pre>RoleSessionName</code>은 AssumeRole API 호출의 세션 이름</li>
<li><code v-pre>ec2:DescribeInstances</code>는 ec2 인증 메서드를 사용하거나 EC2 인스턴스가 role binding 요구 사항을 충족하는지 확인하기 위해 <code v-pre>ec2_instance</code>엔티티 유형을 추론할 때 필요</li>
<li><code v-pre>iam:GetInstanceProfile</code>은 ec2 인증 메서드에 <code v-pre>bound_iam_role_arn</code>이 있을 때 사용</li>
<li>계정간 접근이 필요한 경우 <code v-pre>sts:AssumeRole</code> 구문이 필요(지정된 리소스는 계정 간 액세스를 구성한 모든 역할의 목록이어야 하며, 각 역할에는 이 IAM 정책이 첨부되어 있어야 하며 <code v-pre>sts:AssumeRole</code> 문은 제외)</li>
<li>정적 자격 증명으로 Vault를 구성한 후 Rotate Root Credentials API 호출을 통해 이러한 자격 증명을 회전하려는 경우 <code v-pre>ManageOwnAccessKeys</code> 구절이 필요</li>
</ul>
<h2 id="_3-aws-외부에서-구성" tabindex="-1"><a class="header-anchor" href="#_3-aws-외부에서-구성" aria-hidden="true">#</a> 3. AWS 외부에서 구성</h2>
<p>AWS외부에서 구성하는 경우 AWS 인증을 위한 Policy가 구성된 Access Key/Secret Key가 필요하다.</p>
<h3 id="aws-auth-method-활성화" tabindex="-1"><a class="header-anchor" href="#aws-auth-method-활성화" aria-hidden="true">#</a> <code v-pre>aws</code> auth method 활성화</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault auth <span class="token builtin class-name">enable</span> aws
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="활성화된-auth-method의-구성" tabindex="-1"><a class="header-anchor" href="#활성화된-auth-method의-구성" aria-hidden="true">#</a> 활성화된 auth method의 구성</h3>
<ul>
<li>access_key</li>
<li>secret_key</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> auth/aws/config/client <span class="token assign-left variable">secret_key</span><span class="token operator">=</span>vCtSM8ZUEQ3mOFVlYPBQkf2sO6F/W7a5TVzrl3Oj <span class="token assign-left variable">access_key</span><span class="token operator">=</span>VKIAJBRHKH6EVTTNXDHA
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="ec2-role-구성-및-로그인" tabindex="-1"><a class="header-anchor" href="#ec2-role-구성-및-로그인" aria-hidden="true">#</a> <code v-pre>ec2</code> role 구성 및 로그인</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> auth/aws/role/dev-role <span class="token assign-left variable">auth_type</span><span class="token operator">=</span>ec2 <span class="token assign-left variable">bound_ami_id</span><span class="token operator">=</span>ami-fce3c696 <span class="token assign-left variable">policies</span><span class="token operator">=</span>prod,dev <span class="token assign-left variable">max_ttl</span><span class="token operator">=</span>500h

$ <span class="token assign-left variable">SIGNATURE</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">-s</span> http://169.254.169.254/latest/dynamic/instance-identity/rsa2048 <span class="token operator">|</span> <span class="token function">tr</span> <span class="token parameter variable">-d</span> <span class="token string">'\n'</span><span class="token variable">)</span></span>

$ vault <span class="token function">write</span> auth/aws/login <span class="token assign-left variable">role</span><span class="token operator">=</span>dev-role <span class="token assign-left variable">pkcs7</span><span class="token operator">=</span><span class="token variable">$SIGNATURE</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="iam-role-구성-및-로그인" tabindex="-1"><a class="header-anchor" href="#iam-role-구성-및-로그인" aria-hidden="true">#</a> <code v-pre>iam</code> role 구성 및 로그인</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> auth/aws/role/dev-role-iam <span class="token assign-left variable">auth_type</span><span class="token operator">=</span>iam  <span class="token assign-left variable">bound_iam_principal_arn</span><span class="token operator">=</span>arn:aws:iam::123456789012:role/MyRole <span class="token assign-left variable">policies</span><span class="token operator">=</span>prod,dev <span class="token assign-left variable">max_ttl</span><span class="token operator">=</span>500h

$ vault login <span class="token parameter variable">-method</span><span class="token operator">=</span>aws <span class="token assign-left variable">header_value</span><span class="token operator">=</span>vault.example.com <span class="token assign-left variable">role</span><span class="token operator">=</span>dev-role-iam <span class="token punctuation">\</span>
        <span class="token assign-left variable">aws_access_key_id</span><span class="token operator">=</span><span class="token operator">&lt;</span>access_key<span class="token operator">></span> <span class="token punctuation">\</span>
        <span class="token assign-left variable">aws_secret_access_key</span><span class="token operator">=</span><span class="token operator">&lt;</span>secret_key<span class="token operator">></span> <span class="token punctuation">\</span>
        <span class="token assign-left variable">aws_security_token</span><span class="token operator">=</span><span class="token operator">&lt;</span>security_token<span class="token operator">></span>

<span class="token comment"># AWS SDK가 지원하는 인증 방식이 설정되어있는 경우 aws_access_key_id 생략 가능</span>
<span class="token comment"># ~/.aws/credentials</span>
<span class="token comment"># IAM 인스턴스 프로파일</span>
<span class="token comment"># ECS task role 등</span>
$ vault login <span class="token parameter variable">-method</span><span class="token operator">=</span>aws <span class="token assign-left variable">header_value</span><span class="token operator">=</span>vault.example.com <span class="token assign-left variable">role</span><span class="token operator">=</span>dev-role-iam

<span class="token comment"># 리전 지정이 필요한 경우 대상 지정</span>
$ vault login <span class="token parameter variable">-method</span><span class="token operator">=</span>aws <span class="token assign-left variable">region</span><span class="token operator">=</span>us-west-2 <span class="token assign-left variable">role</span><span class="token operator">=</span>dev-role-iam

<span class="token comment"># 요청 매개변수를 생성하여 로그인 메서드에 전달</span>
vault <span class="token function">write</span> auth/aws/login <span class="token assign-left variable">role</span><span class="token operator">=</span>dev-role-iam <span class="token punctuation">\</span>
        <span class="token assign-left variable">iam_http_request_method</span><span class="token operator">=</span>POST <span class="token punctuation">\</span>
        <span class="token assign-left variable">iam_request_url</span><span class="token operator">=</span>aHR0cHM6Ly9zdHMuYW1hem9uYXdzLmNvbS8<span class="token operator">=</span> <span class="token punctuation">\</span>
        <span class="token assign-left variable">iam_request_body</span><span class="token operator">=</span>QWN0aW9uPUdldENhbGxlcklkZW50aXR5JlZlcnNpb249MjAxMS0wNi0xNQ<span class="token operator">==</span> <span class="token punctuation">\</span>
        <span class="token assign-left variable">iam_request_headers</span><span class="token operator">=</span>eyJDb250ZW50LUxlbmd0aCI6IFsiNDMiXSwgIlVzZXItQWdlbnQiOiBbImF3cy1zZGstZ28vMS40LjEyIChnbzEuNy4xOyBsaW51eDsgYW1kNjQpIl0sICJYLVZhdWx0LUFXU0lBTS1TZXJ2ZXItSWQiOiBbInZhdWx0LmV4YW1wbGUuY29tIl0sICJYLUFtei1EYXRlIjogWyIyMDE2MDkzMFQwNDMxMjFaIl0sICJDb250ZW50LVR5cGUiOiBbImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD11dGYtOCJdLCAiQXV0aG9yaXphdGlvbiI6IFsiQVdTNC1ITUFDLVNIQTI1NiBDcmVkZW50aWFsPWZvby8yMDE2MDkzMC91cy1lYXN0LTEvc3RzL2F3czRfcmVxdWVzdCwgU2lnbmVkSGVhZGVycz1jb250ZW50LWxlbmd0aDtjb250ZW50LXR5cGU7aG9zdDt4LWFtei1kYXRlO3gtdmF1bHQtc2VydmVyLCBTaWduYXR1cmU9YTY5ZmQ3NTBhMzQ0NWM0ZTU1M2UxYjNlNzlkM2RhOTBlZWY1NDA0N2YxZWI0ZWZlOGZmYmM5YzQyOGMyNjU1YiJdfQ<span class="token operator">==</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>iam_request_url 값 예시 : <code v-pre>https://sts.amazonaws.com/</code></p>
</li>
<li>
<p>iam_request_body 값 예시 : <code v-pre>Action=GetCallerIdentity&amp;Version=2011-06-15</code></p>
</li>
<li>
<p>iam_request_headers 값 예시 :</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"Content-Length"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"43"</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"User-Agent"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"aws-sdk-go/1.4.12 (go1.7.1; linux; amd64)"</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"X-Vault-AWSIAM-Server-Id"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"vault.example.com"</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"X-Amz-Date"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"20160930T043121Z"</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"Content-Type"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"application/x-www-form-urlencoded; charset=utf-8"</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token property">"Authorization"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token string">"AWS4-HMAC-SHA256 Credential=foo/20160930/us-east-1/sts/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-date;x-vault-server, Signature=a69fd750a3445c4e553e1b3e79d3da90eef54047f1eb4efe8ffbc9c428c2655b"</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h2 id="_4-aws-내부에서-구성" tabindex="-1"><a class="header-anchor" href="#_4-aws-내부에서-구성" aria-hidden="true">#</a> 4. AWS 내부에서 구성</h2>
<p>AWS 내부에서 구성된 Vault 서버 인스턴스 및 클라이언트에 프로파일을 구성하여 Access Key를 생략하고 인증을 구현할 수 있다.</p>
<h3 id="terraform-sample" tabindex="-1"><a class="header-anchor" href="#terraform-sample" aria-hidden="true">#</a> Terraform Sample</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">terraform</span> <span class="token punctuation">{</span>
  <span class="token keyword">required_providers</span> <span class="token punctuation">{</span>
    <span class="token property">aws</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"hashicorp/aws"</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"5.5.0"</span>
    <span class="token punctuation">}</span>
    <span class="token property">random</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"hashicorp/random"</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"3.5.1"</span>
    <span class="token punctuation">}</span>
    <span class="token property">tls</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"hashicorp/tls"</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"3.0.0"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">provider<span class="token type variable"> "aws" </span></span><span class="token punctuation">{</span>
  <span class="token property">region</span> <span class="token punctuation">=</span> <span class="token string">"ap-northeast-2"</span>

  <span class="token keyword">default_tags</span> <span class="token punctuation">{</span>
    <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">Environment</span> <span class="token punctuation">=</span> <span class="token string">"Demo"</span>
      <span class="token property">Owner</span>       <span class="token punctuation">=</span> <span class="token string">"gs@hashicorp.com"</span>
      <span class="token property">Project</span>     <span class="token punctuation">=</span> <span class="token string">"example"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">data <span class="token type variable">"aws_caller_identity"</span></span> <span class="token string">"current"</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_vpc"</span></span> <span class="token string">"example"</span> <span class="token punctuation">{</span>
  <span class="token property">cidr_block</span>           <span class="token punctuation">=</span> <span class="token string">"10.0.0.0/16"</span>
  <span class="token property">enable_dns_support</span>   <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">enable_dns_hostnames</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token keyword">data <span class="token type variable">"aws_availability_zones"</span></span> <span class="token string">"available"</span> <span class="token punctuation">{</span>
  <span class="token property">state</span> <span class="token punctuation">=</span> <span class="token string">"available"</span>
<span class="token punctuation">}</span>

<span class="token comment">// public subnet</span>
<span class="token keyword">resource <span class="token type variable">"aws_subnet"</span></span> <span class="token string">"public"</span> <span class="token punctuation">{</span>
  <span class="token property">vpc_id</span>                  <span class="token punctuation">=</span> aws_vpc.example.id
  <span class="token property">availability_zone</span>       <span class="token punctuation">=</span> data.aws_availability_zones.available.names.<span class="token number">0</span>
  <span class="token property">cidr_block</span>              <span class="token punctuation">=</span> cidrsubnet(aws_vpc.example.cidr_block, <span class="token number">8</span>, <span class="token number">0</span>) <span class="token comment">// "10.0.0.0/24" &amp; "10.0.1.0/24"</span>
  <span class="token property">map_public_ip_on_launch</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_internet_gateway"</span></span> <span class="token string">"public"</span> <span class="token punctuation">{</span>
  <span class="token property">vpc_id</span> <span class="token punctuation">=</span> aws_vpc.example.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_route_table"</span></span> <span class="token string">"public"</span> <span class="token punctuation">{</span>
  <span class="token property">vpc_id</span> <span class="token punctuation">=</span> aws_vpc.example.id

  <span class="token keyword">route</span> <span class="token punctuation">{</span>
    <span class="token property">cidr_block</span> <span class="token punctuation">=</span> <span class="token string">"0.0.0.0/0"</span>
    <span class="token property">gateway_id</span> <span class="token punctuation">=</span> aws_internet_gateway.public.id
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_route_table_association"</span></span> <span class="token string">"public"</span> <span class="token punctuation">{</span>
  <span class="token property">subnet_id</span>      <span class="token punctuation">=</span> aws_subnet.public.id
  <span class="token property">route_table_id</span> <span class="token punctuation">=</span> aws_route_table.public.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_eip"</span></span> <span class="token string">"public"</span> <span class="token punctuation">{</span>
  <span class="token property">domain</span> <span class="token punctuation">=</span> <span class="token string">"vpc"</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_nat_gateway"</span></span> <span class="token string">"public"</span> <span class="token punctuation">{</span>
  <span class="token property">allocation_id</span> <span class="token punctuation">=</span> aws_eip.public.id
  <span class="token property">subnet_id</span>     <span class="token punctuation">=</span> aws_subnet.public.id
<span class="token punctuation">}</span>

<span class="token comment">// SG</span>
<span class="token keyword">resource <span class="token type variable">"aws_security_group"</span></span> <span class="token string">"example"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>   <span class="token punctuation">=</span> <span class="token string">"example"</span>
  <span class="token property">vpc_id</span> <span class="token punctuation">=</span> aws_vpc.example.id

  <span class="token keyword">egress</span> <span class="token punctuation">{</span>
    <span class="token property">from_port</span>        <span class="token punctuation">=</span> <span class="token number">0</span>
    <span class="token property">to_port</span>          <span class="token punctuation">=</span> <span class="token number">0</span>
    <span class="token property">protocol</span>         <span class="token punctuation">=</span> <span class="token string">"-1"</span>
    <span class="token property">cidr_blocks</span>      <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"0.0.0.0/0"</span><span class="token punctuation">]</span>
    <span class="token property">ipv6_cidr_blocks</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"::/0"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_security_group_rule"</span></span> <span class="token string">"example_ssh"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span>              <span class="token punctuation">=</span> <span class="token string">"ingress"</span>
  <span class="token property">from_port</span>         <span class="token punctuation">=</span> <span class="token number">22</span>
  <span class="token property">to_port</span>           <span class="token punctuation">=</span> <span class="token number">22</span>
  <span class="token property">protocol</span>          <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
  <span class="token property">cidr_blocks</span>       <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"0.0.0.0/0"</span><span class="token punctuation">]</span>
  <span class="token property">security_group_id</span> <span class="token punctuation">=</span> aws_security_group.example.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_security_group_rule"</span></span> <span class="token string">"example_vault"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span>              <span class="token punctuation">=</span> <span class="token string">"ingress"</span>
  <span class="token property">from_port</span>         <span class="token punctuation">=</span> <span class="token number">8200</span>
  <span class="token property">to_port</span>           <span class="token punctuation">=</span> <span class="token number">8200</span>
  <span class="token property">protocol</span>          <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
  <span class="token property">cidr_blocks</span>       <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"0.0.0.0/0"</span><span class="token punctuation">]</span>
  <span class="token property">security_group_id</span> <span class="token punctuation">=</span> aws_security_group.example.id
<span class="token punctuation">}</span>

<span class="token comment">// key pair</span>
<span class="token keyword">resource <span class="token type variable">"tls_private_key"</span></span> <span class="token string">"ssh"</span> <span class="token punctuation">{</span>
  <span class="token property">algorithm</span> <span class="token punctuation">=</span> <span class="token string">"RSA"</span>
  <span class="token property">rsa_bits</span>  <span class="token punctuation">=</span> <span class="token number">4096</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"local_sensitive_file"</span></span> <span class="token string">"ssh_private"</span> <span class="token punctuation">{</span>
  <span class="token property">content</span>  <span class="token punctuation">=</span> tls_private_key.ssh.private_key_pem
  <span class="token property">filename</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">path</span><span class="token punctuation">.</span><span class="token type variable">module</span><span class="token punctuation">}</span></span>/ssh_private"</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"random_id"</span></span> <span class="token string">"key_id"</span> <span class="token punctuation">{</span>
  <span class="token property">keepers</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">ami_id</span> <span class="token punctuation">=</span> tls_private_key.ssh.public_key_openssh
  <span class="token punctuation">}</span>

  <span class="token property">byte_length</span> <span class="token punctuation">=</span> <span class="token number">8</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_key_pair"</span></span> <span class="token string">"ssh"</span> <span class="token punctuation">{</span>
  <span class="token property">key_name</span>   <span class="token punctuation">=</span> <span class="token string">"key-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>random_id<span class="token punctuation">.</span>key_id<span class="token punctuation">.</span>hex<span class="token punctuation">}</span></span>"</span>
  <span class="token property">public_key</span> <span class="token punctuation">=</span> tls_private_key.ssh.public_key_openssh
<span class="token punctuation">}</span>

<span class="token comment">// EC2</span>
<span class="token keyword">data <span class="token type variable">"aws_ami"</span></span> <span class="token string">"ubuntu"</span> <span class="token punctuation">{</span>
  <span class="token property">most_recent</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>

  <span class="token keyword">filter</span> <span class="token punctuation">{</span>
    <span class="token property">name</span>   <span class="token punctuation">=</span> <span class="token string">"name"</span>
    <span class="token property">values</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">filter</span> <span class="token punctuation">{</span>
    <span class="token property">name</span>   <span class="token punctuation">=</span> <span class="token string">"virtualization-type"</span>
    <span class="token property">values</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"hvm"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  <span class="token property">owners</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"099720109477"</span><span class="token punctuation">]</span> <span class="token comment"># Canonical</span>
<span class="token punctuation">}</span>

<span class="token keyword">data <span class="token type variable">"aws_iam_policy_document"</span></span> <span class="token string">"example_instance_role_client"</span> <span class="token punctuation">{</span>
  <span class="token keyword">statement</span> <span class="token punctuation">{</span>
    <span class="token property">effect</span>  <span class="token punctuation">=</span> <span class="token string">"Allow"</span>
    <span class="token property">actions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"sts:AssumeRole"</span><span class="token punctuation">]</span>
    <span class="token keyword">principals</span> <span class="token punctuation">{</span>
      <span class="token property">type</span>        <span class="token punctuation">=</span> <span class="token string">"Service"</span>
      <span class="token property">identifiers</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"ec2.amazonaws.com"</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_iam_role"</span></span> <span class="token string">"example_client_instance_role_client"</span> <span class="token punctuation">{</span>
  <span class="token property">name_prefix</span>        <span class="token punctuation">=</span> <span class="token string">"auth-example-iam-role-client"</span>
  <span class="token property">assume_role_policy</span> <span class="token punctuation">=</span> data.aws_iam_policy_document.example_instance_role_client.json
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_iam_instance_profile"</span></span> <span class="token string">"example_instance_profile_client"</span> <span class="token punctuation">{</span>
  <span class="token property">path</span> <span class="token punctuation">=</span> <span class="token string">"/"</span>
  <span class="token property">role</span> <span class="token punctuation">=</span> aws_iam_role.example_client_instance_role_client.name
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_instance"</span></span> <span class="token string">"client"</span> <span class="token punctuation">{</span>
  <span class="token property">ami</span>                         <span class="token punctuation">=</span> data.aws_ami.ubuntu.id
  <span class="token property">iam_instance_profile</span>        <span class="token punctuation">=</span> aws_iam_instance_profile.example_instance_profile_client.name
  <span class="token property">instance_type</span>               <span class="token punctuation">=</span> <span class="token string">"t3.micro"</span>
  <span class="token property">key_name</span>                    <span class="token punctuation">=</span> aws_key_pair.ssh.key_name
  <span class="token property">subnet_id</span>                   <span class="token punctuation">=</span> aws_subnet.public.id
  <span class="token property">associate_public_ip_address</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">vpc_security_group_ids</span>      <span class="token punctuation">=</span> <span class="token punctuation">[</span>aws_security_group.example.id<span class="token punctuation">]</span>

  <span class="token property">user_data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
		#! /bin/bash
    sudo apt update &amp;&amp; sudo apt install gpg
    wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
    gpg --no-default-keyring --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg --fingerprint
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    sudo apt update
    sudo apt install vault
  EOF</span>

  <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">Name</span> <span class="token punctuation">=</span> <span class="token string">"client"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">data <span class="token type variable">"aws_iam_policy_document"</span></span> <span class="token string">"assume_role"</span> <span class="token punctuation">{</span>
  <span class="token keyword">statement</span> <span class="token punctuation">{</span>
    <span class="token property">effect</span> <span class="token punctuation">=</span> <span class="token string">"Allow"</span>

    <span class="token keyword">principals</span> <span class="token punctuation">{</span>
      <span class="token property">type</span>        <span class="token punctuation">=</span> <span class="token string">"Service"</span>
      <span class="token property">identifiers</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"ec2.amazonaws.com"</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>

    <span class="token property">actions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"sts:AssumeRole"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_iam_role"</span></span> <span class="token string">"vault_role"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>               <span class="token punctuation">=</span> <span class="token string">"vault-role"</span>
  <span class="token property">assume_role_policy</span> <span class="token punctuation">=</span> data.aws_iam_policy_document.assume_role.json
<span class="token punctuation">}</span>

<span class="token keyword">data <span class="token type variable">"aws_iam_policy_document"</span></span> <span class="token string">"example_policy_vault"</span> <span class="token punctuation">{</span>
  <span class="token keyword">statement</span> <span class="token punctuation">{</span>
    <span class="token property">effect</span>    <span class="token punctuation">=</span> <span class="token string">"Allow"</span>
    <span class="token property">actions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"ec2:DescribeInstances"</span>,
      <span class="token string">"iam:GetInstanceProfile"</span>,
      <span class="token string">"iam:GetUser"</span>,
      <span class="token string">"iam:GetRole"</span>,
    <span class="token punctuation">]</span>
    <span class="token property">resources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"*"</span>
      <span class="token comment">// "arn:aws:iam::*:user/*",</span>
      <span class="token comment">// "arn:aws:iam::*:role/*",</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">statement</span> <span class="token punctuation">{</span>
    <span class="token property">effect</span>    <span class="token punctuation">=</span> <span class="token string">"Allow"</span>
    <span class="token property">actions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"sts:AssumeRole"</span>,
    <span class="token punctuation">]</span>
    <span class="token property">resources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"arn:aws:iam::<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">data</span><span class="token punctuation">.</span><span class="token type variable">aws_caller_identity</span><span class="token punctuation">.</span>current<span class="token punctuation">.</span>account_id<span class="token punctuation">}</span></span>:role/<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>aws_iam_role<span class="token punctuation">.</span>vault_role<span class="token punctuation">.</span>name<span class="token punctuation">}</span></span>"</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">statement</span> <span class="token punctuation">{</span>
    <span class="token property">effect</span>    <span class="token punctuation">=</span> <span class="token string">"Allow"</span>
    <span class="token property">actions</span>   <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"sts:GetCallerIdentity"</span>
    <span class="token punctuation">]</span>
    <span class="token property">resources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"*"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">statement</span> <span class="token punctuation">{</span>
    <span class="token property">sid</span> <span class="token punctuation">=</span> <span class="token string">"ManageOwnAccessKeys"</span>
    <span class="token property">actions</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"iam:CreateAccessKey"</span>,
      <span class="token string">"iam:DeleteAccessKey"</span>,
      <span class="token string">"iam:GetAccessKeyLastUsed"</span>,
      <span class="token string">"iam:GetUser"</span>,
      <span class="token string">"iam:ListAccessKeys"</span>,
      <span class="token string">"iam:UpdateAccessKey"</span>,
    <span class="token punctuation">]</span>
    <span class="token property">resources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"arn:aws:iam::*:user/$${aws:username}"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_iam_policy"</span></span> <span class="token string">"policy"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>        <span class="token punctuation">=</span> <span class="token string">"vault-policy"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"A test policy"</span>
  <span class="token property">policy</span>      <span class="token punctuation">=</span> data.aws_iam_policy_document.example_policy_vault.json
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_iam_role_policy_attachment"</span></span> <span class="token string">"vault-attach"</span> <span class="token punctuation">{</span>
  <span class="token property">role</span>       <span class="token punctuation">=</span> aws_iam_role.vault_role.name
  <span class="token property">policy_arn</span> <span class="token punctuation">=</span> aws_iam_policy.policy.arn
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_iam_instance_profile"</span></span> <span class="token string">"vault_profile"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"vault_profile"</span>
  <span class="token property">role</span> <span class="token punctuation">=</span> aws_iam_role.vault_role.name
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_instance"</span></span> <span class="token string">"vault"</span> <span class="token punctuation">{</span>
  <span class="token property">ami</span>                         <span class="token punctuation">=</span> data.aws_ami.ubuntu.id
  <span class="token property">iam_instance_profile</span>        <span class="token punctuation">=</span> aws_iam_instance_profile.vault_profile.name
  <span class="token property">instance_type</span>               <span class="token punctuation">=</span> <span class="token string">"t3.micro"</span>
  <span class="token property">key_name</span>                    <span class="token punctuation">=</span> aws_key_pair.ssh.key_name
  <span class="token property">subnet_id</span>                   <span class="token punctuation">=</span> aws_subnet.public.id
  <span class="token property">associate_public_ip_address</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">vpc_security_group_ids</span>      <span class="token punctuation">=</span> <span class="token punctuation">[</span>aws_security_group.example.id<span class="token punctuation">]</span>

  <span class="token property">user_data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
		#! /bin/bash
    sudo apt update &amp;&amp; sudo apt install gpg
    wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
    gpg --no-default-keyring --keyring /usr/share/keyrings/hashicorp-archive-keyring.gpg --fingerprint
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    sudo apt update
    sudo apt install vault
  EOF</span>

  <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">Name</span> <span class="token punctuation">=</span> <span class="token string">"vault"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> "info" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">client_ip</span>       <span class="token punctuation">=</span> aws_instance.client.public_ip
    <span class="token property">vault_ip</span>        <span class="token punctuation">=</span> aws_instance.vault.public_ip
    <span class="token property">client_role_arn</span> <span class="token punctuation">=</span> aws_iam_role.example_client_instance_role_client.arn
    <span class="token property">ami_id</span>          <span class="token punctuation">=</span> aws_instance.client.ami
    <span class="token property">ec2_id</span>          <span class="token punctuation">=</span> aws_instance.client.id
    <span class="token property">private_key</span>     <span class="token punctuation">=</span> nonsensitive(tls_private_key.ssh.private_key_pem)
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>서버 ssh 접속을 위한 private key는 <code v-pre>ssh_private</code> 파일로 자동 생성<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">ssh</span> <span class="token parameter variable">-i</span> ./ssh_private <span class="token variable"><span class="token variable">$(</span>terraform output <span class="token parameter variable">-raw</span> vault_ip<span class="token variable">)</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="vault-server-실행" tabindex="-1"><a class="header-anchor" href="#vault-server-실행" aria-hidden="true">#</a> Vault Server 실행</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Server Instance</span>
$ vault server <span class="token parameter variable">-dev</span> -dev-root-token-id<span class="token operator">=</span>root -log-level<span class="token operator">=</span>trace
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="client에서-auth-구성-및-테스트" tabindex="-1"><a class="header-anchor" href="#client에서-auth-구성-및-테스트" aria-hidden="true">#</a> Client에서 Auth 구성 및 테스트</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Client Instance</span>
$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span>http://10.0.0.8:8200
$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>root

$ vault policy <span class="token function">write</span> <span class="token string">"example-policy"</span> -<span class="token operator">&lt;&lt;</span><span class="token string">EOF
path "secret/data/example_*" {
  capabilities = ["create", "read"]
}
EOF</span>

$ vault kv put secret/example_test <span class="token assign-left variable">foo</span><span class="token operator">=</span>bar

$ vault auth <span class="token builtin class-name">enable</span> aws

<span class="token comment"># auth 구성에 access key 선언이 생략</span>
$ vault <span class="token function">write</span> auth/aws/config/client <span class="token assign-left variable">sts_region</span><span class="token operator">=</span><span class="token string">"ap-northeast-2"</span>

<span class="token comment"># 만약 Vault Server의 AWS Auth에 권한이 없는 경우</span>
$ vault <span class="token function">write</span> <span class="token punctuation">\</span>
   auth/aws/role/example-role-name <span class="token punctuation">\</span>
   <span class="token assign-left variable">auth_type</span><span class="token operator">=</span>iam <span class="token punctuation">\</span>
   <span class="token assign-left variable">policies</span><span class="token operator">=</span>example-policy <span class="token punctuation">\</span>
   <span class="token assign-left variable">max_ttl</span><span class="token operator">=</span>500h <span class="token punctuation">\</span>
   <span class="token assign-left variable">bound_iam_principal_arn</span><span class="token operator">=</span><span class="token variable">$client_instance_role_arn</span> <span class="token punctuation">\</span>
   <span class="token assign-left variable">inferred_entity_type</span><span class="token operator">=</span><span class="token string">"ec2_instance"</span> <span class="token punctuation">\</span>
   <span class="token assign-left variable">inferred_aws_region</span><span class="token operator">=</span><span class="token string">"ap-northeast-2"</span>

Error writing data to auth/aws/role/example-role-name: Error making API request.

URL: PUT http://10.0.0.86:8200/v1/auth/aws/role/example-role-name
Code: <span class="token number">400</span>. Errors:

* unable to resolve ARN <span class="token string">"arn:aws:iam::467567795630:role/auth-example-iam-role20230630045547898800000001"</span> to internal ID: unable to fetch current caller: NoCredentialProviders: no valid providers <span class="token keyword">in</span> chain. Deprecated.
	For verbose messaging see aws.Config.CredentialsChainVerboseErrors
	

<span class="token comment"># Policy 추가 후 login 수행</span>
$ vault login <span class="token parameter variable">-method</span><span class="token operator">=</span>aws <span class="token assign-left variable">role</span><span class="token operator">=</span>example-role-name

Key                      Value
---                      -----
token                    hvs.CAESIGe7HuhqFefKHDkE_M_leja0bRDEnwPZs7CeztZQXuVCGh4KHGh2cy41S2VienFmbU5scFZBcmFpWkZNemtrdmE
token_accessor           VAD61CRZHhLp7VN6Uf6qRHbh
token_duration           500h
token_renewable          <span class="token boolean">true</span>
token_policies           <span class="token punctuation">[</span><span class="token string">"default"</span> <span class="token string">"example-policy"</span><span class="token punctuation">]</span>
identity_policies        <span class="token punctuation">[</span><span class="token punctuation">]</span>
policies                 <span class="token punctuation">[</span><span class="token string">"default"</span> <span class="token string">"example-policy"</span><span class="token punctuation">]</span>
token_meta_account_id    <span class="token number">467567795630</span>
token_meta_auth_type     iam
token_meta_role_id       c1de423d-0751-a879-7b43-1047f1c43a42


$ <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>hvs.CAESIGe7HuhqFefKHDkE_M_leja0bRDEnwPZs7CeztZQXuVCGh4KHGh2cy41S2VienFmbU5scFZBcmFpWkZNemtrdmE vault kv get secret/example_test

<span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span> Secret Path <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span>
secret/data/example_test

<span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span> Metadata <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span>
Key                Value
---                -----
created_time       <span class="token number">2023</span>-06-30T06:21:09.409042961Z
custom_metadata    <span class="token operator">&lt;</span>nil<span class="token operator">></span>
deletion_time      n/a
destroyed          <span class="token boolean">false</span>
version            <span class="token number">1</span>

<span class="token operator">==</span><span class="token operator">=</span> Data <span class="token operator">==</span><span class="token operator">=</span>
Key    Value
---    -----
foo    bar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


