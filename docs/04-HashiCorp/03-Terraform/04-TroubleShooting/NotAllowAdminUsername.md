---
description: Terraform Azure AdminUsername Error
tag: ["Terraform", "Azure"]
---

# The Admin Username specified is not allowed.

|Log|
|-|
|Error : compute.VirtualMachinesClient#CreateOrUpdate: Failure sending request: StatusCode=400 – Original Error: Code=“InvalidParameter” Message=“The Admin Username specified is not allowed.” Target="adminUsername"|

Azure(azurerm) 프로바이더를 사용하여 Virtual Machine을 프로비저닝하는 경우 `OSProfile`에서 Admin User Name을 잘못된 조건으로 구성하는 경우 발생 할 수 있음

## Azure API - OSProfile.AdminUsername Property
<https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.management.compute.models.osprofile.adminusername?view=azure-dotnet>

Azure의 API에서 정의하는 `OSProfile` 내의 `AdminUsername`은 온라인 문서에서처럼 몇가지 룰이 있다.

- Windows VM 제약
  - `.` 으로 끝날 수 없음
  - 20자 제한
- Linux VM 제약
  - 1~64자
- 다음의 이름은 AdminUser로 허용되지 않음
  - administrator
  - adm
  - admin
  - admin1
  - admin2
  - user
  - user1
  - user2
  - user3
  - user4
  - user5
  - test
  - test1
  - test2
  - test3
  - 1
  - 123
  - a
  - actuser
  - aspnet
  - backup
  - console
  - david
  - guest
  - john
  - owner
  - root
  - server
  - sql
  - support
  - support_388945a0
  - sys

## Terraform Error Code Sample
<https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine>
```hcl {22}
resource "azurerm_virtual_machine" "main" {
  name                  = "${var.prefix}-vm"
  location              = azurerm_resource_group.main.location
  resource_group_name   = azurerm_resource_group.main.name
  network_interface_ids = [azurerm_network_interface.main.id]
  vm_size               = "Standard_DS1_v2"

  storage_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "16.04-LTS"
    version   = "latest"
  }
  storage_os_disk {
    name              = "myosdisk1"
    caching           = "ReadWrite"
    create_option     = "FromImage"
    managed_disk_type = "Standard_LRS"
  }
  os_profile {
    computer_name  = "hostname"
    admin_username = "test"
    admin_password = "Password1234!"
  }
  os_profile_linux_config {
    disable_password_authentication = false
  }
  tags = {
    environment = "staging"
  }
}
```

