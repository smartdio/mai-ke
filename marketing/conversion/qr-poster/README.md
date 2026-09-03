# QR 扫码海报

> 用途：漫画每集末尾 + 各平台封面 + 公众号菜单 + 私域入口
> 规格：竖版 1080×1440（漫画末尾）+ 方形 1080×1080（公众号封面/朋友圈）

---

## 文件清单

| 文件 | 用途 |
|------|------|
| `qr-poster-vertical-1080x1440.html` | 漫画末尾 / 封面页 / 落地页主视觉 |
| `qr-poster-square-1080x1080.html` | 公众号封面图 / 朋友圈分享 / 视频号封面 |
| `README.md` | 本文件 |
| `swap-qrcode-instructions.md` | 替换二维码的具体步骤 |

---

## 设计要点

- **主色调**：近黑 `#101010` + 纸白 `#fffaf0` + 品牌红 `#e60012`
- **字体**：Noto Sans SC 900（中文标题）+ Inter ExtraBold（英文 kicker）
- **构图**：顶部 Logo → 主标题（钩子句）→ QR 卡片 → 底部 Slogan
- **钩子句**：「看完这一集 / 想看更多？」（在漫画末尾用）
- **CTA**：「扫码关注「麥客不停」」（明确转化动作）

---

## 当前状态

⚠️ **二维码是占位符，需要 Master 提供**

- 需要的二维码类型（Master 二选一）：
  - 个人微信（加好友）
  - 企业微信（客户群）
  - 公众号关注二维码
  - 微信群入群二维码
- 建议规格：480×480 像素以上，白底，无边框
- 文件命名建议：`qrcode-wechat.jpg` 或 `qrcode-official.jpg`

---

## 替换步骤

### 方法一：替换 HTML 中的 img 标签（推荐）

1. 把真实二维码图片放到同目录下，命名为 `qrcode.jpg`
2. 编辑 `qr-poster-vertical-1080x1440.html`
3. 找到这段：
   ```html
   <!-- ⬇️ 替换为真实二维码图片路径 -->
   <!-- <img src="qrcode.jpg" alt="QR Code" /> -->
   <div class="qr-placeholder">...</div>
   ```
4. 删除占位符 `<div class="qr-placeholder">...</div>`
5. 取消 `<img>` 注释
6. 同样操作 `qr-poster-square-1080x1080.html`
7. 用 Chrome 打开 → 截图 → 导出 PNG

### 方法二：先截图后替换图片（更快）

1. 用 Chrome 打开 HTML → 全页截图 → 保存 PNG
2. 用 Photoshop / Figma / 预览打开 PNG
3. 把占位符区域替换为真实二维码
4. 导出 PNG

---

## 配套素材

- 头像：`brand/platforms/standard/avatar-color-circle-512.png`（圆形彩色版）
- 横幅：`brand/platforms/standard/lockup-en-color-1920x400.png`
- 配色：近黑 `#101010` / 纸白 `#fffaf0` / 品牌红 `#e60012` / 品牌黄 `#ffcf00`
