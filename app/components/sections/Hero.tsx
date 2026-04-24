'use client'

import { useReveal } from '@/hooks/useReveal'

export default function Hero() {
  const { ref: headingRef, isVisible: headingVisible } = useReveal<HTMLHeadingElement>({ threshold: 0.1 })
  const { ref: subRef, isVisible: subVisible } = useReveal<HTMLParagraphElement>({ threshold: 0.1 })
  const { ref: ctaRef, isVisible: ctaVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section
      className="relative min-h-screen flex items-center bg-bg-hero overflow-hidden"
      style={{ background: `var(--gradient-hero), var(--bg-hero)` }}
    >
      {/* Decorative bg word */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute right-[-2%] top-1/2 -translate-y-1/2 font-bold text-fg-1/3 leading-none"
        style={{ fontSize: 'var(--text-bg-word)' }}
      >
        QUANT
      </span>

      <div className="max-w-6xl mx-auto px-6 py-32 w-full">

        {/* Label pill */}
        <div className="mb-8 flex items-center gap-3">
          <span
            className="inline-block text-xs tracking-wider uppercase text-fg-2 border rounded-full px-4 py-1.5"
            style={{ borderColor: 'var(--border-pill)' }}
          >
            Available for work · Bengaluru, IN
          </span>
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className={`font-regular tracking-tight leading-none text-fg-1 max-w-4xl transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 'var(--text-display)' }}
        >
          Quant dev.
          <br />
          <span className="text-fg-2">Systems that trade.</span>
        </h1>

        {/* Sub */}
        <p
          ref={subRef}
          className={`mt-8 text-md text-fg-2 max-w-xl leading-relaxed transition-all duration-700 delay-150 ${
            subVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Building algorithmic trading systems, backtesting platforms,
          and ML pipelines for NSE/BSE equities.
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          className={`mt-12 flex flex-wrap items-center gap-4 transition-all duration-700 delay-300 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-widest uppercase text-fg-1 border rounded-sm transition-all duration-300 hover:bg-fg-1/10"
            style={{ borderColor: 'var(--border-cta)' }}
          >
            View Work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm tracking-widest uppercase text-fg-2 hover:text-fg-1 transition-colors duration-300"
          >
            Get in touch →
          </a>
        </div>

      </div>
    </section>
  )
}