---
description: Intro to Terraform on Azure 핸즈온 워크샵 설명 및 코드분석
tag: ["Terraform", "Terraform on Azure", "Azure", "HashiCat", "Terraform OSS", "Terraform Cloud", "Terraform Enterprise", "Terraform 샘플", "IaC"]
---

# Intro to Terraform on Azure 

> 본 글은 HashiCorp의 공식 워크샵인 "Intro to Terraform on Azure" 내용을 발췌하여 작성한 글입니다. [참고](https://hashicorp.github.io/field-workshops-terraform/slides/azure/terraform-oss/#1)
>
> 실습 원본 소스코드는 [hashicat-azure 저장소](https://github.com/hashicorp/hashicat-azure)에서 확인할 수 있습니다.



![img](https://media.licdn.com/dms/image/C5612AQGhxYMwcjsNSQ/article-cover_image-shrink_600_2000/0/1643170479486?e=2147483647&v=beta&t=yHuifr0mLn3lU1D41ZJ_HvhJ6uDqcfkbxp2GjyRcdYo)



## Azure 자격증명 설정

> 자격증명 설정을 위한 상세 설명은 생략합니다.

Terraform에서는 해당 CSP에서 리소스를 배포하기 위해 자격증명이 필요합니다. 자신의 Azure 구독정보를 연동하기 위해 credentials를 설정합니다. 

- ARM_SUBSCRIPTION_ID
- ARM_CLIENT_ID
- ARM_CLIENT_SECRET
- ARM_TENANT_ID
- ARM_ENVIRONMENT (옵션)

```bash
env | grep ARM
ARM_CLIENT_ID=xxx
ARM_CLIENT_SECRET=xxx
ARM_SUBSCRIPTION_ID=xxx
ARM_TENANT_ID=xxx
```



## 실습) 시나리오1. azurerm_resource_group 생성

Azure에서는 기본적으로 리소스를 관리하기 위해 리소스 그룹을 생성해야 합니다. 이번 사니리오에서는 리소스 그룹을 생성해보겠습니다.



### HCL 구성파일

- main.tf

가장 기본이 되는 `main.tf` 코드의 구조는 다음과 같습니다.

```ruby
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.60.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "myresourcegroup" {
  name     = "${var.prefix}-workshop"
  location = var.location
  
  tags = {}
}
```

- variables.tf

해당 샘플코드에서는 `prefix` 라는 변수만 필요하므로 다음과 같이 선언합니다.

```ruby
variable "prefix" {
  description = "This prefix will be included in the name of most resources."
  default = "unknown"
}
```

- terraform.tfvars

앞서 `variables.tf` 에서 `default = "unknown"` 으로 선언하였습니다. 이때, 사용자화된 값으로 대체하기 위해서 변수의 우선순위를 활용하여 덮어쓸 수 있습니다.  

필자는 `terraform.tfvars` 파일을 사용하여 덮어쓰는 방식을 사용해보겠습니다.

```ruby
# prefix에 자신의 이름을 작성하세요
prefix = "hyungwook"
```



### 테라폼 초기화(init)

- `terraform init` 명령을 통해 azurerm 프로바이더를 사용하기 위해 초기화를 진행합니다.

```bash
terraform init
```



초기화 명령 이후에 azurerm 에서 사용할 데이터가 `.terraform` 디렉토리 하위에 생성되었는지 확인합니다.

```bash
ls .terraform/providers/registry.terraform.io/hashicorp
azurerm
```



### 테라폼 계획 & 배포(plan & apply)



- `terraform plan` 명령을 통해 배포되기 전 계획을 확인합니다. 해당 실습에서는 최초 배포이므로 한 개의 리소스가 create 됩니다.

```bash
terraform plan

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # azurerm_resource_group.myresourcegroup will be created
  + resource "azurerm_resource_group" "myresourcegroup" {
      + id       = (known after apply)
      + location = "koreacentral"
      + name     = "hyungwook-workshop"
    }

Plan: 1 to add, 0 to change, 0 to destroy.
```



- `terraform apply` 명령을 통해 실제 리소스를 배포합니다.

```bash
terraform apply

Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # azurerm_resource_group.myresourcegroup will be created
  + resource "azurerm_resource_group" "myresourcegroup" {
      + id       = (known after apply)
      + location = "koreacentral"
      + name     = "hyungwook-workshop"
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

azurerm_resource_group.myresourcegroup: Creating...
azurerm_resource_group.myresourcegroup: Creation complete after 5s [id=/subscriptions/0222cb06-f803-4f66-a922-a0957813a90c/resourceGroups/hyungwook-workshop]
```



## 실습) 시나리오 2. vnet 생성

시나리오 1에서 생성한 리소스 그룹에 vnet을 추가합니다.



### HCL 구성파일

- main.tf

앞서 사용했던 `main.tf` 파일에 다음과 같이 추가할 `azurerm_virtual_network` 절을 추가합니다.

```ruby
# 생략
resource "azurerm_virtual_network" "vnet" {
  name                = "${var.prefix}-vnet"
  location            = azurerm_resource_group.myresourcegroup.location
  address_space       = [var.address_space]
  resource_group_name = azurerm_resource_group.myresourcegroup.name
}
```



- variables.tf 에서는 다음과 같은 두 가지 변수를 사용합니다.
  - `prefix` : 리소스의 가장 앞에 선언할 변수명
  - `address_space`  : 기본 CIDR 정의

```ruby
variable "prefix" {
  description = "This prefix will be included in the name of most resources."
  default = "unknown"
}

variable "address_space" {
  description = "The address space that is used by the virtual network. You can supply more than one address space. Changing this forces a new resource to be created."
  default     = "10.0.0.0/16"
}
```



### 테라폼 계획 & 배포(plan & apply)

`azurerm_virtual_network` 리소스가 추가로 생성되는 것을 확인합니다.

```bash
# 생략
Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # azurerm_virtual_network.vnet will be created
  + resource "azurerm_virtual_network" "vnet" {
      + address_space         = [
          + "10.0.0.0/16",
        ]
      + guid                  = (known after apply)
      + id                    = (known after apply)
      + location              = "koreacentral"
      + name                  = "hyungwook-vnet"
      + resource_group_name   = "hyungwook-workshop"
      + subnet                = (known after apply)
      + vm_protection_enabled = false
    }
```



## 실습) 시나리오 3. Subnet & security group 생성

이번 시나리오에서는 vnet 내부에 subnet과 security group을 추가로 생성해보겠습니다.



### HCL 구성파일

- main.tf 에서는 다음 두 가지 리소스를 추가로 생성하는 절을 추가합니다.
  - `azurerm_subnet`
  - `azurerm_network_security_group`

```ruby
# 생략
resource "azurerm_subnet" "subnet" {
  name                 = "${var.prefix}-subnet"
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = azurerm_resource_group.myresourcegroup.name
  address_prefixes     = [var.subnet_prefix]
}

resource "azurerm_network_security_group" "catapp-sg" {
  name                = "${var.prefix}-sg"
  location            = var.location
  resource_group_name = azurerm_resource_group.myresourcegroup.name

  security_rule {
    name                       = "HTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTPS"
    priority                   = 102
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "SSH"
    priority                   = 101
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}
```



- variables.tf 에서는 `subnet_prerix` 절을 추가하여 서브넷의 CIDR을 선언합니다.
  - `prefix`
  - `address_space` 
  - **`subnet_prefix`**

```ruby
variable "subnet_prefix" {
  description = "The address prefix to use for the subnet."
  default     = "10.0.10.0/24"
}
```



### 테라폼 계획 & 배포(plan & apply)

다음 두 리소스가 추가적으로 생성되는 것을 확인합니다.

- azurerm_network_security_group.catapp-sg
- azurerm_subnet.subnet

```bash
#(생략)
Terraform will perform the following actions:

  # azurerm_network_security_group.catapp-sg will be created
  + resource "azurerm_network_security_group" "catapp-sg" {
      + id                  = (known after apply)
      + location            = "koreacentral"
      + name                = "hyungwook-sg"
      + resource_group_name = "hyungwook-workshop"
      + security_rule       = [
          + {
              + access                                     = "Allow"
              + description                                = ""
              + destination_address_prefix                 = "*"
              + destination_address_prefixes               = []
              + destination_application_security_group_ids = []
              + destination_port_range                     = "22"
              + destination_port_ranges                    = []
              + direction                                  = "Inbound"
              + name                                       = "SSH"
              + priority                                   = 101
              + protocol                                   = "Tcp"
              + source_address_prefix                      = "*"
              + source_address_prefixes                    = []
              + source_application_security_group_ids      = []
              + source_port_range                          = "*"
              + source_port_ranges                         = []
            },
#(중략)            
  
  # azurerm_subnet.subnet will be created
  + resource "azurerm_subnet" "subnet" {
      + address_prefix                                 = (known after apply)
      + address_prefixes                               = [
          + "10.0.10.0/24",
        ]
      + enforce_private_link_endpoint_network_policies = false
      + enforce_private_link_service_network_policies  = false
      + id                                             = (known after apply)
      + name                                           = "hyungwook-subnet"
      + resource_group_name                            = "hyungwook-workshop"
      + virtual_network_name                           = "hyungwook-vnet"
    }

Plan: 2 to add, 0 to change, 0 to destroy.
```



## 실습) 시나리오 4. hashicat 웹 애플리케이션 배포

> 참고 : 원본 소스코드는 [hashicat-azure 저장소](https://github.com/hashicorp/hashicat-azure)에서 확인할 수 있습니다.

이번 시나리오는 실제 VM 인스턴스에 초기화 스크립트를 사용하여 웹 애플리케이션을 배포해보도록 하겠습니다.



### HCL 구성파일

- main.tf
  - `azurerm_network_interface` : Network Interface 생성
  - `azurerm_network_interface_security_group_association` : Network Interface에 Security Group 할당
  - `azurerm_public_ip` : 가상머신에 접속하기 위한 Public IP
  - `azurerm_virtual_machine` : 가상머신 
  - `null_resource` : 가상머신 배포 후 `provisioner` 를 통해 웹 서비스 설치를 위해 사용

```ruby
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=2.60.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "myresourcegroup" {
  name     = "${var.prefix}-workshop"
  location = var.location

  tags = {
    environment = "Production"
  }
}

resource "azurerm_virtual_network" "vnet" {
  name                = "${var.prefix}-vnet"
  location            = azurerm_resource_group.myresourcegroup.location
  address_space       = [var.address_space]
  resource_group_name = azurerm_resource_group.myresourcegroup.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "${var.prefix}-subnet"
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = azurerm_resource_group.myresourcegroup.name
  address_prefixes     = [var.subnet_prefix]
}

resource "azurerm_network_security_group" "catapp-sg" {
  name                = "${var.prefix}-sg"
  location            = var.location
  resource_group_name = azurerm_resource_group.myresourcegroup.name

  security_rule {
    name                       = "HTTP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "HTTPS"
    priority                   = 102
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "SSH"
    priority                   = 101
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_interface" "catapp-nic" {
  name                      = "${var.prefix}-catapp-nic"
  location                  = var.location
  resource_group_name       = azurerm_resource_group.myresourcegroup.name

  ip_configuration {
    name                          = "${var.prefix}ipconfig"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.catapp-pip.id
  }
}

resource "azurerm_network_interface_security_group_association" "catapp-nic-sg-ass" {
  network_interface_id      = azurerm_network_interface.catapp-nic.id
  network_security_group_id = azurerm_network_security_group.catapp-sg.id
}

resource "azurerm_public_ip" "catapp-pip" {
  name                = "${var.prefix}-ip"
  location            = var.location
  resource_group_name = azurerm_resource_group.myresourcegroup.name
  allocation_method   = "Dynamic"
  domain_name_label   = "${var.prefix}-meow"
}

resource "azurerm_virtual_machine" "catapp" {
  name                = "${var.prefix}-meow"
  location            = var.location
  resource_group_name = azurerm_resource_group.myresourcegroup.name
  vm_size             = var.vm_size

  network_interface_ids         = [azurerm_network_interface.catapp-nic.id]
  delete_os_disk_on_termination = "true"

  storage_image_reference {
    publisher = var.image_publisher
    offer     = var.image_offer
    sku       = var.image_sku
    version   = var.image_version
  }

  storage_os_disk {
    name              = "${var.prefix}-osdisk"
    managed_disk_type = "Standard_LRS"
    caching           = "ReadWrite"
    create_option     = "FromImage"
  }

  os_profile {
    computer_name  = var.prefix
    admin_username = var.admin_username
    admin_password = var.admin_password
  }

  os_profile_linux_config {
    disable_password_authentication = false
  }

  tags = {}

  # Added to allow destroy to work correctly.
  depends_on = [azurerm_network_interface_security_group_association.catapp-nic-sg-ass]
}

resource "null_resource" "configure-cat-app" {
  depends_on = [
    azurerm_virtual_machine.catapp,
  ]

  # Terraform 0.12
  triggers = {
    build_number = timestamp()
  }

  provisioner "file" {
    source      = "files/"
    destination = "/home/${var.admin_username}/"

    connection {
      type     = "ssh"
      user     = var.admin_username
      password = var.admin_password
      host     = azurerm_public_ip.catapp-pip.fqdn
    }
  }

  provisioner "remote-exec" {
    inline = [
      "sudo apt -y update",
      "sleep 15",
      "sudo apt -y update",
      "sudo apt -y install apache2",
      "sudo systemctl start apache2",
      "sudo chown -R ${var.admin_username}:${var.admin_username} /var/www/html",
      "chmod +x *.sh",
      "PLACEHOLDER=${var.placeholder} WIDTH=${var.width} HEIGHT=${var.height} PREFIX=${var.prefix} ./deploy_app.sh",
    ]

    connection {
      type     = "ssh"
      user     = var.admin_username
      password = var.admin_password
      host     = azurerm_public_ip.catapp-pip.fqdn
    }
  }
}

```



- variables.tf 
  - 설명생략

```ruby
variable "prefix" {
  description = "This prefix will be included in the name of most resources."
  default = "unknown"
}

variable "location" {
  description = "The region where the virtual network is created."
  default     = "eastus"
}

variable "address_space" {
  description = "The address space that is used by the virtual network. You can supply more than one address space. Changing this forces a new resource to be created."
  default     = "10.0.0.0/16"
}

variable "subnet_prefix" {
  description = "The address prefix to use for the subnet."
  default     = "10.0.10.0/24"
}

variable "vm_size" {
  description = "Specifies the size of the virtual machine."
  default     = "Standard_B1s"
}

variable "image_publisher" {
  description = "Name of the publisher of the image (az vm image list)"
  default     = "Canonical"
}

variable "image_offer" {
  description = "Name of the offer (az vm image list)"
  default     = "0001-com-ubuntu-server-jammy"
}

variable "image_sku" {
  description = "Image SKU to apply (az vm image list)"
  default     = "22_04-LTS-gen2"
}

variable "image_version" {
  description = "Version of the image to apply (az vm image list)"
  default     = "latest"
}

variable "admin_username" {
  description = "Administrator user name for linux and mysql"
  default     = "hashicorp"
}

variable "admin_password" {
  description = "Administrator password for linux and mysql"
  default     = "Password123!"
}

variable "height" {
  default     = "400"
  description = "Image height in pixels."
}

variable "width" {
  default     = "600"
  description = "Image width in pixels."
}

variable "placeholder" {
  default     = "placekitten.com"
  description = "Image-as-a-service URL. Some other fun ones to try are fillmurray.com, placecage.com, placebeard.it, loremflickr.com, baconmockup.com, placeimg.com, placebear.com, placeskull.com, stevensegallery.com, placedog.net"
}
```



### 테라폼 계획 & 배포(plan & apply)

`main.tf`에서 추가했던 각종 리소스가 추가적으로 배포되는 것을 확인합니다.
해당 시나리오에서는 가상머신 생성 후 `null_resource` 리소스를 통해 아파치 웹 서버를 설치하는 과정이 포함되어 있으므로 3~5분정도 소요됩니다.



### 결과 확인 : output

```bash
# 생략
null_resource.configure-cat-app (remote-exec): Script complete.
null_resource.configure-cat-app: Creation complete after 31s [id=7198378208770846330]

Apply complete! Resources: 1 added, 0 changed, 1 destroyed.

Outputs:

catapp_url = "http://hyungwook-meow.koreacentral.cloudapp.azure.com"
```



### 결과확인 : WEB UI

`catapp_url` 을 통해 접속해본 결과 정상적으로 웹 애플리케이션이 배포되고 고양이 이미지를 출력하는 것을 확인할 수 있다.

![img](https://github.com/hyungwook0221/img/blob/main/uPic/hashicat-azure.png?raw=true)



## 정리

본 실습을 통해서 간략하게 Azure의 azurerm 프로바이더를 통해 각종 리소스를 생성하는 방안을 알아보았습니다.
잘못된 정보나 수정이 필요한 부분이 있다면 언제든 피드백 부탁드립니다!

> 작성자 : 유형욱(hyungwook.yu@hashicorp.com)

