---
description: AWS Kops 설치 및 기본 사용
tag: ["Kubernetes", "Kops", "EKS", "PKOS"]
---

# [PKOS]  1편 - AWS Kops 설치 및 기본 사용 

>  💡 본 글은 PKOS(Production Kubernetes Online Study) 2기 스터디의 일부로 작성된 내용입니다. 
>  실제 Production Kubernetes 환경에서 활용 가능한 다양한 정보를 전달하기 위한 시리즈로 작성 예정입니다.


## 1. 실습환경 사전준비

본 스터디는 AWS 환경에서 Kops(Kubernetes Operations)를 활용한 실습으로 진행할 예정입니다.

> 📌 참고 : 필자는 개인적인 이유로 Route 53 계정과, kOps 클러스터 운영 계정을 나눠서 진행합니다. 
> 하나의 계정에서 실습을 진행할 경우에는 사전 환경구성이 다를 수 있는 점 참고 부탁드립니다.

### 1) Route 53 도메인 구매

AWS의 DNS 웹 서비스인 [Route 53](https://docs.aws.amazon.com/ko_kr/Route53/latest/DeveloperGuide/Welcome.html)을 통해 도메인을 구입합니다.
필자는  `hyungwook.link` 도메인을 구입하였으며, 초기 구입 후  `상태: 도메인 등록 진행 중` 인 화면을 확인할 수 있습니다,

![image-20230305211458121](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/1_route53.png)



구입 시 등록했던 이메일 계정으로 발송된 verify 메일 링크를 클릭하여 활성화 합니다.

#### (1) Route53 Verify mail

![image-20230305211833451](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/2_route53.png)

일정시간이 지나면 정상적으로 도메인이 활성화 되된 것을 확인할 수 있습니다.

#### (2) 도메인 등록완료 화면

![image-20230305212617366](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/3_route53.png)

- 등록된 도메인 확인

```bash
# 자신의 도메인에 NS 타입 조회
# dig ns <구입한 자신의 도메인> +short
dig ns hyungwook.link +short
ns-939.awsdns-53.net.
ns-1575.awsdns-04.co.uk.
ns-233.awsdns-29.com.
ns-1466.awsdns-55.org.
```

### 2) Route 53 등록

필자는 서두에서 언급한 것 처럼 **Route 53 구매한 계정**과, **kOps 클러스터를 생성할 계정**이 다르므로 다음과 같은 과정을 추가적으로 수행하였습니다.

#### (1) Kops 클러스터를 생성할 계정 : `pkos.hyungwook.link` 레코드를 생성

#### (2) Route 53을 구매한 AWS 계정 : NS 레코드 등록

- Kops 클러스터를 생성할 계정에서 등록한 레코드를 정보를 Route 53 구매 계정의 NS 레코드에 등록합니다.

![image-20230305223503518](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/4_route53_서브도메인등록.png)

> 📌 참고 : [How to manage Route53 hosted zones in a multi-account environment](https://theburningmonk.com/2021/05/how-to-manage-route53-hosted-zones-in-a-multi-account-environment/)

---

## 2. Kops 클러스터 배포 전 사전준비

이제 실습에서 사용할 도메인 준비가 완료되었으므로, Kops 클러스터 생성을 위한 준비 단계로 넘어갑니다.

### 1) AWS Credentials 설정

```bash
# IAM User 자격 구성 : 실습 편리를 위해 administrator 권한을 가진 IAM User 의 자격 증명 입력
aws configure
```

### 2) S3 버킷 생성

```bash
# k8s 설정 파일이 저장될 버킷 생성
## aws s3 mb s3://버킷<유일한 이름> --region <S3 배포될 AWS 리전>
aws s3 mb s3://버킷<유일한 이름> --region $REGION
aws s3 ls

## 예시)
aws s3 mb s3://hyungwook-k8s-s3 --region ap-northeast-2
```

## 3. 클러스터 배포

```bash
# 변수설정
export AWS_PAGER=""
export REGION=ap-northeast-2
export KOPS_CLUSTER_NAME=pkos.hyungwook.link
export KOPS_STATE_STORE=s3://hyungwook-k8s-s3
echo 'export AWS_PAGER=""' >>~/.bashrc
echo 'export REGION=ap-northeast-2' >>~/.bashrc
echo 'export KOPS_CLUSTER_NAME=pkos.hyungwook.link' >>~/.bashrc
echo 'export KOPS_STATE_STORE=s3://hyungwook-k8s-s3' >>~/.bashrc

# kops 설정 파일 생성(s3) 및 k8s 클러스터 배포 : 6분 정도 소요
## CNI는 aws vpc cni 사용, 마스터 노드 1대(t3.medium), 워커 노드 2대(t3.medium), 파드 사용 네트워크 대역 지정(172.30.0.0/16)
## --container-runtime containerd --kubernetes-version 1.24.0 ~ 1.25.6
kops create cluster --zones="$REGION"a,"$REGION"c --networking amazonvpc --cloud aws \
--master-size t3.medium --node-size t3.medium --node-count=2 --network-cidr 172.30.0.0/16 \
--ssh-public-key ~/.ssh/id_rsa.pub --name=$KOPS_CLUSTER_NAME --kubernetes-version "1.24.10" --dry-run -o yaml > mykops.yaml

kops create cluster --zones="$REGION"a,"$REGION"c --networking amazonvpc --cloud aws \
--master-size t3.medium --node-size t3.medium --node-count=2 --network-cidr 172.30.0.0/16 \
--ssh-public-key ~/.ssh/id_rsa.pub --name=$KOPS_CLUSTER_NAME --kubernetes-version "1.24.10" -y
```

### 1) kOps 클러스터 배포 시 Route 53  A 레코드 화면(등록중)

A 레코드값이 자동으로 추가된 모습을 확인할 수 있습니다. 하지만 실제 api 서버와 내부 controller의 IP 주소가 등록되지 않았기 때문에, 실제 클러스터가 정상적으로 구성된 이후에는 자동으로 A 레코드가 업데이트 됩니다.

![image-20230305223938653](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/5_route53_호스팅영영_등록중.png)



- A 레코드 조회 CLI 명령 : `aws route53` 

```bash
aws route53 list-resource-record-sets --hosted-zone-id "${MyDnzHostedZoneId}" --query "ResourceRecordSets[?Type == 'A'].Name" | jq

[
  "api.pkos.hyungwook.link.",
  "api.internal.pkos.hyungwook.link.",
  "kops-controller.internal.pkos.hyungwook.link."
]
```

이때, `kops validate` 명령으로 확인하면 아직까지 `api.pkos.hyungwook.link` 가 relov 되지 않는 것을 확인할 수 있습니다.

```bash
kops validate cluster --wait 10m
Validating cluster pkos.hyungwook.link

W0305 22:38:08.780600    4256 validate_cluster.go:184] (will retry): unexpected error during validation: unable to resolve Kubernetes cluster API URL dns: lookup api.pkos.hyungwook.link: no such host
W0305 22:38:18.788067    4256 validate_cluster.go:184] (will retry): unexpected error during validation: unable to resolve Kubernetes cluster API URL dns: lookup api.pkos.hyungwook.link: no such host
```

어느정도 시간이 지난 후 정상적으로 A 레코드 값이 변경된 것을 확인할 수 있습니다.

### 2) kOps 클러스터 배포 시 Route 53  A 레코드 화면(등록완료 )

![image-20230306000758876](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/6_route53_호스팅영영_등록완료.png)



- A 레코드 및 값 반복조회

```bash
# A 레코드 및 값 반복조회
while true; do aws route53 list-resource-record-sets --hosted-zone-id "${MyDnzHostedZoneId}" --query "ResourceRecordSets[?Type == 'A']" | jq ; date ; echo ; sleep 1; done
[
  {
    "Name": "api.pkos.hyungwook.link.",
    "Type": "A",
    "TTL": 60,
    "ResourceRecords": [
      {
        "Value": "43.201.33.161"
      }
    ]
  },
  {
    "Name": "api.internal.pkos.hyungwook.link.",
    "Type": "A",
    "TTL": 60,
    "ResourceRecords": [
      {
        "Value": "172.30.37.41"
      }
    ]
  },
  {
    "Name": "kops-controller.internal.pkos.hyungwook.link.",
    "Type": "A",
    "TTL": 60,
    "ResourceRecords": [
      {
        "Value": "172.30.37.41"
      }
    ]
  }
]
2023년 3월  5일 일요일 22시 41분 46초 KST
```

이제 정상적으로 A 레코드가 등록된 것을 확인할 수 있으며 설치가 자동으로 진행됩니다.

### 3) `kops validate cluster` 명령(생성확인)

실제 kops 클러스터가 정상적으로 배포된 것을 확인할 수 있습니다.

```json
kops validate cluster
Validating cluster pkos.hyungwook.link

INSTANCE GROUPS
NAME			ROLE	MACHINETYPE	MIN	MAX	SUBNETS
master-ap-northeast-2a	Master	t3.medium	1	1	ap-northeast-2a
nodes-ap-northeast-2a	Node	t3.medium	1	1	ap-northeast-2a
nodes-ap-northeast-2c	Node	t3.medium	1	1	ap-northeast-2c

NODE STATUS
NAME			ROLE	READY
i-089062ff9f50789ee	node	True
i-096a645be0dd932b6	node	True
i-0dce8997b4633b806	master	True

Your cluster pkos.hyungwook.link is ready
```



> 📌 참고 :  Kops 클러스터 `kubeconfig` 파일 업데이트 명령

```bash
# 권한이 없을 경우
kubectl get nodes -o wide
error: You must be logged in to the server (Unauthorized)

# kubeconfig 업데이트
kops export kubeconfig --name pkos.hyungwook.link --admin
```



## 4. 샘플 애플리케이션 배포

### 1) Service / Pod with CLB : Mario 게임

- Deployment, SVC 배포

```yaml
# 수퍼마리오 디플로이먼트 배포
curl -s -O https://raw.githubusercontent.com/gasida/PKOS/main/1/mario.yaml
kubectl apply -f mario.yaml
cat mario.yaml | yh
deployment.apps/mario created
service/mario created
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mario
  labels:
    app: mario
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mario
  template:
    metadata:
      labels:
        app: mario
    spec:
      containers:
      - name: mario
        image: pengbai/docker-supermario
---
apiVersion: v1
kind: Service
metadata:
   name: mario
spec:
  selector:
    app: mario
  ports:
  - port: 80
    protocol: TCP
    targetPort: 8080
  type: LoadBalancer
```



- Deploy, SVC, EP 확인

```bash
# 배포 확인 : CLB 배포 확인 >> 5분 이상 소요
kubectl get deploy,svc,ep mario
watch kubectl get svc mario

# Watch 명령 실행 후 <pending>
Every 2.0s: kubectl get svc mario                                                                                                     hyungwook-Q9W5QX7FGY: Sat Mar 11 21:50:41 2023
NAME    TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)        AGE
mario   LoadBalancer   100.67.138.178   <pending>     80:30624/TCP   92s

# External-IP 할당
kubectl get svc mario
NAME    TYPE           CLUSTER-IP       EXTERNAL-IP                                                                   PORT(S)        AGE
mario   LoadBalancer   100.67.138.178   a643cc3e6e2c54ed8989c95d0481f48c-113657418.ap-northeast-2.elb.amazonaws.com   80:30624/TCP   3m7s
```



- CLB로 접속 

```bash
# 마리오 게임 접속 : CLB 주소로 웹 접속
kubectl get svc mario -o jsonpath="{.status.loadBalancer.ingress[0].hostname}" | awk '{ print "Maria URL = http://"$1 }'

# 결과 값
Maria URL = http://a643cc3e6e2c54ed8989c95d0481f48c-113657418.ap-northeast-2.elb.amazonaws.com
```



- 마리오 게임 화면

![image-20230311215543207](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/9_CLA_마리오게임_접속.png)


## 5. (추가) External DNS

External DNS은 K8s Service / Ingress 생성 시 도메인을 설정하면 자동으로 AWS Route53의 A 레코드(TXT  레코드)에 자동 생성/삭제를 제공합니다.

- 이미지 참고 [링크](https://edgehog.blog/a-self-hosted-external-dns-resolver-for-kubernetes-111a27d6fc2c)

![img](https://miro.medium.com/v2/resize:fit:1400/0*HoU4pgcDE10AVTAu.png)

### 1) External DNS - Addon 설치



```bash
# 정책 생성 -> 마스터/워커노드에 정책 연결
curl -s -O https://s3.ap-northeast-2.amazonaws.com/cloudformation.cloudneta.net/AKOS/externaldns/externaldns-aws-r53-policy.json
aws iam create-policy --policy-name AllowExternalDNSUpdates --policy-document file://externaldns-aws-r53-policy.json

# ACCOUNT_ID 변수 지정
export ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)

# EC2 instance profiles 에 IAM Policy 추가(attach)
aws iam attach-role-policy --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/AllowExternalDNSUpdates --role-name masters.$KOPS_CLUSTER_NAME
aws iam attach-role-policy --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/AllowExternalDNSUpdates --role-name nodes.$KOPS_CLUSTER_NAME

# 설치
kops edit cluster
--------------------------
spec:
  certManager:    # 없어도됨!
    enabled: true # 없어도됨!
  externalDns:
    provider: external-dns
--------------------------

# 업데이트 적용
kops update cluster --yes && echo && sleep 3 && kops rolling-update cluster

# externalDns 컨트롤러 파드 확인
kubectl get pod -n kube-system -l k8s-app=external-dns
NAME                          READY   STATUS    RESTARTS   AGE
external-dns-5bc8fcf8-7vznp   1/1     Running   0          14s
```



### 2) Mario 서비스에 도메인 연결

```bash
# CLB에 ExternanDNS 로 도메인 연결
kubectl annotate service mario "external-dns.alpha.kubernetes.io/hostname=mario.$KOPS_CLUSTER_NAME"
```



#### (1) Route 53 A 레코드 등록 확인

![Mario 도메인](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/ukvLhO.jpg)



#### (2) 등록된 A 레코드에 대한 도메인 체크

- 사이트를 통한 확인 - [참고](https://www.whatsmydns.net/)

![도메인 체크](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/jGLPD7.jpg)

- 명령을 통한 확인

```bash
# external-dns 등록로그 확인
kubectl logs -n kube-system -l k8s-app=external-dns

time="2023-03-11T14:54:51Z" level=info msg="Applying provider record filter for domains: [pkos.hyungwook.link. .pkos.hyungwook.link.]"
time="2023-03-11T14:54:51Z" level=info msg="All records are already up to date"
...(생략)

# 확인
dig +short mario.$KOPS_CLUSTER_NAME

# 웹 접속 주소 확인 및 접속
echo -e "Maria Game URL = http://mario.$KOPS_CLUSTER_NAME"

# 도메인 체크
echo -e "My Domain Checker = https://www.whatsmydns.net/#A/mario.$KOPS_CLUSTER_NAME"
```


## 6. 마무리

### 1) 리소스 삭제

- 마리오 리소스 삭제

```bash
kubectl delete deploy,svc mario
```



- Kops 클러스터 삭제

```bash
kops delete cluster --yes
```


본 편에서는 Kops 클러스터를 구성방안 및 External DNS를 연동한 외부 서비스 노출에 대한 방법을 살펴보았습니다.

다음편에서는 네트워크 및 스토리지에 대한 활용방안을 살펴보겠습니다. 