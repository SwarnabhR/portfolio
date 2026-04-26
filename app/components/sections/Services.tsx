'use client'

import { useState, useEffect, useRef } from 'react'
import { useReveal } from '@/hooks/useReveal'

const GRADIENTS = [
  'linear-gradient(135deg,#100408,#2a0c00,#180020)',
  'linear-gradient(135deg,#06080f,#000e28,#0a0020)',
  'linear-gradient(135deg,#06100a,#001808,#000f08)',
  'linear-gradient(135deg,#100e04,#181200,#110600)',
]

type ServiceData = { index: string; title: string; description: string; gradient: string }

const DEFAULT_SERVICES: ServiceData[] = [
  { index: '01', title: 'algorithmic strategy development', description: 'Signal research to live execution — RSI, VWAP, momentum, and mean-reversion across equities, crypto, forex, and commodities.', gradient: GRADIENTS[0] },
  { index: '02', title: 'backtesting & research', description: 'Fast-news analysis, cross-asset dependency research, walk-forward validation, and cost modelling.', gradient: GRADIENTS[1] },
  { index: '03', title: 'data pipeline engineering', description: 'Real-time tick ingestion, TimescaleDB/QuestDB storage, exchange APIs, and WebSocket feeds.', gradient: GRADIENTS[2] },
  { index: '04', title: 'ml for finance', description: 'Deep learning and interpretable models that explain reactions across linked markets.', gradient: GRADIENTS[3] },
]

function useImageCursor() {
  const rafRef  = useRef<number>(0)
  const mx = useRef(0); const my = useRef(0)
  const cx = useRef(0); const cy = useRef(0)
  const prevX = useRef(0); const prevY = useRef(0)
  const vel = useRef(0)
  const cursorRef = useRef<HTMLDivElement>(null)
  const imgRef    = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<ServiceData | null>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mx.current = e.clientX; my.current = e.clientY }
    window.addEventListener('mousemove', onMove, { passive: true })

    function tick() {
      cx.current += (mx.current - cx.current) * 0.12
      cy.current += (my.current - cy.current) * 0.12

      const dx  = mx.current - prevX.current
      const dy  = my.current - prevY.current
      const spd = Math.sqrt(dx * dx + dy * dy)
      vel.current += (spd - vel.current) * 0.25
      prevX.current = mx.current
      prevY.current = my.current

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cx.current}px`
        cursorRef.current.style.top  = `${cy.current}px`
      }
      if (imgRef.current && active) {
        const blur = Math.min(vel.current * 0.35, 14)
        const opa  = Math.max(1 - vel.current * 0.022, 0.15)
        imgRef.current.style.filter  = `blur(${blur.toFixed(1)}px)`
        cursorRef.current!.style.opacity = String(opa.toFixed(2))
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [active])

  return { cursorRef, imgRef, active, setActive }
}

function ServiceRow({
  service,
  index,
  anyHover,
  onEnter,
  onLeave,
}: {
  service: typeof SERVICES[0]
  index: number
  anyHover: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const { ref, isVisible } = useReveal()
  const dimmed = anyHover && !hovered

  return (
    <div
      ref={ref}
      role="listitem"
      aria-label={service.title}
      onMouseEnter={() => { setHovered(true); onEnter() }}
      onMouseLeave={() => { setHovered(false); onLeave() }}
      className="flex justify-between items-center gap-6 border-b py-5"
      style={{
        borderColor: 'var(--border)',
        cursor: 'default',
        opacity: dimmed ? 0.25 : isVisible ? 1 : 0,
        transform: isVisible
          ? hovered ? 'translateX(-6px)' : 'translateX(0)'
          : 'translateY(20px)',
        transition: `opacity 0.4s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${isVisible ? 0 : index * 80}ms`,
      }}
    >
      <div className="flex items-baseline gap-3">
        <span
          className="text-xs tracking-wider transition-colors duration-300"
          style={{ color: hovered ? 'rgba(160,96,255,0.9)' : 'var(--fg-3)' }}
        >
          {service.index}
        </span>
        <span
          className="font-light tracking-tight transition-colors duration-300"
          style={{
            fontSize: 'clamp(15px, 3vw, 28px)',
            letterSpacing: '-0.02em',
            color: hovered ? 'var(--fg-1)' : 'rgba(255,255,255,0.88)',
          }}
        >
          {service.title}
        </span>
      </div>

      <p
        className="font-light text-right hidden md:block text-fg-2"
        style={{ fontSize: 'var(--text-sm)', maxWidth: 280, lineHeight: 1.6 }}
      >
        {service.description}
      </p>
    </div>
  )
}

export default function Services({ items }: { items?: { title: string; description: string }[] }) {
  const SERVICES: ServiceData[] = items?.length
    ? items.map((s, i) => ({ index: String(i + 1).padStart(2, '0'), title: s.title, description: s.description, gradient: GRADIENTS[i % GRADIENTS.length] }))
    : DEFAULT_SERVICES

  const [hoverAny, setHoverAny] = useState(false)
  const { cursorRef, imgRef, active, setActive } = useImageCursor()
  const { ref: labelRef,   isVisible: labelVisible   } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()

  return (
    <section id="services" className="relative bg-bg py-16 md:py-24 overflow-hidden">

      {/* Velocity-aware image cursor */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: 'fixed', width: 140, height: 90,
          pointerEvents: 'none', zIndex: 9999,
          transform: 'translate(-50%,-50%)',
          opacity: active ? 1 : 0,
          borderRadius: 1, overflow: 'hidden',
          transition: 'opacity 0.25s ease',
        }}
      >
        <div
          ref={imgRef}
          style={{
            width: '100%', height: '100%',
            background: active?.gradient ?? 'transparent',
            transition: 'background 0.3s',
          }}
        />
        <span style={{
          position: 'absolute', bottom: 8, left: 10,
          fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)',
        }}>
          {active?.title.split(' ')[0]}
        </span>
      </div>

      {/* bg word — bottom right */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-0 font-light leading-none tracking-tight text-fg-1 whitespace-nowrap"
        style={{ fontSize: 'var(--text-bg-word)', opacity: 0.022 }}
      >
        Services
      </span>

      <div className="relative max-w-6xl mx-auto px-6">

        <div
          ref={labelRef}
          className={`mb-6 transition-all duration-500 ${
            labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span
            className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-fg-1 border rounded-full px-4 py-1.5"
            style={{ borderColor: 'var(--border-pill)' }}
          >
            ✦ Services
          </span>
        </div>

        <h2
          ref={headingRef}
          className={`font-light tracking-tight text-fg-1 mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 'clamp(24px, 5vw, 40px)', letterSpacing: '-0.02em', maxWidth: 480 }}
        >
          a range of quant services made to grow your edge.
        </h2>

        <div
          role="list"
          aria-label="Services offered"
          className="pt-8"
          onMouseLeave={() => { setHoverAny(false); setActive(null) }}
        >
          {SERVICES.map((service, i) => (
            <ServiceRow
              key={service.index}
              service={service}
              index={i}
              anyHover={hoverAny}
              onEnter={() => { setHoverAny(true); setActive(service) }}
              onLeave={() => {}}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
