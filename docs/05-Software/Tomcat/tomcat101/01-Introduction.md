---
meta:
  - name: description
    content: Tomcat
tags: ["Tomcat", "Java"]
---

# 1. Tomcat 소개

본 내용은 톰캣을 좀더 잘 알고 잘 써보기 위한 제안이랄까요?

톰캣의 특성상 쉽게 접할 수 있는 메뉴얼적인 지식보다는, 톰캣을 더 잘 사용하고 운영 할 수 있을만한 아이디어를 공유하고자 시작한 지식공유 활동입니다. 담고 있는 내용은 **'[톰캣 알고 쓰기](http://www.youtube.com/playlist?list=PLQUXE_kb6KOj0mvxoAGrz3FT9EDL3fa1z)'** 유튜브 강의 내용에 대한 정리입니다. 유튜브에 강의를 올리면 출퇴근 시간을 이용해 짬짬히 들을 수 있을 것 같은 생각이 들어 시작하였지만 ~~얼마나 출퇴근 시간에 이용하셨을지는 미지수이고~~ 동영상으로 모든 것을 다 표현할 수 없다는 점을 감안하여 다시 글로 정리합니다.

톰캣을 잘 사용하고 이해하는 것은 개발자, 운영자, 기술자, 엔지니어등 톰캣을 접하는 모두에게 요구되는 사항이지만 일반적으로는 필요한 기능과 기술만을 습득하게 됩니다. 이번 강의를 통해 약간의 시간 투자로 모두에게 도움이 되었으면 합니다.

특히 WEB/WAS 엔지니어로 자주 겪었던 **개발은 톰캣으로하고 정작 운영은 다른 WAS를 사용하는** 아이러니함에도 도움이 되었으면 합니다.

---

- 왜 톰캣을 쓰는가?
- 톰캣 이력
- 톰캣 구성
- TomEE?

<iframe width="560" height="315" src="https://www.youtube.com/embed/P3H-7G_Y3rI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- - -

## 1.1 왜 톰캣을 쓰는가?
톰캣을 사용하는 첫번째 이유는 기능적인 이유일 것입니다. 즉, 톰캣이 수행하는 역할인 JSP/Servlet 엔진으로서의 역할이겠지요. 톰캣은 세계적으로 가장 많은 Java 기반의 웹어플리케이션 플랫폼으로 사용되고 있습니다. 많은 개발자들이 자신의 첫번째 Java 웹 어플리케이션의 JSP/Servlet 엔진으로 선택하고 있고 실제 운영환경에서도 사용하기에 상당한 양의 노하우를 쉽게 접할 수 있다는 장점이 있습니다.

두번째로는 아마도 무료로 사용할 수 있다는 점이 톰캣을 사용하게 되는 이유일 것입니다. 수많은 벤더사에서 JSP/Servlet 엔진과 추가로 Java Enterprise 기능을 사용할 수 있는 세련되고 검증된 자신만의 제품을 개발하고 상용화 하고 있습니다. 하지만 이러한 제품은 비용이 추가된다는 (큰)고민이 생깁니다. 물론 유지보수 계약을 통해 기술지원과 더불어 든든한 책임전가의 대상(?)인 벤더사가 존재한다는 장점이 있지만 모든 사용자가 이런 비용을 지불할 수 있는것은 아니겠지요.

**2020년 JRebel 자료**
![Most Popular Java Application Server](https://marvel-b1-cdn.bc0a.com/f00000000156946/www.jrebel.com/sites/default/files/image/2020-01/7.%20what%20application%20server%20do%20you%20use%20on%20main%20application.png)

::: details 2014년 자료
![rebellabs:App Server Most of Used](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/app-server-used-most-often-graph.jpg?token=ADUAZXKGEU5LVPPWSH3R4YK67EUKK)
:::

Java 웹 어플리케이션을 실행하는 Application Server의 종류는 거의 30가지에 달하나 조사된 [JRebel의 통계](https://www.jrebel.com/blog/2020-java-technology-report)에 따르면 여전히 과반 이상을 Tomcat이 점유하고 있다고 합니다. 여러가지 이유가 더 있겠지만 앞서 언급한 많은 레퍼런스와 무료라는 큰 특징으로 인해 수많은 사용자가 톰캣을 사용하고 있습니다.

JRebel에서 언급한것과 같이 Spring Boot, Docker, Hybris 및 AWS와 같은 다른 주요 Java 플랫폼과의 호환성이 뒷받침이 되는것 같습니다.

- - -

## 1.2 톰캣 이력
톰캣의 정식 명칭은 Apache Tomcat Server 입니다. 이를 줄여 톰캣 **Tomcat** 이라고 흔히 불려지고 있지요. 톰캣의 간단한 이력은 다음과 같습니다.

| 기준               | 2021년 12월 23일                        |
| ------------------ | -------------------------------------- |
| Deveoloper         | Apache Software Foundation             |
| Last Stable release     | 10.0.14                    |
| Development Status | Active                                 |
| Written in         | Java                                   |
| Operating System   | Cross-Platform                         |
| Type               | Servlet Container / HTTP Web Server    |
| License            | Apache License 2.0                     |
| Website            | [tomcat.apache.org](tomcat.apache.org) |

현재까지 출시된 버전은 10.0.14 버전이고 앞으로도 지속적으로 업데이트가 있을 예정입니다. 무료로 제공되는 이유로 인해 톰캣을 기반으로 한 소프트웨어들이 있는데, 이경우 개발된 시점을 기준으로 톰캣 버전이 고정되어 있는 경우가 있습니다. ~~4.0 버전은 최근 보이지 않지만 JDK 1.4.2 를 사용하던 시기가 가장 많은 Java 웹 어플리케이션이 개발되던 시기이기에 톰캣 5.5 버전은 아직도 상당히 많은 사용처가 있을것이라 보여집니다.~~

- - -

### 1.3 톰캣 구성 요소
톰캣을 구성하는 핵심적인 요소는 다음의 세가지 컴포넌트입니다.

![Tomcat_Component](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/tomcat_component_do.jpg?token=ADUAZXMO7ZXOL64TU2WHS7267EULI)

Catalina는 아마도 톰캣을 사용하면 가장 많이 보게되는 단어 중 하나일 것입니다.

- Catalina 컴포넌트는 서블릿을 처리하는 역할을 수행합니다.
- Coyote는 HTTP 요청을 처리하는 역할을 수행하는 컴포넌트로서 톰캣에 TCP를 통한 프로토콜을 생성하고 관리합니다.
- Jasper는 jsp 페이지를 처리하는 컴포넌트로서 jsp 로 만들어진 페이지를 처리하는 서블릿 입니다.

처리되는 컴포넌트의 역할을 이해한다면 톰캣에서 어플리케이션 수행시 발생되는 코드 스텍을 이해하는데 도움이 될 수 있습니다.

- - -

## 1.4 TomEE?
톰캣에 대하여 흔히들 '톰캣은 완전한 WAS(Web Application Server)가 아니다'라고 합니다. 앞서 설명하였지만 톰캣은 JSP/Servlet 엔진의 역할을 수행합니다. 하지만 Java Enterprise 기능인 EJB, JTA, JMS, WebService 등은 포함되어 있지 않죠. 이러한 이유로 WAS의 일부 기능만을 수행 할 수 있을 뿐 WAS는 아니다 라고 합니다. 이러한 Enterprise 요소를 지원하기위한 요구사항으로 OpenEJB나 Apache ActiveMQ, Apache CXF등의 컴포넌트 요소가 톰캣과는 별도의 프로젝트로 진행되어 해당 컴포넌트들을 결합함으로 톰캣에서 이를 지원할 수 있었습니다. 이제는 어느정도 시간이 지나 Enterprise 컴포넌트와의 연계성이 뚜렷해졌고 통합이 가능해짐에 따라 톰캣을 Java Enterprise 스펙에 맞게 재 조정하는 프로젝트가 시작됩니다. 이를 TomEE(Tomcat Enterprise Edition)이라 합니다.

TomEE의 대표 홈페이지는 [tomee.apache.org](http://tomee.apache.org)이며 상세한 설명과 문서가 준비되어있기 때문에 사용하는데 큰 어려움이 없습니다. TomEE에서 지원하는 Java Enterprise 컴포넌트들은 다음과 같습니다.

<https://tomee.apache.org/comparison.html>

|                                                 | Tomcat | TomEE WebProfile | TomEE MicroProfile | TomEE Plume | TomEE Plus |
| :---------------------------------------------- | :----- | :--------------- | :----------------- | :---------- | ---------- |
| Jakarta Annotations                             | ✔︎      | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Debugging Support for Other Languages   | ✔︎      | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Security (Java EE Enterprise Security)  | ✔︎      | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Server Pages (JSP)                      | ✔︎      | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Servlet                                 | ✔︎      | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Standard Tag Library (JSTL)             | ✔︎      | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta WebSocket                               | ✔︎      | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Expression Language (EL)                | ✔︎      | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Activation                              |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Bean Validation                         |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Contexts and Dependency Injection (CDI) |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Dependency Injection (@Inject)          |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Enterprise Beans (EJB)                  |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Interceptors                            |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta JSON Binding (JSON-B)                   |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta JSON Processing (JSON-P)                |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Mail (JavaMail)                         |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Managed Beans                           |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Persistence (JPA)                       |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta RESTful Web Services (JAX-RS)           |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Server Faces (JSF)                      |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Transactions (JTA)                      |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta XML Binding (JAXB)                      |        | ✔︎                | ✔︎                  | ✔︎           | ✔︎          |
| Jakarta Authentication (JAAS)                   |        |                  |                    | ✔︎           | ✔︎          |
| Jakarta Authorization (JACC)                    |        |                  |                    | ✔︎           | ✔︎          |
| Jakarta Concurrency                             |        |                  |                    | ✔︎           | ✔︎          |
| Jakarta Connectors                              |        |                  |                    | ✔︎           | ✔︎          |
| Jakarta Enterprise Web Services                 |        |                  |                    | ✔︎           | ✔︎          |
| Jakarta Messaging (JMS)                         |        |                  |                    | ✔︎           | ✔︎          |
| Jakarta SOAP with Attachments                   |        |                  |                    | ✔︎           | ✔︎          |
| Jakarta Web Services Metadata                   |        |                  |                    | ✔︎           | ✔︎          |
| Jakarta XML Web Services (JAX-WS)               |        |                  |                    | ✔︎           | ✔︎          |
| Jakarta Batch (JBatch)                          |        |                  |                    |             | ✔︎          |

---

현재 국내의 개발 환경이나 운영 환경에서는 이전에 잠시 EJB가 사용되었을 뿐 ~~최근~~ 전자정부 프레임워크에서도 보이듯 Enterprise 환경을 요구하는 상황은 거의 없는 것으로 보입니다. 아무래도 WAS 의존성을 낮추기 위해서는 벤더에서 주도하여 각각의 컴포넌트를 제공하는 Enterprise 구성 요소에 대한 의존도를 낮출 수 있는 방향이기는 하겠지요. 하지만 일부의 경우는 Enterprise 구성 요소를 잘 사용하기만 하면 어렵지 않게 안정적이고 보안적으로 보장되는 서비스의 구현이 가능할 것입니다.

부가적인 설명을 드리자면 JDK 버전과 Java Enterprise 버전은 서로 범위가 다릅니다. Java Standard기능은 JDK 버전과 같지만 Java Enterprise 기능은 JDK 버전과는 별개로 WAS에서 지원하는 컴포넌트의 요소에 따라 그 버전을 달리 합니다. 앞서 대표적인 국내 프레임워크로 Spring 프레임워크를 사용하는 전자정부 프레임워크를 예로 들었지만 국내와는 달리 국외 통계를 본다면 Java Enterprise의 사용은 그리 생소하지 않습니다.

따라서 Java Enterprise 환경을 고려한다면 톰캣을 기반으로 한 TomEE를 활용하는 방법도 톰캣에 익숙한 개발자들에게는 도움이 될 수 있겠습니다.
