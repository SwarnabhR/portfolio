'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useBacktestStore } from '@/store/backtestStore'
import { WalkForwardOptimizerTab } from './WalkForwardOptimizerTab'
import { EXCHANGES } from './constants/exchanges';
import { STRATEGIES } from './constants/strategies';
import type {
  BacktestResult,
  WFResult,
} from './types'
import { ensurePyodide, PYODIDE_BRIDGE, PYODIDE_BRIDGE_WFO } from './lib/pyodide';
import { fmt, pct } from './lib/format';
import { ConfigPanel } from './components/ConfigPanel';
import { MetricsGrid } from './components/MetricsGrid';
import { EquityChart } from './components/EquityChart';
import { TradeTable } from './components/TradeTable';

export default function BacktestingEnginePage() {
  // ── Zustand store ──
  const exchange        = useBacktestStore(s => s.exchange)
  const symbolInput     = useBacktestStore(s => s.symbolInput)
  const selectedSymbol  = useBacktestStore(s => s.selectedSymbol)
  const startDate       = useBacktestStore(s => s.startDate)
  const endDate         = useBacktestStore(s => s.endDate)
  const initialCapital  = useBacktestStore(s => s.initialCapital)
  const strategyIdx     = useBacktestStore(s => s.strategyIdx)
  const variantIdx      = useBacktestStore(s => s.variantIdx)
  const paramValues     = useBacktestStore(s => s.paramValues)
  const activeTab       = useBacktestStore(s => s.activeTab)
  const result          = useBacktestStore(s => s.btResult)
  const showTrades      = useBacktestStore(s => s.showTrades)
  const wfInSample      = useBacktestStore(s => s.wfInSample)
  const wfOutSample     = useBacktestStore(s => s.wfOutSample)
  const wfMode          = useBacktestStore(s => s.wfMode)
  const optMetric       = useBacktestStore(s => s.optMetric)

  const setBtResult    = useBacktestStore(s => s.setBtResult)
  const setBtStatus    = useBacktestStore(s => s.setBtStatus)
  const setBtStatusMsg = useBacktestStore(s => s.setBtStatusMsg)
  const setWfResult    = useBacktestStore(s => s.setWfResult)
  const setWfStatus    = useBacktestStore(s => s.setWfStatus)
  const setWfStatusMsg = useBacktestStore(s => s.setWfStatusMsg)
  const setActiveTab      = useBacktestStore(s => s.setActiveTab)
  const setParamValues    = useBacktestStore(s => s.setParamValues)

  // ── init param defaults once ──
  useEffect(() => {
    const d: Record<string, number> = {}
    STRATEGIES[0].params.forEach(p => { d[p.key] = p.default })
    setParamValues(d)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const canvasRef  = useRef<HTMLCanvasElement>(null)

  const strategy = STRATEGIES[strategyIdx]
  const variant  = strategy.variants[variantIdx]
  const exMeta   = EXCHANGES[exchange]

  // ── draw equity curve on canvas ──
  const drawChart = useCallback((curve: { date: string; value: number }[],
                                 benchmark: { date: string; value: number }[],
                                 initial: number) => {
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
      ctx.font = `${10 * devicePixelRatio / devicePixelRatio}px monospace`
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
    const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom)
    const isPositive = values[values.length - 1] >= initial
    if (isPositive) {
      grad.addColorStop(0,   'rgba(34,197,94,0.25)')
      grad.addColorStop(0.7, 'rgba(34,197,94,0.05)')
      grad.addColorStop(1,   'rgba(34,197,94,0)')
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

    // line
    ctx.beginPath()
    ctx.strokeStyle = isPositive ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)'
    ctx.lineWidth = 1.5
    curve.forEach((p, i) => {
      if (i === 0) ctx.moveTo(scaleX(i), scaleY(p.value))
      else         ctx.lineTo(scaleX(i), scaleY(p.value))
    })
    ctx.stroke()

    // benchmark (buy & hold)
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.setLineDash([3, 5])
    benchmark.forEach((p, i) => {
      const x = pad.left + (i / benchmark.length - 1) * (w - pad.left - pad.right)
      if (i == 0) ctx.moveTo(x, scaleY(p.value))
      else        ctx.lineTo(x, scaleY(p.value))
    })
    ctx.stroke()
    ctx.setLineDash([])

    // x-axis labels (sample ~5 dates)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.textAlign = 'center'
    const step = Math.floor(curve.length / 5)
    for (let i = 0; i < curve.length; i += step) {
      const x = scaleX(i)
      const label = curve[i].date.slice(0, 7) // YYYY-MM
      ctx.fillText(label, x, h - pad.bottom + 16)
    }
  }, [])

  useEffect(() => {
    if (result) drawChart(result.equity_curve, result.benchmark, initialCapital)
  }, [result, drawChart, initialCapital])

  // ── run ──
  const handleRun = useCallback(async () => {
    const sym = selectedSymbol || symbolInput.trim().toUpperCase()
    if (!sym) { setBtStatusMsg('Please select or enter a symbol.'); setBtStatus('error'); return }

    setBtStatus('fetching')
    setBtResult(null)
    setBtStatusMsg('Fetching market data...')

    try {
      // 1. Fetch OHLCV via Next.js API route
      const params = new URLSearchParams({ symbol: sym, exchange, start: startDate, end: endDate })
      const dataRes = await fetch(`/api/market-data?${params}`)
      const dataJson = await dataRes.json()
      if (!dataRes.ok) throw new Error(dataJson.error ?? 'Market data fetch failed')
      const { rows } = dataJson as { rows: object[] }
      if (rows.length < 50) throw new Error(`Only ${rows.length} data points — try a longer date range or a different symbol.`)

      // 2. Ensure Pyodide is ready
      setBtStatus('loading')
      const py = await ensurePyodide(setBtStatusMsg)

      // 3. Run backtest in Python
      setBtStatus('running')
      setBtStatusMsg('Running backtest...')

      py.globals.set('ohlcv_json',           JSON.stringify(rows))
      py.globals.set('strategy_class_name',  variant.cls)
      py.globals.set('strategy_params_json', JSON.stringify(paramValues))
      py.globals.set('initial_capital',      String(initialCapital))

      const raw: string = await py.runPythonAsync(PYODIDE_BRIDGE)
      const parsed = JSON.parse(raw) as BacktestResult

      setBtResult(parsed)
      setBtStatus('done')
      setBtStatusMsg('')
    } catch (err) {
      setBtStatus('error')
      setBtStatusMsg(err instanceof Error ? err.message : String(err))
    }
  }, [endDate, exchange, initialCapital, paramValues, selectedSymbol, startDate, symbolInput, variant.cls, setBtResult, setBtStatus, setBtStatusMsg])

  const handleRunWFO = useCallback(async () => {
    const sym = selectedSymbol || symbolInput.trim().toUpperCase()
    if (!sym) { setWfStatusMsg('Please select or enter a symbol.'); setWfStatus('error'); return }

    setWfStatus('fetching')
    setWfResult(null)
    setWfStatusMsg('Fetching market data...')

    try {
      const params = new URLSearchParams({ symbol: sym, exchange, start: startDate, end: endDate })
      const dataRes = await fetch(`/api/market-data?${params}`)
      const dataJson = await dataRes.json()
      if (!dataRes.ok) throw new Error(dataJson.error ?? 'Market data fetch failed')
      const { rows } = dataJson as { rows: object[] }
      if (rows.length < 100) throw new Error(`Only ${rows.length} data points — need more history for walk-forward.`)

      setWfStatus('loading')
      const py = await ensurePyodide(setWfStatusMsg)

      if (!py._wfoLoaded) {
        setWfStatusMsg('Loading optimizer module...')
        const resp = await fetch('/engine/optimizer.py')
        if (!resp.ok) throw new Error('Failed to load engine/optimizer.py')
        const code = await resp.text()
        await py.runPythonAsync(code)
        await py.runPythonAsync(`
import sys, types as _types
_mod = _types.ModuleType('optimizer')
_mod.__dict__.update({k: v for k, v in globals().items() if not k.startswith('__')})
sys.modules['optimizer'] = _mod
        `)
        py._wfoLoaded = true
      }

      setWfStatus('running')

      const paramGrid: Record<string, number[]> = {}
      STRATEGIES[strategyIdx].params.forEach(p => {
        const vals: number[] = []
        const stride = Math.max(p.step, Math.floor((p.max - p.min) / 6 / p.step) * p.step)
        for (let v = p.min; v <= p.max && vals.length < 7; v = Math.round((v + stride) * 1000) / 1000) {
          vals.push(v)
        }
        paramGrid[p.key] = vals
      })

      const totalCombos = Object.values(paramGrid).reduce((a, v) => a * v.length, 1)
      setWfStatusMsg(`Optimizing ${totalCombos} combos across windows...`)

      py.globals.set('ohlcv_json',          JSON.stringify(rows))
      py.globals.set('strategy_class_name', variant.cls)
      py.globals.set('param_grid_json',     JSON.stringify(paramGrid))
      py.globals.set('initial_capital',     String(initialCapital))
      py.globals.set('in_sample_days',      String(wfInSample))
      py.globals.set('out_sample_days',     String(wfOutSample))
      py.globals.set('wf_mode',             wfMode)
      py.globals.set('optimizer_metric',    optMetric)

      const raw: string = await py.runPythonAsync(PYODIDE_BRIDGE_WFO)
      setWfResult(JSON.parse(raw) as WFResult)
      setWfStatus('done')
      setWfStatusMsg('')
    } catch (err) {
      setWfStatus('error')
      setWfStatusMsg(err instanceof Error ? err.message : String(err))
    }
  }, [exchange, selectedSymbol, symbolInput, startDate, endDate,
    initialCapital, variant, strategyIdx, wfInSample, wfOutSample,
    wfMode, optMetric,
    setWfResult, setWfStatus, setWfStatusMsg])

  return (
    <main style={{ minHeight: '100dvh', background: 'var(--bg)', paddingTop: 80, paddingBottom: 80 }}>

      {/* ── Ambient ── */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 50% 40% at 70% 20%, rgba(60,0,100,0.25) 0%, transparent 70%)' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 10 }}>
            playground / backtesting_engine
          </span>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 300,
            letterSpacing: '-0.03em', color: 'var(--fg-1)', marginBottom: 10 }}>
            Backtesting Engine
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', maxWidth: 520, lineHeight: 1.65 }}>
            Select an exchange, choose a stock, configure a strategy, and run a full backtest — entirely in-browser via Pyodide.
          </p>
        </div>

        {/* ── Tab Switcher ── */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28,
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 6, padding: 4, width: 'fit-content' }}>
          {(['backtest', 'optimizer'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '7px 20px', borderRadius: 4, fontSize: 12,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              background: activeTab === tab ? 'rgba(160,96,255,0.15)' : 'transparent',
              border: `1px solid ${activeTab === tab ? 'rgba(160,96,255,0.4)' : 'transparent'}`,
              color: activeTab === tab ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {tab === 'backtest' ? 'Backtest' : 'Walk-Forward Optimizer'}
            </button>
          ))}
        </div>

        {activeTab === 'backtest' && (<>
          <ConfigPanel onRun={handleRun} />
          {/* ── Results ── */}
          {result && (
            <div style={{ animation: 'btFadeIn 0.4s ease' }}>
              <MetricsGrid metrics={result.metrics} />
              <EquityChart
              curve={result.equity_curve}
              benchmark={result.benchmark}
              initial={initialCapital}
              symbol={selectedSymbol || symbolInput}
              variantLabel={variant.label}
              totalReturnPct={result.metrics.total_return_pct}
              />
              <TradeTable
                trades={result.trades}
                currency={exMeta.currency}
                symbol={selectedSymbol || symbolInput}
                variantCls={variant.cls}
                startDate={startDate}
                endDate={endDate}
              />

              {showTrades && result.trades.length > 0 && (
                <div style={{ overflowX: 'auto', marginBottom: 40 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        {['Entry', 'Exit', 'Direction', 'P&L', 'P&L %'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left',
                            fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.trades.slice(0, 100).map((t, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '7px 12px', color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums' }}>{t.entry_date}</td>
                          <td style={{ padding: '7px 12px', color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums' }}>{t.exit_date}</td>
                          <td style={{ padding: '7px 12px', color: t.direction === 'long' ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)',
                            textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.08em' }}>{t.direction}</td>
                          <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                            color: t.pnl >= 0 ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)' }}>
                            {exMeta.currency}{fmt(Math.abs(t.pnl))}
                          </td>
                          <td style={{ padding: '7px 12px', fontVariantNumeric: 'tabular-nums',
                            color: t.pnl_pct >= 0 ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)' }}>
                            {pct(t.pnl_pct)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.trades.length > 100 && (
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8, textAlign: 'center' }}>
                      Showing first 100 of {result.trades.length} trades
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
      {activeTab === 'optimizer' && (
        <WalkForwardOptimizerTab
        STRATEGIES={STRATEGIES}
        handleRunWFO={handleRunWFO}
        />
      )}
      </div>

      <style>{`
        @keyframes btSpin   { to { transform: rotate(360deg) } }
        @keyframes btFadeIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.6); cursor: pointer; }
        input[type=range] { cursor: pointer; }
        select option { background: #1c1b19; }
        @media (max-width: 600px) {
          canvas { height: 200px !important; }
        }
      `}</style>
    </main>
  )
}
