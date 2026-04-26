# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
```

No test suite is configured.

## Architecture

Single-page portfolio (`app/page.tsx`) rendered via Next.js 16 App Router. All sections compose in order: Hero → About → Work → Testimonials → Services → FAQ → Contact. The root layout (`app/layout.tsx`) wraps every page with `CustomCursor`, `Navbar`, `SmoothScroll` (Lenis), `Footer`, and `@vercel/analytics`.

A fixed full-screen GIF (`app/5a934e84...gif`) is layered at `z-index: 9999` with `mix-blend-screen` and `opacity: 0.02` in the layout body to produce a subtle film-grain effect. Do not place any element above this z-index unless it is intentionally above the grain overlay (e.g., modal/dialog).

**Stack:** Next.js 16 · React 19 · Tailwind v4 · TypeScript · Lenis (smooth scroll)

### Key conventions

**Styling — always use design tokens, never raw values.**
- CSS custom properties are defined in `app/globals.css` and registered as Tailwind utilities via `@theme inline`.
- Semantic aliases (`--bg`, `--fg-1`, `--fg-2`, `--border`, etc.) map to raw palette values — use the semantic name in components, not the hex.
- Spacing uses a 4px-base token scale (`--space-1` → `--space-32`), exposed as Tailwind spacing (`p-4`, `gap-8`, etc.).
- Typography uses `--text-*` size tokens and `--weight-*` tokens. Only Manrope is loaded (weights 200/300/400/600/700).

**Gradients — atmospheric at entry and exit only.**
- `--gradient-hero` on the Hero section, `--gradient-contact` on Contact.
- Middle sections (About, Work, Services) are clean dark backgrounds — no gradient blobs.

**Animations — `useReveal` hook for scroll-triggered reveals.**
- `useReveal<T>()` returns `{ ref, isVisible }`. Attach `ref` to the element; toggle a CSS/Tailwind class on `isVisible`.
- Active nav link tracking uses `useActiveSection`, which watches IDs `about`, `work`, `services`, `contact` via IntersectionObserver.

**Section IDs must match** the list in `app/hooks/useActiveSection.ts` (`['about', 'work', 'services', 'contact']`) for nav highlighting to work.

**Client components** must declare `'use client'`. All hooks in `app/hooks/` are client-only. Layout and page files are Server Components by default.

### Design system reference

`design-system/` is **inspiration only** — it documents the Nyro Silvan Framer site aesthetic that informed the visual direction of this portfolio. This is *not* a spec to replicate. The actual site belongs to S. Roy (a quant & ML engineer), so content, layout, and components should reflect that identity, not the original designer's.

Draw from the design system for:
- Visual atmosphere: dark backgrounds, atmospheric radial gradients, oversized decorative typography, pill labels with `✦` prefix
- Interaction patterns: scroll-reveal animations, hover-expand service rows, custom cursor
- Token vocabulary: the CSS custom properties in `app/globals.css` are derived from `design-system/colors_and_type.css`

Do **not** copy:
- Nyro-specific content (Framer dev services, designer bio, testimonials, blog, playlists, gallery pages)
- Exact layouts — adapt them to what makes sense for a quant & ML engineer portfolio
- The Wireframes.html structure verbatim — it describes a 7-page designer site; this portfolio is currently a single-page app

Never import from `design-system/` into the app. It is read-only documentation.
