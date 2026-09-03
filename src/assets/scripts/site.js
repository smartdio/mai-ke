document.documentElement.classList.add("js");

document.querySelectorAll("[data-embed-url]").forEach(button => {
  button.addEventListener("click", () => {
    const wrapper = button.closest(".media-embed");
    const url = button.dataset.embedUrl;
    const title = button.dataset.embedTitle || "嵌入媒体";
    if (!wrapper || !url) return;

    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.title = title;
    iframe.loading = "lazy";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-presentation");
    wrapper.replaceChildren(iframe);
  }, { once: true });
});
