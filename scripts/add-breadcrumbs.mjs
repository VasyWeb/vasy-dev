import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "").trim();
}

function getDirectories(dir) {
  return readdirSync(dir)
    .map((name) => path.join(dir, name))
    .filter((entry) => statSync(entry).isDirectory());
}

function breadcrumbJson(items) {
  return (
    '    <script type="application/ld+json">' +
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }) +
    "</script>"
  );
}

function upsertAfter(content, anchor, insert) {
  if (!content.includes(anchor)) {
    throw new Error(`Missing anchor: ${anchor}`);
  }

  const breadcrumbScriptPattern =
    /[ \t]*<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"BreadcrumbList".*?<\/script>\r?\n?/s;

  const withoutExisting = content.replace(breadcrumbScriptPattern, "");
  return withoutExisting.replace(anchor, `${anchor}\n${insert}`);
}

function upsertBefore(content, anchor, insert) {
  if (!content.includes(anchor)) {
    throw new Error(`Missing anchor: ${anchor}`);
  }

  const breadcrumbNavPattern =
    /[ \t]*<nav class="breadcrumb" aria-label="Breadcrumb">.*?<\/nav>\r?\n?/s;

  const withoutExisting = content.replace(breadcrumbNavPattern, "");
  return withoutExisting.replace(anchor, `${insert}\n${anchor}`);
}

function saveFile(filePath, content) {
  writeFileSync(filePath, content.replace(/\r?\n/g, "\n"));
}

function updateFile(filePath, config) {
  let content = readFileSync(filePath, "utf8");
  const breadcrumbScript = breadcrumbJson(config.items);
  content = upsertAfter(content, config.canonicalAnchor, breadcrumbScript);
  content = upsertBefore(content, config.visibleAnchor, config.visibleMarkup);
  saveFile(filePath, content);
}

function blogArticleConfig(slug) {
  const filePath = path.join(rootDir, "blog", slug, "index.html");
  const content = readFileSync(filePath, "utf8");
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/s);

  if (!h1Match) {
    throw new Error(`Missing H1 in ${filePath}`);
  }

  const title = stripTags(h1Match[1]);

  return {
    filePath,
    canonicalAnchor: `<link rel="canonical" href="https://vasy.dev/blog/${slug}/" />`,
    visibleAnchor: '<article class="blog-article">',
    visibleMarkup: `          <nav class="breadcrumb" aria-label="Breadcrumb">
            <a href="../../index.html">Home</a>
            <span class="breadcrumb__separator" aria-hidden="true">&gt;</span>
            <a href="../index.html">Blog</a>
            <span class="breadcrumb__separator" aria-hidden="true">&gt;</span>
            <span aria-current="page">${title}</span>
          </nav>`,
    items: [
      { name: "Home", url: "https://vasy.dev/" },
      { name: "Blog", url: "https://vasy.dev/blog/" },
      { name: title, url: `https://vasy.dev/blog/${slug}/` }
    ]
  };
}

function toolPageConfig(slug) {
  const filePath = path.join(rootDir, "tools", slug, "index.html");
  const content = readFileSync(filePath, "utf8");
  const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/s);

  if (!h1Match) {
    throw new Error(`Missing H1 in ${filePath}`);
  }

  const title = stripTags(h1Match[1]);

  return {
    filePath,
    canonicalAnchor: `<link rel="canonical" href="https://vasy.dev/tools/${slug}/" />`,
    visibleAnchor: "<h1>",
    visibleMarkup: `            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a href="../../index.html">Home</a>
              <span class="breadcrumb__separator" aria-hidden="true">&gt;</span>
              <a href="../../tools/">Tools</a>
              <span class="breadcrumb__separator" aria-hidden="true">&gt;</span>
              <span aria-current="page">${title}</span>
            </nav>`,
    items: [
      { name: "Home", url: "https://vasy.dev/" },
      { name: "Tools", url: "https://vasy.dev/tools/" },
      { name: title, url: `https://vasy.dev/tools/${slug}/` }
    ]
  };
}

updateFile(path.join(rootDir, "blog", "index.html"), {
  canonicalAnchor: '<link rel="canonical" href="https://vasy.dev/blog/" />',
  visibleAnchor: '<h1 id="more-articles">Blog</h1>',
  visibleMarkup: `            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a href="../index.html">Home</a>
              <span class="breadcrumb__separator" aria-hidden="true">&gt;</span>
              <span aria-current="page">Blog</span>
            </nav>`,
  items: [
    { name: "Home", url: "https://vasy.dev/" },
    { name: "Blog", url: "https://vasy.dev/blog/" }
  ]
});

updateFile(path.join(rootDir, "tools", "index.html"), {
  canonicalAnchor: '<link rel="canonical" href="https://vasy.dev/tools/" />',
  visibleAnchor: "<h1>CSS Tools</h1>",
  visibleMarkup: `            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a href="../index.html">Home</a>
              <span class="breadcrumb__separator" aria-hidden="true">&gt;</span>
              <span aria-current="page">Tools</span>
            </nav>`,
  items: [
    { name: "Home", url: "https://vasy.dev/" },
    { name: "Tools", url: "https://vasy.dev/tools/" }
  ]
});

updateFile(path.join(rootDir, "projects", "index.html"), {
  canonicalAnchor: '<link rel="canonical" href="https://vasy.dev/projects/" />',
  visibleAnchor: '<h1 class="projects__title">Projects</h1>',
  visibleMarkup: `            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a href="../index.html">Home</a>
              <span class="breadcrumb__separator" aria-hidden="true">&gt;</span>
              <span aria-current="page">Projects</span>
            </nav>`,
  items: [
    { name: "Home", url: "https://vasy.dev/" },
    { name: "Projects", url: "https://vasy.dev/projects/" }
  ]
});

for (const directory of getDirectories(path.join(rootDir, "blog"))) {
  const slug = path.basename(directory);
  updateFile(blogArticleConfig(slug).filePath, blogArticleConfig(slug));
}

for (const directory of getDirectories(path.join(rootDir, "tools"))) {
  const slug = path.basename(directory);
  updateFile(toolPageConfig(slug).filePath, toolPageConfig(slug));
}
