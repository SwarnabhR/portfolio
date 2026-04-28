import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Playground',
  description: 'Interactive experiments and tools by S. Roy.',
  openGraph: {
    title: 'Playground — S. Roy',
    description: 'Interactive experiments and tools by S. Roy.',
  },
}

const EXPERIMENTS = [
  {
    id: '01',
    name: 'backtesting_engine',
    desc: 'Run live strategy backtests on NSE, NYSE, LSE & SSE equities in-browser',
    status: 'live',
    href: '/playground/backtesting-engine',
  },
  { id: '02', name: 'options_pricer',     desc: 'Black-Scholes & binomial tree pricer with Greeks',    status: 'building', href: null },
  { id: '03', name: 'regime_detector',    desc: 'HMM-based market regime classifier, live feed',        status: 'planned',  href: null },
  { id: '04', name: 'order_flow_sim',     desc: 'Visualise limit order book dynamics in real time',     status: 'planned',  href: null },
  { id: '05', name: 'correlation_matrix', desc: 'Cross-asset rolling correlation heatmap',              status: 'planned',  href: null },
]

const STATUS_COLOR: Record<string, string> = {
  live:     'rgba(34,197,94,0.9)',
  building: 'rgba(194,24,91,0.85)',
  planned:  'rgba(255,255,255,0.2)',
}

export default function PlaygroundPage() {
  return (
    <section
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        paddingTop: 80,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 55% 45% at 65% 30%,
            rgba(60,0,100,0.30) 0%, rgba(100,0,30,0.12) 50%, transparent 75%)`,
        }}
      />

      <span
        aria-hidden="true"
        style={{
          position: 'absolute', bottom: -20, right: -10,
          fontSize: 'var(--text-bg-word)', fontWeight: 300,
          color: 'rgba(255,255,255,0.018)', letterSpacing: '-0.04em',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}
      >
        Playground
      </span>

      <div className="relative z-10 max-w-6xl mx-auto px-6" style={{ paddingTop: 48 }}>

        <div style={{ marginBottom: 20 }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 'var(--text-xs)', fontWeight: 400,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--fg-2)',
              border: '1px solid var(--border-pill)', borderRadius: 999,
              padding: '6px 16px',
            }}
          >
            ✦ playground
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 8vw, 100px)',
            fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 1.0,
            color: 'var(--fg-1)', marginBottom: 16,
          }}
        >
          Tools & Experiments.
        </h1>

        <p
          style={{
            fontSize: 'var(--text-md)', fontWeight: 300,
            color: 'rgba(255,255,255,0.38)', maxWidth: 440,
            lineHeight: 1.65, marginBottom: 64,
          }}
        >
          interactive ml demos, quant tools, live data visualisations, and
          research experiments. built in public.
        </p>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {EXPERIMENTS.map((exp) => {
            const row = (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '36px 1fr auto',
                  gap: 24, alignItems: 'center',
                  padding: '20px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  opacity: exp.status === 'planned' ? 0.45 : 1,
                  cursor: exp.href ? 'pointer' : 'default',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 'var(--text-xs)',
                    color: 'rgba(255,255,255,0.2)',
                  }}
                >
                  {exp.id}
                </span>

                <div>
                  <p
                    style={{
                      fontSize: 'clamp(15px, 2vw, 20px)', fontWeight: 300,
                      letterSpacing: '-0.01em', color: 'var(--fg-1)',
                      marginBottom: 4,
                    }}
                  >
                    {exp.name}
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 300 }}>.tsx</span>
                    {exp.href && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginLeft: 8 }}>↗</span>}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--text-sm)', fontWeight: 300,
                      color: 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {exp.desc}
                  </p>
                </div>

                <span
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 'var(--text-xs)', fontWeight: 400,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: STATUS_COLOR[exp.status],
                    flexShrink: 0,
                  }}
                >
                  {(exp.status === 'building' || exp.status === 'live') && (
                    <span
                      style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: STATUS_COLOR[exp.status],
                        animation: 'pgPulse 1.6s ease-in-out infinite',
                        display: 'inline-block',
                      }}
                    />
                  )}
                  {exp.status}
                </span>
              </div>
            )

            return exp.href ? (
              <Link key={exp.id} href={exp.href} style={{ textDecoration: 'none', display: 'block' }}>
                {row}
              </Link>
            ) : (
              <div key={exp.id}>{row}</div>
            )
          })}
        </div>

        <p
          style={{
            marginTop: 48,
            fontSize: 'var(--text-sm)', fontWeight: 300,
            color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.04em',
          }}
        >
          check back soon — or watch the{' '}
          <a
            href="https://github.com/SwarnabhR"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', borderBottom: '0.5px solid rgba(255,255,255,0.2)' }}
          >
            github
          </a>
          {' '}for updates.
        </p>
      </div>

      <style>{`
        @keyframes pgPulse {
          0%   { box-shadow: 0 0 0 0 rgba(194,24,91,0.55) }
          70%  { box-shadow: 0 0 0 8px rgba(194,24,91,0) }
          100% { box-shadow: 0 0 0 0 rgba(194,24,91,0) }
        }
      `}</style>
    </section>
  )
}
