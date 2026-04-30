// app/playground/backtesting-engine/components/TradeTable.tsx
'use client'

import { useCallback } from 'react'
import { useBacktestStore } from '@/store/backtestStore'
import type { BacktestTrade } from '../types'
import { fmt, pct } from '../lib/format'

interface TradeTableProps {
  trades:       BacktestTrade[]
  currency:     string
  symbol:       string
  variantCls:   string
  startDate:    string
  endDate:      string
}

const chipStyle = (active: boolean): React.CSSProperties => ({
  padding: '5px 14px',
  fontSize: 12,
  letterSpacing: '0.06em',
  borderRadius: 999,
  border: `1px solid ${active ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
  background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
  color: active ? 'var(--fg-1)' : 'rgba(255,255,255,0.4)',
  cursor: 'pointer',
  transition: 'all 0.15s',
  whiteSpace: 'nowrap' as const,
})

export function TradeTable({
  trades, currency, symbol, variantCls, startDate, endDate,
}: TradeTableProps) {
  const showTrades    = useBacktestStore(s => s.showTrades)
  const setShowTrades = useBacktestStore(s => s.setShowTrades)

  const downloadCSV = useCallback(() => {
    const headers = ['entry_date', 'exit_date', 'direction', 'pnl', 'pnl_pct']
    const rows = trades.map(t => [
      t.entry_date, t.exit_date, t.direction,
      t.pnl.toFixed(2), t.pnl_pct.toFixed(2),
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${symbol}_${variantCls}_${startDate}_${endDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [trades, symbol, variantCls, startDate, endDate])

  return (
    <>
      {/* ── Toggle + Export row ── */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
        <button onClick={() => setShowTrades(!showTrades)} style={chipStyle(showTrades)}>
          {showTrades ? 'Hide' : 'Show'} Trade Log ({trades.length})
        </button>
        <button
          onClick={downloadCSV}
          style={{ ...chipStyle(false), display: 'flex', alignItems: 'center', gap: 6 }}
          title="Download full trade log as CSV"
        >
          ↓ Export CSV
        </button>
      </div>

      {/* ── Table ── */}
      {showTrades && trades.length > 0 && (
        <div style={{ overflowX: 'auto', marginBottom: 40 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {['Entry', 'Exit', 'Direction', 'P&L', 'P&L %'].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', textAlign: 'left',
                    fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)', fontWeight: 400,
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.slice(0, 100).map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '7px 12px', color: 'rgba(255,255,255,0.55)',
                    fontVariantNumeric: 'tabular-nums' }}>{t.entry_date}</td>
                  <td style={{ padding: '7px 12px', color: 'rgba(255,255,255,0.55)',
                    fontVariantNumeric: 'tabular-nums' }}>{t.exit_date}</td>
                  <td style={{ padding: '7px 12px', fontSize: 10, letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: t.direction === 'long' ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)',
                  }}>{t.direction}</td>
                  <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                    color: t.pnl >= 0 ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)',
                  }}>{currency}{fmt(Math.abs(t.pnl))}</td>
                  <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                    color: t.pnl_pct >= 0 ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)',
                  }}>{pct(t.pnl_pct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {trades.length > 100 && (
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)',
              marginTop: 8, textAlign: 'center' }}>
              Showing first 100 of {trades.length} trades
            </p>
          )}
        </div>
      )}
    </>
  )
}