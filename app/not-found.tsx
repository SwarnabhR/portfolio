import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 24px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric gradient */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 55% 45% at 50% 55%,
            rgba(120,0,60,0.28) 0%, rgba(60,0,100,0.15) 45%, transparent 75%)`,
        }}
      />

      {/* Decorative bg number */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          fontSize: 'clamp(180px, 30vw, 400px)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.018)',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        404
      </span>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Pill label */}
        <div style={{ marginBottom: 28 }}>
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
            ✦ not found
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(36px, 8vw, 88px)',
            fontWeight: 300,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--fg-1)',
            marginBottom: 20,
          }}
        >
          Page doesn&apos;t exist.
        </h1>

        <p
          style={{
            fontSize: 'var(--text-md)', fontWeight: 300,
            color: 'rgba(255,255,255,0.38)', lineHeight: 1.65,
            maxWidth: 360, margin: '0 auto 40px',
          }}
        >
          The link may be broken, or the page may have been moved.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 'var(--text-sm)', fontWeight: 300,
            color: 'rgba(255,255,255,0.6)',
            borderBottom: '0.5px solid rgba(255,255,255,0.22)',
            paddingBottom: 4,
            textDecoration: 'none',
            letterSpacing: '0.08em',
            transition: 'color 0.3s',
          }}
        >
          go home ↗
        </Link>
      </div>
    </div>
  )
}
