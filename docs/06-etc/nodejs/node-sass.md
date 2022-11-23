---
meta:
  - name: description
    content: node-sass 오류와 sass로의 전환
tags: ["arm", "nodejs"]
---

# node-sass와 sass로의 전환

aarch64에서 vuepress 실행을 위해 테스트를 하던 도중 node-gyp와 node-sass에 대한 오류를 맞이하게 되었다.

node-sass의 경우 arm환경에 대한 빌드 릴리즈가 없는 관계로 `npm install`을 실행하면 다시 빌드를 하게되는데, 이때 node-sass를 빌드하는 과정에서 빌드 실패가 발생함

## node-sass란?

node환경에서 sass는 css 코드로 변환해주는 스타일 전처리언어이다. c/c++로 되어있는 구성요소로 인해 빠른 빌드 속도를 제공한다.

## node-sass와 Nodejs 버전별 호환성

관련 내용을 찾다보면 Node 버전에 맞는 node-sass를 사용해야 한다고 나오는데 그 이유는 `libsass` 때문이고 c/c++로 되어있는 해당 라이브러리 특성상 Node 버전과 실행 환경에 종속적이다.

> node-sass 지원 환경 (<https://github.com/sass/node-sass/releases>)
>
> | OS | Architecture | Node |
> | - | - | - |
> | Windows | x86 & x64 | 12, 14, 16, 17 |
> | OSX | x64 | 12, 14, 16, 17 |
> | Linux | 64 | 12, 14, 16, 17 |
> | Alpine Linux | x64 | 12, 14, 16, 17 |
> | FreeBSD | i386 & x64 | 12, 14 |

추가로 node-sass는 항후 Dart Sass로 옮겨진다로 안내되어있음

<https://github.com/sass/node-sass>

## Dart Sass 로의 전환

stackoverflow에서 기존 node-sass를 사용하고 있는 경우 해당 프로젝트를 Dart Sass로 전환하는 선언 방식을 알려줬다.

<https://stackoverflow.com/a/70171361>

```bash
npm remove node-sass
npm i node-sass@npm:sass -D
```

`package.json`에 다음과 같이 추가된다.

```json
  "devDependencies": {
    "node-sass": "npm:sass@^1.55.0",
  },
```