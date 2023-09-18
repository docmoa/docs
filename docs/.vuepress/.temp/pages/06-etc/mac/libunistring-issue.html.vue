<template><div><h1 id="library-not-loaded-libunistring-2-dylib" tabindex="-1"><a class="header-anchor" href="#library-not-loaded-libunistring-2-dylib" aria-hidden="true">#</a> Library not loaded: libunistring.2.dylib</h1>
<h2 id="현상" tabindex="-1"><a class="header-anchor" href="#현상" aria-hidden="true">#</a> 현상</h2>
<p>macOS Ventura 업그레이드 후 wget 실행시 오류 발생</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">wget</span>
dyld<span class="token punctuation">[</span><span class="token number">4414</span><span class="token punctuation">]</span>: Library not loaded: /usr/local/opt/libunistring/lib/libunistring.2.dylib
  Referenced from: <span class="token operator">&lt;</span>1ECBA17E-A426-310D-9902-EFF0D9E1053<span class="token operator"><span class="token file-descriptor important">2</span>></span> /usr/local/Cellar/wget/1.21.3/bin/wget
  Reason: tried: <span class="token string">'/usr/local/opt/libunistring/lib/libunistring.2.dylib'</span> <span class="token punctuation">(</span>no such <span class="token function">file</span><span class="token punctuation">)</span>, <span class="token string">'/System/Volumes/Preboot/Cryptexes/OS/usr/local/opt/libunistring/lib/libunistring.2.dylib'</span> <span class="token punctuation">(</span>no such <span class="token function">file</span><span class="token punctuation">)</span>, <span class="token string">'/usr/local/opt/libunistring/lib/libunistring.2.dylib'</span> <span class="token punctuation">(</span>no such <span class="token function">file</span><span class="token punctuation">)</span>, <span class="token string">'/usr/local/lib/libunistring.2.dylib'</span> <span class="token punctuation">(</span>no such <span class="token function">file</span><span class="token punctuation">)</span>, <span class="token string">'/usr/lib/libunistring.2.dylib'</span> <span class="token punctuation">(</span>no such file, not <span class="token keyword">in</span> dyld cache<span class="token punctuation">)</span>, <span class="token string">'/usr/local/Cellar/libunistring/1.1/lib/libunistring.2.dylib'</span> <span class="token punctuation">(</span>no such <span class="token function">file</span><span class="token punctuation">)</span>, <span class="token string">'/System/Volumes/Preboot/Cryptexes/OS/usr/local/Cellar/libunistring/1.1/lib/libunistring.2.dylib'</span> <span class="token punctuation">(</span>no such <span class="token function">file</span><span class="token punctuation">)</span>, <span class="token string">'/usr/local/Cellar/libunistring/1.1/lib/libunistring.2.dylib'</span> <span class="token punctuation">(</span>no such <span class="token function">file</span><span class="token punctuation">)</span>, <span class="token string">'/usr/local/lib/libunistring.2.dylib'</span> <span class="token punctuation">(</span>no such <span class="token function">file</span><span class="token punctuation">)</span>, <span class="token string">'/usr/lib/libunistring.2.dylib'</span> <span class="token punctuation">(</span>no such file, not <span class="token keyword">in</span> dyld cache<span class="token punctuation">)</span>
<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>    <span class="token number">4414</span> abort      <span class="token function">wget</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="해결방안-찾기-과정" tabindex="-1"><a class="header-anchor" href="#해결방안-찾기-과정" aria-hidden="true">#</a> 해결방안 찾기 과정</h2>
<ul>
<li><a href="https://stackoverflow.com/questions/50631185/homebrew-will-not-run-wget-command-library-not-loaded" target="_blank" rel="noopener noreferrer">https://stackoverflow.com/questions/50631185/homebrew-will-not-run-wget-command-library-not-loaded<ExternalLinkIcon/></a>를 참고하여 <code v-pre>brew uninstall --force gettext</code> 실행했으나 오류</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ brew uninstall <span class="token parameter variable">--force</span> gettext
xcrun: error: invalid active developer path <span class="token punctuation">(</span>/Library/Developer/CommandLineTools<span class="token punctuation">)</span>, missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun
Error: Refusing to uninstall /usr/local/Cellar/gettext/0.21.1
because it is required by cairo, gdk-pixbuf, git, glib, gnupg, gnutls, gobject-introspection, graphviz, gts, harfbuzz, libidn2, librsvg, libslirp, pango, podman, qemu and wget, <span class="token function">which</span> are currently installed.
You can override this and force removal with:
brew uninstall --ignore-dependencies gettext
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>오류 메시지에서의 안내대로 <code v-pre>--ignore-dependencies</code> 추가하여 실행</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ brew uninstall --ignore-dependencies gettext
Uninstalling /usr/local/Cellar/gettext/0.21.1<span class="token punctuation">..</span>. <span class="token punctuation">(</span><span class="token number">1,983</span> files, <span class="token number">20</span>.6MB<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>gettext</code> 재설치하면 도중에 실행이 안됐던 <code v-pre>wget</code>도 재설치</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ brew <span class="token function">install</span> gettext
<span class="token punctuation">..</span>.
<span class="token operator">==</span><span class="token operator">></span> Upgrading <span class="token function">wget</span>
<span class="token number">1.21</span>.3 -<span class="token operator">></span> <span class="token number">1.21</span>.3_1

<span class="token operator">==</span><span class="token operator">></span> Installing dependencies <span class="token keyword">for</span> wget: openssl@3
<span class="token operator">==</span><span class="token operator">></span> Installing <span class="token function">wget</span> dependency: openssl@3
<span class="token operator">==</span><span class="token operator">></span> Pouring openssl@3--3.0.7.ventura.bottle.tar.gz
🍺  /usr/local/Cellar/openssl@3/3.0.7: <span class="token number">6,454</span> files, <span class="token number">28</span>.2MB
<span class="token operator">==</span><span class="token operator">></span> Installing <span class="token function">wget</span>
<span class="token operator">==</span><span class="token operator">></span> Pouring wget--1.21.3_1.ventura.bottle.1.tar.gz
🍺  /usr/local/Cellar/wget/1.21.3_1: <span class="token number">89</span> files, <span class="token number">4</span>.2MB
<span class="token operator">==</span><span class="token operator">></span> Running <span class="token variable"><span class="token variable">`</span>brew cleanup <span class="token function">wget</span><span class="token variable">`</span></span><span class="token punctuation">..</span>.
Removing: /usr/local/Cellar/wget/1.21.3<span class="token punctuation">..</span>. <span class="token punctuation">(</span><span class="token number">89</span> files, <span class="token number">4</span>.2MB<span class="token punctuation">)</span>
<span class="token operator">==</span><span class="token operator">></span> Checking <span class="token keyword">for</span> dependents of upgraded formulae<span class="token punctuation">..</span>.
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>git</code>도 업그레이드 후 영향을 받았는지 재설치 필요</li>
</ul>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code><span class="token property">Error:</span> <span class="token string">'git'</span> must be installed and in your PATH<span class="token operator">!</span>
<span class="token property">Warning:</span> gettext <span class="token number">0.21.1</span> is already installed and up<span class="token operator">-</span>to<span class="token operator">-</span>date<span class="token punctuation">.</span>
To reinstall <span class="token number">0.21.1</span><span class="token punctuation">,</span> run<span class="token operator">:</span>
    brew reinstall gettext
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><code v-pre>brew install git</code>으로 다시 <code v-pre>git</code>설치</p>
</li>
<li>
<p>마지막 재설치 요구에 따라 <code v-pre>gettext</code> 재설치</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ brew reinstall gettext
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>wget</code> 재실행 시 정상 동작 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">wget</span>
wget: URL 빠짐
사용법: <span class="token function">wget</span> <span class="token punctuation">[</span><span class="token operator">&lt;</span>옵션<span class="token operator">></span><span class="token punctuation">]</span><span class="token punctuation">..</span>. <span class="token punctuation">[</span>URL<span class="token punctuation">]</span><span class="token punctuation">..</span>.

자세한 옵션은 `wget --help'를 입력하십시오.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


