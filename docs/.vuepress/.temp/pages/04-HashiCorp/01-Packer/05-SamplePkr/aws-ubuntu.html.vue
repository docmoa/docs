<template><div><h1 id="aws-packer-sample-ubuntu" tabindex="-1"><a class="header-anchor" href="#aws-packer-sample-ubuntu" aria-hidden="true">#</a> AWS Packer Sample - Ubuntu</h1>
<h2 id="ubuntu-pkr-hcl" tabindex="-1"><a class="header-anchor" href="#ubuntu-pkr-hcl" aria-hidden="true">#</a> ubuntu.pkr.hcl</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># packer init client.pkr.hcl</span>
<span class="token comment"># packer build -force .</span>

<span class="token keyword">variable<span class="token type variable"> "region" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"ap-northeast-2"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "cni-version" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"1.0.1"</span>
<span class="token punctuation">}</span>

<span class="token keyword">packer</span> <span class="token punctuation">{</span>
  <span class="token keyword">required_plugins</span> <span class="token punctuation">{</span>
    <span class="token property">amazon</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">">= 0.0.2"</span>
      <span class="token property">source</span>  <span class="token punctuation">=</span> <span class="token string">"github.com/hashicorp/amazon"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

source <span class="token string">"amazon-ebs"</span> <span class="token string">"example"</span> <span class="token punctuation">{</span>
  <span class="token property">ami_name</span>      <span class="token punctuation">=</span> <span class="token string">"gs_demo_ubuntu_{{timestamp}}"</span>
  <span class="token property">instance_type</span> <span class="token punctuation">=</span> <span class="token string">"t3.micro"</span>
  <span class="token property">region</span>        <span class="token punctuation">=</span> var.region
  <span class="token keyword">source_ami_filter</span> <span class="token punctuation">{</span>
    <span class="token property">filters</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">name</span>                <span class="token punctuation">=</span> <span class="token string">"ubuntu/images/*ubuntu-bionic-18.04-amd64-server-*"</span>
      <span class="token property">root-device-type</span>    <span class="token punctuation">=</span> <span class="token string">"ebs"</span>
      <span class="token property">virtualization-type</span> <span class="token punctuation">=</span> <span class="token string">"hvm"</span>
    <span class="token punctuation">}</span>
    <span class="token property">most_recent</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
    <span class="token property">owners</span>      <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"099720109477"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">ssh_username</span> <span class="token punctuation">=</span> <span class="token string">"ubuntu"</span>
<span class="token punctuation">}</span>

<span class="token keyword">build</span> <span class="token punctuation">{</span>
  <span class="token property">sources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"source.amazon-ebs.example"</span><span class="token punctuation">]</span>

  <span class="token keyword">provisioner<span class="token type variable"> "file" </span></span><span class="token punctuation">{</span>
    <span class="token property">source</span>      <span class="token punctuation">=</span> <span class="token string">"./file/"</span>
    <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/tmp"</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">provisioner<span class="token type variable"> "shell" </span></span><span class="token punctuation">{</span>
    <span class="token property">inline</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"set -x"</span>,
      <span class="token string">"echo Connected via Consul/Nomad client at \"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>build<span class="token punctuation">.</span>User<span class="token punctuation">}</span></span>@<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>build<span class="token punctuation">.</span>Host<span class="token punctuation">}</span></span>:<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>build<span class="token punctuation">.</span>Port<span class="token punctuation">}</span></span>\""</span>,
      <span class="token string">"sudo apt-get update"</span>,
      <span class="token string">"sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release"</span>,
      <span class="token string">"sudo apt-get update"</span>,
      <span class="token string">"curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -"</span>,
      <span class="token string">"sudo apt-add-repository \"deb [arch=amd64] https://apt.releases.hashicorp.com bionic main\""</span>,
      <span class="token string">"sudo apt-get update &amp;&amp; sudo apt-get -y install consul nomad netcat nginx"</span>,
      <span class="token string">"curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -"</span>,
      <span class="token string">"sudo add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable\""</span>,
      <span class="token string">"sudo apt-get update"</span>,
      <span class="token string">"sudo apt-get install -y docker-ce openjdk-11-jdk"</span>,
      <span class="token string">"curl -sL -o cni-plugins.tgz https://github.com/containernetworking/plugins/releases/download/v<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">cni</span>-version<span class="token punctuation">}</span></span>/cni-plugins-linux-amd64-v<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">cni</span>-version<span class="token punctuation">}</span></span>.tgz"</span>,
      <span class="token string">"sudo mkdir -p /opt/cni/bin"</span>,
      <span class="token string">"sudo tar -C /opt/cni/bin -xzf cni-plugins.tgz"</span>,
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


