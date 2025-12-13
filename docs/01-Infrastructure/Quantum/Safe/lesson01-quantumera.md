---
description: 이 글은 양자 안전(Quantum Safe)에 대한 내용으로, 양자 시대 준비에 대해 다룹니다.
tag: ["quantum", "safe", "cryptography", "quantum-era"]
---

# Lesson 1: 양자 시대 준비

이 글은 양자 안전(Quantum Safe)에 대한 첫 번째 강의로, 양자 컴퓨팅이 암호화에 미치는 영향과 양자 시대에 대비하는 방법에 대해 소개합니다.

- Quantum Computing (양자 컴퓨팅)이 암호화에 미치는 영향
- 양자 알고리즘(Grover's algorithm, Shor's algorithm)이 암호화에 미치는 영향
- 어떤 암호화 알고리즘이 깨질 수 있는지
- Cryptographically Relevant Quantum Computer (암호학적으로 관련된 양자 컴퓨터, CRQC)가 언제 사용 가능할지
- CRQC를 가진 악의적 행위자가 할 수 있는 일

## 1.1 소개

Quantum computing (양자 컴퓨팅)은 새로운 컴퓨팅 패러다임으로, 우리가 세상을 더 잘 이해하고 이전에는 해결할 수 없었던 문제들을 해결할 수 있게 해줄 수 있습니다. 핵심적으로, Quantum Computing (양자 컴퓨팅)은 양자 역학의 힘과 규칙을 활용하여 오늘날의 기존(즉, "고전적") 컴퓨팅 시스템으로는 해결하기 어려운 문제를 다룹니다. 물리 시스템 시뮬레이션, 최적화, 인공지능 등 광범위한 문제에 유용할 것으로 예상됩니다.

양자 컴퓨팅에 대해 더 자세히 알고 싶다면, Quantum Conversations badge를 완료하는 것을 강력히 권장합니다.

## 1.2 양자 컴퓨팅이 암호화에 미치는 영향

Quantum Computing (양자 컴퓨팅)의 급속한 발전은 중요한 도전 과제를 가져옵니다: 오늘날 민감한 데이터를 보호하기 위해 사용되는 많은 시스템이 충분히 강력한 Quantum Computer (양자 컴퓨터)의 공격에 대해 안전하지 않을 수 있습니다.

오늘날 널리 사용되는 많은 암호화 기본 요소(cryptographic primitives)는 고전 컴퓨터로 해결하기 어려운 것으로 간주되는 수학적 문제를 사용합니다. 예를 들어, RSA의 보안은 매우 큰 수의 소인수를 계산하는 것이 계산적으로 불가능한 것으로 간주된다는 사실에 기반합니다.

### 대칭 암호화 vs 비대칭 암호화 기초

현재 사용되는 암호화는 세 가지 유형으로 나뉩니다: symmetric cryptography (대칭 암호화), asymmetric cryptography (비대칭 암호화, 공개 키 암호화라고도 함), 그리고 hash functions (해시 함수).

**Symmetric Cryptography (대칭 암호화):**
- 대칭 암호화 방식으로 메시지를 암호화할 때, 암호화와 복호화에 동일한 키가 사용됩니다
- 서로 다른 통신 파트너 간에 이 공통 대칭 키를 안전하게 공유하는 것은 어려울 수 있으며, 통신 파트너 간에 공통 키를 설정하는 방법이 필요합니다

**Asymmetric Cryptography (비대칭 암호화):**
- 각 통신 파트너는 private key (개인 키, 비밀로 유지됨)와 public key (공개 키, 누구나 알 수 있음)로 구성된 키 쌍을 가집니다
- 이러한 쌍은 key exchange (키 교환)를 수행하는 데 사용되며, 이는 통신 파트너 간에 공통 비밀을 설정하는 것을 용이하게 합니다
- 비대칭 암호화의 두 번째 인기 있는 사용 사례는 digital signatures (디지털 서명) 생성입니다. 서명자의 개인 키는 이메일 및 PDF 문서와 같은 것을 서명하는 데 사용됩니다. 서명을 확인해야 하는 사람은 서명자의 공개 키를 사용하여 확인합니다

**실제 사용:**
- 실제로는 비대칭 및 대칭 암호화의 조합이 웹 트래픽, 이메일, 가상 사설망(VPN), 원격 연결 설정 등 다양한 애플리케이션에 사용됩니다

**Hash Functions (해시 함수):**
- Hash function (해시 함수)는 임의 크기의 입력 데이터(예: 텍스트 메시지)를 고정 크기의 결과(예: 256비트)로 변환하는데, 이를 hash value (해시 값) 또는 message digest (메시지 다이제스트)라고 합니다
- 예를 들어 SHA-256과 SHA3-256은 임의의 입력을 256비트 출력으로 변환합니다
- 안전한 hash function (해시 함수)는 collision resistant (충돌 저항성, 동일한 해시 값을 생성하는 두 메시지를 찾는 것이 불가능한 것으로 간주됨)이어야 하며, pre-image resistant (역상 저항성, 해시 값이 주어졌을 때 이를 생성하기 위해 해시된 값을 찾는 것이 불가능한 것으로 간주됨)이어야 합니다

### 양자 알고리즘의 위협

Quantum Computer (양자 컴퓨터)는 오늘날 사용되는 주요 암호화 기본 요소에 위협을 가합니다. 이는 양자 알고리즘이 그들이 기반으로 하는 고전적으로 어려운 수학적 문제를 더 쉽게 해결할 수 있기 때문입니다. 이 맥락에서 언급해야 할 두 가지 주요 양자 컴퓨팅 알고리즘은 다음과 같습니다:

#### Grover's Algorithm (그로버 알고리즘)

[Grover's algorithm](https://dl.acm.org/doi/10.1145/237814.237866) (1996)은 고전 컴퓨터보다 정렬되지 않은 목록을 더 빠르게 검색할 수 있게 해주는 양자 알고리즘입니다.

정렬되지 않은 N개의 요소 목록이 주어졌다고 가정해봅시다. 이러한 요소 중에는 우리가 찾고자 하는 고유한 속성을 가진 하나의 요소가 있습니다. 고전 계산을 사용하여 이를 수행하려면 평균적으로 이러한 요소의 N/2를 확인해야 하며, 최악의 경우 모든 N개를 확인해야 합니다. 그러나 Quantum Computer (양자 컴퓨터)를 사용하면 Grover's algorithm (그로버 알고리즘)을 사용하여 약 √N 단계로 원하는 요소를 찾을 수 있습니다.

이 알고리즘이 사용될 수 있는 한 가지 방법은 symmetric-key primitives (대칭 키 기본 요소, 예: AES)의 키를 무차별 대입(brute-force)하는 것입니다. 이것은 예를 들어 AES-128 키가 2^64 단계로 무차별 대입될 수 있음을 의미하며, 이는 알고리즘의 보안을 효과적으로 절반으로 줄입니다. 이러한 유형의 공격에 대한 보호는 사용되는 키 크기를 두 배로 늘리는 것으로 충분합니다. Grover's algorithm (그로버 알고리즘)은 hash functions (해시 함수)의 충돌을 찾는 데에도 사용될 수 있습니다. 그러나 이것은 더 큰 출력(즉, 다이제스트 크기)을 가진 hash functions (해시 함수)를 사용하여 완화할 수 있습니다.

Grover's algorithm (그로버 알고리즘)이 어떻게 작동하는지 더 자세히 알아보려면 [여기를 클릭하세요](https://learn.qiskit.org/course/ch-algorithms/grovers-algorithm).

#### Shor's Algorithm (쇼어 알고리즘)

1994년에 수학자 Peter Shor는 큰 수의 소인수를 가장 잘 알려진 고전 알고리즘보다 지수적으로 빠르게 찾을 수 있는 양자 알고리즘을 개발했습니다 [1].

Shor's algorithm (쇼어 알고리즘)은 factoring problem (인수분해 문제)에 기반한 RSA가 제공하는 보안을 크게 감소시킵니다. Shor's algorithm (쇼어 알고리즘)을 사용하는 충분히 강력한 Quantum Computer (양자 컴퓨터)가 RSA를 근본적으로 깨뜨릴 수 있을 것으로 예상됩니다. Shor's algorithm (쇼어 알고리즘)은 타원 곡선 암호화 방식에서 사용되는 discrete logarithm problem (이산 로그 문제)의 어려움에 기반한 다른 인기 있는 암호화 알고리즘을 포함하여 다른 인기 있는 암호화 알고리즘에도 적용될 수 있습니다. 이러한 알고리즘에 기반한 암호화 시스템은 따라서 대규모, 내결함성 양자 컴퓨터에 취약할 것입니다.

이러한 약점의 우려스러운 함의는 Transport Layer Security (TLS, 전송 계층 보안)와 같은 주요 인터넷 보안 프로토콜이 이러한 알고리즘에 의존한다는 것입니다. 안전한 웹사이트에서 기밀 데이터(의료 정보 또는 신용 카드 세부 정보)를 암호화하는 현재 방법은 양자 시대에 효과적이지 않게 되어 데이터를 사이버 공격에 노출시킬 것입니다.

오늘날의 암호화 시스템에서 사용되는 매우 큰 수를 인수분해할 수 있는 Quantum Computer (양자 컴퓨터)가 현재 존재할 가능성은 낮지만, Quantum Computing (양자 컴퓨팅) 시스템이 규모, 품질, 속도에서 성숙해짐에 따라 이것은 변할 가능성이 높습니다. 연구자들은 결국 Shor's algorithm (쇼어 알고리즘)이 2048비트의 기존 키 크기로 RSA를 몇 시간 또는 며칠 만에 깨뜨릴 수 있을 것으로 예측하며, 이는 고전 컴퓨터로는 수백만 년이 걸릴 것입니다 [2, 3].

Shor's algorithm (쇼어 알고리즘)이 어떻게 작동하는지 더 자세한 내용을 알아보려면 [여기를 클릭하세요](https://learn.qiskit.org/course/ch-algorithms/shors-algorithm).

**참고 자료:**
- [1]: [Algorithms for quantum computation: discrete logarithms and factoring](https://ieeexplore.ieee.org/document/365700) ([PDF 다운로드](https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=2273d9829cdf7fc9d3be3cbecb961c7a6e4a34ea))
- [2]: [How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits](https://arxiv.org/pdf/1905.09749.pdf)
- [3]: [Computing Power, Key Length and Cryptanalysis. An Unending Battle?](https://arxiv.org/ftp/arxiv/papers/2011/2011.00985.pdf)

## 1.3 어떤 암호화 알고리즘이 깨질 수 있는가?

위에서 제시한 두 가지 양자 알고리즘은 다음과 같은 결과를 가져옵니다:

- **Symmetric algorithms (대칭 알고리즘)의 보안을 절반으로 감소**: 키 크기를 두 배로 늘리는 것으로 충분합니다
- **Hash functions (해시 함수)의 보안 약화**: 동일한 수준의 보안을 달성하기 위해 더 큰 출력(즉, 다이제스트 크기)을 가진 hash functions (해시 함수)를 사용해야 합니다
- **Asymmetric algorithms (비대칭 알고리즘)의 보안을 0으로 감소**

따라서 Quantum Computing (양자 컴퓨팅)은 asymmetric cryptography (비대칭 암호화)에 가장 큰 영향을 미칩니다. 이 영향은 매우 클 수 있습니다. 왜냐하면 asymmetric cryptography (비대칭 암호화)는 다양한 애플리케이션에서 사용되며, 종종 매우 중요한 데이터와 통신을 보호하기 때문입니다.

다음 표는 Quantum Computing (양자 컴퓨팅)이 오늘날 사용되는 일부 일반적인 알고리즘에 미치는 영향을 요약합니다:

| 암호화 유형 | 알고리즘 예시 | 양자 컴퓨팅의 영향 | 대응 방법 |
|-----------|------------|----------------|---------|
| **Symmetric (대칭)** | AES-128, AES-256 | 보안이 절반으로 감소 | 키 크기를 두 배로 증가 (예: AES-128 → AES-256) |
| **Hash Functions (해시 함수)** | SHA-256, SHA3-256 | 보안 약화 | 더 큰 출력 크기 사용 (예: SHA-256 → SHA-512) |
| **Asymmetric (비대칭)** | RSA, ECC (Elliptic Curve Cryptography) | 보안이 0으로 감소 | Quantum-safe cryptography (양자 안전 암호화)로 전환 필요 |

## 1.4 암호학적으로 관련된 양자 컴퓨터가 언제 사용 가능할까?

암호화에 실제 위협을 가할 수 있을 만큼 강력한 양자 기계 — 일반적으로 "Cryptographically Relevant Quantum Computers" (암호학적으로 관련된 양자 컴퓨터, CRQC)라고 불림 — 는 아마도 구축되기까지 몇 년이 걸릴 것입니다.

연구자들은 CRQC가 언제 사용 가능할지에 대해 다양한 의견을 가지고 있습니다. Global Risk Institute의 양자 위협 타임라인에 대한 연구([2022 Quantum Threat Timeline Report, Dr. Michele Mosca, Dr. Marco Piani](https://globalriskinstitute.org/publication/2022-quantum-threat-timeline-report/))는 양자 컴퓨팅의 여러 측면에서 작업하는 학계 및 산업계의 40명의 국제 전문가들의 의견을 분석하여 예상 타임라인에 대한 지표를 제공합니다.

CRQC의 출현에 대한 다양한 다른 추정치도 사용 가능합니다. 예를 들어 [BSI와 KPMG의 연구](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Krypto/Marktumfrage_Kryptografie_Quantencomputing.pdf?__blob=publicationFile&v=9)는 이 연구 참가자의 대다수가 10년 내에 발생할 것으로 예상한다는 것을 보여줍니다. 반면, NIST는 [Post-Quantum Cryptography에 대한 보고서](https://nvlpubs.nist.gov/nistpubs/ir/2016/nist.ir.8105.pdf)에서 첫 번째 암호화 위반이 2030년에 발생할 수 있다고 추정합니다.

## 1.5 CRQC를 가진 악의적 행위자가 할 수 있는 일은 무엇인가?

양자 컴퓨터가 고전 암호화 알고리즘을 깨뜨리는 데 필요한 규모와 속도를 달성하기까지 몇 년이 걸릴 수 있지만, 데이터와 시스템을 보호하기 위해 고전 보안 프로토콜에 의존하는 것은 실질적인 위험을 제시합니다. "Harvest now, decrypt later (지금 수확, 나중에 해독)" 공격은 위협 행위자가 오늘날 보호된 것으로 간주되는 데이터(전송 중 및 저장 중)를 수집하고, 양자 컴퓨터를 사용하여 해독할 수 있는 시점까지 수집된 데이터를 저장할 수 있게 합니다. 일부 민감한 데이터는 30년 이상 기밀로 유지되어야 하기 때문에, 미래의 CRQC에 의한 해독으로부터 데이터를 보호하기 위해 오늘 조치를 취하는 것이 중요합니다.

Quantum-safe cryptography (양자 안전 암호화)를 사용하여 보호되지 않은 모든 데이터 — 과거, 현재, 미래 — 는 위험에 처해 있습니다. RSA 및 ECC와 같은 암호화 시스템이 데이터를 보호하는 데 사용되는 기간이 길수록, 더 많은 데이터가 양자 사이버 공격에 취약하게 남아있을 것이므로, 양자 안전한 미래로 전환하기 위해 오늘 조치를 취하는 것이 중요합니다.

### CRQC 사용 가능 전후 악의적 행위자가 할 수 있는 일

대규모 양자 기계의 미래 적대적 사용이 가질 수 있는 영향을 이해하는 것이 필요합니다:

- **기밀 데이터 해독 및 공개**: 수년에 걸쳐 수집, 도난 또는 손실된 기밀 데이터가 해독되고 공개될 수 있습니다
- **장기 블록체인 자산의 사기적 이전**: Satoshi의 원본 Bitcoin과 같은 장기 블록체인 자산이 사기적으로 이전될 수 있습니다
- **디지털 서명의 신뢰성 의문**: 법적 거래를 검증하는 데 사용되는 digital signatures (디지털 서명)에 의문이 제기될 수 있습니다
- **중요 인프라에 대한 사기적 인증을 통한 접근**: 공격자가 사기적 인증을 통해 중요한 인프라에 접근하여 심각한 피해를 입힐 수 있습니다
- **레거시 시스템에 대한 사기적 소프트웨어 업데이트**: 레거시 시스템이 사기적 소프트웨어 업데이트로 공격받을 수 있습니다
- **디지털 증거 조작**: 디지털 증거가 조작될 수 있습니다

이러한 위협은 깨질 수 있는 암호화 알고리즘을 사용하는 모든 데이터, 시스템 및 기술에 적용됩니다. 여기에는 다음이 포함됩니다:

- Internet communications (인터넷 통신)
- Digital signatures (디지털 서명), 예: eIDAS – PDF Advanced Electronic Signature (PAdES), Advanced Electronic Signatures 등
- Critical infrastructure (중요 인프라)
- Connected vehicles (연결된 차량)
- Financial systems (금융 시스템)
- Blockchain (블록체인)
- Enterprise applications (기업 애플리케이션)

생성되고 처리되는 데이터는 종종 몇 년 동안 안전하게 유지되어야 하는 반면, 기본 시스템을 Quantum-safe cryptography (양자 안전 암호화)로 마이그레이션하는 데는 수십 년이 걸릴 수 있습니다.

CRQC가 사용 가능해지면 민감한 데이터가 노출되고 중요한 시스템이 미래에 보호되지 않은 채로 남을 수 있습니다. 본질적으로, 이 위협은 지난 30년 동안 개발되고 구현된 모든 디지털 비즈니스 모델과 생태계에 영향을 미칩니다. 따라서 이러한 시스템과 데이터를 보호하는 새로운 방법을 개발하고, 양자 안전한 미래로의 마이그레이션을 미리 계획해야 합니다.

후속 모듈에서는 이 위협을 완화하는 방법, Quantum-safe cryptography (양자 안전 암호화)로의 마이그레이션과 관련된 도전 과제, 그리고 전 세계 정보 보안 시스템을 양자 방어하기 위한 노력에서 나타난 양자 안전한 미래로의 로드맵에 대해 논의할 것입니다.

## 핵심 요약

다음 핵심 사항들을 기억해 두세요:

- Quantum Computing (양자 컴퓨팅)의 급속한 발전은 오늘날 사용되는 많은 암호화 시스템에 위협을 가합니다
- Grover's algorithm (그로버 알고리즘)은 대칭 암호화와 해시 함수의 보안을 약화시킵니다
- Shor's algorithm (쇼어 알고리즘)은 RSA 및 ECC와 같은 비대칭 암호화를 근본적으로 깨뜨릴 수 있습니다
- Cryptographically Relevant Quantum Computer (CRQC, 암호학적으로 관련된 양자 컴퓨터)는 아마도 몇 년 내에 사용 가능할 것입니다
- "Harvest now, decrypt later" 공격은 오늘날 수집된 데이터가 미래에 해독될 수 있게 합니다
- 모든 데이터 — 과거, 현재, 미래 — 가 Quantum-safe cryptography (양자 안전 암호화)로 보호되지 않으면 위험에 처해 있습니다
- 양자 안전한 미래로의 전환을 미리 계획하는 것이 중요합니다

