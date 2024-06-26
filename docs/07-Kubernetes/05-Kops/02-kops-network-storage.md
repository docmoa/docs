---
description: AWS Kops 설치 및 기본 사용
tag: ["Kubernetes", "Kops", "EKS", "PKOS"]
---

# [PKOS] 2편 - 네트워크 & 스토리지

지난 1주차 스터디에이어 2주차 스터디를 진행하였습니다. 이번 스터디에서는 "쿠버네티스 네트워크" 및 "쿠버네티스 스토리지"를 중심으로 학습하였습니다.

>  참고 :
>  원활한 실습을 위해 인스턴스 타입을 변경한 후 진행합니다.



## 0. 사전준비


### 1) Kops 클러스터의 인스턴 그룹 변경

```bash
kops get ig
NAME			ROLE	MACHINETYPE	MIN	MAX	ZONES
master-ap-northeast-2a	Master	t3.medium	1	1	ap-northeast-2a
nodes-ap-northeast-2a	Node	t3.medium	1	1	ap-northeast-2a
nodes-ap-northeast-2c	Node	t3.medium	1	1	ap-northeast-2c
```



```yaml
kops edit ig master-ap-northeast-2a

# 예제화면
apiVersion: kops.k8s.io/v1alpha2
kind: InstanceGroup
metadata:
  creationTimestamp: "2023-03-05T13:37:26Z"
  labels:
    kops.k8s.io/cluster: pkos.hyungwook.link
  name: master-ap-northeast-2a
spec:
  image: 099720109477/ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-20230112
  instanceMetadata:
    httpPutResponseHopLimit: 3
    httpTokens: required
  machineType: t3.medium #기존 t3.medium에서 c5d.large로 변경
  maxSize: 1
  minSize: 1
  role: Master
  subnets:
  - ap-northeast-2a
```

- 확인

```bash
kops get ig
NAME			ROLE	MACHINETYPE	MIN	MAX	ZONES
master-ap-northeast-2a	Master	c5d.large	1	1	ap-northeast-2a
nodes-ap-northeast-2a	Node	c5d.large	1	1	ap-northeast-2a
nodes-ap-northeast-2c	Node	c5d.large	1	1	ap-northeast-2c
```

- Cluster Update 수행

```bash
kops update cluster --name pkos.hyungwook.link --yes

kops rolling-update cluster --yes
```



---



## 2. NLB



### 1) NLB Mode 정리

#### (1) 인스턴스 유형

1. `externalTrafficPolicy` : ClusterIP ⇒ 2번 분산 및 SNAT으로 Client IP 확인 불가능 ← `LoadBalancer` 타입 (기본 모드) 동작
2. `externalTrafficPolicy` : Local ⇒ 1번 분산 및 ClientIP 유지, 워커 노드의 iptables 사용함

- 이미지 출처 : PKOS 스터디 - 가시다님

![NLB 이미지1](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/IMeYr3.jpg)

![NLB 이미지2](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/rV5KOK.jpg)



#### (2) IP 유형 

>  반드시 AWS LoadBalancer 컨트롤러 파드 및 정책 설정이 필요함!

1. `Proxy Protocol v2 비활성화` ⇒ NLB에서 바로 파드로 인입, 단 ClientIP가 NLB로 SNAT 되어 Client IP 확인 불가능
2. `Proxy Protocol v2 활성화` ⇒ NLB에서 바로 파드로 인입 및 ClientIP 확인 가능(→ 단 PPv2 를 애플리케이션이 인지할 수 있게 설정 필요)



### 2) 서비스 배포

```bash
# 작업용 EC2 - 디플로이먼트 & 서비스 생성
cat ~/pkos/2/echo-service-nlb.yaml | yh
kubectl apply -f ~/pkos/2/echo-service-nlb.yaml

# 확인
kubectl get deploy,pod
kubectl get svc,ep,ingressclassparams,targetgroupbindings

NAME                      TYPE           CLUSTER-IP       EXTERNAL-IP                                                                         PORT(S)        AGE
service/kubernetes        ClusterIP      100.64.0.1       <none>                                                                              443/TCP        7d
service/svc-nlb-ip-type   LoadBalancer   100.64.191.200   k8s-default-svcnlbip-bfcad9371a-250be02681485d95.elb.ap-northeast-2.amazonaws.com   80:31206/TCP   97s

NAME                        ENDPOINTS                             AGE
endpoints/kubernetes        172.30.37.41:443                      7d
endpoints/svc-nlb-ip-type   172.30.55.31:8080,172.30.71.86:8080   97s

NAME                                   GROUP-NAME   SCHEME   IP-ADDRESS-TYPE   AGE
ingressclassparams.elbv2.k8s.aws/alb                                           122m

NAME                                                        SERVICE-NAME      SERVICE-PORT   TARGET-TYPE   AGE
targetgroupbinding.elbv2.k8s.aws/k8s-default-svcnlbip-c54bafee9a   svc-nlb-ip-type   80      ip            95s

kubectl get targetgroupbindings -o json | jq
```



- Listener 확인

![Listener](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/rZx1tE.jpg)



- Target Group 확인

![TargetGroup 확인](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/kQcEaN.jpg)

- 실제 Pod의 IP 정보 확인

```bash
k get pods -o wide
NAME               READY    STATUS   RESTARTS   AGE     IP         NODE        NOMINATED NODE   READINESS GATES
deploy-echo-(생략)   1/1     Running   0    7m50s   172.30.55.31   i-089062ff9f50789ee   <none>           <none>
deploy-echo-(생략)   1/1     Running   0    7m50s   172.30.71.86   i-096a645be0dd932b6   <none>           <none>
```





### 3) 접속확인

![접속확인](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/uVSCZA.jpg)





## 3. NLB에 TLS 적용하기(feat. ACM)

>  사전 준비 :
>  공인도메인 소유, AWS Route53 도메인등록 상태, NLB 가 위치한 리전(서울)의 인증서 요청/발급 완료상태, ExternalDNS 준비완료 상태

### 1) 환경구성

- ACM 인증서 및 ARN 확인

```bash
# 사용 리전의 인증서 ARN 확인
aws acm list-certificates
aws acm list-certificates --max-items 10
aws acm list-certificates --query 'CertificateSummaryList[].CertificateArn[]' --output text
CERT_ARN=`aws acm list-certificates --query 'CertificateSummaryList[].CertificateArn[]' --output text`
echo $CERT_ARN
```



- NLB와 ACM에서 사용할 도메인 등록

```bash
# 자신의 도메인 변수 지정
MyDomain=<자신의 도메인>
MyDomain=websrv.$KOPS_CLUSTER_NAME
```



### 2) 샘플 애플리케이션 배포

- Deploy, SVC YAML

```yaml
cat <<EOF | kubectl create -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deploy-echo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: deploy-websrv
  template:
    metadata:
      labels:
        app: deploy-websrv
    spec:
      terminationGracePeriodSeconds: 0
      containers:
      - name: akos-websrv
        image: k8s.gcr.io/echoserver:1.5
        ports:
        - containerPort: 8080
---
apiVersion: v1
kind: Service
metadata:
  name: svc-nlb-ip-type
  annotations:
    external-dns.alpha.kubernetes.io/hostname: "${MyDomain}"
    service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip
    service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
    service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: "8080"
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
    service.beta.kubernetes.io/aws-load-balancer-ssl-ports: "https"
    service.beta.kubernetes.io/aws-load-balancer-ssl-cert: ${CERT_ARN}
    service.beta.kubernetes.io/aws-load-balancer-backend-protocol: "http"
spec:
  ports:
    - port: 80
      targetPort: 8080
      protocol: TCP
      name: http
    - port: 443
      targetPort: 8080
      protocol: TCP
      name: https
  type: LoadBalancer
  loadBalancerClass: service.k8s.aws/nlb
  selector:
    app: deploy-websrv
EOF
```



- 생성된 SVC의 annotation 확인

```bash
kubectl describe svc svc-nlb-ip-type | grep Annotations: -A8

Annotations:              external-dns.alpha.kubernetes.io/hostname: websrv.pkos.hyungwook.link
                          service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
                          service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: true
                          service.beta.kubernetes.io/aws-load-balancer-healthcheck-port: 8080
                          service.beta.kubernetes.io/aws-load-balancer-nlb-target-type: ip
                          service.beta.kubernetes.io/aws-load-balancer-scheme: internet-facing
                          service.beta.kubernetes.io/aws-load-balancer-ssl-cert:
                            arn:aws:acm:ap-northeast-2:856117747411:certificate/208e809e-9ebf-4bb5-92c2-795868429e88
                          service.beta.kubernetes.io/aws-load-balancer-ssl-ports: https
```



### 3) 인증서 적용 확인



#### (1) CLI 확인

- `insecure` 옵션 없이 정상적으로 curl 응답 하는 것을 확인할 수 있습니다.

```bash
curl -s http://websrv.pkos.hyungwook.link | grep Hostname
Hostname: deploy-echo-5c4856dfd6-267pf

curl -s  https://websrv.pkos.hyungwook.link | grep Hostname
Hostname: deploy-echo-5c4856dfd6-k9277
```



#### (2) 웹 브라우저 확인

- **"이 연결은 안전합니다."** 메시지를 통해 실제 ACM 퍼블릭 인증서가 적용된 것을 확인할 수 있습니다.

![인증서 적용 확인](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/OPTdsH.jpg)



## 3. Ingress

클러스터 내부의 서비스(ClusterIP, NodePort, Loadbalancer)를 외부로 노출(HTTP/HTTPS) - Web Proxy 역할



![ingress](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/u5cdKs.jpg)

### 1) 환경구성

- AWS LoadBalancerControllerIAMPolicy 정책 생성 및 추가

```bash
# EC2 instance profiles 에 IAM Policy 추가(attach)
aws iam attach-role-policy --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy --role-name masters.$KOPS_CLUSTER_NAME
aws iam attach-role-policy --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy --role-name nodes.$KOPS_CLUSTER_NAME

# EC2 instance profiles 에 IAM Policy 추가(attach)
aws iam attach-role-policy --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy --role-name masters.$KOPS_CLUSTER_NAME
aws iam attach-role-policy --policy-arn arn:aws:iam::$ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy --role-name nodes.$KOPS_CLUSTER_NAME
```



- Kops 클러스터 ExternalDNS 및 certManager 설정 추가

```yaml
# kOps 클러스터 편집 : 아래 내용 추가
kops edit cluster
-----
spec:
  certManager:
    enabled: true
  awsLoadBalancerController:
    enabled: true
  externalDns:
    provider: external-dns
```

- 변경된 설정 업데이트 반영

```bash
# 업데이트 적용
kops update cluster --yes && echo && sleep 3 && kops rolling-update cluster
```



### 2) 서비스/파드 배포 테스트 with Ingress(ALB)\

- 서비스 배포

```bash
# 게임 파드와 Service, Ingress 배포
kubectl apply -f ~/pkos/3/ingress1.yaml
```



- 서비스 배포 후 Target Type이 IP로 생성된 것 확인

```bash
kubectl get targetgroupbindings -n game-2048
NAME                               SERVICE-NAME   SERVICE-PORT   TARGET-TYPE   AGE
k8s-game2048-service2-e48050abac   service-2048   80             ip            87s
```



- Ingress 정보 확인

```bash
kubectl describe ingress -n game-2048 ingress-2048

Name:             ingress-2048
Labels:           <none>
Namespace:        game-2048
Address:          k8s-game2048-ingress2-fdfe8009a9-1424012699.ap-northeast-2.elb.amazonaws.com
Ingress Class:    alb
Default backend:  <default>
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /   service-2048:80 (172.30.44.132:80,172.30.65.100:80)
Annotations:  alb.ingress.kubernetes.io/scheme: internet-facing
              alb.ingress.kubernetes.io/target-type: ip
Events:
  Type    Reason                  Age    From     Message
  ----    ------                  ----   ----     -------
  Normal  SuccessfullyReconciled  8m56s  ingress  Successfully reconciled
```



- ALB 접속 확인

```bash
# 게임 접속 : ALB 주소로 웹 접속
kubectl get ingress -n game-2048 ingress-2048 -o jsonpath="{.status.loadBalancer.ingress[0].hostname}" | awk '{ print "Game URL = http://"$1 }'
Game URL = http://k8s-game2048-ingress2-fdfe8009a9-1424012699.ap-northeast-2.elb.amazonaws.com
```



![게임화면](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/KTZTUM.jpg)



- 리소스 삭제

```bash
kubectl delete ingress ingress-2048 -n game-2048
kubectl delete svc service-2048 -n game-2048 && kubectl delete deploy deployment-2048 -n game-2048 && kubectl delete ns game-2048
```



## 4. 쿠버네티스 스토리지 : EBS

### 1) 환경구성



`c5d.large` 의 EC2 인스턴스 스토어(임시 블록 스토리지) 설정 작업 - [링크](https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/InstanceStorage.html) , NVMe SSD - [링크](https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/ssd-instance-store.html)

- 데이터 손실 : 기본 디스크 드라이브 오류, 인스턴스가 중지됨, 인스턴스가 최대 절전 모드로 전환됨, 인스턴스가 종료됨

![       Amazon EC2 인스턴스 스토리지     ](https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/images/instance_storage.png)

- 임시스토리지 실습을 위한 환경 구성

```bash
# 인스턴스 스토어 볼륨이 있는 c5 모든 타입의 스토리지 크기
aws ec2 describe-instance-types \
 --filters "Name=instance-type,Values=c5*" "Name=instance-storage-supported,Values=true" \
 --query "InstanceTypes[].[InstanceType, InstanceStorageInfo.TotalSizeInGB]" \
 --output table
--------------------------
|  DescribeInstanceTypes |
+---------------+--------+
|  c5d.large    |  50    |
|  c5d.12xlarge |  1800  |
...

# 워커 노드 Public IP 확인
aws ec2 describe-instances --query "Reservations[*].Instances[*].{PublicIPAdd:PublicIpAddress,InstanceName:Tags[?Key=='Name']|[0].Value}" --filters Name=instance-state-name,Values=running --output table

-------------------------------------------------------------------------
|                           DescribeInstances                           |
+------------------------------------------------------+----------------+
|                     InstanceName                     |  PublicIPAdd   |
+------------------------------------------------------+----------------+
|  nodes-ap-northeast-2c.pkos.hyungwook.link           |  13.209.75.228 |
|  master-ap-northeast-2a.masters.pkos.hyungwook.link  |  3.38.117.78   |
|  nodes-ap-northeast-2a.pkos.hyungwook.link           |  52.79.61.228  |
+------------------------------------------------------+----------------+

# 워커 노드 Public IP 변수 지정
W1PIP=<워커 노드 1 Public IP>
W2PIP=<워커 노드 2 Public IP>
W1PIP=13.209.75.228
W2PIP=52.79.61.228
echo "export W1PIP=$W1PIP" >> /etc/profile
echo "export W2PIP=$W2PIP" >> /etc/profile
```



- 워커 노드 스토리지 확인 : nvme 명령도구 설치 및 확인

```bash
ssh -i ~/.ssh/id_rsa ubuntu@$W1PIP sudo apt install -y nvme-cli
ssh -i ~/.ssh/id_rsa ubuntu@$W2PIP sudo apt install -y nvme-cli
ssh -i ~/.ssh/id_rsa ubuntu@$W1PIP sudo nvme list
ssh -i ~/.ssh/id_rsa ubuntu@$W2PIP sudo nvme list
```



![nvme_list](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/6iX9dg.jpg)



```bash
# 워커 노드 스토리지 확인 : NVMe SSD 인스턴스 스토어 볼륨 확인
ssh -i ~/.ssh/id_rsa ubuntu@$W1PIP lsblk -e 7
ssh -i ~/.ssh/id_rsa ubuntu@$W2PIP lsblk -e 7
NAME         MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
nvme1n1      259:0    0  46.6G  0 disk
nvme0n1      259:1    0   128G  0 disk
├─nvme0n1p1  259:2    0 127.9G  0 part /
├─nvme0n1p14 259:3    0     4M  0 part
└─nvme0n1p15 259:4    0   106M  0 part /boot/efi

ssh -i ~/.ssh/id_rsa ubuntu@$W1PIP df -hT -t ext4
ssh -i ~/.ssh/id_rsa ubuntu@$W2PIP df -hT -t ext4
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/root      ext4  124G  4.2G  120G   4% /

ssh -i ~/.ssh/id_rsa ubuntu@$W1PIP lspci | grep Non-Volatile
00:04.0 Non-Volatile memory controller: Amazon.com, Inc. Device 8061
00:1f.0 Non-Volatile memory controller: Amazon.com, Inc. NVMe SSD Controller

# 파일시스템 생성
ssh -i ~/.ssh/id_rsa ubuntu@$W1PIP sudo mkfs -t xfs /dev/nvme1n1
ssh -i ~/.ssh/id_rsa ubuntu@$W2PIP sudo mkfs -t xfs /dev/nvme1n1

# /data 디렉토리 생성 
ssh -i ~/.ssh/id_rsa ubuntu@$W1PIP sudo mkdir /data
ssh -i ~/.ssh/id_rsa ubuntu@$W2PIP sudo mkdir /data

# /data 마운트
ssh -i ~/.ssh/id_rsa ubuntu@$W1PIP sudo mount /dev/nvme1n1 /data
ssh -i ~/.ssh/id_rsa ubuntu@$W2PIP sudo mount /dev/nvme1n1 /data

# 파일시스템 포맷 및 마운트 확인
ssh -i ~/.ssh/id_rsa ubuntu@$W1PIP df -hT -t ext4 -t xfs
ssh -i ~/.ssh/id_rsa ubuntu@$W2PIP df -hT -t ext4 -t xfs
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/root      ext4  124G  4.2G  120G   4% /
/dev/nvme1n1   xfs    47G  365M   47G   1% /data
```



### 2) HostPath 실습



#### (1) HostPath스토리지 클래스 배포

- 호스트 Path 를 사용하는 PV/PVC : local-path-provisioner 스트리지 클래스 배포 - [링크](https://github.com/rancher/local-path-provisioner)

```bash
# 마스터노드의 이름 확인해두기
kubectl get node | grep control-plane | awk '{print $1}'
i-066cdb714fc6545c0

# 배포 : vim 직접 편집할것
curl -s -O https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.23/deploy/local-path-storage.yaml
vim local-path-storage.yaml
----------------------------
# 아래 빨간 부분은 추가 및 수정
apiVersion: apps/v1
kind: Deployment
metadata:
  name: local-path-provisioner
  namespace: local-path-storage
spec:
  replicas: 1
  selector:
    matchLabels:
      app: local-path-provisioner
  template:
    metadata:
      labels:
        app: local-path-provisioner
    spec:
      nodeSelector:
        kubernetes.io/hostname: "<각자 자신의 마스터 노드 이름 입력>"
      tolerations:
        - effect: NoSchedule
          key: node-role.kubernetes.io/control-plane
          operator: Exists
...
kind: ConfigMap
apiVersion: v1
metadata:
  name: local-path-config
  namespace: local-path-storage
data:
  config.json: |-
    {
            "nodePathMap":[
            {
                    "node":"DEFAULT_PATH_FOR_NON_LISTED_NODES",
                    "paths":["/data/local-path"]
            }
            ]
    }
----------------------------

# 배포
kubectl apply -f local-path-storage.yaml

# 확인 : 마스터노드에 배포됨
kubectl get-all -n local-path-storage
NAME                                                   NAMESPACE           AGE
configmap/kube-root-ca.crt                             local-path-storage  12s
configmap/local-path-config                            local-path-storage  12s
pod/local-path-provisioner-6bff65dcd8-vgwfk            local-path-storage  12s
serviceaccount/default                                 local-path-storage  12s
serviceaccount/local-path-provisioner-service-account  local-path-storage  12s
deployment.apps/local-path-provisioner                 local-path-storage  12s
replicaset.apps/local-path-provisioner-6bff65dcd8      local-path-storage  12s

kubectl get pod -n local-path-storage -owide
NAME                                      READY   STATUS    RESTARTS   AGE   IP              NODE                  NOMINATED NODE   READINESS GATES
local-path-provisioner-6bff65dcd8-vgwfk   1/1     Running   0          17s   172.30.63.103   i-072786762169226a7   <none>           <none>

kubectl describe cm -n local-path-storage local-path-config

kubectl get sc local-path
NAME         PROVISIONER             RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
local-path   rancher.io/local-path   Delete          WaitForFirstConsumer   false                  34s
```



#### (2) PV / PVC 샘플 배포

```bash
# PVC 생성
kubectl apply -f ~/pkos/3/localpath1.yaml

# PVC 확인 : 아직 Pod Boud가 되지 않았으므로 Pending
kubectl describe pvc
kubectl get pvc

NAME              STATUS    VOLUME                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
localpath-claim   Pending                                                        local-path      58s

# 파드 생성
kubectl apply -f ~/pkos/3/localpath2.yaml

# 파드확인 : 정상적으로 Bound된 것으로 확인
kubectl get pod,pv,pvc

NAME                READY   STATUS    RESTARTS   AGE
pod/app-localpath   1/1     Running   0          56s

NAME                                                        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                     STORAGECLASS    REASON   AGE
persistentvolume/pvc-37743f20-e30d-491c-b11c-5e5b7d33a476   1Gi        RWO            Delete           Bound    default/localpath-claim   local-path               49s

NAME                                    STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
persistentvolumeclaim/localpath-claim   Bound    pvc-37743f20-e30d-491c-b11c-5e5b7d33a476   1Gi        RWO            local-path      3m57s
```



- 데이터 생성확인

```bash
# 파드 데이터 확인 : app-localpath 파드에서 데이터 쌓이는 것 확인
kubectl exec -it app-localpath -- tail -f /data/out.txt
Sun Jan 29 05:13:45 UTC 2023

ssh -i ~/.ssh/id_rsa ubuntu@$W2PIP tree /data
/data
0 directories, 0 files

ssh -i ~/.ssh/id_rsa ubuntu@$W1PIP tree /data
/data
└── local-path
    └── pvc-37743f20-e30d-491c-b11c-5e5b7d33a476_default_localpath-claim
        └── out.txt

2 directories, 1 file

# 노드 데이터 확인 : app-localpath 파드가 배포된 노드에 접속 후 데이터 쌓이는 것 확인
ssh -i ~/.ssh/id_rsa ubuntu@$W2PIP tail -f /data/local-path/pvc-ce742b90-755a-4b52-9693-595cbf55dfb0_default_localpath-claim/out.txt
Sun Jan 29 05:13:45 UTC 2023
...
```



![데이터확인](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/Y6CYPg.jpg)



> LocalPath 성능측정은 추후 별도 정리 후 업로드 예정



### 3) AWS EBS Controller

Volume (ebs-csi-controller) : EBS CSI driver 동작 : 볼륨 생성 및 파드에 볼륨 연결 - [링크](https://github.com/kubernetes-sigs/aws-ebs-csi-driver)

- 이미지 출처 : PKOS 스터디 - 가시다

![EBS Controller](https://raw.githubusercontent.com/hyungwook0221/img/main/uPic/dGge8O.jpg)



#### (1) EBS Driver 배포확인

```bash
# EBS Driver 확인 Kops 설치 시 기본 배포
kubectl get pod -n kube-system -l app.kubernetes.io/instance=aws-ebs-csi-driver

NAME                                  READY   STATUS    RESTARTS   AGE
ebs-csi-controller-6d8fd64c78-q5qfn   5/5     Running   0          5d23h
ebs-csi-node-9cfss                    3/3     Running   0          5d23h
ebs-csi-node-crhbx                    3/3     Running   0          5d23h
ebs-csi-node-zbjgj                    3/3     Running   0          5d23h

# 스토리지 클래스 확인
kubectl get sc kops-csi-1-21 kops-ssd-1-17

kubectl describe sc kops-csi-1-21 | grep Parameters
Parameters:            encrypted=true,type=gp3
kubectl describe sc kops-ssd-1-17 | grep Parameters
Parameters:            encrypted=true,type=gp2

```

#### (2) PV / PVC 샘플 배포

```bash
# PVC 생성
kubectl apply -f ~/pkos/3/awsebs-pvc.yaml

# 파드 생성
kubectl apply -f ~/pkos/3/awsebs-pod.yaml

# PVC, 파드 확인
kubectl get pvc,pv,pod
NAME                              STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    AGE
persistentvolumeclaim/ebs-claim   Bound    pvc-fb5b5e1c-76ef-4a43-9b94-9af2b1b1e5f7   4Gi        RWO            kops-csi-1-21   41m

NAME                                                        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS    REASON   AGE
persistentvolume/pvc-fb5b5e1c-76ef-4a43-9b94-9af2b1b1e5f7   4Gi        RWO            Delete           Bound    default/ebs-claim   kops-csi-1-21            40m

NAME      READY   STATUS    RESTARTS   AGE
pod/app   1/1     Running   0          3m15s

# 실제 쌓이는 데이터 확인
kubectl exec app -- tail -f /data/out.txt

Sat Mar 18 14:49:25 UTC 2023
Sat Mar 18 14:49:30 UTC 2023
Sat Mar 18 14:49:35 UTC 2023
...

# 파드 내에서 볼륨 정보 확인
kubectl exec -it app -- sh -c 'df -hT --type=ext4'
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/nvme1n1   ext4  3.9G   16M  3.8G   1% /data
/dev/root      ext4  124G  4.9G  120G   4% /etc/hosts

# 추가된 EBS 볼륨 상세 정보 확인 
while true; do aws ec2 describe-volumes --filters Name=tag:ebs.csi.aws.com/cluster,Values=true --query "Volumes[].{VolumeId: VolumeId, VolumeType: VolumeType, InstanceId: Attachments[0].InstanceId, State: Attachments[0].State}" --output text; date; sleep 1; done

(중략)
i-078613f7b7cd9e352	attached	vol-071ebb777dc2ac3cd	gp3 # 시간이 지난 후 추가되는 것 확인
```



#### (3) (번외) PVC 데이터 증설

```bash
# 현재 pv 의 이름을 기준하여 4G > 10G 로 증가 : .spec.resources.requests.storage의 4Gi 를 10Gi로 변경
kubectl get pvc ebs-claim -o jsonpath={.spec.resources.requests.storage} ; echo
kubectl get pvc ebs-claim -o jsonpath={.status.capacity.storage} ; echo
kubectl patch pvc ebs-claim -p '{"spec":{"resources":{"requests":{"storage":"10Gi"}}}}'

# 확인 : 볼륨 용량 수정 반영이 되어야 되니, 수치 반영이 조금 느릴수 있다
kubectl exec -it app -- sh -c 'df -hT --type=ext4'
kubectl df-pv
aws ec2 describe-volumes --volume-ids $(kubectl get pv -o jsonpath="{.items[0].spec.csi.volumeHandle}") | jq
```



- 리소스 삭제

```bash
kubectl delete pod app & kubectl delete pvc ebs-claim
```





## 5. 마무리

이번 글에서는 Kops 환경에서의 네트워크와 스토리지를 활용하는 방법을 정리해보았습니다.

일반적인 K8s와 달리 AWS 환경에서 EKS, Kops 등을 활용하게 된다면, AWS 리소스와의 연계를 통해 관리의 효율성과 편의성을 체감할 수 있었습니다.

다만, K8s만 알고 AWS는 잘 모르거나 또 그 반대의 상황에는 진입장벽이 있을 수 있겠다는 생각이 들었네요. 물론 이러한 부분만 해소된다면 관리형 쿠버네티스를 200% 활용할 수 있을 것 같습니다.



다음시간에는 GitOps와 관련된 주제로 찾아올 예정입니다.

