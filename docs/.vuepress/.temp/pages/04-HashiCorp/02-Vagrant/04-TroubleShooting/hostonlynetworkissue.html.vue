<template><div><h1 id="network-code-e-accessdenied-0x80070005" tabindex="-1"><a class="header-anchor" href="#network-code-e-accessdenied-0x80070005" aria-hidden="true">#</a> Network : Code E_ACCESSDENIED (0x80070005)</h1>
<p><a href="https://discuss.hashicorp.com/t/vagrant-2-2-18-osx-11-6-cannot-create-private-network/30984/9" target="_blank" rel="noopener noreferrer">https://discuss.hashicorp.com/t/vagrant-2-2-18-osx-11-6-cannot-create-private-network/30984/9<ExternalLinkIcon/></a><br>
<a href="https://discuss.hashicorp.com/t/vagran-can-not-assign-ip-address-to-virtualbox-machine/30930" target="_blank" rel="noopener noreferrer">https://discuss.hashicorp.com/t/vagran-can-not-assign-ip-address-to-virtualbox-machine/30930<ExternalLinkIcon/></a></p>
<h2 id="환경" tabindex="-1"><a class="header-anchor" href="#환경" aria-hidden="true">#</a> 환경</h2>
<blockquote>
<p>테스트 환경은 MacOS이나 HashiCorp Discuss의 글을 확인해보면 Linux에서도 동일하게 발생하는 것으로 보임</p>
</blockquote>
<ul>
<li>MacOS 카탈리나에서 빅서로 업그레이드</li>
<li>Vagrant 업데이트 : 2.2.18</li>
<li>VirtualBox 업데이트 : 6.1.28 r147628</li>
</ul>
<h2 id="현상" tabindex="-1"><a class="header-anchor" href="#현상" aria-hidden="true">#</a> 현상</h2>
<p>기존에 VirtualBox에 Host Network Manager에서 vboxnet# 사용중</p>
<ul>
<li>IPv4 Address : 172.28.128.1</li>
<li>IPv4 Network Mask : 255.255.255.0</li>
<li>DHCP
<ul>
<li>Server Address : 172.28.128.2</li>
<li>Server Mask : 255.255.255.0</li>
<li>Lower Address Bound: 172.28.128.3</li>
<li>Upper Address Bound: 172.28.128.254</li>
</ul>
</li>
</ul>
<p>Vagrant up 시 에러 발생<br>
VM의 Network에 Host-only Network로 해당 vboxnet#이 있어야 하나 목록에 표기 안됨</p>
<h2 id="해결방안" tabindex="-1"><a class="header-anchor" href="#해결방안" aria-hidden="true">#</a> 해결방안</h2>
<p>Host Network Manager에서 vboxnet#를 삭제후 다시 172.x.x.x로 생성하려고 하니 에러 발생</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>Stderr: VBoxManage: error: Code E_ACCESSDENIED <span class="token punctuation">(</span>0x80070005<span class="token punctuation">)</span> - Access denied <span class="token punctuation">(</span>extended info not available<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>기본으로 네트워크 생성시 부여받는 IP(e.g. <code v-pre>192.168.56.1</code>) 로는 가능하여 Vagrant의 구성을 해당 IP에 맞게 변경</p>
</div></template>


