<template><div><h1 id="_8-tomcat-웹서버-연동" tabindex="-1"><a class="header-anchor" href="#_8-tomcat-웹서버-연동" aria-hidden="true">#</a> 8. Tomcat 웹서버 연동</h1>
<ul>
<li>웹서버 연동의 이유</li>
<li>mod_jk</li>
<li>클러스터</li>
</ul>
<iframe width="560" height="315" src="https://www.youtube.com/embed/j6qeCBWM4YI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<hr>
<h2 id="_8-1-웹서버-연동의-이유" tabindex="-1"><a class="header-anchor" href="#_8-1-웹서버-연동의-이유" aria-hidden="true">#</a> 8.1 웹서버 연동의 이유</h2>
<p>톰캣 단일로 서비스하는 경우도 있지만 일반적으로 웹서버와 연동하여 사용하는 경우가 보다 더 많습니다. 그 이유를 다음과 같이 정리합니다.</p>
<h3 id="_8-1-1-요청분산" tabindex="-1"><a class="header-anchor" href="#_8-1-1-요청분산" aria-hidden="true">#</a> 8.1.1 요청분산</h3>
<p>톰캣에서 처리하는 서비스 요청이 증가하면 단일 프로세스로 처리가 부족한 상황이 발생합니다. 처리에 필요한 힙 메모리를 추가해야 한다면 현재 적용된 메모리 설정보다 더 많은 값을 설정하고 CPU 자원이 부족하다면 장비의 교체도 고려해 봐야겠습니다. 이런 접근은 가용한 메모리가 없거나 더 나은  장비를 추가 구입/구성 해야하는 점이 있습니다. 따라서 단일 프로세스의 한계를 유연하게 대처하기 위해 복수의 프로세스에서 동일한 서비스를 구성하는 방안을 고려할 수 있습니다. 그리고 복수의 프로세스에 요청을 전달하기 위해 LB(LoadBalancer)가 필요합니다.</p>
<p>LB 기능을 수행하는 대표적인 두가지는 네트워크 장비(스위치 장비: L2, L4, L7)를 사용하는 방법과 HTTP 요청을 받아 분산이 가능한 웹서버 입니다. 어떤 방법을 사용하던지 복수개의 톰캣을 사용하면 상황에 따라 프로세스를 추가하여 처리하는 용량을 증가시킬 수 있습니다. 물론 앞서 장비의 추가 상황을 제외한다면 단일 프로세스 보다는 복수의 프로세스를 사용하여 부하를 분산시킬 수 있습니다.</p>
<h3 id="_8-1-2-소스분산" tabindex="-1"><a class="header-anchor" href="#_8-1-2-소스분산" aria-hidden="true">#</a> 8.1.2 소스분산</h3>
<p>톰캣은 웹서버의 역할을 함께 수행할 수 있는 기능을 동반하고 있습니다. 하지만 정적인 소스를 처리함에 있어서는 기존 웹서버의 처리 능력이 더 우월하기 때문에 소스 처리의 추체를 분산시켜 처리 속도를 증가시킬 수 있습니다. 대표적인 정적인 소스는 html, css, 이미지 파일 입니다. 앞서 요청의 분산으로 부하를 분산시키는 역할과 더불어 어플리케이션 소스 또한 처리추체를 분산시키고, 더불어 웹서버와 톰캣에서 좀더 빠르게 처리 할 수 있고, 처리 가능한 요청의 처리를 분담할 수 있습니다.</p>
<h3 id="_8-1-3-장애극복" tabindex="-1"><a class="header-anchor" href="#_8-1-3-장애극복" aria-hidden="true">#</a> 8.1.3 장애극복</h3>
<p>일반적으로 Failover로 표현하는 장애처리 및 장애극복은 복수의 톰캣 프로세스를 사용함에 따른 장점입니다. 특정 톰캣 프로세스에 장애가 발생하더라도 다른 톰캣 프로세스에서 요청을 처리하게 됨으로 단일 프로세스로 운영할때보다 서비스 지속성에 장점을 갖습니다.</p>
<hr>
<h2 id="_8-2-mod-jk" tabindex="-1"><a class="header-anchor" href="#_8-2-mod-jk" aria-hidden="true">#</a> 8.2 mod_jk</h2>
<p>웹서버는 프록시 기능만을 사용하여도 톰캣과의 연동이 가능하나 톰캣으로의 연동을 좀더 긴밀하게 하기 위해 별도의 모듈을 제공합니다. 이는 <code v-pre>Tomcat Connector</code>로 제공되는데 <a href="http://tomcat.apache.org" target="_blank" rel="noopener noreferrer">http://tomcat.apache.org<ExternalLinkIcon/></a>의 Document와 Download에서 확인할 수 있습니다. 연동가능한 대표적인 웹서버로는 다음의 웹서버와 모듈이 요구됩니다.</p>
<ul>
<li>Apache HTTP Server : mod_jk.so, mod_jk.dll</li>
<li>IIS : isapi_redirect.dll</li>
<li>iPlanet : nsapi_redirector.so, nsapi_redirector.dll</li>
</ul>
<p>아파치(Apache HTTP Server)는 가장 많이 사용되고 모든 플랫폼을 지원하는 대표적인 웹서버로서 이번 장에서 설명하고자하는 웹서버와의 연동에서 사용하고자 합니다. 기타 웹서버의 경우 톰캣의 <a href="http://tomcat.apache.org/connectors-doc/" target="_blank" rel="noopener noreferrer">토큐먼트<ExternalLinkIcon/></a> 내용을 참고하시기 바랍니다.</p>
<p>아파치가 설치되었다는 가정하에 톰캣을 연동하는 방법은 다음과 같습니다.</p>
<h3 id="_8-2-1-mod-jk-다운로드" tabindex="-1"><a class="header-anchor" href="#_8-2-1-mod-jk-다운로드" aria-hidden="true">#</a> 8.2.1 mod_jk 다운로드</h3>
<p>유닉스/리눅스/맥의 경우 mod_jk의 소스를 다운받아 아파치의 <code v-pre>apxs</code>와 함께 컴파일하는 과정이 필요합니다. 윈도우에서도 컴파일하여 사용할 수 있으나 비쥬얼 스튜디오가 있어야 컴파일을 할 수 있기 때문에 별도의 바이너리 파일로 제공됩니다. 다운로드페이지에서 플랫폼에 맞는 모듈을 다운받습니다.</p>
<h3 id="_8-2-2-모듈-컴파일" tabindex="-1"><a class="header-anchor" href="#_8-2-2-모듈-컴파일" aria-hidden="true">#</a> 8.2.2 모듈 컴파일</h3>
<p>유닉스/리눅스/맥의 경우 컴파일을 수행하기위해 아파치의 'apxs'가 필요합니다. 다운받은 소스 압축파일을 풀고 다음과 같이 컴파일 합니다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">tar</span> xvfz tomcat-connectors-1.2.40-src.tar.gz
$ <span class="token builtin class-name">cd</span> ~/Downloads/tomcat-connectors-1.2.40-src/native
$ ./configure —with-apxs<span class="token operator">=</span><span class="token variable">$APACHE_HOME_DIR</span>/bin/apxs
$ <span class="token function">make</span>
$ <span class="token function">make</span> <span class="token function">install</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>컴파일이 완료된 모듈은 자동으로 <code v-pre>$APACHE_HOME/modules/mod_jk.so</code>로 생성됩니다. 윈도우에서는 다운 받은 바이너리 모듈의 압축을 풀어 동일한 디렉토리에 복사하면 됩니다.</p>
<h3 id="_8-2-3-모듈-설정" tabindex="-1"><a class="header-anchor" href="#_8-2-3-모듈-설정" aria-hidden="true">#</a> 8.2.3 모듈 설정</h3>
<p>생성된 모듈을 아파치에서 사용할 수 있도록 설정하는 작업을 합니다. <code v-pre>$APACHE_HOME/conf/httpd.conf</code>에 설정하거나 별도의 <code v-pre>conf</code>파일을 생성하여 읽게 하여도 됩니다. <code v-pre>httpd.conf</code>에 설정하는 내용은 다음과 같습니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code>LoadModule jk_module modules/mod_jk.so

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>IfModule</span> <span class="token attr-name">jk_module</span><span class="token punctuation">></span></span>
    JkWorkersFile conf/workers.properties
    JkLogFile logs/mod_jk.log
    JkLogLevel info
    JkMountFile conf/uri.properties
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>IfModule</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>JkWorkersFile</code>은 요청을 처리하는 워커, 즉 톰캣을 정의하는 파일을 지정합니다.</p>
<p><code v-pre>JkMountFile</code>은 워커와 워커가 처리할 요청을 맵핑하는 파일을 지정합니다. <code v-pre>JkMount</code>만으로도 설정이 가능하나 하나의 파일에서 별도로 관리하기 위해서는 해당 파일을 지정하는 것을 권장합니다. <code v-pre>httpd.conf</code>에 <code v-pre>JkMount</code>를 사용하는 경우 다음과 같이 정의할 수 있습니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code>#jsp 파일을 worker1 워커가 처리하는 경우
JkMount /*.jsp  worker1

#server 경로의 요청을 worker2 워커가 처리하는 경우
JkMount /servlet/* worker2
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_8-2-4-워커-정의" tabindex="-1"><a class="header-anchor" href="#_8-2-4-워커-정의" aria-hidden="true">#</a> 8.2.4 워커 정의</h3>
<p>워커는 그 단어의 의미에서도 추측할 수 있듯이 mod_jk에서 지정하는 요청을 처리하는 대상, 즉 톰켓 프로세스를 의미합니다. 워커는 다음과 같은 설정 방식을 따릅니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code>worker.[WORKER_NAME].[TYPE]=[VALUE]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>설정의 예는 다음과 같습니다.</p>
<ul>
<li>worker.list=[WORKER_NAME] : 요청을 처리하는 워커를 나열합니다.</li>
<li>worker.worker1.type=ajp13 : worker1 워커의 형태를 정의합니다.</li>
<li>worker.worker2.host=192.168.0.11 : worker2 워커의 address를 정의합니다.</li>
<li>worker.loadbalancer.type=lb : loadbalancer 워커의 형태를 정의합니다.</li>
<li>worker.loadbalancer.balance_workers=[WORKER_NAME] : lb 형태인 loadbalancer 워커에서 요청을 분산시킬 워커를 나열합니다.</li>
</ul>
<p><code v-pre>worker.properties</code>의 설정 예제는 다음과 같습니다.<br>
<img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/workerproperties.jpg?token=ADUAZXKQI5JMPI7G5L7PVNS67EUS4" alt="workersproperties" loading="lazy"></p>
<p>해당 설정은 LB로 구성되는 워커를 정의합니다. LB로 구성될 <code v-pre>worker1</code>과 <code v-pre>worker2</code>를 정의합니다.</p>
<ul>
<li><code v-pre>worker1</code>은 <code v-pre>192.168.0.10</code>의 ip와 <code v-pre>8009</code>포트로 <code v-pre>ajp13</code>형태의 요청을 받아들이며 <code v-pre>lbfactor</code>는 1입니다.</li>
<li><code v-pre>worker2</code>은 <code v-pre>192.168.0.11</code>의 ip와 <code v-pre>8009</code>포트로 <code v-pre>ajp13</code>형태의 요청을 받아들이며 <code v-pre>lbfactor</code>는 1입니다.</li>
<li><code v-pre>loadbalancer</code>는 LB를 수행하기 위한 워커로 <code v-pre>lb</code> 워커 형태입니다.</li>
<li><code v-pre>lb</code>형태의 워커는 LB 대상 워커를 <code v-pre>balace_workers</code>를 정의하여 나열합니다. 예제에서는 <code v-pre>worker1</code>과 <code v-pre>worker2</code>가 대상으로 지정되었습니다.</li>
<li>각 톰캣과의 연동 워커인 <code v-pre>worker1</code>과 <code v-pre>worker2</code>는 <code v-pre>lbfactor</code>가 같기 때문에 같은 비율로 요청이 전달됩니다.</li>
<li>요청을 처리하는 워커는 <code v-pre>worker.list</code>에 지정합니다. 예제에서는 <code v-pre>loadbalancer</code> 워커를 지정하였습니다.</li>
</ul>
<h3 id="_8-2-5-처리할-요청의-정의" tabindex="-1"><a class="header-anchor" href="#_8-2-5-처리할-요청의-정의" aria-hidden="true">#</a> 8.2.5 처리할 요청의 정의</h3>
<p>워커의 정의로 요청을 처리할 워커가 준비되었다면 어떤 요청을 전달할지 정의해햐 합니다. 앞서 <code v-pre>JkMount</code>를 사용한 방식은 간단히 설명하였고 여기서는 <code v-pre>uri.properties</code> 파일에서 별도로 요청의 처리 맵핑을 관리하도록 하였습니다. <code v-pre>JkMountFile</code>로 지정되는 이 설정 파일은 다음과 같은 설정 방식을 따릅니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code>[URL or FILE_EXTENSION]=[WORKER or WORKER_LIST]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>이렇게 설정되는 설정 파일의 내용의 예는 다음과 같습니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code>/*.do=worker1
/*.jsp=worker2
/servlet/*=loadbalancer
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>JkMount</code>와 표현방식에 약간의 차이('='의 사용여부)가 있음에 주의하여 설정합니다.</p>
<h2 id="_8-2-6-테스트" tabindex="-1"><a class="header-anchor" href="#_8-2-6-테스트" aria-hidden="true">#</a> 8.2.6 테스트</h2>
<p>설정이 완료되면 아파치 프로세스를 재기동 합니다. 이후 맵핑한 요청설정에 따라 아파치에 요청을 합니다. jsp파일을 톰캣이 처리하도록 설정하였다면 톰캣에서 요청해보고 url을 아파치로 변경하여 동일하게 요청되는지 확인합니다.</p>
<hr>
<h2 id="_8-3-클러스터" tabindex="-1"><a class="header-anchor" href="#_8-3-클러스터" aria-hidden="true">#</a> 8.3 클러스터</h2>
<p>웹서버와 연동하는 주요 기능중 한가지는 장애처리입니다. 일반적으로는 이런 장애처리 동작시 기존 처리중이던 HTTP Session 정보는 장애가 발생한 톰캣이 가지고 있었기 때문에 없어지게 됩니다. 이같은 현상은 기존에 로그인하여 작업을 하던 중 해당 톰캣 프로세스에 문제가 발생하여 다른 톰캣 프로세스로 요청이 넘어가면 로그인 하던 세션이 끊겨 다시금 작업을 수행하는 현상이 발생하는 것을 예로 들수 있습니다.</p>
<p>톰캣에서는 장애처리시의 HTTP Session을 복구하여 지속적인 세션의 유지를 가능하게 하고자 '클러스터' 기능을 제공합니다. 클러스터는 Multicast로 톰캣 프로세스간에 클러스터를 형성하고 멤버로 구성된 톰캣간에 세션을 공유하는 방식입니다.</p>
<p>기능의 활성화는 단순히 <code v-pre>server.xml</code>의 <code v-pre>Cluster</code> 디스크립터의 주석을 해제하는 것만으로도 가능합니다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/great-stone.github.io/master/assets/img/Tomcat_youtube/tomcatCluster.png" alt="tomcatCluster.png" tabindex="0" loading="lazy"><figcaption>tomcatCluster.png</figcaption></figure>
<p>하지만 동일 장비에서 기동되는 톰캣간이나 서비스가 다른 톰캣이 여럿 기동중인 경우에는 설정값들이 중복되어 톰캣 기동이나 서비스 처리시 문제가 발생할 수 있습니다. 따라서 기본적인 설정 값 외에 별도의 설정들을 적용해야 하는 경우 <code v-pre>server.xml</code>에서 클러스터를 사용하기 위한 디스크립터 위에 설명한 도큐먼트의 내용을 참고해야 합니다.</p>
<p>만약 도큐먼트의 설정들이 너무 많거나 어떻게 적용해야 하는지 이해하기 힘든경우 톰캣 5.5버전의 <code v-pre>server.xml</code>을 참고하시기 바랍니다. 해당 버전에서는 6.0 이후 단순히 한줄로 적용된 <code v-pre>Cluster</code> 디스크립터와는 다르게 기본적인 설정과 값이 같이 적용되어 있습니다. 아래 예제는 도큐먼트의 기본 설정에서 가져온 내용입니다.</p>
<p><a href="http://tomcat.apache.org/tomcat-7.0-doc/cluster-howto.html" target="_blank" rel="noopener noreferrer">http://tomcat.apache.org/tomcat-7.0-doc/cluster-howto.html: 기본 설정<ExternalLinkIcon/></a></p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Cluster</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.ha.tcp.SimpleTcpCluster<span class="token punctuation">"</span></span>
         <span class="token attr-name">channelSendOptions</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>8<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Manager</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.ha.session.DeltaManager<span class="token punctuation">"</span></span>
           <span class="token attr-name">expireSessionsOnShutdown</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>false<span class="token punctuation">"</span></span>
           <span class="token attr-name">notifyListenersOnReplication</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Channel</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.tribes.group.GroupChannel<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Membership</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.tribes.membership.McastService<span class="token punctuation">"</span></span>
                <span class="token attr-name">address</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>228.0.0.4<span class="token punctuation">"</span></span>
                <span class="token attr-name">port</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>45564<span class="token punctuation">"</span></span>
                <span class="token attr-name">frequency</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>500<span class="token punctuation">"</span></span>
                <span class="token attr-name">dropTime</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>3000<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Receiver</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.tribes.transport.nio.NioReceiver<span class="token punctuation">"</span></span>
              <span class="token attr-name">address</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>auto<span class="token punctuation">"</span></span>
              <span class="token attr-name">port</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>4000<span class="token punctuation">"</span></span>
              <span class="token attr-name">autoBind</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>100<span class="token punctuation">"</span></span>
              <span class="token attr-name">selectorTimeout</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>5000<span class="token punctuation">"</span></span>
              <span class="token attr-name">maxThreads</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>6<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>

    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Sender</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.tribes.transport.ReplicationTransmitter<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Transport</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.tribes.transport.nio.PooledParallelSender<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Sender</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Interceptor</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.tribes.group.interceptors.TcpFailureDetector<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Interceptor</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.tribes.group.interceptors.MessageDispatch15Interceptor<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Channel</span><span class="token punctuation">></span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Valve</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.ha.tcp.ReplicationValve<span class="token punctuation">"</span></span>
         <span class="token attr-name">filter</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Valve</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.ha.session.JvmRouteBinderValve<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>

    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Deployer</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.ha.deploy.FarmWarDeployer<span class="token punctuation">"</span></span>
              <span class="token attr-name">tempDir</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/tmp/war-temp/<span class="token punctuation">"</span></span>
              <span class="token attr-name">deployDir</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/tmp/war-deploy/<span class="token punctuation">"</span></span>
              <span class="token attr-name">watchDir</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/tmp/war-listen/<span class="token punctuation">"</span></span>
              <span class="token attr-name">watchEnabled</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>false<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>

    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ClusterListener</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.ha.session.JvmRouteSessionIDBinderListener<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ClusterListener</span> <span class="token attr-name">className</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.apache.catalina.ha.session.ClusterSessionListener<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Cluster</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>앞서 여러개의 톰캣 클러스터를 사용하는 경우 <code v-pre>Membership</code>과 <code v-pre>Reciver</code> 디스크립터의 내용에 주의합니다. <code v-pre>Membership</code>은 동일한 설정을 갖는 톰캣 끼리 같은 클러스터 멤버 그룹으로 인지하는 내용으로 멀티캐스트 통신을 수행합니다. <code v-pre>Membershop</code>의 <code v-pre>address</code>와 <code v-pre>port</code>가 동일한 톰캣 프로세스 끼지 클러스터 기능을 수행합니다.  <code v-pre>Reciver</code>는 클러스터간의 메시지를 주고받는 역할을 수행하며 TCP 통신을 수행합니다. 따라서 동일한 장비의 톰캣은 <code v-pre>Reciver</code>에서 설정되는 <code v-pre>port</code>에 차이가 있어야 합니다.</p>
<p>설정된 톰캣 클러스터의 기능은 어플리케이션이 세션 복제를 허용하는가의 여부에 따라 동작하게 됩니다. 따라서 어플리케이션의 <code v-pre>web.xml</code>에 복제가능을 활성화하는 디스크립터를 추가합니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>web-app</span><span class="token punctuation">></span></span>
  ...
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>distributeable</span><span class="token punctuation">/></span></span>
  ...
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>web-app</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>복제 설정이 추가된 어플리케이션이 배치된 톰캣은 기동시 클러스터를 활성화하고 멤버간에 통신을 수행하는 메시지가 로그에 나타납니다.<br>
<img src="https://raw.githubusercontent.com/Great-Stone/great-stone.github.io/master/assets/img/Tomcat_youtube/distributeable.png" alt="distributable" loading="lazy"></p>
<p>구성된 클러스터와 어플리케이션은 LB로 구성되어 요청하며 각 톰캣 프로세스는 세션을 공유하기 때문에 하나의 톰캣 프로세스가 종료되더라도 다른 톰캣 프로세스에서 세션을 받아 수행하는 것을 확인할 수 잇습니다.</p>
</div></template>


