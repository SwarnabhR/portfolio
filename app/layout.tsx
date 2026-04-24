// app/layout.tsx
//
// ============================================================
// ROOT LAYOUT
// ============================================================
// In Next.js App Router, this file wraps EVERY page.
// It's the equivalent of the old _app.tsx + _document.tsx.
//
// LEARNING — Server Component:
// No 'use client' directive = this runs on the SERVER.
// That means it executes at build time (or request time for SSR),
// never in the browser. This is important for two reasons:
//   1. Font loading happens server-side — zero layout shift
//   2. Metadata is injected into <head> before the page reaches
//      the browser — good for SEO
// ============================================================

import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Navbar from './components/ui/Navbar';
import CustomCursor from './components/ui/CustomCursor';
import SmoothScroll from './components/providers/SmoothScroll';
import Footer from './components/sections/Footer';
import { Analytics } from "@vercel/analytics/next"

// ============================================================
// FONT LOADING
// ============================================================
// next/font/google downloads Manrope at BUILD TIME.
// It self-hosts the font on your domain — no Google request
// ever happens in the browser. This gives us:
//   - Zero CLS (Cumulative Layout Shift)
//   - Better privacy (no Google tracking pixel)
//   - Faster load (same origin as your site)
//
// variable: '--font-manrope'
//   Creates a CSS custom property injected on <html>.
//   In globals.css we reference it as var(--font-manrope).
//   This is the bridge between next/font and our token system.
//
// subsets: ['latin']
//   Only load the Latin character set. Loading all subsets
//   (cyrillic, greek etc.) wastes bandwidth for a site
//   that only uses Latin characters.
//
// weight: ['200','300','400','600','700']
//   Only load the 5 weights we actually use.
//   Unused weights = wasted bytes.
// ============================================================

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200','300','400','600','700'],
  variable: '--font-manrope',
  display: 'swap',
})

// ============================================================
// SITE METADATA
// ============================================================
// Next.js reads this exported object and auto-generates
// all <head> tags — <title>, <meta name="description">,
// Open Graph tags, robots directives etc.
//
// You never manually write a <head> tag anywhere in the app.
//
// LEARNING — template:
//   '%s — S. Roy' means individual pages set their own title
//   and Next.js appends ' — S. Roy' automatically.
//   e.g. Blog page exports title: 'Blog'
//        → browser tab shows: 'Blog — S. Roy'
//
//   default: 'S. Roy — ...' is what shows on the homepage
//   where no page-level title override exists.
// ============================================================
export const metadata: Metadata = {
  title: {
    template: '%s — S. Roy',
    default: 'S. Roy — Quant Developer & Designer',
  },
  description:
    'Portfolio of S. Roy (oxy) — quantitative research, fast-news analysis, algorithmic trading, deep learning, and ML engineering.',
  keywords: [
    'quantitative research',
    'algorithmic trading',
    'fast news analysis',
    'deep learning finance',
    'quantitative mathematics',
    'cross-asset models',
    'market reaction models',
    'international stock markets',
    'NYSE',
    'SSE',
    'LSE',
    'cryptocurrency trading',
    'forex trading',
    'commodity futures',
    'gold futures',
    'oil trading',
    'machine learning',
    'data science',
    'portfolio',
    'S. Roy',
    'oxy',
  ],
  authors: [{ name: 'S. Roy' }],
  creator: 'S. Roy',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/icon.svg'],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  // Open Graph — controls appearance when shared on
  // LinkedIn, Twitter/X, WhatsApp, Slack etc.
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'S. Roy',
    title: 'S. Roy — Quant Developer & Designer',
    description:
      'Portfolio of S. Roy (oxy) — quantitative research, fast-news analysis, algorithmic trading, deep learning, and ML engineering.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// ============================================================
// ROOT LAYOUT COMPONENT
// ============================================================
// {children} is the current page being rendered.
// Next.js automatically passes the matched page here.
//
// className on <html>:
//   manrope.variable   → injects '--font-manrope' CSS var
//
// suppressHydrationWarning on <html>:
//   Browser extensions (dark mode tools, password managers)
//   sometimes modify the DOM before React hydrates.
//   Without this prop, React throws a hydration mismatch
//   warning in the console. This silences it safely.
//
// NOTE — Three components are commented out below:
//   CustomCursor, Navbar, Footer
//   We'll uncomment these as we build each one.
//   Do NOT add them before the component files exist —
//   Next.js will throw a module-not-found error.
// ============================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'S. Roy',
    alternateName: 'oxy',
    jobTitle: 'Quant Developer',
    logo: '/logo-512.png',
    image: '/logo-512.png',
  }

  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <CustomCursor />
        <Navbar />
        <SmoothScroll>
          <main>{children}</main>
        </SmoothScroll>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
