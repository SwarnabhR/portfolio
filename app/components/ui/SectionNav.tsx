'use client'

import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'hero',         label: 'Main' },
  { id: 'about',        label: 'About' },
  { id: 'work',         label: 'Work' },
  { id: 'playground',   label: 'Playground' },
  { id: 'services',     label: 'Services' },
  { id: 'faq',          label: 'FAQ' },
  { id: 'contact',      label: 'Contact' },
  { id: 'notes',        label: 'Notes' },
]

export default function SectionNav() {
  const [active, setActive] = useState('hero')
  const [hovered, setHovered] = useState<string | null>(null)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label="Section navigation"
      className="hidden lg:flex"
      style={{
        position: 'fixed',
        left: 28,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 80,
        flexDirection: 'column',
        gap: 6,
      }}
    >
      {SECTIONS.map(({ id, label }, i) => {
        const isActive = active === id
        const isHovered = hovered === id
        const showLabel = isActive || isHovered

        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            onMouseEnter={() => setHovered(id)}
            onMouseLeave={() => setHovered(null)}
            aria-label={`Go to ${label}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '3px 0',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
          >
            {/* Dot + line indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
              <div
                style={{
                  width: isActive ? 18 : 6,
                  height: 1,
                  background: isActive
                    ? 'rgba(255,255,255,0.85)'
                    : isHovered
                    ? 'rgba(255,255,255,0.45)'
                    : 'rgba(255,255,255,0.18)',
                  borderRadius: 1,
                  transition: 'width 0.3s cubic-bezier(0.22,1,0.36,1), background 0.2s ease',
                }}
              />
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: isActive
                    ? 'rgba(255,255,255,0.9)'
                    : isHovered
                    ? 'rgba(255,255,255,0.5)'
                    : 'rgba(255,255,255,0.2)',
                  transition: 'background 0.2s ease',
                  flexShrink: 0,
                }}
              />
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: 10,
                fontWeight: isActive ? 500 : 300,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: isActive
                  ? 'rgba(255,255,255,0.85)'
                  : 'rgba(255,255,255,0.45)',
                opacity: showLabel ? 1 : 0,
                transform: showLabel ? 'translateX(0)' : 'translateX(-4px)',
                transition: 'opacity 0.2s ease, transform 0.2s ease, color 0.2s ease',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
