<template><div><h1 id="template" tabindex="-1"><a class="header-anchor" href="#template" aria-hidden="true">#</a> Template</h1>
<p>docmoa에 문서 템플릿을 설명합니다.</p>
<div class="hint-container danger">
<p class="hint-container-title">주의</p>
<p>기본 템플릿 가이드를 잘 지켜주세요. 함께 만드는 문서 모음이므로, 기본적인 형식이 필요합니다.</p>
</div>
<h2 id="최소-template" tabindex="-1"><a class="header-anchor" href="#최소-template" aria-hidden="true">#</a> 최소 Template</h2>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre md="" class="language-markdown"><code><span class="token front-matter-block"><span class="token punctuation">---</span>

<span class="token punctuation">---</span></span>

<span class="token title important"><span class="token punctuation">#</span> h1 제목 = Title 입니다.</span>
내용은 마크다운 형식으로 작성합니다.

<span class="token title important"><span class="token punctuation">##</span> h2 제목</span>

</code></pre><div class="highlight-lines"><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Frontmatter(서문) : Frontmatter는 <code v-pre>---</code> 로 구분되는 내용입니다. 자세한 내용은 <a href="https://vuepress.vuejs.org/guide/frontmatter.html" target="_blank" rel="noopener noreferrer">공식 가이드<ExternalLinkIcon/></a>를 참고하세요. 여기서 주로 사용하는 내용은 다음과 같습니다.
<ul>
<li>title : 생략되면 <code v-pre>h1</code>으로 지정되는(<code v-pre>#</code>) 제목이 기본으로 적용됩니다.</li>
<li>meta : html 구성시 <code v-pre>meta</code> 에 추가 기입되는 정보입니다. 검색 엔진에 활용됩니다.</li>
<li>author : 작성자를 표기합니다.</li>
<li>tags : 해당 문서에 태깅을 지정합니다. 다중으로 적용 가능하며, 적용된 태그의 목록은 <a href="/98-tags">Tags</a>에서 확인할 수 있습니다.</li>
</ul>
</li>
<li><code v-pre># 제목</code> : <code v-pre>Frontmatter</code>에서 <code v-pre>title</code>을 명시하지 않는 것이 문서 작성에 복잡함을 줄여줄 것으로 예상되어 둘 중에 <code v-pre>h1</code> 스타일의 제목을 넣는 것을 권장합니다.</li>
</ul>
</div></template>


