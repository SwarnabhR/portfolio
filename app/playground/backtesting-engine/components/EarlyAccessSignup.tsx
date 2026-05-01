'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface FormData {
  email: string
  error: string
}

export function EarlyAccessSignup() {
  const { ref, isVisible } = useReveal({ threshold: 0.2 })
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState<FormData>({ email: '', error: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setForm(prev => ({ ...prev, error: '' }))

    if (!form.email.trim()) {
      setForm(prev => ({ ...prev, error: 'Email is required' }))
      return
    }

    setState('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      })

      const data = await res.json()

      if (res.ok) {
        setState('success')
        setForm({ email: '', error: '' })
      } else {
        setState('error')
        setForm(prev => ({ ...prev, error: data.error || 'Failed to sign up' }))
      }
    } catch {
      setState('error')
      setForm(prev => ({ ...prev, error: 'Network error. Please try again.' }))
    }
  }

  return (
    <section
      ref={ref}
      id="early-access"
      style={{
        position: 'relative',
        padding: '80px 20px',
        marginTop: 80,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 700ms ease, transform 700ms ease',
      }}
    >
      {/* Atmospheric accent blob — top right */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '600px',
          height: '600px',
          background: `radial-gradient(ellipse 40% 50% at 80% 30%, rgba(var(--accent-rgb), 0.15) 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 600,
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Section label pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
            color: 'var(--fg-1)',
            border: '1px solid var(--border-pill)',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 14px',
            background: 'rgba(255, 255, 255, 0.04)',
            marginBottom: 24,
          }}
        >
          <span>✦</span>
          <span>early access</span>
        </div>

        {/* Heading */}
        <h2
          style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 300,
            letterSpacing: '-0.03em',
            color: 'var(--fg-1)',
            marginBottom: 16,
            lineHeight: 1.2,
          }}
        >
          Get the full engine.
        </h2>

        {/* Success state */}
        {state === 'success' && (
          <p
            style={{
              fontSize: 14,
              color: 'var(--fg-2)',
              lineHeight: 1.65,
            }}
          >
            ✓ You&apos;re on the list. We&apos;ll reach out when it launches.
          </p>
        )}

        {/* Form state */}
        {state !== 'success' && (
          <>
            {/* Subtext with features */}
            <p
              style={{
                fontSize: 14,
                color: 'var(--fg-3)',
                maxWidth: 480,
                lineHeight: 1.65,
                marginBottom: 28,
              }}
            >
              more exchanges · live market data · portfolio-level backtesting · custom alerts · strategy marketplace · API access
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Email input */}
              <input
                type="email"
                placeholder="your email"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                disabled={state === 'loading'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `0.5px solid var(--border-input)`,
                  color: 'var(--fg-1)',
                  fontSize: 16,
                  fontFamily: 'Manrope, system-ui, sans-serif',
                  padding: '12px 0',
                  outline: 'none',
                  transition: 'border-color 0.3s, filter 0.3s',
                  opacity: state === 'loading' ? 0.5 : 1,
                  filter: state === 'loading' ? 'blur(0.4px)' : 'none',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderBottomColor = 'rgba(var(--accent-rgb), 0.6)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderBottomColor = 'var(--border-input)'
                }}
              />

              {/* Error message */}
              {form.error && (
                <p
                  style={{
                    fontSize: 12,
                    color: 'rgba(239,68,68,0.85)',
                    marginTop: 4,
                  }}
                >
                  {form.error}
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={state === 'loading'}
                style={{
                  alignSelf: 'flex-start',
                  position: 'relative',
                  marginTop: 8,
                  padding: '12px 28px',
                  fontSize: 13,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 400,
                  color: 'var(--fg-1)',
                  background: 'transparent',
                  border: `0.5px solid rgba(255,255,255,0.18)`,
                  borderRadius: 4,
                  cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  overflow: 'hidden',
                  opacity: state === 'loading' ? 0.6 : 1,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(160,96,255,0.4)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `
                    0 0 18px rgba(80,0,160,0.35),
                    inset 0 0 12px rgba(60,0,100,0.15)
                  `
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                {state === 'loading' && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.15)',
                      borderTopColor: 'rgba(160,96,255,0.8)',
                      animation: 'btSpin 0.7s linear infinite',
                      marginRight: 8,
                      verticalAlign: 'middle',
                    }}
                  />
                )}
                {state === 'loading' ? 'Signing up…' : 'notify me ↗'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
