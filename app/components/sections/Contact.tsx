'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const { ref: labelRef, isVisible: labelVisible } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()
  const { ref: formRef, isVisible: formVisible } = useReveal<HTMLFormElement>()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    // Wire up to your preferred email service (Resend, Formspree etc.) later
    await new Promise(r => setTimeout(r, 1200))
    setStatus('sent')
  }

  return (
    <section
      id="contact"
      className="relative py-32 overflow-hidden"
      style={{ background: `var(--gradient-contact), var(--bg)` }}
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">

        {/* Left — copy */}
        <div>
          <div
            ref={labelRef}
            className={`mb-8 transition-all duration-500 ${
              labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span
              className="text-xs tracking-wider uppercase text-fg-2 border rounded-full px-4 py-1.5"
              style={{ borderColor: 'var(--border-pill)' }}
            >
              Contact
            </span>
          </div>

          <h2
            ref={headingRef}
            className={`text-3xl font-regular tracking-tight leading-none text-fg-1 mb-6 transition-all duration-700 ${
              headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Let&apos;s build something.
          </h2>

          <p className="text-md text-fg-2 leading-relaxed max-w-sm mb-12">
            Open to freelance projects, research collaborations, and
            quantitative trading opportunities.
          </p>

          {/* Links */}
          <div className="flex flex-col gap-4">
            {[
              { label: 'Email', value: 'swarnabh@sroy.co', href: 'mailto:swarnabh@sroy.co' },
              { label: 'LinkedIn', value: 'linkedin.com/in/swarnabh', href: 'https://linkedin.com/in/swarnabh' },
              { label: 'GitHub', value: 'github.com/swarnabh', href: 'https://github.com/swarnabh' },
            ].map(({ label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-fg-2 hover:text-fg-1 transition-colors duration-300 group"
              >
                <span className="text-xs tracking-wider uppercase text-fg-3 w-20">{label}</span>
                <span className="text-sm group-hover:underline underline-offset-4">{value}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`flex flex-col gap-6 transition-all duration-700 delay-200 ${
            formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {[
            { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
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
              placeholder="Tell me about your project..."
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
            className="mt-2 self-start inline-flex items-center gap-2 px-6 py-3 text-sm tracking-widest uppercase text-fg-1 border transition-all duration-300 hover:bg-fg-1/10 disabled:opacity-50"
            style={{ borderColor: 'var(--border-cta)' }}
          >
            {status === 'idle' && 'Send Message'}
            {status === 'sending' && 'Sending...'}
            {status === 'sent' && 'Message Sent ✓'}
            {status === 'error' && 'Try Again'}
          </button>
        </form>

      </div>
    </section>
  )
}