---
layout: home

hero:
  name: 我的文档
  text: 随手记，慢慢长
  tagline: 纯 Markdown 写作，改完保存就刷新。没有后台、没有数据库，构建出来就是一堆静态文件。
  image:
    src: /logo.svg
    alt: 我的文档
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/
    - theme: alt
      text: 写作指南
      link: /guide/writing

features:
  - icon: ✍️
    title: 纯 Markdown
    details: 一个 .md 文件就是一页，不用碰 HTML，也不用记命令。
  - icon: ⚡
    title: 秒级热更新
    details: dev 模式下改哪个文件，浏览器就刷哪个页面。
  - icon: 🔍
    title: 本地全文搜索
    details: 内置离线搜索，不依赖 Algolia 之类的第三方服务，断网也能用。
  - icon: 🌙
    title: 亮暗双主题
    details: 跟随系统自动切换，也能在右上角手动点。
  - icon: 📦
    title: 一键构建
    details: npm run build 产出静态站点，扔到任何 Web 服务器都能跑。
  - icon: 🧩
    title: 可扩展
    details: 需要特殊 markdown 语法时，挂个 markdown-it 插件就行。
---

## 这个站现在能用了吗

能。服务已经在 `http://192.168.10.107:5173` 常驻跑着（systemd 托管，开机自启），`docs/` 下新增 `.md` 文件就会自动变成一个页面。

改完保存，浏览器自己刷新，不用 build：

```bash
cd ~/my-docs
npm run dev     # 平时不用手动跑，服务已经在 5173 常驻
npm run build   # 想导出静态文件时用，产物在 docs/.vitepress/dist
```

想加新页面，两个动作：**建文件 + 登记侧边栏**（在 `docs/.vitepress/config.ts` 的 `sidebar` 里加一行）。

