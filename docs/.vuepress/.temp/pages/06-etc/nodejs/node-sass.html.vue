<template><div><h1 id="node-sass와-sass로의-전환" tabindex="-1"><a class="header-anchor" href="#node-sass와-sass로의-전환" aria-hidden="true">#</a> node-sass와 sass로의 전환</h1>
<p>aarch64에서 vuepress 실행을 위해 테스트를 하던 도중 node-gyp와 node-sass에 대한 오류를 맞이하게 되었다.</p>
<p>node-sass의 경우 arm환경에 대한 빌드 릴리즈가 없는 관계로 <code v-pre>npm install</code>을 실행하면 다시 빌드를 하게되는데, 이때 node-sass를 빌드하는 과정에서 빌드 실패가 발생함</p>
<h2 id="node-sass란" tabindex="-1"><a class="header-anchor" href="#node-sass란" aria-hidden="true">#</a> node-sass란?</h2>
<p>node환경에서 sass는 css 코드로 변환해주는 스타일 전처리언어이다. c/c++로 되어있는 구성요소로 인해 빠른 빌드 속도를 제공한다.</p>
<h2 id="node-sass와-nodejs-버전별-호환성" tabindex="-1"><a class="header-anchor" href="#node-sass와-nodejs-버전별-호환성" aria-hidden="true">#</a> node-sass와 Nodejs 버전별 호환성</h2>
<p>관련 내용을 찾다보면 Node 버전에 맞는 node-sass를 사용해야 한다고 나오는데 그 이유는 <code v-pre>libsass</code> 때문이고 c/c++로 되어있는 해당 라이브러리 특성상 Node 버전과 실행 환경에 종속적이다.</p>
<blockquote>
<p>node-sass 지원 환경 (<a href="https://github.com/sass/node-sass/releases" target="_blank" rel="noopener noreferrer">https://github.com/sass/node-sass/releases<ExternalLinkIcon/></a>)</p>
<table>
<thead>
<tr>
<th>OS</th>
<th>Architecture</th>
<th>Node</th>
</tr>
</thead>
<tbody>
<tr>
<td>Windows</td>
<td>x86 &amp; x64</td>
<td>12, 14, 16, 17</td>
</tr>
<tr>
<td>OSX</td>
<td>x64</td>
<td>12, 14, 16, 17</td>
</tr>
<tr>
<td>Linux</td>
<td>64</td>
<td>12, 14, 16, 17</td>
</tr>
<tr>
<td>Alpine Linux</td>
<td>x64</td>
<td>12, 14, 16, 17</td>
</tr>
<tr>
<td>FreeBSD</td>
<td>i386 &amp; x64</td>
<td>12, 14</td>
</tr>
</tbody>
</table>
</blockquote>
<p>추가로 node-sass는 항후 Dart Sass로 옮겨진다로 안내되어있음</p>
<p><a href="https://github.com/sass/node-sass" target="_blank" rel="noopener noreferrer">https://github.com/sass/node-sass<ExternalLinkIcon/></a></p>
<h2 id="dart-sass-로의-전환" tabindex="-1"><a class="header-anchor" href="#dart-sass-로의-전환" aria-hidden="true">#</a> Dart Sass 로의 전환</h2>
<p>stackoverflow에서 기존 node-sass를 사용하고 있는 경우 해당 프로젝트를 Dart Sass로 전환하는 선언 방식을 알려줬다.</p>
<p><a href="https://stackoverflow.com/a/70171361" target="_blank" rel="noopener noreferrer">https://stackoverflow.com/a/70171361<ExternalLinkIcon/></a></p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">npm</span> remove node-sass
<span class="token function">npm</span> i node-sass@npm:sass <span class="token parameter variable">-D</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>package.json</code>에 다음과 같이 추가된다.</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code>  <span class="token property">"devDependencies"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"node-sass"</span><span class="token operator">:</span> <span class="token string">"npm:sass@^1.55.0"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


