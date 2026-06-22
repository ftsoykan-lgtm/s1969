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

const INTERVAL = 6500

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
    <section className="relative h-[600px] md:h-[760px] overflow-hidden bg-[#071f10]">
      {/* Görsel katmanları — çapraz geçiş + yavaş zoom */}
      {items.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={s.imageUrl} alt="" fill priority={i === current} sizes="100vw"
              className="object-cover"
              style={i === current ? { animation: `kenburns ${INTERVAL + 1200}ms ease-out forwards` } : { transform: 'scale(1.05)' }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#071f10] via-[#071f10]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071f10] via-transparent to-[#071f10]/40" />
        </div>
      ))}

      {/* Sol tricolor aksan */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 flex flex-col z-20">
        <div className="flex-1 bg-[#FFD100]" />
        <div className="flex-1 bg-[#1A6B3C]" />
        <div className="flex-1 bg-white/40" />
      </div>

      {/* İçerik — her geçişte yeniden animasyon (key) */}
      <div className="relative z-10 h-full mx-auto max-w-7xl px-8 sm:px-10 lg:px-14 flex items-center">
        <Link key={current} href={slide.href} className="block max-w-3xl">
          {slide.category && (
            <span className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full bg-[#FFD100]/15 border border-[#FFD100]/40 backdrop-blur-sm text-[#FFD100] text-[11px] font-black tracking-[0.2em] uppercase"
              style={{ animation: 'heroUp 0.6s ease-out 0.05s both' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-pulse" />
              {slide.category}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.0] tracking-tight mb-6 drop-shadow-2xl line-clamp-4"
            style={{ animation: 'heroUp 0.7s ease-out 0.12s both' }}>
            {slide.title}
          </h1>
          <p className="text-white/75 text-lg md:text-xl leading-relaxed mb-8 max-w-xl line-clamp-2"
            style={{ animation: 'heroUp 0.7s ease-out 0.2s both' }}>
            {slide.excerpt}
          </p>
          <span className="inline-flex items-center gap-2 rounded-xl bg-[#FFD100] px-7 py-4 text-sm font-black text-[#071f10] hover:bg-[#e8c000] hover:gap-3 transition-all shadow-xl shadow-[#FFD100]/20 uppercase tracking-wide"
            style={{ animation: 'heroUp 0.7s ease-out 0.28s both' }}>
            Haberi Oku <ArrowRight size={16} />
          </span>
        </Link>
      </div>

      {/* Sağ alt — önizleme navigasyonu (modern) */}
      {n > 1 && (
        <div className="hidden md:flex absolute bottom-8 right-12 z-20 items-end gap-3">
          <div className="text-right mr-1">
            <span className="text-[#FFD100] text-3xl font-black tabular-nums">{String(current + 1).padStart(2, '0')}</span>
            <span className="text-white/40 text-lg font-bold"> / {String(n).padStart(2, '0')}</span>
          </div>
          <div className="flex gap-2.5">
            {items.map((s, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
                className={`group relative w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${i === current ? 'ring-2 ring-[#FFD100] scale-100' : 'opacity-50 hover:opacity-90 scale-95'}`}>
                <Image src={s.imageUrl} alt="" fill sizes="100px" className="object-cover" />
                {i === current && (
                  <span className="absolute bottom-0 left-0 h-1 bg-[#FFD100]" style={{ animation: `heroProg ${INTERVAL}ms linear` }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobil — noktalar */}
      {n > 1 && (
        <div className="md:hidden absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {items.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === current ? '28px' : '8px', backgroundColor: i === current ? '#FFD100' : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes kenburns { from { transform: scale(1.02) } to { transform: scale(1.12) } }
        @keyframes heroUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes heroProg { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  )
}
