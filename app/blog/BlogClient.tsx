'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'
import type { BlogPost } from './page'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.')
}

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const { ref, isVisible } = useReveal<HTMLAnchorElement>({ threshold: 0.05 })
  const [hovered, setHovered] = useState(false)

  const meta = [
    post.publishedAt ? formatDate(post.publishedAt) : null,
    post.tags?.[0] ?? null,
    post.readTime ?? null,
  ].filter(Boolean).join(' · ')

  return (
    <Link
      ref={ref}
      href={`/blog/${post.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.65s ease ${index * 70}ms, transform 0.65s ease ${index * 70}ms`,
        textDecoration: 'none',
      }}
    >
      {/* Cover image */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '62.5%',
        overflow: 'hidden',
        background: 'var(--bg-card)',
      }}>
        {post.coverImage?.asset?.url ? (
          <Image
            src={post.coverImage.asset.url}
            alt={post.coverImage.alt ?? post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{
              objectFit: 'cover',
              filter: hovered ? 'brightness(0.6)' : 'brightness(0.85)',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition: 'filter 0.5s ease, transform 0.6s ease',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, #0a0408, #150d10, #100810)',
            filter: hovered ? 'brightness(0.6)' : 'brightness(1)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'filter 0.5s ease, transform 0.6s ease',
          }} />
        )}

        {hovered && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 10, color: '#fff', letterSpacing: '0.12em', textTransform: 'uppercase',
            border: '0.5px solid rgba(255,255,255,0.55)', padding: '5px 14px',
            zIndex: 1,
          }}>
            read
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ paddingTop: 16, paddingBottom: 24 }}>
        {meta && (
          <p style={{
            fontSize: 'var(--text-xs)', fontWeight: 300,
            color: 'rgba(255,255,255,0.35)', marginBottom: 10,
            letterSpacing: '0.02em',
          }}>
            {meta}
          </p>
        )}

        <h2 style={{
          fontSize: 'var(--text-md)', fontWeight: 400,
          color: 'var(--fg-1)', lineHeight: 1.3,
          letterSpacing: '-0.02em', marginBottom: 8,
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          transition: 'transform 0.3s ease',
        }}>
          {post.title}
        </h2>

        {post.excerpt && (
          <p style={{
            fontSize: 'var(--text-sm)', fontWeight: 300,
            color: 'rgba(255,255,255,0.4)', lineHeight: 1.6,
            marginBottom: 12,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {post.excerpt}
          </p>
        )}

        <span style={{
          fontSize: 'var(--text-xs)', fontWeight: 300,
          color: hovered ? 'rgba(194,24,91,0.9)' : 'rgba(255,255,255,0.35)',
          letterSpacing: '0.06em',
          transition: 'color 0.3s ease',
        }}>
          read ↗
        </span>
      </div>
    </Link>
  )
}

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  const { ref: headRef, isVisible: headVisible } = useReveal()
  const [activeTag, setActiveTag] = useState('all')

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    posts.forEach(p => p.tags?.forEach(t => tags.add(t)))
    return ['all', ...Array.from(tags)]
  }, [posts])

  const filtered = useMemo(() => {
    if (activeTag === 'all') return posts
    return posts.filter(p => p.tags?.includes(activeTag))
  }, [posts, activeTag])

  return (
    <section
      style={{
        background: 'var(--bg)',
        minHeight: '100dvh',
        paddingTop: 80,
      }}
    >
      {/* Header */}
      <div
        ref={headRef}
        className="max-w-6xl mx-auto px-6"
        style={{ paddingTop: 48, paddingBottom: 0 }}
      >
        {/* Pill label */}
        <div style={{
          opacity: headVisible ? 1 : 0,
          transform: headVisible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
          marginBottom: 20,
        }}>
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 'var(--text-xs)', fontWeight: 400,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--fg-2)',
              border: '1px solid var(--border-pill)', borderRadius: 999,
              padding: '6px 16px',
            }}
          >
            ✦ journal
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: 'clamp(36px, 8vw, 100px)',
            fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.0,
            color: 'var(--fg-1)', marginBottom: 16,
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 60ms, transform 0.6s ease 60ms',
          }}
        >
          Notes & Essays.
        </h1>

        <p style={{
          fontSize: 'var(--text-md)', fontWeight: 300,
          color: 'rgba(255,255,255,0.4)', maxWidth: 440, lineHeight: 1.65,
          marginBottom: 40,
          opacity: headVisible ? 1 : 0,
          transform: headVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease 120ms, transform 0.6s ease 120ms',
        }}>
          thoughts on ml engineering, quant research, and market microstructure.
        </p>

        {/* Filter tabs */}
        {allTags.length > 1 && (
          <div style={{
            display: 'flex', gap: 8, flexWrap: 'wrap',
            marginBottom: 48,
            opacity: headVisible ? 1 : 0,
            transition: 'opacity 0.6s ease 180ms',
          }}>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  fontSize: 'var(--text-xs)', fontWeight: 400,
                  letterSpacing: '0.06em', textTransform: 'lowercase',
                  padding: '5px 14px', borderRadius: 999,
                  border: `0.5px solid ${activeTag === tag ? 'rgba(194,24,91,0.6)' : 'rgba(255,255,255,0.15)'}`,
                  background: activeTag === tag ? 'rgba(194,24,91,0.08)' : 'transparent',
                  color: activeTag === tag ? 'rgba(194,24,91,0.9)' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      <div
        className="max-w-6xl mx-auto px-6"
        style={{ paddingBottom: 80 }}
      >
        {filtered.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--text-md)', paddingTop: 40 }}>
            no posts yet.
          </p>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
            gap: '2px',
            background: 'rgba(255,255,255,0.03)',
          }}>
            {filtered.map((post, i) => (
              <div key={post._id} style={{ background: 'var(--bg)', padding: '24px 20px 0' }}>
                <BlogCard post={post} index={i} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
