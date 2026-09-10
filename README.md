# Maison Noir — Cinematic Perfume Experience

A dark, editorial, four-page fragrance website. Built as one coherent brand
universe with a single design system and motion language.

```
Home   /            Cinematic hero, brand statement, signature, horizontal collection, surprise reveal, final CTA
About  /about       Story, atelier, philosophy, craftsmanship, ingredients, people, values, surprise, closing
Fragrances /fragrances  Hero, filters/search/sort, featured, asymmetric grid, detail drawer, final CTA
Contact /contact    Hero, letter form (with success state), info, FAQ, final CTA
```

## Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS** with a custom `ink / bone / champagne` palette
- **Framer Motion 11** for all motion (scroll-linked, whileInView, springs)
- **Lenis 1.1** for cinematic smooth scroll (auto-disabled on touch and
  reduced-motion)
- **react-router-dom 7** for the four pages with `AnimatePresence` transitions
- **Google Fonts** (`Cormorant Garamond` display, `Inter`, `JetBrains Mono`)

## Run

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

```bash
npm run build     # type-check + production bundle
npm run preview   # serve the built site
```

## Design system

- **Colors** — `ink-950/900/850/800/700` (deep charcoal), `bone-50…300`
  (warm ivory), `champagne-400/500/600/700` (soft gold accents). All defined
  in `tailwind.config.js` and mirrored as CSS variables in `src/index.css`.
- **Type** — Cormorant Garamond for editorial display + italic accents,
  Inter for body/UI, JetBrains Mono for eyebrows, chips, and metadata.
- **Surface** — Glass, grain, vignette, radial light apertures. Utility
  classes `.grain`, `.vignette`, `.soft-glow`, `.text-outline`,
  `.hairline-shimmer`, `.float-slow`, `.marquee-track` all live in the CSS.

## Architecture

```
src/
├── App.tsx                    Router + SiteLayout
├── main.tsx
├── index.css                  Design tokens, grain, vignette, utilities
├── data/
│   └── products.ts            Fragrance model, catalogue, formatters
├── hooks/
│   └── useLenis.ts            Global smooth scroll
├── components/
│   ├── CustomCursor.tsx       Dot + inertial ring, morphs on data-cursor
│   ├── Navbar.tsx             Glass-on-scroll, active link, mobile overlay
│   ├── ScrollProgress.tsx     Vertical hairline + percentage
│   ├── layout/
│   │   └── SiteLayout.tsx     Cursor + nav + progress + footer + page transitions
│   ├── atoms/
│   │   ├── GlassCard.tsx      Blurred glass surface
│   │   ├── MagneticButton.tsx Magnetic hover, primary/ghost/ring variants
│   │   ├── PerfumeBottle.tsx  SVG bottle, floating, scroll-reactive
│   │   └── TextReveal.tsx     TextReveal + WordsReveal (staggered)
│   └── sections/              Home-page sections + shared Footer
└── pages/
    ├── HomePage.tsx
    ├── AboutPage.tsx
    ├── ProductsPage.tsx
    └── ContactPage.tsx
```

## Product data

`src/data/products.ts` is the single source of truth. Every card, the
featured section, and the detail drawer read from this file. Swap the
objects for real products or wire to an API without touching any component.

```ts
interface Fragrance {
  id, slug, index, name, tagline
  category, audience, fragranceFamily
  description, story
  topNotes, heartNotes, baseNotes
  image, gallery, accent
  intensity, longevity, bestFor        // for indicators
  sizes: { ml, price }[]               // multiple sizes, INR
  currency, featured?, isNew?, available?
}
```

## Cursor

Any element (or an ancestor) with `data-cursor="button|image|product"` is
picked up by `CustomCursor`. Add `data-cursor-label="View"` to change the
inline text. Automatically disabled on touch and `prefers-reduced-motion`.

## Accessibility

- Semantic HTML (`main`, `section`, `article`, `nav`, `footer`, headings)
- Keyboard access: focus rings, `aria-expanded` on FAQ, escape closes drawer
- Alt text on all images, `aria-label` on icon-only controls
- `prefers-reduced-motion` respected — Lenis skipped, idle CSS loops paused

## Notes

- The contact form is a **frontend preview only**: the copy inside the form
  and the success state say so plainly. Wire to a backend before shipping.
- All prices, notes, and stories are placeholder editorial copy — swap in
  the products data file.
- The five Unsplash images are stand-ins for hero and product photography.
