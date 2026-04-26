'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(10px)'
    const t = setTimeout(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, 16)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: 'translateY(10px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      }}
    >
      {children}
    </div>
  )
}
