'use client'

import PlayerCard from '@/components/players/PlayerCard'
import type { SitePlayer } from '@/lib/supabase/players-server'

export default function SquadMarquee({ players }: { players: SitePlayer[] }) {
  if (!players.length) return null
  // Kesintisiz döngü için iki kez
  const loop = [...players, ...players]
  const speed = Math.max(24, players.length * 4) // sn

  return (
    <div className="relative overflow-hidden group"
      style={{ maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)' }}>
      <div className="flex gap-4 w-max group-hover:[animation-play-state:paused]"
        style={{ animation: `squadScroll ${speed}s linear infinite` }}>
        {loop.map((p, i) => (
          <div key={`${p.name}-${i}`} className="w-44 sm:w-52 shrink-0">
            <PlayerCard player={p} />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes squadScroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>
    </div>
  )
}
