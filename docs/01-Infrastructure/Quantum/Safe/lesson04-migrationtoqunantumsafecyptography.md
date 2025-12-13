---
description: 이 글은 양자 안전(Quantum Safe)에 대한 내용으로, 양자 안전 암호화로의 마이그레이션에 대해 다룹니다.
tag: ["quantum", "safe", "cryptography", "migration", "quantum-safe"]
---

# Lesson 4: 양자 안전 암호화로의 마이그레이션

이 글은 양자 안전(Quantum Safe)에 대한 네 번째 강의로, 양자 안전 암호화로의 마이그레이션의 필요성, 정부 지침, 도전 과제, 그리고 마이그레이션 전략에 대해 소개합니다.

## 4.1 지금 행동해야 하는 이유

양자 컴퓨팅이 비대칭 암호화를 언제 깨뜨릴 것인지에 대한 질문은 암묵적으로 위협이 미래의 어느 시점에 있을 것이라는 틀을 만듭니다. 그러나 영향은 미래에 느껴질 것이지만, 양자 컴퓨팅과 관련된 위협은 이미 존재합니다. 모듈 1에서 회상하듯이, "harvest now, decrypt later (지금 수확, 나중에 해독)" 공격으로 인해 오늘날 안전하게 보호된 것으로 간주되는 데이터가 도난당하거나 수집된 경우 미래의 양자 적대자에게 이미 손실되었을 수 있습니다.

리스크 관리(risk management)는 이전 모듈에서 설명한 양자 사이버 공격의 맥락에서 "quantum risks (양자 위험)"을 고려해야 하며, 시스템과 데이터의 "security time value (보안 시간 가치)"를 고려해야 합니다 (이전 모듈의 예시 참조). 생성 후 수년 동안 기밀로 유지되어야 하는 데이터는 암호학적으로 관련된 양자 컴퓨터(CRQC)의 출현 전에 충분히 일찍 Quantum-safe cryptography (양자 안전 암호화)로 보호되어야 합니다. 그렇지 않으면 그 중 일부가 노출될 수 있습니다. 동일한 고려 사항은 미래에 오랫동안 안전해야 하면서 현장에 남아있는 시스템 및 제품에 적용됩니다. Quantum-safe cryptography (양자 안전 암호화)로의 적시 마이그레이션은 주요 운영 중단을 피하는 데 중요합니다.

CRQC가 언제 사용 가능할지에 대한 논쟁이 계속되는 동안, 조직은 Quantum-safe cryptography (양자 안전 암호화)로의 마이그레이션에 필요한 리드 타임을 고려해야 합니다. NIST에 따르면, 새로운 Quantum-safe standards (양자 안전 표준)로의 마이그레이션은 최소 5-15년 동안 지속될 것으로 예상됩니다 ([참조](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.04282021.pdf)). 이 진술은 암호화의 광범위한 성격(프로토콜, 애플리케이션 및 중요 인프라에서)과 중요 시스템에서 광범위한 변경에 필요한 시간을 생각해보면 전혀 놀랍지 않습니다. 과거에는 조직이 레거시 SHA1 해싱 알고리즘 또는 레거시 DES 암호화 알고리즘에서 마이그레이션하는 데 수년이 걸렸습니다. Quantum-safe cryptography (양자 안전 암호화)로의 마이그레이션은 확실히 덜 복잡하지 않습니다.

위의 모든 사항을 고려할 때, 특히 복잡한 디지털 인프라를 가진 산업(예: 통신), 긴 보안 수명을 가진 민감한 데이터를 처리하는 산업(예: 금융, 의료 및 보험), 긴 수명을 가진 제품을 생성하는 산업(예: 자동차)의 경우, Quantum-safe migration (양자 안전 마이그레이션)을 준비하기 시작하는 것이 시급하다는 것이 명백해집니다.

예를 들어, 5년 후에 생산될 새 차량의 설계 및 구현 단계는 이미 오늘 시작되었습니다. 차량은 현장에서 10-15년 동안 사용되는 경향이 있으며, 개인 또는 기타 민감한 데이터는 다양한 오프보드 및 온보드 애플리케이션에 의해 처리됩니다. 이것은 차량 내 및 백엔드 구성 요소의 현재 설계가 Quantum-safe algorithms (양자 안전 알고리즘)의 사용 또는 cryptographic agility principles (암호화 민첩성 원칙)의 적용을 허용하지 않으면, 주요 중단 없이는 미래에 이러한 데이터를 보호하는 것이 불가능할 수 있음을 의미합니다.

따라서 기업은 특정 사용 사례에 대한 양자 컴퓨팅의 영향을 식별하고, 양자 컴퓨팅의 산업 진행 상황을 모니터링하며, 산업 표준이 Quantum-safe (양자 안전)하게 만들어지는 속도에 주의를 기울여야 합니다. 새로운 애플리케이션 개발 및 레거시 시스템 마이그레이션 프로젝트는 Quantum safety (양자 안전)의 필요성과 cryptographic agility (암호화 민첩성)의 개념을 인식해야 합니다.

## 4.2 정부 지침

세계는 이 전환의 긴급성을 더욱 심각하게 인식하고 있습니다. 이것은 국가 및 국제 수준에서의 다양한 활동으로 나타나고 있습니다. 국가 수준에서 가장 초기의 행동 요청 중 하나는 2022년 1월 미국에서 발행된 [White House Memorandum (백악관 각서)](https://www.whitehouse.gov/briefing-room/presidential-actions/2022/01/19/memorandum-on-improving-the-cybersecurity-of-national-security-department-of-defense-and-intelligence-community-systems/)로, National Security Systems (국가 보안 시스템)이 다가오는 양자 시대에 대한 사이버 준비 상태를 재평가하도록 요구했습니다. [2022년 11월 각서](https://www.whitehouse.gov/wp-content/uploads/2022/11/M-23-02-M-Memo-on-Migrating-to-Post-Quantum-Cryptography.pdf)는 미국 정부 기관에 대한 구체적인 조치와 타임라인을 수립했습니다. 주목할 만한 것은 2023년 5월 4일까지 "국가 보안 시스템을 제외한 정보 시스템 및 자산의 우선순위가 매겨진 인벤토리를 제출"하라는 지시였습니다.

National Security Agency (NSA, 국가보안청)는 추가로 2022년 9월 [Commercial National Security Algorithm Suite (상업용 국가 보안 알고리즘 제품군, CNSA) 2.0](https://media.defense.gov/2022/Sep/07/2003071834/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS_.PDF)을 발행했으며, 여기서 CRYSTALS-Dilithium과 CRYSTALS-Kyber의 사용이 본질적으로 미국 정부 기관에 기술을 제공하는 모든 관련 제공자에게 의무화될 것입니다. NSA 지침에는 미국 정부 부문의 다양한 사용 사례에 대한 마이그레이션을 위한 특정 타임라인이 포함되어 있으며, 다음 차트에 설명되어 있습니다.

**CNSA 2.0 타임라인:**
- 2025년부터, Quantum-safe software/firmware signing (양자 안전 소프트웨어/펌웨어 서명)은 미국 National Security Systems (국가 보안 시스템)의 맥락에서 "기본 및 선호"로 간주되며, 이는 소유자, 운영자 및 벤더에 적용됩니다.

G7 (7개국으로 구성된 정부 간 정치 포럼)은 추가로 [새로운 Quantum-safe cryptographic standards (양자 안전 암호화 표준)](https://www.whitehouse.gov/briefing-room/statements-releases/2022/06/28/fact-sheet-the-united-states-continues-to-strengthen-cooperation-with-g7-on-21st-century-challenges-including-those-posed-by-the-peoples-republic-of-china-prc/)를 포함한 신기술에 대한 협력에 동의했습니다.

유럽 전역에서도 Quantum-safe migration (양자 안전 마이그레이션)에 대한 권장 사항이 만들어지고 있습니다. 여러 국가가 NIST의 Quantum-safe standardization activities (양자 안전 표준화 활동)와 정렬하고 있지만, 각 지역 보안 당국이 자체 지침을 발행한다는 점에 주목할 가치가 있습니다 — 몇 가지 예시:

- **독일** - [Federal Office for Information Security (연방 정보 보안 사무소, BSI)](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/Broschueren/Kryptografie-quantensicher-gestalten.html): 계획 시작, crypto-agility (암호화 민첩성)에 집중, hash-based schemes (해시 기반 체계) 사용 권장
- **프랑스** - [National Agency for the Security of Information Systems (정보 시스템 보안 국가 기관, ANSSI)](https://www.ssi.gouv.fr/en/publication/anssi-views-on-the-post-quantum-cryptography-transition/): 계획 시작, hybrid schemes (하이브리드 체계) 사용, 2025년 이후 2단계로 전환
- **네덜란드** - [General Intelligence and Security Service (일반 정보 및 보안 서비스, AIVD)](https://english.aivd.nl/publications/publications/2023/04/04/the-pqc-migration-handbook): 계획 시작, 민감한 데이터 및 위험 표면 식별, 사용 중인 기존 암호화 인벤토리 작성
- **영국** - [National Cyber Security Centre (국가 사이버 보안 센터, NCSC)](https://www.ncsc.gov.uk/whitepaper/preparing-for-quantum-safe-cryptography): "일반적인 사이버 보안 모범 사례"를 따르고, 표준 및 규정 준수 제품의 개발을 기다림

이 주제에 대한 국제 권장 사항 및 활동은 주기적으로 업데이트됩니다.

## 4.3 양자 안전 마이그레이션에서 발생하는 도전 과제는 무엇인가?

오늘날, 암호화는 기술 환경 전반에 걸쳐 광범위하게 사용되고 있습니다. Quantum-safe migration (양자 안전 마이그레이션)은 다음과 같은 광범위한 영역에서 변경이 필요합니다:

- **내부 개발 프로세스 및 지침**
- **소프트웨어 아키텍처 표준 및 원칙**
- **내부 보안 표준, 정책 및 절차**
- **Enterprise cryptography infrastructure and services (기업 암호화 인프라 및 서비스)**, 예: PKI & key management (키 관리)
- **HSM 및 Smartcards와 같은 하드웨어 구성 요소의 암호화**
- **애플리케이션 환경 및 제작 또는 구매 또는 폐기 결정**
- **독점 및 타사 소프트웨어/하드웨어**

새로운 Quantum-safe algorithms (양자 안전 알고리즘)의 채택 속도에 영향을 미치는 다양한 요인들:

- **리소스 요구 사항**: 일부 Quantum-safe algorithms (양자 안전 알고리즘)의 리소스 요구 사항은 일부 제품(예: 임베디드 시스템)에서 채택을 매우 어렵게 만듭니다. 특정 사용 사례의 마이그레이션은 알고리즘 및 프로토콜의 신중한 선택뿐만 아니라 사용 사례 설계의 변경이 필요할 수 있습니다. 광범위한 테스트 및 개념 증명(PoC) 생성으로 통찰력을 얻어야 합니다.

- **표준의 미완성**: Quantum-safe standards (양자 안전 표준)는 아직 최종화되지 않았으며 다양한 표준화된 알고리즘을 포함할 것입니다. 올바른 알고리즘, 암호화 라이브러리 및 보안 제품을 선택하는 것은 도전적일 수 있습니다.

- **국가 보안 기관의 권장 사항 차이**: 국가 보안 기관의 권장 사항은 여전히 다양합니다.

- **프로토콜 표준의 부재**: Quantum-safe protocols (양자 안전 프로토콜, 예: TLS)에 대한 표준은 아직 개발되어야 합니다.

- **높은 노력 요구**: 관련 시스템의 마이그레이션에 대한 높은 노력이 예상되며, 다른 활성 보안 위협이 내부 리소스를 차지하고 있습니다.

- **제한적인 제품 가용성**: Quantum-safe capabilities (양자 안전 기능)를 가진 하드웨어 및 소프트웨어 제품이 거의 없습니다.

- **암호화 민첩성 표준 부재**: Cryptographic agility (암호화 민첩성)에 대한 표준이 아직 존재하지 않습니다.

이러한 도전 과제를 극복하기 위해, 기업이 Quantum-safe cryptography (양자 안전 암호화)로의 마이그레이션을 조기에 신중하게 계획하고 설계하는 것이 중요합니다. 이 과정은 양자 위협뿐만 아니라 현재 암호화 환경에 대한 기술과 이해의 개발을 요구할 것입니다.

## 4.4 양자 안전 기술

Quantum-safe cryptography (양자 안전 암호화)의 필요성에 대한 인식을 만드는 것 이상으로, 지금 조직을 Quantum-safe cryptography (양자 안전 암호화)로의 전환을 위해 준비시키는 것이 중요합니다. 조직은 디지털 및 기술 이니셔티브에 Quantum-safe requirements (양자 안전 요구 사항)를 통합하기 시작하고, 높은 우선순위 조치를 식별하기 위한 조사 작업을 수행해야 합니다.

앞서 논의한 바와 같이, 전환은 복잡하고 긴 과정일 수 있으며, 몇 년 동안 지속될 것으로 예상되므로, 주요 기업들은 회사가 Quantum-safe journey (양자 안전 여정)를 탐색하는 데 도움이 되는 제품을 만들었습니다. 주요 기업들은 고객이 양자 알고리즘이 제시하는 보안 도전 과제를 이해하고, 중요한 요소와 즉각적인 조치를 식별하며, Quantum-safe migration (양자 안전 마이그레이션)을 위한 전략을 수립하는 것을 지원합니다. 이것은 우선순위가 매겨진 수정 계획의 생성과 관리 수준에서의 전략적 배치로 이어지며, 이를 위해 관리 이해와 자금 조달을 확보할 수 있습니다.

이 마이그레이션 계획을 실행하려면 조직에서 암호화 사용을 잘 이해해야 합니다. 이를 달성하는 한 가지 방법은 현재 사용 중인 암호화 알고리즘의 인벤토리를 만드는 것입니다. 비즈니스 서비스의 중단 없이 마이그레이션을 가능하게 하는 것도 초점이 되어야 합니다. 이를 달성하기 위해, 주요 기업들은 기술이 마이그레이션 과정의 초기 단계에서 이미 사용될 수 있다고 믿습니다. 이렇게 하면 안전한 제품 개발 중에 Quantum-safe cryptography (양자 안전 암호화)를 고려할 수 있고, 고객이 새로운 알고리즘 사용에 대한 경험을 얻을 수 있습니다.

주요 기업의 양자 안전 기술은 이러한 요구 사항을 염두에 두고 만들어졌습니다 [1]. 조직적 위험, IT 전략, 공급망 의존성 및 생태계 운영에 맞춘 Quantum-safe initiatives (양자 안전 이니셔티브)를 가속화하고 우선순위를 정하는 포괄적인 도구 세트를 제공합니다.

**양자 안전 기술 구성 요소:**

- **양자 안전 Explorer**: 소스 코드 및 객체 코드를 스캔하여 암호화 사용을 발견하고 cryptography bill of materials (암호화 자재 명세서, CBOM) [2]를 생성합니다.

- **양자 안전 Advisor**: 암호화 규정 준수 및 취약점의 자세를 분석하여 암호화를 관찰하고 수정 조치의 우선순위를 정합니다.

- **양자 안전 Remediator**: crypto-agility (암호화 민첩성) 및 Quantum-safe cryptography (양자 안전 암호화) 구현을 위한 수정 패턴을 적용하여 암호화를 변환합니다.

이 접근 방식은 암호화 인벤토리 및 해당 위험 및 거버넌스 계획의 생성을 통해 Quantum-safe change initiatives (양자 안전 변경 이니셔티브)를 지원합니다. Quantum-safe migration plans (양자 안전 마이그레이션 계획)는 우선순위가 매겨진 암호화 수정 프로젝트로 진행됩니다. 암호화 "centers of excellence (우수 센터)"의 설립은 보안 정책 및 기술 기능과 결합하여 암호화의 적응 및 제어를 주도할 수 있습니다.

현재 양자 안전 기술에 대한 자세한 내용은 [여기를 클릭하세요](https://www.ibm.com/quantum/quantum-safe). 또한 제품 및 판매자 자료는 [여기를 참조하세요](https://ibm.seismic.com/Link/Content/DCBQQmgCV6Ch7G2V67Vf4QD99WQP).

**참고 자료:**
- [1]: [양자 안전 기술: 차세대 양자 컴퓨터의 암호화 파괴 공격으로부터 데이터 보호](https://www.forbes.com/sites/moorinsights/2023/05/10/ibm-quantum-safe-technology-protects-data-from-encryption-busting-attacks-by-next-generation-quantum-computers/)
- [2]: [IBM/CBOM](https://github.com/IBM/CBOM)

## 4.5 행동 요청

행동할 시간은 지금이며, 고객과의 대화에서 우리는 시작하기 위한 첫 세 가지 단계를 강조하는 것을 권장합니다:

1. **양자 위험 이해**: 고객은 자신의 맥락(예: 데이터, 자산 등 측면)에서 양자 사이버 보안 위협과 잠재적 영향을 분석해야 합니다. 고객은 또한 Quantum safe (양자 안전)를 위한 내부 챔피언을 식별해야 합니다.

2. **암호화 식별 및 조치 우선순위 정하기**: 현재 사용 중인 암호화를 식별하고 비즈니스 중요성 및 완화의 복잡성 측면에서 조치의 우선순위를 정합니다.

3. **양자 안전 여정 시작**: 행동 계획을 정의하고 Quantum-safe journey (양자 안전 여정)를 시작합니다.

## 핵심 요약

다음 핵심 사항들을 기억해 두세요:

- "Harvest now, decrypt later" 공격으로 인해 양자 컴퓨팅과 관련된 위협은 이미 존재합니다
- Quantum-safe cryptography (양자 안전 암호화)로의 마이그레이션은 최소 5-15년 동안 지속될 것으로 예상됩니다
- 복잡한 디지털 인프라, 긴 보안 수명을 가진 민감한 데이터, 긴 수명을 가진 제품을 가진 산업은 특히 시급하게 준비해야 합니다
- 미국, 유럽 등 여러 국가에서 Quantum-safe migration (양자 안전 마이그레이션)에 대한 정부 지침이 발행되었습니다
- Quantum-safe migration (양자 안전 마이그레이션)은 광범위한 영역에서 변경이 필요하며 여러 도전 과제가 있습니다
- 양자 안전 기술은 마이그레이션을 지원하는 포괄적인 도구 세트를 제공합니다
- 행동할 시간은 지금이며, 양자 위험 이해, 암호화 식별 및 우선순위 정하기, 양자 안전 여정 시작이 첫 세 가지 단계입니다

