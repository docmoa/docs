<template><div><h1 id="boundary-install-on-consul-nomad" tabindex="-1"><a class="header-anchor" href="#boundary-install-on-consul-nomad" aria-hidden="true">#</a> Boundary Install on Consul-Nomad</h1>
<h2 id="_1-nomad-namespace-create" tabindex="-1"><a class="header-anchor" href="#_1-nomad-namespace-create" aria-hidden="true">#</a> 1. Nomad namespace create</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>nomad namespace apply <span class="token parameter variable">-description</span> <span class="token string">"Boundary"</span> boundary
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_2-postgresql-setup" tabindex="-1"><a class="header-anchor" href="#_2-postgresql-setup" aria-hidden="true">#</a> 2. Postgresql setup</h2>
<h3 id="_2-1-postgresql-job-run" tabindex="-1"><a class="header-anchor" href="#_2-1-postgresql-job-run" aria-hidden="true">#</a> 2.1 Postgresql job run</h3>
<details class="hint-container details"><summary>postgresql.nomad</summary>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"postgresql"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"hashistack"</span><span class="token punctuation">]</span>
  <span class="token property">namespace</span> <span class="token punctuation">=</span> <span class="token string">"boundary"</span>

  group <span class="token string">"postgres"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    volume <span class="token string">"postgres-vol"</span> <span class="token punctuation">{</span>
      <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"host"</span>
      <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
      <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"postgres-vol"</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"db"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">volume_mount</span> <span class="token punctuation">{</span>
        <span class="token property">volume</span> <span class="token punctuation">=</span> <span class="token string">"postgres-vol"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/var/lib/postgresql/data"</span>
        <span class="token property">read_only</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"postgres:13.2"</span>
        <span class="token keyword">port_map</span> <span class="token punctuation">{</span>
          <span class="token property">pg</span> <span class="token punctuation">=</span> <span class="token number">5432</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
      
      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">POSTGRES_PASSWORD</span> <span class="token punctuation">=</span> <span class="token string">"postgres"</span>
        <span class="token property">POSTGRES_USER</span> <span class="token punctuation">=</span> <span class="token string">"postgres"</span>
        <span class="token property">PGDATA</span> <span class="token punctuation">=</span> <span class="token string">"/var/lib/postgresql/data/pgdata"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">1024</span>

        <span class="token keyword">network</span> <span class="token punctuation">{</span>
          port <span class="token string">"pg"</span> <span class="token punctuation">{</span>
            <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">5432</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"postgresql"</span>
        <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"db"</span>, <span class="token string">"boundary"</span><span class="token punctuation">]</span>

        <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"pg"</span>

        <span class="token keyword">check</span> <span class="token punctuation">{</span>
          <span class="token property">type</span>  <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
          <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
          <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
          <span class="token property">port</span>  <span class="token punctuation">=</span> <span class="token string">"pg"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>nomad job run <span class="token parameter variable">-namespace</span><span class="token operator">=</span><span class="token string">"boundary"</span> postgresql.nomad
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-2-posgresql-init" tabindex="-1"><a class="header-anchor" href="#_2-2-posgresql-init" aria-hidden="true">#</a> 2.2 Posgresql init</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># Login</span>
psql <span class="token parameter variable">-h</span> <span class="token number">172.28</span>.128.11 <span class="token parameter variable">-U</span> postgres postgres
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-sql line-numbers-mode" data-ext="sql"><pre v-pre class="language-sql"><code><span class="token comment"># &lt;enter the password> postgres</span>
<span class="token keyword">CREATE</span> ROLE boundary <span class="token keyword">WITH</span> LOGIN PASSWORD <span class="token string">'PASSWORD'</span><span class="token punctuation">;</span>
<span class="token keyword">CREATE</span> <span class="token keyword">DATABASE</span> boundary OWNER boundary<span class="token punctuation">;</span>
<span class="token keyword">GRANT</span> <span class="token keyword">ALL</span> <span class="token keyword">PRIVILEGES</span> <span class="token keyword">ON</span> <span class="token keyword">DATABASE</span> boundary <span class="token keyword">TO</span> boundary<span class="token punctuation">;</span>
<span class="token keyword">ALTER</span> <span class="token keyword">USER</span> boundary PASSWORD <span class="token string">'boundary'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-boundary-database-init" tabindex="-1"><a class="header-anchor" href="#_3-boundary-database-init" aria-hidden="true">#</a> 3. Boundary database init</h2>
<h3 id="_3-1-create-config-file" tabindex="-1"><a class="header-anchor" href="#_3-1-create-config-file" aria-hidden="true">#</a> 3.1 Create config file</h3>
<p>&lt;/tmp/config.hcl&gt;</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token property">disable_mlock</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>

<span class="token keyword">controller</span> <span class="token punctuation">{</span>
  <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"controller-0"</span>
  <span class="token keyword">database</span> <span class="token punctuation">{</span>
    <span class="token property">url</span> <span class="token punctuation">=</span> <span class="token string">"postgresql://boundary:boundary@172.28.128.11:5432/boundary?sslmode=disable"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

kms <span class="token string">"aead"</span> <span class="token punctuation">{</span>
  <span class="token property">purpose</span> <span class="token punctuation">=</span> <span class="token string">"root"</span>
  <span class="token property">aead_type</span> <span class="token punctuation">=</span> <span class="token string">"aes-gcm"</span>
  <span class="token property">key</span> <span class="token punctuation">=</span> <span class="token string">"sP1fnF5Xz85RrXyELHFeZg9Ad2qt4Z4bgNHVGtD6ung="</span>
  <span class="token property">key_id</span> <span class="token punctuation">=</span> <span class="token string">"global_root"</span>
<span class="token punctuation">}</span>

kms <span class="token string">"aead"</span> <span class="token punctuation">{</span>
  <span class="token property">purpose</span> <span class="token punctuation">=</span> <span class="token string">"worker-auth"</span>
  <span class="token property">aead_type</span> <span class="token punctuation">=</span> <span class="token string">"aes-gcm"</span>
  <span class="token property">key</span> <span class="token punctuation">=</span> <span class="token string">"8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="</span>
  <span class="token property">key_id</span> <span class="token punctuation">=</span> <span class="token string">"global_worker-auth"</span>
<span class="token punctuation">}</span>

kms <span class="token string">"aead"</span> <span class="token punctuation">{</span>
    <span class="token property">purpose</span>   <span class="token punctuation">=</span> <span class="token string">"recovery"</span>
    <span class="token property">aead_type</span> <span class="token punctuation">=</span> <span class="token string">"aes-gcm"</span>
    <span class="token property">key</span>       <span class="token punctuation">=</span> <span class="token string">"8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="</span>
    <span class="token property">key_id</span>    <span class="token punctuation">=</span> <span class="token string">"global_recovery"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-2-init-database" tabindex="-1"><a class="header-anchor" href="#_3-2-init-database" aria-hidden="true">#</a> 3.2 Init database</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>boundary database init <span class="token parameter variable">-config</span><span class="token operator">=</span>/tmp/config.hcl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_4-boundary-job" tabindex="-1"><a class="header-anchor" href="#_4-boundary-job" aria-hidden="true">#</a> 4. Boundary Job</h2>
<h3 id="_4-1-boundary-controller-job" tabindex="-1"><a class="header-anchor" href="#_4-1-boundary-controller-job" aria-hidden="true">#</a> 4.1 Boundary Controller Job</h3>
<details class="hint-container details"><summary>boundary-controller.nomad</summary>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"0.6.2"</span>
  <span class="token property">postgre_ip</span> <span class="token punctuation">=</span> <span class="token string">"172.28.128.11"</span>
  <span class="token property">postgre_port</span> <span class="token punctuation">=</span> <span class="token string">"5432"</span>
<span class="token punctuation">}</span>

job <span class="token string">"boundary-controller"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"hashistack"</span><span class="token punctuation">]</span>
  <span class="token property">namespace</span> <span class="token punctuation">=</span> <span class="token string">"boundary"</span>

  group <span class="token string">"controller"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"host"</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"migration"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"raw_exec"</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">BOUNDARY_POSTGRES_URL</span> <span class="token punctuation">=</span> <span class="token string">"postgresql://boundary:boundary@<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">postgre_ip</span><span class="token punctuation">}</span></span>:<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">postgre_port</span><span class="token punctuation">}</span></span>/boundary?sslmode=disable"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"https://releases.hashicorp.com/boundary/<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">version</span><span class="token punctuation">}</span></span>/boundary_<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">version</span><span class="token punctuation">}</span></span>_linux_amd64.zip"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
disable_mlock = true

{{ range service "postgresql" }}
controller {
  name = "controller-0"
  database {
    url = "postgresql://boundary:boundary@{{ .Address }}:{{ .Port }}/boundary?sslmode=disable"
  }
}
{{ end }}

listener "tcp" {
  address = "0.0.0.0:9200"
  purpose = "api"
  tls_disable = true
}
listener "tcp" {
  address = "0.0.0.0:9201"
  purpose = "cluster"
  tls_disable = true
}

kms "aead" {
  purpose = "root"
  aead_type = "aes-gcm"
  key = "sP1fnF5Xz85RrXyELHFeZg9Ad2qt4Z4bgNHVGtD6ung="
  key_id = "global_root"
}

kms "aead" {
  purpose = "worker-auth"
  aead_type = "aes-gcm"
  key = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
  key_id = "global_worker-auth"
}

kms "aead" {
    purpose   = "recovery"
    aead_type = "aes-gcm"
    key       = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
    key_id    = "global_recovery"
}
EOH</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/config/config.hcl"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"local/boundary"</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"database"</span>, <span class="token string">"migrate"</span>, <span class="token string">"-config"</span>, <span class="token string">"local/config/config.hcl"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">lifecycle</span> <span class="token punctuation">{</span>
        <span class="token property">hook</span>    <span class="token punctuation">=</span> <span class="token string">"prestart"</span>
        <span class="token property">sidecar</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"controller"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"hashicorp/boundary:<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">version</span><span class="token punctuation">}</span></span>"</span>
        <span class="token keyword">port_map</span> <span class="token punctuation">{</span>
          <span class="token property">controller</span> <span class="token punctuation">=</span> <span class="token number">9200</span>
          <span class="token property">cluster</span> <span class="token punctuation">=</span> <span class="token number">9201</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">mount</span> <span class="token punctuation">{</span>
          <span class="token property">type</span>   <span class="token punctuation">=</span> <span class="token string">"bind"</span>
          <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"local/config"</span>
          <span class="token property">target</span> <span class="token punctuation">=</span> <span class="token string">"/boundary"</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// network_mode = "boundary-net"</span>
        <span class="token comment">// network_aliases = [</span>
        <span class="token comment">//   "boundary-controller"</span>
        <span class="token comment">// ]</span>
      <span class="token punctuation">}</span>
      
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
disable_mlock = true

{{ range service "postgresql" }}
controller {
  name = "controller-0"
  database {
    url = "postgresql://boundary:boundary@{{ .Address }}:{{ .Port }}/boundary?sslmode=disable"
  }
  public_cluster_addr = "{{ env "NOMAD_ADDR_cluster" }}"
}
{{ end }}

listener "tcp" {
  address = "0.0.0.0:9200"
  purpose = "api"
  tls_disable = true
}
listener "tcp" {
  address = "0.0.0.0:9201"
  purpose = "cluster"
  tls_disable = true
}

kms "aead" {
  purpose = "root"
  aead_type = "aes-gcm"
  key = "sP1fnF5Xz85RrXyELHFeZg9Ad2qt4Z4bgNHVGtD6ung="
  key_id = "global_root"
}

kms "aead" {
  purpose = "worker-auth"
  aead_type = "aes-gcm"
  key = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
  key_id = "global_worker-auth"
}

kms "aead" {
    purpose   = "recovery"
    aead_type = "aes-gcm"
    key       = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
    key_id    = "global_recovery"
}
EOH</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/config/config.hcl"</span>
      <span class="token punctuation">}</span>
      
      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token comment">// BOUNDARY_POSTGRES_URL = "postgresql://boundary:boundary@${local.postgre_ip}:${local.postgre_port}/boundary?sslmode=disable"</span>
        <span class="token property">SKIP_SETCAP</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">300</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">500</span>
        <span class="token keyword">network</span> <span class="token punctuation">{</span>
          port <span class="token string">"controller"</span> <span class="token punctuation">{</span>
            <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">9200</span>
          <span class="token punctuation">}</span>
          port <span class="token string">"cluster"</span> <span class="token punctuation">{</span>
            <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">9201</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"boundary"</span>
        <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"cluster"</span><span class="token punctuation">]</span>

        <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"cluster"</span>

        <span class="token keyword">check</span> <span class="token punctuation">{</span>
          <span class="token property">type</span>  <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
          <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
          <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
          <span class="token property">port</span>  <span class="token punctuation">=</span> <span class="token string">"cluster"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>nomad job run <span class="token parameter variable">-namespace</span><span class="token operator">=</span><span class="token string">"boundary"</span> boundary-controller.nomad
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_4-2-boundary-worker-job" tabindex="-1"><a class="header-anchor" href="#_4-2-boundary-worker-job" aria-hidden="true">#</a> 4.2 Boundary worker Job</h3>
<details class="hint-container details"><summary>boundary-controller.nomad</summary>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">locals</span> <span class="token punctuation">{</span>
  <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"0.6.2"</span>
<span class="token punctuation">}</span>

job <span class="token string">"boundary-worker"</span> <span class="token punctuation">{</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"hashistack"</span><span class="token punctuation">]</span>
  <span class="token property">namespace</span> <span class="token punctuation">=</span> <span class="token string">"boundary"</span>
  
  group <span class="token string">"worker"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">scaling</span> <span class="token punctuation">{</span>
      <span class="token property">enabled</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token property">min</span> <span class="token punctuation">=</span> <span class="token number">1</span>
      <span class="token property">max</span> <span class="token punctuation">=</span> <span class="token number">3</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"host"</span>
    <span class="token punctuation">}</span>
    
    task <span class="token string">"worker"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"hashicorp/boundary:<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">version</span><span class="token punctuation">}</span></span>"</span>
        <span class="token keyword">port_map</span> <span class="token punctuation">{</span>
          <span class="token property">proxy</span> <span class="token punctuation">=</span> <span class="token number">9202</span>
        <span class="token punctuation">}</span>
        <span class="token property">volumes</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"local/boundary:/boundary/"</span>,
        <span class="token punctuation">]</span>
        <span class="token comment">// network_mode = "boundary-net"</span>
      <span class="token punctuation">}</span>
      
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
disable_mlock = true

listener "tcp" {
  address = "0.0.0.0:9202"
  purpose = "proxy"
  tls_disable = true
}

worker {
  name = "worker-0"
  controllers = [
{{ range service "boundary" }}
		"{{ .Address }}",
{{ end }}
  ]
  public_addr = "{{ env "NOMAD_ADDR_proxy" }}"
}

kms "aead" {
  purpose = "root"
  aead_type = "aes-gcm"
  key = "sP1fnF5Xz85RrXyELHFeZg9Ad2qt4Z4bgNHVGtD6ung="
  key_id = "global_root"
}

kms "aead" {
  purpose = "worker-auth"
  aead_type = "aes-gcm"
  key = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
  key_id = "global_worker-auth"
}

kms "aead" {
  purpose   = "recovery"
  aead_type = "aes-gcm"
  key       = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
  key_id    = "global_recovery"
}
EOH</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/local/boundary/config.hcl"</span>
      <span class="token punctuation">}</span>
      
      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token comment">// BOUNDARY_POSTGRES_URL = "postgresql://boundary:boundary@172.28.128.11:5432/boundary?sslmode=disable"</span>
        <span class="token property">SKIP_SETCAP</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token keyword">network</span> <span class="token punctuation">{</span>
          port <span class="token string">"proxy"</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>nomad job run <span class="token parameter variable">-namespace</span><span class="token operator">=</span><span class="token string">"boundary"</span> boundary-worker.nomad
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></div></template>


