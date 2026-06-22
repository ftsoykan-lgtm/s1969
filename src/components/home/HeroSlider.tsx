'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

export interface HeroItem {
  title: string
  excerpt: string
  imageUrl: string
  href: string
  category?: string
}

const INTERVAL = 6500

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

  const num = (i: number) => String(i + 1).padStart(2, '0')

  return (
    <section className="relative bg-[#092d18] overflow-hidden">
      <div className="relative h-[520px] md:h-[640px] lg:h-[700px]">

        {/* ── Slaytlar (crossfade + ken-burns) ───────────────────────── */}
        {items.map((slide, i) => (
          <div key={i}
            className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
            style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 10 : 0 }}>
            <div className="absolute inset-0 overflow-hidden">
              <Image src={slide.imageUrl} alt={slide.title} fill priority={i === 0} sizes="100vw"
                className={`object-cover ${i === idx ? 'hero-kb' : ''}`} />
            </div>
            {/* Karartma katmanları */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04130b]/80 via-[#04130b]/20 to-transparent" />
            {/* Diyagonal çizgi dokusu — navbar ile aynı imza */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
              style={{ background: 'repeating-linear-gradient(115deg, #fff 0 1px, transparent 1px 30px)' }} />
          </div>
        ))}

        {/* ── Üst sol: eğik sarı sayaç flaması ───────────────────────── */}
        <div className="absolute top-0 left-0 z-20">
          <div className="relative bg-gradient-to-r from-[#FFD100] to-[#FFC400] pl-4 sm:pl-6 lg:pl-8 pr-7 py-2.5 flex items-center gap-2"
            style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%)' }}>
            <span className="font-heading font-black text-[#0f4a28] text-lg tabular-nums">{num(idx)}</span>
            <span className="text-[#0f4a28]/50 text-xs font-black">/ {String(n).padStart(2, '0')}</span>
          </div>
        </div>

        {/* ── İçerik paneli (eğik, sol alt) ──────────────────────────── */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-10 md:pb-12">
            <div className="flex items-end justify-between gap-6">

              {/* Metin bloğu */}
              <Link href={items[idx].href} className="group block max-w-2xl" key={idx}>
                {items[idx].category && (
                  <div className="flex items-center gap-3 mb-3" style={{ animation: 'hUp .5s ease-out both' }}>
                    <span className="inline-block bg-[#FFD100] text-[#0f4a28] text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1"
                      style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
                      {items[idx].category}
                    </span>
                  </div>
                )}
                <h1 className="font-heading text-2xl md:text-4xl lg:text-[2.8rem] font-black text-white leading-[1.1] tracking-tight line-clamp-3 drop-shadow-xl"
                  style={{ animation: 'hUp .6s ease-out .08s both' }}>
                  {items[idx].title}
                </h1>
                <p className="mt-3 text-white/65 text-sm md:text-base lg:text-lg leading-relaxed line-clamp-2"
                  style={{ animation: 'hUp .6s ease-out .16s both' }}>
                  {items[idx].excerpt}
                </p>
                <span className="inline-flex items-center gap-2 mt-5 text-[#0f4a28] bg-[#FFD100] text-[12px] font-black uppercase tracking-wide pl-4 pr-5 py-2.5 group-hover:gap-3 transition-all shadow-[0_3px_12px_rgba(255,209,0,0.3)]"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%)', animation: 'hUp .6s ease-out .24s both' }}>
                  Haberin Devamı <ArrowRight size={15} />
                </span>
              </Link>

              {/* ── Eğik thumbnail navigatörü (desktop) ──────────────── */}
              <div className="hidden lg:flex items-end gap-2.5 shrink-0">
                {items.map((s, i) => (
                  <button key={i} onClick={() => goTo(i)} aria-label={s.title}
                    className={`relative overflow-hidden transition-all duration-300 ${i === idx ? 'w-[120px] h-[78px] ring-2 ring-[#FFD100]' : 'w-[72px] h-[64px] opacity-60 hover:opacity-100'}`}
                    style={{ clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)' }}>
                    <Image src={s.imageUrl} alt="" fill sizes="120px" className="object-cover" />
                    <span className="absolute inset-0 bg-[#04130b]/40 hover:bg-transparent transition-colors" />
                    {i === idx && (
                      <span className="absolute bottom-0 left-0 h-[3px] bg-[#FFD100]" style={{ animation: `hProg ${INTERVAL}ms linear` }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Yan oklar ──────────────────────────────────────────────── */}
        {n > 1 && (
          <>
            <button onClick={prev} aria-label="Önceki"
              className="absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-12 w-12 items-center justify-center bg-[#0f4a28]/60 hover:bg-[#FFD100] text-white hover:text-[#0f4a28] backdrop-blur-sm border border-white/15 transition-all"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
              <ChevronLeft size={22} />
            </button>
            <button onClick={next} aria-label="Sonraki"
              className="absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-12 w-12 items-center justify-center bg-[#0f4a28]/60 hover:bg-[#FFD100] text-white hover:text-[#0f4a28] backdrop-blur-sm border border-white/15 transition-all"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {/* Alt çift hat — navbar ile aynı imza */}
      <div className="h-[3px] flex">
        <div className="w-1/3 bg-[#FFD100]" />
        <div className="flex-1 bg-white/10" />
      </div>

      {/* ── Mobil nokta göstergeleri ───────────────────────────────── */}
      {n > 1 && (
        <div className="lg:hidden flex items-center justify-center gap-2 py-4 bg-[#0f4a28]">
          {items.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: i === idx ? '32px' : '8px', backgroundColor: i === idx ? '#FFD100' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes hProg { from { width: 0% } to { width: 100% } }
        @keyframes hUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes hKenBurns { from { transform: scale(1.06) } to { transform: scale(1.14) } }
        .hero-kb { animation: hKenBurns 7s ease-out both; }
      `}</style>
    </section>
  )
}
