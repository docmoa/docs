---
description: Identity and Access Management (IAM) 용어 정리
tag: ["IAM", "tip", "terms"]
---

# Identity and Access Management (IAM) 용어 정리

IAM(Identity and Access Management)과 관련된 주요 용어들을 정리한 문서입니다.

## 1. Identity Management (신원 관리)

### 1.1 Identity Management (신원 관리)

: 사용자 디렉토리 구축 및 활성 관리로, 역할과 권한을 포함하여 신원 생명주기 전반(온보딩, 관리, 오프보딩)에 걸쳐 수행됩니다. 권한이 있는 사용자 관리에는 추가적인 모니터링 및 보고가 포함됩니다.

### 1.2 Identity Governance (신원 거버넌스)

: 규정 준수 및 위험 관리 추적을 위한 신원 모니터링으로, 조직 내 입사자, 이동자, 퇴사자를 추적합니다. 거버넌스를 통해 조직은 서비스 및 데이터에 대한 액세스를 제어하기 위해 정의한 정책을 모니터링하고, 활동이 중단되거나 발생하지 않을 때 노출을 줄일 수 있습니다.

### 1.3 Privacy and Consent Management (개인정보 보호 및 동의 관리)

: 소비자가 조직이 특정 목적을 위해 개인 데이터를 사용하는 것에 대한 동의를 제공하는 방법입니다. 개인정보 보호 법률은 이 문제에 대한 강제적 긴급성을 제공하지만, 동의 관리 또한 소비자와의 브랜드 신뢰 구축에 도움이 됩니다.

### 1.4 Identity Fabric (신원 패브릭)

: 멀티 클라우드 신원 관리 프레임워크의 추상화 계층으로, Identity Orchestration 소프트웨어의 일부입니다. 신원 패브릭은 오케스트레이션을 사용하여 여러 클라우드의 여러 신원 도메인을 관리합니다.

### 1.5 Identity Threat Detection and Response (ITDR) (신원 위협 탐지 및 대응)

: 사이버 위협 인텔리전스, 행동 분석, 도구 및 구조화된 프로세스로 구성된 보안 분야로, 신원 인프라 보안을 강화하고 신원 중심 공격의 조치를 가속화합니다.

## 2. Access Control & Security (액세스 제어 및 보안)

### 2.1 Least Privilege (최소 권한 원칙)

: 사용자가 자신의 업무 기능을 수행하는 데 필요한 최소 수준의 액세스 또는 권한만 부여되는 정보 보안 개념입니다. 최소 권한 원칙은 인간의 액세스를 넘어 확장됩니다.

### 2.2 Account Lifecycle Management (계정 생명주기 관리)

: 서비스 계정의 자동 프로비저닝, 거버넌스, 규정 준수 및 폐기 기능으로, 위반 및 인간 오류의 위험을 완화하여 모든 계정에 중앙 감독 및 제어를 제공합니다.

### 2.3 Security Lifecycle Management (SLM) (보안 생명주기 관리)

: 구조화된 지속적인 프로세스를 통해 디지털 자산을 보호하고 보안하는 관행입니다. 각각 다른 취약점과 위험을 해결하는 것을 목표로 하는 여러 단계로 구성됩니다.

### 2.4 Infrastructure Lifecycle Management (ILM) (인프라 생명주기 관리)

: 조직의 인프라 생명주기를 관리하는 프로세스입니다. 여기에는 인프라 구성 요소의 계획, 구축, 배포, 유지 관리 및 폐기가 포함됩니다.

### 2.5 Zero Trust (제로 트러스트)

: 조직의 네트워크 내부 또는 외부에 있는 모든 사용자가 애플리케이션 및 데이터에 대한 액세스를 부여받거나 유지하기 전에 인증, 권한 부여 및 보안 구성 및 상태에 대한 지속적인 검증을 요구하는 보안 프레임워크입니다.

### 2.6 Identity Security Posture Management (ISPM) (신원 보안 상태 관리)

: 디지털 신원 및 액세스와 관련된 조직의 보안 정책 및 제어를 관리하고 개선하는 프로세스입니다.

---

## 참고 자료 (References)

### NIST

- **NIST SP 800-63-3: Digital Identity Guidelines**
  - Identity Management, Account Lifecycle Management 관련
  - [https://pages.nist.gov/800-63-3/](https://pages.nist.gov/800-63-3/)

- **NIST SP 800-53 Rev. 5: Security and Privacy Controls for Information Systems and Organizations**
  - Identity Governance, Least Privilege 관련
  - [https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)

- **NIST Privacy Framework**
  - Privacy and Consent Management 관련
  - [https://www.nist.gov/privacy-framework](https://www.nist.gov/privacy-framework)

- **NIST SP 800-207: Zero Trust Architecture**
  - Zero Trust, Identity Fabric 관련
  - [https://csrc.nist.gov/publications/detail/sp/800-207/final](https://csrc.nist.gov/publications/detail/sp/800-207/final)

- **NIST Cybersecurity Framework**
  - Identity Threat Detection and Response (ITDR), Identity Security Posture Management (ISPM) 관련
  - [https://www.nist.gov/cyberframework](https://www.nist.gov/cyberframework)

- **NIST SP 800-160: Systems Security Engineering**
  - Security Lifecycle Management (SLM), Infrastructure Lifecycle Management (ILM) 관련
  - [https://csrc.nist.gov/publications/detail/sp/800-160/vol-1/final](https://csrc.nist.gov/publications/detail/sp/800-160/vol-1/final)

### OWASP

- **OWASP Identity and Access Management**
  - [https://owasp.org/www-community/Identity_and_Access_Management](https://owasp.org/www-community/Identity_and_Access_Management)

- **OWASP Top 10**
  - 인증 및 세션 관리 관련 취약점 포함
  - [https://owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/)

