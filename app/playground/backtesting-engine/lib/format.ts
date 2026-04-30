// app/playground/backtesting-engine/lib/format.ts

export function fmt(n: number, dec = 2): string {
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  })
}

export function pct(n: number): string {
  const decimals = Math.abs(n) < 0.1 && n !== 0 ? 3 : 2
  return `${n >= 0 ? '+' : ''}${n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`
}