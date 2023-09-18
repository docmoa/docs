<template><div><h1 id="update" tabindex="-1"><a class="header-anchor" href="#update" aria-hidden="true">#</a> update</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>nomad의 배포 방법 중 canary와 rolling update 관련된 내용입니다.</p>
</div>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>...
  <span class="token comment">#canary update - 새로운 버전의 task를 canary 변수의 수만큼 기동시키고 상황에 맞게 확인 후 배포</span>
  group <span class="token string">"canary"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">5</span>

    <span class="token keyword">update</span> <span class="token punctuation">{</span>
      <span class="token property">max_parallel</span>     <span class="token punctuation">=</span> <span class="token number">1</span>
      <span class="token property">canary</span>           <span class="token punctuation">=</span> <span class="token number">1</span>
      <span class="token property">min_healthy_time</span> <span class="token punctuation">=</span> <span class="token string">"30s"</span>
      <span class="token property">healthy_deadline</span> <span class="token punctuation">=</span> <span class="token string">"10m"</span>
      <span class="token comment">#배포 실패시 자동으로 전 버전으로 돌아감(배포 중이던 task 제거됨)</span>
      <span class="token property">auto_revert</span>      <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token comment">#task가 기동되어도 자동으로 다음 버전으로 넘어가지 않음(배포 전 버전 task 제거되지않음)</span>
      <span class="token property">auto_promote</span>     <span class="token punctuation">=</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">#rolling update - 기동 중이던 task를 하나씩(max_parallel만큼) 신규 task로 변환하면서 배포</span>
  group <span class="token string">"api-server"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">6</span>

    <span class="token keyword">update</span> <span class="token punctuation">{</span>
      <span class="token property">max_parallel</span>     <span class="token punctuation">=</span> <span class="token number">2</span>
      <span class="token property">min_healthy_time</span> <span class="token punctuation">=</span> <span class="token string">"30s"</span>
      <span class="token property">healthy_deadline</span> <span class="token punctuation">=</span> <span class="token string">"10m"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">#배포 시 service에 canary로 배포된 task에만 붙일 수 있는 tag 설정</span>
  <span class="token keyword">service</span> <span class="token punctuation">{</span>
    <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>
    <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"canary-deployments"</span>

    <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"live"</span>
    <span class="token punctuation">]</span>

    <span class="token property">canary_tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"canary"</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
...
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


