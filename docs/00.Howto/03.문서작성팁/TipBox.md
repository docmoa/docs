---

title: Tip Box
tags: ["how"]

---

# Tip Box

문서 작성시 팁과 주의사항을 표기하는 방법을 설명합니다.
[공식 문서](https://vuepress.vuejs.org/guide/markdown.html#:~:text=markdown.toc%20option.-,%23,-Custom%20Containers)

## 기본 사용법
~~~md
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: details
This is a details block, which does not work in IE / Edge
:::
~~~
다음과 같이 표기됩니다.
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::

::: details
This is a details block, which does not work in IE / Edge
:::

## 응용
타입 우측에 타이틀명을 추가하여 기본 값을 변경합니다.
~~~md
::: danger STOP
Danger zone, do not proceed
Go to [here](https://vuepress.vuejs.org/guide/markdown.html#:~:text=markdown.toc%20option.-,%23,-Custom%20Containers)
:::

::: details Click me to view the code
```js
console.log('Hello, VuePress!')
```
:::
~~~

::: danger STOP
Danger zone, do not proceed
Go to [here](https://vuepress.vuejs.org/guide/markdown.html#:~:text=markdown.toc%20option.-,%23,-Custom%20Containers)
:::

::: details Click me to view the code
```js
console.log('Hello, VuePress!')
```
:::

<TagLinks />