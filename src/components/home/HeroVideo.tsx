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
    <section className="relative bg-ugreenm overflow-hidden">
      <div className="relative h-[64vh] min-h-[460px] md:h-[84vh] md:max-h-[860px]">
        {/* Arka plan video */}
        {src ? (
          <video ref={ref} className="absolute inset-0 w-full h-full object-cover"
            src={src} autoPlay muted loop playsInline preload="auto"
            style={{ filter: 'saturate(1.08) contrast(1.04)' }} />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_-10%,#1b5e44_0%,#154836_60%)]" />
        )}

        {/* Karartma — okunabilirlik için sadece metnin olduğu alanlarda */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04130b]/90 via-[#04130b]/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04130b]/45 via-transparent to-transparent" />

        {/* Ön plan */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-10 md:pb-14">
            <div className="flex items-end justify-between gap-6">

              {/* Sol: öne çıkan haber — görsel + metin */}
              <div className="min-w-0 flex items-end gap-5">
                {active?.imageUrl && (
                  <Link href={active.href} key={`img-${idx}`}
                    className="hidden md:block relative shrink-0 w-44 lg:w-52 aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-2xl group hero-up">
                    <img src={active.imageUrl} alt={active.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#04130b]/50 to-transparent" />
                  </Link>
                )}

                <div className="min-w-0">
                  {active ? (
                    <Link href={active.href} className="group block max-w-2xl" key={idx}>
                      {active.category && (
                        <span className="inline-flex items-center gap-2 mb-3 hero-up">
                          <span className="w-7 h-0.5 bg-ugold" />
                          <span className="text-ugold text-[11px] font-black tracking-[0.28em] uppercase">{active.category}</span>
                        </span>
                      )}
                      <h1 className="font-heading text-2xl md:text-4xl lg:text-[2.7rem] font-black text-white leading-[1.05] tracking-tight line-clamp-3 drop-shadow-2xl hero-up"
                        style={{ animationDelay: '.06s' }}>
                        {active.title}
                      </h1>
                      {active.excerpt && (
                        <p className="mt-3 text-white/65 text-sm md:text-base leading-relaxed line-clamp-2 max-w-xl hero-up" style={{ animationDelay: '.12s' }}>
                          {active.excerpt}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 mt-5 text-ugreend bg-ugold text-[12px] font-black uppercase tracking-wide pl-4 pr-5 py-2.5 rounded-full group-hover:gap-3 transition-all shadow-lg shadow-ugold/20 hero-up"
                        style={{ animationDelay: '.18s' }}>
                        Haberin Devamı <ArrowRight size={15} />
                      </span>
                    </Link>
                  ) : (
                    <div className="max-w-2xl">
                      <h1 className="font-heading text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-[0.95] drop-shadow-2xl">{club.name}</h1>
                    </div>
                  )}
                </div>
              </div>

              {/* Sağ: sayaç + oklar */}
              {n > 1 && (
                <div className="shrink-0 flex flex-col items-end gap-4 pb-1">
                  <div className="font-heading font-black tabular-nums leading-none">
                    <span className="text-4xl md:text-5xl text-white">{num(idx)}</span>
                    <span className="text-lg md:text-xl text-white/40"> / {String(n).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={prev} aria-label="Önceki"
                      className="h-10 w-10 flex items-center justify-center rounded-full border border-white/25 text-white hover:bg-ugold hover:text-ugreend hover:border-ugold transition-all">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={next} aria-label="Sonraki"
                      className="h-10 w-10 flex items-center justify-center rounded-full border border-white/25 text-white hover:bg-ugold hover:text-ugreend hover:border-ugold transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* İnce ilerleme çizgisi (en alt) */}
          {n > 1 && (
            <div className="h-[3px] bg-white/10">
              <span key={idx} className="block h-full bg-ugold" style={{ animation: `heroProg ${INTERVAL}ms linear` }} />
            </div>
          )}
        </div>
      </div>

      {/* Alt altın hat */}
      <div className="h-1 bg-gradient-to-r from-ugreen via-ugold to-ugreen" />

      <style jsx global>{`
        @keyframes heroProg { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  )
}
