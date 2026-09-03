# 落地页 Landing Page

## 状态
**P1 — 框架已完成，待填充真实二维码**

## 文件
- `index.html` — 单页落地页（响应式，暗色主题）

## 设计说明
- 纯 HTML + CSS，无外部依赖
- 响应式布局（桌面 800px / 移动 100%）
- 配色与品牌一致：深底 `#101010` + 奶白 `#fffaf0` + 品牌红 `#e60012`
- 三栏服务介绍 + 近期作品 + CTA 二维码区

## 待办
- [ ] 替换 QR 占位为真实微信/企微二维码图片
- [ ] 部署到域名（待定：mai.always-on.com 或类似）
- [ ] 添加 SEO meta 标签（如需公开索引）
- [ ] 可选：添加英文版 toggle

## 使用方式
本地预览：
```bash
cd ~/agent-workspace/media/projects/mai-unstoppable/website/marketing/conversion/landing-page
open index.html
```

部署后 URL 将用于：
- 各平台简介链接
- 海报二维码跳转目标
- 私信自动回复引导
