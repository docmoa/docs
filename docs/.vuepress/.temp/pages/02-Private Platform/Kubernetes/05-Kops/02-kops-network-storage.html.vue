<template><div><h1 id="pkos-2편-네트워크-스토리지" tabindex="-1"><a class="header-anchor" href="#pkos-2편-네트워크-스토리지" aria-hidden="true">#</a> [PKOS] 2편 - 네트워크 &amp; 스토리지</h1>
<p>지난 1주차 스터디에이어 2주차 스터디를 진행하였습니다. 이번 스터디에서는 &quot;쿠버네티스 네트워크&quot; 및 &quot;쿠버네티스 스토리지&quot;를 중심으로 학습하였습니다.</p>
<blockquote>
<p>참고 :<br>
원활한 실습을 위해 인스턴스 타입을 변경한 후 진행합니다.</p>
</blockquote>
<h2 id="_0-사전준비" tabindex="-1"><a class="header-anchor" href="#_0-사전준비" aria-hidden="true">#</a> 0. 사전준비</h2>
<h3 id="_1-kops-클러스터의-인스턴-그룹-변경" tabindex="-1"><a class="header-anchor" href="#_1-kops-클러스터의-인스턴-그룹-변경" aria-hidden="true">#</a> 1) Kops 클러스터의 인스턴 그룹 변경</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kops get ig
NAME			ROLE	MACHINETYPE	MIN	MAX	ZONES
master-ap-northeast-2a	Master	t3.medium	<span class="token number">1</span>	<span class="token number">1</span>	ap-northeast-2a
nodes-ap-northeast-2a	Node	t3.medium	<span class="token number">1</span>	<span class="token number">1</span>	ap-northeast-2a
nodes-ap-northeast-2c	Node	t3.medium	<span class="token number">1</span>	<span class="token number">1</span>	ap-northeast-2c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code>kops edit ig master<span class="token punctuation">-</span>ap<span class="token punctuation">-</span>northeast<span class="token punctuation">-</span>2a

<span class="token comment"># 예제화면</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> kops.k8s.io/v1alpha2
<span class="token key atrule">kind</span><span class="token punctuation">:</span> InstanceGroup
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">creationTimestamp</span><span class="token punctuation">:</span> <span class="token string">"2023-03-05T13:37:26Z"</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">kops.k8s.io/cluster</span><span class="token punctuation">:</span> pkos.hyungwook.link
  <span class="token key atrule">name</span><span class="token punctuation">:</span> master<span class="token punctuation">-</span>ap<span class="token punctuation">-</span>northeast<span class="token punctuation">-</span>2a
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">image</span><span class="token punctuation">:</span> 099720109477/ubuntu/images/hvm<span class="token punctuation">-</span>ssd/ubuntu<span class="token punctuation">-</span>focal<span class="token punctuation">-</span>20.04<span class="token punctuation">-</span>amd64<span class="token punctuation">-</span>server<span class="token punctuation">-</span><span class="token number">20230112</span>
  <span class="token key atrule">instanceMetadata</span><span class="token punctuation">:</span>
    <span class="token key atrule">httpPutResponseHopLimit</span><span class="token punctuation">:</span> <span class="token number">3</span>
    <span class="token key atrule">httpTokens</span><span class="token punctuation">:</span> required
  <span class="token key atrule">machineType</span><span class="token punctuation">:</span> t3.medium <span class="token comment">#기존 t3.medium에서 c5d.large로 변경</span>
  <span class="token key atrule">maxSize</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">minSize</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">role</span><span class="token punctuation">:</span> Master
  <span class="token key atrule">subnets</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> ap<span class="token punctuation">-</span>northeast<span class="token punctuation">-</span>2a
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kops get ig
NAME			ROLE	MACHINETYPE	MIN	MAX	ZONES
master-ap-northeast-2a	Master	c5d.large	<span class="token number">1</span>	<span class="token number">1</span>	ap-northeast-2a
nodes-ap-northeast-2a	Node	c5d.large	<span class="token number">1</span>	<span class="token number">1</span>	ap-northeast-2a
nodes-ap-northeast-2c	Node	c5d.large	<span class="token number">1</span>	<span class="token number">1</span>	ap-northeast-2c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Cluster Update 수행</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kops update cluster <span class="token parameter variable">--name</span> pkos.hyungwook.link <span class="token parameter variable">--yes</span>

kops rolling-update cluster <span class="token parameter variable">--yes</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr>
<h2 id="_2-nlb" tabindex="-1"><a class="header-anchor" href="#_2-nlb" aria-hidden="true">#</a> 2. NLB</h2>
<h3 id="_1-nlb-mode-정리" tabindex="-1"><a class="header-anchor" href="#_1-nlb-mode-정리" aria-hidden="true">#</a> 1) NLB Mode 정리</h3>
<h4 id="_1-인스턴스-유형" tabindex="-1"><a class="header-anchor" href="#_1-인스턴스-유형" aria-hidden="true">#</a> (1) 인스턴스 유형</h4>
<ol>
<li><code v-pre>externalTrafficPolicy</code> : ClusterIP ⇒ 2번 분산 및 SNAT으로 Client IP 확인 불가능 ← <code v-pre>LoadBalancer</code> 타입 (기본 모드) 동작</li>
<li><code v-pre>externalTrafficPolicy</code> : Local ⇒ 1번 분산 및 ClientIP 유지, 워커 노드의 iptables 사용함</li>
</ol>
<ul>
<li>이미지 출처 : PKOS 스터디 - 가시다님</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/IMeYr3.jpg" alt="NLB 이미지1" tabindex="0" loading="lazy"><figcaption>NLB 이미지1</figcaption></figure>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/rV5KOK.jpg" alt="NLB 이미지2" tabindex="0" loading="lazy"><figcaption>NLB 이미지2</figcaption></figure>
<h4 id="_2-ip-유형" tabindex="-1"><a class="header-anchor" href="#_2-ip-유형" aria-hidden="true">#</a> (2) IP 유형</h4>
<blockquote>
<p>반드시 AWS LoadBalancer 컨트롤러 파드 및 정책 설정이 필요함!</p>
</blockquote>
<ol>
<li><code v-pre>Proxy Protocol v2 비활성화</code> ⇒ NLB에서 바로 파드로 인입, 단 ClientIP가 NLB로 SNAT 되어 Client IP 확인 불가능</li>
<li><code v-pre>Proxy Protocol v2 활성화</code> ⇒ NLB에서 바로 파드로 인입 및 ClientIP 확인 가능(→ 단 PPv2 를 애플리케이션이 인지할 수 있게 설정 필요)</li>
</ol>
<h3 id="_2-서비스-배포" tabindex="-1"><a class="header-anchor" href="#_2-서비스-배포" aria-hidden="true">#</a> 2) 서비스 배포</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 작업용 EC2 - 디플로이먼트 &amp; 서비스 생성</span>
<span class="token function">cat</span> ~/pkos/2/echo-service-nlb.yaml <span class="token operator">|</span> yh
kubectl apply <span class="token parameter variable">-f</span> ~/pkos/2/echo-service-nlb.yaml

<span class="token comment"># 확인</span>
kubectl get deploy,pod
kubectl get svc,ep,ingressclassparams,targetgroupbindings

NAME                      TYPE           CLUSTER-IP       EXTERNAL-IP                                                                         PORT<span class="token punctuation">(</span>S<span class="token punctuation">)</span>        AGE
service/kubernetes        ClusterIP      <span class="token number">100.64</span>.0.1       <span class="token operator">&lt;</span>none<span class="token operator">></span>                                                                              <span class="token number">443</span>/TCP        7d
service/svc-nlb-ip-type   LoadBalancer   <span class="token number">100.64</span>.191.200   k8s-default-svcnlbip-bfcad9371a-250be02681485d95.elb.ap-northeast-2.amazonaws.com   <span class="token number">80</span>:31206/TCP   97s

NAME                        ENDPOINTS                             AGE
endpoints/kubernetes        <span class="token number">172.30</span>.37.41:443                      7d
endpoints/svc-nlb-ip-type   <span class="token number">172.30</span>.55.31:8080,172.30.71.86:8080   97s

NAME                                   GROUP-NAME   SCHEME   IP-ADDRESS-TYPE   AGE
ingressclassparams.elbv2.k8s.aws/alb                                           122m

NAME                                                        SERVICE-NAME      SERVICE-PORT   TARGET-TYPE   AGE
targetgroupbinding.elbv2.k8s.aws/k8s-default-svcnlbip-c54bafee9a   svc-nlb-ip-type   <span class="token number">80</span>      <span class="token function">ip</span>            95s

kubectl get targetgroupbindings <span class="token parameter variable">-o</span> json <span class="token operator">|</span> jq
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Listener 확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/rZx1tE.jpg" alt="Listener" tabindex="0" loading="lazy"><figcaption>Listener</figcaption></figure>
<ul>
<li>Target Group 확인</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/kQcEaN.jpg" alt="TargetGroup 확인" tabindex="0" loading="lazy"><figcaption>TargetGroup 확인</figcaption></figure>
<ul>
<li>실제 Pod의 IP 정보 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>k get pods <span class="token parameter variable">-o</span> wide
NAME               READY    STATUS   RESTARTS   AGE     IP         NODE        NOMINATED NODE   READINESS GATES
deploy-echo-<span class="token punctuation">(</span>생략<span class="token punctuation">)</span>   <span class="token number">1</span>/1     Running   <span class="token number">0</span>    7m50s   <span class="token number">172.30</span>.55.31   i-089062ff9f50789ee   <span class="token operator">&lt;</span>none<span class="token operator">></span>           <span class="token operator">&lt;</span>none<span class="token operator">></span>
deploy-echo-<span class="token punctuation">(</span>생략<span class="token punctuation">)</span>   <span class="token number">1</span>/1     Running   <span class="token number">0</span>    7m50s   <span class="token number">172.30</span>.71.86   i-096a645be0dd932b6   <span class="token operator">&lt;</span>none<span class="token operator">></span>           <span class="token operator">&lt;</span>none<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-접속확인" tabindex="-1"><a class="header-anchor" href="#_3-접속확인" aria-hidden="true">#</a> 3) 접속확인</h3>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/uVSCZA.jpg" alt="접속확인" tabindex="0" loading="lazy"><figcaption>접속확인</figcaption></figure>
<h2 id="_3-nlb에-tls-적용하기-feat-acm" tabindex="-1"><a class="header-anchor" href="#_3-nlb에-tls-적용하기-feat-acm" aria-hidden="true">#</a> 3. NLB에 TLS 적용하기(feat. ACM)</h2>
<blockquote>
<p>사전 준비 :<br>
공인도메인 소유, AWS Route53 도메인등록 상태, NLB 가 위치한 리전(서울)의 인증서 요청/발급 완료상태, ExternalDNS 준비완료 상태</p>
</blockquote>
<h3 id="_1-환경구성" tabindex="-1"><a class="header-anchor" href="#_1-환경구성" aria-hidden="true">#</a> 1) 환경구성</h3>
<ul>
<li>ACM 인증서 및 ARN 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 사용 리전의 인증서 ARN 확인</span>
aws acm list-certificates
aws acm list-certificates --max-items <span class="token number">10</span>
aws acm list-certificates <span class="token parameter variable">--query</span> <span class="token string">'CertificateSummaryList[].CertificateArn[]'</span> <span class="token parameter variable">--output</span> text
<span class="token assign-left variable">CERT_ARN</span><span class="token operator">=</span><span class="token variable"><span class="token variable">`</span>aws acm list-certificates <span class="token parameter variable">--query</span> <span class="token string">'CertificateSummaryList[].CertificateArn[]'</span> <span class="token parameter variable">--output</span> text<span class="token variable">`</span></span>
<span class="token builtin class-name">echo</span> <span class="token variable">$CERT_ARN</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>NLB와 ACM에서 사용할 도메인 등록</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 자신의 도메인 변수 지정</span>
<span class="token assign-left variable">MyDomain</span><span class="token operator">=</span><span class="token operator">&lt;</span>자신의 도메인<span class="token operator">></span>
<span class="token assign-left variable">MyDomain</span><span class="token operator">=</span>websrv.<span class="token variable">$KOPS_CLUSTER_NAME</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-샘플-애플리케이션-배포" tabindex="-1"><a class="header-anchor" href="#_2-샘플-애플리케이션-배포" aria-hidden="true">#</a> 2) 샘플 애플리케이션 배포</h3>
<ul>
<li>Deploy, SVC YAML</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code>cat &lt;&lt;EOF <span class="token punctuation">|</span> kubectl create <span class="token punctuation">-</span>f <span class="token punctuation">-</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> deploy<span class="token punctuation">-</span>echo
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">2</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> deploy<span class="token punctuation">-</span>websrv
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> deploy<span class="token punctuation">-</span>websrv
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">terminationGracePeriodSeconds</span><span class="token punctuation">:</span> <span class="token number">0</span>
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> akos<span class="token punctuation">-</span>websrv
        <span class="token key atrule">image</span><span class="token punctuation">:</span> k8s.gcr.io/echoserver<span class="token punctuation">:</span><span class="token number">1.5</span>
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> svc<span class="token punctuation">-</span>nlb<span class="token punctuation">-</span>ip<span class="token punctuation">-</span>type
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">external-dns.alpha.kubernetes.io/hostname</span><span class="token punctuation">:</span> <span class="token string">"${MyDomain}"</span>
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-nlb-target-type</span><span class="token punctuation">:</span> ip
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-scheme</span><span class="token punctuation">:</span> internet<span class="token punctuation">-</span>facing
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-healthcheck-port</span><span class="token punctuation">:</span> <span class="token string">"8080"</span>
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled</span><span class="token punctuation">:</span> <span class="token string">"true"</span>
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-ssl-ports</span><span class="token punctuation">:</span> <span class="token string">"https"</span>
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-ssl-cert</span><span class="token punctuation">:</span> $<span class="token punctuation">{</span>CERT_ARN<span class="token punctuation">}</span>
    <span class="token key atrule">service.beta.kubernetes.io/aws-load-balancer-backend-protocol</span><span class="token punctuation">:</span> <span class="token string">"http"</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
      <span class="token key atrule">name</span><span class="token punctuation">:</span> http
    <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">443</span>
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
      <span class="token key atrule">name</span><span class="token punctuation">:</span> https
  <span class="token key atrule">type</span><span class="token punctuation">:</span> LoadBalancer
  <span class="token key atrule">loadBalancerClass</span><span class="token punctuation">:</span> service.k8s.aws/nlb
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> deploy<span class="token punctuation">-</span>websrv
EOF
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>생성된 SVC의 annotation 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl describe svc svc-nlb-ip-type <span class="token operator">|</span> <span class="token function">grep</span> Annotations: <span class="token parameter variable">-A8</span>

Annotations:              external-dns.alpha.kubernetes.io/hostname: websrv.pkos.hyungwook.link
                          service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
                          service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: <span class="token boolean">true</span>
                          service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: <span class="token number">8080</span>
                          service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: <span class="token function">ip</span>
                          service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
                          service.beta.kubernetes.io/aws-load-balancer-ssl-cert:
                            arn:aws:acm:ap-northeast-2:856117747411:certificate/208e809e-9ebf-4bb5-92c2-795868429e88
                          service.beta.kubernetes.io/aws-load-balancer-ssl-ports: https
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-인증서-적용-확인" tabindex="-1"><a class="header-anchor" href="#_3-인증서-적용-확인" aria-hidden="true">#</a> 3) 인증서 적용 확인</h3>
<h4 id="_1-cli-확인" tabindex="-1"><a class="header-anchor" href="#_1-cli-확인" aria-hidden="true">#</a> (1) CLI 확인</h4>
<ul>
<li><code v-pre>insecure</code> 옵션 없이 정상적으로 curl 응답 하는 것을 확인할 수 있습니다.</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token parameter variable">-s</span> http://websrv.pkos.hyungwook.link <span class="token operator">|</span> <span class="token function">grep</span> Hostname
Hostname: deploy-echo-5c4856dfd6-267pf

<span class="token function">curl</span> <span class="token parameter variable">-s</span>  https://websrv.pkos.hyungwook.link <span class="token operator">|</span> <span class="token function">grep</span> Hostname
Hostname: deploy-echo-5c4856dfd6-k9277
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-웹-브라우저-확인" tabindex="-1"><a class="header-anchor" href="#_2-웹-브라우저-확인" aria-hidden="true">#</a> (2) 웹 브라우저 확인</h4>
<ul>
<li><strong>&quot;이 연결은 안전합니다.&quot;</strong> 메시지를 통해 실제 ACM 퍼블릭 인증서가 적용된 것을 확인할 수 있습니다.</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/OPTdsH.jpg" alt="인증서 적용 확인" tabindex="0" loading="lazy"><figcaption>인증서 적용 확인</figcaption></figure>
<h2 id="_3-ingress" tabindex="-1"><a class="header-anchor" href="#_3-ingress" aria-hidden="true">#</a> 3. Ingress</h2>
<p>클러스터 내부의 서비스(ClusterIP, NodePort, Loadbalancer)를 외부로 노출(HTTP/HTTPS) - Web Proxy 역할</p>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/u5cdKs.jpg" alt="ingress" tabindex="0" loading="lazy"><figcaption>ingress</figcaption></figure>
<h3 id="_1-환경구성-1" tabindex="-1"><a class="header-anchor" href="#_1-환경구성-1" aria-hidden="true">#</a> 1) 환경구성</h3>
<ul>
<li>AWS LoadBalancerControllerIAMPolicy 정책 생성 및 추가</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># EC2 instance profiles 에 IAM Policy 추가(attach)</span>
aws iam attach-role-policy --policy-arn arn:aws:iam::<span class="token variable">$ACCOUNT_ID</span>:policy/AWSLoadBalancerControllerIAMPolicy --role-name masters.<span class="token variable">$KOPS_CLUSTER_NAME</span>
aws iam attach-role-policy --policy-arn arn:aws:iam::<span class="token variable">$ACCOUNT_ID</span>:policy/AWSLoadBalancerControllerIAMPolicy --role-name nodes.<span class="token variable">$KOPS_CLUSTER_NAME</span>

<span class="token comment"># EC2 instance profiles 에 IAM Policy 추가(attach)</span>
aws iam attach-role-policy --policy-arn arn:aws:iam::<span class="token variable">$ACCOUNT_ID</span>:policy/AWSLoadBalancerControllerIAMPolicy --role-name masters.<span class="token variable">$KOPS_CLUSTER_NAME</span>
aws iam attach-role-policy --policy-arn arn:aws:iam::<span class="token variable">$ACCOUNT_ID</span>:policy/AWSLoadBalancerControllerIAMPolicy --role-name nodes.<span class="token variable">$KOPS_CLUSTER_NAME</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Kops 클러스터 ExternalDNS 및 certManager 설정 추가</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token comment"># kOps 클러스터 편집 : 아래 내용 추가</span>
kops edit cluster
<span class="token punctuation">---</span><span class="token punctuation">-</span><span class="token punctuation">-</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">certManager</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">awsLoadBalancerController</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">externalDns</span><span class="token punctuation">:</span>
    <span class="token key atrule">provider</span><span class="token punctuation">:</span> external<span class="token punctuation">-</span>dns
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>변경된 설정 업데이트 반영</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 업데이트 적용</span>
kops update cluster <span class="token parameter variable">--yes</span> <span class="token operator">&amp;&amp;</span> <span class="token builtin class-name">echo</span> <span class="token operator">&amp;&amp;</span> <span class="token function">sleep</span> <span class="token number">3</span> <span class="token operator">&amp;&amp;</span> kops rolling-update cluster
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-서비스-파드-배포-테스트-with-ingress-alb" tabindex="-1"><a class="header-anchor" href="#_2-서비스-파드-배포-테스트-with-ingress-alb" aria-hidden="true">#</a> 2) 서비스/파드 배포 테스트 with Ingress(ALB)\</h3>
<ul>
<li>서비스 배포</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 게임 파드와 Service, Ingress 배포</span>
kubectl apply <span class="token parameter variable">-f</span> ~/pkos/3/ingress1.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>서비스 배포 후 Target Type이 IP로 생성된 것 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl get targetgroupbindings <span class="token parameter variable">-n</span> game-2048
NAME                               SERVICE-NAME   SERVICE-PORT   TARGET-TYPE   AGE
k8s-game2048-service2-e48050abac   service-2048   <span class="token number">80</span>             <span class="token function">ip</span>            87s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Ingress 정보 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl describe ingress <span class="token parameter variable">-n</span> game-2048 ingress-2048

Name:             ingress-2048
Labels:           <span class="token operator">&lt;</span>none<span class="token operator">></span>
Namespace:        game-2048
Address:          k8s-game2048-ingress2-fdfe8009a9-1424012699.ap-northeast-2.elb.amazonaws.com
Ingress Class:    alb
Default backend:  <span class="token operator">&lt;</span>default<span class="token operator">></span>
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /   service-2048:80 <span class="token punctuation">(</span><span class="token number">172.30</span>.44.132:80,172.30.65.100:80<span class="token punctuation">)</span>
Annotations:  alb.ingress.kubernetes.io/scheme: internet-facing
              alb.ingress.kubernetes.io/target-type: <span class="token function">ip</span>
Events:
  Type    Reason                  Age    From     Message
  ----    ------                  ----   ----     -------
  Normal  SuccessfullyReconciled  8m56s  ingress  Successfully reconciled
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>ALB 접속 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 게임 접속 : ALB 주소로 웹 접속</span>
kubectl get ingress <span class="token parameter variable">-n</span> game-2048 ingress-2048 <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">"{.status.loadBalancer.ingress[0].hostname}"</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">'{ print "Game URL = http://"$1 }'</span>
Game URL <span class="token operator">=</span> http://k8s-game2048-ingress2-fdfe8009a9-1424012699.ap-northeast-2.elb.amazonaws.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/KTZTUM.jpg" alt="게임화면" tabindex="0" loading="lazy"><figcaption>게임화면</figcaption></figure>
<ul>
<li>리소스 삭제</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl delete ingress ingress-2048 <span class="token parameter variable">-n</span> game-2048
kubectl delete svc service-2048 <span class="token parameter variable">-n</span> game-2048 <span class="token operator">&amp;&amp;</span> kubectl delete deploy deployment-2048 <span class="token parameter variable">-n</span> game-2048 <span class="token operator">&amp;&amp;</span> kubectl delete ns game-2048
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-쿠버네티스-스토리지-ebs" tabindex="-1"><a class="header-anchor" href="#_4-쿠버네티스-스토리지-ebs" aria-hidden="true">#</a> 4. 쿠버네티스 스토리지 : EBS</h2>
<h3 id="_1-환경구성-2" tabindex="-1"><a class="header-anchor" href="#_1-환경구성-2" aria-hidden="true">#</a> 1) 환경구성</h3>
<p><code v-pre>c5d.large</code> 의 EC2 인스턴스 스토어(임시 블록 스토리지) 설정 작업 - <a href="https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/InstanceStorage.html" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a> , NVMe SSD - <a href="https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/ssd-instance-store.html" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></p>
<ul>
<li>데이터 손실 : 기본 디스크 드라이브 오류, 인스턴스가 중지됨, 인스턴스가 최대 절전 모드로 전환됨, 인스턴스가 종료됨</li>
</ul>
<figure><img src="https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/images/instance_storage.png" alt="       Amazon EC2 인스턴스 스토리지     " tabindex="0" loading="lazy"><figcaption>       Amazon EC2 인스턴스 스토리지     </figcaption></figure>
<ul>
<li>임시스토리지 실습을 위한 환경 구성</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 인스턴스 스토어 볼륨이 있는 c5 모든 타입의 스토리지 크기</span>
aws ec2 describe-instance-types <span class="token punctuation">\</span>
 <span class="token parameter variable">--filters</span> <span class="token string">"Name=instance-type,Values=c5*"</span> <span class="token string">"Name=instance-storage-supported,Values=true"</span> <span class="token punctuation">\</span>
 <span class="token parameter variable">--query</span> <span class="token string">"InstanceTypes[].[InstanceType, InstanceStorageInfo.TotalSizeInGB]"</span> <span class="token punctuation">\</span>
 <span class="token parameter variable">--output</span> table
--------------------------
<span class="token operator">|</span>  DescribeInstanceTypes <span class="token operator">|</span>
+---------------+--------+
<span class="token operator">|</span>  c5d.large    <span class="token operator">|</span>  <span class="token number">50</span>    <span class="token operator">|</span>
<span class="token operator">|</span>  c5d.12xlarge <span class="token operator">|</span>  <span class="token number">1800</span>  <span class="token operator">|</span>
<span class="token punctuation">..</span>.

<span class="token comment"># 워커 노드 Public IP 확인</span>
aws ec2 describe-instances <span class="token parameter variable">--query</span> <span class="token string">"Reservations[*].Instances[*].{PublicIPAdd:PublicIpAddress,InstanceName:Tags[?Key=='Name']|[0].Value}"</span> <span class="token parameter variable">--filters</span> <span class="token assign-left variable">Name</span><span class="token operator">=</span>instance-state-name,Values<span class="token operator">=</span>running <span class="token parameter variable">--output</span> table

-------------------------------------------------------------------------
<span class="token operator">|</span>                           DescribeInstances                           <span class="token operator">|</span>
+------------------------------------------------------+----------------+
<span class="token operator">|</span>                     InstanceName                     <span class="token operator">|</span>  PublicIPAdd   <span class="token operator">|</span>
+------------------------------------------------------+----------------+
<span class="token operator">|</span>  nodes-ap-northeast-2c.pkos.hyungwook.link           <span class="token operator">|</span>  <span class="token number">13.209</span>.75.228 <span class="token operator">|</span>
<span class="token operator">|</span>  master-ap-northeast-2a.masters.pkos.hyungwook.link  <span class="token operator">|</span>  <span class="token number">3.38</span>.117.78   <span class="token operator">|</span>
<span class="token operator">|</span>  nodes-ap-northeast-2a.pkos.hyungwook.link           <span class="token operator">|</span>  <span class="token number">52.79</span>.61.228  <span class="token operator">|</span>
+------------------------------------------------------+----------------+

<span class="token comment"># 워커 노드 Public IP 변수 지정</span>
<span class="token assign-left variable">W1PIP</span><span class="token operator">=</span><span class="token operator">&lt;</span>워커 노드 <span class="token number">1</span> Public IP<span class="token operator">></span>
<span class="token assign-left variable">W2PIP</span><span class="token operator">=</span><span class="token operator">&lt;</span>워커 노드 <span class="token number">2</span> Public IP<span class="token operator">></span>
<span class="token assign-left variable">W1PIP</span><span class="token operator">=</span><span class="token number">13.209</span>.75.228
<span class="token assign-left variable">W2PIP</span><span class="token operator">=</span><span class="token number">52.79</span>.61.228
<span class="token builtin class-name">echo</span> <span class="token string">"export W1PIP=<span class="token variable">$W1PIP</span>"</span> <span class="token operator">>></span> /etc/profile
<span class="token builtin class-name">echo</span> <span class="token string">"export W2PIP=<span class="token variable">$W2PIP</span>"</span> <span class="token operator">>></span> /etc/profile
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>워커 노드 스토리지 확인 : nvme 명령도구 설치 및 확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W1PIP</span> <span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> <span class="token parameter variable">-y</span> nvme-cli
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W2PIP</span> <span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> <span class="token parameter variable">-y</span> nvme-cli
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W1PIP</span> <span class="token function">sudo</span> nvme list
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W2PIP</span> <span class="token function">sudo</span> nvme list
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/6iX9dg.jpg" alt="nvme_list" tabindex="0" loading="lazy"><figcaption>nvme_list</figcaption></figure>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 워커 노드 스토리지 확인 : NVMe SSD 인스턴스 스토어 볼륨 확인</span>
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W1PIP</span> lsblk <span class="token parameter variable">-e</span> <span class="token number">7</span>
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W2PIP</span> lsblk <span class="token parameter variable">-e</span> <span class="token number">7</span>
NAME         MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
nvme1n1      <span class="token number">259</span>:0    <span class="token number">0</span>  <span class="token number">46</span>.6G  <span class="token number">0</span> disk
nvme0n1      <span class="token number">259</span>:1    <span class="token number">0</span>   128G  <span class="token number">0</span> disk
├─nvme0n1p1  <span class="token number">259</span>:2    <span class="token number">0</span> <span class="token number">127</span>.9G  <span class="token number">0</span> part /
├─nvme0n1p14 <span class="token number">259</span>:3    <span class="token number">0</span>     4M  <span class="token number">0</span> part
└─nvme0n1p15 <span class="token number">259</span>:4    <span class="token number">0</span>   106M  <span class="token number">0</span> part /boot/efi

<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W1PIP</span> <span class="token function">df</span> <span class="token parameter variable">-hT</span> <span class="token parameter variable">-t</span> ext4
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W2PIP</span> <span class="token function">df</span> <span class="token parameter variable">-hT</span> <span class="token parameter variable">-t</span> ext4
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/root      ext4  124G  <span class="token number">4</span>.2G  120G   <span class="token number">4</span>% /

<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W1PIP</span> lspci <span class="token operator">|</span> <span class="token function">grep</span> Non-Volatile
00:04.0 Non-Volatile memory controller: Amazon.com, Inc. Device <span class="token number">8061</span>
00:1f.0 Non-Volatile memory controller: Amazon.com, Inc. NVMe SSD Controller

<span class="token comment"># 파일시스템 생성</span>
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W1PIP</span> <span class="token function">sudo</span> <span class="token function">mkfs</span> <span class="token parameter variable">-t</span> xfs /dev/nvme1n1
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W2PIP</span> <span class="token function">sudo</span> <span class="token function">mkfs</span> <span class="token parameter variable">-t</span> xfs /dev/nvme1n1

<span class="token comment"># /data 디렉토리 생성 </span>
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W1PIP</span> <span class="token function">sudo</span> <span class="token function">mkdir</span> /data
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W2PIP</span> <span class="token function">sudo</span> <span class="token function">mkdir</span> /data

<span class="token comment"># /data 마운트</span>
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W1PIP</span> <span class="token function">sudo</span> <span class="token function">mount</span> /dev/nvme1n1 /data
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W2PIP</span> <span class="token function">sudo</span> <span class="token function">mount</span> /dev/nvme1n1 /data

<span class="token comment"># 파일시스템 포맷 및 마운트 확인</span>
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W1PIP</span> <span class="token function">df</span> <span class="token parameter variable">-hT</span> <span class="token parameter variable">-t</span> ext4 <span class="token parameter variable">-t</span> xfs
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W2PIP</span> <span class="token function">df</span> <span class="token parameter variable">-hT</span> <span class="token parameter variable">-t</span> ext4 <span class="token parameter variable">-t</span> xfs
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/root      ext4  124G  <span class="token number">4</span>.2G  120G   <span class="token number">4</span>% /
/dev/nvme1n1   xfs    47G  365M   47G   <span class="token number">1</span>% /data
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-hostpath-실습" tabindex="-1"><a class="header-anchor" href="#_2-hostpath-실습" aria-hidden="true">#</a> 2) HostPath 실습</h3>
<h4 id="_1-hostpath스토리지-클래스-배포" tabindex="-1"><a class="header-anchor" href="#_1-hostpath스토리지-클래스-배포" aria-hidden="true">#</a> (1) HostPath스토리지 클래스 배포</h4>
<ul>
<li>호스트 Path 를 사용하는 PV/PVC : local-path-provisioner 스트리지 클래스 배포 - <a href="https://github.com/rancher/local-path-provisioner" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 마스터노드의 이름 확인해두기</span>
kubectl get <span class="token function">node</span> <span class="token operator">|</span> <span class="token function">grep</span> control-plane <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">'{print $1}'</span>
i-066cdb714fc6545c0

<span class="token comment"># 배포 : vim 직접 편집할것</span>
<span class="token function">curl</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-O</span> https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.23/deploy/local-path-storage.yaml
<span class="token function">vim</span> local-path-storage.yaml
----------------------------
<span class="token comment"># 아래 빨간 부분은 추가 및 수정</span>
apiVersion: apps/v1
kind: Deployment
metadata:
  name: local-path-provisioner
  namespace: local-path-storage
spec:
  replicas: <span class="token number">1</span>
  selector:
    matchLabels:
      app: local-path-provisioner
  template:
    metadata:
      labels:
        app: local-path-provisioner
    spec:
      nodeSelector:
        kubernetes.io/hostname: <span class="token string">"&lt;각자 자신의 마스터 노드 이름 입력>"</span>
      tolerations:
        - effect: NoSchedule
          key: node-role.kubernetes.io/control-plane
          operator: Exists
<span class="token punctuation">..</span>.
kind: ConfigMap
apiVersion: v1
metadata:
  name: local-path-config
  namespace: local-path-storage
data:
  config.json: <span class="token operator">|</span>-
    <span class="token punctuation">{</span>
            <span class="token string">"nodePathMap"</span>:<span class="token punctuation">[</span>
            <span class="token punctuation">{</span>
                    <span class="token string">"node"</span><span class="token builtin class-name">:</span><span class="token string">"DEFAULT_PATH_FOR_NON_LISTED_NODES"</span>,
                    <span class="token string">"paths"</span>:<span class="token punctuation">[</span><span class="token string">"/data/local-path"</span><span class="token punctuation">]</span>
            <span class="token punctuation">}</span>
            <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
----------------------------

<span class="token comment"># 배포</span>
kubectl apply <span class="token parameter variable">-f</span> local-path-storage.yaml

<span class="token comment"># 확인 : 마스터노드에 배포됨</span>
kubectl get-all <span class="token parameter variable">-n</span> local-path-storage
NAME                                                   NAMESPACE           AGE
configmap/kube-root-ca.crt                             local-path-storage  12s
configmap/local-path-config                            local-path-storage  12s
pod/local-path-provisioner-6bff65dcd8-vgwfk            local-path-storage  12s
serviceaccount/default                                 local-path-storage  12s
serviceaccount/local-path-provisioner-service-account  local-path-storage  12s
deployment.apps/local-path-provisioner                 local-path-storage  12s
replicaset.apps/local-path-provisioner-6bff65dcd8      local-path-storage  12s

kubectl get pod <span class="token parameter variable">-n</span> local-path-storage <span class="token parameter variable">-owide</span>
NAME                                      READY   STATUS    RESTARTS   AGE   IP              NODE                  NOMINATED NODE   READINESS GATES
local-path-provisioner-6bff65dcd8-vgwfk   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          17s   <span class="token number">172.30</span>.63.103   i-072786762169226a7   <span class="token operator">&lt;</span>none<span class="token operator">></span>           <span class="token operator">&lt;</span>none<span class="token operator">></span>

kubectl describe cm <span class="token parameter variable">-n</span> local-path-storage local-path-config

kubectl get sc local-path
NAME         PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path   rancher.io/local-path   Delete          WaitForFirstConsumer   <span class="token boolean">false</span>                  34s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-pv-pvc-샘플-배포" tabindex="-1"><a class="header-anchor" href="#_2-pv-pvc-샘플-배포" aria-hidden="true">#</a> (2) PV / PVC 샘플 배포</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># PVC 생성</span>
kubectl apply <span class="token parameter variable">-f</span> ~/pkos/3/localpath1.yaml

<span class="token comment"># PVC 확인 : 아직 Pod Boud가 되지 않았으므로 Pending</span>
kubectl describe pvc
kubectl get pvc

NAME              STATUS    VOLUME                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
localpath-claim   Pending                                                        local-path      58s

<span class="token comment"># 파드 생성</span>
kubectl apply <span class="token parameter variable">-f</span> ~/pkos/3/localpath2.yaml

<span class="token comment"># 파드확인 : 정상적으로 Bound된 것으로 확인</span>
kubectl get pod,pv,pvc

NAME                READY   STATUS    RESTARTS   AGE
pod/app-localpath   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          56s

NAME                                                        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                     STORAGECLASS    REASON   AGE
persistentvolume/pvc-37743f20-e30d-491c-b11c-5e5b7d33a476   1Gi        RWO            Delete           Bound    default/localpath-claim   local-path               49s

NAME                                    STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
persistentvolumeclaim/localpath-claim   Bound    pvc-37743f20-e30d-491c-b11c-5e5b7d33a476   1Gi        RWO            local-path      3m57s
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>데이터 생성확인</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 파드 데이터 확인 : app-localpath 파드에서 데이터 쌓이는 것 확인</span>
kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> app-localpath -- <span class="token function">tail</span> <span class="token parameter variable">-f</span> /data/out.txt
Sun Jan <span class="token number">29</span> 05:13:45 UTC <span class="token number">2023</span>

<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W2PIP</span> tree /data
/data
<span class="token number">0</span> directories, <span class="token number">0</span> files

<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W1PIP</span> tree /data
/data
└── local-path
    └── pvc-37743f20-e30d-491c-b11c-5e5b7d33a476_default_localpath-claim
        └── out.txt

<span class="token number">2</span> directories, <span class="token number">1</span> <span class="token function">file</span>

<span class="token comment"># 노드 데이터 확인 : app-localpath 파드가 배포된 노드에 접속 후 데이터 쌓이는 것 확인</span>
<span class="token function">ssh</span> <span class="token parameter variable">-i</span> ~/.ssh/id_rsa ubuntu@<span class="token variable">$W2PIP</span> <span class="token function">tail</span> <span class="token parameter variable">-f</span> /data/local-path/pvc-ce742b90-755a-4b52-9693-595cbf55dfb0_default_localpath-claim/out.txt
Sun Jan <span class="token number">29</span> 05:13:45 UTC <span class="token number">2023</span>
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/Y6CYPg.jpg" alt="데이터확인" tabindex="0" loading="lazy"><figcaption>데이터확인</figcaption></figure>
<blockquote>
<p>LocalPath 성능측정은 추후 별도 정리 후 업로드 예정</p>
</blockquote>
<h3 id="_3-aws-ebs-controller" tabindex="-1"><a class="header-anchor" href="#_3-aws-ebs-controller" aria-hidden="true">#</a> 3) AWS EBS Controller</h3>
<p>Volume (ebs-csi-controller) : EBS CSI driver 동작 : 볼륨 생성 및 파드에 볼륨 연결 - <a href="https://github.com/kubernetes-sigs/aws-ebs-csi-driver" target="_blank" rel="noopener noreferrer">링크<ExternalLinkIcon/></a></p>
<ul>
<li>이미지 출처 : PKOS 스터디 - 가시다</li>
</ul>
<figure><img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/dGge8O.jpg" alt="EBS Controller" tabindex="0" loading="lazy"><figcaption>EBS Controller</figcaption></figure>
<h4 id="_1-ebs-driver-배포확인" tabindex="-1"><a class="header-anchor" href="#_1-ebs-driver-배포확인" aria-hidden="true">#</a> (1) EBS Driver 배포확인</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># EBS Driver 확인 Kops 설치 시 기본 배포</span>
kubectl get pod <span class="token parameter variable">-n</span> kube-system <span class="token parameter variable">-l</span> app.kubernetes.io/instance<span class="token operator">=</span>aws-ebs-csi-driver

NAME                                  READY   STATUS    RESTARTS   AGE
ebs-csi-controller-6d8fd64c78-q5qfn   <span class="token number">5</span>/5     Running   <span class="token number">0</span>          5d23h
ebs-csi-node-9cfss                    <span class="token number">3</span>/3     Running   <span class="token number">0</span>          5d23h
ebs-csi-node-crhbx                    <span class="token number">3</span>/3     Running   <span class="token number">0</span>          5d23h
ebs-csi-node-zbjgj                    <span class="token number">3</span>/3     Running   <span class="token number">0</span>          5d23h

<span class="token comment"># 스토리지 클래스 확인</span>
kubectl get sc kops-csi-1-21 kops-ssd-1-17

kubectl describe sc kops-csi-1-21 <span class="token operator">|</span> <span class="token function">grep</span> Parameters
Parameters:            <span class="token assign-left variable">encrypted</span><span class="token operator">=</span>true,type<span class="token operator">=</span>gp3
kubectl describe sc kops-ssd-1-17 <span class="token operator">|</span> <span class="token function">grep</span> Parameters
Parameters:            <span class="token assign-left variable">encrypted</span><span class="token operator">=</span>true,type<span class="token operator">=</span>gp2

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-pv-pvc-샘플-배포-1" tabindex="-1"><a class="header-anchor" href="#_2-pv-pvc-샘플-배포-1" aria-hidden="true">#</a> (2) PV / PVC 샘플 배포</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># PVC 생성</span>
kubectl apply <span class="token parameter variable">-f</span> ~/pkos/3/awsebs-pvc.yaml

<span class="token comment"># 파드 생성</span>
kubectl apply <span class="token parameter variable">-f</span> ~/pkos/3/awsebs-pod.yaml

<span class="token comment"># PVC, 파드 확인</span>
kubectl get pvc,pv,pod
NAME                              STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
persistentvolumeclaim/ebs-claim   Bound    pvc-fb5b5e1c-76ef-4a43-9b94-9af2b1b1e5f7   4Gi        RWO            kops-csi-1-21   41m

NAME                                                        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS    REASON   AGE
persistentvolume/pvc-fb5b5e1c-76ef-4a43-9b94-9af2b1b1e5f7   4Gi        RWO            Delete           Bound    default/ebs-claim   kops-csi-1-21            40m

NAME      READY   STATUS    RESTARTS   AGE
pod/app   <span class="token number">1</span>/1     Running   <span class="token number">0</span>          3m15s

<span class="token comment"># 실제 쌓이는 데이터 확인</span>
kubectl <span class="token builtin class-name">exec</span> app -- <span class="token function">tail</span> <span class="token parameter variable">-f</span> /data/out.txt

Sat Mar <span class="token number">18</span> <span class="token number">14</span>:49:25 UTC <span class="token number">2023</span>
Sat Mar <span class="token number">18</span> <span class="token number">14</span>:49:30 UTC <span class="token number">2023</span>
Sat Mar <span class="token number">18</span> <span class="token number">14</span>:49:35 UTC <span class="token number">2023</span>
<span class="token punctuation">..</span>.

<span class="token comment"># 파드 내에서 볼륨 정보 확인</span>
kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> app -- <span class="token function">sh</span> <span class="token parameter variable">-c</span> <span class="token string">'df -hT --type=ext4'</span>
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/nvme1n1   ext4  <span class="token number">3</span>.9G   16M  <span class="token number">3</span>.8G   <span class="token number">1</span>% /data
/dev/root      ext4  124G  <span class="token number">4</span>.9G  120G   <span class="token number">4</span>% /etc/hosts

<span class="token comment"># 추가된 EBS 볼륨 상세 정보 확인 </span>
<span class="token keyword">while</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token keyword">do</span> aws ec2 describe-volumes <span class="token parameter variable">--filters</span> <span class="token assign-left variable">Name</span><span class="token operator">=</span>tag:ebs.csi.aws.com/cluster,Values<span class="token operator">=</span>true <span class="token parameter variable">--query</span> <span class="token string">"Volumes[].{VolumeId: VolumeId, VolumeType: VolumeType, InstanceId: Attachments[0].InstanceId, State: Attachments[0].State}"</span> <span class="token parameter variable">--output</span> text<span class="token punctuation">;</span> <span class="token function">date</span><span class="token punctuation">;</span> <span class="token function">sleep</span> <span class="token number">1</span><span class="token punctuation">;</span> <span class="token keyword">done</span>

<span class="token punctuation">(</span>중략<span class="token punctuation">)</span>
i-078613f7b7cd9e352	attached	vol-071ebb777dc2ac3cd	gp3 <span class="token comment"># 시간이 지난 후 추가되는 것 확인</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-번외-pvc-데이터-증설" tabindex="-1"><a class="header-anchor" href="#_3-번외-pvc-데이터-증설" aria-hidden="true">#</a> (3) (번외) PVC 데이터 증설</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 현재 pv 의 이름을 기준하여 4G > 10G 로 증가 : .spec.resources.requests.storage의 4Gi 를 10Gi로 변경</span>
kubectl get pvc ebs-claim <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token punctuation">{</span>.spec.resources.requests.storage<span class="token punctuation">}</span> <span class="token punctuation">;</span> <span class="token builtin class-name">echo</span>
kubectl get pvc ebs-claim <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token punctuation">{</span>.status.capacity.storage<span class="token punctuation">}</span> <span class="token punctuation">;</span> <span class="token builtin class-name">echo</span>
kubectl patch pvc ebs-claim <span class="token parameter variable">-p</span> <span class="token string">'{"spec":{"resources":{"requests":{"storage":"10Gi"}}}}'</span>

<span class="token comment"># 확인 : 볼륨 용량 수정 반영이 되어야 되니, 수치 반영이 조금 느릴수 있다</span>
kubectl <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> app -- <span class="token function">sh</span> <span class="token parameter variable">-c</span> <span class="token string">'df -hT --type=ext4'</span>
kubectl df-pv
aws ec2 describe-volumes --volume-ids <span class="token variable"><span class="token variable">$(</span>kubectl get <span class="token function">pv</span> <span class="token parameter variable">-o</span> <span class="token assign-left variable">jsonpath</span><span class="token operator">=</span><span class="token string">"{.items[0].spec.csi.volumeHandle}"</span><span class="token variable">)</span></span> <span class="token operator">|</span> jq
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>리소스 삭제</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>kubectl delete pod app <span class="token operator">&amp;</span> kubectl delete pvc ebs-claim
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_5-마무리" tabindex="-1"><a class="header-anchor" href="#_5-마무리" aria-hidden="true">#</a> 5. 마무리</h2>
<p>이번 글에서는 Kops 환경에서의 네트워크와 스토리지를 활용하는 방법을 정리해보았습니다.</p>
<p>일반적인 K8s와 달리 AWS 환경에서 EKS, Kops 등을 활용하게 된다면, AWS 리소스와의 연계를 통해 관리의 효율성과 편의성을 체감할 수 있었습니다.</p>
<p>다만, K8s만 알고 AWS는 잘 모르거나 또 그 반대의 상황에는 진입장벽이 있을 수 있겠다는 생각이 들었네요. 물론 이러한 부분만 해소된다면 관리형 쿠버네티스를 200% 활용할 수 있을 것 같습니다.</p>
<p>다음시간에는 GitOps와 관련된 주제로 찾아올 예정입니다.</p>
</div></template>


