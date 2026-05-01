import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const ipHits = new Map<string, { count: number; reset: number }>()
const LIMIT = 2
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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function checkEmailExists(email: string): Promise<boolean> {
  const result = await writeClient.fetch(
    `count(*[_type == "waitlistEntry" && email == $email])`,
    { email: email.toLowerCase() }
  )
  return result > 0
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many sign-ups from this IP. Try again in an hour.' },
        { status: 429 }
      )
    }

    const { email } = await req.json()

    if (!email?.trim())       return NextResponse.json({ error: 'Email is required' },  { status: 400 })
    if (!isValidEmail(email)) return NextResponse.json({ error: 'Invalid email' },      { status: 400 })

    const cleanEmail = email.trim().toLowerCase()

    // Check for duplicates
    const emailExists = await checkEmailExists(cleanEmail)
    if (emailExists) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist.' },
        { status: 409 }
      )
    }

    // Create waitlist entry
    await writeClient.create({
      _type: 'waitlistEntry',
      email: cleanEmail,
      source: 'backtesting-engine',
      subscribedAt: new Date().toISOString(),
      notified: false,
    })

    // Send emails if Resend is configured
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      // 1. Confirmation email to subscriber
      await resend.emails.send({
        from: 'S. Roy <onboarding@resend.dev>',
        to: cleanEmail,
        subject: 'You\'re on the waitlist',
        text: 'Thanks for signing up! You\'re on the early access list for the full backtesting engine. We\'ll email you as soon as it launches.',
        html: `
          <p>Thanks for signing up! 🎉</p>
          <p>You're now on the early access list for the full backtesting engine. We'll reach out as soon as it launches.</p>
          <p style="margin-top: 24px; font-size: 12px; color: #888;">
            In the meantime, feel free to explore the trial version at <a href="https://swarnabhroy.dev/playground/backtesting-engine">swarnabhroy.dev</a>.
          </p>
        `,
      })

      // 2. Notification to owner
      await resend.emails.send({
        from: 'Portfolio Waitlist <onboarding@resend.dev>',
        to: process.env.NOTIFY_EMAIL ?? 'swarnabh.roy@gmail.com',
        subject: 'New waitlist sign-up: backtesting-engine',
        text: `New sign-up for backtesting engine early access:\n\nEmail: ${cleanEmail}\nTime: ${new Date().toISOString()}`,
        html: `
          <p><strong>New waitlist sign-up</strong></p>
          <p><strong>Email:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
          <p><strong>Source:</strong> backtesting-engine</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        `,
      })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to sign up. Please try again.' }, { status: 500 })
  }
}
