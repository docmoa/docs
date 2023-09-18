<template><div><h1 id="oracle-xe" tabindex="-1"><a class="header-anchor" href="#oracle-xe" aria-hidden="true">#</a> Oracle XE</h1>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"oracle"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  group <span class="token string">"oracle"</span> <span class="token punctuation">{</span>
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"db"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">1521</span>
      <span class="token punctuation">}</span>
      port <span class="token string">"manage"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">5500</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"db"</span>

      <span class="token keyword">check</span> <span class="token punctuation">{</span>
        <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
        <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
        <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"oracle"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"oracle/database:18.4.0-xe"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"db"</span>, <span class="token string">"manage"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">DB_MEMORY</span> <span class="token punctuation">=</span> <span class="token string">"2GB"</span>
        <span class="token property">ORACLE_PWD</span> <span class="token punctuation">=</span> <span class="token string">"password"</span>
        <span class="token property">ORACLE_SID</span> <span class="token punctuation">=</span> <span class="token string">"XE"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">2000</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">1024</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


