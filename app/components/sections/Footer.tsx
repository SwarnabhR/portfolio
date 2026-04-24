import Link from 'next/link'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
]

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/swarnabh' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/swarnabh' },
  { label: 'Email', href: 'mailto:swarnabh@sroy.co' },
]

export default function Footer() {
  return (
    <footer
      className="border-t py-16"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">

          {/* Wordmark */}
          <span className="text-sm font-medium tracking-widest uppercase text-fg-1">
            S. Roy &amp; Co.
          </span>

          {/* Nav links */}
          <ul className="flex flex-wrap gap-6">
            {LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-xs tracking-wider uppercase text-fg-3 hover:text-fg-1 transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Socials */}
          <ul className="flex gap-6">
            {SOCIALS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs tracking-wider uppercase text-fg-3 hover:text-fg-1 transition-colors duration-300"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="h-px w-full mb-8" style={{ background: 'var(--border)' }} />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-xs text-fg-3">
            © {new Date().getFullYear()} S. Roy. All rights reserved.
          </p>
          <p className="text-xs text-fg-3">
            Built with Next.js · Tailwind v4 · TypeScript
          </p>
        </div>

      </div>
    </footer>
  )
}