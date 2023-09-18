<template><div><h1 id="vault로-spring-boot-구성관리" tabindex="-1"><a class="header-anchor" href="#vault로-spring-boot-구성관리" aria-hidden="true">#</a> Vault로 Spring Boot 구성관리</h1>
<blockquote>
<p>Example Source : <a href="https://github.com/Great-Stone/vault_springboot_example" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/vault_springboot_example<ExternalLinkIcon/></a></p>
</blockquote>
<p>볼트는 애플리케이션(앱)의 구성관리, 특히 사용자 ID, 패스워드, Token, 인증서, 엔드포인트, AWS 자격증명 등과 같은 민감한 정보를 안전하게 저장하는 중앙 집중식 인프라를 제공한다. 서비스의 성장과 더불어, 이를 구성하는 앱은 확장과 분리 요구 사항이 발생하면 구성 관리가 어려워 진다. 특히, 시크릿 정보가 포함되는 구성 관리는 수동으로 관리하는 경우 로컬 환경을 포함한 여러 시스템에 노출되는 위험성을 갖고, 환경마다 다른 시크릿을 관리하기위한 유지 관리의 노력과 비용이 증가한다. 볼트에서 이야기하는 앱과 관련한 &quot;시크릿 스프롤(퍼짐)&quot; 현상은 다음과 같다.</p>
<ul>
<li>시트릿의 위치가 파일 서버, Git 저장소, 로컬 환경, 앱 실행 환경등 다양한 곳에 존재하고 추적이 어려움</li>
<li>분산 서비스 및 Scale out/in 되는 앱 환경에 구성 설정의 변경 시 개별적 관리 필요</li>
<li>스크릿 사용의 위반 추적이 어렵고 거버넌스와 규제 요구사항에 대한 통제</li>
</ul>
<p>본질적으로 시크릿 스프롤은 가시성과 통제력의 저하를 야기한다.</p>
<h2 id="구성관리-개념" tabindex="-1"><a class="header-anchor" href="#구성관리-개념" aria-hidden="true">#</a> 구성관리 개념</h2>
<p>앱과 구성 관계에서 구성관리의 원칙은 다음과 같다.</p>
<ul>
<li>구성은 앱과 분리되어야 한다.</li>
<li>앱은 한번 빌드되면 로직의 변화가 없는 경우 그대로 배포되어야 한다.</li>
<li>구성의 변경 사항은 앱의 런타임시 주입되어야 한다.</li>
<li>구성은 중앙집중화 되어 강력한 감사와 접근제어가 동반되어야 한다.</li>
<li>민감한 구성은 암호화 되어야 한다.</li>
<li>12 factor 앱 모범 사례에 따라, 중앙 저장소의 구성 데이터를 사용할 수 있도록(부트스트래핑) 앱을 설계해야 한다.</li>
</ul>
<h2 id="볼트의-구성관리-저장소-및-관리" tabindex="-1"><a class="header-anchor" href="#볼트의-구성관리-저장소-및-관리" aria-hidden="true">#</a> 볼트의 구성관리 저장소 및 관리</h2>
<p>볼트는 구성 요소에 대해 중앙 저장소를 제공하며 다음과 같은 주요 이점이 있다.</p>
<ul>
<li>중앙 집중식 구성 저장소</li>
<li>저장되는 데이터의 암호화 저장</li>
<li>KV 형태의 구성 저장 및 버전 관리</li>
<li>정책 기반 접근관리</li>
<li>감사 기능</li>
<li>저장 및 인증을 위한 플러그인 기반</li>
<li>동적 시크릿 발급 및 수명주기 관리</li>
<li>고가용성(HA) 아키텍처 제공</li>
<li>정적 구성 요소 관리를 위한 템플릿팅 지원 (xml, json 등)</li>
<li>다중 클러스터 간 복제</li>
</ul>
<h3 id="example-1-spring-boot-application" tabindex="-1"><a class="header-anchor" href="#example-1-spring-boot-application" aria-hidden="true">#</a> [Example 1. Spring Boot Application]</h3>
<p>앱을 위한 볼트 구성을 위해 다음과 같이 볼트를 실행한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault server <span class="token parameter variable">-dev</span> -dev-root-token-id<span class="token operator">=</span>root -log-level<span class="token operator">=</span>trace

<span class="token punctuation">..</span>.
You may need to <span class="token builtin class-name">set</span> the following environment variables:

    $ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span><span class="token string">'http://127.0.0.1:8200'</span>

The unseal key and root token are displayed below <span class="token keyword">in</span> <span class="token keyword">case</span> you want to
seal/unseal the Vault or re-authenticate.

Unseal Key: UTZ7HoZCu8dtWa/eSMKcwq1klhC/qFoDxHXmhRn4qnE<span class="token operator">=</span>
Root Token: root
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>root</code> 토큰은 구성관리 관리자의 권한으로 가정한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span><span class="token string">'http://127.0.0.1:8200'</span>
$ vault login
Token <span class="token punctuation">(</span>will be hidden<span class="token punctuation">)</span>: root

Success<span class="token operator">!</span> You are now authenticated. The token information displayed below
is already stored <span class="token keyword">in</span> the token helper. You <span class="token keyword">do</span> NOT need to run <span class="token string">"vault login"</span>
again. Future Vault requests will automatically use this token.

Key                  Value
---                  -----
token                root
token_accessor       w5LvrjTvDDcfjPHrnOj6ib7E
token_duration       ∞
token_renewable      <span class="token boolean">false</span>
token_policies       <span class="token punctuation">[</span><span class="token string">"root"</span><span class="token punctuation">]</span>
identity_policies    <span class="token punctuation">[</span><span class="token punctuation">]</span>
policies             <span class="token punctuation">[</span><span class="token string">"root"</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Spring Boot 앱에서 사용할 KV를 활성화 한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault secrets <span class="token builtin class-name">enable</span> <span class="token parameter variable">-path</span><span class="token operator">=</span>demo-app <span class="token parameter variable">-version</span><span class="token operator">=</span><span class="token number">2</span> kv

Success<span class="token operator">!</span> Enabled the kv secrets engine at: demo-app/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>예제에서는 구성관리에서 MySQL 정보를 관리한다고 가정합니다. 관련 Spring Boot 앱은 <a href="https://start.spring.io" target="_blank" rel="noopener noreferrer">spring initializr<ExternalLinkIcon/></a>를 통해 생성한다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230406150032627.png" alt="image-20230406150032627" tabindex="0" loading="lazy"><figcaption>image-20230406150032627</figcaption></figure>
<p>테스트를 위한 종속성 목록은 다음과 같다.</p>
<table>
<thead>
<tr>
<th>Dependencies</th>
<th>설명</th>
</tr>
</thead>
<tbody>
<tr>
<td>Spring Web</td>
<td>Spring MVC를 사용하여 RESTful을 포함한 웹 애플리케이션 구축에 사용</td>
</tr>
<tr>
<td>MySQL Driver</td>
<td>MySQL을 사용하기위한 드라이버 (MySQL 없는 경우 생략)</td>
</tr>
<tr>
<td>Spring Data JPA</td>
<td>JPA를 사용하기 편하도록 만들어놓은 모듈 (MySQL 없는 경우 생략)</td>
</tr>
<tr>
<td>Vault Configuration</td>
<td>분산 시스템에서 외부화된 볼트 구성에 대한 클라이언트 측 지원을 제공</td>
</tr>
<tr>
<td>Lombok</td>
<td>기계적인 코드들을 어노테이션을 기반으로 코드를 자동화하여 작성해주는 Java의 라이브러리</td>
</tr>
</tbody>
</table>
<p>MySQL의 경우 다음과 같이 구성한다.</p>
<div class="language-sql line-numbers-mode" data-ext="sql"><pre v-pre class="language-sql"><code><span class="token keyword">CREATE</span> <span class="token keyword">DATABASE</span> java_dev_db<span class="token punctuation">;</span>
<span class="token keyword">CREATE</span> <span class="token keyword">USER</span> <span class="token string">'dev-user'</span><span class="token variable">@'%'</span> IDENTIFIED <span class="token keyword">BY</span> <span class="token string">'dev-password'</span><span class="token punctuation">;</span>
<span class="token keyword">GRANT</span> <span class="token keyword">ALL</span> <span class="token keyword">PRIVILEGES</span> <span class="token keyword">ON</span> java_dev_db<span class="token punctuation">.</span><span class="token operator">*</span> <span class="token keyword">TO</span> <span class="token string">'dev-user'</span><span class="token variable">@'%'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>앱에서 사용할 구성을 볼트의 <code v-pre>demo-app/java_and_vault/dev</code>에 추가한다. 엔드포인트 정보의 조합은 <code v-pre>&lt;kv_endpoint&gt;/&lt;app_name&gt;/&lt;profile&gt;</code> 이다. 다음과 같이 CLI를 사용하여 구성 정보를 추가한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault kv put demo-app/java_and_vault/dev <span class="token punctuation">\</span>
		<span class="token assign-left variable">app.config.auth.token</span><span class="token operator">=</span>MY-AUTH-TOKEN-DEV-0000 <span class="token punctuation">\</span>
		<span class="token assign-left variable">app.config.auth.username</span><span class="token operator">=</span>dev-user <span class="token punctuation">\</span>
		<span class="token assign-left variable">spring.datasource.database</span><span class="token operator">=</span>java_dev_db <span class="token punctuation">\</span>
		<span class="token assign-left variable">spring.datasource.password</span><span class="token operator">=</span>dev-password <span class="token punctuation">\</span>
		<span class="token assign-left variable">spring.datasource.username</span><span class="token operator">=</span>dev-user
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>UI에서 확인해보면 결과는 다음과 같다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230407093720360.png" alt="image-20230407093720360" tabindex="0" loading="lazy"><figcaption>image-20230407093720360</figcaption></figure>
<p>앱과 볼트 연동 구성을 위해 다음을 추가한다. 기존 <code v-pre>application.properties</code> 대신 <code v-pre>application.yml</code>로 변경하여 구성한다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">application</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> java_and_vault
  <span class="token key atrule">cloud.vault</span><span class="token punctuation">:</span>
      <span class="token key atrule">host</span><span class="token punctuation">:</span> 127.0.0.1
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8200</span>
      <span class="token key atrule">scheme</span><span class="token punctuation">:</span> http
      <span class="token key atrule">config</span><span class="token punctuation">:</span>
        <span class="token key atrule">lifecycle</span><span class="token punctuation">:</span>
          <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token key atrule">authentication</span><span class="token punctuation">:</span> TOKEN
      <span class="token key atrule">token</span><span class="token punctuation">:</span> root
      <span class="token key atrule">kv</span><span class="token punctuation">:</span>
        <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span> demo<span class="token punctuation">-</span>app
        <span class="token key atrule">profile-separator</span><span class="token punctuation">:</span> <span class="token string">'/'</span>
      <span class="token key atrule">generic</span><span class="token punctuation">:</span>
        <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span>
    <span class="token key atrule">import</span><span class="token punctuation">:</span> vault<span class="token punctuation">:</span>//
  <span class="token key atrule">datasource</span><span class="token punctuation">:</span>
    <span class="token key atrule">url</span><span class="token punctuation">:</span> jdbc<span class="token punctuation">:</span>mysql<span class="token punctuation">:</span>//127.0.0.1<span class="token punctuation">:</span>3306/$<span class="token punctuation">{</span>spring.datasource.database<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>spring.cloud.vault</code> 에 볼트 관련 설정이 추가된다.
<ul>
<li><code v-pre>host</code> : 볼트 서버의 호스트이름 또는 IP를 설정한다.</li>
<li><code v-pre>port</code> : 볼트 서버의 포트를 설정한다.</li>
<li><code v-pre>scheme</code> : 볼트 서버와의 통신에 사용할 프로토콜을 설정한다.</li>
<li><code v-pre>config.lifecycle.enabled</code>의 경우 동적인 시크릿에 대한 생명주기 관리 동작 여부를 설정한다. 여기서는 정적인 구성을 사용하므로 <code v-pre>false</code>로 설정한다.</li>
</ul>
</li>
<li><code v-pre>spring.cloud.vault.authentication</code>은 관리자 테스트를 위해 <code v-pre>TOKEN</code>으로 입력한다.</li>
<li><code v-pre>spring.cloud.vault.token</code>은 관리자용 인증인 <code v-pre>root</code>를 입력한다.</li>
<li><code v-pre>spring.cloud.vault.kv</code>는 활성화한 KV 의 선언을 위한 계층이다.
<ul>
<li><code v-pre>enalbed</code> : 활성화 여부를 boolean 값으로 설정한다.</li>
<li><code v-pre>backend</code> : KV가 활성화된 엔드포인트 경로 이름을 입력한다. 기본 값은 <code v-pre>secret</code>이다.</li>
</ul>
</li>
<li><code v-pre>spring.cloud.vault.generic</code>은 v1 타입의 KV 선언을 위한 계층이다.
<ul>
<li><code v-pre>enalbed</code> : 활성화 여부를 boolean 값으로 설정한다. 사용되지 않으므로 <code v-pre>false</code>로 설정한다.</li>
</ul>
</li>
<li><code v-pre>spring.config.import</code>에 <code v-pre>vault://</code>를 지정하여 볼트를 PropertySource로 마운트한다.</li>
<li><code v-pre>spring.datasource</code>에서 MySQL 연동관련 정의를 설정한다.
<ul>
<li><code v-pre>url</code> : DB Connection Url을 명시한다.</li>
<li><code v-pre>database</code> : DB의 이름을 정의한다. 여기서는 볼트에서 해당 값을 가져온다.</li>
<li><code v-pre>username</code> : DB 계정 사용자 이름을 정의한다. 여기서는 볼트에서 해당 값을 가져오므로 생략되었다.</li>
<li><code v-pre>password</code> : DB 계정 사용자 패스워드를 정의한다. 여기서는 볼트에서 해당 값을 가져오므로 생략되었다.</li>
</ul>
</li>
</ul>
<p>기본 패키지 경로(e.g. <code v-pre>src/main/java/com/example/demo</code>)에 다음의 Java 파일을 추가한다.</p>
<p>| AppConfiguration.java</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>example<span class="token punctuation">.</span>demo</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span>context<span class="token punctuation">.</span>properties<span class="token punctuation">.</span></span><span class="token class-name">ConfigurationProperties</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>context<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Configuration</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Getter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Setter</span></span><span class="token punctuation">;</span>
<span class="token annotation punctuation">@Getter</span>
<span class="token annotation punctuation">@Setter</span>
<span class="token annotation punctuation">@Configuration</span>
<span class="token annotation punctuation">@ConfigurationProperties</span><span class="token punctuation">(</span><span class="token string">"app.config.auth"</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AppConfiguration</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> username<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> token<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>@ConfigurationProperties</code>에 정의한 <code v-pre>app.config.auth</code>로 마운팅된 볼트의 내용을 주입한다.</li>
<li><code v-pre>AppConfiguration</code> 클래스는 어노테이션 정의에 따라 볼트로부터 내부에 정의되는 변수 <code v-pre>username</code>과 <code v-pre>token</code> 값이 할당된다.</li>
</ul>
<p>| AppService.java</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>example<span class="token punctuation">.</span>demo</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>beans<span class="token punctuation">.</span>factory<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Value</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>stereotype<span class="token punctuation">.</span></span><span class="token class-name">Service</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">javax<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">PostConstruct</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">RequiredArgsConstructor</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span>extern<span class="token punctuation">.</span>slf4j<span class="token punctuation">.</span></span><span class="token class-name">Slf4j</span></span><span class="token punctuation">;</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token annotation punctuation">@Service</span>
<span class="token annotation punctuation">@RequiredArgsConstructor</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AppService</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">AppConfiguration</span> appConfiguration<span class="token punctuation">;</span>
    <span class="token annotation punctuation">@PostConstruct</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">readConfigs</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"Reading configuration {} - {}"</span><span class="token punctuation">,</span> appConfiguration<span class="token punctuation">.</span><span class="token function">getToken</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> appConfiguration<span class="token punctuation">.</span><span class="token function">getUsername</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>readConfigs()</code> 메소드에 로그 출력에서 볼트로부터 할당된 변수 값을 확인한다.</li>
</ul>
<p>| DemoApplication.java</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>example<span class="token punctuation">.</span>demo</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span></span><span class="token class-name">SpringApplication</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span>autoconfigure<span class="token punctuation">.</span></span><span class="token class-name">SpringBootApplication</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">javax<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">PostConstruct</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>beans<span class="token punctuation">.</span>factory<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">Value</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span>extern<span class="token punctuation">.</span>slf4j<span class="token punctuation">.</span></span><span class="token class-name">Slf4j</span></span><span class="token punctuation">;</span>

<span class="token annotation punctuation">@Slf4j</span>
<span class="token annotation punctuation">@SpringBootApplication</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoApplication</span> <span class="token punctuation">{</span>

	<span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">"${spring.datasource.username}"</span><span class="token punctuation">)</span>
	<span class="token keyword">private</span> <span class="token class-name">String</span> ds_name<span class="token punctuation">;</span>

	<span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">"${spring.datasource.password}"</span><span class="token punctuation">)</span>
	<span class="token keyword">private</span> <span class="token class-name">String</span> ds_pw<span class="token punctuation">;</span>

	<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">DemoApplication</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>

	<span class="token annotation punctuation">@PostConstruct</span>
	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">readDBconfigs</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
			log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"Reading datasource config {} - {}"</span><span class="token punctuation">,</span> ds_name<span class="token punctuation">,</span> ds_pw<span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>@Value</code> 로 볼트에서 가져오는 구성정보가 <code v-pre>application.yml</code>에 정의되어야 하는 구성 정보에 주입된 값을 받아온다.</li>
<li><code v-pre>readDBconfigs()</code> 메소드에 로그 출력에서 볼트로부터 할당된 구성 값을 확인한다.</li>
</ul>
<p>앱을 실행하여 구성을 가져오는지 확인한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ gradle bootRun <span class="token parameter variable">--args</span><span class="token operator">=</span><span class="token string">'--spring.profiles.active=dev'</span>

<span class="token operator">></span> Task :bootRun

  <span class="token builtin class-name">.</span>   ____          _            __ _ _
 /<span class="token punctuation">\</span><span class="token punctuation">\</span> / ___<span class="token string">'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '</span>_ <span class="token operator">|</span> <span class="token string">'_| | '</span>_ <span class="token punctuation">\</span>/ _` <span class="token operator">|</span> <span class="token punctuation">\</span> <span class="token punctuation">\</span> <span class="token punctuation">\</span> <span class="token punctuation">\</span>
 <span class="token punctuation">\</span><span class="token punctuation">\</span>/  ___<span class="token punctuation">)</span><span class="token operator">|</span> <span class="token operator">|</span>_<span class="token punctuation">)</span><span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">||</span> <span class="token punctuation">(</span>_<span class="token operator">|</span> <span class="token operator">|</span>  <span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token punctuation">)</span>
  '  <span class="token operator">|</span>____<span class="token operator">|</span> .__<span class="token operator">|</span>_<span class="token operator">|</span> <span class="token operator">|</span>_<span class="token operator">|</span>_<span class="token operator">|</span> <span class="token operator">|</span>_<span class="token punctuation">\</span>__, <span class="token operator">|</span> / / / /
 <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span><span class="token operator">|</span>_<span class="token operator">|</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">|</span>___/<span class="token operator">=</span>/_/_/_/
 :: Spring Boot ::                <span class="token punctuation">(</span>v3.0.5<span class="token punctuation">)</span>

<span class="token comment"># dev profile이 사용됨을 표기</span>
<span class="token number">2023</span>-04-06T17:15:58.395+09:00  INFO <span class="token number">48275</span> --- <span class="token punctuation">[</span>           main<span class="token punctuation">]</span> 
com.example.demo.DemoApplication         <span class="token builtin class-name">:</span> The following <span class="token number">1</span> profile is active: <span class="token string">"dev"</span>

<span class="token comment"># 앱 구성의 spring.datasource 에서 정의하는 정보가 볼트에서 가져와서 실행되어 Connection Pool이 생성되고, 가져온 계정 정보가 출력됨을 확인</span>
<span class="token number">2023</span>-04-06T17:16:00.359+09:00  INFO <span class="token number">48275</span> --- <span class="token punctuation">[</span>           main<span class="token punctuation">]</span> com.zaxxer.hikari.HikariDataSource       <span class="token builtin class-name">:</span> HikariPool-1 - Starting<span class="token punctuation">..</span>.
<span class="token number">2023</span>-04-06T17:16:00.614+09:00  INFO <span class="token number">48275</span> --- <span class="token punctuation">[</span>           main<span class="token punctuation">]</span> com.zaxxer.hikari.pool.HikariPool        <span class="token builtin class-name">:</span> HikariPool-1 - Added connection com.mysql.cj.jdbc.ConnectionImpl@57416e49
<span class="token number">2023</span>-04-06T17:16:00.616+09:00  INFO <span class="token number">48275</span> --- <span class="token punctuation">[</span>           main<span class="token punctuation">]</span> com.zaxxer.hikari.HikariDataSource       <span class="token builtin class-name">:</span> HikariPool-1 - Start completed.
<span class="token punctuation">..</span>.
<span class="token number">2023</span>-04-07T08:57:39.888+09:00  INFO <span class="token number">52598</span> --- <span class="token punctuation">[</span>           main<span class="token punctuation">]</span> com.example.demo.DemoApplication         <span class="token builtin class-name">:</span> Reading datasource config dev-user - dev-password

<span class="token comment"># 앱 구성 app.config.auth 항목을 볼트에서 가져와서 출력됨을 확인</span>
<span class="token number">2023</span>-04-06T17:16:01.363+09:00  INFO <span class="token number">48275</span> --- <span class="token punctuation">[</span>           main<span class="token punctuation">]</span> com.example.demo.AppService              <span class="token builtin class-name">:</span> Reading configuration MY-AUTH-TOKEN-DEV-0000 - dev-user
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="example-2-spring-boot-application-rbac" tabindex="-1"><a class="header-anchor" href="#example-2-spring-boot-application-rbac" aria-hidden="true">#</a> [Example 2. Spring Boot Application + RBAC]</h3>
<p><code v-pre>Example 1</code>에서는 볼트의 루트 사용자를 사용하여 모든 구성 값을 확인할 수 있지만 앱과 이를 배포하는 사람, 파이프라인은 특정 구성에 대한 정보만 확인할 수 있어야 한다. 여기서는 <code v-pre>prd</code> 프로파일을 위한 구성과 정책 정의에 대해 확인한다.</p>
<p>MySQL의 경우 다음과 같이 구성한다.</p>
<div class="language-sql line-numbers-mode" data-ext="sql"><pre v-pre class="language-sql"><code><span class="token keyword">CREATE</span> <span class="token keyword">DATABASE</span> java_prd_db<span class="token punctuation">;</span>
<span class="token keyword">CREATE</span> <span class="token keyword">USER</span> <span class="token string">'prd-user'</span><span class="token variable">@'%'</span> IDENTIFIED <span class="token keyword">BY</span> <span class="token string">'prd-password'</span><span class="token punctuation">;</span>
<span class="token keyword">GRANT</span> <span class="token keyword">ALL</span> <span class="token keyword">PRIVILEGES</span> <span class="token keyword">ON</span> java_prd_db<span class="token punctuation">.</span><span class="token operator">*</span> <span class="token keyword">TO</span> <span class="token string">'prd-user'</span><span class="token variable">@'%'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>prd</code>를 위한 구성정보를 볼트에 추가한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault kv put demo-app/java_and_vault/prd <span class="token punctuation">\</span>
		<span class="token assign-left variable">app.config.auth.token</span><span class="token operator">=</span>MY-AUTH-TOKEN-prd-1111 <span class="token punctuation">\</span>
		<span class="token assign-left variable">app.config.auth.username</span><span class="token operator">=</span>prd-user <span class="token punctuation">\</span>
		<span class="token assign-left variable">spring.datasource.database</span><span class="token operator">=</span>java_prd_db <span class="token punctuation">\</span>
		<span class="token assign-left variable">spring.datasource.password</span><span class="token operator">=</span>prd-password <span class="token punctuation">\</span>
		<span class="token assign-left variable">spring.datasource.username</span><span class="token operator">=</span>prd-user
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230407094227005.png" alt="image-20230407094227005" tabindex="0" loading="lazy"><figcaption>image-20230407094227005</figcaption></figure>
<p>구성 관리자를 위한 Policy <code v-pre>java-and-vault-prd-admin.hcl</code>파일 내용 및 적용은 다음과 같다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">cat</span> java-and-vault-prd-admin.hcl

path <span class="token string">"demo-app/data/java_and_vault/prd"</span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"update"</span>, <span class="token string">"read"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

$ vault policy <span class="token function">write</span> java-and-vault-prd-admin java-and-vault-prd-admin.hcl

Success<span class="token operator">!</span> Uploaded policy: java-and-vault-prd-admin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>구성을 읽을수만 있는 Policy <code v-pre>java-and-vault-prd-read.hcl</code>파일 내용 및 적용은 다음과 같다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">cat</span> java-and-vault-prd-read.hcl

path <span class="token string">"demo-app/data/java_and_vault/prd"</span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"read"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

$ vault policy <span class="token function">write</span> java-and-vault-prd-read java-and-vault-prd-read.hcl

Success<span class="token operator">!</span> Uploaded policy: java-and-vault-prd-read
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>앱을 위한 계정을 발급하기위한 Policy인 <code v-pre>java-and-vault-prd-approle.hcl</code> 파일 내용은 다음과 같다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">cat</span> java-and-vault-prd-approle.hcl

path <span class="token string">"auth/approle/role/java-vault-prd/role-id"</span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"read"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

path <span class="token string">"auth/approle/role/java-vault-prd/secret-id"</span> <span class="token punctuation">{</span>
  capabilities <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"create"</span>, <span class="token string">"update"</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>

$ vault policy <span class="token function">write</span> java-and-vault-prd-approle java-and-vault-prd-approle.hcl

Success<span class="token operator">!</span> Uploaded policy: java-and-vault-prd-approle
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>관리자에게  <code v-pre>java-and-vault-prd-admin</code>, <code v-pre>java-and-vault-prd-approle</code> 를 부여하여 구성에 대한 관리와 앱을위한 계정 발급 권한을 준다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 활성화 되어있지 않다면 userpass Auth Method 활성화</span>
$ vault auth <span class="token builtin class-name">enable</span> userpass

Success<span class="token operator">!</span> Enabled userpass auth method at: userpass/

$ vault <span class="token function">write</span> auth/userpass/users/app-prd-admin <span class="token assign-left variable">password</span><span class="token operator">=</span>password <span class="token assign-left variable">policies</span><span class="token operator">=</span>java-and-vault-prd-admin,java-and-vault-prd-approle

Success<span class="token operator">!</span> Data written to: auth/userpass/users/app-prd-admin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>앱을 위한 AppRole인증에 <code v-pre>java-and-vault-prd-read</code>를 추가한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 활성화 되어있지 않다면 approle Auth Method 활성화</span>
$ vault auth <span class="token builtin class-name">enable</span> approle

Success<span class="token operator">!</span> Enabled approle auth method at: approle/

$ vault <span class="token function">write</span> auth/approle/role/java-vault-prd <span class="token punctuation">\</span>
    <span class="token assign-left variable">secret_id_ttl</span><span class="token operator">=</span>10m <span class="token punctuation">\</span>
    <span class="token assign-left variable">token_period</span><span class="token operator">=</span>24h <span class="token punctuation">\</span>
    <span class="token assign-left variable">policies</span><span class="token operator">=</span><span class="token string">"java-and-vault-prd-read"</span>
    
Success<span class="token operator">!</span> Data written to: auth/approle/role/java-vault-prd
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>생성한 관리자 계정으로 로그인 하면 <code v-pre>demo-app/java_and_vault/prd</code> 의 구성 변경과 AppRole 계정의 <code v-pre>secret-id</code> 발급이 가능한지 확인한다. (별도의 터미널)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span>http://127.0.0.1:8200
$ vault login <span class="token parameter variable">-method</span> userpass <span class="token assign-left variable">username</span><span class="token operator">=</span>app-prd-admin <span class="token assign-left variable">password</span><span class="token operator">=</span>password

Success<span class="token operator">!</span> You are now authenticated. The token information displayed below
is already stored <span class="token keyword">in</span> the token helper. You <span class="token keyword">do</span> NOT need to run <span class="token string">"vault login"</span>
again. Future Vault requests will automatically use this token.

Key                    Value
---                    -----
token                  hvs.CAESIAE31Vrf91UbPhV5O0eh8KM0Tky_7MGk5ThyRu4tJbhUGh4KHGh2cy50ZDdZZ09BdDRnRmpqdkVRcUJYOWR5YUI
token_accessor         9XuvRw1jKWt99iwlZ146652v
token_duration         768h
token_renewable        <span class="token boolean">true</span>
token_policies         <span class="token punctuation">[</span><span class="token string">"default"</span> <span class="token string">"java-and-vault-prd-admin"</span> <span class="token string">"java-and-vault-prd-approle"</span><span class="token punctuation">]</span>
identity_policies      <span class="token punctuation">[</span><span class="token punctuation">]</span>
policies               <span class="token punctuation">[</span><span class="token string">"default"</span> <span class="token string">"java-and-vault-prd-admin"</span> <span class="token string">"java-and-vault-prd-approle"</span><span class="token punctuation">]</span>
token_meta_username    app-prd-admin

$ vault kv put demo-app/java_and_vault/prd <span class="token punctuation">\</span>
    <span class="token assign-left variable">app.config.auth.token</span><span class="token operator">=</span>MY-AUTH-TOKEN-prd-1111 <span class="token punctuation">\</span>
    <span class="token assign-left variable">app.config.auth.username</span><span class="token operator">=</span>prd-user <span class="token punctuation">\</span>
    <span class="token assign-left variable">spring.datasource.database</span><span class="token operator">=</span>java_prd_db <span class="token punctuation">\</span>
    <span class="token assign-left variable">spring.datasource.password</span><span class="token operator">=</span>prd-password <span class="token punctuation">\</span>
    <span class="token assign-left variable">spring.datasource.username</span><span class="token operator">=</span>prd-user
    
<span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span> Secret Path <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span>
demo-app/data/java_and_vault/prd

<span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span> Metadata <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span>
Key                Value
---                -----
created_time       <span class="token number">2023</span>-04-07T01:54:45.464698Z
custom_metadata    <span class="token operator">&lt;</span>nil<span class="token operator">></span>
deletion_time      n/a
destroyed          <span class="token boolean">false</span>
version            <span class="token number">2</span>

$ vault <span class="token builtin class-name">read</span> auth/approle/role/java-vault-prd/role-id

Key        Value
---        -----
role_id    53b96749-1234-fec1-05b8-760c29991d89

$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> auth/approle/role/java-vault-prd/secret-id

Key                   Value
---                   -----
secret_id             69b144ae-543a-81e3-9afa-8b290d8efd75
secret_id_accessor    d9338290-f1ff-ca09-fbaf-742071afeaa6
secret_id_num_uses    <span class="token number">0</span>
secret_id_ttl         10m
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>앱에서 사용할 AppRole 계정으로 로그인 하면 <code v-pre>demo-app/java_and_vault/prd</code> 의 구성 변경을 읽을수는 있고 업데이트는 안되는 여부를 확인한다. (별도의 터미널)</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span>http://127.0.0.1:8200
$ vault <span class="token function">write</span> auth/approle/login <span class="token punctuation">\</span>
    <span class="token assign-left variable">role_id</span><span class="token operator">=</span>53b96749-1234-fec1-05b8-760c29991d89 <span class="token punctuation">\</span>
    <span class="token assign-left variable">secret_id</span><span class="token operator">=</span>aebbc4ac-79e4-c529-8751-c52f2f31a3d7

Key                     Value
---                     -----
token                   hvs.CAESIC7bpDI_cDGLCpKl6rZ
token_accessor          guDRqHNpnJtpmFXqkqsahc2e
token_duration          24h
token_renewable         <span class="token boolean">true</span>
token_policies          <span class="token punctuation">[</span><span class="token string">"default"</span> <span class="token string">"java-and-vault-prd-read"</span><span class="token punctuation">]</span>
identity_policies       <span class="token punctuation">[</span><span class="token punctuation">]</span>
policies                <span class="token punctuation">[</span><span class="token string">"default"</span> <span class="token string">"java-and-vault-prd-read"</span><span class="token punctuation">]</span>
token_meta_role_name    java-vault-prd

<span class="token comment"># 앱용 계정은 부여된 권한에 읽기 권한이 있으므로 정보 확인</span>
$ <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>hvs.CAESIC7bpDI_cDGLCpKl6rZ vault kv get demo-app/java_and_vault/prd

<span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span> Secret Path <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span>
demo-app/data/java_and_vault/prd

<span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span> Metadata <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span>
Key                Value
---                -----
created_time       <span class="token number">2023</span>-04-07T01:54:45.464698Z
custom_metadata    <span class="token operator">&lt;</span>nil<span class="token operator">></span>
deletion_time      n/a
destroyed          <span class="token boolean">false</span>
version            <span class="token number">2</span>

<span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span> Data <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span>
Key                           Value
---                           -----
app.config.auth.token         MY-AUTH-TOKEN-prd-1111
app.config.auth.username      prd-user
spring.datasource.database    java_prd_db
spring.datasource.password    prd-password
spring.datasource.username    prd-user

<span class="token comment"># 앱용 계정은 부여된 권한에 쓰기 권한이 없으므로 관련 요청시 권한 거부</span>
$ <span class="token assign-left variable">VAULT_TOKEN</span><span class="token operator">=</span>hvs.CAESIC7bpDI_cDGLCpKl6rZ vault kv put demo-app/java_and_vault/prd <span class="token punctuation">\</span>
    <span class="token assign-left variable">app.config.auth.token</span><span class="token operator">=</span>MY-AUTH-TOKEN-prd-2222

Error writing data to demo-app/data/java_and_vault/prd: Error making API request.

URL: PUT http://127.0.0.1:8200/v1/demo-app/data/java_and_vault/prd
Code: <span class="token number">403</span>. Errors:

* <span class="token number">1</span> error occurred:
	* permission denied
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>앱과 정책이 적용된 볼트 연동 구성을 위해 <code v-pre>application.yml</code>를  수정한다.</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">application</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> java_and_vault
  <span class="token key atrule">cloud.vault</span><span class="token punctuation">:</span>
      <span class="token key atrule">host</span><span class="token punctuation">:</span> 127.0.0.1
      <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8200</span>
      <span class="token key atrule">scheme</span><span class="token punctuation">:</span> http
      <span class="token key atrule">config</span><span class="token punctuation">:</span>
        <span class="token key atrule">lifecycle</span><span class="token punctuation">:</span>
          <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
      <span class="token comment"># authentication: TOKEN</span>
      <span class="token comment"># token: root</span>
      <span class="token key atrule">authentication</span><span class="token punctuation">:</span> APPROLE
      <span class="token key atrule">app-role</span><span class="token punctuation">:</span>
        <span class="token key atrule">role-id</span><span class="token punctuation">:</span> 53b96749<span class="token punctuation">-</span>1234<span class="token punctuation">-</span>fec1<span class="token punctuation">-</span>05b8<span class="token punctuation">-</span>760c29991d89
        <span class="token key atrule">secret-id</span><span class="token punctuation">:</span> aebbc4ac<span class="token punctuation">-</span>79e4<span class="token punctuation">-</span>c529<span class="token punctuation">-</span>8751<span class="token punctuation">-</span>c52f2f31a3d7
        <span class="token key atrule">role</span><span class="token punctuation">:</span> db<span class="token punctuation">-</span>kv<span class="token punctuation">-</span>reader
        <span class="token key atrule">app-role-path</span><span class="token punctuation">:</span> approle
      <span class="token key atrule">kv</span><span class="token punctuation">:</span>
        <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
        <span class="token key atrule">backend</span><span class="token punctuation">:</span> demo<span class="token punctuation">-</span>app
        <span class="token key atrule">profile-separator</span><span class="token punctuation">:</span> <span class="token string">'/'</span>
      <span class="token key atrule">generic</span><span class="token punctuation">:</span>
        <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">false</span>
  <span class="token key atrule">config</span><span class="token punctuation">:</span>
    <span class="token key atrule">import</span><span class="token punctuation">:</span> vault<span class="token punctuation">:</span>//
  <span class="token key atrule">datasource</span><span class="token punctuation">:</span>
    <span class="token key atrule">url</span><span class="token punctuation">:</span> jdbc<span class="token punctuation">:</span>mysql<span class="token punctuation">:</span>//127.0.0.1<span class="token punctuation">:</span>3306/$<span class="token punctuation">{</span>spring.datasource.database<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>spring.cloud.vault.authentication</code>은 앱용 인증으로 생성한 방식인 <code v-pre>APPROLE</code>을 설정한다.</li>
<li><code v-pre>spring.cloud.vault.authentication.app-role</code>은 <code v-pre>APPROLE</code>인증에 대한 선언을 위한 계층이다.
<ul>
<li><code v-pre>role-id</code> : 발급한 <code v-pre>role-id</code>를 설정한다.</li>
<li><code v-pre>secret-id</code> : 발급한 <code v-pre>secret-id</code>를 설정한다. <code v-pre>secret-id</code>는 제한시간이 <code v-pre>10m</code>이였으므로, 배포시마다 교체해주어 계정을 보호한다.</li>
<li><code v-pre>role</code> : <code v-pre>role-id</code>가 포함된 Approle의 이름을 설정한다.</li>
<li><code v-pre>app-role-path</code> : 활성화된 Approle의 엔드포인트 경로 이름을 입력한다.</li>
</ul>
</li>
</ul>
<p>앱을 실행하여 구성을 가져오는지 확인한다.  <code v-pre>prd</code> 프로파일을 지정한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ gradle bootRun <span class="token parameter variable">--args</span><span class="token operator">=</span><span class="token string">'--spring.profiles.active=prd'</span>                                                                      

<span class="token operator">></span> Task :bootRun

  <span class="token builtin class-name">.</span>   ____          _            __ _ _
 /<span class="token punctuation">\</span><span class="token punctuation">\</span> / ___<span class="token string">'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '</span>_ <span class="token operator">|</span> <span class="token string">'_| | '</span>_ <span class="token punctuation">\</span>/ _` <span class="token operator">|</span> <span class="token punctuation">\</span> <span class="token punctuation">\</span> <span class="token punctuation">\</span> <span class="token punctuation">\</span>
 <span class="token punctuation">\</span><span class="token punctuation">\</span>/  ___<span class="token punctuation">)</span><span class="token operator">|</span> <span class="token operator">|</span>_<span class="token punctuation">)</span><span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">|</span> <span class="token operator">||</span> <span class="token punctuation">(</span>_<span class="token operator">|</span> <span class="token operator">|</span>  <span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token punctuation">)</span> <span class="token punctuation">)</span>
  '  <span class="token operator">|</span>____<span class="token operator">|</span> .__<span class="token operator">|</span>_<span class="token operator">|</span> <span class="token operator">|</span>_<span class="token operator">|</span>_<span class="token operator">|</span> <span class="token operator">|</span>_<span class="token punctuation">\</span>__, <span class="token operator">|</span> / / / /
 <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span><span class="token operator">|</span>_<span class="token operator">|</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">|</span>___/<span class="token operator">=</span>/_/_/_/
 :: Spring Boot ::                <span class="token punctuation">(</span>v3.0.5<span class="token punctuation">)</span>

<span class="token comment"># prd profile이 사용됨을 표기</span>
<span class="token number">2023</span>-04-07T14:05:03.395+09:00  INFO <span class="token number">67782</span> --- <span class="token punctuation">[</span>           main<span class="token punctuation">]</span> com.example.demo.DemoApplication         <span class="token builtin class-name">:</span> The following <span class="token number">1</span> profile is active: <span class="token string">"prd"</span>

<span class="token comment"># 앱 구성의 spring.datasource 에서 정의하는 정보가 볼트에서 가져온 계정 정보가 출력됨을 확인</span>
<span class="token number">2023</span>-04-07T14:05:05.099+09:00  INFO <span class="token number">67782</span> --- <span class="token punctuation">[</span>           main<span class="token punctuation">]</span> com.example.demo.DemoApplication         <span class="token builtin class-name">:</span> Reading datasource config prd-user - prd-password

<span class="token comment"># 앱 구성 app.config.auth 항목을 볼트에서 가져와서 출력됨을 확인</span>
<span class="token number">2023</span>-04-07T14:05:05.103+09:00  INFO <span class="token number">67782</span> --- <span class="token punctuation">[</span>           main<span class="token punctuation">]</span> com.example.demo.AppService              <span class="token builtin class-name">:</span> Reading configuration MY-AUTH-TOKEN-prd-1111 - prd-user
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>권한이 없는  <code v-pre>dev</code> 프로파일을 지정하는 경우 구성 값을 가져오지 못하므로 앱이 실행될 때 에러가 발생한다.</p>
</div></template>


