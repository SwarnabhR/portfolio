'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

const SERVICES = [
  {
    index: '01',
    title: 'Algorithmic Strategy Development',
    description: 'Signal research to live execution — RSI, VWAP, momentum, mean-reversion on NSE/BSE.',
  },
  {
    index: '02',
    title: 'Backtesting & Research',
    description: 'Walk-forward validation, Sharpe/Sortino analysis, drawdown profiling, cost modelling.',
  },
  {
    index: '03',
    title: 'Data Pipeline Engineering',
    description: 'Real-time tick ingestion, TimescaleDB/QuestDB storage, KiteConnect + WebSocket feeds.',
  },
  {
    index: '04',
    title: 'ML for Finance',
    description: 'Feature engineering from OHLCV, predictive models for classification and regression.',
  },
]

function ServiceRow({
  service,
  index,
  anyHover,
  onEnter,
  onLeave,
}: {
  service: typeof SERVICES[0]
  index: number
  anyHover: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const { ref, isVisible } = useReveal()

  const dimmed = anyHover && !hovered

  return (
    <div
      ref={ref}
      onMouseEnter={() => { setHovered(true); onEnter() }}
      onMouseLeave={() => { setHovered(false); onLeave() }}
      className="flex justify-between items-center gap-6 border-b py-5"
      style={{
        borderColor: 'var(--border)',
        cursor: 'default',
        opacity: dimmed ? 0.25 : isVisible ? 1 : 0,
        transform: isVisible
          ? hovered ? 'translateX(-6px)' : 'translateX(0)'
          : 'translateY(20px)',
        transition: `opacity 0.4s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${isVisible ? 0 : index * 80}ms`,
      }}
    >
      {/* Index + title */}
      <div className="flex items-baseline gap-3">
        <span
          className="text-xs font-regular tracking-wider transition-colors duration-300"
          style={{ color: hovered ? 'rgba(160,96,255,0.9)' : 'var(--fg-3)' }}
        >
          {service.index}
        </span>
        <span
          className="font-light tracking-tight transition-colors duration-300"
          style={{
            fontSize: 'clamp(18px, 3vw, 28px)',
            color: hovered ? 'var(--fg-1)' : 'rgba(255,255,255,0.88)',
            letterSpacing: '-0.02em',
          }}
        >
          {service.title}
        </span>
      </div>

      {/* Description — always visible, right-aligned */}
      <p
        className="font-light text-right hidden md:block"
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.4)',
          maxWidth: 300,
          lineHeight: 1.6,
        }}
      >
        {service.description}
      </p>
    </div>
  )
}

export default function Services() {
  const [hoverAny, setHoverAny] = useState(false)
  const { ref: labelRef,   isVisible: labelVisible   } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()

  return (
    <section id="services" className="relative bg-bg py-20 overflow-hidden">

      {/* bg word — bottom right */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-0 font-light leading-none tracking-tight text-fg-1 whitespace-nowrap"
        style={{ fontSize: 'var(--text-bg-word)', opacity: 0.022 }}
      >
        Services
      </span>

      <div className="relative max-w-6xl mx-auto px-6">

        {/* Label */}
        <div
          ref={labelRef}
          className={`mb-6 transition-all duration-500 ${
            labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span
            className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-fg-1 border rounded-full px-4 py-1.5"
            style={{ borderColor: 'var(--border-pill)' }}
          >
            ✦ Services
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className={`font-light tracking-tight text-fg-1 mb-10 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 22, letterSpacing: '-0.02em', maxWidth: 380 }}
        >
          A range of quant services made to grow your edge.
        </h2>

        {/* Rows */}
        <div
          className="border-t"
          style={{ borderColor: 'var(--border)' }}
          onMouseLeave={() => setHoverAny(false)}
        >
          {SERVICES.map((service, i) => (
            <ServiceRow
              key={service.index}
              service={service}
              index={i}
              anyHover={hoverAny}
              onEnter={() => setHoverAny(true)}
              onLeave={() => {}}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
