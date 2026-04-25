import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url:   process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const TOTAL_KEY = 'total_visitors'

export async function POST(_req: NextRequest) {
  try {
    const count = await redis.incr(TOTAL_KEY)
    return NextResponse.json({ count })
  } catch (err) {
    console.error('[visitors POST]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  try {
    const count = await redis.get<number>(TOTAL_KEY)
    return NextResponse.json({ count: count ?? 0 })
  } catch (err) {
    console.error('[visitors GET]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
