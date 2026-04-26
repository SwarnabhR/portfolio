'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'
import type { GalleryItem } from './page'

function GalleryTile({ item, index, onClick }: {
  item: GalleryItem
  index: number
  onClick: () => void
}) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.05 })
  const [hovered, setHovered] = useState(false)

  const w = item.image?.asset?.metadata?.dimensions?.width ?? 800
  const h = item.image?.asset?.metadata?.dimensions?.height ?? 600

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        breakInside: 'avoid',
        marginBottom: 2,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${index * 50}ms, transform 0.6s ease ${index * 50}ms`,
      }}
    >
      {item.image?.asset?.url ? (
        <Image
          src={item.image.asset.url}
          alt={item.image.alt ?? item.title}
          width={w}
          height={h}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            filter: hovered ? 'brightness(0.55)' : 'brightness(0.92)',
            transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1), filter 0.4s ease',
          }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div style={{
          width: '100%',
          aspectRatio: '4/3',
          background: 'linear-gradient(160deg, #0a0408, #150d10, #100810)',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.65s ease',
        }} />
      )}

      <div style={{
        position: 'absolute', inset: 0,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.35s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 16,
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{
            fontSize: 10, color: '#fff',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            border: '0.5px solid rgba(255,255,255,0.55)',
            padding: '5px 14px',
          }}>view</span>
        </div>
        <div>
          {item.category && (
            <p style={{
              fontSize: 'var(--text-xs)', fontWeight: 300,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              marginBottom: 4,
            }}>{item.category}</p>
          )}
          <h3 style={{
            fontSize: 'var(--text-sm)', fontWeight: 400,
            color: 'var(--fg-1)', letterSpacing: '-0.01em',
          }}>{item.title}</h3>
        </div>
      </div>
    </div>
  )
}

function Lightbox({ items, index, onClose, onPrev, onNext }: {
  items: GalleryItem[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const item = items[index]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  if (!item) return null

  const w = item.image?.asset?.metadata?.dimensions?.width ?? 1200
  const h = item.image?.asset?.metadata?.dimensions?.height ?? 800

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(2,2,2,0.94)',
        backdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(56px, 8vw, 80px) clamp(16px, 6vw, 80px) clamp(72px, 10vw, 120px)',
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          position: 'absolute', top: 24, right: 32,
          fontSize: 44, lineHeight: 1,
          color: 'rgba(255,255,255,0.35)',
          background: 'none', border: 'none', cursor: 'pointer',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg-1)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
      >×</button>

      {/* Image */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: 'min(92vw, 1100px)', width: '100%' }}
      >
        {item.image?.asset?.url ? (
          <Image
            src={item.image.asset.url}
            alt={item.image.alt ?? item.title}
            width={w}
            height={h}
            style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain', display: 'block' }}
            sizes="80vw"
            priority
          />
        ) : (
          <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(160deg,#0a0408,#150d10,#100810)' }} />
        )}
      </div>

      {/* Meta */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', bottom: 32,
          left: '50%', transform: 'translateX(-50%)',
          textAlign: 'center', maxWidth: 560,
          padding: '0 24px',
        }}
      >
        <h2 style={{
          fontSize: 'var(--text-md)', fontWeight: 400,
          color: 'var(--fg-1)', letterSpacing: '-0.01em', marginBottom: 6,
        }}>{item.title}</h2>
        {item.description && (
          <p style={{
            fontSize: 'var(--text-sm)', fontWeight: 300,
            color: 'rgba(255,255,255,0.4)',
          }}>{item.description}</p>
        )}
        <p style={{
          fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.18)',
          marginTop: 10, letterSpacing: '0.08em',
        }}>{index + 1} / {items.length}</p>
      </div>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={e => { e.stopPropagation(); onPrev() }}
          aria-label="Previous photo"
          style={{
            position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
            width: 48, height: 48, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.02)',
            color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(160,60,255,0.5)'; e.currentTarget.style.color = 'var(--fg-1)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
        >←</button>
      )}

      {/* Next */}
      {index < items.length - 1 && (
        <button
          onClick={e => { e.stopPropagation(); onNext() }}
          aria-label="Next photo"
          style={{
            position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
            width: 48, height: 48, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.02)',
            color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(160,60,255,0.5)'; e.currentTarget.style.color = 'var(--fg-1)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
        >→</button>
      )}
    </div>
  )
}

export default function GalleryClient({ items }: { items: GalleryItem[] }) {
  const { ref: headRef, isVisible: headVisible } = useReveal()
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const allCategories = useMemo(() => {
    const cats = new Set<string>()
    items.forEach(item => { if (item.category) cats.add(item.category) })
    return ['all', ...Array.from(cats)]
  }, [items])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return items
    return items.filter(item => item.category === activeCategory)
  }, [items, activeCategory])

  const openLightbox = useCallback((i: number) => {
    setLightboxIndex(i)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }, [])

  const prevPhoto = useCallback(() => {
    setLightboxIndex(i => (i !== null && i > 0 ? i - 1 : i))
  }, [])

  const nextPhoto = useCallback(() => {
    setLightboxIndex(i => (i !== null && i < filtered.length - 1 ? i + 1 : i))
  }, [filtered.length])

  useEffect(() => () => { document.body.style.overflow = '' }, [])

  return (
    <>
      <section style={{ background: 'var(--bg)', minHeight: '100dvh', paddingTop: 80 }}>
        {/* Page-wide animated gradient orbs */}
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 60% 55% at 70% 0%, rgba(88,0,180,0.4) 0%, transparent 70%)',
          animation: 'gOrbPulse 12s ease-in-out infinite alternate' }} />
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 40% 45% at 10% 75%, rgba(194,24,91,0.2) 0%, transparent 65%)',
          animation: 'gOrbDrift 18s ease-in-out infinite alternate' }} />
        <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 30% 35% at 50% 50%, rgba(0,30,100,0.2) 0%, transparent 60%)',
          animation: 'gOrbDrift 24s ease-in-out infinite alternate-reverse' }} />
        <style>{`
          @keyframes gOrbPulse{0%{opacity:0.8;transform:scale(1)}100%{opacity:1;transform:scale(1.1)}}
          @keyframes gOrbDrift{0%{transform:translate(0,0) scale(1)}100%{transform:translate(8%,-6%) scale(1.15)}}
        `}</style>

        {/* Header */}
        <div
          ref={headRef}
          className="max-w-6xl mx-auto px-6"
          style={{ position: 'relative', zIndex: 1, paddingTop: 48, paddingBottom: 0 }}
        >
          <div style={{
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            marginBottom: 20,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 'var(--text-xs)', fontWeight: 400,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--fg-2)',
              border: '1px solid var(--border-pill)', borderRadius: 999,
              padding: '6px 16px',
            }}>✦ gallery</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 100px)',
            fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.0,
            color: 'var(--fg-1)', marginBottom: 16,
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease 60ms, transform 0.6s ease 60ms',
          }}>Visual Archive.</h1>

          <p style={{
            fontSize: 'var(--text-md)', fontWeight: 300,
            color: 'rgba(255,255,255,0.4)', maxWidth: 440, lineHeight: 1.65,
            marginBottom: 40,
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease 120ms, transform 0.6s ease 120ms',
          }}>frames from the in-between moments.</p>

          {/* Category filter */}
          {allCategories.length > 1 && (
            <div style={{
              display: 'flex', gap: 8, flexWrap: 'wrap',
              marginBottom: 48,
              opacity: headVisible ? 1 : 0,
              transition: 'opacity 0.6s ease 180ms',
            }}>
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    fontSize: 'var(--text-xs)', fontWeight: 400,
                    letterSpacing: '0.06em', textTransform: 'lowercase',
                    padding: '5px 14px', borderRadius: 999,
                    border: `0.5px solid ${activeCategory === cat ? 'rgba(194,24,91,0.6)' : 'rgba(255,255,255,0.15)'}`,
                    background: activeCategory === cat ? 'rgba(194,24,91,0.08)' : 'transparent',
                    color: activeCategory === cat ? 'rgba(194,24,91,0.9)' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >{cat}</button>
              ))}
            </div>
          )}
        </div>

        {/* Masonry grid */}
        <div className="max-w-6xl mx-auto px-6" style={{ position: 'relative', zIndex: 1, paddingBottom: 80 }}>
          {filtered.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--text-md)', paddingTop: 40 }}>
              no photos yet.
            </p>
          ) : (
            <div style={{ columns: '3 280px', columnGap: 2 }}>
              {filtered.map((item, i) => (
                <GalleryTile
                  key={item._id}
                  item={item}
                  index={i}
                  onClick={() => openLightbox(i)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevPhoto}
          onNext={nextPhoto}
        />
      )}
    </>
  )
}
