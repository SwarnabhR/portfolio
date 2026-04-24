'use client'

import { useEffect, useState } from 'react'

interface NowPlayingData {
  isPlaying: boolean
  title?: string
  artist?: string
  album?: string
  image?: string
  url?: string
}

export default function SpotifyNowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        console.log('Spotify now playing:', data)
        setData(data)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error fetching track'
        console.error('Spotify error:', msg)
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div style={{ fontSize: 'var(--text-sm)', color: '#fff', backgroundColor: '#222', padding: '8px', width: '100%' }}>Loading...</div>
  if (error) return <div style={{ fontSize: 'var(--text-sm)', color: '#fff', backgroundColor: '#222', padding: '8px', width: '100%' }}>Not authorized</div>

  if (!data?.isPlaying) {
    return <div style={{ fontSize: 'var(--text-sm)', color: '#fff', backgroundColor: '#222', padding: '8px', width: '100%' }}>Not playing anything</div>
  }

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#111111',
        borderRadius: '4px',
        border: '1px solid rgba(255,255,255,0.12)',
        textDecoration: 'none',
        width: '100%',
      }}
    >
      {data.image && (
        <img
          src={data.image}
          alt={data.album}
          style={{ width: '48px', height: '48px', borderRadius: '4px', flexShrink: 0 }}
        />
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.title}
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.artist}
        </div>
      </div>
    </a>
  )
}
