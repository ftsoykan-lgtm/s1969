'use client'

import { useState, useEffect, useCallback } from 'react'
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
  const [current, setCurrent] = useState(0)
  const n = items.length

  const goTo = useCallback((idx: number) => setCurrent((idx + n) % n), [n])
  const next = useCallback(() => setCurrent((c) => (c + 1) % n), [n])
  const prev = () => goTo(current - 1)

  useEffect(() => {
    if (n < 2) return
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [next, current, n])

  if (!n) return null

  // Merkez odaklı şerit: aktif ortada, komşular kenardan görünür
  const SLOT = 74           // slayt slotu (%)
  const translate = (100 - SLOT) / 2 - current * SLOT

  return (
    <section className="relative bg-[#0b0b0e] pt-5 md:pt-7 pb-6 overflow-hidden">
      <div className="relative h-[440px] md:h-[600px]">
        <div className="flex h-full transition-transform duration-700"
          style={{ transform: `translateX(${translate}%)`, transitionTimingFunction: 'cubic-bezier(0.65,0,0.35,1)' }}>
          {items.map((slide, i) => {
            const aktif = i === current
            return (
              <div key={i} className="shrink-0 h-full px-1.5 md:px-2.5" style={{ width: `${SLOT}%` }}>
                <div className={`relative h-full rounded-2xl overflow-hidden transition-all duration-700 ${aktif ? 'opacity-100' : 'opacity-30'}`}>
                  <Image src={slide.imageUrl} alt={slide.title} fill priority={aktif} sizes="75vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e] via-[#0b0b0e]/30 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0e]/70 via-transparent to-transparent" />

                  {/* İçerik */}
                  <div className={`absolute inset-x-0 bottom-0 p-6 md:p-10 transition-all duration-500 ${aktif ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="max-w-2xl">
                      {slide.category && (
                        <div className="flex items-center gap-3 mb-3">
                          <span className="block w-8 h-px bg-[#FFD100]" />
                          <span className="text-[#FFD100] text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase">{slide.category}</span>
                        </div>
                      )}
                      <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-[1.08] tracking-tight line-clamp-3 drop-shadow-xl">
                        {slide.title}
                      </h1>
                      <p className="hidden md:block mt-3 text-white/60 text-base leading-relaxed line-clamp-2 max-w-xl">{slide.excerpt}</p>
                      {aktif && (
                        <Link href={slide.href}
                          className="inline-flex items-center gap-2 mt-5 rounded-lg bg-[#FFD100] px-5 py-2.5 text-[13px] font-black text-[#0b0b0e] hover:bg-[#e8c000] transition-all uppercase tracking-wide">
                          Haberi Oku <ArrowRight size={15} />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Komşuya tıkla */}
                  {!aktif && <button onClick={() => goTo(i)} aria-label="Slayta git" className="absolute inset-0 cursor-pointer" />}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Alt orta — ‹ noktalar › */}
      {n > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} aria-label="Önceki"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#FFD100]/60 text-[#FFD100] hover:bg-[#FFD100] hover:text-[#0b0b0e] transition-all">
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
                className="h-2 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === current ? '40px' : '8px', backgroundColor: i === current ? 'rgba(255,209,0,0.25)' : 'rgba(255,255,255,0.25)' }}>
                {i === current && <span key={current} className="block h-full rounded-full bg-[#FFD100]" style={{ animation: `hProg ${INTERVAL}ms linear` }} />}
              </button>
            ))}
          </div>

          <button onClick={next} aria-label="Sonraki"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#FFD100]/60 text-[#FFD100] hover:bg-[#FFD100] hover:text-[#0b0b0e] transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <style jsx global>{`@keyframes hProg { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  )
}
