# 落地承接点物料 Conversion Materials

> 用途：读者看完漫画内容后的下一步引导——扫码、关注、联系
> 创建：2026-06-24
> 维护人：K2SO

---

## 目录结构

```
conversion/
├── qr-poster/              # P0 二维码海报（漫画结尾/封面用）
├── personal-poster/        # P0 个人品牌海报（平台简介/置顶用）
├── bios/                   # P0 11 平台统一简介话术
├── landing-page/           # P1 单页落地页（框架已建）
└── _previews/              # 所有海报 PNG 预览图
```

---

## P0 物料清单（Day 1 发布前必须完成）

### 1. 二维码海报 `qr-poster/`
**用途**：漫画每集结尾 + 封面图，引导读者扫码关注

**文件**：
- `qr-poster-vertical-1080x1440.html` — 竖版（抖音/小红书/B站）
- `qr-poster-square-1080x1080.html` — 方版（公众号/微博）
- `README.md` — 使用说明

**状态**：✅ 设计完成，待替换真实二维码

**预览**：
- `_previews/qr-vertical-v1.png` (1080×1440)
- `_previews/qr-square-v1.png` (1080×1080)

**下一步**：
- [ ] Master 提供微信/企微二维码图片
- [ ] 替换 HTML 中的 `<img src="qrcode.jpg">` 占位
- [ ] 重新渲染 PNG 成品

---

### 2. 个人品牌海报 `personal-poster/`
**用途**：各平台简介配图 + 置顶帖，展示主理人形象

**文件**：
- `personal-poster-vertical-1080x1440.html` — 竖版（照片占位）
- `personal-poster-square-1080x1080.html` — 方版（照片占位）
- `personal-poster-vertical-illustration.html` — 竖版（Mai 插画版）
- `personal-poster-square-illustration.html` — 方版（Mai 插画版）
- `mai-portrait-illustration.png` — Mai 角色设定图（原图）
- `mai-portrait-illustration-600.png` — 裁切为 600×600 头像用

**状态**：✅ 设计完成，两种版本可选

**预览**：
- `_previews/personal-vertical-v1.png` — 照片占位版
- `_previews/personal-vertical-illustration.png` — 插画版
- `_previews/personal-square-v1.png` — 方版照片占位
- `_previews/personal-square-illustration.png` — 方版插画

**选择**：
- **照片版**：等 Master 提供真实照片，替换 `<img src="portrait.jpg">`
- **插画版**：直接用 Mai 角色设定，已就绪

**下一步**：
- [ ] Master 确认用照片还是插画（或两者都出）
- [ ] 如用照片，提供后替换 HTML 并重新渲染
- [ ] 替换二维码占位

---

### 3. 平台简介话术 `bios/`
**用途**：11 个账号的简介统一引导语，含转化钩子

**文件**：
- `bios.md` — 主文档（含各平台字数限制 + 定制版本）
- `domestic-one-liners.md` — 国内 6 平台一句话版本
- `overseas-one-liners.md` — 海外 5 平台一句话版本（英文）

**状态**：✅ 已完成

**内容**：
- 中文主版本（200 字内，可裁剪）
- 小红书 / 微博 / 抖音 / B站 / 公众号 各 50-80 字定制版
- 英文主版本 + Instagram / Twitter / YouTube / LinkedIn / TikTok 定制版
- 头像 / 背景图建议

---

## P1 物料（Phase 1 期间完成）

### 4. 单页落地页 `landing-page/`
**用途**：各平台简介链接 + 私信引导 + 二维码跳转目标

**文件**：
- `index.html` — 单页响应式落地页
- `README.md` — 使用说明

**状态**：✅ 框架完成，待部署

**内容**：
- 品牌头部（mai always on / 麥客不停）
- 三项服务介绍（AI 漫画 / IP 平台化 / 工作流自动化）
- 近期作品展示
- CTA 二维码区（占位）

**下一步**：
- [ ] Master 确认域名（mai.always-on.com 或类似）
- [ ] 部署到服务器（GitHub Pages / Vercel / 自有服务器）
- [ ] 替换二维码占位
- [ ] 更新各平台简介链接指向此页

---

## P2 物料（Phase 2 期间完成）

### 5. 微信群 / 私域入口
**用途**：AI 内容创作者社群，深度转化

**状态**：⏸️ 待 Master 创建群并提供二维码

**下一步**：
- [ ] Master 创建微信群
- [ ] 设计群二维码海报
- [ ] 在落地页添加社群入口

---

## 依赖项（需 Master 输入）

| 物料 | 依赖 | 状态 |
|---|---|---|
| 二维码海报 | 微信/企微二维码图片 | ⏳ 待提供 |
| 个人海报（照片版） | Master 真实照片 | ⏳ 待提供 |
| 个人海报（插画版） | 已就绪（Mai 角色设定） | ✅ 可用 |
| 落地页 | 域名 + 服务器 | ⏳ 待确认 |
| 微信群 | 群二维码 | ⏳ 待创建 |

---

## 快速预览所有 PNG

```bash
cd ~/agent-workspace/media/projects/mai-unstoppable/website/marketing/conversion/_previews
open *.png
```

---

## 品牌一致性

所有物料遵循 `brand/README.md` 与 `brand/guidelines/visual-identity.html` 规范：
- 配色：深底 `#101010` + 奶白 `#fffaf0` + 品牌红 `#e60012`
- 字体：Noto Sans SC（中文）+ Inter（英文）
- Logo：`brand/logos/avatars/mai-avatar-logo-monochrome-circle.png`
