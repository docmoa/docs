---
meta:
  - name: description
    content: Identifying consul split-brain
tags: ["Consul"]
---

# Identifying consul split-brain
> <https://support.hashicorp.com/hc/en-us/articles/360058026733-Identifying-and-Recovering-from-a-Consul-Split-Brain>

1. 다음을 실행하여 각 서버에서 Consul 서버 로그를 확인
```bash
consul monitor -log-level=debug
```
2. Server들이 투표하는 로그 라인을 확인합니다. 다음과 같이 보여야 합니다.:

==정상적인 경우

```
2020/10/19 16:21:23 [INFO] raft: Node at 10.90.168.42:8300 [Candidate] entering Candidate state in term 3732
2020/10/19 16:21:23 [DEBUG] raft: Votes needed: 2
2020/10/19 16:21:23 [DEBUG] raft: Vote granted from foobar in term 3732. Tally: 1
```

== 비 정상적인 경우

```
2020/10/19 16:28:53 [WARN] raft: Election timeout reached, restarting election
2020/10/19 16:28:53 [INFO] raft: Node at 00.00.000.00:8300 [Candidate] entering Candidate state in term 992
2020/10/19 16:28:53 [DEBUG] raft: Votes needed: 2
2020/10/19 16:28:53 [DEBUG] raft: Vote granted from foobar2 in term 992. Tally: 1
2020/10/19 16:28:53 [ERR] raft: Failed to make RequestVote RPC to {Voter <Voter ID>)
```



```
복구 시 정상화된 로그
020/10/19 16:29:04 [WARN] raft: Election timeout reached, restarting election
2020/10/19 16:29:04 [INFO] raft: Node at 00.00.000.00:8300 [Candidate] entering Candidate state in term 989
2020/10/19 16:29:04 [DEBUG] raft: Votes needed: 2
2020/10/19 16:29:04 [DEBUG] raft: Vote granted from <ID> in term 989. Tally: 1
```