---
description: Keycloak SAML Demo
tag: ["Keycloak", "SAML", "Demo"]
toc: true
---

# Keycloak SAML Demo

Keycloak을 사용하여 SAML 2.0을 구현하는 방법을 설명합니다.

> 관련 문서: [OAuth, OIDC, SAML](../../06-etc/infomation/oidc-saml-oauth.html)

::: tip 실행 가능한 데모

실행 가능한 데모 코드는 GitHub에서 확인할 수 있습니다:

- **GitHub Repository**: [Great-Stone/keycloak-saml-demo](https://github.com/Great-Stone/keycloak-saml-demo)

이 데모는 Docker Compose를 사용하여 Keycloak 서버와 Node.js Express SAML 클라이언트 앱을 함께 실행할 수 있는 예제를 제공합니다.

:::

## Keycloak SAML 개요

Keycloak은 SAML 2.0 Identity Provider(IdP)와 Service Provider(SP)로 모두 동작할 수 있습니다. 이 문서에서는 Keycloak을 SAML IdP로 사용하는 방법을 설명합니다.

## Keycloak SAML 클라이언트 설정

### 1. Realm 생성

**관리 콘솔에서:**

1. "Create Realm" 클릭
2. Realm 이름 입력 (예: `myrealm`)
3. "Create" 클릭

**CLI 또는 Terraform으로:**

::: code-tabs#realm

@tab CLI

```bash
# Keycloak Admin CLI 인증
kcadm.sh config credentials --server http://localhost:8080 \
  --realm master --user admin --password admin

# Realm 생성
kcadm.sh create realms -s realm=myrealm -s enabled=true
```

@tab Terraform

```hcl
# terraform/versions.tf
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    keycloak = {
      source  = "mrparkers/keycloak"
      version = "~> 4.0"
    }
  }
}

# terraform/provider.tf
provider "keycloak" {
  url      = var.keycloak_url
  username = var.keycloak_username
  password = var.keycloak_password
}

# terraform/variables.tf
variable "keycloak_url" {
  description = "Keycloak 서버 URL"
  type        = string
  default     = "http://localhost:8080"
}

variable "keycloak_username" {
  description = "Keycloak 관리자 사용자명"
  type        = string
  default     = "admin"
}

variable "keycloak_password" {
  description = "Keycloak 관리자 비밀번호"
  type        = string
  sensitive   = true
}

# terraform/realm.tf
resource "keycloak_realm" "myrealm" {
  realm   = "myrealm"
  enabled = true
}
```

:::

### 2. SAML 클라이언트 생성 (관리 콘솔)

Keycloak 관리 콘솔에서:

1. Realm 선택 (예: `myrealm`)
2. "Clients" → "Create client" 클릭
3. 다음 정보 입력:
   - **Client type**: `SAML 2.0`
   - **Client ID**: `myapp-saml`
   - **Next** 클릭
4. 다음 설정 구성:
   - **Client SAML Endpoint**: `http://localhost:8081/myapp/saml`
   - **Name ID Format**: `email` 또는 `persistent`
   - **Valid Redirect URIs**: `http://localhost:8081/myapp/*`
   - **Master SAML Processing URL**: `http://localhost:8081/myapp/saml`
5. "Save" 클릭

### 3. SAML 클라이언트 생성 (CLI / Terraform)

::: code-tabs#saml-client

@tab CLI

```bash
# Keycloak Admin CLI 인증
kcadm.sh config credentials --server http://localhost:8080 \
  --realm master --user admin --password admin

# SAML 클라이언트 생성
kcadm.sh create clients -r myrealm -s clientId=myapp-saml \
  -s enabled=true \
  -s protocol=saml \
  -s 'redirectUris=["http://localhost:8081/myapp/*"]' \
  -s 'attributes.saml_name_id_format=email' \
  -s 'attributes.saml_assertion_signer=KEYCLOAK' \
  -s 'attributes.saml_force_name_id_format=true'
```

@tab Terraform

```hcl
# terraform/saml-client.tf

resource "keycloak_saml_client" "myapp_saml" {
  realm_id  = keycloak_realm.myrealm.id
  client_id = "myapp-saml"
  enabled   = true
  
  name_id_format = "email"
  
  valid_redirect_uris = [
    "http://localhost:8081/myapp/*"
  ]
  
  # SAML 특정 설정
  sign_assertions     = true
  sign_documents      = false
  force_name_id_format = true
}
```

:::

**Terraform 사용 시 참고:**

Terraform을 사용하려면 먼저 provider를 설정해야 합니다. 위의 "1. Realm 생성" 섹션의 Terraform 예시를 참고하세요.

### 4. SAML 메타데이터 다운로드

Keycloak 관리 콘솔에서:

1. Realm 선택
2. "Clients" → SAML 클라이언트 선택
3. "Installation" 탭 선택
4. "Keycloak SAML 2.0 IdP Metadata" 형식 선택
5. 메타데이터 XML 다운로드

또는 직접 URL로 접근:

```
http://localhost:8080/realms/myrealm/protocol/saml/descriptor
```

## SAML Service Provider 설정 (애플리케이션 측)

### Java / Spring Boot 예시

**pom.xml:**

```xml
<dependency>
    <groupId>org.keycloak</groupId>
    <artifactId>keycloak-saml-adapter-core</artifactId>
    <version>21.0.0</version>
</dependency>
<dependency>
    <groupId>org.keycloak</groupId>
    <artifactId>keycloak-spring-boot-starter</artifactId>
    <version>21.0.0</version>
</dependency>
```

**application.yml:**

```yaml
keycloak:
  realm: myrealm
  auth-server-url: http://localhost:8080
  resource: myapp-saml
  credentials:
    secret: your-client-secret
  ssl-required: external
  use-resource-role-mappings: true
  principal-attribute: preferred_username
```

**SecurityConfig.java:**

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public KeycloakConfigResolver keycloakConfigResolver() {
        return new KeycloakSpringBootConfigResolver();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated()
            )
            .oauth2Login();
        return http.build();
    }
}
```

### SAML Adapter XML 설정

애플리케이션에서 Keycloak을 SAML IdP로 사용하려면 `keycloak-saml.xml` 파일을 생성합니다:

```xml
<!-- keycloak-saml.xml -->
<keycloak-saml-adapter xmlns="urn:keycloak:saml:adapter"
                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <SP entityID="http://localhost:8081/myapp"
        sslPolicy="EXTERNAL"
        nameIDPolicyFormat="urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress"
        logoutPage="/logout.jsp"
        forceAuthentication="false">
        <Keys>
            <Key signing="true">
                <KeyStore resource="/WEB-INF/keystore.jks" password="store123">
                    <PrivateKey alias="http://localhost:8081/myapp" password="test123"/>
                    <Certificate alias="http://localhost:8081/myapp"/>
                </KeyStore>
            </Key>
        </Keys>
        <PrincipalNameMapping policy="FROM_NAME_ID"/>
        <RoleIdentifiers>
            <Attribute name="Role"/>
        </RoleIdentifiers>
        <IDP entityID="http://localhost:8080/realms/myrealm"
             signaturesRequired="true">
            <SingleSignOnService requestBinding="POST"
                                 bindingUrl="http://localhost:8080/realms/myrealm/protocol/saml"/>
            <SingleLogoutService requestBinding="POST"
                                 responseBinding="POST"
                                 postBindingUrl="http://localhost:8080/realms/myrealm/protocol/saml"
                                 redirectBindingUrl="http://localhost:8080/realms/myrealm/protocol/saml"/>
            <Keys>
                <Key signing="true">
                    <KeyStore resource="/WEB-INF/keystore.jks" password="store123">
                        <Certificate alias="keycloak"/>
                    </KeyStore>
                </Key>
            </Keys>
        </IDP>
    </SP>
</keycloak-saml-adapter>
```

### Python / Flask 예시

```python
from flask import Flask, session, redirect, request
from onelogin.saml2.auth import OneLogin_Saml2_Auth
from onelogin.saml2.settings import OneLogin_Saml2_Settings
from onelogin.saml2.utils import OneLogin_Saml2_Utils

app = Flask(__name__)
app.secret_key = 'your-secret-key'

def init_saml_auth(req):
    auth = OneLogin_Saml2_Auth(req, custom_base_path='./saml')
    return auth

def prepare_flask_request(request):
    url_data = request.url
    return {
        'https': 'on' if request.scheme == 'https' else 'off',
        'http_host': request.host,
        'script_name': request.path,
        'get_data': request.args.copy(),
        'post_data': request.form.copy()
    }

@app.route('/saml/login')
def saml_login():
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    return redirect(auth.login())

@app.route('/saml/acs', methods=['POST'])
def saml_acs():
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    auth.process_response()
    errors = auth.get_errors()
    
    if not errors:
        session['samlUserdata'] = auth.get_attributes()
        session['samlNameId'] = auth.get_nameid()
        session['samlSessionIndex'] = auth.get_session_index()
        return redirect('/')
    else:
        return f"Error: {', '.join(errors)}"

@app.route('/saml/logout')
def saml_logout():
    req = prepare_flask_request(request)
    auth = init_saml_auth(req)
    name_id = session.get('samlNameId')
    session_index = session.get('samlSessionIndex')
    return redirect(auth.logout(name_id=name_id, session_index=session_index))

if __name__ == '__main__':
    app.run(port=8081)
```

## SAML Identity Provider 설정 (외부 IdP 연동)

Keycloak을 SAML Service Provider로 사용하여 외부 SAML IdP와 연동할 수 있습니다.

### 1. SAML Identity Provider 생성 (관리 콘솔)

Keycloak 관리 콘솔에서:

1. Realm 선택
2. "Identity providers" → "Add provider" → "SAML v2.0" 선택
3. 다음 정보 입력:
   - **Alias**: `saml-idp`
   - **Display name**: `SAML Identity Provider`
   - **Single Sign-On Service URL**: 외부 IdP의 SSO 엔드포인트
   - **Single Logout Service URL**: 외부 IdP의 SLO 엔드포인트 (선택적)
   - **Name ID Policy Format**: `email` 또는 `persistent`
4. "Save" 클릭

### 2. SAML Identity Provider 생성 (CLI / Terraform)

::: code-tabs#saml-idp

@tab CLI

```bash
# SAML Identity Provider 생성
kcadm.sh create identity-provider/instances -r myrealm \
  -s alias=saml-idp \
  -s providerId=saml \
  -s enabled=true \
  -s 'config.useJwksUrl="true"' \
  -s config.singleSignOnServiceUrl=http://idp.example.com/sso \
  -s config.singleLogoutServiceUrl=http://idp.example.com/slo \
  -s config.nameIDPolicyFormat=urn:oasis:names:tc:SAML:2.0:nameid-format:persistent \
  -s config.signatureAlgorithm=RSA_SHA256
```

@tab Terraform

```hcl
# terraform/saml-identity-provider.tf

resource "keycloak_identity_provider" "saml_idp" {
  realm             = keycloak_realm.myrealm.id
  alias             = "saml-idp"
  provider_id       = "saml"
  enabled           = true
  display_name      = "SAML Identity Provider"
  
  config = {
    use_jwks_url              = "true"
    single_sign_on_service_url = "http://idp.example.com/sso"
    single_logout_service_url = "http://idp.example.com/slo"
    name_id_policy_format     = "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent"
    signature_algorithm        = "RSA_SHA256"
  }
}
```

:::

### 3. IdP 메타데이터 업로드

외부 IdP의 메타데이터를 업로드하거나 직접 입력할 수 있습니다:

1. "Identity providers" → SAML IdP 선택
2. "Import from file" 또는 "Import from URL" 사용
3. 또는 "Settings" 탭에서 직접 설정

## SAML 보안 고려사항

::: warning SAML 보안 고려사항

- **XML 서명 필수**: SAML Assertion은 반드시 XML 서명으로 보호되어야 합니다
- **HTTPS 필수**: 모든 SAML 통신은 HTTPS를 통해 이루어져야 합니다
- **만료 시간 확인**: Assertion의 `NotBefore`와 `NotOnOrAfter`를 반드시 확인해야 합니다
- **Replay 공격 방지**: `InResponseTo`를 확인하여 재생 공격을 방지해야 합니다
- **인증서 관리**: IdP와 SP 간의 인증서를 안전하게 관리해야 합니다
- **서명 검증**: 모든 SAML 메시지의 서명을 검증해야 합니다

:::

## Keycloak SAML 활용 팁

::: tip Keycloak SAML 활용 팁

1. **메타데이터 활용**: Keycloak의 SAML 메타데이터를 다운로드하여 SP에 쉽게 설정
2. **Attribute Mapping**: 사용자 속성을 SAML Assertion에 매핑
3. **Role Mapping**: SAML Assertion의 역할을 Keycloak 역할로 매핑
4. **Name ID Format**: 사용 사례에 맞는 Name ID Format 선택
   - `email`: 이메일 주소
   - `persistent`: 영구 식별자
   - `transient`: 임시 식별자
5. **Single Logout**: SLO를 활성화하여 모든 애플리케이션에서 동시 로그아웃
6. **서명 및 암호화**: 프로덕션 환경에서는 반드시 활성화

:::

## 참고 자료

- [Keycloak SAML 공식 문서](https://www.keycloak.org/docs/latest/securing_apps/#_saml_adapter)
- [OAuth, OIDC, SAML 비교 문서](../../06-etc/infomation/oidc-saml-oauth.html)
- [SAML 2.0 스펙](https://docs.oasis-open.org/security/saml/v2.0/)
- [실행 가능한 데모 코드](https://github.com/Great-Stone/keycloak-saml-demo) - Docker Compose를 사용한 SAML 데모 예제
