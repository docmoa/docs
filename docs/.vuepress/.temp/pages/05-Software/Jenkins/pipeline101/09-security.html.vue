<template><div><h1 id="_9-security" tabindex="-1"><a class="header-anchor" href="#_9-security" aria-hidden="true">#</a> 9. Security</h1>
<h2 id="_9-1-securing-your-deployment-with-users" tabindex="-1"><a class="header-anchor" href="#_9-1-securing-your-deployment-with-users" aria-hidden="true">#</a> 9.1 Securing your deployment with users</h2>
<p>사용자별 배포수행을 위한 사용자 설정을 설명합니다.</p>
<ul>
<li><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>Configure Global Security</code>를 클릭합니다.</li>
</ul>
<p><code v-pre>Enable security</code>는 보안 설정 여부를 설정하는 항목으로 기본적으로는 비활성화되어있습니다. 체크하여 활성화하면 다양한 보안 옵션을 설정할 수 있는 항목이 표기 됩니다.</p>
<ul>
<li>Disable remember me : 로그인 시 사용자를 기억할지의 여부를 묻는 체크박스에 대한 활성/비활성 설정입니다.</li>
</ul>
<p>Security Realm 에서는 Jenkins에서 사용하는 사용자 관리 방식을 선택합니다.</p>
<ul>
<li>Delegate to servlet container : Jenkins를 실행하는 서블릿 컨테이너에서 접근을 관리합니다.</li>
<li>Jenkins' own user database : 기본 설정입니다. Jenkins 자체적으로 사용자 데이터를 관리합니다. <code v-pre>사용자의 가입 허용</code>이 활성화되면 Jenkins 에 접속하는 사용자는 스스로 계정을 생성하고 접근 가능합니다.</li>
<li>LDAP : 외부 LDAP과 연동하여 사용자를 관리합니다. LDAP 으로 계정을 통합 관리하는 경우 유용합니다.</li>
<li>Unix user/group database : Unix/Linux에서 해당 호스트의 사용자를 관리를 기반으로 연동합니다.</li>
</ul>
<p>Authorization 에서는 사용자 권한에 대한 설정을 정의합니다.</p>
<ul>
<li>Anyone can do anything : Jenkins에 접근할 수 있는 모든 요청을 허용합니다.</li>
<li>Legacy mode :  <code v-pre>1.164</code>이전 버전의 동작과 동일하게 관리됩니다. <code v-pre>Admin</code>사용자만 모든 기능을 수행하며, 일반 사용자와 비로그인 사용자는 읽기만 가능합니다.</li>
<li>Logged-in users can do anything : 로그인만 되면 모든 기능을 수행할 수 있는 설정압니다.</li>
<li>Matrix-based security : 매트릭스 기반으로 각 기능을 사용자와 그룹별로 조절할 수 있습니다.</li>
<li>Project-based Matrix Authorization Strategy : 매트릭스 기반 권한설정의 확장으로, 개별 프로젝트 별로 권한을 조정할 수 있습니다.</li>
</ul>
<p>다음은 권한 매트릭스의 항목과 권한별 설명입니다.</p>
<table>
<thead>
<tr>
<th style="text-align:left">항목</th>
<th style="text-align:left">권한</th>
<th style="text-align:left">의미</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left"><strong>Overall</strong></td>
<td style="text-align:left">Administer</td>
<td style="text-align:left">시스템의 전역 설정을 변경할 수 있다. OS 에서 허용된 범위안에서 전체 시스템 엑세스드의 매우 민감한 설정을 수행</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Read</td>
<td style="text-align:left">젠킨스의 모든 페이지 확인 가능</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">RunScripts</td>
<td style="text-align:left">그루비 콘솔이나 그루비 CLI 명령을 통해 그루비 스크립트를 실행</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">UploadPlugins</td>
<td style="text-align:left">특정 플러그인을 업로드</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">ConfigureUpdateCenter</td>
<td style="text-align:left">업데이트 사이트와 프록시 설정</td>
</tr>
<tr>
<td style="text-align:left"><strong>Slave</strong></td>
<td style="text-align:left">Configure</td>
<td style="text-align:left">기존 슬레이브 설정 가능</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Delete</td>
<td style="text-align:left">기존 슬레이브 삭제</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Create</td>
<td style="text-align:left">신규 슬레이브 생성</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Disconnect</td>
<td style="text-align:left">슬레이브 연결을 끊거나 슬레이브를 임시로 오프라인으로 표시</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Connect</td>
<td style="text-align:left">슬레이브와 연결하거나 슬레이브를 온라인으로 표시</td>
</tr>
<tr>
<td style="text-align:left"><strong>Job</strong></td>
<td style="text-align:left">Create</td>
<td style="text-align:left">새로운 작업 생성</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Delete</td>
<td style="text-align:left">기존 작업 삭제</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Configure</td>
<td style="text-align:left">기존 작업의 설정 갱신</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Read</td>
<td style="text-align:left">프로젝트 설정에 읽기 전용 권한 부여</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Discover</td>
<td style="text-align:left">익명 사용자가 작업을 볼 권한이 없으면 에러 메시지 표시를 하지 않고 로그인 폼으로 전환</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Build</td>
<td style="text-align:left">새로운 빌드 시작</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Workspace</td>
<td style="text-align:left">젠킨스 빌드를 실행 하기 위해 체크아웃 한 작업 영역의 내용을 가져오기 가능</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Cancel</td>
<td style="text-align:left">실행중인 빌드 취소</td>
</tr>
<tr>
<td style="text-align:left"><strong>Run</strong></td>
<td style="text-align:left">Delete</td>
<td style="text-align:left">빌드 내역에서 특정 빌드 삭제</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Update</td>
<td style="text-align:left">빌드의 설명과 기타 프로퍼티 수정(빌드 실패 사유등)</td>
</tr>
<tr>
<td style="text-align:left"><strong>View</strong></td>
<td style="text-align:left">Create</td>
<td style="text-align:left">새로운 뷰 생성</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Delete</td>
<td style="text-align:left">기존 뷰 삭제</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Configure</td>
<td style="text-align:left">기존 뷰 설정 갱신</td>
</tr>
<tr>
<td style="text-align:left"></td>
<td style="text-align:left">Read</td>
<td style="text-align:left">기존 뷰 보기</td>
</tr>
<tr>
<td style="text-align:left"><strong>SCM</strong></td>
<td style="text-align:left">Tag</td>
<td style="text-align:left">특정 빌드와 관련된 소스 관리 시스템에 태깅을 생성</td>
</tr>
</tbody>
</table>
<p>CSRF Protection 항목에 있는 <code v-pre>Prevent Cross Site Request Forgery exploits</code> 항목은  페이지마다 nonce 또는 crumb 이라 불리우는 임시 값을 삽입하여 사이트 간 요청 위조 공격을 막을 수 있게 해줍니다. 사용방법은 위에서 REST API 에 대한 설명 시 crumb 값을 얻고, 사용하는 방법을 참고합니다.</p>
<h2 id="_9-2-securing-secret-credentials-and-files" tabindex="-1"><a class="header-anchor" href="#_9-2-securing-secret-credentials-and-files" aria-hidden="true">#</a> 9.2 Securing secret credentials and files</h2>
<p>Jenkins에서 Pipeline을 설정하는 경우 일부 보안적인 값이 필요한 경우가 있습니다. 예를 들면 <code v-pre>Username</code>과 <code v-pre>Password</code> 같은 값입니다. 앞서의 과정에서 <code v-pre>Credentials</code>를 생성하는 작업을 일부 수행해 보았습니다. 여기서는 생성된  인증 값을 Pipeline에 적용하는 방법을 설명합니다.</p>
<p><code v-pre>Pipeline</code> 타입의 Item을 추가로 생성합니다. (e.g. 09-02.SecuringSecretCredentialsAndFiles) 설정은 다음과 같이 수행합니다.</p>
<ol>
<li>
<p><code v-pre>Pipeline</code> 스크립트에 다음과 같이 입력 합니다.</p>
<div class="language-groovy line-numbers-mode" data-ext="groovy"><pre v-pre class="language-groovy"><code>pipeline <span class="token punctuation">{</span>
    agent any
    environment <span class="token punctuation">{</span>
       SECRET<span class="token operator">=</span><span class="token function">credentials</span><span class="token punctuation">(</span><span class="token string">'jenkins-secret-text'</span><span class="token punctuation">)</span>
    <span class="token punctuation">}</span>
    stages <span class="token punctuation">{</span>
        <span class="token function">stage</span><span class="token punctuation">(</span><span class="token string">'Build'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            steps <span class="token punctuation">{</span>
                echo <span class="token interpolation-string"><span class="token string">"</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token expression">env<span class="token punctuation">.</span>SECRET</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span></span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>저장 후 <code v-pre>Build Now</code>를 클릭하여 빌드를 수행하면 실패하게 되고 <code v-pre>Console Output</code>에서 진행사항을 보면, Pipeline 스크립트에서 선언한 <code v-pre>jenkins-secret-text</code>때문에 에러가 발생한 것을 확인할 수 있습니다.</p>
</li>
<li>
<p>좌측 상단의 <code v-pre>Jenkins</code>버튼을 클릭하여 최상위 메뉴로 이동합니다.</p>
</li>
<li>
<p>좌측 메뉴의 <code v-pre>Credentials</code>를 클릭하고 <code v-pre>(global)</code> 도메인을 클릭합니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564534571013.png" alt="1564534571013" tabindex="0" loading="lazy"><figcaption>1564534571013</figcaption></figure>
</li>
<li>
<p>좌측에 <code v-pre>Add Credentials</code>를 클릭하여 새로운 항목을 추가합니다.</p>
<ul>
<li>Kind : Secret text</li>
<li>Secret : 해당 Credential에 담을 값을 기입합니다. (e.g. This is credential text.)</li>
<li>ID : jenkins-secret-text</li>
</ul>
</li>
<li>
<p>저장 후 다시 빌드를 수행하면 정상적으로 수행됩니다. 해당 값은 숨기기 위한 값이므로 Pipeline 스크립트에서 <code v-pre>echo</code>로 호출하더라도 <code v-pre>****</code>이란 값으로 표기 됩니다.</p>
</li>
</ol>
<p>이같은 방법은 Password같은 보안에 민감한 정보를 사용하기에 유용합니다.</p>
<h2 id="_9-3-auditing-your-environment" tabindex="-1"><a class="header-anchor" href="#_9-3-auditing-your-environment" aria-hidden="true">#</a> 9.3 Auditing your environment</h2>
<p>Jenkins의 변화와 활동에 대한 감시를 위한 설정 방법을 설명합니다. Jenkins에 새로운 플러그인을 추가하고 설정합니다.</p>
<ul>
<li><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>플러그인 관리</code>를 클릭합니다.</li>
<li><code v-pre>설치 가능</code> 탭을 클릭하고 상단의 검색에 <code v-pre>audit</code>를 입력하면 <code v-pre>Audit Trail</code>플러그인이 나타납니다. 선택하여 설치합니다.</li>
<li><code v-pre>Jenkins 관리</code>로 이동하여 <code v-pre>시스템 설정</code>을 클릭합니다.</li>
<li>Audit Trail 항목이 추가되었습니다. Loggers의 <code v-pre>ADD LOGGER</code>드롭박스에서  <code v-pre>Log File</code>을 선택하여 설정합니다.
<ul>
<li>Log Location : /var/jenkins_home/audit/audit.log</li>
<li>Log File Size MB : 100MB</li>
<li>Log File Count : 5</li>
</ul>
</li>
</ul>
<p>저장 후 빌드나 Job의 설정 변경등의 작업을 수행하면, <code v-pre>audit.log.0</code>으로 지정된 파일 경로에 생성됨을 확인 할 수 있습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">tail</span> <span class="token parameter variable">-f</span> ./audit.log.0
Jul <span class="token number">31</span>, <span class="token number">2019</span> <span class="token number">10</span>:47:32,727 AM job/02-02.Jobs/ <span class="token comment">#12 Started by user GyuSeok.Lee</span>
Jul <span class="token number">31</span>, <span class="token number">2019</span> <span class="token number">10</span>:47:42,738 AM /job/03-04.WebhookBuild Triggering/configSubmit by gyulee
Jul <span class="token number">31</span>, <span class="token number">2019</span> <span class="token number">10</span>:48:09,001 AM /configSubmit by gyulee
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-4-using-forders-to-create-security-realms" tabindex="-1"><a class="header-anchor" href="#_9-4-using-forders-to-create-security-realms" aria-hidden="true">#</a> 9.4 Using forders to create security realms</h2>
<p>다양한 프로젝트를 관리하는 경우 관리상, 빌드 프로젝트를 관리해야할 필요성이 발생합니다. Jenkins에서 Forder 아이템을 생성하여 관리 편의성과 보안요소를 추가할 수 있습니다.</p>
<p>우선 테스트를 위한 사용자를 추가합니다.</p>
<ul>
<li>좌측 메뉴에서 <code v-pre>Jenkins 관리</code>를 클릭하여 <code v-pre>Manage Users</code>로 이동합니다.</li>
<li><code v-pre>사용자 생성</code>을 클릭하여 새로운 사용자를 추가합니다.
<ul>
<li>계정명 : test</li>
<li>암호 : test</li>
<li>암호 확인 : test</li>
<li>이름 : tester</li>
<li>이메일 주소 : <a href="mailto:test@redhat.com">test@redhat.com</a></li>
</ul>
</li>
</ul>
<p>다음으로 Forder 타임의 Item을 추가합니다.</p>
<ul>
<li>좌측 메뉴에서 <code v-pre>새로운 Item</code>을 클릭하여 이름을 <code v-pre>02-Project</code>로 예를 들어 지정하고, Forder를 클릭하여 <code v-pre>OK</code>버튼을 클릭합니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564537956019.png" alt="1564537956019" loading="lazy"></li>
<li>설정 페이지가 나오면 <code v-pre>SAVE</code>버튼을 클릭하고 좌측 상단의 <code v-pre>Jenkins</code> 버튼을 클릭하여 최상위 페이지로 이동합니다.</li>
<li>기존 프로젝트를 새로 생성한 Forder 타입으로 이동시켜 봅니다.  최상위 화면에서 <code v-pre>02-02.Jobs</code>에 마우스를 대면 드롭박스 메뉴를 확장할 수 있습니다. <code v-pre>Move</code>를 클릭합니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564538201169.png" alt="1564538201169" loading="lazy"></li>
<li>드롭박스에서 <code v-pre>Jenkins &gt;&gt; 02-Project</code>를 선택하고 <code v-pre>MOVE</code>버튼을 클릭합니다. 다시 최상위 메뉴로 오면 <code v-pre>02-02.Jobs</code>가 사라진 것을 확인할 수 있습니다. <code v-pre>02</code> 로 시작하는 다은 프로젝트도 같은 작업을 수행하여 이동시킵니다.</li>
<li><code v-pre>02-Project</code>를 클릭하면 이동된 프로젝트들이 나타납니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564538419183.png" alt="1564538419183" loading="lazy"></li>
</ul>
<p>권한 설정을 하여 현재 Admin 권한의 사용자는 접근 가능하고 새로 생성한 tester는 접근불가하도록 설정합니다.</p>
<ul>
<li>
<p>Folder에 접근하는 권한을 설정하기위해 <code v-pre>Jenkins 관리</code>의 <code v-pre>Configure Global Security</code>로 이동합니다.</p>
</li>
<li>
<p>Authorization항목의 <code v-pre>Project-based Matrix Authorization Strategy</code>를 선택합니다.</p>
</li>
<li>
<p><code v-pre>ADD USER OR GROUP...</code>을 클릭하여 Admin 권한의 사용자를 추가합니다.</p>
</li>
<li>
<p>Admin 권한의 사용자에게는 모든 권한을 주고 <code v-pre>Authenticated Users</code>에는 Overall의 <code v-pre>Read</code> 권한만 부여합니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564543546039.png" alt="1564543546039" loading="lazy"></p>
</li>
<li>
<p>생성한 <code v-pre>02-Project</code>로 이동하여 좌측 메뉴의 <code v-pre>Configure</code>를 클릭합니다.</p>
</li>
<li>
<p>Properties에 추가된 <code v-pre>Enable project-based security</code>를 확성화하면 항목별 권한 관리 메트릭스가 표시됩니다. Job의 Build, Read, ViewStatus, Workspace를 클릭하고 View의 Read를 클릭하여 권한을 부여합니다.</p>
<figure><img src="@source/05-Software/Jenkins/pipeline101/image/1564540010695.png" alt="1564540010695" tabindex="0" loading="lazy"><figcaption>1564540010695</figcaption></figure>
</li>
<li>
<p>로그아웃 후에 앞서 추가한 <code v-pre>test</code>사용자로 로그인 하면 기본적으로 다른 프로젝트나 Item들은 권한이 없기 때문에 보이지 않고, 앞서 설정한 <code v-pre>02-Project</code> 폴더만 리스트에 나타납니다.<br>
<img src="@source/05-Software/Jenkins/pipeline101/image/1564543591394.png" alt="1564543591394" loading="lazy"></p>
</li>
</ul>
<p>Jenkins의 인증 기능을 사용하여 보안적 요소를 구성할 수 있습니다. Audit 로그를 활용하여 사용자별 활동을 기록할 수도 있고 Folder를 활용하면 간단히 사용자/그룹에 프로젝트를 구분하여 사용할 수 있도록 구성할 수 있습니다.</p>
</div></template>


