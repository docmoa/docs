<template><div><h1 id="elk-version7" tabindex="-1"><a class="header-anchor" href="#elk-version7" aria-hidden="true">#</a> elk_version7</h1>
<h2 id="_7버전에-elsaticsearch에서-기본패스워드를-찾지-못해서-env로-넣어줌" tabindex="-1"><a class="header-anchor" href="#_7버전에-elsaticsearch에서-기본패스워드를-찾지-못해서-env로-넣어줌" aria-hidden="true">#</a> 7버전에 elsaticsearch에서 기본패스워드를 찾지 못해서 env로 넣어줌</h2>
<h2 id="logstash는-적당한-샘플을-찾지-못해서-일단은-비워둠" tabindex="-1"><a class="header-anchor" href="#logstash는-적당한-샘플을-찾지-못해서-일단은-비워둠" aria-hidden="true">#</a> logstash는 적당한 샘플을 찾지 못해서 일단은 비워둠</h2>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"elk"</span> <span class="token punctuation">{</span>

    <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

    <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
        <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>kernel<span class="token punctuation">.</span>name<span class="token punctuation">}</span></span>"</span>
        <span class="token property">value</span> <span class="token punctuation">=</span> <span class="token string">"linux"</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">update</span> <span class="token punctuation">{</span>
        <span class="token property">stagger</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
        <span class="token property">max_parallel</span> <span class="token punctuation">=</span> <span class="token number">1</span>
    <span class="token punctuation">}</span>

    group <span class="token string">"elk"</span> <span class="token punctuation">{</span>
        <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

        <span class="token keyword">restart</span> <span class="token punctuation">{</span>
            <span class="token property">attempts</span> <span class="token punctuation">=</span> <span class="token number">2</span>
            <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"1m"</span>
            <span class="token property">delay</span> <span class="token punctuation">=</span> <span class="token string">"15s"</span>
            <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"delay"</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">network</span> <span class="token punctuation">{</span>
          port <span class="token string">"elastic"</span> <span class="token punctuation">{</span>
            <span class="token property">to</span>     <span class="token punctuation">=</span> <span class="token number">9200</span>
            <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">9200</span>
          <span class="token punctuation">}</span>
          port <span class="token string">"kibana"</span> <span class="token punctuation">{</span>
            <span class="token property">to</span>     <span class="token punctuation">=</span> <span class="token number">5601</span>
          <span class="token punctuation">}</span>
          port <span class="token string">"logstash"</span> <span class="token punctuation">{</span>
            <span class="token property">to</span>     <span class="token punctuation">=</span> <span class="token number">5000</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        task <span class="token string">"elasticsearch"</span> <span class="token punctuation">{</span>
            <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

           <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
             <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>unique<span class="token punctuation">.</span>hostname<span class="token punctuation">}</span></span>"</span>
             <span class="token property">value</span>     <span class="token punctuation">=</span> <span class="token string">"slave2"</span>
           <span class="token punctuation">}</span>

            <span class="token keyword">config</span> <span class="token punctuation">{</span>
                <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"elasticsearch:7.16.2"</span>
                <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"elastic"</span><span class="token punctuation">]</span>
                <span class="token property">volumes</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"local/elasticsearch.yml:/usr/share/elasticsearch/config/elasticsearch.yml"</span>,
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
cluster.name: "my-cluster"
network.host: 0.0.0.0
discovery.type: single-node
discovery.seed_hosts: ["127.0.0.1"]
xpack.security.enabled: true
xpack.license.self_generated.type: trial
xpack.monitoring.collection.enabled: true
EOF</span>
        <span class="token property">destination</span>   <span class="token punctuation">=</span> <span class="token string">"local/elasticsearch.yml"</span>
        <span class="token property">change_mode</span>   <span class="token punctuation">=</span> <span class="token string">"signal"</span>
        <span class="token property">change_signal</span> <span class="token punctuation">=</span> <span class="token string">"SIGHUP"</span>
      <span class="token punctuation">}</span>
            <span class="token keyword">env</span> <span class="token punctuation">{</span>
              <span class="token property">ELASTIC_PASSWORD</span> <span class="token punctuation">=</span> <span class="token string">"elastic"</span>
            <span class="token punctuation">}</span>

            <span class="token keyword">service</span> <span class="token punctuation">{</span>
                <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>TASKGROUP<span class="token punctuation">}</span></span>-elasticsearch"</span>
                <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"elastic"</span>
            <span class="token punctuation">}</span>

            <span class="token keyword">resources</span> <span class="token punctuation">{</span>
                <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">500</span>
                <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">2048</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        task <span class="token string">"kibana"</span> <span class="token punctuation">{</span>
            <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

            <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
              <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>unique<span class="token punctuation">.</span>hostname<span class="token punctuation">}</span></span>"</span>
              <span class="token property">value</span>     <span class="token punctuation">=</span> <span class="token string">"slave2"</span>
            <span class="token punctuation">}</span>

            <span class="token keyword">config</span> <span class="token punctuation">{</span>
                <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"kibana:7.16.2"</span>
                <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"kibana"</span><span class="token punctuation">]</span>
                <span class="token property">volumes</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"local/kibana.yml:/usr/share/kibana/config/kibana.yml"</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
#
# ** THIS IS AN AUTO-GENERATED FILE **
#

# Default Kibana configuration for docker target
server.host: "0.0.0.0"
server.shutdownTimeout: "5s"
elasticsearch.hosts: [ "http://{{ env "NOMAD_IP_elk" }}:{{ env "NOMAD_PORT_elk" }}" ]
elasticsearch.username: elastic
elasticsearch.password: elastic
EOF</span>

        <span class="token property">destination</span>   <span class="token punctuation">=</span> <span class="token string">"local/kibana.yml"</span>
        <span class="token property">change_mode</span>   <span class="token punctuation">=</span> <span class="token string">"signal"</span>
        <span class="token property">change_signal</span> <span class="token punctuation">=</span> <span class="token string">"SIGHUP"</span>
      <span class="token punctuation">}</span>

            <span class="token keyword">service</span> <span class="token punctuation">{</span>
                <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>TASKGROUP<span class="token punctuation">}</span></span>-kibana"</span>
                <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"kibana"</span>
                <span class="token keyword">check</span> <span class="token punctuation">{</span>
                    <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>
                    <span class="token property">path</span> <span class="token punctuation">=</span> <span class="token string">"/"</span>
                    <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"10s"</span>
                    <span class="token property">timeout</span> <span class="token punctuation">=</span> <span class="token string">"2s"</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>

            <span class="token keyword">resources</span> <span class="token punctuation">{</span>
                <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">500</span>
                <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">1200</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        task <span class="token string">"logstash"</span> <span class="token punctuation">{</span>
            <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>

            <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
              <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>unique<span class="token punctuation">.</span>hostname<span class="token punctuation">}</span></span>"</span>
              <span class="token property">value</span>     <span class="token punctuation">=</span> <span class="token string">"slave2"</span>
            <span class="token punctuation">}</span>

            <span class="token keyword">config</span> <span class="token punctuation">{</span>
                <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"logstash:7.16.2"</span>
                <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"logstash"</span><span class="token punctuation">]</span>
                <span class="token property">volumes</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"local/logstash.yml:/usr/share/logstash/config/logstash.yml"</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
http.host: "0.0.0.0"
xpack.monitoring.elasticsearch.hosts: [ "http://{{ env "NOMAD_IP_elk" }}:{{ env "NOMAD_PORT_elk" }}" ]
EOF</span>

        <span class="token property">destination</span>   <span class="token punctuation">=</span> <span class="token string">"local/logstash.yml"</span>
        <span class="token property">change_mode</span>   <span class="token punctuation">=</span> <span class="token string">"signal"</span>
        <span class="token property">change_signal</span> <span class="token punctuation">=</span> <span class="token string">"SIGHUP"</span>
      <span class="token punctuation">}</span>

            <span class="token keyword">service</span> <span class="token punctuation">{</span>
                <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>TASKGROUP<span class="token punctuation">}</span></span>-logstash"</span>
                <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"logstash"</span>
            <span class="token punctuation">}</span>

            <span class="token keyword">resources</span> <span class="token punctuation">{</span>
                <span class="token property">cpu</span> <span class="token punctuation">=</span> <span class="token number">200</span>
                <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">1024</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


