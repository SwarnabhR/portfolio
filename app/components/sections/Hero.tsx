'use client'

import { useReveal } from '@/hooks/useReveal'

export default function Hero() {
  const { ref: headingRef, isVisible: headingVisible } = useReveal<HTMLHeadingElement>({ threshold: 0.1 })
  const { ref: subRef, isVisible: subVisible } = useReveal<HTMLParagraphElement>({ threshold: 0.1 })
  const { ref: ctaRef, isVisible: ctaVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: `var(--gradient-hero), var(--bg-hero)` }}
    >
      {/* Grid crosshatch overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative bg word */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-8 left-6 font-light text-fg-1/3 leading-none tracking-tight"
        style={{ fontSize: 'var(--text-bg-word)' }}
      >
        Portfolio
      </span>

      <div className="relative max-w-6xl mx-auto px-6 py-32 w-full">

        {/* Available pill */}
        <div className="mb-8">
          <span
            className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-fg-1 border rounded-full px-4 py-1.5"
            style={{ borderColor: 'var(--border-pill)' }}
          >
            ✦ Available for work · Bengaluru, IN
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

        {/* Two-col sub layout */}
        <div className="mt-12 grid md:grid-cols-2 gap-8 items-end max-w-4xl">
          {/* Left — bio */}
          <p
            ref={subRef}
            className={`text-md text-fg-2 leading-relaxed transition-all duration-700 delay-150 ${
              subVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Building algorithmic trading systems, backtesting platforms,
            and ML pipelines for NSE/BSE equities.
          </p>

          {/* Right — CTA */}
          <div
            ref={ctaRef}
            className={`flex flex-col items-start gap-3 transition-all duration-700 delay-300 ${
              ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <a
              href="#contact"
              className="text-sm text-fg-1 inline-flex items-center gap-1 border-b pb-0.5 hover:text-fg-2 transition-colors duration-300"
              style={{ borderColor: 'var(--border-pill)' }}
            >
              contact me ↗
            </a>
            <a
              href="#work"
              className="text-sm text-fg-2 inline-flex items-center gap-1 hover:text-fg-1 transition-colors duration-300"
            >
              see all works ↗
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}