---
description: Nomad + Consul Sample
tag: ["Nomad", "Consul", "Scouter", "Job"]
author: GS
---

# Scouter

- 공식 Github : <https://github.com/scouter-project/scouter>
- Scouter 다운로드
  - scouter collector와 host-agent 를 실행하는 job에서 버전정보를 기반으로 다운로드
  - host agent는 `system` 타입으로 모든 노드에서 실행되도록 구성
- tomcat 다운로드
  - 다운로드 받지않고 호스트에 미리 설치해 놓는 방식이 더 가벼워보임 --> 아마도 Packer, Terraform의 조합이면 가능
  - 다운로드 받게 구성하면 컨테이너처럼 Nomad가 배포할 때마다 다운받아서 구성 가능
- Template - server.xml
  - server.xml 기본 구성에서 port가 선언되는 자리를 java option에서 받을 수 있도록 변경
  - Template 구성도 가능하고 미리 구성한 xml을 다운로드 받게 하는것도 괜찮아 보임
- Consul과 함께 구성된 경우 Nginx같은 LB 구성 Job 에서 backend를 동적으로 구성 가능
- Nomad에 Scouter Collector와 Host Agent를 위한 별도 Namespace를 구성하는 것도 관리를 위해 좋아보임
  `nomad namespace apply -description "scouter" scouter`

## Scouter - Collector Server

- Collector의 경우 Client 에서 연결하기 위해 고정된 포트를 지정해야 하므로 static 포트로 지정
- Collector의 경우 data를 영구적으로 보관하기 위해서는 `Volume` 할당하는 것을 권장
  - database
  - logs

```hcl
variable "version" {
  default = "2.15.0"
  description = "scouter의 버전 기입 또는 배포시 입력 받기"
}

locals {
  souter_release_url = "https://github.com/scouter-project/scouter/releases/download/v${var.version}/scouter-min-${var.version}.tar.gz"
}

job "scouter-collector" {
  datacenters = ["dc1"]
  // namespace = "scouter"

  type = "service"

  group "collector" {
    count = 1

    scaling {
      enabled = false
      min = 1
      max = 1
    }

    task "collector" {
      driver = "java"
      resources {
        network {
          port "collector" {
            to = 6100
            static = 6100
          }
        }
        cpu = 500
        memory = 512
      }
      artifact {
        source = local.souter_release_url
        destination = "/local"
      }
      template {
data = <<EOF
# Agent Control and Service Port(Default : TCP 6100)
net_tcp_listen_port={{ env "NOMAD_PORT_collector" }}

# UDP Receive Port(Default : 6100)
net_udp_listen_port={{ env "NOMAD_PORT_collector" }}

# DB directory(Default : ./database)
db_dir=./database

# Log directory(Default : ./logs)
log_dir=./logs
EOF
        destination = "local/scouter/server/conf/scouter.conf"
      }
      config {
        class_path = "local/scouter/server/scouter-server-boot.jar"
        class = "scouter.boot.Boot"
        args = ["local/scouter/server/lib"]
      }
      service {
        name = "scouter-collector"
        tags = ["scouter"]

        port = "collector"

        check {
          type  = "tcp"
          interval = "10s"
          timeout  = "2s"
          port  = "collector"
        }
      }
    }
  }
}


```

## Scouter - Host Agent

- 모든 Nomad Client 노드를 대상으로 구성하기 위해 `system` 타입으로 실행하나, 조건이 필요한 경우 Java가 있는 경우, 혹은 특정 노드에 대한 조건을 `Constrain`으로 구성할 수 있음
- Collector Server의 정보를 Consul에서 동적으로 받아오도록 템플릿 구성

```hcl
// nomad namespace apply -description "scouter" scouter

variable "version" {
  default = "2.15.0"
}

locals {
  souter_release_url = "https://github.com/scouter-project/scouter/releases/download/v${var.version}/scouter-min-${var.version}.tar.gz"
}

job "scouter-host-agent" {
  datacenters = ["dc1"]
  // namespace = "scouter"

  type = "system"

  group "agent" {

    task "agent" {
      driver = "java"
      resources {
        cpu = 100
        memory = 128
      }
      artifact {
        source = local.souter_release_url
        destination = "/local"
      }
      template {
data = <<EOF
obj_name=${node.unique.name}
{{ range service "scouter-collector" }}
net_collector_ip={{ .Address }}
net_collector_udp_port={{ .Port }}
net_collector_tcp_port={{ .Port }}
{{ end }}
#cpu_warning_pct=80
#cpu_fatal_pct=85
#cpu_check_period_ms=60000
#cpu_fatal_history=3
#cpu_alert_interval_ms=300000
#disk_warning_pct=88
#disk_fatal_pct=92
EOF
        destination = "local/scouter/agent.host/conf/scouter.conf"
      }
      config {
        class_path = "local/scouter/agent.host/scouter.host.jar"
        class = "scouter.boot.Boot"
        args = ["local/lib"]
      }
    }
  }
}

```

## Tomcat Sample

- Tomcat 서버 구성 시 Tomcat과 Scouter 모두를 다운받게 구성
  - 둘 모두 다운받기 때문에 운영에서 구성하는 경우 필요한 파일들만 별도 압축하여 별도 관리하는 것을 권장
- 구성에 따른 이름을 매번 다르게 구성하기 위해 변수 활용
  - `-Dobj_name=Tomcat-${node.unique.name}-${NOMAD_PORT_http}`

```hcl
variable "tomcat_version" {
  default = "10.0.14"
}

variable "scouter_version" {
  default = "2.15.0"
}

locals {
  tomcat_major_ver = split(".", var.tomcat_version)[0]
  tomcat_download_url = "https://archive.apache.org/dist/tomcat/tomcat-${local.tomcat_major_ver}/v${var.tomcat_version}/bin/apache-tomcat-${var.tomcat_version}.tar.gz"
  souter_release_url = "https://github.com/scouter-project/scouter/releases/download/v${var.scouter_version}/scouter-min-${var.scouter_version}.tar.gz"
  war_download_url = "https://tomcat.apache.org/tomcat-10.0-doc/appdev/sample/sample.war"
}

job "tomcat-scouter" {
  datacenters = ["dc1"]
  // namespace = "scouter"

  type = "service"

  group "tomcat" {
    count = 1

    scaling {
      enabled = true
      min = 1
      max = 3
    }

    task "tomcat" {
      driver = "raw_exec"
      resources {
        network {
          port "http" {}
          port "stop" {}
          port "jmx" {}
        }
        cpu = 500
        memory = 512
      }
      env {
        APP_VERSION = "0.1"
        CATALINA_HOME = "${NOMAD_TASK_DIR}/apache-tomcat-${var.tomcat_version}"
        CATALINA_OPTS = "-Dport.http=$NOMAD_PORT_http -Dport.stop=$NOMAD_PORT_stop -Ddefault.context=$NOMAD_TASK_DIR -Xms256m -Xmx512m -javaagent:local/scouter/agent.java/scouter.agent.jar -Dscouter.config=local/conf/scouter.conf -Dobj_name=Tomcat-${node.unique.name}-${NOMAD_PORT_http}"
        JAVA_HOME = "/usr/lib/jvm/java-11-openjdk-amd64"
      }
      artifact {
        source = local.tomcat_download_url
        destination = "/local"
      }
      artifact {
        source = local.souter_release_url
        destination = "/local"
      }
      artifact {
        source = local.war_download_url
        destination = "/local/webapps"
      }
      template {
data = <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<Server port="${port.stop}" shutdown="SHUTDOWN">
    <Listener className="org.apache.catalina.startup.VersionLoggerListener"/>
    <Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on"/>
    <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener"/>
    <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener"/>
    <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener"/>
    <GlobalNamingResources>
        <Resource name="UserDatabase" auth="Container" type="org.apache.catalina.UserDatabase" description="User database that can be updated and saved" factory="org.apache.catalina.users.MemoryUserDatabaseFactory" pathname="conf/tomcat-users.xml"/>
    </GlobalNamingResources>
    <Service name="Catalina">
        <Connector port="${port.http}" protocol="HTTP/1.1" connectionTimeout="20000"/>
        <Engine name="Catalina" defaultHost="localhost">
            <Realm className="org.apache.catalina.realm.LockOutRealm">
                <Realm className="org.apache.catalina.realm.UserDatabaseRealm" resourceName="UserDatabase"/>
            </Realm>
            <Host name="localhost" appBase="${default.context}/webapps/" unpackWARs="true" autoDeploy="true">
                <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs" prefix="localhost_access_log" suffix=".txt" pattern="%h %l %u %t &quot;%r&quot; %s %b"/>
            </Host>
        </Engine>
    </Service>
</Server>
EOF
        destination = "local/conf/server.xml"
      }
      template {
data = <<EOF
{{ range service "scouter-collector" }}
net_collector_ip={{ .Address }}
net_collector_udp_port={{ .Port }}
net_collector_tcp_port={{ .Port }}
{{ end }}
#hook_method_patterns=sample.mybiz.*Biz.*,sample.service.*Service.*
#trace_http_client_ip_header_key=X-Forwarded-For
#profile_spring_controller_method_parameter_enabled=false
#hook_exception_class_patterns=my.exception.TypedException
#profile_fullstack_hooked_exception_enabled=true
#hook_exception_handler_method_patterns=my.AbstractAPIController.fallbackHandler,my.ApiExceptionLoggingFilter.handleNotFoundErrorResponse
#hook_exception_hanlder_exclude_class_patterns=exception.BizException
EOF
        destination = "local/conf/scouter.conf"
      }
      config {
        command = "${CATALINA_HOME}/bin/catalina.sh"
        args = ["run", "-config", "$NOMAD_TASK_DIR/conf/server.xml"]
      }
      service {
        name = "tomcat-scouter"
        tags = ["tomcat"]

        port = "http"

        check {
          type  = "tcp"
          interval = "10s"
          timeout  = "2s"
          port  = "http"
        }
      }
      service {
        name = "tomcat-scouter"
        tags = ["jmx"]
        port = "jmx"
      }
    }
  }
}

```