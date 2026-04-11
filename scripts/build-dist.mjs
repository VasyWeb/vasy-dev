import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");

const copyTargets = [
  ["index.html", "index.html"],
  ["index-ro.html", "index-ro.html"],
  ["index-cz.html", "index-cz.html"],
  ["robots.txt", "robots.txt"],
  ["sitemap.xml", "sitemap.xml"],
  ["favicon.svg", "favicon.svg"],
  ["googlee82e5137119f44e9.html", "googlee82e5137119f44e9.html"],
  ["blog", "blog"],
  ["printables", "printables"],
  ["projects", "projects"],
  ["resources", "resources"],
  ["tools", "tools"],
  ["src/js", "js"],
  ["src/images", "images"],
  ["src/cv", "cv"]
];

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

for (const [source, destination] of copyTargets) {
  const sourcePath = path.join(rootDir, source);
  const destinationPath = path.join(distDir, destination);

  if (!existsSync(sourcePath)) {
    continue;
  }

  cpSync(sourcePath, destinationPath, { recursive: true });
}

mkdirSync(path.join(distDir, "css"), { recursive: true });
