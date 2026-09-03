const production = process.env.NODE_ENV === "production";

export default {
  layout: "layouts/article.njk",
  contentType: "article",
  eleventyComputed: {
    permalink(data) {
      if (!data.slug) return data.permalink || "/articles/index.html";
      const status = data.status;
      const publishedAt = new Date(data.publishedAt);
      const isDue = !Number.isNaN(publishedAt.valueOf()) && publishedAt <= new Date();
      const isPublic = status === "published" || status === "archived" || (status === "scheduled" && isDue);
      if (production && !isPublic) return false;
      return isPublic ? `/articles/${data.slug}/index.html` : `/preview/${data.slug}/index.html`;
    }
  }
};
