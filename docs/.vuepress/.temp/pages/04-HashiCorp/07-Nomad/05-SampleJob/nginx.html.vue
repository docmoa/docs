<template><div><h1 id="nginx" tabindex="-1"><a class="header-anchor" href="#nginx" aria-hidden="true">#</a> nginx</h1>
<ul>
<li>nomad와 consul로 cluster로 구성되어 있는 환경에 L4이후에 nomad로 LB를 해야할 경우 사용
<ul>
<li>nginx server_name설정에서 도메인을 받아오고 location에서는 각각의 서브도메인 별로 reverse proxy 동작
<ul>
<li>reverse proxy(up stream)에서는 각각의 consul의 등록된 서비스 호출</li>
</ul>
</li>
</ul>
</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"nginx"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  group <span class="token string">"nginx"</span> <span class="token punctuation">{</span>
    <span class="token comment">//인증서는 host volume에 업로드</span>
    volume <span class="token string">"certs"</span> <span class="token punctuation">{</span>
      <span class="token property">type</span>      <span class="token punctuation">=</span> <span class="token string">"host"</span>
      <span class="token property">source</span>    <span class="token punctuation">=</span> <span class="token string">"certs"</span>
      <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span>
 
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span>  <span class="token punctuation">=</span> <span class="token number">80</span>
        <span class="token property">to</span>      <span class="token punctuation">=</span> <span class="token number">80</span>
      <span class="token punctuation">}</span>
      port <span class="token string">"https"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span>      <span class="token punctuation">=</span> <span class="token number">443</span>
        <span class="token property">static</span>  <span class="token punctuation">=</span> <span class="token number">443</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"nginx"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>
      <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"web"</span><span class="token punctuation">]</span>
      <span class="token keyword">check</span> <span class="token punctuation">{</span>    
        <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
        <span class="token property">port</span>     <span class="token punctuation">=</span> <span class="token string">"http"</span>
        <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"2s"</span>
        <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"server"</span> <span class="token punctuation">{</span>

      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">volume_mount</span> <span class="token punctuation">{</span>
        <span class="token property">volume</span>      <span class="token punctuation">=</span> <span class="token string">"certs"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/etc/nginx/certs"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"nginx"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"http"</span>,<span class="token string">"https"</span><span class="token punctuation">]</span>
        <span class="token comment">#ports = ["http","https"]</span>
        <span class="token property">volumes</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"local:/etc/nginx/conf.d"</span>,
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF

upstream login.shoping.co.kr {
{{ range service "login" }}
  server {{ .Address }}:{{ .Port }};
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}
upstream singup.shoping.co.kr {
{{ range service "signup" }}
  server {{ .Address }}:{{ .Port }};
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}
upstream main.shoping.co.kr {
{{ range service "main" }}
  server {{ .Address }}:{{ .Port }};
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}

server {
   listen 80;
   listen 443 ssl;
   //domain 및 subdomain호출
   server_name *.shoping.co.kr;
   ssl_certificate "/etc/nginx/certs/server.pem";
   ssl_certificate_key "/etc/nginx/certs/server.key";
   proxy_read_timeout      300;
   proxy_buffers           64 16k;

   //각 sub도메인별
   location / {
      if ($host = login.shoping.co.kr) {
        proxy_pass login.shoping.co.kr;
      }
      if ($host = singup.shoping.co.kr) {
        proxy_pass singup.shoping.co.kr;
      }
      if ($host !~ "(.*main)") {
        proxy_pass main.shoping.co.kr;
      }
   }
}



EOF</span>

        <span class="token property">destination</span>   <span class="token punctuation">=</span> <span class="token string">"local/load-balancer.conf"</span>
        <span class="token property">change_mode</span>   <span class="token punctuation">=</span> <span class="token string">"signal"</span>
        <span class="token property">change_signal</span> <span class="token punctuation">=</span> <span class="token string">"SIGHUP"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">2000</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">2000</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


