---
description: AppRole 방식의 인증을 빌드 파이프라인에 적용
tag: ["vault", "jenkins", "approle"]
---
# Jenkins Pipeline Vault Approle (with Nomad)

Vault의 AppRole 인증 방식은 Vault Token을 얻기위한 단기 자격증명을 사용하는 장점이 있지만 자동화된 환경에 어울리는(반대로 사람에게 불편한)방식으로 Vault를 이용하는 애플리케이션/스크립트의 배포 파이프라인을 구성하는 방식을 추천합니다.

```mermaid
%% Example of Vault AppRole sequence
  sequenceDiagram
    Admin->>Vault: AppRole Role, App Policy 생성
    Admin->>Vault: AppRole 획득 Policy 생성
    Admin->>Vault: AppRole 획득 Token(Role) 생성
    Vault->>Admin: AppRole 획득 Token 발급
    Admin->>CICD: Token 전달
    opt PIPELINE
    CICD->>PIPELINE: Token
    PIPELINE->>Vault: AppRole SecretID 요청
    Vault->>PIPELINE: SecretID 발급
    PIPELINE->>APP: 배포에 RoleID, SecretID 주입
    APP->>Vault: AppRole 방식으로 App Policy사용 가능 Token 요청
    Vault->>APP: Token 발급
    APP->>Vault: Secret 획득
  end
```

::: details TEST ENV
```bash
$ sw_vers
ProductName:	macOS
ProductVersion:	12.4

$ brew --version
Homebrew 3.5.2

$ git version
git version 2.27.0

$ java -version
openjdk version "11.0.14.1" 2022-02-08

$ gradle --version
Welcome to Gradle 7.4.2!

$ docker version
Client:
 Version:           20.10.9

Server:
 Engine:
  Version:          20.10.14

$ vault version
Vault v1.11.0

$ nomad version
Nomad v1.3.1

$ curl --version
curl 7.79.1 (x86_64-apple-darwin21.0)
```
:::


## 1. Vault & Nomad Integration (dev mode)

- 테스트를 위한 Vault를 실행합니다. 개인을 위한 개발모드로 실행하기 때문에 실환경 적용을 위해서는 별도 구성이 필요합니다.
- Nomad는 배포/실행을 위한 용도로 사용되었습니다. 별도 VM, K8S 환경이 있다면 PIPELINE 구성 마지막의 배포 구성에 변경이 필요합니다.

### 1.1 Vault Setup

::: warning
개발모드로 실행하면 데이터가 메모리에만 저장되어 종료시 삭제 됩니다.
:::

#### Vault Start Dev mode

```bash
vault server -dev -dev-root-token-id=root
```
- `-dev-root-token-id` : 개발모드에서는 root 토큰을 지정가능

#### Vault Env

> Another terminal

```bash
export VAULT_ADDR=http://127.0.0.1:8200   #Vault 주소
export VAULT_TOKEN=root                   #Vault Root Token
export JENKINS_POLICY=jenkins-policy      #테스트용 Jenkins Policy 이름
```

### 1.2 Dynamic Secret Sample (AWS)

::: info
테스트를 위한 Secret Engine으로 AWS를 활성화 합니다.  
AWS Secret Engine을 사용하기 위해서는 AWS Credential 정보가 필요합니다.  
발급 안내 : <https://docs.aws.amazon.com/ko_kr/powershell/latest/userguide/pstools-appendix-sign-up.html>  
:::

#### Setup AWS Env

```bash
export AWS_ACCESS_KEY=AKIAU3NXXXXX
export AWS_SECRET_KEY=Rex3GPUKO3++123
export AWS_REGION=ap-northeast-2
```

#### Enable AWS Secret Engine

```bash
vault secrets enable -path=aws aws
```
- `-path` 인수로 `aws` Secret Engine이 마운트되는 경로를 설정할 수 있고, 기본 endpoint는 `aws`

#### AWS Secret Engine Configuration

```bash
vault write aws/config/root \
  access_key=$AWS_ACCESS_KEY \
  secret_key=$AWS_SECRET_KEY \
  region=$AWS_REGION
```
- 마운트 된 `aws` Secret Engine의 기본 설정


#### AWS Secret Engine Lease change (option)

```bash
vault write /aws/config/lease lease=1m lease_max=1m
```
- `aws` Secret Engine에서 `iam_user` 형태의 role을 생성하는 경우의 ttl
- `lease`는 해당 `aws` Secret Engine에서 생성되는 계정의 기본 유지 기간을 설정
- 기본 값은 `768h` (32일)

#### Role setup (e.g. s3)

```bash
vault write aws/roles/sts-s3 \
    credential_type=federation_token \
    policy_document=-<<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
     		"s3:PutObject",
      	"s3:PutObjectAcl"
      ],
      "Resource": "*"
    }
  ]
}
EOF
```
- aws로 생성할 `federation_token`(STS) 타입의 role 정의

#### Test AWS Secret

```bash
$ vault write aws/sts/sts-s3 ttl=900
Key                Value
---                -----
lease_id           aws/sts/sts-s3/Qxfoy2plVAfS57tDQ99B5vPM
lease_duration     14m59s
lease_renewable    false
access_key         ASIAU3NXDWRUE3FCRWBM
secret_key         TX76EXmadilWw3TySTscB1XGAPI4kNyhdQIdKKtS
security_token     IQoJb3JpZ2luX2VjENb//////////wEaDmFwLW5vcnRoZWFzdC0yIkcwRQIhAM
```
- `iam_user` 형태인 경와 다르게 중간에 `sts` 경로를 넣음
- `ttl`은 `federation_token`인 role에서는 15분(900초)가 최소 값


### 1.3 Approle Setup

앞서 생성한 `aws` Secret Engine의 `federation_token` 을 획득하기 위한 Vault 인증을 추가합니다. AppRole은 기계친화적인 인증방식으로 Username/Password 방식과 빗대어 Username역할을 하는 `role_id`와 Password 역할을 하는 `secret_id` 페어로 인증하게 됩니다. `secret_id`는 영구적이지 않으므로 필요할 때 발급받아 사용합니다. ==필요할 때== 발급받게 되는 것으로 보안성은 높으나 발급받기위한 자동화 구성이 요구됩니다.


####  Vault Policy for AWS

```
cat <<EOF | vault policy write aws_policy -
path "aws/sts/sts-s3" {
  capabilities = ["read","update"]
}
EOF
```
- 생성할 AppRole 계정에서 사용할 정책을 추가
- `aws/sts/sts-s3` 에 대한 읽기(발급)와 갱신 권한


#### Approle Create

`aws_policy` 정책을 갖는 AppRole 생성

```bash
$ vault auth enable approle

Success! Enabled approle auth method at: approle/

$ vault write auth/approle/role/aws-cred \
    secret_id_ttl=1m \
    token_ttl=60m \
    token_max_ttl=120m \
    policies="aws_policy"
    
Success! Data written to: auth/approle/role/aws-cred

$ vault read auth/approle/role/aws-cred/role-id

Key        Value
---        -----
role_id    430111ee-5955-aa83-a53d-924b7e11ac36

$ vault write -f auth/approle/role/aws-cred/secret-id

Key                   Value
---                   -----
secret_id             7f86b671-2f47-f841-18a4-c36ca34ab8d8
secret_id_accessor    9ad4256a-acc6-e8c0-f7fe-7633e66b1318
secret_id_ttl         1m
```

생성한 `role_id`와 `secret_id`로 Vault에 인증을 수행합니다. `secret_id`의 경우 ttl 지정이 가능 합니다.

```bash
# Test
$ vault read -field role_id auth/approle/role/aws-cred/role-id > role_id.txt
$ vault write -f -field secret_id auth/approle/role/aws-cred/secret-id > secret_id.txt
$ unset VAULT_TOKEN
$ vault write auth/approle/login role_id=$(cat ./role_id.txt) secret_id=$(cat ./secret_id.txt)

Key                     Value
---                     -----
token                   hvs.CAESIDoJqJmtgUQXj_DSHaSLwkdZFQQpjr7_x-r_bmy6ZbpyGh4KHGh2cy5SeEVpWGpmcXlJSE95WEpKUVdKSW8zMXI
token_accessor          SpMtPdNUXaF3GAOATtWD0Qdi
token_duration          1h
token_renewable         true
token_policies          ["aws_policy" "default"]
identity_policies       []
policies                ["aws_policy" "default"]
token_meta_role_name    aws-cred

$ vault read /aws/creds/s3

Key                Value
---                -----
lease_id           aws/creds/s3/1iaII6N6DaUULD27w91ZpePP
lease_duration     1m
lease_renewable    true
access_key         AKIAU3NXDWRUEXSGRTNL
secret_key         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
security_token     <nil>
```

- `role_id`는 Pipeline 작성에 사용



### 1.4 Jenkins Token

Jenkins에서는 생성된 AppRole의 `role_id`에 대한 `secret_id`를 발급받을 권한이 있어야 합니다.

####  Vault Policy for AppRole Secret

```
cat <<EOF | vault policy write approle_policy -
path "auth/approle/role/aws-cred/role-id" {
  capabilities = ["read"]
}
path "auth/approle/role/aws-cred/secret-id" {
  capabilities = ["create", "update"]
}
EOF
```
- `role-id`를 읽기 가능
- `secret-id`를 생성 가능


#### Create Token Role for Jenkins

Jenkins는 Token을 넣어줄 것이므로 Token Role을 생성하여 Entity를 하나로 지정합니다.
Role을 생성하지 않는 경우 일반적인 `vault token create -policy=<policy_name> -orphan=true -period=700h` 같은 명령어로도 생성할 수 있습니다.

```bash
# Get token accessor id
$ vault auth list -format=json | jq -r '.["token/"].accessor' > accessor_token.txt

# Create entity for Jenkins
$ vault write -format=json identity/entity name="jenkins-entity" policies="default" \
     metadata=organization="Company" \
     metadata=team="Security" \
     | jq -r ".data.id" > entity_id.txt

# Create alias for Jenkins
$ vault write identity/entity-alias name="jenkins-alias" \
     canonical_id=$(cat entity_id.txt) \
     mount_accessor=$(cat accessor_token.txt) \
     custom_metadata=account="Security Account"

Key             Value
---             -----
canonical_id    4a950f94-3c35-dc0f-cdf3-4f5bc931ae0b
id              66528d3b-1561-283b-d7d2-33c8b683b49f

# Create role for Jenkins
$ vault write auth/token/roles/jenkins allowed_policies="approle_policy" orphan=false bound_cidrs="127.0.0.1/32,128.252.0.0/16" renewable=true allowed_entity_aliases="jenkins-alias" token_period="720h"

Success! Data written to: auth/token/roles/jenkins

# Create Token
$ vault token create -field=token -entity-alias=jenkins-alias -role=jenkins
hvs.CAESIGkayX80rrAdHR-LychPp6GITGM_DG8Af8VpOY36hdHQGh4KHGh2cy5pNXprSDdOMEVMTEtia0QxYW1YRHF4dmo
```

- `token` 은 Jenkins에 저장하는 값

```bash
# Test
$ vault token create -field=token -entity-alias=jenkins-alias -role=jenkins > token.txt
$ VAULT_TOKEN=$(cat ./token.txt) vault write -f -field secret_id auth/approle/role/aws-cred/secret-id

aae55515-f9ed-a171-dd56-53710ab29018
```



### 1.2 Nomad Setup

Nomad는 CI/CD 파이프라인 구조 상 배포를 위한 대상을 생성하기위해 구성되었습니다.


#### Nomad Start Dev mode

```bash
nomad agent -dev -alloc-dir=/tmp/nomad/alloc -state-dir=/tmp/nomad/state
```



#### Nomad Env

> Another terminal

```
export NOMAD_ADDR=http://127.0.0.1:4646
```



#### Jar file Up/Download Nexus Job

java 드라이버를 사용한 배포에서 빌드된 jar파일을 원격에서 불러와야 하므로 임시 파일 서버를 구성합니다.

```ruby
cat <<EOF | nomad job run -
job "fileserver" {
  datacenters = ["dc1"]

  group "fileserver" {
    count = 1

    network {
      port "http" {
        to = 3000
        static = 3000
      }
    }

    task "fileserver" {
      driver = "docker"

      config {
        image = "julienmeerschart/simple-file-upload-download-server"
        ports = ["http"]
      }
    }
  }
}
EOF
```

Upload Test

```bash
$ curl -F file=@/tmp/dynamic.properties http://localhost:3000
{"downloadLink":"http://localhost:3000/file?file=dynamic.properties","curl":"curl http://localhost:3000/file?file=dynamic.properties > dynamic.properties"}
```



## 2. Jenkins Setup
> Download Guide : <https://www.jenkins.io/download/>  
> macOS Install Guide : <https://www.jenkins.io/download/lts/macos/>


### 2.1 Jenkins Install (macOS)

> macOS guide : https://www.jenkins.io/download/lts/macos/

```bash
brew install jenkins-lts
```

```bash
brew services start jenkins-lts
```



### 2.2 Unlock Jenkins

Home 디렉토리의 Jenkins 활성화를 위한 패스워드를 다음 경로에서 복사하여 <http://localhost:8080> 페이지의 `Unlock Jenkins` 에 입력

![image-20220627095332250](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627095332250.png)

### 2.3 Jenkins Setup

#### Customize Jenkins

빠른 시작을 위해 기본 값인 `Install suggested plugins` 를 클릭



#### Create First Admin User

계정명, 암호, 이름, 이메일 주소를 기입하고 `Save and Continue` 버튼 클릭



#### Instance Configuration

올바른 Jenkins URL을 확인하고 `Save and Finish` 버튼 클릭



#### Jenkins is ready!

`Start using Jenkins` 버튼 클릭



### 2.4 Jenkins github plugin

#### GitHub

1. GitHub 로그인

2. 우측 상단 사용자 메뉴 클릭 후 `Settings` 클릭

   ![GitHub 2022-06-27 12-36-30](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/GitHub%202022-06-27%2012-36-30.png)

3. 좌측 메뉴 최하단 `Developer settings` 클릭

4. 좌측 메뉴 `Personal access tokens` 클릭

5. `Generate new token` 버튼 클릭

   ![Personal access tokens](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Personal%20access%20tokens.png)

6. Token 옵션 선택 후 `Generate token` 클릭

   - Note : 토큰 목적 입력 (e.g. Jenkins Token)
   - Expiration : 기간을 설정 (e.g. No expiration)
   - Select scopes
     - repo
     - admin:org
     - admin:repo_hook

7. 생성된 토큰을 기록/보관

   ![Personal access tokens 2022-06-27 12-42-58](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Personal%20access%20tokens%202022-06-27%2012-42-58.png)

   

#### Jenkins

1. `Jenkins 관리` > `시스템 설정` 으로 이동

2. `JDK` 항목에서 `Add JDK` 클릭

   - Name : 이름 입력 (e.g. jdk11)
   - JAVA_HOME : 자바 홈 경로 (e.g. /Library/Java/JavaVirtualMachines/temurin-11.jdk/Contents/Home)

   ![image-20220627143641019](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627143641019.png)

3. `Git` 항목에서 `Add Git`을 클릭

   - Name : 이름 입력 (e.g. local)
   - Path to Git executable : git 실행파일 경로 입력 (e.g. /usr/local/bin/git)

4. `GitHub` 항목에서 `Add GitHub Server` 드롭박스의 `GitHub Server`를 클릭

   - Name : 이름 입력 (e.g. jenkins_github)
   - API URL : 기본 값 (https://api.github.com)
   - Credentials : 아래 `+Add` 버튼 클릭하여 `Jenkins`선택 후 새로운 크리덴셜 생성 후 생성된 항목 지정
   - Kind : `Secret Test` 선택
   - Secret : GitHub에서 생성한 토큰 입력
   - ID : 사용자 지정 (e.g. jenkins_github)
   - `Test Connection` 버튼으로 연결 확인

   ![스크린샷 2022-06-27 12.48.18](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-06-27%2012.48.18.png)

5. `Gradle` 항목에서 `Add Gradle` 클릭

   - Name : 이름 입력 (e.g. gradle)

   - GRADLE_HOME : Gradle 홈 디렉토리 입력 (e.g. /usr/local/Cellar/gradle/7.4.2/libexec)



#### Vault Credential

1. `Jenkins 관리` > `Manage Credentials` 로 이동
2. Domains의 (global) 항목 선택하여 `Add credentials` 클릭

![image-20220627220603230](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627220603230.png)

- Kind : Secret text

- Scope : Global

- ID : 이름 (e.g. vault)

- Secret: jenkins role 의 토큰

  ```bash
  $ vault token create -field=token -entity-alias=jenkins-alias -role=jenkins
  hvs.CAESIGkayX80rrAdHR-LychPp6GITGM_DG8Af8VpOY36hdHQGh4KHGh2cy5pNXprSDdOMEVMTEtia0QxYW1YRHF4dmo
  ```

  



## 3. Sample Java

### 3.1 App Setting

#### Spring-boot Initializr

> https://start.spring.io/

![image-20220628201916786](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220628201916786.png)

- Project : Gradle Project
- Language : Java
- Spring Boot : 2.7.2
- Packageing : Jar
- Java : 11
- Dependencies
  - Spring Web
  - Vault Configuration



#### App Setup

> github : https://github.com/Great-Stone/jenkins-gradle-vault-pipeline



`build.gradle`

```groovy
<생략> 
dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-web'
	implementation 'org.springframework.cloud:spring-cloud-starter-vault-config'
	implementation 'org.springframework.cloud:spring-cloud-vault-config-aws'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
}
<생략>
```



`demo>src>main>resources>application.yml`

```yaml
server:
  port: ${NOMAD_HOST_PORT_http:8080}
spring:
  config:
    import: vault://
  cloud.vault:
    enabled: true
    host: ${VAULT_HOST:127.0.0.1}
    port: ${VAULT_PORT:8200}
    scheme: http
    uri: ${VAULT_URI:http://127.0.0.1:8200/}
    config:
      lifecycle:
        min-renewal: 14m
        expiry-threshold: 15m
    authentication: APPROLE
    app-role:
      role-id: ${VAULT_ROLE_ID:430111ee-5955-aa83-a53d-924b7e11ac36}
      secret-id: ${VAULT_SECRET_ID:6db07578-b019-95b4-6741-de4c79cbde39}
      role: aws-cred
      app-role-path: approle
    kv:
      enabled: false
    aws:
      enabled: true
      role: sts-s3
      backend: aws
      credential-type: federation_token
      access-key-property: cloud.aws.credentials.accessKey
      secret-key-property: cloud.aws.credentials.secretKey
      session-token-key-property: cloud.aws.credentials.sessionToken
      ttl: 900s
```



### Set dummy properties & Test

```bash
$ export VAULT_TOKEN=root
$ export VAULT_ROLE_ID=$(vault read -field role_id auth/approle/role/aws-cred/role-id)
$ export VAULT_SECRET_ID=$(write -f -field secret_id auth/approle/role/aws-cred/secret-id)
$ gradle bootRun
...
2022-06-28 23:23:22.721  INFO 35144 --- [   scheduling-1] com.example.demo.VaultAWSConfiguration   : AwsConfigurationProperties [accessKey=ASIAU3NXDWRUABR7V6UM, secretKey=IBXXM3FXq8Q7qQE2XVUnjPN5lcN8bvsf5bw3TwXX, sessionToken=tokentoken]
2022-06-28 23:23:24.721  INFO 35144 --- [   scheduling-1] com.example.demo.VaultAWSConfiguration   : AwsConfigurationProperties [accessKey=ASIAU3NXDWRUABR7V6UM, secretKey=IBXXM3FXq8Q7qQE2XVUnjPN5lcN8bvsf5bw3TwXX, sessionToken=tokentoken]
<==========---> 80% EXECUTING [5s]
> :bootRun
```



## 4. Jenkins Pipeline 생성

>  Pipeline 구성
>
>  1. GitHub checkout
>  2. Gradle build
>  3. jar upload
>  4. Nomad Job Start

```mermaid
graph LR
A[GitHub checkout] -->B[Gradle build]
B -->|N:Jar| C[Jar Upload]
C --> D(Nomad Job)
```

### 

1. 좌측 `+ 새로운 Item` 버튼 클릭

2. 이름 입력 (e.g. Nomad Job - Vault approve)

3. Pipeline 선택 후 `OK`

4. 성성된 Jenkins Job의 Pipeline에 스크립트 구성

   ```groovy
   pipeline {
       agent any
       triggers {
           cron('H */8 * * *') //regular builds
           pollSCM('* * * * *') //polling for changes, here once a minute
       }
       tools { 
           git('local')
           gradle('gradle')
           jdk("jdk11")
       }
       environment {
           NOMAD_ADDR = 'http://localhost:4646'
           VAULT_HOST = '127.0.0.1'
           VAULT_PORT = '8200'
       }
       stages {
           stage('Clone') {
               steps {
                   git branch: 'main',
                       credentialsId: 'jenkins_github',
                       url: 'https://github.com/Great-Stone/jenkins-gradle-vault-pipeline'
                   sh "ls -lat"
               }
           }
           stage('Test') {
               steps {
                   sh './gradlew test'
               }
           }
           stage('Build') {
               steps {
                   sh './gradlew build'
               }
           }
           stage('Upload') {
               steps {
                   sh 'mv ./build/libs/demo-0.0.1-SNAPSHOT.jar ./demo-vault-${BUILD_NUMBER}.jar'
                   sh 'curl -F file=@./demo-vault-${BUILD_NUMBER}.jar http://localhost:3000'
               }
           }
           stage('Nomad Download') {
               steps {
                   sh 'curl -C - --output nomad_1.3.1_darwin_amd64.zip https://releases.hashicorp.com/nomad/1.3.1/nomad_1.3.1_darwin_amd64.zip'
                   sh 'unzip -o nomad_1.3.1_darwin_amd64.zip'
               }
           }
           stage('Deploy To Nomad') {
               steps {
                   script {
                       withCredentials([string(credentialsId: 'vault', variable: 'TOKEN')]) {
                           sh '''
                           curl -H "X-Vault-Token: ${TOKEN}" -X GET http://${VAULT_HOST}:${VAULT_PORT}/v1/auth/approle/role/aws-cred/role-id | /usr/local/bin/jq -r '.data.role_id' > role_id.txt
                           curl -H "X-Vault-Token: ${TOKEN}" -X POST http://${VAULT_HOST}:${VAULT_PORT}/v1/auth/approle/role/aws-cred/secret-id | /usr/local/bin/jq -r '.data.secret_id' > secret_id.txt
                           ./nomad job run -var version=${BUILD_NUMBER} -var vault_host=${VAULT_HOST} -var vault_port=${VAULT_PORT} -var role_id=$(cat ./role_id.txt) -var secret_id=$(cat ./secret_id.txt) ./nomad-java.hcl
                           '''
                       }
                   }
               }
           }
       }
   }
   ```

5. `지금 빌드`를 클릭하여 빌드를 진행합니다. 

   ![image-20220629001337731](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220629001337731.png)

   ![image-20220629001415515](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220629001415515.png)

