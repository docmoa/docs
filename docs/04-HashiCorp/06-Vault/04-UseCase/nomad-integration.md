---
meta:
  - name: Vault - Nomad Integration
    content: 애플리케이션 변경을 최소화 하여 Vault와 연동하기
tags: ["nomad", "vault", "aws", "db"]

---

# Vault & Nomad Integration Test

> Dev Mode 를 활용한 테스트
>
> - **목적** : Spring boot 기반 애플리케이션에서 Nomad 를 이용하여 Vault의 dynamic secret 을 최소한의 코드변경으로 사용할 수 있는 워크 플로우 구성
>
> - **코드 기반 인경우의 예제** : <https://dev.to/aws-builders/aws-sts-with-spring-cloud-vault-1e5g>
>
> - **Vault-Nomad Integration** : <https://www.nomadproject.io/docs/integrations/vault-integration>
>
> - **Version** ([Download](https://releases.hashicorp.com))
>
>   - Nomad v1.3.1 (2b054e38e91af964d1235faa98c286ca3f527e56)
>   - Vault v1.10.3 (af866591ee60485f05d6e32dd63dde93df686dfb)
>
> - Kubernetes 환경인 경우 Vault CSI Provider를 통해 비슷한 구성 가능 : <https://www.vaultproject.io/docs/platform/k8s/csi>

<iframe width="560" height="315" src="https://www.youtube.com/embed/OwUuPw2dcQQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 1. Vault

### 1.1 Vault Dev Run 

```bash
vault server -dev -dev-root-token-id=root
```



### 1.2 Vault Setup

> Another terminal

#### Vault Env

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



#### Vault Policy for AWS & DB

```bash
cat <<EOF | vault policy write aws_policy -
path "aws/sts/s3" {
  capabilities = ["read","update"]
}
EOF

cat <<EOF | vault policy write db_policy -
path "db/creds/mysql" {
  capabilities = ["read","update"]
}
EOF
```



#### Create Token Role

```bash
vault write auth/token/roles/nomad-cluster allowed_policies="aws_policy,db_policy" disallowed_policies="$NOMAD_POLICY" token_explicit_max_ttl=0 orphan=true token_period="259200" renewable=true
```



#### Create Token

```bash
vault token create -field token -policy $NOMAD_POLICY -period 72h -orphan > /tmp/token.txt
# vault token create -field token -role nomad-cluster -period 72h -orphan > /tmp/token.txt
```





## 2. Nomad

- Docker 이미지 실행을 위해서는 Nomad 실행 환경에 Docker가 설치되어야 합니다.

- Java 실행을 위해서는 Nomad 실행 환경에 Java가 설치되어야 합니다.

  ```bash
  $ docker version
  Client:
   Version:           20.10.9
   API version:       1.41
   ...
  
  Server:
   Engine:
    Version:          20.10.14
    API version:      1.41 (minimum version 1.12)
    ...
    
  $ java -version
  openjdk version "11.0.14.1" 2022-02-08
  OpenJDK Runtime Environment Temurin-11.0.14.1+1 (build 11.0.14.1+1)
  OpenJDK 64-Bit Server VM Temurin-11.0.14.1+1 (build 11.0.14.1+1, mixed mode)
  ```

  

### 2.1 Nomad Dev Run (Vault Integrated)

```bash
nomad agent -dev -vault-enabled=true -vault-address=http://127.0.0.1:8200 -vault-token=$(cat /tmp/token.txt) -vault-tls-skip-verify=true -vault-create-from-role=nomad-cluster
```



### 2.2. Nomad Env

> Another terminal

```bash
export NOMAD_ADDR=http://127.0.0.1:4646
```



### 2.2 Mysql

```bash
cat <<EOF | nomad job run -
job "mysql" {
  datacenters = ["dc1"]

  type = "service"

  group "mysql-group" {
    count = 1

    network {
	    port "db" {
	      to = 3306
      	static = 3306
      }
    }

    task "mysql-task" {
      driver = "docker"

      config {
        image = "mysql:5"
        ports = ["db"]
      }
      
      env {
        MYSQL_ROOT_PASSWORD = "rooooot"
      }
    }
  }
}
EOF
```



## 3. Dynamic Secret

### 3.1 AWS

```bash
$ export AWS_ACCESS_KEY=AKIAU3NXDWRUFZSXYRNX
$ export AWS_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
$ export AWS_REGION=ap-northeast-2

$ vault secrets enable aws

$ vault write aws/config/root \
    access_key=$AWS_ACCESS_KEY \
    secret_key=$AWS_SECRET_KEY \
    region=$AWS_REGION

$ vault write aws/roles/s3 \
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

$ vault write aws/sts/s3 ttl=15m

Key                Value
---                -----
lease_id           aws/sts/s3/lasSraK69Ii19tUIzI9yXLnR
lease_duration     14m59s
lease_renewable    false
access_key         ASIAU3NXDWRUOZPCWIGY
secret_key         FXWXK2xHlBbsHhepuZN2yuN5C8kd7qi2PKyMVf+t
security_token     IQoJb3JpZ2luX2VjEND//////////wEaDmFwLW5vcnRoZWFzdC0y
```



### 3.2 DB

```bash
$ vault secrets enable -path=db database

$ vault write db/config/my-mysql-database \
    plugin_name=mysql-database-plugin \
    connection_url="{{username}}:{{password}}@tcp(127.0.0.1:3306)/" \
    allowed_roles="mysql" \
    username="root" \
    password="rooooot"

$ vault write db/roles/mysql \
    db_name=my-mysql-database \
    creation_statements="CREATE USER '{{name}}'@'%' IDENTIFIED BY '{{password}}';GRANT SELECT ON *.* TO '{{name}}'@'%';" \
    default_ttl="5s" \
    max_ttl="10s"

$ vault read db/creds/mysql

Key                Value
---                -----
lease_id           db/creds/mysql/VuufZZP1NO9thZj4pPnNtPdU
lease_duration     10s
lease_renewable    true
password           WkFTPwWPrCe3yeWQoS--
username           v-token-mysql-Cy7p0vP6uOYnW7csKz
```



## 4. Sample Spring-boot

> https://start.spring.io/

![Spring Initializr 2022-05-27 22-22-15](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Spring%20Initializr%202022-05-27%2022-22-15.png)

- Spring Web
- Cloud Bootstrap
- Spring Boot Actuator



### 4.1 demo app

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
import org.springframework.cloud.context.config.annotation.RefreshScope;
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
@RefreshScope
@SpringBootApplication
@EnableScheduling
public class DemoApplication {

	private static String FILE_PATH;

	@Value("${dynamic.path}")
	public void setKey(String value) {
		FILE_PATH = value;
	}

	private boolean flag = true;

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
		.concat("<h2>" + str.get(1) + "</h2>")
		.concat("<h2>" + str.get(2) + "</h2>")
		.concat("<br>")
		.concat("<h1>MySQL</h1>")
		.concat("<h2>" + str.get(3) + "</h2>")
		.concat("<h2>" + str.get(4) + "</h2>");
	}
}
```



### 4.2 Set dummy properties & Test

```bash
cat <<EOF> /tmp/dynamic.properties
aws_access_key=abc
aws_secret_key=def
aws_secret_token=ghi
db_username=user
db_password=pw
EOF
```

```bash
$ mvn spring-boot:run
...
[aws_access_key=abc, aws_secret_key=def, aws_secret_token=ghi, db_username=user, db_password=pw]
```



<http://localhost:8080>

![image-20220527225739417](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220527225739417.png)

```bash
cat <<EOF> /tmp/dynamic.properties
aws_access_key=123
aws_secret_key=456
aws_secret_token=789
db_username=user1
db_password=pw2
EOF
```

![image-20220527225811346](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20220527225811346.png)



### 4.3 build jar

```bash
$ mvn install
...
[INFO] Building jar: /Users/gs/Downloads/demo/target/demo-0.0.1-SNAPSHOT.jar
...
```



### 4.4 build container

```bash
$ cat <<EOF> Dockerfile
FROM amazoncorretto:11
ARG JAR_FILE=target/demo-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
ENV JAVA_OPTS=""
CMD java $JAVA_OPTS -server -jar app.jar
EOF
```

```bash
$ docker build -t java/vault .
Step 1/5 : FROM amazoncorretto:11
11: Pulling from library/amazoncorretto
8de5b65bd171: Pull complete 
6d24904f7237: Pull complete 
Digest: sha256:34810d3d08456f7e658747d47aec5afc052fcfb2dcadf25db80a51f63086532d
Status: Downloaded newer image for amazoncorretto:11
 ---> 299f114f2f6b
Step 2/5 : ARG JAR_FILE=target/demo-0.0.1-SNAPSHOT.jar
 ---> Running in 5a0662c5b4a5
Removing intermediate container 5a0662c5b4a5
 ---> 608c348e23ac
Step 3/5 : COPY ${JAR_FILE} app.jar
 ---> 36d147070bd3
Step 4/5 : ENV JAVA_OPTS=""
 ---> Running in 58cb66bb0eab
Removing intermediate container 58cb66bb0eab
 ---> f92b3ffeac4d
Step 5/5 : CMD java $JAVA_OPTS -server -jar app.jar
 ---> Running in a5d4d1071697
Removing intermediate container a5d4d1071697
 ---> 67ae9829dc07
Successfully built 67ae9829dc07
Successfully tagged java/vault:latest
```



## 5. Nomad Job with dynamic secret

- Nomad Job 명세의 `template`을 활용하여 Nomad와 연계된 Vault의 시크릿을 작성 할 수 있음

  - File (파일)

  - Env (환경변수) : `env` 설정이 `true`인경우

- Nomad Job에서는 앞서 Vault에서 선언한  `nomad-cluster` token role에서 정의한 Policy만을 사용할 수 있음

- `change_mode` 값이 기본 `restart`이므로 aws와 db 크리덴셜 같이 ttl 이 적용되는 경우 만료시 자동 갱신되기 때문에 파일과 환경변구 갱신만을 하기 위해서는 `noop`으로 설정 필요


### 5.1 Nomad Job Sample Run (Java Driver)

```ruby
$ cat <<EOF | nomad job run -
job "java-test" {
  datacenters = ["dc1"]

  type = "service"

  group "java" {
    count = 1

    network {
	    port "http" {} # random port
    }
    
    vault {
      namespace = ""
      policies = ["aws_policy","db_policy"]
      change_mode = "noop"
    }

    task "java-task" {
      driver = "java"

      config {
        jar_path = "/demo/target/demo-0.0.1-SNAPSHOT.jar"
      }
      env {
        DYNAMIC_PROPERTIES_PATH = "local/dynamic.properties"
      }
      template {
        data = <<EOH
{{- with secret "aws/sts/s3" "ttl=15m" }}
aws_access_key={{ .Data.access_key | toJSON }}
aws_secret_key={{ .Data.secret_key | toJSON }}
aws_secret_token={{ .Data.security_token | toJSON }}
{{- end }}
{{- with secret "db/creds/mysql" }}
db_username={{ .Data.username | toJSON }}
db_password={{ .Data.password | toJSON }}
{{- end }}
      EOH
				env = true
				destination = "local/dynamic.properties"
				change_mode = "noop"
      }
    }
  }
}
EOF
```



### 5.2 Nomad Job Sample Run (Docker Driver)

::: warning
Nomad Dev 모드에서는 파일시스템 접근권한이 없으므로 Prod 모드 구성 필요
:::

```ruby
$ cat <<EOF | nomad job run -
job "docker-test" {
  datacenters = ["dc1"]

  type = "service"

  group "docker" {
    count = 1

    network {
	    port "http" {}
    }
    
    vault {
      namespace = ""
      policies = ["aws_policy","db_policy"]
      change_mode = "noop"
    }

    task "docker-task" {
      driver = "docker"

      config {
        image = "hahohh/java-vault-nomad-demo:0.0.1"
        ports = ["http"]
        volumes = [
          "local:/tmp",
        ]
        # auth {
        #   username = "registry username"
        #   password = "registry password"
        # }
      }
      env {
        DYNAMIC_PROPERTIES_PATH = "/local/dynamic.txt"
      }
      template {
        data = <<EOH
{{- with secret "aws/sts/s3" "ttl=15m" }}
aws_access_key={{ .Data.access_key | toJSON }}
aws_secret_key={{ .Data.secret_key | toJSON }}
aws_secret_token={{ .Data.security_token | toJSON }}
{{- end }}
{{- with secret "db/creds/mysql" }}
db_username={{ .Data.username | toJSON }}
db_password={{ .Data.password | toJSON }}
{{- end }}
      EOH
				env = true
				destination = "local/dynamic.txt"
				change_mode = "noop"
      }
    }
  }
}
EOF
```