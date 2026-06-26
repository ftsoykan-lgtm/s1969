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
  const num = (i: number) => String(i + 1).padStart(2, '0')

  return (
    <section className="relative bg-[#0f4226]">
      <div className="grid lg:grid-cols-[1fr_380px]">

        {/* ── SOL: büyük aktif haber ───────────────────────────────── */}
        <div className="relative h-[440px] sm:h-[520px] lg:h-[600px] overflow-hidden">
          {items.map((slide, i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-[800ms] ease-out"
              style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 10 : 0 }}>
              <Image src={slide.imageUrl} alt={slide.title} fill priority={i === 0} sizes="(max-width:1024px) 100vw, 70vw"
                className={`object-cover ${i === idx ? 'hero-kb' : ''}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#04130b]/60 via-transparent to-transparent" />
            </div>
          ))}

          {/* İçerik (alt-sol) */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 lg:p-10">
            <Link href={active.href} className="group block max-w-2xl" key={idx}>
              {active.category && (
                <span className="inline-block bg-[#FFD100] text-[#0f4a28] text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 mb-3"
                  style={{ animation: 'hUp .5s ease-out both' }}>
                  {active.category}
                </span>
              )}
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-[2.7rem] font-extrabold text-white leading-[1.08] tracking-tight line-clamp-3 drop-shadow-xl"
                style={{ animation: 'hUp .6s ease-out .08s both' }}>
                {active.title}
              </h1>
              <p className="mt-3 text-white/65 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-xl hidden sm:block"
                style={{ animation: 'hUp .6s ease-out .16s both' }}>
                {active.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 mt-5 text-[#0f4a28] bg-[#FFD100] text-[12px] font-bold uppercase tracking-wide px-5 py-2.5 group-hover:gap-3 transition-all"
                style={{ animation: 'hUp .6s ease-out .24s both' }}>
                Devamını Oku <ArrowRight size={15} />
              </span>
            </Link>
          </div>

          {/* Sayaç + oklar (sağ alt) */}
          {n > 1 && (
            <div className="absolute bottom-5 right-5 z-20 flex items-center gap-3">
              <span className="font-heading font-extrabold text-white text-sm tabular-nums drop-shadow">
                {num(idx)}<span className="text-white/40"> / {String(n).padStart(2, '0')}</span>
              </span>
              <div className="flex gap-1.5">
                <button onClick={prev} aria-label="Önceki"
                  className="h-9 w-9 flex items-center justify-center bg-white/10 hover:bg-[#FFD100] text-white hover:text-[#0f4a28] backdrop-blur-sm border border-white/20 transition-all">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={next} aria-label="Sonraki"
                  className="h-9 w-9 flex items-center justify-center bg-white/10 hover:bg-[#FFD100] text-white hover:text-[#0f4a28] backdrop-blur-sm border border-white/20 transition-all">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── SAĞ: haber oynatma listesi (Trabzonspor tarzı) ───────── */}
        <div className="hidden lg:flex flex-col bg-[#0f4226] border-l border-white/[0.06]">
          <div className="px-5 py-4 border-b border-white/[0.07] flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-[#FFD100]" />
            <h2 className="text-[11px] font-black tracking-[0.2em] uppercase text-white">Son Haberler</h2>
          </div>
          <div className="flex-1 flex flex-col">
            {items.map((s, i) => {
              const on = i === idx
              return (
                <button key={i} onClick={() => goTo(i)}
                  className={`relative group flex items-center gap-3 text-left px-4 py-3 flex-1 border-b border-white/[0.05] transition-colors ${
                    on ? 'bg-[#1A6B3C]' : 'hover:bg-white/[0.04]'
                  }`}>
                  {on && <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFD100]" />}
                  <div className="relative w-20 h-14 shrink-0 overflow-hidden">
                    <Image src={s.imageUrl} alt="" fill sizes="80px" className="object-cover" />
                    {!on && <span className="absolute inset-0 bg-[#04130b]/40 group-hover:bg-transparent transition-colors" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    {s.category && <span className={`block text-[9px] font-bold tracking-wide uppercase mb-0.5 ${on ? 'text-[#FFD100]' : 'text-[#FFD100]/60'}`}>{s.category}</span>}
                    <span className={`block text-[13px] font-bold leading-snug line-clamp-2 ${on ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}>{s.title}</span>
                  </div>
                  {on && n > 1 && (
                    <span className="absolute bottom-0 left-0 h-[3px] bg-[#FFD100]" style={{ animation: `hProg ${INTERVAL}ms linear` }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Mobil nokta göstergeleri */}
      {n > 1 && (
        <div className="lg:hidden flex items-center justify-center gap-2 py-3.5 bg-[#0f4226]">
          {items.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
              className="h-2 transition-all duration-300"
              style={{ width: i === idx ? '28px' : '8px', backgroundColor: i === idx ? '#FFD100' : 'rgba(255,255,255,0.25)' }} />
          ))}
        </div>
      )}

      {/* Alt ince altın hat */}
      <div className="h-[3px] bg-[#FFD100]" />

      <style jsx global>{`
        @keyframes hProg { from { width: 0% } to { width: 100% } }
        @keyframes hUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes hKenBurns { from { transform: scale(1.05) } to { transform: scale(1.12) } }
        .hero-kb { animation: hKenBurns 7s ease-out both; }
      `}</style>
    </section>
  )
}
