<template><div><h1 id="code-block" tabindex="-1"><a class="header-anchor" href="#code-block" aria-hidden="true">#</a> Code Block</h1>
<p>마크다운 기본 사용 법과 거의 동일합니다.</p>
<h2 id="기본-사용법" tabindex="-1"><a class="header-anchor" href="#기본-사용법" aria-hidden="true">#</a> 기본 사용법</h2>
<p>코드블록은 ``` 과 ``` 사이에 코드를 넣어 로 표기합니다. 아래와 같이 md 파일 내에 작성하면</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code><span class="token code"><span class="token punctuation">```</span>
<span class="token code-block"># Code block e.g.
This is my code</span>
<span class="token punctuation">```</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>다음과 같이 표기됩니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># Code block e.g.
This is my code
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><code>```</code> 대신 <code>~~~</code> 도 사용 가능합니다.</p>
<h2 id="코드-구문-강조" tabindex="-1"><a class="header-anchor" href="#코드-구문-강조" aria-hidden="true">#</a> 코드 구문 강조</h2>
<p>VuePress는 Prism Javascript 라이브러리를 통해 키워드 강조 표시를 지원 합니다. 목록에 대한 확인은 <a href="https://github.com/PrismJS/prism/blob/master/components.json" target="_blank" rel="noopener noreferrer">components.json<ExternalLinkIcon/></a> 의 <code v-pre>languages</code>를 참고할 수 있습니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code><span class="token code"><span class="token punctuation">```</span><span class="token code-language">python</span>
<span class="token code-block language-python">print("hello, world.")</span>
<span class="token punctuation">```</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"hello, world."</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="코드-강조" tabindex="-1"><a class="header-anchor" href="#코드-강조" aria-hidden="true">#</a> 코드 강조</h2>
<p>문서 작성 시 코드블록에서 강조하고 싶은 경우 코드블럭의 스타일 에 강조할 라인 번호를 명시합니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code><span class="token code"><span class="token punctuation">```</span><span class="token code-language">python {2,4-5}</span>
<span class="token code-block language-python"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"nomal"</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"highlight!"</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"nomal"</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"highlight!"</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"highlight!"</span><span class="token punctuation">)</span></span>
<span class="token punctuation">```</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-python line-numbers-mode" data-ext="py"><pre v-pre python="" class="language-python"><code><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"nomal"</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"highlight!"</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"nomal"</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"highlight!"</span><span class="token punctuation">)</span>
<span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"highlight!"</span><span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="다중-코드블록" tabindex="-1"><a class="header-anchor" href="#다중-코드블록" aria-hidden="true">#</a> 다중 코드블록</h2>
<p>상황에 따라 동일한 구성 및 동작을 위한 코드블록을 옵션을 주어 선택적으로 표기하고 싶은 경우 <code v-pre>&lt;code-group&gt;</code>과 <code v-pre>&lt;code-block&gt;</code> 을 활용 합니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>::: code-tabs#shell
@tab Option1
<span class="token code"><span class="token punctuation">```</span><span class="token code-language">bash {2}</span>
<span class="token code-block language-bash"><span class="token comment"># This is Option 1</span>
<span class="token function">chmod</span> <span class="token number">755</span> ./file.txt</span>
<span class="token punctuation">```</span></span>

@tab Option2
<span class="token code"><span class="token punctuation">```</span><span class="token code-language">bash {2}</span>
<span class="token code-block language-bash"><span class="token comment"># This is Option 2</span>
<span class="token function">chmod</span> +x ./file.txt</span>
<span class="token punctuation">```</span></span>
:::
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><CodeTabs id="43" :data='[{"id":"Option1"},{"id":"Option2"}]' tab-id="shell">
<template #title0="{ value, isActive }">Option1</template>
<template #title1="{ value, isActive }">Option2</template>
<template #tab0="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code><span class="token comment"># This is Option 1</span>
<span class="token function">chmod</span> <span class="token number">755</span> ./file.txt
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></template>
<template #tab1="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code><span class="token comment"># This is Option 2</span>
<span class="token function">chmod</span> +x ./file.txt
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></template>
</CodeTabs>
<h2 id="code-demo" tabindex="-1"><a class="header-anchor" href="#code-demo" aria-hidden="true">#</a> Code Demo</h2>
<p><a href="https://vuepress-theme-hope.github.io/md-enhance/guide/demo/#" target="_blank" rel="noopener noreferrer">https://vuepress-theme-hope.github.io/md-enhance/guide/demo/#<ExternalLinkIcon/></a></p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>::: normal-demo Demo

<span class="token code"><span class="token punctuation">```</span><span class="token code-language">html</span>
<span class="token code-block language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>Mr.Hope<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>is <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>very<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>very<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span> handsome<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span></span>
<span class="token punctuation">```</span></span>

<span class="token code"><span class="token punctuation">```</span><span class="token code-language">js</span>
<span class="token code-block language-js">document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">"#very"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">"Very handsome"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="token punctuation">```</span></span>

<span class="token code"><span class="token punctuation">```</span><span class="token code-language">css</span>
<span class="token code-block language-css"><span class="token selector">span</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
<span class="token punctuation">}</span></span>
<span class="token punctuation">```</span></span>

:::
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>
<CodeDemo id="code-demo-58" type="normal" title="Demo" code="eJw9jj0LwjAQhv/KcS4K0uKqMZvgoJPglKUmB62ml5qkgoj/3UsVl/t8n3vvhW3uPa5RtSt9jNU+DKRqqQ2rQXcJVBoahs5tDT4oPg3qklRdxhrahl0KvSBDIS5jzoF1S94HVf86w7jEaxIPF+zYE+fqPsqNE3myOcS5wdn39KJqnNs9RHHoUiamsrO+szeDS5gvYKvhZRig8RSz7M6C/X8QfmP4XYIY2lQcp+cnxAYf4hoiuSISyfsDETZVFQ==">
<div class="language-html line-numbers-mode" data-ext="html"><pre v-pre class="language-html"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">></span></span>Mr.Hope<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>is <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>very<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>very<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span> handsome<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span><span class="token punctuation">></span></span>hello<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">"#very"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">"click"</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">"Very handsome"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-css line-numbers-mode" data-ext="css"><pre v-pre class="language-css"><code><span class="token selector">span</span> <span class="token punctuation">{</span>
  <span class="token property">color</span><span class="token punctuation">:</span> red<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></CodeDemo></div></template>


