---
description: "Node.js의 버전 요구사항을 package.js에 추가하기"
tag: ["nodejs"]
---

# Required Node.js engine version

`Docmoa`에서 사용하는 패키지를 업데이트 하던 중 다음과 같은 오류가 발생하였다.

## 1. 배경

```log
$ npm run dev

file:///Users/gs/workspaces/docs/docmoa/node_modules/execa/lib/utils/max-listeners.js:1
import {addAbortListener} from 'node:events';
        ^^^^^^^^^^^^^^^^
SyntaxError: The requested module 'node:events' does not provide an export named 'addAbortListener'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:123:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:189:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:530:24)
    at async loadUserConfig (file:///Users/gs/workspaces/docs/docmoa/node_modules/@vuepress/cli/dist/index.js:77:18)
    at async CAC.dev (file:///Users/gs/workspaces/docs/docmoa/node_modules/@vuepress/cli/dist/index.js:443:52)
```

업데이트 된 패키지에서 `addAbortListener`라는걸 사용하는 것 같은데, 이를 찾을 수 없어 오류가 발생하였다.

Node.js의 [CHANGELOG](https://nodejs.org/en/blog/release/v20.5.0)를 찾아보니 `addAbortListener`는 v20.5.0 부터 언급되는것으로 보아 이때부터 추가된 api인 것으로 추측된다.

- Node.js events 설명 - <https://runebook.dev/ko/docs/node/events>

현재 Docmoa를 빌드하는 버전은 `v18.x`였으므로 앞으로는 빌드하기 위해 `v20.5.x` 이상으로 필요 버전에 대한 명시가 필요해졌다.

## 2. 필요 버전 명시하기

`package.json`에서 `engine` 필드를 설정하고 `node`와 `npm`버전에 대한 요구 사항을 설정할 수 있다.

```json title="package.json"
{
  "..." : "...",
  "engines" : { 
    "npm" : ">=10.0.0 <20.0.0",
    "node" : ">=20.5.0"
  }
}
```

추가로 npm을 통해 이를 적용하려면 `.npmrc` 파일을 만들고 `engine-strict` 옵션을 `true`로 설정해야 한다.

```ini title=".npmrc"
# .npmrc
engine-strict=true
```

설정이 완료되면 필요한 엔진 버전이 일치하지 않는 경우 `npm install` 같은 npm 명령이 실패하게 된다.

`.npmrc` 적용 전에는 WARN 메시지만 나오지만
```log
$ node --version
v18.18.0

$ npm install
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'docmoa@2.3.0',
npm WARN EBADENGINE   required: { node: '>=20.5.0' },
npm WARN EBADENGINE   current: { node: 'v18.18.0', npm: '9.8.1' }
...생략...
```

적용 후에는 `ERR!`를 출력하며 실행되지 않는다.

```log
$ node --version
v18.18.0

$ npm install
npm ERR! code EBADENGINE
npm ERR! engine Unsupported engine
npm ERR! engine Not compatible with your version of node/npm: docmoa@2.3.0
npm ERR! notsup Not compatible with your version of node/npm: docmoa@2.3.0
npm ERR! notsup Required: {"node":">=20.5.0"}
npm ERR! notsup Actual:   {"npm":"9.8.1","node":"v18.18.0"}

npm ERR! A complete log of this run can be found in: /Users/gs/.npm/_logs/2024-06-27T00_34_26_004Z-debug-0.log
```