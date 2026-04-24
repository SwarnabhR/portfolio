const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 py-5">

        <p className="text-xs text-fg-3">
          © {year} S. Roy · All rights reserved
        </p>

        <ul className="flex items-center flex-wrap justify-center gap-5">
          {[
            { label: 'GitHub',   href: 'https://github.com/SwarnabhR', external: true  },
            { label: 'LinkedIn', href: '#',                             external: false },
            { label: 'Twitter',  href: '#',                             external: false },
          ].map(({ label, href, external }) => (
            <li key={label}>
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="text-xs text-fg-3 hover:text-fg-1 transition-colors duration-300 tracking-wide"
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <span className="text-xs text-fg-3">✦ Next.js</span>
          </li>
        </ul>

      </div>
    </footer>
  )
}
