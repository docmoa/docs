---
meta:
  - name: Spring Boot Vault
    content: Spring Boot에 구성관리로 Vault 사용
tags: ["vault", "java", "spring"]

---

# Vault로 Spring Boot 구성관리

> Example Source : <https://github.com/Great-Stone/vault_springboot_example>

볼트는 애플리케이션(앱)의 구성관리, 특히 사용자 ID, 패스워드, Token, 인증서, 엔드포인트, AWS 자격증명 등과 같은 민감한 정보를 안전하게 저장하는 중앙 집중식 인프라를 제공한다. 서비스의 성장과 더불어, 이를 구성하는 앱은 확장과 분리 요구 사항이 발생하면 구성 관리가 어려워 진다. 특히, 시크릿 정보가 포함되는 구성 관리는 수동으로 관리하는 경우 로컬 환경을 포함한 여러 시스템에 노출되는 위험성을 갖고, 환경마다 다른 시크릿을 관리하기위한 유지 관리의 노력과 비용이 증가한다. 볼트에서 이야기하는 앱과 관련한 "시크릿 스프롤(퍼짐)" 현상은 다음과 같다.

- 시트릿의 위치가 파일 서버, Git 저장소, 로컬 환경, 앱 실행 환경등 다양한 곳에 존재하고 추적이 어려움
- 분산 서비스 및 Scale out/in 되는 앱 환경에 구성 설정의 변경 시 개별적 관리 필요
- 스크릿 사용의 위반 추적이 어렵고 거버넌스와 규제 요구사항에 대한 통제

본질적으로 시크릿 스프롤은 가시성과 통제력의 저하를 야기한다.



## 구성관리 개념

앱과 구성 관계에서 구성관리의 원칙은 다음과 같다.

- 구성은 앱과 분리되어야 한다.
- 앱은 한번 빌드되면 로직의 변화가 없는 경우 그대로 배포되어야 한다.
- 구성의 변경 사항은 앱의 런타임시 주입되어야 한다.
- 구성은 중앙집중화 되어 강력한 감사와 접근제어가 동반되어야 한다.
- 민감한 구성은 암호화 되어야 한다.
- 12 factor 앱 모범 사례에 따라, 중앙 저장소의 구성 데이터를 사용할 수 있도록(부트스트래핑) 앱을 설계해야 한다.



## 볼트의 구성관리 저장소 및 관리

볼트는 구성 요소에 대해 중앙 저장소를 제공하며 다음과 같은 주요 이점이 있다.

- 중앙 집중식 구성 저장소
- 저장되는 데이터의 암호화 저장
- KV 형태의 구성 저장 및 버전 관리
- 정책 기반 접근관리
- 감사 기능
- 저장 및 인증을 위한 플러그인 기반
- 동적 시크릿 발급 및 수명주기 관리
- 고가용성(HA) 아키텍처 제공
- 정적 구성 요소 관리를 위한 템플릿팅 지원 (xml, json 등)
- 다중 클러스터 간 복제



### [Example 1. Spring Boot Application]

앱을 위한 볼트 구성을 위해 다음과 같이 볼트를 실행한다.

```bash
$ vault server -dev -dev-root-token-id=root -log-level=trace

...
You may need to set the following environment variables:

    $ export VAULT_ADDR='http://127.0.0.1:8200'

The unseal key and root token are displayed below in case you want to
seal/unseal the Vault or re-authenticate.

Unseal Key: UTZ7HoZCu8dtWa/eSMKcwq1klhC/qFoDxHXmhRn4qnE=
Root Token: root
```

`root` 토큰은 구성관리 관리자의 권한으로 가정한다.

```bash
$ export VAULT_ADDR='http://127.0.0.1:8200'
$ vault login
Token (will be hidden): root

Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                  Value
---                  -----
token                root
token_accessor       w5LvrjTvDDcfjPHrnOj6ib7E
token_duration       ∞
token_renewable      false
token_policies       ["root"]
identity_policies    []
policies             ["root"]
```

Spring Boot 앱에서 사용할 KV를 활성화 한다.

```bash
$ vault secrets enable -path=demo-app -version=2 kv

Success! Enabled the kv secrets engine at: demo-app/
```



예제에서는 구성관리에서 MySQL 정보를 관리한다고 가정합니다. 관련 Spring Boot 앱은 [spring initializr](https://start.spring.io)를 통해 생성한다.

![image-20230406150032627](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230406150032627.png)

테스트를 위한 종속성 목록은 다음과 같다.

| Dependencies        | 설명                                                         |
| ------------------- | ------------------------------------------------------------ |
| Spring Web          | Spring MVC를 사용하여 RESTful을 포함한 웹 애플리케이션 구축에 사용 |
| MySQL Driver        | MySQL을 사용하기위한 드라이버 (MySQL 없는 경우 생략)         |
| Spring Data JPA     | JPA를 사용하기 편하도록 만들어놓은 모듈 (MySQL 없는 경우 생략) |
| Vault Configuration | 분산 시스템에서 외부화된 볼트 구성에 대한 클라이언트 측 지원을 제공 |
| Lombok              | 기계적인 코드들을 어노테이션을 기반으로 코드를 자동화하여 작성해주는 Java의 라이브러리 |



MySQL의 경우 다음과 같이 구성한다.

```sql
CREATE DATABASE java_dev_db;
CREATE USER 'dev-user'@'%' IDENTIFIED BY 'dev-password';
GRANT ALL PRIVILEGES ON java_dev_db.* TO 'dev-user'@'%';
```



앱에서 사용할 구성을 볼트의 `demo-app/java_and_vault/dev`에 추가한다. 엔드포인트 정보의 조합은 `<kv_endpoint>/<app_name>/<profile>` 이다. 다음과 같이 CLI를 사용하여 구성 정보를 추가한다.

```bash
$ vault kv put demo-app/java_and_vault/dev \
		app.config.auth.token=MY-AUTH-TOKEN-DEV-0000 \
		app.config.auth.username=dev-user \
		spring.datasource.database=java_dev_db \
		spring.datasource.password=dev-password \
		spring.datasource.username=dev-user
```

UI에서 확인해보면 결과는 다음과 같다.

![image-20230407093720360](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230407093720360.png)



앱과 볼트 연동 구성을 위해 다음을 추가한다. 기존 `application.properties` 대신 `application.yml`로 변경하여 구성한다.

```yaml
spring:
  application:
    name: java_and_vault
  cloud.vault:
      host: 127.0.0.1
      port: 8200
      scheme: http
      config:
        lifecycle:
          enabled: false
      authentication: TOKEN
      token: root
      kv:
        enabled: true
        backend: demo-app
        profile-separator: '/'
      generic:
        enabled: false
  config:
    import: vault://
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/${spring.datasource.database}
```

- `spring.cloud.vault` 에 볼트 관련 설정이 추가된다.
  - `host` : 볼트 서버의 호스트이름 또는 IP를 설정한다.
  - `port` : 볼트 서버의 포트를 설정한다.
  - `scheme` : 볼트 서버와의 통신에 사용할 프로토콜을 설정한다.
  - `config.lifecycle.enabled`의 경우 동적인 시크릿에 대한 생명주기 관리 동작 여부를 설정한다. 여기서는 정적인 구성을 사용하므로 `false`로 설정한다.
- `spring.cloud.vault.authentication`은 관리자 테스트를 위해 `TOKEN`으로 입력한다.
- `spring.cloud.vault.token`은 관리자용 인증인 `root`를 입력한다.
- `spring.cloud.vault.kv`는 활성화한 KV 의 선언을 위한 계층이다.
  - `enalbed` : 활성화 여부를 boolean 값으로 설정한다.
  - `backend` : KV가 활성화된 엔드포인트 경로 이름을 입력한다. 기본 값은 `secret`이다.
- `spring.cloud.vault.generic`은 v1 타입의 KV 선언을 위한 계층이다.
  - `enalbed` : 활성화 여부를 boolean 값으로 설정한다. 사용되지 않으므로 `false`로 설정한다.
- `spring.config.import`에 `vault://`를 지정하여 볼트를 PropertySource로 마운트한다.
- `spring.datasource`에서 MySQL 연동관련 정의를 설정한다.
  - `url` : DB Connection Url을 명시한다. 
  - `database` : DB의 이름을 정의한다. 여기서는 볼트에서 해당 값을 가져온다.
  - `username` : DB 계정 사용자 이름을 정의한다. 여기서는 볼트에서 해당 값을 가져오므로 생략되었다.
  - `password` : DB 계정 사용자 패스워드를 정의한다. 여기서는 볼트에서 해당 값을 가져오므로 생략되었다.



기본 패키지 경로(e.g. `src/main/java/com/example/demo`)에 다음의 Java 파일을 추가한다.

| AppConfiguration.java

```java
package com.example.demo;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Configuration
@ConfigurationProperties("app.config.auth")
public class AppConfiguration {
    private String username;
    private String token;
}
```

- `@ConfigurationProperties`에 정의한 `app.config.auth`로 마운팅된 볼트의 내용을 주입한다.
- `AppConfiguration` 클래스는 어노테이션 정의에 따라 볼트로부터 내부에 정의되는 변수 `username`과 `token` 값이 할당된다.



| AppService.java

```java
package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@RequiredArgsConstructor
public class AppService {
    private final AppConfiguration appConfiguration;
    @PostConstruct
    public void readConfigs() {
        log.info("Reading configuration {} - {}", appConfiguration.getToken(), appConfiguration.getUsername());
    }
}
```

- `readConfigs()` 메소드에 로그 출력에서 볼트로부터 할당된 변수 값을 확인한다.



| DemoApplication.java

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
public class DemoApplication {

	@Value("${spring.datasource.username}")
	private String ds_name;

	@Value("${spring.datasource.password}")
	private String ds_pw;

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@PostConstruct
	public void readDBconfigs() {
			log.info("Reading datasource config {} - {}", ds_name, ds_pw);
	}
}
```

- `@Value` 로 볼트에서 가져오는 구성정보가 `application.yml`에 정의되어야 하는 구성 정보에 주입된 값을 받아온다.
- `readDBconfigs()` 메소드에 로그 출력에서 볼트로부터 할당된 구성 값을 확인한다.



앱을 실행하여 구성을 가져오는지 확인한다.

```bash
$ gradle bootRun --args='--spring.profiles.active=dev'

> Task :bootRun

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.0.5)

# dev profile이 사용됨을 표기
2023-04-06T17:15:58.395+09:00  INFO 48275 --- [           main] 
com.example.demo.DemoApplication         : The following 1 profile is active: "dev"

# 앱 구성의 spring.datasource 에서 정의하는 정보가 볼트에서 가져와서 실행되어 Connection Pool이 생성되고, 가져온 계정 정보가 출력됨을 확인
2023-04-06T17:16:00.359+09:00  INFO 48275 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2023-04-06T17:16:00.614+09:00  INFO 48275 --- [           main] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Added connection com.mysql.cj.jdbc.ConnectionImpl@57416e49
2023-04-06T17:16:00.616+09:00  INFO 48275 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
...
2023-04-07T08:57:39.888+09:00  INFO 52598 --- [           main] com.example.demo.DemoApplication         : Reading datasource config dev-user - dev-password

# 앱 구성 app.config.auth 항목을 볼트에서 가져와서 출력됨을 확인
2023-04-06T17:16:01.363+09:00  INFO 48275 --- [           main] com.example.demo.AppService              : Reading configuration MY-AUTH-TOKEN-DEV-0000 - dev-user
```



### [Example 2. Spring Boot Application + RBAC]

`Example 1`에서는 볼트의 루트 사용자를 사용하여 모든 구성 값을 확인할 수 있지만 앱과 이를 배포하는 사람, 파이프라인은 특정 구성에 대한 정보만 확인할 수 있어야 한다. 여기서는 `prd` 프로파일을 위한 구성과 정책 정의에 대해 확인한다.



MySQL의 경우 다음과 같이 구성한다.

```sql
CREATE DATABASE java_prd_db;
CREATE USER 'prd-user'@'%' IDENTIFIED BY 'prd-password';
GRANT ALL PRIVILEGES ON java_prd_db.* TO 'prd-user'@'%';
```

`prd`를 위한 구성정보를 볼트에 추가한다.

```bash
$ vault kv put demo-app/java_and_vault/prd \
		app.config.auth.token=MY-AUTH-TOKEN-prd-1111 \
		app.config.auth.username=prd-user \
		spring.datasource.database=java_prd_db \
		spring.datasource.password=prd-password \
		spring.datasource.username=prd-user
```

![image-20230407094227005](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230407094227005.png)

구성 관리자를 위한 Policy `java-and-vault-prd-admin.hcl`파일 내용 및 적용은 다음과 같다.

```bash
$ cat java-and-vault-prd-admin.hcl

path "demo-app/data/java_and_vault/prd" {
  capabilities = ["create", "update", "read"]
}

$ vault policy write java-and-vault-prd-admin java-and-vault-prd-admin.hcl

Success! Uploaded policy: java-and-vault-prd-admin
```



구성을 읽을수만 있는 Policy `java-and-vault-prd-read.hcl`파일 내용 및 적용은 다음과 같다. 

```bash
$ cat java-and-vault-prd-read.hcl

path "demo-app/data/java_and_vault/prd" {
  capabilities = ["read"]
}

$ vault policy write java-and-vault-prd-read java-and-vault-prd-read.hcl

Success! Uploaded policy: java-and-vault-prd-read
```



앱을 위한 계정을 발급하기위한 Policy인 `java-and-vault-prd-approle.hcl` 파일 내용은 다음과 같다.

```bash
$ cat java-and-vault-prd-approle.hcl

path "auth/approle/role/java-vault-prd/role-id" {
  capabilities = ["read"]
}

path "auth/approle/role/java-vault-prd/secret-id" {
  capabilities = ["create", "update"]
}

$ vault policy write java-and-vault-prd-approle java-and-vault-prd-approle.hcl

Success! Uploaded policy: java-and-vault-prd-approle
```



관리자에게  `java-and-vault-prd-admin`, `java-and-vault-prd-approle` 를 부여하여 구성에 대한 관리와 앱을위한 계정 발급 권한을 준다.

```bash
# 활성화 되어있지 않다면 userpass Auth Method 활성화
$ vault auth enable userpass

Success! Enabled userpass auth method at: userpass/

$ vault write auth/userpass/users/app-prd-admin password=password policies=java-and-vault-prd-admin,java-and-vault-prd-approle

Success! Data written to: auth/userpass/users/app-prd-admin
```



앱을 위한 AppRole인증에 `java-and-vault-prd-read`를 추가한다.

```bash
# 활성화 되어있지 않다면 approle Auth Method 활성화
$ vault auth enable approle

Success! Enabled approle auth method at: approle/

$ vault write auth/approle/role/java-vault-prd \
    secret_id_ttl=10m \
    token_period=24h \
    policies="java-and-vault-prd-read"
    
Success! Data written to: auth/approle/role/java-vault-prd
```



생성한 관리자 계정으로 로그인 하면 `demo-app/java_and_vault/prd` 의 구성 변경과 AppRole 계정의 `secret-id` 발급이 가능한지 확인한다. (별도의 터미널)

```bash
$ export VAULT_ADDR=http://127.0.0.1:8200
$ vault login -method userpass username=app-prd-admin password=password

Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                    Value
---                    -----
token                  hvs.CAESIAE31Vrf91UbPhV5O0eh8KM0Tky_7MGk5ThyRu4tJbhUGh4KHGh2cy50ZDdZZ09BdDRnRmpqdkVRcUJYOWR5YUI
token_accessor         9XuvRw1jKWt99iwlZ146652v
token_duration         768h
token_renewable        true
token_policies         ["default" "java-and-vault-prd-admin" "java-and-vault-prd-approle"]
identity_policies      []
policies               ["default" "java-and-vault-prd-admin" "java-and-vault-prd-approle"]
token_meta_username    app-prd-admin

$ vault kv put demo-app/java_and_vault/prd \
    app.config.auth.token=MY-AUTH-TOKEN-prd-1111 \
    app.config.auth.username=prd-user \
    spring.datasource.database=java_prd_db \
    spring.datasource.password=prd-password \
    spring.datasource.username=prd-user
    
========== Secret Path ==========
demo-app/data/java_and_vault/prd

======= Metadata =======
Key                Value
---                -----
created_time       2023-04-07T01:54:45.464698Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            2

$ vault read auth/approle/role/java-vault-prd/role-id

Key        Value
---        -----
role_id    53b96749-1234-fec1-05b8-760c29991d89

$ vault write -f auth/approle/role/java-vault-prd/secret-id

Key                   Value
---                   -----
secret_id             69b144ae-543a-81e3-9afa-8b290d8efd75
secret_id_accessor    d9338290-f1ff-ca09-fbaf-742071afeaa6
secret_id_num_uses    0
secret_id_ttl         10m
```



앱에서 사용할 AppRole 계정으로 로그인 하면 `demo-app/java_and_vault/prd` 의 구성 변경을 읽을수는 있고 업데이트는 안되는 여부를 확인한다. (별도의 터미널)

```bash
$ export VAULT_ADDR=http://127.0.0.1:8200
$ vault write auth/approle/login \
    role_id=53b96749-1234-fec1-05b8-760c29991d89 \
    secret_id=aebbc4ac-79e4-c529-8751-c52f2f31a3d7

Key                     Value
---                     -----
token                   hvs.CAESIC7bpDI_cDGLCpKl6rZ
token_accessor          guDRqHNpnJtpmFXqkqsahc2e
token_duration          24h
token_renewable         true
token_policies          ["default" "java-and-vault-prd-read"]
identity_policies       []
policies                ["default" "java-and-vault-prd-read"]
token_meta_role_name    java-vault-prd

# 앱용 계정은 부여된 권한에 읽기 권한이 있으므로 정보 확인
$ VAULT_TOKEN=hvs.CAESIC7bpDI_cDGLCpKl6rZ vault kv get demo-app/java_and_vault/prd

========== Secret Path ==========
demo-app/data/java_and_vault/prd

======= Metadata =======
Key                Value
---                -----
created_time       2023-04-07T01:54:45.464698Z
custom_metadata    <nil>
deletion_time      n/a
destroyed          false
version            2

=============== Data ===============
Key                           Value
---                           -----
app.config.auth.token         MY-AUTH-TOKEN-prd-1111
app.config.auth.username      prd-user
spring.datasource.database    java_prd_db
spring.datasource.password    prd-password
spring.datasource.username    prd-user

# 앱용 계정은 부여된 권한에 쓰기 권한이 없으므로 관련 요청시 권한 거부
$ VAULT_TOKEN=hvs.CAESIC7bpDI_cDGLCpKl6rZ vault kv put demo-app/java_and_vault/prd \
    app.config.auth.token=MY-AUTH-TOKEN-prd-2222

Error writing data to demo-app/data/java_and_vault/prd: Error making API request.

URL: PUT http://127.0.0.1:8200/v1/demo-app/data/java_and_vault/prd
Code: 403. Errors:

* 1 error occurred:
	* permission denied
```



앱과 정책이 적용된 볼트 연동 구성을 위해 `application.yml`를  수정한다.

```yaml
spring:
  application:
    name: java_and_vault
  cloud.vault:
      host: 127.0.0.1
      port: 8200
      scheme: http
      config:
        lifecycle:
          enabled: false
      # authentication: TOKEN
      # token: root
      authentication: APPROLE
      app-role:
        role-id: 53b96749-1234-fec1-05b8-760c29991d89
        secret-id: aebbc4ac-79e4-c529-8751-c52f2f31a3d7
        role: db-kv-reader
        app-role-path: approle
      kv:
        enabled: true
        backend: demo-app
        profile-separator: '/'
      generic:
        enabled: false
  config:
    import: vault://
  datasource:
    url: jdbc:mysql://127.0.0.1:3306/${spring.datasource.database}
```

- `spring.cloud.vault.authentication`은 앱용 인증으로 생성한 방식인 `APPROLE`을 설정한다.
- `spring.cloud.vault.authentication.app-role`은 `APPROLE`인증에 대한 선언을 위한 계층이다.
  - `role-id` : 발급한 `role-id`를 설정한다.
  - `secret-id` : 발급한 `secret-id`를 설정한다. `secret-id`는 제한시간이 `10m`이였으므로, 배포시마다 교체해주어 계정을 보호한다.
  - `role` : `role-id`가 포함된 Approle의 이름을 설정한다.
  - `app-role-path` : 활성화된 Approle의 엔드포인트 경로 이름을 입력한다.



앱을 실행하여 구성을 가져오는지 확인한다.  `prd` 프로파일을 지정한다.

```bash
$ gradle bootRun --args='--spring.profiles.active=prd'                                                                      

> Task :bootRun

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.0.5)

# prd profile이 사용됨을 표기
2023-04-07T14:05:03.395+09:00  INFO 67782 --- [           main] com.example.demo.DemoApplication         : The following 1 profile is active: "prd"

# 앱 구성의 spring.datasource 에서 정의하는 정보가 볼트에서 가져온 계정 정보가 출력됨을 확인
2023-04-07T14:05:05.099+09:00  INFO 67782 --- [           main] com.example.demo.DemoApplication         : Reading datasource config prd-user - prd-password

# 앱 구성 app.config.auth 항목을 볼트에서 가져와서 출력됨을 확인
2023-04-07T14:05:05.103+09:00  INFO 67782 --- [           main] com.example.demo.AppService              : Reading configuration MY-AUTH-TOKEN-prd-1111 - prd-user
```



권한이 없는  `dev` 프로파일을 지정하는 경우 구성 값을 가져오지 못하므로 앱이 실행될 때 에러가 발생한다.