<template><div><h1 id="nomad-ingress-gateway" tabindex="-1"><a class="header-anchor" href="#nomad-ingress-gateway" aria-hidden="true">#</a> Nomad ingress gateway</h1>
<h2 id="nomad-job으로-ingress-gateway-사용하기-with-consul" tabindex="-1"><a class="header-anchor" href="#nomad-job으로-ingress-gateway-사용하기-with-consul" aria-hidden="true">#</a> Nomad job으로 ingress gateway 사용하기 (with consul)</h2>
<ul>
<li>consul로 설정하는 ingress gateway가 아닌 Nomad job 기동 시에 ingress gateway 활성화 예제
<ul>
<li>hashicorp 공식 예제가 아닌 다른 걸 해보려하다, 특이한 부분을 확인함</li>
</ul>
</li>
</ul>
<h3 id="테스트-job-python-fastapi" tabindex="-1"><a class="header-anchor" href="#테스트-job-python-fastapi" aria-hidden="true">#</a> 테스트 job (python fastapi)</h3>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"22-fastapi"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  group <span class="token string">"fastapi"</span> <span class="token punctuation">{</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"bridge"</span>
      <span class="token comment">#service가 80으로 뜸, 만약 다른 포트로 뜨는 서비스를 사용 할 경우 image와 to만 변경</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token number">80</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"fastapi"</span>
      <span class="token comment">#여기서 port에 위에서 미리 선언한 http를 쓸 경우 다이나믹한 port를 가져오는데 </span>
      <span class="token comment">#그럴 경우 ingress gateway에서 못 읽어 온다.</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"80"</span>
      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        sidecar_service<span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"fastapi"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"tiangolo/uvicorn-gunicorn-fastapi"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"http"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">500</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">282</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">scaling</span>  <span class="token punctuation">{</span>
      <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token property">min</span>     <span class="token punctuation">=</span> <span class="token number">1</span>
      <span class="token property">max</span>     <span class="token punctuation">=</span> <span class="token number">3</span>

      <span class="token keyword">policy</span> <span class="token punctuation">{</span>
        <span class="token property">evaluation_interval</span> <span class="token punctuation">=</span> <span class="token string">"5s"</span>
        <span class="token property">cooldown</span>            <span class="token punctuation">=</span> <span class="token string">"1m"</span>
        <span class="token comment">#driver = "nomad-apm"</span>
        check <span class="token string">"mem_allocated_percentage"</span> <span class="token punctuation">{</span>
          <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"nomad-apm"</span>
          <span class="token property">query</span>  <span class="token punctuation">=</span> <span class="token string">"max_memory"</span>

          strategy <span class="token string">"target-value"</span> <span class="token punctuation">{</span>
            <span class="token property">target</span> <span class="token punctuation">=</span> <span class="token number">80</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="만약-service가-http로-떠야한다면-아래와-같이-service등록도-진행해야한다" tabindex="-1"><a class="header-anchor" href="#만약-service가-http로-떠야한다면-아래와-같이-service등록도-진행해야한다" aria-hidden="true">#</a> 만약 service가 http로 떠야한다면 아래와 같이 service등록도 진행해야한다.</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token property">Kind</span>      <span class="token punctuation">=</span> <span class="token string">"service-defaults"</span>
<span class="token property">Name</span>      <span class="token punctuation">=</span> <span class="token string">"fastapi"</span>
<span class="token property">Namespace</span> <span class="token punctuation">=</span> <span class="token string">"default"</span>
<span class="token property">Protocol</span>  <span class="token punctuation">=</span> <span class="token string">"http"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ingress-job" tabindex="-1"><a class="header-anchor" href="#ingress-job" aria-hidden="true">#</a> ingress job</h2>
<ul>
<li>사실 하나의 job으로 만들어도 되는데 테스트 시 계속 두개의 job이 재기동되어서 둘로 나눔</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"ingress-demo"</span> <span class="token punctuation">{</span>

  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  group <span class="token string">"ingress-group"</span> <span class="token punctuation">{</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"bridge"</span>
      <span class="token comment">#backend job인 fastapi의 port를 넣어줌</span>
      port <span class="token string">"inbound"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span>     <span class="token punctuation">=</span> <span class="token number">80</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"my-ingress-service"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"inbound"</span>

      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">gateway</span> <span class="token punctuation">{</span>

          <span class="token keyword">proxy</span> <span class="token punctuation">{</span>
          <span class="token punctuation">}</span>
          <span class="token keyword">ingress</span> <span class="token punctuation">{</span>
            <span class="token keyword">listener</span> <span class="token punctuation">{</span>
              <span class="token comment">#backend job인 fastapi의 port를 넣어줌</span>
              <span class="token property">port</span>     <span class="token punctuation">=</span> <span class="token number">80</span>
              <span class="token comment">#protocol = "http"</span>
              <span class="token property">protocol</span> <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
              <span class="token keyword">service</span> <span class="token punctuation">{</span>
                <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"fastapi"</span>
              <span class="token comment">#  hosts = ["*"]</span>
              <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


