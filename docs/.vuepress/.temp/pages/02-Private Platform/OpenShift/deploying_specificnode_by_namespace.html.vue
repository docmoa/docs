<template><div><h1 id="openshift-3-x-프로젝트-별로-특정-노드에-배포하기" tabindex="-1"><a class="header-anchor" href="#openshift-3-x-프로젝트-별로-특정-노드에-배포하기" aria-hidden="true">#</a> OpenShift 3.x - 프로젝트 별로 특정 노드에 배포하기</h1>
<blockquote>
<p>원문 : <a href="https://blog.openshift.com/deploying-applications-to-specific-nodes/" target="_blank" rel="noopener noreferrer">https://blog.openshift.com/deploying-applications-to-specific-nodes/<ExternalLinkIcon/></a></p>
</blockquote>
<p>Deployment나 Deployment Config에서 Nodeselect를 지정하는 방법 외에 Project 단위로 설정하는 방법을 설명합니다.</p>
<ol>
<li>
<p>Node Label확인</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>~$ oc get <span class="token function">node</span> --show-labels
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>Node에 Label 업데이트</p>
<blockquote>
<p>Label 업데이트 (<a href="https://docs.openshift.com/container-platform/3.7/admin_guide/manage_nodes.html#updating-labels-on-nodes" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a>)</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>~$ oc label <span class="token function">node</span> <span class="token punctuation">[</span>노드이름<span class="token punctuation">]</span> <span class="token assign-left variable">region</span><span class="token operator">=</span>primary
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>primary는 구분자 입니다. 예로</p>
<p><code v-pre>region=tk</code> 이런식으로 테스트계 설정을 하게 됩니다.</p>
<p>ex)</p>
<p>To <strong>add a label</strong> to a node or pod:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># oc label node node001.krenger.ch mylabel=myvalue
# oc label pod mypod-34-g0f7k mylabel=myvalue
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>To <strong>remove a label</strong> (in the example “mylabel”) from a node or pod:</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code># oc label node node001.krenger.ch mylabel-
# oc label pod mypod-34-g0f7k mylabel-
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Master에 기본 NodeSelector Label 지정</p>
<p>Master 노드의 <code v-pre>defaultNodeSelector</code> 설정을 변경하고 Master서비스를 재시작 합니다.</p>
<p><code v-pre>NodeSelector</code>가 없는 경우 Pod가 Deploy되는 Node 입니다.</p>
<p>대상 파일: <code v-pre>/etc/origin/master/master-config.yaml</code></p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">projectConfig</span><span class="token punctuation">:</span>
  <span class="token key atrule">defaultNodeSelector</span><span class="token punctuation">:</span> "region=primary” 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Master Node 재기동 필요</strong></p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>~$ systemctl restart atomic-openshift-master
~$ systemctl restart atomic-openshift-node
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>프로젝트 Node Selector 설정</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>~$ oc edit namespace <span class="token punctuation">[</span>프로젝트이름<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">...</span>
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">openshift.io/node-selector</span><span class="token punctuation">:</span> “region=primary"
    <span class="token key atrule">openshift.io/description</span><span class="token punctuation">:</span> <span class="token string">""</span>
    <span class="token key atrule">openshift.io/display-name</span><span class="token punctuation">:</span> <span class="token string">""</span>
    <span class="token key atrule">openshift.io/node-selector</span><span class="token punctuation">:</span> “"
<span class="token punctuation">...</span>    
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<p><strong>Appendix</strong></p>
<ul>
<li>위 과정만으로 Project 에 대한 기본 Node Selector가 설정되어야 하며, 이같이 설정되지 않는 경우 각 Pod 별로, 혹은 template에서 설정해야합니다.</li>
</ul>
</div></template>


