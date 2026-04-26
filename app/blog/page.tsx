import { createClient } from 'next-sanity'
import BlogClient from './BlogClient'

export const metadata = {
  title: 'Blog',
  description: 'Notes, essays, and case studies on quant research, market microstructure, and ML engineering.',
  openGraph: {
    title: 'Blog — S. Roy',
    description: 'Notes, essays, and case studies on quant research, market microstructure, and ML engineering.',
  },
}

const client = createClient({
  projectId: 'dch96v4a',
  dataset: 'production',
  apiVersion: '2026-04-24',
  useCdn: true,
})

export type BlogPost = {
  _id: string
  title: string
  slug: string
  excerpt: string | null
  tags: string[] | null
  readTime: string | null
  featured: boolean
  publishedAt: string
  coverImage: { asset: { url: string }; alt?: string } | null
}

async function getPosts(): Promise<BlogPost[]> {
  return client.fetch(
    `*[_type == "blog"] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      tags,
      readTime,
      featured,
      publishedAt,
      coverImage { asset->{ url }, alt }
    }`
  )
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <BlogClient posts={posts} />
}
