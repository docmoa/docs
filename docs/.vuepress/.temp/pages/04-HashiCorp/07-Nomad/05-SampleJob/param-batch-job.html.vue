<template><div><h1 id="param-batch-job" tabindex="-1"><a class="header-anchor" href="#param-batch-job" aria-hidden="true">#</a> param-batch-job</h1>
<ul>
<li>parameter를 받아와서 해당 값을 이용하여 다음으로 실행될 job의 값을 다이나믹하게 넣어 만드는 샘플
<ul>
<li>meta_required에 원하는 값을 넣고 template에 env &quot;NOMAD_META_메타명(key)&quot;와 같이 넣어주면 된다.</li>
</ul>
</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"24-paramete"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"batch"</span>

  <span class="token keyword">parameterized</span> <span class="token punctuation">{</span>
    <span class="token property">payload</span>       <span class="token punctuation">=</span> <span class="token string">"forbidden"</span>
    <span class="token property">meta_required</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"room_num"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  group <span class="token string">"run-main-job"</span> <span class="token punctuation">{</span>

    task <span class="token string">"run-main-job"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"raw_exec"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"nomad"</span>
        <span class="token comment"># arguments</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"job"</span>, <span class="token string">"run"</span>, <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_TASK_DIR<span class="token punctuation">}</span></span>/room.job"</span> <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH

#####################

job "{{ env "NOMAD_META_room_num" }}" {
    datacenters = ["dc1"]

    group "jboss" {

        network {
            port "http" {
                to = "8080"
            }
        }
        service {
            port = "http"
            name = "{{ env "NOMAD_META_room_num" }}"
            check {
                type     = "tcp"
                interval = "10s"
                timeout  = "2s"
            }
        }
        task "http" {
            driver = "docker"
            config {
                image = "jboss/wildfly"
                ports = ["http"]
            }
            resources {
                cpu    = 500
                memory = 282
            }
        }
    }
}

EOH</span>
    <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/room.job"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


