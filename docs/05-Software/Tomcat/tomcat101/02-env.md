---
description: Tomcat
tag: ["Tomcat", "Java"]
---

# 2. Tomcat 설치환경

<iframe width="560" height="315" src="https://www.youtube.com/embed/XvinTBrQ0ig" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- - -

## 2.1 OS
톰캣을 설치하는 OS 플랫폼 환경은 모든 환경을 지원합니다. 그나마 예전에는 일부 Unix/Linux/OSX 환경에서 Apache HTTP Server 설치하듯 컴파일을 통해 구성하였으나, 최근에는 압축파일을 해제하고 바로 사용할 수 있는 경우가 대부분입니다.
톰캣을 운영하기 위해 OS를 선택해야하는 입장이라면 다음과 같은 설치 타입을 고려할 수 있습니다.

- Windows : Zip 파일을 풀어 사용하거나 msi 설치로 윈도우 서비스에 등록하는 설치
- Unix/Linux/OSX : 압축 파일을 풀어 사용하거나 컴파일하여 설치


## 2.2 JDK
> <https://tomcat.apache.org/whichversion.html>

톰켓의 버전이 올라감에 따라 지원하는 Java Standard Spec Version 또한 변경됩니다. 이 경우 일부 상위 버전은 JDK의 특정 버전에서 지원되지 않을 수 있지요. 따라서 개발되는 어플리케이션의 JDK요구치나 표준화된 톰캣 버전에 따라 지원되는 JDK 버전이 상이할 수 있습니다. 다음의 표를 참고하시기 바랍니다.

| **Servlet Spec** | **JSP Spec** | **EL Spec** | **WebSocket Spec** | **Authentication (JASPIC) Spec** | **Apache Tomcat Version** | **Latest Released Version** | **Supported Java Versions**             |
| :--------------- | :----------- | :---------- | :----------------- | :------------------------------- | :------------------------ | :-------------------------- | :-------------------------------------- |
| 6.0              | 3.1          | 5.0         | 2.1                | 3.0                              | 10.1.x                    | 10.1.0-M8 (alpha)           | 11 and later                            |
| 5.0              | 3.0          | 4.0         | 2.0                | 2.0                              | 10.0.x                    | 10.0.14                     | 8 and later                             |
| 4.0              | 2.3          | 3.0         | 1.1                | 1.1                              | 9.0.x                     | 9.0.56                      | 8 and later                             |
| 3.1              | 2.3          | 3.0         | 1.1                | 1.1                              | 8.5.x                     | 8.5.73                      | 7 and later                             |
| 3.1              | 2.3          | 3.0         | 1.1                | N/A                              | 8.0.x (superseded)        | 8.0.53 (superseded)         | 7 and later                             |
| 3.0              | 2.2          | 2.2         | 1.1                | N/A                              | 7.0.x (archived)          | 7.0.109 (archived)          | 6 and later (7 and later for WebSocket) |
| 2.5              | 2.1          | 2.1         | N/A                | N/A                              | 6.0.x (archived)          | 6.0.53 (archived)           | 5 and later                             |
| 2.4              | 2.0          | N/A         | N/A                | N/A                              | 5.5.x (archived)          | 5.5.36 (archived)           | 1.4 and later                           |
| 2.3              | 1.2          | N/A         | N/A                | N/A                              | 4.1.x (archived)          | 4.1.40 (archived)           | 1.3 and later                           |
| 2.2              | 1.1          | N/A         | N/A                | N/A                              | 3.3.x (archived)          | 3.3.2 (archived)            | 1.1 and later                           |

~~톰캣 5.5.x 버전의 경우 5.5.12 버전 이후로는 JDK 5 이상을 지원함에 유의합니다.~~

Java SE의 경우 OS 플랫폼에 따라 제공하는 벤더가 다른 경우가 있습니다. Oracle이 서브스크립션 형태로, 업데이트에 대해 유료화 선언을 한 이후로 여러 파생 Java를 고려할 수 있습니다. 여전히 8 버전을 사용하는 서비스가 많아 OracleJDK가 점유율이 높으나, 이후 높은 버전으로 이전시에는 다른 JDK를 고려하는 상황도 발생할 것으로 보입니다.


**Most Popular JRE/JDK Distribution (JRebel, 2020)**
![2020Java](https://marvel-b1-cdn.bc0a.com/f00000000156946/www.jrebel.com/sites/default/files/image/2020-01/12.%20what%20jre_jdk%20distribution%20do%20you%20use.png)

## 3. Java 제공자

|     Provider      | Free Builds from Source | Free Binary Distributions  | Extended Updates | Commercial Support | Permissive License |
|-|-|-|-|-|-|
| [AdoptOpenJDK](https://adoptopenjdk.net)      |    Yes      |    Yes        |   Yes    |   No       |   Yes      |
| [Amazon – Corretto](https://aws.amazon.com/corretto) |    Yes      |    Yes        |   Yes    |   No       |   Yes      |
| [Azul Zulu](https://www.azul.com/downloads/zulu/)         |    No       |    Yes        |   Yes    |   Yes      |   Yes      |
| [BellSoft Liberica](https://bell-sw.com/java.html) |    No       |    Yes        |   Yes    |   Yes      |   Yes      |
| [IBM](https://www.ibm.com/developerworks/java/jdk)               |    No       |    No         |   Yes    |   Yes      |   Yes      |
| [OpenJDK Upstream](https://adoptopenjdk.net/upstream.html)           |    Yes      |    Yes        |   Yes    |   No       |   Yes      |
| [Oracle JDK](https://www.oracle.com/technetwork/java/javase/downloads)        |    No       |    Yes        |   No   |   Yes      |   No       |
| [Oracle OpenJDK](http://jdk.java.net)    |    Yes      |    Yes        |   No     |   No       |   Yes      |
| [ojdkbuild](https://github.com/ojdkbuild/ojdkbuild)         |    Yes      |    Yes        |   No     |   No       |   Yes      |
| [RedHat](https://developers.redhat.com/products/openjdk/overview)            |    Yes      |    Yes        |   Yes    |   Yes      |   Yes      |
| [SapMachine](https://sap.github.io/SapMachine)        |    Yes      |    Yes        |   Yes    |   Yes      |   Yes      |

- Oracle의 경우 Java가 필요한 미들웨어를 구매한 경우 Java에 대한 지원이 포함됩니다.
- RedHat의 경우 RedHat Linux, RedHat Middelware를 서브스크립션하는 경우 Java에 대한 지원이 포함됩니다.
- AIX : IBM에서 제공하는 JDK를 사용합니다.
- HP-UX : HP에서 제공하는 JDK를 사용합니다.
- AIX의 JDK경우 Windows환경에도 설치가 가능하기는 하지만 일반적으로는 Oracle에서 제공하는 기존 SunJDK를 설치하여 사용합니다.
- OSX(Mac)는 JDK6 까지는 Apple사에서 제공하지만 JDK7부터는 Oracle에서 설치파일을 받아 설치합니다.