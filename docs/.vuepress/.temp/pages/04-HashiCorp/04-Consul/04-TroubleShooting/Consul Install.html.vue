<template><div><h1 id="consul-yum-install-issue" tabindex="-1"><a class="header-anchor" href="#consul-yum-install-issue" aria-hidden="true">#</a> Consul yum install issue</h1>
<p>AmazonLinux 환경에서 하기와 같은 명령어로 consul 설치 후 systemd 를 통한 Consul 시작시 오류 발생</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">sudo</span> yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo
<span class="token function">sudo</span> yum <span class="token parameter variable">-y</span> <span class="token function">install</span> consul
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="consul-시작시-오류로그" tabindex="-1"><a class="header-anchor" href="#consul-시작시-오류로그" aria-hidden="true">#</a> Consul 시작시 오류로그</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token punctuation">[</span>ec2-user@ip-10-0-10-35 ~<span class="token punctuation">]</span>$ <span class="token function">sudo</span> systemctl start consul
Job <span class="token keyword">for</span> consul.service failed because a configured resource limit was exceeded. See <span class="token string">"systemctl status consul.service"</span> and <span class="token string">"journalctl -xe"</span> <span class="token keyword">for</span> details.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="원인-및-해결방안" tabindex="-1"><a class="header-anchor" href="#원인-및-해결방안" aria-hidden="true">#</a> 원인 및 해결방안</h2>
<p>yum 명령어로 consul설치시 /etc/consul.d/ 경로에 기본적으로 <code v-pre>consul.env</code>  파일이 자동으로 생성되는데 해당 파일이 생성되지 않아 수동으로 생성함.</p>
</div></template>


