<template><div><h1 id="lab-terraform-in-action" tabindex="-1"><a class="header-anchor" href="#lab-terraform-in-action" aria-hidden="true">#</a> 💻 Lab - Terraform in Action</h1>
<h3 id="편집기에서-열기" tabindex="-1"><a class="header-anchor" href="#편집기에서-열기" aria-hidden="true">#</a> 편집기에서 열기</h3>
<figure><img src="@source/03-PublicCloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab1-02.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<ul>
<li>VSCode를 실행하고 File(파일) 메뉴에서 <code v-pre>Open Folder...</code> 를 클릭합니다.</li>
<li>앞서 받은 디렉토리내의 <code v-pre>lab02</code>을 열어줍니다.</li>
</ul>
<hr>
<h2 id="📈-terraform-graph" tabindex="-1"><a class="header-anchor" href="#📈-terraform-graph" aria-hidden="true">#</a> 📈 Terraform Graph</h2>
<Presentation id="presentation-25" code="eJw1jUEKglAUReeu4oFj20YbaAMNiiZRuIIEC9GCoiyp/0OiIsOBZYIDa0G++/eQfWh6ueccwzRN6vRsu9sf2UNq293xgP0N8f3G65ggS7VxWVbYLYnnExUKQiDqzEHskFoJFbmQLiEWdV6osCG8iHD04BcceBycW4ZhWZahO5Av7c4n9fMN2RwjR20vPwFnB+05TTFbwH0Qp2UjJY6WGrmmmM3hn/lSEbKP3hYZQcTYJypM/rEvCN14mw==" theme="blood"></Presentation><p>💻 다음 terraform graph명령을 실행해 보세요.</p>
<p>새로운 Workspace 이므로, <code v-pre>terraform init</code>을 수행합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform init
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code v-pre>terraform graph</code>를 수행합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform graph
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>그러면 <code v-pre>digraph</code>로 시작하는 인프라의 시각적 맵을 만드는 데 사용할 수 있는 코드가 생성됩니다. 그래프 데이터는 DOT 그래프 설명 언어 형식 입니다. 무료 Blast Radius 도구를 포함하여 이 데이터를 시각화하는 데 사용할 수 있는 몇 가지 그래프 도구가 있습니다.</p>
<ul>
<li><a href="https://28mm.github.io/blast-radius-docs/" target="_blank" rel="noopener noreferrer">Blast Radius<ExternalLinkIcon/></a>는 설치형 툴입니다.</li>
<li>Graphviz는 DOT 그래프 설명 언어를 표시해주는 툴입니다.
<ul>
<li><a href="https://dreampuf.github.io/GraphvizOnline/" target="_blank" rel="noopener noreferrer">https://dreampuf.github.io/GraphvizOnline/<ExternalLinkIcon/></a> 에 앞서 <code v-pre>digraph</code>로 시작하는 내용을 복사하여 붙여넣고 어떤 그림이 나오는지 확인해 봅니다.</li>
<li>인프라에 대한 Terraform 그래프를 살펴보십시오. 종속성이 자동으로 매핑됩니다.<br>
<img src="@source/03-PublicCloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/graphviz-1.svg" alt="" loading="lazy"></li>
</ul>
</li>
</ul>
<p>온라인에 Terraform의 작업을 시각화해주는 여러가지 툴이 있습니다. 간혹 plan 파일을 요구하는 툴이 있다면 주의하십시오. 민감한 정보가 포한된 plan의 경우 보안적으로 위험할 수 있습니다. 주의하여 사용하세요.</p>
<ul>
<li><a href="https://hieven.github.io/terraform-visual/" target="_blank" rel="noopener noreferrer">https://hieven.github.io/terraform-visual/<ExternalLinkIcon/></a></li>
</ul>
<div class="hint-container warning">
<p class="hint-container-title">경고</p>
<p>plan 정보에는 인증키, 패스워드같은 노출하고 싶지 않은 정보가 포함될 수 있습니다.</p>
</div>
<hr>
<h2 id="👨‍💻-terraform-plan-terraform-apply" tabindex="-1"><a class="header-anchor" href="#👨‍💻-terraform-plan-terraform-apply" aria-hidden="true">#</a> 👨‍💻 Terraform Plan &amp; Terraform Apply</h2>
<Presentation id="presentation-83" code="eJxFjk0KgmAYhPee4gXXdpYWHUAXteoPadOuoqIyoUWWlIKFBYWBZQsD60C+890h+6DaDTPzMKOoqkp5GnOSIujDy3jnkd6pmqZRa5kNMtrtelcnPo84eMDvkV75ZeW60dThDwlWKFZT4bhYR4TtolA8WxInvfz2JAwi4Vw+PU7uRQOhzdaErbCkKJqmKfIC/Psfge8S3L5YHSQVb+XIfoSxjeGVOCq+esTuQiLHCOM5ZiEfMkL8kp4dE7wAm5NwTt+xN5yAhxA=" theme="blood"></Presentation><h4 id="필수-변수를-구성했으므로-변경-사항을-적용할-수-있습니다" tabindex="-1"><a class="header-anchor" href="#필수-변수를-구성했으므로-변경-사항을-적용할-수-있습니다" aria-hidden="true">#</a> 💻 필수 변수를 구성했으므로 변경 사항을 적용할 수 있습니다.</h4>
<p>어떤 일이 일어날지 보려면 먼저 <code v-pre>terraform plan</code> 명령을 실행하십시오 .</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform plan
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>계획 출력에 적절한 prefix, subnet cidr이 표시되는지 확인합니다. 원한다면 <code v-pre>terraform.tfvars</code> 혹은 <code v-pre>variables.tf</code>에 정의된 <code v-pre>default</code>값을 변경해보세요.</p>
<p>그런 다음 <code v-pre>terraform apply</code>를 실행하고 리소스가 구축되는 것을 지켜보십시오.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform apply
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Terraform에서 &quot;Do you want to perform these actions?&quot;라는 메시지가 표시되면 <code v-pre>yes</code> 를 입력해야 합니다.</p>
<p><code v-pre>Apply complete! Resources: 1 added, 0 changed, 0 destroyed.</code> 메시지를 확인하였습니까? 에러가 발생하였다면 무엇이 문제인지 찾아보세요.</p>
<p>지금 우리 코드는 VPC만 정의합니다. 우리는 진행되는 실습에서 이 코드와 프로비저닝된 상태 기반으로 시작 할 것입니다.</p>
<p><a href="https://console.ncloud.com/vpc-network/vpc" target="_blank" rel="noopener noreferrer">NCP Consul<ExternalLinkIcon/></a> 화면에 접속해 보세요. 구성한 자원이 생성된 것이 확인되나요?</p>
<Tabs id="110" :data='[]'>
</Tabs>
<hr>
<h2 id="👩‍💻-test-and-repair" tabindex="-1"><a class="header-anchor" href="#👩‍💻-test-and-repair" aria-hidden="true">#</a> 👩‍💻 Test and Repair</h2>
<Presentation id="presentation-119" code="eJxFkM1Kw1AQhff3KQayUTDJvoh7975AsVGDtAkx4LZKkEuKdFFSozQaQdFAFzc/QsX4Qncm7+AEKl3OmXPON4wwDANOnCAYnnnBmLIpYFHioqSo3HNHztj3QmcS7lMWgVZLir9wJnH2ZglhmqYQWzPHSKZd8gio5kA/Tbf47CIFum5ZpCyFLv6mPAF6UHSreoHu7plBqxZfVwdAjdQbBZTf0FPRwzBKadkAzjnNHSkzsWhAV4o78b0FrKe6+uUNfTA8iXWdc/saX9aAldw2dQmLkmHPcnc6gCC16f0DOLwIQ/9qYNvOxLp2L13fGblDywvO7X6yj/8/cOociT8ky6dm" theme="blood"></Presentation><h4 id="멱등성의-검증을-해봅니다" tabindex="-1"><a class="header-anchor" href="#멱등성의-검증을-해봅니다" aria-hidden="true">#</a> 💻 멱등성의 검증을 해봅니다.</h4>
<p>어떤 일이 일어날지 보려면 먼저 <code v-pre>terraform plan</code> 명령을 실행하십시오.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform plan
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>VPC가 이미 구축되었으므로 Terraform은 변경이 필요하지 않다고 보고합니다.</p>
<p>이는 정상적이며 예상된 것입니다. 이제 다른 명령인 <code v-pre>terraform apply</code>를 실행하고 지켜보십시오.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform apply
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>이미 올바르게 프로비저닝된 경우 VPC를 다시 생성하지 않습니다.</p>
<p><code v-pre>Apply complete! Resources: 0 added, 0 changed, 0 destroyed.</code></p>
<h2 id="🛫-change-your-prefix" tabindex="-1"><a class="header-anchor" href="#🛫-change-your-prefix" aria-hidden="true">#</a> 🛫 Change Your Prefix</h2>
<Presentation id="presentation-143" code="eJxlkE9Kw0AUxvc5xYNsO15Cj6AHKBh3Uhm7cVeTKCFRCJhphzpTsohKoYVgolRIL5T35g5OaqUtXb5/3/f9nuO6Lpx7nPevBvya9AhIr0wWom7wrYFT7vWHXg/OvNshH9z14OLmctPgHvubgRFzTCJMihPHYYw5G0V8X9DjE8UFoF/TdA5YjdrPNVCiHGYtGvy2Tio3UpCWu3WMs+MLIH9JuTJC0oe9EnFb5UCTB3wuSdcmXhlh60gCzSKKv/7TMECZAo1rHBdgpWhadvJbFDCv4RYPMJXdpK0aym2eGrBUFOgjsoM/GbGk4B6MDGm2OPwarTN8UTSx7p2exFTZAIHV79DpR1oo4xeYFx3Jns0vOezezQ==" theme="blood"></Presentation><h4 id="terraform-tfvars를-변경합니다" tabindex="-1"><a class="header-anchor" href="#terraform-tfvars를-변경합니다" aria-hidden="true">#</a> 💻 <code v-pre>terraform.tfvars</code>를 변경합니다.</h4>
<p><code v-pre>terraform.tfvars</code> 파일을 편집하여 <code v-pre>prefix</code>를 기존과 다른 값으로 변경합니다.</p>
<p>변경 후 <code v-pre>terraform apply</code>를 실행하고 지켜보십시오.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform plan
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>VPC가 이미 구축되었으므로 Terraform은 변경이 필요하지 않다고 보고합니다.</p>
<p>이는 정상적이며 예상된 것입니다. 이제 다른 명령인 <code v-pre>terraform apply</code>를 실행하고 지켜보십시오.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform apply
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Terraform에서 &quot;Do you want to perform these actions?&quot;라는 메시지가 표시되면 <code v-pre>yes</code>를 입력하고 완료되기를 기다립니다. 출력의 결과가 어떤가요?</p>
<details class="hint-container details"><summary>VPC Update</summary>
<p>2021년 10월 20일 기준으로, VPC의 이름이 변경되면 NCP에서는 이 자원을 재생성 합니다.<br>
리소스에 대한 구성값의 변경이 유지된 채로 변경되기도 하지만, 때에 따라서는 삭제 후 재생성 합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code>$ terraform apply
ncloud_vpc.hashicat: Refreshing state<span class="token punctuation">..</span>. <span class="token punctuation">[</span>id<span class="token operator">=</span><span class="token number">13888</span><span class="token punctuation">]</span>

Terraform used the selected providers to generate the following execution plan.
Resource actions are indicated with the following symbols:
-/+ destroy and <span class="token keyword">then</span> create replacement

Terraform will perform the following actions:

  <span class="token comment"># ncloud_vpc.hashicat must be replaced</span>
-/+ resource <span class="token string">"ncloud_vpc"</span> <span class="token string">"hashicat"</span> <span class="token punctuation">{</span>
      ~ default_access_control_group_no <span class="token operator">=</span> <span class="token string">"26594"</span> -<span class="token operator">></span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      ~ default_network_acl_no          <span class="token operator">=</span> <span class="token string">"19325"</span> -<span class="token operator">></span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      ~ default_private_route_table_no  <span class="token operator">=</span> <span class="token string">"25834"</span> -<span class="token operator">></span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      ~ default_public_route_table_no   <span class="token operator">=</span> <span class="token string">"25833"</span> -<span class="token operator">></span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      ~ <span class="token function">id</span>                              <span class="token operator">=</span> <span class="token string">"13888"</span> -<span class="token operator">></span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
      ~ name                            <span class="token operator">=</span> <span class="token string">"yourname-vpc-kr"</span> -<span class="token operator">></span> <span class="token string">"hashicat-vpc-kr"</span> <span class="token comment"># forces replacement</span>
      ~ vpc_no                          <span class="token operator">=</span> <span class="token string">"13888"</span> -<span class="token operator">></span> <span class="token punctuation">(</span>known after apply<span class="token punctuation">)</span>
        <span class="token comment"># (1 unchanged attribute hidden)</span>
    <span class="token punctuation">}</span>

Plan: <span class="token number">1</span> to add, <span class="token number">0</span> to change, <span class="token number">1</span> to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only <span class="token string">'yes'</span> will be accepted to approve.

  Enter a value: <span class="token function">yes</span>

ncloud_vpc.hashicat: Destroying<span class="token punctuation">..</span>. <span class="token punctuation">[</span>id<span class="token operator">=</span><span class="token number">13888</span><span class="token punctuation">]</span>
ncloud_vpc.hashicat: Still destroying<span class="token punctuation">..</span>. <span class="token punctuation">[</span>id<span class="token operator">=</span><span class="token number">13888</span>, 10s elapsed<span class="token punctuation">]</span>
ncloud_vpc.hashicat: Still destroying<span class="token punctuation">..</span>. <span class="token punctuation">[</span>id<span class="token operator">=</span><span class="token number">13888</span>, 20s elapsed<span class="token punctuation">]</span>
ncloud_vpc.hashicat: Destruction complete after 23s
ncloud_vpc.hashicat: Creating<span class="token punctuation">..</span>.
ncloud_vpc.hashicat: Still creating<span class="token punctuation">..</span>. <span class="token punctuation">[</span>10s elapsed<span class="token punctuation">]</span>
ncloud_vpc.hashicat: Still creating<span class="token punctuation">..</span>. <span class="token punctuation">[</span>20s elapsed<span class="token punctuation">]</span>
ncloud_vpc.hashicat: Creation complete after 23s <span class="token punctuation">[</span>id<span class="token operator">=</span><span class="token number">13902</span><span class="token punctuation">]</span>

Apply complete<span class="token operator">!</span> Resources: <span class="token number">1</span> added, <span class="token number">0</span> changed, <span class="token number">1</span> destroyed.
</code></pre><div class="highlight-lines"><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<hr>
<h2 id="🛫-create-and-change-acl" tabindex="-1"><a class="header-anchor" href="#🛫-create-and-change-acl" aria-hidden="true">#</a> 🛫 Create and Change ACL</h2>
<Presentation id="presentation-174" code="eJx9kN9KAkEUxu/3KQ546/YS9Qj1AELbXRibN93pusWyGmzk6GCzMsGWCAqiWyisL7TnzDt0xoxYki7nz/nO7/s5tVoNzj3fb1w1/WtK20DpxgxCTAt8K+DU9xotrw5n3m3Lb97V4eLmcn/he+73Gxgxw16EvezEcVzXdfaJ+D6nhz7FGWCQ03gGuG6Xqx1QTzkuryjwkzcpbaSgVP5+x3jwdwIoWJBWRkia8pSIy7UGGt3j45LS3MQbI/gcSaBJRPHHD40LKBOgYY7DDDiKxksbf6gC5iU81ANMpH0p1wVp5skBl4q66dFmFVdGLKjbASNDmsyr5mg3wGdFIyawmRITxRBd3mHr01ZyMRNkqDPb5v9VhzDLaIQCXEU2l31gwO5ksrf2lEDJ2BWbliOYs03rbsSEOqFpSLpDqsBXTtr2Ofe4vi8DwC4d" theme="blood"></Presentation><h4 id="ncloud-network-acl을-추가합니다" tabindex="-1"><a class="header-anchor" href="#ncloud-network-acl을-추가합니다" aria-hidden="true">#</a> 💻 <code v-pre>ncloud_network_acl</code>을 추가합니다.</h4>
<p><code v-pre>main.tf</code> 파일을 열고 리소스 블록의 주석처리를 제거하려고 합니다.<br>
리소스 유형은 <code v-pre>ncloud_network_acl</code>이고 이름은 <code v-pre>public</code> 입니다.</p>
<ul>
<li>
<p>각 줄의 시작 부분에서 <code v-pre>#</code> 문자를 제거하여 코드의 주석 처리를 제거합니다.</p>
</li>
<li>
<p>코드편집기에서는 주석처리를 위해 해당 라인을 선택하고 활성/비활성 할 수 있습니다.</p>
<ul>
<li>
<p>Mac : <kbd>⌘</kbd> + <kbd>/</kbd></p>
</li>
<li>
<p>Win : <kbd>Ctrl</kbd> + <kbd>/</kbd><br>
<img src="@source/03-PublicCloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab2-03.gif" alt="" loading="lazy"></p>
</li>
</ul>
</li>
<li>
<p>주석 제거 후 파일을 저장하세요.</p>
</li>
</ul>
<p>변경 후 <code v-pre>terraform apply</code>를 실행하고 <code v-pre>yes</code>를 입력하여 추가된 리소스가 생성되는지 확인하세요.</p>
<p><code v-pre>ncloud_network_acl</code>리소스 내부의 <code v-pre>vpc_no</code> 파라메터를 확인합니다. 어떻게 가르키고 있나요?</p>
<p>해당 리소스는 VPC의 설정을 상속 받습니다.</p>
<p>Terraform은 수백개의 상호 연결되 리소스 간의 복잡한 종송석을 맵핑할 수 있습니다.</p>
<h4 id="ncloud-network-acl을-설정을-변경합니다" tabindex="-1"><a class="header-anchor" href="#ncloud-network-acl을-설정을-변경합니다" aria-hidden="true">#</a> 💻 <code v-pre>ncloud_network_acl</code>을 설정을 변경합니다.</h4>
<p><code v-pre>ncloud_network_acl</code>항목에 대해 <code v-pre>description</code> 의 내용을 수정해 보세요.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code><span class="token keyword">resource <span class="token type variable">"ncloud_network_acl"</span></span> <span class="token string">"public"</span> <span class="token punctuation">{</span>
  <span class="token property">vpc_no</span>      <span class="token punctuation">=</span> ncloud_vpc.hashicat.id
  <span class="token property">name</span>        <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">prefix</span><span class="token punctuation">}</span></span>-acl-public"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"for Public"</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">&nbsp;</div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>변경 후 <code v-pre>terraform apply</code>를 실행하고 <code v-pre>yes</code>를 입력하여 변경된 사항에 대해 리소스가 어떻게 되는지 확인하세요.</p>
<p>올바르게 프로비저닝된 경우 <code v-pre>ncloud_network_acl</code>를 삭제 후 다시 생성하지 않습니다.</p>
<p><code v-pre>Apply complete! Resources: 0 added, 1 changed, 0 destroyed.</code></p>
<hr>
<h2 id="🏗️-complete-the-build" tabindex="-1"><a class="header-anchor" href="#🏗️-complete-the-build" aria-hidden="true">#</a> 🏗️ Complete the Build</h2>
<Presentation id="presentation-242" code="eJxFjsFKw0AQhu95iqG96CH6CB7sXS/eu9gVC5oNm22ltyJBgvEgmNBQk1KxooUcYhsxQp9oZ/IObpTS08DM/3/zWe12G7o2GyhhM9eVYsi7UEcPOEv0d2XVcYnhz26Bbxug25ymyzpOaJJDqyNgJAZwwxwFSoDL5YWQ16AuuceBnau+cLyjFtDkEeo4BXoPMK8o84GSBa58zDaUlfiU7p0MuZT9Ht83uTlQkADNArr/wjDAcHFgWbZtW3+6/wINkV5NO9HF2HR8mkZGahvXq3F9NwcMP/Tap6yC0yvmNH/1Z4l+gM+FXptzEeFLCseSM8UPz9xeMzrcU1KMDHO5pf0CCq+bVw==" theme="blood"></Presentation><h4 id="애플리케이션을-배포해보세요" tabindex="-1"><a class="header-anchor" href="#애플리케이션을-배포해보세요" aria-hidden="true">#</a> 💻 애플리케이션을 배포해보세요.</h4>
<ul>
<li><code v-pre>main.tf</code>의 모든 주석을 제거하세요.</li>
<li><code v-pre>outputs.tf</code>의 모든 주석을 제거하세요.</li>
</ul>
<p><code v-pre>terraform plan</code>를 실행하여 구성할 리소스 항목을 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform plan
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>이제 Apply를 실행하여 HashiCat 애플리케이션을 빌드합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform apply -auto-approve
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>애플리케이션이 배포를 완료하는데 5~10분이 소요될 수 있습니다. 실행이 끝날 때 애플리케이션 URL이 포함된 Terraform 출력을 보면 완료되었음을 알 수 있습니다.</p>
<p><code v-pre>catapp_url</code> 출력 에서 URL을 클릭하여 새 브라우저 탭에서 웹 애플리케이션을 엽니다.</p>
<div class="hint-container warning">
<p class="hint-container-title">경고</p>
<p>응용 프로그램이 로드되지 않으면 <code v-pre>terraform apply</code> 다시 실행 하십시오. 이렇게 하면 웹 서버를 다시 설치하고 실행 중이 아닌 경우 응용 프로그램을 시작하려고 합니다.</p>
</div>
<h4 id="변경된-사항을-확인하기-위해-그래프를-다시-살펴봅니다" tabindex="-1"><a class="header-anchor" href="#변경된-사항을-확인하기-위해-그래프를-다시-살펴봅니다" aria-hidden="true">#</a> 💻 변경된 사항을 확인하기 위해 그래프를 다시 살펴봅니다.</h4>
<p>terraform graph를 수행합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform graph
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><a href="https://dreampuf.github.io/GraphvizOnline/" target="_blank" rel="noopener noreferrer">https://dreampuf.github.io/GraphvizOnline/<ExternalLinkIcon/></a>에 앞서 digraph로 시작하는 내용을 복사하여 붙여넣고 어떤 그림이 나오는지 확인해 봅니다.</p>
<figure><img src="@source/03-PublicCloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/graphviz-2.svg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>인프라에 대한 Terraform 그래프를 살펴보십시오. 종속성이 자동으로 매핑됩니다.</p>
<p>Terraform은 이 그래프를 사용하여 최대 효율성을 위해 병렬로 구축할 수 있는 리소스를 결정합니다.</p>
<hr>
<h2 id="quiz-time-3-terraform-apply" tabindex="-1"><a class="header-anchor" href="#quiz-time-3-terraform-apply" aria-hidden="true">#</a> 😱 Quiz Time 3. Terraform Apply</h2>
<p>Q. Plan 파일을 지정하지 않고 terraform apply를 실행하면 어떻게 됩니까?</p>
<ul class="task-list-container">
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-0" disabled="disabled"><label class="task-list-item-label" for="task-item-0"> Terraform은 Plan 없이 실행됩니다.</label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-1" disabled="disabled"><label class="task-list-item-label" for="task-item-1"> Terraform은 이전 Plan을 읽고 적용합니다.</label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-2" disabled="disabled"><label class="task-list-item-label" for="task-item-2"> Terraform은 적용 직전에 새로운 Plan을 실행합니다.</label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-3" disabled="disabled"><label class="task-list-item-label" for="task-item-3"> 모두 틀림</label></li>
</ul>
<details class="hint-container details"><summary>답</summary>
<ul class="task-list-container">
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-4" checked="checked" disabled="disabled"><label class="task-list-item-label" for="task-item-4"> Terraform은 적용 직전에 새로운 Plan을 실행합니다.</label></li>
</ul>
</details>
<hr>
<p>이 장에서 우리는 :</p>
<ul>
<li>Terraform 리소스에 대해 배웠습니다.</li>
<li>Terraform Plan, Graph, Apply, Destory</li>
<li>종속성에 대해 배웠습니다.</li>
<li>실습에서 그래프를 확인해보았습니다.</li>
<li><a href="http://main.tf" target="_blank" rel="noopener noreferrer">main.tf<ExternalLinkIcon/></a>, <a href="http://variables.tf" target="_blank" rel="noopener noreferrer">variables.tf<ExternalLinkIcon/></a>, outputs.tf를 살펴보았습니다.</li>
<li>Meow World 애플리케이션을 구축하였습니다.</li>
</ul>
</div></template>


