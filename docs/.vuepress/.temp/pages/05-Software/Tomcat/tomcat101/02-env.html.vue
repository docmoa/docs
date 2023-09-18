<template><div><h1 id="_2-tomcat-설치환경" tabindex="-1"><a class="header-anchor" href="#_2-tomcat-설치환경" aria-hidden="true">#</a> 2. Tomcat 설치환경</h1>
<iframe width="560" height="315" src="https://www.youtube.com/embed/XvinTBrQ0ig" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<hr>
<h2 id="_2-1-os" tabindex="-1"><a class="header-anchor" href="#_2-1-os" aria-hidden="true">#</a> 2.1 OS</h2>
<p>톰캣을 설치하는 OS 플랫폼 환경은 모든 환경을 지원합니다. 그나마 예전에는 일부 Unix/Linux/OSX 환경에서 Apache HTTP Server 설치하듯 컴파일을 통해 구성하였으나, 최근에는 압축파일을 해제하고 바로 사용할 수 있는 경우가 대부분입니다.<br>
톰캣을 운영하기 위해 OS를 선택해야하는 입장이라면 다음과 같은 설치 타입을 고려할 수 있습니다.</p>
<ul>
<li>Windows : Zip 파일을 풀어 사용하거나 msi 설치로 윈도우 서비스에 등록하는 설치</li>
<li>Unix/Linux/OSX : 압축 파일을 풀어 사용하거나 컴파일하여 설치</li>
</ul>
<h2 id="_2-2-jdk" tabindex="-1"><a class="header-anchor" href="#_2-2-jdk" aria-hidden="true">#</a> 2.2 JDK</h2>
<blockquote>
<p><a href="https://tomcat.apache.org/whichversion.html" target="_blank" rel="noopener noreferrer">https://tomcat.apache.org/whichversion.html<ExternalLinkIcon/></a></p>
</blockquote>
<p>톰켓의 버전이 올라감에 따라 지원하는 Java Standard Spec Version 또한 변경됩니다. 이 경우 일부 상위 버전은 JDK의 특정 버전에서 지원되지 않을 수 있지요. 따라서 개발되는 어플리케이션의 JDK요구치나 표준화된 톰캣 버전에 따라 지원되는 JDK 버전이 상이할 수 있습니다. 다음의 표를 참고하시기 바랍니다.</p>
<table>
<thead>
<tr>
<th style="text-align:left"><strong>Servlet Spec</strong></th>
<th style="text-align:left"><strong>JSP Spec</strong></th>
<th style="text-align:left"><strong>EL Spec</strong></th>
<th style="text-align:left"><strong>WebSocket Spec</strong></th>
<th style="text-align:left"><strong>Authentication (JASPIC) Spec</strong></th>
<th style="text-align:left"><strong>Apache Tomcat Version</strong></th>
<th style="text-align:left"><strong>Latest Released Version</strong></th>
<th style="text-align:left"><strong>Supported Java Versions</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">6.0</td>
<td style="text-align:left">3.1</td>
<td style="text-align:left">5.0</td>
<td style="text-align:left">2.1</td>
<td style="text-align:left">3.0</td>
<td style="text-align:left">10.1.x</td>
<td style="text-align:left">10.1.0-M8 (alpha)</td>
<td style="text-align:left">11 and later</td>
</tr>
<tr>
<td style="text-align:left">5.0</td>
<td style="text-align:left">3.0</td>
<td style="text-align:left">4.0</td>
<td style="text-align:left">2.0</td>
<td style="text-align:left">2.0</td>
<td style="text-align:left">10.0.x</td>
<td style="text-align:left">10.0.14</td>
<td style="text-align:left">8 and later</td>
</tr>
<tr>
<td style="text-align:left">4.0</td>
<td style="text-align:left">2.3</td>
<td style="text-align:left">3.0</td>
<td style="text-align:left">1.1</td>
<td style="text-align:left">1.1</td>
<td style="text-align:left">9.0.x</td>
<td style="text-align:left">9.0.56</td>
<td style="text-align:left">8 and later</td>
</tr>
<tr>
<td style="text-align:left">3.1</td>
<td style="text-align:left">2.3</td>
<td style="text-align:left">3.0</td>
<td style="text-align:left">1.1</td>
<td style="text-align:left">1.1</td>
<td style="text-align:left">8.5.x</td>
<td style="text-align:left">8.5.73</td>
<td style="text-align:left">7 and later</td>
</tr>
<tr>
<td style="text-align:left">3.1</td>
<td style="text-align:left">2.3</td>
<td style="text-align:left">3.0</td>
<td style="text-align:left">1.1</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">8.0.x (superseded)</td>
<td style="text-align:left">8.0.53 (superseded)</td>
<td style="text-align:left">7 and later</td>
</tr>
<tr>
<td style="text-align:left">3.0</td>
<td style="text-align:left">2.2</td>
<td style="text-align:left">2.2</td>
<td style="text-align:left">1.1</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">7.0.x (archived)</td>
<td style="text-align:left">7.0.109 (archived)</td>
<td style="text-align:left">6 and later (7 and later for WebSocket)</td>
</tr>
<tr>
<td style="text-align:left">2.5</td>
<td style="text-align:left">2.1</td>
<td style="text-align:left">2.1</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">6.0.x (archived)</td>
<td style="text-align:left">6.0.53 (archived)</td>
<td style="text-align:left">5 and later</td>
</tr>
<tr>
<td style="text-align:left">2.4</td>
<td style="text-align:left">2.0</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">5.5.x (archived)</td>
<td style="text-align:left">5.5.36 (archived)</td>
<td style="text-align:left">1.4 and later</td>
</tr>
<tr>
<td style="text-align:left">2.3</td>
<td style="text-align:left">1.2</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">4.1.x (archived)</td>
<td style="text-align:left">4.1.40 (archived)</td>
<td style="text-align:left">1.3 and later</td>
</tr>
<tr>
<td style="text-align:left">2.2</td>
<td style="text-align:left">1.1</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">N/A</td>
<td style="text-align:left">3.3.x (archived)</td>
<td style="text-align:left">3.3.2 (archived)</td>
<td style="text-align:left">1.1 and later</td>
</tr>
</tbody>
</table>
<p><s>톰캣 5.5.x 버전의 경우 5.5.12 버전 이후로는 JDK 5 이상을 지원함에 유의합니다.</s></p>
<p>Java SE의 경우 OS 플랫폼에 따라 제공하는 벤더가 다른 경우가 있습니다. Oracle이 서브스크립션 형태로, 업데이트에 대해 유료화 선언을 한 이후로 여러 파생 Java를 고려할 수 있습니다. 여전히 8 버전을 사용하는 서비스가 많아 OracleJDK가 점유율이 높으나, 이후 높은 버전으로 이전시에는 다른 JDK를 고려하는 상황도 발생할 것으로 보입니다.</p>
<p><strong>Most Popular JRE/JDK Distribution (JRebel, 2020)</strong><br>
<img src="https://marvel-b1-cdn.bc0a.com/f00000000156946/www.jrebel.com/sites/default/files/image/2020-01/12. what jre_jdk distribution do you use.png" alt="2020Java" loading="lazy"></p>
<h2 id="_3-java-제공자" tabindex="-1"><a class="header-anchor" href="#_3-java-제공자" aria-hidden="true">#</a> 3. Java 제공자</h2>
<table>
<thead>
<tr>
<th>Provider</th>
<th>Free Builds from Source</th>
<th>Free Binary Distributions</th>
<th>Extended Updates</th>
<th>Commercial Support</th>
<th>Permissive License</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://adoptopenjdk.net" target="_blank" rel="noopener noreferrer">AdoptOpenJDK<ExternalLinkIcon/></a></td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>Yes</td>
</tr>
<tr>
<td><a href="https://aws.amazon.com/corretto" target="_blank" rel="noopener noreferrer">Amazon – Corretto<ExternalLinkIcon/></a></td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>Yes</td>
</tr>
<tr>
<td><a href="https://www.azul.com/downloads/zulu/" target="_blank" rel="noopener noreferrer">Azul Zulu<ExternalLinkIcon/></a></td>
<td>No</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<td><a href="https://bell-sw.com/java.html" target="_blank" rel="noopener noreferrer">BellSoft Liberica<ExternalLinkIcon/></a></td>
<td>No</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<td><a href="https://www.ibm.com/developerworks/java/jdk" target="_blank" rel="noopener noreferrer">IBM<ExternalLinkIcon/></a></td>
<td>No</td>
<td>No</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<td><a href="https://adoptopenjdk.net/upstream.html" target="_blank" rel="noopener noreferrer">OpenJDK Upstream<ExternalLinkIcon/></a></td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>Yes</td>
</tr>
<tr>
<td><a href="https://www.oracle.com/technetwork/java/javase/downloads" target="_blank" rel="noopener noreferrer">Oracle JDK<ExternalLinkIcon/></a></td>
<td>No</td>
<td>Yes</td>
<td>No</td>
<td>Yes</td>
<td>No</td>
</tr>
<tr>
<td><a href="http://jdk.java.net" target="_blank" rel="noopener noreferrer">Oracle OpenJDK<ExternalLinkIcon/></a></td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>No</td>
<td>Yes</td>
</tr>
<tr>
<td><a href="https://github.com/ojdkbuild/ojdkbuild" target="_blank" rel="noopener noreferrer">ojdkbuild<ExternalLinkIcon/></a></td>
<td>Yes</td>
<td>Yes</td>
<td>No</td>
<td>No</td>
<td>Yes</td>
</tr>
<tr>
<td><a href="https://developers.redhat.com/products/openjdk/overview" target="_blank" rel="noopener noreferrer">RedHat<ExternalLinkIcon/></a></td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
</tr>
<tr>
<td><a href="https://sap.github.io/SapMachine" target="_blank" rel="noopener noreferrer">SapMachine<ExternalLinkIcon/></a></td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
<td>Yes</td>
</tr>
</tbody>
</table>
<ul>
<li>Oracle의 경우 Java가 필요한 미들웨어를 구매한 경우 Java에 대한 지원이 포함됩니다.</li>
<li>RedHat의 경우 RedHat Linux, RedHat Middelware를 서브스크립션하는 경우 Java에 대한 지원이 포함됩니다.</li>
<li>AIX : IBM에서 제공하는 JDK를 사용합니다.</li>
<li>HP-UX : HP에서 제공하는 JDK를 사용합니다.</li>
<li>AIX의 JDK경우 Windows환경에도 설치가 가능하기는 하지만 일반적으로는 Oracle에서 제공하는 기존 SunJDK를 설치하여 사용합니다.</li>
<li>OSX(Mac)는 JDK6 까지는 Apple사에서 제공하지만 JDK7부터는 Oracle에서 설치파일을 받아 설치합니다.</li>
</ul>
</div></template>


