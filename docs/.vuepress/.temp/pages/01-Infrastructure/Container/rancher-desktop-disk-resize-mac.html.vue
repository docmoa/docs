<template><div><h1 id="rancher-desktop-disk-resize-on-mac" tabindex="-1"><a class="header-anchor" href="#rancher-desktop-disk-resize-on-mac" aria-hidden="true">#</a> Rancher Desktop Disk Resize on MAC</h1>
<blockquote>
<p>Private docker registry<br>
Rancher Desktop<br>
MacOS<br>
Src :  <a href="https://slack-archive.rancher.com/t/8508077/on-my-m1-mac-i-ve-started-getting-this-error-and-it-wont-go-#3e8d178c-aee8-46e6-b4cc-094c2339cbaa" target="_blank" rel="noopener noreferrer">https://slack-archive.rancher.com/t/8508077/on-my-m1-mac-i-ve-started-getting-this-error-and-it-wont-go-#3e8d178c-aee8-46e6-b4cc-094c2339cbaa<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="issue" tabindex="-1"><a class="header-anchor" href="#issue" aria-hidden="true">#</a> issue</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">docker</span> run abc
f631eb8a0078: Already exists
d04f82e55126: Already exists
0b1212f566e8: Already exists
8e7d076cd7f0: Already exists
62aa9a741295: Already exists
f3e65750a6be: Extracting  <span class="token number">22</span>.02GB/22.02GB
docker: failed to register layer: Error processing <span class="token function">tar</span> file<span class="token punctuation">(</span>exit status <span class="token number">1</span><span class="token punctuation">)</span>: <span class="token function">write</span> /0000.dat: no space left on device.
See <span class="token string">'docker run --help'</span><span class="token builtin class-name">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container danger">
<p class="hint-container-title">위험</p>
<p>Check the Rancher desktop stopped</p>
</div>
<h2 id="resize" tabindex="-1"><a class="header-anchor" href="#resize" aria-hidden="true">#</a> Resize</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ /Applications/Rancher<span class="token punctuation">\</span> Desktop.app/Contents/Resources/resources/darwin/lima/bin/qemu-img resize <span class="token environment constant">$HOME</span>/Library/Application<span class="token punctuation">\</span> Support/rancher-desktop/lima/0/diffdisk +10G

Image resized.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


