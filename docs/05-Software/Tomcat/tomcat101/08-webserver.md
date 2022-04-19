---
meta:
  - name: description
    content: Tomcat
tags: ["Tomcat", "Java"]
---

# 8. Tomcat 웹서버 연동

- 웹서버 연동의 이유
- mod_jk
- 클러스터

<iframe width="560" height="315" src="https://www.youtube.com/embed/j6qeCBWM4YI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- - -

## 8.1 웹서버 연동의 이유

톰캣 단일로 서비스하는 경우도 있지만 일반적으로 웹서버와 연동하여 사용하는 경우가 보다 더 많습니다. 그 이유를 다음과 같이 정리합니다.

### 8.1.1 요청분산

톰캣에서 처리하는 서비스 요청이 증가하면 단일 프로세스로 처리가 부족한 상황이 발생합니다. 처리에 필요한 힙 메모리를 추가해야 한다면 현재 적용된 메모리 설정보다 더 많은 값을 설정하고 CPU 자원이 부족하다면 장비의 교체도 고려해 봐야겠습니다. 이런 접근은 가용한 메모리가 없거나 더 나은  장비를 추가 구입/구성 해야하는 점이 있습니다. 따라서 단일 프로세스의 한계를 유연하게 대처하기 위해 복수의 프로세스에서 동일한 서비스를 구성하는 방안을 고려할 수 있습니다. 그리고 복수의 프로세스에 요청을 전달하기 위해 LB(LoadBalancer)가 필요합니다.

LB 기능을 수행하는 대표적인 두가지는 네트워크 장비(스위치 장비: L2, L4, L7)를 사용하는 방법과 HTTP 요청을 받아 분산이 가능한 웹서버 입니다. 어떤 방법을 사용하던지 복수개의 톰캣을 사용하면 상황에 따라 프로세스를 추가하여 처리하는 용량을 증가시킬 수 있습니다. 물론 앞서 장비의 추가 상황을 제외한다면 단일 프로세스 보다는 복수의 프로세스를 사용하여 부하를 분산시킬 수 있습니다.

### 8.1.2 소스분산

톰캣은 웹서버의 역할을 함께 수행할 수 있는 기능을 동반하고 있습니다. 하지만 정적인 소스를 처리함에 있어서는 기존 웹서버의 처리 능력이 더 우월하기 때문에 소스 처리의 추체를 분산시켜 처리 속도를 증가시킬 수 있습니다. 대표적인 정적인 소스는 html, css, 이미지 파일 입니다. 앞서 요청의 분산으로 부하를 분산시키는 역할과 더불어 어플리케이션 소스 또한 처리추체를 분산시키고, 더불어 웹서버와 톰캣에서 좀더 빠르게 처리 할 수 있고, 처리 가능한 요청의 처리를 분담할 수 있습니다.

### 8.1.3 장애극복

일반적으로 Failover로 표현하는 장애처리 및 장애극복은 복수의 톰캣 프로세스를 사용함에 따른 장점입니다. 특정 톰캣 프로세스에 장애가 발생하더라도 다른 톰캣 프로세스에서 요청을 처리하게 됨으로 단일 프로세스로 운영할때보다 서비스 지속성에 장점을 갖습니다.

- - -

## 8.2 mod_jk

웹서버는 프록시 기능만을 사용하여도 톰캣과의 연동이 가능하나 톰캣으로의 연동을 좀더 긴밀하게 하기 위해 별도의 모듈을 제공합니다. 이는 `Tomcat Connector`로 제공되는데 [http://tomcat.apache.org](http://tomcat.apache.org)의 Document와 Download에서 확인할 수 있습니다. 연동가능한 대표적인 웹서버로는 다음의 웹서버와 모듈이 요구됩니다.

- Apache HTTP Server : mod_jk.so, mod_jk.dll
- IIS : isapi_redirect.dll
- iPlanet : nsapi_redirector.so, nsapi_redirector.dll

아파치(Apache HTTP Server)는 가장 많이 사용되고 모든 플랫폼을 지원하는 대표적인 웹서버로서 이번 장에서 설명하고자하는 웹서버와의 연동에서 사용하고자 합니다. 기타 웹서버의 경우 톰캣의 [토큐먼트](http://tomcat.apache.org/connectors-doc/) 내용을 참고하시기 바랍니다.

아파치가 설치되었다는 가정하에 톰캣을 연동하는 방법은 다음과 같습니다. 

### 8.2.1 mod_jk 다운로드
유닉스/리눅스/맥의 경우 mod_jk의 소스를 다운받아 아파치의 `apxs`와 함께 컴파일하는 과정이 필요합니다. 윈도우에서도 컴파일하여 사용할 수 있으나 비쥬얼 스튜디오가 있어야 컴파일을 할 수 있기 때문에 별도의 바이너리 파일로 제공됩니다. 다운로드페이지에서 플랫폼에 맞는 모듈을 다운받습니다.

### 8.2.2 모듈 컴파일
유닉스/리눅스/맥의 경우 컴파일을 수행하기위해 아파치의 'apxs'가 필요합니다. 다운받은 소스 압축파일을 풀고 다음과 같이 컴파일 합니다.

```sh
$ tar xvfz tomcat-connectors-1.2.40-src.tar.gz
$ cd ~/Downloads/tomcat-connectors-1.2.40-src/native
$ ./configure —with-apxs=$APACHE_HOME_DIR/bin/apxs
$ make
$ make install
```

컴파일이 완료된 모듈은 자동으로 `$APACHE_HOME/modules/mod_jk.so`로 생성됩니다. 윈도우에서는 다운 받은 바이너리 모듈의 압축을 풀어 동일한 디렉토리에 복사하면 됩니다.

### 8.2.3 모듈 설정
생성된 모듈을 아파치에서 사용할 수 있도록 설정하는 작업을 합니다. `$APACHE_HOME/conf/httpd.conf`에 설정하거나 별도의 `conf`파일을 생성하여 읽게 하여도 됩니다. `httpd.conf`에 설정하는 내용은 다음과 같습니다.

```xml
LoadModule jk_module modules/mod_jk.so

<IfModule jk_module>
    JkWorkersFile conf/workers.properties
    JkLogFile logs/mod_jk.log
    JkLogLevel info
    JkMountFile conf/uri.properties
</IfModule>
```

`JkWorkersFile`은 요청을 처리하는 워커, 즉 톰캣을 정의하는 파일을 지정합니다.

`JkMountFile`은 워커와 워커가 처리할 요청을 맵핑하는 파일을 지정합니다. `JkMount`만으로도 설정이 가능하나 하나의 파일에서 별도로 관리하기 위해서는 해당 파일을 지정하는 것을 권장합니다. `httpd.conf`에 `JkMount`를 사용하는 경우 다음과 같이 정의할 수 있습니다.

```xml
#jsp 파일을 worker1 워커가 처리하는 경우
JkMount /*.jsp  worker1

#server 경로의 요청을 worker2 워커가 처리하는 경우
JkMount /servlet/* worker2
```

### 8.2.4 워커 정의
워커는 그 단어의 의미에서도 추측할 수 있듯이 mod_jk에서 지정하는 요청을 처리하는 대상, 즉 톰켓 프로세스를 의미합니다. 워커는 다음과 같은 설정 방식을 따릅니다.

```xml
worker.[WORKER_NAME].[TYPE]=[VALUE]
```

설정의 예는 다음과 같습니다.

- worker.list=[WORKER_NAME] : 요청을 처리하는 워커를 나열합니다.
- worker.worker1.type=ajp13 : worker1 워커의 형태를 정의합니다.
- worker.worker2.host=192.168.0.11 : worker2 워커의 address를 정의합니다.
- worker.loadbalancer.type=lb : loadbalancer 워커의 형태를 정의합니다. 
- worker.loadbalancer.balance_workers=[WORKER_NAME] : lb 형태인 loadbalancer 워커에서 요청을 분산시킬 워커를 나열합니다.

`worker.properties`의 설정 예제는 다음과 같습니다.
![workersproperties](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/workerproperties.jpg?token=ADUAZXKQI5JMPI7G5L7PVNS67EUS4)

해당 설정은 LB로 구성되는 워커를 정의합니다. LB로 구성될 `worker1`과 `worker2`를 정의합니다.

- `worker1`은 `192.168.0.10`의 ip와 `8009`포트로 `ajp13`형태의 요청을 받아들이며 `lbfactor`는 1입니다.
- `worker2`은 `192.168.0.11`의 ip와 `8009`포트로 `ajp13`형태의 요청을 받아들이며 `lbfactor`는 1입니다.
- `loadbalancer`는 LB를 수행하기 위한 워커로 `lb` 워커 형태입니다.
- `lb`형태의 워커는 LB 대상 워커를 `balace_workers`를 정의하여 나열합니다. 예제에서는 `worker1`과 `worker2`가 대상으로 지정되었습니다.
- 각 톰캣과의 연동 워커인 `worker1`과 `worker2`는 `lbfactor`가 같기 때문에 같은 비율로 요청이 전달됩니다.
- 요청을 처리하는 워커는 `worker.list`에 지정합니다. 예제에서는 `loadbalancer` 워커를 지정하였습니다.

### 8.2.5 처리할 요청의 정의
워커의 정의로 요청을 처리할 워커가 준비되었다면 어떤 요청을 전달할지 정의해햐 합니다. 앞서 `JkMount`를 사용한 방식은 간단히 설명하였고 여기서는 `uri.properties` 파일에서 별도로 요청의 처리 맵핑을 관리하도록 하였습니다. `JkMountFile`로 지정되는 이 설정 파일은 다음과 같은 설정 방식을 따릅니다.

```xml
[URL or FILE_EXTENSION]=[WORKER or WORKER_LIST]
```

이렇게 설정되는 설정 파일의 내용의 예는 다음과 같습니다.

```xml
/*.do=worker1
/*.jsp=worker2
/servlet/*=loadbalancer
```

`JkMount`와 표현방식에 약간의 차이('='의 사용여부)가 있음에 주의하여 설정합니다.

## 8.2.6 테스트
설정이 완료되면 아파치 프로세스를 재기동 합니다. 이후 맵핑한 요청설정에 따라 아파치에 요청을 합니다. jsp파일을 톰캣이 처리하도록 설정하였다면 톰캣에서 요청해보고 url을 아파치로 변경하여 동일하게 요청되는지 확인합니다.

- - -

## 8.3 클러스터
웹서버와 연동하는 주요 기능중 한가지는 장애처리입니다. 일반적으로는 이런 장애처리 동작시 기존 처리중이던 HTTP Session 정보는 장애가 발생한 톰캣이 가지고 있었기 때문에 없어지게 됩니다. 이같은 현상은 기존에 로그인하여 작업을 하던 중 해당 톰캣 프로세스에 문제가 발생하여 다른 톰캣 프로세스로 요청이 넘어가면 로그인 하던 세션이 끊겨 다시금 작업을 수행하는 현상이 발생하는 것을 예로 들수 있습니다.

톰캣에서는 장애처리시의 HTTP Session을 복구하여 지속적인 세션의 유지를 가능하게 하고자 '클러스터' 기능을 제공합니다. 클러스터는 Multicast로 톰캣 프로세스간에 클러스터를 형성하고 멤버로 구성된 톰캣간에 세션을 공유하는 방식입니다.

기능의 활성화는 단순히 `server.xml`의 `Cluster` 디스크립터의 주석을 해제하는 것만으로도 가능합니다.

![tomcatCluster.png](https://raw.githubusercontent.com/Great-Stone/great-stone.github.io/master/assets/img/Tomcat_youtube/tomcatCluster.png)

하지만 동일 장비에서 기동되는 톰캣간이나 서비스가 다른 톰캣이 여럿 기동중인 경우에는 설정값들이 중복되어 톰캣 기동이나 서비스 처리시 문제가 발생할 수 있습니다. 따라서 기본적인 설정 값 외에 별도의 설정들을 적용해야 하는 경우 `server.xml`에서 클러스터를 사용하기 위한 디스크립터 위에 설명한 도큐먼트의 내용을 참고해야 합니다.

만약 도큐먼트의 설정들이 너무 많거나 어떻게 적용해야 하는지 이해하기 힘든경우 톰캣 5.5버전의 `server.xml`을 참고하시기 바랍니다. 해당 버전에서는 6.0 이후 단순히 한줄로 적용된 `Cluster` 디스크립터와는 다르게 기본적인 설정과 값이 같이 적용되어 있습니다. 아래 예제는 도큐먼트의 기본 설정에서 가져온 내용입니다.

[http://tomcat.apache.org/tomcat-7.0-doc/cluster-howto.html: 기본 설정](http://tomcat.apache.org/tomcat-7.0-doc/cluster-howto.html)

```xml
<Cluster className="org.apache.catalina.ha.tcp.SimpleTcpCluster"
         channelSendOptions="8">

  <Manager className="org.apache.catalina.ha.session.DeltaManager"
           expireSessionsOnShutdown="false"
           notifyListenersOnReplication="true"/>

  <Channel className="org.apache.catalina.tribes.group.GroupChannel">
    <Membership className="org.apache.catalina.tribes.membership.McastService"
                address="228.0.0.4"
                port="45564"
                frequency="500"
                dropTime="3000"/>
    <Receiver className="org.apache.catalina.tribes.transport.nio.NioReceiver"
              address="auto"
              port="4000"
              autoBind="100"
              selectorTimeout="5000"
              maxThreads="6"/>

    <Sender className="org.apache.catalina.tribes.transport.ReplicationTransmitter">
      <Transport className="org.apache.catalina.tribes.transport.nio.PooledParallelSender"/>
    </Sender>
    <Interceptor className="org.apache.catalina.tribes.group.interceptors.TcpFailureDetector"/>
    <Interceptor className="org.apache.catalina.tribes.group.interceptors.MessageDispatch15Interceptor"/>
  </Channel>

  <Valve className="org.apache.catalina.ha.tcp.ReplicationValve"
         filter=""/>
  <Valve className="org.apache.catalina.ha.session.JvmRouteBinderValve"/>

    <Deployer className="org.apache.catalina.ha.deploy.FarmWarDeployer"
              tempDir="/tmp/war-temp/"
              deployDir="/tmp/war-deploy/"
              watchDir="/tmp/war-listen/"
              watchEnabled="false"/>

    <ClusterListener className="org.apache.catalina.ha.session.JvmRouteSessionIDBinderListener"/>
    <ClusterListener className="org.apache.catalina.ha.session.ClusterSessionListener"/>
</Cluster>
```

앞서 여러개의 톰캣 클러스터를 사용하는 경우 `Membership`과 `Reciver` 디스크립터의 내용에 주의합니다. `Membership`은 동일한 설정을 갖는 톰캣 끼리 같은 클러스터 멤버 그룹으로 인지하는 내용으로 멀티캐스트 통신을 수행합니다. `Membershop`의 `address`와 `port`가 동일한 톰캣 프로세스 끼지 클러스터 기능을 수행합니다.  `Reciver`는 클러스터간의 메시지를 주고받는 역할을 수행하며 TCP 통신을 수행합니다. 따라서 동일한 장비의 톰캣은 `Reciver`에서 설정되는 `port`에 차이가 있어야 합니다.

설정된 톰캣 클러스터의 기능은 어플리케이션이 세션 복제를 허용하는가의 여부에 따라 동작하게 됩니다. 따라서 어플리케이션의 `web.xml`에 복제가능을 활성화하는 디스크립터를 추가합니다.

```xml
<web-app>
  ...
  <distributeable/>
  ...
</web-app>
```

복제 설정이 추가된 어플리케이션이 배치된 톰캣은 기동시 클러스터를 활성화하고 멤버간에 통신을 수행하는 메시지가 로그에 나타납니다.
![distributable](https://raw.githubusercontent.com/Great-Stone/great-stone.github.io/master/assets/img/Tomcat_youtube/distributeable.png)

구성된 클러스터와 어플리케이션은 LB로 구성되어 요청하며 각 톰캣 프로세스는 세션을 공유하기 때문에 하나의 톰캣 프로세스가 종료되더라도 다른 톰캣 프로세스에서 세션을 받아 수행하는 것을 확인할 수 잇습니다.
