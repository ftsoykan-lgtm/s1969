'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface HeroItem {
  title: string
  excerpt: string
  imageUrl: string
  href: string
  category?: string
}

const INTERVAL = 6000

export default function HeroSlider({ items }: { items: HeroItem[] }) {
  const n = items.length
  const [idx, setIdx] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((i: number) => setIdx(((i % n) + n) % n), [n])
  const next = useCallback(() => setIdx((i) => (i + 1) % n), [n])
  const prev = useCallback(() => setIdx((i) => (i - 1 + n) % n), [n])

  useEffect(() => {
    if (n < 2) return
    timer.current = setInterval(next, INTERVAL)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [next, n, idx])

  if (!n) return null

  const active = items[idx]
  const prevItem = items[(idx - 1 + n) % n]
  const nextItem = items[(idx + 1) % n]

  return (
    <section className="relative bg-[#081f12] overflow-hidden">
      <div className="relative h-[440px] sm:h-[560px] lg:h-[calc(100vh-110px)] lg:min-h-[640px] lg:max-h-[940px]">

        {/* ── SOL komşu (kenardan sızar) ───────────────────────────── */}
        {n > 1 && (
          <button onClick={prev} aria-label="Önceki haber"
            className="hidden md:block absolute left-0 top-0 bottom-0 w-[20%] z-10 group">
            <Image src={prevItem.imageUrl} alt="" fill sizes="50vw" className="object-cover" />
            <span className="absolute inset-0 bg-[#04130b]/70 group-hover:bg-[#04130b]/55 transition-colors" />
            <span className="absolute bottom-6 left-4 right-8 text-left">
              <span className="block text-white/80 text-sm font-bold leading-snug line-clamp-3 drop-shadow">{prevItem.title}</span>
            </span>
          </button>
        )}

        {/* ── SAĞ komşu (kenardan sızar) ───────────────────────────── */}
        {n > 1 && (
          <button onClick={next} aria-label="Sonraki haber"
            className="hidden md:block absolute right-0 top-0 bottom-0 w-[20%] z-10 group">
            <Image src={nextItem.imageUrl} alt="" fill sizes="50vw" className="object-cover" />
            <span className="absolute inset-0 bg-[#04130b]/70 group-hover:bg-[#04130b]/55 transition-colors" />
            <span className="absolute bottom-6 right-4 left-8 text-right">
              <span className="block text-white/80 text-sm font-bold leading-snug line-clamp-3 drop-shadow">{nextItem.title}</span>
            </span>
          </button>
        )}

        {/* ── ORTA: büyük aktif haber ──────────────────────────────── */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full md:w-[64%] z-20 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)]">
          {items.map((s, i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-[800ms] ease-out"
              style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 10 : 0 }}>
              <Image src={s.imageUrl} alt={s.title} fill priority={i === 0} sizes="(max-width:768px) 100vw, 64vw"
                className={`object-cover ${i === idx ? 'hero-kb' : ''}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/30 to-transparent" />
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 lg:p-10">
            <Link href={active.href} className="group block max-w-2xl" key={idx}>
              {active.category && (
                <span className="inline-block bg-ugold text-ugreend text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 mb-3"
                  style={{ animation: 'hUp .5s ease-out both' }}>
                  {active.category}
                </span>
              )}
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-[2.5rem] font-extrabold text-white leading-[1.08] tracking-tight line-clamp-3 drop-shadow-xl"
                style={{ animation: 'hUp .6s ease-out .08s both' }}>
                {active.title}
              </h1>
              <p className="mt-3 text-white/65 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-xl hidden sm:block"
                style={{ animation: 'hUp .6s ease-out .16s both' }}>
                {active.excerpt}
              </p>
            </Link>
          </div>

          {/* ── Yüzen CAM navigasyon (görsel üstünde, sağ-alt) ─────────── */}
          {n > 1 && (
            <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 z-30 flex items-center gap-2 sm:gap-2.5 rounded-full bg-black/25 backdrop-blur-md border border-white/20 px-2.5 py-2 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]">
              <button onClick={prev} aria-label="Önceki"
                className="h-8 w-8 flex items-center justify-center rounded-full text-white hover:bg-ugold hover:text-ugreend transition-colors">
                <ChevronLeft size={17} />
              </button>
              <div className="flex items-center gap-2">
                {items.map((_, i) => {
                  if (i === idx) {
                    // Aktif: cam üstünde sarı→yeşil dolan ilerleme barı
                    return (
                      <span key={i} className="relative h-2 w-12 rounded-full bg-white/25 overflow-hidden">
                        <span key={idx} className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
                          style={{ animation: `hProg ${INTERVAL}ms linear both` }}>
                          <span className="block h-full w-12 rounded-full bg-gradient-to-r from-ugold to-ugreen" />
                        </span>
                      </span>
                    )
                  }
                  const past = i < idx
                  return (
                    <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
                      className={`h-2 w-2 rounded-full transition-all ${
                        past ? 'bg-ugold hover:brightness-110' : 'bg-white/35 hover:bg-white/70'
                      }`} />
                  )
                })}
              </div>
              <button onClick={next} aria-label="Sonraki"
                className="h-8 w-8 flex items-center justify-center rounded-full bg-ugold text-ugreend hover:brightness-105 transition-all">
                <ChevronRight size={17} />
              </button>
            </div>
          )}
        </div>

      </div>

      <style jsx global>{`
        @keyframes hProg { from { width: 0% } to { width: 100% } }
        @keyframes hUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes hKenBurns { from { transform: scale(1.05) } to { transform: scale(1.12) } }
        .hero-kb { animation: hKenBurns 7s ease-out both; }
      `}</style>
    </section>
  )
}
