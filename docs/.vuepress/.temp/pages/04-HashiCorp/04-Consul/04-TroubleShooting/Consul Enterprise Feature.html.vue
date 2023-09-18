<template><div><h1 id="identifying-consul-split-brain" tabindex="-1"><a class="header-anchor" href="#identifying-consul-split-brain" aria-hidden="true">#</a> Identifying consul split-brain</h1>
<blockquote>
<p><a href="https://support.hashicorp.com/hc/en-us/articles/360058026733-Identifying-and-Recovering-from-a-Consul-Split-Brain" target="_blank" rel="noopener noreferrer">https://support.hashicorp.com/hc/en-us/articles/360058026733-Identifying-and-Recovering-from-a-Consul-Split-Brain<ExternalLinkIcon/></a></p>
</blockquote>
<ol>
<li>다음을 실행하여 각 서버에서 Consul 서버 로그를 확인</li>
</ol>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>consul monitor -log-level<span class="token operator">=</span>debug
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2">
<li>Server들이 투표하는 로그 라인을 확인합니다. 다음과 같이 보여야 합니다.:</li>
</ol>
<p>==정상적인 경우</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>2020/10/19 16:21:23 [INFO] raft: Node at 10.90.168.42:8300 [Candidate] entering Candidate state in term 3732
2020/10/19 16:21:23 [DEBUG] raft: Votes needed: 2
2020/10/19 16:21:23 [DEBUG] raft: Vote granted from foobar in term 3732. Tally: 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>== 비 정상적인 경우</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>2020/10/19 16:28:53 [WARN] raft: Election timeout reached, restarting election
2020/10/19 16:28:53 [INFO] raft: Node at 00.00.000.00:8300 [Candidate] entering Candidate state in term 992
2020/10/19 16:28:53 [DEBUG] raft: Votes needed: 2
2020/10/19 16:28:53 [DEBUG] raft: Vote granted from foobar2 in term 992. Tally: 1
2020/10/19 16:28:53 [ERR] raft: Failed to make RequestVote RPC to {Voter &lt;Voter ID>)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>복구 시 정상화된 로그
020/10/19 16:29:04 [WARN] raft: Election timeout reached, restarting election
2020/10/19 16:29:04 [INFO] raft: Node at 00.00.000.00:8300 [Candidate] entering Candidate state in term 989
2020/10/19 16:29:04 [DEBUG] raft: Votes needed: 2
2020/10/19 16:29:04 [DEBUG] raft: Vote granted from &lt;ID> in term 989. Tally: 1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


