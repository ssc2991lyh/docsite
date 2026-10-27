# 快速开始

这个站是 VitePress 搭的。所有内容都是 `docs/` 目录下的 Markdown 文件，文件路径就是网址路径。

## 目录长这样

```
~/my-docs/
├── package.json           # 依赖和 npm 命令
├── node_modules/
└── docs/
    ├── index.md           # 首页（layout: home）
    ├── public/            # 静态资源，原样复制到站点根目录
    │   ├── logo.svg
    │   └── favicon.svg
    ├── guide/             # 「指南」分区
    │   ├── index.md       #   → /guide/
    │   ├── writing.md     #   → /guide/writing
    │   └── deploy.md      #   → /guide/deploy
    ├── notes/             # 「笔记」分区
    │   └── index.md
    └── .vitepress/
        ├── config.ts      # 全站配置（导航、侧边栏、搜索、页脚…）
        └── dist/          # build 产物，别手动改
```

## 三个命令

| 命令 | 干什么 | 什么时候用 |
| --- | --- | --- |
| `npm run dev` | 启动开发服务器（含热更新） | 平时写东西 |
| `npm run build` | 构建静态文件到 `docs/.vitepress/dist` | 要部署上线时 |
| `npm run preview` | 预览 build 出来的结果 | 上线前最后确认 |

`dev` 和 `preview` 都监听了 `0.0.0.0`，同局域网的设备能直接打开，方便手机上看效果。

## 加一个新页面

只有两步：

**① 建文件** `docs/notes/第一次笔记.md`：

```md
# 第一次笔记

随便写点什么。
```

**② 登记侧边栏** —— 打开 `docs/.vitepress/config.ts`，在 `sidebar` 的 `/notes/` 数组里加一行：

```ts
{ text: '第一次笔记', link: '/notes/第一次笔记' }
```

不加第二步也能访问（`/notes/第一次笔记`），只是侧边栏里没有入口。

## 改站名和标题

都在 `docs/.vitepress/config.ts` 顶部：

```ts
title: '我的文档',        // 站名，显示在左上角和浏览器标签
description: '…',         // 搜索摘要和 SEO 用
themeConfig: {
  siteTitle: '我的文档',  // 导航栏显示的名字
  logo: '/logo.svg'       // public/ 下的图片
}
```

## 中文搜索能用吗

能。用的是 VitePress 内置的本地搜索（`search.provider: 'local'`），构建时会把全文索引打进前端，**不需要服务器、不需要联网、不需要买 Algolia**。英文和中文都支持。
