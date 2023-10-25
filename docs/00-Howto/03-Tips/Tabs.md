---


---

# Tabs

컨텐츠에 탭을 추가하여 상황에 따라 선택적으로 문서를 읽을 수 있도록 합니다.  
상세 내용은 `Markdown Enhance`의 [Tabs](https://plugin-md-enhance.vuejs.press/guide/tabs.html), [Code Tabs](https://plugin-md-enhance.vuejs.press/guide/code-tabs.html) 를 확인해보세요.

## Tabs 기본 사용법
~~~md
::: tabs
@tab title
__markdown content__

@tab javascript
``` javascript
() => {
  console.log('Javascript code example')
}
```
:::
~~~
다음과 같이 표기됩니다.

::: tabs
@tab title
__markdown content__

@tab javascript
``` javascript
() => {
  console.log('Javascript code example')
}
```
:::

## Code Tabs 기본 사용법

`Code Tabs`는 코드 블록만을 표기하는 탭을 제공합니다.
~~~md
::: code-tabs#shell

@tab pnpm

```bash
pnpm add -D vuepress-plugin-md-enhance
```

@tab yarn

```bash
yarn add -D vuepress-plugin-md-enhance
```

@tab:active npm

```bash
npm i -D vuepress-plugin-md-enhance
```

:::
~~~
다음과 같이 표기됩니다.

::: code-tabs#shell

@tab pnpm

```bash
pnpm add -D vuepress-plugin-md-enhance
```

@tab yarn

```bash
yarn add -D vuepress-plugin-md-enhance
```

@tab:active npm

```bash
npm i -D vuepress-plugin-md-enhance
```

:::