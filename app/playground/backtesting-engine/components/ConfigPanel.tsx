// app/playground/backtesting-engine/components/ConfigPanel.tsx
'use client'

import React from 'react'
import { useBacktestStore } from '@/store/backtestStore'
import { EXCHANGES } from '../constants/exchanges'
import { STRATEGIES } from '../constants/strategies'
import type { Exchange, RunStatus } from '../types'

// ─── Local style helpers ──────────────────────────────────────────────────────

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

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 6,
  padding: 20,
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<RunStatus, string> = {
  idle:     'rgba(255,255,255,0.25)',
  fetching: 'rgba(160,96,255,0.8)',
  loading:  'rgba(160,96,255,0.8)',
  running:  'rgba(160,96,255,0.8)',
  done:     'rgba(34,197,94,0.8)',
  error:    'rgba(239,68,68,0.8)',
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ConfigPanelProps {
  onRun: () => void
}

export function ConfigPanel({ onRun }: ConfigPanelProps) {
  const exchange        = useBacktestStore(s => s.exchange)
  const symbolInput     = useBacktestStore(s => s.symbolInput)
  const selectedSymbol  = useBacktestStore(s => s.selectedSymbol)
  const startDate       = useBacktestStore(s => s.startDate)
  const endDate         = useBacktestStore(s => s.endDate)
  const initialCapital  = useBacktestStore(s => s.initialCapital)
  const strategyIdx     = useBacktestStore(s => s.strategyIdx)
  const variantIdx      = useBacktestStore(s => s.variantIdx)
  const paramValues     = useBacktestStore(s => s.paramValues)
  const status          = useBacktestStore(s => s.btStatus)
  const statusMsg       = useBacktestStore(s => s.btStatusMsg)

  const setExchange       = useBacktestStore(s => s.setExchange)
  const setSymbolInput    = useBacktestStore(s => s.setSymbolInput)
  const setSelectedSymbol = useBacktestStore(s => s.setSelectedSymbol)
  const setStartDate      = useBacktestStore(s => s.setStartDate)
  const setEndDate        = useBacktestStore(s => s.setEndDate)
  const setInitialCapital = useBacktestStore(s => s.setInitialCapital)
  const setStrategyIdx    = useBacktestStore(s => s.setStrategyIdx)
  const setVariantIdx     = useBacktestStore(s => s.setVariantIdx)
  const setParamValues    = useBacktestStore(s => s.setParamValues)

  const exMeta   = EXCHANGES[exchange]
  const strategy = STRATEGIES[strategyIdx]
  const isRunning = ['fetching', 'loading', 'running'].includes(status)

  return (
    <>
      {/* ── 4-card config grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>

        {/* Exchange */}
        <div style={card}>
          <label style={labelStyle}>Exchange</label>
          <select
            value={exchange}
            onChange={e => {
              setExchange(e.target.value as Exchange)
              setSelectedSymbol('')
              setSymbolInput('')
            }}
            style={{ ...inputStyle, appearance: 'none' }}
          >
            {(Object.keys(EXCHANGES) as Exchange[]).map(ex => (
              <option key={ex} value={ex} style={{ background: '#1a1a1a' }}>
                {ex} — {EXCHANGES[ex].label.split('—')[1]?.trim() ?? ex}
              </option>
            ))}
          </select>
        </div>

        {/* Symbol */}
        <div style={card}>
          <label style={labelStyle}>Symbol</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
            {exMeta.sampleStocks.map(s => (
              <button
                key={s.symbol}
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
        <div style={card}>
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
        <div style={card}>
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
      <div style={{ ...card, marginBottom: 24 }}>
        <label style={labelStyle}>Strategy</label>

        {/* Family chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {STRATEGIES.map((s, i) => (
            <button key={s.cls} onClick={() => {
              setStrategyIdx(i)
              setVariantIdx(0)
              const d: Record<string, number> = {}
              STRATEGIES[i].params.forEach(p => { d[p.key] = p.default })
              setParamValues(d)
            }} style={chipStyle(strategyIdx === i)}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Variant chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {strategy.variants.map((v, i) => (
            <button key={v.key} onClick={() => setVariantIdx(i)} style={chipStyle(variantIdx === i)}>
              {v.label}
            </button>
          ))}
        </div>

        {/* Param sliders */}
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
                onChange={e => setParamValues({ ...paramValues, [p.key]: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'rgba(160,96,255,0.8)' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Run button ── */}
      <button
        onClick={onRun}
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
        }}
      >
        {isRunning && (
          <span style={{
            width: 14, height: 14, borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.15)',
            borderTopColor: 'rgba(160,96,255,0.8)',
            animation: 'spin 0.7s linear infinite',
            display: 'inline-block',
          }} />
        )}
        {isRunning ? 'Running…' : 'Run Backtest'}
      </button>

      {/* ── Status message ── */}
      {statusMsg && (
        <p style={{
          fontSize: 12, marginBottom: 24,
          color: STATUS_COLOR[status] ?? 'rgba(255,255,255,0.4)',
          letterSpacing: '0.04em',
        }}>
          {statusMsg}
        </p>
      )}
    </>
  )
}