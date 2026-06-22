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

const INTERVAL = 7000

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

  // Merkez odaklı kayan şerit: aktif slayt ortada, komşular kenardan görünür
  const SLOT = 80 // her slayt slotu (% genişlik)
  const translate = 10 - current * SLOT

  return (
    <section className="relative bg-[#0a0a0c] py-6 md:py-8 overflow-hidden">
      {/* Şerit */}
      <div className="relative h-[460px] md:h-[600px]">
        <div className="flex h-full transition-transform duration-[600ms] ease-out"
          style={{ transform: `translateX(${translate}%)` }}>
          {items.map((slide, i) => {
            const aktif = i === current
            return (
              <div key={i} className="w-[78%] mx-[1%] shrink-0 h-full">
                <div className={`relative h-full rounded-2xl overflow-hidden transition-all duration-500 ${
                  aktif ? 'opacity-100 scale-100' : 'opacity-35 scale-[0.97]'
                }`}>
                  <Image src={slide.imageUrl} alt={slide.title} fill priority={aktif} sizes="80vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c]/95 via-[#0a0a0c]/55 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/90 via-transparent to-transparent" />

                  {/* İçerik — yalnızca aktif slaytta tıklanabilir */}
                  <div className={`absolute inset-0 flex items-end transition-opacity duration-500 ${aktif ? 'opacity-100' : 'opacity-0'}`}>
                    <Link href={aktif ? slide.href : '#'} className="block p-7 md:p-12 max-w-2xl"
                      tabIndex={aktif ? 0 : -1} aria-hidden={!aktif}>
                      {slide.category && (
                        <span className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-[#FFD100]/15 border border-[#FFD100]/40 backdrop-blur-sm text-[#FFD100] text-[11px] font-black tracking-[0.2em] uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-pulse" />
                          {slide.category}
                        </span>
                      )}
                      <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.05] tracking-tight mb-4 drop-shadow-2xl line-clamp-3">
                        {slide.title}
                      </h1>
                      <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6 line-clamp-2 max-w-xl">{slide.excerpt}</p>
                      <span className="inline-flex items-center gap-2 rounded-xl bg-[#FFD100] px-6 py-3.5 text-sm font-black text-[#0a0a0c] hover:bg-[#e8c000] transition-all shadow-xl uppercase tracking-wide">
                        Haberi Oku <ArrowRight size={16} />
                      </span>
                    </Link>
                  </div>

                  {/* Komşuya tıklayınca ona geç */}
                  {!aktif && (
                    <button onClick={() => goTo(i)} aria-label="Slayta git" className="absolute inset-0" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Alt kontroller — ‹ noktalar › */}
      {n > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={prev} aria-label="Önceki"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFD100]/50 text-[#FFD100] hover:bg-[#FFD100] hover:text-[#0a0a0c] transition-all">
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
                className="h-1.5 rounded-full overflow-hidden transition-all duration-300 bg-white/20"
                style={{ width: i === current ? '40px' : '8px' }}>
                {i === current && (
                  <span key={current} className="block h-full bg-[#FFD100]" style={{ animation: `heroProg ${INTERVAL}ms linear` }} />
                )}
              </button>
            ))}
          </div>

          <button onClick={next} aria-label="Sonraki"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FFD100]/50 text-[#FFD100] hover:bg-[#FFD100] hover:text-[#0a0a0c] transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <style jsx global>{`@keyframes heroProg { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  )
}
