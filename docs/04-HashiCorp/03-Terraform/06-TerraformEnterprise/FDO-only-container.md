---
description: Terraform Enterprise FDO
tag: ["Terraform", "FDO", "TFE"]
author: gbkim
---

![](./img/3287187593.png?width=760)

본 문서는 EKS 환경에 Flexible Deployment Options를 배포 하면서 DB를 aws 서비스를 사용하지 않고 container로 배포하는 테스트 기록을 남긴 문서입니다.


# Container component deploy
사전 조건

1.  FDO 사설 인증서(본 테스트는 openssl로 진행) 및 도메인 준비(tfe.crt,tfe.key)
2.  FDO 용 라이선스

시나리오

1.  eks 환경에 terraform(FDO), redis, postgresql, minio helm 배포

2.  vcs 연동 및 plan, apply

3.  FDO api를 사용한 backup & restore

4.  eks cluster를 velero로 사용하여 backup & restore

|**Element**|**버전(docker image 경우 tag 명)**|
| :-: | :-: |
|EKS|1\.26|
|kubectl|1\.23.7|
|Helm|3\.8.2|
|Flexible Deployment Options|v202311-1|
|Redis|7\.0.11-debian-11-r12|
|Postgres|14\.5.0-debian-11-r35|
|minio|RELEASE.2023-05-18T00-05-36Z|
|velero|1\.9.2|

[주의]
::: danger
FDO docker version image(v202311-1) 기준 Postgres 15.x version 사용 시 아래와 같은 에러로 정상적으로 백업이 이루어 지지 않아 14.5 버전을 사용 하였습니다.
``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
pg_dump: error: server version: 15.3; pg_dump version: 14.9 (Ubuntu 14.9-1.pgdg22.04+1)
pg_dump: error: aborting because of server version mismatch
```
:::


# 1. Redis Helm
## Redis

### 1.1 helm values.yaml

참고: 아래 yaml 내용은 첨부 된 redis yaml 파일에서 설정 한 부분만 기입



``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
[중략]

image:
  registry: docker.io
  repository: bitnami/redis
  tag: 7.0.11-debian-11-r12

[중략]

tls:
  enabled: false

[중략]
```



### 1.2 Command

#### 1.2.1 helm 배포


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
helm repo add bitnami https://charts.bitnami.com/bitnami

kubectl create ns redis

helm install redis-dev  -n redis --version 17.11.3 . --values values.yaml --debug
```


# 2. Postgresql Helm 배포 

## Postgresql 

### 2.1 helm values.yaml 

참고: 아래 yaml 내용은 첨부 된 Postgresql yaml 파일에서 설정 한 부분만
기입


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
[중략]

image:
  registry: docker.io
  repository: bitnami/postgresql
  tag: 14.5.0-debian-11-r35
  
[중략]

auth:
  enablePostgresUser: true
  postgresPassword: "[postgresPassword]"
  username: "[postgre username]"
  password: "[password]"
  database: "[database name]"
  
[중략]
```


### 2.2 Command 

#### 2.2.1 helm 배포 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
helm repo add bitnami https://charts.bitnami.com/bitnami
helm install postgresql-dev  -n default --version 11.9.13 . --values values.yaml --debug
```


#### 2.2.2 posgresql DB 확인 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
# container 내부 Command
psql --host 127.0.0.1 -U [database 계정] -d tfe -p 5432
select * from pg_tables;
```


# 3. Minio Helm 배포 

## Minio 

### 3.1 helm values.yaml 

참고: 아래 yaml 내용은 첨부 된 Minio yaml 파일에서 설정 한 부분만 기입


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
[중략]

image:
  repository: quay.io/minio/minio
  tag: RELEASE.2023-05-18T00-05-36Z
  pullPolicy: IfNotPresent
[중략]

rootUser: "[rootUser]"
rootPassword: "[rootPassword]"

[중략]

## FDO terraform plan, apply를 파일 적재되는 지 확인 용
consoleService:
  annotations:
    'service.beta.kubernetes.io/aws-load-balancer-subnets': "subnet-03b41598fbe094c5e, subnet-0ec501ba454a8c95e, subnet-0aacc8ce08d63e061"
    'service.beta.kubernetes.io/aws-load-balancer-scheme': "internet-facing"
    'service.beta.kubernetes.io/aws-load-balancer-nlb-target-type': "instance"
  type: LoadBalancer # ClusterIP
  port: 9001
  loadBalancerClass: service.k8s.aws/nlb
  nodePort: 32001
  
[중략]
```

### 3.2 Command 

#### 3.2.1 helm 배포 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
helm repo add bitnami https://charts.bitnami.com/bitnami
kubectl create ns minio
helm install minio-dev  -n minio --version 5.0.10 . --values values.yaml --debug
```

#### 3.2.2 minio UI 접근 시 ID, Password 확인 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
kubectl get secret --namespace minio minio-dev -o jsonpath="{.data.root-user}" | base64 -d

kubectl get secret --namespace minio minio-dev -o jsonpath="{.data.root-password}" | base64 -d
```

#### 3.2.2 FDO 연동 후 plan,apply Minio bucket data 확인 

![](./img/3287417026.png?width=760)


# 4. FDO(Flexible Deployment Options) Helm 배포 

## FDO(Flexible Deployment Options)

### 4.1 helm values.yaml 

참고: 아래 yaml 내용은 첨부 된 FDO yaml 파일에서 설정 한 부분만 기입


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
[중략]

image:
  repository: images.releases.hashicorp.com
  name: hashicorp/terraform-enterprise
  tag: v202311-1
  
[중략]


service:
  annotations:
    'service.beta.kubernetes.io/aws-load-balancer-subnets': "[외부 통신 서브넷]"
    ## nlb 외부 통신
    'service.beta.kubernetes.io/aws-load-balancer-scheme': "internet-facing"
    ## target group 지정 type
    'service.beta.kubernetes.io/aws-load-balancer-nlb-target-type': "instance"
    ## 인증서 arn
    'service.beta.kubernetes.io/aws-load-balancer-ssl-cert': "[인증서 arn]"
    ## nlb 프로토콜 annotation
    'service.beta.kubernetes.io/aws-load-balancer-backend-protocol': 'ssl'
  type: LoadBalancer # ClusterIP
  port: 443
  nodePort: 32443
  loadBalancerClass: service.k8s.aws/nlb

[중략]

env:
  variables:
    ## terraform 접근 URL 
    TFE_HOSTNAME: [terraform 접근 URL] ## ex) xxx.xxx.xyz Protocol 없이 설정

    ## container로 올리는 postgresql svc dns, headless로 설정 시 접근이 안되는 문제로 postgres 기본 svc로 설정
    ## [helm 배포 시 설정 된 이름].[namespace].svc.cluster.local ==> 포트 지정 없이 설정
    TFE_DATABASE_HOST: "postgresql-dev.default.svc.cluster.local"

    ## container로 올리는 postgresql database 이름
    ## postgre value.yaml 135 번째 줄 설정
    TFE_DATABASE_NAME: "[TFE_DATABASE_NAME]"
    ## ssl mode
    TFE_DATABASE_PARAMETERS: "sslmode=disable"

    ## container로 올리는 postgresql 유저 계정
    ## postgre value.yaml 129 번째 줄 설정
    TFE_DATABASE_USER: "[TFE_DATABASE_USER]"

    ## container로 올리는 redis dns, headless로 설정하면 접근이 안되는 문제로 master로 설정
    ## [helm 배포 시 설정 된 이름].[namespace].svc.cluster.local:6379
    TFE_REDIS_HOST: "redis-dev-master.redis.svc.cluster.local:6379"

    ## redis AUTH 사용할 경우 에러 발생으로 임시 false
    ## auth 기능 비활성 시 redis value.yaml 123 번째 줄 기능 false 설정
    TFE_REDIS_USE_AUTH: "false"

    ## container로 올리는 minio type은 s3로 해야함
    TFE_OBJECT_STORAGE_TYPE: s3

    ## container로 올리는 minio bucket 이름
    TFE_OBJECT_STORAGE_S3_BUCKET: "[minio bucket name]"

    ## container로 올리는 minio svc dns
    ## [helm 배포 시 설정 된 이름].[namespace].svc.cluster.local:9000
    TFE_OBJECT_STORAGE_S3_ENDPOINT: "http://minio-dev.minio.svc.cluster.local:9000"

    ## container로 올리는 minio가 올라가는 aws 지역
    TFE_OBJECT_STORAGE_S3_REGION: "ap-northeast-2"

    TFE_IACT_SUBNETS: "0.0.0.0/0"
    TFE_CAPACITY_CONCURRENCY: 10

    ## container로 올리는 minio 접근 시 admin 계정 ID,Password
    ## minio vaule.yaml 90 번째 줄 설정
    TFE_OBJECT_STORAGE_S3_ACCESS_KEY_ID: "[admin 계정 ID]"
    TFE_OBJECT_STORAGE_S3_SECRET_ACCESS_KEY: "[admin 계정 Password]"
  secrets:
    ## postgre value.yaml 파일 132 번째 줄 설정
    ## container로 올리는 postgresql 접근 비밀번호
    TFE_DATABASE_PASSWORD: "[postgresql 접근 비밀번호]"

    ## Terraform FDO Licence
    TFE_LICENSE: "[Terraform FDO Licence]"

    ## terraform FDO vault 암호, backup & restore 시 필요함
    ## https://developer.hashicorp.com/terraform/enterprise/flexible-deployments/admin/admin-cli/backup-restore
    TFE_ENCRYPTION_PASSWORD: "[TFE_ENCRYPTION_PASSWORD]"
```



#### 4.1.1 Command 

#### 4.1.2 FDO 배포 전 image registry 정책 설정 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
$ kubectl create secret docker-registry terraform-enterprise --docker-server=images.releases.hashicorp.com --docker-username=terraform --docker-password=$(cat { 라이선스 파일 }) -n tfe

## 도메인 인증서 설정 한 파일 시크릿으로 배포
$ kubectl create secret tls terraform-enterprise-certificates --cert=tfe.crt --key=tfe.key -n tfe
```


#### 4.1.3 helm 배포 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
helm repo add bitnami https://charts.bitnami.com/bitnami

kubectl create ns tfe

helm install terraform -n tfe --version 1.1.0 . --values values.yaml --debug
```


#### 4.1.4 supervisorctl 명령어로 하여 FDO 내부 연동 된 부분을 확인(redis, postgresql 같은 경우 외부 연동)

![](./img/3286861543.png?width=712)

#### 4.1.5 정상 helm 배포 이후 FDO container 내부에서 아래 command로 FDO admin 계정 생성을 위한 Token 발행 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
tfectl admin token 
```


#### 4.1.6 admin 계정 생성 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
https://{ 사용하는 도메인 }/admin/account/new?token={ 발급 된 토큰 } 
```


![](./img/3286894457.png?width=712)


# 5. FDO Backup & Restore 

### 5.1 백업 시 인증 토큰 필요 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
/bin/bash -c 'cat /var/run/terraform-enterprise/backup-restore/config.hcl | grep backup_token'
```

### 5.2 FDO container 내부 토큰 발급 command 

### 5.3 payload.json 파일 생성 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
{
  "password": "{ FDO helm 배포 시 설정 했던 TFE_ENCRYPTION_PASSWORD 값 }"
}
```


### 5.4 Backup api 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
curl \
  --header "Authorization: Bearer { 인증토큰 }" \
  --request POST \
  --data @payload.json \
  --output backup.blob \
  https:// { 설정한 도메인 } /_backup/api/v1/backup
```


### 5.5 백업이 정상적으로 되었는지 확인 

-   FDO container 내부 경로: /var/log/terraform-enterprise

![](./img/3287351709.png?width=760)


### 5.6 백업 된 데이터는 curl command를 한 경로에 생성 

### 5.7 Terraform oranization, plan, apply 정보가 저장된 FDO와 FDO와 연동 된 container를 삭제 하여 정상적으로 백업이 되는 지 확인 

### 5.8 삭제 전 

![](./img/3287417063.png?width=712)


### 5.9 Restore 

#### 5.9.1 삭제 이후 신규 설치 

![](./img/3286764119.png?width=712)

#### 5.9.2 신규 설치 된 FDO에 초기 설치 생성 했던 계정으로 login 

![](./img/3287286346.png?width=712)


#### 5.9.3 Restore api 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
curl \
  --header "Authorization: Bearer { 인증 토큰 }" \
  --request POST \
  --form config=@payload.json \
  --form snapshot=@backup.blob \
  https:// { 설정한 도메인 } /_backup/api/v1/restore
```


![](./img/3286894515.png?width=712)


#### 5.9.4 Restore 이후 초기 생성 했던 계정으로 로그인 

#### 5.9.5 정상적으로 계정 및 organization, workspace 및 plan,apply 정보 복구 

![](./img/3287417093.png?width=688)


# 6. Velero Cluster Backup & Restore 

## 6.1 백업 할 S3 생성 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
BUCKET=test-gbkim
REGION=ap-northeast-2

aws s3api create-bucket \
    --bucket $BUCKET \
    --region $REGION \
    --create-bucket-configuration LocationConstraint=$REGION
```


## 6.2 velero 설치 


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
wget https://github.com/vmware-tanzu/velero/releases/download/v1.9.2/velero-v1.9.2-linux-amd64.tar.gz
tar zxvf velero-v1.9.2-linux-amd64.tar.gz
sudo mv velero-v1.9.2-linux-amd64/velero  /usr/local/sbin

  velero install \
   --provider aws \
   --plugins velero/velero-plugin-for-aws:v1.4.1 \
   --bucket $BUCKET \
   --backup-location-config region=$REGION \
   --snapshot-location-config region=$REGION \
   --secret-file /home/ec2-user/.aws/credentials
```


## 6.3 설치 완료 시 velero container 생성 

![](./img/3286796210.png?width=736)


## 6.4 velero backup 

-   백업 대상 eks 클러스터


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
velero backup create gbkim
```


-   S3 백업 확인

![](./img/3287384334.png?width=736)


## 6.5 Restore cluster 

![](./img/3286796235.png?width=736)


## 6.6 velero restore 

-   restore 대상 eks 클러스터에 velero 설치 된 상태에서 restore 대상
    클러스터에서 아래 명령어로 restore


``` {.syntaxhighlighter-pre syntaxhighlighter-params="brush: xml; gutter: false; theme: Confluence" theme="Confluence"}
velero restore create --from-backup gbkim
```

-   restore

![](./img/3287188089.png?width=730)


## 6.7 새로운 클러스터에 정상적으로 restore가 되었는지 확인 

![](./img/3286796256.png?width=730)
