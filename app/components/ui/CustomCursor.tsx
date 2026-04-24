// app/components/ui/CustomCursor.tsx

'use client'

import { useEffect, useRef, useState } from "react"

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const dotRef = useRef<HTMLDivElement>(null)
    const ringRef = useRef<HTMLDivElement>(null)
    const mousePos = useRef({ x: 0, y: 0 })
    const ringPos = useRef({ x: 0, y: 0 })
    const rafId = useRef<number>(0)

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`
            }
        }
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const clickable = target.closest('a, button, [role="button"], input, textarea, select, label')
            setIsHovered(!!clickable)
        }

        const onMouseEnter = () => setIsVisible(true)
        const onMouseLeave = () => setIsVisible(false)

        const animate = () => {
            const speed = 0.12

            ringPos.current.x += (mousePos.current.x - ringPos.current.x) * speed
            ringPos.current.y += (mousePos.current.y - ringPos.current.y) * speed

            if (ringRef.current) {
                ringRef.current.style.transform = `translate(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px)`
            }
            rafId.current = requestAnimationFrame(animate)

            }
            rafId.current = requestAnimationFrame(animate)

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseover', onMouseOver)
            document.addEventListener('mouseenter', onMouseEnter)
            document.addEventListener('mouseleave', onMouseLeave)

            return () => {
                cancelAnimationFrame(rafId.current)
                document.removeEventListener('mousemove', onMouseMove)
                document.removeEventListener('mouseover', onMouseOver)
                document.removeEventListener('mouseenter', onMouseEnter)
                document.removeEventListener('mouseleave', onMouseLeave)
        }
    }, [])

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
                background: 'var(--fg-1)',
                pointerEvents: 'none',
                zIndex: 9999,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease',
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
                width: isHovered ? '48px' : '32px',
                height: isHovered ? '48px' : '32px',
                borderRadius: '50%',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                pointerEvents: 'none',
                zIndex: 9998,
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease, width 0.3s ease, height 0.3s ease',
                willChange: 'transform',
            }}
        />
        </>
    )
}
