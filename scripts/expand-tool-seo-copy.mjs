import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const extraCopyBySlug = {
  "border-radius-generator":
    "Border radius becomes especially useful when you want components to feel friendlier and more refined. Buttons, cards, form fields, avatars and images all benefit from consistent corner values. A small radius can create a cleaner and more modern interface, while larger values can push a design toward a softer product look. This kind of tool is helpful because it lets you compare subtle changes visually instead of guessing values in code. It also makes it easier to keep a consistent radius system across a full website, which improves visual rhythm and makes UI components feel related.",
  "box-shadow-generator":
    "A good box shadow is usually subtle and supports hierarchy instead of calling attention to itself. For example, cards often need a soft shadow to separate them from the background, while dropdowns and modal windows may need stronger depth so users can understand stacking order immediately. Testing shadow values visually helps you find the right balance between contrast and softness. It can also prevent overdesigned interfaces where shadows look muddy or too heavy. Using a generator like this speeds up experimentation and helps you create reusable shadow styles that stay consistent across a project.",
  "color-palette-generator":
    "Color palette tools are useful because strong color decisions affect readability, hierarchy and brand recognition across the whole interface. A balanced palette usually includes primary, secondary, neutral and accent colors that work together in headings, backgrounds, buttons and states. When you experiment visually, you can spot clashes much faster than when changing hex values manually in code. This also helps when building design tokens or CSS variables for a scalable system. Instead of choosing colors one by one, you can build a coordinated palette that supports accessibility, visual consistency and cleaner handoff into real development.",
  "css-animation-generator":
    "Animation is most effective when it supports clarity, not when it becomes decoration without purpose. Entrance effects can guide attention to new content, hover animations can make controls feel more responsive and loading motion can reassure users that something is happening. The challenge is keeping motion smooth and consistent so it improves the interface instead of distracting from it. A visual generator helps you test timing, easing and movement faster, which is important when polishing UI details. It also reduces trial and error by letting you compare animation choices before copying the final CSS into components or reusable classes.",
  "css-filter-generator":
    "CSS filters are practical when you need fast visual changes without editing the original asset in external software. They can help soften hero images behind text, emphasize hover states on product cards or create muted background treatments for sections that need stronger contrast. Because filter functions can stack together, small adjustments in blur, brightness and saturation can completely change how an image feels in the layout. A live tool is useful here because the visual difference between values is often easier to judge than the raw numbers themselves. That makes filters easier to use intentionally instead of through random experimentation.",
  "css-grid-generator":
    "Grid is especially strong when a layout needs structure in both directions. Product listings, dashboard panels, feature blocks, media galleries and editorial sections all benefit from a system that controls both columns and rows together. A visual generator makes CSS Grid easier to understand because you can immediately see how template values affect layout density, spacing and balance. That matters when building responsive interfaces, where small changes in the number of columns can dramatically change readability and scanning behavior. Using the tool can save time during prototyping and also help you create cleaner, more repeatable layout patterns for production code.",
  "css-transform-generator":
    "Transforms are often used to create interaction without disturbing layout flow, which makes them a reliable tool for polished interfaces. Hover lift effects on cards, subtle scale changes on buttons and movement on media thumbnails all depend on transform values that feel natural. When those values are too strong, the UI can feel unstable; when they are too small, the feedback gets lost. A generator helps you find the right level quickly while seeing the visual result in context. It also makes it easier to combine rotate, scale and translate properties into one clean declaration that can be reused across interactive components.",
  "flexbox-generator":
    "Flexbox shines in interface patterns where alignment matters more than full page structure. Navigation bars, action groups, toolbars, card rows and centered content blocks are all easier to build when you can control direction, spacing and alignment from one container. A visual generator is valuable because it turns abstract properties like justify-content and align-items into something immediate and understandable. That makes troubleshooting faster when a layout feels off. It also helps beginners learn what each property does in practice, while experienced developers can use the tool to speed up layout setup and copy dependable CSS for reusable interface patterns.",
  "glassmorphism-generator":
    "Glassmorphism works best when blur, transparency, borders and shadow are balanced carefully. If the effect is too weak, the panel disappears into the background; if it is too strong, it can hurt readability and feel more decorative than useful. A generator helps you explore that balance quickly by previewing how opacity and blur interact together. This is especially useful for overlays, floating cards, profile panels and promotional sections where you want layered depth without losing contrast. Instead of adjusting several values blindly, you can shape the effect visually and move faster toward a style that feels deliberate and production-ready.",
  "gradient-generator":
    "Gradients are useful for adding depth and energy to backgrounds, buttons, hero areas and accent surfaces. Small changes in angle, stop position or color intensity can make a design feel either more premium or more playful, so being able to preview those changes immediately saves a lot of time. A generator is especially helpful when you want to create a gradient that still supports readable text and does not overpower the rest of the interface. It also helps teams move from experimentation into implementation faster because the final CSS can be copied directly into a real project with fewer manual tweaks afterward.",
  "text-shadow-generator":
    "Text shadow can improve emphasis, legibility and visual atmosphere when it is used with restraint. It often appears in hero headings, image overlays, promotional banners and decorative typography where text needs stronger separation from the background. The problem is that heavy shadow values can quickly make type look blurry or outdated. A live generator helps you test offset, blur and opacity in a more controlled way, which makes it easier to find subtle settings that support readability. It is a practical shortcut for both design exploration and production work, especially when you need a stronger text treatment without sacrificing clarity."
};

for (const [slug, extraCopy] of Object.entries(extraCopyBySlug)) {
  const filePath = path.join(rootDir, "tools", slug, "index.html");
  const content = readFileSync(filePath, "utf8");
  const insertAfter =
    /(<p>\s*[\s\S]*?<\/p>\s*)(\s*<h3>)/;

  if (content.includes(extraCopy)) {
    continue;
  }

  if (!insertAfter.test(content)) {
    throw new Error(`Could not find SEO paragraph block in ${filePath}`);
  }

  const updated = content.replace(
    insertAfter,
    `$1          <p>\n            ${extraCopy}\n          </p>\n$2`
  );

  writeFileSync(filePath, updated.replace(/\r?\n/g, "\n"));
}
