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
    <section className="reveal relative py-20 md:py-24 bg-[#f5f9f6] overflow-hidden">
      {/* Hafif marka dokusu */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-ugreen/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 w-[420px] h-[420px] rounded-full bg-ugold/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-8 font-heading text-[12rem] font-extrabold leading-none text-ugreend/[0.03] select-none">11</div>

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 mb-3">
              <span className="block h-2.5 w-2.5 rounded-full bg-ugold" />
              <span className="text-[12px] font-extrabold tracking-[0.25em] uppercase text-ugold">Profesyonel Takım{season ? ` · ${season}` : ''}</span>
            </span>
            <h2 className="font-heading text-5xl md:text-7xl font-extrabold text-ugreenm tracking-[-0.03em] leading-[0.92]">
              TAKIM <span className="text-ugreen">KADROSU</span>
            </h2>
          </div>
          <Link href="/kadro"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-extrabold tracking-wide uppercase text-white bg-ugreen hover:bg-ugreend rounded-xl px-6 py-3.5 transition-colors shadow-[0_10px_24px_-10px_rgba(12,46,34,0.5)]">
            Tüm Kadro →
          </Link>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-[#ddeae2] rounded-2xl p-10 text-center shadow-sm">
            <p className="text-ugreenm font-bold">Kadro Güncelleniyor...</p>
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
