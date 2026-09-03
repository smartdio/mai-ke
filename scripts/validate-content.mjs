import fs from "node:fs";
import path from "node:path";

const articlesRoot = path.resolve(import.meta.dirname, "..", "src", "articles");
const required = ["title", "description", "slug", "lang", "publishedAt", "updatedAt", "authorId", "status"];
const allowedStatuses = new Set(["draft", "scheduled", "published", "archived"]);
const errors = [];
const seenSlugs = new Set();

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const dataFiles = walk(articlesRoot).filter(file => file.endsWith("index.11tydata.json"));
for (const dataFile of dataFiles) {
  const folder = path.dirname(dataFile);
  const bodyFile = path.join(folder, "index.html");
  let data;
  try {
    data = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch (error) {
    errors.push(`${dataFile}: 元数据不是有效 JSON（${error.message}）`);
    continue;
  }

  for (const field of required) {
    if (data[field] === undefined || data[field] === "") errors.push(`${dataFile}: 缺少 ${field}`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug || "")) errors.push(`${dataFile}: slug 格式错误`);
  if (seenSlugs.has(data.slug)) errors.push(`${dataFile}: slug 重复：${data.slug}`);
  seenSlugs.add(data.slug);
  if (path.basename(folder) !== data.slug) errors.push(`${dataFile}: 目录名必须与 slug 一致`);
  if (!allowedStatuses.has(data.status)) errors.push(`${dataFile}: status 不受支持`);
  for (const field of ["publishedAt", "updatedAt"]) {
    if (Number.isNaN(new Date(data[field]).valueOf())) errors.push(`${dataFile}: ${field} 不是有效日期`);
  }
  if (!fs.existsSync(bodyFile)) {
    errors.push(`${folder}: 缺少 index.html`);
    continue;
  }

  const html = fs.readFileSync(bodyFile, "utf8");
  if (/<h1[\s>]/i.test(html)) errors.push(`${bodyFile}: 正文不能包含 h1`);
  if (/href\s*=\s*["']#["']/i.test(html)) errors.push(`${bodyFile}: 存在 href="#" 占位链接`);
  if (/<(?:video|audio)\b[^>]*\bautoplay\b/i.test(html)) errors.push(`${bodyFile}: 媒体不能自动播放`);
  for (const tag of html.match(/<img\b[^>]*>/gi) || []) {
    for (const attr of ["src", "alt", "width", "height"]) {
      if (!new RegExp(`\\b${attr}\\s*=`, "i").test(tag)) errors.push(`${bodyFile}: img 缺少 ${attr}`);
    }
  }
  for (const tag of html.match(/<iframe\b[^>]*>/gi) || []) {
    for (const attr of ["src", "title", "loading"]) {
      if (!new RegExp(`\\b${attr}\\s*=`, "i").test(tag)) errors.push(`${bodyFile}: iframe 缺少 ${attr}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`内容检查通过：${dataFiles.length} 篇文章。`);
