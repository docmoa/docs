---

description: 이 글은 양자 정보와 계산에 대한 내용으로, 단일 양자 시스템에 대해 다룹니다.
tag: ["quantum", "information", "computation"]

---

# Lesson 1: 단일 시스템 - 양자 정보와 계산 이해하기

## 양자 정보의 설명

양자 정보를 설명하는 방법에는 두 가지가 있습니다:

### 단순화된 설명 (이 단원에서 다룸)

- 더 단순하고 일반적으로 먼저 배우는 방법
- 양자 상태는 벡터로 표현되고, 연산은 유니터리 행렬로 표현됨
- 대부분의 양자 알고리즘을 이해하는 데 충분함

### 일반적인 설명 (나중 단원에서 다룸)

- 더 일반적이고 넓게 적용 가능한 방법
- 양자 상태는 density matrices (밀도 행렬)로 표현됨
- 더 일반적인 측정과 연산 클래스를 허용함
- 단순화된 설명과 고전 정보(확률적 상태 포함)를 특수한 경우로 포함함

## 고전 정보

정보를 저장하는 물리적 시스템을 $X$라고 하겠습니다. $X$는 각 순간에 유한한 수의 classical state (고전 상태) 중 하나에 있을 수 있다고 가정합니다. 이 classical state set (고전 상태 집합)을 $\Sigma$로 표기합니다.

::: tip 기호 설명: $\Sigma$ (시그마)
- **의미**: 고전 상태 집합(classical state set)을 나타내는 기호
- **발음**: "시그마" (Sigma)
- **사용**: 그리스 대문자 시그마로, 집합을 나타낼 때 자주 사용됩니다.
:::

### 예시

- $X$가 비트(bit)라면, 고전 상태 집합은 $\Sigma=\{0,1\}$입니다.
- $X$가 여섯 면 주사위라면, $\Sigma=\{1,2,3,4,5,6\}$입니다.
- $X$가 표준 전기 선풍기의 스위치라면, 아마도 $\Sigma=\{$high, medium, low, off$\}$일 것입니다.

시스템의 고전 상태에 대해 불확실성이 있을 수 있으며, 각 고전 상태에는 일부 확률이 연관됩니다.

### Probabilistic state (확률적 상태)

예를 들어, $X$가 비트라면, 아마도 고전 상태 0에 있을 확률이 $3/4$이고 고전 상태 1에 있을 확률이 $1/4$일 수 있습니다. 이것은 $X$의 probabilistic state (확률적 상태)입니다.

$$
\operatorname{Pr}(X=0)=\frac{3}{4} \quad \text{그리고} \quad \operatorname{Pr}(X=1)=\frac{1}{4}
$$

::: tip 수식 읽기: $\operatorname{Pr}(X=0)=\frac{3}{4}$
- **읽는 방법**: "X가 0일 확률은 4분의 3과 같다" 또는 "Probability of X equals 0 is three-fourths"
- **의미**: 시스템 $X$가 고전 상태 0에 있을 확률이 $3/4$임을 나타냅니다.
- $\operatorname{Pr}$는 확률(Probability)을 나타내는 함수입니다.
:::

이 확률적 상태를 간결하게 표현하는 방법은 column vector (열 벡터)를 사용하는 것입니다.

$$
\left(\begin{array}{l}
\frac{3}{4} \\
\frac{1}{4}
\end{array}\right) \quad \longleftarrow \text{0에 해당하는 항목}
$$

이 벡터는 probability vector (확률 벡터)입니다.

- 모든 항목은 음이 아닌 실수입니다.
- 항목들의 합은 1입니다.

## Dirac notation (Dirac 표기법) (첫 번째 부분)

$\Sigma$를 임의의 고전 상태 집합이라고 하고, $\Sigma$의 원소들이 정수 $1, \ldots,|\Sigma|$와 대응 관계에 있다고 가정합니다.

::: tip 기호 설명: $\in$ (원소 기호)
- **의미**: "~의 원소이다" 또는 "~에 속한다"를 나타내는 집합론 기호
- **발음**: "~에 속한다" 또는 "element of"
- **사용**: $\alpha \in \Sigma$는 "$\alpha$가 집합 $\Sigma$의 원소이다"를 의미합니다.
:::

$\alpha \in \Sigma$에 대해, $\alpha$에 해당하는 항목에 1이 있고 다른 모든 항목에 0이 있는 열 벡터를 $|\alpha\rangle$로 표기합니다.

::: tip 기호 설명: $|\alpha\rangle$ (Ket 표기법)
- **의미**: Dirac 표기법의 "ket" 벡터로, 양자 상태를 나타냅니다
- **발음**: "알파 켓" 또는 "ket alpha"
- **사용**: 양자 역학에서 상태 벡터를 표현하는 표준 표기법입니다. $|\alpha\rangle$는 열 벡터를 나타냅니다.
- **관련 표기**: $\langle\alpha|$는 "bra"로, 행 벡터를 나타냅니다. $\langle\alpha|\beta\rangle$는 내적을 의미합니다.
:::

### 예시 1

$\Sigma=\{0,1\}$인 경우:

$$
|0\rangle=\binom{1}{0} \quad \text{그리고} \quad|1\rangle=\binom{0}{1}
$$

### 예시 2

$\Sigma=\{\clubsuit, \diamondsuit, \heartsuit, \spadesuit\}$인 경우, 다음과 같이 순서를 정할 수 있습니다: $\clubsuit, \diamondsuit, \heartsuit, \spadesuit$. 이것은 다음을 제공합니다:

$$
|\clubsuit\rangle=\left(\begin{array}{l}
1 \\
0 \\
0 \\
0
\end{array}\right) \quad|\diamondsuit\rangle=\left(\begin{array}{l}
0 \\
1 \\
0 \\
0
\end{array}\right) \quad|\heartsuit\rangle=\left(\begin{array}{l}
0 \\
0 \\
1 \\
0
\end{array}\right) \quad|\spadesuit\rangle=\left(\begin{array}{l}
0 \\
0 \\
0 \\
1
\end{array}\right)
$$

이러한 형태의 벡터를 standard basis vectors (표준 기저 벡터)라고 합니다. 모든 벡터는 표준 기저 벡터의 고유한 선형 결합으로 표현될 수 있습니다.

### 예시

$$
\left(\begin{array}{l}
\frac{3}{4} \\
\frac{1}{4}
\end{array}\right)=\frac{3}{4}|0\rangle+\frac{1}{4}|1\rangle
$$

## Probabilistic state (확률적 상태) 측정

시스템 $X$가 어떤 확률적 상태에 있을 때 측정하면 어떻게 될까요?

확률에 따라 무작위로 선택된 고전 상태를 보게 됩니다. 고전 상태 $a \in \Sigma$를 본다고 가정합니다.

이것은 $X$의 확률적 상태를 변경합니다(우리의 관점에서): $X$가 고전 상태 $a$에 있다는 것을 인식했으므로, 이제 다음을 가집니다:

$$
\operatorname{Pr}(X=a)=1
$$

이 확률적 상태는 벡터 $|a\rangle$로 표현됩니다.

### 예시

비트 $X$의 확률적 상태를 고려해봅시다:

$$
Pr(X = 0) = \frac{3}{4} \quad \text{그리고} \quad Pr(X = 1) = \frac{1}{4}
$$

$X$를 측정하면 확률에 따라 전환이 선택(또는 드러남)됩니다.

## Deterministic operations (결정론적 연산)

모든 함수 $f: \Sigma \rightarrow \Sigma$는 각 $a \in \Sigma$에 대해 고전 상태 $a$를 $f(a)$로 변환하는 deterministic operations (결정론적 연산)을 설명합니다.

임의의 함수 $f: \Sigma \rightarrow \Sigma$가 주어지면, 다음을 만족하는 (유일한) 행렬 $M$이 있습니다:

$$
M|a\rangle=|f(a)\rangle \quad \text{(모든 } a \in \Sigma \text{에 대해)}
$$

이 행렬은 각 열에 정확히 하나의 1이 있고 다른 모든 항목은 0입니다:

$$
M(b, a)= \begin{cases}1 & b=f(a) \\ 0 & b \neq f(a)\end{cases}
$$

이 연산의 동작은 행렬-벡터 곱셈으로 설명됩니다:

$$
v \longmapsto M v
$$

::: tip 기호 설명: $\longmapsto$ (매핑 화살표)
- **의미**: "~로 매핑된다" 또는 "~로 변환된다"를 나타내는 기호
- **발음**: "~로 매핑된다" 또는 "maps to"
- **사용**: $v \longmapsto M v$는 "벡터 $v$가 $M v$로 변환된다"를 의미합니다.
- **차이점**: $\rightarrow$는 함수 정의에, $\longmapsto$는 변환 과정을 나타낼 때 사용됩니다.
:::

### 예시

$\Sigma=\{0,1\}$에 대해, $f: \Sigma \rightarrow \Sigma$ 형태의 함수는 네 가지가 있습니다:

| $a$ | $f_{1}(a)$ | $a$ | $f_{2}(a)$ | $a$ | $f_{3}(a)$ | $a$ | $f_{4}(a)$ |
|-----|------------|-----|------------|-----|------------|-----|------------|
| 0   | 0          | 0   | 0          | 0   | 1          | 0   | 1          |
| 1   | 0          | 1   | 1          | 1   | 0          | 1   | 1          |

이 함수들은 각각 다음 행렬로 표현됩니다:

$$
M_{1}=\left(\begin{array}{ll}
1 & 1 \\
0 & 0
\end{array}\right) \quad M_{2}=\left(\begin{array}{ll}
1 & 0 \\
0 & 1
\end{array}\right) \quad M_{3}=\left(\begin{array}{ll}
0 & 1 \\
1 & 0
\end{array}\right) \quad M_{4}=\left(\begin{array}{ll}
0 & 0 \\
1 & 1
\end{array}\right)
$$

::: details Classical information에 대한 추가 설명

### Probabilistic operations (확률적 연산)과 Stochastic matrices (확률 행렬)

결정론적 연산 외에도 `probabilistic operations (확률적 연산)`이 있습니다. 예를 들어, 비트의 고전 상태가 $0$이면 그대로 두고, $1$이면 확률 $1/2$로 $0$이 되거나 확률 $1/2$로 $1$이 되도록 뒤집는 연산이 있습니다. 이 연산은 다음 행렬로 표현됩니다:

$$
\begin{pmatrix}
1 & \frac{1}{2} \\
0 & \frac{1}{2}
\end{pmatrix}
$$

임의의 고전 상태 집합에 대해, 모든 확률적 연산은 `stochastic matrices (확률 행렬)`로 수학적으로 설명할 수 있으며, 이는 다음 두 가지 성질을 만족하는 행렬입니다:

1. 모든 항목은 음이 아닌 실수입니다.
2. 모든 열의 항목들의 합은 $1$입니다.

즉, 확률 행렬은 모든 열이 확률 벡터를 형성하는 행렬입니다. 확률 행렬은 항상 확률 벡터를 확률 벡터로 매핑하는 행렬이며, 확률 벡터를 항상 확률 벡터로 매핑하는 행렬은 확률 행렬입니다.

### 확률적 연산의 합성

확률적 연산의 합성은 행렬 곱셈으로 표현됩니다. 예를 들어, 확률 벡터 $u$에 첫 번째 연산 $M_1$을 적용하면 $M_1 u$가 되고, 여기에 두 번째 연산 $M_2$를 적용하면 $M_2(M_1 u) = (M_2 M_1) u$가 됩니다.

따라서 $M_1$을 먼저 적용하고 $M_2$를 나중에 적용하는 합성 연산은 행렬 $M_2 M_1$로 표현되며, 이는 반드시 확률 행렬입니다.

:::

## Quantum state (양자 상태)

Quantum state (양자 상태)는 복소수 계수를 가진 벡터로 표현됩니다. 비트의 경우, 양자 상태는 다음과 같은 형태입니다:

$$
\alpha|0\rangle+\beta|1\rangle
$$

::: tip 기호 설명: $\alpha$, $\beta$ (알파, 베타)
- **의미**: 양자 상태의 복소수 계수(complex coefficients)
- **발음**: "알파" (alpha), "베타" (beta)
- **사용**: 양자 상태의 선형 결합에서 각 기저 상태의 계수를 나타냅니다.
:::

여기서 $\alpha$와 $\beta$는 복소수이며, 다음 조건을 만족합니다:

$$
|\alpha|^{2}+|\beta|^{2}=1
$$

::: tip 수식 읽기: $|\alpha|^{2}+|\beta|^{2}=1$
- **읽는 방법**: "알파의 절댓값 제곱 더하기 베타의 절댓값 제곱은 1과 같다" 또는 "absolute value of alpha squared plus absolute value of beta squared equals one"
- **의미**: 정규화 조건(normalization condition)으로, 양자 상태의 확률의 합이 1이 되어야 함을 나타냅니다.
- $|\alpha|^{2}$는 상태 $|0\rangle$를 측정할 확률, $|\beta|^{2}$는 상태 $|1\rangle$를 측정할 확률을 의미합니다.
:::

이 조건을 normalization condition (정규화 조건)이라고 합니다.

### 예시: Uniform superposition state (균등 중첩 상태)

$$
|+\rangle=\frac{1}{\sqrt{2}}|0\rangle+\frac{1}{\sqrt{2}}|1\rangle
$$

$$
|-\rangle=\frac{1}{\sqrt{2}}|0\rangle-\frac{1}{\sqrt{2}}|1\rangle
$$

::: tip 기호 설명: $|+\rangle$, $|-\rangle$ (플러스 켓, 마이너스 켓)
- **의미**: Hadamard basis (Hadamard 기저) 상태로, uniform superposition state (균등 중첩 상태)를 나타냅니다
- **발음**: "플러스 켓" (plus ket), "마이너스 켓" (minus ket)
- **사용**: 
  - $|+\rangle$: $|0\rangle$와 $|1\rangle$의 균등 중첩 (모든 계수가 양수)
  - $|-\rangle$: $|0\rangle$와 $|1\rangle$의 균등 중첩 (하나의 계수가 음수)
- **특징**: Hadamard 연산 $H$에 의해 $H|0\rangle=|+\rangle$, $H|1\rangle=|-\rangle$로 변환됩니다.
:::

## Qubit (양자 비트)

Qubit는 양자 정보의 기본 단위입니다. Qubit의 상태는 2차원 복소 벡터 공간의 단위 벡터로 표현됩니다.

### Qubit 측정

Qubit를 측정하면 고전 비트(0 또는 1)를 얻습니다. 상태 $\alpha|0\rangle+\beta|1\rangle$를 측정하면:

- 확률 $|\alpha|^{2}$로 결과 0을 얻습니다.
- 확률 $|\beta|^{2}$로 결과 1을 얻습니다.

측정 후, Qubit는 측정된 결과에 해당하는 상태로 붕괴됩니다.

::: details 양자 상태에 대한 추가 설명

### Euclidean norm (유클리드 노름)

열 벡터

$$
v = \begin{pmatrix}
\alpha_1 \\
\vdots \\
\alpha_n
\end{pmatrix}
$$

의 *Euclidean norm (유클리드 노름)*은 다음과 같이 정의됩니다:

$$
\| v \| = \sqrt{\sum_{k=1}^n |\alpha_k|^2}
$$

양자 상태 벡터의 절댓값 제곱의 합이 $1$이라는 조건은 따라서 그 벡터의 유클리드 노름이 $1$이라는 것과 동일합니다. 즉, 양자 상태 벡터는 유클리드 노름에 대한 *unit vectors (단위 벡터)*입니다.

### Qubit 상태의 예시

다음은 Qubit의 양자 상태 예시입니다:

$$
\begin{pmatrix}
1 \\
0
\end{pmatrix} = |0\rangle \quad \text{그리고} \quad
\begin{pmatrix}
0 \\
1
\end{pmatrix} = |1\rangle
$$

$$
\begin{pmatrix}
\frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}}
\end{pmatrix} = \frac{1}{\sqrt{2}}|0\rangle + \frac{1}{\sqrt{2}}|1\rangle = |+\rangle
$$

$$
\begin{pmatrix}
\frac{1+2i}{3} \\
-\frac{2}{3}
\end{pmatrix} = \frac{1+2i}{3}|0\rangle - \frac{2}{3}|1\rangle
$$

첫 두 예시 $|0\rangle$와 $|1\rangle$는 표준 기저 원소가 유효한 양자 상태 벡터임을 보여줍니다. 다른 예시들도 복소수 항목을 가지며 절댓값 제곱의 합이 $1$이므로 유효한 양자 상태 벡터입니다.

이들은 표준 기저 상태 $|0\rangle$와 $|1\rangle$의 선형 결합이며, 이러한 이유로 종종 상태 $0$과 $1$의 *superposition (중첩)*이라고 합니다. 양자 상태의 맥락에서 *superposition*과 *linear combination*은 본질적으로 동의어입니다.

### 다른 시스템의 양자 상태

임의의 고전 상태 집합을 가진 시스템의 양자 상태를 고려할 수 있습니다. 예를 들어, 전기 선풍기 스위치의 양자 상태 벡터는 다음과 같습니다:

$$
\frac{1}{2}|\text{high}\rangle - \frac{i}{2}|\text{low}\rangle + \frac{1}{\sqrt{2}}|\text{off}\rangle
$$

고전 상태가 *high*, *medium*, *low*, *off* 순서로 정렬되어 있다고 가정합니다.

### Uniform superposition (균등 중첩)

임의의 고전 상태 집합 $\Sigma$에 대해, 다음 양자 상태 벡터를 고려할 수 있습니다:

$$
\frac{1}{\sqrt{|\Sigma|}} \sum_{a\in\Sigma} |a\rangle
$$

이것은 $\Sigma$의 고전 상태들에 대한 *uniform superposition (균등 중첩)*입니다.

:::

## Unitary operations (유니터리 연산)

Unitary operations (유니터리 연산)은 양자 상태를 변환하지만 확률의 합을 보존합니다. 행렬 $U$가 유니터리인 경우:

$$
U^{\dagger}U=I
$$

::: tip 기호 설명: $U^{\dagger}$ (Dagger, 켤레 전치)
- **의미**: 행렬 $U$의 conjugate transpose (켤레 전치) 또는 Hermitian conjugate (에르미트 켤레)
- **발음**: "유 대거"
- **계산 방법**: 행렬을 전치(transpose)한 후 각 원소의 복소 켤레(complex conjugate)를 취합니다.
- **특징**: 유니터리 행렬은 $U^{\dagger}U=I$를 만족하며, 이는 역행렬이 $U^{\dagger}$임을 의미합니다.
:::

::: tip 수식 읽기: $U^{\dagger}U=I$
- **읽는 방법**: "유 대거 곱하기 유는 단위 행렬과 같다" 또는 "U dagger times U equals identity matrix"
- **의미**: 유니터리 행렬의 정의로, 행렬과 그 켤레 전치의 곱이 단위 행렬이 되는 행렬입니다.
- **물리적 의미**: 유니터리 연산은 양자 상태의 확률을 보존하는 가역적 변환입니다.
:::

여기서 $U^{\dagger}$는 $U$의 conjugate transpose (켤레 전치)이고, $I$는 identity matrix (단위 행렬)입니다.

### 1. Pauli operations (Pauli 연산)

Pauli operations (Pauli 연산)들은 다음과 같이 정의됩니다:

#### Pauli-X (NOT 연산)

$$
X=\left(\begin{array}{ll}
0 & 1 \\
1 & 0
\end{array}\right)
$$

$$
X|0\rangle=|1\rangle \quad \text{그리고} \quad X|1\rangle=|0\rangle
$$

#### Pauli-Y

$$
Y=\left(\begin{array}{cc}
0 & -i \\
i & 0
\end{array}\right)
$$

::: tip 기호 설명: $i$ (허수 단위)
- **의미**: 허수 단위(imaginary unit)로, $i^{2}=-1$을 만족하는 수
- **발음**: "아이" 또는 "허수 단위"
- **사용**: 복소수를 표현할 때 사용되며, 양자 역학에서 위상(phase)을 나타내는 데 중요합니다.
- **참고**: 공학에서는 $j$를 사용하기도 하지만, 수학과 물리학에서는 $i$를 사용합니다.
:::

#### Pauli-Z

$$
Z=\left(\begin{array}{cc}
1 & 0 \\
0 & -1
\end{array}\right)
$$

$$
Z|0\rangle=|0\rangle \quad \text{그리고} \quad Z|1\rangle=-|1\rangle
$$

### 2. Hadamard operation (Hadamard 연산)

Hadamard operation (Hadamard 연산)은 다음 행렬로 표현됩니다:

$$
H=\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right)
$$

$H$가 유니터리임을 확인하는 것은 간단한 계산입니다:

$$
\begin{aligned}
H^{\dagger}H&=\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right)^{\dagger}\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right) \\
&=\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right)\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right) \\
&=\left(\begin{array}{cc}
\frac{1}{2}+\frac{1}{2} & \frac{1}{2}-\frac{1}{2} \\
\frac{1}{2}-\frac{1}{2} & \frac{1}{2}+\frac{1}{2}
\end{array}\right) \\
&=\left(\begin{array}{ll}
1 & 0 \\
0 & 1
\end{array}\right)
\end{aligned}
$$

### Hadamard 연산 예시

$$
\begin{aligned}
& H|0\rangle=\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right)\binom{1}{0}=\binom{\frac{1}{\sqrt{2}}}{\frac{1}{\sqrt{2}}}=|+\rangle \\
& H|1\rangle=\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right)\binom{0}{1}=\binom{\frac{1}{\sqrt{2}}}{-\frac{1}{\sqrt{2}}}=|-\rangle \\
& H|+\rangle=\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right)\binom{\frac{1}{\sqrt{2}}}{\frac{1}{\sqrt{2}}}=\binom{1}{0}=|0\rangle \\
& H|-\rangle=\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right)\binom{\frac{1}{\sqrt{2}}}{-\frac{1}{\sqrt{2}}}=\binom{0}{1}=|1\rangle
\end{aligned}
$$

정리하면:

$$
\begin{array}{ll}
H|0\rangle=|+\rangle & H|+\rangle=|0\rangle \\
H|1\rangle=|-\rangle & H|-\rangle=|1\rangle
\end{array}
$$

### 3. Phase operation (Phase 연산)

Phase operation (Phase 연산)은 다음 행렬로 설명됩니다:

$$
P_{\theta}=\left(\begin{array}{cc}
1 & 0 \\
0 & e^{i \theta}
\end{array}\right)
$$

::: tip 기호 설명: $\theta$ (세타)
- **의미**: 각도나 위상(phase)을 나타내는 그리스 문자
- **발음**: "세타" (theta)
- **사용**: 위상 연산에서 위상 각도를 나타냅니다.
:::

::: tip 수식 읽기: $e^{i \theta}$ (오일러 공식)
- **읽는 방법**: "이의 아이 세타 제곱" 또는 "e to the i theta"
- **의미**: 오일러 공식(Euler's formula)로, $e^{i \theta} = \cos\theta + i\sin\theta$를 나타냅니다.
- **물리적 의미**: 위상 $\theta$만큼 회전하는 연산을 나타냅니다.
- **특수한 경우**: 
  - $e^{i\pi} = -1$ (오일러 항등식)
  - $e^{i\pi/2} = i$
  - $e^{i\pi/4} = \frac{1+i}{\sqrt{2}}$
:::

여기서 $\theta$는 임의의 실수입니다.

중요한 예시들:

$$
S=P_{\pi / 2}=\left(\begin{array}{ll}
1 & 0 \\
0 & i
\end{array}\right) \quad \text{그리고} \quad T=P_{\pi / 4}=\left(\begin{array}{cc}
1 & 0 \\
0 & \frac{1+i}{\sqrt{2}}
\end{array}\right)
$$

::: tip 기호 설명: $\pi$ (파이)
- **의미**: 원주율(pi)로, 약 3.14159...의 무리수
- **발음**: "파이" (pi)
- **사용**: 각도나 위상을 라디안(radian) 단위로 표현할 때 사용됩니다.
- **참고**: 
  - $\pi/2$는 90도 (직각)
  - $\pi/4$는 45도
  - $\pi$는 180도
:::

### Phase 연산 예시

$$
\begin{aligned}
& T|0\rangle=|0\rangle \quad \text{그리고} \quad T|1\rangle=\frac{1+i}{\sqrt{2}}|1\rangle \\
& T|+\rangle=T\left(\frac{1}{\sqrt{2}}|0\rangle+\frac{1}{\sqrt{2}}|1\rangle\right) \\
& =\frac{1}{\sqrt{2}} T|0\rangle+\frac{1}{\sqrt{2}} T|1\rangle \\
& =\frac{1}{\sqrt{2}}|0\rangle+\frac{1+i}{2}|1\rangle
\end{aligned}
$$

$$
\begin{aligned}
& HT|+\rangle=H\left(\frac{1}{\sqrt{2}}|0\rangle+\frac{1+i}{2}|1\rangle\right) \\
& =\frac{1}{\sqrt{2}} H|0\rangle+\frac{1+i}{2} H|1\rangle \\
& =\frac{1}{\sqrt{2}}|+\rangle+\frac{1+i}{2}|-\rangle \\
& =\left(\frac{1}{2}|0\rangle+\frac{1}{2}|1\rangle\right)+\left(\frac{1+i}{2 \sqrt{2}}|0\rangle-\frac{1+i}{2 \sqrt{2}}|1\rangle\right) \\
& =\left(\frac{1}{2}+\frac{1+i}{2 \sqrt{2}}\right)|0\rangle+\left(\frac{1}{2}-\frac{1+i}{2 \sqrt{2}}\right)|1\rangle
\end{aligned}
$$

## Composition of unitary operations (유니터리 연산의 합성)

Unitary operations의 composition (합성)은 행렬 곱셈으로 표현됩니다(확률적 설정과 유사).

### 예시: NOT의 제곱근

Hadamard operation을 적용한 다음, phase operation $S$를 적용하고, 다시 Hadamard operation을 적용하면 다음 연산을 얻습니다:

$$
\begin{aligned}
HSH&=\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right)\left(\begin{array}{ll}
1 & 0 \\
0 & i
\end{array}\right)\left(\begin{array}{cc}
\frac{1}{\sqrt{2}} & \frac{1}{\sqrt{2}} \\
\frac{1}{\sqrt{2}} & -\frac{1}{\sqrt{2}}
\end{array}\right) \\
&=\left(\begin{array}{cc}
\frac{1+i}{2} & \frac{1-i}{2} \\
\frac{1-i}{2} & \frac{1+i}{2}
\end{array}\right)
\end{aligned}
$$

이 유니터리 연산을 두 번 적용하면 NOT 연산을 얻습니다:

$$
(HSH)^{2}=\left(\begin{array}{cc}
\frac{1+i}{2} & \frac{1-i}{2} \\
\frac{1-i}{2} & \frac{1+i}{2}
\end{array}\right)^{2}=\left(\begin{array}{ll}
0 & 1 \\
1 & 0
\end{array}\right)
$$

즉, $R = HSH$는 *square root of NOT* 연산입니다. 같은 연산을 두 번 적용하여 NOT 연산을 얻는 이러한 동작은 단일 비트에 대한 고전 연산에서는 불가능합니다.

::: details Qiskit을 사용한 구현 예제

이 섹션에서는 이 강의에서 소개된 개념들의 Qiskit 구현을 살펴봅니다. Qiskit은 IBM에서 개발한 양자 컴퓨팅 프레임워크입니다.

### Python에서의 벡터와 행렬

Qiskit은 Python 프로그래밍 언어를 사용하므로, Python에서 행렬과 벡터 계산을 수행하는 방법을 간단히 살펴보겠습니다.

Python에서 행렬과 벡터 계산은 `NumPy` 라이브러리의 `array` 클래스를 사용하여 수행할 수 있습니다. 다음 코드는 이 라이브러리를 로드하고, Qubit 상태 벡터 $|0\rangle$와 $|1\rangle$에 해당하는 두 개의 열 벡터 `ket0`와 `ket1`를 정의한 다음, 그들의 평균을 출력합니다:

```python
import numpy as np

ket0 = np.array([[1], [0]])
ket1 = np.array([[0], [1]])

print(ket0 / 2 + ket1 / 2)
# 출력: [[0.5]
#        [0.5]]
```

`array`를 사용하여 연산을 나타내는 행렬을 만들 수도 있습니다:

```python
M1 = np.array([[1, 1], [0, 0]])
M2 = np.array([[1, 0], [0, 1]])
M = M1 / 2 + M2 / 2
print(M)
# 출력: [[1.  0.5]
#        [0.  0.5]]
```

행렬 곱셈(행렬-벡터 곱셈을 특수한 경우로 포함)은 `NumPy`의 `matmul` 함수를 사용하여 수행할 수 있습니다:

```python
print(np.matmul(M1, ket1))
# 출력: [[1]
#        [0]]

print(np.matmul(M1, M2))
# 출력: [[1 1]
#        [0 0]]

print(np.matmul(M, M))
# 출력: [[1.   0.75]
#        [0.   0.25]]
```

더 보기 좋은 출력을 위해 Qiskit의 `qiskit.visualization` 모듈에서 `array_to_latex` 함수를 사용할 수 있습니다:

```python
from qiskit.visualization import array_to_latex
from IPython.display import display

display(array_to_latex(np.matmul(M1, ket1)))
display(array_to_latex(np.matmul(M1, M2)))
display(array_to_latex(np.matmul(M, M)))
```

### Statevector를 사용한 상태 정의 및 표시

Qiskit의 `Statevector` 클래스는 양자 상태 벡터를 정의하고 조작하는 기능을 제공합니다:

```python
from qiskit.quantum_info import Statevector
from numpy import sqrt

u = Statevector([1 / sqrt(2), 1 / sqrt(2)])
v = Statevector([(1 + 2.0j) / 3, -2 / 3])
w = Statevector([1 / 3, 2 / 3])
```

`Statevector` 클래스는 상태 벡터를 다양한 방식으로 표시하는 `draw` 메서드를 포함합니다:

```python
display(u.draw("text"))  # 일반 텍스트
display(u.draw("latex"))  # 렌더링된 LaTeX
print(u.draw("latex_source"))  # LaTeX 코드
```

`Statevector` 클래스는 또한 주어진 벡터가 유효한 양자 상태 벡터인지 확인하는 `is_valid` 메서드를 포함합니다 (즉, 유클리드 노름이 1인지):

```python
display(u.is_valid())  # True
display(w.is_valid())  # False
```

### Statevector를 사용한 측정 시뮬레이션

`Statevector` 클래스의 `measure` 메서드를 사용하여 양자 상태의 측정을 시뮬레이션할 수 있습니다:

```python
outcome, state = v.measure()
print(f"Measured: {outcome}\nPost-measurement state:")
display(state.draw("latex"))
```

측정 결과는 확률적이므로 이 메서드는 여러 번 실행할 때 다른 결과를 반환할 수 있습니다.

`Statevector`는 또한 시스템에 대한 여러 측정을 시뮬레이션할 수 있는 `sample_counts` 메서드를 제공합니다:

```python
from qiskit.visualization import plot_histogram

statistics = v.sample_counts(1000)
plot_histogram(statistics)
```

### Operator와 Statevector를 사용한 연산 수행

유니터리 연산은 Qiskit에서 `Operator` 클래스를 사용하여 정의할 수 있습니다:

```python
from qiskit.quantum_info import Operator

Y = Operator([[0, -1.0j], [1.0j, 0]])
H = Operator([[1 / sqrt(2), 1 / sqrt(2)], [1 / sqrt(2), -1 / sqrt(2)]])
S = Operator([[1, 0], [0, 1.0j]])
T = Operator([[1, 0], [0, (1 + 1.0j) / sqrt(2)]])

display(T.draw("latex"))
```

`evolve` 메서드를 사용하여 상태 벡터에 유니터리 연산을 적용할 수 있습니다:

```python
v = Statevector([1, 0])

v = v.evolve(H)
v = v.evolve(T)
v = v.evolve(H)
v = v.evolve(S)
v = v.evolve(Y)

display(v.draw("latex"))
```

### 양자 회로 미리보기

양자 회로는 이 강의의 세 번째 강의에서 공식적으로 소개되지만, Qiskit의 `QuantumCircuit` 클래스를 사용하여 Qubit 유니터리 연산의 합성을 실험할 수 있습니다:

```python
from qiskit import QuantumCircuit

circuit = QuantumCircuit(1)

circuit.h(0)  # Hadamard
circuit.t(0)  # T gate
circuit.h(0)  # Hadamard
circuit.s(0)  # S gate
circuit.y(0)  # Y gate

display(circuit.draw(output="mpl"))
```

회로에 해당하는 유니터리 행렬을 얻는 편리한 방법은 `Operator` 클래스의 `from_circuit` 메서드를 사용하는 것입니다:

```python
display(Operator.from_circuit(circuit).draw("latex"))
```

초기 양자 상태 벡터를 설정하고 회로에 설명된 연산 시퀀스에 따라 해당 상태를 진화시킬 수도 있습니다:

```python
ket0 = Statevector([1, 0])
v = ket0.evolve(circuit)
display(v.draw("latex"))
```

:::

## 요약

1. **Classical information (고전 정보)**: probability vector (확률 벡터)로 표현되는 probabilistic state (확률적 상태)
2. **Dirac notation (Dirac 표기법)**: $|\alpha\rangle$ 형태의 표기법
3. **Quantum state (양자 상태)**: 복소수 계수를 가진 벡터로 표현되며 normalization condition (정규화 조건)을 만족
4. **Qubit**: 양자 정보의 기본 단위
5. **Unitary operations (유니터리 연산)**: 
   - Pauli operations (Pauli 연산들) (X, Y, Z)
   - Hadamard operation (Hadamard 연산) (H)
   - Phase operations (Phase 연산들) (S, T)
6. **Composition of operations (연산의 합성)**: 행렬 곱셈을 통해 표현

이러한 개념들은 양자 알고리즘과 양자 계산을 이해하는 기초가 됩니다.

