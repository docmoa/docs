<template><div><h1 id="container-runtimes-비교-표" tabindex="-1"><a class="header-anchor" href="#container-runtimes-비교-표" aria-hidden="true">#</a> Container Runtimes 비교 표</h1>
<blockquote>
<p>update : 2021. 12. 23.</p>
</blockquote>
<table>
<thead>
<tr>
<th></th>
<th><strong>CRI-O</strong></th>
<th><strong>Containerd CRI plugin</strong></th>
<th><strong>Docker Engine</strong></th>
<th><strong>gVisor CRI plugin</strong></th>
<th><strong>CRI-O Kata Containers</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>sponsors</td>
<td>CNCF</td>
<td>CNCF</td>
<td>Docker Inc</td>
<td>Google</td>
<td>Intel</td>
</tr>
<tr>
<td>started</td>
<td>2016</td>
<td>2015</td>
<td>Mar 2013</td>
<td>2015</td>
<td>2017</td>
</tr>
<tr>
<td>version</td>
<td>1.23</td>
<td>1.19</td>
<td>20.10</td>
<td>release-20211129.0</td>
<td>1.13</td>
</tr>
<tr>
<td>runtime</td>
<td>runc (default)</td>
<td>containerd managing runc</td>
<td>runc</td>
<td>runsc</td>
<td>kata-runtime</td>
</tr>
<tr>
<td>kernel</td>
<td>shared</td>
<td>shared</td>
<td>shared</td>
<td>partially shared</td>
<td>isolated</td>
</tr>
<tr>
<td>syscall filtering</td>
<td>no</td>
<td>no</td>
<td>no</td>
<td>yes</td>
<td>no</td>
</tr>
<tr>
<td>kernel blobs</td>
<td>no</td>
<td>no</td>
<td>no</td>
<td>no</td>
<td>yes</td>
</tr>
<tr>
<td>footprint</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>-</td>
<td>30mb</td>
</tr>
<tr>
<td>start time</td>
<td>&lt;10ms</td>
<td>&lt;10ms</td>
<td>&lt;10ms</td>
<td>&lt;10ms</td>
<td>&lt;100ms</td>
</tr>
<tr>
<td>io performance</td>
<td>host performance</td>
<td>host performance</td>
<td>host performance</td>
<td>slow</td>
<td>host performance</td>
</tr>
<tr>
<td>network performance</td>
<td>host performance</td>
<td>host performance</td>
<td>host performance</td>
<td>slow (see comment)</td>
<td>close to host performance</td>
</tr>
<tr>
<td>Docs</td>
<td><a href="https://github.com/kubernetes-sigs/cri-o/" target="_blank" rel="noopener noreferrer">https://github.com/kubernetes-sigs/cri-o/<ExternalLinkIcon/></a></td>
<td><a href="https://github.com/containerd/cri" target="_blank" rel="noopener noreferrer">https://github.com/containerd/cri<ExternalLinkIcon/></a></td>
<td><a href="https://github.com/moby/moby" target="_blank" rel="noopener noreferrer">https://github.com/moby/moby<ExternalLinkIcon/></a></td>
<td><a href="https://github.com/google/gvisor" target="_blank" rel="noopener noreferrer">https://github.com/google/gvisor<ExternalLinkIcon/></a></td>
<td><a href="https://github.com/kata-containers/runtime" target="_blank" rel="noopener noreferrer">https://github.com/kata-containers/runtime<ExternalLinkIcon/></a></td>
</tr>
<tr>
<td>장점</td>
<td>경량의 쿠버네티스 전용 Docker 데몬이 필요하지 않음 OpenShift의 기본 컨테이너 런타임 아마도 최고의 컨테이너 기본 런타임</td>
<td>최신 Docker Engine과 함께 기본적으로 설치됨 Kubernetes는 ContainerD를 직접 사용할 수 있으며, Docker또한 동일한 호스트에서 직접 사용할 수도 있음  DockerD 데몬을 실행할 필요가 없음</td>
<td>방대한 수의 사용자가 테스트하고 반복 한 가장 성숙한 런타임 seccomp, SELinux 및 AppArmor를 사용하여 강화할 수 있음 가장 빠른 시작 시간  메모리 사용량이 가장 적음</td>
<td>gcloud appengine에서 고객 간의 격리 계층으로 사용함 상태를 저장하지 않는 웹 앱에 적합 표준 컨테이너에 두 개의 보안 계층을 추가함</td>
<td>아마도 가장 안전한 옵션 보안에 대한 주요 절충안으로 오버헤드가 발생하는것은 그렇게 나쁘지 않은 것으로 보임</td>
</tr>
<tr>
<td>단점</td>
<td>Docker Engine이 같고 있는 동일한 보안 이슈를 가지고 있음 보안정책을 별도로 관리해야 함</td>
<td>This is slightly newer as it has been through a few iterations of being installed differently.</td>
<td>Kubernetes는 <strong>CRI 플러그인 아키텍처로 이동하고 있음</strong> 보안을 강화하고 관리하는것은 너무 복잡함</td>
<td>버전이 지정되지 않았으며 아직 Kubernetes에서 프로덕션에 사용해서는 안됨 많은 syscall을 만드는 응용 프로그램에는 적합하지 않음 400 개 Linux syscall이 모두 구현되어 일부 앱이 작동하지 않을 수 있음 (예 : postgres).</td>
<td>kata-runtime 자체는 v1이지만 이것이 Kubernetes 상에서 어떻게 준비 되어 있는지  확인이 필요 30MB 메모리 오버 헤드로 인한 비효율적 패킹 시작 시간</td>
</tr>
</tbody>
</table>
</div></template>


