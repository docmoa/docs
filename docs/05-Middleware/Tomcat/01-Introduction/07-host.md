---
meta:
  - name: description
    content: Tomcat
tags: ["Tomcat", "Java"]
---

# 7. Tomcat HOST

- 호스트 구성
- 호스트 특징
- host manager

<iframe width="560" height="315" src="https://www.youtube.com/embed/hnLzh_WE8R8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

- - -

## 7.1 호스트 구성
톰캣에 정의된 바로는 `Host`로 정의되나 일반적인 기능으로 표현한다면 가상 호스트(Virtual Host)와 같은 기능 입니다. 특정 host 명, 즉 http url로 서비스를 분기하는 역할을 합니다. `server.xml` 기본으로 설정되어있는 `localhost`인 호스트의 내용은 다음과 같습니다.

```xml
<Engine name="Catalina" defaultHost="localhost">
    <Host name="localhost" appBase="webapps" unpackWARs="true" autoDeploy="true">
    ...
    </Host>
</Engine>
```

설정된 내용을 분석해본다면 `Catalina`라는 톰캣의 엔진에서 처리하는 기본 호스트는 `localhost`이고, `localhost`는 `webapps` 디렉토리를 기본 배치 디렉토리고 갖는다는 내용입니다. 기본 호스트로 지정된 호스트는 이외에 설정된 호스트 조건에 맞지 않은 모든 요청을 처리하게 됩니다. 이렇게 생성된 `localhost`는 `$CATALINA_HOME/conf/[ENGINENAME]/[HOSTNAME]` 과 같은 경로에 호스트만의 설정 값을 갖게 됩니다. 

별도의 호스트 추가는 'Engine' 디스크립터 하위에 'Host' 디스크립터로 정의합니다. 'myhost'라는 호스트는 다음과 같이 추가할 수 있습니다.

```xml
<Engine name="Catalina" defaultHost="localhost">
    <Host name="localhost" appBase="webapps" unpackWARs="true" autoDeploy="true">
    ...
    </Host>
    <Host name="myhost" appBase="webapps_myhost" unpackWARs="true" autoDeploy="true">
    ...
    </Host>
</Engine>
```

새롭게 추가되는 호스트는 기본 배치경로를 다르게 설정합니다. 때문에 동일한 컨텍스트의 요청이라도 어떤 호스트가 처리하는가에 따라 다른 어플리케이션의 서비스를 이용하게 됩니다. 설정 후 톰캣 프로세스를 재기동하면 호스트 설정 디렉토리가 생성됨을 확인 할 수 있습니다.


## 7.2 호스트 특징

호스트의 기능은 주로 웹서버에서 많이 사용되는 기능입니다. 특정 url로 호출되는 요청을 각 요청 전달 목적지에 맞게 분배하는 역할을 수행하지요. 호스트는 톰캣에도 구현되어 있으며 이를 통해 하나의 톰캣 내에서 같은 컨텍스트를 갖는 요청의 처리가 가능합니다.

![hostRoot](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/hostRoot.jpg?token=ADUAZXPZNGFNIR7Z4S5S6MK67EUR6)

::: tip
톰캣의 프로세스를 서비스 마다 생성하지 못하는 상황(e.g. 자원의 한계와 같은) 또는 서비스에서 소모하는 자원이 크지 않아 추가적인 프로세스를 기동하지 않아도 되는 상황 등 호스트의 기능을 활용 할수 있습니다.
:::

## 7.3 host manager

호스트를 관리하기 위해 톰캣에서는 'host manager'를 제공합니다. 앞서 배치에서 보았던 'Manage APP'와 같이 호스트를 쉽게 구성할 수 있도록 UI환경을 제공합니다. 이를 통해 설정파일에 직접 수정하기보다 제공되는 UI로 정확하고 쉽게 구성하고 관리할 수 있도록 합니다.

- http://ip:port 로 기본 톰캣 http 요청 (로컬에서 기본 설정으로 실행한 경우 http://localhost:8080)
- ROOT 어플리케이션의 호출 확인 후 좌/우측의 `Host Manager` 클릭
- 톰캣 유저의 설정이 되어있지 않으므로 로그인 창에서 '취소'버튼 클릭
- `$CATALINA_HOME/conf/tomcat-user.xml` 에 설정하는 방법을 에러페이지에서 확인
- tomcat-user.xml에 다음과 같이 설정 추가 (e.g. `user/passwd`를 `admin/admin`으로 설정)
```xml
<tomcat-users>
  <role rolename="manager-gui"/>
  <role rolename="admin-gui"/>
  <user username="admin" password="admin" roles="manager-gui,admin-gui"/>
</tomcat-users>```
```

- 톰캣 재기동 후 다시 로그인 페이지 호출하여 설정한 `user/passwd` 입력 후 로그인

![hostManager](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/hostManager.jpg?token=ADUAZXORX3KILKKDCM4YLOK67EUSE)

`host manager`에서는 기본 호스트 외에 추가적인 호스트에 대한 추가를 할 수 있도록 `Add Virtual Host`를 사용할 수 있습니다. `Host` 디스크립터에서 정의되는 내용을 각 항목에 맞게 입력 할 수 있고 이렇게 추가된 호스트는 `Host name` 테이블의 `commands`에서 개별적으로 시작과 정지가 가능합니다. 호스트가 정지되어 비활성화 된 상태에서는 해당 호스트의 요청 url에 맞게 들어오더라도 기본 호스트가 처리하게 됩니다. `host manager`는 웹페이지를 통한 호스트의 추가/삭제/컨트롤이 가능하므로 외부, 또는 관리자가 아닌 사용자가 접근하지 못하도록 해야 합니다.