'use client'

import { useState } from 'react'
import { useReveal } from '@/hooks/useReveal'

type FaqData = { q: string; a: string }

const DEFAULT_FAQS: FaqData[] = [
  {
    q: 'what kind of projects do you take on?',
    a: 'Algorithmic strategy development, backtesting infrastructure, real-time data pipelines, and ML models for equities, cryptocurrencies, forex, and commodities. I work best on projects where rigour matters — where a 10bps edge or a sub-second latency gain is worth engineering properly.',
  },
  {
    q: 'what markets and instruments do you specialise in?',
    a: 'I handle Indian and international equities, including NSE/BSE, NYSE, SSE, and LSE, along with cryptocurrencies, forex, and commodity futures such as gold and oil. My work covers tick-data ingestion, OHLCV time-series storage, and strategy simulation across markets, depending on data/API access.',
  },
  {
    q: 'how do you approach research and analysis?',
    a: 'I combine fast news, deep learning, quantitative mathematics, and interpretable models to explain market reactions. The thesis is that everything is linked: rates, indices, equities, crypto, forex, commodities, and news all feed into each other, so I look for dependencies rather than isolated signals.',
  },
  {
    q: 'are you open to research collaborations or academic work?',
    a: 'Yes — I have experience taking work through to publication (VeriGuard was accepted on first submission). If you have a dataset and a research question at the intersection of ML and finance, I am interested.',
  },
]

function FaqRow({ faq, index }: { faq: FaqData & { num: string }; index: number }) {
  const [open, setOpen] = useState(false)
  const { ref, isVisible } = useReveal()

  return (
    <div
      ref={ref}
      className="border-b"
      style={{
        borderColor: 'var(--border)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms`,
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={`faq-answer-${faq.num}`}
        className="w-full flex justify-between items-center gap-4 py-5 text-left"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
      >
        <div className="flex items-baseline gap-3">
          <span className="text-xs tracking-wider" style={{ color: 'var(--fg-3)' }}>
            {faq.num}
          </span>
          <span
            className="font-light tracking-tight transition-colors duration-300"
            style={{
              fontSize: 'clamp(15px, 2.2vw, 19px)',
              color: open ? 'var(--fg-1)' : 'rgba(255,255,255,0.80)',
              letterSpacing: '-0.01em',
            }}
          >
            {faq.q}
          </span>
        </div>
        <span
          style={{
            fontSize: 'var(--text-base)',
            color: 'rgba(255,255,255,0.35)',
            flexShrink: 0,
            display: 'inline-block',
            transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          ↑
        </span>
      </button>

      <div
        id={`faq-answer-${faq.num}`}
        role="region"
        aria-label={faq.q}
        style={{
          overflow: 'hidden',
          maxHeight: open ? 200 : 0,
          transition: 'max-height 0.45s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <p
          className="font-light leading-relaxed pb-5"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--fg-2)', paddingLeft: 28, maxWidth: 640 }}
        >
          {faq.a}
        </p>
      </div>
    </div>
  )
}

export default function FAQ({ items }: { items?: { question: string; answer: string }[] }) {
  const FAQS = (items?.length ? items.map(i => ({ q: i.question, a: i.answer })) : DEFAULT_FAQS)
    .map((f, i) => ({ ...f, num: String(i + 1).padStart(2, '0') }))

  const { ref: labelRef,   isVisible: labelVisible   } = useReveal()
  const { ref: headingRef, isVisible: headingVisible } = useReveal()

  return (
    <section id="faq" className="relative bg-bg py-24 overflow-hidden">

      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-0 left-0 font-light leading-none tracking-tight text-fg-1 whitespace-nowrap"
        style={{ fontSize: 'var(--text-bg-word)', opacity: 0.025 }}
      >
        Questions
      </span>

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        <div
          ref={labelRef}
          className={`mb-6 transition-all duration-500 ${
            labelVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span
            className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-fg-1 border rounded-full px-4 py-1.5"
            style={{ borderColor: 'var(--border-pill)' }}
          >
            ✦ FAQ
          </span>
        </div>

        <h2
          ref={headingRef}
          className={`font-light tracking-tight text-fg-1 mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-0.02em' }}
        >
          common questions.
        </h2>

        <div className="pt-8">
          {FAQS.map((faq, i) => (
            <FaqRow key={faq.num} faq={faq} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
