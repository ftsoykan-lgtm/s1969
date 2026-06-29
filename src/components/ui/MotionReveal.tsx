'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMounted } from '@/lib/use-mounted'

interface MotionRevealProps {
  children: ReactNode
  /** Sıralı beliriş için gecikme (saniye). Stagger'da index * 0.08 gibi verilir. */
  delay?: number
  className?: string
}

/**
 * Görünüme girince yumuşak fade-up ile belirir (bir kez).
 *
 * Erişilebilirlik + SSR güvenliği:
 * - Sunucu ve ilk istemci paint'i AYNI düz <div>'i render eder (hydration mismatch yok,
 *   JS çalışmazsa içerik görünür kalır).
 * - prefers-reduced-motion açıksa animasyon hiç kurulmaz, içerik direkt görünür.
 * Site genelinde kart/blok stagger'ı için yeniden kullanılabilir.
 */
export default function MotionReveal({ children, delay = 0, className }: MotionRevealProps) {
  const mounted = useMounted()
  const prefersReduced = useReducedMotion()

  // Mount öncesi (SSR + ilk paint) ve reduced-motion: animasyonsuz, görünür içerik.
  if (!mounted || prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
