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
    <section className="relative u-sec bg-[#f5f9f6] overflow-hidden">
      {/* Hafif marka dokusu */}
      <div className="pointer-events-none absolute top-0 right-8 font-heading text-[12rem] font-extrabold leading-none text-[#0f4a28]/[0.03] select-none">11</div>

      <div className="relative u-wrap mb-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="u-eyebrow">Profesyonel Takım{season ? ` · ${season}` : ''}</span>
            <h2 className="u-h2 mt-2">Takım Kadrosu</h2>
          </div>
          <Link href="/kadro" className="hidden sm:inline-flex u-btn u-btn--solid">
            Tüm Kadro →
          </Link>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="relative u-wrap">
          <div className="bg-white border border-[#e2ece6] p-10 text-center">
            <p className="text-[#092d18] font-bold">Kadro Güncelleniyor...</p>
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
