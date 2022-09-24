---

title: Chart
tags: ["how", "docmoa"]

---

# Chart

문서 작성시 차트를 추가하는 방법을 안내합니다.
- [공식 문서](https://vuepress-theme-gungnir.vercel.app/docs/plugins/chart.html#install)

차트 구성 방식은 [ChartJS](https://www.chartjs.org/docs/latest/)를 따릅니다.

## 기본 사용법 - Bar

```chart
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

::: details CODE
~~~md
```chart
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
~~~
:::

## 기본 사용법 - Bubble

```chart
{
  "type": "bubble",
  "data": {
    "datasets": [{
      "label": "First Dataset",
      "data": [{
        "x": 20,
        "y": 30,
        "r": 15
      }, {
        "x": 40,
        "y": 10,
        "r": 10
      }],
      "backgroundColor": "rgb(255, 99, 132)"
    }]
  },
  "options":{}
}
```

::: details CODE
~~~md
{
  "type": "bubble",
  "data": {
    "datasets": [{
      "label": "First Dataset",
      "data": [{
        "x": 20,
        "y": 30,
        "r": 15
      }, {
        "x": 40,
        "y": 10,
        "r": 10
      }],
      "backgroundColor": "rgb(255, 99, 132)"
    }]
  },
  "options":{}
}
~~~
:::

## 기본 사용법 - doughnut

```chart
{
  "type": "doughnut",
  "data": {
    "datasets": [{
      "data": [10, 20, 30],
      "backgroundColor": [
        "rgba(255, 99, 132)",
        "rgba(255, 206, 86)",
        "rgba(54, 162, 235)"
      ]
    }],
    "labels": ["Red", "Yellow", "Blue"]
  }
}
```

::: details CODE
~~~md
```chart
{
  "type": "doughnut",
  "data": {
    "datasets": [{
      "data": [10, 20, 30],
      "backgroundColor": [
        "rgba(255, 99, 132)",
        "rgba(255, 206, 86)",
        "rgba(54, 162, 235)"
      ]
    }],
    "labels": ["Red", "Yellow", "Blue"]
  }
}
```
~~~
:::

## 기본 사용법 - Line

```chart
{
  "type": "line",
  "data": {
    "labels": ["1월", "2월", "3월", "4월", "5월", "6월", "7월"],
    "datasets": [{
      "label": "My first data",
      "data": [65, 59, 80, 81, 56, 55, 40],
      "fill": true,
      "borderColor": "rgb(75, 192, 192)",
      "tension": 0.1
    }]
  }
}
```

::: details CODE
~~~md
{
  "type": "line",
  "data": {
    "labels": ["1월", "2월", "3월", "4월", "5월", "6월", "7월"],
    "datasets": [{
      "label": "My first data",
      "data": [65, 59, 80, 81, 56, 55, 40],
      "fill": true,
      "borderColor": "rgb(75, 192, 192)",
      "tension": 0.1
    }]
  }
}
~~~
:::

## 기본 사용법 - Mixed

```chart
{
  "type": "scatter",
  "data": {
    "labels": ["1월", "2월", "3월", "4월"],
    "datasets": [{
      "type": "bar",
      "label": "Bar data",
      "data": [10,20,30,40],
      "borderColor": "rgb(255, 99, 132)",
      "backgroundColor": "rgba(255, 99, 132, 0.2)",
      "borderWidth": 1
    },
    {
      "type": "line",
      "label": "Line data",
      "data": [40,30,20,10],
      "fill": false,
      "borderColor": "rgb(54, 162, 235)"
    }]
  },
  "options": {
    "scales": {
      "y": {
        "begionAtZero": true
      }
    }
  }
}
```

::: details CODE
~~~md
{
  "type": "scatter",
  "data": {
    "labels": ["1월", "2월", "3월", "4월"],
    "datasets": [{
      "type": "bar",
      "label": "Bar data",
      "data": [10,20,30,40],
      "borderColor": "rgb(255, 99, 132)",
      "backgroundColor": "rgba(255, 99, 132, 0.2)",
      "borderWidth": 1
    },
    {
      "type": "line",
      "label": "Line data",
      "data": [40,30,20,10],
      "fill": false,
      "borderColor": "rgb(54, 162, 235)"
    }]
  },
  "options": {
    "scales": {
      "y": {
        "begionAtZero": true
      }
    }
  }
}
~~~
:::

## 기본 사용법 - Polar Area

```chart
{
  "type": "polarArea",
  "data": {
    "labels": [
      "Red",
      "Green",
      "Yellow",
      "Grey",
      "Blue"
    ],
    "datasets": [{
      "label": "Polar Area Dataset",
      "data": [11, 16, 7, 3, 14],
      "backgroundColor": [
        "rgb(255, 99, 132)",
        "rgb(75, 192, 192)",
        "rgb(255, 205, 86)",
        "rgb(201, 203, 207)",
        "rgb(54, 162, 235)"
      ]
    }]
  },
  "options": {}
}
```

::: details CODE
~~~md
```chart
{
  "type": "polarArea",
  "data": {
    "labels": [
      "Red",
      "Green",
      "Yellow",
      "Grey",
      "Blue"
    ],
    "datasets": [{
      "label": "Polar Area Dataset",
      "data": [11, 16, 7, 3, 14],
      "backgroundColor": [
        "rgb(255, 99, 132)",
        "rgb(75, 192, 192)",
        "rgb(255, 205, 86)",
        "rgb(201, 203, 207)",
        "rgb(54, 162, 235)"
      ]
    }]
  },
  "options": {}
}
```
~~~
:::

## 기본 사용법 - Radar

```chart
{
  "type": "radar",
  "data": {
    "labels": [
      "Eating",
      "Drinking",
      "Sleeping",
      "Designing",
      "Coding",
      "Cycling",
      "Running"
    ],
    "datasets": [{
      "label": "My First Dataset",
      "data": [65, 59, 90, 81, 56, 55, 40],
      "fill": true,
      "backgroundColor": "rgba(255, 99, 132, 0.2)",
      "borderColor": "rgb(255, 99, 132)",
      "pointBackgroundColor": "rgb(255, 99, 132)",
      "pointBorderColor": "#fff",
      "pointHoverBackgroundColor": "#fff",
      "pointHoverBorderColor": "rgb(255, 99, 132)"
    },
    {
      "label": "My Second Dataset",
      "data": [28, 48, 40, 19, 96, 27, 100],
      "fill": true,
      "backgroundColor": "rgba(54, 162, 235, 0.2)",
      "borderColor": "rgb(54, 162, 235)",
      "pointBackgroundColor": "rgb(54, 162, 235)",
      "pointBorderColor": "#fff",
      "pointHoverBackgroundColor": "#fff",
      "pointHoverBorderColor": "rgb(54, 162, 235)"
    }]
  },
  "options": {
    "elements": {
      "line": {
        "borderWidth": 3
      }
    }
  }
}
```

::: details CODE
~~~md
```chart
{
  "type": "polarArea",
  "data": {
    "labels": [
      "Red",
      "Green",
      "Yellow",
      "Grey",
      "Blue"
    ],
    "datasets": [{
      "label": "Polar Area Dataset",
      "data": [11, 16, 7, 3, 14],
      "backgroundColor": [
        "rgb(255, 99, 132)",
        "rgb(75, 192, 192)",
        "rgb(255, 205, 86)",
        "rgb(201, 203, 207)",
        "rgb(54, 162, 235)"
      ]
    }]
  },
  "options": {}
}
```
~~~
:::

## 기본 사용법 - Scatter

```chart
{
  "type": "scatter",
  "data": {
    "datasets": [{
      "label": "Scatter Dataset",
      "data": [{
        "x": -10,
        "y": 0
      }, {
        "x": 0,
        "y": 10
      }, {
        "x": 10,
        "y": 5
      }, {
        "x": 0.5,
        "y": 5.5
      }],
      "backgroundColor": "rgb(255, 99, 132)"
    }]
  },
  "options": {
    "scales": {
      "x": {
        "type": "linear",
        "position": "bottom"
      }
    }
  }
}
```

::: details CODE
~~~md
```chart
{
  "type": "scatter",
  "data": {
    "datasets": [{
      "label": "Scatter Dataset",
      "data": [{
        "x": -10,
        "y": 0
      }, {
        "x": 0,
        "y": 10
      }, {
        "x": 10,
        "y": 5
      }, {
        "x": 0.5,
        "y": 5.5
      }],
      "backgroundColor": "rgb(255, 99, 132)"
    }]
  },
  "options": {
    "scales": {
      "x": {
        "type": "linear",
        "position": "bottom"
      }
    }
  }
}
```
~~~
:::