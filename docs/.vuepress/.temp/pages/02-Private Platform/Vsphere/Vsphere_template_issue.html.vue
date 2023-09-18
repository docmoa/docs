<template><div><h1 id="vsphere-템플릿-생성-이슈" tabindex="-1"><a class="header-anchor" href="#vsphere-템플릿-생성-이슈" aria-hidden="true">#</a> VSphere 템플릿 생성 이슈</h1>
<ol>
<li>redhat 계열</li>
</ol>
<ul>
<li>아래 네개의 패키지의 설치가 필요하다. 특히 perl은 거의 설치가 안되어 있음</li>
<li>open-vm-tools, open-vm-tools-deploypkg, net-tools, perl</li>
<li>설치 후 template 생성하고 배포하면 됨</li>
</ul>
<ol start="2">
<li>debian 계열</li>
</ol>
<ul>
<li>/etc/systemd/system/vmtoolsd.service 파일에 구문 추가</li>
<li>18.04은 추가하여도 가끔 NIC, hostname이 기존에 템플릿의 정보를 가져올때가 있음</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment">#수정 할 파일</span>
<span class="token function">vi</span> /etc/systemd/system/vmtoolsd.service

<span class="token punctuation">[</span>Unit<span class="token punctuation">]</span>
<span class="token assign-left variable">Description</span><span class="token operator">=</span>Service <span class="token keyword">for</span> virtual machines hosted on VMware
<span class="token assign-left variable">Documentation</span><span class="token operator">=</span>http://open-vm-tools.sourceforge.net/about.php
<span class="token assign-left variable">ConditionVirtualization</span><span class="token operator">=</span>vmware
<span class="token assign-left variable">DefaultDependencies</span><span class="token operator">=</span>no
<span class="token assign-left variable">Before</span><span class="token operator">=</span>cloud-init-local.service
<span class="token comment">#아래 After=dbus.service추가</span>
<span class="token assign-left variable">After</span><span class="token operator">=</span>dbus.service
<span class="token assign-left variable">After</span><span class="token operator">=</span>vgauth.service
<span class="token assign-left variable">After</span><span class="token operator">=</span>apparmor.service
<span class="token assign-left variable">RequiresMountsFor</span><span class="token operator">=</span>/tmp
<span class="token assign-left variable">After</span><span class="token operator">=</span>systemd-remount-fs.service systemd-tmpfiles-setup.service systemd-modules-load.service

<span class="token punctuation">[</span>Service<span class="token punctuation">]</span>
<span class="token assign-left variable">ExecStart</span><span class="token operator">=</span>/usr/bin/vmtoolsd
<span class="token assign-left variable">TimeoutStopSec</span><span class="token operator">=</span><span class="token number">5</span>

<span class="token punctuation">[</span>Install<span class="token punctuation">]</span>
<span class="token assign-left variable">WantedBy</span><span class="token operator">=</span>multi-user.target
<span class="token assign-left variable">Alias</span><span class="token operator">=</span>vmtoolsd.service

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


