import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = process.env.NODE_ENV === 'production'
    ? `${req.nextUrl.origin}/api/auth/spotify/callback`
    : 'http://127.0.0.1:3000/api/auth/spotify/callback'
  const scope = 'user-read-currently-playing user-read-playback-state'

  const params = new URLSearchParams({
    client_id: clientId!,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scope,
    state: Math.random().toString(36).substring(7),
  })

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  )
}
