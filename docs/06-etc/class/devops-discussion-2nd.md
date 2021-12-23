---
meta:
  - name: description
    content: "DevOps 연구소 좌담회 - 2차"
tags: ["devops", "container"]
---

# DevOps 연구소 좌담회 - 2차

> 2019년 5월 23일 (목) 19:00 ~ 21:30

[컨테이너 연구소](https://www.facebook.com/groups/ContainersLab) - 컨테이너 시스템의 활용 방향 및 미래에 관련해서 좌담 part2

장소 : 대륭서초타워 베스핀글로벌 [링크](https://www.facebook.com/groups/ContainersLab/permalink/593428921163895/?__cft__[0]=AZWv-Ae3xWrhh-SrIPGnG3Of9aGv-4ves7wY9nyg5DNcjSpKcn9I1FlmEn22O8JiXSbNZ8uD0o31PVVjgwK8J9edy-AznNo4PcH_SkwDbcvsJQiBsjWbgFC303zAqzimiqxbzKjiHynyKxNLScgJooIYq4Y8BRLhpeP7EGfbrJACE_BGy5tvuzbQaLAqZmxmBRs&__tn__=%2CO%2CP-R)



### Q. 컨테이너란?

- Namespace가 지원되는 Process (Tech 관점)
- 스타트업에서는 비용 절감 가능 ($ 관점)



### Q. 왜 컨테이너를 사용해야 하는가?

- 개발자는 인프라를 이해할 수 있다.
- 운영자는 코드로 인프라를 관리 할 수 있다.
- 시대적인 흐름이다.
- 컨테이너 IDC는 돈을 절감할 수 있다.



### Q. 어디에 어떻게?

#### 모바일 광고 회사 사례

- **컨테이너 환경 사용 전** : 오전과 오후 특정 시간에 트래픽이 발생하는데, 평소에는 최대 트래픽을 예상하여 인프라를 구성하여 사용 >> 유지보수 비용이 많이 발생
- **컨테이너 환경 사용 후** : 예상되는 피크시간대에 자동으로 컨테이너를 확장하는 방식으로 트래픽 처리하는 방식으로 변경, 서비스 중에도 로직을 변경하여 적용할 수 있는 이점 확보


### Q. 어디에 쓰지 못할까?

1. System reliability 유지를 위한 환경
2. 고성능이 요구되는 환경
3. DB같은 Stateful한 환경을 컨테이너로? DB CI/CD는 어떻게



### Q. 편하게 사용할 수 있는 컨테이너?

- 컨테이너는 rootless 하다.

- kubernetes는 할렘가 같다
  - 사용하지 않는 자원으로 인한 소비가 많다.
  - 이런건 MicroVM으로 해결하능할 것으로 예상한다.
  
- 스타트업의 경우 서버를 구축해서 사용하기 보다는 어느정도 서비스 형태로 된 컨테이너 서비스를 사용할 후 구축해보는 것을 추천한다.

  


### Q. 컨테이너 사용 시 주의 사항

- 대문자 주의!
- 컨테이너 빌드 시 베이스 이미지도 지속적으로 관리 필요 (버전 등)
- 주객전도 주의! 비즈니스에 포커싱하자!
- 개발자 판단 후 결정이 필요


### Appendix

- **KEDA**

  - <https://github.com/kedacore/keda>
  - 마이크로소프트(MS)가 레드햇과 손잡고 개발한 컨테이너 인프라의 확장(scaling) 자동화 기술입니다.
  - CPU 메트릭 정보를 기반으로 했던 확장방식의 한계를 넘어 주요 '이벤트'를 기반으로 확장을 정의, 수행할 수 있습니다.
  - 즉, Kubernetes Metrics Server 역할을하며 사용자는 전용 Kubernetes 사용자 지정 리소스 정의를 사용하여 자동 확장(Autoscaling)을 위한 규칙을 정의 할 수 있습니다.
  
- **Podman vs. Docker**

  - <https://developers.redhat.com/blog/2019/02/21/podman-and-buildah-for-docker-users/>

  - Docker
    - 단일 프로세스가 단일 실패 지점이 될 수 있습니다.
    - 이 프로세스는 모든 하위 프로세스 (실행중인 컨테이너)를 소유합니다.
    - 상위 프로세스에 문제가 발생하면 컨트롤에서 벗어나는 프로세스가 발생합니다.
    - 컨테이너 환경으로 인해 보안 취약성이 발생할 수 있습니다.
    - 모든 Docker 작업은 동일한 전체 루트 권한을 가진 사용자 (또는 사용자)가 수행해야했습니다.

      ![Docker Work - Docker](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/fig1.png)

  - Podman
    - [Podman site](https://podman.io/blogs/)
    - Podman 방식은 이미지 레지스트리, 컨테이너 및 이미지 저장소, runC 컨테이너 런타임 프로세스 (no Daemon)를 통해 Linux 커널과 직접 상호 작용하는 것입니다.

      ![Podman Work - Podman](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/fig2.png)