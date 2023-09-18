<template><div><h1 id="google-cloud-platform-packer-sample" tabindex="-1"><a class="header-anchor" href="#google-cloud-platform-packer-sample" aria-hidden="true">#</a> Google Cloud Platform Packer Sample</h1>
<h2 id="packer-pkr-hcl" tabindex="-1"><a class="header-anchor" href="#packer-pkr-hcl" aria-hidden="true">#</a> packer.pkr.hcl</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "base_image" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"ubuntu-1804-bionic-v20210415"</span>
<span class="token punctuation">}</span>
<span class="token keyword">variable<span class="token type variable"> "project" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"gs-test-282101"</span>
<span class="token punctuation">}</span>
<span class="token keyword">variable<span class="token type variable"> "region" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"asia-northeast2"</span>
<span class="token punctuation">}</span>
<span class="token keyword">variable<span class="token type variable"> "zone" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"asia-northeast2-a"</span>
<span class="token punctuation">}</span>
<span class="token keyword">variable<span class="token type variable"> "image_name" </span></span><span class="token punctuation">{</span>
  
<span class="token punctuation">}</span>
<span class="token keyword">variable<span class="token type variable"> "placeholder" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"placekitten.com"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"Image-as-a-service URL. Some other fun ones to try are fillmurray.com, placecage.com, placebeard.it, loremflickr.com, baconmockup.com, placeimg.com, placebear.com, placeskull.com, stevensegallery.com, placedog.net"</span>
<span class="token punctuation">}</span>

source <span class="token string">"googlecompute"</span> <span class="token string">"basic-example"</span> <span class="token punctuation">{</span>
  <span class="token property">project_id</span> <span class="token punctuation">=</span> var.project
  <span class="token property">source_image</span> <span class="token punctuation">=</span> var.base_image
  <span class="token property">ssh_username</span> <span class="token punctuation">=</span> <span class="token string">"ubuntu"</span>
  <span class="token property">zone</span> <span class="token punctuation">=</span> var.zone
  <span class="token property">disk_size</span> <span class="token punctuation">=</span> <span class="token number">10</span>
  <span class="token property">disk_type</span> <span class="token punctuation">=</span> <span class="token string">"pd-ssd"</span>
  <span class="token property">image_name</span> <span class="token punctuation">=</span> var.image_name
<span class="token punctuation">}</span>

<span class="token keyword">build</span> <span class="token punctuation">{</span>
  <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"packer"</span>
  source <span class="token string">"sources.googlecompute.basic-example"</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"packer"</span>
  <span class="token punctuation">}</span>

  provisioner <span class="token string">"file"</span><span class="token punctuation">{</span>
    <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"./files"</span>
    <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/tmp/"</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">provisioner<span class="token type variable"> "shell" </span></span><span class="token punctuation">{</span>
    <span class="token property">inline</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"sudo apt-get -y update"</span>,
      <span class="token string">"sleep 15"</span>,
      <span class="token string">"sudo apt-get -y update"</span>,
      <span class="token string">"sudo apt-get -y install apache2"</span>,
      <span class="token string">"sudo systemctl enable apache2"</span>,
      <span class="token string">"sudo systemctl start apache2"</span>,
      <span class="token string">"sudo chown -R ubuntu:ubuntu /var/www/html"</span>,
      <span class="token string">"chmod +x /tmp/files/*.sh"</span>,
      <span class="token string">"PLACEHOLDER=<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">placeholder</span><span class="token punctuation">}</span></span> WIDTH=600 HEIGHT=800 PREFIX=gs /tmp/files/deploy_app.sh"</span>,
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


