'use client'

import { useReveal } from '@/hooks/useReveal'

const STATS = [
  { value: '3', label: 'Internships' },
  { value: '1', label: 'Research paper' },
  { value: '2+', label: 'Years in quant' },
  { value: '∞', label: 'Commits' },
]

export default function About() {
  const { ref: labelRef, isVisible: labelVisible } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()
  const { ref: bodyRef, isVisible: bodyVisible } = useReveal()
  const { ref: statsRef, isVisible: statsVisible } = useReveal()

  return (
    <section
      id="about"
      className="relative bg-bg-2 py-32 overflow-hidden"
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
              className="text-xs tracking-wider uppercase text-fg-2 border rounded-full px-4 py-1.5"
              style={{ borderColor: 'var(--border-pill)' }}
            >
              About
            </span>
          </div>

          {/* Heading */}
          <h2
            ref={headingRef}
            className={`text-3xl font-regular tracking-tight leading-none text-fg-1 mb-6 transition-all duration-700 ${
              headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
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
          </div>
        </div>

        {/* Right — stats */}
        <div
          ref={statsRef}
          className={`grid grid-cols-2 gap-px bg-border transition-all duration-700 delay-300 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {STATS.map(({ value, label }) => (
            <div
              key={label}
              className="bg-bg-card p-8 flex flex-col gap-2"
            >
              <span
                className="font-regular tracking-tight leading-none text-fg-1"
                style={{ fontSize: 'var(--text-2xl)' }}
              >
                {value}
              </span>
              <span className="text-sm uppercase tracking-wider text-fg-3">
                {label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}