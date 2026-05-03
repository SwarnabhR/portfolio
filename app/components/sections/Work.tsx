'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

const HIGHLIGHTS = [
  {
    period: '2026 – present',
    role: 'quantitative developer — trading systems',
    type: 'quantitative',
  },
  {
    period: '2025',
    role: 'ml engineer — SAP treasury platform',
    type: 'sap',
  },
  {
    period: '2024 – 2025',
    role: 'systems & infrastructure projects',
    type: 'projects',
  },
]

const STACK_PREVIEW = ['Python', 'Rust', 'C++', 'PyTorch', 'Kafka', 'ClickHouse', 'Kubernetes', 'CUDA']

function HighlightRow({ entry, index }: { entry: typeof HIGHLIGHTS[0]; index: number }) {
  const { ref, isVisible } = useReveal()
  return (
    <div
      ref={ref}
      className="grid grid-cols-[1fr_auto] items-baseline border-b py-4 transition-all duration-600"
      style={{
        borderColor: 'var(--border)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(14px)',
        transitionDelay: `${index * 70}ms`,
      }}
    >
      <div className="flex flex-wrap items-baseline gap-4 gap-y-1">
        <span className="text-xs tracking-wider font-light shrink-0" style={{ color: 'var(--fg-3)' }}>
          {entry.period}
        </span>
        <span className="font-light tracking-tight" style={{ fontSize: 'clamp(14px, 2vw, 18px)', color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>
          {entry.role}
        </span>
      </div>
      <span className="hidden sm:block text-xs tracking-[0.12em] uppercase border rounded-full px-3 py-1 ml-6 shrink-0"
        style={{ color: 'var(--fg-3)', borderColor: 'var(--border-pill)' }}>
        {entry.type}
      </span>
    </div>
  )
}

export default function Work() {
  const { ref: labelRef,   isVisible: labelVisible   } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()
  const { ref: stackRef,   isVisible: stackVisible   } = useReveal()
  const { ref: ctaRef,     isVisible: ctaVisible     } = useReveal()

  return (
    <section id="work" className="relative bg-bg py-16 md:py-28 overflow-hidden">

      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-4 left-0 font-light leading-none tracking-tight whitespace-nowrap"
        style={{ fontSize: 'var(--text-bg-word)', opacity: 0.03, color: 'var(--fg-1)' }}
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

        {/* Heading + subtext */}
        <div
          ref={headingRef}
          className={`mb-12 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2
            className="font-light tracking-tight leading-none mb-4"
            style={{ fontSize: 'clamp(32px, 8vw, 64px)', color: 'var(--fg-1)', letterSpacing: '-0.02em' }}
          >
            experience & craft.
          </h2>
          <p className="font-light max-w-xl" style={{ fontSize: 'var(--text-base)', color: 'var(--fg-2)', lineHeight: 1.7 }}>
            treasury and financial systems expertise. quantitative development, ml engineering, and enterprise platform architecture on SAP BTP. focused on treasury forecasting, cashflow optimization, low-latency execution, and scalable financial infrastructure.
          </p>
        </div>

        {/* Experience highlights */}
        <div className="mb-10">
          {HIGHLIGHTS.map((entry, i) => (
            <HighlightRow key={i} entry={entry} index={i} />
          ))}
        </div>

        {/* Stack preview pills */}
        <div
          ref={stackRef}
          className={`flex flex-wrap gap-2 mb-12 transition-all duration-600 ${
            stackVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {STACK_PREVIEW.map(item => (
            <span
              key={item}
              className="text-xs tracking-wide border rounded-full px-3 py-1.5"
              style={{ color: 'var(--fg-3)', borderColor: 'var(--border)' }}
            >
              {item}
            </span>
          ))}
          <span
            className="text-xs tracking-wide border rounded-full px-3 py-1.5"
            style={{ color: 'var(--fg-3)', borderColor: 'var(--border)', opacity: 0.5 }}
          >
            +21 more
          </span>
        </div>

        {/* CTA */}
        <div
          ref={ctaRef}
          className={`transition-all duration-500 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/work"
            className="inline-flex items-center gap-3 group"
            style={{ textDecoration: 'none' }}
          >
            <span
              className="text-sm tracking-wider uppercase font-light transition-colors duration-300"
              style={{ color: 'var(--fg-2)', letterSpacing: '0.12em' }}
            >
              view full work
            </span>
            <span
              className="inline-flex items-center justify-center border rounded-full transition-all duration-300"
              style={{
                width: 36, height: 36,
                borderColor: 'var(--border-pill)',
                color: 'var(--fg-2)',
                fontSize: 16,
              }}
            >
              ↗
            </span>
          </Link>
        </div>

      </div>
    </section>
  )
}
