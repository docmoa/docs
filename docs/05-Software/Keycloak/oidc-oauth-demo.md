---
description: Keycloak OIDC/OAuth 2.0 Demo
tag: ["Keycloak", "OIDC", "OAuth", "Demo"]
toc: true
---

# Keycloak OIDC/OAuth 2.0 Demo

Keycloak을 사용하여 OAuth 2.0 및 OIDC를 구현하는 방법을 설명합니다.

> 관련 문서: [OAuth, OIDC, SAML](../../06-etc/infomation/oidc-saml-oauth.html)

::: tip 실행 가능한 데모

실행 가능한 데모 코드는 GitHub에서 확인할 수 있습니다:

- **GitHub Repository**: [Great-Stone/keycloak-oidc-oauth-demo](https://github.com/Great-Stone/keycloak-oidc-oauth-demo)
- **Release**: [v1.0.0](https://github.com/Great-Stone/keycloak-oidc-oauth-demo/releases/tag/v1.0.0)

이 데모는 Docker Compose를 사용하여 Keycloak 서버와 Node.js Express 클라이언트 앱을 함께 실행할 수 있는 예제를 제공합니다.

:::

## Keycloak 소개

**Keycloak**은 오픈 소스 Identity and Access Management (IAM) 솔루션으로, 다음 기능을 제공합니다:

- **Single Sign-On (SSO)**: 여러 애플리케이션에 대한 통합 로그인
- **Identity Brokering**: 소셜 로그인 (Google, Facebook 등) 지원
- **User Federation**: LDAP, Active Directory 등과 연동
- **Adaptive Authentication**: 다단계 인증 (MFA) 지원
- **OAuth 2.0, OIDC, SAML 지원**: 표준 프로토콜 지원

## Keycloak 설치 및 실행

### Docker를 사용한 설치

```bash
# Docker를 사용한 Keycloak 실행
docker run -d \
  --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev

# 관리 콘솔 접속
# http://localhost:8080
# 사용자명: admin
# 비밀번호: admin
```

### 프로덕션 환경 설정

프로덕션 환경에서는 데이터베이스와 함께 사용하는 것을 권장합니다:

```bash
# PostgreSQL과 함께 실행
docker run -d \
  --name keycloak \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  -e KC_DB=postgres \
  -e KC_DB_URL=jdbc:postgresql://postgres:5432/keycloak \
  -e KC_DB_USERNAME=keycloak \
  -e KC_DB_PASSWORD=password \
  --link postgres:postgres \
  quay.io/keycloak/keycloak:latest \
  start
```

## OAuth 2.0 / OIDC 클라이언트 설정

### 1. Realm 생성

Realm은 사용자, 클라이언트, 역할 등을 관리하는 독립적인 영역입니다.

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

### 2. 클라이언트 등록 (관리 콘솔)

Keycloak 관리 콘솔에서:

1. Realm 선택 (예: `myrealm`)
2. "Clients" → "Create client" 클릭
3. 다음 정보 입력:
   - **Client type**: `OpenID Connect`
   - **Client ID**: `myapp`
   - **Next** 클릭
4. 다음 설정 구성:
   - **Client authentication**: `On` (Confidential client) 또는 `Off` (Public client)
   - **Authorization**: `Off` (일반적인 경우)
   - **Login settings**:
     - **Root URL**: `http://localhost:3000`
     - **Home URL**: `http://localhost:3000`
     - **Valid redirect URIs**: `http://localhost:3000/*`
     - **Web origins**: `http://localhost:3000`
   - **Capability config**:
     - **Standard flow**: `On` (Authorization Code Flow)
     - **Direct access grants**: `On` (Resource Owner Password Credentials)
     - **Implicit flow**: `Off` (권장하지 않음)
5. "Save" 클릭

### 3. 클라이언트 등록 (CLI / Terraform)

::: code-tabs#client

@tab CLI

```bash
# Keycloak Admin CLI 인증
kcadm.sh config credentials --server http://localhost:8080 \
  --realm master --user admin --password admin

# OIDC 클라이언트 생성 (Public Client)
kcadm.sh create clients -r myrealm -s clientId=myapp \
  -s enabled=true \
  -s 'redirectUris=["http://localhost:3000/*"]' \
  -s 'webOrigins=["http://localhost:3000"]' \
  -s protocol=openid-connect \
  -s publicClient=true \
  -s 'standardFlowEnabled=true' \
  -s 'implicitFlowEnabled=false' \
  -s 'directAccessGrantsEnabled=true'

# OIDC 클라이언트 생성 (Confidential Client)
kcadm.sh create clients -r myrealm -s clientId=myapp-confidential \
  -s enabled=true \
  -s 'redirectUris=["http://localhost:3000/*"]' \
  -s 'webOrigins=["http://localhost:3000"]' \
  -s protocol=openid-connect \
  -s publicClient=false \
  -s clientAuthenticatorType=client-secret \
  -s 'standardFlowEnabled=true' \
  -s 'directAccessGrantsEnabled=true'

# Client Secret 확인
kcadm.sh get clients -r myrealm --fields id,clientId | grep myapp-confidential
kcadm.sh get clients/{client-uuid}/client-secret -r myrealm
```

@tab Terraform

```hcl
# terraform/openid-client.tf

# Public Client
resource "keycloak_openid_client" "myapp" {
  realm_id              = keycloak_realm.myrealm.id
  client_id             = "myapp"
  enabled               = true
  access_type           = "PUBLIC"
  standard_flow_enabled = true
  implicit_flow_enabled = false
  direct_access_grants_enabled = true
  
  valid_redirect_uris = [
    "http://localhost:3000/*"
  ]
  
  web_origins = [
    "http://localhost:3000"
  ]
}

# Confidential Client
resource "keycloak_openid_client" "myapp_confidential" {
  realm_id              = keycloak_realm.myrealm.id
  client_id             = "myapp-confidential"
  enabled               = true
  access_type           = "CONFIDENTIAL"
  standard_flow_enabled = true
  direct_access_grants_enabled = true
  
  valid_redirect_uris = [
    "http://localhost:3000/*"
  ]
  
  web_origins = [
    "http://localhost:3000"
  ]
}

# Client Secret 출력 (Confidential Client)
output "myapp_confidential_client_secret" {
  value     = keycloak_openid_client.myapp_confidential.client_secret
  sensitive = true
}
```

:::

> **참고**: Terraform provider 설정은 위의 "1. Realm 생성" 섹션을 참고하세요.

### 4. 클라이언트 설정 확인

Keycloak 관리 콘솔에서:

1. Realm 선택 (예: `myrealm`)
2. "Clients" → 클라이언트 선택 (예: `myapp`)
3. "Settings" 탭에서 다음 정보 확인:
   - **Client ID**: `myapp`
   - **Client Protocol**: `openid-connect`
   - **Access Type**: `public` (또는 `confidential`)
   - **Valid Redirect URIs**: `http://localhost:3000/*`
   - **Web Origins**: `http://localhost:3000`
   - **Standard Flow Enabled**: `On`
   - **Direct Access Grants Enabled**: `On` (선택적)

## OIDC 클라이언트 애플리케이션 예시

### Node.js / Express 예시

```javascript
const express = require('express');
const session = require('express-session');
const { Issuer, Strategy } = require('openid-client');

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Keycloak OIDC 설정
const keycloakIssuer = await Issuer.discover('http://localhost:8080/realms/myrealm');
const client = new keycloakIssuer.Client({
  client_id: 'myapp',
  client_secret: 'your-client-secret', // confidential client인 경우
  redirect_uris: ['http://localhost:3000/auth/callback'],
  response_types: ['code']
});

// 인증 라우트
app.get('/login', (req, res) => {
  const authUrl = client.authorizationUrl({
    scope: 'openid profile email',
    redirect_uri: 'http://localhost:3000/auth/callback',
    state: 'random-state-value' // CSRF 방지
  });
  res.redirect(authUrl);
});

// 콜백 라우트
app.get('/auth/callback', async (req, res) => {
  try {
    const params = client.callbackParams(req);
    const tokenSet = await client.callback('http://localhost:3000/auth/callback', params);
    
    // ID Token에서 사용자 정보 추출
    const userInfo = tokenSet.claims();
    req.session.user = userInfo;
    req.session.accessToken = tokenSet.access_token;
    req.session.refreshToken = tokenSet.refresh_token;
    
    res.redirect('/');
  } catch (error) {
    console.error('Authentication error:', error);
    res.redirect('/login');
  }
});

// 보호된 라우트
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.json(req.session.user);
});

// 로그아웃
app.get('/logout', async (req, res) => {
  if (req.session.accessToken) {
    try {
      await client.revoke(req.session.accessToken);
    } catch (error) {
      console.error('Token revocation error:', error);
    }
  }
  req.session.destroy();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Python / Flask 예시

```python
from flask import Flask, session, redirect, request, jsonify
from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
app.secret_key = 'your-secret-key'

oauth = OAuth(app)

# Keycloak OIDC 설정
keycloak = oauth.register(
    name='keycloak',
    client_id='myapp',
    client_secret='your-client-secret',  # confidential client인 경우
    server_metadata_url='http://localhost:8080/realms/myrealm/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid profile email'
    }
)

@app.route('/login')
def login():
    redirect_uri = url_for('callback', _external=True)
    return keycloak.authorize_redirect(redirect_uri)

@app.route('/callback')
def callback():
    token = keycloak.authorize_access_token()
    user_info = keycloak.parse_id_token(token)
    session['user'] = user_info
    return redirect('/')

@app.route('/profile')
def profile():
    if 'user' not in session:
        return redirect('/login')
    return jsonify(session['user'])

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

if __name__ == '__main__':
    app.run(port=3000)
```

### React / Next.js 예시

```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export default NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
```

## PKCE 설정

모바일 앱과 SPA에서는 PKCE(Proof Key for Code Exchange)를 사용해야 합니다.

### Keycloak에서 PKCE 활성화

::: code-tabs#pkce

@tab 관리 콘솔

Keycloak 관리 콘솔에서:

1. Realm 선택
2. "Clients" → 클라이언트 선택
3. "Settings" 탭에서:
   - **Proof Key for Code Exchange Code Challenge Method**: `S256` 선택
   - **Save** 클릭

@tab Terraform

```hcl
# terraform/pkce-client.tf

# PKCE를 사용하는 Public Client
resource "keycloak_openid_client" "myapp_pkce" {
  realm_id              = keycloak_realm.myrealm.id
  client_id             = "myapp-pkce"
  enabled               = true
  access_type           = "PUBLIC"
  standard_flow_enabled  = true
  direct_access_grants_enabled = false
  
  valid_redirect_uris = [
    "http://localhost:3000/*"
  ]
  
  web_origins = [
    "http://localhost:3000"
  ]
  
  # PKCE 설정
  pkce_code_challenge_method = "S256"
}
```

:::

### 클라이언트에서 PKCE 사용

```javascript
const crypto = require('crypto');

// code_verifier 생성
const codeVerifier = crypto.randomBytes(32).toString('base64url');

// code_challenge 생성 (S256)
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// 인증 요청
const authUrl = client.authorizationUrl({
  scope: 'openid profile email',
  redirect_uri: 'http://localhost:3000/auth/callback',
  code_challenge: codeChallenge,
  code_challenge_method: 'S256'
});

// Token 교환 시 code_verifier 포함
const tokenSet = await client.callback(
  'http://localhost:3000/auth/callback',
  params,
  { code_verifier: codeVerifier }
);
```

## Keycloak 활용 팁

::: tip Keycloak 활용 팁

1. **Realm 분리**: 각 애플리케이션 또는 조직별로 Realm을 분리하여 관리
2. **Client 설정**: Public Client vs Confidential Client를 적절히 선택
   - **Public Client**: 모바일 앱, SPA (PKCE 필수)
   - **Confidential Client**: 서버 사이드 애플리케이션
3. **토큰 만료 시간**: Access Token과 Refresh Token의 만료 시간을 적절히 설정
4. **사용자 연동**: LDAP, Active Directory 등과 연동하여 사용자 관리 자동화
5. **다단계 인증**: 중요한 애플리케이션에 대해 MFA 활성화
6. **Identity Brokering**: Google, Facebook 등 소셜 로그인 연동
7. **토큰 검증**: Resource Server에서 토큰의 `aud`, `iss`, `exp` 클레임을 반드시 검증

:::

## 참고 자료

- [Keycloak 공식 문서](https://www.keycloak.org/documentation)
- [OAuth 2.0, OIDC, SAML 비교 문서](../../06-etc/infomation/oidc-saml-oauth.html)
- [OAuth 2.0 보안 취약점 및 대응 방안](../../06-etc/infomation/oidc-saml-oauth.html#oauth-20-보안-취약점-및-대응-방안)
- [실행 가능한 데모 코드](https://github.com/Great-Stone/keycloak-oidc-oauth-demo) - Docker Compose를 사용한 데모 예제
