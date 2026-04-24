'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'
import CtaLink from '@/components/ui/CtaLink'

const FIELDS = [
  { name: 'name',    label: 'Name',    type: 'text',  placeholder: 'jane smith'       },
  { name: 'email',   label: 'Email',   type: 'email', placeholder: 'jane@example.com' },
  { name: 'message', label: 'Message', type: 'area',  placeholder: 'put me in bro'  },
]

export default function Contact() {
  const [form,        setForm       ] = useState({ name: '', email: '', message: '' })
  const [status,      setStatus     ] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [activeField, setActiveField] = useState<string | null>(null)

  const { ref: badgeRef,   isVisible: badgeVisible   } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()
  const { ref: leftRef,    isVisible: leftVisible    } = useReveal()
  const { ref: formRef,    isVisible: formVisible    } = useReveal<HTMLFormElement>({ threshold: 0.05 })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1200))
    setStatus('sent')
  }

  function inputStyle(key: string): React.CSSProperties {
    const focused = activeField === key
    const dimmed  = !!activeField && !focused && !form[key as keyof typeof form]
    return {
      width: '100%', background: 'transparent', border: 'none',
      borderBottom: `0.5px solid ${focused ? 'rgba(194,24,91,0.5)' : 'var(--color-border-gray)'}`,
      color: '#fff', fontFamily: 'inherit', fontSize: 'var(--text-md)', fontWeight: 300,
      padding: '10px 0', outline: 'none', resize: 'none' as const,
      opacity: dimmed ? 0.3 : 1,
      filter: dimmed ? 'blur(0.4px)' : 'none',
      transition: 'border-color 0.3s, opacity 0.25s, filter 0.25s',
    }
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden min-h-dvh pb-0"
      style={{
        background: `
          linear-gradient(to bottom,
            transparent 0%,
            rgba(0,0,0,0.2) 70%,
            rgba(0,0,0,0.8) 100%
          ),
          var(--gradient-contact),
          var(--bg)
        `
      }}
    >
      <style>{`
        @keyframes runGlow {
          0%   { left: -60%; }
          100% { left: 110%; }
        }
        @keyframes cBlob1 {
          0%, 100% { transform: translate(0,0) rotate(0deg) scale(1); border-radius: 40% 60% 34% 66% / 58% 42% 62% 38%; }
          33%      { transform: translate(40px, -60px) rotate(15deg) scale(1.1); border-radius: 60% 40% 52% 48% / 40% 60% 40% 60%; }
          66%      { transform: translate(-30px, -40px) rotate(-10deg) scale(0.95); border-radius: 42% 58% 55% 45% / 65% 35% 65% 35%; }
        }
        @keyframes cBlob2 {
          0%, 100% { transform: translate(0,0) rotate(0deg) scale(1); border-radius: 62% 38% 74% 26% / 52% 44% 56% 48%; }
          33%      { transform: translate(-50px, 40px) rotate(-15deg) scale(1.05); border-radius: 48% 52% 66% 34% / 44% 56% 44% 56%; }
          66%      { transform: translate(20px, -30px) rotate(10deg) scale(1.1); border-radius: 65% 35% 44% 56% / 56% 44% 66% 34%; }
        }
      `}</style>

      {/* GPU Blobs Background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          isolation: 'isolate', zIndex: 0, pointerEvents: 'none',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%)'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, filter: 'blur(100px)' }}>
          {/* Magenta/Pink Blob */}
          <div style={{
            position: 'absolute', width: 'max(80vw, 800px)', height: 'max(80vw, 800px)',
            bottom: '-30%', left: '-10%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(200, 20, 80, 0.45) 0%, rgba(120, 10, 40, 0.2) 50%, transparent 70%)',
            willChange: 'transform, border-radius', animation: 'cBlob1 12s ease-in-out infinite',
          }} />
          {/* Orange/Yellow Blob */}
          <div style={{
            position: 'absolute', width: 'max(70vw, 700px)', height: 'max(70vw, 700px)',
            bottom: '-20%', right: '-10%',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(230, 90, 0, 0.35) 0%, rgba(150, 40, 0, 0.15) 50%, transparent 70%)',
            willChange: 'transform, border-radius', animation: 'cBlob2 14s ease-in-out infinite',
          }} />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-0">

        {/* Availability badge */}
        <div
          ref={badgeRef}
          className={`mb-8 transition-all duration-500 ${
            badgeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span
            className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-fg-1 border rounded-full px-4 py-1.5"
            style={{ borderColor: 'var(--border-pill)' }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-fg-1" />
            available for new projects
          </span>
        </div>

        {/* Giant headline — full width */}
        <h2
          ref={headingRef}
          className={`font-regular tracking-tight leading-none text-fg-1 mb-0 transition-all duration-700 delay-100 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 'clamp(64px, 10vw, 140px)' }}
        >
          Let&apos;s talk.
        </h2>
      </div>

      {/* 2-col split */}
      <div className="relative z-10 flex flex-col md:flex-row max-w-6xl mx-auto flex-1">

        {/* Left — 40% */}
        <div
          ref={leftRef}
          className={`md:w-2/5 px-6 md:pl-6 md:pr-12 pt-12 pb-10 flex flex-col justify-between transition-all duration-700 ${
            leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col gap-8">
            <p className="text-md text-fg-2 leading-relaxed" style={{ maxWidth: 300 }}>
              open for quant research roles, algorithmic trading projects,
              and ml engineering collaborations across global equities,
              crypto, forex, and commodities, especially where fast news
              and linked market reactions matter.
            </p>
            <CtaLink href="mailto:workspace.swarnabh@gmail.com" external>
              book a call ↗
            </CtaLink>
          </div>

          {/* Identity chip */}
          <div className="flex items-center gap-4 pt-8 border-t mt-8" style={{ borderColor: 'var(--border)' }}>
            <span
              className="inline-flex items-center justify-center shrink-0 rounded-full text-fg-1 text-xs tracking-wider"
              style={{ width: 44, height: 44, border: '1px solid var(--border-pill)' }}
            >
              SR
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-fg-1 leading-none">S. Roy</span>
              <span className="text-xs text-fg-3 tracking-wide">Quant Developer</span>
            </div>
          </div>
        </div>

        {/* Vertical rule */}
        <div className="hidden md:block w-px self-stretch" style={{ background: 'var(--border)' }} />

        {/* Right — 60% · form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`flex-1 px-6 md:pl-12 pt-12 pb-10 flex flex-col gap-6 transition-all duration-700 delay-150 ${
            formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p style={{ fontSize: 'var(--text-md)', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 8 }}>
            share your idea and i&apos;ll reply within 1–2 business days.
          </p>

          {FIELDS.map(({ name, label, type, placeholder }) => {
            const focused = activeField === name
            const dimmed  = !!activeField && !focused && !form[name as keyof typeof form]

            return (
              <div
                key={name}
                style={{
                  position: 'relative',
                  opacity: dimmed ? 0.3 : 1,
                  filter: dimmed ? 'blur(0.4px)' : 'none',
                  transition: 'opacity 0.25s, filter 0.25s',
                }}
              >
                <label
                  style={{
                    fontSize: 'var(--text-sm)', fontWeight: 300, display: 'block', marginBottom: 6,
                    color: focused ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)',
                    transition: 'color 0.2s',
                  }}
                >
                  {label}
                </label>

                {type === 'area' ? (
                  <textarea
                    name={name} placeholder={placeholder}
                    value={form[name as keyof typeof form]}
                    rows={4}
                    onFocus={() => setActiveField(name)}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                    required
                    style={inputStyle(name)}
                  />
                ) : (
                  <input
                    type={type} name={name} placeholder={placeholder}
                    value={form[name as keyof typeof form]}
                    onFocus={() => setActiveField(name)}
                    onBlur={() => setActiveField(null)}
                    onChange={handleChange}
                    required
                    style={inputStyle(name)}
                  />
                )}

                {/* Magenta → white → orange glow sweep on focus */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 1, overflow: 'hidden', pointerEvents: 'none' }}>
                  <div style={{
                    position: 'absolute', top: 0, left: '-60%', width: '60%', height: '100%',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(194,24,91,0.6) 20%, rgba(255,255,255,0.95) 50%, rgba(230,81,0,0.6) 80%, transparent 100%)',
                    filter: 'blur(0.5px)',
                    animation: focused ? 'runGlow 1.4s ease-in-out infinite' : 'none',
                    opacity: focused ? 1 : 0,
                    transition: 'opacity 0.15s',
                  }} />
                </div>
              </div>
            )
          })}

          <button
            type="submit"
            disabled={status === 'sending' || status === 'sent'}
            className="self-end disabled:opacity-40"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 'var(--text-sm)', fontWeight: 300, color: 'rgba(255,255,255,0.6)',
              background: 'transparent', border: 'none',
              borderBottom: '0.5px solid rgba(255,255,255,0.22)',
              padding: '4px 0', cursor: 'none', letterSpacing: '0.08em',
              marginTop: 8, transition: 'color 0.4s ease, border-color 0.4s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.85)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)' }}
          >
            {status === 'idle'    && 'send message ↗'}
            {status === 'sending' && 'sending…'}
            {status === 'sent'    && 'message sent ✓'}
            {status === 'error'   && 'try again ↗'}
          </button>
        </form>
      </div>
    </section>
  )
}
