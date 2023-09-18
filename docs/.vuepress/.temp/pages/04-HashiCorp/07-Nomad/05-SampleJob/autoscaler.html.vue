<template><div><h1 id="autoscaler" tabindex="-1"><a class="header-anchor" href="#autoscaler" aria-hidden="true">#</a> Autoscaler</h1>
<ul>
<li>aws cloud 환경에서 별도의 모니터링 툴을 사용하지 않고 nomad-apm 기능을 이용한 auscaler 구성</li>
<li>Nomad Autoscaler 다운로드 :
<ul>
<li>VM환경: <a href="https://releases.hashicorp.com/nomad-autoscaler/" target="_blank" rel="noopener noreferrer">https://releases.hashicorp.com/nomad-autoscaler/<ExternalLinkIcon/></a></li>
<li>Container환경: <a href="https://hub.docker.com/r/hashicorp/nomad-autoscaler" target="_blank" rel="noopener noreferrer">https://hub.docker.com/r/hashicorp/nomad-autoscaler<ExternalLinkIcon/></a> , <a href="https://hub.docker.com/r/hashicorp/nomad-autoscaler-enterprise" target="_blank" rel="noopener noreferrer">https://hub.docker.com/r/hashicorp/nomad-autoscaler-enterprise<ExternalLinkIcon/></a></li>
</ul>
</li>
<li>주요링크
<ul>
<li>Nomad Autoscaler aws IAM policy 관련 : <a href="https://www.nomadproject.io/tools/autoscaling/plugins/target/aws-asg" target="_blank" rel="noopener noreferrer">https://www.nomadproject.io/tools/autoscaling/plugins/target/aws-asg<ExternalLinkIcon/></a></li>
<li>Nomad Autoscaler policy 관련 : <a href="https://www.nomadproject.io/tools/autoscaling/policy" target="_blank" rel="noopener noreferrer">https://www.nomadproject.io/tools/autoscaling/policy<ExternalLinkIcon/></a></li>
<li>Nomad Autoscaler의 nomad-apm 을 사용하는 경우 : <a href="https://www.nomadproject.io/tools/autoscaling/plugins/apm/nomad" target="_blank" rel="noopener noreferrer">https://www.nomadproject.io/tools/autoscaling/plugins/apm/nomad<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<h2 id="nomad-autoscaler-sample-job" tabindex="-1"><a class="header-anchor" href="#nomad-autoscaler-sample-job" aria-hidden="true">#</a> Nomad Autoscaler - sample job</h2>
<ul>
<li>Nomad Autoscaler는 Container환경과 Non-Container환경 모두 설치 가능</li>
<li>디버깅이 필요한 경우 <code v-pre>log_level = &quot;DEBUG&quot;</code> 옵션 설정</li>
<li>Nomad Autoscaler sampe job의 <code v-pre>target &quot;aws-asg&quot;</code> 설정방법
<ul>
<li>aws_asg_name은 aws cloud 환경의 Auto Scaling 그룹에 존재해야 함.</li>
<li>node_class는 nomad client에 동일하게 설정해야 함.</li>
</ul>
</li>
<li>주요 튜닝 포인트
<ul>
<li><code v-pre>policy</code>의   cooldown,  evaluation_interval 값을 워크로드 특성에 맞게 적절하게 설정</li>
</ul>
</li>
<li>오토스케일링 기준
<ul>
<li>메모리 :   <code v-pre>check &quot;mem_allocated_percentage&quot;</code></li>
<li>cpu :  <code v-pre>check &quot;cpu_allocated_percentage&quot;</code></li>
</ul>
</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">locals</span> <span class="token punctuation">{</span>
    <span class="token property">autoscaler_ver</span> <span class="token punctuation">=</span> <span class="token string">"0.3.3"</span>
    <span class="token comment">#autoscaler_ver = "0.3.5"</span>
<span class="token punctuation">}</span>

job <span class="token string">"autoscalerEnt"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  group <span class="token string">"autoscalerEnt"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"autoscaler"</span> <span class="token punctuation">{</span>
      <span class="token comment">// docker 기반의 Nomad Autoscaler는 다음과 같이 설정 </span>
      <span class="token comment">//   driver = "docker"</span>
      <span class="token comment">//   config {</span>
      <span class="token comment">//     image   = "hashicorp/nomad-autoscaler-enterprise:0.3.3"</span>
      <span class="token comment">//     command = "nomad-autoscaler"</span>
      <span class="token comment">//     args = [</span>
      <span class="token comment">//       "agent",</span>
      <span class="token comment">//       "-config",</span>
      <span class="token comment">//       "$${NOMAD_TASK_DIR}/config.hcl",</span>
      <span class="token comment">//       "-policy-dir",</span>
      <span class="token comment">//       "$${NOMAD_TASK_DIR}/policies/",</span>
      <span class="token comment">//     ]</span>
      <span class="token comment">//     ports = ["http"]</span>
      <span class="token comment">//   }</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"exec"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"/usr/local/bin/nomad-autoscaler"</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"agent"</span>,
          <span class="token string">"-config"</span>,
          <span class="token string">"$${NOMAD_TASK_DIR}/config.hcl"</span>,
          <span class="token string">"-http-bind-address"</span>,
          <span class="token string">"0.0.0.0"</span>,
          <span class="token string">"-http-bind-port"</span>,
          <span class="token string">"$${NOMAD_PORT_http}"</span>,
          <span class="token string">"-policy-dir"</span>,
          <span class="token string">"$${NOMAD_TASK_DIR}/policies/"</span>,
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">artifact</span> <span class="token punctuation">{</span>
        <span class="token property">source</span>      <span class="token punctuation">=</span> <span class="token string">"https://releases.hashicorp.com/nomad-autoscaler/<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">autoscaler_ver</span><span class="token punctuation">}</span></span>+ent/nomad-autoscaler_<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">local</span><span class="token punctuation">.</span><span class="token type variable">autoscaler_ver</span><span class="token punctuation">}</span></span>+ent_linux_amd64.zip"</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/usr/local/bin"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span>        <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
nomad {
  address = "http://{{env "attr.unique.network.ip-address" }}:4646"  #Adding nomad server addresss
  token = "&lt;#Adding nomad server token >"  
}

apm "nomad-apm" {
  driver = "nomad-apm"
  config  = {
    address = "http://{{env "attr.unique.network.ip-address" }}:4646"
  }  
}

dynamic_application_sizing {
  // Lower the evaluate interval so we can reproduce recommendations after only
  // 5 minutes, rather than having to wait for 24hrs as is the default.
  evaluate_after = "5m"
}

#log_level = "DEBUG"

target "aws-asg" {
  driver = "aws-asg"
  config = {
    aws_region = "{{ $x := env "attr.platform.aws.placement.availability-zone" }}{{ $length := len $x |subtract 1 }}{{ slice $x 0 $length}}"
  }
}

strategy "target-value" {
  driver = "target-value"
}

  EOF</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"$${NOMAD_TASK_DIR}/config.hcl"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
scaling "cluster_policy_media" {
  enabled = true
  min     = 1
  max     = 100
  
  policy {
    cooldown            = "5m"
    evaluation_interval = "20s"
    
    check "mem_allocated_percentage" {
      source = "nomad-apm"
      query  = "percentage-allocated_memory"
      strategy "target-value" {
        target = 82
      }
    }

    // check "cpu_allocated_percentage" {
    //   source = "nomad-apm"
    //   query  = "percentage-allocated_cpu"

    //   strategy "target-value" {
    //     target = 80
    //   }
    // }    

    target "aws-asg" {
      dry-run             = "false"
      aws_asg_name        = "nomad_client_media_autoscaler" 
      node_class          = "client_web"
      node_drain_deadline = "3m"
      node_purge          = "true"
    }
  }
}

EOF</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"$${NOMAD_TASK_DIR}/policies/hashistack.hcl"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">200</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">256</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">service</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"autoscaler"</span>
        <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>

        <span class="token keyword">check</span> <span class="token punctuation">{</span>
          <span class="token property">type</span>     <span class="token punctuation">=</span> <span class="token string">"http"</span>
          <span class="token property">path</span>     <span class="token punctuation">=</span> <span class="token string">"/v1/health"</span>
          <span class="token property">interval</span> <span class="token punctuation">=</span> <span class="token string">"5s"</span>
          <span class="token property">timeout</span>  <span class="token punctuation">=</span> <span class="token string">"2s"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


