// app/hooks/useScrollY.ts

'use client'

import { useState, useEffect } from "react"

export function useScrollY(): number {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        // Hanlder 
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    return scrollY
}