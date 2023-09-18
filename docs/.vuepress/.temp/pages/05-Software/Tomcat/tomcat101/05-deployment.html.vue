<template><div><h1 id="_5-tomcat-애플리케이션-배포" tabindex="-1"><a class="header-anchor" href="#_5-tomcat-애플리케이션-배포" aria-hidden="true">#</a> 5. Tomcat 애플리케이션 배포</h1>
<ul>
<li>Web Application</li>
<li>by Manager</li>
<li>by webapps DIR</li>
<li>by context.xml</li>
<li>ROOT</li>
<li>Auto Deployment &amp; Hot Deployment</li>
<li>Parallel Deployment</li>
</ul>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Hg-D7szI2t4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<hr>
<h2 id="_5-1-web-application" tabindex="-1"><a class="header-anchor" href="#_5-1-web-application" aria-hidden="true">#</a> 5.1 Web Application</h2>
<p>톰캣에 배치되는 어플리케이션은 Java Web Application입니다. 간단히 웹 어플리케이션이라고도 합니다. 간략한 구조는 다음과 같습니다.</p>
<p>::: vue<br>
./APPDIR<br>
├── WEB-INF<br>
│   ├── classes<br>
│   │   └── class-files<br>
│   ├── lib<br>
│   │   └── jar-files<br>
│   └── web.xml<br>
├── index.html<br>
└── index.jsp<br>
:::</p>
<p>APP 디렉토리 하위에는 웹어플리케이션의 정의를 넣을 WEB-INF 디렉토리가 필요합니다. 아주 간단한 어플리케이션은 <code v-pre>web.xml</code>에 다음의 태그만 넣어도 웹 어플리케이션으로 인지할 수 있습니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>web-app</span><span class="token punctuation">/></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_5-2-by-manager" tabindex="-1"><a class="header-anchor" href="#_5-2-by-manager" aria-hidden="true">#</a> 5.2 by Manager</h2>
<p>어플리케이션을 배치하는 방법에는 톰캣에서 제공하는 <code v-pre>manager</code>를 사용하는 방법이 있습니다. <code v-pre>manager</code>는 톰캣을 설치하면 제공되는 어플리케이션 관리 툴로 다음과 같이 확인할 수 있습니다.</p>
<ul>
<li><a href="http://ip" target="_blank" rel="noopener noreferrer">http://ip<ExternalLinkIcon/></a>:port 로 기본 톰캣 http 요청 (로컬에서 기본 설정으로 실행한 경우 <a href="http://localhost:8080" target="_blank" rel="noopener noreferrer">http://localhost:8080<ExternalLinkIcon/></a>)</li>
<li>ROOT 어플리케이션의 호출 확인 후 좌측의 'Manager App' 버튼 클릭</li>
<li>톰캣 유저의 설정이 되어있지 않으므로 로그인 창에서 '취소'버튼 클릭</li>
<li><code v-pre>$CATALINA_HOME/conf/tomcat-user.xml</code> 에 설정하는 방법을 에러페이지에서 확인</li>
<li><code v-pre>tomcat-user.xml</code>에 다음과 같이 설정 추가 (e.g. <code v-pre>user/passwd</code>를 <code v-pre>admin/admin</code>으로 설정)</li>
</ul>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>tomcat-users</span><span class="token punctuation">></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>role</span> <span class="token attr-name">rolename</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>manager-gui<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>user</span> <span class="token attr-name">username</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>admin<span class="token punctuation">"</span></span> <span class="token attr-name">password</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>admin<span class="token punctuation">"</span></span> <span class="token attr-name">roles</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>manager-gui<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>tomcat-users</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>톰캣 재기동 후 다시 로그인 페이지 호출하여 설정한 user/passwd 입력 후 로그인</li>
</ul>
<p>manager의 중간에 <code v-pre>Deploy</code>에서 배치를 수행할 수 있으며 두가지 타입이 제공됩니다. 한가지는 <code v-pre>Deploy directory or WAR file located on server</code>로서 톰캣이 기동된 서버내의 어플리케이션을 지정하여 배치하는 방법과 <code v-pre>WAR file to deploy</code>는 현재 접속중인 로컬의 WAR파일을 업로드하여 배치하는 방법입니다. 두 방법 모두 수행 후 <code v-pre>$CATALINA_HOME/webapps</code> 에 해당 어플리케이션이 위치하게 됩니다.</p>
<h2 id="_5-3-by-webapps-dir" tabindex="-1"><a class="header-anchor" href="#_5-3-by-webapps-dir" aria-hidden="true">#</a> 5.3 by webapps DIR</h2>
<p>톰캣에는 자동으로 어플리케이션을 인지하고 배치하는 디렉토리가 있습니다. 바로 <code v-pre>$CATALINA_HOME/webapps</code>입니다. 해당 경로는 앞서 manager 를 통한 배치시에도 어플리케이션이 위치하게되는 경로인데, manager를 사용하는 방법은 결국 webapps 디렉토리에 어플리케이션을 위치시키는 작업이라고 볼 수 있습니다. 따라서 직접 해당 경로에 어플리케이션을 위치시켜도 동일하게 배치 작업이 발생합니다.</p>
<p>webapps 디렉토리가 자동으로 배치를 수행하는 설정은 <code v-pre>server.xml</code>에서 해당 경로가 배치를 수행하도록 설정되었기 때문입니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Host</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>localhost<span class="token punctuation">"</span></span>  <span class="token attr-name">appBase</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>webapps<span class="token punctuation">"</span></span> <span class="token attr-name">unpackWARs</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span> <span class="token attr-name">autoDeploy</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Valve</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.valves.AccessLogValve<span class="token punctuation">"</span></span> <span class="token attr-name">directory</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>logs<span class="token punctuation">"</span></span>
           <span class="token attr-name">prefix</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>localhost_access_log.<span class="token punctuation">"</span></span> <span class="token attr-name">suffix</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>.txt<span class="token punctuation">"</span></span>
           <span class="token attr-name">pattern</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>%h %l %u %t <span class="token entity named-entity" title="&quot;">&amp;quot;</span>%r<span class="token entity named-entity" title="&quot;">&amp;quot;</span> %s %b<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Host</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>server.xml</code>에서 확인 할 수 있는 톰캣의 기본 host 환경인 <code v-pre>localhost</code>에서 webapps 디렉토리를 대상으로 autoDeploy를 수행한다는 설정 내용입니다. 이러한 설정으로 인해 자동으로 어플리케이션의 배치가 가능합니다.</p>
<h2 id="_5-4-by-context-xml" tabindex="-1"><a class="header-anchor" href="#_5-4-by-context-xml" aria-hidden="true">#</a> 5.4 by context.xml</h2>
<p>앞서 두가지의 manager나 webapps 디렉토리를 통한 배치 방법은 모두 톰캣 내부의 webapps 디렉토리에 어플리케이션이 위치하게 된다는 특징이 있습니다. 이러한 점은 사용자가 원하는 임의의 위치에 어플리케이션은 배제 된다는 의미 일 수도 있습니다. 따라서 이경우 <code v-pre>context.xml</code> 형태의 xml을 통한 배치 방법을 사용 할 수 있겠습니다.</p>
<p>배치를 설명하기에 앞서 <code v-pre>context.xml</code>의 <code v-pre>context</code> 디스크립터는 본래 server.xml에 위치하는 디스크립터였습니다. 하지만 해당 디스크립터에 설정되는 내용들은 변경사항이 자주 발생하는 항목들이기에 별도의 xml에서도 정의할 수 있도록 변경되었으며, 톰캣 5.5.12 버전부터는 server.xml이 아닌 별도의 context.xml을 통하여 해당 설정들을 관리하도록 권고하고 있습니다.</p>
<p><code v-pre>context.xml</code>에서 설정하는 정보는 어플리케이션 뿐만이 아니기 때문에 어플리케이션 설정을 제외한 설정을 톰캣에 적용하는 경우에도 사용됩니다. <code v-pre>context.xml</code>은 <code v-pre>&lt;Context&gt;</code> 디스크립터로 시작되며 다음의 위치에서 적용되고, 위치에 따라 적용 범위가 달라집니다.</p>
<ol>
<li>$CATALINA_HOME/conf/context.xml : $CATALINA_HOME 내의 모든 톰켓 프로세스 내의 서비스</li>
<li>$CATALINA_HOME/conf/[ENGINENAME]/[HOSTNAME]/context.xml.default : Host 범위 내의 모든 서비스</li>
<li>$CATALINA_HOME/conf/[ENGINENAME]/[HOSTNAME]/[WEBAPPNAME].xml : 어플리케이션 범위 내의 모든 서비스</li>
<li>$WEBAPP/META-INF/context.xml : 어플리케이션 범위 내의 모든 서비스</li>
</ol>
<p>이같은 위치에 따른 적용 범위는 context로 정의되는 대표적인 자원중 하나인 데이터소스(DataSource)의 경우 톰캣전체 또는 어플리케이션 별로 구분할 수 있는 기능을 사용할 수 있습니다.</p>
<p>어플리케이션을 배포하는 경우 위의 4가지 방법 중 3, 4번 항목을 들 수 있으며, 특히 <code v-pre>context.xml</code>을 사용한 임의의 위치의 어플리케이션 배포는 3번 항목을 사용하게 됩니다.</p>
<p><code v-pre>sample</code> context-root를 갖는 어플리케이션은 다음과 같이 <code v-pre>context.xml</code>을 설정할 수 있습니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token prolog">&lt;?xml version="1.0" encoding="UTF-8"?></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Context</span> <span class="token attr-name">path</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>sample<span class="token punctuation">"</span></span> <span class="token attr-name">docBase</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/Users/GSLee/APP/sample<span class="token punctuation">"</span></span> <span class="token attr-name">debug</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>0<span class="token punctuation">"</span></span> <span class="token attr-name">reloadable</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span> <span class="token attr-name">crossContext</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span> <span class="token attr-name">privileged</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>

<span class="token comment">&lt;!-- path는 해당 설정을 server.xml에 하는 경우 의미가 있고 3번 방법의 경우 xml 파일 이름이 context-root로 설정됩니다. --></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-5-root" tabindex="-1"><a class="header-anchor" href="#_5-5-root" aria-hidden="true">#</a> 5.5 ROOT</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/kOp9ahbtE9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>일반적으로 어플리케이션을 배치하는 경우 해당 어플리케이션의 디렉토리 이름이나 context로 설정된 xml의 파일 이름이 context-root로 사용됩니다.</p>
<p><code v-pre>http://www.mytomcat.co.kr/[WEBAPPNAME]/index.jsp</code></p>
<p>하지만 대부분의 경우 다음과 같이 요청되기를 바라죠.</p>
<p><code v-pre>http://www.mytomcat.co.kr/index.jsp</code></p>
<p>이경우 배치 방식은 동일하지만 다음의 네가지 방법을 통해 어플리케이션 배치 시 context-root를 <code v-pre>/</code>로 설정할 수 있습니다.</p>
<table>
<thead>
<tr>
<th>구성 위치</th>
<th>설명</th>
</tr>
</thead>
<tbody>
<tr>
<td>$CATALINA_HOME/webapps/ROOT</td>
<td>webapps 기본 디렉토리에 ROOT인 디렉토리명으로 배치된 어플리케이션</td>
</tr>
<tr>
<td>$CATALINA_HOME/conf/[ENGINENAME]/[HOSTNAME]/ROOT.xml</td>
<td>ROOT를 이름으로 갖는 context 타입의 xml로 배치된 어플리케이션</td>
</tr>
<tr>
<td>Tomcat Manager</td>
<td>APP에서 <code v-pre>context path</code> 항목을 비워놓은 채로 배치하는 어플리케이션</td>
</tr>
<tr>
<td>server.xml에 배치 어플리케이션을 설정</td>
<td><code v-pre>context</code> 디스크립터의 <code v-pre>path</code>항목을 비워놓음</td>
</tr>
</tbody>
</table>
<p>방법은 여러가지가 있지만 앞서 설명드린 <code v-pre>context</code>디스크립터로 설정한 별도의 xml을 사용한 배치 방식을 권장합니다.</p>
<p>sample 어플리케이션을 ROOT로 배치한 로그는 다음과 같이 확인됩니다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>정보: Starting Servlet Engine: Apache Tomcat/8.5.73
9월 06, 2014 8:30:52 오후 org.apache.catalina.startup.HostConfig deployDescriptor
정보: Deploying configuration descriptor /Users/GSLee/APP/tomcat/apache-tomcat-8.5.73/conf/Catalina/localhost/ROOT.xml
9월 06, 2014 8:30:52 오후 org.apache.catalina.core.StandardContext setPath
경고: A context path must either be an empty string or start with a '/'. The path [sample] does not meet these criteria and has been changed to [/sample]
9월 06, 2014 8:30:52 오후 org.apache.catalina.startup.SetContextPropertiesRule begin
경고: [SetContextPropertiesRule]{Context} Setting property 'debug' to '0' did not find a matching property.
9월 06, 2014 8:30:53 오후 org.rhq.helpers.rtfilter.filter.RtFilter init
정보: Initialized response-time filter for webapp with context root 'ROOT'.
9월 06, 2014 8:30:53 오후 org.apache.catalina.startup.HostConfig deployDescriptor
정보: Deployment of configuration descriptor /Users/GSLee/APP/tomcat/apache-tomcat-8.5.73/conf/Catalina/localhost/ROOT.xml has finished in 1,115 ms
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-6-auto-deployment-hot-deployment" tabindex="-1"><a class="header-anchor" href="#_5-6-auto-deployment-hot-deployment" aria-hidden="true">#</a> 5.6 Auto Deployment &amp; Hot Deployment</h2>
<p>Auto Deploy와 Hot Deploy는 Auto와 Hot을 어떻게 해석하는가에 따라 다음과 같이 혼용되어 사용됩니다.</p>
<ul>
<li>서버 프로세스가 기동 된 상태에서 배치</li>
<li>배치된 어플리케이션에 변경사항이 적용된 어플리케이션을 재배치</li>
<li>수행중인 어플리케이션의 일부 소스의 변경 적용과 반영</li>
</ul>
<p>의미가 어떻게 해석되던지 이런 용어를 사용함에 있어서 바라는점은 서비스가 실행중인 도중에도 변경사항을 사용자 모르게 바꾸고자 하는 의도가 대부분일 것입니다.</p>
<h3 id="_5-6-1-webapps-autodeploy" tabindex="-1"><a class="header-anchor" href="#_5-6-1-webapps-autodeploy" aria-hidden="true">#</a> 5.6.1 webapps 'autoDeploy'</h3>
<p>webapps 디렉토리에 어플리케이션을 넣으면 자동으로 배치가 됩니다. 서버가 기동된 상태에서도 말이죠. 해당 설정은 다음의 'Host' 디스크립터에서 정의합니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Host</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>localhost<span class="token punctuation">"</span></span> <span class="token attr-name">appBase</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>webapps<span class="token punctuation">"</span></span> <span class="token attr-name">unpackWARs</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span> <span class="token attr-name">autoDeploy</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      ...
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Host</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Host 설정에 autoDeploy가 <code v-pre>true</code>인 경우 해당 디렉토리에 위치하는 어플리케이션을 감지하여 자동으로 톰캣에 배치를 수행합니다.</p>
<h3 id="_5-6-2-jsp-checkinterval" tabindex="-1"><a class="header-anchor" href="#_5-6-2-jsp-checkinterval" aria-hidden="true">#</a> 5.6.2 jsp 'checkInterval'</h3>
<p>jsp를 사용자 뷰로 사용하는 경우 서비스의 컨텐츠, 또는 jsp에서 실행하는 코드상의 변경사항이 자주 발생하게 됩니다. 이경우 jsp를 새로 반영하기 위해 서버가 실행중임에도 자동으로 업데이트된 jsp를 컴파일하여 해당 소스를 반영하는 동작을 지원하는 설정이 있습니다. 해당 설정은 다음의 <code v-pre>$CATAILNA_HOME/conf/web.xml</code>의 jsp 서블릿에 정의되어 있습니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>servlet</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>servlet-name</span><span class="token punctuation">></span></span>jsp<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>servlet-name</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>servlet-class</span><span class="token punctuation">></span></span>org.apache.jasper.servlet.JspServlet<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>servlet-class</span><span class="token punctuation">></span></span>
    ...
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>init-param</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>param-name</span><span class="token punctuation">></span></span>development<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>param-name</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>param-value</span><span class="token punctuation">></span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>param-value</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>init-param</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>init-param</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>param-name</span><span class="token punctuation">></span></span>checkInterval<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>param-name</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>param-value</span><span class="token punctuation">></span></span>1<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>param-value</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>init-param</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>load-on-startup</span><span class="token punctuation">></span></span>3<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>load-on-startup</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>servlet</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>jsp 서블릿에서는 두가지 경우에 대해 jsp의 업데이트를 수행합니다.</p>
<ul>
<li>조건 1. <code v-pre>development</code>가 <code v-pre>true</code>인 경우 항상 확인</li>
<li>조건 2. <code v-pre>development</code>가 <code v-pre>false</code>이고 <code v-pre>checkInterval</code>이 <code v-pre>0</code>보다 큰 경우 확인합니다.</li>
</ul>
<p>관련 옵션에 대한 상세 내용이나 추가적인 jasper 컴포넌트의 옵션은 해당 설정의 위에 주석으로 설명이 되어있습니다.</p>
<h3 id="_5-6-3-class-reloadable" tabindex="-1"><a class="header-anchor" href="#_5-6-3-class-reloadable" aria-hidden="true">#</a> 5.6.3 Class 'reloadable'</h3>
<p>클래스를 수정하여 컴파일한 뒤 어플리케이션에 업로드하면 얼마 후 해당 어플리케이션(컨텍스트)를 리로딩하는 과정을 수행합니다. 해당 설정은 <code v-pre>Context</code> 디스크립터가 설정된 xml에 정의합니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Context</span> <span class="token attr-name">reloadable</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span> <span class="token attr-name">...</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Loader</span> <span class="token attr-name">checkInterval</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>15<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Context</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>reloadable</code>을 <code v-pre>true</code>로 설정하는 경우 해당 어플리케이션(컨텍스트)는 클래스에 변경이 발생하면 다시 리로딩하는 기능을 수행합니다. 간격은 기본 15초이기 때문에 더 빠른 방영을 원하시면 <code v-pre>Context</code>디스크립터 내에 <code v-pre>Loader</code>의 <code v-pre>checkInterval</code>을 정의함으로 시간을 조절할 수 있습니다. 하지만 이런 리로드 현상을 싫어하시는 분도 있습니다. <a href="kwon37xi.egloos.com/4710012">&quot;Tomcat Context 수동 Reload&quot;</a>라는 블로그 글에서도 보이듯 자동 리로드를 비활성화 하고 <code v-pre>Valve</code>를 사용하는 별도의 방법을 사용할 수도 있습니다.</p>
<hr>
<h2 id="_5-7-parallel-deployment" tabindex="-1"><a class="header-anchor" href="#_5-7-parallel-deployment" aria-hidden="true">#</a> 5.7 Parallel Deployment</h2>
<iframe width="560" height="315" src="https://www.youtube.com/embed/Bp789a8MBWI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>어플리케이션의 클래스가 수정되어 리로드가 발생하거나 라이브러리나 xml등의 재기동 후 반영되는 변경사항을 적용하기 위해서는 톰캣을 재기동해야 하는 상황이 발생합니다. 이런 경우 기존 어플리케이션은 기존에 사용중인 사용자가 계속 이용 할 수 있도록 활성화된 상태에서 새로운 버전의 어플리케이션을 배치, 새로운 사용자는 새로운 어플리케이션을~~(새술은 새부대에?)~~ 사용하도록 하는 <mark>Parallel Deployment</mark> 기능을 사용 할 수 있습니다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/appVersion.jpg?token=ADUAZXOCLTBA3NROCYL7SF267EUQK" alt="parallelDeploy" tabindex="0" loading="lazy"><figcaption>parallelDeploy</figcaption></figure>
<p>WebLogic Server 같은 타 WAS에서도 이와 유사한 '<a href="http://docs.oracle.com/middleware/1212/wls/DEPGD/redeploy.htm#DEPGD266" target="_blank" rel="noopener noreferrer">production redeployment<ExternalLinkIcon/></a>'기능이 있지만 톰캣이 좀더 쉬운 방법을 제공합니다.</p>
<p>그 방법은 <code v-pre>WEBAPP##[VersionNumber]</code>입니다. sample 어플리케이션으로 예를 들면 <code v-pre>sample##1.0</code>으로 배치를 수행하는 것입니다. 기존 어플리케이션 뒤에 샵 기호 두개와 버전이름만 붙이면 되기 때문에 매우 간단하지만 단점으로는 거의 동일한 구성과 용량의 독립적인 어플리케이션이 필요하기 때문에 어느정도 변경사항이 많은 경우 활용도가 높겠습니다. 버전은 <code v-pre>float</code> 형태로 정의하며 상대적으로 높은 값이 신규 배치가 됩니다. Context에서 지정하는 경우에는 어플리케이션 경로를 설정한 대로 샵 기호가 추가된 어플리케이션 이름을 지정하면 서비스 컨텍스트는 샵 기호와 버전이 제외된 기존 경로를 사용하게 됩니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Context</span> <span class="token attr-name">docBase</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/app/sample##01<span class="token punctuation">"</span></span> <span class="token attr-name">...</span> <span class="token punctuation">/></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Context</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Context</span> <span class="token attr-name">docBase</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/app/sample##02<span class="token punctuation">"</span></span> <span class="token attr-name">...</span> <span class="token punctuation">/></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Context</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>배치된 어플리케이션은 톰캣 Manager에서도 확인할 수 있습니다.</p>
<p>버전이 높은 어플리케이션이 배치되면 기존 사용자는 이전 버전의 어플리케이션 서비스를 이용하고 새로 접속하는 사용자는 신규 어플리케이션의 서비스를 이용하게 됩니다. 이전 버전의 어플리케이션은 톰캣 Manager에서 Session을 확인하여 사용자가 없는것을 확인 후 제거할 수 있습니다.</p>
</div></template>


