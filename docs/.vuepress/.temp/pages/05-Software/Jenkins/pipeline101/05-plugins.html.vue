<template><div><h1 id="_5-plugins" tabindex="-1"><a class="header-anchor" href="#_5-plugins" aria-hidden="true">#</a> 5. Plugins</h1>
<p>Jenkins가 유용한 툴인 이유중 하나는 방대한 양의 플러그인 입니다. Jenkins의 기능을 확장시키고, 관리, 빌드 정책 등을 확장 시켜주고, 타 서비스와의 연계를 쉽게 가능하도록 합니다.</p>
<p><a href="https://plugins.jenkins.io/" target="_blank" rel="noopener noreferrer">Plugin Index<ExternalLinkIcon/></a></p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564450122219.png" alt="1564450122219" tabindex="0" loading="lazy"><figcaption>1564450122219</figcaption></figure>
<h2 id="_5-1-adding-plugins-via-plugin-manager" tabindex="-1"><a class="header-anchor" href="#_5-1-adding-plugins-via-plugin-manager" aria-hidden="true">#</a> 5.1 Adding plugins via plugin manager</h2>
<p>Jenkins는 온라인에 연결된 plugin을 검색, 설치할 수 있는 <code v-pre>플러그인 관리</code>기능을 갖고 있습니다. 좌측 메뉴에서 <code v-pre>Jenkins 관리</code>를 클릭하면 <code v-pre>플러그인 관리</code> 링크를 통하여 해당 기능에 접근할 수 있습니다.</p>
<ul>
<li>업데이트된 플러그인 목록 : 설치된 플러그인 중 업데이트가 있는 플러그인 목록이 나타납니다.</li>
<li>설치 가능 :  아직 해당 Jenkins에 설치되어있지 않은 플러그인 목록이 나타납니다.</li>
<li>설치된 플러그인 목록 : 해당 Jenkins에 설치되어있는 플러그인이 나타납니다. 필수적이지 않은 플러그인인 경우 삭제도 해당 탭에서 가능합니다.</li>
<li>고급 : 플러그인 서버에 접속할 수 있도록 별도의 프록시를 설정하거나, <code v-pre>.hpi</code>확장자를 갖는 플러그인을 설치하거나 업데이트 사이트를 지정할 수 있습니다.</li>
</ul>
<p>각 플러그인 이름을 클릭하면 플러그인 정보를 확인할 수 있는 <code v-pre>plugins.jenkins.io</code> 사이트로 이동하여 정보를 보여줍니다. 사용방법은 우측에 <code v-pre>wiki</code>링크를 클릭합니다. 대략적인 UI나 사용방법은 <code v-pre>wiki.jenkins.io</code>에서 제공합니다.</p>
<h2 id="_5-2-using-shared-libraries" tabindex="-1"><a class="header-anchor" href="#_5-2-using-shared-libraries" aria-hidden="true">#</a> 5.2 Using shared libraries</h2>
<p>Jenkins Pipeline의 Shared libraries에 대한 상세 내용은 다음 링크를 참고합니다. <a href="https://jenkins.io/doc/book/pipeline/shared-libraries/" target="_blank" rel="noopener noreferrer">https://jenkins.io/doc/book/pipeline/shared-libraries/<ExternalLinkIcon/></a></p>
<p>이번 실습을 진행하기전에 GitHub에서 <a href="https://github.com/Great-Stone/evenOdd" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/evenOdd<ExternalLinkIcon/></a> repository를 본인 계정의 GitHub에 Fork 하여 진행합니다.</p>
<p>소스의 <code v-pre>var</code> 디렉토리에는 Pipeline에서 사용하는 Shared Library들이 들어있습니다. groovy 스크립트로 되어있으며 Pipeline을 구성한 <code v-pre>jenkinsfile</code>에서 이를 사용합니다.</p>
<p><code v-pre>vars/evenOdd.groovy</code>를 호출하고 값을 받아오는 형태를 갖고, evenOdd.groovy에서 사용하는 <code v-pre>log.info</code>와 <code v-pre>log.warning</code>은 <code v-pre>vars/log.groovy</code>에 구현되어있습니다.</p>
<p>다음과 같이 Jenkins에 설정을 수행합니다.</p>
<ol>
<li><code v-pre>Jenkins 관리</code>클릭 후 <code v-pre>시스템 설정</code>을 선택합니다.</li>
<li><code v-pre>Global Pipeline Libraries</code> 의 추가 버튼을 클릭하여 새로운 구성을 추가합니다.
<ul>
<li>Name : evenOdd (어플리케이션 이름과 동일하게 하는 것을 추천합니다.)</li>
<li>Default version : master</li>
<li>Retrieval method &gt; Modern SCM : 활성화 하면 아래 <code v-pre>Source Code Management</code> 항목이 추가됩니다.</li>
<li>SCM의 <code v-pre>GitHub</code>를 클릭하여 내용을 채웁니다.
<ul>
<li>Credentials : 이전 실습 내용에서 생성한 Credential을 선택합니다.</li>
<li>Owner : GitHub Owner를 입력합니다. <code v-pre>https://github.com/Great-Stone/evenOdd</code>인 경우 <code v-pre>Great-Stone</code>이 Owner가 됩니다.</li>
<li>Repository : 위정보가 맞는 경우 자동으로 목록이 나타납니다. evenOdd를 선택합니다.</li>
</ul>
</li>
<li>Load implicitly : SCM 정보를 기입하고 다시 위쪽 <code v-pre>Library</code>에 있는 <code v-pre>Load implicitly</code>를 활성화 합니다.</li>
</ul>
</li>
</ol>
<p>Shared Libraries가 준비가 되면 <code v-pre>Pipeline</code> 타입의 Item을 생성하고 (e.g. 05-02.UsingSharedLibraries) Pipeline 설정을 추가합니다.</p>
<ul>
<li>Definition : Pipeline script from SCM</li>
<li>SCM : Git</li>
<li>Repositories
<ul>
<li>Repository URL : <a href="https://github.com/Great-Stone/evenOdd.git" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/evenOdd.git<ExternalLinkIcon/></a></li>
</ul>
</li>
</ul>
<p>저장 후 <code v-pre>Build Now</code>를 클릭하여 빌드를 수행합니다. 빌드의 결과로는 2 단계로 수행되는데 1단계는 <code v-pre>Declarative: Checkout SCM</code>으로 SCM으로부터 소스를 받아 준비하는 단계이고, 2단계는 <code v-pre>jenkinsfile</code>을 수행하는 단계입니다. <code v-pre>vars/evenOdd.goovy</code> 스크립트에는 stage가 두개 있으나 해당 Pipeline 을 호출하는 값에 따라 하나의 stage만을 수행하도록 되어있어서 하나의 stage가 수행되었습니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code><span class="token comment">// Jenkinsfile</span>
<span class="token comment">//@Library('evenOdd') _</span>

<span class="token function">evenOdd</span><span class="token punctuation">(</span>currentBuild<span class="token punctuation">.</span><span class="token function">getNumber</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>currentBuild.getNumber()</code>는 현재 생성된 Pipeline Item의 빌드 숫자에 따라 값을 <code v-pre>evenOdd(빌드 숫자)</code>형태로 호출하게 됩니다.</p>
<p>Jenkins shared libraries를 사용하는 가장 좋은 예는 재사용성 있는 Groovy 함수를 타 작업자와 공유하는 것 입니다. 빌드의 상태는 다른 파이프 라인 단계로 계속할 것인지 결정하는 데 사용할 수도 있습니다.</p>
<div class="hint-container warning">
<p class="hint-container-title">경고</p>
<p>해당 설정은 모든 빌드에 영향을 주기 때문에 타 작업을 위해 추가된 <strong>Global Pipeline Libraries</strong>의 <strong>Library</strong>를 삭제하여 진행합니다.</p>
</div>
</div></template>


