---

tags: ["how", "docmoa"]

---

# Tabs

컨텐츠에 탭을 추가하여 상황에 따라 선택적으로 문서를 읽을 수 있도록 합니다.  
상세 내용은 홈페이지 [element-tabs home](https://superbiger.github.io/vuepress-plugin-tabs) 를 확인해보세요.

## 기본 사용법
~~~md
:::: tabs
::: tab title
__markdown content__
:::
::: tab javascript
``` javascript
() => {
  console.log('Javascript code example')
}
```
:::
::::
~~~
다음과 같이 표기됩니다.

:::: tabs
::: tab title
**markdown content**
:::
::: tab javascript
``` javascript
() => {
  console.log('Javascript code example')
}
```
:::
::::

## 옵션
`tabs` 지원 옵션에 대한 설명은 다음과 같습니다.
|Attribute|설명|Type|가능 옵션|기본 옵션|
|-|-|-|-|-|
|type|Tab의 유형|String|card / Boarder-card|border-card|
|tab-position|Tab 위치|String|top / right / bottom / left|top|
|stretch|탭 너비를 전체 폭에 맞춤 여부|Boolean| - |false|

`tab` 지원 옵션에 대한 설명은 다음과 같습니다.
|Attribute|설명|Type|가능 옵션|기본 옵션|
|-|-|-|-|-|
|label|Tab의 타이틀|String| - | - |
|lazy|탭 내용의 지연 랜더링 여부|Boolean| - |false|