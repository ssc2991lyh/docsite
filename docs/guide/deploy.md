# 部署与维护

## 日常写作流程

```bash
cd ~/my-docs
npm run dev
```

终端会打印一个 `http://localhost:5173/` 的地址。因为监听的是 `0.0.0.0`，同局域网的其他设备（手机、另一台电脑）用 `http://192.168.10.107:5173/` 也能打开，方便看手机端效果。

改 `docs/` 下的文件保存，浏览器自动刷新，不用重启。

写完按 `Ctrl+C` 停掉。

## 构建上线

```bash
cd ~/my-docs
npm run build
```

产物在 `docs/.vitepress/dist/`，就是纯静态 HTML/CSS/JS，没有任何后端依赖。

**注意**：配置里开了 `cleanUrls: true`，意思是 `/guide/writing.html` 会以 `/guide/writing` 的形式对外。所以用 nginx 托管时要加 `try_files`，否则二级页面会 404：

```nginx
location / {
    root /home/mulq/my-docs/docs/.vitepress/dist;
    try_files $uri $uri.html $uri/ =404;
}
```

不想折腾 nginx 也行，直接用 VitePress 自带的预览服务器：

```bash
npm run preview   # 默认 http://0.0.0.0:4173
```

## 依赖与升级

```bash
npm outdated              # 看哪些包有新版本
npm install vitepress@latest vue@latest
npm run build             # 升完一定重新构建验证
```

npm 源已经指向中科大镜像（`npmreg.proxy.ustclug.org`），国内拉包不慢。

## 常见问题

::: warning 页面 404
大概率是 `cleanUrls` 和 nginx 的 `try_files` 没对上。要么加 `try_files`，要么把 `config.ts` 里的 `cleanUrls` 改成 `false`。
:::

::: warning 搜不到中文内容
本地搜索的索引是**构建时**生成的。`npm run dev` 下搜索的是实时内容；但如果线上搜不到新写的词，说明没重新 `build`。
:::

::: warning 侧边栏没有新页面
新加的 `.md` 不会自动进侧边栏，得手动在 `config.ts` 的 `sidebar` 里登记（见[快速开始](/guide/#加一个新页面)）。
:::

## 备份

站点内容全在 `docs/` 里，`node_modules/` 不用备份（重装即可）。最简单的备份：

```bash
tar -czf ~/backup/my-docs-$(date +%F).tar.gz -C ~ my-docs --exclude=node_modules --exclude=.vitepress/dist --exclude=.vitepress/cache
```
