import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')

  if (error) {
    return NextResponse.json({ error }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri = process.env.NODE_ENV === 'production'
    ? `${req.nextUrl.origin}/api/auth/spotify/callback`
    : 'http://127.0.0.1:3000/api/auth/spotify/callback'

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }).toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: 400 })
    }

    // Store refresh token in .env.local or Sanity
    // For now, log it so you can copy-paste into .env.local
    console.log('Spotify Refresh Token:', data.refresh_token)

    return NextResponse.json({
      message: 'Authorization successful',
      refreshToken: data.refresh_token,
      instructions: 'Add this to .env.local as SPOTIFY_REFRESH_TOKEN',
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to exchange code for token' },
      { status: 500 }
    )
  }
}
