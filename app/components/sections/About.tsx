'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'
import CtaLink from '@/components/ui/CtaLink'

const STATS = [
  { value: '3',  label: 'Internships',    badge: 'right' },
  { value: '1',  label: 'Research paper', badge: 'left'  },
  { value: '2+', label: 'Years in quant', badge: 'right' },
  { value: '∞',  label: 'Commits',        badge: 'left'  },
]

const ACCENTS = ['#a060ff', '#cc2244', '#4488cc', '#8844aa']

export default function About() {
  const [hovered, setHovered] = useState<number | null>(null)

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

        {/* Left — bio */}
        <div>
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

          <h2
            ref={headingRef}
            className={`font-regular tracking-tight leading-snug text-fg-1 mb-6 transition-all duration-700 ${
              headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ fontSize: 'var(--text-xl)' }}
          >
            Builder at the intersection of
            <span className="text-fg-2"> math and markets.</span>
          </h2>

          <div
            ref={bodyRef}
            className={`space-y-4 transition-all duration-700 delay-150 ${
              bodyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-md text-fg-2 leading-relaxed">
              CS graduate with a focus on quantitative finance and
              algorithmic trading. I build systems that ingest, analyze,
              and act on global market data — from raw tick feeds to
              fully backtested strategies.
            </p>
            <p className="text-md text-fg-2 leading-relaxed">
              Currently developing backtesting and research workflows for
              NSE/BSE, NYSE, SSE, and LSE equities, while also handling
              cryptocurrencies, forex, and commodity futures like gold and
              oil. Based in Bengaluru.
            </p>
            <p className="text-md text-fg-2 leading-relaxed">
              My research blends fast news, deep learning, and quantitative
              mathematics to model how one market reaction flows into
              another. Everything is linked, so I build explainable models
              that trace those dependencies instead of treating signals in
              isolation.
            </p>

            <div className="flex gap-4 pt-4 flex-wrap">
              <CtaLink href="#contact">book a call ↗</CtaLink>
              <CtaLink href="/cv.pdf">download cv ↗</CtaLink>
            </div>
          </div>
        </div>

        {/* Right — alternating stat rows */}
        <div
          ref={statsRef}
          className="flex flex-col gap-0"
        >
          {STATS.map(({ value, label, badge }, i) => {
            const accent  = ACCENTS[i]
            const isHov   = hovered === i
            const isDimmed = hovered !== null && !isHov

            return (
              <div
                key={label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="flex items-center justify-end gap-4 py-4 border-b"
                style={{
                  borderColor: 'var(--border)',
                  opacity: isDimmed ? 0.22 : statsVisible ? 1 : 0,
                  transform: statsVisible
                    ? isHov ? 'translateX(-4px)' : 'translateX(0)'
                    : 'translateX(20px)',
                  transition: `opacity 0.5s ease, transform 0.7s ease ${i * 80 + 300}ms`,
                  cursor: 'default',
                }}
              >
                {badge === 'left' && (
                  <span
                    className="inline-flex items-center justify-center shrink-0 rounded-full"
                    style={{
                      width: 34, height: 34,
                      background: isHov ? `${accent}14` : 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      fontSize: 11, fontWeight: 500,
                      color: isHov ? accent : 'rgba(255,255,255,0.5)',
                      transition: 'color 0.5s, background 0.5s',
                    }}
                  >
                    {value}
                  </span>
                )}

                <span
                  className="font-regular tracking-tight flex-1"
                  style={{
                    fontSize: 'clamp(32px, 5vw, 52px)',
                    letterSpacing: '-0.03em',
                    lineHeight: 1.15,
                    textAlign: badge === 'left' ? 'left' : 'right',
                    color: isHov ? accent : 'rgba(255,255,255,0.85)',
                    transition: 'color 0.5s, opacity 0.5s',
                  }}
                >
                  {label}
                </span>

                {badge === 'right' && (
                  <span
                    className="inline-flex items-center justify-center shrink-0 rounded-full"
                    style={{
                      width: 34, height: 34,
                      background: isHov ? `${accent}14` : 'rgba(255,255,255,0.07)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      fontSize: 11, fontWeight: 500,
                      color: isHov ? accent : 'rgba(255,255,255,0.5)',
                      transition: 'color 0.5s, background 0.5s',
                    }}
                  >
                    {value}
                  </span>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
