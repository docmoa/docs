---
meta:
  - name: description
    content: Boundary Terraform Setup
tags: ["Boundary", "Terraform", "Config"]
---

# Configure Boudary using Terraform
- Terraform provider : <https://registry.terraform.io/providers/hashicorp/boundary/latest/docs>
- learn site : <https://learn.hashicorp.com/tutorials/boundary/getting-started-config>

## main.tf
```hcl
provider "boundary" {
  addr             = "http://172.28.128.11:9200"
//   recovery_kms_hcl = <<EOT
// kms "aead" {
//     purpose   = "recovery"
//     aead_type = "aes-gcm"
//     key       = "8fZBjCUfN0TzjEGLQldGY4+iE9AkOvCfjh7+p0GtRBQ="
//     key_id    = "global_recovery"
// }
// EOT
    auth_method_id = "ampw_U6FXouWRDK"
    password_auth_method_login_name = "admin"
    password_auth_method_password = "POByMKtvabYS1wtRHLgZ"
}

resource "boundary_scope" "global" {
  global_scope = true
  scope_id     = "global"
  description  = "Global scope"
}

// Scope HashiStack
resource "boundary_scope" "corp" {
  name                     = "hashistack"
  description              = "hashistack scope"
  scope_id                 = boundary_scope.global.id
  auto_create_admin_role   = true
  auto_create_default_role = true
}

resource "boundary_auth_method" "corp_password" {
  name        = "corp_password_auth_method"
  description = "Password auth method"
  type        = "password"
  scope_id    = boundary_scope.corp.id
}

resource "boundary_account" "user" {
  for_each       = var.users
  name           = each.key
  description    = "User account for my user"
  type           = "password"
  login_name     = lower(each.key)
  password       = "password"
  auth_method_id = boundary_auth_method.corp_password.id
}

resource "boundary_user" "users" {
  for_each    = var.users
  name        = each.key
  description = "User resource for ${each.key}"
  account_ids = ["${boundary_account.user[each.key].id}"]
  scope_id = boundary_scope.corp.id
}

resource "boundary_group" "admin" {
  name        = "admin"
  description = "Organization group for readonly users"
  member_ids  = [for user in boundary_user.users : user.id]
  scope_id    = boundary_scope.corp.id
}

resource "boundary_user" "readonly_users" {
  for_each    = var.readonly_users
  name        = each.key
  description = "User resource for ${each.key}"
  scope_id    = boundary_scope.corp.id
}

resource "boundary_group" "readonly" {
  name        = "read-only"
  description = "Organization group for readonly users"
  member_ids  = [for user in boundary_user.readonly_users : user.id]
  scope_id    = boundary_scope.corp.id
}

resource "boundary_role" "corp_admin" {
  name        = "corp_admin"
  description = "Corp Administrator role"
  principal_ids = concat(
    [for user in boundary_user.users: user.id]
  )
  grant_strings   = ["id=*;type=*;actions=create,read,update,delete"]
  scope_id = boundary_scope.corp.id
}

resource "boundary_role" "organization_readonly" {
  name        = "Read-only"
  description = "Read-only role"
  principal_ids = [boundary_group.readonly.id]
  grant_strings = ["id=*;type=*;actions=read"]
  scope_id    = boundary_scope.corp.id
}

resource "boundary_scope" "core_infra" {
  name                   = "core_infra"
  description            = "My first project!"
  scope_id               = boundary_scope.corp.id
  auto_create_admin_role = true
}

resource "boundary_host_catalog" "backend_servers" {
  name        = "backend_servers"
  description = "Backend servers host catalog"
  type        = "static"
  scope_id    = boundary_scope.core_infra.id
}

resource "boundary_host" "ssh_servers" {
  for_each        = var.ssh_server_ips
  type            = "static"
  name            = "ssh_server_service_${each.value}"
  description     = "ssh server host"
  address         = each.key
  host_catalog_id = boundary_host_catalog.backend_servers.id
}

resource "boundary_host" "backend_servers" {
  for_each        = var.backend_server_ips
  type            = "static"
  name            = "backend_server_service_${each.value}"
  description     = "Backend server host"
  address         = each.key
  host_catalog_id = boundary_host_catalog.backend_servers.id
}

resource "boundary_host_set" "ssh_servers" {
  type            = "static"
  name            = "ssh_servers"
  description     = "Host set for ssh servers"
  host_catalog_id = boundary_host_catalog.backend_servers.id
  host_ids        = [for host in boundary_host.ssh_servers : host.id]
}

resource "boundary_host_set" "backend_servers" {
  type            = "static"
  name            = "backend_servers"
  description     = "Host set for backend servers"
  host_catalog_id = boundary_host_catalog.backend_servers.id
  host_ids        = [for host in boundary_host.backend_servers : host.id]
}

# create target for accessing backend servers on port :8000
resource "boundary_target" "backend_servers_service" {
  type         = "tcp"
  name         = "backend_server"
  description  = "Backend service target"
  scope_id     = boundary_scope.core_infra.id
  default_port = "8080"

  host_set_ids = [
    boundary_host_set.backend_servers .id
  ]
}

# create target for accessing backend servers on port :22
resource "boundary_target" "backend_servers_ssh" {
  type         = "tcp"
  name         = "ssh_server"
  description  = "Backend SSH target"
  scope_id     = boundary_scope.core_infra.id
  // default_port = "22"

  host_set_ids = [
    boundary_host_set.ssh_servers.id
  ]
}

// anonymous
resource "boundary_role" "global_anon_listing" {
  scope_id = boundary_scope.global.id
  grant_strings = [
    "id=*;type=auth-method;actions=list,authenticate",
    "type=scope;actions=list",
    "id={{account.id}};actions=read,change-password"
  ]
  principal_ids = ["u_anon"]
}

resource "boundary_role" "org_anon_listing" {
  scope_id = boundary_scope.corp.id
  grant_strings = [
    "id=*;type=auth-method;actions=list,authenticate",
    "type=scope;actions=list",
    "id={{account.id}};actions=read,change-password"
  ]
  principal_ids = ["u_anon"]
}

output "corp_auth_method_id" {
    value = "boundary authenticate password -auth-method-id ${boundary_auth_method.corp_password.id} -login-name ${boundary_account.user["gslee"].login_name} -password ${boundary_account.user["gslee"].password}"
}
```

## variable.tf
```hcl
variable "addr" {
  default = "http://172.28.128.11:9200"
}

variable "users" {
  type = set(string)
  default = [
    "gslee",
    "Jim",
    "Mike",
    "Todd",
    "Jeff",
    "Randy",
    "Susmitha"
  ]
}

variable "readonly_users" {
  type = set(string)
  default = [
    "Chris",
    "Pete",
    "Justin"
  ]
}

variable "ssh_server_ips" {
  type = set(string)
  default = [
    "172.28.128.11"
  ]
}

variable "backend_server_ips" {
  type = set(string)
  default = [
    "172.28.128.11",
    "172.28.128.50",
    "172.28.128.60",
    "172.28.128.61",
    "172.28.128.70",
  ]
}
```