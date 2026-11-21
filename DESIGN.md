# DESIGN.md

The design system behind **mittalkumargupta.com** — a study rebuild of
[piergorelli.com](https://piergorelli.com/) populated with Mittal Kumar Gupta's
work. Read this before adding a section, a component, or a colour.

The whole visual language is deliberately small: **two typefaces, one accent,
twelve columns, four motion curves**. If a new element needs a fifth of
anything, it probably belongs to a different system.

---

## 1. Principles

1. **Paper, not glass.** Warm off-white surfaces, near-black ink, hairline
   rules. No gradients as decoration, no frosted panels, no drop shadows.
2. **Blueprint honesty.** Annotation labels, measurement boxes and mono
   captions are part of the aesthetic — the site shows its own construction.
3. **One accent at a time.** Blue is the default. Orange and lime are
   alternates, never simultaneous. The accent marks the current thing: active
   nav, links, progress, focus, the human dot.
4. **Motion explains, it does not perform.** Entrances are short, scroll work is
   scrubbed and reversible, and everything collapses under
   `prefers-reduced-motion`.
5. **Grid first.** Every section is a 12-column grid with the same gutter and
   column gap. Asymmetry is expressed by spanning columns, not by inventing
   margins.

---

## 2. Colour

Defined in `src/styles/tokens.css`.

### Light (default)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#f4f4f0` | page paper |
| `--bg-raised` | `#ecece6` | project art panels, inset surfaces |
| `--ink` | `#0e0e0d` | primary text, rules, solid buttons |
| `--muted` | `#65655f` | secondary copy, captions |
| `--line` | `#0e0e0d24` | hairline dividers |
| `--line-strong` | `#0e0e0d52` | section rules, outlines |
| `--control-line` | `#0e0e0d80` | button and input borders |
| `--accent` | `#2f5bff` | fill, dots, progress |
| `--accent-ink` | `#ffffff` | text on accent |
| `--accent-text` | `#2a52f0` | accent used as text (AA on paper) |
| `--danger` | `#c02b24` | form errors only |

### Dark

`[data-theme="dark"]` swaps paper for `#0b0b0c`, raised for `#151517`, ink for
`#edede7`, and lifts the accent (`--accent-text: var(--accent)`). It also sets
`color-scheme: dark` so native controls follow.

### Accents

| Name | Fill | Text-safe | Ink on fill |
| --- | --- | --- | --- |
| `blue` | `#2f5bff` | `#2a52f0` | white |
| `orange` | `#ff5a1f` | `#bb3505` | near-black |
| `lime` | `#c6f432` | `#4f6b00` | near-black |

Rules:

- Never place `--accent` text on `--bg` at small sizes; use `--accent-text`.
- The accent is set on `<html data-accent="…">` by the boot script and the
  palette, so it applies before paint.
- Dark blue is lightened to `#5b7cff` so it still reads on black.

---

## 3. Typography

Two variable families, self-hosted from `public/fonts/`:

- **Geist Variable** — everything editorial.
- **Geist Mono Variable** — labels, metadata, counters, code.

Both are subset into latin + latin-ext and declared with `woff2-variations`
and `font-display: swap`.

### Scale

| Token | Clamp | ≈ at 1440 |
| --- | --- | --- |
| `--step--1` | `clamp(0.8rem, 0.78rem + 0.1vw, 0.875rem)` | 14px |
| `--step-0` | `clamp(1rem, 0.96rem + 0.2vw, 1.125rem)` | 18px |
| `--step-1` | `clamp(1.25rem, 1.13rem + 0.6vw, 1.625rem)` | 26px |
| `--step-2` | `clamp(1.6rem, 1.3rem + 1.4vw, 2.5rem)` | 40px |
| `--step-3` | `clamp(2.2rem, 1.5rem + 3.2vw, 4.5rem)` | 70px |
| `--step-4` | `clamp(3rem, 1.6rem + 6.6vw, 8.5rem)` | 120px |
| `--step-5` | `clamp(3.6rem, 1.2rem + 11vw, 14rem)` | 178px |

### Roles

| Class | Size | Notes |
| --- | --- | --- |
| `.display` | `--step-5` | hero monogram line, CTA headline, service titles |
| `.h1` | `--step-4` | manifesto lines, page heroes |
| `.h2` | `--step-3` | process claim, work titles, inner page h1 |
| `.h3` | `--step-2` | footer claim, work stage titles |
| `.lead` | `--step-1` | intros, summaries |
| `.note` | `0.72rem` mono | uppercase, `letter-spacing: .02em`, muted |

Editorial headings use `font-weight: 500`, tight tracking (`-0.03em` to
`-0.065em`) and sub-1 line-height. Body copy sits at `--step-0` with `1.55`.

**Rule:** never set a raw `font-size` in a component. Use a step token or a
role class.

---

## 4. Layout

```
--gutter:    clamp(16px, 2.2vw, 32px)
--columns:   12
--col-gap:   clamp(12px, 1.4vw, 24px)
--section:   clamp(88px, 11vw, 180px)
--header-h:  4.5rem
```

- `.wrap` supplies the inline gutter. Every section uses
  `.section.wrap`.
- `.grid-12` is the shared 12-column grid. Children place themselves with
  `grid-column`.
- Section rhythm is `padding-top: var(--section)`. Sections do **not** add
  bottom padding; the next section's top padding provides the gap.
- `.section-head` is the recurring top row: a rule, a `[nn] Label` on the left,
  a mono aside on the right, and a large bottom margin
  (`clamp(48px, 7vw, 112px)`).

### Page frame

`body.frame` draws the fixed page border and the right-hand rail. The header is
fixed at 72px with a 7px tick rule and a scroll-progress fill. Content starts
below it; the hero uses `min-height: 100svh` with `padding-top: 6rem`.

### Breakpoints

| Query | Behaviour |
| --- | --- |
| `<= 1099px` | nav collapses to Menu, work stage unpins and stacks, side tab hides |
| `<= 767px` | hero meta simplifies, brand name hides, CTAs stack, manifesto indents removed |
| `<= 560px` | further type/spacing compression |
| `>= 1100px` | desktop-only rules (side tab, service body inset) |

---

## 5. Motion

Tokens:

```
--dur-1: 0.4s   --dur-2: 0.8s   --dur-3: 1.2s
--ease-in-out: cubic-bezier(0.76, 0, 0.24, 1)
--ease-out:    cubic-bezier(0.25, 1, 0.5, 1)
```

GSAP + ScrollTrigger and Lenis live in `Motion.tsx`. Hero, manifesto and process
effects are scrubbed, so they reverse when the user scrolls back; the work stage
is index-driven and eases to the active case.

| Moment | Behaviour |
| --- | --- |
| Preloader | monogram plot + percentage counter, ~1.8s, skipped on repeat visits and reduced motion |
| Hero | human line rises in, machine line resolves word by word; on scroll every glyph scatters outward from the headline centre |
| Blueprint | dashed measurement boxes draw in, then fade out and are removed |
| Reveals | `[data-reveal]` fades and rises 26px once at 90% viewport |
| Manifesto | solid text wipes over the outline via `clip-path` |
| Process line | draws left-to-right, scrubbed |
| Work stage | pinned; each scroll segment selects one case and GSAP slides the track a full panel, so a single case sits flush at rest |
| Terrain | marching-squares contour canvas; pointer raises the field; desktop only (hidden ≤767px), static under reduced motion |
| Cursor | custom crosshair on fine pointers, disabled on touch/reduced motion |

**Rules**

- Animate `transform`, `opacity` and `clip-path`; never animate layout.
- One scroll trigger per element. Kill every trigger on unmount.
- Negative-`z-index` layers (hero terrain) need an isolated parent, otherwise the
  page background paints over them.
- Reduced motion is not an afterthought: all content must be visible and
  static when `prefers-reduced-motion: reduce` matches.

---

## 6. Components

| Component | File | Responsibility |
| --- | --- | --- |
| `Providers` | `Providers.tsx` | theme, accent, palette, grid state, global keys |
| `Preloader` | `Preloader.tsx` | first-visit counter + monogram |
| `SiteHeader` | `SiteHeader.tsx` | fixed header, nav roll, tools, progress rule |
| `Hero` | `Hero.tsx` | human/machine title, notes, CTAs, terrain, blueprint |
| `TerrainCanvas` | `TerrainCanvas.tsx` | contour field reacting to pointer |
| `Blueprint` | `Blueprint.tsx` | transient spec overlay |
| `Manifesto` | `Manifesto.tsx` | three wireframe lines + wipe |
| `WorkStage` | `WorkStage.tsx` | pinned project stage |
| `ProjectArt` | `ProjectArt.tsx` | four hand-authored SVG schematics |
| `Services` | `Services.tsx` | hover-fill service rows |
| `Process` | `Process.tsx` | claim, line, four steps |
| `Now` | `Now.tsx` | current-work rows (replaces the reference blog) |
| `Cta` | `Cta.tsx` | closing headline + actions |
| `SiteFooter` | `SiteFooter.tsx` | claim, columns, signature, privacy spec |
| `CommandPalette` | `CommandPalette.tsx` | ⌘K navigation + appearance |
| `Cursor` | `Cursor.tsx` | crosshair cursor |
| `ContactForm` | `ContactForm.tsx` | mailto-based brief form |
| `PageHero` | `PageHero.tsx` | shared inner-page opening |
| `Monogram` | `Monogram.tsx` | plotted `MG` mark |
| `Motion` | `Motion.tsx` | Lenis/GSAP boot and all scroll work |

### Component rules

- A repeated item is a slot model: fixed columns, fixed type roles, content
  length must not move the edges.
- Buttons come in two variants only: solid (`--ink` fill) and ghost (1px
  `--control-line`). Both are pill-shaped, 44–52px tall.
- Cards are not used. Surfaces are separated by one means: a rule, a raised
  fill, or space — never all three.
- Icons are inline SVG with `aria-hidden`; no icon font.

---

## 7. Interaction

| Input | Result |
| --- | --- |
| `⌘K` / `Ctrl+K` | command palette |
| `G` | 12-column grid overlay |
| `Esc` | close palette / clear hover lock |
| theme button | light ↔ dark, persisted |
| accent button | blue → orange → lime, persisted |
| `Menu` (≤1099px) | opens the palette as navigation |

The boot script in `layout.tsx` restores theme, accent and preloader state
before first paint to avoid a flash.

---

## 8. Content model

`myData.json` is the single source of truth. `src/lib/content.ts` imports it,
types it, and derives:

- identity, monogram, coordinates, availability
- hero copy and CTAs
- work items (3 from the data + this site as item 04)
- services, process, now rows, CTA, footer

**Never hard-code a name, email, or project string in a component.** If a field
is empty in the data, do not render a dead link.

---

## 9. Accessibility

- Semantic landmarks: one `h1` per page, `main`, `nav`, `footer`.
- Focus is always visible: 2px accent outline with 2px offset.
- The custom cursor never replaces the native one on touch or reduced motion.
- All scroll-revealed content is visible without JavaScript.
- Colour pairs meet WCAG AA; accent text uses the darker `--accent-text`.
- Tap targets are ≥44px for controls; inline text links are exempt.
- Decorative canvas, grids, annotations and art are `aria-hidden`.

---

## 10. Do / Don't

**Do**

- Start from a token. If it is missing, add it to `tokens.css` once.
- Use the 12-column grid and `--section` for vertical rhythm.
- Keep one accent meaning "current".
- Test at 390, 768, 1024 and 1440.
- Check reduced motion before calling a motion change done.

**Don't**

- Add a third typeface, a gradient hero, or a shadow-based card.
- Animate `top`, `left`, `width` or `height` on scroll.
- Put a raw hex value in `site.css`.
- Invent awards, clients, posts or metrics that are not in the data.
- Ship the reference's copy or identity — this build is a study, not a clone
  for publication.

---

## 11. File map

```
src/
  app/            routes: /, /about, /work, /services, /contact, /privacy
  components/     one concern per file (see table above)
  lib/content.ts  typed data + all copy
  styles/
    tokens.css    palette, fonts, scale, spacing, motion
    site.css      layout and component styles
public/
  fonts/          Geist + Geist Mono (self-hosted)
  favicon.svg     plotted MG mark
  og.png          1200×630 share card
```

---

## 12. Provenance

The layout, interaction model and visual language are a deliberate study of
[piergorelli.com](https://piergorelli.com/) by Pier Gorelli. The code, copy and
SVG artwork here are original to this project, but the design direction belongs
to its author. Replace the identity and obtain permission before publishing
this as a commercial site.
