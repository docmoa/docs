---
meta:
  - name: description
    content: Nomad Namespace
tags: ["Nomad", "Namespace"]
---

# Nomad Namespace

> Nomad Version : >=  1.0.0  
> Nomad Ent. Version : >= 0.7.0  
> <https://learn.hashicorp.com/tutorials/nomad/namespaces>

## Namespace 생성
```bash
$ nomad namespace apply -description "PoC Application" apps
```

## Namespace 삭제
```bash
$ nomad namespace delete apps
```

## Namespace 리스트 확인
```bash
$ nomad namespace list
Name      Description
default   Default shared namespace
```

## Job에 Namesapce 지정
```ruby
job "rails-www" {

    ## Run in the QA environments
    namespace = "web-qa"

    ## Only run in one datacenter when QAing
    datacenters = ["us-west1"]
    # ...
}
```

## CLI 사용시 flag 추가하거나 ENV로 생략 가능
```bash
# flag 설정
nomad job status -namespace=web-qa

# ENV 설정
export NOMAD_NAMESPACE=web-qa
nomad job status
```

## ACL 구성시의 예
```ruby
# Allow read only access to the production namespace
namespace "web-prod" {
    policy = "read"
}

# Allow writing to the QA namespace
namespace "web-qa" {
    policy = "write"
}
```