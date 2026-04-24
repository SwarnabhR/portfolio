// app/components/ui/CustomCursor.tsx

'use client'

import { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
    const [isTouch] = useState(() => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)
    const [isVisible, setIsVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isTextHovered, setIsTextHovered] = useState(false)
    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const mousePos = useRef({ x: 0, y: 0 })
    const ringPos = useRef({ x: 0, y: 0 })
    const rafId = useRef<number>(0)

    useEffect(() => {
        if (isTouch) return
        const onMouseMove = (e: MouseEvent) => {
            setIsVisible(prev => {
                if (!prev) return true
                return prev
            })
            mousePos.current = { x: e.clientX, y: e.clientY }
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
            }
        }
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const clickable = target.closest('a, button, [role="button"], input, textarea, select, label')
            setIsHovered(!!clickable)
            
            const textEl = target.closest('p, h1, h2, h3, h4, h5, h6, span, li, blockquote, dt, dd, strong, em')
            setIsTextHovered(!!textEl && !clickable)
        }

        const onMouseEnter = () => setIsVisible(true)
        const onMouseLeave = () => setIsVisible(false)

        const animate = () => {
            const speed = 0.12

            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * speed
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * speed

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`
            }
            rafId.current = requestAnimationFrame(animate)
        }
        rafId.current = requestAnimationFrame(animate)

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseover', onMouseOver)
        document.documentElement.addEventListener('mouseenter', onMouseEnter)
        document.documentElement.addEventListener('mouseleave', onMouseLeave)

        return () => {
            cancelAnimationFrame(rafId.current)
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseover', onMouseOver)
            document.documentElement.removeEventListener('mouseenter', onMouseEnter)
            document.documentElement.removeEventListener('mouseleave', onMouseLeave)
        }
    }, [isTouch])

    if (isTouch) return null

    return (
        <>
        <div
            ref={dotRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: (isTextHovered || isHovered) ? 'transparent' : 'var(--fg-1)',
                pointerEvents: 'none',
                zIndex: 9999,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease, background 0.3s ease',
                willChange: 'transform',
            }}
        />
        <div
            ref={ringRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: isHovered ? '64px' : isTextHovered ? '80px' : '32px',
                height: isHovered ? '64px' : isTextHovered ? '80px' : '32px',
                borderRadius: '50%',
                border: (isTextHovered || isHovered) ? 'none' : '1px solid rgba(255, 255, 255, 0.5)',
                background: (isTextHovered || isHovered) ? 'white' : 'transparent',
                mixBlendMode: (isTextHovered || isHovered) ? 'difference' : 'normal',
                pointerEvents: 'none',
                zIndex: 9998,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease, width 0.3s ease, height 0.3s ease, background 0.3s ease, border 0.3s ease',
                willChange: 'transform',
            }}
        />
        </>
    )
}
