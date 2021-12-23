---
meta:
  - name: description
    content: Tomcat
tags: ["Tomcat", "Java"]
---

# 10. Tomcat 모니터링

- 모니터링은 왜 하나?
- 톰캣 기본 모니터링 툴
- psi-Probe
- jkstatus
- visualVM
- JMC
- APM

<iframe width="560" height="315" src="https://www.youtube.com/embed/1IAghXNby-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- - -

## 10.1 모니터링은 왜 하나?
무엇인가에 대한 모니터링은 그 대상의 상태를 확인하기 위함입니다. 문제가 있는지, 어떤 동작을 하고 있는지, 알아야 할 내용이 있다면 그 사항을 알수 있도록 하는, 즉 대상의 상태를 감시하는 것입니다.

톰캣을 사용하여 서비스를 제공하는 입장에서는 톰캣의 상태를 감시할 수 있어야 합니다. 톰캣의 작업 상태나 자원의 상태, 특정 문제 상황이 발생하는 징조를 파악하는 것입니다. 모니터링을 잘 수행하면 더나은 서비스와 서비스 장애로 인한 손실을 예방할 수 있습니다.

- - -

## 10.2 톰캣 기본 모니터링 툴

톰캣에는 기본적으로 제공하는 모니터링 툴이 있습니다. 자세하지는 않더라도 필요한 만큼의 정보를 제공합니다.

### 10.2.1 Manager APP
앞서 어플리케이션의 배치를 통해 알아보았던 `Manager APP`에서는 다음의 정보를 확인 할 수 있습니다. 만약 호스트가 여러개라면 해당 `Manager APP` 어플리케이션을 별도로 배치하여 해당 호스트의 배치 정보를 확인 할 수 있습니다.

- `Manager APP`에서의 수행 결과 메시지
- 배치된 어플리케이션의 상태
- 어플리케이션 배치 수행
- 메모리 릭 감지와 SSL 진단
- 실행되는 플랫폼 정보

그리고 상단의 `Server Status`링크를 통해 이동하면 다음의 정보를 확인 할 수 있습니다.

- 톰캣 프로세스의 JVM 메모리 모니터링
- 프로토콜 리스너의 처리중인 작업

배치된 어플리케이션의 Session의 숫자에 링크된 페이지에서는 현재 생성된 세션의 정보와 해당 세션을 강제 종료시킬 수 있는 `Sessoin Administration`을 제공합니다.

### 10.2.2 host manager
`host manager`에서는 다음의 정보를 확인 할 수 있습니다.

- 호스트 목록의 확인과 정보 확인
- 호스트의 컨트롤
- 호스트 생성
- 실행되는 플랫폼 정보

### 10.2.3 admin (톰캣 5.5)
톰캣 5.5 버전에서는 `admin` 어플리케이션이 제공됩니다. 다운로드의 아카이브 사이트에서 확인 가능하며 톰캣을 다운받기위한 버전하위에 `apache-tomcat-x.x.xx-admin` 이름을 갖는 파일이 있습니다. 여타 WAS에서 제공되는 만큼의 웹 콘솔 UI를 제공하는 관리 툴로서 톰캣 내에 설정과 각 항목의 정보를 파악할 수 있습니다. 다만 톰캣 5.5 이후로는 제공되지 않습니다.

- - -

## 10.3 pis-Probe

http://code.google.com/p/psi-probe

`psi-probe`는 예전에 `lambda probe`였으나 현재 구글에서 관리하기 시작한 후로 명칭이 변경되었습니다. 

`psi-probe`의 공식 웹 사이트의 다운로드 항목에서 파일을 받아 압축을 풀면 `probe.war` 웹 어플리케이션이 있습니다. 해당 어플리케이션을 톰캣에 배치하면 `psi-probe`를 실행할 수 있으며 `tomcat-user.xml`에 `manager`권한을 갖는 사용자로 접근하게 됩니다.

[ip:port/probe](https://code.google.com/p/psi-probe/wiki/Features)'와 같이 톰캣에 요청하면 `psi-probe`가 제공하는 톰캣의 모니터링과 관리를 수행하는 어플리케이션을 확인 할 수 있습니다.

앞서 텍스트로만 표현되던 정보들도 보다 보기좋게 제공하고 각 자원이나 설정을 파악하는데 있어서 기본 톰캣 모니터링 툴보다 나은 기능을 제공합니다. 다만 일부 모니터링 항목은 5.5까지를 지원하고 톰캣 8.0에 대한 지원이 불가능하며 2013년 3월 이후로 업데이트가 없다는 점이 단점입니다.

- - -

## 10.4 jkstatus

jkstatus는 `mod_jk`를 사용하여 연동한 경우 아파치에서 확인할 수 있는 톰켓 연동에 대한 모니터링 툴 입니다.

사용을 위해서 `worker.properties`에 `status` 워커를 추가합니다.

```ini
worker.list=tomcat1,tomcat2,loadbalancer,status
...
worker.status.type=status
```

그리고 `uri.properties`에 요청을 수행할 경로를 워커에 맵핑합니다.

```ini
...
/jkstatus=status
```

설정 후 아파치를 재기동하면 아파치 요청 url의 컨텍스트에 설정한 요청 경로를 입력하여 'jkstatus' 툴을 확인 할 수 있습니다. 앞서 80으로 요청하는 아파치의 경우 다음과 같이 요청 할 수 있습니다.

'[ip:port/jkstatus](http://tomcat.apache.org/connectors-doc/reference/status.html)'

![jkstatus](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/jkstatus.png?token=ADUAZXOQFPMD3J65EB7NTBC67EUVU)

jkstatus로 확인할 수 있는 정보는 다음과 같습니다.

- 아파치 버전, mod_jk 버전, uptime, jkstatus 뷰 타입
- 각 워커의 설정 값
- 워커에서 수행중인 요청
- 워커에 맵핑된 정보
- 항목 설명


---

## 10.5 visualVM

visualVM은 톰캣만이 아닌 JVM 전반에 대해 모니터링을 제공하는 툴로서 제공됩니다. Oracle JDK 1.6.0_18 버전 이상부터는 기본으로 포함되어 있고 별도의 다운로드를 위해서는 관련 공식 페이지인 'http://visualvm.java.net'을 통해 받을 수 있습니다.

JDK에는 `$JAVA_HOMe/bin/jvisualvm`에 실행파일이 위치합니다.

visualVM의 장점중 하나는 플러그인 입니다. 현재까지도 상당수의 플러그인이 제공되고 있으며 플러그인 API가 공개되어 있어 원하는 모니터링 플러그인을 생성할 수도 있습니다.

자바 프로세스는 자체적으로 로컬환경에서는 visualVM에 자동으로 인지되게 됩니다. 따라서 수행중인 JVM 프로세스는 visualVM의 `Local`항목에 감지되어 목록에 나타납니다. 그리고 원격지의 JVM 프로세스 또한 JMX(Java Monitoring  Extension)을 통해 로컬의 visualVM에서 모니터링 할 수 있습니다. 서비스로 등록된 로컬의 톰캣은 프로세스가 보이지 않기 때문에 리모트로 구성하는 방법을 따릅니다. 톰캣의 리모트 구성 방법은 두가지가 있습니다.

1. Java 기본 JMX 설정
   Java에서는 옵션을 통해 JMX를 활성화하고 설정 할 수 있습니다. 스크립트에 다음의 JMX의 옵션을 설정합니다.
   
   ```bash
   #setenv.sh
   CATALINA_OPTS="-Dcom.sun.management.jmxremote
   -Dcom.sun.management.jmxremote.port=18080
   -Dcom.sun.management.jmxremote.ssl=false
   -Dcom.sun.management.jmxremote.authenticate=false"
   ```
   
   이 후 visualVM의 'Remote'에 플랫폼 IP를 등록하고 우클릭을 하면 'Add JMX connection...'을 통해 원격지의 톰캣을 등록할 수 있습니다.
   
2. jmx remote 모듈
   톰캣에서는 jmx를 위한 모듈을 제공합니다. 톰캣의 다운로드에 보면 `Extra`항목에 `Remote JMX jar`가 있습니다. 

   - 6.0 이상 버전의 경우 해당 jar 파일을 받아 `$CATALINA_HOME/lib/catalina-jmx-remote.jar`에 위치시킵니다.
   - 5.5 버전은 `$CATALINA_HOME/common/lib/catalina-jmx-remote.jar`에 위치시킵니다.

 Java에서는 옵션을 통해 JMX를 활성화하고 설정 할 수 있습니다. 스크립트에 다음의 JMX의 옵션을 설정합니다.

```sh
#setenv.sh
CATALINA_OPTS="-Dcom.sun.management.jmxremote.ssl=false
-Dcom.sun.management.jmxremote.authenticate=false"
```

그리고 `server.xml`에 `Listener` 디스크립터로 `JmxRemoteLifecycleListener`를 추가합니다.

```xml
<Server port="8005" shutdown=“SHUTDOWN">

       <Listener className="org.apache.catalina.mbeans.JmxRemoteLifecycleListener"
                 rmiRegistryPortPlatform="10001" rmiServerPortPlatform="10002" />
```

설정된 톰캣은 visualVM의 Remote 등록시 다음의 정보로 접근 정보를 생성합니다.
`service:jmx:rmi://192.168.56.101:10002/jndi/rmi://192.168.56.101:10001/jmxrmi`

로컬이나 리모트에 설정된 톰캣 프로세스는 좌측의 네비게이션에 나타나며 해당 항목을 더블클릭하여 우측 화면에서 모니터링 하게 됩니다.

visualVM에서는 기본적으로 다음의 기능을 제공합니다.

- Overview: 해당 JVM의 설정 정보와 환경
- Monitor: CPU, 메모리, 쓰레드 수, 클래스 수의 모니터링과 힘 덤프 수행
- Threads: 쓰레드의 동작 상태와 쓰레드 덤프 수행

이외에도 플러그인에서 제공하는 기능을 활용한 다양한 모니터링이 가능합니다.

- - -

## 10.6 JMC

http://www.oracle.com/technetwork/java/javase/2col/jmc-relnotes-2004763.html

JMC(Java Mision control)은 bea사에서 만든 별도의 JDK인 JRockit에서 제공하던 모니터링 툴입니다. 현재는 bea가 오라클사에서 인수하면서 관련 소프트웨어도 오라클이 관리하고 있으며 관련하여 Sun사도 인수하면서 기존 Sun Hotspot JDK와 JRockit의 장점을 합친 결과로 여러 기능이 추가되고 있습니다. 특히 JDK 7에서 많은 변화가 있었으며 여기에 JMC가 포함되었습니다.

JDK 7 이상의 버전에서 "$JAVA_HOME/bin/jmc"로 실행시키며, 수행된 툴은 다음과 같은 모습을 갖고 있습니다.
![jmc](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/jmc.png?token=ADUAZXOHGPY4RMTZNBFBJYK67EUUS)

visualVM과 거의 비슷한 정도의 모니터링 기능을 제공하는 JMC의 대표적인 특징은 GC 정책에 따른 모니터링 탭의 변화 입니다. GC 정책은 기본 Parellel GC외에도 필요에 따라 CMS(Concurrent Mark Sweep)이나 G1 정책이 사용될 수 있는데 이런 GC 정책에 따른 뷰가 변경됨이 큰 특징입니다.

- - -

## 10.7 APM

APM은 Application Performence Manager의 약자로 모니터링의 역할과 더불어 어플리케이션의 성능을 향샹시킬 목적으로 사용되는 별도의 어플리케이션입니다. WAS의 상용 APM 으로는 Jennifer, Pharos, Performizer 등이 있고 Opensource로 [Scouter](https://github.com/scouter-project/scouter)가 대표적입니다.