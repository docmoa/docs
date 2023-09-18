---
description: Terraform State Maintenance
tag: ["Terraform", "State"]
---

# State rm

- 현상

  ```
  ... googleapi: Error 400: Invalid request: Invalid request since instance is not running.
  ```
  : Terraform을 통하지 않고 리소스가 삭제되어, 해당 리소스를 찾지 못하는 상황 발생

- State 삭제

  Local 환경의 terraform에 remote를 Terraform cloud로 지정

  ```json
  terraform {
    required_version = ">= 0.12"
    backend "remote" {
      hostname = "app.terraform.io"
      organization = "lguplus"
  
      workspaces {
        name = "kids_library"
      }
    }
  }
  ```

  state 리스트 확인 `terraform state list`

  ```bash
  my-workspace > terraform state list
  random_pet.sql
  module.Cluster_GKE.google_container_cluster.k8sexample
  module.Cluster_GKE.google_container_node_pool.pool_1
  module.Cluster_GKE.google_container_node_pool.pool_2
  module.gcs_buckets.google_storage_bucket.buckets[0]
  module.sql-db.google_sql_database.default
  module.sql-db.google_sql_database_instance.default
  module.sql-db.google_sql_user.default
  module.sql-db.null_resource.module_depends_on
  module.sql-db.random_id.user-password
  module.network.module.routes.google_compute_route.route["egress-internet"]
  module.network.module.subnets.google_compute_subnetwork.subnetwork["asia-northeast3/fc-kidslib-stg-subnet-1"]
  module.network.module.vpc.google_compute_network.network
  ```

  존재하지 않는 resource를 삭제 `terraform state rm [resource_name]`

  ```bash
  my-workspace > terraform state rm module.sql-db
  Removed module.sql-db.google_sql_database.default
  Removed module.sql-db.google_sql_database_instance.default
  Removed module.sql-db.google_sql_user.default
  Removed module.sql-db.null_resource.module_depends_on
  Removed module.sql-db.random_id.user-password
  Successfully removed 5 resource instance(s).
  ```

  