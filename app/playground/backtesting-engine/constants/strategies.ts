// app/playground/backtesting-engine/constants/strategies.ts

import { StrategyMeta } from "../types"

export const STRATEGIES: StrategyMeta[] = [
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