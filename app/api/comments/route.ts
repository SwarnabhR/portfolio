import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const ipHits = new Map<string, { count: number; reset: number }>()
const LIMIT = 5
const WINDOW_MS = 60 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipHits.get(ip)
  if (!entry || now > entry.reset) {
    ipHits.set(ip, { count: 1, reset: now + WINDOW_MS })
    return true
  }
  if (entry.count >= LIMIT) return false
  entry.count++
  return true
}

const client = createClient({
  projectId: 'dch96v4a',
  dataset: 'production',
  apiVersion: '2026-04-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function GET() {
  const comments = await client.fetch(
    `*[_type == "comment"] | order(createdAt desc) { _id, name, message, createdAt }`,
    {},
    { cache: 'no-store' }
  )
  return NextResponse.json(comments)
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many comments. Try again later.' }, { status: 429 })
  }

  const { name, message } = await req.json()

  if (!name?.trim())    return NextResponse.json({ error: 'Name is required' },    { status: 400 })
  if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  if (name.length > 60)    return NextResponse.json({ error: 'Name too long' },    { status: 400 })
  if (message.length > 1000) return NextResponse.json({ error: 'Message too long' }, { status: 400 })

  const doc = await client.create({
    _type: 'comment',
    name: name.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json(doc, { status: 201 })
}
