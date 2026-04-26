export default function GalleryLoading() {
  const heights = [260, 340, 200, 310, 280, 230, 360, 190, 300]

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

      <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 48, paddingBottom: 0 }}>
        <div className="sk" style={{ width: 80, height: 28, borderRadius: 999, marginBottom: 20 }} />
        <div className="sk" style={{ width: 'clamp(200px, 40vw, 440px)', height: 'clamp(36px, 7vw, 80px)', marginBottom: 16 }} />
        <div className="sk" style={{ width: 280, height: 18, marginBottom: 40 }} />
      </div>

      {/* Masonry skeleton */}
      <div className="max-w-6xl mx-auto px-6" style={{ paddingBottom: 80 }}>
        <div style={{ columns: '3 280px', columnGap: 2 }}>
          {heights.map((h, i) => (
            <div
              key={i}
              className="sk"
              style={{ height: h, marginBottom: 2, breakInside: 'avoid', animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
