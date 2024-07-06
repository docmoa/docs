---
description: "MongoDB의 CTO이자 공동 창립자(2007~2010년)인 Eliot Horowitz가 MongoDB에 대한 포괄적인 소개와 함께 문서 모델이 관계형 데이터베이스와 어떻게 다른지 안내합니다."
tag: ["MongoDB"]
---

# MongoDB 소개

> MongoDB in 5 Minutes with Eliot Horowitz

<VidStack
  src="youtube/EE8ZTQxa0AM"
  title="MongoDB in 5 Minutes with Eliot Horowitz"
/>

https://www.youtube.com/watch?v=EE8ZTQxa0AM

> MongoDB의 CTO이자 공동 창립자(2007~2010년)인 Eliot Horowitz가 MongoDB에 대한 포괄적인 소개와 함께 문서 모델이 관계형 데이터베이스와 어떻게 다른지 안내합니다.

## MongoDB의 특징

- MongoDB은 전통적인 관계형 데이터베이스와 근본적으로 다른 문서 모델로 기반합니다. 
- 관계형 데이터베이스(RDB)는 테이블 또는 시트로 구성된 행과 열로 구성되어있습니다. 이러한 구조는 어플리케이션을 복잡하게 만들고 유지보수를 어렵게 하며 데이터 추출에 드는 시간과 비용이 증가할 수 있습니다.

![관계형 데이터베이스의 테이블 또는 시트](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20240706154229548.png)

- MongoDB는 문서라는 단위로 데이터를 저장한다. 개발자들이 데이터를 보다 효율적으로 처리할 수 있고, 더 자연스럽게 읽고 쓸 수 있습니다.

![MongoDB의 문서형태 데이터](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20240706154355412.png)

- 몽고디비는 분산 데이터베이스이기 때문에 여러 서버를 조정하여 데이터를 저장할 수 있으며, 이는 개발자들과 설계자들이 자체적으로 구축해야 할 기능을 제공하여 위험과 작업량을 줄입니다.
- 몽고디비는 현대적인 데이터베이스뿐만 아니라 운영팀이 MongoDB 클러스터를 프로비저닝, 구성, 보호, 모니터링, 백업, 복원 및 업그레이드하는데 도움이되는 관리 도구도 제공합니다.



## MongoDB의 장점

- MongoDB는 문서로 저장되는 데이터의 열(Column)을 동일하게 맞출 필요가 없습니다.
- 문서를 통해 데이터를 구조화하는데 있어 컴퓨터가 처리하기에 효율적이며(JSON형태), 동시에 사람이 읽기 쉬운 형식으로 제공합니다.
- MongoDB의 분산 데이터베이스로서의 특징은 여러 서버 간의 데이터 저장을 조율하는 능력을 기본적으로 갖고 있어 **고가의 장비** 없이도 구성이 용이합니다.
- 고가용성을 제공하며 데이터 처리량이 증가할 때 **서버를 추가**함으로써 쉽게 스케일업할 수 있는 장점이 있습니다.

![MongoDB 고가용성](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20240706154717088.png)



##  MongoDB 사용의 이유

- 데이터의 문서 모델과 분산 시스템 요소가 필요하다면 MongoDB는 그 선택지 중 하나입니다.
- MongoDB는 관리 툴([MongoDB Compass](https://www.mongodb.com/ko-kr/products/tools/compass), [MongoDB for VS Code](https://www.mongodb.com/products/tools/vs-code), [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) 등) 개발하여 운영 팀이 MongoDB 클러스터를 프로비저닝, 구성, 보안, 모니터링, 백업, 복원 및 업그레이드할 수 있도록 지원합니다.
- MongoDB는 클라우드에 맞게 설계되었으며 MongoDB Atlas을 통해 데이터베이스를 관리할 수 있도록 서비스를 제공합니다.
- 주요 클라우드 플랫폼인 Amazon Web Services, Microsoft Azure 및 Google Cloud Platform에서 이용 가능합니다.
- 사용자는 특정 인프라 환경에 종속되지 않고 어떤 코드도 다시 작성하지 않아도 됩니다.



