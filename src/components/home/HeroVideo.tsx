'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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

  return (
    <section className="relative bg-[#092d18] overflow-hidden">
      <div className="relative h-[64vh] min-h-[460px] md:h-[84vh] md:max-h-[860px]">
        {/* Arka plan video */}
        {src ? (
          <video ref={ref} className="absolute inset-0 w-full h-full object-cover"
            src={src} autoPlay muted loop playsInline preload="auto" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_-10%,#1A6B3C_0%,#092d18_60%)]" />
        )}

        {/* Karartma */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04130b]/60 via-transparent to-transparent" />

        {/* Ön plan */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-8 md:pb-10">

            {/* Öne çıkan haber metni */}
            {active ? (
              <Link href={active.href} className="group block max-w-2xl mb-6" key={idx}>
                {active.category && (
                  <span className="inline-flex items-center gap-2 mb-3 hero-up">
                    <span className="w-6 h-0.5 bg-[#FFD100]" />
                    <span className="text-[#FFD100] text-[11px] font-black tracking-[0.25em] uppercase">{active.category}</span>
                  </span>
                )}
                <h1 className="font-heading text-2xl md:text-4xl lg:text-[2.9rem] font-black text-white leading-[1.08] tracking-tight line-clamp-3 drop-shadow-2xl hero-up"
                  style={{ animationDelay: '.06s' }}>
                  {active.title}
                </h1>
                <span className="inline-flex items-center gap-2 mt-4 text-white text-[12px] font-black uppercase tracking-wide group-hover:gap-3 transition-all hero-up"
                  style={{ animationDelay: '.14s' }}>
                  Haberin Devamı
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28]"><ArrowRight size={14} /></span>
                </span>
              </Link>
            ) : (
              <div className="max-w-2xl mb-6">
                <h1 className="font-heading text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-[0.95] drop-shadow-2xl">{club.name}</h1>
              </div>
            )}

            {/* ── Haber akışı — film şeridi ──────────────────────────── */}
            {n > 1 && (
              <div className="relative">
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                  {items.map((it, i) => {
                    const on = i === idx
                    return (
                      <button key={i} onClick={() => go(i)}
                        className={`group relative shrink-0 rounded-xl overflow-hidden text-left transition-all duration-300 ${
                          on ? 'w-56 sm:w-64 ring-2 ring-[#FFD100]' : 'w-40 sm:w-48 opacity-70 hover:opacity-100'
                        }`}
                        style={{ height: 76 }}>
                        {it.imageUrl
                          ? <img src={it.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                          : <span className="absolute inset-0 bg-gradient-to-br from-[#1A6B3C] to-[#0b3a20]" />}
                        <span className="absolute inset-0 bg-gradient-to-t from-[#04130b]/90 via-[#04130b]/40 to-transparent" />
                        <span className="absolute inset-x-0 bottom-0 p-2.5">
                          {it.category && on && <span className="block text-[8px] font-black tracking-widest uppercase text-[#FFD100] mb-0.5">{it.category}</span>}
                          <span className="block text-[11px] font-bold text-white leading-tight line-clamp-2">{it.title}</span>
                        </span>
                        {/* aktif ilerleme çubuğu */}
                        {on && <span key={idx} className="absolute top-0 left-0 h-[3px] bg-[#FFD100]" style={{ animation: `heroProg ${INTERVAL}ms linear` }} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alt altın hat */}
      <div className="h-1 bg-gradient-to-r from-[#1A6B3C] via-[#FFD100] to-[#1A6B3C]" />

      <style jsx global>{`
        @keyframes heroProg { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  )
}
