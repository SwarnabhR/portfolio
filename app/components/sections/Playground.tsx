'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import CtaLink from '@/components/ui/CtaLink'

const TAGS = ['Pyodide', 'Zustand', 'Canvas', 'Python']

export default function Playground() {
  const { ref: labelRef,   isVisible: labelVisible   } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()
  const { ref: cardRef,    isVisible: cardVisible    } = useReveal()
  const { ref: ctaRef,     isVisible: ctaVisible     } = useReveal()

  return (
    <section id="playground" className="relative bg-bg py-16 md:py-28 overflow-hidden">

      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-4 right-0 font-light leading-none tracking-tight whitespace-nowrap"
        style={{ fontSize: 'var(--text-bg-word)', opacity: 0.03, color: 'var(--fg-1)' }}
      >
        Playground
      </span>

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Label */}
        <div
          ref={labelRef}
          className={`mb-8 transition-all duration-500 ${
            labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span
            className="inline-flex items-center gap-2 text-xs tracking-wider uppercase border rounded-full px-4 py-1.5"
            style={{ color: 'var(--fg-1)', borderColor: 'var(--border-pill)' }}
          >
            ✦ Playground
          </span>
        </div>

        {/* Heading + subtext */}
        <div
          ref={headingRef}
          className={`mb-12 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2
            className="font-light tracking-tight leading-none mb-4"
            style={{ fontSize: 'var(--text-3xl)', color: 'var(--fg-1)', letterSpacing: '-0.02em' }}
          >
            experiments.
          </h2>
          <p className="font-light max-w-xl" style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', lineHeight: 1.7 }}>
            interactive demos and research tools built alongside my main work.
          </p>
        </div>

        {/* Featured card — Backtesting Engine */}
        <div
          ref={cardRef}
          className={`transition-all duration-700 ${
            cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div
            className="border rounded p-7 md:p-7"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: 'rgba(255,255,255,0.07)',
              marginTop: 48,
            }}
          >
            {/* Top row — status chip + link */}
            <div className="flex items-center justify-between gap-6 mb-4">
              <div className="flex items-center gap-3">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: 'rgba(34,197,94,0.8)' }}
                />
                <span className="text-xs tracking-wider uppercase" style={{ color: 'rgba(34,197,94,0.8)' }}>
                  Live — Trial
                </span>
              </div>
              <CtaLink href="/playground/backtesting-engine">
                Open engine ↗
              </CtaLink>
            </div>

            {/* Title */}
            <h3
              className="font-light tracking-tight mb-3"
              style={{
                fontSize: 'clamp(20px, 3vw, 32px)',
                color: 'var(--fg-1)',
                letterSpacing: '-0.01em',
              }}
            >
              Backtesting Engine
            </h3>

            {/* Description */}
            <p
              className="font-light mb-5"
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--fg-2)',
                maxWidth: 520,
                lineHeight: 1.65,
              }}
            >
              Run quantitative strategies entirely in-browser. Multi-exchange support, walk-forward optimization, Pyodide runtime.
            </p>

            {/* Tag pills */}
            <div className="flex flex-wrap gap-2">
              {TAGS.map(tag => (
                <span
                  key={tag}
                  className="text-xs tracking-wide border rounded-full px-3 py-1.5"
                  style={{ color: 'var(--fg-3)', borderColor: 'var(--border)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Upcoming hint */}
          <p
            className="font-light text-sm mt-8"
            style={{ color: 'var(--fg-3)', lineHeight: 1.6 }}
          >
            more experiments in progress — {' '}
            <Link
              href="/playground/backtesting-engine#early-access"
              className="transition-colors duration-300 underline"
              style={{ color: 'var(--fg-3)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-2)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-3)')}
            >
              join the waitlist
            </Link>
          </p>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`transition-all duration-500 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ marginTop: 40 }}
        >
          <CtaLink href="/playground">
            explore all ↗
          </CtaLink>
        </div>

      </div>
    </section>
  )
}
