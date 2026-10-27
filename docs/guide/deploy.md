# 部署与维护

## 它现在怎么跑的

**不是** nginx 挂静态文件，而是一个 **systemd 常驻的 preview server**，监听 `0.0.0.0:5173`：

```
http://192.168.10.107:5173
```

对外通过 frp + nginx 暴露成 **<https://docs.20100205.xyz>**。

两个 systemd 单元配合：

| 单元 | 作用 |
| --- | --- |
| `my-docs.service` | `ExecStartPre` 先构建，再跑 `vitepress preview`（端口 5173） |
| `docs-sync.timer` | 每 5 分钟检查 GitHub 有没有新提交，有就拉取 + 重启发布 |

两个都 `enabled`，开机自启。

## 内容怎么更新

### 方式一：在 GitHub 网页上改（推荐）

点页面底部的「在 GitHub 上编辑此页」，改完 commit 即可。**5 分钟内**自动同步到线上，不用做任何事。

想立刻生效就手动催一下：

```bash
sudo systemctl start docs-sync.service
journalctl -u docs-sync -n 20      # 看它干了什么
```

### 方式二：在 107 上直接改

```bash
cd ~/my-docs
vim docs/notes/某篇.md
git add -A && git commit -m "更新 xx"
sudo systemctl restart my-docs      # 重启时才构建
```

注意 107 上**没有配 GitHub 推送凭据**，所以 commit 只留在本地，推不上去。要推得用 `scripts/push_via_api.py`（走 API，绕过 git 协议）。

### 方式三：在本地改再同步

```bash
bash scripts/sync_docs.sh     # 在 Agent_Desktop 里跑：pull + 重启发布
```

## 自动同步是怎么做到的

`~/docs-sync.sh` 每 5 分钟跑一次，逻辑很短：

```bash
git fetch origin            # 走代理
若 HEAD != origin/main:
    git merge --ff-only origin/main
    sudo -n systemctl restart my-docs     # restart 的 ExecStartPre 会构建
    轮询探测 200，确认发布成功
```

几个关键设计：

::: tip 为什么必须 restart，不能只 build
`vitepress preview` 底层是 `sirv`，它**启动时就把 dist 目录索引缓存住了**。新增或删除页面后，光重新构建没用——文件在磁盘上是对的，但 server 的索引里没有，访问直接 404。必须重启才认新文件。

（这一点 2026-10-27 实测确认过：build 后新页面 404，restart 后立刻 200。）
:::

::: tip 为什么只 restart 不单独 build
`my-docs.service` 的 `ExecStartPre` 已经包了构建，所以 restart 一次就是「构建 + 发布」。如果脚本里自己再 build 一遍，等于白跑一次 11 秒。
:::

::: tip sudo 只开了一个口子
`/etc/sudoers.d/docs-sync` 里只有一条：

```
mulq ALL=(root) NOPASSWD: /usr/bin/systemctl restart my-docs
```

只允许免密重启这一个服务，不是 `NOPASSWD: ALL`。改之前务必 `visudo -c` 校验，语法错了 sudo 会整个失效。
:::

### GitHub 访问靠内网代理

`github.com:443` 在 107 上直连不通，仓库级已配：

```bash
git config http.proxy  http://192.168.10.110:65533
git config https.proxy http://192.168.10.110:65533
```

代理在 `192.168.10.110:65533`（跑 MC 那台）。**注意不是 7890/7897 那些常规端口**，别猜错了。

拉取只需要这个代理；**推送还需要凭据**（107 上没有 GitHub token），所以自动同步是**单向的**：GitHub → 107。

## 服务管理

```bash
systemctl status my-docs
sudo systemctl restart my-docs      # 重新构建 + 发布
journalctl -u my-docs -f            # 实时日志

systemctl status docs-sync.timer
sudo systemctl start docs-sync.service    # 立即同步一次
journalctl -u docs-sync -n 50
```

unit 源文件备份在家目录：`~/my-docs.service`、`~/docs-sync.service`、`~/docs-sync.timer`、`~/docs-sync.sh`。

改完 unit 要重装：

```bash
sudo install -m 644 ~/docs-sync.service /etc/systemd/system/
sudo systemctl daemon-reload
```

## 构建静态站（想换回静态托管时用）

```bash
cd ~/my-docs
npm run build      # 约 11 秒
```

产物在 `docs/.vitepress/dist/`，**4.9M**。

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

页面底部的更新时间读的是 **git 提交时间**。所以：

- 在 GitHub 上改 → commit 时间自动更新 ✓
- 在 107 上改但没 commit → 内容变了，日期不动

## 常见问题

::: warning 改了内容但线上没变
1. `journalctl -u docs-sync -n 20` 看有没有拉到
2. 确认 GitHub 上的 commit 真的成功了
3. 手动 `sudo systemctl start docs-sync.service`

如果日志显示「拉取失败」，是代理挂了：`curl -x http://192.168.10.110:65533 -I https://github.com/`
:::

::: warning 新增页面 404，但文件明明在
就是 sirv 的目录索引缓存。`sudo systemctl restart my-docs`。
:::

::: warning 打不开 / 连接被拒
```bash
systemctl status my-docs
journalctl -u my-docs -n 50
ss -tlnp | grep 5173
```
:::

::: warning 端口冲突想换
改 unit 里的 `--port 5173`，`daemon-reload` + `restart`。`config.ts` 里的 `sitemap.hostname` 也要跟着改，frp 那边的映射更要改。
:::

::: warning Mermaid 图不显示
Mermaid 是客户端渲染，等 JS 加载完。一直不显示就看浏览器控制台——多半是图表语法错了。
:::

## 备份

`node_modules/` 不用备份。只备源码：

```bash
mkdir -p ~/backup
tar -czf ~/backup/my-docs-$(date +%F).tar.gz -C ~ \
  --exclude=my-docs/node_modules \
  --exclude=my-docs/docs/.vitepress/dist \
  --exclude=my-docs/docs/.vitepress/cache \
  my-docs
```

内容同时也在 GitHub 上：<https://github.com/ssc2991lyh/docsite>
