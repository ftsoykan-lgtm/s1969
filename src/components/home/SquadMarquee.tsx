'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PlayerCard, { type CardPlayer } from '@/components/players/PlayerCard'

export default function SquadMarquee({ players }: { players: CardPlayer[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const updateArrows = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => { updateArrows() }, [updateArrows, players.length])

  // Tam bir kart kadar kaydır (native smooth scroll → snap devralır)
  const scrollByCard = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('[data-card]')
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  if (!players.length) return null

  return (
    <div className="relative">
      {/* Sol ok */}
      <button onClick={() => scrollByCard(-1)} disabled={!canLeft} aria-label="Önceki"
        className="flex absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-[#ddeae2] text-[#103f2e] items-center justify-center shadow-md transition-all duration-200 hover:bg-[#f5c400] hover:border-[#f5c400] disabled:opacity-0 disabled:pointer-events-none">
        <ChevronLeft size={18} />
      </button>

      {/* Sağ ok */}
      <button onClick={() => scrollByCard(1)} disabled={!canRight} aria-label="Sonraki"
        className="flex absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white border border-[#ddeae2] text-[#103f2e] items-center justify-center shadow-md transition-all duration-200 hover:bg-[#f5c400] hover:border-[#f5c400] disabled:opacity-0 disabled:pointer-events-none">
        <ChevronRight size={18} />
      </button>

      {/* Kenar gradyanları (sadece masaüstü) */}
      <div className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-[#f5f9f6] to-transparent z-[1]" />
      <div className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-[#f5f9f6] to-transparent z-[1]" />

      {/* Kart listesi — native kaydırma + tek-kart snap */}
      <div
        ref={ref}
        onScroll={updateArrows}
        className="flex overflow-x-auto scrollbar-none scroll-smooth px-4 sm:px-14 gap-4 sm:gap-5 pb-2 snap-x snap-mandatory sm:snap-proximity"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {players.map((p, i) => (
          <div key={i} data-card className="w-[80vw] max-w-[300px] sm:w-72 lg:w-80 shrink-0 snap-center sm:snap-start">
            <PlayerCard player={p} />
          </div>
        ))}
      </div>
    </div>
  )
}
