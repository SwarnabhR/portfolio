'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useActiveSection } from '../../hooks/useActiveSection'

const NAV_LINKS = [
  { label: 'about',    href: '#about'    },
  { label: 'work',     href: '#work'     },
  { label: 'services', href: '#services' },
  { label: 'contact',  href: '#contact'  },
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
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="14" cy="14" r="13.25" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5"/>
        <path d="M10.5 11.5H8.5V19.5H10.5V11.5Z" fill="currentColor"/>
        <circle cx="9.5" cy="9.5" r="1" fill="currentColor"/>
        <path d="M19.5 14.5C19.5 13.12 18.38 12 17 12C15.62 12 14.5 13.12 14.5 14.5V19.5H12.5V11.5H14.5V12.5C15.05 11.87 15.98 11.5 17 11.5C19.49 11.5 21.5 13.51 21.5 16V19.5H19.5V14.5Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="14" cy="14" r="13.25" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5"/>
        <path d="M20 9L15.5 14.2L20.5 20H17.5L14 15.8L10.5 20H7.5L12.3 14.5L7.5 9H10.5L13.8 12.9L17 9H20Z" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const activeSection             = useActiveSection()

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
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
        }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" aria-label="S. Roy — Home" className="text-fg-1 opacity-80 hover:opacity-100 transition-opacity duration-300">
            <LogoSVG />
          </Link>

          <button
            onClick={() => setMenuOpen(true)}
            className="text-xs tracking-wider uppercase transition-colors duration-300"
            style={{ color: 'var(--fg-2)' }}
            aria-label="Open menu"
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-2)')}
          >
            menu
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
          <Link href="/" onClick={close} aria-label="S. Roy — Home" className="text-fg-1 opacity-80 hover:opacity-100 transition-opacity duration-300">
            <LogoSVG />
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
          {NAV_LINKS.map(({ label, href }, i) => {
            const isActive = activeSection === href.replace('#', '')
            return (
              <Link
                key={label}
                href={href}
                onClick={close}
                className="w-full flex items-center justify-center gap-4 py-3 select-none"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
                  transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.querySelector('.nav-label')!.setAttribute('style', 'color: var(--fg-1); font-size: clamp(48px, 7vw, 72px); font-weight: 300; letter-spacing: -0.03em; transition: color 0.2s ease;')
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  const color = isActive ? 'var(--fg-1)' : 'var(--fg-2)'
                  el.querySelector('.nav-label')!.setAttribute('style', `color: ${color}; font-size: clamp(48px, 7vw, 72px); font-weight: 300; letter-spacing: -0.03em; transition: color 0.2s ease;`)
                }}
              >
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', minWidth: 24 }}>
                  0{i + 1}
                </span>
                <span
                  className="nav-label"
                  style={{
                    fontSize: 'clamp(48px, 7vw, 72px)',
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    color: isActive ? 'var(--fg-1)' : 'var(--fg-2)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {label}
                </span>
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
