<template><div><h1 id="tabs" tabindex="-1"><a class="header-anchor" href="#tabs" aria-hidden="true">#</a> Tabs</h1>
<p>컨텐츠에 탭을 추가하여 상황에 따라 선택적으로 문서를 읽을 수 있도록 합니다.<br>
상세 내용은 홈페이지 <a href="https://superbiger.github.io/vuepress-plugin-tabs" target="_blank" rel="noopener noreferrer">element-tabs home<ExternalLinkIcon/></a> 를 확인해보세요.</p>
<h2 id="기본-사용법" tabindex="-1"><a class="header-anchor" href="#기본-사용법" aria-hidden="true">#</a> 기본 사용법</h2>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>:::: tabs
::: tab title
<span class="token bold"><span class="token punctuation">__</span><span class="token content">markdown content</span><span class="token punctuation">__</span></span>
:::
::: tab javascript
<span class="token code"><span class="token punctuation">```</span><span class="token code-language"> javascript</span>
<span class="token code-block language-javascript"><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'Javascript code example'</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span></span>
<span class="token punctuation">```</span></span>
:::
::::
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>다음과 같이 표기됩니다.</p>
<Tabs id="13" :data='[]'>
</Tabs>
<h2 id="옵션" tabindex="-1"><a class="header-anchor" href="#옵션" aria-hidden="true">#</a> 옵션</h2>
<p><code v-pre>tabs</code> 지원 옵션에 대한 설명은 다음과 같습니다.</p>
<table>
<thead>
<tr>
<th>Attribute</th>
<th>설명</th>
<th>Type</th>
<th>가능 옵션</th>
<th>기본 옵션</th>
</tr>
</thead>
<tbody>
<tr>
<td>type</td>
<td>Tab의 유형</td>
<td>String</td>
<td>card / Boarder-card</td>
<td>border-card</td>
</tr>
<tr>
<td>tab-position</td>
<td>Tab 위치</td>
<td>String</td>
<td>top / right / bottom / left</td>
<td>top</td>
</tr>
<tr>
<td>stretch</td>
<td>탭 너비를 전체 폭에 맞춤 여부</td>
<td>Boolean</td>
<td>-</td>
<td>false</td>
</tr>
</tbody>
</table>
<p><code v-pre>tab</code> 지원 옵션에 대한 설명은 다음과 같습니다.</p>
<table>
<thead>
<tr>
<th>Attribute</th>
<th>설명</th>
<th>Type</th>
<th>가능 옵션</th>
<th>기본 옵션</th>
</tr>
</thead>
<tbody>
<tr>
<td>label</td>
<td>Tab의 타이틀</td>
<td>String</td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td>lazy</td>
<td>탭 내용의 지연 랜더링 여부</td>
<td>Boolean</td>
<td>-</td>
<td>false</td>
</tr>
</tbody>
</table>
</div></template>


