const region = process.env.DEPLOY_REGION === "cn" ? "cn" : "global";
const vercelOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "";
const siteOrigin = process.env.SITE_ORIGIN || vercelOrigin || "http://localhost:4180";
const canonicalOrigin = process.env.CANONICAL_ORIGIN || siteOrigin;

export default {
  name: "MAI Unstoppable",
  nameZh: "麥客不停",
  tagline: "麥客不停，创作不止。Never stop creating.",
  description: "关于一人公司、AI Agent、真实项目与长期创作的现场记录。",
  lang: "zh-CN",
  locale: "zh-CN",
  origin: siteOrigin,
  canonicalOrigin,
  mirrorOrigin: process.env.MIRROR_ORIGIN || "",
  region,
  buildYear: new Date().getFullYear()
};
