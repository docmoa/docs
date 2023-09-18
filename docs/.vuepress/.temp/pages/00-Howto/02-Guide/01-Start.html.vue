<template><div><h1 id="문서작성-시작" tabindex="-1"><a class="header-anchor" href="#문서작성-시작" aria-hidden="true">#</a> 문서작성 '시작'</h1>
<p>docmoa에 문서 기여하기위한 가이드를 설명합니다.</p>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>다양한 방법으로 문서를 작성하고 기여할 수 있습니다.<br>
얽매이지 마세요.</p>
</div>
<p>문서는 모두 git으로 관리되며 공개되어있습니다. <RouterLink to="/00-Howto/02-Guide/02-Contribute.html">문서 기여를 위한 방식</RouterLink>은 별도 안내로 구분하여 설명합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/docmoa/docs.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>또는 github에서 fork하여 별도 관리 후 pull request 하여도 좋습니다.</p>
<h2 id="디렉토리-구조-이해하기" tabindex="-1"><a class="header-anchor" href="#디렉토리-구조-이해하기" aria-hidden="true">#</a> 디렉토리 구조 이해하기</h2>
<p>clone 받은 구조는 VuePress의 구조를 갖고 있습니다. 문서의 기준이 되는 디렉토리는 <code v-pre>docs</code> 입니다.</p>
<p>::: vue<br>
.<br>
├── .gitignore<br>
├── <a href="http://LICENSE.md" target="_blank" rel="noopener noreferrer">LICENSE.md<ExternalLinkIcon/></a><br>
├── <a href="http://README.md" target="_blank" rel="noopener noreferrer">README.md<ExternalLinkIcon/></a><br>
├── <code v-pre>docs</code><br>
│   ├── .vuepress<br>
│   ├── 00-Howto<br>
│   ├── 01-Infra<br>
│   ├── 02-PrivatePlatform<br>
│   ├── 03-PublicCloud<br>
│   ├── 04-HashiCorp<br>
│   ├── 05-etc<br>
│   ├── 98-tag<br>
│   ├── 99-about<br>
│   └── <a href="http://README.md" target="_blank" rel="noopener noreferrer">README.md<ExternalLinkIcon/></a><br>
└── package.json<br>
:::</p>
<h3 id="기존-환경을-로컬에서-실행하고-확인하기" tabindex="-1"><a class="header-anchor" href="#기존-환경을-로컬에서-실행하고-확인하기" aria-hidden="true">#</a> 기존 환경을 로컬에서 실행하고 확인하기</h3>
<p>브라우저에서 보여지는 화면을 실시간으로 확인하기 위해 로컬환경에서 Vewpress를 실행합니다. Nodejs가 필요합니다.</p>
<CodeTabs id="33" :data='[{"id":"npm"},{"id":"yarn"}]' tab-id="shell">
<template #title0="{ value, isActive }">npm</template>
<template #title1="{ value, isActive }">yarn</template>
<template #tab0="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code><span class="token comment"># 클론 받은 디렉토리 이동 후 npm install</span>
<span class="token builtin class-name">cd</span> docs
<span class="token function">npm</span> <span class="token function">install</span>

<span class="token comment"># start VuePress writing</span>
<span class="token function">npm</span> run dev
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></template>
<template #tab1="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code><span class="token comment"># 클론 받은 디렉토리 이동 후 npm install</span>
<span class="token builtin class-name">cd</span> docs
<span class="token function">yarn</span> <span class="token function">install</span>

<span class="token comment"># start VuePress writing</span>
<span class="token function">yarn</span> vuepress dev
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></template>
</CodeTabs>
<p>실행이 완료되면 로그에 다음과 같은 메시지와 접속할 수 있는 링크가 나타납니다.<br>
::: vue<br>
success [10:48:28] Build 6f9dd7 finished in 1179 ms! ( <code v-pre>http://localhost:8000/</code> )<br>
:::</p>
<p>웹브라우저에서 실행시 표기되는 로그의 링크를 입력하면 공개된 웹화면과 동일한 환경을 확인할 수 있습니다.</p>
<figure><img src="@source/00-Howto/image/vuepress.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<h3 id="문서-트리" tabindex="-1"><a class="header-anchor" href="#문서-트리" aria-hidden="true">#</a> 문서 트리</h3>
<p><code v-pre>docs</code> 디렉토리 내에 기존에 구성된 항목 내에 작성도 가능하고 새로운 카테고리를 생성할 수도 있습니다. 디렉토리와 파일은 생성된 순서와 관계없이 정렬되기 때문에 좌측 <code v-pre>Sidebar</code> 표기시 원하는 순서대로 표기되기를 원하는 경우 <code v-pre>{숫자}-</code> 을 파일명 앞에 붙여 의도한대로 표시되도록 구성가능합니다.</p>
<p>예를 들어 <code v-pre>Howto</code>에 작성된 내용을 바탕으로 설명합니다.<br>
::: vue<br>
00-Howto<br>
├── <code v-pre>01-Overview.md</code><br>
├── <code v-pre>02-Guide</code><br>
│   ├── <a href="http://01-Start.md" target="_blank" rel="noopener noreferrer">01-Start.md<ExternalLinkIcon/></a><br>
│   ├── <a href="http://02-PullRequest.md" target="_blank" rel="noopener noreferrer">02-PullRequest.md<ExternalLinkIcon/></a><br>
│   └── <a href="http://03-Fork.md" target="_blank" rel="noopener noreferrer">03-Fork.md<ExternalLinkIcon/></a><br>
├── <code v-pre>03-Tips</code><br>
│   ├── <a href="http://CodeBlock.md" target="_blank" rel="noopener noreferrer">CodeBlock.md<ExternalLinkIcon/></a><br>
│   ├── <a href="http://Link.md" target="_blank" rel="noopener noreferrer">Link.md<ExternalLinkIcon/></a><br>
│   └── <a href="http://TipBox.md" target="_blank" rel="noopener noreferrer">TipBox.md<ExternalLinkIcon/></a><br>
└── <code v-pre>README.md</code><br>
:::</p>
<ul>
<li>파일과 디렉토리 구분없이 같은 Depth에 위치하는 경우 함께 표기 됩니다.
<ul>
<li><a href="http://01.Overview.md" target="_blank" rel="noopener noreferrer">01.Overview.md<ExternalLinkIcon/></a> (파일)</li>
<li>02.문서작성가이드 (디렉토리)</li>
<li>03.문서작성팁 (디렉토리)</li>
</ul>
</li>
<li>README.md는 <code v-pre>index.html</code>과 같이 해당 디렉토리의 기본 페이지로 등록됩니다. 디렉토리 경로만 입력하는 경우 해당 페이지가 나타납니다.
<ul>
<li>요청하는 페이지 경로 : <code v-pre>https://docmoa.github.io/00-Howto/</code></li>
<li>실제하는 페이지 경로 : <code v-pre>https://docmoa.github.io/00-Howto/README.md</code></li>
</ul>
</li>
</ul>
<div class="hint-container warning">
<p class="hint-container-title">디렉토리 이름</p>
<p>디렉토리 이름에 공백이 있는 경우 다른 문서에서 참조 시 공백 문자인 <code v-pre>%20</code> 를 표기해야 하는 이슈가 발생할 수 있습니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>[](https://docmoa.github.io/00-Howto/공백이%20있는%20디렉토리)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></div>
<h2 id="첫번째-글-쓰기" tabindex="-1"><a class="header-anchor" href="#첫번째-글-쓰기" aria-hidden="true">#</a> 첫번째 글 쓰기</h2>
<p>여기서는 <code v-pre>SSH Too many authentication failures</code> 와 관련한 간단한 글을 개시하는 것을 예로 설명하겠습니다.<br>
실제 VuePress 환경으로 어떤 내용이 표기되는지 동적인 확인을 위해 앞서 <RouterLink to="/00-Howto/02-Guide/01-Start.html#%EA%B8%B0%EC%A1%B4-%ED%99%98%EA%B2%BD%EC%9D%84-%EB%A1%9C%EC%BB%AC%EC%97%90%EC%84%9C-%EC%8B%A4%ED%96%89%ED%95%98%EA%B3%A0-%ED%99%95%EC%9D%B8%ED%95%98%EA%B8%B0">기존 환경을 로컬에서 실행하고 확인하기</RouterLink>에서 처럼 화면을 띄우고 작업하면 실제 작성하는 글들이 어떻게 보여지는지도 함께 확인할 수 있습니다.</p>
<ol>
<li>
<p><code v-pre>Linux</code> 카테고리로 가정하고 <code v-pre>01.Infra &gt; Linux &gt; TroubleShooting</code> 이라는 디렉토리를 생성합니다.</p>
</li>
<li>
<p>문서 작성을 위한 <code v-pre>SSH Too many authentication failures.md</code> 파일을 생성합니다.</p>
<ul>
<li>파일 이름과는 별개로 본문상의 <code v-pre>Title</code>이 메뉴에 표기됩니다.</li>
</ul>
</li>
<li>
<p>문서 내용에는 문서 기본 서문(Frontmatter)을 작성하기 위한 <code v-pre>---</code>로 구성된 블록이 최상단에 명시됩니다. 내용은 기존 마크다운 문서를 작성하는 것과 동일하게 구성합니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code><span class="token front-matter-block"><span class="token punctuation">---</span>

<span class="token punctuation">---</span></span>

<span class="token title important"><span class="token punctuation">#</span> SSH Too many authentication failures (제목인 Title은 h1 스타일로)</span>

너무많은 인증 실패로 인한 SSH 접속이 안되는 메시지를 간혹 보게되는 경우가 있다.
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>생략</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>참고할 기본 포맷 내용은 <a href="">기본 문서 포맷</a> 설명에서 확인할 수 있습니다.</li>
</ul>
</li>
</ol>
<h2 id="내가-쓴-문서를-docmoa에-개시-요청하기" tabindex="-1"><a class="header-anchor" href="#내가-쓴-문서를-docmoa에-개시-요청하기" aria-hidden="true">#</a> 내가 쓴 문서를 docmoa에 개시 요청하기</h2>
<p>작성한 문서를 docmoa에 기여하는 방법은 다음 <RouterLink to="/00-Howto/02-Guide/02-contribute.html">Contribute</RouterLink> 항목에서 설명합니다.</p>
</div></template>


