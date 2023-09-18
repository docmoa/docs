<template><div><h1 id="openshift-3-11-custom-metric-with-jboss" tabindex="-1"><a class="header-anchor" href="#openshift-3-11-custom-metric-with-jboss" aria-hidden="true">#</a> OpenShift 3.11 - Custom metric with JBoss</h1>
<blockquote>
<p>Autoscaling applications using custom metrics on OpenShift Container Platform 3.11 with JBoss EAP or Wildfly</p>
</blockquote>
<p>Red Hat OpenShift Container Platform 3.11 (OCP) 은 기본적으로 CPU에 대한 애플리케이션 자동 확장을 지원합니다. 추가적으로 <code v-pre>apis/autoscaling/v2beta1</code>를 활성화하여 <a href="#2-Memory-based-HPA">Memory의 메트릭을 기반으로 한 기능</a>도 지원 합니다. CPU나 Memory의 경우 애플리케이션에 종속되지 않은 기본적인 메트릭이나, 때로는 추가적인 메트릭 요소를 기반으로 확장할 필요성이 있습니다.</p>
<p>Prometheus Adaptor를 사용하면 기본 메트릭 외에도 사용자가 지정한 애플리케이션의 메트릭을 기반으로 자동확장하는 기능을 추가 할 수 있습니다.</p>
<blockquote>
<p>Prometheus Adaptor는 OCP 4.1 부터 에서 Tech Preview 대상이 되었습니다. 기능이 완전해지면 정식 지원상태로 변경 될 것입니다.</p>
</blockquote>
<p>Prometheus Adaptor는 <code v-pre>custom.metrics.k8s.io</code> API를 구현하여 Prometheus에 연결합니다. Prometheus에서 수집되는 메트릭 기반으로 Horizontal Pod Autoscaler (HPA)가 쿼리하여 애플리케이션 메트릭을 검색할 수 있습니다.</p>
<p>이글은 다음의 과정을 안내 합니다.</p>
<ol>
<li>JBoss EAP 애플리케이션 샘플과 JMX exporter</li>
<li>OCP 3.11에 Operator를 사용하여 Prometheus를 배포</li>
<li>Prometheus Adapter 설정</li>
</ol>
<p>각 내용의 상세 정보는 <a href="#1-%EC%B0%B8%EA%B3%A0-%EC%9E%90%EB%A3%8C"><strong>참고 자료</strong></a>의 내용이 도움이 됩니다.</p>
<h2 id="준비-사항-및-조건" tabindex="-1"><a class="header-anchor" href="#준비-사항-및-조건" aria-hidden="true">#</a> 준비 사항 및 조건</h2>
<ul>
<li>OpenShift 3.11 클러스터</li>
<li>리소스 생성 권한이 있는 <code v-pre>cluster-admin</code> 권한이 있는 계정</li>
<li>리소스 생성 방법을 포함한 OpenShift 기본 지식</li>
<li>Kubernetes 에 대한 기본 지식</li>
</ul>
<h2 id="openshift-3-11-operator-환경-구성" tabindex="-1"><a class="header-anchor" href="#openshift-3-11-operator-환경-구성" aria-hidden="true">#</a> OpenShift 3.11 Operator 환경 구성</h2>
<p>OpenShift Container Platform 3.11 환경에 Operator를 활성화 하기 위한 작업을 수행합니다. 기존에 이미 Operator 구성을 설치 한경우 해당 과정을 넘어갑니다.</p>
<ul>
<li>
<p>OCP 3.11 설치를 진행한 hosts 파일의 <code v-pre>[OSEv3:vars]</code>항목에 다음을 추가</p>
<ul>
<li>
<p><code v-pre>registry.connect.redhat.com</code>에 접속하기 위한 계정 정보가 필요</p>
</li>
<li>
<p><a href="#3-Registry-account">계정을 외부로 노출시키지 않기 위한 방법 참고</a></p>
</li>
</ul>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code>openshift_additional_registry_credentials=<span class="token punctuation">[</span><span class="token punctuation">{</span>'host'<span class="token punctuation">:</span><span class="token string">'registry.connect.redhat.com'</span><span class="token punctuation">,</span>'user'<span class="token punctuation">:</span><span class="token string">'&lt;your_user_name>'</span><span class="token punctuation">,</span>'password'<span class="token punctuation">:</span><span class="token string">'&lt;your_password>'</span><span class="token punctuation">,</span>'test_image'<span class="token punctuation">:</span><span class="token string">'mongodb/enterprise-operator:0.3.2'</span><span class="token punctuation">}</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>registry 추가를 위한 Ansible playbook 실행</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token builtin class-name">cd</span> /usr/share/ansible/openshift-ansible
$ ansible-playbook <span class="token parameter variable">-i</span> <span class="token operator">&lt;</span>inventory_file<span class="token operator">></span> playbooks/updates/registry_auth.yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Operator framework 설치를 위한 Ansible playbook 실행</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token builtin class-name">cd</span> /usr/share/ansible/openshift-ansible
$ ansible-playbook <span class="token parameter variable">-i</span> <span class="token operator">&lt;</span>inventory_file<span class="token operator">></span> playbooks/olm/config.yml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<p>Operator framework가 설치되면 Cluster Console 에서 좌측 메뉴에 추가된 <code v-pre>Operators</code> 를 확인 할 수 있습니다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/operator.png" alt="image-20200129150607944" tabindex="0" loading="lazy"><figcaption>image-20200129150607944</figcaption></figure>
<h2 id="애플리케이션-샘플과-jmx-exporter" tabindex="-1"><a class="header-anchor" href="#애플리케이션-샘플과-jmx-exporter" aria-hidden="true">#</a> 애플리케이션 샘플과 JMX exporter</h2>
<p>JMX export는 Prometheus로 Java 기반의 애플리케이션에서 수집 가능한 JMX의 mBean을 전달가능하도록 하는 수집기 입니다. Java 애플리케이션과 함께 실행되며 HTTP 엔드포인트를 노출시켜 JVM의 메트릭 정보를 제공합니다.</p>
<p>JMX export를 javaagent 방식으로 적용하면 애플리케이션에 별도의 수정이나 추가 코딩 없이 JMX로 수집되는 mBean 값들을 노출 시킬 수 있습니다.</p>
<p>다음의 샘플 애플리케이션을 기반으로 설명합니다.</p>
<p><a href="https://github.com/Great-Stone/webapp" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/webapp<ExternalLinkIcon/></a></p>
<h2 id="jboss-eap-배포" tabindex="-1"><a class="header-anchor" href="#jboss-eap-배포" aria-hidden="true">#</a> JBoss EAP 배포</h2>
<p>애플리케이션 구조는 다음과 같습니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>webapp
├ configuration
│	├ standalone-openshift.xml
│	└ jmx_exporter_conf.yaml
├ modules
│	└ jmx_prometheus_javaagent-0.12.0.jar
└ ROOT.war
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Red Hat에서 제공되는 JBoss EAP는 S2I 빌드 배포를 지원합니다. 애플리케이션 소스 또는 바이너리를 별도의 이미지 빌드(e.g. Docker build) 없이 바로 OpenShift 상에서 사용 가능한 컨테이너 이미지로 빌드하는 기능입니다.</p>
<ul>
<li>root 또는 deployment 디렉토리 내의 바이너리는 JBoss EAP 의 deployments 디렉토리로 복사되어 빌드 됩니다.</li>
<li>configuration 디렉토리 내의 파일은 JBoss EAP 의 configuration 디렉토리로 복사되어 빌드 됩니다. 일반적으로 JBoss EAP의 기본 standalone.xml은 해당 S2I이미지 내에서는 standalone-openshift.xml로 대체되었습니다. configuration 디렉토리에 해당 xml 파일을 위치시키면 사용자 정의 xml을 사용할 수 있습니다.<br>
이같은 특징을 이용하여 jmx-exporter에서 읽어들일 yaml 파일인 <code v-pre>jmx_exporter_conf.yaml</code> 파일을 해당 디렉토리에 위치시켜 S2I 빌드시 빌드 이미지 내에 복사되도록 합니다.</li>
<li>modules 디렉토리는 JBoss에서 사용할 module 라이브러리를 추가 할 수 있도록 복사해주는 위치 입니다. <code v-pre>jmx_prometheus_javaagent-0.12.0.jar</code> 를 빌드 시 이미지 내부에 복사 할 수 있도록 해당 디렉토리내에 위치시킵니다.</li>
</ul>
<h3 id="jmx-exporter-conf-yaml" tabindex="-1"><a class="header-anchor" href="#jmx-exporter-conf-yaml" aria-hidden="true">#</a> jmx_exporter_conf.yaml</h3>
<p><code v-pre>jmx_exporter_conf.yaml</code> 에서 예시로 설정한 내용은 다음과 같습니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token punctuation">---</span>
<span class="token key atrule">startDelaySeconds</span><span class="token punctuation">:</span> <span class="token number">30</span>
<span class="token key atrule">lowercaseOutputName</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">lowercaseOutputLabelNames</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
<span class="token key atrule">whitelistObjectNames</span><span class="token punctuation">:</span> 
  <span class="token punctuation">-</span> <span class="token string">"jboss.as:subsystem=request-controller"</span>
<span class="token key atrule">rules</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">pattern</span><span class="token punctuation">:</span> <span class="token string">"^jboss.as&lt;subsystem=request-controller>&lt;>(active_.+|max_.+): (.*)"</span>
    <span class="token key atrule">attrNameSnakeCase</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> jboss_$1
    <span class="token key atrule">help</span><span class="token punctuation">:</span> <span class="token string">"jboss Request Controller : $1"</span>
    <span class="token key atrule">labels</span><span class="token punctuation">:</span>
      <span class="token key atrule">namespace</span><span class="token punctuation">:</span> <span class="token string">'my-eap-project'</span>
      <span class="token key atrule">pod</span><span class="token punctuation">:</span> <span class="token string">'sample-eap'</span>
      <span class="token key atrule">service</span><span class="token punctuation">:</span> <span class="token string">'sample-eap'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>Name</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>whitelistObjectNames</td>
<td><code v-pre>&quot;jboss.as:subsystem=request-controller&quot;</code>의 경우 mBean 값을 기준으로 확인 가능합니다. jconsole이나 jvisualVM 툴을 사용하여 확인 가능하며, 필요시 로컬이나 리모트의 JBoss EAP / Wildfly에서 원하는 값 정의 가능</td>
</tr>
<tr>
<td>pattern</td>
<td>mBean ObjectName의 Attribute 값의 패턴을 정의 합니다. 단일 또는 복수의 Name을 정의 가능</td>
</tr>
<tr>
<td>name</td>
<td>jmx_exporter 에서 표기할 이름 규칙을 설정</td>
</tr>
<tr>
<td>labels</td>
<td>OpenShift 환경에서 식별할 수 있는 label을 추가합니다. namespace, pod, service 는 기본 JMX exporter로는 수집되지 않으므로 해당 애플리케이션이 배포될 OpenShift 환경에 맞춰 설정</td>
</tr>
</tbody>
</table>
<p>기타 상세 옵션은 다음의 url에서 확인 가능합니다.</p>
<p><a href="https://github.com/prometheus/jmx_exporter#configuration" target="_blank" rel="noopener noreferrer">https://github.com/prometheus/jmx_exporter#configuration<ExternalLinkIcon/></a></p>
<h3 id="jboss-eap-wildfly-배포" tabindex="-1"><a class="header-anchor" href="#jboss-eap-wildfly-배포" aria-hidden="true">#</a> JBoss EAP / Wildfly 배포</h3>
<ul>
<li>
<p>OpenShift Application Console에서 작업 진행</p>
</li>
<li>
<p>배포 할 프로젝트를 생성 (e.g. my-eap-project)</p>
</li>
<li>
<p>해당 프로젝트를 선택 후 좌측 메뉴의 Catalog를 선택</p>
</li>
<li>
<p><code v-pre>JBoss EAP 7.2</code>를 선택</p>
<ul>
<li>Information <code v-pre>Next&gt;</code> 클릭</li>
<li>Configuration (앞서 <code v-pre>jmx_exporter_conf.yaml</code>의 레이블 설정 참고)
<ul>
<li>Application Name: sample-eap</li>
<li>Git Repository URL: <a href="https://github.com/Great-Stone/webapp.git" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/webapp.git<ExternalLinkIcon/></a></li>
<li>Git Reference: master</li>
<li>Context Directory: (Blank)</li>
<li>Labels
<ul>
<li>app : sample-eap</li>
</ul>
</li>
<li><code v-pre>Create</code> 버튼 클릭</li>
</ul>
</li>
<li>Results
<ul>
<li>생성 확인 후 <code v-pre>Close</code> 버튼 클릭</li>
</ul>
</li>
</ul>
</li>
<li>
<p>좌측 메뉴에서  <code v-pre>Builds</code>클릭 후 생성한 <code v-pre>sample-eap</code> 확인</p>
</li>
<li>
<p>좌측 메뉴에서 <code v-pre>Applications</code> &gt; <code v-pre>Deployments</code> 클릭 후 생성된 Deployment Config  <code v-pre>sample-eap</code>  클릭</p>
<ul>
<li>
<p>Environment 탭을 선택하고 다음을 추가하고 하단 <code v-pre>Save</code> 버튼 클릭</p>
<table>
<thead>
<tr>
<th>Name</th>
<th>Value</th>
</tr>
</thead>
<tbody>
<tr>
<td>JAVA_OPTS_APPEND</td>
<td>-javaagent:/opt/eap/modules/jmx_prometheus_javaagent-0.12.0.jar=58080:/opt/eap/standalone/configuration/jmx_exporter_conf.yaml</td>
</tr>
</tbody>
</table>
<ul>
<li>
<p><code v-pre>JAVA_OPTS_APPEND</code> 환경 변수에 값을 기입하면 해당 JBoss EAP 7.2 S2I 빌드 시 실행되는 서버의 Java Option 값 뒤에 해당 값이 추가됨</p>
</li>
<li>
<p><code v-pre>javaagent</code>로 빌드시 해당 컨테이너 이미지 내부로 복사된 <code v-pre>modules</code> 디렉토리의 <code v-pre>jmx_prometheus_javaagent-0.12.0.jar</code>를 지정하고 <code v-pre>=58080</code>은 엔드포인트 포트를 정의</p>
</li>
<li>
<p>추가로 컨테이너 이미지 내부로 복사된 <code v-pre>configuration</code> 디렉토리의 설정 파일인 <code v-pre>jmx_exporter_conf.yaml</code>을 정의</p>
</li>
</ul>
</li>
<li>
<p>우측 상단의 <code v-pre>Actions</code> &gt; <code v-pre>Edit YAML</code>을 클릭하여 <code v-pre>spec &gt; template &gt; metadata &gt; annotations</code>에 <code v-pre>prometheus.io/scrape: 'true'</code>를 추가하고 하단의 <code v-pre>Save</code> 버튼 클릭</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps.openshift.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> DeploymentConfig
<span class="token punctuation">...</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token punctuation">...</span>
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
        <span class="token key atrule">prometheus.io/scrape</span><span class="token punctuation">:</span> <span class="token string">'true'</span>
      <span class="token key atrule">creationTimestamp</span><span class="token punctuation">:</span> <span class="token null important">null</span>
      <span class="token punctuation">...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</li>
<li>
<p>좌측 메뉴에서 <code v-pre>Applications</code> &gt; <code v-pre>Services</code> 클릭 후 생성된 Service  <code v-pre>sample-eap</code>  클릭</p>
<ul>
<li>
<p>우측 상단의 <code v-pre>Actions</code> &gt; <code v-pre>Edit YAML</code>을 클릭하여 <code v-pre>prometheus.io/scrape: &quot;true&quot;</code> 항목과 export를 위한 port를 추가하고 하단 <code v-pre>Save</code> 버튼을 클릭하여 저장합니다. port는 eap를 위한 서비스를 위한 port와 exporter를 위한 port 두개가 필요함</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">description</span><span class="token punctuation">:</span> The web server's http port.
    <span class="token key atrule">prometheus.io/scrape</span><span class="token punctuation">:</span> <span class="token string">'true'</span>
  <span class="token punctuation">...</span>
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token punctuation">...</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> eap
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8080</span>
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">8080</span>
    <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> exporter
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">58080</span>
      <span class="token key atrule">protocol</span><span class="token punctuation">:</span> TCP
      <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">58080</span>
  <span class="token punctuation">...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>Service에 새로운 포트를 추가하면 기존 route를 올바른 포트에 연결하고, exporter의 데이터 확인을 위한 새로운 route를 다음 단계에서 추가</p>
</li>
</ul>
</li>
<li>
<p>좌측 메뉴에서 <code v-pre>Applications</code> &gt; <code v-pre>Routes</code> 클릭 후 생성된 route <code v-pre>sample-eap</code>  클릭</p>
<ul>
<li>우측 상단의 <code v-pre>Actions</code> &gt; <code v-pre>Edit</code>을 클릭 하고 <code v-pre>Target Port</code>를 <code v-pre>8080→8080(TCP)</code>임을 확인 후 하단 <code v-pre>Save</code>버튼 클릭</li>
<li>다시 Routes 목록 화면으로 이동하여 우측 상단의 <code v-pre>Create Route</code> 클릭하여 다음을 설정하고 하단 <code v-pre>Save</code>버튼 클릭
<ul>
<li>Name: sample-eap-exporter</li>
<li>Target Port: 58080→58080(TCP)</li>
<li>Security(선택사항)
<ul>
<li>Secure route: Checked</li>
<li>TLS Termination: Edge</li>
<li>Insecure Traffic: None</li>
</ul>
</li>
</ul>
</li>
</ul>
</li>
<li>
<p>JMX exporter가 적용되었는지 확인을 위해 사로 생성한 <code v-pre>sample-eap-exporter</code>의 Hostname을 클릭하여 정보 확인</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token operator">...</span>
# <span class="token constant">HELP</span> jboss_active_requests jboss Request Controller <span class="token operator">:</span> active_requests
# <span class="token constant">TYPE</span> jboss_active_requests untyped
jboss_active_requests<span class="token punctuation">{</span>namespace<span class="token operator">=</span><span class="token string">"my-eap-project"</span><span class="token punctuation">,</span>pod<span class="token operator">=</span><span class="token string">"sample-eap"</span><span class="token punctuation">,</span>service<span class="token operator">=</span><span class="token string">"sample-eap"</span><span class="token punctuation">,</span><span class="token punctuation">}</span> <span class="token number">0.0</span>
# <span class="token constant">HELP</span> jboss_max_requests jboss Request Controller <span class="token operator">:</span> max_requests
# <span class="token constant">TYPE</span> jboss_max_requests untyped
jboss_max_requests<span class="token punctuation">{</span>namespace<span class="token operator">=</span><span class="token string">"my-eap-project"</span><span class="token punctuation">,</span>pod<span class="token operator">=</span><span class="token string">"sample-eap"</span><span class="token punctuation">,</span>service<span class="token operator">=</span><span class="token string">"sample-eap"</span><span class="token punctuation">,</span><span class="token punctuation">}</span> <span class="token operator">-</span><span class="token number">1.0</span>
<span class="token operator">...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>jmx_exporter_conf.yaml</code>에서 정의한 JMX 내용이 표기되는지 확인</li>
<li>예제에서는 <code v-pre>jboss_</code>를 prefix로 정의하였고 <code v-pre>active_*</code>, <code v-pre>max_*</code> 항목의 Attribute 데이터를 표기</li>
<li>데이터의 label인 namespace, pod, service가 표기되는지 확인</li>
</ul>
</li>
</ul>
<h2 id="setting-up-prometheus" tabindex="-1"><a class="header-anchor" href="#setting-up-prometheus" aria-hidden="true">#</a> Setting up Prometheus</h2>
<p>Operator framework를 활용하여 애플리케이션을 모니터링 하도록 설정할 수 있습니다. 각 yaml로 작성된 설정은 CLI 또는 OpenShift Console 상에서 진행 할 수 있습니다. 적용하는 각 방법은 <a href="#4-OpenShift%EC%97%90-%EB%A6%AC%EC%86%8C%EC%8A%A4-%EB%B0%B0%ED%8F%AC">OpenShift에 리소스 배포</a> 를 참고하세요.</p>
<p>Prometheus 구성요소를 배포하기 위해 프로젝트를 구성합니다. 여기서는 <code v-pre>custom-metric</code> 프로젝트에서 진행합니다.</p>
<h3 id="_1-operator-subscription-생성" tabindex="-1"><a class="header-anchor" href="#_1-operator-subscription-생성" aria-hidden="true">#</a> 1) Operator subscription 생성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ oc create <span class="token parameter variable">-f</span> - <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  generateName: prometheus-
  namespace: custom-metric
spec:
  source: rh-operators
  name: prometheus
  startingCSV: prometheusoperator.0.22.2
  channel: preview
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-service-monitor-생성" tabindex="-1"><a class="header-anchor" href="#_2-service-monitor-생성" aria-hidden="true">#</a> 2) Service monitor 생성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>oc apply <span class="token parameter variable">-f</span> - <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: sample-app
  labels:
    app: sample-app
  namespace: prometheus-metric
spec:
  selector:
    matchLabels:
      app: sample-app
    namespaceSelector:
      matchNames:
        - my-eap-project
  endpoints:
    - port: exporter
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-prometheus-operator가-제공하는-사용자-정의-오브젝트-생성" tabindex="-1"><a class="header-anchor" href="#_3-prometheus-operator가-제공하는-사용자-정의-오브젝트-생성" aria-hidden="true">#</a> 3) Prometheus Operator가 제공하는 사용자 정의 오브젝트 생성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>oc apply <span class="token parameter variable">-f</span> - <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: monitoring.coreos.com/v1
kind: Prometheus
metadata:
  name: example
  labels:
    prometheus: k8s
  namespace: prometheus-metric
spec:
  replicas: 1
  version: v2.3.2
  serviceAccountName: prometheus-k8s
  securityContext: {}
  serviceMonitorSelector:
    matchLabels:
      app: sample-app
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-prometheus-adapter가-쿼리-할-수-있도록-prometheus-pod를-서비스를-작성" tabindex="-1"><a class="header-anchor" href="#_4-prometheus-adapter가-쿼리-할-수-있도록-prometheus-pod를-서비스를-작성" aria-hidden="true">#</a> 4) Prometheus Adapter가 쿼리 할 수 있도록 Prometheus Pod를 서비스를 작성</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ oc apply <span class="token parameter variable">-f</span> - <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: v1
kind: Service
metadata:
  name: prometheus
spec:
  ports:
  - name: web
    port: 9090
    protocol: TCP
    targetPort: web
  selector:
    prometheus: example
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="prometheus-adapter-setup" tabindex="-1"><a class="header-anchor" href="#prometheus-adapter-setup" aria-hidden="true">#</a> Prometheus Adapter setup</h2>
<p>Prometheus가 설정된 상태에서 다음 리소스에 대한 설정을 추가하여 Prometheus Adopter 설정합니다. RBAC 접근제어, Adapter 구성, API 확장, Deployment 항목들이 포함되어있습니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>apiserver
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>metric
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>server<span class="token punctuation">-</span>resources
<span class="token key atrule">rules</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">apiGroups</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> custom.metrics.k8s.io
  <span class="token key atrule">resources</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"*"</span><span class="token punctuation">]</span>
  <span class="token key atrule">verbs</span><span class="token punctuation">:</span> <span class="token punctuation">[</span><span class="token string">"*"</span><span class="token punctuation">]</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>resource<span class="token punctuation">-</span>reader
<span class="token key atrule">rules</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">apiGroups</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token string">""</span>
  <span class="token key atrule">resources</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> namespaces
  <span class="token punctuation">-</span> pods
  <span class="token punctuation">-</span> services
  <span class="token key atrule">verbs</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> get
  <span class="token punctuation">-</span> list
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRoleBinding
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">:</span>system<span class="token punctuation">:</span>auth<span class="token punctuation">-</span>delegator
<span class="token key atrule">roleRef</span><span class="token punctuation">:</span>
  <span class="token key atrule">apiGroup</span><span class="token punctuation">:</span> rbac.authorization.k8s.io
  <span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole
  <span class="token key atrule">name</span><span class="token punctuation">:</span> system<span class="token punctuation">:</span>auth<span class="token punctuation">-</span>delegator
<span class="token key atrule">subjects</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>apiserver
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>metric
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> RoleBinding
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>auth<span class="token punctuation">-</span>reader
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> kube<span class="token punctuation">-</span>system
<span class="token key atrule">roleRef</span><span class="token punctuation">:</span>
  <span class="token key atrule">apiGroup</span><span class="token punctuation">:</span> rbac.authorization.k8s.io
  <span class="token key atrule">kind</span><span class="token punctuation">:</span> Role
  <span class="token key atrule">name</span><span class="token punctuation">:</span> extension<span class="token punctuation">-</span>apiserver<span class="token punctuation">-</span>authentication<span class="token punctuation">-</span>reader
<span class="token key atrule">subjects</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>apiserver
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>metric
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRoleBinding
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>resource<span class="token punctuation">-</span>reader
<span class="token key atrule">roleRef</span><span class="token punctuation">:</span>
  <span class="token key atrule">apiGroup</span><span class="token punctuation">:</span> rbac.authorization.k8s.io
  <span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>resource<span class="token punctuation">-</span>reader
<span class="token key atrule">subjects</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>apiserver
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>metric
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> rbac.authorization.k8s.io/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRoleBinding
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> hpa<span class="token punctuation">-</span>controller<span class="token punctuation">-</span>custom<span class="token punctuation">-</span>metrics
<span class="token key atrule">roleRef</span><span class="token punctuation">:</span>
  <span class="token key atrule">apiGroup</span><span class="token punctuation">:</span> rbac.authorization.k8s.io
  <span class="token key atrule">kind</span><span class="token punctuation">:</span> ClusterRole
  <span class="token key atrule">name</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>server<span class="token punctuation">-</span>resources
<span class="token key atrule">subjects</span><span class="token punctuation">:</span>
<span class="token punctuation">-</span> <span class="token key atrule">kind</span><span class="token punctuation">:</span> ServiceAccount
  <span class="token key atrule">name</span><span class="token punctuation">:</span> horizontal<span class="token punctuation">-</span>pod<span class="token punctuation">-</span>autoscaler
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>metric
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> ConfigMap
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> adapter<span class="token punctuation">-</span>config
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>metric
<span class="token key atrule">data</span><span class="token punctuation">:</span>
  <span class="token key atrule">config.yaml</span><span class="token punctuation">:</span> <span class="token punctuation">|</span><span class="token scalar string">
    rules:
    - seriesQuery: '{__name__="jboss_active_requests",namespace!="",pod!=""}'
      resources:
        overrides:
          namespace: {resource: "namespace"}
          pod: {resource: "pod"}
          service: {resource: "service"}
      name:
        matches: "^(.*)_requests"
        as: "${1}_avg"
      metricsQuery: '&lt;&lt;.Series>>{&lt;&lt;.LabelMatchers>>}'</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Service
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">annotations</span><span class="token punctuation">:</span>
    <span class="token key atrule">service.alpha.openshift.io/serving-cert-secret-name</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter<span class="token punctuation">-</span>tls
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter
  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>metric
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">ports</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> https
    <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">443</span>
    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">6443</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter
  <span class="token key atrule">type</span><span class="token punctuation">:</span> ClusterIP
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apiregistration.k8s.io/v1beta1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> APIService
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> v1beta1.custom.metrics.k8s.io
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">service</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter
    <span class="token key atrule">namespace</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>metric
  <span class="token key atrule">group</span><span class="token punctuation">:</span> custom.metrics.k8s.io
  <span class="token key atrule">version</span><span class="token punctuation">:</span> v1beta1
  <span class="token key atrule">insecureSkipTLSVerify</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
  <span class="token key atrule">groupPriorityMinimum</span><span class="token punctuation">:</span> <span class="token number">100</span>
  <span class="token key atrule">versionPriority</span><span class="token punctuation">:</span> <span class="token number">100</span>
<span class="token punctuation">---</span>
<span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">labels</span><span class="token punctuation">:</span>
    <span class="token key atrule">app</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter
  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>metric
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">selector</span><span class="token punctuation">:</span>
    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span>
      <span class="token key atrule">app</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter
  <span class="token key atrule">template</span><span class="token punctuation">:</span>
    <span class="token key atrule">metadata</span><span class="token punctuation">:</span>
      <span class="token key atrule">labels</span><span class="token punctuation">:</span>
        <span class="token key atrule">app</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter
      <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter
    <span class="token key atrule">spec</span><span class="token punctuation">:</span>
      <span class="token key atrule">serviceAccountName</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>apiserver
      <span class="token key atrule">containers</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter
        <span class="token key atrule">image</span><span class="token punctuation">:</span> directxman12/k8s<span class="token punctuation">-</span>prometheus<span class="token punctuation">-</span>adapter<span class="token punctuation">-</span>amd64
        <span class="token key atrule">args</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>secure<span class="token punctuation">-</span>port=6443
        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>tls<span class="token punctuation">-</span>cert<span class="token punctuation">-</span>file=/var/run/serving<span class="token punctuation">-</span>cert/tls.crt
        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>tls<span class="token punctuation">-</span>private<span class="token punctuation">-</span>key<span class="token punctuation">-</span>file=/var/run/serving<span class="token punctuation">-</span>cert/tls.key
        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>logtostderr=true
        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>prometheus<span class="token punctuation">-</span>url=http<span class="token punctuation">:</span>//prometheus<span class="token punctuation">-</span>operated<span class="token punctuation">:</span>9090/
        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>metrics<span class="token punctuation">-</span>relist<span class="token punctuation">-</span>interval=1m
        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>v=4
        <span class="token punctuation">-</span> <span class="token punctuation">-</span><span class="token punctuation">-</span>config=/etc/adapter/config.yaml
        <span class="token key atrule">ports</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">6443</span>
        <span class="token key atrule">volumeMounts</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /var/run/serving<span class="token punctuation">-</span>cert
          <span class="token key atrule">name</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>serving<span class="token punctuation">-</span>cert
          <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
        <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /etc/adapter/
          <span class="token key atrule">name</span><span class="token punctuation">:</span> config
          <span class="token key atrule">readOnly</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
        <span class="token punctuation">-</span> <span class="token key atrule">mountPath</span><span class="token punctuation">:</span> /tmp
          <span class="token key atrule">name</span><span class="token punctuation">:</span> tmp<span class="token punctuation">-</span>vol
      <span class="token key atrule">volumes</span><span class="token punctuation">:</span>
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> volume<span class="token punctuation">-</span>serving<span class="token punctuation">-</span>cert
        <span class="token key atrule">secret</span><span class="token punctuation">:</span>
          <span class="token key atrule">secretName</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>adapter<span class="token punctuation">-</span>tls
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> config
        <span class="token key atrule">configMap</span><span class="token punctuation">:</span>
          <span class="token key atrule">name</span><span class="token punctuation">:</span> adapter<span class="token punctuation">-</span>config
      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> tmp<span class="token punctuation">-</span>vol
        <span class="token key atrule">emptyDir</span><span class="token punctuation">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>RBAC의 정의는 Adopter가 동작하는데 필요한 <code v-pre>ServiceAccount</code>, <code v-pre>ClusterRole</code>, <code v-pre>RoleBinding</code>, <code v-pre>ClusterRoleBinding</code> 을 작성합니다.</p>
<h3 id="prometheus-수집-확인" tabindex="-1"><a class="header-anchor" href="#prometheus-수집-확인" aria-hidden="true">#</a> Prometheus 수집 확인</h3>
<ul>
<li>
<p>Prometheus 구성이 배포된 <code v-pre>prometheus-metric</code> 프로젝트에서 수행</p>
</li>
<li>
<p>좌측 Overview 클릭 후 목록에서 <code v-pre>prometheus-example</code>의 route 클릭하여 Prometheus Console 확인</p>
</li>
<li>
<p><code v-pre>Execute</code>우측의 <code v-pre>-insert metric at cursor-</code> 목록에서 추가된 <code v-pre>jboss_active_requests</code> 항목 선택 후 <code v-pre>Execute</code> 클릭 하여 값 확인</p>
<table>
<thead>
<tr>
<th><strong>Element</strong></th>
<th>Value</th>
</tr>
</thead>
<tbody>
<tr>
<td instance="sample-eap.my-eap-project.svc:58080,job=&quot;jboss-eap&quot;,namespace=&quot;my-eap-project&quot;,pod=&quot;sample-eap&quot;,service=&quot;sample-eap&quot;">jboss_active_requests</td>
<td>0</td>
</tr>
</tbody>
</table>
<ul>
<li>namespace, pod, service는 <code v-pre>jmx_exporter_conf.yaml</code>에서 부여 한 값</li>
<li>기본 jmx-exporter의 경우 pod 정보를 동적으로 가져올 수 없음</li>
<li>namespace로 메트릭을 확인</li>
</ul>
</li>
</ul>
<h2 id="test-automatic-scaling" tabindex="-1"><a class="header-anchor" href="#test-automatic-scaling" aria-hidden="true">#</a> Test automatic scaling</h2>
<p>Adopter가 애플리케이션 Metric을 검색할 수 있는지 확인하여 정상적으로 동작하고 있는지 확인이 필요합니다.</p>
<ul>
<li>
<p>Adopter가 애플리케이션 Metric 정보를 검색하도록 구성되었는지 확인</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$  oc get <span class="token parameter variable">--raw</span> <span class="token string">"/apis/custom.metrics.k8s.io/v1beta1"</span> <span class="token operator">|</span> jq <span class="token builtin class-name">.</span>
<span class="token punctuation">{</span>
  <span class="token string">"kind"</span><span class="token builtin class-name">:</span> <span class="token string">"APIResourceList"</span>,
  <span class="token string">"apiVersion"</span><span class="token builtin class-name">:</span> <span class="token string">"v1"</span>,
  <span class="token string">"groupVersion"</span><span class="token builtin class-name">:</span> <span class="token string">"custom.metrics.k8s.io/v1beta1"</span>,
  <span class="token string">"resources"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token string">"name"</span><span class="token builtin class-name">:</span> <span class="token string">"namespaces/jboss_active_avg"</span>,
      <span class="token string">"singularName"</span><span class="token builtin class-name">:</span> <span class="token string">""</span>,
      <span class="token string">"namespaced"</span><span class="token builtin class-name">:</span> false,
      <span class="token string">"kind"</span><span class="token builtin class-name">:</span> <span class="token string">"MetricValueList"</span>,
      <span class="token string">"verbs"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
        <span class="token string">"get"</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>,
    <span class="token punctuation">{</span>
      <span class="token string">"name"</span><span class="token builtin class-name">:</span> <span class="token string">"pods/jboss_active_avg"</span>,
      <span class="token string">"singularName"</span><span class="token builtin class-name">:</span> <span class="token string">""</span>,
      <span class="token string">"namespaced"</span><span class="token builtin class-name">:</span> true,
      <span class="token string">"kind"</span><span class="token builtin class-name">:</span> <span class="token string">"MetricValueList"</span>,
      <span class="token string">"verbs"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
        <span class="token string">"get"</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>,
    <span class="token punctuation">{</span>
      <span class="token string">"name"</span><span class="token builtin class-name">:</span> <span class="token string">"services/jboss_active_avg"</span>,
      <span class="token string">"singularName"</span><span class="token builtin class-name">:</span> <span class="token string">""</span>,
      <span class="token string">"namespaced"</span><span class="token builtin class-name">:</span> true,
      <span class="token string">"kind"</span><span class="token builtin class-name">:</span> <span class="token string">"MetricValueList"</span>,
      <span class="token string">"verbs"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
        <span class="token string">"get"</span>
      <span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>애플리케이션 Metric인 <code v-pre>jboss_active_avg</code>가 검색되는 지 확인</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ oc get <span class="token parameter variable">--raw</span> <span class="token string">"/apis/custom.metrics.k8s.io/v1beta1/namespaces/my-eap-project/metrics/jboss_active_avg"</span> <span class="token operator">|</span> jq <span class="token builtin class-name">.</span>
<span class="token punctuation">{</span>
  <span class="token string">"kind"</span><span class="token builtin class-name">:</span> <span class="token string">"MetricValueList"</span>,
  <span class="token string">"apiVersion"</span><span class="token builtin class-name">:</span> <span class="token string">"custom.metrics.k8s.io/v1beta1"</span>,
  <span class="token string">"metadata"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
    <span class="token string">"selfLink"</span><span class="token builtin class-name">:</span> <span class="token string">"/apis/custom.metrics.k8s.io/v1beta1/namespaces/my-eap-project/metrics/jboss_active_avg"</span>
  <span class="token punctuation">}</span>,
  <span class="token string">"items"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token string">"describedObject"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
        <span class="token string">"kind"</span><span class="token builtin class-name">:</span> <span class="token string">"Namespace"</span>,
        <span class="token string">"name"</span><span class="token builtin class-name">:</span> <span class="token string">"my-eap-project"</span>,
        <span class="token string">"apiVersion"</span><span class="token builtin class-name">:</span> <span class="token string">"/v1"</span>
      <span class="token punctuation">}</span>,
      <span class="token string">"metricName"</span><span class="token builtin class-name">:</span> <span class="token string">"jboss_active_avg"</span>,
      <span class="token string">"timestamp"</span><span class="token builtin class-name">:</span> <span class="token string">"2020-01-30T07:12:01Z"</span>,
      <span class="token string">"value"</span><span class="token builtin class-name">:</span> <span class="token string">"3"</span>,
      <span class="token string">"selector"</span><span class="token builtin class-name">:</span> null
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>결과 값은 JBoss 상의 Active Request가 3개임을 의미 합니다.</p>
</li>
<li>
<p>Horizontal Pod Autoscaler (HPA) 리소스를 적용합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ oc apply <span class="token parameter variable">-f</span> - <span class="token operator">&lt;&lt;</span><span class="token string">EOF
kind: HorizontalPodAutoscaler
apiVersion: autoscaling/v2beta1
metadata:
  name: sample-eap
  namespace: my-eap-project
spec:
  scaleTargetRef:
    apiVersion: apps.openshift.io/v1
    kind: DeploymentConfig
    name: sample-eap
  minReplicas: 1
  maxReplicas: 5
  metrics:
  - type: Object
    object:
      target:
        kind: Namespace
        name: my-eap-project
      metricName: jboss_active_avg
      targetValue: 10
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>namespace</code>를 기준으로 쿼리하기 때문에 <code v-pre>Object</code> 형태의 metrics를 구성합니다.</p>
</li>
<li>
<p>적용된 HPA를 확인하여 적용된 JBoss EAP에 요청에 따라 값이 변화하고 Pod의 수가 변화하는지 확인합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">watch</span> oc describe hpa/sample-eap <span class="token parameter variable">-n</span> my-eap-project
Every <span class="token number">2</span>.0s: oc describe hpa/sample-eap <span class="token parameter variable">-n</span> my-eap-pr<span class="token punctuation">..</span>.  Thu Jan <span class="token number">30</span> 07:23:47 <span class="token number">2020</span>

Name:                                              sample-eap
Namespace:                                         my-eap-project
Labels:                                            <span class="token operator">&lt;</span>none<span class="token operator">></span>
Annotations:                                       kubectl.kubernetes.io/last-ap
plied-configuration<span class="token operator">=</span><span class="token punctuation">{</span><span class="token string">"apiVersion"</span><span class="token builtin class-name">:</span><span class="token string">"autoscaling/v2beta1"</span>,<span class="token string">"kind"</span><span class="token builtin class-name">:</span><span class="token string">"HorizontalPodAut
oscaler"</span>,<span class="token string">"metadata"</span>:<span class="token punctuation">{</span><span class="token string">"annotations"</span>:<span class="token punctuation">{</span><span class="token punctuation">}</span>,<span class="token string">"name"</span><span class="token builtin class-name">:</span><span class="token string">"sample-eap"</span>,<span class="token string">"namespace"</span><span class="token builtin class-name">:</span><span class="token string">"my-eap-pr
oject"</span><span class="token punctuation">}</span>,<span class="token string">"sp...
CreationTimestamp:                                 Thu, 30 Jan 2020 07:18:17 +00
00
Reference:                                         DeploymentConfig/sample-eap
Metrics:                                           ( current / target )
  "</span>jboss_active_avg" on Namespace/my-eap-project:  <span class="token number">16</span> / <span class="token number">10</span>
Min replicas:                                      <span class="token number">1</span>
Max replicas:                                      <span class="token number">5</span>
DeploymentConfig pods:                             <span class="token number">1</span> current / <span class="token number">2</span> desired
Conditions:
  Type            Status  Reason              Message
  ----            ------  ------              -------
  AbleToScale     True    SucceededRescale    the HPA controller was able to upd
ate the target scale to <span class="token number">2</span>
  ScalingActive   True    ValidMetricFound    the HPA was able to successfully c
alculate a replica count from Namespace metric jboss_active_avg
  ScalingLimited  False   DesiredWithinRange  the desired count is within the ac
ceptable range
Events:
  Type    Reason             Age   From                       Message
  ----    ------             ----  ----                       -------
  Normal  SuccessfulRescale  17s   horizontal-pod-autoscaler  New size: <span class="token number">2</span><span class="token punctuation">;</span> reaso
n: Namespace metric jboss_active_avg above target
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h2 id="appendix" tabindex="-1"><a class="header-anchor" href="#appendix" aria-hidden="true">#</a> Appendix</h2>
<h3 id="_1-참고-자료" tabindex="-1"><a class="header-anchor" href="#_1-참고-자료" aria-hidden="true">#</a> 1. 참고 자료</h3>
<ul>
<li><a href="https://medium.com/ibm-cloud/autoscaling-applications-on-openshift-container-platform-3-11-with-custom-metrics-6e9c14474de3" target="_blank" rel="noopener noreferrer">https://medium.com/ibm-cloud/autoscaling-applications-on-openshift-container-platform-3-11-with-custom-metrics-6e9c14474de3<ExternalLinkIcon/></a></li>
<li>Sample app (github) : <a href="https://github.com/Great-Stone/webapp" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/webapp<ExternalLinkIcon/></a></li>
<li>s2i-wildfly : <a href="https://github.com/openshift-s2i/s2i-wildfly" target="_blank" rel="noopener noreferrer">https://github.com/openshift-s2i/s2i-wildfly<ExternalLinkIcon/></a></li>
<li>rhpam prometheus 참고 : <a href="https://github.com/DuncanDoyle/rhpam-prometheus-grafana-ocp" target="_blank" rel="noopener noreferrer">https://github.com/DuncanDoyle/rhpam-prometheus-grafana-ocp<ExternalLinkIcon/></a></li>
<li>jmx exporter : <a href="https://github.com/prometheus/jmx_exporter" target="_blank" rel="noopener noreferrer">https://github.com/prometheus/jmx_exporter<ExternalLinkIcon/></a></li>
<li>jmx exporter for JBoss/Wildfly : <a href="https://lazarbulic.com/blog/2018/05/25/prometheus-jmx_exporter-for-jboss-wildfly/" target="_blank" rel="noopener noreferrer">https://lazarbulic.com/blog/2018/05/25/prometheus-jmx_exporter-for-jboss-wildfly/<ExternalLinkIcon/></a></li>
<li>Prometheus Query : <a href="https://prometheus.io/docs/prometheus/latest/querying/basics/" target="_blank" rel="noopener noreferrer">https://prometheus.io/docs/prometheus/latest/querying/basics/<ExternalLinkIcon/></a></li>
<li>OpenShift k8s-prometheus-adapter (github) : <a href="https://github.com/openshift/k8s-prometheus-adapter" target="_blank" rel="noopener noreferrer">https://github.com/openshift/k8s-prometheus-adapter<ExternalLinkIcon/></a></li>
<li>Horizontal Pod Autoscaler : <a href="https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/" target="_blank" rel="noopener noreferrer">https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/<ExternalLinkIcon/></a></li>
<li>Exposing custom application metrics for autoscaling OCP 4.1~ : <a href="https://docs.openshift.com/container-platform/4.3/monitoring/exposing-custom-application-metrics-for-autoscaling.html" target="_blank" rel="noopener noreferrer">https://docs.openshift.com/container-platform/4.3/monitoring/exposing-custom-application-metrics-for-autoscaling.html<ExternalLinkIcon/></a></li>
<li>Installing the Operator Framework OCP 3.11 : <a href="https://docs.openshift.com/container-platform/3.11/install_config/installing-operator-framework.html" target="_blank" rel="noopener noreferrer">https://docs.openshift.com/container-platform/3.11/install_config/installing-operator-framework.html<ExternalLinkIcon/></a></li>
</ul>
<h3 id="_2-memory-based-hpa" tabindex="-1"><a class="header-anchor" href="#_2-memory-based-hpa" aria-hidden="true">#</a> 2. Memory based HPA</h3>
<blockquote>
<p>다음의 정보가 도움이 됩니다. :</p>
<ul>
<li><a href="https://blog.openshift.com/kubernetes-1-8-now-custom-metrics/" target="_blank" rel="noopener noreferrer">https://blog.openshift.com/kubernetes-1-8-now-custom-metrics/<ExternalLinkIcon/></a></li>
<li><a href="https://bugzilla.redhat.com/show_bug.cgi?id=1533790" target="_blank" rel="noopener noreferrer">https://bugzilla.redhat.com/show_bug.cgi?id=1533790<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<p>v2beta1 api를 적용하는 방법은 다음과 같습니다.</p>
<ul>
<li>
<p>master 노드의 <code v-pre>master-config.yaml</code>수정</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">vi</span> /etc/origin/master/master-config.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>apiServerArguments</code>에 <code v-pre>runtime-config</code> 항목으로 <code v-pre>apis/autoscaling/v2beta1=true</code> 추가</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">kubernetesMasterConfig</span><span class="token punctuation">:</span>
<span class="token punctuation">...</span>
  <span class="token key atrule">apiServerArguments</span><span class="token punctuation">:</span>
	<span class="token punctuation">...</span>
    <span class="token key atrule">runtime-config</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> apis/autoscaling/v2beta1=true
  <span class="token key atrule">controllerArguments</span><span class="token punctuation">:</span>
<span class="token punctuation">...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>master 구성요소 재시작</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ master-restart api
$ master-restart controllers
$ systemctl restart atomic-openshift-node.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>api 응답 확인</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ oc get <span class="token parameter variable">--raw</span> /apis/autoscaling/v2beta1
<span class="token punctuation">{</span><span class="token string">"kind"</span><span class="token builtin class-name">:</span><span class="token string">"APIResourceList"</span>,<span class="token string">"apiVersion"</span><span class="token builtin class-name">:</span><span class="token string">"v1"</span>,<span class="token string">"groupVersion"</span><span class="token builtin class-name">:</span><span class="token string">"autoscaling/v2beta1"</span>,<span class="token string">"resources"</span>:<span class="token punctuation">[</span><span class="token punctuation">{</span><span class="token string">"name"</span><span class="token builtin class-name">:</span><span class="token string">"horizontalpodautoscalers"</span>,<span class="token string">"singularName"</span><span class="token builtin class-name">:</span><span class="token string">""</span>,<span class="token string">"namespaced"</span>:true,<span class="token string">"kind"</span><span class="token builtin class-name">:</span><span class="token string">"HorizontalPodAutoscaler"</span>,<span class="token string">"verbs"</span>:<span class="token punctuation">[</span><span class="token string">"create"</span>,<span class="token string">"delete"</span>,<span class="token string">"deletecollection"</span>,<span class="token string">"get"</span>,<span class="token string">"list"</span>,<span class="token string">"patch"</span>,<span class="token string">"update"</span>,<span class="token string">"watch"</span><span class="token punctuation">]</span>,<span class="token string">"shortNames"</span>:<span class="token punctuation">[</span><span class="token string">"hpa"</span><span class="token punctuation">]</span>,<span class="token string">"categories"</span>:<span class="token punctuation">[</span><span class="token string">"all"</span><span class="token punctuation">]</span><span class="token punctuation">}</span>,<span class="token punctuation">{</span><span class="token string">"name"</span><span class="token builtin class-name">:</span><span class="token string">"horizontalpodautoscalers/status"</span>,<span class="token string">"singularName"</span><span class="token builtin class-name">:</span><span class="token string">""</span>,<span class="token string">"namespaced"</span>:true,<span class="token string">"kind"</span><span class="token builtin class-name">:</span><span class="token string">"HorizontalPodAutoscaler"</span>,<span class="token string">"verbs"</span>:<span class="token punctuation">[</span><span class="token string">"get"</span>,<span class="token string">"patch"</span>,<span class="token string">"update"</span><span class="token punctuation">]</span><span class="token punctuation">}</span><span class="token punctuation">]</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>HPA 적용 :<br>
예를들어 <code v-pre>mnist-app</code> 이라고 하는 <code v-pre>DeploymentConfig </code>를 타겟으로 함</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> autoscaling/v2beta1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> HorizontalPodAutoscaler
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">name</span><span class="token punctuation">:</span> mnist<span class="token punctuation">-</span>app
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>namespace
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">maxReplicas</span><span class="token punctuation">:</span> <span class="token number">10</span>
  <span class="token key atrule">minReplicas</span><span class="token punctuation">:</span> <span class="token number">1</span>
  <span class="token key atrule">scaleTargetRef</span><span class="token punctuation">:</span>
    <span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps.openshift.io/v1
    <span class="token key atrule">kind</span><span class="token punctuation">:</span> DeploymentConfig
    <span class="token key atrule">name</span><span class="token punctuation">:</span> mnist<span class="token punctuation">-</span>app
  <span class="token key atrule">metrics</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> Resource
    <span class="token key atrule">resource</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> memory
      <span class="token key atrule">targetAverageUtilization</span><span class="token punctuation">:</span> <span class="token number">10</span>
  <span class="token punctuation">-</span> <span class="token key atrule">type</span><span class="token punctuation">:</span> Resource
    <span class="token key atrule">resource</span><span class="token punctuation">:</span>
      <span class="token key atrule">name</span><span class="token punctuation">:</span> memory
      <span class="token key atrule">targetAverageValue</span><span class="token punctuation">:</span> 1G
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>targetAverageUtilization : Pod 들의 가용한 Memory를 100으로 산정하여 그중 사용량을 기준</li>
<li>targetAverageValue : Pod 들의 평균 사용량을 기준</li>
</ul>
</li>
<li>
<p><a href="https://docs.openshift.com/container-platform/4.1/monitoring/exposing-custom-application-metrics-for-autoscaling.html" target="_blank" rel="noopener noreferrer">https://docs.openshift.com/container-platform/4.1/monitoring/exposing-custom-application-metrics-for-autoscaling.html<ExternalLinkIcon/></a>)</p>
</li>
</ul>
<h3 id="_3-registry-account" tabindex="-1"><a class="header-anchor" href="#_3-registry-account" aria-hidden="true">#</a> 3. Registry account</h3>
<p>Red Hat Container Image Registry에 접속하기 위한 전용 계정을 생성할 수 있습니다.</p>
<ul>
<li><a href="https://registry.redhat.io" target="_blank" rel="noopener noreferrer">https://registry.redhat.io<ExternalLinkIcon/></a> 에 접속하여 로그인</li>
<li>우측 상단의 <code v-pre>Service Accounts</code>를 클릭</li>
<li><code v-pre>New Service Account</code> 버튼을 클릭</li>
<li>Create a New Registry Service Account
<ul>
<li>Name : &quot;A-z 0-9 .-_&quot; 조건에 맞는 이름을 설정 (e.g. registry)</li>
<li>Description : 해당 계정 정보에 대한 설명을 기입 (e.g. for image registry login)</li>
<li><code v-pre>CREATE</code> 버튼 클릭</li>
</ul>
</li>
<li>생성된 Token Information 확인
<ul>
<li><code v-pre>Token Information</code> 탭의 정보를 확인</li>
<li>Username is <strong>00000000|registry</strong> and... 설명의 <strong>숫자+파이프+이름</strong> 형태가 Username</li>
<li>아래 Token 값(매우 긴)이 Password 로 동작</li>
</ul>
</li>
</ul>
<p>생성한 Token으로 본래의 계정 접속 정보를 노출 하지 않고 Red Hat Container Image Registry에 접속할 수 있는 접속 정보로 사용할 수 있습니다.</p>
<h3 id="_4-openshift에-리소스-배포" tabindex="-1"><a class="header-anchor" href="#_4-openshift에-리소스-배포" aria-hidden="true">#</a> 4. OpenShift에 리소스 배포</h3>
<p>OpenShift에 리소스를 배포하는 방법은 <code v-pre>oc</code> CLI를 사용하는 방법과 Application Console을 활용하는 두가지 방법이 있습니다.</p>
<p>다음과 같은 <code v-pre>prometheus-operator</code>관련 리소스 설정이 있다고 가정합니다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> operators.coreos.com/v1alpha1
<span class="token key atrule">kind</span><span class="token punctuation">:</span> Subscription
<span class="token key atrule">metadata</span><span class="token punctuation">:</span>
  <span class="token key atrule">generateName</span><span class="token punctuation">:</span> prometheus<span class="token punctuation">-</span>
  <span class="token key atrule">namespace</span><span class="token punctuation">:</span> custom<span class="token punctuation">-</span>metric
<span class="token key atrule">spec</span><span class="token punctuation">:</span>
  <span class="token key atrule">source</span><span class="token punctuation">:</span> rh<span class="token punctuation">-</span>operators
  <span class="token key atrule">name</span><span class="token punctuation">:</span> prometheus
  <span class="token key atrule">startingCSV</span><span class="token punctuation">:</span> prometheusoperator.0.22.2
  <span class="token key atrule">channel</span><span class="token punctuation">:</span> preview
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>yaml로 작성된 리소스 설정 파일을 적용하기위해 다음 두가지 형태를 활용합니다.</p>
<h4 id="_1-cli-활용" tabindex="-1"><a class="header-anchor" href="#_1-cli-활용" aria-hidden="true">#</a> 1) CLI 활용</h4>
<p><code v-pre>oc</code> 로그인 상태에서 yaml로 작성된 리소스 설정을 파일로 저장합니다. 예를 들어 <code v-pre>prometheus-operator.yaml</code> 인 경우 다음과 같이 적용 가능합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ oc apply <span class="token parameter variable">-f</span> prometheus-operator.yaml
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>또는 다음과 같이 인라인으로 수행할 수 있습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ $ oc create <span class="token parameter variable">-f</span> - <span class="token operator">&lt;&lt;</span><span class="token string">EOF
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  generateName: prometheus-
  namespace: custom-metric
spec:
  source: rh-operators
  name: prometheus
  startingCSV: prometheusoperator.0.22.2
  channel: preview
EOF</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-application-console-활용" tabindex="-1"><a class="header-anchor" href="#_2-application-console-활용" aria-hidden="true">#</a> 2) Application Console 활용</h4>
<p>OpenShift Application Console 에 접속 합니다. 적용할 프로젝트를 클릭하고 <code v-pre>Overview</code> 화면의 우측 상단에 <code v-pre>Add to Project</code>를 클릭합니다.<br>
<code v-pre>Import YAML/JSON</code>을 클릭하여 리소스 설정을 입력받는 창에 앞서의 예로 작성된 설정을 붙여넣습니다. 또는 파일로 저장된 파일을 선택하여 업로드/적용 가능합니다. <code v-pre>Create</code> 버튼을 클릭하여 결과를 확인합니다.</p>
</div></template>


