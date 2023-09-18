<template><div><h1 id="aws-packer-sample-windows" tabindex="-1"><a class="header-anchor" href="#aws-packer-sample-windows" aria-hidden="true">#</a> AWS Packer Sample - Windows</h1>
<blockquote>
<p>참고 : <a href="https://learn.hashicorp.com/tutorials/packer/aws-windows-image?in=packer/integrations" target="_blank" rel="noopener noreferrer">Build a Windows Image<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="windows-pkr-hcl" tabindex="-1"><a class="header-anchor" href="#windows-pkr-hcl" aria-hidden="true">#</a> windows.pkr.hcl</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "region" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"ap-northeast-2"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "cni-version" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"1.0.1"</span>
<span class="token punctuation">}</span>

<span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">nomad_url</span>  <span class="token punctuation">=</span> <span class="token string">"https://releases.hashicorp.com/nomad/1.2.3/nomad_1.2.3_windows_amd64.zip"</span>
  <span class="token property">consul_url</span> <span class="token punctuation">=</span> <span class="token string">"https://releases.hashicorp.com/consul/1.11.1/consul_1.11.1_windows_amd64.zip"</span>
  <span class="token property">jre_url</span>    <span class="token punctuation">=</span> <span class="token string">"https://github.com/adoptium/temurin11-binaries/releases/download/jdk-11.0.13%2B8/OpenJDK11U-jre_x64_windows_hotspot_11.0.13_8.zip"</span>
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
  <span class="token property">ami_name</span>      <span class="token punctuation">=</span> <span class="token string">"gs_demo_windows_{{timestamp}}"</span>
  <span class="token property">communicator</span>  <span class="token punctuation">=</span> <span class="token string">"winrm"</span>
  <span class="token property">instance_type</span> <span class="token punctuation">=</span> <span class="token string">"t2.micro"</span>
  <span class="token property">region</span>        <span class="token punctuation">=</span> var.region
  <span class="token keyword">source_ami_filter</span> <span class="token punctuation">{</span>
    <span class="token property">filters</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">name</span>                <span class="token punctuation">=</span> <span class="token string">"*Windows_Server-2019-English-Full-Base*"</span>
      <span class="token property">root-device-type</span>    <span class="token punctuation">=</span> <span class="token string">"ebs"</span>
      <span class="token property">virtualization-type</span> <span class="token punctuation">=</span> <span class="token string">"hvm"</span>
    <span class="token punctuation">}</span>
    <span class="token property">most_recent</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
    <span class="token property">owners</span>      <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"amazon"</span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
  <span class="token property">user_data_file</span> <span class="token punctuation">=</span> <span class="token string">"./bootstrap_win.txt"</span>
  <span class="token property">winrm_password</span> <span class="token punctuation">=</span> <span class="token string">"SuperS3cr3t!!!!"</span>
  <span class="token property">winrm_username</span> <span class="token punctuation">=</span> <span class="token string">"Administrator"</span>
<span class="token punctuation">}</span>

<span class="token keyword">build</span> <span class="token punctuation">{</span>
  <span class="token property">sources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"source.amazon-ebs.example"</span><span class="token punctuation">]</span>

  <span class="token keyword">provisioner<span class="token type variable"> "powershell" </span></span><span class="token punctuation">{</span>
    <span class="token property">inline</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"New-Item \"C:\\temp\" -ItemType Directory"</span>,
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// provisioner "file" {</span>
  <span class="token comment">//   source = "./file/"</span>
  <span class="token comment">//   destination = "/tmp"</span>
  <span class="token comment">// }</span>

  <span class="token keyword">provisioner<span class="token type variable"> "powershell" </span></span><span class="token punctuation">{</span>
    <span class="token property">inline</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token string">"New-Item \"C:\\hashicorp\\jre\\\" -ItemType Directory"</span>,
      <span class="token string">"New-Item \"C:\\hashicorp\\consul\\bin\\\" -ItemType Directory"</span>,
      <span class="token string">"New-Item \"C:\\hashicorp\\consul\\data\\\" -ItemType Directory"</span>,
      <span class="token string">"New-Item \"C:\\hashicorp\\consul\\conf\\\" -ItemType Directory"</span>,
      <span class="token string">"New-Item \"C:\\hashicorp\\nomad\\bin\\\" -ItemType Directory"</span>,
      <span class="token string">"New-Item \"C:\\hashicorp\\nomad\\data\\\" -ItemType Directory"</span>,
      <span class="token string">"New-Item \"C:\\hashicorp\\nomad\\conf\\\" -ItemType Directory"</span>,
      <span class="token string">"Invoke-WebRequest -Uri <span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">jre_url</span><span class="token punctuation">}</span></span> -OutFile $env:TEMP\\jre.zip"</span>,
      <span class="token string">"Invoke-WebRequest -Uri <span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">consul_url</span><span class="token punctuation">}</span></span> -OutFile $env:TEMP\\consul.zip"</span>,
      <span class="token string">"Invoke-WebRequest -Uri <span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">nomad_url</span><span class="token punctuation">}</span></span> -OutFile $env:TEMP\\nomad.zip"</span>,
      <span class="token string">"Expand-Archive $env:TEMP\\jre.zip -DestinationPath C:\\hashicorp\\jre\\"</span>,
      <span class="token string">"Expand-Archive $env:TEMP\\consul.zip -DestinationPath C:\\hashicorp\\consul\\bin\\"</span>,
      <span class="token string">"Expand-Archive $env:TEMP\\nomad.zip -DestinationPath C:\\hashicorp\\nomad\\bin\\"</span>,
      <span class="token string">"[Environment]::SetEnvironmentVariable(\"Path\", $env:Path + \";C:\\hashicorp\\jre\\jdk-11.0.13+8-jre\\bin;C:\\hashicorp\\nomad\\bin;C:\\hashicorp\\consul\\bin\", \"Machine\")"</span>,
      <span class="token comment">// "$old = (Get-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Control\\Session Manager\\Environment' -Name path).path",</span>
      <span class="token comment">// "$new = \"$old;C:\\hashicorp\\jre\\jdk-11.0.13+8-jre\\bin;C:\\hashicorp\\nomad\\bin;C:\\hashicorp\\consul\\bin\"",</span>
      <span class="token comment">// "Set-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\\System\\CurrentControlSet\\Control\\Session Manager\\Environment' -Name path -Value $new",</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="bootstrap-win-txt" tabindex="-1"><a class="header-anchor" href="#bootstrap-win-txt" aria-hidden="true">#</a> bootstrap_win.txt</h2>
<div class="language-powershell line-numbers-mode" data-ext="powershell"><pre v-pre class="language-powershell"><code>&lt;powershell>
<span class="token comment"># Set administrator password</span>
net user Administrator SuperS3cr3t!<span class="token operator">!</span><span class="token operator">!</span><span class="token operator">!</span>
wmic useraccount where <span class="token string">"name='Administrator'"</span> <span class="token function">set</span> PasswordExpires=FALSE

<span class="token comment"># First, make sure WinRM can't be connected to</span>
netsh advfirewall firewall <span class="token function">set</span> rule name=<span class="token string">"Windows Remote Management (HTTP-In)"</span> new enable=yes action=block

<span class="token comment"># Delete any existing WinRM listeners</span>
winrm delete winrm/config/listener?Address=<span class="token operator">*</span><span class="token operator">+</span>Transport=HTTP  2><span class="token variable">$Null</span>
winrm delete winrm/config/listener?Address=<span class="token operator">*</span><span class="token operator">+</span>Transport=HTTPS 2><span class="token variable">$Null</span>

<span class="token comment"># Disable group policies which block basic authentication and unencrypted login</span>

<span class="token function">Set-ItemProperty</span> <span class="token operator">-</span>Path HKLM:\Software\Policies\Microsoft\Windows\WinRM\Client <span class="token operator">-</span>Name AllowBasic <span class="token operator">-</span>Value 1
<span class="token function">Set-ItemProperty</span> <span class="token operator">-</span>Path HKLM:\Software\Policies\Microsoft\Windows\WinRM\Client <span class="token operator">-</span>Name AllowUnencryptedTraffic <span class="token operator">-</span>Value 1
<span class="token function">Set-ItemProperty</span> <span class="token operator">-</span>Path HKLM:\Software\Policies\Microsoft\Windows\WinRM\Service <span class="token operator">-</span>Name AllowBasic <span class="token operator">-</span>Value 1
<span class="token function">Set-ItemProperty</span> <span class="token operator">-</span>Path HKLM:\Software\Policies\Microsoft\Windows\WinRM\Service <span class="token operator">-</span>Name AllowUnencryptedTraffic <span class="token operator">-</span>Value 1


<span class="token comment"># Create a new WinRM listener and configure</span>
winrm create winrm/config/listener?Address=<span class="token operator">*</span><span class="token operator">+</span>Transport=HTTP
winrm <span class="token function">set</span> winrm/config/winrs <span class="token string">'@{MaxMemoryPerShellMB="0"}'</span>
winrm <span class="token function">set</span> winrm/config <span class="token string">'@{MaxTimeoutms="7200000"}'</span>
winrm <span class="token function">set</span> winrm/config/service <span class="token string">'@{AllowUnencrypted="true"}'</span>
winrm <span class="token function">set</span> winrm/config/service <span class="token string">'@{MaxConcurrentOperationsPerUser="12000"}'</span>
winrm <span class="token function">set</span> winrm/config/service/auth <span class="token string">'@{Basic="true"}'</span>
winrm <span class="token function">set</span> winrm/config/client/auth <span class="token string">'@{Basic="true"}'</span>

<span class="token comment"># Configure UAC to allow privilege elevation in remote shells</span>
<span class="token variable">$Key</span> = <span class="token string">'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System'</span>
<span class="token variable">$Setting</span> = <span class="token string">'LocalAccountTokenFilterPolicy'</span>
<span class="token function">Set-ItemProperty</span> <span class="token operator">-</span>Path <span class="token variable">$Key</span> <span class="token operator">-</span>Name <span class="token variable">$Setting</span> <span class="token operator">-</span>Value 1 <span class="token operator">-</span>Force

<span class="token comment"># Configure and restart the WinRM Service; Enable the required firewall exception</span>
<span class="token function">Stop-Service</span> <span class="token operator">-</span>Name WinRM
<span class="token function">Set-Service</span> <span class="token operator">-</span>Name WinRM <span class="token operator">-</span>StartupType Automatic
netsh advfirewall firewall <span class="token function">set</span> rule name=<span class="token string">"Windows Remote Management (HTTP-In)"</span> new action=allow localip=any remoteip=any
<span class="token function">Start-Service</span> <span class="token operator">-</span>Name WinRM
&lt;<span class="token operator">/</span>powershell>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


