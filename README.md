# docsite

个人文档站，基于 [VitePress](https://vitepress.dev) 构建。

- **在线**：<https://docs.20100205.xyz>
- **部署**：107 服务器，systemd 托管 `vitepress preview`，端口 5173
- **内容**：`docs/` 目录下的 Markdown，改完重启服务即自动重新构建

## 特性

- 本地全文搜索（纯前端，无需第三方服务）
- Mermaid 图表、MathJax 数学公式
- 图片点击放大、代码行号、亮暗双主题
- 页面底部显示「最后更新于」（读 git 提交时间）

## 本地开发

```bash
npm install
npm run dev     # 开发服务器，热更新（5174）
npm run build   # 构建静态文件到 docs/.vitepress/dist
```

## 目录

```
docs/
├── index.md              首页
├── guide/                使用指南
├── notes/                笔记
└── .vitepress/
    ├── config.ts          全站配置
    └── theme/index.ts     自定义主题
```
