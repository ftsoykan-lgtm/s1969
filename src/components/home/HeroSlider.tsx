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
  const [fading, setFading] = useState(false)

  const goTo = useCallback((idx: number) => {
    setFading(true)
    setTimeout(() => { setCurrent(idx); setFading(false) }, 350)
  }, [])
  const next = useCallback(() => goTo((current + 1) % items.length), [current, goTo, items.length])

  useEffect(() => {
    if (items.length < 2) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [next, current, items.length])

  if (!items.length) return null
  const slide = items[current]
  const thumbs = items.slice(0, 4)

  return (
    <section className="relative h-[640px] md:h-[780px] overflow-hidden bg-[#0f4a28]">
      <div className={`absolute inset-0 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        <Image src={slide.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071f10] via-[#0f4a28]/85 to-[#0f4a28]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071f10] via-transparent to-[#071f10]/30" />
      </div>

      <div className="absolute left-0 top-0 bottom-0 w-1.5 flex flex-col z-10">
        <div className="flex-1 bg-[#FFD100]" />
        <div className="flex-1 bg-[#1A6B3C]" />
        <div className="flex-1 bg-white/40" />
      </div>

      <div className="relative h-full mx-auto max-w-7xl px-8 sm:px-10 lg:px-12 flex items-center">
        <Link href={slide.href} className={`block max-w-3xl transition-all duration-500 ${fading ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
          {slide.category && (
            <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-[#FFD100]/15 border border-[#FFD100]/40 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-pulse" />
              <span className="text-[#FFD100] text-xs font-black tracking-[0.2em] uppercase">{slide.category}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.0] tracking-tight mb-6 drop-shadow-2xl line-clamp-4">
            {slide.title}
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-9 max-w-xl line-clamp-2">{slide.excerpt}</p>
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#FFD100] px-7 py-4 text-sm font-black text-[#0f4a28] hover:bg-[#e8c000] transition-all hover:scale-105 shadow-xl shadow-[#FFD100]/25 uppercase tracking-wide">
            Haberi Oku <ArrowRight size={16} />
          </span>
        </Link>
      </div>

      {/* İlerleme göstergeleri */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-10 lg:left-12 z-10 flex items-center gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
              className="h-1 rounded-full overflow-hidden transition-all duration-300 bg-white/25"
              style={{ width: i === current ? '44px' : '16px' }}>
              {i === current && <span key={current} className="block h-full bg-[#FFD100]" style={{ animation: `heroProg ${INTERVAL}ms linear` }} />}
            </button>
          ))}
        </div>
      )}

      {/* Alt haber küçük kartları */}
      {thumbs.length > 1 && (
        <div className="hidden lg:flex absolute bottom-7 right-12 z-10 gap-2">
          {thumbs.map((n, i) => (
            <button key={i} onClick={() => goTo(i)}
              className={`group relative w-44 h-24 rounded-xl overflow-hidden border transition-all shadow-lg ${i === current ? 'border-[#FFD100]' : 'border-white/15 hover:border-[#FFD100]/60'}`}>
              <Image src={n.imageUrl} alt={n.title} fill sizes="180px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071f10] via-[#071f10]/40 to-transparent" />
              <p className="absolute bottom-0 left-0 right-0 p-2.5 text-white text-[11px] font-bold leading-tight line-clamp-2 text-left">{n.title}</p>
            </button>
          ))}
        </div>
      )}

      <style jsx global>{`@keyframes heroProg { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  )
}
