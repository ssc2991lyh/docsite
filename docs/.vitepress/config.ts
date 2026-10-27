import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(
  defineConfig({
    // ---------- 基础信息 ----------
    lang: 'zh-CN',
    title: '我的文档',
    description: '基于 VitePress 的个人文档站',
    cleanUrls: true, // 去掉 URL 里的 .html，nginx 需要配 try_files

    // ---------- 头部注入 ----------
    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      ['meta', { name: 'theme-color', content: '#3451b2' }],
      ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:locale', content: 'zh_CN' }]
    ],

    // ---------- Markdown 渲染 ----------
    markdown: {
      lineNumbers: true, // 代码块显示行号
      image: { lazyLoading: true },
      math: true, // KaTeX/MathJax 公式：$...$ 与 $$...$$
      config: (md) => {
        // 需要自定义 markdown-it 插件时在这里 md.use(...)
      }
    },

    // ---------- 构建 ----------
    srcExclude: ['**/README.md', '**/TODO.md'],
    // 静态站点地图（有正式域名后把 hostname 换掉）
    sitemap: { hostname: 'http://192.168.10.107:5173' },

    // ---------- Vite ----------
    vite: {
      // mermaid 单个 chunk 就有 1MB+，把告警阈值调高免得刷屏
      build: { chunkSizeWarningLimit: 1600 },
      // 允许任意 Host 访问 dev server（以后用 frp 域名反代时 Vite 默认会拦）
      server: { allowedHosts: true }
    },

    // ---------- 主题 ----------
    themeConfig: {
      logo: '/logo.svg',
      siteTitle: '我的文档',

      // 顶部导航
      nav: [
        { text: '首页', link: '/' },
        { text: '指南', link: '/guide/', activeMatch: '/guide/' },
        { text: '笔记', link: '/notes/', activeMatch: '/notes/' }
      ],

      // 侧边栏（按路径前缀匹配）
      sidebar: {
        '/guide/': [
          {
            text: '使用指南',
            items: [
              { text: '快速开始', link: '/guide/' },
              { text: '写作指南', link: '/guide/writing' },
              { text: '图表与公式', link: '/guide/diagrams' },
              { text: '部署与维护', link: '/guide/deploy' }
            ]
          }
        ],
        '/notes/': [
          {
            text: '笔记',
            items: [{ text: '总览', link: '/notes/' }]
          }
        ]
      },

      // 本地全文搜索（纯前端，不依赖第三方）
      search: {
        provider: 'local',
        options: {
          translations: {
            button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
            modal: {
              noResultsText: '没有找到结果',
              resetButtonTitle: '清除查询',
              footer: {
                selectText: '选择',
                navigateText: '切换',
                closeText: '关闭'
              }
            }
          }
        }
      },

      // 右侧大纲
      outline: { level: [2, 3], label: '本页目录' },

      // 页脚翻页
      docFooter: { prev: '上一篇', next: '下一篇' },

      // 最后更新时间（读 git 提交时间，需 my-docs 是 git 仓库）
      lastUpdated: {
        text: '最后更新于',
        formatOptions: { dateStyle: 'short', timeStyle: 'short' }
      },

      // 「在 GitHub 上编辑此页」按钮
      // ⚠️ 仓库推上 GitHub 之前，这个链接点了会 404
      editLink: {
        pattern: 'https://github.com/ssc2991lyh/my-docs/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页'
      },

      // 界面文案汉化
      darkModeSwitchLabel: '外观',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
      sidebarMenuLabel: '目录',
      returnToTopLabel: '回到顶部',
      externalLinkIcon: true,

      // 页脚
      footer: {
        message: '用 Markdown 写的，慢慢长大。',
        copyright: 'Copyright © 2026 my-docs'
      }
    },

    // ---------- Mermaid 图表 ----------
    mermaid: {
      // 这里传给 mermaid.initialize()，写法见 https://mermaid.js.org/config/schema-docs/config.html
      flowchart: { curve: 'basis', useMaxWidth: true },
      sequence: { useMaxWidth: true },
      gantt: { useMaxWidth: true },
      themeVariables: { fontSize: '15px' }
    },
    mermaidPlugin: {
      class: 'mermaid'
    }
  })
)
