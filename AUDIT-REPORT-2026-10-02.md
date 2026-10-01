# Audit vasy-dev — Pasul 1 (doar analiză, fără push)

Data: 2026-10-02. Copie de lucru: `vasy-dev-audit/` (clone curat `main` @ `2f93925`). Nimic împins spre GitHub, nimic deployat.

## A. Verificat — funcționează, nu atingem

- GA4 `G-5YW4LB5N1T` pe 47/48 pagini HTML. Singura fără: `googlee82e5137119f44e9.html` (corect așa).
- Search Console: fișier verificare prezent în repo + copiat în `dist/` de `build-dist.mjs`.
- Netlify: `command = npm run build`, `publish = dist`. `dist/` e ignorat de git, generat la fiecare build. Corect.
- `robots.txt` + `sitemap.xml` prezente și copiate în `dist/`.
- Funnel existent: free generator are `<aside __upgrade>` → `/tools/pro/<tool>-pro/` (ex. box-shadow). Paywall JS + `buy_click` event + Gumroad `milanjakub.gumroad.com/l/vasy-pro-tools` + cod `VASY-PRO-2026` în localStorage.
- `git status` curat în clonă. Ultimele commituri sunt pe conversie/paywall — direcția e bună.

## B. Anomalii găsite (risc mic azi, risc mare la scalare)

1. `css/main.css` comis în git deși `.gitignore` zice `css/`. Mărime 38K. Nu rupe prod (Netlify folosește `dist/css/`), dar încurcă: colegii/editurile pot edita fișierul generat. Fix viitor separat: `git rm --cached css/main.css`, nu acum.
2. `README.md` greșit: listează 6 scripturi vechi, realitatea e doar `watch` + `build`. Și doar 4 tooluri vs 12+4+7 reale. Risc: onboarding greșit.
3. `ARCHITECTURE.md` vechi: structură `dist/` greșită, doar 4 tooluri, scripturi vechi. → Rezolvat în audit: rescris complet în această copie, de revizuit apoi PR.
4. Convertoare cu `.html` (`/tools/converters/px-to-rem.html`) vs generatoare clean (`/tools/generators/box-shadow-generator/`). SEO + analytics pe 2 patternuri. NU schimba acum — cere redirecturi + adnotare GA.
5. `sitemap.xml` manual, lastmod-uri vechi (mar/apr 2026). Dacă publici tool nou și uiți sitemap, Google îl găsește greu. Propus script generator, pasul următor.
6. `hreflang` doar pe homepage-uri. OK cât timp tool/blog rămân EN-only.

## C. Monetizare — stare pe scurt (prioritatea ta)

- Free: 12 generatoare + 4 convertoare, toate cu live preview + copy. Hub `/tools/` cu secțiuni Free vs Pro. Bun.
- Pro: 7 pagini `/tools/pro/*-pro/` + `/tools/premium/` roadmap. JS pro separat `src/js/pro/*` (7 fișiere). Paywall cu cod + Gumroad + tracking `buy_click`.
- Printables: `/printables/` → Gumroad coloring books. Resources: `/resources/` + 5 PDF-uri free (lead magnet bun).
- Ce lipsește pentru conversie (de măsurat, nu de ghicit): evenimente GA4 pentru `generate_copy` / `pro_click` / `gumroad_out` — azi există doar `buy_click` în `pro-paywall.js`. Fără ele nu știi ce tool vinde.

## D. Pași următori propuși (mărunți, în ordine)

- [ ] Pas 2a: tu revezi `ARCHITECTURE.md` rescris în audit. Dacă e OK, îl copiem în folderul tău `portofoliu vasy.dev` + fix `README.md` scripturi (PR mic, fără risc).
- [ ] Pas 2b: adaug `.nvmrc` (24) + `docs/SEO-GA-SAFETY.md` (lista roșie: head/GA/canonical/sitemap/verificare Google) — tot PR mic.
- [ ] Pas 3: audit conversie per tool (trafic GSC + clickuri Pro) → alegem 2 tooluri pentru Pro complet, nu toate 7 odată.
- [ ] Pas 4 (mai târziu): script sitemap automat + uniformizare convertoare cu redirecturi Netlify.

Spune-mi dacă vrei să-ți dau diff-ul `ARCHITECTURE.md` ca patch pe care îl aplici tu local pe Windows, ca să nu ating eu repo-ul tău live.
