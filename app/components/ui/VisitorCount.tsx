'use client'

import { useEffect, useState } from 'react'

export default function VisitorCount() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/visitors', { method: 'POST' })
      .then(r => r.json())
      .then(d => { if (typeof d.count === 'number') setCount(d.count) })
      .catch(() => {
        fetch('/api/visitors')
          .then(r => r.json())
          .then(d => { if (typeof d.count === 'number') setCount(d.count) })
          .catch(() => setCount(0))
      })
  }, [])

  if (count === null) return null

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-fg-3 tracking-wide">
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }}
      />
      {count.toLocaleString()} {count === 1 ? 'visitor' : 'visitors'}
    </span>
  )
}
