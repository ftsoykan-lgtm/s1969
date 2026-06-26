import Link from 'next/link'
import { getSeasonPlayers, getProfileSeasonsServer } from '@/lib/supabase/player-profiles-server'
import { getSitePlayers } from '@/lib/supabase/players-server'
import type { CardPlayer } from '@/components/players/PlayerCard'
import SquadMarquee from './SquadMarquee'

export default async function SquadPreview() {
  // Önce sezon bazlı profiller; yoksa eski TFF canlı kadrosuna düş
  const profileSeasons = await getProfileSeasonsServer()
  let players: CardPlayer[] = []
  let season: string | null = null

  if (profileSeasons.length > 0) {
    const res = await getSeasonPlayers(profileSeasons[0])
    players = res.players.map((p) => ({
      name: p.name, slug: p.slug, photoUrl: p.photoUrl, number: p.number, position: p.position, flagCode: p.flagCode,
    }))
    season = res.season
  } else {
    const res = await getSitePlayers()
    players = res.players
    season = res.season
  }

  return (
    <section className="relative py-16 md:py-20 bg-[#f5f9f6] overflow-hidden">
      {/* Hafif marka dokusu */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#1b5e44]/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-[#f5c400]/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-8 font-heading text-[12rem] font-black leading-none text-[#103f2e]/[0.03] select-none">11</div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="block w-1.5 h-11 bg-[#f5c400] rounded-full" />
            <div>
              <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#1b5e44] mb-1">
                Profesyonel Takım{season ? ` · ${season}` : ''}
              </p>
              <h2 className="font-heading text-3xl md:text-5xl font-black text-[#154836] tracking-tight">
                Takım <span className="text-[#1b5e44]">Kadrosu</span>
              </h2>
            </div>
          </div>
          <Link href="/kadro"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-black tracking-wide uppercase text-white bg-[#103f2e] hover:bg-[#1b5e44] rounded-full px-6 py-3 transition-colors shadow-md">
            Tüm Kadro →
          </Link>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#ddeae2] rounded-2xl p-10 text-center shadow-sm">
            <p className="text-[#154836] font-bold">Kadro Güncelleniyor...</p>
            <p className="text-[#7aab8e] text-sm mt-1">Güncel sezon kadrosu yakında yayınlanacak.</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <SquadMarquee players={players} />
        </div>
      )}
    </section>
  )
}
