---
description: 이 글은 양자 안전(Quantum Safe)에 대한 내용으로, 양자 안전 암호화에 대해 다룹니다.
tag: ["quantum", "safe", "cryptography", "quantum-safe", "qkd"]
---

# Lesson 2: 양자 안전 암호화

이 글은 양자 안전(Quantum Safe)에 대한 두 번째 강의로, Quantum-safe cryptography (양자 안전 암호화)와 Quantum key distribution (양자 키 분배, QKD)에 대해 소개합니다.

## 2.1 양자 안전(내성) 암호화란 무엇인가?

이전 모듈에서 논의한 바와 같이, 현재 사용 중인 비대칭 알고리즘은 양자 컴퓨터의 공격에 저항할 수 있는 새로운 알고리즘으로 교체되어야 합니다. Quantum-safe cryptography (양자 안전 암호화, 때로는 "post-quantum cryptography (후양자 암호화)"라고도 함)는 고전 컴퓨터뿐만 아니라 양자 컴퓨터의 추가 계산 능력에 대해서도 안전한 것으로 간주되는 이러한 알고리즘의 설계 및 구현입니다.

양자 컴퓨터는 특정 수학적 문제를 해결할 수 있는 잠재력을 가지고 있지만, 수십 년 동안 연구되어 온 많은 다른 문제들이 있으며, 이러한 문제들에 대해서는 양자 알고리즘이 도움이 되지 않는다고 믿고 있습니다.

이러한 문제 중 일부는 lattices (격자), codes (코드), isogenies (동형), multivariate equations (다변수 방정식)의 수학적 영역에서 나옵니다. 시스템을 양자 안전하게 만들려면 먼저 이러한 문제의 어려움에 기반한 효율적인 기본 요소(foundational primitives)를 설계한 다음, 이를 다양한 프로토콜로 결합해야 합니다.

Quantum-safe algorithms (양자 안전 알고리즘)은 이러한 수학적 문제에 기반한 암호화 알고리즘이며, 표준 장치에서 사용하여 현재 사용되는 비대칭 알고리즘과 동일한 보안 목표를 달성할 수 있습니다: integrity (무결성), confidentiality (기밀성), non-repudiation (부인 방지), authentication (인증).

양자 안전 암호화 알고리즘의 설계 및 구현은 연구 기관의 핵심 연구 목표입니다. 여기에는 현재 NIST에 의해 표준화가 진행 중인 암호화 및 서명 체계와 프라이버시 보존 암호화 영역의 더 고급 체계가 포함됩니다.

## 2.2 양자 키 분배(Quantum Key Distribution, QKD)란 무엇인가?

Quantum-safe cryptography (양자 안전 암호화)와 quantum cryptography (양자 암호화)를 구별할 수 있는 것이 중요합니다. 두 주제 모두 현재 산업 및 연구의 주목을 받고 있기 때문입니다.

Quantum cryptography (양자 암호화) 분야는 양자 역학적 특성을 활용하여 암호화 작업을 수행하려고 시도합니다. 이 중 가장 두드러진 예는 quantum key distribution (양자 키 분배, QKD)이며, 여기서 좀 더 자세히 설명하겠습니다.

QKD는 두 통신 파트너 간에 공통 대칭 키를 설정하는 것을 목표로 하는 방법으로, 그들 사이에 암호화된 통신 채널을 설정하기 위한 것입니다. 양자 통신 채널을 사용할 때, 악의적인 도청자는 탐지되지 않고 비밀 키를 성공적으로 얻을 기회가 거의 없습니다.

양자 채널은 광섬유나 자유 공간과 같은 구성 요소로 물리적으로 구현할 수 있습니다. 둘 다 'photons (광자)', 즉 빛의 입자를 전송하는 데 사용할 수 있기 때문입니다. Photons (광자)는 polarization (편광)과 같은 다양한 자유도를 가지며, 이는 'quantum bit (양자 비트, qubit)' 형태의 'quantum state (양자 상태)'를 나타내는 데 사용할 수 있습니다.

### BB84 프로토콜

첫 번째 QKD 프로토콜은 'BB84'라고 불리며, 1984년에 이 프로토콜을 발명한 Charles Benett (IBM Fellow)와 Gilles Brassard의 이름을 따서 명명되었습니다 ([BB84 프로토콜](https://en.wikipedia.org/wiki/BB84)). 요약하면 다음과 같이 작동합니다:

1. 송신자 Alice는 qubit (큐비트) 세트에 무작위 비트 시퀀스를 인코딩합니다 (물리적으로 광자 시퀀스에 해당)
2. 광자는 하나씩 양자 채널(예: 광섬유)을 통해 수신자 Bob에게 전송되며, Bob은 qubit (큐비트)를 비트 시퀀스로 디코딩합니다
3. 그 후 Alice와 Bob은 고전 채널(예: 전화선)을 사용하여 qubit (큐비트)를 인코딩하고 디코딩한 방법을 비교해야 합니다 — qubit (큐비트)를 보낸 후 인코딩 및 디코딩을 공개하는 것은 잠재적 공격자에게 원본 비트 시퀀스에 대한 정보를 공개하지 않는다는 점에 유의하세요
4. 이 단계가 완료되면 Alice와 Bob은 나중에 암호화 목적으로 사용할 수 있는 공통 대칭 키를 '증류(distilled)'했습니다 (예: 'One-Time Pad' 사용)

QKD의 동기는 공격자 Eve가 Alice가 Bob에게 보내는 qubit (큐비트)를 읽으려고 시도하면, Eve가 양자 상태를 방해하게 된다는 것입니다 (양자 역학의 법칙으로 인해). 즉, 양자 채널에 노이즈를 도입합니다. Alice와 Bob은 노이즈 수준을 감지할 수 있으며, 특정 노이즈 임계값을 초과하면 채널을 단순히 폐기합니다. 노이즈 수준이 임계값 아래로 유지되는 한, Alice와 Bob은 Eve가 나중에 메시지를 해독할 수 없을 것이라고 확신할 수 있습니다.

QKD에 대해 더 자세히 알아보고 Qiskit에서 실험하려면 [여기를 클릭하세요](https://learn.qiskit.org/course/ch-algorithms/quantum-key-distribution).

많은 국가에서 개발 중인 QKD 실험 설정에 대한 자세한 정보는 [여기에서 찾을 수 있습니다](https://digital-strategy.ec.europa.eu/en/policies/european-quantum-communication-infrastructure-euroqci).

## 2.3 양자 안전 암호화와 QKD의 차이점

QKD는 두 원격 당사자 간에 암호화 키를 교환할 수 있게 해줍니다. 그러나 몇 가지 제한 사항이 있어 통신을 양자 안전하게 만드는 유일한 방법으로 널리 사용하기에는 부적합합니다 ([NSA의 고려 사항](https://www.nsa.gov/Cybersecurity/Quantum-Key-Distribution-QKD-and-Quantum-Cryptography-QC/) 참조):

- **부분적 솔루션**: Quantum key distribution (양자 키 분배)는 부분적 솔루션일 뿐입니다. 기밀성을 제공하는 데 사용되는 키 자료를 생성하지만, QKD 전송 소스를 인증하는 수단을 제공하지는 않습니다. 후자를 수행하려면 Quantum-safe cryptography (양자 안전 암호화)를 사용해야 합니다
- **특수 목적 장비**: 기존 인프라나 시스템에 단순히 통합할 수 없으며, 대신 특수 목적 하드웨어가 필요합니다
- **구현 보안 검증의 어려움**: QKD가 도청자에 대한 이론적 저항이 물리 법칙에 의해 보장되더라도, 특정 구현의 보안을 보호하고 검증하는 것은 도전 과제입니다
- **실용적 구현의 제한**: 실용적 구현은 범위 또는 대역폭(또는 둘 다)에서 심각한 제한이 있습니다

반면, Quantum-safe cryptography (양자 안전 암호화)는 기밀성, 인증, 무결성 및 부인 방지를 제공하는 데 사용할 수 있으며, 기존 시스템 및 네트워크 인프라에 통합할 수 있습니다. QKD와 Quantum-Safe Cryptography (양자 안전 암호화) 간의 차이점에 대한 추가 요약은 아래 표에 나와 있습니다.

| 보안 속성 | Quantum-safe Cryptography (QSC)<br/>양자 안전 암호화 | Quantum Key Distribution (QKD)<br/>양자 키 분배 |
|---------|------------------------------------------------|--------------------------------------------|
| **설명** | 고전 및 양자 컴퓨터 모두에 대해 해결하기 어려운 수학적 문제에 기반한 암호화 | 양자 물리 현상을 활용하여 두 원격 당사자 간에 암호화 키를 교환할 수 있게 함 |
| **Confidentiality<br/>(기밀성)** | ✓ 지원 | ✓ 지원 |
| **Authentication<br/>(인증)** | ✓ 지원 | ✗ 지원하지 않음 |
| **Integrity<br/>(무결성)** | ✓ 지원 | ✗ 지원하지 않음 |
| **Non-Repudiation<br/>(부인 방지)** | ✓ 지원 | ✗ 지원하지 않음 |

위에서 언급한 도전 과제를 극복하기 위해 많은 연구가 현재 진행 중입니다. 예를 들어 [1000km 광섬유 거리를 통한 실험적 Twin-Field Quantum Key Distribution](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.130.210801) 또는 [4,600km에 걸친 통합 우주-지상 양자 통신 네트워크](https://www.nature.com/articles/s41586-020-03093-8)를 참조하세요.

QKD는 일부 사용 사례에 유용할 수 있지만, 중요한 정부 기관 및 표준화 기관은 Quantum-safe cryptography (양자 안전 암호화)를 현재 사용되는 암호화 알고리즘을 교체하는 확장 가능한 접근 방식으로 보고 있습니다.

위의 모든 이유로, 주요 기업들은 Quantum-safe cryptography (양자 안전 암호화)에 집중하고 고객이 시스템을 양자 안전하게 만드는 데 도움이 되는 서비스와 도구를 개발하기로 결정했습니다.

## 2.4 격자 기반 암호화 기초

양자 안전 암호화 기본 요소를 찾는 과정에서 연구자들은 양자 컴퓨터가 깨뜨릴 수 없는 다양한 수학적 문제를 기반으로 알고리즘을 개발하려고 시도해왔습니다. 연구 팀은 보안 기본 요소를 구성하는 접근 방식으로 주로 lattice-based cryptography (격자 기반 암호화)에 집중했습니다. Lattice-based cryptography (격자 기반 암호화)는 "geometry of numbers (수의 기하학)"라고 불리는 수학 영역의 문제에 기반합니다.

자세한 내용은 [여기를 클릭하세요](https://www.zurich.ibm.com/security/quantumsafecryptography.html).

이 영역에서 매우 중요한 문제는 "Learning with Errors problem (오류 학습 문제, LWE)"라고 불리는 것으로, 다음과 같이 설명할 수 있습니다.

정사각형의 full-rank 행렬 A와 값 z = Ay mod p가 주어졌다고 가정해봅시다. 여기서 y는 0 또는 1 값을 취하는 계수를 가진 벡터이고, p는 작은(예: 13비트) 소수입니다. 그런 다음 y를 찾는 것이 과제입니다. 이 방정식 시스템을 해결하는 것은 Gaussian algorithm (가우스 알고리즘)을 사용하여 효율적으로 실현할 수 있습니다.

반면, Ay의 약간 "노이즈가 있는" 버전, 즉 Ay + e mod p가 주어지면, 여기서 e는 계수가 0 또는 1과 같은 일부 무작위 벡터입니다. 그러면 충분히 큰 차원(예: 약 512)의 행렬에 대해 이 문제는 놀랍도록 어려워집니다.

**LWE 문제 (Learning with Errors Problem)**

오늘날의 lattice-based cryptography (격자 기반 암호화) 접근 방식은 1990년대에 두 가지 중요한 논문으로 등장했습니다:

- **Brown University의 1996년 논문**: Jeffrey Hoffstein, Jill Pipher 및 Joseph Silverman의 [NTRU: A ring-based public key cryptosystem](https://web.securityinnovation.com/hubfs/files/ntru-orig.pdf)은 NTRU라고 불리는 새로운 효율적인 암호화 시스템을 설명했습니다 (1998년 "Lecture Notes in Computer Science" 책 시리즈의 일부로 출판됨)
- **IBM 과학자 Miklos Ajtai의 논문**: [Generating Hard Instances of Lattice Problems](https://eccc.weizmann.ac.il/eccc-reports/1996/TR96-007/index.html)는 lattice-based cryptosystems (격자 기반 암호화 시스템)를 깨는 것이 최소한 점근적으로 어려울 가능성이 높다는 이론적 결과를 증명했습니다

Lattice-based cryptography (격자 기반 암호화)는 양자 안전 암호화 프로토콜의 가장 널리 연구된 영역이 되었습니다. 이러한 광범위한 공개 검토는 이러한 기본 요소의 장기 보안에 대한 신뢰를 제공합니다.

Quantum-safe lattice-based research (양자 안전 격자 기반 연구)는 암호화 체계와 디지털 서명으로 끝나지 않습니다. 연구자들은 동일한 어려움 가정에 기반한 체계에서도 작업하고 있으며, fully homomorphic encryption (완전 동형 암호화, [FHE](https://www.ibm.com/security/services/homomorphic-encryption))로 알려진 암호화된 데이터에 대한 계산과 같은 고급 기능을 활성화하고, 양자 안전 zero-trust 환경을 위한 핵심 기능을 제공합니다.

## 핵심 요약

다음 핵심 사항들을 기억해 두세요:

- Quantum-safe cryptography (양자 안전 암호화)는 고전 및 양자 컴퓨터 모두에 대해 안전한 암호화 알고리즘의 설계 및 구현입니다
- Quantum-safe algorithms (양자 안전 알고리즘)은 integrity (무결성), confidentiality (기밀성), non-repudiation (부인 방지), authentication (인증)을 제공할 수 있습니다
- Quantum key distribution (QKD, 양자 키 분배)는 두 원격 당사자 간에 암호화 키를 교환하는 방법입니다
- QKD는 기밀성만 제공하며, 인증, 무결성, 부인 방지를 제공하지 않습니다
- Quantum-safe cryptography (양자 안전 암호화)는 기밀성, 인증, 무결성 및 부인 방지를 모두 제공할 수 있으며, 기존 시스템에 통합할 수 있습니다
- Lattice-based cryptography (격자 기반 암호화)는 양자 안전 암호화 프로토콜의 가장 널리 연구된 영역입니다
- LWE (Learning with Errors) 문제는 격자 기반 암호화의 중요한 수학적 기초입니다

