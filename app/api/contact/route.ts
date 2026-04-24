import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../../../sanity/env'

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name?.trim())           return NextResponse.json({ error: 'Name is required' },    { status: 400 })
    if (!email?.trim())          return NextResponse.json({ error: 'Email is required' },   { status: 400 })
    if (!isValidEmail(email))    return NextResponse.json({ error: 'Invalid email' },       { status: 400 })
    if (!message?.trim())        return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    if (message.length > 2000)   return NextResponse.json({ error: 'Message too long' },   { status: 400 })

    await writeClient.create({
      _type: 'contactSubmission',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      read: false,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
