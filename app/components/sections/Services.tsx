'use client'

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

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const { ref, isVisible } = useReveal()

  return (
    <div
      ref={ref}
      className={`border p-8 flex flex-col gap-4 transition-all duration-700 hover:bg-bg-card`}
      style={{
        borderColor: 'var(--border)',
        transitionDelay: `${index * 100}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s ease ${index * 100}ms, background 0.3s ease`,
      }}
    >
      <span className="text-sm text-fg-3 font-light">{service.index}</span>
      <h3
        className="font-regular tracking-tight text-fg-1"
        style={{ fontSize: 'var(--text-lg)' }}
      >
        {service.title}
      </h3>
      <p className="text-base text-fg-2 leading-relaxed">
        {service.description}
      </p>
    </div>
  )
}

export default function Services() {
  const { ref: labelRef, isVisible: labelVisible } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()

  return (
    <section id="services" className="bg-bg-2 py-32">
      <div className="max-w-6xl mx-auto px-6">

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
            Services
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className={`text-3xl font-regular tracking-tight leading-none text-fg-1 mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          What I build.
        </h2>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-px bg-border">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.index} service={service} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}