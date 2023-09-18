<template><div><h1 id="vault-swlb용도의-nginx" tabindex="-1"><a class="header-anchor" href="#vault-swlb용도의-nginx" aria-hidden="true">#</a> Vault SWLB용도의 nginx</h1>
<ul>
<li>Vault의 HA구성 시에는 LB가 필요한데, LB대용으로 SWLB를 이용하여 Vault를 사용할 수 있다.
<ul>
<li>해당 페이지에서는 nginx를 사용하였지만, HAproxy도 비슷하게 사용이 가능하다.</li>
</ul>
</li>
</ul>
<h1 id="nginx-job-파일" tabindex="-1"><a class="header-anchor" href="#nginx-job-파일" aria-hidden="true">#</a> nginx job 파일</h1>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"nginx"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  group <span class="token string">"nginx"</span> <span class="token punctuation">{</span>

    <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
      <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>unique<span class="token punctuation">.</span>hostname<span class="token punctuation">}</span></span>"</span>
      <span class="token property">value</span>     <span class="token punctuation">=</span> <span class="token string">"slave0"</span>
    <span class="token punctuation">}</span>

    <span class="token comment">#Vault tls가 있고 nomad client hcl 파일에 host volume이 명시되어 있는 설정 값</span>
    volume <span class="token string">"cert-data"</span> <span class="token punctuation">{</span>
      <span class="token property">type</span>      <span class="token punctuation">=</span> <span class="token string">"host"</span>
      <span class="token property">source</span>    <span class="token punctuation">=</span> <span class="token string">"cert-data"</span>
      <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>

    <span class="token comment">#실패 없이 되라고 행운의 숫자인 7을 4번 줌</span>
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span>     <span class="token punctuation">=</span> <span class="token number">7777</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">7777</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"nginx"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"nginx"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">volume_mount</span> <span class="token punctuation">{</span>
        <span class="token property">volume</span>      <span class="token punctuation">=</span> <span class="token string">"cert-data"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/usr/local/cert"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"nginx"</span>

        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"http"</span><span class="token punctuation">]</span>
        <span class="token property">volumes</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"local:/etc/nginx/conf.d"</span>,

        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF        
#Vault는 active서버 1대외에는 전부 standby상태이며 
#서비스 호출 시(write)에는 active 서비스만 호출해야함으로 아래와 같이 consul에서 서비스를 불러옴

upstream backend {
{{ range service "active.vault" }}
  server {{ .Address }}:{{ .Port }};
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}

server {
   listen 7777 ssl;
   #위에서 nomad host volume을 mount한 cert를 가져옴
   ssl on;
   ssl_certificate /usr/local/cert/vault/global-client-vault-0.pem;
   ssl_certificate_key /usr/local/cert/vault/global-client-vault-0-key.pem;
   #vault ui 접근 시 / -> /ui redirect되기 때문에 location이 /외에는 되지 않는다.
   location / {
      proxy_pass https://backend;
   }
}
EOF</span>

        <span class="token property">destination</span>   <span class="token punctuation">=</span> <span class="token string">"local/load-balancer.conf"</span>
        <span class="token property">change_mode</span>   <span class="token punctuation">=</span> <span class="token string">"signal"</span>
        <span class="token property">change_signal</span> <span class="token punctuation">=</span> <span class="token string">"SIGHUP"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">100</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">201</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


