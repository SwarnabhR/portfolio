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
    fontSize: 'var(--text-sm)',
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
      <a href={href} target="_blank" rel="noopener noreferrer"
        className={`cta-link ${className}`} style={sharedStyle} {...rest}>
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} className={`cta-link ${className}`} style={sharedStyle} {...rest}>
      {inner}
    </Link>
  )
}
