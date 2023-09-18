<template><div><h1 id="consul-sidecar-inject-not-working-on-k8s" tabindex="-1"><a class="header-anchor" href="#consul-sidecar-inject-not-working-on-k8s" aria-hidden="true">#</a> Consul Sidecar Inject not working on K8S</h1>
<blockquote>
<p>Consul Version : 1.9.x<br>
Helm Chart : 0.30.0</p>
</blockquote>
<p>Consul을 쿠버네티스 상에 구성하게 되면 <code v-pre>annotation</code> 구성만으로도 쉽게 Sidecar를 애플리케이션과 함께 배포 가능하다.</p>
<p>참고 : <a href="https://www.consul.io/docs/k8s/connect#controlling-injection-via-annotation" target="_blank" rel="noopener noreferrer">Controlling Injection Via Annotation<ExternalLinkIcon/></a></p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">annotations</span><span class="token punctuation">:</span>
  <span class="token key atrule">'consul.hashicorp.com/connect-inject'</span><span class="token punctuation">:</span> <span class="token string">'true'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>Consul Sidecar가 Pod 배포시 함께 구성되야 하는 것이 정상이나, Sidecar의 생성 실패나 이미지 가져오기 실패라는 언급도 없이 Sidecar의 injection이 동작하지 않는 경우가 있다.</p>
<h2 id="log-확인" tabindex="-1"><a class="header-anchor" href="#log-확인" aria-hidden="true">#</a> Log 확인</h2>
<p>쿠버네티스 상의 Consul을 구성하게 되면 injector가 Sidecar를 함께 배포하는 작업을 수행하므로 먼저 해당 컴포넌트의  로그를 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl logs <span class="token parameter variable">-n</span> consul <span class="token parameter variable">-l</span> <span class="token assign-left variable">component</span><span class="token operator">=</span>connect-injector <span class="token parameter variable">-f</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="kubernetes-api-확인" tabindex="-1"><a class="header-anchor" href="#kubernetes-api-확인" aria-hidden="true">#</a> Kubernetes API 확인</h2>
<p><code v-pre>annotation</code>의 동작은 쿠버네티스 컨트롤 플래인, 즉, 쿠버네티스의 API를 통해 요청되므로 해당 API를 통해 Consul에 접근이 가능한지 확인이 필요하다.<br>
consul-inject에서 kubernetest api 접속이 불가하다면 <code v-pre>500</code>에러가 발생한다.</p>
<ol>
<li>api 접속을 위한 proxy를 활성화<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ kubectl proxy
Starting to serve on <span class="token number">127.0</span>.0.1:8001
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>다른 터미널에서 API로 확인
<ul>
<li>정상인 경우</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">-vv</span> localhost:8001/api/v1/namespaces/consul/services/https:consul-connect-injector-svc:443/proxy/health/ready
*   Trying <span class="token number">127.0</span>.0.1<span class="token punctuation">..</span>.
* TCP_NODELAY <span class="token builtin class-name">set</span>
* Connected to localhost <span class="token punctuation">(</span><span class="token number">127.0</span>.0.1<span class="token punctuation">)</span> port <span class="token number">8001</span> <span class="token punctuation">(</span><span class="token comment">#0)</span>
<span class="token operator">></span> GET /api/v1/namespaces/consul/services/https:consul-connect-injector-svc:443/proxy/health/ready HTTP/1.1
<span class="token operator">></span> Host: localhost:8001
<span class="token operator">></span> User-Agent: curl/7.61.1
<span class="token operator">></span> Accept: */*
<span class="token operator">></span>
<span class="token operator">&lt;</span> HTTP/1.1 <span class="token number">204</span> No Content
<span class="token operator">&lt;</span> Audit-Id: 52947d1d-0c90-47eb-8dc2-6c2efa0193fa
<span class="token operator">&lt;</span> Cache-Control: no-cache, private
<span class="token operator">&lt;</span> Date: Fri, 06 Aug <span class="token number">2021</span> <span class="token number">10</span>:15:21 GMT
<span class="token operator">&lt;</span>
* Connection <span class="token comment">#0 to host localhost left intact</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>쿠버네티스 API 접근이 안되는 경우</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>*   Trying <span class="token number">127.0</span>.0.1<span class="token punctuation">..</span>.                                      
* TCP_NODELAY <span class="token builtin class-name">set</span>                                            
* Connected to localhost <span class="token punctuation">(</span><span class="token number">127.0</span>.0.1<span class="token punctuation">)</span> port <span class="token number">8001</span> <span class="token punctuation">(</span><span class="token comment">#0)          </span>
<span class="token operator">></span> GET /api/v1/namespaces/consul/services/https:consul-connect
-injector-svc:443/proxy/health/ready HTTP/1.1                
<span class="token operator">></span> Host: localhost:8001                                       
<span class="token operator">></span> User-Agent: curl/7.61.1                                    
<span class="token operator">></span> Accept: */*                                                
<span class="token operator">></span>                                                            
<span class="token operator">&lt;</span> HTTP/1.1 <span class="token number">500</span> Internal Server Error                         
<span class="token operator">&lt;</span> Audit-Id: acb30d91-d8db-463e-a91e-1e2a5382329e             
<span class="token operator">&lt;</span> Cache-Control: no-cache, private                           
<span class="token operator">&lt;</span> Content-Length: <span class="token number">178</span>                                        
<span class="token operator">&lt;</span> Content-Type: application/json
<span class="token operator">&lt;</span> Date: Fri, 06 Aug <span class="token number">2021</span> <span class="token number">11</span>:04:38 GMT                        
<span class="token operator">&lt;</span>                                                            
<span class="token punctuation">{</span>                                                            
  <span class="token string">"kind"</span><span class="token builtin class-name">:</span> <span class="token string">"Status"</span>,
  <span class="token string">"apiVersion"</span><span class="token builtin class-name">:</span> <span class="token string">"v1"</span>,                                        
  <span class="token string">"metadata"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>                                              
                                                            
  <span class="token punctuation">}</span>,                                                         
  <span class="token string">"status"</span><span class="token builtin class-name">:</span> <span class="token string">"Failure"</span>,                                       
  <span class="token string">"message"</span><span class="token builtin class-name">:</span> <span class="token string">"error trying to reach service: Address is not a
  llowed"</span>,                                                     
  <span class="token string">"code"</span><span class="token builtin class-name">:</span> <span class="token number">500</span>
<span class="token punctuation">}</span>
* Connection <span class="token comment">#0 to host localhost left intact</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
</div></template>


