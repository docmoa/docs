<template><div><h1 id="_6-notifications" tabindex="-1"><a class="header-anchor" href="#_6-notifications" aria-hidden="true">#</a> 6. Notifications</h1>
<p>Jenkins빌드의 결과를 받아볼 수 있는 몇가지 방안에 대해 알아봅니다.</p>
<h2 id="_6-1-notifications-of-build-state" tabindex="-1"><a class="header-anchor" href="#_6-1-notifications-of-build-state" aria-hidden="true">#</a> 6.1 Notifications of build state</h2>
<p>Jenkins에서는 플러그인이나 외부 툴에 의해 빌드에 대한 결과를 받아 볼 수 있습니다. 대표적으로는 Jenkins의 슬랙 플러그인을 사용하여 슬랙으로 빌드에 결과를 받아보거나, <a href="http://catlight.io" target="_blank" rel="noopener noreferrer">catlight.io<ExternalLinkIcon/></a> 에서 데스크탑용 어플리케이션에 연동하는 방법도 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564463655933.png" alt="1564463655933" tabindex="0" loading="lazy"><figcaption>1564463655933</figcaption></figure>
<p>여기서는 Chrome 확장 프로그램을 통한 알림을 받을 수 있는 설정을 설명합니다. 이 과정을 진행하기 위해서는 Chrome 웹브라우저가 필요합니다.</p>
<ol>
<li>
<p><RouterLink to="/05-Software/Jenkins/pipeline101/chrome:/apps/">chrome://apps/</RouterLink>에 접속하여 앱스토어를 클릭합니다.</p>
</li>
<li>
<p>jenkins를 검색하여 <code v-pre>Yet Another Jenkins Notifier</code>를 확인합니다. <code v-pre>Chrome에 추가</code>버튼으로 확장 프로그램을 설치합니다.</p>
</li>
<li>
<p>설치가 완료되면 브라우저 우측 상단에 Jenkins 아이콘이 나타납니다. 클릭합니다.</p>
</li>
<li>
<p>각 Item(Job)의 url을 입력하여 <code v-pre>+</code>버튼을 클릭합니다.</p>
</li>
<li>
<p>등록된 Item을 확인하고 해당 빌드를 Jenkins 콘솔에서 실행해봅니다. 결과에 대한 알림이 발생하는 것을 확인 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564464197547.png" alt="1564464197547" tabindex="0" loading="lazy"><figcaption>1564464197547</figcaption></figure>
</li>
</ol>
<h2 id="_6-2-build-state-badges-for-scm" tabindex="-1"><a class="header-anchor" href="#_6-2-build-state-badges-for-scm" aria-hidden="true">#</a> 6.2 Build state badges for SCM</h2>
<p>Jenkins에서 빌드가 수행된 결과를 SCM에 반영하는 기능도 플러그인을 통해 가능합니다. SCM에서 해당 Jenkins에 접근이 가능해야 하므로 Jenkins는 SCM에서 접근가능한 네트워크 상태여야 합니다.</p>
<p>Jenkins에 새로운 플러그인을 추가하고 설정합니다.</p>
<ul>
<li><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>플러그인 관리</code>를 클릭합니다.</li>
<li><code v-pre>설치 가능</code> 탭을 클릭하고 상단의 검색에 <code v-pre>embed</code>를 입력하면 <code v-pre>Embeddable Build Status</code>플러그인이 나타납니다. 선택하여 설치를 진행합니다.</li>
<li><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>Configure Global Security</code>을 클릭합니다.</li>
<li><code v-pre>Authorization</code> 항목에서 <code v-pre>Matrix-based security</code>를 체크합니다.</li>
<li><code v-pre>Authenticated Users</code>의 경우 필요한 각 항목에 대해 체크박스를 활성화 합니다.</li>
<li><code v-pre>Anonymous Users</code>에 대해서 <code v-pre>Job/ViewStatus</code> 항목을 활성화 합니다.</li>
</ul>
<p>이제 기존의 외부 SCM이 연결된 Item을 선택합니다. 여기서는 <code v-pre>05-02.UsingSharedLibraries</code>에 설정합니다. 해당 Item을 선택하면 좌측에 <code v-pre>Embeddable Build Status</code> 항목이 새로 생긴것을 확인 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564464880533.png" alt="1564464880533" tabindex="0" loading="lazy"><figcaption>1564464880533</figcaption></figure>
<p>해당 항목을 클릭하고 <code v-pre>Markdown</code>의 <code v-pre>unprotected</code>의 항목을 복사합니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code><span class="token url">[<span class="token content">![Build Status</span>](<span class="token url">http://myjenkins.com/buildStatus/icon?job=05-02.UsingSharedLibraries</span>)</span>](http://myjenkins.com/job/05-02.UsingSharedLibraries/)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>복사한 형식을 GitHub의 evenOdd repository의 <a href="http://README.md" target="_blank" rel="noopener noreferrer">README.md<ExternalLinkIcon/></a> 파일 상단에 위치 시킵니다.</p>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code><span class="token title important"><span class="token punctuation">#</span> evenOdd</span>
<span class="token url">[<span class="token content">![Build Status</span>](<span class="token url">http://myjenkins.com/buildStatus/icon?job=libraries</span>)</span>](http://myjenkins.com/job/libraries/)

A Jenkins even/odd playbook from the Jenkins.io documentation

Add this as a shared library called evenOdd in your jenkins
instance, and then instantiate the pipeline in your project Jenkinsfile

This will also use an example of global variabls from the log.groovy
definitions

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>이같이 반영하면 각 빌드에 대한 결과를 SCM에 동적으로 상태를 반영 할 수 있습니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564465713857.png" alt="1564465713857" tabindex="0" loading="lazy"><figcaption>1564465713857</figcaption></figure>
<p>이같은 알림 설정은 코드의 빌드가 얼마나 잘 수행되는지 이해하고 추적할 수 있도록 도와줍니다.</p>
</div></template>


