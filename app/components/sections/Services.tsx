'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

const SERVICES = [
  {
    index: '01',
    title: 'Algorithmic Strategy Development',
    description:
      'Design and implementation of systematic trading strategies. From signal research to live execution — RSI, VWAP, momentum, mean-reversion.',
  },
  {
    index: '02',
    title: 'Backtesting & Research',
    description:
      'Rigorous historical testing with walk-forward validation, Sharpe/Sortino analysis, drawdown profiling, and transaction cost modelling.',
  },
  {
    index: '03',
    title: 'Data Pipeline Engineering',
    description:
      'Real-time and historical market data ingestion, storage, and transformation. TimescaleDB, QuestDB, KiteConnect, WebSocket feeds.',
  },
  {
    index: '04',
    title: 'ML for Finance',
    description:
      'Feature engineering from OHLCV data, predictive model development, and deployment for classification and regression on equity signals.',
  },
]

function ServiceRow({
  service,
  index,
}: {
  service: (typeof SERVICES)[0]
  index: number
}) {
  const [hovered, setHovered] = useState(false)
  const { ref, isVisible } = useReveal()

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border-b py-8 grid grid-cols-[48px_1fr_auto] gap-6 items-start group"
      style={{
        borderColor: 'var(--border)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms`,
      }}
    >
      {/* Index */}
      <span className="text-xs text-fg-3 pt-1 tracking-wider">{service.index}</span>

      {/* Title + reveal description */}
      <div className="flex flex-col gap-0 overflow-hidden">
        <h3
          className="text-fg-1 font-regular tracking-tight transition-colors duration-300 group-hover:text-fg-2"
          style={{ fontSize: 'var(--text-xl)' }}
        >
          {service.title}
        </h3>

        {/* Description — slides down on hover */}
        <div
          className="overflow-hidden transition-all duration-500"
          style={{ maxHeight: hovered ? '80px' : '0px' }}
        >
          <p className="text-base text-fg-2 leading-relaxed pt-3">
            {service.description}
          </p>
        </div>
      </div>

      {/* Arrow — slides in on hover */}
      <span
        className="text-fg-3 pt-1 transition-all duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
        }}
      >
        ↗
      </span>
    </div>
  )
}

export default function Services() {
  const { ref: labelRef, isVisible: labelVisible } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()

  return (
    <section id="services" className="bg-bg py-32">
      <div className="max-w-6xl mx-auto px-6">

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
            ✦ Services
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className={`font-regular tracking-tight leading-none text-fg-1 mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 'var(--text-xl)' }}
        >
          What I help with.
        </h2>

        {/* Rows */}
        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
          {SERVICES.map((service, i) => (
            <ServiceRow key={service.index} service={service} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}