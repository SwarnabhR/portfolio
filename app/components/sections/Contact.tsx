'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

export default function Contact() {
  const [form,   setForm  ] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const { ref: badgeRef,   isVisible: badgeVisible   } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()
  const { ref: leftRef,    isVisible: leftVisible    } = useReveal()
  const { ref: formRef,    isVisible: formVisible    } = useReveal<HTMLFormElement>()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    // Wire to Resend / Formspree later
    await new Promise(r => setTimeout(r, 1200))
    setStatus('sent')
  }

  return (
    <section
      id="contact"
      className="relative py-32 overflow-hidden"
      style={{ background: `var(--gradient-contact), var(--bg)` }}
    >
      <div className="max-w-6xl mx-auto px-6">

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
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-fg-1"
              style={{ boxShadow: '0 0 6px currentColor' }}
            />
            Available for new projects
          </span>
        </div>

        {/* Giant headline — full width */}
        <h2
          ref={headingRef}
          className={`font-regular tracking-tight leading-none text-fg-1 mb-16 transition-all duration-700 delay-100 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 'clamp(64px, 10vw, 140px)' }}
        >
          Let&apos;s talk.
        </h2>

        {/* 2-col split */}
        <div className="grid md:grid-cols-[2fr_3px_3fr] gap-0 items-start">

          {/* Left — 40% · bio + CTA + identity chip */}
          <div
            ref={leftRef}
            className={`pr-12 flex flex-col gap-8 transition-all duration-700 ${
              leftVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-md text-fg-2 leading-relaxed max-w-xs">
              Open to quant research roles, algorithmic trading projects,
              and ML engineering collaborations. Reply within 1–2 business days.
            </p>

            <a
              href="mailto:swarnabh.work@gmail.com"
              className="text-sm text-fg-1 self-start inline-flex items-center gap-1 border-b pb-0.5 hover:text-fg-2 transition-colors duration-300"
              style={{ borderColor: 'var(--border-pill)' }}
            >
              book a call ↗
            </a>

            {/* Identity chip */}
            <div className="flex items-center gap-4 mt-auto pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
              <span
                className="inline-flex items-center justify-center shrink-0 rounded-full text-fg-1 text-xs tracking-wider font-regular"
                style={{
                  width: '44px',
                  height: '44px',
                  border: '1px solid var(--border-pill)',
                }}
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
          <div className="hidden md:block h-full w-px self-stretch" style={{ background: 'var(--border)' }} />

          {/* Right — 60% · form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={`pl-12 flex flex-col gap-8 transition-all duration-700 delay-150 ${
              formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-sm text-fg-3">
              Share your idea and I&apos;ll reply within 1–2 business days.
            </p>

            {[
              { name: 'name',    label: 'Name',    type: 'text',  placeholder: 'Jane Smith'           },
              { name: 'email',   label: 'Email',   type: 'email', placeholder: 'jane@example.com'     },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name} className="flex flex-col gap-2">
                <label className="text-xs tracking-wider uppercase text-fg-3">{label}</label>
                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={form[name as keyof typeof form]}
                  onChange={handleChange}
                  required
                  className="bg-transparent border-b py-3 text-md text-fg-1 placeholder:text-fg-3 focus:outline-none focus:border-fg-2 transition-colors duration-300"
                  style={{ borderColor: 'var(--border-input)' }}
                />
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <label className="text-xs tracking-wider uppercase text-fg-3">Message</label>
              <textarea
                name="message"
                placeholder="Leave a message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="bg-transparent border-b py-3 text-md text-fg-1 placeholder:text-fg-3 focus:outline-none focus:border-fg-2 transition-colors duration-300 resize-none"
                style={{ borderColor: 'var(--border-input)' }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className="self-end text-sm text-fg-1 inline-flex items-center gap-1 border-b pb-0.5 hover:text-fg-2 transition-colors duration-300 disabled:opacity-40"
              style={{ borderColor: 'var(--border-pill)' }}
            >
              {status === 'idle'    && 'send message ↗'}
              {status === 'sending' && 'sending…'}
              {status === 'sent'    && 'message sent ✓'}
              {status === 'error'   && 'try again ↗'}
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}
