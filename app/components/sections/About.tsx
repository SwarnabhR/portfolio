'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'
import CtaLink from '@/components/ui/CtaLink'

const STATS = [
  { value: '1+',  label: 'years professional', badge: 'right' },
  { value: '30+', label: 'technologies mastered', badge: 'left'  },
  { value: '6+',  label: 'programming languages', badge: 'right' },
]

const ACCENTS = ['#ffffff', '#e8e8e8', '#f5f5f5', '#e0e0e0']

const CONTENT = [
  {
    heading: 'treasury & financial systems.',
    body: 'enterprise treasury platform architecture on SAP BTP. built AI-driven forecasting for AR/AP cashflow prediction, FX-volatility modeling, and working capital optimization. experience with end-to-end platform engineering: data orchestration, federated inference, mlops pipelines, and production-grade compliance frameworks. strong domain expertise in treasury workflows, financial modeling, and enterprise integration patterns.'
  },
  {
    heading: 'real-time systems & data pipelines.',
    body: 'building event-driven architectures for financial systems that handle high throughput with low latency. real-time data pipelines, distributed state management, and infrastructure that scales reliably. kafka, rust, c++, cuda. whether it\'s trading execution, live ml inference, or treasury settlement—the engineering principles are similar: think in streams, eliminate buffering, design for failure gracefully.'
  },
  {
    heading: 'machine learning & financial forecasting.',
    body: 'deep learning and ml across time-series forecasting, signal extraction, and financial prediction. built ai-driven treasury systems using tensorflow for cashflow and volatility forecasting. end-to-end: architecture design, training, validation, interpretability. shipped ml in trading and financial systems. python, tensorflow, pytorch. focus on practical financial applications.'
  },
  {
    heading: 'quantitative trading & execution.',
    body: 'algorithm research, backtesting infrastructure, and live execution systems. developed 20+ trading algorithms, built signal-to-execution pipelines, and optimized for sub-millisecond latency. signal extraction across equities and derivatives. walk-forward validation, realistic cost modeling, and understanding market microstructure. blend of quantitative analysis, low-latency engineering, and risk management.'
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
            {hovered !== null ? CONTENT[hovered].heading : 'quantitative developer — ml, trading systems, and backend infrastructure.'}
          </h2>

          <div
            ref={bodyRef}
            className={`space-y-4 transition-all duration-500 delay-150 ${
              bodyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-base text-fg-2 leading-relaxed">
              {hovered !== null ? CONTENT[hovered].body : 'cs engineer with treasury and financial systems expertise. currently developing quantitative algorithms and backend infrastructure for trading systems. hands-on experience with SAP BTP, AI-driven treasury forecasting, cashflow prediction, and enterprise platform architecture. python, tensorflow, rust, c++—focused on building scalable financial systems without overengineering. bengaluru-based.'}
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

