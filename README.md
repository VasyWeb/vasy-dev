# Vasy.dev Portfolio

Frontend developer portfolio built with semantic HTML, SCSS 7-1 architecture, and vanilla JavaScript.

## Features

- Responsive layout
- CSS Tools Hub
- Performance optimized
- Lighthouse score section
- SEO optimized
- schema.org structured data

## Tech Stack

- HTML5
- SCSS (7-1 + BEM)
- Vanilla JavaScript
- Git / GitHub
- Netlify

## Tools Included

Free generators (`tools/generators/`, 12): Box Shadow, Border Radius, Gradient,
Color Palette, Text Shadow, CSS Transform, Glassmorphism, CSS Grid, Flexbox,
CSS Animation, CSS Filter, Neumorphism.

Converters (`tools/converters/`, 4): PX to REM, REM to PX, PX to EM, HEX to RGB.

Pro tools (`tools/pro/`, 7): Box Shadow Pro, Border Radius Pro, Gradient Pro,
Color Palette Pro, Glassmorphism Pro, CSS Grid Pro, Flexbox Pro.
Roadmap: `tools/premium/`.

Blog guides (`blog/`, 13) — each links to its generator.

## Scripts

- `npm run watch` — `sass --watch src/scss/main.scss:css/main.css` (dev, output local `css/`)
- `npm run build` — `node scripts/build-dist.mjs && sass src/scss/main.scss dist/css/main.css --style=compressed` (prod, publish `dist/` on Netlify)

Requires Node 24 (see `.nvmrc`) + `npm i -g sass` or local `npx sass`.
Read `ARCHITECTURE.md` and `docs/SEO-GA-SAFETY.md` before any head/URL change.

## Live Demo
https://vasy-dev.netlify.app/
https://vasytech.netlify.app/
https://nexora-demo.netlify.app/
