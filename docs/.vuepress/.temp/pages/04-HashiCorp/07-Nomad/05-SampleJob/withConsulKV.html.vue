<template><div><h1 id="consul-kv-sample" tabindex="-1"><a class="header-anchor" href="#consul-kv-sample" aria-hidden="true">#</a> Consul KV Sample</h1>
<p>Consul의 KV에 값을 저장하고 비교하여 task batch를 수행하는 예제</p>
<ul>
<li>curl 을 사용하는 경우<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-X</span> GET http://127.0.0.1:8500/v1/kv/docmoa/commit_date <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> <span class="token string">'.[0].Value | @base64d'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>template의 <code v-pre>key</code>를 사용하는 경우<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token punctuation">{</span><span class="token punctuation">{</span> key <span class="token string">"docmoa/commit_date"</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"gs-mac-docmoa-build"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"home"</span><span class="token punctuation">]</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> <span class="token string">"batch"</span>

  <span class="token keyword">periodic</span> <span class="token punctuation">{</span>
    <span class="token property">cron</span>             <span class="token punctuation">=</span> <span class="token string">"0 */5 * * * * *"</span>
    <span class="token property">prohibit_overlap</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
    <span class="token property">time_zone</span>        <span class="token punctuation">=</span> <span class="token string">"Asia/Seoul"</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
    <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>unique<span class="token punctuation">.</span>consul<span class="token punctuation">.</span>name<span class="token punctuation">}</span></span>"</span>
    <span class="token property">value</span>     <span class="token punctuation">=</span> <span class="token string">"my-macbook-air"</span>
  <span class="token punctuation">}</span>

  group <span class="token string">"docmoa-build"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    task <span class="token string">"git-pull"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"raw_exec"</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
#!/bin/sh
cd /Users/gslee/workspaces/docs
git pull origin main
        EOH</span>

        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"git.sh"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"git.sh"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">lifecycle</span> <span class="token punctuation">{</span>
        <span class="token property">hook</span>    <span class="token punctuation">=</span> <span class="token string">"prestart"</span>
        <span class="token property">sidecar</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    task <span class="token string">"build"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"raw_exec"</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
#!/bin/sh
LAST_COMMIT_DATE=$(curl https://api.github.com/repos/docmoa/docs/branches/main | jq -r '.commit.commit.committer.date')
#STORE_COMMIT_DATE=$(curl -X GET http://127.0.0.1:8500/v1/kv/docmoa/commit_date | jq -r '.[0].Value | @base64d')
STORE_COMMIT_DATE={{ key "docmoa/commit_date" }}
echo "LAST_COMMIT_DATE = $LAST_COMMIT_DATE"
echo "STORE_COMMIT_DATE = $STORE_COMMIT_DATE"
if [ $LAST_COMMIT_DATE != $STORE_COMMIT_DATE ]; then
  echo "do deploy"
  # something todo...
  # update new value
  curl -X PUT --data $LAST_COMMIT_DATE http://127.0.0.1:8500/v1/kv/docmoa/commit_date
else
  echo "no change"
fi
        EOH</span>

        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"build.sh"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"build.sh"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">1000</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">256</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


