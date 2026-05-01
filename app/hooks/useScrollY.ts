// app/hooks/useScrollY.ts

'use client'

import { useState, useEffect } from "react"

export function useScrollY(): number {
    const [scrollY, setScrollY] = useState(() =>
        typeof window !== 'undefined' ? window.scrollY : 0
    )

    useEffect(() => {
        let raf: number

        function updateScroll() {
            setScrollY(window.scrollY)
            raf = requestAnimationFrame(updateScroll)
        }

        raf = requestAnimationFrame(updateScroll)

        return () => {
            cancelAnimationFrame(raf)
        }
    }, [])

    return scrollY
}