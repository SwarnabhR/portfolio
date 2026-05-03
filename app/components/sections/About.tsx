'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'
import CtaLink from '@/components/ui/CtaLink'

const STATS = [
  { value: '2+',  label: 'years building systems', badge: 'right' },
  { value: '20+', label: 'production deployments', badge: 'left'  },
  { value: '6+',  label: 'programming languages', badge: 'right' },
]

const ACCENTS = ['#ffffff', '#e8e8e8', '#f5f5f5', '#e0e0e0']

const CONTENT = [
  {
    heading: 'real-time systems & backends.',
    body: 'building event-driven architectures that handle high throughput with low latency. real-time data pipelines, distributed state management, and infrastructure that doesn\'t break under load. kafka, rust, c++, cuda. whether it\'s exchange order books, live ml inference, or blockchain state transitions—the engineering principles are similar: think in streams, eliminate unnecessary buffering, and design for failure gracefully.'
  },
  {
    heading: 'machine learning & research.',
    body: 'deep learning and ml across computer vision (deepfake detection research), time-series forecasting, and signal extraction. end-to-end: architecture design, training, validation, interpretability. shipped ml in trading systems but equally interested in vision, nlp, and domains where neural networks unlock new capabilities. python, pytorch, rigorous experimental methodology.'
  },
  {
    heading: 'algorithmic trading.',
    body: 'strategy research, backtesting infrastructure, and live execution systems. signal extraction across equities, crypto perpetuals, forex. walk-forward validation, realistic cost modeling, and understanding how markets move. built systems that process tick-level data and trade across multiple asset classes. interesting blend of quantitative analysis, low-latency engineering, and risk management.'
  },
  {
    heading: 'blockchain & crypto.',
    body: 'hands-on with smart contracts, dex mechanics, protocol design, and on-chain economics. built systems for state verification, incentive alignment, and trading on blockchain. interested in where crypto intersects with ml (prediction markets, on-chain oracles) and systems design (consensus, slashing, finality). the cryptographic side fascinates me as much as the trading applications.'
  }
]

export default function About() {
  const [hovered, setHovered] = useState<number | null>(null)

  const { ref: labelRef,   isVisible: labelVisible   } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()
  const { ref: bodyRef,    isVisible: bodyVisible    } = useReveal()
  const { ref: statsRef,   isVisible: statsVisible   } = useReveal()

  return (
    <section
      id="about"
      className="relative bg-bg py-16 md:py-32 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 md:gap-16 items-center">

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
            className={`font-regular tracking-tight leading-snug text-fg-1 mb-8 transition-all duration-500 ${
              headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ fontSize: 'clamp(22px, 5.5vw, 32px)' }}
          >
            {hovered !== null ? CONTENT[hovered].heading : 'building across ml, trading systems, and blockchain infrastructure.'}
          </h2>

          <div
            ref={bodyRef}
            className={`space-y-4 transition-all duration-500 delay-150 ${
              bodyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-base text-fg-2 leading-relaxed">
              {hovered !== null ? CONTENT[hovered].body : 'i build systems that work. cs graduate based in bengaluru, with hands-on experience across machine learning, algorithmic trading, blockchain, and real-time backends. i care about clean architecture and systems that scale, but code quality and shipping what works matters more. expertise in python, rust, c++, and designing systems without overengineering.'}
            </p>

            <div className="flex gap-4 pt-4 flex-wrap">
              <CtaLink href="#contact">book a call ↗</CtaLink>
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
                onClick={() => setHovered(hovered === i ? null : i)}
                className="flex items-center justify-end gap-4 py-4 border-b cursor-pointer md:cursor-default"
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
                      fontSize: 'var(--text-xs)', fontWeight: 500,
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
                    fontSize: 'clamp(22px, 5vw, 52px)',
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
                      fontSize: 'var(--text-xs)', fontWeight: 500,
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

