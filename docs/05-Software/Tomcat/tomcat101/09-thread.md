---
meta:
  - name: description
    content: Tomcat
tags: ["Tomcat", "Java"]
---

# 9. Tomcat 쓰레드

- Thread?
- 설정
- Thread Dump

<iframe width="560" height="315" src="https://www.youtube.com/embed/sKiEidnV0nI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- - -

## 9.1 Thread?
Thread는 JVM내에 요청된 작업을 동시에 처리하기 위한 작은 cpu라고 볼 수 있습니다. 톰캣에 서비스 처리를 요청하는 경우 해당 요청은 Queue에 쌓여 FIFO로 Thread에 전달되고 Thread에 여유가 있는 경우 Queue에 들어온 요청은 바로 Thread로 전달되어 `Queue Length`는 0을 유지하지만 Thread가 모두 사용중이여서 더이상의 요청 처리를 하지 못하는 경우 새로 발생한 요청은 Queue에 쌓이면서 지연이 발생합니다.

Thread가 많을수록 동시에 많은 요청을 처리하기 때문에 작은 Thread 수는 서비스를 지연시키지만 이에 반해 Thread도 자원을 소모하므로 필요이상의 큰 값은 불필요한 JVM의 자원을 소모하게 되고 하나의 프로세스 내의 Thread 수는 톰캣 기준으로 700개 이하로 설정할 것을 권장합니다.

사실상 요청은 지연이 최소화 되어야 하며 지연이 길어질수록 Thread를 점유하여 동시간대에 사용가능한 Thread 수를 줄이므로 적정한 Thread 개수의 설정 상태에서 요청을 더 많이 받고자 한다면 지연에 대한 문제점을 찾는 것을 우선해야 합니다.


## 9.2 설정
쓰레드는 `Connector` 기준으로 생성됩니다. 따라서 HTTP나 AJP, SSL이 설정된 `Connector`마다 다른 쓰레드 수를 설정할 수 있습니다. 또는 하나의 쓰레드 풀을 생성하고 `Connector`에서 해당 쓰레드 풀의 쓰레드를 같이 사용하도록 설정할 수도 있습니다.

### 9.2.1 Connector의 쓰레드 설정
기본적인 'Connector'는 다음과 같이 설정되어있습니다.

```xml
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000" redirectPort="8443" />
           
<Connector port="8009" protocol="AJP/1.3" redirectPort="8443" />
```

HTTP나 AJP 프로토콜이 정의된 `Connector`는 설정되어 있지는 않지만 기본값으로 최대 쓰레드 200개의 설정을 가지고 있습니다. 쓰레드 관련 설정값은 다음과 같습니다.

| Attribute       | Description                                                  |
| --------------- | ------------------------------------------------------------ |
| maxSpareThreads | Idle 상태로 유지할 max thread pool size                      |
| maxThreads      | 동시 요청에 의해 Connector가 생성 할 수 있는 최대 request 수 |
| minSpareThreads | tomcat을 실행할때 최소로 유지할 Idle Thread 수               |
| maxIdleTime     | Thread를 유지하는 시간(ms)                                   |

이런 설정 값들로 다시금 정의하면 기본 `Connector`를 다음과 같이 설정할 수 있습니다.

```xml
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000" redirectPort="8443"
           maxSpareThreads="5"
           maxThreads="15"
           minSpareThreads="10" />
           
<Connector port="8009" protocol="AJP/1.3" redirectPort="8443"
           maxSpareThreads="5"
           maxThreads="15"
           minSpareThreads="10" />
```

### 9.2.2 Executor
`Executor` 디스크립터는 `Connector`의 쓰레드 설정에 별도의 실행자로 설정하여 동일한 `Executor`를 사용하는 `Connector`는 같은 쓰레드 풀에서 쓰레드를 사용하도록 하는 기능입니다.

별도의 `Connector`를 사용하여 서비스하지만 모두 같은 쓰레드 자원을 사용하기 위함이며 `connector`에 `executor`라는 설정을 사용하여 공통의 쓰레드 풀을 이용할 수 있습니다. `tomcatThreadPool`이라는 이름을 갖는 `Executor`와 각 `Connector`에 설정하는 예는 다음과 같습니다.

```xml
<Executor name="tomcatThreadPool"
          namePrefix="catalina-exec-"
          maxThreads="150"
          minSpareThreads="4"/>

<Connector executor="tomcatThreadPool"
           port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000" redirectPort="8443"/>
           
<Connector executor="tomcatThreadPool"
           port="8009" protocol="AJP/1.3" redirectPort="8443"/>
```

`Executor`에는 `name`을 정의하여 다른 `Connector`에서 해당 `Executor`를 정의할 수 있는 연결고리를 만듭니다. 그리고 쓰레드의 이름을 정의하는 `namePrifix`설정으로 다른 쓰레드와 구분할 수 있도록 합니다. 기존 `Connector`에 설정하던 쓰레드 관련 설정을 `Excutor`에 함으로서 `Connector`에 공통 쓰레드 풀을 제공합니다.

- - -

## 9.3 Thread Dump
쓰레드 덤프는 실행중인 Thread의 종류와 시작점, 실행한 클래스와 메소드 순서, 현재 상태등을 기록하는 JVM의 고유 기능입니다. 쓰레드 덤프로 서비스의 흐름과 서비스 지연시 수행중인 작업, 병목등을 확인할 수 있습니다. 

쓰레드 덤프의 시작에는 쓰레드 이름과 쓰레드의 정보가 기록되며 이후 쓰레드 상태에 대해 설명합니다.
트레이스의 읽는 순서는 위가 최근 실행한 클래스와 메소드이기 때문에 아래서부터 위로 읽습니다.

![ThreadDump](https://raw.githubusercontent.com/Great-Stone/great-stone.github.io/master/assets/img/Tomcat_youtube/ThreadDump.png)

쓰레드 덤프를 발생시키는 법은 다음과 같습니다.

1. 프로세스 ID를 확인

   - 유닉스/리눅스/맥

     ```
      ps -ef | grep java
     ```

   - JDK 5+

     ```
      $JAVA_HOME/bin/jps
     ```

2. 쓰레드 덤프 발생

   - 유닉스/리눅스/맥

     ```
     kill -3 <pid>
     ```

   - JDK 5+

     ```
      $JAVA_HOME/bin/jstack <pid>
     ```

3. 쓰레드 덤프 확인

   - `catalina.out` 파일 확인
   - AIX 플랫폼의 경우 별도의 javacore 파일 확인
