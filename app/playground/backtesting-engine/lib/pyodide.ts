// app/playground/backtesting-engine/lib/pyodide.ts

export {}

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<unknown>
    _pyodide?: unknown
  }
}

// ─── Singleton ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _instance: any = null

const ENGINE_FILES = [
  'risk.py', 'costs.py', 'sizer.py',
  'indicators.py', 'strategy.py', 'backtest.py',
] as const

// ─── Loader ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function ensurePyodide(onStatus: (msg: string) => void): Promise<any> {
  if (_instance) return _instance

  if (!window.loadPyodide) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js'
      s.onload  = () => resolve()
      s.onerror = () => reject(new Error('Failed to load Pyodide CDN'))
      document.head.appendChild(s)
    })
  }

  onStatus('Loading Python runtime...')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const py = await (window.loadPyodide as any)({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.4/full/',
  })

  onStatus('Installing packages (pandas, numpy)...')
  await py.loadPackage(['pandas', 'numpy'])

  onStatus('Loading engine modules...')
  for (const file of ENGINE_FILES) {
    const resp = await fetch(`/engine/${file}`)
    if (!resp.ok) throw new Error(`Failed to load engine/${file}`)
    const code = await resp.text()
    await py.runPythonAsync(code)

    const modName = file.replace('.py', '')
    await py.runPythonAsync(`
import sys, types as _types
_mod = _types.ModuleType('${modName}')
_mod.__dict__.update({k: v for k, v in globals().items() if not k.startswith('__')})
sys.modules['${modName}'] = _mod
    `)
  }

  _instance = py
  return py
}

// ─── Python bridge — standard backtest ───────────────────────────────────────
export const PYODIDE_BRIDGE = `
import json

# ── inject OHLCV rows as a DataFrame ──
rows = json.loads(ohlcv_json)
import pandas as pd
df = pd.DataFrame(rows)
df['date'] = pd.to_datetime(df['date'])
df = df.set_index('date').sort_index()
df.columns = [c.lower() for c in df.columns]

# ── instantiate strategy and run ──
strategy_cls = globals()[strategy_class_name]
params_dict  = json.loads(strategy_params_json)
strategy     = strategy_cls(**params_dict)

bt = Backtest(initial=float(initial_capital))
trades_df, equity_curve, metrics = bt.run(df, strategy)

# ── serialise results ──
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

first_close = float(df['close'].iloc[0])
benchmark_list = [
  {'date': str(d.date()), 'value': round(float(initial_capital) * (v / first_close), 2)}
  for d, v in df['close'].items()
]
result = json.dumps({
    'metrics': {
        'sharpe_ratio':     round(float(metrics.sharpe_ratio),     3),
        'cagr':             round(float(metrics.cagr) * 100,        2),
        'max_drawdown_pct': round(float(metrics.max_drawdown_pct), 2),
        'win_rate':         round(float(metrics.win_rate) * 100,    2),
        'total_trades':     int(metrics.total_trades),
        'total_return_pct': round(float(metrics.total_return_pct) * 100, 2),
    },
    'equity_curve': equity_list,
    'benchmark': benchmark_list,
    'trades': trades_list,
})
result
`

export const PYODIDE_BRIDGE_WFO = `
import json, numpy as np

rows       = json.loads(ohlcv_json)
opt_metric = optimizer_metric
in_days    = int(in_sample_days)
out_days   = int(out_sample_days)
mode       = wf_mode
min_trades = 3

import pandas as pd
df = pd.DataFrame(rows)
df['date'] = pd.to_datetime(df['date'])
df = df.set_index('date').sort_index()
df.columns = [c.lower() for c in df.columns]

strategy_cls = globals()[strategy_class_name]
param_grid   = json.loads(param_grid_json)

total = len(df)
windows = []
start_idx = 0
win_num = 0

while True:
    if mode == 'anchored':
        # IS window is fixed at 0 and grows each step; OOS slides forward by out_days
        is_start = 0
        is_end   = in_days + win_num * out_days
    else:
        # Rolling: both IS and OOS windows advance together by in_days
        is_start = start_idx
        is_end   = start_idx + in_days
    oos_end = is_end + out_days
    if oos_end > total:
        break
    windows.append((win_num, df.iloc[is_start:is_end], df.iloc[is_end:oos_end]))
    start_idx = is_end
    win_num += 1

if not windows:
    raise ValueError("Not enough data for even one window. Reduce in-sample or out-of-sample days.")

from optimizer import GridOptimizer
from backtest import Backtest

window_results = []
oos_equity_pieces = []

for win_num, in_df, out_df in windows:
    keys = list(param_grid.keys())
    constraint = (lambda p: p['fast'] < p['slow']) if ('fast' in keys and 'slow' in keys) else None
    opt = GridOptimizer(strategy_class=strategy_cls, param_grid=param_grid,
                        initial=float(initial_capital), min_trades=min_trades, constraint=constraint)
    best = opt.best(in_df, sort_by=opt_metric)
    if best is None:
        continue
    bt = Backtest(initial=float(initial_capital))
    try:
        trades_df, equity_curve, metrics = bt.run(out_df, strategy_cls(**best.params))
    except Exception:
        continue
    scale = (oos_equity_pieces[-1]['value'] / float(initial_capital)) if oos_equity_pieces else 1.0
    for d, v in equity_curve.items():
        oos_equity_pieces.append({'date': str(d.date()), 'value': round(float(v) * scale, 2)})
    window_results.append({
        'window': win_num,
        'in_start': str(in_df.index[0].date()), 'in_end': str(in_df.index[-1].date()),
        'out_start': str(out_df.index[0].date()), 'out_end': str(out_df.index[-1].date()),
        'best_params': {k: float(v) for k, v in best.params.items()},
        'in_sharpe': round(best.sharpe_ratio, 3), 'in_cagr': round(best.cagr * 100, 2),
        'out_sharpe': round(float(metrics.sharpe_ratio), 3),
        'out_cagr': round(float(metrics.cagr) * 100, 2),
        'out_return': round(float(metrics.total_return_pct) * 100, 2),
        'out_trades': int(metrics.total_trades),
        'out_drawdown': round(float(metrics.max_drawdown_pct), 2),
    })

if not window_results:
    raise ValueError("Optimizer found no valid parameter combinations in any window.")

out_returns = [w['out_return'] for w in window_results]
result = json.dumps({
    'windows': window_results,
    'equity_curve': oos_equity_pieces,
    'avg_out_sharpe': round(float(np.mean([w['out_sharpe'] for w in window_results])), 3),
    'avg_out_cagr':   round(float(np.mean([w['out_cagr']   for w in window_results])), 2),
    'avg_out_return': round(float(np.mean(out_returns)), 2),
    'total_trades':   sum(w['out_trades'] for w in window_results),
    'consistency':    round(100 * sum(1 for r in out_returns if r > 0) / len(out_returns), 1),
})
result
`