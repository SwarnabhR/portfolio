'use client'

import { useState, useEffect, useRef } from 'react'
import { useReveal } from '@/hooks/useReveal'

type Comment = { _id: string; name: string; message: string; createdAt: string }

function timeAgo(iso: string) {
  const diff  = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return 'just now'
  if (mins  < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days  < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function initials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function CommentRow({
  comment,
  index,
  dimmed,
  isAdmin,
  onEnter,
  onLeave,
  onDelete,
}: {
  comment: Comment
  index: number
  dimmed: boolean
  isAdmin: boolean
  onEnter: () => void
  onLeave: () => void
  onDelete: (id: string) => void
}) {
  const { ref, isVisible } = useReveal<HTMLDivElement>()
  const [hovered, setHovered] = useState(false)
  const [deleting, setDeleting] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => { setHovered(true); onEnter() }}
      onMouseLeave={() => { setHovered(false); onLeave() }}
      style={{
        display: 'grid',
        gridTemplateColumns: '48px 36px 1fr auto auto',
        gap: '20px',
        alignItems: 'start',
        padding: '20px 0',
        borderBottom: '1px solid var(--border)',
        cursor: 'default',
        opacity: !isVisible ? 0 : dimmed ? 0.25 : 1,
        filter: dimmed ? 'blur(3px)' : 'none',
        transform: !isVisible
          ? 'translateY(16px)'
          : hovered ? 'translateX(-6px)' : 'translateX(0)',
        transition: `opacity 0.5s ease ${index * 60}ms, filter 0.25s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)`,
      }}
    >
      {/* Index */}
      <span style={{
        fontFamily: 'var(--font-mono, ui-monospace)',
        fontSize: 'var(--text-sm)',
        color: 'var(--fg-3)',
        paddingTop: 2,
        letterSpacing: '0.04em',
      }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Avatar */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 32, height: 32, borderRadius: '50%',
        border: '1px solid var(--border-pill)',
        fontSize: 'var(--text-xs)', color: 'var(--fg-3)',
        fontWeight: 400, letterSpacing: '0.06em',
        flexShrink: 0,
      }}>
        {initials(comment.name)}
      </span>

      {/* Main content */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--fg-1)',
          }}>
            {comment.name}
          </span>
        </div>
        <p style={{
          fontSize: 'var(--text-sm)', fontWeight: 300,
          color: 'var(--fg-2)', lineHeight: 1.6,
          marginTop: 6,
          maxHeight: hovered ? 200 : 44,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease, opacity 0.3s ease',
          opacity: hovered ? 1 : 0.75,
          wordBreak: 'break-word',
        }}>
          {comment.message}
        </p>
      </div>

      {/* Date */}
      <span style={{
        fontFamily: 'var(--font-mono, ui-monospace)',
        fontSize: 'var(--text-xs)',
        color: 'var(--fg-3)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        paddingTop: 4,
      }}>
        {timeAgo(comment.createdAt)}
      </span>

      {/* Arrow / delete */}
      <div style={{ paddingTop: 4, textAlign: 'right', minWidth: 40 }}>
        {isAdmin ? (
          <button
            onClick={() => { setDeleting(true); onDelete(comment._id) }}
            disabled={deleting}
            style={{
              fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'rgba(194,24,91,0.45)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'color 0.2s',
              opacity: deleting ? 0.3 : 1,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(194,24,91,0.9)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(194,24,91,0.45)')}
          >
            {deleting ? '…' : 'del'}
          </button>
        ) : (
          <span style={{
            color: hovered ? 'rgba(160,96,255,0.9)' : 'var(--fg-3)',
            fontSize: 14,
            transition: 'color 0.3s, transform 0.3s',
            display: 'inline-block',
            transform: hovered ? 'translate(2px,-2px)' : 'translate(0,0)',
          }}>↗</span>
        )}
      </div>
    </div>
  )
}

export default function CommentsSection() {
  const { ref: headRef, isVisible: headVisible } = useReveal()
  const [comments, setComments]         = useState<Comment[]>([])
  const [loading, setLoading]           = useState(true)
  const [hoveredId, setHoveredId]       = useState<string | null>(null)
  const [form, setForm]                 = useState({ name: '', message: '' })
  const [submitting, setSubmitting]     = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle'|'sent'|'error'>('idle')
  const [isAdmin, setIsAdmin]           = useState(false)
  const [showAdminInput, setShowAdminInput] = useState(false)
  const [adminPassword, setAdminPassword]   = useState('')
  const [adminError, setAdminError]         = useState(false)
  const adminInputRef = useRef<HTMLInputElement>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/comments')
      .then(r => r.json())
      .then(data => { setComments(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const newComment = await res.json()
        setComments(prev => [newComment, ...prev])
        setForm({ name: '', message: '' })
        setSubmitStatus('sent')
        setTimeout(() => setSubmitStatus('idle'), 3000)
      } else {
        setSubmitStatus('error')
        setTimeout(() => setSubmitStatus('idle'), 3000)
      }
    } catch {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAdminLogin() {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { authorization: `Bearer ${adminPassword}` },
    })
    if (res.ok) {
      setIsAdmin(true); setShowAdminInput(false); setAdminError(false)
    } else {
      setAdminError(true)
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${adminPassword}` },
    })
    if (res.ok) setComments(prev => prev.filter(c => c._id !== id))
  }

  const anyHover = hoveredId !== null

  return (
    <section style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>

      {/* Decorative bg word */}
      <span aria-hidden="true" style={{
        position: 'absolute', bottom: '-0.05em', right: '-0.02em',
        fontSize: 'var(--text-bg-word)', fontWeight: 300,
        letterSpacing: '-0.03em', lineHeight: 1,
        color: 'var(--fg-1)', opacity: 0.03,
        whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
      }}>
        Comments
      </span>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px 96px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div
          ref={headRef}
          style={{
            marginBottom: 56,
            opacity: headVisible ? 1 : 0,
            transform: headVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 'var(--text-xs)', letterSpacing: '0.10em',
            textTransform: 'uppercase', color: 'var(--fg-1)',
            border: '1px solid var(--border-pill)', borderRadius: 999,
            padding: '6px 14px', marginBottom: 24,
            background: 'rgba(255,255,255,0.02)',
          }}>
            ✦ Comments
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1,
            color: 'var(--fg-1)',
          }}>
            leave a note.
          </h2>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '48px 36px 1fr auto auto',
          gap: '20px',
          padding: '10px 0',
          borderBottom: '1px solid var(--border)',
          fontSize: 'var(--text-xs)', letterSpacing: '0.10em',
          textTransform: 'uppercase', color: 'var(--fg-3)',
        }}>
          <span>#</span>
          <span />
          <span>name / message</span>
          <span>when</span>
          <span />
        </div>

        {/* Comment list */}
        <div style={{ marginBottom: 64 }}
          onMouseLeave={() => setHoveredId(null)}
        >
          {loading ? (
            <p style={{ padding: '32px 0', color: 'var(--fg-3)', fontSize: 'var(--text-sm)' }}>loading…</p>
          ) : comments.length === 0 ? (
            <p style={{ padding: '32px 0', color: 'var(--fg-3)', fontSize: 'var(--text-sm)' }}>
              no comments yet — be the first.
            </p>
          ) : (
            comments.map((c, i) => (
              <CommentRow
                key={c._id}
                comment={c}
                index={i}
                dimmed={anyHover && hoveredId !== c._id}
                isAdmin={isAdmin}
                onEnter={() => setHoveredId(c._id)}
                onLeave={() => {}}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Form */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 48,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
        }}
          className="comment-form-grid"
        >
          <div>
            <p style={{
              fontSize: 'clamp(18px, 2.5vw, 28px)',
              fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.2,
              color: 'var(--fg-1)', marginBottom: 8,
            }}>
              say something.
            </p>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-3)', fontWeight: 300 }}>
              your comment appears instantly.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Name */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px',
              border: `0.5px solid ${focusedField === 'name' ? 'rgba(160,60,255,0.45)' : 'var(--border)'}`,
              borderRadius: 4,
              background: focusedField === 'name' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
              transition: 'border-color 0.25s, background 0.25s',
            }}>
              <span style={{ color: 'var(--fg-3)', fontSize: 13 }}>✦</span>
              <input
                type="text"
                placeholder="your name"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                required maxLength={60}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: 'var(--fg-1)', fontSize: 'var(--text-base)', fontWeight: 300,
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Message */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 14px',
              border: `0.5px solid ${focusedField === 'message' ? 'rgba(160,60,255,0.45)' : 'var(--border)'}`,
              borderRadius: 4,
              background: focusedField === 'message' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
              transition: 'border-color 0.25s, background 0.25s',
            }}>
              <span style={{ color: 'var(--fg-3)', fontSize: 13, paddingTop: 2 }}>✦</span>
              <textarea
                placeholder="your message…"
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                required maxLength={1000} rows={4}
                style={{
                  flex: 1, background: 'none', border: 'none', outline: 'none',
                  color: 'var(--fg-1)', fontSize: 'var(--text-base)', fontWeight: 300,
                  fontFamily: 'inherit', resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 'var(--text-xs)', letterSpacing: '0.10em',
                  textTransform: 'uppercase', color: 'var(--fg-2)',
                  border: '0.5px solid var(--border-cta)', borderRadius: 3,
                  padding: '8px 14px', background: 'transparent',
                  cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'color 0.3s, border-color 0.3s',
                  opacity: submitting ? 0.4 : 1,
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--fg-1)'; e.currentTarget.style.borderColor = 'rgba(160,60,255,0.45)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg-2)'; e.currentTarget.style.borderColor = 'var(--border-cta)' }}
              >
                {submitting ? 'posting…' : submitStatus === 'sent' ? 'posted ✓' : submitStatus === 'error' ? 'try again' : 'post comment ↗'}
              </button>

              {/* Admin */}
              {isAdmin ? (
                <button
                  onClick={() => { setIsAdmin(false); setAdminPassword('') }}
                  style={{
                    fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
                    color: 'rgba(194,24,91,0.5)', background: 'none',
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(194,24,91,0.85)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(194,24,91,0.5)')}
                >
                  exit admin
                </button>
              ) : showAdminInput ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    ref={adminInputRef}
                    type="password"
                    placeholder="password"
                    value={adminPassword}
                    onChange={e => { setAdminPassword(e.target.value); setAdminError(false) }}
                    onKeyDown={e => { if (e.key === 'Enter') handleAdminLogin(); if (e.key === 'Escape') { setShowAdminInput(false); setAdminPassword('') } }}
                    autoFocus
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: `0.5px solid ${adminError ? 'rgba(194,24,91,0.5)' : 'var(--border)'}`,
                      borderRadius: 3, outline: 'none',
                      color: 'var(--fg-1)', fontSize: 'var(--text-xs)',
                      fontFamily: 'ui-monospace, monospace',
                      padding: '6px 10px', width: 120,
                      letterSpacing: '0.06em',
                    }}
                  />
                  <button
                    onClick={handleAdminLogin}
                    style={{
                      fontSize: 'var(--text-xs)', letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: 'var(--fg-3)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >ok</button>
                  <button
                    onClick={() => { setShowAdminInput(false); setAdminPassword(''); setAdminError(false) }}
                    style={{
                      fontSize: 'var(--text-xs)', color: 'var(--fg-3)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >✕</button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAdminInput(true)}
                  style={{
                    fontSize: 10, color: 'rgba(255,255,255,0.08)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.08)')}
                >·</button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .comment-form-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 560px) {
          .comment-form-grid > div:first-child { display: none; }
        }
      `}</style>
    </section>
  )
}
