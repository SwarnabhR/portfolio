import { NextResponse } from 'next/server'

const CLIENT_ID     = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN!,
    }).toString(),
  })

  const data = await response.json()

  if (!response.ok || !data.access_token) {
    cachedToken    = null
    tokenExpiresAt = 0
    throw new Error(data.error_description ?? data.error ?? 'Token refresh failed')
  }

  cachedToken    = data.access_token
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken
}

export async function GET() {
  try {
    if (!REFRESH_TOKEN) {
      return NextResponse.json({ isPlaying: false })
    }

    const accessToken = await getAccessToken()

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (response.status === 204) {
      return NextResponse.json({ isPlaying: false })
    }

    const data = await response.json()

    if (!data.item) {
      return NextResponse.json({ isPlaying: false })
    }

    return NextResponse.json({
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map((a: any) => a.name).join(', '),
      album: data.item.album.name,
      image: data.item.album.images[0]?.url,
      url: data.item.external_urls.spotify,
      duration: data.item.duration_ms,
      progress: data.progress_ms,
    })
  } catch {
    return NextResponse.json({ isPlaying: false })
  }
}
