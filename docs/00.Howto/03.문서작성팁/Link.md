---

title: Link
tags: ["how"]

---

# Link

문서 작성시 외부 링크를 포함하는 예를 설명합니다. [참고 문서](https://www.markdownguide.org/basic-syntax/#links)

## 텍스트에 링크 달기 
설명하던 글의 특정 단어에 대해 외부 링크를 추가하고자 하는 경우 브라킷`[ ]`과 괄호를 사용합니다. domain을 같이 기입하는 경우 새창에서 열기로 표기됩니다.
```md
새창으로 이동하는 [링크 달기](http://docmoa.github.io/00.Howto/03.문서작성팁/Link.html)
현재 창에서 이동하는 [링크 달기](/00.Howto/03.문서작성팁/Link.html)
```
다음과 같이 표기됩니다.

- 새창으로 이동하는 [링크 달기](http://docmoa.github.io/00.Howto/03.문서작성팁/Link.html)  
- 현재 창에서 이동하는 [링크 달기](/00.Howto/03.문서작성팁/Link.html)


## 링크 자체를 표기
별도의 연결된 단어 없이 링크 자체를 넣는 경우 `< >`를 사용합니다.
```md
<https://docmoa.github.io>
<docmoa@gmail.com>
```
다음과 같이 표기됩니다.

- ***<https://docmoa.github.io>***  
- ***<docmoa@gmail.com>***

## 이미지
이미지는 `!`를 기존 링크 문법 앞에 추가합니다.
- 대체 텍스트는 이미지 링크에 접속할 수 없는 경우 표기됩니다.
- 이미지 설명은 마우스 오버시 확인하실 수 있습니다.

```md
![대체 텍스트](이미지 링크 "이미지 설명")

![](https://icons.iconarchive.com/icons/fatcow/farm-fresh/32/layout-link-icon.png)
![대체 텍스트](https://img.icons8.com/ios/2x/깨진링크)
![대체 텍스트](https://icons.iconarchive.com/icons/fatcow/farm-fresh/32/report-link-icon.png "이미지 설명")
```
다음과 같이 표기됩니다.

- ![](https://icons.iconarchive.com/icons/fatcow/farm-fresh/32/layout-link-icon.png)
- ![대체 텍스트](https://img.icons8.com/ios/2x/깨진링크)
- ![대체 텍스트](https://icons.iconarchive.com/icons/fatcow/farm-fresh/32/report-link-icon.png "이미지 설명")

## 동영상
외부 동영상은 html 문법을 활용하여 추가할 수 있습니다. 여기서는 유튜브를 예를 들어 설명합니다. 다른 여러가지 방식은 [참고 링크](https://vuepress-examples.netlify.app/demos/video/)를 확인해주세요.
- `공유`버튼을 누르고 `퍼가기` 를 클릭하면 우측에 동영상 퍼가기 코드가 나타납니다.
    ![Youtube Share 설명](../image/youtube_share.gif)
- 코드를 복사하고 그대로 파일 내에 붙여넣습니다.
```md
<iframe width="560" height="315" src="https://www.youtube.com/embed/StTqXEQ2l-Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```
다음과 같이 표기됩니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/StTqXEQ2l-Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
