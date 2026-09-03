import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const readArg = name => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
};

const slug = readArg("slug");
const lang = readArg("lang") || "zh-CN";
const title = readArg("title") || "新文章标题";
const dryRun = args.includes("--dry-run");

if (!slug) {
  console.error("缺少 --slug，例如：npm run article:new -- --slug my-new-article");
  process.exit(1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("slug 只能使用小写字母、数字和连字符。");
  process.exit(1);
}
if (!["zh-CN", "en"].includes(lang)) {
  console.error("第一版支持的 lang 为 zh-CN 或 en。");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..", "src", "articles", slug);
if (fs.existsSync(root)) {
  console.error(`文章目录已经存在：${root}`);
  process.exit(1);
}

const now = new Date().toISOString();
const metadata = {
  title,
  description: "请用一两句话准确概括文章内容。",
  slug,
  lang,
  translationKey: slug,
  publishedAt: now,
  updatedAt: now,
  authorId: "mai",
  status: "draft",
  featured: false,
  readingMinutes: 1,
  projectIds: [],
  tags: [],
  license: "CC BY 4.0"
};
const body = `<p class="lead">请在这里写文章导语。</p>\n\n<section aria-labelledby="first-section">\n  <h2 id="first-section" data-index="Section 01">第一个章节</h2>\n  <p>请在这里写正文。</p>\n</section>\n`;

if (dryRun) {
  console.log(JSON.stringify({ root, metadata }, null, 2));
  process.exit(0);
}

fs.mkdirSync(path.join(root, "media"), { recursive: true });
fs.writeFileSync(path.join(root, "index.html"), body);
fs.writeFileSync(path.join(root, "index.11tydata.json"), `${JSON.stringify(metadata, null, 2)}\n`);
console.log(`已创建：${root}`);
console.log(`本地预览：/preview/${slug}/`);
console.log(`完成内容后发布：npm run article:publish -- --slug ${slug}`);
