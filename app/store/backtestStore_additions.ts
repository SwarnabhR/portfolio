// ─────────────────────────────────────────────────────────────────────────────
// backtestStore.ts  — ADD these slices (merge into your existing store)
// New fields needed by WalkForwardOptimizerTab
// ─────────────────────────────────────────────────────────────────────────────

// ── Add to your State interface ──────────────────────────────────────────────
interface WFOState {
  // Walk-forward config
  wfInSample:  number          // IS window length in trading days  (default 252)
  wfOutSample: number          // OOS window length in trading days (default 63)
  wfMode:      'anchored' | 'rolling'  // default 'rolling'
  optMetric:   string          // 'sharpe_ratio' | 'cagr' | 'total_return_pct'

  // Walk-forward run state
  wfStatus:    'idle' | 'fetching' | 'loading' | 'running' | 'done' | 'error'
  wfStatusMsg: string
  wfResult:    WFResult | null
}

// ── Add to your initial state object ────────────────────────────────────────
const wfoInitialState: WFOState = {
  wfInSample:  252,
  wfOutSample: 63,
  wfMode:      'rolling',
  optMetric:   'sharpe_ratio',
  wfStatus:    'idle',
  wfStatusMsg: '',
  wfResult:    null,
}

// ── Add to your actions ──────────────────────────────────────────────────────
// setWfInSample:  (n: number) => set({ wfInSample: n })
// setWfOutSample: (n: number) => set({ wfOutSample: n })
// setWfMode:      (m: 'anchored' | 'rolling') => set({ wfMode: m })
// setOptMetric:   (m: string) => set({ optMetric: m })
// setWfStatus:    (s: WFOState['wfStatus']) => set({ wfStatus: s })
// setWfStatusMsg: (msg: string) => set({ wfStatusMsg: msg })
// setWfResult:    (r: WFResult | null) => set({ wfResult: r })

// ─────────────────────────────────────────────────────────────────────────────
// BacktestingEnginePage.tsx  — INTEGRATION DIFF
// Replace the {activeTab === 'optimizer'} JSX block with:
// ─────────────────────────────────────────────────────────────────────────────

/*
  BEFORE (inside your return JSX, after the </> closing the 'backtest' block):

    {activeTab === 'optimizer' && (
      <div>...</div>   // ← whatever placeholder was here
    )}

  AFTER:

    {activeTab === 'optimizer' && (
      <WalkForwardOptimizerTab
        STRATEGIES={STRATEGIES}
        handleRunWFO={handleRunWFO}
      />
    )}

  Import at the top of BacktestingEnginePage.tsx:
    import { WalkForwardOptimizerTab } from './WalkForwardOptimizerTab'

  The handleRunWFO callback already exists in your file — no changes needed there.
  The STRATEGIES constant already exists — just pass it as a prop.

  IMPORTANT: In BacktestingEnginePage.tsx the existing {activeTab === 'backtest'} 
  block is wrapped in <> ... </> — make sure the optimizer block sits at the same 
  level, e.g.:

    {activeTab === 'backtest' && (
      <>
        {/* Strategy config, Run button, Results */}
      </>
    )}

    {activeTab === 'optimizer' && (
      <WalkForwardOptimizerTab
        STRATEGIES={STRATEGIES}
        handleRunWFO={handleRunWFO}
      />
    )}