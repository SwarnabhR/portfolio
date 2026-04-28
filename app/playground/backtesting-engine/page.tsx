'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Exchange = 'NSE' | 'BSE' | 'NYSE' | 'NASDAQ' | 'LSE' | 'SSE'

interface ExchangeMeta {
  label: string
  currency: string
  sampleStocks: { symbol: string; name: string }[]
}

const EXCHANGES: Record<Exchange, ExchangeMeta> = {
  NSE: {
    label: 'NSE — National Stock Exchange of India',
    currency: '₹',
    sampleStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries' },
      { symbol: 'TCS',      name: 'Tata Consultancy Services' },
      { symbol: 'INFY',     name: 'Infosys' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank' },
      { symbol: 'ICICIBANK',name: 'ICICI Bank' },
      { symbol: 'SBIN',     name: 'State Bank of India' },
      { symbol: 'WIPRO',    name: 'Wipro' },
      { symbol: 'AXISBANK', name: 'Axis Bank' },
      { symbol: '^NSEI',    name: 'Nifty 50 Index' },
      { symbol: '^BSESN',   name: 'Sensex' },
    ],
  },
  BSE: {
    label: 'BSE — Bombay Stock Exchange',
    currency: '₹',
    sampleStocks: [
      { symbol: 'RELIANCE', name: 'Reliance Industries' },
      { symbol: 'TCS',      name: 'Tata Consultancy Services' },
      { symbol: 'HDFCBANK', name: 'HDFC Bank' },
      { symbol: 'INFY',     name: 'Infosys' },
      { symbol: 'BAJFINANCE', name: 'Bajaj Finance' },
    ],
  },
  NYSE: {
    label: 'NYSE — New York Stock Exchange',
    currency: '$',
    sampleStocks: [
      { symbol: 'BRK-B', name: 'Berkshire Hathaway B' },
      { symbol: 'JPM',   name: 'JPMorgan Chase' },
      { symbol: 'BAC',   name: 'Bank of America' },
      { symbol: 'WMT',   name: 'Walmart' },
      { symbol: 'XOM',   name: 'ExxonMobil' },
      { symbol: 'KO',    name: 'Coca-Cola' },
      { symbol: 'DIS',   name: 'Walt Disney' },
      { symbol: 'GE',    name: 'General Electric' },
    ],
  },
  NASDAQ: {
    label: 'NASDAQ',
    currency: '$',
    sampleStocks: [
      { symbol: 'AAPL',  name: 'Apple' },
      { symbol: 'MSFT',  name: 'Microsoft' },
      { symbol: 'GOOGL', name: 'Alphabet' },
      { symbol: 'AMZN',  name: 'Amazon' },
      { symbol: 'NVDA',  name: 'NVIDIA' },
      { symbol: 'META',  name: 'Meta Platforms' },
      { symbol: 'TSLA',  name: 'Tesla' },
      { symbol: 'AMD',   name: 'AMD' },
      { symbol: '^IXIC', name: 'NASDAQ Composite' },
    ],
  },
  LSE: {
    label: 'LSE — London Stock Exchange',
    currency: '£',
    sampleStocks: [
      { symbol: 'SHEL',  name: 'Shell' },
      { symbol: 'AZN',   name: 'AstraZeneca' },
      { symbol: 'HSBA',  name: 'HSBC Holdings' },
      { symbol: 'BP',    name: 'BP' },
      { symbol: 'ULVR',  name: 'Unilever' },
      { symbol: '^FTSE', name: 'FTSE 100' },
    ],
  },
  SSE: {
    label: 'SSE — Shanghai Stock Exchange',
    currency: '¥',
    sampleStocks: [
      { symbol: '600519', name: 'Kweichow Moutai' },
      { symbol: '601318', name: 'Ping An Insurance' },
      { symbol: '600036', name: 'China Merchants Bank' },
      { symbol: '600900', name: 'Yangtze Power' },
      { symbol: '^SSEC',  name: 'Shanghai Composite' },
    ],
  },
}

interface StrategyParam {
  key: string
  label: string
  default: number
  min: number
  max: number
  step: number
}

interface StrategyMeta {
  label: string
  cls: string           // Python class name
  variants: { key: string; label: string; cls: string }[]
  params: StrategyParam[]
}

const STRATEGIES: StrategyMeta[] = [
  {
    label: 'EMA Crossover',
    cls:   'EMACrossover',
    variants: [
      { key: 'long',   label: 'Long Only', cls: 'EMACrossover' },
      { key: 'ls',     label: 'Long / Short', cls: 'EMACrossoverLS' },
      { key: 'regime', label: 'Regime Filter', cls: 'EMACrossoverRegime' },
    ],
    params: [
      { key: 'fast', label: 'Fast EMA', default: 12, min: 2,  max: 50,  step: 1 },
      { key: 'slow', label: 'Slow EMA', default: 26, min: 10, max: 200, step: 1 },
    ],
  },
  {
    label: 'RSI Mean Reversion',
    cls:   'RSIMeanReversion',
    variants: [
      { key: 'long',   label: 'Long Only', cls: 'RSIMeanReversion' },
      { key: 'ls',     label: 'Long / Short', cls: 'RSIMeanReversionLS' },
      { key: 'regime', label: 'Regime Filter', cls: 'RSIMeanReversionRegime' },
    ],
    params: [
      { key: 'period',     label: 'Period',     default: 14, min: 2,  max: 50, step: 1  },
      { key: 'oversold',   label: 'Oversold',   default: 30, min: 10, max: 45, step: 1  },
      { key: 'overbought', label: 'Overbought', default: 70, min: 55, max: 90, step: 1  },
    ],
  },
  {
    label: 'Bollinger Breakout',
    cls:   'BollingerBreakout',
    variants: [
      { key: 'long',   label: 'Long Only', cls: 'BollingerBreakout' },
      { key: 'ls',     label: 'Long / Short', cls: 'BollingerBreakoutLS' },
      { key: 'regime', label: 'Regime Filter', cls: 'BollingerBreakoutRegime' },
    ],
    params: [
      { key: 'period',  label: 'Period',   default: 20, min: 5,   max: 60,  step: 1   },
      { key: 'std_dev', label: 'Std Dev',  default: 2,  min: 0.5, max: 4.0, step: 0.5 },
    ],
  },
  {
    label: 'MACD Crossover',
    cls:   'MACDCrossover',
    variants: [
      { key: 'long',   label: 'Long Only', cls: 'MACDCrossover' },
      { key: 'ls',     label: 'Long / Short', cls: 'MACDCrossoverLS' },
      { key: 'regime', label: 'Regime Filter', cls: 'MACDCrossoverRegime' },
    ],
    params: [
      { key: 'fast',   label: 'Fast',   default: 12, min: 2,  max: 50,  step: 1 },
      { key: 'slow',   label: 'Slow',   default: 26, min: 10, max: 100, step: 1 },
      { key: 'signal', label: 'Signal', default: 9,  min: 2,  max: 30,  step: 1 },
    ],
  },
  {
    label: 'Supertrend',
    cls:   'SupertrendStrategy',
    variants: [
      { key: 'long',   label: 'Long Only', cls: 'SupertrendStrategy' },
      { key: 'ls',     label: 'Long / Short', cls: 'SupertrendLS' },
      { key: 'regime', label: 'Regime Filter', cls: 'SupertrendRegime' },
    ],
    params: [
      { key: 'period',     label: 'Period',     default: 10,  min: 3,   max: 50,  step: 1   },
      { key: 'multiplier', label: 'Multiplier', default: 3.0, min: 0.5, max: 6.0, step: 0.5 },
    ],
  },
  {
    label: 'Ichimoku',
    cls:   'IchimokuStrategy',
    variants: [
      { key: 'long',   label: 'Long Only', cls: 'IchimokuStrategy' },
      { key: 'ls',     label: 'Long / Short', cls: 'IchimokuLS' },
      { key: 'regime', label: 'Regime Filter', cls: 'IchimokuRegime' },
    ],
    params: [
      { key: 'tenkan',   label: 'Tenkan',   default: 9,  min: 3,  max: 30, step: 1 },
      { key: 'kijun',    label: 'Kijun',    default: 26, min: 10, max: 60, step: 1 },
      { key: 'senkou_b', label: 'Senkou B', default: 52, min: 20, max: 120, step: 1 },
    ],
  },
  {
    label: 'Williams %R',
    cls:   'WilliamsRStrategy',
    variants: [
      { key: 'long',   label: 'Long Only', cls: 'WilliamsRStrategy' },
      { key: 'ls',     label: 'Long / Short', cls: 'WilliamsRLS' },
      { key: 'regime', label: 'Regime Filter', cls: 'WilliamsRRegime' },
    ],
    params: [
      { key: 'period',     label: 'Period',     default: 14,  min: 2,   max: 50,  step: 1 },
      { key: 'oversold',   label: 'Oversold',   default: -80, min: -95, max: -55, step: 5 },
      { key: 'overbought', label: 'Overbought', default: -20, min: -45, max: -5,  step: 5 },
    ],
  },
  {
    label: 'Donchian Breakout',
    cls:   'DonchianBreakout',
    variants: [
      { key: 'long',   label: 'Long Only', cls: 'DonchianBreakout' },
      { key: 'ls',     label: 'Long / Short', cls: 'DonchianBreakoutLS' },
      { key: 'regime', label: 'Regime Filter', cls: 'DonchianBreakoutRegime' },
    ],
    params: [
      { key: 'period', label: 'Period', default: 20, min: 5, max: 100, step: 1 },
    ],
  },
  {
    label: 'Parabolic SAR',
    cls:   'PSARStrategy',
    variants: [
      { key: 'long',   label: 'Long Only', cls: 'PSARStrategy' },
      { key: 'ls',     label: 'Long / Short', cls: 'PSARLS' },
      { key: 'regime', label: 'Regime Filter', cls: 'PSARRegime' },
    ],
    params: [
      { key: 'initial_af', label: 'Initial AF', default: 0.02, min: 0.01, max: 0.1,  step: 0.01 },
      { key: 'max_af',     label: 'Max AF',     default: 0.20, min: 0.1,  max: 0.5,  step: 0.05 },
      { key: 'step_af',    label: 'Step AF',    default: 0.02, min: 0.01, max: 0.05, step: 0.01 },
    ],
  },
]

interface Metrics {
  sharpe_ratio: number
  cagr: number
  max_drawdown_pct: number
  win_rate: number
  total_trades: number
  total_return_pct: number
}

interface BacktestResult {
  metrics: Metrics
  equity_curve: { date: string; value: number }[]
  trades: { entry_date: string; exit_date: string; direction: string; pnl: number; pnl_pct: number }[]
}

// ─── Pyodide bridge code (runs in-browser) ────────────────────────────────────
// We fetch each engine .py from /engine/ (static assets) and exec them in order
const PYODIDE_BRIDGE = `
import json, sys, io

# ── inject OHLCV rows as a DataFrame ──────────────────────────────────────────
rows = json.loads(ohlcv_json)         # passed from JS as a global pyodide variable
import pandas as pd
df = pd.DataFrame(rows)
df['date'] = pd.to_datetime(df['date'])
df = df.set_index('date').sort_index()
df.columns = [c.lower() for c in df.columns]

# ── run backtest ───────────────────────────────────────────────────────────────
from backtest import Backtest
from strategy import (
    EMACrossover, EMACrossoverLS, EMACrossoverRegime,
    RSIMeanReversion, RSIMeanReversionLS, RSIMeanReversionRegime,
    BollingerBreakout, BollingerBreakoutLS, BollingerBreakoutRegime,
    MACDCrossover, MACDCrossoverLS, MACDCrossoverRegime,
    SupertrendStrategy, SupertrendLS, SupertrendRegime,
    IchimokuStrategy, IchimokuLS, IchimokuRegime,
    WilliamsRStrategy, WilliamsRLS, WilliamsRRegime,
    DonchianBreakout, DonchianBreakoutLS, DonchianBreakoutRegime,
    PSARStrategy, PSARLS, PSARRegime,
)

strategy_cls = eval(strategy_class_name)  # passed from JS
params_dict  = json.loads(strategy_params_json)
strategy     = strategy_cls(**params_dict)

bt = Backtest(initial=float(initial_capital))
trades_df, equity_curve, metrics = bt.run(df, strategy)

# ── serialise results ──────────────────────────────────────────────────────────
equity_list = [
    {'date': str(d.date()), 'value': round(float(v), 2)}
    for d, v in equity_curve.items()
]

trades_list = []
for _, row in trades_df.iterrows():
    trades_list.append({
        'entry_date': str(row['entry_date'].date()) if hasattr(row['entry_date'], 'date') else str(row['entry_date']),
        'exit_date':  str(row['exit_date'].date())  if hasattr(row['exit_date'],  'date') else str(row['exit_date']),
        'direction':  row['direction'],
        'pnl':        round(float(row['pnl']), 2),
        'pnl_pct':    round(float(row['pnl_pct']) * 100, 2),
    })

result = json.dumps({
    'metrics': {
        'sharpe_ratio':     round(float(metrics.sharpe_ratio),     3),
        'cagr':             round(float(metrics.cagr) * 100,        2),
        'max_drawdown_pct': round(float(metrics.max_drawdown_pct), 2),
        'win_rate':         round(float(metrics.win_rate) * 100,    2),
        'total_trades':     int(metrics.total_trades),
        'total_return_pct': round(float(metrics.total_return_pct), 2),
    },
    'equity_curve': equity_list,
    'trades': trades_list,
})
result
`

// ─── Component ────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<unknown>
    _pyodide?: unknown
  }
}

export default function BacktestingEnginePage() {
  // ── state ──
  const [exchange,        setExchange]        = useState<Exchange>('NSE')
  const [symbolInput,     setSymbolInput]     = useState('')
  const [selectedSymbol,  setSelectedSymbol]  = useState('')
  const [strategyIdx,     setStrategyIdx]     = useState(0)
  const [variantIdx,      setVariantIdx]      = useState(0)
  const [paramValues,     setParamValues]     = useState<Record<string, number>>({})
  const [startDate,       setStartDate]       = useState('2021-01-01')
  const [endDate,         setEndDate]         = useState(new Date().toISOString().slice(0, 10))
  const [initialCapital,  setInitialCapital]  = useState(100000)
  const [status,          setStatus]          = useState<'idle'|'fetching'|'loading'|'running'|'done'|'error'>('idle')
  const [statusMsg,       setStatusMsg]       = useState('')
  const [result,          setResult]          = useState<BacktestResult | null>(null)
  const [showTrades,      setShowTrades]      = useState(false)

  const pyodideRef = useRef<unknown>(null)
  const canvasRef  = useRef<HTMLCanvasElement>(null)

  const strategy = STRATEGIES[strategyIdx]
  const variant  = strategy.variants[variantIdx]
  const exMeta   = EXCHANGES[exchange]

  // ── sync param defaults when strategy changes ──
  useEffect(() => {
    const defaults: Record<string, number> = {}
    STRATEGIES[strategyIdx].params.forEach(p => { defaults[p.key] = p.default })
    setParamValues(defaults)
    setVariantIdx(0)
  }, [strategyIdx])

  // ── load Pyodide once ──
  const ensurePyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js'
        s.onload  = () => resolve()
        s.onerror = () => reject(new Error('Failed to load Pyodide CDN'))
        document.head.appendChild(s)
      })
    }
    setStatusMsg('Loading Python runtime...')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const py = await (window.loadPyodide as any)({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/' })
    setStatusMsg('Installing packages (pandas, numpy)...')
    await py.loadPackage(['pandas', 'numpy'])
    // Load engine source files from /engine/ static directory
    setStatusMsg('Loading engine modules...')
    const engineFiles = ['risk.py', 'costs.py', 'sizer.py', 'indicators.py', 'strategy.py', 'backtest.py']
    for (const file of engineFiles) {
      const resp = await fetch(`/engine/${file}`)
      if (!resp.ok) throw new Error(`Failed to load engine/${file}`)
      const code = await resp.text()
      await py.runPythonAsync(code)
    }
    pyodideRef.current = py
    return py
  }, [])

  // ── draw equity curve on canvas ──
  const drawChart = useCallback((curve: { date: string; value: number }[], initial: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width  = canvas.offsetWidth  * devicePixelRatio
    const H = canvas.height = canvas.offsetHeight * devicePixelRatio
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
    if (result) drawChart(result.equity_curve, initialCapital)
  }, [result, drawChart, initialCapital])

  // ── run ──
  const handleRun = useCallback(async () => {
    const sym = selectedSymbol || symbolInput.trim().toUpperCase()
    if (!sym) { setStatusMsg('Please select or enter a symbol.'); setStatus('error'); return }

    setStatus('fetching')
    setResult(null)
    setStatusMsg('Fetching market data...')

    try {
      // 1. Fetch OHLCV via Next.js API route
      const params = new URLSearchParams({ symbol: sym, exchange, start: startDate, end: endDate })
      const dataRes = await fetch(`/api/market-data?${params}`)
      const dataJson = await dataRes.json()
      if (!dataRes.ok) throw new Error(dataJson.error ?? 'Market data fetch failed')
      const { rows } = dataJson as { rows: object[] }
      if (rows.length < 50) throw new Error(`Only ${rows.length} data points — try a longer date range or a different symbol.`)

      // 2. Ensure Pyodide is ready
      setStatus('loading')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const py = await ensurePyodide() as any

      // 3. Run backtest in Python
      setStatus('running')
      setStatusMsg('Running backtest...')

      py.globals.set('ohlcv_json',           JSON.stringify(rows))
      py.globals.set('strategy_class_name',  variant.cls)
      py.globals.set('strategy_params_json', JSON.stringify(paramValues))
      py.globals.set('initial_capital',      String(initialCapital))

      const raw: string = await py.runPythonAsync(PYODIDE_BRIDGE)
      const parsed = JSON.parse(raw) as BacktestResult

      setResult(parsed)
      setStatus('done')
      setStatusMsg('')
    } catch (err) {
      setStatus('error')
      setStatusMsg(err instanceof Error ? err.message : String(err))
    }
  }, [exchange, selectedSymbol, symbolInput, startDate, endDate, initialCapital, variant, paramValues, ensurePyodide])

  // ── helpers ──
  const fmt = (n: number, dec = 2) => n.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec })
  const pct  = (n: number) => `${n >= 0 ? '+' : ''}${fmt(n)}%`
  const isRunning = ['fetching','loading','running'].includes(status)

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 4,
    color: 'var(--fg-1)',
    padding: '8px 12px',
    fontSize: 13,
    outline: 'none',
    width: '100%',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    display: 'block',
    marginBottom: 6,
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
    whiteSpace: 'nowrap',
  })

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

        {/* ── Config panel ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>

          {/* Exchange */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: 20 }}>
            <label style={labelStyle}>Exchange</label>
            <select
              value={exchange}
              onChange={e => { setExchange(e.target.value as Exchange); setSelectedSymbol(''); setSymbolInput('') }}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              {(Object.keys(EXCHANGES) as Exchange[]).map(ex => (
                <option key={ex} value={ex} style={{ background: '#1a1a1a' }}>{ex} — {EXCHANGES[ex].label.split('—')[1]?.trim() ?? ex}</option>
              ))}
            </select>
          </div>

          {/* Symbol */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: 20 }}>
            <label style={labelStyle}>Symbol</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              {exMeta.sampleStocks.map(s => (
                <button key={s.symbol}
                  onClick={() => { setSelectedSymbol(s.symbol); setSymbolInput(s.symbol) }}
                  style={chipStyle(selectedSymbol === s.symbol)}
                  title={s.name}
                >
                  {s.symbol}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="or type custom ticker…"
              value={symbolInput}
              onChange={e => { setSymbolInput(e.target.value.toUpperCase()); setSelectedSymbol('') }}
              style={inputStyle}
            />
          </div>

          {/* Date range */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: 20 }}>
            <label style={labelStyle}>Date Range</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <span style={{ ...labelStyle, marginBottom: 4 }}>Start</span>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ ...labelStyle, marginBottom: 4 }}>End</span>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Initial capital */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: 20 }}>
            <label style={labelStyle}>Initial Capital ({exMeta.currency})</label>
            <input
              type="number" min={1000} step={1000}
              value={initialCapital}
              onChange={e => setInitialCapital(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
        </div>

        {/* ── Strategy ── */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: 20, marginBottom: 24 }}>
          <label style={labelStyle}>Strategy</label>

          {/* Strategy family */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {STRATEGIES.map((s, i) => (
              <button key={s.cls} onClick={() => setStrategyIdx(i)} style={chipStyle(strategyIdx === i)}>
                {s.label}
              </button>
            ))}
          </div>

          {/* Variant */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            {strategy.variants.map((v, i) => (
              <button key={v.key} onClick={() => setVariantIdx(i)} style={chipStyle(variantIdx === i)}>
                {v.label}
              </button>
            ))}
          </div>

          {/* Params */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {strategy.params.map(p => (
              <div key={p.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>{p.label}</label>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontVariantNumeric: 'tabular-nums' }}>
                    {paramValues[p.key] ?? p.default}
                  </span>
                </div>
                <input
                  type="range" min={p.min} max={p.max} step={p.step}
                  value={paramValues[p.key] ?? p.default}
                  onChange={e => setParamValues(prev => ({ ...prev, [p.key]: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'rgba(160,96,255,0.8)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Run button ── */}
        <button
          onClick={handleRun}
          disabled={isRunning}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 32px',
            background: isRunning ? 'rgba(255,255,255,0.04)' : 'rgba(160,96,255,0.15)',
            border: `1px solid ${isRunning ? 'rgba(255,255,255,0.1)' : 'rgba(160,96,255,0.4)'}`,
            borderRadius: 4, color: 'var(--fg-1)',
            fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            marginBottom: 32,
            transition: 'all 0.2s',
          }}
        >
          {isRunning && (
            <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'rgba(160,96,255,0.9)', borderRadius: '50%',
              animation: 'btSpin 0.7s linear infinite', display: 'inline-block' }} />
          )}
          {isRunning ? statusMsg : 'Run Backtest'}
        </button>

        {/* ── Error ── */}
        {status === 'error' && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)', borderRadius: 4,
            color: 'rgba(239,68,68,0.9)', fontSize: 13, marginBottom: 24 }}>
            {statusMsg}
          </div>
        )}

        {/* ── Results ── */}
        {result && (
          <div style={{ animation: 'btFadeIn 0.4s ease' }}>

            {/* Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'Total Return',  value: pct(result.metrics.total_return_pct),  hi: result.metrics.total_return_pct >= 0 },
                { label: 'CAGR',          value: pct(result.metrics.cagr),               hi: result.metrics.cagr >= 0 },
                { label: 'Sharpe Ratio',  value: fmt(result.metrics.sharpe_ratio, 3),    hi: result.metrics.sharpe_ratio >= 1 },
                { label: 'Max Drawdown',  value: `${fmt(result.metrics.max_drawdown_pct)}%`, hi: false },
                { label: 'Win Rate',      value: `${fmt(result.metrics.win_rate)}%`,     hi: result.metrics.win_rate >= 50 },
                { label: 'Total Trades',  value: String(result.metrics.total_trades),   hi: true },
              ].map(m => (
                <div key={m.label} style={{ padding: '16px 18px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 4 }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 8 }}>{m.label}</span>
                  <span style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 300, fontVariantNumeric: 'tabular-nums',
                    color: m.label === 'Max Drawdown' ? 'rgba(239,68,68,0.9)'
                         : m.hi ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.85)' }}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Equity curve */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 6, padding: 20, marginBottom: 24 }}>
              <span style={{ ...labelStyle, marginBottom: 16 }}>Equity Curve — {selectedSymbol || symbolInput} · {variant.label}</span>
              <canvas ref={canvasRef} style={{ width: '100%', height: 260, display: 'block' }} />
            </div>

            {/* Trades table toggle */}
            <button
              onClick={() => setShowTrades(p => !p)}
              style={{ ...chipStyle(showTrades), marginBottom: 16 }}
            >
              {showTrades ? 'Hide' : 'Show'} Trade Log ({result.trades.length})
            </button>

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
