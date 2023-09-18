<template><div><h1 id="_3-tomcat-설치" tabindex="-1"><a class="header-anchor" href="#_3-tomcat-설치" aria-hidden="true">#</a> 3. Tomcat 설치</h1>
<ul>
<li>설치파일 받기</li>
<li>윈도우에 설치하기</li>
<li>유닉스/리눅스에 설치하기</li>
<li>설치 후 작업</li>
<li>디렉토리 구조</li>
</ul>
<iframe width="560" height="315" src="https://www.youtube.com/embed/621YGq7ulS4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<hr>
<p>설치되는 톰캣의 최상위 경로는 <code v-pre>$CATALINA_HOME</code> 으로 표현합니다.</p>
<h2 id="_3-1-설치파일-받기" tabindex="-1"><a class="header-anchor" href="#_3-1-설치파일-받기" aria-hidden="true">#</a> 3.1 설치파일 받기</h2>
<p>설치파일은 <a href="https://tomcat.apache.org/whichversion.html" target="_blank" rel="noopener noreferrer">톰캣 홈페이지<ExternalLinkIcon/></a>에서 좌측의 <code v-pre>Downloads</code>에서 설치하고자 하는 버전을 선택하면 우측에 Binary와 Source Code 두가지 형태로 받을 수 있습니다. Binary는 OS플랫폼에 맞게 미리 준비된 설치파일로서 Core에 해당하는 파일을 받습니다. 종류는 여섯가지로 나뉘어 있습니다.</p>
<ul>
<li>zip</li>
<li>tar.gz</li>
<li>32-bit Windows zip</li>
<li>64-bit Windows zip</li>
<li>64-bit Itanium Windows zip (<a href="https://tomcat.apache.org/tomcat-8.5-doc/changelog.html" target="_blank" rel="noopener noreferrer">8.5.0부터 제외<ExternalLinkIcon/></a>)</li>
<li>32-bit/64-bit Windows Service Installer</li>
</ul>
<p>zip과 tar.gz는 Unix/Linux환경에서 사용할 압축된 형태의 파일이고 나머지 네가지는 CPU 아키텍쳐에 맞게 컴파일된 zip 형태의 압축 파일과 서비스에 등록할수 있는 형태의 인스톨러로 구성되어 있습니다. 설치하고자 하는 OS와 CPU 아키텍처에 맞는 설치파일을 받아 준비합니다.</p>
<h2 id="_3-2-윈도우에-설치하기" tabindex="-1"><a class="header-anchor" href="#_3-2-윈도우에-설치하기" aria-hidden="true">#</a> 3.2 윈도우에 설치하기</h2>
<p>Windows에는 압축파일을 풀어 설치하는 방법과 서비스 등록을 위한 인스톨러 두가지 방식이 있었습니다. 압축파일 형태의 경우 압축을 풀기만하면 바로 실행이 가능합니다. 서비스 인스톨러의 경우 서비스에 등록하기 위한 설치 경로와 같은 정보를 입력하여 진행합니다.</p>
<p>압축파일로 설치한 경우 <code v-pre>%CATALINA_HOME%\bin</code>에 위치한 <code v-pre>startup.bat</code>으로 시작하고 <code v-pre>shutdown.bat</code>으로 종료합니다.</p>
<p>서비스로 설치한 경우 윈도우 서비스 관리 유틸리티에서 서비스의 '시작/종료'를 사용하거나 <code v-pre>net start (서비스이름)</code> 또는 <code v-pre>net stop (서비스이름)</code>을 사용하여 서비스의 시작과 종료가 가능합니다.</p>
<h2 id="_3-3-유닉스-리눅스-맥-에-설치하기" tabindex="-1"><a class="header-anchor" href="#_3-3-유닉스-리눅스-맥-에-설치하기" aria-hidden="true">#</a> 3.3 유닉스/리눅스/맥 에 설치하기</h2>
<p>Unix/Linux의 binary 설치파일은 압축을 풀어 설치합니다.</p>
<p><code v-pre>$CATALINA_HOME/bin</code>에 위치한 <code v-pre>startup.sh</code>으로 시작하고 <code v-pre>shutdown.sh</code>으로 종료합니다.</p>
<h2 id="_3-4-설치-후-작업" tabindex="-1"><a class="header-anchor" href="#_3-4-설치-후-작업" aria-hidden="true">#</a> 3.4 설치 후 작업</h2>
<p>설치 방법은 매우 간단하나 설치 후 꼭 해야할 작업이 있습니다. Java Home을 설정하고 성능을 위한 Native library를 설치하는 작업 입니다.</p>
<p>Java Home의 경우 앞서 JDK를 OS에 설치하였다면 톰캣에서 이를 사용할 수 있도록 경로를 잡아주는 과정입니다. OS자체의 PATH나 환경변수로 지정하는 방법도 있고 톰캣의 스크립트에 변수로 넣어주는 방법이 있습니다. OS자체의 PATH로 설정하는 경우 해당 OS에 설치된 모든 Java 실행환경이 영향을 받게 됩니다. 따라서 일관된 서비스, 일관된 톰캣 운영 환경인 경우 같은 Java Home이 설정되는 장점이 있습니다. 이와달리 스크립트에 Java Home을 설정하면 해당 톰캣에서만 관련 설정의 영향을 받습니다. OS내에 서로 다른 JDK로 동작하는 서비스나 어플리케이션이 있다면 스크립트를 이용하는 방법을 사용할 수 있습니다.</p>
<h3 id="_3-4-1-java-home-설정하기" tabindex="-1"><a class="header-anchor" href="#_3-4-1-java-home-설정하기" aria-hidden="true">#</a> 3.4.1 Java Home 설정하기</h3>
<p>OS 환경에 Java Home을 설정하는 방법은 다음과 같습니다. (Java Home은 JDK의 bin 디렉토리를 포함한 상위 디렉토리 입니다.)</p>
<h4 id="_3-4-1-1-환경변수로-지정" tabindex="-1"><a class="header-anchor" href="#_3-4-1-1-환경변수로-지정" aria-hidden="true">#</a> 3.4.1.1 환경변수로 지정</h4>
<Tabs id="115" :data='[]'>
</Tabs>
<h4 id="_3-4-1-2-스크립트에-추가" tabindex="-1"><a class="header-anchor" href="#_3-4-1-2-스크립트에-추가" aria-hidden="true">#</a> 3.4.1.2 스크립트에 추가</h4>
<p>스크립트에 Java_Home을 설정하는 경우 <code v-pre>catalina.sh(bat)</code>에 <code v-pre>JAVA_HOME</code> 으로 지정하는 경우가 있습니다. 추가로 <code v-pre>setenv.sh(bat)</code>을 생성하여 해당 스크립트에 설정하는 방법을 권장합니다.</p>
<Tabs id="133" :data='[]'>
</Tabs>
<p>Windows환경에서 Java를 <code v-pre>C:\Program Files</code>에 설치하는 경우 중간에 공백이 있기 때문에 <code v-pre>C:\Progra~1</code>로 표현함에 주의합니다.</p>
<h4 id="_3-4-2-native-library-적용하기-옵션" tabindex="-1"><a class="header-anchor" href="#_3-4-2-native-library-적용하기-옵션" aria-hidden="true">#</a> 3.4.2 Native Library 적용하기 (옵션)</h4>
<p>톰캣의 Native Library를 적용하지 않고도 충분히 톰캣을 실행하고 사용할 수 있습니다. 다만 톰캣의 콘솔 로그에 다음의 메시지가 걸리적(?)거리게 발생합니다.</p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code>The APR based Apache Tomcat Native library which allows optimal performance in production environments was not found on the <span class="token domain constant">java.library.path</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>굳이 필요하지 않다면 적용하지 않아도 되지만 Native Library가 주는 이점은 다음과 같습니다.</p>
<ul>
<li>Non-blocking I/O for Keep-Alive requests (between requests)</li>
<li>Uses OpenSSL for TLS/SSL capabilities (if supported by linked APR library)</li>
<li>FIPS 140-2 support for TLS/SSL (if supported by linked OpenSSL library)</li>
</ul>
<p>결국 NIO(Non-Blocking I/O)를 지원하는 것과 SSL관련 설정을 지원합니다. OpenSSL을 사용하지 않아도 NIO를 사용하는 성능상의 이점을 제공합니다.</p>
<p>Native Library를 사용하기 위해서는 APR과 Tomcat Native 소스 파일이 필요합니다. APR은 Apache 2.0 이상 버전이 설치되어있다면 해당 설치 경로의 <code v-pre>$APACHE_HOME/bin/apr-1-config</code>과 같이 존재하나 없는 경우 별도의 APR을 설치합니다.</p>
<p>(Apache APR 홈페이지 : <a href="http://apr.apache.org/" target="_blank" rel="noopener noreferrer">http://apr.apache.org/<ExternalLinkIcon/></a>)</p>
<p>APR 홈페이지에서 받은 apr-x.x.x.tar.gz 파일은 다음의 순서를 따라 설치를 진행하며, 예제와 같이 <code v-pre>/usr/local</code>에 설치하는 경우 root 계정이 필요합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">gzip</span> <span class="token parameter variable">-d</span> apr-1.5.1.tar.gz
$ <span class="token function">tar</span> <span class="token parameter variable">-xvf</span> apr-1.5.1.tar
$ configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr/local/apr-1.5.1
$ <span class="token function">make</span>
$ <span class="token function">make</span> <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>일반적인 경우 Tomcat이 설치되면 설치된 경로의 &quot;$CATALINA_HOME/bin&quot; 위치에 tomcat-native.tar.gz 형태로 설치 파일이 존재하나 없는 경우, 혹은 높은 버전을 설치하고 싶은 경우 별도로 다운로드 받아 진행합니다. Native의 다운로드는 톰켓 홈페이지의 좌측 <code v-pre>Downloads</code>의 하위에 <a href="http://tomcat.apache.org/download-native.cgi" target="_blank" rel="noopener noreferrer">Tomcat Native<ExternalLinkIcon/></a>로 존재합니다. 관련 링크를 클릭하면 우측에 OS플랫폼에 맞게 소스를 받을 수 있는 링크가 제공됩니다.</p>
<p>Native Library는 다음과 같이 설치를 진행합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">gzip</span> <span class="token parameter variable">-d</span> tomcat-native.tar.gz
$ <span class="token function">tar</span> <span class="token parameter variable">-xvf</span> tomcat-native.tar
$ configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span><span class="token variable">$CATALINA_HOME</span> --with-apr<span class="token operator">=</span>/usr/local/apr-1.5.1/bin/apr-1-config  --with-java-home<span class="token operator">=</span><span class="token variable">$JAVA_HOME</span>
$ <span class="token function">make</span>
$ <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>소스의 컴파일과 설치가 완료되면 &quot;$CATALINA_HOME/lib&quot;에서 libtcnative 관련 파일의 확인을 할 수 있습니다.</p>
<p>Native Library가 해당 플랫폼 환경에 맞게 생성되었다면 Shared Library로 설정하여 적용하며 적용방법은 앞서 Java Home을 설정하는 방법을 이용합니다. Shared Library 환경변수명은 OS마다 상이함에 주의하며 <a href="http://setenv.sh" target="_blank" rel="noopener noreferrer">setenv.sh<ExternalLinkIcon/></a>(bat)에 적용하는 방법은 다음과 같습니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># setenv.sh(bat)</span>
LD_LIBRARY_PATH <span class="token string">"<span class="token variable">$CATALINA_HOME</span>/lib"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><table>
<thead>
<tr>
<th>OS</th>
<th>Shared Library Path</th>
</tr>
</thead>
<tbody>
<tr>
<td>Windows</td>
<td>PATH</td>
</tr>
<tr>
<td>Solaris</td>
<td>LD_LIBRARY_PATH</td>
</tr>
<tr>
<td>HP-UX</td>
<td>SHLIB_PATH</td>
</tr>
<tr>
<td>AIX</td>
<td>LIBPATH,LD_LIBRARY_PATH</td>
</tr>
<tr>
<td>Linux</td>
<td>LD_LIBRARY_PATH</td>
</tr>
<tr>
<td>OS/2</td>
<td>LIBPATH</td>
</tr>
<tr>
<td>OSX</td>
<td>LD_LIBRARY_PATH</td>
</tr>
</tbody>
</table>
<p>적용된 Native Library는 톰캣의 콘솔 로그 &quot;$CATALINA_HOME/logs/catalina.out(log)&quot;에서 다음의 메시지를 확인 할 수 있습니다.</p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code><span class="token property">Info:</span> Loaded APR based Apache Tomcat Native library <span class="token number">1.1.31</span><span class="token punctuation">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></div></template>


