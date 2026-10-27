# 图表与公式

这一页的东西全靠插件撑着，但用起来就是普通代码块和 `$` 符号。

## Mermaid 图表

写一个 ` ```mermaid ` 代码块就行。暗色模式下会自动换成深色配色。

### 流程图

```mermaid
flowchart LR
  A[写 Markdown] --> B{保存}
  B -->|dev 模式| C[浏览器自动刷新]
  B -->|build| D[生成静态文件]
  D --> E[nginx / 任意静态服务器]
  C --> F[本地看看效果]
```

````md
```mermaid
flowchart LR
  A[写 Markdown] --> B{保存}
  B -->|dev 模式| C[浏览器自动刷新]
  B -->|build| D[生成静态文件]
```
````

### 时序图

```mermaid
sequenceDiagram
  autonumber
  participant U as 你
  participant V as VitePress
  participant B as 浏览器
  U->>V: 保存 .md 文件
  V->>B: HMR 推送变更
  B-->>U: 页面已刷新（不丢滚动位置）
  Note over V,B: 全程不到 1 秒
```

### 状态图

```mermaid
stateDiagram-v2
  [*] --> 草稿
  草稿 --> 审阅: 提交
  审阅 --> 草稿: 打回
  审阅 --> 发布: 通过
  发布 --> 归档: 过期
  归档 --> [*]
```

### 甘特图

```mermaid
gantt
  title 文档站建设
  dateFormat YYYY-MM-DD
  section 基建
  装依赖         :done, a1, 2026-10-26, 1d
  配置与内容     :done, a2, 2026-10-27, 1d
  section 增强
  图表与公式     :active, b1, 2026-10-27, 1d
  常驻服务       :b2, after b1, 1d
```

### 饼图

```mermaid
pie showData
  title 时间都花哪了
  "查文档" : 40
  "改配置" : 25
  "写内容" : 30
  "调样式" : 5
```

### 类图 / 思维导图也能画

```mermaid
classDiagram
  class 文档站 {
    +docs/
    +config.ts
    +build()
    +dev()
  }
  class 页面 {
    +title
    +正文
  }
  文档站 "1" --> "*" 页面
```

::: tip 画图语法速查
Mermaid 官方文档：[mermaid.js.org/intro/syntax-reference](https://mermaid.js.org/intro/syntax-reference.html)。左边选图类型，右边就有可跑的示例。
:::

## 数学公式

用 `markdown: { math: true }`，底层是 MathJax。

**行内**：质能方程 $E = mc^2$，欧拉恒等式 $e^{i\pi} + 1 = 0$。

**块级**（前后各空一行、用两个 `$`）：

$$
\int_{-\infty}^{+\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n
$$

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t}
\end{aligned}
$$

::: warning 别乱用美元符号
`math: true` 打开后，正文里成对出现的 `$` 会被当成公式起点。写价钱之类的内容要在 `$` 前加反斜杠转义：`\$100`。
:::

## 图片点击放大

正文里的图片点一下会浮到中间看大图（medium-zoom）。不想让某张图放大，给它加 `no-zoom` class。

![站点 Logo](/logo.svg)
