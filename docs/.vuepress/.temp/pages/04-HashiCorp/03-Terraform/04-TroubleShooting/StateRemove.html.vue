<template><div><h1 id="state-rm" tabindex="-1"><a class="header-anchor" href="#state-rm" aria-hidden="true">#</a> State rm</h1>
<ul>
<li>
<p>현상</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>... googleapi: Error 400: Invalid request: Invalid request since instance is not running.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>: Terraform을 통하지 않고 리소스가 삭제되어, 해당 리소스를 찾지 못하는 상황 발생</p>
</li>
<li>
<p>State 삭제</p>
<p>Local 환경의 terraform에 remote를 Terraform cloud로 지정</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code>terraform <span class="token punctuation">{</span>
  required_version = <span class="token string">">= 0.12"</span>
  backend <span class="token string">"remote"</span> <span class="token punctuation">{</span>
    hostname = <span class="token string">"app.terraform.io"</span>
    organization = <span class="token string">"lguplus"</span>

    workspaces <span class="token punctuation">{</span>
      name = <span class="token string">"kids_library"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>state 리스트 확인 <code v-pre>terraform state list</code></p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>my-workspace <span class="token operator">></span> terraform state list
random_pet.sql
module.Cluster_GKE.google_container_cluster.k8sexample
module.Cluster_GKE.google_container_node_pool.pool_1
module.Cluster_GKE.google_container_node_pool.pool_2
module.gcs_buckets.google_storage_bucket.buckets<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>
module.sql-db.google_sql_database.default
module.sql-db.google_sql_database_instance.default
module.sql-db.google_sql_user.default
module.sql-db.null_resource.module_depends_on
module.sql-db.random_id.user-password
module.network.module.routes.google_compute_route.route<span class="token punctuation">[</span><span class="token string">"egress-internet"</span><span class="token punctuation">]</span>
module.network.module.subnets.google_compute_subnetwork.subnetwork<span class="token punctuation">[</span><span class="token string">"asia-northeast3/fc-kidslib-stg-subnet-1"</span><span class="token punctuation">]</span>
module.network.module.vpc.google_compute_network.network
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>존재하지 않는 resource를 삭제 <code v-pre>terraform state rm [resource_name]</code></p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>my-workspace <span class="token operator">></span> terraform state <span class="token function">rm</span> module.sql-db
Removed module.sql-db.google_sql_database.default
Removed module.sql-db.google_sql_database_instance.default
Removed module.sql-db.google_sql_user.default
Removed module.sql-db.null_resource.module_depends_on
Removed module.sql-db.random_id.user-password
Successfully removed <span class="token number">5</span> resource instance<span class="token punctuation">(</span>s<span class="token punctuation">)</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</div></template>


