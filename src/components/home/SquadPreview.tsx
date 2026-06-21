import Link from 'next/link'
import { getSitePlayers } from '@/lib/supabase/players-server'
import PlayerCard from '@/components/players/PlayerCard'

export default async function SquadPreview() {
  const { players, season } = await getSitePlayers()
  const featured = players.slice(0, 5)

  return (
    <section className="py-16 bg-[#0f4a28]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="block w-6 h-0.5 bg-[#FFD100]" />
              <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">
                Profesyonel Takım{season ? ` · ${season}` : ''}
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Takım <span className="text-[#FFD100]">Kadrosu</span>
            </h2>
          </div>
          <Link href="/kadro"
            className="hidden sm:inline-flex text-sm font-bold text-[#0f4a28] bg-[#FFD100] rounded-xl px-4 py-2 hover:bg-[#d4ad00] transition-colors shadow-md">
            Tüm Kadro →
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-white font-bold">Kadro Güncelleniyor...</p>
            <p className="text-white/40 text-sm mt-1">Güncel sezon kadrosu yakında yayınlanacak.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {featured.map((p) => <PlayerCard key={p.name} player={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}
