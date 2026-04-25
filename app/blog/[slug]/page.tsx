import { createClient } from 'next-sanity'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const client = createClient({
  projectId: 'dch96v4a',
  dataset: 'production',
  apiVersion: '2026-04-24',
  useCdn: true,
})

type Post = {
  _id: string
  title: string
  slug: string
  excerpt: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[] | null
  tags: string[] | null
  readTime: string | null
  publishedAt: string
  coverImage: { asset: { url: string }; alt?: string } | null
}

type NextPost = { title: string; slug: string }

async function getPost(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "blog" && slug.current == $slug][0] {
      _id, title,
      "slug": slug.current,
      excerpt, content, tags, readTime, publishedAt,
      coverImage { asset->{ url }, alt }
    }`,
    { slug }
  )
}

async function getNextPost(publishedAt: string): Promise<NextPost | null> {
  return client.fetch(
    `*[_type == "blog" && publishedAt < $publishedAt] | order(publishedAt desc)[0] {
      title, "slug": slug.current
    }`,
    { publishedAt }
  )
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(
    `*[_type == "blog"] { "slug": slug.current }`
  )
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  }).replace(/\//g, '.')
}

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p style={{
        fontSize: 'var(--text-md)', fontWeight: 300, color: 'rgba(255,255,255,0.75)',
        lineHeight: 1.8, marginBottom: 24,
      }}>{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 style={{
        fontSize: 'var(--text-lg)', fontWeight: 400, color: 'var(--fg-1)',
        letterSpacing: '-0.02em', lineHeight: 1.3,
        marginTop: 48, marginBottom: 20,
      }}>{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 style={{
        fontSize: 'var(--text-md)', fontWeight: 400, color: 'var(--fg-1)',
        letterSpacing: '-0.01em', lineHeight: 1.3,
        marginTop: 36, marginBottom: 16,
      }}>{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote style={{
        borderLeft: '2px solid rgba(194,24,91,0.5)',
        paddingLeft: 24, marginLeft: 0, marginRight: 0,
        marginTop: 32, marginBottom: 32,
        color: 'rgba(255,255,255,0.55)',
        fontSize: 'var(--text-md)', fontStyle: 'italic', lineHeight: 1.7,
      }}>{children}</blockquote>
    ),
  },
  types: {
    image: ({ value }: { value: { asset?: { url: string }; alt?: string } }) => {
      if (!value.asset?.url) return null
      return (
        <div style={{ marginTop: 32, marginBottom: 32 }}>
          <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
            <Image
              src={value.asset.url}
              alt={value.alt ?? ''}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 660px"
            />
          </div>
          {value.alt && (
            <p style={{
              fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.25)',
              marginTop: 8, textAlign: 'center',
            }}>{value.alt}</p>
          )}
        </div>
      )
    },
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong style={{ fontWeight: 600, color: 'var(--fg-1)' }}>{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em style={{ fontStyle: 'italic' }}>{children}</em>
    ),
    code: ({ children }: { children?: React.ReactNode }) => (
      <code style={{
        fontFamily: 'monospace', fontSize: '0.9em',
        background: 'rgba(255,255,255,0.06)', padding: '2px 6px',
        borderRadius: 3, color: 'rgba(255,255,255,0.85)',
      }}>{children}</code>
    ),
    link: ({ value, children }: { value?: { href: string }; children?: React.ReactNode }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'rgba(194,24,91,0.9)', textDecoration: 'underline' }}
      >{children}</a>
    ),
  },
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [post, nextPost] = await Promise.all([
    getPost(slug),
    getPost(slug).then(p => p ? getNextPost(p.publishedAt) : null),
  ])

  if (!post) notFound()

  const meta = [
    post.publishedAt ? formatDate(post.publishedAt) : null,
    post.tags?.[0] ?? null,
    post.readTime ? `${post.readTime} read` : null,
  ].filter(Boolean).join(' · ')

  return (
    <article style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: 80 }}>

      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 32 }}>
        <Link
          href="/blog"
          style={{
            fontSize: 'var(--text-xs)', fontWeight: 300,
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.06em', textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          ← back to journal
        </Link>
      </div>

      {/* Meta + Title */}
      <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 24, paddingBottom: 40 }}>
        {meta && (
          <p style={{
            fontSize: 'var(--text-xs)', fontWeight: 300,
            color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em',
            marginBottom: 16,
          }}>{meta}</p>
        )}

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 80px)',
          fontWeight: 400, color: 'var(--fg-1)',
          letterSpacing: '-0.03em', lineHeight: 1.05,
          maxWidth: '14ch', marginBottom: 16,
        }}>
          {post.title}
        </h1>

        {post.excerpt && (
          <p style={{
            fontSize: 'var(--text-md)', fontWeight: 300,
            color: 'rgba(255,255,255,0.4)', maxWidth: 560,
            lineHeight: 1.65,
          }}>
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Cover image — full-bleed within max-w */}
      {post.coverImage?.asset?.url && (
        <div className="max-w-6xl mx-auto">
          <div style={{ position: 'relative', width: '100%', paddingBottom: '50%' }}>
            <Image
              src={post.coverImage.asset.url}
              alt={post.coverImage.alt ?? post.title}
              fill
              priority
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 1152px) 100vw, 1152px"
            />
          </div>
        </div>
      )}

      {/* Body */}
      {post.content && post.content.length > 0 && (
        <div
          style={{
            maxWidth: 660, margin: '0 auto',
            padding: '48px 24px 80px',
          }}
        >
          <PortableText value={post.content} components={ptComponents} />
        </div>
      )}

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ height: 1, background: 'var(--border)' }} />
      </div>

      {/* Next post */}
      <div className="max-w-6xl mx-auto px-6" style={{ paddingTop: 32, paddingBottom: 80 }}>
        {nextPost ? (
          <div>
            <p style={{
              fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
            }}>
              next up
            </p>
            <Link
              href={`/blog/${nextPost.slug}`}
              style={{
                fontSize: 'var(--text-md)', fontWeight: 300,
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              {nextPost.title} ↗
            </Link>
          </div>
        ) : (
          <Link
            href="/blog"
            style={{
              fontSize: 'var(--text-sm)', fontWeight: 300,
              color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
          >
            ← all posts
          </Link>
        )}
      </div>
    </article>
  )
}
