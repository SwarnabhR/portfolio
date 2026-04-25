'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

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
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing')
        if (!response.ok) { setLoading(false); return }
        const data = await response.json()
        setData(data)
      } catch (err) {
        // silently ignore network errors (e.g. credentials not configured)
      } finally {
        setLoading(false)
      }
    }

    fetchNowPlaying()
    const interval = setInterval(fetchNowPlaying, 15000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const contactSection = document.getElementById('contact')
      if (!contactSection) {
        setIsVisible(true)
        return
      }
      const rect = contactSection.getBoundingClientRect()
      setIsVisible(rect.top > window.innerHeight * 0.5)
    }

    handleScroll() // Initialize on mount
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (loading || !data?.isPlaying) return null

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-30 flex gap-4 p-4 bg-black-4 rounded hover:opacity-90 transition-opacity duration-500 max-w-sm"
      style={{ opacity: isVisible ? 1 : 0, pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {data.image && (
        <Image
          src={data.image}
          alt={data.album || 'Album artwork'}
          width={64}
          height={64}
          className="rounded shrink-0"
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
