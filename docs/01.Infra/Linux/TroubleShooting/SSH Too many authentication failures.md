---

meta:
  - name: description
    content: SSH Too many authentication failures
tags: ["linux", "ssh"]

---

# SSH Too many authentication failures

너무많은 인증 실패로 인한 SSH 접속이 안되는 메시지를 간혹 보게되는 경우가 있다.
```bash
$ ssh myserver
Received disconnect from 192.168.0.43 port 22:2: Too many authentication failures
Connection to 192.168.0.43 closed by remote host.
Connection to 192.168.0.43 closed.
```

특히나 클라우드나 VM을 새로 프로비저닝 해서 사용하려고 할때 IP가 중복되어 재사용되어야 하는 경우에 주로 발생하는 걸로 추측된다.

위 메시지의 발생 원인은 이미 SSH로 접속하려고 하는 클라이언트 환경에 많은 SSH ID 정보가 저장되어있고, SSH Client를 실행할 때 ssh-agent로 이미 알고있는 모든 SSH 키와 다른 모든 키에 대해 접속을 시도하게 된다. 이때 SSH로 접속하고자 하는 원격 서버는 특정 ID 키로 맵핑되어있고, 기존의 키 정보와 맞지 않거나 동일한 대상에 대한 SSH ID 정보와 달라진 것이 원인으로 보인다.

## 해결 방법 1

접속하고자 하는 Client 환경에서 SSH 키를 초기화 하는 방법

```bash
$ ssh-add -D
```

위와 같이 했을 때 `Could not open a connection to your authentication agent.` 와 같은 오류가 발생한다면 다음 방법으로 초기화 한다.

```bash
$ exec ssh-agent bash
$ ssh-add -D
All identities removed.
```

## 해결 방법 2

SSH 옵션으로 Public Key를 이용한 접속을 일시적으로 사용하지 않도록 하는 방법

```bash
$ ssh -p 22 -o PubkeyAuthentication=no username@myserver
```

## 해결 방법 3

`~/.ssh/config`의 대상 호스트에 `IdentitiesOnly=yes`를 추가하는 벙법
많은 ID를 제공 하더라도 ssh가 ssh_config 파일에 구성된 인증 ID 파일만 사용하도록 지정한다고 함

```ini {3}
Host myserver
IdentityFile ~/.ssh/key_rsa
IdentitiesOnly yes
Port 22
```

<TagLinks />