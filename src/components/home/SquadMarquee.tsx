'use client'

import { useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PlayerCard from '@/components/players/PlayerCard'
import type { SitePlayer } from '@/lib/supabase/players-server'

const CARD_W = 320 + 24 // w-80 (320px) + gap (24px)
const SCROLL_STEP = CARD_W * 2 // 2 kart kaydır
const SCROLL_DURATION = 480 // ms — yavaş, pürüzsüz

function smoothScrollBy(el: HTMLElement, delta: number, duration: number) {
  const start = el.scrollLeft
  const end = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, start + delta))
  const startTime = performance.now()
  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    // ease-in-out cubic
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2
    el.scrollLeft = start + (end - start) * ease
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export default function SquadMarquee({ players }: { players: SitePlayer[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  // Sürükleme state
  const drag = useRef({ active: false, startX: 0, startScroll: 0 })

  const updateArrows = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  const scroll = (dir: 1 | -1) => {
    if (!ref.current) return
    smoothScrollBy(ref.current, dir * SCROLL_STEP, SCROLL_DURATION)
    setTimeout(updateArrows, SCROLL_DURATION + 20)
  }

  // Mouse sürükleme
  const onMouseDown = (e: React.MouseEvent) => {
    drag.current = { active: true, startX: e.pageX, startScroll: ref.current?.scrollLeft ?? 0 }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active || !ref.current) return
    e.preventDefault()
    ref.current.scrollLeft = drag.current.startScroll - (e.pageX - drag.current.startX)
    updateArrows()
  }
  const onMouseUp = () => { drag.current.active = false }

  // Touch sürükleme
  const onTouchStart = (e: React.TouchEvent) => {
    drag.current = { active: true, startX: e.touches[0].pageX, startScroll: ref.current?.scrollLeft ?? 0 }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!drag.current.active || !ref.current) return
    ref.current.scrollLeft = drag.current.startScroll - (e.touches[0].pageX - drag.current.startX)
    updateArrows()
  }

  if (!players.length) return null

  return (
    <div className="relative">
      {/* Sol ok */}
      <button
        onClick={() => scroll(-1)}
        disabled={!canLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-[#ddeae2] text-[#0f4a28] flex items-center justify-center shadow-md transition-all duration-200 hover:bg-[#FFD100] hover:border-[#FFD100] disabled:opacity-0 disabled:pointer-events-none"
        aria-label="Önceki"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Sağ ok */}
      <button
        onClick={() => scroll(1)}
        disabled={!canRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-[#ddeae2] text-[#0f4a28] flex items-center justify-center shadow-md transition-all duration-200 hover:bg-[#FFD100] hover:border-[#FFD100] disabled:opacity-0 disabled:pointer-events-none"
        aria-label="Sonraki"
      >
        <ChevronRight size={20} />
      </button>

      {/* Kenar gradyanları */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#f5f9f6] to-transparent z-[1]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#f5f9f6] to-transparent z-[1]" />

      {/* Kart listesi */}
      <div
        ref={ref}
        onScroll={updateArrows}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={() => { drag.current.active = false }}
        className="flex overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none px-14 gap-5 pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {players.map((p, i) => (
          <div key={i} className="w-72 sm:w-80 shrink-0">
            <PlayerCard player={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
