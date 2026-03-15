import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const blogDir = path.join(rootDir, "blog");

function getDirectories(dir) {
  return readdirSync(dir)
    .map((name) => path.join(dir, name))
    .filter((entry) => statSync(entry).isDirectory());
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, "").trim();
}

function toAbsoluteUrl(relativePath) {
  return new URL(relativePath, "https://vasy.dev/").toString();
}

function getMatch(content, pattern, label, filePath) {
  const match = content.match(pattern);

  if (!match) {
    throw new Error(`Missing ${label} in ${filePath}`);
  }

  return match[1].trim();
}

function buildArticleSchema({ headline, description, canonicalUrl, imageUrl }) {
  return (
    '    <script type="application/ld+json">' +
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline,
      description,
      author: {
        "@type": "Person",
        name: "Vasy",
        url: "https://vasy.dev/"
      },
      publisher: {
        "@type": "Organization",
        name: "Vasy.dev",
        url: "https://vasy.dev/",
        logo: {
          "@type": "ImageObject",
          url: "https://vasy.dev/favicon.svg"
        }
      },
      mainEntityOfPage: canonicalUrl,
      url: canonicalUrl,
      image: imageUrl,
      inLanguage: "en"
    }) +
    "</script>"
  );
}

function upsertArticleSchema(content, schemaScript) {
  const pattern =
    /[ \t]*<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"Article".*?<\/script>\n?/s;

  if (pattern.test(content)) {
    return content.replace(pattern, `${schemaScript}\n`);
  }

  const breadcrumbAnchor =
    /([ \t]*<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"BreadcrumbList".*?<\/script>)/s;

  if (breadcrumbAnchor.test(content)) {
    return content.replace(breadcrumbAnchor, `$1\n${schemaScript}`);
  }

  const canonicalAnchor = /([ \t]*<link rel="canonical" href="[^"]+" \/>)/;

  if (!canonicalAnchor.test(content)) {
    throw new Error("Missing canonical tag for Article schema insertion");
  }

  return content.replace(canonicalAnchor, `$1\n${schemaScript}`);
}

for (const directory of getDirectories(blogDir)) {
  const filePath = path.join(directory, "index.html");
  const content = readFileSync(filePath, "utf8");
  const headline = stripTags(
    getMatch(content, /<h1[^>]*>(.*?)<\/h1>/s, "H1", filePath)
  );
  const description = getMatch(
    content,
    /<meta\s+name="description"\s+content="([^"]+)"/,
    "meta description",
    filePath
  );
  const canonicalUrl = getMatch(
    content,
    /<link rel="canonical" href="([^"]+)"/,
    "canonical URL",
    filePath
  );
  const imagePath = getMatch(
    content,
    /<meta property="og:image" content="([^"]+)"/,
    "og:image",
    filePath
  );
  const schemaScript = buildArticleSchema({
    headline,
    description,
    canonicalUrl,
    imageUrl: toAbsoluteUrl(imagePath)
  });
  const updated = upsertArticleSchema(content, schemaScript);

  writeFileSync(filePath, updated.replace(/\r?\n/g, "\n"));
}
