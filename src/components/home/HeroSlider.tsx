'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  const n = items.length
  const [idx, setIdx] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((i: number) => setIdx(((i % n) + n) % n), [n])
  const next = useCallback(() => setIdx((i) => (i + 1) % n), [n])

  useEffect(() => {
    if (n < 2) return
    timer.current = setInterval(next, INTERVAL)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [next, n, idx])

  if (!n) return null

  const active = items[idx]
  // Yan liste: aktif olmayanlar (en fazla 4), sırayla
  const sideList = Array.from({ length: Math.min(n, 5) }, (_, k) => (idx + k) % n)

  return (
    <section className="bg-[#0f4a28]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.75fr_1fr] gap-4 lg:gap-5">

          {/* ── ÖNE ÇIKAN (sol büyük) ──────────────────────────────── */}
          <Link href={active.href} key={idx} className="group relative block overflow-hidden rounded-2xl">
            <div className="relative h-[360px] md:h-[480px] lg:h-[560px]">
              <Image src={active.imageUrl} alt={active.title} fill priority sizes="(min-width:1024px) 800px, 100vw"
                className="object-cover hero-kb" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#04130b]/55 to-transparent" />

              {/* sayaç köşe rozeti */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#FFD100] text-[#0f4a28] px-3 py-1.5 font-heading font-black text-sm tabular-nums"
                style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}>
                {String(idx + 1).padStart(2, '0')}
                <span className="text-[#0f4a28]/50 text-[11px]">/ {String(n).padStart(2, '0')}</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
                {active.category && (
                  <span className="inline-block bg-[#FFD100] text-[#0f4a28] text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 mb-3"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)', animation: 'hUp .5s ease-out both' }}>
                    {active.category}
                  </span>
                )}
                <h1 className="font-heading text-2xl md:text-4xl lg:text-[2.7rem] font-black text-white leading-[1.1] tracking-tight line-clamp-3 drop-shadow-xl"
                  style={{ animation: 'hUp .6s ease-out .08s both' }}>
                  {active.title}
                </h1>
                <p className="mt-3 text-white/65 text-sm md:text-base leading-relaxed line-clamp-2 max-w-xl"
                  style={{ animation: 'hUp .6s ease-out .16s both' }}>
                  {active.excerpt}
                </p>
                <span className="inline-flex items-center gap-2 mt-5 text-[#0f4a28] bg-[#FFD100] text-[12px] font-black uppercase tracking-wide pl-4 pr-5 py-2.5 group-hover:gap-3 transition-all shadow-[0_3px_12px_rgba(255,209,0,0.3)]"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%)', animation: 'hUp .6s ease-out .24s both' }}>
                  Haberin Devamı <ArrowRight size={15} />
                </span>
              </div>
            </div>
          </Link>

          {/* ── YAN HABER LİSTESİ (sağ) ────────────────────────────── */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 px-1 mb-0.5">
              <span className="w-1 h-4 bg-[#FFD100]" />
              <h2 className="text-[11px] font-black tracking-[0.25em] uppercase text-white/70">Gündem</h2>
            </div>

            {sideList.map((i) => {
              const s = items[i]
              const isActive = i === idx
              return (
                <button key={i} onClick={() => goTo(i)}
                  className={`group relative flex items-center gap-3 text-left rounded-xl overflow-hidden transition-all duration-300 ${
                    isActive ? 'bg-white/[0.09] ring-1 ring-[#FFD100]/40' : 'bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}>
                  {/* aktif sarı sol şerit */}
                  <span className={`absolute left-0 top-0 bottom-0 w-1 bg-[#FFD100] transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />

                  <div className="relative h-[68px] w-[92px] shrink-0 overflow-hidden rounded-lg m-2">
                    <Image src={s.imageUrl} alt="" fill sizes="92px" className="object-cover" />
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-[3px] bg-[#FFD100]" style={{ animation: `hProg ${INTERVAL}ms linear` }} />
                    )}
                  </div>

                  <div className="min-w-0 py-2 pr-3 flex-1">
                    {s.category && (
                      <span className="text-[#FFD100] text-[9px] font-black tracking-[0.2em] uppercase">{s.category}</span>
                    )}
                    <p className={`text-sm font-bold leading-snug line-clamp-2 mt-0.5 transition-colors ${isActive ? 'text-white' : 'text-white/65 group-hover:text-white'}`}>
                      {s.title}
                    </p>
                  </div>
                </button>
              )
            })}

            <Link href="/haberler"
              className="mt-1 flex items-center justify-center gap-2 text-[11px] font-black tracking-[0.15em] uppercase text-[#0f4a28] bg-[#FFD100] hover:brightness-105 py-3 rounded-xl transition-all">
              Tüm Haberler <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes hProg { from { width: 0% } to { width: 100% } }
        @keyframes hUp { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes hKenBurns { from { transform: scale(1.05) } to { transform: scale(1.12) } }
        .hero-kb { animation: hKenBurns 7s ease-out both; }
      `}</style>
    </section>
  )
}
