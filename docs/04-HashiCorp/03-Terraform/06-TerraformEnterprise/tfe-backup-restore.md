---
description: Terraform Enterprise Backup & Restore
tag: ["Terraform", "backup", "restore"]
author: hognod(ddim), dyana(ddim)
---

# Terraform Enterprise Backup & Restore

## 1. Backup & Restore 개요

Backup은 Object Storage와 PostgreSQL을 포함한 모든 데이터를 대상으로 이루어진다. 다만, 설치 구성요소들에 대한 Backup이 되는 것은 아니기 때문에 Restore시 새로운 Terraform Enterprise의 설치가 필요하다.

아래와 같은 주의 사항이 존재

* Backup된 Terraform Enterprise와 Restore된 Terraform Enterprise 사이에 버전 차이가 있어서는 안된다. 즉, Backup을 진행한 버전 그대로 Restore 과정을 진행해야 한다.
* Backup된 PostgreSQL과 Restore된 PostgreSQL 사이에 버전 차이가 있어서는 안된다. 즉, Backup을 진행한 버전 그대로 Restore 과정을 진행해야 한다.
* Restore 과정 진행 시 Terraform Enterprise는 application data가 없는 상태로 새로 설치되어야 한다.
* Restore 과정이 완료된 후 Terraform Enterprise는 재시작이 필요하다.



## 2. 인증 및 보안

Terraform Enterprise의 Backup과 Restore를 위한 별도의 인증 토큰이 존재하며 아래 명령어를 이용하여 해당 Token을 취득할 수 있다.

```bash
docker exec -t terraform-enterprise-tfe-1 /bin/bash -c 'cat /var/run/terraform-enterprise/backup-restore/config.hcl | grep backup_token'
```

Terraform Enterprise는 내부에 자체 내장된 Vault의 일부 기능을 이용해 데이터를 암/복호화한다. 다만, Backup 과정에서는 해당 데이터를 암/복호화하기 위한 Vault 암호키가 제공되지 않기 때문에 기존 저장된 암호화 데이터를 먼저 Vault가 복호화한 뒤 사용자가 임의 지정한 Password를 통해 재암호화하여 Backup 과정을 진행한다. Restore 과정에서는 Backup 과정에서 사용된 것과 동일한 Password를 이용하여 데이터를 복호화한 뒤 새로운 Terraform Enterprise가 설치되고 나면 자체 내장된 Vault의 암호화키를 이용하여 데이터를 재암호화한 뒤 Restore 과정이 마무리된다.

```bash
vi payload.json
```

```json
{
  "password": "temporary-password"
}
```

* Backup과 Restore 시 반드시 같은 Password가 제공되어야 한다.
* Backup 과정 시 `"skip_object_storage": "true"` 항목을 추가해 Object Storage의 용량이 너무 클 경우 Object Storage만 생략하여 Backup을 진행할 수 있다. (Default: `false`)



## 3. Mounted Disk 배포 시 Backup & Restore

::: warning 주의
하기 aux 폴더 누락 이슈로 bind 경로를 추가한 내용은 'Terraform Enterprise Releases v202402-2'에서 진행된 내용이며 '최신 Releases v202406-1'에서는 따로 bind 경로를 추가 설정하지 않아도 잘 실행됨을 확인하였습니다. 
:::

Mounted disk 배포 모델은, Failover 또는 Active/Active 기능 없이 단일 컴퓨팅 환경에 Terraform Enterprise를 배포한다. 본 가이드는 Mounted disk 배포 모델인 **TFE1**서버에서 backup 진행 이후, 동일한 Mounted disk 배포 모델 **TFE2** 서버로 restore 과정을 진행한다.

### 3.1. docker-compose.yaml bind 경로 추가

**TFE1** 서버에서 Backup 이후 **TFE2** 서버에서 Restore 과정 진행 시 state 파일 경로인 **/var/lib/terraform-enterprise/aux** 폴더가 누락되는 이슈로 aux 디렉토리를 생성해준 후 volumes에 bind를 추가한다.
`docker-compose.yaml` 파일 변경은 TFE1 서버와 TFE2 서버에서 동일하게 진행한다. 
단 Restore하고자 하는 **TFE2** 서버는 Terraform Enterprise는 application data가 없는 상태에서 Restore가 진행되어야 한다. 

```bash
mkdir ~/aux
```

`TFE1 서버, TFE2 서버 - docker-compose.yaml`의 volumes

```bash
    volumes:
      - type: bind
        source: /var/run/docker.sock
        target: /run/docker.sock
      - type: bind
        source: ./cert
        target: /etc/ssl/private/terraform-enterprise
      - type: bind
        source: ./aux
        target: /var/lib/terraform-enterprise/aux
      - type: volume
        source: terraform-enterprise
        target: /var/lib/terraform-enterprise
      - type: volume
        source: terraform-enterprise-cache
        target: /var/cache/tfe-task-worker/terraform
    extra_hosts:
      - "<TFE1 HOSTNAME>:<TFE1 IP>"
volumes:
  terraform-enterprise:
  terraform-enterprise-cache:
```

```bash
docker-compose up --detach
```

### 3.2. aux 폴더 내용 전송

**TFE1** 서버의 **/home/user/aux/archivist/terraform** 경로를 통해 states 파일이 들어가 있는 것을 확인할 수 있다. Restore 하고자 하는 **TFE2** 서버에 **TFE1** 서버의 aux 폴더의 내용을 복사해서 넣어준다.

`TFE1 서버에서 진행`

```bash
scp -r -i <key.pem> ~/aux <TFE2 USER>@<TFE2 IP>:/home/user/
```

`POST /_backup/api/v1/backup`

```bash
curl \
  --header "Authorization: Bearer <TOKEN>" \
  --request POST \
  --data @payload.json \
  --output backup.blob \
  https://<TFE1 HOSTNAME>/_backup/api/v1/backup
```

* `--header`: 앞선 과정에서 취득한 Token 값 입력
* `--data`: 앞선 과정에서 생성한 `.json` 파일 지정
* `--output`: Backup된 내용을 추출할 파일명 지정

**TFE1** 서버에 backup.blob 파일이 생성된 것을 볼 수 있다. 

### 3.3. Restore

`POST /_backup/api/v1/restore`

Restore하기 전 반드시 Terraform Enterprise를 새로 설치해야 한다.(application data가 쌓이지 않은 초기 상태여야 한다.)
Restore 하고자 하는 TFE2 서버의 Terraform Enterprise 서비스 시작 후 TFE1에서 Restore curl 진행한다. 

```bash
curl \
  --header "Authorization: Bearer <TOKEN>" \
  --request POST \
  --form config=@payload.json \
  --form snapshot=@backup.blob \
  https://<TFE2 HOSTNAME>/_backup/api/v1/restore
```

* `--header`: 앞선 과정에서 취득한 Token 값 입력
* `--form config`: 앞선 과정에서 생성한 `.json` 파일 지정
* `--form snapshot`: Backup 과정에서 생성된 `.blob` 파일 지정

