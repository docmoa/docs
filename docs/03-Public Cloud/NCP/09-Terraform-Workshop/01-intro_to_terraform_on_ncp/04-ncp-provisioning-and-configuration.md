---
meta:
  - name: description
    content: Naver Cloud Platform에서의 Terraform 실습
tags: ["ncloud", "ncp", "terraform", "workshop"]

---

# 04. 테라폼 프로비저닝 도구 사용 및 구성

## Terraform 프로비저닝 도구 사용

Terraform을 사용하여 가상 머신 또는 컨테이너를 세우고 나면 운영 체제와 애플리케이션을 구성 할 수 있습니다.

여기에서 ==Provisioner== 가 등장합니다.

Terraform은 Bash, Powershell, Chef, Puppet, Ansible 등을 포함한 여러 유형의 Provisioner를 지원합니다.

<https://www.terraform.io/docs/provisioners/index.html>

## File Provisioner

Terraform 파일 프로비저닝 도구는 원격 시스템에 파일을 복사합니다.

```hcl
provisioner "file" {
  source        = "files/"
  destination   = "/home/${var.admin_username}/"
  connection {
    type        = "ssh"
    user        = var.username
    private_key = file(var.ssh_key)
    host        = ${self.ip}
  }
}
```

provisioner 블록 안에있는 코드의 connection 블록에 주목하세요. 파일 프로비저닝 도구는 `SSH`, `WinRM` 연결을 모두 지원합니다.

## Remote Exec Provisioner

`Remote Exec Provisioner`를 사용하면 대상 호스트에서 스크립트 또는 기타 프로그램을 실행할 수 있습니다.

자동으로 실행할 수있는 경우 (예 : 소프트웨어 설치 프로그램) `remote-exec`로 실행할 수 있습니다.

```hcl
provisioner "remote-exec" {
  inline = [
    "sudo chown -R ${var.admin_username}:${var.admin_username} /var/www/html",
    "chmod +x *.sh",
    "PLACEHOLDER=${var.placeholder} WIDTH=${var.width} HEIGHT=${var.height} PREFIX=${var.prefix} ./deploy_app.sh",
  ]
...
}
```

이 예에서는 일부 권한 및 소유권을 변경하고 일부 환경 변수가있는 스크립트를 실행하기 위해 몇 가지 명령을 실행합니다.

## Terraform & Config Management Tools

![](./image/cpa.jpg)

Terraform은 Chef, Puppet, Ansible과 같은 일반적인 구성 관리 도구와 잘 작동합니다.

- Official Chef Terraform provisioner:
<https://www.terraform.io/docs/provisioners/chef.html>

- Run Puppet with 'local-exec':
<https://www.terraform.io/docs/provisioners/local-exec.html>

- Terraform and Ansible - Better Together:
<https://github.com/scarolan/ansible-terraform>

## Terraform Provisioner에 대한 도움말

`remote-exec`와 같은 Terraform 프로비저닝 도구는 몇 가지 간단한 명령이나 스크립트를 실행해야 할 때 유용합니다. 더 복잡한 구성 관리의 경우 Chef 또는 Ansible과 같은 도구가 필요합니다.

Provisioner는 Terraform 실행이 ==처음 실행될 때== 만 실행됩니다. 이러한 의미에서 그 동작들은 멱등성을 띄지 않습니다.

수명이 긴 VM 또는 서버의 지속적인 상태 관리가 필요한 경우 이같은 구성 관리 도구를 활용할 수 있습니다.

반면에 변경 불가능한 인프라를 원하면 [Packer](https://www.packer.io/) 같은 이뮤터블을 위한 빌드 도구를 사용하는 것이 좋습니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Dqwk7fYHhVQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

실습을 위해 다음장으로 이동하세요.

[:computer: Lab - Provisioners, Variables, Outputs](./04-z-lab_provisioning_and_configuration.html)