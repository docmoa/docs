<template><div><h1 id="aews-1주차-amzaon-eks-설치-및-기본-사용" tabindex="-1"><a class="header-anchor" href="#aews-1주차-amzaon-eks-설치-및-기본-사용" aria-hidden="true">#</a> AEWS 1주차 - Amzaon EKS 설치 및 기본 사용</h1>
<p>이번에 연재할 스터디는 AWS EKS Workshop Study (=AEWS)이다. AWS에서 공식적으로 제공되는 다양한 HOL 기반의 Workshop과 가시다님의 팀에서 2차 가공한 컨텐츠를 기반으로 진행한다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/751VTo.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>필자는 기본적인 스터디내용을 이번 시리즈에 연재할 예정이며, 추가적으로 HashiCorp의 Consul, Vault 등을 샘플로 배포하며 연동하는 내용을 조금씩 다뤄볼 예정이다.</p>
<h2 id="aws-workshop-eks-관련" tabindex="-1"><a class="header-anchor" href="#aws-workshop-eks-관련" aria-hidden="true">#</a> AWS Workshop - EKS 관련</h2>
<blockquote>
<p>참고 : AWS EKS 관련 핸즈온 워크샵을 해볼 수 있는 다양한 링크 모음이다.</p>
</blockquote>
<ul>
<li>[AWS] EKS Workshop - <a href="https://www.eksworkshop.com/" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a> / Github - <a href="https://github.com/aws-samples/eks-workshop-v2" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a> / Blog - <a href="https://aws.amazon.com/ko/blogs/containers/introducing-the-amazon-eks-workshop/" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a> / Youtube - <a href="https://www.youtube.com/@ContainersfromtheCouch" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a> <a href="https://www.youtube.com/@ContainersfromtheCouch/streams" target="_blank" rel="noopener noreferrer">Streams<ExternalLinkIcon/></a></li>
<li>[한글] EKS 웹 앱 구축 - <a href="https://catalog.us-east-1.prod.workshops.aws/workshops/9c0aa9ab-90a9-44a6-abe1-8dff360ae428/ko-KR" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a> / (Old) Amazon EKS 워크샵 - <a href="https://awskrug.github.io/eks-workshop/" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
<li>[한글/whchoi98] EKS Hands On LAB - <a href="https://awskocaptain.gitbook.io/aws-builders-eks/" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
<li>[AWS] EKS Terraform Workshop - <a href="https://tf-eks-workshop.workshop.aws/" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a> / Youtube - <a href="https://www.youtube.com/live/TXa-y-Uwh2w?feature=share" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
<li>[AWS] EKS Best Practices Guides - <a href="https://aws.github.io/aws-eks-best-practices/" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
<li>[AWS workshop studio] Running batch workloads on Amazon EKS with AWS Batch - <a href="https://catalog.us-east-1.prod.workshops.aws/workshops/b67b6665-f7a2-427f-affb-caccd087d50d/en-US" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
<li>[AWS workshop studio] Manage your EKS cluster in Full-stack with CDK - <a href="https://catalog.us-east-1.prod.workshops.aws/workshops/c15012ac-d05d-46b1-8a4a-205e7c9d93c9/en-US" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
<li>[AWS workshop studio] One Observability Workshop - <a href="https://catalog.workshops.aws/observability/en-US" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
<li>[AWS workshop studio] Web Application Hosts on EKS Workshop - <a href="https://catalog.us-east-1.prod.workshops.aws/workshops/a1101fcc-c7cf-4dd5-98c4-f599a65056d5/en-US" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
<li>[한글/AWS workshop studio] AWS General Immersion Day - <a href="https://catalog.workshops.aws/general-immersionday/ko-KR" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
<li>[한글/whchoi98] AWS IAM Hands On LAB - <a href="https://whchoi98.gitbook.io/aws-iam/" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
</ul>
<blockquote>
<p><s>여담이지만, HashiCorp 솔루션에 대한 다양한 HOL Workshop 실습도 사용자들이 많이 만들고 기여할 수 있도록 플랫폼을 오픈하면 좋을 것 같다.</s></p>
</blockquote>
<h2 id="amazon-eks-소개" tabindex="-1"><a class="header-anchor" href="#amazon-eks-소개" aria-hidden="true">#</a> Amazon EKS 소개</h2>
<figure><img src="https://static.us-east-1.prod.workshops.aws/public/e7ab9b91-502d-4ada-84e2-5c8b92d8f791/static/images/10-intro/eks_architecture.svg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>Amazon <strong>E</strong>lastic <strong>K</strong>ubernetes Service는 자체 Kubernetes 컨트롤 플레인 또는 노드를 설치, 운영 및 유지 관리할 필요 없이 Kubernetes 실행에 사용할 수 있는 관리형 서비스이다.</p>
<p>EKS를 사용하는 다양한 이유가 있겠지만 대표적으로 여러 AWS 서비스와 통합할 수 있다는 장점이 크다.</p>
<ul>
<li>컨테이너 이미지 저장소 Amazon ECR</li>
<li>로드 분산을 위한 ELB</li>
<li>고가용성 스토리지 서비스를 위한 EBS/EFS</li>
<li>인증 IAM</li>
<li>격리를 위한 Amazon VPC</li>
</ul>
<p>다만 단점(?)이라고 할 수 있는 부분은 지원 버전이  보통 4개의 마이너 버전 지원(현재 1.22~1.26), 평균 3개월마다 새 버전 제공, 각 버전은 12개월 정도 지원한다는 것이다. <a href="https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></p>
<p>이 부분이 단점이라고 이야기하는 이유는 실제 서비스를 운영하보면 EKS 클러스터 업그레이드를 하기위한 운영조직 체계가 갖춰져 있지 않은 상황에서 강제로 EKS 구버전에 대한 업그레이드를 해야하는 상황을 직면할 수 있기 때문이다.</p>
<p>물론, 보안, 서비스 지원 등 다양한 이유로 인해 클러스터 업그레이드는 불가피하지만 때때로 업그레이드를 강제해야하는 것은 특정 서비스를 운영하는 조직에게는 큰 걸림돌이 될 수 있다.</p>
<p>기회가 된다면 이번 스터디중에 EKS 업그레이드로 인한 어려움을 겪었던 사례를 발표해보려 한다.</p>
<blockquote>
<p>참고 : EKS 업데이트 캘린더 : <a href="https://endoflife.date/amazon-eks" target="_blank" rel="noopener noreferrer">https://endoflife.date/amazon-eks<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="amazon-eks-클러스터-구성-방안" tabindex="-1"><a class="header-anchor" href="#amazon-eks-클러스터-구성-방안" aria-hidden="true">#</a> Amazon EKS 클러스터 구성 방안</h2>
<p>EKS 클러스터는 다음과 같은 방식으로 배포할 수 있다.</p>
<ul>
<li>웹 관리 콘솔</li>
<li><strong>eksctl</strong></li>
<li>기타(CDK, CloudFormation, Terraform 등)</li>
</ul>
<p>이번 EKS 스터디 시리즈에서는  <code v-pre>eksctl</code> 을 활용한 배포방식을 활용할 예정이다.</p>
<blockquote>
<p>eksctl : EKS 클러스터 구축 및 관리를 하기 위한 오프소스 명령줄 도구 - <a href="https://eksctl.io/" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></p>
</blockquote>
<figure><img src="https://eksctl.io/img/eksctl.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h2 id="실습환경-구성" tabindex="-1"><a class="header-anchor" href="#실습환경-구성" aria-hidden="true">#</a> 실습환경 구성</h2>
<p>실습환경은 외부에서 접근 가능한 Bastion 역할을 하는 EC2와  퍼블릭 서브넷 2개에 워커노드 두 대를 구성한다.</p>
<blockquote>
<p>참고 : 실습환경 변경 챕터에서 노드를 3대로 증설예정</p>
</blockquote>
<ul>
<li>실습환경 아키텍처(출처:가시다님 스터디)</li>
</ul>
<img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/2DsILw.jpg" alt="img" style="zoom: 33%;" />
<ul>
<li>Cloudformantion을 통한 Bastion 노드 배포</li>
</ul>
<p>간단하게 VPC, Security Group, EC2 등을 구성하는 CF 코드를 통해 사전 환경을 구성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>aws cloudformation deploy --template-file myeks-1week.yaml <span class="token punctuation">\</span>
     --stack-name myeks --parameter-overrides <span class="token assign-left variable">KeyName</span><span class="token operator">=</span>hw-key <span class="token assign-left variable">SgIngressSshCidr</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">-s</span> ipinfo.io/ip<span class="token variable">)</span></span>/32 <span class="token parameter variable">--region</span> ap-northeast-2

Waiting <span class="token keyword">for</span> changeset to be created<span class="token punctuation">..</span>
Waiting <span class="token keyword">for</span> stack create/update to complete
Successfully created/updated stack - myeks

<span class="token comment"># Public IP 확인</span>
aws cloudformation describe-stacks --stack-name myeks <span class="token parameter variable">--query</span> <span class="token string">'Stacks[*].Outputs[*].OutputValue'</span> <span class="token parameter variable">--output</span> text
<span class="token number">13.124</span>.14.182

<span class="token comment"># ec2 에 SSH 접속</span>
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ec2-user@<span class="token variable"><span class="token variable">$(</span>aws cloudformation describe-stacks --stack-name myeks <span class="token parameter variable">--query</span> <span class="token string">'Stacks[*].Outputs[0].OutputValue'</span> <span class="token parameter variable">--output</span> text<span class="token variable">)</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>VPC 구성 확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/6ulJkf.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>필자의 경우에는 AWS IAM 계정 정책에 대한 제약사항이 있어,  <code v-pre>aws configure</code> 명령등으로 <code v-pre>access_key</code>, <code v-pre>secret_key</code> 설정을 하지않고 EC2 인스턴스에 admin 권한을 부여하여 사용하였다.</p>
<ul>
<li>Cloudformation 으로 배포한 myeks-host인스턴스에 <code v-pre>eks-admin</code> 이라고하는 admin 권한의 역할을 생성 후 부여</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/eObYCj.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>환경변수 설정  및 EKS 클러스터 배포</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># EKS 배포할 VPC 정보 확인</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">VPCID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws ec2 describe-vpcs <span class="token parameter variable">--filters</span> <span class="token string">"Name=tag:Name,Values=<span class="token variable">$CLUSTER_NAME</span>-VPC"</span> <span class="token operator">|</span> jq <span class="token parameter variable">-r</span> .Vpcs<span class="token punctuation">[</span><span class="token punctuation">]</span>.VpcId<span class="token variable">)</span></span>
<span class="token builtin class-name">echo</span> <span class="token string">"export VPCID=<span class="token variable">$VPCID</span>"</span> <span class="token operator">>></span> /etc/profile
<span class="token builtin class-name">echo</span> VPCID

<span class="token comment">## 퍼블릭 서브넷 ID 확인</span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">PubSubnet1</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws ec2 describe-subnets <span class="token parameter variable">--filters</span> <span class="token assign-left variable">Name</span><span class="token operator">=</span>tag:Name,Values<span class="token operator">=</span><span class="token string">"<span class="token variable">$CLUSTER_NAME</span>-PublicSubnet1"</span> <span class="token parameter variable">--query</span> <span class="token string">"Subnets[0].[SubnetId]"</span> <span class="token parameter variable">--output</span> text<span class="token variable">)</span></span>
<span class="token builtin class-name">export</span> <span class="token assign-left variable">PubSubnet2</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>aws ec2 describe-subnets <span class="token parameter variable">--filters</span> <span class="token assign-left variable">Name</span><span class="token operator">=</span>tag:Name,Values<span class="token operator">=</span><span class="token string">"<span class="token variable">$CLUSTER_NAME</span>-PublicSubnet2"</span> <span class="token parameter variable">--query</span> <span class="token string">"Subnets[0].[SubnetId]"</span> <span class="token parameter variable">--output</span> text<span class="token variable">)</span></span>
<span class="token builtin class-name">echo</span> <span class="token string">"export PubSubnet1=<span class="token variable">$PubSubnet1</span>"</span> <span class="token operator">>></span> /etc/profile
<span class="token builtin class-name">echo</span> <span class="token string">"export PubSubnet2=<span class="token variable">$PubSubnet2</span>"</span> <span class="token operator">>></span> /etc/profile
<span class="token builtin class-name">echo</span> <span class="token variable">$PubSubnet1</span>
<span class="token builtin class-name">echo</span> <span class="token variable">$PubSubnet2</span>

<span class="token comment"># EKS 클러스터 배포</span>
eksctl create cluster <span class="token parameter variable">--name</span> <span class="token variable">$CLUSTER_NAME</span> <span class="token parameter variable">--region</span><span class="token operator">=</span><span class="token variable">$AWS_DEFAULT_REGION</span> --nodegroup-name<span class="token operator">=</span><span class="token variable">$CLUSTER_NAME</span>-nodegroup --node-type<span class="token operator">=</span>t3.medium --node-volume-size<span class="token operator">=</span><span class="token number">30</span> --vpc-public-subnets <span class="token string">"<span class="token variable">$PubSubnet1</span>,<span class="token variable">$PubSubnet2</span>"</span> <span class="token parameter variable">--version</span> <span class="token number">1.24</span> --ssh-access --external-dns-access <span class="token parameter variable">--verbose</span> <span class="token number">4</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>EKS 클러스터를 명령형으로 배포하지 않고 YAML로 작성하여 언언적으로 배포하는 것도 가능하다. 다음은 앞서 실행한 <code v-pre>eksctl create cluster</code> 명령의 <code v-pre> --dry-run</code> 옵션을 통해 추출한 명세이다.</p>
<ul>
<li>myeks-sample.yaml</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> eksctl.io/v1alpha5
<span class="token key atrule">cloudWatch</span><span class="token punctuation">:</span>
  <span class="token key atrule">clusterLogging</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token key atrule">iam</span><span class="token punctuation">:</span>
  <span class="token key atrule">vpcResourceControllerPolicy</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">withOIDC</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterConfig
<span class="token key atrule">kubernetesNetworkConfig</span><span class="token punctuation">:</span>
  <span class="token key atrule">ipFamily</span><span class="token punctuation">:</span> IPv4
<span class="token key atrule">managedNodeGroups</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">amiFamily</span><span class="token punctuation">:</span> AmazonLinux2
  <span class="token key atrule">desiredCapacity</span><span class="token punctuation">:</span> <span class="token number">2</span>
  <span class="token key atrule">disableIMDSv1</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">disablePodIMDS</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">iam</span><span class="token punctuation">:</span>
    <span class="token key atrule">withAddonPolicies</span><span class="token punctuation">:</span>
      <span class="token key atrule">albIngress</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">appMesh</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">appMeshPreview</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">autoScaler</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">awsLoadBalancerController</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">certManager</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">cloudWatch</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">ebs</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">efs</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">externalDNS</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token key atrule">fsx</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">imageBuilder</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">xRay</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">instanceSelector</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
  <span class="token key atrule">instanceType</span><span class="token punctuation">:</span> t3.medium
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">alpha.eksctl.io/cluster-name</span><span class="token punctuation">:</span> myeks
    <span class="token key atrule">alpha.eksctl.io/nodegroup-name</span><span class="token punctuation">:</span> myeks<span class="token punctuation">-</span>nodegroup
  <span class="token key atrule">maxSize</span><span class="token punctuation">:</span> <span class="token number">2</span>
  <span class="token key atrule">minSize</span><span class="token punctuation">:</span> <span class="token number">2</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> myeks<span class="token punctuation">-</span>nodegroup
  <span class="token key atrule">privateNetworking</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">releaseVersion</span><span class="token punctuation">:</span> <span class="token string">""</span>
  <span class="token key atrule">securityGroups</span><span class="token punctuation">:</span>
    <span class="token key atrule">withLocal</span><span class="token punctuation">:</span> <span class="token null important">null</span>
    <span class="token key atrule">withShared</span><span class="token punctuation">:</span> <span class="token null important">null</span>
  <span class="token key atrule">ssh</span><span class="token punctuation">:</span>
    <span class="token key atrule">allow</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">publicKeyPath</span><span class="token punctuation">:</span> ~/.ssh/id_rsa.pub
  <span class="token key atrule">tags</span><span class="token punctuation">:</span>
    <span class="token key atrule">alpha.eksctl.io/nodegroup-name</span><span class="token punctuation">:</span> myeks<span class="token punctuation">-</span>nodegroup
    <span class="token key atrule">alpha.eksctl.io/nodegroup-type</span><span class="token punctuation">:</span> managed
  <span class="token key atrule">volumeIOPS</span><span class="token punctuation">:</span> <span class="token number">3000</span>
  <span class="token key atrule">volumeSize</span><span class="token punctuation">:</span> <span class="token number">30</span>
  <span class="token key atrule">volumeThroughput</span><span class="token punctuation">:</span> <span class="token number">125</span>
  <span class="token key atrule">volumeType</span><span class="token punctuation">:</span> gp3
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> myeks
  <span class="token key atrule">region</span><span class="token punctuation">:</span> ap<span class="token punctuation">-</span>northeast<span class="token punctuation">-</span><span class="token number">2</span>
  <span class="token key atrule">version</span><span class="token punctuation">:</span> <span class="token string">"1.24"</span>
<span class="token key atrule">privateCluster</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">skipEndpointCreation</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
<span class="token key atrule">vpc</span><span class="token punctuation">:</span>
  <span class="token key atrule">autoAllocateIPv6</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">cidr</span><span class="token punctuation">:</span> 192.168.0.0/16
  <span class="token key atrule">clusterEndpoints</span><span class="token punctuation">:</span>
    <span class="token key atrule">privateAccess</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token key atrule">publicAccess</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">id</span><span class="token punctuation">:</span> vpc<span class="token punctuation">-</span>0521fc003559b2f2c
  <span class="token key atrule">manageSharedNodeSecurityGroupRules</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">nat</span><span class="token punctuation">:</span>
    <span class="token key atrule">gateway</span><span class="token punctuation">:</span> Disable
  <span class="token key atrule">subnets</span><span class="token punctuation">:</span>
    <span class="token key atrule">public</span><span class="token punctuation">:</span>
      <span class="token key atrule">ap-northeast-2a</span><span class="token punctuation">:</span>
        <span class="token key atrule">az</span><span class="token punctuation">:</span> ap<span class="token punctuation">-</span>northeast<span class="token punctuation">-</span>2a
        <span class="token key atrule">cidr</span><span class="token punctuation">:</span> 192.168.1.0/24
        <span class="token key atrule">id</span><span class="token punctuation">:</span> subnet<span class="token punctuation">-</span>0fdff27653277aaf0
      <span class="token key atrule">ap-northeast-2c</span><span class="token punctuation">:</span>
        <span class="token key atrule">az</span><span class="token punctuation">:</span> ap<span class="token punctuation">-</span>northeast<span class="token punctuation">-</span>2c
        <span class="token key atrule">cidr</span><span class="token punctuation">:</span> 192.168.2.0/24
        <span class="token key atrule">id</span><span class="token punctuation">:</span> subnet<span class="token punctuation">-</span>084a8752d4c7ddf6c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>EKS 클러스터 배포 확인</li>
</ul>
<p>정상적으로 클러스터가 구성된 것을 확인할 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># eks클러스터 확인</span>
eksctl get cluster
NAME	REGION		EKSCTL CREATED
myeks	ap-northeast-2	True

<span class="token comment"># 노드확인</span>
kubectl get <span class="token function">node</span> <span class="token parameter variable">-v</span><span class="token operator">=</span><span class="token number">6</span>
I0423 <span class="token number">22</span>:10:48.050969    <span class="token number">2339</span> loader.go:374<span class="token punctuation">]</span> Config loaded from file:  /root/.kube/config

I0423 <span class="token number">22</span>:10:48.880262    <span class="token number">2339</span> round_trippers.go:553<span class="token punctuation">]</span> GET https://6E205513BA73EEBC3CA693BADEEC5294.gr7.ap-northeast-2.eks.amazonaws.com/api/v1/nodes?limit<span class="token operator">=</span><span class="token number">500</span> <span class="token number">200</span> OK <span class="token keyword">in</span> <span class="token number">819</span> milliseconds
NAME                                               STATUS   ROLES    AGE   VERSION
ip-192-168-1-139.ap-northeast-2.compute.internal   Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>   61m   v1.24.11-eks-a59e1f0
ip-192-168-2-225.ap-northeast-2.compute.internal   Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>   61m   v1.24.11-eks-a59e1f0

<span class="token comment"># 파드확인</span>
k get pods <span class="token parameter variable">-A</span>
NAMESPACE     NAME                      READY   STATUS    RESTARTS   AGE
kube-system   aws-node-2bpxr            <span class="token number">1</span>/1     Running   <span class="token number">0</span>          62m
kube-system   aws-node-s7p5b            <span class="token number">1</span>/1     Running   <span class="token number">0</span>          62m
kube-system   coredns-dc4979556-knkkh   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          68m
kube-system   coredns-dc4979556-m789b   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          68m
kube-system   kube-proxy-lkp8f          <span class="token number">1</span>/1     Running   <span class="token number">0</span>          62m
kube-system   kube-proxy-z6hbk          <span class="token number">1</span>/1     Running   <span class="token number">0</span>          62m
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>참고 : <code v-pre>eksctl</code> 명령 예제</p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># eksctl help</span>
eksctl
eksctl create
eksctl create cluster <span class="token parameter variable">--help</span>
eksctl create nodegroup <span class="token parameter variable">--help</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="실습환경-변경" tabindex="-1"><a class="header-anchor" href="#실습환경-변경" aria-hidden="true">#</a> 실습환경 변경</h2>
<p>앞선 과정을 통해 실습을 위한 클러스터 구성이 완성되었다. 필자는 향후 샘플 애플리케이션으로 Vault, Consul 등을 배포할 예정이다. 때문에, 최소 3대 이상의 노드가 필요하여 기본 실습 노드를 3대로 구성한다.</p>
<p>EKS는 <code v-pre>nodegraup</code> 개수의 최소/최대 개수를 선언적으로 관리할 수 있다. 다음은 노드 개수를 변경/확인 하는 방법이다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># eks 노드 그룹 정보 확인</span>
eksctl get nodegroup <span class="token parameter variable">--cluster</span> <span class="token variable">$CLUSTER_NAME</span> <span class="token parameter variable">--name</span> <span class="token variable">$CLUSTER_NAME</span>-nodegroup
CLUSTER	NODEGROUP	STATUS		CREATED			MIN SIZE	MAX SIZE	DESIRED CAPACITY	<span class="token environment constant">INSTANCE</span> TYPE	IMAGE ID	ASG NAME							TYPE
myeks	myeks-nodegroup	UPDATING	<span class="token number">2023</span>-04-23T12:07:57Z	<span class="token number">2</span>		<span class="token number">2</span>		<span class="token number">2</span>			t3.medium	AL2_x86_64	eks-myeks-nodegroup-fcc3d701-b90a-9c83-7907-fca8459770b9	managed

<span class="token comment"># 노드 2개 → 3개 증가</span>
eksctl scale nodegroup <span class="token parameter variable">--cluster</span> <span class="token variable">$CLUSTER_NAME</span> <span class="token parameter variable">--name</span> <span class="token variable">$CLUSTER_NAME</span>-nodegroup <span class="token parameter variable">--nodes</span> <span class="token number">3</span> --nodes-min <span class="token number">3</span> --nodes-max <span class="token number">6</span>

<span class="token comment"># 노드 그룹 변경 확인</span>
eksctl get nodegroup <span class="token parameter variable">--cluster</span> myeks <span class="token parameter variable">--region</span> ap-northeast-2 <span class="token parameter variable">--name</span> myeks-nodegroup
CLUSTER	NODEGROUP	STATUS		CREATED			MIN SIZE	MAX SIZE	DESIRED CAPACITY	<span class="token environment constant">INSTANCE</span> TYPE	IMAGE ID	ASG NAME							TYPE
myeks	myeks-nodegroup	UPDATING	<span class="token number">2023</span>-04-23T12:07:57Z	<span class="token number">3</span>		<span class="token number">6</span>		<span class="token number">3</span>			t3.medium	AL2_x86_64	eks-myeks-nodegroup-fcc3d701-b90a-9c83-7907-fca8459770b9	managed

<span class="token comment"># 노드 확인</span>
kubectl get nodes <span class="token parameter variable">-o</span> wide

NAME                                               STATUS   ROLES    AGE    VERSION                INTERNAL-IP     EXTERNAL-IP      OS-IMAGE         KERNEL-VERSION                  CONTAINER-RUNTIME
ip-192-168-1-139.ap-northeast-2.compute.internal   Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>   150m   v1.24.11-eks-a59e1f0   <span class="token number">192.168</span>.1.139   <span class="token number">43.201</span>.51.34     Amazon Linux <span class="token number">2</span>   <span class="token number">5.10</span>.176-157.645.amzn2.x86_64   containerd://1.6.19
ip-192-168-1-76.ap-northeast-2.compute.internal    Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>   53s    v1.24.11-eks-a59e1f0   <span class="token number">192.168</span>.1.76    <span class="token number">13.124</span>.158.208   Amazon Linux <span class="token number">2</span>   <span class="token number">5.10</span>.176-157.645.amzn2.x86_64   containerd://1.6.19
ip-192-168-2-225.ap-northeast-2.compute.internal   Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>   150m   v1.24.11-eks-a59e1f0   <span class="token number">192.168</span>.2.225   <span class="token number">52.79</span>.236.227    Amazon Linux <span class="token number">2</span>   <span class="token number">5.10</span>.176-157.645.amzn2.x86_64   containerd://1.6.19

kubectl get nodes <span class="token parameter variable">-l</span> eks.amazonaws.com/nodegroup<span class="token operator">=</span><span class="token variable">$CLUSTER_NAME</span>-nodegroup
NAME                                               STATUS   ROLES    AGE    VERSION
ip-192-168-1-139.ap-northeast-2.compute.internal   Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>   150m   v1.24.11-eks-a59e1f0
ip-192-168-1-76.ap-northeast-2.compute.internal    Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>   74s    v1.24.11-eks-a59e1f0
ip-192-168-2-225.ap-northeast-2.compute.internal   Ready    <span class="token operator">&lt;</span>none<span class="token operator">></span>   150m   v1.24.11-eks-a59e1f0
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="샘플-애플리케이션-배포" tabindex="-1"><a class="header-anchor" href="#샘플-애플리케이션-배포" aria-hidden="true">#</a> 샘플 애플리케이션 배포</h2>
<p>필자는 본 글을 작성하던 시기에 고객사 환경에 ArgoCD + Helm을 기반으로 Consul Cluster 구성 테스트 요청이 있어 해당 클러스터를 활용해 보았다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/helm_argo.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h3 id="argocd-배포" tabindex="-1"><a class="header-anchor" href="#argocd-배포" aria-hidden="true">#</a> ArgoCD 배포</h3>
<blockquote>
<p>참고 : PKOS 2기에 사용한 ArgoCD 배포 가이드를 참고하여 배포한다.</p>
</blockquote>
<ul>
<li>argocd-application-controller : 실행 중인 k8s 애플리케이션의 설정과 깃 저장소의 소스 파일에 선언된 상태를 서로 비교하는 컨트롤러. 상태와 다르면 <code v-pre>OutOfSync</code> 에러를 출력.</li>
<li>argocd-dex-server : 외부 사용자의 LDAP 인증에 Dex 서버를 사용할 수 있음</li>
<li>argocd-repo-server : 원격 깃 저장소의 소스 코드를 아르고시디 내부 캐시 서버에 저장합니다. 디렉토리 경로, 소스, 헬름 차트 등이 저장.</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 네임스페이스 생성</span>
kubectl create ns argocd

<span class="token comment"># argocd-helm 설치</span>
<span class="token builtin class-name">cd</span>
helm repo <span class="token function">add</span> argo https://argoproj.github.io/argo-helm
helm repo update
helm <span class="token function">install</span> argocd argo/argo-cd <span class="token parameter variable">--set</span> <span class="token assign-left variable">server.service.type</span><span class="token operator">=</span>LoadBalancer <span class="token parameter variable">--namespace</span> argocd <span class="token parameter variable">--version</span> <span class="token number">5.19</span>.14

<span class="token comment"># 확인</span>
helm list <span class="token parameter variable">-n</span> argocd
kubectl get pod,pvc,svc,deploy,sts <span class="token parameter variable">-n</span> argocd
kubectl get-all <span class="token parameter variable">-n</span> argocd

kubectl get crd <span class="token operator">|</span> <span class="token function">grep</span> argoproj
applications.argoproj.io              <span class="token number">2023</span>-03-19T11:39:26Z
applicationsets.argoproj.io           <span class="token number">2023</span>-03-19T11:39:26Z
appprojects.argoproj.io               <span class="token number">2023</span>-03-19T11:39:26Z

<span class="token comment"># admin 계정의 암호 확인</span>
<span class="token assign-left variable">ARGOPW</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl <span class="token parameter variable">-n</span> argocd get secret argocd-initial-admin-secret <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">"{.data.password}"</span> <span class="token operator">|</span> base64 <span class="token parameter variable">-d</span><span class="token variable">)</span></span>
<span class="token builtin class-name">echo</span> <span class="token variable">$ARGOPW</span>
mf8bOtNEq7iHMqq1

<span class="token comment"># 웹 접속 로그인 (admin) CLB의 hostname으로 접속</span>
k get svc <span class="token parameter variable">-n</span> argocd argocd-server <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">'{.status.loadBalancer.ingress[].hostname}'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>ArgoCD Web UI 화면</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/T5kZFT.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h3 id="github-저장소-준비" tabindex="-1"><a class="header-anchor" href="#github-저장소-준비" aria-hidden="true">#</a> GitHub 저장소 준비</h3>
<blockquote>
<p>필자는 개인 GitHub에 <a href="https://github.com/chosam2/gitops" target="_blank" rel="noopener noreferrer">개인 퍼블릭 저장소<ExternalLinkIcon/></a>를 만들어서 실습을 진행하였다.</p>
</blockquote>
<p>사전에 로컬에서 다운로드 받은 Consul Helm Chart 파일에 새로 재정의 할 values 파일을 GitHub 저장소에 업로드 한다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/aY0au9.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>override-values.yaml</li>
</ul>
<blockquote>
<p>참고 : 다음은 실제 작성된 Values 파일이다. 각 항목에 대한 상세한 설명은 향후 <strong>Consul Deploy on K8s</strong> 가이드를 작성해서 업로드 예정이다.</p>
</blockquote>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">client</span><span class="token punctuation">:</span>
  <span class="token key atrule">grpc</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">connectInject</span><span class="token punctuation">:</span>
  <span class="token key atrule">consulNamespaces</span><span class="token punctuation">:</span>
    <span class="token key atrule">mirroringK8S</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">controller</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">global</span><span class="token punctuation">:</span>
  <span class="token key atrule">acls</span><span class="token punctuation">:</span>
    <span class="token key atrule">manageSystemACLs</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">enableConsulNamespaces</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">enterpriseLicense</span><span class="token punctuation">:</span>
    <span class="token key atrule">secretKey</span><span class="token punctuation">:</span> key
    <span class="token key atrule">secretName</span><span class="token punctuation">:</span> license
  <span class="token key atrule">gossipEncryption</span><span class="token punctuation">:</span>
    <span class="token key atrule">autoGenerate</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">image</span><span class="token punctuation">:</span> hashicorp/consul<span class="token punctuation">-</span>enterprise<span class="token punctuation">:</span>1.13.7<span class="token punctuation">-</span>ent
  <span class="token key atrule">imageEnvoy</span><span class="token punctuation">:</span> envoyproxy/envoy<span class="token punctuation">:</span>v1.22.5
  <span class="token key atrule">imageK8S</span><span class="token punctuation">:</span> hashicorp/consul<span class="token punctuation">-</span>k8s<span class="token punctuation">-</span>control<span class="token punctuation">-</span>plane<span class="token punctuation">:</span>0.49.5
  <span class="token key atrule">metrics</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">tls</span><span class="token punctuation">:</span>
    <span class="token key atrule">enableAutoEncrypt</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">httpsOnly</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
    <span class="token key atrule">verify</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
<span class="token key atrule">ingressGateways</span><span class="token punctuation">:</span>
  <span class="token key atrule">defaults</span><span class="token punctuation">:</span>
    <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
    <span class="token key atrule">service</span><span class="token punctuation">:</span>
      <span class="token key atrule">type</span><span class="token punctuation">:</span> LoadBalancer
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">gateways</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ingress<span class="token punctuation">-</span>gateway
<span class="token key atrule">meshGateway</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">service</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">nodePort</span><span class="token punctuation">:</span> <span class="token number">32000</span>
    <span class="token key atrule">type</span><span class="token punctuation">:</span> NodePort
<span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">3</span>
<span class="token key atrule">terminatingGateways</span><span class="token punctuation">:</span>
  <span class="token key atrule">defaults</span><span class="token punctuation">:</span>
    <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
<span class="token key atrule">ui</span><span class="token punctuation">:</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">service</span><span class="token punctuation">:</span>
    <span class="token key atrule">port</span><span class="token punctuation">:</span>
      <span class="token key atrule">http</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">https</span><span class="token punctuation">:</span> <span class="token number">443</span>
    <span class="token key atrule">type</span><span class="token punctuation">:</span> LoadBalance
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="argocd-github-연동" tabindex="-1"><a class="header-anchor" href="#argocd-github-연동" aria-hidden="true">#</a> ArgoCD + GitHub 연동</h3>
<p>ArgoCD CLI를 통해 필자의 GitHub을 연동한다</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>argocd login <span class="token operator">&lt;</span>argocd 주소<span class="token operator">></span> <span class="token parameter variable">--username</span> admin <span class="token parameter variable">--password</span> <span class="token variable">$ARGOPW</span>
<span class="token punctuation">..</span>.
<span class="token string">'admin:login'</span> logged <span class="token keyword">in</span> successfully

argocd repo <span class="token function">add</span> https://github.com/<span class="token operator">&lt;</span>깃헙 계정명<span class="token operator">></span>/<span class="token operator">&lt;</span>레파지토리명<span class="token operator">></span> <span class="token parameter variable">--username</span> <span class="token operator">&lt;</span>깃헙 계정명<span class="token operator">></span> <span class="token parameter variable">--password</span> <span class="token operator">&lt;</span>깃헙 계정 암호<span class="token operator">></span>
 
argocd repo list
TYPE  NAME  REPO                                   INSECURE  OCI    LFS    CREDS  STATUS      MESSAGE  PROJECT
<span class="token function">git</span>         https://github.com/chosam2/gitops.git  <span class="token boolean">false</span>     <span class="token boolean">false</span>  <span class="token boolean">false</span>  <span class="token boolean">true</span>   Successful

<span class="token comment"># 기본적으로 아르고시디가 설치된 쿠버네티스 클러스터는 타깃 클러스터로 등록됨</span>
argocd cluster list
SERVER                          NAME        VERSION  STATUS      MESSAGE  PROJECT
https://kubernetes.default.svc  in-cluster  <span class="token number">1.24</span>+    Successful
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="argocd-application-생성-및-배포" tabindex="-1"><a class="header-anchor" href="#argocd-application-생성-및-배포" aria-hidden="true">#</a> ArgoCD Application 생성 및 배포</h3>
<p>앞서 생성한 GitHub 저장소에 업로드한 consul helm values 파일을 통해 배포하기 위해 <code v-pre>Application</code> CRD를 생성 및 배포한다.</p>
<ul>
<li><code v-pre>consul-helm-argo-application.yaml</code></li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> argoproj.io/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Application
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> consul<span class="token punctuation">-</span>helm
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> argocd
  <span class="token key atrule">finalizers</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> resources<span class="token punctuation">-</span>finalizer.argocd.argoproj.io
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">destination</span><span class="token punctuation">:</span>
    <span class="token key atrule">namespace</span><span class="token punctuation">:</span> consul
    <span class="token key atrule">server</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//kubernetes.default.svc
  <span class="token key atrule">project</span><span class="token punctuation">:</span> default
  <span class="token key atrule">source</span><span class="token punctuation">:</span>
    <span class="token key atrule">repoURL</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//github.com/chosam2/gitops.git
    <span class="token key atrule">path</span><span class="token punctuation">:</span> argocd
    <span class="token key atrule">targetRevision</span><span class="token punctuation">:</span> main
    <span class="token key atrule">helm</span><span class="token punctuation">:</span>
      <span class="token key atrule">valueFiles</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> override<span class="token punctuation">-</span>values.yaml
  <span class="token key atrule">syncPolicy</span><span class="token punctuation">:</span>
    <span class="token key atrule">syncOptions</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> CreateNamespace=true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Application CRD 배포</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>k apply <span class="token parameter variable">-f</span> consul-helm-argo-application.yaml
application.argoproj.io/consul-helm created
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>최초 배포 시 <code v-pre>OutOfSync</code> 상태로 배포되었지만, 동기화 버튼을 클릭하여 강제로 동기화해준 뒤 정상적으로 배포된 것을 확인할 수 있다.<br>
다만, 최초 <code v-pre>OutOfSync</code> 상태로 배포되는 부분에 대해서는 Application YAML 작성 시 옵션을 통해 해결이 가능하지만, 실제 운영시 영향도 체크가 필요해 보인다. 이 부분은 다음 블로깅시에 조금 더 테스트 및 확인해볼 예정이다.</p>
<ul>
<li>최초 구성 후 OutOfSync 상태</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/argo_구조.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>강제 동기화 이후 Sync 된 화면</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/argo_구조2.png" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>실제 배포된 Consul UI 화면</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/ejor4D.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h2 id="마무리" tabindex="-1"><a class="header-anchor" href="#마무리" aria-hidden="true">#</a> 마무리</h2>
<p>1주차 스터디는 EKS에 대한 전반적인 컨셉과 기본적으로 클러스터를 구성하고 Consul Cluster를 간단하게 배포해보았다. 다음주에는 네트워킹을 주제로 찾아올 예정이다.</p>
</div></template>


