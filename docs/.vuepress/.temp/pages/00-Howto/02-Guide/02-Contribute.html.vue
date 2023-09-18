<template><div><h1 id="contribute" tabindex="-1"><a class="header-anchor" href="#contribute" aria-hidden="true">#</a> Contribute</h1>
<p>docmoa에 문서 기여하기위한 가이드를 설명합니다. 일반적인 github 상에서의 코드 기여 방식과 동일합니다.</p>
<h2 id="git-설치-option" tabindex="-1"><a class="header-anchor" href="#git-설치-option" aria-hidden="true">#</a> git 설치(Option)</h2>
<p>로컬 환경에서 git 명령을 수행하기 위해 설치합니다. github 브라우저 환경에서 수정하는 것도 가능하지만, 로컬에서 문서를 활용하고 오프라인 작업을 위해서는 설치하시기를 권장합니다.</p>
<p><a href="https://git-scm.com/book/ko/v2/%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-Git-%EC%84%A4%EC%B9%98" target="_blank" rel="noopener noreferrer">Git 설치 방법 안내<ExternalLinkIcon/></a>를 참고하여 아래 설명합니다.</p>
<Tabs id="15" :data='[]'>
</Tabs>
<h2 id="github-fork" tabindex="-1"><a class="header-anchor" href="#github-fork" aria-hidden="true">#</a> github <code v-pre>Fork</code></h2>
<p>문서는 github상에서 관리됩니다. 우선 문서를 추가구성하고 수정할 수 있도록 원본 github repo를 <code v-pre>Fork</code> 합니다.</p>
<ol>
<li><code v-pre>https://github.com/docmoa/docs</code>로 이동합니다.</li>
<li>우측 상단의 <code v-pre>Fork</code>를 클릭하고 나의 github Org를 선택합니다.<br>
<img src="@source/00-Howto/image/github-fork.png" alt="Fork" title="GitHub에서 Fork" loading="lazy"><br>
<img src="@source/00-Howto/image/github-fork-target.png" alt="Fork-Target" title="Fork 대상 Org 선택" loading="lazy"></li>
</ol>
<h2 id="git-fetch-or-pull" tabindex="-1"><a class="header-anchor" href="#git-fetch-or-pull" aria-hidden="true">#</a> git <code v-pre>Fetch</code> or <code v-pre>Pull</code></h2>
<p>Fork의 원본 Repo에 변경에 대해 작업중인 Repo에 변경사항을 적용해야 하는 필요성이 있습니다. 여러 편집자가 동일한 시점에 동일 문서를 편집하게 되면 편집에 충돌이 발생할 수 있습니다.</p>
<p><img src="https://upload.wikimedia.org/wikipedia/commons/9/97/Paragraph-based_prototype_–_rough_visualization_of_the_functionality.png" alt="Conflict" loading="lazy"><br>
참고 : <a href="https://en.wikipedia.org/wiki/Edit_conflict" target="_blank" rel="noopener noreferrer">https://en.wikipedia.org/wiki/Edit_conflict<ExternalLinkIcon/></a></p>
<p>충돌을 사전에 최대한 방지하기 위해서 편집 전에 원본의 문서를 가져오고 병합하는 과정이 필요합니다.</p>
<Tabs id="77" :data='[]'>
</Tabs>
<h2 id="git-add-and-commit" tabindex="-1"><a class="header-anchor" href="#git-add-and-commit" aria-hidden="true">#</a> git <code v-pre>add</code> and <code v-pre>commit</code></h2>
<p>문서 작성은 앞서 <RouterLink to="/00-Howto/02-Guide/01-Start.html">문서작성 '시작'</RouterLink>을 참고하세요. 문서 또는 문서 작성에 필요했던 이미지 등 준비가 끝나면 해당 파일을 본인 소유의 Repo에 추가합니다. 이 때 사용하는 것은 CLI도 가능하고, UI 기반에서 작성한 경우에는 저장 즉시 해당 Repo에 저장됩니다. Commit의 경우 필요에 따라 브랜치를 별도 생성하여 본인의 Repo를 기준으로 관리하는 것 또한 가능합니다.</p>
<Tabs id="92" :data='[]'>
</Tabs>
<h2 id="contribute-1" tabindex="-1"><a class="header-anchor" href="#contribute-1" aria-hidden="true">#</a> Contribute</h2>
<p>최종적으로 Fork 한 Repo에 docmoa에 기여할 문서가 준비가 된경우 해당 Repo의 github ui에서 커밋된 정보가 있다는 문구와 <code v-pre>Contribute</code>를 클릭하여 <code v-pre>Pull request</code>를 진행 할 수 있습니다. <code v-pre>Open pull request</code>를 클릭하여 Upstream Repo에 요청을 보냅니다.</p>
<figure><img src="@source/00-Howto/image/github-ui-contribute.png" alt="Pull request" tabindex="0" loading="lazy"><figcaption>Pull request</figcaption></figure>
<p>Pull request를 생성하면 본인 소유의 Repo(Branch)로 부터 docmoa에 지금까지의 변경사항을 병합할 것을 요청할 수 있습니다.</p>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>상단에 표기되는 repo의 방향과 branch를 다시한번 확인해주세요.<br>
아래 어떤 항목이 어떻게 변경되는지 내용을 확인할 수 있습니다.</p>
</div>
<figure><img src="@source/00-Howto/image/github-ui-create-pr.png" alt="create pr" tabindex="0" loading="lazy"><figcaption>create pr</figcaption></figure>
<p><code v-pre>Create pull request</code> 버튼을 클릭하면 디테일한 설명을 추가할 수 잇습니다. 문서 자체의 변경사항만으로 의도를 전달하기 힘든경우 해당 설명이 이해하는데 큰 도움이 됩니다.</p>
<figure><img src="@source/00-Howto/image/github-ui-create-pr-detail.png" alt="create pr detail" tabindex="0" loading="lazy"><figcaption>create pr detail</figcaption></figure>
<p>이제 Pull request가 받아들여지고나면 docmoa에 기여해주신 내용이 반영됩니다.</p>
<div class="hint-container warning">
<p class="hint-container-title">Build 주기</p>
<p>2021년 10월 4일 기준 매 5분마다 변경사항이 있으면 docmoa의 빌드가 수행됩니다.</p>
</div>
</div></template>


