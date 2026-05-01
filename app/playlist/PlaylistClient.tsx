'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'

import type { PlaylistItem } from './page'

// ── Helpers ───────────────────────────────────────────────────────
const PALETTES = [
  'linear-gradient(135deg,#2d0b4e,#6a0dad,#c2185b)',
  'linear-gradient(135deg,#0b0d14,#1a0030,#6a0dad)',
  'linear-gradient(135deg,#050506,#002038,#4a0072)',
  'linear-gradient(135deg,#1a0030,#4a0072,#c2185b,#e65100)',
  'linear-gradient(135deg,#002038,#4a0072,#c2185b)',
  'linear-gradient(135deg,#0a0a14,#190040,#1db954)',
  'linear-gradient(135deg,#12020a,#4a0030,#ff5500)',
]
function paletteFor(key: string) {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0
  return PALETTES[Math.abs(h) % PALETTES.length]
}
function waveHeights(key: string, n: number) {
  return Array.from({ length: n }, (_, i) => {
    let h = 0; const s = key + i
    for (let j = 0; j < s.length; j++) h = (h * 31 + s.charCodeAt(j)) | 0
    return 0.2 + (Math.abs(h) % 80) / 100
  })
}
function timeAgo(uts: number) {
  const s = Math.floor(Date.now() / 1000 - uts)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`
  return new Date(uts * 1000).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toLowerCase()
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lfmImage(images: any[]): string | null {
  if (!Array.isArray(images)) return null
  for (const size of ['extralarge', 'large', 'medium', 'small']) {
    const url = images.find((i: { size: string }) => i.size === size)?.['#text']
    if (url) return url
  }
  return null
}

// ── Types ─────────────────────────────────────────────────────────
type Track   = { name: string; artist: string; album: string; url: string; nowplaying: boolean; date: number | null; image: string | null }
type TopItem = { rank: number; name: string; sub: string; playcount: number; url: string }
type UserStats = { total: number; topArtist: string; topTrack: string; since: number }

// ── Art block (real image or gradient fallback) ───────────────────
function ArtBlock({ image, alt, size, nowplaying = false }: { image: string | null; alt: string; size: number; nowplaying?: boolean }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 2, flexShrink: 0, position: 'relative', overflow: 'hidden', background: paletteFor(alt) }}>
      {image && (
        <Image src={image} alt={alt} fill sizes={`${size}px`} style={{ objectFit: 'cover' }} />
      )}
      {nowplaying && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(194,24,91,0.35),transparent)', animation: 'pulseArt 1.8s ease-in-out infinite' }} />
      )}
    </div>
  )
}

// ── Now-playing bar ───────────────────────────────────────────────
function NowPlayingBar({ track }: { track: Track }) {
  const heights = waveHeights(track.name + track.artist, 40)
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(180deg,rgba(88,0,180,0.07),transparent)', padding: '16px 0' }}>
      <div className="max-w-6xl mx-auto px-6" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ArtBlock image={track.image} alt={track.album || track.name} size={48} nowplaying />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c2185b', animation: 'npPulse 1.6s infinite', flexShrink: 0 }} />
              <span style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>now playing</span>
            </div>
            <p style={{ fontSize: 'var(--text-base)', fontWeight: 400, color: 'var(--fg-1)', letterSpacing: '-0.01em' }}>
              {track.name} — <span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.5)' }}>{track.artist}</span>
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 28, overflow: 'hidden' }}>
          {heights.map((h, i) => (
            <span key={i} style={{
              width: 2, borderRadius: 1, flexShrink: 0,
              background: i < 16 ? 'rgba(194,24,91,0.7)' : i === 16 ? '#fff' : 'rgba(255,255,255,0.18)',
              height: `${h * 100}%`,
              animation: i === 16 ? 'barPulse 0.6s ease-in-out infinite alternate' : 'none',
            }} />
          ))}
        </div>
        <a href={track.url} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(160,60,255,0.5)'; e.currentTarget.style.color = 'var(--fg-1)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
        >↗</a>
      </div>
      <style>{`
        @keyframes npPulse{0%{box-shadow:0 0 0 0 rgba(194,24,91,0.55)}70%{box-shadow:0 0 0 10px rgba(194,24,91,0)}100%{box-shadow:0 0 0 0 rgba(194,24,91,0)}}
        @keyframes barPulse{to{transform:scaleY(1.5)}}
        @keyframes pulseArt{0%,100%{opacity:0.35}50%{opacity:0.8}}
      `}</style>
    </div>
  )
}

// ── Stats strip ───────────────────────────────────────────────────
function StatsStrip({ stats }: { stats: UserStats }) {
  const items = [
    { v: stats.total.toLocaleString(), l: 'scrobbles · all time' },
    { v: stats.topArtist || '—', l: 'top artist · 7d' },
    { v: stats.topTrack || '—', l: 'top track · 7d' },
    { v: new Date(stats.since * 1000).getFullYear().toString(), l: 'scrobbling since' },
  ]
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '24px 0' }}>
      <style>{`@media(max-width:600px){.lfm-stats{grid-template-columns:repeat(2,1fr)!important}}`}</style>
      <div className="lfm-stats max-w-6xl mx-auto px-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
        {items.map(({ v, l }) => (
          <div key={l}>
            <p style={{ fontSize: 'clamp(18px,2.5vw,28px)', fontWeight: 300, color: 'var(--fg-1)', letterSpacing: '-0.02em', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Recently played rows ──────────────────────────────────────────
function RecentFeed({ tracks }: { tracks: Track[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  return (
    <div className="max-w-6xl mx-auto px-6" style={{ paddingBottom: 56 }}>
      <style>{`
        @media(max-width:600px){
          .recent-row{grid-template-columns:28px 40px 1fr auto!important;gap:10px!important}
          .recent-album{display:none!important}
        }
      `}</style>
      <div style={{ marginBottom: 20 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)', border: '1px solid var(--border-pill)', borderRadius: 999, padding: '6px 16px' }}>✦ recently played</span>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} onMouseLeave={() => setHoveredIdx(null)}>
        {tracks.map((track, i) => (
          <a key={i} href={track.url} target="_blank" rel="noopener noreferrer"
            onMouseEnter={() => setHoveredIdx(i)}
            className="recent-row"
            style={{
              display: 'grid', gridTemplateColumns: '36px 48px 1fr auto auto', gap: 16, alignItems: 'center',
              padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
              textDecoration: 'none',
              background: track.nowplaying ? 'linear-gradient(90deg,rgba(88,0,180,0.1),transparent 70%)' : 'transparent',
              opacity: hoveredIdx !== null && hoveredIdx !== i ? 0.28 : 1,
              transform: hoveredIdx === i ? 'translateX(-4px)' : 'translateZ(0)',
              transition: 'opacity 0.3s, transform 0.3s',
              willChange: 'opacity, transform',
            }}
          >
            <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.2)' }}>{String(i + 1).padStart(2, '0')}</span>
            <ArtBlock image={track.image} alt={track.album || track.name} size={48} nowplaying={track.nowplaying} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--fg-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {track.name}
                {track.nowplaying && <span style={{ marginLeft: 8, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c2185b', border: '0.5px solid rgba(194,24,91,0.4)', borderRadius: 3, padding: '2px 5px' }}>live</span>}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.artist}</p>
            </div>
            <span className="recent-album" style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 160, display: 'block' }}>{track.album}</span>
            <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: track.nowplaying ? '#c2185b' : 'rgba(255,255,255,0.2)', flexShrink: 0, minWidth: 52, textAlign: 'right' }}>
              {track.nowplaying ? 'now' : track.date ? timeAgo(track.date) : ''}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ── Cards grid (top tracks + top artists) ────────────────────────
function TopCardsSection({ items, label, period, onPeriodChange }: {
  items: TopItem[]; label: string; period: string; onPeriodChange: (p: string) => void
}) {
  return (
    <div className="max-w-6xl mx-auto px-6" style={{ paddingBottom: 56 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)', border: '1px solid var(--border-pill)', borderRadius: 999, padding: '6px 16px' }}>✦ {label}</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>period</span>
          {[['7day', '7d'], ['1month', '1mo'], ['overall', 'all']] .map(([val, lbl]) => (
            <button key={val} onClick={() => onPeriodChange(val)} style={{ fontSize: 'var(--text-xs)', letterSpacing: '0.06em', color: period === val ? 'var(--fg-1)' : 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: period === val ? 400 : 300, transition: 'color 0.2s' }}>{lbl}</button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 'var(--text-sm)' }}>loading…</span>
        </div>
      ) : (
        <>
          <style>{`@media(max-width:480px){.top-cards{grid-template-columns:repeat(2,1fr)!important}}@media(min-width:481px) and (max-width:768px){.top-cards{grid-template-columns:repeat(3,1fr)!important}}`}</style>
          <div className="top-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'rgba(255,255,255,0.04)' }}>
            {items.map((item, i) => (
              <TopCard key={i} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function TopCard({ item }: { item: TopItem }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'block', background: 'var(--bg)', textDecoration: 'none', border: '1px solid transparent', borderColor: hovered ? 'rgba(160,60,255,0.35)' : 'transparent', transform: hovered ? 'translateY(-3px)' : 'translateZ(0)', transition: 'transform 0.4s cubic-bezier(.22,1,.36,1), border-color 0.3s', overflow: 'hidden', willChange: 'transform' }}>
      <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{String(item.rank).padStart(2, '0')}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--fg-1)', letterSpacing: '-0.01em', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.sub}</p>
        </div>
        <span style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>{item.playcount.toLocaleString()}</span>
      </div>
    </a>
  )
}

// ── Curated playlist rows ─────────────────────────────────────────
const PLATFORM_COLOR: Record<string, string> = { youtube: '#e65100', spotify: '#1db954' }
function getUrl(item: PlaylistItem) {
  if (item.platform === 'youtube' && item.youtubePlaylistId) return `https://www.youtube.com/playlist?list=${item.youtubePlaylistId}`
  if (item.platform === 'spotify' && item.spotifyPlaylistId) return `https://open.spotify.com/playlist/${item.spotifyPlaylistId}`
  return null
}
function PlaylistRow({ item, index, dimmed }: { item: PlaylistItem; index: number; dimmed: boolean }) {
  const { ref, isVisible } = useReveal<HTMLAnchorElement>({ threshold: 0.05 })
  const [hovered, setHovered] = useState(false)
  const url = getUrl(item)
  const w = item.thumbnail?.asset?.metadata?.dimensions?.width ?? 320
  const h = item.thumbnail?.asset?.metadata?.dimensions?.height ?? 180
  return (
    <>
      <style>{`
        @media(max-width:600px){
          .pl-row{grid-template-columns:1fr auto!important;gap:12px!important}
          .pl-index,.pl-thumb,.pl-platform,.pl-count{display:none!important}
        }
      `}</style>
    <a ref={ref} href={url ?? '#'} target={url ? '_blank' : undefined} rel={url ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="pl-row"
      style={{ display: 'grid', gridTemplateColumns: '40px 160px 1fr auto auto 40px', gap: 24, alignItems: 'center', padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', cursor: url ? 'pointer' : 'default', opacity: isVisible ? (dimmed ? 0.28 : 1) : 0, transform: isVisible ? (hovered ? 'translateX(-6px)' : 'translateX(0)') : 'translateY(16px)', transition: `opacity 0.5s ease ${index * 55}ms, transform 0.35s ease`, willChange: 'opacity, transform' }}
    >
      <span className="pl-index" style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.2)' }}>0{index + 1}</span>
      <div className="pl-thumb" style={{ width: 160, height: 90, borderRadius: 2, position: 'relative', overflow: 'hidden', flexShrink: 0, background: paletteFor(item.title), transform: hovered ? 'scale(1.02)' : 'scale(1)', transition: 'transform 0.4s ease', willChange: 'transform' }}>
        {item.thumbnail?.asset?.url && <Image src={item.thumbnail.asset.url} alt={item.thumbnail.alt ?? item.title} width={w} height={h} style={{ width: '100%', height: '100%', objectFit: 'cover' }} sizes="160px" />}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 'clamp(14px,1.6vw,20px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--fg-1)', marginBottom: 6, lineHeight: 1.2 }}>{item.title}</p>
        {item.description && <p style={{ fontSize: 'var(--text-sm)', fontWeight: 300, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.description}</p>}
      </div>
      <div className="pl-platform" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: PLATFORM_COLOR[item.platform] ?? 'rgba(255,255,255,0.3)' }} />
        {item.platform}
      </div>
      <span className="pl-count" style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.25)', flexShrink: 0, textAlign: 'right' }}>{item.trackCount ?? ''}</span>
      <span style={{ fontSize: 14, textAlign: 'right', flexShrink: 0, color: hovered ? 'rgba(160,96,255,0.9)' : 'rgba(255,255,255,0.2)', transform: hovered ? 'translate(2px,-2px)' : 'none', transition: 'color 0.2s, transform 0.3s' }}>↗</span>
    </a>
    </>
  )
}

// ── Data fetching ─────────────────────────────────────────────────
// Module-level cache survives re-renders and page re-visits within the same session.
const _cache = new Map<string, { data: unknown; at: number; ttl: number }>()
const TTL = { recent: 60_000, stats: 300_000, top: 300_000 } // 1min / 5min / 5min

function cacheGet<T>(key: string): T | null {
  const e = _cache.get(key)
  if (!e || Date.now() - e.at > e.ttl) return null
  return e.data as T
}
function cacheSet(key: string, data: unknown, ttl: number) {
  _cache.set(key, { data, at: Date.now(), ttl })
}

async function lfm(
  method: string,
  extra?: Record<string, string>,
  ttl = TTL.recent,
  signal?: AbortSignal,
): Promise<unknown> {
  const key = `${method}:${JSON.stringify(extra ?? {})}`
  const hit = cacheGet<unknown>(key)
  if (hit !== null) return hit
  const params = new URLSearchParams({ method, ...extra })
  const res = await fetch(`/api/lastfm?${params}`, { signal })
  if (!res.ok) throw new Error(String(res.status))
  const data = await res.json()
  cacheSet(key, data, ttl)
  return data
}

// Bypass cache for the interval-based now-playing poll.
function lfmFresh(method: string, extra?: Record<string, string>, ttl = TTL.recent) {
  const key = `${method}:${JSON.stringify(extra ?? {})}`
  _cache.delete(key)
  return lfm(method, extra, ttl)
}

function parseRecentTracks(data: Record<string, unknown>): Track[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any[] = (data?.recenttracks as any)?.track ?? []
  return raw.slice(0, 20).map(t => ({
    name: t.name,
    artist: t.artist?.['#text'] ?? '',
    album: t.album?.['#text'] ?? '',
    url: t.url ?? '#',
    nowplaying: t['@attr']?.nowplaying === 'true',
    date: t.date?.uts ? Number(t.date.uts) : null,
    image: lfmImage(t.image ?? []),
  }))
}

function parseTopTracks(data: Record<string, unknown>): TopItem[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any[] = (data?.toptracks as any)?.track ?? []
  return raw.slice(0, 10).map(t => ({
    rank: Number(t['@attr']?.rank ?? 0),
    name: t.name,
    sub: t.artist?.name ?? '',
    playcount: Number(t.playcount ?? 0),
    url: t.url ?? '#',
  }))
}

function parseTopArtists(data: Record<string, unknown>): TopItem[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw: any[] = (data?.topartists as any)?.artist ?? []
  return raw.slice(0, 10).map(a => ({
    rank: Number(a['@attr']?.rank ?? 0),
    name: a.name,
    sub: `${Number(a.playcount ?? 0).toLocaleString()} plays`,
    playcount: Number(a.playcount ?? 0),
    url: a.url ?? '#',
  }))
}

// ── Main ──────────────────────────────────────────────────────────
export default function PlaylistClient({ playlists }: { playlists: PlaylistItem[] }) {
  const { ref: headRef, isVisible: headVisible } = useReveal()
  const [activeCategory, setActiveCategory] = useState('all')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const [configured, setConfigured] = useState<boolean | null>(null)
  const [recentTracks, setRecentTracks] = useState<Track[]>([])
  const [topTracks, setTopTracks] = useState<TopItem[]>([])
  const [topArtists, setTopArtists] = useState<TopItem[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [trackPeriod, setTrackPeriod] = useState('7day')
  const [artistPeriod, setArtistPeriod] = useState('7day')

  const trackAbort  = useRef<AbortController | null>(null)
  const artistAbort = useRef<AbortController | null>(null)

  // Initial fetch: uses cache if fresh; interval poll always bypasses cache.
  const fetchRecent = useCallback(async (fresh = false) => {
    try {
      const data = fresh
        ? await lfmFresh('user.getRecentTracks', { limit: '20' })
        : await lfm('user.getRecentTracks', { limit: '20' }, TTL.recent)
      if ((data as Record<string, unknown>)?.error === 'not_configured') { setConfigured(false); return }
      setConfigured(true)
      setRecentTracks(parseRecentTracks(data as Record<string, unknown>))
    } catch { setConfigured(false) }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const [info, artists, tracks7d] = await Promise.all([
        lfm('user.getInfo',       {}, TTL.stats),
        lfm('user.getTopArtists', { period: '7day', limit: '1' }, TTL.stats),
        lfm('user.getTopTracks',  { period: '7day', limit: '1' }, TTL.stats),
      ])
      setStats({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        total:     Number((info as any)?.user?.playcount ?? 0),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        topArtist: (artists as any)?.topartists?.artist?.[0]?.name ?? '—',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        topTrack:  (tracks7d as any)?.toptracks?.track?.[0]?.name ?? '—',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        since:     Number((info as any)?.user?.registered?.unixtime ?? 0),
      })
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    fetchRecent(); fetchStats()
    // Poll now-playing every 60s, always fresh so the live indicator updates.
    const id = setInterval(() => fetchRecent(true), 60_000)
    return () => clearInterval(id)
  }, [fetchRecent, fetchStats])

  useEffect(() => {
    if (!configured) return
    trackAbort.current?.abort()
    trackAbort.current = new AbortController()
    const { signal } = trackAbort.current
    lfm('user.getTopTracks', { period: trackPeriod, limit: '10' }, TTL.top, signal)
      .then(d => setTopTracks(parseTopTracks(d as Record<string, unknown>)))
      .catch(e => { if (e?.name !== 'AbortError') {} })
  }, [trackPeriod, configured])

  useEffect(() => {
    if (!configured) return
    artistAbort.current?.abort()
    artistAbort.current = new AbortController()
    const { signal } = artistAbort.current
    lfm('user.getTopArtists', { period: artistPeriod, limit: '10' }, TTL.top, signal)
      .then(d => setTopArtists(parseTopArtists(d as Record<string, unknown>)))
      .catch(e => { if (e?.name !== 'AbortError') {} })
  }, [artistPeriod, configured])

  const nowPlaying = recentTracks.find(t => t.nowplaying)

  const allCategories = useMemo(() => {
    const cats = new Set<string>()
    playlists.forEach(p => { if (p.category) cats.add(p.category) })
    return ['all', ...Array.from(cats)]
  }, [playlists])

  const filteredPlaylists = useMemo(() =>
    activeCategory === 'all' ? playlists : playlists.filter(p => p.category === activeCategory),
    [playlists, activeCategory]
  )

  return (
    <section style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: 80 }}>

      {/* Hero with animated gradient */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Orb 1 — drifts top-right */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 60% 70% at 75% 35%, rgba(88,0,180,0.45) 0%, transparent 70%)',
          animation: 'heroOrb1 12s ease-in-out infinite alternate',
          willChange: 'transform',
          transform: 'translateZ(0)' }} />
        {/* Orb 2 — drifts bottom-left */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 45% 55% at 15% 80%, rgba(194,24,91,0.25) 0%, transparent 65%)',
          animation: 'heroOrb2 16s ease-in-out infinite alternate',
          willChange: 'transform',
          transform: 'translateZ(0)' }} />
        {/* Orb 3 — subtle blue accent */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 35% 40% at 90% 90%, rgba(0,40,120,0.3) 0%, transparent 60%)',
          animation: 'heroOrb1 20s ease-in-out infinite alternate-reverse',
          willChange: 'transform',
          transform: 'translateZ(0)' }} />

        <div ref={headRef} className="max-w-6xl mx-auto px-6" style={{ position: 'relative', zIndex: 1, paddingTop: 48, paddingBottom: 48 }}>
        <div style={{ opacity: headVisible ? 1 : 0, transform: headVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.5s ease, transform 0.5s ease', marginBottom: 20 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)', border: '1px solid var(--border-pill)', borderRadius: 999, padding: '6px 16px' }}>✦ scrobbles</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px,8vw,100px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.0, color: 'var(--fg-1)', marginBottom: 16, opacity: headVisible ? 1 : 0, transform: headVisible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.6s ease 60ms, transform 0.6s ease 60ms' }}>
          listening log.<br /><span style={{ color: 'rgba(255,255,255,0.3)' }}>live from last.fm.</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, opacity: headVisible ? 1 : 0, transition: 'opacity 0.6s ease 120ms' }}>
          <p style={{ fontSize: 'var(--text-md)', fontWeight: 300, color: 'rgba(255,255,255,0.4)', maxWidth: 440, lineHeight: 1.65 }}>every track scrobbled from spotify, soundcloud, and youtube music lands here.</p>
          {configured && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c2185b', animation: 'npPulse 1.6s infinite' }} /> live · syncs every 60s
            </span>
          )}
        </div>
      </div>

        <style>{`
          @keyframes heroOrb1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-6%,8%) scale(1.12)}}
          @keyframes heroOrb2{0%{transform:translate(0,0) scale(1)}100%{transform:translate(8%,-10%) scale(1.18)}}
        `}</style>
      </div>

      {configured && nowPlaying && <NowPlayingBar track={nowPlaying} />}
      {configured && stats && <StatsStrip stats={stats} />}

      {configured && recentTracks.length > 0 && (
        <div style={{ paddingTop: 48 }}>
          <RecentFeed tracks={recentTracks} />
        </div>
      )}

      {configured && (
        <TopCardsSection items={topTracks} label="top tracks" period={trackPeriod} onPeriodChange={setTrackPeriod} />
      )}

      {configured && (
        <TopCardsSection items={topArtists} label="top artists" period={artistPeriod} onPeriodChange={setArtistPeriod} />
      )}

      {/* Curated */}
      <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 48, paddingBottom: 80, borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: configured ? 8 : 0 }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-2)', border: '1px solid var(--border-pill)', borderRadius: 999, padding: '6px 16px', marginBottom: 20 }}>✦ curated</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--fg-1)', marginBottom: 24 }}>
            hand-picked.<br /><span style={{ color: 'rgba(255,255,255,0.3)' }}>playlists with notes.</span>
          </h2>
          {allCategories.length > 1 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {allCategories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ fontSize: 'var(--text-xs)', fontWeight: 400, letterSpacing: '0.06em', textTransform: 'lowercase', padding: '5px 14px', borderRadius: 999, border: `0.5px solid ${activeCategory === cat ? 'rgba(194,24,91,0.6)' : 'rgba(255,255,255,0.15)'}`, background: activeCategory === cat ? 'rgba(194,24,91,0.08)' : 'transparent', color: activeCategory === cat ? 'rgba(194,24,91,0.9)' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.25s ease' }}>{cat}</button>
              ))}
            </div>
          )}
        </div>
        {filteredPlaylists.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--text-md)', paddingTop: 40 }}>no playlists yet.</p>
        ) : (
          <div onMouseLeave={() => setHoveredIdx(null)}>
            {filteredPlaylists.map((item, i) => (
              <div key={item._id} onMouseEnter={() => setHoveredIdx(i)}>
                <PlaylistRow item={item} index={i} dimmed={hoveredIdx !== null && hoveredIdx !== i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
