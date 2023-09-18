---
description: 공식 registry 접근이 불가능하거나 별도로 Provider를 관리해야 하는 경우 사용
tag: ["terraform", "provider"]
---

# Terraform Provider - 번들링
> <https://github.com/hashicorp/terraform/tree/main/tools/terraform-bundle>  
> Terraform Enterprise에서 동작하는 기능입니다.

Airgap 환경에서 사용할 특정 버전의 Terraform과 여러 제공자 플러그인을 모두 포함하는 zip 파일 인 "번들 아카이브"를 생성하는 툴을 사용합니다. 일반적으로 Terraform init을 통해 특정 구성 작업에 필요한 플러그인을 다운로드하고 설치하지만 Airgap 환경에서는 공식 플러그인 저장소에 액세스 할 수 없는 경우가 발생합니다. Bundle 툴을 사용하여 Terraform 버전과 선택한 공급자를 모두 설치하기 위해 대상 시스템에 압축을 풀 수있는 zip 파일이 생성되므로 즉석 플러그인 설치가 필요하지 않습니다.

::: warning 주의
번들로 작성된 zip파일을 url로 등록하기 때문에 번들을 다운받을 수 있는 웹서버나 넥서스 같은 원격 저장소가 필요합니다.
:::

## build 툴 준비

- [번들 구성 및 빌드 안내](https://github.com/hashicorp/terraform/tree/main/tools/terraform-bundle)에 따라 `terraform-bundle`을 빌드합니다.

```bash
# Ubuntu
# Install Go: https://github.com/golang/go/wiki/Ubuntu
$ sudo add-apt-repository ppa:longsleep/golang-backports
$ sudo apt update -y
$ sudo apt install golang-go -y
#sudo apt install golang-1.14-go -y

# Build terraform-bundle from a release tag that matches your TF version
# Otherwise you might get an error like:
# "Failed to read config: this version of terraform-bundle can only build bundles for . . ."
$ git clone https://github.com/hashicorp/terraform.git
$ cd terraform
$ go install ./tools/terraform-bundle

#verify that terraform-bundle tool is there
$ ls ~/go/bin/ 
$ export PATH=${PATH}:$HOME/go/bin/
$ terraform-bundle --version
0.13.0
```

## bundle 용 hcl 파일 구성 및 생성

bundle 구성할 명세를 hcl로 작성합니다. (e.g. tf-bundle.hcl)

::: tip
공식(Official) 프로바이더의 경우 `source` 정의를 생략할 수 있습니다. 그렇지 않는 경우에는 반드시 `source`에 대한 정의가 필요합니다.
:::

```hcl
terraform {
  # Version of Terraform to include in the bundle. An exact version number is required.
  version = "0.15.4"
}

# Define which provider plugins are to be included
providers {
  null = {
    versions = ["= 3.1.0"]
  }
  time = {
    versions = ["= 0.7.1"]
  }
  random = {
    versions = ["= 3.1.0"]
  }
  template = {
    versions = ["= 2.2.0"]
  }
  tfe = {
    versions = ["= 0.25.3"]
  }
  vsphere = {
    versions = ["= 1.26.0"]
  }
  vault = {
    versions = ["= 2.20.0"]
  }
  consul = {
    versions = ["= 2.12.0"]
  }
  kubernetes = {
    versions = ["= 2.2.0"]
  }
  ad = {
    versions = ["=0.4.2"]
  }
  openstack = {
    versions = ["= 1.42.0"]
    source = "terraform-provider-openstack/openstack"
  }
  nsxt = {
    versions = ["= 3.1.1"]
    source = "vmware/nsxt"
  }
  vra7 = {
    versions = ["= 3.0.2"]
    source = "vmware/vra7"
  }
}
```

번들 생성은 다음과 같이 커맨드로 실행 합니다.

```bash
terraform-bundle package -os=linux -arch=amd64 tf-bundle.hcl
```

이 작업을 통해 Terraform Enterprise에서 기존 Terraform을 다운로드 받고 Provider를 다운로드 받던 동작을 미리 수행한 번들이 생성 됩니다.

생성된 번들 파일(zip)은 TFE Admin Console을 통해 적용

- TFE Console 에서 Site Admin으로 이동
- Terraform Versions > Add terraform version
- Version 이름, Url, Checksum을 기입하고 저장
  Checksum e.g. : `shasum -a256 ./terraform_0.15.4-bundle2021060202_linux_amd64.zip`