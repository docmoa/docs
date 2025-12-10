---

description: 이 글은 양자 정보와 계산에 대한 내용으로, 다중 양자 시스템에 대해 다룹니다.
tag: ["quantum", "information", "computation", "multiple-systems"]

---

# Lesson 2: 다중 시스템 - 양자 정보와 계산 이해하기

## Classical states (고전 상태)

두 개의 시스템이 있다고 가정합니다:

- $X$는 classical state set (고전 상태 집합)이 $\Sigma$인 시스템입니다.
- $Y$는 classical state set (고전 상태 집합)이 $\Gamma$인 시스템입니다.

::: tip 기호 설명: $\Gamma$ (감마)
- **의미**: 두 번째 시스템의 classical state set (고전 상태 집합)을 나타내는 기호
- **발음**: "감마" (Gamma)
- **사용**: 그리스 대문자 감마로, $\Sigma$와 구분하기 위해 두 번째 시스템의 상태 집합을 나타낼 때 사용됩니다.
:::

$X$와 $Y$를 나란히 배치하고 ($X$는 왼쪽, $Y$는 오른쪽), 하나의 시스템처럼 함께 본다고 상상해봅시다.

이 새로운 compound system (복합 시스템)을 $(X, Y)$ 또는 $XY$로 표기합니다.

### 질문

$(X, Y)$의 classical states (고전 상태)는 무엇일까요?

### 답변

$(X, Y)$의 classical state set (고전 상태 집합)은 Cartesian product (카르테시안 곱)입니다:

$$
\Sigma \times \Gamma=\{(a, b): a \in \Sigma \text{ 그리고 } b \in \Gamma\}
$$

::: tip 기호 설명: $\times$ (카르테시안 곱)
- **의미**: 두 집합의 Cartesian product (카르테시안 곱)을 나타내는 기호
- **발음**: "곱하기" 또는 "cross product"
- **사용**: $\Sigma \times \Gamma$는 $\Sigma$의 원소와 $\Gamma$의 원소로 이루어진 모든 순서쌍의 집합을 의미합니다.
:::

### 예시

$\Sigma=\{0,1\}$이고 $\Gamma=\{\clubsuit, \diamondsuit, \heartsuit, \spadesuit\}$인 경우:

$$
\Sigma \times \Gamma=\{(0, \clubsuit),(0, \diamondsuit),(0, \heartsuit),(0, \spadesuit),(1, \clubsuit),(1, \diamondsuit),(1, \heartsuit),(1, \spadesuit)\}
$$

### 여러 시스템으로의 일반화

이 설명은 자연스럽게 두 개 이상의 시스템으로 일반화됩니다. $X_{1}, \ldots, X_{n}$이 각각 classical state sets (고전 상태 집합) $\Sigma_{1}, \ldots, \Sigma_{n}$을 가진 시스템이라고 가정합니다.

$n$-튜플 $\left(X_{1}, \ldots, X_{n}\right)$의 classical state set (고전 상태 집합)은 Cartesian product (카르테시안 곱)입니다:

$$
\Sigma_{1} \times \cdots \times \Sigma_{n}=\left\{\left(a_{1}, \ldots, a_{n}\right): a_{1} \in \Sigma_{1}, \ldots, a_{n} \in \Sigma_{n}\right\}
$$

### 예시

$\Sigma_{1}=\Sigma_{2}=\Sigma_{3}=\{0,1\}$인 경우, $\left(X_{1}, X_{2}, X_{3}\right)$의 classical state set (고전 상태 집합)은:

$$
\begin{aligned}
\Sigma_{1} \times \Sigma_{2} \times \Sigma_{3}= & \{(0,0,0),(0,0,1),(0,1,0),(0,1,1), \\
& (1,0,0),(1,0,1),(1,1,0),(1,1,1)\}
\end{aligned}
$$

### 문자열 표현

$n$-튜플 $\left(a_{1}, \ldots, a_{n}\right)$는 문자열 $a_{1} \cdots a_{n}$로도 쓸 수 있습니다.

### 예시

$X_{1}, \ldots, X_{10}$이 비트라고 가정하면, 이들의 classical state sets (고전 상태 집합)은 모두 같습니다:

$$
\Sigma_{1}=\Sigma_{2}=\cdots=\Sigma_{10}=\{0,1\}
$$

$\left(X_{1}, \ldots, X_{10}\right)$의 classical state set (고전 상태 집합)은 Cartesian product (카르테시안 곱)입니다:

$$
\Sigma_{1} \times \Sigma_{2} \times \cdots \times \Sigma_{10}=\{0,1\}^{10}
$$

문자열로 쓰면, 이러한 classical states (고전 상태)는 다음과 같습니다:

$$
\begin{aligned}
& 0000000000 \\
& 0000000001 \\
& 0000000010 \\
& 0000000011 \\
& \vdots \\
& 1111111111
\end{aligned}
$$

### Convention (규약)

Cartesian products (카르테시안 곱)의 classical state sets (고전 상태 집합)은 사전식 순서(lexicographic ordering)로 정렬됩니다:

- 개별 classical state sets (고전 상태 집합)이 이미 정렬되어 있다고 가정합니다.
- 왼쪽에서 오른쪽으로 갈수록 중요도가 감소합니다.

### 예시

Cartesian product (카르테시안 곱) $\{1,2,3\} \times\{0,1\}$는 다음과 같이 정렬됩니다:

$$
(1,0),(1,1),(2,0),(2,1),(3,0),(3,1)
$$

$n$-튜플이 문자열로 쓰이고 이 방식으로 정렬될 때, $\{0,1\} \times\{0,1\}$가 $00,01,10,11$로 정렬되는 것과 같은 친숙한 패턴을 관찰할 수 있습니다.

## Probabilistic states (확률적 상태)

Compound systems (복합 시스템)의 probabilistic states (확률적 상태)는 개별 시스템의 classical state sets (고전 상태 집합)의 Cartesian product (카르테시안 곱)에 확률을 연관시킵니다.

### 예시

다음은 비트 쌍 $(X, Y)$의 probabilistic state (확률적 상태)입니다:

$$
\begin{aligned}
& \operatorname{Pr}((X, Y)=(0,0))=\frac{1}{2} \\
& \operatorname{Pr}((X, Y)=(0,1))=0 \\
& \operatorname{Pr}((X, Y)=(1,0))=0 \\
& \operatorname{Pr}((X, Y)=(1,1))=\frac{1}{2}
\end{aligned}
$$

이것을 벡터로 표현하면:

$$
\left(\begin{array}{l}
\frac{1}{2} \\
0 \\
0 \\
\frac{1}{2}
\end{array}\right) \leftarrow \begin{aligned}
& \leftarrow \text{상태 00에 연관된 확률} \\
& \leftarrow \text{상태 01에 연관된 확률} \\
& \leftarrow \text{상태 10에 연관된 확률} \\
& \leftarrow \text{상태 11에 연관된 확률}
\end{aligned}
$$

### Independence (독립성)

주어진 $(X, Y)$의 probabilistic state (확률적 상태)에 대해, 다음이 성립하면 $X$와 $Y$가 independent (독립적)이라고 합니다:

$$
\operatorname{Pr}((X, Y)=(a, b))=\operatorname{Pr}(X=a) \operatorname{Pr}(Y=b)
$$

모든 $a \in \Sigma$와 $b \in \Gamma$에 대해.

::: tip 수식 읽기: $\operatorname{Pr}((X, Y)=(a, b))=\operatorname{Pr}(X=a) \operatorname{Pr}(Y=b)$
- **읽는 방법**: "X와 Y가 (a,b)일 확률은 X가 a일 확률 곱하기 Y가 b일 확률과 같다"
- **의미**: 두 시스템이 독립적일 때, 결합 확률은 각 시스템의 개별 확률의 곱과 같습니다.
- **조건부 확률**: 이는 $X$와 $Y$가 서로에 대한 정보를 제공하지 않는다는 것을 의미합니다.
:::

$(X, Y)$의 probabilistic state (확률적 상태)가 벡터로 표현된다고 가정합니다:

$$
|\pi\rangle=\sum_{(a, b) \in \Sigma \times \Gamma} p_{a b}|a b\rangle
$$

독립성 조건은 두 개의 probability vectors (확률 벡터) $|\phi\rangle$와 $|\psi\rangle$가 존재하여 다음을 만족하는 것과 동일합니다:

$$
|\pi\rangle=|\phi\rangle \otimes|\psi\rangle
$$

여기서 $\otimes$는 tensor product (텐서 곱)를 나타냅니다.

::: tip 기호 설명: $\otimes$ (텐서 곱)
- **의미**: Tensor product (텐서 곱)을 나타내는 기호
- **발음**: "텐서 곱" 또는 "tensor product"
- **사용**: 두 벡터나 행렬의 텐서 곱을 나타냅니다. 독립성을 나타내는 데 중요한 역할을 합니다.
- **예시**: $|\phi\rangle \otimes |\psi\rangle$는 두 상태 벡터의 텐서 곱입니다.
:::

### Tensor product of vectors (벡터의 텐서 곱)

두 벡터

$$
|\phi\rangle=\sum_{a \in \Sigma} \alpha_a|a\rangle \quad \text{그리고} \quad |\psi\rangle=\sum_{b \in \Gamma} \beta_b|b\rangle
$$

가 주어지면, tensor product (텐서 곱) $|\phi\rangle \otimes |\psi\rangle$는 다음과 같이 정의된 벡터입니다:

$$
|\phi\rangle \otimes |\psi\rangle = \sum_{(a,b)\in\Sigma\times\Gamma} \alpha_a \beta_b |ab\rangle
$$

이 새로운 벡터의 항목들은 Cartesian product (카르테시안 곱) $\Sigma\times\Gamma$의 원소에 해당하며, 이전 방정식에서 문자열로 쓰여 있습니다.

::: tip 수식 읽기: $|\phi\rangle \otimes |\psi\rangle = \sum_{(a,b)\in\Sigma\times\Gamma} \alpha_a \beta_b |ab\rangle$
- **읽는 방법**: "파이 켓 텐서 곱하기 파이 켓은 시그마 곱하기 감마에 속하는 모든 (a,b)에 대해 알파 a 곱하기 베타 b 곱하기 ab 켓의 합과 같다"
- **의미**: 두 벡터의 텐서 곱은 각 계수의 곱을 가진 모든 가능한 조합의 합입니다.
- **물리적 의미**: 두 시스템이 독립적으로 각각 $|\phi\rangle$와 $|\psi\rangle$ 상태에 있을 때의 결합 상태를 나타냅니다.
:::

## Quantum states (양자 상태)

여러 시스템은 집합적으로 단일 compound system (복합 시스템)으로 볼 수 있습니다. 여러 시스템의 quantum states (양자 상태)는 복소수 항목을 가진 열 벡터로 표현되며, 유클리드 노름이 $1$입니다. 단일 시스템의 경우와 마찬가지입니다.

여러 시스템의 경우, 이러한 벡터의 항목들은 각 개별 시스템과 연관된 classical state sets (고전 상태 집합)의 Cartesian product (카르테시안 곱)와 대응 관계에 있습니다. 이것이 compound system (복합 시스템)의 classical state set (고전 상태 집합)이기 때문입니다.

예를 들어, $X$와 $Y$가 qubit라면, qubit 쌍 $(X,Y)$의 classical state set (고전 상태 집합)은 Cartesian product (카르테시안 곱) $\{0,1\}\times\{0,1\}$입니다. 이진 값 쌍을 길이 2의 이진 문자열로 표현함으로써, 이 Cartesian product (카르테시안 곱) 집합을 집합 $\{00,01,10,11\}$와 연관시킵니다.

다음 벡터들은 모두 쌍 $(X,Y)$의 quantum state vectors (양자 상태 벡터) 예시입니다:

$$
\frac{1}{\sqrt{2}}|00\rangle - \frac{1}{\sqrt{6}}|01\rangle + \frac{i}{\sqrt{6}}|10\rangle + \frac{1}{\sqrt{6}}|11\rangle, \quad
\frac{3}{5}|00\rangle - \frac{4}{5}|11\rangle, \quad \text{그리고} \quad |01\rangle
$$

### Tensor products of quantum state vectors (양자 상태 벡터의 텐서 곱)

확률 벡터의 경우와 유사하게, quantum state vectors (양자 상태 벡터)의 tensor products (텐서 곱)도 quantum state vectors (양자 상태 벡터)이며, 다시 시스템 간의 independence (독립성)을 나타냅니다.

더 자세히 말하면, 두 시스템의 경우를 시작으로, $|\phi\rangle$가 시스템 $X$의 quantum state vector (양자 상태 벡터)이고 $|\psi\rangle$가 시스템 $Y$의 quantum state vector (양자 상태 벡터)라고 가정합니다. Tensor product (텐서 곱) $|\phi\rangle \otimes |\psi\rangle$는 대안적으로 $|\phi\rangle |\psi\rangle$ 또는 $|\phi \otimes \psi\rangle$로 쓸 수 있으며, 이것은 joint system (결합 시스템) $(X,Y)$의 quantum state vector (양자 상태 벡터)입니다. 다시 우리는 이러한 형태의 상태를 product state (곱 상태)라고 부릅니다.

직관적으로 말하면, 시스템 쌍 $(X,Y)$가 product state (곱 상태) $|\phi\rangle \otimes |\psi\rangle$에 있을 때, 이것을 $X$가 quantum state (양자 상태) $|\phi\rangle$에 있고, $Y$가 quantum state (양자 상태) $|\psi\rangle$에 있으며, 두 시스템의 상태가 서로 관련이 없다는 의미로 해석할 수 있습니다.

### Entangled states (얽힌 상태)

모든 여러 시스템의 quantum state vectors (양자 상태 벡터)가 product states (곱 상태)인 것은 아닙니다. 예를 들어, 두 qubit의 다음 quantum state vector (양자 상태 벡터)는 product state (곱 상태)가 아닙니다:

$$
\frac{1}{\sqrt{2}}|00\rangle + \frac{1}{\sqrt{2}}|11\rangle
$$

이 quantum state vector (양자 상태 벡터)는 두 시스템 간의 correlation (상관관계)을 나타내며, 특히 시스템이 entangled (얽혀있다)고 말합니다.

::: tip 용어 설명: Entanglement (얽힘)
- **의미**: Entanglement (얽힘)는 양자 정보의 핵심적인 특징으로, 두 시스템이 독립적으로 설명될 수 없는 상관관계를 가질 때 발생합니다.
- **발음**: "얽힘" 또는 "entanglement"
- **특징**: Entangled states (얽힌 상태)는 product state (곱 상태)로 분해될 수 없습니다.
- **중요성**: 양자 계산과 양자 통신의 많은 응용에서 핵심적인 역할을 합니다.
:::

### Bell states (벨 상태)

Bell states (벨 상태)는 두 qubit의 중요한 예시입니다. 이것들은 다음 네 가지 두 qubit 상태입니다:

$$
\begin{aligned}
|\phi^+\rangle & = \frac{1}{\sqrt{2}}|00\rangle + \frac{1}{\sqrt{2}}|11\rangle \\
|\phi^-\rangle & = \frac{1}{\sqrt{2}}|00\rangle - \frac{1}{\sqrt{2}}|11\rangle \\
|\psi^+\rangle & = \frac{1}{\sqrt{2}}|01\rangle + \frac{1}{\sqrt{2}}|10\rangle \\
|\psi^-\rangle & = \frac{1}{\sqrt{2}}|01\rangle - \frac{1}{\sqrt{2}}|10\rangle
\end{aligned}
$$

::: tip 기호 설명: $|\phi^+\rangle$, $|\phi^-\rangle$, $|\psi^+\rangle$, $|\psi^-\rangle$ (벨 상태)
- **의미**: Bell states (벨 상태)로, 두 qubit의 얽힌 상태의 표준 예시입니다
- **발음**: "파이 플러스 켓", "파이 마이너스 켓", "파이 플러스 켓", "파이 마이너스 켓"
- **특징**: 
  - $|\phi^+\rangle$와 $|\phi^-\rangle$: $|00\rangle$와 $|11\rangle$의 중첩
  - $|\psi^+\rangle$와 $|\psi^-\rangle$: $|01\rangle$와 $|10\rangle$의 중첩
- **중요성**: 양자 정보 이론에서 가장 중요한 얽힌 상태 중 하나입니다.
:::

Bell states (벨 상태)는 John Bell을 기리기 위해 명명되었습니다. 네 가지 Bell states (벨 상태) 모두 두 qubit 간의 entanglement (얽힘)을 나타냅니다.

네 가지 Bell states (벨 상태)의 모음

$$
\bigl\{|\phi^+\rangle, |\phi^-\rangle, |\psi^+\rangle, |\psi^-\rangle\bigr\}
$$

는 Bell basis (벨 기저)로 알려져 있습니다. 이름에 걸맞게, 이것은 기저입니다. 두 qubit의 모든 quantum state vector (양자 상태 벡터), 또는 실제로 두 비트의 네 가지 classical states (고전 상태)에 해당하는 항목을 가진 모든 복소 벡터는 네 가지 Bell states (벨 상태)의 선형 결합으로 표현될 수 있습니다.

### GHZ와 W 상태

세 qubit의 흥미로운 두 예시를 살펴보겠습니다. 첫 번째 예시는 GHZ state (GHZ 상태)입니다 (Daniel Greenberger, Michael Horne, Anton Zeilinger를 기리기 위해 명명됨):

$$
\frac{1}{\sqrt{2}}|000\rangle + \frac{1}{\sqrt{2}}|111\rangle
$$

두 번째 예시는 W state (W 상태)라고 불립니다:

$$
\frac{1}{\sqrt{3}}|001\rangle + \frac{1}{\sqrt{3}}|010\rangle + \frac{1}{\sqrt{3}}|100\rangle
$$

이 두 상태 모두 product state (곱 상태)가 아닙니다. 즉, 세 qubit quantum state vectors (양자 상태 벡터)의 tensor product (텐서 곱)로 쓸 수 없습니다.

## Measurements of quantum states (양자 상태의 측정)

여러 시스템의 quantum state (양자 상태)를 측정할 때, 모든 시스템을 측정하거나 일부만 측정할 수 있습니다.

### Partial measurements (부분 측정)

일부 시스템만 측정하는 경우를 partial measurement (부분 측정)라고 합니다. 두 시스템 $X$와 $Y$가 있고 $X$만 측정한다고 가정합니다.

일반적으로, $(X,Y)$의 quantum state vector (양자 상태 벡터)는 다음 형태를 가집니다:

$$
|\psi\rangle = \sum_{(a,b)\in\Sigma\times\Gamma} \alpha_{ab} |ab\rangle
$$

여기서 $\{\alpha_{ab} : (a,b)\in\Sigma\times\Gamma\}$는 다음을 만족하는 복소수 모음입니다:

$$
\sum_{(a,b)\in\Sigma\times\Gamma} |\alpha_{ab}|^2 = 1
$$

::: tip 수식 읽기: $\sum_{(a,b)\in\Sigma\times\Gamma} |\alpha_{ab}|^2 = 1$
- **읽는 방법**: "시그마 곱하기 감마에 속하는 모든 (a,b)에 대해 알파 ab의 절댓값 제곱의 합은 1과 같다"
- **의미**: 정규화 조건으로, 양자 상태 벡터의 유클리드 노름이 1이어야 함을 나타냅니다.
- **확률 해석**: 각 $|\alpha_{ab}|^2$는 상태 $(a,b)$를 측정할 확률을 나타냅니다.
:::

$X$만 측정하면, 각 결과 $a \in \Sigma$가 나타날 확률은 다음과 같습니다:

$$
\sum_{b\in\Gamma} |\langle ab | \psi \rangle|^2 = \sum_{b\in\Gamma} |\alpha_{ab}|^2
$$

$X$의 standard basis measurement (표준 기저 측정)가 결과 $a$를 제공하면, 쌍 $(X,Y)$의 quantum state (양자 상태)는 다음과 같이 됩니다:

$$
|a\rangle \otimes \frac{|\phi_a\rangle}{\||\phi_a\rangle\|}
$$

여기서

$$
|\phi_a\rangle = \sum_{b\in\Gamma} \alpha_{ab} |b\rangle
$$

입니다.

::: tip 수식 읽기: $\sum_{b\in\Gamma} |\alpha_{ab}|^2$
- **읽는 방법**: "감마에 속하는 모든 b에 대해 알파 ab의 절댓값 제곱의 합"
- **의미**: 시스템 $X$가 상태 $a$에 있을 확률입니다.
- **조건부 확률**: $Y$의 상태에 관계없이 $X$가 $a$일 전체 확률을 나타냅니다.
:::

::: tip 수식 읽기: $|a\rangle \otimes \frac{|\phi_a\rangle}{\||\phi_a\rangle\|}$
- **읽는 방법**: "a 켓 텐서 곱하기 파이 a 켓 나누기 파이 a 켓의 노름"
- **의미**: 측정 후 상태는 측정된 시스템이 확정된 상태 $|a\rangle$에 있고, 측정되지 않은 시스템은 정규화된 상태 $\frac{|\phi_a\rangle}{\||\phi_a\rangle\|}$에 있습니다.
- **정규화**: 분모의 노름은 벡터를 유효한 양자 상태 벡터(노름 1)로 만듭니다.
:::

## Unitary operations (유니터리 연산)

여러 시스템에 대한 unitary operations (유니터리 연산)는 단일 시스템의 경우와 유사하게 작동합니다. Compound system (복합 시스템)의 classical state set (고전 상태 집합)이 개별 시스템의 classical state sets (고전 상태 집합)의 Cartesian product (카르테시안 곱)이기 때문에, 이러한 시스템에 대한 quantum operations (양자 연산)는 행과 열이 집합 $\Sigma\times\Gamma$와 대응 관계에 있는 unitary matrices (유니터리 행렬)로 표현됩니다.

### Independent operations (독립 연산)

여러 시스템에 대해 개별적으로 독립적으로 unitary operations (유니터리 연산)를 수행할 때, 이러한 독립 연산의 결합된 동작은 이들을 나타내는 unitary matrices (유니터리 행렬)의 tensor product (텐서 곱)로 설명됩니다.

즉, $X_0,\ldots,X_{n-1}$이 quantum systems (양자 시스템)이고, $U_0,\ldots, U_{n-1}$이 이러한 시스템에 대한 연산을 나타내는 unitary matrices (유니터리 행렬)이며, 연산이 시스템에 대해 독립적으로 수행되면, $(X_{n-1},\ldots,X_0)$에 대한 결합된 동작은 행렬 $U_{n-1}\otimes\cdots\otimes U_0$로 표현됩니다.

중요한 상황은 하나의 시스템에만 unitary operation (유니터리 연산)을 적용하고 다른 시스템에는 아무것도 하지 않는 경우입니다. 예를 들어, $X$에만 연산 $U$를 적용하고 $Y$에는 아무것도 하지 않으면, $(X,Y)$에 대한 결과 연산은 unitary matrix (유니터리 행렬)로 표현됩니다:

$$
U \otimes \mathbb{I}_Y
$$

여기서 $\mathbb{I}_Y$는 $Y$에 대한 identity operation (항등 연산)을 나타내는 identity matrix (단위 행렬)입니다.

::: tip 기호 설명: $\mathbb{I}$ (단위 행렬)
- **의미**: Identity matrix (단위 행렬) 또는 identity operation (항등 연산)을 나타내는 기호
- **발음**: "아이" 또는 "identity matrix"
- **사용**: $\mathbb{I}_Y$는 시스템 $Y$에 대한 항등 연산을 나타냅니다. 어떤 상태도 변경하지 않는 연산입니다.
- **특징**: 모든 대각선 항목이 1이고 나머지는 0인 행렬입니다.
:::

### SWAP operation (SWAP 연산)

$X$와 $Y$가 같은 classical state set (고전 상태 집합) $\Sigma$를 공유하는 시스템이라고 가정합니다. $(X,Y)$ 쌍에 대한 SWAP operation (SWAP 연산)은 두 시스템의 내용을 교환하지만 그 외에는 시스템을 그대로 두는 연산입니다.

모든 classical states (고전 상태) $a,b\in\Sigma$에 대해 다음과 같이 작동합니다:

$$
\operatorname{SWAP} |a\rangle |b\rangle = |b\rangle |a\rangle
$$

::: tip 수식 읽기: $\operatorname{SWAP} |a\rangle |b\rangle = |b\rangle |a\rangle$
- **읽는 방법**: "SWAP 연산을 a 켓 b 켓에 적용하면 b 켓 a 켓과 같다"
- **의미**: SWAP 연산은 두 시스템의 상태를 서로 바꿉니다.
- **특징**: SWAP 연산은 유니터리이며, 두 번 적용하면 원래 상태로 돌아갑니다 (SWAP² = I).
:::

예를 들어, $X$와 $Y$가 qubit일 때:

$$
\mathrm{SWAP}=\left(\begin{array}{cccc}
1 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 0 & 1
\end{array}\right)
$$

### Controlled operations (제어 연산)

$X$가 qubit이고 $Y$가 임의의 시스템이라고 가정합니다. $Y$에 대한 모든 unitary operation (유니터리 연산) $U$에 대해, controlled-$U$ operation (제어-$U$ 연산)은 쌍 $(X, Y)$에 대한 unitary operation (유니터리 연산)으로 다음과 같이 정의됩니다:

$$
|0\rangle\langle 0| \otimes \mathbb{I}_{Y}+|1\rangle\langle 1| \otimes U=\left(\begin{array}{cc}
\mathbb{I}_{Y} & 0 \\
0 & U
\end{array}\right)
$$

::: tip 수식 읽기: $|0\rangle\langle 0| \otimes \mathbb{I}_{Y}+|1\rangle\langle 1| \otimes U$
- **읽는 방법**: "0 켓 0 브라 텐서 곱하기 아이 Y 더하기 1 켓 1 브라 텐서 곱하기 U"
- **의미**: Controlled operation (제어 연산)의 정의입니다.
  - 제어 qubit이 $|0\rangle$이면 $Y$에 항등 연산을 적용
  - 제어 qubit이 $|1\rangle$이면 $Y$에 $U$ 연산을 적용
- **행렬 표현**: 블록 대각 행렬 형태로 표현됩니다.
:::

#### Controlled-NOT (제어-NOT)

첫 번째 qubit이 control (제어)인 controlled-NOT operation (제어-NOT 연산):

$$
|0\rangle\langle 0| \otimes \mathbb{1}+|1\rangle\langle 1| \otimes \sigma_{x}=\left(\begin{array}{cccc}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 0 & 1 \\
0 & 0 & 1 & 0
\end{array}\right)
$$

::: tip 기호 설명: $\sigma_x$ (Pauli-X)
- **의미**: Pauli-X 연산 또는 NOT 연산을 나타내는 기호
- **발음**: "시그마 엑스" 또는 "Pauli X"
- **사용**: $\sigma_x = X$로, 비트 플립 연산을 나타냅니다.
- **행렬**: $\sigma_x = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$
:::

두 번째 qubit이 control (제어)인 경우:

$$
\mathbb{1} \otimes|0\rangle\langle 0|+\sigma_{\mathrm{x}} \otimes|1\rangle\langle 1|=\left(\begin{array}{cccc}
1 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 \\
0 & 0 & 1 & 0 \\
0 & 1 & 0 & 0
\end{array}\right)
$$

#### Controlled-Z (제어-Z)

Controlled-$\sigma_{z}$ (또는 controlled-Z) operation (제어-Z 연산):

$$
|0\rangle\langle 0| \otimes \mathbb{1}+|1\rangle\langle 1| \otimes \sigma_{z}=\left(\begin{array}{cccc}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & -1
\end{array}\right)
$$

두 번째 qubit이 control (제어)인 경우:

$$
\mathbb{1} \otimes|0\rangle\langle 0|+\sigma_{z} \otimes|1\rangle\langle 1|=\left(\begin{array}{cccc}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & -1
\end{array}\right)
$$

::: tip 기호 설명: $\sigma_z$ (Pauli-Z)
- **의미**: Pauli-Z 연산 또는 phase flip (위상 플립) 연산을 나타내는 기호
- **발음**: "시그마 지" 또는 "Pauli Z"
- **사용**: $\sigma_z = Z$로, 위상 플립 연산을 나타냅니다.
- **행렬**: $\sigma_z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$
- **동작**: $Z|0\rangle = |0\rangle$, $Z|1\rangle = -|1\rangle$
:::

### Controlled-SWAP (제어-SWAP)

세 qubit에 대한 controlled-SWAP operation (제어-SWAP 연산):

$$
|0\rangle\langle 0| \otimes \mathbb{1}+|1\rangle\langle 1| \otimes \mathrm{SWAP}=\left(\begin{array}{cccccccc}
1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 1 & 0 \\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1
\end{array}\right)
$$

이 연산은 Fredkin operation (또는 Fredkin gate)로도 알려져 있습니다.

::: tip 용어 설명: Fredkin gate (프레드킨 게이트)
- **의미**: Controlled-SWAP 연산으로, 세 qubit에 대한 유니터리 연산
- **발음**: "프레드킨 게이트" 또는 "Fredkin gate"
- **특징**: 
  - 제어 qubit이 $|0\rangle$이면 두 대상 qubit을 그대로 둠
  - 제어 qubit이 $|1\rangle$이면 두 대상 qubit을 교환
- **중요성**: 양자 계산에서 가역적 계산을 구현하는 데 사용됩니다.
:::

### Toffoli operation (토폴리 연산)

세 qubit에 대한 controlled-controlled-NOT operation (제어-제어-NOT 연산):

$$
\begin{aligned}
& |0\rangle\langle 0| \otimes \mathbb{1} \otimes \mathbb{1}+|1\rangle\langle 1| \otimes(|0\rangle\langle 0| \otimes \mathbb{1}+|1\rangle\langle 1| \otimes \sigma_{x}) \\
& =\left(\begin{array}{cccccccc}
1 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 1 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\
0 & 0 & 0 & 0 & 0 & 0 & 1 & 0
\end{array}\right)
\end{aligned}
$$

이 연산은 Toffoli operation (또는 Toffoli gate)로 더 잘 알려져 있습니다.

### SWAP 연산의 동작

SWAP 연산은 Bell states (벨 상태)에 대해 다음과 같이 작동합니다:

$$
\begin{aligned}
\operatorname{SWAP}|\phi^{+}\rangle &= |\phi^{+}\rangle \\
\operatorname{SWAP}|\phi^{-}\rangle &= |\phi^{-}\rangle \\
\operatorname{SWAP}|\psi^{+}\rangle &= |\psi^{+}\rangle \\
\operatorname{SWAP}|\psi^{-}\rangle &= -|\psi^{-}\rangle
\end{aligned}
$$

여기서

$$
\begin{aligned}
|\phi^{+}\rangle & = \frac{1}{\sqrt{2}}|00\rangle+\frac{1}{\sqrt{2}}|11\rangle \\
|\phi^{-}\rangle & = \frac{1}{\sqrt{2}}|00\rangle-\frac{1}{\sqrt{2}}|11\rangle \\
|\psi^{+}\rangle & = \frac{1}{\sqrt{2}}|01\rangle+\frac{1}{\sqrt{2}}|10\rangle \\
|\psi^{-}\rangle & = \frac{1}{\sqrt{2}}|01\rangle-\frac{1}{\sqrt{2}}|10\rangle
\end{aligned}
$$

입니다.

::: tip 수식 읽기: $\operatorname{SWAP}|\psi^{-}\rangle = -|\psi^{-}\rangle$
- **읽는 방법**: "SWAP 연산을 파이 마이너스 켓에 적용하면 마이너스 파이 마이너스 켓과 같다"
- **의미**: SWAP 연산은 $|\psi^{-}\rangle$ 상태에 대해 위상만 변경합니다 (global phase).
- **참고**: Global phase는 측정 결과에 영향을 주지 않으므로, 물리적으로는 동일한 상태로 간주됩니다.
:::

::: tip 용어 설명: Toffoli gate (토폴리 게이트)
- **의미**: Controlled-controlled-NOT (CCNOT) 연산으로, 세 qubit에 대한 유니터리 연산
- **발음**: "토폴리 게이트" 또는 "Toffoli gate"
- **특징**: 
  - 두 개의 제어 qubit이 모두 $|1\rangle$일 때만 세 번째 qubit에 NOT 연산을 적용
  - 고전적으로는 가역적 AND 게이트로 작동
- **중요성**: 양자 계산에서 범용 양자 게이트 집합의 일부입니다.
:::

::: details Classical information에 대한 추가 설명

### Tensor products of matrices (행렬의 텐서 곱)

두 행렬

$$
M = \sum_{a,b\in\Sigma} \alpha_{ab} |a\rangle \langle b|
$$

와

$$
N = \sum_{c,d\in\Gamma} \beta_{cd} |c\rangle \langle d|
$$

의 tensor product (텐서 곱) $M\otimes N$는 다음 행렬입니다:

$$
M \otimes N = \sum_{a,b\in\Sigma} \sum_{c,d\in\Gamma} \alpha_{ab} \beta_{cd} |ac \rangle \langle bd |
$$

동등하게, $M$과 $N$의 tensor product (텐서 곱)는 다음 방정식으로 정의됩니다:

$$
\langle ac | M \otimes N | bd\rangle = \langle a | M | b\rangle \langle c | N | d\rangle
$$

모든 $a,b\in\Sigma$와 $c,d\in\Gamma$에 대해 성립합니다.

행렬의 tensor product (텐서 곱)는 때때로 multiplicative (곱셈적)이라고 불립니다. 왜냐하면 방정식

$$
(M_{n-1}\otimes\cdots\otimes M_0)(N_{n-1}\otimes\cdots\otimes N_0) = (M_{n-1} N_{n-1})\otimes\cdots\otimes (M_0 N_0)
$$

가 항상 참이기 때문입니다.

### Independent operations (독립 연산)

$M$이 $X$에 대한 probabilistic operation (확률적 연산)이고, $N$이 $Y$에 대한 probabilistic operation (확률적 연산)이며, 두 연산이 독립적으로 수행되면, compound system (복합 시스템) $(X,Y)$에 대한 결과 연산은 tensor product (텐서 곱) $M\otimes N$입니다.

따라서 probabilistic states (확률적 상태)와 probabilistic operations (확률적 연산) 모두에 대해, tensor products (텐서 곱)는 independence (독립성)을 나타냅니다.

### Controlled-NOT operation (제어-NOT 연산) - 고전 정보

고전 정보의 맥락에서, controlled-NOT operation (제어-NOT 연산)은 다음과 같이 설명됩니다:

- $X = 1$이면 $Y$에 NOT 연산을 수행합니다.
- 그렇지 않으면 아무것도 하지 않습니다.

이것은 $X$가 control bit (제어 비트)이고 $Y$가 target bit (대상 비트)인 deterministic operation (결정론적 연산)입니다. 이 연산의 행렬 표현은 다음과 같습니다:

$$
\begin{pmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 0 & 1 \\
0 & 0 & 1 & 0
\end{pmatrix}
$$

표준 기저 상태에 대한 동작은 다음과 같습니다:

$$
\begin{aligned}
|00\rangle & \mapsto |00\rangle \\
|01\rangle & \mapsto |01\rangle \\
|10\rangle & \mapsto |11\rangle \\
|11\rangle & \mapsto |10\rangle
\end{aligned}
$$

:::

::: details 양자 상태에 대한 추가 설명

### Quantum state vectors의 다양한 표현

여러 시스템의 quantum state vectors (양자 상태 벡터)를 표현하는 방법에는 여러 변형이 있으며, 선호도에 따라 선택할 수 있습니다.

예를 들어, 다음 quantum state vector (양자 상태 벡터)에 대해:

$$
\frac{1}{\sqrt{2}}|00\rangle - \frac{1}{\sqrt{6}}|01\rangle + \frac{i}{\sqrt{6}}|10\rangle + \frac{1}{\sqrt{6}}|11\rangle
$$

다음과 같이 표현할 수 있습니다:

1. $|ab\rangle = |a\rangle |b\rangle$ 사실을 사용하여:
   $$
   \frac{1}{\sqrt{2}}|0\rangle|0\rangle - \frac{1}{\sqrt{6}}|0\rangle|1\rangle + \frac{i}{\sqrt{6}}|1\rangle|0\rangle + \frac{1}{\sqrt{6}}|1\rangle|1\rangle
   $$

2. Tensor product (텐서 곱) 기호를 명시적으로 사용:
   $$
   \frac{1}{\sqrt{2}}|0\rangle\otimes|0\rangle - \frac{1}{\sqrt{6}}|0\rangle\otimes|1\rangle + \frac{i}{\sqrt{6}}|1\rangle\otimes|0\rangle + \frac{1}{\sqrt{6}}|1\rangle\otimes|1\rangle
   $$

3. 시스템에 대한 대응을 나타내기 위해 ket에 아래첨자를 사용:
   $$
   \frac{1}{\sqrt{2}}|0\rangle_X|0\rangle_Y - \frac{1}{\sqrt{6}}|0\rangle_X|1\rangle_Y + \frac{i}{\sqrt{6}}|1\rangle_X|0\rangle_Y + \frac{1}{\sqrt{6}}|1\rangle_X|1\rangle_Y
   $$

물론, quantum state vectors (양자 상태 벡터)를 명시적으로 열 벡터로 쓸 수도 있습니다.

### Product state의 예시

다음 quantum state vector (양자 상태 벡터)는 product state (곱 상태)의 예시입니다:

$$
\frac{1}{2}|00\rangle + \frac{i}{2}|01\rangle - \frac{1}{2}|10\rangle - \frac{i}{2}|11\rangle = \left(\frac{1}{\sqrt{2}}|0\rangle - \frac{1}{\sqrt{2}}|1\rangle\right) \otimes \left(\frac{1}{\sqrt{2}}|0\rangle + \frac{i}{\sqrt{2}}|1\rangle\right)
$$

따라서 이 상태는 entangled (얽혀있지) 않습니다.

### Euclidean norm의 곱셈성

Tensor product (텐서 곱) 벡터 $|\phi\rangle \otimes |\psi\rangle$가 실제로 quantum state vector (양자 상태 벡터)라는 사실은 Euclidean norm (유클리드 노름)이 tensor products (텐서 곱)에 대해 multiplicative (곱셈적)이라는 것과 일치합니다:

$$
\bigl\| |\phi\rangle \otimes |\psi\rangle \bigr\| = \bigl\| |\phi\rangle \bigr\| \bigl\| |\psi\rangle \bigr\|
$$

$|\phi\rangle$와 $|\psi\rangle$가 quantum state vectors (양자 상태 벡터)이므로, $\||\phi\rangle\| = 1$이고 $\||\psi\rangle\| = 1$이며, 따라서 $\||\phi\rangle \otimes |\psi\rangle\| = 1$이므로 $|\phi\rangle \otimes |\psi\rangle$도 quantum state vector (양자 상태 벡터)입니다.

### Partial measurement의 예시

GHZ state (GHZ 상태)를 고려해봅시다:

$$
\frac{1}{\sqrt{2}}|000\rangle + \frac{1}{\sqrt{2}}|111\rangle
$$

첫 번째 시스템만 측정하면, 결과 $0$을 확률 $1/2$로 얻으며, 이 경우 세 qubit의 상태는 $|000\rangle$가 됩니다. 또한 결과 $1$을 확률 $1/2$로 얻으며, 이 경우 세 qubit의 상태는 $|111\rangle$가 됩니다.

W state (W 상태)의 경우:

$$
\frac{1}{\sqrt{3}}|001\rangle + \frac{1}{\sqrt{3}}|010\rangle + \frac{1}{\sqrt{3}}|100\rangle
$$

첫 번째 qubit만 측정하면, 결과 $0$을 얻을 확률은 $2/3$이며, 이 경우 세 qubit의 상태는 $|0\rangle|\psi^+\rangle$가 됩니다. 결과 $1$을 얻을 확률은 $1/3$이며, 이 경우 상태는 $|100\rangle$가 됩니다.

:::

::: details Qiskit을 사용한 구현 예제

이전 강의에서 Qiskit의 `Statevector`와 `Operator` 클래스를 처음 살펴보고, 단일 qubit에 대한 연산과 측정을 시뮬레이션하는 데 사용했습니다. 이 섹션에서는 이러한 클래스를 사용하여 여러 qubit의 동작을 탐구합니다.

### Tensor products (텐서 곱)

`Statevector` 클래스는 `tensor` 메서드를 가지며, 이는 인수로 주어진 다른 `Statevector`와의 tensor product (텐서 곱)를 반환합니다. 인수는 오른쪽의 tensor factor (텐서 인수)로 해석됩니다.

예를 들어, 아래에서 $|0\rangle$와 $|1\rangle$를 나타내는 두 상태 벡터를 만들고, `tensor` 메서드를 사용하여 새로운 벡터 $|\psi\rangle = |0\rangle \otimes |1\rangle$를 만듭니다:

```python
from qiskit.quantum_info import Statevector, Operator
from numpy import sqrt

zero = Statevector.from_label("0")
one = Statevector.from_label("1")
psi = zero.tensor(one)
display(psi.draw("latex"))
# 출력: |01⟩
```

허용되는 다른 레이블에는 plus와 minus 상태에 대한 "+"와 "-", 그리고 다음 상태에 대한 "r"과 "l" (각각 "right"와 "left"의 약자)이 포함됩니다:

$$
|{+i}\rangle = \frac{1}{\sqrt{2}}|0\rangle + \frac{i}{\sqrt{2}}|1\rangle \quad \text{그리고} \quad |{-i}\rangle = \frac{1}{\sqrt{2}}|0\rangle - \frac{i}{\sqrt{2}}|1\rangle
$$

다음은 $|+\rangle$와 $|{-i}\rangle$의 tensor product (텐서 곱) 예시입니다:

```python
plus = Statevector.from_label("+")
minus_i = Statevector.from_label("l")
phi = plus.tensor(minus_i)
display(phi.draw("latex"))
# 출력: \frac{1}{2} |00\rangle- \frac{i}{2} |01\rangle+\frac{1}{2} |10\rangle- \frac{i}{2} |11\rangle
```

대안으로 텐서 곱에 대해 `^` 연산을 사용할 수 있으며, 자연스럽게 동일한 결과를 제공합니다:

```python
display((plus ^ minus_i).draw("latex"))
```

`Operator` 클래스도 `tensor` 메서드(그리고 `from_label` 메서드)를 가집니다:

```python
H = Operator.from_label("H")
Id = Operator.from_label("I")
X = Operator.from_label("X")
display(H.tensor(Id).draw("latex"))
display((H ^ Id ^ X).draw("latex"))
```

### Compound states의 진화

Compound states (복합 상태)는 예상대로 compound operations (복합 연산)을 사용하여 진화시킬 수 있습니다. 예를 들어, 다음 코드는 $|\phi\rangle = |+\rangle \otimes |{-i}\rangle$에 대해 $(H\otimes I)|\phi\rangle$ 상태를 계산합니다:

```python
display(phi.evolve(H ^ Id).draw("latex"))
```

다음 코드는 $CX$ 연산을 정의하고 $|\psi\rangle = |+\rangle \otimes |0\rangle$에 대해 $CX|\psi\rangle$를 계산합니다. 이것은 왼쪽 qubit이 control (제어)이고 오른쪽 qubit이 target (대상)인 $CX$ 연산입니다. 결과는 Bell state (벨 상태) $|\phi^{+}\rangle$입니다:

```python
CX = Operator([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])
psi = plus.tensor(zero)
display(psi.evolve(CX).draw("latex"))
# 출력: \frac{\sqrt{2}}{2} |00\rangle+\frac{\sqrt{2}}{2} |11\rangle
```

### Partial measurements (부분 측정)

이전 강의에서 `measure` 메서드를 사용하여 quantum state vector (양자 상태 벡터)의 측정을 시뮬레이션했습니다. 이 메서드는 두 항목을 반환합니다: 시뮬레이션된 측정 결과와 이 측정이 주어진 새로운 `Statevector`입니다.

기본적으로 `measure`는 상태 벡터의 모든 qubit을 측정합니다. 대안으로, 정수 리스트를 인수로 제공할 수 있으며, 이는 해당 qubit 인덱스만 측정하도록 합니다.

다음 코드는 상태

$$
|w\rangle = \frac{|001\rangle + |010\rangle + |100\rangle}{\sqrt{3}}
$$

를 만들고 qubit 번호 0(가장 오른쪽 qubit)을 측정합니다:

```python
w = Statevector([0, 1, 1, 0, 1, 0, 0, 0] / sqrt(3))
display(w.draw("latex"))
# 출력: \frac{\sqrt{3}}{3} |001\rangle+\frac{\sqrt{3}}{3} |010\rangle+\frac{\sqrt{3}}{3} |100\rangle

result, state = w.measure([0])
print(f"Measured: {result}\nState after measurement:")
display(state.draw("latex"))
# 측정 결과에 따라 다른 상태가 반환됩니다

result, state = w.measure([0, 1])
print(f"Measured: {result}\nState after measurement:")
display(state.draw("latex"))
# 두 qubit을 측정하면 더 확정적인 상태가 됩니다
```

### Bell state 생성

Controlled-NOT 연산을 사용하여 Bell state (벨 상태)를 생성할 수 있습니다:

```python
from qiskit.quantum_info import Statevector, Operator
from numpy import sqrt

# |+⟩ 상태 생성
plus = Statevector.from_label("+")
# |0⟩ 상태 생성
zero = Statevector.from_label("0")

# |+⟩ ⊗ |0⟩ 상태
psi = plus.tensor(zero)

# Controlled-NOT 연산 정의 (첫 번째 qubit이 제어)
CX = Operator([[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]])

# Bell state 생성
bell_state = psi.evolve(CX)
display(bell_state.draw("latex"))
# 출력: \frac{\sqrt{2}}{2} |00\rangle+\frac{\sqrt{2}}{2} |11\rangle
# 이것은 |φ⁺⟩ Bell state입니다
```

### 여러 연산의 합성

여러 연산을 순차적으로 적용할 수 있습니다:

```python
# Hadamard를 첫 번째 qubit에, 항등 연산을 두 번째 qubit에 적용
H_Id = H.tensor(Id)
result = phi.evolve(H_Id)
display(result.draw("latex"))
```

:::

## 요약

1. **Classical states of multiple systems (여러 시스템의 고전 상태)**: Cartesian product (카르테시안 곱)를 통해 정의
2. **Probabilistic states (확률적 상태)**: 여러 시스템의 확률적 상태와 independence (독립성) 개념
3. **Tensor products (텐서 곱)**: 벡터와 행렬의 텐서 곱, 독립성을 나타냄
4. **Quantum states of multiple systems (여러 시스템의 양자 상태)**: 복소수 계수를 가진 벡터로 표현
5. **Product states and entanglement (곱 상태와 얽힘)**: 
   - Product states (곱 상태): 텐서 곱으로 표현 가능한 상태
   - Entangled states (얽힌 상태): 곱 상태가 아닌 상태
6. **Bell states (벨 상태)**: 두 qubit의 중요한 얽힌 상태 예시
7. **GHZ and W states**: 세 qubit의 얽힌 상태 예시
8. **Partial measurements (부분 측정)**: 일부 시스템만 측정하는 방법
9. **Unitary operations on multiple systems (여러 시스템에 대한 유니터리 연산)**:
   - Independent operations (독립 연산): 텐서 곱으로 표현
   - SWAP operation (SWAP 연산)
   - Controlled operations (제어 연산): Controlled-NOT, Controlled-Z 등
   - Toffoli operation (토폴리 연산)

이러한 개념들은 양자 알고리즘과 양자 통신을 이해하는 데 필수적입니다.
