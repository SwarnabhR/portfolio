export default function WorkLoading() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh' }}>
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
      <section style={{ paddingTop: 140, paddingBottom: 80, maxWidth: 1200, margin: '0 auto', padding: '140px 20px 80px' }}>
        <div className="sk" style={{ width: 80, height: 28, borderRadius: 999, marginBottom: 20 }} />
        <div className="sk" style={{ width: 'clamp(200px, 45vw, 480px)', height: 'clamp(36px, 7vw, 80px)', marginBottom: 12 }} />
        <div className="sk" style={{ width: 'clamp(160px, 35vw, 360px)', height: 'clamp(28px, 5vw, 56px)', marginBottom: 20 }} />
        <div className="sk" style={{ width: 360, height: 16, marginBottom: 8 }} />
        <div className="sk" style={{ width: 280, height: 16, marginBottom: 40 }} />
        {/* Stats */}
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="sk" style={{ width: 90, height: 68 }} />
          ))}
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        {/* Experience section */}
        <section style={{ padding: '72px 0' }}>
          <div className="sk" style={{ width: 120, height: 11, marginBottom: 40 }} />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ paddingLeft: 36, paddingBottom: 48 }}>
              <div className="sk" style={{ width: 220, height: 22, marginBottom: 12 }} />
              <div className="sk" style={{ width: '100%', maxWidth: 600, height: 14, marginBottom: 8 }} />
              <div className="sk" style={{ width: '80%',  maxWidth: 480, height: 14, marginBottom: 8 }} />
              <div className="sk" style={{ width: '55%',  maxWidth: 340, height: 14 }} />
            </div>
          ))}
        </section>

        {/* Projects section */}
        <section style={{ padding: '0 0 72px' }}>
          <div className="sk" style={{ width: 100, height: 11, marginBottom: 40 }} />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 130px auto', gap: 20, padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="sk" style={{ width: 24, height: 14 }} />
              <div>
                <div className="sk" style={{ width: '60%', height: 18, marginBottom: 8 }} />
                <div className="sk" style={{ width: '85%', height: 13 }} />
              </div>
              <div className="sk" style={{ width: 80, height: 22, borderRadius: 999 }} />
              <div className="sk" style={{ width: 60, height: 14 }} />
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
