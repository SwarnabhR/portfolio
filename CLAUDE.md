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

**Multi-page Next.js 16 App Router portfolio** owned by S. Roy (quant & ML engineer).

**Routes:**
- `/` — single-page scrollable homepage (Hero → About → Work → Testimonials → Services → FAQ → Contact → CommentsSection)
- `/blog` + `/blog/[slug]` — blog list and individual post pages
- `/work` — full work/projects page
- `/gallery` — photo gallery
- `/playlist` — Spotify playlists
- `/playground` — experimental demos
- `/studio/[[...tool]]` — Sanity Studio (CMS editor)

**Root layout** (`app/layout.tsx`) wraps every page with: `CustomCursor`, `Navbar`, `SectionNav`, `SmoothScroll` (Lenis), `PageTransition`, `Footer`, `@vercel/analytics`.

A fixed full-screen GIF (`app/5a934e84...gif`) is layered at `z-index: 9999` with `mix-blend-screen` and `opacity: 0.02` to produce a subtle film-grain effect. **Do not place any element above z-index 9999** unless it must be intentionally above grain (e.g., modal/dialog).

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind v4 · Lenis · Sanity v5 · Resend · Upstash Redis · Spotify API

## Key conventions

### Styling — always use design tokens, never raw values

CSS custom properties are defined in `app/globals.css` and registered as Tailwind utilities via `@theme inline`. Use the semantic alias in components, never the raw hex or pixel value.

```css
/* Color hierarchy */
--bg: #050506          /* page background */
--fg-1: #ffffff        /* headings */
--fg-2: #ffffffb3      /* body text (70% opacity) */
--fg-3: #ffffff41      /* captions (25% opacity) */
--border: rgba(255,255,255,0.12)
--border-pill: rgba(255,255,255,0.25)

/* Text sizes (key entries) */
--text-xs: 11px        /* pill labels */
--text-md: 20px        /* body default */
--text-3xl: 64px       /* section headings */
--text-display: clamp(62px, 10vw, 120px)   /* hero h1 */

/* Spacing — 4px base scale */
--space-1: 4px  →  --space-32: 128px
```

**Responsive sizing** uses `clamp()` rather than breakpoint prefixes. Avoid `md:text-lg` style utility classes; fluid scaling is preferred.

### Gradients — atmospheric at entry and exit only

- `--gradient-hero` on Hero, `--gradient-contact` on Contact.
- Middle sections (About, Work, Services, etc.) are **clean dark backgrounds** — no gradient blobs.

### Animations — `useReveal` for scroll-triggered reveals

`useReveal<T>()` returns `{ ref, isVisible }`. Attach `ref` to the element; toggle opacity/transform class on `isVisible`. Triggers once (unobserves after first visibility).

### Section IDs

**Section IDs must match** the list in `app/hooks/useActiveSection.ts` (`['about', 'work', 'services', 'contact']`) for nav highlighting to work. Add a new ID to that list when creating a nav-tracked section.

### Client vs Server components

**Client components** must declare `'use client'`. All hooks in `app/hooks/` are client-only. Layout and page files are Server Components by default. Fetch data in server components and pass as props to client components.

### Responsive design

`SectionNav` is `hidden lg:flex`. `SpotifyWidget` uses `max-width: min(240px, 44vw)`. No JS-based breakpoints — pure CSS.

## File map

```
app/
  page.tsx              # Homepage (server, parallel Sanity fetch)
  layout.tsx            # Root layout (server)
  globals.css           # Design tokens + Tailwind theme + keyframes
  sitemap.ts            # Dynamic sitemap
  error.tsx             # Error boundary
  not-found.tsx         # 404
  5a934e84...gif        # Film grain overlay asset

  api/
    contact/            # POST: validate → Sanity doc + Resend email
    comments/           # GET: list; POST: create (rate-limited 5/hr/IP)
    visitors/           # GET/POST: visitor counter (Upstash Redis)
    spotify/now-playing/# GET: currently playing track (cached token)
    auth/spotify/       # Spotify OAuth initiation + callback
    lastfm/             # Last.fm stats
    admin/verify/       # Admin auth endpoint

  blog/
    page.tsx            # Blog list (server)
    [slug]/page.tsx     # Individual post (server, Portable Text)
    BlogClient.tsx      # Sorting/filtering UI (client)
    loading.tsx         # Suspense skeleton

  work/page.tsx         # Full work page (server)
  gallery/page.tsx      # Gallery (server + GalleryClient)
  playlist/page.tsx     # Playlist (server + PlaylistClient)
  playground/page.tsx   # Experimental demos
  studio/[[...tool]]/page.tsx  # Sanity Studio (client)

  components/
    providers/
      SmoothScroll.tsx  # Lenis initializer wrapper
    sections/
      Hero.tsx          # Animated blobs, parallax fade, CTA
      About.tsx
      Work.tsx          # Experience timeline + stack pills
      Testimonials.tsx  # Cards from Sanity
      Services.tsx
      FAQ.tsx           # Accordion
      Contact.tsx       # Form → /api/contact
      CommentsSection.tsx
      Footer.tsx
    ui/
      Navbar.tsx        # Fixed header + fullscreen overlay menu
      CustomCursor.tsx  # Ring + dot cursor, expands on hover
      SectionNav.tsx    # Left-side sticky section indicator (lg only)
      PageTransition.tsx# Fade+slide on route change
      SpotifyWidget.tsx # Top-right now-playing (hides near contact)
      CtaLink.tsx       # Gradient-border CTA button
      SectionLabel.tsx  # Pill label with ✦ prefix
      VisitorCount.tsx

  hooks/
    useReveal.ts        # IntersectionObserver → { ref, isVisible }
    useLenis.ts         # Initialize Lenis smooth scroll
    useActiveSection.ts # Track active nav section
    useScrollY.ts       # window.scrollY tracker

sanity/
  schemaTypes/
    blog.ts project.ts gallery.ts playlist.ts
    testimonial.ts faqItem.ts service.ts
    comment.ts contactSubmission.ts
  lib/
    client.ts           # Sanity client (useCdn: true for reads)
    image.ts            # Image URL builder
  structure.ts          # Studio sidebar layout
  env.ts                # Env var assertions

sanity.config.ts        # Studio config (structureTool + visionTool)
next.config.ts          # Image remote patterns + static asset cache headers
```

## Data layer (Sanity)

- Project ID: `dch96v4a` · Dataset: `production`
- Public reads use CDN (`useCdn: true`). Write routes use a private `SANITY_API_TOKEN`.
- All queries use GROQ. Load the schema with `get_schema` before writing queries.
- Content types: `blog`, `project`, `gallery`, `playlist`, `testimonial`, `faqItem`, `service`, `comment`, `contactSubmission`.
- Blog post body uses Portable Text — render with `@portabletext/react`.
- Images use `@sanity/image-url` builder from `sanity/lib/image.ts`.

**Homepage data flow:** `app/page.tsx` fetches testimonials, FAQs, and services in parallel at request time, passes as props to section components.

## API route patterns

**Rate limiting** uses an in-memory `Map<ip, { count, reset }>` — resets on server restart; not persistent across deployments. Contact: 3/hr, Comments: 5/hr.

**Spotify token** is cached in memory until expiry. On error, returns `{ isPlaying: false }` gracefully.

**Contact form** → POST `/api/contact` → creates `contactSubmission` in Sanity + sends email via Resend.

**Comments** → GET `/api/comments` (all comments) + POST `/api/comments` (new comment → Sanity).

**Visitor counter** → GET/POST `/api/visitors` → Upstash Redis `INCR`/`GET`.

## Environment variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
SANITY_API_TOKEN              # write token (contact, comments routes)

SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
SPOTIFY_REFRESH_TOKEN

UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN

RESEND_API_KEY
```

## Design system reference

`design-system/` is **inspiration only** — it documents the Nyro Silvan Framer site aesthetic that informed the visual direction of this portfolio. It is *not* a spec to replicate.

Draw from the design system for:
- Visual atmosphere: dark backgrounds, atmospheric radial gradients, oversized decorative typography, pill labels with `✦` prefix
- Interaction patterns: scroll-reveal animations, hover-expand service rows, custom cursor
- Token vocabulary: the CSS custom properties in `app/globals.css` are derived from `design-system/colors_and_type.css`

Do **not** copy:
- Nyro-specific content (Framer dev services, designer bio, testimonials, blog, playlists, gallery pages)
- Exact layouts — adapt them to what makes sense for a quant & ML engineer portfolio
- The Wireframes.html structure verbatim — it describes a 7-page designer site

**Never import from `design-system/` into the app.** It is read-only documentation.
