'use client'

import { useEffect, useCallback } from 'react'
import { useBacktestStore } from '@/store/backtestStore'
import { WalkForwardOptimizerTab } from './WalkForwardOptimizerTab'
import { EXCHANGES } from './constants/exchanges';
import { STRATEGIES } from './constants/strategies';
import type {
  BacktestResult,
  WFResult,
} from './types'
import { ensurePyodide, PYODIDE_BRIDGE, PYODIDE_BRIDGE_WFO } from './lib/pyodide';
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

  const strategy = STRATEGIES[strategyIdx]
  const variant  = strategy.variants[variantIdx]
  const exMeta   = EXCHANGES[exchange]

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
