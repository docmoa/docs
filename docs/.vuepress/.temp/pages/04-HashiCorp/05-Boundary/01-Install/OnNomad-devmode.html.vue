<template><div><h1 id="boundary-run-dev-mode-on-nomad-job" tabindex="-1"><a class="header-anchor" href="#boundary-run-dev-mode-on-nomad-job" aria-hidden="true">#</a> Boundary Run Dev Mode on Nomad Job</h1>
<h2 id="_1-job-sample" tabindex="-1"><a class="header-anchor" href="#_1-job-sample" aria-hidden="true">#</a> 1. Job sample</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"0.8.1"</span>
  <span class="token property">private_ip</span> <span class="token punctuation">=</span> <span class="token string">"192.168.0.27"</span>
  <span class="token property">public_ip</span> <span class="token punctuation">=</span> <span class="token string">"11.129.13.30"</span>
<span class="token punctuation">}</span>

job <span class="token string">"boundary-dev"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"home"</span><span class="token punctuation">]</span>
  <span class="token property">namespace</span> <span class="token punctuation">=</span> <span class="token string">"boundary"</span>

  <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
    <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>os<span class="token punctuation">.</span>name<span class="token punctuation">}</span></span>"</span>
    <span class="token property">value</span>     <span class="token punctuation">=</span> <span class="token string">"raspbian"</span>
  <span class="token punctuation">}</span>

  group <span class="token string">"dev"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">ephemeral_disk</span> <span class="token punctuation">{</span> <span class="token property">sticky</span>  <span class="token punctuation">=</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"host"</span>
      port <span class="token string">"api"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">9200</span>
        <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token number">9200</span>
      <span class="token punctuation">}</span>
      port <span class="token string">"cluster"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">9201</span>
        <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token number">9201</span>
      <span class="token punctuation">}</span>
      port <span class="token string">"worker"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">9202</span>
        <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token number">9202</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"dev"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"raw_exec"</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">BOUNDARY_DEV_CONTROLLER_API_LISTEN_ADDRESS</span> <span class="token punctuation">=</span> local.private_ip
        <span class="token property">BOUNDARY_DEV_CONTROLLER_CLUSTER_LISTEN_ADDRESS</span> <span class="token punctuation">=</span> <span class="token string">"0.0.0.0"</span>
        <span class="token property">BOUNDARY_DEV_WORKER_PUBLIC_ADDRESS</span> <span class="token punctuation">=</span> local.public_ip
        <span class="token property">BOUNDARY_DEV_WORKER_PROXY_LISTEN_ADDRESS</span> <span class="token punctuation">=</span> local.private_ip
        <span class="token property">BOUNDARY_DEV_PASSWORD</span> <span class="token punctuation">=</span> <span class="token string">"password"</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// artifact {</span>
      <span class="token comment">//   source = "https://releases.hashicorp.com/boundary/${local.version}/boundary_${local.version}_linux_arm.zip"</span>
      <span class="token comment">// }</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"boundary"</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dev"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">500</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">500</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"boundary"</span>
        <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"cluster"</span><span class="token punctuation">]</span>

        <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"cluster"</span>

        <span class="token keyword">check</span> <span class="token punctuation">{</span>
          <span class="token property">type</span>  <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
          <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
          <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
          <span class="token property">port</span>  <span class="token punctuation">=</span> <span class="token string">"api"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-env" tabindex="-1"><a class="header-anchor" href="#_2-env" aria-hidden="true">#</a> 2. ENV</h2>
<ul>
<li>BOUNDARY_DEV_WORKER_PUBLIC_ADDRESS : Worker public ip config, (or <code v-pre>-worker-public-addr</code> flag)</li>
</ul>
</div></template>


