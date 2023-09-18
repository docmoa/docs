<template><div><h1 id="code-server" tabindex="-1"><a class="header-anchor" href="#code-server" aria-hidden="true">#</a> code-server</h1>
<ul>
<li>vs-code를 local이 아닌 환경에서 사용할 수 있도록 도와주는 code-server의 예시입니다.</li>
<li>이 code의 변수는 nomad variable를 활용해서 배포합니다.</li>
</ul>
<h2 id="변수-선언" tabindex="-1"><a class="header-anchor" href="#변수-선언" aria-hidden="true">#</a> 변수 선언</h2>
<ul>
<li>web ui 접근 password와 code-server terminal에서 사용 할 sudo의 password 를 변수로 선언했습니다.</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># nomad var put {path기반의 varialbes} key=vaule</span>
$ nomad var put code/config <span class="token assign-left variable">password</span><span class="token operator">=</span>password
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="job-sample" tabindex="-1"><a class="header-anchor" href="#job-sample" aria-hidden="true">#</a> job sample</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"010-code-server"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> <span class="token string">"service"</span>

  group <span class="token string">"code-server"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token number">8443</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">8443</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"code-server"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>
      <span class="token property">provider</span> <span class="token punctuation">=</span> <span class="token string">"nomad"</span>

      <span class="token keyword">check</span> <span class="token punctuation">{</span>
        <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"http"</span>
        <span class="token property">path</span>     <span class="token punctuation">=</span> <span class="token string">"/"</span>
        <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"2s"</span>
        <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"30s"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"code-server-runner"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
{{ with nomadVar "code/config" }}
PASSWORD={{ .password }}
SUDO_PASSWORD={{ .password }}
{{ end }}
EOH</span>

  <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"secrets/file.env"</span>
  <span class="token property">env</span>         <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span>


      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"linuxserver/code-server"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"http"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">PGID</span><span class="token punctuation">=</span><span class="token number">1000</span>
        <span class="token property">PUID</span><span class="token punctuation">=</span><span class="token number">1000</span>
      <span class="token punctuation">}</span>


      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">1000</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">900</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


