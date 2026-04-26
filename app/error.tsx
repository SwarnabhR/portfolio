'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 55% 45% at 50% 55%, rgba(120,0,30,0.25) 0%, rgba(60,0,100,0.12) 45%, transparent 75%)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
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
            ✦ error
          </span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(32px, 7vw, 80px)', fontWeight: 300,
            letterSpacing: '-0.03em', lineHeight: 1.05,
            color: 'var(--fg-1)', marginBottom: 16,
          }}
        >
          Something went wrong.
        </h1>

        <p
          style={{
            fontSize: 'var(--text-md)', fontWeight: 300,
            color: 'rgba(255,255,255,0.35)', lineHeight: 1.65,
            maxWidth: 340, margin: '0 auto 40px',
          }}
        >
          An unexpected error occurred. You can try again or go back home.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 'var(--text-sm)', fontWeight: 300,
              color: 'rgba(255,255,255,0.6)',
              background: 'transparent', border: 'none',
              borderBottom: '0.5px solid rgba(255,255,255,0.22)',
              paddingBottom: 4, cursor: 'pointer',
              letterSpacing: '0.08em',
              fontFamily: 'inherit',
            }}
          >
            try again
          </button>
          <a
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 'var(--text-sm)', fontWeight: 300,
              color: 'rgba(255,255,255,0.6)',
              borderBottom: '0.5px solid rgba(255,255,255,0.22)',
              paddingBottom: 4, textDecoration: 'none',
              letterSpacing: '0.08em',
            }}
          >
            go home ↗
          </a>
        </div>
      </div>
    </div>
  )
}
