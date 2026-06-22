'use client'

import PlayerCard from '@/components/players/PlayerCard'
import type { SitePlayer } from '@/lib/supabase/players-server'

export default function SquadMarquee({ players }: { players: SitePlayer[] }) {
  if (!players.length) return null

  // Az oyuncu varsa doldur
  let base = players
  while (base.length < 6) base = [...base, ...players]
  const loop = [...base, ...base]
  // Yavaş, sakin hız (kart başına ~10 sn)
  const duration = Math.max(50, base.length * 10)

  return (
    <div className="relative overflow-hidden">
      <div className="flex w-max squad-track" style={{ animationDuration: `${duration}s` }}>
        {loop.map((p, i) => (
          <div key={i} className="w-56 sm:w-64 shrink-0 pr-5">
            <PlayerCard player={p} />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#0f4a28] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#0f4a28] to-transparent" />

      <style jsx global>{`
        .squad-track {
          animation-name: squadScroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          backface-visibility: hidden;
        }
        .squad-track:hover { animation-play-state: paused; }
        @keyframes squadScroll {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  )
}
