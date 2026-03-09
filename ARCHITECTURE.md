# Site Architecture

## 1. Overview
This project is a static frontend portfolio website built with:
- HTML (semantic structure)
- SCSS (7-1 architecture)
- Vanilla JavaScript (interactive UI tools)

Main goals:
- clear semantic layout
- easy maintenance for beginners
- SEO-friendly pages for tools

## 2. Folder Structure
```text
.
|-- index.html
|-- assets/
|   |-- css/
|   |   |-- main.css
|   |   `-- main.css.map
|   `-- js/
|       `-- main.js
|-- src/
|   `-- scss/
|       |-- main.scss
|       |-- abstracts/
|       |-- base/
|       |-- components/
|       |-- layout/
|       |-- pages/
|       |-- themes/
|       `-- vendors/
|-- tools/
|   |-- index.html
|   |-- box-shadow-generator/index.html
|   |-- border-radius-generator/index.html
|   |-- color-palette-generator/index.html
|   `-- gradient-generator/index.html
|-- projects/index.html
|-- blog/index.html
|-- robots.txt
|-- sitemap.xml
`-- package.json
```

## 3. HTML Architecture
- `index.html` is the main entry page.
- Semantic structure:
  - `header` (navigation)
  - `main` (all content sections)
  - `footer` (links + contact)

Main sections in `main`:
- Hero
- About
- Projects
- Tech Stack
- Lighthouse
- Services
- Testimonials
- Tools
- Contact

## 4. SCSS Architecture (7-1)
SCSS source is in `src/scss/` and compiled into `assets/css/main.css`.

- `abstracts/`: variables, functions, mixins
- `base/`: reset, typography, global base rules
- `components/`: reusable UI parts (buttons, cards)
- `layout/`: section/layout-specific styling (hero, nav, footer, etc.)
- `pages/`: page-specific styling (`_home.scss`)
- `themes/`: theme tokens and color customization
- `vendors/`: third-party overrides if needed

Entry file: `src/scss/main.scss` using `@use` imports.

## 5. JavaScript Architecture
File: `assets/js/main.js`

Structure is split by feature functions:
- `setupNav()`
- `setupShadowGenerator()`
- `setupRadiusGenerator()`
- `setupPaletteGenerator()`
- `setupGradientGenerator()`

Common behavior:
- `getById()` helper for DOM access
- `withCopyFeedback()` helper for copy-to-clipboard status messages

Each setup function is defensive: it exits early if required DOM elements are missing.
This allows the same JS file to run safely on all pages.

## 6. SEO Structure
Implemented assets and files:
- page-level meta description
- Open Graph tags
- JSON-LD Person schema on homepage
- `robots.txt`
- `sitemap.xml`
- separate crawlable tool pages under `/tools/...`

## 7. NPM Scripts
From `package.json`:
- `npm run compile:sass`
  - watches SCSS and recompiles automatically (`-w`)
- `npm run build:sass`
  - one-time expanded build
- `npm run build:sass:prod`
  - one-time compressed production build

## 8. Recommended Workflow
1. Run `npm run compile:sass` during development.
2. Edit HTML/SCSS/JS files.
3. Validate pages:
   - `/`
   - `/tools/`
   - `/tools/box-shadow-generator/`
   - `/tools/border-radius-generator/`
   - `/tools/color-palette-generator/`
   - `/tools/gradient-generator/`
4. Before deploy, run `npm run build:sass:prod`.
