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

export default function SpotifyWidget() {
  const [data, setData] = useState<NowPlayingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        setData(data)
      } catch (err) {
        console.error('Spotify error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !data?.isPlaying) return null

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-30 flex gap-4 p-4 bg-black-4 rounded hover:opacity-90 transition max-w-sm"
    >
      {data.image && (
        <img
          src={data.image}
          alt={data.album}
          className="w-16 h-16 rounded flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-fg-2 uppercase tracking-wider mb-1">
          Now Playing
        </div>
        <div className="text-base font-medium text-white truncate">
          {data.title}
        </div>
        <div className="text-sm text-fg-2 truncate">
          {data.artist}
        </div>
      </div>
    </a>
  )
}
