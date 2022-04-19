---
meta:
  - name: description
    content: jenkins 101
tags: ["cicd", "jenkins"]
---

# Apendix

## GitHub SCM 연동 이슈

GitHub를 SCM으로 사용하는 경우 다음과 같은 메시지가 출력되면서 진행되지 않는 경우가 있습니다.

```text
GitHub API Usage: Current quota has 5000 remaining (447380 over budget). Next quota of 5000 in 5 days 0 hr. Sleeping for 4 days 23 hr.
14:07:33 GitHub API Usage: The quota may have been refreshed earlier than expected, rechecking...
```

이 경우 서버 시간과 GitHub의 시간이 맞지 않아 발생할 수 있는 이슈 입니다.  ntpdate를 재설정 합니다.

- RHEL7 : ntpd를 재시작 합니다.

  ```bash
  $ systemctl restart ntpd
  ```

  

- RHEL8 : RHEL8에서는 ntpdate를 사용하지 않고 chronyd가 대신합니다.
  https://access.redhat.com/solutions/4130881

  ```bash
  $ systemctl stop chronyd
  $ chronyd -q
  $ systemctl start chronyd
  ```

  

## 유용한 플러그인

- Restart Safely : Jenkins를 재기동해야하는 경우 빌드가 수행중이지 않을 때 자동으로 Restart 시켜줍니다. 설치 후에는 왼쪽 주 메뉴에 표시됩니다.
- ThinBackup : Jenkins의 구성을 백업, 복구할 수 있는 기능을 제공합니다. 백업 주기나 백업 개수등을 정의 할 수 있습니다.


