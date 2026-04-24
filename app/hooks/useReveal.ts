// app/hooks/useReveal.ts
// =============================================================
// useReveal - triggers animation when element enters viewport
// =============================================================

'use client'

import { useState, useEffect, useRef } from "react"

interface UseRevealOptions {
    threshold?: number
    triggerOnce?: boolean
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(
    options: UseRevealOptions = {}
) {
    const { threshold = 0.15, triggerOnce = true } = options

    const ref = useRef<T>(null)

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (triggerOnce) {
                        observer.unobserve(element)
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false)
                }
            },
            { threshold }
        )

        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [threshold, triggerOnce])

    return { ref, isVisible }
}