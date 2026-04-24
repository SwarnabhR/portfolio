'use client'

import { useRef, useEffect, useState } from 'react'
import { useScrollY } from '@/hooks/useScrollY'

export default function Hero() {
  const heroRef  = useRef<HTMLElement>(null)
  const scrollY  = useScrollY()
  const [heroH, setHeroH] = useState(700)

  useEffect(() => {
    if (heroRef.current) setHeroH(heroRef.current.offsetHeight)
  }, [])

  const prog           = Math.min(scrollY / (heroH * 0.65), 1)
  const blur           = prog * 16
  const contentOpacity = Math.max(1 - prog * 1.4, 0)
  const contentY       = prog * -50
  const bgWordOpacity  = 0.03 + prog * 0.14
  const bgWordScale    = 1 + prog * 0.04

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      style={{ background: 'var(--bg-hero)', padding: '0 24px 60px' }}
    >
      {/* Atmospheric gradient — blurs as user scrolls */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 65% 55% at 80% 45%,
              rgba(194,24,91,0.55) 0%, rgba(106,13,173,0.35) 35%,
              rgba(230,81,0,0.20) 60%, transparent 80%),
            radial-gradient(ellipse 35% 50% at 95% 80%,
              rgba(249,168,37,0.30) 0%, transparent 55%)
          `,
          filter: `blur(${blur}px)`,
          transition: 'filter 0.05s linear',
        }}
      />

      {/* Grid crosshatch overlay — fades on scroll */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: Math.max(0.06 - prog * 0.06, 0),
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative bg word — brightens + scales as hero exits */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-0 font-light leading-none tracking-tight text-fg-1 whitespace-nowrap"
        style={{
          fontSize: 'var(--text-bg-word)',
          opacity: bgWordOpacity,
          transform: `scale(${bgWordScale})`,
          transformOrigin: 'left bottom',
          transition: 'none',
        }}
      >
        Portfolio
      </span>

      {/* Diagonal arrow motif */}
      <span
        aria-hidden="true"
        className="absolute bottom-8 left-6 select-none"
        style={{ color: 'rgba(255,255,255,0.2)', fontSize: 20, transform: 'rotate(180deg)' }}
      >
        ↗
      </span>

      {/* Content — fades + rises on scroll */}
      <div
        className="relative max-w-6xl mx-auto w-full"
        style={{
          zIndex: 2,
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
          transition: 'none',
        }}
      >
        {/* Availability */}
        <div
          className="text-xs font-light tracking-wide mb-6"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          Available for new projects
        </div>

        {/* Heading */}
        <h1
          className="font-regular tracking-tight leading-none text-fg-1 mb-8"
          style={{ fontSize: 'clamp(52px, 9vw, 100px)' }}
        >
          Quant dev.
          <br />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Systems that trade.</span>
        </h1>

        {/* Two-col sub layout */}
        <div className="flex flex-wrap justify-between items-end gap-6">
          <p
            className="font-light leading-relaxed"
            style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 340 }}
          >
            Building algorithmic trading systems, backtesting platforms,
            and ML pipelines for NSE/BSE equities.
          </p>

          <a
            href="#contact"
            className="text-sm font-light inline-flex items-center gap-1 border-b pb-0.5 transition-colors duration-300"
            style={{
              color: 'rgba(255,255,255,0.7)',
              borderColor: 'rgba(255,255,255,0.22)',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          >
            contact me ↗
          </a>
        </div>
      </div>
    </section>
  )
}
