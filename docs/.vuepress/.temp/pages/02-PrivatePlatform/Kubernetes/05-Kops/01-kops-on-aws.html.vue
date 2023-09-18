<template><div><h1 id="pkos-1편-aws-kops-설치-및-기본-사용" tabindex="-1"><a class="header-anchor" href="#pkos-1편-aws-kops-설치-및-기본-사용" aria-hidden="true">#</a> [PKOS]  1편 - AWS Kops 설치 및 기본 사용</h1>
<blockquote>
<p>💡 본 글은 PKOS(Production Kubernetes Online Study) 2기 스터디의 일부로 작성된 내용입니다.<br>
실제 Production Kubernetes 환경에서 활용 가능한 다양한 정보를 전달하기 위한 시리즈로 작성 예정입니다.</p>
</blockquote>
<h2 id="_1-실습환경-사전준비" tabindex="-1"><a class="header-anchor" href="#_1-실습환경-사전준비" aria-hidden="true">#</a> 1. 실습환경 사전준비</h2>
<p>본 스터디는 AWS 환경에서 Kops(Kubernetes Operations)를 활용한 실습으로 진행할 예정입니다.</p>
<blockquote>
<p>📌 참고 : 필자는 개인적인 이유로 Route 53 계정과, kOps 클러스터 운영 계정을 나눠서 진행합니다.<br>
하나의 계정에서 실습을 진행할 경우에는 사전 환경구성이 다를 수 있는 점 참고 부탁드립니다.</p>
</blockquote>
<h3 id="_1-route-53-도메인-구매" tabindex="-1"><a class="header-anchor" href="#_1-route-53-도메인-구매" aria-hidden="true">#</a> 1) Route 53 도메인 구매</h3>
<p>AWS의 DNS 웹 서비스인 <a href="https://docs.aws.amazon.com/ko_kr/Route53/latest/DeveloperGuide/Welcome.html" target="_blank" rel="noopener noreferrer">Route 53<ExternalLinkIcon/></a>을 통해 도메인을 구입합니다.<br>
필자는  <code v-pre>hyungwook.link</code> 도메인을 구입하였으며, 초기 구입 후  <code v-pre>상태: 도메인 등록 진행 중</code> 인 화면을 확인할 수 있습니다,</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/1_route53.png" alt="image-20230305211458121" tabindex="0" loading="lazy"><figcaption>image-20230305211458121</figcaption></figure>
<p>구입 시 등록했던 이메일 계정으로 발송된 verify 메일 링크를 클릭하여 활성화 합니다.</p>
<h4 id="_1-route53-verify-mail" tabindex="-1"><a class="header-anchor" href="#_1-route53-verify-mail" aria-hidden="true">#</a> (1) Route53 Verify mail</h4>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/2_route53.png" alt="image-20230305211833451" tabindex="0" loading="lazy"><figcaption>image-20230305211833451</figcaption></figure>
<p>일정시간이 지나면 정상적으로 도메인이 활성화 되된 것을 확인할 수 있습니다.</p>
<h4 id="_2-도메인-등록완료-화면" tabindex="-1"><a class="header-anchor" href="#_2-도메인-등록완료-화면" aria-hidden="true">#</a> (2) 도메인 등록완료 화면</h4>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/3_route53.png" alt="image-20230305212617366" tabindex="0" loading="lazy"><figcaption>image-20230305212617366</figcaption></figure>
<ul>
<li>등록된 도메인 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 자신의 도메인에 NS 타입 조회</span>
<span class="token comment"># dig ns &lt;구입한 자신의 도메인> +short</span>
<span class="token function">dig</span> ns hyungwook.link +short
ns-939.awsdns-53.net.
ns-1575.awsdns-04.co.uk.
ns-233.awsdns-29.com.
ns-1466.awsdns-55.org.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-route-53-등록" tabindex="-1"><a class="header-anchor" href="#_2-route-53-등록" aria-hidden="true">#</a> 2) Route 53 등록</h3>
<p>필자는 서두에서 언급한 것 처럼 <strong>Route 53 구매한 계정</strong>과, <strong>kOps 클러스터를 생성할 계정</strong>이 다르므로 다음과 같은 과정을 추가적으로 수행하였습니다.</p>
<h4 id="_1-kops-클러스터를-생성할-계정-pkos-hyungwook-link-레코드를-생성" tabindex="-1"><a class="header-anchor" href="#_1-kops-클러스터를-생성할-계정-pkos-hyungwook-link-레코드를-생성" aria-hidden="true">#</a> (1) Kops 클러스터를 생성할 계정 : <code v-pre>pkos.hyungwook.link</code> 레코드를 생성</h4>
<h4 id="_2-route-53을-구매한-aws-계정-ns-레코드-등록" tabindex="-1"><a class="header-anchor" href="#_2-route-53을-구매한-aws-계정-ns-레코드-등록" aria-hidden="true">#</a> (2) Route 53을 구매한 AWS 계정 : NS 레코드 등록</h4>
<ul>
<li>Kops 클러스터를 생성할 계정에서 등록한 레코드를 정보를 Route 53 구매 계정의 NS 레코드에 등록합니다.</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/4_route53_서브도메인등록.png" alt="image-20230305223503518" tabindex="0" loading="lazy"><figcaption>image-20230305223503518</figcaption></figure>
<blockquote>
<p>📌 참고 : <a href="https://theburningmonk.com/2021/05/how-to-manage-route53-hosted-zones-in-a-multi-account-environment/" target="_blank" rel="noopener noreferrer">How to manage Route53 hosted zones in a multi-account environment<ExternalLinkIcon/></a></p>
</blockquote>
<hr>
<h2 id="_2-kops-클러스터-배포-전-사전준비" tabindex="-1"><a class="header-anchor" href="#_2-kops-클러스터-배포-전-사전준비" aria-hidden="true">#</a> 2. Kops 클러스터 배포 전 사전준비</h2>
<p>이제 실습에서 사용할 도메인 준비가 완료되었으므로, Kops 클러스터 생성을 위한 준비 단계로 넘어갑니다.</p>
<h3 id="_1-aws-credentials-설정" tabindex="-1"><a class="header-anchor" href="#_1-aws-credentials-설정" aria-hidden="true">#</a> 1) AWS Credentials 설정</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># IAM User 자격 구성 : 실습 편리를 위해 administrator 권한을 가진 IAM User 의 자격 증명 입력</span>
aws configure
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-s3-버킷-생성" tabindex="-1"><a class="header-anchor" href="#_2-s3-버킷-생성" aria-hidden="true">#</a> 2) S3 버킷 생성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># k8s 설정 파일이 저장될 버킷 생성</span>
<span class="token comment">## aws s3 mb s3://버킷&lt;유일한 이름> --region &lt;S3 배포될 AWS 리전></span>
aws s3 mb s3://버킷<span class="token operator">&lt;</span>유일한 이름<span class="token operator">></span> <span class="token parameter variable">--region</span> <span class="token variable">$REGION</span>
aws s3 <span class="token function">ls</span>

<span class="token comment">## 예시)</span>
aws s3 mb s3://hyungwook-k8s-s3 <span class="token parameter variable">--region</span> ap-northeast-2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-클러스터-배포" tabindex="-1"><a class="header-anchor" href="#_3-클러스터-배포" aria-hidden="true">#</a> 3. 클러스터 배포</h2>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 변수설정</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">AWS_PAGER</span><span class="token operator">=</span><span class="token string">""</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">REGION</span><span class="token operator">=</span>ap-northeast-2
<span class="token builtin class-name">export</span> <span class="token assign-left variable">KOPS_CLUSTER_NAME</span><span class="token operator">=</span>pkos.hyungwook.link
<span class="token builtin class-name">export</span> <span class="token assign-left variable">KOPS_STATE_STORE</span><span class="token operator">=</span>s3://hyungwook-k8s-s3
<span class="token builtin class-name">echo</span> <span class="token string">'export AWS_PAGER=""'</span> <span class="token operator">>></span>~/.bashrc
<span class="token builtin class-name">echo</span> <span class="token string">'export REGION=ap-northeast-2'</span> <span class="token operator">>></span>~/.bashrc
<span class="token builtin class-name">echo</span> <span class="token string">'export KOPS_CLUSTER_NAME=pkos.hyungwook.link'</span> <span class="token operator">>></span>~/.bashrc
<span class="token builtin class-name">echo</span> <span class="token string">'export KOPS_STATE_STORE=s3://hyungwook-k8s-s3'</span> <span class="token operator">>></span>~/.bashrc

<span class="token comment"># kops 설정 파일 생성(s3) 및 k8s 클러스터 배포 : 6분 정도 소요</span>
<span class="token comment">## CNI는 aws vpc cni 사용, 마스터 노드 1대(t3.medium), 워커 노드 2대(t3.medium), 파드 사용 네트워크 대역 지정(172.30.0.0/16)</span>
<span class="token comment">## --container-runtime containerd --kubernetes-version 1.24.0 ~ 1.25.6</span>
kops create cluster <span class="token parameter variable">--zones</span><span class="token operator">=</span><span class="token string">"<span class="token variable">$REGION</span>"</span>a,<span class="token string">"<span class="token variable">$REGION</span>"</span>c <span class="token parameter variable">--networking</span> amazonvpc <span class="token parameter variable">--cloud</span> aws <span class="token punctuation">\</span>
--master-size t3.medium --node-size t3.medium --node-count<span class="token operator">=</span><span class="token number">2</span> --network-cidr <span class="token number">172.30</span>.0.0/16 <span class="token punctuation">\</span>
--ssh-public-key ~/.ssh/id_rsa.pub <span class="token parameter variable">--name</span><span class="token operator">=</span><span class="token variable">$KOPS_CLUSTER_NAME</span> --kubernetes-version <span class="token string">"1.24.10"</span> --dry-run <span class="token parameter variable">-o</span> yaml <span class="token operator">></span> mykops.yaml

kops create cluster <span class="token parameter variable">--zones</span><span class="token operator">=</span><span class="token string">"<span class="token variable">$REGION</span>"</span>a,<span class="token string">"<span class="token variable">$REGION</span>"</span>c <span class="token parameter variable">--networking</span> amazonvpc <span class="token parameter variable">--cloud</span> aws <span class="token punctuation">\</span>
--master-size t3.medium --node-size t3.medium --node-count<span class="token operator">=</span><span class="token number">2</span> --network-cidr <span class="token number">172.30</span>.0.0/16 <span class="token punctuation">\</span>
--ssh-public-key ~/.ssh/id_rsa.pub <span class="token parameter variable">--name</span><span class="token operator">=</span><span class="token variable">$KOPS_CLUSTER_NAME</span> --kubernetes-version <span class="token string">"1.24.10"</span> <span class="token parameter variable">-y</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-kops-클러스터-배포-시-route-53-a-레코드-화면-등록중" tabindex="-1"><a class="header-anchor" href="#_1-kops-클러스터-배포-시-route-53-a-레코드-화면-등록중" aria-hidden="true">#</a> 1) kOps 클러스터 배포 시 Route 53  A 레코드 화면(등록중)</h3>
<p>A 레코드값이 자동으로 추가된 모습을 확인할 수 있습니다. 하지만 실제 api 서버와 내부 controller의 IP 주소가 등록되지 않았기 때문에, 실제 클러스터가 정상적으로 구성된 이후에는 자동으로 A 레코드가 업데이트 됩니다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/5_route53_호스팅영영_등록중.png" alt="image-20230305223938653" tabindex="0" loading="lazy"><figcaption>image-20230305223938653</figcaption></figure>
<ul>
<li>A 레코드 조회 CLI 명령 : <code v-pre>aws route53</code></li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>aws route53 list-resource-record-sets --hosted-zone-id <span class="token string">"<span class="token variable">${MyDnzHostedZoneId}</span>"</span> <span class="token parameter variable">--query</span> <span class="token string">"ResourceRecordSets[?Type == 'A'].Name"</span> <span class="token operator">|</span> jq

<span class="token punctuation">[</span>
  <span class="token string">"api.pkos.hyungwook.link."</span>,
  <span class="token string">"api.internal.pkos.hyungwook.link."</span>,
  <span class="token string">"kops-controller.internal.pkos.hyungwook.link."</span>
<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이때, <code v-pre>kops validate</code> 명령으로 확인하면 아직까지 <code v-pre>api.pkos.hyungwook.link</code> 가 relov 되지 않는 것을 확인할 수 있습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kops validate cluster <span class="token parameter variable">--wait</span> 10m
Validating cluster pkos.hyungwook.link

W0305 <span class="token number">22</span>:38:08.780600    <span class="token number">4256</span> validate_cluster.go:184<span class="token punctuation">]</span> <span class="token punctuation">(</span>will retry<span class="token punctuation">)</span>: unexpected error during validation: unable to resolve Kubernetes cluster API URL dns: lookup api.pkos.hyungwook.link: no such <span class="token function">host</span>
W0305 <span class="token number">22</span>:38:18.788067    <span class="token number">4256</span> validate_cluster.go:184<span class="token punctuation">]</span> <span class="token punctuation">(</span>will retry<span class="token punctuation">)</span>: unexpected error during validation: unable to resolve Kubernetes cluster API URL dns: lookup api.pkos.hyungwook.link: no such <span class="token function">host</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>어느정도 시간이 지난 후 정상적으로 A 레코드 값이 변경된 것을 확인할 수 있습니다.</p>
<h3 id="_2-kops-클러스터-배포-시-route-53-a-레코드-화면-등록완료" tabindex="-1"><a class="header-anchor" href="#_2-kops-클러스터-배포-시-route-53-a-레코드-화면-등록완료" aria-hidden="true">#</a> 2) kOps 클러스터 배포 시 Route 53  A 레코드 화면(등록완료 )</h3>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/6_route53_호스팅영영_등록완료.png" alt="image-20230306000758876" tabindex="0" loading="lazy"><figcaption>image-20230306000758876</figcaption></figure>
<ul>
<li>A 레코드 및 값 반복조회</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># A 레코드 및 값 반복조회</span>
<span class="token keyword">while</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token keyword">do</span> aws route53 list-resource-record-sets --hosted-zone-id <span class="token string">"<span class="token variable">${MyDnzHostedZoneId}</span>"</span> <span class="token parameter variable">--query</span> <span class="token string">"ResourceRecordSets[?Type == 'A']"</span> <span class="token operator">|</span> jq <span class="token punctuation">;</span> <span class="token function">date</span> <span class="token punctuation">;</span> <span class="token builtin class-name">echo</span> <span class="token punctuation">;</span> <span class="token function">sleep</span> <span class="token number">1</span><span class="token punctuation">;</span> <span class="token keyword">done</span>
<span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token string">"Name"</span><span class="token builtin class-name">:</span> <span class="token string">"api.pkos.hyungwook.link."</span>,
    <span class="token string">"Type"</span><span class="token builtin class-name">:</span> <span class="token string">"A"</span>,
    <span class="token string">"TTL"</span><span class="token builtin class-name">:</span> <span class="token number">60</span>,
    <span class="token string">"ResourceRecords"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token string">"Value"</span><span class="token builtin class-name">:</span> <span class="token string">"43.201.33.161"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>,
  <span class="token punctuation">{</span>
    <span class="token string">"Name"</span><span class="token builtin class-name">:</span> <span class="token string">"api.internal.pkos.hyungwook.link."</span>,
    <span class="token string">"Type"</span><span class="token builtin class-name">:</span> <span class="token string">"A"</span>,
    <span class="token string">"TTL"</span><span class="token builtin class-name">:</span> <span class="token number">60</span>,
    <span class="token string">"ResourceRecords"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token string">"Value"</span><span class="token builtin class-name">:</span> <span class="token string">"172.30.37.41"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>,
  <span class="token punctuation">{</span>
    <span class="token string">"Name"</span><span class="token builtin class-name">:</span> <span class="token string">"kops-controller.internal.pkos.hyungwook.link."</span>,
    <span class="token string">"Type"</span><span class="token builtin class-name">:</span> <span class="token string">"A"</span>,
    <span class="token string">"TTL"</span><span class="token builtin class-name">:</span> <span class="token number">60</span>,
    <span class="token string">"ResourceRecords"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token string">"Value"</span><span class="token builtin class-name">:</span> <span class="token string">"172.30.37.41"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span>
<span class="token number">2023</span>년 <span class="token number">3</span>월  <span class="token number">5</span>일 일요일 <span class="token number">22</span>시 <span class="token number">41</span>분 <span class="token number">46</span>초 KST
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이제 정상적으로 A 레코드가 등록된 것을 확인할 수 있으며 설치가 자동으로 진행됩니다.</p>
<h3 id="_3-kops-validate-cluster-명령-생성확인" tabindex="-1"><a class="header-anchor" href="#_3-kops-validate-cluster-명령-생성확인" aria-hidden="true">#</a> 3) <code v-pre>kops validate cluster</code> 명령(생성확인)</h3>
<p>실제 kops 클러스터가 정상적으로 배포된 것을 확인할 수 있습니다.</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code>kops validate cluster
Validating cluster pkos.hyungwook.link

INSTANCE GROUPS
NAME			ROLE	MACHINETYPE	MIN	MAX	SUBNETS
master-ap-northeast-2a	Master	t3.medium	<span class="token number">1</span>	<span class="token number">1</span>	ap-northeast-2a
nodes-ap-northeast-2a	Node	t3.medium	<span class="token number">1</span>	<span class="token number">1</span>	ap-northeast-2a
nodes-ap-northeast-2c	Node	t3.medium	<span class="token number">1</span>	<span class="token number">1</span>	ap-northeast-2c

NODE STATUS
NAME			ROLE	READY
i-089062ff9f50789ee	node	True
i-096a645be0dd932b6	node	True
i-0dce8997b4633b806	master	True

Your cluster pkos.hyungwook.link is ready
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>📌 참고 :  Kops 클러스터 <code v-pre>kubeconfig</code> 파일 업데이트 명령</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 권한이 없을 경우</span>
kubectl get nodes <span class="token parameter variable">-o</span> wide
error: You must be logged <span class="token keyword">in</span> to the server <span class="token punctuation">(</span>Unauthorized<span class="token punctuation">)</span>

<span class="token comment"># kubeconfig 업데이트</span>
kops <span class="token builtin class-name">export</span> kubeconfig <span class="token parameter variable">--name</span> pkos.hyungwook.link <span class="token parameter variable">--admin</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-샘플-애플리케이션-배포" tabindex="-1"><a class="header-anchor" href="#_4-샘플-애플리케이션-배포" aria-hidden="true">#</a> 4. 샘플 애플리케이션 배포</h2>
<h3 id="_1-service-pod-with-clb-mario-게임" tabindex="-1"><a class="header-anchor" href="#_1-service-pod-with-clb-mario-게임" aria-hidden="true">#</a> 1) Service / Pod with CLB : Mario 게임</h3>
<ul>
<li>Deployment, SVC 배포</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token comment"># 수퍼마리오 디플로이먼트 배포</span>
curl <span class="token punctuation">-</span>s <span class="token punctuation">-</span>O https<span class="token punctuation">:</span>//raw.githubusercontent.com/gasida/PKOS/main/1/mario.yaml
kubectl apply <span class="token punctuation">-</span>f mario.yaml
cat mario.yaml <span class="token punctuation">|</span> yh
deployment.apps/mario created
service/mario created
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mario
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> mario
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> mario
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> mario
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> mario
        <span class="token key atrule">image</span><span class="token punctuation">:</span> pengbai/docker<span class="token punctuation">-</span>supermario
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
   <span class="token key atrule">name</span><span class="token punctuation">:</span> mario
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> mario
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
    <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
  <span class="token key atrule">type</span><span class="token punctuation">:</span> LoadBalancer
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Deploy, SVC, EP 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 배포 확인 : CLB 배포 확인 >> 5분 이상 소요</span>
kubectl get deploy,svc,ep mario
<span class="token function">watch</span> kubectl get svc mario

<span class="token comment"># Watch 명령 실행 후 &lt;pending></span>
Every <span class="token number">2</span>.0s: kubectl get svc mario                                                                                                     hyungwook-Q9W5QX7FGY: Sat Mar <span class="token number">11</span> <span class="token number">21</span>:50:41 <span class="token number">2023</span>
NAME    TYPE           CLUSTER-IP       EXTERNAL-IP   PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>        AGE
mario   LoadBalancer   <span class="token number">100.67</span>.138.178   <span class="token operator">&lt;</span>pending<span class="token operator">></span>     <span class="token number">80</span>:30624/TCP   92s

<span class="token comment"># External-IP 할당</span>
kubectl get svc mario
NAME    TYPE           CLUSTER-IP       EXTERNAL-IP                                                                   PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>        AGE
mario   LoadBalancer   <span class="token number">100.67</span>.138.178   a643cc3e6e2c54ed8989c95d0481f48c-113657418.ap-northeast-2.elb.amazonaws.com   <span class="token number">80</span>:30624/TCP   3m7s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>CLB로 접속</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 마리오 게임 접속 : CLB 주소로 웹 접속</span>
kubectl get svc mario <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">"{.status.loadBalancer.ingress[0].hostname}"</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">'{ print "Maria URL = http://"$1 }'</span>

<span class="token comment"># 결과 값</span>
Maria URL <span class="token operator">=</span> http://a643cc3e6e2c54ed8989c95d0481f48c-113657418.ap-northeast-2.elb.amazonaws.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>마리오 게임 화면</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/9_CLA_마리오게임_접속.png" alt="image-20230311215543207" tabindex="0" loading="lazy"><figcaption>image-20230311215543207</figcaption></figure>
<h2 id="_5-추가-external-dns" tabindex="-1"><a class="header-anchor" href="#_5-추가-external-dns" aria-hidden="true">#</a> 5. (추가) External DNS</h2>
<p>External DNS은 K8s Service / Ingress 생성 시 도메인을 설정하면 자동으로 AWS Route53의 A 레코드(TXT  레코드)에 자동 생성/삭제를 제공합니다.</p>
<ul>
<li>이미지 참고 <a href="https://edgehog.blog/a-self-hosted-external-dns-resolver-for-kubernetes-111a27d6fc2c" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
</ul>
<figure><img src="https://miro.medium.com/v2/resize:fit:1400/0*HoU4pgcDE10AVTAu.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h3 id="_1-external-dns-addon-설치" tabindex="-1"><a class="header-anchor" href="#_1-external-dns-addon-설치" aria-hidden="true">#</a> 1) External DNS - Addon 설치</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 정책 생성 -> 마스터/워커노드에 정책 연결</span>
<span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-O</span> https://s3.ap-northeast-2.amazonaws.com/cloudformation.cloudneta.net/AKOS/externaldns/externaldns-aws-r53-policy.json
aws iam create-policy --policy-name AllowExternalDNSUpdates --policy-document file://externaldns-aws-r53-policy.json

<span class="token comment"># ACCOUNT_ID 변수 지정</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">ACCOUNT_ID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws sts get-caller-identity <span class="token parameter variable">--query</span> <span class="token string">'Account'</span> <span class="token parameter variable">--output</span> text<span class="token variable">)</span></span>

<span class="token comment"># EC2 instance profiles 에 IAM Policy 추가(attach)</span>
aws iam attach-role-policy --policy-arn arn:aws:iam::<span class="token variable">$ACCOUNT_ID</span>:policy/AllowExternalDNSUpdates --role-name masters.<span class="token variable">$KOPS_CLUSTER_NAME</span>
aws iam attach-role-policy --policy-arn arn:aws:iam::<span class="token variable">$ACCOUNT_ID</span>:policy/AllowExternalDNSUpdates --role-name nodes.<span class="token variable">$KOPS_CLUSTER_NAME</span>

<span class="token comment"># 설치</span>
kops edit cluster
--------------------------
spec:
  certManager:    <span class="token comment"># 없어도됨!</span>
    enabled: <span class="token boolean">true</span> <span class="token comment"># 없어도됨!</span>
  externalDns:
    provider: external-dns
--------------------------

<span class="token comment"># 업데이트 적용</span>
kops update cluster <span class="token parameter variable">--yes</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token operator">&amp;&amp;</span> <span class="token function">sleep</span> <span class="token number">3</span> <span class="token operator">&amp;&amp;</span> kops rolling-update cluster

<span class="token comment"># externalDns 컨트롤러 파드 확인</span>
kubectl get pod <span class="token parameter variable">-n</span> kube-system <span class="token parameter variable">-l</span> k8s-app<span class="token operator">=</span>external-dns
NAME                          READY   STATUS    RESTARTS   AGE
external-dns-5bc8fcf8-7vznp   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          14s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-mario-서비스에-도메인-연결" tabindex="-1"><a class="header-anchor" href="#_2-mario-서비스에-도메인-연결" aria-hidden="true">#</a> 2) Mario 서비스에 도메인 연결</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># CLB에 ExternanDNS 로 도메인 연결</span>
kubectl annotate <span class="token function">service</span> mario <span class="token string">"external-dns.alpha.kubernetes.io/hostname=mario.<span class="token variable">$KOPS_CLUSTER_NAME</span>"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_1-route-53-a-레코드-등록-확인" tabindex="-1"><a class="header-anchor" href="#_1-route-53-a-레코드-등록-확인" aria-hidden="true">#</a> (1) Route 53 A 레코드 등록 확인</h4>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/ukvLhO.jpg" alt="Mario 도메인" tabindex="0" loading="lazy"><figcaption>Mario 도메인</figcaption></figure>
<h4 id="_2-등록된-a-레코드에-대한-도메인-체크" tabindex="-1"><a class="header-anchor" href="#_2-등록된-a-레코드에-대한-도메인-체크" aria-hidden="true">#</a> (2) 등록된 A 레코드에 대한 도메인 체크</h4>
<ul>
<li>사이트를 통한 확인 - <a href="https://www.whatsmydns.net/" target="_blank" rel="noopener noreferrer">참고<ExternalLinkIcon/></a></li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/jGLPD7.jpg" alt="도메인 체크" tabindex="0" loading="lazy"><figcaption>도메인 체크</figcaption></figure>
<ul>
<li>명령을 통한 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># external-dns 등록로그 확인</span>
kubectl logs <span class="token parameter variable">-n</span> kube-system <span class="token parameter variable">-l</span> k8s-app<span class="token operator">=</span>external-dns

<span class="token assign-left variable">time</span><span class="token operator">=</span><span class="token string">"2023-03-11T14:54:51Z"</span> <span class="token assign-left variable">level</span><span class="token operator">=</span>info <span class="token assign-left variable">msg</span><span class="token operator">=</span><span class="token string">"Applying provider record filter for domains: [pkos.hyungwook.link. .pkos.hyungwook.link.]"</span>
<span class="token assign-left variable">time</span><span class="token operator">=</span><span class="token string">"2023-03-11T14:54:51Z"</span> <span class="token assign-left variable">level</span><span class="token operator">=</span>info <span class="token assign-left variable">msg</span><span class="token operator">=</span><span class="token string">"All records are already up to date"</span>
<span class="token punctuation">..</span>.<span class="token punctuation">(</span>생략<span class="token punctuation">)</span>

<span class="token comment"># 확인</span>
<span class="token function">dig</span> +short mario.<span class="token variable">$KOPS_CLUSTER_NAME</span>

<span class="token comment"># 웹 접속 주소 확인 및 접속</span>
<span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">"Maria Game URL = http://mario.<span class="token variable">$KOPS_CLUSTER_NAME</span>"</span>

<span class="token comment"># 도메인 체크</span>
<span class="token builtin class-name">echo</span> <span class="token parameter variable">-e</span> <span class="token string">"My Domain Checker = https://www.whatsmydns.net/#A/mario.<span class="token variable">$KOPS_CLUSTER_NAME</span>"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-마무리" tabindex="-1"><a class="header-anchor" href="#_6-마무리" aria-hidden="true">#</a> 6. 마무리</h2>
<h3 id="_1-리소스-삭제" tabindex="-1"><a class="header-anchor" href="#_1-리소스-삭제" aria-hidden="true">#</a> 1) 리소스 삭제</h3>
<ul>
<li>마리오 리소스 삭제</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl delete deploy,svc mario
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>Kops 클러스터 삭제</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kops delete cluster <span class="token parameter variable">--yes</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>본 편에서는 Kops 클러스터를 구성방안 및 External DNS를 연동한 외부 서비스 노출에 대한 방법을 살펴보았습니다.</p>
<p>다음편에서는 네트워크 및 스토리지에 대한 활용방안을 살펴보겠습니다.</p>
</div></template>


