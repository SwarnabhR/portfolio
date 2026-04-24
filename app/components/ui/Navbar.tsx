// app/components/ui/Navbar.tsx


'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { useActiveSection } from "../../hooks/useActiveSection"

const NAV_LINKS = [
    { label: 'About', href: '#about' },
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const activeSection = useActiveSection()

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
            <Link href="/" className="text-fg-1/80 hover:text-fg-1 transition-colors duration-300" aria-label="S. Roy & Co. — Home">
                <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    {/* Outer square frame */}
                    <rect x="1" y="1" width="30" height="30" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.4"/>
                    
                    {/* S — left stem */}
                    <path
                    d="M7 10 Q7 7 10 7 H15 Q18 7 18 10 Q18 13 15 13 H11 Q8 13 8 16 Q8 19 11 19 H17 Q20 19 20 22 Q20 25 17 25 H12 Q9 25 9 22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                    
                    {/* R — right side */}
                    <path
                    d="M22 7 L22 25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    />
                    <path
                    d="M22 7 Q28 7 28 13 Q28 19 22 19 L28 25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    />
                </svg>
            </Link>
            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-8">
                {NAV_LINKS.map(({ label, href}) => (
                    <li key={label}>
                        <Link
                            href={href}
                            className={`text-xs tracking-wider uppercase transition-colors duration-300 ${
                                activeSection === href.replace('#', '')
                                    ? 'text-fg-1' 
                                    : 'text-fg-1/50 hover:text-fg-1'
                            }`}
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
                            className={`text-xs tracking-wider uppercase transition-colors duration-300 ${
                                activeSection === href.replace('#', '')
                                    ? 'text-fg-1' 
                                    : 'text-fg-1/50 hover:text-fg-1'
                            }`}
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