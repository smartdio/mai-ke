import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const readArg = name => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
};

const slug = readArg("slug");
const requestedAt = readArg("at");

if (!slug) {
  console.error("缺少 --slug，例如：npm run article:publish -- --slug my-new-article");
  process.exit(1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("slug 只能使用小写字母、数字和连字符。");
  process.exit(1);
}

const projectRoot = path.resolve(import.meta.dirname, "..");
const metadataFile = path.join(projectRoot, "src", "articles", slug, "index.11tydata.json");
const bodyFile = path.join(projectRoot, "src", "articles", slug, "index.html");

if (!fs.existsSync(metadataFile) || !fs.existsSync(bodyFile)) {
  console.error(`找不到完整的文章目录：src/articles/${slug}/`);
  process.exit(1);
}

const originalSource = fs.readFileSync(metadataFile, "utf8");
let metadata;
try {
  metadata = JSON.parse(originalSource);
} catch (error) {
  console.error(`文章元数据不是有效 JSON：${error.message}`);
  process.exit(1);
}

if (metadata.slug !== slug) {
  console.error(`元数据 slug（${metadata.slug}）与目录名（${slug}）不一致。`);
  process.exit(1);
}
if (metadata.status === "published") {
  console.error("这篇文章已经发布；如需修订，请编辑内容后运行 npm test，再按常规部署流程更新。");
  process.exit(1);
}
if (!new Set(["draft", "scheduled"]).has(metadata.status)) {
  console.error(`只有 draft 或 scheduled 文章可以通过此脚本发布，当前状态为 ${metadata.status}。`);
  process.exit(1);
}

const publishedAt = requestedAt ? new Date(requestedAt) : new Date();
if (Number.isNaN(publishedAt.valueOf())) {
  console.error("--at 必须是有效的 ISO 日期时间。");
  process.exit(1);
}
if (publishedAt > new Date()) {
  console.error("article:publish 不能使用未来时间；定时文章请保留 scheduled 状态。");
  process.exit(1);
}

const timestamp = publishedAt.toISOString();
metadata.status = "published";
metadata.publishedAt = timestamp;
metadata.updatedAt = timestamp;

fs.writeFileSync(metadataFile, `${JSON.stringify(metadata, null, 2)}\n`);

try {
  execFileSync("npm", ["test"], { cwd: projectRoot, stdio: "inherit" });

  const homepage = fs.readFileSync(path.join(projectRoot, "_site", "index.html"), "utf8");
  const articleUrl = `/articles/${slug}/`;
  const heroMatch = homepage.match(/<a class="hero-link" href="([^"]+)">/);
  const storyListMatch = homepage.match(/<div class="story-list">([\s\S]*?)<\/div>\s*<\/section>/);

  if (heroMatch?.[1] !== articleUrl) {
    throw new Error(`首页主文没有指向新文章（实际为 ${heroMatch?.[1] || "未找到"}）`);
  }
  if (!homepage.includes(`<h1 id="hero-title">${metadata.title}</h1>`)) {
    throw new Error("首页 Hero 标题没有更新为新文章标题");
  }
  if (!homepage.includes(metadata.description)) {
    throw new Error("首页 Hero 摘要没有更新为新文章摘要");
  }
  if (!storyListMatch?.[1].includes(`href="${articleUrl}"`)) {
    throw new Error("首页“最近的长篇记录”没有出现新文章");
  }

  console.log(`发布准备完成：${metadata.title}`);
  console.log(`首页主文：${articleUrl}`);
  console.log("首页 Hero、文章列表、RSS、Sitemap 与结构化数据已重新生成并通过检查。");
} catch (error) {
  fs.writeFileSync(metadataFile, originalSource);
  try {
    execFileSync("npm", ["run", "build"], { cwd: projectRoot, stdio: "ignore" });
  } catch {
    // 保留最初的检查错误；源码元数据已经恢复，后续可单独排查构建问题。
  }
  console.error("发布检查失败，文章元数据已恢复为发布前状态。");
  console.error(error.message);
  process.exit(1);
}
