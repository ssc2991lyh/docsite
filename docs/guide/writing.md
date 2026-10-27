# 写作指南

常用的语法都在这页，直接抄。

## 基础语法

```md
# 一级标题（页面里一般只用 frontmatter 的 title，正文从二级开始）
## 二级标题 → 会出现在右侧大纲
### 三级标题 → 也会

**加粗**  *斜体*  ~~删除线~~  `行内代码`

[站内链接](/guide/deploy) · [外链](https://vitepress.dev)

- 无序列表
  - 可以嵌套
1. 有序列表
```

## 提示框

四种颜色，写文档很好用：

::: tip 小提示
默认标题是「TIP」，可以自己改。
:::

::: info 说明
中性的补充信息。
:::

::: warning 注意
容易踩坑的地方。
:::

::: danger 危险
会造成数据丢失的操作。
:::

语法（`title` 可省略）：

```md
::: tip 小提示
默认标题是「TIP」，可以自己改。
:::
```

也可以做成折叠的：

::: details 点开看更多（默认是收起的）
藏在里面的内容。
:::

```md
::: details 点开看更多（默认是收起的）
藏在里面的内容。
:::
```

## 代码块

带语言标注就有高亮，行号是开着的（`markdown.lineNumbers: true`）：

```js
function hello(name) {
  return `你好，${name}`
}
```

想高亮某几行，在语言后面加 `{行号}`：

```js{2}
const a = 1
const b = 2   // 这一行会被高亮
const c = 3
```

多个标签页切换，用 `code-group`：

::: code-group

```bash [npm]
npm run dev
```

```bash [pnpm]
pnpm dev
```

```bash [yarn]
yarn dev
```

:::

## 表格

| 语法 | 效果 | 备注 |
| --- | --- | --- |
| `**粗**` | **粗** | |
| `*斜*` | *斜* | |
| `` `码` `` | `码` | 行内代码 |
| `[文字](链接)` | 超链接 | |

对齐用冒号：`| :--- | :---: | ---: |` 分别是左、中、右。

## 图片

放 `docs/public/` 下的图片，用绝对路径引用（构建时会原样搬到站点根目录）：

```md
![描述](/logo.svg)
```

放在 `.md` 文件旁边的图片则用相对路径。建议给每张图都写描述，搜索和无障碍都用得上。

## 徽章

<Badge type="tip" text="新版" /> <Badge type="warning" text="实验" /> <Badge type="danger" text="废弃" />

```md
<Badge type="tip" text="新版" />
<Badge type="warning" text="实验" />
<Badge type="danger" text="废弃" />
```

## 页面级 frontmatter

每个 `.md` 文件开头用 `---` 包起来的部分，控制这一页自己的行为：

```yaml
---
title: 页面标题        # 浏览器标签和大纲顶部
description: 页面摘要   # 搜索和 SEO
outline: [2, 3]        # 右侧大纲显示几级标题；写 false 关掉
lastUpdated: false     # 这一页不显示更新时间
sidebar: false         # 这一页不要侧边栏
aside: false           # 这一页不要右侧大纲
editLink: false        # 不显示「编辑此页」
---
```

首页那个 `layout: home` 也是 frontmatter——它让 VitePress 用首页模板（hero + features）渲染，而不是普通文档页。

## 目录层级建议

内容多了以后按「分区/主题」分文件夹，每个文件夹一个 `index.md` 当入口，侧边栏在 `config.ts` 里按路径前缀分组。别把所有文件都堆在 `docs/` 根目录——搜起来费劲，侧边栏也会变得很长。
