<template><div><h1 id="vault-audit" tabindex="-1"><a class="header-anchor" href="#vault-audit" aria-hidden="true">#</a> Vault Audit</h1>
<p>Vault Audit은 <code v-pre>-path</code>를 달리하여 여러 Audit 메커니즘을 중복해서 구성 가능</p>
<h2 id="file" tabindex="-1"><a class="header-anchor" href="#file" aria-hidden="true">#</a> File</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault audit <span class="token builtin class-name">enable</span> <span class="token function">file</span> <span class="token assign-left variable">file_path</span><span class="token operator">=</span>/var/log/vault/vault_audit.log
$ vault audit <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>file2 <span class="token function">file</span> <span class="token assign-left variable">file_path</span><span class="token operator">=</span>/var/log/vault/vault_audit2.log
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="syslog" tabindex="-1"><a class="header-anchor" href="#syslog" aria-hidden="true">#</a> Syslog</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault audit <span class="token builtin class-name">enable</span> syslog <span class="token assign-left variable">tag</span><span class="token operator">=</span><span class="token string">"vault"</span> <span class="token assign-left variable">facility</span><span class="token operator">=</span><span class="token string">"AUTH"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="socket" tabindex="-1"><a class="header-anchor" href="#socket" aria-hidden="true">#</a> Socket</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault audit <span class="token builtin class-name">enable</span> socket <span class="token assign-left variable">address</span><span class="token operator">=</span><span class="token number">127.0</span>.0.1:9090 <span class="token assign-left variable">socket_type</span><span class="token operator">=</span>tcp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>Socket TEST - TCP listener sample - netcat<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> <span class="token parameter variable">-y</span> netcat
<span class="token function">nc</span> <span class="token parameter variable">-l</span> <span class="token number">9090</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</div></template>


