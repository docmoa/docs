---
description: 공식 registry 접근이 불가능하거나 별도로 Provider를 관리해야 하는 경우 사용
tag: ["terraform", "provider"]
---

# Terraform Provider - 로컬 미러링
> <https://www.terraform.io/docs/cli/config/config-file.html#provider_installation>

Terraform CLI를 사용할 때, 기본적으로 코드 상에서 사용하는 플러그인은 [registry.terraform.io](http://registry.terraform.io/)에서 다운로드 받게 되어 있습니다.

하지만 네트워크이 느리거나 폐쇄망인 경우, 직접 다운로드가 아닌 다른 방법으로 프로바이더를 사용할 수 있습니다.

CLI 설정 파일에 명시적으로 설정하는 방법과 설정하지 않고 사용하는 방법이 있습니다.

상대적으로 설정이 간편한 filesystem_mirror 설정 방법은 다음과 같습니다.

1. Terraform 사용 환경에 맞춰 terraform configuration 파일 구성하기
    - Windows : 사용자의 %APPDATA% 디렉토리 상에 terraform.rc
    - Linux/MacOS : 사용자 홈 디렉토리 상에 .terraformrc

2. 다음 처럼 'provider_installation' 설정하기
   ```
   provider_installation {
     filesystem_mirror {
       path    = "/usr/share/terraform/providers"
       include = ["*/*"] # registry.terrafom.io/hashicorp/*
     }
   }
   ```

3.  대상 디렉토리 설정하기
    - 예를 들어 aws provider는 다음과 같이 코드 상에 사용
        ```
        terraform {
          required_providers {
            aws = {
              source  = "hashicorp/aws"
              version = "3.36.0"
            }
          }
        }
        ```

    - 지정된 경로 상에 다음과 같은 HOSTNAME/NAMESPACE/TYPE/VERSION/TARGET 형태로 디렉토리 구조를 지정
        - HOSTNAME = "[registry.terraform.io](http://registry.terraform.io/)", NAMESPACE="hashicorp", TYPE="aws", VERSION="3.36.0", TARGET은 클라이언트 환경에 대한 것으로 현재 실행 환경에 따라 "darwin_amd64", "linux_arm" "windows_amd64" 등으로 설정하시면 됩니다.

    - 사용하시고자 하는 프로바이어더의 다운로드는 다음 링크에서 가능합니다. [https://releases.hashicorp.com](https://releases.hashicorp.com/)