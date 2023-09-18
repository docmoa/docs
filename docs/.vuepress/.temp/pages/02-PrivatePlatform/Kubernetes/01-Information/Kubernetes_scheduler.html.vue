<template><div><h1 id="kubernetes-스케쥴러-알고리즘" tabindex="-1"><a class="header-anchor" href="#kubernetes-스케쥴러-알고리즘" aria-hidden="true">#</a> kubernetes 스케쥴러 알고리즘</h1>
<ul>
<li>원본: <a href="https://github.com/kubernetes/community/blob/master/contributors/devel/sig-scheduling/scheduler_algorithm.md" target="_blank" rel="noopener noreferrer">https://github.com/kubernetes/community/blob/master/contributors/devel/sig-scheduling/scheduler_algorithm.md<ExternalLinkIcon/></a></li>
<li>예약되지 않은 각 포드에 대해 Kubernetes 스케줄러는 규칙 집합에 따라 클러스터에서 노드를 찾으려고합니다. Kubernetes 스케줄러에 대한 일반적인 소개는 <a href="http://scheduler.md" target="_blank" rel="noopener noreferrer">scheduler.md<ExternalLinkIcon/></a> 에서 찾을 수 있습니다 . 이 문서에서는 포드의 노드를 선택하는 방법에 대한 알고리즘을 설명합니다. 포드의 대상 노드를 선택하기 전에 두 단계가 있습니다. 첫 번째 단계는 모든 노드를 필터링하고 두 번째 단계는 나머지 노드의 순위를 매겨 포드에 가장 적합한 것을 찾는 것입니다.</li>
</ul>
<h2 id="노드-필터링" tabindex="-1"><a class="header-anchor" href="#노드-필터링" aria-hidden="true">#</a> 노드 필터링</h2>
<ul>
<li>
<p>노드를 필터링하는 목적은 포드의 특정 요구 사항을 충족하지 않는 노드를 필터링하는 것입니다. 예를 들어 노드의 사용 가능한 리소스 (노드에서 이미 실행 된 모든 Pod의 리소스 요청 합계를 뺀 용량으로 측정)가 Pod의 필수 리소스보다 적은 경우 순위에서 노드를 고려해서는 안됩니다. 단계로 필터링됩니다. 현재 다음을 포함하여 서로 다른 필터링 정책을 구현하는 여러 &quot;술어&quot;가 있습니다.</p>
<ul>
<li>NoDiskConflict: 포드가 요청한 볼륨과 이미 마운트 된 볼륨으로 인해 포드가 맞을 수 있는지 평가합니다. 현재 지원되는 볼륨은 AWS EBS, GCE PD, ISCSI 및 Ceph RBD입니다. 지원되는 유형에 대한 영구 볼륨 클레임 만 확인됩니다. 포드에 직접 추가 된 영구 볼륨은 평가되지 않으며이 정책에 의해 제한되지 않습니다.</li>
<li>NoVolumeZoneConflict: 영역 제한을 고려하여 포드가 요청하는 볼륨을 노드에서 사용할 수 있는지 평가합니다.</li>
<li>PodFitsResources: 여유 리소스 (CPU 및 메모리)가 Pod 요구 사항을 충족하는지 확인합니다. 여유 리소스는 용량에서 노드에있는 모든 포드의 요청 합계를 뺀 값으로 측정됩니다. Kubernetes의 리소스 QoS에 대해 자세히 알아 보려면 QoS 제안을 확인하세요 .</li>
<li>PodFitsHostPorts: Pod에 필요한 HostPort가 이미 노드에서 사용 중인지 확인합니다.</li>
<li>HostName: PodSpec의 NodeName 필드에 지정된 노드를 제외한 모든 노드를 필터링합니다.</li>
<li>MatchNodeSelector: 노드의 라벨이 Pod의 nodeSelector필드에 지정된 라벨 과 일치 nodeAffinity하는지, Kubernetes v1.2부터 존재 하는 경우 에도 일치 하는지 확인합니다. 둘 다에 대한 자세한 내용 은 여기 를 참조 하십시오 .</li>
<li>MaxEBSVolumeCount: 연결된 ElasticBlockStore 볼륨의 수가 최대 값을 초과하지 않는지 확인합니다 (Amazon은 루트 볼륨 용으로 예약 된 40 개 중 하나를 사용하여 최대 40 개를 권장하므로 기본적으로 39 개입니다 . Amazon 설명서 참조 ). 최대 값은 KUBE_MAX_PD_VOLS환경 변수 를 설정하여 제어 할 수 있습니다 .</li>
<li>MaxGCEPDVolumeCount: 연결된 GCE PersistentDisk 볼륨의 수가 최대 값을 초과하지 않는지 확인합니다 (기본적으로 GCE에서 허용하는 최대 값 인 16 ). GCE 설명서 참조 최대 값은 KUBE_MAX_PD_VOLS환경 변수 를 설정하여 제어 할 수 있습니다 .</li>
<li>CheckNodeMemoryPressure: 메모리 부족 상태를보고하는 노드에서 포드를 예약 할 수 있는지 확인합니다. 현재 BestEffortkubelet에 의해 자동으로 제거되므로 메모리 부족 상태에서 노드에 포드를 배치해서는 안됩니다.</li>
<li>CheckNodeDiskPressure: 디스크 압력 상태를보고하는 노드에서 포드를 예약 할 수 있는지 확인합니다. 현재 kubelet에 의해<br>
자동으로 제거되므로 디스크 압력이있는 노드에 포드를 배치해서는 안됩니다.<br>
위 술어의 세부 사항은 pkg / scheduler / algorithm / predicates / predicates.go 에서 찾을 수 있습니다 . 위에서 언급 한 모든 술어를 조합하여 정교한 필터링 정책을 수행 할 수 있습니다. Kubernetes는 기본적으로 이러한 술어 중 일부만 사용합니다. pkg / scheduler / algorithmprovider / defaults / defaults.go 에서 기본적으로 사용되는 항목을 확인할 수 있습니다 .</li>
</ul>
</li>
</ul>
<h2 id="노드-순위-지정" tabindex="-1"><a class="header-anchor" href="#노드-순위-지정" aria-hidden="true">#</a> 노드 순위 지정</h2>
<ul>
<li>필터링 된 노드는 Pod를 호스팅하는 데 적합한 것으로 간주되며 두 개 이상의 노드가 남아있는 경우가 많습니다. Kubernetes는 나머지 노드의 우선 순위를 지정하여 포드에 가장 적합한 노드를 찾습니다. 우선 순위 지정은 일련의 우선 순위 기능에 의해 수행됩니다. 나머지 각 노드에 대해 우선 순위 함수는 &quot;가장 선호&quot;를 나타내는 10과 &quot;최저 선호&quot;를 나타내는 0으로 0에서 10까지의 점수를 제공합니다. 각 우선 순위 함수는 양수로 가중치가 부여되고 각 노드의 최종 점수는 모든 가중치를 합산하여 계산됩니다. 예를 들어, 두 개의 우선 순위 기능이 있습니다 가정 priorityFunc1및 priorityFunc2가중 요인 weight1과 weight2각각은, 일부 NodeA에의 최종 점수는 다음과 같습니다</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>finalScoreNodeA = (weight1 * priorityFunc1) + (weight2 * priorityFunc2)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>모든 노드의 점수가 계산 된 후 점수가 가장 높은 노드가 포드의 호스트로 선택됩니다. 동일한 최고 점수를 가진 노드가 두 개 이상있는 경우 그중에서 임의의 노드가 선택됩니다.</p>
</li>
<li>
<p>현재 Kubernetes 스케줄러는 다음과 같은 실용적인 우선 순위 기능을 제공합니다.</p>
<ul>
<li>LeastRequestedPriority: 노드는 새 Pod가 노드에 예약 된 경우 무료가 될 노드 비율을 기준으로 우선 순위가 지정됩니다. (즉, (용량-노드에 이미있는 모든 포드의 요청 합계-예약중인 포드의 요청) / 용량). CPU와 메모리의 가중치는 동일합니다. 자유 비율이 가장 높은 노드가 가장 선호됩니다. 이 우선 순위 함수는 리소스 소비와 관련하여 노드에 Pod를 분산시키는 효과가 있습니다.</li>
<li>BalancedResourceAllocation:이 우선 순위 함수는 Pod가 배포 된 후 CPU 및 메모리 사용률이 균형을 이루도록 노드에 Pod를 배치하려고합니다.</li>
<li>SelectorSpreadPriority: 동일한 노드에서 동일한 서비스, 복제 컨트롤러 또는 복제본 세트에 속하는 Pod 수를 최소화하여 Pod를 분산합니다. 노드에 영역 정보가있는 경우 포드가 영역과 노드에 분산되도록 우선 순위가 조정됩니다.</li>
<li>CalculateAntiAffinityPriority: 특정 라벨에 대해 동일한 값을 가진 노드에서 동일한 서비스에 속하는 Pod 수를 최소화하여 Pod를 분산합니다.</li>
<li>ImageLocalityPriority: 포드에서 요청한 이미지의 위치에 따라 노드의 우선 순위가 지정됩니다. 팟 (Pod)에 필요한 이미 설치된 패키지의 크기가 더 큰 노드는 팟 (Pod)에 필요한 이미 설치된 패키지가없는 노드 또는 팟 (Pod)에 필요한 이미 설치된 패키지의 작은 총 크기보다 선호됩니다.</li>
<li>NodeAffinityPriority: (Kubernetes v1.2) preferredDuringSchedulingIgnoredDuringExecution노드 선호도를 구현 합니다. 자세한 내용 은 여기 를 참조하십시오.<br>
위의 우선 순위 기능에 대한 자세한 내용은 pkg / scheduler / algorithm / priorities 에서 찾을 수 있습니다 . Kubernetes는 기본적으로 이러한 우선 순위 기능 중 일부를 사용하지만 전부는 아닙니다. pkg / scheduler / algorithmprovider / defaults / defaults.go 에서 기본적으로 사용되는 항목을 확인할 수 있습니다 . 술어와 유사하게, 위의 우선 순위 기능을 결합하고 원하는대로 가중치 요소 (양수)를 할당 할 수 있습니다 ( 사용자 정의 방법은 <a href="http://scheduler.md" target="_blank" rel="noopener noreferrer">scheduler.md<ExternalLinkIcon/></a> 확인 ).</li>
</ul>
</li>
</ul>
</div></template>


