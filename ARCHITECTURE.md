# Site Architecture — vasy-dev (actualizat Oct 2026, audit local)

> Fișier rescris în copia de audit `vasy-dev-audit/`, NU împins spre GitHub/Netlify.
> Scop: să reflecte realitatea din `main` (commit `2f93925`), nu varianta veche cu 4 tooluri.
> Regula de siguranță: nu șterge/redenumi `googlee82e5137119f44e9.html`, nu muta URL-uri fără redirect, nu scoate `gtag G-5YW4LB5N1T` din `<head>`.

## 1. Overview

Site static portfolio + Tools Hub, fără framework:
- HTML semantic, pagini statice per tool / ghid
- SCSS 7-1 cu BEM, compilat cu `sass` (dart-sass)
- JS vanilla organizat pe module ES (`src/js/...`), entry `src/js/main.js`
- Build: `node scripts/build-dist.mjs` + `sass`, publish `dist/` pe Netlify
- Deploy automat: push în `main` → Netlify rulează `npm run build`

Live: `https://vasy-dev.netlify.app/`
Repo: `https://github.com/VasyWeb/vasy-dev`

Main goals:
- pagini SEO crawlable per tool (free + pro)
- funnel: Blog ghid → Generator free → Pro/Premium → Gumroad
- mentenanță simplă, fără dependențe runtime

## 2. Folder Structure (real, Oct 2026)

```text
.
|-- index.html              # EN (canonical), cu hreflang en/ro/cs/x-default
|-- index-ro.html           # RO
|-- index-cz.html           # CZ
|-- robots.txt              # Allow + Sitemap
|-- sitemap.xml             # ~47 URL-uri, lastmod mixt mar/apr 2026
|-- favicon.svg
|-- googlee82e5137119f44e9.html  # NU ȘTERGE — verificare Search Console
|-- netlify.toml            # build: npm run build, publish: dist
|-- package.json            # scripts: watch, build
|-- ARCHITECTURE.md         # acest fișier
|-- README.md               # parțial învechit, vezi §9
|-- css/main.css             # ATENȚIE: track-uit în git deși .gitignore zice css/ (anomalie)
|-- src/
|   |-- scss/main.scss + abstracts/ base/ components/ layout/ pages/ themes/ vendors/
|   |-- js/main.js           # entry, importă tot
|   |-- js/tools/ (16): shadow, radius, palette, gradient, text-shadow,
|   |                 transform, glass, grid, flexbox, animation, filter,
|   |                 neumorphism, px-to-rem, rem-to-px, px-to-em, hex-to-rgb
|   |-- js/pro/ (7): box-shadow-pro, border-radius-pro, gradient-pro,
|   |                palette-pro, glass-pro, grid-pro, flexbox-pro
|   |-- js/ui/: nav, cards, hero-carousel, pro-paywall
|   |-- js/utils/: analytics.js
|   |-- images/
|   `-- cv/
|-- tools/
|   |-- index.html           # hub Free vs Pro
|   |-- generators/ (12 + index): box-shadow, border-radius, gradient,
|   |   color-palette, text-shadow, css-transform, glassmorphism,
|   |   css-grid, flexbox, css-animation, css-filter, neumorphism
|   |-- converters/ (4 + index): px-to-rem.html, rem-to-px.html,
|   |   px-to-em.html, hex-to-rgb.html  # ATENȚIE: cu .html, restul sunt clean URL
|   |-- premium/index.html   # roadmap Premium
|   `-- pro/ (7): box-shadow-generator-pro, border-radius-generator-pro,
|       gradient-generator-pro, color-palette-generator-pro,
|       glassmorphism-generator-pro, css-grid-generator-pro, flexbox-generator-pro
|-- blog/index.html + 13 ghiduri (fiecare leagă spre generatorul aferent)
|-- projects/index.html
|-- resources/index.html + pdf/
|-- printables/index.html    # Gumroad coloring books
|-- scripts/
|   |-- build-dist.mjs        # curăță dist/, copiază html/blog/tools/resources + src/js→js, src/images→images
|   |-- add-article-schema.mjs
|   |-- add-breadcrumbs.mjs
|   `-- expand-tool-seo-copy.mjs
`-- dist/ (generat, NU se comite, publicat pe Netlify)
```

Contor verificat: 48 fișiere `.html`, 47 cu GA (lipsește corect doar verificarea Google).

## 3. HTML / SEO

- `index.html` are: GA4 `G-5YW4LB5N1T`, canonical, `hreflang en/ro/cs/x-default`,
  OG/Twitter, JSON-LD `Person` + `WebSite`. Acesta e template-ul de referință.
- Tool Pro (ex. box-shadow-pro): GA4 + canonical + OG + JSON-LD `WebPage` + `BreadcrumbList`. Bun.
- Blog + projects + resources + printables + premium: toate cu GA4. OK.
- `hreflang` doar pe cele 3 homepage-uri. Toolurile/blogul sunt EN-only — intenționat, nu e bug, dar să nu adăugăm RO/CZ fără hreflang complet.
- `sitemap.xml` + `robots.txt` corecte, dar `lastmod` e manual (30× 2026-03-20, 9× 2026-04-16, 8× 2026-04-18).

## 4. SCSS (7-1 + BEM)

Sursă `src/scss/`, entry `main.scss` cu `@use`. Output:
- dev: `sass --watch src/scss/main.scss:css/main.css` (script `watch`)
- prod: `sass src/scss/main.scss dist/css/main.css --style=compressed` (parte din `build`)

Anomalie: `css/main.css` (38K) este comis în git deși `.gitignore` conține `css/`. Cauza: fișier deja track-uit înainte de gitignore. Nu rupe Netlify (publish e `dist/`), dar creează confuzie local vs prod. Recomandare: păstrăm cum e până decizi, apoi `git rm --cached css/main.css` într-un PR separat.

## 5. JavaScript

Entry `src/js/main.js` (ES modules, 43 linii): importă `ui/*`, `utils/analytics`, `tools/*` (16), `pro/*` indirect via pagini pro. Fiecare `setup*()` e defensiv (iese dacă lipsește DOM-ul), deci același bundle poate rula pe toate paginile.

Monetizare (`src/js/ui/pro-paywall.js`, 171 linii):
- `ACCESS_STORAGE_KEY = vasy_pro_access`, cod `VASY-PRO-2026`, `GUMROAD_URL = https://milanjakub.gumroad.com/l/vasy-pro-tools`
- tracking: `gtag('event','buy_click',{tool})` — NU redenumi evenimentul fără să anunți GA4
- copy diferențiat per tool (gradient/shadow/grid/flexbox/default)

Free → Pro: fiecare generator free are `<aside class="...__upgrade">` spre `/tools/pro/<tool>-pro/` (verificat pe box-shadow). Păstrează patternul la tooluri noi.

## 6. Build & Deploy (Netlify — a nu strica)

`netlify.toml`:
```toml
[build]
command = "npm run build"
publish = "dist"
```

`package.json`:
- `watch`: `sass --watch src/scss/main.scss:css/main.css`
- `build`: `node scripts/build-dist.mjs && sass src/scss/main.scss dist/css/main.css --style=compressed`

`scripts/build-dist.mjs` copiază în `dist/`: cele 3 index-uri, robots, sitemap, favicon, verificarea Google, `blog/ printables/ projects/ resources/ tools/`, `src/js→js`, `src/images→images`, `src/cv→cv`, apoi creează `dist/css/` pentru outputul sass.

Checklist pre-deploy (manual, până automatizăm):
1. `npm run build` verde local
2. `dist/` conține `googlee82e5137119f44e9.html` + `sitemap.xml` + `robots.txt`
3. GA4 prezent în `dist/index.html` și 1 pagină tool
4. fără URL-uri redenumite fără redirect

## 7. Ce lipsește / e învechit (propuneri, fără aplicare automată)

1. `README.md` listează scripturi inexistente (`sass, compile:sass, build:sass...`) și doar 4 tooluri. De aliniat cu `package.json` real.
2. `ARCHITECTURE.md` vechi (acest fișier îl înlocuiește în audit).
3. Lipsă: `.nvmrc` (pin node 24 — versiunea ta locală `v24.21.0`), `CONTRIBUTING.md` scurt (flow local→PR→Netlify Preview→merge), `docs/SEO-GA-SAFETY.md` (ce nu avem voie să atingem).
4. `sitemap.xml` generat manual — propus script `node scripts/build-sitemap.mjs` în pasul următor, NU acum.
5. Convertoare cu `.html` vs generatoare clean — NU unifica acum, cere redirecturi Netlify + update GA/GSC. Trecut în backlog.

## 8. Workflow recomandat (local → live, fără riscuri)

1. Lucrezi în `C:\Users\milan\Desktop\portofoliu vasy.dev` (Windows), eu în audit separat — nu amestecăm.
2. Orice modificare: branch nou, nu direct `main`.
3. Preview: Netlify Deploy Preview, verifici GA în `Realtime` + Search Console `URL Inspection`.
4. Merge în `main` doar după preview verde → deploy automat.
