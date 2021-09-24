---

tags: ["how", "docmoa"]

---

# Code Block

마크다운 기본 사용 법과 거의 동일합니다.

## 기본 사용법
코드블록은 \``` 과 \``` 사이에 코드를 넣어 로 표기합니다. 아래와 같이 md 파일 내에 작성하면

~~~md
```
# Code block e.g.
This is my code
```
~~~


다음과 같이 표기됩니다.
```
# Code block e.g.
This is my code
```

<code>```</code> 대신 <code>~~~</code> 도 사용 가능합니다.

## 코드 구문 강조
VuePress는 Prism Javascript 라이브러리를 통해 키워드 강조 표시를 지원 합니다. 목록에 대한 확인은 [components.json](https://github.com/PrismJS/prism/blob/master/components.json) 의 `languages`를 참고할 수 있습니다.

~~~md
```python
print("hello, world.")
```
~~~

```python
print("hello, world.")
```

## 코드 강조
문서 작성 시 코드블록에서 강조하고 싶은 경우 코드블럭의 스타일 에 강조할 라인 번호를 명시합니다.

~~~md
```python {2,4-5}
print("nomal")
print("highlight!")
print("nomal")
print("highlight!")
print("highlight!")
```
~~~

```python {2,4-5}
print("nomal")
print("highlight!")
print("nomal")
print("highlight!")
print("highlight!")
```

## 다중 코드블록
상황에 따라 동일한 구성 및 동작을 위한 코드블록을 옵션을 주어 선택적으로 표기하고 싶은 경우 `<code-group>`과 `<code-block>` 을 활용 합니다.

~~~md
<code-group>
<code-block title="Option1">
```bash {2}
# This is Option 1
chmod 755 ./file.txt
```
</code-block>

<code-block title="Option2">
```bash {2}
# This is Option 2
chmod +x ./file.txt
```
</code-block>
</code-group>
~~~

<code-group>
<code-block title="Option1">
```bash {2}
# This is Option 1
chmod 755 ./file.txt
```
</code-block>

<code-block title="Option2">
```bash {2}
# This is Option 2
chmod +x ./file.txt
```
</code-block>
</code-group>
