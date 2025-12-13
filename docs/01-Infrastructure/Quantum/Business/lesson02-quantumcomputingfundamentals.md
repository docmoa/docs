---
description: 이 글은 양자 비즈니스 기초에 대한 내용으로, 양자 컴퓨팅의 기초 개념에 대해 다룹니다.
tag: ["quantum", "business", "fundamentals", "quantum-computing"]
---

# Lesson 2: Quantum Computing Fundamentals (양자 컴퓨팅 기초)

이 글은 양자 비즈니스 기초에 대한 두 번째 강의로, Quantum Computing (양자 컴퓨팅)의 핵심 개념과 원리에 대해 소개합니다.

## 학습 목표

이 모듈을 마치면 다음 사항에 대해 더 잘 이해하게 될 것입니다:

- Quantum Computing (양자 컴퓨팅)과 classical computing (고전 컴퓨팅)의 차이를 구분할 수 있습니다
- Qubit (큐비트)과 bit (비트)의 차이를 구분할 수 있습니다
- Quantum Computing (양자 컴퓨팅)의 핵심 개념을 설명할 수 있습니다
- Quantum gate (양자 게이트), quantum circuit (양자 회로), quantum computer (양자 컴퓨터)의 차이를 인식할 수 있습니다

## Quantum Computing (양자 컴퓨팅)이란 무엇인가, 그리고 무엇이 아닌가

Quantum computation (양자 계산)이 classical computer (고전 컴퓨터)에서 수행될 수 있을까요? Quantum Computing (양자 컴퓨팅)이 AI (Artificial Intelligence, 인공지능)의 또 다른 형태일까요? Quantum Computing (양자 컴퓨팅)에 대한 여러 오해를 명확히 해야 합니다.

## 문제를 보는 새로운 방법

조직이나 산업에 Quantum Computing (양자 컴퓨팅)을 적용할 수 있는 잠재력을 이해하는 데 도움이 되는 몇 가지 개념이 있습니다. 모든 컴퓨팅 시스템은 정보를 저장하고 조작하는 기본 능력에 의존합니다. Conventional computer (기존 컴퓨터)는 bit (비트, 0과 1)로 정보를 저장하고, quantum computer (양자 컴퓨터)는 **qubit (큐비트)**을 사용합니다. Quantum computer (양자 컴퓨터)는 자연에서 발견되는 quantum mechanics (양자 역학)의 법칙을 활용합니다. 이는 기존 정보 처리 방식의 근본적인 변화를 나타냅니다.

Quantum Computing (양자 컴퓨팅)이 conventional computing (기존 컴퓨팅)과 매우 다른 이유를 이해하기 위한 비유가 있습니다. 컬러 필름이 등장하기 전후의 사진 예술과 기법을 생각해보세요.

흑백 사진과 컬러 사진의 예를 들어보면, 컬러라는 물리적 현상은 사진이 그레이스케일에 제한되어 있을 때도 존재했습니다. 하지만 "빨강과 노랑을 바꿀 수 있을까?"라는 질문은 전혀 의미가 없었고, 그렇게 하려는 시도도 마찬가지였습니다.

![](https://i2.pickpik.com/photos/871/675/663/black-white-rose-flower-black-and-white-preview.jpg)

컬러 필름이 발명된 후, 사진작가들은 컬러의 물리학을 조작할 수 있게 되면서 예술적이고 기술적인 옵션이 폭발적으로 증가했습니다.

Quantum computer (양자 컴퓨터)가 존재하는 이유는 우리가 최근에 이 세상에 항상 존재해 왔던 것을 제어하는 방법을 알아냈기 때문입니다: superposition (중첩), entanglement (얽힘), interference (간섭)이라는 quantum phenomenon (양자 현상)입니다. 이러한 컴퓨팅의 새로운 요소들은 algorithm (알고리즘)에 설계할 수 있는 가능성을 확장합니다. Quantum computer (양자 컴퓨터)는 문제를 보는 새로운 방법을 제공하며, classical computer (고전 컴퓨터)에는 보이지 않는 해결책을 드러낼 수 있습니다.

컬러 필름 등장 후 흑백 사진이 "black-and-white photography (흑백 사진)"으로 재명명된 것처럼, quantum computing (양자 컴퓨팅) 이전의 컴퓨팅도 새로운 이름이 필요하게 되었습니다. Quantum computing (양자 컴퓨팅) 이전의 컴퓨팅을 지칭하는 가장 일반적인 용어는 **classical computing (고전 컴퓨팅)**입니다. "classical (고전)"과 "quantum (양자)"라는 단어가 "computing (컴퓨팅)"을 수식하게 된 것은 과학자들이 이미 "physics (물리학)"를 수식하는 방식과 같기 때문입니다. 예를 들어 "classical physics (고전 물리학)"와 "quantum physics (양자 물리학)"처럼 말입니다.

## Quantum Computing (양자 컴퓨팅)이 Classical Computing (고전 컴퓨팅)과 어떻게 다른가

오늘날의 컴퓨터는 Alan Turing (앨런 튜링)과 John von Neumann (존 폰 노이만)의 작업으로 거슬러 올라가는 classical model of computation (고전 계산 모델)을 사용하여 계산을 수행하고 정보를 처리합니다. 이 모델에서 모든 정보는 bit (비트)로 축소될 수 있으며, bit (비트)는 0 또는 1의 값을 가질 수 있습니다. 모든 처리는 한 번에 하나 또는 두 개의 bit (비트)에 작용하는 간단한 logic gate (논리 게이트, AND, OR, NOT, NAND)를 통해 수행할 수 있습니다. 계산의 어느 시점에서든 classical computer (고전 컴퓨터)의 상태는 모든 bit (비트)의 상태에 의해 완전히 결정되므로, *n*개의 bit (비트)를 가진 컴퓨터는 $2^n$개의 가능한 상태 중 하나에 존재할 수 있습니다. 이는 00...0 (*n*개의 0의 시퀀스)부터 11...1 (*n*개의 1의 시퀀스)까지의 범위입니다.

반면, quantum model of computation (양자 계산 모델)의 힘은 훨씬 더 풍부한 상태 레퍼토리에 있습니다. Quantum computer (양자 컴퓨터)도 bit (비트)를 가지지만, 0과 1 대신 quantum bit (양자 비트) 또는 qubit (큐비트)는 0, 1, 또는 둘 다의 조합을 나타낼 수 있으며, 이는 superposition (중첩)이라는 속성입니다. 이것 자체로는 특별한 것이 아닙니다. bit (비트)가 0과 1 사이의 중간값을 가질 수 있는 컴퓨터는 단순히 analog computer (아날로그 컴퓨터)일 뿐이며, 일반적인 digital computer (디지털 컴퓨터)보다 거의 더 강력하지 않습니다. 그러나 quantum computer (양자 컴퓨터)는 한 번에 지수적으로 많은 논리적 상태를 허용하는 특별한 종류의 superposition (중첩)을 활용합니다. 이것은 강력한 업적이며, 어떤 classical computer (고전 컴퓨터)도 이를 달성할 수 없습니다. 이러한 quantum superposition (양자 중첩)의 대부분과 quantum computation (양자 계산)에 가장 유용한 것들은 entangled (얽혀 있습니다)—이는 개별 qubit (큐비트)의 digital (디지털) 또는 analog (아날로그) 상태의 할당에 해당하지 않는 전체 컴퓨터의 상태입니다.

Quantum Computing (양자 컴퓨팅)을 이해하는 어려움이 어려운 수학에 있다고 생각할 수 있지만, 수학적으로 quantum concept (양자 개념)은 고등학교 대수학보다 조금 더 복잡할 뿐입니다. Quantum physics (양자 물리학)가 어려운 이유는 단순하지만 직관에 반하는 아이디어를 내재화해야 하기 때문입니다.

## Quantum Information (양자 정보)의 원리

<VidStack
  src="youtube.com/XN3xBbRFkgQ"
  title="양자 통신의 중심에 선 큐비트는 어떻게 탄생했는가"
/>

### Qubit (큐비트)

Classical information (고전 정보)의 주요 단위인 bit (비트)와 quantum information (양자 정보)의 주요 단위인 qubit (큐비트)를 대조해보면, Quantum Computing (양자 컴퓨팅)의 세 가지 핵심 원리인 superposition (중첩), entanglement (얽힘), interference (간섭)을 시각화할 수 있습니다. 이러한 속성을 통해 세계에서 가장 큰 supercomputer (슈퍼컴퓨터)의 범위를 벗어날 수 있는 비즈니스 문제를 해결할 수 있는 quantum algorithm (양자 알고리즘)을 개발할 수 있습니다.

### Superposition (중첩)

**Superposition (중첩)**은 두 개 이상의 상태의 가중 합 또는 차이입니다. 이러한 상태의 혼합은 종종 사람들이 상상하기 어렵습니다 (예: 뒤집힌 동전이 한 번에 앞면과 뒷면 모두의 혼합 상태에 있는 것처럼). 하지만 상상하기 쉬운 경우도 있습니다—예를 들어, 기타에서 여러 음표의 화음이 연주될 때입니다. 공기의 진동은 단순히 음표 중 하나에 해당하는 것이 아니라 모든 음표에 해당합니다. 공기는 화음의 모든 음표에 해당하는 주파수의 조합으로 진동하고 있습니다. "가중 합 또는 차이"는 superposition (중첩)의 일부가 더 많거나 적게 두드러지게 표현된다는 것을 의미합니다. 예를 들어, 현악 사중주에서 바이올린이 다른 악기보다 더 크게 연주될 때처럼 말입니다. 일반적이거나 classical (고전적인) superposition (중첩)은 파동을 포함하는 거시적 현상에서 일반적으로 발생합니다. 따라서 superposition (중첩)은 실제로 친숙한 개념일 수 있습니다.

Quantum world (양자 세계)에 특이하고 특정한 것은, 상태의 superposition (중첩)에 있는 시스템을 측정할 때 시스템이 순수한 상태 중 하나로 붕괴된다는 것입니다. 음악적 비유로는 여러 음표의 화음을 연주하고, 그 화음이 공기를 통해 귀에 전파되지만, 연주된 여러 음표 중 하나만 듣는(측정하는) 것입니다. 거시적 세계에는 이런 것은 존재하지 않습니다.

#### Superposition (중첩)이 Quantum Computer (양자 컴퓨터)를 Classical Computer (고전 컴퓨터)와 어떻게 다르게 만드는가?

*n*개의 qubit (큐비트) 시스템은 $2^n$개의 가능한 상태 중 하나로 측정될 수 있습니다. 이것은 classical computer bit (고전 컴퓨터 비트) 또는 실제로 *n*개의 이진 결과의 모음에도 해당합니다. 이를 설명하기 위해, 각각 두 가지 가능한 면을 가진 *n*개의 구별 가능한 동전을 뒤집는 모든 가능한 결과를 고려해보세요. 우리는 이를 각각 "heads (앞면)" (H)와 "tails (뒷면)" (T)라고 부를 것입니다.

동전 하나를 뒤집으면 두 가지 가능한 상태가 있습니다: H 또는 T.

동전 두 개를 뒤집으면 네 가지 가능한 상태가 있습니다: HH, HT, TH, TT.

동전 세 개의 경우, 우리는 여덟 가지 상태를 찾습니다: HHH, HHT, HTH, HTT, THH, THT, TTH, TTT.

이러한 추세는 계속됩니다. 동전을 하나 더 추가할 때마다 가능한 결과의 수가 두 배가 됩니다. 따라서 *n*개의 이러한 이진 변수 시스템의 결과 수는 $2^n$입니다.

이것이 classical (고전)과 quantum (양자) 컴퓨터 모두에 해당한다면, quantum computer (양자 컴퓨터)를 그렇게 특별하게 만드는 것은 무엇일까요? 답은 superposition (중첩)입니다. Classical (고전)과 quantum (양자) 컴퓨터 모두 $2^n$개의 가능한 상태 공간에 접근할 수 있습니다. 하지만 classical computer (고전 컴퓨터)는 한 번에 그 상태 중 하나에만 있을 수 있는 반면, quantum computer (양자 컴퓨터)는 한 번에 **모든** 이러한 상태의 superposition (중첩)에 있을 수 있습니다.

좀 더 구체적으로 설명하면, 어떤 산업 프로세스와 관련된 최소 비용 *C*를 찾고 있다고 가정해보세요. 이 프로세스는 많은 입력 변수에 의존하며, 이를 $x_i$로 표시하겠습니다. 지금은 이러한 변수가 이진이라고 가정하겠지만, 일반화할 수 있습니다. Classical computer (고전 컴퓨터)에서는 각 가능한 $x_i$ 선택에 대해 비용 $C(x_i)$를 계산해야 합니다. 즉, 0000...00, 000...01, 000...10 등을 모두 입력해야 합니다. Quantum computer (양자 컴퓨터)는 모든 이러한 상태의 superposition (중첩)에 있을 수 있으므로, 모든 가능한 입력 상태에 대해 한 번에 연산을 수행할 수 있습니다.

이것이 너무 좋아서 믿기 어렵다면, 복잡한 점이 있습니다: quantum system (양자 시스템)을 측정할 때 전체 공간의 모든 결과가 아닌 하나의 결과만 얻을 수 있다는 것을 기억하세요. 따라서 작업은 최적의 해결책(예: 최저 비용 및 가장 빠른 응답)이 측정되는 것이 되도록 algorithm (알고리즘)을 작성하는 것입니다. 다시 말해, quantum computer (양자 컴퓨터)는 모든 가능한 해결책을 반환하지 않습니다. 대신 많은 해결책의 공간을 동시에 탐색하고 (algorithm (알고리즘)이 작동하는 경우) 높은 확률로 최적의 해결책을 반환합니다. 매우 큰 해결책 공간이나 계산적으로 매우 비용이 많이 드는 단계가 있는 문제의 경우, 이 차이는 게임 체인저가 될 수 있습니다.

#### Classical vs. Quantum Probability (고전 vs. 양자 확률)?

Classical probability (고전 확률)과 quantum probability (양자 확률)의 차이를 이해하는 것이 중요합니다. Classical probability (고전 확률)는 우리가 모르는 정보에 대한 불확실성을 나타내는 반면, quantum probability (양자 확률)는 시스템이 실제로 여러 상태의 superposition (중첩)에 있다는 것을 나타냅니다.

### Entanglement (얽힘)

**Entanglement (얽힘)**은 quantum mechanics (양자 역학)의 또 다른 핵심 개념입니다. 두 개 이상의 qubit (큐비트)가 얽혀 있을 때, 그들의 상태는 개별적으로 설명할 수 없게 됩니다. 대신, 전체 시스템의 상태만이 의미가 있습니다.

Entanglement (얽힘)는 quantum computer (양자 컴퓨터)에 강력한 계산 능력을 제공합니다. 얽힌 qubit (큐비트)는 독립적으로 작동하는 qubit (큐비트)보다 훨씬 더 많은 정보를 저장하고 처리할 수 있습니다.

### Interference (간섭)

**Interference (간섭)**는 quantum algorithm (양자 알고리즘)이 원하는 결과를 강화하고 원하지 않는 결과를 취소하는 방법입니다. 파동이 서로 보강하거나 상쇄할 수 있는 것처럼, quantum state (양자 상태)도 간섭할 수 있습니다.

Interference (간섭)를 통해 quantum algorithm (양자 알고리즘)은 올바른 답을 찾을 확률을 높이고 잘못된 답을 찾을 확률을 낮출 수 있습니다.

## Quantum Gate (양자 게이트), Circuit (회로), Computer (컴퓨터)

### Quantum Gate (양자 게이트)

Quantum gate (양자 게이트)는 qubit (큐비트)에 작용하는 기본 연산입니다. Classical computer (고전 컴퓨터)의 logic gate (논리 게이트)와 유사하지만, quantum gate (양자 게이트)는 superposition (중첩)과 entanglement (얽힘)을 활용할 수 있습니다.

주요 quantum gate (양자 게이트)에는 다음이 포함됩니다:
- **Pauli gates (파울리 게이트)**: X, Y, Z 게이트
- **Hadamard gate (하다마드 게이트)**: Superposition (중첩)을 만드는 게이트
- **CNOT gate (CNOT 게이트)**: Entanglement (얽힘)을 만드는 게이트
- **Phase gates (위상 게이트)**: 위상을 조작하는 게이트

### Quantum Circuit (양자 회로)

<VidStack
  src="youtube.com/pjOAbmxzVkw"
  title="양자 회로와 측정"
/>

Quantum circuit (양자 회로)는 quantum gate (양자 게이트)의 시퀀스입니다. Quantum algorithm (양자 알고리즘)은 quantum circuit (양자 회로)로 표현됩니다. Circuit (회로)는 왼쪽에서 오른쪽으로 읽으며, 각 gate (게이트)는 특정 qubit (큐비트)에 작용합니다.

### Quantum Computer (양자 컴퓨터)

Quantum computer (양자 컴퓨터)는 quantum circuit (양자 회로)를 실행할 수 있는 물리적 시스템입니다. Quantum computer (양자 컴퓨터)는 다음을 포함합니다:
- **Qubit (큐비트)**: 정보를 저장하는 양자 시스템
- **Control system (제어 시스템)**: Gate (게이트)를 적용하는 시스템
- **Measurement system (측정 시스템)**: 결과를 읽는 시스템

## 핵심 요약

다음 핵심 사항들을 기억해 두세요:

- Quantum Computing (양자 컴퓨팅)은 classical computing (고전 컴퓨팅)과 근본적으로 다른 정보 처리 방식을 나타냅니다
- Qubit (큐비트)는 bit (비트)와 달리 superposition (중첩), entanglement (얽힘), interference (간섭)을 활용할 수 있습니다
- Superposition (중첩)은 quantum computer (양자 컴퓨터)가 한 번에 많은 상태를 탐색할 수 있게 합니다
- Entanglement (얽힘)는 qubit (큐비트) 간의 강한 상관관계를 만들어 계산 능력을 향상시킵니다
- Interference (간섭)는 quantum algorithm (양자 알고리즘)이 올바른 답을 찾을 확률을 높입니다
- Quantum gate (양자 게이트), circuit (회로), computer (컴퓨터)는 각각 다른 수준의 추상화를 나타냅니다

