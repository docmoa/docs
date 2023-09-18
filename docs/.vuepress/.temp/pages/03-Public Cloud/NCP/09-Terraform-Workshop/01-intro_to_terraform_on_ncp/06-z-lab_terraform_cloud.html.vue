<template><div><h1 id="lab-terraform-cloud-연결" tabindex="-1"><a class="header-anchor" href="#lab-terraform-cloud-연결" aria-hidden="true">#</a> 💻 Lab - Terraform Cloud 연결</h1>
<h3 id="편집기에서-열기" tabindex="-1"><a class="header-anchor" href="#편집기에서-열기" aria-hidden="true">#</a> 편집기에서 열기</h3>
<figure><img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab1-02.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<ul>
<li>VSCode를 실행하고 File(파일) 메뉴에서 <code v-pre>Open Folder...</code> 를 클릭합니다.</li>
<li>앞서 실습을 진행한 <code v-pre>lab02</code>을 열어줍니다.</li>
</ul>
<hr>
<h2 id="☁️-terraform-configuration" tabindex="-1"><a class="header-anchor" href="#☁️-terraform-configuration" aria-hidden="true">#</a> ☁️ Terraform Configuration</h2>
<Presentation id="presentation-25" code="eJzjUlZWVghJLSpKTMsvylVwzskvTQGLBaXm5pekKgSXJALJNwsa3sxb+qat53XXFIXXq1a8nrxA4U3TmjezVr6ZN+HN9AmvNvUovF6z5fXinjfzWl93d7zuXqLHBQD6ii38" theme="blood"></Presentation><h3 id="terraform-cloud-계정" tabindex="-1"><a class="header-anchor" href="#terraform-cloud-계정" aria-hidden="true">#</a> Terraform Cloud 계정</h3>
<p>Terraform Cloud는 다른 SaaS 서비스와 같이 개인을 위한 무료 플랜이 준비되어있습니다.</p>
<p>아직 계정이 없는 경우 계성을 생성하고 다음 실습을 진행합니다.</p>
<ol>
<li>계정 생성을 위해 <a href="https://app.terraform.io/signup/account" target="_blank" rel="noopener noreferrer">https://app.terraform.io/signup/account<ExternalLinkIcon/></a>로 접속합니다.</li>
<li>필요한 정보를 입력하고 확인하여 신규 계정을 생성합니다. <button style='border-color: #3322de; background-color: #5c4ee5; color: #fff; font-size: 1rem;'>Cretea account</button></li>
<li>가입한 이메일로 계정 생성 확인 메시지가 도착합니다. 링크를 확인하면 Terraform Cloud를 사용할 준비가 끝났습니다.</li>
</ol>
<h4 id="terraform-cloud를-설정합니다" tabindex="-1"><a class="header-anchor" href="#terraform-cloud를-설정합니다" aria-hidden="true">#</a> 💻 Terraform Cloud를 설정합니다.</h4>
<ol>
<li>
<p>Terraform Cloud에 로그인하면 <code v-pre>YOURNAME-training</code> 이라는 새 조직을 만듭니다. <code v-pre>YOURNAME</code>을 자신의 이름이나 다른 텍스트로 바꾸십시오.</p>
</li>
<li>
<p>다음으로 Workspace를 생성하라는 메시지가 표시됩니다. <code v-pre>CLI 기반 워크플로</code> 패널을 클릭하여 VCS 통합 단계를 건너뛸 수 있습니다.<br>
<img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab6-01.png" alt="" loading="lazy"></p>
</li>
<li>
<p>작업 공간의 이름을 <code v-pre>hashicat-ncp</code> 로 지정 하고 <code v-pre>Create workspace</code>를 클릭하여 새로운 Workspace를 생성합니다.</p>
</li>
<li>
<p>터미널에서 <code v-pre>terraform version</code> 을 실행하여 버전을 확인합니다.</p>
</li>
<li>
<p>Terraform Cloud 상에 생성한 <code v-pre>hashicat-ncp</code> 의 <code v-pre>Settings &gt; General</code> 로 이동하여 <code v-pre>Terraform Version</code>을 동일한 버전으로 구성합니다. 그리고 Execution Mode를 <code v-pre>Local</code>로 설정합니다.</p>
</li>
</ol>
<Tabs id="82" :data='[]'>
</Tabs>
<ol start="6">
<li><code v-pre>Settings</code> 페이지 하단에 <button style='border-color: #3322de; background-color: #5c4ee5; color: #fff; font-size: 1rem;'>Save settings</button> 버튼을 클릭하여 저장합니다.</li>
</ol>
<hr>
<h2 id="🎛️-configure-remote-state" tabindex="-1"><a class="header-anchor" href="#🎛️-configure-remote-state" aria-hidden="true">#</a> 🎛️ Configure Remote State</h2>
<Presentation id="presentation-98" code="eJyVj79OwlAYxfc+xRe6Wl/C1cn4AkTrBGnS6I7mktS2wzV65Rpbg0mHQliAMgEv1O/cd6Cl/ElIGFhPTs7v/Czbtql16z20Oy1ClJnvd+Jxzp8Jh1907/p++8nzu0g1lYsJxLScr4jnPQS6LtTVD0n4jc3rBGFm+jHSAn2NgSR+y6EE/gKEC44CjrJry3Icx2qgd27Xe3ZPqf8JYSjMjzZKl7OYWGoeFccndNPxXh6pKpSzdX0Ly7yhsgj28UBCVDvbYZajy+FVnlztPBtvpL1zJypViAxDZVQBtSKjDsQNlw3BSw==" theme="blood"></Presentation><p>이번 실습에서는 Terraform Cloud를 Remote State Backend로 구성하여 기존 State 파일을 Terraform Cloud 환경으로 마이그레이션 합니다.</p>
<h4 id="remote-backend-구성하기" tabindex="-1"><a class="header-anchor" href="#remote-backend-구성하기" aria-hidden="true">#</a> 💻 Remote Backend 구성하기</h4>
<p>Workspace 디렉토리에 (<code v-pre>main.tf</code>와 같은 위치) 아래와 같은 내용으로 <code v-pre>remote_backend.tf</code> 파일을 생성합니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># remote_backend.tf</span>
<span class="token keyword">terraform</span> <span class="token punctuation">{</span>
  <span class="token keyword">backend<span class="token type variable"> "remote" </span></span><span class="token punctuation">{</span>
    <span class="token property">hostname</span> <span class="token punctuation">=</span> <span class="token string">"app.terraform.io"</span>
    <span class="token property">organization</span> <span class="token punctuation">=</span> <span class="token string">"YOURORGANIZATION"</span>
    <span class="token keyword">workspaces</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"hashicat-ncp"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>YOURORGANIZATION</code>을 생성한 Organization 이름으로 수정합니다.</p>
<p>이후 터미널에서 <code v-pre>terraform login</code> 을 입력합니다. 로컬 환경에 Terraform Cloud와 API 인증을 위한 Token을 생성하는 과정입니다. <code v-pre>yes</code>를 입력하면 Terraform Cloud의 토큰 생성화면이 열립니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code>$ terraform login
Terraform will request an API token <span class="token keyword">for</span> app.terraform.io using your browser.
<span class="token punctuation">..</span>.
Do you want to proceed?
  Only <span class="token string">'yes'</span> will be accepted to confirm.

  Enter a value: 
</code></pre><div class="highlight-lines"><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>Create API token</code> 화면이 나오면 Description에 적절한 값(예: ncp workshop)을 입력한 후 <button style='border-color: #3322de; background-color: #5c4ee5; color: #fff; font-size: 1rem;'>Create API token</button> 버튼을 클릭하여 새로운 Token을 생성합니다.</p>
<Tabs id="119" :data='[]'>
</Tabs>
<p>생성된 Token을 복사하여 앞서 터미널에 새로운 입력란인 <code v-pre>Enter a value: </code> 에 붙여넣고 <kbd>⏎</kbd>(엔터)를 입력합니다. (입력된 값은 보이지 않습니다.)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token punctuation">..</span>.
Generate a token using your browser, and copy-paste it into this prompt.

Terraform will store the token <span class="token keyword">in</span> plain text <span class="token keyword">in</span> the following <span class="token function">file</span>
<span class="token keyword">for</span> use by subsequent commands:
    /Users/yourname/.terraform.d/credentials.tfrc.json

Token <span class="token keyword">for</span> app.terraform.io:
  Enter a value: ****************************************** 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>해당 토큰은 터미널에 표기된 <code v-pre>credentials.tfrc.json</code> 파일에 저장됩니다.</p>
<p>터미널에서 <code v-pre>terraform init</code>을 실행합니다.</p>
<p>State를 Terraform Cloud로 마이그레이션하라는 메시지가 표시되면 &quot;yes&quot;를 입력합니다.</p>
<p>backend가 remote로 구성됨이 성공함을 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code>$ terraform init
<span class="token punctuation">..</span>.
Initializing the backend<span class="token punctuation">..</span>.

Successfully configured the backend <span class="token string">"remote"</span><span class="token operator">!</span> Terraform will automatically
use this backend unless the backend configuration changes.
<span class="token punctuation">..</span>.
</code></pre><div class="highlight-lines"><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이제 상태가 Terraform Cloud에 안전하게 저장됩니다. TFC UI에서 작업 영역의 &quot;State&quot; 탭에서 이를 확인할 수 있습니다.</p>
<p>변수들을 변경하면서 <code v-pre>terraform apply -auto-approve</code>를 실행하고, 상태 파일이 리소스가 변경될 때마다 변경되는 것을 지켜보십시오. Terraform Cloud UI를 사용하여 이전 상태 파일을 탐색할 수 있습니다.</p>
<figure><img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab6-06.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<hr>
<h2 id="🔥-terraform-destroy" tabindex="-1"><a class="header-anchor" href="#🔥-terraform-destroy" aria-hidden="true">#</a> 🔥 Terraform Destroy</h2>
<Presentation id="presentation-154" code="eJxVzU8KgkAcxfH9nOKHrvU0XSDIdiFMbtr1x4XpLJVEmAgqIpiVaLiYLjTz5g5l0MLlg8f3w3zfp1nE+XwZ8xXkliAHV6ZWanvXZHqFV+Wq2uYlmfZgH8LtNOH4Nq2YXp0QputcdSFkNeGcIe9tkdniFjIWBAH7UV7yt2gRrRMeb7wxjauGrL8OToqwV2ie40gHNGXIPvPJW7w=" theme="blood"></Presentation><h4 id="리소스-삭제하기" tabindex="-1"><a class="header-anchor" href="#리소스-삭제하기" aria-hidden="true">#</a> 💻 리소스 삭제하기</h4>
<p>다음 명령을 실행하여 인프라를 삭제하세요.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform destroy
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>인프라를 삭제한다는 메시지가 표시되면 &quot;yes&quot;를 입력해야 합니다. 중요한 리소스가 실수로 삭제되는 것을 방지하기 위한 안전 기능입니다.</p>
<p>확인 버튼을 클릭하기 전에 리소스 삭제 작업이 완전히 끝날 때까지 기다리십시오.</p>
<hr>
<figure><img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/intro-to-terraform-on-ncp-2.png" alt="Intro" tabindex="0" loading="lazy"><figcaption>Intro</figcaption></figure>
</div></template>


