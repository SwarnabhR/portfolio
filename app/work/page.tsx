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

/* ── Data ─────────────────────────────────────────────────── */

const STATS = [
  { value: '4',   label: 'projects' },
  { value: '3+',  label: 'years' },
  { value: '29',  label: 'technologies' },
  { value: '1',   label: 'publication' },
]

const EXPERIENCE = [
  {
    period: '2024 – present',
    role: 'quantitative research',
    type: 'research',
    description: 'Cross-asset signal research — fast-news propagation, linked market reactions, and walk-forward validation across equities and derivatives. Focus on regime-dependent behavior and information propagation latency.',
    highlights: ['fast-news alpha', 'cross-asset dependency', 'walk-forward validation'],
  },
  {
    period: '2023 – 2024',
    role: 'algorithmic trading engineering',
    type: 'engineering',
    description: 'End-to-end systematic execution infrastructure: real-time tick ingestion, order routing, and position management across equities and derivatives. Built for sub-second latency at scale.',
    highlights: ['tick ingestion', 'order routing', 'sub-second latency'],
  },
  {
    period: '2023',
    role: 'ml research',
    type: 'research',
    description: 'Computer vision research in deepfake detection using XceptionNet architecture. Developed a high-accuracy classification model for AI-generated image detection. Findings published as a peer-reviewed paper.',
    highlights: ['deepfake detection', 'XceptionNet', 'peer-reviewed'],
  },
]

const EDUCATION = [
  {
    period: '2022 – present',
    degree: 'b.tech · computer science & engineering',
    institution: 'IIT Kharagpur',
    description: 'Core focus on algorithms, systems programming, machine learning, and quantitative methods. Pursuing independent research in financial ML and market microstructure alongside formal coursework.',
  },
]

const PUBLICATIONS = [
  {
    year: '2023',
    title: 'veriguard: deepfake detection using xceptionnet',
    venue: 'peer-reviewed research paper',
    description: 'A deep learning system for detecting AI-generated and manipulated images using the XceptionNet architecture. Achieves high classification accuracy across multiple deepfake generation methods.',
    tags: ['deep learning', 'computer vision', 'xceptionnet', 'pytorch'],
    href: null,
  },
]

const PROJECTS = [
  {
    index: '01',
    title: 's. roy & co. backtesting platform',
    tags: ['Python', 'QuestDB', 'Streamlit'],
    description: 'End-to-end backtesting engine for NSE/BSE, NYSE, SSE, and LSE equities — extensible to crypto, forex, and commodity futures. Ingests real-time OHLCV data, runs strategy simulations, and outputs risk-adjusted performance metrics.',
    status: 'in progress',
    dot: '#f59e0b',
    href: null,
  },
  {
    index: '02',
    title: 'real-time market data pipeline',
    tags: ['TimescaleDB', 'Docker', 'Kafka'],
    description: 'High-frequency tick and fast-news ingestion system studying how information propagates through linked markets with sub-second latency. Designed for cross-asset dependency research.',
    status: 'live',
    dot: '#22c55e',
    href: null,
  },
  {
    index: '03',
    title: 'veriguard — deepfake detection',
    tags: ['XceptionNet', 'PyTorch', 'CUDA'],
    description: 'Deep learning model detecting AI-generated and deepfake images using XceptionNet architecture. Achieves high classification accuracy across multiple generation methods. Published as a peer-reviewed research paper.',
    status: 'published',
    dot: '#a78bfa',
    href: null,
  },
  {
    index: '04',
    title: 'technical analysis screener',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
    description: 'Automated screening system filtering equities, crypto, forex, and commodities to surface high-probability setups across timeframes using a composite of technical signals.',
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

type SimpleIcon = { path: string; hex: string }
const ICON_MAP: Record<string, SimpleIcon> = {
  'Python': siPython, 'TypeScript': siTypescript, 'C': siC, 'C++': siCplusplus,
  'Rust': siRust, 'SQL': siMysql, 'FastAPI': siFastapi, 'Celery': siCelery,
  'Kafka': siApachekafka, 'Redis': siRedis, 'ClickHouse': siClickhouse,
  'PostgreSQL': siPostgresql, 'Docker': siDocker, 'Kubernetes': siKubernetes,
  'Airflow': siApacheairflow, 'Linux': siLinux, 'PyTorch': siPytorch,
  'CUDA': siNvidia, 'OpenCV': siOpencv, 'WASM': siWebassembly,
  'Next.js': siNextdotjs, 'React': siReact, 'Streamlit': siStreamlit,
  'Solidity': siSolidity, 'EVM': siEthereum,
}

/* ── Sub-components ───────────────────────────────────────── */

function ExperienceItem({ e, i }: { e: typeof EXPERIENCE[0]; i: number }) {
  const { ref, isVisible } = useReveal()
  return (
    <div ref={ref} className="exp-item" style={{ paddingLeft: 36, paddingBottom: 48, position: 'relative', opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(20px)', transition: `all 0.7s ease ${i * 100}ms` }}>
      <div style={{ position: 'absolute', left: -5, top: 6, width: 11, height: 11, borderRadius: '50%', border: '1px solid var(--border-pill)', background: 'var(--bg)' }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
        <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 26px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--fg-1)' }}>{e.role}</h3>
        <span style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-3)', border: '1px solid var(--border-pill)', borderRadius: 999, padding: '3px 10px', flexShrink: 0 }}>{e.type}</span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', letterSpacing: '0.06em', flexShrink: 0 }}>{e.period}</span>
      </div>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', lineHeight: 1.7, maxWidth: 680, marginBottom: 14 }}>{e.description}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {e.highlights.map(h => (
          <span key={h} style={{ fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-3)', border: '1px solid var(--border)', borderRadius: 999, padding: '3px 10px' }}>{h}</span>
        ))}
      </div>
    </div>
  )
}

function EducationItem({ e, i }: { e: typeof EDUCATION[0]; i: number }) {
  const { ref, isVisible } = useReveal()
  return (
    <div ref={ref} className="edu-row" style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 24, borderBottom: '1px solid var(--border)', paddingBottom: 28, opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(16px)', transition: `all 0.6s ease ${i * 80}ms` }}>
      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', letterSpacing: '0.06em', paddingTop: 4 }}>{e.period}</span>
      <div>
        <h3 style={{ fontSize: 'clamp(15px, 2vw, 22px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--fg-1)', marginBottom: 4 }}>{e.degree}</h3>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>{e.institution}</p>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.7 }}>{e.description}</p>
      </div>
    </div>
  )
}

function ProjectItem({ project, i }: { project: typeof PROJECTS[0]; i: number }) {
  const { ref, isVisible } = useReveal()
  const [hovered, setHovered] = useState(false)

  const inner = (
    <>
      <span className="proj-index" style={{ fontFamily: 'ui-monospace, monospace', fontSize: 'var(--text-sm)', color: 'var(--fg-3)', paddingTop: 2 }}>
        {project.index}
      </span>
      <div style={{ minWidth: 0 }}>
        <h3 style={{ fontSize: 'clamp(14px, 2vw, 20px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--fg-1)', marginBottom: 6 }}>{project.title}</h3>
        <p className="proj-desc" style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.65, maxHeight: hovered ? 120 : 48, overflow: 'hidden', transition: 'max-height 0.4s ease, opacity 0.3s', opacity: hovered ? 1 : 0.7, wordBreak: 'break-word' }}>{project.description}</p>
        <div className="proj-tags-mobile" style={{ display: 'none', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {project.tags.map(tag => (
            <span key={tag} style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', border: '1px solid var(--border)', borderRadius: 999, padding: '3px 9px' }}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="proj-tags-desktop" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingTop: 2 }}>
        {project.tags.map(tag => (
          <span key={tag} style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', border: '1px solid var(--border)', borderRadius: 999, padding: '3px 9px' }}>{tag}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 2, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: project.dot, flexShrink: 0 }} />
          <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>{project.status}</span>
        </div>
        {project.href
          ? <span style={{ color: hovered ? 'rgba(160,96,255,0.9)' : 'var(--fg-3)', transition: 'color 0.3s', display: 'inline-block', transform: hovered ? 'translate(2px,-2px)' : 'none', fontSize: 14 }}>↗</span>
          : <span className="proj-soon" style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-3)', border: '1px solid var(--border)', borderRadius: 999, padding: '2px 8px', opacity: hovered ? 1 : 0, transition: 'opacity 0.25s' }}>soon</span>
        }
      </div>
    </>
  )

  const rowStyle: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '48px 1fr 130px auto', gap: 20,
    alignItems: 'start', padding: '20px 0',
    borderBottom: '1px solid var(--border)',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? (hovered ? 'translateX(-4px)' : 'none') : 'translateY(16px)',
    transition: `opacity 0.6s ease ${i * 80}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1)`,
    cursor: project.href ? 'pointer' : 'default',
  }

  return project.href ? (
    <Link href={project.href} target="_blank" rel="noopener noreferrer"
      ref={ref as React.Ref<HTMLAnchorElement>}
      className="proj-row"
      style={{ ...rowStyle, textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >{inner}</Link>
  ) : (
    <div ref={ref} className="proj-row" style={rowStyle}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >{inner}</div>
  )
}

function PublicationItem({ pub, i }: { pub: typeof PUBLICATIONS[0]; i: number }) {
  const { ref, isVisible } = useReveal()
  return (
    <div ref={ref} style={{ border: '1px solid var(--border)', borderRadius: 4, padding: 'clamp(20px, 4vw, 32px)', background: 'radial-gradient(ellipse 80% 60% at 80% 30%, rgba(88,0,180,0.08) 0%, transparent 65%), rgba(255,255,255,0.01)', opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(16px)', transition: `all 0.6s ease ${i * 80}ms`, marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        <div>
          <span style={{ fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 10 }}>{pub.venue} · {pub.year}</span>
          <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 26px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--fg-1)' }}>{pub.title}</h3>
        </div>
        {pub.href && (
          <a href={pub.href} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--fg-2)', border: '0.5px solid var(--border-cta)', borderRadius: 3, padding: '8px 14px', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap', textDecoration: 'none' }}>read paper ↗</a>
        )}
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.7, maxWidth: 680, marginBottom: 20 }}>{pub.description}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {pub.tags.map(tag => (
          <span key={tag} style={{ fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-3)', border: '1px solid var(--border)', borderRadius: 999, padding: '3px 10px' }}>{tag}</span>
        ))}
      </div>
    </div>
  )
}

function StackGroup({ group, i }: { group: typeof STACK[0]; i: number }) {
  const { ref, isVisible } = useReveal()
  return (
    <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(16px)', transition: `all 0.6s ease ${i * 60}ms` }}>
      <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-3)', display: 'block', marginBottom: 12 }}>{group.category}</span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {group.items.map(item => <StackPill key={item} item={item} />)}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  const { ref, isVisible } = useReveal()
  return (
    <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'none' : 'translateY(12px)', transition: 'all 0.5s ease', marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--fg-3)', whiteSpace: 'nowrap' }}>
          {children}
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
    </div>
  )
}

function StackPill({ item }: { item: string }) {
  const [hovered, setHovered] = useState(false)
  const icon = ICON_MAP[item]
  return (
    <span
      className="inline-flex items-center text-xs tracking-wide border rounded-full px-3 py-1.5 transition-colors duration-200 cursor-default select-none"
      style={{ color: 'var(--fg-2)', borderColor: hovered ? 'rgba(255,255,255,0.25)' : 'var(--border)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {icon && (
        <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', overflow: 'hidden', width: hovered ? 14 : 0, opacity: hovered ? 1 : 0, marginRight: hovered ? 6 : 0, flexShrink: 0, transition: 'width 0.25s cubic-bezier(0.22,1,0.36,1), opacity 0.2s ease, margin-right 0.25s ease' }}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
            <path d={icon.path} />
          </svg>
        </span>
      )}
      {item}
    </span>
  )
}

/* ── Main page ────────────────────────────────────────────── */

export default function WorkPage() {
  const { ref: heroRef, isVisible: heroVisible } = useReveal()

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100dvh' }}>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="work-hero" style={{ position: 'relative', overflow: 'hidden', paddingTop: 140, paddingBottom: 80, isolation: 'isolate' }}>

        <div aria-hidden style={{ position: 'absolute', inset: 0, filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', width: '55vw', height: '55vw', top: '-15%', right: '-10%', borderRadius: '62% 38% 74% 26% / 52% 44% 56% 48%', background: 'radial-gradient(ellipse at 45% 45%, rgba(88,0,180,0.7) 0%, rgba(44,0,100,0.4) 50%, transparent 72%)', animation: 'wBlob1 24s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', width: '45vw', height: '45vw', top: '20%', left: '-12%', borderRadius: '40% 60% 55% 45% / 55% 35% 65% 45%', background: 'radial-gradient(ellipse at 50% 50%, rgba(165,0,48,0.55) 0%, rgba(90,0,22,0.3) 48%, transparent 70%)', animation: 'wBlob2 30s ease-in-out infinite' }} />
        </div>

        <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.045, backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }} />

        <div ref={heroRef} style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(12px)', transition: 'all 0.5s ease', marginBottom: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-1)', border: '1px solid var(--border-pill)', borderRadius: 999, padding: '6px 14px', background: 'rgba(255,255,255,0.02)' }}>
              ✦ Work
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 7vw, 80px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--fg-1)', marginBottom: 20, opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'none' : 'translateY(20px)', transition: 'all 0.7s ease 60ms' }}>
            work &amp; experience.
          </h1>

          <p style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', maxWidth: 480, lineHeight: 1.65, marginBottom: 40, opacity: heroVisible ? 1 : 0, transition: 'all 0.6s ease 120ms', transform: heroVisible ? 'none' : 'translateY(16px)' }}>
            systems built for real markets — fast news, linked reactions, and cross-asset execution. research at the intersection of ml and quantitative finance.
          </p>

          {/* Stats */}
          <div className="work-stats" style={{ display: 'flex', flexWrap: 'wrap', gap: 2, opacity: heroVisible ? 1 : 0, transition: 'opacity 0.6s ease 180ms' }}>
            {STATS.map((s) => (
              <div key={s.label} className="work-stat-item" style={{ padding: '14px 24px', border: '1px solid var(--border)', borderRadius: 4, background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', gap: 4, minWidth: 90 }}>
                <span style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 300, letterSpacing: '-0.04em', color: 'var(--fg-1)', lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes wBlob1 { 0%,100%{transform:translate(0,0) rotate(0deg) scale(1)} 33%{transform:translate(-40px,50px) rotate(12deg) scale(1.05)} 66%{transform:translate(24px,-32px) rotate(-7deg) scale(0.96)} }
          @keyframes wBlob2 { 0%,100%{transform:translate(0,0) rotate(0deg) scale(1)} 50%{transform:translate(44px,-60px) rotate(-18deg) scale(1.06)} }
          @media (max-width: 600px) {
            .work-hero { padding-top: 100px !important; padding-bottom: 56px !important; }
            .work-stats { gap: 8px !important; }
            .work-stat-item { border-radius: 4px !important; flex: 1 1 calc(50% - 4px) !important; }
          }
        `}</style>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

        {/* ── Experience ────────────────────────────────── */}
        <section style={{ padding: '72px 0' }}>
          <SectionLabel>Experience</SectionLabel>
          <div style={{ position: 'relative' }}>
            <div className="exp-timeline-line" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />
            {EXPERIENCE.map((e, i) => <ExperienceItem key={i} e={e} i={i} />)}
          </div>
        </section>

        {/* ── Education ─────────────────────────────────── */}
        <section style={{ padding: '0 0 72px' }}>
          <SectionLabel>Education</SectionLabel>
          {EDUCATION.map((e, i) => <EducationItem key={i} e={e} i={i} />)}
        </section>

        {/* ── Projects ──────────────────────────────────── */}
        <section style={{ padding: '0 0 72px' }}>
          <SectionLabel>Projects</SectionLabel>

          <div className="proj-headers" style={{ display: 'grid', gridTemplateColumns: '48px 1fr 130px auto', gap: 20, padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>
            <span>#</span><span>project</span><span>stack</span><span>status</span>
          </div>

          {PROJECTS.map((project, i) => <ProjectItem key={project.index} project={project} i={i} />)}
        </section>

        {/* ── Publications ──────────────────────────────── */}
        <section style={{ padding: '0 0 72px' }}>
          <SectionLabel>Publications</SectionLabel>
          {PUBLICATIONS.map((pub, i) => <PublicationItem key={i} pub={pub} i={i} />)}
        </section>

        {/* ── Tech Stack ────────────────────────────────── */}
        <section style={{ padding: '0 0 80px' }}>
          <SectionLabel>Stack</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 36 }}>
            {STACK.map((group, i) => <StackGroup key={group.category} group={group} i={i} />)}
          </div>
        </section>

      </div>

      <style>{`
        /* ── Mobile overrides ── */
        @media (max-width: 640px) {
          /* Experience: reduce left padding */
          .exp-item { padding-left: 24px !important; }
          .exp-timeline-line { display: none; }

          /* Education: single column */
          .edu-row { grid-template-columns: 1fr !important; gap: 8px !important; }

          /* Projects: single content column, hide desktop stack column */
          .proj-headers { grid-template-columns: 1fr auto !important; }
          .proj-headers > span:nth-child(1),
          .proj-headers > span:nth-child(3) { display: none !important; }
          .proj-row { grid-template-columns: 1fr auto !important; gap: 12px !important; }
          .proj-index { display: none !important; }
          .proj-tags-desktop { display: none !important; }
          .proj-tags-mobile { display: flex !important; }
          .proj-desc { max-height: none !important; opacity: 1 !important; }
          .proj-soon { opacity: 1 !important; }
        }
      `}</style>
    </main>
  )
}
