<template><div><h1 id="azure-packer-sample" tabindex="-1"><a class="header-anchor" href="#azure-packer-sample" aria-hidden="true">#</a> Azure Packer Sample</h1>
<h2 id="packer-pkr-hcl" tabindex="-1"><a class="header-anchor" href="#packer-pkr-hcl" aria-hidden="true">#</a> packer.pkr.hcl</h2>
<ul>
<li><code v-pre>vault()</code>는 vault 연동시 사용가능 : <a href="https://www.packer.io/docs/templates/hcl_templates/functions/contextual/vault" target="_blank" rel="noopener noreferrer">https://www.packer.io/docs/templates/hcl_templates/functions/contextual/vault<ExternalLinkIcon/></a></li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># packer init -upgrade .</span>
<span class="token comment"># packer build -force .</span>

<span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">client_id</span> <span class="token punctuation">=</span> vault(<span class="token string">"/kv/data/azure"</span>, <span class="token string">"client_id"</span>)
  <span class="token property">client_secret</span> <span class="token punctuation">=</span> vault(<span class="token string">"/kv/data/azure"</span>, <span class="token string">"client_secret"</span>)
  <span class="token property">tenant_id</span> <span class="token punctuation">=</span> vault(<span class="token string">"/kv/data/azure"</span>, <span class="token string">"tenant_id"</span>)
  <span class="token property">subscription_id</span> <span class="token punctuation">=</span> vault(<span class="token string">"/kv/data/azure"</span>, <span class="token string">"subscription_id"</span>)
  <span class="token property">resource_group_name</span> <span class="token punctuation">=</span> var.resource_name
  <span class="token property">virtual_network_name</span> <span class="token punctuation">=</span> <span class="token string">"kbid-d-krc-vnet-002"</span>
  <span class="token property">virtual_network_subnet_name</span>  <span class="token punctuation">=</span> <span class="token string">"d-mgmt-snet-001"</span>
  <span class="token property">virtual_network_resource_group_name</span>  <span class="token punctuation">=</span> <span class="token string">"kbid-d-krc-mgmt-rg"</span>
  <span class="token property">timestamp</span> <span class="token punctuation">=</span> formatdate(<span class="token string">"YYYYMMDD_hhmmss"</span>, timeadd(timestamp(), <span class="token string">"9h"</span>)) <span class="token comment">#생성되는 이미지 이름을 time 기반으로 생성</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "placeholder" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"placekitten.com"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"Image-as-a-service URL. Some other fun ones to try are fillmurray.com, placecage.com, placebeard.it, loremflickr.com, baconmockup.com, placeimg.com, placebear.com, placeskull.com, stevensegallery.com, placedog.net"</span>
<span class="token punctuation">}</span>

<span class="token comment"># Basic example : https://www.packer.io/docs/builders/azure/arm#basic-example</span>
<span class="token comment"># MS Guide : https://docs.microsoft.com/ko-kr/azure/virtual-machines/linux/build-image-with-packer</span>
source <span class="token string">"azure-arm"</span> <span class="token string">"basic-example"</span> <span class="token punctuation">{</span>
  <span class="token property">client_id</span> <span class="token punctuation">=</span> local.client_id
  <span class="token property">client_secret</span> <span class="token punctuation">=</span> local.client_secret
  <span class="token property">subscription_id</span> <span class="token punctuation">=</span> local.subscription_id
  <span class="token property">tenant_id</span> <span class="token punctuation">=</span> local.tenant_id

  <span class="token comment"># shared_image_gallery {</span>
  <span class="token comment">#   subscription = local.subscription_id</span>
  <span class="token comment">#   resource_group = "myrg"</span>
  <span class="token comment">#   gallery_name = "GalleryName"</span>
  <span class="token comment">#   image_name = "gs_pkr_${local.timestamp}"</span>
  <span class="token comment">#   image_version = "1.0.0"</span>
  <span class="token comment"># }</span>
  <span class="token property">managed_image_resource_group_name</span> <span class="token punctuation">=</span> local.resource_group_name
  <span class="token property">managed_image_name</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">image_name</span><span class="token punctuation">}</span></span>-<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">timestamp</span><span class="token punctuation">}</span></span>"</span>

  <span class="token property">os_type</span> <span class="token punctuation">=</span> <span class="token string">"Linux"</span>
  <span class="token comment"># az vm image list-publishers --location koreacentral --output table</span>
  <span class="token property">image_publisher</span> <span class="token punctuation">=</span> <span class="token string">"RedHat"</span>
  <span class="token comment"># az vm image list-offers --location koreacentral --publisher RedHat --output table</span>
  <span class="token property">image_offer</span> <span class="token punctuation">=</span> <span class="token string">"RHEL"</span>
  <span class="token comment"># az vm image list-skus --location koreacentral --publisher RedHat --offer RHEL --output table</span>
  <span class="token property">image_sku</span> <span class="token punctuation">=</span> <span class="token string">"8_4"</span>

  <span class="token property">azure_tags</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">dept</span> <span class="token punctuation">=</span> <span class="token string">"KBHC Terraform POC"</span>
  <span class="token punctuation">}</span>
  
  <span class="token comment"># az vm list-skus --location koreacentral --all --output table</span>
  <span class="token property">build_resource_group_name</span> <span class="token punctuation">=</span> local.resource_group_name

  <span class="token comment">#########################################</span>
  <span class="token comment"># 기존 생성되어있는 network 를 사용하기 위한 항목 #</span>
  <span class="token comment">#########################################</span>
  <span class="token property">virtual_network_name</span> <span class="token punctuation">=</span> local.virtual_network_name
  <span class="token property">virtual_network_subnet_name</span> <span class="token punctuation">=</span> local.virtual_network_subnet_name
  <span class="token property">virtual_network_resource_group_name</span> <span class="token punctuation">=</span> local.virtual_network_resource_group_name
  
  <span class="token comment"># location = "koreacentral"</span>
  <span class="token property">vm_size</span> <span class="token punctuation">=</span> <span class="token string">"Standard_A2_v2"</span>
<span class="token punctuation">}</span>

<span class="token keyword">build</span> <span class="token punctuation">{</span>
  <span class="token property">sources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"sources.azure-arm.basic-example"</span><span class="token punctuation">]</span>

  <span class="token keyword">provisioner<span class="token type variable"> "file" </span></span><span class="token punctuation">{</span>
    <span class="token property">source</span>      <span class="token punctuation">=</span> <span class="token string">"./files/"</span>
    <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/tmp"</span>
  <span class="token punctuation">}</span>

<span class="token comment"># Vault OTP</span>
  <span class="token keyword">provisioner<span class="token type variable"> "shell" </span></span><span class="token punctuation">{</span>
    <span class="token property">inline</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"sudo cp /tmp/sshd /etc/pam.d/sshd"</span>,
      <span class="token string">"sudo cp /tmp/sshd_config /etc/ssh/sshd_config"</span>,
      <span class="token string">"sudo mkdir -p /etc/vault.d"</span>,
      <span class="token string">"sudo cp /tmp/vault.hcl /etc/vault.d/vault.hcl"</span>,
      <span class="token string">"sudo cp /tmp/vault-ssh-helper /usr/bin/vault-ssh-helper"</span>,
      <span class="token string">"echo \"=== Vault_Check ===\""</span>,
      <span class="token string">"curl http://10.0.9.10:8200"</span>,
      <span class="token string">"/usr/bin/vault-ssh-helper -verify-only -config=/etc/vault.d/vault.hcl -dev"</span>,
      <span class="token string">"echo \"=== Add User ===\""</span>,
      <span class="token string">"sudo adduser jboss"</span>,
      <span class="token string">"echo password | sudo passwd --stdin jboss"</span>,
      <span class="token string">"echo 'jboss ALL=(ALL) NOPASSWD: ALL' | sudo tee -a /etc/sudoers"</span>,
      <span class="token string">"echo \"=== SELINUX DISABLE ===\""</span>,
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
      <span class="token string">"sudo PLACEHOLDER=<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">placeholder</span><span class="token punctuation">}</span></span> WIDTH=600 HEIGHT=800 PREFIX=gs /tmp/deploy_app.sh"</span>,
      <span class="token string">"sudo firewall-cmd --zone=public --permanent --add-port=80/tcp"</span>,
      <span class="token string">"sudo firewall-cmd --reload"</span>,
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="deploy-app-sh-option" tabindex="-1"><a class="header-anchor" href="#deploy-app-sh-option" aria-hidden="true">#</a> deploy_app.sh (option)</h2>
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


