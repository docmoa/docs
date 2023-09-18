<template><div><h1 id="docker-log-driver-and-cloudwatch-on-nomad" tabindex="-1"><a class="header-anchor" href="#docker-log-driver-and-cloudwatch-on-nomad" aria-hidden="true">#</a> Docker log driver and Cloudwatch on Nomad</h1>
<p>docker 런타임에는 log driver로 &quot;awslogs&quot;를 지원합니다.<br>
<a href="https://docs.docker.com/config/containers/logging/awslogs/" target="_blank" rel="noopener noreferrer">https://docs.docker.com/config/containers/logging/awslogs/<ExternalLinkIcon/></a></p>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>Nomad에서 docker 자체의 로깅을 사용하므로서, Nomad에서 실행되는 docker 기반 컨테이너의 로깅이 특정 환경에 락인되는것을 방지합니다.</p>
</div>
<div class="hint-container warning">
<p class="hint-container-title">경고</p>
<p>AWS 환경이 아닌 외부 구성 시, 해당 노드에 Cloudwath 기록을 위한 Policy를 갖는 IAM의 credential 정보가 환경변수 또는 <code v-pre>~/.aws/credential</code> 구성이 필요합니다.</p>
</div>
<h2 id="ec2-instance-role-구성" tabindex="-1"><a class="header-anchor" href="#ec2-instance-role-구성" aria-hidden="true">#</a> EC2 Instance Role 구성</h2>
<p>Nomad 구성 시 Cloudwatch에 대한 EC2 Instance의 IAM 구성이 필요합니다. 아래 Terraform 구성의 예를 참고하세요.</p>
<ul>
<li>loging driver의 구성에 따라 <code v-pre>aws_iam_role_policy</code>에 설정하는 필요한 권한에 차이가 있을 수 있습니다.</li>
<li>예를 들어 docker loging 구성에서 <code v-pre>awslogs-create-group = true</code> 옵션을 추가하려는 경우 <code v-pre>logs:CreateLogGroup</code> 정책이 필요합니다.</li>
<li>권한에 대한 상세 설명은 다음 링크를 참고합니다. <a href="https://docs.aws.amazon.com/ko_kr/AmazonCloudWatch/latest/logs/permissions-reference-cwl.html" target="_blank" rel="noopener noreferrer">https://docs.aws.amazon.com/ko_kr/AmazonCloudWatch/latest/logs/permissions-reference-cwl.html<ExternalLinkIcon/></a></li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code><span class="token comment">## 생략 ##</span>

<span class="token keyword">resource <span class="token type variable">"aws_iam_instance_profile"</span></span> <span class="token string">"ec2_profile"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"ec2_profile"</span>
  <span class="token property">role</span> <span class="token punctuation">=</span> aws_iam_role.role.name
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_iam_role"</span></span> <span class="token string">"role"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"my_role"</span>

  <span class="token property">assume_role_policy</span> <span class="token punctuation">=</span> jsonencode(<span class="token punctuation">{</span>
    <span class="token property">Version</span> <span class="token punctuation">=</span> <span class="token string">"2012-10-17"</span>
    <span class="token property">Statement</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">Action</span> <span class="token punctuation">=</span> <span class="token string">"sts:AssumeRole"</span>
        <span class="token property">Effect</span> <span class="token punctuation">=</span> <span class="token string">"Allow"</span>
        <span class="token property">Sid</span>    <span class="token punctuation">=</span> <span class="token string">""</span>
        <span class="token property">Principal</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
          <span class="token property">Service</span> <span class="token punctuation">=</span> <span class="token string">"ec2.amazonaws.com"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>,
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>)
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_iam_role_policy"</span></span> <span class="token string">"cloudwatch_policy"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>        <span class="token punctuation">=</span> <span class="token string">"cloudwatch_policy"</span>
  <span class="token property">role</span>        <span class="token punctuation">=</span> aws_iam_role.role.id
  
  <span class="token property">policy</span> <span class="token punctuation">=</span> jsonencode(<span class="token punctuation">{</span>
    <span class="token property">Version</span> <span class="token punctuation">=</span> <span class="token string">"2012-10-17"</span>
    <span class="token property">Statement</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">Action</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"logs:CreateLogStream"</span>,
          <span class="token string">"logs:PutLogEvents"</span>,
          <span class="token string">"logs:CreateLogGroup"</span>
        <span class="token punctuation">]</span>
        <span class="token property">Effect</span>   <span class="token punctuation">=</span> <span class="token string">"Allow"</span>
        <span class="token property">Resource</span> <span class="token punctuation">=</span> <span class="token string">"*"</span>
      <span class="token punctuation">}</span>,
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>)
<span class="token punctuation">}</span>

<span class="token keyword">resource <span class="token type variable">"aws_instance"</span></span> <span class="token string">"example"</span> <span class="token punctuation">{</span>
  <span class="token property">ami</span>           <span class="token punctuation">=</span> <span class="token string">"ami-04e6fcf8cfe3b09ea"</span>
  <span class="token property">instance_type</span> <span class="token punctuation">=</span> <span class="token string">"t2.micro"</span>
  <span class="token property">key_name</span>      <span class="token punctuation">=</span> aws_key_pair.web_admin.key_name
  <span class="token property">vpc_security_group_ids</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    aws_security_group.ssh.id
  <span class="token punctuation">]</span>

  <span class="token property">iam_instance_profile</span> <span class="token punctuation">=</span> aws_iam_instance_profile.ec2_profile.name
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="nomad-job의-docker-driver에-logging-설정" tabindex="-1"><a class="header-anchor" href="#nomad-job의-docker-driver에-logging-설정" aria-hidden="true">#</a> Nomad Job의 Docker Driver에 Logging 설정</h2>
<p>Nomad에서 docker 드라이버 사용시 적용되는 기본 log driver는 <code v-pre>json-file</code> 입니다. 추가 설정을 통해 docker가 지원하는 다양한 log driver를 사용할 수 있습니다. (<a href="https://www.nomadproject.io/docs/drivers/docker#logging" target="_blank" rel="noopener noreferrer">FluentD 샘플<ExternalLinkIcon/></a>)</p>
<ul>
<li>구성에 필요한 정보는 Docker의 공식 문서를 참고 합니다. : <a href="https://docs.docker.com/config/containers/logging/configure/" target="_blank" rel="noopener noreferrer">https://docs.docker.com/config/containers/logging/configure/<ExternalLinkIcon/></a></li>
<li>기존 docker cli 상에 구성했던 <code v-pre>--log-driver</code> 같은 옵션의 정의가 HCL형태로 정의됩니다.</li>
<li>HCL 문법을 따르므로, 몇몇 상이한 표현방식이 있을 수 있습니다. 예를들어 로그 날짜 구성에 사용되는 <code v-pre>&quot;\[%Y-%m-%d\]&quot;</code> 에서 <code v-pre>[</code> 같은 특수문자 표기를 위해 <code v-pre>\</code>를 한번만 넣었다면, <code v-pre>&quot;\\[%Y-%m-%d\\]&quot;</code> 같이 두번 넣어야 할수도 있습니다.</li>
</ul>
<p>구성 예제는 아래와 같습니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code>job <span class="token string">"api"</span> <span class="token punctuation">{</span>
	<span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>
  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>

  group <span class="token string">"api"</span> <span class="token punctuation">{</span>
    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      <span class="token property">mode</span> <span class="token punctuation">=</span> <span class="token string">"bridge"</span>
      port <span class="token string">"api"</span> <span class="token punctuation">{</span>
        <span class="token property">to</span> <span class="token punctuation">=</span> <span class="token number">9001</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">service</span> <span class="token punctuation">{</span>
      <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"count-api"</span>
      <span class="token property">port</span> <span class="token punctuation">=</span> <span class="token string">"api"</span>
      <span class="token keyword">connect</span> <span class="token punctuation">{</span>
        <span class="token keyword">sidecar_service</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"web"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"docker"</span>
      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">image</span> <span class="token punctuation">=</span> <span class="token string">"hashicorpnomad/counter-api:v1"</span>
        <span class="token property">ports</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"api"</span><span class="token punctuation">]</span>
        <span class="token keyword">logging</span> <span class="token punctuation">{</span>
          <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"awslogs"</span>
          <span class="token keyword">config</span> <span class="token punctuation">{</span>
            <span class="token property">awslogs-region</span> <span class="token punctuation">=</span> <span class="token string">"ap-northeast-2"</span>
            <span class="token property">awslogs-group</span> <span class="token punctuation">=</span> <span class="token string">"myGroup"</span>
            <span class="token property">awslogs-create-group</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
            <span class="token property">awslogs-datetime-format</span> <span class="token punctuation">=</span> <span class="token string">"\\[%Y-%m-%dT%H:%M:%S\\+09:00\\]"</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="log-확인" tabindex="-1"><a class="header-anchor" href="#log-확인" aria-hidden="true">#</a> Log 확인</h2>
<p>Nomad의 로그 출력을 확인합니다.<br>
<img src="@source/04-HashiCorp/07-Nomad/02-Config/image/Cloudwatch-logging-Nomad.png" alt="NomadLog" loading="lazy"></p>
<p>Cloudwatch에 로그 출력을 확인합니다.<br>
<img src="@source/04-HashiCorp/07-Nomad/02-Config/image/Cloudwatch-logging-aws.png" alt="NomadLog" loading="lazy"></p>
</div></template>


