// app/playground/backtesting-engine/components/MetricsGrid.tsx

import React from 'react'
import type { Metrics } from '../types'
import { fmt, pct } from '../lib/format'

interface MetricsGridProps {
  metrics: Metrics
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const cards = [
    { label: 'Total Return', value: pct(metrics.total_return_pct),         hi: metrics.total_return_pct >= 0,  alwaysRed: false },
    { label: 'CAGR',         value: pct(metrics.cagr),                     hi: metrics.cagr >= 0,              alwaysRed: false },
    { label: 'Sharpe Ratio', value: fmt(metrics.sharpe_ratio, 3),          hi: metrics.sharpe_ratio >= 1,      alwaysRed: false },
    { label: 'Max Drawdown', value: `${fmt(metrics.max_drawdown_pct)}%`,   hi: false,                          alwaysRed: true  },
    { label: 'Win Rate',     value: `${fmt(metrics.win_rate)}%`,           hi: metrics.win_rate >= 50,         alwaysRed: false },
    { label: 'Total Trades', value: String(metrics.total_trades),          hi: true,                           alwaysRed: false },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: 10,
      marginBottom: 24,
    }}>
      {cards.map(m => (
        <div key={m.label} style={{
          padding: '16px 18px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 4,
        }}>
          <span style={{
            fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 8,
          }}>
            {m.label}
          </span>
          <span style={{
            fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 300,
            fontVariantNumeric: 'tabular-nums',
            color: m.alwaysRed
              ? 'rgba(239,68,68,0.9)'
              : m.hi ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.85)',
          }}>
            {m.value}
          </span>
        </div>
      ))}
    </div>
  )
}