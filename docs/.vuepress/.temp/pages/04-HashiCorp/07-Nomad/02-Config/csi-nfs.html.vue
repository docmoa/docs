<template><div><h1 id="nomad-csi-nfs" tabindex="-1"><a class="header-anchor" href="#nomad-csi-nfs" aria-hidden="true">#</a> nomad csi (nfs)</h1>
<ul>
<li>nomad에서 외부 storage를 사용하기 위한 plugin
<ul>
<li>그 중에서도 접근성이 좋은 nfs를 사용, public cloud에서 제공하는 storage와는 사용법이 다를 수 있음</li>
</ul>
</li>
<li>구성환경은 아래와 같다.(사실 nfs server정보만 보면 될 거 같음)
<ul>
<li>nfs-server 10.0.0.151:/mnt/data</li>
</ul>
</li>
</ul>
<h2 id="controller" tabindex="-1"><a class="header-anchor" href="#controller" aria-hidden="true">#</a> controller</h2>
<ul>
<li>하나이상의 node에 storage를 배포할 수 있게 해주는 중앙관리 기능</li>
<li>어느 node(client)에 띄어져도 상관없다.</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"plugin-nfs-controller"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  group <span class="token string">"controller"</span> <span class="token punctuation">{</span>
    task <span class="token string">"plugin"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"mcr.microsoft.com/k8s/csi/nfs-csi:latest"</span>

        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"--endpoint=unix://csi/csi.sock"</span>,
          <span class="token string">"--nodeid=<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>unique<span class="token punctuation">.</span>hostname<span class="token punctuation">}</span></span>"</span>,
          <span class="token string">"--logtostderr"</span>,
          <span class="token string">"-v=5"</span>,
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">csi_plugin</span> <span class="token punctuation">{</span>
        <span class="token property">id</span>        <span class="token punctuation">=</span> <span class="token string">"nfs"</span>
        <span class="token property">type</span>      <span class="token punctuation">=</span> <span class="token string">"controller"</span>
        <span class="token property">mount_dir</span> <span class="token punctuation">=</span> <span class="token string">"/csi"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">250</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">128</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="node-plugin" tabindex="-1"><a class="header-anchor" href="#node-plugin" aria-hidden="true">#</a> node plugin</h2>
<ul>
<li>컨테이너가 동작하는, 그리고 storage가 띄어져야 할 모든 node에 올라가야됨</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"plugin-nfs-nodes"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"system"</span>

  group <span class="token string">"nodes"</span> <span class="token punctuation">{</span>
    task <span class="token string">"plugin"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"mcr.microsoft.com/k8s/csi/nfs-csi:latest"</span>

        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"--endpoint=unix://csi/csi.sock"</span>,
          <span class="token string">"--nodeid=<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>unique<span class="token punctuation">.</span>hostname<span class="token punctuation">}</span></span>"</span>,
          <span class="token string">"--logtostderr"</span>,
          <span class="token string">"--v=5"</span>,
        <span class="token punctuation">]</span>

        <span class="token property">privileged</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">csi_plugin</span> <span class="token punctuation">{</span>
        <span class="token property">id</span>        <span class="token punctuation">=</span> <span class="token string">"nfs"</span>
        <span class="token property">type</span>      <span class="token punctuation">=</span> <span class="token string">"node"</span>
        <span class="token property">mount_dir</span> <span class="token punctuation">=</span> <span class="token string">"/csi"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">250</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">128</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nomad-volume" tabindex="-1"><a class="header-anchor" href="#nomad-volume" aria-hidden="true">#</a> nomad volume</h2>
<ul>
<li>csi를 이용하여 실제 사용할 volume을 만든다.</li>
<li>cli: nomad volume register [파일명]
<ul>
<li>다른 건 nomad doc에 다 나오지만 nfs 마운트 명령어에 던져 줄 parameter 값을 넣어줘야 할 경우에는 context에 넣어줘야한다.</li>
</ul>
</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token property">id</span>           <span class="token punctuation">=</span> <span class="token string">"nfs-vol"</span>
<span class="token property">name</span>         <span class="token punctuation">=</span> <span class="token string">"nfs"</span>
<span class="token property">type</span>         <span class="token punctuation">=</span> <span class="token string">"csi"</span>
<span class="token property">external_id</span>  <span class="token punctuation">=</span> <span class="token string">"nfs"</span>
<span class="token property">plugin_id</span>    <span class="token punctuation">=</span> <span class="token string">"nfs"</span>
<span class="token comment">#snapshot_id  = "test" # or clone_id, see below</span>
<span class="token property">capacity_max</span> <span class="token punctuation">=</span> <span class="token string">"20G"</span>
<span class="token property">capacity_min</span> <span class="token punctuation">=</span> <span class="token string">"10G"</span>

<span class="token keyword">capability</span> <span class="token punctuation">{</span>
  <span class="token property">access_mode</span>     <span class="token punctuation">=</span> <span class="token string">"single-node-writer"</span>
  <span class="token property">attachment_mode</span> <span class="token punctuation">=</span> <span class="token string">"file-system"</span>
<span class="token punctuation">}</span>

<span class="token keyword">mount_options</span> <span class="token punctuation">{</span>
  <span class="token property">fs_type</span>     <span class="token punctuation">=</span> <span class="token string">"ext4"</span>
  <span class="token property">mount_flags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"noatime"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">context</span> <span class="token punctuation">{</span>
  <span class="token property">server</span>  <span class="token punctuation">=</span> <span class="token string">"10.0.0.151"</span>
  <span class="token property">share</span>   <span class="token punctuation">=</span> <span class="token string">"/mnt/data"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="job에는-아래와-같이-추가하여-사용했다" tabindex="-1"><a class="header-anchor" href="#job에는-아래와-같이-추가하여-사용했다" aria-hidden="true">#</a> job에는 아래와 같이 추가하여 사용했다.</h2>
<ul>
<li><RouterLink to="/04-HashiCorp/07-Nomad/05-SampleJob/jboss.html">원본 job</RouterLink></li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>    volume <span class="token string">"nfs-vol"</span> <span class="token punctuation">{</span>
      <span class="token property">type</span>            <span class="token punctuation">=</span> <span class="token string">"csi"</span>
      <span class="token property">source</span>          <span class="token punctuation">=</span> <span class="token string">"nfs-vol"</span>
      <span class="token property">read_only</span>       <span class="token punctuation">=</span> <span class="token boolean">false</span>
      <span class="token property">attachment_mode</span> <span class="token punctuation">=</span> <span class="token string">"file-system"</span>
      <span class="token property">access_mode</span>     <span class="token punctuation">=</span> <span class="token string">"single-node-writer"</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nomad-volume페이지에서-확인" tabindex="-1"><a class="header-anchor" href="#nomad-volume페이지에서-확인" aria-hidden="true">#</a> nomad volume페이지에서 확인</h2>
<ul>
<li>nomad ui에서 volume 페이지에서 alloc에서 사용 중인 volume을 볼 수 있다<br>
<img src="@source/04-HashiCorp/07-Nomad/05-SampleJob/image/nfs-csi.png" alt="" loading="lazy"></li>
</ul>
</div></template>


