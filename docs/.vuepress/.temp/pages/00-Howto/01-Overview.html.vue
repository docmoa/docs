<template><div><h1 id="docmoa-활용-가이드" tabindex="-1"><a class="header-anchor" href="#docmoa-활용-가이드" aria-hidden="true">#</a> docmoa 활용 가이드</h1>
<p>문서가 인터넷상에 공개되는 목적은 접근성을 극대화 하기 위함 입니다. 또한 로컬환경에서 빠르게 문서를 검색하기 위해 해당 git repo를 clone 받거나 download 받아서 별도의 마크다운 툴과 연동하는 것도 가능합니다. <code v-pre>VuePress</code> 기반으로 구성되었기 때문에 이외의 방식은 문서 표기에 제약이 있을 수 있습니다.</p>
<h2 id="github-page" tabindex="-1"><a class="header-anchor" href="#github-page" aria-hidden="true">#</a> github page</h2>
<p><a href="https://docmoa.github.io/" target="_blank" rel="noopener noreferrer">docmoa<ExternalLinkIcon/></a>의 공개된 페이지를 통해 문서를 읽을 수 있습니다.</p>
<h2 id="vuepress-local-실행" tabindex="-1"><a class="header-anchor" href="#vuepress-local-실행" aria-hidden="true">#</a> VuePress (Local 실행)</h2>
<p>공개된 페이지는 내 로컬환경에서도 실행할 수 있습니다. Nodejs가 필요합니다.</p>
<CodeTabs id="18" :data='[{"id":"npm"},{"id":"yarn"}]' tab-id="shell">
<template #title0="{ value, isActive }">npm</template>
<template #title1="{ value, isActive }">yarn</template>
<template #tab0="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code><span class="token comment"># git clone</span>
<span class="token function">git</span> clone https://github.com/docmoa/docs.git

<span class="token comment"># npm install</span>
<span class="token builtin class-name">cd</span> docs
<span class="token function">npm</span> <span class="token function">install</span>

<span class="token comment"># start VuePress writing</span>
<span class="token function">npm</span> run dev
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><div class="highlight-line">&nbsp;</div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></template>
<template #tab1="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code><span class="token comment"># git clone</span>
<span class="token function">git</span> clone https://github.com/docmoa/docs.git

<span class="token comment"># npm install</span>
<span class="token builtin class-name">cd</span> docs
<span class="token function">yarn</span> <span class="token function">install</span>

<span class="token comment"># start VuePress writing</span>
<span class="token function">yarn</span> vuepress dev
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><div class="highlight-line">&nbsp;</div></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></template>
</CodeTabs>
<p>실행이 완료되면 로그에 다음과 같은 메시지와 접속할 수 있는 링크가 나타납니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>success [10:48:28] Build 6f9dd7 finished in 1179 ms! ( http://localhost:8000/ )
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>웹브라우저에서 실행시 표기되는 로그의 링크를 입력하면 공개된 웹화면과 동일한 환경을 확인할 수 있습니다.<br>
<img src="@source/00-Howto/image/vuepress.png" alt="" loading="lazy"></p>
<h2 id="typora" tabindex="-1"><a class="header-anchor" href="#typora" aria-hidden="true">#</a> typora</h2>
<p><code v-pre>typora</code>는 멀티 OS를 지원하는 마크다운 에디터/뷰어 입니다. VuePress의 플러그인과 일부 호환되지 않는 표기들이 있으나, 전역 검색이 가능하고 개인 노트를 활용하듯 관리할 수 있습니다.</p>
<ol>
<li>typora.io를 통해 에디터를 다운로드 받고 설치합니다.
<ul>
<li>Release 페이지 : <a href="https://typora.io/releases/all" target="_blank" rel="noopener noreferrer">https://typora.io/releases/all<ExternalLinkIcon/></a></li>
<li>1.0.0 이 릴리즈되면서 유료 모델로 전환되었습니다.</li>
<li>기존 beta 버전의 경우 무료 사용 가능합니다.</li>
</ul>
</li>
<li>docmoa의 소스를 clone/download 합니다.<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/docmoa/docs.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ol>
<p>3.<code v-pre>typora</code>를 실행하고 옵션에서 [파일] &gt; [열기] 를 클릭하여 앞서 받은 소스 디렉토리의 <code v-pre>docs</code> 디렉토리를 열어줍니다.<br>
<img src="@source/00-Howto/image/typora.png" alt="" loading="lazy"></p>
<ol start="4">
<li>전역검색은 다음과 같이 사용 가능합니다.
<ul>
<li>Mac: <button>⌘</button><button>⇧</button>+f</li>
<li>Windows: <button>Ctrl</button><button>Shift</button>+f</li>
</ul>
</li>
</ol>
<h2 id="vs-code" tabindex="-1"><a class="header-anchor" href="#vs-code" aria-hidden="true">#</a> VS Code</h2>
<p><code v-pre>Visual Studio Code</code>에서는 마크다운의 프리뷰를 지원합니다. 앞서 <RouterLink to="/00-Howto/#typora">typora</RouterLink>는 마크다운으로 작성하는 즉시 마크다운 형태로 변경되었다면, <code v-pre>VS Code</code>에서는 좌우 비교하면서 작성한 표현이 어떻게 반영되는지 확인할 수 있습니다.</p>
<ol>
<li>VS Code <a href="https://code.visualstudio.com/Download" target="_blank" rel="noopener noreferrer">Download<ExternalLinkIcon/></a> 사이트에서 환경에 맞는 설치 파일을 다운로드 받고 설치합니다.</li>
<li>docmoa의 소스를 clone/download 합니다.<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">git</span> clone https://github.com/docmoa/docs.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li><code v-pre>VS Code</code>를 실행하고 [파일] &gt; [열기] 를 클릭하여 앞서 받은 소스 디렉토리의 <code v-pre>docs</code> 디렉토리를 열어줍니다.</li>
<li><code v-pre>Preview</code> 버튼을 클릭하면 양쪽으로 비교하면서 글을 확인/편집 할 수 있습니다.<br>
<img src="@source/00-Howto/image/vscode.png" alt="" loading="lazy"></li>
<li>전역검색은 다음과 같이 사용 가능합니다.
<ul>
<li>Mac: <button>⌘</button><button>⇧</button>+f</li>
<li>Windows: <button>Ctrl</button><button>Shift</button>+f</li>
</ul>
</li>
</ol>
</div></template>


