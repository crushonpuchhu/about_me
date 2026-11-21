# Mittal Kumar Gupta — Portfolio

A Next.js portfolio for **Mittal Kumar Gupta**, AI engineer and full-stack
developer. Warm paper, near-black ink, one accent, a plotted `MG` monogram, a
contour terrain hero and a pinned work stage.

The design is a deliberate study rebuild of
[piergorelli.com](https://piergorelli.com/) — same grid, type rhythm and
interaction model — populated entirely with Mittal's data. See
[Provenance & disclaimer](#provenance--disclaimer) before publishing.

---

## Stack

| Piece | Version |
| --- | --- |
| Next.js (App Router, Turbopack) | 16.4.6 |
| React | 19.2 |
| TypeScript | 5.7 |
| GSAP + ScrollTrigger | 3.15 |
| Lenis | 1.3 |
| CSS | plain CSS, no framework |

All fonts and images are self-hosted in `public/`. There are no analytics,
trackers, cookie banners or third-party embeds.

---

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Production:

```bash
npm run build
npm run start      # http://localhost:3000
npm run typecheck  # tsc --noEmit
```

Node 20+ recommended.

---

## Edit the content

`myData.json` is the single source of truth (name, role, location, links,
education, experience, skills, projects, availability). `src/lib/content.ts`
imports it, types it, and derives every string the site renders — hero copy,
work items, services, process, now rows, CTA and footer.

- Change personal details → `myData.json`.
- Change editorial copy → the exported objects in `src/lib/content.ts`.
- Empty `linkedin`, `twitter`, `instagram` or project URLs are intentionally not
  rendered. Fill them in and the links appear.

---

## Structure

```
src/
  app/
    layout.tsx        metadata, JSON-LD, boot script, header/footer/motion
    page.tsx          home
    about/page.tsx
    work/page.tsx
    services/page.tsx
    contact/page.tsx
    privacy/page.tsx
  components/         one concern per file (see DESIGN.md §6)
  lib/content.ts      typed data + all site copy
  styles/
    tokens.css        palette, fonts, type scale, spacing, motion
    site.css          layout + components
public/
  fonts/              Geist + Geist Mono variable woff2
  favicon.svg
  og.png              1200×630 share card
myData.json           source data
DESIGN.md             the design system
```

---

## Fonts

`public/fonts/` contains the **Geist** and **Geist Mono** variable woff2 files
(latin + latin-ext), downloaded from the reference site. Geist is licensed
under the SIL Open Font License 1.1 by Vercel. Keep the OFL notice if you
redistribute the font files.

---

## Signature interactions

- Preloader with a plotted monogram and percentage counter (first visit only).
- Hero line typed word-by-word and scattered glyph-by-glyph on scroll; contour
  terrain reacts to the pointer.
- Transient blueprint annotations that draw in and fade away.
- Outline → solid manifesto wipe.
- Pinned work stage: vertical scroll advances one case at a time and GSAP slides
  the track a full panel, so a case is never left half on screen; count, stage
  bars and rail track progress.
- Hover-fill service rows and a drawn process line.
- ⌘K command palette, `G` grid overlay, theme and accent switchers.
- Custom crosshair cursor on fine pointers only.
- Full `prefers-reduced-motion` fallback: no pinning, no preloader, all content
  visible.

---

## QA

The build has been checked with Playwright at 390, 768, 1024 and 1440:

- zero console errors, zero 404s
- `scrollWidth === clientWidth` on every route
- one `h1` per page, no image without alt text
- section heights match the reference at 1440 (hero 900, manifesto 820,
  work 6986, services 1038, process ~680, now 698, CTA 702, footer 741)

To repeat a quick visual pass, run the site on port 3111 and screenshot with
Playwright, or open the routes manually.

---

## Deploy

Static pages are prerendered. Any Node host works (Vercel, Netlify, a VPS):

```bash
npm run build
npm run start -- -p 3000
```

Set the canonical domain in `src/app/layout.tsx` (`metadataBase`) and in each
page's `alternates.canonical` before going live.

---

## Provenance & disclaimer

This project recreates the **layout, visual language and interaction model** of
[piergorelli.com](https://piergorelli.com/) by Pier Gorelli as a learning
study. The implementation, copy, `MG` monogram, SVG project art and data are
original to this repository. The design direction, however, belongs to its
author.

Before using this commercially or publishing it as your own identity:

1. replace the visual identity (monogram, art, copy) with your own, or
2. obtain permission from the original designer.

No affiliation with or endorsement by Pier Gorelli is implied.
