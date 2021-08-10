---
meta:
  - name: description
    content: 인터넷 사용 불가 시 프로바이더 구성
tags: ["terraform", "provider"]
---

# Air-gapped Terraform Provider 구성
> <https://www.terraform.io/docs/cli/config/config-file.html#implied-local-mirror-directories>  
> <https://learn.hashicorp.com/tutorials/terraform/provider-use?in=terraform/providers>

## 환경

- OS : CentOS7

  ```ini
  NAME="CentOS Linux"
  VERSION="7 (Core)"
  ID="centos"
  ID_LIKE="rhel fedora"
  VERSION_ID="7"
  PRETTY_NAME="CentOS Linux 7 (Core)"
  ANSI_COLOR="0;31"
  CPE_NAME="cpe:/o:centos:centos:7"
  HOME_URL="https://www.centos.org/"
  BUG_REPORT_URL="https://bugs.centos.org/"
  
  CENTOS_MANTISBT_PROJECT="CentOS-7"
  CENTOS_MANTISBT_PROJECT_VERSION="7"
  REDHAT_SUPPORT_PRODUCT="centos"
  REDHAT_SUPPORT_PRODUCT_VERSION="7"
  ```

- Terraform

  ```bash
  $ terraform version
  Terraform v1.0.0
  ```



## Test Provider

- random : <https://releases.hashicorp.com/terraform-provider-random/3.1.0/terraform-provider-random_3.1.0_linux_amd64.zip>
- nsxt : <https://releases.hashicorp.com/terraform-provider-nsxt/3.2.1/terraform-provider-nsxt_3.2.1_linux_amd64.zip>



## 구성 절차

1. 필요한 Provider zip파일을 https://releases.hashicorp.com 에서 미리 다운 받습니다. 받아놓은 zip 파일이 있는 경우 대상 시스템에 복사해둡니다.

   ```bash
   $ wget https://releases.hashicorp.com/terraform-provider-nsxt/3.2.1/terraform-provider-nsxt_3.2.1_linux_amd64.zip
   $ wget https://releases.hashicorp.com/terraform-provider-random/3.1.0/terraform-provider-random_3.1.0_linux_amd64.zip
   ```

2. Plugin 디렉토리 구성  
   로컬 Provider를 찾기위한 디렉토리 구조를 생성합니다. `host_name`은 환경마다 상이할 수 있습니다.

   `~/.terraform.d/plugins/${host_name}/${namespace}/${type}/${version}/${target}`

   ```bash
   $ mkdir -p ~/.terraform.d/plugins/localhost.localdomain/vmware/nsxt/3.2.1/linux_amd64
   $ mkdir -p ~/.terraform.d/plugins/localhost.localdomain/hashicorp/random/3.1.0/linux_amd64
   ```

3. Provider 바이너리 파일 구성

   기존에 받아놓은 zip 파일을 압축 해제하고, 생성한 Provider 디렉토리 각각에 맞는 프로바이더를 복사합니다.

   ```bash
   $ unzip terraform-provider-random_3.1.0_linux_amd64.zip
   Archive:  terraform-provider-random_3.1.0_linux_amd64.zip
     inflating: terraform-provider-random_v3.1.0_x5
     
   $ mv ./terraform-provider-random_v3.1.0_x5 ~/.terraform.d/plugins/localhost.localdomain/hashicorp/random/3.1.0/linux_amd64
   
   $ unzip terraform-provider-nsxt_3.2.1_linux_amd64.zip
   Archive:  terraform-provider-nsxt_3.2.1_linux_amd64.zip
     inflating: CHANGELOG.md
     inflating: LICENSE.txt
     inflating: README.md
     inflating: terraform-provider-nsxt_v3.2.1
     
   $ mv ./terraform-provider-nsxt_v3.2.1 ~/.terraform.d/plugins/localhost.localdomain/vmware/nsxt/3.2.1/linux_amd64
   ```

4. 로컬 Provider 구성 확인

   ::: vue
   $ tree -a ~/.terraform.d/
   /root/.terraform.d/
   ├── `plugins`
   │   └── localhost.localdomain
   │       ├── hashicorp
   │       │   └── random
   │       │       └── 3.1.0
   │       │           └── linux_amd64
   │       │               └── terraform-provider-random_v3.1.0_x5
   │       └── vmware
   │           └── nsxt
   │               └── 3.2.1
   │                   └── linux_amd64
   │                       └── terraform-provider-nsxt_v3.2.1
   ├── checkpoint_cache
   └── checkpoint_signature
   :::

5. 워크스페이스 생성 (디렉토리) - airgapped 는 임의의 이름 입니다.

   ```bash
   $ mkdir ./airgapped
   $ cd ./airgapped
   ```

6. tf 파일 작성

   ```ruby
   $ cat <<EOF> terraform.tf
   terraform {
     required_providers {
       nsxt = {
         source = "localhost.localdomain/vmware/nsxt"
         version = "3.2.1"
       }
       random = {
         source = "localhost.localdomain/hashicorp/random"
         version = "3.1.0"
       }
     }
   }
   
   provider "nsxt" {
     # Configuration options
   }
   
   provider "random" {
     # Configuration options
   }
   
   resource "random_id" "test" {
     byte_length = 8
   }
   
   output "random_id" {
     value = random_id.test
   }
   EOF
   ```

7. Terraform `init`을 수행하여 정상적으로 로컬 Provider를 가져오는지 확인합니다.

   ```bash
   $ terraform init
   
   Initializing the backend...
   
   Initializing provider plugins...
   - Finding localhost.localdomain/vmware/nsxt versions matching "3.2.1"...
   - Finding localhost.localdomain/hashicorp/random versions matching "3.1.0"...
   - Installing localhost.localdomain/vmware/nsxt v3.2.1...
   - Installed localhost.localdomain/vmware/nsxt v3.2.1 (unauthenticated)
   - Installing localhost.localdomain/hashicorp/random v3.1.0...
   - Installed localhost.localdomain/hashicorp/random v3.1.0 (unauthenticated)
   
   Terraform has created a lock file .terraform.lock.hcl to record the provider
   selections it made above. Include this file in your version control repository
   so that Terraform can guarantee to make the same selections by default when
   you run "terraform init" in the future.
   
   Terraform has been successfully initialized!
   
   You may now begin working with Terraform. Try running "terraform plan" to see
   any changes that are required for your infrastructure. All Terraform commands
   should now work.
   
   If you ever set or change modules or backend configuration for Terraform,
   rerun this command to reinitialize your working directory. If you forget, other
   commands will detect it and remind you to do so if necessary.
   ```