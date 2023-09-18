<template><div><h1 id="alibaba-cloud-packer-sample" tabindex="-1"><a class="header-anchor" href="#alibaba-cloud-packer-sample" aria-hidden="true">#</a> Alibaba Cloud Packer Sample</h1>
<h2 id="packer-pkr-hcl" tabindex="-1"><a class="header-anchor" href="#packer-pkr-hcl" aria-hidden="true">#</a> packer.pkr.hcl</h2>
<ul>
<li><code v-pre>vault()</code>는 vault 연동시 사용가능 : <a href="https://www.packer.io/docs/templates/hcl_templates/functions/contextual/vault" target="_blank" rel="noopener noreferrer">https://www.packer.io/docs/templates/hcl_templates/functions/contextual/vault<ExternalLinkIcon/></a></li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># packer build -force .</span>

<span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">access_key</span> <span class="token punctuation">=</span> vault(<span class="token string">"/kv-v2/data/alicloud"</span>, <span class="token string">"access_key"</span>)
  <span class="token property">secret_key</span> <span class="token punctuation">=</span> vault(<span class="token string">"/kv-v2/data/alicloud"</span>, <span class="token string">"secret_key"</span>)
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "region" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"ap-southeast-1"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"https://www.alibabacloud.com/help/doc-detail/40654.htm"</span>
<span class="token punctuation">}</span>

source <span class="token string">"alicloud-ecs"</span> <span class="token string">"basic-example"</span> <span class="token punctuation">{</span>
  <span class="token property">access_key</span>           <span class="token punctuation">=</span> local.access_key
  <span class="token property">secret_key</span>           <span class="token punctuation">=</span> local.secret_key
  <span class="token property">region</span>               <span class="token punctuation">=</span> var.region
  <span class="token property">image_name</span>           <span class="token punctuation">=</span> <span class="token string">"ssh_otp_image_1_5"</span>
  <span class="token property">source_image</span>         <span class="token punctuation">=</span> <span class="token string">"centos_7_9_x64_20G_alibase_20210623.vhd"</span>
  <span class="token property">ssh_username</span>         <span class="token punctuation">=</span> <span class="token string">"root"</span>
  <span class="token property">instance_type</span>        <span class="token punctuation">=</span> <span class="token string">"ecs.n1.tiny"</span>
  <span class="token property">io_optimized</span>         <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">internet_charge_type</span> <span class="token punctuation">=</span> <span class="token string">"PayByTraffic"</span>
  <span class="token property">image_force_delete</span>   <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token keyword">build</span> <span class="token punctuation">{</span>
  <span class="token property">sources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"sources.alicloud-ecs.basic-example"</span><span class="token punctuation">]</span>

  <span class="token keyword">provisioner<span class="token type variable"> "file" </span></span><span class="token punctuation">{</span>
    <span class="token property">source</span>      <span class="token punctuation">=</span> <span class="token string">"./files/"</span>
    <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/tmp"</span>
  <span class="token punctuation">}</span>

<span class="token comment"># Vault OTP</span>
  <span class="token keyword">provisioner<span class="token type variable"> "shell" </span></span><span class="token punctuation">{</span>
    <span class="token property">inline</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"cp /tmp/sshd /etc/pam.d/sshd"</span>,
      <span class="token string">"cp /tmp/sshd_config /etc/ssh/sshd_config"</span>,
      <span class="token string">"mkdir -p /etc/vault.d"</span>,
      <span class="token string">"cp /tmp/vault.hcl /etc/vault.d/vault.hcl"</span>,
      <span class="token string">"cp /tmp/vault-ssh-helper /usr/bin/vault-ssh-helper"</span>,
      <span class="token string">"/usr/bin/vault-ssh-helper -verify-only -config=/etc/vault.d/vault.hcl -dev"</span>,
      <span class="token string">"sudo adduser test"</span>,
      <span class="token string">"echo password | passwd --stdin test"</span>,
      <span class="token string">"echo 'test ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers"</span>,
      <span class="token string">"sudo sed -ie 's/SELINUX=enforcing/SELINUX=disabled /g' /etc/selinux/config"</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

<span class="token comment"># Apache</span>
  <span class="token keyword">provisioner<span class="token type variable"> "shell" </span></span><span class="token punctuation">{</span>
    <span class="token property">inline</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"sudo yum -y update"</span>,
      <span class="token string">"sleep 15"</span>,
      <span class="token string">"sudo yum -y update"</span>,
      <span class="token string">"sudo yum -y install httpd"</span>,
      <span class="token string">"sudo systemctl enable httpd"</span>,
      <span class="token string">"sudo systemctl start httpd"</span>,
      <span class="token string">"chmod +x /tmp/deploy_app.sh"</span>,
      <span class="token string">"PLACEHOLDER=<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">placeholder</span><span class="token punctuation">}</span></span> WIDTH=600 HEIGHT=800 PREFIX=gs /tmp/deploy_app.sh"</span>,
      <span class="token comment"># "sudo firewall-cmd --zone=public --permanent --add-port=80/tcp",</span>
      <span class="token comment"># "sudo firewall-cmd --reload",</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "placeholder" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"placekitten.com"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"Image-as-a-service URL. Some other fun ones to try are fillmurray.com, placecage.com, placebeard.it, loremflickr.com, baconmockup.com, placeimg.com, placebear.com, placeskull.com, stevensegallery.com, placedog.net"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="deploy-app-sh-option" tabindex="-1"><a class="header-anchor" href="#deploy-app-sh-option" aria-hidden="true">#</a> deploy_app.sh (option)</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token shebang important">#!/bin/bash</span>
<span class="token comment"># Script to deploy a very simple web application.</span>
<span class="token comment"># The web app has a customizable image and some text.</span>

<span class="token function">cat</span> <span class="token operator">&lt;&lt;</span> <span class="token string">EOM<span class="token bash punctuation"> <span class="token operator">></span> /var/www/html/index.html</span>
&lt;html>
  &lt;head>&lt;title>Meow!&lt;/title>&lt;/head>
  &lt;body>
  &lt;div style="width:800px;margin: 0 auto">

  &lt;!-- BEGIN -->
  &lt;center>&lt;img src="http://<span class="token variable">${PLACEHOLDER}</span>/<span class="token variable">${WIDTH}</span>/<span class="token variable">${HEIGHT}</span>">&lt;/img>&lt;/center>
  &lt;center>&lt;h2>Meow World!&lt;/h2>&lt;/center>
  Welcome to <span class="token variable">${PREFIX}</span>'s app. Replace this text with your own.
  &lt;!-- END -->

  &lt;/div>
  &lt;/body>
&lt;/html>
EOM</span>

<span class="token builtin class-name">echo</span> <span class="token string">"Script complete."</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


