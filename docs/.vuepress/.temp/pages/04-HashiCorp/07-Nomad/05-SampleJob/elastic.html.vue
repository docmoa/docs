<template><div><h1 id="elastic" tabindex="-1"><a class="header-anchor" href="#elastic" aria-hidden="true">#</a> Elastic</h1>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"elastic"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  group <span class="token string">"elastic"</span> <span class="token punctuation">{</span>
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"db"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">9200</span>
      <span class="token punctuation">}</span>
      port <span class="token string">"kibana"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">5601</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"db"</span>

      <span class="token keyword">check</span> <span class="token punctuation">{</span>
        <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"tcp"</span>
        <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
        <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"elasticsearch"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"docker.elastic.co/elasticsearch/elasticsearch:6.8.9"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"db"</span><span class="token punctuation">]</span>
        <span class="token property">mount</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token property">type</span>   <span class="token punctuation">=</span> <span class="token string">"bind"</span>
            <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"local/elasticsearch.yml"</span>
            <span class="token property">target</span> <span class="token punctuation">=</span> <span class="token string">"/usr/share/elasticsearch/config/elasticsearch.yml"</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
network.host: 0.0.0.0
discovery.seed_hosts: ["127.0.0.1"]
xpack.security.enabled: true
xpack.license.self_generated.type: trial
xpack.monitoring.collection.enabled: true
EOH</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/elasticsearch.yml"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token comment"># "discovery.type":"single-node",</span>
        <span class="token property">ES_JAVA_OPTS</span> <span class="token punctuation">=</span> <span class="token string">"-Xms512m -Xmx1024m"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">2000</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">1024</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"kibana"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"docker.elastic.co/kibana/kibana:6.8.9"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"kibana"</span><span class="token punctuation">]</span>
        <span class="token property">mount</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
            <span class="token property">type</span>   <span class="token punctuation">=</span> <span class="token string">"bind"</span>
            <span class="token property">source</span> <span class="token punctuation">=</span> <span class="token string">"local/kibana.yml"</span>
            <span class="token property">target</span> <span class="token punctuation">=</span> <span class="token string">"/usr/share/kibana/config/kibana.yml"</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
server.name: kibana
elasticsearch.username: elastic
elasticsearch.password: elastic
EOH</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/kibana.yml"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">ELASTICSEARCH_URL</span><span class="token punctuation">=</span><span class="token string">"http://172.28.128.31:9200"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">1000</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">1024</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


