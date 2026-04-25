'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import {
  siPython, siTypescript, siC, siCplusplus, siRust, siMysql,
  siFastapi, siCelery, siApachekafka, siRedis,
  siClickhouse, siPostgresql, siDocker, siKubernetes, siApacheairflow, siLinux,
  siPytorch, siNvidia, siOpencv, siWebassembly,
  siNextdotjs, siReact, siStreamlit,
  siSolidity, siEthereum,
} from 'simple-icons'

type SimpleIcon = { path: string; hex: string }

const ICON_MAP: Record<string, SimpleIcon> = {
  'Python':      siPython,
  'TypeScript':  siTypescript,
  'C':           siC,
  'C++':         siCplusplus,
  'Rust':        siRust,
  'SQL':         siMysql,
  'FastAPI':     siFastapi,
  'Celery':      siCelery,
  'Kafka':       siApachekafka,
  'Redis':       siRedis,
  'ClickHouse':  siClickhouse,
  'PostgreSQL':  siPostgresql,
  'Docker':      siDocker,
  'Kubernetes':  siKubernetes,
  'Airflow':     siApacheairflow,
  'Linux':       siLinux,
  'PyTorch':     siPytorch,
  'CUDA':        siNvidia,
  'OpenCV':      siOpencv,
  'WASM':        siWebassembly,
  'Next.js':     siNextdotjs,
  'React':       siReact,
  'Streamlit':   siStreamlit,
  'Solidity':    siSolidity,
  'EVM':         siEthereum,
}

const EXPERIENCE = [
  {
    period: '2024 – present',
    role: 'quantitative research',
    type: 'research',
    description: 'Cross-asset signal research — fast-news propagation, linked market reactions, and walk-forward validation across equities and derivatives.',
  },
  {
    period: '2023 – 2024',
    role: 'algorithmic trading engineering',
    type: 'engineering',
    description: 'End-to-end systematic execution infrastructure: tick ingestion, order routing, and position management across multiple asset classes.',
  },
  {
    period: '2023',
    role: 'ml research',
    type: 'research',
    description: 'Computer vision research in deepfake detection using XceptionNet architecture. Findings published as a peer-reviewed paper.',
  },
]

const PROJECTS = [
  {
    index: '01',
    title: 's. roy & co. backtesting platform',
    tags: ['Python', 'QuestDB', 'Streamlit'],
    description:
      'end-to-end backtesting engine for nse/bse, nyse, sse, and lse equities — extensible to crypto, forex, and commodity futures. ingests real-time ohlcv data and outputs risk-adjusted performance metrics.',
    status: 'in progress',
    dot: '#f59e0b',
    href: null,
  },
  {
    index: '02',
    title: 'real-time market data pipeline',
    tags: ['TimescaleDB', 'Docker', 'Kafka'],
    description:
      'high-frequency tick and fast-news ingestion system studying how information propagates through linked markets with sub-second latency.',
    status: 'live',
    dot: '#22c55e',
    href: null,
  },
  {
    index: '03',
    title: 'veriguard — deepfake detection',
    tags: ['XceptionNet', 'PyTorch', 'CUDA'],
    description:
      'deep learning model detecting ai-generated and deepfake images using xceptionnet architecture. published as a peer-reviewed research paper.',
    status: 'published',
    dot: '#a78bfa',
    href: null,
  },
  {
    index: '04',
    title: 'technical analysis screener',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
    description:
      'automated screening system filtering equities, crypto, forex, and commodities to surface high-probability setups across timeframes.',
    status: 'live',
    dot: '#22c55e',
    href: null,
  },
]

const STACK = [
  { category: 'Languages',       items: ['Python', 'TypeScript', 'C', 'C++', 'Rust', 'SQL'] },
  { category: 'Backend & Async', items: ['FastAPI', 'Celery', 'Kafka', 'Redis', 'gRPC'] },
  { category: 'Data & Infra',    items: ['QuestDB', 'TimescaleDB', 'ClickHouse', 'PostgreSQL', 'Docker', 'Kubernetes', 'Airflow', 'Linux'] },
  { category: 'ML / GPU',        items: ['PyTorch', 'CUDA', 'OpenCV', 'WASM'] },
  { category: 'Web & Viz',       items: ['Next.js', 'React', 'Streamlit'] },
  { category: 'Blockchain',      items: ['Solidity', 'EVM'] },
]

function SubHeading({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useReveal()
  return (
    <div
      ref={ref}
      className={`flex items-center gap-4 mb-8 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <span
        className="text-xs tracking-[0.15em] uppercase shrink-0"
        style={{ color: 'var(--fg-3)' }}
      >
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
  )
}

function ExperienceRow({ entry, index }: { entry: typeof EXPERIENCE[0]; index: number }) {
  const { ref, isVisible } = useReveal()
  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 md:grid-cols-[160px_1fr_100px] gap-4 border-b py-7 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ borderColor: 'var(--border)', transitionDelay: `${index * 80}ms` }}
    >
      <span
        className="text-xs tracking-wider pt-0.5 font-light"
        style={{ color: 'var(--fg-3)' }}
      >
        {entry.period}
      </span>

      <div className="flex flex-col gap-2">
        <h3
          className="font-light tracking-tight"
          style={{ fontSize: 'clamp(15px, 2.5vw, 22px)', color: 'var(--fg-1)', letterSpacing: '-0.02em' }}
        >
          {entry.role}
        </h3>
        <p
          className="font-light leading-relaxed"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)' }}
        >
          {entry.description}
        </p>
      </div>

      <div className="hidden md:flex justify-end pt-0.5">
        <span
          className="text-xs tracking-[0.12em] uppercase border rounded-full px-3 py-1 h-fit"
          style={{ color: 'var(--fg-3)', borderColor: 'var(--border-pill)' }}
        >
          {entry.type}
        </span>
      </div>
    </div>
  )
}

function ProjectRow({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const { ref, isVisible } = useReveal()
  const [hovered, setHovered] = useState(false)

  const rowClass = `group grid grid-cols-1 md:grid-cols-[80px_1fr_auto] gap-4 md:gap-6 border-b py-8 items-start transition-all duration-700 ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
  }`
  const rowStyle = { borderColor: 'var(--border)', transitionDelay: `${index * 100}ms` }

  const inner = (
    <>
      <span className="hidden md:block text-sm font-light pt-1" style={{ color: 'var(--fg-3)' }}>
        {project.index}
      </span>

      <div className="flex flex-col gap-3">
        <h3 className="font-light tracking-tight" style={{ fontSize: 'var(--text-xl)', color: 'var(--fg-1)', letterSpacing: '-0.02em' }}>
          {project.title}
        </h3>
        <p className="leading-relaxed max-w-2xl font-light" style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)' }}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          {project.tags.map(tag => (
            <span key={tag} className="text-xs tracking-wider uppercase rounded-full px-3 py-1 border" style={{ color: 'var(--fg-3)', borderColor: 'var(--border-pill)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3 pt-1 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: project.dot }} />
          <span className="text-xs tracking-wider uppercase" style={{ color: 'var(--fg-3)' }}>{project.status}</span>
        </div>
        {project.href ? (
          <span style={{ color: hovered ? 'rgba(160,96,255,0.9)' : 'var(--fg-3)', transition: 'color 0.3s, transform 0.3s', display: 'inline-block', transform: hovered ? 'translate(2px,-2px)' : 'translate(0,0)', fontSize: 14 }}>↗</span>
        ) : (
          <span className="text-xs uppercase border rounded-full px-2 py-0.5" style={{ color: 'var(--fg-3)', borderColor: 'var(--border)', opacity: hovered ? 1 : 0, transition: 'opacity 0.25s ease', letterSpacing: '0.1em', fontSize: 10 }}>soon</span>
        )}
      </div>
    </>
  )

  if (project.href) {
    return (
      <Link href={project.href} target="_blank" rel="noopener noreferrer"
        className={rowClass} style={{ ...rowStyle, cursor: 'pointer', textDecoration: 'none', display: 'grid' }}
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      >
        {inner}
      </Link>
    )
  }

  return (
    <div ref={ref} className={rowClass} style={rowStyle}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </div>
  )
}

function StackPill({ item }: { item: string }) {
  const [hovered, setHovered] = useState(false)
  const icon = ICON_MAP[item]

  return (
    <span
      className="inline-flex items-center text-xs tracking-wide border rounded-full px-3 py-1.5 transition-colors duration-200 cursor-default select-none"
      style={{
        color: 'var(--fg-2)',
        borderColor: hovered ? 'rgba(255,255,255,0.25)' : 'var(--border)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            overflow: 'hidden',
            width: hovered ? 14 : 0,
            opacity: hovered ? 1 : 0,
            marginRight: hovered ? 6 : 0,
            flexShrink: 0,
            transition: 'width 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.2s ease, margin-right 0.25s ease',
          }}
        >
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
            <path d={icon.path} />
          </svg>
        </span>
      )}
      {item}
    </span>
  )
}

function StackGroup({ group, index }: { group: typeof STACK[0]; index: number }) {
  const { ref, isVisible } = useReveal()
  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 transition-all duration-600 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <span
        className="text-xs tracking-[0.15em] uppercase"
        style={{ color: 'var(--fg-3)' }}
      >
        {group.category}
      </span>
      <div className="flex flex-wrap gap-2">
        {group.items.map(item => (
          <StackPill key={item} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function Work() {
  const { ref: labelRef,   isVisible: labelVisible   } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()

  return (
    <section id="work" className="relative bg-bg py-16 md:py-32 overflow-hidden">

      {/* Decorative bg word */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-8 left-0 font-light leading-none tracking-tight whitespace-nowrap"
        style={{ fontSize: 'var(--text-bg-word)', opacity: 0.04, color: 'var(--fg-1)' }}
      >
        Work
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
            className="inline-flex items-center gap-2 text-xs tracking-wider uppercase border rounded-full px-4 py-1.5"
            style={{ color: 'var(--fg-1)', borderColor: 'var(--border-pill)' }}
          >
            ✦ Work
          </span>
        </div>

        {/* Heading */}
        <h2
          ref={headingRef}
          className={`font-light tracking-tight leading-none mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 'var(--text-3xl)', color: 'var(--fg-1)', letterSpacing: '-0.02em' }}
        >
          experience & craft.
        </h2>

        {/* ── Experience ──────────────────────── */}
        <SubHeading>Experience</SubHeading>
        <div className="mb-20">
          {EXPERIENCE.map((entry, i) => (
            <ExperienceRow key={i} entry={entry} index={i} />
          ))}
        </div>

        {/* ── Projects ────────────────────────── */}
        <SubHeading>Projects</SubHeading>
        <div className="mb-20">
          {PROJECTS.map((project, i) => (
            <ProjectRow key={project.index} project={project} index={i} />
          ))}
        </div>

        {/* ── Stack ───────────────────────────── */}
        <SubHeading>Stack</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {STACK.map((group, i) => (
            <StackGroup key={group.category} group={group} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
