'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'home',     href: '/',         soon: false },
  { label: 'work',     href: '/work',     soon: false },
  { label: 'blog',     href: '/blog',     soon: false },
  { label: 'gallery',  href: '/gallery',  soon: false },
  { label: 'playlist', href: '/playlist', soon: false },
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
    href: 'https://discord.com/users/1391443169832341595',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="14" cy="14" r="13.25" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5"/>
        <path d="M18.8 9.35C17.82 8.9 16.78 8.58 15.69 8.43C15.55 8.68 15.4 9.02 15.29 9.29C14.13 9.12 12.98 9.12 11.84 9.29C11.73 9.02 11.57 8.68 11.44 8.43C10.34 8.58 9.3 8.9 8.33 9.35C6.36 12.26 5.83 15.1 6.1 17.91C7.41 18.87 8.69 19.45 9.94 19.83C10.25 19.41 10.52 18.96 10.76 18.49C10.31 18.32 9.89 18.11 9.48 17.86C9.59 17.78 9.69 17.7 9.79 17.62C12.26 18.75 14.94 18.75 17.38 17.62C17.48 17.7 17.59 17.78 17.69 17.86C17.29 18.11 16.86 18.32 16.41 18.49C16.65 18.96 16.92 19.41 17.23 19.83C18.49 19.45 19.76 18.87 21.08 17.91C21.39 14.65 20.55 11.84 18.8 9.35ZM11.4 16.19C10.66 16.19 10.05 15.51 10.05 14.68C10.05 13.84 10.65 13.17 11.4 13.17C12.15 13.17 12.77 13.85 12.75 14.68C12.75 15.51 12.15 16.19 11.4 16.19ZM15.75 16.19C15.01 16.19 14.4 15.51 14.4 14.68C14.4 13.84 15 13.17 15.75 13.17C16.5 13.17 17.12 13.85 17.1 14.68C17.1 15.51 16.5 16.19 15.75 16.19Z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'VSCO',
    href: 'https://vsco.co/666oxy',
    icon: (
      <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="256" cy="256" r="13.25" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5"/>
        <path d="M256,47.304c-115.075,0-208.696,93.62-208.696,208.696S140.925,464.696,256,464.696S464.696,371.075,464.696,256S371.075,47.304,256,47.304z M377.919,183.451l41.499-28.128c13.274,21.468,22.446,45.727,26.395,71.683l-49.87,5.412C392.981,214.788,386.76,198.252,377.919,183.451z M134.081,328.549l-41.499,28.128c-13.274-21.468-22.446-45.727-26.395-71.683l49.87-5.412C119.019,297.212,125.24,313.748,134.081,328.549z M148.281,192.228l41.444,28.43C184.081,231.2,180.87,243.23,180.87,256c0,11.605,2.647,22.6,7.365,32.422l-42.645,26.593c-9.442-17.594-14.807-37.689-14.807-59.015C130.783,232.725,137.173,210.918,148.281,192.228z M256,314.435c-32.22,0-58.435-26.213-58.435-58.435S223.78,197.565,256,197.565s58.435,26.213,58.435,58.435S288.22,314.435,256,314.435z M264.348,181.345v-50.277c36.389,2.408,68.578,20.422,89.912,47.403l-41.458,28.439C300.732,192.963,283.636,183.487,264.348,181.345z M264.348,114.34V64.193c26.434,1.136,51.499,7.638,74.131,18.448l-23.491,44.301C299.409,119.792,282.322,115.387,264.348,114.34z M247.652,114.34c-23.216,1.353-44.948,8.313-63.865,19.542l-28.015-41.58c26.968-16.573,58.321-26.665,91.881-28.109V114.34z M247.652,131.068v50.277c-19.288,2.143-36.384,11.618-48.455,25.567l-41.458-28.439C179.074,151.49,211.263,133.475,247.652,131.068z M197.106,302.565c12.142,15.326,30.116,25.82,50.547,28.09v50.277c-38.315-2.534-71.972-22.377-93.205-51.765L197.106,302.565z M247.652,397.66v50.147c-26.434-1.136-51.499-7.638-74.131-18.448l23.491-44.301C212.591,392.208,229.678,396.613,247.652,397.66z M264.348,397.66c23.216-1.353,44.948-8.313,63.865-19.542l28.015,41.58c-26.968,16.573-58.321,26.665-91.881,28.109V397.66z M264.348,380.932v-50.277c20.431-2.27,38.403-12.766,50.547-28.09l42.659,26.602C336.319,358.556,302.663,378.398,264.348,380.932z M366.411,315.015l-42.645-26.594c4.718-9.822,7.365-20.817,7.365-32.422c0-12.77-3.211-24.801-8.855-35.342l41.444-28.43c11.108,18.692,17.498,40.499,17.498,63.774C381.217,277.326,375.853,297.421,366.411,315.015z M410.037,141.511l-41.505,28.132c-10.664-13.864-23.821-25.714-38.805-34.861l23.486-44.291C375.385,103.564,394.719,120.956,410.037,141.511z M141.94,101.651l28.015,41.579c-14.938,11.425-27.554,25.739-36.993,42.11l-44.869-22.367C101.49,138.89,119.912,117.971,141.94,101.651z M80.617,177.902l44.877,22.37c-7.337,17.117-11.406,35.956-11.406,55.728c0,2.342,0.06,4.669,0.174,6.983l-49.85,5.409C64.148,264.293,64,260.164,64,256C64,228.205,69.945,201.775,80.617,177.902z M101.963,370.489l41.505-28.132c10.664,13.864,23.821,25.714,38.805,34.861l-23.486,44.291C136.615,408.436,117.281,391.044,101.963,370.489z M370.06,410.349l-28.015-41.579c14.938-11.425,27.555-25.739,36.993-42.11l44.869,22.365C410.51,373.11,392.088,394.029,370.06,410.349z M431.383,334.098l-44.877-22.37c7.337-17.117,11.406-35.956,11.406-55.728c0-2.342-0.06-4.669-0.174-6.983l49.85-5.409C447.852,247.707,448,251.836,448,256C448,283.795,442.055,310.225,431.383,334.098z" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [hidden, setHidden]       = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between w-full">
          <Link href="/" aria-label="S. Roy — Home" className="flex items-center gap-3 text-fg-1 opacity-80 hover:opacity-100 transition-opacity duration-300">
            <LogoSVG />
            <span className="text-md font-regular tracking-tight leading-none">S. Roy</span>
          </Link>

          {/* Desktop social icons */}
          <div className="hidden md:flex items-center gap-4">
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

          <button
            onClick={() => setMenuOpen(true)}
            onMouseEnter={e => { setMenuOpen(true); e.currentTarget.style.color = 'var(--fg-1)' }}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-2)')}
            className="flex flex-col items-stretch gap-1.25 transition-colors duration-300 group text-center"
            style={{ color: 'var(--fg-2)' }}
            aria-label="Open menu"
          >
            <span className="w-full h-px bg-current opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-px" />
            <span className="text-md tracking-widest uppercase leading-none">menu</span>
            <span className="w-full h-px bg-current opacity-40 group-hover:opacity-100 transition-all duration-300 group-hover:translate-y-px" />
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
          <Link href="/" onClick={close} onMouseEnter={close} aria-label="S. Roy — Home" className="flex items-center gap-3 text-fg-1 opacity-80 hover:opacity-100 transition-opacity duration-300">
            <LogoSVG />
            <span className="text-md font-regular tracking-tight leading-none">S. Roy</span>
          </Link>
          <button
            onClick={close}
            aria-label="Close menu"
            className="leading-none transition-colors duration-200"
            style={{ color: 'var(--fg-2)', fontSize: '48px' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-2)')}
          >
            ×
          </button>
        </div>

        {/* Nav links — full-width, bordered rows */}
        <nav className="flex-1 flex flex-col justify-center min-h-0">
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
                    fontSize: 'var(--text-xs)',
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
                      fontSize: 'var(--text-xs)', fontWeight: 500, letterSpacing: '0.12em',
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
        <div className="flex items-center justify-end gap-4 px-6 pb-8 w-full" style={{ position: 'relative', zIndex: 10 }}>
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
