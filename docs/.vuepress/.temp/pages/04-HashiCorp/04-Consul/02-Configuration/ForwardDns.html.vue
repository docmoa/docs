<template><div><h1 id="forwarddns" tabindex="-1"><a class="header-anchor" href="#forwarddns" aria-hidden="true">#</a> ForwardDns</h1>
<h2 id="consul-dns를-local에서도-사용해야-할-경우에는-dns-forward를-해줘야한다-아래는-ubuntu-환경에서-진행하였음" tabindex="-1"><a class="header-anchor" href="#consul-dns를-local에서도-사용해야-할-경우에는-dns-forward를-해줘야한다-아래는-ubuntu-환경에서-진행하였음" aria-hidden="true">#</a> Consul dns를 local에서도 사용해야 할 경우에는 dns forward를 해줘야한다. 아래는 ubuntu 환경에서 진행하였음</h2>
<h2 id="설정-명령어" tabindex="-1"><a class="header-anchor" href="#설정-명령어" aria-hidden="true">#</a> 설정 명령어</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment">#systemd-resolved 설정파일 추가 및 변경</span>
<span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/systemd/resolved.conf.d
<span class="token punctuation">(</span>
<span class="token function">cat</span> <span class="token operator">&lt;&lt;-</span><span class="token string">EOF
[Resolve]
DNS=127.0.0.1
DNSSEC=false
Domains=~consul
EOF</span>
<span class="token punctuation">)</span> <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">tee</span> /etc/systemd/resolved.conf.d/consul.conf
<span class="token punctuation">(</span>
<span class="token function">cat</span> <span class="token operator">&lt;&lt;-</span><span class="token string">EOF
nameserver 127.0.0.1
options edns0 trust-ad
EOF</span>
<span class="token punctuation">)</span> <span class="token operator">|</span> <span class="token function">sudo</span> <span class="token function">tee</span> /etc/resolv.conf
<span class="token comment">#iptables에 consul dns port 추가</span>
iptables <span class="token parameter variable">--table</span> nat <span class="token parameter variable">--append</span> OUTPUT <span class="token parameter variable">--destination</span> localhost <span class="token parameter variable">--protocol</span> udp <span class="token parameter variable">--match</span> udp <span class="token parameter variable">--dport</span> <span class="token number">53</span> <span class="token parameter variable">--jump</span> REDIRECT --to-ports <span class="token number">8600</span>
iptables <span class="token parameter variable">--table</span> nat <span class="token parameter variable">--append</span> OUTPUT <span class="token parameter variable">--destination</span> localhost <span class="token parameter variable">--protocol</span> tcp <span class="token parameter variable">--match</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">53</span> <span class="token parameter variable">--jump</span> REDIRECT --to-ports <span class="token number">8600</span>
<span class="token comment">#service 재시작</span>
systemctl restart systemd-resolved
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="확인-명령어" tabindex="-1"><a class="header-anchor" href="#확인-명령어" aria-hidden="true">#</a> 확인 명령어</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment">#Global domain에 consul 확인 </span>
$ resolvectl domain
Global: ~consul
Link <span class="token number">5</span> <span class="token punctuation">(</span>docker0<span class="token punctuation">)</span>:
Link <span class="token number">4</span> <span class="token punctuation">(</span>eth2<span class="token punctuation">)</span>:
Link <span class="token number">3</span> <span class="token punctuation">(</span>eth1<span class="token punctuation">)</span>:
Link <span class="token number">2</span> <span class="token punctuation">(</span>eth0<span class="token punctuation">)</span>:
<span class="token comment">#consul service확인, 해당 클러스터에는 consul server가 3대임</span>
$ resolvectl query consul.service.consul
consul.service.consul: <span class="token number">172.30</span>.1.100
                       <span class="token number">172.30</span>.1.101
                       <span class="token number">172.30</span>.1.102

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


