---
description: Tomcat
tag: ["Tomcat", "Java"]
---

# 5. Tomcat 애플리케이션 배포

- Web Application
- by Manager
- by webapps DIR
- by context.xml
- ROOT
- Auto Deployment & Hot Deployment
- Parallel Deployment

<iframe width="560" height="315" src="https://www.youtube.com/embed/Hg-D7szI2t4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- - -

## 5.1 Web Application
톰캣에 배치되는 어플리케이션은 Java Web Application입니다. 간단히 웹 어플리케이션이라고도 합니다. 간략한 구조는 다음과 같습니다.

::: info 파일 구조
```bash:no-line-numbers
./APPDIR
├── WEB-INF
│   ├── classes
│   │   └── class-files
│   ├── lib
│   │   └── jar-files
│   └── web.xml
├── index.html
└── index.jsp
```
:::

APP 디렉토리 하위에는 웹어플리케이션의 정의를 넣을 WEB-INF 디렉토리가 필요합니다. 아주 간단한 어플리케이션은 `web.xml`에 다음의 태그만 넣어도 웹 어플리케이션으로 인지할 수 있습니다.

```xml
<web-app/>
```


## 5.2 by Manager
어플리케이션을 배치하는 방법에는 톰캣에서 제공하는 `manager`를 사용하는 방법이 있습니다. `manager`는 톰캣을 설치하면 제공되는 어플리케이션 관리 툴로 다음과 같이 확인할 수 있습니다.

- http://ip:port 로 기본 톰캣 http 요청 (로컬에서 기본 설정으로 실행한 경우 http://localhost:8080)
- ROOT 어플리케이션의 호출 확인 후 좌측의 'Manager App' 버튼 클릭
- 톰캣 유저의 설정이 되어있지 않으므로 로그인 창에서 '취소'버튼 클릭  
- `$CATALINA_HOME/conf/tomcat-user.xml` 에 설정하는 방법을 에러페이지에서 확인
- `tomcat-user.xml`에 다음과 같이 설정 추가 (e.g. `user/passwd`를 `admin/admin`으로 설정)

```xml
<tomcat-users>
  <role rolename="manager-gui"/>
  <user username="admin" password="admin" roles="manager-gui"/>
</tomcat-users>
```

- 톰캣 재기동 후 다시 로그인 페이지 호출하여 설정한 user/passwd 입력 후 로그인

manager의 중간에 `Deploy`에서 배치를 수행할 수 있으며 두가지 타입이 제공됩니다. 한가지는 `Deploy directory or WAR file located on server`로서 톰캣이 기동된 서버내의 어플리케이션을 지정하여 배치하는 방법과 `WAR file to deploy`는 현재 접속중인 로컬의 WAR파일을 업로드하여 배치하는 방법입니다. 두 방법 모두 수행 후 `$CATALINA_HOME/webapps` 에 해당 어플리케이션이 위치하게 됩니다.


## 5.3 by webapps DIR
톰캣에는 자동으로 어플리케이션을 인지하고 배치하는 디렉토리가 있습니다. 바로 `$CATALINA_HOME/webapps`입니다. 해당 경로는 앞서 manager 를 통한 배치시에도 어플리케이션이 위치하게되는 경로인데, manager를 사용하는 방법은 결국 webapps 디렉토리에 어플리케이션을 위치시키는 작업이라고 볼 수 있습니다. 따라서 직접 해당 경로에 어플리케이션을 위치시켜도 동일하게 배치 작업이 발생합니다.

webapps 디렉토리가 자동으로 배치를 수행하는 설정은 `server.xml`에서 해당 경로가 배치를 수행하도록 설정되었기 때문입니다. 

```xml
<Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">
    <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
           prefix="localhost_access_log." suffix=".txt"
           pattern="%h %l %u %t &quot;%r&quot; %s %b" />
</Host>
```

`server.xml`에서 확인 할 수 있는 톰캣의 기본 host 환경인 `localhost`에서 webapps 디렉토리를 대상으로 autoDeploy를 수행한다는 설정 내용입니다. 이러한 설정으로 인해 자동으로 어플리케이션의 배치가 가능합니다.


## 5.4 by context.xml
앞서 두가지의 manager나 webapps 디렉토리를 통한 배치 방법은 모두 톰캣 내부의 webapps 디렉토리에 어플리케이션이 위치하게 된다는 특징이 있습니다. 이러한 점은 사용자가 원하는 임의의 위치에 어플리케이션은 배제 된다는 의미 일 수도 있습니다. 따라서 이경우 `context.xml` 형태의 xml을 통한 배치 방법을 사용 할 수 있겠습니다.

배치를 설명하기에 앞서 `context.xml`의 `context` 디스크립터는 본래 server.xml에 위치하는 디스크립터였습니다. 하지만 해당 디스크립터에 설정되는 내용들은 변경사항이 자주 발생하는 항목들이기에 별도의 xml에서도 정의할 수 있도록 변경되었으며, 톰캣 5.5.12 버전부터는 server.xml이 아닌 별도의 context.xml을 통하여 해당 설정들을 관리하도록 권고하고 있습니다.

`context.xml`에서 설정하는 정보는 어플리케이션 뿐만이 아니기 때문에 어플리케이션 설정을 제외한 설정을 톰캣에 적용하는 경우에도 사용됩니다. `context.xml`은 `<Context>` 디스크립터로 시작되며 다음의 위치에서 적용되고, 위치에 따라 적용 범위가 달라집니다.

1. $CATALINA_HOME/conf/context.xml : $CATALINA_HOME 내의 모든 톰켓 프로세스 내의 서비스
2. $CATALINA_HOME/conf/[ENGINENAME]/[HOSTNAME]/context.xml.default : Host 범위 내의 모든 서비스
3. $CATALINA_HOME/conf/[ENGINENAME]/[HOSTNAME]/[WEBAPPNAME].xml : 어플리케이션 범위 내의 모든 서비스
4. $WEBAPP/META-INF/context.xml : 어플리케이션 범위 내의 모든 서비스

이같은 위치에 따른 적용 범위는 context로 정의되는 대표적인 자원중 하나인 데이터소스(DataSource)의 경우 톰캣전체 또는 어플리케이션 별로 구분할 수 있는 기능을 사용할 수 있습니다.

어플리케이션을 배포하는 경우 위의 4가지 방법 중 3, 4번 항목을 들 수 있으며, 특히 `context.xml`을 사용한 임의의 위치의 어플리케이션 배포는 3번 항목을 사용하게 됩니다.

`sample` context-root를 갖는 어플리케이션은 다음과 같이 `context.xml`을 설정할 수 있습니다.

```xml
<?xml version="1.0" encoding="UTF-8"?>

<Context path="sample" docBase="/Users/GSLee/APP/sample" debug="0" reloadable="true" crossContext="true" privileged="true"/>

<!-- path는 해당 설정을 server.xml에 하는 경우 의미가 있고 3번 방법의 경우 xml 파일 이름이 context-root로 설정됩니다. -->
```


## 5.5 ROOT

<iframe width="560" height="315" src="https://www.youtube.com/embed/kOp9ahbtE9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

일반적으로 어플리케이션을 배치하는 경우 해당 어플리케이션의 디렉토리 이름이나 context로 설정된 xml의 파일 이름이 context-root로 사용됩니다.

`http://www.mytomcat.co.kr/[WEBAPPNAME]/index.jsp`

하지만 대부분의 경우 다음과 같이 요청되기를 바라죠.

`http://www.mytomcat.co.kr/index.jsp`

이경우 배치 방식은 동일하지만 다음의 네가지 방법을 통해 어플리케이션 배치 시 context-root를 `/`로 설정할 수 있습니다.

|구성 위치|설명|
|-|-|
| $CATALINA_HOME/webapps/ROOT | webapps 기본 디렉토리에 ROOT인 디렉토리명으로 배치된 어플리케이션 |
| $CATALINA_HOME/conf/[ENGINENAME]/[HOSTNAME]/ROOT.xml | ROOT를 이름으로 갖는 context 타입의 xml로 배치된 어플리케이션 |
| Tomcat Manager | APP에서 `context path` 항목을 비워놓은 채로 배치하는 어플리케이션 |
| server.xml에 배치 어플리케이션을 설정 | `context` 디스크립터의 `path`항목을 비워놓음 |

방법은 여러가지가 있지만 앞서 설명드린 `context`디스크립터로 설정한 별도의 xml을 사용한 배치 방식을 권장합니다.

sample 어플리케이션을 ROOT로 배치한 로그는 다음과 같이 확인됩니다.

```text
정보: Starting Servlet Engine: Apache Tomcat/8.5.73
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
```


## 5.6 Auto Deployment & Hot Deployment

Auto Deploy와 Hot Deploy는 Auto와 Hot을 어떻게 해석하는가에 따라 다음과 같이 혼용되어 사용됩니다.

- 서버 프로세스가 기동 된 상태에서 배치
- 배치된 어플리케이션에 변경사항이 적용된 어플리케이션을 재배치
- 수행중인 어플리케이션의 일부 소스의 변경 적용과 반영

의미가 어떻게 해석되던지 이런 용어를 사용함에 있어서 바라는점은 서비스가 실행중인 도중에도 변경사항을 사용자 모르게 바꾸고자 하는 의도가 대부분일 것입니다.

### 5.6.1 webapps 'autoDeploy'
webapps 디렉토리에 어플리케이션을 넣으면 자동으로 배치가 됩니다. 서버가 기동된 상태에서도 말이죠. 해당 설정은 다음의 'Host' 디스크립터에서 정의합니다.

```xml
<Host name="localhost" appBase="webapps" unpackWARs="true" autoDeploy="true">
      ...
</Host>
```

Host 설정에 autoDeploy가 `true`인 경우 해당 디렉토리에 위치하는 어플리케이션을 감지하여 자동으로 톰캣에 배치를 수행합니다.

### 5.6.2 jsp 'checkInterval'
jsp를 사용자 뷰로 사용하는 경우 서비스의 컨텐츠, 또는 jsp에서 실행하는 코드상의 변경사항이 자주 발생하게 됩니다. 이경우 jsp를 새로 반영하기 위해 서버가 실행중임에도 자동으로 업데이트된 jsp를 컴파일하여 해당 소스를 반영하는 동작을 지원하는 설정이 있습니다. 해당 설정은 다음의 `$CATAILNA_HOME/conf/web.xml`의 jsp 서블릿에 정의되어 있습니다.

```xml
<servlet>
    <servlet-name>jsp</servlet-name>
    <servlet-class>org.apache.jasper.servlet.JspServlet</servlet-class>
    ...
    <init-param>
        <param-name>development</param-name>
        <param-value>true</param-value>
    </init-param>
    <init-param>
        <param-name>checkInterval</param-name>
        <param-value>1</param-value>
    </init-param>
    <load-on-startup>3</load-on-startup>
</servlet>
```

jsp 서블릿에서는 두가지 경우에 대해 jsp의 업데이트를 수행합니다.

- 조건 1. `development`가 `true`인 경우 항상 확인
- 조건 2. `development`가 `false`이고 `checkInterval`이 `0`보다 큰 경우 확인합니다.

관련 옵션에 대한 상세 내용이나 추가적인 jasper 컴포넌트의 옵션은 해당 설정의 위에 주석으로 설명이 되어있습니다.

### 5.6.3 Class 'reloadable'
클래스를 수정하여 컴파일한 뒤 어플리케이션에 업로드하면 얼마 후 해당 어플리케이션(컨텍스트)를 리로딩하는 과정을 수행합니다. 해당 설정은 `Context` 디스크립터가 설정된 xml에 정의합니다.

```xml
<Context reloadable="true" ...>
    <Loader checkInterval="15"/>
</Context>
```

`reloadable`을 `true`로 설정하는 경우 해당 어플리케이션(컨텍스트)는 클래스에 변경이 발생하면 다시 리로딩하는 기능을 수행합니다. 간격은 기본 15초이기 때문에 더 빠른 방영을 원하시면 `Context`디스크립터 내에 `Loader`의 `checkInterval`을 정의함으로 시간을 조절할 수 있습니다. 하지만 이런 리로드 현상을 싫어하시는 분도 있습니다. ["Tomcat Context 수동 Reload"](kwon37xi.egloos.com/4710012)라는 블로그 글에서도 보이듯 자동 리로드를 비활성화 하고 `Valve`를 사용하는 별도의 방법을 사용할 수도 있습니다.

- - -

## 5.7 Parallel Deployment

<iframe width="560" height="315" src="https://www.youtube.com/embed/Bp789a8MBWI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

어플리케이션의 클래스가 수정되어 리로드가 발생하거나 라이브러리나 xml등의 재기동 후 반영되는 변경사항을 적용하기 위해서는 톰캣을 재기동해야 하는 상황이 발생합니다. 이런 경우 기존 어플리케이션은 기존에 사용중인 사용자가 계속 이용 할 수 있도록 활성화된 상태에서 새로운 버전의 어플리케이션을 배치, 새로운 사용자는 새로운 어플리케이션을~~(새술은 새부대에?)~~ 사용하도록 하는 ==Parallel Deployment== 기능을 사용 할 수 있습니다.

![parallelDeploy](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/appVersion.jpg?token=ADUAZXOCLTBA3NROCYL7SF267EUQK)

WebLogic Server 같은 타 WAS에서도 이와 유사한 '[production redeployment](http://docs.oracle.com/middleware/1212/wls/DEPGD/redeploy.htm#DEPGD266)'기능이 있지만 톰캣이 좀더 쉬운 방법을 제공합니다.

그 방법은 `WEBAPP##[VersionNumber]`입니다. sample 어플리케이션으로 예를 들면 `sample##1.0`으로 배치를 수행하는 것입니다. 기존 어플리케이션 뒤에 샵 기호 두개와 버전이름만 붙이면 되기 때문에 매우 간단하지만 단점으로는 거의 동일한 구성과 용량의 독립적인 어플리케이션이 필요하기 때문에 어느정도 변경사항이 많은 경우 활용도가 높겠습니다. 버전은 `float` 형태로 정의하며 상대적으로 높은 값이 신규 배치가 됩니다. Context에서 지정하는 경우에는 어플리케이션 경로를 설정한 대로 샵 기호가 추가된 어플리케이션 이름을 지정하면 서비스 컨텍스트는 샵 기호와 버전이 제외된 기존 경로를 사용하게 됩니다.

```xml
<Context docBase="/app/sample##01" ... /></Context>
```

```xml
<Context docBase="/app/sample##02" ... /></Context>
```

배치된 어플리케이션은 톰캣 Manager에서도 확인할 수 있습니다.

버전이 높은 어플리케이션이 배치되면 기존 사용자는 이전 버전의 어플리케이션 서비스를 이용하고 새로 접속하는 사용자는 신규 어플리케이션의 서비스를 이용하게 됩니다. 이전 버전의 어플리케이션은 톰캣 Manager에서 Session을 확인하여 사용자가 없는것을 확인 후 제거할 수 있습니다.