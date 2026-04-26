export default function BlogLoading() {
  return (
    <section
      style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: 80 }}
    >
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

      <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 48, paddingBottom: 0 }}>
        {/* pill */}
        <div className="sk" style={{ width: 90, height: 28, borderRadius: 999, marginBottom: 20 }} />
        {/* heading */}
        <div className="sk" style={{ width: 'clamp(240px, 45vw, 480px)', height: 'clamp(36px, 7vw, 80px)', marginBottom: 16 }} />
        {/* subtext */}
        <div className="sk" style={{ width: 320, height: 18, marginBottom: 6 }} />
        <div className="sk" style={{ width: 260, height: 18, marginBottom: 40 }} />
      </div>

      {/* Card grid */}
      <div
        className="max-w-6xl mx-auto px-6"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
          gap: '2px',
          background: 'rgba(255,255,255,0.03)',
          paddingBottom: 80,
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: 'var(--bg)', padding: '24px 20px 0' }}>
            {/* cover */}
            <div className="sk" style={{ width: '100%', paddingBottom: '62.5%', marginBottom: 16 }} />
            {/* meta */}
            <div className="sk" style={{ width: 140, height: 12, marginBottom: 10 }} />
            {/* title */}
            <div className="sk" style={{ width: '80%', height: 20, marginBottom: 8 }} />
            {/* excerpt */}
            <div className="sk" style={{ width: '100%', height: 14, marginBottom: 6 }} />
            <div className="sk" style={{ width: '65%', height: 14, marginBottom: 24 }} />
          </div>
        ))}
      </div>
    </section>
  )
}
