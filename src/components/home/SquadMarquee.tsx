'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PlayerCard from '@/components/players/PlayerCard'
import type { SitePlayer } from '@/lib/supabase/players-server'

export default function SquadMarquee({ players }: { players: SitePlayer[] }) {
  const ref = useRef<HTMLDivElement>(null)
  if (!players.length) return null

  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * 420, behavior: 'smooth' })
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Kaydırma alanı (manuel — kendi kendine hareket etmez) */}
      <div ref={ref}
        className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {players.map((p) => (
          <div key={p.name} className="w-44 sm:w-52 shrink-0 snap-start">
            <PlayerCard player={p} />
          </div>
        ))}
      </div>

      {/* Oklar */}
      {players.length > 4 && (
        <>
          <button onClick={() => scroll(-1)} aria-label="Geri"
            className="hidden md:flex absolute left-1 top-[42%] -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white text-[#0f4a28] shadow-lg hover:bg-[#FFD100] transition-all z-10">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll(1)} aria-label="İleri"
            className="hidden md:flex absolute right-1 top-[42%] -translate-y-1/2 h-11 w-11 items-center justify-center rounded-full bg-white text-[#0f4a28] shadow-lg hover:bg-[#FFD100] transition-all z-10">
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  )
}
