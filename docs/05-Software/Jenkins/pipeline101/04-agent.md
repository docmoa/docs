---
description: jenkins 101
tag: ["cicd", "jenkins"]
---

# 4. Agents and Distributing Builds

빌드를 수행하기 위한 Worker로 다중 Jenkins를 컨트롤 할 수 있습니다. 이때 명령을 수행하는 Jenkins는 `Master`, 빌드를 수행하는 Jenkins는 `Worker`로 구분합니다. 여기서는 Worker의 연결을 원격 호스트의 Jenkins를 SSH를 통해 연결하는 방식과 컨테이너로 구성된 Jenkins를 연결하는 과정을 확인 합니다.

Master-Slave 방식, 또는 Master-Agent 방식으로 표현합니다.

::: tip
※ Slave 호스트에 Jenkins를 설치할 필요는 없습니다.
:::



## 4.1 Adding an SSH build agent to Jenkins

Worker가 실행되는 Slave 호스트에 SSH key를 생성하고 Worker 호스트에 인증 키를 복사하는 과정은 다음과 같습니다.

1. 키 생성 및 복사(jenkins 를 수행할 유저를 생성해야 합니다.)

   ```bash
   # User가 없는 경우 새로운 Jenkins slave 유저 추가
   $ useradd jenkins
   $ passwd jenkins
   Changing password for user jenkins.
   New password:
   Retype new password:
   
   # Slave 호스트에서 ssh 키를 생성합니다.
   $ ssh-keygen -t rsa
   Generating public/private rsa key pair.
   Enter file in which to save the key (/root/.ssh/id_rsa): <enter>
   Created directory '/root/.ssh'.
   Enter passphrase (empty for no passphrase): <enter>
   Enter same passphrase again: <enter>
   Your identification has been saved in /root/.ssh/id_rsa.
   Your public key has been saved in /root/.ssh/id_rsa.pub.
   The key fingerprint is: <enter>
   SHA256:WFU7MRVViaU1mSmCA5K+5yHfx7X+aV3U6/QtMSUoxug root@jenkinsecho.gyulee.com
   The key's randomart image is:
   +---[RSA 2048]----+
   |     .... o.+.=*O|
   |     ..  + . *o=.|
   |    .   .o. +o. .|
   |     . o. + ... +|
   |      o.S. .   +.|
   |     o oE    .oo.|
   |      = o . . +o=|
   |       o . o ..o=|
   |          . ..o+ |
   +----[SHA256]-----+
   
   $ cd ~/.ssh
   $ cat ./id_rsa.pub > ./authorized_keys
   ```

2. `Jenkins 관리`의 `노드 관리`를 선택합니다.

3. 좌측 메뉴에서 `신규 노드`를 클릭합니다.

4. 노드명에 고유한 이름을 입력하고 `Permanent Agent` 를 활성화 합니다.

5. 새로운 노드에 대한 정보를 기입합니다.

   - Name : 앞서 입력한 노드 이름 입니다.
- \# of executors : Jenkins에서 빌드시 사용할 실행 스레드 개수 입니다. 가용 Core수에 비례하여 설정합니다.
   - Remote root directory : 빌드시 사용할 디렉토리를 지정합니다. Lunux/Unix 계열에서는 해당 디렉토리의 권한을 확인해줍니다.
- Labels : Worker노드를 논리적으로 그룹화하는데 사용되는 값입니다. 예를들어 GPU나 HighCPU 모델같은 용도로 구분할 수 있습니다. (e.g. Metal)
   - Usage : `Use this node as much as possible`
   - Launch method : `Launch agent agents via SSH` 로 설정합니다.
     - Host : Worker 호스트에 접근 가능한 IP 혹은 Hostname을 입력합니다.
     - Credentials : 앞서 설정한 SSH 키를 등록합니다.
       - 우측에 `ADD > Jenkins`를 클릭합니다.
       - Kind : `SSH Username with private key`를 선택합니다.
       - ID : 고유한 키 값을 넣어줍니다. (e.g. jenkins-ssh)
       - Username : jenkins (Slave 호스트의 사용자 이름입니다.)
       - Private Key : Enter directly 를 사용하여 앞서 생성한 `~/.ssh/id_rsa` 의 내용을 붙여넣어줍니다. (일반적으로 `-----BEGIN RSA PRIVATE KEY-----`로 시작하는 내용입니다.)
     - Host Key Verification Strategy : `Non verifying verification strategy` 를 선택합니다.
   - 저장 버튼을 클릭하면 Node 설정 화면과 왼쪽 `빌드 실행 상태`에 새로운 Slave Node가 추가됨을 확인 할 수 있습니다.



Label 지정한 Slave Worker에서 빌드가 수행되도록 기존 02-02.Jobs의 Pipeline 스크립트를 수정합니다. 기존 `agent any`를 다음과 같이 `agent { label 'Metal' }`로 변경합니다. 해당 pipeline은 label이 `Metal`로 지정된 Worker에서만 빌드를 수행합니다.

```groovy
pipeline {
    agent { label 'Metal' }
    parameters {
        string(name: 'Greeting', defaultValue: 'Hello', description: 'How should I greet the world?')
    }
    stages {
        stage('Example') {
            steps {
                echo "${params.Greeting} World!"
            }
        }
    }
}
```

![1564378013035](image/1564378013035.png)



## 4.2 Using Docker images for agents

Master Jenkins 호스트에서 docker 서비스에 설정을 추가합니다. docker 설치가 되어있지 않은 경우 설치가 필요합니다.

```bash
$ yum -y install docker
```

>  RHEL8 환경이 Master인 경우 위와 같은 방식으로 설치를 진행하면 변경된 패키지에 따라 `podman-docker`가 설치 됩니다. 아직 Jenkins에서는 2019년 7월 29일 기준 `podman`을 지원하지 않음으로 별도 yum repository를 추가하여 진행합니다. `docker-ce` 최신 버전에서는 `containerd.io` 의 필요 버전이 `1.2.2-3` 이상이나 RHEL8에서 지원하지 않음으로 별도로 버전을 지정하여 설치합니다.
>
> ```bash
> $ yum -y install yum-utils
> $ yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
> $ sudo yum repolist -v
> ...
> Repo-id      : docker-ce-stable
> Repo-name    : Docker CE Stable - x86_64
> Repo-revision: 1564098258
> Repo-updated : Fri 26 Jul 2019 08:44:18 AM KST
> Repo-pkgs    : 47
> Repo-size    : 982 M
> Repo-baseurl : https://download.docker.com/linux/centos/7/x86_64/stable
> Repo-expire  : 172,800 second(s) (last: Thu 25 Jul 2019 07:33:33 AM KST)
> Repo-filename: /etc/yum.repos.d/docker-ce.repo
> ...
> 
> $ yum -y install docker-ce-3:18.09.1-3.el7
> $ systemctl enable docker
> $ systemctl start docker
> ```



- docker를 설치 한 뒤 API를 위한 TCP 포트를 활성화하는 작업을 진행합니다.`/lib/systemd/system/docker.service`에 `ExecStart` 옵션 뒤에 다음과 같이 `-H tcp://0.0.0.0:4243`을 추가합니다. 

  ```properties
  ...
  [Service]
  Type=notify
  # the default is not to use systemd for cgroups because the delegate issues still
  # exists and systemd currently does not support the cgroup feature set required
  # for containers run by docker
  ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:4243
  ExecReload=/bin/kill -s HUP $MAINPID
  TimeoutSec=0
  RestartSec=2
  Restart=always
  ...
  ```

- 수정 후 서비스를 재시작합니다.

  ```bash
  $ systemctl daemon-reload
  $ systemctl restart docker
  $ docker ps
  CONTAINER ID    IMAGE    COMMAND    CREATED    STATUS    PORTS    NAMES
  
  $ usermod -aG docker jenkins
  $ chmod 777 /var/run/docker.sock
  ```

  

Jenkins에 새로운 플러그인을 추가하고 설정합니다.

- `Jenkins 관리`로 이동하여 `플러그인 관리`를 클릭합니다.

- `설치 가능` 탭을 클릭하고 상단의 검색에 `docker`를 입력하면 `docker`플러그인이 나타납니다. 선택하여 설치를 진행하고 Jenkins를 재시작 합니다.

- `Jenkins 관리`로 이동하여 `시스템 설정`을 클릭합니다.

- `Cloud`항목 아래 `ADD A NEW CLOUD` 드롭박스에 있는 `Docker`를 선택합니다.

  - Name은 기본 값으로 진행하고 `DOCKER CLOUD DETAILS...` 버튼을 클릭합니다.

  - Docker Host URI : 앞서 설정한 port로 연결합니다. (e.g. tcp://master:4243)

  - `TEST CONNECTION` 버튼을 눌러 정상적으로 Version 정보와 API Version이 표기되는지 확인합니다.

    ```
    Version = 18.09.1, API Version = 1.39
    ```

  - Enabled를 활성화 합니다.



Docker 실행을 위한 Item을 생성합니다. (e.g. 04-02.UsingDockerImagesForAgents)

1.  `Pipeline` 스크립트를 구성합니다.

   ```groovy
   pipeline {
       agent {
           docker { image 'node:latest' }
       }
       stages {
           stage('Test'){
               steps {
                   sh 'node --version'
               }
           }
       }
   }
   ```

2. 수정 후 좌측 `Build Now`를 클릭하여 빌드 수행 후 결과를 확인합니다.

3. `Step 1`에서의 결과와는 달리 `Stage View`항목과 Pipeline stage가 수행된 결과를 확인할 수 있는 UI가 생성됩니다.

   ![1564388703234](image/1564388703234.png)



## 4.3 Configuring specific agents

`Freestyle project` 형태의 Item을 생성합니다. (e.g. 04-03.ConfiguringSpecificAgents)

>  Jenkins는 각 단계, 빌드, 그리고 빌드 후 작업일 지정할 수 있습니다. `Freestyle project`에서는 이같은 전체 빌드 단계를 구성하고 여러가지 플러그인을 사용할 수 있는 환경을 제공합니다.

![1564444282455](image/1564444282455.png)



- General

  - Restrict where this project can be run : 빌드 수행을 특정 Label 노드에 제한하도록 설정할 수 있습니다.

    - Label Expression : 앞서의 과정에서 생성한 노드 `Metal`을 지정해봅니다. 해당 조건의 노드가 존재하는 경우 노드 개수 정보가 표기됩니다.

      ```
      Label Metal is serviced by 1 node.
      ```

- Build

  - `ADD BUILD STEP` 드롭박스에서 `Excute shell `항목을 선택하여 추가 합니다.
    - Command 칸에 `echo "Hello world."`를 넣어봅니다.
  - `ADD BUILD STEP` 드롭박스에서 `Excute shell `항목을 선택하여 추가 합니다.
    - Command 칸에 `ls -al"`를 넣어봅니다.

- 저장하고 좌측의 `Build Now`를 클릭하여 빌드를 수행합니다.

- 콘솔 출력을 확인하면 지정한 Label 노드에서 각 빌드 절차가 수행된 것을 확인할 수 있습니다.

  ![1564449679656](image/1564449679656.png)