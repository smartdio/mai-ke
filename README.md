# MAI Unstoppable

<p align="center">
  <a href="https://mai-ke.vercel.app/" aria-label="访问 MAI Unstoppable 网站">
    <img src="./assets/brand/mai-avatar-logo-color-circle.png" alt="麥客不停 / MAI Unstoppable Logo" width="160">
  </a>
</p>

**麥客不停 / MAI Unstoppable** 是麥客的个人静态长文网站，记录一人公司、AI Agent、真实项目与长期创作。

网站以 HTML 发布图文和富媒体内容，支持中英文阅读，也便于搜索引擎与 AI 检索。

访问：[mai-ke.vercel.app](https://mai-ke.vercel.app/)

## 本地运行

```bash
npm ci
npm run dev
```

本地地址：`http://localhost:4180/`

## 新建与发布文章

```bash
npm run article:new -- --slug article-slug --lang zh-CN --title "文章标题"
npm run article:publish -- --slug article-slug
```

发布脚本会自动更新首页、文章列表、RSS 和 Sitemap，并运行完整检查。

详细写作说明见[内容编写与发布规范](./docs/CONTENT-AUTHORING.md)。

## 媒体账号

- [X · @smardio](https://x.com/smardio)
- [TikTok · @smardio](https://www.tiktok.com/@smardio)
- [小红书 · 麥客不停](https://www.xiaohongshu.com/user/profile/6702de81000000001b039e14)
- [微博 · 麥客不停](https://weibo.com/u/1656042251)
- 视频号 · Mo麥AI（微信内搜索）

## 项目文档

- [整体方案](./docs/PROJECT-PLAN.md)
- [视觉与排版设计](./docs/VISUAL-DESIGN.md)
- [技术设计](./docs/TECHNICAL-DESIGN.md)
