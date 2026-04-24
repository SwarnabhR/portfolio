'use client'

import { useReveal } from '@/hooks/useReveal'
import CtaLink from '@/components/ui/CtaLink'

const PROJECTS = [
  {
    index: '01',
    title: 's. roy & co. backtesting platform',
    tags: ['Python', 'QuestDB', 'Streamlit'],
    description:
      'end-to-end backtesting engine for nse/bse, nyse, sse, and lse equities, with extensible research flows for crypto, forex, and commodity futures. ingests real-time ohlcv data, runs strategy simulations, and outputs risk-adjusted performance metrics.',
    status: 'in progress',
  },
  {
    index: '02',
    title: 'real-time market data pipeline',
    tags: ['KiteConnect', 'TimescaleDB', 'Docker'],
    description:
      'high-frequency tick and fast-news ingestion system for studying how information propagates through linked markets with sub-second latency.',
    status: 'live',
  },
  {
    index: '03',
    title: 'veriguard — deepfake detection',
    tags: ['XceptionNet', 'PyTorch', 'CV'],
    description:
      'deep learning model for detecting ai-generated and deepfake images using xceptionnet architecture. published as a research paper.',
    status: 'published',
  },
  {
    index: '04',
    title: 'technical analysis screener',
    tags: ['Python', 'RSI', 'VWAP', 'MACD'],
    description:
      'automated screening system applying rsi, ema, vwap, pivot points, and macd filters across equities, crypto, forex, and commodities to surface high-probability setups.',
    status: 'live',
  },
]

function ProjectRow({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const { ref, isVisible } = useReveal()

  return (
    <div
      ref={ref}
      className={`group border-b py-8 grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-4 md:gap-6 items-start transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{
        borderColor: 'var(--border)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Index */}
      <span className="hidden md:block text-sm text-fg-3 font-light pt-1">{project.index}</span>

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
      <span className="hidden md:block text-xs tracking-wider uppercase text-fg-3 pt-1 whitespace-nowrap">
        {project.status}
      </span>
    </div>
  )
}

export default function Work() {
  const { ref: labelRef,    isVisible: labelVisible    } = useReveal()
  const { ref: headingRef,  isVisible: headingVisible  } = useReveal()
  const { ref: subtitleRef, isVisible: subtitleVisible } = useReveal()

  return (
    <section id="work" className="relative bg-bg py-32 overflow-hidden">

      {/* Decorative background word */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-8 left-0 font-light leading-none tracking-tight text-fg-1 whitespace-nowrap"
        style={{ fontSize: 'var(--text-bg-word)', opacity: 0.04 }}
      >
        Projects
      </span>

      <div className="relative max-w-6xl mx-auto px-6">

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
            ✦ Work
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className={`font-regular tracking-tight leading-none text-fg-1 mb-4 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 'var(--text-3xl)' }}
        >
          selected projects.
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className={`text-md text-fg-2 mb-16 max-w-xl transition-all duration-700 delay-100 ${
            subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          systems built for real markets — fast news, linked reactions, and cross-asset execution.
        </p>

        {/* Project list */}
        <div className="pt-8">
          {PROJECTS.map((project, i) => (
            <ProjectRow key={project.index} project={project} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-end">
          <CtaLink href="#contact">see all works ↗</CtaLink>
        </div>

      </div>
    </section>
  )
}
