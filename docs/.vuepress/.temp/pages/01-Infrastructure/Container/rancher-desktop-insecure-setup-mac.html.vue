<template><div><h1 id="rancher-desktop-insecure-setup-on-mac" tabindex="-1"><a class="header-anchor" href="#rancher-desktop-insecure-setup-on-mac" aria-hidden="true">#</a> Rancher Desktop Insecure Setup on MAC</h1>
<blockquote>
<p>Private docker registry<br>
Rancher Desktop<br>
MacOS<br>
Setup <code v-pre>insecure-registries</code></p>
</blockquote>
<h2 id="issue" tabindex="-1"><a class="header-anchor" href="#issue" aria-hidden="true">#</a> issue</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">docker</span> push <span class="token number">192.168</span>.60.11:5000/example-python:1.0
Error response from daemon: Get https://192.168.60.11:5000/v1/example-python: http: server gave HTTP response to HTTPS client
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="edit-docker-json-within-rancher-desktop" tabindex="-1"><a class="header-anchor" href="#edit-docker-json-within-rancher-desktop" aria-hidden="true">#</a> Edit docker.json within Rancher desktop</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>MAC-user-terminal $ <span class="token assign-left variable">LIMA_HOME</span><span class="token operator">=</span><span class="token string">"<span class="token environment constant">$HOME</span>/Library/Application Support/rancher-desktop/lima"</span> <span class="token string">"/Applications/Rancher Desktop.app/Contents/Resources/resources/darwin/lima/bin/limactl"</span> shell <span class="token number">0</span>

lima-rancher-desktop $ <span class="token function">sudo</span> <span class="token function">vi</span> /etc/conf.d/docker
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-ini line-numbers-mode" data-ext="ini"><pre v-pre class="language-ini"><code>...
<span class="token comment"># DOCKER_OPTS="" to</span>
<span class="token key attr-name">DOCKER_OPTS</span><span class="token punctuation">=</span><span class="token value attr-value">"<span class="token inner-value">--insecure-registry=192.168.60.11:5000</span>"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="restart-docker-service" tabindex="-1"><a class="header-anchor" href="#restart-docker-service" aria-hidden="true">#</a> Restart docker service</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>lima-rancher-desktop $ <span class="token function">sudo</span> <span class="token function">service</span> <span class="token function">docker</span> restart
 * Caching <span class="token function">service</span> dependencies <span class="token punctuation">..</span> <span class="token punctuation">[</span> ok <span class="token punctuation">]</span>
 * Stopping Docker Daemon <span class="token punctuation">..</span>       <span class="token punctuation">[</span> ok <span class="token punctuation">]</span>
 * Starting Docker Daemon <span class="token punctuation">..</span>.      <span class="token punctuation">[</span> ok <span class="token punctuation">]</span>

lima-rancher-desktop $ <span class="token builtin class-name">exit</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="try-push-pull" tabindex="-1"><a class="header-anchor" href="#try-push-pull" aria-hidden="true">#</a> Try Push/Pull</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">docker</span> push <span class="token number">192.168</span>.60.11:5000/example-python:1.0
The push refers to repository <span class="token punctuation">[</span><span class="token number">192.168</span>.60.11:5000/example-python<span class="token punctuation">]</span>
259faf3d45f5: Pushed
d25777b53a01: Pushed
b28e272ad893: Pushed
517c4790d67b: Pushed
40dc2004f48f: Pushed
df63783f60fd: Pushed
7e1c5e1a1242: Pushed
b4440cc8e4ff: Pushed
26a1b0864fd3: Pushed
867d0767a47c: Pushed
<span class="token number">1.0</span>: digest: sha256:dc8ebd032c0c1cd8fd991926eaea5a9d8f3cf66286c048e3bac6336969c524b5 size: <span class="token number">2414</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


