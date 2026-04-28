import { NextRequest, NextResponse } from 'next/server'

// Exchange → yfinance suffix map
const SUFFIX: Record<string, string> = {
  NSE:   '.NS',
  BSE:   '.BO',
  NYSE:  '',
  NASDAQ:'',
  LSE:   '.L',
  SSE:   '.SS',
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const symbol   = searchParams.get('symbol')
  const exchange = searchParams.get('exchange') ?? 'NSE'
  const start    = searchParams.get('start')    ?? '2022-01-01'
  const end      = searchParams.get('end')      ?? new Date().toISOString().slice(0, 10)

  if (!symbol) {
    return NextResponse.json({ error: 'symbol is required' }, { status: 400 })
  }

  const suffix = SUFFIX[exchange] ?? ''
  const ticker = symbol.includes('.') ? symbol : `${symbol}${suffix}`

  // Yahoo Finance v8 chart API — no API key needed
  const period1 = Math.floor(new Date(start).getTime() / 1000)
  const period2 = Math.floor(new Date(end).getTime()   / 1000)
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?period1=${period1}&period2=${period2}&interval=1d&events=history`

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 3600 }, // cache 1 hour
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Yahoo Finance returned ${res.status} for ${ticker}` },
        { status: 502 }
      )
    }

    const json = await res.json()
    const chart = json?.chart?.result?.[0]

    if (!chart) {
      return NextResponse.json({ error: `No data found for ${ticker}` }, { status: 404 })
    }

    const timestamps = chart.timestamp as number[]
    const q = chart.indicators.quote[0]
    const adjClose: number[] | undefined = chart.indicators.adjclose?.[0]?.adjclose

    const rows = timestamps.map((ts, i) => ({
      date:   new Date(ts * 1000).toISOString().slice(0, 10),
      open:   q.open[i],
      high:   q.high[i],
      low:    q.low[i],
      close:  adjClose ? adjClose[i] : q.close[i],
      volume: q.volume[i],
    })).filter(r => r.close != null && r.open != null)

    return NextResponse.json({ ticker, exchange, rows })
  } catch (err) {
    console.error('[market-data]', err)
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 })
  }
}
