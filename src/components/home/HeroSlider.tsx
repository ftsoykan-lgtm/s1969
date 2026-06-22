'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export interface HeroItem {
  title: string
  excerpt: string
  imageUrl: string
  href: string
  category?: string
}

const INTERVAL = 7000

export default function HeroSlider({ items }: { items: HeroItem[] }) {
  const [current, setCurrent] = useState(0)
  const n = items.length

  const goTo = useCallback((idx: number) => setCurrent((idx + n) % n), [n])
  const next = useCallback(() => setCurrent((c) => (c + 1) % n), [n])

  useEffect(() => {
    if (n < 2) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [next, current, n])

  if (!n) return null
  const slide = items[current]

  return (
    <section className="relative h-[640px] md:h-[720px] overflow-hidden bg-[#06150d]">
      {/* Arka plan — yumuşak çapraz geçiş */}
      {items.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity ease-in-out ${i === current ? 'opacity-100 duration-[1100ms]' : 'opacity-0 duration-700'}`}>
          <Image src={s.imageUrl} alt="" fill priority={i === current} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06150d] via-[#06150d]/80 to-[#06150d]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06150d]/80 via-transparent to-[#06150d]/30" />
        </div>
      ))}

      <div className="relative z-10 h-full mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
        <div className="h-full grid lg:grid-cols-[1fr_340px] items-center gap-10">

          {/* Sol — içerik */}
          <Link key={current} href={slide.href} className="block max-w-2xl pt-10 lg:pt-0">
            {slide.category && (
              <div className="flex items-center gap-3 mb-6" style={{ animation: 'hUp .6s ease-out .05s both' }}>
                <span className="block w-10 h-px bg-[#FFD100]" />
                <span className="text-[#FFD100] text-[11px] font-bold tracking-[0.35em] uppercase">{slide.category}</span>
              </div>
            )}
            <h1 className="text-4xl md:text-6xl lg:text-[4.25rem] font-black text-white leading-[1.04] tracking-tight mb-6 line-clamp-4"
              style={{ animation: 'hUp .75s ease-out .12s both' }}>
              {slide.title}
            </h1>
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-9 max-w-lg line-clamp-3"
              style={{ animation: 'hUp .75s ease-out .2s both' }}>
              {slide.excerpt}
            </p>
            <span className="group inline-flex items-center gap-3 text-white font-bold text-sm tracking-wide"
              style={{ animation: 'hUp .75s ease-out .28s both' }}>
              <span className="uppercase">Haberin Devamı</span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFD100] text-[#06150d] group-hover:scale-110 transition-transform">
                <ArrowRight size={16} />
              </span>
            </span>
          </Link>

          {/* Sağ — dikey slayt listesi (premium navigasyon) */}
          {n > 1 && (
            <div className="hidden lg:flex flex-col gap-1 self-center">
              {items.map((s, i) => {
                const aktif = i === current
                return (
                  <button key={i} onClick={() => goTo(i)}
                    className={`group relative text-left rounded-xl px-5 py-4 transition-all duration-300 overflow-hidden ${aktif ? 'bg-white/10 backdrop-blur-sm' : 'hover:bg-white/5'}`}>
                    {/* Sol ilerleme çubuğu */}
                    <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/15" />
                    {aktif && (
                      <span className="absolute left-0 top-0 w-0.5 bg-[#FFD100]" style={{ animation: `hProgV ${INTERVAL}ms linear` }} />
                    )}
                    <div className="flex items-start gap-3">
                      <span className={`text-xs font-black tabular-nums mt-0.5 ${aktif ? 'text-[#FFD100]' : 'text-white/30'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        {s.category && <p className={`text-[9px] font-black tracking-[0.2em] uppercase mb-1 ${aktif ? 'text-[#FFD100]/70' : 'text-white/30'}`}>{s.category}</p>}
                        <p className={`text-sm font-bold leading-snug line-clamp-2 transition-colors ${aktif ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>{s.title}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobil — alt ilerleme çubukları */}
      {n > 1 && (
        <div className="lg:hidden absolute bottom-6 left-6 right-6 z-20 flex gap-1.5">
          {items.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
              className="flex-1 h-1 rounded-full overflow-hidden bg-white/20">
              {i === current && <span key={current} className="block h-full bg-[#FFD100]" style={{ animation: `hProgH ${INTERVAL}ms linear` }} />}
            </button>
          ))}
        </div>
      )}

      {/* Sol tricolor aksan */}
      <div className="absolute left-0 top-0 bottom-0 w-1 flex flex-col z-20">
        <div className="flex-1 bg-[#FFD100]" />
        <div className="flex-1 bg-[#1A6B3C]" />
        <div className="flex-1 bg-white/30" />
      </div>

      <style jsx global>{`
        @keyframes hUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes hProgV { from { height: 0% } to { height: 100% } }
        @keyframes hProgH { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  )
}
