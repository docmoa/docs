---
description: API authentication methods
tag: ["API", "authentication", "security", "tip"]
toc: true
---

# API 인증

API 인증 방식에는 무엇이 있고, 각각의 특징과 사용 사례는 무엇인지 설명합니다.

> 관련 문서: [API 유형](./api-types.html) | [API 보안을 위한 Vault 활용](../../04-HashiCorp/06-Vault/04-UseCase/API-security.html)

## 개요

API 인증은 클라이언트가 API 서버에 자신의 신원을 증명하고, 적절한 권한을 부여받기 위한 메커니즘입니다. 현재 사용되는 주요 API 인증 방식은 **API Key**, **OAuth 2.0/OIDC**, **JWT**, **mTLS**, **Basic Authentication**, **Bearer Token**, **Session-based Authentication** 등이 있으며, 각각 보안 수준, 구현 복잡도, 사용 사례에서 차이를 보입니다.

## API 인증 방식 비교표

| 인증 방식 | 보안 수준 | 구현 복잡도 | 주요 특징 | 적합한 사용 사례 |
|---------|---------|-----------|----------|----------------|
| **API Key** | 중 | 낮음 | 간단하고 빠른 구현, 고정된 키 값 | 서버 간 통신, 내부 API, 서비스 간 통합 |
| **OAuth 2.0 / OIDC** | 높음 | 높음 | 표준화된 인증/인가 프레임워크, 위임된 접근 | 사용자 인증, 제3자 앱 통합, 모바일 앱 |
| **JWT** | 중-높음 | 중 | 무상태 토큰, 자가 포함(self-contained) | 마이크로서비스, 분산 시스템, SPA |
| **mTLS** | 매우 높음 | 높음 | 상호 TLS 인증, 강력한 신원 확인 | 서버 간 통신, 금융 시스템, 정부 시스템 |
| **Basic Authentication** | 낮음 | 낮음 | 사용자명/비밀번호 기반, Base64 인코딩 | 내부 시스템, 개발/테스트 환경 |
| **Bearer Token** | 중-높음 | 중 | 토큰 기반 인증, OAuth 2.0과 함께 사용 | RESTful API, 모바일 앱, 웹 서비스 |
| **Session-based** | 중 | 중 | 서버 측 세션 관리, 쿠키 기반 | 전통적인 웹 애플리케이션, 사용자 세션 관리 |

## 1. API Key

API Key는 가장 간단한 인증 방식으로, 클라이언트가 요청 시 고유한 키 값을 전송하여 자신을 식별합니다.

### 정의

**API Key**는 클라이언트를 식별하기 위한 고유한 문자열 값입니다. 서버는 이 키를 통해 요청을 보낸 클라이언트를 식별하고, 해당 클라이언트에게 부여된 권한을 확인합니다.

### 동작 흐름

```mermaid
sequenceDiagram
    participant Client as 클라이언트<br/>(앱/서비스)
    participant API as API 서버

    Note over Client,API: 1. API Key 발급 (초기 설정)
    Client->>API: API Key 발급 요청<br/>(관리자 인증 필요)
    API->>API: API Key 생성 및 저장
    API->>Client: API Key 반환<br/>(예: "sk_live_abc123...")

    Note over Client,API: 2. API 요청 (일반적인 사용)
    Client->>API: GET /api/users<br/>Header: X-API-Key: sk_live_abc123...
    API->>API: API Key 검증
    API->>API: 권한 확인
    API->>Client: 200 OK<br/>{users: [...]}
```

### 주요 특징

::: tip API Key의 특징

- **간단한 구현**: 서버 측에서 키 값만 비교하면 되므로 구현이 간단합니다.
- **빠른 처리**: 복잡한 암호화나 토큰 검증 과정이 없어 응답 속도가 빠릅니다.
- **고정된 값**: 일반적으로 만료 시간이 없거나 매우 길어 관리가 용이합니다.

:::

### 사용 예시

```bash
# API Key를 헤더에 포함하여 요청
curl -X GET https://api.example.com/users \
  -H "X-API-Key: sk_live_abc123def456ghi789"

# 또는 쿼리 파라미터로 전달 (보안상 권장하지 않음)
curl -X GET "https://api.example.com/users?api_key=sk_live_abc123def456ghi789"
```

### 보안 고려사항

::: warning API Key의 보안 위험

- **노출 위험**: API Key가 노출되면 무기한으로 악용될 수 있습니다.
- **HTTPS 필수**: 반드시 HTTPS를 사용하여 전송 중 키가 노출되지 않도록 해야 합니다.
- **키 순환**: 정기적으로 키를 교체하고, 사용하지 않는 키는 즉시 삭제해야 합니다.
- **저장 위치**: 소스 코드나 공개 저장소에 키를 저장하지 않아야 합니다.

:::

::: danger API Key 모범 사례

API Key를 안전하게 관리하기 위해 다음 사항을 준수해야 합니다:

1. **사용자 인증에 사용하지 않기**: API Key는 앱/서비스 인증용이며, 사용자 인증에는 OAuth 2.0 등을 사용해야 합니다.
2. **만료 시간 설정**: 가능한 경우 API Key에 만료 시간을 설정하고 정기적으로 갱신합니다.
3. **권한 최소화**: 각 API Key에 필요한 최소한의 권한만 부여합니다.
4. **감사 로그**: API Key 사용 내역을 기록하고 모니터링합니다.

:::

## 2. OAuth 2.0 / OIDC

OAuth 2.0은 사용자가 제3자 애플리케이션에 자신의 리소스에 대한 접근 권한을 안전하게 위임할 수 있도록 하는 인증/인가 프레임워크입니다.

### 정의

**OAuth 2.0**(Open Authorization 2.0)은 리소스 소유자가 클라이언트 애플리케이션에게 자신의 리소스에 대한 제한된 접근 권한을 부여하는 표준 프로토콜입니다. **OIDC**(OpenID Connect)는 OAuth 2.0을 기반으로 한 인증 레이어로, 사용자 신원 확인을 제공합니다.

### 동작 흐름

```mermaid
sequenceDiagram
    participant User as 사용자
    participant Client as 클라이언트 앱
    participant Auth as 인증 서버<br/>(Authorization Server)
    participant API as 리소스 서버<br/>(API Server)

    Note over User,API: Authorization Code Flow
    User->>Client: 앱 접근 시도
    Client->>Auth: 인증 요청<br/>(client_id, redirect_uri, scope)
    Auth->>User: 로그인 화면 표시
    User->>Auth: 인증 정보 입력
    Auth->>User: 동의 화면 표시
    User->>Auth: 접근 동의
    Auth->>Client: Authorization Code 반환<br/>(redirect_uri로 리다이렉트)
    Client->>Auth: Access Token 요청<br/>(code, client_id, client_secret)
    Auth->>Auth: Code 검증
    Auth->>Client: Access Token 발급<br/>(+ Refresh Token)
    Client->>API: API 요청<br/>Header: Authorization: Bearer {token}
    API->>Auth: Token 검증
    Auth->>API: Token 유효성 확인
    API->>Client: 200 OK<br/>{data: [...]}
```

### 주요 특징

::: tip OAuth 2.0의 특징

- **위임된 접근**: 사용자가 직접 비밀번호를 공유하지 않고도 제3자 앱에 권한을 부여할 수 있습니다.
- **표준화**: 널리 사용되는 표준 프로토콜로, 다양한 플랫폼과 호환됩니다.
- **토큰 기반**: Access Token과 Refresh Token을 사용하여 보안을 강화합니다.
- **스코프 기반 권한**: 세밀한 권한 제어가 가능합니다.

:::

### Grant Types

OAuth 2.0은 다양한 사용 사례를 위해 여러 Grant Type을 제공합니다:

| Grant Type | 설명 | 사용 사례 |
|-----------|------|----------|
| **Authorization Code** | 가장 안전한 방식, 서버 간 통신 | 웹 애플리케이션, 서버 앱 |
| **Implicit** | 클라이언트 측 앱용 (구식, 권장하지 않음) | 단일 페이지 애플리케이션 (구버전) |
| **Client Credentials** | 클라이언트 자체 인증 | 서버 간 통신, M2M |
| **Resource Owner Password** | 사용자 자격 증명 직접 전달 (권장하지 않음) | 신뢰할 수 있는 앱만 |
| **Device Code** | 입력 제한 장치용 | 스마트 TV, IoT 장치 |

### 사용 예시

```bash
# 1. Authorization Code 요청 (브라우저에서 실행)
# https://auth.example.com/authorize?client_id=myapp&redirect_uri=https://myapp.com/callback&response_type=code&scope=read

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
  "refresh_token": "def50200a1b2c3d4e5f6..."
}

# 3. API 요청 (Access Token 사용)
curl -X GET https://api.example.com/users/me \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..."
```

### 보안 고려사항

::: warning OAuth 2.0 보안 고려사항

- **HTTPS 필수**: 모든 통신은 반드시 HTTPS를 통해 이루어져야 합니다.
- **State 파라미터**: CSRF 공격 방지를 위해 state 파라미터를 사용해야 합니다.
- **PKCE**: 모바일 앱과 SPA에서는 PKCE(Proof Key for Code Exchange)를 사용해야 합니다.
- **Token 저장**: Access Token은 안전하게 저장하고, Refresh Token은 더욱 엄격하게 보호해야 합니다.

:::

## 3. JWT (JSON Web Token)

JWT는 클레임(claim)을 JSON 형식으로 인코딩한 자가 포함(self-contained) 토큰입니다.

### 정의

**JWT**(JSON Web Token)는 두 당사자 간에 정보를 안전하게 전송하기 위한 개방형 표준(RFC 7519)입니다. JWT는 헤더, 페이로드, 서명의 세 부분으로 구성되며, Base64 URL 인코딩되어 있습니다.

### 구조

JWT는 다음과 같은 형식입니다:

```
header.payload.signature
```

- **Header**: 토큰 타입과 서명 알고리즘 정보
- **Payload**: 클레임(사용자 정보, 권한 등)
- **Signature**: 헤더와 페이로드를 서명하여 변조를 방지

### 동작 흐름

```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant Auth as 인증 서버
    participant API as API 서버

    Note over Client,API: 1. 로그인 및 JWT 발급
    Client->>Auth: 로그인 요청<br/>(username, password)
    Auth->>Auth: 인증 확인
    Auth->>Auth: JWT 생성<br/>(header.payload.signature)
    Auth->>Client: JWT 반환<br/>(Access Token)

    Note over Client,API: 2. API 요청 (JWT 사용)
    Client->>API: GET /api/users<br/>Header: Authorization: Bearer {JWT}
    API->>API: JWT 서명 검증
    API->>API: Payload에서 사용자 정보 추출
    API->>API: 권한 확인
    API->>Client: 200 OK<br/>{users: [...]}

    Note over Client,API: 3. 토큰 만료 시
    Client->>API: API 요청 (만료된 JWT)
    API->>API: JWT 만료 확인
    API->>Client: 401 Unauthorized
    Client->>Auth: Refresh Token으로 새 JWT 요청
    Auth->>Client: 새 JWT 발급
```

### 주요 특징

::: tip JWT의 특징

- **무상태성**: 서버가 세션을 저장할 필요가 없어 확장성이 좋습니다.
- **자가 포함**: 토큰 자체에 사용자 정보가 포함되어 있어 추가 조회가 불필요합니다.
- **분산 시스템 친화적**: 여러 서버에서 동일한 토큰을 검증할 수 있습니다.
- **표준화**: 널리 사용되는 표준으로 다양한 라이브러리가 존재합니다.

:::

### 사용 예시

```bash
# JWT 디코딩 예시 (실제로는 서버에서 검증)
# Header
{
  "alg": "HS256",
  "typ": "JWT"
}

# Payload
{
  "sub": "1234567890",
  "name": "홍길동",
  "iat": 1516239022,
  "exp": 1516242622,
  "roles": ["user", "admin"]
}

# API 요청
curl -X GET https://api.example.com/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IuqwgOq4uO2ZlCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
```

### 보안 고려사항

::: warning JWT 보안 고려사항

- **서명 검증 필수**: 반드시 서명을 검증하여 변조를 방지해야 합니다.
- **만료 시간 설정**: 짧은 만료 시간을 설정하고 Refresh Token을 사용해야 합니다.
- **민감 정보 포함 금지**: JWT는 Base64로 인코딩되므로 쉽게 디코딩 가능합니다. 비밀번호 등 민감 정보를 포함하지 않아야 합니다.
- **HTTPS 필수**: 전송 중 토큰이 노출되지 않도록 HTTPS를 사용해야 합니다.

:::

## 4. mTLS (Mutual TLS)

mTLS는 클라이언트와 서버가 서로의 인증서를 검증하는 상호 TLS 인증 방식입니다.

### 정의

**mTLS**(Mutual TLS)는 일반적인 TLS와 달리, 서버뿐만 아니라 클라이언트도 인증서를 제공하여 양방향 인증을 수행하는 방식입니다. 이를 통해 서버는 클라이언트의 신원을 확인할 수 있습니다.

### 동작 흐름

```mermaid
sequenceDiagram
    participant Client as 클라이언트<br/>(인증서 보유)
    participant API as API 서버<br/>(인증서 보유)

    Note over Client,API: TLS 핸드셰이크 및 상호 인증
    Client->>API: ClientHello<br/>(지원하는 암호화 스위트)
    API->>Client: ServerHello + Server Certificate
    Client->>Client: 서버 인증서 검증<br/>(CA 체인 확인)
    Client->>API: Client Certificate 전송
    API->>API: 클라이언트 인증서 검증<br/>(CA 체인 확인)
    Client->>API: CertificateVerify<br/>(클라이언트 개인키로 서명)
    API->>Client: Finished
    Client->>API: Finished

    Note over Client,API: 암호화된 통신 시작
    Client->>API: API 요청<br/>(TLS 암호화된 채널)
    API->>API: 클라이언트 인증서에서<br/>클라이언트 신원 확인
    API->>Client: 200 OK<br/>(암호화된 응답)
```

### 주요 특징

::: tip mTLS의 특징

- **강력한 인증**: 인증서 기반으로 클라이언트 신원을 확실하게 확인할 수 있습니다.
- **암호화 통신**: 모든 통신이 TLS로 암호화되어 전송 중 데이터 보호가 가능합니다.
- **무토큰 인증**: 별도의 토큰 없이 인증서만으로 인증이 완료됩니다.
- **네트워크 레벨 보안**: 애플리케이션 레벨이 아닌 네트워크 레벨에서 보안을 제공합니다.

:::

### 사용 예시

```bash
# 클라이언트 인증서를 사용한 API 요청
curl -X GET https://api.example.com/users \
  --cert client.crt \
  --key client.key \
  --cacert ca.crt

# 또는 환경 변수로 설정
export SSL_CERT_FILE=client.crt
export SSL_KEY_FILE=client.key
export SSL_CA_FILE=ca.crt
curl -X GET https://api.example.com/users
```

### 보안 고려사항

::: warning mTLS 보안 고려사항

- **인증서 관리**: 클라이언트 인증서의 안전한 배포와 관리가 중요합니다.
- **CA 신뢰**: 신뢰할 수 있는 CA(인증 기관)를 사용해야 합니다.
- **인증서 만료**: 정기적으로 인증서를 갱신하고 만료된 인증서는 즉시 폐기해야 합니다.
- **개인키 보호**: 클라이언트 개인키는 안전하게 보관해야 하며, 노출 시 즉시 인증서를 취소해야 합니다.

:::

::: tip Vault를 활용한 mTLS 자동화

HashiCorp Vault의 PKI Engine을 사용하면 mTLS 인증서를 자동으로 발급하고 관리할 수 있습니다. 이를 통해 인증서 라이프사이클을 자동화하고 보안을 강화할 수 있습니다.

> 자세한 내용: [PKI를 사용하여 mTLS 구성의 인증서 자동화](https://docmoa.github.io/04-HashiCorp/06-Vault/04-UseCase/mtls.html)

:::

## 5. Basic Authentication

Basic Authentication은 HTTP 표준 인증 방식으로, 사용자명과 비밀번호를 Base64로 인코딩하여 전송합니다.

### 정의

**Basic Authentication**은 HTTP 1.0부터 지원하는 가장 기본적인 인증 방식입니다. 사용자명과 비밀번호를 `username:password` 형식으로 결합한 후 Base64로 인코딩하여 `Authorization` 헤더에 전송합니다.

### 동작 흐름

```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant API as API 서버

    Note over Client,API: 1. 인증되지 않은 요청
    Client->>API: GET /api/users
    API->>Client: 401 Unauthorized<br/>WWW-Authenticate: Basic realm="API"

    Note over Client,API: 2. 인증 정보 포함 요청
    Client->>Client: username:password를<br/>Base64 인코딩
    Client->>API: GET /api/users<br/>Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
    API->>API: Base64 디코딩
    API->>API: 사용자명/비밀번호 검증
    API->>Client: 200 OK<br/>{users: [...]}
```

### 주요 특징

::: warning Basic Authentication의 한계

- **낮은 보안 수준**: Base64는 인코딩이지 암호화가 아니므로 쉽게 디코딩 가능합니다.
- **HTTPS 필수**: 반드시 HTTPS를 사용해야 하며, HTTP에서는 사용하지 않아야 합니다.
- **세션 관리 없음**: 매 요청마다 인증 정보를 전송해야 합니다.
- **토큰 갱신 불가**: 비밀번호 변경 시 모든 클라이언트에 영향을 줍니다.

:::

### 사용 예시

```bash
# Basic Authentication 사용
curl -X GET https://api.example.com/users \
  -u "username:password"

# 또는 직접 헤더에 포함
curl -X GET https://api.example.com/users \
  -H "Authorization: Basic $(echo -n 'username:password' | base64)"

# Base64 인코딩 예시
# username:password -> dXNlcm5hbWU6cGFzc3dvcmQ=
```

### 보안 고려사항

::: danger Basic Authentication 사용 시 주의사항

Basic Authentication은 보안 수준이 낮으므로 다음 경우에만 사용해야 합니다:

1. **HTTPS 필수**: 반드시 HTTPS를 통해 통신해야 합니다.
2. **내부 시스템**: 외부에 노출되지 않는 내부 시스템에서만 사용합니다.
3. **임시/테스트**: 개발 및 테스트 환경에서만 사용하고, 프로덕션에서는 더 안전한 방식을 사용합니다.
4. **대안 고려**: 가능한 경우 OAuth 2.0, JWT, mTLS 등 더 안전한 방식을 사용하는 것을 권장합니다.

:::

## 6. Bearer Token

Bearer Token은 토큰을 전송하는 방식으로, OAuth 2.0과 함께 주로 사용됩니다.

### 정의

**Bearer Token**은 토큰을 전송하는 HTTP 인증 스키마입니다. "Bearer"는 "소지자"를 의미하며, 토큰을 소지한 자가 권한을 가진다는 의미입니다. OAuth 2.0의 Access Token을 전송할 때 주로 사용됩니다.

### 동작 흐름

```mermaid
sequenceDiagram
    participant Client as 클라이언트
    participant Auth as 인증 서버
    participant API as API 서버

    Note over Client,API: 1. 토큰 발급
    Client->>Auth: 인증 요청
    Auth->>Client: Bearer Token 발급<br/>(Access Token)

    Note over Client,API: 2. API 요청
    Client->>API: GET /api/users<br/>Authorization: Bearer {token}
    API->>Auth: Token 검증 요청<br/>(또는 로컬 검증)
    Auth->>API: Token 유효성 확인
    API->>Client: 200 OK<br/>{users: [...]}

    Note over Client,API: 3. 토큰 만료 시
    Client->>API: API 요청 (만료된 토큰)
    API->>Client: 401 Unauthorized<br/>WWW-Authenticate: Bearer
    Client->>Auth: Refresh Token으로 새 토큰 요청
    Auth->>Client: 새 Bearer Token 발급
```

### 주요 특징

::: tip Bearer Token의 특징

- **표준화**: RFC 6750에 정의된 표준 방식입니다.
- **유연성**: 다양한 토큰 타입(JWT, Opaque Token 등)과 함께 사용 가능합니다.
- **간단한 구현**: 헤더에 토큰만 포함하면 되므로 구현이 간단합니다.
- **OAuth 2.0 호환**: OAuth 2.0의 표준 토큰 전송 방식입니다.

:::

### 사용 예시

```bash
# Bearer Token 사용
curl -X GET https://api.example.com/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# OAuth 2.0 Access Token 사용
curl -X GET https://api.example.com/users \
  -H "Authorization: Bearer ya29.a0AfH6SMBx..."
```

### 보안 고려사항

::: warning Bearer Token 보안 고려사항

- **HTTPS 필수**: 토큰이 노출되지 않도록 반드시 HTTPS를 사용해야 합니다.
- **토큰 저장**: 클라이언트에서 토큰을 안전하게 저장해야 합니다 (메모리, 안전한 스토리지).
- **토큰 만료**: 짧은 만료 시간을 설정하고 Refresh Token을 사용해야 합니다.
- **토큰 검증**: 서버에서 토큰의 유효성을 반드시 검증해야 합니다.

:::

## 7. Session-based Authentication

Session-based Authentication은 서버에서 세션을 관리하고, 클라이언트는 세션 ID를 사용하여 인증하는 전통적인 방식입니다.

### 정의

**Session-based Authentication**은 서버가 사용자 세션을 생성하고 관리하며, 클라이언트는 세션 ID(일반적으로 쿠키에 저장)를 사용하여 인증 상태를 유지하는 방식입니다.

### 동작 흐름

```mermaid
sequenceDiagram
    participant Client as 클라이언트<br/>(브라우저)
    participant API as API 서버<br/>(세션 저장소)

    Note over Client,API: 1. 로그인
    Client->>API: POST /login<br/>{username, password}
    API->>API: 인증 확인
    API->>API: 세션 생성<br/>(세션 ID: SESSION_123)
    API->>Client: 200 OK<br/>Set-Cookie: sessionid=SESSION_123

    Note over Client,API: 2. 인증된 요청
    Client->>API: GET /api/users<br/>Cookie: sessionid=SESSION_123
    API->>API: 세션 조회
    API->>API: 세션 유효성 확인
    API->>Client: 200 OK<br/>{users: [...]}

    Note over Client,API: 3. 로그아웃
    Client->>API: POST /logout<br/>Cookie: sessionid=SESSION_123
    API->>API: 세션 삭제
    API->>Client: 200 OK
```

### 주요 특징

::: tip Session-based Authentication의 특징

- **서버 측 관리**: 세션 상태를 서버에서 관리하므로 안전합니다.
- **즉시 무효화**: 서버에서 세션을 삭제하면 즉시 무효화됩니다.
- **쿠키 기반**: 브라우저가 자동으로 쿠키를 관리합니다.
- **전통적인 방식**: 오래된 웹 애플리케이션에서 널리 사용됩니다.

:::

### 사용 예시

```bash
# 로그인 (세션 생성)
curl -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "pass"}' \
  -c cookies.txt

# 세션 쿠키를 사용한 API 요청
curl -X GET https://api.example.com/users \
  -b cookies.txt

# 로그아웃 (세션 삭제)
curl -X POST https://api.example.com/logout \
  -b cookies.txt
```

### 보안 고려사항

::: warning Session-based Authentication 보안 고려사항

- **CSRF 보호**: CSRF 토큰을 사용하여 공격을 방지해야 합니다.
- **세션 고정 공격**: 로그인 시 세션 ID를 재생성해야 합니다.
- **쿠키 보안**: HttpOnly, Secure, SameSite 속성을 설정해야 합니다.
- **세션 타임아웃**: 일정 시간 비활성 시 세션을 만료시켜야 합니다.
- **확장성**: 분산 환경에서는 세션 저장소를 공유해야 합니다 (Redis 등).

:::

## 8. Vault Token을 활용한 API 인증 구현

HashiCorp Vault의 Token은 API Key/Token으로 활용할 수 있는 강력한 기능을 제공합니다.

### 개요

Vault Token은 Vault 내에서 인증 이후의 API 인증/인가를 담당하는 요소로, API 키/토큰 발급 서비스로서 다음과 같은 특징을 갖습니다:

- **고유한 값**: 발급 시마다 고유한 값을 생성합니다
- **TTL 관리**: 자동 만료 및 갱신 기능을 제공합니다
- **메타데이터**: 사용자 식별 및 권한 구분을 위한 메타데이터를 포함할 수 있습니다
- **감사 로그**: Vault Audit Log를 통해 생성 요청을 감사할 수 있습니다
- **강제 만료**: 손상된 토큰을 즉시 만료시킬 수 있습니다
- **네트워크 제한**: `token_bound_cidrs` 옵션으로 사용 가능한 네트워크 대역을 제한할 수 있습니다

> 자세한 내용: [API 보안을 위한 Vault 활용](https://docmoa.github.io/04-HashiCorp/06-Vault/04-UseCase/API-security.html)

### Vault Token의 API Key로서의 활용

Vault Token을 API Key로 사용할 때의 주요 요소는 다음과 같습니다:

| 요소 | 설명 |
| - | - |
| `auth.client_token` | 발급된 고유 API 키/토큰 값 |
| `auth.policies` | 토큰에 부여된 정책 (권한) |
| `auth.metadata` | 사용자 식별 및 권한 구분을 위한 메타데이터 |
| `auth.lease_duration` | 토큰의 유효 기간 (TTL) |

### 동작 흐름

```mermaid
sequenceDiagram
    participant App as 애플리케이션
    participant Vault as Vault 서버
    participant API as API 서버

    Note over App,Vault: 1. Vault Token 발급
    App->>Vault: Token 생성 요청<br/>(AppRole 인증)
    Vault->>Vault: 인증 확인
    Vault->>Vault: Token 생성<br/>(TTL, 메타데이터 설정)
    Vault->>App: Vault Token 반환<br/>(client_token)

    Note over App,API: 2. API 요청 (Vault Token 사용)
    App->>API: GET /api/users<br/>Header: X-Vault-Token: {token}
    API->>Vault: Token 검증 요청<br/>POST /v1/auth/token/lookup
    Vault->>Vault: Token 유효성 확인
    Vault->>API: Token 정보 반환<br/>(policies, metadata, ttl)
    API->>API: 권한 확인
    API->>App: 200 OK<br/>{users: [...]}

    Note over App,Vault: 3. Token 갱신 (자동화)
    App->>Vault: Token 갱신 요청<br/>(Vault Agent 또는 직접)
    Vault->>Vault: Token TTL 연장
    Vault->>App: 갱신된 Token 정보
```

### Vault Token Role을 활용한 자동화

Vault Token Role을 정의하면 미리 설정된 값으로 매번 같은 조건의 Token을 생성할 수 있습니다:

```bash
# Token Role 생성
vault write auth/token/roles/api-admin \
  orphan=true \
  token_explicit_max_ttl=3600 \
  token_period=3600 \
  token_type=service \
  allowed_policies="api-read,api-write"

# Role을 사용한 Token 생성
vault write -f auth/token/create/api-admin \
  metadata=app_id=myapp \
  metadata=user_id=user123
```

### 자동화 방안

Vault Token을 API Key로 활용할 때의 자동화 방안:

1. **Vault Agent 활용**: Vault Agent가 자동으로 인증하고 Token을 발급/갱신합니다
2. **AppRole 인증**: 애플리케이션이 AppRole로 인증한 후 Token을 발급받습니다
3. **mTLS 인증**: 네트워크 레벨 인증을 통해 Token을 발급받습니다

> 자세한 내용: [API 보안을 위한 Vault 활용 - 자동화 방안](https://docmoa.github.io/04-HashiCorp/06-Vault/04-UseCase/API-security.html#자동화-방안)

### 장점

::: tip Vault Token을 API Key로 사용할 때의 장점

- **자동 만료 및 갱신**: TTL 기반 자동 관리로 보안을 강화합니다
- **중앙 집중식 관리**: 모든 API Key를 Vault에서 중앙 관리할 수 있습니다
- **감사 및 모니터링**: Vault Audit Log를 통해 모든 토큰 사용 내역을 추적할 수 있습니다
- **즉시 무효화**: 손상된 토큰을 즉시 만료시킬 수 있습니다
- **메타데이터 활용**: 토큰에 사용자 정보를 포함하여 권한을 세밀하게 제어할 수 있습니다

:::

## 9. 인증 방식 선택 가이드

프로젝트의 요구사항에 따라 적절한 인증 방식을 선택하는 것이 중요합니다.

### 사용 사례별 권장 인증 방식

| 사용 사례 | 권장 인증 방식 | 이유 |
|---------|-------------|------|
| **서버 간 통신** | mTLS, API Key | 강력한 신원 확인 또는 간단한 구현 |
| **사용자 인증 (웹)** | OAuth 2.0, Session-based | 표준화된 방식 또는 전통적인 세션 관리 |
| **모바일 앱** | OAuth 2.0 + PKCE, JWT | 보안과 사용자 경험의 균형 |
| **마이크로서비스** | JWT, mTLS | 무상태성과 확장성 |
| **SPA (Single Page App)** | OAuth 2.0, JWT | 토큰 기반 인증 |
| **내부 시스템** | API Key, Basic Auth (HTTPS) | 간단한 구현 |
| **금융/정부 시스템** | mTLS, OAuth 2.0 | 높은 보안 요구사항 |
| **제3자 통합** | OAuth 2.0 | 표준화된 위임 방식 |

### 보안 요구사항에 따른 선택

| 보안 요구사항 | 권장 인증 방식 | 대안 |
|------------|-------------|------|
| **최고 수준** | mTLS | OAuth 2.0 + MFA |
| **높은 수준** | OAuth 2.0, JWT | mTLS |
| **중간 수준** | API Key (HTTPS), Bearer Token | JWT |
| **낮은 수준** | Basic Auth (HTTPS) | API Key |

### 구현 복잡도 고려

| 구현 복잡도 | 인증 방식 | 비고 |
|-----------|---------|------|
| **낮음** | API Key, Basic Auth | 빠른 구현 가능 |
| **중간** | JWT, Bearer Token | 표준 라이브러리 활용 |
| **높음** | OAuth 2.0, mTLS | 인프라 및 설정 필요 |

### 결합 사용

실제 프로젝트에서는 여러 인증 방식을 결합하여 사용하는 경우가 많습니다:

- **OAuth 2.0 + JWT**: OAuth 2.0으로 인증하고, JWT를 Access Token으로 사용
- **mTLS + API Key**: 네트워크 레벨 인증(mTLS)과 애플리케이션 레벨 인증(API Key) 결합
- **Session + JWT**: 전통적인 세션 관리와 JWT를 함께 사용

### 모범 사례

::: tip 인증 방식 선택 모범 사례

1. **보안 요구사항 우선**: 보안 요구사항을 먼저 고려하고, 그 다음 구현 복잡도를 고려합니다
2. **표준 준수**: 가능한 경우 표준화된 방식(OAuth 2.0, JWT)을 사용합니다
3. **HTTPS 필수**: 모든 인증 방식에서 HTTPS를 사용해야 합니다
4. **토큰 만료**: 토큰 기반 인증에서는 짧은 만료 시간을 설정하고 Refresh Token을 사용합니다
5. **최소 권한**: 각 클라이언트에 필요한 최소한의 권한만 부여합니다
6. **모니터링**: 인증 실패 및 이상 징후를 모니터링합니다

:::

## 요약

각 API 인증 방식은 고유한 특징과 사용 사례를 가지고 있습니다:

- **API Key**: 간단하고 빠른 구현, 서버 간 통신에 적합
- **OAuth 2.0 / OIDC**: 표준화된 사용자 인증 및 제3자 통합
- **JWT**: 무상태 토큰, 마이크로서비스 및 분산 시스템에 적합
- **mTLS**: 최고 수준의 보안, 서버 간 통신 및 금융 시스템
- **Basic Authentication**: 간단하지만 낮은 보안 수준, 내부 시스템에만 사용
- **Bearer Token**: 표준화된 토큰 전송 방식, OAuth 2.0과 함께 사용
- **Session-based**: 전통적인 웹 애플리케이션, 서버 측 세션 관리

프로젝트의 보안 요구사항, 구현 복잡도, 사용 사례를 종합적으로 고려하여 적절한 인증 방식을 선택하는 것이 중요합니다. 또한 Vault Token과 같은 중앙 집중식 관리 도구를 활용하면 API Key/Token의 라이프사이클을 자동화하고 보안을 강화할 수 있습니다.

