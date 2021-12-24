---
meta:
  - name: description
    content: Tomcat
tags: ["Tomcat", "Java"]
---

# 11. Tomcat 팁

- 디렉토리
- setenv
- 실행 유저
- Connector

<iframe width="560" height="315" src="https://www.youtube.com/embed/zY0pDLOZ_7U" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- - -

### 11.1 디렉토리
하나의 장비에는 둘 이상의 톰캣을 운영하는 경우가 발생합니다. 이경우 설정 파일을 별도로 생성하고 스크립트를 통해 해당 설정을 읽게 하는 식의 방법을 사용할 수도 있지만 기본 제공되는 스크립트가 수정되는 양이 많을수록 관리의 난이도가 증가합니다. 따라서 톰캣의 프로세스를 여러개 기동하기 위한 방법으로 권장하는 것을 `$CATALINA_HOME`을 단순히 여러개 만드는 것입니다. 톰캣은 그 자체 용량이 그리 크지 않기 때문에 여러개 복사한다하여도 큰 무리 없이 사용가능한 가벼운 엔진 입니다. 따라서 설정 파일을 추가로 구성하고 스크립트를 수정하는 방법 보다는 기본 톰캣 엔진 전체를 복사하는 것을 권장합니다.

### 11.2 setenv
앞서 옵션을 적용함에 있어 강조한 setenv를 이야기 하고자 합니다. 톰캣에 대한 서비스를 지원하다보면 주로 `catalina.sh(bat)`를 수정하는 경우가 대부분이고 현재가지는 운영중인 서비스에 `setenv`사용한 사례찾기는 힘든것 같습니다. 하지만 `catalina.sh(bat)` 스크립트에서도 명시하듯 해당 스크립트를 수정하는 것은 설정한다는 이유 외에는 단점이 더 많기 때문에 반드시 `setenv`를 통해 추가적인 스크립트 추가 설정을 권장합니다.

### 11.3 실행 유저
Unix/Linux/Mac 플랫폼에서 톰캣이 별도의 계정으로 구성되어 있지만 간혹 root 계정으로 실수로 기동하는 경우가 발생합니다. 톰캣에서는 `server.xml`에 다음의 설정으로 root 로의 기동을 방지 할 수 있습니다.

```xml
<Server port="8005" shutdown="SHUTDOWN">
  <Listener className="org.apache.catalina.security.SecurityListener" checkedOsUsers="root" />
  ...
```

이러한 `Listener` 디스크립터의 설정으로 root 계정의 실행을 방지하며, 만약 root로 기동하는 경우 다음과 같은 메시지를 발생시킵니다.

```log
java.lang.Error: Start attempted while running as user [root]. Running Tomcat as this user has been blocked by the Lifecycle listener org.apache.catalina.security.SecurityListener (usually configured in CATALINA_BASE/conf/server.xml)
```

### 11.4 Connector
`Connector` 디스크립터로 정의되는 프로토콜에 대한 정의는 톰캣이 요청을 받아들이는 통로를 설정하는 것이기 때문에 주요 설정 중 하나 입니다. 앞서 살펴본 쓰레드 설정외에도 도움이 될만한 옵션에 대한 내용은 다음과 같습니다.

| 옵션 | 기능 설명 |
| ---- | --------- |
| acceptCount="10" | request Queue의 길이를 정의<br>: idle thread가 없으면 queue에서 idle thread가 생길때 까지 요청을 대기하는 queue의 길이<br>: 요청을 처리할 수 없는 상황이면 빨리 에러 코드를 클라이언트에게 보내서 에러처리 표시 |
| enableLookups="false" |Servlet/JSP 코드 중에서 들어오는 http request에 대한 ip를 조회 하는 명령등이 있을 경우 DNS 이름을 IP주소로 바꾸기 위해서 DNS 서버에 look up 요청을 보냄<br>: 서버간의 round trip 발생을 막을 수 있음|
|compression="off"|HTTP message body를 gzip 형태로 압축해서 리턴하지 않음|
|maxConnection="8192"|하나의 톰캣인스턴스가 유지할 수 있는 Connection의 수를 정의<br>: 현재 연결되어 있는 실제 Connection의 수가 아니라 현재 사용중인 socket fd (file descriptor)의 수|
|maxKeepAliveRequest="1"|HTTP 1.1 Keep Alive Connection을 사용할 때, 최대 유지할 Connection 수를 결정하는 옵션<br>: Keep Alive를 사용할 환경이 아닌 경우에 설정|
|tcpNoDelay="true"|TCP 프로토콜은 기본적으로 패킷을 보낼때 바로 보내지 않음<br>: 버퍼사이즈에 데이터가 모두 담길때까지 패킷 전송을 보류함으로 대기 시간이 발생하는 것을 방지<br>: 트래픽이 증가하지만 현 망 속도를 고려하였을 때 문제가 크지 않음|