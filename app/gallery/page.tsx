import { createClient } from 'next-sanity'
import GalleryClient from './GalleryClient'

export const metadata = {
  title: 'Gallery',
  description: 'Visual archive by S. Roy — photography and in-between moments.',
  openGraph: {
    title: 'Gallery — S. Roy',
    description: 'Visual archive by S. Roy — photography and in-between moments.',
  },
}

const client = createClient({
  projectId: 'dch96v4a',
  dataset: 'production',
  apiVersion: '2026-04-24',
  useCdn: true,
})

export type GalleryItem = {
  _id: string
  title: string
  slug: string
  description: string | null
  category: string | null
  image: {
    asset: {
      url: string
      metadata: { dimensions: { width: number; height: number } } | null
    }
    alt?: string
  } | null
}

async function getItems(): Promise<GalleryItem[]> {
  return client.fetch(
    `*[_type == "gallery"] | order(_createdAt desc) {
      _id, title,
      "slug": slug.current,
      description, category,
      image { asset->{ url, metadata { dimensions { width, height } } }, alt }
    }`
  )
}

export default async function GalleryPage() {
  const items = await getItems()
  return <GalleryClient items={items} />
}
