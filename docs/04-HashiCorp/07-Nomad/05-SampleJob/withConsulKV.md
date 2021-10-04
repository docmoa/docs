---
meta:
  - name: description
    content: Nomad Sample
tags: ["Nomad", "Sample", "Job"]
---

# Consul KV Sample

Consul의 KV에 값을 저장하고 비교하여 task batch를 수행하는 예제
- curl 을 사용하는 경우
  ```bash
  curl -X GET http://127.0.0.1:8500/v1/kv/docmoa/commit_date | jq -r '.[0].Value | @base64d'
  ```
- template의 `key`를 사용하는 경우
  ```hcl
  {{ key "docmoa/commit_date" }}
  ```

```hcl
job "gs-mac-docmoa-build" {
  datacenters = ["home"]
  type        = "batch"

  periodic {
    cron             = "0 */5 * * * * *"
    prohibit_overlap = true
    time_zone        = "Asia/Seoul"
  }

  constraint {
    attribute = "${attr.unique.consul.name}"
    value     = "my-macbook-air"
  }

  group "docmoa-build" {
    count = 1

    task "git-pull" {
      driver = "raw_exec"
      template {
        data = <<EOH
#!/bin/sh
cd /Users/gslee/workspaces/docs
git pull origin main
        EOH

        destination = "git.sh"
      }
      config {
        command = "git.sh"
      }
      lifecycle {
        hook    = "prestart"
        sidecar = false
      }
    }
    task "build" {
      driver = "raw_exec"
      template {
        data = <<EOH
#!/bin/sh
LAST_COMMIT_DATE=$(curl https://api.github.com/repos/docmoa/docs/branches/main | jq -r '.commit.commit.committer.date')
#STORE_COMMIT_DATE=$(curl -X GET http://127.0.0.1:8500/v1/kv/docmoa/commit_date | jq -r '.[0].Value | @base64d')
STORE_COMMIT_DATE={{ key "docmoa/commit_date" }}
echo "LAST_COMMIT_DATE = $LAST_COMMIT_DATE"
echo "STORE_COMMIT_DATE = $STORE_COMMIT_DATE"
if [ $LAST_COMMIT_DATE != $STORE_COMMIT_DATE ]; then
  echo "do deploy"
  # something todo...
  # update new value
  curl -X PUT --data $LAST_COMMIT_DATE http://127.0.0.1:8500/v1/kv/docmoa/commit_date
else
  echo "no change"
fi
        EOH

        destination = "build.sh"
      }
      config {
        command = "build.sh"
      }
      resources {
        cpu    = 1000
        memory = 256
      }
    }
  }
}
```