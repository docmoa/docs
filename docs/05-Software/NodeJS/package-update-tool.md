---
description: "Node.js의 필요 패키지의 최신 버전으로 package.json을 업데이트하는 툴"
tag: ["nodejs"]
---

# Node.js package version update tool NCU

> npm-check-updates - <https://www.npmjs.com/package/npm-check-updates>

## 1. 배경

`npm install`을 사용하여 패키지 설치를 하는 경우 `package.json`에는 보통 패치버전을 허용하는 형태로 저장된다.

```json title="package.json"
{
    "..." : "...",
    "devDependencies": {
        "@vue/repl": "^3.4.0",
        "...": "..."
    }
}
```

`^3.4.0`의 경우 `3.4` 버전 기준 패치버전인 `3.4.x`로만 업데이트 되기 때문에 매이저 또는 마이너가 변경되는 경우 개별적으로 업데이트 해줘야하는 불편함이 있었다.

::: tip
업데이트가 필요한 패키지는 `npm outdated`로 확인할 수 있다.
:::

## 2. npm-check-updates

검색을 해보니 많은 사람들이 `npm-check-updates` 패키지로 최신 버전으로 업데이트하는 것을 확인할 수 있었다. 이 툴은 전역으로 설치하여 사용한다.

```bash
npm install -g npm-check-updates
```

이후 `ncu`라는 명령어로 업데이트 될 패키지와 변경될 버전을 확인할 수 있다.

```bash
$ ncu

Checking /Users/gs/workspaces/docs/docmoa/package.json
[====================] 19/19 100%

 @vue/repl                         ^3.4.0  →        ^4.2.1
 chart.js                          ^4.4.1  →        ^4.4.3
 echarts                           ^5.4.3  →        ^5.5.0
 katex                            ^0.16.9  →      ^0.16.10
 mermaid                          ^10.8.0  →       ^10.9.1
 vue                              ^3.4.19  →       ^3.4.30
 vuepress-plugin-search-pro  ^2.0.0-rc.31  →  ^2.0.0-rc.50

Run ncu -u to upgrade package.json
```

명령의 결과로 표기되는것 처럼 `package.json`의 내용을 자동으로 수정하려면 `ncu -u`로 옵션을 추가하여 실행시켜야 한다.

::: danger
자동업데이트는 편하지만 영향도를 알 수 없는 경우 최신버전이 무엇인지 확인하는 용도로만도 사용할 수 있다.
:::

이후, `ncu -u`를 수행하면 `package.json` 내용을 자동으로 업데이트 해준다. 업데이트된 `package.json`을 기준으로 `npm install`을 수행하여 패키지 업그레이드 작업을 완료한다.

```
$ ncu -u

Upgrading /Users/gs/workspaces/docs/docmoa/package.json
[====================] 19/19 100%

 @vue/repl                         ^3.4.0  →        ^4.2.1
 chart.js                          ^4.4.1  →        ^4.4.3
 echarts                           ^5.4.3  →        ^5.5.0
 katex                            ^0.16.9  →      ^0.16.10
 mermaid                          ^10.8.0  →       ^10.9.1
 vue                              ^3.4.19  →       ^3.4.30
 vuepress-plugin-search-pro  ^2.0.0-rc.31  →  ^2.0.0-rc.50

Run npm install to install new versions.
```

## 3. 선택적 업데이트

일괄 버전 업데이트가 아니라 선택적으로 하려는 경우 `ncu -i --format group` 명령을 사용할 수 있다.
- 위아래 키보드를 눌러 패키지를 선택한다.
- 스페이스바로 선택/미선택 을 조절할 수 있다.
- `a`를 누르면 모든 것에 대해 선택/미선택을 조절할 수 있다.
- 원하는 패키지를 선택 후 `엔터`키로 선택을 저장한다.

```bash
$ ncu -i --format group
Upgrading /Users/gs/workspaces/docs/docmoa/package.json
[====================] 19/19 100%

? Choose which packages to update › 
  ↑/↓: Select a package
  Space: Toggle selection
  a: Toggle all
  Enter: Upgrade 

Patch   Backwards-compatible bug fixes
❯ ◉ chart.js                          ^4.4.1  →        ^4.4.3
  ◉ vue                              ^3.4.19  →       ^3.4.30
  ◉ vuepress-plugin-search-pro  ^2.0.0-rc.31  →  ^2.0.0-rc.50
  ◉ vuepress-theme-hope         ^2.0.0-rc.30  →  ^2.0.0-rc.50

Minor   Backwards-compatible features
  ◉ echarts                           ^5.4.3  →        ^5.5.0
  ◉ mermaid                          ^10.8.0  →       ^10.9.1

Major   Potentially breaking API changes
  ◯ @vue/repl                         ^3.4.0  →        ^4.2.1

Major version zero   Anything may change
  ◯ katex                            ^0.16.9  →      ^0.16.10
```

`엔터`키를 누르면 `npm install` 여부를 물어본다.

```bash
✔ Choose which packages to update › 

 chart.js                          ^4.4.1  →        ^4.4.3
 echarts                           ^5.4.3  →        ^5.5.0
 mermaid                          ^10.8.0  →       ^10.9.1
 vue                              ^3.4.19  →       ^3.4.30
 vuepress-plugin-search-pro  ^2.0.0-rc.31  →  ^2.0.0-rc.50
 vuepress-theme-hope         ^2.0.0-rc.30  →  ^2.0.0-rc.50

? Run npm install to install new versions? › (Y/n)
```
