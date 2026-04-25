import { NextRequest, NextResponse } from 'next/server'

const BASE = 'https://ws.audioscrobbler.com/2.0/'
const SAFE_PARAMS = ['method', 'limit', 'period', 'page', 'from']

export async function GET(req: NextRequest) {
  const API_KEY  = process.env.LASTFM_API_KEY
  const USERNAME = process.env.LASTFM_USERNAME

  if (!API_KEY || !USERNAME) {
    return NextResponse.json({ error: 'not_configured' }, { status: 503 })
  }

  const { searchParams } = req.nextUrl
  const params = new URLSearchParams({
    api_key: API_KEY,
    user: USERNAME,
    format: 'json',
  })
  for (const [k, v] of searchParams.entries()) {
    if (SAFE_PARAMS.includes(k)) params.set(k, v)
  }

  try {
    const res = await fetch(`${BASE}?${params}`, {
      next: { revalidate: 60 },
      headers: { 'User-Agent': 'sroy-portfolio/1.0' },
    })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'fetch_failed' }, { status: 500 })
  }
}
