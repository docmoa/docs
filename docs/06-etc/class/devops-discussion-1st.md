---
meta:
  - name: description
    content: "DevOps 연구소 좌담회 - 1차"
tags: ["devops", "container"]
---

# DevOps 연구소 좌담회 - 1차

> 2019년 4월 24일 수요일 저녁 19시 ~ 21시

[컨테이너 연구소](https://www.facebook.com/groups/ContainersLab) - 컨테이너 시스템의 활용 방향 및 미래에 관련해서 좌담

장소 : 메가존 지하 강연장 [링크](https://www.facebook.com/groups/ContainersLab/permalink/574875686352552/?__cft__[0]=AZWnS4aKkWGMPbMkAiYQs1hiGI25ctSJW3BsAXDvYU1grPKtYkfY_GvCi0HTphGKhoV-KATRdOIHE5StOIiZIf0WlLOLL2QI6QKJ--ep8v4c3YoSpUHD5x6Ko65l_riJmvqF17a9-XtIPbCVmNUJRVOZQ-bKHY4jQ7i_BFNfG0-SF0O-FLbZeRbJhncn3NRlHzF5R5Frk_NwiQ896x_FNkkU&__tn__=%2CO%2CP-R)



## Q. 컨테이너란 무엇일까?

- 자원을 잘 나눠주는 프로세스.

- Zip같은 패키지인데 바퀴도 있고 엔진도 있는

- 개발자들의 공용어

- VM이 H/W와의 분리였다면 컨테이너는 OS와 분리

- 떠나보낸 연인...하지만 사랑한다

  ![](https://raw.githubusercontent.com/Great-Stone/images/master/uPic/DevOps_Discussion_1st_001.jpg)

  

## Q. 왜 쓸까?
- 효율성
- 불변성
- 코드나 사람에 대한 종속성 제거
- OS 커플링 제거
- 떠나보내야 할 수도, 하지만 추천



## Q. Infra as Code 과 엔터프라이즈
- 도입시 롤에 대한 정의를 필요로함
- 하고싶은 내부 인력을 교육시키는 1안
- 외부의 잘하는 DevOps 엔지니어를 영입하는 2안



### 컨테이너 선진국의 경우...
- 컨테이너 기술보다는 그위의 서비스에 관심
- 기술 비교보다 어떻게 하면 잘 쓸까에 고민



## Q. K8S, DC/OS, Swarm, Rancher 누가남을까?
- K8S가 지금의 승자
- K8S는 마케팅에 비해 안정화 필요
- 밥줄 유지를 위해서는 솔루션 줄타기를 잘 해야함



## Q. Monitoring과 Admin은?
- K8S를 직접 도입시 따르는 실패의 원인중 하나
- 직접 만들고 구축하는것이 SaaS나 이미 있는 솔루션을 쓰는것 보다 비효율적
- 수시로 바뀌고 Scale out/in 하는 환경을 자체적인 툴이 따라가지 못함



### 엔터프라이즈의 고민거리
- 어떤 서비스를 컨테이너에 올릴까?
- 보안팀과의 딜
- HA는? DR은?
- 데이터베이스는?
- 어떻게 이모든걸 표준화 하지?

