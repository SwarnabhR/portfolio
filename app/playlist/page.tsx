import { createClient } from 'next-sanity'
import PlaylistClient from './PlaylistClient'

export const metadata = {
  title: 'Playlist',
  description: 'Curated playlists and live listening log by S. Roy — every scrobble from last.fm.',
  openGraph: {
    title: 'Playlist — S. Roy',
    description: 'Curated playlists and live listening log by S. Roy — every scrobble from last.fm.',
  },
}

const client = createClient({
  projectId: 'dch96v4a',
  dataset: 'production',
  apiVersion: '2026-04-24',
  useCdn: true,
})

export type PlaylistItem = {
  _id: string
  title: string
  slug: string
  description: string | null
  platform: 'youtube' | 'spotify'
  youtubePlaylistId: string | null
  spotifyPlaylistId: string | null
  trackCount: string | null
  category: string | null
  thumbnail: {
    asset: { url: string; metadata: { dimensions: { width: number; height: number } } | null }
    alt?: string
  } | null
}

async function getPlaylists(): Promise<PlaylistItem[]> {
  return client.fetch(
    `*[_type == "playlist"] | order(_createdAt desc) {
      _id, title,
      "slug": slug.current,
      description, platform,
      youtubePlaylistId, spotifyPlaylistId,
      trackCount, category,
      thumbnail { asset->{ url, metadata { dimensions { width, height } } }, alt }
    }`
  )
}

export default async function PlaylistPage() {
  const playlists = await getPlaylists()
  return <PlaylistClient playlists={playlists} />
}
