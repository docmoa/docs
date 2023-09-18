<template><div><h1 id="naver-cloud-platform-packer-sample" tabindex="-1"><a class="header-anchor" href="#naver-cloud-platform-packer-sample" aria-hidden="true">#</a> Naver Cloud Platform Packer Sample</h1>
<h2 id="packer-pkr-hcl" tabindex="-1"><a class="header-anchor" href="#packer-pkr-hcl" aria-hidden="true">#</a> packer.pkr.hcl</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">packer</span> <span class="token punctuation">{</span>
  <span class="token keyword">required_plugins</span> <span class="token punctuation">{</span>
    <span class="token property">ncloud</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">">= 0.0.1"</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"github.com/hashicorp/ncloud"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

source <span class="token string">"ncloud"</span> <span class="token string">"example-linux"</span> <span class="token punctuation">{</span>
  <span class="token property">access_key</span>                <span class="token punctuation">=</span> var.access_key
  <span class="token property">secret_key</span>                <span class="token punctuation">=</span> var.secret_key
  <span class="token property">server_image_product_code</span> <span class="token punctuation">=</span> <span class="token string">"SPSW0LINUX000139"</span>
  <span class="token property">server_product_code</span>       <span class="token punctuation">=</span> <span class="token string">"SPSVRGPUSSD00001"</span>
  <span class="token property">server_image_name</span>         <span class="token punctuation">=</span> var.image_name
  <span class="token property">server_image_description</span>  <span class="token punctuation">=</span> <span class="token string">"server image description"</span>
  <span class="token property">region</span>                    <span class="token punctuation">=</span> <span class="token string">"Korea"</span>
  <span class="token property">communicator</span>              <span class="token punctuation">=</span> <span class="token string">"ssh"</span>
  <span class="token property">ssh_username</span>              <span class="token punctuation">=</span> <span class="token string">"root"</span>
<span class="token punctuation">}</span>

<span class="token keyword">build</span> <span class="token punctuation">{</span>
  <span class="token property">sources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"source.ncloud.example-linux"</span><span class="token punctuation">]</span>

  <span class="token keyword">provisioner<span class="token type variable"> "file" </span></span><span class="token punctuation">{</span>
    <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"jupyter.service"</span>
    <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/etc/systemd/system/jupyter.service"</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">provisioner<span class="token type variable"> "shell" </span></span><span class="token punctuation">{</span>
    <span class="token property">inline</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"yum clean all"</span>,
      <span class="token string">"yum -y install epel-release"</span>,
      <span class="token string">"yum -y install python3"</span>,
      <span class="token string">"yum -y install python-pip"</span>,
      <span class="token string">"pip3 install --upgrade pip"</span>,
      <span class="token string">"adduser jupyter"</span>,
      <span class="token string">"su - jupyter"</span>,
      <span class="token string">"pip3 install --user jupyter jupyter"</span>,
      <span class="token string">"systemctl enable jupyter"</span>,
      <span class="token string">"systemctl start jupyter"</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "access_key" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span>    <span class="token punctuation">=</span> string
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "secret_key" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span>    <span class="token punctuation">=</span> string
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "image_name" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span>    <span class="token punctuation">=</span> string
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"test"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


