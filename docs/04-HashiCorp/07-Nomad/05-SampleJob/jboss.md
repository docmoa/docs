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

## 주요 내용
- job > groups > task(docker) > config > args : 
  management가 기본 `127.0.0.1`이므로 포트포워딩으로 접속이 불가하므로 `0.0.0.0`으로 변경
  ```hcl
  args = ["/opt/jboss/wildfly/bin/standalone.sh", "-b", "0.0.0.0", "-bmanagement", "0.0.0.0"]
  ```

- job > groups > task(docker) > artifact :
  WAR 파일을 다운로드 받아 준비

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