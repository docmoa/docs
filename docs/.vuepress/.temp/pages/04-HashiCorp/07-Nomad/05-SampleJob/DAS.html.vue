<template><div><h1 id="dynamic-application-sizing" tabindex="-1"><a class="header-anchor" href="#dynamic-application-sizing" aria-hidden="true">#</a> Dynamic application sizing</h1>
<ul>
<li>Nomad autoscaler 배포 후 사용할 수 있는 기능 중에 하나</li>
<li>Dynamic application sizing(DAS)의 기능이 설정되어 있는 job을 배포 한 이후 autoscaler job에서 resource의 권고를 받아올 수 있음</li>
<li>권고 받은 값을 사용자가 확인 후 허용할 경우 job의 resource의 변화가 정상적으로 적용됨</li>
</ul>
<h2 id="autoscaler-job은-기존에-사용하던-job을-사용" tabindex="-1"><a class="header-anchor" href="#autoscaler-job은-기존에-사용하던-job을-사용" aria-hidden="true">#</a> autoscaler job은 기존에 사용하던 job을 사용</h2>
<ul>
<li><RouterLink to="/04-HashiCorp/07-Nomad/05-SampleJob/DAS.html">AutoScaler job</RouterLink></li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>테스트 및 사용전 확인해야 할 사항은 Nomad의 enterprise, 즉 라이선스가 필요하며, nomad-autosclaer의 경우에도 enterprise여야만 합니다.</p>
</div>
<h3 id="demo-job의-배포" tabindex="-1"><a class="header-anchor" href="#demo-job의-배포" aria-hidden="true">#</a> Demo job의 배포</h3>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"example"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>

  group <span class="token string-literal"><span class="token string">"cache-lb"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>

    network <span class="token punctuation">{</span>
      port <span class="token string-literal"><span class="token string">"lb"</span></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string-literal"><span class="token string">"nginx"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"docker"</span></span>

      config <span class="token punctuation">{</span>
        image <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"nginx"</span></span>
        ports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"lb"</span></span><span class="token punctuation">]</span>
        volumes <span class="token operator">=</span> <span class="token punctuation">[</span>
          <span class="token comment"># It's safe to mount this path as a file because it won't re-render.</span>
          <span class="token string-literal"><span class="token string">"local/nginx.conf:/etc/nginx/nginx.conf"</span></span><span class="token punctuation">,</span>
          <span class="token comment"># This path hosts files that will re-render with Consul Template.</span>
          <span class="token string-literal"><span class="token string">"local/nginx:/etc/nginx/conf.d"</span></span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token comment"># This template overwrites the embedded nginx.conf file so it loads</span>
      <span class="token comment"># conf.d/*.conf files outside of the `http` block.</span>
      template <span class="token punctuation">{</span>
        data        <span class="token operator">=</span> <span class="token string-literal heredoc-string"><span class="token delimiter"><span class="token punctuation">&lt;&lt;</span><span class="token symbol">EOF</span></span><span class="token string">
user  nginx;
worker_processes  1;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;
events {
    worker_connections  1024;
}
include /etc/nginx/conf.d/*.conf;
</span><span class="token delimiter"><span class="token symbol">EOF</span></span></span>
        destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"local/nginx.conf"</span></span>
      <span class="token punctuation">}</span>

      <span class="token comment"># This template creates a TCP proxy to Redis.</span>
      template <span class="token punctuation">{</span>
        data          <span class="token operator">=</span> <span class="token string-literal heredoc-string"><span class="token delimiter"><span class="token punctuation">&lt;&lt;</span><span class="token symbol">EOF</span></span><span class="token string">
stream {
  server {
    listen {{ env "NOMAD_PORT_lb" }};
    proxy_pass backend;
  }
  upstream backend {
  {{ range nomadService "redis" }}
    server {{ .Address }}:{{ .Port }};
  {{ else }}server 127.0.0.1:65535; # force a 502
  {{ end }}
  }
}
</span><span class="token delimiter"><span class="token symbol">EOF</span></span></span>
        destination   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"local/nginx/nginx.conf"</span></span>
        change_mode   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"signal"</span></span>
        change_signal <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"SIGHUP"</span></span>
      <span class="token punctuation">}</span>

      resources <span class="token punctuation">{</span>
        cpu    <span class="token operator">=</span> <span class="token number">50</span>
        memory <span class="token operator">=</span> <span class="token number">10</span>
      <span class="token punctuation">}</span>

      scaling <span class="token string-literal"><span class="token string">"cpu"</span></span> <span class="token punctuation">{</span>
        policy <span class="token punctuation">{</span>
          cooldown            <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"1m"</span></span>
          evaluation_interval <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"10s"</span></span>

          check <span class="token string-literal"><span class="token string">"95pct"</span></span> <span class="token punctuation">{</span>
            strategy <span class="token string-literal"><span class="token string">"app-sizing-percentile"</span></span> <span class="token punctuation">{</span>
              percentile <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"95"</span></span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      scaling <span class="token string-literal"><span class="token string">"mem"</span></span> <span class="token punctuation">{</span>
        policy <span class="token punctuation">{</span>
          cooldown            <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"1m"</span></span>
          evaluation_interval <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"10s"</span></span>

          check <span class="token string-literal"><span class="token string">"max"</span></span> <span class="token punctuation">{</span>
            strategy <span class="token string-literal"><span class="token string">"app-sizing-max"</span></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    service <span class="token punctuation">{</span>
      name         <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"redis-lb"</span></span>
      port         <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"lb"</span></span>
      address_mode <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"host"</span></span>
      provider     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"nomad"</span></span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  group <span class="token string-literal"><span class="token string">"cache"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">3</span>

    network <span class="token punctuation">{</span>
      port <span class="token string-literal"><span class="token string">"db"</span></span> <span class="token punctuation">{</span>
        to <span class="token operator">=</span> <span class="token number">6379</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string-literal"><span class="token string">"redis"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"docker"</span></span>

      config <span class="token punctuation">{</span>
        image <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"redis:6.0"</span></span>
        ports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"db"</span></span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      resources <span class="token punctuation">{</span>
        cpu    <span class="token operator">=</span> <span class="token number">500</span>
        memory <span class="token operator">=</span> <span class="token number">256</span>
      <span class="token punctuation">}</span>

      scaling <span class="token string-literal"><span class="token string">"cpu"</span></span> <span class="token punctuation">{</span>
        policy <span class="token punctuation">{</span>
          cooldown            <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"1m"</span></span>
          evaluation_interval <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"10s"</span></span>

          check <span class="token string-literal"><span class="token string">"95pct"</span></span> <span class="token punctuation">{</span>
            strategy <span class="token string-literal"><span class="token string">"app-sizing-percentile"</span></span> <span class="token punctuation">{</span>
              percentile <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"95"</span></span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      scaling <span class="token string-literal"><span class="token string">"mem"</span></span> <span class="token punctuation">{</span>
        policy <span class="token punctuation">{</span>
          cooldown            <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"1m"</span></span>
          evaluation_interval <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"10s"</span></span>

          check <span class="token string-literal"><span class="token string">"max"</span></span> <span class="token punctuation">{</span>
            strategy <span class="token string-literal"><span class="token string">"app-sizing-max"</span></span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      service <span class="token punctuation">{</span>
        name         <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"redis"</span></span>
        port         <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"db"</span></span>
        address_mode <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"host"</span></span>
        provider     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"nomad"</span></span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="부하-테스트용-job-배포" tabindex="-1"><a class="header-anchor" href="#부하-테스트용-job-배포" aria-hidden="true">#</a> 부하 테스트용 job 배포</h3>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"das-load-test"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>
  type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"batch"</span></span>

  parameterized <span class="token punctuation">{</span>
    payload       <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"optional"</span></span>
    meta_optional <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"requests"</span></span><span class="token punctuation">,</span> <span class="token string-literal"><span class="token string">"clients"</span></span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  group <span class="token string-literal"><span class="token string">"redis-benchmark"</span></span> <span class="token punctuation">{</span>
    task <span class="token string-literal"><span class="token string">"redis-benchmark"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"docker"</span></span>

      config <span class="token punctuation">{</span>
        image   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"redis:6.0"</span></span>
        command <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"redis-benchmark"</span></span>

        args <span class="token operator">=</span> <span class="token punctuation">[</span>
          <span class="token string-literal"><span class="token string">"-h"</span></span><span class="token punctuation">,</span>
          <span class="token string-literal"><span class="token string">"${HOST}"</span></span><span class="token punctuation">,</span>
          <span class="token string-literal"><span class="token string">"-p"</span></span><span class="token punctuation">,</span>
          <span class="token string-literal"><span class="token string">"${PORT}"</span></span><span class="token punctuation">,</span>
          <span class="token string-literal"><span class="token string">"-n"</span></span><span class="token punctuation">,</span>
          <span class="token string-literal"><span class="token string">"${REQUESTS}"</span></span><span class="token punctuation">,</span>
          <span class="token string-literal"><span class="token string">"-c"</span></span><span class="token punctuation">,</span>
          <span class="token string-literal"><span class="token string">"${CLIENTS}"</span></span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      template <span class="token punctuation">{</span>
        destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"secrets/env.txt"</span></span>
        env         <span class="token operator">=</span> <span class="token boolean">true</span>

        data <span class="token operator">=</span> <span class="token string-literal heredoc-string"><span class="token delimiter"><span class="token punctuation">&lt;&lt;</span><span class="token symbol">EOF</span></span><span class="token string">
{{ with nomadService "redis-lb" }}{{ with index . 0 -}}
HOST={{.Address}}
PORT={{.Port}}
{{- end }}{{ end }}
REQUESTS={{ or (env "NOMAD_META_requests") "100000" }}
CLIENTS={{  or (env "NOMAD_META_clients") "50" }}
</span><span class="token delimiter"><span class="token symbol">EOF</span></span></span>
      <span class="token punctuation">}</span>

      resources <span class="token punctuation">{</span>
        cpu    <span class="token operator">=</span> <span class="token number">100</span>
        memory <span class="token operator">=</span> <span class="token number">128</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="부하테스트를-진행하고-nomad-ui에서-optimize의-recommended의-값이-변화하였고-accept를-눌러-줄-경우-target-job의-스펙이-변화합니다" tabindex="-1"><a class="header-anchor" href="#부하테스트를-진행하고-nomad-ui에서-optimize의-recommended의-값이-변화하였고-accept를-눌러-줄-경우-target-job의-스펙이-변화합니다" aria-hidden="true">#</a> 부하테스트를 진행하고 nomad ui에서 Optimize의 Recommended의 값이 변화하였고, Accept를 눌러 줄 경우 target job의 스펙이 변화합니다.</h3>
<figure><img src="@source/04-HashiCorp/07-Nomad/05-SampleJob/image/nomad_das.png" alt="nomad Optimize" tabindex="0" loading="lazy"><figcaption>nomad Optimize</figcaption></figure>
</div></template>


