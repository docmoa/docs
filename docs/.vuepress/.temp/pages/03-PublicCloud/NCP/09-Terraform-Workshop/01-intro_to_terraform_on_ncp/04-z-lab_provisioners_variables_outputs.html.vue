<template><div><h1 id="lab-provisioners-variables-outputs" tabindex="-1"><a class="header-anchor" href="#lab-provisioners-variables-outputs" aria-hidden="true">#</a> 💻 Lab - Provisioners, Variables, Outputs</h1>
<h3 id="편집기에서-열기" tabindex="-1"><a class="header-anchor" href="#편집기에서-열기" aria-hidden="true">#</a> 편집기에서 열기</h3>
<figure><img src="@source/03-PublicCloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab1-02.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<ul>
<li>VSCode를 실행하고 File(파일) 메뉴에서 <code v-pre>Open Folder...</code> 를 클릭합니다.</li>
<li>앞서 실습을 진행한 <code v-pre>lab02</code>을 열어줍니다.</li>
</ul>
<hr>
<h2 id="🛠️-use-a-provisioner" tabindex="-1"><a class="header-anchor" href="#🛠️-use-a-provisioner" aria-hidden="true">#</a> 🛠️ Use a Provisioner</h2>
<Presentation id="presentation-25" code="eJx9Ustu01AQ3d+vGJRNvEj4AcqGX2AZ1U7AtJESHDkpFSJIDjFg4iC6qJsUHHCkViUoC5OkUiqVH/Kd+w/MuG7dSmmPZPtqzjzOGV9RKBTguWnb1VeW3QR16MppKC9cjBzpT0B+c5PzuRwcAvYn6P4F9ENQQQhy4dH5RB19kQcz6XvSPykLUSqVRNpRDS7k0uVE7PfU8QwnLmAU4vFaBeNkGXFH9cPFT18p3MPvMxwdoEvZWcsxnjmAwQAH51lzKOJkxTyF+L0Yy1+X5XJZuzXV6NwYqbZajbcGyNNLwJ8fZXSqgghkMJRn3O0en0nsQBIHJJTIXAuRcko5fz4T67CyW/amMUYB21NHXq5WCFLLJuXSSRb/7g7nJv0eyN9r9KO0dDhMVqurzQBl8JKv9k2xbBNM3fN32OOHOS2Rs0dzwFFMSngmemOy72UGeMA6BgxT5cmiz5u51msYxu6LhujY9Z0d027DFrwTQKjt1Rsv9dd7zZppU7BTb5rtTrXZKmriPRdl66dTrdreFfpGiCfwzNpvQ8N6Y+a37RE8FUDVG5COTlGhZ1vXt/MIh4qWpVWum+cMoajrGtcwtMrjyl2W0e3yhH3obqKyj9h6CKnv/1FwgQc=" theme="blood"></Presentation><h4 id="provisioner를-수정합니다" tabindex="-1"><a class="header-anchor" href="#provisioner를-수정합니다" aria-hidden="true">#</a> 💻 Provisioner를 수정합니다.</h4>
<p><code v-pre>main.tf</code> 파일을 열어 <code v-pre>remote-exec</code> 항목이 있는 곳으로 이동합니다.</p>
<p><code v-pre>inline</code> 항목에 다음을 두줄 추가합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token string">"sudo apt -y install cowsay"</span>,
<span class="token string">"cowsay Mooooooooooo!"</span>,
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p><code v-pre>terraform fmt</code>명령을 사용하여 코드를 멋지게 정렬 할 수 있는 좋은 시간 입니다.</p>
</div>
<p>이제 변경 사항을 적용하십시오.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform apply -auto-approve
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>로그 출력을 뒤로 스크롤합니다. &quot;Moooooooo!&quot;라고 말하는 ASCII 아트 암소가 보일 것입니다.</p>
<details class="hint-container details"><summary>Result example</summary>
<figure><img src="@source/03-PublicCloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/lab4-01.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</details>
<hr>
<h2 id="🖨️-add-an-output" tabindex="-1"><a class="header-anchor" href="#🖨️-add-an-output" aria-hidden="true">#</a> 🖨️ Add an Output</h2>
<Presentation id="presentation-57" code="eJxtkM1OwlAQhfd9iklY4xMYn8K9uChxg5gKe35Kgi1EErlQTEvuokQwLBpaSY31hTpz38G55TeR1c3cmTlzvmOUSiWgrY9yQdMR2T7cmpZ1X61bNcBhREGi7IhmLVBimf94QEGGkQeqNyQnVE6KiwyUlymxUkIC9Xli3ifnC90+uuGVsZcOWkBuqCYvLAjYDrAjAcUAqLOm9xXNR3w833DtS66V8IGkwDjR8iRtdNdKeOiMtaf90uV7RrlcNgqoSuMIYplVy3x+qAB+9lB+F266bdX1QQ0GTESBzWCpGtvIxXSkNfWxXTePM8DXWZ5GajZm0COaRjkJHva1ZYxb+eaXLdMHd4Rz0eAp6ENINvAIuT7vJ3nMeO62+NRBTVKSPr5JrXiGVm82npqNExmDFDlfTgfdJQOd3+OIZYir5L8mXO/eu8f7mnlTOZc+RvAHPVNNHQ==" theme="blood"></Presentation><h4 id="output을-수정합니다" tabindex="-1"><a class="header-anchor" href="#output을-수정합니다" aria-hidden="true">#</a> 💻 Output을 수정합니다.</h4>
<p><code v-pre>output.tf</code> 파일을 열어 아래 항목을 추가합니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">output<span class="token type variable"> "ssh_info" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> nonsensitive(<span class="token string">"sshpass -p '<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">data</span><span class="token punctuation">.</span><span class="token type variable">ncloud_root_password</span><span class="token punctuation">.</span>hashicat<span class="token punctuation">.</span>root_password<span class="token punctuation">}</span></span>' ssh root@<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>ncloud_public_ip<span class="token punctuation">.</span>hashicat<span class="token punctuation">.</span>public_ip<span class="token punctuation">}</span></span> -oStrictHostKeyChecking=no"</span>)
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>해당 output의 이름은 <code v-pre>ssh_info</code> 입니다.</p>
<p>어떤 유형의 출력이 유효한지 보려면 문서 페이지를 참조하세요.</p>
<ul>
<li>ncloud_root_password : <a href="https://registry.terraform.io/providers/NaverCloudPlatform/ncloud/latest/docs/data-sources/root_password#argument-reference" target="_blank" rel="noopener noreferrer">https://registry.terraform.io/providers/NaverCloudPlatform/ncloud/latest/docs/data-sources/root_password#argument-reference<ExternalLinkIcon/></a></li>
<li>ncloud_public_ip :<a href="https://registry.terraform.io/providers/NaverCloudPlatform/ncloud/latest/docs/resources/public_ip#attributes-reference" target="_blank" rel="noopener noreferrer">https://registry.terraform.io/providers/NaverCloudPlatform/ncloud/latest/docs/resources/public_ip#attributes-reference<ExternalLinkIcon/></a></li>
</ul>
<p><code v-pre>output.tf</code>에 새로운 내용을 저장하고 <code v-pre>terraform refresh</code> 명령을 실행하여 새로운 출력을 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform refresh
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code v-pre>terraform output</code> 명령을 실행하여 모든 출력을 볼 수도 있습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform output
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><hr>
<h2 id="🐶-fun-with-variables" tabindex="-1"><a class="header-anchor" href="#🐶-fun-with-variables" aria-hidden="true">#</a> 🐶 Fun With Variables</h2>
<Presentation id="presentation-95" code="eJxNUVFq20AQ/d9TDPhbC2nrn0Jv0QNElmVXRIqC4tT0bykKKLIhpVitYiSjgkJIcalq160CyYW0oztkVpES/+282ffevBnW6/Xgvel5+sj1HJBbgUGM37/IcAH9qhB4I0AhucA0BlwW6GcEJJj41AVcBRju5CyQs5zDwTvcJdU2g756YCbesgMO8ue5zO4w96FezOUqrv6XoO2hGOakhnex/JEAzvL62wV7xaHardH/A/V8juk9ESbdkHwy+qh7p22HZgX0c8wi9ppDfRVXm4c2BpHwIm6xZvz0Xv4T7A2Jl4Xclp2HBiRo6QPbPCVx9fOpXxVfWZ8Dfl7j8hZXZBTE8vKKUtPs10r+RpBxHcXNmqIQUwHKa1m8kGjAajNvOZhS3uUCN7/q6LZdG2OaprHmEFRiSqkEHJ7YumF+cO2h6R22eZ72k8hLv47UESjQKlCHIpq8Lqlay99liyn/9G8dUn3eGWnQqA7dMT82J105MHWPG65D9XQ65SPLtp0z2vWnPbD5aOhjs8WeiUNuKSHb9UxnZFvGUSc10A332HGNo7OTfY7ljJvyEU+ASIQ=" theme="blood"></Presentation><h4 id="변수를-조정합니다" tabindex="-1"><a class="header-anchor" href="#변수를-조정합니다" aria-hidden="true">#</a> 💻 변수를 조정합니다.</h4>
<p>Terraform 변수를 구성하는 방법에는 여러 가지가 있습니다. 지금까지 <code v-pre>terraform.tfvars</code> 파일을 사용하여 변수를 설정했습니다.</p>
<p>명령줄에서 기본값과 다른 <code v-pre>height</code>, <code v-pre>width</code> 변수를 사용 하여 애플리케이션을 다시 배포해 보십시오.</p>
<p>변경 사항을 관찰하기 위해 적용할 때마다 웹 앱을 다시 로드합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform apply -auto-approve <span class="token parameter variable">-var</span> <span class="token assign-left variable">height</span><span class="token operator">=</span><span class="token number">600</span> <span class="token parameter variable">-var</span> <span class="token assign-left variable">width</span><span class="token operator">=</span><span class="token number">800</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>다음으로 Terraform이 읽을 수 있는 환경 변수를 설정해 보십시오. 다음 명령을 실행하여 <code v-pre>placeholder</code> 변수를 설정합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">TF_VAR_placeholder</span><span class="token operator">=</span>placedog.net
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>환경 변수 적용 후 <code v-pre>terraform apply -auto-approve</code>를 실행하여 다시 적용해 봅니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform apply -auto-approve
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>이제 명령줄에서 동일한 변수를 다르게 설정하여 다시 시도하십시오.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>terraform apply -auto-approve <span class="token parameter variable">-var</span> <span class="token assign-left variable">placeholder</span><span class="token operator">=</span>placebear.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>어떤 변수가 우선시 되었습니까? 잘 이해 되셨나요?</p>
<p>다음 <a href="https://www.terraform.io/docs/language/values/variables.html#variable-definition-precedence" target="_blank" rel="noopener noreferrer">공식문서<ExternalLinkIcon/></a>를 참고할 수 있습니다.</p>
<hr>
<h2 id="quiz-time-4-terraform-variables" tabindex="-1"><a class="header-anchor" href="#quiz-time-4-terraform-variables" aria-hidden="true">#</a> 😱 Quiz Time 4. Terraform Variables</h2>
<p>Q. <code v-pre>*.tfvars</code> 파일과 환경 변수에 동일한 변수가 설정되어 있습니다. 어느 것이 우선합니까?</p>
<ul class="task-list-container">
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-0" disabled="disabled"><label class="task-list-item-label" for="task-item-0"> 환경변수로 구성된 변수</label></li>
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-1" disabled="disabled"><label class="task-list-item-label" for="task-item-1"> tfvars 파일의 변수</label></li>
</ul>
<details class="hint-container details"><summary>답</summary>
<ul class="task-list-container">
<li class="task-list-item"><input type="checkbox" class="task-list-item-checkbox" id="task-item-2" checked="checked" disabled="disabled"><label class="task-list-item-label" for="task-item-2"> tfvars 파일의 변수</label></li>
</ul>
</details>
<hr>
<p>이 장에서 우리는 :</p>
<ul>
<li>Terraform Provisioners에 대해 배웠습니다.</li>
<li><code v-pre>file</code> 과 <code v-pre>remote-exec</code> 프로비저닝 도구에 대해 알아보았습니다.</li>
<li>새로운 프로비저닝 단계로 웹서버 재구성 해보았습니다.</li>
</ul>
</div></template>


