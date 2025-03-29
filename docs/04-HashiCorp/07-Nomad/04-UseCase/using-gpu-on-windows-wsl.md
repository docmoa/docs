---
description: GPU workload on Windows with Nomad
tag: ["Nomad", "GPU", "Nvidia"]
---

# Nomad client on WSL with NVIDIA plugin

![Nomad-GPU](./image/dalle-nomad-gpu.webp)

> <https://github.com/Great-Stone/nomad-client-on-wsl-with-nvidia-plugin>

Windows의 GPU를 오케스트레이션하기위해 Nomad를 활용하는 방식을 설명합니다.

## 1. GPU 스케줄링이란?

GPU는 인공 지능(AI) 및 머신 러닝(ML)을 포함한 광범위한 워크로드를 가속화하는 데 사용됩니다. 결과를 빠르게 제공하기 위해 AI 및 ML 워크로드는 다중 GPU 클러스터를 포함하여 엄청난 양의 리소스를 소비합니다 . GPU 스케줄링은 AL 및 ML 워크로드를 많은 수의 GPU에 분산하고 리소스를 효과적으로 활용하는 데 도움이 됩니다. 이는 일반적으로 스케줄러를 사용하여 달성됩니다.

전통적으로 작업 스케줄링은 Slurm이나 IBM LSF와 같은 전담 스케줄러에 의해 이루어졌습니다. 이러한 도구의 복잡성으로 인해 많은 조직이 Kubernetes나 Nomad와 같은 컨테이너 오케스트레이터로 전환하고 있습니다.

하지만 복잡성은 거기서 끝나지 않습니다. 컨테이너 오케스트레이터는 기본적으로 GPU 스케줄링을 지원하지 않습니다. HashiCorp Nomad는 2019년부터 자체 GPU 플러그인을 제공하고 있습니다.

> Conductor: Why We Migrated from Kubernetes to Nomad - https://thenewstack.io/conductor-why-we-migrated-from-kubernetes-to-nomad/ 

## 2. GPU Plugin on native windows (not working)

Nomad는 NVIDA의 GPU 오케스트레이션을 위해 플러그인을 제공합니다.

> <https://developer.hashicorp.com/nomad/plugins/devices/nvidia>

플러그인 사용을 위한 환경 요건은 다음과 같습니다.

- GNU/Linux x86_64 with kernel version > 3.10
- NVIDIA GPU with Architecture > Fermi (2.1)
- NVIDIA drivers >= 340.29 with binary nvidia-smi
- Docker v19.03+

플러그인 사용 조건에 따라 Windows에서는 GPU 플러그인 사용에 제약이 있습니다. Nomad는 golang으로 만들어져 있는데, 사용되는 Nvidia의 NVML 라이브러리가 Linux만 지원(2025년 3월)하기에 이 제약을 따라갑니다.

::: tip Nvidia NVML

- HashiCorp `nomad-device-nvidia` : <https://github.com/hashicorp/nomad-device-nvidia>
- Nvidia NVML golang pkg : <https://github.com/NVIDIA/go-nvml>

```
At present, these bindings are only supported on Linux.
```

:::


NVIDIA NVML API의 경우 Windows에서는 설치된 드라이버를 사용할 것으로 예상되나 Tesla, Quadro를 지원하여 로컬에서의 테스트가 불가능했습니다.

https://docs.nvidia.com/deploy/nvml-api/nvml-api-reference.html


## 3. GPU Plugin on WSL

Windows에서 WSL(Windows Subsystem for Linux)을 지원하면서 Linux의 패키지나 라이브러리를 활용할 수 있는 기회가 생겼습니다. Windows의 WSL(Linux)환경에서는 제공되는 NVIDIA 관련 plugin 동작이 정상적으로 수행됩니다.

Plugin 1.1.0 : <https://releases.hashicorp.com/nomad-device-nvidia/1.1.0/>

```bash
/usr/local/bin
└── nomad
/etc/nomad.d
└── plugin
    └── nomad-device-nvidia
```

Plugin 감지 및 Nomad 실행 시 GPU Device 감지 확인

```bash
[WLS>>> ./nomad agent -dev -bind=0.0.0.0 -plugin-dir=/home/nomad/plugin
==> No configuration files loaded
==> Starting Nomad agent...
==> Nomad agent configuration:

       Advertise Addrs: HTTP: 172.28.197.68:4646; RPC: 172.28.197.68:4647; Serf: 172.28.197.68:4648
            Bind Addrs: HTTP: [0.0.0.0:4646]; RPC: 0.0.0.0:4647; Serf: 0.0.0.0:4648
                Client: true
             Log Level: DEBUG
               Node Id: b8bc2afc-a2dd-d694-18c0-caf783cfbafc
                Region: global (DC: dc1)
                Server: true
               Version: 1.9.7

==> Nomad agent started! Log data will stream in below:

[생략]

    2025-03-27T09:49:40.497+0900 [DEBUG] client.plugin: finished plugin manager initial fingerprint: plugin-type=driver
    2025-03-27T09:49:40.497+0900 [DEBUG] client.server_mgr: new server list: new_servers=[0.0.0.0:4647, 172.28.197.68:4647] old_servers=[]
    2025-03-27T09:49:40.634+0900 [DEBUG] client.device_mgr.nomad-device-nvidia: plugin address: plugin=nvidia-gpu network=unix address=/tmp/plugin1223284200 timestamp="2025-03-27T09:49:40.634+0900"
    2025-03-27T09:49:40.634+0900 [DEBUG] client.device_mgr: using plugin: plugin=nvidia-gpu version=2
    2025-03-27T09:49:40.679+0900 [DEBUG] client.plugin: finished plugin manager initial fingerprint: plugin-type=device
    2025-03-27T09:49:40.679+0900 [DEBUG] client: new devices detected: devices=1
    
[생략]
```



```bash
[WINDOWS CMD>>> set NOMAD_ADDR=http://172.28.197.68:4646
[WINDOWS CMD>>> nomad node status d131fe84

ID              = d131fe84-8827-4009-d128-93cc3dc9a0c0
Name            = GSWindows
Node Pool       = default
Class           = <none>
DC              = dc1
Drain           = false
Eligibility     = eligible
Status          = ready
CSI Controllers = <none>
CSI Drivers     = <none>
Uptime          = 45m32s
Host Volumes    = <none>
Host Networks   = <none>
CSI Volumes     = <none>
Driver Status   = exec,raw_exec

Node Events
Time                       Subsystem  Message
2025-03-27T09:49:42+09:00  Cluster    Node registered

Allocated Resources
CPU          Memory       Disk
0/51088 MHz  0 B/7.4 GiB  0 B/954 GiB

Allocation Resource Utilization
CPU          Memory
0/51088 MHz  0 B/7.4 GiB

Host Resource Utilization
CPU            Memory           Disk
410/51088 MHz  627 MiB/7.4 GiB  1.8 GiB/1007 GiB

Device Resource Utilization
nvidia/gpu/NVIDIA GeForce RTX 3060 Laptop GPU[GPU-10177bd8-6d56-c386-0978-fd9b06941a51]  538 / 6144 MiB

Allocations
No allocations placed
```

### 3.1 Nomad client on WSL with NVIDIA plugin

Windows에서 WSL(Ubuntu)에 GPU를 지원하는 Nomad 클라이언트를 자동으로 구성하는 예제 입니다. `C:\temp\` 디렉토리 하위에 스크립트들을 복사합니다.

<https://github.com/Great-Stone/nomad-client-on-wsl-with-nvidia-plugin>

![image-20250328105933402](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20250328105933402.png)

설치를 위한 Powershell 실행 커맨드는 다음과 같습니다.

```powershell
powershell -ExecutionPolicy Bypass -File .\install_nomad_on_wsl.ps1
```

#### 3.1.1 Powershell script for installation

`install_nomad_on_wsl.ps1`에서는 사용자 Windows환경의 IP를 선택하고 WSL에 Nomad client를 구성하는 스크립트를 호출합니다.

기본적으로 WSL은 네트워킹에 NAT(네트워크 주소 변환) 기반 아키텍처를 사용합니다. Nomad client가 인식하는 IP는 Windows 내부의 IP이므로 Nomad server가 Windows 호스트의 IP를 알기 위해 `advertise` 주소를 선언해야 합니다.

해당 Powershell 스크립트에서는 Windows에 할당된 네트워크의 IP 목록을 가져와 선택하도록 합니다.

```powershell
# 생략
$user_ip = $ip_list[[int]$selection - 1]
Write-Output "Selected IP address: $user_ip"
```

선택된 IP는 Powershell에서 WSL에서의 쉘 스크립트 실행 시 인수로 전달됩니다. 쉘에서 `sudo` 권한을 요구하므로 WSL의 사용자 패스워드가 필요합니다.

```powershell
# 생략
Write-Output "Install Nomad Client on WSL"
wsl /mnt/c/temp/nomad_client_setup.sh $user_ip
```



#### 3.1.2 Shell script to run in WSL

`nomad_client_setup.sh`에서는 Nomad client 실행을 위한 작업을 수행합니다. 필요한 패키지를 설치하고 Nomad 바이너리 및 Nvidia plugin을 다운로드 합니다. Nomad는 서비스로 등록되어 실행됩니다.

컨테이너에서 Nvidia GPU를 사용하기 위해 Nvidia container toolkit과 드라이버를 설치합니다.

- Container toolkit : <https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html>

- cuda : <https://developer.nvidia.com/cuda-downloads>

```bash
# Installing NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg \
  && curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update

sudo apt-get install -y ubuntu-drivers-common nvidia-utils-545 nvidia-container-toolkit nvidia-cuda-toolkit

sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
sudo docker info|grep -i runtime

wget https://developer.download.nvidia.com/compute/cuda/12.8.1/local_installers/cuda_12.8.1_570.124.06_linux.run

sudo sh cuda_12.8.1_570.124.06_linux.run --silent --toolkit --toolkitpath=/usr/local/cuda-12.8
```

Powershell에서 전달받은 `advertise` 주소를 위한 IP 인수는 `nomad.hcl.tpl`의 `ADVERTISE_IP` 스트링 값을 치환 합니다.

```bash
# Nomad configuration
sudo sed /mnt/c/temp/nomad.hcl.tpl -e "s/ADVERTISE_IP/$1/g" | sudo tee /etc/nomad.d/nomad.hcl > /dev/null
```



### 3.2 Nomad config

설치 쉘 스크립트에서 `advertise`의 IP 주소를 치환 합니다.

```hcl
advertise {
  http = "ADVERTISE_IP"
  rpc  = "ADVERTISE_IP"
  serf = "ADVERTISE_IP"
}
```

`nomad.hcl.tpl`에는 미리 구성된 서버로의 조인을 위해 `IP:Port`가 명시되어있습니다. 해당값은 환경에 맞게 수정되어야 합니다. `host_volume`은 WSL에서 구성된 Windows 볼륨 마운트 위치를 설정해두었습니다. Windows 호스트에서 네트워크 볼륨을 공유 스토리지로 사용하는 경우 WSL에 해당 네트워크 디렉토리를 마운트하여 사용할 수 있습니다.

```hcl
client {
  enabled = true
  servers = ["192.168.0.11:4647"]

  host_volume "host_temp" {
    path      = "/mnt/c/temp"
    read_only = false
  }
}
```



### 3.3 Check node status

`Device Resource Utilization` 항목에서 `nvidia` 디바이스를 확인합니다.

```hcl
[CLI> nomad node status ad1f3d27

ID              = ad1f3d27-3cd1-7b1f-4c77-3c5a068f92a1
Name            = GSWindows
Node Pool       = default
Class           = <none>
DC              = dc1
Drain           = false
Eligibility     = eligible
Status          = ready
CSI Controllers = <none>
CSI Drivers     = <none>
Uptime          = 8h51m24s
Host Volumes    = host_temp
Host Networks   = <none>
CSI Volumes     = <none>
Driver Status   = docker,exec,java,raw_exec

Node Events
Time                       Subsystem     Message
2025-03-28T12:05:07+09:00  Driver: java  Healthy
2025-03-28T11:36:07+09:00  Cluster       Node registered

Allocated Resources
CPU          Memory       Disk
0/51088 MHz  0 B/7.4 GiB  0 B/953 GiB

Allocation Resource Utilization
CPU          Memory
0/51088 MHz  0 B/7.4 GiB

Host Resource Utilization
CPU            Memory           Disk
127/51088 MHz  719 MiB/7.4 GiB  32 GiB/1007 GiB

Device Resource Utilization
nvidia/gpu/NVIDIA GeForce RTX 3060 Laptop GPU[GPU-10177bd8-6d56-c386-0978-fd9b06941a51]  757 / 6144 MiB

Allocations
ID        Node ID   Task Group  Version  Desired  Status    Created     Modified
```

## 4. GPU test on Nomad

### 4.1 Container test

다음의 Job을 Nomad에서 실행합니다. `cuda` 컨테이너의 tag가 실행되는 환경에 맞는지 확인합니다.

```hcl
job "gpu-docker" {
  datacenters = ["dc1"]
  type = "batch"

  group "smi" {
    task "smi" {
      driver = "docker"

      config {
        image = "nvidia/cuda:12.8.1-cudnn-devel-ubuntu22.04"
        command = "nvidia-smi"
      }

      resources {
        device "nvidia/gpu" {
          count = 1

          # Add an affinity for a particular model
          affinity {
            attribute = "${device.model}"
            value     = "GeForce RTX 3060 Laptop GPU"
            weight    = 50
          }
        }
      }
    }
  }
}
```

실행이 완료되면 다음과 같이 실행된 결과를 확인할 수 있습니다.

![image-20250328122832455](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20250328122832455.png)

### 4.2 Python test

GPU를 사용하는 Python 작업을 Nomad의 `raw_exec` 드라이버를 사용하여 실행하고, 모델을 학습한 후 결과를 Windows 폴더로 복사하는 워크로드를 구현할 수 있습니다.



![image-20250328152816836](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20250328152816836.png)



1.  Python 환경 및 패키지 설치 (`pip` 태스크)

2.  CUDA를 활용한 Python 코드 실행 (`python-cuda` 태스크)

3.  생성된 모델을 Windows 경로로 복사 (`model-copy-to-windows` 태스크)



Nomad의 Job 정의로 Python을 구성하면 다음의 장점을 취할 수 있습니다.

- 가상 환경을 사용하여 Python 패키지 충돌 방지
- GPU 자원을 활용하여 PyTorch 모델을 학습 또는 추론 가능
- Windows 호스트에 연결된 디렉토리로 모델 자동 이동 (편리한 결과 확인 가능)
- WSL에서 테스트된 코드를 더 강력한 GPU(A100, H100)에서 동일하게 사용 가능



소스코드 : <https://raw.githubusercontent.com/Great-Stone/nomad-client-on-wsl-with-nvidia-plugin/refs/heads/main/python/main.py>



![image-20250328152837150](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20250328152837150.png)



#### 4.2.1 task "pip" - prestart

Python 가상 환경(virtualenv) 생성 및 기본 패키지 설치합니다. 가상 환경은 공통 디렉토리인 `alloc`에 저장합니다.

```bash
#!/bin/bash
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
pip3 install virtualenv
mkdir ../alloc/env
virtualenv ../alloc/env
```



#### 4.2.2 task "python-cuda" - main

GPU를 활용한 Python 코드 실행합니다. `prestart` 단계에서 구성된 `virtualenv` 환경을 사용하여 타 Python 실행 환경에 영향을 주지 않도록 구성됩니다.

```bash
#!/bin/bash
source ../alloc/env/bin/activate
python3 -m pip install torch numpy
python3 local/main.py
```

실행에 필요한 `main.py` 파일은 `artifact` stanza를 사용하여 원격지에서 다운로드 받을 수 있습니다. 

```hcl
artifact {
  source = "https://raw.githubusercontent.com/Great-Stone/nomad-client-on-wsl-with-nvidia-plugin/refs/heads/main/python/main.py"
  destination = "local/"
}
```

GPU 사용을 위해 `affinity`로 GPU 디바이스가 있는 환경이 지정됩니다.

```hcl
resources {
  cpu = 5000
  memory = 2048
  device "nvidia/gpu" {
    count = 1

    affinity {
      attribute = "${device.model}"
      value     = "GeForce RTX 3060 Laptop GPU"
      weight    = 50
    }
  }
}
```



#### 4.2.3 task "model-copy-to-windows"  - poststop

main task가 완료되면 `main.py` 실행 결과로 생성된 모델 파일을 Windows 폴더 `/mnt/c/temp/`로 복사 합니다.

```hcl
config {
  command = "cp"
  args = ["${NOMAD_ALLOC_DIR}/model/simple_model.pth", "/mnt/c/temp/"]
}
```


## 결론

Nomad는 기본적으로 Windows에서 GPU 플러그인을 지원하지 않지만, WSL(Windows Subsystem for Linux)을 활용하면 Linux 환경에서 Nomad의 NVIDIA 플러그인을 정상적으로 사용할 수 있습니다. 이를 통해 Windows에서도 GPU 리소스를 효과적으로 관리하고 AI 및 ML 워크로드를 실행할 수 있습니다.

본 문서에서는 WSL을 기반으로 Nomad 클라이언트를 설정하는 방법을 설명했으며, 이를 자동화하는 PowerShell 및 Shell 스크립트도 제공했습니다. 이러한 접근 방식은 Windows 환경에서 GPU 기반 작업을 수행하려는 사용자에게 유용한 대안이 될 것입니다.