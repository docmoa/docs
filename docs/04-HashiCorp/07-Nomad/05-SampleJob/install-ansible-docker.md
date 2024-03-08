---
description: Nomad에서 Aisnble 실행 및 템플릿 주의사항
tag: ["Nomad", "Ansible", "Job", "Docker"]
author: GS
---

# Nomad에서 Ansible로 Docker 설치와 Template 주의사항

> 참고 : https://discuss.hashicorp.com/t/escape-characters-recognized-as-a-variable-in-template-stanza/40525

Nomad를 통해 Ops작업을 수행할 때 `sysbatch` 타입의 Job에 Ansible을 `raw_exec`로 실행하면 전체 노드에서 일괄로 작업을 수행할 수 있다.

Ansible에서 사용하는 문법 중 `{{}}`의 부호로 팩트를 사용하는 경우 Nomad에서 사용하는 Template의 `{{}}`과 겹쳐 오류가 발생한다.

```log
Template failed: (dynamic): parse: template: :23: function "ansible_distribution_release" not defined
```

이경우 Nomad에서 다음과 같이 표기하여 템플릿 문자에 대한 치환이 가능하다.
```hcl
 {{ --> {{ "{{" }}
 }} --> {{ "}}" }}
```

다음은 Ansible에서 `apt_repository` 수행 시 `ansible_architecture`와 `ansible_distribution_release` 같은 팩트 값을 Template으로 Playbook을 작성한 예제 이다. 

```hcl
job "install-ansible-docker" {
  datacenters = ["hashitalks-kr"]  # 사용할 데이터 센터 이름으로 수정

  type = "sysbatch"  # 배치 작업 유형

  constraint {
    attribute = "${attr.os.name}"
    value     = "ubuntu"
  }

  parameterized {
    payload       = "forbidden"
  }

  group "install- group" {

    task "install-ansible-task" {
      lifecycle {
        hook = "prestart"
        sidecar = false
      }
      
      driver = "raw_exec"  # 외부 스크립트를 실행

      config {
        command = "local/install_ansible.sh"
      }

      template {
        destination = "local/install_ansible.sh"
        data = <<EOF
#!/bin/bash
sudo apt-get update
sudo apt-get install -y ansible
EOF
      }
    }

    task "install-docker-task" {
      driver = "raw_exec"  # 외부 스크립트를 실행

      config {
        command = "ansible-playbook"
        args = [
          "local/playbook.yml"
        ]
      }

      env {
        JAVA_VERSION = "${NOMAD_META_DesiredJavaVersion}"
      }

      template {
        destination = "local/playbook.yml"
        data = <<EOF
---
- hosts:
    - localhost
  become: yes
  tasks:
    - name: Install aptitude
      apt:
        name: aptitude
        state: latest
        update_cache: true

    - name: Install required packages
      apt:
        pkg:
          - apt-transport-https
          - ca-certificates
          - curl
          - software-properties-common
          - python3-pip
          - virtualenv
          - python3-setuptools
        state: latest
        update_cache: true

    - name: Add Docker GPG apt Key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Add Docker repository
      apt_repository:
        repo: "deb [arch={{ env "attr.cpu.arch" }}] https://download.docker.com/linux/ubuntu {{"{{"}} ansible_lsb.codename {{"}}"}} stable"
        state: present
        update_cache: true

    - name: Update the apt package index
      apt:
        update_cache: true

    - name: Install Docker CE
      apt:
        name: docker-ce
        state: latest

    - name: Install Docker CE etc.
      apt:
        name:
          - docker-ce-cli
          - containerd.io
          - docker-buildx-plugin
          - docker-compose-plugin
        state: present

    - name: Ensure Docker starts on boot
      service:
        name: docker
        enabled: true
        state: started
EOF
      }

      resources {
        cpu    = 500
        memory = 256
      }
    }
  }
}
```