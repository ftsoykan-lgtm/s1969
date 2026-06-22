import Link from 'next/link'
import { getSitePlayers } from '@/lib/supabase/players-server'
import SquadMarquee from './SquadMarquee'

export default async function SquadPreview() {
  const { players, season } = await getSitePlayers()

  return (
    <section className="py-16 md:py-20 bg-[#0f4a28]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="block w-1.5 h-10 bg-[#FFD100] rounded-full" />
            <div>
              <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#FFD100]/60 mb-0.5">
                Profesyonel Takım{season ? ` · ${season}` : ''}
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Takım <span className="text-[#FFD100]">Kadrosu</span>
              </h2>
            </div>
          </div>
          <Link href="/kadro"
            className="hidden sm:inline-flex text-sm font-bold text-[#0f4a28] bg-[#FFD100] rounded-xl px-5 py-2.5 hover:bg-[#e8c000] transition-colors shadow-md">
            Tüm Kadro →
          </Link>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-white font-bold">Kadro Güncelleniyor...</p>
            <p className="text-white/40 text-sm mt-1">Güncel sezon kadrosu yakında yayınlanacak.</p>
          </div>
        </div>
      ) : (
        <SquadMarquee players={players} />
      )}
    </section>
  )
}
