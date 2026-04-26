export default function PlaylistLoading() {
  return (
    <section style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: 80 }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -600px 0 }
          100% { background-position:  600px 0 }
        }
        .sk {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 600px 100%;
          animation: shimmer 1.6s infinite linear;
          border-radius: 3px;
        }
      `}</style>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 48, paddingBottom: 48 }}>
        <div className="sk" style={{ width: 100, height: 28, borderRadius: 999, marginBottom: 20 }} />
        <div className="sk" style={{ width: 'clamp(220px, 50vw, 560px)', height: 'clamp(36px, 7vw, 80px)', marginBottom: 12 }} />
        <div className="sk" style={{ width: 'clamp(160px, 35vw, 340px)', height: 'clamp(28px, 5vw, 60px)', marginBottom: 20 }} />
        <div className="sk" style={{ width: 320, height: 18 }} />
      </div>

      {/* Stats strip */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '24px 0' }}>
        <div
          className="max-w-6xl mx-auto px-6"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="sk" style={{ width: '60%', height: 28, marginBottom: 8 }} />
              <div className="sk" style={{ width: '80%', height: 12 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Recently played rows */}
      <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 48, paddingBottom: 56 }}>
        <div className="sk" style={{ width: 160, height: 28, borderRadius: 999, marginBottom: 20 }} />
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              display: 'grid', gridTemplateColumns: '36px 48px 1fr',
              gap: 16, alignItems: 'center',
              padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div className="sk" style={{ width: 24, height: 12 }} />
            <div className="sk" style={{ width: 48, height: 48 }} />
            <div>
              <div className="sk" style={{ width: '55%', height: 14, marginBottom: 6 }} />
              <div className="sk" style={{ width: '35%', height: 11 }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
