<template><div><h1 id="nomad-pack-custom-registry" tabindex="-1"><a class="header-anchor" href="#nomad-pack-custom-registry" aria-hidden="true">#</a> nomad-pack custom registry</h1>
<ul>
<li>nomad job파일을 템플릿처럼 다룰 수 있게 해주는 고마운 기능
<ul>
<li>nomad-pack custom 메뉴얼 주소 및 커뮤니티 registry
<ul>
<li>nomad-pack: <a href="https://github.com/hashicorp/nomad-pack/blob/main/docs/writing-packs.md" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/nomad-pack/blob/main/docs/writing-packs.md<ExternalLinkIcon/></a></li>
<li>커뮤니티 registry : <a href="https://github.com/hashicorp/nomad-pack-community-registry" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/nomad-pack-community-registry<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
</li>
<li>해당 예제는 Vue.js의 vuepress기반의 컨테이너
<ul>
<li>참조링크
<ul>
<li>gitlab: <a href="https://gitlab.com/swbs9000/vuepress" target="_blank" rel="noopener noreferrer">https://gitlab.com/swbs9000/vuepress<ExternalLinkIcon/></a></li>
<li>docker: <a href="https://hub.docker.com/repository/docker/swbs90/vuepress" target="_blank" rel="noopener noreferrer">https://hub.docker.com/repository/docker/swbs90/vuepress<ExternalLinkIcon/></a> CLI: docker push swbs90/vuepress:0.0.3</li>
<li>vuepress: <a href="https://github.com/docmoa/docs" target="_blank" rel="noopener noreferrer">https://github.com/docmoa/docs<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
</li>
</ul>
<h2 id="docker-image-build" tabindex="-1"><a class="header-anchor" href="#docker-image-build" aria-hidden="true">#</a> Docker image build</h2>
<ul>
<li>다같이 사용하던 docmoa를 build 해보기로함</li>
<li>core.js의 의존성 패키지 중에 python2.7, make, gcc, g++를 요구하는 이상한 패키지가 있어서 image 크기가 급증함...
<ul>
<li>추후 CI/CD 재구성 시 vue.js는 어떤식으로 처리해야할 지 고민해봐야 할 듯</li>
</ul>
</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># Docker file</span>
FROM blasteh/vuepress:<span class="token number">8.3</span> <span class="token comment">#기존에 돌아 다니는 vuepress의 npm 버전이 너무 낮아 하나 받아서 버전업함</span>

<span class="token comment">#특정 패키지 빌드 시 아래와 같은패캐지들을 필요로 함</span>
RUN apk add --no-cache python2
RUN apk add --no-cache make
RUN apk add --no-cache gcc
RUN apk add --no-cache g++

RUN mkdir /etc/bin

RUN cp /usr/bin/python2 /etc/bin/python2.<span class="token number">7</span>
RUN cp /usr/bin/make    /etc/bin/make
RUN cp /usr/bin/gcc     /etc/bin/gcc
RUN cp /usr/bin/g++     /etc/bin/g++

RUN npm config set python /etc/bin/python2.<span class="token number">7</span>
RUN npm config set make   /etc/bin/make
RUN npm config set gcc    /etc/bin/gcc
RUN npm config set g++    /etc/bin/g++

ADD docs /root/src/docs

WORKDIR /root/src/docs
RUN npm install

expose <span class="token number">8000</span>

ENTRYPOINT <span class="token punctuation">[</span><span class="token string">"/usr/local/bin/npm"</span>, <span class="token string">"run"</span>, <span class="token string">"dev"</span><span class="token punctuation">]</span>


</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="vcs-구성" tabindex="-1"><a class="header-anchor" href="#vcs-구성" aria-hidden="true">#</a> vcs 구성</h2>
<ul>
<li>web gitlab을 사용함</li>
<li>private로 만들면 권한문제 해결이 안됨. 그래서 일단 public으로 구성
<ul>
<li>다른 옵션은 괜찮으나, metadata.hcl의 pack -&gt; url은 public github로 하지않으면 에러발생
<ul>
<li>gitlab으로 설정 시 출력되는 error log가 명확하지 않아, github로 넣어둠</li>
</ul>
</li>
<li>참고: <a href="https://gitlab.com/swbs9000/vuepress" target="_blank" rel="noopener noreferrer">https://gitlab.com/swbs9000/vuepress<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<h3 id="디렉토리-구조" tabindex="-1"><a class="header-anchor" href="#디렉토리-구조" aria-hidden="true">#</a> 디렉토리 구조</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>pack/vuepres
├── metadata.hcl 
├── outputs.tpl
├── templates
│   └── vuepress.nomad.tpl
└── variables.hcl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment">#metadata.hcl</span>
<span class="token keyword">app</span> <span class="token punctuation">{</span>
  <span class="token property">url</span> <span class="token punctuation">=</span> <span class="token string">"https://gitlab.com/swbs9000/nomad-pack"</span>
  <span class="token property">author</span> <span class="token punctuation">=</span> <span class="token string">"unghee"</span>
<span class="token punctuation">}</span>

<span class="token keyword">pack</span> <span class="token punctuation">{</span>
  <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"vuepress"</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"vuepress test."</span>
  <span class="token property">url</span> <span class="token punctuation">=</span> <span class="token string">"https://github.com/swbs90/vuepress"</span>
  <span class="token property">version</span> <span class="token punctuation">=</span> <span class="token string">"0.0.1"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment">#variables.hcl</span>
<span class="token keyword">variable<span class="token type variable"> "job_name" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"The name to use as the job name which overrides using the pack name"</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> string
  <span class="token comment">// If "", the pack name will be used</span>
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">""</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "datacenters" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"A list of datacenters in the region which are eligible for task placement"</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> list(string)
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "region" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"The region where the job should be placed"</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> string
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"global"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "consul_service_name" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"The consul service you wish to load balance"</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> string
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"webapp"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "version_tag" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"The docker image version. For options, see https://hub.docker.com/repository/docker/swbs90/vuepress"</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> string
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"latest"</span>
<span class="token punctuation">}</span>

<span class="token comment">#variable "http_port" {</span>
<span class="token comment">#  description = "The Nomad client port that routes to the Vuepress. This port will be where you visit your load balanced application"</span>
<span class="token comment">#  type        = number</span>
<span class="token comment">#  default     = 8000</span>
<span class="token comment">#}</span>

<span class="token keyword">variable<span class="token type variable"> "resources" </span></span><span class="token punctuation">{</span>
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"The resource to assign to the Vuepress system task that runs on every client"</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> object(<span class="token punctuation">{</span>
    <span class="token property">cpu</span>    <span class="token punctuation">=</span> number
    <span class="token property">memory</span> <span class="token punctuation">=</span> number
  <span class="token punctuation">}</span>)
  <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">800</span>,
    <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">1200</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment">#vuepress.nomad.tpl</span>
job <span class="token string">"[[ .vuepress.job_name ]]"</span> <span class="token punctuation">{</span>
  <span class="token property">region</span>      <span class="token punctuation">=</span> <span class="token string">"[[ .vuepress.region ]]"</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> .vuepress.datacenters | toPrettyJson <span class="token punctuation">]</span><span class="token punctuation">]</span>
  <span class="token comment">// must have linux for network mode</span>
  <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
    <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>kernel<span class="token punctuation">.</span>name<span class="token punctuation">}</span></span>"</span>
    <span class="token property">value</span>     <span class="token punctuation">=</span> <span class="token string">"linux"</span>
  <span class="token punctuation">}</span>

  group <span class="token string">"vuepress"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"http"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token number">8000</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"[[ .vuepress.consul_service_name ]]"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"http"</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"vuepress"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"swbs90/vuepress:[[ .vuepress.version_tag ]]"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"http"</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> .vuepress.resources.cpu <span class="token punctuation">]</span><span class="token punctuation">]</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span> .vuepress.resources.memory <span class="token punctuation">]</span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nomad-pack-registry-등록-및-실행" tabindex="-1"><a class="header-anchor" href="#nomad-pack-registry-등록-및-실행" aria-hidden="true">#</a> nomad-pack registry 등록 및 실행</h2>
<ul>
<li>이제 다 끝났다. 등록하고 실행하면 된다.</li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment">#커스텀 registry 등록하기</span>
nomad-pack registry add vuepress https:<span class="token comment">//gitlab.com/swbs9000/vuepress.git</span>

<span class="token comment">#배포하기</span>
nomad-pack plan vuepress <span class="token property">--var</span><span class="token punctuation">=</span><span class="token string">"job_name=vuepress"</span> <span class="token property">--var</span><span class="token punctuation">=</span><span class="token string">"consul_service_name=vuepress"</span> <span class="token property">--var</span><span class="token punctuation">=</span><span class="token string">"version_tag=0.0.3"</span> <span class="token property">--registry</span><span class="token punctuation">=</span>vuepress
+/- Job: <span class="token string">"vuepress"</span>
- Meta<span class="token punctuation">[</span>pack.deployment_name<span class="token punctuation">]</span>: <span class="token string">"vuepress@latest"</span>
- Meta<span class="token punctuation">[</span>pack.job<span class="token punctuation">]</span>:             <span class="token string">"vuepress"</span>
- Meta<span class="token punctuation">[</span>pack.name<span class="token punctuation">]</span>:            <span class="token string">"vuepress"</span>
- Meta<span class="token punctuation">[</span>pack.path<span class="token punctuation">]</span>:            <span class="token string">"/root/.nomad/packs/vuepress/vuepress@latest"</span>
- Meta<span class="token punctuation">[</span>pack.registry<span class="token punctuation">]</span>:        <span class="token string">"vuepress"</span>
- Meta<span class="token punctuation">[</span>pack.version<span class="token punctuation">]</span>:         <span class="token string">"latest"</span>
Task Group: <span class="token string">"vuepress"</span> (<span class="token number">1</span> create/destroy update)
    Task: <span class="token string">"vuepress"</span>

» Scheduler dry-run:
- All tasks successfully allocated.
Plan succeeded

nomad-pack run vuepress <span class="token property">--var</span><span class="token punctuation">=</span><span class="token string">"job_name=vuepress"</span> <span class="token property">--var</span><span class="token punctuation">=</span><span class="token string">"consul_service_name=vuepress"</span> <span class="token property">--var</span><span class="token punctuation">=</span><span class="token string">"version_tag=0.0.3"</span> <span class="token property">--registry</span><span class="token punctuation">=</span>vuepress
  Evaluation ID: d38e6717-cd12-<span class="token number">6</span>ef5-<span class="token number">62</span>d4-<span class="token number">9</span>b5da1755020
  Job 'vuepress' in pack deployment 'vuepress@latest' registered successfully
Pack successfully deployed. Use vuepress@latest with <span class="token property">--ref</span><span class="token punctuation">=</span>latest to manage this this deployed instance with plan, stop, destroy, or info

Vuepress(my docma) successfully deployed.

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="작동-확인" tabindex="-1"><a class="header-anchor" href="#작동-확인" aria-hidden="true">#</a> 작동 확인</h2>
<ul>
<li>배포가 잘 되었으면, ip:port가 생성되고 그 정보로 우리가 잘 아는 페이지를 볼 수 있다.
<ul>
<li>배포 확인 및 ip:port 확인<br>
<img src="@source/04-HashiCorp/07-Nomad/05-SampleJob/image/nomad-pack.png" alt="" loading="lazy"></li>
<li>접속 테스트
<ul>
<li>아주 잘 보이고 잘 작동함<br>
<img src="@source/04-HashiCorp/07-Nomad/05-SampleJob/image/vuepress.png" alt="" loading="lazy"></li>
</ul>
</li>
</ul>
</li>
</ul>
</div></template>


