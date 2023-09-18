<template><div><h1 id="tip-box" tabindex="-1"><a class="header-anchor" href="#tip-box" aria-hidden="true">#</a> Tip Box</h1>
<p>문서 작성시 팁과 주의사항을 표기하는 방법을 설명합니다.<br>
<a href="https://vuepress.vuejs.org/guide/markdown.html#:~:text=markdown.toc%20option.-,%23,-Custom%20Containers" target="_blank" rel="noopener noreferrer">공식 문서<ExternalLinkIcon/></a></p>
<h2 id="기본-사용법" tabindex="-1"><a class="header-anchor" href="#기본-사용법" aria-hidden="true">#</a> 기본 사용법</h2>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: details
This is a details block, which does not work in IE / Edge
:::
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>다음과 같이 표기됩니다.</p>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>This is a tip</p>
</div>
<div class="hint-container warning">
<p class="hint-container-title">경고</p>
<p>This is a warning</p>
</div>
<div class="hint-container danger">
<p class="hint-container-title">위험</p>
<p>This is a dangerous warning</p>
</div>
<details class="hint-container details"><summary>세부사항</summary>
<p>This is a details block, which does not work in IE / Edge</p>
</details>
<h2 id="응용" tabindex="-1"><a class="header-anchor" href="#응용" aria-hidden="true">#</a> 응용</h2>
<p>타입 우측에 타이틀명을 추가하여 기본 값을 변경합니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>::: danger STOP
Danger zone, do not proceed
Go to <span class="token url">[<span class="token content">here</span>](<span class="token url">https://vuepress.vuejs.org/guide/markdown.html#:~:text=markdown.toc%20option.-,%23,-Custom%20Containers</span>)</span>
:::

::: details Click me to view the code
<span class="token code"><span class="token punctuation">```</span><span class="token code-language">js</span>
<span class="token code-block language-js">console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'Hello, VuePress!'</span><span class="token punctuation">)</span></span>
<span class="token punctuation">```</span></span>
:::
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container danger">
<p class="hint-container-title">STOP</p>
<p>Danger zone, do not proceed<br>
Go to <a href="https://vuepress.vuejs.org/guide/markdown.html#:~:text=markdown.toc%20option.-,%23,-Custom%20Containers" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a></p>
</div>
<details class="hint-container details"><summary>Click me to view the code</summary>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'Hello, VuePress!'</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></details>
</div></template>


