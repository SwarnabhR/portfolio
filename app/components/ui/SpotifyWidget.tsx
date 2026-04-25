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
      } catch {
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
      className="fixed right-6 z-30 flex items-center gap-3 px-3 py-2 hover:opacity-90 transition-opacity duration-500"
      style={{
        top: 72,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        background: 'rgba(10,10,12,0.7)',
        backdropFilter: 'blur(12px)',
        border: '0.5px solid rgba(255,255,255,0.08)',
        borderRadius: 6,
        maxWidth: 'min(240px, 44vw)',
      }}
    >
      {data.image && (
        <Image
          src={data.image}
          alt={data.album || 'Album artwork'}
          width={36}
          height={36}
          className="hidden sm:block rounded shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#1db954', flexShrink: 0 }} />
          <span style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>now playing</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.title}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.artist}
        </div>
      </div>
    </a>
  )
}
