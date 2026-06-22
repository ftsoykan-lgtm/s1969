'use client'

import PlayerCard from '@/components/players/PlayerCard'
import type { SitePlayer } from '@/lib/supabase/players-server'

export default function SquadMarquee({ players }: { players: SitePlayer[] }) {
  if (!players.length) return null
  // Kesintisiz döngü için iki kez (aralık kart kutusunun içinde → dikiş tam hizalı)
  const loop = [...players, ...players]
  // Sakin, sabit hız: kart başına ~6 sn (tek kopya süresi)
  const duration = Math.max(30, players.length * 6)

  return (
    <div className="relative overflow-hidden"
      style={{ maskImage: 'linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)' }}>
      <div className="flex w-max squad-track"
        style={{ animationDuration: `${duration}s` }}>
        {loop.map((p, i) => (
          <div key={`${p.name}-${i}`} className="w-44 sm:w-52 shrink-0 pr-4">
            <PlayerCard player={p} />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .squad-track {
          animation-name: squadScroll;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .squad-track:hover { animation-play-state: paused; }
        @keyframes squadScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
