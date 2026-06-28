'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * .reveal işaretli blokları görünüme girince yumuşakça belirtir (fade-up).
 * - JS yoksa içerik görünür kalır (globals: gizleme yalnız .js-ready altında).
 * - prefers-reduced-motion için globals'ta devre dışı.
 * - Route değişiminde yeni .reveal düğümlerini yeniden tarar.
 */
export default function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    document.documentElement.classList.add('js-ready')
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'))
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  return null
}
