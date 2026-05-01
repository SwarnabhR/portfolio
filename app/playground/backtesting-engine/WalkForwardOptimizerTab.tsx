'use client'

// ═══════════════════════════════════════════════════════════════════════════════
// WalkForwardOptimizerTab.tsx
// Drop-in replacement for the {activeTab === 'optimizer'} section.
// Reads/writes the same Zustand store slices already defined in backtestStore.
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useRef, useEffect, useCallback } from 'react'
import { useBacktestStore } from '@/store/backtestStore'
import { fmt, pct } from './lib/format'
import { labelStyle, cardStyle, chipStyle } from './lib/styles'
import { WFWindow, WFResult, OptMetric, StrategyMeta } from './types';

// ── re-use the same STRATEGIES / EXCHANGES constants from the parent file ──
// Import them if you extract this to its own file, or keep this component
// inline inside BacktestingEnginePage.tsx and share the consts directly.

// ---------------------------------------------------------------------------
// Types (already declared in the parent file – remove duplicates if co-located)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Helpers

// ---------------------------------------------------------------------------
// OOS Equity Canvas
// ---------------------------------------------------------------------------
function OOSEquityChart({ curve, initialCapital }: {
  curve: { date: string; value: number }[]
  initialCapital: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || curve.length < 2) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = canvas.offsetWidth  * devicePixelRatio
    canvas.height = canvas.offsetHeight * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    const w = canvas.offsetWidth
    const h = canvas.offsetHeight

    ctx.clearRect(0, 0, w, h)
    const pad = { top: 24, right: 24, bottom: 36, left: 72 }

    const values = curve.map(p => p.value)
    const minV = Math.min(...values) * 0.995
    const maxV = Math.max(...values) * 1.005
    const scaleX = (i: number) => pad.left + (i / (curve.length - 1)) * (w - pad.left - pad.right)
    const scaleY = (v: number) => pad.top  + (1 - (v - minV) / (maxV - minV)) * (h - pad.top - pad.bottom)

    // grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (i / 4) * (h - pad.top - pad.bottom)
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke()
      const val = maxV - (i / 4) * (maxV - minV)
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = '10px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(val.toLocaleString('en-IN', { maximumFractionDigits: 0 }), pad.left - 6, y + 4)
    }

    // initial capital baseline
    const baseY = scaleY(initialCapital)
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(pad.left, baseY); ctx.lineTo(w - pad.right, baseY); ctx.stroke()
    ctx.setLineDash([])

    const isPositive = values[values.length - 1] >= initialCapital
    const lineColor  = isPositive ? 'rgba(160,96,255,0.9)' : 'rgba(239,68,68,0.9)'

    // fill gradient
    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom)
    if (isPositive) {
      grad.addColorStop(0,   'rgba(160,96,255,0.2)')
      grad.addColorStop(0.7, 'rgba(160,96,255,0.05)')
      grad.addColorStop(1,   'rgba(160,96,255,0)')
    } else {
      grad.addColorStop(0,   'rgba(239,68,68,0.2)')
      grad.addColorStop(0.7, 'rgba(239,68,68,0.05)')
      grad.addColorStop(1,   'rgba(239,68,68,0)')
    }
    ctx.beginPath()
    ctx.moveTo(scaleX(0), h - pad.bottom)
    curve.forEach((p, i) => ctx.lineTo(scaleX(i), scaleY(p.value)))
    ctx.lineTo(scaleX(curve.length - 1), h - pad.bottom)
    ctx.closePath()
    ctx.fillStyle = grad
    ctx.fill()

    // line
    ctx.beginPath()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 1.5
    curve.forEach((p, i) => {
      if (i === 0) ctx.moveTo(scaleX(i), scaleY(p.value))
      else         ctx.lineTo(scaleX(i), scaleY(p.value))
    })
    ctx.stroke()

    // x-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.textAlign = 'center'
    const step = Math.max(1, Math.floor(curve.length / 5))
    for (let i = 0; i < curve.length; i += step) {
      ctx.fillText(curve[i].date.slice(0, 7), scaleX(i), h - pad.bottom + 16)
    }
  }, [curve, initialCapital])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 240, display: 'block' }}
    />
  )
}

// ---------------------------------------------------------------------------
// In-sample vs Out-of-sample Sharpe scatter mini-chart (SVG)
// ---------------------------------------------------------------------------
function SharpeCorrChart({ windows }: { windows: WFWindow[] }) {
  if (windows.length < 2) return null

  const W = 300, H = 200, pad = 40
  const xs = windows.map(w => w.in_sharpe)
  const ys = windows.map(w => w.out_sharpe)
  const minX = Math.min(...xs) - 0.2
  const maxX = Math.max(...xs) + 0.2
  const minY = Math.min(...ys) - 0.2
  const maxY = Math.max(...ys) + 0.2

  const sx = (v: number) => pad + ((v - minX) / (maxX - minX)) * (W - pad * 2)
  const sy = (v: number) => (H - pad) - ((v - minY) / (maxY - minY)) * (H - pad * 2)

  // linear regression
  const n = xs.length
  const sumX = xs.reduce((a, b) => a + b, 0)
  const sumY = ys.reduce((a, b) => a + b, 0)
  const sumXY = xs.reduce((a, v, i) => a + v * ys[i], 0)
  const sumX2 = xs.reduce((a, v) => a + v * v, 0)
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  const regY1 = slope * minX + intercept
  const regY2 = slope * maxX + intercept

  return (
    <div>
      <span style={{ ...labelStyle, display: 'block', marginBottom: 10 }}>
        IS vs OOS Sharpe Correlation
      </span>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W, overflow: 'visible' }}>
        {/* axes */}
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="rgba(255,255,255,0.15)" />
        <line x1={pad} y1={pad}     x2={pad}      y2={H - pad} stroke="rgba(255,255,255,0.15)" />

        {/* axis labels */}
        <text x={W / 2} y={H - 6} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9}>In-sample Sharpe</text>
        <text x={10} y={H / 2} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9}
          transform={`rotate(-90, 10, ${H / 2})`}>OOS Sharpe</text>

        {/* regression line */}
        <line
          x1={sx(minX)} y1={sy(regY1)}
          x2={sx(maxX)} y2={sy(regY2)}
          stroke="rgba(160,96,255,0.4)" strokeWidth={1} strokeDasharray="4 4"
        />

        {/* zero lines */}
        {minY < 0 && maxY > 0 && (
          <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)}
            stroke="rgba(255,255,255,0.08)" strokeDasharray="3 5" />
        )}
        {minX < 0 && maxX > 0 && (
          <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad}
            stroke="rgba(255,255,255,0.08)" strokeDasharray="3 5" />
        )}

        {/* data points */}
        {windows.map((w, i) => (
          <circle
            key={i}
            cx={sx(w.in_sharpe)} cy={sy(w.out_sharpe)}
            r={5}
            fill={w.out_sharpe > 0 ? 'rgba(160,96,255,0.75)' : 'rgba(239,68,68,0.7)'}
            stroke={'rgba(255,255,255,0.15)'}
            strokeWidth={1}
          >
            <title>W{w.window + 1} IS:{w.in_sharpe.toFixed(2)} OOS:{w.out_sharpe.toFixed(2)}</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Per-window OOS Returns bar chart (SVG)
// ---------------------------------------------------------------------------
function WindowReturnBars({ windows }: { windows: WFWindow[] }) {
  const W = 400, H = 140, padL = 8, padR = 8, padT = 12, padB = 28
  const returns = windows.map(w => w.out_return)
  const absMax  = Math.max(Math.abs(Math.min(...returns)), Math.abs(Math.max(...returns)), 0.01)
  const midY    = padT + (H - padT - padB) / 2
  const barW    = Math.max(8, (W - padL - padR) / windows.length - 4)
  const scaleH  = (v: number) => ((H - padT - padB) / 2) * (v / absMax)

  return (
    <div>
      <span style={{ ...labelStyle, display: 'block', marginBottom: 10 }}>
        OOS Return per Window
      </span>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: W }}>
        {/* zero baseline */}
        <line x1={padL} y1={midY} x2={W - padR} y2={midY} stroke="rgba(255,255,255,0.15)" />

        {windows.map((w, i) => {
          const x    = padL + i * ((W - padL - padR) / windows.length) + ((W - padL - padR) / windows.length - barW) / 2
          const h    = Math.abs(scaleH(w.out_return))
          const pos  = w.out_return >= 0
          const y    = pos ? midY - h : midY
          return (
            <g key={i}>
              <rect
                x={x} y={y} width={barW} height={Math.max(h, 1)}
                fill={pos ? 'rgba(160,96,255,0.6)' : 'rgba(239,68,68,0.5)'}
                rx={2}
              >
                <title>W{w.window + 1}: {pct(w.out_return)}</title>
              </rect>
              <text x={x + barW / 2} y={H - 8} textAnchor="middle"
                fill="rgba(255,255,255,0.3)" fontSize={8}>
                W{w.window + 1}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// WFO Summary KPI strip
// ---------------------------------------------------------------------------
function WFOKPIs({ result }: {
  result: WFResult
}) {
  const kpis = [
    { label: 'Avg OOS Return', value: pct(result.avg_out_return),
      hi: result.avg_out_return >= 0 },
    { label: 'Avg OOS CAGR',   value: pct(result.avg_out_cagr),
      hi: result.avg_out_cagr >= 0 },
    { label: 'Avg OOS Sharpe', value: fmt(result.avg_out_sharpe, 3),
      hi: result.avg_out_sharpe >= 1 },
    { label: 'Consistency',    value: `${result.consistency}%`,
      hi: result.consistency >= 55 },
    { label: 'Total OOS Trades', value: String(result.total_trades), hi: true },
    { label: 'Windows Run',    value: String(result.windows.length), hi: true },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 24 }}>
      {kpis.map(m => (
        <div key={m.label} style={{ padding: '16px 18px', background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 8 }}>
            {m.label}
          </span>
          <span style={{
            fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 300,
            fontVariantNumeric: 'tabular-nums',
            color: m.hi ? 'rgba(160,96,255,0.9)' : 'rgba(239,68,68,0.85)',
          }}>
            {m.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Window detail table
// ---------------------------------------------------------------------------
function WindowTable({ windows, strategy }: {
  windows: WFWindow[]
  strategy: { params: { key: string; label: string }[] }
}) {
  const paramKeys = strategy.params.map(p => p.key)
  const paramLabels = Object.fromEntries(strategy.params.map(p => [p.key, p.label]))

  return (
    <div style={{ overflowX: 'auto', marginBottom: 32 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            {['Win', 'IS Period', 'OOS Period',
              ...paramKeys.map(k => paramLabels[k] ?? k),
              'IS Sharpe', 'IS CAGR', 'OOS Sharpe', 'OOS CAGR', 'OOS Return', 'Trades', 'Drawdown'
            ].map(h => (
              <th key={h} style={{ padding: '8px 12px', textAlign: 'left',
                fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)', fontWeight: 400, whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {windows.map((w, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ padding: '7px 12px', color: 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums' }}>
                W{w.window + 1}
              </td>
              <td style={{ padding: '7px 12px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', fontSize: 11 }}>
                {w.in_start} → {w.in_end}
              </td>
              <td style={{ padding: '7px 12px', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', fontSize: 11 }}>
                {w.out_start} → {w.out_end}
              </td>
              {paramKeys.map(k => (
                <td key={k} style={{ padding: '7px 12px', color: 'rgba(160,96,255,0.8)',
                  fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                  {w.best_params[k] ?? '—'}
                </td>
              ))}
              <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                color: w.in_sharpe >= 1 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)' }}>
                {fmt(w.in_sharpe, 3)}
              </td>
              <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                color: w.in_cagr >= 0 ? 'rgba(255,255,255,0.7)' : 'rgba(239,68,68,0.7)' }}>
                {pct(w.in_cagr)}
              </td>
              <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                color: w.out_sharpe >= 1 ? 'rgba(160,96,255,0.9)'
                     : w.out_sharpe >= 0 ? 'rgba(255,255,255,0.7)' : 'rgba(239,68,68,0.8)' }}>
                {fmt(w.out_sharpe, 3)}
              </td>
              <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                color: w.out_cagr >= 0 ? 'rgba(160,96,255,0.9)' : 'rgba(239,68,68,0.8)' }}>
                {pct(w.out_cagr)}
              </td>
              <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                color: w.out_return >= 0 ? 'rgba(160,96,255,0.9)' : 'rgba(239,68,68,0.8)',
                fontWeight: 500 }}>
                {pct(w.out_return)}
              </td>
              <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                color: 'rgba(255,255,255,0.5)' }}>
                {w.out_trades}
              </td>
              <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                color: 'rgba(239,68,68,0.7)' }}>
                {fmt(w.out_drawdown)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main exported component — replace {activeTab === 'optimizer'} block with this
// ---------------------------------------------------------------------------
export function WalkForwardOptimizerTab({
  STRATEGIES,
  handleRunWFO,
}: {
  STRATEGIES: StrategyMeta[]
  handleRunWFO: () => Promise<void>
}) {
  // Zustand slices
  const strategyIdx = useBacktestStore(s => s.strategyIdx)
  const variantIdx  = useBacktestStore(s => s.variantIdx)
  const wfInSample  = useBacktestStore(s => s.wfInSample)
  const wfOutSample = useBacktestStore(s => s.wfOutSample)
  const wfMode      = useBacktestStore(s => s.wfMode)
  const optMetric   = useBacktestStore(s => s.optMetric)
  const wfStatus    = useBacktestStore(s => s.wfStatus)
  const wfStatusMsg = useBacktestStore(s => s.wfStatusMsg)
  const wfResult    = useBacktestStore(s => s.wfResult)
  const initialCapital = useBacktestStore(s => s.initialCapital)
  const setStrategyIdx = useBacktestStore(s => s.setStrategyIdx)
  const setVariantIdx  = useBacktestStore(s => s.setVariantIdx)
  const setWfInSample  = useBacktestStore(s => s.setWfInSample)
  const setWfOutSample = useBacktestStore(s => s.setWfOutSample)
  const setWfMode      = useBacktestStore(s => s.setWfMode)
  const setOptMetric   = useBacktestStore(s => s.setOptMetric)


  const strategy    = STRATEGIES[strategyIdx]
  const isWfoRunning = ['fetching', 'loading', 'running'].includes(wfStatus)

  // ── Param grid preview: how many combos will be searched ──
  const paramGrid: Record<string, number[]> = {}
  strategy.params.forEach((p: { key: string; min: number; max: number; step: number }) => {
    const vals: number[] = []
    const stride = Math.max(p.step, Math.floor((p.max - p.min) / 6 / p.step) * p.step)
    for (let v = p.min; v <= p.max && vals.length < 7; v = Math.round((v + stride) * 1000) / 1000) {
      vals.push(v)
    }
    paramGrid[p.key] = vals
  })
  const totalCombos = Object.values(paramGrid).reduce((a: number, v) => a * (v as number[]).length, 1)

  // ── Export windows CSV ──
  const exportCSV = useCallback(() => {
    if (!wfResult) return
    const headers = ['window', 'in_start', 'in_end', 'out_start', 'out_end',
      ...strategy.params.map((p: { key: string }) => `best_${p.key}`),
      'in_sharpe', 'in_cagr', 'out_sharpe', 'out_cagr', 'out_return', 'out_trades', 'out_drawdown']
    const rows = wfResult.windows.map((w: WFWindow) => [
      w.window + 1, w.in_start, w.in_end, w.out_start, w.out_end,
      ...strategy.params.map((p: { key: string }) => w.best_params[p.key] ?? ''),
      w.in_sharpe, w.in_cagr, w.out_sharpe, w.out_cagr, w.out_return, w.out_trades, w.out_drawdown,
    ].join(','))
    const csv  = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `wfo_${strategy.cls}_windows.csv`; a.click()
    URL.revokeObjectURL(url)
  }, [wfResult, strategy])

  // ── Window count estimate ──
  // rough estimate: shows user how many windows will be generated
  const estWindows = React.useMemo(() => {
    if (wfMode === 'anchored') {
      // fixed IS start → each step advances by wfOutSample
      return Math.max(1, Math.floor(500 / wfOutSample)) // rough with 500 trading days
    }
    return Math.max(1, Math.floor(500 / (wfInSample + wfOutSample)))
  }, [wfMode, wfInSample, wfOutSample])

  // ── Metric options ──
  const METRICS = [
    { key: 'sharpe_ratio', label: 'Sharpe Ratio' },
    { key: 'cagr',         label: 'CAGR' },
    { key: 'total_return_pct', label: 'Total Return' },
  ]

  return (
    <div style={{ animation: 'btFadeIn 0.3s ease' }}>

      {/* ── Section title ── */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 300,
          letterSpacing: '-0.02em', color: 'var(--fg-1)', marginBottom: 6 }}>
          Walk-Forward Optimizer
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', maxWidth: 560, lineHeight: 1.65 }}>
          Grid-searches parameters on an in-sample window, then evaluates the best combo on the
          unseen out-of-sample window — repeated across the full date range.
          Results reflect true out-of-sample performance, not in-sample overfit.
        </p>
      </div>

      {/* ── Strategy selector (shared with backtest tab) ── */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <label style={labelStyle}>Strategy &amp; Variant</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {STRATEGIES.map((s: { cls: string; label: string }, i: number) => (
            <button key={s.cls} onClick={() => { setStrategyIdx(i); setVariantIdx(0) }}
              style={chipStyle(strategyIdx === i)}>
              {s.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {strategy.variants.map((v: { key: string; label: string }, i: number) => (
            <button key={v.key} onClick={() => setVariantIdx(i)} style={chipStyle(variantIdx === i)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── WFO configuration grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>

        {/* In-sample window */}
        <div style={cardStyle}>
          <label style={labelStyle}>In-Sample Window (trading days)</label>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {['3 mo', '6 mo', '1 yr', '2 yr'].find((_, i) => [60, 125, 252, 504][i] === wfInSample) ?? `${wfInSample}d`}
            </span>
            <span style={{ fontSize: 14, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>
              {wfInSample}
            </span>
          </div>
          <input
            type="range" min={40} max={504} step={1}
            value={wfInSample}
            onChange={e => setWfInSample(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'rgba(160,96,255,0.8)', marginBottom: 10 }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            {[['3M', 60], ['6M', 125], ['1Y', 252], ['2Y', 504]].map(([label, val]) => (
              <button key={label as string} onClick={() => setWfInSample(val as number)}
                style={{ ...chipStyle(wfInSample === val), padding: '3px 10px', fontSize: 11 }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Out-of-sample window */}
        <div style={cardStyle}>
          <label style={labelStyle}>Out-of-Sample Window (trading days)</label>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {['1 mo', '3 mo', '6 mo', '1 yr'].find((_, i) => [21, 60, 125, 252][i] === wfOutSample) ?? `${wfOutSample}d`}
            </span>
            <span style={{ fontSize: 14, color: 'var(--fg-1)', fontVariantNumeric: 'tabular-nums' }}>
              {wfOutSample}
            </span>
          </div>
          <input
            type="range" min={10} max={252} step={1}
            value={wfOutSample}
            onChange={e => setWfOutSample(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'rgba(160,96,255,0.8)', marginBottom: 10 }}
          />
          <div style={{ display: 'flex', gap: 6 }}>
            {[['1M', 21], ['3M', 60], ['6M', 125], ['1Y', 252]].map(([label, val]) => (
              <button key={label as string} onClick={() => setWfOutSample(val as number)}
                style={{ ...chipStyle(wfOutSample === val), padding: '3px 10px', fontSize: 11 }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Mode toggle */}
        <div style={cardStyle}>
          <label style={labelStyle}>Walk Mode</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button onClick={() => setWfMode('anchored')} style={chipStyle(wfMode === 'anchored')}>
              Anchored
            </button>
            <button onClick={() => setWfMode('rolling')} style={chipStyle(wfMode === 'rolling')}>
              Rolling
            </button>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, margin: 0 }}>
            {wfMode === 'anchored'
              ? 'IS start is fixed. Each window grows the IS period — more stable parameter estimates.'
              : 'IS window slides forward each step — adapts to regime changes, less lookback bias.'}
          </p>
        </div>

        {/* Optimization metric */}
        <div style={cardStyle}>
          <label style={labelStyle}>Optimization Metric</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {METRICS.map(m => (
              <button key={m.key} onClick={() => setOptMetric(m.key as OptMetric)}
                style={chipStyle(optMetric === m.key)}>
                {m.label}
              </button>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, margin: 0 }}>
            Parameter combination with the highest <em style={{ color: 'rgba(160,96,255,0.7)' }}>
              {METRICS.find(m => m.key === optMetric)?.label}
            </em> on the IS window is carried to OOS.
          </p>
        </div>
      </div>

      {/* ── Param grid preview ── */}
      <div style={{ ...cardStyle, marginBottom: 20, background: 'rgba(160,96,255,0.04)',
        border: '1px solid rgba(160,96,255,0.15)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <div>
            <span style={labelStyle}>Search Grid</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {strategy.params.map((p: { key: string; label: string }) => (
                <span key={p.key} style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  <span style={{ color: 'rgba(160,96,255,0.8)' }}>{p.label}</span>
                  {'  '}{paramGrid[p.key]?.join(', ')}
                </span>
              ))}
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <span style={labelStyle}>Combos per window</span>
            <span style={{ fontSize: 22, fontWeight: 300, color: 'rgba(160,96,255,0.9)',
              fontVariantNumeric: 'tabular-nums' }}>
              {totalCombos.toLocaleString()}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={labelStyle}>Est. windows</span>
            <span style={{ fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.5)',
              fontVariantNumeric: 'tabular-nums' }}>
              ~{estWindows}
            </span>
          </div>
        </div>
      </div>

      {/* ── Run button ── */}
      <button
        onClick={handleRunWFO}
        disabled={isWfoRunning}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 32px',
          background: isWfoRunning ? 'rgba(255,255,255,0.04)' : 'rgba(160,96,255,0.15)',
          border: `1px solid ${isWfoRunning ? 'rgba(255,255,255,0.1)' : 'rgba(160,96,255,0.4)'}`,
          borderRadius: 4, color: 'var(--fg-1)',
          fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase',
          cursor: isWfoRunning ? 'not-allowed' : 'pointer',
          marginBottom: 32,
          transition: 'all 0.2s',
        }}
      >
        {isWfoRunning && (
          <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: 'rgba(160,96,255,0.9)', borderRadius: '50%',
            animation: 'btSpin 0.7s linear infinite', display: 'inline-block' }} />
        )}
        {isWfoRunning ? wfStatusMsg || 'Running…' : 'Run Walk-Forward Optimization'}
      </button>

      {/* ── Error ── */}
      {wfStatus === 'error' && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)', borderRadius: 4,
          color: 'rgba(239,68,68,0.9)', fontSize: 13, marginBottom: 24 }}>
          {wfStatusMsg}
        </div>
      )}

      {/* ── Results ── */}
      {wfResult && (
        <div style={{ animation: 'btFadeIn 0.4s ease' }}>

          {/* KPI strip */}
          <WFOKPIs result={wfResult} />

          {/* Equity + mini charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24,
            alignItems: 'start', marginBottom: 24, flexWrap: 'wrap' as const }}>

            <div style={{ ...cardStyle, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <span style={labelStyle}>Stitched OOS Equity Curve</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                  Each segment = one out-of-sample window
                </span>
              </div>
              <OOSEquityChart curve={wfResult.equity_curve} initialCapital={initialCapital} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 280 }}>
              <div style={cardStyle}>
                <SharpeCorrChart windows={wfResult.windows} />
              </div>
              <div style={cardStyle}>
                <WindowReturnBars windows={wfResult.windows} />
              </div>
            </div>
          </div>

          {/* Window detail table header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ ...labelStyle, marginBottom: 0 }}>
              Per-Window Results ({wfResult.windows.length} windows)
            </span>
            <button onClick={exportCSV} style={{ ...chipStyle(false), display: 'flex', alignItems: 'center', gap: 6 }}>
              ↓ Export CSV
            </button>
          </div>

          <WindowTable windows={wfResult.windows} strategy={strategy} />

          {/* Consistency badge */}
          <div style={{ padding: '14px 20px', borderRadius: 6,
            background: wfResult.consistency >= 55
              ? 'rgba(160,96,255,0.07)'
              : 'rgba(239,68,68,0.06)',
            border: `1px solid ${wfResult.consistency >= 55
              ? 'rgba(160,96,255,0.2)'
              : 'rgba(239,68,68,0.2)'}`,
            fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 40 }}>
            <strong style={{ color: wfResult.consistency >= 55
              ? 'rgba(160,96,255,0.9)' : 'rgba(239,68,68,0.8)' }}>
              {wfResult.consistency}% consistency
            </strong>
            {'  '}{wfResult.consistency >= 55
              ? `— strategy was profitable in ${wfResult.windows.filter((w: WFWindow) => w.out_return > 0).length} of ${wfResult.windows.length} OOS windows.`
              : `— strategy was profitable in only ${wfResult.windows.filter((w: WFWindow) => w.out_return > 0).length} of ${wfResult.windows.length} OOS windows. Consider a different strategy or parameter range.`
            }
          </div>
        </div>
      )}
    </div>
  )
}