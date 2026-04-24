'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useActiveSection } from '../../hooks/useActiveSection'

const NAV_LINKS = [
  { label: 'home',     href: '/',         soon: false },
  { label: 'work',     href: '/work',     soon: true },
  { label: 'blog',     href: '/blog',     soon: true  },
  { label: 'gallery',  href: '/gallery',  soon: true  },
  { label: 'playlist', href: '/playlist', soon: true  },
]

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/SwarnabhR',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="14" cy="14" r="13.25" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5"/>
        <path d="M14 7.5C10.41 7.5 7.5 10.41 7.5 14C7.5 16.86 9.36 19.28 11.96 20.14C12.29 20.2 12.41 20 12.41 19.82V18.76C10.64 19.15 10.26 17.96 10.26 17.96C9.96 17.21 9.52 17.01 9.52 17.01C8.91 16.6 9.57 16.61 9.57 16.61C10.24 16.66 10.59 17.3 10.59 17.3C11.19 18.3 12.18 18.01 12.44 17.83C12.5 17.4 12.67 17.11 12.86 16.94C11.08 16.77 9.21 16.09 9.21 13.07C9.21 12.18 9.54 11.45 10.1 10.88C10.03 10.71 9.74 9.88 10.17 8.77C10.17 8.77 10.73 8.59 12.41 9.63C13.12 9.43 13.86 9.33 14.6 9.33C15.34 9.33 16.08 9.43 16.79 9.63C18.47 8.59 19.03 8.77 19.03 8.77C19.46 9.88 19.17 10.71 19.1 10.88C19.66 11.45 19.99 12.18 19.99 13.07C19.99 16.1 18.12 16.77 16.33 16.94C16.57 17.15 16.79 17.56 16.79 18.19V19.82C16.79 20 16.91 20.2 17.25 20.14C19.64 19.27 21.5 16.86 21.5 14C21.5 10.41 18.59 7.5 14 7.5Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Discord',
    href: '#',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="14" cy="14" r="13.25" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5"/>
        <path d="M18.8 9.35C17.82 8.9 16.78 8.58 15.69 8.43C15.55 8.68 15.4 9.02 15.29 9.29C14.13 9.12 12.98 9.12 11.84 9.29C11.73 9.02 11.57 8.68 11.44 8.43C10.34 8.58 9.3 8.9 8.33 9.35C6.36 12.26 5.83 15.1 6.1 17.91C7.41 18.87 8.69 19.45 9.94 19.83C10.25 19.41 10.52 18.96 10.76 18.49C10.31 18.32 9.89 18.11 9.48 17.86C9.59 17.78 9.69 17.7 9.79 17.62C12.26 18.75 14.94 18.75 17.38 17.62C17.48 17.7 17.59 17.78 17.69 17.86C17.29 18.11 16.86 18.32 16.41 18.49C16.65 18.96 16.92 19.41 17.23 19.83C18.49 19.45 19.76 18.87 21.08 17.91C21.39 14.65 20.55 11.84 18.8 9.35ZM11.4 16.19C10.66 16.19 10.05 15.51 10.05 14.68C10.05 13.84 10.65 13.17 11.4 13.17C12.15 13.17 12.77 13.85 12.75 14.68C12.75 15.51 12.15 16.19 11.4 16.19ZM15.75 16.19C15.01 16.19 14.4 15.51 14.4 14.68C14.4 13.84 15 13.17 15.75 13.17C16.5 13.17 17.12 13.85 17.1 14.68C17.1 15.51 16.5 16.19 15.75 16.19Z" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [hidden, setHidden]       = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const activeSection             = useActiveSection()

  /* scroll detection */
  useEffect(() => {
    let lastScrollY = window.scrollY
    const onScroll = () => {
      const currentScrollY = window.scrollY
      setScrolled(currentScrollY > 40)
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // scrolling down and past 80px -> hide
        setHidden(true)
      } else if (currentScrollY < lastScrollY) {
        // scrolling up -> show
        setHidden(false)
      }
      
      lastScrollY = currentScrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* body scroll lock */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const close = () => setMenuOpen(false)

  return (
    <>
      {/* ── Default bar ─────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-md border-b py-3'
            : 'py-6'
        }`}
        style={{
          background: scrolled ? 'rgba(10,10,12,0.75)' : 'transparent',
          borderColor: scrolled ? 'var(--border)' : 'transparent',
          transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" aria-label="S. Roy — Home" className="flex items-center gap-3 text-fg-1 opacity-80 hover:opacity-100 transition-opacity duration-300">
            <LogoSVG />
            <span className="text-md font-regular tracking-tight leading-none">S. Roy</span>
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-stretch gap-[5px] transition-colors duration-300 group text-center"
            style={{ color: 'var(--fg-2)' }}
            aria-label="Open menu"
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-2)')}
          >
            <span className="w-full h-[1px] bg-current opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-[1px]" />
            <span className="text-md tracking-widest uppercase leading-none">menu</span>
            <span className="w-full h-[1px] bg-current opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-[1px]" />
          </button>
        </div>
      </header>

      {/* ── Fullscreen overlay ──────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-0 z-50 flex flex-col"
        style={{
          background: 'var(--bg-hero)',
          pointerEvents: menuOpen ? 'auto' : 'none',
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        {/* Overlay top bar */}
        <div className="flex items-center justify-between px-6 py-6 max-w-6xl mx-auto w-full">
          <Link href="/" onClick={close} aria-label="S. Roy — Home" className="flex items-center gap-3 text-fg-1 opacity-80 hover:opacity-100 transition-opacity duration-300">
            <LogoSVG />
            <span className="text-md font-regular tracking-tight leading-none">S. Roy</span>
          </Link>
          <button
            onClick={close}
            aria-label="Close menu"
            className="text-2xl leading-none transition-colors duration-200"
            style={{ color: 'var(--fg-2)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-2)')}
          >
            ×
          </button>
        </div>

        {/* Nav links — full-width, bordered rows */}
        <nav className="flex-1 flex flex-col justify-center">
          {NAV_LINKS.map(({ label, href, soon }, i) => {
            const isHovered = hoveredItem === label && !soon
            return (
              <Link
                key={label}
                href={soon ? '#' : href}
                onClick={(e) => {
                  if (soon) { e.preventDefault(); return }
                  setHoveredItem(null)
                  close()
                }}
                onMouseEnter={() => { if (!soon) setHoveredItem(label) }}
                onMouseLeave={() => setHoveredItem(null)}
                className="group relative w-full flex items-center justify-center gap-4 py-3 select-none overflow-hidden"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  background: isHovered ? '#fff' : 'transparent',
                  opacity: menuOpen ? (soon ? 0.35 : 1) : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                  cursor: soon ? 'default' : 'pointer',
                  transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms, background 0.45s cubic-bezier(0.22,1,0.36,1)`,
                }}
              >
                {!soon && <MenuMarquee label={label} visible={isHovered} />}
                <span
                  className="relative z-10"
                  style={{
                    fontSize: 10,
                    color: isHovered ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.25)',
                    minWidth: 24,
                    opacity: isHovered ? 0 : 1,
                    transition: 'color 0.35s ease, opacity 0.24s ease',
                  }}
                >
                  0{i + 1}
                </span>
                <span
                  className="relative z-10"
                  style={{
                    fontSize: 'clamp(48px, 7vw, 72px)',
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    color: isHovered ? '#08080a' : 'var(--fg-2)',
                    opacity: isHovered ? 0 : 1,
                    transition: 'color 0.35s ease, opacity 0.24s ease',
                  }}
                >
                  {label}
                </span>
                {soon && (
                  <span
                    className="relative z-10"
                    style={{
                      fontSize: 9, fontWeight: 500, letterSpacing: '0.12em',
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                      border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999,
                      padding: '3px 8px',
                    }}
                  >
                    soon
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Social icons — bottom right */}
        <div className="flex items-center justify-end gap-4 px-6 pb-8 max-w-6xl mx-auto w-full">
          {SOCIALS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="transition-opacity duration-200 opacity-40 hover:opacity-100"
              style={{ color: 'var(--fg-1)' }}
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

function MenuMarquee({ label, visible }: { label: string; visible: boolean }) {
  const items = Array.from({ length: 12 })

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.32s cubic-bezier(0.22,1,0.36,1), transform 0.42s cubic-bezier(0.22,1,0.36,1)',
          mixBlendMode: 'normal',
        }}
      >
        <div
          className="menu-marquee-track"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 54,
            height: '100%',
            width: 'max-content',
            animation: 'menuMarquee 24s linear infinite',
            animationPlayState: visible ? 'running' : 'paused',
            willChange: 'transform',
          }}
        >
          {items.map((_, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 54, flexShrink: 0 }}>
              <span
                style={{
                  color: '#08080a',
                  fontSize: 'clamp(40px, 5vw, 58px)',
                  fontWeight: 300,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  textTransform: 'lowercase',
                }}
              >
                {label}
              </span>
              <span
                style={{
                  width: 'clamp(150px, 13vw, 250px)',
                  height: '76px',
                  display: 'block',
                  background: index % 2 === 0
                    ? 'linear-gradient(135deg,#ff3b1f 0%,#ff595e 35%,#9b0f4d 70%,#05020a 100%)'
                    : 'linear-gradient(135deg,#06100a 0%,#00345c 35%,#3b0a62 72%,#f04b23 100%)',
                  filter: 'saturate(1.25) contrast(1.08)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes menuMarquee {
          from { transform: translate3d(-50%, 0, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
      `}</style>
    </>
  )
}

function LogoSVG() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4"/>
      <path
        d="M7 10 Q7 7 10 7 H15 Q18 7 18 10 Q18 13 15 13 H11 Q8 13 8 16 Q8 19 11 19 H17 Q20 19 20 22 Q20 25 17 25 H12 Q9 25 9 22"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
      <path d="M22 7 L22 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path
        d="M22 7 Q28 7 28 13 Q28 19 22 19 L28 25"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}
