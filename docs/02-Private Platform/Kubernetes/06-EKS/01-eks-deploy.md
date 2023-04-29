# AEWS 1주차 - Amzaon EKS 설치 및 기본 사용

이번에 연재할 스터디는 AWS EKS Workshop Study (=AEWS)이다. AWS에서 공식적으로 제공되는 다양한 HOL 기반의 Workshop과 가시다님의 팀에서 2차 가공한 컨텐츠를 기반으로 진행한다.

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/751VTo.jpg)

필자는 기본적인 스터디내용을 이번 시리즈에 연재할 예정이며, 추가적으로 HashiCorp의 Consul, Vault 등을 샘플로 배포하며 연동하는 내용을 조금씩 다뤄볼 예정이다.

## AWS Workshop - EKS 관련

> 참고 : AWS EKS 관련 핸즈온 워크샵을 해볼 수 있는 다양한 링크 모음이다.

- [AWS] EKS Workshop - [링크](https://www.eksworkshop.com/) / Github - [링크](https://github.com/aws-samples/eks-workshop-v2) / Blog - [링크](https://aws.amazon.com/ko/blogs/containers/introducing-the-amazon-eks-workshop/) / Youtube - [링크](https://www.youtube.com/@ContainersfromtheCouch) [Streams](https://www.youtube.com/@ContainersfromtheCouch/streams)
- [한글] EKS 웹 앱 구축 - [링크](https://catalog.us-east-1.prod.workshops.aws/workshops/9c0aa9ab-90a9-44a6-abe1-8dff360ae428/ko-KR) / (Old) Amazon EKS 워크샵 - [링크](https://awskrug.github.io/eks-workshop/)
- [한글/whchoi98] EKS Hands On LAB - [링크](https://awskocaptain.gitbook.io/aws-builders-eks/)
- [AWS] EKS Terraform Workshop - [링크](https://tf-eks-workshop.workshop.aws/) / Youtube - [링크](https://www.youtube.com/live/TXa-y-Uwh2w?feature=share)
- [AWS] EKS Best Practices Guides - [링크](https://aws.github.io/aws-eks-best-practices/)
- [AWS workshop studio] Running batch workloads on Amazon EKS with AWS Batch - [링크](https://catalog.us-east-1.prod.workshops.aws/workshops/b67b6665-f7a2-427f-affb-caccd087d50d/en-US)
- [AWS workshop studio] Manage your EKS cluster in Full-stack with CDK - [링크](https://catalog.us-east-1.prod.workshops.aws/workshops/c15012ac-d05d-46b1-8a4a-205e7c9d93c9/en-US)
- [AWS workshop studio] One Observability Workshop - [링크](https://catalog.workshops.aws/observability/en-US)
- [AWS workshop studio] Web Application Hosts on EKS Workshop - [링크](https://catalog.us-east-1.prod.workshops.aws/workshops/a1101fcc-c7cf-4dd5-98c4-f599a65056d5/en-US)
- [한글/AWS workshop studio] AWS General Immersion Day - [링크](https://catalog.workshops.aws/general-immersionday/ko-KR)
- [한글/whchoi98] AWS IAM Hands On LAB - [링크](https://whchoi98.gitbook.io/aws-iam/)

>  ~~여담이지만, HashiCorp 솔루션에 대한 다양한 HOL Workshop 실습도 사용자들이 많이 만들고 기여할 수 있도록 플랫폼을 오픈하면 좋을 것 같다.~~

## Amazon EKS 소개

![img](https://static.us-east-1.prod.workshops.aws/public/e7ab9b91-502d-4ada-84e2-5c8b92d8f791/static/images/10-intro/eks_architecture.svg)

Amazon **E**lastic **K**ubernetes Service는 자체 Kubernetes 컨트롤 플레인 또는 노드를 설치, 운영 및 유지 관리할 필요 없이 Kubernetes 실행에 사용할 수 있는 관리형 서비스이다.

EKS를 사용하는 다양한 이유가 있겠지만 대표적으로 여러 AWS 서비스와 통합할 수 있다는 장점이 크다.

- 컨테이너 이미지 저장소 Amazon ECR
- 로드 분산을 위한 ELB
- 고가용성 스토리지 서비스를 위한 EBS/EFS
- 인증 IAM
- 격리를 위한 Amazon VPC

다만 단점(?)이라고 할 수 있는 부분은 지원 버전이  보통 4개의 마이너 버전 지원(현재 1.22~1.26), 평균 3개월마다 새 버전 제공, 각 버전은 12개월 정도 지원한다는 것이다. [링크](https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html) 

이 부분이 단점이라고 이야기하는 이유는 실제 서비스를 운영하보면 EKS 클러스터 업그레이드를 하기위한 운영조직 체계가 갖춰져 있지 않은 상황에서 강제로 EKS 구버전에 대한 업그레이드를 해야하는 상황을 직면할 수 있기 때문이다.

물론, 보안, 서비스 지원 등 다양한 이유로 인해 클러스터 업그레이드는 불가피하지만 때때로 업그레이드를 강제해야하는 것은 특정 서비스를 운영하는 조직에게는 큰 걸림돌이 될 수 있다.

기회가 된다면 이번 스터디중에 EKS 업그레이드로 인한 어려움을 겪었던 사례를 발표해보려 한다.

> 참고 : EKS 업데이트 캘린더 : https://endoflife.date/amazon-eks

## Amazon EKS 클러스터 구성 방안

EKS 클러스터는 다음과 같은 방식으로 배포할 수 있다.

- 웹 관리 콘솔
- **eksctl**
- 기타(CDK, CloudFormation, Terraform 등)

이번 EKS 스터디 시리즈에서는  `eksctl` 을 활용한 배포방식을 활용할 예정이다. 

> eksctl : EKS 클러스터 구축 및 관리를 하기 위한 오프소스 명령줄 도구 - [링크](https://eksctl.io/)

![img](https://eksctl.io/img/eksctl.png)



## 실습환경 구성

실습환경은 외부에서 접근 가능한 Bastion 역할을 하는 EC2와  퍼블릭 서브넷 2개에 워커노드 두 대를 구성한다. 

> 참고 : 실습환경 변경 챕터에서 노드를 3대로 증설예정

- 실습환경 아키텍처(출처:가시다님 스터디)

<img src="https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/2DsILw.jpg" alt="img" style="zoom: 33%;" />



- Cloudformantion을 통한 Bastion 노드 배포

간단하게 VPC, Security Group, EC2 등을 구성하는 CF 코드를 통해 사전 환경을 구성한다.

```bash
aws cloudformation deploy --template-file myeks-1week.yaml \
     --stack-name myeks --parameter-overrides KeyName=hw-key SgIngressSshCidr=$(curl -s ipinfo.io/ip)/32 --region ap-northeast-2

Waiting for changeset to be created..
Waiting for stack create/update to complete
Successfully created/updated stack - myeks

# Public IP 확인
aws cloudformation describe-stacks --stack-name myeks --query 'Stacks[*].Outputs[*].OutputValue' --output text
13.124.14.182

# ec2 에 SSH 접속
ssh -i ~/.ssh/id_rsa ec2-user@$(aws cloudformation describe-stacks --stack-name myeks --query 'Stacks[*].Outputs[0].OutputValue' --output text)
```



- VPC 구성 확인

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/6ulJkf.jpg)

필자의 경우에는 AWS IAM 계정 정책에 대한 제약사항이 있어,  `aws configure` 명령등으로 `access_key`, `secret_key` 설정을 하지않고 EC2 인스턴스에 admin 권한을 부여하여 사용하였다.

- Cloudformation 으로 배포한 myeks-host인스턴스에 `eks-admin` 이라고하는 admin 권한의 역할을 생성 후 부여

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/eObYCj.jpg)



- 환경변수 설정  및 EKS 클러스터 배포

```bash
# EKS 배포할 VPC 정보 확인
export VPCID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=$CLUSTER_NAME-VPC" | jq -r .Vpcs[].VpcId)
echo "export VPCID=$VPCID" >> /etc/profile
echo VPCID

## 퍼블릭 서브넷 ID 확인
export PubSubnet1=$(aws ec2 describe-subnets --filters Name=tag:Name,Values="$CLUSTER_NAME-PublicSubnet1" --query "Subnets[0].[SubnetId]" --output text)
export PubSubnet2=$(aws ec2 describe-subnets --filters Name=tag:Name,Values="$CLUSTER_NAME-PublicSubnet2" --query "Subnets[0].[SubnetId]" --output text)
echo "export PubSubnet1=$PubSubnet1" >> /etc/profile
echo "export PubSubnet2=$PubSubnet2" >> /etc/profile
echo $PubSubnet1
echo $PubSubnet2

# EKS 클러스터 배포
eksctl create cluster --name $CLUSTER_NAME --region=$AWS_DEFAULT_REGION --nodegroup-name=$CLUSTER_NAME-nodegroup --node-type=t3.medium --node-volume-size=30 --vpc-public-subnets "$PubSubnet1,$PubSubnet2" --version 1.24 --ssh-access --external-dns-access --verbose 4
```

EKS 클러스터를 명령형으로 배포하지 않고 YAML로 작성하여 언언적으로 배포하는 것도 가능하다. 다음은 앞서 실행한 `eksctl create cluster` 명령의 ` --dry-run` 옵션을 통해 추출한 명세이다. 

- myeks-sample.yaml

```yaml
apiVersion: eksctl.io/v1alpha5
cloudWatch:
  clusterLogging: {}
iam:
  vpcResourceControllerPolicy: true
  withOIDC: false
kind: ClusterConfig
kubernetesNetworkConfig:
  ipFamily: IPv4
managedNodeGroups:
- amiFamily: AmazonLinux2
  desiredCapacity: 2
  disableIMDSv1: false
  disablePodIMDS: false
  iam:
    withAddonPolicies:
      albIngress: false
      appMesh: false
      appMeshPreview: false
      autoScaler: false
      awsLoadBalancerController: false
      certManager: false
      cloudWatch: false
      ebs: false
      efs: false
      externalDNS: true
      fsx: false
      imageBuilder: false
      xRay: false
  instanceSelector: {}
  instanceType: t3.medium
  labels:
    alpha.eksctl.io/cluster-name: myeks
    alpha.eksctl.io/nodegroup-name: myeks-nodegroup
  maxSize: 2
  minSize: 2
  name: myeks-nodegroup
  privateNetworking: false
  releaseVersion: ""
  securityGroups:
    withLocal: null
    withShared: null
  ssh:
    allow: true
    publicKeyPath: ~/.ssh/id_rsa.pub
  tags:
    alpha.eksctl.io/nodegroup-name: myeks-nodegroup
    alpha.eksctl.io/nodegroup-type: managed
  volumeIOPS: 3000
  volumeSize: 30
  volumeThroughput: 125
  volumeType: gp3
metadata:
  name: myeks
  region: ap-northeast-2
  version: "1.24"
privateCluster:
  enabled: false
  skipEndpointCreation: false
vpc:
  autoAllocateIPv6: false
  cidr: 192.168.0.0/16
  clusterEndpoints:
    privateAccess: false
    publicAccess: true
  id: vpc-0521fc003559b2f2c
  manageSharedNodeSecurityGroupRules: true
  nat:
    gateway: Disable
  subnets:
    public:
      ap-northeast-2a:
        az: ap-northeast-2a
        cidr: 192.168.1.0/24
        id: subnet-0fdff27653277aaf0
      ap-northeast-2c:
        az: ap-northeast-2c
        cidr: 192.168.2.0/24
        id: subnet-084a8752d4c7ddf6c
```



- EKS 클러스터 배포 확인

정상적으로 클러스터가 구성된 것을 확인할 수 있다.

```bash
# eks클러스터 확인
eksctl get cluster
NAME	REGION		EKSCTL CREATED
myeks	ap-northeast-2	True

# 노드확인
kubectl get node -v=6
I0423 22:10:48.050969    2339 loader.go:374] Config loaded from file:  /root/.kube/config

I0423 22:10:48.880262    2339 round_trippers.go:553] GET https://6E205513BA73EEBC3CA693BADEEC5294.gr7.ap-northeast-2.eks.amazonaws.com/api/v1/nodes?limit=500 200 OK in 819 milliseconds
NAME                                               STATUS   ROLES    AGE   VERSION
ip-192-168-1-139.ap-northeast-2.compute.internal   Ready    <none>   61m   v1.24.11-eks-a59e1f0
ip-192-168-2-225.ap-northeast-2.compute.internal   Ready    <none>   61m   v1.24.11-eks-a59e1f0

# 파드확인
k get pods -A
NAMESPACE     NAME                      READY   STATUS    RESTARTS   AGE
kube-system   aws-node-2bpxr            1/1     Running   0          62m
kube-system   aws-node-s7p5b            1/1     Running   0          62m
kube-system   coredns-dc4979556-knkkh   1/1     Running   0          68m
kube-system   coredns-dc4979556-m789b   1/1     Running   0          68m
kube-system   kube-proxy-lkp8f          1/1     Running   0          62m
kube-system   kube-proxy-z6hbk          1/1     Running   0          62m
```



> 참고 : `eksctl` 명령 예제

```bash
# eksctl help
eksctl
eksctl create
eksctl create cluster --help
eksctl create nodegroup --help
```



## 실습환경 변경

앞선 과정을 통해 실습을 위한 클러스터 구성이 완성되었다. 필자는 향후 샘플 애플리케이션으로 Vault, Consul 등을 배포할 예정이다. 때문에, 최소 3대 이상의 노드가 필요하여 기본 실습 노드를 3대로 구성한다.

EKS는 `nodegraup` 개수의 최소/최대 개수를 선언적으로 관리할 수 있다. 다음은 노드 개수를 변경/확인 하는 방법이다.

```bash
# eks 노드 그룹 정보 확인
eksctl get nodegroup --cluster $CLUSTER_NAME --name $CLUSTER_NAME-nodegroup
CLUSTER	NODEGROUP	STATUS		CREATED			MIN SIZE	MAX SIZE	DESIRED CAPACITY	INSTANCE TYPE	IMAGE ID	ASG NAME							TYPE
myeks	myeks-nodegroup	UPDATING	2023-04-23T12:07:57Z	2		2		2			t3.medium	AL2_x86_64	eks-myeks-nodegroup-fcc3d701-b90a-9c83-7907-fca8459770b9	managed

# 노드 2개 → 3개 증가
eksctl scale nodegroup --cluster $CLUSTER_NAME --name $CLUSTER_NAME-nodegroup --nodes 3 --nodes-min 3 --nodes-max 6

# 노드 그룹 변경 확인
eksctl get nodegroup --cluster myeks --region ap-northeast-2 --name myeks-nodegroup
CLUSTER	NODEGROUP	STATUS		CREATED			MIN SIZE	MAX SIZE	DESIRED CAPACITY	INSTANCE TYPE	IMAGE ID	ASG NAME							TYPE
myeks	myeks-nodegroup	UPDATING	2023-04-23T12:07:57Z	3		6		3			t3.medium	AL2_x86_64	eks-myeks-nodegroup-fcc3d701-b90a-9c83-7907-fca8459770b9	managed

# 노드 확인
kubectl get nodes -o wide

NAME                                               STATUS   ROLES    AGE    VERSION                INTERNAL-IP     EXTERNAL-IP      OS-IMAGE         KERNEL-VERSION                  CONTAINER-RUNTIME
ip-192-168-1-139.ap-northeast-2.compute.internal   Ready    <none>   150m   v1.24.11-eks-a59e1f0   192.168.1.139   43.201.51.34     Amazon Linux 2   5.10.176-157.645.amzn2.x86_64   containerd://1.6.19
ip-192-168-1-76.ap-northeast-2.compute.internal    Ready    <none>   53s    v1.24.11-eks-a59e1f0   192.168.1.76    13.124.158.208   Amazon Linux 2   5.10.176-157.645.amzn2.x86_64   containerd://1.6.19
ip-192-168-2-225.ap-northeast-2.compute.internal   Ready    <none>   150m   v1.24.11-eks-a59e1f0   192.168.2.225   52.79.236.227    Amazon Linux 2   5.10.176-157.645.amzn2.x86_64   containerd://1.6.19

kubectl get nodes -l eks.amazonaws.com/nodegroup=$CLUSTER_NAME-nodegroup
NAME                                               STATUS   ROLES    AGE    VERSION
ip-192-168-1-139.ap-northeast-2.compute.internal   Ready    <none>   150m   v1.24.11-eks-a59e1f0
ip-192-168-1-76.ap-northeast-2.compute.internal    Ready    <none>   74s    v1.24.11-eks-a59e1f0
ip-192-168-2-225.ap-northeast-2.compute.internal   Ready    <none>   150m   v1.24.11-eks-a59e1f0
```



## 샘플 애플리케이션 배포

필자는 본 글을 작성하던 시기에 고객사 환경에 ArgoCD + Helm을 기반으로 Consul Cluster 구성 테스트 요청이 있어 해당 클러스터를 활용해 보았다.

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/helm_argo.png)

### ArgoCD 배포

> 참고 : PKOS 2기에 사용한 ArgoCD 배포 가이드를 참고하여 배포한다.

- argocd-application-controller : 실행 중인 k8s 애플리케이션의 설정과 깃 저장소의 소스 파일에 선언된 상태를 서로 비교하는 컨트롤러. 상태와 다르면 `OutOfSync` 에러를 출력.
- argocd-dex-server : 외부 사용자의 LDAP 인증에 Dex 서버를 사용할 수 있음
- argocd-repo-server : 원격 깃 저장소의 소스 코드를 아르고시디 내부 캐시 서버에 저장합니다. 디렉토리 경로, 소스, 헬름 차트 등이 저장.

```bash
# 네임스페이스 생성
kubectl create ns argocd

# argocd-helm 설치
cd
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
helm install argocd argo/argo-cd --set server.service.type=LoadBalancer --namespace argocd --version 5.19.14

# 확인
helm list -n argocd
kubectl get pod,pvc,svc,deploy,sts -n argocd
kubectl get-all -n argocd

kubectl get crd | grep argoproj
applications.argoproj.io              2023-03-19T11:39:26Z
applicationsets.argoproj.io           2023-03-19T11:39:26Z
appprojects.argoproj.io               2023-03-19T11:39:26Z

# admin 계정의 암호 확인
ARGOPW=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
echo $ARGOPW
mf8bOtNEq7iHMqq1

# 웹 접속 로그인 (admin) CLB의 hostname으로 접속
k get svc -n argocd argocd-server -o jsonpath='{.status.loadBalancer.ingress[].hostname}'
```

- ArgoCD Web UI 화면

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/T5kZFT.jpg)

### GitHub 저장소 준비

> 필자는 개인 GitHub에 [개인 퍼블릭 저장소](https://github.com/chosam2/gitops)를 만들어서 실습을 진행하였다.

사전에 로컬에서 다운로드 받은 Consul Helm Chart 파일에 새로 재정의 할 values 파일을 GitHub 저장소에 업로드 한다.

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/aY0au9.jpg)

- override-values.yaml

> 참고 : 다음은 실제 작성된 Values 파일이다. 각 항목에 대한 상세한 설명은 향후 **Consul Deploy on K8s** 가이드를 작성해서 업로드 예정이다.

```yaml
client:
  grpc: true
connectInject:
  consulNamespaces:
    mirroringK8S: true
  enabled: true
controller:
  enabled: true
global:
  acls:
    manageSystemACLs: true
  enableConsulNamespaces: true
  enterpriseLicense:
    secretKey: key
    secretName: license
  gossipEncryption:
    autoGenerate: true
  image: hashicorp/consul-enterprise:1.13.7-ent
  imageEnvoy: envoyproxy/envoy:v1.22.5
  imageK8S: hashicorp/consul-k8s-control-plane:0.49.5
  metrics:
    enabled: false
  tls:
    enableAutoEncrypt: true
    enabled: true
    httpsOnly: false
    verify: false
ingressGateways:
  defaults:
    replicas: 1
    service:
      type: LoadBalancer
  enabled: true
  gateways:
  - name: ingress-gateway
meshGateway:
  enabled: false
  replicas: 1
  service:
    enabled: true
    nodePort: 32000
    type: NodePort
server:
  replicas: 3
terminatingGateways:
  defaults:
    replicas: 1
  enabled: false
ui:
  enabled: true
  service:
    port:
      http: 80
      https: 443
    type: LoadBalance
```

### ArgoCD + GitHub 연동

ArgoCD CLI를 통해 필자의 GitHub을 연동한다

```bash
argocd login <argocd 주소> --username admin --password $ARGOPW
...
'admin:login' logged in successfully

argocd repo add https://github.com/<깃헙 계정명>/<레파지토리명> --username <깃헙 계정명> --password <깃헙 계정 암호>
 
argocd repo list
TYPE  NAME  REPO                                   INSECURE  OCI    LFS    CREDS  STATUS      MESSAGE  PROJECT
git         https://github.com/chosam2/gitops.git  false     false  false  true   Successful

# 기본적으로 아르고시디가 설치된 쿠버네티스 클러스터는 타깃 클러스터로 등록됨
argocd cluster list
SERVER                          NAME        VERSION  STATUS      MESSAGE  PROJECT
https://kubernetes.default.svc  in-cluster  1.24+    Successful
```



### ArgoCD Application 생성 및 배포

앞서 생성한 GitHub 저장소에 업로드한 consul helm values 파일을 통해 배포하기 위해 `Application` CRD를 생성 및 배포한다.

- `consul-helm-argo-application.yaml`

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: consul-helm
  namespace: argocd
  finalizers:
  - resources-finalizer.argocd.argoproj.io
spec:
  destination:
    namespace: consul
    server: https://kubernetes.default.svc
  project: default
  source:
    repoURL: https://github.com/chosam2/gitops.git
    path: argocd
    targetRevision: main
    helm:
      valueFiles:
      - override-values.yaml
  syncPolicy:
    syncOptions:
    - CreateNamespace=true
```

- Application CRD 배포

```bash
k apply -f consul-helm-argo-application.yaml
application.argoproj.io/consul-helm created
```

최초 배포 시 `OutOfSync` 상태로 배포되었지만, 동기화 버튼을 클릭하여 강제로 동기화해준 뒤 정상적으로 배포된 것을 확인할 수 있다.
다만, 최초 `OutOfSync` 상태로 배포되는 부분에 대해서는 Application YAML 작성 시 옵션을 통해 해결이 가능하지만, 실제 운영시 영향도 체크가 필요해 보인다. 이 부분은 다음 블로깅시에 조금 더 테스트 및 확인해볼 예정이다.

- 최초 구성 후 OutOfSync 상태

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/argo_%E1%84%80%E1%85%AE%E1%84%8C%E1%85%A9.png)

- 강제 동기화 이후 Sync 된 화면

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/argo_%E1%84%80%E1%85%AE%E1%84%8C%E1%85%A92.png)

- 실제 배포된 Consul UI 화면

![img](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/ejor4D.jpg)

## 마무리

1주차 스터디는 EKS에 대한 전반적인 컨셉과 기본적으로 클러스터를 구성하고 Consul Cluster를 간단하게 배포해보았다. 다음주에는 네트워킹을 주제로 찾아올 예정이다.
