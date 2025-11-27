---
description: OAuth, OIDC, SAML protocols comparison
tag: ["OAuth", "OIDC", "SAML", "authentication", "authorization", "security"]
toc: true
---

# OAuth, OIDC, SAML

OAuth, OIDC(OpenID Connect), SAML 프로토콜의 특징과 차이점, 그리고 각각의 사용 사례를 설명합니다.

> 관련 문서: [API 인증](./api-auth.html)

## 개요

OAuth, OIDC, SAML은 현대 웹 애플리케이션에서 인증(Authentication)과 권한 부여(Authorization)를 관리하는 데 사용되는 주요 프로토콜입니다. 각 프로토콜은 고유한 특징과 사용 사례를 가지고 있으며, 프로젝트의 요구사항에 따라 적절한 프로토콜을 선택하는 것이 중요합니다.

- **OAuth 2.0**: 권한 부여(Authorization) 프로토콜로, 사용자가 제3자 애플리케이션에 자신의 리소스에 대한 접근 권한을 안전하게 위임할 수 있도록 합니다.
- **OIDC (OpenID Connect)**: OAuth 2.0을 기반으로 한 인증(Authentication) 프로토콜로, 사용자의 신원을 확인하고 표준화된 사용자 정보를 제공합니다.
- **SAML (Security Assertion Markup Language)**: XML 기반의 엔터프라이즈 SSO(Single Sign-On) 프로토콜로, 주로 기업 환경에서 사용됩니다.

## 인증과 인가의 차이

OAuth, OIDC, SAML을 이해하기 전에 **인증(Authentication)**과 **인가(Authorization)**의 차이를 명확히 이해하는 것이 중요합니다.

### Authentication (인증)

**인증은 사용자가 누구인지 확인하는 과정**입니다. 이 과정은 일반적으로 사용자의 아이디와 비밀번호를 확인하는 것을 포함합니다. 인증은 또한 생체 인식, OTP (일회용 패스워드), 스마트 카드 등과 같은 다양한 방법을 사용할 수 있습니다.

즉, **인증은 사용자가 서비스에 관련이 있다고 주장하는 바를 증명하는 것**입니다.

**예시:**
- 사용자가 로그인 화면에서 아이디와 비밀번호를 입력하여 자신이 "홍길동"임을 증명
- 생체 인식(지문, 얼굴 인식)을 통해 사용자 신원 확인

### Authorization (권한 부여, 인가)

**권한 부여는 인증된 사용자가 어떤 자원에 접근할 수 있는 권한을 부여하는 과정**입니다. 예를 들어, 회사의 서버에 접근할 수 있는 권한을 부여하거나, 특정 데이터를 읽고 수정할 수 있는 권한을 설정하는 것이 여기에 해당합니다.

**예시:**
- 인증된 사용자 "홍길동"에게 "관리자" 역할 부여
- "홍길동"이 특정 폴더에 대한 읽기/쓰기 권한을 가짐

### OAuth 2.0과 OIDC의 차이점

::: tip 핵심 차이점

- **OAuth 2.0**: 인가(Authorization) 프로토콜로서, 인증된 사용자에게 자원 접근 권한을 부여하는 것에 중점을 둡니다.
- **OIDC**: OAuth 2.0을 확장하여, 사용자의 인증 정보를 안전하게 전달하는 인증(Authentication) 프로토콜입니다.

:::

OAuth 2.0의 전체적인 flow는 처음에 인증을 하고 인가에 대한 Access Token을 발급하는 프로세스를 모두 가지고 있습니다만, **앞의 인증하는 flow는 권한 부여에 대한 사전 조건이며 권한 부여가 주된 목적**이라는 말입니다.

OIDC는 OAuth 2.0 위에 구축된 인증 계층으로, 사용자의 신원을 확인하고 표준화된 사용자 정보(ID Token)를 제공합니다.

## OAuth

OAuth는 사용자가 자신의 자격 증명을 공유하지 않고도 타사 애플리케이션이 사용자의 리소스에 접근할 수 있도록 허용하는 권한 부여 프레임워크입니다.

### OAuth 버전별 비교

OAuth는 1.0과 2.0 두 가지 주요 버전이 있습니다.

| 항목 | OAuth 1.0 | OAuth 2.0 |
|-----|----------|-----------|
| **발표 연도** | 2010년 | 2012년 |
| **서명 방식** | HMAC-SHA1 서명 필수 | 서명 없음 (HTTPS 필수) |
| **구현 복잡도** | 높음 (복잡한 서명 과정) | 낮음 (단순화된 프로세스) |
| **보안** | 서명 기반 인증 | HTTPS 기반 보안 |
| **토큰 형식** | 고정된 형식 | 유연한 형식 (JWT 등) |
| **Grant Types** | 단일 플로우 | 다양한 Grant Types 지원 |
| **사용 현황** | 구식 (거의 사용 안 함) | 현재 표준 |

### OAuth 1.0

OAuth 1.0은 각 요청에 대해 복잡한 서명을 생성해야 하며, 이는 구현을 복잡하게 만듭니다.

**주요 특징:**
- **서명 기반 인증**: 모든 요청에 HMAC-SHA1 서명이 필요합니다
- **복잡한 구현**: 서명 생성 과정이 복잡하여 구현이 어렵습니다
- **보안 강화**: 서명 기반 인증으로 보안이 강화되었지만, 구현이 어려울 수 있습니다

**한계:**
- 구현 복잡도가 높아 널리 채택되지 않았습니다
- 현재는 거의 사용되지 않으며, OAuth 2.0으로 대체되었습니다

### OAuth 2.0

OAuth 2.0은 서명 과정을 제거하고 HTTPS를 통한 보안에 의존하여 구현을 단순화했습니다.

**주요 특징:**

::: tip OAuth 2.0의 특징

- **단순화된 프로세스**: 서명 과정이 제거되어 구현이 더 간단해졌습니다
- **확장성**: 다양한 클라이언트 유형과 시나리오를 지원합니다
- **유연한 토큰**: JWT 등 다양한 토큰 형식을 지원합니다
- **다양한 Grant Types**: Authorization Code, Client Credentials, Device Code 등 다양한 플로우를 지원합니다

:::

**보안 고려사항:**

::: warning OAuth 2.0 보안 고려사항

- **HTTPS 필수**: 서명 과정이 없기 때문에 HTTPS를 통한 보안이 필수적입니다
- **State 파라미터**: CSRF 공격 방지를 위해 state 파라미터를 사용해야 합니다
- **PKCE**: 모바일 앱과 SPA에서는 PKCE(Proof Key for Code Exchange)를 사용해야 합니다

:::

### OAuth 2.0 Grant Types

OAuth 2.0은 다양한 사용 사례를 위해 여러 Grant Type을 제공합니다:

| Grant Type | 설명 | 사용 사례 |
|-----------|------|----------|
| **Authorization Code** | 가장 안전한 방식, 서버 간 통신 | 웹 애플리케이션, 서버 앱 |
| **Implicit** | 클라이언트 측 앱용 (구식, 권장하지 않음) | 단일 페이지 애플리케이션 (구버전) |
| **Client Credentials** | 클라이언트 자체 인증 | 서버 간 통신, M2M (Machine-to-Machine) |
| **Resource Owner Password** | 사용자 자격 증명 직접 전달 (권장하지 않음) | 신뢰할 수 있는 앱만 |
| **Device Code** | 입력 제한 장치용 | 스마트 TV, IoT 장치 |

### OAuth 2.0 동작 흐름 (Authorization Code Flow)

```mermaid
sequenceDiagram
    participant User as 사용자<br/>(Resource Owner)
    participant Client as 클라이언트 앱
    participant Auth as 인증 서버<br/>(Authorization Server)
    participant API as 리소스 서버<br/>(Resource Server)

    Note over User,API: 1. 인증 요청
    User->>Client: 앱 접근 시도
    Client->>Auth: 인증 요청<br/>(client_id, redirect_uri, scope, state)
    Auth->>User: 로그인 화면 표시
    User->>Auth: 인증 정보 입력
    Auth->>User: 동의 화면 표시<br/>(요청된 권한 목록)
    User->>Auth: 접근 동의

    Note over User,API: 2. Authorization Code 발급
    Auth->>Client: Authorization Code 반환<br/>(redirect_uri로 리다이렉트)

    Note over User,API: 3. Access Token 교환
    Client->>Auth: Access Token 요청<br/>(code, client_id, client_secret, redirect_uri)
    Auth->>Auth: Code 검증
    Auth->>Client: Access Token 발급<br/>(+ Refresh Token, expires_in)

    Note over User,API: 4. 리소스 접근
    Client->>API: API 요청<br/>Header: Authorization: Bearer {access_token}
    API->>Auth: Token 검증 (선택적)
    Auth->>API: Token 유효성 확인
    API->>Client: 200 OK<br/>{data: [...]}

    Note over User,API: 5. Token 갱신 (선택적)
    Client->>Auth: Refresh Token으로 새 Access Token 요청
    Auth->>Client: 새 Access Token 발급
```

### OAuth 2.0 사용 예시

```bash
# 1. Authorization Code 요청 (브라우저에서 실행)
# https://auth.example.com/authorize?client_id=myapp&redirect_uri=https://myapp.com/callback&response_type=code&scope=read&state=random_state_value

# 2. Access Token 요청
curl -X POST https://auth.example.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "client_id=myapp" \
  -d "client_secret=SECRET" \
  -d "redirect_uri=https://myapp.com/callback"

# 응답 예시
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def50200a1b2c3d4e5f6...",
  "scope": "read write"
}

# 3. API 요청 (Access Token 사용)
curl -X GET https://api.example.com/users/me \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..."
```

### OAuth 2.0 보안 취약점 및 대응 방안

OAuth의 복잡성은 개발 과정에서의 실수로 인한 보안 위협을 초래할 수 있습니다. 실제 버그바운티 프로그램에서 발견되는 주요 취약점들을 살펴보고 대응 방안을 제시합니다.

#### OAuth의 복잡성과 보안 위협

OAuth 2.0은 강력한 인증/인가 프레임워크이지만, 구현 과정에서 여러 보안 취약점이 발생할 수 있습니다. 특히 다음과 같은 요인들이 보안 위협을 증가시킵니다:

- **복잡한 플로우**: 여러 단계의 인증 과정에서 실수 가능성
- **다양한 Grant Types**: 각 Grant Type마다 다른 보안 고려사항
- **토큰 관리**: Access Token, Refresh Token의 안전한 저장 및 검증
- **리다이렉션 처리**: Open Redirection 공격 위험

#### Implicit Grant Type의 보안 위험

Implicit Grant Type은 토큰을 직접 발급받는 방식으로, 다음과 같은 보안 위험이 있습니다:

::: danger Implicit Grant Type 보안 위험

- **브라우저 기반 노출 위험**: 토큰이 URL, 히스토리, 로그 등에 저장될 수 있음
- **Access Token 보안 위험**: 탈취 시 공격자가 토큰을 재사용할 수 있어 피해자 리소스에 무단 접근 가능
- **토큰 검증 부족**: Access Token에 대한 검증이 부족할 수 있음

:::

**대응 방안:**

- **Implicit Grant Type 사용 금지**: OAuth 2.1에서는 공식적으로 제거됨
- **Authorization Code Grant Type 사용**: 더 안전한 대안 사용
- **PKCE 필수**: 모바일 앱과 SPA에서는 반드시 PKCE 사용

#### Authorization Code Grant Type의 보안 위험

Authorization Code Grant Type은 Implicit보다 안전하지만, 여전히 다음과 같은 위험이 있습니다:

**1. Authorization Code 탈취**

```mermaid
sequenceDiagram
    participant Attacker as 공격자
    participant Victim as 피해자
    participant Client as 클라이언트 앱
    participant Auth as 인증 서버

    Note over Attacker,Auth: 공격 시나리오: Open Redirection 공격
    Attacker->>Victim: 악성 링크 전송<br/>(피해자의 인가 코드 포함)
    Victim->>Client: 인가 코드로 접근<br/>(/callback?code=attacker_code)
    Client->>Auth: 인가 코드로 Token 요청
    Auth->>Client: Access Token 발급
    Note over Client: 공격자의 계정으로 로그인됨
```

**2. State 파라미터 검증 부족**

State 파라미터는 CSRF 공격을 방지하기 위한 중요한 요소입니다. State 파라미터를 검증하지 않으면 다음과 같은 공격이 가능합니다:

```mermaid
sequenceDiagram
    participant Attacker as 공격자
    participant Victim as 피해자
    participant Client as 클라이언트 앱
    participant Auth as 인증 서버

    Note over Attacker,Auth: CSRF 공격 시나리오
    Attacker->>Victim: 악성 링크 전송<br/>(공격자의 인가 코드 포함)
    Victim->>Client: 인가 코드로 접근<br/>(/callback?code=attacker_code&state=original_state)
    Client->>Client: State 검증 실패<br/>(State 검증 없음)
    Client->>Auth: 인가 코드로 Token 요청
    Auth->>Client: Access Token 발급
    Note over Client: 공격자의 계정으로 로그인됨
```

**대응 방안:**

- **State 파라미터 필수 사용**: 모든 OAuth 요청에 state 파라미터 포함
- **State 검증 필수**: 콜백에서 반드시 state 파라미터 검증
- **세션 기반 State 저장**: State를 세션에 저장하여 검증

#### PKCE (Proof Key for Code Exchange)

PKCE는 Authorization Code Grant Type의 보안을 강화하기 위한 확장입니다.

**PKCE 동작 흐름:**

```mermaid
sequenceDiagram
    participant Client as 클라이언트 앱
    participant Auth as 인증 서버

    Note over Client,Auth: 1. 인증 요청 시
    Client->>Client: code_verifier 생성<br/>(랜덤 문자열)
    Client->>Client: code_challenge 생성<br/>(SHA256(code_verifier))
    Client->>Auth: 인증 요청<br/>(code_challenge, code_challenge_method=S256)

    Note over Client,Auth: 2. Token 교환 시
    Client->>Auth: Token 요청<br/>(code, code_verifier)
    Auth->>Auth: code_challenge 검증<br/>(SHA256(code_verifier) == code_challenge)
    Auth->>Client: Access Token 발급
```

**PKCE의 장점:**

::: tip PKCE의 장점

- **Authorization Code 탈취 방지**: 탈취된 코드만으로는 Token을 발급받을 수 없음
- **공개 클라이언트 보호**: 클라이언트 시크릿이 없는 공개 클라이언트도 보호
- **모바일 앱 보안 강화**: 네이티브 앱의 보안을 크게 향상

:::

**PKCE 사용 예시:**

```bash
# 1. code_verifier 생성 (클라이언트 측)
code_verifier=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-43)

# 2. code_challenge 생성
code_challenge=$(echo -n "$code_verifier" | openssl dgst -binary -sha256 | openssl base64 | tr -d "=+/" | cut -c1-43)

# 3. 인증 요청 (code_challenge 포함)
# https://auth.example.com/authorize?client_id=myapp&redirect_uri=https://myapp.com/callback&response_type=code&code_challenge={code_challenge}&code_challenge_method=S256

# 4. Token 요청 (code_verifier 포함)
curl -X POST https://auth.example.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "client_id=myapp" \
  -d "code_verifier={code_verifier}" \
  -d "redirect_uri=https://myapp.com/callback"
```

**PKCE Downgrade 공격:**

::: warning PKCE Downgrade 공격

서버가 PKCE 없이도 요청을 수락하는 경우, 공격자가 PKCE를 우회하여 공격할 수 있습니다. 서버는 반드시 PKCE를 강제해야 합니다.

:::

#### Access Token 검증 부족

Access Token의 `aud` (audience) 클레임을 검증하지 않으면, 다른 클라이언트용으로 발급된 토큰을 악용할 수 있습니다.

**취약점 시나리오:**

```mermaid
sequenceDiagram
    participant Attacker as 공격자<br/>(악성 사이트)
    participant Victim as 피해자
    participant Client as 클라이언트 앱<br/>(취약한 서비스)
    participant Auth as 인증 서버

    Note over Attacker,Auth: Access Token aud 클레임 검증 부족
    Attacker->>Victim: 악성 사이트 접근 유도
    Victim->>Auth: 소셜 로그인<br/>(공격자의 클라이언트 ID로)
    Auth->>Victim: Access Token 발급<br/>(aud=attacker_client_id)
    Victim->>Attacker: Access Token 전달<br/>(브라우저 히스토리 등)
    Attacker->>Client: Access Token 사용<br/>(aud 검증 없음)
    Client->>Client: Token 검증 실패<br/>(aud 클레임 검증 없음)
    Client->>Client: 인증 성공 처리<br/>(잘못된 인증)
```

**대응 방안:**

- **aud 클레임 검증 필수**: Access Token의 `aud` 클레임이 자신의 클라이언트 ID와 일치하는지 확인
- **iss 클레임 검증**: 토큰 발급자(issuer)가 신뢰할 수 있는 서버인지 확인
- **exp 클레임 검증**: 토큰 만료 시간을 반드시 확인

**검증 예시:**

```javascript
// Access Token 검증 예시
function validateAccessToken(token, expectedClientId) {
  const decoded = jwt.decode(token);
  
  // 1. aud 클레임 검증
  if (decoded.aud !== expectedClientId) {
    throw new Error('Invalid audience');
  }
  
  // 2. iss 클레임 검증
  if (decoded.iss !== 'https://auth.example.com') {
    throw new Error('Invalid issuer');
  }
  
  // 3. exp 클레임 검증
  if (decoded.exp < Date.now() / 1000) {
    throw new Error('Token expired');
  }
  
  return decoded;
}
```

#### 실제 취약점 사례

**사례 1: Access Token aud 클레임 검증 부족**

- **취약점**: 클라이언트가 Access Token의 `aud` 클레임을 검증하지 않음
- **공격 방법**: 공격자가 다른 클라이언트용 토큰을 사용하여 인증 우회
- **영향**: 계정 탈취, 민감한 정보 유출
- **대응**: Access Token의 `aud` 클레임을 반드시 검증

**사례 2: State 파라미터 검증 부족**

- **취약점**: 클라이언트가 state 파라미터를 검증하지 않음
- **공격 방법**: 공격자의 Authorization Code를 사용하여 CSRF 공격
- **영향**: 계정 탈취, 소셜 연동 공격
- **대응**: State 파라미터를 세션에 저장하고 반드시 검증

**사례 3: PKCE 미사용 또는 Downgrade 공격**

- **취약점**: PKCE를 사용하지 않거나, 서버가 PKCE 없이도 요청을 수락
- **공격 방법**: Authorization Code 탈취 후 Token 발급
- **영향**: 계정 탈취
- **대응**: PKCE를 필수로 사용하고, 서버에서 PKCE를 강제

#### OAuth 2.0 보안 체크리스트

::: tip OAuth 2.0 보안 체크리스트

**클라이언트 측:**

- [ ] HTTPS를 통해서만 OAuth 통신
- [ ] State 파라미터를 사용하고 검증
- [ ] PKCE를 사용 (모바일 앱, SPA)
- [ ] Implicit Grant Type 사용 금지
- [ ] Access Token을 안전하게 저장
- [ ] Refresh Token을 더욱 엄격하게 보호
- [ ] 토큰 만료 시간 확인

**서버 측:**

- [ ] Authorization Code는 일회용으로 처리
- [ ] Authorization Code의 유효 시간을 짧게 설정
- [ ] Redirect URI 화이트리스트 검증
- [ ] PKCE를 강제 (공개 클라이언트)
- [ ] Access Token의 aud, iss, exp 클레임 검증
- [ ] CSRF 공격 방지 (State 파라미터)
- [ ] Open Redirection 공격 방지

:::

**참고 자료:**

- [OWASP OAuth 2.0 Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OAuth2_Security_Cheat_Sheet.html)
- [RFC 7636: Proof Key for Code Exchange by OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636)
- [OWASP Seoul Chapter - 해커들이 좋아하는 인증 환경은 따로 있다](https://owasp.org/www-chapter-seoul/assets/files/2025%20Jul%20Safe%20Us팀(정민석,%20김민곤)%20-%20해커들이%20좋아하는%20인증%20환경은%20따로%20있다_.pdf)

## OIDC (OpenID Connect)

OIDC는 OAuth 2.0을 기반으로 한 인증 프로토콜로, 사용자의 신원을 확인하고 표준화된 사용자 정보를 제공합니다.

### 정의

**OIDC**(OpenID Connect)는 OAuth 2.0 위에 구축된 인증 계층으로, 사용자의 신원을 확인하는 데 사용됩니다. OAuth가 권한 부여에 집중하는 반면, OIDC는 인증을 처리합니다.

### OAuth 2.0과의 관계

OIDC는 OAuth 2.0의 확장으로, OAuth 2.0의 Authorization Code Flow를 사용하지만 추가로 **ID Token**을 발급합니다.

**차이점:**

| 항목 | OAuth 2.0 | OIDC |
|-----|----------|------|
| **주 목적** | 권한 부여 (Authorization) | 인증 (Authentication) |
| **토큰** | Access Token만 | Access Token + ID Token |
| **사용자 정보** | 별도 API 호출 필요 | ID Token에 포함 |
| **표준화** | 권한 부여만 표준화 | 사용자 정보도 표준화 |

### ID Token의 구조

OIDC의 ID Token은 JWT 형식으로, 사용자의 인증 정보를 포함합니다.

**ID Token 주요 필드:**

| 필드 | 설명 | 예시 |
|-----|------|------|
| `iss` (Issuer) | 토큰을 발급한 서버의 URL | `https://auth.example.com` |
| `sub` (Subject) | 사용자의 고유 식별자 | `1234567890` |
| `aud` (Audience) | 토큰의 수신자 또는 사용 대상 | `myapp-client-id` |
| `exp` (Expiration Time) | 토큰의 만료 시간 (Unix timestamp) | `1516239022` |
| `iat` (Issued At) | 토큰 발급 시간 (Unix timestamp) | `1516235422` |
| `auth_time` | 사용자가 마지막으로 인증한 시간 | `1516235422` |
| `nonce` | 재생 공격 방지를 위한 무작위 문자열 | `random_nonce_value` |
| `at_hash` | Access Token의 해시 값 | `hash_of_access_token` |
| `email` | 사용자의 이메일 주소 | `user@example.com` |
| `name` | 사용자의 이름 | `홍길동` |
| `picture` | 사용자의 프로필 사진 URL | `https://...` |

**ID Token 예시:**

```json
{
  "iss": "https://auth.example.com",
  "sub": "1234567890",
  "aud": "myapp-client-id",
  "exp": 1516239022,
  "iat": 1516235422,
  "auth_time": 1516235422,
  "nonce": "random_nonce_value",
  "at_hash": "hash_of_access_token",
  "email": "user@example.com",
  "email_verified": true,
  "name": "홍길동",
  "picture": "https://example.com/profile.jpg",
  "given_name": "길동",
  "family_name": "홍"
}
```

### OIDC의 주요 특징

::: tip OIDC의 특징

- **표준화된 사용자 정보 제공**: 이름, 이메일, 프로필 사진 등 사용자의 신원 정보를 표준화된 형식으로 제공합니다
- **인증 시간 및 방법 명시**: 사용자가 언제, 어떻게 인증을 받았는지를 명시하여 보안을 강화합니다
- **세션 및 인증 상태 관리**: 사용자의 세션 상태를 관리하고, 로그인 상태 유지 및 로그아웃을 처리합니다
- **보안 및 규정 준수**: 법적 요구사항을 충족하는 사용자 데이터 처리를 지원합니다 (예: GDPR)
- **상호 운용성**: 다양한 시스템과의 호환성을 지원하여 표준에 기반한 인증 솔루션을 쉽게 구현할 수 있게 합니다

:::

### OIDC 동작 흐름

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Client as 클라이언트 앱
    participant Auth as 인증 서버<br/>(OIDC Provider)
    participant API as 리소스 서버

    Note over User,API: 1. 인증 요청 (OAuth 2.0 + OIDC)
    User->>Client: 앱 접근 시도
    Client->>Auth: 인증 요청<br/>(client_id, redirect_uri, scope=openid profile email, response_type=code)
    Auth->>User: 로그인 화면 표시
    User->>Auth: 인증 정보 입력
    Auth->>User: 동의 화면 표시
    User->>Auth: 접근 동의

    Note over User,API: 2. Authorization Code 발급
    Auth->>Client: Authorization Code 반환<br/>(redirect_uri로 리다이렉트)

    Note over User,API: 3. Token 교환 (Access Token + ID Token)
    Client->>Auth: Token 요청<br/>(code, client_id, client_secret)
    Auth->>Auth: Code 검증
    Auth->>Auth: ID Token 생성<br/>(사용자 정보 포함)
    Auth->>Client: Access Token + ID Token 발급<br/>(+ Refresh Token)

    Note over User,API: 4. 사용자 정보 확인
    Client->>Client: ID Token 검증<br/>(서명, 만료 시간, nonce 등)
    Client->>Client: ID Token에서 사용자 정보 추출<br/>(sub, email, name 등)

    Note over User,API: 5. 리소스 접근 (선택적)
    Client->>API: API 요청<br/>Header: Authorization: Bearer {access_token}
    API->>Client: 200 OK<br/>{data: [...]}
```

### OIDC 사용 예시

```bash
# 1. 인증 요청 (scope에 openid 포함)
# https://auth.example.com/authorize?client_id=myapp&redirect_uri=https://myapp.com/callback&response_type=code&scope=openid profile email&state=random_state

# 2. Token 요청 (OAuth 2.0과 동일하지만 ID Token도 받음)
curl -X POST https://auth.example.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "client_id=myapp" \
  -d "client_secret=SECRET" \
  -d "redirect_uri=https://myapp.com/callback"

# 응답 예시 (ID Token 포함)
{
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "def50200a1b2c3d4e5f6...",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJzdWIiOiIxMjM0NTY3ODkwIiwiYXVkIjoibXlhcHAtY2xpZW50LWlkIiwiZXhwIjoxNTE2MjM5MDIyLCJpYXQiOjE1MTYyMzU0MjIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsIm5hbWUiOiLtlZzqtawifQ..."
}

# 3. ID Token 디코딩 (JWT 형식)
# ID Token을 디코딩하면 사용자 정보를 확인할 수 있습니다
```

## SAML (Security Assertion Markup Language)

SAML은 XML 기반의 개방형 표준으로, 주로 기업 환경에서 싱글 사인온(SSO) 및 인증에 사용됩니다.

### 정의

**SAML**(Security Assertion Markup Language)은 XML 기반의 인증 및 권한 부여 데이터를 교환하기 위한 표준 프로토콜입니다. 주로 엔터프라이즈 환경에서 SSO(Single Sign-On) 솔루션으로 사용됩니다.

### 주요 특징

::: tip SAML의 특징

- **XML 기반**: 데이터 교환에 XML을 사용하여 구조화된 정보를 전달합니다
- **엔터프라이즈 중심**: 대규모 조직의 SSO 솔루션에 주로 사용됩니다
- **인증 및 권한 부여**: 사용자의 신원 확인과 권한 부여를 모두 처리합니다
- **페더레이션**: 다양한 서비스 제공자와의 페더레이션 인증을 지원합니다
- **강력한 보안**: XML 서명 및 암호화를 통해 보안을 강화합니다

:::

### SAML 2.0의 주요 구성 요소

SAML 2.0은 다음과 같은 주요 구성 요소를 가집니다:

| 구성 요소 | 설명 |
|---------|------|
| **Identity Provider (IdP)** | 사용자를 인증하고 SAML 어설션을 발급하는 서버 |
| **Service Provider (SP)** | SAML 어설션을 받아 사용자를 인증하는 애플리케이션 |
| **SAML Assertion** | 사용자의 인증 및 권한 정보를 포함한 XML 문서 |
| **SAML Request** | SP가 IdP에 보내는 인증 요청 |
| **SAML Response** | IdP가 SP에 보내는 인증 응답 (Assertion 포함) |

### SAML Assertion 구조

SAML Assertion은 다음과 같은 정보를 포함합니다:

- **Issuer**: 어설션을 발급한 IdP의 식별자
- **Subject**: 인증된 사용자의 식별자
- **Conditions**: 어설션의 유효 기간 및 대상
- **AttributeStatement**: 사용자의 속성 정보 (이름, 이메일, 역할 등)
- **AuthnStatement**: 인증 방법 및 시간 정보

### SAML 동작 흐름 (SP-initiated SSO)

```mermaid
sequenceDiagram
    participant User as 사용자<br/>(브라우저)
    participant SP as Service Provider<br/>(애플리케이션)
    participant IdP as Identity Provider<br/>(인증 서버)

    Note over User,IdP: 1. 애플리케이션 접근 시도
    User->>SP: 애플리케이션 접근 요청
    SP->>SP: 사용자 인증 상태 확인<br/>(세션 없음)

    Note over User,IdP: 2. SAML 인증 요청 생성
    SP->>User: SAML 인증 요청 생성<br/>(SAMLRequest)
    User->>IdP: SAML 인증 요청 전달<br/>(브라우저 리다이렉트)

    Note over User,IdP: 3. 사용자 인증
    IdP->>User: 로그인 화면 표시
    User->>IdP: 인증 정보 입력<br/>(아이디/비밀번호 등)
    IdP->>IdP: 인증 확인

    Note over User,IdP: 4. SAML 응답 생성
    IdP->>IdP: SAML Assertion 생성<br/>(사용자 정보, 권한 포함)
    IdP->>IdP: SAML Response 서명
    IdP->>User: SAML Response 전달<br/>(브라우저 리다이렉트)

    Note over User,IdP: 5. SAML 응답 검증 및 세션 생성
    User->>SP: SAML Response 전달
    SP->>SP: SAML Response 검증<br/>(서명 확인, 만료 시간 확인)
    SP->>SP: Assertion에서 사용자 정보 추출
    SP->>SP: 사용자 세션 생성
    SP->>User: 애플리케이션 접근 허용
```

### SAML 사용 예시

**SAML Request 예시:**

```xml
<samlp:AuthnRequest
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="_1234567890"
    Version="2.0"
    IssueInstant="2024-01-01T00:00:00Z"
    Destination="https://idp.example.com/sso"
    AssertionConsumerServiceURL="https://sp.example.com/acs"
    ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
    <saml:Issuer>https://sp.example.com</saml:Issuer>
    <samlp:NameIDPolicy
        Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
        AllowCreate="true"/>
</samlp:AuthnRequest>
```

**SAML Response 예시:**

```xml
<samlp:Response
    xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
    xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
    ID="_9876543210"
    Version="2.0"
    IssueInstant="2024-01-01T00:00:00Z"
    Destination="https://sp.example.com/acs"
    InResponseTo="_1234567890">
    <saml:Issuer>https://idp.example.com</saml:Issuer>
    <samlp:Status>
        <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
    </samlp:Status>
    <saml:Assertion
        ID="_assertion123"
        Version="2.0"
        IssueInstant="2024-01-01T00:00:00Z">
        <saml:Issuer>https://idp.example.com</saml:Issuer>
        <saml:Subject>
            <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">
                user@example.com
            </saml:NameID>
            <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
                <saml:SubjectConfirmationData
                    NotOnOrAfter="2024-01-01T01:00:00Z"
                    Recipient="https://sp.example.com/acs"/>
            </saml:SubjectConfirmation>
        </saml:Subject>
        <saml:Conditions
            NotBefore="2024-01-01T00:00:00Z"
            NotOnOrAfter="2024-01-01T01:00:00Z">
            <saml:AudienceRestriction>
                <saml:Audience>https://sp.example.com</saml:Audience>
            </saml:AudienceRestriction>
        </saml:Conditions>
        <saml:AuthnStatement
            AuthnInstant="2024-01-01T00:00:00Z"
            SessionIndex="_session123">
            <saml:AuthnContext>
                <saml:AuthnContextClassRef>
                    urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
                </saml:AuthnContextClassRef>
            </saml:AuthnContext>
        </saml:AuthnStatement>
        <saml:AttributeStatement>
            <saml:Attribute Name="email" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
                <saml:AttributeValue>user@example.com</saml:AttributeValue>
            </saml:Attribute>
            <saml:Attribute Name="name" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
                <saml:AttributeValue>홍길동</saml:AttributeValue>
            </saml:Attribute>
        </saml:AttributeStatement>
    </saml:Assertion>
</samlp:Response>
```

### SAML 보안 고려사항

::: warning SAML 보안 고려사항

- **XML 서명 필수**: SAML Assertion은 반드시 XML 서명으로 보호되어야 합니다
- **HTTPS 필수**: 모든 SAML 통신은 HTTPS를 통해 이루어져야 합니다
- **만료 시간 확인**: Assertion의 `NotBefore`와 `NotOnOrAfter`를 반드시 확인해야 합니다
- **Replay 공격 방지**: `InResponseTo`를 확인하여 재생 공격을 방지해야 합니다
- **인증서 관리**: IdP와 SP 간의 인증서를 안전하게 관리해야 합니다

:::

## 프로토콜 비교표

OAuth 2.0, OIDC, SAML을 종합적으로 비교한 표입니다.

| 항목 | OAuth 2.0 | OIDC | SAML 2.0 |
|-----|----------|------|----------|
| **주 목적** | 권한 부여 (Authorization) | 인증 (Authentication) | 인증 및 권한 부여 |
| **데이터 형식** | JSON | JSON (JWT) | XML |
| **프로토콜** | HTTP/HTTPS | HTTP/HTTPS (OAuth 2.0 기반) | HTTP/HTTPS |
| **토큰 형식** | Access Token (유연) | Access Token + ID Token (JWT) | SAML Assertion (XML) |
| **보안 수준** | 높음 (HTTPS 필수) | 높음 (JWT 서명) | 매우 높음 (XML 서명) |
| **구현 복잡도** | 중 | 중 | 높음 |
| **사용자 정보** | 별도 API 호출 필요 | ID Token에 포함 | Assertion에 포함 |
| **표준화** | 권한 부여만 표준화 | 사용자 정보도 표준화 | 완전히 표준화 |
| **주요 사용 사례** | API 접근 권한 부여 | 소셜 로그인, 사용자 인증 | 엔터프라이즈 SSO |
| **모바일 앱 지원** | 우수 | 우수 | 제한적 |
| **웹 앱 지원** | 우수 | 우수 | 우수 |
| **엔터프라이즈 지원** | 중 | 중 | 우수 |
| **확장성** | 높음 | 높음 | 중 |
| **성능** | 빠름 (JSON) | 빠름 (JSON) | 느림 (XML) |

### 선택 가이드

| 사용 사례 | 권장 프로토콜 | 이유 |
|---------|-------------|------|
| **소셜 로그인** | OIDC | 표준화된 사용자 정보 제공, 모바일/웹 앱 지원 우수 |
| **API 접근 권한 부여** | OAuth 2.0 | 권한 부여에 특화, 간단한 구현 |
| **엔터프라이즈 SSO** | SAML 2.0 | 기업 환경 표준, 강력한 보안 |
| **모바일 앱** | OIDC | JSON 기반, 빠른 처리, 표준화된 사용자 정보 |
| **웹 애플리케이션** | OIDC 또는 SAML | OIDC는 현대적, SAML은 기업 환경 |
| **서버 간 통신** | OAuth 2.0 (Client Credentials) | 간단한 구현, 빠른 처리 |

## Keycloak을 활용한 구현 예시

Keycloak은 오픈 소스 인증 및 권한 부여 플랫폼으로, OAuth 2.0, OIDC, SAML을 모두 지원합니다.

### Keycloak 소개

**Keycloak**은 오픈 소스 Identity and Access Management (IAM) 솔루션으로, 다음 기능을 제공합니다:

- **Single Sign-On (SSO)**: 여러 애플리케이션에 대한 통합 로그인
- **Identity Brokering**: 소셜 로그인 (Google, Facebook 등) 지원
- **User Federation**: LDAP, Active Directory 등과 연동
- **Adaptive Authentication**: 다단계 인증 (MFA) 지원
- **OAuth 2.0, OIDC, SAML 지원**: 표준 프로토콜 지원

### 구현 예시 문서

Keycloak을 사용한 실제 구현 예시는 다음 문서를 참고하세요:

- **[Keycloak OIDC/OAuth 2.0 Demo](../../05-Software/Keycloak/oidc-oauth-demo.html)**: OAuth 2.0 및 OIDC 클라이언트 설정 및 애플리케이션 예시
- **[Keycloak SAML Demo](../../05-Software/Keycloak/saml-demo.html)**: SAML 2.0 클라이언트 설정 및 애플리케이션 예시

각 문서에는 다음 내용이 포함되어 있습니다:

- Keycloak 설치 및 실행 방법
- 클라이언트 설정 (관리 콘솔 및 CLI)
- 다양한 프로그래밍 언어별 구현 예시 (Node.js, Python, Java 등)
- PKCE 설정 및 보안 고려사항
- 실제 활용 팁


## 프로토콜 선택 가이드

프로젝트의 요구사항에 따라 적절한 프로토콜을 선택하는 것이 중요합니다.

### 사용 사례별 권장 프로토콜

| 사용 사례 | 권장 프로토콜 | 대안 |
|---------|-------------|------|
| **소셜 로그인 (Google, Facebook 등)** | OIDC | - |
| **모바일 앱 인증** | OIDC | OAuth 2.0 (사용자 정보 별도 조회) |
| **웹 애플리케이션 인증** | OIDC | SAML (기업 환경) |
| **API 접근 권한 부여** | OAuth 2.0 | - |
| **엔터프라이즈 SSO** | SAML 2.0 | OIDC (현대적 환경) |
| **서버 간 통신 (M2M)** | OAuth 2.0 (Client Credentials) | - |
| **제3자 앱 통합** | OAuth 2.0 | OIDC (사용자 정보 필요 시) |

### 엔터프라이즈 vs 모바일/웹 앱

**엔터프라이즈 환경:**
- **SAML 2.0**: 기존 엔터프라이즈 시스템과의 호환성, 강력한 보안 요구사항
- **OIDC**: 현대적인 엔터프라이즈 환경, 모바일 앱 지원 필요 시

**모바일/웹 앱:**
- **OIDC**: 표준화된 사용자 정보, 빠른 처리, JSON 기반
- **OAuth 2.0**: 사용자 정보가 필요 없고 권한 부여만 필요한 경우

### 마이그레이션 고려사항

**SAML에서 OIDC로 마이그레이션:**

::: tip 마이그레이션 전략

1. **점진적 마이그레이션**: 새로운 애플리케이션은 OIDC를 사용하고, 기존 애플리케이션은 SAML 유지
2. **하이브리드 접근**: Keycloak 같은 IAM 솔루션을 사용하여 두 프로토콜을 동시에 지원
3. **사용자 경험 개선**: OIDC의 JSON 기반 처리로 더 빠른 응답 시간 제공
4. **모바일 지원**: OIDC는 모바일 앱에 더 적합

:::

**OAuth 2.0에서 OIDC로 확장:**

OAuth 2.0을 이미 사용 중인 경우, OIDC로 확장하는 것은 비교적 간단합니다:

1. **Scope 추가**: `scope=openid profile email` 추가
2. **ID Token 처리**: Access Token과 함께 ID Token도 받아 처리
3. **사용자 정보**: 별도 API 호출 없이 ID Token에서 사용자 정보 추출

### 보안 요구사항에 따른 선택

| 보안 요구사항 | 권장 프로토콜 | 이유 |
|------------|-------------|------|
| **최고 수준** | SAML 2.0 | XML 서명, 강력한 암호화 |
| **높은 수준** | OIDC | JWT 서명, 표준화된 보안 |
| **중간 수준** | OAuth 2.0 | HTTPS 기반 보안 |

## 요약

OAuth 2.0, OIDC, SAML은 각각 고유한 특징과 사용 사례를 가지고 있습니다:

- **OAuth 2.0**: 권한 부여에 특화된 프로토콜로, API 접근 권한 부여에 적합합니다
- **OIDC**: OAuth 2.0을 기반으로 한 인증 프로토콜로, 소셜 로그인 및 모바일/웹 앱 인증에 적합합니다
- **SAML 2.0**: XML 기반의 엔터프라이즈 SSO 프로토콜로, 기업 환경의 통합 인증에 적합합니다

프로젝트의 요구사항(사용 사례, 보안 수준, 구현 복잡도, 엔터프라이즈 지원 등)을 종합적으로 고려하여 적절한 프로토콜을 선택하는 것이 중요합니다. Keycloak과 같은 IAM 솔루션을 활용하면 여러 프로토콜을 동시에 지원하고, 프로토콜 간 마이그레이션을 용이하게 할 수 있습니다.

