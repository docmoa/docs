<template><div><h1 id="configure-boudary-using-terraform" tabindex="-1"><a class="header-anchor" href="#configure-boudary-using-terraform" aria-hidden="true">#</a> Configure Boudary using Terraform</h1>
<ul>
<li>Terraform provider : <a href="https://registry.terraform.io/providers/hashicorp/boundary/latest/docs" target="_blank" rel="noopener noreferrer">https://registry.terraform.io/providers/hashicorp/boundary/latest/docs<ExternalLinkIcon/></a></li>
<li>learn site : <a href="https://learn.hashicorp.com/tutorials/boundary/getting-started-config" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/boundary/getting-started-config<ExternalLinkIcon/></a></li>
</ul>
<h2 id="main-tf" tabindex="-1"><a class="header-anchor" href="#main-tf" aria-hidden="true">#</a> <a href="http://main.tf" target="_blank" rel="noopener noreferrer">main.tf<ExternalLinkIcon/></a></h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">provider<span class="token type variable"> "boundary" </span></span><span class="token punctuation">{</span>
  <span class="token property">addr</span>             <span class="token punctuation">=</span> <span class="token string">"http://172.28.128.11:9200"</span>
<span class="token comment">//   recovery_kms_hcl = &lt;&lt;EOT</span>
<span class="token comment">// kms "aead" {</span>
<span class="token comment">//     purpose   = "recovery"</span>
<span class="token comment">//     aead_type = "aes-gcm"</span>
<span class="token comment">//     key       = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="</span>
<span class="token comment">//     key_id    = "global_recovery"</span>
<span class="token comment">// }</span>
<span class="token comment">// EOT</span>
    <span class="token property">auth_method_id</span> <span class="token punctuation">=</span> <span class="token string">"ampw_U6FXouWRDK"</span>
    <span class="token property">password_auth_method_login_name</span> <span class="token punctuation">=</span> <span class="token string">"admin"</span>
    <span class="token property">password_auth_method_password</span> <span class="token punctuation">=</span> <span class="token string">"POByMKtvabYS1wtRHLgZ"</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_scope"</span></span> <span class="token string">"global"</span> <span class="token punctuation">{</span>
  <span class="token property">global_scope</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">scope_id</span>     <span class="token punctuation">=</span> <span class="token string">"global"</span>
  <span class="token property">description</span>  <span class="token punctuation">=</span> <span class="token string">"Global scope"</span>
<span class="token punctuation">}</span>

<span class="token comment">// Scope HashiStack</span>
<span class="token keyword">resource <span class="token type variable">"boundary_scope"</span></span> <span class="token string">"corp"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>                     <span class="token punctuation">=</span> <span class="token string">"hashistack"</span>
  <span class="token property">description</span>              <span class="token punctuation">=</span> <span class="token string">"hashistack scope"</span>
  <span class="token property">scope_id</span>                 <span class="token punctuation">=</span> boundary_scope.global.id
  <span class="token property">auto_create_admin_role</span>   <span class="token punctuation">=</span> <span class="token boolean">true</span>
  <span class="token property">auto_create_default_role</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_auth_method"</span></span> <span class="token string">"corp_password"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>        <span class="token punctuation">=</span> <span class="token string">"corp_password_auth_method"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"Password auth method"</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> <span class="token string">"password"</span>
  <span class="token property">scope_id</span>    <span class="token punctuation">=</span> boundary_scope.corp.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_account"</span></span> <span class="token string">"user"</span> <span class="token punctuation">{</span>
  <span class="token property">for_each</span>       <span class="token punctuation">=</span> var.users
  <span class="token property">name</span>           <span class="token punctuation">=</span> each.key
  <span class="token property">description</span>    <span class="token punctuation">=</span> <span class="token string">"User account for my user"</span>
  <span class="token property">type</span>           <span class="token punctuation">=</span> <span class="token string">"password"</span>
  <span class="token property">login_name</span>     <span class="token punctuation">=</span> lower(each.key)
  <span class="token property">password</span>       <span class="token punctuation">=</span> <span class="token string">"password"</span>
  <span class="token property">auth_method_id</span> <span class="token punctuation">=</span> boundary_auth_method.corp_password.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_user"</span></span> <span class="token string">"users"</span> <span class="token punctuation">{</span>
  <span class="token property">for_each</span>    <span class="token punctuation">=</span> var.users
  <span class="token property">name</span>        <span class="token punctuation">=</span> each.key
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"User resource for <span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>each<span class="token punctuation">.</span>key<span class="token punctuation">}</span></span>"</span>
  <span class="token property">account_ids</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>boundary_account<span class="token punctuation">.</span>user<span class="token punctuation">[</span>each<span class="token punctuation">.</span>key<span class="token punctuation">]</span><span class="token punctuation">.</span>id<span class="token punctuation">}</span></span>"</span><span class="token punctuation">]</span>
  <span class="token property">scope_id</span> <span class="token punctuation">=</span> boundary_scope.corp.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_group"</span></span> <span class="token string">"admin"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>        <span class="token punctuation">=</span> <span class="token string">"admin"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"Organization group for readonly users"</span>
  <span class="token property">member_ids</span>  <span class="token punctuation">=</span> <span class="token punctuation">[</span>for user in boundary_user.users : user.id<span class="token punctuation">]</span>
  <span class="token property">scope_id</span>    <span class="token punctuation">=</span> boundary_scope.corp.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_user"</span></span> <span class="token string">"readonly_users"</span> <span class="token punctuation">{</span>
  <span class="token property">for_each</span>    <span class="token punctuation">=</span> var.readonly_users
  <span class="token property">name</span>        <span class="token punctuation">=</span> each.key
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"User resource for <span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>each<span class="token punctuation">.</span>key<span class="token punctuation">}</span></span>"</span>
  <span class="token property">scope_id</span>    <span class="token punctuation">=</span> boundary_scope.corp.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_group"</span></span> <span class="token string">"readonly"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>        <span class="token punctuation">=</span> <span class="token string">"read-only"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"Organization group for readonly users"</span>
  <span class="token property">member_ids</span>  <span class="token punctuation">=</span> <span class="token punctuation">[</span>for user in boundary_user.readonly_users : user.id<span class="token punctuation">]</span>
  <span class="token property">scope_id</span>    <span class="token punctuation">=</span> boundary_scope.corp.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_role"</span></span> <span class="token string">"corp_admin"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>        <span class="token punctuation">=</span> <span class="token string">"corp_admin"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"Corp Administrator role"</span>
  <span class="token property">principal_ids</span> <span class="token punctuation">=</span> concat(
    <span class="token punctuation">[</span>for user in boundary_user.users: user.id<span class="token punctuation">]</span>
  )
  <span class="token property">grant_strings</span>   <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"id=*;type=*;actions=create,read,update,delete"</span><span class="token punctuation">]</span>
  <span class="token property">scope_id</span> <span class="token punctuation">=</span> boundary_scope.corp.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_role"</span></span> <span class="token string">"organization_readonly"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>        <span class="token punctuation">=</span> <span class="token string">"Read-only"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"Read-only role"</span>
  <span class="token property">principal_ids</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>boundary_group.readonly.id<span class="token punctuation">]</span>
  <span class="token property">grant_strings</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"id=*;type=*;actions=read"</span><span class="token punctuation">]</span>
  <span class="token property">scope_id</span>    <span class="token punctuation">=</span> boundary_scope.corp.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_scope"</span></span> <span class="token string">"core_infra"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>                   <span class="token punctuation">=</span> <span class="token string">"core_infra"</span>
  <span class="token property">description</span>            <span class="token punctuation">=</span> <span class="token string">"My first project!"</span>
  <span class="token property">scope_id</span>               <span class="token punctuation">=</span> boundary_scope.corp.id
  <span class="token property">auto_create_admin_role</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_host_catalog"</span></span> <span class="token string">"backend_servers"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>        <span class="token punctuation">=</span> <span class="token string">"backend_servers"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"Backend servers host catalog"</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> <span class="token string">"static"</span>
  <span class="token property">scope_id</span>    <span class="token punctuation">=</span> boundary_scope.core_infra.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_host"</span></span> <span class="token string">"ssh_servers"</span> <span class="token punctuation">{</span>
  <span class="token property">for_each</span>        <span class="token punctuation">=</span> var.ssh_server_ips
  <span class="token property">type</span>            <span class="token punctuation">=</span> <span class="token string">"static"</span>
  <span class="token property">name</span>            <span class="token punctuation">=</span> <span class="token string">"ssh_server_service_<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>each<span class="token punctuation">.</span>value<span class="token punctuation">}</span></span>"</span>
  <span class="token property">description</span>     <span class="token punctuation">=</span> <span class="token string">"ssh server host"</span>
  <span class="token property">address</span>         <span class="token punctuation">=</span> each.key
  <span class="token property">host_catalog_id</span> <span class="token punctuation">=</span> boundary_host_catalog.backend_servers.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_host"</span></span> <span class="token string">"backend_servers"</span> <span class="token punctuation">{</span>
  <span class="token property">for_each</span>        <span class="token punctuation">=</span> var.backend_server_ips
  <span class="token property">type</span>            <span class="token punctuation">=</span> <span class="token string">"static"</span>
  <span class="token property">name</span>            <span class="token punctuation">=</span> <span class="token string">"backend_server_service_<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>each<span class="token punctuation">.</span>value<span class="token punctuation">}</span></span>"</span>
  <span class="token property">description</span>     <span class="token punctuation">=</span> <span class="token string">"Backend server host"</span>
  <span class="token property">address</span>         <span class="token punctuation">=</span> each.key
  <span class="token property">host_catalog_id</span> <span class="token punctuation">=</span> boundary_host_catalog.backend_servers.id
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_host_set"</span></span> <span class="token string">"ssh_servers"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span>            <span class="token punctuation">=</span> <span class="token string">"static"</span>
  <span class="token property">name</span>            <span class="token punctuation">=</span> <span class="token string">"ssh_servers"</span>
  <span class="token property">description</span>     <span class="token punctuation">=</span> <span class="token string">"Host set for ssh servers"</span>
  <span class="token property">host_catalog_id</span> <span class="token punctuation">=</span> boundary_host_catalog.backend_servers.id
  <span class="token property">host_ids</span>        <span class="token punctuation">=</span> <span class="token punctuation">[</span>for host in boundary_host.ssh_servers : host.id<span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_host_set"</span></span> <span class="token string">"backend_servers"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span>            <span class="token punctuation">=</span> <span class="token string">"static"</span>
  <span class="token property">name</span>            <span class="token punctuation">=</span> <span class="token string">"backend_servers"</span>
  <span class="token property">description</span>     <span class="token punctuation">=</span> <span class="token string">"Host set for backend servers"</span>
  <span class="token property">host_catalog_id</span> <span class="token punctuation">=</span> boundary_host_catalog.backend_servers.id
  <span class="token property">host_ids</span>        <span class="token punctuation">=</span> <span class="token punctuation">[</span>for host in boundary_host.backend_servers : host.id<span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># create target for accessing backend servers on port :8000</span>
<span class="token keyword">resource <span class="token type variable">"boundary_target"</span></span> <span class="token string">"backend_servers_service"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span>         <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
  <span class="token property">name</span>         <span class="token punctuation">=</span> <span class="token string">"backend_server"</span>
  <span class="token property">description</span>  <span class="token punctuation">=</span> <span class="token string">"Backend service target"</span>
  <span class="token property">scope_id</span>     <span class="token punctuation">=</span> boundary_scope.core_infra.id
  <span class="token property">default_port</span> <span class="token punctuation">=</span> <span class="token string">"8080"</span>

  <span class="token property">host_set_ids</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    boundary_host_set.backend_servers .id
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment"># create target for accessing backend servers on port :22</span>
<span class="token keyword">resource <span class="token type variable">"boundary_target"</span></span> <span class="token string">"backend_servers_ssh"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span>         <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
  <span class="token property">name</span>         <span class="token punctuation">=</span> <span class="token string">"ssh_server"</span>
  <span class="token property">description</span>  <span class="token punctuation">=</span> <span class="token string">"Backend SSH target"</span>
  <span class="token property">scope_id</span>     <span class="token punctuation">=</span> boundary_scope.core_infra.id
  <span class="token comment">// default_port = "22"</span>

  <span class="token property">host_set_ids</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    boundary_host_set.ssh_servers.id
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token comment">// anonymous</span>
<span class="token keyword">resource <span class="token type variable">"boundary_role"</span></span> <span class="token string">"global_anon_listing"</span> <span class="token punctuation">{</span>
  <span class="token property">scope_id</span> <span class="token punctuation">=</span> boundary_scope.global.id
  <span class="token property">grant_strings</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    <span class="token string">"id=*;type=auth-method;actions=list,authenticate"</span>,
    <span class="token string">"type=scope;actions=list"</span>,
    <span class="token string">"id={{account.id}};actions=read,change-password"</span>
  <span class="token punctuation">]</span>
  <span class="token property">principal_ids</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"u_anon"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"boundary_role"</span></span> <span class="token string">"org_anon_listing"</span> <span class="token punctuation">{</span>
  <span class="token property">scope_id</span> <span class="token punctuation">=</span> boundary_scope.corp.id
  <span class="token property">grant_strings</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    <span class="token string">"id=*;type=auth-method;actions=list,authenticate"</span>,
    <span class="token string">"type=scope;actions=list"</span>,
    <span class="token string">"id={{account.id}};actions=read,change-password"</span>
  <span class="token punctuation">]</span>
  <span class="token property">principal_ids</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"u_anon"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> "corp_auth_method_id" </span></span><span class="token punctuation">{</span>
    <span class="token property">value</span> <span class="token punctuation">=</span> <span class="token string">"boundary authenticate password -auth-method-id <span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>boundary_auth_method<span class="token punctuation">.</span>corp_password<span class="token punctuation">.</span>id<span class="token punctuation">}</span></span> -login-name <span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>boundary_account<span class="token punctuation">.</span>user<span class="token punctuation">[</span><span class="token string">"gslee"</span><span class="token punctuation">]</span><span class="token punctuation">.</span>login_name<span class="token punctuation">}</span></span> -password <span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>boundary_account<span class="token punctuation">.</span>user<span class="token punctuation">[</span><span class="token string">"gslee"</span><span class="token punctuation">]</span><span class="token punctuation">.</span>password<span class="token punctuation">}</span></span>"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="variable-tf" tabindex="-1"><a class="header-anchor" href="#variable-tf" aria-hidden="true">#</a> <a href="http://variable.tf" target="_blank" rel="noopener noreferrer">variable.tf<ExternalLinkIcon/></a></h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "addr" </span></span><span class="token punctuation">{</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"http://172.28.128.11:9200"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "users" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> set(string)
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    <span class="token string">"gslee"</span>,
    <span class="token string">"Jim"</span>,
    <span class="token string">"Mike"</span>,
    <span class="token string">"Todd"</span>,
    <span class="token string">"Jeff"</span>,
    <span class="token string">"Randy"</span>,
    <span class="token string">"Susmitha"</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "readonly_users" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> set(string)
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    <span class="token string">"Chris"</span>,
    <span class="token string">"Pete"</span>,
    <span class="token string">"Justin"</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "ssh_server_ips" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> set(string)
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    <span class="token string">"172.28.128.11"</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "backend_server_ips" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> set(string)
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    <span class="token string">"172.28.128.11"</span>,
    <span class="token string">"172.28.128.50"</span>,
    <span class="token string">"172.28.128.60"</span>,
    <span class="token string">"172.28.128.61"</span>,
    <span class="token string">"172.28.128.70"</span>,
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


