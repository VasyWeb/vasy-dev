# SEO / GA / GSC Safety — ce NU avem voie să stricăm

> Citește asta înainte de orice PR. Live: `https://vasy-dev.netlify.app/`, GA4: `G-5YW4LB5N1T`.

## Lista roșie — nu șterge / nu redenumi fără PR separat + preview

1. `googlee82e5137119f44e9.html` — verificare Search Console. Trebuie să ajungă în `dist/` via `scripts/build-dist.mjs`.
2. Blocul `gtag.js` din `<head>` cu ID `G-5YW4LB5N1T` — prezent pe 47 pagini. Nu-l muta în footer, nu-l pune pe `defer` manual, nu schimba ID-ul.
3. `scripts/build-dist.mjs` `copyTargets` — dacă adaugi folder nou cu pagini (ex. `docs/`), decide conștient dacă intră în `dist/` sau nu. `docs/` intern NU trebuie publicat.
4. `robots.txt` + `sitemap.xml` — orice pagină nouă publică trebuie adăugată manual în sitemap până automatizăm. Nu schimba URL-uri fără redirect Netlify + update sitemap + canonical.
5. `canonical` + `og:url` + `hreflang` pe `index.html / index-ro.html / index-cz.html` — template de referință. La pagini noi, copiază patternul din `tools/pro/box-shadow-generator-pro/index.html` (canonical + OG + JSON-LD WebPage + BreadcrumbList).
6. Evenimentul `buy_click` din `src/js/ui/pro-paywall.js` + `GUMROAD_URL` + `ACCESS_STORAGE_KEY` — nu redenumi fără update în GA4 Explore.

## Checklist pre-merge (2 minute)

- [ ] `npm run build` verde local, `dist/` conține `google*.html`, `sitemap.xml`, `robots.txt`, `css/main.css`
- [ ] Deschizi Netlify Deploy Preview, verifici 1 pagină home + 1 tool free + 1 tool pro
- [ ] GA4 Realtime vede `page_view` pe preview (sau cel puțin `gtag` prezent în source)
- [ ] `git status` arată doar fișierele intenționate — niciodată `dist/`, `node_modules/`, `.netlify/`

## Greșeli tipice de evitat

- Editarea `css/main.css` direct — e generat din `src/scss/`. Editezi SCSS, rulezi `watch`/`build`.
- Unificarea `tools/converters/*.html` în URL-uri clean fără `[[redirects]]` în `netlify.toml` — rupe SEO + bookmark-uri.
- Adăugarea de fonturi/scripturi noi în `<head>` fără `preconnect`/`defer` — strică LCP.
