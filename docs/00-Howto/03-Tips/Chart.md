---

---

# Chart

문서 작성시 차트를 추가하는 방법을 안내합니다.
- [공식 문서](https://theme-hope.vuejs.press/guide/markdown/chart.html)

차트 구성 방식은 [ChartJS](https://www.chartjs.org/docs/latest/)를 따릅니다.

`::: chart` 와 `:::`로 처리합니다.

## 기본 사용법 - Bar

::: chart A bar chart

```json
{
  "type": "bar",
  "data": {
    "labels": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"],
    "datasets": [{
      "label": "My First Dataset",
      "data": [12, 19, 3, 5, 2, 3],
      "backgroundColor": [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)"
      ],
      "borderColor": [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)"
      ],
      "borderWidth": 1
    }]
  },
  "options": {
    "scales": {
      "y": {
        "ticks": {
          "beginAtZero": true,
          "callback": "function(value){ return '$' + value + 'k'; }"
        },
        "beginAtZero": true
      }
    }
  }
}
```
:::

::: details CODE

~~~md
::: chart A bar chart

```json
{
  "type": "bar",
  "data": {
    "labels": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"],
    "datasets": [{
      "label": "My First Dataset",
      "data": [12, 19, 3, 5, 2, 3],
      "backgroundColor": [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)"
      ],
      "borderColor": [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)"
      ],
      "borderWidth": 1
    }]
  },
  "options": {
    "scales": {
      "y": {
        "ticks": {
          "beginAtZero": true,
          "callback": "function(value){ return '$' + value + 'k'; }"
        },
        "beginAtZero": true
      }
    }
  }
}
```


:::

## 기본 사용법 - Bubble

::: chart A Bubble Chart

```json
{
  "type": "bubble",
  "data": {
    "datasets": [
      {
        "label": "First Dataset",
        "data": [
          { "x": 20, "y": 30, "r": 15 },
          { "x": 40, "y": 10, "r": 10 }
        ],
        "backgroundColor": "rgb(255, 99, 132)"
      }
    ]
  }
}
```

:::

::: details CODE
~~~md
::: chart A Bubble Chart

```json
{
  "type": "bubble",
  "data": {
    "datasets": [
      {
        "label": "First Dataset",
        "data": [
          { "x": 20, "y": 30, "r": 15 },
          { "x": 40, "y": 10, "r": 10 }
        ],
        "backgroundColor": "rgb(255, 99, 132)"
      }
    ]
  }
}
```

:::

