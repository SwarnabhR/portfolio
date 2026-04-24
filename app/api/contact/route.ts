import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { Resend } from 'resend'
const ipHits = new Map<string, { count: number; reset: number }>()
const LIMIT = 3
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

const writeClient = createClient({
  projectId: 'dch96v4a',
  dataset: 'production',
  apiVersion: '2026-04-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const resend = new Resend(process.env.RESEND_API_KEY)

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429 }
      )
    }

    const { name, email, message } = await req.json()

    if (!name?.trim())           return NextResponse.json({ error: 'Name is required' },    { status: 400 })
    if (!email?.trim())          return NextResponse.json({ error: 'Email is required' },   { status: 400 })
    if (!isValidEmail(email))    return NextResponse.json({ error: 'Invalid email' },       { status: 400 })
    if (!message?.trim())        return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    if (message.length > 2000)   return NextResponse.json({ error: 'Message too long' },   { status: 400 })

    const cleanName    = name.trim()
    const cleanEmail   = email.trim().toLowerCase()
    const cleanMessage = message.trim()

    await writeClient.create({
      _type: 'contactSubmission',
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      submittedAt: new Date().toISOString(),
      read: false,
    })

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: process.env.NOTIFY_EMAIL ?? 'workspace.swarnabh@gmail.com',
        subject: `New message from ${cleanName}`,
        text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\n${cleanMessage}`,
        html: `
          <p><strong>Name:</strong> ${cleanName}</p>
          <p><strong>Email:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
          <hr />
          <p style="white-space:pre-wrap">${cleanMessage}</p>
        `,
      })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
