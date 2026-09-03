import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "_site");
const errors = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const requiredFiles = ["index.html", "articles/index.html", "feed.xml", "sitemap.xml", "robots.txt", "llms.txt", "404.html"];
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`构建产物缺少 ${file}`);
}

const htmlFiles = walk(root).filter(file => file.endsWith(".html"));

function resolveLocal(file, value) {
  const clean = value.split("#")[0].split("?")[0];
  if (!clean) return null;
  const target = clean.startsWith("/")
    ? path.join(root, clean.slice(1))
    : path.resolve(path.dirname(file), clean);
  if (clean.endsWith("/")) return path.join(target, "index.html");
  return path.extname(target) ? target : path.join(target, "index.html");
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const canonicalCount = (html.match(/<link\s+rel="canonical"/gi) || []).length;
  if (h1Count !== 1) errors.push(`${file}: 应有一个 h1，实际 ${h1Count}`);
  if (canonicalCount !== 1) errors.push(`${file}: 应有一个 canonical，实际 ${canonicalCount}`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) errors.push(`${file}: 缺少页面摘要`);
  if (/href\s*=\s*["']#["']/i.test(html)) errors.push(`${file}: 存在 href="#" 占位链接`);
  if (/<(?:video|audio)\b[^>]*\bautoplay\b/i.test(html)) errors.push(`${file}: 媒体不能自动播放`);
  for (const match of html.matchAll(/\b(href|src)="([^"]+)"/gi)) {
    const [, attribute, value] = match;
    if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(value)) continue;
    const target = resolveLocal(file, value);
    if (target && !fs.existsSync(target)) errors.push(`${file}: ${attribute} 指向不存在的文件 ${value}`);
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${file}: JSON-LD 无法解析（${error.message}）`);
    }
  }
}

const sitemap = fs.existsSync(path.join(root, "sitemap.xml")) ? fs.readFileSync(path.join(root, "sitemap.xml"), "utf8") : "";
const feed = fs.existsSync(path.join(root, "feed.xml")) ? fs.readFileSync(path.join(root, "feed.xml"), "utf8") : "";
if (/\/preview\//.test(sitemap) || /\/preview\//.test(feed)) errors.push("草稿预览进入了 Sitemap 或 RSS");
if (!/OAI-SearchBot/.test(fs.readFileSync(path.join(root, "robots.txt"), "utf8"))) errors.push("robots.txt 缺少 OAI-SearchBot 规则");
const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sourceArticlesRoot = path.resolve(import.meta.dirname, "..", "src", "articles");
const publicArticles = walk(sourceArticlesRoot)
  .filter(file => file.endsWith("index.11tydata.json"))
  .map(file => JSON.parse(fs.readFileSync(file, "utf8")))
  .filter(article => {
    const publishedAt = new Date(article.publishedAt);
    return (article.status === "published" || article.status === "archived" || article.status === "scheduled")
      && !Number.isNaN(publishedAt.valueOf())
      && publishedAt <= new Date();
  })
  .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

if (publicArticles.length) {
  const expectedLeadUrl = `/articles/${publicArticles[0].slug}/`;
  const heroMatch = homepage.match(/<a class="hero-link" href="([^"]+)">/);
  if (heroMatch?.[1] !== expectedLeadUrl) {
    errors.push(`首页主文应指向最新文章 ${expectedLeadUrl}，实际为 ${heroMatch?.[1] || "未找到"}`);
  }
  if (!homepage.includes(`<h1 id="hero-title">${publicArticles[0].title}</h1>`)) {
    errors.push(`首页 Hero 标题没有同步最新文章：${publicArticles[0].title}`);
  }
  if (!homepage.includes(publicArticles[0].description)) {
    errors.push(`首页 Hero 摘要没有同步最新文章：${expectedLeadUrl}`);
  }

  const latestSection = homepage.match(/<div class="story-list">([\s\S]*?)<\/div>\s*<\/section>/)?.[1] || "";
  for (const article of publicArticles.slice(0, 3)) {
    const articleUrl = `/articles/${article.slug}/`;
    if (!latestSection.includes(`href="${articleUrl}"`)) {
      errors.push(`首页“最近的长篇记录”缺少 ${articleUrl}`);
    }
  }
}
for (const label of ["X · @smardio", "TikTok · @smardio", "小红书 · 麥客不停", "微博 · 麥客不停", "视频号 · Mo麥AI"]) {
  if (!homepage.includes(label)) errors.push(`首页页脚缺少账号：${label}`);
}
if (/youtube\.com|YouTube ·/i.test(homepage)) errors.push("YouTube 当前应保持关闭");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`输出检查通过：${htmlFiles.length} 个 HTML 页面。`);
