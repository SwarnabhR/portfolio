'use client'

import { useReveal } from '@/hooks/useReveal'

const PROJECTS = [
  {
    index: '01',
    title: 'S. Roy & Co. Backtesting Platform',
    tags: ['Python', 'QuestDB', 'Streamlit'],
    description:
      'End-to-end backtesting engine for NSE/BSE equities. Ingests real-time OHLCV data, runs strategy simulations, and outputs risk-adjusted performance metrics.',
    status: 'In Progress',
  },
  {
    index: '02',
    title: 'Real-Time Market Data Pipeline',
    tags: ['KiteConnect', 'TimescaleDB', 'Docker'],
    description:
      'High-frequency tick data ingestion system using Zerodha KiteConnect API. Stores OHLCV data with sub-second latency into a time-series database.',
    status: 'Live',
  },
  {
    index: '03',
    title: 'VeriGuard — Deepfake Detection',
    tags: ['XceptionNet', 'PyTorch', 'CV'],
    description:
      'Deep learning model for detecting AI-generated and deepfake images using XceptionNet architecture. Published as a research paper.',
    status: 'Published',
  },
  {
    index: '04',
    title: 'Technical Analysis Screener',
    tags: ['Python', 'RSI', 'VWAP', 'MACD'],
    description:
      'Automated stock screening system applying RSI, EMA, VWAP, Pivot Points, and MACD filters across NSE equities to surface high-probability setups.',
    status: 'Live',
  },
]

function ProjectRow({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const { ref, isVisible } = useReveal()

  return (
    <div
      ref={ref}
      className={`group border-b py-8 grid md:grid-cols-[80px_1fr_auto] gap-6 items-start transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{
        borderColor: 'var(--border)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Index */}
      <span className="text-sm text-fg-3 font-light pt-1">{project.index}</span>

      {/* Main */}
      <div className="flex flex-col gap-3">
        <h3
          className="font-regular tracking-tight text-fg-1 group-hover:text-fg-2 transition-colors duration-300"
          style={{ fontSize: 'var(--text-xl)' }}
        >
          {project.title}
        </h3>
        <p className="text-base text-fg-2 leading-relaxed max-w-2xl">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.tags.map(tag => (
            <span
              key={tag}
              className="text-xs tracking-wider uppercase text-fg-3 border rounded-full px-3 py-1"
              style={{ borderColor: 'var(--border-pill)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Status */}
      <span className="text-xs tracking-wider uppercase text-fg-3 pt-1 whitespace-nowrap">
        {project.status}
      </span>
    </div>
  )
}

export default function Work() {
  const { ref: labelRef, isVisible: labelVisible } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()

  return (
    <section id="work" className="bg-bg py-32">
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
            Work
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className={`text-3xl font-regular tracking-tight leading-none text-fg-1 mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Selected projects.
        </h2>

        {/* Project list */}
        <div className="border-t" style={{ borderColor: 'var(--border)' }}>
          {PROJECTS.map((project, i) => (
            <ProjectRow key={project.index} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}