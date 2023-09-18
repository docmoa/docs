<template><div><h1 id="aews-2주차-amzaon-eks-networking" tabindex="-1"><a class="header-anchor" href="#aews-2주차-amzaon-eks-networking" aria-hidden="true">#</a> AEWS 2주차 - Amzaon EKS Networking</h1>
<p>이번에 연재할 스터디는 AWS EKS Workshop Study (=AEWS)이다. AWS에서 공식적으로 제공되는 다양한 HOL 기반의 Workshop과 가시다님의 팀에서 2차 가공한 컨텐츠를 기반으로 진행한다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/9cxho8.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h2 id="_0-실습환경-준비" tabindex="-1"><a class="header-anchor" href="#_0-실습환경-준비" aria-hidden="true">#</a> 0. 실습환경 준비</h2>
<p>2주차 부터는 원클릭으로 EKS 실습환경을 배포할 수 있는 코드를 사용한다. 필자는 사용중인 AWS IAM 권한 제약사항으로 기존 CF 코드를 변경하여 베스천용 EC2에 관리자 권한을 위임하여 배포할 예정이다.</p>
<blockquote>
<p>참고 : <a href="https://cloudkatha.com/attach-an-iam-role-to-an-ec2-instance-with-cloudformation/" target="_blank" rel="noopener noreferrer">https://cloudkatha.com/attach-an-iam-role-to-an-ec2-instance-with-cloudformation/<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>원클릭 배포</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># YAML 파일 다운로드</span>
<span class="token function">curl</span> <span class="token parameter variable">-O</span> https://gist.githubusercontent.com/hyungwook0221/238d96b3b751362cc03ea40494d15313/raw/49de0a9056688b206a41349fc90727d2375f4f02/aews-eks-oneclick-with-ec2-profile.yaml

<span class="token comment"># CloudFormation 스택 배포</span>
<span class="token comment"># aws cloudformation deploy --template-file eks-oneclick.yaml --stack-name myeks --parameter-overrides KeyName=&lt;My SSH Keyname> SgIngressSshCidr=&lt;My Home Public IP Address>/32 MyIamUserAccessKeyID=&lt;IAM User의 액세스키> MyIamUserSecretAccessKey=&lt;IAM User의 시크릿 키> ClusterBaseName='&lt;eks 이름>' --region ap-northeast-2</span>
예시<span class="token punctuation">)</span> aws cloudformation deploy --template-file eks-oneclick.yaml --stack-name myeks --parameter-overrides <span class="token assign-left variable">KeyName</span><span class="token operator">=</span>hw-key <span class="token assign-left variable">SgIngressSshCidr</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">-s</span> ipinfo.io/ip<span class="token variable">)</span></span>/32 <span class="token assign-left variable">ClusterBaseName</span><span class="token operator">=</span>myeks <span class="token parameter variable">--region</span> ap-northeast-2 <span class="token parameter variable">--capabilities</span> CAPABILITY_NAMED_IAM

<span class="token comment"># CloudFormation 스택 배포 완료 후 작업용 EC2 IP 출력</span>
aws cloudformation describe-stacks --stack-name myeks <span class="token parameter variable">--query</span> <span class="token string">'Stacks[*].Outputs[0].OutputValue'</span> <span class="token parameter variable">--output</span> text

<span class="token comment"># 마스터노드 SSH 접속</span>
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/kp-gasida.pem ec2-user@<span class="token variable"><span class="token variable">$(</span>aws cloudformation describe-stacks --stack-name myeks <span class="token parameter variable">--query</span> <span class="token string">'Stacks[*].Outputs[0].OutputValue'</span> <span class="token parameter variable">--output</span> text<span class="token variable">)</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_1-aws-vpc-cni" tabindex="-1"><a class="header-anchor" href="#_1-aws-vpc-cni" aria-hidden="true">#</a> 1. AWS VPC CNI</h2>
<p>일반적으로 Calico와 같은 K8s CNI의 경우는 Node - Pod의 IP 대역이 다르지만 AWS VPC CNI의 경우에는 Node-Pod 대역을 동일하게 해서 통신이 가능하도록 구성할 수 있다.</p>
<p>일반적으로 Outer 패킷을 감싸서 오버레이로 통신하지만 AWS VPC CNI는 오히려 심플한 구조를 가진다. 이로인해 간단하고 효율적인 통신이 가능하다!</p>
<h3 id="k8s-calico-cni-vs-aws-vpc-cni-비교" tabindex="-1"><a class="header-anchor" href="#k8s-calico-cni-vs-aws-vpc-cni-비교" aria-hidden="true">#</a> K8s Calico CNI vs AWS VPC CNI 비교</h3>
<ul>
<li>네트워크 통신의 최적화(성능, 지연)를 위해서 노드와 파드의 네트워크 대역을 동일하게 설정 (그림출처-가시다)</li>
</ul>
<img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/aFbQX7.jpg" alt="img" style="zoom: 33%;" />
<ul>
<li>파드간 통신 시
<ul>
<li>K8S CNI는 <strong>오버레이(VXLAN, IP-IP 등)</strong> 통신</li>
<li>AWS VPC CNI는 <strong>동일 대역으로 직접</strong> 통신</li>
</ul>
</li>
</ul>
<img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/tMpJbl.jpg" alt="img" style="zoom:33%;" />
<ul>
<li>노드간 통신(추후 업데이트)</li>
<li>파드간 통신(추후 업데이트)</li>
</ul>
<h2 id="_2-service-aws-loadbalancer-controller" tabindex="-1"><a class="header-anchor" href="#_2-service-aws-loadbalancer-controller" aria-hidden="true">#</a> 2. Service &amp; AWS LoadBalancer Controller</h2>
<p>K8s 환경에서는 내/외부 통신을 위한 서비스를 크게 3가지 형태로 제공한다.</p>
<ul>
<li>Cluster IP</li>
<li>NodePort</li>
<li><strong>LoadBalancer</strong></li>
</ul>
<p>필자는 그 중에서 <strong>LoadBalancer</strong> 타입을 AWS 환경에서 어떻게 활용할 수 있는지를 집중적으로 확인하고 Consul 샘플 예제와 함께 적용해볼 예정이다.</p>
<h2 id="_3-loadbalancer-nlb-모드" tabindex="-1"><a class="header-anchor" href="#_3-loadbalancer-nlb-모드" aria-hidden="true">#</a> 3. LoadBalancer NLB 모드</h2>
<p>LoadBalancer 배포 시 NLB 모드는  다음 두 가지 유형을 사용할 수 있다.</p>
<h3 id="유형1-인스턴스" tabindex="-1"><a class="header-anchor" href="#유형1-인스턴스" aria-hidden="true">#</a> 유형1. 인스턴스</h3>
<ol>
<li><code v-pre>externalTrafficPolicy</code> : ClusterIP ⇒ 2번 분산 및 SNAT으로 Client IP 확인 불가능 ← <code v-pre>LoadBalancer</code> 타입 (기본 모드) 동작</li>
<li><code v-pre>externalTrafficPolicy</code> : Local ⇒ 1번 분산 및 ClientIP 유지, 워커 노드의 iptables 사용함</li>
</ol>
<img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/bvP3xu.jpg" alt="img" style="zoom: 33%;" />
<h3 id="유형2-ip" tabindex="-1"><a class="header-anchor" href="#유형2-ip" aria-hidden="true">#</a> 유형2. IP</h3>
<blockquote>
<p>참고 : 반드시 AWS LoadBalancer 컨트롤러 파드 및 정책 설정이 필요함!</p>
</blockquote>
<ol>
<li><code v-pre>Proxy Protocol v2 비활성화</code> ⇒ NLB에서 바로 파드로 인입, 단 ClientIP가 NLB로 SNAT 되어 Client IP 확인 불가능</li>
<li><code v-pre>Proxy Protocol v2 활성화</code> ⇒ NLB에서 바로 파드로 인입 및 ClientIP 확인 가능(→ 단 PPv2 를 애플리케이션이 인지할 수 있게 설정 필요)</li>
</ol>
<img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/J4nUpO.jpg" alt="img" style="zoom:33%;" />
<h3 id="aws-loadbalancer-controller-배포-with-irsa" tabindex="-1"><a class="header-anchor" href="#aws-loadbalancer-controller-배포-with-irsa" aria-hidden="true">#</a> AWS LoadBalancer Controller 배포 with IRSA</h3>
<blockquote>
<p>참고 : <a href="https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/aws-load-balancer-controller.html" target="_blank" rel="noopener noreferrer">AWS Load Balancer Controller 추가 기능 설치<ExternalLinkIcon/></a></p>
</blockquote>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># AWSLoadBalancerControllerIAMPolicy 생성</span>
<span class="token function">curl</span> <span class="token parameter variable">-o</span> iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.4.7/docs/install/iam_policy.json
aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json

<span class="token comment"># 업데이트가 필요한 경우 </span>
<span class="token comment"># aws iam update-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json</span>

<span class="token comment"># AWS Load Balancer Controller를 위한 ServiceAccount를 생성 </span>
eksctl create iamserviceaccount <span class="token parameter variable">--cluster</span><span class="token operator">=</span><span class="token variable">$CLUSTER_NAME</span> <span class="token parameter variable">--namespace</span><span class="token operator">=</span>kube-system <span class="token parameter variable">--name</span><span class="token operator">=</span>aws-load-balancer-controller <span class="token punctuation">\</span>
--attach-policy-arn<span class="token operator">=</span>arn:aws:iam::<span class="token variable">$ACCOUNT_ID</span>:policy/AWSLoadBalancerControllerIAMPolicy --override-existing-serviceaccounts <span class="token parameter variable">--approve</span>

<span class="token comment">## IRSA 정보 확인</span>
eksctl get iamserviceaccount <span class="token parameter variable">--cluster</span> <span class="token variable">$CLUSTER_NAME</span>

<span class="token comment">## 서비스 어카운트 확인</span>
kubectl get serviceaccounts <span class="token parameter variable">-n</span> kube-system aws-load-balancer-controller <span class="token parameter variable">-o</span> yaml <span class="token operator">|</span> yh

<span class="token comment"># Helm Chart 설치</span>
helm repo <span class="token function">add</span> eks https://aws.github.io/eks-charts
helm repo update
helm <span class="token function">install</span> aws-load-balancer-controller eks/aws-load-balancer-controller <span class="token parameter variable">-n</span> kube-system <span class="token parameter variable">--set</span> <span class="token assign-left variable">clusterName</span><span class="token operator">=</span><span class="token variable">$CLUSTER_NAME</span> <span class="token punctuation">\</span>
  <span class="token parameter variable">--set</span> <span class="token assign-left variable">serviceAccount.create</span><span class="token operator">=</span>false <span class="token parameter variable">--set</span> <span class="token assign-left variable">serviceAccount.name</span><span class="token operator">=</span>aws-load-balancer-controller
  
<span class="token comment"># 설치 확인</span>
kubectl get crd
kubectl get deployment <span class="token parameter variable">-n</span> kube-system aws-load-balancer-controller
kubectl describe deploy <span class="token parameter variable">-n</span> kube-system aws-load-balancer-controller <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">'Service Account'</span>
  Service Account:  aws-load-balancer-controller
 
<span class="token comment"># 클러스터롤, 클러스터 롤바인딩 확인</span>
kubectl describe clusterrolebindings.rbac.authorization.k8s.io aws-load-balancer-controller-rolebinding
kubectl describe clusterroles.rbac.authorization.k8s.io aws-load-balancer-controller-role
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>생성된 ClusterRole 확인</li>
</ul>
<p>AWS LoadBalancer Controller가 동작하기 위해 필요한 SA를 생성 후 연결된 ClusterRole과 ClusterRoleBinding을 화인</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/tKiW7W.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h4 id="샘플-애플리케이션-테스트" tabindex="-1"><a class="header-anchor" href="#샘플-애플리케이션-테스트" aria-hidden="true">#</a> 샘플 애플리케이션 테스트</h4>
<p>LoadBalancer 타입의 서비스와 및 파드를 배포하고 NLB 모드에 따라서 Client IP가 어떻게 확인되는지 확인해본다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 모니터링</span>
<span class="token function">watch</span> <span class="token parameter variable">-d</span> kubectl get pod,svc,ep

<span class="token comment"># 작업용 EC2 - 디플로이먼트 &amp; 서비스 생성</span>
<span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-O</span> https://raw.githubusercontent.com/gasida/PKOS/main/2/echo-service-nlb.yaml
<span class="token function">cat</span> echo-service-nlb.yaml <span class="token operator">|</span> yh
kubectl apply <span class="token parameter variable">-f</span> echo-service-nlb.yaml

<span class="token comment"># 파드 로깅 모니터링</span>
kubectl logs <span class="token parameter variable">-l</span> <span class="token assign-left variable">app</span><span class="token operator">=</span>deploy-websrv <span class="token parameter variable">-f</span>

<span class="token comment"># 분산 접속 확인</span>
<span class="token assign-left variable">NLB</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl get svc svc-nlb-ip-type <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token punctuation">{</span>.status.loadBalancer.ingress<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>.hostname<span class="token punctuation">}</span><span class="token variable">)</span></span>
<span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token variable">$NLB</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>NLB 확인 : Target IP 정보 확인(UI)</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/Gr1F1F.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>NLB에 등록된 Target IP 정보는 생성된 샘플 Pod의 IP인 것을 확인할 수 있다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/XW9vaE.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>이제 NLB를 통해서 Pod를 호출할 경우 Client IP가 어떻게 확인되는지 확인해보자.</p>
<ul>
<li>Client IP 확인 결과</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/FVppDY.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>다음 정보는 각 Node의 정보가 아닌 다른 IP 정보가 확인된다.</p>
<ul>
<li>각 Node의 IP 정보 확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/WAkmPs.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p><strong>그렇다면 Client IP의 정체는?</strong> 바로 NLB에 할당된 네트워크 인터페이스의 IP 이다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/BY1AQ6.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>이제 실제로 Client IP를 추적하기 위한 방법을 알아본다.</p>
<h4 id="nlb-ip-target-proxy-protocol-v2-활성화" tabindex="-1"><a class="header-anchor" href="#nlb-ip-target-proxy-protocol-v2-활성화" aria-hidden="true">#</a> NLB IP Target &amp; Proxy Protocol v2 활성화</h4>
<p>앞선 실습에서 NLB로 SNAT되어서Client IP 확인되지 못하는 것을 확인하였다. 이번에는 Proxy Protocol v2을 활성화 하여 IP 정보를 유지하는 방법을 알아본다. (이미지 출처 : 가시다님 스터디)</p>
<img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/r8IvNa.jpg" alt="img" style="zoom: 50%;" />
<ul>
<li>샘플코드 배포</li>
</ul>
<p>이때 중요한 부분은 SVC 생성 시 <code v-pre>service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: &quot;*&quot;</code> 어노테이션을 활성화 하는 것이다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token comment"># 생성</span>
cat &lt;&lt;EOF <span class="token punctuation">|</span> kubectl create <span class="token punctuation">-</span>f <span class="token punctuation">-</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> gasida<span class="token punctuation">-</span>web
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> gasida<span class="token punctuation">-</span>web
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> gasida<span class="token punctuation">-</span>web
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">terminationGracePeriodSeconds</span><span class="token punctuation">:</span> <span class="token number">0</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> gasida<span class="token punctuation">-</span>web
        <span class="token key atrule">image</span><span class="token punctuation">:</span> gasida/httpd<span class="token punctuation">:</span>pp
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> svc<span class="token punctuation">-</span>nlb<span class="token punctuation">-</span>ip<span class="token punctuation">-</span>type<span class="token punctuation">-</span>pp
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-nlb-target-type</span><span class="token punctuation">:</span> ip
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-scheme</span><span class="token punctuation">:</span> internet<span class="token punctuation">-</span>facing
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled</span><span class="token punctuation">:</span> <span class="token string">"true"</span>
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-proxy-protocol</span><span class="token punctuation">:</span> <span class="token string">"*"</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
  <span class="token key atrule">type</span><span class="token punctuation">:</span> LoadBalancer
  <span class="token key atrule">loadBalancerClass</span><span class="token punctuation">:</span> service.k8s.aws/nlb
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> gasida<span class="token punctuation">-</span>web
EOF

<span class="token punctuation">---</span>

<span class="token comment"># apache에 proxy protocol 활성화 확인</span>
kubectl exec deploy/gasida<span class="token punctuation">-</span>web <span class="token punctuation">-</span><span class="token punctuation">-</span> apachectl <span class="token punctuation">-</span>t <span class="token punctuation">-</span>D DUMP_MODULES
kubectl exec deploy/gasida<span class="token punctuation">-</span>web <span class="token punctuation">-</span><span class="token punctuation">-</span> cat /usr/local/apache2/conf/httpd.conf

<span class="token comment"># 접속 확인</span>
NLB=$(kubectl get svc svc<span class="token punctuation">-</span>nlb<span class="token punctuation">-</span>ip<span class="token punctuation">-</span>type<span class="token punctuation">-</span>pp <span class="token punctuation">-</span>o jsonpath=<span class="token punctuation">{</span>.status.loadBalancer.ingress<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span>.hostname<span class="token punctuation">}</span>)
curl <span class="token punctuation">-</span>s $NLB

<span class="token comment"># 지속적인 접속 시도</span>
while true; do curl <span class="token punctuation">-</span>s <span class="token punctuation">-</span><span class="token punctuation">-</span>connect<span class="token punctuation">-</span>timeout 1 $NLB; echo "<span class="token punctuation">---</span><span class="token punctuation">---</span><span class="token punctuation">---</span><span class="token punctuation">-</span>" ; date "+%Y<span class="token punctuation">-</span>%m<span class="token punctuation">-</span>%d %H<span class="token punctuation">:</span>%M<span class="token punctuation">:</span>%S" ; sleep 1; done

<span class="token comment"># 로그 확인</span>
kubectl logs <span class="token punctuation">-</span>l app=gasida<span class="token punctuation">-</span>web <span class="token punctuation">-</span>f
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Client IP 확인</li>
</ul>
<p>IP를 확인해본 결과 동일한 공인 IP로 찍히는 것으로 확인된다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/ZOT5ep.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>그렇다면 해당 IP는 무엇일까? 바로 현재 <code v-pre>curl -s</code> 명령을 수행한 Bastion 노드의 정보이다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/mHh2Rs.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>이렇게 NLB를 통해 호출하더라도 정상적으로 Client IP를 유지하는 방법을 알아보았다. 실제로 온프레미스 환경에서 3-Tier 기반의 WEB/WAS를 구성하다 보면 Client IP를 유지하기 위해 XFF 설정을 하는 것이 일반적이다. 다만, NLB의 경우에는 L4 계층까지만 패킷에 대한 이해와 분석이 가능하므로  Proxy Protocol을 써야한다는 새로운 정보를 알 수 있는 좋은 기회였다.</p>
<h2 id="_4-consul-ingressgateway-샘플예제" tabindex="-1"><a class="header-anchor" href="#_4-consul-ingressgateway-샘플예제" aria-hidden="true">#</a> 4. Consul IngressGateway 샘플예제</h2>
<p>다음 예제는 Consul IngressGateway를 통한 ServiceMesh의 단일 진입점을 테스트해볼 예정이다. Consul 1.15x 버전에는 Envoy의 Access Log 기능이 추가되어 이번 스터디를 통해 학습한  NLB의 IP 유지방안에 대한 테스트를 진행해본다.</p>
<blockquote>
<p>참고 : Consul Gateway에서 envoy access log 활성화 기능</p>
<ul>
<li><a href="https://developer.hashicorp.com/consul/docs/connect/observability/access-logs" target="_blank" rel="noopener noreferrer">https://developer.hashicorp.com/consul/docs/connect/observability/access-logs<ExternalLinkIcon/></a></li>
<li><a href="https://github.com/hashicorp/consul/issues/5231" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/consul/issues/5231<ExternalLinkIcon/></a></li>
<li><a href="https://github.com/hashicorp/consul/pull/15864" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/consul/pull/15864<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<h3 id="실습1-nlb-ip-target-proxy-protocol-v2-비활성화" tabindex="-1"><a class="header-anchor" href="#실습1-nlb-ip-target-proxy-protocol-v2-비활성화" aria-hidden="true">#</a> 실습1. NLB IP Target &amp; Proxy Protocol v2 비활성화</h3>
<h4 id="_1-consul-deploy-via-helm" tabindex="-1"><a class="header-anchor" href="#_1-consul-deploy-via-helm" aria-hidden="true">#</a> 1) Consul deploy via Helm</h4>
<ul>
<li>Consul Chart YAML</li>
</ul>
<p>처음 설정시에는 PPv2를 사용하지 않고 NLB를 적용해볼 예정이다. =&gt; <strong>Client IP가 어떻게 찍히는지 확인!</strong></p>
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
  <span class="token key atrule">image</span><span class="token punctuation">:</span> hashicorp/consul<span class="token punctuation">-</span>enterprise<span class="token punctuation">:</span>1.15.1<span class="token punctuation">-</span>ent
  <span class="token comment">#imageEnvoy: envoyproxy/envoy:v1.22.5</span>
  <span class="token comment">#imageK8S: hashicorp/consul-k8s-control-plane:0.49.5</span>
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
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
        service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip
        service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
        service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
        #service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: "8080"</span>
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
    <span class="token key atrule">type</span><span class="token punctuation">:</span> LoadBalancer
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-consul-crd-배포" tabindex="-1"><a class="header-anchor" href="#_2-consul-crd-배포" aria-hidden="true">#</a> 2) Consul CRD 배포</h4>
<ul>
<li>IngressGateway</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> consul.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> IngressGateway
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> ingress<span class="token punctuation">-</span>gateway
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">listeners</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> http
      <span class="token key atrule">services</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>ProxyDefaults</li>
</ul>
<p><code v-pre>spec.accessLogs</code>를 통해 AccessLog 활성화 및 파일경로 추가</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> consul.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ProxyDefaults
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> global
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">accessLogs</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token comment">#    type: file</span>
<span class="token comment">#    path: "/var/log/envoy/access-logs.txt" </span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>ServiceDefaults</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> consul.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceDefaults
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">protocol</span><span class="token punctuation">:</span> http
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>ServiceIntentions</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> consul.hashicorp.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceIntentions
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">destination</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
  <span class="token key atrule">sources</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ingress<span class="token punctuation">-</span>gateway
      <span class="token key atrule">action</span><span class="token punctuation">:</span> allow
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>샘플 SVC/Deploy : static-server</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">'consul.hashicorp.com/connect-inject'</span><span class="token punctuation">:</span> <span class="token string">'true'</span>
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
          <span class="token key atrule">image</span><span class="token punctuation">:</span> hashicorp/http<span class="token punctuation">-</span>echo<span class="token punctuation">:</span>latest
          <span class="token key atrule">args</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token punctuation">-</span>text="hello world"
            <span class="token punctuation">-</span> <span class="token punctuation">-</span>listen=<span class="token punctuation">:</span><span class="token number">8080</span>
          <span class="token key atrule">ports</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
              <span class="token key atrule">name</span><span class="token punctuation">:</span> http
      <span class="token key atrule">serviceAccountName</span><span class="token punctuation">:</span> static<span class="token punctuation">-</span>server
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-샘플-애플리케이션-호출" tabindex="-1"><a class="header-anchor" href="#_3-샘플-애플리케이션-호출" aria-hidden="true">#</a> 3) 샘플 애플리케이션 호출</h4>
<ul>
<li>IngressGateway에 연결된 NLB 주소로 호출</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token assign-left variable">EXTERNAL_IP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl get services <span class="token parameter variable">--selector</span> <span class="token assign-left variable">component</span><span class="token operator">=</span>ingress-gateway <span class="token parameter variable">--output</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">"{range .items[*]}{@.status.loadBalancer.ingress[*].hostname}{end}"</span><span class="token variable">)</span></span>
<span class="token builtin class-name">echo</span> <span class="token string">"Connecting to <span class="token entity" title="\&quot;">\"</span><span class="token variable">$EXTERNAL_IP</span><span class="token entity" title="\&quot;">\"</span>"</span>
<span class="token function">curl</span> <span class="token parameter variable">--header</span> <span class="token string">"Host: static-server.ingress.consul"</span> <span class="token string">"http://<span class="token variable">$EXTERNAL_IP</span>:8080"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>호출결과 앞서 실습에서 확인해본 것과 동일하게 NLB IP Target &amp; Proxy Protocol v2 비활성화 일 경우에는 로드밸런서 인터페이스 IP가 확인된다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/oOWX0z.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<ul>
<li>NLB 인터페이스 IP</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/3O7lst.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h3 id="실습2-nlb-ip-target-proxy-protocol-v2-활성화" tabindex="-1"><a class="header-anchor" href="#실습2-nlb-ip-target-proxy-protocol-v2-활성화" aria-hidden="true">#</a> 실습2. NLB IP Target &amp; Proxy Protocol v2 활성화</h3>
<h4 id="_1-consul-deploy-via-helm-1" tabindex="-1"><a class="header-anchor" href="#_1-consul-deploy-via-helm-1" aria-hidden="true">#</a> 1) Consul deploy via Helm</h4>
<p>이번에는 위와 동일하지만 NLB의 어노테이션만 PPv2를 활성화 한다.</p>
<ul>
<li><code v-pre>service.beta.kubernetes.io/aws-load-balancer-proxy-protocol: &quot;*&quot;</code></li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token comment">#(생략)</span>
<span class="token key atrule">ingressGateways</span><span class="token punctuation">:</span>
  <span class="token key atrule">defaults</span><span class="token punctuation">:</span>
    <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
    <span class="token key atrule">service</span><span class="token punctuation">:</span>
      <span class="token key atrule">type</span><span class="token punctuation">:</span> LoadBalancer
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
        service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip
        service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
        service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"</span>
		    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-proxy-protocol</span><span class="token punctuation">:</span> <span class="token string">"*"</span>
  <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">gateways</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ingress<span class="token punctuation">-</span>gateway
<span class="token comment">#(생략)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-consul-crd-배포-생략" tabindex="-1"><a class="header-anchor" href="#_2-consul-crd-배포-생략" aria-hidden="true">#</a> 2) Consul CRD 배포(생략)</h4>
<p>위와 동일하게 사용</p>
<h4 id="_3-샘플-애플리케이션-호출-1" tabindex="-1"><a class="header-anchor" href="#_3-샘플-애플리케이션-호출-1" aria-hidden="true">#</a> 3) 샘플 애플리케이션 호출</h4>
<ul>
<li>IngressGateway에 연결된 NLB 주소로 호출</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token assign-left variable">EXTERNAL_IP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>kubectl get services <span class="token parameter variable">--selector</span> <span class="token assign-left variable">component</span><span class="token operator">=</span>ingress-gateway <span class="token parameter variable">--output</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">"{range .items[*]}{@.status.loadBalancer.ingress[*].hostname}{end}"</span><span class="token variable">)</span></span>
<span class="token builtin class-name">echo</span> <span class="token string">"Connecting to <span class="token entity" title="\&quot;">\"</span><span class="token variable">$EXTERNAL_IP</span><span class="token entity" title="\&quot;">\"</span>"</span>
<span class="token function">curl</span> <span class="token parameter variable">--header</span> <span class="token string">"Host: static-server.ingress.consul"</span> <span class="token string">"http://<span class="token variable">$EXTERNAL_IP</span>:8080"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>하지만 PPv2 설정 후 static-server 앱을 테스트해본 결과 정상적으로 동작하지 않는 것으로 보인다.</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/pCs0WD.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p>위와 관련해서 확인해본 결과 Istio의 경우에는 <code v-pre>EnvoyFilter</code> 등을 통해 해결하는 방안(?)이 있는 것으로 보이며, 일반적으로 PPv2를 사용하기 위해서는 애플리케이션 단에서 사용할 수 있도록 설정이 필요한 것으로 확인되었다.</p>
<blockquote>
<p>참고 :</p>
<ul>
<li><a href="https://preliminary.istio.io/latest/blog/2020/show-source-ip/" target="_blank" rel="noopener noreferrer">https://preliminary.istio.io/latest/blog/2020/show-source-ip/<ExternalLinkIcon/></a></li>
<li><a href="https://www.envoyproxy.io/docs/envoy/latest/configuration/listeners/listener_filters/proxy_protocol" target="_blank" rel="noopener noreferrer">https://www.envoyproxy.io/docs/envoy/latest/configuration/listeners/listener_filters/proxy_protocol<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<blockquote>
<p>📌 정보공유:<br>
해당 이슈에 대하여 Consul Product Manager를 통해 FR(Feture Request)로 등록 후 신규 기능으로 추가할 수 있도록 지원할 것으로 답변받았다. 추후 업데이트에 대한 변동사항이 있으면 할 예정이다.</p>
</blockquote>
<img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/bVHhwT.jpg" alt="img" style="zoom: 50%;" />
<p><s>위에서 언급한 것 처럼 Consul Native하게는 PPv2 기능을 사용하기 어려운 상황이라 Apache 애플리케이션에서 PPv2 설정을 통해 해결이 가능한지 확인을 해보았다.</s></p>
<p>확인결과 결과적으로 테스트가 <strong>불가능</strong> 한 것으로 확인되었다. Apache 애플리케이션에 PPv2를 활성화 하고 Consul CRD를 적용하여 IngressGateway에서 호출하였으나, 400 에러가 발생한다. (NLB PPv2 활성화 시 발생)</p>
<p>아쉽지만 본 테스트는 FR이 진행된 이후에 업데이트 하도록 하겠다.</p>
</div></template>


