---
description: SPIFFE·SPIRE 표준과 워크로드 ID(SVID), 신뢰 도메인 개요
tag: ["SPIFFE", "SPIRE", "security", "workload identity"]
---

# SPIFFE와 SPIRE 개요

마이크로서비스, 컨테이너 오케스트레이션, 클라우드 등 **동적·이기종 환경**에서는 IP·호스트명만으로는 “어떤 워크로드가 요청하는지”를 일관되게 식별하기 어렵습니다. **SPIFFE**(Secure Production Identity Framework for Everyone)는 이런 환경에서 소프트웨어 워크로드에 **암호학적으로 검증 가능한 신원**을 부여하기 위한 오픈 표준입니다.

## SPIFFE의 핵심: SPIFFE ID와 SVID

- **SPIFFE ID**: 워크로드에 할당되는 URI 형태의 논리적 식별자(예: `spiffe://trust-domain/path`).
- **SVID**(SPIFFE Verifiable Identity Document): 짧은 수명의 **검증 가능한 신원 문서**로, 일반적으로 **X.509 인증서** 또는 **JWT** 형태입니다. 워크로드는 SVID를 제시해 다른 서비스와 상호 인증(mTLS 등)하거나 토큰 기반 인증에 사용할 수 있습니다.

표준·용어·API에 대한 공식 설명은 [SPIFFE Overview](https://spiffe.io/docs/latest/spiffe-about/overview/)를 참고합니다.

## SPIRE란 무엇인가

**SPIRE**(SPIFFE Runtime Environment)는 SPIFFE API를 구현한 **레퍼런스 구현**으로, 노드·워크로드 **어테스테이션**(attestation)을 통해 조건을 만족할 때만 SVID를 발급합니다. SPIFFE는 여러 제품이 구현할 수 있고, SPIRE는 그중 널리 쓰이는 오픈소스 스택입니다. 아키텍처·컴포넌트는 [SPIRE Concepts](https://spiffe.io/docs/latest/spire-about/spire-concepts/)를 참고합니다.

### 구성 요소(요약)

| 구성 요소 | 역할 |
|-----------|------|
| **SPIRE Server** | 신뢰 도메인 내에서 서명 키·등록 항목을 관리하고, 에이전트·워크로드에 부여할 **SVID 발급** |
| **SPIRE Agent** | 각 노드에서 동작하며 **SPIFFE Workload API**를 로컬에 노출하고, 워크로드 어테스테이션 후 적절한 SVID 제공 |

노드 어테스테이션(클라우드 IID, Kubernetes Service Account, 조인 토큰 등)과 워크로드 어테스테이션(프로세스·쿠버네티스 속성 등)을 통해 “이 프로세스가 등록된 정체성에 해당한다”고 판단한 뒤 SVID를 캐시·전달합니다.

## 어디에 쓰이나

- 서비스 간 **mTLS** 또는 JWT 기반 호출에서 동일한 신원 모델 유지
- **멀티 클러스터·멀티 클라우드**에서 SPIFFE **페더레이션**으로 신뢰 번들(trust bundle) 교환
- 서비스 메시, 에지, VM/베어메탈 등 **Kubernetes에 한정되지 않음** — 다만 운영 예시는 Kubernetes 문서와 함께 다루는 경우가 많습니다

제품·운영 관점의 소개는 Red Hat의 [What are SPIFFE and SPIRE?](https://www.redhat.com/en/topics/security/spiffe-and-spire)를 보조 참고로 쓸 수 있습니다.

## Vault와의 관계

Vault는 SPIFFE **발급 서버를 대체하지 않습니다**. SPIRE(또는 다른 SPIFFE 구현)가 SVID를 발급하고, [Vault Enterprise의 SPIFFE 인증 방법](../../04-HashiCorp/06-Vault/03-Auth_Method/spiffe-auth.md)은 클라이언트가 제시한 SVID를 **신뢰 번들로 검증**한 뒤 Vault 토큰을 주는 **인증 소비자** 역할입니다. 연동 요약은 해당 문서를 참고하세요.
