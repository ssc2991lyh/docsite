# 部署与维护

## 它现在怎么跑的

**不是** nginx 挂静态文件，而是一个 **systemd 常驻的 dev server**，监听 `0.0.0.0:5173`：

```
http://192.168.10.107:5173
```

这样做的原因：改完 `.md` 保存，浏览器立刻刷新，**不用手动 build**。适合天天写东西的场景。

代价是它按开发模式跑（内存约 175MB），并且 `sitemap.xml` 之类只在 build 时才生成。

## 服务管理

开机自启已经开好了（`enabled`），服务器重启会自动拉起。

```bash
systemctl status my-docs      # 看状态
sudo systemctl restart my-docs
sudo systemctl stop my-docs
sudo systemctl start my-docs
journalctl -u my-docs -f      # 实时日志
journalctl -u my-docs -n 50   # 最近 50 行
```

- unit 文件：`/etc/systemd/system/my-docs.service`
- 源文件备份：`~/my-docs.service`（改完要 `sudo install -m 644 ~/my-docs.service /etc/systemd/system/ && sudo systemctl daemon-reload`）
- 跑的身份：`mulq`，工作目录 `/home/mulq/my-docs`，直接调 `node_modules/vitepress/bin/vitepress.js`（绕开 npm，方便 systemd 管进程）

::: tip 为什么不写 `npm run dev`
systemd 的 PATH 很干净，而且 npm 只是中间层——它再 fork 一个 node。直接调 vitepress 的入口脚本，systemd 杀掉主进程就等于关掉整个服务，不会留孤儿进程。
:::

## 改了 config.ts 之后

VitePress 会监听配置文件变化并自动重启 dev server，一般等几秒就好。没反应就手动来一下：

```bash
sudo systemctl restart my-docs
```

## 装了新依赖之后

dev server 需要在启动时预构建依赖，装完必须重启：

```bash
npm i -D 某个包
sudo systemctl restart my-docs
```

不重启的话会报 `Failed to resolve dependency` 或者页面白屏。

## 构建静态站（想换回静态托管时用）

```bash
cd ~/my-docs
npm run build      # 约 10 秒（装了 mermaid 后比裸站慢）
```

产物在 `docs/.vitepress/dist/`，**4.9M**。里面是纯 HTML/CSS/JS，扔到任何静态服务器都能跑。

::: warning cleanUrls 的坑
配置开了 `cleanUrls: true`，网址是 `/guide/writing` 而不是 `/guide/writing.html`。用 nginx 托管必须加 `try_files`，否则二级页面全 404：

```nginx
location / {
    root /home/mulq/my-docs/docs/.vitepress/dist;
    try_files $uri $uri.html $uri/ =404;
}
```
:::

## git 与「最后更新于」

`~/my-docs` 是个 git 仓库，**只为了让页面底部显示更新时间**（VitePress 读的是 git 提交时间）。

所以：改了内容想让时间更新，得提交一次。

```bash
cd ~/my-docs
git add -A
git commit -m "更新 xx 笔记"
```

不提交的话，页面底部显示的还是上一次提交的时间——内容其实已经是最新的，只是日期不动。介意的话就顺手 commit。

::: tip 配置了 git 身份
提交时用的是 `-c user.name=mulq -c user.email=mulq@192.168.10.107` 这种临时指定。想一劳永逸：

```bash
git config user.name mulq
git config user.email mulq@192.168.10.107
```
:::

## 常见问题

::: warning 打不开 / 连接被拒
```bash
systemctl status my-docs
journalctl -u my-docs -n 50
```
端口被别的进程占了也会这样：`ss -tlnp | grep 5173`。
:::

::: warning 端口冲突了想换
改 unit 里的 `--port 5173`，然后 `daemon-reload` + `restart`。注意 `config.ts` 里的 `sitemap.hostname` 也要跟着改。
:::

::: warning 用 curl 看页面是空的
dev 模式返回的是 SPA 外壳，正文由浏览器里的 JS 渲染，所以 `curl` 抓不到内容（`<title>` 都是空的）。这是正常的，用浏览器打开就行。想看 SSR 出来的真实 HTML，用 `npm run build` 后的 `dist/`。
:::

::: warning Mermaid 图不显示
Mermaid 也是客户端渲染，必须等 JS 加载完。如果一直不显示，按 F12 看控制台有没有 mermaid 解析错误——多半是图表语法写错了（比如中文括号、箭头方向写反）。
:::

## 备份

`node_modules/` 不用备份，重装即可。只备源码和内容：

```bash
mkdir -p ~/backup
tar -czf ~/backup/my-docs-$(date +%F).tar.gz -C ~ \
  --exclude=my-docs/node_modules \
  --exclude=my-docs/docs/.vitepress/dist \
  --exclude=my-docs/docs/.vitepress/cache \
  my-docs
```
