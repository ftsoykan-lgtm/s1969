'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'

export interface StoryItem {
  title: string
  category: string
  imageUrl: string
  slug: string
  excerpt: string
}

const DURATION = 6000 // her story süresi (ms)

export default function NewsStories({ items }: { items: StoryItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const raf = useRef<number | null>(null)
  const startRef = useRef(0)

  const close = useCallback(() => { setOpen(null); setProgress(0) }, [])
  const go = useCallback((i: number) => {
    if (i < 0) return close()
    if (i >= items.length) return close()
    setOpen(i); setProgress(0); startRef.current = performance.now()
  }, [items.length, close])

  // Otomatik ilerleme + ilerleme çubuğu
  useEffect(() => {
    if (open === null) return
    startRef.current = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - startRef.current) / DURATION, 1)
      setProgress(p)
      if (p >= 1) { go(open + 1); return }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [open, go])

  // Arka plan kilidi
  useEffect(() => {
    document.body.style.overflow = open !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!items.length) return null
  const active = open !== null ? items[open] : null

  return (
    <>
      {/* ── Story şeridi (sadece mobil) ─────────────────────────── */}
      <div className="lg:hidden bg-white border-b border-[#edf7f2]">
        <div className="px-3 py-3">
          <div className="flex gap-3.5 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            {items.map((s, i) => (
              <button key={i} onClick={() => go(i)} className="flex flex-col items-center gap-1.5 shrink-0 w-[68px]">
                <span className="p-[2.5px] rounded-full bg-gradient-to-tr from-[#FFD100] via-[#1A6B3C] to-[#0f4a28]">
                  <span className="block p-[2px] rounded-full bg-white">
                    <span className="block h-14 w-14 rounded-full overflow-hidden bg-[#f5f9f6]">
                      {s.imageUrl ? <img src={s.imageUrl} alt="" className="w-full h-full object-cover" /> : null}
                    </span>
                  </span>
                </span>
                <span className="text-[10px] font-bold text-[#092d18] text-center leading-tight line-clamp-1 w-full">{s.category}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tam ekran story görüntüleyici ───────────────────────── */}
      {active && open !== null && (
        <div className="lg:hidden fixed inset-0 z-[80] bg-black flex flex-col select-none">
          {/* İlerleme çubukları */}
          <div className="flex gap-1 px-3 pt-3">
            {items.map((_, i) => (
              <div key={i} className="flex-1 h-[3px] rounded-full bg-white/25 overflow-hidden">
                <div className="h-full bg-white" style={{ width: i < open ? '100%' : i === open ? `${progress * 100}%` : '0%' }} />
              </div>
            ))}
          </div>

          {/* Üst bar */}
          <div className="flex items-center justify-between px-4 py-3 relative z-10">
            <span className="text-[11px] font-black tracking-widest uppercase text-[#FFD100]">{active.category}</span>
            <button onClick={close} aria-label="Kapat" className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 text-white"><X size={20} /></button>
          </div>

          {/* Görsel + dokunma alanları */}
          <div className="relative flex-1 overflow-hidden">
            {active.imageUrl && <img src={active.imageUrl} alt={active.title} className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />
            {/* sol/sağ dokunma → önceki/sonraki */}
            <button aria-label="Önceki" onClick={() => go(open - 1)} className="absolute left-0 top-0 bottom-0 w-1/3" />
            <button aria-label="Sonraki" onClick={() => go(open + 1)} className="absolute right-0 top-0 bottom-0 w-1/3" />

            {/* İçerik */}
            <div className="absolute inset-x-0 bottom-0 p-5 pb-8">
              <h2 className="font-heading text-2xl font-black text-white leading-tight drop-shadow-lg line-clamp-3">{active.title}</h2>
              {active.excerpt && <p className="mt-2 text-sm text-white/80 leading-relaxed line-clamp-3">{active.excerpt}</p>}
              <Link href={`/haberler/${active.slug}`} onClick={close}
                className="inline-flex items-center gap-2 mt-4 bg-[#FFD100] text-[#0f4a28] font-black text-sm px-5 py-3 rounded-full shadow-lg">
                Habere Git <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
