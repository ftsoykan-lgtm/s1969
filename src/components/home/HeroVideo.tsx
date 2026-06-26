'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ClubInfo } from '@/data/club'

export interface HeroItem {
  title: string
  excerpt: string
  imageUrl?: string
  href: string
  category?: string
}

const INTERVAL = 6000

export default function HeroVideo({ club, src, items = [] }: { club: ClubInfo; src: string; items?: HeroItem[] }) {
  const ref = useRef<HTMLVideoElement>(null)
  const n = items.length
  const [idx, setIdx] = useState(0)
  const go = useCallback((i: number) => setIdx(((i % n) + n) % n), [n])
  const next = useCallback(() => setIdx((i) => (i + 1) % n), [n])
  const prev = useCallback(() => setIdx((i) => (i - 1 + n) % n), [n])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.defaultMuted = true
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [src])

  useEffect(() => {
    if (n < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % n), INTERVAL)
    return () => clearInterval(t)
  }, [n, idx])

  const active = n > 0 ? items[idx] : null
  const num = (i: number) => String(i + 1).padStart(2, '0')

  return (
    <section className="relative bg-[#092d18] overflow-hidden">
      <div className="relative h-[68vh] min-h-[520px] md:h-[88vh] md:max-h-[900px]">
        {/* Arka plan video */}
        {src ? (
          <video ref={ref} className="absolute inset-0 w-full h-full object-cover"
            src={src} autoPlay muted loop playsInline preload="auto"
            style={{ filter: 'saturate(1.06) contrast(1.04)' }} />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_-10%,#1A6B3C_0%,#092d18_60%)]" />
        )}

        {/* Karartma */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/20 to-[#04130b]/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04130b]/55 via-transparent to-transparent" />

        {/* Ön plan */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-11 md:pb-16">
            <div className="flex items-end justify-between gap-6">

              {/* Sol: öne çıkan haber */}
              <div className="min-w-0 flex items-end gap-6">
                {active?.imageUrl && (
                  <Link href={active.href} key={`img-${idx}`}
                    className="hidden md:block relative shrink-0 w-44 lg:w-56 aspect-[4/5] overflow-hidden ring-1 ring-white/15 shadow-2xl group hero-up">
                    <img src={active.imageUrl} alt={active.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#04130b]/60 to-transparent" />
                    <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#FFD100] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
                  </Link>
                )}

                <div className="min-w-0">
                  {active ? (
                    <Link href={active.href} className="group block max-w-3xl" key={idx}>
                      {active.category && (
                        <span className="inline-flex items-center gap-2.5 mb-4 hero-up">
                          <span className="w-8 h-[2px] bg-[#FFD100]" />
                          <span className="text-[#FFD100] text-[11px] font-bold tracking-[0.26em] uppercase">{active.category}</span>
                        </span>
                      )}
                      <h1 className="font-heading text-3xl md:text-5xl lg:text-[3.4rem] font-extrabold text-white leading-[1.02] tracking-[-0.02em] line-clamp-3 hero-up"
                        style={{ animationDelay: '.06s' }}>
                        {active.title}
                      </h1>
                      {active.excerpt && (
                        <p className="mt-4 text-white/65 text-[15px] md:text-base leading-relaxed line-clamp-2 max-w-xl hero-up" style={{ animationDelay: '.12s' }}>
                          {active.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 mt-6 text-[#0f4a28] bg-[#FFD100] text-[12px] font-bold uppercase tracking-wide px-5 py-3 group-hover:gap-3 transition-all hero-up"
                        style={{ animationDelay: '.18s' }}>
                        Haberin Devamı <ArrowRight size={15} />
                      </span>
                    </Link>
                  ) : (
                    <div className="max-w-2xl">
                      <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white uppercase tracking-[-0.02em] leading-[0.95]">{club.name}</h1>
                    </div>
                  )}
                </div>
              </div>

              {/* Sağ: sayaç + oklar */}
              {n > 1 && (
                <div className="shrink-0 flex flex-col items-end gap-4 pb-1">
                  <div className="font-heading font-extrabold tabular-nums leading-none">
                    <span className="text-4xl md:text-5xl text-white">{num(idx)}</span>
                    <span className="text-lg md:text-xl text-white/40"> / {String(n).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={prev} aria-label="Önceki"
                      className="h-10 w-10 flex items-center justify-center border border-white/25 text-white hover:bg-[#FFD100] hover:text-[#0f4a28] hover:border-[#FFD100] transition-all">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={next} aria-label="Sonraki"
                      className="h-10 w-10 flex items-center justify-center border border-white/25 text-white hover:bg-[#FFD100] hover:text-[#0f4a28] hover:border-[#FFD100] transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* İnce ilerleme çizgisi */}
          {n > 1 && (
            <div className="h-[3px] bg-white/10">
              <span key={idx} className="block h-full bg-[#FFD100]" style={{ animation: `heroProg ${INTERVAL}ms linear` }} />
            </div>
          )}
        </div>
      </div>

      {/* Alt ince yeşil hat (gradient yerine düz) */}
      <div className="h-[3px] bg-[#1A6B3C]" />

      <style jsx global>{`
        @keyframes heroProg { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  )
}
