---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job", "wildfly", "JBoss"]
---

# Wildfly(Jboss)

> image info : <https://quay.io/repository/wildfly/wildfly?tab=info>  
> github : <https://github.com/jboss-dockerfiles/wildfly>  
> wildfly docker example : <http://www.mastertheboss.com/soa-cloud/docker/deploying-applications-on-your-docker-wildfly-image/>

Wildfly 이미지를 베이스로 기존 Dockerfile을 작성하여 빌드 후 컨테이너를 기준으로 배포하는 것도 가능하지만, 베이스 이미지를 유지한 채로 애플리케이션(war)을 바인드하여 실행하는 것도 가능하다.

## Dockerfile과 비교

- dockerfile 의 예
  ```docker
  FROM jboss/wildfly
  RUN /opt/jboss/wildfly/bin/add-user.sh admin admin --silent
  ADD jboss-as-helloworld.war /opt/jboss/wildfly/standalone/deployments/
  CMD ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]
  ```
  - `FROM`은 Nomad가 실행시킬 이미지로 지정
  - `RUN` 절의 `add-user.sh`는 `mgmt-users.properties`를 생성하고자 하는 목적이므로 Nomad의 `artifact`로 중앙레포에서 받거나 `template`으로 작성하여 바인딩 가능
  - `ADD` 절은 WAR파일을 추가하는 것으로 호스트의 파일 또는 `artifact`로 중앙레포에서 받아 바인딩
  - `CMD` 절은 기본 실행명령을 대체하는 것으로 Nomad에서 `command`와 `args`로 대체 가능

- job > groups > task(docker) > artifact :
  WAR 파일을 다운로드 받아 준비
  ::: warning 참고
  Nomad 클라이언트 호스트에 미리 파일을 두는것도 가능하나 오케스트레이션 특성상 중랑 레포기능을 하는곳에서 배포시 다운받는 방식이 확장성 측면에서 고려되어야 함
  :::

- job > groups > task(docker) > template :
  - `add-user.sh`를 통해 management 콘솔의 사용자를 생성해야 하지만 미리 생성된 내용(admin/admin)을 넣어 처리
  - 다른 사용자를 생성하고자 한다면 설치된 wildfly나 docker로 실행한 wildfly에서 다음 스크립트로 생성된 파일 내용 확인하여 template의 data로 처리
    ```bash
    # example (admin/admin)
    /opt/jboss/wildfly/bin/add-user.sh admin admin --silent
    cat /opt/jboss/wildfly/standalone/configuration/mgmt-users.properties
    ```
    ```bash
    admin=c22052286cd5d72239a90fe193737253
    ```

- job > groups > task(docker) > config > mount : 
  - 다운받은 WAR 파일과 `mgmt-users.properties`를 컨테이너에 바인딩
  - Nomad가 Host 내부적으로 별도 루트경로를 할당받으므로, 각 파일과 구성파일은 독립적으로 위치함
  ::: tip
  `volumes`로 처리하는것도 가능 <https://www.nomadproject.io/docs/drivers/docker#volumes>
  :::

- job > groups > task(docker) > config > args : 
  management가 기본 `127.0.0.1`이므로 포트포워딩으로 접속이 불가하므로 `0.0.0.0`으로 변경
  ```hcl
  args = ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]
  ```
  ::: tip
  조금더 명확하게는 `command` 에 `"/opt/jboss/wildfly/bin/standalone.sh"`를 구성하고 args를 분리하는 것도 가능
  :::






## Sample Job

```hcl
locals {
  WAR_URL = "https://github.com/spagop/quickstart/raw/master/management-api-examples/mgmt-deploy-application/application/jboss-as-helloworld.war"
  WAR_DEST = "local/deployments/jboss-as-helloworld.war"
}

job "jboss" {
  datacenters = ["dc1"]

  group "jboss" {

    network {
      port "http" {
        to = "8080"
      }
      port "mgmt" {
        to = "9990"
      }
    }

    ### csi (nfs) 
    # volume "nfs-vol" {
    #   type            = "csi"
    #   source          = "nfs-vol"
    #   read_only       = false
    #   attachment_mode = "file-system"
    #   access_mode     = "single-node-writer"
    #   #per_alloc       = true
    # }

    service {
      name = "jboss-http"
      port = "http"

      check {
        type     = "tcp"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "http" {
      driver = "docker"

      config {
        image = "jboss/wildfly"
        ports = ["http", "mgmt"]
        args = ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]
        mount {
          type = "bind"
          target = "/opt/jboss/wildfly/standalone/deployments/jboss-as-helloworld.war"
          source = "local/deployments/jboss-as-helloworld.war"
          readonly = false
          bind_options {
            propagation = "rshared"
          }
        }
        mount {
          type = "bind"
          target = "/opt/jboss/wildfly/standalone/configuration/mgmt-users.properties"
          source = "local/configuration/mgmt-users.properties"
        }
      }

      env {
      }

      artifact {
        source      = local.WAR_URL
        destination = local.WAR_DEST
      }
      
      template {
        # mgmt : admin / admin
        data        = "admin=c22052286cd5d72239a90fe193737253"
        destination = "local/configuration/mgmt-users.properties"
      }

      resources {
        cpu    = 500
        memory = 512
      }

      ### csi (nfs) 
      # volume_mount {
      #   volume      = "nfs-vol"
      #   destination = "/csi"
      # }
    }

    scaling  {
      enabled = true
      min     = 1
      max     = 4

      ### cpu autoscale
      # policy {
      #   evaluation_interval = "10s"
      #   cooldown            = "1m"
      #   driver = "nomad-apm"
      #   check "mem_allocated_percentage" {
      #     source = "nomad-apm"
      #     query  = "avg_cpu" 
      #     strategy "target-value" {
      #       target = 90
      #     }
      #   }
      # }
    }
  }
}
```