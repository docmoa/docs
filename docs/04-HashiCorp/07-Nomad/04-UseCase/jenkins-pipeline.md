---
meta:
  - name: description
    content: Jenkins Pipeline for Nomad
tags: ["Nomad", "Jenkins", "Java", "Docker", "Vault"]
---

# Jenkins Pipeline Nomad (Integrated Vault)



### Test ENV

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

$ aws --version
aws-cli/2.7.11 Python/3.10.5 Darwin/21.5.0 source/x86_64 prompt/off
```



## 1. Vault & Nomad Integration (dev mode)



### 1.1 Vault Setup



#### Vault Start Dev mode

```bash
vault server -dev -dev-root-token-id=root
```



#### Vault Env

> Another terminal

```bash
export VAULT_ADDR=http://127.0.0.1:8200
export VAULT_TOKEN=root
export NOMAD_POLICY=nomad-server
```



#### Vault Policy for Nomad

```bash
cat <<EOF | vault policy write $NOMAD_POLICY -
# Allow creating tokens under "nomad-cluster" token role. The token role name
# should be updated if "nomad-cluster" is not used.
path "auth/token/create/nomad-cluster" {
  capabilities = ["update"]
}

# Allow looking up "nomad-cluster" token role. The token role name should be
# updated if "nomad-cluster" is not used.
path "auth/token/roles/nomad-cluster" {
  capabilities = ["read"]
}

# Allow looking up the token passed to Nomad to validate # the token has the
# proper capabilities. This is provided by the "default" policy.
path "auth/token/lookup-self" {
  capabilities = ["read"]
}

# Allow looking up incoming tokens to validate they have permissions to access
# the tokens they are requesting. This is only required if
# `allow_unauthenticated` is set to false.
path "auth/token/lookup" {
  capabilities = ["update"]
}

# Allow revoking tokens that should no longer exist. This allows revoking
# tokens for dead tasks.
path "auth/token/revoke-accessor" {
  capabilities = ["update"]
}

# Allow checking the capabilities of our own token. This is used to validate the
# token upon startup.
path "sys/capabilities-self" {
  capabilities = ["update"]
}

# Allow our own token to be renewed.
path "auth/token/renew-self" {
  capabilities = ["update"]
}
EOF
```



#### Vault Policy for AWS

```bash
cat <<EOF | vault policy write aws_policy -
path "aws/creds/s3" {
  capabilities = ["read","update"]
}
EOF
```



####  Create Token Role

```bash
vault write auth/token/roles/nomad-cluster allowed_policies="aws_policy,db_policy" disallowed_policies="$NOMAD_POLICY" token_explicit_max_ttl=0 orphan=true token_period="259200" renewable=true
```



#### Create Token

```bash
vault token create -field token -policy $NOMAD_POLICY -period 72h -orphan > /tmp/token.txt
```



### 1.2 Nomad Setup



#### Nomad Start Dev mode

```bash
nomad agent -dev -vault-enabled=true -vault-address=http://127.0.0.1:8200 -vault-token=$(cat /tmp/token.txt) -vault-tls-skip-verify=true -vault-create-from-role=nomad-cluster -alloc-dir=/tmp/nomad/alloc -state-dir=/tmp/nomad/state
```



#### Nomad Env

> Another terminal

```
export NOMAD_ADDR=http://127.0.0.1:4646
```



#### Jar file Up/Download Nexus Job

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



### 1.3 Vault-Nomad Integration Check

```bash
$ nomad agent-info
client
  heartbeat_ttl = 11.955357358s
  known_servers = 127.0.0.1:4647
  last_heartbeat = 9.248352347s
  node_id = 69944736-5399-f805-9c03-35be83c9abfe
  num_allocations = 0
nomad
  bootstrap = true
  known_regions = 1
  leader = true
  leader_addr = 127.0.0.1:4647
  server = true
<...>
vault
  token_expire_time = 2022-06-30T08:44:26+09:00
  token_last_renewal_time = 2022-06-27T08:44:26+09:00
  token_next_renewal_time = 2022-06-28T20:44:26+09:00
  token_ttl = 71h53m46s
  tracked_for_revoked = 0
```



### 1.4 Vault Sample

> AWS Dynamic Secret



#### Setup AWS Env

```bash
export AWS_ACCESS_KEY=AKIAU3NXXXXX
export AWS_SECRET_KEY=Rex3GPUKO3++123
export AWS_REGION=ap-northeast-2
```



#### Enable AWS Secret Engine

```bash
vault secrets enable aws
```



#### AWS Secret Engine Configuration

```bash
vault write aws/config/root \
  access_key=$AWS_ACCESS_KEY \
  secret_key=$AWS_SECRET_KEY \
  region=$AWS_REGION
```



#### AWS Secret Engine Lease change

```bash
vault write /aws/config/lease lease=1m lease_max=1m
```



#### Role setup (e.g. s3)

```bash
vault write aws/roles/s3 \
    credential_type=iam_user \
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



#### Test AWS Secret

```bash
$ vault read aws/creds/s3
Key                Value
---                -----
lease_id           aws/creds/s3/tt1sONqTebOsrJxBs6A3B4m4
lease_duration     1m
lease_renewable    true
access_key         AKIAU3NXDWRUL5GVEB4H
secret_key         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
security_token     <nil>
```



## 2. Jenkins Setup



### 2.1 Jenkins Install (macOS)

> macOS guide : https://www.jenkins.io/download/lts/macos/

```bash
brew install jenkins-lts
```

```bash
brew services start jenkins-lts
```



### 2.2 Unlock Jenkins

Home ??????????????? Jenkins ???????????? ?????? ??????????????? ?????? ???????????? ???????????? <http://localhost:8080> ???????????? `Unlock Jenkins` ??? ??????

![image-20220627095332250](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627095332250.png)

### 2.3 Jenkins Setup

#### Customize Jenkins

?????? ????????? ?????? ?????? ?????? `Install suggested plugins` ??? ??????



#### Create First Admin User

?????????, ??????, ??????, ????????? ????????? ???????????? `Save and Continue` ?????? ??????



#### Instance Configuration

????????? Jenkins URL??? ???????????? `Save and Finish` ?????? ??????



#### Jenkins is ready!

`Start using Jenkins` ?????? ??????



### 2.4 Jenkins github plugin

#### GitHub

1. GitHub ?????????

2. ?????? ?????? ????????? ?????? ?????? ??? `Settings` ??????

   ![GitHub 2022-06-27 12-36-30](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/GitHub%202022-06-27%2012-36-30.png)

3. ?????? ?????? ????????? `Developer settings` ??????

4. ?????? ?????? `Personal access tokens` ??????

5. `Generate new token` ?????? ??????

   ![Personal access tokens](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Personal%20access%20tokens.png)

6. Token ?????? ?????? ??? `Generate token` ??????

   - Note : ?????? ?????? ?????? (e.g. Jenkins Token)
   - Expiration : ????????? ?????? (e.g. No expiration)
   - Select scopes
     - repo
     - admin:org
     - admin:repo_hook

7. ????????? ????????? ??????/??????

   ![Personal access tokens 2022-06-27 12-42-58](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Personal%20access%20tokens%202022-06-27%2012-42-58.png)

   

#### Jenkins

1. `Jenkins ??????` > `????????? ??????` ?????? ??????

2. `JDK` ???????????? `Add JDK` ??????

   - Name : ?????? ?????? (e.g. jdk11)
   - JAVA_HOME : ?????? ??? ?????? (e.g. /Library/Java/JavaVirtualMachines/temurin-11.jdk/Contents/Home)

   ![image-20220627143641019](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627143641019.png)

3. `Git` ???????????? `Add Git`??? ??????

   - Name : ?????? ?????? (e.g. local)
   - Path to Git executable : git ???????????? ?????? ?????? (e.g. /usr/local/bin/git)

4. `GitHub` ???????????? `Add GitHub Server` ??????????????? `GitHub Server`??? ??????

   - Name : ?????? ?????? (e.g. jenkins_github)
   - API URL : ?????? ??? (https://api.github.com)
   - Credentials : ?????? `+Add` ?????? ???????????? `Jenkins`?????? ??? ????????? ???????????? ?????? ??? ????????? ?????? ??????
   - Kind : `Secret Test` ??????
   - Secret : GitHub?????? ????????? ?????? ??????
   - ID : ????????? ?????? (e.g. jenkins_github)
   - `Test Connection` ???????????? ?????? ??????

   ![?????????????????????????????? 2022-06-27 12.48.18](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-06-27%2012.48.18.png)

5. `Gradle` ???????????? `Add Gradle` ??????

   - Name : ?????? ?????? (e.g. gradle)

   - GRADLE_HOME : Gradle ??? ???????????? ?????? (e.g. /usr/local/Cellar/gradle/7.4.2/libexec)





## 3. Sample Java

### 3.1 App Setting

#### Spring-boot Initializr

> https://start.spring.io/

![image-20220627155858474](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627155858474.png)

- Project : Gradle Project
- Language : Java
- Spring Boot : 2.7.2
- Packageing : Jar
- Java : 11
- Dependencies : Spring Web



#### App Setup

`demo>src>main>resources>application.yml`

```yaml
dynamic:
  path: ${DYNAMIC_PROPERTIES_PATH:/tmp/dynamic.properties}
server:
  port: ${NOMAD_HOST_PORT_http:8080}
```



`demo>src>main>java>com>example>demo>DemoApplication.java`

```java
package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@RestController
@SpringBootApplication
@EnableScheduling
public class DemoApplication {

	private static String FILE_PATH;

	@Value("${dynamic.path}")
	public void setKey(String value) {
		FILE_PATH = value;
	}

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Scheduled(fixedRate=1000)
	public void filecheck() throws IOException {
		List<String> str = Files.readAllLines(Paths.get(FILE_PATH));
		System.out.println(str);
	}

	@RequestMapping(method = RequestMethod.GET, path = "/")
	public String index() throws IOException {
		List<String> str = Files.readAllLines(Paths.get(FILE_PATH));
		System.out.println(str);

		return "<h1>AWS</h1>"
		.concat("<h2>" + str.get(0) + "</h2>")
		.concat("<h2>" + str.get(1) + "</h2>");
	}
}
```



### Set dummy properties & Test

```bash
cat <<EOF> /tmp/dynamic.properties
aws_access_key=my_access_key
aws_secret_key=my_secret_key
EOF
```

```bash
$ gradle bootRun
...
[aws_access_key=my_access_key, aws_secret_key=my_secret_key]
[aws_access_key=my_access_key, aws_secret_key=my_secret_key]
<==========---> 80% EXECUTING [5s]
> :bootRun
```



## 4. Pipeline ??????

>  Pipeline ?????? case 1
>
> 1. GitHub checkout
> 2. Gradle build
> 3. jar upload
> 4. Nomad Job Start

>  Pipeline ?????? case 2
>
> 1. GitHub checkout
> 2. Gradle build
> 3. docker build
> 4. docker push
> 5. Nomad Job Start

```mermaid
graph TD
A[GitHub checkout] -->B[Gradle build]
B --> C{Container?}
C -->|N:Jar| D[Jar Upload]
D --> E(Nomad Job)
C -->|Y:Docker| F[Docker Build]
F --> G(Docker push)
G --> E
```

### 4.1 Jenkins Job - Jar

1. ?????? `+ ????????? Item` ?????? ??????

2. ?????? ?????? (e.g. Nomad Job - Java Driver)

3. Pipeline ?????? ??? `OK`

4. ????????? Jenkins Job??? Pipeline??? ???????????? ??????

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
       }
       stages {
           stage('Clone') {
               steps {
                   git branch: 'main',
                       credentialsId: 'jenkins_github',
                       url: 'https://github.com/Great-Stone/jenkins-gradle-nomad-pipeline'
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
                   sh 'mv ./build/libs/demo-0.0.1-SNAPSHOT.jar ./demo-${BUILD_NUMBER}.jar'
                   sh 'curl -F file=@./demo-${BUILD_NUMBER}.jar http://localhost:3000'
               }
           }
           stage('Nomad Download') {
               steps {
                   sh 'curl -C - --output nomad_1.3.1_darwin_amd64.zip https://releases.hashicorp.com/nomad/1.3.1/nomad_1.3.1_darwin_amd64.zip'
                   sh 'unzip -o nomad_1.3.1_darwin_amd64.zip'
               }
           }
           stage('Deploy To Nomad') {
               input{
                   message "Do you want to proceed for production deployment?"
               }
               steps {
                   sh './nomad job run -var version=${BUILD_NUMBER} ./nomad-java.hcl'
               }
           }
       }
   }
   ```

5. `?????? ??????`??? ???????????? ????????? ???????????????. ????????? ???????????? ????????? ???????????? ?????????????????????.

   ![image-20220627213452717](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627213452717.png)

   ![?????????????????????????????? 2022-06-27 21.35.35](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202022-06-27%2021.35.35.png)



### 4.2 Jenkins Job - Docker / ECR

> ECR - AWS ?????? ??????
>
> 1. AWS ????????? ??? ECR ???????????? ????????? ??? ????????? ??????????????? ??????
>
>    - Private ?????? ???????????? ?????? AWS Credential ????????? Jenkins??? ??????
>
> 2. ??????????????? ????????? ?????? ??? ?????? ?????? ????????? ????????? ????????? ??? ?????? ??????
>
> 3. ??????????????? ?????? ??? URI ??????
>
>    e.g. <id>.dkr.ecr.ap-northeast-2.amazonaws.com/demo



#### Plugin Setup

1. `Jenkins ??????` > `???????????? ??????` ??? ??????

2. `?????? ??????` ?????? ???????????? `AWS Global Configuration` , `Docker`, `Docker Pipeline`, `Amazon ECR` ??? ?????? ??? ??????

   ![image-20220627220001821](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627220001821.png)

   ![image-20220627220055393](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627220055393.png)

3. `Jenkins ??????` > `Manage Credentials` ??? ??????

4. Domains??? (global) ?????? ???????????? `Add credentials` ??????

![image-20220627220603230](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220627220603230.png)

- Kind : Secret text

- Scope : Global

- ID : ?????? (e.g. ecr_cred)

- Secret: JSON ????????? Secret

  - aws_access_key_id

  - aws_secret_access_key

  - aws_session_token (sts ??? ??????)

    ```json
    {"aws_access_key_id":"ASIA2LEU5EPEJQGXNMJU","aws_secret_access_key":"psGEnC5COCwcUojDo6EO/Ztd7J58THSVerEc7EE9","aws_session_token":"IQoJb3JpZ2luX2VjEMj//////////wEaCXVzLXdlc3QtMiJIMEYCIQDkdZ+GEya0j8gxM/Ow5GD5Kjr8e//pA/hARZm2Tok+JgIhAOrl0c8ctXkerxsNgSwAKSjmIrdbUyHxXVsuPl+GHgywKuAECOH//////////wEQARoMNzExMTI5Mzc1Njg4IgxAc1B5sczNlB7TgyAqtASCHs37YorM6spNTNftpvajNFGewy4z8ztDo83qx5+I67ldNnWnJBt2IHCYdtLBp1/wd/8yGYFKb/TWuOgjo0pdDKc2wJQ7gAbnB8d65OYzP2SSipqUJ/E4Tz/Ojgb0UQiAd8GcXEMdEe+9WBciSK5AD2CraMmbYlq2ThBjot8BOXJHG688IbI29/Qq+Y1WpozDpjNaeLm+kd9a9GWtX1XUXUvaXDcz+81RKW271uUp4n0JhfJ5PPUilxQVfISXtv7rEpp1PjhDE3c/oK6muK8SeeIIX7fAGi1cXqHMw9PfolQY6oAHUp3Acq+8uakNyOw8Usfl9xRDf1hQyAfofsz00DCmiZinuam8dg32R1pHW7JRBYgXXD5/dnp1A7KgdrjhjECpU8+Ayo/dAOqohOfTBYS/xMrVs8tkfUxHd/AKCca5oYda1YyIxdweBp/kEZHCZTkEpzY2TxEtzVsm5fEbjTViemglVmnkeDoZGeERVyXJlxVzW2of8I3hmKAeCENcH5L+Y"}
    ```

    



#### Pipeline

1. ?????? `+ ????????? Item` ?????? ??????

2. ?????? ?????? (e.g. Nomad Job - Docker Driver)

3. Pipeline ?????? ??? `OK`

4. ????????? Jenkins Job??? Pipeline??? ???????????? ?????? (Private)

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
           NOMAD_DOWNLOAD_URL = 'https://releases.hashicorp.com/nomad/1.3.1/nomad_1.3.1_darwin_amd64.zip'
           DOCKER_REGISTRY = '**********.dkr.ecr.ap-northeast-2.amazonaws.com'
           dockerImage = ''
           PATH = "/Users/gs/.rd/bin:${PATH}"
       }
       stages {
           stage('Clone') {
               steps {
                   git branch: 'main',
                       credentialsId: 'jenkins_github',
                       url: 'https://github.com/Great-Stone/jenkins-gradle-nomad-pipeline'
                   sh "ls -lat"
               }
           }
           stage('Test') {
               steps {
                   sh './gradlew test'
               }
           }
           stage('Java Build') {
               steps {
                   sh './gradlew build'
               }
           }
           stage('Docker Build') {
               steps {
                   script{
                       dockerImage = docker.build DOCKER_REGISTRY + "/demo:${BUILD_NUMBER}"
                   }
               }
           }
           stage('Docker Push') {
               steps {
                   script {
                       withCredentials([string(credentialsId: 'sts', variable: 'CREDS')]) {
                           def creds = readJSON text: CREDS
                           withEnv([
                               "AWS_ACCESS_KEY_ID=${creds.aws_access_key_id}",
                               "AWS_SECRET_ACCESS_KEY=${creds.aws_secret_access_key}",
                               "AWS_SESSION_TOKEN=${creds.aws_session_token}"
                           ]) {
                               sh '''
                               ECR_TOKEN=$(/usr/local/bin/aws ecr get-login-password --region ap-northeast-2)
                               echo "${ECR_TOKEN}" > ecr_token.txt
                               
                               echo "${ECR_TOKEN}" | docker login -u AWS --password-stdin ${DOCKER_REGISTRY}
   														'''
                               dockerImage.push()
                           }
                       }
                   }
               }
           }
           stage('Nomad Download') {
               steps {
                   sh 'curl -C - --output nomad.zip ${NOMAD_DOWNLOAD_URL}'
                   sh 'unzip -o nomad.zip'
               }
           }
           stage('Deploy To Nomad') {
               input{
                   message "Do you want to proceed for production deployment?"
               }
               steps {
                   sh './nomad job run -var image=${DOCKER_REGISTRY}/demo -var tag=${BUILD_NUMBER} -var ecr_token=$(cat ecr_token.txt) ./nomad-docker.hcl'
               }
           }
       }
       post {
           always {
               sh 'docker rmi ${DOCKER_REGISTRY}/demo:${BUILD_NUMBER}'
           }
       }
   
   }
   ```

5. `?????? ??????`??? ???????????? ????????? ???????????????. ????????? ???????????? ????????? ???????????? ?????????????????????.

   ![image-20220628190449600](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220628190449600.png)

   ![image-20220628190655610](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220628190655610.png)

