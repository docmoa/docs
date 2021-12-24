---
meta:
  - name: description
    content: Tomcat
tags: ["Tomcat", "Java"]
---

# 6. Tomcat Database 연동

- JDBC Connection Pool
- DB 연동 예제
- DB 연동 설정값
- JNDI Lookup

<iframe width="560" height="315" src="https://www.youtube.com/embed/odsWlmZfzag" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- - -

## 6.1 JDBC Connection Pool

JDBC Connection Pool은 Java에서 DB(Data Base)의 Session 자원을 미리 확보함으로 재생성하는 비용을 줄이기 위한 기술 입니다. Java에서 사용되는 기술이기 때문에 각 DB 벤더사들은 Java로 구현되는 서비스에서 자사의 DB를 사용할 수 있도록 별도의 라이브러리를 제공하며 이를 사용하여 DB와의 Connection을 생성하고 DB를 사용할 수 있게 됩니다.

JDBC는 여타 드라이버와는 다르게 미리 Connection을 확보하여 JVM상에 Object상태로 만들어두고 이를 요청하는 서비스에 빌려줍니다. 빌려준다는 표현을 사용한 이유는 반드시 반환되어야 하기 때문입니다. 앞서 미리 만든다는 표현은 만드는 개수가 제한되어 있다는 의미로 사용하였으며, 때문에 한정된 자원을 DB와의 연계 처리만을 하는 경우 잠시 사용하고 다시 반납하는 과정을 거칩니다.

다음은 jsp에서 단일 Oracle DB와의 Connection Pool을 생성하고 반납하는 샘플 코드입니다.(~~테스트 용도로 입니다.~~)

```java
<%@ page import="java.sql.*" %>
<%
  StringBuffer sbError = new StringBuffer();
  DatabaseMetaData dbMetaData = null;
  Connection conn = null;
%>
<font size="-1"><p>
<%
  DriverManager.registerDriver (new oracle.jdbc.OracleDriver());
  try {
    conn = DriverManager.getConnection("jdbc:oracle:thin:@172.16.1.128:1521:TOSA1", "fmsvr", "fmsvr");
    dbMetaData = conn.getMetaData();
%>
<p>
Name of JDBC Driver: <%= dbMetaData.getDriverName() %><br>
Version: <%= dbMetaData.getDriverVersion() %><br>
Major: <%= dbMetaData.getDriverMajorVersion() %><br>
Minor: <%= dbMetaData.getDriverMinorVersion() %><br>
<p>
Database Name: <%= dbMetaData.getDatabaseProductName() %><br>a
Version: <%= dbMetaData.getDatabaseProductVersion() %><br>
<%
  } catch (SQLException e) {
    sbError.append(e.toString());
  } finally {
    if (conn != null) {
      try {
        conn.close();
      } catch (SQLException e) {
        sbError.append(e.toString());
      }
    }
  }
  if (sbError.length() != 0) {
    out.println(sbError.toString());
  } else {
%>
<p>No error</font>
<%
  }
%>
```

> 주어진 정보로 getConnection()을 수행하고 다시 close()를 수행하여 반납하는 과정이며, close()하지 않는 경우 해당 객체는 모두 사용하였음에도 불구하고 메모리상에 남아 차후 메모리 이슈를 발생시킬 수 있습니다.

톰캣에서는 이런 일련의 Connection을 생성하는 작업을 어플리케이션 대신 생성할 수 있으며 내부적으로 생성하는 개수나 연결이 끊어졌을 때의 재시도, 사용하지 않는 Connection의 강제 반환 등의 설정이 가능합니다.

다음은 `Context` 디스트립터 내에 설정하는 `Resource`에서 정의한 DataSource 예제 입니다.

```xml
<Resource name="jdbc/test"
          auth="Container"
          type="javax.sql.DataSource"
          username="oracle"
          password="oracle"
          driverClassName="oracle.jdbc.driver.OracleDriver"
          url="jdbc:oracle:thin:@address:1521:SID"
          removeAbandoned="true"
          removeAbandonedTimeout="60"
          logAbandoned="true"
          maxActive="25"
          maxIdle="10"
          maxWait="-1"
/>
```

- - -

## 6.2 DB 연동 예제

톰캣에서 DB를 연동하기 위해서는 우선 사용할 DB의 벤더사에서 제공하는 JDBC driver를 ClassLoader에서 읽도록 해야 합니다. 우선 JDBC driver를 받고 두가지 방법으로 적용이 가능합니다.

- setenv script
```bash
#JDBC Driver Classpath
CLASSPATH=/app/lib/jdbc.jar
```

- lib 디렉토리에 복사
  - $CATALINA_HOME/common/lib/jdbc.jar (5.5)
  - $CATALINA_HOME/shared/lib/jdbc.jar (5.5)
  - $CATALINA_HOME/lib/jdbc.jar (6+)

대표적인 DB의 `Context` 디스크립터에 설정하는 방법은 다음과 같습니다.

```xml
<!-- MySQL - Connector/J -->
<Resource name="jdbc/test"
          auth="Container"
          type="javax.sql.DataSource"
          username="javauser"
          password="javadude" 
          driverClassName="com.mysql.jdbc.Driver" 
          url="jdbc:mysql://ipaddress:3306/javatest" 
          maxActive="25"
          maxIdle="10"
          maxWait="-1"
/>
```

```xml
<!-- Oracle - classes12.jar(jdk1.4.2), ojdbc#.jar(5+) -->
<Resource name="jdbc/test"
          auth="Container"
          type="javax.sql.DataSource"
          username="oracle"
          password="oracle" 
          driverClassName="oracle.jdbc.driver.OracleDriver" 
          url="jdbc:oracle:thin:@ipaddress:1521:SID" 
          maxActive="25"
          maxIdle="10"
          maxWait="-1"
 />
```

```xml
<!-- PostgreSQL - JDBC # -->
<Resource name="jdbc/test"
          auth="Container" 
          type="javax.sql.DataSource" 
          username="myuser"
          password="mypasswd" 
          driverClassName="org.postgresql.Driver" 
          url="jdbc:postgresql://ipaddress:5432/mydb" 
          maxActive="25"
          maxIdle="10"
          maxWait="-1"
/>
```

## 6.3 DB 연동 설정값
`Resource`에 정의되는 항목은 기본적인 url이나 DB접근 계정정도만 있어도 가능하지만 간혹 튜닝이나 문제해결을 위해 추가적인 옵션이 요구되는 경우가 있습니다. 톰캣에서는 다음의 설정값을 제공합니다.

| ATTRIBUTE              | DESCRIPTOIN                                 | DEFAULT      |
| ---------------------- | ------------------------------------------- | ------------ |
| maxActive              | 최대 Connection 값                          | 100          |
| maxIdle                | Idle Connection 최대 허용치                 | =maxActive   |
| minIdle                | Idle Connection 최소 허용치                 | =initialSize |
| initialSize            | Connection Pool의 최초 생성 개수            | 10           |
| maxWait                | Connection을 얻기위해 대기하는 최대 시간    | 30000(ms)    |
| removeAbandoned        | 특정시간 동안 사용하지 않는 Connection 반환 | false        |
| removeAbandonedTimeout | removeAbandoned가 동작하는데 소요되는 시간  | 60(s)        |
| logAbandoned           | Connection이 remove될 때 log에 기록         | false        |
| testOnBorrow           | getConnection()이 수행될 때 유효성 테스트   | false        |
| validationQuery        | 테스트를 위한 쿼리                          | null         |

`validationQuery`로는 다음과 같이 적용 가능합니다.

- mysql, MSSql : SELECT 1
- Oracle : select 1 from dual

<http://tomcat.apache.org/tomcat-10.0-doc/jdbc-pool.html>


## 6.4 JNDI Lookup
톰캣에서 생성한 JDBC Connection Pool을 DataSource로서 사용하기 위해서는 JNDI를 Lookup하는 방법을 사용합니다. JNDI를 사용하면 이를 지원하는 다른 프레임워크나 API에서도 톰캣의 자원을 사용할 수 있습니다. mybatis/ibatis의 경우도 JNDI 설정을 할 수 있습니다.

`Context`디스크립터로 정의한 DataSource는 어플리케이션의 `web.xml`에서 정의하고 소스에서는 `lookup`을 이용하여 사용합니다. 일련의 설정방법의 예는 다음과 같습니다. Context의 정의의 위치에 따라 전체 어플리케이션에 적용될 수도 있고 host단위, 혹은 단일 어플리케이션 내에서만 자원을 생성하게 됩니다.

```xml
<!-- context.xml -->
<Resource name="jdbc/test"
          auth="Container"
          type="javax.sql.DataSource"
          username="oracle"
          password="oracle" 
          driverClassName="oracle.jdbc.driver.OracleDriver" 
          url="jdbc:oracle:thin:@ipaddress:1521:SID" 
 />
```

```xml
<!-- web.xml -->
<web-app>
    ...
    <resource-ref>
        <res-ref-name>jdbc/test</res-ref-name>
        <res-type>javax.sql.DataSource</res-type>
        <res-auth>Container</res-auth>
    </resource-ref>
    ...
</web-app>
```

```java
//Source Code
ds = ctx.lookup("java:comp/env/jdbc/test");
```
