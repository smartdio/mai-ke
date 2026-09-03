import rssPlugin from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const buildNow = new Date();
const publishingTimeZone = "Asia/Shanghai";

function isPublished(item) {
  const status = item.data.status;
  if (status === "archived") return true;
  if (status !== "published" && status !== "scheduled") return false;
  const publishedAt = new Date(item.data.publishedAt);
  return !Number.isNaN(publishedAt.valueOf()) && publishedAt <= buildNow;
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["avif", "webp", "auto"],
    widths: [480, 800, 1200, "auto"],
    failOnError: true,
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async"
      }
    }
  });

  eleventyConfig.addPassthroughCopy("src/assets/art");
  eleventyConfig.addPassthroughCopy("src/assets/brand");
  eleventyConfig.addPassthroughCopy("src/assets/styles");
  eleventyConfig.addPassthroughCopy("src/assets/scripts");
  eleventyConfig.addPassthroughCopy("src/articles/**/media/**");

  const fontPackages = [
    "source-serif-4",
    "noto-serif-sc",
    "noto-sans-sc"
  ];
  for (const family of fontPackages) {
    eleventyConfig.addPassthroughCopy({
      [`node_modules/@fontsource-variable/${family}/index.css`]: `assets/fonts/${family}.css`,
      [`node_modules/@fontsource-variable/${family}/files`]: "assets/fonts/files"
    });
  }

  eleventyConfig.addCollection("publishedArticles", collectionApi =>
    collectionApi
      .getFilteredByGlob("src/articles/**/index.html")
      .filter(isPublished)
      .sort((a, b) => new Date(b.data.publishedAt) - new Date(a.data.publishedAt))
  );

  eleventyConfig.addCollection("featuredArticles", collectionApi =>
    collectionApi
      .getFilteredByGlob("src/articles/**/index.html")
      .filter(item => isPublished(item) && item.data.featured)
      .sort((a, b) => new Date(b.data.publishedAt) - new Date(a.data.publishedAt))
  );

  eleventyConfig.addFilter("displayDate", (value, locale = "zh-CN") => {
    const date = new Date(value);
    if (Number.isNaN(date.valueOf())) return "";
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: publishingTimeZone
    }).format(date).replaceAll("/", ".");
  });
  eleventyConfig.addFilter("isoDate", value => new Date(value).toISOString());
  eleventyConfig.addFilter("json", value => JSON.stringify(value).replaceAll("<", "\\u003c"));
  eleventyConfig.addFilter("absoluteUrl", (value, origin) => new URL(value, origin).href);
  eleventyConfig.addFilter("findById", (items, id) => items.find(item => item.id === id));
  eleventyConfig.addFilter("readingLabel", minutes => `${minutes || 1} min read`);
  eleventyConfig.addFilter("limit", (items, count) => items.slice(0, count));
  eleventyConfig.addFilter("pad3", value => String(value).padStart(3, "0"));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: false,
    templateFormats: ["html", "njk"]
  };
}
