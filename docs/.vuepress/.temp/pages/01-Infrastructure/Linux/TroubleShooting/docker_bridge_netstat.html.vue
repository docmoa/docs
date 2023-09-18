<template><div><h1 id="docker나-nomad를-이용하여-bridge모드로-기동된-컨테이너의-port-체크" tabindex="-1"><a class="header-anchor" href="#docker나-nomad를-이용하여-bridge모드로-기동된-컨테이너의-port-체크" aria-hidden="true">#</a> docker나 nomad를 이용하여 bridge모드로 기동된 컨테이너의 port 체크</h1>
<ul>
<li>단순 netstat만으로 bridge모드로 기동된 docker의 port를 체크할 수 없다</li>
<li>그래서 아래와 같은 절차가 필요하다.</li>
</ul>
<h3 id="먼저-찾으려는-컨테이너의-port를-확인한다-nomad로-배포되어-있는-컨테이너임" tabindex="-1"><a class="header-anchor" href="#먼저-찾으려는-컨테이너의-port를-확인한다-nomad로-배포되어-있는-컨테이너임" aria-hidden="true">#</a> 먼저 찾으려는 컨테이너의 port를 확인한다. (nomad로 배포되어 있는 컨테이너임)</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>nomad alloc status d78d5b32
ID                  <span class="token operator">=</span> d78d5b32-00c3-5468-284a-8c201058c53a
Eval ID             <span class="token operator">=</span> c6c9a1d9
Name                <span class="token operator">=</span> 08_grafana.08_grafana<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
Node ID             <span class="token operator">=</span> e11b7729
Node Name           <span class="token operator">=</span> slave1
Job ID              <span class="token operator">=</span> 08_grafana
Job Version         <span class="token operator">=</span> <span class="token number">0</span>
Client Status       <span class="token operator">=</span> running
Client Description  <span class="token operator">=</span> Tasks are running
Desired Status      <span class="token operator">=</span> run
Desired Description <span class="token operator">=</span> <span class="token operator">&lt;</span>none<span class="token operator">></span>
Created             <span class="token operator">=</span> 18h42m ago
Modified            <span class="token operator">=</span> 2h36m ago

Allocation Addresses <span class="token punctuation">(</span>mode <span class="token operator">=</span> <span class="token string">"bridge"</span><span class="token punctuation">)</span>
Label                   Dynamic  Address
*http                   <span class="token function">yes</span>      <span class="token number">10.0</span>.0.161:25546
*connect-proxy-grafana  <span class="token function">yes</span>      <span class="token number">10.0</span>.0.161:29382 -<span class="token operator">></span> <span class="token number">29382</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="먼저-일반적으로-사용하는-netstat에는-grafana-컨테이너의-http-port인-25546이-확인되지-않는다" tabindex="-1"><a class="header-anchor" href="#먼저-일반적으로-사용하는-netstat에는-grafana-컨테이너의-http-port인-25546이-확인되지-않는다" aria-hidden="true">#</a> 먼저 일반적으로 사용하는 netstat에는 grafana 컨테이너의 http port인 25546이 확인되지 않는다.</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">netstat</span> <span class="token parameter variable">-ntlp</span>
Active Internet connections <span class="token punctuation">(</span>only servers<span class="token punctuation">)</span>
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:8502          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">780</span>/consul
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:22              <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">813</span>/sshd: /usr/sbin
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:8888            <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">2354</span>/haproxy
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:8600          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">780</span>/consul
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">10.0</span>.0.161:24185        <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">22324</span>/docker-proxy
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">10.0</span>.0.161:9090         <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">2496</span>/docker-proxy
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">172.30</span>.1.112:8301       <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">780</span>/consul
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:111             <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">1</span>/init
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">0.0</span>.0.0:1936            <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">2354</span>/haproxy
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.1:8500          <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">780</span>/consul
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.53:53           <span class="token number">0.0</span>.0.0:*               LISTEN      <span class="token number">33902</span>/systemd-resol
tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::22                   :::*                    LISTEN      <span class="token number">813</span>/sshd: /usr/sbin
tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::4646                 :::*                    LISTEN      <span class="token number">9827</span>/nomad
tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::111                  :::*                    LISTEN      <span class="token number">1</span>/init
tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::6100                 :::*                    LISTEN      <span class="token number">22827</span>/java
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="기동-중인-docker에서-inspect로-pid를-검색해오고-그-정보로-netstat를-다시하면-이제-listen된-정보를-얻어올-수-있다" tabindex="-1"><a class="header-anchor" href="#기동-중인-docker에서-inspect로-pid를-검색해오고-그-정보로-netstat를-다시하면-이제-listen된-정보를-얻어올-수-있다" aria-hidden="true">#</a> 기동 중인 docker에서 inspect로 pid를 검색해오고 그 정보로 netstat를 다시하면 이제 LISTEN된 정보를 얻어올 수 있다.</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">docker</span> <span class="token function">ps</span> <span class="token operator">|</span> <span class="token function">grep</span> grafana
0371b4c5f500   grafana/grafana                            <span class="token string">"/run.sh"</span>                <span class="token number">50</span> minutes ago   Up <span class="token number">50</span> minutes                                                            grafana-d78d5b32-00c3-5468-284a-8c201058c53a
62a46e08d426   envoyproxy/envoy:v1.20.0                   <span class="token string">"/docker-entrypoint.…"</span>   <span class="token number">50</span> minutes ago   Up <span class="token number">50</span> minutes                                                            connect-proxy-grafana-d78d5b32-00c3-5468-284a-8c201058c53a

$ <span class="token function">docker</span> inspect <span class="token parameter variable">-f</span> <span class="token string">'{{.State.Pid}}'</span> 0371b4c5f500
<span class="token number">22741</span>

$ nsenter <span class="token parameter variable">-t</span> <span class="token number">22741</span> <span class="token parameter variable">-n</span> <span class="token function">netstat</span> <span class="token parameter variable">-ntl</span>
Active Internet connections <span class="token punctuation">(</span>only servers<span class="token punctuation">)</span>
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        <span class="token number">0</span>      <span class="token number">0</span> <span class="token number">127.0</span>.0.2:19001         <span class="token number">0.0</span>.0.0:*               LISTEN
tcp6       <span class="token number">0</span>      <span class="token number">0</span> :::25546                :::*                    LISTEN
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="위-결과로-알-수-있는-것은-가상-네트워크에-물려-기동되는-컨테이너의-listen정보를-알기위해선-조금의-과정이-필요함" tabindex="-1"><a class="header-anchor" href="#위-결과로-알-수-있는-것은-가상-네트워크에-물려-기동되는-컨테이너의-listen정보를-알기위해선-조금의-과정이-필요함" aria-hidden="true">#</a> * 위 결과로 알 수 있는 것은 가상 네트워크에 물려 기동되는 컨테이너의 LISTEN정보를 알기위해선 조금의 과정이 필요함</h4>
</div></template>


