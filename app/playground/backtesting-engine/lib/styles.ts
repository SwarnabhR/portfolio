// app/playground/backtesting-engine/lib/styles.ts
import type React from 'react'

export const labelStyle: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  display: 'block',
  marginBottom: 6,
}

export const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 6,
  padding: 20,
}

export const chipStyle = (active: boolean): React.CSSProperties => ({
  padding: '5px 14px',
  fontSize: 12,
  letterSpacing: '0.06em',
  borderRadius: 'var(--radius-pill)',
  border: `1px solid ${active ? 'rgba(var(--accent-rgb), 0.5)' : 'var(--border)'}`,
  background: active ? 'rgba(var(--accent-rgb), 0.10)' : 'transparent',
  color: active ? 'var(--fg-1)' : 'var(--fg-3)',
  cursor: 'pointer',
  transition: 'all 0.15s',
  whiteSpace: 'nowrap' as const,
})