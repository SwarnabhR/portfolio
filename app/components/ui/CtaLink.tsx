'use client'

import Link from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

interface CtaLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  external?: boolean
}

export default function CtaLink({ href, children, external, className = '', style, ...rest }: CtaLinkProps) {
  const isExternal = external ?? href.startsWith('http')

  const sharedStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    fontWeight: 300,
    color: 'rgba(255,255,255,0.85)',
    border: '0.5px solid rgba(255,255,255,0.18)',
    borderRadius: 3,
    padding: '9px 18px',
    position: 'relative',
    overflow: 'hidden',
    isolation: 'isolate' as const,
    letterSpacing: '0.03em',
    textDecoration: 'none',
    cursor: 'none',
    transition: 'color 0.35s, border-color 0.35s, box-shadow 0.35s',
    ...style,
  }

  const inner = (
    <>
      <span
        className="cta-bg"
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse 80% 80% at 50% 50%,
              rgba(61,0,128,0.22) 0%, rgba(120,0,30,0.14) 50%, transparent 80%),
            repeating-linear-gradient(45deg,
              rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px,
              transparent 1px, transparent 8px)
          `,
          opacity: 0, transition: 'opacity 0.35s', zIndex: 1, pointerEvents: 'none',
        }}
      />
      <span
        className="cta-glow"
        aria-hidden="true"
        style={{
          position: 'absolute', top: 0, left: '-80%',
          width: '60%', height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(180,60,255,0.25) 40%, rgba(255,255,255,0.18) 50%, rgba(180,0,60,0.18) 60%, transparent)',
          filter: 'blur(1px)', opacity: 0, zIndex: 1, pointerEvents: 'none',
        }}
      />
      <span style={{ position: 'relative', zIndex: 3 }}>{children}</span>
    </>
  )

  if (isExternal) {
    return (
      <>
        <CtaStyles />
        <a href={href} target="_blank" rel="noopener noreferrer"
          className={`cta-link ${className}`} style={sharedStyle} {...rest}>
          {inner}
        </a>
      </>
    )
  }

  return (
    <>
      <CtaStyles />
      <Link href={href} className={`cta-link ${className}`} style={sharedStyle} {...rest}>
        {inner}
      </Link>
    </>
  )
}

function CtaStyles() {
  return (
    <style>{`
      @keyframes ctaGlow {
        0%   { left: -80%; }
        100% { left: 120%; }
      }
      .cta-link:hover {
        color: #fff !important;
        border-color: rgba(160,60,255,0.45) !important;
        box-shadow:
          0 0 18px rgba(80,0,160,0.35),
          0 0 40px rgba(120,0,30,0.20),
          inset 0 0 12px rgba(60,0,100,0.15) !important;
      }
      .cta-link:hover .cta-bg   { opacity: 1; }
      .cta-link:hover .cta-glow {
        opacity: 1;
        animation: ctaGlow 1.6s ease-in-out infinite;
      }
    `}</style>
  )
}
