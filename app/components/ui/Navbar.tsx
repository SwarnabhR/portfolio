// app/components/ui/Navbar.tsx


'use client'

import { useEffect, useState } from "react"
import Link from "next/link"

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll, { passive: true })

        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                scrolled 
                ? 'bg-bg/80 backdrop-blur-md border-b border-border/40 py-3' 
                : 'py-6'
            }`}
        >
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-sm font-medium tracking-widest uppercase text-fg-1/80 hover:text-fg-1 transition-colors">
                Logo
            </Link>
            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-8">
                {NAV_LINKS.map(({ label, href}) => (
                    <li key={label}>
                        <Link
                            href={href}
                            className="text-xs tracking-widest uppercase text-fg-1/50 hover:text-fg-1 transition-colors"
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Mobile hamburger */}
            <button
                className="md:hidden flex flex-col gap-1.5 p-2"
                onClick={() => setMenuOpen(prev => !prev)}
                aria-label="Toggle menu"
            >
                <span className={`block w-5 h-px bg-fg-1 transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                <span className={`block w-5 h-px bg-fg-1 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-px bg-fg-1 transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
        </nav>

        {/* Mobile menu */}
        <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
                menuOpen ? 'max-h-64' : 'max-h-0'}`}>
            <ul className="flex flex-col px-6 pb-6 pt-2 gap-4">
                {NAV_LINKS.map(({ label, href }) => (
                    <li key={label}>
                        <Link
                            href={href}
                            className="text-xs tracking-widest uppercase text-fg-1/50 hover:text-fg-1 transition-colors"
                            onClick={() => setMenuOpen(false)}
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    </header>
    )
}