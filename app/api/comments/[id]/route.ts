import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: 'dch96v4a',
  dataset: 'production',
  apiVersion: '2026-04-25',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  await client.delete(id)
  return NextResponse.json({ success: true })
}
