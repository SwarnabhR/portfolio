import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// ─── Types ────────────────────────────────────────────────────────────────────

type Exchange = 'NSE' | 'BSE' | 'NYSE' | 'NASDAQ' | 'LSE' | 'SSE'
type Tab      = 'backtest' | 'optimizer'
type WFMode   = 'anchored' | 'rolling'
type OptMetric = 'sharpe_ratio' | 'total_return_pct' | 'cagr'
type RunStatus = 'idle' | 'fetching' | 'loading' | 'running' | 'done' | 'error'

interface Metrics {
  sharpe_ratio:     number
  cagr:             number
  max_drawdown_pct: number
  win_rate:         number
  total_trades:     number
  total_return_pct: number
}

interface BacktestResult {
  metrics:      Metrics
  equity_curve: { date: string; value: number }[]
  benchmark:    { date: string; value: number }[]
  trades:       { entry_date: string; exit_date: string; direction: string; pnl: number; pnl_pct: number }[]
}

interface WFWindow {
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

interface WFResult {
  windows:        WFWindow[]
  equity_curve:   { date: string; value: number }[]
  avg_out_sharpe: number
  avg_out_cagr:   number
  avg_out_return: number
  total_trades:   number
  consistency:    number
}

// ─── Slices ───────────────────────────────────────────────────────────────────

interface SharedSlice {
  // Shared inputs (both tabs use these)
  exchange:       Exchange
  symbolInput:    string
  selectedSymbol: string
  startDate:      string
  endDate:        string
  initialCapital: number
  strategyIdx:    number
  variantIdx:     number
  paramValues:    Record<string, number>
  activeTab:      Tab

  setExchange:       (v: Exchange) => void
  setSymbolInput:    (v: string) => void
  setSelectedSymbol: (v: string) => void
  setStartDate:      (v: string) => void
  setEndDate:        (v: string) => void
  setInitialCapital: (v: number) => void
  setStrategyIdx:    (v: number) => void
  setVariantIdx:     (v: number) => void
  setParamValues:    (v: Record<string, number>) => void
  setActiveTab:      (v: Tab) => void
}

interface BacktestSlice {
  btStatus:    RunStatus
  btStatusMsg: string
  btResult:    BacktestResult | null
  showTrades:  boolean

  setBtStatus:    (v: RunStatus) => void
  setBtStatusMsg: (v: string) => void
  setBtResult:    (v: BacktestResult | null) => void
  setShowTrades:  (v: boolean) => void
}

interface OptimizerSlice {
  wfInSample:  number
  wfOutSample: number
  wfMode:      WFMode
  optMetric:   OptMetric
  wfStatus:    RunStatus
  wfStatusMsg: string
  wfResult:    WFResult | null

  setWfInSample:  (v: number) => void
  setWfOutSample: (v: number) => void
  setWfMode:      (v: WFMode) => void
  setOptMetric:   (v: OptMetric) => void
  setWfStatus:    (v: RunStatus) => void
  setWfStatusMsg: (v: string) => void
  setWfResult:    (v: WFResult | null) => void
}

type StoreState = SharedSlice & BacktestSlice & OptimizerSlice

// ─── Store ────────────────────────────────────────────────────────────────────

export const useBacktestStore = create<StoreState>()(
  subscribeWithSelector((set) => ({

    // ── Shared ──
    exchange:       'NSE',
    symbolInput:    '',
    selectedSymbol: '',
    startDate:      '2021-01-01',
    endDate:        new Date().toISOString().slice(0, 10),
    initialCapital: 100000,
    strategyIdx:    0,
    variantIdx:     0,
    paramValues:    {},    // init in component via initParamDefaults()
    activeTab:      'backtest',

    setExchange:       (v) => set({ exchange: v }),
    setSymbolInput:    (v) => set({ symbolInput: v }),
    setSelectedSymbol: (v) => set({ selectedSymbol: v }),
    setStartDate:      (v) => set({ startDate: v }),
    setEndDate:        (v) => set({ endDate: v }),
    setInitialCapital: (v) => set({ initialCapital: v }),
    setStrategyIdx:    (v) => set({ strategyIdx: v }),
    setVariantIdx:     (v) => set({ variantIdx: v }),
    setParamValues:    (v) => set({ paramValues: v }),
    setActiveTab:      (v) => set({ activeTab: v }),

    // ── Backtest ──
    btStatus:    'idle',
    btStatusMsg: '',
    btResult:    null,
    showTrades:  false,

    setBtStatus:    (v) => set({ btStatus: v }),
    setBtStatusMsg: (v) => set({ btStatusMsg: v }),
    setBtResult:    (v) => set({ btResult: v }),
    setShowTrades:  (v) => set({ showTrades: v }),

    // ── Optimizer ──
    wfInSample:  252,
    wfOutSample: 63,
    wfMode:      'rolling',
    optMetric:   'sharpe_ratio',
    wfStatus:    'idle',
    wfStatusMsg: '',
    wfResult:    null,

    setWfInSample:  (v) => set({ wfInSample: v }),
    setWfOutSample: (v) => set({ wfOutSample: v }),
    setWfMode:      (v) => set({ wfMode: v }),
    setOptMetric:   (v) => set({ optMetric: v }),
    setWfStatus:    (v) => set({ wfStatus: v }),
    setWfStatusMsg: (v) => set({ wfStatusMsg: v }),
    setWfResult:    (v) => set({ wfResult: v }),
  }))
)