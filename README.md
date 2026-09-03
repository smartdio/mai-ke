# MAI Unstoppable

<p align="center">
  <a href="https://mai-ke.vercel.app/" aria-label="访问 MAI Unstoppable 网站">
    <img src="./assets/brand/mai-avatar-logo-color-circle.png" alt="麥客不停 / MAI Unstoppable Logo" width="160">
  </a>
</p>
**麥客不停 / MAI Unstoppable** 是一个以静态 HTML 为核心的个人长文出版网站，用于持续发布关于一人公司、AI Agent、真实项目和长期创作的现场记录。

海外主站：[mai-ke.vercel.app](https://mai-ke.vercel.app/)

当前版本已经具备正式内容生产与发布所需的基础能力。海外站部署在 Vercel；国内镜像将在后续使用独立域名和国内可访问的静态托管服务。

## 关注麥客

- [X · @smardio](https://x.com/smardio)
- [TikTok · @smardio](https://www.tiktok.com/@smardio)
- [小红书 · 麥客不停](https://www.xiaohongshu.com/user/profile/6702de81000000001b039e14)
- [微博 · 麥客不停](https://weibo.com/u/1656042251)
- 视频号 · Mo麥AI（微信内搜索）

## 项目目标

- 让每篇文章都以完整、可长期保存的 HTML 文档发布，而不是依赖 Markdown 运行时或客户端渲染。
- 同时服务普通读者、搜索引擎和 AI 检索系统，兼顾 SEO 与 GEO。
- 支持中文、英文以及同一文章的双语关联。
- 支持图文、图集、站内视频、音频和延迟加载的外部媒体。
- 使用同一份内容源构建海外主站与未来的国内镜像。
- 保持内容创建流程简单，让新增文章不需要重复修改导航、列表、RSS 或 Sitemap。

## 设计方向

网站采用当代独立出版物式的视觉语言，重点突出文字排版与阅读节奏：

- 朴素、简洁，保留纸张和印刷物的秩序感。
- 使用少量水彩、淡彩与纯色色面营造背景，不依赖频繁更换的大幅插画。
- 正文、图片和嵌入媒体遵守统一的内容宽度。
- 中英文使用相互协调的衬线与无衬线字体，并全部从站内加载。
- 页面只保留必要的字号层级、分隔和装饰。

完整视觉规范见 [`docs/VISUAL-DESIGN.md`](./docs/VISUAL-DESIGN.md)。

## 技术结构

- [Eleventy](https://www.11ty.dev/)：静态页面生成、文章集合与模板组合。
- Nunjucks：共享布局、页眉、页脚及结构化数据组件。
- Eleventy Image：构建时生成 AVIF、WebP 和原始格式的响应式图片。
- Fontsource：自托管中英文字体，避免页面依赖外部字体服务。
- HTML Validate：检查生成页面的 HTML 结构。
- Vercel：当前海外生产环境。
- GitHub Actions：每次推送或 Pull Request 自动执行完整验证。

网站不依赖 SPA 框架。构建结果是可直接托管的静态 HTML、CSS、JavaScript 与媒体文件。

## 快速开始

环境要求：Node.js 22 或更高版本、npm。

```bash
npm ci
npm run dev
```

本地预览地址：`http://localhost:4180/`

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run article:new -- --slug article-slug --lang zh-CN --title "文章标题"` | 创建一篇草稿文章 |
| `npm run check:content` | 检查文章元数据和媒体引用 |
| `npm run build` | 生成生产静态文件 |
| `npm run check:html` | 检查生成后的 HTML |
| `npm run check:output` | 检查链接、结构化数据、Feed 和 Sitemap |
| `npm test` | 依次执行全部内容检查、构建和输出验证 |

生产文件输出到 `_site/`，该目录由构建生成，不提交到 Git。

## 创建与发布文章

创建中文草稿：

```bash
npm run article:new -- \
  --slug rebuilding-a-school-from-memory \
  --lang zh-CN \
  --title "我怎样与 Agent 一起，把一座记忆中的学校重新建起来"
```

每篇文章使用独立目录：

```text
src/articles/<slug>/
├── index.html
├── index.11tydata.json
└── media/
```

- `index.html`：正文，只编写文章内容区域，不重复页眉、页脚或 `<h1>`。
- `index.11tydata.json`：标题、摘要、日期、作者、语言、封面、系列及发布状态。
- `media/`：该文章专属的图片、视频、音频和附件。

完成正文后：

1. 将元数据中的 `status` 从 `draft` 改为 `published`。
2. 运行 `npm test`。
3. 检查本地预览中的桌面端与移动端阅读效果。
4. 提交并推送，或使用 Vercel CLI 发布生产版本。

草稿不会进入首页文章列表、RSS 或 Sitemap。详细 HTML、图片、视频、音频和双语写法见 [`docs/CONTENT-AUTHORING.md`](./docs/CONTENT-AUTHORING.md)。

## HTML 与媒体

正文直接使用语义化 HTML，可按文章需要组合：

- 标题、段落、引用、列表、脚注和代码。
- 单图、带说明的 `<figure>`、连续图集和响应式图片。
- 站内 `<video>` 与 `<audio>`。
- 点击后才加载的外部视频、地图或其他嵌入内容。
- 下载附件或指向相关项目的普通链接。

文章媒体默认与正文目录一起管理。未来国内镜像可以通过集中配置替换海外媒体地址，无须复制文章正文。

## 中英文内容

每种语言都是一个独立、可索引的 HTML 页面。相关译文通过相同的 `translationKey` 建立关联，为生成对应的语言入口和 `hreflang` 提供依据。每个版本分别维护：

- `lang`
- 标题与摘要
- 页面地址
- canonical URL

没有完成的译文不会生成空页面，也不会把自动翻译内容伪装成正式版本。

## SEO 与 GEO

构建过程会生成或检查：

- 页面标题、描述和 canonical URL。
- Open Graph 等分享元数据。
- Article JSON-LD 结构化数据。
- 语义化标题层级和每页唯一的 `<h1>`。
- `sitemap.xml`、`robots.txt` 和 RSS Feed。
- 面向 AI 检索入口的 `llms.txt`。
- 作者、发布日期、更新时间、系列和媒体信息。
- 草稿隔离、站内链接和资源路径有效性。

GEO 不通过堆砌关键词实现，而依靠清楚的文章结构、可引用的事实段落、明确的作者与日期、稳定 URL，以及可解析的结构化数据。

## 项目目录

```text
website/
├── .github/workflows/     # GitHub 自动验证
├── assets/                # 原始品牌与美术资产
├── design-preview/        # 已保留的视觉原型
├── docs/                  # 方案、技术、视觉与编写规范
├── marketing/             # 与网站相关的传播物料
├── scripts/               # 新建文章与质量检查脚本
├── src/
│   ├── _data/             # 站点、作者、系列、项目和媒体配置
│   ├── _includes/         # 共享组件与页面布局
│   ├── articles/          # 正式文章
│   ├── assets/            # 进入生产站点的样式、脚本与资源
│   ├── projects/          # 项目页面
│   └── series/            # 系列页面
├── eleventy.config.js
├── package.json
└── vercel.json
```

## 集中配置

以下常用信息只需要修改一处：

- `src/_data/site.js`：品牌名称、站点描述、域名和区域。
- `src/_data/authors.json`：作者资料。
- `src/_data/socialLinks.json`：页脚媒体账号。
- `src/_data/series.json`：文章系列。
- `src/_data/projects.json`：相关项目。
- `src/_data/media.json`：跨区域媒体地址。

## 部署

Vercel 项目名为 `mai-ke`，构建配置已经写入 `vercel.json`：

- Build Command：`npm run test`
- Output Directory：`_site`
- Framework Preset：Other

生产环境使用以下变量：

| 变量 | 说明 |
| --- | --- |
| `SITE_ORIGIN` | 当前部署对外提供服务的站点地址 |
| `CANONICAL_ORIGIN` | 搜索引擎应采用的主站地址 |
| `MIRROR_ORIGIN` | 另一地区镜像地址，可以为空 |
| `DEPLOY_REGION` | `global` 或 `cn` |

在 Vercel 未显式设置 `SITE_ORIGIN` 时，构建会读取 Vercel 提供的生产域名。本地和其他平台可参考 `.env.example` 配置。

当前海外主站使用：

```text
SITE_ORIGIN=https://mai-ke.vercel.app
CANONICAL_ORIGIN=https://mai-ke.vercel.app
DEPLOY_REGION=global
```

## Git 与 GitHub

本目录是独立 Git 仓库，默认分支为 `main`。

应提交：

- 网站源文件和文章内容。
- 品牌、文章与传播所需的正式媒体资源。
- 设计与内容规范。
- `package.json` 和 `package-lock.json`。
- 构建、验证和部署配置。

不会提交：

- `node_modules/`
- `_site/`
- `.vercel/`
- `.env`、`.env.local` 等本地环境文件
- 缓存、日志和编辑器临时文件

`.github/workflows/validate.yml` 会在推送到 `main`、创建 Pull Request 或手动触发时运行 `npm ci` 和 `npm test`。任何 Vercel 登录令牌或平台凭据都只保存在本地忽略文件或部署平台后台。

## 相关文档

- [整体方案](./docs/PROJECT-PLAN.md)
- [技术设计](./docs/TECHNICAL-DESIGN.md)
- [视觉与排版设计](./docs/VISUAL-DESIGN.md)
- [内容编写与发布规范](./docs/CONTENT-AUTHORING.md)

## 当前状态

- [x] 视觉骨架与响应式页面
- [x] HTML 长文内容模型
- [x] 图片优化与富媒体支持
- [x] SEO、结构化数据、RSS、Sitemap 和 `llms.txt`
- [x] 海外 Vercel 生产部署
- [x] Git 仓库与 GitHub 自动验证配置
- [ ] 创建并连接 GitHub 远程仓库
- [ ] 配置正式独立域名
- [ ] 建立国内镜像部署
