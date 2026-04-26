'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'
import CtaLink from '@/components/ui/CtaLink'

const STATS = [
  { value: '7+',  label: 'markets covered', badge: 'right' },
  { value: '20+', label: 'strategies backtested', badge: 'left'  },
  { value: '1',   label: 'papers published', badge: 'right' },
  { value: '4+',  label: 'systems deployed', badge: 'left'  },
]

const ACCENTS = ['#ffffff', '#e8e8e8', '#f5f5f5', '#e0e0e0']

const CONTENT = [
  {
    heading: 'global multi-asset coverage.',
    body: 'i architect multi-regime execution infrastructure spanning 7+ venues—nse/bse equities, nyse cash markets, crypto perpetuals, g10 forex, and commodity derivatives. ml-driven signal extraction surfaces cross-asset dependencies that pure statistical approaches miss. tick-level lob reconciliation across exchanges with heterogeneous microstructure. nanosecond-precision timestamp synchronization. the edge isn\'t depth in a single market; it\'s understanding how they move together through learned representations.'
  },
  {
    heading: 'systematic strategy development.',
    body: 'i\'ve developed and rigorously backtested 20+ quantitative strategies. cross-sectional momentum. mean-reversion with tail hedging. linked-market propagation signals derived from neural models. walk-forward validation, realistic tca modeling, slippage regimes—this is how i distinguish edge from overfitting. the full ml lifecycle: feature engineering, model training, interpretability analysis, and deployment. regime-dependent alpha decay and market impact elasticity modelled with precision.'
  },
  {
    heading: 'published research.',
    body: 'veriguard—deepfake detection using fusion nets—was published on first submission. peer-reviewed, rigorous, institutional-grade. current research synthesizes microsecond-granularity alternative data feeds with neural network ensembles to model how macroeconomic shocks propagate across linked markets. saliency maps and shapley decomposition ensure interpretability that satisfies both traders and compliance. this is the level of research that moves institutional capital.'
  },
  {
    heading: 'production-grade systems.',
    body: 'i maintain 4+ production systems built without compromise. low-latency backtest engines with walk-forward optimization. sub-second tick ingestion with nanosecond timestamps. exchange api orchestration across kiteconnect and ccxt. ml inference pipelines with rigorous model versioning. circuit breaker logic. audit trails. hard latency slas and graceful degradation under market stress. infrastructure that doesn\'t just work—it scales under pressure.'
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
            style={{ fontSize: 'var(--text-xl)' }}
          >
            {hovered !== null ? CONTENT[hovered].heading : 'architecting systems at the intersection of math and global liquidity.'}
          </h2>

          <div
            ref={bodyRef}
            className={`space-y-4 transition-all duration-500 delay-150 ${
              bodyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-base text-fg-2 leading-relaxed">
              {hovered !== null ? CONTENT[hovered].body : 'as a cs graduate based in bengaluru, i engineer institutional-grade quantitative trading architectures and production ml systems. my expertise bridges deep learning, high-performance computing, and market microstructure—from neural signal research to rigorous, bias-free backtesting and live inference pipelines.'}
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

