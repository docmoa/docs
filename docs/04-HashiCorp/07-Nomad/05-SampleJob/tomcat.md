---
meta:
  - name: description
    content: Nomad + Consul Sample
tags: ["Nomad", "Consul", "Sample", "Job"]
---

# Tomcat

- tomcat 다운로드
  - 다운로드 받지않고 호스트에 미리 설치해 놓는 방식이 더 가벼워보임 --> 아마도 Packer, Terraform의 조합이면 가능
  - 다운로드 받게 구성하면 컨테이너처럼 Nomad가 배포할 때마다 다운받아서 구성 가능
- Template - server.xml
  - server.xml 기본 구성에서 port가 선언되는 자리를 java option에서 받을 수 있도록 변경
  - Template 구성도 가능하고 미리 구성한 xml을 다운로드 받게 하는것도 괜찮아 보임
- Consul과 함께 구성된 경우 Nginx같은 LB 구성 Job 에서 backend를 동적으로 구성 가능

<iframe width="560" height="315" src="https://www.youtube.com/embed/UvB_Zi6Plbc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

```hcl
variables {
  tomcat_download_url = "https://archive.apache.org/dist/tomcat/tomcat-10/v10.0.10/bin/apache-tomcat-10.0.10.tar.gz"
  // https://tomcat.apache.org/tomcat-10.0-doc/appdev/sample/
  war_download_url = "https://tomcat.apache.org/tomcat-10.0-doc/appdev/sample/sample.war"
}

job "tomcat-10" {
  datacenters = ["dc1"]
  # namespace = "legacy"

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
        }
        cpu = 500
        memory = 512
      }
      env {
        APP_VERSION = "0.1"
        CATALINA_HOME = "${NOMAD_TASK_DIR}/apache-tomcat-10.0.10"
        CATALINA_OPTS = "-Dport.http=$NOMAD_PORT_http -Dport.stop=$NOMAD_PORT_stop -Ddefault.context=$NOMAD_TASK_DIR -Xms256m -Xmx512m"
        JAVA_HOME = "/usr/lib/jvm/java-11-openjdk-amd64"
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
      artifact {
        source = var.tomcat_download_url
        destination = "/local"
      }
      artifact {
        source = var.war_download_url
        destination = "/local/webapps"
      }
      config {
        command = "${CATALINA_HOME}/bin/catalina.sh"
        args = ["run", "-config", "$NOMAD_TASK_DIR/conf/server.xml"]
      }
      service {
        name = "legacy-tomcat"
        tags = ["tomcat"]

        port = "http"

        check {
          type  = "tcp"
          interval = "10s"
          timeout  = "2s"
          port  = "http"
        }
      }
    }
  }
}

```

## nginx

Consul과 함께 구성된 경우 nginx에 동적으로 backend 구성

```hcl
job "nginx" {
  datacenters = ["dc1"]
  # namespace = "legacy"

  group "nginx" {
    count = 1

    network {
      port "http" {
        static = 28080
      }
    }

    service {
      name = "nginx"
      port = "http"
    }

    task "nginx" {
      driver = "docker"

      config {
        image = "nginx"
        ports = ["http"]
        volumes = [
          "local:/etc/nginx/conf.d",
        ]
      }

      template {
        data = <<EOF
upstream backend {
{{ range service "legacy-tomcat" }}
  server {{ .Address }}:{{ .Port }}; # Tomcat
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}

server {
   listen {{ env "NOMAD_PORT_http" }};

   location /sample {
      proxy_pass http://backend;
   }

   location /status {
       stub_status on;
   }
}
EOF

        destination   = "local/load-balancer.conf"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }
    }
  }
}
```