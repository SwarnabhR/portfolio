'use client'

import { useState, useEffect } from 'react'

const SECTIONS = ['about', 'work', 'services', 'contact']

export function useActiveSection() {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { threshold: 0.4 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return active
}