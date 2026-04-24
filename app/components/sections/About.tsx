'use client'

import { useReveal } from '@/hooks/useReveal'

const STATS = [
  { value: '3',  label: 'Internships',    align: 'left' },
  { value: '1',  label: 'Research paper', align: 'right' },
  { value: '2+', label: 'Years in quant', align: 'left' },
  { value: '∞',  label: 'Commits',        align: 'right' },
]

export default function About() {
  const { ref: labelRef,   isVisible: labelVisible   } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()
  const { ref: bodyRef,    isVisible: bodyVisible    } = useReveal()
  const { ref: statsRef,   isVisible: statsVisible   } = useReveal()

  return (
    <section
      id="about"
      className="relative py-32 overflow-hidden"
      style={{ background: `var(--gradient-about), var(--bg-2)` }}
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Left — text */}
        <div>
          {/* Label */}
          <div
            ref={labelRef}
            className={`mb-8 transition-all duration-500 ${
              labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span
              className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-fg-1 border rounded-full px-4 py-1.5"
              style={{ borderColor: 'var(--border-pill)' }}
            >
              ✦ About
            </span>
          </div>

          {/* Heading */}
          <h2
            ref={headingRef}
            className={`font-regular tracking-tight leading-none text-fg-1 mb-6 transition-all duration-700 ${
              headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ fontSize: 'var(--text-xl)' }}
          >
            Builder at the intersection of
            <span className="text-fg-2"> math and markets.</span>
          </h2>

          {/* Body */}
          <div
            ref={bodyRef}
            className={`space-y-4 transition-all duration-700 delay-150 ${
              bodyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-md text-fg-2 leading-relaxed">
              CS graduate with a focus on quantitative finance and
              algorithmic trading. I build systems that ingest, analyze,
              and act on market data — from raw tick feeds to fully
              backtested strategies.
            </p>
            <p className="text-md text-fg-2 leading-relaxed">
              Currently developing a backtesting platform for NSE/BSE
              equities and exploring ML models for signal generation.
              Based in Bengaluru.
            </p>

            {/* Ghost CTAs */}
            <div className="flex gap-6 pt-4">
              <a
                href="#contact"
                className="text-sm text-fg-1 inline-flex items-center gap-1 border-b pb-0.5 hover:text-fg-2 transition-colors duration-300"
                style={{ borderColor: 'var(--border-pill)' }}
              >
                book a call ↗
              </a>
              <a
                href="/cv.pdf"
                className="text-sm text-fg-2 inline-flex items-center gap-1 hover:text-fg-1 transition-colors duration-300"
              >
                download cv ↗
              </a>
            </div>
          </div>
        </div>

        {/* Right — alternating stats stack */}
        <div
          ref={statsRef}
          className={`flex flex-col gap-6 transition-all duration-700 delay-300 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {STATS.map(({ value, label, align }) => (
            <div
              key={label}
              className={`flex flex-col gap-1 ${
                align === 'right' ? 'items-end text-right' : 'items-start text-left'
              }`}
            >
              <span
                className="font-regular tracking-tight leading-none text-fg-1"
                style={{ fontSize: 'var(--text-2xl)' }}
              >
                {value}
              </span>
              <span className="text-xs uppercase tracking-wider text-fg-3">
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}