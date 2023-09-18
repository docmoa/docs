---
description: Consul Acl Policy Sample
tag: ["Consul", "Acl", "Policy"]
---

## Consul ACL Policy sample
Consul ACL을 활성화 할 경우 default를 deny로 할 지 allow를 할 지 정할 수 있다.
deny로 할 경우에는 하나하나 policy로 tokne을 만들어서 사용해야 한다.

## Consul이 Vault의 Storage로 되어야 할 경우
```
key_prefix "vault/" {
  policy = "write"
}
service "vault" {
   policy = "write"
}
agent_prefix "" {
   policy = "read"
}
session_prefix "" {
   policy = "write"
}
```

## Consul Dns query가 필요할 경우
```
node_prefix "" {
  policy = "read"
}
service_prefix "" {
  policy = "read"
}
# only needed if using prepared queries
query_prefix "" {
  policy = "read"
}
```

## Consul UI 접근권한이 필요할 경우
```
service_prefix "" {
  policy = "read"
}
key_prefix "" {
  policy = "read"
}
node_prefix "" {
  policy = "read"
}
```