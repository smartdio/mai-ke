# MAI Unstoppable 长文站：技术设计

> 文档状态：技术基线 v0.2  
> 更新日期：2026-09-03  
> 关联文档：[整体方案](./PROJECT-PLAN.md) · [内容编写与发布规范](./CONTENT-AUTHORING.md) · [视觉设计](./VISUAL-DESIGN.md)

## 1. 技术选型

### 1.1 推荐技术栈

- 静态站点生成器：Eleventy（11ty）
- 模板：Nunjucks
- 正文：HTML
- 图片处理：Eleventy Image 的 HTML Transform
- 样式：原生 CSS，按基础、布局、组件和页面拆分
- 交互：少量渐进增强的原生 JavaScript
- 包管理：npm
- 运行时：构建阶段使用 Node.js 22 或更高版本；线上不需要 Node.js
- 第一阶段托管：Vercel 静态部署
- 第二阶段托管：OSS/COS + CDN

### 1.2 选择 Eleventy 的原因

- 原生接受 HTML 内容，不要求把正文转换为 Markdown 或框架组件。
- 支持布局、集合、模板数据、分页和静态文件复制。
- 构建产物是普通静态目录，没有客户端运行时依赖。
- 适合自动生成文章列表、标签、系列、RSS、Sitemap 和 JSON-LD。
- 容易部署到 Vercel、对象存储或普通 Web 服务器。

### 1.3 不采用 SPA 的原因

- 主要内容不应等待 JavaScript 执行后才出现。
- 每篇文章需要稳定、独立、可直接抓取的 URL。
- 静态 HTML 更容易获得正确状态码、canonical、分享信息和打印表现。
- AI 爬虫、阅读器、归档工具和低性能设备均可直接获得正文。

## 2. 子项目边界

```text
mai-unstoppable/
└── website/
    ├── package.json
    ├── package-lock.json
    ├── eleventy.config.js
    ├── vercel.json
    ├── README.md
    ├── docs/
    ├── scripts/
    ├── src/
    └── _site/
```

`website/` 应自包含。构建和部署不能依赖父目录中的临时文件、未提交素材或绝对路径。

根部 `brand/` 是品牌唯一源。网站开发时直接引用它；部署构建可以把所需文件复制到输出目录，但不得在 `website/src/` 维护可独立修改的品牌副本，也不要用符号链接解决部署问题。

## 3. 建议目录结构

```text
website/
├── docs/
│   ├── PROJECT-PLAN.md
│   └── TECHNICAL-DESIGN.md
├── scripts/
│   ├── new-article.mjs
│   ├── check-article.mjs
│   ├── check-media.mjs
│   ├── validate-content.mjs
│   ├── validate-output.mjs
│   ├── generate-indexnow-payload.mjs
│   └── submit-indexnow.mjs
├── src/
│   ├── _data/
│   │   ├── site.js
│   │   ├── navigation.json
│   │   ├── socialLinks.json
│   │   ├── authors.json
│   │   ├── media.json
│   │   └── build.js
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk
│   │   │   ├── article.njk
│   │   │   ├── series.njk
│   │   │   ├── project.njk
│   │   │   └── page.njk
│   │   └── components/
│   │       ├── document-head.njk
│   │       ├── site-header.njk
│   │       ├── site-footer.njk
│   │       ├── article-card.njk
│   │       ├── media-embed.njk
│   │       ├── breadcrumbs.njk
│   │       ├── region-switcher.njk
│   │       └── structured-data.njk
│   ├── articles/
│   │   ├── articles.11tydata.js
│   │   └── example-article/
│   │       ├── index.html
│   │       ├── index.11tydata.json
│   │       └── media/
│   ├── series/
│   ├── projects/
│   ├── assets/
│   │   ├── brand/
│   │   ├── fonts/
│   │   ├── images/
│   │   ├── styles/
│   │   └── scripts/
│   ├── index.njk
│   ├── articles.njk
│   ├── series.njk
│   ├── projects.njk
│   ├── about.njk
│   ├── feed.njk
│   ├── sitemap.njk
│   ├── robots.njk
│   ├── llms.njk
│   └── 404.njk
├── tests/
│   ├── content/
│   ├── output/
│   └── visual/
├── eleventy.config.js
├── package.json
└── vercel.json
```

## 4. 内容模型

### 4.1 正文文件

正文保存在 `index.html` 中，写语义化 HTML 内容片段，不重复书写站点级 `<html>`、`<head>`、导航和页脚。这些内容由布局统一生成。

`articles.11tydata.js` 统一提供文章布局、集合标签和 permalink，避免每一篇重复维护技术字段。首页、列表、系列、项目、RSS 和 Sitemap 从集合自动生成。

示例：

```html
<p class="article-lead">
  这是一份关于人与 Agent 如何共同完成真实项目的开发记录。
</p>

<section aria-labelledby="origin">
  <h2 id="origin">事情从哪里开始</h2>
  <p>正文内容。</p>
</section>

<figure>
  <img
    src="./images/process.webp"
    alt="项目从草图到浏览器场景的过程"
    width="1600"
    height="900"
    loading="lazy"
  >
  <figcaption>从手绘草图到可行走灰盒的过程。</figcaption>
</figure>
```

文章首张关键图片不应机械地使用延迟加载，避免影响首屏体验和搜索预览。正文后续图片可以使用原生懒加载。

### 4.2 元数据文件

文章元数据保存在相邻的 `index.11tydata.json`：

```json
{
  "layout": "layouts/article.njk",
  "contentType": "article",
  "title": "我怎样用 Agent 重建一座记忆中的学校",
  "subtitle": "从草图、验证到浏览器中的三维校园",
  "description": "一份基于个人记忆、草图和浏览器三维验证的完整开发纪实。",
  "slug": "rebuilding-a-school-from-memory",
  "lang": "zh-CN",
  "publishedAt": "2026-09-02T10:00:00+08:00",
  "updatedAt": "2026-09-02T10:00:00+08:00",
  "authorId": "mai",
  "tags": ["Agent", "独立开发", "4Lite"],
  "seriesId": "from-memory-to-campus",
  "seriesOrder": 1,
  "projectIds": ["4lite"],
  "hero": "./images/cover.webp",
  "status": "published",
  "license": "CC BY 4.0"
}
```

### 4.3 必填字段

- `contentType`
- `title`
- `description`
- `slug`
- `lang`
- `publishedAt`
- `updatedAt`
- `authorId`
- `status`

正式文章还必须有可解析的正文、一个 H1 来源、有效 URL 和至少一个明确的主题归属。

### 4.4 发布状态

| 状态 | 构建页面 | 出现在列表 | 出现在 Sitemap/RSS |
| --- | --- | --- | --- |
| `draft` | 本地可选 | 否 | 否 |
| `scheduled` | 仅到期后 | 到期后 | 到期后 |
| `published` | 是 | 是 | 是 |
| `archived` | 是 | 可选 | 是 |

草稿不能仅靠 CSS 隐藏，必须在生产构建时排除。

## 5. 模板和输出

### 5.1 HTML 文档结构

```html
<!doctype html>
<html lang="zh-CN">
  <head>...</head>
  <body>
    <a class="skip-link" href="#main-content">跳到正文</a>
    <header>...</header>
    <main id="main-content">
      <article>...</article>
    </main>
    <footer>...</footer>
  </body>
</html>
```

文章的核心信息不得通过客户端脚本追加到页面。

### 5.2 URL 规则

- 使用小写拉丁字符和连字符构成 slug。
- 对外 URL 使用目录形式：`/articles/{slug}/`。
- 输出到 `/articles/{slug}/index.html`。
- 已发布 URL 不因标题修改而改变。
- URL 迁移必须提供永久重定向记录。
- 不使用哈希路由承载独立文章或章节。

### 5.3 状态码

- 正式页面：200
- 永久迁移：301 或 308
- 临时迁移：302 或 307
- 不存在页面：真实 404
- 已删除且不会恢复的内容可按需要使用 410

国内对象存储部署时必须验证自定义错误页仍返回 404，不能将全部未知路径重写为返回 200 的首页。

## 6. SEO 设计

### 6.1 文档头部

每个可索引页面在构建期生成：

- `title`
- `meta[name="description"]`
- `meta[name="robots"]`
- `link[rel="canonical"]`
- `link[rel="alternate"]`（仅在真实存在其他语言版本时）
- Open Graph 标记
- X/Twitter Card 标记
- `theme-color`
- favicon 和 Web App 图标

canonical 必须直接存在于原始 HTML 中，不依赖 JavaScript 注入。

### 6.2 HTML 内容规则

- 每页一个 H1。
- H2/H3 不跳级表达视觉大小。
- 重要链接使用描述性锚文本。
- 页面之间使用真实链接，不依赖点击事件导航。
- 图片必须提供宽高，信息图片必须有准确替代文本。
- 图表和截图提供正文解释或图注。
- 时间使用 `<time datetime="...">`。
- 作者链接使用 `rel="author"`。
- 外部引用保留来源名称和链接。

### 6.3 Sitemap 和 Feed

构建时生成：

- `sitemap.xml`
- `feed.xml`

规则：

- 只包括正式可访问 URL。
- 不包含草稿、预览页、重复分页和构建内部路径。
- `lastmod` 来自真实的 `updatedAt`，不在每次构建时全部改成当前时间。
- RSS 包含稳定 GUID、正式 URL、摘要、作者、发布时间和正文或足量内容。

### 6.4 重复内容

- 一篇内容只指定一个正式 canonical。
- 标签页、系列页和文章页承担不同信息目的。
- 系列全文版与章节版并存时，为每个页面明确 canonical 策略。
- 海外与国内镜像的 canonical 通过部署配置产生，不手工改正文。

## 7. 结构化数据

### 7.1 文章页

使用 `Article` 或 `BlogPosting`，包含适用字段：

- `headline`
- `description`
- `image`
- `datePublished`
- `dateModified`
- `author`
- `publisher`
- `mainEntityOfPage`
- `inLanguage`
- `keywords`
- `isPartOf`
- `about`
- `citation`
- `license`

### 7.2 作者页

使用 `Person`：

- 稳定作者 ID 和 URL
- 中文名与英文名
- `sameAs` 外部官方账号
- `worksFor` 或品牌关系（内容真实时才添加）
- 简介和专业领域

### 7.3 品牌与站点

- `Organization`：MAI Unstoppable
- `WebSite`：站点名称、URL 和发布者
- `BreadcrumbList`：文章、系列和项目层级
- `CreativeWork` 或 `SoftwareApplication`：仅在项目页内容符合类型时使用

结构化数据必须与页面可见内容一致，不添加读者在页面上看不到的虚构属性。

## 8. GEO 设计

### 8.1 原则

- 先服务读者，再服务机器。
- 提供可引用的原创事实、过程和判断。
- 让实体、时间、来源和关系表达明确。
- 不制造大量只为覆盖问题关键词的薄内容。
- 不把 GEO 等同于 `llms.txt`。

### 8.2 建议的文章构成

文章按内容需要支持：

1. 准确摘要
2. 背景和问题定义
3. 核心结论或关键发现
4. 过程、证据和失败尝试
5. 明确标注的个人判断
6. 引用来源
7. 修订记录
8. 作者和相关项目

不是每篇文章都必须机械套用相同结构，但所有长文都应让读者和机器容易回答“谁写的、何时写的、讲什么、依据是什么、结论是什么”。

### 8.3 AI 爬虫

第一版 `robots.txt` 的意图：

```text
User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

Sitemap: https://{canonical-host}/sitemap.xml
```

`GPTBot` 控制项不与 `OAI-SearchBot` 共用决定。上线前由站点所有者确认是否授权训练用途。

其他 AI 爬虫只有在核对其官方名称、用途和控制方式后才显式配置。未知爬虫继续受通用规则约束。

### 8.4 `llms.txt`

可在构建阶段生成 `/llms.txt`，内容包括：

- 品牌和站点简介
- 正式文章、系列、项目和作者入口
- RSS、Sitemap 和许可链接
- 海外与国内镜像关系

该文件属于补充性实验，不进入核心验收条件。

## 9. 多区域构建与域名

### 9.1 环境变量

```text
SITE_ORIGIN
CANONICAL_ORIGIN
MIRROR_ORIGIN
DEPLOY_REGION=global|cn
NODE_ENV
```

第一阶段：

```text
SITE_ORIGIN=https://{overseas-domain}
CANONICAL_ORIGIN=https://{overseas-domain}
DEPLOY_REGION=global
```

国内镜像阶段根据搜索策略生成第二套站点级 URL 和镜像入口。

### 9.2 相对资源

- 页面内部链接优先使用根相对路径。
- CSS、脚本、字体和图片不硬编码 Vercel 域名。
- 页面分享到外部时使用构建配置生成绝对 URL。
- 国内站不得从海外域名加载关键页面资源，反之亦然。

### 9.3 构建输出

Eleventy 默认输出到 `_site/`。后期可通过环境变量分别输出：

```text
_site-global/
_site-cn/
```

同一份内容可以根据部署区域生成不同的 canonical、镜像入口、分析配置和搜索验证文件，但正文保持同源。

## 10. 静态资源

### 10.1 图片

- 原始母版与网站派生图分开保存。
- 网站优先使用 WebP/AVIF，并保留必要的兼容格式。
- 生成合理的响应式尺寸。
- 首图和分享图必须有固定宽高。
- 文件名稳定、描述性强，不使用临时导出名称。
- 不在 Git 中提交无用途的超大原始素材。
- 作者在正文中保留普通 `<img>` 或 `<picture>`；构建阶段通过 Eleventy Image HTML Transform 生成多尺寸、多格式输出和 `srcset`。
- 每篇文章的媒体默认与文章同目录，便于移动、归档和检查；跨文章共用资产才进入全站资源目录。
- 构建检查要求 `alt`、宽高和 `sizes`，并区分首图与非首屏图片的加载策略。

### 10.2 视频、音频与外部嵌入

- 站内视频使用原生 `<video>`，必须包含 controls、poster、字幕和回退链接；不允许 autoplay。
- 音频使用原生 `<audio>`，有口述内容时提供 HTML 文字稿。
- 第三方视频默认先显示本地封面和外链，读者点击后再加载 iframe。
- iframe 必须有 title、固定比例、懒加载和最小 sandbox 权限。
- 图片、字幕、封面和小型附件随两套站点独立部署。
- 大型视频和音频通过 `_data/media.json` 使用逻辑 ID 关联全球与国内来源，由 `DEPLOY_REGION` 在构建期选择。
- 媒体来源不可达时，页面必须保留封面、图注、文字稿和直接链接，不输出空白区域。

### 10.3 字体

- 只复制最终使用的字体和字重。
- 保留字体许可证。
- 使用 WOFF2 网站格式。
- 设置合理的 fallback 和 `font-display`。
- 国内与海外部署都使用本站自托管字体，避免第三方字体域名受网络影响。

### 10.4 CSS 与 JavaScript

- CSS 按 token、base、layout、components、utilities 和 pages 组织。
- JavaScript 仅用于阅读进度、主题切换等非核心能力。
- 主要导航和正文链接不依赖 JavaScript。
- 打包后的静态资源使用内容哈希和长缓存。

## 11. 可访问性

- 键盘可访问导航和跳转正文链接。
- 清晰的焦点状态。
- 足够的颜色对比度。
- 尊重 `prefers-reduced-motion`。
- 不以颜色作为唯一信息表达方式。
- 图片替代文本、图注和装饰图策略明确。
- 文章不生成或显示内容大纲；章节锚点在移动端和桌面端均可直接访问。
- HTML 标题、landmark 和表单语义正确。

## 12. 性能目标

第一版目标：

- 主要正文无需 JavaScript 即可呈现。
- 初始页面不加载大型框架运行时。
- 非首屏图片延迟加载。
- 字体子集和字重受到控制。
- CSS 和脚本体积设定构建预算。
- 避免由未知图片尺寸导致布局移动。
- 第三方分析和嵌入不阻塞正文。

第一版内部预算：

- 首屏不加载视频、音频或第三方 iframe 的完整内容。
- 除首图外的正文媒体默认延迟加载。
- 首屏使用到的字体文件总量控制在 300 KB 以内。
- 首图最大派生尺寸的目标体积控制在 500 KB 以内；较小视口必须获得较小派生图。
- 关键 CSS 与渐进增强脚本保持小型、可缓存，不引入客户端框架运行时。
- 单篇文章媒体数量不设机械上限，但首屏下载预算不能随文章总媒体数量增长。

## 13. 构建与质量检查

建议脚本：

```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy",
    "article:new": "node scripts/new-article.mjs",
    "check:article": "node scripts/check-article.mjs",
    "media:check": "node scripts/check-media.mjs",
    "check:content": "node scripts/validate-content.mjs",
    "check:output": "node scripts/validate-output.mjs",
    "test": "npm run check:content && npm run build && npm run check:output"
  }
}
```

### 13.1 内容检查

- 元数据字段完整且类型正确。
- slug 不重复。
- 日期合法。
- 草稿状态正确。
- 引用和图片路径存在。
- 正文不包含完整页面外壳或危险内联脚本。
- 正文不重复输出 H1，文章章节具有稳定 id。
- 媒体替代文本、图注、字幕、播放器属性和 iframe 回退完整。

### 13.2 输出检查

- 每页一个 H1。
- 每页一个 canonical。
- 标题和摘要不为空且不重复。
- 正文存在于最终 HTML。
- 内部链接可达。
- 图片存在且具备必要属性。
- 视频、音频和 iframe 不自动播放，媒体失败时存在文字或链接回退。
- JSON-LD 可解析并与元数据一致。
- Sitemap 和 RSS 中不含草稿。
- 404 页面部署后返回真实 404。
- robots 中的 Sitemap 地址与部署域名一致。

### 13.3 浏览器检查

- 桌面和手机关键页面截图。
- 禁用 JavaScript阅读测试。
- 键盘导航测试。
- 页面打印预览。
- Lighthouse 的性能、可访问性、最佳实践和 SEO 检查。
- Google 富媒体搜索结果测试和 Search Console URL 检查在正式域名上线后执行。

## 14. CI/CD

### 第一阶段

```text
push / pull request
        ↓
npm ci
        ↓
内容检查
        ↓
静态构建
        ↓
输出检查
        ↓
Vercel Preview 或 Production
```

### 第二阶段

在同一提交通过检查后：

```text
global build → Vercel
cn build     → OSS/COS → CDN cache refresh
```

IndexNow 只提交本次新增、更新或删除的正式 URL。密钥保存在部署平台的 Secret 中，不写入仓库；站点根目录只输出协议要求的验证文件。

## 15. 安全与隐私

- 第一版没有数据库和登录面，减少攻击面。
- 构建时对内容元数据和允许的 HTML 用法进行检查。
- 不在公开仓库保存云服务密钥、分析密钥之外的敏感信息或私人素材。
- 外部嵌入使用最少权限，并评估跟踪和 Cookie 影响。
- 如启用评论或表单，另行设计垃圾信息、隐私和内容安全策略。

## 16. 已确认的视觉工程约束

- 以现有 `design-preview` 为实现基线，不重新发明另一套页面骨架。
- 共享 CSS token 管理颜色、三个主要字号层级、版心和间距。
- 首页与内页只维护一个站头、一个页脚组件。
- 固定明亮纸面主题，不建立自动深色模式分支。
- 文章为单一阅读轴，不生成大纲组件。
- 图片和视频统一受文章版心约束，`max-inline-size: 100%`，并预留固有比例。
- 页面动效仅用于链接反馈和可选的媒体展开，必须尊重 `prefers-reduced-motion`。
- 社交分享图由单独模板生成，不把标题烧录进正文头图。

## 17. 内容集合与自动页面

Eleventy 建立以下集合：

- `publishedArticles`：已发布且未超过发布时间的文章。
- `featuredArticles`：已发布且 `featured: true` 的文章。
- `articlesByLanguage`：按语言生成列表和 Feed。
- `articlesBySeries`：按 `seriesId` 与 `seriesOrder` 排序。
- `articlesByProject`：按 `projectIds` 汇总到项目页。
- `translations`：按 `translationKey` 关联真实存在的语言版本。

站点页面只消费这些集合，不复制文章摘要或卡片数据。草稿在生产构建阶段彻底排除，而不是通过 CSS 隐藏。

## 18. 集中配置

- `_data/site.js`：品牌、域名、默认 SEO、地区和构建信息。
- `_data/navigation.json`：共享页眉导航。
- `_data/socialLinks.json`：账号、项目链接和 `enabled` 状态；YouTube 第一阶段设为 false。
- `_data/authors.json`：作者页、署名和 Person JSON-LD。
- `_data/media.json`：只登记需要跨区域解析的大型媒体。

模板不得硬编码这些重复信息。以后增加账号、修改页脚、启用国内镜像或连接 YouTube 时，只修改相应数据文件。

## 19. 媒体结构化数据

- 文章基础使用 `Article` 或 `BlogPosting`。
- 有主视频时增加 `VideoObject`，包含真实可见的标题、说明、封面、上传日期、时长，以及适用的 `contentUrl` 或 `embedUrl`。
- 有主音频时使用适当的 `AudioObject` 信息。
- 图像、视频和音频结构化数据必须与页面实际可访问内容一致。
- 字幕和文字稿作为 HTML 内容参与索引；不把结构化数据当作不可见关键词容器。

## 20. 实施顺序

1. 建立 Eleventy 骨架、共享数据和设计 token。
2. 把首页原型迁移为真实首页模板。
3. 把文章原型迁移为文章布局，并迁移一篇真实文章验证。
4. 建立自动集合、列表、系列、项目、关于和 404 页面。
5. 加入文章脚手架、HTML 内容检查和图片自动处理。
6. 加入视频、音频、外部嵌入及区域媒体解析。
7. 生成 SEO、GEO、RSS、Sitemap、robots 和分享信息。
8. 完成响应式、无 JavaScript、打印、性能与可访问性验证。
9. 部署海外主站；国内镜像作为同一构建系统的第二目标接入。
