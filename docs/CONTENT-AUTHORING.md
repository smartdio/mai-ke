# MAI Unstoppable 长文站：内容编写与发布规范

> 文档状态：实施基线 v1.0  
> 更新日期：2026-09-03  
> 关联文档：[整体方案](./PROJECT-PLAN.md) · [技术设计](./TECHNICAL-DESIGN.md) · [视觉设计](./VISUAL-DESIGN.md)

## 1. 目标

发布新文章时，作者只处理一篇文章自己的目录，不手工修改首页、文章列表、RSS、Sitemap、结构化数据、页眉或页脚。

内容仍以 HTML 为主：正文是可迁移、可读的语义化 HTML；Eleventy 只负责把正文装入统一版面、汇总集合、优化资源并生成站点级文件。

第一版不建设在线后台或富文本编辑器，先建立稳定、可版本管理的“文件即内容”流程。

## 2. 一篇文章就是一个文件夹

```text
website/src/articles/
└── rebuilding-a-school-from-memory/
    ├── index.html
    ├── index.11tydata.json
    └── media/
        ├── hero.png
        ├── plan-sketch.jpg
        ├── walkthrough-poster.jpg
        ├── walkthrough.mp4
        └── walkthrough.zh-CN.vtt
```

- `index.html`：只写正文，不重复站点页眉、页脚、标题和文章元信息。
- `index.11tydata.json`：标题、摘要、日期、语言、作者、系列、项目关系和发布状态。
- `media/`：文章独有的图片、视频封面、字幕、音频和下载文件。
- 跨文章复用的品牌资产放在 `src/assets/`，不要复制进每篇文章。
- 已发布文章的 `slug` 和目录名保持稳定；改标题不改 URL。

## 3. 新建与发布文章

基础工程提供文章脚手架：

```bash
npm run article:new -- --slug rebuilding-a-school-from-memory --lang zh-CN
```

命令负责检查 slug、创建正文和元数据模板、建立 `media/` 目录，并把状态默认为 `draft`。常规工作流是：

```text
创建文章
  → 编辑 index.html
  → 把媒体放进 media/
  → 本地预览与单篇检查
  → 将 status 改为 published
  → 提交代码
  → 海外站自动构建发布
  → 国内镜像启用后由同一提交生成第二套产物
```

首页、列表、系列页、项目页、RSS 和 Sitemap 从文章集合自动更新。每次内容发布后，首页的“本期主文”自动切换到最新文章，“最近的长篇记录”同步重排；发布检查必须确认这两个入口均已更新。

## 4. 文章元数据

```json
{
  "title": "我怎样与 Agent 一起，把一座记忆中的学校重新建起来",
  "description": "从一张草图到浏览器里的三维校园：一次关于记忆、验证和人机协作边界的完整记录。",
  "slug": "rebuilding-a-school-from-memory",
  "lang": "zh-CN",
  "translationKey": "rebuilding-a-school-from-memory",
  "publishedAt": "2026-09-03T10:00:00+08:00",
  "updatedAt": "2026-09-03T10:00:00+08:00",
  "authorId": "mai",
  "status": "draft",
  "featured": false,
  "seriesId": "from-memory-to-campus",
  "seriesOrder": 1,
  "projectIds": ["4lite"],
  "tags": ["AI Agent", "人机协作", "4Lite"],
  "hero": {
    "src": "./media/hero.png",
    "alt": "麥客与多个 Agent 在工作室共同整理校园重建资料",
    "caption": "从资料整理到空间验证，项目在同一张协作桌面上逐步成形。"
  },
  "license": "CC BY 4.0"
}
```

目录级数据统一提供 `layout`、集合标签和 permalink，单篇不重复填写技术字段。

必填字段为 `title`、`description`、`slug`、`lang`、`publishedAt`、`updatedAt`、`authorId` 和 `status`。`translationKey`、系列、项目、标签和首页重点状态按需填写。

## 5. 正文 HTML

文章标题 `<h1>` 由模板生成，正文从导语、段落或 `<h2>` 开始：

```html
<p class="article-lead">
  我最初想做的，并不是一座准确的数字校园。
</p>

<section aria-labelledby="where-it-started">
  <h2 id="where-it-started">事情从哪里开始</h2>
  <p>正文内容。</p>
</section>
```

- 使用稳定、可读的章节 `id`，已发布后尽量不改。
- 不在正文写内联样式、页面级脚本、站点导航或页脚。
- 不为视觉效果跳过标题级别。
- 重要结论写进正文，不只放在图片、视频或交互内容里。
- 长文不显示大纲；章节锚点保留，便于搜索和外部引用直接定位。

## 6. 图片与图集

作者仍然写普通 HTML：

```html
<figure class="media media--image">
  <img
    src="./media/plan-sketch.jpg"
    alt="手绘校园平面草图，标出了教学楼、操场和校门的大致关系"
    width="1800"
    height="1200"
    loading="lazy"
    decoding="async"
    eleventy:widths="640,960,1320"
    sizes="(max-width: 720px) calc(100vw - 40px), 1100px"
  >
  <figcaption>最初的草图记录的是空间关系，不是精确比例。</figcaption>
</figure>
```

构建阶段自动生成多种宽度与格式，作者不手工导出三套图片。头图由元数据和模板生成，不在正文重复插入；头图不延迟加载，正文图片默认延迟加载。

每张信息图片必须有准确的 alt；图注说明图片与论述的关系。所有图片和插图限定在文章版心内，不向两侧任意出血。截图必须裁去私人信息、账号和无关界面。

只有图片之间存在对照关系时才使用图集：

```html
<div class="media-gallery media-gallery--two" role="list" aria-label="校园模型前后对照">
  <figure class="media" role="listitem">…</figure>
  <figure class="media" role="listitem">…</figure>
</div>
```

移动端自动回到单列。图集不使用自动轮播；以后如加入灯箱，也必须保证关闭 JavaScript 后图片仍可查看。

## 7. 视频

### 7.1 站内视频

短片或必须保证跨平台访问的视频使用原生 `<video>`：

```html
<figure class="media media--video">
  <video controls playsinline preload="metadata" poster="./media/walkthrough-poster.jpg">
    <source src="./media/walkthrough.mp4" type="video/mp4">
    <track kind="captions" src="./media/walkthrough.zh-CN.vtt" srclang="zh-CN" label="中文" default>
    <p><a href="./media/walkthrough.mp4">下载或打开视频</a></p>
  </video>
  <figcaption>在浏览器中从校门走到操场的早期验证版本。</figcaption>
</figure>

<details class="media-transcript">
  <summary>阅读视频文字稿</summary>
  <div>……</div>
</details>
```

- 不自动播放；使用 `preload="metadata"`，不在打开页面时下载完整视频。
- 必须有封面、说明和字幕；有口述内容时提供 HTML 文字稿。
- 站内视频的主要信息也必须在正文或文字稿中出现。
- 较大的视频文件不进入普通 Git 历史，由媒体发布脚本上传到区域媒体存储。

### 7.2 外部平台视频

YouTube、Bilibili 等第三方视频默认采用“本地封面 + 标题 + 打开链接”，读者主动点击后才加载 iframe，以减少第三方追踪、首屏重量和网络差异。

每个外部视频必须有本地封面、标题、说明、原平台链接、字幕或文字稿，以及平台不可访问时仍然成立的正文上下文。文章的核心论证不能只存在于一个境外 iframe 中。

## 8. 音频、交互内容和附件

- 音频使用原生 `<audio controls preload="metadata">`，不自动播放；有口述内容时提供文字稿。
- 4Lite 等交互项目先显示本地截图、说明和打开链接；确需内嵌时，iframe 必须有 `title`、固定比例、懒加载、最小 sandbox 权限和失败回退。
- 国内镜像不得依赖只能从海外访问的 iframe 才能理解文章。
- PDF、数据和附件链接标明文件类型与大小。
- 图表同时提供文字结论；数据表优先使用真实 `<table>`。
- 可视化是正文的补充，不代替可被搜索和引用的文本。

## 9. 跨区域媒体

图片、封面、字幕和小型附件随静态站完整部署，海外与国内各有副本。大型视频和音频使用媒体清单登记逻辑 ID，分别配置全球源和国内源：

```json
{
  "campus-walkthrough": {
    "type": "video",
    "poster": "/media/campus-walkthrough/poster.jpg",
    "globalSrc": "https://media-global.example/campus-walkthrough.mp4",
    "cnSrc": "https://media-cn.example/campus-walkthrough.mp4",
    "captions": "/media/campus-walkthrough/zh-CN.vtt"
  }
}
```

构建时根据 `DEPLOY_REGION` 选择来源，正文不维护两份。没有国内来源时，国内构建保留封面、文字稿和外部链接，而不是输出损坏播放器。

## 10. 中英文内容

- 中文和英文是两个独立 HTML 页面，不在客户端即时翻译。
- 两个版本通过相同 `translationKey` 关联。
- 只有另一语言版本真实存在且已发布时，才输出语言切换和 `hreflang`。
- 原文与译文可以有不同的发布日期和更新时间。
- 图片可以共用；alt、图注、字幕和文字稿分别本地化。
- 第一阶段允许只有中文版本，不创建空英文页面。

## 11. 常用内容只改一处

| 内容 | 数据文件 | 行为 |
| --- | --- | --- |
| 品牌名、默认摘要、域名 | `_data/site.js` | 全站标题、SEO 和结构化数据共用 |
| 页眉导航 | `_data/navigation.json` | 首页与内页自动一致 |
| 媒体账号和项目链接 | `_data/socialLinks.json` | `enabled: false` 时不显示；YouTube 第一阶段关闭 |
| 作者资料 | `_data/authors.json` | 作者页、署名和 JSON-LD 共用 |
| 系列与项目 | 各自的数据文件 | 自动生成聚合页和文章关系 |
| 大型媒体 | `_data/media.json` | 根据部署区域解析来源 |

以后接通 YouTube、增加国内域名或修改导航时，只改一个数据项，不逐页替换。

## 12. 发布状态

| 状态 | 本地预览 | 正式页面 | 首页/列表 | RSS/Sitemap |
| --- | --- | --- | --- | --- |
| `draft` | 是 | 否 | 否 | 否 |
| `scheduled` | 是 | 到期后 | 到期后 | 到期后 |
| `published` | 是 | 是 | 是 | 是 |
| `archived` | 是 | 是 | 默认不突出 | 是 |

首页“本期主文”取 `publishedAt` 最新的已发布内容，确保每次发布都会更新首页；文章列表同样按 `publishedAt` 排序。`featured` 保留作后续专题策展字段，不覆盖最新发布入口；系列按 `seriesOrder` 排序。

## 13. 自动检查

`npm test` 至少检查：

- 必填元数据完整，slug、translationKey 和 URL 不冲突。
- 正文没有额外 H1，标题级别合理。
- 图片、视频封面、字幕和附件路径存在。
- 图片有 alt、宽高和正确的加载策略。
- video/audio 有 controls 且没有 autoplay。
- iframe 有 title、loading、允许的 provider 和回退。
- 外链安全属性正确，没有 `href="#"` 占位链接。
- 草稿不进入列表、RSS 和 Sitemap。
- Article、VideoObject 等结构化数据与可见内容一致。
- 无 JavaScript 时仍能阅读正文和媒体说明。
- 构建产物没有横向溢出、缺图和失效内链。

## 14. 最小发布操作

对大多数有图有文的文章，只需要：

1. 运行新建文章命令。
2. 在 `index.html` 写正文。
3. 把图片放入 `media/` 并在 HTML 中引用。
4. 填写元数据与图片说明。
5. 本地检查后把 `status` 改为 `published`。

不需要手工制作文章列表卡片或逐处修改首页，但每次发布都必须确认首页已自动换上最新主文并出现新文章；也不需要复制页眉、页脚或单独维护 SEO 文件。
