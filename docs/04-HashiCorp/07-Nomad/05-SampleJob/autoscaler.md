---
meta:
  - name: description
    content: Nomad autoscaler for aws
tags: ["Nomad", "sample", "job", "autoscaler", "aws"]
---

<<<<<<< HEAD
# Autoscaler 
- aws cloud 환경에서 별도의 모니터링 툴을 사용하지 않고 nomad-apm 기능을 이용한 auscaler 구성
- Nomad Autoscaler 다운로드 : 
  - VM환경: <https://releases.hashicorp.com/nomad-autoscaler/> 
  - Container환경: <https://hub.docker.com/r/hashicorp/nomad-autoscaler> , <https://hub.docker.com/r/hashicorp/nomad-autoscaler-enterprise>  
- 주요링크   
  - Nomad Autoscaler aws IAM policy 관련 : <https://www.nomadproject.io/tools/autoscaling/plugins/target/aws-asg>
  - Nomad Autoscaler policy 관련 : <https://www.nomadproject.io/tools/autoscaling/policy>
  - Nomad Autoscaler의 nomad-apm 을 사용하는 경우 : <https://www.nomadproject.io/tools/autoscaling/plugins/apm/nomad>
=======
# Nomad Autoscaler 
- aws cloud 환경에서 별도의 모니터링 툴을 사용하지 않고 nomad-apm 기능을 이용한 auscaler 구성
- Nomad Autoscaler 다운로드 : 
  - https://releases.hashicorp.com/nomad-autoscaler/ 
  - https://hub.docker.com/r/hashicorp/nomad-autoscaler
  - https://hub.docker.com/r/hashicorp/nomad-autoscaler-enterprise  
- 주요링크   
  - Nomad Autoscaler aws IAM policy 관련 : https://www.nomadproject.io/tools/autoscaling/plugins/target/aws-asg
  - Nomad Autoscaler policy 관련 : https://www.nomadproject.io/tools/autoscaling/policy
  - Nomad Autoscaler의 nomad-apm 을 사용하는 경우 : https://www.nomadproject.io/tools/autoscaling/plugins/apm/nomad

>>>>>>> 91cc1914eb479977ed6d1480aa8f122cccb0d77c


## Nomad Autoscaler - sample job

- Nomad Autoscaler는 Container환경과 Non-Container환경 모두 설치 가능 
- 디버깅이 필요한 경우 `log_level = "DEBUG"` 옵션 설정 
- Nomad Autoscaler sampe job의 `target "aws-asg"` 설정방법 
  - aws_asg_name은 aws cloud 환경의 Auto Scaling 그룹에 존재해야 함. 
  - node_class는 nomad client에 동일하게 설정해야 함.
- 주요 튜닝 포인트
  - `policy`의   cooldown,  evaluation_interval 값을 워크로드 특성에 맞게 적절하게 설정
<<<<<<< HEAD
- 오토스케일링 기준 
  - 메모리 :   `check "mem_allocated_percentage"`  
  - cpu :  `check "cpu_allocated_percentage"` 
=======
>>>>>>> 91cc1914eb479977ed6d1480aa8f122cccb0d77c

```hcl
locals {
    autoscaler_ver = "0.3.3"
    #autoscaler_ver = "0.3.5"
}

job "autoscalerEnt" {
  datacenters = ["dc1"]

  group "autoscalerEnt" {
    count = 1

    network {
      port "http" {}
    }

    task "autoscaler" {
      // docker 기반의 Nomad Autoscaler는 다음과 같이 설정 
      //   driver = "docker"
      //   config {
      //     image   = "hashicorp/nomad-autoscaler-enterprise:0.3.3"
      //     command = "nomad-autoscaler"
      //     args = [
      //       "agent",
      //       "-config",
      //       "$${NOMAD_TASK_DIR}/config.hcl",
      //       "-policy-dir",
      //       "$${NOMAD_TASK_DIR}/policies/",
      //     ]
      //     ports = ["http"]
      //   }
      driver = "exec"

      config {
        command = "/usr/local/bin/nomad-autoscaler"
        args = [
          "agent",
          "-config",
          "$${NOMAD_TASK_DIR}/config.hcl",
          "-http-bind-address",
          "0.0.0.0",
          "-http-bind-port",
          "$${NOMAD_PORT_http}",
          "-policy-dir",
          "$${NOMAD_TASK_DIR}/policies/",
        ]
      }

      artifact {
        source      = "https://releases.hashicorp.com/nomad-autoscaler/${local.autoscaler_ver}+ent/nomad-autoscaler_${local.autoscaler_ver}+ent_linux_amd64.zip"
        destination = "/usr/local/bin"
      }
      template {
        data        = <<EOF
nomad {
  address = "http://{{env "attr.unique.network.ip-address" }}:4646"  #Adding nomad server addresss
  token = "<#Adding nomad server token >"  
}

apm "nomad-apm" {
  driver = "nomad-apm"
  config  = {
    address = "http://{{env "attr.unique.network.ip-address" }}:4646"
  }  
}

dynamic_application_sizing {
  // Lower the evaluate interval so we can reproduce recommendations after only
  // 5 minutes, rather than having to wait for 24hrs as is the default.
  evaluate_after = "5m"
}

#log_level = "DEBUG"

target "aws-asg" {
  driver = "aws-asg"
  config = {
    aws_region = "{{ $x := env "attr.platform.aws.placement.availability-zone" }}{{ $length := len $x |subtract 1 }}{{ slice $x 0 $length}}"
  }
}

strategy "target-value" {
  driver = "target-value"
}

  EOF
        destination = "$${NOMAD_TASK_DIR}/config.hcl"
      }
      template {
        data = <<EOF
scaling "cluster_policy_media" {
  enabled = true
  min     = 1
  max     = 100
  
  policy {
    cooldown            = "5m"
    evaluation_interval = "20s"
    
    check "mem_allocated_percentage" {
      source = "nomad-apm"
      query  = "percentage-allocated_memory"
      strategy "target-value" {
        target = 82
      }
    }

    // check "cpu_allocated_percentage" {
    //   source = "nomad-apm"
    //   query  = "percentage-allocated_cpu"

    //   strategy "target-value" {
    //     target = 80
    //   }
    // }    

    target "aws-asg" {
      dry-run             = "false"
      aws_asg_name        = "nomad_client_media_autoscaler" 
      node_class          = "client_web"
      node_drain_deadline = "3m"
      node_purge          = "true"
    }
  }
}

EOF
        destination = "$${NOMAD_TASK_DIR}/policies/hashistack.hcl"
      }

      resources {
        cpu    = 200
        memory = 256
      }

      service {
        name = "autoscaler"
        port = "http"

        check {
          type     = "http"
          path     = "/v1/health"
          interval = "5s"
          timeout  = "2s"
        }
      }
    }
  }
}
```