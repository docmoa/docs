<template><div><h1 id="keycloak" tabindex="-1"><a class="header-anchor" href="#keycloak" aria-hidden="true">#</a> Keycloak</h1>
<p>Keycloak은 Stateful 한 특성이 있어서 볼륨을 붙여주는것이 좋다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment">// nomad namespace apply -description "Keycloak" keycloak</span>

job <span class="token string">"keycloak"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token property">namespace</span> <span class="token punctuation">=</span> <span class="token string">"keycloak"</span>

  group <span class="token string">"keycloak"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    volume <span class="token string">"keycloak-vol"</span> <span class="token punctuation">{</span>
      <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"host"</span>
      <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
      <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"keycloak-vol"</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"keycloak"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">volume_mount</span> <span class="token punctuation">{</span>
        <span class="token property">volume</span> <span class="token punctuation">=</span> <span class="token string">"keycloak-vol"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/opt/jboss/keycloak/standalone/data"</span>
        <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"quay.io/keycloak/keycloak:14.0.0"</span>
        <span class="token keyword">port_map</span> <span class="token punctuation">{</span>
          <span class="token property">keycloak</span> <span class="token punctuation">=</span> <span class="token number">8080</span>
          <span class="token property">callback</span> <span class="token punctuation">=</span> <span class="token number">8250</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      
      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">KEYCLOAK_USER</span> <span class="token punctuation">=</span> <span class="token string">"admin"</span>
        <span class="token property">KEYCLOAK_PASSWORD</span> <span class="token punctuation">=</span> <span class="token string">"admin"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">550</span>

        <span class="token keyword">network</span> <span class="token punctuation">{</span>
          port <span class="token string">"keycloak"</span> <span class="token punctuation">{</span>
            <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">18080</span>
          <span class="token punctuation">}</span>
          port <span class="token string">"callback"</span> <span class="token punctuation">{</span>
            <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">18250</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"keycloak"</span>
        <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"auth"</span><span class="token punctuation">]</span>

        <span class="token keyword">check</span> <span class="token punctuation">{</span>
          <span class="token property">type</span>  <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
          <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
          <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
          <span class="token property">port</span>  <span class="token punctuation">=</span> <span class="token string">"keycloak"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


