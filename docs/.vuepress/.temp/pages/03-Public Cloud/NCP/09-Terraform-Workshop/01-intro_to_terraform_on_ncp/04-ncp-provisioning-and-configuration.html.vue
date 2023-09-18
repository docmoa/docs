<template><div><h1 id="_04-테라폼-프로비저닝-도구-사용-및-구성" tabindex="-1"><a class="header-anchor" href="#_04-테라폼-프로비저닝-도구-사용-및-구성" aria-hidden="true">#</a> 04. 테라폼 프로비저닝 도구 사용 및 구성</h1>
<h2 id="terraform-프로비저닝-도구-사용" tabindex="-1"><a class="header-anchor" href="#terraform-프로비저닝-도구-사용" aria-hidden="true">#</a> Terraform 프로비저닝 도구 사용</h2>
<p>Terraform을 사용하여 가상 머신 또는 컨테이너를 세우고 나면 운영 체제와 애플리케이션을 구성 할 수 있습니다.</p>
<p>여기에서 <mark>Provisioner</mark> 가 등장합니다.</p>
<p>Terraform은 Bash, Powershell, Chef, Puppet, Ansible 등을 포함한 여러 유형의 Provisioner를 지원합니다.</p>
<p><a href="https://www.terraform.io/docs/provisioners/index.html" target="_blank" rel="noopener noreferrer">https://www.terraform.io/docs/provisioners/index.html<ExternalLinkIcon/></a></p>
<h2 id="file-provisioner" tabindex="-1"><a class="header-anchor" href="#file-provisioner" aria-hidden="true">#</a> File Provisioner</h2>
<p>Terraform 파일 프로비저닝 도구는 원격 시스템에 파일을 복사합니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">provisioner<span class="token type variable"> "file" </span></span><span class="token punctuation">{</span>
  <span class="token property">source</span>        <span class="token punctuation">=</span> <span class="token string">"files/"</span>
  <span class="token property">destination</span>   <span class="token punctuation">=</span> <span class="token string">"/home/<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">admin_username</span><span class="token punctuation">}</span></span>/"</span>
  <span class="token keyword">connection</span> <span class="token punctuation">{</span>
    <span class="token property">type</span>        <span class="token punctuation">=</span> <span class="token string">"ssh"</span>
    <span class="token property">user</span>        <span class="token punctuation">=</span> var.username
    <span class="token property">private_key</span> <span class="token punctuation">=</span> file(var.ssh_key)
    <span class="token property">host</span>        <span class="token punctuation">=</span> $<span class="token punctuation">{</span>self.ip<span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>provisioner 블록 안에있는 코드의 connection 블록에 주목하세요. 파일 프로비저닝 도구는 <code v-pre>SSH</code>, <code v-pre>WinRM</code> 연결을 모두 지원합니다.</p>
<h2 id="remote-exec-provisioner" tabindex="-1"><a class="header-anchor" href="#remote-exec-provisioner" aria-hidden="true">#</a> Remote Exec Provisioner</h2>
<p><code v-pre>Remote Exec Provisioner</code>를 사용하면 대상 호스트에서 스크립트 또는 기타 프로그램을 실행할 수 있습니다.</p>
<p>자동으로 실행할 수있는 경우 (예 : 소프트웨어 설치 프로그램) <code v-pre>remote-exec</code>로 실행할 수 있습니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">provisioner<span class="token type variable"> "remote-exec" </span></span><span class="token punctuation">{</span>
  <span class="token property">inline</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    <span class="token string">"sudo chown -R <span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">admin_username</span><span class="token punctuation">}</span></span>:<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">admin_username</span><span class="token punctuation">}</span></span> /var/www/html"</span>,
    <span class="token string">"chmod +x *.sh"</span>,
    <span class="token string">"PLACEHOLDER=<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">placeholder</span><span class="token punctuation">}</span></span> WIDTH=<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">width</span><span class="token punctuation">}</span></span> HEIGHT=<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">height</span><span class="token punctuation">}</span></span> PREFIX=<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">prefix</span><span class="token punctuation">}</span></span> ./deploy_app.sh"</span>,
  <span class="token punctuation">]</span>
...
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이 예에서는 일부 권한 및 소유권을 변경하고 일부 환경 변수가있는 스크립트를 실행하기 위해 몇 가지 명령을 실행합니다.</p>
<h2 id="terraform-config-management-tools" tabindex="-1"><a class="header-anchor" href="#terraform-config-management-tools" aria-hidden="true">#</a> Terraform &amp; Config Management Tools</h2>
<figure><img src="@source/03-Public Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/image/cpa.jpg" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>Terraform은 Chef, Puppet, Ansible과 같은 일반적인 구성 관리 도구와 잘 작동합니다.</p>
<ul>
<li>
<p>Official Chef Terraform provisioner:<br>
<a href="https://www.terraform.io/docs/provisioners/chef.html" target="_blank" rel="noopener noreferrer">https://www.terraform.io/docs/provisioners/chef.html<ExternalLinkIcon/></a></p>
</li>
<li>
<p>Run Puppet with 'local-exec':<br>
<a href="https://www.terraform.io/docs/provisioners/local-exec.html" target="_blank" rel="noopener noreferrer">https://www.terraform.io/docs/provisioners/local-exec.html<ExternalLinkIcon/></a></p>
</li>
<li>
<p>Terraform and Ansible - Better Together:<br>
<a href="https://github.com/scarolan/ansible-terraform" target="_blank" rel="noopener noreferrer">https://github.com/scarolan/ansible-terraform<ExternalLinkIcon/></a></p>
</li>
</ul>
<h2 id="terraform-provisioner에-대한-도움말" tabindex="-1"><a class="header-anchor" href="#terraform-provisioner에-대한-도움말" aria-hidden="true">#</a> Terraform Provisioner에 대한 도움말</h2>
<p><code v-pre>remote-exec</code>와 같은 Terraform 프로비저닝 도구는 몇 가지 간단한 명령이나 스크립트를 실행해야 할 때 유용합니다. 더 복잡한 구성 관리의 경우 Chef 또는 Ansible과 같은 도구가 필요합니다.</p>
<p>Provisioner는 Terraform 실행이 <mark>처음 실행될 때</mark> 만 실행됩니다. 이러한 의미에서 그 동작들은 멱등성을 띄지 않습니다.</p>
<p>수명이 긴 VM 또는 서버의 지속적인 상태 관리가 필요한 경우 이같은 구성 관리 도구를 활용할 수 있습니다.</p>
<p>반면에 변경 불가능한 인프라를 원하면 <a href="https://www.packer.io/" target="_blank" rel="noopener noreferrer">Packer<ExternalLinkIcon/></a> 같은 이뮤터블을 위한 빌드 도구를 사용하는 것이 좋습니다.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Dqwk7fYHhVQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<hr>
<p>실습을 위해 다음장으로 이동하세요.</p>
<p><RouterLink to="/03-Public%20Cloud/NCP/09-Terraform-Workshop/01-intro_to_terraform_on_ncp/04-z-lab_provisioning_and_configuration.html">💻 Lab - Provisioners, Variables, Outputs</RouterLink></p>
</div></template>


