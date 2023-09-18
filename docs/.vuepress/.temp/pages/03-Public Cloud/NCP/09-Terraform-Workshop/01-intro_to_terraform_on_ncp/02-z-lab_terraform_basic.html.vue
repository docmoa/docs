<template><div><h1 id="lab-setup-and-basic-usage" tabindex="-1"><a class="header-anchor" href="#lab-setup-and-basic-usage" aria-hidden="true">#</a> 💻 Lab - Setup and Basic Usage</h1>
<hr>
<h2 id="🏡-moving-in-explore-your-workspace" tabindex="-1"><a class="header-anchor" href="#🏡-moving-in-explore-your-workspace" aria-hidden="true">#</a> 🏡 Moving in - Explore Your Workspace</h2>
<Presentation id="presentation-7" code="eJxtj8FKw0AQhu95ioFcEx9CxJPSQwTPQSMENJEtoscgK4Sm2BSbtmhSWoiUSg4LNRKhfaGdyTt0UyiFUpjDwPD/3zearutw5TBm3/nsAfDnDaf/lHPAHpdlgZ0BXNo3LcuAc+Y4p9aZAa1Hx9su16536z+3DbD8e5u5bUDRgwvXe3qhUUw8BXot6HNRJ1OgcAw0CalTYhRilJ9ommma2gGdhhUNfxumSuKkK5crkJWQSy5FAJStKeO7KuWHswyI5+qM8ZhGx9uxG+CfGk6ZypUpRcpmPcCPFOr3iuZ9BWiIe4vm7aICKRKaCaj7KpLi9wpoHtBXXCeLHWQDQCinSw==" theme="blood"></Presentation><h3 id="테라폼-설치-및-구성" tabindex="-1"><a class="header-anchor" href="#테라폼-설치-및-구성" aria-hidden="true">#</a> 테라폼 설치 및 구성</h3>
<ol>
<li>
<p>테라폼 다운로드 사이트 <a href="https://www.terraform.io/downloads.html" target="_blank" rel="noopener noreferrer">https://www.terraform.io/downloads.html<ExternalLinkIcon/></a> 로 접속하여, 자신의 환경에 맞는 Terraform을 다운로드 받습니다.</p>
</li>
<li>
<p>압축을 해제하여 terraform 바이너리 파일을 확인합니다.</p>
</li>
</ol>
<ul>
<li>Linux/Mac : <code v-pre>terraform</code></li>
<li>Windows : <code v-pre>terraform.exe</code></li>
</ul>
<ol start="3">
<li>파일을 적절한 위치에 넣고 PATH로 지정합니다.</li>
</ol>
<CodeTabs id="42" :data='[{"id":"bash"},{"id":"zsh"},{"id":"windows"}]' tab-id="shell">
<template #title0="{ value, isActive }">bash</template>
<template #title1="{ value, isActive }">zsh</template>
<template #title2="{ value, isActive }">windows</template>
<template #tab0="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">mkdir</span> ~/hashicorp/bin
<span class="token function">mv</span> terraform ~/hashicorp/bin
<span class="token builtin class-name">cd</span> ~/hashicorp/bin
<span class="token builtin class-name">echo</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span> <span class="token operator">>></span> ~/.bash_profile
<span class="token builtin class-name">source</span> ~/.bash_profile
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></template>
<template #tab1="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">mkdir</span> ~/hashicorp/bin
<span class="token function">mv</span> terraform ~/hashicorp/bin
<span class="token builtin class-name">cd</span> ~/hashicorp/bin
<span class="token builtin class-name">echo</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">pwd</span><span class="token variable">)</span></span> <span class="token operator">>></span> ~/.zshrc
<span class="token builtin class-name">source</span> ~/.zshrc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></template>
<template #tab2="{ value, isActive }">
</template>
</CodeTabs>
<h3 id="편집기-구성" tabindex="-1"><a class="header-anchor" href="#편집기-구성" aria-hidden="true">#</a> 편집기 구성</h3>
<p>VSCode 편집기를 사용할 준비가 되었다면, 코드의 시인성을 위해 extension을 설치 합니다.</p>
<Tabs id="85" :data='[]'>
</Tabs>
<h3 id="실습을-위한-코드-받기" tabindex="-1"><a class="header-anchor" href="#실습을-위한-코드-받기" aria-hidden="true">#</a> 실습을 위한 코드 받기</h3>
<p>이 실습에서는 Terraform을 실행하기 위한 IDE 설정과 Terraform CLI를 사용하고, NCP를 위한 기본 구성을 수행합니다.</p>
<p>실습에서 사용할 코드는 github에서 받습니다.</p>
<p>링크 : <a href="https://github.com/ncp-hc/workshop-oss" target="_blank" rel="noopener noreferrer">https://github.com/ncp-hc/workshop-oss<ExternalLinkIcon/></a></p>
<figure><img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab1-01.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<ul>
<li>
<p>git 이 설치되어있는 경우 <code v-pre>git clone</code>을 통해 코드를 받습니다.<br>
<code v-pre>$ git clone https://github.com/ncp-hc/workshop-oss.git</code></p>
</li>
<li>
<p>Download만을 원하는 경우 아래 <code v-pre>Download ZIP</code>을 선택합니다.</p>
</li>
</ul>
<h3 id="편집기에서-열기" tabindex="-1"><a class="header-anchor" href="#편집기에서-열기" aria-hidden="true">#</a> 편집기에서 열기</h3>
<figure><img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab1-02.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<ul>
<li>VSCode를 실행하고 File(파일) 메뉴에서 <code v-pre>Open Folder...</code> 를 클릭합니다.</li>
<li>앞서 받은 디렉토리내의 <code v-pre>lab01</code>을 열어줍니다.</li>
</ul>
<hr>
<h2 id="👋-getting-to-know-terraform" tabindex="-1"><a class="header-anchor" href="#👋-getting-to-know-terraform" aria-hidden="true">#</a> 👋 Getting to Know Terraform</h2>
<Presentation id="presentation-161" code="eJxtkl9r02AUxu/7KQ701ib3IoJXeiEoOPA6tHUNtElJIxWvWpeWLslFp0mNNSkRgmukQrZmM4X5hXLO+x32Jt1Wtu7u/Xee8zvP81aq1SocNDVN+qBqHSAvYs4EaGyTGaHpAC5iNj4D9KbFLk8GdDQE+mmz4Yq/YCObgpRGHn2fkuEDWhHNU/zl4zefufx0BWRFbHbM3BBo4gEtJqXqnxGGG4oMoOCE5jEwx+BV+b8MF0tajNCacCmhUqnVapUS8aXK73n5CRlnOOXKE/KvME6gI9XfvHsCr2Xl46dbzPey0lD7vRuoLQFO433VZy1d7/aeimK/3xf0WxcEWRV5vdJWpUZPaOmd9nO40WLu39KAC5+sEPDcoNCgwNs5SIHxwIW7wcm82CfAUcbMDC+H3Ef8wt89Zu19eTIi2njc3jKR8yMKBkDH/3fy8FnuArN5/dU+jpevOZHr0qVbXLKvg+Lg7YuDV8UcNEvR8YqYeVdMkm2jPEvw1ObDexin8KiTaC3ztYFrjnc6oM2yhApSYKbPxiH+XtGshGE/eNus+BtGRnNH2EXQbkqaIrSkXkuuq1pXqKsd8S4S8bCp67JyWOvpkqY3G6Ks8FW7vU2ncg1CTYRx" theme="blood"></Presentation><p>편집기가 준비가 되었으면 터미널을 열고 몇가지 기본적인 Terraform 명령을 수행합니다.</p>
<ul>
<li>
<p>Linux/Mac의 경우 <code v-pre>터미널</code>에서 수행하거나 Windows의 경우 <code v-pre>명령 프롬프트</code>에서 실행하게 됩니다.</p>
</li>
<li>
<p>VSCode 편집기를 사용하게 되면, 편집기의 터미널(Terminal) 기능으로 함께 사용할 수 있습니다.<br>
<img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab1-06.png" alt="" loading="lazy"></p>
</li>
</ul>
<h4 id="컴퓨터에서-terraform의-버전을-확인-하세요" tabindex="-1"><a class="header-anchor" href="#컴퓨터에서-terraform의-버전을-확인-하세요" aria-hidden="true">#</a> 💻 컴퓨터에서 Terraform의 버전을 확인 하세요.</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="명령-구문이-궁금하면-언제든지-도움을-받을-수-있습니다" tabindex="-1"><a class="header-anchor" href="#명령-구문이-궁금하면-언제든지-도움을-받을-수-있습니다" aria-hidden="true">#</a> 💻 명령 구문이 궁금하면 언제든지 도움을 받을 수 있습니다.</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform <span class="token builtin class-name">help</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><hr>
<h2 id="🔐-terraform을-ncp에-연결하기" tabindex="-1"><a class="header-anchor" href="#🔐-terraform을-ncp에-연결하기" aria-hidden="true">#</a> 🔐 Terraform을 NCP에 연결하기</h2>
<Presentation id="presentation-189" code="eJzjUlZWVvBw9nkzdwuYqeSRWJyR6ZxfVKDgnJ+XlpleWpRYkpmfp+CTmJdempieqgRW9mbuDIU3U/e+mTfh9dw9r7umKLza1PxmbgtQrOfV5gUKrza3vOle8GpDw5tZU+y5AI9/LcA=" theme="blood"></Presentation><h3 id="ncp-자격증명-받기" tabindex="-1"><a class="header-anchor" href="#ncp-자격증명-받기" aria-hidden="true">#</a> NCP 자격증명 받기</h3>
<p>NCP에 인증하고 리소스를 빌드하기 위해 Terraform은 적절한 자격 증명 세트를 제공하도록 요구합니다.</p>
<h4 id="terraform에서-사용할-ncp의-자격증명을-얻기위해-다음-단계를-수행합니다" tabindex="-1"><a class="header-anchor" href="#terraform에서-사용할-ncp의-자격증명을-얻기위해-다음-단계를-수행합니다" aria-hidden="true">#</a> 💻 Terraform에서 사용할 NCP의 자격증명을 얻기위해 다음 단계를 수행합니다.</h4>
<Tabs id="199" :data='[]'>
</Tabs>
<h3 id="ncp-자격증명-환경변수로-저장하기" tabindex="-1"><a class="header-anchor" href="#ncp-자격증명-환경변수로-저장하기" aria-hidden="true">#</a> NCP 자격증명 환경변수로 저장하기</h3>
<p>이 교육 환경을 위해 NCP의 자격 증명을 준비하여 환경 변수로 저장합니다. Terraform은 쉘 환경에 구성된 환경 변수를 자동으로 읽고 사용합니다.</p>
<h4 id="터미널에서-다음-명령을-실행합니다" tabindex="-1"><a class="header-anchor" href="#터미널에서-다음-명령을-실행합니다" aria-hidden="true">#</a> 💻 터미널에서 다음 명령을 실행합니다.</h4>
<ul>
<li><code v-pre>NCLOUD_ACCESS_KEY</code> <code v-pre>NCLOUD_SECRET_KEY</code> <code v-pre>NCLOUD_REGION</code> 를 환경변수로 등록합니다.</li>
</ul>
<CodeTabs id="252" :data='[{"id":"bash"},{"id":"CMD(Win)"},{"id":"Powershell(Win)"}]' tab-id="shell">
<template #title0="{ value, isActive }">bash</template>
<template #title1="{ value, isActive }">CMD(Win)</template>
<template #title2="{ value, isActive }">Powershell(Win)</template>
<template #tab0="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">NCLOUD_ACCESS_KEY</span><span class="token operator">=</span><span class="token string">"XXXXXXXXXXXXX"</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">NCLOUD_SECRET_KEY</span><span class="token operator">=</span><span class="token string">"XXXXXXXXXXXXXXXXXXXXXXXXXX"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></template>
<template #tab1="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">set</span> <span class="token assign-left variable">NCLOUD_ACCESS_KEY</span><span class="token operator">=</span><span class="token string">"XXXXXXXXXXXXX"</span>
<span class="token builtin class-name">set</span> <span class="token assign-left variable">NCLOUD_SECRET_KEY</span><span class="token operator">=</span><span class="token string">"XXXXXXXXXXXXXXXXXXXXXXXXXX"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></template>
<template #tab2="{ value, isActive }">
<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre v-pre class="language-powershell"><code><span class="token variable">$Env</span>:NCLOUD_ACCESS_KEY=<span class="token string">"XXXXXXXXXXXXX"</span>
<span class="token variable">$Env</span>:NCLOUD_SECRET_KEY=<span class="token string">"XXXXXXXXXXXXXXXXXXXXXXXXXX"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></template>
</CodeTabs>
<div class="hint-container danger">
<p class="hint-container-title">위험</p>
<p>API 자격증명정보는 실수로 공개된 저장소에 노출되거나 복사되면 위헐합니다.<br>
자격증명(API 인증키)를 코드에 저장하지 않는 것을 권장합니다.</p>
</div>
<hr>
<h2 id="👨‍💻-terraform-코드는-어떻게-생겼나요" tabindex="-1"><a class="header-anchor" href="#👨‍💻-terraform-코드는-어떻게-생겼나요" aria-hidden="true">#</a> 👨‍💻 Terraform 코드는 어떻게 생겼나요?</h2>
<Presentation id="presentation-272" code="eJxlkM1Kw0AUhfd5igvdie3TCC7NtKZQbJuSpK6tBoltwUBSO0JSI1axkkUUixHSF8q9eQdnEn8CLu/M3PN9Z5RGowEHmmGwrm4MKDyDgtu0igF9H6Or4jLCp5iWLtkBqHstq6sCchenfjWdMsMUJ/cB4CTEcy4v8OUZvQjytwsKbaBwR9MtzhycrVuK0mw2lZJJYYYJp2hCQSb3fx3gUDdOzBHraCVlwHpDid0HVcB6rN3XzO9ZH1ujsVVOUMznMlEE5duY7Fd0N/+Zfwza+egF+JgJ242UWLqicYJhVk/6SPHhs7j1i0UE5HC8FnVWTq0OcafM8NZ08/5TXKyKbMAkxbtE/ltlVGOqfZ0dH7VZnw07mlH6S4HqXbHgeZooXzaz2rY=" theme="blood"></Presentation><p>코드 편집기의 파일 목록이 보이십니까?<br>
<img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab1-10.png" alt="" loading="lazy"></p>
<p>Terraform 코드는 항상 <code v-pre>.tf</code> 확장자로 끝납니다. 원하는 만큼 Terraform 파일을 가질 수 있지만 일반적으로 다음 세 가지를 구성합니다.</p>
<ul>
<li><code v-pre>main.tf</code> - 대부분의 Terraform 코드가 저장되는 위치입니다. 이것은 자원을 구축하는 부분입니다.</li>
<li><code v-pre>variables.tf</code> - 이 파일을 사용하여 사용자가 사용할 수 있는 변수를 정의합니다.</li>
<li><code v-pre>output.tf</code> - 이 파일에는 성공적인 Terraform 실행이 끝날 때 표시될 출력이 포함되어 있습니다.</li>
</ul>
<p>Terraform에서 <code v-pre>*.tf</code>와 <code v-pre>*.tfvars</code>로 끝나지 않는 파일은 무시됩니다.</p>
<hr>
<h2 id="🏡-terraform-init-provider-설치" tabindex="-1"><a class="header-anchor" href="#🏡-terraform-init-provider-설치" aria-hidden="true">#</a> 🏡 Terraform Init - Provider 설치</h2>
<Presentation id="presentation-303" code="eJx9kc1OwlAQhfc8xSRsdAHsjTExrty58AFQqUqillyqxl3VqrWYiLGVii2pEUQIi8pP7IL4QJ3pOzglFnDj7t6Zued8c24qnU7DpiTE1q4sDmFNFhJEpoavTvgVYOODXBX4BNSoUn/IZTTMuICVJrVVIMejeiey7MnFMsgYYUXnZjaVymQyqb/ysVh0PkR3THUfHx1Y3VinZ65dj6jiRZYHpNtspeM9E7iwIeSTYkESC+FgFAa3zLAI5NrAbXpRyR1CZGlUNyOr859rrRpDszT6nxD6zkSC+Z8eIsuZmoQ+b9DQZxsA1Xph4PNz0mZjgN0Os5GrAfnfZGk4GCfYc9sv7ytKqbyUywlpr1hWxFlWSXiyRTm3LeTTspQr/YqWV+bAyW6iwXoc0XsvJsfuDWOrccSsja1gCoMt9r7oTb7Ag7B/yZnwGLbvgN44ZHM2yTr5o50D+biQh8SWma8S4B+YCxRl" theme="blood"></Presentation><p>우리는 이 실습에서 사용할 Terraform 코드를 다운로드 했습니다. 나머지 실습에서 이 소스코드를 사용할 것입니다.</p>
<p>Terraform으로 무엇이든 하기 전에 Workspace를 초기화 해야 합니다.</p>
<h4 id="터미널에서-init-명령을-수행합니다" tabindex="-1"><a class="header-anchor" href="#터미널에서-init-명령을-수행합니다" aria-hidden="true">#</a> 💻 터미널에서 <code v-pre>init</code> 명령을 수행합니다.</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform init

<span class="token punctuation">..</span>.
Terraform has been successfully initialized<span class="token operator">!</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>`terraform init 명령은 Terraform 코드를 스캔하고 필요한 Provider를 식별하고 다운로드합니다.</p>
<h4 id="ncloud-provider가-terraform-디렉토리에-설치되었는지-확인합니다" tabindex="-1"><a class="header-anchor" href="#ncloud-provider가-terraform-디렉토리에-설치되었는지-확인합니다" aria-hidden="true">#</a> 💻 ncloud provider가 <code v-pre>.terraform</code> 디렉토리에 설치되었는지 확인합니다.</h4>
<CodeTabs id="320" :data='[{"id":"Linux/Mac"},{"id":"Windows"},{"id":"Code Editor"}]' tab-id="shell">
<template #title0="{ value, isActive }">Linux/Mac</template>
<template #title1="{ value, isActive }">Windows</template>
<template #title2="{ value, isActive }">Code Editor</template>
<template #tab0="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">ls</span> .terraform/providers/registry.terraform.io/navercloudplatform
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></template>
<template #tab1="{ value, isActive }">
<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre v-pre class="language-powershell"><code><span class="token function">dir</span> <span class="token punctuation">.</span>terraform/providers/registry<span class="token punctuation">.</span>terraform<span class="token punctuation">.</span>io/navercloudplatform
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></template>
<template #tab2="{ value, isActive }">
</template>
</CodeTabs>
<p>이 숨겨진 디렉토리는 모든 모듈과 플러그인이 저장되는 곳입니다.</p>
<h2 id="quiz-time-1-provider와-module" tabindex="-1"><a class="header-anchor" href="#quiz-time-1-provider와-module" aria-hidden="true">#</a> 😱 Quiz Time 1. Provider와 Module</h2>
<p>Q. Terraform은 모듈과 공급자를 어디에 저장합니까?</p>
<ul class="task-list-container">
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-0" disabled="disabled"><label class="task-list-item-label" for="task-item-0"> /tmp 디렉토리에</label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-1" disabled="disabled"><label class="task-list-item-label" for="task-item-1"> 사용자의 홈 디렉토리에</label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-2" disabled="disabled"><label class="task-list-item-label" for="task-item-2"> .terraform 디렉토리에</label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-3" disabled="disabled"><label class="task-list-item-label" for="task-item-3"> 모두 아님</label></li>
</ul>
<details class="hint-container details"><summary>답</summary>
<ul class="task-list-container">
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-4" checked="checked" disabled="disabled"><label class="task-list-item-label" for="task-item-4"> .terraform 디렉토리에</label></li>
</ul>
</details>
<hr>
<h2 id="👩‍⚖️-terraform-validate-코드-테스트" tabindex="-1"><a class="header-anchor" href="#👩‍⚖️-terraform-validate-코드-테스트" aria-hidden="true">#</a> 👩‍⚖️ Terraform Validate - 코드 테스트</h2>
<Presentation id="presentation-384" code="eJzjUlZWVghJLSpKTMsvyn0zfcLrrikKr7aueb1mh8KrTQ1vmta82rHh1YYGhddNW97MW/p6wow307YovJnX8aZr6+vujtfdS/S4uHR1dbnABiWUwExSKEvMyUxJLElNUHi9qvX1gp1v5ux5vXCOwpvuJW+ndb6dukDhTccMNHMAKA5Kmg==" theme="blood"></Presentation><p>Terraform에는 <code v-pre>validate</code> 라는 하위 명령이 내장되어 있습니다. 이것은 코드가 올바르게 구문 분석되는지 확인하기 위해 코드의 빠른 구문 검사를 수행하려는 경우에 유용합니다.</p>
<h4 id="main-tf-파일을-편집합니다" tabindex="-1"><a class="header-anchor" href="#main-tf-파일을-편집합니다" aria-hidden="true">#</a> 💻 <a href="http://main.tf" target="_blank" rel="noopener noreferrer">main.tf<ExternalLinkIcon/></a> 파일을 편집합니다.</h4>
<p><code v-pre>main.tf</code> 16번째 행의 사이에 큰 따옴표를 제거 <code v-pre>ncloud_vpc</code>와 <code v-pre>hashicat</code> 사이의 큰 따옴표를 제거하고 저장합니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code><span class="token keyword">terraform</span> <span class="token punctuation">{</span>
  <span class="token keyword">required_providers</span> <span class="token punctuation">{</span>
    <span class="token property">ncloud</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"NaverCloudPlatform/ncloud"</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">">= 2.1.2"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">provider<span class="token type variable"> "ncloud" </span></span><span class="token punctuation">{</span>
  <span class="token property">region</span>      <span class="token punctuation">=</span> var.region
  <span class="token property">site</span>        <span class="token punctuation">=</span> var.site
  <span class="token property">support_vpc</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"ncloud_vpc"</span></span> <span class="token string">"hashicat"</span> <span class="token punctuation">{</span> → resource <span class="token string">"ncloud_vpc"</span> hashicat<span class="token string">" {
  ipv4_cidr_block = "</span><span class="token number">10.0</span>.<span class="token number">0.0</span>/<span class="token number">16</span><span class="token string">"
  name            = lower("</span>$<span class="token punctuation">{</span>var.prefix<span class="token punctuation">}</span>-vpc-$<span class="token punctuation">{</span>var.region<span class="token punctuation">}</span>")
<span class="token punctuation">}</span>

...생략...
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>terraform validate</code> 명령을 터미널에서 실행합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform validate
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>다시 따옴표 표기를 넣고 저장한 다음 <code v-pre>terraform validate</code> 명령을 실행합니다. 이번에는 검증을 통과해야 합니다.</p>
<p><code v-pre>terraform validate</code> 명령은 자동화된 CI/CD 테스트 파이프라인에서 가장 자주 사용됩니다. 다른 단계를 수행하기 전에 코드에서 오류를 빠르게 포착할 수 있습니다.</p>
<hr>
<h2 id="🤔-terraform-plan-dry-run-mode" tabindex="-1"><a class="header-anchor" href="#🤔-terraform-plan-dry-run-mode" aria-hidden="true">#</a> 🤔 Terraform Plan - Dry run mode</h2>
<Presentation id="presentation-409" code="eJxtjk2KwkAQhfc5RUHWmTPpYmY1f4Q5QDM02iQRA9rYYloiiCAoNjFChHihVPUdrGTt8r16xfcFYRjC6O89jscfP/EX/H6Ov0dkJfjJzesa/Np01YNWOWAmvC4Ar4ILoP+T1+d+SFpRKYeTO2KlqWhxx+HS4OHE8xZIGaCtouSGqcJ0/xYEURQFA5psjeW0qzLw2uCxHopLA3jPcFFgXoDfyM4Jxsj+27aMcX7OdNM1Dhjdy5FRnOjOIJ2QFS80U4tX1jSYLAFnDnAuaSMYB5iXLxyfG36oPA==" theme="blood"></Presentation><h4 id="terraform-plan명령을-실행합니다" tabindex="-1"><a class="header-anchor" href="#terraform-plan명령을-실행합니다" aria-hidden="true">#</a> 💻 <code v-pre>terraform plan</code>명령을 실행합니다.</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code>$ terraform plan
var.prefix
  This prefix will be included <span class="token keyword">in</span> the name of <span class="token function">most</span> resources.

  Enter a value:
</code></pre><div class="highlight-lines"><div class="highlight-line">&nbsp;</div><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이 명령을 실행하면 Terraform에서 <code v-pre>prefix</code>변수 를 입력하라는 메시지를 표시 합니다.</p>
<p>소문자 또는 숫자의 짧은 문자열을 입력합니다. 영문 이니셜 소문자를 사용하는 것이 좋습니다.</p>
<p><code v-pre>prefix</code>는 현재 Terraform 코드 구성에서 VPC, 서브넷, 서버 등의 리소스 이름의 일부가 됩니다.</p>
<h2 id="🎛️-terraform-변수로-작업하기" tabindex="-1"><a class="header-anchor" href="#🎛️-terraform-변수로-작업하기" aria-hidden="true">#</a> 🎛️ Terraform 변수로 작업하기</h2>
<Presentation id="presentation-426" code="eJwBaQCW/wojIyMgYHRlcnJhZm9ybS50ZnZhcnNgIO2MjOydvOydgCDsgqzsmqnsnpDqsIAg67OA7IiY66W8IOq1rOyEse2VoCDsiJgg7J6I64qUIO2OuOumrO2VnCDsnITsuZjsnoXri4jri6QuCnBcPBs=" theme="blood"></Presentation><p>Terraform에서 모든 변수는 사용하기 전에 선언되어야 합니다. 변수는 다른 <code v-pre>*.tf</code> 파일에서도 선언될 수 있지만 일반적으로 <code v-pre>variables.tf</code> 파일에서 선언됩니다. (default)</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "address_space" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"The address space that is used by the virtual network. You can supply more than one address space. Changing this forces a new resource to be created."</span>
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"10.0.0.0/8"</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><div class="highlight-line">&nbsp;</div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>해당 값은 <code v-pre>terraform.tfvars</code> 파일 및 나중에 다른 방법으로 설정할 수 있습니다.</p>
<h4 id="terraform-tfvars-파일을-수정합니다" tabindex="-1"><a class="header-anchor" href="#terraform-tfvars-파일을-수정합니다" aria-hidden="true">#</a> 💻 <code v-pre>terraform.tfvars</code> 파일을 수정합니다.</h4>
<p><code v-pre>terraform.tfvars</code> 파일을 열고 <code v-pre>prefix</code>의 줄 시작 부분에 주석 기호 <code v-pre>#</code> 를 제거합니다.</p>
<p><code v-pre>yourname</code>을 원하는 소문자 또는 숫자의 짧은 문자열을 입력합니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># terraform.tfvars</span>
<span class="token property">prefix</span> <span class="token punctuation">=</span> <span class="token string">"yourname"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>이제 <code v-pre>terraform plan</code>을 다시 실행 합니다. 이번에는 <code v-pre>prefix</code>를 수동으로 입력할 필요가 없습니다.</p>
<h2 id="🗼-cidr-block-변경" tabindex="-1"><a class="header-anchor" href="#🗼-cidr-block-변경" aria-hidden="true">#</a> 🗼 cidr_block 변경</h2>
<Presentation id="presentation-450" code="eJxVjskKgmAUhfc+xQXX9kzaBEED2LB2ISEqJJTowj9c2IgLaYACn6h7fId+lRbBXZ1z+O6nqKpKnyKRB/GCsEhfDEzTGM7MSWcxXBnmXKfK9yFKRAHBzpCGVRgjykmX7cjojgdzufxbpSFEzEFCfD3zNiW+W3BiPpSEfd62VZiSzGTgwH2y57CXdRRF0zSlcYJ48M0heJmsJRR2wu6Opr3xbNknPuZY+3CzmslFUW1yKVUPkNh4t69OVuN6+cG/M02G1A==" theme="blood"></Presentation><p>이전 실습에서 <code v-pre>prefix</code>를 <code v-pre>terraform.tfvars</code> 파일에서 변수를 설정했습니다. ncloud 인프라가 배포될 vpc의 cidr를 결정할 또 다른 변수를 설정해 보겠습니다.</p>
<p>먼저 다른 계획을 실행하여 위치를 변경한 후 어떻게 되는지 비교할 수 있습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform plan
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="기본-address-space-정보를-수정합니다" tabindex="-1"><a class="header-anchor" href="#기본-address-space-정보를-수정합니다" aria-hidden="true">#</a> 💻 기본 <code v-pre>address_space</code> 정보를 수정합니다.</h4>
<p>default로 선언되어있는 값 외에 사용자 지정 변수로 변경해봅니다. <code v-pre>terraform.tfvars</code>파일을 열어 <code v-pre>address_space</code>을 추가하고 다시 <code v-pre>terraform plan</code>을 실행해 봅니다. 이번엔 무엇이 다른가요?</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># terraform.tfvars</span>
<span class="token property">prefix</span>        <span class="token punctuation">=</span> <span class="token string">"yourname"</span>
<span class="token property">address_space</span> <span class="token punctuation">=</span> <span class="token string">"10.0.0.0/16"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>terraform.tfvars</code> 파일은 <code v-pre>variables.tf</code> 파일에 선언된 모든 변수에 대한 값을 설정할 수 있음을 기억하십시오.</p>
<hr>
<h2 id="quiz-time-2-variables" tabindex="-1"><a class="header-anchor" href="#quiz-time-2-variables" aria-hidden="true">#</a> 😱 Quiz Time 2. Variables</h2>
<p>Q. Terraform 변수는 일반적으로 어디에 선언 됩니까?</p>
<ul class="task-list-container">
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-5" disabled="disabled"><label class="task-list-item-label" for="task-item-5"> 명령줄에서</label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-6" disabled="disabled"><label class="task-list-item-label" for="task-item-6"> 환경 변수로</label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-7" disabled="disabled"><label class="task-list-item-label" for="task-item-7"> <a href="http://variable.tf" target="_blank" rel="noopener noreferrer">variable.tf<ExternalLinkIcon/></a> 파일에서</label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-8" disabled="disabled"><label class="task-list-item-label" for="task-item-8"> terraform.tfvars 파일에서</label></li>
</ul>
<details class="hint-container details"><summary>답</summary>
<ul class="task-list-container">
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-9" checked="checked" disabled="disabled"><label class="task-list-item-label" for="task-item-9"> <a href="http://variable.tf" target="_blank" rel="noopener noreferrer">variable.tf<ExternalLinkIcon/></a> 파일에서</label></li>
</ul>
</details>
<hr>
<p>이 장에서 우리는 :</p>
<ul>
<li>terraform init 명령을 확인했습니다.</li>
<li>terraform plan 명령을 확인했습니다.</li>
<li>변수에 대해 배웠습니다.</li>
<li>prefix(접두사) 설정을 했습니다.</li>
</ul>
</div></template>


