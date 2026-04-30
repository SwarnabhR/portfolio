// app/playground/backtesting-engine/types.ts

// ─── Exchange ─────────────────────────────────────────────────────────────────

export type Exchange = 'NSE' | 'BSE' | 'NYSE' | 'NASDAQ' | 'LSE' | 'SSE'

export interface ExchangeMeta {
  label: string
  currency: string
  sampleStocks: { symbol: string; name: string }[]
}

// ─── Strategy ─────────────────────────────────────────────────────────────────

export interface StrategyParam {
  key: string
  label: string
  default: number
  min: number
  max: number
  step: number
}

export interface StrategyVariant {
  key: string
  label: string
  cls: string
}

export interface StrategyMeta {
  label: string
  cls: string
  variants: StrategyVariant[]
  params: StrategyParam[]
}

// ─── Backtest results ─────────────────────────────────────────────────────────

export interface Metrics {
  sharpe_ratio: number
  cagr: number
  max_drawdown_pct: number
  win_rate: number
  total_trades: number
  total_return_pct: number
}

export interface EquityPoint {
  date: string
  value: number
}

export interface BacktestTrade {
  entry_date: string
  exit_date: string
  direction: string
  pnl: number
  pnl_pct: number
}

export interface BacktestResult {
  metrics: Metrics
  equity_curve: EquityPoint[]
  benchmark: EquityPoint[]       // buy-and-hold curve for comparison
  trades: BacktestTrade[]
}

// ─── Walk-Forward Optimizer results ──────────────────────────────────────────

export interface WFWindow {
  window:       number
  in_start:     string
  in_end:       string
  out_start:    string
  out_end:      string
  best_params:  Record<string, number>
  in_sharpe:    number
  in_cagr:      number
  out_sharpe:   number
  out_cagr:     number
  out_return:   number
  out_trades:   number
  out_drawdown: number
}

export interface WFResult {
  windows:        WFWindow[]
  equity_curve:   EquityPoint[]
  avg_out_sharpe: number
  avg_out_cagr:   number
  avg_out_return: number
  total_trades:   number
  consistency:    number
}

// ─── UI state ─────────────────────────────────────────────────────────────────

export type RunStatus = 'idle' | 'fetching' | 'loading' | 'running' | 'done' | 'error'

export type ActiveTab = 'backtest' | 'optimizer'