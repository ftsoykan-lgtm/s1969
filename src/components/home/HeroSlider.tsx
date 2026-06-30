'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'

export interface HeroItem {
  title: string
  excerpt: string
  imageUrl: string
  href: string
  category?: string
}

const INTERVAL = 6000
const SWIPE_THRESHOLD = 50

/* Yüklenirken beyaz flash yerine koyu-yeşil bulanık placeholder (zeminle uyumlu) */
const BLUR =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Crect width='100%25' height='100%25' fill='%23081f12'/%3E%3C/svg%3E"

/* Yön-duyarlı sinematik geçiş: gelen görsel büyüyerek+netleşerek girer, giden hafifçe çıkar */
const imgVariants = {
  enter: (dir: number) => ({ opacity: 0, scale: 1.06, x: dir >= 0 ? '5%' : '-5%', filter: 'blur(10px)' }),
  center: { opacity: 1, scale: 1, x: '0%', filter: 'blur(0px)' },
  exit: (dir: number) => ({ opacity: 0, scale: 1.03, x: dir >= 0 ? '-3%' : '3%', filter: 'blur(8px)' }),
}

/* Aktif slaytın ilerleme barı — JS sürücülü, hover/sekme ile duraklar, dolunca onComplete tetikler */
function ProgressBar({ paused, onComplete }: { paused: boolean; onComplete: () => void }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const elapsed = useRef(0)

  useEffect(() => {
    let raf = 0
    let last: number | null = null
    const tick = (now: number) => {
      if (last === null) last = now
      if (!paused) elapsed.current += now - last
      last = now
      const p = Math.min(1, elapsed.current / INTERVAL)
      if (ref.current) ref.current.style.width = `${p * 100}%`
      if (p >= 1) { onComplete(); return }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paused, onComplete])

  return (
    <span className="relative h-3 w-20 rounded-full overflow-hidden ring-1 ring-ugold/50"
      style={{ backgroundColor: 'var(--c-ugreen)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.25)' }}>
      <span ref={ref} className="absolute inset-y-0 left-0 rounded-full"
        style={{ width: '0%', backgroundColor: 'var(--c-ugold)', boxShadow: '0 0 8px var(--c-ugold)' }} />
    </span>
  )
}

export default function HeroSlider({ items }: { items: HeroItem[] }) {
  const n = items.length
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)
  const paused = hovered || tabHidden

  const paginate = useCallback((d: number) => { setDir(d); setIdx((i) => (((i + d) % n) + n) % n) }, [n])
  const next = useCallback(() => paginate(1), [paginate])
  const prev = useCallback(() => paginate(-1), [paginate])
  const goTo = useCallback((i: number) => { setIdx((cur) => { setDir(i > cur ? 1 : -1); return ((i % n) + n) % n }) }, [n])

  // Sekme arka plandayken otomatik geçişi durdur
  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Klavye okları ile gezinme (form alanlarına dokunma)
  useEffect(() => {
    if (n < 2) return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev, n])

  // Swipe / sürükle — link tıklamasını yutmadan
  const startX = useRef(0)
  const moved = useRef(false)
  const onPointerDown = (e: React.PointerEvent) => { startX.current = e.clientX; moved.current = false }
  const onPointerMove = (e: React.PointerEvent) => { if (Math.abs(e.clientX - startX.current) > 8) moved.current = true }
  const onPointerUp = (e: React.PointerEvent) => {
    const dx = e.clientX - startX.current
    if (dx > SWIPE_THRESHOLD) prev()
    else if (dx < -SWIPE_THRESHOLD) next()
  }
  const onClickCapture = (e: React.MouseEvent) => { if (moved.current) { e.preventDefault(); e.stopPropagation() } }

  if (!n) return null

  const active = items[idx]
  const prevItem = items[(idx - 1 + n) % n]
  const nextItem = items[(idx + 1) % n]

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative bg-[#081f12] overflow-hidden"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onTouchStart={() => setHovered(true)}
        onTouchEnd={() => setHovered(false)} onTouchCancel={() => setHovered(false)}>
        {/* slayt değişimini ekran okuyucuya bildir */}
        <span className="sr-only" aria-live="polite">{`Slayt ${idx + 1} / ${n}: ${active.title}`}</span>

        <div className="relative h-[420px] sm:h-[540px] lg:h-[calc(100vh-188px)] lg:min-h-[600px] lg:max-h-[900px]">

          {/* ── SOL komşu (kenardan sızar) ───────────────────────────── */}
          {n > 1 && (
            <button onClick={prev} aria-label="Önceki haber"
              className="hidden md:block absolute left-0 top-0 bottom-0 w-[20%] z-10 group overflow-hidden">
              <Image src={prevItem.imageUrl} alt="" fill sizes="50vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              <span className="absolute inset-0 bg-[#04130b]/70 group-hover:bg-[#04130b]/55 transition-colors" />
              <span className="absolute bottom-6 left-4 right-8 text-left transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <span className="block text-white/80 text-sm font-bold leading-snug line-clamp-3 drop-shadow">{prevItem.title}</span>
              </span>
            </button>
          )}

          {/* ── SAĞ komşu (kenardan sızar) ───────────────────────────── */}
          {n > 1 && (
            <button onClick={next} aria-label="Sonraki haber"
              className="hidden md:block absolute right-0 top-0 bottom-0 w-[20%] z-10 group overflow-hidden">
              <Image src={nextItem.imageUrl} alt="" fill sizes="50vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              <span className="absolute inset-0 bg-[#04130b]/70 group-hover:bg-[#04130b]/55 transition-colors" />
              <span className="absolute bottom-6 right-4 left-8 text-right transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <span className="block text-white/80 text-sm font-bold leading-snug line-clamp-3 drop-shadow">{nextItem.title}</span>
              </span>
            </button>
          )}

          {/* ── ORTA: büyük aktif haber ──────────────────────────────── */}
          <div
            className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-full md:w-[64%] z-20 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)] touch-pan-y select-none"
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onClickCapture={onClickCapture}>

            {/* Görsel katmanı — yön-duyarlı sinematik geçiş */}
            <AnimatePresence custom={dir} initial={false} mode="sync">
              <motion.div key={idx} custom={dir} variants={imgVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 will-change-transform">
                {/* Ken Burns ayrı sarmalda — motion transform'u ile çakışmaz */}
                <div className="absolute inset-0 hero-kb motion-reduce:animate-none">
                  <Image src={active.imageUrl} alt={active.title} fill priority={idx === 0}
                    sizes="(max-width:768px) 100vw, 64vw" placeholder="blur" blurDataURL={BLUR}
                    className="object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/30 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Görselin tamamı habere tıklanabilir (içerik + nav daha üstte) */}
            <Link href={active.href} aria-label={active.title} className="absolute inset-0 z-[15]" />

            <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 lg:p-10 pointer-events-none">
              <div className="group block max-w-3xl border-l-4 border-ugold pl-5 sm:pl-6 pointer-events-auto" key={idx}>
                {active.category && (
                  <span className="hAnim1 inline-block bg-ugold text-ugreend text-[11px] font-extrabold tracking-[0.18em] uppercase px-3.5 py-1.5 mb-4">
                    {active.category}
                  </span>
                )}
                <Link href={active.href} className="block">
                  <h1 className="hAnim2 font-heading text-3xl sm:text-4xl lg:text-[3.2rem] font-extrabold text-white leading-[1.02] tracking-[-0.02em] line-clamp-3 drop-shadow-xl">
                    {active.title}
                  </h1>
                </Link>
                <p className="hAnim3 mt-3 text-white/65 text-sm sm:text-base leading-relaxed line-clamp-2 max-w-xl hidden sm:block">
                  {active.excerpt}
                </p>
                <Link href={active.href}
                  className="hAnim4 group/cta mt-4 hidden sm:inline-flex items-center gap-1.5 text-ugold text-[13px] font-extrabold uppercase tracking-widest">
                  Haberi Oku
                  <ArrowUpRight size={15} className="transition-transform duration-300 group-hover/cta:translate-x-1 group-hover/cta:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* ── Navigasyon şeridi (premium · navbar diliyle uyumlu) ──────── */}
        {n > 1 && (
          <div className="relative bg-gradient-to-b from-ugreens to-ugreen">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-ugold/40 to-transparent" />
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-center gap-4 sm:gap-5">

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
                    return <ProgressBar key={idx} paused={paused} onComplete={next} />
                  }
                  const past = i < idx
                  return (
                    <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 hover:scale-125 ${
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
    </MotionConfig>
  )
}
