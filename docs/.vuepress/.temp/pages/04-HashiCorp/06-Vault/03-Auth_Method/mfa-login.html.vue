<template><div><h1 id="mfa-login-with-vault-totp" tabindex="-1"><a class="header-anchor" href="#mfa-login-with-vault-totp" aria-hidden="true">#</a> MFA Login with Vault TOTP</h1>
<blockquote>
<p>HashiCorp Learn - Login MFA : <a href="https://learn.hashicorp.com/tutorials/vault/multi-factor-authentication" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/vault/multi-factor-authentication<ExternalLinkIcon/></a><br>
Configure TOTP MFA Method : <a href="https://www.vaultproject.io/api-docs/secret/identity/mfa/totp" target="_blank" rel="noopener noreferrer">https://www.vaultproject.io/api-docs/secret/identity/mfa/totp<ExternalLinkIcon/></a><br>
Vault Login MFA Overview : <a href="https://www.vaultproject.io/docs/auth/login-mfa" target="_blank" rel="noopener noreferrer">https://www.vaultproject.io/docs/auth/login-mfa<ExternalLinkIcon/></a><br>
1.10.3+ recommend : <a href="https://discuss.hashicorp.com/t/vault-1-10-3-released/39394" target="_blank" rel="noopener noreferrer">https://discuss.hashicorp.com/t/vault-1-10-3-released/39394<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="env-setup" tabindex="-1"><a class="header-anchor" href="#env-setup" aria-hidden="true">#</a> ENV Setup</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token assign-left variable">ROOT_TOKEN</span><span class="token operator">=</span>hvs<span class="token punctuation">..</span>.
$ <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span>https://<span class="token operator">&lt;</span>your-vault-addr<span class="token operator">></span>:8200
$ <span class="token assign-left variable">MY_PASSWORD</span><span class="token operator">=</span>password

<span class="token comment"># If you have NAMESPACE with Enterprise</span>
$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_NAMESPACE</span><span class="token operator">=</span>admin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="enable-username-and-password-auth-method" tabindex="-1"><a class="header-anchor" href="#enable-username-and-password-auth-method" aria-hidden="true">#</a> Enable username and password auth method</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span><span class="token variable">$ROOT_TOKEN</span> vault auth <span class="token builtin class-name">enable</span> userpass

$ <span class="token assign-left variable">USERPASS_ACCESSOR</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>$ROOT_TOKEN vault auth list <span class="token operator">|</span> <span class="token function">grep</span> userpass <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">'{print $3}'</span><span class="token variable">)</span></span>

$ <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span><span class="token variable">$ROOT_TOKEN</span> vault <span class="token function">write</span> auth/userpass/users/admin <span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token variable">$MY_PASSWORD</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="create-an-entity-and-alias" tabindex="-1"><a class="header-anchor" href="#create-an-entity-and-alias" aria-hidden="true">#</a> Create an entity and alias</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token assign-left variable">ENTITY_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>$ROOT_TOKEN vault <span class="token function">write</span> <span class="token parameter variable">-field</span><span class="token operator">=</span>id identity/entity <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">"admin"</span><span class="token variable">)</span></span>

<span class="token builtin class-name">echo</span> <span class="token variable">$ENTITY_ID</span>

$ <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span><span class="token variable">$ROOT_TOKEN</span> vault <span class="token function">write</span> identity/entity-alias <span class="token punctuation">\</span>
    <span class="token assign-left variable">name</span><span class="token operator">=</span><span class="token string">"admin"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">canonical_id</span><span class="token operator">=</span><span class="token string">"<span class="token variable">$ENTITY_ID</span>"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">mount_accessor</span><span class="token operator">=</span><span class="token string">"<span class="token variable">$USERPASS_ACCESSOR</span>"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="enable-mfa-method-totp" tabindex="-1"><a class="header-anchor" href="#enable-mfa-method-totp" aria-hidden="true">#</a> Enable MFA method (TOTP)</h2>
<blockquote>
<p><a href="https://www.vaultproject.io/api-docs/secret/identity/mfa/totp#parameters" target="_blank" rel="noopener noreferrer">https://www.vaultproject.io/api-docs/secret/identity/mfa/totp#parameters<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>identity/mfa/method/totp/generate : for current entity</li>
<li>identity/mfa/method/totp/admin-generate : manage to other entity</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token assign-left variable">METHOD_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>vault <span class="token function">write</span> <span class="token parameter variable">-field</span><span class="token operator">=</span>method_id identity/mfa/method/totp <span class="token assign-left variable">issuer</span><span class="token operator">=</span>HCP-Vault <span class="token assign-left variable">period</span><span class="token operator">=</span><span class="token number">30</span> <span class="token assign-left variable">key_size</span><span class="token operator">=</span><span class="token number">30</span> <span class="token assign-left variable">qr_size</span><span class="token operator">=</span><span class="token number">200</span> <span class="token assign-left variable">algorithm</span><span class="token operator">=</span>SHA256 <span class="token assign-left variable">digits</span><span class="token operator">=</span><span class="token number">6</span> <span class="token assign-left variable">name</span><span class="token operator">=</span>admin<span class="token variable">)</span></span>

$ <span class="token builtin class-name">echo</span> <span class="token variable">$METHOD_ID</span>

$ vault <span class="token builtin class-name">read</span> identity/mfa/method/totp/<span class="token variable">$METHOD_ID</span>

<span class="token comment"># vault write identity/mfa/method/totp/generate method_id=$METHOD_ID</span>
$ vault <span class="token function">write</span> identity/mfa/method/totp/admin-generate <span class="token assign-left variable">method_id</span><span class="token operator">=</span><span class="token variable">$METHOD_ID</span> <span class="token assign-left variable">entity_id</span><span class="token operator">=</span><span class="token variable">$ENTITY_ID</span>

Key        Value
---        -----
barcode    iVBORw0KGgoAAAANSUhEUgAAAM<span class="token punctuation">..</span>.
url        otpauth://totp/Vault:307d6c16-6f5c<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="create-login-enforcement" tabindex="-1"><a class="header-anchor" href="#create-login-enforcement" aria-hidden="true">#</a> Create login enforcement</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span><span class="token variable">$ROOT_TOKEN</span> vault <span class="token function">write</span> identity/mfa/login-enforcement/mylogin <span class="token punctuation">\</span>
   <span class="token assign-left variable">mfa_method_ids</span><span class="token operator">=</span><span class="token string">"<span class="token variable">$METHOD_ID</span>"</span> <span class="token punctuation">\</span>
   <span class="token assign-left variable">auth_method_accessors</span><span class="token operator">=</span><span class="token string">"<span class="token variable">$USERPASS_ACCESSOR</span>"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="vault-otp-test-option" tabindex="-1"><a class="header-anchor" href="#vault-otp-test-option" aria-hidden="true">#</a> Vault OTP Test (Option)</h2>
<blockquote>
<p>That's able to use online QR generator</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> totp

$ vault <span class="token function">write</span> totp/keys/hcp-vault <span class="token assign-left variable">url</span><span class="token operator">=</span><span class="token string">"otpauth://totp/HCP-Vault:0d0cf6f5-62e6-6914-5070-47e997e2aa..."</span>

$ vault <span class="token builtin class-name">read</span> totp/code/hcp-vault
Key     Value
---     -----
code    <span class="token number">714908</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="vault-login-userpass-totp" tabindex="-1"><a class="header-anchor" href="#vault-login-userpass-totp" aria-hidden="true">#</a> Vault Login Userpass + totp</h2>
<h3 id="cli" tabindex="-1"><a class="header-anchor" href="#cli" aria-hidden="true">#</a> CLI</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault login <span class="token parameter variable">-method</span> userpass <span class="token assign-left variable">username</span><span class="token operator">=</span>admin <span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token variable">$MY_PASSWORD</span>

Enter the passphrase <span class="token keyword">for</span> methodID <span class="token string">"0b9d2229-5d64-dc5d-87cc-0fd22775b918"</span> of
<span class="token builtin class-name">type</span> <span class="token string">"totp"</span><span class="token builtin class-name">:</span> <span class="token operator">&lt;</span>enter_totp<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="ui" tabindex="-1"><a class="header-anchor" href="#ui" aria-hidden="true">#</a> UI</h3>
<figure><img src="@source/04-HashiCorp/06-Vault/03-Auth_Method/images/vault-login-mfa-totp.gif" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
</div></template>


