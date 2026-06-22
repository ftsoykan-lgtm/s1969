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
const SLOT = 78 // aktif slayt genişliği (%)

export default function HeroSlider({ items }: { items: HeroItem[] }) {
  const n = items.length
  // Sonsuz döngü için 3 kopya; başlangıç ortadaki kopyada
  const [idx, setIdx] = useState(n)
  const [anim, setAnim] = useState(true)
  const logical = ((idx % n) + n) % n

  const move = useCallback((dir: number) => { setAnim(true); setIdx((i) => i + dir) }, [])
  const next = useCallback(() => move(1), [move])
  const goTo = (target: number) => { setAnim(true); setIdx((i) => i + (target - (((i % n) + n) % n))) }

  // Otomatik oynatma
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    if (n < 2) return
    timer.current = setInterval(next, INTERVAL)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [next, n])

  // Kenara gelince görünmez şekilde ortaya sıçra
  const onEnd = () => {
    if (idx >= 2 * n) { setAnim(false); setIdx(idx - n) }
    else if (idx < n) { setAnim(false); setIdx(idx + n) }
  }
  useEffect(() => { if (!anim) { const r = requestAnimationFrame(() => setAnim(true)); return () => cancelAnimationFrame(r) } }, [anim])

  if (!n) return null
  const tripled = [...items, ...items, ...items]
  const translate = (100 - SLOT) / 2 - idx * SLOT

  return (
    <section className="relative bg-[#0f4a28] pb-6 overflow-hidden">
      <div className="relative h-[480px] md:h-[660px]">
        <div className="flex h-full" onTransitionEnd={onEnd}
          style={{
            transform: `translateX(${translate}%)`,
            transition: anim ? 'transform 700ms cubic-bezier(0.65,0,0.35,1)' : 'none',
          }}>
          {tripled.map((slide, i) => {
            const aktif = i === idx
            return (
              <div key={i} className="shrink-0 h-full" style={{ width: `${SLOT}%` }}>
                <div className="relative h-full overflow-hidden">
                  <Image src={slide.imageUrl} alt={slide.title} fill priority={i === n} sizes="78vw" className="object-cover" />

                  {aktif ? (
                    <Link href={slide.href} className="absolute inset-0 block group">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0e]/95 via-[#0b0b0e]/15 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0e]/45 via-transparent to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 lg:p-12">
                        <div className="max-w-2xl" key={logical}>
                          {slide.category && (
                            <div className="flex items-center gap-3 mb-3" style={{ animation: 'hUp .5s ease-out both' }}>
                              <span className="block w-8 h-px bg-[#FFD100]" />
                              <span className="text-[#FFD100] text-[11px] font-bold tracking-[0.3em] uppercase">{slide.category}</span>
                            </div>
                          )}
                          <h1 className="text-2xl md:text-4xl lg:text-[2.6rem] font-black text-white leading-[1.12] tracking-tight line-clamp-3 drop-shadow-xl"
                            style={{ animation: 'hUp .6s ease-out .08s both' }}>
                            {slide.title}
                          </h1>
                          <p className="mt-3 text-white/65 text-sm md:text-base lg:text-lg leading-relaxed line-clamp-2 max-w-2xl"
                            style={{ animation: 'hUp .6s ease-out .16s both' }}>
                            {slide.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-2 mt-5 text-[#FFD100] text-[13px] font-black uppercase tracking-wide group-hover:gap-3 transition-all"
                            style={{ animation: 'hUp .6s ease-out .24s both' }}>
                            Haberin Devamı <ArrowRight size={15} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <button onClick={() => goTo(((i % n) + n) % n)} aria-label={slide.title} className="absolute inset-0 flex items-end p-5 text-left">
                      <span className="absolute inset-0 bg-[#0b0b0e]/82" />
                      <span className="relative text-white/45 text-sm font-bold leading-snug line-clamp-3">{slide.title}</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Alt orta — ‹ noktalar › */}
      {n > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button onClick={() => move(-1)} aria-label="Önceki"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#FFD100]/60 text-[#FFD100] hover:bg-[#FFD100] hover:text-[#0f4a28] transition-all">
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
                className="h-2 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === logical ? '40px' : '8px', backgroundColor: i === logical ? 'rgba(255,209,0,0.25)' : 'rgba(255,255,255,0.25)' }}>
                {i === logical && <span key={idx} className="block h-full rounded-full bg-[#FFD100]" style={{ animation: `hProg ${INTERVAL}ms linear` }} />}
              </button>
            ))}
          </div>
          <button onClick={() => move(1)} aria-label="Sonraki"
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#FFD100]/60 text-[#FFD100] hover:bg-[#FFD100] hover:text-[#0f4a28] transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes hProg { from { width: 0% } to { width: 100% } }
        @keyframes hUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </section>
  )
}
