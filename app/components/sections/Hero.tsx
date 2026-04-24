'use client'

import { useRef, useEffect, useState } from 'react'
import { useScrollY } from '@/hooks/useScrollY'
import CtaLink from '@/components/ui/CtaLink'

function useNegativeCursor(heroRef: React.RefObject<HTMLElement | null>) {
  const blobRef = useRef<HTMLDivElement>(null)
  const cx = useRef(-300); const cy = useRef(-300)
  const tx = useRef(-300); const ty = useRef(-300)
  const targetSize = useRef(48)
  const currentSize = useRef(48)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    function onMove(e: MouseEvent) {
      const r = (hero as HTMLElement).getBoundingClientRect()
      tx.current = e.clientX - r.left
      ty.current = e.clientY - r.top

      const el = document.elementFromPoint(e.clientX, e.clientY)
      const isInteractive = !!(el?.closest('a, button, [role="button"]'))
      targetSize.current = isInteractive ? 140 : 48
    }
    function onLeave() { tx.current = -300; ty.current = -300 }

    let raf: number
    function tick() {
      cx.current += (tx.current - cx.current) * 0.12
      cy.current += (ty.current - cy.current) * 0.12
      currentSize.current += (targetSize.current - currentSize.current) * 0.10

      if (blobRef.current) {
        const s = currentSize.current
        blobRef.current.style.width  = `${s}px`
        blobRef.current.style.height = `${s}px`
        blobRef.current.style.transform =
          `translate(${cx.current}px,${cy.current}px) translate(-50%,-50%)`
      }
      raf = requestAnimationFrame(tick)
    }

    hero.addEventListener('mousemove', onMove, { passive: true })
    hero.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(tick)
    return () => {
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [heroRef])

  return blobRef
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const scrollY = useScrollY()
  const [heroH, setHeroH] = useState(700)
  const negCursorRef = useNegativeCursor(heroRef)

  useEffect(() => {
    if (heroRef.current) setHeroH(heroRef.current.offsetHeight)
  }, [])

  const prog           = Math.min(scrollY / (heroH * 0.65), 1)
  const contentOpacity = Math.max(1 - prog * 1.4, 0)
  const contentY       = prog * -50
  const bgWordOpacity  = 0.03 + prog * 0.14
  const bgWordScale    = 1 + prog * 0.04

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{
        background: `
          linear-gradient(to bottom,
            transparent 0%,
            rgba(0,0,0,0.2) 70%,
            rgba(0,0,0,0.8) 100%
          ),
          var(--bg-hero)
        `,
        padding: '0 24px 60px'
      }}
    >

      {/* ── Negative-inversion cursor ────────────────────────── */}
      <div
        ref={negCursorRef}
        aria-hidden="true"
        className="hero-neg-cursor"
        style={{
          position: 'absolute', top: 0, left: 0,
          width: 48, height: 48,
          borderRadius: '50%',
          background: 'white',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 20,
          willChange: 'transform, width, height',
        }}
      />

      {/* ── Liquid blob layer (GPU-composited, CSS-only) ─────── */}
      {/*
          Blobs are isolated in their own stacking context with
          filter: blur() so the browser can rasterize them once
          onto a GPU layer. Only transform + border-radius animate
          — no JS touches the DOM after mount.
      */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          isolation: 'isolate',
        }}
      >
        {/* Shared blur wrapper — one GPU texture for all blobs */}
        <div style={{ position: 'absolute', inset: 0, filter: 'blur(72px)' }}>

          {/* Blob A — deep violet, top-right */}
          <div style={{
            position: 'absolute',
            width: '62vw', height: '62vw',
            top: '-18%', right: '-14%',
            background: 'radial-gradient(ellipse at 45% 45%, rgba(88,0,180,0.88) 0%, rgba(44,0,100,0.55) 50%, transparent 72%)',
            borderRadius: '62% 38% 74% 26% / 52% 44% 56% 48%',
            willChange: 'transform',
            animation: 'hBlob1 24s ease-in-out infinite',
          }} />

          {/* Blob B — crimson, mid-right */}
          <div style={{
            position: 'absolute',
            width: '52vw', height: '52vw',
            top: '20%', right: '8%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(165,0,48,0.80) 0%, rgba(90,0,22,0.50) 48%, transparent 70%)',
            borderRadius: '40% 60% 34% 66% / 58% 42% 62% 38%',
            willChange: 'transform',
            animation: 'hBlob2 30s ease-in-out infinite',
          }} />

          {/* Blob C — stellar blue, left */}
          <div style={{
            position: 'absolute',
            width: '48vw', height: '48vw',
            top: '22%', left: '-16%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(0,28,130,0.72) 0%, rgba(0,12,70,0.44) 48%, transparent 70%)',
            borderRadius: '55% 45% 40% 60% / 48% 55% 45% 52%',
            willChange: 'transform',
            animation: 'hBlob3 20s ease-in-out infinite',
          }} />

          {/* Blob D — indigo, bottom */}
          <div style={{
            position: 'absolute',
            width: '38vw', height: '38vw',
            bottom: '-8%', left: '28%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(60,0,120,0.82) 0%, rgba(32,0,72,0.50) 50%, transparent 70%)',
            borderRadius: '48% 52% 66% 34% / 44% 56% 44% 56%',
            willChange: 'transform',
            animation: 'hBlob4 26s ease-in-out infinite',
          }} />

        </div>
      </div>



      {/* ── Grid crosshatch — fades on scroll ───────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: Math.max(0.055 - prog * 0.055, 0),
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          zIndex: 1,
        }}
      />

      {/* ── Decorative bg word ───────────────────────────────── */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 right-0 font-light leading-none tracking-tight text-fg-1 whitespace-nowrap"
        style={{
          fontSize: 'var(--text-bg-word)',
          opacity: bgWordOpacity,
          transform: `scale(${bgWordScale})`,
          transformOrigin: 'right bottom',
          transition: 'none',
        }}
      >
        Portfolio
      </span>

      {/* ── Diagonal arrow motif ─────────────────────────────── */}
      <span
        aria-hidden="true"
        className="absolute bottom-8 left-6 select-none"
        style={{ color: 'rgba(255,255,255,0.18)', fontSize: 20, transform: 'rotate(180deg)' }}
      >
        ↗
      </span>

      {/* ── Content — glass panel ────────────────────────────── */}
      <div
        className="relative max-w-6xl mx-auto w-full"
        style={{
          zIndex: 2,
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
          transition: 'none',
        }}
      >
        {/* Glass panel — backdrop-filter only on this small area */}
        {/* <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-36px -28px -4px',
            backdropFilter: 'blur(22px) saturate(150%)',
            WebkitBackdropFilter: 'blur(22px) saturate(150%)',
            background: 'rgba(6,6,6,0.22)',
            border: '0.5px solid rgba(255,255,255,0.06)',
            borderRadius: 4,
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to top, black 30%, rgba(0,0,0,0.7) 65%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 30%, rgba(0,0,0,0.7) 65%, transparent 100%)',
          }}
        /> */}

        {/* Availability */}
        <div className="text-xs font-light tracking-wide mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Available for new projects
        </div>

        {/* Heading */}
        <h1
          className="font-regular tracking-tight leading-none text-fg-1 mb-8"
          style={{ fontSize: 'clamp(52px, 9vw, 100px)' }}
        >
          Quant dev.
          <br />
          <span style={{ color: 'rgba(255,255,255,0.45)' }}>Systems that trade.</span>
        </h1>

        {/* Two-col sub layout */}
        <div className="flex flex-wrap justify-between items-end gap-6" style={{ marginTop: '2rem' }}>
          <p className="font-light leading-relaxed" style={{ fontSize: 'var(--text-base)', color: 'rgba(255,255,255,0.48)', maxWidth: 340}}>
            Building algorithmic trading systems, backtesting platforms, and ML pipelines
            that connect fast news, quantitative math, and market reactions across asset classes.
          </p>
          <div style={{ marginBottom: '6rem' }}>
            <CtaLink href="#contact">contact me ↗</CtaLink>
          </div>
        </div>
      </div>

      {/* ── Keyframes — transform + border-radius only ───────── */}
      <style>{`
        @media (hover: none), (pointer: coarse) {
          .hero-neg-cursor { display: none !important; }
        }
        @keyframes hBlob1 {
          0%,100% { transform: translate(0,0)       rotate(0deg)   scale(1);    border-radius: 62% 38% 74% 26% / 52% 44% 56% 48%; }
          33%      { transform: translate(-44px,60px) rotate(13deg)  scale(1.06); border-radius: 42% 58% 55% 45% / 65% 35% 65% 35%; }
          66%      { transform: translate(28px,-38px) rotate(-8deg)  scale(0.95); border-radius: 70% 30% 42% 58% / 38% 62% 48% 52%; }
        }
        @keyframes hBlob2 {
          0%,100% { transform: translate(0,0)       rotate(0deg)   scale(1);    border-radius: 40% 60% 34% 66% / 58% 42% 62% 38%; }
          40%      { transform: translate(48px,-68px) rotate(-19deg) scale(1.05); border-radius: 60% 40% 52% 48% / 40% 60% 40% 60%; }
          70%      { transform: translate(-32px,44px) rotate(10deg)  scale(0.97); border-radius: 30% 70% 66% 34% / 70% 30% 55% 45%; }
        }
        @keyframes hBlob3 {
          0%,100% { transform: translate(0,0)       rotate(0deg)   scale(1);    border-radius: 55% 45% 40% 60% / 48% 55% 45% 52%; }
          35%      { transform: translate(58px,28px)  rotate(17deg)  scale(1.08); border-radius: 38% 62% 60% 40% / 60% 40% 62% 38%; }
          75%      { transform: translate(-20px,-48px) rotate(-6deg) scale(0.93); border-radius: 68% 32% 38% 62% / 35% 65% 50% 50%; }
        }
        @keyframes hBlob4 {
          0%,100% { transform: translate(0,0)       rotate(0deg)   scale(1);    border-radius: 48% 52% 66% 34% / 44% 56% 44% 56%; }
          50%      { transform: translate(-38px,-28px) rotate(22deg) scale(1.10); border-radius: 65% 35% 44% 56% / 56% 44% 66% 34%; }
        }
      `}</style>

    </section>
  )
}
