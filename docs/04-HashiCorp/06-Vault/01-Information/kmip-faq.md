---
description: Vault KMIP 주요 질문
tag: ["vault", "kmip"]
author: MZC - hashicat
---

# Vault KMIP FAQ



![KMIP 적용 흐름도](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/20240215150300.png)



## Client 인증서의 유효 기간

기본 설정시 1,209,600초(2주)의 유효 기간을 갖게 되며, 설정에 따라 긴 유효시간의 적용이 가능합니다. (옵션 : `deault_tls_client_ttl`)
설정은 상기 도식화한 절차 중 "2. kmip 기본 config" 단계에 적용 가능하며. 이는 `KMIP 적용 흐름도`의 "4. kmip scope, role 정의" 단계에서 override 할 수 있습니다.

```bash
# 예시 - 1년의 유효기간을 설정
vault write kmip/config \
  listen_addrs=0.0.0.0:5696 \
  tls_ca_key_type="rsa" \
  tls_ca_key_bits=2048 \
  server_ips=192.168.1.101,192.168.1.102 \
  default_tls_client_ttl=31536000
```

- 옵션 참조(official) : https://developer.hashicorp.com/vault/api-docs/secret/kmip#parameters

## KMIP 시크릿 엔진의 config 변경시 CA의 변경 여부

일반적인 설정은 CA가 변경되지 않으나, CA에 직접적인 옵션 즉, 키 강도, 키 길이, 알고리즘 등을 변경하시면 CA가 재발급되므로 이 경우 영향이 있습니다.
`server_ip`, `server_hostnames`를 추가하는 것으로는 CA는 변경되지 않습니다. 이는 SAN 인증서 발급에 영향이지만, vault에서 server인증서를 외부로 export 하는 과정이 없기 때문입니다.

```bash
#키강도 변경
vault write kmip/config \
  listen_addrs=0.0.0.0:5696 \
  tls_ca_key_type="rsa" \
  tls_ca_key_bits=4096 
```

## SAN 발급시 `server_hostnames` 기입 정보

https 로 호출이 가능한 명칭이면 상관없습니다. dns로 호출시에는 네임서버의 zone의 설정에 따라 다를터 이나 fqdn으로 기입, 혹은 https 프로토콜로 호출만 가능하다면 호스트네임이어도 됩니다.

주의할 점은 http(s) 프로토콜로 호출시에 request/response 헤더에 요청될 host 명과 이것이 인증서의 CN(혹은 SAN 확장 필드)와 매칭되는지의 여부 입니다.

## CA 발급시 `servername_hostnames`에 기입되어야하는 서버의 리스트 정보

Vault 서버 정보를 기입해주시면 됩니다. (e.g. `vault.mysite.com`)

::: warning 주의
vault의 KMIP 통신에 앞서 `server-client`의 상호 인증인 `two way ssl` 과정을 거치므로 각자의 cn을 판단하기 위해 개별 대상의 기입이 필요할 것으로 보여지나, operation role 부여시에 해당 권한에 대한 제어가 수행되므로 Client 의 값을 기입할 필요는 없습니다.
:::

## 인증서 재발급시 이전 인증서의 만료 여부

기존 인증서를 강제로 revoke 시키지 않으면 유효기간(ttl)동안 문제 없습니다.

## Secrets 별 port 바인딩

KMIP이 활성화된 secrets engine이 다르다면, port는 활성화된 엔진 마다 개별 바인딩이 필요합니다.

## KMIP 프로토콜로 교환되는 key의 라이프사이클

Vault는 KMIP 으로 발급되는 키의 라이프사이클에 대한 제어권을 클라이언트에 포괄적으로 위임하고 있습니다.

scope 내의 Role을 부여하는 과정 중 Role에 `operation_` 접두사로 시작되는 권한을 부여하여, 해당 role에서 발급한 credential을 통해 해당 role에 부여된 KMIP에 대한 권한을 행사합니다. 요약하자면, Vault서버에서 KMIP자체의 라이프사이클이 아닌 KMIP의 권한을 부여하는 우회적인 관리책을 제공하고 있습니다.

따라서, 해당 role에서 KMIP 키에 대해 별다른 작업을 요청하지 않는다면, vault 내에서 키를 만료 혹은 수정(rotation)하는 작업을 수행하지 않으며,
해당 키는 지속적으로 사용가능합니다.

현 버전 vault의 KMIP에 대한 지원 정보는 현재 KMIP profile 1.4 표준을 따르고 있음이 퍼블릭 문서로 오픈되어있습니다.

(참고 - vault 가 구현중인 KMIP profile 정보 : https://developer.hashicorp.com/vault/docs/secrets/kmip-profiles)

## Vault 로그에서 KMIP에 대한 액세스 로그도 남길 수 있는지

Vault의 로그는 Vault 플랫폼 자체에 대한 이벤트 기록 만을 수행하여, 세밀한 키 처리에 대한 부분은 `audit log` 라는 기능을 enable 함으로써 이벤트 처리를 모니터링 할수 있습니다.

## Vault 로그 파일 분리해서 로테이션 설정할 수 있는지

어떠한 추가 설정이 없다면, 기본적으로 시스템 로그에 기록되도록 되어있습니다. 말씀하신대로 해당 로그 파일을 별도 분리가능하며, 로테이션에 대한 설정도 용량/시간/갯수의 제한을 설정가능합니다.

(참고 : https://developer.hashicorp.com/vault/docs/configuration#log_rotate_duration)

## KMIP 통신 시 클러스터의 모든 요청이 리더로 포워딩 되는지, 아니면 요청 종류에 따라 다른지

해당 동작은 licence 정책에 따라 분화됩니다. 현재 라이선스로는 Read/Write 모두를 리더 노드가 처리하도록 되어있고. 요청을 처리받은 follwer 노드는 처리를 리더 노드로 포워딩합니다.

Read/Write를 모든 Vault에서 처리하는 동작은 `Read Replica`라는 동작으로 Vault Enterprise의 Performance 라이선스에 해당됩니다.

만약 KMIP 사용이 가능한 라이선스인 ADP-KM 만 적용 된 경우, R/W가 빈번하지 않지만, 높은 비용의 라이선스 정책에서만 사용가능하던 ADP(Advanced Data Protection)라이선스의 KMIP 기능을 좀 더 비용합리적으로 사용가능하게끔, 해당 기능을 제거하고 좀 더 낮은 비용으로 책정된 라이선스입니다.

(현재 라이선스 정책에 대한 상세 참조 링크 : https://developer.hashicorp.com/vault/docs/enterprise/license/faq#q-how-can-the-new-adp-modules-be-purchased-and-what-features-are-customer-entitled-to-as-part-of-that-purchase)

## 매뉴얼하게 Vault 리더를 변경할 수 있는 방법이 있는지 

vault에서 `step-down` 이라는 작업으로 칭합니다. 이때, 리더를 확인하여 다른 노드로 리더 권한을 이전하는 작업이 필요합니다.

해당 작업이 없이 리더를 shutdown하게 되면 자체적인 리더 선출과정이 발생하여 약 5~10초정도의 순단이 발생가능하기 때문에. maintanance 작업전엔 `leader`를 확인 후 작업의 선행이 꼭 필요하겠습니다.

## Vault 업그레이드, 라이선스 변경(수동) 같은 작업 절차

이미 사용중인 경우, 다음과 같이 진행됩니다.
1. 오토백업 설정 추가
2. 스텝다운
3. 키 마이그레이션
4. 정상화 모니터링 

다음은 구성된 Vault 클러스터 예시 이며, health check config는 이해를 돕기위한 설정 입니다.

![Sample Vault Cluster](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/20240215152435.png)

작업간 rolling update 형태로 노드를 순환적 재기동하게되는데, LB의 `health check` 인터벌 때문에 해당노드가 다운되었음에도 노드를 신뢰하여 포워딩 하는 구간이 발생하게 됩니다.

1. vault follower node의 확인
2. 작업 대상인 follower node를 GSLB 타겟에서 제거
    2.1 제거된 follower node를 셧다운 후 키 마이그레이션 작업 후 GSLB의 타겟에 추가

3. 다음 follower node에 대해 "2~3"작업 반복
    3.1.  follower node 기동 후 정상적인 follower로서 join 되었는지 확인

4. leader node를 GSLB 타겟에서 제거
    4-1. 제거된 leader node를 "step-down"하여 leader role을 follower로 마이그레이션
    4-2. "3"의 과정을 현재 node에서 수행

5. 가능한 경우 KMIP 클라이언트 (e.g.MongoDB)를 재기동 하여 정상적으로 구동됨 확인

4의 과정에서 taget을 먼저 제거하는 이유는, step-down시 ready 상태가 되는 leader노드로 LB가 요청을 보낼시 역시 50X대 서버 에러를 리턴받기 때문입니다.

follower를 통해 유입된 reqeust는 response또한 follower를 통해 회신되므로, 요청처리에는 문제가 없습니다

## Linux 서비스로 등록된 경우 로그 파일 외부 구성

systemd 상에 등록되어 있는  vault service는 "vault server" command를 사용합니다.

systemd로 등록된 서비스는 따로 설정해 주지 않는다면 Standart Out,Error 모두 syslog에 저장하므로, Vault Service Script에서 vault log가 저장되지 않도록 Standard Error를 null로 처리하고, `vault server` command에 옵션을 주어 vault log를 외부로 지정할 수 있습니다.

```ini
# /lib/systemd/system/vault.service 수정
[Unit]
...

[Service]
...
ExecStart=/usr/local/bin/vault server -config=/etc/vault.d/vault.hcl -log-file={ Log_path }
StandardError=null

[Install]
...
```

- `ExecStart` 항목에 `-log-file` 항목 추가
- `StandardError=null` 항모고 추가

## Auto Unseal 설정을 하지 않은 상태에서 `pkill -HUP vault` 커맨드실행하는 경우에 vault 프로세스가 재시작되면서 Seal(봉인) 상태가 될까요?

해당 pkill -HUP vault 명령어는 vault 가 재기동되는 명령어가 아닌 설정을 reload하는 명령어로 Vault seal에는 영향이 없습니다.

Vault service 상에서도 명시적으로 Reload 기능이 있으며, `Systemctl reload vault.service` 명령으로 같은 기능을 수행할 수 있습니다.

```ini
# /lib/systemd/system/vault.service 수정
[Unit]
...

[Service]
...
ExecReload=/bin/kill --signal HUP $MAINPID

[Install]
...
```

## KMIP 엔진을 설정하면 KMIP 서비스 포트(5696/TCP)에 서버측 SSL 인증서가 자동으로 세팅되는데, 이 자체 서명된 인증서의 만료일이 1년으로 잡혀있는데 자동으로 갱신되고 서비스에 영향이 없는지

Vault KMIP Secret Engine에서의 서버측 SSL 인증서의 경우 하단 3가지 상황에서 갱신됩니다

- Vault 의 리더 변경 시 
- KMIP Config 변경 시
- Vault 재기동 시



![검증 내용](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/20240215153819.png)



(참고 : https://support.hashicorp.com/hc/en-us/articles/4411836765075-KMIP-Secrets-Engine-server-TLS-certificate-Guide)


## PR 기능이 있는 License 에서  PR 기능이 없는 License로 이관 시 이슈

PR 기능을 포함된 라이선스 사용 시 PR이 없는 (e.g. ADP-KM) Vault License로 교체하면 Performance Standby 상태가 종료되면서 vault 리더 노드의 프로세스 리로드 시 팔로워 노드 프로세스가 재시작되어 seal 상태가 되는 상황이 발생합니다.

이 경우 하단 링크와 같이 vault config 파일에  `disable_performance_standby=true`를 명시적으로 기입함으로써 해당 문제를 방지할 수 있습니다.

(링크 : https://support.hashicorp.com/hc/en-us/articles/21909597784211-Vault-Disabling-Performance-Standby-mode-when-not-licensed-for-this-feature)

## MongoDB - Vault KMIP 연동시 `--kmipKeyStatePollingSeconds` 옵션 동작

MongoDB의 `--kmipKeyStatePollingSeconds` 옵션은 MongoDB 에서 Vault Kmip 으로 암호화 Key가 Active 상태인지 확인하는 주기 입니다.

