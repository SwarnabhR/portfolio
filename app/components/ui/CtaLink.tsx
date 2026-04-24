'use client'

import { useRef } from 'react'

interface CtaLinkProps {
  label: string
  href?: string
  onClick?: () => void
  external?: boolean
  className?: string
}

function Arrow(){
    return (
        <svg
            width="14"
            height="14"
            viewBox='0 0 14 14'
            fill="none"
            aria-hidden="true"
            style={{
                display: 'inline-block',
                flexShrink: 0,
                transform: 'translateY(1px)',
                transition: `transform var(--transition-base)`,
            }}
        >
            <path
                d="M1 7h12M8 2l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default function CtaLink({
  label,
  href = '#',
  onClick,
  external = false,
  className = '',
}: CtaLinkProps) {

  const linkRef = useRef<HTMLAnchorElement>(null)

  return (
    <>
      <style>{`
        .cta-link {
          position:    relative;
          display:     inline-flex;
          align-items: center;
          gap:         var(--space-2);
          font-size:   var(--text-sm);
          font-weight: var(--weight-regular);
          color:       var(--fg-1);
          padding-bottom: 3px;
        }

        .cta-link::after {
          content:          '';
          position:         absolute;
          bottom:           0;
          left:             0;
          width:            100%;
          height:           1px;
          background:       var(--border-pill);
          transform:        scaleX(1);
          transform-origin: left center;
          transition:       opacity var(--transition-base);
          opacity:          0.4;
        }

        .cta-link:hover::after {
          opacity: 1;
        }

        .cta-link:hover .cta-arrow {
          transform: translate(3px, 1px);
        }

        .cta-arrow {
          transition: transform var(--transition-base);
        }
      `}</style>

      <a
        ref={linkRef}
        href={href}
        onClick={onClick}
        className={`cta-link ${className}`}
        {...(external && {
          target: '_blank',
          rel:    'noopener noreferrer',
        })}
      >
        {label}
        <span className="cta-arrow">
          <Arrow />
        </span>
      </a>
    </>
  )
}