'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { ClubInfo } from '@/data/club'

export interface HeroItem {
  title: string
  excerpt: string
  href: string
  category?: string
}

const INTERVAL = 6000

export default function HeroVideo({ club, src, items = [] }: { club: ClubInfo; src: string; items?: HeroItem[] }) {
  const ref = useRef<HTMLVideoElement>(null)
  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')
  const n = items.length

  const [idx, setIdx] = useState(0)
  const go = useCallback((i: number) => setIdx(((i % n) + n) % n), [n])

  // Otomatik oynatmayı garanti et (React'te muted attribute'u bazen DOM'a yansımaz)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    v.defaultMuted = true
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [src])

  // Haber otomatik geçişi
  useEffect(() => {
    if (n < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % n), INTERVAL)
    return () => clearInterval(t)
  }, [n, idx])

  const active = n > 0 ? items[idx] : null

  return (
    <section className="relative bg-[#092d18] overflow-hidden">
      <div className="relative h-[62vh] min-h-[440px] md:h-[82vh] md:max-h-[840px]">
        {/* Arka plan video (sabit) */}
        {src ? (
          <video ref={ref} className="absolute inset-0 w-full h-full object-cover"
            src={src} autoPlay muted loop playsInline preload="auto" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_-10%,#1A6B3C_0%,#092d18_60%)]" />
        )}

        {/* Karartma */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/35 to-[#04130b]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04130b]/70 via-[#04130b]/20 to-transparent" />

        {/* Üst sol: marka rozeti */}
        <div className="absolute top-5 left-0 right-0">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 flex items-center gap-3">
            {hasLogo ? (
              <img src={club.logoUrl} alt={club.name} className="h-11 w-11 rounded-xl object-contain bg-white/5 ring-1 ring-white/15" />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD100] text-[#0f4a28] font-black text-xs">{club.shortCode}</div>
            )}
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/60">
              {club.name} <span className="text-[#FFD100]/60">· {club.nickname}</span>
            </p>
          </div>
        </div>

        {/* Ön plan: haber slider */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
            {active ? (
              <Link href={active.href} className="group block max-w-2xl" key={idx}>
                {active.category && (
                  <span className="inline-block bg-[#FFD100] text-[#0f4a28] text-[10px] font-black tracking-[0.2em] uppercase px-3 py-1 mb-3 hero-up"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
                    {active.category}
                  </span>
                )}
                <h1 className="font-heading text-2xl md:text-4xl lg:text-[2.9rem] font-black text-white leading-[1.08] tracking-tight line-clamp-3 drop-shadow-2xl hero-up"
                  style={{ animationDelay: '.08s' }}>
                  {active.title}
                </h1>
                {active.excerpt && (
                  <p className="mt-3 text-white/70 text-sm md:text-lg leading-relaxed line-clamp-2 max-w-xl hero-up" style={{ animationDelay: '.16s' }}>
                    {active.excerpt}
                  </p>
                )}
                <span className="inline-flex items-center gap-2 mt-5 text-[#0f4a28] bg-[#FFD100] text-[12px] font-black uppercase tracking-wide pl-4 pr-5 py-2.5 group-hover:gap-3 transition-all shadow-lg shadow-[#FFD100]/20 hero-up"
                  style={{ clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%)', animationDelay: '.24s' }}>
                  Haberin Devamı <ArrowRight size={15} />
                </span>
              </Link>
            ) : (
              // Haber yoksa: marka başlığı
              <div className="max-w-2xl">
                <h1 className="font-heading text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-[0.95] drop-shadow-2xl">{club.name}</h1>
                <p className="mt-3 text-[#FFD100]/70 text-xs font-black tracking-[0.3em] uppercase">Est. {club.founded} · {club.nickname} · {club.league}</p>
              </div>
            )}

            {/* Göstergeler */}
            {n > 1 && (
              <div className="flex items-center gap-2 mt-7">
                {items.map((_, i) => (
                  <button key={i} onClick={() => go(i)} aria-label={`Haber ${i + 1}`}
                    className="h-1.5 rounded-full overflow-hidden transition-all duration-300"
                    style={{ width: i === idx ? 40 : 10, backgroundColor: i === idx ? 'rgba(255,209,0,0.3)' : 'rgba(255,255,255,0.3)' }}>
                    {i === idx && <span key={idx} className="block h-full rounded-full bg-[#FFD100]" style={{ animation: `heroProg ${INTERVAL}ms linear` }} />}
                  </button>
                ))}
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
