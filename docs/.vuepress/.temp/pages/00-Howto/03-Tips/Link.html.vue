<template><div><h1 id="link" tabindex="-1"><a class="header-anchor" href="#link" aria-hidden="true">#</a> Link</h1>
<p>문서 작성시 외부 링크를 포함하는 예를 설명합니다. <a href="https://www.markdownguide.org/basic-syntax/#links" target="_blank" rel="noopener noreferrer">참고 문서<ExternalLinkIcon/></a></p>
<h2 id="텍스트에-링크-달기" tabindex="-1"><a class="header-anchor" href="#텍스트에-링크-달기" aria-hidden="true">#</a> 텍스트에 링크 달기</h2>
<p>설명하던 글의 특정 단어에 대해 외부 링크를 추가하고자 하는 경우 브라킷<code v-pre>[ ]</code>과 괄호를 사용합니다. domain을 같이 기입하는 경우 새창에서 열기로 표기됩니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>새창으로 이동하는 <span class="token url">[<span class="token content">링크 달기</span>](<span class="token url">http://docmoa.github.io/00-Howto/03-Tips/Link.html</span>)</span>
현재 창에서 이동하는 <span class="token url">[<span class="token content">링크 달기</span>](<span class="token url">/00-Howto/03-Tips/Link.html</span>)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>다음과 같이 표기됩니다.</p>
<ul>
<li>새창으로 이동하는 <a href="http://docmoa.github.io/00-Howto/03-Tips/Link.html" target="_blank" rel="noopener noreferrer">링크 달기<ExternalLinkIcon/></a></li>
<li>현재 창에서 이동하는 <RouterLink to="/00-Howto/03-Tips/Link.html">링크 달기</RouterLink></li>
</ul>
<h2 id="링크-자체를-표기" tabindex="-1"><a class="header-anchor" href="#링크-자체를-표기" aria-hidden="true">#</a> 링크 자체를 표기</h2>
<p>별도의 연결된 단어 없이 링크 자체를 넣는 경우 <code v-pre>&lt; &gt;</code>를 사용합니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>&lt;https://docmoa.github.io>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>docmoa@gmail.com</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>다음과 같이 표기됩니다.</p>
<ul>
<li><em><strong><a href="https://docmoa.github.io" target="_blank" rel="noopener noreferrer">https://docmoa.github.io<ExternalLinkIcon/></a></strong></em></li>
<li><em><strong><a href="mailto:docmoa@gmail.com">docmoa@gmail.com</a></strong></em></li>
</ul>
<h2 id="이미지" tabindex="-1"><a class="header-anchor" href="#이미지" aria-hidden="true">#</a> 이미지</h2>
<p>이미지는 <code v-pre>!</code>를 기존 링크 문법 앞에 추가합니다.</p>
<ul>
<li>대체 텍스트는 이미지 링크에 접속할 수 없는 경우 표기됩니다.</li>
<li>이미지 설명은 마우스 오버시 확인하실 수 있습니다.</li>
</ul>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>![대체 텍스트](이미지 링크 "이미지 설명")

![](https://icons.iconarchive.com/icons/fatcow/farm-fresh/32/layout-link-icon.png)
<span class="token url"><span class="token operator">!</span>[<span class="token content">대체 텍스트</span>](<span class="token url">https://img.icons8.com/ios/2x/깨진링크</span>)</span>
<span class="token url"><span class="token operator">!</span>[<span class="token content">대체 텍스트</span>](<span class="token url">https://icons.iconarchive.com/icons/fatcow/farm-fresh/32/report-link-icon.png</span> <span class="token string">"이미지 설명"</span>)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>다음과 같이 표기됩니다.</p>
<ul>
<li><img src="https://icons.iconarchive.com/icons/fatcow/farm-fresh/32/layout-link-icon.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></li>
<li><img src="https://img.icons8.com/ios/2x/깨진링크" alt="대체 텍스트" tabindex="0" loading="lazy"><figcaption>대체 텍스트</figcaption></li>
<li><img src="https://icons.iconarchive.com/icons/fatcow/farm-fresh/32/report-link-icon.png" alt="대체 텍스트" tabindex="0" loading="lazy"><figcaption>이미지 설명</figcaption></li>
</ul>
<h2 id="동영상" tabindex="-1"><a class="header-anchor" href="#동영상" aria-hidden="true">#</a> 동영상</h2>
<p>외부 동영상은 html 문법을 활용하여 추가할 수 있습니다. 여기서는 유튜브를 예를 들어 설명합니다. 다른 여러가지 방식은 <a href="https://vuepress-examples.netlify.app/demos/video/" target="_blank" rel="noopener noreferrer">참고 링크<ExternalLinkIcon/></a>를 확인해주세요.</p>
<ul>
<li><code v-pre>공유</code>버튼을 누르고 <code v-pre>퍼가기</code> 를 클릭하면 우측에 동영상 퍼가기 코드가 나타납니다.<br>
<img src="@source/00-Howto/image/youtube_share.gif" alt="Youtube Share 설명" loading="lazy"></li>
<li>코드를 복사하고 그대로 파일 내에 붙여넣습니다.</li>
</ul>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>iframe</span> <span class="token attr-name">width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>560<span class="token punctuation">"</span></span> <span class="token attr-name">height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>315<span class="token punctuation">"</span></span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>https://www.youtube.com/embed/StTqXEQ2l-Y<span class="token punctuation">"</span></span> <span class="token attr-name">title</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>YouTube video player<span class="token punctuation">"</span></span> <span class="token attr-name">frameborder</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>0<span class="token punctuation">"</span></span> <span class="token attr-name">allow</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture<span class="token punctuation">"</span></span> <span class="token attr-name">allowfullscreen</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>iframe</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>다음과 같이 표기됩니다.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/StTqXEQ2l-Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div></template>


