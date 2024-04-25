---

description: SSH returns - no matching host key type found.
tag: ["ssh"]

---

# SSH returns - no matching host key type found

## Issue

```bash
$ ssh root@192.168.1.1

Unable to negotiate with 192.168.1.1 port 22: no matching host key type found. Their offer: ssh-rsa
```

일부 환경 설정 및 SSH 버전에 따라 SSH에 사용되는 특정 키가 비활성화되어있는 경우 이같은 오류 메시지가 발생합니다. 이것은 [OpenSSH Legacy Options](https://www.openssh.com/legacy.html)에 개시된 글의 내용을 확인해볼 수 있습니다.

> OpenSSH는 표준을 준수하는 SSH 구현과의 호환성에 필요한 모든 암호화 알고리즘을 구현하지만, 일부 구형 알고리즘이 취약한 것으로 밝혀졌기 때문에 모든 알고리즘이 기본적으로 사용하도록 설정되어 있지는 않습니다.

위 메시지는 `ssh-rsa` 타입에 대해 비활성화 된 상태 입니다.

## 해결 방법 1

접속 시 옵션에 추가

```bash
ssh -oHostKeyAlgorithms=+ssh-rsa root@192.168.1.1
```

## 해결 방법 2

매번 키 알고리즘을 지정할 필요가 없도록 호스트 패턴을 `~/.ssh/config`에 추가

```ini title="~/.ssh/config"
...

Host 192.168.1.1
  HostKeyAlgorithms=+ssh-rsa
```
