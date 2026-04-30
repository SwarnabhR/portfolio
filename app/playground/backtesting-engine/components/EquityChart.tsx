// app/playground/backtesting-engine/components/EquityChart.tsx
'use client'

import { useRef, useEffect, useCallback } from 'react'
import type { EquityPoint } from '../types'
import { pct } from '../lib/format'

interface EquityChartProps {
  curve:           EquityPoint[]
  benchmark?:      EquityPoint[]      // optional — omit for WFO
  initial:         number
  symbol?:         string             // optional
  variantLabel?:   string             // optional
  totalReturnPct?: number             // optional
  accentColor?:    'green' | 'purple' // default: 'green'
}

export function EquityChart({
  curve, benchmark, initial, symbol, variantLabel, totalReturnPct, accentColor
}: EquityChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
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

    // baseline (initial capital)
    const baseY = scaleY(initial)
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'
    ctx.setLineDash([4, 4])
    ctx.beginPath(); ctx.moveTo(pad.left, baseY); ctx.lineTo(w - pad.right, baseY); ctx.stroke()
    ctx.setLineDash([])

    // fill gradient
    const isPositive = values[values.length - 1] >= initial
    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom)
    const positiveColor = accentColor === 'purple' ? '160,96,255' : '34,197,94'
    if (isPositive) {
      grad.addColorStop(0,   `rgba(${positiveColor}, 0.25)`)
      grad.addColorStop(0.7, `rgba(${positiveColor},0.05)`)
      grad.addColorStop(1,   `rgba(${positiveColor},0)`)
    } else {
      grad.addColorStop(0,   'rgba(239,68,68,0.25)')
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

    // strategy line
    ctx.beginPath()
    ctx.strokeStyle = isPositive ? `rgba(${positiveColor},0.9)` : 'rgba(239,68,68,0.9)'
    ctx.lineWidth = 1.5
    curve.forEach((p, i) => {
      if (i === 0) ctx.moveTo(scaleX(i), scaleY(p.value))
      else         ctx.lineTo(scaleX(i), scaleY(p.value))
    })
    ctx.stroke()

    // benchmark (buy & hold)
    if (benchmark && benchmark.length > 1) {
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.lineWidth = 1
      ctx.setLineDash([3, 5])
      benchmark.forEach((p, i) => {
        const x = pad.left + (i / (benchmark.length - 1)) * (w - pad.left - pad.right)
        if (i == 0) ctx.moveTo(x, scaleY(p.value))
        else ctx.lineTo(x, scaleY(p.value))
      })
      ctx.stroke()
      ctx.setLineDash([])
    }


    // x-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.textAlign = 'center'
    const step = Math.floor(curve.length / 5)
    for (let i = 0; i < curve.length; i += step) {
      ctx.fillText(curve[i].date.slice(0, 7), scaleX(i), h - pad.bottom + 16)
    }
  }, [curve, benchmark, initial, accentColor])

  useEffect(() => { drawChart() }, [drawChart])

  const isPositive = (totalReturnPct ?? 0) >= 0
  const benchmarkReturn = benchmark && benchmark.length > 0
    ? pct(((benchmark[benchmark.length - 1].value / initial) - 1) * 100)
    : '—'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 6, padding: 20, marginBottom: 24,
    }}>
      {/* Legend row */}
      {symbol && variantLabel && totalReturnPct !== undefined && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)' }}>
            Equity Curve — {symbol} · {variantLabel}
          </span>
          <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ width: 20, height: 2, flexShrink: 0, display: 'inline-block',
                background: isPositive
                  ? `rgba(${accentColor === 'purple' ? '160,96,255' : '34,197,94'},0.8)`
                  : 'rgba(239,68,68,0.8)' }} />
              Strategy {pct(totalReturnPct)}
            </span>
            {benchmark && benchmark.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6,
                color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                <span style={{ width: 20, height: 1, display: 'inline-block',
                  borderTop: '1px dashed rgba(255,255,255,0.25)' }} />
                Buy &amp; Hold {benchmarkReturn}
              </span>
            )}
          </div>
        </div>
)}

      <canvas ref={canvasRef} style={{ width: '100%', height: 260, display: 'block' }} />
    </div>
  )
}