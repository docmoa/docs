<template><div><h1 id="consul-health-check-on-vms" tabindex="-1"><a class="header-anchor" href="#consul-health-check-on-vms" aria-hidden="true">#</a> Consul Health Check on VMs</h1>
<blockquote>
<p><a href="https://www.consul.io/docs/discovery/services" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/discovery/services<ExternalLinkIcon/></a><br>
<a href="https://learn.hashicorp.com/tutorials/consul/service-registration-health-checks?in=consul/developer-discovery#tuning-scripts-to-be-compatible-with-consul" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/tutorials/consul/service-registration-health-checks?in=consul/developer-discovery#tuning-scripts-to-be-compatible-with-consul<ExternalLinkIcon/></a></p>
</blockquote>
<h3 id="_1-스트립트-health-check를-위한-설정" tabindex="-1"><a class="header-anchor" href="#_1-스트립트-health-check를-위한-설정" aria-hidden="true">#</a> 1. 스트립트 Health Check를 위한 설정</h3>
<p>Consul config 디렉토리 하위에 monitor.hcl파일을 만듭니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>services {
  id = "web-service"
  namd = "web-service"
  address = "10.10.10.201"
  port = 8080
  checks = [
    {
      script = "/opt/consul/script/ps-check.sh"
      interval = "180s"
    }
  ]
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-스크립트-health-check시-consul설정" tabindex="-1"><a class="header-anchor" href="#_2-스크립트-health-check시-consul설정" aria-hidden="true">#</a> 2. 스크립트 Health Check시 Consul설정</h3>
<p>Consul에서 스크립트 기반의 설정시 Config파일 내에 하기와 같은 옵션이 추가되어야 합니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>(기존설정)
.....
enable_script_checks = "true" 또는 
enable_local_script_checks = "true"

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>참고 Url : <a href="https://www.consul.io/docs/agent/options#_enable_script_checks" target="_blank" rel="noopener noreferrer">https://www.consul.io/docs/agent/options#_enable_script_checks<ExternalLinkIcon/></a></p>
</div></template>


