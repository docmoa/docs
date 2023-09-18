<template><div><h1 id="_6-tomcat-database-연동" tabindex="-1"><a class="header-anchor" href="#_6-tomcat-database-연동" aria-hidden="true">#</a> 6. Tomcat Database 연동</h1>
<ul>
<li>JDBC Connection Pool</li>
<li>DB 연동 예제</li>
<li>DB 연동 설정값</li>
<li>JNDI Lookup</li>
</ul>
<iframe width="560" height="315" src="https://www.youtube.com/embed/odsWlmZfzag" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<hr>
<h2 id="_6-1-jdbc-connection-pool" tabindex="-1"><a class="header-anchor" href="#_6-1-jdbc-connection-pool" aria-hidden="true">#</a> 6.1 JDBC Connection Pool</h2>
<p>JDBC Connection Pool은 Java에서 DB(Data Base)의 Session 자원을 미리 확보함으로 재생성하는 비용을 줄이기 위한 기술 입니다. Java에서 사용되는 기술이기 때문에 각 DB 벤더사들은 Java로 구현되는 서비스에서 자사의 DB를 사용할 수 있도록 별도의 라이브러리를 제공하며 이를 사용하여 DB와의 Connection을 생성하고 DB를 사용할 수 있게 됩니다.</p>
<p>JDBC는 여타 드라이버와는 다르게 미리 Connection을 확보하여 JVM상에 Object상태로 만들어두고 이를 요청하는 서비스에 빌려줍니다. 빌려준다는 표현을 사용한 이유는 반드시 반환되어야 하기 때문입니다. 앞서 미리 만든다는 표현은 만드는 개수가 제한되어 있다는 의미로 사용하였으며, 때문에 한정된 자원을 DB와의 연계 처리만을 하는 경우 잠시 사용하고 다시 반납하는 과정을 거칩니다.</p>
<p>다음은 jsp에서 단일 Oracle DB와의 Connection Pool을 생성하고 반납하는 샘플 코드입니다.(<s>테스트 용도로 입니다.</s>)</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token operator">&lt;</span><span class="token operator">%</span>@ page <span class="token keyword">import</span><span class="token operator">=</span><span class="token string">"java.sql.*"</span> <span class="token operator">%</span><span class="token operator">></span>
<span class="token operator">&lt;</span><span class="token operator">%</span>
  <span class="token class-name">StringBuffer</span> sbError <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">StringBuffer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token class-name">DatabaseMetaData</span> dbMetaData <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token class-name">Connection</span> conn <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token operator">%</span><span class="token operator">></span>
<span class="token operator">&lt;</span>font size<span class="token operator">=</span><span class="token string">"-1"</span><span class="token operator">></span><span class="token generics"><span class="token punctuation">&lt;</span>p<span class="token punctuation">></span></span>
<span class="token operator">&lt;</span><span class="token operator">%</span>
  <span class="token class-name">DriverManager</span><span class="token punctuation">.</span>registerDriver <span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name"><span class="token namespace">oracle<span class="token punctuation">.</span>jdbc<span class="token punctuation">.</span></span>OracleDriver</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">try</span> <span class="token punctuation">{</span>
    conn <span class="token operator">=</span> <span class="token class-name">DriverManager</span><span class="token punctuation">.</span><span class="token function">getConnection</span><span class="token punctuation">(</span><span class="token string">"jdbc:oracle:thin:@172.16.1.128:1521:TOSA1"</span><span class="token punctuation">,</span> <span class="token string">"fmsvr"</span><span class="token punctuation">,</span> <span class="token string">"fmsvr"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    dbMetaData <span class="token operator">=</span> conn<span class="token punctuation">.</span><span class="token function">getMetaData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token operator">%</span><span class="token operator">></span>
<span class="token generics"><span class="token punctuation">&lt;</span>p<span class="token punctuation">></span></span>
<span class="token class-name">Name</span> of <span class="token constant">JDBC</span> <span class="token class-name">Driver</span><span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token operator">%=</span> dbMetaData<span class="token punctuation">.</span><span class="token function">getDriverName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">%</span><span class="token operator">></span><span class="token generics"><span class="token punctuation">&lt;</span>br<span class="token punctuation">></span></span>
<span class="token class-name">Version</span><span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token operator">%=</span> dbMetaData<span class="token punctuation">.</span><span class="token function">getDriverVersion</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">%</span><span class="token operator">></span><span class="token generics"><span class="token punctuation">&lt;</span>br<span class="token punctuation">></span></span>
<span class="token class-name">Major</span><span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token operator">%=</span> dbMetaData<span class="token punctuation">.</span><span class="token function">getDriverMajorVersion</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">%</span><span class="token operator">></span><span class="token generics"><span class="token punctuation">&lt;</span>br<span class="token punctuation">></span></span>
<span class="token class-name">Minor</span><span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token operator">%=</span> dbMetaData<span class="token punctuation">.</span><span class="token function">getDriverMinorVersion</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">%</span><span class="token operator">></span><span class="token generics"><span class="token punctuation">&lt;</span>br<span class="token punctuation">></span></span>
<span class="token generics"><span class="token punctuation">&lt;</span>p<span class="token punctuation">></span></span>
<span class="token class-name">Database</span> <span class="token class-name">Name</span><span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token operator">%=</span> dbMetaData<span class="token punctuation">.</span><span class="token function">getDatabaseProductName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">%</span><span class="token operator">></span><span class="token generics"><span class="token punctuation">&lt;</span>br<span class="token punctuation">></span></span>a
<span class="token class-name">Version</span><span class="token operator">:</span> <span class="token operator">&lt;</span><span class="token operator">%=</span> dbMetaData<span class="token punctuation">.</span><span class="token function">getDatabaseProductVersion</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">%</span><span class="token operator">></span><span class="token generics"><span class="token punctuation">&lt;</span>br<span class="token punctuation">></span></span>
<span class="token operator">&lt;</span><span class="token operator">%</span>
  <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">SQLException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    sbError<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>conn <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">try</span> <span class="token punctuation">{</span>
        conn<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">SQLException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        sbError<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>sbError<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>sbError<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
<span class="token operator">%</span><span class="token operator">></span>
<span class="token generics"><span class="token punctuation">&lt;</span>p<span class="token punctuation">></span></span><span class="token class-name">No</span> error<span class="token operator">&lt;</span><span class="token operator">/</span>font<span class="token operator">></span>
<span class="token operator">&lt;</span><span class="token operator">%</span>
  <span class="token punctuation">}</span>
<span class="token operator">%</span><span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote>
<p>주어진 정보로 getConnection()을 수행하고 다시 close()를 수행하여 반납하는 과정이며, close()하지 않는 경우 해당 객체는 모두 사용하였음에도 불구하고 메모리상에 남아 차후 메모리 이슈를 발생시킬 수 있습니다.</p>
</blockquote>
<p>톰캣에서는 이런 일련의 Connection을 생성하는 작업을 어플리케이션 대신 생성할 수 있으며 내부적으로 생성하는 개수나 연결이 끊어졌을 때의 재시도, 사용하지 않는 Connection의 강제 반환 등의 설정이 가능합니다.</p>
<p>다음은 <code v-pre>Context</code> 디스트립터 내에 설정하는 <code v-pre>Resource</code>에서 정의한 DataSource 예제 입니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Resource</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>jdbc/test<span class="token punctuation">"</span></span>
          <span class="token attr-name">auth</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Container<span class="token punctuation">"</span></span>
          <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>javax.sql.DataSource<span class="token punctuation">"</span></span>
          <span class="token attr-name">username</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>oracle<span class="token punctuation">"</span></span>
          <span class="token attr-name">password</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>oracle<span class="token punctuation">"</span></span>
          <span class="token attr-name">driverClassName</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>oracle.jdbc.driver.OracleDriver<span class="token punctuation">"</span></span>
          <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>jdbc:oracle:thin:@address:1521:SID<span class="token punctuation">"</span></span>
          <span class="token attr-name">removeAbandoned</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span>
          <span class="token attr-name">removeAbandonedTimeout</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>60<span class="token punctuation">"</span></span>
          <span class="token attr-name">logAbandoned</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>true<span class="token punctuation">"</span></span>
          <span class="token attr-name">maxActive</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>25<span class="token punctuation">"</span></span>
          <span class="token attr-name">maxIdle</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>10<span class="token punctuation">"</span></span>
          <span class="token attr-name">maxWait</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>-1<span class="token punctuation">"</span></span>
<span class="token punctuation">/></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr>
<h2 id="_6-2-db-연동-예제" tabindex="-1"><a class="header-anchor" href="#_6-2-db-연동-예제" aria-hidden="true">#</a> 6.2 DB 연동 예제</h2>
<p>톰캣에서 DB를 연동하기 위해서는 우선 사용할 DB의 벤더사에서 제공하는 JDBC driver를 ClassLoader에서 읽도록 해야 합니다. 우선 JDBC driver를 받고 두가지 방법으로 적용이 가능합니다.</p>
<ul>
<li>setenv script</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment">#JDBC Driver Classpath</span>
<span class="token assign-left variable">CLASSPATH</span><span class="token operator">=</span>/app/lib/jdbc.jar
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>lib 디렉토리에 복사
<ul>
<li>$CATALINA_HOME/common/lib/jdbc.jar (5.5)</li>
<li>$CATALINA_HOME/shared/lib/jdbc.jar (5.5)</li>
<li>$CATALINA_HOME/lib/jdbc.jar (6+)</li>
</ul>
</li>
</ul>
<p>대표적인 DB의 <code v-pre>Context</code> 디스크립터에 설정하는 방법은 다음과 같습니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token comment">&lt;!-- MySQL - Connector/J --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Resource</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>jdbc/test<span class="token punctuation">"</span></span>
          <span class="token attr-name">auth</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Container<span class="token punctuation">"</span></span>
          <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>javax.sql.DataSource<span class="token punctuation">"</span></span>
          <span class="token attr-name">username</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>javauser<span class="token punctuation">"</span></span>
          <span class="token attr-name">password</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>javadude<span class="token punctuation">"</span></span> 
          <span class="token attr-name">driverClassName</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>com.mysql.jdbc.Driver<span class="token punctuation">"</span></span> 
          <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>jdbc:mysql://ipaddress:3306/javatest<span class="token punctuation">"</span></span> 
          <span class="token attr-name">maxActive</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>25<span class="token punctuation">"</span></span>
          <span class="token attr-name">maxIdle</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>10<span class="token punctuation">"</span></span>
          <span class="token attr-name">maxWait</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>-1<span class="token punctuation">"</span></span>
<span class="token punctuation">/></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token comment">&lt;!-- Oracle - classes12.jar(jdk1.4.2), ojdbc#.jar(5+) --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Resource</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>jdbc/test<span class="token punctuation">"</span></span>
          <span class="token attr-name">auth</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Container<span class="token punctuation">"</span></span>
          <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>javax.sql.DataSource<span class="token punctuation">"</span></span>
          <span class="token attr-name">username</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>oracle<span class="token punctuation">"</span></span>
          <span class="token attr-name">password</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>oracle<span class="token punctuation">"</span></span> 
          <span class="token attr-name">driverClassName</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>oracle.jdbc.driver.OracleDriver<span class="token punctuation">"</span></span> 
          <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>jdbc:oracle:thin:@ipaddress:1521:SID<span class="token punctuation">"</span></span> 
          <span class="token attr-name">maxActive</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>25<span class="token punctuation">"</span></span>
          <span class="token attr-name">maxIdle</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>10<span class="token punctuation">"</span></span>
          <span class="token attr-name">maxWait</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>-1<span class="token punctuation">"</span></span>
 <span class="token punctuation">/></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token comment">&lt;!-- PostgreSQL - JDBC # --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Resource</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>jdbc/test<span class="token punctuation">"</span></span>
          <span class="token attr-name">auth</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Container<span class="token punctuation">"</span></span> 
          <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>javax.sql.DataSource<span class="token punctuation">"</span></span> 
          <span class="token attr-name">username</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>myuser<span class="token punctuation">"</span></span>
          <span class="token attr-name">password</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>mypasswd<span class="token punctuation">"</span></span> 
          <span class="token attr-name">driverClassName</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>org.postgresql.Driver<span class="token punctuation">"</span></span> 
          <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>jdbc:postgresql://ipaddress:5432/mydb<span class="token punctuation">"</span></span> 
          <span class="token attr-name">maxActive</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>25<span class="token punctuation">"</span></span>
          <span class="token attr-name">maxIdle</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>10<span class="token punctuation">"</span></span>
          <span class="token attr-name">maxWait</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>-1<span class="token punctuation">"</span></span>
<span class="token punctuation">/></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-3-db-연동-설정값" tabindex="-1"><a class="header-anchor" href="#_6-3-db-연동-설정값" aria-hidden="true">#</a> 6.3 DB 연동 설정값</h2>
<p><code v-pre>Resource</code>에 정의되는 항목은 기본적인 url이나 DB접근 계정정도만 있어도 가능하지만 간혹 튜닝이나 문제해결을 위해 추가적인 옵션이 요구되는 경우가 있습니다. 톰캣에서는 다음의 설정값을 제공합니다.</p>
<table>
<thead>
<tr>
<th>ATTRIBUTE</th>
<th>DESCRIPTOIN</th>
<th>DEFAULT</th>
</tr>
</thead>
<tbody>
<tr>
<td>maxActive</td>
<td>최대 Connection 값</td>
<td>100</td>
</tr>
<tr>
<td>maxIdle</td>
<td>Idle Connection 최대 허용치</td>
<td>=maxActive</td>
</tr>
<tr>
<td>minIdle</td>
<td>Idle Connection 최소 허용치</td>
<td>=initialSize</td>
</tr>
<tr>
<td>initialSize</td>
<td>Connection Pool의 최초 생성 개수</td>
<td>10</td>
</tr>
<tr>
<td>maxWait</td>
<td>Connection을 얻기위해 대기하는 최대 시간</td>
<td>30000(ms)</td>
</tr>
<tr>
<td>removeAbandoned</td>
<td>특정시간 동안 사용하지 않는 Connection 반환</td>
<td>false</td>
</tr>
<tr>
<td>removeAbandonedTimeout</td>
<td>removeAbandoned가 동작하는데 소요되는 시간</td>
<td>60(s)</td>
</tr>
<tr>
<td>logAbandoned</td>
<td>Connection이 remove될 때 log에 기록</td>
<td>false</td>
</tr>
<tr>
<td>testOnBorrow</td>
<td>getConnection()이 수행될 때 유효성 테스트</td>
<td>false</td>
</tr>
<tr>
<td>validationQuery</td>
<td>테스트를 위한 쿼리</td>
<td>null</td>
</tr>
</tbody>
</table>
<p><code v-pre>validationQuery</code>로는 다음과 같이 적용 가능합니다.</p>
<ul>
<li>mysql, MSSql : SELECT 1</li>
<li>Oracle : select 1 from dual</li>
</ul>
<p><a href="http://tomcat.apache.org/tomcat-10.0-doc/jdbc-pool.html" target="_blank" rel="noopener noreferrer">http://tomcat.apache.org/tomcat-10.0-doc/jdbc-pool.html<ExternalLinkIcon/></a></p>
<h2 id="_6-4-jndi-lookup" tabindex="-1"><a class="header-anchor" href="#_6-4-jndi-lookup" aria-hidden="true">#</a> 6.4 JNDI Lookup</h2>
<p>톰캣에서 생성한 JDBC Connection Pool을 DataSource로서 사용하기 위해서는 JNDI를 Lookup하는 방법을 사용합니다. JNDI를 사용하면 이를 지원하는 다른 프레임워크나 API에서도 톰캣의 자원을 사용할 수 있습니다. mybatis/ibatis의 경우도 JNDI 설정을 할 수 있습니다.</p>
<p><code v-pre>Context</code>디스크립터로 정의한 DataSource는 어플리케이션의 <code v-pre>web.xml</code>에서 정의하고 소스에서는 <code v-pre>lookup</code>을 이용하여 사용합니다. 일련의 설정방법의 예는 다음과 같습니다. Context의 정의의 위치에 따라 전체 어플리케이션에 적용될 수도 있고 host단위, 혹은 단일 어플리케이션 내에서만 자원을 생성하게 됩니다.</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token comment">&lt;!-- context.xml --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Resource</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>jdbc/test<span class="token punctuation">"</span></span>
          <span class="token attr-name">auth</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Container<span class="token punctuation">"</span></span>
          <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>javax.sql.DataSource<span class="token punctuation">"</span></span>
          <span class="token attr-name">username</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>oracle<span class="token punctuation">"</span></span>
          <span class="token attr-name">password</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>oracle<span class="token punctuation">"</span></span> 
          <span class="token attr-name">driverClassName</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>oracle.jdbc.driver.OracleDriver<span class="token punctuation">"</span></span> 
          <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>jdbc:oracle:thin:@ipaddress:1521:SID<span class="token punctuation">"</span></span> 
 <span class="token punctuation">/></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token comment">&lt;!-- web.xml --></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>web-app</span><span class="token punctuation">></span></span>
    ...
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>resource-ref</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>res-ref-name</span><span class="token punctuation">></span></span>jdbc/test<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>res-ref-name</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>res-type</span><span class="token punctuation">></span></span>javax.sql.DataSource<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>res-type</span><span class="token punctuation">></span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>res-auth</span><span class="token punctuation">></span></span>Container<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>res-auth</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>resource-ref</span><span class="token punctuation">></span></span>
    ...
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>web-app</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token comment">//Source Code</span>
ds <span class="token operator">=</span> ctx<span class="token punctuation">.</span><span class="token function">lookup</span><span class="token punctuation">(</span><span class="token string">"java:comp/env/jdbc/test"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


