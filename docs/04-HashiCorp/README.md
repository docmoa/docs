---

title: Overview
sidebar: true
next: false
tags: ["HashiCorp"]
---

# Overview

## Packer
> 다양한 플랫폼에 대한 VM, 컨테이너 이미지 생성 자동화 도구
- 홈페이지 : <https://www.packer.io>
- 관련 항목
    - Alicloud / AWS / Azure / GCP / Naver Cloud / Oracle
    - Hyper-V / OpenStack / QEMU / Vagrant / VirtualBox / VMware
    - Docker / LXC

## Vagrant
> 로컬 개발환경을 관리하는 프로비저닝 자동화 도구
- 홈페이지 : <https://www.vagrantup.com>
- 관련 항목
    - Virtual Box
    - Hyper-V
    - VMware Workstation
    - Docker

## Terraform
> 클라우드, 온프레미스, 플랫폼 서비스의 리소스 프로비저닝과 자동화
- 홈페이지 : <https://www.terraform.io/>
- 관련 항목
    - Provider Registry : <https://registry.terraform.io/>
    - Terraform Cloud : <https://app.terraform.io/>

## Consul
> 서비스 디스커버리와 서비스 메시로 네트워크 자동화
- 홈페이지 : <https://www.consul.io/>
- 관련 항목
    - Service Discovery
    - K/V
    - Service Mesh

## Boundary
> 인증/인가 기반으로 서버와 서비스에 대한 접근관리
- 홈페이지 : <https://www.boundaryproject.io/>

## Vault
> 민감 정보의 관리와 접근에 중앙화된 관리 서비스
- 홈페이지 : <https://www.vaultproject.io/>
- 관련 항목
    - Secret K/V
    - SSH OTP
    - PKI
    - KMS, KMIP
    - Data Encryption
    - Database Credential
    - Cloud Credential

## Nomad
> 애플리케이션 배포와 실행을 위한 오케스트레이터
- 홈페이지 : <https://www.nomadproject.io/>
- 관련 항목
    - Docker / Podman / Containerd / LXC
    - Java
    - Exec / Raw_exec
    - QEMU
    - Windows IIS

## Waypoint
> 단일 구성으로 컨테이너 환경에 애플리케이션 빌드 및 배포
- 홈페이지 : <https://www.waypointproject.io/>
- 관련 항목
    - AWS ECS/Lambda/SSM/EC2
    - Azure Container Instance
    - Docker
    - Google Cloud Run
    - Kubernetes
    - Nomad

## Etc.

### Mac에서 한번에 업데이트 받기 예제

- `BIN_DIR`로 지정된 `/Users/my/Tools/bins/`는 PATH에 적용된 위치

```bash
#!/bin/bash

echo "<<<<<<< CHECK POINT HASHICORP RELEASE >>>>>>>"
export RELEASE_URL="https://releases.hashicorp.com/"
export DOWNLOAD_DIR="/tmp/hashistack-zip/"
export BIN_DIR="/Users/my/Tools/bins/"

if [ ! -d ${DOWNLOAD_DIR} ]; then
    mkdir -p ${DOWNLOAD_DIR}
fi

cd ${DOWNLOAD_DIR}
rm -rf ${DOWNLOAD_DIR}/*

UPDATE_LIST=""

for SOLUTION in "terraform" "consul" "vault" "nomad" "packer" "consul-terraform-sync" "waypoint" "boundary"; do
    echo "Check - ${SOLUTION}"
    TAG=$(curl -fsS https://api.github.com/repos/hashicorp/${SOLUTION}/releases \
    | jq -re '.[] | select(.prerelease != true) | .tag_name' \
    | sed 's/^v\(.*\)$/\1/g' \
    | sort -V \
    | tail -1)

    export CURRENT_VERSION="0.0.0"
    if [ -f "${BIN_DIR}/${SOLUTION}" ]; then
        if [ ${SOLUTION} = "consul-terraform-sync" ]; then
            CURRENT_VERSION=$(${SOLUTION} --version | awk '{print $2}' | head -1 | sed 's/v//' | sed 's/+ent//')
        elif [ ${SOLUTION} = "boundary" ]; then
            CURRENT_VERSION=$(${SOLUTION} version | head -4 | tail -1 | awk '{print $3}')
        else
            CURRENT_VERSION=$(${SOLUTION} version | awk '{print $2}' | head -1 | sed 's/v//')
        fi
    fi

    if [ $TAG != $CURRENT_VERSION ]; then
        if [ ${SOLUTION} = "consul-terraform-sync" ]; then
            TAG=${TAG}+ent
        fi
        echo ">>>> ${SOLUTION} update ${CURRENT_VERSION} --> ${TAG}"
        ZIP="${SOLUTION}_${TAG}_darwin_amd64.zip"
        DOWNLOAD_URL="${RELEASE_URL}${SOLUTION}/${TAG}/${ZIP}"
        wget -O "${DOWNLOAD_DIR}${ZIP}" ${DOWNLOAD_URL}
        unzip -o ${DOWNLOAD_DIR}${ZIP} -d $BIN_DIR
        rm -rf ${DOWNLOAD_DIR}${ZIP} 
        UPDATE_LIST="${UPDATE_LIST} ${SOLUTION}_${CURRENT_VERSION}\t-->>\t${SOLUTION}_${TAG}"
    else
        UPDATE_LIST="${UPDATE_LIST} ${SOLUTION}_${CURRENT_VERSION}"
    fi
done

if [ "$(ls -A ${DOWNLOAD_DIR})" ]; then
    mv ${DOWNLOAD_DIR}* /Users/gs/Tools/bins/
fi

echo -e "\n==== HASHISTACK VERSION ===="
for list in $UPDATE_LIST
do
    echo -e $list
done

```
