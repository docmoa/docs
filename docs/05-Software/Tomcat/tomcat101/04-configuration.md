---
meta:
  - name: description
    content: Tomcat
tags: ["Tomcat", "Java"]
---

# 4. Tomcat 환경설정

- 리스너
- 자바옵션
- 클래스로더
- setenv?
- web.xml
- 로그

<iframe width="560" height="315" src="https://www.youtube.com/embed/DFBJ7r1u0Jo" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- - -

## 4.1 리스너
리스너는 Tcp로 활성화되는 HTTP 프로토콜을 상징하여 설명합니다. 톰캣은 기본적으로 HTTP, AJP, Shutdown 을 위한 port가 활성화 됩니다. 리스너는 우리 몸의 귀와 같은 역할을 합니다. 들려오는 요청을 받는 역할을 하지요. 톰캣 또한 요청을 받아들이기 위해 리스너를 활성화하여 요청을 받아 들입니다.

이러한 리스너는 톰캣의 "Coyote" 컴포넌트가 담당하는데 톰캣의  `Startup.sh(bat)`을 수행하면 다음과 같은 메시지를 확인할 수 있습니다.

```text
7월 15, 2014 5:46:18 오후 org.apache.coyote.AbstractProtocol start 정보: Starting ProtocolHandler ["http-bio-8080"]
7월 15, 2014 5:46:18 오후 org.apache.coyote.AbstractProtocol start 정보: Starting ProtocolHandler ["ajp-bio-8009"]
7월 15, 2014 5:46:18 오후 org.apache.catalina.startup.Catalina start 정보: Server startup in 1002 ms
```

http에 8080포트가 할당되고 ajp에 8009포트가 할당됩니다. 이런 포트로 톰캣에 HTTP 혹은 AJP로 요청을 전달할 수 있습니다. 만약 톰캣이 기동된 서버의 IP가 "192.168.0.10"이고 사용되는 HTTP 포트가 8080 이라면

`http://192.168.0.10:8080`

이렇게 브라우저에서 호출이 가능합니다. 해당 IP가 DNS나 별도의 호스팅 서비스를 통해 `www.tomcat-gm.com`에 연결되어 있다면

`http://www.tomcat-gm.com:8080`

이렇게 호출이 가능합니다.

일반적으로는 HTTP의 기본 포트로 80이 사용되고 HTTPS(SSL)의 기본 포트로 443이 사용됩니다. 이경우 별도의 포트 지정없이 url 요청이 가능합니다. 

`http://www.tomcat-gm.com(:80)`

`https://www.tomcat-gm.com(:443)`

이러한 리스너 설정은 톰캣의 설정에서 `Connector`로 정의됩니다. `$CATALINA_HOME/conf` 디렉토리의 `server.xml`을 열어보시면 다음과 같은 Connector 설정을 확인 할 수 있습니다.

```xml
<Connector port="8080" protocol="HTTP/1.1"
    connectionTimeout="20000"
    minSpareThreads="10"
    maxSpareThreads="5"
    maxThreads="15"
    redirectPort="8443" />
```

프로토콜의 형태가 "HTTP/1.1"이고 포트는 "8080"으로 활성화 됩니다. 해당 플랫폼에 IP가 여러개 존재한다면 "address" 항목을 추가하여 별도의 IP를 지정 할 수도 있습니다. 이같은 설정은 AJP나 SSL 또한 마찬가지 입니다.

## 4.2 Java Options

Java의 장점이 무엇인가 물으면 그 대표적인 한가지는 OS 플랫폼에 종속적이지 않은 어플리케이션 개발이 가능하다 일 것입니다. 이런 개발 환경이 가능한 이유는 JVM(Java Virtual Machine)이 제공하는 환경 때문입니다. JVM이 동작하면 각 OS에 Java가 공통적으로 수행되기 위한 Runtime 환경을 만들고 이후 생성된 JVM 환경에서 어플리케이션이 수행되기 때문에 OS 플랫폼 마다 개발을 달리하지 않아도 됩니다. 하지만 각각의 플랫폼에서의 JVM은 그 동작의 목적은 같아도 어플리케이션에 따라 성능에 차이가 발생할 수 있습니다. 어떤 어플리케이션은 한번에 큰 메모리를 요구하는가 하면 때로는 계산을 주로 한다던가, IO 작업이 많다던가하여 CPU 자원을 많이 필요로 하는 식이죠. 따라서 JVM에서는 사용자가 조절할 수 있는 수많은 옵션을 제공합니다. 물론 아무것도 설정하지 않은 상태가 가장 일반적일 수는 있지만 성능이나 장애극복을 위해 Java Option이 추가되기도 합니다. 적용되는 Java Option의 예는 다음과 같습니다.

|옵션|설명|
|-|-|
|-Xms(ms)|Heap 메모리의 최소값을 정의합니다.|
|-Xmx(mx)|Heap 메모리의 최대값을 정의합니다.|
|-verbosegc|JVM에서 수행하는 GC를 로그로 남깁니다.|
|-XX:+AggressiveOpts|소수점 컴파일을 최적화 합니다.|
|-Djava.net.preferIPv4Stack=true|IPv4와 IPv6모두 사용할 수 있는 환경에서 IPv4를 우선하여 서비스 합니다.|

이 외에도 수많은 Java Option이 존재하기에 각 환경에 맞는 Java Option의 적용이 필요하겠습니다. 하지만 어플리케이션이 실제 수행되기 전에는 어떤 요구사항이 발생하는지는 알 수 없기 때문에 반드시 실 서비스를 하기 전 충분한 테스트가 필요합니다.

톰캣에서 Java Options의 추가를 위해서는 `setenv.sh(bat)` 혹은 `catalina.sh(bat)`의 스크립트에 추가하는 방법과 Windows 서비스에 등록된 경우 관련 설정창에 추가하는 방법이 있습니다.

![TomcatServiceOptions](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/tomcatService-20200628205826895.jpg?token=ADUAZXKZXYIDH75QYMNK75267EUOU)

(서비스로 등록된 톰캣에 Java Options 적용 예)

### 4.3 ClassLoader
Java 환경에서는 class를 호출하여 서비스를 수행합니다. 각 class는 단독으로, 혹은 여러개가 함께 각각의 Class에 정의된 역할을 수행합니다. 이런 Class를 사용하기 위해서는 ClassLoader가 Class를 읽어 Class를 나열하는 과정이 수행됩니다. 나열되는 Class들은 경로의 형태를 띄며 이를 ClassPath라고도 부릅니다.

`...:class:class:class:class:...`

ClassLoader가 Class를 읽지 못한다면 JVM에서는 해당 Class에 들어있는 Method를 요청할 때 찾지 못하는 상황이 발생하며, 이경우 `ClassNotFound` 메시지를 발생시킵니다.
또한 이렇게 정의되는 ClassPath에는 우선순위가 있습니다. 동일한 Class명의 동일한 Method이지만 다른 역할을 수행하는 Class가 로딩된다면 어떤것이 우선권을 갖을까요? ClassPath순서상 앞서있는 Class가 우선권을 갖습니다. 아래와 같은 ClassPath가 생성되었다면 classA가 우선권을 갖습니다.

`...:classA:classB:classC:classE:...`

그렇다면 어플리케이션 개발자가 의도한 Class를 호출하기 위해서는 ClassLoader가 원하는 class를 앞서 설정하도록 해야합니다. 물론 겹치는 Class가 없다는 가정하에는 어떤 위치에 있던지 상관없이 읽히기만 하면 되겠지요.

일반적으로 웹 어플리케이션을 위한 `war`형태의 애플리케이션 개발시 Class는 `WEB-INF/classes` jar형태의 라이브러리는 `WEB-INF/lib`에 위치시킵니다. 이렇게 위치된 Class들은 톰캣 혹은 WAS에 배치(deploy)되면 전체 JVM의 가장 뒤에 위치하게 됩니다. 간혹 웹 어플리케이션 형태가 아닌 Class나 라이브러리를 적용하기위해서는 `CLASSPATH`라는 변수를 사용하여 ClassLoader가 읽을 수 있도록 합니다. 해당 변수는 WAS마다 상이할 수 있습니다.

실행되는 JVM에서의 ClassLoader 순서를 보면 다음과 같습니다.

`BootClassPath:ExtensionClassPath:ClassPath`

BootClassPath와 ExtensionClassPath는 Java의 기본 라이브러리를 로딩합니다. rt.jar와 같은 필수 라이브러리가 그 예입니다. 만약 기존 JVM을 hooking하는 식의 클래스를 사용하는 경우에는 이보다 앞서 클래스를 위치시킬 필요가 있습니다. HelloWorld라는 클래서를 BootClassPath앞에 위치하게 하려면 `-Xbootclasspath/p:HelloWorld`, 뒤에 적용하려면 `-Xbotclasspath/a:HelloWorld` 형태를 사용하여 적용합니다. p와 a에 주의합니다. 그리고 일반적인 Class가 위치하는 ClassPath에 위치하게 하기 위해서는 톰켓의 경우 스크립트에 'CLASSPATH'변수를 치환합니다. 그 예는 다음과 같습니다.

```bash
export CLASSPATH=HelloWorld
export CLASSPATH=${CLASSPATH}:HelloWorld
export CLASSPATH=HelloWorld:${CLASSPATH}
```

기 적용된 CLASSPATH가 있는가에 따라 적용하고자하는 Class 혹은 라이브러리 앞, 뒤에 기존 CLASSPATH를 넣어줄 수도 있습니다.

::: warning
Windows의 경우 구분자가 세미콜론(;)이고 그 외에는 콜론(:)임에 주의합니다.
:::

### 4.4 setenv
Windows 환경의 서비스 실행방법을 제외하고는 대부분 스크립트에 앞서 설명한 Java Option이나 ClassPath를 설정합니다. 일반적으로, 그리고 여러 운영환경에서 이러한 실행 환경 변수를 `catalina.sh(bat)`에 설정하여 사용하는 경우를 보았습니다. 하지만 한번이라도 해당 스크립트를 열어 읽어보셨다면 다음과 같은 메시지를 확인 할 수 있을 것입니다.

```bash
# -----------------------------------------------------------------------------
# Control Script for the CATALINA Server
#
# Environment Variable Prerequisites
#
#   Do not set the variables in this script. Instead put them into a script
#   setenv.sh in CATALINA_BASE/bin to keep your customizations separate.
```

즉, `catalina.sh`는 건드리지 말고 `setenv.sh(bat)`에 추가적은 설정을 하라는 안내 문구 입니다. `catalina.sh`를 수정하는 경우 해당 톰캣을 이전하거나, 동일한 톰캣을 구성하거나, 또는 복구해야 하는 상황에서 추가로 설정되거나 수정된 내용의 확인이 힘들 수 있고, 또한 설정과 수정으로 인한 비정상 동작을 할 수 있기 때문입니다. 그렇다면 `setenv.sh(bat)`은 어떻게 작용할까요? `catalina.sh(bat)`에서 `setenv`를 찾아보면 다음과 같이 `setenv`스크립트에 적용된내용을 읽어오는 것을 확인 할 수 있습니다.

:::: tabs
::: tab catalina.sh (Unix/Linux/OSX)
```bash
if [ -r "$CATALINA_BASE/bin/setenv.sh" ]; then
  . "$CATALINA_BASE/bin/setenv.sh"
elif [ -r "$CATALINA_HOME/bin/setenv.sh" ]; then
  . "$CATALINA_HOME/bin/setenv.sh"
fi
```
:::
::: tab catalina.bat (Windows)
```powershell
rem Get standard environment variables
if not exist "%CATALINA_BASE%\bin\setenv.bat" goto checkSetenvHome
call "%CATALINA_BASE%\bin\setenv.bat"
goto setenvDone
:checkSetenvHome
if exist "%CATALINA_HOME%\bin\setenv.bat" call "%CATALINA_HOME%\bin\setenv.bat"
:setenvDone
```
::::


이같이 톰캣에서는 추가/수정해야하는 환경변수나 설정값을 하나의 스크립트에서 관리할 수 있는 환경을 제공합니다. 다만 `setenv.sh(bat)`스크립트는 별도로 만들어야 합니다. 앞서 `catalina.sh(bat)`의 설명된 변수들을 보면 Java Options은 `JAVA_OPTS`로하지 말고 `CATALINA_OPTS`로 하라는 점도 주의해서 보시기 바랍니다. `JAVA_OPTS`의 경우 톰캣을 정지시키는 `shutdown.sh(bat)`에서도 호출되기 때문에 차후 소개되는 JMX 모니터링을 위한 옵션과 같이 별도의 포트를 활성화하는 옵션과 같은 성격의 설정 적용시 문제가 될 수 있습니다. `setenv.sh(bat)`스크립트에 다음과 같이 추가하면 해당 옵션을 별도로 export하지 않아도 톰캣 기동시 적용됩니다.

:::: tabs
::: tab setenv.sh (Unix/Linux/OSX)
```bash
CATALINA_OPTS="-Xms1024m -Xmx2048m -XX:MaxPermSize=512m -verbosegc"
CLASSPATH="${CLASSPATH}:/app/libs/myapi.jar"
```
:::
::: tab setenv.bat (Windows)
```powershell
set CATALINA_OPTS=-Xms1024m -Xmx2048m -XX:MaxPermSize=512m -verbosegc
set CLASSPATH=%CLASSPATH%;/app/libs/myapi.jar
```
::::

### 4.5 web.xml
웹 어플리케이션에서 `web.xml`은 서블릿을 정의하고 이어주는 역할을 수행합니다. 이와 마찬가지로 톰캣에 있는 `$CATALINA_HOME/conf/web.xml` 또한 톰캣에 있는 서블릿을 정의하고 이어주는 역할을 수행합니다. 다만 JSP/Servlet 엔진으로서의 최소한의 정의를 합니다.

- Servlet 처리 맵핑
- Jsp 처리 맵핑
- 추가 모듈 설정
- Global Session Timeout
- mime 정의

따라서 톰캣에 배치되는 모든 어플리케이션에서 공통으로 수정되어야 할 사항은 web.xml에도 정의할 수 있습니다. 하지만 앞서 `catalina` 스크립트와 마찬가지로 추가/수정시 부작용이 있을 수 있음에 중의합니다.

### 4.6 Log
톰캣의 로그는 다음과 같이 종류와 정의는 다음에서 정의합니다. 다만 Windows 서비스는 서비스 환경설정에서 정의힙니다.

| Log          | Config File                                                  |
| ------------ | ------------------------------------------------------------ |
| Catalina.out | CATALINA_OUT 환경변수로 정의, catalina.sh에 정의되어 있고 setenv 스크립트에서 재정의 |
| access.log   | server.xml                                                   |
| *.log        | logging.properties                                           |



