<template><div><h1 id="kubernetes-vault-통합방안-3가지-비교-sidecar-agent-injector-vs-vault-secrets-operator-vs-csi-provider" tabindex="-1"><a class="header-anchor" href="#kubernetes-vault-통합방안-3가지-비교-sidecar-agent-injector-vs-vault-secrets-operator-vs-csi-provider" aria-hidden="true">#</a> Kubernetes Vault 통합방안 3가지 비교 : Sidecar Agent Injector vs. Vault Secrets Operator vs. CSI provider</h1>
<h2 id="_0-개요" tabindex="-1"><a class="header-anchor" href="#_0-개요" aria-hidden="true">#</a> 0. 개요</h2>
<p>본 글에서는 HashiCorp Vault 및 Kubernetes 통합을 위해 HashiCorp가 지원하는 세 가지 방법을 자세히 비교한다:</p>
<ol>
<li>볼트 사이드카 에이전트 인젝터(Sidecar Agent Injector)</li>
<li>볼트 컨테이너 스토리지 인터페이스 공급자(Container Storage Interface (CSI) provider)</li>
<li>볼트 시크릿 오퍼레이터(Secrets Operator)</li>
</ol>
<p>각 방법에 대한 실용적인 지침(guidance)을 제공하여 사용 사례에 가장 적합한 방법을 이해하고 선택할 수 있도록 안내한다.</p>
<blockquote>
<p>참고 :<br>
본 포스트는 제품 설명서나 단계별(step-by-step) 구현 가이드가 아니며, HashiCorp Vault 및 Kubernetes에 익숙하고 시크릿 관리 개념에 대한 기본적인 이해가 있는 데브옵스 실무자를 위한 문서이다.</p>
</blockquote>
<h2 id="_1-vault-sidecar-agent-injector" tabindex="-1"><a class="header-anchor" href="#_1-vault-sidecar-agent-injector" aria-hidden="true">#</a> 1. Vault Sidecar Agent Injector</h2>
<p>Vault 사이드카 에이전트 인젝터(<a href="https://www.vaultproject.io/docs/platform/k8s/injector?_gl=1*67yi4g*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTM5Nzc3NC45LjEuMTY4MTM5ODY2NC4wLjAuMA.." target="_blank" rel="noopener noreferrer">Vault Sidecar Agent Injector<ExternalLinkIcon/></a>)는 사이드카 패턴(<a href="https://docs.microsoft.com/en-us/azure/architecture/patterns/sidecar" target="_blank" rel="noopener noreferrer">sidecar pattern<ExternalLinkIcon/></a>)을 활용하여 공유 메모리 볼륨에 볼트 시크릿을 렌더링하는 Vault 에이전트 컨테이너를 포함하도록 파드 사양(spec)을 변경한다. 공유 볼륨에 시크릿을 렌더링함으로써, 파드 내의 컨테이너는 Vault를 인식(Vault-aware)하지 않고도 Vault 시크릿을 사용할 수 있다.<br>
인젝터는 Kubernetes Mutating Webhook Controller이다. Controller는 파드 이벤트를 가로채고(intercepts) 요청 내에 어노테이션이 있는 경우 파드에 변형(mutations)을 적용한다. 이 기능은 <a href="https://github.com/hashicorp/vault-k8s" target="_blank" rel="noopener noreferrer">vault-k8s<ExternalLinkIcon/></a> 프로젝트에 의해 제공되며, Vault Helm 차트를 사용하여 자동으로 설치 및 구성할 수 있다.</p>
<figure><img src="https://www.hashicorp.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F2885%2F1643214443-sidecar-workflow-v1.png&amp;w=3840&amp;q=75" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h2 id="_2-vault-csi-provider" tabindex="-1"><a class="header-anchor" href="#_2-vault-csi-provider" aria-hidden="true">#</a> 2. Vault CSI provider</h2>
<p>파드가 임시(ephemeral) <a href="https://github.com/kubernetes-sigs/secrets-store-csi-driver" target="_blank" rel="noopener noreferrer">CSI Secrets Store<ExternalLinkIcon/></a> 볼륨을 사용하여 볼트 시크릿을 사용할 수 있도록 하는 것이 <a href="https://www.vaultproject.io/docs/platform/k8s/csi?_gl=1*8ev72c*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTM5Nzc3NC45LjEuMTY4MTM5ODc3NC4wLjAuMA.." target="_blank" rel="noopener noreferrer">Vault CSI provider<ExternalLinkIcon/></a>이다.<br>
높은 수준(high level)에서, CSI Secretes Store 드라이버는 사용자가 <code v-pre>SecretProviderClass</code> 오브젝트를 생성할 수 있게 해준다. 이 오브젝트는 사용할 시크릿 프로바이더와 검색할 시크릿을 정의한다. CSI 볼륨을 요청하는 파드가 생성되면, CSI Secretes Store 드라이버는 프로바이더가 <code v-pre>vault</code>인 경우 요청을 Vault CSI Provider에게 보낸다. 그러면 Vault CSI Provider는 지정된 <code v-pre>SecretProviderClass</code>와 파드의 서비스 어카운트(SA)을 사용하여 볼트에서 시크릿을 검색하고 파드의 CSI 볼륨에 마운트한다. 시크릿은 Vault에서 검색되어 <code v-pre>ContainerCreation</code> 단계에서 CSI 시크릿 스토어 볼륨에 채워진다. 즉, Vault에서 시크릿을 읽고 볼륨에 쓰기 전까지는 파드가 시작되지 않도록 차단된다.</p>
<figure><img src="https://www.hashicorp.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F2885%2F1643214470-csi-workflow-v1.png&amp;w=3840&amp;q=75" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<h2 id="_3-vault-secrets-operator" tabindex="-1"><a class="header-anchor" href="#_3-vault-secrets-operator" aria-hidden="true">#</a> 3. Vault Secrets Operator</h2>
<p><a href="https://github.com/hashicorp/vault-secrets-operator/" target="_blank" rel="noopener noreferrer">Vault Secrets Operator<ExternalLinkIcon/></a>는 기본적으로 Vault secrets을 Kubernetes Secrets에 동기화할 책임이 있는(responsible) CRD 집합으로 쿠버네티스 시크릿 오퍼레이터(Kubernetes Secrets Operator)를 구현하는 새로운 통합 방법이다.<br>
오퍼레이터는 하나 이상의 볼트 서버 인스턴스에서 정적(static), 동적(dynamic) 및 PKI 기반(PKI-based) 시크릿을 포함한 시크릿 관리의 전체 라이프사이클 동기화를 지원한다. 또한 오퍼레이터는 시크릿 로테이션(secret rotation)을 관리하고 <a href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/" target="_blank" rel="noopener noreferrer">Deployment<ExternalLinkIcon/></a>의 <a href="https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#rollout" target="_blank" rel="noopener noreferrer">rolling update<ExternalLinkIcon/></a>를 통해 애플리케이션에 직접 알리거나(notifying) 롤링 업데이트를 트리거(triggering)하는 등 로테이션 후 작업을 수행할 수 있다.</p>
<blockquote>
<p>참고 :</p>
<ul>
<li><a href="https://kubernetes.io/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/" target="_blank" rel="noopener noreferrer">커스텀 리소스(Custom Resource) 란?<ExternalLinkIcon/></a></li>
<li><a href="https://kubernetes.io/ko/docs/concepts/extend-kubernetes/operator/" target="_blank" rel="noopener noreferrer">오퍼레이터(operator) 패턴이란?<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<h2 id="_4-common-design-considerations" tabindex="-1"><a class="header-anchor" href="#_4-common-design-considerations" aria-hidden="true">#</a> 4. Common design considerations</h2>
<p>두 솔루션 간에는 몇 가지 유사점과 차이점이 있으며, Kubernetes 환경에서 시크릿 관리 전략을 설계하고 구현할 때 고려해야 할 사항이다.</p>
<ol>
<li><strong>Secret projections</strong>: 모든 애플리케이션은 특정 방식으로 시크릿을 제공해야 한다. 일반적으로, 애플리케이션은 환경 변수로 내보내거나(exported) 애플리케이션 시작(startup) 시 애플리케이션이 읽을 수 있는 파일에 시크릿을 기록한다. 사용할 올바른 방법을 결정할 때 이 점을 염두에 두자.</li>
<li><strong>Secret scope</strong>: 일부 애플리케이션은 데이터센터, 엣지 또는 퍼블릭 클라우드의 여러 Kubernetes 환경(예: dev, qa, producton)에 배포된다. 일부 서비스는 가상 머신, 서버리스 또는 기타 클라우드 관리형(cloud-managed) 서비스에 배포된 외부 Kubernetes 환경에서 실행되기도 한다.<br>
이러한 애플리케이션이 다양한 이기종 환경 전반에서 일련의 시크릿을 공유해야 하는 시나리오에 직면할 수 있다. 키의 범위(Scoping)를 올바르게 설정하여 Kubernetes 환경에 로컬 또는 여러 환경에 걸쳐 전역(global)으로 설정하면 각 애플리케이션이 배포된 환경 내에서 자체 키 집합에 쉽고 안전하게 액세스할 수 있다.</li>
<li><strong>Secret types</strong>: 시크릿은 텍스트 파일, 바이너리 파일, 토큰 또는 인증서 등이 대표적이다. 정적으로 생성하거나 동적으로 생성할 수도 있다. 영구적으로 유효하거나 시간 제한적(time-scoped)으로 유효할 수 있다. 또한 크기도 다양하다. 애플리케이션에 필요한 시크릿 유형과 애플리케이션에 투영(projected)되는 방식을 고려해야 한다.</li>
<li><strong>Secret definition</strong>: 또한 각 비밀이 정의, 생성, 업데이트 및 제거되는 방법과 해당 프로세스와 관련된 도구도 고려해야 한다.</li>
<li><strong>Encryption</strong>: 미사용(at rest) 시크릿과 전송(transit) 중인 시크릿을 모두 암호화하는 것은 많은 기업 조직에서 중요한 요구 사항이다.</li>
<li><strong>Governance</strong>: 애플리케이션과 비밀은 다대다(many-to-many) 관계를 가질 수 있으므로 애플리케이션이 각각의 비밀을 검색할 수 있도록 액세스 권한을 부여할 때 신중한 고려가 필요하다. 애플리케이션과 암호의 수(scale)가 증가함에 따라 액세스 정책 관리의 어려움도 커진다.</li>
<li><strong>Secrets updates and rotation</strong>: 시크릿은 임대(leased), 시간 범위(time-scoped) 지정 또는 자동으로 순환(rotated)될 수 있으며, 각 시나리오는 새 시크릿이 애플리케이션 파드에 올바르게 전파되도록 프로그래밍(programmatic) 프로세스를 거쳐야 한다.</li>
<li><strong>Secret caching</strong>: 특정 쿠버네티스 환경(예: edge 또는 retail)에서는 환경과 시크릿 스토리지 간의 통신 또는 네트워크 장애가 발생할 경우 시크릿 캐싱이 필요할 수 있다.</li>
<li><strong>Auditability</strong>: 모든 시크릿 액세스 정보를 자세히 설명하는 시크릿 액세스 감사 로그를 보관하는 것은 시크릿 액세스(secret-access) 이벤트의 추적성(traceability)을 보장(Keeping)하는 데 중요하다</li>
</ol>
<p>이러한 설계 고려 사항을 염두에 두고, 두 통합 솔루션의 유사점(similarities)과 차이점(differences)을 살펴본다.</p>
<h2 id="_5-similarities" tabindex="-1"><a class="header-anchor" href="#_5-similarities" aria-hidden="true">#</a> 5. Similarities</h2>
<p>Vault <strong>Operator</strong>, <strong>CSI</strong> 및 <strong>Sidecar</strong> 솔루션:</p>
<ul>
<li>
<p>Vault에 저장된 다양한 유형의 시크릿 검색을 간소화(Simplify)하고 사소하지 않은(not-so-trivial) Vault 프로세스를 인식하지 않고도 Kubernetes에서 실행 중인 대상 파드에 시크릿을 노출한다. 중요한 점은 이러한 솔루션을 사용하기 위해 애플리케이션 로직이나 코드를 변경할 필요가 없기 때문에 브라운필드(brownfield) 애플리케이션을 Kubernetes로 더 쉽게 마이그레이션할 수 있다는 것이다. 그린필드(greenfield) 애플리케이션을 작업하는 개발자는 <a href="https://www.vaultproject.io/api/libraries?_gl=1*1kt7rwn*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTQ2MTI4NS4xMS4xLjE2ODE0NjE2OTUuMC4wLjA." target="_blank" rel="noopener noreferrer">Vault SDKs<ExternalLinkIcon/></a>를 활용하여 Vault와 직접 통합할 수 있다.</p>
</li>
<li>
<p>모든 유형의 Vault <a href="https://www.vaultproject.io/docs/secrets?_gl=1*1xda1jz*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTQ2MTI4NS4xMS4xLjE2ODE0NjE4MjUuMC4wLjA." target="_blank" rel="noopener noreferrer">secrets engines<ExternalLinkIcon/></a>을 지원한다. 즉, 정적 키-값(key-value) 시크릿부터 동적으로 생성된 데이터베이스 자격 증명(credentials), 사용자 정의 TTL이 포함된 TLS 인증서까지 광범위한(extensive) 시크릿 유형 세트를 활용할 수 있다.</p>
</li>
<li>
<p>애플리케이션의 Kubernetes 포드 서비스 어카운트(SA) 토큰을 <a href="https://www.hashicorp.com/resources/secret-zero-mitigating-the-risk-of-secret-introduction-with-vault" target="_blank" rel="noopener noreferrer">“Secret Zero”<ExternalLinkIcon/></a>로 활용하여 <a href="https://developer.hashicorp.com/vault/docs/auth/kubernetes" target="_blank" rel="noopener noreferrer">Kubernetes Auth Method<ExternalLinkIcon/></a>를 통해 Vault에 인증한다.<br>
즉, Vault에 인증할 때 애플리케이션 파드를 식별하기 위해 또 다른 별도의 ID를 관리할 필요가 없다.</p>
</li>
</ul>
<figure><img src="https://www.hashicorp.com/_next/image?url=https%3A%2F%2Fwww.datocms-assets.com%2F2885%2F1643214683-vault-k8s-auth-blog.png&amp;w=3840&amp;q=75" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure>
<p><strong><em>Vault’s Kubernetes auth workflow</em>:</strong></p>
<ul>
<li>애플리케이션을 배포하기 전에 원하는 시크릿이 Vault 내에 존재해야 한다.</li>
<li>원하는 시크릿에 액세스할 수 있는 정책으로 파드의 서비스 어카운트가 Vault 역할에 바인딩(bound)되어야 한다.<br>
(즉, 시크릿에 대한 액세스 권한을 부여하는 데 Kubernetes RBAC이 사용되지 않아야 함).</li>
<li>Helm을 통해 배포 가능</li>
<li>파드가 시작되기 전에 볼트에서 시크릿을 성공적으로 검색(retrieving)해야 한다.</li>
<li>사용자 정의(user-defined) 파드 어노테이션을 사용하여 Vault에서 필요한 시크릿을 검색(retrieve)한다.</li>
<li><a href="https://www.vaultproject.io/docs/agent/template?_gl=1*x61qo5*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTQ2MTI4NS4xMS4xLjE2ODE0NjIyOTcuMC4wLjA.#renewals-and-updating-secrets" target="_blank" rel="noopener noreferrer">Sidecar Injector Service<ExternalLinkIcon/></a>와 <a href="https://secrets-store-csi-driver.sigs.k8s.io/topics/secret-auto-rotation.html" target="_blank" rel="noopener noreferrer">CSI Driver<ExternalLinkIcon/></a>는 모두 자동으로 시크릿/토큰을 갱신(renew), 회전(rotate) 및 가져올(fetch) 수 있다.</li>
</ul>
<h2 id="_6-differences" tabindex="-1"><a class="header-anchor" href="#_6-differences" aria-hidden="true">#</a> 6. Differences</h2>
<p>세 가지 솔루션의 차이점은 다음과 같다:</p>
<ul>
<li>사이드카 에이전트 인젝터 솔루션은 두 가지 요소로 구성된다:
<ul>
<li><strong>Sidecar Service Injector</strong>는 클러스터 서비스로 배포되며, Kubernetes API Server 파드 이벤트를 가로채고 필요한 사이드카 컨테이너를 추가하기 위해 파드 스펙을 변경하는 역할을 한다.</li>
<li><strong>Vault Sidecar Container</strong>는 각 애플리케이션 파드와 함께 배포되며 Vault에 인증하고, Vault에서 시크릿을 검색하고, 애플리케이션이 사용할 시크릿을 렌더링하는 것을 담당한다.</li>
</ul>
</li>
<li>이와 대조적으로, <strong>Vault CSI Driver</strong>는 쿠버네티스 클러스터의 모든 노드에 데몬셋으로 배포되며, 지정된 시크릿 프로바이더 클래스와 파드의 서비스 계정을 사용하여 Vault에서 시크릿을 검색하고 파드의 CSI 볼륨에 마운트한다.</li>
<li>또한 <strong>Vault Operator</strong>는 시크릿 로테이션을 관리하고 디플로이먼트의 롤링 업데이트를 통해(또는 트리거를 통해) 애플리케이션에 직접 알리는 등 로테이션 후 작업을 수행할 수 있다.</li>
<li>지원되는 인증 방법의 차이는 다음과 같다:
<ul>
<li>Sidecar Agent Injector는 모든(<a href="https://www.vaultproject.io/docs/platform/k8s/injector/annotations?_gl=1*drq9u5*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTQ2MTI4NS4xMS4xLjE2ODE0NjI4ODYuMC4wLjA.#vault-hashicorp-com-auth-path" target="_blank" rel="noopener noreferrer">all<ExternalLinkIcon/></a>) Vault 자동 인증(<a href="https://www.vaultproject.io/docs/agent/autoauth/methods?_gl=1*jv9vba*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTQ2MTI4NS4xMS4xLjE2ODE0NjI4ODguMC4wLjA." target="_blank" rel="noopener noreferrer">auto-auth<ExternalLinkIcon/></a>) 방법을 지원</li>
<li>Sidecar CSI Driver는 Vault의 쿠버네티스 인증 방법(<a href="https://www.vaultproject.io/docs/platform/k8s/csi/configurations?_gl=1*1srn571*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTQ2MTI4NS4xMS4xLjE2ODE0NjI4OTguMC4wLjA.#vaultkubernetesmountpath" target="_blank" rel="noopener noreferrer">Vault’s Kubernetes auth method<ExternalLinkIcon/></a>)만 지원</li>
<li>Vault Operator는 현재 쿠버네티스 인증 방법만 지원</li>
</ul>
</li>
<li>모든 애플리케이션 파드와 함께 실행되는 사이드카 컨테이너는 자동 인증, 템플릿, 캐싱과 같은 강력한 기능 세트를 제공하는 <a href="https://www.vaultproject.io/docs/agent?_gl=1*138ihg*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTQ2MTI4NS4xMS4xLjE2ODE0NjI5ODIuMC4wLjA." target="_blank" rel="noopener noreferrer">Vault Agent<ExternalLinkIcon/></a>를 사용한다. CSI Driver는 Vault Agent를 사용하지 않으므로 이러한 기능을 제공하지 않는다.</li>
<li><strong>Vault Operator</strong>에는 거버넌스 보고(governance reporting)를 위한 Promethus 오퍼레이터에 대한 지원이 포함되어 있다.</li>
<li><strong>Vault CSI Driver</strong>는 Vault 시크릿을 쿠버네티스 시크릿과 환경 변수로 렌더링하는 것을 지원한다. Sidecar Injector Service는 시크릿을 쿠버네티스 시크릿으로 렌더링하는 것을 지원하지 않지만, 에이전트 템플릿(<a href="https://developer.hashicorp.com/vault/docs/platform/k8s/injector/examples?ajs_aid=d3785cda-6801-454c-8c44-fb6ad1c625e3&amp;_gl=1*1ly52in*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTQ2MTI4NS4xMS4xLjE2ODE0NjMyNDUuMC4wLjA.&amp;product_intent=vault#environment-variable-example" target="_blank" rel="noopener noreferrer">agent templating<ExternalLinkIcon/></a>)을 사용하여 시크릿을 환경 변수로 렌더링하는 방법이 있다.</li>
<li>CSI Driver는 <code v-pre>hostPath</code>를 사용하여 임시 볼륨을 파드에 마운트하는데, 일부 컨테이너 플랫폼(예: OpenShift)은 기본적으로 이 기능을 비활성화한다. 반면, Sidecar Agent Service는 인메모리(in-memory) <em>tmpfs</em> 볼륨을 사용한다.</li>
<li>Sidecar Injector Service는 자동으로(<a href="https://www.vaultproject.io/docs/agent/template?_gl=1*73vpv8*_ga*MjA5MTM1MTczLjE2ODA2MDU3MjM.*_ga_P7S46ZYEKW*MTY4MTQ2MTI4NS4xMS4xLjE2ODE0NjMzMzQuMC4wLjA.#renewals-and-updating-secrets" target="_blank" rel="noopener noreferrer">automatically<ExternalLinkIcon/></a>) 시크릿/토큰을 갱신, 회전 및 패치(fetches)를 지원하지만, CSI Driver는 이를 지원하지 않는다.</li>
</ul>
<h2 id="_7-comparison-chart" tabindex="-1"><a class="header-anchor" href="#_7-comparison-chart" aria-hidden="true">#</a> 7. Comparison Chart</h2>
<p>아래 표는 두 솔루션을 개략적(high-level)으로 비교한 것이다:</p>
<table>
<thead>
<tr>
<th></th>
<th style="text-align:center">Sidecar</th>
<th style="text-align:center">CSI</th>
<th style="text-align:center">Vault Operator</th>
</tr>
</thead>
<tbody>
<tr>
<td>Secret projection</td>
<td style="text-align:center">공유 메모리 볼륨<br />환경 변수*</td>
<td style="text-align:center">임시 디스크<br />환경변수<br />쿠버네티스 시크릿</td>
<td style="text-align:center">쿠버네티스 시크릿<br />쿠버네티스 시크릿 볼륨<br />환경변수</td>
</tr>
<tr>
<td>Secret scope</td>
<td style="text-align:center">전역(Global)</td>
<td style="text-align:center">전역(Global)</td>
<td style="text-align:center">전역(Global)</td>
</tr>
<tr>
<td>Secret types</td>
<td style="text-align:center">모든 볼트 시크릿 엔진<br />(정적 &amp; 동적)</td>
<td style="text-align:center">모든 볼트 시크릿 엔진<br />(정적 &amp; 동적)</td>
<td style="text-align:center">모든 볼트 시크릿 엔진<br />(정적 &amp; 동적)</td>
</tr>
<tr>
<td>Secret templating</td>
<td style="text-align:center">✅</td>
<td style="text-align:center">❌</td>
<td style="text-align:center">베타버전 미지원<br />(GA 버전에서 지원예상)</td>
</tr>
<tr>
<td>Secret size limit</td>
<td style="text-align:center">Vault w/Consul<br />Backend: 512 KB(기본)<br />제한없음<br /><br />Vault w/Integrated Storage<br />Backend: 1MiB(기본)<br />제한없음</td>
<td style="text-align:center">Vault w/Consul<br />Backend: 512 KB(기본)<br />제한없음<br /><br />Vault w/Integrated Storage<br />Backend: 1MiB(기본)<br />제한없음</td>
<td style="text-align:center">Vault w/Consul<br />Backend: 512 KB(기본)<br />제한없음<br /><br />Vault w/Integrated Storage<br />Backend: 1MiB(기본)<br />제한없음</td>
</tr>
<tr>
<td>Secret definitions</td>
<td style="text-align:center">Vault CLI / API / UI</td>
<td style="text-align:center">Vault CLI / API / UI</td>
<td style="text-align:center">Vault CLI / API / UI</td>
</tr>
<tr>
<td>Encryption</td>
<td style="text-align:center">지원(at rest &amp; in-transit)</td>
<td style="text-align:center">지원(at rest &amp; in-transit)</td>
<td style="text-align:center">at-rest : <code v-pre>etcd</code> 저장소 암호화 시<br />in-transit : TLS 사용 시</td>
</tr>
<tr>
<td>Secret rotation</td>
<td style="text-align:center">✅</td>
<td style="text-align:center">❌</td>
<td style="text-align:center">✅</td>
</tr>
<tr>
<td>Secret caching</td>
<td style="text-align:center">✅</td>
<td style="text-align:center">❌</td>
<td style="text-align:center">✅</td>
</tr>
<tr>
<td>Auditability</td>
<td style="text-align:center">✅</td>
<td style="text-align:center">✅</td>
<td style="text-align:center">✅</td>
</tr>
<tr>
<td>Deployment method</td>
<td style="text-align:center">1개의 공유된 K8s 클러스터 서비스<br/>+<br/>1개의 사이드카 컨테이너</td>
<td style="text-align:center">데몬셋</td>
<td style="text-align:center">디플로이먼트</td>
</tr>
<tr>
<td>Vault agent suuport</td>
<td style="text-align:center">✅</td>
<td style="text-align:center">❌</td>
<td style="text-align:center">❌</td>
</tr>
<tr>
<td>Helm support</td>
<td style="text-align:center">✅</td>
<td style="text-align:center">✅</td>
<td style="text-align:center">✅</td>
</tr>
<tr>
<td>Custom Support</td>
<td style="text-align:center">❌</td>
<td style="text-align:center">❌</td>
<td style="text-align:center">✅</td>
</tr>
<tr>
<td>K8s Secrets<br />drift detection<br />and automation<br />remediation</td>
<td style="text-align:center">❌</td>
<td style="text-align:center">❌</td>
<td style="text-align:center">✅</td>
</tr>
</tbody>
</table>
<blockquote>
<p>***** achieved through <a href="https://www.vaultproject.io/docs/platform/k8s/injector/examples#environment-variable-example" target="_blank" rel="noopener noreferrer">Agent templating<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="_8-going-beyond-the-native-kubernetes-secrets" tabindex="-1"><a class="header-anchor" href="#_8-going-beyond-the-native-kubernetes-secrets" aria-hidden="true">#</a> 8. Going Beyond the Native Kubernetes Secrets</h2>
<p>겉으로 보기에 Kubernetes native secrets은 위에 제시된 두 가지 접근 방식과 비슷해 보일 수 있지만, 두 접근 방식에는 큰 차이점이 있다:</p>
<ul>
<li>Kubernetes 시크릿 관리 솔루션이 <em>아닙니다</em>. 기본적으로 시크릿을 지원하지만, 이는 엔터프라이즈 시크릿 관리 솔루션과는 상당히 다르다. Kubernetes 시크릿은 클러스터로만 범위가 제한되며, 많은 애플리케이션은 일부 서비스를 Kubernetes 외부 또는 다른 Kubernetes 클러스터에서 실행한다. 따라서 설계 프로세스의 일부로 시크릿 범위를 고려하는 것이 중요하다. 이러한 애플리케이션이 Kubernetes 환경 외부에서 Kubernetes 시크릿을 사용하도록 하면 번거롭고 인증 및 권한 부여 문제가 발생할 수 있다.</li>
<li>Kubernetes 시크릿은 본질적으로(in nature) 정적(static)이다. 시크릿은 <code v-pre>kubectl</code> 또는 <code v-pre>Kubernetes API</code>를 사용하여 정의할 수 있지만, 일단 정의되면 <code v-pre>etcd</code>에 저장되고 파드를 생성하는 동안에만 파드에 제공된다. 이로 인해 시크릿이 오래되거나, 구식이거나(outdated), 만료되는 시나리오가 발생할 수 있으며, 시크릿을 업데이트하고 회전하기 위해 추가 워크플로우가 필요하고 새 버전의 시크릿을 사용하기 위해 애플리케이션을 다시 배포(re-deploying)해야 한다. 이로 인해 복잡성(complexity)이 가중되고 시간이 낭비될 수 있다. 따라서 디자인 프로세스의 일부로 시크릿의 최신성(freshness), 업데이트 및 순환에 대한 요구 사항을 고려해야 한다.</li>
<li>시크릿 액세스 관리의 보안 모델은 Kubernetes RBAC 모델과 연결되어 있다. 이 모델은 Kubernetes에 익숙하지 않은 사용자에게는 채택하기 어려울 수 있다. 플랫폼에 구애받지 않는(platform-agnostic) 보안 거버넌스 모델을 채택하면 애플리케이션이 실행되는 방식과 위치에 관계없이 애플리케이션에 대한 워크플로우를 채택할 수 있다.</li>
</ul>
<h2 id="_9-summary" tabindex="-1"><a class="header-anchor" href="#_9-summary" aria-hidden="true">#</a> 9. Summary</h2>
<p>Kubernetes에서 시크릿 관리를 위한 설계는 쉬운 일이 아니다. 각각 장단점이 있는 여러 가지 접근 방식이 있다. 이 게시물에 제시된 옵션을 살펴보고 내부를 이해하여 사용 사례에 가장 적합한 옵션을 결정하시길 적극 권장한다.</p>
<h2 id="_10-additional-resources" tabindex="-1"><a class="header-anchor" href="#_10-additional-resources" aria-hidden="true">#</a> 10. Additional Resources</h2>
<ul>
<li><a href="https://medium.com/hashicorp-engineering/hashicorp-vault-delivering-secrets-with-kubernetes-1b358c03b2a3" target="_blank" rel="noopener noreferrer">HashiCorp Vault: Delivering Secrets with Kubernetes<ExternalLinkIcon/></a></li>
<li><a href="https://www.hashicorp.com/blog/vault-secrets-operator-a-new-method-for-kubernetes-integration" target="_blank" rel="noopener noreferrer">Kubernetes Secrets Vault Operator<ExternalLinkIcon/></a></li>
<li><a href="https://github.com/hashicorp/vault-secrets-operator/" target="_blank" rel="noopener noreferrer">Kubernetes Vault Operator Repo<ExternalLinkIcon/></a></li>
<li><a href="https://www.hashicorp.com/blog/retrieve-hashicorp-vault-secrets-with-kubernetes-csi" target="_blank" rel="noopener noreferrer">Retrieve HashiCorp Vault Secrets with Kubernetes CSI<ExternalLinkIcon/></a></li>
<li><a href="https://learn.hashicorp.com/tutorials/vault/kubernetes-secret-store-driver?in=vault/kubernetes" target="_blank" rel="noopener noreferrer">Mount Vault Secrets Through Container Storage Interface (CSI) Volume<ExternalLinkIcon/></a></li>
<li><a href="https://learn.hashicorp.com/tutorials/vault/kubernetes-sidecar" target="_blank" rel="noopener noreferrer">Injecting Secrets into Kubernetes Pods via Vault Agent Containers<ExternalLinkIcon/></a></li>
<li><a href="https://www.vaultproject.io/docs/platform/k8s/injector/annotations" target="_blank" rel="noopener noreferrer">Vault Sidecar Injector Configurations and Examples<ExternalLinkIcon/></a></li>
<li><a href="https://www.vaultproject.io/docs/platform/k8s/csi/configurations" target="_blank" rel="noopener noreferrer">Vault CSI Driver Configurations and Examples<ExternalLinkIcon/></a></li>
</ul>
</div></template>


