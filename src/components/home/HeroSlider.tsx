'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface HeroItem {
  title: string
  excerpt: string
  imageUrl: string
  href: string
  category?: string
}

const INTERVAL = 6000

/* Aktif slaytın ilerleme barı — TAMAMEN JS sürücülü (keyframe/Tailwind animasyonu YOK).
   Sarı zemin + yeşil dolum. Mount olunca 0→100 genişlik transition'ı ile slayt süresince dolar. */
function ProgressBar() {
  const ref = useRef<HTMLSpanElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let start: number | null = null
    const tick = (now: number) => {
      if (start === null) start = now
      const p = Math.min(1, (now - start) / INTERVAL)
      el.style.width = `${p * 100}%`
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <span className="relative h-3 w-20 rounded-full overflow-hidden ring-1 ring-ugold/50"
      style={{ backgroundColor: 'var(--c-ugreen)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.25)' }}>
      <span ref={ref} className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: '0%', backgroundColor: 'var(--c-ugold)' }} />
    </span>
  )
}

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
  const prevItem = items[(idx - 1 + n) % n]
  const nextItem = items[(idx + 1) % n]

  return (
    <section className="relative bg-[#081f12] overflow-hidden">
      <div className="relative h-[420px] sm:h-[540px] lg:h-[calc(100vh-188px)] lg:min-h-[600px] lg:max-h-[900px]">

        {/* ── SOL komşu (kenardan sızar) ───────────────────────────── */}
        {n > 1 && (
          <button onClick={prev} aria-label="Önceki haber"
            className="hidden md:block absolute left-0 top-0 bottom-0 w-[20%] z-10 group">
            <Image src={prevItem.imageUrl} alt="" fill sizes="50vw" className="object-cover" />
            <span className="absolute inset-0 bg-[#04130b]/70 group-hover:bg-[#04130b]/55 transition-colors" />
            <span className="absolute bottom-6 left-4 right-8 text-left">
              <span className="block text-white/80 text-sm font-bold leading-snug line-clamp-3 drop-shadow">{prevItem.title}</span>
            </span>
          </button>
        )}

        {/* ── SAĞ komşu (kenardan sızar) ───────────────────────────── */}
        {n > 1 && (
          <button onClick={next} aria-label="Sonraki haber"
            className="hidden md:block absolute right-0 top-0 bottom-0 w-[20%] z-10 group">
            <Image src={nextItem.imageUrl} alt="" fill sizes="50vw" className="object-cover" />
            <span className="absolute inset-0 bg-[#04130b]/70 group-hover:bg-[#04130b]/55 transition-colors" />
            <span className="absolute bottom-6 right-4 left-8 text-right">
              <span className="block text-white/80 text-sm font-bold leading-snug line-clamp-3 drop-shadow">{nextItem.title}</span>
            </span>
          </button>
        )}

        {/* ── ORTA: büyük aktif haber ──────────────────────────────── */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full md:w-[64%] z-20 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)]">
          {items.map((s, i) => (
            <div key={i} className="absolute inset-0 transition-opacity duration-[800ms] ease-out"
              style={{ opacity: i === idx ? 1 : 0, zIndex: i === idx ? 10 : 0 }}>
              <Image src={s.imageUrl} alt={s.title} fill priority={i === 0} sizes="(max-width:768px) 100vw, 64vw"
                className={`object-cover ${i === idx ? 'hero-kb' : ''}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/30 to-transparent" />
            </div>
          ))}

          {/* Görselin tamamı habere tıklanabilir (içerik + nav daha üstte) */}
          <Link href={active.href} aria-label={active.title} className="absolute inset-0 z-[15]" />

          <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 lg:p-10">
            <Link href={active.href} className="group block max-w-3xl border-l-4 border-ugold pl-5 sm:pl-6" key={idx}>
              {active.category && (
                <span className="inline-block bg-ugold text-ugreend text-[11px] font-extrabold tracking-[0.18em] uppercase px-3.5 py-1.5 mb-4"
                  style={{ animation: 'hUp .5s ease-out both' }}>
                  {active.category}
                </span>
              )}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[3.2rem] font-extrabold text-white leading-[1.02] tracking-[-0.02em] line-clamp-3 drop-shadow-xl"
                style={{ animation: 'hUp .6s ease-out .08s both' }}>
                {active.title}
              </h1>
              <p className="mt-3 text-white/65 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-xl hidden sm:block"
                style={{ animation: 'hUp .6s ease-out .16s both' }}>
                {active.excerpt}
              </p>
            </Link>
          </div>
        </div>

      </div>

      {/* ── Navigasyon şeridi (premium · navbar diliyle uyumlu) ──────── */}
      {n > 1 && (
        <div className="relative bg-gradient-to-b from-ugreens to-ugreen">
          {/* üst altın saç çizgisi — navbar ile aynı */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ugold/40 to-transparent" />
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-center gap-4 sm:gap-5">

            {/* slayt sayacı (premium dokunuş) — yalnız geniş ekran */}
            <span className="hidden sm:block font-heading font-extrabold tabular-nums text-white/90 text-sm tracking-wide">
              {String(idx + 1).padStart(2, '0')}<span className="text-ugold/70"> / {String(n).padStart(2, '0')}</span>
            </span>

            <button onClick={prev} aria-label="Önceki"
              className="h-10 w-10 flex items-center justify-center rounded-full border border-white/25 text-white hover:bg-ugold hover:text-ugreend hover:border-ugold transition-all">
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2.5">
              {items.map((_, i) => {
                if (i === idx) {
                  // Aktif: SARI zemin + YEŞİL dolum (JS sürücülü) — slayt süresince dolar, dolunca geçer
                  return <ProgressBar key={idx} />
                }
                const past = i < idx
                return (
                  <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      past ? 'bg-ugold hover:brightness-110' : 'border border-white/35 hover:border-ugold hover:bg-ugold/40'
                    }`} />
                )
              })}
            </div>

            <button onClick={next} aria-label="Sonraki"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-ugold text-ugreend shadow-[0_4px_14px_-4px_rgba(0,0,0,0.5)] hover:brightness-105 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

    </section>
  )
}
