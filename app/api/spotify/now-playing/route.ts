import { NextResponse } from 'next/server'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN

async function getAccessToken() {
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
  return data.access_token
}

export async function GET() {
  try {
    if (!REFRESH_TOKEN) {
      return NextResponse.json(
        { error: 'Spotify not authorized. Visit /api/auth/spotify to authorize.' },
        { status: 401 }
      )
    }

    const accessToken = await getAccessToken()

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (response.status === 204) {
      // Not playing anything
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
  } catch (error) {
    console.error('Spotify API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch now playing' },
      { status: 500 }
    )
  }
}
