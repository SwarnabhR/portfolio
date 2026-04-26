export default function BlogPostLoading() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: 80 }}>
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

      <div className="max-w-2xl mx-auto px-6" style={{ paddingTop: 48 }}>
        {/* back link */}
        <div className="sk" style={{ width: 60, height: 12, marginBottom: 40 }} />
        {/* meta */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <div className="sk" style={{ width: 100, height: 12 }} />
          <div className="sk" style={{ width: 60,  height: 12 }} />
        </div>
        {/* title */}
        <div className="sk" style={{ width: '90%', height: 'clamp(28px, 5vw, 52px)', marginBottom: 12 }} />
        <div className="sk" style={{ width: '70%', height: 'clamp(28px, 5vw, 52px)', marginBottom: 20 }} />
        {/* excerpt */}
        <div className="sk" style={{ width: '100%', height: 18, marginBottom: 8 }} />
        <div className="sk" style={{ width: '80%',  height: 18, marginBottom: 40 }} />
        {/* cover */}
        <div className="sk" style={{ width: '100%', paddingBottom: '56%', marginBottom: 48 }} />
        {/* divider */}
        <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 48 }} />
        {/* body paragraphs */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <div className="sk" style={{ width: '100%', height: 14, marginBottom: 8 }} />
            <div className="sk" style={{ width: '100%', height: 14, marginBottom: 8 }} />
            <div className="sk" style={{ width: '65%',  height: 14 }} />
          </div>
        ))}
      </div>
    </div>
  )
}
