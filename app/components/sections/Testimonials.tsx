'use client'

import { useEffect, useRef, useState } from 'react'

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return mobile
}

const ROTATIONS = [-13, 8, -4]
const GLOWS     = ['rgba(160,60,255,0.35)', 'rgba(200,34,68,0.30)', 'rgba(68,136,200,0.28)']

type CardData = { date: string; quote: string; name: string; role: string; rotation: number; glow: string }

const DEFAULT_CARDS: CardData[] = [
  { date: '08.2024', quote: '"Exceptional research instincts and rigorous methodology. Built a backtesting framework from scratch that caught edge cases our senior team had missed."', name: 'Internship Lead', role: 'Quantitative Research Desk', rotation: ROTATIONS[0], glow: GLOWS[0] },
  { date: '03.2024', quote: '"Rare combination of statistical depth and engineering discipline. The ML pipeline he delivered runs in production with zero issues since launch."', name: 'Research Supervisor', role: 'Algo Trading Team', rotation: ROTATIONS[1], glow: GLOWS[1] },
  { date: '11.2023', quote: '"Delivered a deepfake detection model that outperformed baselines by 12%. The paper was accepted on first submission — an impressive result."', name: 'Academic Advisor', role: 'CS Department', rotation: ROTATIONS[2], glow: GLOWS[2] },
]

const THRESHOLDS = [0.18, 0.42, 0.66]

const POSITIONS_DESKTOP = [
  'translate(-110%, -30%)',
  'translate(-40%,   20%)',
  'translate(-55%,  -80%)',
]
const POSITIONS_MOBILE = [
  'translate(-100%, -20%)',
  'translate(-30%,   18%)',
  'translate(-50%,  -72%)',
]

export default function Testimonials({ items }: { items?: { quote: string; name: string; role: string; date: string }[] }) {
  const CARDS: CardData[] = items?.length
    ? items.slice(0, 3).map((c, i) => ({ date: c.date, quote: c.quote, name: c.name, role: c.role, rotation: ROTATIONS[i % ROTATIONS.length], glow: GLOWS[i % GLOWS.length] }))
    : DEFAULT_CARDS

  const [landed, setLanded] = useState([false, false, false])
  const [progress, setProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      const scrolled = Math.max(-rect.top, 0)
      const prog = Math.min(scrolled / total, 1)

      setProgress(prog)
      setLanded(THRESHOLDS.map(t => prog >= t))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div id="testimonials" ref={sectionRef} style={{ height: '280vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg)',
        }}
      >
        {/* Atmospheric bg */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse 60% 50% at 50% 60%,
              rgba(60,0,100,0.30) 0%, rgba(100,0,25,0.18) 45%, transparent 75%)`,
          }}
        />

        {/* "Feedback" bg word */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: -40, left: -10,
            fontSize: 'var(--text-bg-word)', fontWeight: 400,
            color: 'rgba(255,255,255,0.025)', letterSpacing: '-0.03em',
            userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
          }}
        >
          Feedback
        </span>

        {/* Progress bar */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 0, left: 0,
            width: `${progress * 100}%`, height: 1,
            background: 'rgba(255,255,255,0.12)',
            transition: 'width 0.1s linear',
          }}
        />

        {/* Section label */}
        <div
          style={{
            position: 'absolute', top: 32, left: '50%',
            transform: 'translateX(-50%)',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999,
            padding: '6px 14px', zIndex: 10, whiteSpace: 'nowrap',
          }}
        >
          ✦ Endorsements
        </div>

        {/* Scroll hint */}
        <p
          style={{
            position: 'absolute', bottom: 28, left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 'var(--text-xs)', fontWeight: 300, letterSpacing: '0.15em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
            zIndex: 10, whiteSpace: 'nowrap',
            animation: 'fadeHint 2s ease-in-out infinite alternate',
          }}
        >
          scroll to reveal
        </p>

        <style>{`
          @keyframes fadeHint {
            from { opacity: 0.25; }
            to   { opacity: 0.60; }
          }
        `}</style>

        {/* Card floor */}
        <div style={{ position: 'relative', width: isMobile ? 280 : 340, height: isMobile ? 220 : 260, zIndex: 2 }}>
          {CARDS.map((card, i) => {
            const isLanded = landed[i]
            const POSITIONS = isMobile ? POSITIONS_MOBILE : POSITIONS_DESKTOP
            const cardW = isMobile ? 170 : 230
            const cardPad = isMobile ? '12px 14px' : '16px 18px'

            return (
              <div
                key={i}
                role="article"
                aria-label={`Endorsement from ${card.name}, ${card.role}`}
                className={`tcard-${i}`}
                style={{
                  position: 'absolute',
                  width: cardW,
                  background: 'var(--bg-card)',
                  border: `1px solid rgba(255,255,255,0.10)`,
                  padding: cardPad,
                  borderRadius: 4,
                  boxShadow: isLanded
                    ? `0 16px 60px rgba(0,0,0,0.7), 0 0 40px ${card.glow}`
                    : '0 12px 50px rgba(0,0,0,0.5)',
                  top: '50%', left: '50%',
                  opacity: isLanded ? 1 : 0,
                  transform: isLanded
                    ? `${POSITIONS[i]} rotate(${card.rotation}deg)`
                    : 'translate(-50%, -50%) translateY(-120px) rotate(0deg) scale(0.88)',
                  transition: 'transform 0.85s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease, box-shadow 0.5s ease',
                  cursor: 'default',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = `${POSITIONS[i]} rotate(${card.rotation}deg) translateY(-8px)`
                  el.style.boxShadow = `0 24px 70px rgba(0,0,0,0.8), 0 0 50px ${card.glow}`
                  el.style.borderColor = 'rgba(255,255,255,0.18)'
                  el.style.zIndex = '10'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = `${POSITIONS[i]} rotate(${card.rotation}deg)`
                  el.style.boxShadow = `0 16px 60px rgba(0,0,0,0.7), 0 0 40px ${card.glow}`
                  el.style.borderColor = 'rgba(255,255,255,0.10)'
                  el.style.zIndex = ''
                }}
              >
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', textAlign: 'right', marginBottom: 10, letterSpacing: '0.06em' }}>
                  {card.date}
                </div>
                <div style={{ fontSize: isMobile ? 11 : 'var(--text-sm)', color: 'var(--fg-2)', lineHeight: 1.6, marginBottom: 14, fontWeight: 300 }}>
                  {card.quote}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 10 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>{card.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--fg-3)', letterSpacing: '0.06em', marginTop: 2 }}>{card.role}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
